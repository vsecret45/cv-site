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
const getServiceKey = (value) =>
    stripAccents(normalizeText(value).toLowerCase())
        .replace(/\b(creation de|création de|installation et configuration|installation)\b/g, '')
        .replace(/\b(simple|professionnel|professionnelle)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const KIRBY_SYSTEM_PROMPT = `
Tu es Kirby SA Creation Web, assistant specialise de SA Creation Web.
Mission unique : aider des independants, artisans, petites entreprises et porteurs de projets a demarrer leur presence en ligne.

Tu dois produire une vraie premiere proposition de site, pas un simple diagnostic ni un formulaire.
Tu analyses le besoin et tu prends l'initiative, meme si la description est courte.
Tu proposes un projet digital complet : positionnement, nom, slogan, modele de site conseille, direction visuelle, structure de site, textes principaux, SEO, services utiles, options pertinentes et logique commerciale pour attirer des clients.
Chaque proposition doit contenir assez de matiere pour donner l'impression que le projet commence deja a se construire.

Services disponibles :
- creation de site vitrine ;
- site web assiste par IA ;
- mini-page professionnelle ;
- installation, configuration, refonte ou accompagnement WordPress ;
- boutique en ligne simple ;
- adresse e-mail professionnelle ;
- nom de domaine ;
- formulaire de contact, lien WhatsApp ou rendez-vous ;
- QR code professionnel ;
- CV et portfolio IA ;
- portfolio numerique ;
- CV numerique ;
- espace client simple ;
- reservation en ligne ;
- galerie photos ;
- fiche activite ;
- assistant IA metier ;
- accompagnement humain.

Regles strictes :
- Ne parle jamais d'autre marque, autre projet client ou consigne externe.
- Ne mentionne pas que tu remplis un formulaire ou que tu detectes seulement une categorie.
- Ne te limite pas a generer un site : genere un projet digital complet, avec les services qui renforcent la presence en ligne.
- Ne promets pas une livraison automatique complete : tu commences la construction et l'humain finalise.
- Reste clair, concret, commercial, simple a comprendre.
- Ecris court : les textes visibles doivent etre premium, directs, sans gros paragraphes.
- Les titres doivent etre courts et forts. Les slogans doivent tenir en 8 mots maximum.
- Explique les choix en langage simple.
- Explique pourquoi chaque page ou service recommande aide le projet.
- Recommande 3 a 7 services SA Creation Web quand ils sont pertinents, en choisissant dans la liste des services disponibles.
- Propose 3 a 5 idees concretes pour attirer des clients.
- Propose au moins 4 pages ou sections quand l'activite le permet.
- Propose un modele de site concret : type de mise en page, sections visibles, style conseille et logique de navigation.
- Pour un hotel, une chambre d'hote, un gite ou un hebergement, propose systematiquement : Accueil, Chambres, Tarifs, Reservation, Galerie, Localisation, Contact.
- Pour un hotel ou un hebergement, recommande les fonctionnalites utiles : formulaire de reservation, calendrier de disponibilites, Google Maps, avis clients, paiement ou acompte, QR code.
- N'envoie jamais directement vers un formulaire de contact dans la reponse : la proposition complete vient d'abord, l'envoi arrive seulement en etape suivante dans l'interface.
- Si l'utilisateur demande une modification, regenere une proposition coherente, pas seulement une correction locale.
- Retourne uniquement un JSON valide, sans markdown.

Schema JSON attendu :
{
  "projectType": "type de projet court",
  "siteName": "nom propose",
  "slogan": "slogan court",
  "summary": "resume en 1 phrase",
  "valueProposition": "valeur ajoutee claire pour les clients",
  "positioning": {
    "audience": "client cible",
    "promise": "promesse commerciale",
    "tone": "ton conseille",
    "differentiator": "ce qui rend le projet plus credible ou different"
  },
  "styleGuide": {
    "direction": "style visuel conseille",
    "colors": "palette ou ambiance couleur",
    "typography": "type de typographie conseille",
    "layout": "mise en page conseillee"
  },
  "siteModel": {
    "name": "nom du modele de site",
    "description": "description courte du modele",
    "sections": ["section importante du futur site"]
  },
  "recommendedOffer": "Offre Essentiel | Offre Pro | Offre Signature | Mini-page professionnelle | Projet specifique",
  "pages": [{"name": "Accueil", "goal": "role de la page"}],
  "homeSections": [{"title": "titre de section", "text": "texte pret a utiliser"}],
  "services": [{"name": "service/prestation du client", "description": "texte court"}],
  "ctas": ["bouton 1", "bouton 2"],
  "seo": {
    "keywords": ["mot cle principal"],
    "searchExpressions": ["expression que le client peut taper sur Google"],
    "titles": ["titre SEO possible"],
    "metaDescription": "meta-description prete a utiliser"
  },
  "seoKeywords": ["mot cle 1", "mot cle 2"],
  "recommendedServices": [{"name": "service SA Creation Web", "reason": "raison simple", "priceFrom": "prix ou indication courte"}],
  "clientAcquisition": ["idee concrete pour attirer des clients"],
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
        ['hôtel', 'hotel'],
        ['gite', 'hebergement'],
        ['gîte', 'hebergement'],
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
    const needsHotel = /\b(hotel|hôtel|chambre|hebergement|hébergement|gite|gîte|sejour|séjour|touristique)\b/.test(lowerBrief);
    const needsWordPress = /\b(wordpress|wp|cms|refonte)\b/.test(lowerBrief);
    const needsShop = /\b(boutique|vendre|vente|commande|produit|panier|paiement|catalogue)\b/.test(lowerBrief);
    const needsMenu = /\b(menu|restaurant|carte|plat|tarif|prix)\b/.test(lowerBrief);
    const needsPortfolio = /\b(cv|portfolio|book|realisations|candidat|candidate)\b/.test(lowerBrief);
    const needsQr = /\b(qr|scan|flyer|carte|menu|partager)\b/.test(lowerBrief);
    const needsClientSpace = /\b(espace client|compte client|suivi|document|documents|connexion|prive|privé)\b/.test(lowerBrief);
    const needsAiAssistant = /\b(assistant|ia|automatiser|automatisation|questions|support|chat)\b/.test(lowerBrief);
    const nameBase = titleCase(activity.replace(/^site\s+/i, ''));
    const siteName = nameBase.length > 28 ? `Studio ${nameBase.split(/\s+/)[0]}` : nameBase;
    const mainAction = needsHotel ? 'Réserver une chambre' : needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Demander une information';
    const pages = needsHotel ? [
        { name: 'Accueil', goal: "Présenter l'hôtel, l'ambiance et le bouton de réservation." },
        { name: 'Chambres', goal: 'Montrer les chambres, équipements, photos et capacités.' },
        { name: 'Tarifs', goal: 'Clarifier les prix, périodes, conditions ou disponibilités.' },
        { name: 'Réservation', goal: 'Permettre une demande de disponibilité ou une réservation.' },
        { name: 'Galerie', goal: "Rassurer avec les photos de l'hôtel, des chambres et des espaces." },
        { name: 'Localisation', goal: 'Afficher la ville, l’accès, Google Maps et les points d’intérêt.' },
        { name: 'Contact', goal: 'Donner téléphone, e-mail et formulaire.' },
    ] : [
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

    if (needsHotel) {
        recommendedServices.splice(
            1,
            0,
            { name: 'Réservation en ligne', reason: 'Les visiteurs doivent pouvoir demander une disponibilité sans chercher.', priceFrom: 'Projet spécifique' },
            { name: 'Galerie photos', reason: "Les photos rassurent avant une réservation d'hôtel.", priceFrom: 'Inclus selon offre' },
            { name: 'Google Maps et avis clients', reason: "La localisation et les preuves aident à choisir l'hébergement.", priceFrom: 'Inclus selon offre' },
            { name: 'Paiement ou acompte', reason: 'Utile si la réservation doit être confirmée en ligne.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsWordPress) {
        recommendedServices.push({ name: 'WordPress', reason: 'Le projet demande un CMS, une refonte ou une installation WordPress.', priceFrom: 'Projet spécifique' });
    }

    if (needsQr) {
        recommendedServices.push({ name: 'QR code professionnel', reason: 'Utile sur carte, vitrine, flyer, menu ou portfolio.', priceFrom: '39 €' });
    }

    if (needsPortfolio) {
        recommendedServices.push({ name: 'CV & portfolio IA', reason: 'Le projet doit aussi présenter un profil ou des réalisations.', priceFrom: 'À partir de la mini-page' });
    }

    if (needsClientSpace) {
        recommendedServices.push({ name: 'Espace client simple', reason: 'Le projet parle de suivi, documents ou accès privé.', priceFrom: 'Projet spécifique' });
    }

    if (needsAiAssistant) {
        recommendedServices.push({ name: 'Assistant IA métier', reason: 'Utile si les visiteurs posent souvent les mêmes questions ou si le projet doit guider les demandes.', priceFrom: 'Projet spécifique' });
    }

    const seoKeywords = [activity, `${activity} local`, `site ${activity}`, needsAppointment ? 'prendre rendez-vous' : 'contact professionnel'].filter(Boolean);
    const seo = {
        keywords: seoKeywords,
        searchExpressions: [
            needsHotel ? `${activity} + ville` : `${activity} près de moi`,
            `${activity} tarifs`,
            `${activity} contact`,
            needsHotel ? 'réservation hôtel' : needsAppointment ? `${activity} rendez-vous en ligne` : `${activity} professionnel`,
            needsHotel ? 'chambre + ville' : '',
        ],
        titles: [
            `${siteName} - ${needsShop ? 'Catalogue et commandes' : needsAppointment ? 'Prestations et rendez-vous' : 'Site officiel'}`,
            `${activity} - Services, tarifs et contact`,
        ],
        metaDescription: `${siteName} présente ${activity}, les services, les informations utiles et un contact direct pour ${mainAction.toLowerCase()}.`,
    };

    return {
        mode: 'fallback',
        projectType: needsHotel ? 'Site hôtel avec réservation' : needsShop ? 'Boutique en ligne simple' : needsPortfolio ? 'CV ou portfolio en ligne' : needsAppointment ? 'Site avec prise de rendez-vous' : needsWordPress ? 'Site WordPress professionnel' : 'Site vitrine professionnel',
        siteName,
        slogan: needsShop ? `Des produits clairs, faciles à découvrir et commander.` : `Une présence claire pour présenter ${activity} et recevoir des contacts.`,
        summary: `Kirby propose de construire un site simple autour de ${activity}, avec un message direct, des pages utiles et un contact visible.`,
        valueProposition: `Un projet digital clair qui aide ${activity} à être trouvé, compris et contacté plus facilement.`,
        positioning: {
            audience: 'Clients locaux, visiteurs qui cherchent une solution rapide et prospects à rassurer.',
            promise: needsShop ? 'Découvrir les produits et passer à la commande sans friction.' : needsAppointment ? 'Comprendre les prestations et réserver un créneau facilement.' : 'Comprendre l’activité et contacter rapidement.',
            tone: 'Professionnel, direct et rassurant.',
            differentiator: 'Une structure simple, des options utiles et un accompagnement humain après la proposition IA.',
        },
        styleGuide: {
            direction: needsHotel ? 'Site immersif avec photos, chambres, disponibilité et réservation visible.' : needsShop ? 'Catalogue clair avec produits visibles et parcours de commande court.' : needsAppointment ? 'Site élégant avec agenda ou contact visible dès le premier écran.' : 'Vitrine moderne, lisible et rassurante.',
            colors: 'Fond sobre, contraste fort, une couleur d’accent pour les boutons et les informations importantes.',
            typography: 'Titres francs, textes courts, lecture facile sur mobile.',
            layout: needsHotel ? 'Hero photo, chambres, tarifs, galerie, localisation, avis, réservation.' : 'Accueil direct, blocs courts, grille de prestations, preuves, puis contact.',
        },
        siteModel: {
            name: needsHotel ? 'Modèle hôtel + réservation' : needsShop ? 'Modèle catalogue + commande' : needsAppointment ? 'Modèle rendez-vous local' : 'Modèle vitrine professionnelle',
            description: needsHotel ? 'Une structure pensée pour montrer les chambres, rassurer, localiser et convertir vers la réservation.' : needsShop ? 'Une page d’accueil qui mène vite vers le catalogue, les produits et la commande.' : needsAppointment ? 'Une page d’accueil centrée sur les prestations, les preuves et la prise de rendez-vous.' : 'Une vitrine claire pour expliquer l’activité, rassurer et obtenir une demande.',
            sections: [
                needsHotel ? 'Hero hôtel avec bouton Réserver' : 'Hero avec promesse et bouton principal',
                needsHotel ? 'Chambres et équipements' : needsShop ? 'Produits ou catégories' : 'Prestations principales',
                needsHotel ? 'Tarifs ou disponibilités' : needsPortfolio ? 'Réalisations ou portfolio' : 'Preuves de confiance',
                needsHotel ? 'Galerie et localisation' : needsAppointment ? 'Prise de rendez-vous' : 'Contact rapide',
            ],
        },
        recommendedOffer: needsHotel ? 'Offre Signature' : needsShop ? 'Offre Pro' : needsPortfolio ? 'Mini-page professionnelle' : needsAppointment ? 'Offre Pro' : needsWordPress ? 'Projet spécifique' : 'Offre Essentiel',
        pages,
        homeSections: [
            { title: `Bienvenue chez ${siteName}`, text: needsHotel ? `Un accueil visuel présente l'hôtel, l'ambiance, la ville et le bouton ${mainAction}.` : `Une page d'accueil claire pour expliquer l'activité, rassurer le visiteur et l'orienter vers ${mainAction.toLowerCase()}.` },
            { title: needsHotel ? 'Chambres et services' : needsShop ? 'Produits ou catalogue' : 'Prestations principales', text: needsHotel ? 'Les chambres, équipements et services sont présentés avec photos, tarifs ou indications pratiques.' : needsShop ? 'Les produits sont présentés par catégorie, avec un chemin simple vers la commande.' : 'Les services sont présentés avec des mots simples, des tarifs ou indications pratiques.' },
            { title: 'Contact rapide', text: `Un bouton ${mainAction} reste visible pour transformer la visite en demande concrète.` },
        ],
        services: [
            { name: needsHotel ? 'Chambres' : needsShop ? 'Catalogue en ligne' : "Présentation de l'activité", description: needsHotel ? 'Présenter chaque chambre avec photos, équipements, capacité et ambiance.' : 'Un bloc court pour dire ce qui est proposé, pour qui et dans quelle zone.' },
            { name: needsHotel ? 'Réservation' : needsAppointment ? 'Rendez-vous' : 'Contact direct', description: needsHotel ? 'Formulaire de disponibilité, téléphone, e-mail et éventuellement acompte.' : needsAppointment ? 'Un lien de réservation, téléphone ou WhatsApp pour choisir un créneau.' : 'Un formulaire simple, un e-mail professionnel ou un lien WhatsApp.' },
            { name: needsHotel ? 'Localisation et galerie' : 'Preuves et confiance', description: needsHotel ? 'Google Maps, photos, points d’intérêt et avis clients.' : 'Photos, avis, exemples, certifications ou informations pratiques.' },
        ],
        ctas: [mainAction, needsHotel ? 'Demander une disponibilité' : 'Voir les prestations', 'Contacter maintenant'],
        seo,
        seoKeywords,
        recommendedServices,
        clientAcquisition: [
            'Mettre le bouton principal dès le haut de page.',
            'Ajouter un QR code sur cartes, vitrine, flyers ou réseaux sociaux.',
            'Travailler les mots-clés locaux pour capter les recherches Google.',
            'Afficher des preuves simples : photos, avis, réalisations ou exemples.',
        ],
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

const normalizeRecommendedServices = (proposal, fallback) => {
    const services = limitArray(proposal.recommendedServices, 9)
        .map((service) => ({
            name: normalizeText(service && service.name) || 'Service SA Creation Web',
            reason: normalizeText(service && service.reason) || 'Utile pour le projet.',
            priceFrom: normalizeText(service && service.priceFrom) || '',
        }))
        .filter((service) => service.name);
    const seen = new Set(services.map((service) => getServiceKey(service.name)));

    fallback.recommendedServices.forEach((service) => {
        const key = getServiceKey(service.name);

        if (!seen.has(key) && services.length < 9) {
            services.push(service);
            seen.add(key);
        }
    });

    return services;
};

const normalizeClientAcquisition = (proposal, fallback) => {
    const actions = limitArray(proposal.clientAcquisition, 5).map(normalizeText).filter(Boolean);
    const seen = new Set(actions.map((action) => stripAccents(action.toLowerCase())));

    fallback.clientAcquisition.forEach((action) => {
        const key = stripAccents(action.toLowerCase());

        if (!seen.has(key) && actions.length < 5) {
            actions.push(action);
            seen.add(key);
        }
    });

    return actions;
};

const isHotelProject = (brief, proposal = {}) => {
    const source = [
        brief,
        proposal.projectType,
        proposal.siteName,
        proposal.summary,
        proposal.siteModel && proposal.siteModel.name,
        proposal.siteModel && proposal.siteModel.description,
    ]
        .map((value) => stripAccents(normalizeText(value || '').toLowerCase()))
        .join(' ');

    return /\b(hotel|chambre|hebergement|gite|sejour|touristique)\b/.test(source);
};

const mergeRequiredPages = (pages, requiredPages, max = 8) => {
    const normalizedPages = limitArray(pages, max)
        .map((page) => ({
            name: normalizeText(page && page.name) || 'Page',
            goal: normalizeText(page && page.goal) || 'Clarifier une information importante.',
        }))
        .filter((page) => page.name);
    const seen = new Set(normalizedPages.map((page) => stripAccents(page.name.toLowerCase())));

    requiredPages.forEach((page) => {
        const key = stripAccents(page.name.toLowerCase());

        if (!seen.has(key) && normalizedPages.length < max) {
            normalizedPages.push(page);
            seen.add(key);
        }
    });

    return normalizedPages;
};

const mergeRequiredSections = (sections, requiredSections, max = 8) => {
    const normalizedSections = limitArray(sections, max).map(normalizeText).filter(Boolean);
    const seen = new Set(normalizedSections.map((section) => stripAccents(section.toLowerCase())));

    requiredSections.forEach((section) => {
        const key = stripAccents(section.toLowerCase());

        if (!seen.has(key) && normalizedSections.length < max) {
            normalizedSections.push(section);
            seen.add(key);
        }
    });

    return normalizedSections;
};

const sanitizeProposal = (proposal, brief) => {
    const fallback = buildFallbackProposal(brief);
    const hotelProject = isHotelProject(brief, proposal);
    const requiredHotelPages = [
        { name: 'Accueil', goal: "Présenter l'hôtel, l'ambiance et le bouton de réservation." },
        { name: 'Chambres', goal: 'Montrer les chambres, équipements, photos et capacités.' },
        { name: 'Tarifs', goal: 'Clarifier les prix, périodes, conditions ou disponibilités.' },
        { name: 'Réservation', goal: 'Permettre une demande de disponibilité ou une réservation.' },
        { name: 'Galerie', goal: "Rassurer avec les photos de l'hôtel, des chambres et des espaces." },
        { name: 'Localisation', goal: 'Afficher la ville, l’accès, Google Maps et les points d’intérêt.' },
        { name: 'Contact', goal: 'Donner téléphone, e-mail et formulaire.' },
    ];
    const pages = hotelProject
        ? mergeRequiredPages(proposal.pages || fallback.pages, requiredHotelPages, 8)
        : mergeRequiredPages(proposal.pages || fallback.pages, [], 8);
    const siteSections = hotelProject
        ? mergeRequiredSections((proposal.siteModel && proposal.siteModel.sections) || fallback.siteModel.sections, requiredHotelPages.map((page) => page.name), 8)
        : mergeRequiredSections((proposal.siteModel && proposal.siteModel.sections) || fallback.siteModel.sections, [], 6);

    return {
        mode: proposal.mode || 'openai',
        projectType: normalizeText(proposal.projectType) || fallback.projectType,
        siteName: normalizeText(proposal.siteName) || fallback.siteName,
        slogan: normalizeText(proposal.slogan) || fallback.slogan,
        summary: normalizeText(proposal.summary) || fallback.summary,
        valueProposition: normalizeText(proposal.valueProposition) || fallback.valueProposition,
        positioning: {
            audience: normalizeText(proposal.positioning && proposal.positioning.audience) || fallback.positioning.audience,
            promise: normalizeText(proposal.positioning && proposal.positioning.promise) || fallback.positioning.promise,
            tone: normalizeText(proposal.positioning && proposal.positioning.tone) || fallback.positioning.tone,
            differentiator: normalizeText(proposal.positioning && proposal.positioning.differentiator) || fallback.positioning.differentiator,
        },
        styleGuide: {
            direction: normalizeText(proposal.styleGuide && proposal.styleGuide.direction) || fallback.styleGuide.direction,
            colors: normalizeText(proposal.styleGuide && proposal.styleGuide.colors) || fallback.styleGuide.colors,
            typography: normalizeText(proposal.styleGuide && proposal.styleGuide.typography) || fallback.styleGuide.typography,
            layout: normalizeText(proposal.styleGuide && proposal.styleGuide.layout) || fallback.styleGuide.layout,
        },
        siteModel: {
            name: normalizeText(proposal.siteModel && proposal.siteModel.name) || fallback.siteModel.name,
            description: normalizeText(proposal.siteModel && proposal.siteModel.description) || fallback.siteModel.description,
            sections: siteSections,
        },
        recommendedOffer: normalizeText(proposal.recommendedOffer) || fallback.recommendedOffer,
        pages,
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
        ctas: limitArray(proposal.ctas, 5).map(normalizeText).filter(Boolean),
        seo: {
            keywords: limitArray((proposal.seo && proposal.seo.keywords) || proposal.seoKeywords || fallback.seo.keywords, 8).map(normalizeText).filter(Boolean),
            searchExpressions: limitArray((proposal.seo && proposal.seo.searchExpressions) || fallback.seo.searchExpressions, 6).map(normalizeText).filter(Boolean),
            titles: limitArray((proposal.seo && proposal.seo.titles) || fallback.seo.titles, 4).map(normalizeText).filter(Boolean),
            metaDescription: normalizeText(proposal.seo && proposal.seo.metaDescription) || fallback.seo.metaDescription,
        },
        seoKeywords: limitArray(proposal.seoKeywords || (proposal.seo && proposal.seo.keywords) || fallback.seoKeywords, 8).map(normalizeText).filter(Boolean),
        recommendedServices: normalizeRecommendedServices(proposal, fallback),
        clientAcquisition: normalizeClientAcquisition(proposal, fallback),
        explanation: limitArray(proposal.explanation, 5).map(normalizeText).filter(Boolean),
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

const buildOpenAiUserPrompt = ({ brief, revision, currentProposal }) => {
    const parts = [
        `Description initiale de l'activite : ${brief}`,
    ];

    if (revision) {
        parts.push(`Modification demandee par l'utilisateur : ${revision}`);
        parts.push('Regenere une proposition complete et coherente en tenant compte de cette modification.');
    }

    if (currentProposal) {
        parts.push(`Proposition precedente a ameliorer : ${JSON.stringify(currentProposal).slice(0, 5000)}`);
    }

    return parts.join('\n\n');
};

const requestOpenAiProposal = async ({ apiKey, model, brief, revision, currentProposal }) => {
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
                    content: buildOpenAiUserPrompt({ brief, revision, currentProposal }),
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

const callOpenAi = async ({ brief, revision, currentProposal }) => {
    const apiKeys = getOpenAiKeys();

    if (!apiKeys.length) {
        return null;
    }

    const model = process.env.KIRBY_OPENAI_MODEL || 'gpt-4o-mini';
    const errors = [];

    for (const apiKey of apiKeys) {
        try {
            return await requestOpenAiProposal({ apiKey, model, brief, revision, currentProposal });
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
    const revision = normalize(payload.revision).slice(0, 800);
    const currentProposal = payload.currentProposal && typeof payload.currentProposal === 'object'
        ? payload.currentProposal
        : null;

    if (brief.length < 8) {
        return json(response, 400, { error: 'brief_too_short' });
    }

    try {
        const openAiProposal = await callOpenAi({ brief, revision, currentProposal });

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
        proposal: sanitizeProposal(buildFallbackProposal(revision ? `${brief} ${revision}` : brief), brief),
    });
};
