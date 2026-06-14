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
const contactEmail = 'contact@sacreationweb.com';
const normalizeList = (value) => (Array.isArray(value) ? value.map(normalize).filter(Boolean) : []);
const escapeHtml = (value) =>
    normalize(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const formatSender = (value) => {
    const sender = normalize(value) || contactEmail;
    return sender.includes('<') ? sender : `SA Création Web <${sender}>`;
};

const buildEmailContent = ({ firstName, lastName, email, message, service, deadline, details }) => {
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Visiteur';
    const detailsText = details.length > 0 ? details.join(', ') : '-';
    const subject = service
        ? `Nouvelle demande de projet - ${service} - ${fullName}`
        : `Nouvelle demande de contact - ${fullName}`;
    const text = [
        'Nouvelle demande depuis sacreationweb.com',
        '',
        `Nom : ${lastName || '-'}`,
        `Prenom : ${firstName || '-'}`,
        `Email : ${email}`,
        `Type de projet : ${service || '-'}`,
        `Delai souhaite : ${deadline || '-'}`,
        `Informations cochees : ${detailsText}`,
        '',
        'Message :',
        message,
    ].join('\n');
    const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111827;">
            <h2>Nouvelle demande depuis sacreationweb.com</h2>
            <p><strong>Nom :</strong> ${escapeHtml(lastName || '-')}</p>
            <p><strong>Prenom :</strong> ${escapeHtml(firstName || '-')}</p>
            <p><strong>Email :</strong> ${escapeHtml(email)}</p>
            <p><strong>Type de projet :</strong> ${escapeHtml(service || '-')}</p>
            <p><strong>Delai souhaite :</strong> ${escapeHtml(deadline || '-')}</p>
            <p><strong>Informations cochees :</strong> ${escapeHtml(detailsText)}</p>
            <h3>Message</h3>
            <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;">${escapeHtml(message)}</pre>
        </div>
    `;

    return { fullName, subject, text, html };
};

const saveContactMessage = async ({ firstName, lastName, email, message }) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return { saved: false, skipped: true };
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
        const error = new Error('supabase_insert_failed');
        error.status = insertResponse.status;
        throw error;
    }

    return { saved: true };
};

const sendWithSmtp = async ({ from, to, replyTo, subject, text, html }) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number.parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

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

    await transporter.sendMail({
        from,
        to,
        replyTo,
        subject,
        text,
        html,
    });
};

const sendContactEmail = async ({ firstName, lastName, email, message, service, deadline, details }) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactToEmail = process.env.CONTACT_TO_EMAIL || contactEmail;
    const contactFromEmail = formatSender(process.env.CONTACT_FROM_EMAIL || smtpUser || contactEmail);
    const emailContent = buildEmailContent({ firstName, lastName, email, message, service, deadline, details });

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('missing_smtp_config');
    }

    await sendWithSmtp({
        from: contactFromEmail,
        to: contactToEmail,
        replyTo: email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

module.exports = async (request, response) => {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return json(response, 405, { error: 'method_not_allowed' });
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
    const service = normalize(payload.service);
    const deadline = normalize(payload.deadline);
    const details = normalizeList(payload.details);

    if (!email || !message) {
        return json(response, 400, { error: 'missing_required_fields' });
    }

    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailLooksValid) {
        return json(response, 400, { error: 'invalid_email' });
    }

    try {
        await saveContactMessage({ firstName, lastName, email, message });
    } catch (error) {
        console.error('Contact message save failed:', {
            code: error && error.message ? error.message : 'supabase_insert_failed',
            status: error && error.status ? error.status : undefined,
        });
    }

    try {
        await sendContactEmail({ firstName, lastName, email, message, service, deadline, details });
    } catch (error) {
        const errorCode = error && /^missing_/.test(error.message) ? error.message : 'email_send_failed';
        console.error('Contact email failed:', {
            code: error && error.code ? error.code : errorCode,
            command: error && error.command ? error.command : undefined,
            message: error && error.message ? error.message : errorCode,
            status: error && error.status ? error.status : undefined,
        });
        return json(response, 502, { error: errorCode });
    }

    return json(response, 200, { ok: true, email: 'sent' });
};
