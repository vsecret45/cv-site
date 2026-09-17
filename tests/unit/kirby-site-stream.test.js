const test=require('node:test'),assert=require('node:assert/strict');
const model=require('../../lib/kirby-site-model'),handler=require('../../api/kirby-site');
test('stream sends media preparation before reviewed result and surfaces failure without a successful result',async()=>{
 const original=model.generate;
 async function run(fail){
  model.generate=async(_,options)=>{await options.onCandidate({assets:[],design:{}});if(fail)throw new Error('test-provider-failure');return {ok:true,decision:{kind:'answer'}}};
  let text='';const headers={};const response={setHeader:(k,v)=>headers[k]=v,write:s=>text+=s,end:s=>{if(s)text+=s},flushHeaders(){}};
  await handler({method:'POST',headers:{accept:'application/x-ndjson'},body:{message:'Test'}},response);
  assert.equal(headers['Content-Type'],'application/x-ndjson');return text.trim().split('\n').map(JSON.parse);
 }
 try{assert.deepEqual((await run(false)).map(e=>e.type),['media_plan','result']);assert.deepEqual((await run(true)).map(e=>e.type),['media_plan','error']);}
 finally{model.generate=original;}
});
test('failed stream exposes a safe diagnostic reference without leaking provider details',async()=>{
 const original=model.generate;const out=[];
 model.generate=async()=>{throw new Error('private provider payload sk-secret')};
 try{await handler({method:'POST',headers:{accept:'application/x-ndjson'},body:{runId:'nova-failed-test',message:'NOVA'}},{setHeader(){},flushHeaders(){},write:s=>out.push(s),end(){}});const data=JSON.parse(out[0]).data;assert.equal(data.reference,'nova-failed-test');assert.equal(data.code,'site_generation_unavailable');assert.doesNotMatch(JSON.stringify(data),/sk-secret|private provider/)}finally{model.generate=original}
});
