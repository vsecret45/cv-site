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

            if (body.length > 50000) {
                reject(new Error('payload_too_large'));
                request.destroy();
            }
        });

        request.on('end', () => resolve(body));
        request.on('error', reject);
    });

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeText = (value) => normalize(value).replace(/\s+/g, ' ');
const stripAccents = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const pickFirst = (values, fallback = '') => values.find((value) => normalize(value)) || fallback;

const KIRBY_SYSTEM_PROMPT = `
Tu es Kirby SA Creation Web, assistant specialise de SA Creation Web.
Mission unique : aider des independants, artisans, petites entreprises et porteurs de projets a demarrer leur presence en ligne.

Tu dois produire une vraie premiere proposition de site, pas un simple diagnostic ni un formulaire.
Tu analyses le besoin, proposes un nom de site, un slogan, une structure de pages, des sections d'accueil, des textes principaux, des appels a l'action, des mots-cles SEO et les services SA Creation Web utiles.

Services disponibles :
- creation de site vitrine ;
- site web assiste par IA ;
- mini-page professionnelle ;
- boutique en ligne simple ;
- adresse e-mail professionnelle ;
- nom de domaine ;
- formulaire de contact, lien WhatsApp ou rendez-vous ;
- QR code professionnel ;
- CV et portfolio IA ;
- accompagnement humain.

Regles strictes :
- Ne parle jamais d'autre marque, autre projet client ou consigne externe.
- Ne mentionne pas que tu remplis un formulaire ou que tu detectes seulement une categorie.
- Ne promets pas une livraison automatique complete : tu commences la construction et l'humain finalise.
- Reste clair, concret, commercial, simple a comprendre.
- Explique les choix en langage simple.
- Retourne uniquement un JSON valide, sans markdown.

Schema JSON attendu :
{
  "projectType": "type de projet court",
  "siteName": "nom propose",
  "slogan": "slogan court",
  "summary": "resume en 1 phrase",
  "recommendedOffer": "Offre Essentiel | Offre Pro | Offre Signature | Mini-page professionnelle | Projet specifique",
  "pages": [{"name": "Accueil", "goal": "role de la page"}],
  "homeSections": [{"title": "titre de section", "text": "texte pret a utiliser"}],
  "services": [{"name": "service/prestation du client", "description": "texte court"}],
  "ctas": ["bouton 1", "bouton 2"],
  "seoKeywords": ["mot cle 1", "mot cle 2"],
  "recommendedServices": [{"name": "service SA Creation Web", "reason": "raison simple", "priceFrom": "prix ou indication courte"}],
  "explanation": ["choix explique 1", "choix explique 2"],
  "contactMessage": "message pret a envoyer a SA Creation Web"
}
`.trim();

const getActivityWords = (brief) => {
    const cleanBrief = stripAccents(brief.toLowerCase());
    const knownActivities = [
        ['coiffeuse', 'salon de coiffure'],
        ['coiffeur', 'salon de coiffure'],
        ['fleuriste', 'fleuriste'],
        ['restaurant', 'restaurant'],
        ['menu', 'restaurant'],
        ['coach', 'coach'],
        ['photographe', 'photographe'],
        ['artisan', 'artisan'],
        ['plombier', 'plombier'],
        ['electricien', 'electricien'],
        ['institut', 'institut'],
        ['estheticienne', 'institut de beaute'],
        ['hotel', 'hotel'],
        ['chambre', 'hebergement'],
        ['location', 'location'],
        ['association', 'association'],
        ['boutique', 'boutique'],
        ['cv', 'CV et portfolio'],
        ['portfolio', 'portfolio'],
    ];
    const found = knownActivities.find(([keyword]) => cleanBrief.includes(keyword));

    if (found) {
        return found[1];
    }

    const compact = brief
        .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !/^(pour|avec|dans|faire|veux|avoir|site|page|client|clients|projet)$/i.test(word));

    return compact.slice(0, 3).join(' ') || 'activité professionnelle';
};

const titleCase = (value) =>
    value
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
        .join(' ');

const buildFallbackProposal = (brief) => {
    const activity = getActivityWords(brief);
    const lowerBrief = stripAccents(brief.toLowerCase());
    const needsAppointment = /\b(rdv|rendez|reservation|creneau|agenda|coiff|coach|institut|beaute|consultation)\b/.test(lowerBrief);
    const needsShop = /\b(boutique|vendre|vente|commande|produit|panier|paiement|catalogue)\b/.test(lowerBrief);
    const needsMenu = /\b(menu|restaurant|carte|plat|tarif|prix)\b/.test(lowerBrief);
    const needsPortfolio = /\b(cv|portfolio|book|realisations|candidat|candidate)\b/.test(lowerBrief);
    const needsQr = /\b(qr|scan|flyer|carte|menu|partager)\b/.test(lowerBrief);
    const nameBase = titleCase(activity.replace(/^site\s+/i, ''));
    const siteName = nameBase.length > 28 ? `Studio ${nameBase.split(/\s+/)[0]}` : nameBase;
    const mainAction = needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Demander une information';
    const pages = [
        { name: 'Accueil', goal: "Faire comprendre l'activité et donner envie de continuer." },
        { name: needsShop ? 'Boutique' : needsMenu ? 'Tarifs' : 'Prestations', goal: needsShop ? 'Présenter les produits et guider vers la commande.' : 'Présenter clairement ce que le client peut acheter.' },
        { name: needsPortfolio ? 'Portfolio' : 'A propos', goal: needsPortfolio ? 'Montrer les réalisations, le parcours ou les preuves.' : 'Rassurer avec une présentation humaine et professionnelle.' },
        { name: 'Contact', goal: 'Donner un moyen direct de demander une information.' },
    ];
    const recommendedServices = [
        { name: needsShop ? 'Boutique en ligne simple' : 'Site vitrine', reason: needsShop ? 'Le projet contient une intention de vente ou de catalogue.' : "Le besoin principal est d'être visible et clair en ligne.", priceFrom: needsShop ? 'À partir de 712 € selon le catalogue' : 'À partir de 392 €' },
        { name: 'Adresse e-mail professionnelle', reason: 'Une adresse contact@ renforce la confiance.', priceFrom: 'À partir de 49 €' },
        { name: 'Nom de domaine', reason: 'Un nom court facilite la mémorisation et le partage.', priceFrom: 'A cadrer selon disponibilité' },
    ];

    if (needsAppointment) {
        recommendedServices.push({ name: 'Lien rendez-vous ou WhatsApp', reason: 'Le visiteur doit pouvoir agir sans chercher.', priceFrom: 'Inclus selon offre' });
    }

    if (needsQr) {
        recommendedServices.push({ name: 'QR code professionnel', reason: 'Utile sur carte, vitrine, flyer, menu ou portfolio.', priceFrom: '39 €' });
    }

    if (needsPortfolio) {
        recommendedServices.push({ name: 'CV & portfolio IA', reason: 'Le projet doit aussi présenter un profil ou des réalisations.', priceFrom: 'À partir de la mini-page' });
    }

    return {
        mode: 'fallback',
        projectType: needsShop ? 'Boutique en ligne simple' : needsPortfolio ? 'CV ou portfolio en ligne' : needsAppointment ? 'Site avec prise de rendez-vous' : 'Site vitrine professionnel',
        siteName,
        slogan: needsShop ? `Des produits clairs, faciles à découvrir et commander.` : `Une présence claire pour présenter ${activity} et recevoir des contacts.`,
        summary: `Kirby propose de construire un site simple autour de ${activity}, avec un message direct, des pages utiles et un contact visible.`,
        recommendedOffer: needsShop ? 'Offre Pro' : needsPortfolio ? 'Mini-page professionnelle' : needsAppointment ? 'Offre Pro' : 'Offre Essentiel',
        pages,
        homeSections: [
            { title: `Bienvenue chez ${siteName}`, text: `Une page d'accueil claire pour expliquer l'activité, rassurer le visiteur et l'orienter vers ${mainAction.toLowerCase()}.` },
            { title: needsShop ? 'Produits ou catalogue' : 'Prestations principales', text: needsShop ? 'Les produits sont présentés par catégorie, avec un chemin simple vers la commande.' : 'Les services sont présentés avec des mots simples, des tarifs ou indications pratiques.' },
            { title: 'Contact rapide', text: `Un bouton ${mainAction} reste visible pour transformer la visite en demande concrète.` },
        ],
        services: [
            { name: needsShop ? 'Catalogue en ligne' : "Présentation de l'activité", description: 'Un bloc court pour dire ce qui est proposé, pour qui et dans quelle zone.' },
            { name: needsAppointment ? 'Rendez-vous' : 'Contact direct', description: needsAppointment ? 'Un lien de réservation, téléphone ou WhatsApp pour choisir un créneau.' : 'Un formulaire simple, un e-mail professionnel ou un lien WhatsApp.' },
            { name: 'Preuves et confiance', description: 'Photos, avis, exemples, certifications ou informations pratiques.' },
        ],
        ctas: [mainAction, 'Voir les prestations', 'Contacter maintenant'],
        seoKeywords: [activity, `${activity} local`, `site ${activity}`, needsAppointment ? 'prendre rendez-vous' : 'contact professionnel'].filter(Boolean),
        recommendedServices,
        explanation: [
            "La structure commence par le besoin du visiteur pour éviter l'effet bloc-note.",
            'Les pages restent courtes pour guider vers une action claire.',
            'Les options comme e-mail pro, domaine et QR code sont ajoutées seulement quand elles aident le projet.',
        ],
        contactMessage: [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            `Type de projet : ${needsShop ? 'boutique en ligne simple' : needsAppointment ? 'site avec prise de rendez-vous' : 'site vitrine professionnel'}`,
            `Slogan proposé : ${needsShop ? 'Des produits clairs, faciles à découvrir et commander.' : `Une présence claire pour présenter ${activity} et recevoir des contacts.`}`,
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            `Actions conseillées : ${[mainAction, 'Voir les prestations', 'Contacter maintenant'].join(', ')}`,
            `Offre pressentie : ${needsShop ? 'Offre Pro' : needsPortfolio ? 'Mini-page professionnelle' : needsAppointment ? 'Offre Pro' : 'Offre Essentiel'}`,
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet."
        ].join('\n'),
    };
};

const parseOpenAiJson = (content) => {
    const raw = normalize(content);

    if (!raw) {
        throw new Error('empty_openai_response');
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        const match = raw.match(/\{[\s\S]*\}/);

        if (!match) {
            throw error;
        }

        return JSON.parse(match[0]);
    }
};

const limitArray = (value, max) => (Array.isArray(value) ? value.slice(0, max) : []);

const sanitizeProposal = (proposal, brief) => {
    const fallback = buildFallbackProposal(brief);

    return {
        mode: proposal.mode || 'openai',
        projectType: normalizeText(proposal.projectType) || fallback.projectType,
        siteName: normalizeText(proposal.siteName) || fallback.siteName,
        slogan: normalizeText(proposal.slogan) || fallback.slogan,
        summary: normalizeText(proposal.summary) || fallback.summary,
        recommendedOffer: normalizeText(proposal.recommendedOffer) || fallback.recommendedOffer,
        pages: limitArray(proposal.pages, 6)
            .map((page) => ({
                name: normalizeText(page && page.name) || 'Page',
                goal: normalizeText(page && page.goal) || 'Clarifier une information importante.',
            }))
            .filter((page) => page.name),
        homeSections: limitArray(proposal.homeSections, 5)
            .map((section) => ({
                title: normalizeText(section && section.title) || 'Section',
                text: normalizeText(section && section.text) || 'Texte a ajuster.',
            }))
            .filter((section) => section.title),
        services: limitArray(proposal.services, 5)
            .map((service) => ({
                name: normalizeText(service && service.name) || 'Service',
                description: normalizeText(service && service.description) || 'Description a ajuster.',
            }))
            .filter((service) => service.name),
        ctas: limitArray(proposal.ctas, 4).map(normalizeText).filter(Boolean),
        seoKeywords: limitArray(proposal.seoKeywords, 8).map(normalizeText).filter(Boolean),
        recommendedServices: limitArray(proposal.recommendedServices, 6)
            .map((service) => ({
                name: normalizeText(service && service.name) || 'Service SA Creation Web',
                reason: normalizeText(service && service.reason) || 'Utile pour le projet.',
                priceFrom: normalizeText(service && service.priceFrom) || '',
            }))
            .filter((service) => service.name),
        explanation: limitArray(proposal.explanation, 4).map(normalizeText).filter(Boolean),
        contactMessage: normalize(proposal.contactMessage) || fallback.contactMessage,
    };
};

const getOpenAiKeys = () => {
    const keys = [
        process.env.KIRBY_OPENAI_API_KEY,
        process.env.Kirby_openai_api_key,
        process.env.kirby_openai_api_key,
        process.env.OPENAI_API_KEY,
        process.env.openai_api_key,
        process.env.KIRBY_OPENAI_ADMIN_KEY,
        process.env.Kirby_openai_admin_key,
        process.env.kirby_openai_admin_key,
    ]
        .map(normalize)
        .filter((key) => /^sk-/.test(key) && !/^sk-admin-/.test(key));

    return [...new Set(keys)];
};

const requestOpenAiProposal = async ({ apiKey, model, brief }) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            temperature: 0.75,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: KIRBY_SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Projet client a transformer en premiere proposition de site : ${brief}`,
                },
            ],
        }),
    });

    if (!response.ok) {
        const error = new Error('openai_request_failed');
        error.status = response.status;
        throw error;
    }

    const payload = await response.json();
    const content = payload && payload.choices && payload.choices[0] && payload.choices[0].message
        ? payload.choices[0].message.content
        : '';

    return parseOpenAiJson(content);
};

const callOpenAi = async (brief) => {
    const apiKeys = getOpenAiKeys();

    if (!apiKeys.length) {
        return null;
    }

    const model = process.env.KIRBY_OPENAI_MODEL || 'gpt-4o-mini';
    const errors = [];

    for (const apiKey of apiKeys) {
        try {
            return await requestOpenAiProposal({ apiKey, model, brief });
        } catch (error) {
            errors.push({
                code: error && error.message ? error.message : 'openai_request_failed',
                status: error && error.status ? error.status : undefined,
            });
        }
    }

    const finalError = new Error('openai_request_failed');
    finalError.statuses = errors.map((error) => error.status).filter(Boolean);
    throw finalError;
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

    const brief = normalize(payload.brief).slice(0, 1800);

    if (brief.length < 8) {
        return json(response, 400, { error: 'brief_too_short' });
    }

    try {
        const openAiProposal = await callOpenAi(brief);

        if (openAiProposal) {
            return json(response, 200, {
                ok: true,
                proposal: sanitizeProposal(openAiProposal, brief),
            });
        }
    } catch (error) {
        console.error('Kirby OpenAI failed:', {
            code: error && error.message ? error.message : 'openai_request_failed',
            status: error && error.status ? error.status : undefined,
            statuses: error && error.statuses ? error.statuses : undefined,
        });
    }

    return json(response, 200, {
        ok: true,
        proposal: sanitizeProposal(buildFallbackProposal(brief), brief),
    });
};
