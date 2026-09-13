const kirbyHandler = require('./kirby');

const KIRBY_CV_AUTH_TIMEOUT_MS = 8000;
const KIRBY_CV_AUTH_RESPONSE_MAX_BYTES = 128 * 1024;
const KIRBY_CV_RATE_WINDOW_MS = 60 * 1000;
const KIRBY_CV_RATE_MAX_REQUESTS = 24;
const kirbyCvRateBuckets = new Map();

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

const sendJson = (response, statusCode, payload) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.end(JSON.stringify(payload));
};

const normalizeBearer = (headerValue) => {
    if (typeof headerValue !== 'string' || headerValue.length > 8192) return '';
    const match = headerValue.match(/^Bearer[ \t]+([^\s,]+)[ \t]*$/i);
    return match ? match[1] : '';
};

const getSupabaseUserUrl = () => {
    const configured = normalize(process.env.SUPABASE_URL);
    if (!configured) return '';

    try {
        const parsed = new URL(configured);
        const isLocal = parsed.protocol === 'http:'
            && ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
        if (parsed.protocol !== 'https:' && !isLocal) return '';
        parsed.pathname = `${parsed.pathname.replace(/\/$/, '')}/auth/v1/user`;
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString();
    } catch (_) {
        return '';
    }
};

const makeAuthError = (code, statusCode) => {
    const error = new Error(code);
    error.statusCode = statusCode;
    return error;
};

const authenticateKirbyCvRequest = async (request) => {
    const token = normalizeBearer(request && request.headers && request.headers.authorization);
    if (!token) throw makeAuthError('kirby_cv_auth_required', 401);

    const userUrl = getSupabaseUserUrl();
    const publicKey = normalize(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);
    if (!userUrl || !publicKey) throw makeAuthError('kirby_cv_auth_unavailable', 503);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), KIRBY_CV_AUTH_TIMEOUT_MS);
    let authResponse;
    try {
        authResponse = await fetch(userUrl, {
            method: 'GET',
            headers: {
                apikey: publicKey,
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            signal: controller.signal,
        });
    } catch (_) {
        throw makeAuthError('kirby_cv_auth_unavailable', 503);
    } finally {
        clearTimeout(timer);
    }

    if (authResponse.status === 401 || authResponse.status === 403) {
        throw makeAuthError('kirby_cv_auth_invalid', 401);
    }
    if (!authResponse.ok) throw makeAuthError('kirby_cv_auth_unavailable', 503);

    try {
        const contentLength = Number.parseInt(authResponse.headers?.get?.('content-length') || '0', 10);
        if (Number.isFinite(contentLength) && contentLength > KIRBY_CV_AUTH_RESPONSE_MAX_BYTES) {
            throw new Error('auth_response_too_large');
        }
        const rawUser = await authResponse.text();
        if (Buffer.byteLength(rawUser, 'utf8') > KIRBY_CV_AUTH_RESPONSE_MAX_BYTES) {
            throw new Error('auth_response_too_large');
        }
        const user = JSON.parse(rawUser);
        if (!user || typeof user.id !== 'string' || !user.id.trim()) {
            throw makeAuthError('kirby_cv_auth_invalid', 401);
        }
        return { id: user.id.trim() };
    } catch (error) {
        if (error && error.message === 'kirby_cv_auth_invalid') throw error;
        throw makeAuthError('kirby_cv_auth_unavailable', 503);
    }
};

const getRateLimitConfig = () => {
    const configured = Number.parseInt(process.env.KIRBY_CV_RATE_LIMIT_MAX || '', 10);
    return Number.isFinite(configured) && configured >= 1 && configured <= 120
        ? configured
        : KIRBY_CV_RATE_MAX_REQUESTS;
};

const consumeKirbyCvRateLimit = (userId, now = Date.now()) => {
    const limit = getRateLimitConfig();
    const current = kirbyCvRateBuckets.get(userId);
    const bucket = !current || now >= current.resetAt
        ? { count: 0, resetAt: now + KIRBY_CV_RATE_WINDOW_MS }
        : current;

    if (bucket.count >= limit) {
        return {
            allowed: false,
            limit,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }

    bucket.count += 1;
    kirbyCvRateBuckets.set(userId, bucket);
    if (kirbyCvRateBuckets.size > 1000) {
        for (const [key, value] of kirbyCvRateBuckets) {
            if (now >= value.resetAt) kirbyCvRateBuckets.delete(key);
        }
    }

    return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: 0,
    };
};

// La route CV partage les utilitaires historiques de Kirby, mais reste un
// service distinct : le handler principal utilise cette marque pour forcer le
// pipeline CV, même si un client envoie par erreur un autre `mode`.
module.exports = async (request, response) => {
    request.kirbyService = 'cv';

    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');

    if (request.method === 'POST') {
        let user;
        try {
            user = await authenticateKirbyCvRequest(request);
        } catch (error) {
            const statusCode = Number.isInteger(error && error.statusCode) ? error.statusCode : 503;
            if (statusCode === 401) {
                response.setHeader('WWW-Authenticate', 'Bearer realm="SA Creation Web KirbyCV"');
            }
            const invalid = error && error.message === 'kirby_cv_auth_invalid';
            return sendJson(response, statusCode, {
                ok: false,
                error: error && error.message ? error.message : 'kirby_cv_auth_unavailable',
                message: statusCode === 401
                    ? invalid
                        ? 'Votre session a expiré. Reconnectez-vous pour utiliser KirbyCV.'
                        : 'Connectez-vous à SA Création Web pour utiliser KirbyCV.'
                    : 'L’authentification de KirbyCV est momentanément indisponible.',
            });
        }

        const rate = consumeKirbyCvRateLimit(user.id);
        response.setHeader('X-RateLimit-Limit', String(rate.limit));
        response.setHeader('X-RateLimit-Remaining', String(rate.remaining));
        if (!rate.allowed) {
            response.setHeader('Retry-After', String(rate.retryAfterSeconds));
            return sendJson(response, 429, {
                ok: false,
                error: 'kirby_cv_rate_limited',
                message: 'KirbyCV reçoit trop de demandes. Patientez quelques secondes puis réessayez.',
            });
        }
        request.kirbyUser = user;
    }

    return kirbyHandler(request, response);
};

module.exports.authenticateKirbyCvRequest = authenticateKirbyCvRequest;
module.exports.consumeKirbyCvRateLimit = consumeKirbyCvRateLimit;
module.exports.resetKirbyCvRateLimitForTests = () => kirbyCvRateBuckets.clear();
