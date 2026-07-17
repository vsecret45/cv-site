(function attachAuthSignupUtils(root, factory) {
    const utils = factory(root);

    if (typeof module === 'object' && module.exports) {
        module.exports = utils;
    }

    root.AuthSignupUtils = utils;
})(typeof globalThis !== 'undefined' ? globalThis : this, (root) => {
    'use strict';

    const MIN_PASSWORD_LENGTH = 6;
    const SIGNUP_REQUEST_TIMEOUT_MS = 20000;
    const GENERIC_SIGNUP_ERROR = 'Inscription impossible pour le moment. Réessayez.';
    const SIGNUP_TIMEOUT_MESSAGE = 'La demande prend trop de temps. Réessayez sans recharger la page.';
    const SIGNUP_NETWORK_MESSAGE = 'Connexion au service d’inscription impossible. Vérifiez votre connexion puis réessayez.';
    const EMAIL_ALREADY_REGISTERED_MESSAGE = 'Cette adresse est déjà inscrite mais n’a pas encore été confirmée. Renvoyer l’e-mail de confirmation.';
    const INVALID_EMAIL_MESSAGE = 'Adresse email invalide. Vérifiez le format saisi.';
    const INVALID_PASSWORD_MESSAGE = `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
    const REQUIRED_FIELDS_MESSAGE = 'Tous les champs sont obligatoires.';
    const PASSWORD_CONFIRMATION_MESSAGE = 'La confirmation ne correspond pas.';

    const normalizeForMatch = (value = '') =>
        String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

    const normalizeAccountEmail = (value = '') => String(value).trim().toLowerCase();

    const isValidEmail = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const parseStatus = (error) => {
        const rawStatus = error?.status ?? error?.statusCode ?? error?.httpStatus ?? error?.response?.status;
        const status = Number.parseInt(String(rawStatus || ''), 10);
        return Number.isFinite(status) ? status : null;
    };

    const readHeader = (headers, headerName) => {
        if (!headers) {
            return '';
        }

        if (typeof headers.get === 'function') {
            return headers.get(headerName) || headers.get(headerName.toLowerCase()) || '';
        }

        return headers[headerName] || headers[headerName.toLowerCase()] || '';
    };

    const extractSupabaseRequestId = (error) =>
        String(
            error?.requestId ||
            error?.request_id ||
            error?.requestID ||
            error?.xRequestId ||
            error?.supabaseRequestId ||
            readHeader(error?.headers, 'x-request-id') ||
            readHeader(error?.headers, 'x-supabase-request-id') ||
            readHeader(error?.response?.headers, 'x-request-id') ||
            readHeader(error?.response?.headers, 'x-supabase-request-id') ||
            ''
        ).trim();

    const getSupabaseErrorDetails = (error) => {
        const message = String(error?.message || error?.error_description || error?.msg || error?.name || '').trim();
        const code = String(error?.code || error?.error_code || error?.error || '').trim();

        return {
            message,
            status: parseStatus(error),
            code,
            requestId: extractSupabaseRequestId(error),
        };
    };

    const createSignupRequestId = () => {
        if (root.crypto?.randomUUID) {
            return root.crypto.randomUUID();
        }

        return `signup-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    };

    const createIncidentCode = (requestId = '') => {
        const compactId = String(requestId).replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase();
        return `SIGNUP-${compactId || Date.now().toString(36).toUpperCase()}`;
    };

    const mapAuthErrorToSignupFeedback = (error, options = {}) => {
        const details = getSupabaseErrorDetails(error);
        const normalizedMessage = normalizeForMatch(details.message);
        const normalizedCode = normalizeForMatch(details.code);
        const sourceLooksAlreadyRegistered =
            /user already registered|already registered|already exists|email address is already|email.*already|user.*exists|duplicate/.test(normalizedMessage) ||
            /user.*already|already.*registered|email.*exists|user.*exists|duplicate/.test(normalizedCode);
        const sourceLooksInvalidEmail = /email/.test(normalizedMessage) && /invalid|valid|format/.test(normalizedMessage);
        const sourceLooksInvalidPassword =
            (/password/.test(normalizedMessage) || /password/.test(normalizedCode)) &&
            /short|weak|least|minimum|min|length|character|invalid/.test(`${normalizedMessage} ${normalizedCode}`);
        const sourceLooksTimeout = /timeout|timed out|trop de temps/.test(`${normalizedMessage} ${normalizedCode}`);
        const sourceLooksNetwork = /network|fetch|failed to fetch|load failed|connection|cors/.test(`${normalizedMessage} ${normalizedCode}`);
        const effectiveStatus = details.status || (sourceLooksAlreadyRegistered || sourceLooksInvalidEmail || sourceLooksInvalidPassword ? 422 : null);
        const statusIsValidation = effectiveStatus === 422 || effectiveStatus === 400 || effectiveStatus === null;
        const mappedDetails = {
            ...details,
            status: effectiveStatus,
        };

        if (sourceLooksAlreadyRegistered && effectiveStatus === 422) {
            return {
                message: EMAIL_ALREADY_REGISTERED_MESSAGE,
                incidentCode: null,
                needsConfirmationResend: true,
                details: mappedDetails,
            };
        }

        if (statusIsValidation && sourceLooksInvalidEmail) {
            return {
                message: INVALID_EMAIL_MESSAGE,
                incidentCode: null,
                details: mappedDetails,
            };
        }

        if (statusIsValidation && sourceLooksInvalidPassword) {
            return {
                message: INVALID_PASSWORD_MESSAGE,
                incidentCode: null,
                details: mappedDetails,
            };
        }

        if (sourceLooksTimeout) {
            const incidentCode = createIncidentCode(options.requestId || details.requestId);

            return {
                message: `${SIGNUP_TIMEOUT_MESSAGE} Code incident : ${incidentCode}`,
                incidentCode,
                details: mappedDetails,
            };
        }

        if (sourceLooksNetwork) {
            const incidentCode = createIncidentCode(options.requestId || details.requestId);

            return {
                message: `${SIGNUP_NETWORK_MESSAGE} Code incident : ${incidentCode}`,
                incidentCode,
                details: mappedDetails,
            };
        }

        const incidentCode = createIncidentCode(options.requestId || details.requestId);

        return {
            message: `${GENERIC_SIGNUP_ERROR} Code incident : ${incidentCode}`,
            incidentCode,
            details: mappedDetails,
        };
    };

    const validateSignupInput = (fields = {}) => {
        const name = String(fields.name || '').trim();
        const email = normalizeAccountEmail(fields.email || '');
        const password = String(fields.password || '');
        const confirmPassword = String(fields.confirmPassword || '');

        if (!name || !email || !password || !confirmPassword) {
            return {
                ok: false,
                status: 422,
                code: 'local_validation_required_fields',
                message: REQUIRED_FIELDS_MESSAGE,
            };
        }

        if (!isValidEmail(email)) {
            return {
                ok: false,
                status: 422,
                code: 'local_validation_email',
                message: INVALID_EMAIL_MESSAGE,
            };
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            return {
                ok: false,
                status: 422,
                code: 'local_validation_password',
                message: INVALID_PASSWORD_MESSAGE,
            };
        }

        if (password !== confirmPassword) {
            return {
                ok: false,
                status: 422,
                code: 'local_validation_password_confirmation',
                message: PASSWORD_CONFIRMATION_MESSAGE,
            };
        }

        return {
            ok: true,
            value: {
                name,
                email,
                password,
            },
        };
    };

    const getBrowserFingerprint = () => {
        const navigatorRef = root.navigator || {};
        const screenRef = root.screen || {};
        let timezone = '';

        try {
            timezone = root.Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '';
        } catch (_error) {
            timezone = '';
        }

        return {
            user_agent: navigatorRef.userAgent || '',
            language: navigatorRef.language || '',
            platform: navigatorRef.platform || '',
            timezone,
            viewport: `${root.innerWidth || 0}x${root.innerHeight || 0}`,
            screen: `${screenRef.width || 0}x${screenRef.height || 0}`,
            device_pixel_ratio: root.devicePixelRatio || 1,
            hardware_concurrency: navigatorRef.hardwareConcurrency || null,
            device_memory: navigatorRef.deviceMemory || null,
            online: typeof navigatorRef.onLine === 'boolean' ? navigatorRef.onLine : null,
        };
    };

    const emitSignupEvent = (logAuthEvent, payload) => {
        if (typeof logAuthEvent !== 'function') {
            return;
        }

        logAuthEvent(payload);
    };

    const withSignupTimeout = (operation, timeoutMs, requestId) => new Promise((resolve, reject) => {
        let settled = false;
        const timeout = root.setTimeout(() => {
            if (settled) {
                return;
            }

            settled = true;
            const error = new Error('Signup request timed out');
            error.code = 'signup_request_timeout';
            error.requestId = requestId;
            reject(error);
        }, timeoutMs);

        Promise.resolve()
            .then(operation)
            .then((value) => {
                if (settled) {
                    return;
                }

                settled = true;
                root.clearTimeout(timeout);
                resolve(value);
            })
            .catch((error) => {
                if (settled) {
                    return;
                }

                settled = true;
                root.clearTimeout(timeout);
                reject(error);
            });
    });

    const submitSignup = async ({
        fields,
        signUp,
        logAuthEvent,
        emailRedirectTo = '',
        requestIdFactory = createSignupRequestId,
        browserFingerprintFactory = getBrowserFingerprint,
        timeoutMs = SIGNUP_REQUEST_TIMEOUT_MS,
    } = {}) => {
        if (typeof signUp !== 'function') {
            throw new TypeError('signUp callback is required');
        }

        const requestId = requestIdFactory();
        const browserFingerprint = browserFingerprintFactory();
        const baseEvent = {
            request_id: requestId,
            browser_fingerprint: browserFingerprint,
        };

        emitSignupEvent(logAuthEvent, {
            ...baseEvent,
            event: 'signup_attempt',
        });

        const validation = validateSignupInput(fields);

        if (!validation.ok) {
            const incidentCode = createIncidentCode(requestId);

            emitSignupEvent(logAuthEvent, {
                ...baseEvent,
                event: 'signup_failed',
                status: validation.status,
                supabase_error_code: validation.code,
                supabase_error_message: validation.message,
                incident_code: incidentCode,
            });

            return {
                ok: false,
                type: 'validation',
                requestId,
                incidentCode,
                feedback: validation.message,
                validation,
            };
        }

        const payload = {
            email: validation.value.email,
            password: validation.value.password,
            options: {
                data: {
                    name: validation.value.name,
                },
                ...(emailRedirectTo ? { emailRedirectTo } : {}),
            },
        };

        let response;

        try {
            response = await withSignupTimeout(() => signUp(payload), timeoutMs, requestId);
        } catch (error) {
            response = { error };
        }

        if (response?.error) {
            const mapped = mapAuthErrorToSignupFeedback(response.error, { requestId });
            const details = mapped.details;

            emitSignupEvent(logAuthEvent, {
                ...baseEvent,
                event: 'signup_failed',
                status: details.status,
                supabase_error_code: details.code,
                supabase_error_message: details.message,
                supabase_request_id: details.requestId,
                incident_code: mapped.incidentCode,
            });

            return {
                ok: false,
                type: 'supabase',
                requestId,
                incidentCode: mapped.incidentCode,
                needsConfirmationResend: Boolean(mapped.needsConfirmationResend),
                feedback: mapped.message,
                error: response.error,
                errorDetails: details,
            };
        }

        return {
            ok: true,
            requestId,
            data: response?.data,
            sanitized: validation.value,
            signUpPayload: payload,
        };
    };

    return {
        MIN_PASSWORD_LENGTH,
        SIGNUP_REQUEST_TIMEOUT_MS,
        GENERIC_SIGNUP_ERROR,
        SIGNUP_TIMEOUT_MESSAGE,
        SIGNUP_NETWORK_MESSAGE,
        EMAIL_ALREADY_REGISTERED_MESSAGE,
        INVALID_EMAIL_MESSAGE,
        INVALID_PASSWORD_MESSAGE,
        normalizeAccountEmail,
        validateSignupInput,
        getSupabaseErrorDetails,
        mapAuthErrorToSignupFeedback,
        createSignupRequestId,
        createIncidentCode,
        getBrowserFingerprint,
        submitSignup,
    };
});
