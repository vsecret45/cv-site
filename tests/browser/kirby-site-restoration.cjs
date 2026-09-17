// Run against the local server with AGENT_BROWSER_CLI pointing to its installed CLI.
// Uses an isolated browser, no provider requests or existing user projects.
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const F = require('../fixtures/kirby-site.cjs');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw new Error('Set AGENT_BROWSER_CLI');
const session = 'kirby-restoration-tests';
const command = (...args) => execFileSync(process.execPath, [cli, '--session', session, ...args], { encoding: 'utf8' });
const evaluate = code => JSON.parse(execFileSync(process.execPath, [cli, '--session', session, 'eval', '--stdin'], { input: code, encoding: 'utf8' }));
const waitFor = expression => evaluate(`new Promise((resolve,reject)=>{const start=Date.now();const timer=setInterval(()=>{if(${expression}){clearInterval(timer);resolve(true)}else if(Date.now()-start>12000){clearInterval(timer);reject(new Error('restore timeout'))}},50)})`);
const reload = () => { command('reload'); waitFor(`document.querySelector('#ai-brief-output.ks-editor') && document.querySelector('#ai-brief-output').getAttribute('aria-busy')==='false'`); };
const metadata = () => evaluate(`(()=>{const s=document.querySelector('#kirby-assistant');return {opacity:getComputedStyle(s).opacity,form:!document.querySelector('#ai-brief-form').hidden,frame:!!document.querySelector('.ks-preview'),busy:document.querySelector('#ai-brief-output').getAttribute('aria-busy'),text:document.querySelector('#ai-brief-output').textContent}})()`);
const site = F.site(); site.pages[0].sections[0].body = 'Texte de test du défilement et de la restauration. '.repeat(160);
const state = { site, conversation: [], history: [], media: {} };
try {
    command('open', process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8002/#kirby-assistant');
    command('snapshot', '-i');
    evaluate(`(async()=>{await KirbySiteStore.put('active-test',${JSON.stringify(state)});localStorage.setItem('kirby-site-project-v1','active-test');return true})()`);
    reload(); waitFor(`document.querySelector('.ks-preview')?.contentDocument.querySelector('.ks-site')`);
    assert.equal(metadata().opacity, '1'); assert.equal(metadata().frame, true);
    assert.equal(metadata().form, false); console.log('PASS long restored site visible');

    // Close the actual page, then reopen in the same browser storage context.
    const originalTab = command('tab').match(/\bt\d+\b/)[0];
    command('tab', 'new', 'about:blank'); command('tab', 'close', originalTab);
    command('open', process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8002/#kirby-assistant');
    waitFor(`document.querySelector('.ks-preview')?.contentDocument.querySelector('.ks-site')`);
    assert.equal(metadata().opacity, '1'); console.log('PASS tab closure and return');

    evaluate(`localStorage.setItem('kirby-site-pending-v1',JSON.stringify({project:'active-test',startedAt:Date.now()}));true`);
    reload(); assert.match(metadata().text, /interrompue/); assert.equal(metadata().frame, true);
    console.log('PASS interrupted request restores committed site with message');

    evaluate(`localStorage.setItem('kirby-site-project-v1','missing-test');true`);
    reload(); assert.equal(metadata().form, true); assert.equal(metadata().frame, false);
    console.log('PASS absent active project never selects another stored project');
    evaluate(`localStorage.setItem('kirby-site-pending-v1',JSON.stringify({project:'missing-test'}));true`);
    reload(); assert.match(metadata().text, /interrompue/); assert.equal(metadata().form, true);
    console.log('PASS interrupted first creation returns to form');

    // Corrupt primary only; recovery must use this project's own checkpoint.
    evaluate(`(async()=>{await new Promise((resolve,reject)=>{const r=indexedDB.open('kirby-sites-v1',1);r.onsuccess=()=>{const tx=r.result.transaction('projects','readwrite');tx.objectStore('projects').put({site:{broken:true}},'active-test');tx.oncomplete=resolve;tx.onerror=reject}});localStorage.setItem('kirby-site-project-v1','active-test');return true})()`);
    reload(); assert.equal(metadata().frame, true);
    assert.equal(evaluate(`KirbySiteStore.get('active-test').then(s=>s.site.id)`),site.id);
    console.log('PASS corrupt primary recovers same-project valid checkpoint');

    evaluate(`(async()=>{await new Promise(resolve=>{const r=indexedDB.open('kirby-sites-v1',1);r.onsuccess=()=>{const tx=r.result.transaction('projects','readwrite');tx.objectStore('projects').put({site:{broken:true}},'corrupt-only');tx.oncomplete=resolve}});localStorage.setItem('kirby-site-project-v1','corrupt-only');return true})()`);
    reload(); assert.equal(metadata().form, true); assert.equal(metadata().frame, false);
    assert.match(metadata().text,/pas pu être récupéré/); console.log('PASS unrecoverable active project exposes creation form');

    const preserved = evaluate(`(async()=>{const before=await KirbySiteStore.get('active-test');let rejected=false;try{await KirbySiteStore.put('active-test',{site:{invalid:true}})}catch(_){rejected=true}return rejected&&JSON.stringify(before)===JSON.stringify(await KirbySiteStore.get('active-test'))})()`);
    assert.equal(preserved,true); console.log('PASS invalid write cannot replace valid saved site');

    evaluate(`localStorage.setItem('kirby-site-project-v1','active-test');true`); reload();
    const decision = F.decision([{ type:'set_design', design:{...site.design,accent:'#779988'} }]);
    evaluate(`(()=>{const original=KirbySiteStore.put;let writes=0;KirbySiteStore.put=(...args)=>++writes===2?Promise.reject(new Error('test-quota-exceeded')):original(...args);window.fetch=async()=>new Response(JSON.stringify({ok:true,decision:${JSON.stringify(decision)}}),{headers:{'Content-Type':'application/json'}});document.querySelector('#ks-revision-text').value='Change la couleur';document.querySelector('.ks-revision').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return true})()`);
    waitFor(`document.querySelector('#ai-brief-output').getAttribute('aria-busy')==='false' && document.querySelector('#ai-brief-output').textContent.includes('test-quota-exceeded')`);
    assert.equal(evaluate(`KirbySiteStore.get('active-test').then(s=>s.site.design.accent)`),site.design.accent);
    reload(); assert.equal(metadata().frame,true);
    assert.equal(evaluate(`KirbySiteStore.get('active-test').then(s=>s.site.revision)`),1);
    console.log('PASS failed modification save retains committed site after reload');

    // Force storage failure at initialization, without touching any application files.
    evaluate(`(async()=>{KirbySiteStore.restore=async()=>{throw new Error('test-storage-unavailable')};await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='assets/kirby-site-editor.js?storage-test';s.onload=resolve;s.onerror=reject;document.body.append(s)});return true})()`);
    waitFor(`document.querySelector('#ai-brief-output').getAttribute('aria-busy')==='false'`);
    assert.equal(metadata().form,true); assert.equal(metadata().opacity,'1');
    console.log('PASS unavailable storage exposes usable fallback');
} finally { command('close'); }
