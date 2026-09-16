// Run explicitly: node --env-file=.env tests/live/kirby-cv-model.cjs
// Never writes credentials or real CVs. Results contain synthetic fixtures only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const contract = require('../../assets/kirby-cv-contract');
const { generate } = require('../../lib/cv-model');
const fixtures = require('../fixtures/cv-model-cases.cjs');
const key = process.env.KIRBY_CV_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const model = (process.env.KIRBY_CV_OPENAI_MODEL || process.env.KIRBY_CV_OPENAI_MODELS || 'gpt-5.5').split(',')[0].trim();
if (!key) throw new Error('Missing existing OpenAI credential');
const options = { apiKeys: [key], models: [model], controls: () => /^gpt-5/.test(model)
    ? { max_completion_tokens: 12000, reasoning_effort: 'low' }
    : { max_tokens: 12000, temperature: 0.2 } };
const report = { model, imports: [], edits: [] };
const save = () => fs.writeFileSync('tmp/kirby-model-live.json', JSON.stringify(report, null, 2));
async function main() {
    for (const fixture of fixtures) {
        const started = Date.now();
        const result = await generate({ task: 'autofill', instruction: 'Structure ce document fidèlement.', documentText: fixture.source, sourceKind: fixture.kind || 'document', documentLanguage: fixture.language || 'fr', cv: {} }, options);
        const plan = contract.plan(result.cv.modelAction, result.base);
        for (const [field, count] of Object.entries(fixture.counts)) assert.equal(plan.after[field].split('\n').filter(Boolean).length, count, fixture.id + ':' + field);
        const all = Object.values(plan.after).join('\n').toLowerCase();
        for (const fact of fixture.includes) assert.ok(all.includes(fact.toLowerCase()), fixture.id + ':missing ' + fact);
        assert.ok(!plan.after.activities.split('\n').some((item) => item === '/' || /centres d.int/i.test(item)));
        report.imports.push({ id: fixture.id, result, fields: plan.after, ms: Date.now() - started });
        save(); console.log('PASS import', fixture.id);
    }
    let cv = report.imports[0].fields;
    const changes = [
        { id: 'unusual-phrasing', instruction: 'Dans ce que je fais en dehors du travail, remplace la natation par la gravure sur bois. Garde tout le reste tel quel.', fields: ['activities'], check: (after) => assert.ok(after.activities.toLowerCase().includes('gravure sur bois') && !after.activities.toLowerCase().includes('natation')) },
        { id: 'compound', instruction: 'Mets mon titre à « Coordinatrice administrative » et retire seulement l’italien de mes langues. Mes diplômes restent tels quels.', fields: ['headline', 'languages'], check: (after) => { assert.equal(after.headline, 'Coordinatrice administrative'); assert.ok(!after.languages.toLowerCase().includes('italien')); } },
        { id: 'implicit-section-repair', instruction: 'La partie activités contient des bouts de titre et de séparation qui ne sont pas des loisirs. Nettoie-la en gardant mes vraies activités et ne touche à rien d’autre.', dirty: true, fields: ['activities'], check: (after) => assert.ok(!after.activities.split('\n').some((item) => item === '/' || /centres d.int/i.test(item))) },
        { id: 'question-not-command', instruction: 'Pourquoi ces deux formations ont-elles des dates différentes ?', fields: [], check: (_, result) => assert.equal(result.cv.modelAction.action, 'answer') },
        { id: 'ambiguous-target', instruction: 'Change l’année de mon diplôme à 2020.', fields: [], check: (_, result) => assert.equal(result.cv.modelAction.action, 'clarify') },
    ];
    for (const change of changes) {
        if (change.dirty) cv = { ...cv, activities: '/\n' + cv.activities + '\n/ CENTRES D’INTÉRÊT' };
        const result = await generate({ task: 'assistant', cv, instruction: change.instruction }, options);
        const plan = contract.plan(result.cv.modelAction, cv);
        assert.deepEqual([...plan.changedFields].sort(), [...change.fields].sort(), change.id);
        change.check(plan.after, result);
        report.edits.push({ id: change.id, result, fields: plan.after });
        cv = plan.after; save(); console.log('PASS edit', change.id);
    }
    report.passed = report.imports.length + report.edits.length; save();
    console.log('PASS', report.passed, 'live cases using', model);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
