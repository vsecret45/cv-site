'use strict';
const selections = require('../lib/site-selection');
const recent = new Map();
module.exports = async (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Referrer-Policy', 'no-referrer');
    const send = (code, body) => { response.statusCode = code; response.end(JSON.stringify(body)); };
    const host = request.headers['x-forwarded-host'] || request.headers.host;
    const url = new URL(request.url, 'https://' + host);
    if (!['GET', 'POST'].includes(request.method)) { response.setHeader('Allow', 'GET, POST'); return send(405, { error: 'method_not_allowed' }); }
    try {
        if (request.method === 'GET') return send(200, { downloadUrl: await selections.downloadUrl(url.searchParams.get('id')) });
        // Same-origin visitor flow; no cross-origin upload API or storage listing.
        if (request.headers.origin && new URL(request.headers.origin).host !== host) return send(403, { error: 'origin_not_allowed' });
        const ip = String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || '').split(',')[0];
        const now = Date.now();
        for (const [key, value] of recent) if (value.until < now) recent.delete(key);
        const usage = recent.get(ip) || { count: 0, until: now + 60000 };
        if (++usage.count > 30 || recent.size > 10000) return send(429, { error: 'Veuillez patienter avant de réessayer.' });
        recent.set(ip, usage);
        let payload = request.body;
        if (!payload) {
            const chunks = []; let bytes = 0;
            for await (const chunk of request) { bytes += chunk.length; if (bytes > 3500000) throw new Error('selection_too_large'); chunks.push(Buffer.from(chunk)); }
            payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        } else if (typeof payload === 'string' || Buffer.isBuffer(payload)) payload = JSON.parse(String(payload));
        if (Buffer.byteLength(JSON.stringify(payload)) > 3500000) throw new Error('selection_too_large');
        if (payload.mode === 'prepare') return send(200, await selections.prepareUpload());
        const id = payload.mode === 'complete' ? await selections.completeUpload(payload.uploadId) : await selections.save(payload);
        return send(201, { id });
    } catch (error) {
        const code = error.message;
        const invalid = error instanceof SyntaxError || /^(invalid_|site_contract:)/.test(code);
        const status = code === 'selection_not_found' ? 404 : code === 'selection_too_large' ? 413 : invalid ? 400 : 503;
        console.warn('Site selection:', status, invalid ? 'invalid_selection' : code);
        return send(status, { error: status === 404 ? 'Cette version est introuvable.' : status === 413 ? 'Ce projet dépasse la taille de sauvegarde autorisée.' : invalid ? 'Cette sauvegarde est invalide. Votre site reste conservé dans ce navigateur.' : 'La sauvegarde est temporairement indisponible. Votre site reste conservé dans ce navigateur.' });
    }
};
