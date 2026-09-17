'use strict';
const { randomUUID } = require('node:crypto');
function timing(report = entry => console.info('[kirby-perf]', JSON.stringify(entry)), context = {}) {
    const trace = randomUUID(); const start = performance.now(); const entries = [];
    function record(stage, since, ok = true, meta = {}) {
        const entry = { trace, ...context, stage, at: Date.now(), startedAt: Math.round(Date.now() - (performance.now() - since)), ms: Math.round((performance.now() - since) * 100) / 100, ok, ...meta };
        entries.push(entry); report(entry); return entry;
    }
    async function measure(stage, task, meta) { const t = performance.now(); try { const result = await task(); record(stage, t, true, meta); return result; } catch (e) { record(stage, t, false, meta); throw e; } }
    function sync(stage, task) { const t = performance.now(); try { const result = task(); record(stage, t); return result; } catch (e) { record(stage, t, false, { code: e.message?.startsWith('site_contract:') ? e.message.slice(0, 240) : e.name }); throw e; } }
    return { measure, sync, entries, total: () => record('total', start) };
}
module.exports = timing;
