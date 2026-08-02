const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');

const handler = require('../../api/kirby-cv.js');

class MockRequest extends EventEmitter {
    constructor(body) {
        super();
        this.method = 'POST';
        this.headers = {};
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

const callKirbyCv = async ({ cv, instruction, openAiCv, task = 'assistant' }) => {
    const originalFetch = global.fetch;
    const originalKey = process.env.KIRBY_OPENAI_API_KEY;
    process.env.KIRBY_OPENAI_API_KEY = 'sk-test-key';
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
            task,
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
            delete process.env.KIRBY_OPENAI_API_KEY;
        } else {
            process.env.KIRBY_OPENAI_API_KEY = originalKey;
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
    test(`CV ${fixture.name}: keeps structured local operations generic`, async () => {
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
        assert.equal(body.cv.operations.length, 6);
        assert.equal(body.cv.operations[1].position.after.title, fixture.second);
        assert.equal(body.cv.operations[2].position.before.title, fixture.second);
        assert.equal(body.cv.operations[3].type, 'update_experience_title');
        assert.equal(body.cv.operations[3].value, `${fixture.first} confirmé`);
    });
}

test('CV adapt: respects requested insertion professionnelle headline', async () => {
    const expectedHeadline = 'Conseillère commerciale – Candidate au poste de conseillère en insertion professionnelle';
    const { statusCode, body } = await callKirbyCv({
        task: 'adapt',
        cv: {
            headline: 'Conseiller clientèle',
            summary: 'Profil commercial orienté client.',
            experience: 'Conseillère commerciale - American Express / Air France - 2019 - 2021 • Conseil client',
        },
        instruction: `Change le titre en ${expectedHeadline}.`,
        openAiCv: {
            headline: 'Conseiller clientèle',
            jobTarget: 'Conseiller clientèle',
        },
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.headline, expectedHeadline);
    assert.equal(body.cv.jobTarget, expectedHeadline);
});

test('CV adapt: keeps Conseillère de vente instead of generic Conseiller clientèle', async () => {
    const { statusCode, body } = await callKirbyCv({
        task: 'adapt',
        cv: {
            headline: 'Conseiller clientèle',
            summary: 'Profil commercial orienté client.',
            experience: 'Responsable adjointe - Camaïeu - 2021 - 2022 • Vente et fidélisation',
        },
        instruction: 'Mets le titre Conseillère de vente, pas Conseiller clientèle.',
        openAiCv: {
            headline: 'Conseiller clientèle',
            jobTarget: 'Conseiller clientèle',
        },
    });

    assert.equal(statusCode, 200);
    assert.equal(body.cv.headline, 'Conseillère de vente');
    assert.equal(body.cv.jobTarget, 'Conseillère de vente');
});
