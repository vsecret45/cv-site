import assert from 'node:assert/strict';
import test from 'node:test';

const CDP_PORT = Number(process.env.CV_TEST_CDP_PORT || process.env.CDP_PORT || 9223);
const PAGE_URL = process.env.CV_TEST_PAGE_URL || 'http://127.0.0.1:8097/cv.html';
const pageUrl = new URL(PAGE_URL);
const EXPECTS_REMOTE_PERSISTENCE = pageUrl.protocol === 'https:'
    && pageUrl.hostname.replace(/^www\./i, '').toLowerCase() === 'sacreationweb.com';
const COMMAND = 'Déplace Développement web — depuis 2023 sous Machiniste-receveur et au-dessus des expériences plus anciennes';
const EXACT_CANVA_COMMAND = 'Dans la rubrique COMPÉTENCES, ajoute uniquement une nouvelle ligne intitulée “Maîtrise de Canva”. Ne modifie rien d’autre.';
const KEEP_ONLY_LANGUAGES_COMMAND = 'Dans la rubrique LANGUES, conserve uniquement « Français : langue maternelle » et « Anglais : niveau intermédiaire B1 ». Supprime toute autre langue. Ne modifie rien d’autre.';
const REMOVE_SPANISH_COMMAND = 'supprime Espagnol : notions';
const REMOVE_MISSING_LANGUAGE_COMMAND = 'Supprime Allemand : notions';
const REMOVE_ITALIAN_COMMAND = 'Supprime Italien : niveau intermédiaire';
const FULL_ENGLISH_TRANSLATION_COMMAND = 'Remplace le CV en anglais. Ne conserve aucun texte français.';
const TRANSLATE_ENGLISH_COMMAND = 'Traduis le CV en anglais.';
const ELISE_SKILLS = [
    'Excel',
    'Outlook',
    'Logiciel de réservation hôtelière',
    'Gestion des réclamations avec calme',
    'Organisation des priorités',
    'Travail en équipe',
];

const frenchCvForTranslation = {
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
    ],
    experiences: [
        'Réceptionniste — Hôtel Les Rives Dorées, Angers — mars 2025 – aujourd’hui • CDI • Arrivées, départs, réservations et facturation',
        'Agente d’accueil — Espace Orbel, Angers — février 2022 – novembre 2024 • CDD • Accueil des visiteurs et gestion du standard',
    ],
    projects: [],
    education: [
        'Bac professionnel accueil — Lycée des Amandiers, Tours — 2017',
        'Formation de premiers secours — Secours des Rives — avril 2024',
    ],
    activities: ['Randonnée', 'Cinéma italien'],
    languages: [
        'Français : langue maternelle',
        'Anglais : niveau intermédiaire B1',
    ],
};

const completeEnglishTranslation = {
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
};

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

const partialNarrativeMergeSource = [
    'Mon nom est Kirby Mini.',
    'Le titre du CV est « Test de mise en forme ».',
    'Pour la mise en forme partielle, ma compétence est R.',
].join('\n');

const partialNarrativeExtraction = {
    fullName: 'Kirby Mini',
    headline: 'Test de mise en forme',
    skills: ['R'],
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

test('Kirby adds only “Maîtrise de Canva”, then preserves the targeted move after full reload', async () => {
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
            const narrativeExtraction = String(requestPayload.documentText || '').includes('Kirby Mini')
                ? partialNarrativeExtraction
                : validatedNarrativeExtraction;
            const isCompleteEnglishTranslation = [
                FULL_ENGLISH_TRANSLATION_COMMAND,
                TRANSLATE_ENGLISH_COMMAND,
            ].includes(requestPayload.instruction);
            const responsePayload = isCompleteEnglishTranslation
                ? {
                    ok: true,
                    source: 'openai',
                    model: 'kirby-e2e-model',
                    cv: {
                        documentLanguage: 'en',
                        headline: completeEnglishTranslation.headline,
                        summary: completeEnglishTranslation.summary,
                        skills: completeEnglishTranslation.skills,
                        languages: completeEnglishTranslation.languages,
                        extracted: completeEnglishTranslation,
                        operations: [],
                        operationSafety: {
                            targetedRequest: false,
                            filteredAll: false,
                            rejectedCount: 0,
                        },
                        documentReplacement: {
                            type: 'translation',
                            sourceLanguage: 'fr',
                            targetLanguage: 'en',
                            complete: true,
                        },
                        layout: {
                            reflow: true,
                            preserveAllContent: true,
                        },
                    },
                }
                : requestPayload.sourceKind === 'narrative'
                ? {
                    ok: true,
                    source: 'openai',
                    model: 'kirby-e2e-model',
                    cv: { extracted: narrativeExtraction },
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

    const submitKirbyCommand = async (command, { timeoutMs = 10000 } = {}) => {
        const before = await evaluate(`(() => ({
          botCount: document.querySelectorAll('#assistant-thread .assistant-thread-message.is-bot').length,
          lastBotReply: [...document.querySelectorAll('#assistant-thread .assistant-thread-message.is-bot .assistant-thread-body')]
            .map((node) => node.textContent.trim())
            .at(-1) || '',
          startedAt: performance.now(),
        }))()`);
        await evaluate(`
          (() => {
            openAssistant();
            const input = document.querySelector('#assistant-input');
            input.value = ${JSON.stringify(command)};
            input.dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector('#assistant-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            return true;
          })()
        `);

        const attempts = Math.max(1, Math.ceil(timeoutMs / 100));
        for (let index = 0; index < attempts; index += 1) {
            await delay(100);
            const result = await evaluate(`(() => {
              const replies = [...document.querySelectorAll('#assistant-thread .assistant-thread-message.is-bot .assistant-thread-body')]
                .map((node) => node.textContent.trim());
              const latestReply = replies.at(-1) || '';
              if (!latestReply || (replies.length === ${before.botCount} && latestReply === ${JSON.stringify(before.lastBotReply)})) return null;
              const fieldNames = ['fullName', 'location', 'phone', 'email', 'permit', 'headline', 'summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];
              return {
                snapshot: getKirbyCvSnapshot(),
                values: Object.fromEntries(fieldNames.map((name) => [name, cvForm.elements[name]?.value || ''])),
                previewLanguages: [...document.querySelectorAll('#preview-languages li')]
                  .map((node) => node.textContent.trim())
                  .filter(Boolean),
                previewSkills: [...document.querySelectorAll('#preview-skills > li')]
                  .map((node) => node.textContent.trim())
                  .filter(Boolean),
                previewText: document.querySelector('#cv-preview')?.textContent || '',
                sectionTitles: Object.fromEntries(
                  [...document.querySelectorAll('#cv-preview [data-section-title]')]
                    .map((node) => [node.dataset.sectionTitle, node.textContent.trim()])
                ),
                reply: latestReply,
                elapsedMs: performance.now() - ${before.startedAt},
                contentLocale: currentCvContentLocale,
                requestInFlight: isKirbyCvRequestInFlight,
                hasPendingProposal: Boolean(pendingKirbyCvProposal),
              };
            })()`);
            if (result) return result;
        }

        throw new Error(`Kirby command timed out: ${command}`);
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
            keepOnlyLanguagesDamageReply: getCvDamageDiagnosticReply(${JSON.stringify(KEEP_ONLY_LANGUAGES_COMMAND)}),
            actualDamageReply: getCvDamageDiagnosticReply('Tout a disparu du CV'),
            destructiveDamageReply: getCvDamageDiagnosticReply('Tout a été supprimé du CV'),
            languageOperationTarget: getOperationTargetText({
              type: 'remove_text',
              field: 'languages',
              target: {
                label: 'Espagnol',
                currentValue: 'Espagnol : Notions',
              },
            }),
            experienceOperationTarget: getOperationTargetText({
              type: 'remove_text',
              field: 'experience',
              target: {
                title: 'Réceptionniste',
                organization: 'Hôtel Les Rives Dorées',
                currentValue: 'Accueil des visiteurs',
              },
            }),
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
        assert.equal(guardResults.keepOnlyLanguagesDamageReply, '');
        assert.match(guardResults.actualDamageReply, /aucune modification automatique/i);
        assert.match(guardResults.destructiveDamageReply, /aucune modification automatique/i);
        assert.equal(guardResults.languageOperationTarget, 'Espagnol : Notions');
        assert.match(guardResults.experienceOperationTarget, /Réceptionniste/);
        assert.match(guardResults.experienceOperationTarget, /Hôtel Les Rives Dorées/);
        assert.match(guardResults.experienceOperationTarget, /Accueil des visiteurs/);
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
              email: 'invented@example.test',
              phone: '06 00 00 00 99',
              experiences: ['Directrice — Entreprise inventée — 2035'],
              education: ['Ne mets pas cette consigne dans le CV'],
              skills: ['kirby.test@example.test'],
            }, source, {
              sourceKind: 'narrative',
              validatedNarrativeAssistant: true,
            });
            const trustedFormattingItems = mergeImportedCvExtractions({}, {
              skills: ['R', 'Recherche', 'Gestion de projet', 'Gestion de projet agile'],
            }, 'Compétences : R, Recherche, Gestion de projet et Gestion de projet agile.', {
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
                trustedFormattingItems,
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
        assert.equal(narrativeMergeResult.guarded.email, '');
        assert.equal(narrativeMergeResult.guarded.phone, '');
        assert.deepEqual(narrativeMergeResult.trustedFormattingItems.skills, [
            'R',
            'Recherche',
            'Gestion de projet',
            'Gestion de projet agile',
        ]);

        const partialNarrativeResult = await evaluate(`
          (async () => {
            const fieldNames = ['fullName', 'location', 'phone', 'email', 'permit', 'headline', 'summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];
            const previousValues = Object.fromEntries(fieldNames.map((name) => [name, cvForm.elements[name]?.value || '']));
            try {
              const result = await importCvTextWithKirby(${JSON.stringify(partialNarrativeMergeSource)}, { sourceKind: 'narrative' });
              return {
                source: result.source,
                fullName: cvForm.elements.fullName.value,
                headline: cvForm.elements.headline.value,
                skills: cvForm.elements.skills.value.split(/\\n+/).filter(Boolean),
                preview: document.querySelector('#cv-preview')?.textContent || '',
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
        assert.equal(partialNarrativeResult.source, 'kirby');
        assert.equal(partialNarrativeResult.fullName, 'Kirby Mini');
        assert.equal(partialNarrativeResult.headline, 'Test de mise en forme');
        assert.deepEqual(partialNarrativeResult.skills, ['R']);
        assert.match(partialNarrativeResult.preview, /Kirby Mini/);
        assert.match(partialNarrativeResult.preview, /Test de mise en forme/);
        const kirbyApiCallCountAfterImports = trace.kirbyApiCalls.length;

        const keepOnlyBefore = await evaluate(`
          (() => {
            currentCvContentLocale = 'fr';
            cvForm.elements.languages.value = 'Français : langue maternelle\\nAnglais : niveau intermédiaire B1\\nEspagnol : notions';
            clearEditableOverride('languages');
            renderLanguageEditor({ normalizeField: false });
            updateCvPreview({ preserveDensity: true });
            return getKirbyCvSnapshot();
          })()
        `);
        const languageQuestionIntents = await evaluate(`[
          getExplicitLanguageMutationIntent('Comment supprimer Espagnol : notions dans la rubrique LANGUES ?'),
          getExplicitLanguageMutationIntent('Faut-il supprimer Espagnol : notions dans la rubrique LANGUES ?'),
          getExplicitLanguageMutationIntent('Est-ce que je peux supprimer Espagnol : notions dans la rubrique LANGUES ?'),
          getExplicitLanguageMutationIntent('How do I delete Spanish : Basic from LANGUAGES?'),
        ]`);
        languageQuestionIntents.forEach((intent) => {
            assert.deepEqual(intent, { type: 'non_command' });
        });
        const unquotedKeepOnlyIntent = await evaluate(`getExplicitLanguageMutationIntent(
          'Dans LANGUES, conserve uniquement Français : langue maternelle et Anglais : niveau intermédiaire B1. Supprime toute autre langue.'
        )`);
        assert.deepEqual(unquotedKeepOnlyIntent, {
            type: 'retain_only',
            lines: ['Français : langue maternelle', 'Anglais : niveau intermédiaire B1'],
        });
        const languageQuestionResult = await submitKirbyCommand(
            'Comment supprimer Espagnol : notions dans la rubrique LANGUES ?',
            { timeoutMs: 4000 },
        );
        assert.equal(languageQuestionResult.snapshot, keepOnlyBefore);
        assert.match(languageQuestionResult.reply, /question.+pas une commande/i);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        const keepOnlyResult = await submitKirbyCommand(KEEP_ONLY_LANGUAGES_COMMAND, { timeoutMs: 4000 });
        assert.equal(
            keepOnlyResult.values.languages,
            'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
        );
        assert.deepEqual(keepOnlyResult.previewLanguages, [
            'Français : langue maternelle',
            'Anglais : niveau intermédiaire B1',
        ]);
        assert.match(keepOnlyResult.reply, /langues?.+(?:conserv|mise|modifi)/i);
        assert.doesNotMatch(keepOnlyResult.reply, /annuler|réimport|restaur|ambigu/i);
        assert.ok(keepOnlyResult.elapsedMs < 3000, `Commande LANGUES déterministe trop lente : ${keepOnlyResult.elapsedMs} ms`);
        assert.equal(keepOnlyResult.requestInFlight, false);
        assert.equal(keepOnlyResult.hasPendingProposal, false);
        const keepOnlyBeforeWithoutLanguages = JSON.parse(keepOnlyBefore);
        const keepOnlyAfterWithoutLanguages = JSON.parse(keepOnlyResult.snapshot);
        keepOnlyBeforeWithoutLanguages.cv.languages = '__TARGETED_LANGUAGE_FIELD__';
        keepOnlyAfterWithoutLanguages.cv.languages = '__TARGETED_LANGUAGE_FIELD__';
        assert.deepEqual(
            keepOnlyAfterWithoutLanguages,
            keepOnlyBeforeWithoutLanguages,
            'La commande conserve uniquement a modifié une donnée hors LANGUES',
        );
        assert.equal(
            trace.kirbyApiCalls.length,
            kirbyApiCallCountAfterImports,
            'La commande LANGUES déterministe ne doit pas appeler /api/kirby-cv',
        );

        const removeSpanishBefore = await evaluate(`
          (() => {
            cvForm.elements.languages.value = 'Français : langue maternelle\\nAnglais : niveau intermédiaire B1\\nESPAGNOL : NOTIONS';
            clearEditableOverride('languages');
            renderLanguageEditor({ normalizeField: false });
            updateCvPreview({ preserveDensity: true });
            return getKirbyCvSnapshot();
          })()
        `);
        const removeSpanishResult = await submitKirbyCommand(REMOVE_SPANISH_COMMAND, { timeoutMs: 4000 });
        assert.equal(
            removeSpanishResult.values.languages,
            'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
            'La suppression exacte doit ignorer la casse sans toucher les autres langues',
        );
        assert.match(removeSpanishResult.reply, /langue.+supprim/i);
        assert.doesNotMatch(removeSpanishResult.reply, /annuler|réimport|restaur|ambigu/i);
        assert.ok(removeSpanishResult.elapsedMs < 3000, `Suppression LANGUES déterministe trop lente : ${removeSpanishResult.elapsedMs} ms`);
        const removeSpanishBeforeWithoutLanguages = JSON.parse(removeSpanishBefore);
        const removeSpanishAfterWithoutLanguages = JSON.parse(removeSpanishResult.snapshot);
        removeSpanishBeforeWithoutLanguages.cv.languages = '__TARGETED_LANGUAGE_FIELD__';
        removeSpanishAfterWithoutLanguages.cv.languages = '__TARGETED_LANGUAGE_FIELD__';
        assert.deepEqual(
            removeSpanishAfterWithoutLanguages,
            removeSpanishBeforeWithoutLanguages,
            'La suppression exacte a modifié une donnée hors LANGUES',
        );
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        const failedRemovalBefore = await evaluate(`
          (() => {
            cvForm.elements.languages.value = 'Français : langue maternelle\\nAnglais : niveau intermédiaire B1\\nItalien : niveau intermédiaire';
            clearEditableOverride('languages');
            renderLanguageEditor({ normalizeField: false });
            updateCvPreview({ preserveDensity: true });
            return getKirbyCvSnapshot();
          })()
        `);
        const failedRemovalRecoveryBefore = await evaluate(`({
          undoDepth: cvUndoStack.length,
          undoDisabled: cvUndoButton.disabled,
        })`);
        const failedRemovalResult = await submitKirbyCommand(REMOVE_MISSING_LANGUAGE_COMMAND, { timeoutMs: 4000 });
        assert.equal(failedRemovalResult.snapshot, failedRemovalBefore, 'Une suppression introuvable ne doit amorcer aucune mutation');
        assert.match(failedRemovalResult.reply, /introuvable|pas trouv|n.est pas présente|absente|déjà absente|inchang/i);
        assert.doesNotMatch(failedRemovalResult.reply, /annuler|réimport|restaur/i);
        assert.ok(failedRemovalResult.elapsedMs < 3000, `Refus de suppression trop lent : ${failedRemovalResult.elapsedMs} ms`);
        assert.equal(failedRemovalResult.requestInFlight, false);
        assert.equal(failedRemovalResult.hasPendingProposal, false);
        const failedRemovalRecoveryAfter = await evaluate(`({
          undoDepth: cvUndoStack.length,
          undoDisabled: cvUndoButton.disabled,
        })`);
        assert.deepEqual(
            failedRemovalRecoveryAfter,
            failedRemovalRecoveryBefore,
            'Une suppression introuvable ne doit créer aucun état Annuler/récupération',
        );
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        const validRemovalAfterFailure = await submitKirbyCommand(REMOVE_ITALIAN_COMMAND, { timeoutMs: 4000 });
        assert.equal(
            validRemovalAfterFailure.values.languages,
            'Français : langue maternelle\nAnglais : niveau intermédiaire B1',
            'Une commande valide doit fonctionner immédiatement après la suppression introuvable',
        );
        assert.match(validRemovalAfterFailure.reply, /langue.+supprim/i);
        assert.doesNotMatch(validRemovalAfterFailure.reply, /annuler|réimport|restaur|ambigu/i);
        assert.ok(validRemovalAfterFailure.elapsedMs < 3000, `Commande suivant le refus trop lente : ${validRemovalAfterFailure.elapsedMs} ms`);
        assert.equal(validRemovalAfterFailure.requestInFlight, false);
        assert.equal(validRemovalAfterFailure.hasPendingProposal, false);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        const canvaBefore = await evaluate(`
          (() => {
            const skills = cvForm.elements.skills;
            skills.value = ${JSON.stringify(ELISE_SKILLS.join('\n'))};
            clearEditableOverride('skills');
            updateCvPreview({ preserveDensity: true });
            return {
              snapshot: JSON.parse(getKirbyCvSnapshot()),
              botCount: document.querySelectorAll('#assistant-thread .assistant-thread-message.is-bot').length,
              compound: hasCompoundKirbyCvInstruction(${JSON.stringify(EXACT_CANVA_COMMAND)}),
              headline: getExplicitHeadlineFromInstruction(${JSON.stringify(EXACT_CANVA_COMMAND)}),
              compoundHeadline: getExplicitHeadlineFromInstruction('Remplace le titre par « Réceptionniste », puis ajoute une ligne intitulée « Canva » dans COMPÉTENCES.'),
              coordinatedHeadline: getExplicitHeadlineFromInstruction('Remplace le titre par « Réceptionniste » et ajoute une ligne intitulée « Canva » dans COMPÉTENCES.'),
              quotedActionWordHeadline: getExplicitHeadlineFromInstruction('Remplace le titre par « Strategy and Change Manager », puis ajoute une ligne intitulée « Canva » dans COMPÉTENCES.'),
              exactIntent: getExplicitSkillAdditionIntent(${JSON.stringify(EXACT_CANVA_COMMAND)}),
              alternateIntents: [
                getExplicitSkillAdditionIntent('Ajoute « Maîtrise de Canva » à la rubrique Compétences, sans toucher au reste.'),
                getExplicitSkillAdditionIntent('Dans mes compétences, insère une ligne : Maîtrise de Canva.'),
                getExplicitSkillAdditionIntent('Ajoute Maîtrise de Canva aux compétences.'),
                getExplicitSkillAdditionIntent('In SKILLS, add “Maîtrise de Canva”.'),
                getExplicitSkillAdditionIntent('Rubrique des compétences, ajoute « Maîtrise de Canva ».'),
                getExplicitSkillAdditionIntent('COMPÉTENCES : ajoute « Maîtrise de Canva ».'),
                getExplicitSkillAdditionIntent('SKILLS: add “Maîtrise de Canva”.'),
                getExplicitSkillAdditionIntent('Ajoute uniquement Maîtrise de Canva aux compétences.'),
              ],
              conjugatedIntents: [
                getExplicitSkillAdditionIntent('Dans la rubrique COMPÉTENCES, ajoutez « Maîtrise de Canva ».'),
                getExplicitSkillAdditionIntent('Dans mes compétences, insérez une ligne : Maîtrise de Canva.'),
              ],
              politeIntents: [
                getExplicitSkillAdditionIntent('Pourriez-vous ajouter « Maîtrise de Canva » à la rubrique COMPÉTENCES ?'),
                getExplicitSkillAdditionIntent('Could you add “Maîtrise de Canva” to SKILLS?'),
              ],
              negatedIntents: [
                getExplicitSkillAdditionIntent('N’ajoute pas « Maîtrise de Canva » dans COMPÉTENCES.'),
                getExplicitSkillAdditionIntent("N'ajoute pas « Maîtrise de Canva » dans COMPÉTENCES."),
                getExplicitSkillAdditionIntent('Ne rajoute pas « Maîtrise de Canva » dans COMPÉTENCES.'),
                getExplicitSkillAdditionIntent('Ne m’ajoute pas « Maîtrise de Canva » dans COMPÉTENCES.'),
                getExplicitSkillAdditionIntent('Je ne veux pas ajouter « Maîtrise de Canva » dans COMPÉTENCES.'),
                getExplicitSkillAdditionIntent('Je ne souhaite pas rajouter « Maîtrise de Canva » dans COMPÉTENCES.'),
                getExplicitSkillAdditionIntent('Do not add “Maîtrise de Canva” to SKILLS.'),
              ],
              hypotheticalIntents: [
                getExplicitSkillAdditionIntent('Que se passerait-il si tu ajoutais « Maîtrise de Canva » dans COMPÉTENCES ?'),
                getExplicitSkillAdditionIntent('Si j’ajoutais « Maîtrise de Canva » dans COMPÉTENCES, à quoi ressemblerait le CV ?'),
                getExplicitSkillAdditionIntent('Je pourrais ajouter « Maîtrise de Canva » dans COMPÉTENCES.'),
                getExplicitSkillAdditionIntent('I could add “Maîtrise de Canva” to SKILLS.'),
              ],
              questionIntents: [
                getExplicitSkillAdditionIntent('Pourquoi ajouter « Maîtrise de Canva » dans COMPÉTENCES ?'),
                getExplicitSkillAdditionIntent('Faut-il ajouter « Maîtrise de Canva » dans COMPÉTENCES ?'),
                getExplicitSkillAdditionIntent('Comment ajouter « Maîtrise de Canva » dans COMPÉTENCES ?'),
                getExplicitSkillAdditionIntent('How do I add “Maîtrise de Canva” to SKILLS?'),
              ],
              unrelatedRefusals: [
                getExplicitSkillAdditionIntent('N’ajoute pas cette expérience.'),
                getExplicitSkillAdditionIntent('I could add an experience.'),
              ],
              wrongSectionIntent: getExplicitSkillAdditionIntent('Dans FORMATION, ajoute « Bilan de compétences ».'),
              replaceIntent: getExplicitSkillAdditionIntent('Dans COMPÉTENCES, remplace « Excel » par « Maîtrise de Canva ».'),
              removeIntent: getExplicitSkillAdditionIntent('Dans COMPÉTENCES, supprime uniquement « Excel ».'),
              incompleteIntent: getExplicitSkillAdditionIntent('Ajoute une ligne dans COMPÉTENCES.'),
              genericValueIntent: getExplicitSkillAdditionIntent('Ajoutez une nouvelle ligne dans COMPÉTENCES.'),
              quotedWithoutIntent: getExplicitSkillAdditionIntent('Ajoute « Communication sans violence » dans COMPÉTENCES.'),
              noMutationFailure: getKirbyTransactionFailureMessage(Object.assign(
                new Error('kirby_cv_operation_transaction_failed'),
                { mutationStarted: false, rollbackPerformed: false },
              )),
            };
          })()
        `);
        assert.equal(canvaBefore.compound, false);
        assert.equal(canvaBefore.headline, '');
        assert.equal(canvaBefore.compoundHeadline, 'Réceptionniste');
        assert.equal(canvaBefore.coordinatedHeadline, 'Réceptionniste');
        assert.equal(canvaBefore.quotedActionWordHeadline, 'Strategy and Change Manager');
        assert.deepEqual(canvaBefore.exactIntent, { matched: true, value: 'Maîtrise de Canva' });
        canvaBefore.alternateIntents.forEach((intent) => {
            assert.deepEqual(intent, { matched: true, value: 'Maîtrise de Canva' });
        });
        canvaBefore.conjugatedIntents.forEach((intent) => {
            assert.deepEqual(intent, { matched: true, value: 'Maîtrise de Canva' });
        });
        canvaBefore.politeIntents.forEach((intent) => {
            assert.deepEqual(intent, { matched: true, value: 'Maîtrise de Canva' });
        });
        canvaBefore.negatedIntents.forEach((intent) => {
            assert.deepEqual(intent, { matched: true, value: '', refusalReason: 'negated' });
        });
        canvaBefore.hypotheticalIntents.forEach((intent) => {
            assert.deepEqual(intent, { matched: true, value: '', refusalReason: 'hypothetical' });
        });
        canvaBefore.questionIntents.forEach((intent) => {
            assert.deepEqual(intent, { matched: true, value: '', refusalReason: 'non_command' });
        });
        canvaBefore.unrelatedRefusals.forEach((intent) => {
            assert.equal(intent, null);
        });
        assert.equal(canvaBefore.wrongSectionIntent, null);
        assert.equal(canvaBefore.replaceIntent, null);
        assert.equal(canvaBefore.removeIntent, null);
        assert.deepEqual(canvaBefore.incompleteIntent, { matched: true, value: '' });
        assert.deepEqual(canvaBefore.genericValueIntent, { matched: true, value: '' });
        assert.deepEqual(canvaBefore.quotedWithoutIntent, { matched: true, value: 'Communication sans violence' });
        assert.doesNotMatch(canvaBefore.noMutationFailure, /ambigu|restaur/i);

        const canvaCommandResult = await submitKirbyCommand(EXACT_CANVA_COMMAND, { timeoutMs: 4000 });
        const canvaAfter = {
            ...canvaCommandResult,
            snapshot: JSON.parse(canvaCommandResult.snapshot),
            skills: canvaCommandResult.values.skills.split(/\n+/).filter(Boolean),
        };
        assert.deepEqual(canvaAfter.skills, [...ELISE_SKILLS, 'Maîtrise de Canva']);
        assert.deepEqual(canvaAfter.previewSkills, [...ELISE_SKILLS, 'Maîtrise de Canva']);
        assert.match(canvaAfter.reply, /Compétence ajoutée.+Maîtrise de Canva/is);
        assert.doesNotMatch(canvaAfter.reply, /ambigu|restaur/i);
        assert.ok(canvaAfter.elapsedMs < 3000, `Réponse déterministe trop lente : ${canvaAfter.elapsedMs} ms`);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports, 'La commande déterministe ne doit pas appeler /api/kirby-cv');

        const beforeWithoutSkill = structuredClone(canvaBefore.snapshot);
        const afterWithoutSkill = structuredClone(canvaAfter.snapshot);
        beforeWithoutSkill.cv.skills = '__TARGETED_SKILL_FIELD__';
        afterWithoutSkill.cv.skills = '__TARGETED_SKILL_FIELD__';
        assert.deepEqual(afterWithoutSkill, beforeWithoutSkill, 'Une donnée hors COMPÉTENCES a changé');

        const refusalBeforeSnapshot = await evaluate('getKirbyCvSnapshot()');
        const refusalAfter = await submitKirbyCommand('Ajoute une ligne dans COMPÉTENCES.', { timeoutMs: 4000 });
        assert.equal(refusalAfter.snapshot, refusalBeforeSnapshot);
        assert.match(refusalAfter.reply, /indiquez une seule compétence exacte/i);
        assert.doesNotMatch(refusalAfter.reply, /ambigu|restaur/i);
        assert.ok(refusalAfter.elapsedMs < 3000, `Refus déterministe trop lent : ${refusalAfter.elapsedMs} ms`);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports, 'Le refus déterministe ne doit pas appeler /api/kirby-cv');

        const skillAdditionSafety = await evaluate(`
          (() => {
            const field = cvForm.elements.skills;
            const previousValue = field.value;
            const hadOverride = Object.prototype.hasOwnProperty.call(cvEditableContent, 'skills');
            const previousOverride = hadOverride ? structuredClone(cvEditableContent.skills) : null;
            try {
              field.value = 'Maîtrise de Canva avancée\\nOutlook';
              cvEditableContent.skills = {
                html: '<li><strong>Maîtrise de Canva avancée</strong></li><li><em>Outlook personnalisé</em></li>',
                style: {},
              };
              updateCvPreview({ preserveDensity: true });
              const extendedReply = applyQuickExplicitSkillAddition(${JSON.stringify(EXACT_CANVA_COMMAND)});
              const extendedValues = field.value.split(/\\n+/).filter(Boolean);
              const preservedOverrideHtml = cvEditableContent.skills?.html || '';
              const preservedPreviewItems = [...document.querySelectorAll('#preview-skills > li')]
                .map((node) => node.textContent.trim());

              field.value = 'Excel\\nMaîtrise de Canva';
              delete cvEditableContent.skills;
              updateCvPreview({ preserveDensity: true });
              const noOpOperations = applyKirbyOperations([
                { type: 'add_skill', field: 'skills', value: 'Maîtrise de Canva' },
                { type: 'add_skill', field: 'skills', value: 'Maîtrise de Figma' },
              ], { instruction: ${JSON.stringify(EXACT_CANVA_COMMAND)} });
              const noOpFailureMessage = getKirbyTransactionFailureMessage(Object.assign(
                new Error('kirby_cv_operation_transaction_failed'),
                {
                  mutationStarted: noOpOperations.mutationStarted,
                  rollbackPerformed: noOpOperations.rollbackPerformed,
                },
              ));

              const protectedValue = field.value;
              const negatedReply = applyQuickExplicitSkillAddition('N’ajoute pas « Maîtrise de Figma » dans COMPÉTENCES.');
              const hypotheticalReply = applyQuickExplicitSkillAddition('Je pourrais ajouter « Maîtrise de Figma » dans COMPÉTENCES.');
              const questionReply = applyQuickExplicitSkillAddition('Pourquoi ajouter « Maîtrise de Figma » dans COMPÉTENCES ?');
              return {
                extendedReply,
                extendedValues,
                preservedOverrideHtml,
                preservedPreviewItems,
                noOpOperations: {
                  failed: noOpOperations.failed,
                  mutationStarted: noOpOperations.mutationStarted,
                  rollbackPerformed: noOpOperations.rollbackPerformed,
                },
                noOpFailureMessage,
                protectedValue,
                valueAfterProtectedRequests: field.value,
                negatedReply,
                hypotheticalReply,
                questionReply,
              };
            } finally {
              field.value = previousValue;
              if (hadOverride) {
                cvEditableContent.skills = previousOverride;
              } else {
                delete cvEditableContent.skills;
              }
              updateCvPreview({ preserveDensity: true });
            }
          })()
        `);
        assert.match(skillAdditionSafety.extendedReply, /Compétence ajoutée.+Maîtrise de Canva/is);
        assert.deepEqual(skillAdditionSafety.extendedValues, [
            'Maîtrise de Canva avancée',
            'Outlook',
            'Maîtrise de Canva',
        ]);
        assert.match(skillAdditionSafety.preservedOverrideHtml, /<strong>Maîtrise de Canva avancée<\/strong>/);
        assert.match(skillAdditionSafety.preservedOverrideHtml, /<em>Outlook personnalisé<\/em>/);
        assert.match(skillAdditionSafety.preservedOverrideHtml, /<li>Maîtrise de Canva<\/li>/);
        assert.deepEqual(skillAdditionSafety.preservedPreviewItems, [
            'Maîtrise de Canva avancée',
            'Outlook personnalisé',
            'Maîtrise de Canva',
        ]);
        assert.deepEqual(skillAdditionSafety.noOpOperations, {
            failed: true,
            mutationStarted: false,
            rollbackPerformed: false,
        });
        assert.doesNotMatch(skillAdditionSafety.noOpFailureMessage, /restaur/i);
        assert.equal(skillAdditionSafety.valueAfterProtectedRequests, skillAdditionSafety.protectedValue);
        assert.match(skillAdditionSafety.negatedReply, /indique de ne pas ajouter/i);
        assert.match(skillAdditionSafety.hypotheticalReply, /hypothèse/i);
        assert.match(skillAdditionSafety.questionReply, /pose une question/i);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports, 'Les refus locaux ne doivent pas appeler /api/kirby-cv');

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
        const skillsAfterReload = await evaluate(`cvForm.elements.skills.value.split(/\\n+/).filter(Boolean)`);
        assert.deepEqual(skillsAfterReload, [...ELISE_SKILLS, 'Maîtrise de Canva']);

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
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        await evaluate(`
          (() => {
            const source = ${JSON.stringify(frenchCvForTranslation)};
            const listFields = new Set(['skills', 'experience', 'projects', 'education', 'activities', 'languages']);
            const sourceByField = {
              ...source,
              experience: source.experiences,
            };
            delete sourceByField.experiences;
            Object.entries(sourceByField).forEach(([name, value]) => {
              if (!cvForm.elements[name]) return;
              cvForm.elements[name].value = listFields.has(name) && Array.isArray(value)
                ? value.join('\\n')
                : String(value || '');
            });
            if (cvForm.elements.jobTarget) cvForm.elements.jobTarget.value = source.headline;
            currentCvContentLocale = 'fr';
            clearEditableOverrides();
            renderExperienceEditor();
            renderLanguageEditor({ normalizeField: false });
            updateCvPreview({ preserveDensity: true });
            setKirbyMode('optimize');
            return true;
          })()
        `);
        const translationGuards = await evaluate(`
          (async () => {
            const beforeSnapshot = getKirbyCvSnapshot();
            const fallbackReply = await applyKirbyCvResult({
              cv: {
                documentLanguage: 'fr',
                extracted: ${JSON.stringify({
                    ...frenchCvForTranslation,
                    experiences: frenchCvForTranslation.experiences,
                    skills: frenchCvForTranslation.skills,
                    projects: frenchCvForTranslation.projects,
                    education: frenchCvForTranslation.education,
                    certifications: [],
                    activities: frenchCvForTranslation.activities,
                    languages: frenchCvForTranslation.languages,
                })},
                operations: [],
              },
            }, 'optimize', 'Remplace le CV en English.');
            return {
              englishLocale: getFullCvTranslationLocale('Remplace le CV en English.'),
              politeEnglishLocale: getFullCvTranslationLocale('Mettez le CV en anglais.'),
              collectiveEnglishLocale: getFullCvTranslationLocale('Traduisons le CV en anglais.'),
              languageBeforeWholeCvLocale: getFullCvTranslationLocale('Mets en anglais tout le CV.'),
              languageBeforeOwnedCvLocale: getFullCvTranslationLocale('Traduis en anglais mon CV.'),
              languageBeforeOwnedWholeCvLocale: getFullCvTranslationLocale('Translate to English my whole CV.'),
              putEnglishLocale: getFullCvTranslationLocale('Put my CV in English.'),
              englishVersionWithPrepositionLocale: getFullCvTranslationLocale('Je veux une version en anglais de mon CV.'),
              targetedProfileLocale: getFullCvTranslationLocale('Dans mon CV, traduis uniquement le profil en anglais.'),
              targetedProfileAfterActionLocale: getFullCvTranslationLocale('Traduis dans mon CV uniquement le profil en anglais.'),
              targetedProfileWithoutOnlyLocale: getFullCvTranslationLocale('Traduis le profil de mon CV en anglais.'),
              targetedSkillsWithoutOnlyLocale: getFullCvTranslationLocale('Traduis les compétences de mon CV en anglais.'),
              targetedDatesWithoutOnlyLocale: getFullCvTranslationLocale('Traduis les dates de mon CV en anglais.'),
              targetedProfileThenSaveLocale: getFullCvTranslationLocale('Traduis le profil en anglais puis sauvegarde mon CV.'),
              explanatoryTranslationLocale: getFullCvTranslationLocale('Comment traduire tout le CV en anglais ?'),
              permissionTranslationLocale: getFullCvTranslationLocale('Puis-je traduire tout le CV en anglais ?'),
              estCeTranslationLocale: getFullCvTranslationLocale('Est-ce que je peux traduire tout le CV en anglais ?'),
              politeTranslationLocale: getFullCvTranslationLocale('Pouvez-vous traduire tout le CV en anglais ?'),
              wholeCvBeforeActionLocale: getFullCvTranslationLocale('Dans mon CV, traduis tout en anglais.'),
              translationRoutesToApi: shouldUseKirbyCvAssistant('Traduis le CV en anglais.', 'optimize'),
              conversionRoutesToApi: shouldUseKirbyCvAssistant('Convertis mon CV en anglais.', 'optimize'),
              englishVersionRoutesToApi: shouldUseKirbyCvAssistant('Je veux une version anglaise de mon CV.', 'optimize'),
              serverMarkerLocale: getValidatedCvTranslationReplacementLocale({
                documentReplacement: { type: 'translation', complete: true, targetLanguage: 'en' },
              }),
              serverMarkerAppliesDirectly: shouldApplyKirbyResultDirectly({
                task: 'optimize',
                instruction: 'Localisez intégralement ce document.',
                result: { cv: { documentReplacement: { type: 'translation', complete: true, targetLanguage: 'en' } } },
              }),
              fallbackReply,
              beforeSnapshot,
              afterSnapshot: getKirbyCvSnapshot(),
              contentLocale: currentCvContentLocale,
            };
          })()
        `);
        assert.equal(translationGuards.englishLocale, 'en');
        assert.equal(translationGuards.politeEnglishLocale, 'en');
        assert.equal(translationGuards.collectiveEnglishLocale, 'en');
        assert.equal(translationGuards.languageBeforeWholeCvLocale, 'en');
        assert.equal(translationGuards.languageBeforeOwnedCvLocale, 'en');
        assert.equal(translationGuards.languageBeforeOwnedWholeCvLocale, 'en');
        assert.equal(translationGuards.putEnglishLocale, 'en');
        assert.equal(translationGuards.englishVersionWithPrepositionLocale, 'en');
        assert.equal(translationGuards.targetedProfileLocale, '');
        assert.equal(translationGuards.targetedProfileAfterActionLocale, '');
        assert.equal(translationGuards.targetedProfileWithoutOnlyLocale, '');
        assert.equal(translationGuards.targetedSkillsWithoutOnlyLocale, '');
        assert.equal(translationGuards.targetedDatesWithoutOnlyLocale, '');
        assert.equal(translationGuards.targetedProfileThenSaveLocale, '');
        assert.equal(translationGuards.explanatoryTranslationLocale, '');
        assert.equal(translationGuards.permissionTranslationLocale, '');
        assert.equal(translationGuards.estCeTranslationLocale, '');
        assert.equal(translationGuards.politeTranslationLocale, 'en');
        assert.equal(translationGuards.wholeCvBeforeActionLocale, 'en');
        assert.equal(translationGuards.translationRoutesToApi, true);
        assert.equal(translationGuards.conversionRoutesToApi, true);
        assert.equal(translationGuards.englishVersionRoutesToApi, true);
        assert.equal(translationGuards.serverMarkerLocale, 'en');
        assert.equal(translationGuards.serverMarkerAppliesDirectly, true);
        assert.equal(translationGuards.afterSnapshot, translationGuards.beforeSnapshot);
        assert.equal(translationGuards.contentLocale, 'fr');
        assert.match(translationGuards.fallbackReply, /n.a pas validé une traduction complète/i);
        assert.doesNotMatch(translationGuards.fallbackReply, /annuler|réimport|restaur/i);

        const translationQuestionSnapshot = await evaluate('getKirbyCvSnapshot()');
        const translationQuestionResult = await submitKirbyCommand(
            'Comment traduire tout le CV en anglais ?',
            { timeoutMs: 4000 },
        );
        assert.equal(translationQuestionResult.snapshot, translationQuestionSnapshot);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        const estCeTranslationQuestionSnapshot = await evaluate('getKirbyCvSnapshot()');
        const estCeTranslationQuestionResult = await submitKirbyCommand(
            'Est-ce que je peux traduire tout le CV en anglais ?',
            { timeoutMs: 4000 },
        );
        assert.equal(estCeTranslationQuestionResult.snapshot, estCeTranslationQuestionSnapshot);
        assert.equal(trace.kirbyApiCalls.length, kirbyApiCallCountAfterImports);

        const translationResult = await submitKirbyCommand(FULL_ENGLISH_TRANSLATION_COMMAND, { timeoutMs: 10000 });
        assert.equal(
            trace.kirbyApiCalls.length,
            kirbyApiCallCountAfterImports + 1,
            JSON.stringify({ translationResult, calls: trace.kirbyApiCalls.length, baseline: kirbyApiCallCountAfterImports }),
        );
        const translationRequest = JSON.parse(trace.kirbyApiCalls.at(-1));
        assert.equal(translationRequest.instruction, FULL_ENGLISH_TRANSLATION_COMMAND);
        assert.equal(translationRequest.documentLanguage, 'fr');
        assert.equal(translationRequest.cv.headline, frenchCvForTranslation.headline);
        assert.equal(translationResult.contentLocale, 'en', JSON.stringify(translationResult));
        assert.equal(translationResult.requestInFlight, false);
        assert.equal(translationResult.hasPendingProposal, false);
        assert.doesNotMatch(translationResult.reply, /annuler|réimport|restaur|proposition prête|non appliqu/i);
        assert.deepEqual(translationResult.sectionTitles, {
            summary: 'Profile',
            skills: 'Skills',
            experience: 'Professional experience',
            projects: 'Projects',
            education: 'Education & certifications',
            activities: 'Activities & interests',
            languages: 'Languages',
        });
        assert.deepEqual(translationResult.values, {
            fullName: completeEnglishTranslation.fullName,
            location: completeEnglishTranslation.location,
            phone: completeEnglishTranslation.phone,
            email: completeEnglishTranslation.email,
            permit: completeEnglishTranslation.permit,
            headline: completeEnglishTranslation.headline,
            summary: completeEnglishTranslation.summary,
            skills: completeEnglishTranslation.skills.join('\n'),
            experience: completeEnglishTranslation.experiences.join('\n'),
            projects: '',
            education: completeEnglishTranslation.education.join('\n'),
            activities: completeEnglishTranslation.activities.join('\n'),
            languages: 'French : Native\nEnglish : Intermediate B1',
        });
        assert.doesNotMatch(
            [
                translationResult.values.headline,
                translationResult.values.summary,
                translationResult.values.skills,
                translationResult.values.experience,
                translationResult.values.education,
                translationResult.values.activities,
            ].join('\n'),
            /Réceptionniste|Je suis|Gestion des réservations|Facturation|Transmission des consignes|Arrivées|Agente d’accueil|Accueil des visiteurs|Bac professionnel|Formation de premiers secours|Randonnée|Cinéma italien/i,
            'La traduction complète ne doit pas conserver une seconde version française des contenus traduisibles',
        );
        assert.match(translationResult.values.experience, /Hôtel Les Rives Dorées/);
        assert.match(translationResult.values.experience, /Espace Orbel/);
        assert.match(translationResult.values.experience, /2025/);
        assert.match(translationResult.values.experience, /2022/);
        assert.match(translationResult.values.experience, /2024/);
        assert.match(translationResult.values.education, /Lycée des Amandiers/);
        assert.match(translationResult.values.education, /Secours des Rives/);
        assert.match(translationResult.values.education, /2017/);
        assert.match(translationResult.values.education, /2024/);
    } finally {
        await cdp.send('Page.close').catch(() => {});
        cdp.close();
    }
});
