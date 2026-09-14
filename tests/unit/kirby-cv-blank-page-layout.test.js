const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');

// Ce fichier vérifie la mise en page d'un CV nouvellement importé (texte collé)
// ou créé sur une page blanche (récit) : une page lisible, aucune rubrique
// perdue, aucune duplication FR/EN, et un ordre chronologique correct.
const handler = require('../../api/kirby.js');

class MockRequest extends EventEmitter {
    constructor(body) {
        super();
        this.method = 'POST';
        this.headers = {};
        this.kirbyService = 'cv';
        process.nextTick(() => {
            this.emit('data', Buffer.from(JSON.stringify(body)));
            this.emit('end');
        });
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

const emptyCvPayload = {
    documentLanguage: 'fr',
    headline: '',
    summary: '',
    skills: [],
    experienceOrder: [],
    languages: [],
    periodGaps: [],
    generatedExperiences: [],
    educationSuggestions: [],
    extracted: {},
    jobTarget: '',
    keywords: [],
    suggestedSkills: [],
    suggestions: [],
    notice: '',
    quality: { fixes: [], warnings: [] },
    layout: {
        removeSections: [],
        reflow: true,
        compact: false,
        template: 'auto',
        palette: 'auto',
        density: 'normal',
        singlePage: true,
        preserveAllContent: true,
    },
    operations: [],
    bugReport: null,
    letter: { subject: '', body: '' },
};

const callKirbyCreate = async ({ cv = {}, instruction, documentText = '', sourceKind = '', assistantExtracted }) => {
    const originalFetch = global.fetch;
    const originalKey = process.env.KIRBY_CV_OPENAI_API_KEY;
    process.env.KIRBY_CV_OPENAI_API_KEY = 'sk-test-key';
    global.fetch = async () => ({
        ok: true,
        json: async () => ({
            choices: [{
                message: {
                    content: JSON.stringify({
                        ...emptyCvPayload,
                        headline: assistantExtracted.headline,
                        summary: assistantExtracted.summary,
                        skills: assistantExtracted.skills,
                        languages: assistantExtracted.languages,
                        jobTarget: assistantExtracted.headline,
                        extracted: assistantExtracted,
                    }),
                },
            }],
        }),
    });

    try {
        const request = new MockRequest({
            mode: 'cv',
            task: 'create',
            cv,
            instruction,
            documentText,
            documentLanguage: 'fr',
            ...(sourceKind ? { sourceKind } : {}),
        });
        const response = new MockResponse();
        const finished = new Promise((resolve) => response.once('finish', resolve));
        await handler(request, response);
        await finished;
        return { statusCode: response.statusCode, body: JSON.parse(response.body) };
    } finally {
        global.fetch = originalFetch;
        if (originalKey === undefined) {
            delete process.env.KIRBY_CV_OPENAI_API_KEY;
        } else {
            process.env.KIRBY_CV_OPENAI_API_KEY = originalKey;
        }
    }
};

const pastedCvDocument = [
    'Jean Dupont',
    'Vendeur',
    '',
    'PROFIL',
    'Vendeur expérimenté, sérieux et motivé.',
    '',
    'COMPETENCES',
    'Vente',
    'Encaissement',
    '',
    'EXPERIENCE PROFESSIONNELLE',
    "Vendeur - Boutique Nord - 2018 • Conseil clients",
    "Responsable adjoint - Magasin Sud - 2022 • Gestion d'équipe",
    'Vendeur - Boutique Est - 2020 • Merchandising',
    '',
    'FORMATION',
    'BEP Vente - Lycée Fictif - 2017',
    '',
    'LANGUES',
    'Français : langue maternelle',
    'Anglais : notions',
].join('\n');

const pastedCvExtraction = {
    fullName: 'Jean Dupont',
    location: '',
    phone: '',
    email: '',
    permit: '',
    headline: 'Vendeur',
    summary: 'Vendeur expérimenté, sérieux et motivé.',
    skills: ['Vente', 'Encaissement'],
    experiences: [
        "Vendeur - Boutique Nord - 2018 • Conseil clients",
        "Responsable adjoint - Magasin Sud - 2022 • Gestion d'équipe",
        'Vendeur - Boutique Est - 2020 • Merchandising',
    ],
    projects: [],
    education: ['BEP Vente - Lycée Fictif - 2017'],
    certifications: [],
    activities: [],
    languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Notions' },
    ],
};

test('CV importé (texte collé) : mise en page une page appliquée sans perte de rubrique', async () => {
    const { statusCode, body } = await callKirbyCreate({
        cv: {},
        instruction: 'Structure et mets en forme ce CV importé.',
        documentText: pastedCvDocument,
        assistantExtracted: pastedCvExtraction,
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.layout.reflow, true, 'un CV nouvellement importé doit toujours être réaéré');
    assert.notEqual(body.cv.layout.singlePage, false, 'la mise en page une page doit rester activée par défaut');
    assert.equal(body.cv.layout.preserveAllContent, true, 'aucune rubrique ne doit être sacrifiée pour la mise en page');
    assert.deepEqual(body.cv.layout.removeSections, [], 'aucune rubrique ne doit être retirée silencieusement');

    assert.equal(body.cv.extracted.skills.length, 2, 'les deux compétences doivent être conservées');
    assert.equal(body.cv.extracted.education.length, 1, 'la formation doit être conservée');
    assert.equal(body.cv.extracted.languages.length, 2, 'les deux langues doivent être conservées');
    assert.equal(body.cv.extracted.experiences.length, 3, 'les trois expériences doivent être conservées');
});

test('CV importé (texte collé) : les expériences sont réordonnées du plus récent au plus ancien', async () => {
    const { body } = await callKirbyCreate({
        cv: {},
        instruction: 'Structure et mets en forme ce CV importé.',
        documentText: pastedCvDocument,
        assistantExtracted: pastedCvExtraction,
    });

    assert.deepEqual(body.cv.experienceOrder, [
        "Responsable adjoint - Magasin Sud - 2022",
        'Vendeur - Boutique Est - 2020',
        'Vendeur - Boutique Nord - 2018',
    ]);
});

test('CV importé (texte collé) : ne duplique jamais le contenu en français et en anglais à la fois', async () => {
    const { body } = await callKirbyCreate({
        cv: {},
        instruction: 'Structure et mets en forme ce CV importé.',
        documentText: pastedCvDocument,
        assistantExtracted: pastedCvExtraction,
    });

    assert.equal(body.cv.documentLanguage, 'fr');
    assert.doesNotMatch(body.cv.headline, /\bSales\b|\bassistant manager\b/i, 'le titre ne doit pas mélanger une traduction anglaise');
    assert.equal(
        body.cv.extracted.experiences.filter((item) => /vendeur/i.test(item)).length,
        2,
        'chaque expérience ne doit apparaître qu\'une seule fois, jamais doublée avec une variante traduite'
    );
});

// Récit repris tel quel de kirby-cv-narrative-validation.test.js : ce texte est
// déjà validé par le pipeline de grounding (anti-invention). On le réutilise
// ici pour isoler uniquement la vérification de mise en page/complétude.
const eliseNarrative = [
    'Remets mes informations en ordre pour créer mon CV. Classe les expériences de la plus récente à la plus ancienne. N’invente pas les informations manquantes.',
    'Je parle français couramment et italien à un niveau intermédiaire. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours.',
    'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives Dorées à Angers, en CDI. Je m’occupe des arrivées, des départs, des réservations et de la facturation. Je réponds aussi aux demandes des clients par téléphone et par mail.',
    'Mon téléphone : 06 00 00 00 05.',
    "Avant, j’ai travaillé dans une librairie à Tours. Elle s’appelait La Page Vagabonde. De septembre 2017 à décembre 2019, vendeuse en CDI. Conseil aux clients, encaissement, réception des livres et préparation des commandes.Et pourtant j'ai mis le token dans .env.",
    'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et à l’aise avec les clients.',
    'Mon nom est Élise Montbrun. Mon mail : elise.montbrun\\@example.com. J’habite à Angers.',
    'J’ai fait une formation de premiers secours en avril 2024 auprès de l’association fictive Secours des Rives.',
    'Pour mon travail actuel, ajoute aussi que je transmets les consignes à l’équipe de nuit.',
    'De 02/2022 à 11/2024 : agente d’accueil chez Espace Orbel, un centre d’affaires à Angers. CDD. Accueil des visiteurs, gestion du standard, réservation des salles et réception du courrier.',
    'J’aime la randonnée et le cinéma italien.',
    'Entre janvier 2020 et janvier 2022, j’étais employée de restauration chez Le Comptoir des Tilleuls à Saumur. Préparation de la salle, prise des commandes et service. Je ne me rappelle plus du type de contrat, ne le devine pas.',
    'J’ai le permis B.',
    'Décembre 2024 à février 2025 : recherche d’emploi. Pas besoin de créer une expérience professionnelle pour cette période.',
    'Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe. Pour l’anglais, je suis débutante.',
    'Pendant mon bac, j’ai fait un stage d’accueil à la résidence Les Jardins de Verre à Tours, de mai à juin 2016. Orientation des visiteurs et aide au secrétariat.',
    'Le titre de mon CV doit être « Réceptionniste en hôtellerie ». Fais un profil court à la première personne. Ne mets pas mes instructions dans le CV et ne transforme pas ma formation de premiers secours en diplôme.',
].join('\n\n');

const expectedEliseExtraction = {
    fullName: 'Élise Montbrun',
    location: 'Angers',
    phone: '06 00 00 00 05',
    email: 'elise.montbrun@example.com',
    permit: 'Permis B',
    headline: 'Réceptionniste en hôtellerie',
    summary: 'Je suis organisée, souriante et à l’aise avec les clients. Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
    skills: [
        'Excel',
        'Outlook',
        'Logiciel de réservation hôtelière',
        'Gestion des réclamations avec calme',
        'Organisation des priorités',
        'Travail en équipe',
    ],
    experiences: [
        'Réceptionniste — Hôtel Les Rives Dorées, Angers — mars 2025 – aujourd’hui • Gestion des arrivées et des départs • Gestion des réservations et de la facturation • Réponse aux demandes des clients par téléphone et par mail • Transmission des consignes à l’équipe de nuit • CDI',
        'Agente d’accueil — Espace Orbel, centre d’affaires, Angers — février 2022 – novembre 2024 • Accueil des visiteurs • Gestion du standard • Réservation des salles • Réception du courrier • CDD',
        'Employée de restauration — Le Comptoir des Tilleuls, Saumur — janvier 2020 – janvier 2022 • Préparation de la salle • Prise des commandes • Service',
        'Vendeuse — La Page Vagabonde, Tours — septembre 2017 – décembre 2019 • Conseil aux clients • Encaissement • Réception des livres • Préparation des commandes • CDI',
        'Stage d’accueil — Résidence Les Jardins de Verre, Tours — mai 2016 – juin 2016 • Orientation des visiteurs • Aide au secrétariat',
    ],
    projects: [],
    education: ['Bac professionnel accueil — Lycée fictif des Amandiers, Tours — 2017'],
    certifications: ['Formation de premiers secours — Association fictive Secours des Rives — avril 2024'],
    activities: ['Randonnée', 'Cinéma italien'],
    languages: [
        { language: 'Français', level: 'Courant' },
        { language: 'Italien', level: 'Niveau intermédiaire' },
        { language: 'Anglais', level: 'Débutant' },
    ],
};

test('Nouveau CV créé sur une page blanche (récit) : mise en page complète sans perte', async () => {
    const { statusCode, body } = await callKirbyCreate({
        cv: { documentLanguage: 'fr' },
        instruction: 'Crée un CV fidèle et structuré à partir du récit.',
        documentText: eliseNarrative,
        sourceKind: 'narrative',
        assistantExtracted: expectedEliseExtraction,
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.layout.reflow, true, 'un CV nouvellement créé doit toujours être réaéré');
    assert.notEqual(body.cv.layout.singlePage, false, 'la mise en page une page doit rester activée par défaut');
    assert.equal(body.cv.layout.preserveAllContent, true, 'aucune rubrique ne doit être sacrifiée pour la mise en page');
    assert.equal(body.cv.extracted.skills.length, 6, 'toutes les compétences citées doivent être conservées');
    assert.equal(body.cv.extracted.experiences.length, 5, 'les quatre emplois et le stage doivent être conservés');
    assert.equal(body.cv.extracted.education.length, 1, 'la formation doit être conservée');
    assert.equal(body.cv.extracted.certifications.length, 1, 'la certification ne doit pas être fusionnée avec la formation');
    assert.equal(body.cv.extracted.languages.length, 3, 'les trois langues doivent être conservées');
});

test('Nouveau CV créé sur une page blanche (récit) : l’expérience en cours reste en tête', async () => {
    const { body } = await callKirbyCreate({
        cv: { documentLanguage: 'fr' },
        instruction: 'Crée un CV fidèle et structuré à partir du récit.',
        documentText: eliseNarrative,
        sourceKind: 'narrative',
        assistantExtracted: expectedEliseExtraction,
    });

    assert.match(body.cv.experienceOrder[0], /Réceptionniste.+Les Rives Dorées/);
    assert.match(body.cv.experienceOrder[4], /Stage d’accueil.+Jardins de Verre/);
});
