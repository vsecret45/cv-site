const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../../lib/site-media-allocation');
const F = require('../fixtures/kirby-site.cjs');
function page() {
    const p = F.site().pages[0];
    p.sections[0].slots.primaryMediaId = 'a';
    p.sections[0].slots.secondaryMediaId = 'a';
    p.sections[1].blocks = [{ id: 'card', type: 'image', assetId: 'a' }];
    return p;
}
test('primary, secondary and image cards across sections use distinct suitable existing assets', () => {
    const p = page(), pool = ['a','b','c'].map(id => ({id}));
    const composition = p.sections.map(s=>s.composition);
    A.assign(p, pool, A.occurrences(p).map(r => ({key:r.key,alternatives:['b','c']})));
    assert.equal(A.repeated(p), false);
    assert.deepEqual(p.sections.map(s=>s.composition),composition);
    assert.deepEqual(pool,[{id:'a'},{id:'b'},{id:'c'}]);
});
test('matching reserves a unique appropriate image for a specific card instead of greedy reuse', () => {
    const p=page();
    A.assign(p,[{id:'a'},{id:'b'},{id:'c'}],A.occurrences(p).map((r,i)=>({key:r.key,alternatives:i===0?['b']:i===1?['c']:[]})));
    assert.deepEqual(A.occurrences(p).map(r=>r.owner[r.field]),['b','c','a']);
});
test('no unrelated substitute or new image when the pool has no suitable alternative', () => {
    const p=page();
    A.assign(p,[{id:'a'},{id:'unrelated'}],A.occurrences(p).map(r=>({key:r.key,alternatives:[]})));
    assert.deepEqual(A.occurrences(p).map(r=>r.owner[r.field]),['a','a','a']);
});
test('allocation rejects invented assets and missing occurrences', () => {
    const p=page();
    assert.throws(()=>A.assign(p,[{id:'a'}],[]));
    assert.throws(()=>A.assign(p,[{id:'a'}],A.occurrences(p).map(r=>({key:r.key,alternatives:['invented']}))));
});
test('a visual can still be reused on a different page', () => {
    const p=page();p.sections[0].slots.secondaryMediaId='';p.sections[1].blocks=[];
    const other=structuredClone(p);
    assert.equal(A.repeated(p),false);assert.equal(A.repeated(other),false);
});
