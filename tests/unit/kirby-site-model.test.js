const test = require('node:test'); const assert = require('node:assert/strict');
const M = require('../../lib/kirby-site-model'); const C = require('../../assets/kirby-site-contract'); const F = require('../fixtures/kirby-site.cjs');
test('model receives exact current document, history and selected element even for radical changes', async () => {
    const site = F.site(); let body;
    const decision = F.decision([{ type: 'set_design', design: { ...site.design, canvas: '#101020', ink: '#ffffff' } }]);
    const result = await M.generate({ protocol: C.protocol, message: 'Change complètement l’ambiance, garde le reste.', site, conversation: [{ role: 'user', content: 'Je tiens aux textes actuels.' }], selection: { pageId: 'details', sectionId: '' } }, { apiKeys: ['sk-test'], fetchImpl: async (_, opts) => { body = JSON.parse(opts.body); return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(body.text.format.name === 'kirby_site_review' ? { approved: true, decision: null } : decision) }] }] })); } });
    const context = JSON.parse(body.input);
    assert.deepEqual(context.site, site); assert.equal(context.conversation.length, 1); assert.equal(context.selection.pageId, 'details');
    assert.deepEqual(result.site.pages, site.pages); assert.equal(result.site.revision, 2);
});
test('technical repair returns to model and never uses a fallback template', async () => {
    let calls = 0; const site = F.site();
    const response = await M.generate({ protocol: C.protocol, site, message: 'Déplace le fonctionnement.' }, { apiKeys: ['sk-test'], fetchImpl: async (_, opts) => {
        calls++; if (calls === 2) assert.match(JSON.parse(opts.body).input, /technicalCorrection/);
        const d = F.decision([{ type: 'move_section', id: 'process', pageId: calls === 1 ? 'missing' : 'details', index: 0 }]);
        return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(JSON.parse(opts.body).text.format.name === 'kirby_site_review' ? { approved: true, decision: null } : d) }] }] }));
    } });
    assert.equal(calls, 3); assert.equal(response.site.pages[1].sections[0].id, 'process');
});
test('site key resolution keeps existing precedence and does not use CV or Flyer keys', () => {
    assert.deepEqual(M.keys({ Openai_api_key: 'sk-site', OPENAI_API_KEY: 'sk-shared', KIRBY_CV_OPENAI_API_KEY: 'sk-cv', OPENAI_FLYER_API_KEY: 'sk-flyer' }), ['sk-site', 'sk-shared']);
});
test('semantic review is delegated to OpenAI, including differently worded conversions', async () => {
    const site = F.site();
    const a = { id: 'request-one', label: 'Parlons de votre projet', appearance: 'primary', target: F.target('details') };
    const b = { ...a, id: 'request-two', label: 'Commencer ensemble' };
    const initial = F.decision([{ type: 'put_section', pageId: 'home', index: 0, section: { ...site.pages[0].sections[0], actions: [a, b] } }]);
    const reviewed = C.clone(initial); reviewed.operations[0].section.actions = [a]; let calls = 0;
    const result = await M.generate({ protocol: C.protocol, site, message: 'Ajoute une invitation à nous contacter.' }, { apiKeys: ['sk-test'], fetchImpl: async (_, opts) => {
        const body = JSON.parse(opts.body); calls++;
        if (calls === 2) { assert.deepEqual(JSON.parse(body.input).candidateDecision, initial); assert.deepEqual(JSON.parse(body.input).site, site); }
        const value = calls === 1 ? initial : { approved: false, decision: reviewed };
        return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(value) }] }] }));
    } });
    assert.equal(calls, 2); assert.deepEqual(result.decision, reviewed);
    assert.deepEqual(site, F.site()); assert.deepEqual(result.site.pages[1], site.pages[1]);
});
test('provider review failure cannot return an unreviewed successful edit', async () => {
    const site = F.site(); let calls = 0;
    await assert.rejects(M.generate({ protocol: C.protocol, site, message: 'Déplace la section.' }, { apiKeys: ['sk-test'], fetchImpl: async () => {
        calls++; if (calls > 1) return new Response('', { status: 503 });
        return new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(F.decision([{ type: 'move_section', id: 'process', pageId: 'details', index: 0 }])) }] }] }));
    } }));
    assert.deepEqual(site, F.site());
});
test('validated media plan precedes semantic review; approved candidates are not reapplied or rebuilt', async () => {
    const order=[], logs=[]; const site=F.site();
    const decision=F.decision([{type:'set_design',design:{...site.design,accent:'#559977'}}]);
    const r=await M.generate({protocol:C.protocol,site,message:'Change la couleur.'},{
        apiKeys:['sk-test'],log:e=>logs.push(e),
        onCandidate:plan=>{order.push('plan');assert.equal(plan.design.accent,'#559977');},
        fetchImpl:async(_,o)=>{const b=JSON.parse(o.body),review=b.text.format.name==='kirby_site_review';order.push(review?'review':'decision');return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(review?{approved:true,decision:null}:decision)}]}]}));}
    });
    assert.deepEqual(order,['decision','plan','review']);
    assert.equal(logs.filter(e=>e.stage==='validate_candidate').length,1);
    assert.equal(logs.filter(e=>e.stage==='validate_reviewed').length,0);
    assert.ok(r.timings.every(e=>Number.isFinite(e.ms)&&!('message' in e)));
});
test('a review transport failure does not trigger another complete content generation', async () => {
    let calls=0;const site=F.site();
    await assert.rejects(M.generate({protocol:C.protocol,site,message:'Déplace cette section.'},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async()=>{
        calls++;if(calls===2)return new Response('',{status:503});
        return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(F.decision([{type:'move_section',id:'process',pageId:'details',index:0}]))}]}]}));
    }}));
    assert.equal(calls,2);
});

test('five independent media calls overlap with unchanged quality and correlated timings, without automatic retries', async () => {
    const calls=[], release=[], logs=[]; const design=F.site().design;
    const jobs=Array.from({length:5},(_,i)=>M.generateMedia({runId:'batch-test',asset:{id:'image-'+i,prompt:'Test image',alt:'Test',purpose:'Test',aspect:'landscape'},design},{apiKeys:['sk-test'],log:e=>logs.push(e),fetchImpl:async(_,options)=>{calls.push(JSON.parse(options.body));return new Promise(resolve=>release.push(resolve));}}));
    assert.equal(calls.length,5); assert.equal(release.length,5);
    calls.forEach(body=>{assert.equal(body.quality,process.env.KIRBY_IMAGE_QUALITY||'high');assert.equal(body.model,process.env.KIRBY_IMAGE_MODEL||'gpt-image-2');assert.equal(body.size,'1536x1024');assert.equal(body.n,1)});
    release.forEach((resolve,i)=>resolve(i===0?new Response('',{status:503}):new Response(JSON.stringify({data:[{b64_json:'YQ=='}]}))));
    const results=await Promise.allSettled(jobs);assert.equal(results.filter(r=>r.status==='rejected').length,1);assert.equal(calls.length,5);
    assert.equal(logs.filter(e=>e.stage==='ai_image').length,5);
    assert.ok(logs.every(e=>e.runId==='batch-test'&&e.assetId.startsWith('image-')&&e.at>=e.startedAt));
});

test('review receives applied site and records actual provider model separately from requested model', async()=>{
 const source=F.site(),decision=F.decision([{type:'set_design',design:{...source.design,accent:'#224466'}}]);let calls=0;
 const r=await M.generate({protocol:C.protocol,site:source,message:'Change la couleur.'},{apiKeys:['sk-test'],model:'gpt-5.5',reasoningEffort:'medium',log:()=>{},fetchImpl:async(_,opts)=>{const b=JSON.parse(opts.body);calls++;assert.equal(b.reasoning.effort,'medium');if(calls===2){const ctx=JSON.parse(b.input);assert.deepEqual(ctx.candidateSite,C.apply(source,decision));assert.deepEqual(ctx.site,source);}return new Response(JSON.stringify({status:'completed',model:'provider-confirmed-model',output:[{content:[{type:'output_text',text:JSON.stringify(calls===1?decision:{approved:true,decision:null})}]}]}));}});
 assert.equal(calls,2);assert.equal(r.model,'gpt-5.5');assert.deepEqual(r.modelCalls.map(c=>c.returnedModel),['provider-confirmed-model','provider-confirmed-model']);assert.deepEqual(source,F.site());
});
