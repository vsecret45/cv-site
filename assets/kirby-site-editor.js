(function () {
    'use strict';
    const form = document.getElementById('ai-brief-form'); const input = document.getElementById('ai-brief-input'); const output = document.getElementById('ai-brief-output');
    if (!form || document.body.dataset.kirbySite !== 'v1') return;
    const C = KirbySiteContract, R = KirbySiteRenderer; const storageKey = 'kirby-site-project-v1';
    const pendingKey = 'kirby-site-pending-v1';
    const draftKey = 'kirby-site-failed-draft-v1';
    function rememberDraft(message) { try { writeLocal(draftKey, JSON.stringify({ project, message })); } catch (_) {} }
    function draft() { try { const value = JSON.parse(readLocal(draftKey)); return value?.project === project && typeof value.message === 'string' ? value.message : ''; } catch (_) { return ''; } }
    function clearDraft() { try { writeLocal(draftKey, null); } catch (_) {} }
    const readLocal = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
    const writeLocal = (key, value) => { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); };
    let project = readLocal(storageKey) || crypto.randomUUID();
    let state = { site: null, conversation: [], history: [], media: {} }; let busy = false; let serial = 0;
    let selection = { pageId: '', sectionId: '', blockId: '', actionId: '' };
    let saving = Promise.resolve(); const mediaJobs = new Map(); const mediaErrors = new Set(); let loadingStarted = 0; let loadingTimer;
    const logTime = (stage, start, extra = {}) => console.info('[kirby-perf]', { stage, ms: Math.round(performance.now() - start), ...extra });
    const persist = () => {
        if (state.site) C.validate(state.site);
        state.pageId = selection.pageId;
        const t = performance.now(); const snapshot = structuredClone(state); const key = project;
        logTime('snapshot', t);
        saving = saving.catch(() => {}).then(async () => { const started = performance.now(); await KirbySiteStore.put(key, snapshot); logTime('save_indexeddb', started); });
        return saving;
    };
    function clearPending() { try { writeLocal(pendingKey, null); } catch (_) {} }
    const MEDIA_CONCURRENCY = 6;
    const mediaQueue = []; let activeMedia = 0; let generationRun;
    const mediaKey = (asset, design) => R.signature(asset) + JSON.stringify(design);
    function fetchMedia(asset, design) {
        const key = mediaKey(asset, design);
        if (!mediaJobs.has(key)) {
            const job = new Promise((resolve, reject) => { mediaQueue.push({ asset, design, resolve, reject, queued: performance.now(), run: generationRun }); });
            // Keep failures for this batch: speculative preparation must not silently retry.
            mediaJobs.set(key, job); job.catch(() => {});
            pumpMedia();
        }
        return mediaJobs.get(key);
    }
    function pumpMedia() {
        while (activeMedia < MEDIA_CONCURRENCY && mediaQueue.length) {
            const job = mediaQueue.shift(); activeMedia++;
            const started = performance.now();
            if (job.run && job.run.batchStarted === undefined) job.run.batchStarted = started;
            const meta = { runId: job.run?.runId, assetId: job.asset.id, attempt: 1 };
            logTime('image_queue', job.queued, { ...meta, active: activeMedia, limit: MEDIA_CONCURRENCY });
            console.info('[kirby-perf]', { stage: 'image_start', ...meta, at: Date.now() });
            request({ mode: 'media', asset: job.asset, design: job.design, runId: job.run?.runId }).then(result => { logTime('image_complete', started, { ...meta, ok: Boolean(result.media), timings: result.timings }); job.resolve(result); }, error => { logTime('image_complete', started, { ...meta, ok: false }); job.reject(error); }).finally(() => { activeMedia--; pumpMedia(); });
        }
    }
    function prewarm(plan) {
        // Only the first wave is speculative; never apply unreviewed site content.
        plan.assets.filter(a => state.media[a.id]?.signature !== R.signature(a)).slice(0, MEDIA_CONCURRENCY).forEach(a => fetchMedia(a, plan.design).catch(() => {}));
    }
    const status = text => { output.querySelectorAll('[data-site-status]').forEach(el => el.textContent = text); };
    function pageAssets() {
        const ids = new Set();
        selectedPage()?.sections.forEach(s => { [s.slots.primaryMediaId, s.slots.secondaryMediaId, s.slots.tertiaryMediaId, ...s.blocks.map(b => b.assetId)].filter(Boolean).forEach(id => ids.add(id)); });
        return state.site?.assets.filter(a => ids.has(a.id)) || [];
    }
    function syncPresentation() {
        const missing = (state.site?.assets || []).filter(a => state.media[a.id]?.signature !== R.signature(a));
        const waiting = busy || missing.some(a => !mediaErrors.has(a.id));
        output.dataset.siteMediaError = String(!busy && missing.some(a => mediaErrors.has(a.id)));
        const heading = output.querySelector('[data-site-loader] h3'); if (heading) heading.textContent = output.dataset.siteMediaError === 'true' ? 'Visuels à relancer' : busy ? 'Génération du site…' : 'Création des visuels…';
        output.dataset.siteMode = waiting ? (state.site ? 'progressive' : 'loading') : 'ready';
        output.classList.toggle('is-loading', waiting);
        output.closest('.ai-brief-panel')?.classList.toggle('has-proposal', Boolean(state.site));
        const loader = output.querySelector('[data-site-loader]'); if (loader) loader.hidden = !waiting && !missing.some(a => mediaErrors.has(a.id));
        const retry = output.querySelector('[data-site-retry]'); if (retry) retry.hidden = busy || !missing.some(a => mediaErrors.has(a.id));
        if (waiting && !loadingTimer) {
            loadingStarted = Date.now();
            loadingTimer = setInterval(() => { const seconds = Math.floor((Date.now() - loadingStarted) / 1000); const el = output.querySelector('[data-site-elapsed]'); if (el) el.textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0'); }, 1000);
        }
        if (!waiting && loadingTimer) { clearInterval(loadingTimer); loadingTimer = null; }
    }
    function setBusy(value) { busy = value; const launch = form.querySelector('button[type=submit]'); launch.disabled = value; launch.textContent = value ? 'Kirby travaille…' : 'Lancer une proposition'; output.setAttribute('aria-busy', String(value)); output.querySelectorAll('[data-site-mutation]').forEach(el => el.disabled = value); syncPresentation(); }
    function selectedPage() { return state.site?.pages.find(p => p.id === selection.pageId) || state.site?.pages.find(p => p.role === 'home'); }
    function render() {
        const renderStarted = performance.now();
        output.classList.remove('is-error', 'is-loading'); output.classList.add('ks-editor'); output.closest('.ai-brief-panel')?.classList.toggle('has-proposal', Boolean(state.site));
        output.dataset.siteActive = String(Boolean(state.site || state.conversation.length));
        const page = selectedPage(); if (page) selection.pageId = page.id;
        form.hidden = Boolean(state.site);
        output.innerHTML = `<div data-site-loader class="kirby-generation-stage" hidden><div class="kirby-generation-overlay"><div class="kirby-loader-ring" aria-hidden="true"></div><h3>${state.site ? 'Préparation du site…' : 'Génération du site…'}</h3><p data-site-status role="status">Kirby prépare votre site…</p><div class="kirby-loading-progress" aria-hidden="true"><i></i></div><time data-site-elapsed>00:00</time><button type="button" class="button button-primary" data-site-retry hidden>Réessayer les visuels</button></div></div>${state.site ? `<iframe class="ks-preview" scrolling="no" title="Site généré" src="${R.esc(R.url(project, page))}"></iframe>` : ''}<div class="ks-chat-panel"><div class="ks-editor-status" data-site-status role="status"></div>${state.conversation.at(-1)?.role === 'assistant' ? `<p class="ks-reply" role="status">${R.esc(state.conversation.at(-1).content)}</p>` : ''}${state.site || state.conversation.length ? '<form class="ks-revision"><label for="ks-revision-text">Demander une modification</label><textarea id="ks-revision-text" rows="3" placeholder="Décrivez ce que vous souhaitez changer"></textarea><button class="button button-primary" data-site-mutation type="submit">Envoyer</button></form>' : ''}</div>`;
        output.querySelector('[data-site-retry]')?.addEventListener('click', () => { if (!busy) generateMedia(serial); });
        output.querySelector('.ks-revision')?.addEventListener('submit', event => { event.preventDefault(); submit(output.querySelector('#ks-revision-text').value); });
        const retryInput = output.querySelector('#ks-revision-text'); if (retryInput) retryInput.value = draft(); else if (draft()) input.value = draft();
        setBusy(busy); logTime('editor_render', renderStarted);
    }
    async function request(payload, onPlan) {
        const started = performance.now();
        const response = await fetch('/api/kirby-site', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: onPlan ? 'application/x-ndjson' : 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(270000) });
        if ((response.headers.get('content-type') || '').includes('application/x-ndjson')) {
            const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = '', result, bytes = 0;
            function consume(line) {
                if (!line.trim()) return;
                const event = JSON.parse(line);
                if (event.type === 'media_plan') onPlan?.(event.data);
                if (event.type === 'result') result = event.data;
                if (event.type === 'error') throw new Error(event.data.message);
            }
            try {
                while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 4000000) throw new Error('Réponse trop volumineuse'); buffer += decoder.decode(value, { stream: true }); let end; while ((end = buffer.indexOf('\n')) >= 0) { consume(buffer.slice(0, end)); buffer = buffer.slice(end + 1); } }
                buffer += decoder.decode(); consume(buffer);
            } finally { await reader.cancel().catch(() => {}); }
            if (!result?.ok) throw new Error('La génération a été interrompue. Votre site est conservé.');
            logTime('site_request', started, { timings: result.timings, modelCalls: result.modelCalls }); return result;
        }
        if (!(response.headers.get('content-type') || '').includes('application/json')) {
            throw new Error([404, 405].includes(response.status) ? 'Le serveur ne connaît pas encore la nouvelle API du Générateur. Redémarrez le serveur local.' : 'Le serveur a renvoyé une réponse inattendue. Réessayez après son redémarrage.');
        }
        const data = await response.json(); logTime(payload.mode === 'media' ? 'image_request' : 'site_request', started, { timings: data.timings, modelCalls: data.modelCalls }); if (!response.ok || !data.ok) throw new Error(data.message || data.error || 'Demande indisponible'); return data;
    }
    async function submit(message) {
        message = message.trim(); if (!message || busy) return;
        rememberDraft(message);
        const generationStarted = performance.now();
        generationRun = { runId: crypto.randomUUID(), started: generationStarted };
        const originalProject = project; const id = ++serial; const base = state.site; const conversation = C.clone(state.conversation);
        state.conversation.push({ role: 'user', content: message }); const rollback = C.clone(state); render(); setBusy(true); output.scrollIntoView({ behavior: 'smooth', block: 'start' }); status('Kirby conçoit la réponse à partir de votre projet…');
        try {
            // Commit the previous valid state before recording an in-flight request.
            await persist();
            writeLocal(storageKey, project);
            writeLocal(pendingKey, JSON.stringify({ project, startedAt: Date.now() }));
            const result = await request({ protocol: C.protocol, message, site: base, conversation, selection, requestMode: state.newProjectConversation ? 'create' : 'auto', creationConversation: state.newProjectConversation || [], runId: generationRun.runId }, prewarm);
            if (id !== serial || state.site !== base) return;
            const validateStarted = performance.now(); const next = C.apply(base, result.decision); logTime('client_validate_apply', validateStarted);
            if (next && next !== base) {
                status('Vérification du rendu mobile, tablette et desktop…');
                await KirbySiteResponsive.validate(next, project, state.media);
                if (id !== serial || state.site !== base) return;
            }
            if (result.decision.kind === 'create' && base) {
                // A new test replaces the active slot, including its history and media.
                state = { site: null, media: {}, history: [], conversation: [{ role: 'user', content: message }] };
                selection = { pageId: '', sectionId: '', blockId: '', actionId: '' };
            }
            if (result.requestScope === 'create' && result.decision.kind === 'clarify' && base) {
                state.newProjectConversation = [...(state.newProjectConversation || []), { role: 'user', content: message }, { role: 'assistant', content: result.decision.message }];
            } else { delete state.newProjectConversation; }
            if (next !== base) { if (base && result.decision.kind !== 'create') state.history.push(C.clone(base)); state.history = state.history.slice(-20); state.site = next; }
            state.conversation.push({ role: 'assistant', content: result.decision.message });
            await persist(); if (project !== originalProject) writeLocal(storageKey, project); clearPending(); clearDraft(); render(); logTime('validated_structure_ready', generationStarted);
            if (next !== base) generateMedia(id, generationRun);
            else logTime('generation_total', generationStarted, { runId: generationRun.runId, ok: true, images: 0 });
        } catch (error) { logTime('generation_total', generationStarted, { runId: generationRun.runId, ok: false, phase: 'decision_or_save' }); project = originalProject; clearPending(); state = rollback; state.conversation.push({ role: 'assistant', content: 'La dernière demande n’a pas été appliquée à cause d’une erreur technique. Le site est inchangé.' }); render(); status(error.message + ' Aucun changement appliqué.'); }
        finally { if (id === serial) { setBusy(false);  } }
    }
    async function generateMedia(id, run = { runId: crypto.randomUUID(), started: performance.now(), restored: true }) {
        const site = state.site; if (!site) return;
        generationRun = run;
        const visibleIds = new Set(pageAssets().map(a => a.id));
        const pending = site.assets.filter(a => state.media[a.id]?.signature !== R.signature(a)).sort((a, b) => Number(visibleIds.has(b.id)) - Number(visibleIds.has(a.id))); let cursor = 0; let failed = 0; let done = 0;
        if (!pending.length) { syncPresentation(); if (!run.restored) logTime('generation_total', run.started, { runId: run.runId, ok: true, images: 0 }); return; }
        const mediaStarted = performance.now();
        pending.forEach(a => mediaErrors.delete(a.id)); syncPresentation();
        status('Création des visuels de votre site…');
        const worker = async () => {
            while (cursor < pending.length && id === serial) {
                const asset = pending[cursor++]; const expected = R.signature(asset);
                try {
                    const result = await fetchMedia(asset, site.design);
                    const current = state.site?.assets.find(a => a.id === asset.id);
                    if (id !== serial || !current || R.signature(current) !== expected) continue;
                    if (!result.media) { failed++; mediaErrors.add(asset.id); continue; }
                    state.media[asset.id] = result.media; await persist();
                    output.querySelector('iframe')?.contentWindow.postMessage({ type: 'kirby-site-media', project, assetId: asset.id, media: result.media }, location.origin);
                } catch (_) { failed++; mediaErrors.add(asset.id); }
                finally { done++; if (id === serial) { syncPresentation(); status(`Préparation des visuels · ${done}/${pending.length}`); } }
            }
        };
        await Promise.all(Array.from({ length: Math.min(MEDIA_CONCURRENCY, pending.length) }, () => worker()));
        logTime('media_complete', mediaStarted, { count: pending.length, failed });
        logTime('image_batch', run.batchStarted ?? mediaStarted, { runId: run.runId, count: pending.length, failed, limit: MEDIA_CONCURRENCY });
        logTime('generation_total', run.started, { runId: run.runId, ok: failed === 0 && id === serial, images: pending.length, failed, restored: Boolean(run.restored) });
        if (id === serial) { syncPresentation(); mediaJobs.clear(); }
        if (id === serial) status(failed ? 'Certains visuels n’ont pas pu être créés. Votre site est conservé ; vous pouvez réessayer.' : '');
    }
    window.addEventListener('message', event => {
        if (event.origin !== location.origin || event.source !== output.querySelector('iframe')?.contentWindow || event.data?.source !== 'kirby-site-preview' || event.data.project !== project) return;
        const data = event.data;
        const frame = output.querySelector('iframe');
        if (data.type === 'size' && Number.isFinite(data.height) && data.height > 0 && data.height < 1000000) { const css = getComputedStyle(frame); const borders = parseFloat(css.borderTopWidth) + parseFloat(css.borderBottomWidth); frame.style.height = (Math.ceil(data.height) + borders) + 'px'; return; }
        if (data.type === 'anchor' && Number.isFinite(data.top)) { window.scrollTo({ top: window.scrollY + frame.getBoundingClientRect().top + Math.max(0, data.top), behavior: 'smooth' }); return; }
        if (data.type === 'page' && selection.pageId !== data.pageId) {
            selection = { pageId: data.pageId, sectionId: '', blockId: '', actionId: '' };
            persist().catch(() => status('La page consultée n’a pas pu être mémorisée. Votre site reste affiché.'));
            frame.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
        if (data.type === 'selection') selection = { pageId: data.pageId, sectionId: data.sectionId, blockId: data.blockId, actionId: data.actionId, productId: data.productId || '' };
        syncPresentation();
    });
    window.addEventListener('resize', () => output.querySelector('iframe')?.contentWindow.postMessage({ type: 'kirby-site-viewport', project, height: window.innerHeight }, location.origin));
    form.addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
    async function restore() {
        // Render a usable shell before any asynchronous storage access.
        render(); setBusy(true); status('Restauration du projet…');
        try {
            const saved = await KirbySiteStore.restore(project);
            if (saved?.site) {
                state = saved;
                selection.pageId = state.site.pages.some(p => p.id === saved.pageId) ? saved.pageId : '';
            }
            render();
            let interrupted = false;
            try { interrupted = JSON.parse(readLocal(pendingKey) || 'null')?.project === project; } catch (_) {}
            if (interrupted) {
                clearPending();
                state.conversation.push({ role: 'assistant', content: state.site ? 'La demande en cours a été interrompue par la fermeture. Le dernier site sauvegardé est restauré ; vous pouvez redemander la modification.' : 'La génération a été interrompue par la fermeture. Vous pouvez relancer votre demande.' });
                render();
            }
            if (state.site) generateMedia(serial);
        } catch (_) {
            state = { site: null, conversation: [], history: [], media: {} };
            render(); output.dataset.siteActive = 'true';
            status('Le projet actif n’a pas pu être récupéré. Vous pouvez créer un site. Aucune sauvegarde existante n’a été effacée.');
        } finally { setBusy(false); }
    }
    restore();
}());
