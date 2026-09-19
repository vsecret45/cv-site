const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../../assets/kirby-site-contract');
const generationSchema = require('../../lib/kirby-site-generation-schema');
const F = require('../fixtures/kirby-site.cjs');

test('decision and review constrain block links without mutating the stored schema', () => {
    const original = JSON.stringify(C.responseSchema);
    for (const schema of [C.responseSchema,C.reviewSchema]) {
        const result = generationSchema(schema);
        const [image,content] = result.$defs.block.anyOf;
        assert.deepEqual(image.properties.type.enum,['image']);
        assert.equal(image.properties.target.anyOf[0].$ref,'#/$defs/target');
        assert.deepEqual(content.properties.type.enum,['text','metrics','chart','timeline','table','cards','products','explorer']);
        assert.deepEqual(content.properties.target.type,'null');
        for (const branch of [image,content]) assert.ok(branch.required.includes('target'));
        const [page,section,url] = result.$defs.target.anyOf;
        assert.deepEqual(page.properties.sectionId.enum,['']);assert.deepEqual(page.properties.url.enum,['']);
        assert.deepEqual(section.properties.url.enum,['']);
        assert.deepEqual(url.properties.pageId.enum,['']);assert.deepEqual(url.properties.sectionId.enum,['']);
    }
    assert.equal(JSON.stringify(C.responseSchema),original);
});
test('broken links report their precise destination for model repair', () => {
    const s = F.site();s.navigation.items[0].target.pageId='missing-destination';
    assert.throws(()=>C.validate(s),/broken target:.*missing-destination/);
});

test('the actual model request uses constrained schemas for generation and review', async () => {
    const M = require('../../lib/kirby-site-model');
    const seen = [];
    const site = F.site();
    await M.generate({protocol:C.protocol,message:'Créer un site',requestMode:'create'}, {
        apiKeys:['test'], log:()=>{}, fetchImpl:async (_,options)=>{
            const body=JSON.parse(options.body);seen.push(body.text.format.name);
            assert.ok(body.text.format.schema.$defs.block.anyOf);
            assert.equal(body.text.format.schema.$defs.block.anyOf[1].properties.target.type,'null');
            const decision=body.text.format.name==='kirby_site_review'
                ? {approved:true,decision:null}
                : {kind:'create',baseRevision:0,message:'Créé',site,operations:[]};
            return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(decision)}]}]}));
        }
    });
    assert.deepEqual(seen,['kirby_site_decision','kirby_site_review']);
});
