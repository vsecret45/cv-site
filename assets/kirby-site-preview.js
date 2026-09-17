(async function () {
    'use strict';
    const params = new URLSearchParams(location.search); const project = params.get('project');
    const root = document.getElementById('site-root'); let current;
    const embedded = parent !== window; let lastHeight = 0;
    function viewport(height) { if (embedded && Number.isFinite(height) && height > 0) document.documentElement.style.setProperty('--ks-vh', (height / 100) + 'px'); }
    if (embedded) { document.documentElement.classList.add('ks-embedded-preview'); viewport(parent.innerHeight); }
    function reportSize() {
        if (!embedded) return;
        const height = Math.ceil(root.getBoundingClientRect().height);
        if (height !== lastHeight && height > 0) { lastHeight = height; tell({ type: 'size', height }); }
    }
    function followAnchor() {
        if (!location.hash) return;
        const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (!el) return;
        if (embedded) { window.scrollTo(0, 0); reportSize(); tell({ type: 'anchor', top: el.getBoundingClientRect().top }); }
        else el.scrollIntoView();
    }
    if (!embedded) {
        const exit = document.createElement('a');
        exit.className = 'ks-preview-exit';
        exit.href = 'index.html#kirby-assistant';
        exit.textContent = '× Retour à Kirby';
        exit.setAttribute('aria-label', 'Fermer l’aperçu et revenir à Kirby');
        exit.addEventListener('click', event => {
            // Script-opened tabs can close; direct visits always retain a working return link.
            event.preventDefault(); window.close(); setTimeout(() => location.assign(exit.href), 150);
        });
        document.body.append(exit);
    }
    const tell = payload => { if (parent !== window) parent.postMessage({ source: 'kirby-site-preview', project, ...payload }, location.origin); };
    async function load() {
        const started = performance.now();
        const state = KirbySiteJourney.isSelection(project)
            ? (await KirbySiteJourney.load(project)).state
            : await KirbySiteStore.get(project);
        if (!state?.site) throw new Error('Ce projet est disponible uniquement dans le navigateur où il a été créé.');
        const checked = performance.now(); KirbySiteContract.validate(state.site);
        console.info('[kirby-perf]', { stage: 'preview_validation', ms: performance.now() - checked });
        const path = params.get('page') || '/';
        const page = state.site.pages.find(p => p.path === path);
        if (!page) throw new Error('Cette page n’existe plus dans le projet.');
        current = { state, page }; document.title = page.title + ' · ' + state.site.name; document.documentElement.lang = state.site.language;
        const renderStarted = performance.now();
        root.innerHTML = KirbySiteRenderer.render(state.site, page.id, project, state.media);
        updateProducts();
        console.info('[kirby-perf]', { stage: 'preview_html_dom', ms: performance.now() - renderStarted, loadMs: performance.now() - started });
        tell({ type: 'page', pageId: page.id, revision: state.site.revision });
        reportSize(); requestAnimationFrame(followAnchor);
    }
    function updateProducts() {
        if (!current?.state.site.catalog) return;
        root.querySelectorAll('[data-product-id]').forEach(node => {
            const product = current.state.site.catalog.products.find(p => p.id === node.dataset.productId);
            if (!product) return;
            const selectors = [...node.querySelectorAll('[data-product-option]')];
            if (!node.classList.contains('ks-product-detail')) return;
            const offer = product.offers.find(o => selectors.every(select => o.options.some(option => option.name === select.dataset.productOption && option.values.includes(select.value))));
            const price = node.querySelector('[data-product-price]'), availability = node.querySelector('[data-product-availability]');
            price.innerHTML = offer ? KirbySiteRenderer.price(offer, current.state.site.language) : '';
            availability.textContent = !offer ? 'Cette combinaison n’est pas proposée.' : offer.stockQuantity !== null ? `${offer.stockQuantity} ${offer.saleUnit === 'lot' ? 'lot(s)' : 'unité(s)'} disponibles` : ({ unknown:'', available:'Disponible', unavailable:'Indisponible', preorder:'Précommande' }[offer.availability]);
            if (selectors.length) {
                const gallery = node.querySelector('.ks-product-gallery');
                const ids = offer?.assetIds.length ? offer.assetIds : product.assetIds;
                if (gallery) gallery.innerHTML = KirbySiteRenderer.gallery(ids, { site:current.state.site, media:current.state.media, priority:true }, product.name);
            }
        });
        reportSize();
    }
    root.addEventListener('change', event => {
        if (event.target.matches('[data-product-option]')) updateProducts();
        if (event.target.matches('[data-catalog-category]')) {
            const value = event.target.value, categories = current.state.site.catalog.categories, ids = new Set([value]);
            for (let i=0; i<categories.length; i++) categories.forEach(c => { if (ids.has(c.parentId)) ids.add(c.id); });
            event.target.closest('.ks-block').querySelectorAll('[data-product-id]').forEach(node => { node.hidden = Boolean(value) && !JSON.parse(node.dataset.categoryIds).some(id => ids.has(id)); });
            reportSize();
        }
    });
    root.addEventListener('click', event => {
        const button = event.target.closest('[data-gallery-index]');
        if (!button) return;
        const gallery = button.closest('.ks-product-gallery');
        gallery.querySelectorAll('[data-gallery-view]').forEach(view => { view.hidden = view.dataset.galleryView !== button.dataset.galleryIndex; });
        gallery.querySelectorAll('[data-gallery-index]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        reportSize();
    });
    function updateMedia(data) {
        if (!current) return;
        const asset = current.state.site.assets.find(a => a.id === data.assetId);
        if (!asset || data.media?.signature !== KirbySiteRenderer.signature(asset)) return;
        const started = performance.now(); current.state.media[data.assetId] = data.media;
        const html = KirbySiteRenderer.media(asset.id, { site: current.state.site, media: current.state.media });
        // Replace only this media, retaining navigation, open menus, inputs and scroll.
        root.querySelectorAll('[data-asset-id]').forEach(node => { if (node.dataset.assetId === asset.id) node.outerHTML = html; });
        console.info('[kirby-perf]', { stage: 'media_dom_patch', ms: performance.now() - started });
        reportSize();
    }
    document.addEventListener('click', event => {
        const section = event.target.closest('[data-section-id]');
        if (section && current) tell({ type: 'selection', pageId: current.page.id, sectionId: section.dataset.sectionId, blockId: event.target.closest('[data-block-id]')?.dataset.blockId || '', actionId: event.target.closest('[data-action-id]')?.dataset.actionId || '', productId: event.target.closest('[data-product-id]')?.dataset.productId || '' });
    });
    window.addEventListener('message', event => { if (event.origin === location.origin && event.source === parent && event.data?.project === project) { if (event.data.type === 'kirby-site-media') updateMedia(event.data); if (event.data.type === 'kirby-site-refresh') load().catch(showError); if (event.data.type === 'kirby-site-viewport') { viewport(event.data.height); reportSize(); } } });
    function showError(error) { root.textContent = error.message; reportSize(); }
    new ResizeObserver(reportSize).observe(root);
    window.addEventListener('hashchange', followAnchor);
    document.fonts.ready.then(reportSize);
    await load().catch(showError);
}());
