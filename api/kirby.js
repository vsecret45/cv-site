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
const normalizeIntentText = (value = '') => stripAccents(normalizeText(value).toLowerCase());
const hasFoodServiceIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const explicitFoodPlace = /\b(restaurant|brasserie|bistrot|trattoria|pizzeria|cafe|café|bar a tapas|bar à tapas|cantine|food truck|traiteur)\b/.test(source);
    const foodOffer = /\b(menu du jour|carte des plats|carte restaurant|carte gastronomique|plats?|cuisine|chef|degustation|dégustation|reservation table|réservation table|reserver une table|réserver une table|salle de restaurant)\b/.test(source);

    return explicitFoodPlace || foodOffer;
};
const hasSpaceSimulationIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const simulation = /\b(simulation spatiale|simulateur spatial|simulateur de mission|missions? spatiales?|mission spatiale|centre de simulation|cabine de simulation|entrainement spatial|entraînement spatial)\b/.test(source);
    const publicTeam = /\b(grand public|cooperation en equipe|coopération en équipe|travail d equipe|travail d’équipe|equipage|équipage|briefing mission|debriefing mission|débriefing mission)\b/.test(source);

    return simulation && /\b(spatial|spatiale|espace|mission|orbite|lune|mars)\b/.test(source) && (publicTeam || /centre de simulation/.test(source));
};
const hasDigitalOrganizationIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const digitalContext = /\b(numerique|numérique|digital|photos?|fichiers?|emails?|e-mails?|mails?|cloud|drive|sauvegardes?|documents?|icloud|google drive)\b/.test(source);
    const organizationGoal = /\b(desencombrement|désencombrement|desencombrer|désencombrer|environnement numerique clair|environnement numérique clair|ordre|simplicite|simplicité|organiser|organisation|ranger|tri|trier|classement|clarifier|retrouver)\b/.test(source);

    return digitalContext && organizationGoal;
};

const splitBriefSentences = (value = '') => String(value || '')
    .replace(/\r/g, '\n')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const hasBriefExclusionCue = (value = '') => /\b(ne doit pas|ne devra pas|n est pas|n'est pas|n’est pas|n est ni|n'est ni|n’est ni|ne ressemble pas|ne doit ressembler|ni a|ni à|ni un|ni une|ni des|eviter|éviter|interdit|interdiction|exclure|exclu|sans|pas un|pas une)\b/.test(normalizeIntentText(value));

const getBriefExclusionSentences = (brief = '') =>
    splitBriefSentences(brief).filter(hasBriefExclusionCue);

const getPositiveBriefText = (brief = '') => {
    const sentences = splitBriefSentences(brief).filter((sentence) => !hasBriefExclusionCue(sentence));

    return sentences.length ? sentences.join('\n') : String(brief || '');
};

const getBriefTitleLine = (brief = '') => {
    const line = String(brief || '')
        .replace(/\r/g, '\n')
        .split('\n')
        .map((item) => item.trim())
        .find(Boolean) || '';

    return line
        .replace(/^\s*brief\s*\d+\s*[—-]\s*/i, '')
        .replace(/^\s*\d+\s*[.)]\s*/, '')
        .trim();
};

const getBriefExclusionPatterns = (brief = '') => {
    const exclusionText = normalizeIntentText(getBriefExclusionSentences(brief).join(' '));
    const patterns = [];
    const add = (regexes = []) => regexes.forEach((regex) => patterns.push(regex));

    if (/juridique|cabinet juridique|avocat|droit|juriste|notaire|honoraires/.test(exclusionText)) {
        add([
            /\bcabinet d avocat\b/,
            /\bcabinet d'avocat\b/,
            /\bcabinet d’avocat\b/,
            /\bavocats?\b/,
            /\bdomaines? de droit\b/,
            /\bexpertises? juridiques?\b/,
            /\bjuridique\b/,
            /\bjuriste\b/,
            /\bnotaire\b/,
            /\bhonoraires?\b/,
            /\bcontentieux\b/,
        ]);
    }

    if (/police|policier|policiere|detective|enquete|empreinte|loupe|ruban de police/.test(exclusionText)) {
        add([
            /\bpolice\b/,
            /\bpolicier(e)?\b/,
            /\bdetective\b/,
            /\benquete\b/,
            /\bloupe\b/,
            /\bempreintes? digitales?\b/,
            /\bruban de police\b/,
        ]);
    }

    if (/securite|surveillance|gardiennage/.test(exclusionText)) {
        add([
            /\bsociete de securite\b/,
            /\bsociété de sécurité\b/,
            /\bsecurite\b/,
            /\bsécurité\b/,
            /\bsurveillance\b/,
            /\bgardiennage\b/,
            /\bagents? de securite\b/,
            /\bagents? de sécurité\b/,
        ]);
    }

    if (/informatique|reparateur|réparateur|ordinateur|depannage|dépannage|maintenance/.test(exclusionText)) {
        add([
            /\bentreprise informatique\b/,
            /\breparateurs? d ordinateurs?\b/,
            /\bréparateurs? d’ordinateurs?\b/,
            /\breparation informatique\b/,
            /\bréparation informatique\b/,
            /\bdepannage informatique\b/,
            /\bdépannage informatique\b/,
            /\bmaintenance informatique\b/,
            /\bsupport informatique\b/,
        ]);
    }

    if (/parc d attractions?|parc d’attractions?|escape game|escape/.test(exclusionText)) {
        add([
            /\bparcs? d attractions?\b/,
            /\bparcs? d’attractions?\b/,
            /\battractions?\b/,
            /\bescape games?\b/,
            /\bjeu d evasion\b/,
            /\bjeu d’évasion\b/,
        ]);
    }

    return patterns;
};

const extractBriefActivity = (brief = '', positiveText = '') => {
    const raw = String(positiveText || brief || '').trim();
    const normalizedRaw = normalizeIntentText(raw);
    if (/objets? sentimentaux|retrouver des objets perdus|objets perdus.{0,80}valeur affective|bijoux de famille.{0,80}lettres.{0,80}photographies/.test(normalizedRaw)) {
        return 'service de récupération d’objets sentimentaux';
    }

    const titleLine = getBriefTitleLine(brief) || getBriefTitleLine(raw) || splitBriefSentences(raw)[0] || '';
    const titleActivity = titleLine.match(/(?:brief\s*\d+\s*[—-]\s*)?(.{8,90})/i)?.[1] || '';
    const siteFor = raw.match(/(?:creer|créer|concevoir|faire|realiser|réaliser)\s+(?:un\s+)?site\s+pour\s+([^.\n]{8,190})/i)?.[1] || '';
    const serviceFor = raw.match(/(?:service|entreprise|agence|maison|centre|plateforme)\s+(?:qui|dédié(?:e)? à|destiné(?:e)? à)\s+([^.\n]{8,190})/i)?.[0] || '';
    const titleLooksLikeActivity = titleActivity && !/^(creer|créer|concevoir|faire|realiser|réaliser|le site|site)\b/i.test(titleActivity);
    const activity = titleLooksLikeActivity ? titleActivity : siteFor || serviceFor || titleActivity;

    return normalizeText(activity
        .replace(/^\s*(une?|des?|la|le|les|l')\s+/i, '')
        .replace(/\s+/g, ' ')
        .trim())
        .slice(0, 180) || 'activité décrite dans le brief';
};

const extractRequestedSections = (brief = '', positiveText = '') => {
    const source = normalizeIntentText(`${brief}\n${positiveText}`);
    const sections = [];
    const add = (title, text) => {
        if (!sections.some((section) => normalizeIntentText(section.title) === normalizeIntentText(title))) {
            sections.push({ title, text });
        }
    };
    const formatExtractedTitle = (value = '') => {
        const clean = normalizeIntentText(value)
            .replace(/\s+/g, ' ')
            .trim();
        const aliases = [
            [/demarches?.*obseques/, 'Démarches avant / pendant / après'],
            [/ceremonies?.*(civiles?|religieuses?)/, 'Cérémonies civiles ou religieuses'],
            [/contrats?.*prevoyance/, 'Contrats de prévoyance'],
            [/accompagnement administratif/, 'Accompagnement administratif'],
            [/services?.*familles?.*eloignees?/, 'Services pour familles éloignées'],
            [/espace hommage prive|hommage prive/, 'Espace hommage privé'],
            [/documents? telechargeables?/, 'Documents téléchargeables'],
            [/visite virtuelle/, 'Visite virtuelle'],
            [/agenda/, 'Agenda'],
            [/actualites?/, 'Actualités'],
        ];
        const alias = aliases.find(([pattern]) => pattern.test(clean));
        if (alias) {
            return alias[1];
        }

        return titleCaseName(clean)
            .replace(/\bDe\b/g, 'de')
            .replace(/\bDu\b/g, 'du')
            .replace(/\bDes\b/g, 'des')
            .replace(/\bEt\b/g, 'et')
            .replace(/\bOu\b/g, 'ou');
    };
    const addInstructionSections = () => {
        splitBriefSentences(positiveText || brief)
            .filter((sentence) => {
                const normalized = normalizeIntentText(sentence).replace(/[’']/g, ' ');
                if (/\b(transmettre|inspirer|rassurer)\b/.test(normalized)) {
                    return false;
                }
                if (/\b(phrase d accroche|fonctionnement|types? de recherches?|recherches? possibles?|confidentialite|formulaire)\b/.test(normalized)) {
                    return false;
                }
                return /\b(doit|devra|il faut|presenter|présenter|expliquer|afficher|integrer|intégrer|prevoir|prévoir|proposer)\b/.test(normalized)
                    && !/\b(design|rendu|univers visuel|couleurs?|palette|style|ambiance froide|noir dominant|marbre)\b/.test(normalized);
            })
            .forEach((sentence) => {
                const prepared = normalizeIntentText(sentence)
                    .replace(/[’']/g, ' ')
                    .replace(/avant,\s*pendant et apres/g, 'avant pendant apres')
                    .replace(/\bet\s+les\s+/g, ', les ')
                    .replace(/\bet\s+l\s+/g, ', l ')
                    .replace(/\bet\s+un\s+/g, ', un ')
                    .replace(/\bet\s+une\s+/g, ', une ')
                    .replace(/\bainsi que\b/g, ', ');
                const scoped = /espace hommage prive/.test(prepared)
                    ? prepared.replace(/(espace hommage prive).*/, '$1')
                    : prepared;

                scoped.split(/[,;]+/)
                    .map((part) => part
                        .replace(/^(?:le site|la page d accueil|page d accueil|il faut aussi|il faut|doit|devra|aussi)\s+/i, '')
                        .replace(/^(?:expliquer|presenter|afficher|integrer|prevoir|proposer|permettre)\s+/i, '')
                        .replace(/^(?:les|la|le|l|un|une|des|de|du|d)\s+/i, '')
                        .replace(/\s+(?:ou|avec|afin que|afin d)\s+.*$/i, '')
                        .replace(/[.?!]+$/g, '')
                        .trim())
                    .filter((part) => part.length > 5 && !/^(site|page|design|rendu|univers visuel)$/.test(part))
                    .slice(0, 8)
                    .forEach((part) => {
                        const title = formatExtractedTitle(part);
                        add(title, `Présenter ${title.toLowerCase()} comme demandé dans le brief.`);
                    });
            });
    };

    addInstructionSections();

    if (/phrase d accroche|accroche/.test(source)) add('Accroche sobre', 'Formuler une promesse claire, émotionnelle si le brief le demande, sans emphase inutile.');
    if (/fonctionnement|trois etapes|3 etapes|etapes/.test(source)) add('Fonctionnement en trois étapes', 'Expliquer le parcours demandé avec une progression simple et rassurante.');
    if (/types? de recherches?|recherches? possibles?|types? de demandes?|cas d usage/.test(source)) add('Types de demandes', 'Présenter les catégories de besoins explicitement citées dans le brief.');
    if (/confidentialite|discretion|donnees/.test(source)) add('Confidentialité', 'Rassurer sur la discrétion, les informations transmises et le respect du contexte.');
    if (/formulaire|demande d accompagnement|demande de contact|contact/.test(source)) add('Formulaire de demande', 'Qualifier la demande sans transformer la page en questionnaire froid.');
    if (/tarifs?|prix|formules?/.test(source)) add('Tarifs ou formules', 'Rendre les conditions de départ compréhensibles.');
    if (/temoignages?|avis|preuves?/.test(source)) add('Preuves de confiance', 'Apporter des preuves adaptées au ton demandé.');
    if (hasDigitalOrganizationIntent(source)) {
        add('Diagnostic de l’encombrement numérique', 'Identifier les photos, fichiers, emails, cloud, sauvegardes et documents à clarifier.');
        add('Méthode de tri simple', 'Expliquer comment retrouver un environnement numérique ordonné sans jargon informatique.');
        add('Sauvegardes et documents', 'Rassurer sur la conservation des éléments importants et la simplicité du suivi.');
    }
    if (hasSpaceSimulationIntent(source)) {
        add('Simulations de missions spatiales', 'Présenter l’expérience réaliste de mission spatiale demandée dans le brief.');
        add('Coopération en équipe', 'Montrer comment les visiteurs participent ensemble à la mission.');
        add('Parcours grand public', 'Rendre l’expérience compréhensible et accessible sans la dénaturer.');
    }

    return sections.length ? sections : [
        { title: 'Comprendre le besoin', text: 'Présenter l’activité exacte avec les mots du brief.' },
        { title: 'Méthode claire', text: 'Montrer comment l’accompagnement se déroule.' },
        { title: 'Demande qualifiée', text: 'Guider vers l’action attendue sans ajouter de métier absent.' },
    ];
};

const getBriefProfile = (brief = '') => {
    const positiveText = getPositiveBriefText(brief);
    const positiveSource = normalizeIntentText(positiveText);
    const fullSource = normalizeIntentText(brief);
    const exclusions = getBriefExclusionSentences(brief);
    const activity = extractBriefActivity(brief, positiveText);
    const sections = extractRequestedSections(brief, positiveText);
    const audience = /particuliers?/.test(positiveSource)
        ? 'Particuliers concernés par une demande sensible.'
        : /grand public/.test(positiveSource)
            ? 'Grand public souhaitant vivre une expérience encadrée et compréhensible.'
        : /familles?/.test(positiveSource)
            ? 'Familles et proches concernés par le service.'
            : /entreprises?|dirigeants?|collectivites/.test(positiveSource)
                ? 'Organisations et décideurs mentionnés dans le brief.'
                : 'Visiteurs qualifiés mentionnés dans la demande.';
    const tone = [
        /delicatesse|delicat/.test(fullSource) ? 'délicat' : '',
        /confiance|rassur/.test(fullSource) ? 'rassurant' : '',
        /discretion|confidentiel|confidentialite/.test(fullSource) ? 'discret' : '',
        /sobre|digne|apaisant|calme/.test(fullSource) ? 'sobre' : '',
        /ordre|ordonnee|ordonnée|simplicite|simplicité|clair|claire/.test(fullSource) ? 'simple et ordonné' : '',
        /moderne|premium|contemporain/.test(fullSource) ? 'moderne' : '',
    ].filter(Boolean).join(', ') || 'clair, professionnel et adapté au brief';
    const conversion = /demande d accompagnement|accompagnement/.test(positiveSource)
        ? 'Demander un accompagnement'
        : /formulaire/.test(positiveSource)
            ? 'Envoyer une demande'
            : /reservation|rendez/.test(positiveSource)
                ? 'Prendre rendez-vous'
                : 'Contacter l’entreprise';

    return {
        activity,
        positiveText,
        positiveSource,
        audience,
        promise: `Aider le visiteur à comprendre ${activity} et passer à l’action avec confiance.`,
        tone,
        sections,
        exclusions,
        exclusionPatterns: getBriefExclusionPatterns(brief),
        conversion,
        hasExplicitExclusions: exclusions.length > 0,
        hasSpecificUnknownActivity: positiveSource.length > 110,
    };
};

const getBriefProfileSummary = (profile = {}) => ({
    activity: profile.activity,
    audience: profile.audience,
    promise: profile.promise,
    tone: profile.tone,
    sections: Array.isArray(profile.sections) ? profile.sections.map((section) => section.title).slice(0, 10) : [],
    exclusions: Array.isArray(profile.exclusions) ? profile.exclusions.slice(0, 12) : [],
    conversion: profile.conversion,
});

const getNarrativeStageForSection = (section = {}, index = 0) => {
    const title = normalizeIntentText(section.title || section.name || '');
    const text = normalizeIntentText(section.text || section.goal || section.description || '');
    const source = `${title} ${text}`;

    if (/accroche|hero|bienvenue|presentation|présentation|decouvrir|découvrir/.test(source)) return 'discovery';
    if (/fonctionnement|methode|méthode|etapes|étapes|parcours|types?|besoin|probleme|problème/.test(source)) return 'understanding';
    if (/realisations|réalisations|preuve|preuves|avis|temoignages|témoignages|certification|garantie|equipements|équipements|protocoles|equipe|équipe/.test(source)) return 'proof';
    if (/confidentialite|confidentialité|securite|sécurité|rassur|confiance|discretion|discrétion|administratif|accompagnement/.test(source)) return 'trust';
    if (/formulaire|contact|reservation|réservation|inscription|devis|estimation|partenariat|postuler|candidature|demande/.test(source)) return 'conversion';

    return ['discovery', 'understanding', 'proof', 'trust', 'conversion'][Math.min(index, 4)];
};

const getNarrativeStageRole = (stage) => ({
    discovery: 'Faire reconnaître immédiatement le besoin, le contexte et l’activité réelle.',
    understanding: 'Expliquer le service, la méthode ou les choix possibles avec les éléments du brief.',
    proof: 'Rendre la promesse crédible avec les preuves, réalisations, équipements ou garanties demandés.',
    trust: 'Lever les freins avec confidentialité, discrétion, clarté, sérieux ou accompagnement humain.',
    conversion: 'Rendre la prochaine étape simple, rassurante et cohérente avec la demande.',
}[stage] || 'Clarifier une étape du parcours.');

const getNarrativeExpectedAction = (stage, profile = {}) => ({
    discovery: 'Continuer la découverte',
    understanding: 'Explorer la méthode',
    proof: 'Faire confiance',
    trust: 'Se projeter sereinement',
    conversion: profile.conversion || 'Prendre contact',
}[stage] || 'Continuer');

const getPrimaryConversionLabel = (brief = '', profile = {}) => {
    const source = profile.positiveSource || normalizeIntentText(profile.positiveText || brief);

    if (/cartes? anciennes?|restauration de cartes|atlas/.test(source)) return 'Faire examiner ma carte';
    if (hasPrivateSchoolIntent(source)) return 'Demander une visite';
    if (hasRestaurantManagementSaasIntent(source)) return 'Demander une démonstration';
    if (hasEnergyRenovationIntent(source)) return 'Lancer le prédiagnostic';
    if (hasSeniorMobilityIntent(source)) return 'Demander un trajet régulier';
    if (hasCrisisManagementIntent(source)) return 'Activer un échange confidentiel';
    if (hasFuneralHomeIntent(source)) return 'Demander un accompagnement discret';
    if (hasSportsRehabIntent(source)) return 'Choisir mon parcours de reprise';

    return profile.conversion || 'Prendre contact';
};

const buildNarrativePlan = (brief = '', profile = getBriefProfile(brief)) => {
    const sections = Array.isArray(profile.sections) && profile.sections.length
        ? profile.sections
        : extractRequestedSections(brief, profile.positiveText || brief);
    const positiveSource = profile.positiveSource || normalizeIntentText(profile.positiveText || brief);
    const visualComposition = /galerie|photo|image|avant apres|avant\/apres|realisations/.test(positiveSource)
        ? 'Parcours image-led : hero photographique, preuves visuelles, galerie puis demande qualifiée.'
        : /logiciel|application|saas|plateforme|outil/.test(positiveSource)
            ? 'Parcours produit : promesse, problèmes métier, aperçu d’usage, simplicité, preuve et démonstration.'
            : /delicat|discret|confidentiel|digne|apaisant|deuil|souvenir|affective/.test(positiveSource)
                ? 'Parcours éditorial sensible : émotion sobre, méthode, confidentialité, preuves de tact puis demande privée.'
                : /ecole|scolaire|maternelle|college|projet pedagogique/.test(positiveSource)
                    ? 'Parcours institutionnel vivant : lieu, pédagogie, niveaux, vie scolaire, preuves parents et inscription.'
                    : 'Parcours service professionnel : découverte, compréhension, preuve, confiance, conversion.';
    const sectionRoles = sections.slice(0, 8).map((section, index) => {
        const stage = getNarrativeStageForSection(section, index);
        const sectionTitle = normalizeText(section.title || section.name || `Section ${index + 1}`);
        const sectionText = normalizeText(section.text || section.goal || section.description || '');

        return {
            section: sectionTitle,
            stage,
            goal: getNarrativeStageRole(stage),
            message: sectionText || sectionTitle,
            proofNeeded: stage === 'proof',
            expectedAction: getNarrativeExpectedAction(stage, profile),
            imageRole: stage === 'discovery'
                ? 'Identifier immédiatement le contexte réel du brief.'
                : stage === 'understanding'
                    ? 'Rendre une étape, un usage ou un choix compréhensible.'
                    : stage === 'proof'
                        ? 'Montrer une preuve concrète demandée ou déductible strictement du brief.'
                        : stage === 'trust'
                            ? 'Rassurer sans ajouter de promesse ou de service absent.'
                            : 'Accompagner l’action finale attendue.',
        };
    });
    const journeyStages = ['discovery', 'understanding', 'proof', 'trust', 'conversion']
        .map((stage) => {
            const linkedSection = sectionRoles.find((section) => section.stage === stage);

            return {
                stage,
                goal: linkedSection?.goal || getNarrativeStageRole(stage),
                message: linkedSection?.message || (stage === 'conversion'
                    ? `Prochaine étape : ${profile.conversion}.`
                    : `Expliquer ${profile.activity} sans ajouter d’univers absent du brief.`),
                proofNeeded: stage === 'proof',
                expectedAction: getNarrativeExpectedAction(stage, profile),
            };
        });

    return {
        centralStory: `Le site montre comment ${profile.activity} répond au besoin décrit dans le brief, sans emprunter un métier voisin.`,
        visitorStartingPoint: `Le visiteur arrive avec un besoin lié à ${profile.activity} et doit comprendre rapidement si le service correspond à sa situation.`,
        desiredOutcome: `Le visiteur comprend le service, les preuves utiles et la prochaine étape pour ${profile.conversion}.`,
        commercialPromise: profile.promise,
        targetAudience: [profile.audience].filter(Boolean),
        tone: normalizeText(profile.tone).split(',').map((item) => normalizeText(item)).filter(Boolean),
        journey: journeyStages,
        sectionRoles,
        imageStrategy: 'Une image n’est autorisée que si elle sert une étape précise du parcours narratif. Elle clarifie, prouve ou rassure ; elle ne décore pas.',
        visualComposition,
        mustInclude: sections.map((section) => normalizeText(section.title || section.name)).filter(Boolean).slice(0, 10),
        mustAvoid: Array.isArray(profile.exclusions) ? profile.exclusions.slice(0, 12) : [],
        primaryConversion: {
            action: profile.conversion,
            label: getPrimaryConversionLabel(brief, profile),
        },
    };
};

const addUniqueVisualKeywords = (items, values = []) => {
    values.forEach((value) => {
        const keyword = normalizeText(value);
        const key = normalizeIntentText(keyword);

        if (keyword && key.length > 2 && !items.some((item) => normalizeIntentText(item) === key)) {
            items.push(keyword);
        }
    });
};

const getBriefVisualKeywords = (brief = '', profile = getBriefProfile(brief)) => {
    const source = profile.positiveSource || normalizeIntentText(profile.positiveText || brief);
    const keywords = [];
    addUniqueVisualKeywords(keywords, [profile.activity]);

    if (/cartes? anciennes?|atlas|cartographie|restauration de cartes|papier ancien|parchemin/.test(source)) {
        addUniqueVisualKeywords(keywords, [
            'carte ancienne restaurée',
            'atlas ancien ouvert',
            'mains de restaurateur sur papier ancien',
            'textures de parchemin et cuir',
            'avant après restauration de carte',
            'atelier de conservation papier',
        ]);
    }

    if (hasPrivateSchoolIntent(source)) {
        addUniqueVisualKeywords(keywords, [
            'façade école privée',
            'élèves en classe',
            'laboratoire scientifique scolaire',
            'bibliothèque scolaire',
            'terrain de sport école',
            'événement scolaire parents',
        ]);
    }

    if (/ferme urbaine|ferme verticale|hydropon|serre|culture verticale|consommation minimale d eau/.test(source)) {
        addUniqueVisualKeywords(keywords, [
            'ferme verticale hydroponique',
            'légumes en culture intérieure',
            'tours de culture en bâtiment',
            'capteurs irrigation économie eau',
            'récolte urbaine en serre',
            'système de culture multi niveaux',
        ]);
    }

    if (hasSpaceSimulationIntent(source)) {
        addUniqueVisualKeywords(keywords, [
            'cockpit de simulation spatiale',
            'équipe en mission spatiale simulée',
            'briefing équipage mission',
            'module de contrôle spatial',
            'combinaison entraînement spatial',
            'simulateur de mission réaliste',
        ]);
    }

    if (/objets? perdus?|objets? sentimentaux|valeur affective|bijoux de famille|souvenirs? d enfance|demenagement/.test(source)) {
        addUniqueVisualKeywords(keywords, [
            'objet personnel sur table claire',
            'lettres anciennes et photo de famille',
            'bijou de famille dans écrin',
            'cartons de déménagement ouverts',
            'souvenirs d’enfance conservés',
            'carnet de recherche discret',
        ]);
    }

    if (hasDigitalOrganizationIntent(source)) {
        addUniqueVisualKeywords(keywords, [
            'bureau clair avec fichiers numériques organisés',
            'galerie photos triée sur ordinateur portable',
            'boîte email rangée et libellés simples',
            'cloud sauvegardes documents ordonnés',
            'interface de classement personnel minimaliste',
            'accompagnement humain au tri numérique',
        ]);
    }

    if (/maison funeraire|obseques|deuil|hommage prive|ceremonie/.test(source)) {
        addUniqueVisualKeywords(keywords, [
            'salon hommage lumineux',
            'famille accompagnée avec discrétion',
            'cérémonie civile sobre',
            'bouquet clair et lumière douce',
            'espace hommage privé souvenirs',
        ]);
    }

    if (/reeducation sportive|sportifs?|blessure|objectif de reprise|protocoles|bilans/.test(source)) {
        addUniqueVisualKeywords(keywords, [
            'bilan rééducation sportive',
            'kinésithérapeute avec sportif',
            'plateau technique de rééducation',
            'test de reprise terrain',
            'préparation physique encadrée',
        ]);
    }

    if (/renovation energetique|isolation|chauffage|ventilation|audit|dpe|rge/.test(source)) {
        addUniqueVisualKeywords(keywords, [
            'audit énergétique logement',
            'isolation intérieure chantier propre',
            'pompe à chaleur habitation',
            'ventilation maison rénovation',
            'avant après rénovation énergétique',
        ]);
    }

    if (hasFoodServiceIntent(source)) {
        addUniqueVisualKeywords(keywords, [
            'salle de restaurant chaleureuse',
            'plat signature en gros plan',
            'chef en cuisine',
            'table dressée',
            'réservation restaurant',
        ]);
    }

    (Array.isArray(profile.sections) ? profile.sections : []).slice(0, 6).forEach((section) => {
        addUniqueVisualKeywords(keywords, [section.title]);
    });

    addUniqueVisualKeywords(keywords, ['détail métier réel', 'preuve visuelle', 'lieu ou geste principal']);
    return keywords.slice(0, 14);
};

const buildVisualPlan = (brief = '', profile = getBriefProfile(brief), narrativePlan = buildNarrativePlan(brief, profile)) => {
    const keywords = getBriefVisualKeywords(brief, profile);
    const slots = {};
    const sectionSlots = [];
    const gallerySlots = [];
    const pick = (index, count = 3) => keywords.slice(index, index + count).concat(keywords.slice(0, Math.max(0, count - keywords.slice(index, index + count).length))).filter(Boolean).slice(0, count);
    const makeSlot = ({ narrativeStage, purpose, subject, composition, priority = 'supporting', keywords: slotKeywords }) => {
        const cleanKeywords = [];
        addUniqueVisualKeywords(cleanKeywords, slotKeywords || [subject]);

        return {
            narrativeStage,
            purpose,
            subject: normalizeText(subject) || cleanKeywords[0] || profile.activity,
            composition,
            priority,
            keywords: cleanKeywords.slice(0, 5),
            query: cleanKeywords.slice(0, 4).join(', '),
        };
    };

    slots.hero = makeSlot({
        narrativeStage: 'discovery',
        purpose: 'Identifier immédiatement le savoir-faire, le lieu, l’objet ou la situation réelle du brief.',
        subject: pick(0, 1)[0],
        composition: 'Image principale avec espace libre pour le titre et le CTA.',
        priority: 'essential',
        keywords: pick(0, 4),
    });

    (Array.isArray(narrativePlan.sectionRoles) ? narrativePlan.sectionRoles : []).slice(0, 3).forEach((sectionRole, index) => {
        sectionSlots.push(makeSlot({
            narrativeStage: sectionRole.stage,
            purpose: sectionRole.imageRole,
            subject: sectionRole.section || pick(index + 1, 1)[0],
            composition: index === 0 ? 'Image éditoriale large liée à la section.' : 'Image de détail ou scène courte liée à la section.',
            priority: index === 0 ? 'important' : 'supporting',
            keywords: [sectionRole.section, ...pick(index + 1, 3)],
        }));
    });

    ['proof', 'proof', 'trust', 'understanding', 'proof', 'trust'].forEach((stage, index) => {
        gallerySlots.push(makeSlot({
            narrativeStage: stage,
            purpose: stage === 'proof'
                ? 'Rendre la promesse crédible avec un élément visuel directement lié au brief.'
                : stage === 'trust'
                    ? 'Rassurer par un détail humain, matériel ou contextuel présent dans le brief.'
                    : 'Clarifier le fonctionnement ou le contexte du service.',
            subject: pick(index + 2, 1)[0],
            composition: index === 0 ? 'Tuile large de preuve visuelle.' : 'Tuile galerie courte, recadrable.',
            priority: index < 3 ? 'important' : 'optional',
            keywords: pick(index + 2, 3),
        }));
    });

    slots.sections = sectionSlots;
    slots.gallery = gallerySlots;

    slots.conversion = makeSlot({
        narrativeStage: 'conversion',
        purpose: `Préparer l’action finale : ${profile.conversion}.`,
        subject: pick(4, 1)[0] || profile.activity,
        composition: 'Image calme près du contact, du lieu ou de la prochaine étape.',
        priority: 'supporting',
        keywords: [profile.conversion, ...pick(4, 3)],
    });

    return slots;
};

const UNREQUESTED_UNIVERSE_PATTERNS = [
    /\bmusee\b/,
    /\bmuseums?\b/,
    /\barcheologie\b/,
    /\barcheologique\b/,
    /\barchaeolog(?:y|ical)\b/,
    /\bartefacts?\b/,
    /\bartifacts?\b/,
    /\bruines?\b/,
    /\bruins?\b/,
    /\bcartels?\b/,
    /\bcivilisations? disparues?\b/,
    /\bmondes? perdus?\b/,
    /\btemples?\b/,
    /\bexposition\b/,
    /\bexhibitions?\b/,
    /\bexpedition\b/,
    /\bexpeditions?\b/,
    /\bexplorateurs?\b/,
    /\bportail\b/,
    /\bportals?\b/,
    /\bonirique\b/,
    /\boniric\b/,
    /\bscience du vivant\b/,
    /\becosystemes?\b/,
    /\bécosystèmes?\b/,
    /\bbiodiversite\b/,
    /\bbiodiversité\b/,
    /\bmodeles? climat\b/,
    /\bmodèles? climat\b/,
    /\bcapteurs? terrain\b/,
    /\breforestation\b/,
    /\bcarbone\b/,
    /\bhôtel\b/,
    /\bhotel\b/,
    /\bhôtellerie\b/,
    /\bhotellerie\b/,
    /\bspa\b/,
    /\brestaurant\b/,
    /\bsejour orbital\b/,
    /\bséjour orbital\b/,
    /\btourisme spatial\b/,
    /\breservation orbitale\b/,
    /\bréservation orbitale\b/,
    /\bvue sur la terre\b/,
    /\bparcs? d attractions?\b/,
    /\bparcs? d’attractions?\b/,
    /\bescape games?\b/,
];

const getUnrequestedUniversePatterns = (brief = '') => {
    const positiveSource = normalizeIntentText(getPositiveBriefText(brief));
    return UNREQUESTED_UNIVERSE_PATTERNS.filter((pattern) => !pattern.test(positiveSource));
};

const getNarrativePlanVisibleText = (plan = {}) => {
    const journey = Array.isArray(plan.journey) ? plan.journey : [];
    const roles = Array.isArray(plan.sectionRoles) ? plan.sectionRoles : [];

    return [
        plan.centralStory,
        plan.visitorStartingPoint,
        plan.desiredOutcome,
        plan.commercialPromise,
        Array.isArray(plan.targetAudience) ? plan.targetAudience.join(' ') : '',
        Array.isArray(plan.tone) ? plan.tone.join(' ') : '',
        Array.isArray(plan.mustInclude) ? plan.mustInclude.join(' ') : '',
        plan.imageStrategy,
        plan.visualComposition,
        plan.primaryConversion && plan.primaryConversion.action,
        plan.primaryConversion && plan.primaryConversion.label,
        journey.map((item) => [
            item.stage,
            item.goal,
            item.message,
            item.expectedAction,
        ].filter(Boolean).join(' ')).join(' '),
        roles.map((item) => [
            item.stage,
            item.section,
            item.role,
            item.imageRole,
            item.expectedAction,
        ].filter(Boolean).join(' ')).join(' '),
    ].filter(Boolean).join(' ');
};

const getVisualPlanVisibleText = (plan = {}) => {
    const slots = [
        plan.hero,
        ...(Array.isArray(plan.sections) ? plan.sections : []),
        ...(Array.isArray(plan.gallery) ? plan.gallery : []),
        plan.conversion,
    ].filter(Boolean);

    return slots.map((slot) => [
        slot.narrativeStage,
        slot.purpose,
        slot.subject,
        slot.composition,
        slot.priority,
        Array.isArray(slot.keywords) ? slot.keywords.join(' ') : '',
        slot.query,
    ].filter(Boolean).join(' ')).join(' ');
};

const getProposalVisibleText = (proposal = {}) => {
    const list = (value, max = 10) => (Array.isArray(value) ? value.slice(0, max) : []);
    const itemText = (item = {}) => typeof item === 'string'
        ? item
        : [
            item.name,
            item.title,
            item.label,
            item.goal,
            item.text,
            item.description,
            item.reason,
        ].filter(Boolean).join(' ');

    return normalizeIntentText([
        proposal.projectType,
        proposal.siteName,
        proposal.slogan,
        proposal.summary,
        proposal.valueProposition,
        proposal.positioning && proposal.positioning.audience,
        proposal.positioning && proposal.positioning.promise,
        proposal.positioning && proposal.positioning.differentiator,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.styleGuide && proposal.styleGuide.layout,
        proposal.visualConcept && proposal.visualConcept.heroComposition,
        proposal.visualConcept && proposal.visualConcept.layoutSignature,
        proposal.visualConcept && proposal.visualConcept.signatureMoment,
        proposal.visualConcept && proposal.visualConcept.wowFactor,
        getVisualPlanVisibleText(proposal.visualPlan),
        list(proposal.pages, 10).map(itemText).join(' '),
        list(proposal.homeSections, 10).map(itemText).join(' '),
        list(proposal.services, 12).map(itemText).join(' '),
        list(proposal.recommendedServices, 12).map(itemText).join(' '),
        list(proposal.ctas, 6).join(' '),
    ].filter(Boolean).join(' '));
};

const proposalContradictsBriefProfile = (proposal = {}, profile = {}) =>
    (Array.isArray(profile.exclusionPatterns) ? profile.exclusionPatterns : []).some((regex) => regex.test(getProposalVisibleText(proposal)));

const proposalInventsUnrequestedUniverse = (proposal = {}, brief = '') => {
    const visibleText = getProposalVisibleText(proposal);
    return getUnrequestedUniversePatterns(brief).some((pattern) => pattern.test(visibleText));
};

const INTERNAL_VISIBLE_TERMS = [
    /\bcanvas\b/i,
    /\blumina\b/i,
    /\bbrief-driven\b/i,
    /\bdirection\s+kirby\b/i,
    /\bdiagnostic\s+ia\b/i,
    /\bsuivi\s+intelligent\b/i,
    /\bassistant\s+ia\b/i,
    /\bia\s+active\b/i,
    /\bconcept\s+vivant\b/i,
];

const GENERIC_AUTHOR_TERMS = [
    /\bcomprendre\s+le\s+besoin\b/i,
    /\bdemande\s+qualifiée\b/i,
    /\bdemande\s+qualifiee\b/i,
    /\bdiagnostic\s*&?\s*simulation\b/i,
    /\bsimulation\s+visuelle\b/i,
];

const hasVisibleTermAbsentFromBrief = (proposal = {}, brief = '', patterns = []) => {
    const visibleText = getProposalVisibleText(proposal);
    const briefText = normalizeIntentText(brief);

    return patterns.some((pattern) => pattern.test(visibleText) && !pattern.test(briefText));
};

const PIPELINE_REQUIRED_NARRATIVE_STAGES = ['discovery', 'understanding', 'proof', 'conversion'];
const PIPELINE_VISUAL_PLACEHOLDER_PATTERN = /\b(rectangle gris|rectangle gray|placeholder|image generique|image générique|gris neutre|grey block|gray block|a ajuster|à ajuster|lorem|dummy)\b/i;

const getPipelineSlotText = (slot = {}) => normalizeText([
    slot.narrativeStage,
    slot.purpose,
    slot.subject,
    slot.composition,
    slot.priority,
    Array.isArray(slot.keywords) ? slot.keywords.join(' ') : '',
    slot.query,
].filter(Boolean).join(' '));

const hasVisualSlotImageDirective = (slot = {}) =>
    normalizeText(slot.query) || (Array.isArray(slot.keywords) && slot.keywords.some((keyword) => normalizeText(keyword)));

const validatePipelineVisualSlot = (slot, label, issues) => {
    if (!slot || typeof slot !== 'object') {
        issues.push(`${label} absent dans visualPlan.`);
        return;
    }

    ['narrativeStage', 'purpose', 'subject', 'composition', 'priority'].forEach((field) => {
        if (!normalizeText(slot[field])) {
            issues.push(`${label}.${field} manquant.`);
        }
    });

    if (!hasVisualSlotImageDirective(slot)) {
        issues.push(`${label} ne contient aucune directive d'image exploitable.`);
    }

    if (PIPELINE_VISUAL_PLACEHOLDER_PATTERN.test(getPipelineSlotText(slot))) {
        issues.push(`${label} contient encore un placeholder ou un rectangle gris.`);
    }
};

const getKirbyPipelineQualityIssues = (proposal = {}, brief = '', context = {}) => {
    const issues = [];
    const profile = getBriefProfile(brief);
    const narrativePlan = proposal && proposal.narrativePlan;
    const visualPlan = proposal && proposal.visualPlan;

    ['siteName', 'slogan', 'valueProposition'].forEach((field) => {
        if (!normalizeText(proposal && proposal[field])) {
            issues.push(`${field} manquant.`);
        }
    });

    if (!Array.isArray(proposal.pages) || proposal.pages.length < 2) {
        issues.push('pages insuffisantes.');
    }

    if (!Array.isArray(proposal.homeSections) || proposal.homeSections.length < 2) {
        issues.push('homeSections insuffisantes.');
    }

    if (!Array.isArray(proposal.services) || proposal.services.length < 1) {
        issues.push('services insuffisants.');
    }

    if (!Array.isArray(proposal.ctas) || !proposal.ctas.some((cta) => normalizeText(cta))) {
        issues.push('ctas vide.');
    }

    if (context.source === 'openai') {
        const analysis = proposal.projectAnalysis;
        const identity = proposal.brandIdentity;
        const palette = identity && identity.palette;
        const blueprint = proposal.experienceBlueprint;
        const artifact = blueprint && blueprint.primaryArtifact;

        if (!analysis || !normalizeText(analysis.activity) || !normalizeText(analysis.target)) {
            issues.push('projectAnalysis incomplet.');
        }

        if (!identity || !normalizeText(identity.concept) || !normalizeText(identity.artDirection)) {
            issues.push('brandIdentity incomplet.');
        } else {
            const paletteValues = ['canvas', 'surface', 'ink', 'muted', 'accent', 'accentAlt']
                .map((key) => palette && normalizeText(palette[key]))
                .filter((value) => /^#[0-9A-F]{6}$/i.test(value));
            if (paletteValues.length < 6 || new Set(paletteValues.map((value) => value.toUpperCase())).size < 4) {
                issues.push('brandIdentity.palette doit contenir six couleurs valides et contrastees.');
            }
            if (!KIRBY_IDENTITY_COMPOSITIONS.has(normalizeSiteLayoutVariant(identity.composition))) {
                issues.push('brandIdentity.composition invalide.');
            }
        }

        if (!blueprint || !normalizeText(blueprint.openingMove) || !artifact || !KIRBY_IDENTITY_ARTIFACTS.has(normalizeSiteLayoutVariant(artifact.type))) {
            issues.push('experienceBlueprint incomplet.');
        } else if (!Array.isArray(artifact.items) || artifact.items.length < 2) {
            issues.push('experienceBlueprint.primaryArtifact doit montrer au moins deux elements utiles.');
        }
    }

    if (!narrativePlan || typeof narrativePlan !== 'object') {
        issues.push('narrativePlan absent.');
    } else {
        ['centralStory', 'visitorStartingPoint', 'desiredOutcome', 'commercialPromise'].forEach((field) => {
            if (!normalizeText(narrativePlan[field])) {
                issues.push(`narrativePlan.${field} manquant.`);
            }
        });

        if (!Array.isArray(narrativePlan.targetAudience) || !narrativePlan.targetAudience.some((item) => normalizeText(item))) {
            issues.push('narrativePlan.targetAudience vide.');
        }

        if (!Array.isArray(narrativePlan.tone) || !narrativePlan.tone.some((item) => normalizeText(item))) {
            issues.push('narrativePlan.tone vide.');
        }

        const stages = Array.isArray(narrativePlan.journey)
            ? narrativePlan.journey.map((item) => normalizeIntentText(item && item.stage)).filter(Boolean)
            : [];
        PIPELINE_REQUIRED_NARRATIVE_STAGES.forEach((stage) => {
            if (!stages.includes(stage)) {
                issues.push(`narrativePlan.journey ne contient pas l'étape ${stage}.`);
            }
        });

        if (!narrativePlan.primaryConversion || typeof narrativePlan.primaryConversion !== 'object') {
            issues.push('narrativePlan.primaryConversion absent.');
        } else {
            if (!normalizeText(narrativePlan.primaryConversion.action)) {
                issues.push('narrativePlan.primaryConversion.action manquant.');
            }
            if (!normalizeText(narrativePlan.primaryConversion.label)) {
                issues.push('narrativePlan.primaryConversion.label manquant.');
            }
        }
    }

    if (!visualPlan || typeof visualPlan !== 'object') {
        issues.push('visualPlan absent.');
    } else {
        validatePipelineVisualSlot(visualPlan.hero, 'visualPlan.hero', issues);
        if (visualPlan.hero && normalizeIntentText(visualPlan.hero.narrativeStage) !== 'discovery') {
            issues.push('visualPlan.hero doit servir l’étape discovery.');
        }

        const sectionSlots = Array.isArray(visualPlan.sections) ? visualPlan.sections : [];
        if (!sectionSlots.length) {
            issues.push('visualPlan.sections vide.');
        }
        sectionSlots.slice(0, 3).forEach((slot, index) => validatePipelineVisualSlot(slot, `visualPlan.sections[${index}]`, issues));

        const gallerySlots = Array.isArray(visualPlan.gallery) ? visualPlan.gallery : [];
        if (!gallerySlots.length) {
            issues.push('visualPlan.gallery vide.');
        }
        gallerySlots.slice(0, 3).forEach((slot, index) => validatePipelineVisualSlot(slot, `visualPlan.gallery[${index}]`, issues));

        validatePipelineVisualSlot(visualPlan.conversion, 'visualPlan.conversion', issues);
    }

    if ((context.source === 'fallback' || proposal.mode === 'fallback') && normalizeIntentText(proposal.sectorKey) !== 'brief-driven') {
        issues.push('Fallback ancien détecté : sectorKey différent de brief-driven.');
    }

    if (proposalContradictsBriefProfile(proposal, profile)) {
        issues.push('La proposition contient un vocabulaire explicitement exclu par le brief.');
    }

    if (proposalInventsUnrequestedUniverse(proposal, brief)) {
        issues.push('La proposition ajoute un univers ou un service adjacent absent du brief.');
    }

    if (hasVisibleTermAbsentFromBrief(proposal, brief, INTERNAL_VISIBLE_TERMS)) {
        issues.push('La proposition expose du vocabulaire technique interne absent du brief.');
    }

    if (hasVisibleTermAbsentFromBrief(proposal, brief, GENERIC_AUTHOR_TERMS)) {
        issues.push('La proposition contient des textes génériques injectés par le moteur.');
    }

    return issues;
};

const hasPrivateSchoolIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const schoolPlace = /\b(ecole privee|ecole independante|etablissement prive|etablissement scolaire|groupe scolaire|institution scolaire|college prive|maternelle|primaire|elementaire|college)\b/.test(source);
    const schoolLevels = /\b(maternelle|primaire|elementaire|college|collegien|collegiens|sixième|sixieme|cinquieme|quatrieme|troisieme)\b/.test(source);
    const schoolSiteNeeds = /\b(projet pedagogique|pedagogique|niveaux|equipe|enseignants|postuler|candidature enseignant|familles deja inscrites|futurs parents|parents d eleves|inscription|inscriptions|restauration|cantine|horaires|agenda|actualites|documents telechargeables|visite virtuelle|vie scolaire|modalites d inscription)\b/.test(source);
    const appProduct = /\b(application|app|mini jeu|mini-jeu|jeux educatifs?|comptine|comptines|jeu educatif)\b/.test(source);

    return ((schoolPlace && (schoolLevels || schoolSiteNeeds)) || (/\b(ecole|etablissement|college)\b/.test(source) && schoolSiteNeeds)) && !appProduct;
};
const hasFuneralHomeIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const funeralPlace = /\b(maison funeraire|pompes funebres|pompe funebre|service funeraire|services funeraires|agence funeraire|funerarium|chambre funeraire|crematorium|obseques|deuil|defunt|defunte|inhumation|cremation|ceremonie civile|ceremonie religieuse)\b/.test(source);
    const funeralNeeds = /\b(demarches?|avant pendant apres|avant les obseques|pendant les obseques|apres les obseques|ceremonies?|contrats? de prevoyance|prevoyance|accompagnement administratif|familles? eloignees?|proches eloignes|espace hommage|hommage prive|registre de condoleances|condoleances|messages?|photos?|souvenirs?|avis de deces|faire-part)\b/.test(source);
    const dignitySignal = /\b(accompagnement humain|discret|digne|apaisant|familles?|proches?)\b/.test(source);

    return (funeralPlace && (funeralNeeds || dignitySignal)) || (/\b(funeraire|funebre|obseques|deuil)\b/.test(source) && funeralNeeds);
};
const hasSeniorMobilityIntent = (value = '') => {
    if (hasFuneralHomeIntent(value)) {
        return false;
    }

    const source = normalizeIntentText(value);
    const mobilityAudience = /\b(personnes agees|personne agee|seniors?|senior|a mobilite reduite|mobilite reduite|pmr|beneficiaire|beneficiaires|aidants?|familles?)\b/.test(source);
    const transportService = /\b(transport accompagne|transport adapte|transport pmr|service de transport|mobilite|trajet|trajets|deplacement|deplacements|chauffeur accompagnateur|accompagnement humain|reservation|trajet regulier|trajets reguliers|zones couvertes)\b/.test(source);
    const institutionalAudience = /\b(etablissement de sante|etablissements de sante|collectivite|collectivites|ehpad|residence senior|residences seniors|partenariat|partenariats)\b/.test(source);

    return (transportService && (mobilityAudience || institutionalAudience)) || (/\bservice de transport\b/.test(source) && /\baccompagnement\b/.test(source) && (mobilityAudience || institutionalAudience));
};
const hasCrisisManagementIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const crisisAgency = /\b(agence de gestion de crise|gestion de crise|communication de crise|crise mediatique|crise reputatio|crise reputationnelle|crise juridique|crise sociale|crise cyber|cybercrise|crisis management)\b/.test(source);
    const crisisScenarios = /\b(crise|crises|bad buzz|controverse|mise en cause|rappel produit|fuite de donnees|attaque cyber|rancongiciel|reputation|reputationnelle|mediatique|media|reseaux sociaux|sociale|juridique|procedure sensible)\b/.test(source);
    const crisisOffer = /\b(methodologie|cellule de crise|interventions? d urgence|urgence|formulaire confidentiel|confidentiel|dirigeants?|directions? juridiques?|equipes? de communication|porte parole|elements de langage|formation de preparation|formations? de preparation|preparation a la crise|war room|audit de crise|scenario de crise|scenarios de crise)\b/.test(source);
    const renovationContext = /\b(renovation energetique|dpe|rge|isolation|chauffage|ventilation|aides financieres|travaux energetiques)\b/.test(source);

    return (crisisAgency && (crisisScenarios || crisisOffer)) || (crisisScenarios && crisisOffer && !renovationContext);
};
const hasEnergyRenovationIntent = (value = '') => {
    if (hasCrisisManagementIntent(value)) {
        return false;
    }

    const source = normalizeIntentText(value);
    const energyWork = /\b(renovation energetique|renovation thermique|renovation globale|performance energetique|audit energetique|audit thermique|travaux energetiques|isolation|chauffage|ventilation|pompe a chaleur|pac|dpe|rge|passoire thermique|economies d energie)\b/.test(source);
    const visitorFlow = /\b(particuliers?|coproprietes?|logement|maison|appartement|budget|problemes?|prediagnostic|pre diagnostic|estimation|dossier complet|aides financieres|maprimerenov|cee|certifications?|garanties?|realisations?|avant apres)\b/.test(source);
    const realEstateSale = /\b(agence immobiliere|annonce immobiliere|mandat|acheter|vendre|location|bien immobilier|biens immobiliers)\b/.test(source);

    return energyWork && visitorFlow && !realEstateSale;
};
const hasRestaurantManagementSaasIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const product = /\b(logiciel|application|app|saas|plateforme|outil|service destine aux restaurateurs|service pour restaurateurs|produit)\b/.test(source);
    const audience = /\b(restaurateurs?|restaurants?|restauration|groupes? possedant plusieurs restaurants|multi restaurants?|multi-restaurant|multi etablissement|multi-etablissement)\b/.test(source);
    const operations = /\b(reservations?|stocks?|fournisseurs?|couts? des recettes?|cout recette|couts recettes|marges?|planning d equipe|plannings d equipe|planning equipe|plannings equipe|equipes?|formules?|demonstration|demo|comparer les offres|comparatif|simplicite d utilisation)\b/.test(source);

    return product && audience && operations;
};
const hasChildFashionIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const clothing = /\b(vetement|vetements|habit|habits|mode|pret a porter|collection|collections|body|bodies|pyjama|robe enfant|robes enfant|pull|tshirt|t-shirt|pantalon|manteau|chaussure|chaussures|bebe|naissance|taille|tailles|guide des tailles|boutique enfant|marque enfant)\b/.test(source);
    const child = /\b(enfant|enfants|kid|kids|bebe|nourrisson|garcon|garcons|fille|filles|maternite|2 a 8 ans)\b/.test(source);

    return clothing && child;
};
const hasAutomotiveConciergeIntent = (value = '') => {
    if (hasSeniorMobilityIntent(value)) {
        return false;
    }

    const source = normalizeIntentText(value);
    const carService = /\b(conciergerie automobile|conciergerie auto|service automobile|vehicule|voiture|auto|automobile|entretien auto|nettoyage auto|controle technique|convoyage|prise en charge vehicule|suivi du vehicule|forfait auto|forfaits auto|car detailing|detailing|lavage auto|preparation controle)\b/.test(source);
    const concierge = /\b(conciergerie|haut de gamme|premium|prise en charge vehicule|convoyage|suivi du vehicule|forfait auto|forfaits auto|entretien auto|nettoyage auto|controle technique|detailing|lavage auto)\b/.test(source);

    return carService && concierge;
};
const hasSportsRehabIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const rehabPlace = /\b(centre de reeducation sportive|reeducation sportive|readaptation sportive|rehabilitation sportive|centre de rehabilitation sportive|clinique du sport|sante du sport|medecine du sport|centre sport sante)\b/.test(source);
    const practitionerTeam = /\b(kinesitherapeutes?|kines?|medecins? du sport|osteopathes?|preparateurs? physiques?|nutritionnistes?)\b/.test(source);
    const rehabFlow = /\b(blessures?|entorse|rupture|tendinite|ligament|genou|epaule|cheville|dos|reprise sportive|objectif de reprise|retour au sport|retour terrain|sportifs? amateurs?|sportifs? professionnels?|protocoles?|bilans?|prevention|suivi a distance|equipements?|plateau technique)\b/.test(source);
    const fitnessContext = /\b(salle de sport|fitness|abonnements?|cours collectifs|espace membre|coach sportif seul|musculation libre)\b/.test(source);

    return (rehabPlace && (practitionerTeam || rehabFlow)) || (practitionerTeam && rehabFlow && !fitnessContext);
};
const hasMedicalCenterIntent = (value = '') => {
    if (hasSportsRehabIntent(value)) {
        return false;
    }

    const source = normalizeIntentText(value);
    const place = /\b(centre medical|centre de sante|maison de sante|pole sante|pôle sante|cabinet pluridisciplinaire|centre pluridisciplinaire|medical pluridisciplinaire|médical pluridisciplinaire)\b/.test(source);
    const specialties = /\b(medecins generalistes|medecin generaliste|generalistes|generaliste|pediatre|pediatres|sage femme|sage-femme|sages femmes|sages-femmes|psychologue|psychologues|kine|kiné|kinesitherapeute|kinésithérapeute|kinesitherapeutes|kinésithérapeutes|praticien|praticiens|specialite|specialites|spécialité|spécialités)\b/.test(source);
    const patientFlow = /\b(patient|patients|rendez vous|rendez-vous|rdv|disponibilite|disponibilité|langue parlee|langue parlée|langues parlees|langues parlées|urgence|demande urgente|prevention sante|prévention santé|rejoindre le centre|professionnels souhaitant rejoindre|filtrer|filtre|filtres)\b/.test(source);

    return (place && (specialties || patientFlow)) || (specialties && patientFlow && /\b(sante|santé|medical|médical|soins?)\b/.test(source));
};
const isKidsEducationBrief = (value = '') => {
    const source = normalizeIntentText(value);

    if (hasChildFashionIntent(source) || hasPrivateSchoolIntent(source)) {
        return false;
    }

    const productIntent = /\b(application enfant|app enfant|application educative|app educative|comptine|comptines|mini jeu|mini-jeu|jeux educatifs?|jeu educatif|histoires interactives|histoire interactive|profil enfant|progression parent|luna|leo)\b/.test(source);
    const childContext = /\b(enfant|enfants|kid|kids|maternelle|creche|jeu|jeux|comptine|comptines)\b/.test(source);
    const appContext = /\b(application|app|mini jeu|mini-jeu|jeu educatif|jeux educatifs|comptine|comptines|histoire interactive|histoires interactives|parcours applicatif|profil parent|suivi parent|espace parent)\b/.test(source);

    return productIntent || (childContext && appContext);
};
const hasLuminaCreativeIntent = (value = '') => /\b(figma make|make de figma|make figma|canvas|canvas pro|apple|macos|figma|lumina|luma|futur|future|futuriste|3d|4d|immersif|immersive|motion|anime|animé|animation|animations|waouh|wow|glass|glassmorphism|verre depoli|verre dépoli|transparent|transparence|translucide|surface|surfaces|holographique|artistique)\b/.test(stripAccents(normalizeText(value).toLowerCase()));
const hasSurfaceDesignIntent = (value = '') => /\b(figma make|make de figma|make figma|canvas pro|apple|macos|figma|lumina|luma|glass|glassmorphism|verre depoli|verre dépoli|transparent|transparence|translucide|surface|surfaces|4d|holographique)\b/.test(stripAccents(normalizeText(value).toLowerCase()));
const isBridalCoutureBrief = (value = '') => /\b(robe|robes|robe de mariee|robe de mariage|mariee|mariée|mariage|couture|haute couture|atelier couture|createur de robe|créateur de robe|creatrice de robe|créatrice de robe|collection mariee|collection mariée|bridal|wedding dress|essayage|essayages|voile|voiles|dentelle|soie|broderie|tulle|satin)\b/.test(stripAccents(normalizeText(value).toLowerCase()));
const hasBoxingIntent = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());

    return /\b(boxe|boxing|club de box|box pour femme|box femmes|box feminin|boxe femme|boxe femmes|boxe feminine|boxe feminin|kickboxing|kick boxing|muay thai|muay-thai|self defense|self-defense|auto defense|autodefense|sport de combat|sports de combat|combat feminin|uppercut|ring|gants de boxe|sac de frappe)\b/.test(source);
};
const hasFutureBankIntent = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());
    return /\b(banque|bank|credits|crédits|coffres|coffre|financier|finance)\b/.test(source)
        && /\b(lune|lunaire|mars|colonies|colonie|interplanetaire|interplanétaire|orbital|spatial|spatiale|cosmos)\b/.test(source);
};
const hasAccountingIntent = (value = '') => {
    if (hasAutomotiveConciergeIntent(value) || hasRestaurantManagementSaasIntent(value)) {
        return false;
    }

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
- Pour chaque demande, construis d'abord une fiche interne : activite exacte, public, promesse, ton, sections attendues, exclusions explicites et conversion attendue. La page finale doit etre validee contre cette fiche.
- Produis ensuite un narrativePlan obligatoire avant le rendu : histoire centrale, point de depart visiteur, resultat attendu, promesse commerciale, public, ton, progression discovery/understanding/proof/trust/conversion, role de chaque etape, inclusions, exclusions et conversion principale.
- Produis ensuite un visualPlan obligatoire lie au narrativePlan : hero, sections, galerie/preuves et conversion. Chaque visuel doit avoir narrativeStage, purpose, subject, composition et priority. Une image n'est autorisee que si elle sert une etape precise du narrativePlan. Aucun visuel ne doit etre choisi uniquement parce qu'un mot-cle isole correspond.
- narrativePlan et visualPlan organisent et mettent en scene le brief ; ils ne doivent ajouter aucun service, resultat, public, savoir-faire, lieu ou univers absent de la demande. Les deductions doivent rester strictement necessaires a la comprehension.
- Les mots situes dans une exclusion explicite ("ne doit pas", "ni", "sans", "eviter", "interdiction", "pas un/pas une") ne doivent jamais declencher un metier, une maquette ou un vocabulaire. Ils servent uniquement a bloquer la sortie.
- Si une sortie contient un metier, une identite commerciale, des sections ou un vocabulaire absents du brief ou explicitement exclus, recommence la proposition avant de repondre.
- Distingue strictement : 1) ce qui est explicitement demande, 2) ce qui est deduit directement et prudemment, 3) ce qui n'a aucun droit d'apparaitre. N'ajoute jamais un univers narratif voisin parce qu'un mot semble proche.
- Exemples interdits sans mention explicite du brief : musee, archeologie, artefacts, ruines, cartels, civilisations disparues, exposition, expedition, portail onirique. Le mot "objet", "souvenir", "photo" ou "lettre" ne suffit jamais a declencher ces univers.
- Desambigüise les mots ambigus par le contexte complet. "Carte ancienne" n'est pas "carte de restaurant" ; "environnement numerique" n'est pas ecologie, science du vivant ou climat ; "restauration" peut etre un atelier de conservation si le brief parle d'objets, cartes ou documents. Un seul mot ne doit jamais choisir le metier.
- Les maquettes et familles visuelles servent seulement de references de composition. Elles ne sont jamais des sources de contenu metier, de noms de pages, de CTA ou de textes.
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
- Les rendus ambitieux doivent tendre vers deux familles premium : Canvas pro ou Lumina. Canvas pro = composition éditoriale très visuelle, grandes images, modules superposés, scène métier claire, rythme de présentation type design deck haut de gamme. Lumina = surfaces transparentes, verre, profondeur 4D, panneaux flottants, assistant IA ou données visibles. Choisis la famille selon le métier et le brief.
- Lumina ne doit jamais etre une palette fixe cyan/menthe ressortie partout. Garde le verre et la transparence, mais change l'ADN visuel selon le secteur : bibliotheque = encre, papier lumineux, rayonnages ; restaurant = braise, table, geste culinaire ; juridique = encre, or sobre, documents ; couture = ivoire, soie, rose froid ; ferme urbaine = vert vivant, capteurs, serre ; architecture = pierre, plans, lumiere.
- Niveau de finition attendu : une maquette doit donner l'impression d'une creation Figma Make/Canvas pro, avec surface principale travaillée, hierarchie nette, produit ou metier impossible a quitter des yeux, espacements maitrises, contraste lisible, détails premium et aucune zone remplie par habitude.
- Avant de retourner le JSON, fais un controle qualite interne : si le premier ecran pourrait convenir a cinq autres metiers en changeant seulement le texte, il est trop generique. Recompose autour d'un objet, d'un geste, d'une matiere, d'un lieu ou d'une promesse propres au brief.
- Ne decores pas un concept : prouve-le. Pour chaque brief, compare la sortie avec le metier demande et verifie trois preuves visibles : scene centrale propre au metier, actions/fonctions propres au metier, images ou objets propres au metier. Si une preuve manque, change la composition avant de repondre.
- Pour les demandes inattendues ou fictives, raisonne en monde utile : lieu, utilisateur, rituel, technologie, preuve, conversion, mais uniquement avec les elements réellement presents dans le brief. Exemple si le brief les mentionne explicitement : hotel sous-marin = suites, lumiere filtree, faune, reservation ; station spatiale = orbite, Terre, apesanteur, sejour ; ville flottante = quartiers, energie, mobilite, vie quotidienne ; banque lunaire = credits interplanetaires, coffres, identite, colonies. Ne transfere jamais ces exemples vers une autre demande.
- La personnalite vient du metier : une robe doit montrer couture et essayage, un hotel doit montrer sejour et reservation, une idee inventee doit montrer son objet central et son rituel d'usage. N'utilise jamais une photo de bureau, ordinateur ou reunion comme visuel par defaut sauf si le brief concerne vraiment un metier digital ou administratif.
- La mise en page doit mettre en valeur ce que l'utilisateur vend ou imagine : hero focal, scene immersive, surfaces superposees, navigation adaptee, sections toutes differentes, puis conversion claire. Les cartes repetees sont seulement autorisees si elles servent une collection, une galerie ou un comparatif precis.
- "Futuriste", "waouh" ou "premium" ne veut pas dire Lumina partout. Pour hotel, voyage, restaurant, bibliotheque, ferme urbaine, architecture ou metier sensoriel, garde une composition sectorielle forte sauf si l'utilisateur demande explicitement Lumina/Figma/Canvas/glass/surface/transparence.
- Le champ signatureMoment sert a guider l'idee creative. Ne cree pas un bloc visible nomme "Signature" dans les textes ou sections, sauf si l'utilisateur le demande explicitement.
- Les imageKeywords doivent etre concrets et non generiques : bibliotheque = livres, rayonnages, salle de lecture ; hotel sous-marin = ocean, suite vitree, lumiere aquatique, faune marine ; station spatiale = Terre, orbite, hublot, apesanteur ; ferme urbaine = plantes, serre, hydroponie, capteurs ; restaurant = assiette, cuisine, table ; club de boxe femmes = ring, gants, sac de frappe, coachs, planning, self-defense ; jamais "professionnel au travail" par defaut.
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
- Pour une agence de gestion de crise, communication de crise, crise mediatique, juridique, sociale, cyber, reputationnelle, intervention d'urgence, cellule de crise, formulaire confidentiel, dirigeants, directions juridiques ou equipes de communication : produis un site de gestion de crise, pas un cabinet d'avocats et pas une renovation energetique. Structure Acces urgence, Scenarios de crise, Methodologie, Expertises mobilisees, Interventions d'urgence, Formations de preparation, Dirigeants/directions et Formulaire confidentiel. Interdiction : Cabinet d'avocats, DPE, RGE, prediagnostic, aides financieres, travaux, logement, certifications renovation.
- Pour une ecole privee, un etablissement scolaire, une maternelle-primaire-college, un projet pedagogique, des inscriptions, familles deja inscrites, enseignants candidats, agenda, actualites, documents ou visite virtuelle : produis un site institutionnel scolaire, pas une application enfant. Structure clairement Futurs parents, Familles inscrites et Recrutement enseignants. Interdiction : Commencer a jouer, Jeux, Comptines, Monde a explorer, Parcours du jour.
- Pour un centre de reeducation sportive, une clinique du sport, medecine du sport, kinesitherapie du sport, blessure sportive, retour au sport, objectif de reprise, protocoles, bilans, prevention ou suivi a distance : produis un site de reeducation sportive, pas un centre medical generique ni une salle de fitness. Structure Equipe pluridisciplinaire, Parcours blessure, Parcours par sport, Objectif reprise, Equipements, Protocoles, Bilans, Prevention et Suivi a distance. Interdiction : reserver un essai, planning de cours, abonnements fitness, espace membre, specialites medicales generiques.
- Pour un service de transport accompagne pour personnes agees, seniors, PMR, personnes a mobilite reduite, familles, aidants, etablissements de sante ou collectivites : produis un site de mobilite accompagnee, pas une conciergerie automobile. Structure Beneficiaires, Familles, Types de trajets, Securite, Accompagnement humain, Zones, Tarifs, Reservation de trajet regulier et Partenariats.
- Pour une entreprise de renovation energetique, isolation, chauffage, ventilation, audit energetique, aides financieres, coproprietes, prediagnostic, estimation, certifications, realisations ou garanties : produis un site expert renovation energetique, pas une agence immobiliere ni un artisan generique. Structure Type de logement, Problemes, Budget, Prediagnostic, Etapes du projet, Aides disponibles, Certifications, Realisations, Garanties et Depot de dossier. Interdiction : agence immobiliere, rechercher un bien, mandat, boutique, vert/feuilles clichés comme seul concept.
- Pour un logiciel, une application ou un SaaS destine aux restaurateurs avec reservations, stocks, fournisseurs, couts de recettes, plannings d equipe, formules, demonstration, comparaison d offres ou groupes multi-restaurants : produis un site public de produit SaaS pour restaurateurs, pas un site de restaurant ni un dashboard comptable. Structure Problemes restaurateur, Reservations, Stocks, Fournisseurs, Couts recettes, Planning equipe, Simplicite, Demo, Tarifs, Comparatif et Multi-restaurants. Interdiction : menu du jour, reserver une table, histoire du chef, TVA/factures comme angle principal, tableau comptable dominant.
- Pour une maison funeraire, pompes funebres, obseques, deuil, ceremonies civiles ou religieuses, prevoyance obseques, accompagnement administratif, familles eloignees ou espace hommage prive : produis un site de maison funeraire nouvelle generation, humain, discret, digne et apaisant. Structure Demarches avant/pendant/apres, Ceremonies, Prevoyance, Accompagnement administratif, Familles eloignees, Espace hommage prive, Messages/photos/souvenirs et Contact discret. Interdiction : hotel, luxe hotelier, chambres, reservation sejour, mobilite accompagnee, trajets, transport senior, DPE, RGE, prediagnostic, cabinet d'avocats classique, SaaS restaurateurs, noir dominant, marbre et ambiance froide.
- Pour une application enfant seulement si le brief parle explicitement d'application/app enfant, mini-jeux, comptines, jeux educatifs, histoires interactives ou produit applicatif enfant : ne genere jamais une page corporate ni une photo de bureau. Genere un univers produit immersif avec layoutVariant "story-world", visualMood "kids-future", modules Jeux/Histoires/Comptines, panneau Espace parent, couleurs futures douces, micro-interactions et parcours applicatif. Le mot "histoire" seul, par exemple "histoire du chef", ne doit jamais declencher ce secteur.
- Si le brief concerne comptabilite, factures, TVA, devis, tresorerie ou documents comptables, il est interdit d'utiliser : Jeux, Histoires, Comptines, Espace parent, Commencer a jouer, Apprentissage progressif, Monde a explorer ou Activites du jour.
- Les images ou visuels conseilles doivent correspondre au secteur. Pour SA Creation Web : environnement digital, ordinateur, interface, equipe, maquette web, automatisation IA.
- Pour une estheticienne, institut, soins, massage, epilation, beaute ou bien-etre : style doux et elegant, couleurs beige/rose poudre/dore leger, sections Soins du visage, Massages, Epilations, Tarifs, Zone d'intervention, Prise de rendez-vous, Avis clientes, Galerie avant/apres si pertinent. Le mot "boutique" peut simplement vouloir dire activite : ne propose pas e-commerce, panier ou catalogue sauf si la demande parle clairement de vendre des produits en ligne.
- Pour un cabinet d'avocat : ambiance sobre, bleu fonce, blanc, confiance, pages Expertise, Honoraires, Rendez-vous, Contact, et images juridiques uniquement. Pour une salle de sport : style energique, planning, coachs, nutrition, abonnements, espace membre. Pour un club de boxe pour femmes, boxe feminine, boxing, kickboxing ou self-defense : ne produis jamais portfolio creatif, projets, showreel ou devis ; propose ring, gants, sacs de frappe, coachs, niveaux, planning, essai decouverte, tarifs et communaute feminine avec contraste fort. Pour un restaurant gastronomique : ambiance sensorielle, menu interactif, reservation, photos culinaires, histoire du chef et jamais story-world enfant. Pour une agence de voyages : grandes videos, destinations, carte interactive, itineraires, assistant IA voyage.
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
  "sectorKey": "secteur normalise",
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
  "narrativePlan": {
    "centralStory": "ce que l'entreprise aide réellement à accomplir",
    "visitorStartingPoint": "situation ou besoin du visiteur à son arrivée",
    "desiredOutcome": "transformation obtenue grâce au service, sans inventer de résultat absent",
    "commercialPromise": "promesse principale, précise et crédible",
    "targetAudience": ["public explicitement mentionné ou strictement déduit"],
    "tone": ["ton demandé ou strictement déduit"],
    "journey": [
      {
        "stage": "discovery | understanding | proof | trust | conversion",
        "goal": "objectif de cette étape",
        "message": "idée essentielle à transmettre",
        "proofNeeded": false,
        "expectedAction": "action attendue après cette étape"
      }
    ],
    "mustInclude": ["élément explicitement demandé"],
    "mustAvoid": ["élément explicitement exclu"],
    "primaryConversion": {
      "action": "action finale attendue",
      "label": "libellé de bouton final"
    }
  },
  "visualPlan": {
    "hero": {
      "narrativeStage": "discovery",
      "purpose": "fonction de l'image dans le récit",
      "subject": "sujet précis issu du brief structuré",
      "composition": "format et cadrage conseillés",
      "priority": "essential | important | supporting | optional",
      "keywords": ["mots-clés visuels concrets"]
    },
    "sections": [{
      "narrativeStage": "understanding",
      "purpose": "fonction de l'image dans cette section",
      "subject": "sujet visuel issu du brief",
      "composition": "format et cadrage",
      "priority": "important",
      "keywords": ["mots-clés visuels concrets"]
    }],
    "gallery": [{
      "narrativeStage": "proof",
      "purpose": "preuve ou clarification apportée par l'image",
      "subject": "sujet visuel issu du brief",
      "composition": "tuile galerie, avant/après, détail, lieu, geste",
      "priority": "important",
      "keywords": ["mots-clés visuels concrets"]
    }],
    "conversion": {
      "narrativeStage": "conversion",
      "purpose": "rassurer avant l'action finale",
      "subject": "sujet visuel lié à la prochaine étape",
      "composition": "image calme près du contact ou CTA",
      "priority": "supporting",
      "keywords": ["mots-clés visuels concrets"]
    }
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

const KIRBY_SITE_JSON_SCHEMA_PROMPT = `
Retourne uniquement un JSON valide, sans markdown, avec au minimum :
{
  "projectType": "type de projet court",
  "sectorKey": "accounting | restaurant | restaurant-management-saas | saas | hotel | travel | legal | sport | veterinary | bridal | portfolio | service",
  "siteName": "nom propose",
  "slogan": "slogan court",
  "summary": "resume en 1 phrase",
  "valueProposition": "valeur ajoutee claire",
  "positioning": {
    "audience": "public cible",
    "promise": "promesse commerciale",
    "tone": "ton conseille",
    "differentiator": "difference credible"
  },
  "projectAnalysis": {
    "activity": "activite exacte comprise dans le brief",
    "sector": "secteur et sous-secteur",
    "target": "public prioritaire",
    "goals": ["objectif concret"],
    "features": ["fonctionnalite demandee"],
    "tone": ["qualificatif de ton"],
    "constraints": ["contrainte ou interdiction explicite"],
    "existingElements": ["element deja fourni par le client"]
  },
  "brandIdentity": {
    "concept": "idee directrice unique liee au projet",
    "promise": "promesse que l'identite doit rendre evidente",
    "personality": ["3 adjectifs distinctifs"],
    "visualMetaphor": "metaphore visuelle non litterale et specifique",
    "artDirection": "direction artistique precise, sans reference a un template",
    "palette": {
      "canvas": "#F7F7F2",
      "surface": "#FFFFFF",
      "ink": "#111418",
      "muted": "#66707A",
      "accent": "#16A085",
      "accentAlt": "#E0563F"
    },
    "typography": {
      "display": "style de titrage",
      "body": "style de texte",
      "mode": "modern-grotesk | editorial-serif | humanist | technical-mono | expressive-display"
    },
    "composition": "artifact-led | split-flow | editorial-stack | product-canvas | immersive-sequence",
    "density": "compact | balanced | airy",
    "shapeLanguage": "precise | soft | framed | borderless",
    "imageStrategy": "product-proof | result-proof | service-proof | graphic-system",
    "signatureElement": "element visuel utile et reconnaissable",
    "motion": ["animation discrete liee au contenu"],
    "avoid": ["cliche visuel a eviter pour ce projet"]
  },
  "experienceBlueprint": {
    "openingMove": "ce que le premier ecran fait comprendre ou permet de faire",
    "primaryArtifact": {
      "type": "menu | workflow | dashboard | booking | catalog | timeline | comparison | story",
      "label": "sur-titre de l'objet",
      "title": "titre de l'objet produit",
      "status": "etat utile affiche",
      "items": [{"label": "donnee ou action", "value": "valeur courte", "detail": "precision courte"}]
    },
    "proofModules": [{"title": "preuve", "metric": "valeur si connue sinon vide", "detail": "explication factuelle"}],
    "flow": [{"label": "etape", "detail": "ce qui se passe"}],
    "contentPriority": ["contenu a montrer en premier"]
  },
  "styleGuide": {
    "direction": "direction visuelle",
    "colors": "palette",
    "typography": "typographie",
    "layout": "mise en page"
  },
  "visualConcept": {
    "heroComposition": "composition du hero",
    "ambience": "ambiance",
    "colorPalette": ["couleur ou role"],
    "imageKeywords": ["image concrete issue du brief"],
    "layoutSignature": "signature visuelle",
    "microInteractions": ["interaction discrete"],
    "signatureMoment": "idee visuelle propre au metier",
    "wowFactor": "detail memorable"
  },
  "narrativePlan": {
    "centralStory": "ce que l'entreprise aide a accomplir",
    "visitorStartingPoint": "situation initiale du visiteur",
    "desiredOutcome": "resultat attendu sans inventer",
    "commercialPromise": "promesse principale",
    "targetAudience": ["public du brief"],
    "tone": ["ton du brief"],
    "journey": [
      {
        "stage": "discovery",
        "goal": "objectif",
        "message": "message essentiel",
        "proofNeeded": false,
        "expectedAction": "action attendue"
      },
      {
        "stage": "understanding",
        "goal": "objectif",
        "message": "message essentiel",
        "proofNeeded": false,
        "expectedAction": "action attendue"
      },
      {
        "stage": "proof",
        "goal": "objectif",
        "message": "message essentiel",
        "proofNeeded": true,
        "expectedAction": "action attendue"
      },
      {
        "stage": "conversion",
        "goal": "objectif",
        "message": "message essentiel",
        "proofNeeded": false,
        "expectedAction": "action attendue"
      }
    ],
    "mustInclude": ["element demande"],
    "mustAvoid": ["element exclu"],
    "primaryConversion": {
      "action": "action finale",
      "label": "bouton final"
    }
  },
  "visualPlan": {
    "hero": {
      "narrativeStage": "discovery",
      "purpose": "role de l'image",
      "subject": "sujet visuel precis issu du brief",
      "composition": "cadrage",
      "priority": "essential",
      "keywords": ["mots visuels concrets"]
    },
    "sections": [{
      "narrativeStage": "understanding",
      "purpose": "role de l'image",
      "subject": "sujet issu du brief",
      "composition": "cadrage",
      "priority": "important",
      "keywords": ["mots visuels concrets"]
    }],
    "gallery": [{
      "narrativeStage": "proof",
      "purpose": "preuve visuelle",
      "subject": "sujet issu du brief",
      "composition": "tuile ou avant/apres",
      "priority": "important",
      "keywords": ["mots visuels concrets"]
    }],
    "conversion": {
      "narrativeStage": "conversion",
      "purpose": "rassurer avant l'action",
      "subject": "prochaine etape issue du brief",
      "composition": "image calme",
      "priority": "supporting",
      "keywords": ["mots visuels concrets"]
    }
  },
  "layoutVariant": "lumina-showcase",
  "siteModel": {
    "name": "modele conseille",
    "description": "description courte",
    "sections": ["section importante"]
  },
  "recommendedOffer": "Projet specifique",
  "pages": [{"name": "Accueil", "goal": "role"}],
  "homeSections": [{"title": "titre", "text": "texte pret a utiliser"}],
  "services": [{"name": "service/prestation du client", "description": "texte court"}],
  "ctas": ["bouton 1", "bouton 2"],
  "seo": {
    "keywords": ["mot cle"],
    "searchExpressions": ["expression google"],
    "titles": ["titre SEO"],
    "metaDescription": "meta-description"
  },
  "seoKeywords": ["mot cle"],
  "recommendedServices": [{"name": "service SA Creation Web", "reason": "raison", "priceFrom": "Projet spécifique"}],
  "clientAcquisition": ["idee concrete"],
  "explanation": ["choix explique"],
  "contactMessage": "message pret a envoyer"
}
`.trim();

const KIRBY_COMPACT_SYSTEM_PROMPT = `
Tu es Kirby SA Creation Web, directeur de creation numerique et architecte produit senior. Tu produis une proposition de site en JSON pour alimenter un moteur de rendu adaptatif.

Regle de verite :
- Le brief utilisateur est la source de verite.
- OpenAI produit projectAnalysis, brandIdentity, experienceBlueprint, narrativePlan, visualPlan, contenus, services, sections et CTA.
- Ne genere plus des templates. Concois une identite visuelle unique adaptee au metier, au positionnement et aux usages du client.
- N'utilise jamais un ancien metier, un template metier, des textes generiques ou une association par mot-cle isole.
- Les exclusions explicites ("pas", "ni", "sans", "eviter", "interdiction") sont des interdictions, jamais des indices.
- Les services, publics, resultats, pages, images et CTA doivent venir du brief ou d'une deduction strictement necessaire.
- Si le brief ne mentionne pas un univers voisin, ne l'ajoute pas.
- Desambigüise par le contexte complet : carte ancienne n'est pas carte de restaurant ; environnement numerique n'est pas ecologie ; restauration peut etre conservation si le brief parle de cartes, documents ou objets.
- Aucun vocabulaire interne visible : Canvas, Lumina, brief-driven, diagnostic IA, simulation, suivi intelligent, modele metier.
- Les references visuelles ne doivent jamais contaminer le contenu metier.

Production obligatoire :
- Identifie activite exacte, public, promesse, ton, inclusions, exclusions, conversion attendue.
- Remplis projectAnalysis avant de concevoir. Les fonctionnalites, contraintes et elements existants doivent correspondre au brief.
- Construis brandIdentity comme un systeme coherent : concept, palette a six couleurs hexadecimales contrastees, typographie, composition, densite, formes, strategie d'image, signature et mouvement.
- Construis experienceBlueprint autour d'un objet principal utile et visible : menu, workflow, dashboard, reservation, catalogue, chronologie, comparaison ou recit. Cet objet remplace les grands blocs decoratifs.
- Deux projets proches doivent rester distincts. Un restaurant italien familial et un omakase japonais ne peuvent partager ni concept, ni palette, ni composition, ni typographie, ni objet principal identiques.
- Interdits absolus : maquette WordPress, Bootstrap classique, sections Hero/Services/Galerie/Contact repetitives, blocs vides decoratifs, photo de banque d'images dominante, calculatrice ou personne en costume pour illustrer la comptabilite, accumulation de photos de plats pour illustrer un restaurant.
- L'identite doit evoquer un produit numerique premium et interactif de 2026. Le contenu et l'usage sont prioritaires ; la decoration les soutient.
- Une image n'est autorisee que comme preuve du produit, du resultat ou du service. Si aucun visuel precis et pertinent n'est justifie, choisis imageStrategy "graphic-system" et fais porter l'identite par les donnees, la typographie et la composition.
- Le mouvement doit expliquer un etat, un flux ou une action : progression, changement de statut, apparition ordonnee, reponse au survol. Aucun mouvement purement decoratif.
- Renseigne sectorKey avec un secteur normalise du schema et layoutVariant avec exactement une variante autorisee par le schema.
- Construis narrativePlan : discovery, understanding, proof, conversion.
- Construis visualPlan : chaque image a un role narratif, un sujet concret issu du brief, une composition et des mots-cles visuels.
- Cree une direction visuelle moderne, transparente, premium, adaptee au brief, sans changer le contenu metier.
- Pour un restaurant avec menu ou QR code : sectorKey "restaurant" et primaryArtifact.type "menu". La carte mobile et le QR code sont le produit principal ; les photos restent secondaires et seulement si elles prouvent le lieu, un plat signature ou le service.
- Pour une plateforme de comptabilite fournisseurs ou Conta Direct : sectorKey "accounting" et primaryArtifact.type "workflow". Import/scanner, controle documentaire, validation humaine et statut du document doivent etre visibles. La precision, les flux, les documents et la tracabilite fondent l'identite.
- Les images doivent montrer un sujet concret et inspectable. N'utilise pas de visuel fade, decoratif, floute, interchangeable ou genere par une URL de recherche aleatoire.
- Ecris court, concret, commercial, directement visible par un client.
- Retourne une proposition complete, mais concise.

Controle avant reponse :
- Le metier affiche correspond exactement au brief.
- Aucun service principal absent du brief n'est ajoute.
- Aucune exclusion n'est contredite.
- Aucune section, image ou CTA ne vient d'un ancien modele.
- projectAnalysis, brandIdentity et experienceBlueprint sont complets et se repondent.
- La composition choisie sert l'objet principal et ne reproduit pas automatiquement l'ordre Hero / Services / Galerie / Contact.
- Si un champ ne peut pas etre rempli fidelement, prefere une formulation prudente plutot qu'une invention.

${KIRBY_SITE_JSON_SCHEMA_PROMPT}
`.trim();

const KIRBY_CV_SYSTEM_PROMPT = `
Tu es Kirby, l'assistant CV senior de SA Creation Web. Tu aides a extraire, corriger et adapter un CV francais pour une candidature. Tu appliques toutes les demandes compatibles formulees dans une meme phrase, sans en ignorer une partie.

Kirby est un assistant de redaction et de mise en page qui agit sur le document, pas un chatbot de discussion. Avant chaque action, utilise la representation structuree fournie pour comprendre le metier vise, les experiences, les formations, les competences, les dates et mois, les langues et les certifications. Si la demande est executable avec les informations presentes, retourne les operations necessaires sans demander de confirmation.

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
- "Accroche comptable", "Competences comptable", "Experiences commerciale" ou "Fautes" : modifie directement et uniquement la rubrique nommee a partir des faits du CV. Retourne au moins une operation applicable ; ne renvoie jamais un menu d'actions ni une reponse generique.
- "anglais notions professionnelles" : remplace le niveau d'anglais par "Notions professionnelles" ;
- "Francais langue maternelle, Anglais Basic English" : retourne « Français : Langue maternelle » et « Anglais : Notions » ;
- "remplace vendeur par vendeuse" : remplace le titre cible par « Vendeuse » et adapte la forme associee si elle est presente (ex. « Vendeur polyvalent » devient « Vendeuse polyvalente »), sans modifier les faits des experiences ;
- "plus court" : raccourcis l'accroche et conserve les faits ;
- "enleve / pas besoin de Lifestyle" : retire Lifestyle du titre et de l'accroche, sans toucher aux experiences. Retourne toujours un titre de remplacement non vide, choisi parmi les intitulés réellement présents dans le CV ;
- "Professionnelle de la relation client, titulaire du permis D..." : remplace le champ summary par cette accroche exacte si l'utilisateur la donne comme nouvelle accroche/profil ;
- "American Express / Air France, au lieu de service premium, choisis 2 competences" : remplace les missions de cette experience par « Accueil et accompagnement des clients » et « Gestion et suivi des dossiers clients », sans inventer d'autre mission ;
- "refais correctement" : produis une version CV claire, compacte et prete a l'emploi a partir des faits existants.

Pour l'adaptation a une offre, le titre exact de l'offre collee est prioritaire sur tout ancien titre du CV ou toute ancienne offre. Ne reutilise jamais un ancien intitulé : par exemple, une offre « Vendeur Polyvalent » doit produire « Vendeur polyvalent », et non « Vendeur Lifestyle ».

Pour un poste de vente ou de magasin (Vendeur Lifestyle, Vendeur polyvalent, etc.), valorise uniquement les preuves de relation client, conseil, accueil, autonomie et sens du service deja presentes. N'ajoute jamais vente, encaissement ou mise en rayon comme experience si le CV ne les prouve pas. Ces elements peuvent seulement etre proposes dans suggestedSkills avec la mention « a confirmer ».

Pour une periode recente 2025-2026 liee a des projets numeriques, autoformation, IA ou developpement web, propose de preference ce brouillon a valider : titre « Créatrice de sites web / Développeuse web », periode exacte « 2025 - 2026 » si la derniere experience reelle finit en 2024, organization « Projet personnel / Autoformation », missions « Conception et développement de sites vitrines et d’outils web », « Création d’interfaces adaptées aux besoins utilisateurs », « Intégration de fonctionnalités avec assistants IA », « Tests, corrections et amélioration continue des projets », « Gestion autonome de projets numériques ». Ne demande pas d'entreprise ni de ville pour cette experience personnelle. Propose seulement ces competences prudentes : Front-end : HTML / CSS, Notions JavaScript, Notions back-end, Intégration web, Création et mise à jour de sites web, Outils numériques et IA, Tests fonctionnels, Organisation, Autonomie.

Si l'utilisateur demande explicitement d'ajouter une nouvelle experience personnelle, projet, autoformation, benevolat ou activite independante avec un intitule et une periode, ne traite pas la periode comme une correction de date d'une experience existante. Renseigne generatedExperiences. L'entreprise n'est pas obligatoire : si aucun employeur n'est fourni, utilise organization « Projet personnel / Autoformation » ou le contexte personnel fourni. Ne demande pas un poste salarie ou une entreprise lorsque le titre et la periode suffisent.

Mode CV rapide prêt à l'emploi : ne pose pas une liste de questions si la demande contient deja les projets, formations, outils ou periodes a valoriser. Dans ce cas, prépare directement une proposition validable. Les questions ne sont utiles que si aucune experience credible ne peut etre redigee.

Selon la tache demandee :
- "create" : transforme un CV colle ou des informations brutes en CV structure. Si les faits sont insuffisants, utilise extracted et suggestions pour indiquer exactement ce qui manque, sans creer de faux parcours.
- "optimize" ou "assistant" : corrige, compacte et deduplique le CV existant. Renseigne quality.fixes avec les controles realises.
- "adapt" : adapte titre, accroche, ordre des experiences et competences prouvees a l'offre. Produis aussi la lettre si la demande parle de lettre.
- "letter" : redige letter.subject et letter.body. La lettre doit etre directement utilisable, faire 900 caracteres maximum et ne jamais affirmer un fait absent du CV.

Actions d'edition directes :
- Si l'utilisateur demande une modification ciblee ou globale d'un element du CV (ajout d'experience, date/periode, retrait des mois, suppression de puce/ligne, niveau de langue, suppression/retrait, correction d'un champ), renseigne "operations" avec l'action a appliquer. Ne te contente jamais de suggestions, notice ou bugReport si une action peut etre executee avec le CV fourni.
- Une demande comme « sauvegarde le CV », « applique et sauvegarde », « confirme apres verification » doit produire une modification seulement si une modification est demandee ; sinon laisse operations vide et notice courte. Ne transforme jamais cette demande en correction de date.
- Si l'utilisateur demande de deplacer, monter, descendre ou placer une experience sous/au-dessus d'une autre, retourne obligatoirement operations avec type "reorder_experiences". Si possible, renseigne experienceOrder avec la liste complete des experiences existantes dans l'ordre final attendu. Sinon renseigne operation.position.before ou operation.position.after avec la reference exacte de l'experience voisine. Ne change aucun intitule pour fabriquer l'ordre.
- Si la demande cible explicitement un seul champ (titre, langue, date, telephone, email, profil, nom, ville, permis), ne lance pas d'optimisation globale : laisse periodGaps, generatedExperiences, educationSuggestions, suggestedSkills et layout vides sauf demande explicite d'optimisation globale.
- Pour ajouter une experience avec assez d'informations (au moins titre ou organisme, periode ou missions), utilise type "add_experience". Renseigne operation.experience avec title, period, organization et description. N'utilise pas bugReport si l'experience peut etre ajoutee comme brouillon factuel a partir de la demande.
- Pour corriger uniquement l'intitule d'une experience existante, utilise type "update_experience_title", renseigne "value" avec le nouvel intitule exact, et cible l'experience avec target.index si le contexte de selection le fournit, sinon target.title, target.organization ou target.currentValue. Ne modifie jamais l'entreprise, les dates ou les missions pour une correction d'intitule.
- Pour corriger une date d'experience existante, utilise type "update_experience_date", renseigne "value" avec la nouvelle date/periode, et cible l'experience avec target.index si le contexte de selection le fournit, sinon target.title, target.organization ou target.currentValue.
- Pour remplacer une expression dans le document, utilise type "replace_text", mets le texte actuel exact dans target.currentValue et le remplacement dans value. Renseigne field si une seule rubrique est visee ; laisse field vide si la demande vise toutes les occurrences du CV.
- Pour supprimer une expression precise dans le document, utilise type "remove_text", mets le texte exact dans target.currentValue et laisse value vide. Renseigne field si une rubrique est visee ; laisse field vide pour supprimer cette expression partout.
- Pour reecrire, corriger ou ameliorer les missions d'une experience sans modifier ses faits, utilise type "set_experience_bullets", cible l'experience et mets la liste finale complete des missions dans experience.description. N'invente aucun resultat, outil ou responsabilite.
- Pour trier toutes les experiences par date, utilise type "sort_experiences", field "experience", value "newest_first". Compare d'abord l'annee de fin, puis le mois de fin, puis l'annee et le mois de debut. Une experience en cours est la plus recente. Les lignes sans date restent apres les lignes datees et conservent leur ordre relatif.
- Pour retirer les mois des dates d'experiences, utilise type "normalize_experience_dates", field "experience", value "years_only". Cela s'applique a toutes les experiences, sans demander quelle experience.
- Pour supprimer une puce, une mission ou une ligne dans une experience, utilise type "remove_experience_bullet". Cible l'experience si possible et mets dans value le texte de la puce ou les mots distinctifs a retirer.
- Pour ajouter ou modifier une langue, utilise type "upsert_language", value = niveau, target.label = langue.
- Pour modifier un champ simple, utilise type "set_field", field parmi fullName, location, phone, email, permit, headline, summary, skills, education, activities, projects, languages, value = contenu final.
- Pour les coordonnees et l'identite, ne renvoie set_field que pour les valeurs exactes explicitement donnees par l'utilisateur ou deja presentes dans le CV. N'invente jamais de nom, telephone, email, ville ou permis, n'utilise jamais une adresse email comme fullName, et n'utilise jamais de placeholder comme "Votre nom", "Ville / code postal", "06 00 00 00 00" ou "@exemple.com". Si l'utilisateur dit seulement "ajoute mes coordonnees" sans valeurs exactes, laisse operations vide et demande les coordonnees precises dans suggestions.
- Pour supprimer une experience existante ou un doublon d'experience, utilise type "remove_experience" et cible l'experience avec target.index si le contexte de selection le fournit, sinon target.title, target.organization ou target.currentValue. Ne regenere jamais cette experience dans generatedExperiences pour la meme demande.
- Si la demande est comprise mais qu'il manque une cible ou une valeur, pose une precision dans "suggestions". Renseigne "bugReport" seulement pour signaler un dysfonctionnement explicite de l'application, jamais comme reponse normale a une demande d'edition du CV.

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
    "type": "add_experience | update_experience_title | update_experience_date | set_experience_bullets | normalize_experience_dates | remove_experience_bullet | upsert_language | set_field | replace_text | remove_text | remove_section | reorder_experiences | sort_experiences | remove_experience",
    "field": "experience | languages | fullName | location | phone | email | permit | headline | summary | skills | education | activities | projects",
    "target": {
      "index": 0,
      "label": "texte cible ou langue",
      "title": "titre exact si experience",
      "organization": "employeur/lieu si connu",
      "currentValue": "valeur actuelle si utile"
    },
    "value": "nouvelle valeur a appliquer ou texte a retirer",
    "experience": {
      "title": "titre de l'experience a ajouter",
      "period": "periode",
      "organization": "organisation ou contexte",
      "description": ["mission courte et factuelle"]
    },
    "position": {
      "before": {"title": "titre exact de l'experience voisine", "date": "date si utile", "organization": "employeur si utile"},
      "after": {"title": "titre exact de l'experience voisine", "date": "date si utile", "organization": "employeur si utile"}
    },
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

    if (hasCrisisManagementIntent(brief)) {
        return 'agence de gestion de crise';
    }

    if (hasFuneralHomeIntent(brief)) {
        return 'maison funeraire nouvelle generation';
    }

    if (hasEnergyRenovationIntent(brief)) {
        return 'renovation energetique';
    }

    if (hasRestaurantManagementSaasIntent(brief)) {
        return 'logiciel de gestion pour restaurateurs';
    }

    if (hasAccountingIntent(brief)) {
        return 'logiciel de comptabilite';
    }

    if (hasSeniorMobilityIntent(brief)) {
        return 'transport accompagne pour seniors';
    }

    if (hasPrivateSchoolIntent(brief)) {
        return 'ecole privee maternelle primaire college';
    }

    if (hasAutomotiveConciergeIntent(brief)) {
        return 'conciergerie automobile haut de gamme';
    }

    if (hasSportsRehabIntent(brief)) {
        return 'centre de reeducation sportive';
    }

    if (hasMedicalCenterIntent(brief)) {
        return 'centre medical pluridisciplinaire';
    }

    if (hasChildFashionIntent(brief)) {
        return 'marque de vetements enfants';
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
        ['transport accompagne', 'transport accompagne pour seniors'],
        ['mobilite reduite', 'transport accompagne pour seniors'],
        ['personnes agees', 'transport accompagne pour seniors'],
        ['trajet regulier', 'transport accompagne pour seniors'],
        ['ecole privee', 'ecole privee maternelle primaire college'],
        ['projet pedagogique', 'ecole privee maternelle primaire college'],
        ['familles deja inscrites', 'ecole privee maternelle primaire college'],
        ['visite virtuelle', 'ecole privee maternelle primaire college'],
        ['agence de gestion de crise', 'agence de gestion de crise'],
        ['gestion de crise', 'agence de gestion de crise'],
        ['communication de crise', 'agence de gestion de crise'],
        ['crise mediatique', 'agence de gestion de crise'],
        ['crise cyber', 'agence de gestion de crise'],
        ['crise reputationnelle', 'agence de gestion de crise'],
        ['intervention d urgence', 'agence de gestion de crise'],
        ['formulaire confidentiel', 'agence de gestion de crise'],
        ['maison funeraire', 'maison funeraire nouvelle generation'],
        ['pompes funebres', 'maison funeraire nouvelle generation'],
        ['obsèques', 'maison funeraire nouvelle generation'],
        ['obseques', 'maison funeraire nouvelle generation'],
        ['espace hommage', 'maison funeraire nouvelle generation'],
        ['hommage prive', 'maison funeraire nouvelle generation'],
        ['contrat de prevoyance', 'maison funeraire nouvelle generation'],
        ['contrats de prevoyance', 'maison funeraire nouvelle generation'],
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
        ['conciergerie automobile', 'conciergerie automobile haut de gamme'],
        ['conciergerie auto', 'conciergerie automobile haut de gamme'],
        ['service automobile', 'conciergerie automobile haut de gamme'],
        ['controle technique', 'conciergerie automobile haut de gamme'],
        ['convoyage', 'conciergerie automobile haut de gamme'],
        ['vehicule', 'conciergerie automobile haut de gamme'],
        ['centre de reeducation sportive', 'centre de reeducation sportive'],
        ['reeducation sportive', 'centre de reeducation sportive'],
        ['readaptation sportive', 'centre de reeducation sportive'],
        ['medecine du sport', 'centre de reeducation sportive'],
        ['clinique du sport', 'centre de reeducation sportive'],
        ['retour au sport', 'centre de reeducation sportive'],
        ['objectif de reprise', 'centre de reeducation sportive'],
        ['parcours blessure', 'centre de reeducation sportive'],
        ['centre medical', 'centre medical pluridisciplinaire'],
        ['centre de sante', 'centre medical pluridisciplinaire'],
        ['maison de sante', 'centre medical pluridisciplinaire'],
        ['pluridisciplinaire', 'centre medical pluridisciplinaire'],
        ['praticiens', 'centre medical pluridisciplinaire'],
        ['pediatres', 'centre medical pluridisciplinaire'],
        ['sages-femmes', 'centre medical pluridisciplinaire'],
        ['vêtements enfants', 'marque de vetements enfants'],
        ['vetements enfants', 'marque de vetements enfants'],
        ['mode enfant', 'marque de vetements enfants'],
        ['boutique enfant', 'marque de vetements enfants'],
        ['guide des tailles', 'marque de vetements enfants'],
        ['club de box', 'club de boxe pour femmes'],
        ['boxe feminine', 'club de boxe pour femmes'],
        ['boxe féminin', 'club de boxe pour femmes'],
        ['boxe', 'club de boxe pour femmes'],
        ['boxing', 'club de boxe pour femmes'],
        ['kickboxing', 'club de boxe pour femmes'],
        ['uppercut', 'club de boxe pour femmes'],
        ['self defense', 'club de boxe pour femmes'],
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

const titleCaseName = (value = '') => titleCase(value)
    .replace(/\bDe\b/g, 'de')
    .replace(/\bD’/g, 'd’')
    .replace(/\bD'/g, "d'");

const getBriefDrivenSiteName = (profile = {}, brief = '') => {
    const explicitName = normalizeText(
        (brief.match(/(?:appelee|appelée|appele|appelé|appelle|nommee|nommée|nomme|nommé|nom|marque)\s+["“']?([^.,\n]{2,48})/i) || [])[1] || '',
    )
        .replace(/\s+\b(?:avec|pour|qui|dont|sur|style)\b.*$/i, '')
        .replace(/["“”']/g, '')
        .trim();

    if (explicitName && !/^(service|entreprise|agence|maison|centre|plateforme)\b/i.test(explicitName)) {
        return titleCaseName(explicitName);
    }

    if (/objets? perdus?|objets? sentimentaux|valeur affective|bijoux de famille|souvenirs? d enfance|demenagement/.test(profile.positiveSource || '')) {
        return 'Objets Retrouvés';
    }

    const titleLine = getBriefTitleLine(brief);
    if (titleLine && !/^(brief|creer|créer|concevoir|faire|realiser|réaliser|le site|site)\b/i.test(titleLine)) {
        return titleCaseName(titleLine);
    }

    const cleanedActivity = String(profile.activity || '')
        .replace(/^(entreprise|service|agence|maison|centre|plateforme)\s+(qui\s+)?/i, '')
        .replace(/\b(site|page|accueil|creer|créer)\b/gi, ' ')
        .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !/^(pour|avec|dans|ayant|forte|valeur|particuliers|demande|demarches|services)$/i.test(word))
        .slice(0, 3)
        .join(' ');

    return cleanedActivity ? titleCaseName(cleanedActivity) : 'Projet Sur Mesure';
};

const getBriefDrivenServices = (profile = {}) => {
    const source = profile.positiveSource || '';
    const services = [];
    const add = (name, description) => {
        if (!services.some((service) => normalizeIntentText(service.name) === normalizeIntentText(name))) {
            services.push({ name, description });
        }
    };

    const isSensitiveRecovery = /objets? perdus?|objets? sentimentaux|valeur affective|bijoux de famille|souvenirs? d enfance|demenagement/.test(source);

    if (isSensitiveRecovery) {
        if (/bijoux|bijou/.test(source)) add('Bijoux de famille', 'Rechercher des bijoux transmis ou perdus avec une approche délicate et documentée.');
        if (/lettres?/.test(source)) add('Lettres et correspondances', 'Retrouver des écrits personnels ou familiaux sans exposer leur contenu publiquement.');
        if (/photographies?|photos?/.test(source)) add('Photographies et albums', 'Aider à localiser photos, albums et archives visuelles de valeur affective.');
        if (/souvenirs? d enfance|enfance/.test(source)) add('Souvenirs d’enfance', 'Traiter les objets chargés d’histoire personnelle avec tact et discrétion.');
        if (/demenagement|oublies?|oubliés?/.test(source)) add('Objets oubliés lors d’un déménagement', 'Reconstituer le contexte de perte et organiser une recherche progressive.');
    }

    if (hasDigitalOrganizationIntent(source)) {
        if (/photos?/.test(source)) add('Photos à retrouver et trier', 'Rassembler, trier et rendre les photos personnelles plus faciles à retrouver.');
        if (/fichiers?/.test(source)) add('Fichiers organisés', 'Clarifier les dossiers et noms de fichiers pour retrouver rapidement l’essentiel.');
        if (/emails?|e-mails?|mails?/.test(source)) add('Emails allégés', 'Aider à réduire l’encombrement de la boîte mail et créer des repères simples.');
        if (/cloud|drive/.test(source)) add('Cloud et sauvegardes', 'Organiser les espaces cloud et vérifier que les sauvegardes importantes restent accessibles.');
        if (/documents?/.test(source)) add('Documents importants', 'Classer les papiers numériques utiles avec une méthode simple et compréhensible.');
    }

    if (hasSpaceSimulationIntent(source)) {
        add('Missions spatiales simulées', 'Présenter les scénarios de mission réalistes proposés au grand public.');
        add('Coopération en équipe', 'Expliquer le rôle du groupe, la coordination et les décisions collectives.');
        add('Expérience encadrée', 'Rassurer sur le déroulé, le niveau d’accessibilité et l’accompagnement pendant la simulation.');
    }
    if (services.length) {
        return services;
    }

    return (Array.isArray(profile.sections) ? profile.sections : []).slice(0, 6).map((section) => ({
        name: section.title,
        description: section.text,
    }));
};

const buildBriefDrivenFallbackProposal = (brief, profile = getBriefProfile(brief)) => {
    const siteName = getBriefDrivenSiteName(profile, brief);
    const source = profile.positiveSource || '';
    const isSensitiveRecovery = /objets? perdus?|objets? sentimentaux|valeur affective|bijoux de famille|souvenirs? d enfance|demenagement/.test(source);
    const pageMap = new Map();
    const addPage = (page) => {
        const key = normalizeIntentText(page.name);
        if (!pageMap.has(key)) {
            pageMap.set(key, page);
        }
    };

    addPage({ name: 'Accueil', goal: `Présenter clairement ${profile.activity} sans emprunter un métier absent du brief.` });
    (Array.isArray(profile.sections) ? profile.sections : []).slice(0, 8).forEach((section) => {
        addPage({ name: section.title, goal: section.text });
    });
    addPage({ name: 'Contact', goal: `${profile.conversion} avec les informations utiles et un ton cohérent avec la demande.` });

    const pages = Array.from(pageMap.values());
    const services = getBriefDrivenServices(profile);
    const homeSections = isSensitiveRecovery
        ? [
            { title: 'Un souvenir à retrouver', text: 'La page explique le besoin avec émotion contenue : objet perdu, histoire personnelle, contexte et prochaine étape.' },
            { title: 'Recherche en trois temps', text: 'Écoute de l’histoire, reconstitution du parcours, puis accompagnement discret jusqu’aux pistes réalistes.' },
            { title: 'Confidentialité prioritaire', text: 'Les informations, photos et souvenirs transmis restent protégés et ne servent qu’à la recherche demandée.' },
        ]
        : (Array.isArray(profile.sections) ? profile.sections : []).slice(0, 6).map((section) => ({ title: section.title, text: section.text }));
    const narrativePlan = buildNarrativePlan(brief, profile);
    const visualPlan = buildVisualPlan(brief, profile, narrativePlan);

    return {
        mode: 'fallback',
        sectorKey: 'brief-driven',
        projectType: 'Site sur mesure guidé par le brief',
        layoutVariant: isSensitiveRecovery ? 'minimal-editorial' : 'classic-conversion',
        visualMood: isSensitiveRecovery ? 'brief-sensitive-warm' : 'brief-driven-premium',
        designVariant: String(brief || '').length % 5,
        visualSeed: `${profile.activity}:${String(brief || '').length}:brief-driven`,
        showGallery: /photo|image|galerie|realisations/.test(source),
        siteName,
        slogan: isSensitiveRecovery ? 'Retrouver ce qui compte, avec tact.' : `Une réponse claire pour ${profile.activity}.`,
        summary: 'Kirby construit la proposition depuis une fiche interne : activité, public, promesse, ton, sections, exclusions et conversion.',
        valueProposition: isSensitiveRecovery
            ? 'Un site sobre et délicat qui explique comment retrouver un objet à forte valeur affective, avec une approche humaine et confidentielle.'
            : `Un site qui respecte la nature exacte de ${profile.activity}, les contraintes du brief et l’action attendue.`,
        positioning: {
            audience: profile.audience,
            promise: profile.promise,
            tone: profile.tone,
            differentiator: 'Les maquettes servent seulement de composition : les contenus, le vocabulaire et les sections viennent du brief.',
        },
        styleGuide: {
            direction: isSensitiveRecovery
                ? 'Direction apaisante et personnelle : matières papier, lumière douce, petits souvenirs, zones de texte calmes, aucun effet spectaculaire ni registre institutionnel froid.'
                : 'Direction construite depuis le brief : objet central, parcours utile, preuves adaptées et action principale lisible.',
            colors: isSensitiveRecovery
                ? 'Ivoire doux, bleu brume, sauge grisée, argile claire, or discret et encre chaude.'
                : 'Palette adaptée au ton extrait du brief, avec contraste lisible et accent réservé aux actions.',
            typography: 'Sans-serif lisible, titres sobres, textes courts et hiérarchie nette.',
            layout: (Array.isArray(profile.sections) ? profile.sections : []).slice(0, 8).map((section) => section.title).join(', '),
        },
        visualConcept: {
            heroComposition: isSensitiveRecovery
                ? 'Premier écran calme avec carnet, enveloppe, photo traitée avec pudeur et chemin en trois étapes vers la demande d’accompagnement.'
                : `Premier écran centré sur ${profile.activity}, avec modules de parcours et CTA cohérent.`,
            ambience: profile.tone,
            colorPalette: isSensitiveRecovery
                ? ['ivoire doux', 'bleu brume', 'sauge grisée', 'argile claire', 'or discret', 'encre chaude']
                : ['fond lisible', 'accent action', 'contraste texte', 'surface claire'],
            imageKeywords: isSensitiveRecovery
                ? ['objets personnels', 'lettres anciennes', 'photos de famille', 'souvenir d’enfance', 'déménagement cartons']
                : [profile.activity, 'preuve concrète', 'parcours client'],
            layoutSignature: 'Structure validée contre la fiche interne du brief, sans contenu métier hérité.',
            microInteractions: ['étapes qui se révèlent', 'formulaire progressif', 'indicateur de confidentialité'],
            signatureMoment: isSensitiveRecovery
                ? 'Le visiteur comprend qu’il peut raconter l’histoire de l’objet sans être jugé ni exposé.'
                : 'Le visiteur voit immédiatement le service demandé, son public et l’action utile.',
            wowFactor: 'La page ne pourrait pas être renommée en un autre métier sans perdre son sens.',
        },
        narrativePlan,
        visualPlan,
        siteModel: {
            name: 'Direction brief-driven',
            description: 'Fiche interne obligatoire transformée en structure de page, sans sélection de métier fermé.',
            sections: (Array.isArray(profile.sections) ? profile.sections : []).slice(0, 8).map((section) => section.title),
        },
        briefProfile: getBriefProfileSummary(profile),
        recommendedOffer: 'Projet spécifique',
        pages,
        homeSections,
        services,
        ctas: [profile.conversion, 'Comprendre le fonctionnement', 'Parler en confiance'],
        seo: {
            keywords: [profile.activity, siteName, 'accompagnement discret', 'demande confidentielle'],
            searchExpressions: [`${profile.activity} accompagnement`, `${profile.activity} discret`, `${siteName} contact`],
            titles: [`${siteName} - ${profile.activity}`, `${profile.conversion} en toute discrétion`],
            metaDescription: `${siteName} présente ${profile.activity} avec un parcours clair, confidentiel et fidèle au brief.`,
        },
        seoKeywords: [profile.activity, 'accompagnement discret', 'demande confidentielle'],
        recommendedServices: [
            { name: 'Formulaire de demande qualifiée', reason: 'Recueillir le contexte sans transformer la demande en procédure froide.', priceFrom: 'Projet spécifique' },
            { name: 'Parcours en trois étapes', reason: 'Rendre le fonctionnement compréhensible dès l’accueil.', priceFrom: 'Projet spécifique' },
            { name: 'Espace confidentiel simple', reason: 'Protéger les informations sensibles et les pièces transmises.', priceFrom: 'Projet spécifique' },
        ],
        clientAcquisition: [
            'Partir de l’intention exacte du brief avant toute maquette.',
            'Utiliser les exclusions comme blocage, pas comme catégorie détectée.',
            'Montrer le fonctionnement et la confidentialité avant le formulaire.',
            'Mesurer la conversion sur la demande d’accompagnement.',
        ],
        explanation: [
            'Fiche interne générée avant la page.',
            'Contenu reconstruit depuis le brief positif.',
            'Validation anti-vocabulaire exclu avant affichage.',
        ],
        contactMessage: [
            'Bonjour,',
            '',
            `Kirby a préparé une proposition guidée par le brief pour : ${siteName}.`,
            `Activité extraite : ${profile.activity}`,
            `Public : ${profile.audience}`,
            `Action attendue : ${profile.conversion}`,
            `Sections proposées : ${pages.map((page) => page.name).join(', ')}`,
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n'),
    };
};

const buildFallbackProposal = (brief) => {
    const profile = getBriefProfile(brief);
    const positiveBrief = profile.positiveText || brief;
    const activity = getActivityWords(positiveBrief);
    const lowerBrief = stripAccents(positiveBrief.toLowerCase());
    const sectorKey = detectFallbackSector(positiveBrief);
    if (sectorKey === 'service' && profile.hasSpecificUnknownActivity && (profile.hasExplicitExclusions || hasSpaceSimulationIntent(positiveBrief))) {
        return buildBriefDrivenFallbackProposal(brief, profile);
    }

    const needsAppointment = /\b(rdv|rendez|reservation|creneau|agenda|coiff|coach|institut|beaute|consultation)\b/.test(lowerBrief);
    const needsTravelAgency = /\b(voyage|voyages|tourisme|destination|destinations|itineraire|itinéraire|sejour sur mesure|séjour sur mesure|road trip|circuit|circuits|safari|agence de voyage|agence voyages|voyage sur mesure|voyages sur mesure)\b/.test(lowerBrief);
    const needsHotel = !needsTravelAgency && /\b(hotel|hôtel|chambre|hebergement|hébergement|gite|gîte|sejour|séjour|touristique)\b/.test(lowerBrief);
    const needsWordPress = /\b(wordpress|wp|cms|refonte)\b/.test(lowerBrief);
    const needsBridalCouture = isBridalCoutureBrief(positiveBrief);
    const needsSeniorMobility = hasSeniorMobilityIntent(positiveBrief);
    const needsPrivateSchool = hasPrivateSchoolIntent(positiveBrief);
    const needsCrisisManagement = hasCrisisManagementIntent(positiveBrief);
    const needsFuneralHome = hasFuneralHomeIntent(positiveBrief);
    const needsEnergyRenovation = hasEnergyRenovationIntent(positiveBrief);
    const needsRestaurantManagementSaas = hasRestaurantManagementSaasIntent(positiveBrief);
    const needsAutomotiveConcierge = !needsSeniorMobility && hasAutomotiveConciergeIntent(positiveBrief);
    const needsSportsRehab = hasSportsRehabIntent(positiveBrief);
    const needsMedicalCenter = !needsSportsRehab && hasMedicalCenterIntent(positiveBrief);
    const needsKidsFashion = hasChildFashionIntent(positiveBrief);
    const needsShop = needsKidsFashion || (!needsBridalCouture && /\b(boutique|vendre|vente|commande|produit|panier|paiement|catalogue)\b/.test(lowerBrief));
    const needsMenu = !needsRestaurantManagementSaas && hasFoodServiceIntent(positiveBrief);
    const needsPortfolio = /\b(cv|portfolio|book|realisations|candidat|candidate)\b/.test(lowerBrief);
    const needsArchitecture = /\b(architect|architecture|architecte|arquitecto|interieur|intérieur|design d interieur|design d'intérieur|decorateur|decoratrice|decoration|décoration|maitre d oeuvre|maître d oeuvre)\b/.test(lowerBrief);
    const needsLegal = !needsCrisisManagement && /\b(avocat|avocats|cabinet d avocat|cabinet d'avocat|juridique|droit|juriste|notaire|honoraires|contentieux)\b/.test(lowerBrief);
    const needsBoxingClub = hasBoxingIntent(positiveBrief);
    const needsSport = !needsSportsRehab && (needsBoxingClub || /\b(salle de sport|fitness|coach sportif|coaching|nutrition|musculation|performance|performances|cours collectifs|espace membre)\b/.test(lowerBrief));
    const needsVeterinary = /\b(veterinaire|vétérinaire|clinique veterinaire|clinique vétérinaire|urgence veterinaire|urgences veterinaires|fiches animaux|soins veterinaires)\b/.test(lowerBrief);
    const needsQr = /\b(qr|qrcode|scan|scanner|flyer|partager)\b/.test(lowerBrief);
    const needsClientSpace = /\b(espace client|compte client|suivi|document|documents|connexion|prive|privé)\b/.test(lowerBrief);
    const needsAiAssistant = /\b(assistant|ia|automatiser|automatisation|questions|support|chat)\b/.test(lowerBrief);
    const needsFutureBank = hasFutureBankIntent(positiveBrief);
    const needsAccountingApp = !needsFutureBank && !needsRestaurantManagementSaas && hasAccountingIntent(positiveBrief);
    const needsWellness = /\b(yoga|pilates|bien etre|bien-être|spa|massage|meditation|méditation|relaxation|soin|soins)\b/.test(lowerBrief);
    const needsWorkshops = /\b(atelier|ateliers|stage|stages|evenement|événement|evenements|événements|session speciale|session spéciale)\b/.test(lowerBrief);
    const needsPricing = /\b(tarif|tarifs|prix|formule|formules|abonnement|abonnements|offre|offres)\b/.test(lowerBrief);
    const needsGallery = /\b(photo|photos|image|images|galerie|portfolio|realisation|réalisation|realisations|réalisations|lieu|local|avant apres|avant-apres)\b/.test(lowerBrief);
    const needsImmersive = /\b(immersif|immersive|grande image|grandes images|plein ecran|plein écran|cinematic|impact|waouh|wow)\b/.test(lowerBrief);
    const needsKidsEducation = !needsAccountingApp && !needsPrivateSchool && !needsKidsFashion && isKidsEducationBrief(positiveBrief);
    const needsFutureExperience = hasLuminaCreativeIntent(positiveBrief);
    const needsDesignCraft = /\b(figma make|make de figma|canvas pro|lumina|super design|beau design|design premium|design unique|personnalite|personnalité|waouh|whaou|wow|surface|surfaces|4d|transparent|transparence|creative|creatif|créatif|artistique)\b/.test(lowerBrief);
    const needsSurfaceDesign = hasSurfaceDesignIntent(positiveBrief);
    const needsLuminaCreative = !needsAccountingApp && !needsFutureBank && !needsKidsEducation && needsFutureExperience;
    const needsLibraryConcept = /\b(bibliotheque|bibliothèque|mediatheque|médiathèque|livre|livres|lecture|lecteur|lecteurs|librairie|rayonnage|rayonnages|archives)\b/.test(lowerBrief);
    const needsUrbanFarmConcept = /\b(ferme urbaine|ferme verticale|agritech|agriculture urbaine|hydropon|aeropon|aéropon|serre|serres|culture eclair|culture éclair)\b/.test(lowerBrief);
    const needsGardenConcept = /\b(jardin|jardins|plante|plantes|balcon|balcons|vegetal|végétal|terrasse|capteur|capteurs|diagnostic ia|rendu 3d)\b/.test(lowerBrief);
    const needsCustomConcept = !needsAccountingApp && !needsFutureBank && !needsSeniorMobility && !needsPrivateSchool && !needsCrisisManagement && !needsFuneralHome && !needsEnergyRenovation && !needsRestaurantManagementSaas && !needsAutomotiveConcierge && !needsSportsRehab && !needsMedicalCenter && !needsKidsFashion && !needsKidsEducation && !needsTravelAgency && !needsLegal && !needsVeterinary && !needsSport && !needsHotel && !needsMenu && !needsArchitecture && !needsShop && !needsPortfolio && (needsLibraryConcept || needsUrbanFarmConcept || needsGardenConcept || needsFutureExperience || lowerBrief.length > 120);
    const customConceptName = needsLibraryConcept ? 'bibliotheque immersive' : needsUrbanFarmConcept ? 'ferme urbaine intelligente' : needsGardenConcept ? 'jardins suspendus intelligents' : activity;
    const inferredContext = inferOpenAiBriefContext(brief);
    const styleHint = inferredContext.styleHints[0] || inferredContext.moodHints[0] || 'direction moderne claire';
    const sectionHint = inferredContext.sectionHints.length ? inferredContext.sectionHints.join(', ') : 'sections utiles au parcours client';
    const nameBase = titleCase(activity.replace(/^site\s+/i, ''));
    const explicitName = normalizeText(
        (positiveBrief.match(/(?:appelee|appelée|appele|appelé|appelle|nommee|nommée|nomme|nommé|nom|marque)\s+["“']?([^.,\n]{2,48})/i) || [])[1] || '',
    )
        .replace(/\s+\b(?:avec|pour|qui|dont|sur|style)\b.*$/i, '')
        .replace(/["“”']/g, '')
        .trim();
    const genericExplicitName = /^(de\s+)?(vetements|vêtements|mode enfant|boutique enfant|conciergerie automobile|service de conciergerie|service automobile)\b/i.test(explicitName);
    const siteName = explicitName
        && !genericExplicitName
        ? titleCase(explicitName)
        : nameBase.length > 28
            ? `Studio ${nameBase.split(/\s+/)[0]}`
            : nameBase;
    const mainAction = needsAccountingApp ? 'Voir la démo IA' : needsFutureBank ? 'Ouvrir un coffre' : needsCrisisManagement ? 'Activer une cellule de crise' : needsFuneralHome ? 'Être accompagné maintenant' : needsEnergyRenovation ? 'Faire un prédiagnostic' : needsRestaurantManagementSaas ? 'Demander une démo' : needsSeniorMobility ? 'Réserver un trajet' : needsPrivateSchool ? 'Demander une visite' : needsSportsRehab ? 'Choisir mon parcours' : needsAutomotiveConcierge ? 'Demander une prise en charge' : needsMedicalCenter ? 'Demander un rendez-vous' : needsKidsFashion ? 'Voir les collections' : needsKidsEducation ? 'Commencer à jouer' : needsBridalCouture ? 'Réserver un essayage' : needsCustomConcept ? 'Créer mon concept' : needsTravelAgency ? 'Créer mon itinéraire' : needsBoxingClub ? 'Réserver un essai' : needsSport ? 'Réserver un essai' : needsLegal || needsVeterinary ? 'Prendre rendez-vous' : needsHotel ? 'Réserver une chambre' : needsMenu && needsAppointment ? 'Réserver une table' : needsMenu ? 'Voir la carte' : needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Demander une information';
    const pages = needsAccountingApp ? [
        { name: 'Aperçu logiciel', goal: 'Montrer l’interface, les fenêtres financières et les actions rapides.' },
        { name: 'Factures & devis', goal: 'Créer, envoyer, relancer et suivre les documents commerciaux.' },
        { name: 'Trésorerie', goal: 'Suivre chiffre d’affaires, dépenses, solde et prévisions.' },
        { name: 'Assistant IA', goal: 'Expliquer les dépenses, échéances, TVA et anomalies.' },
        { name: 'Automatisations', goal: 'Importer justificatifs, rapprocher transactions et préparer les échéances.' },
        { name: 'Sécurité', goal: 'Rassurer sur accès, données, exports et confidentialité.' },
        { name: 'Contact', goal: 'Prévoir une demande de démo ou cadrage projet.' },
    ] : needsEnergyRenovation ? [
        { name: 'Accueil', goal: 'Installer l’expertise rénovation énergétique sans cliché écologique.' },
        { name: 'Prédiagnostic', goal: 'Permettre une première qualification avant contact.' },
        { name: 'Type de logement', goal: 'Guider particuliers et copropriétés selon maison, appartement ou immeuble.' },
        { name: 'Problèmes & budget', goal: 'Orienter selon inconfort, facture, DPE, humidité, chauffage ou budget.' },
        { name: 'Travaux', goal: 'Présenter isolation, chauffage, ventilation, audit et rénovation globale.' },
        { name: 'Aides financières', goal: 'Expliquer MaPrimeRénov, CEE, copropriété et accompagnement dossier.' },
        { name: 'Déposer un dossier', goal: 'Permettre au visiteur de transmettre un dossier complet.' },
        { name: 'Certifications & garanties', goal: 'Rassurer avec RGE, assurances, suivi chantier et garanties.' },
        { name: 'Réalisations', goal: 'Montrer avant/après, gains, DPE et preuves concrètes.' },
    ] : needsRestaurantManagementSaas ? [
        { name: 'Produit', goal: 'Présenter le logiciel de gestion pour restaurateurs sans dashboard comptable.' },
        { name: 'Problèmes restaurateurs', goal: 'Partir des réservations, ruptures stock, fournisseurs, marges et plannings.' },
        { name: 'Réservations & stocks', goal: 'Expliquer tables, créneaux, niveaux de stock, alertes et demandes clients.' },
        { name: 'Fournisseurs & recettes', goal: 'Montrer commandes, fournisseurs, coûts matières et marges recettes.' },
        { name: 'Planning équipe', goal: 'Présenter horaires, équipes, services et absences.' },
        { name: 'Démo & formules', goal: 'Proposer une démonstration, afficher les formules et comparer les offres.' },
        { name: 'Multi-restaurants', goal: 'Créer un parcours pour groupes avec plusieurs établissements.' },
    ] : needsFuneralHome ? [
        { name: 'Accueil', goal: 'Présenter une maison funéraire humaine, discrète, moderne et apaisante.' },
        { name: 'Démarches', goal: 'Expliquer clairement les étapes avant, pendant et après les obsèques.' },
        { name: 'Cérémonies', goal: 'Présenter cérémonies civiles, religieuses et temps personnalisés.' },
        { name: 'Prévoyance', goal: 'Expliquer les contrats de prévoyance et l’anticipation sereine.' },
        { name: 'Accompagnement administratif', goal: 'Rassurer sur les documents, déclarations et démarches auprès des organismes.' },
        { name: 'Familles éloignées', goal: 'Prévoir les services à distance, visio, partage d’informations et coordination familiale.' },
        { name: 'Espace hommage privé', goal: 'Permettre aux proches de déposer messages, photos et souvenirs dans un espace protégé.' },
        { name: 'Contact & urgence', goal: 'Donner un accès immédiat, discret et rassurant à une personne disponible.' },
    ] : needsSeniorMobility ? [
        { name: 'Accueil', goal: 'Présenter le transport accompagné comme une solution humaine, rassurante et moderne.' },
        { name: 'Bénéficiaires', goal: 'Parler aux personnes âgées, familles, aidants et personnes à mobilité réduite.' },
        { name: 'Types de trajets', goal: 'Expliquer rendez-vous médicaux, courses, visites, loisirs et trajets réguliers.' },
        { name: 'Sécurité & accompagnement', goal: 'Montrer chauffeur accompagnateur, aide porte-à-porte et suivi famille.' },
        { name: 'Zones & tarifs', goal: 'Clarifier secteurs couverts, formules, trajets réguliers et devis.' },
        { name: 'Réserver un trajet', goal: 'Permettre aux familles de demander un trajet ponctuel ou régulier.' },
        { name: 'Partenariats', goal: 'Créer un parcours distinct pour établissements de santé et collectivités.' },
        { name: 'Contact', goal: 'Centraliser téléphone, formulaire et informations pratiques.' },
    ] : needsPrivateSchool ? [
        { name: 'Accueil', goal: 'Rassurer les parents et présenter clairement l’école privée multi-niveaux.' },
        { name: 'Projet pédagogique', goal: 'Expliquer la vision éducative, les valeurs et l’accompagnement des élèves.' },
        { name: 'Niveaux', goal: 'Distinguer maternelle, primaire et collège avec informations utiles.' },
        { name: 'Vie scolaire', goal: 'Présenter équipe, activités, restauration, horaires et organisation.' },
        { name: 'Futurs parents', goal: 'Guider vers visite, inscriptions, modalités et documents.' },
        { name: 'Familles inscrites', goal: 'Regrouper agenda, actualités, documents téléchargeables et informations pratiques.' },
        { name: 'Recrutement enseignants', goal: 'Séparer les candidatures enseignants du parcours familles.' },
        { name: 'Visite virtuelle', goal: 'Permettre de découvrir les espaces de l’école à distance.' },
        { name: 'Contact', goal: 'Donner accès aux coordonnées, demandes de visite et inscriptions.' },
    ] : needsCrisisManagement ? [
        { name: 'Accueil', goal: 'Présenter l’agence comme un partenaire stratégique en situation sensible.' },
        { name: 'Urgence crise', goal: 'Donner un accès rapide aux entreprises déjà en crise.' },
        { name: 'Scénarios de crise', goal: 'Distinguer crise médiatique, juridique, sociale, cyber et réputationnelle.' },
        { name: 'Méthodologie', goal: 'Expliquer diagnostic, cellule de crise, messages, coordination et stabilisation.' },
        { name: 'Expertises mobilisées', goal: 'Présenter communication, juridique, social, cyber, dirigeants et relations médias.' },
        { name: 'Dirigeants & directions', goal: 'Créer une section pour dirigeants, directions juridiques et équipes communication.' },
        { name: 'Formations préparation', goal: 'Présenter simulations, media training, protocoles et exercices de préparation.' },
        { name: 'Formulaire confidentiel', goal: 'Permettre une prise de contact discrète avec informations sensibles protégées.' },
        { name: 'Contact', goal: 'Centraliser téléphone prioritaire, disponibilité et demande confidentielle.' },
    ] : needsSportsRehab ? [
        { name: 'Accueil', goal: 'Présenter un centre de rééducation sportive technique, humain et orienté reprise.' },
        { name: 'Équipe pluridisciplinaire', goal: 'Présenter kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques et nutritionnistes.' },
        { name: 'Parcours blessure', goal: 'Orienter selon entorse, rupture, tendinite, genou, épaule, cheville, dos ou douleur récurrente.' },
        { name: 'Parcours par sport', goal: 'Adapter l’accompagnement au running, football, tennis, basket, cyclisme, combat ou sport collectif.' },
        { name: 'Objectif reprise', goal: 'Guider selon reprise amateur, retour compétition, prévention rechute ou performance durable.' },
        { name: 'Équipements & protocoles', goal: 'Montrer plateau technique, tests, outils de mesure et protocoles de rééducation.' },
        { name: 'Bilans & prévention', goal: 'Expliquer bilans fonctionnels, programmes de prévention et suivi des progrès.' },
        { name: 'Suivi à distance', goal: 'Présenter exercices, télé-suivi, contrôle des charges et coordination après les séances.' },
        { name: 'Contact', goal: 'Permettre une demande de rendez-vous, de bilan ou d’orientation parcours.' },
    ] : needsAutomotiveConcierge ? [
        { name: 'Accueil', goal: 'Installer le service haut de gamme et la demande de prise en charge.' },
        { name: 'Services', goal: 'Présenter entretien, nettoyage, contrôle technique, convoyage et suivi.' },
        { name: 'Forfaits', goal: 'Comparer les niveaux de prise en charge et les inclusions.' },
        { name: 'Fonctionnement', goal: 'Expliquer collecte, validation, suivi et restitution du véhicule.' },
        { name: 'Zones couvertes', goal: 'Clarifier les secteurs d’intervention et disponibilités.' },
        { name: 'Demande de prise en charge', goal: 'Qualifier véhicule, besoin, lieu, date et urgence.' },
        { name: 'Contact', goal: 'Permettre un échange direct et rassurant.' },
    ] : needsMedicalCenter ? [
        { name: 'Accueil', goal: 'Présenter le centre, les spécialités et les accès rapides patient.' },
        { name: 'Spécialités', goal: 'Expliquer généralistes, pédiatres, sages-femmes, psychologues et kinésithérapeutes.' },
        { name: 'Praticiens', goal: 'Afficher les profils filtrables par spécialité, disponibilité et langue parlée.' },
        { name: 'Rendez-vous', goal: 'Permettre une demande de rendez-vous claire sans effet hôpital froid.' },
        { name: 'Prévention santé', goal: 'Publier conseils, campagnes et informations utiles aux patients.' },
        { name: 'Rejoindre le centre', goal: 'Créer un espace distinct pour les professionnels intéressés.' },
        { name: 'Accès & urgence', goal: 'Afficher adresse, transports, horaires et contact en cas de demande urgente.' },
        { name: 'Contact', goal: 'Centraliser formulaire, téléphone et informations pratiques.' },
    ] : needsKidsFashion ? [
        { name: 'Accueil', goal: 'Présenter l’univers joyeux, durable et la boutique.' },
        { name: 'Collections', goal: 'Montrer vêtements, nouveautés et silhouettes 2 à 8 ans.' },
        { name: 'Matières', goal: 'Expliquer tissus, confort, résistance et entretien.' },
        { name: 'Engagements', goal: 'Valoriser durabilité, production et choix responsables.' },
        { name: 'Guide des tailles', goal: 'Aider les parents à choisir rapidement.' },
        { name: 'Boutique', goal: 'Guider vers catégories, produits, panier et commande.' },
        { name: 'Contact', goal: 'Répondre aux questions parents ou revendeurs.' },
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
    ] : needsBoxingClub ? [
        { name: 'Accueil', goal: 'Montrer ring, énergie, confiance et action d’essai.' },
        { name: 'Cours femmes', goal: 'Présenter boxe, self-défense, niveaux et formats.' },
        { name: 'Planning', goal: 'Afficher horaires, réservation et disponibilités.' },
        { name: 'Coachs', goal: 'Mettre en avant encadrement, pédagogie et sécurité.' },
        { name: 'Essai découverte', goal: 'Convertir vers une première séance rassurante.' },
        { name: 'Tarifs', goal: 'Comparer cartes, abonnements et formules.' },
        { name: 'Contact', goal: 'Réserver un essai ou poser une question.' },
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

    if (needsPricing && !needsRestaurantManagementSaas) {
        addPageBeforeContact({ name: 'Tarifs', goal: 'Présenter les prix, formules ou abonnements de manière lisible.' });
    }

    if (needsGallery && !needsEnergyRenovation) {
        addPageBeforeContact({ name: needsWellness ? 'Le lieu' : 'Galerie', goal: needsWellness ? 'Montrer l’ambiance, la lumière et les détails du lieu.' : 'Montrer les photos, réalisations ou preuves visuelles.' });
    }
    const recommendedServices = [
        { name: needsShop ? 'Boutique en ligne simple' : 'Site vitrine', reason: needsShop ? 'Le projet contient une intention de vente ou de catalogue.' : "Le besoin principal est d'être visible et clair en ligne.", priceFrom: needsShop ? 'À partir de 712 € selon le catalogue' : 'À partir de 392 €' },
        { name: 'Adresse e-mail professionnelle', reason: 'Une adresse contact@ renforce la confiance.', priceFrom: 'À partir de 49 €' },
        { name: 'Nom de domaine', reason: 'Un nom court facilite la mémorisation et le partage.', priceFrom: 'A cadrer selon disponibilité' },
    ];

    if (needsEnergyRenovation) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Prédiagnostic en ligne', reason: 'Guider le visiteur selon logement, problème, budget et urgence.', priceFrom: 'Projet spécifique' },
            { name: 'Formulaire estimation', reason: 'Transformer les demandes en dossiers qualifiés.', priceFrom: 'Projet spécifique' },
            { name: 'Dépôt de dossier', reason: 'Recevoir photos, factures, DPE et documents d’aides financières.', priceFrom: 'Projet spécifique' },
            { name: 'Pages aides financières', reason: 'Expliquer MaPrimeRénov, CEE et aides copropriétés sans jargon.', priceFrom: 'Inclus selon offre' },
            { name: 'Galerie avant / après', reason: 'Montrer réalisations, gains énergétiques et garanties.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsRestaurantManagementSaas) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Landing SaaS métier', reason: 'Expliquer le produit par problèmes concrets de restaurateurs.', priceFrom: 'Projet spécifique' },
            { name: 'Demande de démonstration', reason: 'Qualifier établissement, volume de réservations, stocks et équipe.', priceFrom: 'Projet spécifique' },
            { name: 'Comparatif formules', reason: 'Rendre les offres lisibles sans ressembler à un devis comptable.', priceFrom: 'Projet spécifique' },
            { name: 'Parcours multi-restaurants', reason: 'Créer un chemin séparé pour les groupes et besoins avancés.', priceFrom: 'Projet spécifique' },
            { name: 'Assistant IA métier', reason: 'Aider à orienter le restaurateur selon ses problèmes opérationnels.', priceFrom: 'Projet spécifique' },
        );
    }

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

    if (needsMedicalCenter) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Annuaire praticiens filtrable', reason: 'Permettre aux patients de filtrer par spécialité, disponibilité et langue parlée.', priceFrom: 'Projet spécifique' },
            { name: 'Demande de rendez-vous', reason: 'Orienter les patients vers une demande claire selon le praticien ou la spécialité.', priceFrom: 'Projet spécifique' },
            { name: 'Espace professionnels', reason: 'Séparer les candidatures et demandes de praticiens du parcours patient.', priceFrom: 'Projet spécifique' },
            { name: 'Prévention santé', reason: 'Publier conseils, campagnes et informations utiles sans ton hospitalier froid.', priceFrom: 'Inclus selon offre' },
            { name: 'Accès et urgence', reason: 'Rendre horaires, adresse, transports et contact urgent immédiatement lisibles.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsFuneralHome) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Parcours démarches obsèques', reason: 'Le brief demande une lecture claire avant, pendant et après les obsèques.', priceFrom: 'Projet spécifique' },
            { name: 'Espace hommage privé', reason: 'Permettre aux proches de déposer messages, photos et souvenirs dans un cadre protégé.', priceFrom: 'Projet spécifique' },
            { name: 'Accompagnement administratif', reason: 'Rassurer les familles sur les documents, déclarations et organismes.', priceFrom: 'Inclus selon offre' },
            { name: 'Services familles éloignées', reason: 'Prévoir coordination à distance, informations partagées et accès sécurisé.', priceFrom: 'Projet spécifique' },
            { name: 'Pages prévoyance', reason: 'Expliquer contrats et anticipation sans ton commercial agressif.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsSeniorMobility) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Formulaire trajet régulier', reason: 'Permettre aux familles de demander une prise en charge récurrente sans confusion.', priceFrom: 'Projet spécifique' },
            { name: 'Parcours partenariat', reason: 'Séparer les demandes des établissements de santé et collectivités.', priceFrom: 'Projet spécifique' },
            { name: 'Zones et tarifs', reason: 'Rassurer sur les secteurs couverts, formules et conditions de trajet.', priceFrom: 'Inclus selon offre' },
            { name: 'Espace familles simple', reason: 'Suivre demandes, documents, contacts utiles et trajets programmés.', priceFrom: 'Projet spécifique' },
            { name: 'Téléphone et contact rapide', reason: 'Le public doit pouvoir réserver ou être rappelé facilement.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsPrivateSchool) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Site institutionnel école', reason: 'Structurer les informations pour futurs parents, familles inscrites et enseignants.', priceFrom: 'Projet spécifique' },
            { name: 'Agenda et actualités', reason: 'Publier dates, événements et informations importantes pour les familles.', priceFrom: 'Projet spécifique' },
            { name: 'Documents téléchargeables', reason: 'Centraliser dossiers d’inscription, menus, horaires et documents utiles.', priceFrom: 'Projet spécifique' },
            { name: 'Visite virtuelle', reason: 'Aider les parents à découvrir les espaces avant une visite physique.', priceFrom: 'Projet spécifique' },
            { name: 'Formulaire inscription / recrutement', reason: 'Séparer demandes familles et candidatures enseignants.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsCrisisManagement) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Accès urgence crise', reason: 'Les entreprises déjà en crise doivent pouvoir agir sans chercher.', priceFrom: 'Projet spécifique' },
            { name: 'Formulaire confidentiel', reason: 'Le brief demande un contact discret adapté aux situations sensibles.', priceFrom: 'Projet spécifique' },
            { name: 'Scénarios de crise', reason: 'Structurer crise médiatique, juridique, sociale, cyber et réputationnelle.', priceFrom: 'Projet spécifique' },
            { name: 'Pages dirigeants / directions', reason: 'Séparer dirigeants, directions juridiques et équipes communication.', priceFrom: 'Inclus selon offre' },
            { name: 'Formations préparation', reason: 'Présenter simulations, media training et protocoles de préparation.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsSportsRehab) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Parcours blessure / sport', reason: 'Le visiteur doit choisir une orientation selon blessure, sport ou objectif de reprise.', priceFrom: 'Projet spécifique' },
            { name: 'Annuaire équipe pluridisciplinaire', reason: 'Présenter kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques et nutritionnistes.', priceFrom: 'Projet spécifique' },
            { name: 'Protocoles et bilans', reason: 'Rendre visibles tests, équipements, protocoles, bilans fonctionnels et progression.', priceFrom: 'Projet spécifique' },
            { name: 'Suivi à distance', reason: 'Permettre l’accompagnement entre deux séances avec exercices et contrôle des charges.', priceFrom: 'Projet spécifique' },
            { name: 'Programmes prévention', reason: 'Valoriser prévention des rechutes et retour durable au sport.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsAutomotiveConcierge) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Formulaire de prise en charge', reason: 'Qualifier véhicule, lieu, service et date en une demande claire.', priceFrom: 'Projet spécifique' },
            { name: 'Forfaits de service', reason: 'Rendre entretien, nettoyage, contrôle technique et convoyage lisibles.', priceFrom: 'Inclus selon offre' },
            { name: 'Google Maps et zones', reason: 'Clarifier les secteurs couverts et les conditions de déplacement.', priceFrom: 'Inclus selon offre' },
            { name: 'Espace client simple', reason: 'Suivre demandes, documents, rendez-vous et historique véhicule.', priceFrom: 'Projet spécifique' },
        );
    }

    if (needsKidsFashion) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Boutique en ligne simple', reason: 'Le brief demande une boutique avec collections et commande.', priceFrom: 'À partir de 712 €' },
            { name: 'Catalogue / collection', reason: 'Présenter vêtements, matières, tailles et nouveautés.', priceFrom: 'Projet spécifique' },
            { name: 'Guide des tailles', reason: 'Réduire les hésitations et retours avant achat.', priceFrom: 'Inclus selon offre' },
            { name: 'Galerie photos', reason: 'Montrer couleurs, coupes et détails de matières.', priceFrom: 'Inclus selon offre' },
        );
    }

    if (needsBoxingClub) {
        recommendedServices.splice(
            0,
            recommendedServices.length,
            { name: 'Planning de cours', reason: 'Les créneaux doivent être visibles et réservables rapidement.', priceFrom: 'Projet spécifique' },
            { name: 'Tunnel essai', reason: 'Transformer les visiteuses en première séance découverte.', priceFrom: 'Offre Pro' },
            { name: 'Espace membre simple', reason: 'Suivre réservations, abonnements et progression.', priceFrom: 'Projet spécifique' },
            { name: 'Galerie photos', reason: 'Montrer le ring, les coachs et l’ambiance réelle du club.', priceFrom: 'Inclus selon offre' },
        );
    } else if (needsSport) {
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

    if (needsClientSpace && !recommendedServices.some((service) => /\bespace client\b/.test(getServiceKey(service.name)))) {
        recommendedServices.push({ name: 'Espace client simple', reason: 'Le projet parle de suivi, documents ou accès privé.', priceFrom: 'Projet spécifique' });
    }

    if (needsAiAssistant && !recommendedServices.some((service) => /\bassistant ia metier\b/.test(getServiceKey(service.name)))) {
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
    const fallbackNarrativePlan = buildNarrativePlan(brief, profile);
    const fallbackVisualPlan = buildVisualPlan(brief, profile, fallbackNarrativePlan);

    const sanitized = {
        mode: 'fallback',
        sectorKey,
        projectType: needsAccountingApp ? 'Application comptable IA premium' : needsFutureBank ? 'Banque interplanétaire futuriste' : needsKidsEducation ? 'Application éducative immersive enfant' : needsCustomConcept ? 'Site concept métier immersif' : needsTravelAgency ? 'Site premium voyage sur mesure' : needsLegal ? 'Site juridique professionnel' : needsVeterinary ? 'Site clinique avec rendez-vous' : needsSport ? 'Plateforme fitness avec espace membre' : needsHotel ? 'Site hôtel avec réservation' : needsMenu ? 'Site restaurant avec réservation' : needsArchitecture ? 'Site premium pour studio d’architecture' : needsShop ? 'Boutique en ligne simple' : needsPortfolio ? 'CV ou portfolio en ligne' : needsAppointment ? 'Site avec prise de rendez-vous' : needsWordPress ? 'Site WordPress professionnel' : 'Site vitrine professionnel',
        layoutVariant: needsAccountingApp || needsFutureBank ? 'finance-os' : needsKidsEducation ? 'story-world' : needsTravelAgency || needsImmersive || needsHotel || needsUrbanFarmConcept ? 'cinematic-video' : needsArchitecture || needsGallery || needsLibraryConcept ? 'gallery-focus' : needsSport ? 'product-dashboard' : needsMenu || needsWellness ? 'warm-editorial' : needsCustomConcept ? (needsSurfaceDesign ? 'lumina-showcase' : 'luxury-asymmetric') : needsLuminaCreative && needsSurfaceDesign ? 'lumina-showcase' : needsShop ? 'classic-conversion' : 'luxury-asymmetric',
        visualMood: needsAccountingApp ? 'accounting-neural' : needsFutureBank ? 'orbital-finance' : needsKidsEducation ? 'kids-future' : needsCustomConcept ? 'concept-lumina' : needsLuminaCreative ? 'lumina-future' : needsTravelAgency ? 'travel-premium' : needsLegal ? 'legal-premium' : needsVeterinary ? 'care-premium' : needsSport ? 'performance-premium' : needsArchitecture ? 'image-led' : needsHotel ? 'premium' : needsMenu ? 'warm' : needsWellness ? 'beauty-wellness' : needsAiAssistant ? 'tech-premium' : needsPortfolio ? 'image-led' : needsDesignCraft ? 'crafted-premium' : 'crafted-premium',
        designVariant: lowerBrief.length % 5,
        visualSeed: `${activity}:${lowerBrief.length}:${mainAction}`,
        showGallery: needsKidsEducation || needsCustomConcept || needsLuminaCreative || needsDesignCraft || needsTravelAgency || needsHotel || needsArchitecture || needsMenu || needsPortfolio || needsGallery || Boolean(fallbackVisualPlan.gallery && fallbackVisualPlan.gallery.length),
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
            direction: needsAccountingApp ? 'Interface premium inspirée macOS/Figma : verre dépoli, grande scène logicielle, fenêtres flottantes, données financières et assistant IA.' : needsKidsEducation ? 'Univers produit immersif, futur doux, modules de jeu visibles, panneau parent et animations légères.' : needsCustomConcept ? (needsGardenConcept ? 'Direction Lumina végétale : balcon transformé en jardin suspendu, rendu 3D, capteurs vivants, lumière botanique et matières naturelles.' : `Direction Lumina métier : objet central ${customConceptName}, mise en scène immersive, modules flottants et explication pédagogique.`) : needsLuminaCreative ? 'Direction Lumina/Figma : surfaces transparentes, profondeur 4D, lumière contrôlée, modules flottants et composition propre au métier.' : needsTravelAgency ? 'Voyage premium immersif : grandes vidéos, destinations en profondeur, carte interactive, itinéraires et assistant IA visible.' : needsImmersive ? `Site immersif ${styleHint} avec grandes images, respiration visuelle et action claire.` : needsHotel ? 'Site immersif avec photos, chambres, disponibilité et réservation visible.' : needsArchitecture ? 'Portfolio architectural premium avec grands visuels, grille éditoriale et détails de matière.' : needsWellness ? `Site bien-être ${styleHint} avec visuels naturels, ateliers et réservation visible.` : needsShop ? 'Catalogue clair avec produits visibles et parcours de commande court.' : needsAppointment ? `Site ${styleHint} avec agenda ou contact visible dès le premier écran.` : `Direction Canvas pro métier : objet central visible, surface soignée, mise en page expressive et conversion claire.`,
            colors: needsAccountingApp ? 'Bleu nuit, turquoise IA, verre translucide, blanc lumineux, vert trésorerie et violet sécurité.' : needsKidsEducation ? 'Indigo profond, menthe lumineuse, corail doux, jaune soleil, lilas interactif et surfaces translucides.' : needsLibraryConcept ? 'Encre profonde, papier lumineux, or doux, bleu archive, verre translucide et blanc de lecture.' : needsUrbanFarmConcept ? 'Vert vivant, bleu capteur, noir serre, lumière végétale, verre translucide et blanc technique.' : needsGardenConcept ? 'Vert feuille, terre cuite douce, bleu capteur, verre translucide et lumière naturelle.' : needsLuminaCreative ? 'Fond profond, verre translucide, accents propres au métier, contraste blanc et halo mesuré.' : inferredContext.moodHints.includes('univers bleu nuit, halos, verre dépoli') ? 'Bleu nuit, verre dépoli, halos doux et contraste blanc.' : 'Fond sobre, contraste fort, une couleur d’accent pour les boutons et les informations importantes.',
            typography: needsAccountingApp ? 'Sans-serif premium, chiffres nets, libellés financiers courts et hiérarchie très aérée.' : needsKidsEducation ? 'Sans-serif ronde, titres expressifs, libellés courts et très lisibles.' : needsLuminaCreative ? 'Sans-serif premium, titres nets, textes courts, grande respiration et aucun effet magazine.' : 'Titres francs, textes courts, lecture facile sur mobile.',
            layout: needsAccountingApp ? 'Finance OS immersif : hero logiciel, aperçu produit, assistant IA, automatisations, intégrations bancaires, sécurité, témoignages, FAQ et CTA.' : needsKidsEducation ? 'Story-world applicatif : hero produit, écran enfant, cartes jeux/histoires/comptines, espace parent, modules courts.' : needsCustomConcept ? (needsLibraryConcept ? 'Hero salle de lecture, rayonnages, parcours culturel, espaces immersifs et CTA visite.' : needsUrbanFarmConcept ? 'Hero ferme verticale, serre, capteurs, production locale, preuves et CTA partenariat.' : needsGardenConcept ? 'Hero balcon vivant, diagnostic IA, configurateur 3D, abonnement plantes, suivi capteurs, réalisations et CTA.' : 'Hero objet métier, diagnostic, simulation, offres, suivi, preuves et CTA.') : needsLuminaCreative ? 'Showcase premium : hero surface ou scène sectorielle, image métier en profondeur, modules flottants utiles, preuves et CTA.' : needsTravelAgency ? 'Hero vidéo, destinations immersives, carte interactive, itinéraires, assistant IA, témoignages et CTA final.' : needsHotel ? 'Hero photo, chambres, tarifs, galerie, localisation, avis, réservation.' : needsArchitecture ? 'Hero visuel, projets sélectionnés, services, philosophie, témoignages, contact.' : `Hero focal sur l'objet métier, ${sectionHint}, preuve visuelle, moment mémorable, puis contact.`,
        },
        visualConcept: {
            heroComposition: needsAccountingApp ? 'Immense mockup logiciel flottant avec fenêtres macOS superposées, factures, documents, graphiques, notifications et assistant IA.' : needsKidsEducation ? 'Premier écran comme un monde applicatif avec écran enfant, cartes jeux, histoires, comptines et panneau parent.' : needsCustomConcept ? (needsLibraryConcept ? 'Grande salle de lecture avec rayonnages, livres papier, lumière douce et modules numériques discrets autour du parcours visiteur.' : needsUrbanFarmConcept ? 'Ferme verticale lumineuse avec plantes, bacs hydroponiques, capteurs, données de croissance et action partenariat.' : needsGardenConcept ? 'Balcon miniature en 3D flottante, plantes suspendues, bulles capteurs, diagnostic IA et carte abonnement autour de la scène.' : `Objet central ${customConceptName} en scène flottante, modules de diagnostic, simulation et preuve visuelle.`) : needsLuminaCreative ? 'Scène immersive avec visuel métier en profondeur, surface premium, modules flottants utiles et action claire.' : needsTravelAgency ? 'Grand hero vidéo avec destination forte, carte flottante, itinéraire en cours et assistant IA voyage.' : needsImmersive ? 'Grand hero visuel pleine largeur avec ambiance sectorielle, promesse courte et réservation visible.' : needsHotel ? 'Hero immersif avec photo forte, disponibilité et appel à réserver.' : needsArchitecture ? 'Grand visuel architectural, typographie forte et CTA discret mais visible.' : `Grande scène autour de ${activity}, avec objet ou geste métier en premier plan, surface premium et CTA intégré sans écraser le visuel.`,
            ambience: needsAccountingApp ? 'Futuriste, premium, transparent, profond et entièrement orienté pilotage financier.' : needsKidsEducation ? 'Futur doux, ludique, immersif et rassurant pour les parents.' : needsCustomConcept ? 'Futuriste, vivant, pédagogique et très visuel.' : needsLuminaCreative ? 'Futuriste, premium, transparent, lisible, profond et désirable.' : needsTravelAgency ? 'Cinématique, inspirante, haut de gamme et orientée exploration.' : needsHotel ? 'Premium accueillant, rassurant et sensoriel.' : needsArchitecture ? 'Minimal, lumineux, haut de gamme et orienté réalisations.' : needsWellness ? `Naturelle, calme, sensorielle et orientée réservation, avec ${styleHint}.` : needsAppointment ? `Élégant, local et orienté rendez-vous, avec ${styleHint}.` : `Moderne, clair et commercial, avec ${styleHint}.`,
            colorPalette: needsAccountingApp ? ['bleu nuit logiciel', 'turquoise IA', 'verre dépoli', 'blanc lumineux', 'vert trésorerie', 'violet sécurité'] : needsKidsEducation ? ['nuit indigo', 'menthe interactive', 'jaune soleil', 'corail doux', 'lilas futur', 'verre translucide'] : needsLibraryConcept ? ['encre profonde', 'papier lumineux', 'or doux', 'bleu archive', 'verre translucide', 'blanc lecture'] : needsUrbanFarmConcept ? ['vert vivant', 'bleu capteur', 'noir serre', 'lumière végétale', 'verre translucide'] : needsGardenConcept ? ['vert feuille', 'terre cuite douce', 'bleu capteur', 'verre translucide', 'lumière naturelle'] : needsLuminaCreative ? ['fond profond', 'verre translucide', 'accent métier', 'halo mesuré', 'blanc optique'] : ['fond profond ou clair selon secteur', 'accent lumineux pour les actions', 'contraste fort pour la lecture'],
            imageKeywords: needsAccountingApp ? ['logiciel comptable futuriste', 'factures flottantes', 'assistant IA financier', 'tableaux financiers', 'intégration bancaire'] : needsKidsEducation ? ['interface app enfant', 'univers educatif futur doux', 'cartes jeux histoires comptines', 'espace parent'] : needsCustomConcept ? (needsLibraryConcept ? ['bibliotheque moderne', 'rayonnages de livres', 'salle de lecture', 'livres papier', 'espace culturel'] : needsUrbanFarmConcept ? ['ferme verticale', 'hydroponie', 'serre urbaine', 'plantes sous lumière', 'capteurs agricoles'] : needsGardenConcept ? ['jardin suspendu balcon', 'plantes en pot design', 'capteurs végétaux', 'rendu 3D balcon', 'abonnement plantes'] : [customConceptName, 'objet métier central', 'simulation visuelle', 'assistant IA métier']) : needsTravelAgency ? ['destination immersive', 'itinéraire sur mesure', 'carte voyage interactive', 'assistant IA voyage'] : [activity, needsHotel ? 'chambre lumineuse' : needsArchitecture ? 'architecture intérieure projet design' : needsAppointment ? 'service en action' : 'objet métier en gros plan', 'preuve visuelle réelle'],
            layoutSignature: needsAccountingApp ? 'Finance OS immersif avec grandes fenêtres superposées, panneaux flottants et sections toutes distinctes.' : needsKidsEducation ? 'Story-world avec modules applicatifs, progression parent et parcours lumineux entre les activités.' : needsCustomConcept ? 'Showcase concept avec objet central, diagnostic, simulation, suivi intelligent et preuves non répétitives.' : needsLuminaCreative ? 'Showcase Lumina avec surfaces de verre, profondeur 4D, modules non répétitifs et narration propre au secteur.' : needsTravelAgency ? 'Parcours voyage cinématique avec vidéo, destinations, carte, itinéraires, IA et témoignages.' : needsHotel ? 'Parcours réservation avec galerie et localisation visibles.' : needsArchitecture ? 'Portfolio visuel avec cartes projets, détails et navigation élégante.' : 'Aperçu premium avec sections courtes, preuves et contact rapide.',
            microInteractions: needsAccountingApp ? ['graphiques qui se dessinent', 'documents qui flottent', 'assistant IA qui signale les échéances', 'widgets bancaires qui pulsent'] : needsKidsEducation ? ['cartes jeux qui respirent', 'progression parent animée', 'parcours lumineux entre les activités'] : needsCustomConcept ? ['objet central qui flotte', 'diagnostic IA qui révèle les contraintes', 'données de suivi qui pulsent', 'simulation avant/après'] : needsLuminaCreative ? ['surface principale qui flotte doucement', 'reflets transparents au survol', 'modules métier qui apparaissent en profondeur'] : ['bouton principal lumineux', 'cartes flottantes', 'transition douce entre sections'],
            signatureMoment: needsAccountingApp ? 'Une facture se transforme en graphique vivant pendant que l’assistant IA prépare les échéances.' : needsKidsEducation ? 'Un parcours lumineux relie jeux, histoires, comptines et suivi parent comme une carte d’aventure.' : needsCustomConcept ? (needsGardenConcept ? 'Le balcon miniature se remplit de plantes, capteurs et rendu 3D autour d’un diagnostic IA.' : `L’objet central ${customConceptName} devient une scène explicative que le visiteur comprend en quelques secondes.`) : needsLuminaCreative ? `Une surface Lumina met ${activity} au centre avec modules flottants, lumière et preuve métier.` : needsTravelAgency ? 'Une carte vivante relie destination, itinéraire, budget et assistant IA voyage.' : needsHotel ? 'La vue du séjour devient l’écran principal, avec disponibilité et réservation intégrées.' : needsArchitecture ? 'Une villa ou une maquette matière devient le décor focal du premier écran.' : `Un détail fort de ${activity} devient le repère visuel de toute la maquette.`,
            wowFactor: needsAccountingApp ? 'Le visiteur voit immédiatement un logiciel comptable nouvelle génération, pas un template SaaS Bootstrap.' : needsKidsEducation ? 'Le premier écran ressemble à un produit éducatif vivant, pas à une vitrine générique.' : needsCustomConcept ? 'Le visiteur comprend un métier rare grâce à une scène visuelle qu’il n’aurait pas imaginée seul.' : needsLuminaCreative ? 'Le visiteur voit une expérience nouvelle génération adaptée au métier, pas une page magazine.' : `Le premier écran semble dessiné pour ${activity}, avec une mise en valeur impossible à confondre avec un autre métier.`,
        },
        narrativePlan: fallbackNarrativePlan,
        visualPlan: fallbackVisualPlan,
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

    if (needsEnergyRenovation) {
        const energySiteName = /\b(immobili|agence|shop|boutique|mode|restaurant|auto|conciergerie|compta|finance)\b/i.test(siteName)
            ? 'Énergie Habitat'
            : siteName;

        Object.assign(sanitized, {
            sectorKey: 'energy-renovation',
            projectType: 'Site rénovation énergétique avec prédiagnostic',
            layoutVariant: 'classic-conversion',
            visualMood: 'energy-renovation-expert',
            showGallery: true,
            siteName: energySiteName,
            slogan: 'Rénover mieux, décider clairement.',
            summary: 'Kirby reconstruit une proposition pour une entreprise de rénovation énergétique destinée aux particuliers et copropriétés.',
            valueProposition: 'Un site expert qui guide selon le logement, les problèmes, le budget et le niveau de dossier, avec prédiagnostic, estimation, aides, certifications, réalisations et garanties.',
            positioning: {
                audience: 'Particuliers, propriétaires, bailleurs, syndics et copropriétés qui veulent réduire leurs consommations sans se perdre dans les aides.',
                promise: 'Comprendre les travaux utiles, simuler une première orientation et transmettre un dossier complet.',
                tone: 'Expert, rassurant, pédagogique, moderne et sans clichés verts.',
                differentiator: 'Le parcours commence par logement, problèmes et budget avant de parler isolation, chauffage, ventilation, audit et aides.',
            },
            styleGuide: {
                direction: 'Rénovation énergétique experte : coupe de logement, carte thermique, DPE, étapes chantier, badges RGE et modules de dossier.',
                colors: 'Bleu ardoise, ambre thermique, blanc technique, graphite, cuivre doux et vert sauge très discret.',
                typography: 'Sans-serif très lisible, titres pédagogiques, chiffres et labels de performance bien hiérarchisés.',
                layout: 'Hero prédiagnostic, tri par logement, problèmes, budget, étapes, aides financières, certifications, réalisations, garanties et dépôt de dossier.',
            },
            visualConcept: {
                heroComposition: 'Maison en coupe avec zones de déperdition, jauge DPE, budget, aides estimées et CTA prédiagnostic.',
                ambience: 'Technique, rassurante, premium et lumineuse, sans feuilles décoratives ni tout-vert.',
                colorPalette: ['bleu ardoise', 'ambre thermique', 'blanc technique', 'graphite', 'cuivre doux', 'vert sauge discret'],
                imageKeywords: ['rénovation énergétique', 'isolation maison', 'audit énergétique', 'pompe à chaleur', 'chantier rénovation logement'],
                layoutSignature: 'Parcours guidé logement-problème-budget avec preuves RGE, aides, étapes projet et dossier complet.',
                microInteractions: ['jauge DPE qui progresse', 'problème logement sélectionnable', 'checklist dossier qui se complète'],
                signatureMoment: 'Le visiteur voit son logement passer de passoire thermique à projet cadré avec aides, travaux et garanties.',
                wowFactor: 'On comprend immédiatement la rénovation énergétique complète : pas une agence immobilière, pas un artisan vague.',
            },
            siteModel: {
                name: 'Direction rénovation énergétique experte',
                description: 'Un site qui oriente particuliers et copropriétés vers prédiagnostic, estimation, aides, travaux et dépôt de dossier.',
                sections: ['Prédiagnostic', 'Type de logement', 'Problèmes & budget', 'Travaux', 'Aides financières', 'Certifications', 'Réalisations', 'Dossier complet'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Prédiagnostic guidé', text: 'Le visiteur choisit logement, problème, budget et objectif avant de demander une estimation.' },
                { title: 'Aides & étapes claires', text: 'Audit, devis, financement, chantier et garanties sont expliqués sans jargon.' },
                { title: 'Preuves de confiance', text: 'Certifications, réalisations avant/après, gains DPE et garanties rendent l’expertise concrète.' },
            ],
            services: [
                { name: 'Prédiagnostic logement', description: 'Questions par logement, problèmes, budget, DPE et priorités.' },
                { name: 'Aides financières', description: 'MaPrimeRénov, CEE, copropriété et accompagnement dossier.' },
                { name: 'Dépôt de dossier', description: 'Transmission des photos, DPE, factures, plans et documents utiles.' },
            ],
            ctas: ['Faire un prédiagnostic', 'Demander une estimation', 'Transmettre mon dossier'],
            seo: {
                keywords: ['rénovation énergétique', 'audit énergétique', 'isolation chauffage ventilation', 'aides financières rénovation', 'entreprise RGE'],
                searchExpressions: ['rénovation énergétique + ville', 'audit énergétique maison copropriété', 'aides rénovation énergétique', 'entreprise RGE isolation chauffage'],
                titles: [`${energySiteName} - Rénovation énergétique`, 'Prédiagnostic, aides, travaux et garanties'],
                metaDescription: `${energySiteName} accompagne particuliers et copropriétés : isolation, chauffage, ventilation, audit, aides financières, certifications, réalisations, garanties, prédiagnostic et dossier complet.`,
            },
            seoKeywords: ['rénovation énergétique', 'audit énergétique', 'isolation', 'chauffage', 'ventilation', 'aides financières', 'RGE'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${energySiteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site rénovation énergétique avec prédiagnostic',
            'Slogan proposé : Rénover mieux, décider clairement.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Faire un prédiagnostic, Demander une estimation, Transmettre mon dossier',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsRestaurantManagementSaas) {
        const restaurantSaasSiteName = /\b(restaurant gastronomique|menu|carte|chef|table|agence|immobili|compta|finance|facture)\b/i.test(siteName)
            ? 'Brigade Pilot'
            : siteName;

        Object.assign(sanitized, {
            sectorKey: 'restaurant-management-saas',
            projectType: 'Site SaaS gestion restaurateurs',
            layoutVariant: 'classic-conversion',
            visualMood: 'restaurant-ops-saas',
            showGallery: true,
            siteName: restaurantSaasSiteName,
            slogan: 'Piloter le service, sans friction.',
            summary: 'Kirby reconstruit une proposition de site public pour un logiciel de gestion destiné aux restaurateurs.',
            valueProposition: 'Un site produit qui explique réservations, stocks, fournisseurs, coûts de recettes, plannings et multi-restaurants par problèmes concrets, sans ressembler à un dashboard comptable.',
            positioning: {
                audience: 'Restaurateurs indépendants, responsables d’exploitation et groupes possédant plusieurs restaurants.',
                promise: 'Voir comment le logiciel simplifie le service, les achats, les marges et les équipes avant de demander une démo.',
                tone: 'Moderne, opérationnel, chaleureux, simple à comprendre et orienté terrain.',
                differentiator: 'La proposition parle des moments réels du restaurateur : rush, stocks, fournisseurs, coûts recettes, planning et pilotage multi-sites.',
            },
            styleGuide: {
                direction: 'SaaS restaurateur opérationnel : modules service, stock, fournisseur, recette et planning, avec codes cuisine contemporaine sans dashboard comptable dominant.',
                colors: 'Graphite chaud, inox clair, bleu service, cuivre doux, crème lisible et menthe statut en accent.',
                typography: 'Sans-serif produit très lisible, titres courts, labels métiers et chiffres de marge discrets.',
                layout: 'Hero produit public, problèmes restaurateurs, fonctionnalités par usage, démonstration, formules, comparatif, multi-restaurants et contact commercial.',
            },
            visualConcept: {
                heroComposition: 'Plan de salle stylisé, tickets de réservation, niveaux de stock, recette coûtée et planning équipe dans des modules légers.',
                ambience: 'Produit digital moderne, terrain restaurant, clair et humain, sans ambiance comptable froide.',
                colorPalette: ['graphite chaud', 'inox clair', 'bleu service', 'cuivre doux', 'crème lisible', 'menthe statut'],
                imageKeywords: ['logiciel restaurateur', 'réservations restaurant', 'stock cuisine', 'fournisseurs restaurant', 'planning équipe restaurant'],
                layoutSignature: 'Landing SaaS par problèmes : réservations, stocks, fournisseurs, coûts recettes, plannings, formules et multi-restaurants.',
                microInteractions: ['problème restaurateur sélectionnable', 'comparatif formules actif', 'module multi-sites qui se déplie'],
                signatureMoment: 'Le restaurateur voit une soirée de service se stabiliser : tables, stock, coûts recettes et équipe sont alignés.',
                wowFactor: 'On comprend le logiciel spécial restaurateurs, pas un site de restaurant ni une comptabilité générique.',
            },
            siteModel: {
                name: 'Direction SaaS restaurateurs',
                description: 'Une landing produit qui convertit vers démo, explique les fonctionnalités par problèmes et traite les groupes multi-restaurants.',
                sections: ['Problèmes restaurateurs', 'Réservations', 'Stocks & fournisseurs', 'Coûts recettes', 'Planning équipe', 'Formules', 'Multi-restaurants', 'Démo'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Problèmes du service', text: 'Réservations, stocks, fournisseurs, recettes et planning sont présentés comme des situations concrètes.' },
                { title: 'Produit simple à adopter', text: 'La démo montre les bénéfices sans imposer un tableau comptable froid.' },
                { title: 'Indépendants & groupes', text: 'Les formules et besoins multi-restaurants sont comparés dans un parcours séparé.' },
            ],
            services: [
                { name: 'Réservations', description: 'Tables, créneaux, demandes clients et anticipation du service.' },
                { name: 'Stocks & fournisseurs', description: 'Niveaux de stock, commandes, fournisseurs et alertes utiles.' },
                { name: 'Coûts recettes & planning', description: 'Marge matière, fiches recettes, équipes, horaires et multi-sites.' },
            ],
            ctas: ['Demander une démo', 'Voir les formules', 'Comparer les offres'],
            seo: {
                keywords: ['logiciel restaurateur', 'gestion restaurant', 'stock restaurant', 'coût recette restaurant', 'planning équipe restaurant'],
                searchExpressions: ['logiciel gestion restaurant', 'application stock restaurant fournisseur', 'logiciel coût recette restaurant', 'planning équipe restaurant SaaS'],
                titles: [`${restaurantSaasSiteName} - Logiciel de gestion restaurateurs`, 'Réservations, stocks, recettes, équipes et multi-restaurants'],
                metaDescription: `${restaurantSaasSiteName} aide les restaurateurs à gérer réservations, stocks, fournisseurs, coûts de recettes, plannings d’équipe, formules, démonstrations, comparatifs et groupes multi-restaurants.`,
            },
            seoKeywords: ['logiciel restaurateur', 'gestion restaurant', 'réservations', 'stocks fournisseurs', 'coûts recettes', 'planning équipe'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${restaurantSaasSiteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site SaaS gestion restaurateurs',
            'Slogan proposé : Piloter le service, sans friction.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander une démo, Voir les formules, Comparer les offres',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsFuneralHome) {
        const funeralSiteName = /^studio\b/i.test(siteName) || /\b(hotel|hôtel|luxe|mobilite|mobilité|trajet|transport|senior|pmr|conciergerie|auto|restaurant|renovation|energie|cabinet|avocat|fitness)\b/i.test(siteName)
            ? 'Maison Clarté'
            : siteName;

        Object.assign(sanitized, {
            sectorKey: 'funeral-home',
            projectType: 'Site maison funéraire nouvelle génération',
            layoutVariant: 'classic-conversion',
            visualMood: 'funeral-home-serene',
            showGallery: false,
            siteName: funeralSiteName,
            slogan: 'Présence calme, démarches claires.',
            summary: 'Kirby reconstruit une proposition pour une maison funéraire humaine, discrète et moderne avec espace hommage privé.',
            valueProposition: 'Un site apaisant et digne qui guide les familles avant, pendant et après les obsèques, présente cérémonies, prévoyance, administratif, services à distance et espace hommage privé.',
            positioning: {
                audience: 'Familles endeuillées, proches éloignés et personnes souhaitant anticiper leurs volontés.',
                promise: 'Comprendre les démarches, choisir une cérémonie et être accompagné avec douceur, discrétion et clarté.',
                tone: 'Apaisant, digne, humain, moderne, lumineux et jamais froid.',
                differentiator: 'Le site met en avant l’accompagnement, les démarches et l’espace hommage privé sans codes noirs, marbre ou ambiance institutionnelle froide.',
            },
            styleGuide: {
                direction: 'Maison funéraire nouvelle génération : lumière douce, ivoire, sauge, bleu brume, lignes calmes, espace hommage privé et parcours démarches très lisible.',
                colors: 'Ivoire chaud, sauge doux, bleu brume, argile claire, doré discret et gris plume.',
                typography: 'Sans-serif douce et très lisible, titres sobres, textes courts et rassurants.',
                layout: 'Hero accompagnement, démarches avant/pendant/après, cérémonies, prévoyance, administratif, familles éloignées, espace hommage privé et contact discret.',
            },
            visualConcept: {
                heroComposition: 'Scène lumineuse et sobre avec chemin de démarches, carte cérémonie, capsule hommage privé et contact discret.',
                ambience: 'Apaisante, digne, moderne et chaleureuse, sans noir dominant, sans marbre et sans froideur médicale.',
                colorPalette: ['ivoire chaud', 'sauge doux', 'bleu brume', 'argile claire', 'doré discret', 'gris plume'],
                imageKeywords: ['maison funéraire lumineuse', 'accompagnement familles', 'cérémonie hommage', 'souvenirs photos messages', 'démarches obsèques'],
                layoutSignature: 'Parcours famille avec démarches, cérémonies, prévoyance, administratif, distance et hommage privé.',
                microInteractions: ['étapes démarches qui se déplient', 'espace hommage verrouillé', 'souvenirs déposés avec douceur'],
                signatureMoment: 'La famille voit les étapes essentielles, puis accède à un espace hommage privé pour messages, photos et souvenirs.',
                wowFactor: 'Le visiteur comprend immédiatement une maison funéraire moderne, humaine et digne.',
            },
            siteModel: {
                name: 'Direction maison funéraire apaisée',
                description: 'Une structure sobre et complète pour accompagner les familles, expliquer les démarches et ouvrir un espace hommage privé.',
                sections: ['Démarches accompagnées', 'Cérémonies', 'Prévoyance', 'Administratif', 'Familles éloignées', 'Espace hommage privé'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Démarches accompagnées', text: 'Les étapes avant, pendant et après les obsèques sont expliquées simplement, sans surcharge.' },
                { title: 'Cérémonies et prévoyance', text: 'Cérémonies civiles ou religieuses, volontés et contrats de prévoyance sont présentés avec délicatesse.' },
                { title: 'Hommage privé', text: 'Les proches peuvent déposer messages, photos et souvenirs dans un espace protégé.' },
            ],
            services: [
                { name: 'Organisation des obsèques', description: 'Accompagnement humain pour les démarches, choix de cérémonie et coordination.' },
                { name: 'Administratif & prévoyance', description: 'Aide aux documents, déclarations, contrats et anticipation des volontés.' },
                { name: 'Espace hommage privé', description: 'Messages, photos, souvenirs et partage discret pour les proches.' },
            ],
            ctas: ['Être accompagné maintenant', 'Créer un espace hommage', 'Préparer une prévoyance'],
            seo: {
                keywords: ['maison funéraire', 'pompes funèbres modernes', 'organisation obsèques', 'cérémonie civile religieuse', 'espace hommage privé'],
                searchExpressions: ['maison funéraire accompagnement humain', 'organisation obsèques démarches', 'espace hommage privé messages photos', 'contrat prévoyance obsèques'],
                titles: [`${funeralSiteName} - Maison funéraire humaine et moderne`, 'Obsèques, démarches, cérémonies et hommage privé'],
                metaDescription: `${funeralSiteName} accompagne les familles avant, pendant et après les obsèques avec démarches claires, cérémonies, prévoyance, administratif, services à distance et espace hommage privé.`,
            },
            seoKeywords: ['maison funéraire', 'obsèques', 'cérémonie', 'prévoyance', 'hommage privé', 'accompagnement administratif'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${funeralSiteName}.`,
            'Besoin de départ : maison funéraire moderne avec démarches, cérémonies, prévoyance, administratif, familles éloignées et espace hommage privé.',
            'Type de projet : site maison funéraire nouvelle génération',
            'Slogan proposé : Présence calme, démarches claires.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Être accompagné maintenant, Créer un espace hommage, Préparer une prévoyance',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsSeniorMobility) {
        Object.assign(sanitized, {
            sectorKey: 'senior-mobility',
            projectType: 'Site service de transport accompagné',
            layoutVariant: 'classic-conversion',
            visualMood: 'senior-mobility-modern',
            showGallery: true,
            slogan: 'Bouger accompagné, rester autonome.',
            summary: 'Kirby reconstruit une proposition pour un service de transport accompagné destiné aux personnes âgées, familles, établissements de santé et collectivités.',
            valueProposition: 'Un site rassurant, lisible et moderne qui explique les trajets, la sécurité, l’accompagnement humain, les zones, les tarifs, les réservations régulières et les partenariats sans ambiance médicale triste.',
            positioning: {
                audience: 'Personnes âgées ou à mobilité réduite, familles, aidants, établissements de santé et collectivités.',
                promise: 'Réserver un trajet accompagné ponctuel ou régulier, avec une équipe humaine et fiable.',
                tone: 'Rassurant, humain, clair, moderne, chaleureux et jamais médicalisé.',
                differentiator: 'La maquette distingue clairement les familles qui réservent un trajet et les structures qui demandent un partenariat.',
            },
            styleGuide: {
                direction: 'Mobilité senior moderne : fond bleu pétrole lumineux, accents vert sauge et corail doux, modules de trajet, carte de zone, badges sécurité et CTA visibles.',
                colors: 'Bleu pétrole, vert sauge, ivoire lumineux, corail doux, gris ardoise et jaune signal discret.',
                typography: 'Sans-serif très lisible, titres directs, grands contrastes et textes courts pour un public familial.',
                layout: 'Hero rassurant, publics séparés, types de trajets, sécurité, zones et tarifs, demande de trajet régulier, partenariat, contact.',
            },
            visualConcept: {
                heroComposition: 'Scène de trajet accompagné avec carte de ville, itinéraire doux, conducteur accompagnateur, repères sécurité et deux CTA : trajet régulier et partenariat.',
                ambience: 'Humaine, rassurante, active, moderne et lumineuse, sans codes hospitaliers.',
                colorPalette: ['bleu pétrole', 'vert sauge', 'ivoire lumineux', 'corail doux', 'gris ardoise', 'jaune signal discret'],
                imageKeywords: ['transport accompagné senior', 'chauffeur accompagnateur', 'personne âgée mobilité', 'véhicule accessible', 'famille aidant'],
                layoutSignature: 'Parcours par publics avec modules de trajet, sécurité, carte zones, tarifs et deux chemins de conversion séparés.',
                microInteractions: ['trajet régulier sélectionnable', 'zone couverte qui s’active', 'badge accompagnement porte-à-porte'],
                signatureMoment: 'La famille voit un trajet régulier se construire de domicile à destination avec accompagnement humain visible.',
                wowFactor: 'Le visiteur comprend immédiatement qu’il s’agit de mobilité accompagnée senior, pas de conciergerie automobile.',
            },
            siteModel: {
                name: 'Direction mobilité accompagnée',
                description: 'Un site clair pour réserver des trajets accompagnés et ouvrir des partenariats avec structures publiques ou santé.',
                sections: ['Hero trajet accompagné', 'Publics', 'Types de trajets', 'Sécurité', 'Zones & tarifs', 'Trajet régulier', 'Partenariats'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Trajets accompagnés', text: 'Rendez-vous médicaux, courses, visites, loisirs et trajets réguliers sont expliqués sans jargon.' },
                { title: 'Sécurité humaine', text: 'Chauffeur accompagnateur, aide porte-à-porte et suivi famille créent la confiance.' },
                { title: 'Familles & partenaires', text: 'Les familles réservent un trajet régulier, les établissements demandent un partenariat.' },
            ],
            services: [
                { name: 'Trajet ponctuel', description: 'Accompagnement pour rendez-vous, courses, démarches ou visites.' },
                { name: 'Trajet régulier', description: 'Planification récurrente pour soins, activités ou visites familiales.' },
                { name: 'Partenariats', description: 'Parcours dédié aux établissements de santé et collectivités.' },
            ],
            ctas: ['Réserver un trajet', 'Demander un trajet régulier', 'Devenir partenaire'],
            seo: {
                keywords: ['transport accompagné senior', 'transport personnes âgées', 'transport mobilité réduite', 'chauffeur accompagnateur', 'trajet régulier senior'],
                searchExpressions: ['transport accompagné personnes âgées', 'transport mobilité réduite + ville', 'trajet régulier senior famille', 'partenariat transport santé collectivité'],
                titles: [`${siteName} - Transport accompagné senior`, 'Trajets réguliers, sécurité et partenariats'],
                metaDescription: `${siteName} accompagne les personnes âgées ou à mobilité réduite avec trajets ponctuels ou réguliers, sécurité, aide humaine, zones couvertes, tarifs et partenariats.`,
            },
            seoKeywords: ['transport accompagné', 'personnes âgées', 'mobilité réduite', 'trajet régulier', 'partenariat santé'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site service de transport accompagné',
            'Slogan proposé : Bouger accompagné, rester autonome.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Réserver un trajet, Demander un trajet régulier, Devenir partenaire',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsPrivateSchool) {
        Object.assign(sanitized, {
            sectorKey: 'private-school',
            projectType: 'Site institutionnel école privée',
            layoutVariant: 'classic-conversion',
            visualMood: 'private-school-modern',
            showGallery: true,
            slogan: 'Grandir, apprendre, s’épanouir.',
            summary: 'Kirby reconstruit une proposition de site institutionnel pour une école privée de la maternelle au collège.',
            valueProposition: 'Un site chaleureux, éducatif et professionnel qui rassure les parents, structure les niveaux, et sépare futurs parents, familles inscrites et enseignants candidats.',
            positioning: {
                audience: 'Futurs parents, familles déjà inscrites, élèves, enseignants candidats et partenaires locaux.',
                promise: 'Comprendre le projet pédagogique, les niveaux, la vie scolaire et les modalités d’inscription rapidement.',
                tone: 'Rassurant, vivant, éducatif, institutionnel et jamais enfantin surchargé.',
                differentiator: 'Le site organise trois parcours distincts : découvrir l’école, suivre la vie scolaire et postuler comme enseignant.',
            },
            styleGuide: {
                direction: 'École privée moderne : photos lumineuses, codes pédagogiques sobres, accents bleu encre, vert tableau et jaune cahier, sections denses mais accueillantes.',
                colors: 'Bleu encre, vert tableau doux, ivoire papier, jaune cahier, corail discret et gris ardoise.',
                typography: 'Sans-serif lisible, titres institutionnels, libellés courts et hiérarchie claire pour les parents.',
                layout: 'Hero école, parcours par public, projet pédagogique, niveaux, vie scolaire, agenda, actualités, documents, visite virtuelle et recrutement.',
            },
            visualConcept: {
                heroComposition: 'Hero lumineux avec façade ou cour d’école, navigation par public, niveaux maternelle-primaire-collège et bouton visite.',
                ambience: 'Vivante, éducative, organisée et professionnelle, sans univers application enfant.',
                colorPalette: ['bleu encre', 'vert tableau doux', 'ivoire papier', 'jaune cahier', 'corail discret', 'gris ardoise'],
                imageKeywords: ['école privée', 'classe lumineuse', 'cour école', 'élèves collège primaire', 'équipe pédagogique'],
                layoutSignature: 'Site institutionnel avec trois entrées publiques, niveaux, vie scolaire, documents, agenda, actualités et visite virtuelle.',
                microInteractions: ['onglets par public', 'niveaux qui se filtrent', 'agenda qui met les dates à venir en avant'],
                signatureMoment: 'Le parent choisit son profil et voit immédiatement visite, inscription, niveaux et documents utiles.',
                wowFactor: 'Le visiteur voit une vraie école privée multi-niveaux, pas une application de jeux éducatifs.',
            },
            siteModel: {
                name: 'Direction école privée claire',
                description: 'Un site institutionnel pour rassurer les parents, informer les familles inscrites et recevoir les candidatures enseignants.',
                sections: ['Hero école', 'Parcours publics', 'Projet pédagogique', 'Niveaux', 'Vie scolaire', 'Agenda', 'Documents', 'Visite virtuelle'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Projet pédagogique', text: 'Les valeurs, méthodes et objectifs sont expliqués clairement pour rassurer les familles.' },
                { title: 'Maternelle, primaire, collège', text: 'Chaque niveau possède ses repères, horaires, activités et informations utiles.' },
                { title: 'Espaces par public', text: 'Futurs parents, familles inscrites et enseignants candidats trouvent chacun leur parcours.' },
            ],
            services: [
                { name: 'Inscriptions', description: 'Modalités, documents, visite et demande de rendez-vous.' },
                { name: 'Vie scolaire', description: 'Horaires, restauration, activités, agenda et actualités.' },
                { name: 'Recrutement enseignants', description: 'Présentation du projet et formulaire de candidature distinct.' },
            ],
            ctas: ['Demander une visite', 'Inscrire mon enfant', 'Accès familles'],
            seo: {
                keywords: ['école privée maternelle primaire collège', 'inscription école privée', 'projet pédagogique école', 'visite école privée'],
                searchExpressions: ['école privée maternelle primaire collège + ville', 'inscription école privée', 'école privée projet pédagogique', 'visite virtuelle école privée'],
                titles: [`${siteName} - École privée maternelle, primaire et collège`, 'Projet pédagogique, inscriptions et vie scolaire'],
                metaDescription: `${siteName} présente son projet pédagogique, ses niveaux, son équipe, ses activités, sa restauration, ses horaires, ses inscriptions, son agenda, ses actualités, ses documents et sa visite virtuelle.`,
            },
            seoKeywords: ['école privée', 'maternelle', 'primaire', 'collège', 'inscription', 'projet pédagogique'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site institutionnel école privée',
            'Slogan proposé : Grandir, apprendre, s’épanouir.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander une visite, Inscrire mon enfant, Accès familles',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsCrisisManagement) {
        const crisisSiteName = /\b(cabinet|avocats?|renovation|energie|dpe|rge|travaux|isolation|audit energetique|compta|restaurant|fitness|ecole)\b/i.test(siteName)
            ? 'Crisis Partners'
            : siteName;

        Object.assign(sanitized, {
            sectorKey: 'crisis-management',
            projectType: 'Site agence de gestion de crise',
            layoutVariant: 'classic-conversion',
            visualMood: 'crisis-strategy-sober',
            showGallery: false,
            siteName: crisisSiteName,
            slogan: 'Stabiliser. Protéger. Répondre.',
            summary: 'Kirby reconstruit une proposition pour une agence de gestion de crise médiatique, juridique, sociale, cyber et réputationnelle.',
            valueProposition: 'Un site sobre, stratégique et rassurant qui donne un accès rapide aux entreprises déjà en crise, explique la méthode, les expertises, les interventions d’urgence et les formations de préparation.',
            positioning: {
                audience: 'Dirigeants, directions juridiques, équipes communication, DRH, RSSI et comités exécutifs confrontés à une situation sensible.',
                promise: 'Qualifier la crise, activer une réponse confidentielle et coordonner les bons experts sans exposition inutile.',
                tone: 'Sobre, stratégique, confidentiel, ferme et rassurant, sans codes juridiques traditionnels.',
                differentiator: 'Le site organise l’urgence, les scénarios, la méthode, les expertises et la préparation dans un parcours de décision clair.',
            },
            styleGuide: {
                direction: 'Gestion de crise premium : fond nuit sobre, cartographie des scénarios, ligne de décision, accès urgence, formulaire confidentiel et preuves méthodologiques.',
                colors: 'Bleu nuit, graphite, ivoire discret, ambre alerte, cyan décision et rouge sourd très mesuré.',
                typography: 'Sans-serif institutionnelle, titres courts, messages de confiance et labels confidentiels très lisibles.',
                layout: 'Hero urgence, scénarios de crise, méthodologie, expertises mobilisées, dirigeants/directions, formations et formulaire confidentiel.',
            },
            visualConcept: {
                heroComposition: 'Table de crise stylisée avec scénarios médiatique, juridique, social, cyber et réputation, bouton urgence et capsule confidentielle.',
                ambience: 'Sobre, stratégique, calme sous pression et rassurante, sans décor juridique traditionnel ni ancien univers métier.',
                colorPalette: ['bleu nuit', 'graphite', 'ivoire discret', 'ambre alerte', 'cyan décision', 'rouge sourd'],
                imageKeywords: ['cellule de crise', 'communication de crise', 'cyber crise', 'dirigeants réunion stratégique', 'réputation entreprise'],
                layoutSignature: 'Parcours crise avec accès urgence, scénarios, méthode de réponse, expertises, formation et formulaire confidentiel.',
                microInteractions: ['scénario de crise sélectionné', 'niveau d’urgence activé', 'formulaire confidentiel verrouillé'],
                signatureMoment: 'Le dirigeant choisit un scénario de crise et voit immédiatement la méthode, les experts et l’accès confidentiel.',
                wowFactor: 'Le visiteur comprend une agence de gestion de crise, sans impression de secteur voisin recyclé.',
            },
            siteModel: {
                name: 'Direction gestion de crise',
                description: 'Un site stratégique avec accès urgence, scénarios, méthode, expertises, formations et formulaire confidentiel.',
                sections: ['Accès urgence', 'Scénarios de crise', 'Méthodologie', 'Expertises mobilisées', 'Dirigeants & directions', 'Formations', 'Formulaire confidentiel'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Accès urgence confidentiel', text: 'Une entreprise déjà en crise trouve immédiatement le canal prioritaire et discret.' },
                { title: 'Scénarios maîtrisés', text: 'Crises médiatiques, juridiques, sociales, cyber et réputationnelles sont séparées clairement.' },
                { title: 'Méthode et préparation', text: 'Cellule de crise, messages, expertises et formations montrent une réponse structurée.' },
            ],
            services: [
                { name: 'Intervention d’urgence', description: 'Qualification rapide, cellule de crise, priorités et premières réponses.' },
                { name: 'Communication de crise', description: 'Messages, porte-parole, relations médias, réseaux sociaux et réputation.' },
                { name: 'Formations préparation', description: 'Simulations, media training, protocoles et exercices de décision.' },
            ],
            ctas: ['Activer une cellule de crise', 'Demander un échange confidentiel', 'Préparer mon équipe'],
            seo: {
                keywords: ['agence gestion de crise', 'communication de crise', 'crise réputation entreprise', 'crise cyber médiatique juridique sociale', 'formation gestion de crise'],
                searchExpressions: ['agence gestion de crise entreprise', 'communication de crise réputation', 'intervention urgence crise médiatique cyber', 'formation cellule de crise dirigeants'],
                titles: [`${crisisSiteName} - Gestion de crise entreprise`, 'Urgence, méthode, réputation et préparation'],
                metaDescription: `${crisisSiteName} accompagne les entreprises en crise médiatique, juridique, sociale, cyber ou réputationnelle avec accès urgence, méthodologie, expertises, formations et formulaire confidentiel.`,
            },
            seoKeywords: ['gestion de crise', 'communication de crise', 'crise cyber', 'réputation entreprise', 'formulaire confidentiel', 'formation crise'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${crisisSiteName}.`,
            'Besoin de départ : agence de gestion de crise avec scénarios médiatique, juridique, sociale, cyber et réputationnelle, accès urgence, méthode, expertises, formations et formulaire confidentiel.',
            'Type de projet : site agence de gestion de crise',
            'Slogan proposé : Stabiliser. Protéger. Répondre.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Activer une cellule de crise, Demander un échange confidentiel, Préparer mon équipe',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsSportsRehab) {
        const sportsRehabSiteName = /\b(studio centre|centre de reeducation|reeducation sportive|fitness|gym|box|club|ecole|academie|restaurant|compta|auto|conciergerie|immobilier|medical center|centre medical)\b/i.test(siteName)
            ? 'Reprise Active'
            : siteName;

        Object.assign(sanitized, {
            sectorKey: 'sports-rehab',
            projectType: 'Site centre de rééducation sportive',
            layoutVariant: 'classic-conversion',
            visualMood: 'sports-rehab-technical',
            showGallery: true,
            siteName: sportsRehabSiteName,
            slogan: 'Reprendre fort, reprendre juste.',
            summary: 'Kirby reconstruit une proposition pour un centre de rééducation sportive destiné aux sportifs amateurs et professionnels.',
            valueProposition: 'Un site technique, dynamique et rassurant qui oriente le visiteur par blessure, sport ou objectif de reprise, avec équipe pluridisciplinaire, équipements, protocoles, bilans, prévention et suivi à distance.',
            positioning: {
                audience: 'Sportifs amateurs, sportifs professionnels, clubs, familles de jeunes sportifs et prescripteurs médicaux.',
                promise: 'Choisir un parcours adapté à sa blessure, son sport ou son objectif de retour au terrain.',
                tone: 'Technique, dynamique, médical sportif, précis et humain, sans codes fitness.',
                differentiator: 'La maquette sépare blessure, sport et reprise, puis relie équipe, protocoles, bilans, équipements et suivi à distance.',
            },
            styleGuide: {
                direction: 'Rééducation sportive premium : plateau technique, tests fonctionnels, lignes de mouvement, cartes parcours et indicateurs de protocole.',
                colors: 'Bleu clinique profond, cyan mesure, orange reprise, blanc technique, graphite et vert validation.',
                typography: 'Sans-serif technique très lisible, titres courts, labels de protocole, chiffres et statuts précis.',
                layout: 'Hero parcours blessure/sport/reprise, équipe pluridisciplinaire, équipements, protocoles, bilans, prévention, suivi à distance et contact.',
            },
            visualConcept: {
                heroComposition: 'Plateau de rééducation avec sportif en test, choix blessure/sport/reprise, jauge de protocole et cartes équipe.',
                ambience: 'Technique, dynamique, sportive médicale et lumineuse, sans ambiance salle de fitness.',
                colorPalette: ['bleu clinique profond', 'cyan mesure', 'orange reprise', 'blanc technique', 'graphite', 'vert validation'],
                imageKeywords: ['rééducation sportive', 'kinésithérapie sport', 'médecine du sport', 'bilan fonctionnel', 'retour terrain'],
                layoutSignature: 'Parcours médical sportif guidé par blessure, sport ou objectif, avec preuves d’équipement, protocoles et suivi.',
                microInteractions: ['filtre blessure actif', 'niveau de reprise qui progresse', 'exercice de suivi à distance validé'],
                signatureMoment: 'Le sportif choisit blessure, sport ou objectif, puis voit l’équipe, le bilan et le protocole adaptés.',
                wowFactor: 'Le visiteur comprend un centre de rééducation sportive, pas une salle de fitness ni un centre médical générique.',
            },
            siteModel: {
                name: 'Direction rééducation sportive',
                description: 'Un site qui relie équipe médicale sportive, parcours blessure/sport/reprise, protocoles, bilans, prévention et suivi à distance.',
                sections: ['Parcours blessure', 'Parcours par sport', 'Objectif reprise', 'Équipe pluridisciplinaire', 'Équipements & protocoles', 'Bilans & prévention', 'Suivi à distance'],
            },
            recommendedOffer: 'Projet spécifique',
            pages,
            homeSections: [
                { title: 'Parcours blessure, sport, reprise', text: 'Le visiteur choisit son entrée : blessure, discipline ou objectif de retour au terrain.' },
                { title: 'Équipe sportive médicale', text: 'Kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques et nutritionnistes sont identifiés.' },
                { title: 'Bilans, protocoles, suivi', text: 'Équipements, tests fonctionnels, prévention et suivi à distance rendent la méthode concrète.' },
            ],
            services: [
                { name: 'Bilans fonctionnels', description: 'Tests de mobilité, force, charge, douleur, asymétrie et préparation au retour terrain.' },
                { name: 'Protocoles de rééducation', description: 'Programmes par blessure, sport et objectif avec progression mesurable.' },
                { name: 'Suivi à distance', description: 'Exercices, contrôle des charges, prévention rechute et lien avec l’équipe.' },
            ],
            ctas: ['Choisir mon parcours', 'Prendre rendez-vous', 'Démarrer un suivi'],
            seo: {
                keywords: ['centre de rééducation sportive', 'kinésithérapie du sport', 'médecin du sport', 'bilan fonctionnel sportif', 'retour au sport'],
                searchExpressions: ['centre de rééducation sportive + ville', 'kiné du sport retour terrain', 'bilan fonctionnel sportif', 'rééducation blessure sportif'],
                titles: [`${sportsRehabSiteName} - Rééducation sportive`, 'Blessure, sport, reprise et suivi à distance'],
                metaDescription: `${sportsRehabSiteName} accompagne sportifs amateurs et professionnels avec kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques, nutritionnistes, parcours blessure/sport/reprise, équipements, protocoles, bilans, prévention et suivi à distance.`,
            },
            seoKeywords: ['rééducation sportive', 'kinésithérapie sport', 'médecin du sport', 'bilan fonctionnel', 'retour au sport', 'prévention blessure'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${sportsRehabSiteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site centre de rééducation sportive',
            'Slogan proposé : Reprendre fort, reprendre juste.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Choisir mon parcours, Prendre rendez-vous, Démarrer un suivi',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsAutomotiveConcierge) {
        Object.assign(sanitized, {
            sectorKey: 'automotive-concierge',
            projectType: 'Site conciergerie automobile premium',
            layoutVariant: needsSurfaceDesign ? 'lumina-showcase' : 'luxury-asymmetric',
            visualMood: 'automotive-concierge',
            showGallery: true,
            slogan: 'Votre véhicule, pris en charge.',
            summary: 'Kirby reconstruit une proposition de conciergerie automobile haut de gamme avec services, forfaits, fonctionnement, zones et demande de prise en charge.',
            valueProposition: 'Un site sobre et premium qui montre entretien, nettoyage, contrôle technique, convoyage, suivi du véhicule et demande de prise en charge sans glisser vers le recrutement ou la finance.',
            positioning: {
                audience: 'Propriétaires de véhicules, professionnels et clients exigeants qui veulent déléguer l’entretien et le suivi automobile.',
                promise: 'Choisir un forfait, planifier la prise en charge et suivre le véhicule avec un service clair et rassurant.',
                tone: 'Sobre, professionnel, haut de gamme, précis et rassurant.',
                differentiator: 'Le premier écran montre le parcours de prise en charge du véhicule, pas une roue décorative ni une maquette de cabinet de recrutement.',
            },
            styleGuide: {
                direction: 'Direction conciergerie automobile : graphite carrosserie, ivoire service, acier doux, véhicule premium, cartes forfaits, étapes de suivi et zones couvertes.',
                colors: 'Graphite carrosserie, ivoire service, acier doux, bleu nuit et or discret.',
                typography: 'Sans-serif premium, titres sobres, libellés de service très lisibles et hiérarchie rassurante.',
                layout: 'Hero premium, services, forfaits, fonctionnement, zones couvertes, demande de prise en charge et contact.',
            },
            visualConcept: {
                heroComposition: 'Véhicule premium en trois-quarts, carte de prise en charge, forfaits et suivi du véhicule visibles.',
                ambience: 'Sobre, premium, automobile, précis et très professionnel.',
                colorPalette: ['graphite carrosserie', 'ivoire service', 'acier doux', 'bleu nuit', 'or discret'],
                imageKeywords: ['conciergerie automobile', 'véhicule premium', 'car detailing', 'contrôle technique', 'convoyage véhicule'],
                layoutSignature: 'Parcours premium avec services, forfaits, fonctionnement, zones couvertes et demande de prise en charge.',
                microInteractions: ['forfait actif au survol', 'étapes de prise en charge qui se cochent', 'zone couverte qui s’illumine'],
                signatureMoment: 'La roue devient un repère discret, mais le vrai centre reste le parcours de prise en charge du véhicule.',
                wowFactor: 'Le visiteur comprend immédiatement entretien, nettoyage, contrôle technique, convoyage et demande de prise en charge.',
            },
            siteModel: {
                name: 'Direction conciergerie auto',
                description: 'Une présence digitale sobre et haut de gamme pour un service automobile avec suivi, forfaits et prise en charge.',
                sections: ['Hero prise en charge', 'Services auto', 'Forfaits', 'Fonctionnement', 'Zones couvertes', 'Demande de prise en charge'],
            },
            recommendedOffer: 'Offre Signature',
            pages,
            homeSections: [
                { title: 'Véhicule pris en charge', text: 'Le site montre entretien, nettoyage, contrôle technique, convoyage et suivi sans jargon.' },
                { title: 'Forfaits clairs', text: 'Les niveaux de service expliquent ce qui est inclus et pour quel usage.' },
                { title: 'Suivi premium', text: 'Le client comprend les étapes, les zones couvertes et la demande de prise en charge.' },
            ],
            services: [
                { name: 'Entretien & contrôle', description: 'Organisation entretien, contrôle technique et rendez-vous utiles.' },
                { name: 'Nettoyage premium', description: 'Nettoyage intérieur, extérieur et préparation du véhicule.' },
                { name: 'Convoyage', description: 'Prise en charge, déplacement et restitution suivie.' },
            ],
            ctas: ['Demander une prise en charge', 'Voir les forfaits', 'Comprendre le fonctionnement'],
            seo: {
                keywords: ['conciergerie automobile', 'service automobile premium', 'prise en charge véhicule', 'convoyage véhicule', 'nettoyage auto premium'],
                searchExpressions: ['conciergerie automobile près de moi', 'service entretien voiture haut de gamme', 'convoyage véhicule + ville', 'prise en charge contrôle technique'],
                titles: [`${siteName} - Conciergerie automobile premium`, 'Entretien, nettoyage, contrôle technique et convoyage'],
                metaDescription: `${siteName} propose une conciergerie automobile haut de gamme : entretien, nettoyage, contrôle technique, convoyage, suivi et demande de prise en charge.`,
            },
            seoKeywords: ['conciergerie automobile', 'prise en charge véhicule', 'convoyage', 'contrôle technique', 'nettoyage auto'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site conciergerie automobile premium',
            'Slogan proposé : Votre véhicule, pris en charge.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander une prise en charge, Voir les forfaits, Comprendre le fonctionnement',
            'Offre pressentie : Offre Signature',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsKidsFashion) {
        Object.assign(sanitized, {
            sectorKey: 'kids-fashion',
            projectType: 'Boutique mode enfant durable',
            layoutVariant: 'warm-editorial',
            visualMood: 'kids-fashion-joyful',
            showGallery: true,
            slogan: 'Des couleurs qui grandissent bien.',
            summary: 'Kirby reconstruit une proposition de marque de vêtements enfants avec collections, matières, engagements, guide des tailles et boutique.',
            valueProposition: 'Un site joyeux, illustré et moderne qui montre une vraie marque de vêtements enfant durable, pas une application de jeux, de comptines ou un thème générique.',
            positioning: {
                audience: 'Parents d’enfants de 2 à 8 ans qui cherchent des vêtements colorés, durables, confortables et faciles à choisir.',
                promise: 'Découvrir les collections, comprendre les matières, choisir la bonne taille et commander simplement.',
                tone: 'Joyeux, illustré, moderne, coloré et rassurant pour les parents.',
                differentiator: 'Le premier écran montre vêtements, couleurs, matières, tailles et boutique au lieu d’un univers éducatif enfant.',
            },
            styleGuide: {
                direction: 'Direction mode enfant durable : mosaïque de vêtements, pastilles couleurs, matières visibles, guide des tailles et boutique claire.',
                colors: 'Ivoire chaud, corail doux, bleu ciel, vert pomme, jaune soleil et encre douce.',
                typography: 'Sans-serif ronde mais moderne, titres joyeux, fiches produit lisibles et textes parents courts.',
                layout: 'Boutique éditoriale avec collections, matières, engagements, guide des tailles, fiches produits et contact.',
            },
            visualConcept: {
                heroComposition: 'Mosaïque de vêtements enfant colorés, étiquettes matières, guide des tailles et bouton boutique.',
                ambience: 'Joyeuse, illustrée, moderne, colorée et rassurante pour les parents.',
                colorPalette: ['ivoire chaud', 'corail doux', 'bleu ciel', 'vert pomme', 'jaune soleil', 'encre douce'],
                imageKeywords: ['vêtements enfant colorés', 'mode enfant durable', 'matières naturelles', 'guide des tailles', 'boutique enfant'],
                layoutSignature: 'Boutique éditoriale enfant avec collections, matières, engagements, tailles et fiches produit visibles.',
                microInteractions: ['pastilles couleurs qui changent', 'guide des tailles qui s’ouvre', 'cartes collection qui glissent doucement'],
                signatureMoment: 'Une tenue enfant colorée se compose avec matières, tailles et engagement durable autour de la fiche produit.',
                wowFactor: 'Le visiteur voit une marque de vêtements enfant avec collections, matières, tailles et boutique, pas une application éducative.',
            },
            siteModel: {
                name: 'Direction mode enfant durable',
                description: 'Une boutique éditoriale pour vêtements enfants, avec collections, matières, engagements, tailles et commande.',
                sections: ['Hero collection', 'Collections', 'Matières', 'Engagements', 'Guide des tailles', 'Boutique'],
            },
            recommendedOffer: 'Offre Pro',
            pages,
            homeSections: [
                { title: 'Collections colorées', text: 'Les vêtements, silhouettes et motifs sont visibles dès le premier écran.' },
                { title: 'Matières durables', text: 'Le site rassure sur confort, résistance, lavage et engagement responsable.' },
                { title: 'Tailles 2 à 8 ans', text: 'Le guide des tailles et la boutique aident les parents à commander sans hésiter.' },
            ],
            services: [
                { name: 'Collections enfant', description: 'Vêtements colorés, durables et adaptés aux 2 à 8 ans.' },
                { name: 'Guide des tailles', description: 'Repères simples pour choisir selon âge, taille et coupe.' },
                { name: 'Boutique', description: 'Catégories, fiches produits, panier et commande.' },
            ],
            ctas: ['Voir les collections', 'Ouvrir la boutique', 'Guide des tailles'],
            seo: {
                keywords: ['vêtements enfants durables', 'marque vêtements enfants', 'mode enfant colorée', 'guide des tailles enfant', 'boutique vêtements enfants'],
                searchExpressions: ['vêtements enfants durables 2 à 8 ans', 'marque vêtements enfant colorés', 'guide des tailles vêtements enfants', 'boutique mode enfant durable'],
                titles: [`${siteName} - Vêtements enfants colorés et durables`, 'Collections, matières, tailles et boutique'],
                metaDescription: `${siteName} présente des vêtements colorés et durables pour enfants de 2 à 8 ans, avec collections, matières, engagements, guide des tailles et boutique.`,
            },
            seoKeywords: ['vêtements enfants', 'mode enfant durable', 'collections enfant', 'guide des tailles', 'boutique enfant'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : boutique mode enfant durable',
            'Slogan proposé : Des couleurs qui grandissent bien.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Voir les collections, Ouvrir la boutique, Guide des tailles',
            'Offre pressentie : Offre Pro',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

    if (needsBoxingClub) {
        Object.assign(sanitized, {
            sectorKey: 'boxing-club',
            projectType: 'Site club de boxe pour femmes',
            layoutVariant: needsSurfaceDesign ? 'lumina-showcase' : 'cinematic-video',
            visualMood: 'boxing-female-energy',
            showGallery: true,
            slogan: 'Frappez fort. Entrez libre.',
            summary: `Kirby reconstruit une proposition de club de boxe pour femmes avec ring, planning, coachs et essai découverte.`,
            valueProposition: 'Une expérience qui montre cours de boxe, niveaux, coachs, planning et séance d’essai dans une ambiance forte et rassurante.',
            positioning: {
                audience: 'Femmes débutantes ou confirmées qui cherchent un club énergique, encadré et rassurant.',
                promise: 'Choisir son niveau, comprendre les cours et réserver un essai sans hésitation.',
                tone: 'Énergique, confiant, féminin, urbain et très lisible.',
                differentiator: 'Le premier écran montre ring, gants, coachs, planning et communauté féminine au lieu d’un portfolio générique.',
            },
            styleGuide: {
                direction: 'Direction ring féminin : fond graphite, rouge gant, lumière corail, cartes planning, coachs visibles, niveaux et essai découverte.',
                colors: 'Graphite ring, rouge gant, corail énergie, champagne peau, blanc corde et violet nocturne.',
                typography: 'Titres puissants, textes courts, contraste fort et lecture mobile immédiate.',
                layout: 'Hero ring cinématique, cours par niveau, planning, coachs, essai découverte, tarifs, galerie et CTA final.',
            },
            visualConcept: {
                heroComposition: 'Ring en profondeur avec gants rouges, sacs de frappe, planning flottant et bouton essai visible.',
                ambience: 'Énergique, confiante, féminine, urbaine et rassurante.',
                colorPalette: ['graphite ring', 'rouge gant', 'corail énergie', 'champagne peau', 'blanc corde', 'violet nocturne'],
                imageKeywords: ['femme boxe ring', 'gants de boxe', 'sac de frappe', 'coach boxe femmes', 'planning cours boxe'],
                layoutSignature: 'Showcase ring féminin avec hero très contrasté, planning horizontal, cartes niveaux, coachs et essai découverte.',
                microInteractions: ['cordes du ring qui vibrent', 'planning qui glisse par niveau', 'bouton essai qui pulse sans agressivité'],
                signatureMoment: 'Une paire de gants éclaire le ring pendant que le planning et les niveaux se placent autour.',
                wowFactor: 'Le visiteur voit immédiatement un club de boxe pour femmes, pas une salle de sport ou un portfolio rebaptisé.',
            },
            siteModel: {
                name: 'Direction ring féminin',
                description: 'Une présence digitale dédiée à la boxe pour femmes, avec cours, coachs, planning, tarifs et séance d’essai.',
                sections: ['Hero ring', 'Cours par niveau', 'Planning', 'Coachs', 'Essai découverte', 'Tarifs', 'Galerie'],
            },
            recommendedOffer: 'Offre Pro',
            pages,
            homeSections: [
                { title: 'Monter sur le ring', text: 'Ring, gants, sacs de frappe et énergie féminine donnent le ton dès le premier écran.' },
                { title: 'Cours tous niveaux', text: 'Débutantes, confirmées et self-défense trouvent vite leur créneau.' },
                { title: 'Essai découverte', text: 'Le parcours rassure, présente les coachs et mène vers une première séance.' },
            ],
            services: [
                { name: 'Cours de boxe', description: 'Séances techniques, cardio et progression par niveau.' },
                { name: 'Self-défense', description: 'Ateliers rassurants pour gagner en confiance et réflexes.' },
                { name: 'Coaching technique', description: 'Accompagnement sur posture, puissance, endurance et mental.' },
            ],
            ctas: ['Réserver un essai', 'Voir le planning', 'Découvrir les cours'],
            seo: {
                keywords: ['club de boxe femmes', 'boxe féminine', 'cours de boxe femmes', 'self-défense femmes'],
                searchExpressions: ['club de boxe femmes près de moi', 'cours boxe femmes débutantes', 'self défense femmes + ville', 'club boxing féminin'],
                titles: [`${siteName} - Club de boxe pour femmes`, 'Cours, planning et essai découverte'],
                metaDescription: `${siteName} présente les cours de boxe pour femmes, le planning, les coachs, les tarifs et la séance d’essai découverte.`,
            },
            seoKeywords: ['club de boxe femmes', 'boxe féminine', 'cours de boxe', 'self-défense femmes'],
            recommendedServices,
        });

        sanitized.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site club de boxe pour femmes',
            'Slogan proposé : Frappez fort. Entrez libre.',
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Réserver un essai, Voir le planning, Découvrir les cours',
            'Offre pressentie : Offre Pro',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');
    }

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

const normalizeNarrativePlan = (proposal, fallback, brief) => {
    const profile = getBriefProfile(brief);
    const generated = proposal.narrativePlan && typeof proposal.narrativePlan === 'object' ? proposal.narrativePlan : {};
    const fallbackPlan = fallback.narrativePlan && typeof fallback.narrativePlan === 'object'
        ? fallback.narrativePlan
        : buildNarrativePlan(brief, profile);
    const sanitizeStage = (stage = '') => {
        const normalized = normalizeIntentText(stage);
        return ['discovery', 'understanding', 'proof', 'trust', 'conversion'].includes(normalized)
            ? normalized
            : 'understanding';
    };
    const normalizeJourney = (items, fallbackItems) => {
        const normalizedItems = limitArray(items, 6)
            .map((item) => ({
                stage: sanitizeStage(item && item.stage),
                goal: normalizeDisplayText(item && item.goal),
                message: normalizeDisplayText(item && item.message),
                proofNeeded: Boolean(item && item.proofNeeded),
                expectedAction: normalizeDisplayText(item && item.expectedAction),
            }))
            .filter((item) => item.goal || item.message || item.expectedAction);

        return normalizedItems.length ? normalizedItems : limitArray(fallbackItems, 6);
    };
    const normalizeSectionRoles = (items, fallbackItems) => {
        const normalizedItems = limitArray(items, 8)
            .map((item) => ({
                section: normalizeDisplayText(item && item.section),
                stage: sanitizeStage(item && item.stage),
                goal: normalizeDisplayText(item && item.goal) || getNarrativeStageRole(sanitizeStage(item && item.stage)),
                message: normalizeDisplayText(item && item.message),
                proofNeeded: Boolean(item && item.proofNeeded),
                expectedAction: normalizeDisplayText(item && item.expectedAction) || getNarrativeExpectedAction(sanitizeStage(item && item.stage), profile),
                imageRole: normalizeDisplayText(item && item.imageRole),
            }))
            .filter((item) => item.section || item.message);

        return normalizedItems.length ? normalizedItems : limitArray(fallbackItems, 8);
    };
    const primaryConversion = generated.primaryConversion && typeof generated.primaryConversion === 'object'
        ? generated.primaryConversion
        : {};
    const fallbackConversion = fallbackPlan.primaryConversion && typeof fallbackPlan.primaryConversion === 'object'
        ? fallbackPlan.primaryConversion
        : {};

    return {
        centralStory: normalizeDisplayText(generated.centralStory) || fallbackPlan.centralStory || '',
        visitorStartingPoint: normalizeDisplayText(generated.visitorStartingPoint) || fallbackPlan.visitorStartingPoint || '',
        desiredOutcome: normalizeDisplayText(generated.desiredOutcome) || fallbackPlan.desiredOutcome || '',
        commercialPromise: normalizeDisplayText(generated.commercialPromise) || fallbackPlan.commercialPromise || profile.promise,
        targetAudience: limitArray(generated.targetAudience || fallbackPlan.targetAudience || [profile.audience], 5).map(normalizeDisplayText).filter(Boolean),
        tone: limitArray(generated.tone || fallbackPlan.tone || [profile.tone], 6).map(normalizeDisplayText).filter(Boolean),
        journey: normalizeJourney(generated.journey, fallbackPlan.journey),
        sectionRoles: normalizeSectionRoles(generated.sectionRoles, fallbackPlan.sectionRoles),
        imageStrategy: normalizeDisplayText(generated.imageStrategy) || fallbackPlan.imageStrategy || '',
        visualComposition: normalizeDisplayText(generated.visualComposition) || fallbackPlan.visualComposition || '',
        mustInclude: limitArray(generated.mustInclude || fallbackPlan.mustInclude || [], 12).map(normalizeDisplayText).filter(Boolean),
        mustAvoid: limitArray(generated.mustAvoid || fallbackPlan.mustAvoid || profile.exclusions || [], 12).map(normalizeDisplayText).filter(Boolean),
        primaryConversion: {
            action: normalizeDisplayText(primaryConversion.action) || fallbackConversion.action || profile.conversion,
            label: normalizeDisplayText(primaryConversion.label) || fallbackConversion.label || getPrimaryConversionLabel(brief, profile),
        },
    };
};

const normalizeVisualPlan = (proposal, fallback, brief, narrativePlan) => {
    const profile = getBriefProfile(brief);
    const generated = proposal.visualPlan && typeof proposal.visualPlan === 'object' ? proposal.visualPlan : {};
    const fallbackPlan = fallback.visualPlan && typeof fallback.visualPlan === 'object'
        ? fallback.visualPlan
        : buildVisualPlan(brief, profile, narrativePlan);
    const allowedStages = new Set((Array.isArray(narrativePlan.journey) ? narrativePlan.journey : [])
        .map((item) => normalizeIntentText(item && item.stage))
        .filter(Boolean));
    const sanitizeStage = (stage = '') => {
        const normalized = normalizeIntentText(stage);
        return allowedStages.has(normalized) ? normalized : 'understanding';
    };
    const normalizeSlot = (slot, fallbackSlot, defaultStage = 'understanding') => {
        const source = slot && typeof slot === 'object' ? slot : {};
        const fallbackSource = fallbackSlot && typeof fallbackSlot === 'object' ? fallbackSlot : {};
        const stage = sanitizeStage(source.narrativeStage || fallbackSource.narrativeStage || defaultStage);
        const keywords = limitArray(source.keywords || fallbackSource.keywords || [], 6)
            .map(normalizeDisplayText)
            .filter(Boolean);
        const subject = normalizeDisplayText(source.subject) || normalizeDisplayText(fallbackSource.subject) || keywords[0] || profile.activity;

        return {
            narrativeStage: stage,
            purpose: normalizeDisplayText(source.purpose) || normalizeDisplayText(fallbackSource.purpose) || getNarrativeStageRole(stage),
            subject,
            composition: normalizeDisplayText(source.composition) || normalizeDisplayText(fallbackSource.composition) || 'Image lisible au service du récit.',
            priority: normalizeDisplayText(source.priority) || normalizeDisplayText(fallbackSource.priority) || 'supporting',
            keywords: keywords.length ? keywords : [subject].filter(Boolean),
            query: normalizeDisplayText(source.query) || normalizeDisplayText(fallbackSource.query) || (keywords.length ? keywords.join(', ') : subject),
        };
    };
    const normalizeSlotList = (items, fallbackItems, defaultStage, max = 6) => {
        const list = limitArray(items, max)
            .map((item, index) => normalizeSlot(item, Array.isArray(fallbackItems) ? fallbackItems[index] : null, defaultStage))
            .filter((item) => item.subject || item.purpose);

        return list.length
            ? list
            : limitArray(Array.isArray(fallbackItems) ? fallbackItems : [], max)
                .map((item) => normalizeSlot(item, null, defaultStage));
    };

    return {
        hero: normalizeSlot(generated.hero, fallbackPlan.hero, 'discovery'),
        sections: normalizeSlotList(generated.sections, fallbackPlan.sections, 'understanding', 5),
        gallery: normalizeSlotList(generated.gallery, fallbackPlan.gallery, 'proof', 6),
        conversion: normalizeSlot(generated.conversion, fallbackPlan.conversion, 'conversion'),
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

const enforceAccountingProposal = (proposal = {}, fallback = buildBriefDrivenFallbackProposal('logiciel de comptabilite')) => {
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

const enforceBridalCoutureProposal = (proposal = {}, fallback = buildBriefDrivenFallbackProposal('atelier de robes de mariee haute couture'), brief = '') => {
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
    const profile = getBriefProfile(brief);
    const positiveBrief = profile.positiveText || brief;
    const fallback = buildBriefDrivenFallbackProposal(brief, profile);
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
    const normalizedServices = limitArray(proposal.services, 6)
        .map((service) => ({
            name: normalizeDisplayText(service && service.name),
            description: normalizeDisplayText(service && service.description),
        }))
        .filter((service) => service.name && service.description);
    const fallbackServices = limitArray(fallback.services, 6)
        .map((service) => ({
            name: normalizeDisplayText(service && service.name),
            description: normalizeDisplayText(service && service.description),
        }))
        .filter((service) => service.name && service.description);
    const narrativePlan = normalizeNarrativePlan(proposal, fallback, brief);
    const visualPlan = normalizeVisualPlan(proposal, fallback, brief, narrativePlan);

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
        showGallery: Boolean(proposal.showGallery || fallback.showGallery || (visualPlan.gallery && visualPlan.gallery.length)),
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
        narrativePlan,
        visualPlan,
        siteModel: {
            name: normalizeText(proposal.siteModel && proposal.siteModel.name) || fallback.siteModel.name,
            description: normalizeText(proposal.siteModel && proposal.siteModel.description) || fallback.siteModel.description,
            sections: siteSections,
        },
        recommendedOffer: normalizeText(proposal.recommendedOffer) || fallback.recommendedOffer,
        briefProfile: proposal.briefProfile && typeof proposal.briefProfile === 'object'
            ? proposal.briefProfile
            : fallback.briefProfile || getBriefProfileSummary(profile),
        pages,
        homeSections: (normalizedHomeSections.length ? normalizedHomeSections : fallbackHomeSections).slice(0, 5),
        services: (normalizedServices.length ? normalizedServices : fallbackServices).slice(0, 6),
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

    if (proposalContradictsBriefProfile(sanitized, profile) || proposalInventsUnrequestedUniverse(sanitized, brief)) {
        return buildBriefDrivenFallbackProposal(brief, profile);
    }

    // The renderer is locked: historical sector templates must not replace the new brief-driven pipeline.
    return sanitized;

    const briefSectorLocks = {
        energyRenovation: hasEnergyRenovationIntent(positiveBrief),
        restaurantManagementSaas: hasRestaurantManagementSaasIntent(positiveBrief),
        funeralHome: hasFuneralHomeIntent(positiveBrief),
        seniorMobility: hasSeniorMobilityIntent(positiveBrief),
        privateSchool: hasPrivateSchoolIntent(positiveBrief),
        crisisManagement: hasCrisisManagementIntent(positiveBrief),
        sportsRehab: hasSportsRehabIntent(positiveBrief),
        medicalCenter: hasMedicalCenterIntent(positiveBrief),
        automotiveConcierge: hasAutomotiveConciergeIntent(positiveBrief),
        childFashion: hasChildFashionIntent(positiveBrief),
        boxingClub: hasBoxingIntent(positiveBrief),
    };
    const hasExplicitBriefSector = Object.values(briefSectorLocks).some(Boolean);
    const acceptsGeneratedSector = (sectorKey) => !hasExplicitBriefSector && sanitized.sectorKey === sectorKey;

    if (briefSectorLocks.energyRenovation || acceptsGeneratedSector('energy-renovation')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(immobili|agence|shop|boutique|mode|restaurant|auto|conciergerie|compta|finance|luna|comptine)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const energyProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'energy-renovation',
        };

        energyProposal.seo = {
            ...(energyProposal.seo || {}),
            titles: [`${siteName} - Rénovation énergétique`, 'Prédiagnostic, aides, travaux et garanties'],
            metaDescription: `${siteName} accompagne particuliers et copropriétés : isolation, chauffage, ventilation, audit, aides financières, certifications, réalisations, garanties, prédiagnostic et dossier complet.`,
        };
        energyProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site rénovation énergétique avec prédiagnostic',
            'Slogan proposé : Rénover mieux, décider clairement.',
            `Pages proposées : ${energyProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Faire un prédiagnostic, Demander une estimation, Transmettre mon dossier',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return energyProposal;
    }

    if (briefSectorLocks.restaurantManagementSaas || acceptsGeneratedSector('restaurant-management-saas')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(restaurant gastronomique|menu|carte|chef|table|agence|immobili|compta|finance|facture|tva|luna|comptine|auto|conciergerie)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const restaurantSaasProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'restaurant-management-saas',
        };

        restaurantSaasProposal.seo = {
            ...(restaurantSaasProposal.seo || {}),
            titles: [`${siteName} - Logiciel de gestion restaurateurs`, 'Réservations, stocks, recettes, équipes et multi-restaurants'],
            metaDescription: `${siteName} aide les restaurateurs à gérer réservations, stocks, fournisseurs, coûts de recettes, plannings d’équipe, formules, démonstrations, comparatifs et groupes multi-restaurants.`,
        };
        restaurantSaasProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site SaaS gestion restaurateurs',
            'Slogan proposé : Piloter le service, sans friction.',
            `Pages proposées : ${restaurantSaasProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander une démo, Voir les formules, Comparer les offres',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return restaurantSaasProposal;
    }

    if (briefSectorLocks.funeralHome || acceptsGeneratedSector('funeral-home')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/^studio\b/i.test(generatedName) && !/\b(hotel|hôtel|luxe|mobilite|mobilité|trajet|transport|senior|pmr|conciergerie|auto|restaurant|renovation|energie|cabinet|avocat|fitness)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const funeralProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'funeral-home',
            projectType: 'Site maison funéraire nouvelle génération',
            layoutVariant: 'classic-conversion',
            visualMood: 'funeral-home-serene',
            slogan: 'Présence calme, démarches claires.',
            showGallery: false,
            summary: 'Une proposition complète pour une maison funéraire humaine, discrète et moderne avec espace hommage privé.',
            valueProposition: 'Un site apaisant et digne qui guide les familles avant, pendant et après les obsèques, présente cérémonies, prévoyance, administratif, services à distance et espace hommage privé.',
            positioning: {
                audience: 'Familles endeuillées, proches éloignés et personnes souhaitant anticiper leurs volontés.',
                promise: 'Comprendre les démarches, choisir une cérémonie et être accompagné avec douceur, discrétion et clarté.',
                tone: 'Apaisant, digne, humain, moderne, lumineux et jamais froid.',
                differentiator: 'La proposition traite démarches, cérémonies, prévoyance, administratif, familles éloignées et hommage privé sans basculer vers hôtel, mobilité ou service médical.',
            },
            styleGuide: {
                direction: 'Maison funéraire nouvelle génération : lumière douce, ivoire, sauge, bleu brume, lignes calmes, espace hommage privé et parcours démarches très lisible.',
                colors: 'Ivoire chaud, sauge doux, bleu brume, argile claire, doré discret et gris plume.',
                typography: 'Sans-serif douce et très lisible, titres sobres, textes courts et rassurants.',
                layout: 'Hero accompagnement, démarches avant/pendant/après, cérémonies, prévoyance, administratif, familles éloignées, espace hommage privé et contact discret.',
            },
            visualConcept: {
                heroComposition: 'Scène lumineuse et sobre avec chemin de démarches, carte cérémonie, capsule hommage privé et contact discret.',
                ambience: 'Apaisante, digne, moderne et chaleureuse, sans noir dominant, sans marbre et sans froideur médicale.',
                colorPalette: ['ivoire chaud', 'sauge doux', 'bleu brume', 'argile claire', 'doré discret', 'gris plume'],
                imageKeywords: ['maison funéraire lumineuse', 'accompagnement familles', 'cérémonie hommage', 'souvenirs photos messages', 'démarches obsèques'],
                layoutSignature: 'Parcours famille avec démarches, cérémonies, prévoyance, administratif, distance et hommage privé.',
                microInteractions: ['étapes démarches qui se déplient', 'espace hommage verrouillé', 'souvenirs déposés avec douceur'],
                signatureMoment: 'La famille voit les étapes essentielles, puis accède à un espace hommage privé pour messages, photos et souvenirs.',
                wowFactor: 'Le visiteur comprend immédiatement une maison funéraire moderne, humaine et digne.',
            },
            siteModel: {
                name: 'Direction maison funéraire apaisée',
                description: 'Une structure sobre et complète pour accompagner les familles, expliquer les démarches et ouvrir un espace hommage privé.',
                sections: ['Démarches accompagnées', 'Cérémonies', 'Prévoyance', 'Administratif', 'Familles éloignées', 'Espace hommage privé'],
            },
            pages: [
                { name: 'Accueil', goal: 'Présenter une maison funéraire humaine, discrète, moderne et apaisante.' },
                { name: 'Démarches', goal: 'Expliquer clairement les étapes avant, pendant et après les obsèques.' },
                { name: 'Cérémonies', goal: 'Présenter cérémonies civiles, religieuses et temps personnalisés.' },
                { name: 'Prévoyance', goal: 'Expliquer les contrats de prévoyance et l’anticipation sereine.' },
                { name: 'Accompagnement administratif', goal: 'Rassurer sur les documents, déclarations et démarches auprès des organismes.' },
                { name: 'Familles éloignées', goal: 'Prévoir les services à distance, visio, partage d’informations et coordination familiale.' },
                { name: 'Espace hommage privé', goal: 'Permettre aux proches de déposer messages, photos et souvenirs dans un espace protégé.' },
                { name: 'Contact & urgence', goal: 'Donner un accès immédiat, discret et rassurant à une personne disponible.' },
            ],
            homeSections: [
                { title: 'Démarches accompagnées', text: 'Les étapes avant, pendant et après les obsèques sont expliquées simplement, sans surcharge.' },
                { title: 'Cérémonies et prévoyance', text: 'Cérémonies civiles ou religieuses, volontés et contrats de prévoyance sont présentés avec délicatesse.' },
                { title: 'Hommage privé', text: 'Les proches peuvent déposer messages, photos et souvenirs dans un espace protégé.' },
            ],
            services: [
                { name: 'Organisation des obsèques', description: 'Accompagnement humain pour les démarches, choix de cérémonie et coordination.' },
                { name: 'Administratif & prévoyance', description: 'Aide aux documents, déclarations, contrats et anticipation des volontés.' },
                { name: 'Espace hommage privé', description: 'Messages, photos, souvenirs et partage discret pour les proches.' },
            ],
            ctas: ['Être accompagné maintenant', 'Créer un espace hommage', 'Préparer une prévoyance'],
            seo: {
                keywords: ['maison funéraire', 'pompes funèbres modernes', 'organisation obsèques', 'cérémonie civile religieuse', 'espace hommage privé'],
                searchExpressions: ['maison funéraire accompagnement humain', 'organisation obsèques démarches', 'espace hommage privé messages photos', 'contrat prévoyance obsèques'],
                titles: [`${siteName} - Maison funéraire humaine et moderne`, 'Obsèques, démarches, cérémonies et hommage privé'],
                metaDescription: `${siteName} accompagne les familles avant, pendant et après les obsèques avec démarches claires, cérémonies, prévoyance, administratif, services à distance et espace hommage privé.`,
            },
            seoKeywords: ['maison funéraire', 'obsèques', 'cérémonie', 'prévoyance', 'hommage privé', 'accompagnement administratif'],
            recommendedServices: [
                { name: 'Parcours démarches obsèques', reason: 'Le brief demande une lecture claire avant, pendant et après les obsèques.', priceFrom: 'Projet spécifique' },
                { name: 'Espace hommage privé', reason: 'Permettre aux proches de déposer messages, photos et souvenirs dans un cadre protégé.', priceFrom: 'Projet spécifique' },
                { name: 'Accompagnement administratif', reason: 'Rassurer les familles sur les documents, déclarations et organismes.', priceFrom: 'Inclus selon offre' },
                { name: 'Services familles éloignées', reason: 'Prévoir coordination à distance, informations partagées et accès sécurisé.', priceFrom: 'Projet spécifique' },
                { name: 'Pages prévoyance', reason: 'Expliquer contrats et anticipation sans ton commercial agressif.', priceFrom: 'Inclus selon offre' },
            ],
        };

        funeralProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            'Besoin de départ : maison funéraire moderne avec démarches, cérémonies, prévoyance, administratif, familles éloignées et espace hommage privé.',
            'Type de projet : site maison funéraire nouvelle génération',
            'Slogan proposé : Présence calme, démarches claires.',
            `Pages proposées : ${funeralProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Être accompagné maintenant, Créer un espace hommage, Préparer une prévoyance',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return funeralProposal;
    }

    if (briefSectorLocks.seniorMobility || acceptsGeneratedSector('senior-mobility')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(conciergerie|automobile|auto|vehicule|controle technique|convoyage|nettoyage|comptine|luna|jeu|gaming|portfolio)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const mobilityProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'senior-mobility',
        };

        mobilityProposal.seo = {
            ...(mobilityProposal.seo || {}),
            titles: [`${siteName} - Transport accompagné senior`, 'Trajets réguliers, sécurité et partenariats'],
            metaDescription: `${siteName} accompagne les personnes âgées ou à mobilité réduite avec trajets ponctuels ou réguliers, sécurité, aide humaine, zones couvertes, tarifs et partenariats.`,
        };
        mobilityProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site service de transport accompagné',
            'Slogan proposé : Bouger accompagné, rester autonome.',
            `Pages proposées : ${mobilityProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Réserver un trajet, Demander un trajet régulier, Devenir partenaire',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return mobilityProposal;
    }

    if (briefSectorLocks.privateSchool || acceptsGeneratedSector('private-school')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(luna|comptine|jeu|jouer|automobile|conciergerie|vehicule|finance|compta|portfolio|dream|reve)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const schoolProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'private-school',
        };

        schoolProposal.seo = {
            ...(schoolProposal.seo || {}),
            titles: [`${siteName} - École privée maternelle, primaire et collège`, 'Projet pédagogique, inscriptions et vie scolaire'],
            metaDescription: `${siteName} présente son projet pédagogique, ses niveaux, son équipe, ses activités, sa restauration, ses horaires, ses inscriptions, son agenda, ses actualités, ses documents et sa visite virtuelle.`,
        };
        schoolProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site institutionnel école privée',
            'Slogan proposé : Grandir, apprendre, s’épanouir.',
            `Pages proposées : ${schoolProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander une visite, Inscrire mon enfant, Accès familles',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return schoolProposal;
    }

    if (briefSectorLocks.crisisManagement || acceptsGeneratedSector('crisis-management')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(cabinet|avocats?|renovation|energie|dpe|rge|travaux|isolation|compta|restaurant|fitness|ecole|medical|reeducation)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const crisisProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'crisis-management',
            projectType: 'Site agence de gestion de crise',
            layoutVariant: 'classic-conversion',
            visualMood: 'crisis-strategy-sober',
            slogan: 'Stabiliser. Protéger. Répondre.',
            showGallery: false,
            summary: 'Une proposition stratégique pour une agence de gestion de crise médiatique, juridique, sociale, cyber et réputationnelle.',
            valueProposition: 'Un site sobre et rassurant qui donne un accès rapide aux entreprises déjà en crise, explique les scénarios, la méthode, les expertises, les interventions d’urgence et les formations de préparation.',
            positioning: {
                audience: 'Dirigeants, directions juridiques, équipes communication, DRH, RSSI et comités exécutifs.',
                promise: 'Qualifier une situation sensible, activer une réponse confidentielle et coordonner les bons experts.',
                tone: 'Sobre, stratégique, confidentiel, ferme et rassurant.',
                differentiator: 'La proposition traite l’urgence, les scénarios, la méthode, les expertises et la préparation sans basculer vers un autre métier.',
            },
            styleGuide: {
                direction: 'Gestion de crise premium : fond nuit sobre, cartographie des scénarios, ligne de décision, accès urgence, formulaire confidentiel et preuves méthodologiques.',
                colors: 'Bleu nuit, graphite, ivoire discret, ambre alerte, cyan décision et rouge sourd mesuré.',
                typography: 'Sans-serif institutionnelle, titres courts, messages de confiance et labels confidentiels très lisibles.',
                layout: 'Hero urgence, scénarios de crise, méthodologie, expertises mobilisées, dirigeants/directions, formations et formulaire confidentiel.',
            },
            visualConcept: {
                heroComposition: 'Table de crise stylisée avec scénarios médiatique, juridique, social, cyber et réputation, bouton urgence et capsule confidentielle.',
                ambience: 'Sobre, stratégique, calme sous pression et rassurante, sans décor juridique traditionnel ni ancien univers métier.',
                colorPalette: ['bleu nuit', 'graphite', 'ivoire discret', 'ambre alerte', 'cyan décision', 'rouge sourd'],
                imageKeywords: ['cellule de crise', 'communication de crise', 'cyber crise', 'dirigeants réunion stratégique', 'réputation entreprise'],
                layoutSignature: 'Parcours crise avec accès urgence, scénarios, méthode de réponse, expertises, formation et formulaire confidentiel.',
                microInteractions: ['scénario de crise sélectionné', 'niveau d’urgence activé', 'formulaire confidentiel verrouillé'],
                signatureMoment: 'Le dirigeant choisit un scénario de crise et voit immédiatement la méthode, les experts et l’accès confidentiel.',
                wowFactor: 'Le visiteur comprend une agence de gestion de crise, sans impression de secteur voisin recyclé.',
            },
            siteModel: {
                name: 'Direction gestion de crise',
                description: 'Une structure stratégique avec accès urgence, scénarios, méthode, expertises, formations et formulaire confidentiel.',
                sections: ['Accès urgence', 'Scénarios de crise', 'Méthodologie', 'Expertises mobilisées', 'Dirigeants & directions', 'Formations', 'Formulaire confidentiel'],
            },
            recommendedOffer: 'Projet spécifique',
            pages: [
                { name: 'Accueil', goal: 'Présenter l’agence comme un partenaire stratégique en situation sensible.' },
                { name: 'Urgence crise', goal: 'Donner un accès rapide aux entreprises déjà en crise.' },
                { name: 'Scénarios de crise', goal: 'Distinguer crise médiatique, juridique, sociale, cyber et réputationnelle.' },
                { name: 'Méthodologie', goal: 'Expliquer diagnostic, cellule de crise, messages, coordination et stabilisation.' },
                { name: 'Expertises mobilisées', goal: 'Présenter communication, juridique, social, cyber, dirigeants et relations médias.' },
                { name: 'Dirigeants & directions', goal: 'Créer une section pour dirigeants, directions juridiques et équipes communication.' },
                { name: 'Formations préparation', goal: 'Présenter simulations, media training, protocoles et exercices de préparation.' },
                { name: 'Formulaire confidentiel', goal: 'Permettre une prise de contact discrète avec informations sensibles protégées.' },
                { name: 'Contact', goal: 'Centraliser téléphone prioritaire, disponibilité et demande confidentielle.' },
            ],
            homeSections: [
                { title: 'Accès urgence confidentiel', text: 'Une entreprise déjà en crise trouve immédiatement le canal prioritaire et discret.' },
                { title: 'Scénarios maîtrisés', text: 'Crises médiatiques, juridiques, sociales, cyber et réputationnelles sont séparées clairement.' },
                { title: 'Méthode et préparation', text: 'Cellule de crise, messages, expertises et formations montrent une réponse structurée.' },
            ],
            services: [
                { name: 'Intervention d’urgence', description: 'Qualification rapide, cellule de crise, priorités et premières réponses.' },
                { name: 'Communication de crise', description: 'Messages, porte-parole, relations médias, réseaux sociaux et réputation.' },
                { name: 'Formations préparation', description: 'Simulations, media training, protocoles et exercices de décision.' },
            ],
            ctas: ['Activer une cellule de crise', 'Demander un échange confidentiel', 'Préparer mon équipe'],
            seo: {
                keywords: ['agence gestion de crise', 'communication de crise', 'crise réputation entreprise', 'crise cyber médiatique juridique sociale', 'formation gestion de crise'],
                searchExpressions: ['agence gestion de crise entreprise', 'communication de crise réputation', 'intervention urgence crise médiatique cyber', 'formation cellule de crise dirigeants'],
                titles: [`${siteName} - Gestion de crise entreprise`, 'Urgence, méthode, réputation et préparation'],
                metaDescription: `${siteName} accompagne les entreprises en crise médiatique, juridique, sociale, cyber ou réputationnelle avec accès urgence, méthodologie, expertises, formations et formulaire confidentiel.`,
            },
            seoKeywords: ['gestion de crise', 'communication de crise', 'crise cyber', 'réputation entreprise', 'formulaire confidentiel', 'formation crise'],
            recommendedServices: [
                { name: 'Accès urgence crise', reason: 'Les entreprises déjà en crise doivent pouvoir agir sans chercher.', priceFrom: 'Projet spécifique' },
                { name: 'Formulaire confidentiel', reason: 'Le brief demande un contact discret adapté aux situations sensibles.', priceFrom: 'Projet spécifique' },
                { name: 'Scénarios de crise', reason: 'Structurer crise médiatique, juridique, sociale, cyber et réputationnelle.', priceFrom: 'Projet spécifique' },
                { name: 'Pages dirigeants / directions', reason: 'Séparer dirigeants, directions juridiques et équipes communication.', priceFrom: 'Inclus selon offre' },
                { name: 'Formations préparation', reason: 'Présenter simulations, media training et protocoles de préparation.', priceFrom: 'Projet spécifique' },
            ],
        };

        crisisProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            'Besoin de départ : agence de gestion de crise avec scénarios médiatique, juridique, sociale, cyber et réputationnelle, accès urgence, méthode, expertises, formations et formulaire confidentiel.',
            'Type de projet : site agence de gestion de crise',
            'Slogan proposé : Stabiliser. Protéger. Répondre.',
            `Pages proposées : ${crisisProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Activer une cellule de crise, Demander un échange confidentiel, Préparer mon équipe',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return crisisProposal;
    }

    if (briefSectorLocks.sportsRehab || acceptsGeneratedSector('sports-rehab')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(studio centre|centre de reeducation|reeducation sportive|fitness|gym|box|club|ecole|academie|restaurant|compta|auto|conciergerie|immobili|centre medical|medical center|dream|reve|luna)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const sportsRehabProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'sports-rehab',
            projectType: 'Site centre de rééducation sportive',
            layoutVariant: 'classic-conversion',
            visualMood: 'sports-rehab-technical',
            slogan: 'Reprendre fort, reprendre juste.',
            showGallery: true,
            summary: 'Une proposition claire pour un centre de rééducation sportive avec équipe pluridisciplinaire, parcours blessure/sport/reprise, équipements, protocoles, bilans, prévention et suivi à distance.',
            valueProposition: 'Un site technique, dynamique et rassurant qui aide les sportifs amateurs et professionnels à choisir le bon parcours de reprise sans ressembler à une salle de fitness.',
            positioning: {
                audience: 'Sportifs amateurs, sportifs professionnels, clubs, familles de jeunes sportifs et prescripteurs médicaux.',
                promise: 'Choisir un parcours selon sa blessure, son sport ou son objectif de reprise.',
                tone: 'Technique, dynamique, médical sportif, précis et humain.',
                differentiator: 'La proposition verrouille blessure, sport, reprise, équipe pluridisciplinaire, protocoles, bilans et suivi à distance au lieu de recycler un centre médical générique.',
            },
            styleGuide: {
                direction: 'Rééducation sportive premium : plateau technique, tests fonctionnels, lignes de mouvement, cartes parcours et indicateurs de protocole.',
                colors: 'Bleu clinique profond, cyan mesure, orange reprise, blanc technique, graphite et vert validation.',
                typography: 'Sans-serif technique très lisible, titres courts, labels de protocole et statuts précis.',
                layout: 'Hero parcours blessure/sport/reprise, équipe pluridisciplinaire, équipements, protocoles, bilans, prévention, suivi à distance et contact.',
            },
            visualConcept: {
                heroComposition: 'Plateau de rééducation avec sportif en test, choix blessure/sport/reprise, jauge de protocole et cartes équipe.',
                ambience: 'Technique, dynamique, sportive médicale et lumineuse, sans ambiance salle de fitness.',
                colorPalette: ['bleu clinique profond', 'cyan mesure', 'orange reprise', 'blanc technique', 'graphite', 'vert validation'],
                imageKeywords: ['rééducation sportive', 'kinésithérapie sport', 'médecine du sport', 'bilan fonctionnel', 'retour terrain'],
                layoutSignature: 'Parcours médical sportif guidé par blessure, sport ou objectif, avec preuves d’équipement, protocoles et suivi.',
                microInteractions: ['filtre blessure actif', 'niveau de reprise qui progresse', 'exercice de suivi à distance validé'],
                signatureMoment: 'Le sportif choisit blessure, sport ou objectif, puis voit l’équipe, le bilan et le protocole adaptés.',
                wowFactor: 'Le visiteur comprend un centre de rééducation sportive, pas une salle de fitness ni un centre médical générique.',
            },
            siteModel: {
                name: 'Direction rééducation sportive',
                description: 'Une structure qui relie équipe médicale sportive, parcours blessure/sport/reprise, protocoles, bilans, prévention et suivi à distance.',
                sections: ['Parcours blessure', 'Parcours par sport', 'Objectif reprise', 'Équipe pluridisciplinaire', 'Équipements & protocoles', 'Bilans & prévention', 'Suivi à distance'],
            },
            recommendedOffer: 'Projet spécifique',
            pages: [
                { name: 'Accueil', goal: 'Présenter un centre de rééducation sportive technique, humain et orienté reprise.' },
                { name: 'Équipe pluridisciplinaire', goal: 'Présenter kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques et nutritionnistes.' },
                { name: 'Parcours blessure', goal: 'Orienter selon entorse, rupture, tendinite, genou, épaule, cheville, dos ou douleur récurrente.' },
                { name: 'Parcours par sport', goal: 'Adapter l’accompagnement au running, football, tennis, basket, cyclisme, combat ou sport collectif.' },
                { name: 'Objectif reprise', goal: 'Guider selon reprise amateur, retour compétition, prévention rechute ou performance durable.' },
                { name: 'Équipements & protocoles', goal: 'Montrer plateau technique, tests, outils de mesure et protocoles de rééducation.' },
                { name: 'Bilans & prévention', goal: 'Expliquer bilans fonctionnels, programmes de prévention et suivi des progrès.' },
                { name: 'Suivi à distance', goal: 'Présenter exercices, télé-suivi, contrôle des charges et coordination après les séances.' },
                { name: 'Contact', goal: 'Permettre une demande de rendez-vous, de bilan ou d’orientation parcours.' },
            ],
            homeSections: [
                { title: 'Parcours blessure, sport, reprise', text: 'Le visiteur choisit son entrée : blessure, discipline ou objectif de retour au terrain.' },
                { title: 'Équipe sportive médicale', text: 'Kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques et nutritionnistes sont identifiés.' },
                { title: 'Bilans, protocoles, suivi', text: 'Équipements, tests fonctionnels, prévention et suivi à distance rendent la méthode concrète.' },
            ],
            services: [
                { name: 'Bilans fonctionnels', description: 'Tests de mobilité, force, charge, douleur, asymétrie et préparation au retour terrain.' },
                { name: 'Protocoles de rééducation', description: 'Programmes par blessure, sport et objectif avec progression mesurable.' },
                { name: 'Suivi à distance', description: 'Exercices, contrôle des charges, prévention rechute et lien avec l’équipe.' },
            ],
            ctas: ['Choisir mon parcours', 'Prendre rendez-vous', 'Démarrer un suivi'],
            seo: {
                keywords: ['centre de rééducation sportive', 'kinésithérapie du sport', 'médecin du sport', 'bilan fonctionnel sportif', 'retour au sport'],
                searchExpressions: ['centre de rééducation sportive + ville', 'kiné du sport retour terrain', 'bilan fonctionnel sportif', 'rééducation blessure sportif'],
                titles: [`${siteName} - Rééducation sportive`, 'Blessure, sport, reprise et suivi à distance'],
                metaDescription: `${siteName} accompagne sportifs amateurs et professionnels avec kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques, nutritionnistes, parcours blessure/sport/reprise, équipements, protocoles, bilans, prévention et suivi à distance.`,
            },
            seoKeywords: ['rééducation sportive', 'kinésithérapie sport', 'médecin du sport', 'bilan fonctionnel', 'retour au sport', 'prévention blessure'],
            recommendedServices: [
                { name: 'Parcours blessure / sport', reason: 'Le visiteur doit choisir une orientation selon blessure, sport ou objectif de reprise.', priceFrom: 'Projet spécifique' },
                { name: 'Annuaire équipe pluridisciplinaire', reason: 'Présenter kinésithérapeutes, médecins du sport, ostéopathes, préparateurs physiques et nutritionnistes.', priceFrom: 'Projet spécifique' },
                { name: 'Protocoles et bilans', reason: 'Rendre visibles tests, équipements, protocoles, bilans fonctionnels et progression.', priceFrom: 'Projet spécifique' },
                { name: 'Suivi à distance', reason: 'Permettre l’accompagnement entre deux séances avec exercices et contrôle des charges.', priceFrom: 'Projet spécifique' },
                { name: 'Programmes prévention', reason: 'Valoriser prévention des rechutes et retour durable au sport.', priceFrom: 'Inclus selon offre' },
            ],
        };

        sportsRehabProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site centre de rééducation sportive',
            'Slogan proposé : Reprendre fort, reprendre juste.',
            `Pages proposées : ${sportsRehabProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Choisir mon parcours, Prendre rendez-vous, Démarrer un suivi',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return sportsRehabProposal;
    }

    if (briefSectorLocks.medicalCenter || acceptsGeneratedSector('medical-center')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(reve|rêve|dream|portail|onirique|traversee|traversée|kilometre|kilomètre|voyage|travel|nexa|talent|finance|compta|luna|comptine)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const medicalProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
            sectorKey: 'medical-center',
            projectType: 'Site centre médical pluridisciplinaire',
            layoutVariant: 'classic-conversion',
            visualMood: 'medical-warm-professional',
            slogan: 'Des soins coordonnés, simplement accessibles.',
            showGallery: false,
            summary: 'Une proposition claire pour un centre médical pluridisciplinaire avec spécialités, praticiens filtrables, rendez-vous, prévention, accès, urgence et espace professionnels.',
            valueProposition: 'Un site patient d’abord, chaleureux mais professionnel, qui aide à comprendre les spécialités, trouver un praticien et demander un rendez-vous sans devenir une plateforme hospitalière froide.',
            positioning: {
                audience: 'Patients, familles et professionnels de santé souhaitant rejoindre le centre.',
                promise: 'Comprendre les spécialités, filtrer les praticiens et demander un rendez-vous rapidement.',
                tone: 'Médical, humain, clair, rassurant et organisé.',
                differentiator: 'La maquette distingue parcours patient, prévention, accès urgent et espace professionnels dans une structure concrète.',
            },
            styleGuide: {
                direction: 'Centre médical chaleureux : fond clair, bleu santé doux, vert apaisant, cartes praticiens, filtres visibles, accès rapide rendez-vous et urgence.',
                colors: 'Blanc clinique chaleureux, bleu santé doux, vert apaisant, gris texte, accent corail très discret pour urgence.',
                typography: 'Sans-serif lisible, titres contenus, hiérarchie dense mais respirante pour scanner rapidement.',
                layout: 'Accueil clair, spécialités, filtres praticiens, rendez-vous, prévention santé, espace professionnels, accès et urgence.',
            },
            visualConcept: {
                heroComposition: 'Hero clair avec barre de recherche spécialité, filtres praticiens, bouton rendez-vous et encart urgence discret.',
                ambience: 'Professionnelle, humaine, rassurante et organisée, avec une présence médicale concrète.',
                colorPalette: ['blanc chaleureux', 'bleu santé doux', 'vert apaisant', 'gris ardoise', 'corail urgence discret'],
                imageKeywords: ['centre médical moderne', 'praticiens santé', 'cabinet médical lumineux', 'patients accueil', 'kinésithérapie pédiatrie psychologie'],
                layoutSignature: 'Interface patient lisible avec spécialités, praticiens filtrables, prévention, accès et espace professionnels séparé.',
                microInteractions: ['filtre spécialité actif', 'disponibilité praticien mise en évidence', 'contact urgent accessible sans alarme visuelle'],
                signatureMoment: 'Le patient choisit une spécialité, voit les praticiens disponibles et comprend comment demander un rendez-vous.',
                wowFactor: 'Le visiteur voit immédiatement un centre médical pluridisciplinaire clair, humain et organisé.',
            },
            siteModel: {
                name: 'Direction centre médical clair',
                description: 'Une structure médicale lisible pour patients et professionnels : spécialités, praticiens, filtres, rendez-vous, prévention, accès et urgence.',
                sections: ['Recherche spécialité', 'Praticiens filtrables', 'Rendez-vous', 'Prévention santé', 'Rejoindre le centre', 'Accès & urgence'],
            },
            recommendedOffer: 'Projet spécifique',
            pages: [
                { name: 'Accueil', goal: 'Présenter le centre, les spécialités et les accès rapides patient.' },
                { name: 'Spécialités', goal: 'Expliquer généralistes, pédiatres, sages-femmes, psychologues et kinésithérapeutes.' },
                { name: 'Praticiens', goal: 'Afficher les profils filtrables par spécialité, disponibilité et langue parlée.' },
                { name: 'Rendez-vous', goal: 'Permettre une demande de rendez-vous claire.' },
                { name: 'Prévention santé', goal: 'Publier conseils, campagnes et informations utiles.' },
                { name: 'Rejoindre le centre', goal: 'Créer un espace distinct pour les professionnels intéressés.' },
                { name: 'Accès & urgence', goal: 'Afficher adresse, transports, horaires et contact urgent.' },
                { name: 'Contact', goal: 'Centraliser formulaire, téléphone et informations pratiques.' },
            ],
            homeSections: [
                { title: 'Spécialités lisibles', text: 'Généralistes, pédiatres, sages-femmes, psychologues et kinés sont présentés sans surcharge.' },
                { title: 'Praticiens filtrables', text: 'Les patients filtrent par spécialité, disponibilité et langue parlée avant de demander un rendez-vous.' },
                { title: 'Accès, prévention, urgence', text: 'Prévention santé, informations d’accès et contact urgent restent visibles sans ambiance hospitalière froide.' },
            ],
            services: [
                { name: 'Annuaire praticiens', description: 'Profils, spécialités, langues parlées, disponibilités et accès rendez-vous.' },
                { name: 'Parcours patient', description: 'Spécialités, prévention, accès, urgence et demande de rendez-vous.' },
                { name: 'Espace professionnels', description: 'Présentation du centre et formulaire pour rejoindre l’équipe.' },
            ],
            ctas: ['Demander un rendez-vous', 'Trouver un praticien', 'Rejoindre le centre'],
            seo: {
                keywords: ['centre médical pluridisciplinaire', 'médecin généraliste pédiatre sage-femme psychologue kiné', 'rendez-vous centre médical', 'praticiens santé'],
                searchExpressions: ['centre médical pluridisciplinaire + ville', 'prendre rendez-vous médecin généraliste pédiatre kiné', 'centre santé praticiens langue parlée', 'rejoindre centre médical'],
                titles: [`${siteName} - Centre médical pluridisciplinaire`, 'Spécialités, praticiens et rendez-vous'],
                metaDescription: `${siteName} regroupe généralistes, pédiatres, sages-femmes, psychologues et kinésithérapeutes avec profils praticiens, filtres, rendez-vous, prévention, accès et contact urgent.`,
            },
            seoKeywords: ['centre médical', 'praticiens', 'rendez-vous', 'prévention santé', 'spécialités médicales'],
            recommendedServices: [
                { name: 'Annuaire praticiens filtrable', reason: 'Permettre aux patients de filtrer par spécialité, disponibilité et langue parlée.', priceFrom: 'Projet spécifique' },
                { name: 'Demande de rendez-vous', reason: 'Orienter les patients selon praticien, spécialité ou disponibilité.', priceFrom: 'Projet spécifique' },
                { name: 'Espace professionnels', reason: 'Séparer les demandes des praticiens du parcours patient.', priceFrom: 'Projet spécifique' },
                { name: 'Prévention santé', reason: 'Publier conseils et campagnes dans un ton humain.', priceFrom: 'Inclus selon offre' },
                { name: 'Accès et urgence', reason: 'Rendre accès, horaires et contact urgent immédiatement lisibles.', priceFrom: 'Inclus selon offre' },
            ],
        };

        medicalProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            'Besoin de départ : centre médical pluridisciplinaire avec spécialités, praticiens filtrables, rendez-vous, prévention, accès, urgence et espace professionnels.',
            'Type de projet : site centre médical pluridisciplinaire',
            'Slogan proposé : Des soins coordonnés, simplement accessibles.',
            `Pages proposées : ${medicalProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander un rendez-vous, Trouver un praticien, Rejoindre le centre',
            'Offre pressentie : Projet spécifique',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return medicalProposal;
    }

    if (!briefSectorLocks.seniorMobility && (briefSectorLocks.automotiveConcierge || acceptsGeneratedSector('automotive-concierge'))) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(kilometre|kilomètre|voyage|travel|destination|itineraire|itinéraire|escapade|road trip|nexa|talent|recrut|candidat|portfolio|showreel|maison pilote|maison roue|finance|compta|conta|directcompt|luna|comptine|robe|couture)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const automotiveProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
        };

        automotiveProposal.seo = {
            ...(automotiveProposal.seo || {}),
            titles: [`${siteName} - Conciergerie automobile premium`, 'Entretien, nettoyage, contrôle technique et convoyage'],
            metaDescription: `${siteName} propose une conciergerie automobile haut de gamme : entretien, nettoyage, contrôle technique, convoyage, suivi et demande de prise en charge.`,
        };
        automotiveProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site conciergerie automobile premium',
            'Slogan proposé : Votre véhicule, pris en charge.',
            `Pages proposées : ${automotiveProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Demander une prise en charge, Voir les forfaits, Comprendre le fonctionnement',
            'Offre pressentie : Offre Signature',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return automotiveProposal;
    }

    if (briefSectorLocks.childFashion || acceptsGeneratedSector('kids-fashion')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(nexa|talent|recrut|candidat|maison pilote|maison roue|finance|compta|conta|directcompt|conciergerie|automobile|garage|convoyage|controle technique|comptine|jeux educatifs|espace parent)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const kidsFashionProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
        };

        kidsFashionProposal.seo = {
            ...(kidsFashionProposal.seo || {}),
            titles: [`${siteName} - Vêtements enfants colorés et durables`, 'Collections, matières, tailles et boutique'],
            metaDescription: `${siteName} présente des vêtements colorés et durables pour enfants de 2 à 8 ans, avec collections, matières, engagements, guide des tailles et boutique.`,
        };
        kidsFashionProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : boutique mode enfant durable',
            'Slogan proposé : Des couleurs qui grandissent bien.',
            `Pages proposées : ${kidsFashionProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Voir les collections, Ouvrir la boutique, Guide des tailles',
            'Offre pressentie : Offre Pro',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return kidsFashionProposal;
    }

    if (briefSectorLocks.boxingClub || acceptsGeneratedSector('boxing-club')) {
        const generatedName = normalizeText(sanitized.siteName);
        const keepName = generatedName && !/\b(portfolio|showreel|studio creatif|studio créatif)\b/i.test(generatedName);
        const siteName = keepName ? generatedName : fallback.siteName;
        const boxingProposal = {
            ...sanitized,
            ...fallback,
            mode: sanitized.mode,
            siteName,
        };

        boxingProposal.seo = {
            ...(boxingProposal.seo || {}),
            titles: [`${siteName} - Club de boxe pour femmes`, 'Cours, planning et essai découverte'],
            metaDescription: `${siteName} présente les cours de boxe pour femmes, le planning, les coachs, les tarifs et la séance d’essai découverte.`,
        };
        boxingProposal.contactMessage = [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            'Type de projet : site club de boxe pour femmes',
            'Slogan proposé : Frappez fort. Entrez libre.',
            `Pages proposées : ${boxingProposal.pages.map((page) => page.name).join(', ')}`,
            'Actions conseillées : Réserver un essai, Voir le planning, Découvrir les cours',
            'Offre pressentie : Offre Pro',
            '',
            "Merci de me dire ce qu'il faut ajuster pour lancer le projet.",
        ].join('\n');

        return boxingProposal;
    }

    if (isAccountingProject(brief, sanitized)) {
        return enforceAccountingProposal(sanitized, fallback);
    }

    if (bridalProject || isBridalProject(brief, sanitized)) {
        return enforceBridalCoutureProposal(sanitized, fallback, brief);
    }

    return sanitized;
};

const sanitizeOpenAiProposalStrict = (proposal = {}) => {
    const normalizeItem = (item = {}) => ({
        name: normalizeDisplayText(item && (item.name || item.title || item.label)),
        title: normalizeDisplayText(item && item.title),
        label: normalizeDisplayText(item && item.label),
        goal: normalizeText(item && item.goal),
        text: normalizeText(item && item.text),
        description: normalizeText(item && item.description),
        reason: normalizeText(item && item.reason),
        priceFrom: normalizeText(item && item.priceFrom),
    });
    const cleanItems = (items, max = 8) => limitArray(items, max)
        .map(normalizeItem)
        .filter((item) => item.name || item.title || item.label || item.goal || item.text || item.description || item.reason);
    const cleanTextList = (items, max = 8) => limitArray(items, max).map(normalizeText).filter(Boolean);
    const cleanHex = (value = '') => {
        const color = normalizeText(value).toUpperCase();
        return /^#[0-9A-F]{6}$/.test(color) ? color : '';
    };
    const cleanArtifactItems = (items, max = 8) => limitArray(items, max)
        .map((item = {}) => ({
            label: normalizeDisplayText(item.label || item.name || item.title),
            value: normalizeDisplayText(item.value),
            detail: normalizeText(item.detail || item.description || item.text),
        }))
        .filter((item) => item.label || item.value || item.detail);
    const source = proposal && typeof proposal === 'object' ? proposal : {};
    const projectAnalysis = source.projectAnalysis && typeof source.projectAnalysis === 'object'
        ? source.projectAnalysis
        : {};
    const brandIdentity = source.brandIdentity && typeof source.brandIdentity === 'object'
        ? source.brandIdentity
        : {};
    const brandPalette = brandIdentity.palette && typeof brandIdentity.palette === 'object'
        ? brandIdentity.palette
        : {};
    const brandTypography = brandIdentity.typography && typeof brandIdentity.typography === 'object'
        ? brandIdentity.typography
        : {};
    const experienceBlueprint = source.experienceBlueprint && typeof source.experienceBlueprint === 'object'
        ? source.experienceBlueprint
        : {};
    const primaryArtifact = experienceBlueprint.primaryArtifact && typeof experienceBlueprint.primaryArtifact === 'object'
        ? experienceBlueprint.primaryArtifact
        : {};

    return {
        mode: 'openai',
        projectType: normalizeText(source.projectType),
        sectorKey: normalizeText(source.sectorKey),
        siteName: normalizeText(source.siteName),
        slogan: normalizeText(source.slogan),
        summary: normalizeText(source.summary),
        valueProposition: normalizeText(source.valueProposition),
        visualMood: normalizeDisplayText(source.visualMood),
        designVariant: Number.isFinite(Number(source.designVariant)) ? Number(source.designVariant) : 0,
        visualSeed: normalizeText(source.visualSeed),
        showGallery: Boolean(source.showGallery),
        revisionMode: normalizeText(source.revisionMode),
        layoutVariant: normalizeDisplayText(source.layoutVariant) || 'lumina-showcase',
        positioning: source.positioning && typeof source.positioning === 'object' ? {
            audience: normalizeText(source.positioning.audience),
            promise: normalizeText(source.positioning.promise),
            tone: normalizeText(source.positioning.tone),
            differentiator: normalizeText(source.positioning.differentiator),
        } : {},
        projectAnalysis: {
            activity: normalizeText(projectAnalysis.activity),
            sector: normalizeText(projectAnalysis.sector),
            target: normalizeText(projectAnalysis.target),
            goals: cleanTextList(projectAnalysis.goals, 6),
            features: cleanTextList(projectAnalysis.features, 8),
            tone: cleanTextList(projectAnalysis.tone, 5),
            constraints: cleanTextList(projectAnalysis.constraints, 8),
            existingElements: cleanTextList(projectAnalysis.existingElements, 8),
        },
        brandIdentity: {
            concept: normalizeText(brandIdentity.concept),
            promise: normalizeText(brandIdentity.promise),
            personality: cleanTextList(brandIdentity.personality, 5),
            visualMetaphor: normalizeText(brandIdentity.visualMetaphor),
            artDirection: normalizeText(brandIdentity.artDirection),
            palette: {
                canvas: cleanHex(brandPalette.canvas),
                surface: cleanHex(brandPalette.surface),
                ink: cleanHex(brandPalette.ink),
                muted: cleanHex(brandPalette.muted),
                accent: cleanHex(brandPalette.accent),
                accentAlt: cleanHex(brandPalette.accentAlt),
            },
            typography: {
                display: normalizeText(brandTypography.display),
                body: normalizeText(brandTypography.body),
                mode: normalizeText(brandTypography.mode),
            },
            composition: normalizeText(brandIdentity.composition),
            density: normalizeText(brandIdentity.density),
            shapeLanguage: normalizeText(brandIdentity.shapeLanguage),
            imageStrategy: normalizeText(brandIdentity.imageStrategy),
            signatureElement: normalizeText(brandIdentity.signatureElement),
            motion: cleanTextList(brandIdentity.motion, 5),
            avoid: cleanTextList(brandIdentity.avoid, 8),
        },
        experienceBlueprint: {
            openingMove: normalizeText(experienceBlueprint.openingMove),
            primaryArtifact: {
                type: normalizeText(primaryArtifact.type),
                label: normalizeDisplayText(primaryArtifact.label),
                title: normalizeDisplayText(primaryArtifact.title),
                status: normalizeDisplayText(primaryArtifact.status),
                items: cleanArtifactItems(primaryArtifact.items, 8),
            },
            proofModules: limitArray(experienceBlueprint.proofModules, 5)
                .map((item = {}) => ({
                    title: normalizeDisplayText(item.title || item.label),
                    metric: normalizeDisplayText(item.metric || item.value),
                    detail: normalizeText(item.detail || item.description || item.text),
                }))
                .filter((item) => item.title || item.metric || item.detail),
            flow: limitArray(experienceBlueprint.flow, 8)
                .map((item = {}) => ({
                    label: normalizeDisplayText(item.label || item.title || item.name),
                    detail: normalizeText(item.detail || item.description || item.text),
                }))
                .filter((item) => item.label || item.detail),
            contentPriority: cleanTextList(experienceBlueprint.contentPriority, 6),
        },
        styleGuide: source.styleGuide && typeof source.styleGuide === 'object' ? {
            direction: normalizeText(source.styleGuide.direction),
            colors: normalizeText(source.styleGuide.colors),
            typography: normalizeText(source.styleGuide.typography),
            layout: normalizeText(source.styleGuide.layout),
        } : {},
        visualConcept: normalizeVisualConcept(source, {}),
        narrativePlan: source.narrativePlan && typeof source.narrativePlan === 'object' ? source.narrativePlan : null,
        visualPlan: source.visualPlan && typeof source.visualPlan === 'object' ? source.visualPlan : null,
        siteModel: source.siteModel && typeof source.siteModel === 'object' ? {
            name: normalizeText(source.siteModel.name),
            description: normalizeText(source.siteModel.description),
            sections: limitArray(source.siteModel.sections, 8).map(normalizeDisplayText).filter(Boolean),
        } : {},
        recommendedOffer: normalizeText(source.recommendedOffer),
        briefProfile: source.briefProfile && typeof source.briefProfile === 'object' ? source.briefProfile : null,
        pages: cleanItems(source.pages, 8),
        homeSections: cleanItems(source.homeSections, 6),
        services: cleanItems(source.services, 8),
        ctas: limitArray(source.ctas, 5).map(normalizeText).filter(Boolean),
        seo: source.seo && typeof source.seo === 'object' ? {
            keywords: limitArray(source.seo.keywords, 8).map(normalizeText).filter(Boolean),
            searchExpressions: limitArray(source.seo.searchExpressions, 6).map(normalizeText).filter(Boolean),
            titles: limitArray(source.seo.titles, 4).map(normalizeText).filter(Boolean),
            metaDescription: normalizeText(source.seo.metaDescription),
        } : {},
        seoKeywords: limitArray(source.seoKeywords, 8).map(normalizeText).filter(Boolean),
        recommendedServices: cleanItems(source.recommendedServices, 8),
        clientAcquisition: limitArray(source.clientAcquisition, 6).map(normalizeText).filter(Boolean),
        explanation: limitArray(source.explanation, 5).map(normalizeText).filter(Boolean),
        appliedChanges: limitArray(source.appliedChanges, 5).map(normalizeText).filter(Boolean),
        revisionHistory: limitArray(source.revisionHistory, 5),
        contactMessage: normalize(source.contactMessage),
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

const detectFallbackSector = (text = '') => {
    const positiveText = getPositiveBriefText(text);
    const source = stripAccents(normalizeText(positiveText).toLowerCase());

    if (hasCrisisManagementIntent(positiveText)) return 'crisis-management';
    if (hasFuneralHomeIntent(positiveText)) return 'funeral-home';
    if (hasEnergyRenovationIntent(positiveText)) return 'energy-renovation';
    if (hasRestaurantManagementSaasIntent(positiveText)) return 'restaurant-management-saas';
    if (hasFutureBankIntent(source)) return 'future-bank';
    if (hasAccountingIntent(source)) return 'accounting';
    if (/\b(dashboard|saas|logiciel)\b/.test(source)) return 'saas';
    if (/\b(station spatiale|tourisme spatial|sejour orbital|orbital|orbite|apesanteur|vue sur la terre)\b/.test(source)) return 'space-station-tourism';
    if (/\b(ville flottante|cite flottante|cité flottante|ville autonome|quartiers flottants|energie renouvelable)\b/.test(source)) return 'floating-city';
    if (/\b(musee|musée|civilisations disparues|archeologie|archéologie|realite augmentee|mondes perdus|artefacts)\b/.test(source)) return 'future-museum';
    if (/\b(hotel sous marin|hotel sous-marin|hotel sous l ocean|suites panoramiques|restaurant immerge|spa marin|faune marine)\b/.test(source)) return 'underwater-hotel';
    if (/\b(bibliotheque|bibliothèque|mediatheque|médiathèque|livres?|lecture|lecteurs?|rayonnages?|archives|programme culturel|salle de lecture)\b/.test(source)) return 'library';
    if (/\b(ferme urbaine|ferme verticale|agritech|hydropon|aeropon|aéropon|serre|culture eclair|culture éclair|capteurs agricoles|tours vegetales|tours végétales)\b/.test(source)) return 'urban-farm';
    if (hasSeniorMobilityIntent(positiveText)) return 'senior-mobility';
    if (hasPrivateSchoolIntent(positiveText)) return 'private-school';
    if (hasAutomotiveConciergeIntent(positiveText)) return 'automotive-concierge';
    if (hasSportsRehabIntent(positiveText)) return 'sports-rehab';
    if (hasMedicalCenterIntent(positiveText)) return 'medical-center';
    if (hasChildFashionIntent(positiveText)) return 'kids-fashion';
    if (isKidsEducationBrief(positiveText)) return 'kids-app';
    if (/\b(immobilier|agence immobiliere|annonce|bien immobilier|estimation|mandat)\b/.test(source)) return 'real-estate';
    if (/\b(architect|architecture|architecte|villa|villas|beton|verre|maitre d oeuvre|design d interieur)\b/.test(source)) return 'architecture';
    if (/\b(voyage|voyages|tourisme|destination|destinations|itineraire|road trip|circuit|safari|agence de voyage|voyage sur mesure)\b/.test(source)) return 'travel';
    if (/\b(avocat|avocats|juridique|droit|juriste|notaire|honoraires)\b/.test(source)) return 'legal';
    if (hasBoxingIntent(source)) return 'boxing-club';
    if (/\b(salle de sport|fitness|coach sportif|coaching|nutrition|musculation|performance|espace membre)\b/.test(source)) return 'sport';
    if (/\b(veterinaire|clinique veterinaire|urgence veterinaire|fiches animaux)\b/.test(source)) return 'veterinary';
    if (/\b(robe|robes|robe de mariee|robe de mariage|mariee|mariage|couture|haute couture|atelier couture|collection mariee|essayage|dentelle|soie|voile|broderie|tulle|satin|bridal|wedding dress)\b/.test(source)) return 'bridal';
    if (hasFoodServiceIntent(positiveText)) return 'restaurant';
    if (/\b(jeu video|gaming|studio de jeu|trailer|discord|steam)\b/.test(source)) return 'gaming';
    if (/\b(musique|artiste|album|concert|discographie|clip)\b/.test(source)) return 'music';
    if (/\b(hotel|chambre|hebergement|gite|sejour|touristique)\b/.test(source)) return 'hotel';
    if (/\b(portfolio|cv|book|showreel)\b/.test(source)) return 'portfolio';
    return 'service';
};

const KIRBY_SITE_LAYOUT_VARIANTS = new Set([
    'finance-os',
    'story-world',
    'lumina-showcase',
    'cinematic-video',
    'gallery-focus',
    'minimal-editorial',
    'luxury-asymmetric',
    'product-dashboard',
    'warm-editorial',
    'classic-conversion',
]);

const KIRBY_IDENTITY_COMPOSITIONS = new Set([
    'artifact-led',
    'split-flow',
    'editorial-stack',
    'product-canvas',
    'immersive-sequence',
]);
const KIRBY_IDENTITY_TYPE_MODES = new Set([
    'modern-grotesk',
    'editorial-serif',
    'humanist',
    'technical-mono',
    'expressive-display',
]);
const KIRBY_IDENTITY_DENSITIES = new Set(['compact', 'balanced', 'airy']);
const KIRBY_IDENTITY_SHAPES = new Set(['precise', 'soft', 'framed', 'borderless']);
const KIRBY_IDENTITY_IMAGE_STRATEGIES = new Set(['product-proof', 'result-proof', 'service-proof', 'graphic-system']);
const KIRBY_IDENTITY_ARTIFACTS = new Set(['menu', 'workflow', 'dashboard', 'booking', 'catalog', 'timeline', 'comparison', 'story']);

const normalizeSiteSectorKey = (value = '') => stripAccents(normalizeText(value).toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeSiteLayoutVariant = (value = '') => stripAccents(normalizeText(value).toLowerCase())
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/^-+|-+$/g, '');

const hasAccountsPayableAutomationIntent = (value = '') => {
    const source = normalizeIntentText(value);
    const accountingContext = hasAccountingIntent(source);
    const supplierWorkflow = /\b(conta direct|contadirect|comptabilite fournisseurs?|factures? fournisseurs?|fiche fournisseur|bon de commande|rapprochement facture|circuit de validation|echeancier fournisseur|balance agee|preparation des paiements|detection des doublons|archivage documentaire)\b/.test(source);

    return accountingContext && supplierWorkflow;
};

const hasRestaurantDigitalMenuIntent = (value = '') => {
    const source = normalizeIntentText(value);

    return hasFoodServiceIntent(source)
        && /\b(qr|qr code|code qr|menu numerique|menu digital|carte numerique|carte digitale|carte en ligne|scanner le menu)\b/.test(source);
};

const getDefaultLayoutForSector = (sectorKey = '') => {
    const layouts = {
        accounting: 'finance-os',
        restaurant: 'gallery-focus',
        'restaurant-management-saas': 'product-dashboard',
        saas: 'product-dashboard',
        'kids-app': 'story-world',
        bridal: 'gallery-focus',
        architecture: 'gallery-focus',
        travel: 'gallery-focus',
        hotel: 'gallery-focus',
        portfolio: 'gallery-focus',
        gaming: 'cinematic-video',
        music: 'cinematic-video',
        legal: 'minimal-editorial',
    };

    return layouts[sectorKey] || 'lumina-showcase';
};

const finalizeOpenAiSiteProposal = ({ proposal = {}, brief = '' } = {}) => {
    const sanitized = sanitizeOpenAiProposalStrict(proposal);
    const detectedSector = detectFallbackSector(brief);
    const declaredSector = normalizeSiteSectorKey(sanitized.sectorKey);
    const highConfidenceSector = ['accounting', 'restaurant', 'restaurant-management-saas'].includes(detectedSector);
    const genericSector = !declaredSector || ['generic', 'general', 'site', 'website', 'service'].includes(declaredSector);
    const sectorKey = highConfidenceSector || genericSector ? detectedSector : declaredSector;
    const requestedLayout = normalizeSiteLayoutVariant(proposal && proposal.layoutVariant);
    const accountsPayableProject = hasAccountsPayableAutomationIntent(brief);
    const restaurantDigitalMenu = hasRestaurantDigitalMenuIntent(brief);

    sanitized.sectorKey = sectorKey || 'service';
    sanitized.layoutVariant = KIRBY_SITE_LAYOUT_VARIANTS.has(requestedLayout)
        ? requestedLayout
        : getDefaultLayoutForSector(sanitized.sectorKey);

    const identity = sanitized.brandIdentity;
    const blueprint = sanitized.experienceBlueprint;
    const artifact = blueprint.primaryArtifact;
    const compositionFallbacks = {
        'finance-os': 'product-canvas',
        'product-dashboard': 'product-canvas',
        'gallery-focus': 'split-flow',
        'minimal-editorial': 'editorial-stack',
        'luxury-asymmetric': 'artifact-led',
        'cinematic-video': 'immersive-sequence',
    };
    const artifactFallbacks = {
        accounting: 'workflow',
        restaurant: 'menu',
        'restaurant-management-saas': 'dashboard',
        saas: 'dashboard',
        hotel: 'booking',
        travel: 'booking',
        portfolio: 'story',
    };

    identity.composition = KIRBY_IDENTITY_COMPOSITIONS.has(normalizeSiteLayoutVariant(identity.composition))
        ? normalizeSiteLayoutVariant(identity.composition)
        : compositionFallbacks[sanitized.layoutVariant] || 'artifact-led';
    identity.typography.mode = KIRBY_IDENTITY_TYPE_MODES.has(normalizeSiteLayoutVariant(identity.typography.mode))
        ? normalizeSiteLayoutVariant(identity.typography.mode)
        : 'modern-grotesk';
    identity.density = KIRBY_IDENTITY_DENSITIES.has(normalizeSiteLayoutVariant(identity.density))
        ? normalizeSiteLayoutVariant(identity.density)
        : 'balanced';
    identity.shapeLanguage = KIRBY_IDENTITY_SHAPES.has(normalizeSiteLayoutVariant(identity.shapeLanguage))
        ? normalizeSiteLayoutVariant(identity.shapeLanguage)
        : 'precise';
    identity.imageStrategy = KIRBY_IDENTITY_IMAGE_STRATEGIES.has(normalizeSiteLayoutVariant(identity.imageStrategy))
        ? normalizeSiteLayoutVariant(identity.imageStrategy)
        : 'graphic-system';
    artifact.type = KIRBY_IDENTITY_ARTIFACTS.has(normalizeSiteLayoutVariant(artifact.type))
        ? normalizeSiteLayoutVariant(artifact.type)
        : artifactFallbacks[sanitized.sectorKey] || 'story';

    if (!artifact.label) artifact.label = sanitized.projectType || sanitized.projectAnalysis.activity || 'Expérience principale';
    if (!artifact.title) artifact.title = identity.promise || sanitized.valueProposition || sanitized.slogan;
    if (!artifact.status) artifact.status = 'Actif';

    if (!blueprint.proofModules.length) {
        blueprint.proofModules = sanitized.homeSections.slice(0, 3).map((section) => ({
            title: section.title,
            metric: '',
            detail: section.text,
        }));
    }

    if (!blueprint.flow.length) {
        blueprint.flow = sanitized.narrativePlan && Array.isArray(sanitized.narrativePlan.journey)
            ? sanitized.narrativePlan.journey.slice(0, 6).map((step = {}) => ({
                label: normalizeDisplayText(step.goal || step.stage),
                detail: normalizeText(step.message || step.expectedAction),
            })).filter((step) => step.label || step.detail)
            : [];
    }

    if (sanitized.sectorKey === 'accounting') {
        sanitized.layoutVariant = 'finance-os';
    }

    if (accountsPayableProject) {
        sanitized.sectorKey = 'accounting';
        sanitized.layoutVariant = 'finance-os';
        sanitized.visualMood = 'accounts-payable-automation';
        sanitized.projectType = 'Plateforme de comptabilité fournisseurs et automatisation';

        if (/\bconta\s*direct\b/i.test(brief)) {
            sanitized.siteName = 'Conta Direct';
        }

        artifact.type = 'workflow';
        artifact.label = artifact.label || 'Comptabilité fournisseurs';
        artifact.title = artifact.title || 'Traitement d’une facture';
        artifact.status = artifact.status || 'Contrôle en cours';
        if (!artifact.items.length) {
            artifact.items = [
                { label: 'Import', value: 'PDF · Photo · Scanner', detail: 'Document reçu' },
                { label: 'Extraction', value: 'Données reconnues', detail: 'Contrôle humain' },
                { label: 'Rapprochement', value: 'Commande vérifiée', detail: 'Doublons détectés' },
            ];
        }
        if (!blueprint.flow.length) {
            blueprint.flow = ['Reçu', 'Contrôlé', 'Validé', 'Payé', 'Comptabilisé', 'Archivé']
                .map((label) => ({ label, detail: '' }));
        }
    }

    if (restaurantDigitalMenu) {
        sanitized.sectorKey = 'restaurant';
        sanitized.layoutVariant = 'gallery-focus';
        sanitized.visualMood = 'restaurant-digital-menu';
        sanitized.showGallery = true;
        addProposalPage(sanitized, {
            name: 'Menu digital',
            goal: 'Présenter la carte sur mobile après lecture du QR code.',
        });
        addProposalSection(sanitized, {
            title: 'La carte sur mobile',
            text: 'Un QR code ouvre un menu lisible, à jour et sans téléchargement.',
        });
        addProposalCta(sanitized, 'Voir le menu');
        artifact.type = 'menu';
        artifact.label = artifact.label || 'Carte numérique';
        artifact.title = artifact.title || 'Le menu du moment';
        artifact.status = artifact.status || 'Menu à jour';
        if (!artifact.items.length) {
            artifact.items = [
                { label: 'La carte', value: 'Sur mobile', detail: 'Lisible sans application' },
                { label: 'Allergènes', value: 'Détaillés', detail: 'Information accessible' },
                { label: 'Réservation', value: 'Directe', detail: 'Depuis le menu' },
            ];
        }
    }

    return sanitized;
};

const isFallbackHardRebuildRequest = (revision = '') => {
    const source = stripAccents(normalizeText(revision).toLowerCase());
    return /change de metier|changer de metier|changement de metier|nouvelle activite|nouveau projet|nouveau type|passe en|transforme en|reconstruire|refaire de zero|repartir de zero|nouvelle maquette/.test(source);
};

const getFallbackRevisionRebuildContext = (brief = '', revision = '') => {
    const baseSector = detectFallbackSector(brief);
    const revisedSector = detectFallbackSector(revision);
    const hardRebuildAsked = isFallbackHardRebuildRequest(revision);
    const revisionSource = stripAccents(normalizeText(revision).toLowerCase());
    const negatedSectorMention = /(?:ce\s+n['’ ]?est\s+pas|n['’ ]?est\s+pas|ne\s+.+\s+pas|pas\s+une?|pas\s+un|mauvais\s+metier|mauvais\s+métier|corrige\s+le\s+metier|corrige\s+le\s+métier|corriger\s+le\s+metier|corriger\s+le\s+métier).{0,90}(agence de voyage|voyage|travel|destination|recrutement|candidat|finance|compta|portfolio|reve|rêve|dream|portail|onirique|traversee|traversée)|(?:agence de voyage|voyage|travel|destination|recrutement|candidat|finance|compta|portfolio|reve|rêve|dream|portail|onirique|traversee|traversée).{0,90}(?:pas le bon|pas la bonne|incorrect|mauvais|a la place|à la place)/.test(revisionSource);
    const sectorChanged = !negatedSectorMention && revisedSector !== 'service' && revisedSector !== baseSector;
    const typeChanged = !negatedSectorMention && /nouveau site|nouveau type|passe en|transforme en|au lieu de/.test(revisionSource);

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
        return buildBriefDrivenFallbackProposal(rebuildContext.rebuiltBrief);
    }

    const revisionBrief = `${brief}\n\nModification demandée à Kirby : ${revision}`;
    const proposal = buildBriefDrivenFallbackProposal(revisionBrief);
    const currentName = normalizeText(currentProposal && currentProposal.siteName);
    const renameAsked = /renomme|renommer|nom|marque|appelle|s'appelle|s’appelle/.test(stripAccents(normalizeText(revision).toLowerCase()));

    const autoNameConflict = hasAutomotiveConciergeIntent(revisionBrief)
        && /\b(kilometre|kilomètre|voyage|travel|destination|itineraire|itinéraire|escapade|road trip|maison pilote|maison roue|nexa|talent|recrut|candidat|finance|compta|conta|directcompt|luna|comptine|robe|couture|portfolio|showreel|studio creatif|studio créatif)\b/i.test(currentName);
    const kidsNameConflict = hasChildFashionIntent(revisionBrief)
        && /\b(nexa|talent|recrut|candidat|maison pilote|maison roue|finance|compta|conta|directcompt|conciergerie|automobile|garage|convoyage|controle technique|contrôle technique|comptine|jeux educatifs|jeux éducatifs|espace parent)\b/i.test(currentName);

    if (currentName && !renameAsked && !autoNameConflict && !kidsNameConflict) {
        proposal.siteName = currentName;
    }

    const requested = stripAccents(normalizeText(revision).toLowerCase());
    const source = stripAccents(normalizeText(revisionBrief).toLowerCase());
    const isFoodService = hasFoodServiceIntent(revisionBrief);

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
        proposal.slogan = isFoodService
            ? 'Une expérience élégante à chaque visite.'
            : 'Une présence élégante, claire et mémorable.';
        addProposalSection(proposal, { title: 'Preuves de confiance', text: 'Avis, photos ou réalisations rassurent avant la prise de contact.' });
    }

    if (/italien|italienne|chaleureuse|chaleureux|chaud|terroir|dolce|trattoria|ambiance/.test(requested)) {
        proposal.styleGuide = proposal.styleGuide && typeof proposal.styleGuide === 'object' ? proposal.styleGuide : {};
        proposal.styleGuide.direction = 'Ambiance chaleureuse, premium et expressive.';
        proposal.styleGuide.colors = 'Tons chauds, crème, brun profond et accent doré.';
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = isFoodService ? 'Modèle restaurant chaleureux' : 'Modèle chaleureux premium';
        if (isFoodService && /restaurant|projet|presence/i.test(proposal.siteName || '')) {
            proposal.siteName = 'Saveurs du Terroir';
        }
    }

    if (/qr|scan|code/.test(requested)) {
        addProposalService(proposal, { name: 'QR code professionnel', reason: 'Utile pour scanner la carte, une page ou une offre depuis un support imprimé.', priceFrom: '39 €' });
        addProposalSection(proposal, { title: 'QR code', text: 'Un QR code donne accès rapidement à la page utile depuis une carte, vitrine ou flyer.' });
        if (isFoodService) {
            addProposalPage(proposal, { name: 'Menu / carte', goal: 'Afficher la carte consultable depuis le QR code.' });
        }
    }

    if (/reservation|reserver|rendez|rdv|agenda/.test(requested)) {
        addProposalPage(proposal, { name: isFoodService ? 'Réservation' : 'Rendez-vous', goal: 'Permettre au visiteur de réserver ou demander un créneau.' });
        addProposalService(proposal, { name: isFoodService ? 'Réservation en ligne' : 'Lien rendez-vous ou WhatsApp', reason: 'Le visiteur doit pouvoir agir sans chercher.', priceFrom: 'Inclus selon offre' });
        addProposalCta(proposal, isFoodService ? 'Réserver une table' : 'Prendre rendez-vous');
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

const CV_MONTH_NUMBERS = {
    jan: 1, janv: 1, janvier: 1,
    feb: 2, fev: 2, fevr: 2, fevrier: 2,
    mar: 3, mars: 3,
    apr: 4, avr: 4, avril: 4,
    may: 5, mai: 5,
    jun: 6, juin: 6,
    jul: 7, juil: 7, juillet: 7,
    aug: 8, aout: 8,
    sep: 9, sept: 9, septembre: 9,
    oct: 10, octobre: 10,
    nov: 11, novembre: 11,
    dec: 12, decembre: 12,
};

const getCvPeriodRange = (value = '') => {
    const source = stripAccents(normalizeText(String(value || '').toLowerCase()))
        .replace(/[.]/g, '')
        .replace(/[–—]/g, '-');
    const currentDate = new Date();
    const ongoing = /\b(aujourd'hui|aujourd hui|present|actuel|actuellement|maintenant|en cours)\b/.test(source);
    const points = [];
    const occupiedRanges = [];
    const addPoint = (year, month, precision, index, length) => {
        const numericYear = Number(year);
        const numericMonth = Number(month || 0);
        if (numericYear < 1900 || numericYear > currentDate.getFullYear() + 5) return;
        if (occupiedRanges.some((range) => index >= range.start && index < range.end)) return;
        occupiedRanges.push({ start: index, end: index + length });
        points.push({ year: numericYear, month: numericMonth, precision, index });
    };

    for (const match of source.matchAll(/\b(0?[1-9]|1[0-2])\s*[/.]\s*((?:19|20)\d{2})\b/g)) {
        addPoint(match[2], match[1], 'month', match.index, match[0].length);
    }
    for (const match of source.matchAll(/\b([a-z]+)\s+((?:19|20)\d{2})\b/g)) {
        const month = CV_MONTH_NUMBERS[match[1]];
        if (month) addPoint(match[2], month, 'month', match.index, match[0].length);
    }
    for (const match of source.matchAll(/\b((?:19|20)\d{2})\b/g)) {
        addPoint(match[1], 0, 'year', match.index, match[0].length);
    }

    points.sort((left, right) => left.index - right.index);
    if (!points.length) {
        return { raw: normalizeText(value), hasDate: false, ongoing, start: null, end: null, startKey: 0, endKey: 0 };
    }

    const first = points[0];
    const last = ongoing
        ? { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, precision: 'month' }
        : points[points.length - 1];
    const startMonth = first.month || 1;
    const endMonth = last.month || 12;

    return {
        raw: normalizeText(value),
        hasDate: true,
        ongoing,
        start: { year: first.year, month: first.month || null, precision: first.precision },
        end: { year: last.year, month: last.month || null, precision: last.precision },
        startKey: first.year * 12 + startMonth,
        endKey: last.year * 12 + endMonth,
    };
};

const parseCvDocumentExperience = (line = '', index = 0) => {
    const cleanLine = limitCvText(line, 520);
    const [rawHeader = '', ...rawBullets] = cleanLine.split(/\s+•\s+/);
    const periodMatches = [
        ...rawHeader.matchAll(/\b(?:[A-Za-zÀ-ÿ]+\.?\s+)?(?:19|20)\d{2}(?:\s*[–—-]\s*(?:(?:[A-Za-zÀ-ÿ]+\.?\s+)?(?:19|20)\d{2}|aujourd'hui|aujourd’hui|présent|present|actuel|en cours))?/gi),
    ];
    const period = periodMatches.length ? periodMatches[periodMatches.length - 1][0] : '';
    const headerWithoutPeriod = period
        ? rawHeader.replace(period, '').replace(/[\s|,–—-]+$/g, '').trim()
        : rawHeader.trim();
    const headerParts = headerWithoutPeriod.split(/\s+[–—-]\s+/).map((part) => limitCvText(part, 140)).filter(Boolean);

    return {
        index,
        title: headerParts[0] || headerWithoutPeriod,
        organization: headerParts.slice(1).join(' - '),
        period,
        chronology: getCvPeriodRange(period || rawHeader),
        missions: rawBullets.map((bullet) => limitCvText(bullet, 180)).filter(Boolean).slice(0, 8),
        sourceLine: cleanLine,
    };
};

const buildCvDocumentModel = (cv = {}) => {
    const experience = normalize(cv.experience).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 10).map(parseCvDocumentExperience);
    const educationItems = normalize(cv.education).split(/\r?\n/).map((line) => limitCvText(line, 300)).filter(Boolean).slice(0, 10);
    const isCertification = (line = '') => /\b(certification|certificat|permis|fimo|iobsp|habilitation|attestation)\b/i.test(line);
    const chronologicalExperienceIndexes = experience
        .filter((entry) => entry.chronology.hasDate)
        .sort((left, right) => right.chronology.endKey - left.chronology.endKey || right.chronology.startKey - left.chronology.startKey || left.index - right.index)
        .map((entry) => entry.index);
    let previousEndKey = Number.POSITIVE_INFINITY;
    let previousStartKey = Number.POSITIVE_INFINITY;
    let hasSeenUndatedExperience = false;
    const isNewestFirst = experience.every((entry) => {
        if (!entry.chronology.hasDate) {
            hasSeenUndatedExperience = true;
            return true;
        }
        if (hasSeenUndatedExperience) return false;
        const correctlyPlaced = entry.chronology.endKey < previousEndKey
            || (entry.chronology.endKey === previousEndKey && entry.chronology.startKey <= previousStartKey);
        previousEndKey = entry.chronology.endKey;
        previousStartKey = entry.chronology.startKey;
        return correctlyPlaced;
    });

    return {
        targetRole: getCvRoleFromText(`${cv.headline || ''} ${cv.summary || ''} ${cv.permit || ''}`) || limitCvText(cv.headline, 120),
        identity: {
            fullName: limitCvText(cv.fullName, 100), location: limitCvText(cv.location, 120),
            phone: limitCvText(cv.phone, 48), email: limitCvText(cv.email, 120), permit: limitCvText(cv.permit, 80),
        },
        headline: limitCvText(cv.headline, 120),
        summary: limitCvText(cv.summary, 700),
        skills: normalize(cv.skills).split(/\r?\n/).map((item) => limitCvText(item, 100)).filter(Boolean).slice(0, 16),
        experience,
        chronology: {
            currentOrder: experience.map((entry) => entry.index),
            newestFirstOrder: [...chronologicalExperienceIndexes, ...experience.filter((entry) => !entry.chronology.hasDate).map((entry) => entry.index)],
            isNewestFirst,
        },
        education: educationItems.filter((item) => !isCertification(item)),
        certifications: educationItems.filter(isCertification),
        languages: getCvLanguagesFromText(cv.languages),
        projects: normalize(cv.projects).split(/\r?\n/).map((item) => limitCvText(item, 260)).filter(Boolean).slice(0, 8),
        activities: normalize(cv.activities).split(/\r?\n/).map((item) => limitCvText(item, 160)).filter(Boolean).slice(0, 8),
    };
};

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

const CV_OPERATION_TYPES = new Set([
    'add_experience',
    'update_experience_title',
    'update_experience_date',
    'set_experience_bullets',
    'normalize_experience_dates',
    'remove_experience_bullet',
    'upsert_language',
    'set_field',
    'replace_text',
    'remove_text',
    'remove_section',
    'reorder_experiences',
    'sort_experiences',
    'remove_experience',
]);
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
    const rawPosition = value.position && typeof value.position === 'object' ? value.position : {};
    const sanitizePositionTarget = (positionTarget) => {
        const source = positionTarget && typeof positionTarget === 'object' ? positionTarget : {};
        return {
            title: limitCvText(source.title || source.label || source.name || source.role, 120),
            organization: limitCvText(source.organization || source.company || source.meta, 120),
            date: limitCvText(source.date || source.period || source.dates || source.currentValue, 80),
        };
    };
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
        experience: sanitizeCvGeneratedExperience(value.experience || value.entry || value.item),
        position: {
            before: sanitizePositionTarget(rawPosition.before || value.before),
            after: sanitizePositionTarget(rawPosition.after || value.after),
        },
        reason: limitCvText(value.reason || value.summary, 180),
    };
};

const sanitizeCvOperations = (value) =>
    (Array.isArray(value) ? value : [])
        .map(sanitizeCvOperation)
        .filter(Boolean)
        .slice(0, 16);

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
    const normalizeExperienceOrderTitle = (title = '') =>
        stripAccents(normalize(title).toLowerCase())
            .replace(/[^a-z0-9]+/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    const sourceExperienceTitleMatches = sourceExperienceTitles.map((title) => ({
        title,
        normalized: normalizeExperienceOrderTitle(title),
    }));
    const resolveExperienceOrderTitle = (title = '') => {
        const exactMatch = sourceTitlesByNormalized.get(stripAccents(title).toLowerCase());
        if (exactMatch) {
            return exactMatch;
        }

        const normalized = normalizeExperienceOrderTitle(title);
        if (!normalized) {
            return '';
        }

        return sourceExperienceTitleMatches.find((item) =>
            item.normalized.includes(normalized) || normalized.includes(item.normalized)
        )?.title || '';
    };
    const operationOrderTitles = (Array.isArray(result && result.operations) ? result.operations : [])
        .filter((operation) => operation && operation.type === 'reorder_experiences')
        .flatMap((operation) => toCvStringList(String(operation.value || '').split('|'), 8, 110));
    const orderSource = operationOrderTitles.length >= 2
        ? operationOrderTitles
        : result && result.experienceOrder;
    const orderedTitles = toCvStringList(orderSource, 8, 110)
        .map(resolveExperienceOrderTitle)
        .filter(Boolean)
        .filter((title, index, list) => list.indexOf(title) === index);
    const safeExperienceOrder = orderedTitles.length >= Math.min(sourceExperienceTitles.length, 2)
        ? [...orderedTitles, ...sourceExperienceTitles.filter((title) => !orderedTitles.includes(title))]
        : sourceExperienceTitles;
    const languages = (Array.isArray(result && result.languages) ? result.languages : [])
        .map(normalizeCvLanguage)
        .filter(Boolean)
        .filter((item, index, list) => list.findIndex((candidate) => stripAccents(candidate.language).toLowerCase() === stripAccents(item.language).toLowerCase()) === index)
        .slice(0, 5);

    return {
        headline: limitCvText(result && result.headline, 90),
        summary: limitCvText(result && result.summary, 300),
        skills: toCvStringList(result && result.skills, 10, 80),
        experienceOrder: safeExperienceOrder,
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

const INSERTION_PROFESSIONAL_CV_HEADLINE = 'Conseillère commerciale';

const getCvRoleFromText = (value = '') => {
    const source = stripAccents(normalizeText(value).toLowerCase());

    if (/\bconseillere\s+commerciale\b/.test(source) && /\binsertion\s+professionnelle\b/.test(source)) {
        return INSERTION_PROFESSIONAL_CV_HEADLINE;
    }
    if (/\bconseillere\s+de\s+ventes\b/.test(source)) {
        return 'Conseillère de Ventes';
    }
    if (/\bconseillere\s+de\s+vente\b/.test(source)) {
        return 'Conseillère de vente';
    }
    if (/\bconseiller\s+de\s+vente\b/.test(source)) {
        return 'Conseiller de vente';
    }
    if (/\bconseillere\s+commerciale\b/.test(source)) {
        return 'Conseillère commerciale';
    }
    if (/\bconseiller\s+commercial\b/.test(source)) {
        return 'Conseiller commercial';
    }
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
    if (/\bchauffeur\s+de\s+bus|conduct(?:eur|rice)\s+de\s+bus|transport\s+de\s+voyageurs|permis\s+d\b/.test(source)) {
        return 'Chauffeur de bus';
    }
    if (/\bconseillere\s+clientele|conseillere\s+relation\s+client\b/.test(source)) {
        return 'Conseillère clientèle';
    }
    if (/\bconseiller\s+clientele|conseiller\s+relation\s+client|relation client|service client\b/.test(source)) {
        return 'Conseiller clientèle';
    }
    if (/\bassistante\b/.test(source) && /\badministrative|administratif|dossiers?\b/.test(source)) {
        return 'Assistante administrative';
    }
    if (/\bassistant|administratif|dossiers?\b/.test(source)) {
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
    const removesInsertionHeadlineSuffix = isRemovalRequest
        && /\bcandidate?\s+au\s+poste\b/.test(normalizedInstruction)
        && /\binsertion\s+pro[\s\-–—]*fessionnelle\b/.test(normalizedInstruction);
    if (removesInsertionHeadlineSuffix) {
        return INSERTION_PROFESSIONAL_CV_HEADLINE;
    }
    if (isRemovalRequest) {
        return '';
    }

    return getCvRoleFromText(instruction) || getCvRoleFromText(jobOffer);
};

const finalizeCvAssistantResult = ({ result, cv, task, jobOffer, instruction }) => {
    const assistantResult = enhanceCvGapDrafts(sanitizeCvAssistantResult(result, cv), { cv, instruction, jobOffer });
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
    const commonSkills = ['Organisation', 'Autonomie'];
    const byContext = {
        web: {
            title: 'Créatrice de sites web / Développeuse web',
            organization: 'Projet personnel / Autoformation',
            description: [
                'Conception et développement de sites vitrines et d’outils web.',
                'Création d’interfaces adaptées aux besoins utilisateurs.',
                'Intégration de fonctionnalités avec assistants IA.',
                'Tests, corrections et amélioration continue des projets.',
                'Gestion autonome de projets numériques.',
            ],
            skills: ['Front-end : HTML / CSS', 'Notions JavaScript', 'Notions back-end', 'Intégration web', 'Création et mise à jour de sites web', 'Outils numériques et IA', 'Tests fonctionnels', ...commonSkills],
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
                'Renforcement des bases de programmation et de la méthode de travail.',
                'Veille, exercices pratiques et consolidation des compétences techniques.',
            ],
            skills: ['Autoformation', 'Apprentissage continu', 'Bases de programmation', ...commonSkills],
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
                'Renforcement de l’autonomie et de la méthode de travail.',
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
            period: /\b2025\s*[-–—]\s*2026\b/.test(source) ? '2025 - 2026' : '',
            organization: 'École 42',
            description: 'Bases de la programmation, logique algorithmique et travail par projets.',
            skills: ['Bases de programmation', 'Autonomie', 'Travail sur projets'],
            source: 'a valider',
        });
    }

    if (/\bsimplon\b/.test(source) && !/\bsimplon\b/.test(existingEducation)) {
        suggestions.push({
            title: 'Simplon - Formation numérique / développement web',
            period: /\b2025\s*[-–—]\s*2026\b/.test(source) ? '2025 - 2026' : '',
            organization: 'Simplon',
            description: 'Développement web, intégration, outils numériques et méthodes de projet.',
            skills: ['Front-end : HTML / CSS', 'Intégration web', 'Culture numérique'],
            source: 'a valider',
        });
    }

    if (/\bautoformation\b/.test(source) && /\binformatique\b/.test(source) && /\b2023\b/.test(source) && !/\bautoformation\b/.test(existingEducation)) {
        suggestions.push({
            title: 'Autoformation en informatique',
            period: '2023',
            organization: '',
            description: 'Apprentissage autonome du développement web et des outils numériques. Réalisation de projets personnels et acquisition de nouvelles compétences.',
            skills: ['Développement web', 'Outils numériques', 'Autonomie'],
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
    title: 'Créatrice de sites web / Développeuse web',
    description: [
        'Conception et développement de sites vitrines et d’outils web.',
        'Création d’interfaces adaptées aux besoins utilisateurs.',
        'Intégration de fonctionnalités avec assistants IA.',
        'Tests, corrections et amélioration continue des projets.',
        'Gestion autonome de projets numériques.',
    ],
    skills: [
        'Front-end : HTML / CSS',
        'Notions JavaScript',
        'Notions back-end',
        'Intégration web',
        'Création et mise à jour de sites web',
        'Outils numériques et IA',
        'Tests fonctionnels',
        'Organisation',
        'Autonomie',
    ],
};

const shouldUseDigitalProjectExperienceDetails = ({ instruction = '', experiences = [] } = {}) => {
    const source = stripAccents(normalizeText([
        instruction,
        ...experiences.map((experience) => `${experience.title || ''} ${experience.period || ''} ${experience.organization || ''}`),
    ].join(' ')).toLowerCase());

    return /\b(creatrice de projets numeriques|projets numeriques|creation de projets numeriques|autoformation|developpement web|assistant ia|intelligence artificielle|ux\/ui|front-end|frontend|back-end|backend|integration web|int[eé]gration web)\b/.test(source);
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

const normalizeCvSuggestedSkills = (skills = []) => {
    const canonicalByPattern = [
        [/\bfront\s*-?\s*end\b|\bfrontend\b|html|css/i, 'Front-end : HTML / CSS'],
        [/\bjava\s*script\b|\bjavascript\b/i, 'Notions JavaScript'],
        [/\bback\s*-?\s*end\b|\bbackend\b/i, 'Notions back-end'],
        [/\bint[eé]gration\s+web\b/i, 'Intégration web'],
        [/\bd[eé]veloppement\s+web\b/i, 'Création et mise à jour de sites web'],
        [/\bux\b|\bui\b|interfaces?\b/i, 'Amélioration des interfaces'],
        [/\bcr[eé]ation\b.*\bsites?\s+web\b|\bmise\s+[aà]\s+jour\b.*\bsites?\s+web\b/i, 'Création et mise à jour de sites web'],
        [/\bia\b|intelligence artificielle|outils numeriques|outils numériques/i, 'Outils numériques et IA'],
        [/tests?\s+fonctionnels?/i, 'Tests fonctionnels'],
    ];
    const seen = new Set();

    return toCvStringList(skills, 16, 80)
        .map((skill) => {
            const canonical = canonicalByPattern.find(([pattern]) => pattern.test(skill))?.[1];
            return canonical || skill.replace(/\s*[-–—]?\s*[aà]\s+confirmer\b/gi, '').trim();
        })
        .filter(Boolean)
        .filter((skill) => !/\b(?:gestion\s+de\s+projet\s+digital|ecole\s+42|école\s+42|simplon|projets?\s+num[eé]riques?)\b/i.test(skill))
        .filter((skill) => {
            const key = stripAccents(skill.toLowerCase());
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        })
        .slice(0, 12);
};

const enhanceCvGapDrafts = (assistantResult, { cv = {}, instruction = '', jobOffer = '' } = {}) => {
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
                skills: normalizeCvSuggestedSkills([...(experience.skills || []), ...digitalProjectExperienceDetails.skills]),
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
    const diagnosticOnly = /\b(dis\s+seulement|seulement\s+si|sans\s+modifier|n[e']?\s*applique\s+pas|aucune\s+modification|ne\s+modifie\s+pas|ne\s+change\s+rien)\b/.test(instructionSource);
    const canSuggestSkills = !diagnosticOnly && (shouldEnhanceDigitalProject
        || educationSuggestions.length > 0
        || normalizeText(jobOffer).length > 0
        || /\b(comp[eé]tences?|skills?|propose|proposer|ajoute|ajouter|valorise|valoriser|comble|combler|bouche|boucher|complete|compl[eé]ter|remplis|remplir|projets?\s+num[eé]riques?|num[eé]rique|web|autoformation|formation)\b/.test(instructionSource));
    const suggestedSkills = canSuggestSkills ? normalizeCvSuggestedSkills([
        ...(result.suggestedSkills || []),
        ...(shouldEnhanceDigitalProject ? digitalProjectExperienceDetails.skills : []),
        ...educationSuggestions.flatMap((education) => education.skills || []),
    ]) : [];
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
    'Representation structuree du document construite automatiquement avant ta reponse :',
    JSON.stringify(buildCvDocumentModel(cv), null, 2),
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
    'Si la consigne demande d ajouter une experience personnelle, un projet, une autoformation, un benevolat ou une activite independante avec un intitule et une periode, utilise generatedExperiences meme sans entreprise classique. Ne demande pas un employeur quand le contexte peut etre Projet personnel / Autoformation.',
    'Ordre d affichage : conserve l ordre exact deja present dans cv.experience et cv.education. Ne propose un reorder_experiences ou un experienceOrder different que si la consigne demande explicitement un deplacement, un tri ou un nouvel ordre.',
    'Pour les formations/certifications non presentes mais mentionnees par l utilisateur (Ecole 42, Piscine informatique, Simplon, formations courtes, certificats, ateliers), renseigne educationSuggestions au lieu de les melanger aux experiences.',
    'Si la consigne demande une correction ciblee, retourne une operation applicative dans operations. Ne remplace pas une correction par une proposition generique.',
    'Pour une modification locale, laisse vides les champs non demandes : ne renomme pas un poste, une entreprise, une date, une mission, le titre global, l accroche ou les competences si la consigne ne le demande pas explicitement.',
    'Pour un deplacement avant/apres une autre experience explicitement demande, retourne une seule operation reorder_experiences avec position.before ou position.after.',
    'Pour une correction ciblee de phrase, ligne, date ou intitule, retourne uniquement l operation correspondante. Ne remplis pas headline, summary, skills, generatedExperiences, educationSuggestions, layout ou experienceOrder si ces champs ne sont pas demandes.',
    'Quand la consigne donne explicitement le nouveau titre global du CV, applique exactement ce titre dans headline et jobTarget, sans le corriger ni le remplacer par un synonyme.',
    'Execute la demande dans operations. Utilise replace_text ou remove_text pour une expression exacte dans une ou plusieurs rubriques, set_experience_bullets pour reecrire les missions finales d une experience, et sort_experiences avec value newest_first pour un tri chronologique. Ne reponds pas comme un chatbot lorsque le document contient assez d informations pour agir.',
].filter(Boolean).join('\n\n');

const requestOpenAiCvAssistant = async ({ apiKey, model, task, cv, jobOffer, instruction, letter, interaction }) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: getOpenAiAbortSignal(),
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

const getOpenAiMaxCompletionTokens = () => {
    const configured = Number.parseInt(process.env.KIRBY_OPENAI_MAX_COMPLETION_TOKENS || '4500', 10);

    return Number.isFinite(configured) && configured >= 512 ? configured : 4500;
};

const getOpenAiReasoningEffort = () => {
    const configured = normalize(process.env.KIRBY_OPENAI_REASONING_EFFORT || 'none').toLowerCase();

    return ['none', 'low', 'medium', 'high', 'xhigh'].includes(configured) ? configured : 'none';
};

const getOpenAiGenerationControls = (model, legacyControls = {}) =>
    isCurrentReasoningModel(model)
        ? {
            max_completion_tokens: getOpenAiMaxCompletionTokens(),
            reasoning_effort: getOpenAiReasoningEffort(),
        }
        : {
            ...legacyControls,
            max_tokens: legacyControls.max_tokens || getOpenAiMaxCompletionTokens(),
        };

const getOpenAiTimeoutMs = () => {
    const configured = Number.parseInt(process.env.KIRBY_OPENAI_TIMEOUT_MS || '60000', 10);

    return Number.isFinite(configured) && configured >= 1000 ? configured : 60000;
};

const getOpenAiAbortSignal = () =>
    typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
        ? AbortSignal.timeout(getOpenAiTimeoutMs())
        : undefined;

const getTextByteSize = (value = '') => Buffer.byteLength(String(value || ''), 'utf8');
const estimateTokenCount = (value = '') => Math.ceil(String(value || '').length / 4);
const getOpenAiExpectedResponseEstimate = (requestBody = {}) => {
    const maxOutputTokens = requestBody.max_completion_tokens || requestBody.max_tokens || null;
    const estimatedJsonChars = 9000;

    return {
        maxOutputTokensConfigured: maxOutputTokens,
        estimatedJsonCharacters: estimatedJsonChars,
        estimatedTokens: Math.ceil(estimatedJsonChars / 4),
        basis: maxOutputTokens
            ? 'borne API configuree'
            : 'aucune borne max_tokens/max_completion_tokens dans la requete; estimation basee sur une proposition JSON complete Kirby',
    };
};

const createKirbyDebugTrace = ({ brief = '', revision = '', effectiveBrief = '', effectiveRevision = '' } = {}) => ({
    briefReceived: brief,
    revisionReceived: revision,
    effectiveBrief,
    effectiveRevision,
    structuredAnalysis: null,
        openAi: {
            enabled: false,
            modelsConfigured: [],
            calls: [],
        finalError: null,
    },
    fallbackUsed: false,
    fallbackReason: '',
    fallbackTemplate: '',
    finalTemplate: null,
    finalServices: [],
});

const summarizeTraceProposal = (proposal = {}) => ({
    sectorKey: proposal.sectorKey || '',
    projectType: proposal.projectType || '',
    siteName: proposal.siteName || '',
    layoutVariant: proposal.layoutVariant || '',
    visualMood: proposal.visualMood || '',
    siteModel: proposal.siteModel && proposal.siteModel.name ? proposal.siteModel.name : '',
});

const getTraceServices = (proposal = {}) => {
    const getName = (item) => typeof item === 'string' ? item : item && item.name ? item.name : '';

    return (Array.isArray(proposal.services) ? proposal.services : [])
        .map(getName)
        .filter(Boolean)
        .slice(0, 12);
};

const logKirbyDebugTrace = (trace) => {
    if (!trace) {
        return;
    }

    console.log('Kirby debug trace:', JSON.stringify({
        briefRecu: trace.briefReceived,
        briefEnvoyeOpenAI: trace.effectiveBrief,
        analyseStructuree: trace.structuredAnalysis,
        modelesConfigures: trace.openAi && trace.openAi.modelsConfigured,
        appelsOpenAI: (trace.openAi && Array.isArray(trace.openAi.calls) ? trace.openAi.calls : []).map((call) => ({
            modeleAppele: call.model,
            debutAppel: call.startedAt,
            tempsEcouleMs: call.elapsedMs,
            timeoutConfigureMs: call.timeoutMs,
            typeErreur: call.errorType,
            taillePromptCaracteres: call.promptCharacters,
            taillePromptOctets: call.promptBytes,
            taillePromptTokensEstimes: call.promptEstimatedTokens,
            tailleSystemPromptCaracteres: call.systemPromptCharacters,
            tailleRequeteOctets: call.requestBodyBytes,
            tailleReponseAttendue: call.expectedResponse,
            briefEnvoyeOpenAI: call.briefSentToOpenAi,
            promptEnvoyeOpenAI: call.userPromptSentToOpenAi,
            reponseBruteOpenAI: call.rawResponseText,
            contenuMessageOpenAI: call.rawMessageContent,
            erreur: call.error,
        })),
        erreurFinaleOpenAI: trace.openAi && trace.openAi.finalError,
        fallbackUtilise: trace.fallbackUsed,
        raisonFallback: trace.fallbackReason,
        templateChoisiAvantFallback: trace.fallbackTemplate,
        templateFinal: trace.finalTemplate,
        servicesFinalementRendus: trace.finalServices,
    }, null, 2));
};

const inferOpenAiBriefContext = (brief = '') => {
    const profile = getBriefProfile(brief);
    const positiveBrief = profile.positiveText || brief;
    const source = stripAccents(normalizeText(positiveBrief).toLowerCase());
    const sector = getActivityWords(positiveBrief);
    const accountingContext = hasAccountingIntent(source);
    const crisisManagementContext = !accountingContext && hasCrisisManagementIntent(positiveBrief);
    const funeralHomeContext = !accountingContext && hasFuneralHomeIntent(positiveBrief);
    const energyRenovationContext = !accountingContext && hasEnergyRenovationIntent(positiveBrief);
    const restaurantSaasContext = !accountingContext && hasRestaurantManagementSaasIntent(positiveBrief);
    const seniorMobilityContext = !accountingContext && !funeralHomeContext && hasSeniorMobilityIntent(positiveBrief);
    const privateSchoolContext = !accountingContext && hasPrivateSchoolIntent(positiveBrief);
    const automotiveContext = !accountingContext && !seniorMobilityContext && hasAutomotiveConciergeIntent(positiveBrief);
    const sportsRehabContext = !accountingContext && hasSportsRehabIntent(positiveBrief);
    const medicalCenterContext = !accountingContext && !sportsRehabContext && hasMedicalCenterIntent(positiveBrief);
    const childFashionContext = !accountingContext && hasChildFashionIntent(positiveBrief);
    const kidsContext = !accountingContext && !privateSchoolContext && !childFashionContext && isKidsEducationBrief(positiveBrief);
    const bridalContext = !accountingContext && !kidsContext && isBridalCoutureBrief(positiveBrief);
    const boxingContext = !accountingContext && !kidsContext && !automotiveContext && !childFashionContext && hasBoxingIntent(positiveBrief);
    const luminaContext = !accountingContext && !kidsContext && hasLuminaCreativeIntent(positiveBrief);
    const styleHints = [
        energyRenovationContext ? 'renovation energetique experte, pédagogique, thermique, rassurante, sans clichés feuilles vertes' : '',
        crisisManagementContext ? 'gestion de crise sobre, stratégique, confidentielle, rassurante, non cabinet avocat' : '',
        funeralHomeContext ? 'maison funeraire apaisante, digne, humaine, lumineuse, sans noir dominant, sans marbre, sans froideur' : '',
        restaurantSaasContext ? 'SaaS restaurateurs moderne, opérationnel, clair, terrain, pas dashboard comptable' : '',
        seniorMobilityContext ? 'mobilite accompagnee senior rassurante, humaine, moderne, lisible, non medicalisee' : '',
        privateSchoolContext ? 'ecole privee institutionnelle, vivante, educative, rassurante, pas enfantine' : '',
        automotiveContext ? 'conciergerie automobile sobre, premium, professionnelle, graphite et ivoire' : '',
        sportsRehabContext ? 'centre de reeducation sportive technique, dynamique, medical sportif, sans fitness' : '',
        medicalCenterContext ? 'centre medical pluridisciplinaire clair, humain, professionnel, non hospitalier froid' : '',
        childFashionContext ? 'marque de vetements enfants joyeuse, illustree, moderne, colorée et durable' : '',
        kidsContext ? 'univers produit enfant futur doux' : '',
        bridalContext ? 'maison couture mariage premium, moderne et lumineuse' : '',
        boxingContext ? 'club de boxe feminin, ring, gants, energie et confiance' : '',
        luminaContext ? 'direction Lumina/Figma premium, futuriste, transparente et lisible' : '',
        /\bpremium|haut de gamme|luxe|elegant|élégant|moderne|waouh|wow\b/.test(source) ? 'premium moderne' : '',
        /\brassurant|confiance|professionnel|serieux|sérieux\b/.test(source) ? 'rassurant' : '',
        /\bdoux|beige|rose|bien etre|bien-être|soin|spa\b/.test(source) ? 'doux bien-être' : '',
        /\bapple|macos|figma|lumina|luma|glass|glassmorphism|verre|bleu nuit|etoile|étoile|cosmique|futuriste|ia|digital\b/.test(source) ? 'premium digital immersif' : '',
        /\bchaleureux|italien|restaurant|terroir|convivial\b/.test(source) ? 'chaleureux commercial' : '',
    ].filter(Boolean);
    const sectionHints = [
        energyRenovationContext ? 'type de logement, problèmes, budget, prediagnostic, estimation, étapes projet, aides financières, certifications, réalisations, garanties, dépôt de dossier complet' : '',
        crisisManagementContext ? 'acces urgence crise, scenarios crise mediatique juridique sociale cyber reputationnelle, methodologie, expertises mobilisees, interventions urgence, formations preparation, formulaire confidentiel, dirigeants, directions juridiques, equipes communication' : '',
        funeralHomeContext ? 'demarches avant pendant apres obseques, ceremonies civiles religieuses, prevoyance, accompagnement administratif, familles eloignees, espace hommage prive, messages photos souvenirs, contact discret' : '',
        restaurantSaasContext ? 'problèmes restaurateurs, réservations, stocks, fournisseurs, coûts recettes, planning équipe, simplicité, démo, formules, comparatif, multi-restaurants' : '',
        accountingContext ? 'aperçu logiciel, factures, TVA, banque, documents, assistant IA, sécurité' : '',
        seniorMobilityContext ? 'beneficiaires, familles, types de trajets, securite, accompagnement humain, zones couvertes, tarifs, reservation trajet regulier, partenariat etablissements et collectivites' : '',
        privateSchoolContext ? 'futurs parents, familles inscrites, recrutement enseignants, projet pedagogique, niveaux, equipe, activites, restauration, horaires, inscriptions, agenda, actualites, documents, visite virtuelle' : '',
        automotiveContext ? 'services, forfaits, fonctionnement, zones couvertes, demande de prise en charge, contact' : '',
        sportsRehabContext ? 'equipe pluridisciplinaire, kinesitherapeutes, medecins du sport, osteopathes, preparateurs physiques, nutritionnistes, parcours blessure, parcours par sport, objectif de reprise, equipements, protocoles, bilans, prevention, suivi a distance' : '',
        medicalCenterContext ? 'specialites, praticiens filtrables, disponibilites, langues parlees, rendez-vous, prevention sante, rejoindre le centre, acces, urgence' : '',
        childFashionContext ? 'collections, matières, engagements, guide des tailles, boutique, contact' : '',
        kidsContext ? 'jeux, histoires, comptines, espace parent, progression' : '',
        bridalContext ? 'collections, robes sur mesure, essayages privés, atelier, galerie, rendez-vous' : '',
        boxingContext ? 'cours femmes, planning, coachs, essai découverte, tarifs, galerie ring' : '',
        luminaContext ? 'hero surface, modules flottants, assistant IA, preuves métier, CTA lisible' : '',
        /\btarif|prix|offre|formule|abonnement\b/.test(source) ? 'tarifs/offres' : '',
        /\brdv|rendez|reservation|réservation|agenda\b/.test(source) ? 'prise de rendez-vous ou réservation' : '',
        /\bphoto|image|galerie|portfolio|realisation|réalisation\b/.test(source) ? 'galerie/preuves visuelles' : '',
        /\bavis|temoignage|témoignage|preuve|confiance\b/.test(source) ? 'avis/preuves de confiance' : '',
        /\bseo|google|local|ville|près|pres\b/.test(source) ? 'référencement local' : '',
        /\bcontact|whatsapp|telephone|téléphone|email|mail\b/.test(source) ? 'contact direct' : '',
    ].filter(Boolean);
    const targetHints = [
        energyRenovationContext ? 'particuliers, propriétaires, bailleurs, syndics et copropriétés' : '',
        crisisManagementContext ? 'dirigeants, directions juridiques, equipes communication, DRH, RSSI et comites executifs' : '',
        funeralHomeContext ? 'familles endeuillees, proches eloignes et personnes souhaitant anticiper leurs volontes' : '',
        restaurantSaasContext ? 'restaurateurs indépendants, responsables exploitation et groupes multi-restaurants' : '',
        seniorMobilityContext ? 'personnes agees ou a mobilite reduite, familles, aidants, etablissements de sante et collectivites' : '',
        privateSchoolContext ? 'futurs parents, familles deja inscrites et enseignants candidats' : '',
        automotiveContext ? 'propriétaires de véhicules et clients premium qui veulent déléguer entretien, nettoyage, contrôle technique et convoyage' : '',
        sportsRehabContext ? 'sportifs amateurs, sportifs professionnels, clubs, prescripteurs medicaux et familles de jeunes sportifs' : '',
        medicalCenterContext ? 'patients, familles, praticiens et professionnels de sante souhaitant rejoindre le centre' : '',
        childFashionContext ? 'parents d’enfants de 2 à 8 ans cherchant des vêtements colorés, durables et faciles à choisir' : '',
        kidsContext ? 'enfants, parents et encadrants éducatifs' : '',
        bridalContext ? 'futures mariées recherchant une robe personnalisée et un essayage rassurant' : '',
        boxingContext ? 'femmes débutantes ou confirmées cherchant boxe, confiance et self-défense' : '',
        /\bcliente|clientes|client[eè]le|clients|prospect|visiteur|utilisateur\b/.test(source) ? 'clients/prospects mentionnés dans le brief' : '',
        /\bindependant|indépendant|artisan|tpe|pme|freelance\b/.test(source) ? 'indépendants, TPE ou clientèle locale' : '',
        /\bfemme|femmes|mariage|beauté|beaute\b/.test(source) ? 'clientèle féminine ou beauté' : '',
    ].filter(Boolean);
    const moodHints = [
        energyRenovationContext ? 'bleu ardoise, ambre thermique, blanc technique, graphite, cuivre doux, vert sauge discret' : '',
        crisisManagementContext ? 'bleu nuit, graphite, ivoire discret, ambre alerte, cyan decision, rouge sourd mesure' : '',
        funeralHomeContext ? 'ivoire chaud, sauge doux, bleu brume, argile claire, dore discret, gris plume' : '',
        restaurantSaasContext ? 'graphite chaud, inox clair, bleu service, cuivre doux, crème lisible, menthe statut' : '',
        seniorMobilityContext ? 'bleu petrole, vert sauge, ivoire lumineux, corail doux, gris ardoise' : '',
        privateSchoolContext ? 'bleu encre, vert tableau doux, ivoire papier, jaune cahier, corail discret' : '',
        automotiveContext ? 'graphite carrosserie, ivoire service, acier doux, bleu nuit, or discret' : '',
        sportsRehabContext ? 'bleu clinique profond, cyan mesure, orange reprise, blanc technique, graphite, vert validation' : '',
        medicalCenterContext ? 'blanc chaleureux, bleu sante doux, vert apaisant, gris ardoise, corail urgence discret' : '',
        childFashionContext ? 'ivoire chaud, corail doux, bleu ciel, vert pomme, jaune soleil, encre douce' : '',
        kidsContext ? 'futur doux, ludique, immersif, surfaces translucides' : '',
        bridalContext ? 'ivoire froid, noir couture, perle lumineuse, rose quartz, argent doux, cyan verre' : '',
        boxingContext ? 'graphite ring, rouge gant, corail énergie, champagne peau, contraste blanc' : '',
        luminaContext ? 'surfaces transparentes, profondeur 4D, lumières cyan/menthe/rose froid, animations discrètes' : '',
        accountingContext && /\bapple|macos|figma|lumina|luma|futur|future|futuriste|3d|immersif|immersive|glass|verre\b/.test(source) ? 'finance OS premium, verre dépoli, profondeur, panneaux flottants' : '',
        /\bbleu nuit|etoile|étoile|cosmique|univers|halo|verre|glass|transparent\b/.test(source) ? 'univers bleu nuit, halos, verre dépoli' : '',
        /\bminimal|sobre|clair|epure|épuré\b/.test(source) ? 'sobre et lisible' : '',
        /\benergie|sport|fitness|dynamique\b/.test(source) ? 'énergique et rythmé' : '',
        /\brestaurant|italien|cuisine|menu\b/.test(source) ? 'sensoriel, chaleureux et appétissant' : '',
    ].filter(Boolean);

    return {
        sector,
        briefProfile: getBriefProfileSummary(profile),
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
            'Commence mentalement par la fiche interne fournie dans les indices : activite exacte, public, promesse, ton, sections, exclusions et conversion. Toute page doit rester compatible avec cette fiche.',
            'Les exclusions explicites du brief sont des interdictions, pas des indices de selection. Si le brief dit "pas juridique", "ni policier", "sans securite", aucun contenu juridique, policier ou securite ne doit apparaitre.',
            'Ne complète jamais par un univers voisin absent : pas de musee, archeologie, artefacts, ruines, cartels, exposition, expedition ou portail onirique si ces mots ne sont pas dans le brief. Objet/souvenir/photo/lettre ne veut pas dire musee.',
            'N’utilise jamais une maquette comme source de contenu metier : elle peut inspirer la composition uniquement.',
            'Inclue explicitement secteur, cible, style visuel, couleurs, sections, ambiance, images conseillees, hierarchie, CTA, SEO et raisons des choix.',
            'La proposition doit pouvoir alimenter un aperçu visuel premium : hero fort, cartes ou modules utiles, image sectorielle pertinente, preuve de confiance, action principale claire.',
            'Si le brief parle du fond bleu nuit étoilé, verre, halos ou univers premium, exploite cette base au lieu de proposer des cadres opaques.',
            'Si le brief parle de gestion de crise, communication de crise, crise médiatique, juridique, sociale, cyber, réputationnelle, intervention d’urgence, cellule de crise, formulaire confidentiel, dirigeants, directions juridiques ou équipes communication, produis un site d’agence de gestion de crise : accès urgence, scénarios de crise, méthodologie, expertises mobilisées, interventions d’urgence, formations, dirigeants/directions et formulaire confidentiel. Ne propose jamais cabinet d’avocats classique, DPE, RGE, prédiagnostic, aides financières, travaux, logement ou rénovation.',
            'Si le brief parle de conciergerie automobile, service automobile, entretien, nettoyage, contrôle technique, convoyage, suivi du véhicule ou prise en charge, produis un site de conciergerie automobile : services, forfaits, fonctionnement, zones couvertes et demande de prise en charge. Ne propose jamais recrutement, candidats, cabinet tech, finance ou portfolio.',
            'Si le brief parle de centre médical pluridisciplinaire, maison de santé, praticiens, spécialités, disponibilités, langues parlées, prévention santé, urgence ou professionnels à recruter, produis un site médical clair et humain : spécialités, profils praticiens filtrables, rendez-vous, prévention, accès, urgence et espace professionnels. Ne propose jamais portail de rêve, traversée guidée, carte onirique, expérience immersive de rêve ou plateforme hospitalière froide.',
            'Si le brief parle d’une école privée, d’un établissement scolaire, de maternelle primaire collège, projet pédagogique, inscriptions, familles déjà inscrites, enseignants souhaitant postuler, agenda, actualités, documents téléchargeables ou visite virtuelle, produis un site institutionnel scolaire. Ne propose jamais une application enfant, jeux, comptines, commencer à jouer ou parcours du jour.',
            'Si le brief parle de centre de rééducation sportive, clinique du sport, médecine du sport, kinésithérapeutes du sport, médecins du sport, ostéopathes, préparateurs physiques, nutritionnistes, blessure, retour au sport, objectif de reprise, protocoles, bilans, prévention ou suivi à distance, produis un site de rééducation sportive : équipe pluridisciplinaire, parcours blessure, parcours par sport, objectif reprise, équipements, protocoles, bilans, prévention et suivi à distance. Ne propose jamais salle de fitness, cours collectifs, abonnements, espace membre, réserver un essai, planning de cours ou centre médical générique.',
            'Si le brief parle de transport accompagné pour personnes âgées, seniors, PMR, mobilité réduite, familles, établissements de santé ou collectivités, produis un site de mobilité accompagnée : types de trajets, sécurité, accompagnement humain, zones couvertes, tarifs, réservation de trajet régulier et partenariat. Ne propose jamais conciergerie automobile, véhicule pris en charge, contrôle technique, nettoyage auto ou convoyage.',
            'Si le brief parle de rénovation énergétique, isolation, chauffage, ventilation, audit, aides financières, copropriétés, prédiagnostic, estimation, certifications, réalisations ou garanties, produis un site expert rénovation énergétique : type de logement, problèmes, budget, prédiagnostic, étapes, aides, certifications, réalisations, garanties et dépôt de dossier. Ne propose jamais agence immobilière, recherche de bien, mandat, boutique, shop ou clichés tout verts avec feuilles.',
            'Si le brief parle de logiciel/application/SaaS pour restaurateurs avec réservations, stocks, fournisseurs, coûts de recettes, plannings d’équipe, démonstration, formules, comparaison d’offres ou groupes multi-restaurants, produis un site public produit SaaS restaurateurs : problèmes concrets, réservations, stocks, fournisseurs, coûts recettes, planning équipe, simplicité, démo, tarifs, comparatif et multi-restaurants. Ne propose jamais menu du jour, réserver une table, histoire du chef, site de restaurant ou dashboard comptable dominant.',
            'Si le brief parle de maison funéraire, pompes funèbres, obsèques, deuil, cérémonies civiles ou religieuses, prévoyance obsèques, accompagnement administratif, familles éloignées ou espace hommage privé, produis un site de maison funéraire nouvelle génération : démarches avant/pendant/après, cérémonies, prévoyance, administratif, familles éloignées, espace hommage privé, messages/photos/souvenirs et contact discret. Ne propose jamais hôtel, chambres, réservation séjour, mobilité accompagnée, trajets, transport senior, DPE, RGE, prédiagnostic, cabinet d’avocats classique, SaaS restaurateurs, noir dominant, marbre ou ambiance froide.',
            'Si le brief parle de vêtements enfants, marque enfant, mode enfant, collections, matières, guide des tailles ou boutique enfant, produis une boutique de vêtements enfants durable : collections, matières, engagements, guide des tailles et boutique. Ne propose jamais comptines, mini-jeux, espace parent ou application éducative.',
            'Si le brief parle réellement d’application enfant, mini-jeux, comptines, jeux éducatifs ou produit applicatif enfant, produis une direction story-world applicative. Le mot histoire seul, école maternelle seule ou espace parent dans un site d’école ne suffit pas.',
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

const buildCompactOpenAiUserPrompt = ({ brief, revision, currentProposal }) => {
    const inferredContext = inferOpenAiBriefContext(brief);
    const parts = [
        'Brief utilisateur a respecter strictement :',
        brief,
        '',
        'Fiche interne extraite du brief, a utiliser comme contrainte et non comme template :',
        JSON.stringify(inferredContext, null, 2),
        '',
        [
            'Produis une proposition JSON complete pour le site.',
            'Source de verite : le brief utilisateur.',
            'Ne remplace jamais le brief par un ancien metier, un template sectoriel, des textes generiques ou des associations de mots-clefs.',
            'Les exclusions explicites bloquent le contenu correspondant ; elles ne doivent jamais declencher un univers.',
            'Ne repete jamais les mots des exclusions dans les titres, slogans, sections, services, CTA, promesses ou textes visibles ; place-les uniquement dans mustAvoid.',
            'N ajoute aucun service principal, public, resultat, section, CTA, lieu ou image qui ne soit pas demande ou strictement necessaire a la comprehension.',
            'Distingue clairement : activite exacte, public, promesse, ton, inclusions, exclusions, conversion attendue.',
            'projectAnalysis, brandIdentity et experienceBlueprint sont obligatoires et complets.',
            'Ne genere plus un template. Cree un systeme de marque propre au projet : concept, palette hexadecimale contrastee, typographie, composition, densite, formes, strategie d image, signature et mouvement utile.',
            'Le premier ecran doit montrer un objet principal utilisable issu du brief : menu, workflow, dashboard, reservation, catalogue, chronologie, comparaison ou recit. Aucun grand bloc vide ni photo de remplissage.',
            'Interdits : WordPress, Bootstrap classique, enchainement automatique Hero Services Galerie Contact, blocs decoratifs vides, photo de banque d images dominante, cliches litteraux du metier.',
            'Une image sert uniquement de preuve du produit, du resultat ou du service. Sinon utilise imageStrategy graphic-system.',
            'Deux briefs du meme secteur doivent produire des identites differentes si leur positionnement, leur culture, leur cible ou leur usage different.',
            'narrativePlan obligatoire : discovery, understanding, proof, conversion.',
            'visualPlan obligatoire : hero, sections, gallery, conversion ; chaque visuel doit servir une etape narrative et provenir du brief.',
            'Aucun vocabulaire interne visible : Canvas, Lumina, brief-driven, diagnostic IA, simulation, suivi intelligent, modele metier.',
            'Textes courts, professionnels, directement utilisables dans la maquette.',
            'Contraintes de taille strictes : 3 a 5 pages maximum, 4 homeSections maximum, 3 services maximum, 2 recommendedServices maximum, 3 idees clientAcquisition maximum, visualPlan.sections 2 items maximum, visualPlan.gallery 2 items maximum.',
            'Chaque titre doit etre court. Chaque texte, description, raison ou message doit tenir en une phrase de 120 caracteres maximum.',
            'Retourne uniquement le JSON du schema systeme, sans markdown.',
        ].join('\n'),
    ];

    if (revision) {
        parts.push('Modification utilisateur a appliquer :');
        parts.push(revision);
        parts.push('Applique directement la modification. Conserve l identite et la structure coherentes avec le brief, sauf si la demande exige de les changer. Retourne toujours la proposition complete.');
    }

    if (currentProposal) {
        parts.push('Contexte precedent, a ne pas recopier comme template :');
        parts.push(JSON.stringify(currentProposal).slice(0, 5200));
    }

    return parts.join('\n\n');
};

const requestOpenAiProposal = async ({ apiKey, model, brief, revision, currentProposal, trace }) => {
    const userPrompt = buildCompactOpenAiUserPrompt({ brief, revision, currentProposal });
    const timeoutMs = getOpenAiTimeoutMs();
    const requestBody = {
        model,
        ...getOpenAiGenerationControls(model, {
            temperature: 0.92,
            top_p: 0.95,
            presence_penalty: 0.25,
            frequency_penalty: 0.15,
        }),
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: KIRBY_COMPACT_SYSTEM_PROMPT },
            {
                role: 'user',
                content: userPrompt,
            },
        ],
    };
    const requestBodyText = JSON.stringify(requestBody);
    const startedAt = Date.now();
    const traceCall = trace ? {
        model,
        startedAt: new Date(startedAt).toISOString(),
        timeoutMs,
        briefSentToOpenAi: brief,
        userPromptSentToOpenAi: userPrompt,
        promptCharacters: userPrompt.length,
        promptBytes: getTextByteSize(userPrompt),
        promptEstimatedTokens: estimateTokenCount(userPrompt),
        systemPromptCharacters: KIRBY_COMPACT_SYSTEM_PROMPT.length,
        requestBodyBytes: getTextByteSize(requestBodyText),
        expectedResponse: getOpenAiExpectedResponseEstimate(requestBody),
        requestBody,
        elapsedMs: null,
        errorType: '',
        rawResponseText: '',
        rawMessageContent: '',
        error: null,
    } : null;

    if (traceCall) {
        trace.openAi.calls.push(traceCall);
    }

    let response;
    try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            signal: typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
                ? AbortSignal.timeout(timeoutMs)
                : undefined,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: requestBodyText,
        });
    } catch (error) {
        if (traceCall) {
            traceCall.elapsedMs = Date.now() - startedAt;
            traceCall.errorType = error && error.name ? error.name : typeof error;
            traceCall.error = {
                code: error && error.message ? error.message : 'openai_fetch_failed',
                name: error && error.name ? error.name : '',
                cause: error && error.cause ? String(error.cause) : '',
            };
        }
        throw error;
    }
    if (traceCall) {
        traceCall.elapsedMs = Date.now() - startedAt;
    }
    const rawResponseText = await response.text();

    if (traceCall) {
        traceCall.rawResponseText = rawResponseText;
    }

    if (!response.ok) {
        const error = new Error('openai_request_failed');
        error.status = response.status;
        error.responseBody = rawResponseText;
        if (traceCall) {
            traceCall.errorType = 'HTTPError';
            traceCall.error = {
                code: error.message,
                status: error.status,
                responseBody: rawResponseText,
            };
        }
        throw error;
    }

    const payload = JSON.parse(rawResponseText);
    const content = payload && payload.choices && payload.choices[0] && payload.choices[0].message
        ? payload.choices[0].message.content
        : '';
    if (traceCall) {
        traceCall.rawMessageContent = content;
    }

    return parseOpenAiJson(content);
};

const getOpenAiModels = () => {
    const model = normalize(process.env.KIRBY_OPENAI_MODEL || process.env.OPENAI_MODEL || 'gpt-5.5');

    return [model];
};

const getOpenAiCvModels = () => {
    const configured = normalize(process.env.KIRBY_CV_OPENAI_MODEL || process.env.KIRBY_CV_OPENAI_MODELS);
    const models = configured
        ? configured.split(',').map(normalize).filter(Boolean)
        : getOpenAiModels();

    return [...new Set(models)];
};

const callOpenAi = async ({ brief, revision, currentProposal, trace }) => {
    const apiKeys = getOpenAiKeys();

    if (!apiKeys.length) {
        if (trace) {
            trace.openAi.enabled = false;
            trace.openAi.finalError = { code: 'no_openai_api_key' };
        }
        return null;
    }

    const models = getOpenAiModels();
    const errors = [];
    if (trace) {
        trace.openAi.enabled = true;
        trace.openAi.modelsConfigured = models;
    }

    for (const apiKey of apiKeys) {
        for (const model of models) {
            try {
                return {
                    proposal: await requestOpenAiProposal({ apiKey, model, brief, revision, currentProposal, trace }),
                    model,
                };
            } catch (error) {
                errors.push({
                    code: error && error.message ? error.message : 'openai_request_failed',
                    status: error && error.status ? error.status : undefined,
                    model,
                    responseBody: error && error.responseBody ? error.responseBody : undefined,
                });
                console.error('Kirby OpenAI raw error:', {
                    model,
                    status: error && error.status ? error.status : undefined,
                    responseBody: error && error.responseBody ? error.responseBody : undefined,
                    message: error && error.message ? error.message : 'openai_request_failed',
                });
            }
        }
    }

    const finalError = new Error('openai_request_failed');
    finalError.statuses = errors.map((error) => error.status).filter(Boolean);
    finalError.models = errors.map((error) => error.model).filter(Boolean);
    finalError.errors = errors;
    if (trace) {
        trace.openAi.finalError = {
            code: finalError.message,
            statuses: finalError.statuses,
            models: finalError.models,
            errors,
        };
    }
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
    if (request.method === 'GET' || request.method === 'HEAD') {
        response.setHeader('Allow', 'GET, HEAD, POST');

        if (request.method === 'HEAD') {
            response.statusCode = 200;
            response.end();
            return;
        }

        return json(response, 200, {
            ok: true,
            service: 'kirby',
            message: 'Kirby est disponible. Utilisez POST /api/kirby pour lancer une analyse.',
        });
    }

    if (request.method !== 'POST') {
        response.setHeader('Allow', 'GET, HEAD, POST');
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

        return json(response, 503, {
            ok: false,
            error: 'kirby_cv_openai_unavailable',
            message: 'Kirby IA est indisponible pour le CV. Aucune modification n’a été appliquée.',
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
    const debugTrace = payload.debugTrace === true
        ? createKirbyDebugTrace({ brief, revision, effectiveBrief, effectiveRevision })
        : null;

    if (debugTrace) {
        debugTrace.structuredAnalysis = inferOpenAiBriefContext(effectiveBrief);
        debugTrace.fallbackTemplate = 'brief-driven-pipeline-only';
    }

    if (effectiveBrief.length < 8) {
        return json(response, 400, { error: 'brief_too_short' });
    }

    try {
        const openAiProposal = await callOpenAi({ brief: effectiveBrief, revision: effectiveRevision, currentProposal, trace: debugTrace });

        if (openAiProposal) {
            const sanitizedProposal = finalizeOpenAiSiteProposal({
                proposal: openAiProposal.proposal,
                brief: effectiveBrief,
            });
            const pipelineIssues = getKirbyPipelineQualityIssues(sanitizedProposal, effectiveBrief, { source: 'openai' });
            if (pipelineIssues.length) {
                if (debugTrace) {
                    debugTrace.fallbackUsed = false;
                    debugTrace.fallbackReason = 'pipeline_quality_blocked';
                    debugTrace.finalTemplate = summarizeTraceProposal(sanitizedProposal);
                    debugTrace.finalServices = getTraceServices(sanitizedProposal);
                    logKirbyDebugTrace(debugTrace);
                }
                return json(response, 422, {
                    ok: false,
                    error: 'kirby_pipeline_invalid',
                    issues: pipelineIssues,
                    ...(debugTrace ? { debugTrace } : {}),
                });
            }
            if (debugTrace) {
                debugTrace.fallbackUsed = false;
                debugTrace.finalTemplate = summarizeTraceProposal(sanitizedProposal);
                debugTrace.finalServices = getTraceServices(sanitizedProposal);
                logKirbyDebugTrace(debugTrace);
            }
            return json(response, 200, {
                ok: true,
                source: 'openai',
                model: openAiProposal.model,
                proposal: sanitizedProposal,
                ...(debugTrace ? { debugTrace } : {}),
            });
        }
        if (debugTrace) {
            debugTrace.fallbackReason = 'openai_not_configured_or_returned_null';
        }
    } catch (error) {
        if (debugTrace) {
            debugTrace.fallbackReason = error && error.message ? error.message : 'openai_request_failed';
            debugTrace.openAi.finalError = debugTrace.openAi.finalError || {
                code: debugTrace.fallbackReason,
                status: error && error.status ? error.status : undefined,
                statuses: error && error.statuses ? error.statuses : undefined,
                models: error && error.models ? error.models : undefined,
                errors: error && error.errors ? error.errors : undefined,
            };
        }
        console.error('Kirby OpenAI failed:', {
            code: error && error.message ? error.message : 'openai_request_failed',
            status: error && error.status ? error.status : undefined,
            statuses: error && error.statuses ? error.statuses : undefined,
        });
    }

    if (debugTrace) {
        debugTrace.fallbackUsed = false;
        debugTrace.fallbackReason = debugTrace.fallbackReason || 'openai_pipeline_unavailable';
        logKirbyDebugTrace(debugTrace);
    }

    return json(response, 503, {
        ok: false,
        error: 'kirby_openai_pipeline_unavailable',
        issues: ['OpenAI n’a pas retourné une proposition validable. Aucun fallback historique n’est autorisé.'],
        ...(debugTrace ? { debugTrace } : {}),
    });
};
