const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const C = require('../../assets/kirby-site-contract');
const E = require('../../kirby-composition-engine');
const M = require('../../lib/kirby-site-model');
const F = require('../fixtures/kirby-site.cjs');

test('missing, unknown and current engine markers never register legacy generation handlers', () => {
  const source = fs.readFileSync(require.resolve('../../script.js'), 'utf8');
  const start = source.lastIndexOf('kirbyAutopilotButtons.forEach((button) => {');
  const formStart = source.indexOf('if (aiBriefForm && aiBriefInput && aiBriefOutput', start);
  const formEnd = source.indexOf("event.preventDefault();", formStart);
  assert.ok(start > 0 && formStart > start && formEnd > formStart);
  const registration = source.slice(start, formStart) + source.slice(formStart, formEnd) + '});}';
  for (const marker of [undefined, '', 'v1', 'v2', 'legacy']) {
    let listeners = 0;
    const control = { addEventListener() { listeners++; } };
    vm.runInNewContext(registration, { document: { body: { dataset: { kirbySite: marker } } }, kirbyAutopilotButtons: [control], aiBriefForm: control, aiBriefInput: {}, aiBriefOutput: {} });
    assert.equal(listeners, marker === 'legacy' ? 2 : 0, String(marker));
  }
});

test('unknown or missing compositions fail instead of rendering a default legacy layout', () => {
  for (const composition of [undefined, '', 'old-editorial-template']) {
    const site = F.site(); site.pages[0].sections[0].composition = composition;
    assert.throws(() => C.validate(site));
    assert.throws(() => E.render(composition, {}), /Unknown composition/);
  }
});

test('provider failure never returns a fallback site and preserves the source', async () => {
  const site = F.site(), before = structuredClone(site);
  await assert.rejects(M.generate({ protocol: C.protocol, site, requestMode: 'edit', message: 'Améliore ce site.' }, {
    apiKeys: ['test'], log: () => {}, fetchImpl: async () => { throw new Error('provider unavailable'); }
  }), /provider unavailable/);
  assert.deepEqual(site, before);
});


test('main editor and preview load composition engine before capturing it in renderer', () => {
  for (const file of ['index.html', 'site-preview.html']) {
    const html = fs.readFileSync(require.resolve('../../' + file), 'utf8');
    const scripts = [...html.matchAll(/<script\b([^>]*?)src="([^"]+)"([^>]*)><\/script>/g)];
    const source = scripts.map(s => s[2].split('?')[0]);
    const engine = source.indexOf('kirby-composition-engine.js');
    const renderer = source.indexOf('assets/kirby-site-renderer.js');
    assert.ok(engine >= 0 && engine < renderer, file);
    for (const index of [engine, renderer]) {
      assert.match(scripts[index][1] + scripts[index][3], /\bdefer\b/);
      assert.doesNotMatch(scripts[index][1] + scripts[index][3], /\basync\b/);
    }
  }
});
