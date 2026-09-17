const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const handler = require('../../lib/site-journey-local');
const fixtures = require('../fixtures/kirby-site.cjs');
const contract = require('../../assets/kirby-site-contract');

test('local immutable snapshots, independent client recovery and simulated Contact', async t => {
    const server = http.createServer(handler);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const base = 'http://127.0.0.1:' + server.address().port;
    const send = (route, value) => fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
    const state = { site: fixtures.site(), media: {}, history: [], conversation: [{ role: 'user', content: 'Mon brief exact\nAvec ses précisions.' }, { role: 'assistant', content: 'Site créé.' }] };
    const capture = async () => {
        const response = await send('/api/site-selection', { sourceProject: 'journey-test', state });
        assert.equal(response.status, 201);
        return (await response.json()).id;
    };
    const id = await capture();
    assert.equal(await capture(), id, 'same exact state retains its identifier');
    state.site.name = 'Une autre génération'; state.site.revision++;
    const laterId = await capture();
    assert.notEqual(id, laterId);
    const snapshot = await (await fetch(base + '/api/site-selection?id=' + id)).json();
    assert.equal(snapshot.state.site.name, 'Atelier');
    assert.equal(snapshot.state.site.revision, 1);
    assert.equal(snapshot.state.conversation[0].content, 'Mon brief exact\nAvec ses précisions.');
    assert.equal((await fetch(base + '/api/site-selection?id=../../.env')).status, 404);
    assert.equal((await send('/api/site-selection', { state: { site: {} } })).status, 400);
    const script = await fs.readFile(path.join(__dirname, '../../assets/site-journey.js'), 'utf8');
    const contactScript = (await fs.readFile(path.join(__dirname, '../../script.js'), 'utf8')).split('if (contactForm) {')[1].split('\nif (cards.length > 0)')[0];
    // Execute the actual Contact branch against a minimal DOM, no real browser or email.
    for (const plan of ['Signature', '', 'Inconnue']) {
        const elements = new Map();
        const element = () => ({ children: [], style: {}, dataset: {}, value: '', textContent: '', append(...nodes) { this.children.push(...nodes); } });
        const project = { ...element(), required: true, previousElementSibling: element(), nextElementSibling: element() };
        const button = element(), status = element(), service = element();
        let submit;
        const form = { querySelector(selector) { return { '[name="project"]': project, '[type="submit"]': button, '[name="service"]': service }[selector] || null; }, prepend(node) { elements.set('summary', node); }, addEventListener(event, fn) { if (event === 'submit') submit = fn; }, reset() {} };
        const search = '?selection=' + id + (plan ? '&formule=' + plan : '');
        let sent;
        const context = { URL, URLSearchParams, location: { search, href: base + '/contact.html' + search }, document: { getElementById: id => ({ 'contact-form': form, 'contact-form-status': status })[id] || null, querySelector: () => null, createElement: element }, KirbySiteContract: contract, KirbySiteStore: { put: async (key, data) => elements.set(key, data) }, fetch: async (url, options) => { if (url === '/api/contact') sent = JSON.parse(options.body); return fetch(new URL(url, base), options); }, FormData: class { get(name) { return { name: 'Client Test', email: 'test@example.com', phone: '0102030405', project: 'WhatsApp' }[name] || ''; } }, contactForm: form, contactFormStatus: status };
        context.window = context;
        vm.createContext(context); vm.runInContext(script, context);
        vm.runInContext('if (contactForm) {' + contactScript, context);
        const selected = await context.KirbyProjectContact;
        assert.equal(selected.id, id); assert.equal(project.required, false);
        assert.equal(project.value, '', 'generic description is not prefilled');
        assert.equal(button.disabled, false);
        assert.equal(selected.plan, plan === 'Signature' ? 'Signature' : undefined);
        assert.equal(elements.get(id).site.name, 'Atelier', 'new client hydrates exact saved version');
        assert.equal(elements.get('summary').children[1].textContent, 'Atelier');
        await submit({ preventDefault() {} });
        assert.match(sent.message, /Mon brief exact\nAvec ses précisions/);
        assert.match(sent.message, /WhatsApp/); assert.match(sent.message, /0102030405/);
        assert.ok(sent.message.includes(id)); assert.ok(sent.message.includes(base + '/site-preview.html?project=' + id));
        assert.equal(sent.message.includes('Formule envisagée :'), plan === 'Signature');
        assert.equal(status.textContent, 'Test local : demande enregistrée, aucun e-mail envoyé.');
    }
    const badContact = await send('/api/contact', { firstName: 'Test', email: 'test@example.com', message: 'Test', selectedProject: { id, name: 'Incorrect', brief: '' } });
    assert.equal(badContact.status, 400);
});

test('only the choose action retains the displayed version and an explicit offer', async () => {
    const script = await fs.readFile(path.join(__dirname, '../../assets/site-journey.js'), 'utf8');
    for (const plan of ['Signature', '']) {
        const clicks = {}; const nodes = {};
        for (const key of ['choose', 'status']) nodes[key] = { addEventListener(event, fn) { clicks[key] = fn; }, focus() {}, select() {} };
        const frame = { src: 'http://localhost/site-preview.html?project=displayed-project&page=%2Ffonctionnement' };
        let attached = false, assigned, saved;
        const state = { site: fixtures.site(), conversation: [{ role: 'user', content: 'Original brief' }], media: {} };
        const id = 'selection-' + 'a'.repeat(64);
        const output = { dataset: { siteMode: 'ready' }, getAttribute: () => 'false', querySelector(selector) { return { 'iframe.ks-preview': frame, '[data-project-actions]': attached, '.ks-chat-panel': { prepend() { attached = true; } } }[selector]; } };
        const context = { URL, URLSearchParams, location: { search: plan ? '?formule=' + plan : '', href: 'http://localhost/index.html', assign(url) { assigned = url; } }, document: { body: { dataset: { kirbySite: 'v1' } }, getElementById: id => id === 'ai-brief-output' ? output : null, createElement: () => ({ dataset: {}, style: {}, querySelector: selector => nodes[selector.match(/data-project-(\w+)/)[1]], querySelectorAll: () => [nodes.choose] }) }, MutationObserver: class { observe() {} }, KirbySiteStore: { get: async key => { assert.equal(key, 'displayed-project'); return state; } }, fetch: async (url, options) => { assert.equal(url, '/api/site-selection'); saved = JSON.parse(options.body); return { ok: true, headers: { get: () => 'application/json' }, json: async () => ({ id }) }; } };
        context.window = context; vm.createContext(context); vm.runInContext(script, context);
        assert.equal(clicks.share, undefined);
        assert.doesNotMatch(script, /data-project-share|data-project-link|clipboard|>Partager</);
        await clicks.choose();
        assert.deepEqual(saved.state, state);
        const destination = new URL(assigned);
        assert.equal(destination.pathname, '/contact.html');
        assert.equal(destination.searchParams.get('selection'), id);
        assert.equal(destination.searchParams.get('formule'), plan || null);
        output.dataset.siteMode = 'progressive'; saved = null;
        await clicks.choose(); assert.equal(saved, null, 'unfinished images cannot be frozen');
    }
});

test('direct Contact keeps the existing form; missing selection cannot be submitted', async () => {
    const script = await fs.readFile(path.join(__dirname, '../../assets/site-journey.js'), 'utf8');
    let accesses = 0;
    const direct = { URLSearchParams, location: { search: '' }, document: { getElementById: id => id === 'contact-form' ? { querySelector() { accesses++; } } : null } };
    direct.window = direct; vm.createContext(direct); vm.runInContext(script, direct);
    assert.equal(accesses, 0); assert.equal(direct.KirbyProjectContact, undefined);
    const field = { style: {}, previousElementSibling: {}, nextElementSibling: {} }, button = {}, status = {};
    const missing = { URLSearchParams, location: { search: '?selection=selection-' + 'b'.repeat(64) }, document: { getElementById: id => ({ 'contact-form': { querySelector: selector => selector === '[type="submit"]' ? button : field }, 'contact-form-status': status })[id] }, fetch: async () => ({ ok: false, json: async () => ({ error: 'missing' }) }) };
    missing.window = missing; vm.createContext(missing); vm.runInContext(script, missing);
    assert.equal(await missing.KirbyProjectContact, null); assert.equal(button.disabled, true);
    assert.match(status.textContent, /introuvable/);
});
