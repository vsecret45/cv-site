const crypto = require('crypto');

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const MAX_BODY_BYTES = 80 * 1024;
const MAX_SPEC_RESPONSE_BYTES = 1024 * 1024;
const MAX_IMAGE_RESPONSE_BYTES = 6 * 1024 * 1024;
const MAX_AUTH_RESPONSE_BYTES = 128 * 1024;
const FLYER_AUTH_TIMEOUT_MS = 8000;
const FLYER_IMAGE_TIMEOUT_DEFAULT_MS = 270000;
const FLYER_IMAGE_TIMEOUT_MIN_MS = 240000;
const FLYER_IMAGE_TIMEOUT_MAX_MS = 280000;

const FLYER_FORMATS = Object.freeze({
    a4: { label: 'A4 portrait', width: 2480, height: 3508, imageSize: '1024x1536', supportType: 'flyer' },
    a5: { label: 'A5 portrait', width: 1748, height: 2480, imageSize: '1024x1536', supportType: 'flyer' },
    'instagram-square': { label: 'Instagram carré', width: 1080, height: 1080, imageSize: '1024x1024', supportType: 'flyer' },
    story: { label: 'Story', width: 1080, height: 1920, imageSize: '1024x1536', supportType: 'flyer' },
    facebook: { label: 'Publication Facebook', width: 1200, height: 630, imageSize: '1536x1024', supportType: 'flyer' },
    linkedin: { label: 'Publication LinkedIn', width: 1200, height: 627, imageSize: '1536x1024', supportType: 'flyer' },
    'business-card': {
        label: 'Carte de visite recto 85 × 55 mm',
        width: 1004,
        height: 650,
        imageSize: '1536x1024',
        supportType: 'business-card',
    },
});

const FORMAT_ALIASES = Object.freeze({
    square: 'instagram-square',
    instagram: 'instagram-square',
    'instagram-post': 'instagram-square',
    'instagram-story': 'story',
    'facebook-post': 'facebook',
    'linkedin-post': 'linkedin',
    'carte-de-visite': 'business-card',
    'business-card-front': 'business-card',
});

const FLYER_SPEC_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['briefUnderstanding', 'artDirection', 'copy', 'contact'],
    properties: {
        briefUnderstanding: {
            type: 'object',
            additionalProperties: false,
            required: ['activity', 'audience', 'objective', 'offer', 'tone', 'mandatoryFacts', 'unknowns'],
            properties: {
                activity: { type: 'string' },
                audience: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
                objective: { type: 'string' },
                offer: { type: 'string' },
                tone: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
                mandatoryFacts: { type: 'array', items: { type: 'string' }, maxItems: 10 },
                unknowns: { type: 'array', items: { type: 'string' }, maxItems: 8 },
            },
        },
        artDirection: {
            type: 'object',
            additionalProperties: false,
            required: ['concept', 'rationale', 'layout', 'visualStyle', 'imagePrompt', 'negativePrompt', 'focalPoint', 'palette', 'typography'],
            properties: {
                concept: { type: 'string' },
                rationale: { type: 'string' },
                layout: {
                    type: 'string',
                    enum: ['classic-frame', 'poster-cut', 'editorial-impact', 'cinematic-split', 'kinetic-grid', 'luxury-focus', 'event-pulse'],
                },
                visualStyle: { type: 'string' },
                imagePrompt: { type: 'string' },
                negativePrompt: { type: 'string' },
                focalPoint: { type: 'string', enum: ['left', 'right', 'center', 'top', 'bottom'] },
                palette: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['background', 'surface', 'ink', 'muted', 'accent', 'accentInk'],
                    properties: {
                        background: { type: 'string' },
                        surface: { type: 'string' },
                        ink: { type: 'string' },
                        muted: { type: 'string' },
                        accent: { type: 'string' },
                        accentInk: { type: 'string' },
                    },
                },
                typography: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['display', 'body'],
                    properties: {
                        display: { type: 'string' },
                        body: { type: 'string' },
                    },
                },
            },
        },
        copy: {
            type: 'object',
            additionalProperties: false,
            required: ['eyebrow', 'headline', 'supporting', 'offer', 'cta', 'details', 'disclaimer'],
            properties: {
                eyebrow: { type: 'string' },
                headline: { type: 'string' },
                supporting: { type: 'string' },
                offer: { type: 'string' },
                cta: { type: 'string' },
                details: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 6,
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['label', 'value'],
                        properties: {
                            label: { type: 'string' },
                            value: { type: 'string' },
                        },
                    },
                },
                disclaimer: { type: 'string' },
            },
        },
        contact: {
            type: 'object',
            additionalProperties: false,
            required: ['phone', 'email', 'website', 'address', 'qrValue'],
            properties: {
                phone: { type: 'string' },
                email: { type: 'string' },
                website: { type: 'string' },
                address: { type: 'string' },
                qrValue: { type: 'string' },
            },
        },
    },
};

const FLYER_CREATIVE_SYSTEM_PROMPT = `Tu es Kirby Flyers, directeur artistique publicitaire et concepteur-rédacteur senior de SA Création Web.

Ta mission est de transformer un brief libre en un support publicitaire natif — flyer ou carte de visite — jamais en une page de site réduite. Comprends d'abord le métier, le public, l'offre et l'action attendue, puis crée un univers visuel propre à cette activité.

Pour un flyer, conçois un véritable support publicitaire adapté à son format. Pour une carte de visite, conçois dès le départ un recto natif au format 85 × 55 mm : ce n'est jamais un flyer recadré, réduit ou redimensionné.

Règles créatives non négociables :
- direction artistique actuelle, originale, crédible et immédiatement professionnelle ; spectaculaire seulement lorsque le métier s'y prête ;
- aucun modèle vieillot, aucune esthétique années 1960/1990/2000, aucun clipart, aucune banque d'images générique, aucun cadre WordPress, aucune grille de cartes répétitive ;
- ne recycle pas le même univers entre comptabilité, restauration, beauté, sport, artisanat ou technologie ;
- hiérarchie publicitaire forte : une accroche courte et mémorisable, un message secondaire bref, quelques informations essentielles et un seul appel à l'action principal ;
- titres élégants et maîtrisés : pas de phrase géante qui occupe tout le support, pas de découpe mot par mot, pas de répétition du CTA ou de la promesse ;
- classic-frame désigne une composition intemporelle, sobre et encadrée, jamais rétro ni vieillotte ;
- contraste lisible : jamais de texte clair sur fond clair, sombre sur sombre, ni de couleurs trop proches ;
- n'invente jamais un prix, une date, une adresse, une certification, un témoignage, un résultat, un numéro ou une coordonnée. Laisse les champs inconnus vides et signale-les dans unknowns ;
- pour la marque Velours Secret, le domaine officiel à afficher est exactement velourssecret.com, jamais velourssecret.fr ni une adresse avec www ;
- reprends fidèlement les faits fournis par l'utilisateur, sans duplication ;
- l'imagePrompt décrit uniquement le visuel sans typographie. Les titres, prix, coordonnées, CTA et QR seront ajoutés séparément par l'application.

Réponds uniquement avec le JSON conforme au schéma FlyerSpec.`;

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');
const compactText = (value, maxLength) => normalize(value).replace(/\s+/g, ' ').slice(0, maxLength);
const canonicalizeKnownWebsite = ({ activity, eyebrow, website }) => {
    const compactWebsite = compactText(website, 180);
    const identity = `${compactText(activity, 160)} ${compactText(eyebrow, 70)}`;
    const isVeloursSecret = /\bvelours[\s-]*secret\b/i.test(identity)
        || /^(?:https?:\/\/)?(?:www\.)?velourssecret\.(?:fr|com)(?:[/?#].*)?$/i.test(compactWebsite);
    return isVeloursSecret ? 'velourssecret.com' : compactWebsite;
};
const clampInteger = (value, fallback, min, max) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
};

const getFlyerImageTimeoutMs = (value = process.env.KIRBY_FLYER_IMAGE_TIMEOUT_MS) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return FLYER_IMAGE_TIMEOUT_DEFAULT_MS;
    return Math.min(FLYER_IMAGE_TIMEOUT_MAX_MS, Math.max(FLYER_IMAGE_TIMEOUT_MIN_MS, parsed));
};

const getRequestId = (request) => {
    const fromHeader = compactText(request && request.headers && request.headers['x-request-id'], 80);
    return /^[A-Za-z0-9._:-]{8,80}$/.test(fromHeader) ? fromHeader : crypto.randomUUID();
};

const normalizeBearer = (headerValue) => {
    if (typeof headerValue !== 'string' || headerValue.length > 8192) return '';
    const match = headerValue.match(/^Bearer[ \t]+([^\s,]+)[ \t]*$/i);
    return match ? match[1] : '';
};

const makeAuthError = (code, status = 401) => {
    const error = new Error(code);
    error.status = status;
    return error;
};

const getSupabaseAuthUrl = (value) => {
    const configured = normalize(value);
    if (!configured) return '';

    try {
        const parsed = new URL(configured);
        const localHttp = parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
        if (parsed.protocol !== 'https:' && !localHttp) return '';
        parsed.pathname = `${parsed.pathname.replace(/\/$/, '')}/auth/v1/user`;
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString();
    } catch (_) {
        return '';
    }
};

const authenticateFlyerRequest = async (request) => {
    const accessToken = normalizeBearer(request && request.headers && request.headers.authorization);
    if (!accessToken) throw makeAuthError('flyer_auth_required');

    const authUrl = getSupabaseAuthUrl(process.env.SUPABASE_URL);
    const anonKey = normalize(
        process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY
    );
    if (!authUrl || !anonKey) throw makeAuthError('flyer_auth_unavailable', 503);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FLYER_AUTH_TIMEOUT_MS);
    let authResponse;
    try {
        authResponse = await fetch(authUrl, {
            method: 'GET',
            headers: {
                apikey: anonKey,
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
            signal: controller.signal,
        });
    } catch (_) {
        throw makeAuthError('flyer_auth_unavailable', 503);
    } finally {
        clearTimeout(timer);
    }

    if (authResponse.status === 401 || authResponse.status === 403) {
        throw makeAuthError('flyer_auth_invalid');
    }
    if (!authResponse.ok) throw makeAuthError('flyer_auth_unavailable', 503);

    let rawUser = '';
    try {
        const contentLength = Number.parseInt(
            authResponse.headers && authResponse.headers.get
                ? authResponse.headers.get('content-length') || '0'
                : '0',
            10,
        );
        if (Number.isFinite(contentLength) && contentLength > MAX_AUTH_RESPONSE_BYTES) {
            throw new Error('flyer_auth_response_too_large');
        }
        rawUser = await authResponse.text();
        if (Buffer.byteLength(rawUser, 'utf8') > MAX_AUTH_RESPONSE_BYTES) {
            throw new Error('flyer_auth_response_too_large');
        }
        const user = JSON.parse(rawUser);
        if (!user || typeof user.id !== 'string' || !user.id.trim()) {
            throw makeAuthError('flyer_auth_invalid');
        }
        return { id: user.id.trim() };
    } catch (error) {
        if (error && error.message === 'flyer_auth_invalid') throw error;
        throw makeAuthError('flyer_auth_unavailable', 503);
    }
};

const getPublicAuthError = (error) => {
    if (error && error.message === 'flyer_auth_required') {
        return {
            statusCode: 401,
            error: 'flyer_auth_required',
            message: 'Connectez-vous à SA Création Web pour utiliser Kirby Flyers.',
        };
    }
    if (error && error.message === 'flyer_auth_invalid') {
        return {
            statusCode: 401,
            error: 'flyer_auth_invalid',
            message: 'Votre session a expiré ou n’est plus valide. Reconnectez-vous pour utiliser Kirby Flyers.',
        };
    }
    return {
        statusCode: 503,
        error: 'flyer_auth_unavailable',
        message: 'L’authentification de Kirby Flyers est momentanément indisponible. Réessayez dans quelques instants.',
    };
};

const normalizeFormat = (value) => {
    const requested = compactText(value, 40).toLowerCase();
    const canonical = FORMAT_ALIASES[requested] || requested;
    if (!requested) return 'a4';
    return FLYER_FORMATS[canonical] ? canonical : '';
};

const getSupportTypeForFormat = (format) =>
    FLYER_FORMATS[format] && FLYER_FORMATS[format].supportType === 'business-card'
        ? 'business-card'
        : 'flyer';

const json = (response, statusCode, payload) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.end(JSON.stringify(payload));
};

const getRequestHost = (request) => compactText(
    request && request.headers && (request.headers['x-forwarded-host'] || request.headers.host),
    255,
).split(',')[0].trim().toLowerCase();

const isAllowedOrigin = (request, origin) => {
    if (!origin) return true;

    const configured = normalize(process.env.FLYER_ALLOWED_ORIGINS)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    if (configured.includes(origin)) return true;

    try {
        return new URL(origin).host.toLowerCase() === getRequestHost(request);
    } catch (_) {
        return false;
    }
};

const applyCors = (request, response) => {
    const origin = compactText(request && request.headers && request.headers.origin, 512);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Request-Id');
    if (origin && isAllowedOrigin(request, origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }
    return !origin || isAllowedOrigin(request, origin);
};

const readBody = (request) => new Promise((resolve, reject) => {
    let body = '';
    let receivedBytes = 0;
    let settled = false;

    request.on('data', (chunk) => {
        if (settled) return;
        receivedBytes += Buffer.byteLength(chunk);
        if (receivedBytes > MAX_BODY_BYTES) {
            settled = true;
            const error = new Error('payload_too_large');
            error.status = 413;
            reject(error);
            return;
        }
        body += chunk.toString('utf8');
    });
    request.on('end', () => {
        if (!settled) {
            settled = true;
            resolve(body);
        }
    });
    request.on('error', (error) => {
        if (!settled) {
            settled = true;
            reject(error);
        }
    });
});

const readOpenAiJson = async (response, maxBytes) => {
    const contentLength = Number.parseInt(response.headers && response.headers.get
        ? response.headers.get('content-length') || '0'
        : '0', 10);
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        throw new Error('openai_response_too_large');
    }
    const raw = await response.text();
    if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
        throw new Error('openai_response_too_large');
    }
    try {
        return { payload: JSON.parse(raw), raw };
    } catch (_) {
        const error = new Error('openai_invalid_json');
        error.status = response.status;
        throw error;
    }
};

const fetchOpenAiJsonWithTimeout = async (url, options, timeoutMs, maxBytes) => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        const parsed = await readOpenAiJson(response, maxBytes);
        return { response, ...parsed };
    } catch (error) {
        if (timedOut) {
            const timeoutError = new Error('flyer_openai_timeout');
            timeoutError.name = 'TimeoutError';
            timeoutError.code = 'FLYER_OPENAI_TIMEOUT';
            timeoutError.timeoutMs = timeoutMs;
            throw timeoutError;
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
};

const isTimeoutError = (error) => {
    if (!error) return false;
    if (['AbortError', 'TimeoutError'].includes(error.name)) return true;
    if (['ABORT_ERR', 'ETIMEDOUT', 'FLYER_OPENAI_TIMEOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT'].includes(error.code)) {
        return true;
    }
    return error.cause && error.cause !== error ? isTimeoutError(error.cause) : false;
};

const getResponseText = (payload) => {
    if (normalize(payload && payload.output_text)) return normalize(payload.output_text);
    if (!Array.isArray(payload && payload.output)) return '';

    return payload.output
        .flatMap((item) => (Array.isArray(item && item.content) ? item.content : []))
        .filter((item) => item && (item.type === 'output_text' || typeof item.text === 'string'))
        .map((item) => normalize(item.text))
        .filter(Boolean)
        .join('\n');
};

const parseStructuredOutput = (payload) => {
    const refusal = Array.isArray(payload && payload.output)
        ? payload.output.flatMap((item) => (Array.isArray(item && item.content) ? item.content : []))
            .find((item) => item && item.type === 'refusal')
        : null;
    if (refusal) throw new Error('openai_response_refused');
    if (payload && payload.status === 'incomplete') throw new Error('openai_response_incomplete');
    if (payload && payload.status === 'failed') throw new Error('openai_response_failed');

    const content = getResponseText(payload);
    if (!content) throw new Error('openai_response_missing_output');

    try {
        return JSON.parse(content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
    } catch (_) {
        throw new Error('openai_response_invalid_spec');
    }
};

const asStringArray = (value, maxItems, maxLength) => (Array.isArray(value) ? value : [])
    .slice(0, maxItems)
    .map((item) => compactText(item, maxLength))
    .filter(Boolean);

const safeColor = (value, fallback) => {
    const color = compactText(value, 32);
    return /^(?:#[0-9a-f]{3,8}|rgb(?:a)?\([\d\s.,%]+\)|hsl(?:a)?\([\d\s.,%deg]+\))$/i.test(color)
        ? color
        : fallback;
};

const sanitizeFlyerSpec = (input) => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new Error('flyer_spec_invalid');
    }
    const understanding = input.briefUnderstanding || {};
    const direction = input.artDirection || {};
    const palette = direction.palette || {};
    const typography = direction.typography || {};
    const copy = input.copy || {};
    const contact = input.contact || {};
    const layout = ['classic-frame', 'poster-cut', 'editorial-impact', 'cinematic-split', 'kinetic-grid', 'luxury-focus', 'event-pulse'].includes(direction.layout)
        ? direction.layout
        : 'editorial-impact';
    const focalPoint = ['left', 'right', 'center', 'top', 'bottom'].includes(direction.focalPoint)
        ? direction.focalPoint
        : 'right';
    const details = (Array.isArray(copy.details) ? copy.details : [])
        .slice(0, 6)
        .map((item) => ({
            label: compactText(item && item.label, 60),
            value: compactText(item && item.value, 160),
        }))
        .filter((item) => item.label || item.value);

    const result = {
        briefUnderstanding: {
            activity: compactText(understanding.activity, 160),
            audience: asStringArray(understanding.audience, 5, 120),
            objective: compactText(understanding.objective, 200),
            offer: compactText(understanding.offer, 240),
            tone: asStringArray(understanding.tone, 5, 70),
            mandatoryFacts: asStringArray(understanding.mandatoryFacts, 10, 180),
            unknowns: asStringArray(understanding.unknowns, 8, 120),
        },
        artDirection: {
            concept: compactText(direction.concept, 180),
            rationale: compactText(direction.rationale, 420),
            layout,
            visualStyle: compactText(direction.visualStyle, 300),
            imagePrompt: compactText(direction.imagePrompt, 1800),
            negativePrompt: compactText(direction.negativePrompt, 700),
            focalPoint,
            palette: {
                background: safeColor(palette.background, '#0d1424'),
                surface: safeColor(palette.surface, '#18233a'),
                ink: safeColor(palette.ink, '#f7f8fb'),
                muted: safeColor(palette.muted, '#c2cad8'),
                accent: safeColor(palette.accent, '#5eead4'),
                accentInk: safeColor(palette.accentInk, '#071516'),
            },
            typography: {
                display: compactText(typography.display, 80) || 'modern geometric sans-serif',
                body: compactText(typography.body, 80) || 'neutral humanist sans-serif',
            },
        },
        copy: {
            eyebrow: compactText(copy.eyebrow, 70),
            headline: compactText(copy.headline, 120),
            supporting: compactText(copy.supporting, 260),
            offer: compactText(copy.offer, 180),
            cta: compactText(copy.cta, 55),
            details,
            disclaimer: compactText(copy.disclaimer, 240),
        },
        contact: {
            phone: compactText(contact.phone, 60),
            email: compactText(contact.email, 160),
            website: compactText(contact.website, 180),
            address: compactText(contact.address, 220),
            qrValue: compactText(contact.qrValue, 500),
        },
    };

    result.contact.website = canonicalizeKnownWebsite({
        activity: result.briefUnderstanding.activity,
        eyebrow: result.copy.eyebrow,
        website: result.contact.website,
    });

    if (!result.briefUnderstanding.activity || !result.artDirection.imagePrompt || !result.copy.headline || !result.copy.cta) {
        throw new Error('flyer_spec_missing_required_content');
    }
    if (!result.briefUnderstanding.audience.length || !result.briefUnderstanding.tone.length || details.length < 2) {
        throw new Error('flyer_spec_missing_required_content');
    }
    return result;
};

const buildSpecPrompt = ({ brief, format, revision, currentSpec }) => {
    const formatInfo = FLYER_FORMATS[format];
    const supportType = getSupportTypeForFormat(format);
    const supportInstruction = supportType === 'business-card'
        ? 'SUPPORT CARTE DE VISITE : conçois une composition de carte de visite native, pensée et conçue spécifiquement dès le départ pour un recto professionnel au format fini 85 × 55 mm. Cette carte de visite n’est jamais un flyer recadré, réduit ou redimensionné.'
        : 'SUPPORT FLYER : conçois une composition publicitaire native, pensée spécifiquement comme un véritable flyer immédiatement compréhensible, jamais comme une page de site réduite.';
    const creationInstruction = supportType === 'business-card'
        ? 'Crée une carte de visite recto complète, très concise et directement éditable : identité, activité, coordonnées et QR code uniquement s’il est fourni.'
        : 'Crée une proposition publicitaire complète, concise et directement éditable.';
    const parts = [
        `FORMAT CIBLE: ${formatInfo.label}, ratio ${formatInfo.width}:${formatInfo.height}.`,
        supportInstruction,
        `BRIEF UTILISATEUR:\n${brief}`,
        creationInstruction,
        'Le headline doit tenir idéalement sur 1 à 3 lignes sans typographie démesurée.',
        'Un seul CTA principal. Évite toute répétition de la même promesse ou du même bouton.',
        'Les couleurs du texte et du fond doivent avoir un contraste évident.',
        'Le prompt image doit décrire un cadrage adapté au ratio avec une zone utile pour superposer du texte DOM, sans produire une grande zone vide ou délavée.',
    ];
    if (revision) parts.push(`DEMANDE DE MODIFICATION:\n${revision}`);
    if (currentSpec) {
        const current = JSON.stringify(currentSpec).slice(0, 14000);
        parts.push(`PROPOSITION ACTUELLE À AMÉLIORER SANS PERDRE LES FAITS VALIDES:\n${current}`);
    }
    return parts.join('\n\n').slice(0, 28000);
};

const requestFlyerSpec = async ({ apiKey, brief, format, revision, currentSpec }) => {
    const model = compactText(process.env.KIRBY_FLYER_OPENAI_MODEL || 'gpt-5.5', 80) || 'gpt-5.5';
    const timeoutMs = clampInteger(process.env.KIRBY_FLYER_OPENAI_TIMEOUT_MS, 120000, 10000, 240000);
    const maxOutputTokens = clampInteger(process.env.KIRBY_FLYER_OPENAI_MAX_OUTPUT_TOKENS, 5000, 1500, 12000);
    const effort = ['low', 'medium', 'high'].includes(normalize(process.env.KIRBY_FLYER_OPENAI_REASONING_EFFORT).toLowerCase())
        ? normalize(process.env.KIRBY_FLYER_OPENAI_REASONING_EFFORT).toLowerCase()
        : 'low';
    const verbosity = ['low', 'medium', 'high'].includes(normalize(process.env.KIRBY_FLYER_OPENAI_VERBOSITY).toLowerCase())
        ? normalize(process.env.KIRBY_FLYER_OPENAI_VERBOSITY).toLowerCase()
        : 'low';
    const requestBody = {
        model,
        instructions: FLYER_CREATIVE_SYSTEM_PROMPT,
        input: buildSpecPrompt({ brief, format, revision, currentSpec }),
        store: false,
        stream: false,
        max_output_tokens: maxOutputTokens,
        reasoning: { effort },
        text: {
            verbosity,
            format: {
                type: 'json_schema',
                name: 'kirby_flyer_spec',
                strict: true,
                schema: FLYER_SPEC_SCHEMA,
            },
        },
    };
    const { response: openAiResponse, payload } = await fetchOpenAiJsonWithTimeout(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
    }, timeoutMs, MAX_SPEC_RESPONSE_BYTES);
    if (!openAiResponse.ok) {
        const error = new Error('openai_spec_request_failed');
        error.status = openAiResponse.status;
        throw error;
    }
    return { model, spec: sanitizeFlyerSpec(parseStructuredOutput(payload)) };
};

const buildImagePrompt = ({ spec, format, regenerationNote }) => {
    const direction = spec.artDirection;
    const understanding = spec.briefUnderstanding;
    const formatInfo = FLYER_FORMATS[format];
    const supportType = getSupportTypeForFormat(format);
    const openingInstruction = supportType === 'business-card'
        ? 'SUPPORT CARTE DE VISITE : composition dédiée, pensée et conçue nativement pour un recto professionnel au format fini 85 × 55 mm. Create one original premium background visual asset for this professional business card.'
        : 'Create one original premium advertising visual asset for a professional flyer.';
    const supportConstraint = supportType === 'business-card'
        ? 'This native carte de visite is never a flyer cropped, shrunk, resized, reduced, or repurposed into a business card.'
        : 'This is a native flyer composition, never a website page or interface reduced to print.';
    return [
        openingInstruction,
        supportConstraint,
        `Business or event context: ${understanding.activity}.`,
        `Audience and objective: ${understanding.audience.join(', ')}; ${understanding.objective}.`,
        `Creative concept: ${direction.concept}.`,
        `Visual direction: ${direction.visualStyle}.`,
        `Scene: ${direction.imagePrompt}.`,
        `Composition: ${formatInfo.label} (${formatInfo.width}:${formatInfo.height}), focal subject toward ${direction.focalPoint}, intentional negative space for editable application overlays, rich detail across the full frame.`,
        `Palette cues: ${Object.values(direction.palette).join(', ')}.`,
        regenerationNote ? `Requested visual adjustment: ${regenerationNote}.` : '',
        `Avoid: ${direction.negativePrompt}. Generic stock-photo look, dated advertising template, 1960s/1990s/2000s styling, clipart, website screenshot, UI, card grid, paper mockup, border, frame, empty washed-out surface.`,
        'ABSOLUTE HARD CONSTRAINT: no words, no letters, no typography, no numbers, no price, no logo, no brand mark, no signage, no label, no watermark, no QR code, no fake interface text anywhere in the image.',
        'The application will add all copy and contact information later as separate editable layers.',
    ].filter(Boolean).join('\n').slice(0, 3800);
};

const requestFlyerImage = async ({ apiKey, spec, format, regenerationNote }) => {
    const model = compactText(process.env.KIRBY_FLYER_IMAGE_MODEL || 'gpt-image-2', 80) || 'gpt-image-2';
    const timeoutMs = getFlyerImageTimeoutMs();
    const configuredQuality = normalize(process.env.KIRBY_FLYER_IMAGE_QUALITY || 'high').toLowerCase();
    const quality = ['low', 'medium', 'high', 'auto'].includes(configuredQuality) ? configuredQuality : 'high';
    const imageSize = FLYER_FORMATS[format].imageSize;
    const prompt = buildImagePrompt({ spec, format, regenerationNote });
    const { response: openAiResponse, payload } = await fetchOpenAiJsonWithTimeout(OPENAI_IMAGES_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            model,
            prompt,
            size: imageSize,
            quality,
            output_format: 'jpeg',
            output_compression: 86,
            n: 1,
        }),
    }, timeoutMs, MAX_IMAGE_RESPONSE_BYTES);
    if (!openAiResponse.ok) {
        const error = new Error('openai_image_request_failed');
        error.status = openAiResponse.status;
        throw error;
    }

    const firstImage = payload && Array.isArray(payload.data) ? payload.data[0] : null;
    const base64 = compactText(firstImage && firstImage.b64_json, MAX_IMAGE_RESPONSE_BYTES);
    const remoteUrl = compactText(firstImage && firstImage.url, 2000);
    if (base64 && /^[A-Za-z0-9+/=]+$/.test(base64)) {
        const [width, height] = imageSize.split('x').map(Number);
        return {
            model,
            image: {
                url: `data:image/jpeg;base64,${base64}`,
                mimeType: 'image/jpeg',
                width,
                height,
            },
        };
    }
    if (/^https:\/\//i.test(remoteUrl)) {
        const [width, height] = imageSize.split('x').map(Number);
        return { model, image: { url: remoteUrl, mimeType: 'image/jpeg', width, height } };
    }
    throw new Error('openai_image_missing_output');
};

const getPublicError = (error, mode) => {
    const status = error && Number.isInteger(error.status) ? error.status : 0;
    if (error && ['flyer_spec_invalid', 'flyer_spec_missing_required_content'].includes(error.message)) {
        return { statusCode: 400, error: 'flyer_spec_invalid', message: 'La maquette Flyers envoyée est incomplète ou invalide.' };
    }
    if (isTimeoutError(error) || status === 408 || status === 504) {
        return { statusCode: 504, error: 'flyer_generation_timeout', message: 'Kirby Flyers a mis trop de temps à répondre. Votre projet est conservé : vous pouvez relancer.' };
    }
    if (status === 401 || status === 403) {
        return { statusCode: 503, error: 'flyer_openai_auth_failed', message: 'La clé OpenAI dédiée aux flyers doit être vérifiée. Aucun autre générateur n’a été utilisé.' };
    }
    if (status === 429) {
        return { statusCode: 429, error: 'flyer_openai_rate_limited', message: 'Kirby Flyers reçoit trop de demandes pour le moment. Attendez quelques secondes puis relancez.' };
    }
    if (error && error.message === 'openai_response_refused') {
        return { statusCode: 422, error: 'flyer_request_refused', message: 'Kirby Flyers ne peut pas produire ce contenu. Reformulez la demande sans élément sensible.' };
    }
    return {
        statusCode: 503,
        error: mode === 'image' ? 'flyer_image_generation_unavailable' : 'flyer_spec_generation_unavailable',
        message: mode === 'image'
            ? 'Le visuel IA n’a pas été généré. La maquette et les textes restent disponibles : vous pouvez relancer uniquement l’image.'
            : 'Kirby Flyers n’a pas retourné de proposition exploitable. Aucun modèle de secours générique n’a remplacé la création IA.',
    };
};

module.exports = async (request, response) => {
    const requestId = getRequestId(request);
    const startedAt = Date.now();
    const corsAllowed = applyCors(request, response);

    if (!corsAllowed) {
        return json(response, 403, {
            ok: false,
            error: 'origin_not_allowed',
            message: 'Cette origine n’est pas autorisée à appeler Kirby Flyers.',
            generationMeta: { requestId, mode: 'unknown', status: 'rejected', provider: 'openai', elapsedMs: Date.now() - startedAt },
        });
    }

    if (request.method === 'OPTIONS') {
        response.statusCode = 204;
        response.end();
        return;
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
        response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS');
        if (request.method === 'HEAD') {
            response.statusCode = 200;
            response.end();
            return;
        }
        return json(response, 200, {
            ok: true,
            service: 'kirby-flyers',
            configured: Boolean(normalize(process.env.OPENAI_FLYER_API_KEY)),
            modes: ['spec', 'image'],
            supportTypes: ['flyer', 'business-card'],
            formats: Object.keys(FLYER_FORMATS),
        });
    }

    if (request.method !== 'POST') {
        response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS');
        return json(response, 405, { ok: false, error: 'method_not_allowed', message: 'Utilisez POST pour générer un flyer.' });
    }

    try {
        await authenticateFlyerRequest(request);
    } catch (error) {
        const publicError = getPublicAuthError(error);
        if (publicError.statusCode === 401) {
            response.setHeader('WWW-Authenticate', 'Bearer realm="SA Creation Web Flyers"');
        } else {
            console.error('Kirby Flyers authentication unavailable:', {
                requestId,
                code: error && error.message ? error.message : 'flyer_auth_unavailable',
                status: error && error.status ? error.status : undefined,
            });
        }
        return json(response, publicError.statusCode, {
            ok: false,
            error: publicError.error,
            message: publicError.message,
            generationMeta: {
                requestId,
                mode: 'unknown',
                status: publicError.statusCode === 401 ? 'rejected' : 'unavailable',
                provider: 'supabase',
                elapsedMs: Date.now() - startedAt,
            },
        });
    }

    let payload;
    try {
        const rawBody = await readBody(request);
        payload = JSON.parse(rawBody || '{}');
    } catch (error) {
        const tooLarge = error && error.message === 'payload_too_large';
        return json(response, tooLarge ? 413 : 400, {
            ok: false,
            error: tooLarge ? 'payload_too_large' : 'invalid_json',
            message: tooLarge ? 'La demande Flyers est trop volumineuse.' : 'La demande Flyers est invalide.',
            generationMeta: { requestId, mode: 'unknown', status: 'rejected', provider: 'openai', elapsedMs: Date.now() - startedAt },
        });
    }

    const mode = payload && payload.mode === 'image' ? 'image' : payload && payload.mode === 'spec' ? 'spec' : '';
    const format = normalizeFormat(payload && payload.format);
    if (!mode) {
        return json(response, 400, {
            ok: false,
            error: 'flyer_mode_invalid',
            message: 'Choisissez la création de maquette ou la génération du visuel.',
            generationMeta: { requestId, mode: 'unknown', status: 'rejected', provider: 'openai', format, elapsedMs: Date.now() - startedAt },
        });
    }
    if (!format) {
        return json(response, 400, {
            ok: false,
            error: 'flyer_format_invalid',
            message: 'Choisissez un format de flyer pris en charge.',
            generationMeta: { requestId, mode, status: 'rejected', provider: 'openai', elapsedMs: Date.now() - startedAt },
        });
    }

    const supportType = getSupportTypeForFormat(format);

    const apiKey = normalize(process.env.OPENAI_FLYER_API_KEY);
    if (!apiKey) {
        return json(response, 503, {
            ok: false,
            error: 'flyer_openai_key_missing',
            message: 'La clé OpenAI dédiée aux flyers n’est pas configurée. Le générateur de sites reste indépendant et n’est pas utilisé.',
            generationMeta: { requestId, mode, status: 'not-configured', provider: 'openai', format, supportType, elapsedMs: Date.now() - startedAt },
        });
    }

    try {
        if (mode === 'spec') {
            const brief = normalize(payload.brief).slice(0, 12000);
            const revision = normalize(payload.revision).slice(0, 4000);
            if (brief.length < 12) {
                return json(response, 400, {
                    ok: false,
                    error: 'flyer_brief_too_short',
                    message: 'Décrivez votre activité, votre offre ou votre événement avec un peu plus de précision.',
                    generationMeta: { requestId, mode, status: 'rejected', provider: 'openai', format, supportType, elapsedMs: Date.now() - startedAt },
                });
            }
            let currentSpec = null;
            if (payload.currentSpec && typeof payload.currentSpec === 'object') {
                try {
                    currentSpec = sanitizeFlyerSpec(payload.currentSpec);
                } catch (_) {
                    // Une ancienne maquette ou un brouillon partiel reste un contexte facultatif.
                    // La nouvelle proposition renvoyée par OpenAI conserve, elle, sa validation stricte.
                    currentSpec = null;
                }
            }
            const result = await requestFlyerSpec({ apiKey, brief, format, revision, currentSpec });
            return json(response, 200, {
                ok: true,
                source: 'openai',
                spec: result.spec,
                generationMeta: {
                    requestId,
                    mode,
                    status: 'generated',
                    provider: 'openai',
                    model: result.model,
                    decision: revision ? 'revise-flyer-spec' : 'create-flyer-spec',
                    format,
                    supportType,
                    elapsedMs: Date.now() - startedAt,
                },
            });
        }

        const spec = sanitizeFlyerSpec(payload.spec);
        const regenerationNote = normalize(payload.regenerationNote).slice(0, 800);
        const result = await requestFlyerImage({ apiKey, spec, format, regenerationNote });
        return json(response, 200, {
            ok: true,
            source: 'openai-image',
            image: result.image,
            generationMeta: {
                requestId,
                mode,
                status: 'generated',
                provider: 'openai',
                model: result.model,
                decision: regenerationNote ? 'regenerate-flyer-visual' : 'create-flyer-visual',
                format,
                supportType,
                elapsedMs: Date.now() - startedAt,
            },
        });
    } catch (error) {
        const publicError = getPublicError(error, mode);
        console.error('Kirby Flyers OpenAI failed:', {
            requestId,
            mode,
            code: error && error.message ? error.message : 'flyer_generation_failed',
            status: error && error.status ? error.status : undefined,
        });
        return json(response, publicError.statusCode, {
            ok: false,
            error: publicError.error,
            message: publicError.message,
            generationMeta: {
                requestId,
                mode,
                status: 'failed',
                provider: 'openai',
                format,
                supportType,
                elapsedMs: Date.now() - startedAt,
            },
        });
    }
};

module.exports.FLYER_SPEC_SCHEMA = FLYER_SPEC_SCHEMA;
module.exports.FLYER_FORMATS = FLYER_FORMATS;
module.exports.getSupportTypeForFormat = getSupportTypeForFormat;
module.exports.buildImagePrompt = buildImagePrompt;
module.exports.sanitizeFlyerSpec = sanitizeFlyerSpec;
module.exports.getFlyerImageTimeoutMs = getFlyerImageTimeoutMs;
module.exports.isTimeoutError = isTimeoutError;
module.exports.normalizeBearer = normalizeBearer;
module.exports.authenticateFlyerRequest = authenticateFlyerRequest;
module.exports.canonicalizeKnownWebsite = canonicalizeKnownWebsite;
