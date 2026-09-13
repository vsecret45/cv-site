const json = (response, statusCode, payload) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(payload));
};

module.exports = async (request, response) => {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return json(response, 405, { error: 'method_not_allowed' });
    }

    const url = process.env.SUPABASE_URL;
    // Supabase's publishable key is the modern browser-safe replacement for
    // the legacy anon key. Keep the response shape stable for existing clients.
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !anonKey) {
        return json(response, 503, { error: 'supabase_config_missing' });
    }

    return json(response, 200, {
        url,
        anonKey,
    });
};
