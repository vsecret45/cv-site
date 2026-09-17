'use strict';
const { randomUUID } = require('node:crypto');
const model = require('../lib/kirby-site-model');
module.exports = async function kirbySite(request, response) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    let streaming = false; let reference = randomUUID();
    const event = (type, data) => { if (!response.destroyed) response.write(JSON.stringify({ type, data }) + '\n'); };
    const send = (status, body) => { response.statusCode = status; response.end(JSON.stringify(body)); };
    if (request.method === 'GET' || request.method === 'HEAD') return send(200, { ok: true, service: 'kirby-site' });
    if (request.method !== 'POST') return send(405, { ok: false, error: 'method_not_allowed' });
    try {
        let payload = request.body;
        if (!payload) {
            const chunks = []; let bytes = 0;
            for await (const chunk of request) { bytes += chunk.length; if (bytes > 1500000) throw new Error('site_request_too_large'); chunks.push(Buffer.from(chunk)); }
            payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        } else if (typeof payload === 'string' || Buffer.isBuffer(payload)) payload = JSON.parse(String(payload));
        if (JSON.stringify(payload).length > 1500000) throw new Error('site_request_too_large');
        if (/^[a-zA-Z0-9_-]{1,80}$/.test(payload.runId || '')) reference = payload.runId;
        payload.runId = reference;
        streaming = payload.mode !== 'media' && String(request.headers?.accept || '').includes('application/x-ndjson');
        if (streaming) { response.setHeader('Content-Type', 'application/x-ndjson'); response.flushHeaders?.(); }
        const result = payload.mode === 'media' ? await model.generateMedia(payload) : await model.generate(payload, streaming ? { onCandidate: candidate => event('media_plan', candidate) } : {});
        if (streaming) { event('result', result); return response.end(); }
        return send(200, result);
    } catch (error) {
        const technical = error instanceof SyntaxError || /^(site_contract:|invalid_|site_.*too_large)/.test(error.message);
        const code = error.message.startsWith('site_contract:') ? 'site_contract' : /^(openai_http_\d+|openai_incomplete|openai_refused|site_deadline|site_key_unavailable|invalid_site_request|invalid_conversation|site_context_too_large)$/.test(error.message) ? error.message : error.name === 'TimeoutError' ? 'provider_timeout' : 'site_generation_unavailable';
        console.warn('Kirby site request failed:', { reference, code, detail: technical ? error.message.slice(0, 240) : code });
        const message = `La génération n’a pas abouti. Votre site précédent est conservé. Référence : ${reference}.`;
        if (streaming) { event('error', { message, reference, code }); return response.end(); }
        return send(technical ? 400 : 502, { ok: false, error: technical ? error.message : 'site_generation_unavailable', message, reference, code });
    }
};
