const test = require('node:test');
const assert = require('node:assert/strict');
const contract = require('../../assets/kirby-cv-contract');
const { generate, prepareRequest } = require('../../lib/cv-model');

const action = (overrides = {}) => ({
    action: 'edit', message: 'Modification préparée.', documentLanguage: 'fr', operations: [],
    layout: { reflow: false, compact: null, sectionOrder: [] }, letter: { subject: '', body: '' }, ...overrides,
});
const operation = (field, value) => ({ field, encoding: 'text', text: value, items: [], entries: [] });
const response = (result, finish_reason = 'stop') => ({ ok: true, json: async () => ({ choices: [{ finish_reason, message: { content: JSON.stringify(result) } }] }) });
const options = (fetchImpl) => ({ apiKeys: ['test-credential'], models: ['configured-model'], controls: () => ({}), fetchImpl });

test('targeted edit preserves every other field byte for byte, for arbitrary vocabulary', () => {
    const cv = contract.state({ headline: 'Palynologue / collections', activities: '/\nHerbiers\n/ Pratiques', education: 'D.U. — 2018\nC.Q.P. — 2016' });
    const result = action({ operations: [operation('activities', 'Herbiers')] });
    const plan = contract.plan(result, cv);
    assert.deepEqual(plan.changedFields, ['activities']);
    for (const field of contract.fields.filter((field) => field !== 'activities')) assert.equal(plan.after[field], cv[field]);
});

test('structured entries preserve unknown titles, missing dates and delimiter characters', () => {
    const entry = { title: 'A | B • C %7C', organization: 'Atelier — Est', period: '', details: ['20% de suivi | protocole • mesure'] };
    assert.deepEqual(contract.parseEntry(contract.serializeEntry(entry)), { title: entry.title, meta: entry.organization, date: '', bullets: entry.details });
});

test('two qualifications remain two independently dated records', () => {
    const entries = [
        { title: 'Qualification inconnue α', organization: 'Institut Delta', period: '2018', details: [] },
        { title: 'Titre professionnel β', organization: 'Atelier Epsilon', period: '2016', details: ['Option matériaux'] },
    ];
    const result = action({ action: 'replace_document', operations: [{ field: 'education', encoding: 'entries', text: '', items: [], entries }] });
    const after = contract.plan(result, {}).after;
    assert.deepEqual(after.education.split('\n').map(contract.parseEntry).map((entry) => entry.date), ['2018', '2016']);
});

test('replacement clears old facts without merging an old parser result', () => {
    const result = action({ action: 'replace_document', operations: [operation('fullName', 'Personne Nouvelle')] });
    const plan = contract.plan(result, { fullName: 'Autre', activities: 'Débris locaux', experience: 'Ancien document' });
    assert.equal(plan.after.activities, '');
    assert.equal(plan.after.experience, '');
});

for (const [name, invalid] of [
    ['unknown field', action({ operations: [operation('__proto__', 'x')] })],
    ['duplicate field', action({ operations: [operation('skills', 'a'), operation('skills', 'b')] })],
    ['partial section order', action({ layout: { reflow: false, compact: null, sectionOrder: ['education'] } })],
    ['answer with mutation', action({ action: 'answer', operations: [operation('headline', 'x')] })],
    ['clarification with layout mutation', action({ action: 'clarify', layout: { reflow: true, compact: null, sectionOrder: [] } })],
    ['empty replacement', action({ action: 'replace_document' })],
    ['wrong encoding', action({ operations: [{ ...operation('phone', ''), encoding: 'items', items: ['123'] }] })],
]) test(`transaction rejects ${name} atomically`, () => {
    const cv = { headline: 'Original' };
    assert.throws(() => contract.plan(invalid, cv));
    assert.deepEqual(cv, { headline: 'Original' });
});

test('large documents are rejected, never silently truncated', () => {
    assert.throws(() => prepareRequest({ documentText: 'x'.repeat(120001) }));
    assert.throws(() => prepareRequest({ cv: { experience: 'x'.repeat(120001) } }));
});

test('full document, presentation and conversation reach the model with strict schema', async () => {
    const cv = contract.state({ fullName: 'Test', skills: 'Terme inédit' });
    let body;
    const result = await generate({ cv, instruction: 'Ça manque de précision', presentation: { sectionOrder: ['education'], visibleText: 'Test' }, conversation: [{ role: 'user', content: 'On parle des compétences' }] }, options(async (_, request) => {
        body = JSON.parse(request.body);
        return response(action({ operations: [operation('skills', 'Terme inédit précisé')] }));
    }));
    assert.equal(body.response_format.json_schema.strict, true);
    assert.equal(body.model, 'configured-model');
    const sent = JSON.parse(body.messages[1].content);
    assert.deepEqual(sent.cv, cv);
    assert.equal(sent.presentation.visibleText, 'Test');
    assert.equal(sent.conversation.length, 1);
    assert.deepEqual(result.changedFields, ['skills']);
    assert.equal(result.protocol, contract.protocol);
});

test('API failure never returns a locally manufactured success', async () => {
    await assert.rejects(generate({ instruction: 'Construis mon CV' }, options(async () => ({ ok: false, status: 503 }))), /openai_cv_request_failed/);
});

test('refusal and incomplete responses do not mutate a document', async () => {
    await assert.rejects(generate({ instruction: 'x' }, options(async () => response(action(), 'length'))), /incomplete_openai_cv_response/);
    await assert.rejects(generate({ instruction: 'x' }, options(async () => ({ ok: true, json: async () => ({ choices: [{ message: { refusal: 'Refus' } }] }) }))), /openai_cv_refusal/);
});

test('malformed action is repaired by the model, not by intent regexes', async () => {
    let calls = 0;
    const result = await generate({ instruction: 'Mon activité est la céramique' }, options(async () => response(++calls === 1
        ? action({ operations: [operation('unknown', 'x')] })
        : action({ operations: [operation('activities', 'Céramique')] }))));
    assert.equal(calls, 2);
    assert.deepEqual(result.changedFields, ['activities']);
});

test('the dedicated HTTP pipeline bypasses the legacy semantic filters for the model protocol', async () => {
    const { EventEmitter } = require('node:events');
    const handler = require('../../api/kirby');
    const previousFetch = global.fetch;
    const previousKey = process.env.KIRBY_CV_OPENAI_API_KEY;
    const cv = contract.state({ activities: 'Lecture', education: 'Titre inconnu | Institut | 2018' });
    const request = new EventEmitter();
    request.method = 'POST'; request.headers = {}; request.kirbyService = 'cv'; request.destroy = () => {};
    let output;
    const reply = { setHeader() {}, end(body) { output = JSON.parse(body); } };
    try {
        process.env.KIRBY_CV_OPENAI_API_KEY = 'sk-synthetic-test-not-a-real-key';
        global.fetch = async () => response(action({ operations: [operation('activities', 'Reliure artisanale')] }));
        const running = handler(request, reply);
        request.emit('data', JSON.stringify({ protocol: contract.protocol, cv, instruction: 'Cela se passe plutôt dans un atelier de reliure, pour la partie hors travail.' }));
        request.emit('end');
        await running;
        assert.equal(reply.statusCode, 200);
        assert.equal(output.protocol, contract.protocol);
        assert.deepEqual(output.changedFields, ['activities']);
        assert.equal(output.cv.modelAction.operations[0].text, 'Reliure artisanale');
        assert.deepEqual(output.base, cv);
    } finally {
        global.fetch = previousFetch;
        if (previousKey === undefined) delete process.env.KIRBY_CV_OPENAI_API_KEY;
        else process.env.KIRBY_CV_OPENAI_API_KEY = previousKey;
    }
});
