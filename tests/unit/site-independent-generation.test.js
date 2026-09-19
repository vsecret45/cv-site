const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../../lib/kirby-site-model'),C=require('../../assets/kirby-site-contract'),F=require('../fixtures/kirby-site.cjs');
const response=value=>new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]}));
test('new project routing never exposes the old SiteSpec, design or conversation to creative calls',async()=>{
 const old=F.site(),snapshot=structuredClone(old),next=F.site();next.id='new-studio';next.name='Studio 27';
 const calls=[];
 const result=await M.generate({protocol:C.protocol,site:old,message:'Crée un nouveau site Studio 27 coiffure.',conversation:[{role:'user',content:'OLD DESIGN SECRET'}],selection:{pageId:'details'}},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async(_,o)=>{
  const b=JSON.parse(o.body),ctx=JSON.parse(b.input);calls.push(b.text.format.name);
  assert.ok(!b.input.includes('OLD DESIGN SECRET'));
  if(b.text.format.name==='kirby_site_scope'){assert.deepEqual(Object.keys(ctx),['message','currentProjectName']);return response({scope:'create'});}
  assert.equal(ctx.site,null);assert.deepEqual(ctx.conversation,[]);assert.deepEqual(ctx.selection,{});
  assert.ok(!b.input.includes('test-site'));
  return response(b.text.format.name==='kirby_site_review'?{approved:true,decision:null}:{kind:'create',baseRevision:0,message:'Créé',site:next,operations:[]});
 }});
 assert.deepEqual(calls,['kirby_site_scope','kirby_site_decision','kirby_site_review']);
 assert.deepEqual(old,snapshot);assert.equal(result.decision.baseRevision,old.revision);
 assert.deepEqual(C.apply(old,result.decision),result.site);
});
test('a radical redesign keeps exact source and history after edit routing',async()=>{
 const old=F.site(),history=[{role:'user',content:'Conserve mes pages.'}];
 const r=await M.generate({protocol:C.protocol,site:old,message:'Refais complètement le design de ce site.',conversation:history},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async(_,o)=>{
  const b=JSON.parse(o.body),ctx=JSON.parse(b.input);
  if(b.text.format.name==='kirby_site_scope')return response({scope:'edit'});
  assert.deepEqual(ctx.site,old);assert.deepEqual(ctx.conversation,history);
  return response(b.text.format.name==='kirby_site_review'?{approved:true,decision:null}:F.decision([{type:'set_design',design:{...old.design,canvas:'#aabbcc'}}]));
 }});assert.equal(r.site.revision,2);assert.deepEqual(r.site.pages,old.pages);
});
test('duplicate references are allocated from the existing pool before returning the saved decision',async()=>{
 const next=F.site();next.assets=['a','b','c'].map(id=>({id,prompt:'Interior '+id,alt:'Interior',purpose:'Interior',aspect:'landscape'}));
 next.pages[0].sections[0].slots.primaryMediaId='a';next.pages[0].sections[0].slots.secondaryMediaId='a';next.pages[0].sections[1].slots.primaryMediaId='a';
 const result=await M.generate({protocol:C.protocol,message:'Un studio.'},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async(url,o)=>{
  assert.ok(url.endsWith('/responses'));const b=JSON.parse(o.body),ctx=JSON.parse(b.input);
  if(b.text.format.name==='kirby_site_media_allocation')return response({choices:ctx.occurrences.map(r=>({key:r.key,alternatives:['b','c']}))});
  return response(b.text.format.name==='kirby_site_review'?{approved:true,decision:null}:{kind:'create',baseRevision:0,message:'Créé',site:next,operations:[]});
 }});
 assert.equal(require('../../lib/site-media-allocation').repeated(result.site.pages[0]),false);
 assert.deepEqual(result.site.assets,next.assets);assert.deepEqual(C.apply(null,result.decision),result.site);
});
test('new project clarification keeps only its own conversation',async()=>{
 const old=F.site(),fresh=[{role:'user',content:'Nouveau site indépendant.'},{role:'assistant',content:'Quel nom ?'}];
 const r=await M.generate({protocol:C.protocol,site:old,requestMode:'create',message:'Studio 27',conversation:[{role:'user',content:'OLD DESIGN'}],creationConversation:fresh},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async(_,o)=>{
  const ctx=JSON.parse(JSON.parse(o.body).input);assert.equal(ctx.site,null);assert.deepEqual(ctx.conversation,fresh);assert.ok(!JSON.stringify(ctx).includes('OLD DESIGN'));
  return response({kind:'clarify',baseRevision:0,message:'Quel public ?',site:null,operations:[]});
 }});assert.equal(r.requestScope,'create');assert.deepEqual(C.apply(old,r.decision),old);
});
test('an unrelated palette edit preserves existing image assignments and skips allocation',async()=>{
 const old=F.site();old.assets=[{id:'a',prompt:'Photo',alt:'Photo',purpose:'Photo',aspect:'landscape'}];old.pages[0].sections.forEach(s=>s.slots.primaryMediaId='a');
 const r=await M.generate({protocol:C.protocol,site:old,requestMode:'edit',message:'Change seulement la couleur.'},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async(_,o)=>{
  const b=JSON.parse(o.body);assert.notEqual(b.text.format.name,'kirby_site_media_allocation');
  return response(b.text.format.name==='kirby_site_review'?{approved:true,decision:null}:F.decision([{type:'set_design',design:{...old.design,accent:'#aabbcc'}}]));
 }});assert.deepEqual(r.site.pages,old.pages);
});
test('text-only edits do not rearrange existing repeated media',async()=>{
 const old=F.site();old.assets=[{id:'a',prompt:'Photo',alt:'Photo',purpose:'Photo',aspect:'landscape'}];old.pages[0].sections.forEach(s=>s.slots.primaryMediaId='a');
 const section={...structuredClone(old.pages[0].sections[0]),title:'Titre corrigé'};
 const r=await M.generate({protocol:C.protocol,site:old,requestMode:'edit',message:'Corrige le titre.'},{apiKeys:['sk-test'],log:()=>{},fetchImpl:async(_,o)=>{
  const b=JSON.parse(o.body);assert.notEqual(b.text.format.name,'kirby_site_media_allocation');
  return response(b.text.format.name==='kirby_site_review'?{approved:true,decision:null}:F.decision([{type:'put_section',pageId:'home',index:0,section}]));
 }});assert.equal(r.site.pages[0].sections[0].slots.primaryMediaId,'a');assert.equal(r.site.pages[0].sections[1].slots.primaryMediaId,'a');
});
