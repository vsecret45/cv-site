/* Selective geometry recovery from f55b8df. Trusted renderer slots only:
 * no brief, seed, aliases, editorial fallback or automatic section insertion. */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.KirbyCompositionEngine = api;
}(globalThis, () => {
    'use strict';
    const layouts = {
        'immersive-hero': [['backdrop', 'primaryMedia'], ['opening', 'copy'], ['object', 'artifact'], ['thumbnails', 'secondaryMedia', 'tertiaryMedia']],
        'editorial-cover': [['masthead', 'copy'], ['spread-main', 'primaryMedia'], ['spread-aside', 'secondaryMedia', 'artifact'], ['thumbnails', 'tertiaryMedia']],
        'asymmetric-grid': [['opening', 'copy'], ['dominant', 'primaryMedia'], ['secondary', 'secondaryMedia'], ['detail', 'artifact', 'tertiaryMedia']],
        'product-stage': [['opening', 'copy'], ['scene', 'artifact', 'proof', 'flow', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia']],
        'vertical-narrative': [['opening', 'copy'], ['strip', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'], ['object', 'artifact']],
        'map-led': [['backdrop', 'primaryMedia'], ['opening', 'copy'], ['rail', 'artifact'], ['thumbnails', 'secondaryMedia', 'tertiaryMedia']],
        'cinematic-gallery': [['backdrop', 'primaryMedia'], ['opening', 'copy'], ['thumbnails', 'secondaryMedia', 'tertiaryMedia'], ['object', 'artifact']],
        'split-stage': [['opening', 'copy'], ['scene', 'primaryMedia', 'artifact', 'secondaryMedia', 'tertiaryMedia']],
        'proof-mosaic': [['opening', 'copy'], ['mosaic', 'proof', 'artifact'], ['rail', 'flow'], ['strip', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia']],
        'catalog-shelf': [['opening', 'copy'], ['lead', 'proof', 'artifact'], ['shelf', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'], ['rail', 'flow']],
        'process-rail': [['opening', 'copy'], ['track', 'flow'], ['rail', 'proof', 'artifact'], ['strip', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia']],
        'story-chapters': [['opening', 'copy'], ['story-media', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'], ['story-copy', 'proof', 'flow', 'artifact']],
        'gallery-reel': [['opening', 'copy'], ['strip', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'], ['lead', 'proof', 'flow', 'artifact']],
        'data-canvas': [['opening', 'copy'], ['lead', 'proof'], ['scene', 'artifact', 'flow'], ['strip', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia']],
        'object-stage': [['opening', 'copy'], ['objects', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'], ['shelf', 'gallery', 'artifact', 'proof', 'flow']],
        'collection-grid': [['opening', 'copy'], ['shelf', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia', 'artifact', 'proof', 'flow']],
        stack: [['opening', 'copy'], ['stack', 'artifact', 'proof', 'flow', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia']],
    };
    const names = ['catalogue', 'copy', 'artifact', 'proof', 'flow', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'];
    function render(composition, slots) {
        if (!Object.hasOwn(layouts, composition)) throw new Error('Unknown composition');
        if (Object.keys(slots).some(k => !names.includes(k))) throw new Error('Unknown visual slot');
        const used = new Set();
        const group = ([name, ...keys]) => {
            keys.forEach(k => used.add(k));
            const content = keys.map(k => slots[k] || '').join('');
            return content ? `<div class="ks-placement ks-placement-${name}">${content}</div>` : '';
        };
        const content = layouts[composition].map(group).join('');
        const remainder = names.filter(k => k !== 'catalogue' && !used.has(k) && slots[k]);
        return `<div class="ks-composition ks-composition-${composition}" data-composition="${composition}">${content}${slots.catalogue ? group(['catalogue', 'catalogue']) : ''}${remainder.length ? group(['supplement', ...remainder]) : ''}</div>`;
    }
    return { render, compositions: Object.keys(layouts) };
}));
