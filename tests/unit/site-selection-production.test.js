const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { Readable } = require('node:stream');
const fixtures = require('../fixtures/kirby-site.cjs');
const storage = require('../../lib/site-selection');
const api = require('../../api/site-selection');
const payload = () => ({ sourceProject: 'original-project', state: { site: fixtures.site(), media: {}, conversation: [{ role: 'user', content: 'Brief exact' }], history: [] } });
const response = () => ({ headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(value) { this.result = JSON.parse(value); } });

test('production storage is immutable, validates references and issues scoped links', async t => {
    const originalFetch = global.fetch;
    const previousUrl = process.env.SITE_SELECTION_SUPABASE_URL, previousKey = process.env.SITE_SELECTION_SUPABASE_KEY;
    process.env.SITE_SELECTION_SUPABASE_URL = 'https://storage.test'; process.env.SITE_SELECTION_SUPABASE_KEY = 'server-only-test';
    t.after(() => { global.fetch = originalFetch; if(previousUrl === undefined) delete process.env.SITE_SELECTION_SUPABASE_URL; else process.env.SITE_SELECTION_SUPABASE_URL=previousUrl; if(previousKey === undefined) delete process.env.SITE_SELECTION_SUPABASE_KEY; else process.env.SITE_SELECTION_SUPABASE_KEY=previousKey; });
    const objects = new Map();
    global.fetch = async (url, options = {}) => {
        assert.equal(options.headers.apikey, 'server-only-test');
        const route = new URL(url).pathname.replace('/storage/v1', '');
        if (route.startsWith('/object/upload/sign/')) return Response.json({ url: route + '?token=scoped-upload' });
        if (route.startsWith('/object/sign/')) return Response.json({ signedURL: route + '?token=short-lived' });
        if (route.startsWith('/object/authenticated/')) return objects.has(route.replace('/object/authenticated/','')) ? Response.json(objects.get(route.replace('/object/authenticated/',''))) : Response.json({}, { status: 404 });
        if (options.method === 'DELETE') { for(const key of JSON.parse(options.body).prefixes) objects.delete(storage.bucket + '/' + key); return Response.json({}); }
        const key=route.replace('/object/','');
        assert.equal(options.headers['x-upsert'], 'false');
        if(objects.has(key))return Response.json({ error:'Duplicate' },{status:409});
        objects.set(key,JSON.parse(options.body)); return Response.json({});
    };
    const source = payload();
    const first = await storage.save(source); assert.equal(await storage.save(source), first);
    source.state.site.name = 'Another generation'; const second = await storage.save(source); assert.notEqual(first, second);
    const recovered = await storage.read(first); assert.equal(recovered.state.site.name, 'Atelier'); assert.equal(recovered.state.conversation[0].content, 'Brief exact');
    assert.match(await storage.downloadUrl(first), /token=short-lived/);
    const prepared=await storage.prepareUpload(); assert.match(prepared.uploadId,/^upload-[a-f0-9]{64}$/);
    objects.set(storage.bucket+'/pending/'+prepared.uploadId+'.json',payload());
    assert.equal(await storage.completeUpload(prepared.uploadId),first);
    assert.equal(objects.has(storage.bucket+'/pending/'+prepared.uploadId+'.json'),false);
    await assert.rejects(storage.read('../secret'),/invalid_selection/);
    await assert.rejects(storage.read('selection-'+'f'.repeat(64)),/selection_not_found/);
    const bad=payload();bad.state.media.x={signature:'x',url:'javascript:alert(1)'};
    await assert.rejects(storage.save(bad),/invalid_selection_media/);

    // Vercel supplies a parsed request.body; local Node supplies a stream.
    for(const request of [{ method:'POST',headers:{host:'site.test',origin:'https://site.test'},body:payload() },Object.assign(Readable.from([JSON.stringify(payload())]),{method:'POST',headers:{host:'site.test'}})]) {
        const res=response();await api(request,res);assert.equal(res.statusCode,201);assert.equal(res.result.id,first);
    }
    const denied=response(); await api({method:'POST',headers:{host:'site.test',origin:'https://unrelated.test'},body:payload()},denied);assert.equal(denied.statusCode,403);
    const get=response();await api({method:'GET',url:'/?id='+first,headers:{host:'site.test'}},get);assert.equal(get.statusCode,200);assert.ok(get.result.downloadUrl);assert.equal(get.headers['Cache-Control'],'no-store');
});

test('Contact accepts parsed Vercel body and sends only a matching saved selection', async () => {
    const saved=storage.snapshot(payload()); let deliveries=0;
    const ctx={ module:{exports:{}}, Buffer, console, process:{env:{SMTP_HOST:'mail.test',SMTP_USER:'contact@test.test',SMTP_PASS:'test'}},require(name){if(name==='nodemailer')return {createTransport:()=>({sendMail:async message=>{deliveries++;assert.match(message.text,/Brief exact/);}})};if(name==='../lib/site-selection')return {read:async id=>{assert.equal(id,saved.id);return saved}};throw Error(name);}};
    vm.runInNewContext(fs.readFileSync(require.resolve('../../api/contact'),'utf8'),ctx);
    const selectedProject={id:saved.id,name:saved.state.site.name,siteId:saved.state.site.id,revision:saved.state.site.revision,sourceProject:saved.sourceProject,brief:'Brief exact',plan:'Signature'};
    const request={method:'POST',body:{email:'test@example.com',firstName:'Test',message:'Brief exact',selectedProject}};
    const ok=response();await ctx.module.exports(request,ok);assert.equal(ok.statusCode,200);assert.equal(deliveries,1);
    selectedProject.name='Wrong version';const bad=response();await ctx.module.exports(request,bad);assert.equal(bad.statusCode,400);assert.equal(deliveries,1);
    delete request.body.selectedProject;const direct=response();await ctx.module.exports(request,direct);assert.equal(direct.statusCode,200);assert.equal(deliveries,2);
});
