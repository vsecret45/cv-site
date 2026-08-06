(function exposeKirbyCompositionEngine(root, factory) {
    const engine = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = engine;
    }

    if (root) {
        root.KirbyCompositionEngine = engine;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    'use strict';

    const HERO_PRIMITIVES = [
        'immersive-hero',
        'editorial-cover',
        'asymmetric-grid',
        'product-stage',
        'vertical-narrative',
        'map-led',
        'cinematic-gallery',
        'split-stage',
    ];
    const CONTENT_PRIMITIVES = [
        'proof-mosaic',
        'catalog-shelf',
        'process-rail',
        'story-chapters',
        'gallery-reel',
        'data-canvas',
    ];
    const ARTIFACT_PLACEMENTS = ['hero', 'overlap', 'inline', 'rail', 'below'];
    const IMAGE_PLACEMENTS = ['background', 'dominant', 'collage', 'strip', 'supporting', 'none'];
    const SECTION_KEYS = ['hero', 'artifact', 'proof', 'gallery', 'flow'];
    const COMPOSITION_ALIASES = {
        'artifact-led': 'product-stage',
        'split-flow': 'split-stage',
        'editorial-stack': 'editorial-cover',
        'product-canvas': 'product-stage',
        'immersive-sequence': 'immersive-hero',
    };

    const normalizeToken = (value = '') => String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const hash = (value = '') => {
        let output = 2166136261;

        for (const character of String(value || '')) {
            output ^= character.charCodeAt(0);
            output = Math.imul(output, 16777619);
        }

        return output >>> 0;
    };

    const pick = (value, options, fallback) => {
        const token = normalizeToken(value);
        return options.includes(token) ? token : fallback;
    };

    const normalizeSectionOrder = (value, fallback) => {
        const source = Array.isArray(value) ? value : [];
        const resolved = source
            .map(normalizeToken)
            .filter((item, index, items) => SECTION_KEYS.includes(item) && items.indexOf(item) === index);

        SECTION_KEYS.forEach((item) => {
            if (!resolved.includes(item)) resolved.push(item);
        });

        return resolved.length ? resolved : fallback;
    };

    const resolvePlan = ({ identity = {}, blueprint = {}, brief = '', seed = '' } = {}) => {
        const source = blueprint.compositionPlan && typeof blueprint.compositionPlan === 'object'
            ? blueprint.compositionPlan
            : {};
        const compositionToken = normalizeToken(identity.composition);
        const compositionPrimitive = COMPOSITION_ALIASES[compositionToken] || compositionToken;
        const fingerprint = `${brief}::${seed}::${identity.concept || ''}::${identity.visualMetaphor || ''}`;
        const fingerprintHash = hash(fingerprint);
        const heroFallback = HERO_PRIMITIVES[fingerprintHash % HERO_PRIMITIVES.length];
        const heroPrimitive = pick(source.heroPrimitive || compositionPrimitive, HERO_PRIMITIVES, heroFallback);
        const contentFallback = CONTENT_PRIMITIVES[(fingerprintHash + HERO_PRIMITIVES.indexOf(heroPrimitive) + 1) % CONTENT_PRIMITIVES.length];
        const contentPrimitive = pick(source.contentPrimitive, CONTENT_PRIMITIVES, contentFallback);
        const placementDefaults = {
            'immersive-hero': 'overlap',
            'editorial-cover': 'below',
            'asymmetric-grid': 'hero',
            'product-stage': 'hero',
            'vertical-narrative': 'inline',
            'map-led': 'rail',
            'cinematic-gallery': 'below',
            'split-stage': 'hero',
        };
        const imageDefaults = {
            'immersive-hero': 'background',
            'editorial-cover': 'dominant',
            'asymmetric-grid': 'collage',
            'product-stage': 'supporting',
            'vertical-narrative': 'strip',
            'map-led': 'background',
            'cinematic-gallery': 'strip',
            'split-stage': 'dominant',
        };
        const orderDefaults = {
            'immersive-hero': ['hero', 'proof', 'flow', 'gallery', 'artifact'],
            'editorial-cover': ['hero', 'artifact', 'gallery', 'proof', 'flow'],
            'asymmetric-grid': ['hero', 'gallery', 'proof', 'flow', 'artifact'],
            'product-stage': ['hero', 'flow', 'proof', 'gallery', 'artifact'],
            'vertical-narrative': ['hero', 'proof', 'artifact', 'flow', 'gallery'],
            'map-led': ['hero', 'flow', 'artifact', 'proof', 'gallery'],
            'cinematic-gallery': ['hero', 'gallery', 'artifact', 'proof', 'flow'],
            'split-stage': ['hero', 'proof', 'artifact', 'flow', 'gallery'],
        };

        return {
            heroPrimitive,
            contentPrimitive,
            artifactPlacement: pick(source.artifactPlacement, ARTIFACT_PLACEMENTS, placementDefaults[heroPrimitive]),
            imagePlacement: pick(source.imagePlacement, IMAGE_PLACEMENTS, imageDefaults[heroPrimitive]),
            sectionOrder: normalizeSectionOrder(source.sectionOrder, orderDefaults[heroPrimitive]),
        };
    };

    const renderHero = (plan = {}, slots = {}) => {
        const hero = pick(plan.heroPrimitive, HERO_PRIMITIVES, 'split-stage');
        const copy = slots.copy || '';
        const artifact = slots.artifact || '';
        const primaryMedia = slots.primaryMedia || '';
        const secondaryMedia = slots.secondaryMedia || '';
        const tertiaryMedia = slots.tertiaryMedia || '';
        const map = slots.map || '';

        if (hero === 'immersive-hero') {
            return `<section class="identity-hero identity-immersive-hero" data-hero-primitive="immersive-hero"><div class="identity-immersive-media">${primaryMedia}</div><div class="identity-immersive-shade" aria-hidden="true"></div><header class="identity-immersive-copy">${copy}</header>${artifact ? `<aside class="identity-immersive-artifact">${artifact}</aside>` : ''}</section>`;
        }
        if (hero === 'editorial-cover') {
            return `<section class="identity-hero identity-editorial-cover" data-hero-primitive="editorial-cover"><header class="identity-editorial-masthead">${copy}</header><div class="identity-editorial-spread"><div class="identity-editorial-figure">${primaryMedia}</div><aside class="identity-editorial-aside">${artifact || secondaryMedia}</aside></div></section>`;
        }
        if (hero === 'asymmetric-grid') {
            return `<section class="identity-hero identity-asymmetric-hero" data-hero-primitive="asymmetric-grid"><div class="identity-asymmetric-copy">${copy}</div><div class="identity-asymmetric-primary">${primaryMedia}</div><div class="identity-asymmetric-secondary">${secondaryMedia}</div><aside class="identity-asymmetric-detail">${artifact || tertiaryMedia}</aside></section>`;
        }
        if (hero === 'product-stage') {
            return `<section class="identity-hero identity-product-stage" data-hero-primitive="product-stage"><header class="identity-product-intro">${copy}</header><div class="identity-product-scene"><div class="identity-product-artifact">${artifact}</div>${primaryMedia ? `<aside class="identity-product-media">${primaryMedia}</aside>` : ''}</div></section>`;
        }
        if (hero === 'vertical-narrative') {
            return `<section class="identity-hero identity-narrative-hero" data-hero-primitive="vertical-narrative"><header class="identity-narrative-opening">${copy}</header><div class="identity-narrative-strip">${primaryMedia}${secondaryMedia}${tertiaryMedia}</div>${artifact ? `<div class="identity-narrative-artifact">${artifact}</div>` : ''}</section>`;
        }
        if (hero === 'map-led') {
            return `<section class="identity-hero identity-map-hero" data-hero-primitive="map-led"><div class="identity-map-canvas">${primaryMedia}${map}</div><header class="identity-map-copy">${copy}</header>${artifact ? `<aside class="identity-map-rail">${artifact}</aside>` : ''}</section>`;
        }
        if (hero === 'cinematic-gallery') {
            return `<section class="identity-hero identity-cinema-hero" data-hero-primitive="cinematic-gallery"><div class="identity-cinema-frame">${primaryMedia}</div><header class="identity-cinema-copy">${copy}</header><div class="identity-cinema-strip">${secondaryMedia}${tertiaryMedia}</div>${artifact ? `<aside class="identity-cinema-artifact">${artifact}</aside>` : ''}</section>`;
        }

        return `<section class="identity-hero identity-split-stage" data-hero-primitive="split-stage"><header class="identity-split-copy">${copy}</header><div class="identity-split-visual">${primaryMedia}${artifact ? `<aside>${artifact}</aside>` : ''}</div></section>`;
    };

    const renderContent = (plan = {}, slots = {}) => {
        const content = pick(plan.contentPrimitive, CONTENT_PRIMITIVES, 'proof-mosaic');
        const proof = slots.proof || '';
        const flow = slots.flow || '';
        const gallery = slots.gallery || '';

        if (content === 'catalog-shelf') {
            return `<section class="identity-content identity-catalog-shelf" data-content-primitive="catalog-shelf"><div class="identity-shelf-lead">${proof}</div><div class="identity-shelf-reel">${gallery}</div></section>`;
        }
        if (content === 'process-rail') {
            return `<section class="identity-content identity-process-rail" data-content-primitive="process-rail"><div class="identity-process-track">${flow}</div><aside>${proof}</aside></section>`;
        }
        if (content === 'story-chapters') {
            return `<section class="identity-content identity-story-chapters" data-content-primitive="story-chapters"><div class="identity-story-media">${gallery}</div><div class="identity-story-copy">${proof}${flow}</div></section>`;
        }
        if (content === 'gallery-reel') {
            return `<section class="identity-content identity-gallery-reel" data-content-primitive="gallery-reel"><div class="identity-gallery-track">${gallery}</div><footer>${proof}</footer></section>`;
        }
        if (content === 'data-canvas') {
            return `<section class="identity-content identity-data-canvas" data-content-primitive="data-canvas"><header>${proof}</header><div>${flow}</div></section>`;
        }

        return `<section class="identity-content identity-proof-mosaic" data-content-primitive="proof-mosaic"><div class="identity-mosaic-proof">${proof}</div><aside class="identity-mosaic-flow">${flow}</aside></section>`;
    };

    const getStructureSignature = (plan = {}) => [
        pick(plan.heroPrimitive, HERO_PRIMITIVES, 'split-stage'),
        pick(plan.contentPrimitive, CONTENT_PRIMITIVES, 'proof-mosaic'),
        pick(plan.artifactPlacement, ARTIFACT_PLACEMENTS, 'hero'),
        pick(plan.imagePlacement, IMAGE_PLACEMENTS, 'dominant'),
        normalizeSectionOrder(plan.sectionOrder, SECTION_KEYS).join('>'),
    ].join('|');

    return {
        HERO_PRIMITIVES,
        CONTENT_PRIMITIVES,
        ARTIFACT_PLACEMENTS,
        IMAGE_PLACEMENTS,
        resolvePlan,
        renderHero,
        renderContent,
        getStructureSignature,
    };
}));
