'use strict';
const crypto = require('node:crypto');
const contract = require('../assets/kirby-site-contract');
const bucket = 'kirby-site-selections';
const maxBytes = 40 * 1024 * 1024;
const validId = id => /^selection-[a-f0-9]{64}$/.test(id || '');
const validUpload = id => /^upload-[a-f0-9]{64}$/.test(id || '');
function configuration() {
    const url = process.env.SITE_SELECTION_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SITE_SELECTION_SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('selection_storage_unavailable');
    return { url: url.replace(/\/$/, '') + '/storage/v1', key };
}
async function storage(route, options = {}) {
    const { url, key } = configuration();
    return fetch(url + route, { ...options, headers: { apikey: key, Authorization: 'Bearer ' + key, ...options.headers }, signal: AbortSignal.timeout(30000) });
}
async function limitedJson(response) {
    if (Number(response.headers.get('content-length')) > maxBytes) throw new Error('selection_too_large');
    let bytes = 0; const chunks = [];
    for await (const chunk of response.body) { bytes += chunk.length; if (bytes > maxBytes) throw new Error('selection_too_large'); chunks.push(Buffer.from(chunk)); }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function snapshot(payload) {
    if (!payload || typeof payload.sourceProject !== 'string' || !payload.sourceProject || payload.sourceProject.length > 200) throw new Error('invalid_selection');
    contract.validate(payload.state?.site);
    const supplied = payload.state;
    const media = supplied.media || {};
    if (typeof media !== 'object' || Array.isArray(media)) throw new Error('invalid_selection');
    for (const [id, value] of Object.entries(media)) {
        if (id.length > 200 || !value || typeof value.signature !== 'string' || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value.url || '')) throw new Error('invalid_selection_media');
    }
    if (!Array.isArray(supplied.conversation) || supplied.conversation.some(t => !t || !['user', 'assistant'].includes(t.role) || typeof t.content !== 'string')) throw new Error('invalid_selection_brief');
    const state = { site: supplied.site, media, pageId: typeof supplied.pageId === 'string' ? supplied.pageId : '', conversation: supplied.conversation.map(t => ({ role: t.role, content: t.content })), history: [] };
    const data = JSON.stringify({ sourceProject: payload.sourceProject, state });
    if (Buffer.byteLength(data) > maxBytes) throw new Error('selection_too_large');
    return { id: 'selection-' + crypto.createHash('sha256').update(data).digest('hex'), sourceProject: payload.sourceProject, state };
}
async function save(payload) {
    const value = snapshot(payload);
    const result = await storage(`/object/${bucket}/${value.id}.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-upsert': 'false' }, body: JSON.stringify(value) });
    if (!result.ok) {
        const error = await result.json().catch(() => ({}));
        if (result.status !== 409 && error.statusCode !== '409' && error.error !== 'Duplicate') throw new Error('selection_storage_unavailable');
    }
    return value.id;
}
async function read(id) {
    if (!validId(id)) throw new Error('invalid_selection');
    const result = await storage(`/object/authenticated/${bucket}/${id}.json`);
    if (!result.ok) throw new Error(result.status === 404 || result.status === 400 ? 'selection_not_found' : 'selection_storage_unavailable');
    const value = await limitedJson(result);
    if (snapshot(value).id !== id) throw new Error('invalid_selection');
    return value;
}
async function downloadUrl(id) {
    if (!validId(id)) throw new Error('invalid_selection');
    const result = await storage(`/object/sign/${bucket}/${id}.json`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }) });
    if (!result.ok) throw new Error(result.status === 404 || result.status === 400 ? 'selection_not_found' : 'selection_storage_unavailable');
    const data = await result.json();
    return configuration().url + data.signedURL;
}
async function prepareUpload() {
    const uploadId = 'upload-' + crypto.randomBytes(32).toString('hex');
    const result = await storage(`/object/upload/sign/${bucket}/pending/${uploadId}.json`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    if (!result.ok) throw new Error('selection_storage_unavailable');
    return { uploadId, uploadUrl: configuration().url + (await result.json()).url };
}
async function completeUpload(uploadId) {
    if (!validUpload(uploadId)) throw new Error('invalid_selection');
    const key = `pending/${uploadId}.json`;
    const result = await storage(`/object/authenticated/${bucket}/${key}`);
    if (!result.ok) throw new Error('selection_not_found');
    try { return await save(await limitedJson(result)); }
    finally { await storage(`/object/${bucket}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [key] }) }).catch(() => {}); }
}
module.exports = { bucket, maxBytes, validId, snapshot, save, read, downloadUrl, prepareUpload, completeUpload };
