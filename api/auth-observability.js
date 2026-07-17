const SIGNUP_ALERT_WINDOW_MS = Number.parseInt(process.env.SIGNUP_422_ALERT_WINDOW_MS || `${5 * 60 * 1000}`, 10);
const SIGNUP_422_ALERT_THRESHOLD = Number.parseFloat(process.env.SIGNUP_422_ALERT_THRESHOLD || '0.05');
const SIGNUP_422_ALERT_MIN_ATTEMPTS = Number.parseInt(process.env.SIGNUP_422_ALERT_MIN_ATTEMPTS || '20', 10);
const MAX_BODY_BYTES = 32 * 1024;

const signupWindowEvents = [];

const json = (response, status, payload) => {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    });
    response.end(JSON.stringify(payload));
};

const truncate = (value, maxLength = 500) => String(value || '').slice(0, maxLength);

const sanitizeFingerprint = (fingerprint = {}) => ({
    user_agent: truncate(fingerprint.user_agent, 300),
    language: truncate(fingerprint.language, 40),
    platform: truncate(fingerprint.platform, 80),
    timezone: truncate(fingerprint.timezone, 80),
    viewport: truncate(fingerprint.viewport, 40),
    screen: truncate(fingerprint.screen, 40),
    device_pixel_ratio: fingerprint.device_pixel_ratio || null,
    hardware_concurrency: fingerprint.hardware_concurrency || null,
    device_memory: fingerprint.device_memory || null,
    online: typeof fingerprint.online === 'boolean' ? fingerprint.online : null,
});

const sanitizeSignupEvent = (payload = {}) => ({
    event: payload.event === 'signup_failed' ? 'signup_failed' : 'signup_attempt',
    component: 'auth_signup',
    request_id: truncate(payload.request_id, 120),
    supabase_request_id: truncate(payload.supabase_request_id, 120),
    incident_code: truncate(payload.incident_code, 80),
    status: Number.isFinite(Number(payload.status)) ? Number(payload.status) : null,
    supabase_error_code: truncate(payload.supabase_error_code, 120),
    supabase_error_message: truncate(payload.supabase_error_message, 500),
    browser_fingerprint: sanitizeFingerprint(payload.browser_fingerprint || {}),
    received_at: new Date().toISOString(),
});

const pruneSignupWindow = (now) => {
    const windowStart = now - SIGNUP_ALERT_WINDOW_MS;

    while (signupWindowEvents.length && signupWindowEvents[0].at < windowStart) {
        signupWindowEvents.shift();
    }
};

const recordSignupEvent = (event) => {
    if (event.event !== 'signup_attempt' && event.event !== 'signup_failed') {
        return;
    }

    const now = Date.now();
    signupWindowEvents.push({
        at: now,
        event: event.event,
        status: event.status,
        supabase_error_code: event.supabase_error_code,
    });
    pruneSignupWindow(now);

    const attempts = signupWindowEvents.filter((entry) => entry.event === 'signup_attempt').length;
    const failures422 = signupWindowEvents.filter((entry) =>
        entry.event === 'signup_failed' &&
        entry.status === 422 &&
        !String(entry.supabase_error_code || '').startsWith('local_validation_')
    ).length;
    const rate = attempts > 0 ? failures422 / attempts : 0;

    if (attempts >= SIGNUP_422_ALERT_MIN_ATTEMPTS && rate > SIGNUP_422_ALERT_THRESHOLD) {
        console.warn(JSON.stringify({
            event: 'signup_422_rate_alert',
            component: 'auth_signup',
            window_ms: SIGNUP_ALERT_WINDOW_MS,
            threshold: SIGNUP_422_ALERT_THRESHOLD,
            attempts,
            signup_422_failures: failures422,
            signup_422_rate: Number(rate.toFixed(4)),
            emitted_at: new Date().toISOString(),
        }));
    }
};

const readRequestBody = (request) => new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
        body += chunk;

        if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
            reject(new Error('payload_too_large'));
            request.destroy();
        }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
});

module.exports = async function authObservabilityHandler(request, response) {
    if (request.method !== 'POST') {
        response.writeHead(405, { Allow: 'POST' });
        response.end('Method not allowed');
        return;
    }

    try {
        const body = await readRequestBody(request);
        const payload = body ? JSON.parse(body) : {};
        const event = sanitizeSignupEvent(payload);

        console.log(JSON.stringify(event));
        recordSignupEvent(event);
        json(response, 202, { ok: true });
    } catch (error) {
        if (error?.message === 'payload_too_large') {
            json(response, 413, { error: 'payload_too_large' });
            return;
        }

        json(response, 400, { error: 'invalid_signup_observability_payload' });
    }
};
