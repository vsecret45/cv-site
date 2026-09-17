/* Connect the existing preview and Contact. Never changes a generated site. */
(function () {
    'use strict';
    const params = new URLSearchParams(location.search);
    const plans = ['Essentiel', 'Pro', 'Signature'];
    const plan = plans.includes(params.get('formule')) ? params.get('formule') : '';
    const isSelection = id => /^selection-[a-f0-9]{64}$/.test(id || '');
    const previewUrl = id => new URL('site-preview.html?project=' + encodeURIComponent(id), location.href).href;
    async function load(id) {
        if (!isSelection(id)) throw new Error('Référence du projet sélectionné invalide.');
        const response = await fetch('/api/site-selection?id=' + encodeURIComponent(id));
        let data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Cette version est indisponible.');
        if (data.downloadUrl) {
            const stored = await fetch(data.downloadUrl);
            if (!stored.ok) throw new Error('Cette version est indisponible.');
            data = await stored.json();
        }
        KirbySiteContract.validate(data.state.site);
        if (data.id !== id) throw new Error('La référence de cette version ne correspond pas.');
        // Existing renderer and navigation use IndexedDB, including in a new browser.
        await KirbySiteStore.put(id, data.state);
        return data;
    }
    window.KirbySiteJourney = { load, isSelection };
    const output = document.getElementById('ai-brief-output');
    if (output && document.body.dataset.kirbySite === 'v1') {
        function attach() {
            const frame = output.querySelector('iframe.ks-preview');
            if (!frame || output.querySelector('[data-project-actions]')) return;
            const actions = document.createElement('div');
            actions.dataset.projectActions = '';
            actions.style.marginBottom = '1rem';
            actions.innerHTML = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:1rem"><button type="button" class="button button-primary" data-project-choose>Je choisis ce site</button></div><p data-project-status role="status"></p>';
            output.querySelector('.ks-chat-panel').prepend(actions);
            let working = false;
            const status = actions.querySelector('[data-project-status]');
            async function chooseSite() {
                if (working) return;
                if (output.getAttribute('aria-busy') === 'true' || output.dataset.siteMode !== 'ready') {
                    status.textContent = 'Attendez la fin de la préparation du site et de ses visuels.'; return;
                }
                working = true;
                actions.querySelectorAll('button').forEach(b => { b.disabled = true; });
                status.textContent = 'Conservation de cette version…';
                try {
                    const sourceProject = new URL(frame.src).searchParams.get('project');
                    const state = await KirbySiteStore.get(sourceProject);
                    if (!state?.site) throw new Error('La sauvegarde de ce site est introuvable.');
                    const body = JSON.stringify({ sourceProject, state });
                    const post = async payload => {
                        const response = await fetch('/api/site-selection', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload });
                        if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('La sauvegarde est temporairement indisponible. Réessayez.');
                        return { response, result: await response.json() };
                    };
                    let saved;
                    if (new Blob([body]).size > 3000000) {
                        const prepared = await post(JSON.stringify({ mode: 'prepare' }));
                        if (!prepared.response.ok) throw new Error(prepared.result.error || 'Impossible de préparer la sauvegarde.');
                        if (prepared.result.direct) saved = await post(body);
                        else {
                        const uploaded = await fetch(prepared.result.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
                        if (!uploaded.ok) throw new Error('La sauvegarde des visuels a échoué. Réessayez.');
                        saved = await post(JSON.stringify({ mode: 'complete', uploadId: prepared.result.uploadId }));
                        }
                    } else saved = await post(body);
                    const { response, result } = saved;
                    if (!response.ok || !isSelection(result.id)) throw new Error(result.error || 'Impossible de conserver cette version.');
                    const url = new URL('contact.html', location.href);
                    url.searchParams.set('selection', result.id);
                    if (plan) url.searchParams.set('formule', plan);
                    location.assign(url.href);
                } catch (error) { status.textContent = error.message; }
                finally { working = false; actions.querySelectorAll('button').forEach(b => { b.disabled = false; }); }
            }
            actions.querySelector('[data-project-choose]').addEventListener('click', chooseSite);
        }
        new MutationObserver(attach).observe(output, { childList: true });
        attach();
    }
    const form = document.getElementById('contact-form');
    if (form && params.has('selection')) {
        const field = form.querySelector('[name="project"]');
        const button = form.querySelector('[type="submit"]');
        const status = document.getElementById('contact-form-status');
        button.disabled = true;
        field.required = false; field.value = ''; field.rows = 2; field.style.minHeight = '5rem';
        field.previousElementSibling.textContent = 'Besoin complémentaire ?';
        field.placeholder = 'Domaine, WhatsApp, réservation ou autre précision…';
        field.nextElementSibling.textContent = 'Facultatif. Votre brief Kirby sera joint automatiquement.';
        status.textContent = 'Chargement du projet sélectionné…';
        window.KirbyProjectContact = load(params.get('selection')).then(snapshot => {
            const box = document.createElement('div');
            box.className = 'field';
            const title = document.createElement('strong'); title.textContent = 'Votre projet sélectionné';
            const name = document.createElement('span'); name.textContent = snapshot.state.site.name;
            const link = document.createElement('a'); link.textContent = 'Voir l’aperçu'; link.href = previewUrl(snapshot.id); link.target = '_blank'; link.rel = 'noopener';
            box.append(title, name, link);
            if (plan) { const label = document.createElement('span'); label.textContent = 'Formule envisagée : ' + plan; box.append(label); }
            form.prepend(box);
            button.disabled = false; status.textContent = '';
            return { id: snapshot.id, sourceProject: snapshot.sourceProject, siteId: snapshot.state.site.id, revision: snapshot.state.site.revision, name: snapshot.state.site.name, preview: link.href, brief: snapshot.state.conversation.filter(t => t.role === 'user').map(t => t.content).join('\n\n'), ...(plan ? { plan } : {}) };
        }).catch(() => {
            status.textContent = 'Cette version est introuvable. Revenez à Kirby et choisissez à nouveau votre site.';
            return null; // Never silently substitute the latest project or send an incomplete selection.
        });
    }
}());
