const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');

const handler = require('../../api/kirby.js');
const clientScript = readFileSync(resolve(__dirname, '../../script.js'), 'utf8');

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

const makeProposal = ({
    siteName,
    projectType,
    serviceName,
    layoutVariant,
    composition = 'artifact-led',
    typeMode = 'modern-grotesk',
    artifactType = 'story',
    palette = {
        canvas: '#F4F5F0',
        surface: '#FFFFFF',
        ink: '#111A18',
        muted: '#66736F',
        accent: '#13866B',
        accentAlt: '#D95B3C',
    },
}) => ({
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
    projectAnalysis: {
        activity: projectType,
        sector: projectType,
        target: 'Professionnels concernés',
        goals: ['Présenter le service'],
        features: [serviceName],
        tone: ['Direct', 'Moderne'],
        constraints: [],
        existingElements: [siteName],
    },
    brandIdentity: {
        concept: `Système visuel ${siteName}`,
        promise: `Rendre ${serviceName} immédiatement compréhensible`,
        personality: ['Précis', 'Distinctif', 'Utile'],
        visualMetaphor: 'Un parcours qui se révèle par étapes',
        artDirection: `Identité propre à ${siteName}, centrée sur son produit`,
        palette,
        typography: {
            display: 'Titres expressifs et courts',
            body: 'Texte très lisible',
            mode: typeMode,
        },
        composition,
        density: 'balanced',
        shapeLanguage: 'precise',
        imageStrategy: 'graphic-system',
        signatureElement: `Le parcours ${serviceName}`,
        motion: ['Progression des états'],
        avoid: ['Template générique'],
    },
    experienceBlueprint: {
        openingMove: `Montrer directement ${serviceName}`,
        primaryArtifact: {
            type: artifactType,
            label: projectType,
            title: serviceName,
            status: 'Actif',
            items: [
                { label: 'Entrée', value: 'Prête', detail: 'Le besoin est visible.' },
                { label: 'Action', value: 'Directe', detail: 'Le parcours principal est utilisable.' },
                { label: 'Résultat', value: 'Clair', detail: 'La prochaine étape est comprise.' },
            ],
        },
        proofModules: [
            { title: 'Usage concret', metric: '', detail: 'Le produit est montré plutôt que décrit.' },
            { title: 'Parcours lisible', metric: '', detail: 'Chaque état conduit au suivant.' },
        ],
        flow: [
            { label: 'Découvrir', detail: 'Comprendre la promesse.' },
            { label: 'Utiliser', detail: 'Agir dans l’interface.' },
            { label: 'Continuer', detail: 'Passer à l’étape suivante.' },
        ],
        contentPriority: [serviceName],
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
        artifactType: 'menu',
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

test('Kirby transforme un brief de plongée en réservation de sortie exploitable', async () => {
    const brief = 'Plongée sous-marine. Je propose des formations et des sorties de plongée. Je souhaite un site immersif avec réservations, météo, cartes des spots et galerie.';
    const response = await callKirbyWithOpenAiProposal(brief, makeProposal({
        siteName: 'Abyss Booking',
        projectType: 'Site de plongée',
        serviceName: 'Sorties de plongée',
        layoutVariant: 'gallery-focus',
        artifactType: 'story',
    }));
    const payload = JSON.parse(response.body);
    const artifact = payload.proposal.experienceBlueprint.primaryArtifact;
    const artifactText = JSON.stringify(artifact).toLowerCase();
    const flowText = JSON.stringify(payload.proposal.experienceBlueprint.flow).toLowerCase();

    assert.equal(response.statusCode, 200);
    assert.equal(payload.proposal.sectorKey, 'diving');
    assert.equal(payload.proposal.layoutVariant, 'lumina-showcase');
    assert.equal(payload.proposal.brandIdentity.surfaceMode, 'glass');
    assert.equal(artifact.type, 'dive');
    assert.match(artifactText, /spot|météo|meteo/);
    assert.match(artifactText, /réservation|reservation/);
    assert.match(flowText, /choisir|spot/);
    assert.match(flowText, /vérifier|verifier|météo|meteo/);
});

test('Kirby conserve deux identités réellement différentes pour deux restaurants proches', async () => {
    const italian = await callKirbyWithOpenAiProposal(
        'Trattoria italienne familiale à Lyon, cuisine de quartier, menu QR et réservation simple.',
        makeProposal({
            siteName: 'Casa Lina',
            projectType: 'Trattoria familiale',
            serviceName: 'Carte italienne numérique',
            layoutVariant: 'gallery-focus',
            composition: 'split-flow',
            typeMode: 'humanist',
            artifactType: 'menu',
            palette: {
                canvas: '#F5F0E8',
                surface: '#FFFDF8',
                ink: '#1F2720',
                muted: '#6D756A',
                accent: '#B83A2D',
                accentAlt: '#227A59',
            },
        }),
    );
    const japanese = await callKirbyWithOpenAiProposal(
        'Restaurant gastronomique japonais omakase à Paris, réservation limitée et expérience silencieuse.',
        makeProposal({
            siteName: 'Kanso',
            projectType: 'Omakase gastronomique',
            serviceName: 'Parcours de réservation omakase',
            layoutVariant: 'minimal-editorial',
            composition: 'editorial-stack',
            typeMode: 'editorial-serif',
            artifactType: 'booking',
            palette: {
                canvas: '#ECEDE8',
                surface: '#FAFAF7',
                ink: '#171916',
                muted: '#6B6E68',
                accent: '#2D4A43',
                accentAlt: '#A44738',
            },
        }),
    );
    const italianProposal = JSON.parse(italian.body).proposal;
    const japaneseProposal = JSON.parse(japanese.body).proposal;

    assert.equal(italian.statusCode, 200);
    assert.equal(japanese.statusCode, 200);
    assert.notEqual(italianProposal.brandIdentity.composition, japaneseProposal.brandIdentity.composition);
    assert.notEqual(italianProposal.brandIdentity.typography.mode, japaneseProposal.brandIdentity.typography.mode);
    assert.notDeepEqual(italianProposal.brandIdentity.palette, japaneseProposal.brandIdentity.palette);
    assert.notEqual(italianProposal.experienceBlueprint.primaryArtifact.type, japaneseProposal.experienceBlueprint.primaryArtifact.type);
});

test('Kirby ne confond pas une suite de sections avec une suite hôtelière', () => {
    const guardStart = clientScript.indexOf('const KIRBY_UNREQUESTED_UNIVERSE_PATTERNS');
    const guardEnd = clientScript.indexOf('const getKirbyUnrequestedUniversePatterns', guardStart);
    const guardSource = clientScript.slice(guardStart, guardEnd);

    assert.ok(guardStart >= 0 && guardEnd > guardStart);
    assert.equal(guardSource.includes('/\\bsuites?\\b/'), false);
});

test('Kirby nettoie les formulations génériques sans annuler la génération', async () => {
    const proposal = makeProposal({
        siteName: 'Conta Direct',
        projectType: 'Comptabilité fournisseurs',
        serviceName: 'Circuit de validation',
        layoutVariant: 'finance-os',
        artifactType: 'workflow',
    });
    proposal.slogan = 'Comprendre le besoin';
    proposal.homeSections[0].title = 'Demande qualifiée';
    proposal.narrativePlan.commercialPromise = 'Diagnostic & simulation';
    proposal.visualPlan.hero.purpose = 'Simulation visuelle';

    const response = await callKirbyWithOpenAiProposal(
        'Conta Direct automatise la comptabilité fournisseurs, la validation et le paiement des factures.',
        proposal,
    );
    const body = response.body.toLowerCase();

    assert.equal(response.statusCode, 200);
    assert.doesNotMatch(body, /comprendre le besoin|demande qualifi|diagnostic & simulation|simulation visuelle/);
});
