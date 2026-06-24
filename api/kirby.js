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
const cleanGeneratedText = (value) => normalize(value)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/&lt;\/?[^&]+&gt;/gi, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const isWeakGeneratedText = (value) => {
    const text = stripAccents(cleanGeneratedText(value).toLowerCase());
    const compactText = text.replace(/[.!?:;]+$/g, '').trim();

    return !text ||
        /class=|<\/|<div|<section|<article|function|const |let |var |=>/.test(text) ||
        /^(section|page|service|texte a ajuster|description a ajuster|a ajuster|contenu a ajuster)$/.test(compactText);
};
const normalizeDisplayText = (value) => {
    const text = cleanGeneratedText(value);

    return isWeakGeneratedText(text) ? '' : text;
};
const pickFirst = (values, fallback = '') => values.find((value) => normalize(value)) || fallback;
const getServiceKey = (value) =>
    stripAccents(normalizeText(value).toLowerCase())
        .replace(/\b(creation de|création de|installation et configuration|installation)\b/g, '')
        .replace(/\b(simple|professionnel|professionnelle)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const KIRBY_SYSTEM_PROMPT = `
Tu es Kirby SA Creation Web, directeur digital senior de SA Creation Web : strategie, identite de marque, experience utilisateur, contenu, conversion et lancement.
Mission unique : aider des independants, artisans, petites entreprises et porteurs de projets a demarrer leur presence en ligne.

Tu dois produire une vraie premiere proposition de site, pas un simple diagnostic ni un formulaire.
Tu analyses le besoin et tu prends l'initiative, meme si la description est courte.
Tu proposes un projet digital complet : positionnement, nom, slogan, modele de site conseille, direction visuelle, structure de site, textes principaux, SEO, services utiles, options pertinentes et logique commerciale pour attirer des clients.
Chaque proposition doit contenir assez de matiere pour donner l'impression que le projet commence deja a se construire.

Les champs du JSON sont tes leviers d'action : utilise ceux qui sont utiles pour livrer une direction directement exploitable dans l'aperçu. Quand une demande contient plusieurs changements, applique-les tous dans une proposition complete et coherente. Ne reponds jamais par une intention vague : prends une decision, produis le contenu et explique les choix. Les actions externes (publication, achat de domaine, paiement ou envoi a un tiers) restent soumises a la validation explicite de l'utilisateur.

Priorite creativite :
- La demande utilisateur complete est ta source principale. N'ecrase jamais ses details par un modele generique.
- Deduis et exploite explicitement le secteur, la cible, le style visuel, les couleurs, les sections utiles, l'ambiance et la logique de conversion.
- Les champs texte doivent etre du contenu final lisible par un client. N'ecris jamais de HTML, JSX, CSS, balises, classes, pseudo-code ou placeholders du type "Section" / "Texte a ajuster".
- Si une information manque, prends une initiative creative plausible et indique-la dans la proposition au lieu de rester vague.
- Cree une direction visuelle premium specifique au projet : composition du hero, ambiance, contraste, rythme des sections, type d'images, micro-interactions, details de confiance.
- Le resultat doit avoir un effet "waouh" commercial : moderne, clair, desirable, oriente action, jamais une page magazine decorative ni un formulaire pose sur un fond.
- Varie les sections, images conseillees, noms, CTA et mises en page selon le brief. Ne recycle pas toujours Accueil/Prestations/Contact si le projet appelle un parcours plus fort.
- Choisis une vraie variante de layout adaptee au secteur : cinematic-video, gallery-focus, minimal-editorial, luxury-asymmetric, product-dashboard, warm-editorial ou classic-conversion.
- Tu peux proposer une structure originale si elle sert mieux l'objectif client, mais garde le parcours compréhensible.

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
- Ne produis jamais une maquette generique type catalogue, pressing ou bloc administratif.
- Chaque proposition doit avoir une direction artistique identifiable et adaptee au metier : SaaS/digital, restaurant, coiffure, artisan, hotel, boutique, portfolio, etc.
- Ne propose jamais de page hors sujet. Exemple : pas de "Chambres" sauf hotel, gite, chambre d'hote ou hebergement.
- Pour un service digital, agence web, createur de site, IA, referencement, QR code, maintenance ou support technique : style moderne premium type SaaS, pages Accueil, Generateur IA ou Methode, Services, Exemples, Contact. Pas de boutique, pas de chambres, pas d'image mode.
- Pour un logiciel, une application SaaS ou un dashboard, surtout comptabilite, facturation, devis, depenses, TVA, banque ou documents : ne genere pas une vitrine marketing. Genere un produit applicatif avec sidebar, tableau de bord, KPI, graphiques, listes, taches, assistant IA et modules metier.
- Les images ou visuels conseilles doivent correspondre au secteur. Pour SA Creation Web : environnement digital, ordinateur, interface, equipe, maquette web, automatisation IA.
- Pour une estheticienne, institut, soins, massage, epilation, beaute ou bien-etre : style doux et elegant, couleurs beige/rose poudre/dore leger, sections Soins du visage, Massages, Epilations, Tarifs, Zone d'intervention, Prise de rendez-vous, Avis clientes, Galerie avant/apres si pertinent. Le mot "boutique" peut simplement vouloir dire activite : ne propose pas e-commerce, panier ou catalogue sauf si la demande parle clairement de vendre des produits en ligne.
- Pour un cabinet d'avocat : ambiance sobre, bleu fonce, blanc, confiance, pages Expertise, Honoraires, Rendez-vous, Contact. Pour une salle de sport : style energique, noir/orange, planning, coachs, abonnements, essai. Pour un restaurant italien : ambiance chaude, menu, reservation, photos, horaires, avis.
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
- Si l'utilisateur demande plus moderne, premium, clair, rassurant ou oriente conversion, change reellement la direction visuelle, les CTA, les sections et les textes. Ne te contente pas d'ajouter un mot.
- N'invente jamais de prix. Pour "priceFrom", utilise uniquement : "À partir de 392 €", "À partir de 712 €", "1 032 €", "149 €", "49 €", "À partir de 49 €", "39 €", "Inclus selon offre", "Projet spécifique", ou laisse vide.
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
  "visualConcept": {
    "heroComposition": "composition visuelle du premier ecran",
    "ambience": "ambiance precise",
    "colorPalette": ["couleur ou role couleur"],
    "imageKeywords": ["type d'image sectorielle a utiliser"],
    "layoutSignature": "signature de mise en page differenciante",
    "microInteractions": ["interaction discrete premium"],
    "wowFactor": "detail qui rend l'aperçu memorable"
  },
  "layoutVariant": "cinematic-video | gallery-focus | minimal-editorial | luxury-asymmetric | product-dashboard | warm-editorial | classic-conversion",
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

const KIRBY_CV_SYSTEM_PROMPT = `
Tu es Kirby, l'assistant CV senior de SA Creation Web. Tu aides a extraire, corriger et adapter un CV francais pour une candidature. Tu appliques toutes les demandes compatibles formulees dans une meme phrase, sans en ignorer une partie.

Regle de verite non negociable : le CV fourni est la seule source des faits. N'invente jamais un employeur, un poste occupe, une date, un diplome, une mission, un resultat, un permis, une langue ou un niveau de langue. Ne transforme jamais une competence attendue dans une offre en experience acquise.

Tu peux :
- extraire et normaliser les informations explicitement presentes ;
- reformuler une accroche a partir des faits du CV ;
- mettre en avant des competences transferables seulement lorsqu'elles sont etayees par le CV ;
- reordonner les experiences deja presentes pour faire apparaitre les plus pertinentes en premier ;
- relever les mots-cles de l'offre et proposer, dans "suggestedSkills", ceux que la personne peut ajouter uniquement si elle les a reellement pratiques ;
- detecter les langues. Conserve le niveau exact fourni dans le CV ou dans la demande utilisateur, y compris une formulation informelle comme "notions professionnelles". Si le niveau manque, laisse "level" vide, sans avertissement ni texte de blocage.
- verifier la qualite avant proposition : fautes evidentes, doublons de competences, repetitions, rubriques vides et risque de contenu trop long ;
- comprendre les actions de structure demandees directement par l utilisateur. Exemple : « supprime Projets », « retire Activites », « enleve cette competence » ou « corrige le trou sous Competences ». Une rubrique non vide ne peut etre retiree que si la demande le dit clairement. Pour une suppression de rubrique, renseigne layout.removeSections avec une ou plusieurs de ces cles exactes : summary, skills, experience, projects, education, activities, languages. Sinon retourne une liste vide.
- quand l utilisateur demande de retirer une competence precise ou des doublons, retourne dans skills la liste finale complete des competences restantes, sans ajouter de competence inventee. Pour un trou, un espace vide ou une demande de meilleure mise en page, mets layout.reflow a true. Ne force layout.compact a true que si l utilisateur demande explicitement un CV plus compact ou une seule page.
- ecrire une lettre de motivation courte et personnalisee uniquement a partir du CV, de l'offre et des informations de lettre fournies.

Quand la consigne contient un CV colle, traite-le comme une source factuelle supplementaire et remplis "extracted" avec les coordonnees, experiences, formations, langues et activites explicitement presentes. Ne lis jamais une offre d'emploi comme un CV. Une offre sert uniquement a adapter les elements deja prouves.

Pour les niveaux de langues, conserve la formulation explicite. Si elle correspond clairement a l'une de ces valeurs, normalise-la ainsi : Notions, Intermédiaire, Professionnel, Courant, Bilingue ou Langue maternelle. Ne choisis jamais un niveau a la place de la personne.

Les demandes courtes sont des actions, pas des questions a faire confirmer. Comprends notamment :
- "anglais notions professionnelles" : remplace le niveau d'anglais par "Notions professionnelles" ;
- "Francais courant, Anglais bases professionnelles" : retourne les deux langues avec leur niveau respectif ;
- "remplace vendeur par vendeuse" : remplace le titre cible par « Vendeuse » et adapte la forme associee si elle est presente (ex. « Vendeur polyvalent » devient « Vendeuse polyvalente »), sans modifier les faits des experiences ;
- "plus court" : raccourcis l'accroche et conserve les faits ;
- "enleve / pas besoin de Lifestyle" : retire Lifestyle du titre et de l'accroche, sans toucher aux experiences. Retourne toujours un titre de remplacement non vide, choisi parmi les intitulés réellement présents dans le CV ;
- "refais correctement" : produis une version CV claire, compacte et prete a l'emploi a partir des faits existants.

Pour l'adaptation a une offre, le titre exact de l'offre collee est prioritaire sur tout ancien titre du CV ou toute ancienne offre. Ne reutilise jamais un ancien intitulé : par exemple, une offre « Vendeur Polyvalent » doit produire « Vendeur polyvalent », et non « Vendeur Lifestyle ».

Pour un poste de vente ou de magasin (Vendeur Lifestyle, Vendeur polyvalent, etc.), valorise uniquement les preuves de relation client, conseil, accueil, autonomie et sens du service deja presentes. N'ajoute jamais vente, encaissement ou mise en rayon comme experience si le CV ne les prouve pas. Ces elements peuvent seulement etre proposes dans suggestedSkills avec la mention « a confirmer ».

Selon la tache demandee :
- "create" : transforme un CV colle ou des informations brutes en CV structure. Si les faits sont insuffisants, utilise extracted et suggestions pour indiquer exactement ce qui manque, sans creer de faux parcours.
- "optimize" ou "assistant" : corrige, compacte et deduplique le CV existant. Renseigne quality.fixes avec les controles realises.
- "adapt" : adapte titre, accroche, ordre des experiences et competences prouvees a l'offre. Produis aussi la lettre si la demande parle de lettre.
- "letter" : redige letter.subject et letter.body. La lettre doit etre directement utilisable, faire 900 caracteres maximum et ne jamais affirmer un fait absent du CV.

Le resultat doit rester court et tenir sur une page de CV : une accroche de 300 caracteres maximum, 10 competences appliquees maximum, 8 mots-cles et 6 suggestions maximum. Reponds uniquement avec un JSON valide, sans markdown.

Schema JSON obligatoire :
{
  "headline": "poste cible court ou chaine vide",
  "summary": "accroche reformulee a partir des faits ou chaine vide",
  "skills": ["competence prouvee par le CV"],
  "experienceOrder": ["intitule exact d'une experience existante"],
  "languages": [{"language": "Francais", "level": "niveau exact ou chaine vide"}],
  "extracted": {
    "fullName": "nom explicite ou chaine vide",
    "location": "ville explicite ou chaine vide",
    "phone": "telephone explicite ou chaine vide",
    "email": "email explicite ou chaine vide",
    "permit": "permis explicite ou chaine vide",
    "headline": "titre explicite ou chaine vide",
    "summary": "profil explicite ou chaine vide",
    "skills": ["competence explicitement presente"],
    "experiences": ["poste – employeur – dates • mission factuelle"],
    "projects": ["projet factuel explicitement present"],
    "education": ["formation factuelle"],
    "activities": ["activite explicitement presente"],
    "languages": [{"language": "Francais", "level": "niveau explicite ou chaine vide"}]
  },
  "jobTarget": "poste vise detecte ou chaine vide",
  "keywords": ["mot-cle de l'offre"],
  "suggestedSkills": ["competence a confirmer avant ajout"],
  "suggestions": ["action concrete et honnete"],
  "notice": "resume court de ce qui a ete adapte",
  "quality": {
    "fixes": ["controle ou correction realisee"],
    "warnings": ["information manquante a completer"]
  },
  "layout": {
    "removeSections": ["projects"],
    "reflow": false,
    "compact": false
  },
  "letter": {
    "subject": "Objet : Candidature",
    "body": "lettre de motivation complete ou chaine vide"
  }
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
    const needsArchitecture = /\b(architect|architecture|architecte|arquitecto|interieur|intérieur|design d interieur|design d'intérieur|decorateur|decoratrice|decoration|décoration|maitre d oeuvre|maître d oeuvre)\b/.test(lowerBrief);
    const needsQr = /\b(qr|qrcode|scan|scanner|flyer|partager)\b/.test(lowerBrief);
    const needsClientSpace = /\b(espace client|compte client|suivi|document|documents|connexion|prive|privé)\b/.test(lowerBrief);
    const needsAiAssistant = /\b(assistant|ia|automatiser|automatisation|questions|support|chat)\b/.test(lowerBrief);
    const nameBase = titleCase(activity.replace(/^site\s+/i, ''));
    const siteName = nameBase.length > 28 ? `Studio ${nameBase.split(/\s+/)[0]}` : nameBase;
    const mainAction = needsHotel ? 'Réserver une chambre' : needsMenu && needsAppointment ? 'Réserver une table' : needsMenu ? 'Voir la carte' : needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Demander une information';
    const pages = needsHotel ? [
        { name: 'Accueil', goal: "Présenter l'hôtel, l'ambiance et le bouton de réservation." },
        { name: 'Chambres', goal: 'Montrer les chambres, équipements, photos et capacités.' },
        { name: 'Tarifs', goal: 'Clarifier les prix, périodes, conditions ou disponibilités.' },
        { name: 'Réservation', goal: 'Permettre une demande de disponibilité ou une réservation.' },
        { name: 'Galerie', goal: "Rassurer avec les photos de l'hôtel, des chambres et des espaces." },
        { name: 'Localisation', goal: 'Afficher la ville, l’accès, Google Maps et les points d’intérêt.' },
        { name: 'Contact', goal: 'Donner téléphone, e-mail et formulaire.' },
    ] : needsMenu ? [
        { name: 'Accueil', goal: "Présenter le restaurant, l'ambiance et l'action principale." },
        { name: 'Menu / carte', goal: 'Afficher les plats, tarifs, formules ou carte à scanner.' },
        { name: 'Réservation', goal: 'Permettre de réserver une table ou demander une disponibilité.' },
        { name: 'Horaires', goal: "Clarifier les jours d'ouverture et les services midi/soir." },
        { name: 'Photos', goal: "Montrer la salle, les plats et l'ambiance." },
        { name: 'Avis clients', goal: 'Rassurer avec des preuves et retours clients.' },
        { name: 'Contact', goal: 'Donner adresse, téléphone, accès et formulaire.' },
    ] : needsArchitecture ? [
        { name: 'Accueil', goal: "Installer une image premium et présenter la signature du studio." },
        { name: 'Projets', goal: 'Montrer des réalisations, plans, matières et avant/après.' },
        { name: 'Services', goal: "Clarifier conception, rénovation, architecture intérieure ou suivi de projet." },
        { name: 'Philosophie', goal: 'Exprimer l’approche créative, les matériaux et le niveau d’exigence.' },
        { name: 'Équipe', goal: 'Présenter les profils et rassurer sur l’expertise.' },
        { name: 'Témoignages', goal: 'Mettre en avant des retours clients et preuves de confiance.' },
        { name: 'Contact', goal: 'Déclencher une demande de rendez-vous ou d’étude de projet.' },
    ] : [
        { name: 'Accueil', goal: "Faire comprendre l'activité et donner envie de continuer." },
        { name: needsShop ? 'Boutique' : 'Prestations', goal: needsShop ? 'Présenter les produits et guider vers la commande.' : 'Présenter clairement ce que le client peut acheter.' },
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

    if (needsMenu) {
        recommendedServices.push(
            { name: 'Réservation en ligne', reason: 'Utile si le client doit réserver une table rapidement.', priceFrom: 'Inclus selon offre' },
            { name: 'Galerie photos', reason: 'Les photos donnent envie avant la visite.', priceFrom: 'Inclus selon offre' },
            { name: 'Google Maps et avis clients', reason: 'Adresse, accès et avis rassurent avant de se déplacer.', priceFrom: 'Inclus selon offre' },
        );
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
        projectType: needsHotel ? 'Site hôtel avec réservation' : needsArchitecture ? 'Site premium pour studio d’architecture' : needsShop ? 'Boutique en ligne simple' : needsPortfolio ? 'CV ou portfolio en ligne' : needsAppointment ? 'Site avec prise de rendez-vous' : needsWordPress ? 'Site WordPress professionnel' : 'Site vitrine professionnel',
        layoutVariant: needsHotel ? 'cinematic-video' : needsArchitecture ? 'gallery-focus' : needsMenu ? 'warm-editorial' : needsShop ? 'classic-conversion' : 'classic-conversion',
        siteName,
        slogan: needsArchitecture ? 'Concevoir des espaces singuliers, durables et mémorables.' : needsShop ? `Des produits clairs, faciles à découvrir et commander.` : `Une présence claire pour présenter ${activity} et recevoir des contacts.`,
        summary: `Kirby propose de construire un site simple autour de ${activity}, avec un message direct, des pages utiles et un contact visible.`,
        valueProposition: `Un projet digital clair qui aide ${activity} à être trouvé, compris et contacté plus facilement.`,
        positioning: {
            audience: 'Clients locaux, visiteurs qui cherchent une solution rapide et prospects à rassurer.',
            promise: needsShop ? 'Découvrir les produits et passer à la commande sans friction.' : needsAppointment ? 'Comprendre les prestations et réserver un créneau facilement.' : 'Comprendre l’activité et contacter rapidement.',
            tone: 'Professionnel, direct et rassurant.',
            differentiator: 'Une structure simple, des options utiles et un accompagnement humain après la proposition IA.',
        },
        styleGuide: {
            direction: needsHotel ? 'Site immersif avec photos, chambres, disponibilité et réservation visible.' : needsArchitecture ? 'Portfolio architectural premium avec grands visuels, grille éditoriale et détails de matière.' : needsShop ? 'Catalogue clair avec produits visibles et parcours de commande court.' : needsAppointment ? 'Site élégant avec agenda ou contact visible dès le premier écran.' : 'Vitrine moderne, lisible et rassurante.',
            colors: 'Fond sobre, contraste fort, une couleur d’accent pour les boutons et les informations importantes.',
            typography: 'Titres francs, textes courts, lecture facile sur mobile.',
            layout: needsHotel ? 'Hero photo, chambres, tarifs, galerie, localisation, avis, réservation.' : needsArchitecture ? 'Hero visuel, projets sélectionnés, services, philosophie, témoignages, contact.' : 'Accueil direct, blocs courts, grille de prestations, preuves, puis contact.',
        },
        visualConcept: {
            heroComposition: needsHotel ? 'Hero immersif avec photo forte, disponibilité et appel à réserver.' : needsArchitecture ? 'Grand visuel architectural, typographie forte et CTA discret mais visible.' : 'Hero clair avec promesse, preuve visuelle et action principale visible.',
            ambience: needsHotel ? 'Premium accueillant, rassurant et sensoriel.' : needsArchitecture ? 'Minimal, lumineux, haut de gamme et orienté réalisations.' : needsAppointment ? 'Élégant, local et orienté rendez-vous.' : 'Moderne, clair et commercial.',
            colorPalette: ['fond profond ou clair selon secteur', 'accent lumineux pour les actions', 'contraste fort pour la lecture'],
            imageKeywords: [activity, needsHotel ? 'chambre lumineuse' : needsArchitecture ? 'architecture intérieure projet design' : needsAppointment ? 'service en action' : 'professionnel au travail', 'preuve visuelle réelle'],
            layoutSignature: needsHotel ? 'Parcours réservation avec galerie et localisation visibles.' : needsArchitecture ? 'Portfolio visuel avec cartes projets, détails et navigation élégante.' : 'Aperçu premium avec sections courtes, preuves et contact rapide.',
            microInteractions: ['bouton principal lumineux', 'cartes flottantes', 'transition douce entre sections'],
            wowFactor: 'Un premier écran qui donne immédiatement envie de continuer.',
        },
        siteModel: {
            name: needsHotel ? 'Modèle hôtel + réservation' : needsArchitecture ? 'Portfolio architecture premium' : needsShop ? 'Modèle catalogue + commande' : needsAppointment ? 'Modèle rendez-vous local' : 'Modèle vitrine professionnelle',
            description: needsHotel ? 'Une structure pensée pour montrer les chambres, rassurer, localiser et convertir vers la réservation.' : needsArchitecture ? 'Une expérience visuelle qui valorise les projets, la méthode et la prise de contact.' : needsShop ? 'Une page d’accueil qui mène vite vers le catalogue, les produits et la commande.' : needsAppointment ? 'Une page d’accueil centrée sur les prestations, les preuves et la prise de rendez-vous.' : 'Une vitrine claire pour expliquer l’activité, rassurer et obtenir une demande.',
            sections: [
                needsHotel ? 'Hero hôtel avec bouton Réserver' : 'Hero avec promesse et bouton principal',
                needsHotel ? 'Chambres et équipements' : needsArchitecture ? 'Projets sélectionnés' : needsShop ? 'Produits ou catégories' : 'Prestations principales',
                needsHotel ? 'Tarifs ou disponibilités' : needsArchitecture ? 'Méthode et philosophie' : needsPortfolio ? 'Réalisations ou portfolio' : 'Preuves de confiance',
                needsHotel ? 'Galerie et localisation' : needsArchitecture ? 'Contact projet' : needsAppointment ? 'Prise de rendez-vous' : 'Contact rapide',
            ],
        },
        recommendedOffer: needsHotel ? 'Offre Signature' : needsShop ? 'Offre Pro' : needsPortfolio ? 'Mini-page professionnelle' : needsAppointment ? 'Offre Pro' : needsWordPress ? 'Projet spécifique' : 'Offre Essentiel',
        pages,
        homeSections: needsArchitecture ? [
            { title: 'Projets sélectionnés', text: 'Une galerie éditoriale met en avant les réalisations, les volumes, les matières et les détails.' },
            { title: 'Architecture intérieure', text: 'Les services expliquent la conception, la rénovation, le suivi et l’accompagnement du projet.' },
            { title: 'Signature du studio', text: 'La philosophie, les inspirations et les preuves clients renforcent la valeur premium.' },
        ] : [
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

const isBeautyProject = (brief = '', proposal = {}) => {
    const source = stripAccents(normalizeText([
        brief,
        proposal.projectType,
        proposal.siteName,
        proposal.slogan,
        proposal.summary,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.siteModel && proposal.siteModel.name,
        ...(Array.isArray(proposal.pages) ? proposal.pages.map((page) => page && page.name) : []),
        ...(Array.isArray(proposal.services) ? proposal.services.map((service) => service && service.name) : []),
    ].filter(Boolean).join(' ')).toLowerCase());

    return /\b(estheticien|estheticienne|esthetique|beaute|massage|soin|soins|epilation|institut|spa|bien etre|bien-etre)\b/.test(source);
};

const getCatalogPrice = (serviceName = '', currentPrice = '') => {
    const key = getServiceKey(serviceName);

    if (/\bwordpress|wp|cms|refonte\b/.test(key)) {
        return 'Projet spécifique';
    }

    if (/\bboutique|e commerce|ecommerce|catalogue|commande|paiement\b/.test(key)) {
        return 'À partir de 712 €';
    }

    if (/\bsite vitrine|site web|creation site|site assiste\b/.test(key)) {
        return 'À partir de 392 €';
    }

    if (/\bmini page|mini-page\b/.test(key)) {
        return '149 €';
    }

    if (/\bqr|code\b/.test(key)) {
        return '39 €';
    }

    if (/\bemail|e mail|mail|adresse\b/.test(key)) {
        return '49 €';
    }

    if (/\bdomaine|nom de domaine\b/.test(key)) {
        return 'À partir de 49 €';
    }

    if (/\bformulaire|whatsapp|lien|contact\b/.test(key)) {
        return 'À partir de 49 €';
    }

    if (/\breservation|rendez|agenda|calendrier|espace client|assistant ia|ia metier|stripe|acompte|paiement\b/.test(key)) {
        return 'Projet spécifique';
    }

    if (/\bgalerie|google maps|avis\b/.test(key)) {
        return 'Inclus selon offre';
    }

    if (/[€$]/.test(currentPrice)) {
        return 'Projet spécifique';
    }

    return currentPrice;
};

const normalizeRecommendedServices = (proposal, fallback, context = {}) => {
    const blockShop = context.isBeauty && !/\b(vendre|vente|produit|produits|paiement|panier|catalogue en ligne|e commerce|ecommerce)\b/.test(stripAccents(normalizeText(context.brief || '').toLowerCase()));
    const services = limitArray(proposal.recommendedServices, 9)
        .map((service) => ({
            name: normalizeText(service && service.name) || 'Service SA Creation Web',
            reason: normalizeText(service && service.reason) || 'Utile pour le projet.',
            priceFrom: getCatalogPrice(
                normalizeText(service && service.name) || 'Service SA Creation Web',
                normalizeText(service && service.priceFrom) || '',
            ),
        }))
        .filter((service) => {
            if (!blockShop) {
                return true;
            }

            return !/\b(boutique|e commerce|ecommerce|catalogue|panier|commande|paiement)\b/.test(getServiceKey(service.name));
        })
        .filter((service) => service.name);
    const seen = new Set(services.map((service) => getServiceKey(service.name)));

    fallback.recommendedServices.forEach((service) => {
        const key = getServiceKey(service.name);

        if (blockShop && /\b(boutique|e commerce|ecommerce|catalogue|panier|commande|paiement)\b/.test(key)) {
            return;
        }

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

const normalizeVisualConcept = (proposal, fallback) => {
    const visualConcept = proposal.visualConcept && typeof proposal.visualConcept === 'object'
        ? proposal.visualConcept
        : {};
    const fallbackVisual = fallback.visualConcept && typeof fallback.visualConcept === 'object'
        ? fallback.visualConcept
        : {};

    return {
        heroComposition: normalizeText(visualConcept.heroComposition) || fallbackVisual.heroComposition || '',
        ambience: normalizeText(visualConcept.ambience) || fallbackVisual.ambience || '',
        colorPalette: limitArray(visualConcept.colorPalette || fallbackVisual.colorPalette, 6).map(normalizeText).filter(Boolean),
        imageKeywords: limitArray(visualConcept.imageKeywords || fallbackVisual.imageKeywords, 8).map(normalizeText).filter(Boolean),
        layoutSignature: normalizeText(visualConcept.layoutSignature) || fallbackVisual.layoutSignature || '',
        microInteractions: limitArray(visualConcept.microInteractions || fallbackVisual.microInteractions, 5).map(normalizeText).filter(Boolean),
        wowFactor: normalizeText(visualConcept.wowFactor) || fallbackVisual.wowFactor || '',
    };
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
            name: normalizeDisplayText(page && page.name),
            goal: normalizeDisplayText(page && page.goal),
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
    const normalizedSections = limitArray(sections, max).map(normalizeDisplayText).filter(Boolean);
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
    const beautyProject = isBeautyProject(brief, proposal);
    const requiredHotelPages = [
        { name: 'Accueil', goal: "Présenter l'hôtel, l'ambiance et le bouton de réservation." },
        { name: 'Chambres', goal: 'Montrer les chambres, équipements, photos et capacités.' },
        { name: 'Tarifs', goal: 'Clarifier les prix, périodes, conditions ou disponibilités.' },
        { name: 'Réservation', goal: 'Permettre une demande de disponibilité ou une réservation.' },
        { name: 'Galerie', goal: "Rassurer avec les photos de l'hôtel, des chambres et des espaces." },
        { name: 'Localisation', goal: 'Afficher la ville, l’accès, Google Maps et les points d’intérêt.' },
        { name: 'Contact', goal: 'Donner téléphone, e-mail et formulaire.' },
    ];
    let pages = hotelProject
        ? mergeRequiredPages(proposal.pages || fallback.pages, requiredHotelPages, 8)
        : mergeRequiredPages(proposal.pages || fallback.pages, [], 8);
    if (!pages.length) {
        pages = mergeRequiredPages(fallback.pages, hotelProject ? requiredHotelPages : [], 8);
    }
    const siteSections = hotelProject
        ? mergeRequiredSections((proposal.siteModel && proposal.siteModel.sections) || fallback.siteModel.sections, requiredHotelPages.map((page) => page.name), 8)
        : mergeRequiredSections((proposal.siteModel && proposal.siteModel.sections) || fallback.siteModel.sections, [], 6);
    const normalizedHomeSections = limitArray(proposal.homeSections, 5)
        .map((section) => ({
            title: normalizeDisplayText(section && section.title),
            text: normalizeDisplayText(section && section.text),
        }))
        .filter((section) => section.title && section.text);
    const fallbackHomeSections = limitArray(fallback.homeSections, 5)
        .map((section) => ({
            title: normalizeDisplayText(section && section.title),
            text: normalizeDisplayText(section && section.text),
        }))
        .filter((section) => section.title && section.text);
    const normalizedServices = limitArray(proposal.services, 5)
        .map((service) => ({
            name: normalizeDisplayText(service && service.name),
            description: normalizeDisplayText(service && service.description),
        }))
        .filter((service) => service.name && service.description);
    const fallbackServices = limitArray(fallback.services, 5)
        .map((service) => ({
            name: normalizeDisplayText(service && service.name),
            description: normalizeDisplayText(service && service.description),
        }))
        .filter((service) => service.name && service.description);

    return {
        mode: proposal.mode || 'openai',
        projectType: normalizeText(proposal.projectType) || fallback.projectType,
        siteName: normalizeText(proposal.siteName) || fallback.siteName,
        slogan: normalizeText(proposal.slogan) || fallback.slogan,
        summary: normalizeText(proposal.summary) || fallback.summary,
        valueProposition: normalizeText(proposal.valueProposition) || fallback.valueProposition,
        layoutVariant: normalizeDisplayText(proposal.layoutVariant) || fallback.layoutVariant || 'classic-conversion',
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
        visualConcept: normalizeVisualConcept(proposal, fallback),
        siteModel: {
            name: normalizeText(proposal.siteModel && proposal.siteModel.name) || fallback.siteModel.name,
            description: normalizeText(proposal.siteModel && proposal.siteModel.description) || fallback.siteModel.description,
            sections: siteSections,
        },
        recommendedOffer: normalizeText(proposal.recommendedOffer) || fallback.recommendedOffer,
        pages,
        homeSections: (normalizedHomeSections.length ? normalizedHomeSections : fallbackHomeSections).slice(0, 5),
        services: (normalizedServices.length ? normalizedServices : fallbackServices).slice(0, 5),
        ctas: limitArray(proposal.ctas, 5).map(normalizeText).filter(Boolean),
        seo: {
            keywords: limitArray((proposal.seo && proposal.seo.keywords) || proposal.seoKeywords || fallback.seo.keywords, 8).map(normalizeText).filter(Boolean),
            searchExpressions: limitArray((proposal.seo && proposal.seo.searchExpressions) || fallback.seo.searchExpressions, 6).map(normalizeText).filter(Boolean),
            titles: limitArray((proposal.seo && proposal.seo.titles) || fallback.seo.titles, 4).map(normalizeText).filter(Boolean),
            metaDescription: normalizeText(proposal.seo && proposal.seo.metaDescription) || fallback.seo.metaDescription,
        },
        seoKeywords: limitArray(proposal.seoKeywords || (proposal.seo && proposal.seo.keywords) || fallback.seoKeywords, 8).map(normalizeText).filter(Boolean),
        recommendedServices: normalizeRecommendedServices(proposal, fallback, { isBeauty: beautyProject, brief }),
        clientAcquisition: normalizeClientAcquisition(proposal, fallback),
        explanation: limitArray(proposal.explanation, 5).map(normalizeText).filter(Boolean),
        contactMessage: normalize(proposal.contactMessage) || fallback.contactMessage,
    };
};

const hasProposalItem = (items = [], name = '') => {
    const target = stripAccents(normalizeText(name).toLowerCase());

    return items.some((item) => stripAccents(normalizeText(item && (item.name || item.title || item.label || item)).toLowerCase()) === target);
};

const addProposalPage = (proposal, page) => {
    proposal.pages = limitArray(proposal.pages, 8);

    if (!hasProposalItem(proposal.pages, page.name)) {
        proposal.pages.push(page);
    }
};

const addProposalSection = (proposal, section) => {
    proposal.homeSections = limitArray(proposal.homeSections, 6);

    if (!hasProposalItem(proposal.homeSections, section.title)) {
        proposal.homeSections.push(section);
    }
};

const addProposalService = (proposal, service) => {
    proposal.recommendedServices = limitArray(proposal.recommendedServices, 9);

    if (!hasProposalItem(proposal.recommendedServices, service.name)) {
        proposal.recommendedServices.push(service);
    }
};

const addProposalCta = (proposal, cta) => {
    proposal.ctas = limitArray(proposal.ctas, 5);

    if (!proposal.ctas.some((item) => stripAccents(normalizeText(item).toLowerCase()) === stripAccents(normalizeText(cta).toLowerCase()))) {
        proposal.ctas.unshift(cta);
    }
};

const shortenProposalText = (value = '', max = 86) => {
    const text = normalizeText(value);

    if (text.length <= max) {
        return text;
    }

    return `${text.slice(0, max - 1).trim()}…`;
};

const applyFallbackRevision = (currentProposal, revision, brief) => {
    const proposal = currentProposal && typeof currentProposal === 'object'
        ? JSON.parse(JSON.stringify(currentProposal))
        : buildFallbackProposal(brief);
    const requested = stripAccents(normalizeText(revision).toLowerCase());
    const source = stripAccents(normalizeText(`${brief} ${revision}`).toLowerCase());

    if (/enleve|retire|supprime|simplifie|texte court|textes courts|pas de texte|moins de texte|bloc note/.test(requested)) {
        proposal.slogan = shortenProposalText(proposal.slogan, 58);
        proposal.summary = shortenProposalText(proposal.summary, 96);
        proposal.pages = limitArray(proposal.pages, 8).map((page) => ({
            ...page,
            goal: shortenProposalText(page && page.goal, 72),
        }));
        proposal.homeSections = limitArray(proposal.homeSections, 6).map((section) => ({
            ...section,
            text: shortenProposalText(section && section.text, 76),
        })).slice(0, /simplifie/.test(requested) ? 3 : 6);
    }

    if (/image|photo|galerie|visuel|portfolio/.test(requested)) {
        addProposalPage(proposal, { name: 'Photos', goal: 'Montrer des images fortes du lieu, des produits ou des réalisations.' });
        addProposalSection(proposal, { title: 'Galerie visuelle', text: 'Une section image met en avant les preuves visuelles du projet.' });
        addProposalService(proposal, { name: 'Galerie photos', reason: 'Utile pour rendre la proposition plus concrète et rassurante.', priceFrom: 'Inclus selon offre' });
    }

    if (/premium|luxe|elegant|elegance|signature|haut de gamme|plus beau|moderne/.test(requested)) {
        proposal.recommendedOffer = 'Offre Signature';
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = `Version premium - ${proposal.siteModel.name || proposal.projectType || 'site professionnel'}`;
        proposal.slogan = /restaurant|menu|carte/.test(source)
            ? 'Une expérience élégante à chaque visite.'
            : 'Une présence élégante, claire et mémorable.';
        addProposalSection(proposal, { title: 'Preuves de confiance', text: 'Avis, photos ou réalisations rassurent avant la prise de contact.' });
    }

    if (/italien|italienne|chaleureuse|chaleureux|chaud|terroir|dolce|trattoria|ambiance/.test(requested)) {
        proposal.styleGuide = proposal.styleGuide && typeof proposal.styleGuide === 'object' ? proposal.styleGuide : {};
        proposal.styleGuide.direction = 'Ambiance chaleureuse, premium et expressive.';
        proposal.styleGuide.colors = 'Tons chauds, crème, brun profond et accent doré.';
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = /restaurant|menu|carte/.test(source) ? 'Modèle restaurant chaleureux' : 'Modèle chaleureux premium';
        if (/restaurant|menu|carte/.test(source) && /restaurant|projet|presence/i.test(proposal.siteName || '')) {
            proposal.siteName = 'Saveurs du Terroir';
        }
    }

    if (/qr|scan|code/.test(requested)) {
        addProposalService(proposal, { name: 'QR code professionnel', reason: 'Utile pour scanner la carte, une page ou une offre depuis un support imprimé.', priceFrom: '39 €' });
        addProposalSection(proposal, { title: 'QR code', text: 'Un QR code donne accès rapidement à la page utile depuis une carte, vitrine ou flyer.' });
        if (/restaurant|menu|carte/.test(source)) {
            addProposalPage(proposal, { name: 'Menu / carte', goal: 'Afficher la carte consultable depuis le QR code.' });
        }
    }

    if (/reservation|reserver|rendez|rdv|agenda/.test(requested)) {
        addProposalPage(proposal, { name: /restaurant|menu|carte/.test(source) ? 'Réservation' : 'Rendez-vous', goal: 'Permettre au visiteur de réserver ou demander un créneau.' });
        addProposalService(proposal, { name: /restaurant|menu|carte/.test(source) ? 'Réservation en ligne' : 'Lien rendez-vous ou WhatsApp', reason: 'Le visiteur doit pouvoir agir sans chercher.', priceFrom: 'Inclus selon offre' });
        addProposalCta(proposal, /restaurant|menu|carte/.test(source) ? 'Réserver une table' : 'Prendre rendez-vous');
    }

    if (/horaire|heures|ouverture/.test(requested)) {
        addProposalPage(proposal, { name: 'Horaires', goal: 'Afficher les jours, heures et informations pratiques.' });
        addProposalSection(proposal, { title: 'Horaires', text: 'Les horaires et informations pratiques sont visibles rapidement.' });
    }

    if (/avis|temoignage|preuve|rassur/.test(requested)) {
        addProposalPage(proposal, { name: 'Avis clients', goal: 'Rassurer avec des retours clients ou preuves concrètes.' });
        addProposalSection(proposal, { title: 'Avis clients', text: 'Les avis renforcent la confiance avant la prise de contact.' });
    }

    return proposal;
};

const CV_ASSISTANT_TASKS = new Set(['autofill', 'create', 'optimize', 'adapt', 'letter', 'assistant']);
const CV_LAYOUT_SECTION_KEYS = new Set(['summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages']);

const limitCvText = (value, max = 360) => normalizeDisplayText(value).slice(0, max).trim();
const limitCvMultilineText = (value, max = 1600) =>
    normalize(value)
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<\/?[^>]+>/g, ' ')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .slice(0, max)
        .trim();

const toCvStringList = (value, max = 10, itemMax = 100) =>
    (Array.isArray(value) ? value : [])
        .map((item) => limitCvText(item, itemMax))
        .filter(Boolean)
        .filter((item, index, list) => list.findIndex((candidate) => stripAccents(candidate).toLowerCase() === stripAccents(item).toLowerCase()) === index)
        .slice(0, max);

const normalizeCvLanguage = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        const [language = '', ...levelParts] = value.split(/\s*[:–-]\s*/);
        const normalizedLanguage = limitCvText(language, 48);
        return normalizedLanguage
            ? { language: normalizedLanguage, level: limitCvText(levelParts.join(' '), 72) }
            : null;
    }

    if (typeof value === 'object') {
        const language = limitCvText(value.language || value.name, 48);
        return language
            ? { language, level: limitCvText(value.level || value.niveau, 72) }
            : null;
    }

    return null;
};

const getCvExperienceTitles = (experience = '') =>
    normalize(experience)
        .split(/\r?\n/)
        .map((line) => line.split('•')[0].split('|')[0].trim())
        .filter((line) => line.length > 2 && line.length < 110)
        .slice(0, 8);

const sanitizeCvExtraction = (value) => {
    const extracted = value && typeof value === 'object' ? value : {};
    const languages = (Array.isArray(extracted.languages) ? extracted.languages : [])
        .map(normalizeCvLanguage)
        .filter(Boolean)
        .filter((item, index, list) => list.findIndex((candidate) => stripAccents(candidate.language).toLowerCase() === stripAccents(item.language).toLowerCase()) === index)
        .slice(0, 5);

    return {
        fullName: limitCvText(extracted.fullName, 100),
        location: limitCvText(extracted.location, 120),
        phone: limitCvText(extracted.phone, 48),
        email: limitCvText(extracted.email, 120),
        permit: limitCvText(extracted.permit, 80),
        headline: limitCvText(extracted.headline, 90),
        summary: limitCvText(extracted.summary, 300),
        skills: toCvStringList(extracted.skills, 10, 80),
        experiences: toCvStringList(extracted.experiences, 8, 460),
        projects: toCvStringList(extracted.projects, 6, 360),
        education: toCvStringList(extracted.education, 6, 260),
        activities: toCvStringList(extracted.activities, 6, 160),
        languages,
    };
};

const sanitizeCvQuality = (value) => {
    const quality = value && typeof value === 'object' ? value : {};

    return {
        fixes: toCvStringList(quality.fixes, 5, 140),
        warnings: toCvStringList(quality.warnings, 4, 140),
    };
};

const normalizeCvLayoutSection = (value) => {
    const source = stripAccents(normalizeText(value).toLowerCase());

    if (/^profil|^accroche|^resume/.test(source)) return 'summary';
    if (/^competence|^skill/.test(source)) return 'skills';
    if (/^experience|^parcours/.test(source)) return 'experience';
    if (/^projet/.test(source)) return 'projects';
    if (/^formation|^certification|^diplome/.test(source)) return 'education';
    if (/^activite|^loisir|^centre.d.interet/.test(source)) return 'activities';
    if (/^langue/.test(source)) return 'languages';

    return CV_LAYOUT_SECTION_KEYS.has(source) ? source : '';
};

const sanitizeCvLayout = (value) => {
    const layout = value && typeof value === 'object' ? value : {};
    const removeSections = (Array.isArray(layout.removeSections) ? layout.removeSections : [])
        .map(normalizeCvLayoutSection)
        .filter(Boolean)
        .filter((item, index, list) => list.indexOf(item) === index)
        .slice(0, 4);

    return {
        removeSections,
        reflow: Boolean(layout.reflow),
        compact: Boolean(layout.compact),
    };
};

const sanitizeCvLetter = (value) => {
    const letter = value && typeof value === 'object' ? value : {};

    return {
        subject: limitCvText(letter.subject, 130),
        body: limitCvMultilineText(letter.body, 1100),
    };
};

const sanitizeCvAssistantResult = (result, cv = {}) => {
    const sourceExperienceTitles = getCvExperienceTitles(cv.experience);
    const sourceTitlesByNormalized = new Map(
        sourceExperienceTitles.map((title) => [stripAccents(title).toLowerCase(), title])
    );
    const orderedTitles = toCvStringList(result && result.experienceOrder, 8, 110)
        .map((title) => sourceTitlesByNormalized.get(stripAccents(title).toLowerCase()))
        .filter(Boolean);
    const languages = (Array.isArray(result && result.languages) ? result.languages : [])
        .map(normalizeCvLanguage)
        .filter(Boolean)
        .filter((item, index, list) => list.findIndex((candidate) => stripAccents(candidate.language).toLowerCase() === stripAccents(item.language).toLowerCase()) === index)
        .slice(0, 5);

    return {
        headline: limitCvText(result && result.headline, 90),
        summary: limitCvText(result && result.summary, 300),
        skills: toCvStringList(result && result.skills, 10, 80),
        experienceOrder: [...orderedTitles, ...sourceExperienceTitles.filter((title) => !orderedTitles.includes(title))],
        languages,
        extracted: sanitizeCvExtraction(result && result.extracted),
        jobTarget: limitCvText(result && result.jobTarget, 90),
        keywords: toCvStringList(result && result.keywords, 8, 60),
        suggestedSkills: toCvStringList(result && result.suggestedSkills, 8, 80),
        suggestions: toCvStringList(result && result.suggestions, 6, 180),
        notice: limitCvText(result && result.notice, 260),
        quality: sanitizeCvQuality(result && result.quality),
        layout: sanitizeCvLayout(result && result.layout),
        letter: sanitizeCvLetter(result && result.letter),
    };
};

const getCvRoleFromText = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());

    if (/\bvendeuse?\s+lifestyle\b/.test(source)) {
        return 'Vendeur Lifestyle';
    }
    if (/\bvendeuse\s+polyvalente\b/.test(source)) {
        return 'Vendeuse polyvalente';
    }
    if (/\bvendeur\s+polyvalent\b/.test(source)) {
        return 'Vendeur polyvalent';
    }
    if (/\bvendeuse\b/.test(source)) {
        return 'Vendeuse';
    }
    if (/\bvendeur\b/.test(source)) {
        return 'Vendeur';
    }
    if (/\bemploye\s+polyvalent\b/.test(source)) {
        return 'Employé polyvalent';
    }
    if (/\bemploye\b/.test(source) && /\bmagasin|boutique|rayon\b/.test(source)) {
        return 'Employé de magasin';
    }
    if (/\bconseill(?:er|ere|ère)|relation client|service client\b/.test(source)) {
        return 'Conseiller clientèle';
    }
    if (/\bassistante?|administratif|dossiers?\b/.test(source)) {
        return 'Assistant administratif';
    }
    if (/\bconduct(?:eur|rice)|transport|machiniste|receveur\b/.test(source)) {
        return 'Conducteur de transport';
    }

    return '';
};

const getRequestedCvRole = ({ task, jobOffer = '', instruction = '' } = {}) => {
    if (task !== 'adapt') {
        return '';
    }

    const normalizedInstruction = stripAccents(normalize(instruction).toLowerCase());
    const isRemovalRequest = /\b(supprime|supprimer|retire|retirer|enleve|enlever|efface|effacer)\b|pas besoin de/.test(normalizedInstruction);
    if (isRemovalRequest) {
        return '';
    }

    return getCvRoleFromText(instruction) || getCvRoleFromText(jobOffer);
};

const finalizeCvAssistantResult = ({ result, cv, task, jobOffer, instruction }) => {
    const assistantResult = sanitizeCvAssistantResult(result, cv);
    const requestedRole = getRequestedCvRole({ task, jobOffer, instruction });

    if (!requestedRole) {
        return assistantResult;
    }

    return {
        ...assistantResult,
        headline: requestedRole,
        jobTarget: requestedRole,
    };
};

const getCvLanguagesFromText = (value = '') => {
    const knownLanguages = ['Français', 'Anglais', 'Arabe', 'Espagnol', 'Italien', 'Allemand', 'Portugais'];
    const source = normalize(value);

    return knownLanguages
        .filter((language) => new RegExp(`\\b${stripAccents(language)}\\b`, 'i').test(stripAccents(source)))
        .map((language) => {
            const line = source.split(/\r?\n/).find((item) => new RegExp(`\\b${stripAccents(language)}\\b`, 'i').test(stripAccents(item))) || language;
            const [, level = ''] = line.split(/\s*[:–-]\s*/);
            return { language, level: limitCvText(level, 72) };
        });
};

const buildFallbackCvLetter = ({ cv, jobOffer, instruction, letter, role }) => {
    const company = limitCvText(letter?.company, 100) || 'votre entreprise';
    const targetRole = limitCvText(letter?.role, 90) || role || limitCvText(cv.headline, 90) || 'poste visé';
    const profile = limitCvText(cv.summary, 300);
    const skills = toCvStringList(normalize(cv.skills).split(/\r?\n/), 4, 80).join(', ');
    const motivation = limitCvText(letter?.motivation || instruction, 220)
        || 'mettre mes compétences au service de votre équipe';
    const body = [
        'Madame, Monsieur,',
        `Je vous adresse ma candidature pour le poste de ${targetRole} au sein de ${company}.`,
        profile || 'Mon parcours m’a permis de développer une approche professionnelle, rigoureuse et orientée service.',
        skills ? `Mes compétences en ${skills} me permettront de contribuer avec sérieux à vos besoins.` : '',
        `Je souhaite aujourd’hui ${motivation.replace(/[.!?]+$/g, '').trim()}.`,
        'Je serais ravie de pouvoir échanger avec vous.',
        'Cordialement,',
    ].filter(Boolean).join('\n\n');

    return {
        subject: `Objet : Candidature – ${targetRole}`,
        body,
    };
};

const buildFallbackCvAssistant = ({ task, cv, jobOffer, instruction, letter = {} }) => {
    const source = [cv.headline, cv.summary, cv.skills, cv.experience, cv.projects, instruction, jobOffer].filter(Boolean).join(' ');
    const normalizedSource = stripAccents(source.toLowerCase());
    const role = getCvRoleFromText(jobOffer) || getCvRoleFromText(instruction) || getCvRoleFromText(cv.headline);
    const isRetailRole = /^(Vendeur|Vendeuse|Employé|Employée)/.test(role);
    const existingSkills = normalize(cv.skills).split(/\r?\n/).map((item) => limitCvText(item, 80)).filter(Boolean);
    const skills = [...existingSkills];
    const suggestedSkills = [];
    const suggestions = [];

    if (/\b(client|clientele|accueil|conseil|commercial)\b/.test(normalizedSource)) {
        ['Relation client', 'Conseil client', 'Sens du service'].forEach((skill) => {
            if (!skills.some((item) => stripAccents(item).toLowerCase() === stripAccents(skill).toLowerCase())) {
                skills.push(skill);
            }
        });
    }

    if (/\b(autonome|autonomie)\b/.test(normalizedSource) && !skills.some((item) => /autonom/i.test(item))) {
        skills.push('Autonomie');
    }

    if (isRetailRole) {
        ['Vente', 'Encaissement', 'Mise en rayon'].forEach((skill) => {
            if (!normalizedSource.includes(stripAccents(skill).toLowerCase())) {
                suggestedSkills.push(`${skill} - à confirmer`);
            }
        });
    }

    const languages = getCvLanguagesFromText(cv.languages || `${cv.summary || ''}\n${cv.experience || ''}`);
    if (!languages.length) {
        suggestions.push('Ajoutez vos langues et un niveau exact : par exemple Français : langue maternelle, Anglais : bases professionnelles.');
    } else if (languages.some((language) => !language.level)) {
        suggestions.push('Précisez le niveau des langues détectées avant l’export.');
    }

    const keywords = normalize(jobOffer)
        .split(/[^A-Za-zÀ-ÿ0-9+#.-]+/)
        .filter((word) => word.length > 4)
        .slice(0, 8);
    const hasCustomerEvidence = /\b(client|clientele|accueil|conseil|commercial)\b/.test(normalizedSource);
    const summary = isRetailRole && hasCustomerEvidence
        ? 'Professionnelle de la relation client, organisée et autonome, mettant à profit son sens du service, son écoute et son conseil pour accompagner chaque client.'
        : limitCvText(cv.summary, 300);
    const normalizedInstruction = stripAccents(normalize(instruction).toLowerCase());
    const layout = {
        removeSections: [],
        reflow: /\b(trou|espace vide|mise en page|equilibr|reequilibr|remonter|reorganis)\b/.test(normalizedInstruction),
        compact: /\b(compact|compacter|une page)\b/.test(normalizedInstruction),
    };
    const fallbackLetter = task === 'letter' || /\blettre|motivation\b/i.test(instruction)
        ? buildFallbackCvLetter({ cv, jobOffer, instruction, letter, role })
        : { subject: '', body: '' };

    return sanitizeCvAssistantResult({
        headline: task === 'adapt' && role ? role : cv.headline,
        summary,
        skills,
        experienceOrder: getCvExperienceTitles(cv.experience),
        languages,
        extracted: {
            fullName: cv.fullName,
            location: cv.location,
            phone: cv.phone,
            email: cv.email,
            permit: cv.permit,
            headline: cv.headline,
            summary: cv.summary,
            skills: existingSkills,
            experiences: normalize(cv.experience).split(/\r?\n/).filter(Boolean),
            projects: normalize(cv.projects).split(/\r?\n/).filter(Boolean),
            education: normalize(cv.education).split(/\r?\n/).filter(Boolean),
            activities: normalize(cv.activities).split(/\r?\n/).filter(Boolean),
            languages,
        },
        jobTarget: role || cv.headline,
        keywords,
        suggestedSkills,
        suggestions,
        quality: {
            fixes: ['Compétences et sections analysées avant proposition.'],
            warnings: languages.some((language) => !language.level)
                ? ['Un niveau de langue reste à préciser.']
                : [],
        },
        layout,
        letter: fallbackLetter,
        notice: role
            ? `Adaptation ${role} réalisée à partir des éléments présents dans le CV.`
            : 'Informations détectées et harmonisées à partir du CV.',
    }, cv);
};

const buildOpenAiCvPrompt = ({ task, cv, jobOffer, instruction, letter }) => [
    `Tache : ${task === 'autofill'
        ? 'extraire et pre-remplir le CV colle par l utilisateur'
        : task === 'create'
            ? 'construire un CV structure a partir des informations brutes fournies'
            : task === 'optimize'
                ? 'corriger, dedupliquer et optimiser ce CV avant application'
                : task === 'adapt'
                    ? 'adapter ce CV a un poste ou une offre'
                    : task === 'letter'
                        ? 'rediger une lettre de motivation exploitable avec ce CV'
                        : 'corriger et ameliorer ce CV'}.`,
    'Donnees du CV (faits a respecter) :',
    JSON.stringify(cv, null, 2),
    jobOffer ? `Offre ou poste cible :\n${jobOffer}` : '',
    instruction ? `Consigne utilisateur :\n${instruction}` : '',
    letter && Object.values(letter).some(Boolean) ? `Contexte de la lettre :\n${JSON.stringify(letter, null, 2)}` : '',
    task === 'autofill'
        ? 'La consigne peut contenir un CV brut. Remplis extracted avec les faits trouves dans ce texte, sans inventer ni completer les informations manquantes.'
        : '',
    task === 'adapt'
        ? 'L offre ne doit jamais devenir une experience, une competence acquise ou un niveau de langue. Elle sert seulement a choisir les elements du CV a mettre en avant.'
        : '',
    task === 'letter'
        ? 'La lettre est obligatoire dans le resultat. Reste precise, courte et honnete : aucun resultat, outil ou experience non present dans le CV.'
        : '',
    'Respecte strictement le schema du systeme. Les intitules dans experienceOrder doivent etre les intitules exacts du CV source.',
].filter(Boolean).join('\n\n');

const requestOpenAiCvAssistant = async ({ apiKey, model, task, cv, jobOffer, instruction, letter }) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            ...getOpenAiGenerationControls(model, {
                temperature: 0.2,
                max_tokens: 1100,
            }),
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: KIRBY_CV_SYSTEM_PROMPT },
                { role: 'user', content: buildOpenAiCvPrompt({ task, cv, jobOffer, instruction, letter }) },
            ],
        }),
    });

    if (!response.ok) {
        const error = new Error('openai_cv_request_failed');
        error.status = response.status;
        throw error;
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content || '';
    return parseOpenAiJson(content);
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

const isCurrentReasoningModel = (model = '') => /^gpt-5(?:\.|$)/i.test(normalize(model));

const getOpenAiGenerationControls = (model, legacyControls = {}) =>
    isCurrentReasoningModel(model) ? {} : legacyControls;

const inferOpenAiBriefContext = (brief = '') => {
    const source = stripAccents(normalizeText(brief).toLowerCase());
    const sector = getActivityWords(brief);
    const styleHints = [
        /\bpremium|haut de gamme|luxe|elegant|élégant|moderne|waouh|wow\b/.test(source) ? 'premium moderne' : '',
        /\brassurant|confiance|professionnel|serieux|sérieux\b/.test(source) ? 'rassurant' : '',
        /\bdoux|beige|rose|bien etre|bien-être|soin|spa\b/.test(source) ? 'doux bien-être' : '',
        /\bbleu nuit|etoile|étoile|cosmique|futuriste|ia|digital\b/.test(source) ? 'bleu nuit digital immersif' : '',
        /\bchaleureux|italien|restaurant|terroir|convivial\b/.test(source) ? 'chaleureux commercial' : '',
    ].filter(Boolean);
    const sectionHints = [
        /\btarif|prix|offre|formule|abonnement\b/.test(source) ? 'tarifs/offres' : '',
        /\brdv|rendez|reservation|réservation|agenda\b/.test(source) ? 'prise de rendez-vous ou réservation' : '',
        /\bphoto|image|galerie|portfolio|realisation|réalisation\b/.test(source) ? 'galerie/preuves visuelles' : '',
        /\bavis|temoignage|témoignage|preuve|confiance\b/.test(source) ? 'avis/preuves de confiance' : '',
        /\bseo|google|local|ville|près|pres\b/.test(source) ? 'référencement local' : '',
        /\bcontact|whatsapp|telephone|téléphone|email|mail\b/.test(source) ? 'contact direct' : '',
    ].filter(Boolean);
    const targetHints = [
        /\bcliente|clientes|client[eè]le|clients|prospect|visiteur|utilisateur\b/.test(source) ? 'clients/prospects mentionnés dans le brief' : '',
        /\bindependant|indépendant|artisan|tpe|pme|freelance\b/.test(source) ? 'indépendants, TPE ou clientèle locale' : '',
        /\bfemme|femmes|mariage|beauté|beaute\b/.test(source) ? 'clientèle féminine ou beauté' : '',
    ].filter(Boolean);
    const moodHints = [
        /\bbleu nuit|etoile|étoile|cosmique|univers|halo|verre|glass|transparent\b/.test(source) ? 'univers bleu nuit, halos, verre dépoli' : '',
        /\bminimal|sobre|clair|epure|épuré\b/.test(source) ? 'sobre et lisible' : '',
        /\benergie|sport|fitness|dynamique\b/.test(source) ? 'énergique et rythmé' : '',
        /\brestaurant|italien|cuisine|menu\b/.test(source) ? 'sensoriel, chaleureux et appétissant' : '',
    ].filter(Boolean);

    return {
        sector,
        likelyTarget: targetHints.join(', ') || 'à déduire du brief',
        styleHints,
        sectionHints,
        moodHints,
        qualityGoal: 'expérience premium, moderne, commerciale, visuellement mémorable, avec contrôle utilisateur',
    };
};

const buildOpenAiUserPrompt = ({ brief, revision, currentProposal }) => {
    const inferredContext = inferOpenAiBriefContext(brief);
    const parts = [
        'Demande utilisateur complete, a respecter sans la reduire :',
        brief,
        '',
        'Indices deduits automatiquement a exploiter sans brider ta creativite :',
        JSON.stringify(inferredContext, null, 2),
        '',
        [
            'Ta mission : produire une proposition qui donne envie au client de dire "c’est beau, moderne, je veux continuer".',
            'Ne remplis pas un template fixe. Cree une direction artistique et commerciale propre a ce projet.',
            'Inclue explicitement secteur, cible, style visuel, couleurs, sections, ambiance, images conseillees, hierarchie, CTA, SEO et raisons des choix.',
            'La proposition doit pouvoir alimenter un aperçu visuel premium : hero fort, cartes ou modules utiles, image sectorielle pertinente, preuve de confiance, action principale claire.',
            'Si le brief parle du fond bleu nuit étoilé, verre, halos ou univers premium, exploite cette base au lieu de proposer des cadres opaques.',
        ].join('\n'),
    ];

    if (revision) {
        parts.push('Modification demandee par l utilisateur, a appliquer a toute la proposition :');
        parts.push(revision);
        parts.push('Regenere une proposition complete et coherente. Ne fais pas une correction locale.');
    }

    if (currentProposal) {
        parts.push('Proposition precedente a ameliorer sans copier-coller aveugle :');
        parts.push(JSON.stringify(currentProposal).slice(0, 7000));
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
            ...getOpenAiGenerationControls(model, {
                temperature: 0.92,
                top_p: 0.95,
                presence_penalty: 0.25,
                frequency_penalty: 0.15,
            }),
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

const getOpenAiModels = () => {
    const configured = normalize(process.env.KIRBY_OPENAI_MODEL_LIST || process.env.KIRBY_OPENAI_MODELS || process.env.KIRBY_OPENAI_MODEL);
    const models = configured
        ? configured.split(',').map(normalize).filter(Boolean)
        : ['gpt-5.4', 'gpt-5.4-mini', 'gpt-5.5'];

    return [...new Set(models)];
};

const getOpenAiCvModels = () => {
    const configured = normalize(process.env.KIRBY_CV_OPENAI_MODEL || process.env.KIRBY_CV_OPENAI_MODELS);
    const models = configured
        ? configured.split(',').map(normalize).filter(Boolean)
        : ['gpt-5.4', 'gpt-5.4-mini', 'gpt-5.5'];

    return [...new Set(models)];
};

const callOpenAi = async ({ brief, revision, currentProposal }) => {
    const apiKeys = getOpenAiKeys();

    if (!apiKeys.length) {
        return null;
    }

    const models = getOpenAiModels();
    const errors = [];

    for (const apiKey of apiKeys) {
        for (const model of models) {
            try {
                return {
                    proposal: await requestOpenAiProposal({ apiKey, model, brief, revision, currentProposal }),
                    model,
                };
            } catch (error) {
                errors.push({
                    code: error && error.message ? error.message : 'openai_request_failed',
                    status: error && error.status ? error.status : undefined,
                    model,
                });
            }
        }
    }

    const finalError = new Error('openai_request_failed');
    finalError.statuses = errors.map((error) => error.status).filter(Boolean);
    finalError.models = errors.map((error) => error.model).filter(Boolean);
    throw finalError;
};

const callOpenAiCvAssistant = async ({ task, cv, jobOffer, instruction, letter }) => {
    const apiKeys = getOpenAiKeys();

    if (!apiKeys.length) {
        return null;
    }

    const models = getOpenAiCvModels();
    const errors = [];

    for (const apiKey of apiKeys) {
        for (const model of models) {
            try {
                return {
                    result: await requestOpenAiCvAssistant({ apiKey, model, task, cv, jobOffer, instruction, letter }),
                    model,
                };
            } catch (error) {
                errors.push({ status: error && error.status, model });
            }
        }
    }

    const finalError = new Error('openai_cv_request_failed');
    finalError.statuses = errors.map((error) => error.status).filter(Boolean);
    finalError.models = errors.map((error) => error.model).filter(Boolean);
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

    if (payload.mode === 'cv') {
        const task = CV_ASSISTANT_TASKS.has(payload.task) ? payload.task : 'assistant';
        const sourceCv = payload.cv && typeof payload.cv === 'object' ? payload.cv : {};
        const cv = {
            fullName: limitCvText(sourceCv.fullName, 100),
            location: limitCvText(sourceCv.location, 120),
            phone: limitCvText(sourceCv.phone, 48),
            email: limitCvText(sourceCv.email, 120),
            permit: limitCvText(sourceCv.permit, 80),
            headline: limitCvText(sourceCv.headline, 120),
            summary: limitCvMultilineText(sourceCv.summary, 700),
            skills: limitCvMultilineText(sourceCv.skills, 1200),
            experience: limitCvMultilineText(sourceCv.experience, 5000),
            projects: limitCvMultilineText(sourceCv.projects, 1800),
            education: limitCvMultilineText(sourceCv.education, 1400),
            languages: limitCvMultilineText(sourceCv.languages, 600),
            activities: limitCvMultilineText(sourceCv.activities, 900),
        };
        const jobOffer = limitCvMultilineText(payload.jobOffer, 5000);
        const instruction = limitCvMultilineText(payload.instruction, 9000);
        const sourceLetter = payload.letter && typeof payload.letter === 'object' ? payload.letter : {};
        const letter = {
            company: limitCvText(sourceLetter.company, 100),
            role: limitCvText(sourceLetter.role, 90),
            motivation: limitCvText(sourceLetter.motivation, 240),
            style: limitCvText(sourceLetter.style, 24),
        };

        if (!Object.values(cv).some(Boolean) && !jobOffer && !instruction) {
            return json(response, 400, { error: 'cv_too_short' });
        }

        try {
            const openAiResult = await callOpenAiCvAssistant({ task, cv, jobOffer, instruction, letter });

            if (openAiResult) {
                return json(response, 200, {
                    ok: true,
                    source: 'openai',
                    model: openAiResult.model,
                    cv: finalizeCvAssistantResult({
                        result: openAiResult.result,
                        cv,
                        task,
                        jobOffer,
                        instruction,
                    }),
                });
            }
        } catch (error) {
            console.error('Kirby CV OpenAI failed:', {
                code: error && error.message ? error.message : 'openai_cv_request_failed',
                statuses: error && error.statuses ? error.statuses : undefined,
            });
        }

        return json(response, 200, {
            ok: true,
            source: 'fallback',
            cv: buildFallbackCvAssistant({ task, cv, jobOffer, instruction, letter }),
        });
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
                source: 'openai',
                model: openAiProposal.model,
                proposal: sanitizeProposal(openAiProposal.proposal, brief),
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
        source: 'fallback',
        proposal: sanitizeProposal(
            revision ? applyFallbackRevision(currentProposal || buildFallbackProposal(brief), revision, brief) : buildFallbackProposal(brief),
            brief,
        ),
    });
};
