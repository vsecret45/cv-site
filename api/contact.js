const nodemailer = require('nodemailer');

const json = (response, statusCode, payload) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(payload));
};

const readBody = (request) =>
    new Promise((resolve, reject) => {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;

            if (body.length > 100000) {
                reject(new Error('payload_too_large'));
                request.destroy();
            }
        });

        request.on('end', () => resolve(body));
        request.on('error', reject);
    });

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

const sendContactEmail = async ({ firstName, lastName, email, message }) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number.parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactToEmail = process.env.CONTACT_TO_EMAIL || 'contact@sacreationweb.com';
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser || contactToEmail;

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('missing_smtp_config');
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Visiteur';
    const text = [
        'Nouvelle demande depuis sacreationweb.com',
        '',
        `Nom : ${lastName || '-'}`,
        `Prenom : ${firstName || '-'}`,
        `Email : ${email}`,
        '',
        'Message :',
        message,
    ].join('\n');

    await transporter.sendMail({
        from: `"SA Creation Web" <${contactFromEmail}>`,
        to: contactToEmail,
        replyTo: email,
        subject: `Nouvelle demande de contact - ${fullName}`,
        text,
    });
};

module.exports = async (request, response) => {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return json(response, 405, { error: 'method_not_allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return json(response, 500, { error: 'missing_supabase_config' });
    }

    let payload;

    try {
        payload = JSON.parse(await readBody(request));
    } catch (error) {
        return json(response, 400, { error: 'invalid_json' });
    }

    const firstName = normalize(payload.firstName);
    const lastName = normalize(payload.lastName);
    const email = normalize(payload.email);
    const message = normalize(payload.message);

    if (!email || !message) {
        return json(response, 400, { error: 'missing_required_fields' });
    }

    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailLooksValid) {
        return json(response, 400, { error: 'invalid_email' });
    }

    const insertResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
        },
        body: JSON.stringify({
            first_name: firstName || null,
            last_name: lastName || null,
            email,
            message,
            source: 'sacreationweb.com',
        }),
    });

    if (!insertResponse.ok) {
        return json(response, 502, { error: 'supabase_insert_failed' });
    }

    try {
        await sendContactEmail({ firstName, lastName, email, message });
    } catch (error) {
        const errorCode = error && error.message === 'missing_smtp_config' ? 'missing_smtp_config' : 'email_send_failed';
        console.error('Contact email failed:', {
            code: error && error.code ? error.code : errorCode,
            command: error && error.command ? error.command : undefined,
            message: error && error.message ? error.message : errorCode,
        });
        return json(response, 502, { error: errorCode });
    }

    return json(response, 200, { ok: true });
};
