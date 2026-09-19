const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const F = require('../fixtures/kirby-site.cjs');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw Error('Set AGENT_BROWSER_CLI');
const session = 'kirby-new-project-regression';
const cmd = (...args) => execFileSync(process.execPath, [cli, '--session', session, ...args], {encoding:'utf8'});
const ev = code => JSON.parse(execFileSync(process.execPath, [cli, '--session', session, 'eval', '--stdin'], {input:code,encoding:'utf8'}));
const base = process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8001';
const site = F.site();
try {
  cmd('open',base+'/index.html'); cmd('snapshot','-i');
  ev(`(async()=>{await KirbySiteStore.put('regression-old',{site:${JSON.stringify(site)},media:{},history:[],conversation:[]});localStorage.setItem('kirby-site-project-v1','regression-old');return true})()`);
  cmd('reload'); cmd('snapshot','-i');
  const report = ev(`(async()=>{
    const wait=async(test)=>{const end=Date.now()+15000;while(!await test()){if(Date.now()>end)throw Error('Timed out waiting for project');await new Promise(r=>setTimeout(r,50));}};
    await wait(()=>document.querySelector('#ai-brief-output iframe'));
    const originalFetch=window.fetch;let calls=0;let audits=0;const validate=KirbySiteResponsive.validate;
    KirbySiteResponsive.validate=async(...args)=>{const report=await validate(...args);if(report.results.length!==8)throw Error('Missing page/viewport checks');audits++;return report;};
    window.fetch=(url,options)=>{
      if(String(url).includes('/api/kirby-site')){
        calls++;const site=${JSON.stringify(site)};site.id='new-site-'+calls;site.name='Nouveau projet '+calls;site.pages[0].sections[0].title='Nouvelle conception '+calls;
        return Promise.resolve(new Response(JSON.stringify({ok:true,requestScope:'create',decision:{kind:'create',baseRevision:1,message:'Nouveau site créé.',site,operations:[]}}),{headers:{'content-type':'application/json'}}));
      }
      return originalFetch(url,options);
    };
    const ids=[];
    for(let i=1;i<=2;i++){
      document.querySelector('#ai-brief-input').value='Créer un autre site de test '+i;
      document.querySelector('#ai-brief-form').requestSubmit();
      await wait(async()=>{const id=localStorage.getItem('kirby-site-project-v1');return (await KirbySiteStore.get(id))?.site?.id==='new-site-'+i && document.querySelector('#ai-brief-output iframe')?.src.includes(id)});
      ids.push(localStorage.getItem('kirby-site-project-v1'));
      await wait(()=>!document.querySelector('#ai-brief-form button[type=submit]')?.disabled);
    }
    return {calls,audits,ids,stored:await KirbySiteStore.get('regression-old'),checkpoint:await new Promise((resolve,reject)=>{const req=indexedDB.open('kirby-sites-v1',1);req.onsuccess=()=>{const db=req.result;const get=db.transaction('projects').objectStore('projects').get('last-valid:regression-old');get.onsuccess=()=>{resolve(get.result);db.close()};get.onerror=reject};req.onerror=reject})};
  })()`);
  assert.equal(report.calls,2);assert.equal(report.audits,2);assert.equal(report.ids[0],'regression-old');assert.equal(report.ids[1],'regression-old');assert.equal(report.stored.site.id,'new-site-2');assert.deepEqual(report.stored.history,[]);assert.equal(report.checkpoint.site.id,'new-site-2');assert.deepEqual(report.checkpoint.history,[]);
  cmd('reload');cmd('snapshot','-i');
  const restored=ev(`(async()=>{const id=localStorage.getItem('kirby-site-project-v1');return (await KirbySiteStore.get(id)).site.id})()`);
  assert.equal(restored,'new-site-2');
  console.log('PASS: main page loads engine; two new tests replace the same slot; history and checkpoint contain no previous site; reload retains latest. Model responses stubbed.');
} finally { cmd('close'); }
