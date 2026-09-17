const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../../kirby-composition-engine');
const R = require('../../assets/kirby-site-renderer');
const C = require('../../assets/kirby-site-contract');
const F = require('../fixtures/kirby-site.cjs');

test('each recovered composition preserves every supplied slot once, with no fallback', () => {
    const slots = Object.fromEntries(['catalogue', 'copy', 'artifact', 'proof', 'flow', 'gallery', 'primaryMedia', 'secondaryMedia', 'tertiaryMedia'].map(k => [k, `<b>${k}-sentinel</b>`]));
    assert.deepEqual([...E.compositions].sort(), [...C.compositions].sort());
    for (const name of E.compositions) {
        const html = E.render(name, slots);
        for (const value of Object.values(slots)) assert.equal(html.split(value).length - 1, 1, name + value);
        assert.equal(E.render(name, {}).includes('<b>'), false);
    }
    assert.throws(() => E.render('choose-for-me', slots));
    assert.throws(() => E.render('stack', { brief: 'do not interpret' }));
});
test('multipage renders only the selected page and retains real navigation destinations', () => {
    const s = F.site(); s.pages[1].sections = [F.section('detail-content', 'Exclusively on detail')];
    C.validate(s);
    const home = R.render(s, 'home', 'project-1');
    const detail = R.render(s, 'details', 'project-1');
    assert.ok(!home.includes('Exclusively on detail'));
    assert.ok(detail.includes('Exclusively on detail'));
    assert.ok(!detail.includes('Une promesse précise'));
    assert.ok(home.includes('page=%2Ffonctionnement'));
    assert.equal(R.href({ kind: 'section', pageId: 'details', sectionId: 'detail-content' }, s, 'project-1'), 'site-preview.html?project=project-1&page=%2Ffonctionnement#detail-content');
});
test('structured visual decisions and text are executed without reinterpretation or injection', () => {
    const s = F.site();
    s.pages[0].sections[0].visual = { ...s.pages[0].sections[0].visual, surface: 'glass', depth: 'spatial', motion: 'float' };
    s.pages[0].sections[0].title = '<script>not code</script> Sans verre';
    let html = R.render(s, 'home', 'p');
    assert.ok(html.includes('ks-surface-glass ks-depth-spatial ks-motion-float'));
    assert.ok(html.includes('&lt;script&gt;not code&lt;/script&gt; Sans verre'));
    assert.equal((html.match(/data-section-id=/g) || []).length, 2);
    s.pages[0].sections[0].visual.surface = 'transparent';
    html = R.render(s, 'home', 'p');
    assert.ok(!html.includes('ks-surface-glass'));
});
test('media cache changes only when the model changes the asset, not the surrounding design', () => {
    const asset = { id: 'a', prompt: 'Original sculpture', alt: 'Sculpture', aspect: 'square', purpose: 'Main visual' };
    assert.equal(R.signature(asset, { canvas: '#ffffff' }), R.signature(asset, { canvas: '#000000' }));
    assert.notEqual(R.signature(asset), R.signature({ ...asset, prompt: 'Different sculpture' }));
    assert.equal(R.signature(asset), C.assetSignature(asset));
});

test('empty copy does not reserve a placement',()=>{const s=F.site();const section=s.pages[0].sections[0];section.title='';section.composition='product-stage';s.pages[0].sections=[section];assert.doesNotMatch(R.render(s,'home','p'),/ks-placement-opening|ks-copy/);});

test('gallery has one visible view and accessible controls without fabricating additional assets',()=>{
 const s=F.site();s.assets=[{id:'front',aspect:'portrait',alt:'Vue de face',prompt:'Front',purpose:'View'},{id:'detail',aspect:'square',alt:'Détail',prompt:'Detail',purpose:'View'}];
 const html=R.gallery(['front','detail','front','missing'],{site:s},'Pièce <unique>');
 assert.equal((html.match(/data-gallery-view=/g)||[]).length,2);
 assert.match(html,/data-gallery-view="1" hidden/);
 assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
 assert.match(html,/Pièce &lt;unique&gt;/);
 assert.doesNotMatch(R.gallery(['front'],{site:s}),/data-gallery-index/);
});

test('image navigation reuses validated targets and rejects unsafe destinations',()=>{
 const s=F.site(),sec=s.pages[0].sections[0];
 sec.blocks=[{id:'family-link',type:'image',target:F.target('details'),title:'Famille',text:'',assetId:'',items:[],chartType:'bar',illustrative:false}];sec.slots.artifactBlockIds=['family-link'];
 C.validate(s);assert.match(R.render(s,'home','p'),/class="ks-image-link" href="site-preview.html\?project=p&amp;page=%2Ffonctionnement"/);
 sec.blocks[0].target={kind:'url',url:'javascript:alert(1)',pageId:'',sectionId:''};assert.throws(()=>C.validate(s));
});
