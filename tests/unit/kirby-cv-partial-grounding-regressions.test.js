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

const emptyExtraction = {
    fullName: '',
    location: '',
    phone: '',
    email: '',
    permit: '',
    headline: '',
    summary: '',
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    certifications: [],
    activities: [],
    languages: [],
};

const buildAssistantResult = (extracted) => ({
    documentLanguage: 'fr',
    headline: extracted.headline,
    summary: extracted.summary,
    skills: extracted.skills,
    experienceOrder: [],
    languages: extracted.languages,
    periodGaps: [],
    generatedExperiences: [],
    educationSuggestions: [],
    extracted,
    jobTarget: extracted.headline,
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
});

const callKirbyNarrative = async ({ narrative, extraction }) => {
    const originalFetch = global.fetch;
    const originalKey = process.env.KIRBY_CV_OPENAI_API_KEY;
    const assistantResult = buildAssistantResult({ ...emptyExtraction, ...extraction });
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

const assertRejectedAsUngrounded = async (fixture) => {
    const { statusCode, body } = await callKirbyNarrative(fixture);
    assert.equal(statusCode, 200);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'empty_openai_result');
};

const assertAcceptedAsGrounded = async (fixture) => {
    const { statusCode, body } = await callKirbyNarrative(fixture);
    assert.equal(statusCode, 200);
    assert.equal(body.source, 'openai', `fait fidèle rejeté (${body.warning || 'raison inconnue'})`);
    return body.cv.extracted;
};

test('CV raconté partiel : rejette un master substitué à un bac pourtant entouré de faits exacts', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'En 2017, j’ai obtenu un bac professionnel accueil au lycée fictif des Amandiers à Tours.',
        extraction: {
            education: ['Master accueil — Lycée fictif des Amandiers, Tours — 2017'],
        },
    });
});

test('CV raconté partiel : une expérience ne peut pas voler l’année d’un diplôme voisin', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives à Angers. En 2017, j’ai obtenu un bac professionnel accueil.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives, Angers — 2017'],
        },
    });
});

test('CV raconté partiel : une expérience ne peut pas voler l’établissement d’une formation voisine', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives à Angers. En 2024, j’ai suivi une formation à l’Hôtel du Parc.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel du Parc, Angers — mars 2025'],
        },
    });
});

test('CV raconté partiel : une expérience ne peut pas voler le mois d’une formation voisine', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives à Angers. En avril 2024, j’ai suivi une formation de premiers secours.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives, Angers — avril 2024'],
        },
    });
});

test('CV raconté partiel : une expérience ne peut pas voler le contrat d’une formation voisine', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives à Angers. Ma formation suivante était en alternance.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives, Angers — mars 2025 • Alternance'],
        },
    });
});

test('CV raconté partiel : un loisir voisin ne devient pas une mission professionnelle', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives à Angers. J’aime la randonnée.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives, Angers — mars 2025 • Randonnée'],
        },
    });
});

test('CV raconté partiel : une compétence générale voisine ne devient pas une mission professionnelle', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives à Angers. Je sais utiliser Excel.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives, Angers — mars 2025 • Excel'],
        },
    });
});

test('CV raconté partiel : une expérience ambiguë est affectée à l’épisode qui contient réellement sa mission', async () => {
    const experience = 'Vendeuse • Encaissement';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'De janvier 2020 à janvier 2021, j’ai été vendeuse chez Alpha. De février 2022 à février 2023, j’ai été vendeuse chez Beta. Je faisais l’encaissement.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : réduire une date mois-année à son année ne crée pas une date', async () => {
    const experience = 'Réceptionniste — Hôtel Les Rives — 2025';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : un contrat explicitement nié ne peut pas être affiché', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'De janvier 2020 à janvier 2022, j’étais vendeuse chez Alpha, mais pas en CDI.',
        extraction: {
            experiences: ['Vendeuse — Alpha — janvier 2020 – janvier 2022 • CDI'],
        },
    });
});

test('CV raconté partiel : une langue explicitement niée ne peut pas être affichée', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Je parle français, mais pas italien.',
        extraction: {
            languages: [{ language: 'Italien', level: '' }],
        },
    });
});

test('CV raconté partiel : une simple formation ne devient pas une certification obtenue', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'J’ai fait une formation de premiers secours en avril 2024 auprès de l’association Secours des Rives.',
        extraction: {
            certifications: ['Certification de premiers secours — Association Secours des Rives — avril 2024'],
        },
    });
});

test('CV raconté partiel : une simple formation ne devient pas un diplôme dans la rubrique certifications', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'J’ai fait une formation de premiers secours en avril 2024 auprès de l’association Secours des Rives.',
        extraction: {
            certifications: ['Diplôme de premiers secours — Association Secours des Rives — avril 2024'],
        },
    });
});

test('CV raconté partiel : un nom d’employeur proche lexicalement ne remplace pas le nom déclaré', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Amandiers à Angers.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Amandine, Angers — mars 2025'],
        },
    });
});

test('CV raconté partiel : un nom d’établissement proche lexicalement ne remplace pas le nom déclaré', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'En 2017, j’ai obtenu un bac accueil au lycée Amandiers à Tours.',
        extraction: {
            education: ['Bac accueil — Lycée Amandine, Tours — 2017'],
        },
    });
});

test('CV raconté partiel : une période mixte ne peut pas inverser les faits de date', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'De mars 2025 à avril 2026, j’étais vendeuse chez Alpha.',
        extraction: {
            experiences: ['Vendeuse — Alpha — avril 2026 – 2025'],
        },
    });
});

test('CV raconté partiel : un employeur explicitement écarté ne peut pas remplacer le vrai', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'De janvier 2020 à janvier 2022, j’étais vendeuse chez Alpha, pas chez Beta.',
        extraction: {
            experiences: ['Vendeuse — Beta — janvier 2020 – janvier 2022'],
        },
    });
});

test('CV raconté partiel : un diplôme explicitement écarté ne devient pas le diplôme obtenu', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'En 2017, j’ai obtenu un bac accueil, pas un master.',
        extraction: {
            education: ['Master accueil — 2017'],
        },
    });
});

test('CV raconté partiel : une année explicitement écartée ne devient pas la date du poste', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'J’étais vendeuse chez Alpha en 2020, pas en 2019.',
        extraction: {
            experiences: ['Vendeuse — Alpha — 2019'],
        },
    });
});

test('CV raconté partiel : un niveau de langue explicitement écarté ne peut pas être affiché', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Je parle italien, pas couramment mais à un niveau intermédiaire.',
        extraction: {
            languages: [{ language: 'Italien', level: 'Courant' }],
        },
    });
});

test('CV raconté partiel : une expérience fidèle sans date explicite reste utilisable', async () => {
    const experience = 'Vendeuse — Alpha • Conseil aux clients';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'J’ai travaillé comme vendeuse chez Alpha. Je conseillais les clients.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : une qualité personnelle voisine ne devient pas une mission professionnelle', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives. Je suis organisée et souriante.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives — mars 2025 • Organisée'],
        },
    });
});

test('CV raconté partiel : un projet personnel voisin ne devient pas une mission professionnelle', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Les Rives. Mon projet bénévole est un site web.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Les Rives — mars 2025 • Projet bénévole de site web'],
        },
    });
});

test('CV raconté partiel : le contrat affirmé après un contrat nié reste accepté', async () => {
    const experience = 'Vendeuse — Alpha — janvier 2020 – janvier 2022 • CDD';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'De janvier 2020 à janvier 2022, j’étais vendeuse chez Alpha, pas en CDI mais en CDD.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : l’employeur affirmé à côté d’un employeur écarté reste accepté', async () => {
    const experience = 'Vendeuse — Alpha — janvier 2020 – janvier 2022';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'De janvier 2020 à janvier 2022, j’étais vendeuse chez Alpha, pas chez Beta.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : le diplôme affirmé à côté d’un diplôme écarté reste accepté', async () => {
    const education = 'Bac accueil — 2017';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'En 2017, j’ai obtenu un bac accueil, pas un master.',
        extraction: { education: [education] },
    });
    assert.deepEqual(extracted.education, [education]);
});

test('CV raconté partiel : l’année affirmée à côté d’une année écartée reste acceptée', async () => {
    const experience = 'Vendeuse — Alpha — 2020';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'J’étais vendeuse chez Alpha en 2020, pas en 2019.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : le niveau de langue affirmé après un niveau écarté reste accepté', async () => {
    const languages = [{ language: 'Italien', level: 'Niveau intermédiaire' }];
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'Je parle italien, pas couramment mais à un niveau intermédiaire.',
        extraction: { languages },
    });
    assert.deepEqual(extracted.languages, languages);
});

test('CV raconté partiel : le nom d’un client ne peut pas remplacer l’employeur du même épisode', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Alpha. Je réponds aux demandes des clients de l’entreprise Beta.',
        extraction: {
            experiences: ['Réceptionniste — Hôtel Beta — mars 2025'],
        },
    });
});

test('CV raconté partiel : une variation singulier-pluriel dans un descriptif d’employeur reste acceptée', async () => {
    const experience = 'Agente d’accueil — Espace Orbel, centre d’affaire, Angers — février 2022 – novembre 2024';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'De février 2022 à novembre 2024, j’étais agente d’accueil chez Espace Orbel, un centre d’affaires à Angers.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : changer le séparateur ne contourne pas le contrôle du nom d’employeur', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Amandiers à Angers.',
        extraction: {
            experiences: ['Réceptionniste à l’hôtel Amandine à Angers depuis mars 2025'],
        },
    });
});

test('CV raconté partiel : changer le séparateur ne contourne pas le contrôle du nom d’établissement', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'En 2017, j’ai obtenu un bac accueil au lycée Amandiers à Tours.',
        extraction: {
            education: ['Bac accueil au lycée Amandine à Tours en 2017'],
        },
    });
});

test('CV raconté partiel : une formulation sans tirets reste acceptée quand l’employeur est exact', async () => {
    const experience = 'Réceptionniste à l’hôtel Amandiers à Angers depuis mars 2025';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Amandiers à Angers.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : une année commune à deux mois peut être répétée pour expliciter la période', async () => {
    const experience = 'Stage d’accueil — Résidence Les Jardins de Verre, Tours — mai 2016 – juin 2016';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'J’ai fait un stage d’accueil à la résidence Les Jardins de Verre à Tours, de mai à juin 2016.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : un adjectif de loisir ne devient pas une langue déclarée', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'J’aime le cinéma italien.',
        extraction: { languages: [{ language: 'Italien', level: '' }] },
    });
});

test('CV raconté partiel : un client cité dans la phrase du poste ne remplace pas l’employeur', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Alpha, où je réponds aux demandes des clients de Beta.',
        extraction: { experiences: ['Réceptionniste — Hôtel Beta — mars 2025'] },
    });
});

test('CV raconté partiel : une option citée dans la formation ne remplace pas l’établissement', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'En 2017, j’ai obtenu un bac accueil au lycée Alpha, option Beta.',
        extraction: { education: ['Bac accueil — Lycée Beta — 2017'] },
    });
});

test('CV raconté partiel : un employeur avec apostrophe reste accepté mot pour mot', async () => {
    const experience = 'Vendeuse — L’Oréal — janvier 2020 – décembre 2021';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'De janvier 2020 à décembre 2021, j’étais vendeuse chez L’Oréal.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : un employeur avec trait d’union reste accepté mot pour mot', async () => {
    const experience = 'Vendeuse — Saint-Gobain — janvier 2020 – décembre 2021';
    const extracted = await assertAcceptedAsGrounded({
        narrative: 'De janvier 2020 à décembre 2021, j’étais vendeuse chez Saint-Gobain.',
        extraction: { experiences: [experience] },
    });
    assert.deepEqual(extracted.experiences, [experience]);
});

test('CV raconté partiel : omettre le type d’organisation ne permet pas de prendre un client pour employeur', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'Depuis mars 2025, je suis réceptionniste à l’hôtel Alpha, où je réponds aux demandes des clients de Beta.',
        extraction: { experiences: ['Réceptionniste — Beta — mars 2025'] },
    });
});

test('CV raconté partiel : omettre le type d’établissement ne permet pas de prendre une option pour école', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'En 2017, j’ai obtenu un bac accueil au lycée Alpha, option Beta.',
        extraction: { education: ['Bac accueil — Beta — 2017'] },
    });
});

test('CV raconté partiel : « pour » rattache le nom à l’employeur plutôt qu’au client', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'De 2020 à 2021, j’ai travaillé comme vendeuse pour Alpha et je servais le client Beta.',
        extraction: { experiences: ['Vendeuse — Beta — 2020 – 2021'] },
    });
});

test('CV raconté partiel : « au sein de » rattache le nom à l’employeur plutôt qu’au client', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'De 2020 à 2021, j’étais vendeuse au sein de Alpha et je servais le client Beta.',
        extraction: { experiences: ['Vendeuse — Beta — 2020 – 2021'] },
    });
});

test('CV raconté partiel : un client ne peut pas être ajouté au nom exact de l’employeur', async () => {
    await assertRejectedAsUngrounded({
        narrative: 'De 2020 à 2021, j’ai travaillé comme vendeuse chez Alpha et je servais le client Beta.',
        extraction: { experiences: ['Vendeuse — Alpha Beta — 2020 – 2021'] },
    });
});
