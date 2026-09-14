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
    process.env.KIRBY_CV_OPENAI_API_KEY = 'sk-test-key';
    global.fetch = async () => ({
        ok: true,
        json: async () => ({
            choices: [{
                message: {
                    content: JSON.stringify({ ...emptyCvPayload, ...openAiCv }),
                },
            }],
        }),
    });

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
