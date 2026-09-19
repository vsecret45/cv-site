(function (root, factory) {
    const api = factory(typeof module === 'object' && module.exports ? require('../kirby-composition-engine') : root.KirbyCompositionEngine, typeof module === 'object' && module.exports ? require('./kirby-site-contract') : root.KirbySiteContract); if (typeof module === 'object' && module.exports) module.exports = api; else root.KirbySiteRenderer = api;
}(globalThis, (engine, contract) => {
    'use strict';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const url = (project, page, section = '') => `site-preview.html?project=${encodeURIComponent(project)}&page=${encodeURIComponent(page.path)}${section ? '#' + encodeURIComponent(section) : ''}`;
    const signature = contract.assetSignature;
    function href(target, site, project) {
        if (target.kind === 'url') return target.url;
        return url(project, site.pages.find(p => p.id === target.pageId), target.kind === 'section' ? target.sectionId : '');
    }
    function action(a, context) { return `<a data-action-id="${esc(a.id)}" class="ks-action ks-action-${a.appearance}" href="${esc(href(a.target, context.site, context.project))}">${esc(a.label)}</a>`; }
    function media(id, context) {
        if (!id) return '';
        const asset = context.site.assets.find(a => a.id === id); if (!asset) return '';
        const loaded = context.media?.[id];
        const valid = loaded?.signature === signature(asset) && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(loaded.url);
        return `<figure class="ks-media ks-media-${asset.aspect}" data-asset-id="${esc(id)}">${valid ? `<img src="${loaded.url}" alt="${esc(asset.alt)}" loading="${context.priority ? 'eager' : 'lazy'}" decoding="async">` : `<div class="ks-media-pending" role="img" aria-label="${esc(asset.alt)}"><span>Média en préparation</span></div>`}</figure>`;
    }
    function chart(b) {
        const values = b.items.map(i => i.amount ?? 0); const max = Math.max(1, ...values.map(Math.abs));
        const rows = b.items.map((i, n) => `<div class="ks-chart-row"><span>${esc(i.label)}</span><i style="--bar:${Math.abs(values[n]) / max * 100}%"></i><strong>${esc(i.value || String(values[n]))}</strong></div>`).join('');
        if (b.chartType === 'line') {
            const points = values.map((v, i) => `${20 + i / Math.max(1, values.length - 1) * 560},${160 - v / max * 135}`).join(' ');
            return `<svg class="ks-line-chart" viewBox="0 0 600 190" role="img" aria-label="${esc(b.title)}"><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3" vector-effect="non-scaling-stroke"/></svg><div class="ks-chart-legend">${b.items.map(i => `<span>${esc(i.label)} <b>${esc(i.value)}</b></span>`).join('')}</div>`;
        }
        if (b.chartType === 'donut') {
            const total = values.reduce((sum, v) => sum + Math.max(0, v), 0) || 1; let cursor = 0;
            const arcs = values.map((v, i) => { const length = Math.max(0, v) / total * 100; const arc = `<circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="10" pathLength="100" stroke-dasharray="${length} ${100 - length}" stroke-dashoffset="${-cursor}" opacity="${1 - i / Math.max(values.length, 1) * .65}"/>`; cursor += length; return arc; }).join('');
            return `<div class="ks-donut"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(b.title)}">${arcs}</svg><div>${rows}</div></div>`;
        }
        return `<div class="ks-bars">${rows}</div>`;
    }
    function price(offer, language = 'fr') {
        if (offer.price === null) return '';
        const money = n => new Intl.NumberFormat(language, { style: 'currency', currency: offer.currency }).format(n / 100);
        return `<p class="ks-product-price">${offer.salePrice !== null ? `<span class="ks-sale-label">Soldé</span> <del aria-label="Prix habituel">${esc(money(offer.price))}</del> ` : ''}<strong>${esc(money(offer.salePrice ?? offer.price))}</strong>${offer.saleUnit === 'lot' ? ` <small>le lot${offer.unitsPerLot !== null ? ` de ${offer.unitsPerLot}` : ''}</small>` : ''}</p>`;
    }
    function gallery(ids, context, name = '') {
        const images = [...new Set(ids)].filter(id => context.site.assets.some(a => a.id === id));
        return `<div class="ks-gallery-views">${images.map((id, index) => `<div data-gallery-view="${index}"${index ? ' hidden' : ''}>${media(id, context)}</div>`).join('')}</div>${images.length > 1 ? `<div class="ks-gallery-thumbnails" role="group" aria-label="Photos de ${esc(name)}">${images.map((id, index) => `<button type="button" data-gallery-index="${index}" aria-label="Afficher la photo ${index + 1} de ${esc(name)}" aria-pressed="${index === 0}">${media(id, { ...context, priority: false })}</button>`).join('')}</div>` : ''}`;
    }
    function product(p, context, detail) {
        const offers = p.offers;
        const offer = detail ? offers[0] : [...offers].sort((a,b) => (a.salePrice ?? a.price ?? Infinity) - (b.salePrice ?? b.price ?? Infinity))[0];
        const imageIds = p.assetIds.length ? p.assetIds : offer.assetIds;
        const targetPage = p.target && (p.target.kind === 'url' || p.target.pageId !== context.pageId);
        const link = p.target ? href(p.target, context.site, context.project) : '';
        const title = `<h3>${esc(p.name)}</h3>`;
        const options = new Map(); offers.forEach(o => o.options.forEach(v => options.set(v.name, [...new Set([...(options.get(v.name) || []), ...v.values])])));
        const controls = detail ? [...options].map(([name, values]) => `<label>${esc(name)}<select data-product-option="${esc(name)}">${values.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`).join('') : '';
        return `<div class="ks-product ${detail ? 'ks-product-detail' : 'ks-product-card'}" data-product-id="${esc(p.id)}" data-category-ids="${esc(JSON.stringify(p.categoryIds))}">${(imageIds.length || (detail && offers.some(o => o.assetIds.length))) ? `<div class="ks-product-gallery">${!detail && link ? `<a href="${esc(link)}" aria-label="Voir ${esc(p.name)}">${media(imageIds[0], context)}</a>` : detail ? gallery(imageIds, context, p.name) : media(imageIds[0], context)}</div>` : ''}<div class="ks-product-info">${!detail && link ? `<a href="${esc(link)}">${title}</a>` : title}${p.demonstration ? '<small>Données de démonstration</small>' : ''}<div data-product-price>${!detail && new Set(offers.map(o => String(o.salePrice ?? o.price) + o.currency)).size > 1 ? '<small>À partir de</small>' : ''}${price(offer, context.site.language)}</div>${controls}${detail ? '<p data-product-availability aria-live="polite"></p>' : ''}${detail ? `${p.description ? `<p>${esc(p.description)}</p>` : ''}<dl>${p.attributes.map(a => `<dt>${esc(a.name)}</dt><dd>${esc(a.value)}</dd>`).join('')}</dl>${p.deliveryInfo ? `<p>${esc(p.deliveryInfo)}</p>` : ''}` : ''}${link && (!detail || targetPage) ? `<a class="${detail ? 'ks-action ks-action-primary' : 'ks-product-link'}" href="${esc(link)}">${detail ? 'Contacter' : 'Voir le produit'}</a>` : ''}</div></div>`;
    }
    function explorerItems(items, presentation) {
        if (presentation === 'questions') return `<div class="ks-explorer-questions">${items.map(item => `<details><summary>${esc(item.label)}</summary><p>${esc(item.value)}</p>${item.detail ? `<small>${esc(item.detail)}</small>` : ''}</details>`).join('')}</div>`;
        const tag = presentation === 'steps' ? 'ol' : 'ul';
        return `<${tag} class="ks-explorer-items ks-explorer-${presentation}">${items.map(item => `<li><span>${esc(item.label)}</span>${item.value ? `<strong>${esc(item.value)}</strong>` : ''}${item.detail ? `<p>${esc(item.detail)}</p>` : ''}</li>`).join('')}</${tag}>`;
    }
    function explorer(b) {
        const panels = b.explorer.panels;
        const prefix = `ks-explorer-${b.id}`;
        return `<div class="ks-explorer" data-explorer><div class="ks-explorer-tabs" role="tablist" aria-label="${esc(b.title || 'Fonctions')}">${panels.map((panel, i) => `<button type="button" role="tab" id="${prefix}-tab-${panel.id}" aria-controls="${prefix}-panel-${panel.id}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}" data-explorer-tab="${panel.id}">${esc(panel.label)}</button>`).join('')}</div>${panels.map((panel, i) => `<div role="tabpanel" class="ks-explorer-panel" id="${prefix}-panel-${panel.id}" aria-labelledby="${prefix}-tab-${panel.id}" data-explorer-panel="${panel.id}" tabindex="0"${i ? ' hidden' : ''}><h4>${esc(panel.title || panel.label)}</h4>${panel.text ? `<p>${esc(panel.text)}</p>` : ''}${panel.items.length ? explorerItems(panel.items, panel.presentation) : ''}${panel.variants.length ? `<label class="ks-explorer-profile">Profil de démonstration<select data-explorer-variant>${panel.variants.map((v, n) => `<option value="${n}">${esc(v.label)}</option>`).join('')}</select></label>${panel.variants.map((v, n) => `<div data-explorer-view="${n}"${n ? ' hidden' : ''}>${explorerItems(v.items, panel.presentation)}</div>`).join('')}` : ''}</div>`).join('')}</div>`;
    }
    function block(b, context) {
        let body = '';
        if (b.type === 'products') {
            const catalog = context.site.catalog;
            const categories = new Set(b.categoryId ? [b.categoryId] : []);
            if (b.categoryId) for (let i=0; i<catalog.categories.length; i++) catalog.categories.forEach(c => { if (categories.has(c.parentId)) categories.add(c.id); });
            const selected = (b.productIds?.length ? b.productIds.map(id => catalog.products.find(p => p.id === id)) : catalog.products).filter(p => (!b.categoryId || p.categoryIds.some(id => categories.has(id))) && (!b.onSaleOnly || p.offers.some(o => o.salePrice !== null)));
            body = `${!b.categoryId && (!b.productIds?.length || selected.length === catalog.products.length) && selected.length > 1 && catalog.categories.length ? `<label class="ks-category-filter">Catégorie<select data-catalog-category><option value="">Toutes les catégories</option>${catalog.categories.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label>` : ''}<div class="ks-products">${selected.map(p => product(p, context, p.target?.pageId === context.pageId && p.target?.kind === 'page')).join('')}</div>`;
        }
        else if (b.type === 'explorer') body = explorer(b);
        else if (b.type === 'image') body = media(b.assetId, context) + (b.items.length ? `<div class="ks-items">${b.items.map(i => `<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong><p>${esc(i.detail)}</p></div>`).join('')}</div>` : '');
        else if (b.type === 'chart') body = chart(b);
        else if (b.type === 'table') body = `<div class="ks-table-scroll"><table><tbody>${b.items.map(i => `<tr><th scope="row">${esc(i.label)}</th><td>${esc(i.value)}</td><td>${esc(i.detail)}</td></tr>`).join('')}</tbody></table></div>`;
        else if (b.type === 'timeline') body = `<ol class="ks-timeline">${b.items.map(i => `<li><strong>${esc(i.label)}</strong><span>${esc(i.value)}</span><p>${esc(i.detail)}</p></li>`).join('')}</ol>`;
        else if (b.items.length) body = `<div class="ks-items">${b.items.map(i => `<div><span>${esc(i.label)}</span>${i.value ? `<strong>${esc(i.value)}</strong>` : ''}${i.detail ? `<p>${esc(i.detail)}</p>` : ''}</div>`).join('')}</div>`;
        return `<article class="ks-block ks-block-${b.type}" data-block-id="${esc(b.id)}">${b.target && b.type === 'image' ? `<a class="ks-image-link" href="${esc(href(b.target, context.site, context.project))}">` : ''}${b.title ? `<h3>${esc(b.title)}</h3>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}${body}${b.target && b.type === 'image' ? '</a>' : ''}${b.illustrative ? '<small class="ks-illustrative">Données de démonstration</small>' : ''}</article>`;
    }
    function section(s, context) {
        context = { ...context, priority: s.kind === 'hero' };
        const v = s.visual;
        const hasCopy = s.eyebrow || s.title || s.body || s.actions.length;
        const copy = hasCopy ? `<div class="ks-copy">${s.eyebrow ? `<p class="ks-eyebrow">${esc(s.eyebrow)}</p>` : ''}${s.title ? `<${s.kind === 'hero' ? 'h1' : 'h2'}${s.kind === 'hero' && s.title.length > 65 ? ' class="ks-title-long"' : ''}>${esc(s.title)}</${s.kind === 'hero' ? 'h1' : 'h2'}>` : ''}${s.body ? `<p class="ks-lead">${esc(s.body)}</p>` : ''}${s.actions.length ? `<div class="ks-actions">${s.actions.map(a => action(a, context)).join('')}</div>` : ''}</div>` : '';
        const stageCatalog = ['product-stage', 'split-stage', 'object-stage', 'immersive-hero', 'cinematic-gallery', 'map-led'].includes(s.composition);
        const orderedBlocks = ['artifactBlockIds', 'proofBlockIds', 'flowBlockIds', 'galleryBlockIds'].flatMap(key => s.slots[key]).map(id => s.blocks.find(b => b.id === id));
        const catalogue = stageCatalog ? orderedBlocks.filter(b => b.type === 'products').map(b => block(b, context)).join('') : '';
        const productMedia = new Set(stageCatalog ? orderedBlocks.filter(b => b.type === 'products').flatMap(b => (b.productIds?.length ? b.productIds.map(id => context.site.catalog.products.find(p => p.id === id)) : []).flatMap(p => [...p.assetIds, ...p.offers.flatMap(o => o.assetIds)])) : []);
        const stageMedia = id => productMedia.has(id) ? '' : media(id, context);
        const group = key => s.slots[key].map(id => s.blocks.find(b => b.id === id)).filter(b => !stageCatalog || b.type !== 'products').map(b => block(b, context)).join('');
        const slots = { copy, catalogue, artifact: group('artifactBlockIds'), proof: group('proofBlockIds'), flow: group('flowBlockIds'), gallery: group('galleryBlockIds'), primaryMedia: stageMedia(s.slots.primaryMediaId), secondaryMedia: stageMedia(s.slots.secondaryMediaId), tertiaryMedia: stageMedia(s.slots.tertiaryMediaId) };
        if (!engine) throw new Error('Le module de composition n’a pas pu être chargé.');
        const content = engine.render(s.composition, slots);
        return `<section id="${esc(s.id)}" data-section-id="${esc(s.id)}" class="ks-section ks-kind-${s.kind} ks-surface-${v.surface} ks-depth-${v.depth} ks-motion-${v.motion} ks-align-${v.align} ks-density-${v.density} ks-image-${v.imageTreatment} ${v.overlap ? 'ks-overlap' : 'ks-no-overlap'}">${content}</section>`;
    }
    function render(site, pageId, project, loadedMedia = {}) {
        const page = site.pages.find(p => p.id === pageId); if (!page) throw new Error('Page introuvable');
        const context = { site, project, pageId, media: loadedMedia }; const d = site.design;
        const links = site.navigation.items.map(a => action(a, context)).join('');
        const nav = site.navigation.presentation === 'hamburger' ? `<details class="ks-menu"><summary aria-label="Ouvrir le menu"><span></span><span></span><span></span></summary><div class="ks-menu-panel">${links}</div></details>` : `<details class="ks-responsive-menu"><summary aria-label="Ouvrir le menu"><span></span><span></span><span></span></summary><div class="ks-nav-links">${links}</div></details>`;
        const home = site.pages.find(p => p.role === 'home');
        return `<div class="ks-site ${page.role === 'home' ? 'ks-page-home' : 'ks-page-inner'} ks-font-${d.font} ks-heading-${d.headingFont} ks-radius-${d.radius} ks-texture-${d.texture} ks-scale-${d.titleScale} ks-navigation-${site.navigation.presentation}" style="--ks-canvas:${d.canvas};--ks-surface:${d.surface};--ks-ink:${d.ink};--ks-muted:${d.muted};--ks-accent:${d.accent};--ks-on-accent:${d.onAccent}"><header class="ks-header"><a class="ks-brand" href="${esc(url(project, home))}">${esc(site.name)}</a><nav aria-label="Navigation principale">${nav}</nav></header><main>${page.sections.map(s => section(s, context)).join('')}</main></div>`;
    }
    return { render, media, gallery, price, url, href, signature, esc };
}));
