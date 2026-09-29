const test = require('node:test');
const assert = require('node:assert/strict');
const { generate, SYSTEM } = require('../../lib/cv-model');
const contract = require('../../assets/kirby-cv-contract');

const action = (overrides = {}) => ({
    action: 'edit', message: 'Modification préparée.', documentLanguage: 'fr', operations: [],
    layout: { reflow: false, compact: null, sectionOrder: [] }, letter: { subject: '', body: '' }, ...overrides,
});
const mock = (result, inspect) => ({
    apiKeys: ['synthetic-test-only'], models: ['test-model'], controls: () => ({}),
    fetchImpl: async (url, request) => {
        assert.equal(url, 'https://api.openai.com/v1/chat/completions');
        const body = JSON.parse(request.body);
        assert.equal(body.tools, undefined);
        assert.equal(body.web_search_options, undefined);
        assert.equal(body.messages[0].content, SYSTEM);
        inspect(JSON.parse(body.messages[1].content));
        return { ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(result) } }] }) };
    },
});

test('explicit spelling reaches the CV model without rewriting human text or enabling web search', async () => {
    const cv = contract.state({ skills: 'C R M\nRGPD\nIFRS', summary: '  WORD API  ' });
    const instruction = 'Ajoute C R M à mes compétences, je viens de l’épeler.';
    const result = action({ operations: [{ field: 'skills', encoding: 'text', text: 'C R M\nRGPD\nIFRS\nCRM', items: [], entries: [] }] });
    const response = await generate({ cv, instruction }, mock(result, (context) => {
        assert.deepEqual(context.cv, cv);
        assert.equal(context.instruction, instruction);
    }));
    const plan = contract.plan(response.cv.modelAction, cv);
    assert.equal(plan.after.summary, cv.summary);
    assert.equal(plan.after.skills, 'C R M\nRGPD\nIFRS\nCRM');
    assert.match(SYSTEM, /« C R M » signifie « CRM »/);
    assert.match(SYSTEM, /uniquement sur demande explicite/);
    assert.match(SYSTEM, /jamais automatiquement le texte déjà saisi/);
    assert.match(SYSTEM, /N'utilise aucune recherche Web/);
});

test('ambiguous acronym clarification leaves every field and the layout unchanged', async () => {
    const cv = contract.state({ skills: 'CA\nCRM\nIFRS', summary: '  WORD API  ' });
    const result = action({ action: 'clarify', message: 'Par CA, voulez-vous dire chiffre d’affaires ou conseil d’administration ?' });
    const response = await generate({ cv, instruction: 'Développe les acronymes de mon CV.' }, mock(result, (context) => assert.deepEqual(context.cv, cv)));
    const plan = contract.plan(response.cv.modelAction, cv);
    assert.deepEqual(plan.after, cv);
    assert.deepEqual(plan.changedFields, []);
    assert.match(SYSTEM, /plusieurs significations sont plausibles/);
    assert.match(SYSTEM, /retourne clarify avec une question précise et aucune modification/);
});
