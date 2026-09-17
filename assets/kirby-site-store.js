(function (root) {
    'use strict';
    let database;
    async function db() {
        if (!database) database = new Promise((resolve, reject) => {
            const request = indexedDB.open('kirby-sites-v1', 1);
            let failed = false;
            const fail = error => { failed = true; clearTimeout(timer); reject(error); };
            const timer = setTimeout(() => fail(new Error('site_storage_timeout')), 5000);
            request.onupgradeneeded = () => request.result.createObjectStore('projects');
            request.onsuccess = () => { clearTimeout(timer); if (failed) { request.result.close(); return; } request.result.onversionchange = () => { request.result.close(); database = null; }; resolve(request.result); }; request.onerror = () => fail(request.error);
            request.onblocked = () => fail(new Error('site_storage_blocked'));
        }).catch(error => { database = null; throw error; });
        return database;
    }
    async function access(mode, key, value) {
        const started = performance.now(); const database = await db();
        return new Promise((resolve, reject) => {
            const tx = database.transaction('projects', mode); const store = tx.objectStore('projects');
            const timer = setTimeout(() => { tx.abort(); reject(new Error('site_storage_timeout')); }, 5000);
            const request = mode === 'readonly' ? store.get(key) : store.put(value, key);
            // Same transaction: never replace the recoverable checkpoint with an invalid document.
            // Media are optional and regenerated if only this compact checkpoint is recoverable.
            if (mode === 'readwrite' && value.site) store.put({ ...value, media: {}, history: [] }, 'last-valid:' + key);
            tx.oncomplete = () => { clearTimeout(timer); console.info('[kirby-perf]', { stage: mode === 'readonly' ? 'indexeddb_read' : 'indexeddb_write', ms: performance.now() - started }); resolve(request.result); }; tx.onerror = () => { clearTimeout(timer); reject(tx.error); }; tx.onabort = () => { clearTimeout(timer); reject(tx.error); };
        });
    }
    function normalize(value) {
        if (!value?.site) return null;
        root.KirbySiteContract.validate(value.site);
        return { site: value.site, pageId: typeof value.pageId === 'string' ? value.pageId : '',
            conversation: Array.isArray(value.conversation) ? value.conversation.filter(t => t && ['user', 'assistant'].includes(t.role) && typeof t.content === 'string') : [],
            history: Array.isArray(value.history) ? value.history.filter(site => { try { root.KirbySiteContract.validate(site); return site.id === value.site.id; } catch (_) { return false; } }) : [],
            media: value.media && typeof value.media === 'object' && !Array.isArray(value.media) ? value.media : {} };
    }
    async function restore(key) {
        const saved = await access('readonly', key);
        try { const state = normalize(saved); if (state) return state; } catch (_) {}
        const backup = await access('readonly', 'last-valid:' + key);
        try { const recovered = normalize(backup); if (recovered) return recovered; } catch (_) {}
        // Older saved records may predate checkpoints. Only consider revisions
        // belonging to the same identified site, never another project record.
        if (typeof saved?.site?.id === 'string' && Array.isArray(saved.history)) {
            for (const site of [...saved.history].reverse()) {
                if (site?.id !== saved.site.id) continue;
                try { const previous = normalize({ ...saved, site }); if (previous) return previous; } catch (_) {}
            }
        }
        if (saved?.site) throw new Error('site_saved_invalid');
        return null;
    }
    root.KirbySiteStore = { get: restore, restore, put: (key, value) => {
        if (value.site) root.KirbySiteContract.validate(value.site);
        return access('readwrite', key, value);
    }, normalize };
}(globalThis));
