const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');

// Ce fichier vérifie le cœur de normalisation des opérations. Le wrapper
// `kirby-cv.js` ajoute l'authentification HTTP, couverte séparément.
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
    layout: { removeSections: [], reflow: false, compact: false },
    operations: [],
    bugReport: null,
    letter: { subject: '', body: '' },
};

const callKirbyCv = async ({ cv, instruction, openAiCv }) => {
    const originalFetch = global.fetch;
    const originalKey = process.env.KIRBY_CV_OPENAI_API_KEY;
    let fetchCount = 0;
    const fetchBodies = [];
    process.env.KIRBY_CV_OPENAI_API_KEY = 'sk-test-key';
    global.fetch = async (_url, options = {}) => {
        fetchCount += 1;
        fetchBodies.push(JSON.parse(options.body || '{}'));
        return {
            ok: true,
            json: async () => ({
                choices: [{
                    message: {
                        content: JSON.stringify({ ...emptyCvPayload, ...openAiCv }),
                    },
                }],
            }),
        };
    };

    try {
        const request = new MockRequest({
            mode: 'cv',
            task: 'assistant',
            cv,
            instruction,
        });
        const response = new MockResponse();
        const finished = new Promise((resolve) => response.once('finish', resolve));
        await handler(request, response);
        await finished;
        return { statusCode: response.statusCode, body: JSON.parse(response.body), fetchCount, fetchBodies };
    } finally {
        global.fetch = originalFetch;
        if (originalKey === undefined) {
            delete process.env.KIRBY_CV_OPENAI_API_KEY;
        } else {
            process.env.KIRBY_CV_OPENAI_API_KEY = originalKey;
        }
    }
};

const cvFixtures = [
    {
        name: 'restauration',
        cv: { experience: 'Serveuse - Bistro Central - 2024 • Accueil clients\nCommis de cuisine - Hôtel Gare - 2022 • Préparation' },
        first: 'Serveuse',
        firstResolved: 'Serveuse - Bistro Central - 2024',
        second: 'Commis de cuisine',
        secondResolved: 'Commis de cuisine - Hôtel Gare - 2022',
    },
    {
        name: 'informatique',
        cv: { experience: 'Technicien support - Helpdesk Pro - 2024 • Tickets\nDéveloppeur web - Studio Code - 2023 • Interfaces' },
        first: 'Technicien support',
        firstResolved: 'Technicien support - Helpdesk Pro - 2024',
        second: 'Développeur web',
        secondResolved: 'Développeur web - Studio Code - 2023',
    },
    {
        name: 'transport',
        cv: { experience: 'Chauffeur livreur - Express Nord - 2024 • Tournées\nAgent logistique - Dépôt Sud - 2021 • Préparation' },
        first: 'Chauffeur livreur',
        firstResolved: 'Chauffeur livreur - Express Nord - 2024',
        second: 'Agent logistique',
        secondResolved: 'Agent logistique - Dépôt Sud - 2021',
    },
    {
        name: 'commerce',
        cv: { experience: 'Conseillère commerciale - Boutique Ville - nov. 2022 • Conseil\nVendeuse - Marché Plus - 2021 • Encaissement' },
        first: 'Conseillère commerciale',
        firstResolved: 'Conseillère commerciale - Boutique Ville - nov. 2022',
        second: 'Vendeuse',
        secondResolved: 'Vendeuse - Marché Plus - 2021',
    },
    {
        name: 'santé',
        cv: { experience: 'Aide-soignante - Clinique Lumière - 2024 • Soins\nASH - EHPAD Parc - 2020 • Entretien' },
        first: 'Aide-soignante',
        firstResolved: 'Aide-soignante - Clinique Lumière - 2024',
        second: 'ASH',
        secondResolved: 'ASH - EHPAD Parc - 2020',
    },
    {
        name: 'bâtiment',
        cv: { experience: 'Peintre bâtiment - Reno Pro - 2024 • Finitions\nManoeuvre - Chantier Ouest - 2022 • Préparation' },
        first: 'Peintre bâtiment',
        firstResolved: 'Peintre bâtiment - Reno Pro - 2024',
        second: 'Manoeuvre',
        secondResolved: 'Manoeuvre - Chantier Ouest - 2022',
    },
];

for (const fixture of cvFixtures) {
    test(`CV ${fixture.name}: keeps targeted operations and rejects invented values`, async () => {
        const { statusCode, body } = await callKirbyCv({
            cv: fixture.cv,
            instruction: `Déplace ${fixture.first} après ${fixture.second}, corrige son intitulé et sa date, puis supprime uniquement ${fixture.second}.`,
            openAiCv: {
                experienceOrder: [fixture.second, fixture.first],
                operations: [
                    {
                        type: 'add_experience',
                        field: 'experience',
                        experience: {
                            title: 'Mission courte',
                            period: '2025',
                            organization: 'Contexte test',
                            description: ['Mission ajoutée explicitement'],
                        },
                    },
                    {
                        type: 'reorder_experiences',
                        field: 'experience',
                        target: { title: fixture.first },
                        position: { after: { title: fixture.second } },
                    },
                    {
                        type: 'reorder_experiences',
                        field: 'experience',
                        target: { title: fixture.first },
                        position: { before: { title: fixture.second } },
                    },
                    {
                        type: 'update_experience_title',
                        field: 'experience',
                        target: { title: fixture.first },
                        value: `${fixture.first} confirmé`,
                    },
                    {
                        type: 'update_experience_date',
                        field: 'experience',
                        target: { title: fixture.first },
                        value: '2025',
                    },
                    {
                        type: 'remove_experience',
                        field: 'experience',
                        target: { title: fixture.second },
                    },
                ],
            },
        });

        assert.equal(statusCode, 200);
        assert.equal(body.cv.bugReport, null);
        assert.deepEqual(body.cv.experienceOrder, [fixture.secondResolved, fixture.firstResolved]);
        assert.deepEqual(body.cv.operations.map((operation) => operation.type), [
            'reorder_experiences',
            'reorder_experiences',
            'remove_experience',
        ]);
        assert.equal(body.cv.operations[0].position.after.title, fixture.second);
        assert.equal(body.cv.operations[1].position.before.title, fixture.second);
        assert.equal(body.cv.operations[2].target.title, fixture.second);
    });
}

const exactCanvaCommand = 'Dans la rubrique COMPÉTENCES, ajoute uniquement une nouvelle ligne intitulée “Maîtrise de Canva”. Ne modifie rien d’autre.';

test('CV compétences : accepte l’ajout Canva exact sans toucher au titre ni accepter une valeur inventée', async () => {
    const { statusCode, body } = await callKirbyCv({
        cv: {
            headline: 'Réceptionniste en hôtellerie',
            skills: 'Excel\nOutlook\nLogiciel de réservation hôtelière',
        },
        instruction: exactCanvaCommand,
        openAiCv: {
            headline: 'Maîtrise de Canva',
            skills: ['Maîtrise de Canva'],
            operations: [
                { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
                { type: 'add_skill', field: 'skills', value: 'Maîtrise de Figma' },
                { type: 'set_field', field: 'headline', value: 'Maîtrise de Canva' },
            ],
        },
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.operationSafety.targetedRequest, true);
    assert.equal(body.cv.operationSafety.filteredAll, false);
    assert.equal(body.cv.operationSafety.rejectedCount, 2);
    assert.equal(body.cv.headline, '');
    assert.equal(body.cv.jobTarget, '');
    assert.deepEqual(body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
        { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
    ]);
});

test('CV compétences : récupère strictement l’ancienne sortie set_field/headline pour l’ajout Canva exact', async () => {
    const { statusCode, body } = await callKirbyCv({
        cv: {
            headline: 'Réceptionniste en hôtellerie',
            skills: 'Excel\nOutlook\nLogiciel de réservation hôtelière',
        },
        instruction: exactCanvaCommand,
        openAiCv: {
            headline: 'Maîtrise de Canva',
            jobTarget: 'Maîtrise de Canva',
            operations: [
                { type: 'set_field', field: 'headline', value: 'Maîtrise de Canva' },
            ],
        },
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.operationSafety.targetedRequest, true);
    assert.equal(body.cv.operationSafety.filteredAll, false);
    assert.equal(body.cv.operationSafety.rejectedCount, 1);
    assert.equal(body.cv.headline, '');
    assert.equal(body.cv.jobTarget, '');
    assert.deepEqual(body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
        { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
    ]);
});

test('CV compétences : canonicalise la valeur du modèle avec l’orthographe exacte de la consigne', async () => {
    const { body } = await callKirbyCv({
        cv: { skills: 'Excel\nOutlook' },
        instruction: exactCanvaCommand,
        openAiCv: {
            operations: [
                { type: 'add_skill', field: 'skills', value: 'maitrise de canva' },
            ],
        },
    });

    assert.deepEqual(body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
        { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
    ]);
});

test('CV compétences : conserve le titre explicite dans une commande composée avec ajout Canva', async () => {
    const instruction = 'Remplace le titre par « Réceptionniste », puis ajoute une ligne intitulée « Canva » dans COMPÉTENCES.';
    const { body } = await callKirbyCv({
        cv: {
            headline: 'Agent d’accueil',
            skills: 'Excel\nOutlook',
        },
        instruction,
        openAiCv: {
            headline: 'Canva',
            jobTarget: 'Canva',
            operations: [
                { type: 'set_field', field: 'headline', value: 'Réceptionniste' },
                { type: 'add_skill', field: 'skills', value: 'Canva' },
            ],
        },
    });

    assert.equal(body.cv.headline, 'Réceptionniste');
    assert.equal(body.cv.jobTarget, 'Réceptionniste');
    assert.deepEqual(body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
        { type: 'set_field', field: 'headline', value: 'Réceptionniste' },
        { type: 'add_skill', field: 'skills', value: 'Canva' },
    ]);
});

test('CV compétences : tronque et/and seulement devant une seconde action réelle', async () => {
    const coordinatedInstruction = 'Remplace le titre par Réceptionniste et ajoute une ligne intitulée « Canva » dans COMPÉTENCES.';
    const coordinated = await callKirbyCv({
        cv: { headline: 'Agent d’accueil', skills: 'Excel\nOutlook' },
        instruction: coordinatedInstruction,
        openAiCv: {
            operations: [
                { type: 'set_field', field: 'headline', value: 'Réceptionniste' },
                { type: 'add_skill', field: 'skills', value: 'Canva' },
            ],
        },
    });
    assert.equal(coordinated.body.cv.headline, 'Réceptionniste');
    assert.deepEqual(coordinated.body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
        { type: 'set_field', field: 'headline', value: 'Réceptionniste' },
        { type: 'add_skill', field: 'skills', value: 'Canva' },
    ]);

    const titleContainingEt = await callKirbyCv({
        cv: { headline: 'Agent d’accueil', skills: 'Excel\nOutlook' },
        instruction: 'Remplace le titre par « Responsable accueil et réservation ».',
        openAiCv: {
            operations: [
                { type: 'set_field', field: 'headline', value: 'Responsable accueil et réservation' },
            ],
        },
    });
    assert.equal(titleContainingEt.body.cv.headline, 'Responsable accueil et réservation');
    assert.equal(titleContainingEt.body.cv.operations[0].value, 'Responsable accueil et réservation');

    const englishActionWordInsideQuotedTitle = await callKirbyCv({
        cv: { headline: 'Agent d’accueil', skills: 'Excel\nOutlook' },
        instruction: 'Remplace le titre par « Strategy and Change Manager ».',
        openAiCv: {
            operations: [
                { type: 'set_field', field: 'headline', value: 'Strategy and Change Manager' },
            ],
        },
    });
    assert.equal(englishActionWordInsideQuotedTitle.body.cv.headline, 'Strategy and Change Manager');
    assert.equal(englishActionWordInsideQuotedTitle.body.cv.operations[0].value, 'Strategy and Change Manager');

    const quotedTitleThenSkill = await callKirbyCv({
        cv: { headline: 'Agent d’accueil', skills: 'Excel\nOutlook' },
        instruction: 'Remplace le titre par « Strategy and Change Manager », puis ajoute une ligne intitulée « Canva » dans COMPÉTENCES.',
        openAiCv: {
            operations: [
                { type: 'set_field', field: 'headline', value: 'Strategy and Change Manager' },
                { type: 'add_skill', field: 'skills', value: 'Canva' },
            ],
        },
    });
    assert.equal(quotedTitleThenSkill.body.cv.headline, 'Strategy and Change Manager');
    assert.deepEqual(quotedTitleThenSkill.body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
        { type: 'set_field', field: 'headline', value: 'Strategy and Change Manager' },
        { type: 'add_skill', field: 'skills', value: 'Canva' },
    ]);
});

test('CV compétences : rejette une sous-chaîne générique à la place de la valeur exacte citée', async () => {
    const { body } = await callKirbyCv({
        cv: { skills: 'Excel\nOutlook' },
        instruction: exactCanvaCommand,
        openAiCv: {
            operations: [
                { type: 'add_skill', field: 'skills', value: 'nouvelle ligne' },
            ],
        },
    });

    assert.deepEqual(body.cv.operations, []);
    assert.equal(body.cv.operationSafety.filteredAll, true);
});

test('CV compétences : exige que COMPÉTENCES soit la rubrique ciblée et non un mot de la valeur', async () => {
    const { body } = await callKirbyCv({
        cv: {
            skills: 'Excel\nOutlook',
            education: 'Bac professionnel accueil',
        },
        instruction: 'Dans FORMATION, ajoute uniquement « Bilan de compétences ».',
        openAiCv: {
            operations: [
                { type: 'add_skill', field: 'skills', value: 'Bilan de compétences' },
            ],
        },
    });

    assert.deepEqual(body.cv.operations, []);
    assert.equal(body.cv.operationSafety.filteredAll, true);
});

for (const instruction of [
    'Dans la rubrique COMPÉTENCES, ajoutez uniquement une ligne intitulée “Maîtrise de Canva”.',
    'Dans mes compétences, insérez une ligne intitulée “Maîtrise de Canva”.',
    'Pourriez-vous ajouter “Maîtrise de Canva” dans la rubrique COMPÉTENCES ?',
    'Could you add “Maîtrise de Canva” to the SKILLS section?',
    'COMPÉTENCES : ajoute “Maîtrise de Canva”.',
    'SKILLS: add “Maîtrise de Canva”.',
]) {
    test(`CV compétences : accepte la forme polie ciblée « ${instruction} »`, async () => {
        const { body } = await callKirbyCv({
            cv: { skills: 'Excel\nOutlook' },
            instruction,
            openAiCv: {
                operations: [
                    { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
                ],
            },
        });

        assert.deepEqual(body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
            { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
        ]);
    });
}

for (const instruction of [
    'Je veux une version en français de mon CV.',
    'Put my CV in French.',
    'Translate to French my whole CV.',
]) {
    test(`CV traduction complète vers le français : « ${instruction} »`, async () => {
        const cv = {
            documentLanguage: 'en',
            fullName: 'Jane Doe',
            location: 'Lyon',
            phone: '',
            email: '',
            permit: '',
            headline: 'Administrative Assistant',
            summary: 'Organized professional',
            skills: 'Customer reception',
            experience: '',
            projects: '',
            education: '',
            activities: '',
            languages: '',
        };
        const extracted = {
            fullName: 'Jane Doe',
            location: 'Lyon',
            phone: '',
            email: '',
            permit: '',
            headline: 'Assistante administrative',
            summary: 'Professionnelle organisée',
            skills: ['Accueil des clients'],
            experiences: [],
            projects: [],
            education: [],
            certifications: [],
            activities: [],
            languages: [],
            rawText: '',
        };
        const { body } = await callKirbyCv({
            cv,
            instruction,
            openAiCv: {
                documentLanguage: 'fr',
                headline: extracted.headline,
                summary: extracted.summary,
                skills: extracted.skills,
                extracted,
            },
        });

        assert.deepEqual(body.cv.documentReplacement, {
            type: 'translation',
            sourceLanguage: 'en',
            targetLanguage: 'fr',
            complete: true,
        });
    });
}

for (const instruction of [
    'Dans la rubrique COMPÉTENCES, n’ajoutez pas “Maîtrise de Canva”.',
    'Si je modifiais ce CV, je pourrais ajouter “Maîtrise de Canva” dans la rubrique COMPÉTENCES.',
    'Je pourrais ajouter “Maîtrise de Canva” dans la rubrique COMPÉTENCES.',
    'I could add “Maîtrise de Canva” to the SKILLS section.',
    'Pourquoi ajouter “Maîtrise de Canva” dans la rubrique COMPÉTENCES ?',
    'Faut-il ajouter “Maîtrise de Canva” dans la rubrique COMPÉTENCES ?',
    'Puis-je ajouter “Maîtrise de Canva” dans la rubrique COMPÉTENCES ?',
    'Should I add “Maîtrise de Canva” to the SKILLS section?',
    'May I add “Maîtrise de Canva” to the SKILLS section?',
    'Can I add “Maîtrise de Canva” to the SKILLS section?',
]) {
    test(`CV compétences : refuse l’ajout non affirmatif « ${instruction} »`, async () => {
        const { body } = await callKirbyCv({
            cv: { skills: 'Excel\nOutlook' },
            instruction,
            openAiCv: {
                operations: [
                    { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
                ],
            },
        });

        assert.deepEqual(body.cv.operations, []);
    });
}

for (const instruction of [
    'Ajoute Maîtrise de Canva aux compétences.',
    'Dans mes compétences, insère une ligne : Maîtrise de Canva.',
    'Dans la rubrique COMPÉTENCES, ajoute une nouvelle ligne intitulée Maîtrise de Canva.',
]) {
    test(`CV compétences : extrait exactement la valeur non citée « ${instruction} »`, async () => {
        const { body } = await callKirbyCv({
            cv: { skills: 'Excel\nOutlook' },
            instruction,
            openAiCv: {
                operations: [
                    { type: 'add_skill', field: 'skills', value: 'nouvelle ligne' },
                    { type: 'add_skill', field: 'skills', value: 'Canva' },
                    { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
                ],
            },
        });

        assert.equal(body.cv.operationSafety.rejectedCount, 2);
        assert.deepEqual(body.cv.operations.map(({ type, field, value }) => ({ type, field, value })), [
            { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
        ]);
    });
}

test('CV compétences : une commande de remplacement ne peut pas autoriser add_skill', async () => {
    const { body } = await callKirbyCv({
        cv: { skills: 'Excel\nOutlook' },
        instruction: 'Dans COMPÉTENCES, remplace « Excel » par « Maîtrise de Canva ».',
        openAiCv: {
            operations: [
                { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
                {
                    type: 'replace_text',
                    field: 'skills',
                    target: { currentValue: 'Excel' },
                    value: 'Maîtrise de Canva',
                },
            ],
        },
    });

    assert.deepEqual(body.cv.operations.map((operation) => operation.type), ['replace_text']);
    assert.equal(body.cv.operations[0].target.currentValue, 'Excel');
});

test('CV compétences : une commande de suppression ne peut pas autoriser add_skill', async () => {
    const { body } = await callKirbyCv({
        cv: { skills: 'Excel\nOutlook' },
        instruction: 'Dans COMPÉTENCES, supprime uniquement la ligne « Excel ».',
        openAiCv: {
            operations: [
                { type: 'add_skill', field: 'skills', value: 'Excel' },
                {
                    type: 'remove_text',
                    field: 'skills',
                    target: { currentValue: 'Excel' },
                },
            ],
        },
    });

    assert.deepEqual(body.cv.operations.map((operation) => operation.type), ['remove_text']);
    assert.equal(body.cv.operations[0].target.currentValue, 'Excel');
});

const frenchCvForTranslation = {
    documentLanguage: 'fr',
    fullName: 'Jane Doe',
    location: 'Lyon',
    phone: '06 00 00 00 05',
    email: 'jane.doe@example.com',
    permit: 'Permis B',
    headline: 'Assistante administrative',
    summary: 'Professionnelle organisée avec une expérience en accueil client et en gestion documentaire.',
    skills: 'Accueil des clients\nClassement et archivage numérique\nMaîtrise de Microsoft Word',
    experience: [
        'Assistante administrative - Nova Services - avril 2023 - aujourd’hui • Accueil des clients',
        'Secrétaire polyvalente - Horizon Conseil - 2020 - 2022 • Gestion du courrier',
    ].join('\n'),
    projects: '',
    education: 'Bac professionnel accueil - 2020',
    activities: 'Randonnée\nCinéma italien',
    languages: 'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
};

const completeEnglishTranslation = {
    documentLanguage: 'en',
    headline: 'Administrative Assistant',
    summary: 'Organized professional with experience in customer reception and document management.',
    skills: ['Customer reception', 'Digital filing and archiving', 'Microsoft Word proficiency'],
    experienceOrder: ['Administrative Assistant', 'Versatile Secretary'],
    languages: [
        { language: 'French', level: 'Native' },
        { language: 'English', level: 'B1' },
    ],
    extracted: {
        fullName: 'Jane Doe',
        location: 'Lyon',
        phone: '06 00 00 00 05',
        email: 'jane.doe@example.com',
        permit: 'Driving licence B',
        headline: 'Administrative Assistant',
        summary: 'Organized professional with experience in customer reception and document management.',
        skills: ['Customer reception', 'Digital filing and archiving', 'Microsoft Word proficiency'],
        experiences: [
            'Administrative Assistant - Nova Services - April 2023 - Present • Customer reception',
            'Versatile Secretary - Horizon Conseil - 2020 - 2022 • Mail management',
        ],
        projects: [],
        education: ['Vocational diploma in customer reception - 2020'],
        certifications: [],
        activities: ['Hiking', 'Italian cinema'],
        languages: [
            { language: 'French', level: 'Native' },
            { language: 'English', level: 'B1' },
        ],
        rawText: '',
    },
    jobTarget: 'Administrative Assistant',
    notice: 'The complete CV was translated into English.',
    layout: { removeSections: [], reflow: true, compact: false, preserveAllContent: true },
    operations: [
        { type: 'set_field', field: 'headline', value: 'Administrative Assistant' },
        { type: 'set_field', field: 'skills', value: 'Customer reception' },
        { type: 'set_field', field: 'experience', value: 'Incomplete experience replacement' },
        { type: 'upsert_language', field: 'languages', target: { label: 'French' }, value: 'Native' },
    ],
};

for (const instruction of [
    'Remplace le CV en English.',
    'Remplace tout le CV par une version en anglais.',
    'Refais tout le CV et traduis-le en anglais.',
    'Traduis le CV en anglais.',
    'Convertis mon CV en anglais.',
    'Mets le CV en anglais.',
    'Je veux une version anglaise de mon CV.',
    'Dans mon CV, traduis tout en anglais.',
    'Mets en anglais tout le CV.',
    'Traduis en anglais mon CV.',
    'Je veux une version en anglais de mon CV.',
    'Put my CV in English.',
    'Translate to English my whole CV.',
    'Pouvez-vous traduire tout mon CV en anglais ?',
    'Could you translate my whole CV into English?',
    'Traduis le contenu du CV en anglais.',
    'Traduis l’intégralité du CV en anglais.',
    'Traduis tout le contenu de mon CV en anglais.',
]) {
    test(`CV traduction complète : remplace atomiquement le document pour « ${instruction} »`, async () => {
        const { body } = await callKirbyCv({
            cv: frenchCvForTranslation,
            instruction,
            openAiCv: completeEnglishTranslation,
        });

        assert.equal(body.source, 'openai');
        assert.equal(body.cv.documentLanguage, 'en');
        assert.deepEqual(body.cv.documentReplacement, {
            type: 'translation',
            sourceLanguage: 'fr',
            targetLanguage: 'en',
            complete: true,
        });
        assert.deepEqual(body.cv.operations, []);
        assert.equal(body.cv.operationSafety.targetedRequest, false);
        assert.equal(body.cv.extracted.fullName, frenchCvForTranslation.fullName);
        assert.equal(body.cv.extracted.location, frenchCvForTranslation.location);
        assert.equal(body.cv.extracted.phone, frenchCvForTranslation.phone);
        assert.equal(body.cv.extracted.email, frenchCvForTranslation.email);
        assert.deepEqual(body.cv.extracted.skills, completeEnglishTranslation.extracted.skills);
        assert.deepEqual(body.cv.extracted.experiences, completeEnglishTranslation.extracted.experiences);
        assert.deepEqual(body.cv.experienceOrder, [
            'Administrative Assistant - Nova Services - April 2023 - Present',
            'Versatile Secretary - Horizon Conseil - 2020 - 2022',
        ]);
        assert.deepEqual(body.cv.languages, completeEnglishTranslation.extracted.languages);
        assert.deepEqual(body.cv.extracted.languages, completeEnglishTranslation.extracted.languages);
        assert.doesNotMatch(JSON.stringify(body.cv.extracted), /Assistante administrative|Accueil des clients|Gestion du courrier|Randonnée|Français|Anglais/);
    });
}

for (const instruction of [
    'Comment traduire tout le CV en anglais ?',
    'Puis-je traduire tout le CV en anglais ?',
    'How do I translate my whole CV into English?',
    'Pourquoi traduire tout le CV en anglais ?',
    'Faut-il traduire tout le CV en anglais ?',
    'Dois-je traduire tout le CV en anglais ?',
    'Devrais-je traduire tout le CV en anglais ?',
    'Why translate my whole CV into English?',
    'Should I translate my whole CV into English?',
    'May I translate my whole CV into English?',
    'Can I translate my whole CV into English?',
    'Est-ce que je peux traduire tout le CV en anglais ?',
    'Traduis le profil en anglais puis sauvegarde mon CV.',
]) {
    test(`CV traduction non intégrale : « ${instruction} » ne déclenche pas le remplacement`, async () => {
        const { body } = await callKirbyCv({
            cv: frenchCvForTranslation,
            instruction,
            openAiCv: completeEnglishTranslation,
        });

        assert.equal(body.cv.documentReplacement, undefined);
    });
}

test('CV traduction complète : refuse une extraction anglaise incomplète sans mélanger la source française', async () => {
    const { body } = await callKirbyCv({
        cv: frenchCvForTranslation,
        instruction: 'Remplace le CV en English.',
        openAiCv: {
            ...completeEnglishTranslation,
            skills: ['Customer reception'],
            extracted: {
                ...completeEnglishTranslation.extracted,
                skills: ['Customer reception'],
                experiences: [completeEnglishTranslation.extracted.experiences[0]],
            },
        },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
    assert.equal(body.cv.documentLanguage, 'fr');
    assert.equal(body.cv.documentReplacement, undefined);
    assert.deepEqual(body.cv.operations, []);
    assert.deepEqual(body.cv.extracted.experiences, frenchCvForTranslation.experience.split('\n'));
    assert.deepEqual(body.cv.extracted.skills, frenchCvForTranslation.skills.split('\n'));
});

test('CV traduction complète : refuse une traduction qui altère un employeur factuel', async () => {
    const alteredExperience = completeEnglishTranslation.extracted.experiences[0]
        .replace('Nova Services', 'Nova International');
    const { body } = await callKirbyCv({
        cv: frenchCvForTranslation,
        instruction: 'Remplace le CV en English.',
        openAiCv: {
            ...completeEnglishTranslation,
            extracted: {
                ...completeEnglishTranslation.extracted,
                experiences: [
                    alteredExperience,
                    completeEnglishTranslation.extracted.experiences[1],
                ],
            },
        },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
    assert.deepEqual(body.cv.extracted.experiences, frenchCvForTranslation.experience.split('\n'));
});

test('CV traduction complète : refuse une identité ajoutée alors que la source est vide', async () => {
    const cv = { ...frenchCvForTranslation, fullName: '' };
    const extracted = { ...completeEnglishTranslation.extracted, fullName: 'Invented Person' };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, extracted },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

test('CV traduction complète : refuse un campus ajouté au nom exact de l’établissement', async () => {
    const cv = {
        ...frenchCvForTranslation,
        education: 'Bac professionnel accueil - Lycée des Amandiers - 2020',
    };
    const extracted = {
        ...completeEnglishTranslation.extracted,
        education: ['Vocational diploma in customer reception - Lycée des Amandiers Campus Nord - 2020'],
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, extracted },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

for (const fixture of [
    {
        name: 'catégorie de permis B vers C',
        cv: frenchCvForTranslation,
        extracted: { ...completeEnglishTranslation.extracted, permit: 'Driving licence C' },
    },
    ...['Commercial pilot licence B', 'Forklift licence B', 'Weapon permit B'].map((permit) => ({
        name: `type de permis détourné vers ${permit}`,
        cv: frenchCvForTranslation,
        extracted: { ...completeEnglishTranslation.extracted, permit },
    })),
    {
        name: 'niveau de langue Native vers Fluent',
        cv: frenchCvForTranslation,
        extracted: {
            ...completeEnglishTranslation.extracted,
            languages: [
                { language: 'French', level: 'Fluent' },
                completeEnglishTranslation.extracted.languages[1],
            ],
        },
    },
    {
        name: 'établissement Lycée des Amandiers vers Lycée des Peupliers',
        cv: {
            ...frenchCvForTranslation,
            education: 'Bac professionnel accueil - Lycée des Amandiers - 2020',
        },
        extracted: {
            ...completeEnglishTranslation.extracted,
            education: ['Vocational diploma in customer reception - Lycée des Peupliers - 2020'],
        },
    },
    {
        name: 'contrat CDI vers CDD',
        cv: {
            ...frenchCvForTranslation,
            experience: frenchCvForTranslation.experience.replace(' • Accueil des clients', ' • CDI • Accueil des clients'),
        },
        extracted: {
            ...completeEnglishTranslation.extracted,
            experiences: [
                completeEnglishTranslation.extracted.experiences[0].replace(' • Customer reception', ' • Fixed-term contract • Customer reception'),
                completeEnglishTranslation.extracted.experiences[1],
            ],
        },
    },
    {
        name: 'date avril 2023 vers mai 2023',
        cv: frenchCvForTranslation,
        extracted: {
            ...completeEnglishTranslation.extracted,
            experiences: [
                completeEnglishTranslation.extracted.experiences[0].replace('April 2023', 'May 2023'),
                completeEnglishTranslation.extracted.experiences[1],
            ],
        },
    },
    {
        name: 'période inversée entre avril 2023 et aujourd’hui',
        cv: frenchCvForTranslation,
        extracted: {
            ...completeEnglishTranslation.extracted,
            experiences: [
                completeEnglishTranslation.extracted.experiences[0]
                    .replace('April 2023 - Present', 'Present - April 2023'),
                completeEnglishTranslation.extracted.experiences[1],
            ],
        },
    },
    {
        name: 'contenu long mi-anglais mi-français',
        cv: frenchCvForTranslation,
        extracted: {
            ...completeEnglishTranslation.extracted,
            summary: 'Organized professional with experience in accueil client et gestion documentaire.',
        },
    },
    {
        name: 'quantité 12 vers 15',
        cv: {
            ...frenchCvForTranslation,
            summary: 'Professionnelle organisée avec 12 dossiers suivis par semaine.',
        },
        extracted: {
            ...completeEnglishTranslation.extracted,
            summary: 'Organized professional managing 15 files per week.',
        },
    },
]) {
    test(`CV traduction complète : refuse l’altération factuelle ${fixture.name}`, async () => {
        const { body } = await callKirbyCv({
            cv: fixture.cv,
            instruction: 'Traduis le CV en anglais.',
            openAiCv: {
                ...completeEnglishTranslation,
                extracted: fixture.extracted,
            },
        });

        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'incomplete_cv_translation');
        assert.equal(body.cv.documentReplacement, undefined);
    });
}

test('CV traduction complète : refuse un résultat mixte de moins de 80 caractères', async () => {
    const shortCv = {
        documentLanguage: 'fr',
        headline: 'Accueil client',
        summary: '',
        skills: '',
        experience: '',
        projects: '',
        education: '',
        activities: '',
        languages: '',
    };
    const { body } = await callKirbyCv({
        cv: shortCv,
        instruction: 'Mets le CV en anglais.',
        openAiCv: {
            documentLanguage: 'en',
            headline: 'Customer reception et gestion',
            extracted: {
                fullName: '', location: '', phone: '', email: '', permit: '',
                headline: 'Customer reception et gestion', summary: '', skills: [], experiences: [],
                projects: [], education: [], certifications: [], activities: [], languages: [], rawText: '',
            },
        },
    });

    assert.ok('Customer reception et gestion'.length < 80);
    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
    assert.equal(body.cv.documentReplacement, undefined);
});

test('CV traduction complète : accepte les traductions lexicales de CDI et CDD sans changer leur nature', async () => {
    const cv = {
        ...frenchCvForTranslation,
        experience: frenchCvForTranslation.experience
            .replace(' • Accueil des clients', ' • CDI • Accueil des clients')
            .replace(' • Gestion du courrier', ' • CDD • Gestion du courrier'),
    };
    const extracted = {
        ...completeEnglishTranslation.extracted,
        experiences: [
            completeEnglishTranslation.extracted.experiences[0].replace(' • Customer reception', ' • Permanent contract • Customer reception'),
            completeEnglishTranslation.extracted.experiences[1].replace(' • Mail management', ' • Fixed-term contract • Mail management'),
        ],
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Convertis mon CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, extracted },
    });

    assert.equal(body.source, 'openai');
    assert.deepEqual(body.cv.extracted.experiences, extracted.experiences);
});

test('CV traduction complète : conserve un établissement propre tout en traduisant le diplôme et son option', async () => {
    const cv = {
        ...frenchCvForTranslation,
        education: 'Bac professionnel accueil - option commerce - Lycée des Amandiers - 2020',
    };
    const extracted = {
        ...completeEnglishTranslation.extracted,
        education: ['Vocational diploma in customer reception - business specialization - Amandiers High School - 2020'],
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, extracted },
    });

    assert.equal(body.source, 'openai');
    assert.deepEqual(body.cv.extracted.education, extracted.education);
});

test('CV traduction complète : accepte une traduction naturelle fidèle du parcours d’Élise', async () => {
    const cv = {
        documentLanguage: 'fr',
        fullName: 'Élise Montbrun',
        location: 'Angers',
        phone: '06 00 00 00 05',
        email: 'elise.montbrun@example.com',
        permit: 'Permis B',
        headline: 'Réceptionniste en hôtellerie',
        summary: 'Je suis organisée, souriante et à l’aise avec les clients.',
        skills: 'Gestion des réclamations\nOrganisation des priorités',
        experience: 'Réceptionniste - Hôtel Les Rives Dorées - mars 2025 - aujourd’hui • Accueil des clients et gestion des réservations',
        projects: '',
        education: 'Bac professionnel accueil - Lycée des Amandiers - 2017',
        activities: 'Randonnée\nCinéma italien',
        languages: 'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
    };
    const extracted = {
        fullName: 'Élise Montbrun',
        location: 'Angers',
        phone: '06 00 00 00 05',
        email: 'elise.montbrun@example.com',
        permit: 'Driving licence B',
        headline: 'Hotel Receptionist',
        summary: 'I am organized, friendly and comfortable assisting guests.',
        skills: ['Complaint handling', 'Priority management'],
        experiences: ['Hotel Receptionist - Hôtel Les Rives Dorées - March 2025 - Present • Guest reception and reservation management'],
        projects: [],
        education: ['Vocational diploma in customer reception - Amandiers High School - 2017'],
        certifications: [],
        activities: ['Hiking', 'Italian cinema'],
        languages: [
            { language: 'French', level: 'Native' },
            { language: 'English', level: 'B1' },
        ],
        rawText: '',
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            headline: extracted.headline,
            summary: extracted.summary,
            skills: extracted.skills,
            experienceOrder: ['Hotel Receptionist'],
            languages: extracted.languages,
            extracted,
        },
    });

    assert.equal(body.source, 'openai');
    assert.equal(body.cv.documentLanguage, 'en');
    assert.deepEqual(body.cv.extracted, extracted);
});

test('CV traduction complète : accepte la traduction exacte du parcours Élise utilisée dans l’interface', async () => {
    const cv = {
        documentLanguage: 'fr',
        fullName: 'Élise Montbrun',
        location: 'Angers',
        phone: '06 00 00 00 05',
        email: 'elise.montbrun@example.com',
        permit: 'Permis B',
        headline: 'Réceptionniste en hôtellerie',
        summary: 'Je suis organisée, souriante et à l’aise avec les clients.',
        skills: [
            'Gestion des réservations',
            'Facturation',
            'Transmission des consignes à l’équipe de nuit',
        ].join('\n'),
        experience: [
            'Réceptionniste — Hôtel Les Rives Dorées, Angers — mars 2025 – aujourd’hui • CDI • Arrivées, départs, réservations et facturation',
            'Agente d’accueil — Espace Orbel, Angers — février 2022 – novembre 2024 • CDD • Accueil des visiteurs et gestion du standard',
        ].join('\n'),
        projects: '',
        education: [
            'Bac professionnel accueil — Lycée des Amandiers, Tours — 2017',
            'Formation de premiers secours — Secours des Rives — avril 2024',
        ].join('\n'),
        activities: 'Randonnée\nCinéma italien',
        languages: 'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
    };
    const extracted = {
        fullName: 'Élise Montbrun',
        location: 'Angers',
        phone: '06 00 00 00 05',
        email: 'elise.montbrun@example.com',
        permit: 'Driving licence B',
        headline: 'Hotel receptionist',
        summary: 'I am organized, friendly and comfortable assisting guests.',
        skills: [
            'Reservation management',
            'Billing',
            'Handover of instructions to the night team',
        ],
        experiences: [
            'Hotel receptionist — Hôtel Les Rives Dorées, Angers — March 2025 – present • Permanent contract • Check-ins, check-outs, reservations and billing',
            'Front desk agent — Espace Orbel, Angers — February 2022 – November 2024 • Fixed-term contract • Visitor reception and switchboard management',
        ],
        projects: [],
        education: [
            'Vocational baccalaureate in reception services — Lycée des Amandiers, Tours — 2017',
            'First-aid training — Secours des Rives — April 2024',
        ],
        certifications: [],
        activities: ['Hiking', 'Italian cinema'],
        languages: [
            { language: 'French', level: 'Native' },
            { language: 'English', level: 'Intermediate B1' },
        ],
        rawText: '',
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Remplace le CV en anglais. Ne conserve aucun texte français.',
        openAiCv: {
            ...completeEnglishTranslation,
            headline: extracted.headline,
            summary: extracted.summary,
            skills: extracted.skills,
            experienceOrder: ['Hotel receptionist', 'Front desk agent'],
            languages: extracted.languages,
            extracted,
        },
    });

    assert.equal(body.source, 'openai');
    assert.equal(body.cv.documentLanguage, 'en');
    assert.deepEqual(body.cv.extracted, extracted);
});

test('CV traduction complète : accepte toutes les expériences et formulations naturelles du parcours Élise', async () => {
    const cv = {
        documentLanguage: 'fr',
        fullName: 'Élise Montbrun',
        location: 'Angers',
        phone: '06 00 00 00 05',
        email: 'elise.montbrun@example.com',
        permit: 'Permis B',
        headline: 'Réceptionniste en hôtellerie',
        summary: 'Je suis organisée, souriante et à l’aise avec les clients.',
        skills: [
            'Excel',
            'Outlook',
            'Logiciel de réservation hôtelière',
            'Gestion des réclamations avec calme',
            'Organisation des priorités',
            'Travail en équipe',
        ].join('\n'),
        experience: [
            'Réceptionniste — Hôtel Les Rives Dorées, Angers — mars 2025 – aujourd’hui • CDI • Arrivées, départs, réservations et facturation • Réponse aux demandes des clients par téléphone et par mail • Transmission des consignes à l’équipe de nuit',
            'Agente d’accueil — Espace Orbel, Angers — février 2022 – novembre 2024 • CDD • Accueil des visiteurs • Gestion du standard • Réservation des salles • Réception du courrier',
            'Employée de restauration — Le Comptoir des Tilleuls, Saumur — janvier 2020 – janvier 2022 • Préparation de la salle • Prise des commandes • Service',
            'Vendeuse — La Page Vagabonde, Tours — septembre 2017 – décembre 2019 • CDI • Conseil aux clients • Encaissement • Réception des livres • Préparation des commandes',
            'Stagiaire en accueil — Les Jardins de Verre, Tours — mai 2016 – juin 2016 • Orientation des visiteurs • Aide au secrétariat',
        ].join('\n'),
        projects: '',
        education: [
            'Bac professionnel accueil — Lycée des Amandiers, Tours — 2017',
            'Formation de premiers secours — Secours des Rives — avril 2024',
        ].join('\n'),
        activities: 'Randonnée\nCinéma italien',
        languages: 'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
    };
    const extracted = {
        fullName: 'Élise Montbrun',
        location: 'Angers',
        phone: '06 00 00 00 05',
        email: 'elise.montbrun@example.com',
        permit: 'Driving licence B',
        headline: 'Hospitality front desk clerk',
        summary: 'Organized, friendly and customer-focused.',
        skills: [
            'Excel',
            'Outlook',
            'Hotel reservation software',
            'Handling complaints calmly',
            'Prioritizing tasks',
            'Teamwork',
        ],
        experiences: [
            'Hotel receptionist — Hôtel Les Rives Dorées, Angers — March 2025 – present • Permanent contract • Handling check-ins, check-outs, bookings and invoices • Responding to customer requests by phone and email • Night shift handover',
            'Front desk officer — Espace Orbel, Angers — February 2022 – November 2024 • Fixed-term contract • Welcoming visitors • Switchboard management • Booking meeting rooms • Receiving mail',
            'Food service employee — Le Comptoir des Tilleuls, Saumur — January 2020 – January 2022 • Setting up the dining room • Taking orders • Table service',
            'Sales assistant — La Page Vagabonde, Tours — September 2017 – December 2019 • Permanent contract • Advising customers • Cash handling • Receiving books • Preparing orders',
            'Reception intern — Les Jardins de Verre, Tours — May 2016 – June 2016 • Welcoming and directing visitors • Assisting with secretarial duties',
        ],
        projects: [],
        education: [
            'Vocational baccalaureate in reception services — Lycée des Amandiers, Tours — 2017',
            'First aid course — Secours des Rives — April 2024',
        ],
        certifications: [],
        activities: ['Trekking', 'Italian films'],
        languages: [
            { language: 'French', level: 'Native' },
            { language: 'English', level: 'Intermediate B1' },
        ],
        rawText: '',
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Remplace le CV en anglais. Ne conserve aucun texte français.',
        openAiCv: {
            ...completeEnglishTranslation,
            headline: extracted.headline,
            summary: extracted.summary,
            skills: extracted.skills,
            languages: extracted.languages,
            extracted,
        },
    });

    assert.equal(body.source, 'openai');
    assert.equal(body.cv.documentLanguage, 'en');
    assert.deepEqual(body.cv.extracted, extracted);
});

test('CV traduction complète : refuse de transformer une formation de premiers secours en diplôme médical', async () => {
    const cv = {
        ...frenchCvForTranslation,
        education: 'Formation de premiers secours - Secours des Rives - avril 2024',
    };
    const extracted = {
        ...completeEnglishTranslation.extracted,
        education: ['Medical degree - Secours des Rives - April 2024'],
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, extracted },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

test('CV traduction complète : refuse un niveau expert ajouté à Microsoft Excel', async () => {
    const extracted = {
        ...completeEnglishTranslation.extracted,
        skills: completeEnglishTranslation.extracted.skills.map((skill) =>
            skill === 'Microsoft Word proficiency' ? 'Microsoft Excel expert' : skill
        ),
    };
    const cv = {
        ...frenchCvForTranslation,
        skills: frenchCvForTranslation.skills.replace('Maîtrise de Microsoft Word', 'Maîtrise de Microsoft Excel'),
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, skills: extracted.skills, extracted },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

test('CV traduction complète : refuse l’inversion client-agent malgré les mêmes concepts', async () => {
    const cv = {
        ...frenchCvForTranslation,
        summary: 'Gestion des plaintes des clients',
    };
    const faithful = {
        ...completeEnglishTranslation.extracted,
        summary: 'Managing customer complaints',
    };
    const valid = await callKirbyCv({
        cv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, summary: faithful.summary, extracted: faithful },
    });
    assert.equal(valid.body.source, 'openai');

    const inverted = {
        ...completeEnglishTranslation.extracted,
        summary: 'Customers manage complaints',
    };
    const invalid = await callKirbyCv({
        cv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, summary: inverted.summary, extracted: inverted },
    });
    assert.equal(invalid.body.source, 'deterministic-fallback');
    assert.equal(invalid.body.warning, 'incomplete_cv_translation');
});

for (const fixture of [
    {
        source: 'Gestion des réservations des clients',
        faithful: 'Customer reservation management',
        inverted: 'Customers manage reservations',
    },
    {
        source: 'Gestion de la paie des employés',
        faithful: 'Employee payroll management',
        inverted: 'Employees manage payroll',
    },
    {
        source: 'Gestion de 2 équipes et 10 clients',
        faithful: 'Management of 2 teams and 10 clients',
        inverted: '10 customers managed 2 teams',
    },
    {
        source: 'Je réponds aux demandes des clients par téléphone et par mail',
        faithful: 'Responding to customer requests by phone and email',
        inverted: 'Customers respond to requests by phone and email',
    },
    {
        source: 'Gestion des factures clients',
        faithful: 'Customer invoice management',
        inverted: 'Customers handle invoices',
    },
    {
        source: 'Gestion des demandes des clients',
        faithful: 'Customer request management',
        inverted: 'Customers manage requests',
    },
    {
        source: 'Gestion du courrier des fournisseurs',
        faithful: 'Supplier mail management',
        inverted: 'Suppliers manage mail',
    },
]) {
    test(`CV traduction complète : conserve la relation « ${fixture.source} » sans inverser l’acteur`, async () => {
        const cv = { ...frenchCvForTranslation, summary: fixture.source };
        const faithfulExtraction = { ...completeEnglishTranslation.extracted, summary: fixture.faithful };
        const faithful = await callKirbyCv({
            cv,
            instruction: 'Traduis tout le CV en anglais.',
            openAiCv: {
                ...completeEnglishTranslation,
                summary: fixture.faithful,
                extracted: faithfulExtraction,
            },
        });
        assert.equal(faithful.body.source, 'openai');

        const invertedExtraction = { ...completeEnglishTranslation.extracted, summary: fixture.inverted };
        const inverted = await callKirbyCv({
            cv,
            instruction: 'Traduis tout le CV en anglais.',
            openAiCv: {
                ...completeEnglishTranslation,
                summary: fixture.inverted,
                extracted: invertedExtraction,
            },
        });
        assert.equal(inverted.body.source, 'deterministic-fallback');
        assert.equal(inverted.body.warning, 'incomplete_cv_translation');
    });
}

test('CV traduction complète : refuse aussi une inversion client-agent formulée au passif', async () => {
    const cv = { ...frenchCvForTranslation, summary: 'Gestion des réservations des clients' };
    const extracted = { ...completeEnglishTranslation.extracted, summary: 'Reservations are managed by customers' };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            summary: extracted.summary,
            extracted,
        },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

test('CV traduction complète : accepte « Prise des commandes » → « Taking orders »', async () => {
    const sourceSkills = ['Prise des commandes', ...frenchCvForTranslation.skills.split('\n').slice(1)];
    const translatedSkills = ['Taking orders', ...completeEnglishTranslation.extracted.skills.slice(1)];
    const extracted = { ...completeEnglishTranslation.extracted, skills: translatedSkills };
    const { body } = await callKirbyCv({
        cv: { ...frenchCvForTranslation, skills: sourceSkills.join('\n') },
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, skills: translatedSkills, extracted },
    });

    assert.equal(body.source, 'openai');
});

for (const unchangedFrenchLine of [
    'Photographie événementielle',
    'Facturation',
    'Réservation',
    'Premiers secours',
    'Conseil client',
    'Travail en équipe',
]) {
    test(`CV traduction complète : refuse la ligne française inchangée « ${unchangedFrenchLine} »`, async () => {
        const sourceSkills = [unchangedFrenchLine, ...frenchCvForTranslation.skills.split('\n').slice(1)];
        const translatedSkills = [unchangedFrenchLine, ...completeEnglishTranslation.extracted.skills.slice(1)];
        const extracted = { ...completeEnglishTranslation.extracted, skills: translatedSkills };
        const { body } = await callKirbyCv({
            cv: { ...frenchCvForTranslation, skills: sourceSkills.join('\n') },
            instruction: 'Traduis tout le CV en anglais.',
            openAiCv: { ...completeEnglishTranslation, skills: translatedSkills, extracted },
        });

        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'incomplete_cv_translation');
    });
}

for (const neutralLine of [
    'Microsoft Excel',
    'Canva',
    'CRM',
    'ERP',
    'Marketing digital',
    'Web design',
    'Tennis',
    'Yoga',
]) {
    test(`CV traduction complète : autorise le terme international inchangé « ${neutralLine} »`, async () => {
        const sourceSkills = [neutralLine, ...frenchCvForTranslation.skills.split('\n').slice(1)];
        const translatedSkills = [neutralLine, ...completeEnglishTranslation.extracted.skills.slice(1)];
        const extracted = { ...completeEnglishTranslation.extracted, skills: translatedSkills };
        const { body } = await callKirbyCv({
            cv: { ...frenchCvForTranslation, skills: sourceSkills.join('\n') },
            instruction: 'Traduis tout le CV en anglais.',
            openAiCv: { ...completeEnglishTranslation, skills: translatedSkills, extracted },
        });

        assert.equal(body.source, 'openai');
    });
}

test('CV traduction complète : une fausse preuve ne peut pas annuler une contradiction métier déterministe', async () => {
    const extracted = {
        ...completeEnglishTranslation.extracted,
        skills: ['Payroll management', ...completeEnglishTranslation.extracted.skills.slice(1)],
    };
    const { body, fetchCount } = await callKirbyCv({
        cv: frenchCvForTranslation,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            skills: extracted.skills,
            extracted,
            translationProof: {
                targetLanguage: 'en',
                pairs: [{
                    id: 'skills.0',
                    source: 'Accueil des clients',
                    target: 'Payroll management',
                    verdict: 'equivalent',
                    sourceEntailedByTarget: true,
                    targetEntailedBySource: true,
                    targetLanguageCorrect: true,
                    addedClaims: [],
                    missingClaims: [],
                }],
            },
        },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
    assert.equal(fetchCount, 1);
});

test('CV traduction complète : refuse Fluent B1 à la place de niveau intermédiaire B1', async () => {
    const extracted = {
        ...completeEnglishTranslation.extracted,
        languages: [
            completeEnglishTranslation.extracted.languages[0],
            { language: 'English', level: 'Fluent B1' },
        ],
    };
    const { body } = await callKirbyCv({
        cv: frenchCvForTranslation,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, languages: extracted.languages, extracted },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

test('CV traduction complète : lie chaque quantité au fait qu’elle mesure', async () => {
    const cv = {
        ...frenchCvForTranslation,
        summary: 'Gestion de 2 équipes et 10 clients.',
    };
    const extracted = {
        ...completeEnglishTranslation.extracted,
        summary: 'Management of 10 teams and 2 customers.',
    };
    const { body } = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, summary: extracted.summary, extracted },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

test('CV traduction complète : accepte un métier courant hors du premier jeu puis refuse un domaine sensible substitué', async () => {
    const cv = {
        documentLanguage: 'fr',
        fullName: 'Camille Test',
        location: 'Tours',
        phone: '',
        email: '',
        permit: '',
        headline: 'Peintre en bâtiment',
        summary: 'Professionnelle organisée avec une expérience en peinture intérieure.',
        skills: 'Peinture intérieure',
        experience: 'Peintre en bâtiment - Atelier Couleur - 2020 - aujourd’hui • Peinture intérieure',
        projects: '',
        education: '',
        activities: '',
        languages: '',
    };
    const extracted = {
        fullName: 'Camille Test',
        location: 'Tours',
        phone: '',
        email: '',
        permit: '',
        headline: 'Building painter',
        summary: 'Organized professional with experience in interior painting.',
        skills: ['Interior painting'],
        experiences: ['Building painter - Atelier Couleur - 2020 - Present • Interior painting'],
        projects: [],
        education: [],
        certifications: [],
        activities: [],
        languages: [],
        rawText: '',
    };
    const faithful = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            headline: extracted.headline,
            summary: extracted.summary,
            skills: extracted.skills,
            experienceOrder: ['Building painter'],
            languages: [],
            extracted,
        },
    });
    assert.equal(faithful.body.source, 'openai');

    const substituted = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            headline: extracted.headline,
            summary: extracted.summary,
            skills: ['Payroll management'],
            experienceOrder: ['Building painter'],
            languages: [],
            extracted: { ...extracted, skills: ['Payroll management'] },
        },
    });
    assert.equal(substituted.body.source, 'deterministic-fallback');
    assert.equal(substituted.body.warning, 'incomplete_cv_translation');
});

const unknownVocabularyCv = {
    documentLanguage: 'fr',
    fullName: 'Camille Test',
    location: 'Tours',
    phone: '',
    email: '',
    permit: '',
    headline: 'Photographe',
    summary: 'Photographe portraitiste',
    skills: 'Photographie événementielle',
    experience: '',
    projects: '',
    education: '',
    activities: '',
    languages: '',
};

const unknownVocabularyEnglishExtraction = {
    fullName: 'Camille Test',
    location: 'Tours',
    phone: '',
    email: '',
    permit: '',
    headline: 'Photographer',
    summary: 'Portrait photographer',
    skills: ['Event photography'],
    experiences: [],
    projects: [],
    education: [],
    certifications: [],
    activities: [],
    languages: [],
    rawText: '',
};

test('CV traduction complète : accepte déterministement photographe, portrait et photographie événementielle', async () => {
    const { body, fetchCount, fetchBodies } = await callKirbyCv({
        cv: unknownVocabularyCv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: {
            documentLanguage: 'en',
            headline: unknownVocabularyEnglishExtraction.headline,
            summary: unknownVocabularyEnglishExtraction.summary,
            skills: unknownVocabularyEnglishExtraction.skills,
            experienceOrder: [],
            languages: [],
            extracted: unknownVocabularyEnglishExtraction,
        },
    });

    assert.equal(body.source, 'openai');
    assert.equal(body.cv.documentLanguage, 'en');
    assert.equal(fetchCount, 1);
    assert.doesNotMatch(fetchBodies[0].messages[1].content, /translationProof|PREUVE DE FIDELITE/);
});

test('CV traduction complète : refuse Photographe → Ceramic potter malgré une fausse preuve équivalente', async () => {
    const extracted = {
        ...unknownVocabularyEnglishExtraction,
        headline: 'Ceramic potter',
    };
    const { body, fetchCount } = await callKirbyCv({
        cv: unknownVocabularyCv,
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: {
            documentLanguage: 'en',
            headline: extracted.headline,
            summary: extracted.summary,
            skills: extracted.skills,
            extracted,
            translationProof: {
                targetLanguage: 'en',
                pairs: [{
                    id: 'headline',
                    source: 'Photographe',
                    target: 'Ceramic potter',
                    verdict: 'equivalent',
                    sourceEntailedByTarget: true,
                    targetEntailedBySource: true,
                    targetLanguageCorrect: true,
                    addedClaims: [],
                    missingClaims: [],
                }],
            },
        },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
    assert.equal(fetchCount, 1);
});

test('CV traduction complète : une ligne française hors lexique inchangée reste refusée', async () => {
    const extracted = {
        ...unknownVocabularyEnglishExtraction,
        skills: ['Cyanotypie artisanale'],
    };
    const { body } = await callKirbyCv({
        cv: { ...unknownVocabularyCv, skills: 'Cyanotypie artisanale' },
        instruction: 'Traduis tout le CV en anglais.',
        openAiCv: {
            documentLanguage: 'en',
            headline: extracted.headline,
            summary: extracted.summary,
            skills: extracted.skills,
            extracted,
        },
    });

    assert.equal(body.source, 'deterministic-fallback');
    assert.equal(body.warning, 'incomplete_cv_translation');
});

for (const fixture of [
    ['Conseillère clientèle', 'Customer advisor'],
    ['Chargée de recrutement', 'Recruitment officer'],
    ['Hôtesse d’accueil', 'Receptionist'],
    ['Aide-soignante', 'Healthcare assistant'],
    ['Électricien', 'Electrician'],
    ['Chef de projet', 'Project manager'],
    ['Boulanger', 'Baker'],
    ['Plombier', 'Plumber'],
    ['Infirmière', 'Nurse'],
    ['Développeuse web', 'Web developer'],
]) {
    test(`CV traduction complète : reconnaît déterministement ${fixture[0]} → ${fixture[1]}`, async () => {
        const cv = {
            ...unknownVocabularyCv,
            headline: fixture[0],
            summary: 'Professionnelle organisée',
            skills: '',
        };
        const extracted = {
            ...unknownVocabularyEnglishExtraction,
            headline: fixture[1],
            summary: 'Organized professional',
            skills: [],
        };
        const { body, fetchCount } = await callKirbyCv({
            cv,
            instruction: 'Traduis tout le CV en anglais.',
            openAiCv: {
                documentLanguage: 'en',
                headline: extracted.headline,
                summary: extracted.summary,
                skills: [],
                extracted,
            },
        });

        assert.equal(body.source, 'openai');
        assert.equal(fetchCount, 1);
    });
}

for (const fixture of [
    {
        name: 'compétence et mission remplacées par la paie et le recrutement',
        patch: (extracted) => ({
            ...extracted,
            skills: ['Payroll management', ...extracted.skills.slice(1)],
            experiences: [
                extracted.experiences[0].replace('Customer reception', 'Managed payroll and recruited employees'),
                ...extracted.experiences.slice(1),
            ],
        }),
    },
    {
        name: 'métier et mission remplacés par ingénierie logicielle',
        patch: (extracted) => ({
            ...extracted,
            headline: 'Software Engineer',
            experiences: [
                extracted.experiences[0]
                    .replace('Administrative Assistant', 'Software Engineer')
                    .replace('Customer reception', 'Built distributed systems in the cloud'),
                ...extracted.experiences.slice(1),
            ],
        }),
    },
    {
        name: 'profil enrichi avec une expertise paie et recrutement inventée',
        patch: (extracted) => ({
            ...extracted,
            summary: 'Organized payroll expert with recruitment experience.',
        }),
    },
    {
        name: 'diplôme Bac professionnel remplacé par un MBA',
        patch: (extracted) => ({
            ...extracted,
            education: ['MBA in customer reception - 2020'],
        }),
    },
    {
        name: 'activité randonnée remplacée par parachutisme',
        patch: (extracted) => ({
            ...extracted,
            activities: ['Skydiving', ...extracted.activities.slice(1)],
        }),
    },
]) {
    test(`CV traduction complète : refuse une substitution sémantique — ${fixture.name}`, async () => {
        const extracted = fixture.patch(completeEnglishTranslation.extracted);
        const { body } = await callKirbyCv({
            cv: frenchCvForTranslation,
            instruction: 'Traduis le CV en anglais.',
            openAiCv: {
                ...completeEnglishTranslation,
                headline: extracted.headline,
                summary: extracted.summary,
                skills: extracted.skills,
                extracted,
            },
        });

        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'incomplete_cv_translation');
        assert.equal(body.cv.documentReplacement, undefined);
    });
}

test('CV traduction complète : compare aussi le sens de chaque projet', async () => {
    const cv = {
        ...frenchCvForTranslation,
        projects: 'Projet personnel de classement numérique',
    };
    const faithful = {
        ...completeEnglishTranslation.extracted,
        projects: ['Personal digital filing project'],
    };
    const valid = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: { ...completeEnglishTranslation, extracted: faithful },
    });
    assert.equal(valid.body.source, 'openai');

    const invented = await callKirbyCv({
        cv,
        instruction: 'Traduis le CV en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            extracted: { ...faithful, projects: ['Personal payroll automation project'] },
        },
    });
    assert.equal(invented.body.source, 'deterministic-fallback');
    assert.equal(invented.body.warning, 'incomplete_cv_translation');
});

for (const translatedTitle of ['Sales management', 'Software engineering sales']) {
    test(`CV traduction complète : refuse le titre Vendeur remplacé par « ${translatedTitle} »`, async () => {
        const cv = {
            ...frenchCvForTranslation,
            headline: 'Ingénieur logiciel',
            experience: 'Vendeur - Boutique - 2020 - 2022 • Accueil des clients',
        };
        const extracted = {
            ...completeEnglishTranslation.extracted,
            headline: 'Software Engineer',
            experiences: [`${translatedTitle} - Boutique - 2020 - 2022 • Customer reception`],
        };
        const { body } = await callKirbyCv({
            cv,
            instruction: 'Traduis le CV en anglais.',
            openAiCv: {
                ...completeEnglishTranslation,
                headline: extracted.headline,
                experienceOrder: [translatedTitle],
                extracted,
            },
        });

        assert.equal(body.source, 'deterministic-fallback');
        assert.equal(body.warning, 'incomplete_cv_translation');
    });
}

test('CV traduction ciblée : traduire uniquement le profil ne déclenche pas un remplacement intégral', async () => {
    const { body } = await callKirbyCv({
        cv: frenchCvForTranslation,
        instruction: 'Dans mon CV, traduis uniquement le profil en anglais.',
        openAiCv: {
            ...completeEnglishTranslation,
            operations: [{
                type: 'set_field',
                field: 'summary',
                value: completeEnglishTranslation.summary,
            }],
        },
    });

    assert.equal(body.source, 'openai');
    assert.equal(body.cv.documentReplacement, undefined);
});

for (const instruction of [
    'Traduis uniquement le profil de mon CV en anglais.',
    'Mets uniquement la rubrique PROFIL de mon CV en anglais.',
    'Convertis seulement le profil du CV en anglais.',
    'Traduis dans mon CV uniquement le profil en anglais.',
    'Traduis le profil de mon CV en anglais.',
    'Traduis les compétences de mon CV en anglais.',
    'Traduis les dates de mon CV en anglais.',
]) {
    test(`CV traduction ciblée : « ${instruction} » reste une modification du profil`, async () => {
        const { body } = await callKirbyCv({
            cv: frenchCvForTranslation,
            instruction,
            openAiCv: {
                ...completeEnglishTranslation,
                operations: [{ type: 'set_field', field: 'summary', value: completeEnglishTranslation.summary }],
            },
        });

        assert.equal(body.source, 'openai');
        assert.equal(body.cv.documentReplacement, undefined);
    });
}

test('CV langues : canonicalise une cible de suppression dupliquée avec la casse exacte du CV', async () => {
    const { body } = await callKirbyCv({
        cv: { languages: 'Français : Langue maternelle\neSpAgNoL : nOtIoNs\nAnglais : B1' },
        instruction: 'Supprime Espagnol : notions dans la rubrique LANGUES.',
        openAiCv: {
            operations: [{
                type: 'remove_text',
                field: 'languages',
                target: {
                    label: 'Espagnol',
                    currentValue: 'Espagnol Espagnol : Notions',
                },
            }],
        },
    });

    assert.equal(body.cv.operations.length, 1);
    assert.equal(body.cv.operations[0].type, 'remove_text');
    assert.equal(body.cv.operations[0].target.label, '');
    assert.equal(body.cv.operations[0].target.currentValue, 'eSpAgNoL : nOtIoNs');
});

test('CV langues : canonicalise aussi une cible de remplacement sans préfixer son libellé', async () => {
    const { body } = await callKirbyCv({
        cv: { languages: 'Français : Langue maternelle\nESPAGNOL : NOTIONS\nAnglais : B1' },
        instruction: 'Dans LANGUES, remplace Espagnol : notions par Espagnol : intermédiaire.',
        openAiCv: {
            operations: [{
                type: 'replace_text',
                field: 'languages',
                target: {
                    label: 'Espagnol',
                    currentValue: 'Espagnol Espagnol : notions',
                },
                value: 'Espagnol : intermédiaire',
            }],
        },
    });

    assert.equal(body.cv.operations.length, 1);
    assert.equal(body.cv.operations[0].type, 'replace_text');
    assert.equal(body.cv.operations[0].target.label, '');
    assert.equal(body.cv.operations[0].target.currentValue, 'ESPAGNOL : NOTIONS');
    assert.equal(body.cv.operations[0].value, 'Espagnol : intermédiaire');
});
