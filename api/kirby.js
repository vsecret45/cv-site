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
const isKidsEducationBrief = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());
    const explicitKids = /\b(enfant|enfants|kid|kids|application enfant|app enfant|ecole maternelle|maternelle|creche|crèche|comptine|comptines|mini jeu|mini-jeu|jeux educatifs?|jeu educatif|espace parent|luna|leo|léo)\b/.test(source);
    const educationTerms = /\b(educatif|educative|education|apprendre|apprentissage|histoire|histoires|parent|parents)\b/.test(source);
    const childContext = /\b(enfant|enfants|kid|kids|maternelle|ecole|creche|crèche|comptine|comptines|mini jeu|mini-jeu|jeux?|luna|leo|léo)\b/.test(source);

    return explicitKids || (educationTerms && childContext);
};
const hasLuminaCreativeIntent = (value = '') => /\b(figma make|make de figma|make figma|canvas|canvas pro|apple|macos|figma|lumina|luma|futur|future|futuriste|3d|4d|immersif|immersive|motion|anime|animé|animation|animations|waouh|wow|glass|glassmorphism|verre depoli|verre dépoli|transparent|transparence|translucide|surface|surfaces|holographique|artistique)\b/.test(stripAccents(normalizeText(value).toLowerCase()));
const hasSurfaceDesignIntent = (value = '') => /\b(figma make|make de figma|make figma|canvas pro|apple|macos|figma|lumina|luma|glass|glassmorphism|verre depoli|verre dépoli|transparent|transparence|translucide|surface|surfaces|4d|holographique)\b/.test(stripAccents(normalizeText(value).toLowerCase()));
const isBridalCoutureBrief = (value = '') => /\b(robe|robes|robe de mariee|robe de mariage|mariee|mariée|mariage|couture|haute couture|atelier couture|createur de robe|créateur de robe|creatrice de robe|créatrice de robe|collection mariee|collection mariée|bridal|wedding dress|essayage|essayages|voile|voiles|dentelle|soie|broderie|tulle|satin)\b/.test(stripAccents(normalizeText(value).toLowerCase()));
const hasFutureBankIntent = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());
    return /\b(banque|bank|credits|crédits|coffres|coffre|financier|finance)\b/.test(source)
        && /\b(lune|lunaire|mars|colonies|colonie|interplanetaire|interplanétaire|orbital|spatial|spatiale|cosmos)\b/.test(source);
};
const hasAccountingIntent = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());
    const accountingTerms = /\b(contadirect|compta|comptabilite|comptable|facture|factures|facturation|devis|tva|revenu|revenus|depense|depenses|charge|charges|transaction|transactions|tresorerie|resultat net|bilan|logiciel de compta|logiciel comptable|tableau de bord comptable|documents comptables)\b/.test(source);
    const bankAccountingContext = /\b(banque|bank|transactions?)\b/.test(source)
        && /\b(facture|factures|tva|compta|comptable|depense|depenses|revenu|revenus|tresorerie|devis|justificatif|justificatifs)\b/.test(source);

    return !hasFutureBankIntent(value) && (accountingTerms || bankAccountingContext);
};
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
- Analyse uniquement la demande libre utilisateur avant de generer.
- Etape interne obligatoire avant generation :
    1) identifier le type de projet principal,
    2) identifier le secteur principal,
    3) extraire seulement les besoins reellement mentionnes,
    4) ecarter tout bloc incompatible,
    5) produire une seule direction coherente de bout en bout.
- Les exemples de metiers, sections ou fonctionnalites servent de reference interne. Ils ne doivent jamais etre injectes automatiquement si le brief ne les demande pas.
- Deduis et exploite explicitement le secteur, la cible, le style visuel, les couleurs, les sections utiles, l'ambiance et la logique de conversion.
- Les champs texte doivent etre du contenu final lisible par un client. N'ecris jamais de HTML, JSX, CSS, balises, classes, pseudo-code ou placeholders du type "Section" / "Texte a ajuster".
- Si une information manque, prends une initiative creative plausible et indique-la dans la proposition au lieu de rester vague.
- Cree une direction visuelle premium specifique au projet : composition du hero, ambiance, contraste, rythme des sections, type d'images, micro-interactions, details de confiance.
- Le resultat doit avoir un effet "waouh" commercial : moderne, clair, desirable, oriente action, jamais une page magazine decorative ni un formulaire pose sur un fond.
- Une generation doit parfois surprendre l'utilisateur par une composition, une mise en scene ou une idee visuelle qu'il n'aurait pas imaginee lui-meme, tout en restant adaptee au metier. Cette surprise doit venir du secteur : matiere, lieu, geste, objet, parcours, donnees ou rituel client, jamais d'un effet gratuit.
- Si le metier est rare, hybride ou invente, ne le ramene pas a "services / prestations / contact" par defaut. Extrais les indices concrets du brief, choisis un objet ou rituel central plausible, invente une mise en scene premium coherente, puis cree des pages et sections propres a ce monde.
- Separe toujours le nom/marque du scenario metier. Le nom peut etre invente ou peu important ; il ne doit pas dicter la maquette. Ce qui guide le rendu : le metier demande, le rituel client, les objets visibles, les preuves, l'ambiance et l'action attendue.
- Varie les sections, images conseillees, noms, CTA et mises en page selon le brief. Ne recycle pas toujours Accueil/Prestations/Contact si le projet appelle un parcours plus fort.
- Choisis d'abord une direction visuelle, puis seulement ensuite les sections : Apple/macOS glass, Figma/Lumina premium, startup futuriste, hotel premium, restaurant chaleureux, education enfant, cabinet juridique, comptabilite moderne, etc. Ces familles sont des inspirations, pas des templates figes.
- Les rendus ambitieux doivent tendre vers deux familles premium : Canvas pro ou Lumina. Canvas pro = composition éditoriale très visuelle, grandes images, modules superposés, scène métier claire, rythme de présentation type design deck haut de gamme. Lumina = surfaces transparentes, verre, profondeur 4D, lumière cyan/turquoise, panneaux flottants, assistant IA ou données visibles. Choisis la famille selon le métier et le brief.
- Niveau de finition attendu : une maquette doit donner l'impression d'une creation Figma Make/Canvas pro, avec surface principale travaillée, hierarchie nette, produit ou metier impossible a quitter des yeux, espacements maitrises, contraste lisible, détails premium et aucune zone remplie par habitude.
- Avant de retourner le JSON, fais un controle qualite interne : si le premier ecran pourrait convenir a cinq autres metiers en changeant seulement le texte, il est trop generique. Recompose autour d'un objet, d'un geste, d'une matiere, d'un lieu ou d'une promesse propres au brief.
- Ne decores pas un concept : prouve-le. Pour chaque brief, compare la sortie avec le metier demande et verifie trois preuves visibles : scene centrale propre au metier, actions/fonctions propres au metier, images ou objets propres au metier. Si une preuve manque, change la composition avant de repondre.
- Pour les demandes inattendues ou fictives, raisonne en monde utile : lieu, utilisateur, rituel, technologie, preuve, conversion. Exemple : hotel sous-marin = suites, lumiere filtree, faune, reservation ; station spatiale = orbite, Terre, apesanteur, sejour ; ville flottante = quartiers, energie, mobilite, vie quotidienne ; musee augmente = artefacts, AR, billetterie ; banque lunaire = credits interplanetaires, coffres, identite, colonies ; reve = portail, traversee, carte onirique. Ne transforme pas ces univers en vitrine abstraite.
- La personnalite vient du metier : une robe doit montrer couture et essayage, un hotel doit montrer sejour et reservation, une idee inventee doit montrer son objet central et son rituel d'usage. N'utilise jamais une photo de bureau, ordinateur ou reunion comme visuel par defaut sauf si le brief concerne vraiment un metier digital ou administratif.
- La mise en page doit mettre en valeur ce que l'utilisateur vend ou imagine : hero focal, scene immersive, surfaces superposees, navigation adaptee, sections toutes differentes, puis conversion claire. Les cartes repetees sont seulement autorisees si elles servent une collection, une galerie ou un comparatif precis.
- "Futuriste", "waouh" ou "premium" ne veut pas dire Lumina partout. Pour hotel, voyage, restaurant, bibliotheque, ferme urbaine, architecture ou metier sensoriel, garde une composition sectorielle forte sauf si l'utilisateur demande explicitement Lumina/Figma/Canvas/glass/surface/transparence.
- Le champ signatureMoment sert a guider l'idee creative. Ne cree pas un bloc visible nomme "Signature" dans les textes ou sections, sauf si l'utilisateur le demande explicitement.
- Les imageKeywords doivent etre concrets et non generiques : bibliotheque = livres, rayonnages, salle de lecture ; hotel sous-marin = ocean, suite vitree, lumiere aquatique, faune marine ; station spatiale = Terre, orbite, hublot, apesanteur ; ferme urbaine = plantes, serre, hydroponie, capteurs ; restaurant = assiette, cuisine, table ; jamais "professionnel au travail" par defaut.
- Choisis une vraie variante de layout adaptee au secteur : finance-os, lumina-showcase, cinematic-video, gallery-focus, minimal-editorial, luxury-asymmetric, product-dashboard, warm-editorial ou classic-conversion.
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
- Une reference esthetique ne doit jamais contaminer le contenu metier. Exemple : si l'utilisateur cite Lumina, Apple ou Figma pour la qualite visuelle, tu peux reprendre profondeur, verre, lumiere, panneaux flottants et rythme premium, mais jamais les menus, mots ou scenarios d'un autre secteur.
- Pour un logiciel, une application SaaS ou un dashboard, surtout comptabilite, facturation, devis, depenses, TVA, tresorerie ou documents : ne genere pas une vitrine marketing et ne force pas toujours la sidebar SaaS. Pour la comptabilite moderne, privilegie layoutVariant "finance-os" : scene applicative immersive avec grandes fenetres macOS superposees, factures, documents flottants, flux bancaires, widgets financiers, assistant IA visible, graphiques vivants, securite et automatisations. Tous les textes doivent rester lies a la comptabilite.
- Le mot "banque" seul ne veut pas dire comptabilite. Si le brief parle de banque lunaire, colonies, Mars, Lune, credits interplanetaires ou coffres numeriques, produis une banque futuriste avec credits, coffres, identite, colonies et securite, sans TVA, factures ni devis.
- Pour une demande explicitement Lumina, Figma, Apple/macOS, glassmorphism, transparent, 3D/4D ou surface : applique une direction "lumina-showcase" ou "lumina-future" au metier demande. Pour une demande seulement futuriste, immersive ou waouh, choisis d'abord le layout sectoriel le plus fort, puis ajoute profondeur, lumière et détails premium. N'utilise pas une page magazine classique, une grille Bootstrap ou des cartes repetitives.
- Pour une application enfant seulement si le brief parle explicitement d'enfants, comptines, mini-jeux, ecole maternelle, espace parent ou application enfant : ne genere jamais une page corporate ni une photo de bureau. Genere un univers produit immersif avec layoutVariant "story-world", visualMood "kids-future", modules Jeux/Histoires/Comptines, panneau Espace parent, couleurs futures douces, micro-interactions et parcours applicatif. Le mot "histoire" seul, par exemple "histoire du chef", ne doit jamais declencher ce secteur.
- Si le brief concerne comptabilite, factures, TVA, devis, tresorerie ou documents comptables, il est interdit d'utiliser : Jeux, Histoires, Comptines, Espace parent, Commencer a jouer, Apprentissage progressif, Monde a explorer ou Activites du jour.
- Les images ou visuels conseilles doivent correspondre au secteur. Pour SA Creation Web : environnement digital, ordinateur, interface, equipe, maquette web, automatisation IA.
- Pour une estheticienne, institut, soins, massage, epilation, beaute ou bien-etre : style doux et elegant, couleurs beige/rose poudre/dore leger, sections Soins du visage, Massages, Epilations, Tarifs, Zone d'intervention, Prise de rendez-vous, Avis clientes, Galerie avant/apres si pertinent. Le mot "boutique" peut simplement vouloir dire activite : ne propose pas e-commerce, panier ou catalogue sauf si la demande parle clairement de vendre des produits en ligne.
- Pour un cabinet d'avocat : ambiance sobre, bleu fonce, blanc, confiance, pages Expertise, Honoraires, Rendez-vous, Contact, et images juridiques uniquement. Pour une salle de sport : style energique, planning, coachs, nutrition, abonnements, espace membre. Pour un restaurant gastronomique : ambiance sensorielle, menu interactif, reservation, photos culinaires, histoire du chef et jamais story-world enfant. Pour une agence de voyages : grandes videos, destinations, carte interactive, itineraires, assistant IA voyage.
- Pour robe de mariee, mariage, couture, haute couture, atelier, essayage ou collection mariee : direction couture mariage premium. Pages Collections, Robes sur mesure, Essayages prives, Atelier, Galerie, Rendez-vous. Visuels robes, tissus, dentelle, soie, broderie, voile, mannequin, showroom ou essayage. Interdiction stricte : ordinateur, reunion, bureau corporate, dashboard, SaaS, photo de consultant ou image de startup.
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
- Si la modification change le metier, le secteur ou le type de site, repars de zero : ne conserve aucun bloc de la proposition precedente.
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
    "signatureMoment": "idee visuelle memorable propre au metier",
    "wowFactor": "detail qui rend l'aperçu memorable"
  },
  "layoutVariant": "finance-os | story-world | lumina-showcase | cinematic-video | gallery-focus | minimal-editorial | luxury-asymmetric | product-dashboard | warm-editorial | classic-conversion",
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

Exception encadree pour les trous de parcours : tu peux proposer une experience, une formation ou des competences comme brouillon a valider si l'utilisateur demande explicitement de combler/valoriser une periode ou fournit des indices sur cette periode. Dans ce cas, ne presente jamais le brouillon comme un fait deja confirme : utilise generatedExperiences, educationSuggestions, suggestedSkills, suggestions et periodGaps pour poser les questions utiles et attendre la validation utilisateur.

Tu peux :
- extraire et normaliser les informations explicitement presentes ;
- reformuler une accroche a partir des faits du CV ;
- mettre en avant des competences transferables seulement lorsqu'elles sont etayees par le CV ;
- reordonner les experiences deja presentes en ordre antichronologique : la plus recente en haut, puis les plus anciennes. Les formations/certifications sans date restent sans date et ne doivent pas recevoir d'annee inventee ;
- detecter les periodes non renseignees dans le parcours professionnel sans transformer un CV rapide en questionnaire. Cible surtout la periode recente apres la derniere experience ou la periode explicitement demandee par l'utilisateur. Ignore les petites pauses anciennes, les transitions de quelques mois, et les dates manifestement mal importees. Si tu as assez d'elements pour proposer une experience dans generatedExperiences, laisse periodGaps vide ;
- proposer une experience de transition uniquement comme hypothese a valider lorsque la demande utilisateur indique des faits exploitables pendant cette periode : projet personnel, creation de projet, developpement web/numerique, autoformation, formation professionnelle, recherche active d'emploi, benevolat ou missions ponctuelles. Renseigne generatedExperiences avec un titre, une periode, des missions et les competences developpees. Marque toujours la source comme "a valider" ;
- une experience proposee dans generatedExperiences ne doit jamais chevaucher une experience deja presente dans le CV. Si la derniere experience reelle finit en 2024 et que la periode recente a valoriser va jusqu'a 2026, la periode proposee doit commencer en 2025, pas en 2024 ;
- proposer dans educationSuggestions les formations et certifications manquantes a valoriser dans une rubrique separee : Ecole 42/Piscine informatique, Simplon, formations courtes, certificats et ateliers. Meme si la formation n'est pas directement liee au poste vise, elle peut expliquer une reconversion ou une periode recente, mais elle doit rester a valider avant insertion ;
- relever les mots-cles de l'offre et proposer, dans "suggestedSkills", ceux que la personne peut ajouter uniquement si elle les a reellement pratiques ;
- detecter les langues. Conserve le niveau exact fourni dans le CV ou dans la demande utilisateur, y compris une formulation informelle comme "notions professionnelles". Si le niveau manque, laisse "level" vide, sans avertissement ni texte de blocage.
- verifier la qualite avant proposition : fautes evidentes, doublons de competences, repetitions, rubriques vides et risque de contenu trop long ;
- comprendre les actions de structure demandees directement par l utilisateur. Exemple : « supprime Projets », « retire Activites », « enleve cette competence » ou « corrige le trou sous Competences ». Une rubrique non vide ne peut etre retiree que si la demande le dit clairement. Pour une suppression de rubrique, renseigne layout.removeSections avec une ou plusieurs de ces cles exactes : summary, skills, experience, projects, education, activities, languages. Sinon retourne une liste vide.
- quand l utilisateur demande de retirer une competence precise ou des doublons, retourne dans skills la liste finale complete des competences restantes, sans ajouter de competence inventee. Pour un trou, un espace vide ou une demande de meilleure mise en page, mets layout.reflow a true. Ne force layout.compact a true que si l utilisateur demande explicitement un CV plus compact ou une seule page.
- ecrire une lettre de motivation courte et personnalisee uniquement a partir du CV, de l'offre et des informations de lettre fournies.

Quand la consigne contient un CV colle, traite-le comme une source factuelle supplementaire et remplis "extracted" avec les coordonnees, experiences, formations, langues et activites explicitement presentes. Ne lis jamais une offre d'emploi comme un CV. Une offre sert uniquement a adapter les elements deja prouves.

Pour les niveaux de langues, conserve la formulation explicite. Si elle correspond clairement a l'une de ces valeurs, normalise-la ainsi : Notions, Débutant, Bases solides, Niveau intermédiaire, Niveau professionnel, Courant, Bilingue ou Langue maternelle. Exemples : French Native = Français : langue maternelle ; English Basic/Basic knowledge/Basic proficiency/Basic English = Anglais : Notions ; Beginner = Débutant ; Elementary = Bases solides ; Intermediate = Niveau intermédiaire ; Fluent = Courant ; Professional working proficiency = Niveau professionnel. Ne choisis jamais un niveau a la place de la personne.

Les demandes courtes sont des actions, pas des questions a faire confirmer. Comprends notamment :
- "anglais notions professionnelles" : remplace le niveau d'anglais par "Notions professionnelles" ;
- "Francais langue maternelle, Anglais Basic English" : retourne « Français : Langue maternelle » et « Anglais : Notions » ;
- "remplace vendeur par vendeuse" : remplace le titre cible par « Vendeuse » et adapte la forme associee si elle est presente (ex. « Vendeur polyvalent » devient « Vendeuse polyvalente »), sans modifier les faits des experiences ;
- "plus court" : raccourcis l'accroche et conserve les faits ;
- "enleve / pas besoin de Lifestyle" : retire Lifestyle du titre et de l'accroche, sans toucher aux experiences. Retourne toujours un titre de remplacement non vide, choisi parmi les intitulés réellement présents dans le CV ;
- "refais correctement" : produis une version CV claire, compacte et prete a l'emploi a partir des faits existants.

Pour l'adaptation a une offre, le titre exact de l'offre collee est prioritaire sur tout ancien titre du CV ou toute ancienne offre. Ne reutilise jamais un ancien intitulé : par exemple, une offre « Vendeur Polyvalent » doit produire « Vendeur polyvalent », et non « Vendeur Lifestyle ».

Pour un poste de vente ou de magasin (Vendeur Lifestyle, Vendeur polyvalent, etc.), valorise uniquement les preuves de relation client, conseil, accueil, autonomie et sens du service deja presentes. N'ajoute jamais vente, encaissement ou mise en rayon comme experience si le CV ne les prouve pas. Ces elements peuvent seulement etre proposes dans suggestedSkills avec la mention « a confirmer ».

Pour une periode recente 2025-2026 liee a des projets numeriques, autoformation, IA ou developpement web, propose de preference ce brouillon a valider : titre « Créatrice de projets numériques – Autoformation et développement », periode exacte « 2025 - 2026 » si la derniere experience reelle finit en 2024, missions « Conception et développement de plateformes web », « Gestion de projets digitaux », « Utilisation d’outils d’intelligence artificielle pour le développement », « Coordination de développements avec des assistants IA », « Amélioration de l’expérience utilisateur (UX/UI) », « Tests fonctionnels et suivi des évolutions », « Développement de compétences en gestion de projet, communication digitale et résolution de problèmes ». Propose les competences correspondantes dans suggestedSkills.

Mode CV rapide prêt à l'emploi : ne pose pas une liste de questions si la demande contient deja les projets, formations, outils ou periodes a valoriser. Dans ce cas, prépare directement une proposition validable. Les questions ne sont utiles que si aucune experience credible ne peut etre redigee.

Selon la tache demandee :
- "create" : transforme un CV colle ou des informations brutes en CV structure. Si les faits sont insuffisants, utilise extracted et suggestions pour indiquer exactement ce qui manque, sans creer de faux parcours.
- "optimize" ou "assistant" : corrige, compacte et deduplique le CV existant. Renseigne quality.fixes avec les controles realises.
- "adapt" : adapte titre, accroche, ordre des experiences et competences prouvees a l'offre. Produis aussi la lettre si la demande parle de lettre.
- "letter" : redige letter.subject et letter.body. La lettre doit etre directement utilisable, faire 900 caracteres maximum et ne jamais affirmer un fait absent du CV.

Actions d'edition directes :
- Si l'utilisateur demande une modification ciblee d'un element existant (date/periode d'une experience, niveau de langue, suppression/retrait, correction d'un champ), renseigne "operations" avec l'action a appliquer. Ne cree pas de nouveau bloc pour une correction.
- Si la demande cible explicitement un seul champ (titre, langue, date, telephone, email, profil, nom, ville, permis), ne lance pas d'optimisation globale : laisse periodGaps, generatedExperiences, educationSuggestions, suggestedSkills et layout vides sauf demande explicite d'optimisation globale.
- Pour corriger une date d'experience existante, utilise type "update_experience_date", renseigne "value" avec la nouvelle date/periode, et cible l'experience avec target.index si le contexte de selection le fournit, sinon target.title, target.organization ou target.currentValue.
- Pour ajouter ou modifier une langue, utilise type "upsert_language", value = niveau, target.label = langue.
- Pour modifier un champ simple, utilise type "set_field", field parmi fullName, location, phone, email, permit, headline, summary, skills, education, activities, projects, languages, value = contenu final.
- Pour supprimer une experience existante ou un doublon d'experience, utilise type "remove_experience" et cible l'experience avec target.index si le contexte de selection le fournit, sinon target.title, target.organization ou target.currentValue. Ne regenere jamais cette experience dans generatedExperiences pour la meme demande.
- Si la demande est comprise mais qu'il manque une cible ou une valeur, renseigne "bugReport" seulement si l'application aurait du pouvoir agir. Sinon explique dans "suggestions" la precision manquante.

Le resultat doit rester court et tenir sur une page de CV : une accroche de 300 caracteres maximum, 10 competences appliquees maximum, 8 mots-cles et 6 suggestions maximum. Reponds uniquement avec un JSON valide, sans markdown.

Schema JSON obligatoire :
{
  "headline": "poste cible court ou chaine vide",
  "summary": "accroche reformulee a partir des faits ou chaine vide",
  "skills": ["competence prouvee par le CV"],
  "experienceOrder": ["intitule exact d'une experience existante"],
  "languages": [{"language": "Francais", "level": "niveau exact ou chaine vide"}],
  "periodGaps": [{
    "period": "2025 - 2026",
    "reason": "periode non renseignee",
    "questions": ["question courte a poser avant insertion"],
    "options": ["Projet personnel", "Autoformation", "Recherche active d'emploi"]
  }],
  "generatedExperiences": [{
    "title": "titre professionnel a valider",
    "period": "periode exacte a valider",
    "organization": "Projet personnel / Autoformation / Formation / Benevolat",
    "description": ["mission courte et factuelle a valider"],
    "skills": ["competence developpee a valider"],
    "source": "a valider"
  }],
  "educationSuggestions": [{
    "title": "formation ou certification a valider",
    "period": "annee ou periode si connue",
    "organization": "organisme si connu",
    "description": "description courte",
    "skills": ["competence associee"],
    "source": "a valider"
  }],
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
  "operations": [{
    "type": "update_experience_date | upsert_language | set_field | remove_section | reorder_experiences | remove_experience",
    "field": "experience | languages | fullName | location | phone | email | permit | headline | summary | skills | education | activities | projects",
    "target": {
      "index": 0,
      "label": "texte cible ou langue",
      "title": "titre exact si experience",
      "organization": "employeur/lieu si connu",
      "currentValue": "valeur actuelle si utile"
    },
    "value": "nouvelle valeur a appliquer",
    "reason": "raison courte"
  }],
  "bugReport": {
    "category": "bug modification date | bug langue | bug sélection texte | bug export | bug page blanche | bug insertion expérience | bug application",
    "summary": "resume court",
    "expectedAction": "action attendue",
    "target": "element concerne",
    "details": "details utiles"
  },
  "letter": {
    "subject": "Objet : Candidature",
    "body": "lettre de motivation complete ou chaine vide"
  }
}
`.trim();

const getActivityWords = (brief) => {
    const cleanBrief = stripAccents(brief.toLowerCase());
    if (hasFutureBankIntent(brief)) {
        return 'banque interplanetaire';
    }

    if (hasAccountingIntent(brief)) {
        return 'logiciel de comptabilite';
    }

    if (isKidsEducationBrief(brief)) {
        return 'application educative enfant';
    }

    if (isBridalCoutureBrief(brief)) {
        return 'atelier de robes de mariee haute couture';
    }

    const knownActivities = [
        ['coiffeuse', 'salon de coiffure'],
        ['coiffeur', 'salon de coiffure'],
        ['fleuriste', 'fleuriste'],
        ['restaurant', 'restaurant'],
        ['menu', 'restaurant'],
        ['bibliotheque', 'bibliotheque immersive'],
        ['bibliothèque', 'bibliotheque immersive'],
        ['mediatheque', 'bibliotheque immersive'],
        ['médiathèque', 'bibliotheque immersive'],
        ['livres', 'bibliotheque immersive'],
        ['lecture', 'bibliotheque immersive'],
        ['ferme urbaine', 'ferme urbaine intelligente'],
        ['ferme verticale', 'ferme urbaine intelligente'],
        ['station spatiale', 'station spatiale touristique'],
        ['tourisme spatial', 'station spatiale touristique'],
        ['ville flottante', 'cite flottante autonome'],
        ['cité flottante', 'cite flottante autonome'],
        ['musee', 'musee immersif'],
        ['musée', 'musee immersif'],
        ['archeologie', 'musee immersif'],
        ['archéologie', 'musee immersif'],
        ['portail des reves', 'experience de reve immersive'],
        ['portail des rêves', 'experience de reve immersive'],
        ['hotel sous marin', 'hotel sous-marin de luxe'],
        ['hôtel sous-marin', 'hotel sous-marin de luxe'],
        ['hydropon', 'ferme urbaine intelligente'],
        ['agriculture urbaine', 'ferme urbaine intelligente'],
        ['agence de voyage', 'agence de voyages sur mesure'],
        ['voyage', 'agence de voyages sur mesure'],
        ['destination', 'agence de voyages sur mesure'],
        ['jardin suspendu', 'jardins suspendus intelligents'],
        ['jardins suspendus', 'jardins suspendus intelligents'],
        ['balcon', 'jardins suspendus intelligents'],
        ['plante', 'jardins suspendus intelligents'],
        ['capteur', 'jardins connectés'],
        ['architecte', 'cabinet d architecture'],
        ['architecture', 'cabinet d architecture'],
        ['avocat', 'cabinet d avocats'],
        ['juridique', 'cabinet d avocats'],
        ['veterinaire', 'clinique veterinaire'],
        ['vétérinaire', 'clinique veterinaire'],
        ['salle de sport', 'salle de sport'],
        ['fitness', 'salle de sport'],
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
        .filter((word) => word.length > 3 && !/^(creer|créer|concevoir|realiser|réaliser|pour|avec|dans|faire|veux|avoir|site|page|client|clients|projet|premium|moderne|futuriste|immersif|immersive)$/i.test(word));

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
    const sectorKey = detectFallbackSector(brief);
    const needsAppointment = /\b(rdv|rendez|reservation|creneau|agenda|coiff|coach|institut|beaute|consultation)\b/.test(lowerBrief);
    const needsTravelAgency = /\b(voyage|voyages|tourisme|destination|destinations|itineraire|itinéraire|sejour sur mesure|séjour sur mesure|road trip|circuit|circuits|safari|agence de voyage|agence voyages|voyage sur mesure|voyages sur mesure)\b/.test(lowerBrief);
    const needsHotel = !needsTravelAgency && /\b(hotel|hôtel|chambre|hebergement|hébergement|gite|gîte|sejour|séjour|touristique)\b/.test(lowerBrief);
    const needsWordPress = /\b(wordpress|wp|cms|refonte)\b/.test(lowerBrief);
    const needsBridalCouture = isBridalCoutureBrief(brief);
    const needsShop = !needsBridalCouture && /\b(boutique|vendre|vente|commande|produit|panier|paiement|catalogue)\b/.test(lowerBrief);
    const needsMenu = /\b(menu|restaurant|carte|plat|tarif|prix)\b/.test(lowerBrief);
    const needsPortfolio = /\b(cv|portfolio|book|realisations|candidat|candidate)\b/.test(lowerBrief);
    const needsArchitecture = /\b(architect|architecture|architecte|arquitecto|interieur|intérieur|design d interieur|design d'intérieur|decorateur|decoratrice|decoration|décoration|maitre d oeuvre|maître d oeuvre)\b/.test(lowerBrief);
    const needsLegal = /\b(avocat|avocats|cabinet d avocat|cabinet d'avocat|juridique|droit|juriste|notaire|honoraires|contentieux)\b/.test(lowerBrief);
    const needsSport = /\b(salle de sport|fitness|coach sportif|coaching|nutrition|musculation|performance|performances|cours collectifs|espace membre)\b/.test(lowerBrief);
    const needsVeterinary = /\b(veterinaire|vétérinaire|clinique veterinaire|clinique vétérinaire|urgence veterinaire|urgences veterinaires|fiches animaux|soins veterinaires)\b/.test(lowerBrief);
    const needsQr = /\b(qr|qrcode|scan|scanner|flyer|partager)\b/.test(lowerBrief);
    const needsClientSpace = /\b(espace client|compte client|suivi|document|documents|connexion|prive|privé)\b/.test(lowerBrief);
    const needsAiAssistant = /\b(assistant|ia|automatiser|automatisation|questions|support|chat)\b/.test(lowerBrief);
    const needsFutureBank = hasFutureBankIntent(brief);
    const needsAccountingApp = !needsFutureBank && hasAccountingIntent(brief);
    const needsWellness = /\b(yoga|pilates|bien etre|bien-être|spa|massage|meditation|méditation|relaxation|soin|soins)\b/.test(lowerBrief);
    const needsWorkshops = /\b(atelier|ateliers|stage|stages|evenement|événement|evenements|événements|session speciale|session spéciale)\b/.test(lowerBrief);
    const needsPricing = /\b(tarif|tarifs|prix|formule|formules|abonnement|abonnements|offre|offres)\b/.test(lowerBrief);
    const needsGallery = /\b(photo|photos|image|images|galerie|portfolio|realisation|réalisation|realisations|réalisations|lieu|local|avant apres|avant-apres)\b/.test(lowerBrief);
    const needsImmersive = /\b(immersif|immersive|grande image|grandes images|plein ecran|plein écran|cinematic|impact|waouh|wow)\b/.test(lowerBrief);
    const needsKidsEducation = !needsAccountingApp && isKidsEducationBrief(brief);
    const needsFutureExperience = hasLuminaCreativeIntent(brief);
    const needsDesignCraft = /\b(figma make|make de figma|canvas pro|lumina|super design|beau design|design premium|design unique|personnalite|personnalité|waouh|whaou|wow|surface|surfaces|4d|transparent|transparence|creative|creatif|créatif|artistique)\b/.test(lowerBrief);
    const needsSurfaceDesign = hasSurfaceDesignIntent(brief);
    const needsLuminaCreative = !needsAccountingApp && !needsFutureBank && !needsKidsEducation && needsFutureExperience;
    const needsLibraryConcept = /\b(bibliotheque|bibliothèque|mediatheque|médiathèque|livre|livres|lecture|lecteur|lecteurs|librairie|rayonnage|rayonnages|archives)\b/.test(lowerBrief);
    const needsUrbanFarmConcept = /\b(ferme urbaine|ferme verticale|agritech|agriculture urbaine|hydropon|aeropon|aéropon|serre|serres|culture eclair|culture éclair)\b/.test(lowerBrief);
    const needsGardenConcept = /\b(jardin|jardins|plante|plantes|balcon|balcons|vegetal|végétal|terrasse|capteur|capteurs|diagnostic ia|rendu 3d)\b/.test(lowerBrief);
    const needsCustomConcept = !needsAccountingApp && !needsFutureBank && !needsKidsEducation && !needsTravelAgency && !needsLegal && !needsVeterinary && !needsSport && !needsHotel && !needsMenu && !needsArchitecture && !needsShop && !needsPortfolio && (needsLibraryConcept || needsUrbanFarmConcept || needsGardenConcept || needsFutureExperience || lowerBrief.length > 120);
    const customConceptName = needsLibraryConcept ? 'bibliotheque immersive' : needsUrbanFarmConcept ? 'ferme urbaine intelligente' : needsGardenConcept ? 'jardins suspendus intelligents' : activity;
    const inferredContext = inferOpenAiBriefContext(brief);
    const styleHint = inferredContext.styleHints[0] || inferredContext.moodHints[0] || 'direction moderne claire';
    const sectionHint = inferredContext.sectionHints.length ? inferredContext.sectionHints.join(', ') : 'sections utiles au parcours client';
    const nameBase = titleCase(activity.replace(/^site\s+/i, ''));
    const explicitName = normalizeText(
        (brief.match(/(?:appelee|appelée|appele|appelé|appelle|nommee|nommée|nomme|nommé|nom|marque)\s+["“']?([^.,\n]{2,48})/i) || [])[1] || '',
    )
        .replace(/\s+\b(?:avec|pour|qui|dont|sur|style)\b.*$/i, '')
        .replace(/["“”']/g, '')
        .trim();
    const siteName = explicitName
        ? titleCase(explicitName)
        : nameBase.length > 28
            ? `Studio ${nameBase.split(/\s+/)[0]}`
            : nameBase;
    const mainAction = needsAccountingApp ? 'Voir la démo IA' : needsFutureBank ? 'Ouvrir un coffre' : needsKidsEducation ? 'Commencer à jouer' : needsBridalCouture ? 'Réserver un essayage' : needsCustomConcept ? 'Créer mon concept' : needsTravelAgency ? 'Créer mon itinéraire' : needsSport ? 'Réserver un essai' : needsLegal || needsVeterinary ? 'Prendre rendez-vous' : needsHotel ? 'Réserver une chambre' : needsMenu && needsAppointment ? 'Réserver une table' : needsMenu ? 'Voir la carte' : needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Demander une information';
    const pages = needsAccountingApp ? [
        { name: 'Aperçu logiciel', goal: 'Montrer l’interface, les fenêtres financières et les actions rapides.' },
        { name: 'Factures & devis', goal: 'Créer, envoyer, relancer et suivre les documents commerciaux.' },
        { name: 'Trésorerie', goal: 'Suivre chiffre d’affaires, dépenses, solde et prévisions.' },
        { name: 'Assistant IA', goal: 'Expliquer les dépenses, échéances, TVA et anomalies.' },
        { name: 'Automatisations', goal: 'Importer justificatifs, rapprocher transactions et préparer les échéances.' },
        { name: 'Sécurité', goal: 'Rassurer sur accès, données, exports et confidentialité.' },
        { name: 'Contact', goal: 'Prévoir une demande de démo ou cadrage projet.' },
    ] : needsKidsEducation ? [
        { name: 'Accueil', goal: 'Présenter l’univers, la promesse éducative et l’entrée vers le jeu.' },
        { name: 'Jeux', goal: 'Afficher les mini-jeux, niveaux et compétences travaillées.' },
        { name: 'Histoires', goal: 'Présenter les récits interactifs, personnages et choix simples.' },
        { name: 'Comptines', goal: 'Proposer un espace audio doux, sécurisé et rassurant.' },
        { name: 'Espace parent', goal: 'Montrer progression, profils, temps d’écran et réglages.' },
        { name: 'Contact', goal: 'Permettre aux parents ou partenaires de poser une question.' },
    ] : needsCustomConcept ? [
        { name: 'Accueil', goal: `Mettre en scène le concept ${customConceptName} avec un visuel signature.` },
        { name: needsGardenConcept ? 'Diagnostic balcon IA' : 'Diagnostic IA', goal: 'Comprendre la situation, les contraintes et le besoin avant recommandation.' },
        { name: needsGardenConcept ? 'Rendu 3D' : 'Simulation', goal: 'Projeter le résultat avec une scène visuelle claire et désirable.' },
        { name: needsGardenConcept ? 'Abonnement plantes' : 'Offres évolutives', goal: 'Présenter les formules, le suivi et les services récurrents.' },
        { name: needsGardenConcept ? 'Suivi capteurs' : 'Suivi intelligent', goal: 'Rendre visible l’accompagnement, les alertes et les données utiles.' },
        { name: 'Réalisations', goal: 'Montrer des exemples, preuves visuelles ou transformations.' },
        { name: 'Contact', goal: 'Déclencher une demande qualifiée.' },
    ] : needsTravelAgency ? [
        { name: 'Accueil', goal: 'Créer l’envie avec une scène immersive, vidéo et action sur mesure.' },
        { name: 'Destinations', goal: 'Présenter les destinations par ambiance, saison et expérience.' },
        { name: 'Itinéraires', goal: 'Montrer des parcours personnalisables, étapes et temps forts.' },
        { name: 'Carte interactive', goal: 'Explorer destinations, trajets et points d’intérêt.' },
        { name: 'Assistant IA voyage', goal: 'Guider les envies, dates, budget et style de séjour.' },
        { name: 'Témoignages', goal: 'Rassurer avec des retours clients et preuves de confiance.' },
        { name: 'Contact voyage', goal: 'Transformer l’envie en demande qualifiée.' },
    ] : needsLegal ? [
        { name: 'Accueil', goal: 'Installer crédibilité, clarté et rendez-vous confidentiel.' },
        { name: 'Expertises', goal: 'Présenter les domaines de droit et les situations accompagnées.' },
        { name: 'Équipe', goal: 'Mettre en avant les avocats, parcours et spécialités.' },
        { name: 'Honoraires', goal: 'Expliquer les modalités et lever les inquiétudes.' },
        { name: 'Actualités juridiques', goal: 'Publier analyses, informations et preuves d’expertise.' },
        { name: 'Rendez-vous', goal: 'Permettre une demande confidentielle et structurée.' },
        { name: 'Contact', goal: 'Donner accès, coordonnées et formulaire.' },
    ] : needsVeterinary ? [
        { name: 'Accueil', goal: 'Rassurer et orienter vers rendez-vous ou urgence.' },
        { name: 'Rendez-vous', goal: 'Permettre une demande rapide et lisible.' },
        { name: 'Urgences', goal: 'Afficher les consignes et contacts prioritaires.' },
        { name: 'Équipe', goal: 'Présenter les praticiens et la relation humaine.' },
        { name: 'Conseils', goal: 'Regrouper prévention, suivi et fiches utiles.' },
        { name: 'Contact', goal: 'Donner accès, horaires, téléphone et formulaire.' },
    ] : needsSport ? [
        { name: 'Accueil', goal: 'Montrer énergie, coaching et essai visible.' },
        { name: 'Cours', goal: 'Afficher planning, réservation et niveaux.' },
        { name: 'Coaching', goal: 'Présenter accompagnement, nutrition et objectifs.' },
        { name: 'Espace membre', goal: 'Suivre performances, séances et progression.' },
        { name: 'Abonnements', goal: 'Comparer offres et accès.' },
        { name: 'Contact', goal: 'Réserver un essai ou poser une question.' },
    ] : needsHotel ? [
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
    const addPageBeforeContact = (page) => {
        const key = stripAccents(normalizeText(page.name).toLowerCase());

        if (pages.some((item) => stripAccents(normalizeText(item.name).toLowerCase()) === key)) {
            return;
        }

        const contactIndex = pages.findIndex((item) => /contact/i.test(item.name));
        pages.splice(contactIndex >= 0 ? contactIndex : pages.length, 0, page);
    };

    if (needsWorkshops) {
        addPageBeforeContact({ name: 'Ateliers', goal: 'Mettre en avant les ateliers, leurs bénéfices, dates ou formats.' });
    }

    if (needsPricing) {
        addPageBeforeContact({ name: 'Tarifs', goal: 'Présenter les prix, formules ou abonnements de manière lisible.' });
    }

    if (needsGallery) {
        addPageBeforeContact({ name: needsWellness ? 'Le lieu' : 'Galerie', goal: needsWellness ? 'Montrer l’ambiance, la lumière et les détails du lieu.' : 'Montrer les photos, réalisations ou preuves visuelles.' });
    }
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

    if (needsTravelAgency) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Site vitrine premium', reason: 'Installer une image haut de gamme et donner envie de voyager.', priceFrom: 'Offre Signature' },
            { name: 'Galerie vidéo immersive', reason: 'Le voyage se vend par projection visuelle et émotion.', priceFrom: 'Projet spécifique' },
            { name: 'Carte interactive', reason: 'Rendre destinations, étapes et trajets explorables.', priceFrom: 'Projet spécifique' },
            { name: 'Assistant IA métier', reason: 'Aider le visiteur à construire un itinéraire personnalisé.', priceFrom: 'Projet spécifique' },
            { name: 'Formulaire voyage sur mesure', reason: 'Qualifier envies, dates, budget et niveau d’accompagnement.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsLegal) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Site vitrine premium', reason: 'Créer confiance, clarté et crédibilité.', priceFrom: 'Offre Pro' },
            { name: 'Prise de rendez-vous', reason: 'Transformer une visite en demande confidentielle.', priceFrom: 'Projet spécifique' },
            { name: 'Actualités juridiques', reason: 'Valoriser l’expertise et le référencement.', priceFrom: 'Option' },
            { name: 'Pages expertises', reason: 'Structurer les domaines de droit de manière lisible.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsVeterinary) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Prise de rendez-vous', reason: 'Organiser les demandes rapidement.', priceFrom: 'Projet spécifique' },
            { name: 'Page urgences', reason: 'Rendre les informations prioritaires accessibles vite.', priceFrom: 'Inclus selon offre' },
            { name: 'Pages conseils', reason: 'Rassurer et répondre aux questions fréquentes.', priceFrom: 'Option' },
            { name: 'Google Maps et horaires', reason: 'Faciliter l’accès à la clinique.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsSport) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Planning de cours', reason: 'Rendre les séances visibles et réservables.', priceFrom: 'Projet spécifique' },
            { name: 'Espace membre simple', reason: 'Suivre réservations, progression et abonnements.', priceFrom: 'Projet spécifique' },
            { name: 'Tunnel essai', reason: 'Convertir les visiteurs en séance découverte.', priceFrom: 'Offre Pro' },
            { name: 'Formules d’abonnement', reason: 'Comparer les offres clairement.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsCustomConcept) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Site vitrine premium', reason: 'Expliquer un concept atypique avec un scénario visuel clair.', priceFrom: 'Offre Signature' },
            { name: 'Assistant IA métier', reason: 'Guider le visiteur dans le diagnostic et la recommandation.', priceFrom: 'Projet spécifique' },
            { name: 'Galerie immersive', reason: 'Montrer le résultat attendu au lieu de rester abstrait.', priceFrom: 'Projet spécifique' },
            { name: 'Formulaire intelligent', reason: 'Qualifier contraintes, objectifs, budget et suivi souhaité.', priceFrom: 'Projet spécifique' },
            { name: 'Espace client simple', reason: 'Suivre demandes, abonnements, documents ou données utiles.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsAccountingApp) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Interface produit sur mesure', reason: 'Le projet doit montrer un vrai logiciel comptable, pas une vitrine.', priceFrom: 'Projet spécifique' },
            { name: 'Assistant IA métier', reason: 'Utile pour expliquer dépenses, TVA, échéances et anomalies.', priceFrom: 'Projet spécifique' },
            { name: 'Espace client simple', reason: 'Nécessaire pour sauvegarder documents, préférences et historiques.', priceFrom: 'Projet spécifique' },
            { name: 'Import documents', reason: 'Factures, justificatifs et contrats doivent être centralisés.', priceFrom: 'Projet spécifique' },
            { name: 'Connexion bancaire', reason: 'Pertinent pour rapprocher transactions, soldes et trésorerie.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsKidsEducation) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Interface produit sur mesure', reason: 'Le projet demande une vraie application enfant, pas une vitrine.', priceFrom: 'Projet spécifique' },
            { name: 'Espace client simple', reason: 'Utile pour les profils enfants, les parents et les préférences.', priceFrom: 'Projet spécifique' },
            { name: 'Assistant IA métier', reason: 'Peut adapter histoires, activités ou parcours selon l’âge.', priceFrom: 'Projet spécifique' },
            { name: 'Galerie animée', reason: 'L’univers, les personnages et les modules doivent être visibles dès le premier écran.', priceFrom: 'Projet spécifique' },
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

    const sanitized = {
        mode: 'fallback',
        sectorKey,
        projectType: needsAccountingApp ? 'Application comptable IA premium' : needsFutureBank ? 'Banque interplanétaire futuriste' : needsKidsEducation ? 'Application éducative immersive enfant' : needsCustomConcept ? 'Site concept métier immersif' : needsTravelAgency ? 'Site premium voyage sur mesure' : needsLegal ? 'Site juridique professionnel' : needsVeterinary ? 'Site clinique avec rendez-vous' : needsSport ? 'Plateforme fitness avec espace membre' : needsHotel ? 'Site hôtel avec réservation' : needsMenu ? 'Site restaurant avec réservation' : needsArchitecture ? 'Site premium pour studio d’architecture' : needsShop ? 'Boutique en ligne simple' : needsPortfolio ? 'CV ou portfolio en ligne' : needsAppointment ? 'Site avec prise de rendez-vous' : needsWordPress ? 'Site WordPress professionnel' : 'Site vitrine professionnel',
        layoutVariant: needsAccountingApp || needsFutureBank ? 'finance-os' : needsKidsEducation ? 'story-world' : needsTravelAgency || needsImmersive || needsHotel || needsUrbanFarmConcept ? 'cinematic-video' : needsArchitecture || needsGallery || needsLibraryConcept ? 'gallery-focus' : needsSport ? 'product-dashboard' : needsMenu || needsWellness ? 'warm-editorial' : needsCustomConcept ? (needsSurfaceDesign ? 'lumina-showcase' : 'luxury-asymmetric') : needsLuminaCreative && needsSurfaceDesign ? 'lumina-showcase' : needsShop ? 'classic-conversion' : 'luxury-asymmetric',
        visualMood: needsAccountingApp ? 'accounting-neural' : needsFutureBank ? 'orbital-finance' : needsKidsEducation ? 'kids-future' : needsCustomConcept ? 'concept-lumina' : needsLuminaCreative ? 'lumina-future' : needsTravelAgency ? 'travel-premium' : needsLegal ? 'legal-premium' : needsVeterinary ? 'care-premium' : needsSport ? 'performance-premium' : needsArchitecture ? 'image-led' : needsHotel ? 'premium' : needsMenu ? 'warm' : needsWellness ? 'beauty-wellness' : needsAiAssistant ? 'tech-premium' : needsPortfolio ? 'image-led' : needsDesignCraft ? 'crafted-premium' : 'crafted-premium',
        designVariant: lowerBrief.length % 5,
        visualSeed: `${activity}:${lowerBrief.length}:${mainAction}`,
        showGallery: needsKidsEducation || needsCustomConcept || needsLuminaCreative || needsDesignCraft || needsTravelAgency || needsHotel || needsArchitecture || needsMenu || needsPortfolio || needsGallery,
        siteName,
        slogan: needsAccountingApp ? 'La compta claire, enfin directe.' : needsFutureBank ? 'La finance des colonies, sans frontière.' : needsKidsEducation ? 'Apprendre en jouant, tout doucement.' : needsCustomConcept ? (needsGardenConcept ? 'Des balcons minuscules, des jardins vivants.' : 'Une idée rare, rendue visible.') : needsTravelAgency ? 'Des voyages dessinés autour de vous.' : needsLegal ? 'Défendre. Conseiller. Rassurer.' : needsVeterinary ? 'Soigner avec confiance et douceur.' : needsSport ? 'Progressez avec un vrai suivi.' : needsArchitecture ? 'Concevoir des espaces singuliers, durables et mémorables.' : needsShop ? `Des produits clairs, faciles à découvrir et commander.` : `Une présence claire pour présenter ${activity} et recevoir des contacts.`,
        summary: `Kirby reconstruit une proposition propre autour de ${activity}, avec une structure, une ambiance et des actions adaptées à la demande.`,
        valueProposition: needsAccountingApp ? 'Un logiciel comptable qui montre revenus, dépenses, TVA, documents, banque et assistant IA dans une interface premium.' : needsFutureBank ? 'Une interface bancaire orbitale qui relie crédits interplanétaires, coffres numériques, identité et colonies dans un espace sécurisé.' : needsKidsEducation ? 'Une expérience éducative qui combine jeux, histoires, comptines et suivi parent dans un univers doux et futuriste.' : needsCustomConcept ? (needsGardenConcept ? 'Une expérience qui transforme un balcon en jardin suspendu grâce au diagnostic IA, au rendu 3D, aux abonnements plantes et au suivi capteurs.' : `Une expérience qui rend ${activity} concret grâce à une scène visuelle, un diagnostic et un parcours d’action clair.`) : needsTravelAgency ? 'Une expérience immersive qui relie destinations, itinéraires, carte interactive et assistant IA pour créer un voyage sur mesure.' : needsLegal ? 'Un site clair qui rend les expertises compréhensibles, rassure et facilite la prise de rendez-vous.' : needsVeterinary ? 'Une présence rassurante qui guide vers rendez-vous, urgences, équipe et conseils utiles.' : needsSport ? 'Une plateforme qui relie coaching, nutrition, réservation de cours, performance et espace membre.' : `Un projet digital clair qui aide ${activity} à être compris, désiré et contacté plus facilement.`,
        positioning: {
            audience: needsAccountingApp ? 'Indépendants, freelances et petites entreprises qui veulent piloter leur activité sans tableur lourd.' : needsKidsEducation ? 'Parents, enfants et équipes éducatives qui veulent apprendre dans un cadre rassurant.' : needsCustomConcept ? (needsGardenConcept ? 'Habitants en ville qui veulent végétaliser un petit balcon sans se tromper.' : inferredContext.likelyTarget || 'Curieux, early adopters et clients qui doivent comprendre un concept nouveau.') : needsTravelAgency ? 'Voyageurs exigeants qui veulent un itinéraire personnalisé, inspirant et simple à cadrer.' : inferredContext.likelyTarget || 'Clients locaux, visiteurs qui cherchent une solution rapide et prospects à rassurer.',
            promise: needsAccountingApp ? 'Voir les chiffres, documents, échéances et alertes utiles dans une interface compréhensible.' : needsKidsEducation ? 'Faire entrer l’enfant dans un monde de jeux, histoires et comptines tout en donnant le contrôle aux parents.' : needsCustomConcept ? (needsGardenConcept ? 'Voir comment son balcon peut devenir un jardin vivant, puis choisir installation et suivi.' : `Comprendre ${activity}, visualiser le résultat et passer à l’action.`) : needsTravelAgency ? 'Explorer des destinations et construire un itinéraire sur mesure avec un accompagnement expert.' : needsShop ? 'Découvrir les produits et passer à la commande sans friction.' : needsAppointment ? 'Comprendre les prestations et réserver un créneau facilement.' : 'Comprendre l’activité et contacter rapidement.',
            tone: needsAccountingApp ? 'Premium, futuriste, fiable et orienté décision.' : needsKidsEducation ? (needsFutureExperience ? 'Futur doux, ludique, immersif et rassurant.' : 'Ludique, doux, éducatif et rassurant.') : needsCustomConcept ? 'Futuriste, vivant, concret, très visuel et pédagogique.' : needsTravelAgency ? 'Immersif, premium, inspirant et très visuel.' : styleHint,
            differentiator: needsAccountingApp ? 'Un aperçu qui ressemble à un logiciel nouvelle génération, avec IA, documents et données vivantes.' : needsKidsEducation ? 'Un aperçu qui montre un vrai produit applicatif : modules enfants, progression et espace parent.' : needsCustomConcept ? 'Le métier est mis en scène comme un parcours concret, avec objet central, simulation et suivi intelligent.' : needsTravelAgency ? 'Une expérience qui montre destinations, carte, itinéraires et assistant IA dès le premier écran.' : 'Une structure simple, des options utiles et un accompagnement humain après la proposition IA.',
        },
        styleGuide: {
            direction: needsAccountingApp ? 'Interface premium inspirée macOS/Figma : verre dépoli, grande scène logicielle, fenêtres flottantes, données financières et assistant IA.' : needsKidsEducation ? 'Univers produit immersif, futur doux, modules de jeu visibles, panneau parent et animations légères.' : needsCustomConcept ? (needsGardenConcept ? 'Direction Lumina végétale : balcon transformé en jardin suspendu, rendu 3D, capteurs vivants, lumière cyan et matières naturelles.' : `Direction Lumina métier : objet central ${customConceptName}, mise en scène immersive, modules flottants et explication pédagogique.`) : needsLuminaCreative ? 'Direction Lumina/Figma : surfaces transparentes, profondeur 4D, lumière contrôlée, modules flottants et composition propre au métier.' : needsTravelAgency ? 'Voyage premium immersif : grandes vidéos, destinations en profondeur, carte interactive, itinéraires et assistant IA visible.' : needsImmersive ? `Site immersif ${styleHint} avec grandes images, respiration visuelle et action claire.` : needsHotel ? 'Site immersif avec photos, chambres, disponibilité et réservation visible.' : needsArchitecture ? 'Portfolio architectural premium avec grands visuels, grille éditoriale et détails de matière.' : needsWellness ? `Site bien-être ${styleHint} avec visuels naturels, ateliers et réservation visible.` : needsShop ? 'Catalogue clair avec produits visibles et parcours de commande court.' : needsAppointment ? `Site ${styleHint} avec agenda ou contact visible dès le premier écran.` : `Direction Canvas pro métier : objet central visible, surface soignée, mise en page expressive et conversion claire.`,
            colors: needsAccountingApp ? 'Bleu nuit, turquoise IA, verre translucide, blanc lumineux, vert trésorerie et violet sécurité.' : needsKidsEducation ? 'Indigo profond, menthe lumineuse, corail doux, jaune soleil, lilas interactif et surfaces translucides.' : needsLuminaCreative ? 'Carbone profond, verre translucide, cyan lumineux, vert menthe, rose froid et blanc optique.' : inferredContext.moodHints.includes('univers bleu nuit, halos, verre dépoli') ? 'Bleu nuit, verre dépoli, halos doux et contraste blanc.' : 'Fond sobre, contraste fort, une couleur d’accent pour les boutons et les informations importantes.',
            typography: needsAccountingApp ? 'Sans-serif premium, chiffres nets, libellés financiers courts et hiérarchie très aérée.' : needsKidsEducation ? 'Sans-serif ronde, titres expressifs, libellés courts et très lisibles.' : needsLuminaCreative ? 'Sans-serif premium, titres nets, textes courts, grande respiration et aucun effet magazine.' : 'Titres francs, textes courts, lecture facile sur mobile.',
            layout: needsAccountingApp ? 'Finance OS immersif : hero logiciel, aperçu produit, assistant IA, automatisations, intégrations bancaires, sécurité, témoignages, FAQ et CTA.' : needsKidsEducation ? 'Story-world applicatif : hero produit, écran enfant, cartes jeux/histoires/comptines, espace parent, modules courts.' : needsCustomConcept ? (needsLibraryConcept ? 'Hero salle de lecture, rayonnages, parcours culturel, espaces immersifs et CTA visite.' : needsUrbanFarmConcept ? 'Hero ferme verticale, serre, capteurs, production locale, preuves et CTA partenariat.' : needsGardenConcept ? 'Hero balcon vivant, diagnostic IA, configurateur 3D, abonnement plantes, suivi capteurs, réalisations et CTA.' : 'Hero objet métier, diagnostic, simulation, offres, suivi, preuves et CTA.') : needsLuminaCreative ? 'Showcase premium : hero surface ou scène sectorielle, image métier en profondeur, modules flottants utiles, preuves et CTA.' : needsTravelAgency ? 'Hero vidéo, destinations immersives, carte interactive, itinéraires, assistant IA, témoignages et CTA final.' : needsHotel ? 'Hero photo, chambres, tarifs, galerie, localisation, avis, réservation.' : needsArchitecture ? 'Hero visuel, projets sélectionnés, services, philosophie, témoignages, contact.' : `Hero focal sur l'objet métier, ${sectionHint}, preuve visuelle, moment mémorable, puis contact.`,
        },
        visualConcept: {
            heroComposition: needsAccountingApp ? 'Immense mockup logiciel flottant avec fenêtres macOS superposées, factures, documents, graphiques, notifications et assistant IA.' : needsKidsEducation ? 'Premier écran comme un monde applicatif avec écran enfant, cartes jeux, histoires, comptines et panneau parent.' : needsCustomConcept ? (needsLibraryConcept ? 'Grande salle de lecture avec rayonnages, livres papier, lumière douce et modules numériques discrets autour du parcours visiteur.' : needsUrbanFarmConcept ? 'Ferme verticale lumineuse avec plantes, bacs hydroponiques, capteurs, données de croissance et action partenariat.' : needsGardenConcept ? 'Balcon miniature en 3D flottante, plantes suspendues, bulles capteurs, diagnostic IA et carte abonnement autour de la scène.' : `Objet central ${customConceptName} en scène flottante, modules de diagnostic, simulation et preuve visuelle.`) : needsLuminaCreative ? 'Scène immersive avec visuel métier en profondeur, surface premium, modules flottants utiles et action claire.' : needsTravelAgency ? 'Grand hero vidéo avec destination forte, carte flottante, itinéraire en cours et assistant IA voyage.' : needsImmersive ? 'Grand hero visuel pleine largeur avec ambiance sectorielle, promesse courte et réservation visible.' : needsHotel ? 'Hero immersif avec photo forte, disponibilité et appel à réserver.' : needsArchitecture ? 'Grand visuel architectural, typographie forte et CTA discret mais visible.' : `Grande scène autour de ${activity}, avec objet ou geste métier en premier plan, surface premium et CTA intégré sans écraser le visuel.`,
            ambience: needsAccountingApp ? 'Futuriste, premium, transparent, profond et entièrement orienté pilotage financier.' : needsKidsEducation ? 'Futur doux, ludique, immersif et rassurant pour les parents.' : needsCustomConcept ? 'Futuriste, vivant, pédagogique et très visuel.' : needsLuminaCreative ? 'Futuriste, premium, transparent, lisible, profond et désirable.' : needsTravelAgency ? 'Cinématique, inspirante, haut de gamme et orientée exploration.' : needsHotel ? 'Premium accueillant, rassurant et sensoriel.' : needsArchitecture ? 'Minimal, lumineux, haut de gamme et orienté réalisations.' : needsWellness ? `Naturelle, calme, sensorielle et orientée réservation, avec ${styleHint}.` : needsAppointment ? `Élégant, local et orienté rendez-vous, avec ${styleHint}.` : `Moderne, clair et commercial, avec ${styleHint}.`,
            colorPalette: needsAccountingApp ? ['bleu nuit logiciel', 'turquoise IA', 'verre dépoli', 'blanc lumineux', 'vert trésorerie', 'violet sécurité'] : needsKidsEducation ? ['nuit indigo', 'menthe interactive', 'jaune soleil', 'corail doux', 'lilas futur', 'verre translucide'] : needsLuminaCreative ? ['carbone profond', 'verre translucide', 'cyan lumineux', 'vert menthe', 'rose froid', 'blanc optique'] : ['fond profond ou clair selon secteur', 'accent lumineux pour les actions', 'contraste fort pour la lecture'],
            imageKeywords: needsAccountingApp ? ['logiciel comptable futuriste', 'factures flottantes', 'assistant IA financier', 'tableaux financiers', 'intégration bancaire'] : needsKidsEducation ? ['interface app enfant', 'univers educatif futur doux', 'cartes jeux histoires comptines', 'espace parent'] : needsCustomConcept ? (needsLibraryConcept ? ['bibliotheque moderne', 'rayonnages de livres', 'salle de lecture', 'livres papier', 'espace culturel'] : needsUrbanFarmConcept ? ['ferme verticale', 'hydroponie', 'serre urbaine', 'plantes sous lumière', 'capteurs agricoles'] : needsGardenConcept ? ['jardin suspendu balcon', 'plantes en pot design', 'capteurs végétaux', 'rendu 3D balcon', 'abonnement plantes'] : [customConceptName, 'objet métier central', 'simulation visuelle', 'assistant IA métier']) : needsTravelAgency ? ['destination immersive', 'itinéraire sur mesure', 'carte voyage interactive', 'assistant IA voyage'] : [activity, needsHotel ? 'chambre lumineuse' : needsArchitecture ? 'architecture intérieure projet design' : needsAppointment ? 'service en action' : 'objet métier en gros plan', 'preuve visuelle réelle'],
            layoutSignature: needsAccountingApp ? 'Finance OS immersif avec grandes fenêtres superposées, panneaux flottants et sections toutes distinctes.' : needsKidsEducation ? 'Story-world avec modules applicatifs, progression parent et parcours lumineux entre les activités.' : needsCustomConcept ? 'Showcase concept avec objet central, diagnostic, simulation, suivi intelligent et preuves non répétitives.' : needsLuminaCreative ? 'Showcase Lumina avec surfaces de verre, profondeur 4D, modules non répétitifs et narration propre au secteur.' : needsTravelAgency ? 'Parcours voyage cinématique avec vidéo, destinations, carte, itinéraires, IA et témoignages.' : needsHotel ? 'Parcours réservation avec galerie et localisation visibles.' : needsArchitecture ? 'Portfolio visuel avec cartes projets, détails et navigation élégante.' : 'Aperçu premium avec sections courtes, preuves et contact rapide.',
            microInteractions: needsAccountingApp ? ['graphiques qui se dessinent', 'documents qui flottent', 'assistant IA qui signale les échéances', 'widgets bancaires qui pulsent'] : needsKidsEducation ? ['cartes jeux qui respirent', 'progression parent animée', 'parcours lumineux entre les activités'] : needsCustomConcept ? ['objet central qui flotte', 'diagnostic IA qui révèle les contraintes', 'données de suivi qui pulsent', 'simulation avant/après'] : needsLuminaCreative ? ['surface principale qui flotte doucement', 'reflets transparents au survol', 'modules métier qui apparaissent en profondeur'] : ['bouton principal lumineux', 'cartes flottantes', 'transition douce entre sections'],
            signatureMoment: needsAccountingApp ? 'Une facture se transforme en graphique vivant pendant que l’assistant IA prépare les échéances.' : needsKidsEducation ? 'Un parcours lumineux relie jeux, histoires, comptines et suivi parent comme une carte d’aventure.' : needsCustomConcept ? (needsGardenConcept ? 'Le balcon miniature se remplit de plantes, capteurs et rendu 3D autour d’un diagnostic IA.' : `L’objet central ${customConceptName} devient une scène explicative que le visiteur comprend en quelques secondes.`) : needsLuminaCreative ? `Une surface Lumina met ${activity} au centre avec modules flottants, lumière et preuve métier.` : needsTravelAgency ? 'Une carte vivante relie destination, itinéraire, budget et assistant IA voyage.' : needsHotel ? 'La vue du séjour devient l’écran principal, avec disponibilité et réservation intégrées.' : needsArchitecture ? 'Une villa ou une maquette matière devient le décor focal du premier écran.' : `Un détail fort de ${activity} devient le repère visuel de toute la maquette.`,
            wowFactor: needsAccountingApp ? 'Le visiteur voit immédiatement un logiciel comptable nouvelle génération, pas un template SaaS Bootstrap.' : needsKidsEducation ? 'Le premier écran ressemble à un produit éducatif vivant, pas à une vitrine générique.' : needsCustomConcept ? 'Le visiteur comprend un métier rare grâce à une scène visuelle qu’il n’aurait pas imaginée seul.' : needsLuminaCreative ? 'Le visiteur voit une expérience nouvelle génération adaptée au métier, pas une page magazine.' : `Le premier écran semble dessiné pour ${activity}, avec une mise en valeur impossible à confondre avec un autre métier.`,
        },
        siteModel: {
            name: needsAccountingApp ? 'Direction Finance OS IA' : needsKidsEducation ? 'Direction story-world éducatif' : needsCustomConcept ? 'Direction Canvas pro / Lumina métier' : needsLuminaCreative ? 'Direction Lumina métier' : needsTravelAgency ? 'Direction voyage immersif' : needsHotel ? 'Direction hôtel + réservation' : needsArchitecture ? 'Direction architecture premium' : needsWellness ? 'Direction bien-être immersive' : needsShop ? 'Direction catalogue + commande' : needsAppointment ? 'Direction rendez-vous local' : 'Direction vitrine professionnelle',
            description: needsAccountingApp ? 'Une expérience logicielle immersive qui met en scène factures, banque, TVA, documents et assistant IA.' : needsKidsEducation ? 'Une expérience applicative qui donne envie à l’enfant d’explorer et rassure les parents par un suivi clair.' : needsCustomConcept ? `Une expérience qui rend ${customConceptName} visible grâce à une scène métier, une simulation et un suivi intelligent.` : needsLuminaCreative ? 'Une scène premium futuriste qui garde le métier au centre avec surfaces, profondeur, visuels et modules utiles.' : needsTravelAgency ? 'Une expérience cinématique qui donne envie d’explorer et de construire un itinéraire sur mesure.' : needsHotel ? 'Une structure pensée pour montrer les chambres, rassurer, localiser et convertir vers la réservation.' : needsArchitecture ? 'Une expérience visuelle qui valorise les projets, la méthode et la prise de contact.' : needsWellness ? 'Une expérience sensorielle qui valorise le lieu, les ateliers, les tarifs et la réservation.' : needsShop ? 'Une page d’accueil qui mène vite vers le catalogue, les produits et la commande.' : needsAppointment ? 'Une page d’accueil centrée sur les prestations, les preuves et la prise de rendez-vous.' : 'Une vitrine claire pour expliquer l’activité, rassurer et obtenir une demande.',
            sections: [
                needsAccountingApp ? 'Hero logiciel flottant' : needsKidsEducation ? 'Hero monde applicatif enfant' : needsCustomConcept ? 'Hero objet métier en scène' : needsLuminaCreative ? 'Hero surface Lumina' : needsTravelAgency ? 'Hero vidéo destination' : needsHotel ? 'Hero hôtel avec bouton Réserver' : 'Hero avec promesse et bouton principal',
                needsAccountingApp ? 'Factures, devis et documents' : needsKidsEducation ? 'Jeux, histoires et comptines' : needsCustomConcept ? 'Diagnostic, simulation et suivi' : needsTravelAgency ? 'Destinations immersives' : needsHotel ? 'Chambres et équipements' : needsArchitecture ? 'Projets sélectionnés' : needsWorkshops ? 'Ateliers à mettre en avant' : needsShop ? 'Produits ou catégories' : 'Prestations principales',
                needsAccountingApp ? 'Assistant IA et automatisations' : needsKidsEducation ? 'Progression et espace parent' : needsCustomConcept ? 'Preuves visuelles du concept' : needsTravelAgency ? 'Itinéraires personnalisés' : needsHotel || needsPricing ? 'Tarifs ou disponibilités' : needsArchitecture ? 'Méthode et philosophie' : needsPortfolio ? 'Réalisations ou portfolio' : 'Preuves de confiance',
                needsAccountingApp ? 'Banque, sécurité et FAQ' : needsKidsEducation ? 'Parcours et sécurité enfant' : needsCustomConcept ? 'Action et demande qualifiée' : needsTravelAgency ? 'Carte et assistant IA' : needsGallery ? 'Galerie et ambiance du lieu' : needsHotel ? 'Galerie et localisation' : needsArchitecture ? 'Contact projet' : needsAppointment ? 'Prise de rendez-vous' : 'Contact rapide',
            ],
        },
        recommendedOffer: needsAccountingApp ? 'Projet spécifique' : needsKidsEducation ? 'Projet spécifique' : needsHotel ? 'Offre Signature' : needsShop ? 'Offre Pro' : needsPortfolio ? 'Mini-page professionnelle' : needsAppointment ? 'Offre Pro' : needsWordPress ? 'Projet spécifique' : 'Offre Essentiel',
        pages,
        homeSections: needsAccountingApp ? [
            { title: 'Logiciel nouvelle génération', text: 'Le premier écran montre un vrai espace de pilotage avec factures, banque, documents et alertes.' },
            { title: 'Assistant IA comptable', text: 'L’IA explique les dépenses, anticipe la TVA et signale les échéances importantes.' },
            { title: 'Automatisation financière', text: 'Les justificatifs, transactions, devis et factures se regroupent dans un flux clair.' },
        ] : needsKidsEducation ? [
            { title: 'Monde à explorer', text: 'L’enfant entre dans un univers visuel avec jeux, histoires et comptines accessibles en un geste.' },
            { title: 'Apprentissage doux', text: 'Les activités courtes créent un rythme rassurant, progressif et adapté à l’âge.' },
            { title: 'Espace parent', text: 'Les parents suivent la progression, les profils, le temps d’écran et les contenus favoris.' },
        ] : needsCustomConcept ? [
            { title: needsGardenConcept ? 'Balcon transformé' : 'Concept en scène', text: needsGardenConcept ? 'Le premier écran montre un balcon miniature qui devient un jardin suspendu vivant.' : `Le premier écran rend ${customConceptName} visible grâce à une scène métier claire.` },
            { title: needsGardenConcept ? 'Diagnostic IA & rendu 3D' : 'Diagnostic & simulation', text: 'Le visiteur comprend les contraintes, visualise le résultat et choisit une piste adaptée.' },
            { title: needsGardenConcept ? 'Suivi capteurs' : 'Suivi intelligent', text: 'Les modules montrent l’accompagnement, les alertes, les abonnements ou les preuves de résultat.' },
        ] : needsLuminaCreative ? [
            { title: 'Scène immersive', text: 'Le premier écran combine image métier, surface transparente, message court et action visible.' },
            { title: 'Assistant IA utile', text: 'Un module d’aide guide le visiteur selon son besoin sans détourner le contenu du secteur.' },
            { title: 'Preuves en profondeur', text: 'Réalisations, offres ou expertises apparaissent dans des modules distincts, lisibles et non répétitifs.' },
        ] : needsTravelAgency ? [
            { title: 'Destinations immersives', text: 'Grandes vidéos, visuels forts et ambiances donnent envie de partir dès le premier écran.' },
            { title: 'Itinéraires personnalisés', text: 'Les étapes, saisons, durées et expériences se construisent autour des envies du voyageur.' },
            { title: 'Carte & assistant IA', text: 'La carte interactive et l’assistant IA aident à explorer et cadrer le voyage.' },
        ] : needsLegal ? [
            { title: 'Expertises claires', text: 'Les domaines de droit sont organisés par besoin et niveau d’accompagnement.' },
            { title: 'Rendez-vous confidentiel', text: 'Le parcours facilite une première demande structurée et rassurante.' },
            { title: 'Équipe & méthode', text: 'Les avocats, étapes et honoraires réduisent l’incertitude.' },
        ] : needsVeterinary ? [
            { title: 'Rendez-vous rapide', text: 'Le visiteur trouve vite l’action principale, les horaires et les urgences.' },
            { title: 'Équipe rassurante', text: 'Les praticiens, spécialités et conseils créent une relation humaine.' },
            { title: 'Conseils utiles', text: 'Fiches pratiques, prévention et informations préparent la visite.' },
        ] : needsSport ? [
            { title: 'Cours réservables', text: 'Planning, coachs et niveaux sont visibles dès le parcours principal.' },
            { title: 'Coaching & nutrition', text: 'L’accompagnement relie objectifs, programmes et habitudes.' },
            { title: 'Espace membre', text: 'Progression, performances, séances et abonnements sont connectés.' },
        ] : needsMenu ? [
            { title: 'Menu interactif', text: 'La carte, les menus et les temps forts culinaires sont lisibles et désirables.' },
            { title: 'Histoire du chef', text: 'Le parcours raconte la signature, les inspirations et le niveau d’exigence.' },
            { title: 'Réservation élégante', text: 'Le visiteur peut réserver vite, tout en ressentant l’ambiance du lieu.' },
        ] : needsArchitecture ? [
            { title: 'Projets sélectionnés', text: 'Une galerie éditoriale met en avant les réalisations, les volumes, les matières et les détails.' },
            { title: 'Architecture intérieure', text: 'Les services expliquent la conception, la rénovation, le suivi et l’accompagnement du projet.' },
            { title: 'Signature du studio', text: 'La philosophie, les inspirations et les preuves clients renforcent la valeur premium.' },
        ] : [
            { title: `Bienvenue chez ${siteName}`, text: needsHotel ? `Un accueil visuel présente l'hôtel, l'ambiance, la ville et le bouton ${mainAction}.` : `Une page d'accueil claire pour expliquer l'activité, rassurer le visiteur et l'orienter vers ${mainAction.toLowerCase()}.` },
            { title: needsWorkshops ? 'Ateliers à découvrir' : needsHotel ? 'Chambres et services' : needsShop ? 'Produits ou catalogue' : 'Prestations principales', text: needsWorkshops ? 'Les ateliers sont mis en avant avec leur ambiance, leurs bénéfices et le chemin de réservation.' : needsHotel ? 'Les chambres, équipements et services sont présentés avec photos, tarifs ou indications pratiques.' : needsShop ? 'Les produits sont présentés par catégorie, avec un chemin simple vers la commande.' : 'Les services sont présentés avec des mots simples, des tarifs ou indications pratiques.' },
            { title: needsGallery ? 'Galerie et ambiance' : needsPricing ? 'Tarifs clairs' : 'Contact rapide', text: needsGallery ? 'De grandes images montrent le lieu, les détails et les preuves visuelles attendues.' : needsPricing ? 'Les prix, formules ou abonnements sont lisibles avant la prise de contact.' : `Un bouton ${mainAction} reste visible pour transformer la visite en demande concrète.` },
        ],
        services: needsAccountingApp ? [
            { name: 'Pilotage financier', description: 'Chiffre d’affaires, dépenses, trésorerie, TVA et échéances visibles en un coup d’œil.' },
            { name: 'Factures & documents', description: 'Devis, factures, justificatifs et exports regroupés dans une interface claire.' },
            { name: 'Assistant IA comptable', description: 'Questions, anomalies, prévisions et recommandations expliquées en langage simple.' },
        ] : needsKidsEducation ? [
            { name: 'Mini-jeux éducatifs', description: 'Activités courtes avec objectifs, niveaux et récompenses douces.' },
            { name: 'Histoires interactives', description: 'Récits, choix simples et univers visuel pour garder l’enfant engagé.' },
            { name: 'Suivi parent', description: 'Progression, temps d’usage, profils et préférences dans une vue claire.' },
        ] : needsCustomConcept ? [
            { name: needsGardenConcept ? 'Diagnostic balcon IA' : 'Diagnostic IA', description: 'Identifier les contraintes, envies, budget et niveau d’accompagnement.' },
            { name: needsGardenConcept ? 'Rendu 3D végétal' : 'Simulation visuelle', description: 'Projeter le résultat avec une scène claire, premium et compréhensible.' },
            { name: needsGardenConcept ? 'Abonnement & capteurs' : 'Suivi intelligent', description: 'Présenter le suivi, les alertes, abonnements ou données utiles après la demande.' },
        ] : needsTravelAgency ? [
            { name: 'Voyages sur mesure', description: 'Séjours construits selon les envies, dates, budget et rythme.' },
            { name: 'Itinéraires personnalisés', description: 'Étapes, expériences et cartes organisées pour chaque profil de voyageur.' },
            { name: 'Assistant IA voyage', description: 'Questions, inspirations et cadrage du projet avant échange avec un expert.' },
        ] : needsLegal ? [
            { name: 'Expertises juridiques', description: 'Domaines de droit structurés pour comprendre rapidement l’accompagnement.' },
            { name: 'Rendez-vous confidentiel', description: 'Demande claire, sécurisée et orientée premier échange.' },
            { name: 'Actualités juridiques', description: 'Analyses courtes pour renforcer expertise et référencement.' },
        ] : needsVeterinary ? [
            { name: 'Rendez-vous', description: 'Demande de créneau, urgence, horaires et informations pratiques.' },
            { name: 'Équipe clinique', description: 'Présenter les praticiens, spécialités et approche humaine.' },
            { name: 'Conseils & fiches', description: 'Prévention, suivi et informations utiles avant la visite.' },
        ] : needsSport ? [
            { name: 'Réservation de cours', description: 'Planning, niveaux et coachs accessibles rapidement.' },
            { name: 'Suivi performance', description: 'Progression, objectifs, séances et espace membre.' },
            { name: 'Coaching nutrition', description: 'Accompagnement complet pour transformer les habitudes.' },
        ] : needsMenu ? [
            { name: 'Menu interactif', description: 'Carte claire, plats, menus, prix et éventuels accords.' },
            { name: 'Réservation en ligne', description: 'Choisir une date ou demander une table sans friction.' },
            { name: 'Histoire du chef', description: 'Mettre en valeur la signature culinaire et l’expérience.' },
        ] : [
            { name: needsWorkshops ? 'Ateliers' : needsHotel ? 'Chambres' : needsShop ? 'Catalogue en ligne' : "Présentation de l'activité", description: needsWorkshops ? 'Présenter les ateliers, leurs objectifs, leurs dates et l’ambiance attendue.' : needsHotel ? 'Présenter chaque chambre avec photos, équipements, capacité et ambiance.' : 'Un bloc court pour dire ce qui est proposé, pour qui et dans quelle zone.' },
            { name: needsHotel ? 'Réservation' : needsAppointment ? 'Rendez-vous' : 'Contact direct', description: needsHotel ? 'Formulaire de disponibilité, téléphone, e-mail et éventuellement acompte.' : needsAppointment ? 'Un lien de réservation, téléphone ou WhatsApp pour choisir un créneau.' : 'Un formulaire simple, un e-mail professionnel ou un lien WhatsApp.' },
            { name: needsGallery ? 'Galerie immersive' : needsHotel ? 'Localisation et galerie' : 'Preuves et confiance', description: needsGallery ? 'Photos larges, ambiance du lieu et détails rassurants pour créer la projection.' : needsHotel ? 'Google Maps, photos, points d’intérêt et avis clients.' : 'Photos, avis, exemples, certifications ou informations pratiques.' },
        ],
        ctas: needsAccountingApp ? [mainAction, 'Analyser mes finances', 'Importer un document'] : needsKidsEducation ? [mainAction, 'Espace parent', 'Découvrir les histoires'] : needsCustomConcept ? [mainAction, needsGardenConcept ? 'Lancer le diagnostic balcon' : 'Voir la simulation', needsGardenConcept ? 'Voir les abonnements plantes' : 'Parler du concept'] : needsTravelAgency ? [mainAction, 'Explorer les destinations', 'Parler à un expert'] : needsLegal ? [mainAction, 'Découvrir nos expertises', 'Poser une question'] : needsVeterinary ? [mainAction, 'Voir les urgences', 'Contacter la clinique'] : needsSport ? [mainAction, 'Voir les cours', 'Découvrir les abonnements'] : needsMenu ? [mainAction, 'Voir le menu', 'Découvrir le chef'] : [mainAction, needsWorkshops ? 'Voir les ateliers' : needsHotel ? 'Demander une disponibilité' : 'Voir les prestations', needsPricing ? 'Voir les tarifs' : 'Contacter maintenant'],
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
            'La direction est déduite de la demande libre, sans choix de style prédéfini.',
            "La structure commence par le besoin du visiteur pour éviter l'effet bloc-note.",
            'Les options comme e-mail pro, domaine et QR code sont ajoutées seulement quand elles aident le projet.',
        ],
        contactMessage: [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            `Type de projet : ${needsAccountingApp ? 'application comptable IA premium' : needsKidsEducation ? 'application éducative immersive enfant' : needsShop ? 'boutique en ligne simple' : needsAppointment ? 'site avec prise de rendez-vous' : 'site vitrine professionnel'}`,
            `Slogan proposé : ${needsAccountingApp ? 'La compta claire, enfin directe.' : needsKidsEducation ? 'Apprendre en jouant, tout doucement.' : needsShop ? 'Des produits clairs, faciles à découvrir et commander.' : `Une présence claire pour présenter ${activity} et recevoir des contacts.`}`,
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            `Actions conseillées : ${needsAccountingApp ? [mainAction, 'Analyser mes finances', 'Importer un document'].join(', ') : needsKidsEducation ? [mainAction, 'Espace parent', 'Découvrir les histoires'].join(', ') : [mainAction, 'Voir les prestations', 'Contacter maintenant'].join(', ')}`,
            `Offre pressentie : ${needsAccountingApp ? 'Projet spécifique' : needsKidsEducation ? 'Projet spécifique' : needsShop ? 'Offre Pro' : needsPortfolio ? 'Mini-page professionnelle' : needsAppointment ? 'Offre Pro' : 'Offre Essentiel'}`,
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet."
        ].join('\n'),
    };

    return needsBridalCouture ? enforceBridalCoutureProposal(sanitized, sanitized, brief) : sanitized;
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

const isBridalProject = (brief = '', proposal = {}) => {
    const source = [
        brief,
        proposal.projectType,
        proposal.sectorKey,
        proposal.siteName,
        proposal.slogan,
        proposal.summary,
        proposal.valueProposition,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.siteModel && proposal.siteModel.name,
        ...(Array.isArray(proposal.pages) ? proposal.pages.map((page) => page && page.name) : []),
        ...(Array.isArray(proposal.homeSections) ? proposal.homeSections.map((section) => section && section.title) : []),
        ...(Array.isArray(proposal.services) ? proposal.services.map((service) => service && service.name) : []),
    ]
        .map((value) => stripAccents(normalizeText(value || '').toLowerCase()))
        .join(' ');

    return /\b(robe|robes|robe de mariee|robe de mariage|mariee|mariage|couture|haute couture|atelier couture|collection mariee|bridal|wedding dress|essayage|voile|dentelle|soie|broderie|tulle|satin)\b/.test(source);
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
        signatureMoment: normalizeText(visualConcept.signatureMoment) || fallbackVisual.signatureMoment || '',
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

const isAccountingProject = (brief = '', proposal = {}) => {
    const source = [
        brief,
        proposal.projectType,
        proposal.sectorKey,
        proposal.siteName,
        proposal.summary,
        proposal.valueProposition,
        proposal.siteModel && proposal.siteModel.name,
        ...(Array.isArray(proposal.pages) ? proposal.pages.map((page) => page && page.name) : []),
        ...(Array.isArray(proposal.homeSections) ? proposal.homeSections.map((section) => section && section.title) : []),
    ]
        .map((value) => stripAccents(normalizeText(value || '').toLowerCase()))
        .join(' ');

    return hasAccountingIntent(source);
};

const accountingForbiddenPattern = /\b(jeux?|histoires?|comptines?|espace parent|commencer a jouer|commencer à jouer|apprentissage progressif|monde a explorer|monde à explorer|activites du jour|activités du jour)\b/i;

const filterAccountingItems = (items = [], titleKeys = ['name', 'title'], textKeys = ['goal', 'text', 'description', 'reason']) =>
    limitArray(items, 12).filter((item) => {
        const text = stripAccents(normalizeText([
            ...titleKeys.map((key) => item && item[key]),
            ...textKeys.map((key) => item && item[key]),
            typeof item === 'string' ? item : '',
        ].filter(Boolean).join(' ')).toLowerCase());

        return !accountingForbiddenPattern.test(text);
    });

const enforceAccountingProposal = (proposal = {}, fallback = buildFallbackProposal('logiciel de comptabilite')) => {
    const proposalSource = stripAccents(JSON.stringify(proposal || {}).toLowerCase());
    const siteName = /contadirect/.test(proposalSource)
        ? 'ContaDirect'
        : normalizeText(proposal.siteName) || normalizeText(fallback.siteName) || 'ComptaPilot';
    const requiredPages = [
        { name: 'Aperçu logiciel', goal: 'Montrer l’interface, les fenêtres financières et les actions rapides.' },
        { name: 'Factures & devis', goal: 'Créer, envoyer, relancer et suivre les documents commerciaux.' },
        { name: 'Trésorerie', goal: 'Suivre chiffre d’affaires, dépenses, solde et prévisions.' },
        { name: 'Assistant IA', goal: 'Expliquer les dépenses, échéances, TVA et anomalies.' },
        { name: 'Automatisations', goal: 'Importer justificatifs, rapprocher transactions et préparer les échéances.' },
        { name: 'Sécurité', goal: 'Rassurer sur accès, données, exports et confidentialité.' },
        { name: 'Contact', goal: 'Prévoir une demande de démo ou cadrage projet.' },
    ];
    const requiredSections = [
        { title: 'Logiciel nouvelle génération', text: 'Le premier écran montre un espace de pilotage avec factures, banque, documents et alertes.' },
        { title: 'Assistant IA comptable', text: 'L’IA explique les dépenses, anticipe la TVA et signale les échéances importantes.' },
        { title: 'Automatisation financière', text: 'Les justificatifs, transactions, devis et factures se regroupent dans un flux clair.' },
        { title: 'Intégrations bancaires', text: 'Les mouvements bancaires se rapprochent des documents pour limiter les oublis.' },
        { title: 'Sécurité & exports', text: 'Les données, accès et exports restent lisibles, contrôlés et rassurants.' },
    ];
    const requiredServices = [
        { name: 'Interface produit sur mesure', reason: 'Le projet doit montrer un vrai logiciel comptable, pas une vitrine.', priceFrom: 'Projet spécifique' },
        { name: 'Assistant IA métier', reason: 'Utile pour expliquer dépenses, TVA, échéances et anomalies.', priceFrom: 'Projet spécifique' },
        { name: 'Espace client simple', reason: 'Nécessaire pour sauvegarder documents, préférences et historiques.', priceFrom: 'Projet spécifique' },
        { name: 'Import documents', reason: 'Factures, justificatifs et contrats doivent être centralisés.', priceFrom: 'Projet spécifique' },
        { name: 'Connexion bancaire', reason: 'Pertinent pour rapprocher transactions, soldes et trésorerie.', priceFrom: 'Projet spécifique' },
    ];

    proposal.projectType = 'Application comptable IA premium';
    proposal.sectorKey = 'accounting';
    proposal.siteName = siteName;
    proposal.visualMood = 'accounting-neural';
    proposal.layoutVariant = 'finance-os';
    proposal.showGallery = false;
    proposal.slogan = normalizeText(proposal.slogan) || 'La compta claire, enfin directe.';
    proposal.summary = normalizeText(proposal.summary) || `${siteName} doit ressembler à un logiciel comptable nouvelle génération, pas à un template SaaS standard.`;
    proposal.valueProposition = normalizeText(proposal.valueProposition) || 'Une interface IA qui relie revenus, dépenses, TVA, factures, banque et documents dans un espace visuel unique.';
    proposal.styleGuide = {
        ...(proposal.styleGuide && typeof proposal.styleGuide === 'object' ? proposal.styleGuide : {}),
        direction: 'Interface premium inspirée macOS, Figma et Lumina : verre dépoli, profondeur, lumières bleues et turquoise, fenêtres superposées et assistant IA visible.',
        colors: 'Bleu nuit logiciel, turquoise IA, verre translucide, blanc lumineux, vert trésorerie et violet sécurité.',
        typography: 'Sans-serif premium, chiffres très lisibles, libellés financiers courts et respiration généreuse.',
        layout: 'Finance OS immersif : hero logiciel, aperçu produit, assistant IA, automatisations, intégrations bancaires, sécurité, témoignages, FAQ et CTA.',
    };
    proposal.visualConcept = {
        ...(proposal.visualConcept && typeof proposal.visualConcept === 'object' ? proposal.visualConcept : {}),
        heroComposition: 'Immense mockup logiciel flottant avec plusieurs fenêtres macOS superposées, factures, documents, graphiques, notifications et assistant IA.',
        ambience: 'Futuriste, premium, transparent, profond et entièrement orienté pilotage financier.',
        colorPalette: ['bleu nuit logiciel', 'turquoise IA', 'verre dépoli', 'blanc lumineux', 'vert trésorerie', 'violet sécurité'],
        imageKeywords: ['logiciel comptable futuriste', 'factures flottantes', 'assistant IA financier', 'tableaux financiers', 'intégration bancaire'],
        layoutSignature: 'Finance OS immersif avec grandes fenêtres superposées, panneaux flottants et sections toutes distinctes.',
        microInteractions: ['graphiques qui se dessinent', 'documents qui flottent', 'assistant IA qui signale les échéances', 'widgets bancaires qui pulsent'],
        wowFactor: 'Le visiteur voit immédiatement un logiciel comptable nouvelle génération, pas un template SaaS Bootstrap.',
    };
    proposal.siteModel = {
        ...(proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {}),
        name: 'Direction Finance OS IA',
        description: 'Une expérience logicielle immersive qui met en scène factures, banque, TVA, documents et assistant IA.',
        sections: ['Hero logiciel flottant', 'Aperçu logiciel', 'Assistant IA', 'Automatisations', 'Intégrations bancaires', 'Sécurité', 'Témoignages', 'FAQ'],
    };
    proposal.pages = mergeRequiredPages(filterAccountingItems(proposal.pages || []), requiredPages, 8);
    proposal.homeSections = [
        ...filterAccountingItems(proposal.homeSections || [], ['title'], ['text']),
        ...requiredSections,
    ]
        .filter((section, index, list) => list.findIndex((candidate) => stripAccents(normalizeText(candidate.title).toLowerCase()) === stripAccents(normalizeText(section.title).toLowerCase())) === index)
        .slice(0, 5);
    proposal.services = [
        ...filterAccountingItems(proposal.services || [], ['name'], ['description']),
        { name: 'Pilotage financier', description: 'Chiffre d’affaires, dépenses, trésorerie, TVA et échéances visibles rapidement.' },
        { name: 'Factures & documents', description: 'Devis, factures, justificatifs et exports regroupés dans une interface claire.' },
        { name: 'Assistant IA comptable', description: 'Questions, anomalies, prévisions et recommandations expliquées simplement.' },
    ]
        .filter((service, index, list) => list.findIndex((candidate) => stripAccents(normalizeText(candidate.name).toLowerCase()) === stripAccents(normalizeText(service.name).toLowerCase())) === index)
        .slice(0, 5);
    proposal.recommendedServices = [
        ...filterAccountingItems(proposal.recommendedServices || [], ['name'], ['reason']),
        ...requiredServices,
    ]
        .filter((service, index, list) => list.findIndex((candidate) => getServiceKey(candidate.name) === getServiceKey(service.name)) === index)
        .slice(0, 9);
    proposal.ctas = limitArray(proposal.ctas, 5)
        .map(normalizeText)
        .filter(Boolean)
        .filter((cta) => !accountingForbiddenPattern.test(stripAccents(cta.toLowerCase())));
    if (!proposal.ctas.length) {
        proposal.ctas = ['Voir la démo IA', 'Analyser mes finances', 'Importer un document'];
    }
    proposal.contactMessage = [
        'Bonjour,',
        '',
        `Kirby a préparé une première proposition pour : ${siteName}.`,
        'Type de projet : application comptable IA premium.',
        'Direction visuelle : Finance OS premium inspiré macOS, Figma et Lumina.',
        'Contenu prévu : aperçu logiciel, factures, devis, trésorerie, TVA, banque, documents, assistant IA, automatisations et sécurité.',
        `Actions conseillées : ${proposal.ctas.slice(0, 3).join(', ')}.`,
        '',
        'Merci de me dire ce qu’il faut ajuster pour lancer le projet.',
    ].join('\n');

    return proposal;
};

const bridalForbiddenPattern = /\b(ordinateur|reunion|bureau corporate|dashboard|saas|logiciel|startup|consultant|tableau de bord|open space)\b/i;

const filterBridalItems = (items = [], titleKeys = ['name', 'title'], textKeys = ['goal', 'text', 'description', 'reason']) =>
    limitArray(items, 12).filter((item) => {
        const text = stripAccents(normalizeText([
            ...titleKeys.map((key) => item && item[key]),
            ...textKeys.map((key) => item && item[key]),
            typeof item === 'string' ? item : '',
        ].filter(Boolean).join(' ')).toLowerCase());

        return !bridalForbiddenPattern.test(text);
    });

const extractProjectBrandName = (brief = '') => {
    const explicit = normalizeText(
        (brief.match(/(?:pour|site pour|marque|nom|nommee|nommée|appelle)\s+["“']?([A-ZÀ-Ý][A-Za-zÀ-ÿ0-9'’& -]{2,42})/u) || [])[1] || '',
    )
        .replace(/\s+\b(?:robe|robes|mariage|mariee|mariée|avec|style|qui|dont)\b.*$/i, '')
        .replace(/["“”']/g, '')
        .trim();

    return explicit && !/^(un|une|le|la|les|des|site|atelier|robes?|mariage|haute couture)$/i.test(explicit)
        ? explicit
        : '';
};

const enforceBridalCoutureProposal = (proposal = {}, fallback = buildFallbackProposal('atelier de robes de mariee haute couture'), brief = '') => {
    const proposedName = normalizeText(proposal.siteName) || normalizeText(fallback.siteName);
    const brandFromBrief = extractProjectBrandName(brief);
    const siteName = brandFromBrief || (/^(studio atelier|atelier de robes|atelier)$/i.test(proposedName) ? '' : proposedName) || 'Maison Couture';
    const requiredPages = [
        { name: 'Accueil', goal: 'Installer l’univers couture et orienter vers collections ou essayage.' },
        { name: 'Collections', goal: 'Présenter robes de mariée, silhouettes, matières et détails.' },
        { name: 'Robes sur mesure', goal: 'Expliquer création, prises de mesures, retouches et accompagnement.' },
        { name: 'Essayages privés', goal: 'Donner envie de réserver un rendez-vous personnalisé.' },
        { name: 'Atelier', goal: 'Montrer dentelle, soie, broderie, voile et gestes couture.' },
        { name: 'Galerie', goal: 'Afficher robes portées, détails de matières et inspirations.' },
        { name: 'Rendez-vous', goal: 'Permettre une demande d’essayage claire et élégante.' },
    ];
    const requiredSections = [
        { title: 'Collection Mariée', text: 'Robes, voiles, dentelles et silhouettes sont présentés comme une vraie collection couture.' },
        { title: 'Essayage privé', text: 'Le parcours donne envie de réserver un moment calme, accompagné et personnalisé.' },
        { title: 'Atelier & matières', text: 'Broderie, tulle, soie et finitions rendent le savoir-faire visible.' },
    ];
    const requiredServices = [
        { name: 'Galerie premium', reason: 'Les robes doivent être désirables dès le premier écran.', priceFrom: 'Projet spécifique' },
        { name: 'Prise de rendez-vous', reason: 'Transformer l’envie en essayage privé.', priceFrom: 'Projet spécifique' },
        { name: 'Catalogue / collection', reason: 'Présenter robes, matières et inspirations sans e-commerce forcé.', priceFrom: 'Projet spécifique' },
        { name: 'Formulaire essayage', reason: 'Qualifier date du mariage, style, budget et disponibilités.', priceFrom: 'Projet spécifique' },
    ];

    proposal.projectType = 'Site couture mariage haut de gamme';
    proposal.sectorKey = 'bridal';
    proposal.siteName = siteName;
    proposal.visualMood = hasLuminaCreativeIntent(JSON.stringify(proposal || {})) ? 'lumina-couture' : 'bridal-couture';
    proposal.layoutVariant = proposal.visualMood === 'lumina-couture' ? 'lumina-showcase' : 'gallery-focus';
    proposal.showGallery = true;
    proposal.slogan = 'Des robes pour un jour unique.';
    proposal.summary = `${siteName} doit ressembler à une maison couture mariage, avec robes, matières, atelier et essayage privé.`;
    proposal.valueProposition = 'Une expérience premium qui donne envie de découvrir les collections, réserver un essayage et comprendre le savoir-faire couture.';
    proposal.positioning = {
        ...(proposal.positioning && typeof proposal.positioning === 'object' ? proposal.positioning : {}),
        audience: 'Futures mariées qui cherchent une robe élégante, personnalisée et accompagnée avec soin.',
        promise: 'Trouver une silhouette, ressentir les matières et réserver un essayage en toute confiance.',
        tone: 'Couture, délicat, moderne, lumineux et très premium.',
        differentiator: 'Un aperçu centré sur la robe, les détails de dentelle, l’atelier et le rendez-vous essayage.',
    };
    proposal.styleGuide = {
        ...(proposal.styleGuide && typeof proposal.styleGuide === 'object' ? proposal.styleGuide : {}),
        direction: 'Direction Lumina couture : surfaces translucides, lumière perle, détails de robe, dentelle, soie, reflets doux et profondeur moderne.',
        colors: 'Ivoire froid, noir couture, perle lumineuse, rose quartz, argent doux et cyan verre.',
        typography: 'Titres élégants mais contenus, sans-serif premium lisible, détails éditoriaux fins et aucun effet énorme ou vulgaire.',
        layout: 'Hero galerie couture, collection en mosaïque, atelier matières, essayage privé, témoignages, FAQ et CTA final.',
    };
    proposal.visualConcept = {
        ...(proposal.visualConcept && typeof proposal.visualConcept === 'object' ? proposal.visualConcept : {}),
        heroComposition: 'Grande robe de mariée en lumière, détails de dentelle, carte essayage flottante, collection visible et surface de verre Lumina.',
        ambience: 'Couture mariage moderne, lumineuse, désirable et calme.',
        colorPalette: ['ivoire froid', 'noir couture', 'perle lumineuse', 'rose quartz', 'argent doux', 'cyan verre'],
        imageKeywords: ['robe de mariée haute couture', 'atelier couture mariage', 'dentelle et broderie', 'essayage privé', 'voile et soie'],
        layoutSignature: 'Galerie asymétrique avec surfaces transparentes, détails matières et CTA essayage visible.',
        microInteractions: ['cartes collection qui flottent', 'reflets doux sur les tissus', 'bouton essayage lumineux', 'mosaïque robe en mouvement'],
        wowFactor: 'Le visiteur voit immédiatement une maison couture mariage, pas un template boutique ou une image corporate.',
    };
    proposal.siteModel = {
        ...(proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {}),
        name: 'Direction couture mariage',
        description: 'Une expérience visuelle premium dédiée aux robes de mariée, aux matières et aux essayages privés.',
        sections: ['Hero robe couture', 'Collections', 'Sur mesure', 'Essayage privé', 'Atelier & matières', 'Galerie', 'Rendez-vous'],
    };
    proposal.pages = requiredPages;
    proposal.homeSections = requiredSections;
    proposal.services = [
        ...filterBridalItems(proposal.services || [], ['name'], ['description']),
        { name: 'Collection couture', description: 'Robes, silhouettes, voiles et détails de matières.' },
        { name: 'Création sur mesure', description: 'Inspiration, essayage, retouches et accompagnement.' },
        { name: 'Essayage privé', description: 'Rendez-vous personnalisé en atelier ou showroom.' },
    ]
        .filter((service, index, list) => list.findIndex((candidate) => stripAccents(normalizeText(candidate.name).toLowerCase()) === stripAccents(normalizeText(service.name).toLowerCase())) === index)
        .slice(0, 5);
    proposal.recommendedServices = [
        ...filterBridalItems(proposal.recommendedServices || [], ['name'], ['reason']),
        ...requiredServices,
    ]
        .filter((service, index, list) => list.findIndex((candidate) => getServiceKey(candidate.name) === getServiceKey(service.name)) === index)
        .slice(0, 9);
    proposal.ctas = ['Réserver un essayage', 'Découvrir les collections', 'Voir l’atelier'];
    proposal.seo = {
        keywords: ['robe de mariée haute couture', 'atelier couture mariage', 'essayage robe de mariée', 'collection mariée'],
        searchExpressions: ['robe de mariée sur mesure', 'essayage robe de mariée', 'atelier couture mariage', 'créatrice robe de mariée'],
        titles: [`${siteName} - Robes de mariée haute couture`, 'Collections, essayages privés et atelier couture'],
        metaDescription: `${siteName} présente ses robes de mariée, ses collections, ses essayages privés et son savoir-faire couture.`,
    };
    proposal.seoKeywords = proposal.seo.keywords;
    proposal.contactMessage = [
        'Bonjour,',
        '',
        `Kirby a préparé une première proposition pour : ${siteName}.`,
        'Type de projet : site couture mariage haut de gamme.',
        'Direction visuelle : robe de mariée, atelier, dentelle, soie, surfaces Lumina et essayage privé.',
        `Pages proposées : ${proposal.pages.map((page) => page.name).join(', ')}.`,
        `Actions conseillées : ${proposal.ctas.slice(0, 3).join(', ')}.`,
        '',
        'Merci de me dire ce qu’il faut ajuster pour lancer le projet.',
    ].join('\n');

    return proposal;
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
    const bridalProject = isBridalProject(brief, proposal);
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

    const sanitized = {
        mode: proposal.mode || 'openai',
        projectType: normalizeText(proposal.projectType) || fallback.projectType,
        sectorKey: normalizeText(proposal.sectorKey) || normalizeText(fallback.sectorKey),
        siteName: normalizeText(proposal.siteName) || fallback.siteName,
        slogan: normalizeText(proposal.slogan) || fallback.slogan,
        summary: normalizeText(proposal.summary) || fallback.summary,
        valueProposition: normalizeText(proposal.valueProposition) || fallback.valueProposition,
        visualMood: normalizeDisplayText(proposal.visualMood) || fallback.visualMood || '',
        designVariant: Number.isFinite(Number(proposal.designVariant))
            ? Number(proposal.designVariant)
            : Number.isFinite(Number(fallback.designVariant))
                ? Number(fallback.designVariant)
                : 0,
        visualSeed: normalizeText(proposal.visualSeed) || fallback.visualSeed || '',
        showGallery: Boolean(proposal.showGallery || fallback.showGallery),
        revisionMode: normalizeText(proposal.revisionMode) || '',
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
        appliedChanges: limitArray(proposal.appliedChanges, 5).map(normalizeText).filter(Boolean),
        revisionHistory: limitArray(proposal.revisionHistory, 5)
            .map((item) => ({
                request: normalizeText(item && item.request),
                changes: limitArray(item && item.changes, 5).map(normalizeText).filter(Boolean),
            }))
            .filter((item) => item.request || item.changes.length),
        contactMessage: normalize(proposal.contactMessage) || fallback.contactMessage,
    };

    if (isAccountingProject(brief, sanitized)) {
        return enforceAccountingProposal(sanitized, fallback);
    }

    if (bridalProject || isBridalProject(brief, sanitized)) {
        return enforceBridalCoutureProposal(sanitized, fallback, brief);
    }

    return sanitized;
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

const detectFallbackSector = (text = '') => {
    const source = stripAccents(normalizeText(text).toLowerCase());

    if (hasFutureBankIntent(source)) return 'future-bank';
    if (hasAccountingIntent(source)) return 'accounting';
    if (/\b(dashboard|saas|logiciel)\b/.test(source)) return 'saas';
    if (/\b(station spatiale|tourisme spatial|sejour orbital|orbital|orbite|apesanteur|vue sur la terre)\b/.test(source)) return 'space-station-tourism';
    if (/\b(ville flottante|cite flottante|cité flottante|ville autonome|quartiers flottants|energie renouvelable)\b/.test(source)) return 'floating-city';
    if (/\b(musee|musée|civilisations disparues|archeologie|archéologie|realite augmentee|mondes perdus|artefacts)\b/.test(source)) return 'future-museum';
    if (/\b(hotel sous marin|hotel sous-marin|hotel sous l ocean|suites panoramiques|restaurant immerge|spa marin|faune marine)\b/.test(source)) return 'underwater-hotel';
    if (isKidsEducationBrief(text)) return 'kids-app';
    if (/\b(immobilier|agence immobiliere|annonce|bien immobilier|estimation|mandat)\b/.test(source)) return 'real-estate';
    if (/\b(architect|architecture|architecte|villa|villas|beton|verre|maitre d oeuvre|design d interieur)\b/.test(source)) return 'architecture';
    if (/\b(voyage|voyages|tourisme|destination|destinations|itineraire|road trip|circuit|safari|agence de voyage|voyage sur mesure)\b/.test(source)) return 'travel';
    if (/\b(avocat|avocats|juridique|droit|juriste|notaire|honoraires)\b/.test(source)) return 'legal';
    if (/\b(salle de sport|fitness|coach sportif|coaching|nutrition|musculation|performance|espace membre)\b/.test(source)) return 'sport';
    if (/\b(veterinaire|clinique veterinaire|urgence veterinaire|fiches animaux)\b/.test(source)) return 'veterinary';
    if (/\b(robe|robes|robe de mariee|robe de mariage|mariee|mariage|couture|haute couture|atelier couture|collection mariee|essayage|dentelle|soie|voile|broderie|tulle|satin|bridal|wedding dress)\b/.test(source)) return 'bridal';
    if (/\b(restaurant|menu|carte|plat|reservation table|brasserie)\b/.test(source)) return 'restaurant';
    if (/\b(jeu video|gaming|studio de jeu|trailer|discord|steam)\b/.test(source)) return 'gaming';
    if (/\b(musique|artiste|album|concert|discographie|clip)\b/.test(source)) return 'music';
    if (/\b(hotel|chambre|hebergement|gite|sejour|touristique)\b/.test(source)) return 'hotel';
    if (/\b(portfolio|cv|book|showreel)\b/.test(source)) return 'portfolio';
    return 'service';
};

const isFallbackHardRebuildRequest = (revision = '') => {
    const source = stripAccents(normalizeText(revision).toLowerCase());
    return /change de metier|changer de metier|changement de metier|nouvelle activite|nouveau projet|nouveau type|passe en|transforme en|reconstruire|refaire de zero|repartir de zero|nouvelle maquette/.test(source);
};

const getFallbackRevisionRebuildContext = (brief = '', revision = '') => {
    const baseSector = detectFallbackSector(brief);
    const revisedSector = detectFallbackSector(revision);
    const hardRebuildAsked = isFallbackHardRebuildRequest(revision);
    const sectorChanged = revisedSector !== 'service' && revisedSector !== baseSector;
    const typeChanged = /nouveau site|nouveau type|passe en|transforme en|au lieu de/.test(stripAccents(normalizeText(revision).toLowerCase()));

    return {
        shouldRebuild: hardRebuildAsked || sectorChanged || typeChanged,
        rebuiltBrief: normalizeText(revision),
    };
};

const shortenProposalText = (value = '', max = 86) => {
    const text = normalizeText(value);

    if (text.length <= max) {
        return text;
    }

    return `${text.slice(0, max - 1).trim()}…`;
};

const applyFallbackRevision = (currentProposal, revision, brief) => {
    const rebuildContext = getFallbackRevisionRebuildContext(brief, revision);
    if (rebuildContext.shouldRebuild && rebuildContext.rebuiltBrief) {
        return buildFallbackProposal(rebuildContext.rebuiltBrief);
    }

    const revisionBrief = `${brief}\n\nModification demandée à Kirby : ${revision}`;
    const proposal = buildFallbackProposal(revisionBrief);
    const currentName = normalizeText(currentProposal && currentProposal.siteName);
    const renameAsked = /renomme|renommer|nom|marque|appelle|s'appelle|s’appelle/.test(stripAccents(normalizeText(revision).toLowerCase()));

    if (currentName && !renameAsked) {
        proposal.siteName = currentName;
    }

    const requested = stripAccents(normalizeText(revision).toLowerCase());
    const source = stripAccents(normalizeText(revisionBrief).toLowerCase());

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
        const wellness = /\b(yoga|pilates|bien etre|bien-être|spa|massage|meditation|méditation|relaxation|soin|soins)\b/.test(source);
        addProposalPage(proposal, wellness
            ? { name: 'Le lieu', goal: 'Montrer l’ambiance, la lumière, les matières et les détails du studio.' }
            : { name: 'Photos', goal: 'Montrer des images fortes du lieu, des produits ou des réalisations.' });
        addProposalSection(proposal, wellness
            ? { title: 'Ambiance du lieu', text: 'De grandes images montrent l’atmosphère, les détails et la qualité de l’expérience.' }
            : { title: 'Galerie visuelle', text: 'Une section image met en avant les preuves visuelles du projet.' });
        addProposalService(proposal, { name: wellness ? 'Galerie immersive' : 'Galerie photos', reason: 'Utile pour rendre la proposition plus concrète et rassurante.', priceFrom: 'Inclus selon offre' });
    }

    if (/premium|luxe|elegant|elegance|signature|haut de gamme|plus beau|moderne/.test(requested)) {
        proposal.recommendedOffer = 'Offre Signature';
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = proposal.siteModel.name || proposal.projectType || 'Site professionnel premium';
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

    proposal.revisionMode = 'clean-regeneration';
    proposal.visualSeed = stripAccents(normalizeText(`${revisionBrief} clean-regeneration`).toLowerCase()).slice(0, 220);

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

const normalizeCvLanguageLevel = (value = '') => {
    const level = limitCvText(value, 72);
    const key = stripAccents(normalizeText(level).toLowerCase());
    const aliases = {
        'langue maternelle': 'Langue maternelle',
        maternelle: 'Langue maternelle',
        native: 'Langue maternelle',
        'native speaker': 'Langue maternelle',
        bilingual: 'Bilingue',
        bilingue: 'Bilingue',
        fluent: 'Courant',
        courant: 'Courant',
        courante: 'Courant',
        'professional working proficiency': 'Niveau professionnel',
        'working proficiency': 'Niveau professionnel',
        'niveau professionnel': 'Niveau professionnel',
        professionnel: 'Niveau professionnel',
        professionnelle: 'Niveau professionnel',
        intermediate: 'Niveau intermédiaire',
        intermediaire: 'Niveau intermédiaire',
        'niveau intermediaire': 'Niveau intermédiaire',
        elementary: 'Bases solides',
        'elementary level': 'Bases solides',
        'bases solides': 'Bases solides',
        beginner: 'Débutant',
        debutant: 'Débutant',
        basic: 'Notions',
        'basic english': 'Notions',
        'basic knowledge': 'Notions',
        'basic proficiency': 'Notions',
        bases: 'Notions',
        base: 'Notions',
        notions: 'Notions',
        notion: 'Notions',
    };

    return aliases[key] || level;
};

const detectCvLanguageLevel = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());
    const patterns = [
        [/langue maternelle|maternelle|native speaker|native/, 'Langue maternelle'],
        [/bilingual|bilingue/, 'Bilingue'],
        [/fluent|courant(?:e)?/, 'Courant'],
        [/professional working proficiency|working proficiency|niveau professionnel|professionnel(?:le)?/, 'Niveau professionnel'],
        [/intermediate|niveau intermediaire|intermediaire/, 'Niveau intermédiaire'],
        [/elementary level|elementary|bases solides/, 'Bases solides'],
        [/beginner|debutant/, 'Débutant'],
        [/basic english|basic knowledge|basic proficiency|basic|bases?|notions?/, 'Notions'],
    ];
    const found = patterns.find(([pattern]) => pattern.test(source));

    return found ? found[1] : '';
};

const normalizeCvLanguage = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        const [language = '', ...levelParts] = value.split(/\s*[:–-]\s*/);
        const normalizedLanguage = limitCvText(language, 48);
        return normalizedLanguage
            ? { language: normalizedLanguage, level: normalizeCvLanguageLevel(levelParts.join(' ')) }
            : null;
    }

    if (typeof value === 'object') {
        const language = limitCvText(value.language || value.name, 48);
        return language
            ? { language, level: normalizeCvLanguageLevel(value.level || value.niveau) }
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

const CV_OPERATION_TYPES = new Set(['update_experience_date', 'upsert_language', 'set_field', 'remove_section', 'reorder_experiences', 'remove_experience']);
const CV_OPERATION_FIELDS = new Set(['experience', 'languages', 'fullName', 'location', 'phone', 'email', 'permit', 'headline', 'summary', 'skills', 'education', 'activities', 'projects']);

const sanitizeCvOperation = (value) => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const type = limitCvText(value.type || value.action, 48);
    if (!CV_OPERATION_TYPES.has(type)) {
        return null;
    }

    const rawTarget = value.target && typeof value.target === 'object' ? value.target : {};
    const rawIndex = Number.isInteger(rawTarget.index) ? rawTarget.index : Number.isInteger(value.index) ? value.index : null;
    const field = CV_OPERATION_FIELDS.has(value.field) ? value.field : '';

    return {
        type,
        field,
        target: {
            index: rawIndex,
            label: limitCvText(rawTarget.label || rawTarget.name || value.targetLabel, 120),
            title: limitCvText(rawTarget.title || rawTarget.role, 120),
            organization: limitCvText(rawTarget.organization || rawTarget.company || rawTarget.meta, 120),
            currentValue: limitCvText(rawTarget.currentValue || rawTarget.current || value.currentValue, 160),
        },
        value: limitCvMultilineText(value.value || value.newValue || value.date || value.level, 900),
        reason: limitCvText(value.reason || value.summary, 180),
    };
};

const sanitizeCvOperations = (value) =>
    (Array.isArray(value) ? value : [])
        .map(sanitizeCvOperation)
        .filter(Boolean)
        .slice(0, 8);

const sanitizeCvBugReport = (value) => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const category = limitCvText(value.category || value.type, 80);
    const summary = limitCvText(value.summary || value.message, 220);
    const expectedAction = limitCvText(value.expectedAction || value.expected, 220);
    const target = limitCvText(value.target || value.element, 140);
    const details = limitCvText(value.details || value.context, 320);

    return category || summary || expectedAction || target || details
        ? { category, summary, expectedAction, target, details }
        : null;
};

const sanitizeCvLetter = (value) => {
    const letter = value && typeof value === 'object' ? value : {};

    return {
        subject: limitCvText(letter.subject, 130),
        body: limitCvMultilineText(letter.body, 1100),
    };
};

const sanitizeCvPeriodGap = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        const period = limitCvText(value, 48);
        return period ? { period, reason: 'Période non renseignée', questions: [], options: [] } : null;
    }

    if (typeof value !== 'object') {
        return null;
    }

    const period = limitCvText(value.period || value.dates, 48);
    const reason = limitCvText(value.reason || value.description, 130);

    return period || reason
        ? {
            period,
            reason,
            questions: toCvStringList(value.questions, 4, 150),
            options: toCvStringList(value.options, 7, 80),
        }
        : null;
};

const sanitizeCvPeriodGaps = (value) =>
    (Array.isArray(value) ? value : [])
        .map(sanitizeCvPeriodGap)
        .filter(Boolean)
        .slice(0, 4);

const sanitizeCvGeneratedExperience = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        const text = limitCvText(value, 460);
        return text
            ? {
                title: limitCvText(text.split(/[•|]/)[0], 90),
                period: '',
                organization: '',
                description: [text],
                skills: [],
                source: 'a valider',
            }
            : null;
    }

    if (typeof value !== 'object') {
        return null;
    }

    const title = limitCvText(value.title || value.role || value.name, 90);
    const period = limitCvText(value.period || value.dates, 48);
    const organization = limitCvText(value.organization || value.context || value.company, 90);
    const descriptionSource = Array.isArray(value.description)
        ? value.description
        : Array.isArray(value.missions)
            ? value.missions
            : Array.isArray(value.bullets)
                ? value.bullets
                : value.description
                    ? [value.description]
                    : [];
    const description = toCvStringList(descriptionSource, 8, 180);
    const skills = toCvStringList(value.skills || value.competences, 10, 80);
    const source = limitCvText(value.source || 'a valider', 40);

    return title || period || description.length
        ? { title, period, organization, description, skills, source }
        : null;
};

const sanitizeCvGeneratedExperiences = (value) =>
    (Array.isArray(value) ? value : [])
        .map(sanitizeCvGeneratedExperience)
        .filter(Boolean)
        .slice(0, 4);

const sanitizeCvEducationSuggestion = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        const title = limitCvText(value, 150);
        return title
            ? { title, period: '', organization: '', description: '', skills: [], source: 'a valider' }
            : null;
    }

    if (typeof value !== 'object') {
        return null;
    }

    const title = limitCvText(value.title || value.name || value.formation, 120);
    const period = limitCvText(value.period || value.year || value.dates, 48);
    const organization = limitCvText(value.organization || value.school || value.organism || value.provider, 90);
    const description = limitCvText(value.description || value.summary, 220);
    const skills = toCvStringList(value.skills || value.competences, 8, 80);
    const source = limitCvText(value.source || 'a valider', 40);

    return title || organization || description
        ? { title, period, organization, description, skills, source }
        : null;
};

const sanitizeCvEducationSuggestions = (...values) =>
    values
        .flatMap((value) => (Array.isArray(value) ? value : []))
        .map(sanitizeCvEducationSuggestion)
        .filter(Boolean)
        .filter((item, index, list) => {
            const signature = stripAccents(`${item.title} ${item.organization}`.toLowerCase());
            return list.findIndex((candidate) => stripAccents(`${candidate.title} ${candidate.organization}`.toLowerCase()) === signature) === index;
        })
        .slice(0, 6);

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
        periodGaps: sanitizeCvPeriodGaps(result && result.periodGaps),
        generatedExperiences: sanitizeCvGeneratedExperiences(result && result.generatedExperiences),
        educationSuggestions: sanitizeCvEducationSuggestions(result && result.educationSuggestions, result && result.certificationSuggestions),
        extracted: sanitizeCvExtraction(result && result.extracted),
        jobTarget: limitCvText(result && result.jobTarget, 90),
        keywords: toCvStringList(result && result.keywords, 8, 60),
        suggestedSkills: toCvStringList(result && result.suggestedSkills, 12, 80),
        suggestions: toCvStringList(result && result.suggestions, 6, 180),
        notice: limitCvText(result && result.notice, 260),
        quality: sanitizeCvQuality(result && result.quality),
        layout: sanitizeCvLayout(result && result.layout),
        operations: sanitizeCvOperations(result && result.operations),
        bugReport: sanitizeCvBugReport(result && result.bugReport),
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
    const assistantResult = enhanceCvGapDrafts(sanitizeCvAssistantResult(result, cv), { cv, instruction });
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
    const normalizedSource = stripAccents(source);

    return knownLanguages
        .filter((language) => new RegExp(`\\b${stripAccents(language)}\\b`, 'i').test(normalizedSource))
        .map((language) => {
            const languagePattern = new RegExp(`\\b${stripAccents(language)}\\b`, 'i');
            const line = source.split(/\r?\n/).find((item) => languagePattern.test(stripAccents(item))) || language;
            const match = languagePattern.exec(stripAccents(line));
            const levelSource = match ? line.slice(match.index + match[0].length, match.index + match[0].length + 90) : '';
            const detectedLevel = detectCvLanguageLevel(levelSource);
            const [, fallbackLevel = ''] = line.split(/\s*[:–]\s*/);
            return { language, level: detectedLevel || normalizeCvLanguageLevel(fallbackLevel) };
        });
};

const getCurrentCvYear = () => new Date().getFullYear();

const extractCvYearRanges = (experience = '') => {
    const currentYear = getCurrentCvYear();

    return normalize(experience)
        .split(/\r?\n/)
        .map((line) => {
            const years = [...line.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]));
            const hasOngoingMarker = /\b(aujourd'hui|aujourd’hui|present|présent|actuel|maintenant)\b/i.test(line);

            if (!years.length) {
                return null;
            }

            const start = Math.min(years[0], hasOngoingMarker ? years[0] : years[years.length - 1]);
            const end = hasOngoingMarker ? currentYear : Math.max(years[0], years[years.length - 1]);

            return {
                start,
                end,
                ongoing: hasOngoingMarker,
            };
        })
        .filter(Boolean)
        .filter((range) => range.start >= 1980 && range.end >= range.start && range.end <= currentYear + 1);
};

const getExplicitInstructionPeriods = (instruction = '') => {
    const currentYear = getCurrentCvYear();
    const periods = [];
    const pattern = /\b((?:19|20)\d{2})\s*[–-]\s*((?:19|20)\d{2}|aujourd'hui|aujourd’hui|present|présent|actuel|maintenant)\b/gi;
    let match;

    while ((match = pattern.exec(instruction))) {
        const start = Number(match[1]);
        const end = /\d{4}/.test(match[2]) ? Number(match[2]) : currentYear;

        if (start >= 1980 && end >= start && end <= currentYear + 1) {
            periods.push({ start, end, ongoing: end === currentYear && !/\d{4}/.test(match[2]) });
        }
    }

    return periods;
};

const formatCvYearPeriod = ({ start, end }) => (start === end ? String(start) : `${start} - ${end}`);

const detectCvPeriodGaps = ({ cv, instruction }) => {
    const currentYear = getCurrentCvYear();
    const ranges = extractCvYearRanges(cv.experience).sort((left, right) => left.start - right.start || left.end - right.end);
    const explicitPeriods = getExplicitInstructionPeriods(instruction);
    const gaps = [];
    const addGap = (range, reason) => {
        if (!range || range.start > range.end) {
            return;
        }

        const period = formatCvYearPeriod(range);
        if (gaps.some((gap) => gap.period === period)) {
            return;
        }

        gaps.push({
            period,
            reason,
            questions: [
                `Pendant ${period}, s'agissait-il d'un projet personnel, d'une formation, d'une recherche d'emploi, de bénévolat ou de missions ponctuelles ?`,
                'Quels outils, technologies ou compétences avez-vous réellement pratiqués pendant cette période ?',
                'Quel intitulé voulez-vous afficher dans le CV pour rester juste et professionnel ?',
            ],
            options: [
                'Projet personnel',
                'Entrepreneur / Créateur de projet',
                'Développement web et projets numériques',
                'Autoformation / Formation en autodidacte',
                'Formation professionnelle',
                "Recherche active d'emploi",
                'Bénévolat ou missions ponctuelles',
            ],
        });
    };

    explicitPeriods.forEach((range) => addGap(range, 'Période mentionnée à valoriser'));

    ranges.forEach((range, index) => {
        const next = ranges[index + 1];
        if (next && next.start - range.end > 1) {
            addGap({ start: range.end + 1, end: next.start - 1 }, 'Période non renseignée entre deux expériences');
        }
    });

    const hasOngoingExperience = ranges.some((range) => range.ongoing || range.end >= currentYear);
    const latestEnd = ranges.reduce((max, range) => Math.max(max, range.end), 0);
    if (!hasOngoingExperience && latestEnd && latestEnd < currentYear) {
        addGap({ start: latestEnd + 1, end: currentYear }, 'Période récente non renseignée');
    }

    return sanitizeCvPeriodGaps(gaps);
};

const getCvGapContext = (instruction = '', cv = {}) => {
    const source = stripAccents(normalizeText([
        instruction,
        cv.headline,
        cv.summary,
        cv.skills,
        cv.projects,
        cv.education,
    ].join(' ')).toLowerCase());

    if (/\b(web|site|plateforme|numerique|digital|ia|intelligence artificielle|ux|ui|developp|javascript|html|css)\b/.test(source)) {
        return 'web';
    }
    if (/\b(entrepreneur|entrepreneure|createur|creatrice|creation de projet|auto entrepreneur|auto-entrepreneur)\b/.test(source)) {
        return 'entrepreneur';
    }
    if (/\b(formation|autoformation|autodidacte|ecole|42|simplon|certificat|certification|atelier)\b/.test(source)) {
        return 'formation';
    }
    if (/\b(recherche active|recherche d emploi|candidature|emploi)\b/.test(source)) {
        return 'jobSearch';
    }
    if (/\b(benevolat|benevole|mission ponctuelle|missions ponctuelles)\b/.test(source)) {
        return 'volunteer';
    }

    return 'project';
};

const shouldDraftGapExperience = (instruction = '') =>
    /\b(trou|vide|periode|période|combler|valoriser|projet|autoformation|autodidacte|formation|web|numerique|numérique|digital|ia|entrepreneur|creatrice|créatrice|recherche active|benevolat|bénévolat|mission ponctuelle)\b/i.test(instruction);

const buildCvGapExperience = (gap, context) => {
    const commonSkills = ['Organisation', 'Autonomie', 'Gestion de projet', 'Résolution de problèmes'];
    const byContext = {
        web: {
            title: 'Créatrice de projets numériques - Autoformation et développement',
            organization: 'Projet personnel / Autoformation',
            description: [
                'Conception et développement de plateformes web.',
                'Gestion de projets digitaux.',
                "Utilisation d'outils d'intelligence artificielle pour le développement.",
                "Coordination de développements avec des assistants IA.",
                "Amélioration de l'expérience utilisateur (UX/UI).",
                'Tests fonctionnels et suivi des évolutions.',
                'Développement de compétences en gestion de projet, communication digitale et résolution de problèmes.',
            ],
            skills: ['Gestion de projet', 'Développement web', 'IA', 'Communication digitale', 'UX/UI', 'Tests fonctionnels', ...commonSkills],
        },
        entrepreneur: {
            title: 'Entrepreneure - Création et développement de projet',
            organization: 'Projet personnel',
            description: [
                "Structuration d'une offre et clarification des besoins utilisateurs.",
                'Gestion des priorités, suivi des actions et amélioration continue du projet.',
                'Création de supports digitaux et coordination des étapes de développement.',
            ],
            skills: ['Entrepreneuriat', 'Communication digitale', 'Gestion de projet', ...commonSkills],
        },
        formation: {
            title: 'Autoformation et développement de compétences numériques',
            organization: 'Formation en autodidacte',
            description: [
                'Apprentissage progressif par la pratique et les projets.',
                'Renforcement de la logique, de la méthode de travail et de la résolution de problèmes.',
                'Veille, exercices pratiques et consolidation des compétences techniques.',
            ],
            skills: ['Autoformation', 'Apprentissage continu', 'Méthode', ...commonSkills],
        },
        jobSearch: {
            title: "Recherche active d'emploi - Projet professionnel",
            organization: 'Projet professionnel',
            description: [
                'Clarification du projet professionnel et ciblage des candidatures.',
                'Mise à jour des supports de candidature et veille sur les opportunités.',
                'Préparation des entretiens et valorisation des compétences transférables.',
            ],
            skills: ['Recherche d’emploi', 'Communication', 'Organisation', ...commonSkills],
        },
        volunteer: {
            title: 'Bénévolat et missions ponctuelles',
            organization: 'Engagement personnel',
            description: [
                "Participation à des actions ponctuelles selon les besoins de l'organisation.",
                'Organisation, entraide et communication avec différents interlocuteurs.',
                'Développement du sens du service et de la fiabilité.',
            ],
            skills: ['Bénévolat', 'Sens du service', 'Communication', ...commonSkills],
        },
        project: {
            title: 'Développement de projet personnel - Autoformation',
            organization: 'Projet personnel',
            description: [
                'Développement de compétences par la pratique et la veille.',
                'Organisation des étapes du projet et suivi des améliorations.',
                'Renforcement de l’autonomie, de la méthode et de la résolution de problèmes.',
            ],
            skills: ['Projet personnel', 'Autoformation', ...commonSkills],
        },
    };
    const template = byContext[context] || byContext.project;

    return sanitizeCvGeneratedExperience({
        ...template,
        period: gap.period,
        source: 'a valider',
    });
};

const buildCvGapExperiences = ({ gaps, cv, instruction }) => {
    if (!gaps.length || !shouldDraftGapExperience(instruction)) {
        return [];
    }

    const context = getCvGapContext(instruction, cv);
    return sanitizeCvGeneratedExperiences(gaps.map((gap) => buildCvGapExperience(gap, context)));
};

const buildCvEducationSuggestions = ({ cv, instruction }) => {
    const source = stripAccents(normalizeText([instruction, cv.education].join(' ')).toLowerCase());
    const existingEducation = stripAccents(normalizeText(cv.education).toLowerCase());
    const suggestions = [];

    if (/\b(42|ecole 42|piscine)\b/.test(source) && !/\b(42|ecole 42|piscine)\b/.test(existingEducation)) {
        suggestions.push({
            title: 'École 42 - Piscine informatique',
            organization: 'École 42',
            description: 'Initiation intensive au développement, logique algorithmique, autonomie, résolution de problèmes et travail en pair-to-pair.',
            skills: ['Logique algorithmique', 'Autonomie', 'Résolution de problèmes', 'Pair-to-pair'],
            source: 'a valider',
        });
    }

    if (/\bsimplon\b/.test(source) && !/\bsimplon\b/.test(existingEducation)) {
        suggestions.push({
            title: 'Simplon - Formation numérique / développement web',
            organization: 'Simplon',
            description: 'Bases du développement web, culture numérique et apprentissage par projet.',
            skills: ['Développement web', 'Culture numérique', 'Apprentissage par projet'],
            source: 'a valider',
        });
    }

    if (/\b(formations? courtes?|certificats?|ateliers?|autres certifications?)\b/.test(source)) {
        suggestions.push({
            title: 'Formations courtes, certificats ou ateliers',
            organization: 'Organisme à préciser',
            description: 'Formation complémentaire à valoriser dans une rubrique séparée après validation du nom, de la date et du contenu.',
            skills: ['Apprentissage continu', 'Adaptabilité'],
            source: 'a valider',
        });
    }

    return sanitizeCvEducationSuggestions(suggestions);
};

const digitalProjectExperienceDetails = {
    title: 'Créatrice de projets numériques - Autoformation et développement',
    description: [
        'Conception et développement de plateformes web.',
        'Gestion de projets digitaux.',
        "Utilisation d'outils d'intelligence artificielle pour le développement.",
        'Coordination de développements avec des assistants IA.',
        "Amélioration de l'expérience utilisateur (UX/UI).",
        'Tests fonctionnels et suivi des évolutions.',
        'Développement de compétences en gestion de projet, communication digitale et résolution de problèmes.',
    ],
    skills: [
        'Gestion de projet',
        'Développement web',
        'IA',
        'Communication digitale',
        'UX/UI',
        'Tests fonctionnels',
        'Organisation',
        'Autonomie',
        'Résolution de problèmes',
    ],
};

const shouldUseDigitalProjectExperienceDetails = ({ instruction = '', experiences = [] } = {}) => {
    const source = stripAccents(normalizeText([
        instruction,
        ...experiences.map((experience) => `${experience.title || ''} ${experience.period || ''} ${experience.organization || ''}`),
    ].join(' ')).toLowerCase());

    return /\b(creatrice de projets numeriques|projets numeriques|creation de projets numeriques|autoformation|developpement web|assistant ia|intelligence artificielle|ux\/ui|2025\s*-\s*2026)\b/.test(source);
};

const filterCvPeriodGapsForReadyCv = ({ periodGaps = [], generatedExperiences = [], cv = {}, instruction = '' } = {}) => {
    if (!Array.isArray(periodGaps) || !periodGaps.length) {
        return [];
    }

    if (Array.isArray(generatedExperiences) && generatedExperiences.length) {
        return [];
    }

    const explicitPeriods = new Set(getExplicitInstructionPeriods(instruction).map(formatCvYearPeriod));
    if (explicitPeriods.size) {
        return periodGaps.filter((gap) => explicitPeriods.has(gap.period)).slice(0, 1);
    }

    const currentYear = getCurrentCvYear();
    const latestEnd = extractCvYearRanges(cv.experience).reduce((max, range) => Math.max(max, range.end), 0);
    const recentPeriod = latestEnd && latestEnd < currentYear
        ? formatCvYearPeriod({ start: latestEnd + 1, end: currentYear })
        : '';

    return recentPeriod
        ? periodGaps.filter((gap) => gap.period === recentPeriod).slice(0, 1)
        : [];
};

const getPreferredGeneratedExperiencePeriod = ({ cv = {}, instruction = '' } = {}) => {
    const explicitPeriods = getExplicitInstructionPeriods(instruction);
    if (explicitPeriods.length) {
        return formatCvYearPeriod(explicitPeriods[explicitPeriods.length - 1]);
    }

    const currentYear = getCurrentCvYear();
    const ranges = extractCvYearRanges(cv.experience);
    const hasOngoingExperience = ranges.some((range) => range.ongoing || range.end >= currentYear);
    const latestEnd = ranges.reduce((max, range) => Math.max(max, range.end), 0);

    if (!hasOngoingExperience && latestEnd && latestEnd < currentYear) {
        return formatCvYearPeriod({ start: latestEnd + 1, end: currentYear });
    }

    return '';
};

const getCvPeriodRangeFromText = (value = '') => getExplicitInstructionPeriods(value)[0] || null;

const rangesOverlap = (left, right) =>
    Boolean(left && right && left.start <= right.end && right.start <= left.end);

const shouldNormalizeGeneratedExperiencePeriod = ({ experience = {}, cv = {}, preferredPeriod = '' } = {}) => {
    if (!preferredPeriod) {
        return false;
    }

    const currentPeriod = normalizeText(experience.period || '');
    if (!currentPeriod || currentPeriod === preferredPeriod) {
        return Boolean(!currentPeriod);
    }

    const currentRange = getCvPeriodRangeFromText(currentPeriod);
    const preferredRange = getCvPeriodRangeFromText(preferredPeriod);
    if (!currentRange || !preferredRange) {
        return false;
    }

    const source = stripAccents(normalizeText([
        experience.title,
        experience.organization,
        experience.description,
        experience.skills,
    ].flat().join(' ')).toLowerCase());
    const looksLikeGapDraft = /\b(projets?|numeriques?|digital|web|autoformation|developpement|ia|intelligence artificielle|creation|creatrice|entrepreneur|formation|recherche active|benevolat)\b/.test(source);
    const overlapsRealExperience = extractCvYearRanges(cv.experience).some((range) => rangesOverlap(currentRange, range));

    return looksLikeGapDraft && overlapsRealExperience;
};

const normalizeGeneratedExperiencePeriods = (experiences = [], { cv = {}, instruction = '' } = {}) => {
    const preferredPeriod = getPreferredGeneratedExperiencePeriod({ cv, instruction });

    return experiences.map((experience) => {
        if (!shouldNormalizeGeneratedExperiencePeriod({ experience, cv, preferredPeriod })) {
            return experience;
        }

        return {
            ...experience,
            period: preferredPeriod,
        };
    });
};

const enhanceCvGapDrafts = (assistantResult, { cv = {}, instruction = '' } = {}) => {
    const result = assistantResult && typeof assistantResult === 'object' ? assistantResult : {};
    const generatedExperiences = normalizeGeneratedExperiencePeriods(
        Array.isArray(result.generatedExperiences) ? result.generatedExperiences : [],
        { cv, instruction }
    );
    const shouldEnhanceDigitalProject = shouldUseDigitalProjectExperienceDetails({ instruction, experiences: generatedExperiences });
    const enhancedExperiences = shouldEnhanceDigitalProject
        ? generatedExperiences.map((experience, index) => {
            const isMatchingExperience = index === 0 || /projets?\s+num[eé]riques?|autoformation|d[eé]veloppement/i.test(experience.title || '');
            if (!isMatchingExperience) {
                return experience;
            }

            return sanitizeCvGeneratedExperience({
                ...experience,
                title: experience.title || digitalProjectExperienceDetails.title,
                description: digitalProjectExperienceDetails.description,
                skills: toCvStringList([...(experience.skills || []), ...digitalProjectExperienceDetails.skills], 12, 80),
            });
        })
        : generatedExperiences;
    const canonicalEducationSuggestions = buildCvEducationSuggestions({ cv, instruction });
    const instructionSource = stripAccents(normalizeText(instruction).toLowerCase());
    const getEducationSignature = (education = {}) => stripAccents(`${education.title} ${education.organization}`.toLowerCase()).replace(/\s+/g, ' ').trim();
    const hasCanonical42 = canonicalEducationSuggestions.some((education) => /\b(?:ecole\s+42|42|piscine)\b/.test(stripAccents(`${education.title} ${education.organization}`.toLowerCase())));
    const hasCanonicalSimplon = canonicalEducationSuggestions.some((education) => /\bsimplon\b/.test(stripAccents(`${education.title} ${education.organization}`.toLowerCase())));
    const canonical42Signatures = new Set(
        canonicalEducationSuggestions
            .filter((education) => /\b(?:ecole\s+42|42|piscine)\b/.test(getEducationSignature(education)))
            .map(getEducationSignature)
    );
    const canonicalSimplonSignatures = new Set(
        canonicalEducationSuggestions
            .filter((education) => /\bsimplon\b/.test(getEducationSignature(education)))
            .map(getEducationSignature)
    );
    const allowGenericShortTraining = /\b(formations? courtes?|certificats?|ateliers?|autres certifications?)\b/.test(instructionSource);
    const educationSuggestions = sanitizeCvEducationSuggestions(result.educationSuggestions, canonicalEducationSuggestions)
        .filter((education) => {
            const source = stripAccents(`${education.title} ${education.organization} ${education.description}`.toLowerCase());
            const signature = getEducationSignature(education);

            if (hasCanonical42 && /\b(?:ecole\s+42|42|piscine|informatique)\b/.test(source) && !canonical42Signatures.has(signature)) {
                return false;
            }
            if (hasCanonicalSimplon && /\b(?:simplon|formation|developpement web|numerique)\b/.test(source) && !canonicalSimplonSignatures.has(signature) && !allowGenericShortTraining) {
                return false;
            }
            if (!allowGenericShortTraining && /\b(formations? courtes?|certificats?|certifications?|ateliers?)\b/.test(source)) {
                return false;
            }

            return true;
        });
    const suggestedSkills = toCvStringList([
        ...(result.suggestedSkills || []),
        ...(shouldEnhanceDigitalProject ? digitalProjectExperienceDetails.skills : []),
        ...educationSuggestions.flatMap((education) => education.skills || []),
    ], 12, 80);
    const requestedLanguages = getCvLanguagesFromText(instruction);
    const languagesByKey = new Map(
        [
            ...(result.languages || []),
            ...requestedLanguages,
        ]
            .map(normalizeCvLanguage)
            .filter(Boolean)
            .map((language) => [stripAccents(language.language).toLowerCase(), language])
    );

    return {
        ...result,
        generatedExperiences: sanitizeCvGeneratedExperiences(enhancedExperiences),
        educationSuggestions,
        suggestedSkills,
        languages: [...languagesByKey.values()],
        periodGaps: filterCvPeriodGapsForReadyCv({
            periodGaps: result.periodGaps,
            generatedExperiences: enhancedExperiences,
            cv,
            instruction,
        }),
    };
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
    const source = [cv.headline, cv.summary, cv.skills, cv.experience, cv.projects, cv.education, cv.languages, instruction, jobOffer].filter(Boolean).join(' ');
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

    const languages = getCvLanguagesFromText([cv.languages, instruction, cv.summary, cv.experience].filter(Boolean).join('\n'));
    if (!languages.length) {
        suggestions.push('Ajoutez vos langues et un niveau exact : par exemple Français : langue maternelle, Anglais : bases professionnelles.');
    } else if (languages.some((language) => !language.level)) {
        suggestions.push('Précisez le niveau des langues détectées avant l’export.');
    }

    const periodGaps = detectCvPeriodGaps({ cv, instruction });
    const generatedExperiences = buildCvGapExperiences({ gaps: periodGaps, cv, instruction });
    const educationSuggestions = buildCvEducationSuggestions({ cv, instruction });
    const generatedSkillSuggestions = generatedExperiences
        .flatMap((experience) => experience.skills || [])
        .filter((skill) => !skills.some((item) => stripAccents(item).toLowerCase() === stripAccents(skill).toLowerCase()));

    if (periodGaps.length) {
        suggestions.push('Validez la période vide avant insertion : intitulé, activité réelle, outils utilisés et compétences développées.');
    }
    if (educationSuggestions.length) {
        suggestions.push('Validez les formations ou certifications à ajouter dans la rubrique Formations & certifications.');
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

    return enhanceCvGapDrafts(sanitizeCvAssistantResult({
        headline: task === 'adapt' && role ? role : cv.headline,
        summary,
        skills,
        experienceOrder: getCvExperienceTitles(cv.experience),
        languages,
        periodGaps,
        generatedExperiences,
        educationSuggestions,
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
        suggestedSkills: [...suggestedSkills, ...generatedSkillSuggestions],
        suggestions,
        quality: {
            fixes: ['Compétences et sections analysées avant proposition.'],
            warnings: [
                languages.some((language) => !language.level) ? 'Un niveau de langue reste à préciser.' : '',
                periodGaps.length ? 'Une période vide doit être validée avant insertion dans le CV.' : '',
                educationSuggestions.length ? 'Une formation ou certification suggérée doit être confirmée avant ajout.' : '',
            ].filter(Boolean),
        },
        layout,
        letter: fallbackLetter,
        notice: role
            ? `Adaptation ${role} réalisée à partir des éléments présents dans le CV.`
            : 'Informations détectées et harmonisées à partir du CV.',
    }, cv), { cv, instruction });
};

const buildOpenAiCvPrompt = ({ task, cv, jobOffer, instruction, letter, interaction }) => [
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
    interaction && Object.values(interaction).some(Boolean) ? `Contexte technique de selection dans l'interface :\n${JSON.stringify(interaction, null, 2)}` : '',
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
    'Analyse les dates du parcours professionnel. Si une periode vide existe, renseigne periodGaps avec les questions utiles. Si la consigne donne assez d elements sur cette periode, propose une experience dans generatedExperiences et des competences dans suggestedSkills, toujours a valider.',
    'Regle stricte de date : une generatedExperience doit couvrir uniquement une periode non renseignee. Elle ne doit jamais chevaucher une experience deja presente dans cv.experience. Si cv.experience contient une mission en 2024 terminee en 2024 et que la periode recente va jusqu en 2026, la periode generee commence en 2025.',
    'Ordre d affichage attendu : experiences et formations datees de la plus recente a la plus ancienne. Les certifications sans date restent sans date et passent apres les entrees datees, sans date inventee.',
    'Pour les formations/certifications non presentes mais mentionnees par l utilisateur (Ecole 42, Piscine informatique, Simplon, formations courtes, certificats, ateliers), renseigne educationSuggestions au lieu de les melanger aux experiences.',
    'Si la consigne demande une correction ciblee, retourne une operation applicative dans operations. Ne remplace pas une correction par une proposition generique.',
    'Respecte strictement le schema du systeme. Les intitules dans experienceOrder doivent etre les intitules exacts du CV source.',
].filter(Boolean).join('\n\n');

const requestOpenAiCvAssistant = async ({ apiKey, model, task, cv, jobOffer, instruction, letter, interaction }) => {
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
                max_tokens: 1600,
            }),
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: KIRBY_CV_SYSTEM_PROMPT },
                { role: 'user', content: buildOpenAiCvPrompt({ task, cv, jobOffer, instruction, letter, interaction }) },
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
    const accountingContext = hasAccountingIntent(source);
    const kidsContext = !accountingContext && isKidsEducationBrief(brief);
    const bridalContext = !accountingContext && !kidsContext && isBridalCoutureBrief(brief);
    const luminaContext = !accountingContext && !kidsContext && hasLuminaCreativeIntent(brief);
    const styleHints = [
        kidsContext ? 'univers produit enfant futur doux' : '',
        bridalContext ? 'maison couture mariage premium, moderne et lumineuse' : '',
        luminaContext ? 'direction Lumina/Figma premium, futuriste, transparente et lisible' : '',
        /\bpremium|haut de gamme|luxe|elegant|élégant|moderne|waouh|wow\b/.test(source) ? 'premium moderne' : '',
        /\brassurant|confiance|professionnel|serieux|sérieux\b/.test(source) ? 'rassurant' : '',
        /\bdoux|beige|rose|bien etre|bien-être|soin|spa\b/.test(source) ? 'doux bien-être' : '',
        /\bapple|macos|figma|lumina|luma|glass|glassmorphism|verre|bleu nuit|etoile|étoile|cosmique|futuriste|ia|digital\b/.test(source) ? 'premium digital immersif' : '',
        /\bchaleureux|italien|restaurant|terroir|convivial\b/.test(source) ? 'chaleureux commercial' : '',
    ].filter(Boolean);
    const sectionHints = [
        accountingContext ? 'aperçu logiciel, factures, TVA, banque, documents, assistant IA, sécurité' : '',
        kidsContext ? 'jeux, histoires, comptines, espace parent, progression' : '',
        bridalContext ? 'collections, robes sur mesure, essayages privés, atelier, galerie, rendez-vous' : '',
        luminaContext ? 'hero surface, modules flottants, assistant IA, preuves métier, CTA lisible' : '',
        /\btarif|prix|offre|formule|abonnement\b/.test(source) ? 'tarifs/offres' : '',
        /\brdv|rendez|reservation|réservation|agenda\b/.test(source) ? 'prise de rendez-vous ou réservation' : '',
        /\bphoto|image|galerie|portfolio|realisation|réalisation\b/.test(source) ? 'galerie/preuves visuelles' : '',
        /\bavis|temoignage|témoignage|preuve|confiance\b/.test(source) ? 'avis/preuves de confiance' : '',
        /\bseo|google|local|ville|près|pres\b/.test(source) ? 'référencement local' : '',
        /\bcontact|whatsapp|telephone|téléphone|email|mail\b/.test(source) ? 'contact direct' : '',
    ].filter(Boolean);
    const targetHints = [
        kidsContext ? 'enfants, parents et encadrants éducatifs' : '',
        bridalContext ? 'futures mariées recherchant une robe personnalisée et un essayage rassurant' : '',
        /\bcliente|clientes|client[eè]le|clients|prospect|visiteur|utilisateur\b/.test(source) ? 'clients/prospects mentionnés dans le brief' : '',
        /\bindependant|indépendant|artisan|tpe|pme|freelance\b/.test(source) ? 'indépendants, TPE ou clientèle locale' : '',
        /\bfemme|femmes|mariage|beauté|beaute\b/.test(source) ? 'clientèle féminine ou beauté' : '',
    ].filter(Boolean);
    const moodHints = [
        kidsContext ? 'futur doux, ludique, immersif, surfaces translucides' : '',
        bridalContext ? 'ivoire froid, noir couture, perle lumineuse, rose quartz, argent doux, cyan verre' : '',
        luminaContext ? 'surfaces transparentes, profondeur 4D, lumières cyan/menthe/rose froid, animations discrètes' : '',
        accountingContext && /\bapple|macos|figma|lumina|luma|futur|future|futuriste|3d|immersif|immersive|glass|verre\b/.test(source) ? 'finance OS premium, verre dépoli, profondeur, panneaux flottants' : '',
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
            'Si le brief parle réellement d’enfant, application enfant, mini-jeux, comptines, école maternelle ou espace parent, produis une direction story-world applicative. Le mot histoire seul ne suffit pas.',
            'Si le brief cite Apple, macOS, Figma, Lumina, Luma, futuriste, 3D, glassmorphism ou immersif comme inspiration visuelle, applique seulement l’esthétique au secteur demandé : ne reprends jamais le contenu, les menus ou le scénario d’un autre secteur.',
        ].join('\n'),
    ];

    if (revision) {
        parts.push('Modification demandee par l utilisateur, a appliquer a toute la proposition :');
        parts.push(revision);
        parts.push('Regenere une proposition complete et coherente : structure, mise en page, images conseillees, couleurs, sections, interactions, CTA et SEO. Ne fais pas une correction locale. Retire tout bloc qui n est plus justifie par le brief ou la modification. Si le metier ou le type change, repars de zero sans conserver des blocs precedents.');
    }

    if (currentProposal) {
        parts.push('Etat precedent fourni uniquement comme contexte de continuite. Ne le recopie pas comme base. Utilise-le seulement pour comprendre ce que l utilisateur veut transformer, puis retourne une proposition neuve et complete :');
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

const callOpenAiCvAssistant = async ({ task, cv, jobOffer, instruction, letter, interaction }) => {
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
                    result: await requestOpenAiCvAssistant({ apiKey, model, task, cv, jobOffer, instruction, letter, interaction }),
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
        const sourceInteraction = payload.interaction && typeof payload.interaction === 'object' ? payload.interaction : {};
        const interaction = {
            activeSection: limitCvText(sourceInteraction.activeSection, 48),
            selectedText: limitCvText(sourceInteraction.selectedText, 220),
            activeExperienceIndex: Number.isInteger(sourceInteraction.activeExperienceIndex)
                ? sourceInteraction.activeExperienceIndex
                : null,
            activeExperience: limitCvText(sourceInteraction.activeExperience, 520),
            pendingQuestion: limitCvText(sourceInteraction.pendingQuestion, 220),
        };

        if (!Object.values(cv).some(Boolean) && !jobOffer && !instruction) {
            return json(response, 400, { error: 'cv_too_short' });
        }

        try {
            const openAiResult = await callOpenAiCvAssistant({ task, cv, jobOffer, instruction, letter, interaction });

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
    const rawCurrentProposal = payload.currentProposal && typeof payload.currentProposal === 'object'
        ? payload.currentProposal
        : null;
    const revisionRebuildContext = getFallbackRevisionRebuildContext(brief, revision);
    const effectiveBrief = revisionRebuildContext.shouldRebuild && revisionRebuildContext.rebuiltBrief
        ? revisionRebuildContext.rebuiltBrief
        : brief;
    const effectiveRevision = revisionRebuildContext.shouldRebuild ? '' : revision;
    const currentProposal = revisionRebuildContext.shouldRebuild ? null : rawCurrentProposal;

    if (effectiveBrief.length < 8) {
        return json(response, 400, { error: 'brief_too_short' });
    }

    try {
        const openAiProposal = await callOpenAi({ brief: effectiveBrief, revision: effectiveRevision, currentProposal });

        if (openAiProposal) {
            return json(response, 200, {
                ok: true,
                source: 'openai',
                model: openAiProposal.model,
                proposal: sanitizeProposal(openAiProposal.proposal, effectiveBrief),
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
            effectiveRevision ? applyFallbackRevision(currentProposal || buildFallbackProposal(effectiveBrief), effectiveRevision, effectiveBrief) : buildFallbackProposal(effectiveBrief),
            effectiveBrief,
        ),
    });
};
