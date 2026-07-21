import assert from 'node:assert/strict';
import test from 'node:test';

const CDP_PORT = Number(process.env.CV_TEST_CDP_PORT || process.env.CDP_PORT || 9223);
const PAGE_URL = process.env.CV_TEST_PAGE_URL || 'http://127.0.0.1:8097/cv.html';
const COMMAND = 'Déplace Développement web — depuis 2023 sous Machiniste-receveur et au-dessus des expériences plus anciennes';

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
            trace.kirbyApiCalls.push(params.request.postData || '');
            await cdp.send('Fetch.fulfillRequest', {
                requestId: params.requestId,
                responseCode: 200,
                responseHeaders: [{ name: 'content-type', value: 'application/json' }],
                body: toBase64(JSON.stringify({ reply: 'Aucune modification API appliquée dans le test.' })),
            });
            return;
        }

        await cdp.send('Fetch.continueRequest', { requestId: params.requestId });
    });

    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
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
                return {
                  auth: {
                    async getSession() { return { data: { session: { user } }, error: null }; },
                    onAuthStateChange(callback) {
                      setTimeout(() => callback('SIGNED_IN', { user }), 0);
                      return { data: { subscription: { unsubscribe() {} } } };
                    },
                    async signOut() { return { error: null }; },
                    async signInWithPassword() { return { data: { session: { user }, user }, error: null }; },
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
            if ((state.writes || []).some((write) => JSON.stringify(write.order) === JSON.stringify(expectedOrder))) {
                break;
            }
        }

        const afterCommand = await evaluate(inspectExpression);
        assert.deepEqual(afterCommand.formOrder, expectedOrder);
        assert.deepEqual(afterCommand.domOrder, expectedOrder);

        await cdp.send('Page.reload', { ignoreCache: true });
        await cdp.waitFor('Page.loadEventFired', () => true, 20000);
        await delay(1000);

        const afterReload = await evaluate(inspectExpression);
        const state = await evaluate(`JSON.parse(JSON.stringify(window.__KIRBY_E2E_STATE))`);
        const writeOrders = (state.writes || []).map((write) => write.order);
        const readOrders = (state.reads || []).map((read) => read.order);
        const localOrders = (state.localWrites || []).map((write) => write.order);

        assert.deepEqual(writeOrders.at(-1), expectedOrder);
        assert.deepEqual(readOrders.at(-1), expectedOrder);
        assert.deepEqual(localOrders.at(-1), expectedOrder);
        assert.deepEqual(afterReload.formOrder, expectedOrder);
        assert.deepEqual(afterReload.domOrder, expectedOrder);
        assert.match(afterReload.formValue, /Machiniste-receveur - RATP, Paris - 2024 - 2025/);
        assert.match(afterReload.formValue, /Développement web - Projets autodidactes - depuis 2023/);
        assert.equal(trace.kirbyApiCalls.length, 0);
    } finally {
        await cdp.send('Page.close').catch(() => {});
        cdp.close();
    }
});
