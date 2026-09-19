/* Site-only executable contract. No CV dependency and no semantic inference. */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.KirbySiteContract = api;
}(typeof globalThis === 'object' ? globalThis : this, () => {
    'use strict';
    const protocol = 'kirby-site-v1';
    const str = { type: 'string' };
    const num = { type: 'number' };
    const integer = { type: 'integer', minimum: 0 };
    const en = (...values) => ({ type: 'string', enum: values });
    const arr = (items, maxItems = 60) => ({ type: 'array', items, maxItems });
    const obj = properties => ({ type: 'object', additionalProperties: false, required: Object.keys(properties), properties });
    const ref = name => ({ $ref: '#/$defs/' + name });
    const nullable = schema => ({ anyOf: [schema, { type: 'null' }] });
    const compositions = ['immersive-hero', 'editorial-cover', 'asymmetric-grid', 'product-stage', 'vertical-narrative', 'map-led', 'cinematic-gallery', 'split-stage', 'proof-mosaic', 'catalog-shelf', 'process-rail', 'story-chapters', 'gallery-reel', 'data-canvas', 'object-stage', 'collection-grid', 'stack'];
    const defs = {
        target: obj({ kind: en('page', 'section', 'url'), pageId: str, sectionId: str, url: str }),
        action: obj({ id: str, label: str, target: ref('target'), appearance: en('primary', 'secondary', 'text') }),
        item: obj({ label: str, value: str, detail: str, amount: nullable(num) }),
        block: obj({ id: str, target: nullable(ref('target')), type: en('text', 'image', 'metrics', 'chart', 'timeline', 'table', 'cards', 'products', 'explorer'), title: str, text: str, assetId: str, items: arr(ref('item'), 20), chartType: en('bar', 'line', 'donut'), illustrative: { type: 'boolean' }, productIds: arr(str, 100), categoryId: nullable(str), onSaleOnly: { type: 'boolean' }, explorer: nullable(ref('explorer')) }),
        visual: obj({ surface: en('transparent', 'solid', 'glass', 'ink'), depth: en('flat', 'layered', 'spatial'), motion: en('none', 'reveal', 'float'), align: en('left', 'center'), density: en('compact', 'balanced', 'airy'), imageTreatment: en('plain', 'framed', 'masked', 'filmstrip'), overlap: { type: 'boolean' } }),
        section: obj({ id: str, intentIds: arr(str, 20), coverage: en('primary', 'teaser', 'support'), kind: en('hero', 'content', 'conversion'), composition: en(...compositions), eyebrow: str, title: str, body: { ...str, description: 'Texte éditorial uniquement. Ne pas recopier prix, promotions, variantes ou stock du catalogue : le bloc products les affiche depuis la source centrale.' }, visual: ref('visual'), actions: arr(ref('action'), 6), blocks: arr(ref('block'), 16), slots: obj({ primaryMediaId: str, secondaryMediaId: str, tertiaryMediaId: str, artifactBlockIds: arr(str, 12), proofBlockIds: arr(str, 12), flowBlockIds: arr(str, 12), galleryBlockIds: arr(str, 12) }) }),
        page: obj({ id: str, path: str, title: str, description: { ...str, description: 'Résumé stable de la page, sans prix, promotion ou stock qui doivent rester uniquement dans catalog.' }, role: en('home', 'detail', 'utility'), sections: arr(ref('section'), 30) }),
        intent: obj({ id: str, meaning: str, primaryPageId: str }),
        asset: obj({ id: str, prompt: str, alt: str, aspect: en('landscape', 'portrait', 'square'), purpose: str }),
        design: obj({ canvas: str, surface: str, ink: str, muted: str, accent: str, onAccent: str, font: en('sans', 'serif', 'mono', 'geometric', 'humanist', 'display'), headingFont: en('sans', 'serif', 'mono', 'geometric', 'humanist', 'display'), radius: en('square', 'soft', 'round'), texture: en('none', 'paper', 'metal', 'grid', 'organic'), titleScale: en('restrained', 'balanced', 'expressive') }),
        navigation: obj({ presentation: en('inline', 'hamburger', 'sidebar'), items: arr(ref('action'), 20) }),
    };
    defs.explorerView = obj({ label: str, items: arr(ref('item'), 12) });
    defs.explorerPanel = obj({ id: str, label: str, title: str, text: str, presentation: en('metrics', 'list', 'steps', 'questions'), items: arr(ref('item'), 12), variants: arr(ref('explorerView'), 6) });
    defs.explorer = obj({ panels: arr(ref('explorerPanel'), 12) });
    defs.option = obj({ name: str, values: arr(str, 60) });
    defs.offer = obj({ id: str, sku: nullable(str), options: arr(ref('option'), 10), saleUnit: en('unit', 'lot'), unitsPerLot: nullable(integer), price: nullable(integer), salePrice: nullable(integer), currency: nullable(str), stockQuantity: nullable(integer), availability: en('unknown', 'available', 'unavailable', 'preorder'), assetIds: arr(str, 20) });
    defs.category = obj({ id: str, name: str, parentId: nullable(str) });
    defs.product = obj({ id: str, name: str, description: str, categoryIds: arr(str, 20), attributes: arr(obj({ name: str, value: str }), 30), assetIds: arr(str, 20), deliveryInfo: nullable(str), offers: arr(ref('offer'), 100), target: nullable(ref('target')), demonstration: { type: 'boolean' }, sources: arr(obj({ field: str, quote: str }), 100) });
    defs.catalog = obj({ categories: arr(ref('category'), 100), products: arr(ref('product'), 100) });
    defs.site = obj({ schemaVersion: en(protocol), id: str, revision: integer, name: str, language: str, project: obj({ brief: str, audience: str, objective: str, constraints: arr(str, 30) }), design: ref('design'), navigation: ref('navigation'), intents: arr(ref('intent'), 100), assets: arr(ref('asset'), 30), catalog: nullable(ref('catalog')), pages: arr(ref('page'), 30) });
    const operation = (type, properties) => obj({ type: en(type), ...properties });
    defs.operation = { anyOf: [
        operation('put_product', { product: ref('product') }), operation('remove_product', { id: str }),
        operation('put_category', { category: ref('category') }), operation('remove_category', { id: str }),
        operation('put_page', { page: ref('page'), index: integer }), operation('remove_page', { id: str }),
        operation('put_section', { pageId: str, section: ref('section'), index: integer }), operation('remove_section', { id: str }),
        operation('move_section', { id: str, pageId: str, index: integer }),
        operation('set_design', { design: ref('design') }), operation('set_navigation', { navigation: ref('navigation') }),
        operation('put_asset', { asset: ref('asset') }), operation('remove_asset', { id: str }),
        operation('put_intent', { intent: ref('intent') }), operation('remove_intent', { id: str }),
        operation('set_identity', { name: str, language: str, project: defs.site.properties.project }),
    ] };
    const responseSchema = { ...obj({ kind: en('create', 'edit', 'clarify', 'answer'), baseRevision: integer, message: str, site: nullable(ref('site')), operations: arr(ref('operation'), 80) }), $defs: defs };
    const { $defs: ignoredDefs, ...decisionShape } = responseSchema;
    const reviewSchema = { ...obj({ approved: { type: 'boolean' }, decision: nullable(decisionShape) }), $defs: defs };
    const clone = value => JSON.parse(JSON.stringify(value));
    const fail = message => { throw new Error('site_contract: ' + message); };
    function check(value, schema, path = 'root', depth = 0) {
        if (depth > 35) fail('structure too deep');
        if (schema.$ref) return check(value, defs[schema.$ref.split('/').pop()], path, depth + 1);
        if (schema.anyOf) {
            for (const branch of schema.anyOf) { try { check(value, branch, path, depth + 1); return; } catch (_) { /* next structural alternative */ } }
            fail(path + ': invalid alternative');
        }
        if (schema.type === 'null') { if (value !== null) fail(path + ': expected null'); return; }
        if (schema.type === 'object') {
            if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path + ': expected object');
            for (const key of Object.keys(value)) if (!Object.hasOwn(schema.properties, key)) fail(path + ': unknown property ' + key);
            for (const key of schema.required) { if (!Object.hasOwn(value, key) && ((schema === defs.site && key === 'catalog') || (schema === defs.block && ['target', 'productIds', 'categoryId', 'onSaleOnly', 'explorer'].includes(key)))) continue; if (!Object.hasOwn(value, key)) fail(path + ': missing ' + key); check(value[key], schema.properties[key], path + '.' + key, depth + 1); }
        } else if (schema.type === 'array') {
            if (!Array.isArray(value) || value.length > schema.maxItems) fail(path + ': invalid array');
            value.forEach((entry, i) => check(entry, schema.items, path + '[' + i + ']', depth + 1));
        } else if (schema.type === 'integer') { if (!Number.isSafeInteger(value) || value < 0) fail(path + ': invalid integer'); }
        else if (typeof value !== schema.type || (schema.type === 'number' && !Number.isFinite(value))) fail(path + ': invalid ' + schema.type);
        if (schema.enum && !schema.enum.includes(value)) fail(path + ': invalid enum');
        if (typeof value === 'string' && value.length > 20000) fail(path + ': text too large');
    }
    function validate(site) {
        check(site, defs.site);
        if (JSON.stringify(site).length > 700000) fail('site too large');
        const ids = new Set();
        const id = value => { if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(value) || ids.has(value)) fail('invalid or duplicate id: ' + value); ids.add(value); };
        id(site.id);
        if (!site.pages.length || site.pages.filter(p => p.role === 'home').length !== 1) fail('exactly one home page required');
        const paths = new Set();
        const pages = new Map(site.pages.map(p => [p.id, p]));
        const sections = new Map();
        const assets = new Set(site.assets.map(a => a.id));
        const intents = new Map(site.intents.map(i => [i.id, i]));
        for (const key of ['canvas', 'surface', 'ink', 'muted', 'accent', 'onAccent']) if (!/^#[0-9a-f]{6}$/i.test(site.design[key])) fail('invalid color: ' + key);
        site.assets.forEach(a => id(a.id));
        site.intents.forEach(i => { id(i.id); if (!pages.has(i.primaryPageId)) fail('intent page missing'); });
        site.pages.forEach(p => {
            id(p.id);
            if (!/^\/(?:[a-zA-Z0-9_-]+\/?)*$/.test(p.path) || paths.has(p.path.replace(/\/$/, '') || '/')) fail('invalid or duplicate page path');
            paths.add(p.path.replace(/\/$/, '') || '/');
            p.sections.forEach(s => { id(s.id); sections.set(s.id, p.id); s.blocks.forEach(b => id(b.id)); });
        });
        const target = t => {
            if (t.kind === 'url') { if (!/^(https:\/\/[^\s<>"']+|mailto:[^\s<>"']+|tel:[+0-9 ()-]+)$/.test(t.url) || t.pageId || t.sectionId) fail('unsafe URL target'); }
            else if (!pages.has(t.pageId) || t.url || (t.kind === 'section' ? sections.get(t.sectionId) !== t.pageId : Boolean(t.sectionId))) fail('broken target: ' + JSON.stringify(t));
        };
        const action = a => { id(a.id); target(a.target); };
        site.navigation.items.forEach(action);
        const catalog = site.catalog;
        const products = new Set((catalog?.products || []).map(p => p.id));
        if (catalog) {
            const categories = new Map(catalog.categories.map(c => [c.id, c]));
            catalog.categories.forEach(c => {
                id(c.id); const visited = new Set([c.id]); let parent = c.parentId;
                while (parent !== null) { if (!categories.has(parent) || visited.has(parent)) fail('invalid category hierarchy'); visited.add(parent); parent = categories.get(parent).parentId; }
            });
            catalog.products.forEach(p => {
                id(p.id); if (!p.name.trim() || !p.offers.length) fail('product needs name and offer');
                p.categoryIds.forEach(c => { if (!categories.has(c)) fail('missing product category'); });
                const media = list => list.forEach(a => { if (!assets.has(a)) fail('missing product asset'); });
                media(p.assetIds); if (p.target) target(p.target);
                p.offers.forEach(o => {
                    id(o.id); media(o.assetIds);
                    if ((o.price !== null || o.salePrice !== null) && !/^[A-Z]{3}$/.test(o.currency || '')) fail('price needs currency');
                    if (o.salePrice !== null && (o.price === null || o.salePrice >= o.price)) fail('sale needs higher original price');
                    if (o.saleUnit === 'unit' && o.unitsPerLot !== null) fail('unit has lot quantity');
                    if (o.unitsPerLot !== null && o.unitsPerLot < 1) fail('empty lot');
                    const names = new Set();
                    o.options.forEach(option => { if (!option.name.trim() || names.has(option.name) || !option.values.length || new Set(option.values).size !== option.values.length || option.values.some(v => !v.trim())) fail('invalid product options'); names.add(option.name); });
                    // A shared quantity cannot imply per-variant inventory/SKU.
                    if (o.options.some(option => option.values.length > 1) && (o.stockQuantity !== null || o.sku !== null)) fail('variant stock or SKU requires an exact option combination');
                });
            });
        }
        site.pages.forEach(p => p.sections.forEach(s => {
            s.actions.forEach(action);
            s.blocks.forEach(b => {
                if (b.type === 'explorer') {
                    if (!b.explorer?.panels.length) fail('explorer needs panels');
                    const panelIds = new Set();
                    b.explorer.panels.forEach(panel => {
                        if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(panel.id) || panelIds.has(panel.id) || !panel.label.trim()) fail('invalid explorer panel');
                        panelIds.add(panel.id);
                    });
                } else if (b.explorer) fail('explorer data needs explorer block');
                if (b.target) { if (b.type !== 'image') fail('only image blocks accept a target: block ' + b.id + ' (' + b.type + '); move this link to section.actions'); target(b.target); } if (b.type === 'products' && !catalog) fail('product block needs catalog'); if (b.categoryId && !catalog?.categories.some(c => c.id === b.categoryId)) fail('missing block category'); (b.productIds || []).forEach(id => { if (!products.has(id)) fail('missing product reference'); }); });
            s.intentIds.forEach(i => {
                if (!intents.has(i)) fail('unknown intent');
            });
            const blocks = new Set(s.blocks.map(b => b.id)); const assigned = new Set();
            ['artifactBlockIds', 'proofBlockIds', 'flowBlockIds', 'galleryBlockIds'].forEach(key => s.slots[key].forEach(i => { if (!blocks.has(i) || assigned.has(i)) fail('invalid or repeated block slot'); assigned.add(i); }));
            if (assigned.size !== blocks.size) fail('every block needs one explicit slot');
            [s.slots.primaryMediaId, s.slots.secondaryMediaId, s.slots.tertiaryMediaId, ...s.blocks.map(b => b.assetId)].filter(Boolean).forEach(i => { if (!assets.has(i)) fail('missing asset'); });
        }));
        return site;
    }
    function apply(current, decision) {
        check(decision, responseSchema);
        if (decision.baseRevision !== (current?.revision || 0)) fail('stale revision');
        if (['clarify', 'answer'].includes(decision.kind)) { if (decision.site || decision.operations.length) fail('non-editing response contains mutations'); return current; }
        if (decision.kind === 'create') {
            if (!decision.site || decision.operations.length || decision.site.revision !== 1 || (current && decision.site.id === current.id)) fail('invalid creation');
            return validate(clone(decision.site));
        }
        if (!current || decision.site || !decision.operations.length) fail('invalid edit');
        validate(current); const next = clone(current);
        const locate = id => { for (const p of next.pages) { const index = p.sections.findIndex(s => s.id === id); if (index >= 0) return { p, index }; } return null; };
        const put = (list, value, index = list.length) => { const existing = list.findIndex(v => v.id === value.id); if (existing >= 0) list.splice(existing, 1); if (index > list.length) fail('index out of range'); list.splice(index, 0, clone(value)); };
        const remove = (list, id) => { const index = list.findIndex(v => v.id === id); if (index < 0) fail('missing removal target'); list.splice(index, 1); };
        for (const op of decision.operations) {
            switch (op.type) {
                case 'put_product': next.catalog ||= { categories: [], products: [] }; { const list = next.catalog.products; const i = list.findIndex(p => p.id === op.product.id); put(list, op.product, i < 0 ? list.length : i); } break;
                case 'remove_product': remove(next.catalog?.products || [], op.id); break;
                case 'put_category': next.catalog ||= { categories: [], products: [] }; { const list = next.catalog.categories; const i = list.findIndex(c => c.id === op.category.id); put(list, op.category, i < 0 ? list.length : i); } break;
                case 'remove_category': remove(next.catalog?.categories || [], op.id); break;
                case 'put_page': put(next.pages, op.page, op.index); break;
                case 'remove_page': remove(next.pages, op.id); break;
                case 'put_section': { const p = next.pages.find(p => p.id === op.pageId); if (!p) fail('missing page'); const old = locate(op.section.id); if (old && old.p !== p) fail('use move_section across pages'); put(p.sections, op.section, op.index); break; }
                case 'remove_section': { const old = locate(op.id); if (!old) fail('missing section'); old.p.sections.splice(old.index, 1); break; }
                case 'move_section': { const old = locate(op.id); const p = next.pages.find(p => p.id === op.pageId); if (!old || !p) fail('missing move target'); const [s] = old.p.sections.splice(old.index, 1); if (op.index > p.sections.length) fail('move index'); p.sections.splice(op.index, 0, s); break; }
                case 'set_design': next.design = clone(op.design); break;
                case 'set_navigation': next.navigation = clone(op.navigation); break;
                case 'put_asset': { const at = next.assets.findIndex(a => a.id === op.asset.id); put(next.assets, op.asset, at < 0 ? next.assets.length : at); break; }
                case 'remove_asset': remove(next.assets, op.id); break;
                case 'put_intent': { const at = next.intents.findIndex(i => i.id === op.intent.id); put(next.intents, op.intent, at < 0 ? next.intents.length : at); break; }
                case 'remove_intent': remove(next.intents, op.id); break;
                case 'set_identity': next.name = op.name; next.language = op.language; next.project = clone(op.project); break;
                default: fail('unknown operation');
            }
        }
        next.revision = current.revision + 1;
        return validate(next);
    }
    const assetSignature = asset => JSON.stringify([asset.id, asset.prompt, asset.alt, asset.aspect, asset.purpose]);
    return { assetSignature, protocol, responseSchema, reviewSchema, siteSchema: { ...defs.site, $defs: defs }, compositions, validate, apply, check, clone };
}));
