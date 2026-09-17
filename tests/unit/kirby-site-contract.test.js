const test = require('node:test'); const assert = require('node:assert/strict');
const C = require('../../assets/kirby-site-contract'); const F = require('../fixtures/kirby-site.cjs');
test('a move preserves content, navigation and unrelated design atomically', () => {
    const site = F.site(); const original = C.clone(site);
    const next = C.apply(site, F.decision([{ type: 'move_section', id: 'process', pageId: 'details', index: 0 }]));
    assert.deepEqual(next.pages[1].sections[0], site.pages[0].sections[1]);
    assert.deepEqual(next.design, site.design); assert.deepEqual(next.navigation, site.navigation);
    assert.equal(next.pages[0].sections.length, 1); assert.deepEqual(site, original);
});
test('invalid destinations, stale responses and a partial removal cannot damage the site', () => {
    const site = F.site(); const copy = C.clone(site);
    assert.throws(() => C.apply(site, F.decision([{ type: 'remove_page', id: 'details' }])));
    assert.throws(() => C.apply(site, { ...F.decision([]), baseRevision: 0 }));
    assert.deepEqual(site, copy);
});
test('clarification is a non-mutating decision', () => {
    const site = F.site(); const d = { ...F.decision([]), kind: 'clarify', message: 'Quelle section ?' };
    assert.equal(C.apply(site, d), site);
    assert.throws(() => C.apply(site, { ...d, operations: [{ type: 'remove_section', id: 'process' }] }));
});
test('one page does not force additional pages or a closing CTA', () => {
    const site = F.site(); site.pages.pop(); site.navigation.items.pop();
    const next = C.apply(null, { kind: 'create', baseRevision: 0, message: '', site, operations: [] });
    assert.equal(next.pages.length, 1); assert.deepEqual(next.pages[0].sections, site.pages[0].sections);
});
test('intent references preserve a valid overview page without rejecting complementary product pages', () => {
    const site = F.site(); site.intents = [{ id: 'intent-method', meaning: 'Comprendre le fonctionnement', primaryPageId: 'home' }];
    site.pages[0].sections.forEach(s => { s.intentIds = ['intent-method']; s.coverage = 'primary'; });
    assert.equal(C.validate(site), site);
    site.pages[1].sections.push({ ...F.section('wrong-primary', 'Autre page'), intentIds: ['intent-method'], coverage: 'primary' });
    assert.equal(C.validate(site), site);
    site.intents[0].primaryPageId = 'missing'; assert.throws(() => C.validate(site), /intent page missing/);
    site.intents[0].primaryPageId = 'home'; site.pages[1].sections = [];
    site.pages[0].sections[0].coverage = 'teaser'; assert.equal(C.validate(site), site);
});
test('technical contract rejects executable URLs and unknown properties', () => {
    const site = F.site(); site.navigation.items[0].target = { kind: 'url', url: 'javascript:alert(1)', pageId: '', sectionId: '' };
    assert.throws(() => C.validate(site), /unsafe/);
    assert.throws(() => C.validate({ ...F.site(), html: '<script>' }));
});
test('a model-selected new project has an independent identity and keeps the previous site intact', () => {
    const current = F.site(), original = C.clone(current), fresh = F.site();
    fresh.id = 'another-project'; fresh.design.accent = '#198577';
    const d = { kind: 'create', baseRevision: current.revision, site: fresh, operations: [], message: 'Nouveau projet.' };
    const next = C.apply(current, d);
    assert.deepEqual(current, original); assert.equal(next.revision, 1); assert.equal(next.design.accent, '#198577');
    assert.throws(() => C.apply(current, { ...d, site: current }), /invalid creation/);
    assert.throws(() => C.apply(current, { ...d, baseRevision: 0 }), /stale/);
});
test('a palette-only edit preserves pages, navigation, media and business content exactly', () => {
    const current = F.site(); const copy = C.clone(current);
    const next = C.apply(current, F.decision([{ type:'set_design', design:{ ...current.design, canvas:'#ffffff', accent:'#bba25a', surface:'#e9eee8', headingFont:'geometric' } }]));
    for(const key of ['pages','navigation','assets','project','intents']) assert.deepEqual(next[key],current[key]);
    assert.deepEqual(current,copy); assert.equal(next.design.headingFont,'geometric');
});
