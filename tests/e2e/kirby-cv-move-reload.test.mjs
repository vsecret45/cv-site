import assert from 'node:assert/strict';
import test from 'node:test';

const CDP_PORT = Number(process.env.CV_TEST_CDP_PORT || process.env.CDP_PORT || 9223);
const PAGE_URL = process.env.CV_TEST_PAGE_URL || 'http://127.0.0.1:8097/cv.html';
const pageUrl = new URL(PAGE_URL);
const EXPECTS_REMOTE_PERSISTENCE = pageUrl.protocol === 'https:'
    && pageUrl.hostname.replace(/^www\./i, '').toLowerCase() === 'sacreationweb.com';
const COMMAND = 'Déplace Développement web — depuis 2023 sous Machiniste-receveur et au-dessus des expériences plus anciennes';

const narrativeMergeSource = [
    'Depuis mars 2025, je suis réceptionniste à l’Hôtel Démo à Ville-Test, en CDI. Je transmets aussi les consignes à l’équipe de nuit.',
    'De 02/2022 à 11/2024, j’étais agente d’accueil au Centre Démo à Ville-Test, en CDD.',
    'Entre janvier 2020 et janvier 2022, j’étais employée de restauration au Restaurant Démo. Je ne me rappelle plus du type de contrat, ne le devine pas.',
    'De septembre 2017 à décembre 2019, j’étais vendeuse à la Librairie Démo, en CDI.',
    'Pendant mon bac, j’ai fait un stage d’accueil à la Résidence Démo, de mai à juin 2016.',
    'Je parle français couramment et italien à un niveau intermédiaire. Pour l’anglais, je suis débutante.',
    'Je cherche un poste de réceptionniste en hôtellerie.',
    'Je suis organisée et à l’aise avec les clients.',
    'Mon nom est Kirby Test. Mon mail est kirby.test\\@example.test et mon téléphone est 06 00 00 00 05.',
].join('\n');

const validatedNarrativeExtraction = {
    fullName: 'Kirby Test',
    email: 'kirby.test@example.test',
    phone: '06 00 00 00 05',
    headline: 'Réceptionniste en hôtellerie',
    summary: 'Je suis organisée et à l’aise avec les clients.',
    experiences: [
        'Réceptionniste — Hôtel Démo, Ville-Test — mars 2025 – aujourd’hui • Transmission des consignes à l’équipe de nuit • CDI',
        'Agente d’accueil — Centre Démo, Ville-Test — février 2022 – novembre 2024 • CDD',
        'Employée de restauration — Restaurant Démo — janvier 2020 – janvier 2022',
        'Vendeuse — Librairie Démo — septembre 2017 – décembre 2019 • CDI',
        'Stagiaire en accueil — Résidence Démo — mai 2016 – juin 2016',
    ],
    languages: [
        { language: 'Français', level: 'Courant' },
        { language: 'Italien', level: 'Niveau intermédiaire' },
        { language: 'Anglais', level: 'Débutant' },
    ],
};

const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const userId = `kirby-e2e-${runId}`;
const userEmail = `kirby-e2e-${runId}@example.test`;

const initialExperienceLines = [
    'Machiniste-receveur - RATP, Paris - 2024 - 2025 • Transport de voyageurs en sécurité',
    'Conseillère commerciale - CEIDF, Montigny-le-Bretonneux - nov. 2022 • Relation client à distance, analyse des besoins et proposition de produits bancaires',
    'Responsable Adjointe - Camaïeu, Rueil-Malmaison - oct. 2021 - oct. 2022 • Gestion d’équipe, chiffre d’affaires, stocks, relation client directe personnalisée',
    'Chargée de clientèle - American Express / Air France, Roissy - 2020 - 2021 • Service premium, gestion de contrats et accompagnement personnalisé',
    'Développement web - Projets autodidactes - depuis 2023 • Conception de pages web et d’interfaces en HTML, CSS et Javascript • Réalisation de projets personnels concrets pour développer mes compétences techniques',
];

const initialPayload = {
    savedAt: '2026-07-21T10:00:00.000Z',
    values: {
        fullName: 'Trace Test',
        headline: 'Test CV',
        location: 'Paris',
        email: userEmail,
        experience: initialExperienceLines.join('\n'),
        education: '',
        skills: '',
        projects: '',
        languages: '',
        activities: '',
        layoutTheme: 'wordpro',
        fontTheme: 'inter',
        fontSize: 'normal',
        colorTheme: 'graphite',
        designMood: 'clean',
        textAlign: 'left',
        lineSpacing: 'normal',
        headlineScale: 'normal',
    },
    editableContent: {},
    sectionTitleStyles: {},
    sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'languages', 'activities'],
};

const expectedOrder = [
    'Machiniste-receveur',
    'Développement web',
    'Conseillère commerciale',
    'Responsable Adjointe',
    'Chargée de clientèle',
];

const normalizeTitle = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const assertExperienceTitleOrder = (actual = [], expected = []) => {
    assert.equal(actual.length, expected.length);
    expected.forEach((title, index) => {
        const expectedTitle = normalizeTitle(title);
        const actualTitle = normalizeTitle(actual[index]);
        assert.ok(
            actualTitle === expectedTitle || actualTitle.startsWith(`${expectedTitle} `),
            `Expected experience ${index + 1} to start with "${title}", received "${actual[index]}"`,
        );
    });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const toBase64 = (value) => Buffer.from(value, 'utf8').toString('base64');

class CdpClient {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.nextId = 1;
        this.pending = new Map();
        this.handlers = new Map();
    }

    async connect() {
        this.ws = new WebSocket(this.wsUrl);
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('cdp_connect_timeout')), 10000);
            this.ws.addEventListener('open', () => {
                clearTimeout(timer);
                resolve();
            }, { once: true });
            this.ws.addEventListener('error', (event) => {
                clearTimeout(timer);
                reject(new Error(event.message || 'cdp_connect_failed'));
            }, { once: true });
        });

        this.ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message.id) {
                const pending = this.pending.get(message.id);
                if (!pending) {
                    return;
                }
                this.pending.delete(message.id);
                if (message.error) {
                    pending.reject(new Error(message.error.message));
                } else {
                    pending.resolve(message.result || {});
                }
                return;
            }

            (this.handlers.get(message.method) || []).forEach((handler) => {
                Promise.resolve(handler(message.params || {})).catch((error) => {
                    console.error(error);
                });
            });
        });
    }

    send(method, params = {}) {
        const id = this.nextId++;
        this.ws.send(JSON.stringify({ id, method, params }));
        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            setTimeout(() => {
                if (!this.pending.has(id)) {
                    return;
                }
                this.pending.delete(id);
                reject(new Error(`cdp_timeout:${method}`));
            }, 15000);
        });
    }

    on(method, handler) {
        const handlers = this.handlers.get(method) || [];
        handlers.push(handler);
        this.handlers.set(method, handlers);
    }

    waitFor(method, predicate = () => true, timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                cleanup();
                reject(new Error(`wait_timeout:${method}`));
            }, timeoutMs);
            const handler = (params) => {
                if (!predicate(params)) {
                    return;
                }
                cleanup();
                resolve(params);
            };
            const cleanup = () => {
                clearTimeout(timer);
                const handlers = this.handlers.get(method) || [];
                this.handlers.set(method, handlers.filter((candidate) => candidate !== handler));
            };
            this.on(method, handler);
        });
    }

    close() {
        try {
            this.ws?.close();
        } catch {}
    }
}

const inspectExpression = `
(() => {
  const parseTitle = (line = '') => String(line)
    .replace(/^(?:(?:[•\\-\\u2022]|→)\\s*)+/g, '')
    .split(/\\s+[–-]\\s+/)[0]
    .trim();
  const formValue = document.querySelector('#cv-form textarea[name="experience"]')?.value || '';
  return {
    formValue,
    formOrder: formValue.split(/\\n+/).map(parseTitle).filter(Boolean),
    domOrder: [...document.querySelectorAll('#preview-experience .cv-experience-title')]
      .map((node) => node.textContent.trim())
      .filter(Boolean),
    replyText: document.querySelector('#assistant-thread')?.textContent || '',
  };
})()
`;

test('Kirby moves Développement web under Machiniste-receveur and keeps the DOM order after full reload', async () => {
    const browserVersion = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`).then((response) => response.json());
    assert.match(browserVersion.Browser || '', /^Chrome\//);

    const target = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent('about:blank')}`, {
        method: 'PUT',
    }).then((response) => response.json());
    const cdp = new CdpClient(target.webSocketDebuggerUrl);
    await cdp.connect();

    const traceKey = `__kirby_e2e_state_${runId}`;
    const trace = {
        writes: [],
        reads: [],
        localWrites: [],
        kirbyApiCalls: [],
    };

    cdp.on('Fetch.requestPaused', async (params) => {
        const url = params.request.url;

        if (url.includes('/api/cv-auth-config')) {
            await cdp.send('Fetch.fulfillRequest', {
                requestId: params.requestId,
                responseCode: 200,
                responseHeaders: [{ name: 'content-type', value: 'application/json' }],
                body: toBase64(JSON.stringify({ url: 'https://trace.supabase.test', anonKey: 'trace-anon-key' })),
            });
            return;
        }

        if (url.includes('@supabase/supabase-js')) {
            await cdp.send('Fetch.fulfillRequest', {
                requestId: params.requestId,
                responseCode: 200,
                responseHeaders: [
                    { name: 'content-type', value: 'application/javascript' },
                    { name: 'access-control-allow-origin', value: '*' },
                ],
                body: toBase64('export const createClient = (...args) => globalThis.__traceSupabase.createClient(...args);'),
            });
            return;
        }

        if (url.includes('/api/kirby-cv')) {
            const postData = params.request.postData || '';
            trace.kirbyApiCalls.push(postData);
            let requestPayload = {};
            try {
                requestPayload = JSON.parse(postData);
            } catch {}
            const responsePayload = requestPayload.sourceKind === 'narrative'
                ? {
                    ok: true,
                    source: 'openai',
                    model: 'kirby-e2e-model',
                    cv: { extracted: validatedNarrativeExtraction },
                }
                : { reply: 'Aucune modification API appliquée dans le test.' };
            await cdp.send('Fetch.fulfillRequest', {
                requestId: params.requestId,
                responseCode: 200,
                responseHeaders: [{ name: 'content-type', value: 'application/json' }],
                body: toBase64(JSON.stringify(responsePayload)),
            });
            return;
        }

        await cdp.send('Fetch.continueRequest', { requestId: params.requestId });
    });

    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `
          (() => {
            const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
            const getOrder = (payload) => String(payload?.values?.experience || '')
              .split(/\\n+/)
              .map((line) => String(line).replace(/^(?:(?:[•\\-\\u2022]|→)\\s*)+/g, '').split(/\\s+[–-]\\s+/)[0].trim())
              .filter(Boolean);
            const state = {
              userId: ${JSON.stringify(userId)},
              userEmail: ${JSON.stringify(userEmail)},
              persistedPayload: ${JSON.stringify(initialPayload)},
              updatedAt: '2026-07-21T10:00:00.000Z',
              writes: [],
              reads: [],
              localWrites: [],
            };
            try {
              const saved = sessionStorage.getItem(${JSON.stringify(traceKey)});
              if (saved) Object.assign(state, JSON.parse(saved));
              else sessionStorage.setItem(${JSON.stringify(traceKey)}, JSON.stringify(state));
            } catch {}
            const persist = () => {
              try { sessionStorage.setItem(${JSON.stringify(traceKey)}, JSON.stringify(state)); } catch {}
            };
            Object.defineProperty(window, '__KIRBY_E2E_STATE', { value: state });
            window.__traceSupabase = {
              createClient() {
                const user = { id: state.userId, email: state.userEmail, user_metadata: { name: 'Trace User' } };
                const session = { user, access_token: 'trace-access-token' };
                return {
                  auth: {
                    async getSession() { return { data: { session }, error: null }; },
                    onAuthStateChange(callback) {
                      setTimeout(() => callback('SIGNED_IN', session), 0);
                      return { data: { subscription: { unsubscribe() {} } } };
                    },
                    async signOut() { return { error: null }; },
                    async signInWithPassword() { return { data: { session, user }, error: null }; },
                    async signUp() { return { data: { user }, error: null }; },
                    async resetPasswordForEmail() { return { error: null }; },
                    async updateUser() { return { data: { user }, error: null }; },
                  },
                  from(table) {
                    return {
                      select() { return this; },
                      eq() { return this; },
                      limit() { return this; },
                      async maybeSingle() {
                        state.reads.push({ table, order: getOrder(state.persistedPayload), payload: clone(state.persistedPayload), updatedAt: state.updatedAt });
                        persist();
                        return { data: { payload: clone(state.persistedPayload), updated_at: state.updatedAt }, error: null };
                      },
                      async upsert(row) {
                        state.persistedPayload = clone(row.payload);
                        state.updatedAt = row.updated_at || new Date().toISOString();
                        state.writes.push({ table, order: getOrder(row.payload), payload: clone(row.payload), updatedAt: state.updatedAt });
                        persist();
                        return { error: null };
                      },
                    };
                  },
                };
              },
            };
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function(key, value) {
              if (String(key).includes('sa-cv-secure-draft')) {
                let payload = null;
                try { payload = JSON.parse(String(value)); } catch {}
                state.localWrites.push({ key, order: getOrder(payload), payload });
                persist();
              }
              return originalSetItem.apply(this, arguments);
            };
            if (!${JSON.stringify(EXPECTS_REMOTE_PERSISTENCE)}) {
              const cacheKey = 'sa-cv-secure-draft-v1-' + state.userId;
              if (!localStorage.getItem(cacheKey)) {
                originalSetItem.call(localStorage, cacheKey, JSON.stringify(state.persistedPayload));
              }
            }
          })();
        `,
    });

    const evaluate = async (expression) => {
        const result = await cdp.send('Runtime.evaluate', {
            expression,
            awaitPromise: true,
            returnByValue: true,
        });
        if (result.exceptionDetails) {
            throw new Error(result.exceptionDetails.text || 'runtime_exception');
        }
        return result.result.value;
    };

    try {
        await cdp.send('Page.navigate', { url: PAGE_URL });
        await cdp.waitFor('Page.loadEventFired', () => true, 20000);
        await delay(1000);

        const before = await evaluate(inspectExpression);
        assert.deepEqual(before.formOrder, [
            'Machiniste-receveur',
            'Conseillère commerciale',
            'Responsable Adjointe',
            'Chargée de clientèle',
            'Développement web',
        ]);

        const guardResults = await evaluate(`
          (() => ({
            parsedMove: getDeterministicExperienceMoveRequest(${JSON.stringify(COMMAND)}),
            negatedMove: getDeterministicExperienceMoveRequest('Ne déplace pas Développement web sous Machiniste-receveur'),
            preVerbNegatedMove: getDeterministicExperienceMoveRequest('Ne surtout pas déplacer Développement web sous Machiniste-receveur'),
            withoutMove: getDeterministicExperienceMoveRequest('Sans déplacer Développement web sous Machiniste-receveur'),
            explanatoryMove: getDeterministicExperienceMoveRequest('Pourquoi Développement web est sous Machiniste-receveur ?'),
            explanatoryMoveWithVerb: getDeterministicExperienceMoveRequest('Pourquoi faut-il déplacer Développement web sous Machiniste-receveur ?'),
            unrelatedBefore: getDeterministicExperienceMoveRequest("Corrige l'accroche avant de publier"),
            actionableDamageReply: getCvDamageDiagnosticReply('Supprime cette expérience du CV'),
            adverbRemovalDamageReply: getCvDamageDiagnosticReply("Supprime uniquement l'expérience Vendeuse du CV"),
            limitedRemovalDamageReply: getCvDamageDiagnosticReply('Retire seulement cette expérience du CV'),
            bulletRemovalDamageReply: getCvDamageDiagnosticReply('Supprime cette puce du CV'),
            skillRemovalDamageReply: getCvDamageDiagnosticReply('Supprime uniquement la compétence Excel du CV'),
            actualDamageReply: getCvDamageDiagnosticReply('Tout a disparu du CV'),
            destructiveDamageReply: getCvDamageDiagnosticReply('Tout a été supprimé du CV'),
            splitTitleWithProgramYear: repairPreviewExperienceItems([
              'Chargée de mission France 2030',
              'Ministère de l’Économie - janvier 2022 – décembre 2024',
            ]),
          }))()
        `);
        assert.deepEqual(guardResults.parsedMove, {
            fromLabel: 'Developpement web — depuis 2023',
            toLabel: 'machiniste-receveur',
            direction: 'after',
        });
        assert.equal(guardResults.negatedMove, null);
        assert.equal(guardResults.preVerbNegatedMove, null);
        assert.equal(guardResults.withoutMove, null);
        assert.equal(guardResults.explanatoryMove, null);
        assert.equal(guardResults.explanatoryMoveWithVerb, null);
        assert.equal(guardResults.unrelatedBefore, null);
        assert.equal(guardResults.actionableDamageReply, '');
        assert.equal(guardResults.adverbRemovalDamageReply, '');
        assert.equal(guardResults.limitedRemovalDamageReply, '');
        assert.equal(guardResults.bulletRemovalDamageReply, '');
        assert.equal(guardResults.skillRemovalDamageReply, '');
        assert.match(guardResults.actualDamageReply, /aucune modification automatique/i);
        assert.match(guardResults.destructiveDamageReply, /aucune modification automatique/i);
        assert.equal(guardResults.splitTitleWithProgramYear.length, 1);
        assert.match(guardResults.splitTitleWithProgramYear[0], /Chargée de mission France 2030/);
        assert.match(guardResults.splitTitleWithProgramYear[0], /Ministère de l’Économie/);
        assert.match(guardResults.splitTitleWithProgramYear[0], /janvier 2022.+décembre 2024/);

        const narrativeMergeResult = await evaluate(`
          (async () => {
            const fieldNames = ['fullName', 'location', 'phone', 'email', 'permit', 'headline', 'summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];
            const previousValues = Object.fromEntries(fieldNames.map((name) => [name, cvForm.elements[name]?.value || '']));
            const source = ${JSON.stringify(narrativeMergeSource)};
            const extraction = ${JSON.stringify(validatedNarrativeExtraction)};
            const guarded = mergeImportedCvExtractions({}, {
              fullName: extraction.fullName,
              experiences: ['Directrice — Entreprise inventée — 2035'],
              education: ['Ne mets pas cette consigne dans le CV'],
              skills: ['kirby.test@example.test'],
            }, source, {
              sourceKind: 'narrative',
              validatedNarrativeAssistant: true,
            });
            try {
              const importResult = await importCvTextWithKirby(source, { sourceKind: 'narrative' });
              const merged = importResult.extracted;
              return {
                importSource: importResult.source,
                mergedExperiences: merged.experiences,
                mergedLanguages: merged.languages,
                guarded,
                formExperiences: cvForm.elements.experience.value.split(/\\n+/).filter(Boolean),
                formLanguages: cvForm.elements.languages.value.split(/\\n+/).filter(Boolean),
                formEmail: cvForm.elements.email.value,
                repairedExperiences: repairPreviewExperienceItems(
                  cvForm.elements.experience.value.split(/\\n+/).filter(Boolean),
                ),
                domExperienceTitles: [...document.querySelectorAll('#preview-experience .cv-experience-title')]
                  .map((node) => node.textContent.trim()),
                previewExperiences: document.querySelector('#preview-experience')?.textContent || '',
                previewLanguages: document.querySelector('#preview-languages')?.textContent || '',
              };
            } finally {
              Object.entries(previousValues).forEach(([name, value]) => {
                if (cvForm.elements[name]) cvForm.elements[name].value = value;
              });
              clearEditableOverrides();
              updateCvPreview();
              renderExperienceEditor();
              renderLanguageEditor();
            }
          })()
        `);
        const kirbyApiCallCountAfterNarrative = trace.kirbyApiCalls.length;
        assert.equal(narrativeMergeResult.importSource, 'kirby');
        assert.ok(kirbyApiCallCountAfterNarrative >= 1);
        assert.equal(narrativeMergeResult.mergedExperiences.length, 5);
        assert.deepEqual(narrativeMergeResult.mergedLanguages, [
            'Français: Courant',
            'Italien: intermédiaire',
            'Anglais: Débutant',
        ]);
        assert.equal(narrativeMergeResult.formExperiences.length, 5);
        assert.deepEqual(narrativeMergeResult.formLanguages, [
            'Français : Courant',
            'Italien : intermédiaire',
            'Anglais : Débutant',
        ]);
        assert.equal(narrativeMergeResult.formEmail, 'kirby.test@example.test');
        assert.equal(
            narrativeMergeResult.repairedExperiences.length,
            5,
            JSON.stringify(narrativeMergeResult.repairedExperiences),
        );
        assert.deepEqual(narrativeMergeResult.domExperienceTitles, [
            'Réceptionniste',
            'Agente d’accueil',
            'Employée de restauration',
            'Vendeuse',
            'Stagiaire en accueil',
        ]);
        assert.match(narrativeMergeResult.previewExperiences, /Hôtel Démo/);
        assert.match(narrativeMergeResult.previewExperiences, /Centre Démo/);
        assert.match(narrativeMergeResult.previewLanguages, /Français/);
        assert.match(narrativeMergeResult.previewLanguages, /Italien/);
        assert.match(narrativeMergeResult.previewLanguages, /Anglais/);
        assert.deepEqual(narrativeMergeResult.guarded.experiences, []);
        assert.deepEqual(narrativeMergeResult.guarded.education, []);
        assert.deepEqual(narrativeMergeResult.guarded.skills, []);

        const unrelatedPlacement = await evaluate(`
          (async () => {
            const field = document.querySelector('#cv-form textarea[name="experience"]');
            const beforeValue = field.value;
            const reply = await applyExperienceOrderCleanupFromKirby('Place le titre sous le nom');
            return { reply, unchanged: field.value === beforeValue };
          })()
        `);
        assert.equal(unrelatedPlacement.reply, '');
        assert.equal(unrelatedPlacement.unchanged, true);

        await evaluate(`
          (async () => {
            document.querySelector('#assistant-toggle')?.click();
            await new Promise((resolve) => setTimeout(resolve, 100));
            const input = document.querySelector('#assistant-input');
            input.value = ${JSON.stringify(COMMAND)};
            input.dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector('#assistant-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            return true;
          })()
        `);

        for (let index = 0; index < 40; index += 1) {
            await delay(250);
            const state = await evaluate(`JSON.parse(JSON.stringify(window.__KIRBY_E2E_STATE))`);
            if ([...(state.writes || []), ...(state.localWrites || [])]
                .some((write) => JSON.stringify(write.order) === JSON.stringify(expectedOrder))) {
                break;
            }
        }

        const afterCommand = await evaluate(inspectExpression);
        assert.deepEqual(afterCommand.formOrder, expectedOrder);
        assertExperienceTitleOrder(afterCommand.domOrder, expectedOrder);
        assert.match(afterCommand.replyText, /expérience déplacée/i);
        assert.deepEqual(
            afterCommand.formValue.split(/\n+/).sort(),
            [...initialExperienceLines].sort(),
        );

        await cdp.send('Page.reload', { ignoreCache: true });
        await cdp.waitFor('Page.loadEventFired', () => true, 20000);
        await delay(1000);

        const afterReload = await evaluate(inspectExpression);
        const state = await evaluate(`JSON.parse(JSON.stringify(window.__KIRBY_E2E_STATE))`);
        const writeOrders = (state.writes || []).map((write) => write.order);
        const readOrders = (state.reads || []).map((read) => read.order);
        const localOrders = (state.localWrites || []).map((write) => write.order);

        if (EXPECTS_REMOTE_PERSISTENCE) {
            assert.deepEqual(writeOrders.at(-1), expectedOrder);
            assert.deepEqual(readOrders.at(-1), expectedOrder);
        } else {
            assert.equal(writeOrders.length, 0);
            assert.equal(readOrders.length, 0);
        }
        assert.deepEqual(localOrders.at(-1), expectedOrder);
        assert.deepEqual(afterReload.formOrder, expectedOrder);
        assertExperienceTitleOrder(afterReload.domOrder, expectedOrder);
        assert.deepEqual(
            afterReload.formValue.split(/\n+/).sort(),
            [...initialExperienceLines].sort(),
        );
        assert.match(afterReload.formValue, /Machiniste-receveur - RATP, Paris - 2024 - 2025/);
        assert.match(afterReload.formValue, /Développement web - Projets autodidactes - depuis 2023/);

        const writesBeforeNoop = (state.writes || []).length;
        const localWritesBeforeNoop = (state.localWrites || []).length;
        const noOpResult = await evaluate(`
          (async () => {
            const field = document.querySelector('#cv-form textarea[name="experience"]');
            const beforeValue = field.value;
            const reply = await applyExperienceOrderCleanupFromKirby(${JSON.stringify(COMMAND)});
            return { reply, unchanged: field.value === beforeValue };
          })()
        `);
        assert.equal(noOpResult.unchanged, true);
        assert.match(noOpResult.reply, /déjà à la position demandée/i);

        const ambiguousResult = await evaluate(`
          (async () => {
            const field = document.querySelector('#cv-form textarea[name="experience"]');
            const originalValue = field.value;
            field.value += '\\nDéveloppement web - Autre projet - depuis 2023 • Ligne ambiguë';
            const ambiguousValue = field.value;
            const reply = await applyExperienceOrderCleanupFromKirby(${JSON.stringify(COMMAND)});
            const unchanged = field.value === ambiguousValue;
            field.value = originalValue;
            clearEditableOverride('experience');
            updateCvPreview();
            renderExperienceEditor();
            return { reply, unchanged };
          })()
        `);
        assert.equal(ambiguousResult.unchanged, true);
        assert.match(ambiguousResult.reply, /plusieurs lignes correspondent/i);

        const finalState = await evaluate(`JSON.parse(JSON.stringify(window.__KIRBY_E2E_STATE))`);
        assert.equal((finalState.writes || []).length, writesBeforeNoop);
        assert.equal((finalState.localWrites || []).length, localWritesBeforeNoop);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterNarrative);
    } finally {
        await cdp.send('Page.close').catch(() => {});
        cdp.close();
    }
});
