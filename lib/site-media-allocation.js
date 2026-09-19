'use strict';
// Pure page-local assignment. Never changes the pool, compositions or stored source.
function occurrences(page) {
    return page.sections.flatMap(section => {
        const refs = ['primaryMediaId', 'secondaryMediaId', 'tertiaryMediaId'].filter(key => section.slots[key]).map(key => ({ key: section.id + '/' + key, section, owner: section.slots, field: key }));
        return refs.concat(section.blocks.filter(b => b.type === 'image' && b.assetId).map(b => ({ key: section.id + '/' + b.id, section, block: b, owner: b, field: 'assetId' })));
    });
}
function repeated(page) {
    const seen = new Set();
    return occurrences(page).some(r => { const id = r.owner[r.field]; if (seen.has(id)) return true; seen.add(id); return false; });
}
function assign(page, assets, choices) {
    const refs = occurrences(page), ids = new Set(assets.map(a => a.id));
    if (choices.length !== refs.length || new Set(choices.map(c => c.key)).size !== refs.length) throw new Error('site_media_invalid_choices');
    const candidates = refs.map(r => {
        const c = choices.find(c => c.key === r.key);
        if (!c || !Array.isArray(c.alternatives) || c.alternatives.some(id => !ids.has(id))) throw new Error('site_media_invalid_choices');
        return [...new Set([r.owner[r.field], ...c.alternatives])];
    });
    // Maximum matching avoids a greedy allocation consuming a later card's only suitable image.
    const owners = new Map(), assigned = new Map();
    function match(index, seen) {
        for (const id of candidates[index]) {
            if (seen.has(id)) continue;
            seen.add(id);
            if (!owners.has(id) || match(owners.get(id), seen)) {
                owners.set(id, index); assigned.set(index, id); return true;
            }
        }
        return false;
    }
    refs.forEach((_, index) => match(index, new Set()));
    refs.forEach((r, index) => { r.owner[r.field] = assigned.get(index) || r.owner[r.field]; });
    return page;
}
const schema = { type: 'object', additionalProperties: false, required: ['choices'], properties: { choices: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['key', 'alternatives'], properties: { key: { type: 'string' }, alternatives: { type: 'array', items: { type: 'string' } } } } } } };
module.exports = { occurrences, repeated, assign, schema };
