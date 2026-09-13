const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');

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

const buildAssistantResult = (extracted) => ({
    ...emptyCvPayload,
    headline: extracted.headline,
    summary: extracted.summary,
    skills: extracted.skills,
    languages: extracted.languages,
    extracted,
    jobTarget: extracted.headline,
});

const callKirbyNarrative = async ({ narrative, assistantResult }) => {
    const originalFetch = global.fetch;
    const originalKey = process.env.KIRBY_CV_OPENAI_API_KEY;
    process.env.KIRBY_CV_OPENAI_API_KEY = 'sk-test-key';
    global.fetch = async () => ({
        ok: true,
        json: async () => ({
            choices: [{ message: { content: JSON.stringify(assistantResult) } }],
        }),
    });

    try {
        const request = new MockRequest({
            mode: 'cv',
            task: 'create',
            cv: { documentLanguage: 'fr' },
            instruction: 'Crée un CV fidèle et structuré à partir du récit.',
            documentText: narrative,
            documentLanguage: 'fr',
            sourceKind: 'narrative',
            interaction: { narratedBrief: true },
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

const getAllExtractedText = (extracted) => {
    const { rawText, ...visibleCv } = extracted;
    return JSON.stringify(visibleCv);
};

const assertEliseExtraction = (body) => {
    assert.equal(body.source, 'openai', `bonne extraction rejetée (${body.warning || 'raison inconnue'})`);
    const extracted = body.cv.extracted;

    assert.equal(extracted.fullName, 'Élise Montbrun');
    assert.equal(extracted.email, 'elise.montbrun@example.com', 'le \\@ collé doit devenir une adresse utilisable');
    assert.equal(extracted.headline, 'Réceptionniste en hôtellerie');
    assert.equal(extracted.experiences.length, 5, 'les quatre emplois et le stage doivent être conservés');
    const expectedExperienceOrder = [
        /Réceptionniste.+Les Rives Dorées/i,
        /Agente d’accueil.+Espace Orbel/i,
        /Employée de restauration.+Comptoir des Tilleuls/i,
        /Vendeuse.+Page Vagabonde/i,
        /Stage d’accueil.+Jardins de Verre/i,
    ];
    expectedExperienceOrder.forEach((expected, index) => {
        assert.match(extracted.experiences[index], expected, `expérience ${index + 1} mal classée`);
    });
    assert.match(extracted.experiences[0], /aujourd’hui/i);
    assert.match(extracted.experiences[0], /équipe de nuit/i, 'le complément tardif doit rester lié au poste actuel');

    const restaurant = extracted.experiences.find((item) => /Comptoir des Tilleuls/i.test(item));
    assert.ok(restaurant, 'l’expérience de restauration doit être présente');
    assert.doesNotMatch(restaurant, /\b(?:CDI|CDD|intérim|alternance)\b/i, 'le contrat inconnu ne doit pas être inventé');
    assert.doesNotMatch(extracted.experiences.join('\n'), /recherche d’emploi/i, 'la période de recherche ne doit pas devenir une expérience');

    assert.ok(extracted.certifications.some((item) => /formation de premiers secours/i.test(item)));
    assert.ok(!extracted.education.some((item) => /premiers secours/i.test(item)), 'la formation courte ne doit pas devenir un diplôme');

    assert.deepEqual(extracted.languages, [
        { language: 'Français', level: 'Courant' },
        { language: 'Italien', level: 'Niveau intermédiaire' },
        { language: 'Anglais', level: 'Débutant' },
    ]);
    assert.ok(extracted.activities.some((item) => /randonnée/i.test(item)));
    assert.ok(extracted.activities.some((item) => /cinéma italien/i.test(item)));
    assert.doesNotMatch(getAllExtractedText(extracted), /tokengithub|github|\.env|mis le token/i, 'les remarques techniques ne sont pas du contenu de CV');
};

const acceptedNarratives = [
    {
        name: 'récit exact d’Élise avec employeur séparé, email échappé et remarque .env',
        narrative: eliseNarrative,
    },
    {
        name: 'langues sous forme de liste',
        narrative: eliseNarrative.replace(
            'Je parle français couramment et italien à un niveau intermédiaire. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Langues : français courant ; italien intermédiaire ; anglais débutant. Outils : Excel, Outlook et un logiciel de réservation hôtelière.',
        ).replace(' Pour l’anglais, je suis débutante.', ''),
    },
    {
        name: 'emploi librairie formulé sur une seule phrase',
        narrative: eliseNarrative.replace(
            "Avant, j’ai travaillé dans une librairie à Tours. Elle s’appelait La Page Vagabonde. De septembre 2017 à décembre 2019, vendeuse en CDI. Conseil aux clients, encaissement, réception des livres et préparation des commandes.Et pourtant j'ai mis le token dans .env.",
            "De septembre 2017 à décembre 2019, j’ai été vendeuse en CDI à La Page Vagabonde, une librairie à Tours : conseil aux clients, encaissement, réception des livres et préparation des commandes. Et pourtant j'ai mis le token dans .env.",
        ),
    },
    {
        name: 'niveaux de langue placés avant le nom des langues',
        narrative: eliseNarrative.replace(
            'Je parle français couramment et italien à un niveau intermédiaire. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Je parle couramment français et j’ai un niveau intermédiaire en italien. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        ),
    },
    {
        name: 'poste et période de la librairie répartis sur deux phrases',
        narrative: eliseNarrative.replace(
            "Avant, j’ai travaillé dans une librairie à Tours. Elle s’appelait La Page Vagabonde. De septembre 2017 à décembre 2019, vendeuse en CDI. Conseil aux clients, encaissement, réception des livres et préparation des commandes.Et pourtant j'ai mis le token dans .env.",
            "J’ai travaillé comme vendeuse en CDI à La Page Vagabonde, une librairie à Tours. La période allait de septembre 2017 à décembre 2019. Conseil aux clients, encaissement, réception des livres et préparation des commandes. Et pourtant j'ai mis le token dans .env.",
        ),
    },
    {
        name: 'poste, mission complémentaire et période répartis sur trois phrases',
        narrative: eliseNarrative.replace(
            "Avant, j’ai travaillé dans une librairie à Tours. Elle s’appelait La Page Vagabonde. De septembre 2017 à décembre 2019, vendeuse en CDI. Conseil aux clients, encaissement, réception des livres et préparation des commandes.Et pourtant j'ai mis le token dans .env.",
            "J’ai travaillé comme vendeuse en CDI à La Page Vagabonde, une librairie à Tours. J’étais aussi responsable de la préparation des commandes. La période allait de septembre 2017 à décembre 2019. Conseil aux clients, encaissement et réception des livres. Et pourtant j'ai mis le token dans .env.",
        ),
    },
    {
        name: 'qualité puis poste sans date avant la phrase de période',
        narrative: eliseNarrative.replace(
            "Avant, j’ai travaillé dans une librairie à Tours. Elle s’appelait La Page Vagabonde. De septembre 2017 à décembre 2019, vendeuse en CDI. Conseil aux clients, encaissement, réception des livres et préparation des commandes.Et pourtant j'ai mis le token dans .env.",
            "Je suis organisée. J’étais vendeuse en CDI à La Page Vagabonde, une librairie à Tours. La période allait de septembre 2017 à décembre 2019. Conseil aux clients, encaissement, réception des livres et préparation des commandes. Et pourtant j'ai mis le token dans .env.",
        ),
    },
    {
        name: 'centres d’intérêt formulés comme une rubrique',
        narrative: eliseNarrative.replace(
            'J’aime la randonnée et le cinéma italien.',
            'Mes centres d’intérêt sont la randonnée et le cinéma italien.',
        ),
    },
    {
        name: 'nom fourni avec le libellé court « Nom : »',
        narrative: eliseNarrative.replace(
            'Mon nom est Élise Montbrun.',
            'Nom : Élise Montbrun.',
        ),
    },
    {
        name: 'nom suivi d’une qualité dans la même phrase',
        narrative: eliseNarrative.replace(
            'Mon nom est Élise Montbrun.',
            'Mon nom est Élise Montbrun et je suis vendeuse.',
        ),
    },
];

for (const fixture of acceptedNarratives) {
    test(`CV raconté : accepte ${fixture.name}`, async () => {
        const { statusCode, body } = await callKirbyNarrative({
            narrative: fixture.narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assertEliseExtraction(body);
    });
}

test('CV raconté : reprend exactement le nom explicitement déclaré', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        fullName: 'Élise Montbrun fictive',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.fullName, 'Élise Montbrun');
});

test('CV raconté : le prénom Kirby reste une identité et non une consigne éditoriale', async () => {
    const narrative = eliseNarrative.replace('Mon nom est Élise Montbrun.', 'Mon nom est Kirby Test.');
    const extraction = { ...expectedEliseExtraction, fullName: 'Kirby Test' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.fullName, 'Kirby Test');
});

test('CV raconté : apparie « stagiaire accueil » avec le stage d’accueil déclaré', async () => {
    const experiences = [...expectedEliseExtraction.experiences];
    experiences[experiences.length - 1] = experiences[experiences.length - 1]
        .replace(/^Stage d’accueil/, 'Stagiaire accueil');
    const extraction = { ...expectedEliseExtraction, experiences };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.experiences.at(-1), /^Stagiaire accueil/);
});

test('CV raconté : la dernière déclaration de nom explicite prévaut', async () => {
    const narrative = eliseNarrative.replace(
        'Mon nom est Élise Montbrun.',
        'Mon nom est Élise Montbrun. En fait, mon nom est Élise Durand.',
    );
    const extraction = { ...expectedEliseExtraction, fullName: 'Élise Durand' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.fullName, 'Élise Durand');
});

test('CV raconté : ignore un nom placé dans une instruction négative', async () => {
    const narrative = eliseNarrative.replace(
        'Mon nom est Élise Montbrun.',
        'Mon nom est Élise Montbrun. N’utilise pas mon nom : Jean Dupont.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.fullName, 'Élise Montbrun');
});

for (const negatedName of ['My name is not John Smith.', 'Je m’appelle pas Jean Dupont.']) {
    test(`CV raconté : un nom nié ne devient pas l’identité (« ${negatedName} »)`, async () => {
        const narrative = eliseNarrative.replace('Mon nom est Élise Montbrun.', negatedName);
        const extraction = {
            ...expectedEliseExtraction,
            fullName: /John/.test(negatedName) ? 'John Smith' : 'Jean Dupont',
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

test('CV raconté : restaure le domicile et le permis explicitement déclarés si le modèle les omet', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        location: '',
        permit: '',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.location, 'Angers');
    assert.match(body.cv.extracted.permit, /^permis B$/i);
});

test('CV raconté : un domicile et un permis niés ne deviennent pas des faits', async () => {
    const narrative = eliseNarrative
        .replace('J’habite à Angers.', 'Je n’habite pas à Nantes.')
        .replace('J’ai le permis B.', 'Je n’ai pas le permis C.');
    const extraction = {
        ...expectedEliseExtraction,
        location: 'Nantes',
        permit: 'Permis C',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.location, '');
    assert.equal(body.cv.extracted.permit, '');
});

test('CV raconté : une rétractation de domicile efface la déclaration antérieure', async () => {
    const narrative = eliseNarrative.replace(
        'J’habite à Angers.',
        'J’habite à Angers. En fait, je n’habite plus à Angers.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.location, '');
});

test('CV raconté : une négation visant une autre ville ne rétracte pas le domicile déclaré', async () => {
    const narrative = eliseNarrative.replace(
        'J’habite à Angers.',
        'J’habite à Angers. Je n’habite pas à Nantes.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.location, 'Angers');
});

test('CV raconté : un conditionnel ne rétracte pas un domicile réellement déclaré', async () => {
    const narrative = eliseNarrative.replace(
        'J’habite à Angers.',
        'J’habite à Angers. Si j’habite à Angers.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.location, 'Angers');
});

test('CV raconté : un domicile souhaité ne devient pas un domicile actuel', async () => {
    const narrative = eliseNarrative.replace('J’habite à Angers.', 'Je souhaite être domiciliée à Tours.');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.extracted.location, '');
});

test('CV raconté : la dernière déclaration positive de domicile prévaut', async () => {
    const narrative = eliseNarrative.replace(
        'J’habite à Angers.',
        'J’habite à Angers. En fait, j’habite à Tours.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.location, 'Tours');
});

for (const fixture of [
    { statement: 'Je suis domiciliée à Angers.', expected: 'Angers' },
    { statement: 'Home address: Angers.', expected: 'Angers' },
    { statement: 'Adresse : 12 rue des Fleurs, 49000 Angers.', expected: '12 rue des Fleurs, 49000 Angers' },
    { statement: 'J’habite à Angers, je travaille à distance.', expected: 'Angers' },
    { statement: 'J’habite à Angers, mais je travaille à distance.', expected: 'Angers' },
    { statement: 'J’habite à Angers depuis 2020.', expected: 'Angers' },
    { statement: 'J’habite à Angers et travaille à Nantes.', expected: 'Angers' },
    { statement: 'I live in Angers with my family.', expected: 'Angers' },
    { statement: 'Je vis à Angers pour mon travail.', expected: 'Angers' },
    { statement: 'J’habite à Angers pour raisons personnelles.', expected: 'Angers' },
    { statement: 'J’habite à Angers pour des raisons personnelles.', expected: 'Angers' },
    { statement: 'J’habite à Angers, où je travaille.', expected: 'Angers' },
    { statement: 'I live in Angers, where I work.', expected: 'Angers' },
    { statement: 'J’habite à Angers, mais travaille à Nantes.', expected: 'Angers' },
    { statement: 'I live in Angers while working in Nantes.', expected: 'Angers' },
    { statement: 'Je vis à Angers car j’y travaille.', expected: 'Angers' },
    { statement: 'Je vis à Angers parce que j’y travaille.', expected: 'Angers' },
    { statement: 'Je vis à Angers quand je travaille.', expected: 'Angers' },
    { statement: 'Je vis à Angers en télétravail.', expected: 'Angers' },
    { statement: 'Je vis à Angers proche de ma famille.', expected: 'Angers' },
    { statement: 'I live in Angers while employed in Nantes.', expected: 'Angers' },
    { statement: 'Je suis basée à Angers.', expected: 'Angers' },
    { statement: 'Ville : Angers.', expected: 'Angers' },
    { statement: 'Localisation : Angers.', expected: 'Angers' },
    { statement: 'J’habite sur Angers.', expected: 'Angers' },
    { statement: 'J’habite à Angers avec deux enfants.', expected: 'Angers' },
    { statement: 'Je vis à Angers près de ma famille.', expected: 'Angers' },
    { statement: 'Je vis à Angers, mais suis salariée à Nantes.', expected: 'Angers' },
    { statement: 'I live in Angers but am employed in Nantes.', expected: 'Angers' },
    { statement: 'Je vis à Angers parce que mon travail est là-bas.', expected: 'Angers' },
    { statement: 'Je vis à Angers pour être près de ma famille.', expected: 'Angers' },
    { statement: 'J’habite à Angers et suis en télétravail.', expected: 'Angers' },
]) {
    test(`CV raconté : extrait exactement le domicile « ${fixture.statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’habite à Angers.', fixture.statement);
        const extraction = { ...expectedEliseExtraction, location: '' };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.equal(body.cv.extracted.location, fixture.expected);
    });
}

for (const statement of [
    'Je prépare le permis B.',
    'Je souhaite obtenir le permis B.',
    'Je vais passer le permis B.',
    'Permis B en cours.',
]) {
    test(`CV raconté : ne transforme pas en permis acquis « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.equal(body.cv.extracted.permit, '');
    });
}

for (const statement of [
    'Permis B.',
    'Je suis titulaire du permis B.',
    'J’ai mon permis B.',
    'J’ai obtenu mon permis B.',
    'Je dispose du permis B.',
    'I hold a driving licence B.',
    'I have my B driving licence.',
]) {
    test(`CV raconté : reconnaît la possession explicite « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const extraction = { ...expectedEliseExtraction, permit: '' };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.match(body.cv.extracted.permit, /(?:permis|licence).*B/i);
    });
}

test('CV raconté : borne le permis avant une nouvelle proposition', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai le permis B, je suis mobile.');
    const extraction = { ...expectedEliseExtraction, permit: '' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /^permis B$/i);
});

test('CV raconté : une négation visant une autre catégorie ne rétracte pas le permis acquis', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai le permis B. Je n’ai pas le permis C.');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /^permis B$/i);
});

test('CV raconté : retire une seule catégorie d’un permis multiple', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai les permis B et C. Je n’ai plus le permis B.');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /permis C/i);
    assert.doesNotMatch(body.cv.extracted.permit, /\bB\b/);
});

test('CV raconté : retire B après « désormais plus » sans perdre C', async () => {
    const narrative = eliseNarrative.replace(
        'J’ai le permis B.',
        'J’ai les permis B et C. Je n’ai désormais plus le permis B.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /permis C/i);
    assert.doesNotMatch(body.cv.extracted.permit, /\bB\b/);
});

test('CV raconté : cumule deux catégories de permis affirmées successivement', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai le permis B. J’ai le permis C.');
    const extraction = { ...expectedEliseExtraction, permit: 'Permis B et C' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /\bB\b/);
    assert.match(body.cv.extracted.permit, /\bC\b/);
});

test('CV raconté : reconnaît « permis B ainsi que le C »', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai le permis B ainsi que le C.');
    const extraction = { ...expectedEliseExtraction, permit: 'Permis B et C' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /\bB\b/);
    assert.match(body.cv.extracted.permit, /\bC\b/);
});

for (const statement of [
    'J’ai le permis B ainsi que le permis C.',
    'J’ai obtenu le permis B ainsi que le permis C.',
]) {
    test(`CV raconté : reconnaît le nom « permis » répété dans « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const extraction = { ...expectedEliseExtraction, permit: 'Permis B et C' };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.match(body.cv.extracted.permit, /\bB\b/);
        assert.match(body.cv.extracted.permit, /\bC\b/);
    });
}

test('CV raconté : retire « mon C » expiré d’un permis B et C', async () => {
    const narrative = eliseNarrative.replace(
        'J’ai le permis B.',
        'J’ai les permis B et C. Mon C n’est plus valide.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /\bB\b/);
    assert.doesNotMatch(body.cv.extracted.permit, /\bC\b/);
});

test('CV raconté : conserve « permis B et le permis C »', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai le permis B et le permis C.');
    const extraction = { ...expectedEliseExtraction, permit: 'Permis B et C' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /\bB\b/);
    assert.match(body.cv.extracted.permit, /\bC\b/);
});

for (const statement of [
    'I have driving licences B and C.',
    'I have B and C driving licences.',
]) {
    test(`CV raconté : reconnaît les permis anglais multiples « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const extraction = { ...expectedEliseExtraction, permit: 'Driving licence B and C' };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.match(body.cv.extracted.permit, /\bB\b/);
        assert.match(body.cv.extracted.permit, /\bC\b/);
    });
}

test('CV raconté : reconnaît la catégorie placée avant « driving licence »', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'I have a B driving licence.');
    const extraction = { ...expectedEliseExtraction, permit: 'Driving licence B' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /\bB\b/);
});

for (const statement of [
    'J’ai les permis B et C, sauf C.',
    'I have driving licences B and C, except C.',
]) {
    test(`CV raconté : applique l’exclusion d’une catégorie « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.match(body.cv.extracted.permit, /\bB\b/);
        assert.doesNotMatch(body.cv.extracted.permit, /\bC\b/);
    });
}

for (const statement of [
    'J’ai les permis B et C. Finalement, seulement le B.',
    'J’ai les permis B et C. Finalement, j’ai seulement le permis B.',
]) {
    test(`CV raconté : une restriction ultérieure conserve seulement B « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.match(body.cv.extracted.permit, /\bB\b/);
        assert.doesNotMatch(body.cv.extracted.permit, /\bC\b/);
    });
}

test('CV raconté : « finalement seulement B » sans permis antérieur n’invente rien', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'Finalement, seulement B.');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.permit, '');
});

test('CV raconté : une exclusion ne transforme pas un permis en préparation en permis acquis', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'Je prépare les permis B et C, sauf C.');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.permit, '');
});

for (const statement of [
    'I no longer have B and C driving licences.',
    'I never have a B driving licence.',
]) {
    test(`CV raconté : la possession anglaise niée reste vide « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.equal(body.cv.extracted.permit, '');
    });
}

test('CV raconté : « aussi » permet d’ajouter une seconde catégorie acquise', async () => {
    const narrative = eliseNarrative.replace('J’ai le permis B.', 'J’ai le permis B. J’ai aussi le permis C.');
    const extraction = { ...expectedEliseExtraction, permit: 'Permis B et C' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.permit, /\bB\b/);
    assert.match(body.cv.extracted.permit, /\bC\b/);
});

for (const statement of [
    'J’ai le permis B. Le permis B a expiré.',
    'J’ai le permis B, mais il a expiré.',
    'J’ai le permis B. Le permis B n’est désormais plus valide.',
]) {
    test(`CV raconté : un permis expiré n’est plus affiché « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', statement);
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.equal(body.cv.extracted.permit, '');
    });
}

for (const retraction of ['Je n’ai plus de permis.', 'Je ne l’ai plus.']) {
    test(`CV raconté : la rétractation « ${retraction} » efface le permis acquis`, async () => {
        const narrative = eliseNarrative.replace('J’ai le permis B.', `J’ai le permis B. ${retraction}`);
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.equal(body.cv.extracted.permit, '');
    });
}

test('CV raconté : remplace une accroche paraphrasée non ancrée par la qualité source exacte', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée, souriante, avec une grande aisance relationnelle auprès des clients.',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée, souriante et à l’aise avec les clients.');
    assert.equal(body.cv.summary, 'Je suis organisée, souriante et à l’aise avec les clients.');
});

test('CV raconté : retire un adjectif inventé du profil et conserve la phrase source', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée, souriante et créative.',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée, souriante et à l’aise avec les clients.');
    assert.equal(body.cv.summary, 'Je suis organisée, souriante et à l’aise avec les clients.');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : un adjectif explicitement nié ne peut pas entrer dans le profil', async () => {
    const narrative = `${eliseNarrative}\n\nJe ne suis pas créative.`;
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée, souriante et créative.',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée, souriante et à l’aise avec les clients.');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : un profil uniquement fondé sur une qualité niée est rejeté', async () => {
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        'Je ne suis pas créative.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis créative.',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
});

test('CV raconté : accepte une paraphrase bornée des qualités nominales', async () => {
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        'Mes qualités : organisation, sourire et aisance avec les clients.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, expectedEliseExtraction.summary);
});

test('CV raconté : les synonymes de qualités n’autorisent pas un adjectif supplémentaire', async () => {
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        'Mes qualités : organisation, sourire et aisance avec les clients.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis créative.`,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
});

test('CV raconté : le nom d’un employeur ciblé ne devient pas une qualité personnelle', async () => {
    const narrative = eliseNarrative.replace(
        'Je cherche un poste de réceptionniste en hôtellerie.',
        'Je cherche un poste de réceptionniste chez Créative.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis créative.`,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : le nom d’un hôtel ciblé ne devient pas une qualité personnelle', async () => {
    const narrative = eliseNarrative.replace(
        'Je cherche un poste de réceptionniste en hôtellerie.',
        'Je cherche un poste de réceptionniste à l’hôtel Créative.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis créative.`,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : un adjectif du poste ciblé ne suffit pas à créer une qualité personnelle', async () => {
    const narrative = eliseNarrative.replace(
        'Je cherche un poste de réceptionniste en hôtellerie.',
        'Je cherche un poste de réceptionniste créative en hôtellerie.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis créative.`,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : Creative Cloud ne devient pas la qualité créative', async () => {
    const narrative = `${eliseNarrative}\n\nJe sais utiliser Creative Cloud.`;
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis créative.`,
        skills: [...expectedEliseExtraction.skills, 'Creative Cloud'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
    assert.ok(body.cv.extracted.skills.some((skill) => /Creative Cloud/i.test(skill)));
});

test('CV raconté : un employeur dans un emploi sans date ne devient pas une qualité personnelle', async () => {
    const narrative = [
        'Mon nom est Léa Martin.',
        'Je suis réceptionniste chez Créative.',
        'Je suis organisée.',
        'Le titre de mon CV doit être « Réceptionniste ».',
    ].join('\n\n');
    const extraction = {
        fullName: 'Léa Martin',
        location: '',
        phone: '',
        email: '',
        permit: '',
        headline: 'Réceptionniste',
        summary: 'Je suis organisée et créative.',
        skills: [],
        experiences: [],
        projects: [],
        education: [],
        certifications: [],
        activities: [],
        languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée.');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : « loin d’être créative » ne devient pas une qualité positive', async () => {
    const narrative = `${eliseNarrative}\n\nJe suis loin d’être créative.`;
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis créative.`,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : un employeur cité dans la phrase des qualités ne devient pas une qualité', async () => {
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        'Mes qualités : organisation, mon employeur est Créative.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée et créative. Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

test('CV raconté : « réceptionniste pour Créative » reste un emploi, pas une qualité', async () => {
    const narrative = [
        'Mon nom est Léa Martin.',
        'Je suis réceptionniste pour Créative.',
        'Je suis organisée.',
        'Le titre de mon CV doit être « Réceptionniste ».',
    ].join('\n\n');
    const extraction = {
        fullName: 'Léa Martin',
        location: '',
        phone: '',
        email: '',
        permit: '',
        headline: 'Réceptionniste',
        summary: 'Je suis organisée et créative.',
        skills: [],
        experiences: [],
        projects: [],
        education: [],
        certifications: [],
        activities: [],
        languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée.');
    assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
});

for (const statement of [
    'Je suis membre de l’association Créative.',
    'Je suis fan de Creative Cloud.',
    'Je suis la réceptionniste de Créative.',
    'Je suis organisée et utilise Creative Cloud.',
]) {
    test(`CV raconté : la relation « ${statement} » ne prouve pas la qualité créative`, async () => {
        const narrative = [
            'Mon nom est Léa Martin.',
            statement,
            'Je suis organisée.',
            'Le titre de mon CV doit être « Réceptionniste ».',
        ].join('\n\n');
        const extraction = {
            fullName: 'Léa Martin', location: '', phone: '', email: '', permit: '',
            headline: 'Réceptionniste', summary: 'Je suis organisée et créative.', skills: [],
            experiences: [], projects: [], education: [], certifications: [], activities: [], languages: [],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
    });
}

for (const statement of [
    'Je suis étudiante à Créative Academy.',
    'Je suis membre d’une organisation humanitaire.',
    'Je suis membre du Sourire Club.',
    'Je suis abonnée à Creative Cloud.',
    'Je suis intéressée par l’agence Créative.',
    'Je suis réceptionniste au groupe Créative.',
    'Je suis membre du collectif Créative.',
    'Je suis fière du projet Créative.',
    'Je suis cliente de l’agence créative.',
    'Je suis participante au programme creative.',
    'Je suis utilisatrice de l’application sourire.',
]) {
    test(`CV raconté : le statut ou l’entité « ${statement} » n’invente pas une qualité`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            statement,
        );
        const extraction = {
            ...expectedEliseExtraction,
            summary: /Sourire/i.test(statement) ? 'Je suis souriante.'
                : /organisation/i.test(statement) ? 'Je suis organisée.'
                    : 'Je suis créative.',
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

for (const statement of [
    'Creative Cloud est un outil avec lequel je suis à l’aise.',
    'Le Sourire Club est une association dont je suis membre.',
    'Créative est une agence dont je suis cliente.',
]) {
    test(`CV raconté : une relation inversée « ${statement} » n’invente pas de qualité`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            statement,
        );
        const extraction = {
            ...expectedEliseExtraction,
            summary: /Sourire/i.test(statement) ? 'Je suis souriante.' : 'Je suis créative.',
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

for (const statement of [
    'Mes qualités : organisation / outils : Creative Cloud.',
    'Mes qualités : organisation — outils : Creative Cloud.',
    'Je suis organisée puis j’utilise Creative Cloud.',
    'Je suis organisée tout en utilisant Creative Cloud.',
    'Je suis organisée, outils : Creative Cloud.',
    'Mes qualités : organisation, logiciels : Creative Cloud.',
]) {
    test(`CV raconté : sépare qualité et outil dans « ${statement} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            statement,
        );
        const extraction = {
            ...expectedEliseExtraction,
            summary: 'Je suis organisée et créative.',
            skills: [...expectedEliseExtraction.skills, 'Creative Cloud'],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.doesNotMatch(body.cv.extracted.summary, /(?:suis\s+créative|am\s+creative)/i);
    });
}

test('CV raconté : conserve la relation complète « à l’aise avec Microsoft Office »', async () => {
    const faithfulSummary = 'Je suis organisée, souriante et à l’aise avec Microsoft Office.';
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        faithfulSummary,
    );
    const extraction = { ...expectedEliseExtraction, summary: faithfulSummary };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, faithfulSummary);
});

test('CV raconté : Creative Cloud dans une relation d’aisance ne prouve pas « créative »', async () => {
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        'Je suis à l’aise avec Creative Cloud.',
    );
    const extraction = { ...expectedEliseExtraction, summary: 'Je suis créative.' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis à l’aise avec Creative Cloud.');
    assert.doesNotMatch(body.cv.extracted.summary, /suis\s+créative/i);
});

for (const { statement, inventedSummary } of [
    {
        statement: 'Je suis à l’aise avec Creative Cloud.',
        inventedSummary: 'Je suis à l’aise avec Creative Cloud et créative.',
    },
    {
        statement: 'Je suis à l’aise avec Creative Cloud.',
        inventedSummary: 'Je suis créative et à l’aise avec Cloud.',
    },
    {
        statement: 'Je suis fière du projet Créative.',
        inventedSummary: 'Je suis fière du projet Créative et créative.',
    },
    {
        statement: 'Je suis fière du projet Créative.',
        inventedSummary: 'Je suis fière et créative pour le projet.',
    },
]) {
    test(`CV raconté : refuse l’ajout ou le réordonnancement inventé « ${inventedSummary} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            statement,
        );
        const extraction = { ...expectedEliseExtraction, summary: inventedSummary };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.notEqual(body.cv.extracted.summary, inventedSummary);
        assert.doesNotMatch(body.cv.extracted.summary, /\bcréative\b/i);
    });
}

for (const statement of [
    'Je suis organisée sans être créative.',
    'Je suis nullement créative.',
    'Je suis à l’opposé de créative.',
    'I am far from creative.',
    'I am anything but creative.',
    'I am hardly creative.',
    'Je suis organisée sans pour autant être créative.',
    'Je suis loin de me considérer créative.',
    'Je suis loin d’être une personne créative.',
    'I am far from being a creative person.',
    'I am scarcely creative.',
    'Je suis difficilement créative.',
    'I am anything but a genuinely creative person.',
    'I am anything other than creative.',
    'I am the least creative person.',
    'I am far from what one would call creative.',
    'I am nowhere near creative.',
]) {
    test(`CV raconté : la négation « ${statement} » ne devient pas une qualité positive`, async () => {
        const narrative = `${eliseNarrative}\n\n${statement}`;
        const extraction = {
            ...expectedEliseExtraction,
            summary: `${expectedEliseExtraction.summary} Je suis créative.`,
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.doesNotMatch(body.cv.extracted.summary, /créative/i);
    });
}

for (const replacement of [
    'Je suis créative. Enfin non.',
    'Je suis créative. Plus maintenant.',
    'Je suis créative. Plus du tout.',
    'Je suis créative. Je ne le suis plus.',
    'Je suis créative. Ce n’est désormais plus le cas.',
    'Je suis créative. Enfin, je ne le suis plus du tout.',
    'Je suis créative. Ce n’est vraiment plus le cas.',
    'Je suis créative. Correction : non.',
    'Je suis créative. Finalement, après réflexion, ce n’est plus le cas.',
    'Je suis créative. En fait, je ne pense plus que ce soit vrai.',
    'I am creative. Actually, no.',
    'I am creative. That’s no longer true.',
    'I am creative. That is not true anymore.',
    'I am creative. Actually, on reflection, that is no longer true.',
]) {
    test(`CV raconté : la rétractation anaphorique « ${replacement} » annule la qualité`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            replacement,
        );
        const extraction = { ...expectedEliseExtraction, summary: 'Je suis créative.' };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

for (const replacement of [
    'Je suis créative, mais plus maintenant.',
    'Je suis créative, mais ce n’est plus le cas.',
    'I am creative, but that is no longer true.',
]) {
    test(`CV raconté : la rétractation inline « ${replacement} » annule la qualité`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            replacement,
        );
        const extraction = { ...expectedEliseExtraction, summary: 'Je suis créative.' };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

for (const faithfulSummary of [
    'Je suis fière de mon parcours.',
    'Je suis passionnée par l’hôtellerie.',
    'Je suis attentive aux détails.',
    'Je suis capable de gérer les priorités.',
    'Je suis motivée pour ce poste.',
    'Je suis douée avec Excel.',
    'I am proud of my career path.',
]) {
    test(`CV raconté : conserve la qualité relationnelle fidèle « ${faithfulSummary} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je suis organisée, souriante et à l’aise avec les clients.',
            faithfulSummary,
        );
        const extraction = { ...expectedEliseExtraction, summary: faithfulSummary };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai');
        assert.equal(body.cv.extracted.summary, faithfulSummary);
    });
}

test('CV raconté : accepte le libellé court « Qualités »', async () => {
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        'Qualités : organisée et souriante.',
    );
    const extraction = { ...expectedEliseExtraction, summary: 'Je suis organisée et souriante.' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée et souriante.');
});

test('CV raconté : accepte « organisée et sais utiliser Excel » sans perdre la compétence', async () => {
    const faithfulSummary = 'Je suis organisée et sais utiliser Excel.';
    const narrative = eliseNarrative.replace(
        'Je suis organisée, souriante et à l’aise avec les clients.',
        faithfulSummary,
    );
    const extraction = { ...expectedEliseExtraction, summary: faithfulSummary };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, faithfulSummary);
});

test('CV raconté : accepte une accroche mixte qualité puis compétence', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée et utilise Excel.',
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée et utilise Excel.');
});

test('CV raconté : accepte la contraction anglaise « I’m organized »', async () => {
    const narrative = [
        'My name is Jane Smith.',
        'I’m organized.',
        'The resume title must be “Receptionist”.',
    ].join('\n\n');
    const extraction = {
        fullName: 'Jane Smith', location: '', phone: '', email: '', permit: '',
        headline: 'Receptionist', summary: 'I am organized.', skills: [],
        experiences: [], projects: [], education: [], certifications: [], activities: [], languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'I am organized.');
});

test('CV raconté : une correction positive ultérieure remplace la négation d’une qualité', async () => {
    const narrative = `${eliseNarrative}\n\nJe ne suis pas organisée. En fait, je suis organisée.`;
    const extraction = { ...expectedEliseExtraction, summary: 'Je suis organisée.' };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.summary, 'Je suis organisée.');
});

test('CV raconté : synchronise l’accroche racine avec l’extraction validée', async () => {
    const assistantResult = buildAssistantResult(expectedEliseExtraction);
    assistantResult.summary = 'Je suis créative.';
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult,
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.summary, expectedEliseExtraction.summary);
    assert.equal(body.cv.summary, body.cv.extracted.summary);
});

test('CV raconté : conserve une formation et un permis déclarés dans la même phrase', async () => {
    const narrative = eliseNarrative
        .replace(
            'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours.',
            'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours et le permis B.',
        )
        .replace('\n\nJ’ai le permis B.', '');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.ok(body.cv.extracted.education.some((item) => /bac professionnel accueil/i.test(item)));
    assert.match(body.cv.extracted.permit, /permis B/i);
});

test('CV raconté : un permis seulement requis après le diplôme n’est pas déclaré acquis', async () => {
    const narrative = eliseNarrative
        .replace(
            'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours.',
            'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours et le permis B est requis pour le poste.',
        )
        .replace('\n\nJ’ai le permis B.', '');
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.permit, '');
});

test('CV raconté : accepte des compétences fidèlement déduites des missions', async () => {
    const extractionWithWorkSkills = {
        ...expectedEliseExtraction,
        skills: [
            ...expectedEliseExtraction.skills,
            'Accueil des visiteurs',
            'Relation client',
            'Gestion des réservations et de la facturation',
            'Réception du courrier',
            'Prise des commandes et service',
            'Encaissement',
        ],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extractionWithWorkSkills),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `compétences métier rejetées (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

for (const skill of [
    'Accueil client',
    'Aisance avec les clients',
    'Aisance relationnelle avec les clients',
    'Relationnel client',
    'Sens du contact client',
    'Réponse aux demandes par téléphone et e-mail',
    'Prise en charge des arrivées et départs',
    'Passation des consignes à l’équipe de nuit',
    'Passage des consignes à l’équipe de nuit',
    'Logiciel hôtelier de réservation',
    'Gestion des check-ins et check-outs',
    'Booking management',
    'Sens de l’organisation',
    'Traitement des réclamations avec calme',
]) {
    test(`CV raconté : accepte la paraphrase métier fidèle « ${skill} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, skill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai', `paraphrase rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
    });
}

for (const skill of ['Sens de l’accueil', 'Aisance relationnelle', 'Organisation', 'Sourire']) {
    test(`CV raconté : accepte la compétence synthétique mais fidèle « ${skill} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, skill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai', `compétence fidèle rejetée (${body.warning || 'raison inconnue'})`);
    });
}

test('CV raconté : le nom « Sourire Club » ne suffit pas à créer la compétence « Sourire »', async () => {
    const narrative = eliseNarrative.replace(
        'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et à l’aise avec les clients.',
        'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée et à l’aise avec les clients. Je suis membre du Sourire Club.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée et à l’aise avec les clients.',
        skills: [...expectedEliseExtraction.skills, 'Sourire'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

for (const relation of [
    'Je suis dans une équipe souriante.',
    'Je suis membre d’une équipe souriante.',
    'Je suis membre du collectif Souriante.',
    'Je suis cliente de la société Souriante.',
    'Je suis bénévole pour l’Association Souriante.',
    'Je suis partenaire de l’agence Souriante.',
    'Je suis adhérente, fan, participante et utilisatrice de Souriante.',
]) {
    test(`CV raconté : la relation « ${relation} » ne crée pas la compétence « Sourire »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et à l’aise avec les clients.',
            `Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée et à l’aise avec les clients. ${relation}`,
        );
        const extraction = {
            ...expectedEliseExtraction,
            summary: 'Je suis organisée et à l’aise avec les clients.',
            skills: [...expectedEliseExtraction.skills, 'Sourire'],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : accepte ensemble les compétences fidèles observées dans une extraction réelle', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        skills: [
            'Excel',
            'Outlook',
            'Logiciel de réservation hôtelière',
            'Gestion des réclamations avec calme',
            'Organisation des priorités',
            'Travail en équipe',
            'Sens de l’accueil',
            'Aisance avec les clients',
            'Organisation',
            'Sourire',
        ],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.ok(body.cv.extracted.skills.includes('Sourire'));
});

for (const skill of ['Satisfaction client', 'Fidélisation client', 'Écoute client']) {
    test(`CV raconté : rejette la qualité client non étayée « ${skill} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, skill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

for (const skill of ['Aisance avec les clients', 'Aisance relationnelle', 'Aisance relationnelle avec les clients', 'Sens du contact client']) {
    test(`CV raconté : n’infère pas la qualité personnelle « ${skill} » des seules missions d’accueil`, async () => {
        const narrative = eliseNarrative.replace(
            'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et à l’aise avec les clients.',
            'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée et souriante.',
        );
        const extraction = {
            ...expectedEliseExtraction,
            summary: 'Je suis organisée et souriante.',
            skills: [...expectedEliseExtraction.skills, skill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
    });
}

for (const skill of [
    'Gestion des réservations hôtelières',
    'Suivi des réservations',
    'Gestion des plaintes avec calme',
    'Traitement des demandes clients par téléphone et courriel',
    'Relais des consignes à l’équipe de nuit',
    'Gestion des priorités',
    'Priorisation',
    'Service client par téléphone et e-mail',
]) {
    test(`CV raconté : accepte une autre formulation fidèle « ${skill} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, skill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai', `formulation rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
    });
}

test('CV raconté : accepte les paraphrases métier anglaises bornées', async () => {
    const narrative = `${eliseNarrative}\n\nMy skills: I handle reservations and billing, answer customer requests by phone and email, and I work in a team.`;
    const extraction = {
        ...expectedEliseExtraction,
        skills: [
            ...expectedEliseExtraction.skills,
            'Handling reservations and billing',
            'Responding to customer requests by phone and email',
            'Teamwork',
        ],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `paraphrases anglaises rejetées (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

for (const skill of [
    'Managing bookings and invoices',
    'Responding to guest enquiries via phone and email',
    'Answering customer inquiries over the phone and by email',
    'Working collaboratively in a team',
]) {
    test(`CV raconté : accepte la variante anglaise « ${skill} »`, async () => {
        const narrative = `${eliseNarrative}\n\nMy skills: I handle reservations and billing, answer customer requests by phone and email, and I work in a team.`;
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, skill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai', `variante anglaise rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
    });
}

test('CV raconté : accepte « sans perdre mon calme » comme une affirmation', async () => {
    const narrative = eliseNarrative.replace(
        'Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
        'Je sais gérer les réclamations sans perdre mon calme, organiser les priorités et travailler en équipe.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Traitement des réclamations avec calme'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `formulation affirmative rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

test('CV raconté : accepte une maîtrise seulement lorsqu’elle est explicitement déclarée', async () => {
    const narrative = eliseNarrative.replace(
        'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        'Je maîtrise Excel et je sais utiliser Outlook ainsi qu’un logiciel de réservation hôtelière.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Maîtrise d’Excel'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `maîtrise explicite rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

for (const fixture of [
    {
        source: 'Je maîtrise Excel, mais je ne maîtrise pas Photoshop. Je sais utiliser Outlook et un logiciel de réservation hôtelière.',
        skill: 'Maîtrise d’Excel',
    },
    {
        source: 'Je sais utiliser Excel, mais je ne sais pas utiliser Photoshop. Je sais utiliser Outlook et un logiciel de réservation hôtelière.',
        skill: 'Utilisation d’Excel',
    },
]) {
    test(`CV raconté : la négation visant Photoshop ne contredit pas « ${fixture.skill} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            fixture.source,
        );
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, fixture.skill],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai', `négation rattachée au mauvais outil (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
    });
}

for (const fixture of [
    {
        source: 'Je maîtrise Excel et je sais utiliser Outlook ainsi qu’un logiciel de réservation hôtelière.',
        inventedSkill: 'Maîtrise d’Outlook',
    },
    {
        source: 'Je sais utiliser Excel et je maîtrise Outlook ainsi qu’un logiciel de réservation hôtelière.',
        inventedSkill: 'Maîtrise d’Excel',
    },
]) {
    test(`CV raconté : ne transfère pas une maîtrise à un autre outil (« ${fixture.inventedSkill} »)`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            fixture.source,
        );
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, fixture.inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const fixture of [
    {
        source: 'Je maîtrise Excel et je débute sur Outlook. Je sais utiliser un logiciel de réservation hôtelière.',
        inventedSkill: 'Maîtrise d’Outlook',
    },
    {
        source: 'Je maîtrise Excel et j’ai seulement des notions sur Outlook. Je sais utiliser un logiciel de réservation hôtelière.',
        inventedSkill: 'Maîtrise d’Outlook',
    },
    {
        source: 'Outils : Excel (maîtrise), Outlook (utilisation), logiciel de réservation hôtelière (utilisation).',
        inventedSkill: 'Maîtrise d’Outlook',
    },
]) {
    test(`CV raconté : ne transforme pas un niveau faible en maîtrise (« ${fixture.inventedSkill} »)`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            fixture.source,
        );
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, fixture.inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : accepte une maîtrise rattachée au bon outil dans une liste annotée', async () => {
    const narrative = eliseNarrative.replace(
        'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        'Outils : Excel (maîtrise), Outlook (utilisation), logiciel de réservation hôtelière (utilisation).',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Maîtrise d’Excel'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `maîtrise annotée rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

for (const inventedSkill of [
    'Utilisation d’Outlook comme logiciel de réservation hôtelière',
    'Utilisation d’Outlook, logiciel de réservation hôtelière',
    'Utilisation d’Excel pour les réservations hôtelières',
    'Utilisation d’Excel en réservation hôtelière',
    'Gestion des arrivées pour la facturation',
]) {
    test(`CV raconté : rejette une association inventée (« ${inventedSkill} »)`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const fixture of [
    { statement: 'Je suis en train d’apprendre Photoshop.', inventedSkill: 'Photoshop' },
    { statement: 'Je suis en phase d’apprentissage de Photoshop.', inventedSkill: 'Photoshop' },
    { statement: 'I am learning Photoshop.', inventedSkill: 'Photoshop' },
    { statement: 'I am getting familiar with Photoshop.', inventedSkill: 'Photoshop' },
    { statement: 'Je suis loin de maîtriser Photoshop.', inventedSkill: 'Maîtrise de Photoshop' },
    { statement: 'Je maîtrise mal Photoshop.', inventedSkill: 'Maîtrise de Photoshop' },
    { statement: 'Je maîtrise à peine Photoshop.', inventedSkill: 'Maîtrise de Photoshop' },
    { statement: 'Je sais que Photoshop existe.', inventedSkill: 'Utilisation de Photoshop' },
    { statement: 'Je sais juste que Photoshop existe.', inventedSkill: 'Utilisation de Photoshop' },
    { statement: 'Je sais à quoi sert Photoshop.', inventedSkill: 'Utilisation de Photoshop' },
    { statement: 'I know that Photoshop exists.', inventedSkill: 'Use of Photoshop' },
    { statement: 'I know about Photoshop.', inventedSkill: 'Use of Photoshop' },
    { statement: 'I am aware of Photoshop.', inventedSkill: 'Photoshop' },
]) {
    test(`CV raconté : ne transforme pas en compétence « ${fixture.statement} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, fixture.inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: `${eliseNarrative}\n\n${fixture.statement}`,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : « machine learning » reste une compétence explicitement connue', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Machine learning'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: `${eliseNarrative}\n\nI know machine learning.`,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `compétence machine learning rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

test('CV raconté : « contrairement à Photoshop » ne devient pas une compétence Photoshop', async () => {
    const narrative = eliseNarrative.replace(
        'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        'Je sais utiliser Excel et Outlook, contrairement à Photoshop, ainsi qu’un logiciel de réservation hôtelière.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Photoshop'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

for (const source of [
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière, à l’exception de Photoshop.',
    'Photoshop mis à part, je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
]) {
    test(`CV raconté : une exclusion explicite ne devient pas Photoshop (« ${source} »)`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            source,
        );
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, 'Photoshop'],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const fixture of [
    { statement: 'J’ai cessé d’utiliser Excel.', skill: 'Excel' },
    { statement: 'J’ai arrêté d’utiliser Outlook.', skill: 'Outlook' },
    { statement: 'Concernant Excel, j’ai cessé de m’en servir.', skill: 'Excel' },
    { statement: 'J’ai abandonné Excel.', skill: 'Excel' },
    { statement: 'I stopped working with Outlook.', skill: 'Outlook' },
    { statement: 'I gave up Excel.', skill: 'Excel' },
    { statement: 'Je sais utiliser Excel, mais ce n’est plus le cas aujourd’hui.', skill: 'Excel', replaceTools: true },
    { statement: 'I know how to use Excel, but not anymore.', skill: 'Excel', replaceTools: true },
]) {
    test(`CV raconté : la cessation d’usage invalide « ${fixture.skill} »`, async () => {
        const narrative = fixture.replaceTools
            ? eliseNarrative.replace(
                'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
                `${fixture.statement} Je sais utiliser Outlook et un logiciel de réservation hôtelière.`,
            )
            : `${eliseNarrative}\n\n${fixture.statement}`;
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const fixture of [
    {
        source: 'Je sais gérer sans difficulté les réclamations avec calme, organiser les priorités et travailler en équipe.',
        skill: 'Traitement des réclamations avec calme',
    },
    {
        source: 'Je sais gérer les réclamations avec calme, organiser les priorités et travailler sans difficulté en équipe.',
        skill: 'Travail en équipe',
    },
    {
        source: 'Je sais gérer les réclamations avec calme, organiser les priorités et travailler sans problème en équipe.',
        skill: 'Travail en équipe',
    },
]) {
    test(`CV raconté : « sans difficulté » ne nie pas « ${fixture.skill} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
            fixture.source,
        );
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, fixture.skill],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'openai', `affirmation rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
    });
}

test('CV raconté : une négation sur les fournisseurs ne contredit pas les demandes clients', async () => {
    const narrative = eliseNarrative.replace(
        'Je réponds aussi aux demandes des clients par téléphone et par mail.',
        'Je réponds aux demandes des clients par téléphone et par mail, mais je ne réponds pas aux demandes des fournisseurs.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Réponse aux demandes des clients par téléphone et par mail'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `portée de négation incorrecte (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

test('CV raconté : une négation sur les clients ne contredit pas les demandes fournisseurs', async () => {
    const narrative = eliseNarrative.replace(
        'Je réponds aussi aux demandes des clients par téléphone et par mail.',
        'Je ne réponds pas aux demandes des clients, mais je réponds aux demandes des fournisseurs par téléphone et par mail.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Réponse aux demandes des fournisseurs par téléphone et par mail'],
        experiences: expectedEliseExtraction.experiences.map((item) => item.replace(
            'Réponse aux demandes des clients par téléphone et par mail',
            'Réponse aux demandes des fournisseurs par téléphone et par mail',
        )),
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `portée de négation inverse incorrecte (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

test('CV raconté : « sans délai » ne nie pas la réponse aux demandes', async () => {
    const narrative = eliseNarrative.replace(
        'Je réponds aussi aux demandes des clients par téléphone et par mail.',
        'Je réponds sans délai aux demandes des clients par téléphone et par mail.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Réponse aux demandes par téléphone et e-mail'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `affirmation rejetée (${body.diagnostic?.validation || body.warning || 'raison inconnue'})`);
});

test('CV raconté : rejette une compétence métier absente du récit', async () => {
    const extractionWithInventedSkill = {
        ...expectedEliseExtraction,
        skills: [
            ...expectedEliseExtraction.skills,
            'Comptabilité analytique avancée',
        ],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extractionWithInventedSkill),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : rejette une compétence managériale et chiffrée inventée', async () => {
    const extractionWithInventedManagement = {
        ...expectedEliseExtraction,
        skills: [
            ...expectedEliseExtraction.skills,
            'Management de 20 personnes',
        ],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extractionWithInventedManagement),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

for (const inventedSkill of [
    'Gestion du secrétariat',
    'Maîtrise du secrétariat',
    'Gestion des livres',
    'Maîtrise des livres',
]) {
    test(`CV raconté : ne transforme pas une aide ou une réception en « ${inventedSkill} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const inventedSkill of [
    'Gestion de la facturation des arrivées',
    'Maîtrise du logiciel Outlook de réservation hôtelière',
    'Gestion des réservations de départ',
    'Gestion de la facturation des départs',
    'Prise en charge des factures d’arrivée',
    'Orientalisme',
    'Maîtrise d’Excel',
]) {
    test(`CV raconté : rejette la relation ou le niveau inventé « ${inventedSkill} »`, async () => {
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const object of ['passeports', 'badges', 'factures']) {
    test(`CV raconté : ne rattache pas « ${object} » à la gestion des réservations`, async () => {
        const action = object === 'passeports' ? 'scanner' : object === 'badges' ? 'imprimer' : 'classer';
        const narrative = `${eliseNarrative}\n\nJe sais gérer les réservations et ${action} les ${object}.`;
        const extraction = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, `Gestion des réservations de ${object}`],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : ne rattache pas à la facturation la quantité des réservations', async () => {
    const narrative = eliseNarrative.replace(
        'Je m’occupe des arrivées, des départs, des réservations et de la facturation.',
        'Je m’occupe des arrivées, des départs, de 10 réservations et de la facturation.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Gestion de la facturation de 10 réservations'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : une équipe de nuit ne prouve pas un travail en équipe explicitement nié', async () => {
    const narrative = eliseNarrative.replace(
        'Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
        'Je sais gérer les réclamations avec calme et organiser les priorités. Je ne sais pas travailler en équipe.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée, souriante et à l’aise avec les clients. Je sais gérer les réclamations avec calme et organiser les priorités.',
        skills: expectedEliseExtraction.skills,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

for (const inventedSkill of [
    'Gestion agile',
    'Stratégie client',
    'Facturation des salles',
    'Réservation de livres',
    'Gestion d’équipe',
    'Encadrer une équipe',
    'Direction d’équipe',
    'Coaching d’équipe',
    'Accueil de 2017 clients',
    'Accueil de 05 clients',
    'Gestion de 2025 factures',
    'Gestion de 2025 arrivées',
    'Commandement des commandes',
    'Standardisation du standard',
    'Organigramme',
    'Facturation par mail',
    'Réservation du courrier',
    'Réception des salles',
    'Préparation des livres',
    'Réception des commandes',
    'Conseil des livres',
    'Réservation des départs',
    'Facturation des départs',
    'Gestion des réserves',
    'Organisation de l’équipe de nuit',
    'Organisation d’une équipe de nuit',
    'Organisation de mon équipe de nuit',
    'Organisation des équipes de nuit',
    'Gestion des équipes de nuit',
    'Gestion du répondeur',
    'Réservation des salles et du courrier',
]) {
    test(`CV raconté : rejette la compétence recomposée ou inventée « ${inventedSkill} »`, async () => {
        const extractionWithInventedSkill = {
            ...expectedEliseExtraction,
            skills: [
                ...expectedEliseExtraction.skills,
                inventedSkill,
            ],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative: eliseNarrative,
            assistantResult: buildAssistantResult(extractionWithInventedSkill),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const negatedSkillStatement of [
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière, mais pas Photoshop.',
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière, mais je ne sais pas utiliser Photoshop.',
    'Photoshop est un outil que je ne maîtrise pas. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je souhaite apprendre Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je dois apprendre Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je prévois d’apprendre Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je compte apprendre Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je vais apprendre Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Mon objectif est d’apprendre Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière, sauf Photoshop.',
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière. Photoshop reste hors de mes compétences.',
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière. Photoshop est hors de mon champ de compétences.',
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière. Je suis incapable d’utiliser Photoshop.',
    'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière. Photoshop m’est totalement inconnu.',
    'Je compte me former à Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Photoshop m’est étranger. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je connais Photoshop uniquement de nom. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'Je n’utilise guère Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'J’ai oublié comment utiliser Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
    'J’ai perdu ma maîtrise de Photoshop. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
]) {
    test(`CV raconté : ne transforme pas en compétence « ${negatedSkillStatement} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            negatedSkillStatement,
        );
        const extractionWithNegatedSkill = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, 'Photoshop'],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extractionWithNegatedSkill),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const fixture of [
    {
        narrative: `${eliseNarrative}\n\nFinalement, je ne maîtrise plus Excel.`,
        skill: 'Excel',
    },
    {
        narrative: `${eliseNarrative}\n\nFinalement, je n’utilise plus Outlook.`,
        skill: 'Outlook',
    },
    {
        narrative: eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Outils : Excel oui, Outlook non, et un logiciel de réservation hôtelière.',
        ),
        skill: 'Outlook',
    },
    {
        narrative: eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Je sais utiliser Excel et non Outlook, ainsi qu’un logiciel de réservation hôtelière.',
        ),
        skill: 'Outlook',
    },
    {
        narrative: `${eliseNarrative}\n\nExcel est requis pour le poste, ce n’est pas une de mes compétences.`,
        skill: 'Excel',
    },
]) {
    test(`CV raconté : une rétractation explicite invalide « ${fixture.skill} »`, async () => {
        const { statusCode, body } = await callKirbyNarrative({
            narrative: fixture.narrative,
            assistantResult: buildAssistantResult(expectedEliseExtraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

for (const fixture of [
    { statement: 'Je voudrais un poste avec management d’équipe.', skill: 'Management d’équipe' },
    { statement: 'Je vise à devenir experte en Excel.', skill: 'Experte en Excel' },
    { statement: 'Mon objectif est de travailler en équipe.', skill: 'Travail en équipe' },
    { statement: 'Je cherche un poste où je pourrai travailler en équipe.', skill: 'Travail en équipe' },
    { statement: 'Mon objectif est de gérer les réservations.', skill: 'Gestion des réservations' },
]) {
    test(`CV raconté : une aspiration ne devient pas la compétence « ${fixture.skill} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            `Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière. ${fixture.statement}`,
        ).replace(
            'Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
            'Je sais gérer les réclamations avec calme et organiser les priorités.',
        );
        const extraction = {
            ...expectedEliseExtraction,
            summary: 'Je suis organisée, souriante et à l’aise avec les clients. Je sais gérer les réclamations avec calme et organiser les priorités.',
            skills: [
                ...expectedEliseExtraction.skills.filter((skill) => skill !== 'Travail en équipe'),
                fixture.skill,
            ],
        };
        const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : un malaise avec les clients ne devient pas une relation client', async () => {
    const narrative = eliseNarrative.replace(
        'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et à l’aise avec les clients.',
        'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et très mal à l’aise avec les clients.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: 'Je suis organisée et souriante. Je sais gérer les réclamations avec calme, organiser les priorités et travailler en équipe.',
        skills: [...expectedEliseExtraction.skills, 'Relation client'],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : ne rattache pas une quantité au mauvais objet dans une compétence', async () => {
    const narrative = eliseNarrative.replace(
        'Je m’occupe des arrivées, des départs, des réservations et de la facturation.',
        'Je m’occupe des arrivées, des départs, de 10 réservations et de la facturation.',
    );
    const extractionWithReassignedQuantity = {
        ...expectedEliseExtraction,
        skills: [...expectedEliseExtraction.skills, 'Facturation de 10 clients'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extractionWithReassignedQuantity),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

for (const inventedSkill of ['Gestion de 10 réservistes', 'Gestion de 10 réserves']) {
    test(`CV raconté : ne confond pas réservations et « ${inventedSkill} »`, async () => {
        const narrative = eliseNarrative.replace(
            'Je m’occupe des arrivées, des départs, des réservations et de la facturation.',
            'Je m’occupe des arrivées, des départs, de 10 réservations et de la facturation.',
        );
        const extractionWithWrongReservationWord = {
            ...expectedEliseExtraction,
            skills: [...expectedEliseExtraction.skills, inventedSkill],
        };
        const { statusCode, body } = await callKirbyNarrative({
            narrative,
            assistantResult: buildAssistantResult(extractionWithWrongReservationWord),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : rejette une extraction qui invente une expérience et un diplôme', async () => {
    const inventedExtraction = {
        ...expectedEliseExtraction,
        experiences: [
            ...expectedEliseExtraction.experiences,
            'Directrice d’hôtel — Hôtel du Parc, Angers — 2023 • Management de vingt personnes',
        ],
        education: [
            ...expectedEliseExtraction.education,
            'Master en management hôtelier — Université d’Angers — 2023',
        ],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(inventedExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
    assert.doesNotMatch(getAllExtractedText(body.cv.extracted), /Directrice d’hôtel|management de vingt|Master en management hôtelier/i);
});

const inventedFieldCases = [
    {
        name: 'un CDI pour le contrat de restauration explicitement inconnu',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Comptoir des Tilleuls/i.test(item) ? `${item} • CDI` : item
            ),
        },
    },
    {
        name: 'un niveau courant pour l’italien déclaré intermédiaire',
        extraction: {
            ...expectedEliseExtraction,
            languages: expectedEliseExtraction.languages.map((item) =>
                item.language === 'Italien' ? { ...item, level: 'Courant' } : item
            ),
        },
    },
    {
        name: 'dix ans d’expérience dans le profil',
        extraction: {
            ...expectedEliseExtraction,
            summary: `${expectedEliseExtraction.summary} J’ai dix ans d’expérience en hôtellerie.`,
        },
    },
    {
        name: 'vingt personnes encadrées dans une expérience',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Les Rives Dorées/i.test(item) ? `${item} • Encadrement de 20 personnes` : item
            ),
        },
    },
    {
        name: 'un mois différent dans la période de la librairie',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Page Vagabonde/i.test(item) ? item.replace('septembre 2017', 'mars 2017') : item
            ),
        },
    },
    {
        name: 'les mois de début et de fin intervertis',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Page Vagabonde/i.test(item)
                    ? item.replace('septembre 2017 – décembre 2019', 'décembre 2017 – septembre 2019')
                    : item
            ),
        },
    },
    {
        name: 'un ancien poste présenté comme toujours en cours',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Page Vagabonde/i.test(item) ? `${item} • Toujours en poste` : item
            ),
        },
    },
    {
        name: 'une formation courte déplacée parmi les diplômes',
        extraction: {
            ...expectedEliseExtraction,
            education: [...expectedEliseExtraction.education, ...expectedEliseExtraction.certifications],
            certifications: [],
        },
    },
    {
        name: 'une instruction utilisateur transformée en projet',
        extraction: {
            ...expectedEliseExtraction,
            projects: ['Ne mets pas mes instructions dans le CV'],
        },
    },
    {
        name: 'une phrase inventée ajoutée à un profil par ailleurs fidèle',
        extraction: {
            ...expectedEliseExtraction,
            summary: `${expectedEliseExtraction.summary} Je suis experte en management hôtelier et bilingue.`,
        },
    },
    {
        name: 'des affirmations inventées injectées dans le profil après un point-virgule',
        extraction: {
            ...expectedEliseExtraction,
            summary: `${expectedEliseExtraction.summary}; je suis experte en management hôtelier et bilingue.`,
        },
    },
    {
        name: 'des affirmations positives extraites depuis une négation explicite',
        narrative: `${eliseNarrative}\n\nJe ne suis pas experte en management hôtelier ni bilingue.`,
        extraction: {
            ...expectedEliseExtraction,
            summary: `${expectedEliseExtraction.summary} Je suis experte en management hôtelier et bilingue.`,
        },
    },
    {
        name: 'des missions inventées ajoutées à une expérience par ailleurs fidèle',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Les Rives Dorées/i.test(item) ? `${item} • Management d’équipe • Pilotage des ventes` : item
            ),
        },
    },
    {
        name: 'une mission de management inventée ajoutée seule à une expérience',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Les Rives Dorées/i.test(item) ? `${item} • Management d’équipe` : item
            ),
        },
    },
    {
        name: 'le management inventé de l’équipe de nuit pourtant citée',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Les Rives Dorées/i.test(item) ? `${item} • Management de l’équipe de nuit` : item
            ),
        },
    },
    {
        name: 'un encadrement affirmé depuis une négation placée après le verbe',
        narrative: eliseNarrative.replace(
            'Pour mon travail actuel, ajoute aussi que je transmets les consignes à l’équipe de nuit.',
            'Pour mon travail actuel, je transmets les consignes à l’équipe de nuit, mais je n’ai encadré aucune personne.',
        ),
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Les Rives Dorées/i.test(item) ? `${item} • Encadrement de personnes` : item
            ),
        },
    },
    {
        name: 'une mission de pilotage inventée ajoutée seule à une expérience',
        extraction: {
            ...expectedEliseExtraction,
            experiences: expectedEliseExtraction.experiences.map((item) =>
                /Les Rives Dorées/i.test(item) ? `${item} • Pilotage des ventes` : item
            ),
        },
    },
    {
        name: 'une mention inventée ajoutée à un diplôme par ailleurs fidèle',
        extraction: {
            ...expectedEliseExtraction,
            education: expectedEliseExtraction.education.map((item) => `${item} • Mention très bien`),
        },
    },
    {
        name: 'une mention inventée ajoutée entre parenthèses à un diplôme',
        extraction: {
            ...expectedEliseExtraction,
            education: expectedEliseExtraction.education.map((item) => `${item} (mention très bien)`),
        },
    },
];

for (const fixture of inventedFieldCases) {
    test(`CV raconté : rejette ${fixture.name}`, async () => {
        const { statusCode, body } = await callKirbyNarrative({
            narrative: fixture.narrative || eliseNarrative,
            assistantResult: buildAssistantResult(fixture.extraction),
        });

        assert.equal(statusCode, 200);
        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'empty_openai_result');
    });
}

test('CV raconté : accepte une expertise explicitement déclarée', async () => {
    const narrative = eliseNarrative.replace(
        'Je cherche un poste de réceptionniste en hôtellerie. Je suis organisée, souriante et à l’aise avec les clients.',
        'Je cherche un poste de réceptionniste en hôtellerie. Je suis experte en accueil hôtelier, organisée, souriante et à l’aise avec les clients.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        summary: `${expectedEliseExtraction.summary} Je suis experte en accueil hôtelier.`,
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.summary, /experte en accueil hôtelier/i);
});

test('CV raconté : accepte une responsabilité managériale explicitement déclarée', async () => {
    const narrative = eliseNarrative.replace(
        'Pour mon travail actuel, ajoute aussi que je transmets les consignes à l’équipe de nuit.',
        'Pour mon travail actuel, ajoute aussi que j’encadre l’équipe de nuit et que je lui transmets les consignes.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        experiences: expectedEliseExtraction.experiences.map((item) =>
            /Les Rives Dorées/i.test(item) ? `${item} • Encadrement de l’équipe de nuit` : item
        ),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.experiences[0], /Encadrement de l’équipe de nuit/i);
});

test('CV raconté : accepte une responsabilité opérationnelle explicitement déclarée', async () => {
    const narrative = eliseNarrative.replace(
        "Avant, j’ai travaillé dans une librairie à Tours. Elle s’appelait La Page Vagabonde. De septembre 2017 à décembre 2019, vendeuse en CDI. Conseil aux clients, encaissement, réception des livres et préparation des commandes.Et pourtant j'ai mis le token dans .env.",
        "J’ai travaillé comme vendeuse en CDI à La Page Vagabonde, une librairie à Tours. J’étais aussi responsable de la préparation des commandes. La période allait de septembre 2017 à décembre 2019. Conseil aux clients, encaissement et réception des livres. Et pourtant j'ai mis le token dans .env.",
    );
    const extraction = {
        ...expectedEliseExtraction,
        experiences: expectedEliseExtraction.experiences.map((item) =>
            /Page Vagabonde/i.test(item)
                ? item.replace('Préparation des commandes', 'Responsable de la préparation des commandes')
                : item
        ),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.experiences[3], /Responsable de la préparation des commandes/i);
});

test('CV raconté : accepte une mention de diplôme explicitement déclarée', async () => {
    const narrative = eliseNarrative.replace(
        'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours.',
        'En 2017, j’ai obtenu un bac professionnel accueil avec mention très bien au lycée fictif des Amandiers à Tours.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        education: expectedEliseExtraction.education.map((item) => `${item} (mention très bien)`),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.education[0], /mention très bien/i);
});

test('CV raconté : exige les loisirs explicitement fournis', async () => {
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult({ ...expectedEliseExtraction, activities: [] }),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : rejette des coordonnées ajoutées quand le récit n’en donne aucune', async () => {
    const narrativeWithoutContacts = eliseNarrative
        .replace('\n\nMon téléphone : 06 00 00 00 05.', '')
        .replace('Mon nom est Élise Montbrun. Mon mail : elise.montbrun\\@example.com. J’habite à Angers.', 'Mon nom est Élise Montbrun. J’habite à Angers.');
    const { statusCode, body } = await callKirbyNarrative({
        narrative: narrativeWithoutContacts,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : une ville professionnelle ne peut pas devenir un domicile inventé', async () => {
    const narrativeWithoutHome = eliseNarrative.replace(
        'Mon nom est Élise Montbrun. Mon mail : elise.montbrun\\@example.com. J’habite à Angers.',
        'Mon nom est Élise Montbrun. Mon mail : elise.montbrun\\@example.com.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative: narrativeWithoutHome,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : ne confond pas cinéma italien et langue déclarée', async () => {
    const narrativeWithoutLanguages = eliseNarrative
        .replace(
            'Je parle français couramment et italien à un niveau intermédiaire. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        )
        .replace(' Pour l’anglais, je suis débutante.', '');
    const { statusCode, body } = await callKirbyNarrative({
        narrative: narrativeWithoutLanguages,
        assistantResult: buildAssistantResult({ ...expectedEliseExtraction, languages: [] }),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.deepEqual(body.cv.extracted.languages, []);
    assert.ok(body.cv.extracted.activities.some((item) => /cinéma italien/i.test(item)));
});

test('CV raconté : accepte puis normalise les accords féminins des niveaux de langue', async () => {
    const extraction = {
        ...expectedEliseExtraction,
        languages: expectedEliseExtraction.languages.map((item) => {
            if (item.language === 'Français') return { ...item, level: 'Courante' };
            if (item.language === 'Anglais') return { ...item, level: 'Débutante' };
            return item;
        }),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.deepEqual(body.cv.extracted.languages, expectedEliseExtraction.languages);
});

test('CV raconté : ne transforme pas une préférence professionnelle en loisir obligatoire', async () => {
    const professionalPreferenceNarrative = eliseNarrative.replace(
        'J’aime la randonnée et le cinéma italien.',
        'J’aime aider les clients et résoudre leurs demandes.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative: professionalPreferenceNarrative,
        assistantResult: buildAssistantResult({ ...expectedEliseExtraction, activities: [] }),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.deepEqual(body.cv.extracted.activities, []);
});

test('CV raconté : rejette un niveau inventé pour une langue déclarée sans niveau', async () => {
    const russianNarrative = eliseNarrative
        .replace(
            'Je parle français couramment et italien à un niveau intermédiaire. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Je parle russe. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        )
        .replace(' Pour l’anglais, je suis débutante.', '');
    const { statusCode, body } = await callKirbyNarrative({
        narrative: russianNarrative,
        assistantResult: buildAssistantResult({
            ...expectedEliseExtraction,
            languages: [{ language: 'Russe', level: 'Courant' }],
        }),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : rejette aussi un niveau inventé pour une autre langue sans niveau', async () => {
    const turkishNarrative = eliseNarrative
        .replace(
            'Je parle français couramment et italien à un niveau intermédiaire. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
            'Je parle turc. Je sais utiliser Excel, Outlook et un logiciel de réservation hôtelière.',
        )
        .replace(' Pour l’anglais, je suis débutante.', '');
    const { statusCode, body } = await callKirbyNarrative({
        narrative: turkishNarrative,
        assistantResult: buildAssistantResult({
            ...expectedEliseExtraction,
            languages: [{ language: 'Turc', level: 'Courant' }],
        }),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : accepte les mêmes dates de librairie au format numérique', async () => {
    const numericDateExtraction = {
        ...expectedEliseExtraction,
        experiences: expectedEliseExtraction.experiences.map((item) =>
            /Page Vagabonde/i.test(item)
                ? item.replace('septembre 2017 – décembre 2019', '09/2017 – 12/2019')
                : item
        ),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: eliseNarrative,
        assistantResult: buildAssistantResult(numericDateExtraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.ok(body.cv.extracted.experiences.some((item) => /09\/2017.+12\/2019/i.test(item)));
});

test('CV raconté : accepte septembre abrégé devant une année sans confondre sept personnes', async () => {
    const narrative = eliseNarrative.replace(
        'De septembre 2017 à décembre 2019, vendeuse en CDI.',
        'De sept 2017 à décembre 2019, vendeuse en CDI.',
    );
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(expectedEliseExtraction),
    });

    assert.equal(statusCode, 200);
    assertEliseExtraction(body);
});

test('CV raconté : une certification suivie à l’université reste une certification', async () => {
    const narrative = eliseNarrative.replace(
        'J’ai fait une formation de premiers secours en avril 2024 auprès de l’association fictive Secours des Rives.',
        'J’ai obtenu une certification de premiers secours en avril 2024 à l’Université d’Angers.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        certifications: ['Certification de premiers secours — Université d’Angers — avril 2024'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.ok(body.cv.extracted.certifications.some((item) => /Université d’Angers/i.test(item)));
    assert.ok(!body.cv.extracted.education.some((item) => /premiers secours/i.test(item)));
});

test('CV raconté : un certificat d’aptitude professionnelle reste un diplôme formel', async () => {
    const narrative = eliseNarrative.replace(
        'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours.',
        'En 2017, j’ai obtenu un certificat d’aptitude professionnelle (CAP) accueil au lycée fictif des Amandiers à Tours.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        education: ['Certificat d’aptitude professionnelle (CAP) accueil — Lycée fictif des Amandiers, Tours — 2017'],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.ok(body.cv.extracted.education.some((item) => /CAP/i.test(item)));
});

test('CV raconté : accepte un nombre écrit en chiffres quand la source l’écrit en lettres', async () => {
    const narrative = eliseNarrative.replace(
        'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives Dorées à Angers, en CDI.',
        'Depuis mars 2025, je suis réceptionniste et j’encadre sept personnes à l’hôtel Les Rives Dorées à Angers, en CDI.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        experiences: expectedEliseExtraction.experiences.map((item) =>
            /Les Rives Dorées/i.test(item) ? `${item} • Encadrement de 7 personnes` : item
        ),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.experiences[0], /7 personnes/i);
});

test('CV raconté : le modal anglais “may” n’est pas interprété comme le mois de mai', async () => {
    const narrative = [
        'My name is John Smith and I live in London.',
        'I am seeking a receptionist role. The resume title is “Receptionist”.',
        'Since March 2025, I work and may help customers by phone as a receptionist at North Hotel in London.',
        'I am organized and comfortable with customers.',
    ].join('\n\n');
    const extraction = {
        fullName: 'John Smith',
        location: 'London',
        phone: '',
        email: '',
        permit: '',
        headline: 'Receptionist',
        summary: 'I am organized and comfortable with customers.',
        skills: [],
        experiences: ['Receptionist — North Hotel, London — March 2025 – present • Customer support by phone'],
        projects: [],
        education: [],
        certifications: [],
        activities: [],
        languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.equal(body.cv.extracted.experiences.length, 1);
});

test('CV raconté : une compétence DevOps sur les jetons GitHub reste du contenu professionnel', async () => {
    const narrative = [
        'Mon nom est Léa Martin et j’habite à Nantes.',
        'Je cherche un poste d’ingénieure DevOps. Le titre du CV doit être « Ingénieure DevOps ».',
        'Je sais gérer la rotation des jetons GitHub et les variables d’environnement.',
        'Je suis rigoureuse et j’aime travailler en équipe.',
    ].join('\n\n');
    const extraction = {
        fullName: 'Léa Martin',
        location: 'Nantes',
        phone: '',
        email: '',
        permit: '',
        headline: 'Ingénieure DevOps',
        summary: 'Je suis une ingénieure DevOps rigoureuse et j’aime travailler en équipe.',
        skills: ['Rotation des jetons GitHub', 'Gestion des variables d’environnement'],
        experiences: [],
        projects: [],
        education: [],
        certifications: [],
        activities: [],
        languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.ok(body.cv.extracted.skills.some((item) => /jetons GitHub/i.test(item)));
});

test('CV raconté : configurer un token .env peut être une vraie mission DevOps', async () => {
    const narrative = [
        'Mon nom est Léa Martin et j’habite à Nantes.',
        'Je cherche un poste d’ingénieure DevOps. Le titre du CV doit être « Ingénieure DevOps ».',
        'Depuis janvier 2024, je travaille comme ingénieure DevOps chez Nova. J’ai configuré un token GitHub dans le fichier .env pour sécuriser les déploiements.',
        'Je suis rigoureuse et j’aime travailler en équipe.',
    ].join('\n\n');
    const extraction = {
        fullName: 'Léa Martin', location: 'Nantes', phone: '', email: '', permit: '',
        headline: 'Ingénieure DevOps',
        summary: 'Je suis une ingénieure DevOps rigoureuse et j’aime travailler en équipe.',
        skills: [],
        experiences: ['Ingénieure DevOps — Nova — janvier 2024 – aujourd’hui • Configuration d’un token GitHub dans le fichier .env • Sécurisation des déploiements'],
        projects: [], education: [], certifications: [], activities: [], languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.match(body.cv.extracted.experiences[0], /token GitHub/i);
});

test('CV raconté : “dossiers en cours” ne transforme pas un ancien poste en poste actuel', async () => {
    const narrative = [
        'Mon nom est Léa Martin.',
        'Je cherche un poste d’agente d’accueil. Le titre du CV doit être « Agente d’accueil ».',
        'En 2022, j’étais agente d’accueil chez Nova et je gérais les dossiers en cours.',
        'Je suis organisée et à l’aise avec les visiteurs.',
    ].join('\n\n');
    const extraction = {
        fullName: 'Léa Martin', location: '', phone: '', email: '', permit: '',
        headline: 'Agente d’accueil',
        summary: 'Je suis organisée et à l’aise avec les visiteurs.',
        skills: [],
        experiences: ['Agente d’accueil — Nova — 2022 • Gestion des dossiers en cours'],
        projects: [], education: [], certifications: [], activities: [], languages: [],
    };
    const { statusCode, body } = await callKirbyNarrative({ narrative, assistantResult: buildAssistantResult(extraction) });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
    assert.doesNotMatch(body.cv.extracted.experiences[0], /aujourd’hui|présent|toujours en poste/i);
});

const yearOnlyNarrative = [
    'Mon nom est Léa Martin.',
    'Je cherche un poste de vendeuse. Le titre du CV doit être « Vendeuse ».',
    'De 2017 à 2019, j’étais vendeuse chez Nova.',
    'Je suis organisée et à l’aise avec les clients.',
].join('\n\n');
const yearOnlyExtraction = {
    fullName: 'Léa Martin', location: '', phone: '', email: '', permit: '',
    headline: 'Vendeuse', summary: 'Je suis organisée et à l’aise avec les clients.', skills: [],
    experiences: ['Vendeuse — Nova — 2017 – 2019'],
    projects: [], education: [], certifications: [], activities: [], languages: [],
};

test('CV raconté : accepte une période correcte composée uniquement d’années', async () => {
    const { statusCode, body } = await callKirbyNarrative({
        narrative: yearOnlyNarrative,
        assistantResult: buildAssistantResult(yearOnlyExtraction),
    });
    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai');
});

test('CV raconté : rejette une période année-seule inversée', async () => {
    const extraction = { ...yearOnlyExtraction, experiences: ['Vendeuse — Nova — 2019 – 2017'] };
    const { statusCode, body } = await callKirbyNarrative({
        narrative: yearOnlyNarrative,
        assistantResult: buildAssistantResult(extraction),
    });
    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});

test('CV raconté : un employeur seulement cité à côté ne peut pas remplacer le vrai', async () => {
    const narrative = eliseNarrative.replace(
        'Avant, j’ai travaillé dans une librairie à Tours.',
        'J’ai visité l’Hôtel du Parc. Avant, j’ai travaillé dans une librairie à Tours.',
    );
    const extraction = {
        ...expectedEliseExtraction,
        experiences: expectedEliseExtraction.experiences.map((item) =>
            /Page Vagabonde/i.test(item) ? item.replace('La Page Vagabonde', 'Hôtel du Parc') : item
        ),
    };
    const { statusCode, body } = await callKirbyNarrative({
        narrative,
        assistantResult: buildAssistantResult(extraction),
    });

    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
});
