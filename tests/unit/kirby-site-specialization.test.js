const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');

const handler = require('../../api/kirby.js');

class MockRequest extends EventEmitter {
    constructor(body) {
        super();
        this.method = 'POST';
        this.headers = { 'content-type': 'application/json' };
        this.body = body;
    }

    destroy() {}
}

class MockResponse extends EventEmitter {
    constructor() {
        super();
        this.headers = {};
        this.statusCode = 0;
        this.body = '';
    }

    setHeader(key, value) {
        this.headers[key] = value;
    }

    end(chunk = '') {
        this.body += chunk;
        this.emit('finish');
    }
}

const makeVisualSlot = (narrativeStage, subject) => ({
    narrativeStage,
    purpose: 'Montrer un élément concret du projet',
    subject,
    composition: 'Cadrage précis et lisible',
    priority: 'important',
    keywords: [subject],
});

const makeProposal = ({ siteName, projectType, serviceName, layoutVariant }) => ({
    projectType,
    sectorKey: '',
    siteName,
    slogan: 'Tout devient plus simple',
    summary: `Présentation de ${siteName}`,
    valueProposition: `Une expérience directe pour ${projectType}`,
    visualMood: '',
    layoutVariant,
    positioning: {
        audience: 'Professionnels concernés',
        promise: 'Un parcours simple et utile',
        tone: 'Direct et moderne',
        differentiator: 'Les actions importantes sont visibles',
    },
    styleGuide: {
        direction: 'Interface claire et contemporaine',
        colors: 'Palette contrastée',
        typography: 'Sans serif lisible',
        layout: 'Hiérarchie directe',
    },
    visualConcept: {
        heroComposition: 'Sujet principal en plein cadre',
        ambience: 'Contemporaine',
        colorPalette: ['Contraste net'],
        imageKeywords: [serviceName],
        layoutSignature: 'Action principale visible',
        microInteractions: ['Transitions discrètes'],
        signatureMoment: 'Le service devient immédiatement compréhensible',
        wowFactor: 'Une démonstration concrète dès le premier écran',
    },
    narrativePlan: {
        centralStory: `Comprendre et utiliser ${siteName}`,
        visitorStartingPoint: 'Le visiteur cherche une solution claire',
        desiredOutcome: 'Le visiteur sait quelle action effectuer',
        commercialPromise: 'Simplifier le parcours sans masquer les contrôles',
        targetAudience: ['Professionnels concernés'],
        tone: ['Direct', 'Moderne'],
        journey: [
            { stage: 'discovery', goal: 'Découvrir', message: 'Comprendre la promesse', proofNeeded: false, expectedAction: 'Continuer' },
            { stage: 'understanding', goal: 'Comprendre', message: 'Voir le fonctionnement', proofNeeded: false, expectedAction: 'Explorer' },
            { stage: 'proof', goal: 'Vérifier', message: 'Voir une preuve concrète', proofNeeded: true, expectedAction: 'Comparer' },
            { stage: 'conversion', goal: 'Agir', message: 'Passer à l’action', proofNeeded: false, expectedAction: 'Contacter' },
        ],
        mustInclude: [serviceName],
        mustAvoid: [],
        primaryConversion: { action: 'Découvrir le service', label: 'Découvrir' },
    },
    visualPlan: {
        hero: makeVisualSlot('discovery', serviceName),
        sections: [makeVisualSlot('understanding', serviceName)],
        gallery: [makeVisualSlot('proof', serviceName)],
        conversion: makeVisualSlot('conversion', serviceName),
    },
    siteModel: {
        name: projectType,
        description: 'Un site centré sur le parcours principal',
        sections: ['Promesse', 'Fonctionnement', 'Contact'],
    },
    pages: [
        { name: 'Accueil', goal: 'Présenter la promesse' },
        { name: 'Fonctionnement', goal: 'Montrer le parcours' },
        { name: 'Contact', goal: 'Permettre une prise de contact' },
    ],
    homeSections: [
        { title: 'Une action claire', text: 'Le service principal est visible immédiatement.' },
        { title: 'Un parcours lisible', text: 'Chaque étape explique la suivante.' },
    ],
    services: [{ name: serviceName, description: 'Fonction principale demandée dans le brief.' }],
    ctas: ['Découvrir', 'Contacter'],
});

const callKirbyWithOpenAiProposal = async (brief, proposal) => {
    const previousApiKey = process.env.KIRBY_OPENAI_API_KEY;
    const previousModel = process.env.KIRBY_OPENAI_MODEL;
    const previousFetch = global.fetch;
    process.env.KIRBY_OPENAI_API_KEY = 'sk-test-key';
    process.env.KIRBY_OPENAI_MODEL = 'test-model';
    global.fetch = async () => ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
            choices: [{ message: { content: JSON.stringify(proposal) } }],
        }),
    });

    try {
        const request = new MockRequest(JSON.stringify({ brief }));
        const response = new MockResponse();
        const finished = new Promise((resolve) => response.once('finish', resolve));
        const handling = handler(request, response);

        process.nextTick(() => {
            request.emit('data', Buffer.from(request.body));
            request.emit('end');
        });

        await handling;
        await finished;
        return response;
    } finally {
        global.fetch = previousFetch;
        if (previousApiKey === undefined) delete process.env.KIRBY_OPENAI_API_KEY;
        else process.env.KIRBY_OPENAI_API_KEY = previousApiKey;
        if (previousModel === undefined) delete process.env.KIRBY_OPENAI_MODEL;
        else process.env.KIRBY_OPENAI_MODEL = previousModel;
    }
};

test('Kirby classe Conta Direct comme automatisation fournisseurs sans écraser le contenu IA', async () => {
    const brief = 'Conta Direct, plateforme de comptabilité fournisseurs avec import PDF, scanner, détection des doublons, rapprochement facture bon de commande, circuit de validation, échéancier fournisseur et archivage.';
    const response = await callKirbyWithOpenAiProposal(brief, makeProposal({
        siteName: 'Conta Direct',
        projectType: 'Site vitrine logiciel SaaS',
        serviceName: 'Comptabilité fournisseurs',
        layoutVariant: 'lumina-showcase',
    }));
    const payload = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.equal(payload.proposal.siteName, 'Conta Direct');
    assert.equal(payload.proposal.sectorKey, 'accounting');
    assert.equal(payload.proposal.layoutVariant, 'finance-os');
    assert.equal(payload.proposal.visualMood, 'accounts-payable-automation');
    assert.equal(payload.proposal.projectType, 'Plateforme de comptabilité fournisseurs et automatisation');
    assert.equal(payload.proposal.homeSections[0].title, 'Une action claire');
});

test('Kirby transforme un restaurant avec menu QR en expérience visuelle dédiée', async () => {
    const brief = 'Je veux ouvrir un restaurant moderne avec de belles photos récentes, une carte numérique, un menu digital et un QR code à scanner pour voir la carte et réserver.';
    const response = await callKirbyWithOpenAiProposal(brief, makeProposal({
        siteName: 'Table Libre',
        projectType: 'Restaurant contemporain',
        serviceName: 'Menu numérique par QR code',
        layoutVariant: 'showcase-contemporain',
    }));
    const payload = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.equal(payload.proposal.sectorKey, 'restaurant');
    assert.equal(payload.proposal.layoutVariant, 'gallery-focus');
    assert.equal(payload.proposal.visualMood, 'restaurant-digital-menu');
    assert.equal(payload.proposal.showGallery, true);
    assert.ok(payload.proposal.pages.some((page) => page.name === 'Menu digital'));
    assert.ok(payload.proposal.ctas.includes('Voir le menu'));
});
