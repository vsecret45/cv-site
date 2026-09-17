const {execFileSync}=require('node:child_process'); const assert=require('node:assert/strict');const F=require('../fixtures/kirby-site.cjs');
const cli=process.env.AGENT_BROWSER_CLI;if(!cli)throw new Error('Set AGENT_BROWSER_CLI');
const cmd=(...args)=>execFileSync(process.execPath,[cli,'--session','kirby-image-batch-tests',...args],{encoding:'utf8'});
const ev=code=>JSON.parse(execFileSync(process.execPath,[cli,'--session','kirby-image-batch-tests','eval','--stdin'],{input:code,encoding:'utf8'}));
const wait=expr=>ev(`new Promise((resolve,reject)=>{const start=Date.now(),t=setInterval(()=>{if(${expr}){clearInterval(t);resolve(true)}else if(Date.now()-start>10000){clearInterval(t);reject(new Error('batch timeout'))}},30)})`);
const fail = process.env.KIRBY_TEST_IMAGE_FAILURE === '1';
const site=F.site();site.assets=Array.from({length:5},(_,i)=>({id:'image-'+i,prompt:'Photo '+i,alt:'Visuel '+i,purpose:'Illustration',aspect:'landscape'}));
try{
cmd('open',process.env.KIRBY_TEST_URL||'http://127.0.0.1:8002/#kirby-assistant');cmd('snapshot','-i');
ev(`(()=>{window.batchCalls=[];window.releases=[];window.perfEvents=[];const info=console.info;console.info=(...args)=>{if(args[0]==='[kirby-perf]')perfEvents.push(args[1]);info(...args)};
const site=${JSON.stringify(site)};window.fetch=async(_,opts)=>{const p=JSON.parse(opts.body);if(p.mode==='media'){batchCalls.push({id:p.asset.id,start:performance.now()});if(${fail}&&p.asset.id==='image-0'&&batchCalls.length===1)return new Response(JSON.stringify({ok:false,message:'test-image-failure'}),{status:503,headers:{'Content-Type':'application/json'}});return new Promise(resolve=>releases.push(()=>resolve(new Response(JSON.stringify({ok:true,media:{id:p.asset.id,url:'data:image/png;base64,iVBORw0KGgo=',signature:KirbySiteContract.assetSignature(p.asset)}}),{headers:{'Content-Type':'application/json'}}))))}
const decision={kind:'create',baseRevision:0,message:'Créé',site,operations:[]};return new Response(new ReadableStream({start(c){const enc=new TextEncoder();c.enqueue(enc.encode(JSON.stringify({type:'media_plan',data:{assets:site.assets,design:site.design}})+'\\n'));setTimeout(()=>{c.enqueue(enc.encode(JSON.stringify({type:'result',data:{ok:true,decision}})+'\\n'));c.close()},80)}}),{headers:{'Content-Type':'application/x-ndjson'}})};
document.querySelector('#ai-brief-input').value='Test de cinq visuels';document.querySelector('#ai-brief-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return true})()`);
wait('batchCalls.length===5');assert.equal(ev('releases.length'),fail?4:5);assert.equal(ev('perfEvents.filter(e=>e.stage==="image_complete").length'),fail?1:0);
console.log('PASS all five images start before any image completes');
ev('releases.forEach(release=>release());true');wait('perfEvents.some(e=>e.stage==="generation_total")');
assert.equal(ev('batchCalls.length'),5);assert.equal(ev('perfEvents.filter(e=>e.stage==="image_complete").length'),5);
assert.equal(ev('perfEvents.filter(e=>e.stage==="image_batch").length'),1);
assert.equal(ev('perfEvents.find(e=>e.stage==="generation_total").ok'),!fail);
assert.equal(ev('new Set(perfEvents.filter(e=>e.stage==="image_complete").map(e=>e.runId)).size'),1);
console.log('PASS no duplicated requests; per-image, batch and total correlated logs');
if(fail){assert.equal(ev('perfEvents.find(e=>e.stage==="generation_total").failed'),1);console.log('PASS failed speculative image is not automatically requested again');}
}finally{cmd('close')}
