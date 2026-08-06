const assert = require('node:assert/strict');
const test = require('node:test');

const {
    resolvePlan,
    renderHero,
    renderContent,
    getStructureSignature,
} = require('../../kirby-composition-engine');

const scenarios = [
    {
        brief: 'Atelier de couture sur mesure, rendez-vous et carnet de commandes.',
        identity: { composition: 'editorial-cover', concept: 'Le geste et la matière' },
        compositionPlan: { heroPrimitive: 'editorial-cover', contentPrimitive: 'story-chapters', artifactPlacement: 'below', imagePlacement: 'dominant', sectionOrder: ['hero', 'gallery', 'artifact', 'proof', 'flow'] },
    },
    {
        brief: 'Centre de cryothérapie, récupération sportive et réservation.',
        identity: { composition: 'product-stage', concept: 'Protocole thermique mesurable' },
        compositionPlan: { heroPrimitive: 'product-stage', contentPrimitive: 'process-rail', artifactPlacement: 'hero', imagePlacement: 'supporting', sectionOrder: ['hero', 'flow', 'proof', 'artifact', 'gallery'] },
    },
    {
        brief: 'Pilote de drone, inspection, cartographie et missions aériennes.',
        identity: { composition: 'map-led', concept: 'Lecture aérienne du territoire' },
        compositionPlan: { heroPrimitive: 'map-led', contentPrimitive: 'data-canvas', artifactPlacement: 'rail', imagePlacement: 'background', sectionOrder: ['hero', 'flow', 'artifact', 'proof', 'gallery'] },
    },
    {
        brief: 'Laboratoire ADN, séquençage et suivi des échantillons.',
        identity: { composition: 'vertical-narrative', concept: 'De l’échantillon à la donnée' },
        compositionPlan: { heroPrimitive: 'vertical-narrative', contentPrimitive: 'proof-mosaic', artifactPlacement: 'inline', imagePlacement: 'strip', sectionOrder: ['hero', 'proof', 'artifact', 'flow', 'gallery'] },
    },
    {
        brief: 'Hôtel contemporain, chambres, expériences et réservation.',
        identity: { composition: 'immersive-hero', concept: 'Arriver avant le séjour' },
        compositionPlan: { heroPrimitive: 'immersive-hero', contentPrimitive: 'gallery-reel', artifactPlacement: 'overlap', imagePlacement: 'background', sectionOrder: ['hero', 'gallery', 'proof', 'flow', 'artifact'] },
    },
    {
        brief: 'Fleuriste, créations saisonnières, abonnements et livraison.',
        identity: { composition: 'asymmetric-grid', concept: 'Composition vivante' },
        compositionPlan: { heroPrimitive: 'asymmetric-grid', contentPrimitive: 'catalog-shelf', artifactPlacement: 'hero', imagePlacement: 'collage', sectionOrder: ['hero', 'gallery', 'proof', 'flow', 'artifact'] },
    },
    {
        brief: 'Cartographe de rêves, collecte de récits nocturnes et atlas interactif.',
        identity: { composition: 'cinematic-gallery', concept: 'Atlas des paysages intérieurs' },
        compositionPlan: { heroPrimitive: 'cinematic-gallery', contentPrimitive: 'proof-mosaic', artifactPlacement: 'below', imagePlacement: 'strip', sectionOrder: ['hero', 'gallery', 'artifact', 'proof', 'flow'] },
    },
];

const structuralMarkup = (plan) => {
    const hero = renderHero(plan, {
        copy: '<div class="copy"></div>',
        artifact: '<section class="artifact"></section>',
        primaryMedia: '<figure class="media primary"></figure>',
        secondaryMedia: '<figure class="media secondary"></figure>',
        tertiaryMedia: '<figure class="media tertiary"></figure>',
        map: '<div class="map"></div>',
    });
    const content = renderContent(plan, {
        proof: '<div class="proof"></div>',
        flow: '<ol class="flow"></ol>',
        gallery: '<div class="gallery"></div>',
    });

    return `${hero}${content}`.replace(/>[^<]+</g, '><').replace(/\s+/g, ' ').trim();
};

test('seven unrelated briefs resolve to structurally different compositions', () => {
    const plans = scenarios.map((scenario) => resolvePlan({
        identity: scenario.identity,
        blueprint: { compositionPlan: scenario.compositionPlan },
        brief: scenario.brief,
        seed: scenario.brief,
    }));
    const signatures = plans.map(getStructureSignature);
    const domStructures = plans.map(structuralMarkup);

    assert.equal(new Set(signatures).size, scenarios.length);
    assert.equal(new Set(domStructures).size, scenarios.length);
    assert.equal(new Set(plans.map((plan) => plan.heroPrimitive)).size, scenarios.length);
});

test('couture and cryotherapy do not collapse into the same split layout', () => {
    const couture = resolvePlan({ identity: scenarios[0].identity, blueprint: { compositionPlan: scenarios[0].compositionPlan }, brief: scenarios[0].brief });
    const cryotherapy = resolvePlan({ identity: scenarios[1].identity, blueprint: { compositionPlan: scenarios[1].compositionPlan }, brief: scenarios[1].brief });

    assert.notEqual(getStructureSignature(couture), getStructureSignature(cryotherapy));
    assert.match(structuralMarkup(couture), /identity-editorial-cover/);
    assert.match(structuralMarkup(cryotherapy), /identity-product-stage/);
    assert.notEqual(couture.imagePlacement, cryotherapy.imagePlacement);
    assert.notDeepEqual(couture.sectionOrder, cryotherapy.sectionOrder);
});

test('legacy composition names map to the new reusable primitives', () => {
    assert.equal(resolvePlan({ identity: { composition: 'editorial-stack' } }).heroPrimitive, 'editorial-cover');
    assert.equal(resolvePlan({ identity: { composition: 'product-canvas' } }).heroPrimitive, 'product-stage');
    assert.equal(resolvePlan({ identity: { composition: 'immersive-sequence' } }).heroPrimitive, 'immersive-hero');
});
