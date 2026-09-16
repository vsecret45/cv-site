// Evaluate in an isolated browser on cv.html, with window.__cvModelFixtures
// set to the synthetic results from tests/live/kirby-cv-model.cjs.
(async () => {
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    const report = window.__cvModelFixtures;
    const contract = window.KirbyCvContract;
    assert(contract, 'Model contract did not load');
    currentUser = { id: 'kirby-model-browser-test', name: 'Test', email: 'synthetic@example.test' };
    supabaseClientPromise = Promise.resolve({ auth: { getSession: async () => ({ data: { session: { access_token: 'synthetic-test-only' } }, error: null }) } });
    updateAuthUi();
    refreshCvModule();
    supersedePendingCvDraftLoad();
    openBlankCvSheet({ persist: false });
    const styleBefore = JSON.stringify(getCurrentCvStyleValues());
    const passed = [];
    for (const fixture of report.imports) {
        await applyKirbyModelResult(fixture.result, { snapshot: getKirbyCvSnapshot(), imported: true });
        assert(JSON.stringify(contract.state(getKirbyCvSource({ includeDisplayedValues: true }))) === JSON.stringify(fixture.fields), 'Rendered fields changed: ' + fixture.id);
        const exported = getCvExportData();
        assert(exported.education.length === 2, 'Education merged during export: ' + fixture.id);
        assert(exported.education.every((entry) => entry.title && entry.date), 'Qualification/date association lost');
        assert(JSON.stringify(getCurrentCvStyleValues()) === styleBefore, 'Import changed style');
        passed.push('render/export ' + fixture.id);
    }
    await applyKirbyModelResult(report.imports[0].result, { snapshot: getKirbyCvSnapshot(), imported: true });
    const baseSnapshot = getKirbyCvSnapshot();
    const beforeEdit = getKirbyCvSource({ includeDisplayedValues: true });
    const nativeFetch = window.fetch;
    let requests = 0;
    window.fetch = async (url, options) => {
        if (url !== '/api/kirby-cv') return nativeFetch(url, options);
        requests += 1;
        const body = JSON.parse(options.body);
        assert(body.protocol === contract.protocol, 'Missing model protocol');
        assert(body.presentation.visibleText, 'Missing displayed document context');
        assert(JSON.stringify(contract.state(body.cv)) === JSON.stringify(contract.state(beforeEdit)), 'Wrong current document sent');
        return new Response(JSON.stringify(report.edits[0].result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };
    await handleAssistantPrompt('Dans ce que je fais en dehors du travail, remplace la natation par la gravure sur bois. Garde tout le reste tel quel.');
    window.fetch = nativeFetch;
    assert(requests === 1, 'Prompt bypassed the model');
    assert(cvForm.elements.activities.value === report.edits[0].fields.activities, 'Model edit not applied');
    const afterEdit = getKirbyCvSource({ includeDisplayedValues: true });
    for (const field of contract.fields.filter((field) => field !== 'activities')) assert(beforeEdit[field] === afterEdit[field], 'Unrelated field changed: ' + field);
    passed.push('chat routing and targeted edit');
    restorePreviousCvVersion();
    assert(getKirbyCvSnapshot() === baseSnapshot, 'Undo did not restore exact document and presentation');
    passed.push('undo exact state');
    const staleSnapshot = getKirbyCvSnapshot();
    cvForm.elements.phone.value = 'manual change during request';
    let staleRejected = false;
    try { await applyKirbyModelResult(report.edits[0].result, { snapshot: staleSnapshot }); } catch (_) { staleRejected = true; }
    assert(staleRejected && cvForm.elements.phone.value === 'manual change during request', 'Stale response overwrote manual edit');
    passed.push('stale response preserves manual edit');
    cvForm.elements.phone.value = beforeEdit.phone;
    const saved = buildCvDraftPayload();
    window.__savedModelDraft = saved;
    openBlankCvSheet({ persist: false });
    assert(restoreCvPayloadToEditor(saved), 'Draft restoration failed');
    assert(hasModelCvContent(), 'Model ownership lost on draft restoration');
    assert(cvForm.elements.education.value === beforeEdit.education, 'Draft restoration changed qualifications');
    assert(getCvExportData().education.length === 2, 'Draft restoration merged qualifications');
    const exportPayload = buildCvRoundTripPayload();
    assert(exportPayload.contentMigrations.includes(contract.protocol), 'Round-trip marker lost model ownership');
    passed.push('draft and export round-trip');
    assert(!previewNodes.preview.innerText.includes('CENTRES D’INTÉRÊT\n/'), 'Heading debris in activities');
    assert(previewNodes.preview.getBoundingClientRect().width > 0, 'CV is not visible');
    return { passed, education: getCvExportData().education, activities: cvForm.elements.activities.value, status: 'passed' };
})()
