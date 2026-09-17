// Local prototype only. Mounted by server.js when SITE_JOURNEY_PROTOTYPE=1.
// No cloud storage, email, payment or generation calls.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const contract = require('../assets/kirby-site-contract');
const directory = path.join(require('node:os').tmpdir(), 'sacreationweb-site-journey');
const validId = value => /^selection-[a-f0-9]{64}$/.test(value || '');
const reply = (res, code, value) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(value));
};
async function body(req) {
    let size = 0; const chunks = [];
    for await (const chunk of req) {
        size += chunk.length;
        if (size > 40 * 1024 * 1024) throw new Error('Projet trop volumineux pour le prototype local.');
        chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
async function read(id) {
    if (!validId(id)) throw new Error('Référence de projet invalide.');
    return JSON.parse(await fs.readFile(path.join(directory, id + '.json'), 'utf8'));
}
module.exports = async function localJourney(req, res) {
    const url = new URL(req.url, 'http://localhost');
    try {
        if (url.pathname === '/api/site-selection') {
            if (req.method === 'GET') {
                try { return reply(res, 200, await read(url.searchParams.get('id'))); }
                catch (_) { return reply(res, 404, { error: 'Cette version est introuvable sur ce serveur local.' }); }
            }
            if (req.method !== 'POST') return reply(res, 405, { error: 'method_not_allowed' });
            const payload = await body(req);
            contract.validate(payload.state?.site);
            if (typeof payload.sourceProject !== 'string' || !payload.sourceProject) throw new Error('Projet source manquant.');
            const state = {
                site: payload.state.site,
                media: payload.state.media || {},
                pageId: payload.state.pageId || '',
                conversation: (payload.state.conversation || []).filter(t => t && ['user', 'assistant'].includes(t.role) && typeof t.content === 'string'),
                history: [],
            };
            const data = JSON.stringify({ sourceProject: payload.sourceProject, state });
            const id = 'selection-' + crypto.createHash('sha256').update(data).digest('hex');
            await fs.mkdir(directory, { recursive: true, mode: 0o700 });
            try { await fs.writeFile(path.join(directory, id + '.json'), JSON.stringify({ id, ...JSON.parse(data) }), { flag: 'wx', mode: 0o600 }); }
            catch (error) { if (error.code !== 'EEXIST') throw error; }
            return reply(res, 201, { id });
        }
        if (url.pathname === '/api/contact' && req.method === 'POST') {
            const payload = await body(req);
            if (!payload.firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || '') || !payload.message) throw new Error('Coordonnées ou message manquants.');
            if (payload.selectedProject) {
                const snapshot = await read(payload.selectedProject.id);
                const brief = snapshot.state.conversation.filter(t => t.role === 'user').map(t => t.content).join('\n\n');
                if (payload.selectedProject.brief !== brief || payload.selectedProject.name !== snapshot.state.site.name) throw new Error('Le contexte ne correspond pas à la version choisie.');
            }
            const id = crypto.randomUUID();
            await fs.mkdir(directory, { recursive: true, mode: 0o700 });
            await fs.writeFile(path.join(directory, 'request-' + id + '.json'), JSON.stringify(payload, null, 2), { flag: 'wx', mode: 0o600 });
            return reply(res, 200, { ok: true, prototype: true, requestId: id });
        }
        return reply(res, 404, { error: 'not_found' });
    } catch (error) { return reply(res, 400, { error: error.message || 'local_prototype_error' }); }
};
module.exports.directory = directory;
