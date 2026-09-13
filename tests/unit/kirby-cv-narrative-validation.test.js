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
