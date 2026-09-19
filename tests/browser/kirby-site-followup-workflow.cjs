const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const F=require('../fixtures/kirby-site.cjs');
const cli=process.env.AGENT_BROWSER_CLI;
if(!cli)throw Error('Set AGENT_BROWSER_CLI');
const cmd=(...args)=>execFileSync(process.execPath,[cli,'--session','kirby-followup-workflow',...args],{encoding:'utf8'});
const ev=code=>JSON.parse(execFileSync(process.execPath,[cli,'--session','kirby-followup-workflow','eval','--stdin'],{input:code,encoding:'utf8'}));
const questions='Première maquette créée. Quelle adresse, quel téléphone et quels horaires souhaitez-vous ajouter ?';
const site=F.site();site.name='Atelier Lune';site.pages[0].sections[0].title='La céramique pour tous';
try {
 cmd('open',(process.env.KIRBY_TEST_URL||'http://127.0.0.1:8002')+'/index.html');cmd('snapshot','-i');
 ev(`(async()=>{localStorage.setItem('kirby-site-project-v1','followup-test');await KirbySiteStore.put('followup-test',{site:null,conversation:[],history:[],media:{}});return true})()`);
 cmd('reload');cmd('snapshot','-i');
 const created=ev(`(async()=>{
  window.waitForFollowup=async(test)=>{const end=Date.now()+15000;while(!await test()){if(Date.now()>end)throw Error('Workflow timeout');await new Promise(r=>setTimeout(r,50));}};
  await waitForFollowup(()=>!document.querySelector('#ai-brief-form button[type=submit]').disabled);
  const original=window.fetch;window.workflowRequests=[];
  window.fetch=(url,options)=>{
   if(!String(url).includes('/api/kirby-site'))return original(url,options);
   const payload=JSON.parse(options.body);workflowRequests.push(payload);
   const decision=workflowRequests.length===1?{kind:'create',baseRevision:0,message:${JSON.stringify(questions)},site:${JSON.stringify(site)},operations:[]}:{kind:'edit',baseRevision:1,message:'Coordonnées ajoutées.',site:null,operations:[{type:'put_section',pageId:'home',index:1,section:{...payload.site.pages[0].sections[1],body:payload.message}}]};
   return Promise.resolve(new Response(JSON.stringify({ok:true,requestScope:workflowRequests.length===1?'create':'edit',decision}),{headers:{'content-type':'application/json'}}));
  };
  document.querySelector('#ai-brief-input').value='Crée une maquette pour Atelier Lune, cours de céramique pour adultes débutants. Pages : accueil, cours, créations. Ambiance claire et artisanale. Sans adresse, téléphone ni horaires pour le moment.';
  document.querySelector('#ai-brief-form').requestSubmit();
  await waitForFollowup(()=>document.querySelector('#ai-brief-output iframe')?.contentDocument?.querySelector('.ks-site'));
  await waitForFollowup(()=>!document.querySelector('#ai-brief-output [type=submit]').disabled);
  const frame=document.querySelector('#ai-brief-output iframe'),reply=document.querySelector('.ks-reply');
  return {site:frame.contentDocument.querySelector('.ks-brand').textContent,question:reply.textContent,visible:frame.getBoundingClientRect().height>100&&getComputedStyle(frame).display!=='none',before:Boolean(frame.compareDocumentPosition(reply)&Node.DOCUMENT_POSITION_FOLLOWING),calls:workflowRequests.length};
 })()`);
 assert.equal(created.site,'Atelier Lune');assert.equal(created.question,questions);assert.equal(created.visible,true);assert.equal(created.before,true);assert.equal(created.calls,1);
 const updated=ev(`(async()=>{
  document.querySelector('#ks-revision-text').value='12 rue des Ateliers, 01 23 45 67 89, du mardi au samedi de 10 h à 18 h.';
  document.querySelector('.ks-revision').requestSubmit();
  await waitForFollowup(async()=>(await KirbySiteStore.get('followup-test'))?.site?.revision===2);
  await waitForFollowup(()=>document.querySelector('#ai-brief-output iframe')?.contentDocument?.body?.textContent.includes('12 rue des Ateliers'));
  return {state:await KirbySiteStore.get('followup-test'),payload:workflowRequests[1]};
 })()`);
 assert.equal(updated.state.site.id,site.id);assert.deepEqual(updated.state.site.design,site.design);
 assert.equal(updated.payload.conversation.at(-1).content,questions);
 assert.match(updated.state.site.pages[0].sections[1].body,/12 rue des Ateliers/);
 cmd('reload');cmd('snapshot','-i');
 const restored=ev(`(async()=>{const s=await KirbySiteStore.get('followup-test');return {revision:s.site.revision,questions:s.conversation.some(t=>t.content===${JSON.stringify(questions)})}})()`);
 assert.equal(restored.revision,2);assert.equal(restored.questions,true);
 console.log('PASS: visible initial mockup and follow-up questions together; answer edits same site; history survives reload. API stubbed.');
}finally{cmd('close')}
