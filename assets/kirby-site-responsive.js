/* Browser layout gate: measure every page before accepting a generated design. */
(function (root) {
    'use strict';
    const widths = [390, 430, 768, 1440];
    function inspect(doc) {
        const issues = [];
        const win = doc.defaultView;
        const visible = el => el.getClientRects().length && win.getComputedStyle(el).visibility !== 'hidden';
        for (const el of doc.querySelectorAll('.ks-copy,.ks-block,.ks-header')) {
            if (!visible(el)) continue;
            // Scrollable galleries are intentional; text and information panels are not.
            if (el.scrollWidth > el.clientWidth + 2) issues.push({ type: 'overflow', section: el.closest('[data-section-id]')?.id || 'navigation' });
        }
        for (const el of doc.querySelectorAll('th,td,.ks-items strong,.ks-items span,.ks-items p')) {
            if (!visible(el)) continue;
            const walker = doc.createTreeWalker(el, win.NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                for (const match of node.textContent.matchAll(/[\p{L}\p{N}]+/gu)) {
                    const range = doc.createRange(); range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
                    const lines = new Set([...range.getClientRects()].map(r => Math.round(r.top)));
                    if (lines.size > 1) issues.push({ type: 'broken-word', word: match[0], section: el.closest('[data-section-id]')?.id });
                }
            }
        }
        for (const el of doc.querySelectorAll('.ks-composition')) {
            const slots = [...el.children].filter(visible);
            if (slots.some(s => s.classList.contains('ks-placement-backdrop'))) continue;
            const box = el.getBoundingClientRect();
            const narrow = slots.some(s => s.querySelector('.ks-block,.ks-copy') && s.getBoundingClientRect().width < Math.min(250, box.width * .5));
            const occupied = slots.reduce((sum, s) => sum + s.getBoundingClientRect().width, 0);
            if (narrow && occupied < box.width * .7) issues.push({ type: 'empty-columns', section: el.closest('[data-section-id]')?.id });
        }
        return issues;
    }
    async function validate(site, project, media = {}) {
        const frame = document.createElement('iframe');
        frame.title = 'Validation responsive'; frame.setAttribute('aria-hidden', 'true'); frame.inert = true;
        frame.style.cssText = 'position:fixed;left:-20000px;top:0;height:1000px;border:0;opacity:0;pointer-events:none';
        const results = [];
        try {
            for (const page of site.pages) {
                frame.style.width = '1440px';
                const loaded = new Promise((resolve, reject) => {
                    const timer = setTimeout(() => reject(new Error('Validation responsive indisponible. Réessayez.')), 15000);
                    frame.onload = () => { clearTimeout(timer); resolve(); };
                });
                frame.srcdoc = `<!doctype html><html lang="${KirbySiteRenderer.esc(site.language)}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${new URL('assets/kirby-site.css?v=20260919-responsive', location.href).href}"><style>*,*::before,*::after{animation:none!important;transition:none!important}</style></head><body style="margin:0">${KirbySiteRenderer.render(site, page.id, project, media)}</body></html>`;
                if (!frame.isConnected) document.body.append(frame);
                await loaded;
                const doc = frame.contentDocument;
                if (![...doc.styleSheets].some(s => s.href?.includes('kirby-site.css'))) throw new Error('La feuille de style responsive n’a pas pu être chargée.');
                await doc.fonts.ready;
                for (const width of widths) {
                    frame.style.width = width + 'px';
                    // Synchronous layout flush also works when the tab is in the background.
                    void doc.documentElement.offsetWidth;
                    results.push({ page: page.id, width, issues: inspect(doc) });
                }
            }
        } finally { frame.remove(); }
        const failed = results.filter(r => r.issues.length);
        if (failed.length) {
            console.warn('[kirby-responsive]', failed);
            throw new Error(`La conception doit être corrigée avant affichage : problème de lisibilité à ${[...new Set(failed.map(r => r.width))].join(', ')} px.`);
        }
        return { widths: [...widths], results };
    }
    root.KirbySiteResponsive = { validate, inspect, widths };
}(globalThis));
