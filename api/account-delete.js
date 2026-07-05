const json = (response, statusCode, payload) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(payload));
};

const normalizeBearer = (headerValue) => {
    if (typeof headerValue !== 'string') {
        return '';
    }

    const match = headerValue.match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : '';
};

const fetchJson = async (url, options) => {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error('supabase_request_failed');
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
};

module.exports = async (request, response) => {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return json(response, 405, { error: 'method_not_allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const accessToken = normalizeBearer(request.headers.authorization);

    if (!supabaseUrl || !serviceRoleKey) {
        return json(response, 500, { error: 'missing_supabase_config' });
    }

    if (!accessToken) {
        return json(response, 401, { error: 'missing_access_token' });
    }

    const baseUrl = supabaseUrl.replace(/\/$/, '');

    try {
        const user = await fetchJson(`${baseUrl}/auth/v1/user`, {
            method: 'GET',
            headers: {
                apikey: serviceRoleKey,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!user?.id) {
            return json(response, 401, { error: 'invalid_user' });
        }

        const encodedUserId = encodeURIComponent(user.id);

        await fetch(`${baseUrl}/rest/v1/cv_drafts?user_id=eq.${encodedUserId}`, {
            method: 'DELETE',
            headers: {
                apikey: serviceRoleKey,
                Authorization: `Bearer ${serviceRoleKey}`,
            },
        });

        await fetchJson(`${baseUrl}/auth/v1/admin/users/${encodedUserId}`, {
            method: 'DELETE',
            headers: {
                apikey: serviceRoleKey,
                Authorization: `Bearer ${serviceRoleKey}`,
            },
        });

        return json(response, 200, { ok: true });
    } catch (error) {
        console.error('Account delete failed:', {
            status: error?.status,
            payload: error?.payload,
            message: error?.message,
        });
        return json(response, 502, { error: 'account_delete_failed' });
    }
};
