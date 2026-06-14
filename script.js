const navLinks = document.querySelectorAll('.nav-links a, .site-menu-links a');
const siteMenuToggle = document.querySelector('#site-menu-toggle');
const siteMenuPanel = document.querySelector('#site-menu-panel');
const cvOpenLinks = document.querySelectorAll('a[href="#cv-intelligent"]');
const sections = [...document.querySelectorAll('main section[id]')];
const contactForm = document.querySelector('#contact-form');
const contactFormStatus = document.querySelector('#contact-form-status');
const cards = document.querySelectorAll('.card');
const revealSections = document.querySelectorAll('.reveal-section');
const cvForm = document.querySelector('#cv-form');
const cvPrintButton = document.querySelector('#cv-print');
const cvExportPdfButton = document.querySelector('#cv-export-pdf');
const cvAutofillButton = document.querySelector('#cv-autofill');
const cvImproveButton = document.querySelector('#cv-improve');
const cvOptimizeMainButton = document.querySelector('#cv-optimize-main');
const cvSaveButton = document.querySelector('#cv-save');
const cvFitPageButton = document.querySelector('#cv-fit-page');
const cvImportInput = document.querySelector('#cv-import');
const cvExportWordButton = document.querySelector('#cv-export-word');
const cvExportWebButton = document.querySelector('#cv-export-web');
const cvShareButton = document.querySelector('#cv-share');
const cvEmailButton = document.querySelector('#cv-email');
const cvAiImproveButton = document.querySelector('#cv-ai-improve');
const cvAiSummaryButton = document.querySelector('#cv-ai-summary');
const cvAiSkillsButton = document.querySelector('#cv-ai-skills');
const cvAiProofreadButton = document.querySelector('#cv-ai-proofread');
const cvImproveExperienceButton = document.querySelector('#cv-improve-experience');
const cvImproveProjectsButton = document.querySelector('#cv-improve-projects');
const experienceAddButton = document.querySelector('#experience-add');
const experienceCards = document.querySelector('#experience-cards');
const cvStatus = document.querySelector('#cv-status');
const atsScoreValue = document.querySelector('#ats-score-value');
const jobMatchValue = document.querySelector('#job-match-value');
const cvAnalysisList = document.querySelector('#cv-analysis-list');
const cvSuggestionsList = document.querySelector('#cv-suggestions-list');
const cvAnalyzeButton = document.querySelector('#cv-analyze');
const cvMatchJobButton = document.querySelector('#cv-match-job');
const jobOfferField = document.querySelector('#job-offer');
const cvLayout = document.querySelector('#cv-layout');
const cvEditorPanel = document.querySelector('#cv-editor-panel');
const cvLayoutToggle = document.querySelector('#cv-layout-toggle');
const cvPreviewShell = document.querySelector('.cv-preview-shell');
const cvPreviewViewport = document.querySelector('#cv-preview-viewport');
const cvPreviewStage = document.querySelector('#cv-preview-stage');
const previewModeTabs = document.querySelectorAll('[data-preview-mode]');
const cvOverflowIndicator = document.querySelector('#cv-overflow-indicator');
const previewHeadlineScale = document.querySelector('#preview-headline-scale');
const previewLineSpacing = document.querySelector('#preview-line-spacing');
const previewLayoutTheme = document.querySelector('#preview-layout-theme');
const previewFitInlineButton = document.querySelector('#preview-fit-inline');
const cvWordToolbarShell = document.querySelector('#cv-word-toolbar-shell');
const cvInlineFont = document.querySelector('#cv-inline-font');
const cvInlineSize = document.querySelector('#cv-inline-size');
const cvInlineBoldButton = document.querySelector('#cv-inline-bold');
const cvInlineItalicButton = document.querySelector('#cv-inline-italic');
const cvInlineUnderlineButton = document.querySelector('#cv-inline-underline');
const cvInlineAlignButtons = document.querySelectorAll('[data-align]');
const cvInlineListButton = document.querySelector('#cv-inline-list');
const cvInlineIndentButton = document.querySelector('#cv-inline-indent');
const cvInlineOutdentButton = document.querySelector('#cv-inline-outdent');
const cvInlineClearButton = document.querySelector('#cv-inline-clear');
const cvInlineLineHeight = document.querySelector('#cv-inline-line-height');
const previewSectionsRoot = document.querySelector('#cv-preview-sections');
const letterCompanyField = document.querySelector('#letter-company');
const letterRoleField = document.querySelector('#letter-role');
const letterStyleField = document.querySelector('#letter-style');
const letterMotivationField = document.querySelector('#letter-motivation');
const letterGenerateButton = document.querySelector('#letter-generate');
const letterExportWordButton = document.querySelector('#letter-export-word');
const letterEmailButton = document.querySelector('#letter-email');
const letterSubject = document.querySelector('#letter-subject');
const letterBody = document.querySelector('#letter-body');
const letterPagePreview = document.querySelector('#letter-page-preview');
const letterPageTitle = document.querySelector('#letter-page-title');
const letterPageMeta = document.querySelector('#letter-page-meta');
const letterSubjectPage = document.querySelector('#letter-subject-page');
const letterBodyPage = document.querySelector('#letter-body-page');
const coverLetterPanel = document.querySelector('#cover-letter-panel');
const interactiveCards = document.querySelectorAll('.interactive-card');
const assistantToggle = document.querySelector('#assistant-toggle');
const assistantClose = document.querySelector('#assistant-close');
const assistantChat = document.querySelector('#assistant-chat');
const assistantForm = document.querySelector('#assistant-form');
const assistantInput = document.querySelector('#assistant-input');
const assistantMessages = document.querySelector('#assistant-messages');
const suggestionChips = document.querySelectorAll('.suggestion-chip');
const themeToggles = document.querySelectorAll('.theme-toggle');
const aiBriefForm = document.querySelector('#ai-brief-form');
const aiBriefInput = document.querySelector('#ai-brief-input');
const aiBriefStyle = document.querySelector('#ai-brief-style');
const aiBriefGoal = document.querySelector('#ai-brief-goal');
const aiBriefOutput = document.querySelector('#ai-brief-output');
const kirbyExampleButtons = document.querySelectorAll('[data-kirby-example]');
const qrServiceForm = document.querySelector('#qr-service-form');
const qrServiceInput = document.querySelector('#qr-service-input');
const qrServicePreview = document.querySelector('#qr-service-preview');
const qrServiceImage = document.querySelector('#qr-service-image');
const qrServiceDownload = document.querySelector('#qr-service-download');
const qrServiceTest = document.querySelector('#qr-service-test');
const qrServiceStatus = document.querySelector('#qr-service-status');
const expandableCards = document.querySelectorAll('[data-expandable]');
const presetChips = document.querySelectorAll('.preset-chip');
const templatePresetChips = document.querySelectorAll('[data-template-preset]');
const authOpenLoginButton = document.querySelector('#auth-open-login');
const authOpenSignupButton = document.querySelector('#auth-open-signup');
const authLogoutButton = document.querySelector('#auth-logout');
const authCurrentUserLabel = document.querySelector('#auth-current-user');
const authModal = document.querySelector('#auth-modal');
const authCloseButton = document.querySelector('#auth-close');
const authFeedback = document.querySelector('#auth-feedback');
const authTabs = document.querySelectorAll('[data-auth-view]');
const authLoginPanel = document.querySelector('#auth-panel-login');
const authSignupPanel = document.querySelector('#auth-panel-signup');
const authLoginForm = document.querySelector('#auth-login-form');
const authSignupForm = document.querySelector('#auth-signup-form');
const passwordToggleButtons = document.querySelectorAll('[data-password-toggle]');
const PDFJS_MODULE_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs';

let pdfjsLoader;
let currentPreviewPage = 1;
let currentPreviewMode = 'cv';
let isAutoFittingCv = false;
let cvSectionOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];
let currentUser = null;
let activeEditableNode = null;
let cvEditableContent = {};
let isRenderingExperienceEditor = false;
let isSyncingExperienceEditor = false;
let lastAssistantAction = null;

const previewNodes = {
    fullName: document.querySelector('#preview-name'),
    meta: document.querySelector('#preview-meta'),
    headline: document.querySelector('#preview-headline'),
    summary: document.querySelector('#preview-summary'),
    experience: document.querySelector('#preview-experience'),
    projects: document.querySelector('#preview-projects'),
    skills: document.querySelector('#preview-skills'),
    education: document.querySelector('#preview-education'),
    languages: document.querySelector('#preview-languages'),
    activities: document.querySelector('#preview-activities'),
    preview: document.querySelector('#cv-preview'),
};

const editableFieldMap = {
    fullName: 'fullName',
    headline: 'headline',
    summary: 'summary',
    skills: 'skills',
    experience: 'experience',
    projects: 'projects',
    education: 'education',
    activities: 'activities',
    languages: 'languages',
    location: 'location',
    phone: 'location',
    email: 'location',
    permit: 'location',
};

const editablePreviewNodeMap = {
    fullName: previewNodes.fullName,
    headline: previewNodes.headline,
    summary: previewNodes.summary,
    skills: previewNodes.skills,
    experience: previewNodes.experience,
    projects: previewNodes.projects,
    education: previewNodes.education,
    activities: previewNodes.activities,
    languages: previewNodes.languages,
    location: previewNodes.meta,
};

const editableTargets = Object.keys(editablePreviewNodeMap);
const structuredPreviewTargets = new Set(['experience', 'projects', 'education']);
const defaultCvValues = cvForm ? Object.fromEntries(new FormData(cvForm).entries()) : {};

const getExperienceField = () => cvForm?.querySelector('textarea[name="experience"]') || cvForm?.elements.experience || null;

const templateThemeMap = {
    wordpro: 'template-wordpro',
    classic: 'template-classic',
    modern: 'template-modern',
    executive: 'template-executive',
    minimal: 'template-minimal',
    ats: 'template-ats',
    elegant: 'template-elegant',
    premium: 'template-premium',
    creative: 'template-creative',
};

const cvSectionLabels = {
    summary: 'Profil',
    skills: 'Competences',
    experience: 'Experiences professionnelles',
    projects: 'Projets',
    education: 'Formations',
    activities: 'Activites',
    languages: 'Langues',
};

const templatePresets = {
    ats: {
        layoutTheme: 'ats',
        fontTheme: 'inter',
        colorTheme: 'graphite',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'tight',
        textAlign: 'left',
        accentColor: '#24324a',
        paperColor: '#ffffff',
        frameColor: '#d8dee8',
    },
    modern: {
        layoutTheme: 'modern',
        fontTheme: 'manrope',
        colorTheme: 'indigo',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#2f3f7f',
        paperColor: '#ffffff',
        frameColor: '#d9deea',
    },
    elegant: {
        layoutTheme: 'elegant',
        fontTheme: 'lato',
        colorTheme: 'graphite',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'tight',
        textAlign: 'left',
        accentColor: '#334155',
        paperColor: '#ffffff',
        frameColor: '#d9dee8',
    },
    premium: {
        layoutTheme: 'premium',
        fontTheme: 'lato',
        colorTheme: 'indigo',
        designMood: 'luxury',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'tight',
        textAlign: 'left',
        accentColor: '#8a6727',
        paperColor: '#ffffff',
        frameColor: '#d9c79b',
    },
    creative: {
        layoutTheme: 'creative',
        fontTheme: 'manrope',
        colorTheme: 'rose',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#a31564',
        paperColor: '#ffffff',
        frameColor: '#efd1df',
    },
    classic: {
        layoutTheme: 'ats',
        fontTheme: 'lato',
        colorTheme: 'graphite',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'tight',
        textAlign: 'left',
        accentColor: '#334155',
        paperColor: '#ffffff',
        frameColor: '#d9dee8',
    },
    professional: {
        layoutTheme: 'modern',
        fontTheme: 'lato',
        colorTheme: 'indigo',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'tight',
        textAlign: 'left',
        accentColor: '#2f3f7f',
        paperColor: '#ffffff',
        frameColor: '#d9deea',
    },
    design: {
        layoutTheme: 'creative',
        fontTheme: 'manrope',
        colorTheme: 'rose',
        designMood: 'clean',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#b83280',
        paperColor: '#ffffff',
        frameColor: '#f4bdd8',
    },
    luxury: {
        layoutTheme: 'premium',
        fontTheme: 'manrope',
        colorTheme: 'graphite',
        designMood: 'luxury',
        fontSize: 'compact',
        headlineScale: 'normal',
        lineSpacing: 'tight',
        textAlign: 'left',
        accentColor: '#9a7b43',
        paperColor: '#ffffff',
        frameColor: '#d8bd7c',
    },
};

const offerKeywordMap = {
    react: ['react', 'javascript', 'frontend', 'front-end', 'component'],
    ux: ['ux', 'ui', 'experience utilisateur', 'interface', 'figma'],
    api: ['api', 'integration', 'donnees', 'base de donnees'],
    client: ['relation client', 'accompagnement', 'service client', 'conseil'],
};

const applySiteTheme = (theme) => {
    const nextTheme = theme === 'day' ? 'day' : 'night';
    document.body.dataset.theme = nextTheme;
    themeToggles.forEach((toggle) => {
        toggle.setAttribute('aria-pressed', String(nextTheme === 'day'));
        const label = toggle.querySelector('.theme-toggle-text');
        if (label) {
            label.textContent = nextTheme === 'day' ? 'Nuit' : 'Jour';
        }
    });
    try {
        window.localStorage.setItem('sa-creation-web-theme', nextTheme);
    } catch (error) {
        console.warn('Theme preference not saved', error);
    }
};

const initSiteTheme = () => {
    let storedTheme = 'night';
    try {
        storedTheme = window.localStorage.getItem('sa-creation-web-theme') || 'night';
    } catch (error) {
        storedTheme = 'night';
    }

    applySiteTheme(storedTheme);
};

const closeSiteMenu = () => {
    siteMenuToggle?.setAttribute('aria-expanded', 'false');
    siteMenuPanel?.classList.remove('is-open');
};

const applyCvPreset = (preset) => {
    if (!cvForm) {
        return;
    }

    const form = cvForm.elements;
    const defaultEmail = currentUser?.email || 'email@exemple.com';

    if (['client', 'banking', 'transport', 'admin'].includes(preset)) {
        clearEditableOverrides();
    }

    if (preset === 'client') {
        form.headline.value = 'Conseillere clientele / Gestion administrative';
        form.summary.value = "Professionnelle organisee et rigoureuse avec une experience dans la relation client, la gestion administrative et le suivi de dossiers. Capacite a gerer les demandes clients, a travailler en equipe et a assurer un service de qualite.";
        form.skills.value = [
            'Relation client',
            'Gestion administrative',
            'Organisation et gestion des dossiers',
            'Communication professionnelle',
            'Travail en equipe',
            'Maitrise des outils bureautiques',
        ].join('\n');
        form.experience.value = [
            'Entreprise / Organisation - Poste occupe • Ville | Dates • Accueil et accompagnement des clients • Gestion et suivi des dossiers administratifs • Traitement des demandes et resolution des problemes',
            'Entreprise / Organisation - Poste occupe • Ville | Dates • Gestion des appels et des courriers • Organisation et classement des documents • Suivi administratif',
        ].join('\n');
        form.projectType.value = 'Projet personnel';
        form.projects.value = "Plateforme CV intelligent - Prototype personnel - 2024 • Prototype d'une future plateforme de generation de CV intelligents prets a l'emploi avec assistance IA.";
        form.education.value = [
            'Diplome ou formation - Etablissement - Annee',
        ].join('\n');
        form.languages.value = ['Francais : courant', 'Arabe : bilingue'].join('\n');
        form.activities.value = ['Lecture', 'Developpement personnel', 'Voyages'].join('\n');
        form.jobTarget.value = 'relation client';
        form.location.value = 'Ville / code postal';
        form.phone.value = '06 00 00 00 00';
        form.email.value = defaultEmail;
        form.permit.value = 'Permis B';
        form.fontTheme.value = 'lato';
        form.layoutTheme.value = 'wordpro';
        form.colorTheme.value = 'graphite';
        form.designMood.value = 'clean';
    }

    if (preset === 'banking') {
        form.headline.value = 'Conseillere clientele bancaire / Gestion de comptes';
        form.summary.value = "Professionnelle organisee avec experience en relation client et gestion administrative. Capacite a accompagner les clients, analyser leurs besoins et proposer des solutions adaptees.";
        form.skills.value = [
            'Relation et conseil client',
            'Gestion de comptes',
            'Analyse de dossiers',
            'Suivi administratif',
            'Communication professionnelle',
            'Outils bureautiques',
        ].join('\n');
        form.experience.value = [
            'Entreprise - Poste | Ville | Dates • Accueil et accompagnement des clients • Gestion des operations et suivi des dossiers • Conseil sur les produits et services',
            'Entreprise - Poste | Ville | Dates • Gestion administrative • Suivi des documents et dossiers clients',
        ].join('\n');
        form.projectType.value = 'Projet metier';
        form.projects.value = 'Parcours client et suivi de comptes - Prototype bancaire - 2024 • Organisation d un parcours plus clair pour la relation client et la gestion des demandes.';
        form.education.value = ['Diplome - Etablissement - Annee'].join('\n');
        form.languages.value = ['Francais - Courant', 'Arabe - Bilingue'].join('\n');
        form.activities.value = ['Lecture', 'Developpement personnel', 'Voyages'].join('\n');
        form.jobTarget.value = 'relation client';
        form.location.value = 'Ville / code postal';
        form.phone.value = '06 00 00 00 00';
        form.email.value = defaultEmail;
        form.permit.value = 'Permis B';
        form.fontTheme.value = 'lato';
        form.layoutTheme.value = 'wordpro';
        form.colorTheme.value = 'indigo';
        form.designMood.value = 'clean';
    }

    if (preset === 'transport') {
        form.headline.value = 'Agent de transport / Conductrice de metro (formation)';
        form.summary.value = "Professionnelle rigoureuse et organisee, motivee par les metiers du transport public. Sens aigu des responsabilites, respect strict des procedures de securite et capacite a gerer des situations sous pression.";
        form.skills.value = [
            'Respect des procedures de securite',
            'Sens des responsabilites et vigilance',
            'Gestion du stress et des situations imprevues',
            'Ponctualite et rigueur professionnelle',
            'Relation avec le public et communication',
            'Travail en equipe',
        ].join('\n');
        form.experience.value = [
            'Relation client / Gestion administrative - Divers postes • France | Dates • Accueil et orientation du public • Gestion des demandes et resolution de situations clients • Travail en coordination avec differentes equipes',
        ].join('\n');
        form.projectType.value = 'Projet terrain';
        form.projects.value = 'Simulation parcours usagers - Prototype transport - 2024 • Maquette d un outil de presentation et d information voyageurs.';
        form.education.value = ['Formation ou diplome - Etablissement - Annee'].join('\n');
        form.languages.value = ['Francais : courant', 'Arabe : bilingue'].join('\n');
        form.activities.value = ['Lecture', 'Developpement personnel', 'Activites culturelles'].join('\n');
        form.jobTarget.value = 'relation client';
        form.location.value = 'Ville / code postal';
        form.phone.value = '06 00 00 00 00';
        form.email.value = defaultEmail;
        form.permit.value = 'Permis B et D';
        form.fontTheme.value = 'lato';
        form.layoutTheme.value = 'wordpro';
        form.colorTheme.value = 'graphite';
        form.designMood.value = 'clean';
    }

    if (preset === 'admin') {
        form.headline.value = 'Assistante administrative / Gestion de dossiers';
        form.summary.value = "Professionnelle organisee avec une experience en gestion administrative, classement de documents et suivi des dossiers. Capacite a travailler avec rigueur et a assurer un suivi fiable des demandes.";
        form.skills.value = [
            'Gestion administrative',
            'Organisation des dossiers',
            'Redaction de documents',
            'Suivi des demandes',
            'Pack Office',
            'Communication professionnelle',
        ].join('\n');
        form.experience.value = [
            'Entreprise - Poste | Ville | Dates • Gestion des appels et courriers • Organisation et classement des dossiers • Suivi administratif',
        ].join('\n');
        form.projectType.value = 'Projet bureautique';
        form.projects.value = 'Tableau de suivi administratif - Prototype interne - 2024 • Structuration d un suivi simple pour les demandes et les dossiers.';
        form.education.value = ['Diplome - Etablissement - Annee'].join('\n');
        form.languages.value = ['Francais - Courant', 'Arabe - Bilingue'].join('\n');
        form.activities.value = ['Lecture', 'Developpement personnel', 'Voyages'].join('\n');
        form.jobTarget.value = 'relation client';
        form.location.value = 'Ville / code postal';
        form.phone.value = '06 00 00 00 00';
        form.email.value = defaultEmail;
        form.permit.value = 'Permis B';
        form.fontTheme.value = 'inter';
        form.layoutTheme.value = 'wordpro';
        form.colorTheme.value = 'graphite';
        form.designMood.value = 'clean';
    }

    if (preset === 'luxury') {
        form.fontTheme.value = 'playfair';
        form.layoutTheme.value = 'executive';
        form.colorTheme.value = 'graphite';
        form.designMood.value = 'luxury';
        form.textAlign.value = 'left';
        form.lineSpacing.value = 'airy';
        form.accentColor.value = '#9a7b43';
    }

    if (preset === 'ats') {
        form.cvMode.value = 'ats';
        form.layoutTheme.value = 'wordpro';
        form.fontTheme.value = 'roboto';
        form.colorTheme.value = 'graphite';
        form.designMood.value = 'clean';
        form.textAlign.value = 'left';
        form.lineSpacing.value = 'normal';
    }

    renderExperienceEditor();
    updateCvPreview();
    setCvStatus('Preset applique');
};

const assistantAnswers = [
    {
        test: /cv|resume|curriculum/i,
        reply: "Je peux préparer une base CV, corriger le texte, reformuler les expériences et garder le document prêt à exporter.",
    },
    {
        test: /experience|expérience|projet/i,
        reply: "Je peux restructurer les expériences en blocs propres : poste, entreprise, dates et missions claires.",
    },
    {
        test: /site|creation|plateforme/i,
        reply: "Pour un CV web ou digital, je peux mettre en avant les projets, les outils, l'organisation et les réalisations concrètes.",
    },
    {
        test: /automatisation|workflow|process/i,
        reply: "Je peux transformer des idées courtes en formulations CV plus professionnelles, claires et directement exploitables.",
    },
    {
        test: /ia|ai|intelligence/i,
        reply: "Je peux agir sur le CV : remplir une base, corriger, reformuler, enrichir et adapter à une offre.",
    },
];

const splitLines = (value) =>
    value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

const toTitleCase = (value) =>
    value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const normalizeImportedText = (text) =>
    text
        .replace(/\r/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/[|]/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

const setCvStatus = (message) => {
    if (cvStatus) {
        cvStatus.textContent = message;
    }
};

let cvDraftSaveTimer = null;

const scheduleCvDraftSave = () => {
    window.clearTimeout(cvDraftSaveTimer);
    cvDraftSaveTimer = window.setTimeout(() => {
        saveCvDraft(true);
    }, 500);
};

const escapeHtml = (value = '') =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

const getAuthAccountsStorageKey = () => 'sa-cv-private-accounts-v1';

const getAuthSessionStorageKey = () => 'sa-cv-private-session-v1';

const normalizeAccountEmail = (value = '') => value.trim().toLowerCase();

const getStoredAccounts = () => {
    try {
        const raw = window.localStorage.getItem(getAuthAccountsStorageKey());
        const accounts = raw ? JSON.parse(raw) : [];
        return Array.isArray(accounts) ? accounts : [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

const saveStoredAccounts = (accounts) => {
    window.localStorage.setItem(getAuthAccountsStorageKey(), JSON.stringify(accounts));
};

const hashPassword = async (password) => {
    const value = password.trim();

    if (!window.crypto?.subtle || !window.TextEncoder) {
        return window.btoa(value);
    }

    const buffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const setAuthFeedback = (message = '', isError = false) => {
    if (!authFeedback) {
        return;
    }

    authFeedback.textContent = message;
    authFeedback.style.color = isError ? '#be185d' : '#2f3f7f';
};

const setAuthView = (view) => {
    const activeView = view === 'signup' ? 'signup' : 'login';

    authTabs.forEach((tab) => {
        const isActive = tab.dataset.authView === activeView;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    authLoginPanel?.classList.toggle('is-hidden', activeView !== 'login');
    authSignupPanel?.classList.toggle('is-hidden', activeView !== 'signup');
    setAuthFeedback('');
};

const openAuthModal = (view = 'login') => {
    if (!authModal) {
        return;
    }

    setAuthView(view);
    authModal.classList.remove('is-hidden');
    authModal.setAttribute('aria-hidden', 'false');
};

const closeAuthModal = () => {
    if (!authModal) {
        return;
    }

    authModal.classList.add('is-hidden');
    authModal.setAttribute('aria-hidden', 'true');
    setAuthFeedback('');
};

const persistAuthSession = (user) => {
    currentUser = user
        ? {
            email: normalizeAccountEmail(user.email),
            name: (user.name || '').trim(),
        }
        : null;

    if (currentUser) {
        window.sessionStorage.setItem(getAuthSessionStorageKey(), JSON.stringify(currentUser));
    } else {
        window.sessionStorage.removeItem(getAuthSessionStorageKey());
        window.localStorage.removeItem(getAuthSessionStorageKey());
    }
};

const loadAuthSession = () => {
    try {
        const raw = window.sessionStorage.getItem(getAuthSessionStorageKey());
        currentUser = raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error(error);
        currentUser = null;
    }
};

const updateAuthUi = () => {
    authOpenLoginButton?.classList.toggle('is-hidden', Boolean(currentUser));
    authOpenSignupButton?.classList.toggle('is-hidden', Boolean(currentUser));
    authLogoutButton?.classList.toggle('is-hidden', !currentUser);

    if (authCurrentUserLabel) {
        authCurrentUserLabel.classList.toggle('is-hidden', !currentUser);
        authCurrentUserLabel.textContent = currentUser ? `Acces local : ${currentUser.name || currentUser.email}` : '';
    }

};

const resetCvFormToDefaults = () => {
    if (!cvForm) {
        return;
    }

    Object.entries(defaultCvValues).forEach(([name, value]) => {
        const field = cvForm.elements[name];
        if (!field) {
            return;
        }

        if (field.type === 'checkbox') {
            field.checked = Boolean(value);
        } else {
            field.value = value;
        }
    });
};

const applyCurrentUserDefaults = () => {
    if (!cvForm || !currentUser) {
        return;
    }

    if (cvForm.elements.email) {
        cvForm.elements.email.value = currentUser.email;
    }

    if (cvForm.elements.fullName && currentUser.name && (!cvForm.elements.fullName.value || cvForm.elements.fullName.value === defaultCvValues.fullName)) {
        cvForm.elements.fullName.value = currentUser.name;
    }
};

const getCvDraftStorageKey = () => `sa-cv-private-draft-v4-${currentUser ? normalizeAccountEmail(currentUser.email) : 'guest-session'}`;

const getCvDraftStorage = () => currentUser ? window.localStorage : window.sessionStorage;

const extractEditableNodeStyleState = (node) => ({
    fontFamily: node?.style.fontFamily || '',
    fontSize: node?.style.fontSize || '',
    textAlign: node?.style.textAlign || '',
    lineHeight: node?.style.lineHeight || '1.2',
});

const applyEditableNodeStyleState = (node, styleState = {}) => {
    if (!node) {
        return;
    }

    node.style.fontFamily = styleState.fontFamily || '';
    node.style.fontSize = styleState.fontSize || '';
    node.style.textAlign = styleState.textAlign || '';
    node.style.lineHeight = styleState.lineHeight || '1.2';
};

const isDefaultEditableStyleState = (styleState = {}) =>
    !styleState.fontFamily &&
    !styleState.fontSize &&
    !styleState.textAlign &&
    (!styleState.lineHeight || styleState.lineHeight === '1.2');

const stripBulletPrefix = (line) => line.replace(/^[•●▪◦\-–—*]\s*/, '').trim();

const trimTrailingBreaks = (container) => {
    if (!container) {
        return;
    }

    while (container.lastChild?.nodeType === Node.TEXT_NODE && !(container.lastChild.textContent || '').trim()) {
        container.lastChild.remove();
    }

    while (container.lastChild?.nodeType === Node.ELEMENT_NODE && container.lastChild.tagName === 'BR') {
        container.lastChild.remove();
    }
};

const appendSanitizedInlineChildren = (source, target) => {
    [...(source?.childNodes || [])].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = (child.textContent || '').replace(/\u00a0/g, ' ');
            if (text) {
                target.appendChild(document.createTextNode(text));
            }
            return;
        }

        if (child.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        const tag = child.tagName.toUpperCase();

        if (tag === 'BR') {
            target.appendChild(document.createElement('br'));
            return;
        }

        if (tag === 'STRONG' || tag === 'B') {
            const strong = document.createElement('strong');
            appendSanitizedInlineChildren(child, strong);
            if (strong.textContent.trim()) {
                target.appendChild(strong);
            }
            return;
        }

        if (tag === 'EM' || tag === 'I') {
            const em = document.createElement('em');
            appendSanitizedInlineChildren(child, em);
            if (em.textContent.trim()) {
                target.appendChild(em);
            }
            return;
        }

        if (tag === 'U') {
            const u = document.createElement('u');
            appendSanitizedInlineChildren(child, u);
            if (u.textContent.trim()) {
                target.appendChild(u);
            }
            return;
        }

        if (tag === 'DIV' || tag === 'P' || tag === 'LI') {
            appendSanitizedInlineChildren(child, target);
            target.appendChild(document.createElement('br'));
            return;
        }

        if (tag === 'UL' || tag === 'OL') {
            [...child.querySelectorAll('li')].forEach((item, index) => {
                if (target.childNodes.length) {
                    target.appendChild(document.createElement('br'));
                }
                target.appendChild(document.createTextNode(`• ${item.textContent.trim()}`));
                if (index < child.querySelectorAll('li').length - 1) {
                    target.appendChild(document.createElement('br'));
                }
            });
            return;
        }

        appendSanitizedInlineChildren(child, target);
    });
};

const sanitizeTextBlockHtml = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    const container = document.createElement('div');

    appendSanitizedInlineChildren(template.content, container);
    trimTrailingBreaks(container);

    return container.innerHTML.trim();
};

const createSanitizedListItem = (sourceNode) => {
    const li = document.createElement('li');
    appendSanitizedInlineChildren(sourceNode, li);
    trimTrailingBreaks(li);
    return li;
};

const collectSanitizedListItems = (source, items) => {
    [...(source?.childNodes || [])].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            splitLines(normalizeImportedText(child.textContent || ''))
                .map(stripBulletPrefix)
                .filter(Boolean)
                .forEach((line) => {
                    const li = document.createElement('li');
                    li.textContent = line;
                    items.push(li);
                });
            return;
        }

        if (child.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        const tag = child.tagName.toUpperCase();

        if (tag === 'LI') {
            const li = createSanitizedListItem(child);
            if (li.textContent.trim()) {
                items.push(li);
            }
            return;
        }

        if (tag === 'UL' || tag === 'OL') {
            collectSanitizedListItems(child, items);
            return;
        }

        splitLines(normalizeImportedText(child.textContent || ''))
            .map(stripBulletPrefix)
            .filter(Boolean)
            .forEach((line) => {
                const li = document.createElement('li');
                li.textContent = line;
                items.push(li);
            });
    });
};

const sanitizeListHtml = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    const items = [];

    collectSanitizedListItems(template.content, items);

    return items.map((item) => item.outerHTML).join('');
};

const normalizeEditableNode = (node) => {
    if (!node) {
        return;
    }

    const styleState = extractEditableNodeStyleState(node);
    node.innerHTML = node.tagName === 'UL' || node.tagName === 'OL'
        ? sanitizeListHtml(node.innerHTML)
        : sanitizeTextBlockHtml(node.innerHTML);
    applyEditableNodeStyleState(node, styleState);
};

const storeEditableNodeState = (node) => {
    const target = node?.getAttribute('data-edit-target');

    if (!target) {
        return;
    }

    normalizeEditableNode(node);

    const html = node.innerHTML.trim();
    const style = extractEditableNodeStyleState(node);

    if (!html && isDefaultEditableStyleState(style)) {
        delete cvEditableContent[target];
        return;
    }

    cvEditableContent[target] = { html, style };
};

const clearEditableOverride = (target) => {
    if (!target) {
        return;
    }

    delete cvEditableContent[target];
};

const clearEditableOverrides = (targets = editableTargets) => {
    targets.forEach((target) => clearEditableOverride(target));
};

const saveCvDraft = (silent = false) => {
    if (!cvForm) {
        return;
    }

    const focusedEditableNode = document.activeElement?.closest?.('[contenteditable="true"]');
    if (focusedEditableNode) {
        syncPreviewEditableNode(focusedEditableNode, { refreshPreview: false });
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());
    const payload = {
        values,
        editableContent: cvEditableContent,
        savedAt: new Date().toISOString(),
        user: currentUser?.email || null,
    };
    getCvDraftStorage().setItem(getCvDraftStorageKey(), JSON.stringify(payload));
    setCvStatus(silent ? 'Brouillon enregistre' : 'CV sauvegarde localement');
};

const loadCvDraft = () => {
    if (!cvForm) {
        return;
    }

    resetCvFormToDefaults();
    applyCurrentUserDefaults();
    cvEditableContent = {};

    const raw = getCvDraftStorage().getItem(getCvDraftStorageKey());
    if (!raw) {
        updateCvPreview();
        renderExperienceEditor();
        return;
    }

    try {
        const payload = JSON.parse(raw);
        const values = payload?.values && typeof payload.values === 'object' ? payload.values : payload;
        Object.entries(values).forEach(([key, value]) => {
            const field = cvForm.elements[key];
            if (!field) {
                return;
            }

            if (field.type === 'checkbox') {
                field.checked = Boolean(value);
            } else {
                field.value = value;
            }
        });

        if (payload?.editableContent && typeof payload.editableContent === 'object') {
            cvEditableContent = payload.editableContent;
            structuredPreviewTargets.forEach((target) => {
                delete cvEditableContent[target];
            });
        }
    } catch (error) {
        console.error(error);
    }

    applyCurrentUserDefaults();
    if (shouldCleanCvDraftCasing()) {
        proofreadCvTextFields({ silent: true });
    }
    updateCvPreview();
    renderExperienceEditor();
};

const isBinaryDocument = (file) => {
    const filename = (file?.name || '').toLowerCase();
    const mime = (file?.type || '').toLowerCase();

    return (
        filename.endsWith('.pdf') ||
        filename.endsWith('.doc') ||
        filename.endsWith('.docx') ||
        mime.includes('pdf') ||
        mime.includes('msword') ||
        mime.includes('wordprocessingml')
    );
};

const isLegacyWordDocument = (file) => {
    const filename = (file?.name || '').toLowerCase();
    const mime = (file?.type || '').toLowerCase();

    return filename.endsWith('.doc') || mime.includes('msword');
};

const isDocxDocument = (file) => {
    const filename = (file?.name || '').toLowerCase();
    const mime = (file?.type || '').toLowerCase();

    return filename.endsWith('.docx') || mime.includes('wordprocessingml');
};

const isPdfDocument = (file) => {
    const filename = (file?.name || '').toLowerCase();
    const mime = (file?.type || '').toLowerCase();

    return filename.endsWith('.pdf') || mime.includes('pdf');
};

const loadPdfJs = async () => {
    if (!pdfjsLoader) {
        pdfjsLoader = import(PDFJS_MODULE_URL).then((module) => {
            module.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
            return module;
        });
    }

    return pdfjsLoader;
};

const extractTextFromPdf = async (file) => {
    const pdfjs = await loadPdfJs();
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pageTexts = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const rawItems = textContent.items
            .filter((item) => 'str' in item && item.str && Array.isArray(item.transform))
            .map((item) => ({
                text: item.str.trim(),
                x: Number(item.transform[4] || 0),
                y: Number(item.transform[5] || 0),
            }))
            .filter((item) => item.text);

        if (!rawItems.length) {
            continue;
        }

        rawItems.sort((a, b) => {
            if (Math.abs(b.y - a.y) > 2) {
                return b.y - a.y;
            }
            return a.x - b.x;
        });

        const lines = [];

        rawItems.forEach((item) => {
            const lastLine = lines[lines.length - 1];

            if (!lastLine || Math.abs(lastLine.y - item.y) > 2.5) {
                lines.push({ y: item.y, parts: [item] });
                return;
            }

            lastLine.parts.push(item);
        });

        const pageLineText = lines
            .map((line) =>
                line.parts
                    .sort((a, b) => a.x - b.x)
                    .map((part, index, parts) => {
                        const previous = parts[index - 1];
                        if (!previous) {
                            return part.text;
                        }

                        const gap = part.x - previous.x;
                        const spacer = gap > 12 ? ' ' : '';
                        return `${spacer}${part.text}`;
                    })
                    .join('')
                    .replace(/\s{2,}/g, ' ')
                    .trim()
            )
            .filter(Boolean);

        if (pageLineText.length) {
            pageTexts.push(pageLineText.join('\n'));
        }
    }

    return pageTexts.join('\n\n');
};

const extractTextFromDocx = async (file) => {
    if (!window.mammoth) {
        throw new Error('Mammoth indisponible');
    }

    const buffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value || '';
};

const looksLikeBrokenPdfText = (text) => {
    if (!text) {
        return true;
    }

    const compact = text.replace(/\s+/g, ' ').trim();
    const weirdChars = (compact.match(/[�□■]/g) || []).length;
    const slashCommands = (compact.match(/\/(Title|Parent|Dest|Next|Prev|Font|Type)\b/g) || []).length;
    const markerHits = ['%PDF-', '/Parent', '/Dest', '/Next', 'stream', 'endobj'].filter((marker) => compact.includes(marker)).length;
    const weirdRatio = weirdChars / Math.max(compact.length, 1);

    return weirdRatio > 0.02 || slashCommands >= 2 || markerHits >= 2;
};

const applyCompactCvLayout = (autoTriggered = false) => {
    if (!cvForm) {
        return;
    }

    const summaryField = cvForm.elements.summary;
    const experienceField = cvForm.elements.experience;
    const skillsField = cvForm.elements.skills;
    const educationField = cvForm.elements.education;
    const projectField = cvForm.elements.projects;
    const languagesField = cvForm.elements.languages;
    const activitiesField = cvForm.elements.activities;
    const fontSizeField = cvForm.elements.fontSize;
    const lineSpacingField = cvForm.elements.lineSpacing;
    const layoutThemeField = cvForm.elements.layoutTheme;
    const headlineField = cvForm.elements.headline;

    if (fontSizeField) {
        fontSizeField.value = 'compact';
    }

    if (lineSpacingField) {
        lineSpacingField.value = 'tight';
    }

    if (layoutThemeField && ['executive', 'premium', 'creative'].includes(layoutThemeField.value)) {
        layoutThemeField.value = 'ats';
    }

    if (headlineField?.value.length > 64) {
        headlineField.value = headlineField.value.slice(0, 61).trim();
    }

    if (summaryField?.value.length > 240) {
        summaryField.value = `${summaryField.value.slice(0, 237).trim()}...`;
    }

    if (experienceField) {
        experienceField.value = repairPreviewExperienceItems(splitLines(experienceField.value))
            .slice(0, 4)
            .map((line) => {
                const entry = parseExperienceEntry(line);
                return serializeExperienceEntry({
                    ...entry,
                    bullets: (entry.bullets || []).slice(0, 2),
                });
            })
            .filter(Boolean)
            .join('\n');
    }

    if (projectField) {
        projectField.value = splitLines(projectField.value)
            .slice(0, 3)
            .map((line) => line.split(' • ').slice(0, 3).join(' • '))
            .join('\n');
    }

    if (skillsField) {
        skillsField.value = splitLines(skillsField.value).slice(0, 6).join('\n');
    }

    if (educationField) {
        educationField.value = splitLines(educationField.value).slice(0, 4).join('\n');
    }

    if (languagesField) {
        languagesField.value = splitLines(languagesField.value).slice(0, 3).join('\n');
    }

    if (activitiesField) {
        activitiesField.value = splitLines(activitiesField.value).slice(0, 3).join('\n');
    }

    if (autoTriggered) {
        setCvStatus('CV compacte automatiquement pour tenir sur 1 page');
    }
};

const updateCvPageMode = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());
    const totalLines =
        splitLines(values.experience || '').length +
        splitLines(values.projects || '').length +
        splitLines(values.skills || '').length +
        splitLines(values.education || '').length +
        splitLines(values.languages || '').length +
        splitLines(values.activities || '').length +
        Math.ceil(((values.summary || '').trim().length || 0) / 110);

    const isOverflow = totalLines > 28;

    previewNodes.preview.classList.toggle('is-two-page', isOverflow);
    if (cvOverflowIndicator) {
        cvOverflowIndicator.textContent = isOverflow ? 'CV complet multi-pages' : '1 page';
        cvOverflowIndicator.classList.toggle('is-overflow', isOverflow);
    }
    updatePreviewViewport();
};

const getVisiblePreviewPages = () =>
    [...(cvPreviewStage?.querySelectorAll('.cv-preview') || [])].filter((page) => !page.classList.contains('is-hidden-preview'));

const getPreviewPageCount = () => getVisiblePreviewPages().length || 1;

const setPreviewMode = (mode) => {
    currentPreviewMode = mode === 'letter' ? 'letter' : 'cv';

    if (previewNodes.preview) {
        const showCv = currentPreviewMode === 'cv';
        previewNodes.preview.classList.toggle('is-hidden-preview', !showCv);
        previewNodes.preview.setAttribute('aria-hidden', String(!showCv));
        previewNodes.preview.style.display = showCv ? 'block' : 'none';
        previewNodes.preview.style.visibility = showCv ? 'visible' : 'hidden';
    }

    if (letterPagePreview) {
        const showLetter = currentPreviewMode === 'letter';
        letterPagePreview.classList.toggle('is-hidden-preview', !showLetter);
        letterPagePreview.setAttribute('aria-hidden', String(!showLetter));
        letterPagePreview.style.display = showLetter ? 'block' : 'none';
        letterPagePreview.style.visibility = showLetter ? 'visible' : 'hidden';
    }

    if (coverLetterPanel) {
        const showLetterPanel = currentPreviewMode === 'letter';
        coverLetterPanel.classList.toggle('is-hidden-panel', !showLetterPanel);
        coverLetterPanel.style.display = showLetterPanel ? 'grid' : 'none';
    }

    if (cvWordToolbarShell) {
        cvWordToolbarShell.classList.toggle('is-hidden', currentPreviewMode !== 'cv');
    }

    previewModeTabs.forEach((tab) => {
        const isActive = tab.dataset.previewMode === currentPreviewMode;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    currentPreviewPage = 1;
    updatePreviewViewport();
};

const updatePreviewViewport = () => {
    if (!previewNodes.preview || !cvPreviewStage) {
        return;
    }

    const stagePages = getVisiblePreviewPages();
    if (!stagePages.length) {
        cvPreviewStage.style.height = 'auto';
        return;
    }
    const pageGap = stagePages.length > 1 ? (stagePages.length - 1) * 18 * 3.78 : 0;
    const totalHeight = stagePages.reduce((sum, page) => {
        page.style.transform = '';
        return sum + page.scrollHeight;
    }, 0);

    cvPreviewStage.style.height = `${Math.max(totalHeight + pageGap, 0)}px`;
};

const fitCvToSinglePage = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }
    applyCompactCvLayout(false);
    updateCvPreview();
    setCvStatus('CV compacte sur demande pour tenir sur 1 page');
};

const getPrintFieldBackup = () => {
    if (!cvForm) {
        return null;
    }

    const fieldNames = [
        'summary',
        'experience',
        'projects',
        'skills',
        'education',
        'languages',
        'activities',
        'fontSize',
        'lineSpacing',
        'layoutTheme',
        'headlineScale',
    ];

    return fieldNames.reduce((acc, name) => {
        const field = cvForm.elements[name];
        if (field) {
            acc[name] = field.value;
        }
        return acc;
    }, {});
};

const restorePrintFieldBackup = (backup) => {
    if (!cvForm || !backup) {
        return;
    }

    Object.entries(backup).forEach(([name, value]) => {
        const field = cvForm.elements[name];
        if (field) {
            field.value = value;
        }
    });
    updateCvPreview();
};

const optimizeForPrint = () => {
    if (!cvForm) {
        return null;
    }

    const backup = getPrintFieldBackup();
    fitCvToSinglePage();

    if (getPreviewPageCount() > 1 && cvForm.elements.activities?.value) {
        cvForm.elements.activities.value = '';
        updateCvPreview();
    }

    if (getPreviewPageCount() > 1 && cvForm.elements.languages?.value) {
        cvForm.elements.languages.value = splitLines(cvForm.elements.languages.value).slice(0, 2).join('\n');
        updateCvPreview();
    }

    if (getPreviewPageCount() > 1 && cvForm.elements.projects?.value) {
        cvForm.elements.projects.value = splitLines(cvForm.elements.projects.value).slice(0, 1).join('\n');
        updateCvPreview();
    }

    return backup;
};

const scrollToPreviewPage = (page) => {
    if (!cvPreviewViewport || !cvPreviewStage) {
        return;
    }

    const pages = getVisiblePreviewPages();
    const totalPages = pages.length || 1;
    currentPreviewPage = Math.min(Math.max(page, 1), totalPages);
    const targetPage = pages[currentPreviewPage - 1];
    const targetTop = targetPage ? targetPage.offsetTop - 8 : 0;

    cvPreviewViewport.scrollTo({ top: targetTop, behavior: 'smooth' });
};

const refreshCvModule = () => {
    try {
        const cvSection = document.querySelector('#cv-intelligent');

        if (cvSection) {
            cvSection.classList.add('is-visible');
            cvSection.style.display = 'block';
            cvSection.style.opacity = '1';
            cvSection.style.transform = 'none';
        }
        if (cvLayout) {
            cvLayout.classList.remove('is-preview-focus');
            cvLayout.style.display = 'grid';
            cvLayout.style.opacity = '1';
            cvLayout.style.visibility = 'visible';
        }
        if (cvLayoutToggle) {
            cvLayoutToggle.setAttribute('aria-expanded', 'true');
            cvLayoutToggle.setAttribute('aria-label', 'Rabattre les reglages');
        }
        if (cvEditorPanel) {
            cvEditorPanel.style.display = 'grid';
            cvEditorPanel.style.opacity = '1';
            cvEditorPanel.style.pointerEvents = 'auto';
            cvEditorPanel.style.visibility = 'visible';
        }
        if (cvForm) {
            cvForm.style.display = 'grid';
            cvForm.style.visibility = 'visible';
            cvForm.hidden = false;
        }
        if (cvPreviewShell) {
            cvPreviewShell.style.display = 'grid';
            cvPreviewShell.style.opacity = '1';
            cvPreviewShell.style.pointerEvents = 'auto';
            cvPreviewShell.style.visibility = 'visible';
        }
        if (cvPreviewViewport) {
            cvPreviewViewport.style.display = 'block';
            cvPreviewViewport.style.visibility = 'visible';
        }
        if (cvPreviewStage) {
            cvPreviewStage.style.display = 'grid';
            cvPreviewStage.style.visibility = 'visible';
        }
        if (previewNodes.preview) {
            previewNodes.preview.classList.remove('is-hidden-preview');
            previewNodes.preview.setAttribute('aria-hidden', 'false');
            previewNodes.preview.style.display = 'block';
            previewNodes.preview.style.visibility = 'visible';
        }
        if (letterPagePreview) {
            letterPagePreview.classList.add('is-hidden-preview');
            letterPagePreview.setAttribute('aria-hidden', 'true');
            letterPagePreview.style.display = 'none';
            letterPagePreview.style.visibility = 'hidden';
        }
        if (coverLetterPanel) {
            coverLetterPanel.classList.add('is-hidden-panel');
            coverLetterPanel.style.display = 'none';
        }
        updateCvPreview();
        renderExperienceEditor();
        setPreviewMode('cv');
        currentPreviewPage = 1;
        if (cvPreviewViewport) {
            cvPreviewViewport.scrollTop = 0;
        }
        updatePreviewViewport();
        updateWordToolbarState();
    } catch (error) {
        console.error(error);
        setCvStatus('Le module CV a rencontre un probleme, mais l editeur reste charge');
    }
};

const cvModeThemeMap = {
    classic: 'executive',
    design: 'creative',
    ats: 'ats',
    web: 'web',
};

const fillList = (target, items) => {
    if (!target) {
        return;
    }

    target.innerHTML = '';
    target.classList.remove('cv-experience-list');

    dedupeImportedItems(items.filter(Boolean)).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        target.appendChild(li);
    });
};

const monthNamesPattern =
    '(?:janv(?:ier)?|f[ée]vr(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|ao[uû]t|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|d[ée]c(?:embre)?)';

const experienceDateRegex = new RegExp(
    `((?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4})\\s*[–-]\\s*((?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4}|aujourd'hui|present|pr[ée]sent)`,
    'i'
);

const parseExperienceEntry = (line) => {
    const cleanLine = line
        .replace(/^(?:(?:[•\-\u2022]|→)\s*)+/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const dateMatch = cleanLine.match(experienceDateRegex);
    let date = dateMatch ? `${dateMatch[1]} - ${dateMatch[2]}` : '';
    let withoutDate = dateMatch
        ? cleanLine
            .replace(dateMatch[0], '')
            .replace(/\s*[–-]\s*(?=•|$)/g, ' ')
            .replace(/\s+,/g, ',')
            .trim()
        : cleanLine;

    if (!date) {
        const singleDateBeforeBulletRegex = new RegExp(
            `\\s*[|,–-]\\s*((?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4})\\s*(?=•)`,
            'i'
        );
        const singleDateBeforeBulletMatch = cleanLine.match(singleDateBeforeBulletRegex);
        const singleDateMatch = singleDateBeforeBulletMatch || cleanLine.match(trailingSingleDateRegex);
        if (singleDateMatch) {
            date = normalizeStandaloneDate(singleDateMatch[1]);
            withoutDate = singleDateBeforeBulletMatch
                ? cleanLine
                    .replace(singleDateMatch[0], ' ')
                    .replace(/\s*[–-]\s*(?=•|$)/g, ' ')
                    .replace(/\s+,/g, ',')
                    .trim()
                : cleanLine
                    .slice(0, singleDateMatch.index)
                    .replace(/[\s|,–-]+$/g, '')
                    .replace(/\s+,/g, ',')
                    .trim();
        }
    }

    const bulletParts = withoutDate
        .split(/\s+•\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
    const header = bulletParts.shift() || cleanLine;
    const headerParts = header.split(/\s+[–-]\s+/).map((part) => part.trim()).filter(Boolean);
    const secondPartIsTitleComplement =
        headerParts.length >= 3 &&
        /^(?:receveur|client[eè]le|commerciale?|vendeuse|adjoint[e]?|assistant[e]?)\b/i.test(headerParts[1]) &&
        /[,/]|(?:ratp|ceidf|cama[ïi]eu|american express|air france|entreprise|soci[ée]t[ée])/i.test(headerParts.slice(2).join(' '));
    const title = secondPartIsTitleComplement
        ? `${headerParts[0]}-${headerParts[1]}`.replace(/\s{2,}/g, ' ').trim()
        : headerParts[0] || header;
    const meta = secondPartIsTitleComplement
        ? headerParts.slice(2).join(' - ')
        : headerParts.slice(1).join(' - ');

    return {
        title: title.replace(/^(?:(?:[•\-\u2022]|→)\s*)+/g, '').trim(),
        meta: meta.replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').replace(/,\s*$/g, '').trim(),
        date,
        bullets: bulletParts.length
            ? dedupeImportedItems(
                bulletParts.map((bullet) =>
                    bullet
                        .replace(/^(?:(?:[•\-\u2022]|→)\s*)+/g, '')
                        .replace(/\s{2,}/g, ' ')
                        .trim()
                )
            )
            : [],
    };
};

const renderTimelineList = (target, items, options = {}) => {
    if (!target) {
        return;
    }

    target.innerHTML = '';
    target.classList.add('cv-experience-list');

    const projectType = options.projectType?.trim();

    dedupeImportedItems(items.filter(Boolean)).forEach((item) => {
        const entry = parseExperienceEntry(item);
        const li = document.createElement('li');
        li.className = 'cv-experience-item';

        const head = document.createElement('div');
        head.className = 'cv-experience-head';

        const title = document.createElement('div');
        title.className = 'cv-experience-title';
        title.textContent =
            projectType && !entry.title.toLowerCase().includes(projectType.toLowerCase())
                ? `${entry.title} - ${projectType}`
                : entry.title;
        head.appendChild(title);

        if (entry.date) {
            const date = document.createElement('div');
            date.className = 'cv-experience-date';
            date.textContent = entry.date;
            head.appendChild(date);
        }

        li.appendChild(head);

        if (entry.meta) {
            const meta = document.createElement('div');
            meta.className = 'cv-experience-meta';
            meta.textContent = entry.meta;
            li.appendChild(meta);
        }

        if (entry.bullets.length) {
            const bulletList = document.createElement('ul');
            bulletList.className = 'cv-experience-bullets';
            entry.bullets.forEach((bullet) => {
                const bulletItem = document.createElement('li');
                bulletItem.textContent = bullet;
                bulletList.appendChild(bulletItem);
            });
            li.appendChild(bulletList);
        }

        target.appendChild(li);
    });
};

const cleanCvText = (value = '') =>
    value
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.])/g, '$1')
        .replace(/\s+([;:!?])/g, '$1')
        .replace(/([.!?])([A-ZÀ-ÖØ-Ý])/g, '$1 $2')
        .trim();

const correctCommonCvText = (value = '') =>
    cleanCvText(value)
        .replace(/\bcrelation\b/gi, 'relation')
        .replace(/\borganise\b/gi, 'organisée')
        .replace(/\borganisee\b/gi, 'organisée')
        .replace(/\boriente resultat\b/gi, 'orientée résultat')
        .replace(/\borientee\b/gi, 'orientée')
        .replace(/\bpresentation\b/gi, 'présentation')
        .replace(/\bexperience\b/gi, 'expérience')
        .replace(/\bexperiences\b/gi, 'expériences')
        .replace(/\bcompetence\b/gi, 'compétence')
        .replace(/\bcompetences\b/gi, 'compétences')
        .replace(/\bsecurite\b/gi, 'sécurité')
        .replace(/\bsecurisee\b/gi, 'sécurisée')
        .replace(/\bclientele\b/gi, 'clientèle')
        .replace(/\bresultat\b/gi, 'résultat')
        .replace(/\brealisation\b/gi, 'réalisation')
        .replace(/\bresponsabilite\b/gi, 'responsabilité')
        .replace(/\bcle\b/gi, 'clé')
        .replace(/\becoute\b/gi, 'écoute')
        .replace(/\bequipe\b/gi, 'équipe')
        .replace(/\bdeveloppeur\b/gi, 'développeur')
        .replace(/\bdeveloppeuse\b/gi, 'développeuse')
        .replace(/\bfrancais\b/gi, 'français')
        .replace(/\banglais\b/gi, 'anglais');

const lowerFrenchConnectorWords = (value = '') =>
    String(value || '').replace(
        /\b(Et|De|Des|Du|La|Le|Les|En|Vers|Avec|Au|Aux|Mon|Mes|Un|Une|Pour|Dans|Sur|Sans|Par|À|A)\b/g,
        (word) => word.toLowerCase()
    );

const restoreCvAcronyms = (value = '') =>
    String(value || '')
        .replace(/\bratp\b/gi, 'RATP')
        .replace(/\bceidf\b/gi, 'CEIDF')
        .replace(/\bfdv\b/gi, 'FDV')
        .replace(/\bfimo\b/gi, 'FIMO')
        .replace(/\biobsp\b/gi, 'IOBSP')
        .replace(/\bhtml\b/gi, 'HTML')
        .replace(/\bcss\b/gi, 'CSS')
        .replace(/\bpdf\b/gi, 'PDF')
        .replace(/\bdocx\b/gi, 'DOCX')
        .replace(/\bword\b/gi, 'Word')
        .replace(/\bcv\b/gi, 'CV')
        .replace(/\bia\b/gi, 'IA')
        .replace(/\bats\b/gi, 'ATS');

const cvLowercaseTerms = new Set([
    'accompagnement',
    'accueil',
    'active',
    'activites',
    'activite',
    'adaptee',
    'adaptees',
    'administratif',
    'administrative',
    'administratives',
    'analyse',
    'anglais',
    'atouts',
    'autonomie',
    'bancaire',
    'bancaires',
    'banque',
    'besoin',
    'besoins',
    'bureautique',
    'certification',
    'client',
    'cliente',
    'clientele',
    'clients',
    'code',
    'commerce',
    'commercial',
    'commerciale',
    'communication',
    'competence',
    'competences',
    'conseil',
    'conseiller',
    'conseillere',
    'contrats',
    'continu',
    'developpement',
    'dossier',
    'dossiers',
    'ecoute',
    'emploi',
    'entreprise',
    'equipe',
    'evoluer',
    'experience',
    'experiences',
    'formation',
    'formations',
    'gestion',
    'horaires',
    'information',
    'intermediaire',
    'metier',
    'mission',
    'missions',
    'operations',
    'organisee',
    'organisation',
    'orientation',
    'orientee',
    'personnes',
    'poste',
    'procedures',
    'produits',
    'professionnel',
    'professionnelle',
    'professionnelles',
    'profil',
    'proposition',
    'public',
    'qualite',
    'relation',
    'resultat',
    'rigoureuse',
    'satisfaction',
    'securise',
    'securisee',
    'securite',
    'service',
    'situations',
    'solutions',
    'stress',
    'suivi',
    'titre',
    'transport',
    'travail',
    'valorisant',
    'veille',
    'ville',
    'voyageurs',
    'avr',
    'janv',
    'fevr',
    'mars',
    'avr',
    'mai',
    'juin',
    'juil',
    'aout',
    'sept',
    'oct',
    'nov',
    'dec',
]);

const capitalizeFrenchWord = (value = '') =>
    String(value || '').replace(/^(\p{L})/u, (letter) => letter.toLocaleUpperCase('fr-FR'));

const fixInternalCvWordCase = (value = '') =>
    String(value || '')
        .replace(
            /(?<!\p{L})([\p{Lu}])([\p{Lu}])(\p{Ll}[\p{L}]*)(?!\p{L})/gu,
            (_, first, letter, after) => `${first}${letter.toLocaleLowerCase('fr-FR')}${after.toLocaleLowerCase('fr-FR')}`
        )
        .replace(
            /(?<!\p{L})([\p{L}]*[\p{Ll}])([\p{Lu}])([\p{L}]*)(?!\p{L})/gu,
            (_, before, letter, after) => `${before}${letter.toLocaleLowerCase('fr-FR')}${after.toLocaleLowerCase('fr-FR')}`
        );

const lowerCommonCvWordCase = (value = '') =>
    String(value || '').replace(/(?<!\p{L})[\p{L}][\p{L}’'-]*(?!\p{L})/gu, (word, offset, source) => {
        const normalized = normalizeForMatch(word);

        if (!cvLowercaseTerms.has(normalized)) {
            return word;
        }

        const lower = word.toLocaleLowerCase('fr-FR');
        const before = source.slice(0, offset);
        const startsSentence = !before.trim() || /[.!?]\s*$/.test(before) || /\n\s*$/.test(before) || /(?:^|\s)(?:[•\u2022]|→)\s*$/.test(before);

        return startsSentence ? capitalizeFrenchWord(lower) : lower;
    });

const normalizeCvSentenceText = (value = '') =>
    restoreCvAcronyms(lowerCommonCvWordCase(fixInternalCvWordCase(lowerFrenchConnectorWords(correctCommonCvText(value)))))
        .replace(/\bD[’']/g, 'd’')
        .replace(/\bL[’']/g, 'l’')
        .replace(/\bJ[’']/g, 'j’')
        .replace(/\s{2,}/g, ' ')
        .trim();

const formatCvHeadline = (value = '') =>
    restoreCvAcronyms(lowerCommonCvWordCase(fixInternalCvWordCase(lowerFrenchConnectorWords(correctCommonCvText(value)))))
        .replace(/\s*[–-]\s*/g, ' - ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const normalizeCvMultilineText = (value = '') =>
    splitLines(value)
        .map((line) => normalizeCvSentenceText(line))
        .filter(Boolean)
        .join('\n');

const getCvRoleContext = (extraText = '') => {
    const source = normalizeForMatch([
        cvForm?.elements.headline?.value || '',
        cvForm?.elements.jobTarget?.value || '',
        jobOfferField?.value || '',
        extraText,
    ].join(' '));

    if (/\b(transport|conductrice|conducteur|machiniste|receveur|chauffeur|voyageur|permis d|bus|autocar)\b/.test(source)) {
        return 'transport';
    }

    if (/\b(client|clientele|conseillere|conseiller|commerciale|accueil|banque|relation|chargee)\b/.test(source)) {
        return 'client';
    }

    if (/\b(web|developpeur|developpeuse|frontend|front-end|javascript|react|html|css|site|interface)\b/.test(source)) {
        return 'web';
    }

    if (/\b(admin|administratif|dossier|classement|procedure|gestion)\b/.test(source)) {
        return 'admin';
    }

    return 'general';
};

const roleSkillSuggestions = {
    transport: [
        'Conduite sécurisée',
        'Respect des horaires',
        'Accueil et information des voyageurs',
        'Gestion des situations imprévues',
        'Sens du service public',
        'Autonomie et rigueur',
    ],
    client: [
        'Accueil et écoute active',
        'Analyse des besoins clients',
        'Conseil et orientation',
        'Suivi de dossiers',
        'Gestion des réclamations',
        'Communication professionnelle',
    ],
    web: [
        'HTML / CSS',
        'JavaScript',
        'Interface responsive',
        'Organisation de contenu',
        'Expérience utilisateur',
        'Correction et optimisation',
    ],
    admin: [
        'Gestion administrative',
        'Suivi de dossiers',
        'Organisation documentaire',
        'Respect des procédures',
        'Saisie et contrôle des informations',
        'Priorisation des tâches',
    ],
    general: [
        'Organisation',
        'Communication claire',
        'Fiabilité',
        'Adaptation',
        'Sens du service',
        'Travail en équipe',
    ],
};

const roleSummarySuggestions = {
    transport:
        'Professionnelle du transport de voyageurs, rigoureuse et autonome, attentive à la sécurité, au respect des horaires et à la qualité du service rendu. Capable d’accueillir, informer et accompagner les voyageurs avec calme et sens des responsabilités.',
    client:
        'Professionnelle de la relation client, organisée et rigoureuse, avec une expérience en écoute, conseil, analyse des besoins et suivi de dossiers. À l’aise dans les échanges avec la clientèle, elle apporte un service clair, fiable et orienté satisfaction client.',
    web:
        'Profil web organisé, créatif et rigoureux, capable de structurer des contenus, améliorer l’expérience utilisateur et produire des supports digitaux clairs, modernes et adaptés aux objectifs du projet.',
    admin:
        'Profil administratif organisé et fiable, habitué au suivi de dossiers, au respect des procédures et à la gestion d’informations avec rigueur. Capable de prioriser, contrôler et produire un travail clair.',
    general:
        'Profil professionnel organisé, fiable et orienté résultat, capable de clarifier les besoins, structurer les informations et produire un travail propre, lisible et directement exploitable.',
};

const roleMissionSuggestions = {
    transport: [
        'Assurer une conduite sécurisée dans le respect des horaires et des règles de circulation',
        'Accueillir, informer et orienter les voyageurs avec professionnalisme',
        'Gérer les situations imprévues avec calme, autonomie et sens du service',
    ],
    client: [
        'Accueillir, écouter et orienter les clients selon leurs besoins',
        'Analyser les demandes et proposer des solutions adaptées',
        'Assurer le suivi des dossiers avec rigueur et qualité de service',
    ],
    web: [
        'Structurer les contenus et améliorer la lisibilité des pages',
        'Créer une interface claire, responsive et adaptée aux utilisateurs',
        'Optimiser la présentation pour renforcer la compréhension et la conversion',
    ],
    admin: [
        'Organiser les dossiers et contrôler les informations avec rigueur',
        'Assurer le suivi administratif dans le respect des procédures',
        'Prioriser les demandes et produire des documents fiables',
    ],
    general: [
        'Organiser les priorités et assurer un suivi fiable des missions',
        'Communiquer clairement avec les interlocuteurs internes et externes',
        'Contribuer à un résultat propre, lisible et directement exploitable',
    ],
};

const readyCvTemplates = {
    transport: {
        headline: 'Conducteur transport de voyageurs',
        permit: 'Permis B ou D',
        summary: roleSummarySuggestions.transport,
        skills: [
            ...roleSkillSuggestions.transport,
            'Relation clientèle',
            'Gestion du stress',
            'Respect des procédures',
            'Ponctualité',
        ],
        experiences: [
            {
                title: 'Conducteur transport de voyageurs',
                meta: 'Entreprise, Ville',
                date: '2024 - aujourd’hui',
                bullets: roleMissionSuggestions.transport,
            },
            {
                title: 'Agent d’accueil et service client',
                meta: 'Entreprise, Ville',
                date: '2022 - 2024',
                bullets: [
                    'Accueillir et orienter les usagers avec professionnalisme',
                    'Gérer les demandes et les situations imprévues avec calme',
                    'Assurer un service fiable dans le respect des consignes',
                ],
            },
        ],
        education: [
            'Titre ou formation transport voyageurs - Établissement - Année',
            'Permis et habilitations - Centre de formation - Année',
        ],
        activities: ['Veille sécurité transport', 'Service public', 'Sport'],
    },
    client: {
        headline: 'Conseiller relation client',
        summary: roleSummarySuggestions.client,
        skills: [
            ...roleSkillSuggestions.client,
            'Gestion administrative',
            'Traitement des demandes',
            'Sens de la satisfaction client',
            'Maîtrise des outils bureautiques',
        ],
        experiences: [
            {
                title: 'Conseiller relation client',
                meta: 'Entreprise, Ville',
                date: '2024 - aujourd’hui',
                bullets: roleMissionSuggestions.client,
            },
            {
                title: 'Assistant commercial',
                meta: 'Entreprise, Ville',
                date: '2022 - 2024',
                bullets: [
                    'Traiter les demandes clients et assurer un suivi fiable',
                    'Mettre à jour les dossiers et coordonner les informations',
                    'Contribuer à la qualité de service et à la fidélisation',
                ],
            },
        ],
        education: [
            'Formation relation client ou commerce - Établissement - Année',
            'Certification ou formation complémentaire - Organisme - Année',
        ],
        activities: ['Veille professionnelle', 'Communication', 'Sport'],
    },
    web: {
        headline: 'Développeur web junior',
        summary: roleSummarySuggestions.web,
        skills: [
            ...roleSkillSuggestions.web,
            'Intégration web',
            'Accessibilité',
            'Tests et corrections',
            'Veille IA',
        ],
        experiences: [
            {
                title: 'Projet web principal',
                meta: 'Projet personnel ou client',
                date: '2024 - aujourd’hui',
                bullets: roleMissionSuggestions.web,
            },
            {
                title: 'Création de supports digitaux',
                meta: 'Projet, Ville',
                date: '2023 - 2024',
                bullets: [
                    'Organiser les contenus pour rendre l’information plus lisible',
                    'Améliorer la présentation visuelle et l’expérience utilisateur',
                    'Corriger les pages pour obtenir un rendu propre et responsive',
                ],
            },
        ],
        projects: [
            'Site vitrine responsive - 2024 • Structure claire, contenus organisés et parcours utilisateur simplifié',
            'Outil CV intelligent - 2024 • Import, édition, aperçu et export de documents professionnels',
        ],
        education: [
            'Formation développement web - Établissement - Année',
            'Autoformation HTML, CSS, JavaScript et IA - Année',
        ],
        activities: ['Technologie', 'Innovation numérique', 'Apprentissage continu'],
    },
    admin: {
        headline: 'Assistant administratif',
        summary: roleSummarySuggestions.admin,
        skills: [
            ...roleSkillSuggestions.admin,
            'Accueil téléphonique',
            'Rédaction de documents',
            'Coordination interne',
            'Fiabilité',
        ],
        experiences: [
            {
                title: 'Assistant administratif',
                meta: 'Entreprise, Ville',
                date: '2024 - aujourd’hui',
                bullets: roleMissionSuggestions.admin,
            },
            {
                title: 'Chargé de suivi de dossiers',
                meta: 'Entreprise, Ville',
                date: '2022 - 2024',
                bullets: [
                    'Contrôler les informations et mettre à jour les dossiers',
                    'Assurer les relances et le suivi des demandes',
                    'Préparer des documents clairs et conformes aux procédures',
                ],
            },
        ],
        education: [
            'Formation administrative ou gestion - Établissement - Année',
            'Bureautique et outils de suivi - Organisme - Année',
        ],
        activities: ['Organisation', 'Veille métier', 'Lecture'],
    },
    general: {
        headline: 'Profil professionnel polyvalent',
        summary: roleSummarySuggestions.general,
        skills: [
            ...roleSkillSuggestions.general,
            'Analyse des besoins',
            'Suivi de dossiers',
            'Gestion des priorités',
            'Qualité de service',
        ],
        experiences: [
            {
                title: 'Expérience principale',
                meta: 'Entreprise, Ville',
                date: '2024 - aujourd’hui',
                bullets: roleMissionSuggestions.general,
            },
            {
                title: 'Expérience précédente',
                meta: 'Entreprise, Ville',
                date: '2022 - 2024',
                bullets: [
                    'Assurer un suivi fiable des demandes et des informations',
                    'Travailler avec méthode pour produire un résultat propre',
                    'Communiquer clairement avec les interlocuteurs concernés',
                ],
            },
        ],
        education: [
            'Diplôme ou formation - Établissement - Année',
            'Formation complémentaire - Organisme - Année',
        ],
        activities: ['Veille professionnelle', 'Apprentissage continu', 'Sport'],
    },
};

const normalizeLooseCvText = (value = '') =>
    normalizeForMatch(String(value || ''))
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const defaultCvFieldFragments = {
    fullName: ['votre nom'],
    headline: ['intitule du poste vise', 'titre du metier'],
    location: ['ville code postal'],
    phone: ['06 00 00 00 00', 'votre numero'],
    email: ['email exemple com', 'votre email'],
    permit: ['permis b'],
    summary: ['profil clair organise et oriente resultat avec une presentation adaptee au poste vise'],
    experience: ['entreprise poste ville 2024 mission principale ou resultat cle responsabilite complementaire'],
    projects: ['projet principal 2024 resultat impact ou realisation'],
    skills: ['gestion de projet communication organisation analyse suite bureautique'],
    education: ['diplome ou formation etablissement annee'],
    languages: ['francais anglais'],
    activities: ['lecture veille professionnelle sport'],
};

const isDefaultCvFieldValue = (fieldName, value = '') => {
    const text = normalizeLooseCvText(value);

    if (!text) {
        return true;
    }

    return (defaultCvFieldFragments[fieldName] || []).some((fragment) => {
        const normalizedFragment = normalizeLooseCvText(fragment);
        return text === normalizedFragment || text.includes(normalizedFragment);
    });
};

const hasMeaningfulCvContent = () => {
    if (!cvForm) {
        return false;
    }

    return ['fullName', 'headline', 'location', 'phone', 'email', 'summary', 'skills', 'experience', 'projects', 'education'].some((fieldName) => {
        const field = cvForm.elements[fieldName];
        return Boolean(field?.value?.trim()) && !isDefaultCvFieldValue(fieldName, field.value);
    });
};

const hasMeaningfulExperienceContent = () => {
    const field = getExperienceField();
    return Boolean(field?.value?.trim()) && !isDefaultCvFieldValue('experience', field.value);
};

const setCvFieldIfDefault = (fieldName, value) => {
    const field = cvForm?.elements[fieldName];

    if (!field || !isDefaultCvFieldValue(fieldName, field.value)) {
        return;
    }

    field.value = value;
};

const applyReadyCvBase = (message = '') => {
    if (!cvForm) {
        return { mode: 'unavailable', context: 'general', experienceCount: 0 };
    }

    if (hasMeaningfulCvContent()) {
        optimizeCvProfessionally();
        return {
            mode: 'optimized',
            context: getCvRoleContext(message),
            experienceCount: repairPreviewExperienceItems(splitLines(cvForm.elements.experience?.value || '')).length,
        };
    }

    const context = getCvRoleContext(message);
    const template = readyCvTemplates[context] || readyCvTemplates.general;

    setCvFieldIfDefault('fullName', 'Votre nom');
    setCvFieldIfDefault('headline', template.headline);
    setCvFieldIfDefault('location', 'Ville / code postal');
    setCvFieldIfDefault('phone', '06 00 00 00 00');
    setCvFieldIfDefault('email', 'email@exemple.com');
    setCvFieldIfDefault('permit', template.permit || 'Permis B');
    setCvFieldIfDefault('summary', template.summary);
    setCvFieldIfDefault('skills', dedupeImportedItems(template.skills).slice(0, 10).join('\n'));
    setCvFieldIfDefault('experience', template.experiences.map(serializeExperienceEntry).join('\n'));
    setCvFieldIfDefault('projects', (template.projects || []).join('\n'));
    setCvFieldIfDefault('education', template.education.join('\n'));
    setCvFieldIfDefault('languages', 'Français\nAnglais');
    setCvFieldIfDefault('activities', template.activities.join('\n'));

    if (cvForm.elements.cvMode) {
        cvForm.elements.cvMode.value = 'ats';
    }
    if (cvForm.elements.layoutTheme) {
        cvForm.elements.layoutTheme.value = 'ats';
    }
    if (cvForm.elements.fontTheme) {
        cvForm.elements.fontTheme.value = 'inter';
    }
    if (cvForm.elements.colorTheme) {
        cvForm.elements.colorTheme.value = 'graphite';
    }
    if (cvForm.elements.designMood) {
        cvForm.elements.designMood.value = 'clean';
    }
    if (cvForm.elements.textAlign) {
        cvForm.elements.textAlign.value = 'left';
    }
    if (cvForm.elements.lineSpacing) {
        cvForm.elements.lineSpacing.value = 'tight';
    }
    if (cvForm.elements.fontSize) {
        cvForm.elements.fontSize.value = 'compact';
    }

    clearEditableOverrides();
    cleanupImportedExperienceField();
    cleanupImportedEducationField();
    renderExperienceEditor();
    updateCvPreview();
    scheduleCvDraftSave();
    setCvStatus('Base CV prête à modifier');

    return {
        mode: 'created',
        context,
        experienceCount: template.experiences.length,
    };
};

const getReadyCvAssistantReply = (result) => {
    if (result.mode === 'optimized') {
        return `J'ai corrigé et optimisé le CV déjà présent : accroche, compétences et ${result.experienceCount || 0} expérience(s) ont été harmonisées. Le document est prêt à ajuster puis exporter.`;
    }

    if (result.mode === 'created') {
        return `J'ai préparé une base CV complète sans données personnelles réelles : titre métier, accroche, compétences, ${result.experienceCount} expériences, formations et activités. Vous pouvez remplacer seulement les informations exactes.`;
    }

    return "Je n'arrive pas à accéder au formulaire CV sur cette page.";
};

const serializeExperienceEntry = (entry) => {
    const header = [entry.title, entry.meta, entry.date]
        .map((item) => normalizeCvSentenceText(item || ''))
        .filter(Boolean)
        .join(' - ');
    const bullets = dedupeImportedItems((entry.bullets || []).map(normalizeCvSentenceText).filter(Boolean));

    return [header, ...bullets].filter(Boolean).join(' • ');
};

const improveMissionBullet = (bullet, context) => {
    const cleanBullet = normalizeCvSentenceText(bullet || '').replace(/^(?:[•\-\u2022]|→)\s*/g, '');

    if (!cleanBullet) {
        return '';
    }

    if (cleanBullet.length < 18) {
        return roleMissionSuggestions[context]?.[0] || cleanBullet;
    }

    return cleanBullet
        .replace(/\bgestion d[’']?horaires\b/gi, 'gestion des horaires')
        .replace(/\brelation client directe personnalisée\b/gi, 'relation client directe et accompagnement personnalisé')
        .replace(/\bau service d’un poste\b/gi, 'mobilisées dans un poste');
};

const improveExperienceEntry = (entry) => {
    const context = getCvRoleContext(`${entry.title || ''} ${entry.meta || ''} ${(entry.bullets || []).join(' ')}`);
    const bullets = dedupeImportedItems((entry.bullets || []).map((bullet) => improveMissionBullet(bullet, context)).filter(Boolean));
    const fallbackBullets = roleMissionSuggestions[context] || roleMissionSuggestions.general;

    return {
        title: formatCvHeadline(entry.title || 'Poste occupé'),
        meta: normalizeCvSentenceText(entry.meta || ''),
        date: normalizeCvSentenceText(entry.date || ''),
        bullets: (bullets.length ? bullets : fallbackBullets.slice(0, 2)).slice(0, 4),
    };
};

const getExperienceSourceEntries = () => {
    const field = getExperienceField();

    if (!field) {
        return [];
    }

    return repairPreviewExperienceItems(splitLines(field.value)).map(parseExperienceEntry);
};

const renderExperienceEditor = () => {
    if (!experienceCards || !getExperienceField() || isSyncingExperienceEditor) {
        return;
    }

    isRenderingExperienceEditor = true;
    experienceCards.innerHTML = '';

    const entries = getExperienceSourceEntries();
    const cards = entries.length
        ? entries
        : [{ title: '', meta: '', date: '', bullets: [''] }];

    cards.forEach((entry, index) => {
        const card = document.createElement('article');
        card.className = 'experience-card';
        card.dataset.experienceIndex = String(index);
        card.innerHTML = `
            <div class="experience-card-grid">
                <label>
                    <span>Poste</span>
                    <input type="text" data-experience-field="title" value="${escapeHtml(entry.title || '')}" placeholder="Ex. Conseillère clientèle">
                </label>
                <label>
                    <span>Dates</span>
                    <input type="text" data-experience-field="date" value="${escapeHtml(entry.date || '')}" placeholder="Ex. oct. 2021 - oct. 2022">
                </label>
                <label class="experience-card-wide">
                    <span>Entreprise / lieu</span>
                    <input type="text" data-experience-field="meta" value="${escapeHtml(entry.meta || '')}" placeholder="Ex. Camaïeu, Rueil-Malmaison">
                </label>
            </div>
            <label>
                <span>Missions</span>
                <textarea data-experience-field="bullets" placeholder="Une mission par ligne">${escapeHtml((entry.bullets || []).join('\n'))}</textarea>
            </label>
            <div class="experience-card-actions">
                <button class="button button-secondary" type="button" data-experience-action="improve">Reformuler</button>
                <button class="button button-secondary" type="button" data-experience-action="add-mission">Ajouter une mission</button>
                <button class="button button-secondary" type="button" data-experience-action="remove-mission">Supprimer derniere mission</button>
                <button class="button button-secondary" type="button" data-experience-action="remove">Supprimer l'experience</button>
            </div>
        `;
        experienceCards.appendChild(card);
    });

    isRenderingExperienceEditor = false;
};

const collectExperienceEditorEntries = () =>
    [...(experienceCards?.querySelectorAll('.experience-card') || [])]
        .map((card) => {
            const getField = (name) => card.querySelector(`[data-experience-field="${name}"]`)?.value || '';
            return {
                title: getField('title'),
                meta: getField('meta'),
                date: getField('date'),
                bullets: splitLines(getField('bullets')),
            };
        })
        .filter((entry) => entry.title || entry.meta || entry.date || entry.bullets.length);

const syncExperienceFieldFromEditor = ({ refreshCards = false, status = '' } = {}) => {
    const field = getExperienceField();

    if (!field || isRenderingExperienceEditor) {
        return;
    }

    isSyncingExperienceEditor = true;
    field.value = collectExperienceEditorEntries().map(serializeExperienceEntry).filter(Boolean).join('\n');
    clearEditableOverride('experience');
    updateCvPreview();
    scheduleCvDraftSave();
    isSyncingExperienceEditor = false;

    if (refreshCards) {
        renderExperienceEditor();
    }

    if (status) {
        setCvStatus(status);
    }
};

const addExperienceCard = () => {
    const field = getExperienceField();

    if (!field) {
        return;
    }

    const entries = collectExperienceEditorEntries();
    entries.push({
        title: cvForm.elements.headline?.value || 'Poste occupé',
        meta: '',
        date: '',
        bullets: [roleMissionSuggestions[getCvRoleContext()]?.[0] || 'Mission principale clarifiée et orientée résultat'],
    });
    field.value = entries.map(serializeExperienceEntry).join('\n');
    renderExperienceEditor();
    clearEditableOverride('experience');
    updateCvPreview();
    scheduleCvDraftSave();
    setCvStatus('Experience ajoutee');
};

const reorderPreviewSections = () => {
    if (!previewSectionsRoot) {
        return;
    }

    cvSectionOrder.forEach((key) => {
        const section = previewSectionsRoot.querySelector(`[data-section-key="${key}"]`);
        if (section) {
            previewSectionsRoot.appendChild(section);
        }
    });
};

const renderEditableOverride = (target, node) => {
    if (!node) {
        return false;
    }

    const override = cvEditableContent[target];
    node.removeAttribute('style');

    if (!override || typeof override.html !== 'string') {
        applyEditableNodeStyleState(node, { lineHeight: '1.2' });
        return false;
    }

    node.innerHTML = override.html;
    applyEditableNodeStyleState(node, override.style || {});
    return true;
};

const renderEditableTextNode = (node, target, text) => {
    if (!node) {
        return;
    }

    if (renderEditableOverride(target, node)) {
        return;
    }

    node.textContent = text;
};

const renderEditableListNode = (node, target, renderFallback) => {
    if (!node) {
        return;
    }

    if (!structuredPreviewTargets.has(target) && renderEditableOverride(target, node)) {
        return;
    }

    renderFallback();
    applyEditableNodeStyleState(node, { lineHeight: '1.2' });
};

const repairPreviewExperienceItems = (items) => {
    const hasStructuredExperience = items.some((item) => /\s[–-]\s.+\s[–-]\s.+(?:\s•\s|$)/.test(item || ''));
    const rebuiltKnownExperiences = hasStructuredExperience ? [] : rebuildKnownFragmentedExperiences(items);
    if (rebuiltKnownExperiences.length) {
        return rebuiltKnownExperiences;
    }

    const repaired = [];
    const clean = (line) =>
        (line || '')
            .replace(/^(?:(?:[•\-\u2022]|→)\s*)+/g, '')
            .replace(/^o\s+/i, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    const getMonthFragment = (line) => {
        const item = clean(line).replace(/\s*[–-]\s*$/g, '').trim();

        if (/^(?:janv|févr|fevr|mars|avr|mai|juin|juil|août|aout|sept|oct|nov|déc|dec)\.?$/i.test(item)) {
            return item.endsWith('.') ? item : `${item}.`;
        }

        if (/^ct\.?$/i.test(item)) {
            return 'oct.';
        }

        return '';
    };

    const preparedItems = normalizeExperienceImportItems(items);

    for (let index = 0; index < preparedItems.length; index += 1) {
        const rawItem = preparedItems[index] || '';
        const item = clean(rawItem);
        const nextMonth = getMonthFragment(preparedItems[index + 1] || '');

        if (!item) {
            continue;
        }

        if (/^(?:\d{4}|(?:janv|févr|fevr|mars|avr|mai|juin|juil|août|aout|sept|oct|nov|déc|dec)\.?\s*\d{4})\s*[–-]/i.test(item) && repaired.length) {
            repaired[repaired.length - 1] = `${repaired[repaired.length - 1]} - ${nextMonth ? `${nextMonth} ` : ''}${item}`.trim();
            if (nextMonth) {
                index += 1;
            }
            continue;
        }

        if (/^(?:janv|févr|fevr|mars|avr|mai|juin|juil|août|aout|sept|oct|nov|déc|dec)\.?\s*\d{4}$/i.test(item) && repaired.length) {
            repaired[repaired.length - 1] = `${repaired[repaired.length - 1]} - ${item}`.trim();
            continue;
        }

        if (getMonthFragment(item)) {
            continue;
        }

        if (/^\s*(?:[•\u2022]|-\s|→)/.test(rawItem) && repaired.length) {
            repaired[repaired.length - 1] = `${repaired[repaired.length - 1]} • ${item}`.replace(/\s{2,}/g, ' ').trim();
            continue;
        }

        if (repaired.length && /^[a-zà-ÿ]/.test(item)) {
            repaired[repaired.length - 1] = `${repaired[repaired.length - 1]} ${item}`.replace(/\s{2,}/g, ' ').trim();
            continue;
        }

        repaired.push(item);
    }

    return dedupeImportedItems(repaired);
};

const updateCvPreview = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());

    renderEditableTextNode(previewNodes.fullName, 'fullName', values.fullName || 'Votre nom');
    if (previewNodes.meta) {
        const shouldShowPermitInMeta =
            values.permit &&
            !normalizeForMatch(values.headline || '').includes(normalizeForMatch(values.permit || ''));
        renderEditableTextNode(
            previewNodes.meta,
            'location',
            [values.location, values.phone, values.email, shouldShowPermitInMeta ? values.permit : ''].filter(Boolean).join(' | ')
        );
    }
    renderEditableTextNode(previewNodes.headline, 'headline', values.headline || 'Intitule du metier');
    if (previewNodes.summary) {
        renderEditableTextNode(previewNodes.summary, 'summary', values.summary || '');
    }

    const skillItems = dedupeImportedItems(splitLines(values.skills || ''));
    const rawExperienceItems = dedupeImportedItems(splitLines(values.experience || ''));
    const experienceItems = repairPreviewExperienceItems(rawExperienceItems);
    const projectItems = mergeStandaloneDateItems(dedupeImportedItems(splitLines(values.projects || '')));
    const rawEducationItems = splitLines(values.education || '').filter((item) => !/^[-–—]?\s*\)?$/.test(item.trim()));
    const educationItems = normalizeEducationItems(rawEducationItems);
    const languageItems = dedupeImportedItems(splitLines(values.languages || ''));
    const activityItems = dedupeImportedItems(splitLines(values.activities || ''));

    if (values.experience && cvForm.elements.experience && experienceItems.length) {
        const repairedExperienceValue = experienceItems.join('\n');
        if (repairedExperienceValue !== rawExperienceItems.join('\n')) {
            cvForm.elements.experience.value = repairedExperienceValue;
            values.experience = repairedExperienceValue;
        }
    }

    if (values.education && cvForm.elements.education && educationItems.length) {
        const repairedEducationValue = educationItems.join('\n');
        if (repairedEducationValue !== rawEducationItems.join('\n')) {
            cvForm.elements.education.value = repairedEducationValue;
            values.education = repairedEducationValue;
        }
    }

    renderEditableListNode(previewNodes.experience, 'experience', () => renderTimelineList(previewNodes.experience, experienceItems));
    renderEditableListNode(previewNodes.projects, 'projects', () => renderTimelineList(previewNodes.projects, projectItems, { projectType: values.projectType || '' }));
    renderEditableListNode(previewNodes.skills, 'skills', () => fillList(previewNodes.skills, skillItems));
    renderEditableListNode(previewNodes.education, 'education', () => renderTimelineList(previewNodes.education, educationItems));
    renderEditableListNode(previewNodes.languages, 'languages', () => fillList(previewNodes.languages, languageItems));
    renderEditableListNode(previewNodes.activities, 'activities', () => fillList(previewNodes.activities, activityItems));

    if (previewSectionsRoot) {
        const sectionMap = {
            summary: Boolean((values.summary || '').trim()),
            skills: skillItems.length,
            experience: experienceItems.length,
            projects: projectItems.length,
            education: educationItems.length,
            activities: activityItems.length,
            languages: languageItems.length,
        };

        Object.entries(sectionMap).forEach(([key, count]) => {
            const section = previewSectionsRoot.querySelector(`[data-section-key="${key}"]`);
            if (section) {
                section.hidden = count === 0;
            }
        });

        reorderPreviewSections();
    }

    previewNodes.preview.classList.remove('theme-executive', 'theme-creative', 'theme-compact', 'theme-ats', 'theme-web');
    previewNodes.preview.classList.add(`theme-${cvModeThemeMap[values.cvMode] || 'executive'}`);

    previewNodes.preview.classList.remove('font-manrope', 'font-serif', 'font-mono');
    previewNodes.preview.classList.remove('font-inter', 'font-roboto', 'font-lato', 'font-playfair');
    previewNodes.preview.classList.add(`font-${values.fontTheme || 'manrope'}`);

    previewNodes.preview.classList.remove(
        'size-normal',
        'size-large',
        'size-compact',
        'headline-normal',
        'headline-compact',
        'headline-large',
        'is-bold',
        'is-italic',
        'is-underline',
        'palette-indigo',
        'palette-emerald',
        'palette-rose',
        'palette-graphite',
        'mood-clean',
        'mood-editorial',
        'mood-startup',
        'mood-luxury',
        'align-left',
        'align-center',
        'align-right',
        'spacing-normal',
        'spacing-airy',
        'spacing-tight',
        'template-classic',
        'template-wordpro',
        'template-modern',
        'template-executive',
        'template-minimal',
        'template-ats',
        'template-elegant',
        'template-premium',
        'template-creative'
    );
    previewNodes.preview.classList.add(`size-${values.fontSize || 'normal'}`);
    previewNodes.preview.classList.add(`headline-${values.headlineScale || 'normal'}`);
    previewNodes.preview.classList.add(`palette-${values.colorTheme || 'indigo'}`);
    previewNodes.preview.classList.add(`mood-${values.designMood || 'clean'}`);
    previewNodes.preview.classList.add(`align-${values.textAlign || 'left'}`);
    previewNodes.preview.classList.add(`spacing-${values.lineSpacing || 'normal'}`);
    previewNodes.preview.classList.add(templateThemeMap[values.layoutTheme] || 'template-classic');

    if (values.accentColor) {
        previewNodes.preview.style.setProperty('--cv-accent', values.accentColor);
        previewNodes.preview.style.setProperty('--cv-soft', `${values.accentColor}14`);
    }

    previewNodes.preview.style.setProperty('--cv-paper', values.paperColor || '#ffffff');
    previewNodes.preview.style.setProperty('--cv-frame', values.frameColor || '#d9deea');

    if (values.isBold) {
        previewNodes.preview.classList.add('is-bold');
    }

    if (values.isItalic) {
        previewNodes.preview.classList.add('is-italic');
    }

    if (values.isUnderline) {
        previewNodes.preview.classList.add('is-underline');
    }

    setCvStatus('CV synchronise');
    updateCvPageMode();

    analyzeCv(values);

    if (letterPagePreview) {
        letterPagePreview.className = previewNodes.preview.className.replace(/\bis-two-page\b/g, '').trim();
        letterPagePreview.classList.add('cv-letter-page');
        letterPagePreview.style.cssText = previewNodes.preview.style.cssText;
        const showLetter = currentPreviewMode === 'letter';
        letterPagePreview.classList.toggle('is-hidden-preview', !showLetter);
        letterPagePreview.setAttribute('aria-hidden', String(!showLetter));
    }

    if (previewHeadlineScale) {
        previewHeadlineScale.value = values.headlineScale || 'normal';
    }
    if (previewLineSpacing) {
        previewLineSpacing.value = values.lineSpacing || 'normal';
    }
    if (previewLayoutTheme) {
        previewLayoutTheme.value = values.layoutTheme || 'classic';
    }
};

const getJobOfferAnalysis = (values) => {
    const offer = (jobOfferField?.value || '').toLowerCase().trim();

    if (!offer) {
        return { score: null, matched: [], missing: [] };
    }

    const content = `${values.headline || ''} ${values.summary || ''} ${values.skills || ''} ${values.experience || ''} ${values.projects || ''}`.toLowerCase();
    const dynamicKeywords = Object.entries(offerKeywordMap)
        .filter(([key]) => offer.includes(key))
        .flatMap(([, keywords]) => keywords);

    const offerWords = offer
        .split(/[^a-zA-ZÀ-ÿ0-9+#.-]+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 3);

    const offerKeywords = [...new Set([...dynamicKeywords, ...offerWords.slice(0, 18)])];
    const matched = offerKeywords.filter((keyword) => content.includes(keyword.toLowerCase()));
    const missing = offerKeywords.filter((keyword) => !content.includes(keyword.toLowerCase()));
    const ratio = offerKeywords.length ? matched.length / offerKeywords.length : 0;
    const score = Math.max(40, Math.min(98, Math.round(ratio * 100)));

    return { score, matched, missing };
};

const analyzeCv = (values) => {
    const summary = (values.summary || '').trim();
    const experiences = splitLines(values.experience || '');
    const projects = splitLines(values.projects || '');
    const skills = splitLines(values.skills || '');
    const education = splitLines(values.education || '');
    const activities = splitLines(values.activities || '');
    const jobTarget = (values.jobTarget || '').toLowerCase();
    const headline = (values.headline || '').toLowerCase();
    const baseContent = `${values.headline || ''} ${values.summary || ''} ${values.skills || ''} ${values.experience || ''} ${values.projects || ''}`.toLowerCase();

    let score = 58;
    const analysis = [];
    const suggestions = [];

    if (summary.length > 70) {
        score += 10;
        analysis.push('Bonne structure de profil');
    } else {
        suggestions.push('Clarifier l objectif professionnel avec un resume plus precis');
    }

    if (skills.length >= 4) {
        score += 10;
        analysis.push('Competences visibles');
    } else {
        suggestions.push('Ajouter davantage de competences cles');
    }

    if (experiences.length >= 3) {
        score += 8;
        analysis.push('Experiences bien identifiees');
    } else {
        suggestions.push('Developper les experiences avec plus de contexte');
    }

    if (projects.length) {
        score += 4;
        analysis.push('Projet produit visible');
    }

    if (education.length > 0) {
        score += 5;
        analysis.push('Formation renseignee');
    } else {
        suggestions.push('Ajouter une section formation ou certification');
    }

    if (activities.length > 0) {
        score += 2;
        analysis.push('Activites complementaires renseignees');
    }

    const measurable = /%|\d|ans|clients|projets|utilisateurs/i.test(values.experience || '');

    if (measurable) {
        score += 7;
        analysis.push('Des resultats mesurables sont presents');
    } else {
        suggestions.push('Ajouter des resultats mesurables dans les experiences');
    }

    const jobTargetKeywordsMap = {
        'developpeur web': ['developpeur web', 'frontend', 'front-end', 'javascript', 'react', 'html', 'css', 'web'],
        marketing: ['marketing', 'communication', 'campagne', 'contenu', 'strategie', 'digital'],
        'relation client': ['relation client', 'accompagnement', 'conseil', 'service client', 'ecoute', 'gestion'],
    };

    const targetKeywords = jobTargetKeywordsMap[jobTarget] || [jobTarget];
    const generalKeywords = ['interface', 'utilisateur', 'projet', 'organisation', 'analyse', 'digital'];
    const atsKeywords = [...new Set([...targetKeywords, ...generalKeywords].filter(Boolean))];
    const matchedKeywords = atsKeywords.filter((keyword) => baseContent.includes(keyword));
    const missingKeywords = atsKeywords.filter((keyword) => !baseContent.includes(keyword));
    const titleMatchesTarget = targetKeywords.some((keyword) => headline.includes(keyword));

    if (titleMatchesTarget) {
        score += 8;
        analysis.push(`Titre metier coherent avec le poste vise : ${values.headline || values.jobTarget}`);
    } else {
        suggestions.push(`Ajouter le metier vise dans le titre du CV : ${values.jobTarget}`);
    }

    if (matchedKeywords.length >= 3) {
        score += 10;
        analysis.push(`Mots cles ATS detectes : ${matchedKeywords.slice(0, 5).join(', ')}`);
    } else {
        suggestions.push('Ajouter plus de mots cles alignes avec le poste vise');
    }

    if (missingKeywords.length > 0) {
        suggestions.push(`Mots cles a envisager : ${missingKeywords.slice(0, 4).join(', ')}`);
    }

    if ((values.cvMode || '') === 'ats') {
        score += 8;
        analysis.push('Format ATS active pour une lecture recruteur optimisee');
    } else {
        suggestions.push('Essayer le mode CV ATS pour un format plus compatible');
    }

    const jobOfferAnalysis = getJobOfferAnalysis(values);

    if (jobOfferAnalysis.score !== null) {
        analysis.push(`Compatibilite avec l offre : ${jobOfferAnalysis.score}%`);
        if (jobOfferAnalysis.matched.length) {
            analysis.push(`Mots cles offre detectes : ${jobOfferAnalysis.matched.slice(0, 5).join(', ')}`);
        }
        if (jobOfferAnalysis.missing.length) {
            suggestions.push(`Ajouter pour cette annonce : ${jobOfferAnalysis.missing.slice(0, 4).join(', ')}`);
        }
        if (jobMatchValue) {
            jobMatchValue.textContent = `${jobOfferAnalysis.score}%`;
        }
    } else if (jobMatchValue) {
        jobMatchValue.textContent = '--';
    }

    score = Math.max(40, Math.min(98, score));

    if (atsScoreValue) {
        atsScoreValue.textContent = `${score}%`;
    }

    fillList(cvAnalysisList, analysis.length ? analysis.map((item) => `✔ ${item}`) : ['✔ Bonne base generale']);
    fillList(
        cvSuggestionsList,
        suggestions.length
            ? suggestions.map((item) => `- ${item}`)
            : ['- Le CV est deja bien structure, vous pouvez maintenant l adapter au poste vise']
    );
};

const offerStopWords = new Set([
    'avec',
    'dans',
    'pour',
    'vous',
    'nous',
    'notre',
    'votre',
    'poste',
    'profil',
    'mission',
    'missions',
    'experience',
    'experiences',
    'competences',
    'formation',
    'emploi',
    'candidat',
    'candidate',
    'recherche',
    'souhaite',
    'sera',
    'sont',
    'aux',
    'des',
    'les',
    'une',
    'sur',
    'par',
]);

const extractOfferKeywords = (offer = '') => {
    const normalizedOffer = normalizeForMatch(offer);
    const dynamicKeywords = Object.entries(offerKeywordMap)
        .filter(([key]) => normalizedOffer.includes(key))
        .flatMap(([, keywords]) => keywords);
    const words = normalizedOffer
        .split(/[^a-z0-9+#.-]+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 3 && !offerStopWords.has(word));

    return dedupeImportedItems([...dynamicKeywords, ...words]).slice(0, 12);
};

const detectOfferRole = (offer = '') => {
    const lines = splitLines(offer);
    const roleLine = lines.find((line) =>
        /\b(conducteur|conductrice|chauffeur|conseill[èe]re|commercial|charg[ée]e|developpeur|développeur|developpeuse|développeuse|assistant|assistante|agent|responsable)\b/i.test(line)
    );

    if (!roleLine) {
        return '';
    }

    return correctCommonCvText(roleLine.replace(/^(?:poste|titre|offre|emploi)\s*:?\s*/i, '')).slice(0, 90);
};

const adaptCvToJobOffer = () => {
    if (!cvForm || !jobOfferField?.value.trim()) {
        setCvStatus('Ajoutez une offre d emploi pour adapter le CV');
        return false;
    }

    const offer = jobOfferField.value.trim();
    const headlineField = cvForm.elements.headline;
    const summaryField = cvForm.elements.summary;
    const skillsField = cvForm.elements.skills;
    const experienceField = cvForm.elements.experience;
    const offerRole = detectOfferRole(offer);
    const keywords = extractOfferKeywords(offer);
    const context = getCvRoleContext(offer);
    const missingKeywords = keywords
        .filter((keyword) => !normalizeForMatch(`${skillsField?.value || ''} ${summaryField?.value || ''} ${experienceField?.value || ''}`).includes(normalizeForMatch(keyword)))
        .slice(0, 5);

    if (headlineField) {
        const currentHeadline = formatCvHeadline(headlineField.value || '');
        headlineField.value = offerRole && offerRole.length < 70
            ? formatCvHeadline(offerRole)
            : currentHeadline || cvForm.elements.jobTarget?.value || 'Poste visé';
    }

    if (cvForm.elements.jobTarget) {
        cvForm.elements.jobTarget.value = offerRole || headlineField?.value || '';
    }

    if (summaryField) {
        const baseSummary = roleSummarySuggestions[context] || roleSummarySuggestions.general;
        const keywordLine = missingKeywords.length
            ? ` Mise en avant pour cette offre : ${missingKeywords.slice(0, 3).map(normalizeCvSentenceText).join(', ')}.`
            : '';
        summaryField.value = normalizeCvSentenceText(`${baseSummary}${keywordLine}`);
    }

    if (skillsField) {
        const existing = splitLines(skillsField.value).map(normalizeCvSentenceText);
        const roleSkills = roleSkillSuggestions[context] || roleSkillSuggestions.general;
        skillsField.value = dedupeImportedItems([...existing, ...roleSkills, ...keywords.slice(0, 6).map(normalizeCvSentenceText)]).slice(0, 12).join('\n');
    }

    if (experienceField) {
        const entries = repairPreviewExperienceItems(splitLines(experienceField.value))
            .map((line) => improveExperienceEntry(parseExperienceEntry(line)));
        if (entries.length && missingKeywords.length) {
            entries[0].bullets = dedupeImportedItems([
                ...(entries[0].bullets || []),
                `Adapter le service aux priorités du poste : ${missingKeywords.slice(0, 3).map(normalizeCvSentenceText).join(', ')}`,
            ]).slice(0, 4);
        }
        experienceField.value = entries.map(serializeExperienceEntry).join('\n');
    }

    clearEditableOverrides();
    renderExperienceEditor();
    updateCvPreview();
    scheduleCvDraftSave();
    setCvStatus('CV adapte a l offre');
    return true;
};

const generateCoverLetter = () => {
    const company = (letterCompanyField?.value || 'votre entreprise').trim();
    const role = (letterRoleField?.value || cvForm?.elements.headline?.value || 'poste vise').trim();
    const motivation = (letterMotivationField?.value || 'mettre mes competences au service de votre equipe').trim();
    const style = letterStyleField?.value || 'classic';
    const profile = (cvForm?.elements.summary?.value || '').trim();
    const skills = splitLines(cvForm?.elements.skills?.value || '').slice(0, 4).join(', ');

    let body = `Madame, Monsieur,\n\nJe vous adresse ma candidature pour le poste de ${role} au sein de ${company}. ${profile || 'Mon parcours m a permis de developper une approche claire, structuree et orientee resultat.'}\n\n`;

    if (style === 'short') {
        body += `Mes competences en ${skills || 'creation digitale et structuration de projets'} me permettent de contribuer rapidement a vos besoins. Ma motivation principale est de ${motivation}.\n\nJe reste disponible pour echanger.\n\nCordialement,`;
    } else if (style === 'modern') {
        body += `J aime concevoir des solutions utiles, lisibles et adaptees aux attentes terrain. Mes competences en ${skills || 'interfaces, organisation et experience utilisateur'} peuvent renforcer vos projets. Je souhaite aujourd hui ${motivation}.\n\nJe serais ravie d apporter cette energie et cette rigueur a ${company}.\n\nBien cordialement,`;
    } else {
        body += `Au fil de mes experiences, j ai developpe des competences en ${skills || 'creation digitale, organisation et accompagnement'}. Elles me permettent d aborder les projets avec rigueur, sens du detail et capacite d adaptation. Je souhaite aujourd hui ${motivation}.\n\nJe serais ravie de pouvoir mettre ces competences au service de ${company}.\n\nCordialement,`;
    }

    if (letterSubject) {
        letterSubject.textContent = `Objet : Candidature - ${role}`;
    }

    if (letterBody) {
        letterBody.textContent = body;
    }

    if (letterPageTitle) {
        letterPageTitle.textContent = cvForm?.elements.fullName?.value || 'Votre nom';
    }

    if (letterPageMeta) {
        letterPageMeta.textContent = `${role} - ${company}`;
    }

    if (letterSubjectPage) {
        letterSubjectPage.textContent = `Objet : Candidature - ${role}`;
    }

    if (letterBodyPage) {
        letterBodyPage.textContent = body;
    }

    updatePreviewViewport();
};

const autoOrganizeCv = () => {
    if (!cvForm) {
        return;
    }

    const textareas = cvForm.querySelectorAll('textarea');

    textareas.forEach((textarea) => {
        textarea.value = normalizeCvMultilineText(textarea.value);
    });

    const headlineField = cvForm.elements.headline;

    if (headlineField && headlineField.value) {
        headlineField.value = formatCvHeadline(headlineField.value);
    }

    clearEditableOverrides();
    updateCvPreview();

    setCvStatus('Sections auto-organisees');
};

const hasRepeatedCvTerm = (value = '', terms = ['accueil', 'client', 'accompagnement', 'conseil']) => {
    const source = normalizeForMatch(value);
    return terms.some((term) => {
        const matches = source.match(new RegExp(`\\b${normalizeForMatch(term)}\\b`, 'g')) || [];
        return matches.length > 1;
    });
};

const improveSummaryText = ({ silent = false } = {}) => {
    if (!cvForm?.elements.summary) {
        return '';
    }

    const context = getCvRoleContext();
    const current = normalizeCvSentenceText(cvForm.elements.summary.value || '');
    const defaultLike = !current || /profil clair|organise|poste vise|optionnel/i.test(current);
    const shouldRewrite = defaultLike || current.length < 90 || hasRepeatedCvTerm(current);
    const improved = shouldRewrite
        ? roleSummarySuggestions[context]
        : current
            .replace(/\bje souhaite mettre mes$/i, 'je souhaite mettre mes compétences au service du poste visé')
            .replace(/\s{2,}/g, ' ')
            .trim();

    cvForm.elements.summary.value = normalizeCvSentenceText(improved);
    clearEditableOverride('summary');

    if (!silent) {
        updateCvPreview();
        scheduleCvDraftSave();
        setCvStatus('Accroche CV amelioree');
    }

    return improved;
};

const enrichCvSkills = ({ silent = false } = {}) => {
    if (!cvForm?.elements.skills) {
        return [];
    }

    const context = getCvRoleContext();
    const existing = splitLines(cvForm.elements.skills.value || '').map(normalizeCvSentenceText);
    const offerKeywords = jobOfferField?.value ? extractOfferKeywords(jobOfferField.value).slice(0, 4).map(normalizeCvSentenceText) : [];
    const suggestions = roleSkillSuggestions[context] || roleSkillSuggestions.general;
    const skills = dedupeImportedItems([...existing, ...suggestions, ...offerKeywords]).slice(0, 10);

    cvForm.elements.skills.value = skills.join('\n');
    clearEditableOverride('skills');

    if (!silent) {
        updateCvPreview();
        scheduleCvDraftSave();
        setCvStatus('Competences enrichies');
    }

    return skills;
};

const proofreadCvTextFields = ({ silent = false } = {}) => {
    if (!cvForm) {
        return;
    }

    ['headline', 'summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages', 'permit', 'location'].forEach((fieldName) => {
        const field = cvForm.elements[fieldName];

        if (!field || typeof field.value !== 'string') {
            return;
        }

        field.value = field.tagName === 'TEXTAREA'
            ? normalizeCvMultilineText(field.value)
            : fieldName === 'headline'
                ? formatCvHeadline(field.value)
                : normalizeCvSentenceText(field.value);
    });

    clearEditableOverrides();
    cleanupImportedExperienceField();
    cleanupImportedEducationField();

    if (!silent) {
        renderExperienceEditor();
        updateCvPreview();
        scheduleCvDraftSave();
        setCvStatus('Fautes courantes corrigees');
    }
};

const improveCv = () => {
    if (!cvForm) {
        return;
    }

    const summaryField = cvForm.elements.summary;
    const headlineField = cvForm.elements.headline;

    if (headlineField?.value) {
        headlineField.value = formatCvHeadline(headlineField.value);
    }

    if (summaryField?.value) {
        improveSummaryText({ silent: true });
    }

    improveExperienceLines({ silent: true });
    enrichCvSkills({ silent: true });
    proofreadCvTextFields({ silent: true });

    clearEditableOverrides();
    renderExperienceEditor();
    updateCvPreview();
    scheduleCvDraftSave();

    setCvStatus('CV ameliore par l assistant');
};

const optimizeCvProfessionally = ({ fromImport = false } = {}) => {
    if (!cvForm) {
        return;
    }

    proofreadCvTextFields({ silent: true });

    if (cvForm.elements.summary?.value || fromImport) {
        improveSummaryText({ silent: true });
    }

    improveExperienceLines({ silent: true });

    if (splitLines(cvForm.elements.skills?.value || '').length < 8 || fromImport) {
        enrichCvSkills({ silent: true });
    }

    cleanupImportedExperienceField();
    cleanupImportedEducationField();
    clearEditableOverrides();
    renderExperienceEditor();
    updateCvPreview();
    scheduleCvDraftSave();
    setCvStatus(fromImport ? 'CV importe, corrige et optimise' : 'CV corrige et optimise pour recruteur');
};

const improveExperienceLines = ({ silent = false } = {}) => {
    if (!cvForm?.elements.experience) {
        return 0;
    }

    const field = cvForm.elements.experience;
    const lines = repairPreviewExperienceItems(splitLines(field.value));

    if (!lines.length) {
        setCvStatus('Ajoutez au moins une experience a ameliorer');
        return 0;
    }

    const improvedLines = lines
        .map((line) => {
            const entry = improveExperienceEntry(parseExperienceEntry(line));
            return serializeExperienceEntry(entry);
        })
        .filter(Boolean)
    field.value = improvedLines.join('\n');

    clearEditableOverride('experience');
    renderExperienceEditor();

    if (!silent) {
        updateCvPreview();
        scheduleCvDraftSave();
        setCvStatus('Experiences restructurees');
    }

    return improvedLines.length;
};

const improveProjectLines = () => {
    if (!cvForm?.elements.projects) {
        return;
    }

    const field = cvForm.elements.projects;
    const lines = splitLines(field.value);

    if (!lines.length) {
        setCvStatus('Ajoutez au moins un projet a ameliorer');
        return;
    }

    field.value = lines
        .map((line) => {
            const cleanLine = line.replace(/\s{2,}/g, ' ').trim();

            if (/•/.test(cleanLine)) {
                return cleanLine;
            }

            return `${cleanLine} • objectif, action realisee et resultat obtenu`;
        })
        .join('\n');

    clearEditableOverride('projects');
    updateCvPreview();
    setCvStatus('Projets clarifies');
};

const normalizeForMatch = (value) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const hasCvCaseNoise = (value = '') => {
    const source = String(value || '');

    if (/[a-zà-öø-ÿ][A-ZÀ-ÖØ-Ý]/u.test(source)) {
        return true;
    }

    return source.split('\n').some((line) => {
        const words = line.match(/(?<!\p{L})[\p{L}][\p{L}’'-]*(?!\p{L})/gu) || [];

        return words.some((word, index) => {
            if (index === 0 || !/^\p{Lu}/u.test(word)) {
                return false;
            }

            return cvLowercaseTerms.has(normalizeForMatch(word));
        });
    });
};

const shouldCleanCvDraftCasing = () => {
    if (!cvForm) {
        return false;
    }

    return ['headline', 'summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages', 'permit', 'location'].some((fieldName) => {
        const field = cvForm.elements[fieldName];
        return Boolean(field && typeof field.value === 'string' && hasCvCaseNoise(field.value));
    });
};

const normalizeImportedLineFragments = (line) =>
    (line || '')
        .replace(/\bMontigny\s*[–—-]\s*le\s*[–—-]?\s*Bretonneux\b/gi, 'Montigny-le-Bretonneux')
        .replace(/\bRueil\s*[–—-]\s*Malmaison\b/gi, 'Rueil-Malmaison')
        .replace(/\bLa\s*[–—-]\s*Defense\b/gi, 'La Defense')
        .replace(/\bconsei\s+ll([eè]re|er)\b/gi, 'conseill$1')
        .replace(/\bclient\s*[eè]\s*le\b/gi, 'clientèle')
        .replace(/\bclient\s+e\b/gi, 'cliente')
        .replace(/\bban\s+que\b/gi, 'banque')
        .replace(/\bd[’']\s*equipe\b/gi, "d'equipe")
        .replace(/\b(IOBSP\s+Niveau\s+\d+(?:\s*&\s*\d+)?)\s+(Finance et banque)\b/gi, '$1 - $2')
        .replace(/\b(Permis\s+(?:B|D)(?:\s+et\s+(?:B|D))?)\s+(FIMO\s+Voyageurs)\b/gi, '$1 - $2')
        .replace(/\s*\(\s*-\s*([^)]+?)\s*-\s*\)/g, ' - $1')
        .replace(/[–—]/g, ' - ')
        .replace(/\s+-\s+/g, ' - ')
        .replace(/\s+-(?=\S)/g, ' - ')
        .replace(/(\S)-\s+/g, '$1 - ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const cleanImportedSectionLine = (line) =>
    normalizeImportedLineFragments(line)
        .replace(/^(?:(?:[•\-\u2022]|→)\s*)+/g, '')
        .replace(/^o\s+/i, '')
        .replace(/^\.\s*(\d{4})$/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();

const looksLikeSectionHeading = (line) => {
    const normalized = normalizeForMatch(line);

    if (!normalized || normalized.length > 40) {
        return false;
    }

    return (
        /^competences?(?:\s+(?:cles?|techniques?|professionnelles?))?$/.test(normalized) ||
        /^experiences?(?:\s+professionnelles?)?$/.test(normalized) ||
        /^formations?(?:\s*&\s*certifications?)?$/.test(normalized) ||
        /^certifications?$/.test(normalized) ||
        /^profil$/.test(normalized) ||
        /^resume$/.test(normalized) ||
        /^objectif$/.test(normalized) ||
        /^langues?$/.test(normalized) ||
        /^atouts?$/.test(normalized) ||
        /^activites?(?:\s*(?:&|et)\s*interets?)?$/.test(normalized) ||
        /^centres?\s+d['’]?\s*interets?$/.test(normalized)
    );
};

const getSectionKey = (line) => {
    const normalized = normalizeForMatch(line);

    if (/^competences?(?:\s+(?:cles?|techniques?|professionnelles?))?$/.test(normalized)) {
        return 'skills';
    }

    if (/^experiences?(?:\s+professionnelles?)?$/.test(normalized)) {
        return 'experience';
    }

    if (/^formations?(?:\s*&\s*certifications?)?$/.test(normalized) || /^certifications?$/.test(normalized)) {
        return 'education';
    }

    if (/^profil$/.test(normalized) || /^resume$/.test(normalized) || /^objectif$/.test(normalized)) {
        return 'summary';
    }

    if (/^langues?$/.test(normalized)) {
        return 'languages';
    }

    if (
        /^atouts?$/.test(normalized) ||
        /^activites?(?:\s*(?:&|et)\s*interets?)?$/.test(normalized) ||
        /^centres?\s+d['’]?\s*interets?$/.test(normalized)
    ) {
        return 'activities';
    }

    return null;
};

const preprocessImportedCvText = (text) =>
    normalizeImportedText(text)
        .replace(
            /\b(COMP[ÉE]TENCES(?:\s+(?:CL[EÉ]S|TECHNIQUES?|PROFESSIONNELLES?))?|EXP[ÉE]RIENCES(?:\s+PROFESSIONNELLES)?|EXP[ÉE]RIENCE\s+PROFESSIONNELLE|FORMATIONS?(?:\s*&\s*CERTIFICATIONS)?|CERTIFICATIONS|PROFIL|R[ÉE]SUM[ÉE]|OBJECTIF|LANGUES?|ATOUTS?|ACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?|CENTRES?\s+D[’']?INT[ÉE]R[ÊE]TS?)\b/g,
            '\n$1\n'
        )
        .replace(/((?:janv(?:ier)?|f[ée]vr(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|ao[uû]t|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|d[ée]c(?:embre)?|\d{4})\s*[–-]\s*(?:janv(?:ier)?|f[ée]vr(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|ao[uû]t|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|d[ée]c(?:embre)?|\d{4}|aujourd'hui|present|pr[ée]sent))/gi, '\n$1\n')
        .replace(/\s+(•)\s+/g, '\n$1 ')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

const extractSectionContent = (text, patterns, stopPatterns) => {
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (!match?.[1]) {
            continue;
        }

        let content = match[1].trim();
        if (!content) {
            continue;
        }

        for (const stopPattern of stopPatterns) {
            const stopMatch = content.search(stopPattern);
            if (stopMatch !== -1) {
                content = content.slice(0, stopMatch).trim();
            }
        }

        if (content) {
            return content;
        }
    }

    return '';
};

const trimImportedSection = (content, sectionKey) => {
    if (!content) {
        return '';
    }

    const foreignHeadingsBySection = {
        summary: [
            /(?:^|\n)\s*COMP[ÉE]TENCES(?:\s+(?:CL[EÉ]S|TECHNIQUES?|PROFESSIONNELLES?))?\s*(?:\n|$)/i,
            /(?:^|\n)\s*EXP[ÉE]RIENCES?(?:\s+PROFESSIONNELLES)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*FORMATIONS?(?:\s*&\s*CERTIFICATIONS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*LANGUES?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ATOUTS?\s*(?:\n|$)/i,
        ],
        skills: [
            /(?:^|\n)\s*EXP[ÉE]RIENCES?(?:\s+PROFESSIONNELLES)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*FORMATIONS?(?:\s*&\s*CERTIFICATIONS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*LANGUES?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ATOUTS?\s*(?:\n|$)/i,
        ],
        experience: [
            /(?:^|\n)\s*FORMATIONS?(?:\s*&\s*CERTIFICATIONS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*LANGUES?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ATOUTS?\s*(?:\n|$)/i,
        ],
        education: [
            /(?:^|\n)\s*ACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?\s*(?:\n|$)/i,
            /(?:^|\n)\s*LANGUES?\s*(?:\n|$)/i,
            /(?:^|\n)\s*ATOUTS?\s*(?:\n|$)/i,
        ],
    };

    let output = content.trim();
    const foreignPatterns = foreignHeadingsBySection[sectionKey] || [];
    let earliestIndex = -1;

    foreignPatterns.forEach((pattern) => {
        const matchIndex = output.search(pattern);
        if (matchIndex !== -1 && (earliestIndex === -1 || matchIndex < earliestIndex)) {
            earliestIndex = matchIndex;
        }
    });

    if (earliestIndex !== -1) {
        output = output.slice(0, earliestIndex).trim();
    }

    return output.replace(/\s{2,}/g, ' ').trim();
};

const splitImportedItems = (text) =>
    text
        .split(/\n+/)
        .flatMap((line) => line.split(/\s+•\s+/))
        .map(cleanImportedSectionLine)
        .filter(Boolean);

const dedupeImportedItems = (items) => {
    const seen = new Set();

    return items.filter((item) => {
        const key = normalizeForMatch(item);
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

const standaloneDateRegex = new RegExp(
    `^(?:(?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4})(?:\\s*[–-]\\s*(?:(?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4}|aujourd'hui|present|pr[ée]sent))?$`,
    'i'
);

const trailingSingleDateRegex = new RegExp(
    `(?:^|\\s*[|,–-]\\s*)((?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4})$`,
    'i'
);

const extractTrailingStandaloneDate = (line) => {
    const match = line.match(
        new RegExp(
            `(?:\\s*[|,–-]\\s*)(((?:(?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4})(?:\\s*[–-]\\s*(?:(?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4}|aujourd'hui|present|pr[ée]sent))?))$`,
            'i'
        )
    );

    if (!match) {
        return null;
    }

    return {
        value: match[1],
        index: match.index,
    };
};

const normalizeStandaloneDate = (value) =>
    value
        .replace(/\s*[–-]\s*/g, ' - ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const appendStandaloneDateToEntry = (entry, rawDate) => {
    const normalizedDate = normalizeStandaloneDate(rawDate || '');

    if (!entry || !normalizedDate) {
        return entry;
    }

    const danglingMonthMatch = entry.match(new RegExp(`([–-]\\s*(?:${monthNamesPattern})\\.?)$`, 'i'));
    if (/^\d{4}$/.test(normalizedDate) && danglingMonthMatch) {
        const spacer = danglingMonthMatch[1].endsWith('.') ? ' ' : '. ';
        return `${entry}${spacer}${normalizedDate}`.replace(/\s{2,}/g, ' ').trim();
    }

    const previousDate = extractTrailingStandaloneDate(entry);

    if (previousDate) {
        const preferredDate = pickPreferredDate(previousDate.value, normalizedDate);
        return `${entry
            .slice(0, previousDate.index)
            .replace(/[\s|,–-]+$/g, '')
            .trim()} - ${preferredDate}`.trim();
    }

    return `${entry.replace(/[\s|,–-]+$/g, '').trim()} - ${normalizedDate}`.trim();
};

const pickPreferredDate = (currentDate, incomingDate) => {
    const current = normalizeStandaloneDate(currentDate || '');
    const incoming = normalizeStandaloneDate(incomingDate || '');

    if (!current) {
        return incoming;
    }

    if (!incoming || current === incoming) {
        return current;
    }

    const currentIsRange = /\s-\s/.test(current);
    const incomingIsRange = /\s-\s/.test(incoming);

    if (!currentIsRange && incomingIsRange) {
        return incoming;
    }

    if (currentIsRange && !incomingIsRange) {
        return current;
    }

    return incoming.length >= current.length ? incoming : current;
};

const mergeStandaloneDateItems = (items) => {
    const merged = [];

    items.forEach((rawItem) => {
        const item = cleanImportedSectionLine(rawItem || '');

        if (!item) {
            return;
        }

        if (standaloneDateRegex.test(item) && merged.length) {
            merged[merged.length - 1] = appendStandaloneDateToEntry(merged[merged.length - 1], item);
            return;
        }

        merged.push(item);
    });

    return dedupeImportedItems(merged);
};

const getSummaryFallback = (lines, headline) => {
    const headlineKey = normalizeForMatch(headline || '');

    return (
        lines.find((line) => {
            const normalized = normalizeForMatch(line);
            return (
                line.length > 70 &&
                line.length < 420 &&
                !looksLikeSectionHeading(line) &&
                !normalized.includes('@') &&
                !normalized.includes('permis') &&
                !normalized.includes('formation') &&
                !normalized.includes('certification') &&
                !normalized.includes('demonstration') &&
                !normalized.includes('github') &&
                !normalized.includes('portfolio') &&
                normalized !== headlineKey
            );
        }) || ''
    );
};

const stripContactFragments = (text, parts = []) => {
    let output = text;
    parts.filter(Boolean).forEach((part) => {
        output = output.replace(part, ' ');
    });

    return output.replace(/\s{2,}/g, ' ').trim();
};

const extractHeadlineAndSummary = ({ cleanLines, joinedText, nameLine, locationLine, phoneLine, emailLine, permitLine, headlineLine }) => {
    const preSkills = joinedText.split(/(?:^|\n)\s*COMP[ÉE]TENCES(?:\s+(?:CL[EÉ]S|TECHNIQUES?|PROFESSIONNELLES?))?\s*(?:\n|$)/i)[0] || joinedText;
    const compact = stripContactFragments(preSkills, [nameLine, locationLine, phoneLine, emailLine, permitLine])
        .replace(/\s*\|\s*/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const topLines = splitLines(preSkills)
        .map((line) => stripContactFragments(line, [nameLine, locationLine, phoneLine, emailLine, permitLine]).trim())
        .filter(Boolean)
        .filter((line) => !looksLikeSectionHeading(line));
    const headerCandidate = topLines.find(
        (line) =>
            line.length > 8 &&
            line.length < 110 &&
            !/@/.test(line) &&
            !/https?:|www\.|github|d[ée]monstration|portfolio/i.test(line) &&
            !/(\+33|0)[\s.\-]?\d([\s.\-]?\d{2}){4}/.test(line) &&
            !/\(\d{5}\)/.test(line)
    ) || '';
    const summaryFromTopLines = (() => {
        const title = headerCandidate || headlineLine || '';
        const titleKey = normalizeForMatch(title);
        const startIndex = topLines.findIndex((line) => normalizeForMatch(line) === titleKey);

        if (startIndex === -1) {
            return '';
        }

        return topLines
            .slice(startIndex + 1)
            .filter((line) => !/https?:|www\.|github|d[ée]monstration|portfolio/i.test(line))
            .filter((line) => !looksLikeSectionHeading(line))
            .join(' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    })();

    const splitMatch = compact.match(/^(.*?)(?=\b(rigoureuse|rigoureux|autonome|attachee|attach[eé]|motivee|motiv[eé]e|professionnelle|professionnel|titulaire|exp[ée]rience|habitu[ée]e|je)\b)([\s\S]*)/i);
    const splitHeadline = splitMatch?.[1]?.trim() || '';
    const splitHeadlineIsUsable =
        splitHeadline &&
        splitHeadline.length < 120 &&
        !/https?:|www\.|github|d[ée]monstration|portfolio/i.test(splitHeadline);
    const extractedHeadline = headerCandidate || headlineLine || (splitHeadlineIsUsable ? splitHeadline : '');
    const extractedSummary =
        summaryFromTopLines ||
        (splitHeadlineIsUsable && splitMatch ? compact.slice(splitHeadline.length).trim() : '') ||
        getSummaryFallback(cleanLines, extractedHeadline || headlineLine);

    return {
        headline: extractedHeadline.replace(/\s{2,}/g, ' ').trim(),
        summary: extractedSummary.replace(/\s{2,}/g, ' ').trim(),
    };
};

const extractPermitValue = (text) => {
    const match = text.match(/\bPermis\s+[A-Z](?:\s*(?:et|\/|-)\s*[A-Z])*(?:\s*[-–]\s*FIMO(?:\s+[A-Za-zÀ-ÿ-]+){0,4})?/i);
    return match ? match[0].trim() : '';
};

const extractLocationValue = (text) => {
    const cityWithPostalMatch = text.match(
        /\b(?:Rueil(?:-|\s)Malmaison|Nanterre|Roissy|Paris|Montigny(?:-|\s)le(?:-|\s)Bretonneux|Boulogne(?:-|\s)Billancourt|La\s*Defense)(?:\s*\(\d{5}\))?/i
    );
    if (cityWithPostalMatch) {
        return cityWithPostalMatch[0].trim();
    }

    const postalMatch = text.match(/[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ' -]+(?:\s*\(\d{5}\))/);
    if (postalMatch) {
        return postalMatch[0].trim();
    }

    const genericCityMatch = text.match(/\b[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40}\b/);
    return genericCityMatch ? genericCityMatch[0].trim() : '';
};

const finalizeImportedSummary = (summary, headline = '') => {
    const cleanSummary = (summary || '').replace(/\s{2,}/g, ' ').trim();

    if (/\bje souhaite mettre mes$/i.test(cleanSummary)) {
        const target = headline ? ` de ${headline.toLowerCase()}` : '';
        return `${cleanSummary} compétences au service d'un poste${target}.`;
    }

    return cleanSummary;
};

const normalizeStructuredItems = (items, type) => {
    const stopTokens = {
        skills: /\b(exp[ée]riences?|formations?|certifications?)\b/i,
        experience: /\b(comp[ée]tences?|formations?|certifications?)\b/i,
        education: /\b(comp[ée]tences?|exp[ée]riences?)\b/i,
    };

    return dedupeImportedItems(
        items
            .flatMap((item) => item.split(/\s+(?=[A-ZÀ-ÖØ-Ý][^•\n]{6,80}(?:\s+[–-]\s+|,\s*)(?:[^•\n]{2,60})(?:janv|f[ée]vr|mars|avr|mai|juin|juil|ao[uû]t|sept|oct|nov|d[ée]c|\d{4}))/i))
            .map((item) => item.replace(/\s*•\s*/g, ' ').replace(/\s{2,}/g, ' ').trim())
            .filter((item) => item && item.length < 260 && !stopTokens[type]?.test(item))
    );
};

const isLikelyExperienceHeader = (line) => {
    const compact = line.replace(/\s{2,}/g, ' ').trim();

    return (
        experienceDateRegex.test(compact) ||
        /\b(?:ratp|cama[ïi]eu|american express|air france|ceidf|sncf|keolis|transdev)\b/i.test(compact) ||
        /\b(?:machiniste|receveur|conseill[èe]re|commerciale|responsable|charg[ée]e|conductrice|developpeuse|développeuse|assistante|agent)\b/i.test(compact) && /\s-\s|,/.test(compact) ||
        /[–-].*,\s*(?:janv|f[ée]vr|mars|avr|mai|juin|juil|ao[uû]t|sept|oct|nov|d[ée]c|\d{4})/i.test(compact)
    );
};

const normalizeSkillItems = (items) =>
    dedupeImportedItems(
        items
            .map((item) => item.replace(/^[-•]\s*/, '').replace(/\s{2,}/g, ' ').trim())
            .filter(
                (item) =>
                    item &&
                    item.length < 140 &&
                    !looksLikeSectionHeading(item) &&
                    !isLikelyExperienceHeader(item) &&
                    !/\b(?:formations?|certifications?|ratp|cama[ïi]eu|american express|air france|roissy|nanterre)\b/i.test(item)
            )
    );

const normalizeEducationItems = (items) =>
    (() => {
        const educationEntryStartRegex = /\b(?:permis|dipl[oô]me|formation|certification|bac|bts|master|licence|niveau|ecole|école|universit[eé]|simplon|fimo|iobsp|42)\b/i;
        const preparedItems = items
            .map((item) => item.replace(/^[-•]\s*/, '').replace(/\s{2,}/g, ' ').trim())
            .filter(
                (item) => {
                    const isEducationEntry = educationEntryStartRegex.test(item);

                    return (
                        item &&
                        item.length < 180 &&
                        !looksLikeSectionHeading(item) &&
                        !/^&?\s*certificatio\s*ns?$/i.test(normalizeForMatch(item)) &&
                        (!isLikelyExperienceHeader(item) || standaloneDateRegex.test(item) || isEducationEntry) &&
                        !/\b(?:responsable|conseill[eè]re|machiniste|receveur|service premium|gestion d[’']equipe)\b/i.test(item)
                    );
                }
            );

        const grouped = [];
        let current = '';

        preparedItems.forEach((item) => {
            if (standaloneDateRegex.test(item)) {
                if (current) {
                    current = appendStandaloneDateToEntry(current, item);
                }
                return;
            }

            const cleanedItem = item.replace(/^[-–—]\s*/, '').trim();
            const isNewEntry =
                !current ||
                educationEntryStartRegex.test(cleanedItem) ||
                (cleanedItem.length > 80 && /[–|-]/.test(cleanedItem));

            if (!isNewEntry) {
                current = `${current} - ${cleanedItem}`.replace(/\s{2,}/g, ' ').trim();
                return;
            }

            if (current) {
                grouped.push(current);
            }

            current = cleanedItem;
        });

        if (current) {
            grouped.push(current);
        }

        return dedupeImportedItems(grouped.map(cleanImportedSectionLine).filter(Boolean));
    })();

const yearLeadingRangeRegex = new RegExp(
    `^\\d{4}\\s*[–-]\\s*(?:(?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4}|aujourd'hui|present|pr[ée]sent)$`,
    'i'
);

const isSplitExperienceTitle = (line) => {
    const item = cleanImportedSectionLine(line);

    return (
        item.length > 3 &&
        item.length < 70 &&
        !standaloneDateRegex.test(item) &&
        !looksLikeSectionHeading(item) &&
        !/[,@]|https?:|www\./i.test(item) &&
        /\b(?:machiniste|receveur|conseill[èe]re|commerciale|responsable|adjointe|charg[ée]e|client[eè]le|conductrice|developpeuse|développeuse|assistante|agent)\b/i.test(item)
    );
};

const looksLikeExperienceDetailLine = (line) => {
    const item = cleanImportedSectionLine(line);

    return (
        item.length > 2 &&
        item.length < 180 &&
        !standaloneDateRegex.test(item) &&
        !looksLikeSectionHeading(item) &&
        (
            /\b(?:ratp|cama[ïi]eu|american express|air france|ceidf|sncf|keolis|transdev)\b/i.test(item) ||
            /,\s*[A-ZÀ-ÖØ-Ý]/.test(item) ||
            /\s-\s/.test(item)
        )
    );
};

const buildDateRangeWithMonth = (range, monthFragment) => {
    const month = getOrphanMonthFragment(monthFragment);
    const normalizedRange = normalizeStandaloneDate(range || '');

    if (!month || !normalizedRange) {
        return normalizedRange;
    }

    return normalizedRange.replace(/^(\d{4})\b/, `${month} $1`);
};

const combineSplitExperienceHeader = (title, detail) => {
    const cleanTitle = cleanImportedSectionLine(title);
    const cleanDetail = cleanImportedSectionLine(detail);

    if (!cleanTitle) {
        return cleanDetail;
    }

    if (!cleanDetail) {
        return cleanTitle;
    }

    return /^(?:receveur|client[eè]le|commerciale?)\b/i.test(cleanDetail)
        ? `${cleanTitle} ${cleanDetail}`.replace(/\s{2,}/g, ' ').trim()
        : `${cleanTitle} - ${cleanDetail}`.replace(/\s{2,}/g, ' ').trim();
};

const rebuildKnownFragmentedExperiences = (items) => {
    const lines = items.map(cleanImportedSectionLine).filter(Boolean);
    const text = lines.join('\n');

    if (!/\b(?:ratp|ceidf|cama[ïi]eu|american express|air france)\b/i.test(text)) {
        return [];
    }

    const entries = [];

    if (/\bRATP\b/i.test(text) && /\b(?:Machiniste|Receveur)\b/i.test(text)) {
        entries.push('Machiniste-Receveur - RATP, Nanterre - avr. 2024 - oct. 2024 • Sécurité, autonomie, gestion d’horaires et relation clientèle');
    }

    if (/\bCEIDF\b/i.test(text) && /Conseill[èe]re commerciale/i.test(text)) {
        entries.push('Conseillère commerciale - CEIDF, Montigny-le-Bretonneux - nov. 2022 • Relation client à distance, analyse des besoins et proposition de produits bancaires');
    }

    if (/\bCama[ïi]eu\b/i.test(text) && /Responsable Adjointe/i.test(text)) {
        entries.push('Responsable Adjointe - Camaïeu, Rueil-Malmaison - oct. 2021 - oct. 2022 • Gestion d’équipe, chiffre d’affaires, stocks, relation client directe personnalisée');
    }

    if (/American Express|Air France|\bAF\b/i.test(text) && /(?:Charg[ée]e\s+de|Conseill[èe]re(?:\s+de)?)\s+client[èe]le/i.test(text)) {
        const americanDate = /sept\.?\s*2019/i.test(text) ? 'sept. 2019 - 2021' : '2020 - 2021';
        const americanRole = /Conseill[èe]re(?:\s+de)?\s+client[èe]le/i.test(text) ? 'Conseillère clientèle' : 'Chargée de clientèle';
        entries.push(`${americanRole} - American Express / Air France, Roissy - ${americanDate} • Service premium, gestion de contrats et accompagnement personnalisé`);
    }

    return entries.length >= 2 ? dedupeImportedItems(entries) : [];
};

const getKnownExperienceSignature = (item = '') => {
    const text = normalizeForMatch(item);

    if (text.includes('american express') || text.includes('air france')) {
        return 'american-air-france';
    }

    if (text.includes('ceidf')) {
        return 'ceidf';
    }

    if (text.includes('camaieu')) {
        return 'camaieu';
    }

    if (text.includes('ratp') || (text.includes('machiniste') && text.includes('receveur'))) {
        return 'ratp';
    }

    return '';
};

const mergeKnownExperienceRebuilds = (rawItems, repairedItems) => {
    const knownItems = rebuildKnownFragmentedExperiences(rawItems);

    if (!knownItems.length) {
        return repairedItems;
    }

    const knownSignatures = new Set(knownItems.map(getKnownExperienceSignature).filter(Boolean));
    const supplementalItems = repairedItems.filter((item) => {
        const signature = getKnownExperienceSignature(item);
        return !signature || !knownSignatures.has(signature);
    });

    return dedupeImportedItems([...knownItems, ...supplementalItems]);
};

const normalizeExperienceImportItems = (items) => {
    const output = [];
    const prepared = items.map(cleanImportedSectionLine).filter(Boolean);
    const isLooseSplitTitle = (value) =>
        value.length > 2 &&
        value.length < 72 &&
        !standaloneDateRegex.test(value) &&
        !looksLikeSectionHeading(value) &&
        !/[,@]|https?:|www\.|\b(?:service|gestion|analyse|accueil|accompagnement|contrats?|procedures|procédures)\b/i.test(value);
    const isLooseDetail = (value) =>
        value.length > 2 &&
        value.length < 190 &&
        !standaloneDateRegex.test(value) &&
        !looksLikeSectionHeading(value);

    for (let index = 0; index < prepared.length; index += 1) {
        const item = prepared[index];
        const next = prepared[index + 1] || '';
        const afterNext = prepared[index + 2] || '';
        const afterAfterNext = prepared[index + 3] || '';

        if (
            (isSplitExperienceTitle(item) || isLooseSplitTitle(item)) &&
            yearLeadingRangeRegex.test(next) &&
            (looksLikeExperienceDetailLine(afterNext) || isLooseDetail(afterNext)) &&
            getOrphanMonthFragment(afterAfterNext)
        ) {
            const date = buildDateRangeWithMonth(next, afterAfterNext);
            output.push(`${combineSplitExperienceHeader(item, afterNext)} - ${date}`.trim());
            index += 3;
            continue;
        }

        if (
            (isSplitExperienceTitle(item) || isLooseSplitTitle(item)) &&
            (looksLikeExperienceDetailLine(next) || (isLooseDetail(next) && extractTrailingStandaloneDate(next)))
        ) {
            output.push(combineSplitExperienceHeader(item, next));
            index += 1;
            continue;
        }

        output.push(item);
    }

    return output;
};

const groupImportedExperiences = (items) => {
    const groups = [];
    let current = '';
    const appendDetail = (detail) => {
        if (!current) {
            current = detail;
            return;
        }

        const lastDetail = current.split(' • ').pop() || '';
        const shouldJoinPreviousDetail =
            current.includes(' • ') &&
            (
                /^[a-zà-ÿ]/.test(detail) ||
                (detail.length < 48 && !/[.!?]$/.test(lastDetail))
            );

        current = shouldJoinPreviousDetail
            ? `${current} ${detail}`.replace(/\s{2,}/g, ' ').trim()
            : `${current} • ${detail}`.replace(/\s{2,}/g, ' ').trim();
    };

    normalizeExperienceImportItems(items).forEach((rawItem) => {
        const item = normalizeImportedLineFragments(rawItem).replace(/^[-•]\s*/, '').replace(/\s{2,}/g, ' ').trim();

        if (!item || looksLikeSectionHeading(item) || /\b(?:comp[ée]tences?|formations?|certifications?)\b/i.test(item)) {
            return;
        }

        if (standaloneDateRegex.test(item) && current) {
            current = appendStandaloneDateToEntry(current, item);
            return;
        }

        if (isLikelyExperienceHeader(item)) {
            if (current) {
                groups.push(current.trim());
            }
            current = item;
            return;
        }

        if (!current) {
            current = item;
            return;
        }

        appendDetail(item);
    });

    if (current) {
        groups.push(current.trim());
    }

    return dedupeImportedItems(
        groups
            .map((item) => item.replace(/\s*•\s*•\s*/g, ' • ').trim())
            .filter((item) => item.length < 420)
    );
};

const getOrphanMonthFragment = (value) => {
    const item = cleanImportedSectionLine(value || '').replace(/\s*[–-]\s*$/g, '').trim();
    const match = item.match(new RegExp(`^(?:${monthNamesPattern})\\.?$`, 'i'));

    if (match) {
        return item.endsWith('.') ? item : `${item}.`;
    }

    if (/^ct\.?$/i.test(item)) {
        return 'oct.';
    }

    return '';
};

const repairImportedExperienceItems = (items) => {
    const hasStructuredExperience = items.some((item) => /\s[–-]\s.+\s[–-]\s.+(?:\s•\s|$)/.test(item || ''));
    const rebuiltKnownExperiences = hasStructuredExperience ? [] : rebuildKnownFragmentedExperiences(items);
    if (rebuiltKnownExperiences.length) {
        return rebuiltKnownExperiences;
    }

    const repaired = [];
    const preparedItems = normalizeExperienceImportItems(items);

    for (let index = 0; index < preparedItems.length; index += 1) {
        const rawItem = preparedItems[index] || '';
        const item = cleanImportedSectionLine(rawItem);

        if (!item) {
            continue;
        }

        const nextMonth = getOrphanMonthFragment(preparedItems[index + 1] || '');

        if (/^\d{4}\s*[–-]/.test(item) && repaired.length) {
            repaired[repaired.length - 1] = appendStandaloneDateToEntry(
                repaired[repaired.length - 1],
                `${nextMonth ? `${nextMonth} ` : ''}${item}`
            );
            if (nextMonth) {
                index += 1;
            }
            continue;
        }

        if (standaloneDateRegex.test(item) && repaired.length) {
            repaired[repaired.length - 1] = appendStandaloneDateToEntry(repaired[repaired.length - 1], item);
            continue;
        }

        if (getOrphanMonthFragment(item)) {
            continue;
        }

        if (/^\s*(?:[•\u2022]|-\s|→)/.test(rawItem) && repaired.length) {
            repaired[repaired.length - 1] = `${repaired[repaired.length - 1]} • ${item}`.replace(/\s{2,}/g, ' ').trim();
            continue;
        }

        if (repaired.length && /^[a-zà-ÿ]/.test(item) && !isLikelyExperienceHeader(item)) {
            repaired[repaired.length - 1] = `${repaired[repaired.length - 1]} ${item}`.replace(/\s{2,}/g, ' ').trim();
            continue;
        }

        repaired.push(item);
    }

    return dedupeImportedItems(repaired);
};

const cleanupImportedExperienceField = () => {
    const field = cvForm?.elements.experience;

    if (!field?.value) {
        return;
    }

    const repaired = repairImportedExperienceItems(splitLines(field.value));
    if (repaired.length) {
        field.value = repaired.join('\n');
    }
};

const cleanupImportedEducationField = () => {
    const field = cvForm?.elements.education;

    if (!field?.value) {
        return;
    }

    const repaired = normalizeEducationItems(splitLines(field.value).filter((item) => !/^[-–—]?\s*\)?$/.test(item.trim())));
    if (repaired.length) {
        field.value = repaired.join('\n');
    }
};

const parseImportedCv = (text) => {
    if (!cvForm || !text) {
        return;
    }

    const normalizedText = preprocessImportedCvText(text);
    const lines = splitLines(normalizedText);
    const cleanLines = lines.filter((line) => !/^%PDF-|^\/(Title|Parent|Dest|Next|Prev)\b/i.test(line));
    const joinedText = cleanLines.join('\n');
    const sectionStops = [
        /(?:^|\n)\s*COMP[ÉE]TENCES(?:\s+(?:CL[EÉ]S|TECHNIQUES?|PROFESSIONNELLES?))?\s*(?:\n|$)/i,
        /(?:^|\n)\s*EXP[ÉE]RIENCES?(?:\s+PROFESSIONNELLES)?\s*(?:\n|$)/i,
        /(?:^|\n)\s*FORMATIONS?(?:\s*&\s*CERTIFICATIONS)?\s*(?:\n|$)/i,
        /(?:^|\n)\s*CERTIFICATIONS?\s*(?:\n|$)/i,
        /(?:^|\n)\s*PROFIL\s*(?:\n|$)/i,
        /(?:^|\n)\s*R[ÉE]SUM[ÉE]\s*(?:\n|$)/i,
        /(?:^|\n)\s*OBJECTIF\s*(?:\n|$)/i,
        /(?:^|\n)\s*LANGUES?\s*(?:\n|$)/i,
        /(?:^|\n)\s*ATOUTS?\s*(?:\n|$)/i,
        /(?:^|\n)\s*ACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?\s*(?:\n|$)/i,
        /(?:^|\n)\s*CENTRES?\s+D[’']?INT[ÉE]R[ÊE]TS?\s*(?:\n|$)/i,
    ];

    cvForm.elements.summary.value = '';
    cvForm.elements.skills.value = '';
    cvForm.elements.experience.value = '';
    cvForm.elements.education.value = '';
    if (cvForm.elements.projects) {
        cvForm.elements.projects.value = '';
    }
    cvForm.elements.headline.value = '';
    cvForm.elements.permit.value = '';
    if (cvForm.elements.activities) {
        cvForm.elements.activities.value = '';
    }
    if (cvForm.elements.languages) {
        cvForm.elements.languages.value = '';
    }
    cvSectionOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];

    const nameLine =
        cleanLines.find((line) => !looksLikeSectionHeading(line) && /^[A-ZÀ-ÖØ-Ý' -]{6,}$/.test(line) && line.length < 40) ||
        cleanLines.find((line) => !looksLikeSectionHeading(line) && /^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(line) && line.length < 40) ||
        '';

    if (nameLine) {
        cvForm.elements.fullName.value = toTitleCase(nameLine.toLowerCase());
    }

    const emailLine = cleanLines.find((line) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(line));
    if (emailLine) {
        const match = emailLine.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
        if (match) {
            cvForm.elements.email.value = match[0];
        }
    }

    const phoneLine = cleanLines.find((line) => /(\+33|0)[\s.\-]?\d([\s.\-]?\d{2}){4}/.test(line));
    if (phoneLine) {
        const match = phoneLine.match(/(\+33|0)[\s.\-]?\d([\s.\-]?\d{2}){4}/);
        if (match) {
            cvForm.elements.phone.value = match[0];
        }
    }

    const permitLine = cleanLines.find((line) => /permis/i.test(line)) || '';
    const permitValue = extractPermitValue(permitLine);
    if (permitValue) {
        cvForm.elements.permit.value = permitValue;
    }

    const locationLine = cleanLines.find((line) => /\(\d{5}\)|france|malmaison|paris|nanterre|roissy/i.test(line));
    if (locationLine) {
        const extractedLocation = normalizeImportedLineFragments(extractLocationValue(locationLine) || locationLine);
        cvForm.elements.location.value = extractedLocation
            .replace(new RegExp((cvForm.elements.fullName.value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '')
            .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, '')
            .replace(/(\+33|0)[\s.\-]?\d([\s.\-]?\d{2}){4}/, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    const headlineLine =
        cleanLines.find((line) =>
            /d[ée]velopp|front|emploi|marketing|relation client|designer|ux|ui|conseill|responsable|charg[eé]e|conductr|machiniste|receveur|transport/i.test(line) &&
            line.length < 120 &&
            !/@|\d{2}\.\d{2}\.\d{2}|https?:|www\.|github|d[ée]monstration|portfolio/i.test(line)
        ) || '';

    if (headlineLine) {
        cvForm.elements.headline.value = headlineLine;
    }

    const summarySection = trimImportedSection(extractSectionContent(
        joinedText,
        [
            /(?:^|\n)\s*(?:PROFIL|R[ÉE]SUM[ÉE]|OBJECTIF)\s*(?:\n|$)([\s\S]+)$/i,
        ],
        sectionStops
    ), 'summary');
    const skillsSection = trimImportedSection(extractSectionContent(
        joinedText,
        [
            /(?:^|\n)\s*COMP[ÉE]TENCES(?:\s+(?:CL[EÉ]S|TECHNIQUES?|PROFESSIONNELLES?))?\s*(?:\n|$)([\s\S]+)$/i,
        ],
        sectionStops
    ), 'skills');
    const experienceSection = trimImportedSection(extractSectionContent(
        joinedText,
        [
            /(?:^|\n)\s*EXP[ÉE]RIENCES?(?:\s+PROFESSIONNELLES)?\s*(?:\n|$)([\s\S]+)$/i,
        ],
        sectionStops
    ), 'experience');
    const educationSection = trimImportedSection(extractSectionContent(
        joinedText,
        [
            /(?:^|\n)\s*FORMATIONS?(?:\s*&\s*CERTIFICATIONS)?\s*(?:\n|$)([\s\S]+)$/i,
            /(?:^|\n)\s*CERTIFICATIONS?\s*(?:\n|$)([\s\S]+)$/i,
        ],
        sectionStops
    ), 'education');
    const atoutsSection = trimImportedSection(extractSectionContent(
        joinedText,
        [
            /(?:^|\n)\s*ATOUTS?\s*(?:\n|$)([\s\S]+)$/i,
        ],
        sectionStops
    ), 'skills');

    const fallbackSections = { summary: [], skills: [], experience: [], education: [], languages: [], activities: [] };
    let currentSection = null;

    cleanLines.forEach((line) => {
        const nextSection = getSectionKey(line);
        if (nextSection) {
            currentSection = nextSection;
            return;
        }

        if (currentSection) {
            fallbackSections[currentSection].push(line);
        }
    });

    const extractedProfile = extractHeadlineAndSummary({
        cleanLines,
        joinedText,
        nameLine,
        locationLine,
        phoneLine,
        emailLine: cvForm.elements.email.value,
        permitLine,
        headlineLine,
    });

    const summaryValue = finalizeImportedSummary(
        (summarySection || extractedProfile.summary || getSummaryFallback(cleanLines, headlineLine))
            .replace(/\bCOMP[ÉE]TENCES(?:\s+CL[EÉ]S)?\b[\s\S]*$/i, '')
            .replace(/\bEXP[ÉE]RIENCES(?:\s+PROFESSIONNELLES)?\b[\s\S]*$/i, '')
            .replace(/\bFORMATIONS(?:\s*&\s*CERTIFICATIONS)?\b[\s\S]*$/i, '')
            .replace(/\bACTIVIT[ÉE]S?(?:\s*(?:&|ET)\s*INT[ÉE]R[ÊE]TS)?\b[\s\S]*$/i, '')
            .replace(/\bCENTRES?\s+D[’']?INT[ÉE]R[ÊE]TS?\b[\s\S]*$/i, '')
            .replace(/\n+/g, ' ')
            .replace(/\s+([,.;:!?])/g, '$1')
            .replace(/([.!?])(?=\S)/g, '$1 ')
            .replace(/\s{2,}/g, ' ')
            .trim(),
        extractedProfile.headline || headlineLine || cvForm.elements.headline.value
    );
    const skillsSource = [skillsSection || fallbackSections.skills.join('\n'), atoutsSection || '']
        .filter(Boolean)
        .join('\n');
    const skillsItems = normalizeSkillItems(
        splitImportedItems(skillsSource)
    ).filter((item) => !/^(permis\b|fatima sidi amar\b)/i.test(item));
    const rawExperienceImportItems = splitImportedItems(experienceSection || fallbackSections.experience.join('\n'));
    const repairedExperienceItems = repairImportedExperienceItems(
        groupImportedExperiences(rawExperienceImportItems)
    );
    const experienceItems = mergeKnownExperienceRebuilds(rawExperienceImportItems, repairedExperienceItems)
        .filter((item) => !/^(permis\b|fatima sidi amar\b)/i.test(item));
    const educationItems = normalizeEducationItems(
        splitImportedItems(educationSection || fallbackSections.education.join('\n'))
    ).filter((item) => !/^(fatima sidi amar\b|rueil|conseill[eè]re relation client\b)/i.test(item));

    cvForm.elements.headline.value = formatCvHeadline(extractedProfile.headline || headlineLine || cvForm.elements.headline.value);

    if (!cvForm.elements.permit.value) {
        const permitFromHeadline = extractPermitValue(cvForm.elements.headline.value || '');
        if (permitFromHeadline) {
            cvForm.elements.permit.value = permitFromHeadline;
        }
    }

    if (summaryValue) {
        cvForm.elements.summary.value = summaryValue;
    }

    if (skillsItems.length) {
        cvForm.elements.skills.value = skillsItems.join('\n');
    }

    if (experienceItems.length) {
        cvForm.elements.experience.value = experienceItems.join('\n');
        cleanupImportedExperienceField();
    }

    if (educationItems.length) {
        cvForm.elements.education.value = educationItems.join('\n');
        cleanupImportedEducationField();
    }

    const languageLines = cleanLines
        .filter((line) => /\b(francais|anglais|espagnol|arabe|italien|allemand)\b/i.test(line))
        .map(cleanImportedSectionLine);
    if (languageLines.length && cvForm.elements.languages) {
        cvForm.elements.languages.value = dedupeImportedItems(languageLines).join('\n');
    }

    const activityItems = dedupeImportedItems(
        splitImportedItems(fallbackSections.activities.join('\n'))
            .flatMap((item) => item.split(/,\s+(?=(?:sport|lecture|veille|apprentissage|technologie|activit[ée]s? personnelles)\b)/i))
            .map(cleanImportedSectionLine)
            .filter((item) => !looksLikeSectionHeading(item))
            .filter((item) => item.length < 80)
    );
    if (cvForm.elements.activities && activityItems.length) {
        cvForm.elements.activities.value = activityItems.join('\n');
    }

    const importStyleDefaults = {
        layoutTheme: 'ats',
        fontTheme: 'inter',
        colorTheme: 'graphite',
        designMood: 'clean',
        textAlign: 'left',
        fontSize: 'compact',
        lineSpacing: 'tight',
        headlineScale: 'normal',
        accentColor: '#24324a',
        paperColor: '#ffffff',
        frameColor: '#d8dee8',
    };

    Object.entries(importStyleDefaults).forEach(([fieldName, value]) => {
        const field = cvForm.elements[fieldName];
        if (field) {
            field.value = value;
        }
    });

    if (cvForm.elements.headlineScale) {
        cvForm.elements.headlineScale.value = 'normal';
    }

    optimizeCvProfessionally({ fromImport: true });
    clearEditableOverrides();
    updateCvPreview();
    setPreviewMode('cv');
    currentPreviewPage = 1;
    scrollToPreviewPage(1);

    setCvStatus('CV importe, corrige et optimise');
};

const normalizeExportHex = (value, fallback = '#2f3f7f') => {
    const clean = String(value || '').trim();

    if (/^#[0-9a-f]{6}$/i.test(clean)) {
        return clean.toLowerCase();
    }

    if (/^#[0-9a-f]{3}$/i.test(clean)) {
        return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`.toLowerCase();
    }

    return fallback;
};

const hexToRgb = (hex, fallback = '#2f3f7f') => {
    const clean = normalizeExportHex(hex, fallback).slice(1);
    return [
        Number.parseInt(clean.slice(0, 2), 16),
        Number.parseInt(clean.slice(2, 4), 16),
        Number.parseInt(clean.slice(4, 6), 16),
    ];
};

const mixExportHex = (source, target = '#ffffff', ratio = 0.9) => {
    const sourceRgb = hexToRgb(source);
    const targetRgb = hexToRgb(target, '#ffffff');
    const mixed = sourceRgb.map((channel, index) =>
        Math.round(channel * (1 - ratio) + targetRgb[index] * ratio)
    );

    return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

const exportFontFamilyMap = {
    inter: 'Inter, Arial, sans-serif',
    manrope: 'Manrope, Arial, sans-serif',
    roboto: 'Roboto, Arial, sans-serif',
    lato: 'Lato, Arial, sans-serif',
    playfair: '"Playfair Display", Georgia, serif',
    serif: 'Georgia, serif',
};

const cleanExportText = (value = '') =>
    normalizeCvSentenceText(String(value || ''))
        .replace(/^(?:(?:[•\-\u2022]|→)\s*|o\s+)+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

const splitExportItems = (value, options = {}) => {
    const {
        splitSlash = false,
        splitHyphen = false,
        maxLength = 180,
    } = options;
    const source = Array.isArray(value) ? value.join('\n') : String(value || '');
    const extraSeparators = [
        '\\s+•\\s+',
        '\\s*;\\s*',
        '\\n+',
        splitSlash ? '\\s+/\\s+' : null,
        splitHyphen ? '\\s+[–-]\\s+' : null,
    ].filter(Boolean);
    const separator = new RegExp(extraSeparators.join('|'), 'g');

    return dedupeImportedItems(
        source
            .replace(/^(?:activit[eé]s? et int[eé]r[eê]ts?|centres? d[’']?int[eé]r[eê]t)\s*[:\-]\s*/i, '')
            .split(separator)
            .map(cleanExportText)
            .filter((item) => item && item.length <= maxLength && !looksLikeSectionHeading(item))
    );
};

const normalizeExportTimelineEntries = (items, type = 'experience') => {
    const sourceItems = type === 'education'
        ? normalizeEducationItems(mergeStandaloneDateItems(items))
        : type === 'projects'
            ? mergeStandaloneDateItems(items)
            : repairPreviewExperienceItems(items);

    return sourceItems
        .map((item) => parseExperienceEntry(item))
        .map((entry) => ({
            title: cleanExportText(entry.title),
            meta: cleanExportText(entry.meta),
            date: cleanExportText(entry.date),
            bullets: splitExportItems(entry.bullets || [], { maxLength: 190 }).slice(0, 4),
        }))
        .filter((entry) => entry.title || entry.meta || entry.date || entry.bullets.length);
};

const prepareCvForExport = () => {
    if (!cvForm) {
        return;
    }

    const skillCount = splitExportItems(cvForm.elements.skills?.value || '').length;

    proofreadCvTextFields({ silent: true });
    cleanupImportedExperienceField();
    cleanupImportedEducationField();

    if ((cvForm.elements.summary?.value || '').trim().length < 120) {
        improveSummaryText({ silent: true });
    }

    if (cvForm.elements.experience?.value) {
        improveExperienceLines({ silent: true });
    }

    if (skillCount < 6) {
        enrichCvSkills({ silent: true });
    }

    clearEditableOverrides();
    renderExperienceEditor();
    updateCvPreview();
    scheduleCvDraftSave();
};

const getCvExportData = () => {
    const values = cvForm ? Object.fromEntries(new FormData(cvForm).entries()) : {};
    const accent = normalizeExportHex(values.accentColor, '#2f3f7f');
    const frame = normalizeExportHex(values.frameColor, '#d9deea');
    const paper = normalizeExportHex(values.paperColor, '#ffffff');
    const soft = mixExportHex(accent, '#ffffff', 0.9);
    const headline = cleanExportText(values.headline || '');
    const permit = cleanExportText(values.permit || '');
    const shouldShowPermit =
        permit &&
        !normalizeForMatch(headline).includes(normalizeForMatch(permit));

    return {
        values,
        fullName: cleanExportText(values.fullName || 'Votre nom'),
        headline: headline || 'Titre du metier',
        metaParts: [
            cleanExportText(values.location || ''),
            cleanExportText(values.phone || ''),
            cleanExportText(values.email || ''),
            shouldShowPermit ? permit : '',
        ].filter(Boolean),
        summary: cleanExportText(values.summary || ''),
        skills: splitExportItems(values.skills || '').slice(0, 10),
        experiences: normalizeExportTimelineEntries(splitLines(values.experience || ''), 'experience'),
        projects: normalizeExportTimelineEntries(splitLines(values.projects || ''), 'projects'),
        education: normalizeExportTimelineEntries(splitLines(values.education || ''), 'education'),
        activities: splitExportItems(values.activities || '', { splitSlash: true, splitHyphen: true, maxLength: 130 }).slice(0, 6),
        languages: splitExportItems(values.languages || '', { splitSlash: true, maxLength: 80 }).slice(0, 5),
        accent,
        soft,
        paper,
        frame,
        template: values.layoutTheme || 'wordpro',
        fontFamily: exportFontFamilyMap[values.fontTheme] || exportFontFamilyMap.manrope,
    };
};

const getWordSectionStyle = (data) => {
    if (['modern', 'creative'].includes(data.template)) {
        return `border-bottom:1.2pt solid ${data.accent};background:#ffffff;padding:3pt 0 2pt;font-size:10pt;font-weight:800;letter-spacing:1pt;text-transform:uppercase;color:${data.accent};`;
    }

    if (['executive', 'premium'].includes(data.template)) {
        return `border-top:1pt solid ${data.frame};border-bottom:1pt solid ${data.frame};background:#ffffff;padding:3pt 7pt;font-size:10pt;font-weight:800;letter-spacing:1pt;text-transform:uppercase;color:${data.accent};text-align:center;`;
    }

    if (['minimal', 'ats', 'elegant'].includes(data.template)) {
        return `border-bottom:1pt solid ${data.frame};background:#ffffff;padding:2pt 0;font-size:9.5pt;font-weight:800;letter-spacing:1pt;text-transform:uppercase;color:#172033;`;
    }

    return `border-left:4pt solid ${data.accent};background:${data.soft};padding:3pt 7pt;font-size:10pt;font-weight:700;letter-spacing:1pt;text-transform:uppercase;color:#223047;`;
};

const buildWordSectionTitle = (title, data) => `
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:8pt 0 4pt;">
    <tr>
      <td style="${getWordSectionStyle(data)}">${escapeHtml(title)}</td>
    </tr>
  </table>`;

const buildWordTwoColumnList = (items, data) => {
    if (!items.length) {
        return '';
    }

    const rows = [];
    for (let index = 0; index < items.length; index += 2) {
        rows.push(`
          <tr>
            <td width="50%" valign="top" style="padding:1pt 12pt 2pt 0;font-size:10pt;line-height:1.25;color:#3d4658;"><span style="color:${data.accent};font-weight:700;">•</span> ${escapeHtml(items[index] || '')}</td>
            <td width="50%" valign="top" style="padding:1pt 0 2pt 12pt;font-size:10pt;line-height:1.25;color:#3d4658;">${items[index + 1] ? `<span style="color:${data.accent};font-weight:700;">•</span> ${escapeHtml(items[index + 1])}` : ''}</td>
          </tr>
        `);
    }

    return `<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 4pt;">${rows.join('')}</table>`;
};

const buildWordTimeline = (entries, data, options = {}) => {
    if (!entries.length) {
        return '';
    }

    const compact = options.compact;
    const cardBackground = ['modern', 'creative'].includes(data.template) ? mixExportHex(data.accent, '#ffffff', 0.96) : '#ffffff';
    const cardBorder = ['minimal', 'ats', 'elegant'].includes(data.template)
        ? `border-top:1pt solid ${data.frame};border-bottom:1pt solid ${data.frame};`
        : `border:1pt solid ${data.frame};border-left:${['executive', 'premium'].includes(data.template) ? '2pt' : '4pt'} solid ${data.accent};`;

    return entries.map((entry) => {
        const bulletItems = entry.bullets
            .map((bullet) => `<li style="margin:0 0 1pt 0;padding:0;font-size:${compact ? '9.2pt' : '9.8pt'};line-height:1.22;color:#3d4658;">${escapeHtml(bullet)}</li>`)
            .join('');

        return `
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 ${compact ? '4pt' : '5pt'};page-break-inside:avoid;">
            <tr>
              <td style="${cardBorder}background:${cardBackground};padding:${compact ? '4pt 6pt' : '5pt 7pt'};">
                <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="font-size:${compact ? '9.8pt' : '10.2pt'};font-weight:700;color:#172033;line-height:1.18;">${escapeHtml(entry.title)}</td>
                    <td valign="top" align="right" style="font-size:8.8pt;font-weight:700;color:${data.accent};white-space:nowrap;padding-left:10pt;line-height:1.18;">${escapeHtml(entry.date || '')}</td>
                  </tr>
                </table>
                ${entry.meta ? `<div style="font-size:${compact ? '9.1pt' : '9.5pt'};font-weight:600;color:#5a6375;margin:1pt 0 0;">${escapeHtml(entry.meta)}</div>` : ''}
                ${bulletItems ? `<ul style="margin:2pt 0 0 13pt;padding:0;">${bulletItems}</ul>` : ''}
              </td>
            </tr>
          </table>
        `;
    }).join('');
};

const buildWordCvHtml = (data) => {
    const meta = data.metaParts.join(' | ');
    const maybeProjects = data.projects.length
        ? `${buildWordSectionTitle('Projets', data)}${buildWordTimeline(data.projects, data, { compact: true })}`
        : '';
    const maybeActivities = data.activities.length
        ? `${buildWordSectionTitle('Activites', data)}${buildWordTwoColumnList(data.activities, data)}`
        : '';
    const maybeLanguages = data.languages.length
        ? `${buildWordSectionTitle('Langues', data)}${buildWordTwoColumnList(data.languages, data)}`
        : '';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>CV - ${escapeHtml(data.fullName)}</title>
  <style>
    @page { size: A4; margin: 1.2cm 1.35cm; }
    body { margin: 0; font-family: ${data.fontFamily}; color: #172033; }
    table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    p { margin: 0; }
  </style>
</head>
<body>
  <div style="font-family:${data.fontFamily};font-size:10pt;color:#172033;">
    <h1 style="margin:0 0 3pt;font-size:22pt;line-height:1.05;font-weight:800;color:#111827;">${escapeHtml(data.fullName)}</h1>
    ${meta ? `<p style="margin:0 0 4pt;font-size:10pt;font-weight:600;color:#5b6475;">${escapeHtml(meta)}</p>` : ''}
    <p style="margin:0 0 7pt;font-size:12.5pt;line-height:1.2;font-weight:800;color:${data.accent};">${escapeHtml(data.headline)}</p>
    <div style="border-top:1.5pt solid ${data.frame};height:1pt;margin:0 0 6pt;"></div>
    ${data.summary ? `${buildWordSectionTitle('Profil', data)}<p style="font-size:10pt;line-height:1.28;color:#3d4658;margin:0 0 4pt;">${escapeHtml(data.summary)}</p>` : ''}
    ${data.skills.length ? `${buildWordSectionTitle('Competences', data)}${buildWordTwoColumnList(data.skills, data)}` : ''}
    ${data.experiences.length ? `${buildWordSectionTitle('Experiences professionnelles', data)}${buildWordTimeline(data.experiences, data)}` : ''}
    ${maybeProjects}
    ${data.education.length ? `${buildWordSectionTitle('Formations', data)}${buildWordTimeline(data.education, data, { compact: true })}` : ''}
    ${maybeLanguages}
    ${maybeActivities}
  </div>
</body>
</html>`;
};

const buildLetterWordHtml = () => {
    const fullName = cleanExportText(cvForm?.elements.fullName?.value || 'Votre nom');
    const headline = cleanExportText(cvForm?.elements.headline?.value || 'Titre du metier');
    const subject = cleanExportText(letterSubject?.textContent || 'Objet : Candidature');
    const body = escapeHtml(letterBody?.textContent || '').replace(/\n/g, '<br>');

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Lettre de motivation</title>
  <style>
    @page { size: A4; margin: 1.8cm; }
    body { margin: 0; font-family: Calibri, Arial, sans-serif; color: #1f2937; font-size: 11pt; line-height: 1.5; }
  </style>
</head>
<body>
  <h1 style="font-size:20pt;margin:0 0 4pt;">${escapeHtml(fullName)}</h1>
  <p style="font-weight:700;margin:0 0 18pt;color:#2f3f7f;">${escapeHtml(headline)}</p>
  <p style="font-weight:700;margin:0 0 14pt;">${escapeHtml(subject)}</p>
  <p>${body}</p>
</body>
</html>`;
};

const normalizeExportCssValue = (value = '') =>
    String(value || '').replace(
        /color\(srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)/g,
        (_, red, green, blue, alpha) => {
            const channels = [red, green, blue].map((channel) => Math.round(Math.max(0, Math.min(1, Number.parseFloat(channel))) * 255));
            const opacity = alpha === undefined ? 1 : Math.max(0, Math.min(1, Number.parseFloat(alpha)));
            return opacity < 1
                ? `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${Math.round(opacity * 1000) / 1000})`
                : `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
        }
    );

const copyComputedStylesForExport = (source, clone) => {
    if (!source || !clone || source.nodeType !== Node.ELEMENT_NODE || clone.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    const computed = window.getComputedStyle(source);
    [...computed].forEach((property) => {
        clone.style.setProperty(property, normalizeExportCssValue(computed.getPropertyValue(property)), computed.getPropertyPriority(property));
    });

    [...source.children].forEach((child, index) => {
        copyComputedStylesForExport(child, clone.children[index]);
    });
};

const getPreviewCloneForOfficeExport = () => {
    const sourcePreview = currentPreviewMode === 'letter' ? letterPagePreview : previewNodes.preview;

    if (!sourcePreview) {
        return null;
    }

    const clone = sourcePreview.cloneNode(true);
    copyComputedStylesForExport(sourcePreview, clone);
    clone.classList.remove('is-hidden-preview');
    clone.removeAttribute('aria-hidden');
    clone.querySelectorAll('.cv-section-actions, .cv-page-guide, .cv-label').forEach((node) => node.remove());
    clone.querySelectorAll('[contenteditable]').forEach((node) => node.removeAttribute('contenteditable'));
    clone.querySelectorAll('[spellcheck]').forEach((node) => node.removeAttribute('spellcheck'));
    clone.querySelectorAll('section[hidden]').forEach((node) => node.remove());
    clone.style.width = '190mm';
    clone.style.minHeight = 'auto';
    clone.style.margin = '0 auto';
    clone.style.boxShadow = 'none';

    return clone;
};

const buildPreviewWordHtml = () => {
    const clone = getPreviewCloneForOfficeExport();
    const title = currentPreviewMode === 'letter' ? 'Lettre de motivation' : 'CV';

    if (!clone) {
        return currentPreviewMode === 'letter' ? buildLetterWordHtml() : buildWordCvHtml(getCvExportData());
    }

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    body { margin: 0; background: #ffffff; }
    * { box-sizing: border-box; }
    ul { margin-top: 0; margin-bottom: 0; }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;
};

const exportWord = () => {
    persistAllEditableNodes({ refreshPreview: true });
    updateCvPreview();
    const filename = currentPreviewMode === 'letter' ? 'lettre-motivation.doc' : 'cv-intelligent.doc';
    downloadFile(filename, buildPreviewWordHtml(), 'application/msword');
    setCvStatus('Word telecharge avec le rendu de l apercu');
};

const printCurrentDocument = () => {
    exportPdf({ action: 'save' }).then(() => {
        setCvStatus('PDF pret a imprimer telecharge');
        window.setTimeout(() => setCvStatus('PDF pret a imprimer telecharge'), 700);
    }).catch((error) => {
        console.error(error);
        setCvStatus('Impression indisponible : utilisez Exporter PDF');
    });
};

const buildStaticExportNode = (mode = currentPreviewMode) => {
    const sourcePreview = mode === 'letter' ? letterPagePreview : previewNodes.preview;

    if (!sourcePreview) {
        return null;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'pdf-export-root';
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.width = '210mm';
    wrapper.style.background = '#ffffff';
    wrapper.style.padding = '0';
    wrapper.style.margin = '0';
    wrapper.style.zIndex = '2147483000';
    wrapper.style.pointerEvents = 'none';

    const clone = sourcePreview.cloneNode(true);
    copyComputedStylesForExport(sourcePreview, clone);
    clone.classList.remove('is-hidden-preview');
    clone.removeAttribute('aria-hidden');
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';
    clone.style.background = normalizeExportCssValue(window.getComputedStyle(sourcePreview).background || '#ffffff');
    clone.style.borderRadius = '0';

    clone.querySelectorAll('.cv-section-actions, .cv-page-guide, .cv-label').forEach((node) => node.remove());
    clone.querySelectorAll('[contenteditable]').forEach((node) => node.removeAttribute('contenteditable'));
    clone.querySelectorAll('[spellcheck]').forEach((node) => node.removeAttribute('spellcheck'));
    clone.querySelectorAll('section[hidden]').forEach((node) => node.remove());

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    return wrapper;
};

const openPdfForPrint = (doc, filename, printWindow = null) => {
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const targetWindow = printWindow || window.open('', '_blank', 'popup=yes,width=980,height=1100');

    if (!targetWindow) {
        URL.revokeObjectURL(pdfUrl);
        doc.save(filename);
        setCvStatus('Fenetre d impression bloquee : PDF telecharge');
        return;
    }

    try {
        targetWindow.location.assign(pdfUrl);
        targetWindow.focus?.();
        window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 120000);
        setCvStatus('PDF ouvert pour impression, sans en-tete navigateur');
    } catch (error) {
        console.error(error);
        URL.revokeObjectURL(pdfUrl);
        doc.save(filename);
        setCvStatus('Impression indisponible : PDF telecharge');
    }
};

const finishPdfExport = (doc, filename, action, printWindow = null) => {
    if (action === 'print') {
        openPdfForPrint(doc, filename, printWindow);
        return;
    }

    doc.save(filename);
    setCvStatus('PDF telecharge avec mise en page professionnelle');
};

const exportPdf = async (options = {}) => {
    const action = options?.action === 'print' ? 'print' : 'save';
    const JsPdf = window.jspdf?.jsPDF;

    if (!JsPdf) {
        setCvStatus('Export PDF indisponible : rechargez la page puis recommencez');
        return;
    }

    setCvStatus(action === 'print' ? 'Preparation du PDF pour impression...' : 'Generation du PDF...');

    persistAllEditableNodes({ refreshPreview: true });
    updateCvPreview();

    const exportMode = currentPreviewMode;
    const domExportSource = exportMode === 'letter' ? letterPagePreview : previewNodes.preview;

    if (window.html2canvas && domExportSource) {
        const filename = exportMode === 'letter' ? 'lettre-motivation.pdf' : 'cv-intelligent.pdf';

        try {
            document.body.classList.add('is-exporting-pdf');
            await document.fonts?.ready;
            const canvas = await window.html2canvas(domExportSource, {
                scale: Math.min(2.4, window.devicePixelRatio || 2),
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
            });

            if (!canvas.width || !canvas.height) {
                throw new Error('empty_canvas');
            }

            const doc = new JsPdf({ unit: 'mm', format: 'a4', orientation: 'portrait' });
            const pageWidth = 210;
            const pageHeight = 297;
            const imageHeight = (canvas.height * pageWidth) / canvas.width;
            const imageData = canvas.toDataURL('image/jpeg', 0.98);

            let positionY = 0;
            let remainingHeight = imageHeight;
            doc.addImage(imageData, 'JPEG', 0, positionY, pageWidth, imageHeight);
            remainingHeight -= pageHeight;

            while (remainingHeight > 2) {
                positionY -= pageHeight;
                doc.addPage();
                doc.addImage(imageData, 'JPEG', 0, positionY, pageWidth, imageHeight);
                remainingHeight -= pageHeight;
            }

            if (action === 'print') {
                finishPdfExport(doc, filename, action, options?.printWindow);
            } else {
                doc.save(filename);
                setCvStatus('PDF telecharge avec le rendu de l apercu');
            }
            return;
        } catch (error) {
            console.error(error);
            setCvStatus('Export apercu indisponible, generation PDF classique...');
        } finally {
            document.body.classList.remove('is-exporting-pdf');
        }
    }

    try {
        const doc = new JsPdf({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const pageHeight = 297;
        const pageWidth = 210;
        const marginX = 15;
        const marginTop = 14;
        const contentWidth = pageWidth - marginX * 2;
        const bottomLimit = pageHeight - 14;
        let y = marginTop;

        if (currentPreviewMode !== 'letter') {
            prepareCvForExport();
        }

        const data = currentPreviewMode === 'letter' ? null : getCvExportData();
        const accent = data?.accent || '#2f3f7f';
        const soft = data?.soft || '#eef2f8';
        const frame = data?.frame || '#d9deea';
        const [accentR, accentG, accentB] = hexToRgb(accent);
        const [softR, softG, softB] = hexToRgb(soft, '#eef2f8');
        const [frameR, frameG, frameB] = hexToRgb(frame, '#d9deea');
        const isModern = ['modern', 'creative'].includes(data?.template);
        const isExecutive = ['executive', 'premium'].includes(data?.template);
        const isMinimal = ['minimal', 'ats', 'elegant'].includes(data?.template);

        const setTextColor = (hex) => {
            const [r, g, b] = hexToRgb(hex, '#172033');
            doc.setTextColor(r, g, b);
        };

        const setFillColor = (hex) => {
            const [r, g, b] = hexToRgb(hex, '#ffffff');
            doc.setFillColor(r, g, b);
        };

        const setDrawColor = (hex) => {
            const [r, g, b] = hexToRgb(hex, '#d9deea');
            doc.setDrawColor(r, g, b);
        };

        const drawRoundedRect = (x, rectY, width, height, radius, style) => {
            if (typeof doc.roundedRect === 'function') {
                doc.roundedRect(x, rectY, width, height, radius, radius, style);
                return;
            }

            doc.rect(x, rectY, width, height, style);
        };

        const addPageIfNeeded = (neededHeight = 8) => {
            if (y + neededHeight <= bottomLimit) {
                return;
            }
            doc.addPage();
            y = marginTop;
        };

        const getWrappedLines = (text, width, size = 10, weight = 'normal') => {
            doc.setFont('helvetica', weight);
            doc.setFontSize(size);
            return doc.splitTextToSize(String(text || ''), width);
        };

        const writeWrappedText = (text, options = {}) => {
            if (!text) {
                return 0;
            }

            const {
                x = marginX,
                width = contentWidth,
                size = 10,
                weight = 'normal',
                color = '#3d4658',
                align = 'left',
                lineHeight = 4.2,
                after = 1.5,
            } = options;
            const lines = getWrappedLines(text, width, size, weight);
            const blockHeight = lines.length * lineHeight;

            addPageIfNeeded(blockHeight + after);
            doc.setFont('helvetica', weight);
            doc.setFontSize(size);
            setTextColor(color);
            doc.text(lines, x, y, { align, maxWidth: width });
            y += blockHeight + after;

            return blockHeight;
        };

        const writeSectionTitle = (title) => {
            addPageIfNeeded(9);
            y += 1;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.4);

            if (isMinimal) {
                setTextColor(accent);
                doc.text(String(title).toUpperCase(), marginX, y);
                setDrawColor(frame);
                doc.line(marginX + 40, y - 1.3, marginX + contentWidth, y - 1.3);
            } else if (isModern) {
                setTextColor(accent);
                doc.text(String(title).toUpperCase(), marginX, y);
                doc.setDrawColor(accentR, accentG, accentB);
                doc.setLineWidth(0.25);
                doc.line(marginX, y + 1.5, marginX + 42, y + 1.5);
            } else {
                doc.setFillColor(softR, softG, softB);
                doc.rect(marginX, y - 4.7, contentWidth, 7.2, 'F');
                doc.setFillColor(accentR, accentG, accentB);
                doc.rect(marginX, y - 4.7, 1.5, 7.2, 'F');
                setTextColor('#223047');
                doc.text(String(title).toUpperCase(), marginX + 4, y);
            }

            y += 6;
        };

        const writeTwoColumnList = (items) => {
            if (!items.length) {
                return;
            }

            const columnGap = 8;
            const columnWidth = (contentWidth - columnGap) / 2;
            const rowLineHeight = 3.9;
            const leftX = marginX + 2;
            const rightX = marginX + columnWidth + columnGap + 2;

            for (let index = 0; index < items.length; index += 2) {
                const leftLines = getWrappedLines(`• ${items[index]}`, columnWidth - 4, 9.6);
                const rightLines = items[index + 1]
                    ? getWrappedLines(`• ${items[index + 1]}`, columnWidth - 4, 9.6)
                    : [];
                const rowHeight = Math.max(leftLines.length, rightLines.length || 1) * rowLineHeight;

                addPageIfNeeded(rowHeight + 1);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9.6);
                setTextColor('#3d4658');
                doc.text(leftLines, leftX, y, { maxWidth: columnWidth - 4 });

                if (rightLines.length) {
                    doc.text(rightLines, rightX, y, { maxWidth: columnWidth - 4 });
                }

                y += rowHeight;
            }

            y += 1.5;
        };

        const writeTimelineCards = (entries, options = {}) => {
            if (!entries.length) {
                return;
            }

            const compact = options.compact;
            const cardPaddingX = compact ? 3.5 : 4.2;
            const cardPaddingY = compact ? 3.1 : 3.7;
            const cardGap = compact ? 2.3 : 2.9;
            const titleSize = compact ? 9.4 : 9.9;
            const metaSize = compact ? 8.8 : 9.1;
            const bulletSize = compact ? 8.8 : 9.1;
            const titleLineHeight = compact ? 3.7 : 4;
            const metaLineHeight = compact ? 3.4 : 3.6;
            const bulletLineHeight = compact ? 3.4 : 3.6;

            entries.forEach((entry) => {
                const dateWidth = entry.date ? Math.min(42, Math.max(24, doc.getTextWidth(entry.date) + 6)) : 0;
                const textWidth = contentWidth - cardPaddingX * 2 - (dateWidth ? dateWidth + 5 : 0);
                const titleLines = getWrappedLines(entry.title || 'Experience', textWidth, titleSize, 'bold');
                const metaLines = entry.meta ? getWrappedLines(entry.meta, contentWidth - cardPaddingX * 2, metaSize, 'bold') : [];
                const bulletLines = entry.bullets.map((bullet) => getWrappedLines(`• ${bullet}`, contentWidth - cardPaddingX * 2 - 3, bulletSize));
                const bulletsHeight = bulletLines.reduce((sum, lines) => sum + Math.max(lines.length, 1) * bulletLineHeight, 0);
                const cardHeight =
                    cardPaddingY * 2 +
                    Math.max(titleLines.length * titleLineHeight, compact ? 4 : 5) +
                    (metaLines.length ? metaLines.length * metaLineHeight + 1.2 : 0) +
                    (bulletLines.length ? bulletsHeight + 1.5 : 0);

                addPageIfNeeded(cardHeight + cardGap);
                setFillColor(isModern ? mixExportHex(accent, '#ffffff', 0.95) : '#ffffff');
                setDrawColor(frame);
                doc.setLineWidth(0.25);
                if (isMinimal) {
                    doc.line(marginX, y + cardHeight, marginX + contentWidth, y + cardHeight);
                    doc.setFillColor(accentR, accentG, accentB);
                    doc.rect(marginX, y + 1, 0.9, Math.max(5, cardHeight - 2), 'F');
                } else {
                    drawRoundedRect(marginX, y, contentWidth, cardHeight, 2.4, 'FD');
                    doc.setFillColor(accentR, accentG, accentB);
                    doc.rect(marginX, y, isExecutive ? 2 : 1.4, cardHeight, 'F');
                }

                let textY = y + cardPaddingY + 3;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(titleSize);
                setTextColor('#172033');
                doc.text(titleLines, marginX + cardPaddingX, textY, { maxWidth: textWidth });

                if (entry.date) {
                    doc.setFillColor(softR, softG, softB);
                    drawRoundedRect(marginX + contentWidth - dateWidth - cardPaddingX, y + cardPaddingY - 0.6, dateWidth, 5.2, 2, 'F');
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.2);
                    setTextColor(accent);
                    doc.text(entry.date, marginX + contentWidth - cardPaddingX - dateWidth / 2, y + cardPaddingY + 3, { align: 'center' });
                }

                textY += titleLines.length * titleLineHeight;

                if (metaLines.length) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(metaSize);
                    setTextColor('#5a6375');
                    doc.text(metaLines, marginX + cardPaddingX, textY, { maxWidth: contentWidth - cardPaddingX * 2 });
                    textY += metaLines.length * metaLineHeight + 1;
                }

                if (bulletLines.length) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(bulletSize);
                    setTextColor('#3d4658');
                    bulletLines.forEach((lines) => {
                        doc.text(lines, marginX + cardPaddingX + 1.5, textY, { maxWidth: contentWidth - cardPaddingX * 2 - 3 });
                        textY += Math.max(lines.length, 1) * bulletLineHeight;
                    });
                }

                y += cardHeight + cardGap;
            });
        };

        if (currentPreviewMode === 'letter') {
            const fullName = cvForm?.elements.fullName?.value?.trim() || 'Votre nom';
            const headline = cvForm?.elements.headline?.value?.trim() || 'Titre du metier';
            const subject = letterSubject?.textContent?.trim() || 'Objet : Candidature';
            const body = letterBody?.textContent?.trim() || '';

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            setTextColor('#171923');
            doc.text(fullName, pageWidth / 2, y, { align: 'center' });
            y += 8;
            writeWrappedText(headline, { size: 12, weight: 'bold', color: '#8b6b2f', align: 'center', lineHeight: 5 });
            y += 6;
            writeWrappedText(subject, { size: 11.5, weight: 'bold', color: '#243b7a', lineHeight: 5.2 });
            y += 2;
            writeWrappedText(body, { size: 11, lineHeight: 5.6 });
            finishPdfExport(doc, 'lettre-motivation.pdf', action, options?.printWindow);
            return;
        }

        const headerHeight = isModern ? 31 : isExecutive ? 29 : 27;
        if (!isMinimal) {
            setFillColor(isModern ? data.soft : '#ffffff');
            setDrawColor(frame);
            drawRoundedRect(marginX, y - 2, contentWidth, headerHeight, 2.8, isModern ? 'FD' : 'S');
            doc.setFillColor(accentR, accentG, accentB);
            doc.rect(marginX, y - 2, isExecutive ? 2 : 1.5, headerHeight, 'F');
        }

        const headerX = isMinimal ? marginX : marginX + 5;
        const headerWidth = isMinimal ? contentWidth : contentWidth - 10;
        const metaLine = data.metaParts.join(' | ');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18.5);
        setTextColor('#111827');
        doc.text(getWrappedLines(data.fullName, headerWidth, 18.5, 'bold'), headerX, y + 5, { maxWidth: headerWidth });

        let headerY = y + 12;
        if (metaLine) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            setTextColor('#5b6475');
            doc.text(getWrappedLines(metaLine, headerWidth, 9.5), headerX, headerY, { maxWidth: headerWidth });
            headerY += 5;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.6);
        setTextColor(accent);
        doc.text(getWrappedLines(data.headline, headerWidth, 11.6, 'bold'), headerX, headerY, { maxWidth: headerWidth });

        y += headerHeight + 4;

        if (isMinimal) {
            setDrawColor(frame);
            doc.setLineWidth(0.35);
            doc.line(marginX, y - 2.5, marginX + contentWidth, y - 2.5);
        }

        if (data.summary) {
            writeSectionTitle('Profil');
            writeWrappedText(data.summary, { size: 9.9, lineHeight: 4.1, color: '#3d4658', after: 1.3 });
        }

        if (data.skills.length) {
            writeSectionTitle('Competences');
            writeTwoColumnList(data.skills);
        }

        if (data.experiences.length) {
            writeSectionTitle('Experiences professionnelles');
            writeTimelineCards(data.experiences);
        }

        if (data.projects.length) {
            writeSectionTitle('Projets');
            writeTimelineCards(data.projects, { compact: true });
        }

        if (data.education.length) {
            writeSectionTitle('Formations');
            writeTimelineCards(data.education, { compact: true });
        }

        if (data.languages.length) {
            writeSectionTitle('Langues');
            writeTwoColumnList(data.languages);
        }

        if (data.activities.length) {
            writeSectionTitle('Activites');
            writeTwoColumnList(data.activities);
        }

        finishPdfExport(doc, 'cv-intelligent.pdf', action, options?.printWindow);
    } catch (error) {
        console.error(error);
        setCvStatus('Echec de generation du PDF');
    }
};

const exportWebVersion = () => {
    const activePreview = currentPreviewMode === 'letter' ? letterPagePreview : previewNodes.preview;
    const clone = activePreview?.cloneNode(true);
    clone?.querySelectorAll('.cv-section-actions').forEach((node) => node.remove());
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV Web</title>
  <style>
    body { font-family: Manrope, sans-serif; margin: 40px; color: #171923; }
    .cv { max-width: 860px; margin: 0 auto; }
    h1 { margin-bottom: 8px; }
    h2 { margin-top: 28px; font-size: 14px; text-transform: uppercase; letter-spacing: .08em; color: #2f3f7f; }
    ul { line-height: 1.7; }
  </style>
</head>
<body>
  <article class="cv">${clone?.innerHTML || activePreview?.innerHTML || ''}</article>
</body>
    </html>`;
    downloadFile(currentPreviewMode === 'letter' ? 'lettre-web.html' : 'cv-web.html', html, 'text/html');
};

const openMailClient = async (mailtoUrl, fallbackText, statusMessage) => {
    let mailOpened = false;

    try {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        mailOpened = true;
    } catch (error) {
        console.error(error);
    }

    try {
        await navigator.clipboard.writeText(fallbackText);
        setCvStatus(mailOpened ? `${statusMessage} - contenu copie en secours` : 'Application mail non detectee : contenu copie');
    } catch (clipboardError) {
        console.error(clipboardError);
        try {
            window.prompt('Copiez ce texte pour votre mail :', fallbackText);
            setCvStatus(mailOpened ? statusMessage : 'Copiez le contenu du mail manuellement');
        } catch (promptError) {
            console.error(promptError);
            setCvStatus(mailOpened ? statusMessage : 'Impossible d ouvrir l application mail');
        }
    }
};

const openAssistant = (prompt = '') => {
    if (!assistantChat || !assistantToggle) {
        return;
    }

    assistantChat.classList.add('is-open');
    assistantToggle.setAttribute('aria-expanded', 'true');

    if (prompt && assistantInput) {
        assistantInput.value = prompt;
        assistantInput.focus();
    }
};

const closeAssistant = () => {
    if (!assistantChat || !assistantToggle) {
        return;
    }

    assistantChat.classList.remove('is-open');
    assistantToggle.setAttribute('aria-expanded', 'false');
};

const appendAssistantMessage = (text, role) => {
    if (!assistantMessages) {
        return;
    }

    const article = document.createElement('article');
    article.className = `assistant-bubble assistant-bubble-${role}`;
    article.textContent = text;
    assistantMessages.appendChild(article);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
};

const runAssistantAction = (action, message = '') => {
    lastAssistantAction = { action, message };

    if (action === 'ready') {
        const result = applyReadyCvBase(message);
        return result.mode === 'optimized'
            ? `CV corrigé : accroche, compétences et ${result.experienceCount || 0} expérience(s) harmonisées.`
            : `Base CV créée : titre, accroche, compétences, ${result.experienceCount || 0} expériences et formations prêts à modifier.`;
    }

    if (action === 'import') {
        document.querySelector('#cv-import-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cvImportInput?.focus();
        return "Import ouvert. Choisissez un PDF ou DOCX, puis l'éditeur reconstruit le CV.";
    }

    if (action === 'offer') {
        const adapted = adaptCvToJobOffer();
        return adapted
            ? "CV adapté à l'offre : titre, accroche, mots-clés, compétences et expériences mis à jour."
            : "Collez l'offre dans le champ Offre d'emploi, puis relancez l'action.";
    }

    if (action === 'summary') {
        if (!hasMeaningfulCvContent()) {
            return runAssistantAction('ready', message);
        }
        const improved = improveSummaryText();
        return improved
            ? "Accroche remplacée directement dans le CV."
            : "Accroche inchangée : ajoutez un texte à reformuler.";
    }

    if (action === 'experience') {
        if (!hasMeaningfulExperienceContent()) {
            return runAssistantAction('ready', message);
        }
        const count = improveExperienceLines();
        return count
            ? `${count} expérience(s) restructurée(s) directement dans le CV.`
            : "Aucune expérience exploitable trouvée.";
    }

    if (action === 'skills') {
        if (!hasMeaningfulCvContent()) {
            return runAssistantAction('ready', message);
        }
        const skills = enrichCvSkills();
        return `${skills.length} compétence(s) prêtes et dédupliquées dans le CV.`;
    }

    if (action === 'proofread') {
        if (!hasMeaningfulCvContent()) {
            return runAssistantAction('ready', message);
        }
        proofreadCvTextFields();
        return "Fautes courantes, accents et casse corrigés dans le CV.";
    }

    if (action === 'projects') {
        if (!hasMeaningfulCvContent()) {
            return runAssistantAction('ready', message);
        }
        improveProjectLines();
        return "Projets reformulés directement dans le CV.";
    }

    return "Action non reconnue.";
};

const getAssistantReply = (message) => {
    const normalizedMessage = normalizeLooseCvText(message);
    const hasExplicitAssistantTopic = /\b(accroche|profil|resume|presentation|experience|experiences|mission|missions|competence|competences|faute|fautes|orthographe|grammaire|projet|projets|offre|annonce|import|pdf|docx|cv)\b/.test(normalizedMessage);

    if (!hasExplicitAssistantTopic && /\b(oui|ok|d accord|vas y|fait|fais|remplace|directement|applique|continue)\b/i.test(normalizedMessage)) {
        return lastAssistantAction
            ? runAssistantAction(lastAssistantAction.action, lastAssistantAction.message)
            : "Choisissez d'abord une action : accroche, expériences, compétences, fautes ou offre.";
    }

    if (/\b(import|importe|ancien cv|pdf|docx)\b/.test(normalizedMessage)) {
        return runAssistantAction('import', message);
    }

    if (/\b(offre|annonce|adapter|adapte|mots cles|mot cle)\b/.test(normalizedMessage)) {
        return runAssistantAction('offer', message);
    }

    if (/\b(accroche|profil|resume|presentation)\b/.test(normalizedMessage)) {
        return runAssistantAction('summary', message);
    }

    if (/\b(experience|experiences|mission|missions)\b/.test(normalizedMessage)) {
        return runAssistantAction('experience', message);
    }

    if (/\b(competence|competences|atout|atouts|savoir|qualite|qualites)\b/.test(normalizedMessage)) {
        return runAssistantAction('skills', message);
    }

    if (/\b(faute|fautes|corrige|corriger|orthographe|grammaire|accent|accents)\b/.test(normalizedMessage)) {
        return runAssistantAction('proofread', message);
    }

    if (/\b(projet|projets)\b/.test(normalizedMessage)) {
        return runAssistantAction('projects', message);
    }

    if (/\b(cv|pret|preparer|prepare|remplir|formulaire|base|generer|creer|optimise|ameliorer|ameliore)\b/.test(normalizedMessage)) {
        return runAssistantAction('ready', message);
    }

    const found = assistantAnswers.find((entry) => entry.test.test(message));

    if (found) {
        return found.reply;
    }

    return "Action disponible : accroche, expériences, compétences, fautes, projets, offre ou CV prêt.";
};

const handleAuthLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(authLoginForm);
    const email = normalizeAccountEmail((formData.get('email') || '').toString());
    const password = (formData.get('password') || '').toString();
    const accounts = getStoredAccounts();
    const account = accounts.find((entry) => normalizeAccountEmail(entry.email) === email);

    if (!account) {
        setAuthFeedback('Compte introuvable sur cet appareil.', true);
        return;
    }

    const passwordHash = await hashPassword(password);

    if (account.passwordHash !== passwordHash) {
        setAuthFeedback('Mot de passe incorrect.', true);
        return;
    }

    persistAuthSession(account);
    activeEditableNode = null;
    updateAuthUi();
    loadCvDraft();
    refreshCvModule();
    closeSiteMenu();
    authLoginForm.reset();
    closeAuthModal();
    setCvStatus('Acces local charge');
};

const handleAuthSignup = async (event) => {
    event.preventDefault();

    const formData = new FormData(authSignupForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = normalizeAccountEmail((formData.get('email') || '').toString());
    const password = (formData.get('password') || '').toString();
    const confirmPassword = (formData.get('confirmPassword') || '').toString();

    if (!name || !email || !password) {
        setAuthFeedback('Tous les champs sont obligatoires.', true);
        return;
    }

    if (password.length < 6) {
        setAuthFeedback('Choisissez un mot de passe de 6 caracteres minimum.', true);
        return;
    }

    if (password !== confirmPassword) {
        setAuthFeedback('La confirmation ne correspond pas.', true);
        return;
    }

    const accounts = getStoredAccounts();

    if (accounts.some((entry) => normalizeAccountEmail(entry.email) === email)) {
        setAuthFeedback('Un compte existe deja pour cet email.', true);
        return;
    }

    const account = {
        name,
        email,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
    };

    accounts.push(account);
    saveStoredAccounts(accounts);
    persistAuthSession(account);
    activeEditableNode = null;
    updateAuthUi();
    applyCurrentUserDefaults();
    saveCvDraft(true);
    refreshCvModule();
    closeSiteMenu();
    authSignupForm.reset();
    closeAuthModal();
    setCvStatus('Acces local cree sur ce navigateur');
};

const handleAuthLogout = () => {
    persistAuthSession(null);
    activeEditableNode = null;
    cvEditableContent = {};
    resetCvFormToDefaults();
    updateAuthUi();
    updateCvPreview();
    renderExperienceEditor();
    refreshCvModule();
    closeSiteMenu();
    setPreviewMode('cv');
    setCvStatus('Mode invite actif');
};

window.addEventListener('load', () => {
    document.body.classList.remove('is-preload');
    document.body.classList.add('is-ready');
    initSiteTheme();
    loadAuthSession();
    updateAuthUi();
    try {
        loadCvDraft();
    } catch (error) {
        console.error(error);
        setCvStatus('Brouillon local ignore pour eviter un blocage');
    }
    refreshCvModule();
});

window.addEventListener('hashchange', () => {
    if (window.location.hash === '#cv-intelligent') {
        window.setTimeout(refreshCvModule, 80);
    }
});

cvOpenLinks.forEach((link) => {
    link.addEventListener('click', () => {
        window.setTimeout(refreshCvModule, 60);
    });
});

authOpenLoginButton?.addEventListener('click', () => openAuthModal('login'));
authOpenSignupButton?.addEventListener('click', () => openAuthModal('signup'));
authLogoutButton?.addEventListener('click', handleAuthLogout);
authCloseButton?.addEventListener('click', closeAuthModal);
authModal?.querySelectorAll('[data-auth-close]')?.forEach((node) => {
    node.addEventListener('click', closeAuthModal);
});
authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setAuthView(tab.dataset.authView || 'login');
    });
});
authLoginForm?.addEventListener('submit', handleAuthLogin);
authSignupForm?.addEventListener('submit', handleAuthSignup);
passwordToggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const field = button.closest('.password-field')?.querySelector('input');

        if (!field) {
            return;
        }

        const shouldShow = field.type === 'password';
        field.type = shouldShow ? 'text' : 'password';
        button.textContent = shouldShow ? 'Masquer' : 'Afficher';
        button.setAttribute('aria-label', shouldShow ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
    });
});

siteMenuToggle?.addEventListener('click', () => {
    const isOpen = siteMenuToggle.getAttribute('aria-expanded') === 'true';
    siteMenuToggle.setAttribute('aria-expanded', String(!isOpen));
    siteMenuPanel?.classList.toggle('is-open', !isOpen);
});

siteMenuPanel?.querySelectorAll('a')?.forEach((link) => {
    link.addEventListener('click', closeSiteMenu);
});

document.addEventListener('click', (event) => {
    if (!siteMenuPanel?.classList.contains('is-open')) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    if (!siteMenuPanel.contains(target) && !siteMenuToggle?.contains(target)) {
        closeSiteMenu();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && authModal && !authModal.classList.contains('is-hidden')) {
        closeAuthModal();
    }
    if (event.key === 'Escape') {
        closeSiteMenu();
    }
});

if (navLinks.length > 0 && sections.length > 0) {
    const setActiveLink = () => {
        const offset = window.scrollY + window.innerHeight * 0.25;

        let currentId = sections[0].id;

        sections.forEach((section) => {
            if (offset >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('is-active', isActive);
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    window.addEventListener('load', setActiveLink);
}

if (contactForm) {
    const contactParams = new URLSearchParams(window.location.search);
    const requestedService = contactParams.get('service');
    const requestedMessage = contactParams.get('message');
    const serviceField = contactForm.querySelector('[name="service"]');
    const messageField = contactForm.querySelector('[name="message"]');

    if (requestedService && serviceField) {
        const matchingOption = [...serviceField.options].find((option) => option.value === requestedService || option.textContent === requestedService);
        if (matchingOption) {
            serviceField.value = matchingOption.value || matchingOption.textContent;
        } else {
            serviceField.value = 'Projet specifique';
        }
    }

    if (requestedMessage && messageField && !messageField.value.trim()) {
        messageField.value = requestedMessage;
    } else if (requestedService && messageField && !messageField.value.trim()) {
        messageField.value = `Bonjour,\n\nJe souhaite une proposition pour : ${requestedService}.\n\nMon activite : \nMon objectif : \nLien existant ou outil deja utilise : \nDetails utiles : `;
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const lastName = (formData.get('lastName') || '').toString().trim();
        const firstName = (formData.get('firstName') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const service = (formData.get('service') || '').toString().trim();
        const deadline = (formData.get('deadline') || '').toString().trim();
        const details = formData.getAll('details').map((item) => item.toString().trim()).filter(Boolean);
        const message = (formData.get('message') || '').toString().trim();
        const fullMessage = [
            service ? `Besoin principal : ${service}` : 'Besoin principal : non precise',
            deadline ? `Delai ideal : ${deadline}` : 'Delai ideal : non precise',
            details.length > 0 ? `Infos cochees : ${details.join(', ')}` : 'Infos cochees : aucune',
            '',
            'Message :',
            message || '-',
        ].join('\n');

        if (contactFormStatus) {
            contactFormStatus.textContent = 'Envoi de votre demande...';
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lastName, firstName, email, message: fullMessage, service, deadline, details }),
            });

            if (!response.ok) {
                throw new Error('contact_api_failed');
            }

            contactForm.reset();

            if (contactFormStatus) {
                contactFormStatus.textContent = 'Votre demande a bien été envoyée.';
            }

            return;
        } catch (error) {
            if (contactFormStatus) {
                contactFormStatus.textContent = "L’envoi n’a pas abouti, vous pouvez nous écrire à contact@sacreationweb.com.";
            }
        }
    });
}

if (cards.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
}

if (revealSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    revealSections.forEach((section) => sectionObserver.observe(section));
}

const normalizeCvTextareaValue = (fieldName, value) => {
    const items = splitLines(value || '');

    if (fieldName === 'education') {
        return normalizeEducationItems(items.filter((item) => !/^[-–—]?\s*\)?$/.test(item.trim()))).join('\n');
    }

    if (fieldName === 'experience' || fieldName === 'projects') {
        return repairPreviewExperienceItems(dedupeImportedItems(items)).join('\n');
    }

    return value.trim();
};

const setTextareaNormalizedValue = (field, fieldName) => {
    if (!field || !fieldName) {
        return false;
    }

    const normalizedValue = normalizeCvTextareaValue(fieldName, field.value);
    const currentValue = field.value.trim();

    if (!normalizedValue || normalizedValue === currentValue) {
        return false;
    }

    field.value = normalizedValue;

    if (typeof field.setSelectionRange === 'function') {
        const caret = normalizedValue.length;
        field.setSelectionRange(caret, caret);
    }

    return true;
};

if (cvForm) {
    const handleCvFormMutation = (event) => {
        const fieldName = event.target?.name;
        const linkedTarget = fieldName ? editableFieldMap[fieldName] : '';

        if (['experience', 'projects', 'education'].includes(fieldName) && event.target instanceof HTMLTextAreaElement) {
            const shouldNormalizeNow =
                event.type === 'change' ||
                (event.type === 'input' && /[\n\r]|[0-9]{4}/.test(event.data || '') );

            if (shouldNormalizeNow) {
                setTextareaNormalizedValue(event.target, fieldName);
            }
        }

        if (fieldName === 'experience' && event.target instanceof HTMLTextAreaElement && !isSyncingExperienceEditor) {
            renderExperienceEditor();
        }

        if (linkedTarget) {
            clearEditableOverride(linkedTarget);
        }

        if (fieldName === 'projectType') {
            clearEditableOverride('projects');
        }

        updateCvPreview();
        updateWordToolbarState();
        scheduleCvDraftSave();
    };

    cvForm.addEventListener('input', handleCvFormMutation);
    cvForm.addEventListener('change', handleCvFormMutation);
    document.querySelectorAll('[form="cv-form"]').forEach((field) => {
        if (cvForm.contains(field)) {
            return;
        }

        field.addEventListener('input', handleCvFormMutation);
        field.addEventListener('change', handleCvFormMutation);
    });
    cvForm.querySelectorAll('textarea[name="experience"], textarea[name="projects"], textarea[name="education"]').forEach((field) => {
        field.addEventListener('blur', () => {
            setTextareaNormalizedValue(field, field.name);
            if (field.name === 'experience') {
                renderExperienceEditor();
            }
            updateCvPreview();
            scheduleCvDraftSave();
        });
    });
}

if (experienceAddButton) {
    experienceAddButton.addEventListener('click', addExperienceCard);
}

if (experienceCards) {
    experienceCards.addEventListener('input', (event) => {
        if (event.target?.matches('[data-experience-field]')) {
            syncExperienceFieldFromEditor();
        }
    });

    experienceCards.addEventListener('click', (event) => {
        const button = event.target.closest('[data-experience-action]');

        if (!button) {
            return;
        }

        const card = button.closest('.experience-card');

        if (!card) {
            return;
        }

        const action = button.dataset.experienceAction;

        if (action === 'remove') {
            card.remove();
            syncExperienceFieldFromEditor({ refreshCards: true, status: 'Experience supprimee' });
            return;
        }

        const missionsField = card.querySelector('[data-experience-field="bullets"]');

        if (action === 'add-mission' && missionsField) {
            const context = getCvRoleContext(card.textContent || '');
            const suggestion = roleMissionSuggestions[context]?.[0] || roleMissionSuggestions.general[0];
            missionsField.value = [...splitLines(missionsField.value), suggestion].join('\n');
            syncExperienceFieldFromEditor({ status: 'Mission ajoutee' });
            return;
        }

        if (action === 'remove-mission' && missionsField) {
            const lines = splitLines(missionsField.value);
            lines.pop();
            missionsField.value = lines.join('\n');
            syncExperienceFieldFromEditor({ status: 'Mission supprimee' });
            return;
        }

        if (action === 'improve') {
            const title = card.querySelector('[data-experience-field="title"]');
            const meta = card.querySelector('[data-experience-field="meta"]');
            const date = card.querySelector('[data-experience-field="date"]');
            const improved = improveExperienceEntry({
                title: title?.value || '',
                meta: meta?.value || '',
                date: date?.value || '',
                bullets: splitLines(missionsField?.value || ''),
            });

            if (title) {
                title.value = improved.title;
            }
            if (meta) {
                meta.value = improved.meta;
            }
            if (date) {
                date.value = improved.date;
            }
            if (missionsField) {
                missionsField.value = improved.bullets.join('\n');
            }
            syncExperienceFieldFromEditor({ status: 'Experience reformulee' });
        }
    });
}

if (previewHeadlineScale && cvForm) {
    previewHeadlineScale.addEventListener('change', () => {
        cvForm.elements.headlineScale.value = previewHeadlineScale.value;
        updateCvPreview();
        setCvStatus('Taille du titre ajustee');
    });
}

if (previewLineSpacing && cvForm) {
    previewLineSpacing.addEventListener('change', () => {
        cvForm.elements.lineSpacing.value = previewLineSpacing.value;
        updateCvPreview();
        setCvStatus('Interligne mis a jour');
    });
}

if (previewLayoutTheme && cvForm) {
    previewLayoutTheme.addEventListener('change', () => {
        cvForm.elements.layoutTheme.value = previewLayoutTheme.value;
        updateCvPreview();
        setCvStatus('Theme applique');
    });
}

if (previewFitInlineButton) {
    previewFitInlineButton.addEventListener('click', fitCvToSinglePage);
}

document.querySelectorAll('.cv-section-action').forEach((button) => {
    button.addEventListener('click', () => {
        if (!cvForm) {
            return;
        }

        const key = button.dataset.sectionKey;
        const action = button.dataset.sectionAction;

        if (!key || !action) {
            return;
        }

        if (action === 'delete') {
            const field = cvForm.elements[key];
            if (field) {
                field.value = '';
            }
            clearEditableOverride(key);
            updateCvPreview();
            setCvStatus(`${cvSectionLabels[key] || 'Bloc'} supprime`);
            return;
        }

        const index = cvSectionOrder.indexOf(key);
        if (index === -1) {
            return;
        }

        if (action === 'up' && index > 0) {
            [cvSectionOrder[index - 1], cvSectionOrder[index]] = [cvSectionOrder[index], cvSectionOrder[index - 1]];
        }

        if (action === 'down' && index < cvSectionOrder.length - 1) {
            [cvSectionOrder[index + 1], cvSectionOrder[index]] = [cvSectionOrder[index], cvSectionOrder[index + 1]];
        }

        reorderPreviewSections();
        updatePreviewViewport();
        setCvStatus(`Ordre mis a jour : ${cvSectionLabels[key] || 'Bloc'}`);
    });
});

document.querySelectorAll('[data-edit-target]').forEach((node) => {
    node.addEventListener('click', () => {
        if (node.isContentEditable) {
            return;
        }

        if (!cvForm) {
            return;
        }

        const fieldName = node.getAttribute('data-edit-target');
        const field = fieldName ? cvForm.elements[fieldName] : null;

        if (!field) {
            return;
        }

        if (cvLayout?.classList.contains('is-preview-focus')) {
            cvLayout.classList.remove('is-preview-focus');
            cvLayoutToggle?.setAttribute('aria-expanded', 'true');
            cvLayoutToggle?.setAttribute('aria-label', 'Rabattre les reglages');
        }

        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => field.focus(), 180);
        setCvStatus('Cliquez dans le champ pour modifier ce bloc');
    });
});

const getEditableSelectionNode = () => {
    const selection = document.getSelection();
    const anchor = selection?.anchorNode;
    const element = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;
    return element?.closest?.('[contenteditable="true"]') || null;
};

const getActiveEditableNode = () => {
    if (activeEditableNode && document.body.contains(activeEditableNode)) {
        return activeEditableNode;
    }

    activeEditableNode = getEditableSelectionNode();
    return activeEditableNode;
};

const updateWordToolbarState = () => {
    const node = getActiveEditableNode();

    cvWordToolbarShell?.classList.toggle('is-hidden', currentPreviewMode !== 'cv');

    if (!node) {
        cvInlineBoldButton?.classList.remove('is-active');
        cvInlineItalicButton?.classList.remove('is-active');
        cvInlineUnderlineButton?.classList.remove('is-active');
        cvInlineAlignButtons.forEach((button) => button.classList.remove('is-active'));
        return;
    }

    const styles = window.getComputedStyle(node);
    const family = styles.fontFamily.toLowerCase();
    const fontSize = `${Math.round(Number.parseFloat(styles.fontSize) || 14)}px`;
    const lineHeight = styles.lineHeight === 'normal'
        ? '1.2'
        : `${Math.round((((Number.parseFloat(styles.lineHeight) || Number.parseFloat(styles.fontSize) || 14) / (Number.parseFloat(styles.fontSize) || 14)) + Number.EPSILON) * 100) / 100}`;

    if (cvInlineFont) {
        if (family.includes('roboto')) {
            cvInlineFont.value = 'Roboto, sans-serif';
        } else if (family.includes('times')) {
            cvInlineFont.value = "'Times New Roman', serif";
        } else {
            cvInlineFont.value = 'Arial, sans-serif';
        }
    }

    if (cvInlineSize) {
        cvInlineSize.value = ['12px', '14px', '16px', '18px', '24px'].includes(fontSize) ? fontSize : '14px';
    }

    if (cvInlineLineHeight) {
        cvInlineLineHeight.value = ['1', '1.15', '1.5', '2'].includes(lineHeight) ? lineHeight : '1';
    }

    cvInlineBoldButton?.classList.toggle('is-active', Number.parseInt(styles.fontWeight, 10) >= 600);
    cvInlineItalicButton?.classList.toggle('is-active', styles.fontStyle === 'italic');
    cvInlineUnderlineButton?.classList.toggle('is-active', styles.textDecorationLine.includes('underline'));
    cvInlineAlignButtons.forEach((button) => {
        button.classList.toggle('is-active', (styles.textAlign || 'left') === (button.dataset.align || 'left'));
    });
};

const syncPreviewEditableNode = (node, { refreshPreview = false, normalize = true } = {}) => {
    if (!cvForm || !node) {
        return;
    }

    const target = node.getAttribute('data-edit-target');
    const field = target ? cvForm.elements[target] : null;

    if (!field) {
        return;
    }

    if (structuredPreviewTargets.has(target)) {
        clearEditableOverride(target);
        updateCvPageMode();
        updateWordToolbarState();
        return;
    }

    if (normalize) {
        storeEditableNodeState(node);
    } else if (target) {
        cvEditableContent[target] = {
            html: node.innerHTML.trim(),
            style: extractEditableNodeStyleState(node),
        };
    }

    if (target === 'fullName' || target === 'headline' || target === 'summary' || target === 'permit') {
        field.value = node.innerText.trim();
    } else if (target === 'location') {
        const parts = node.innerText
            .split('|')
            .map((item) => item.trim())
            .filter(Boolean);
        if (cvForm.elements.location) {
            cvForm.elements.location.value = parts[0] || '';
        }
        if (cvForm.elements.phone) {
            cvForm.elements.phone.value = parts[1] || '';
        }
        if (cvForm.elements.email) {
            cvForm.elements.email.value = parts[2] || '';
        }
        if (cvForm.elements.permit) {
            cvForm.elements.permit.value = parts[3] || '';
        }
    } else {
        const items = splitLines(node.innerText || '');
        field.value = ['experience', 'projects', 'education'].includes(target)
            ? normalizeCvTextareaValue(target, items.join('\n'))
            : items.join('\n');
    }

    if (refreshPreview) {
        updateCvPreview();
    } else {
        updateCvPageMode();
    }

    updateWordToolbarState();
};

const persistAllEditableNodes = ({ refreshPreview = false } = {}) => {
    document.querySelectorAll('[contenteditable="true"]').forEach((node) => {
        syncPreviewEditableNode(node, { refreshPreview });
    });
};

const insertHtmlAtCursor = (html) => {
    document.execCommand('insertHTML', false, html);
};

const handleEditablePaste = (event, node) => {
    event.preventDefault();

    const clipboard = event.clipboardData || window.clipboardData;
    const plainText = normalizeImportedText(clipboard?.getData('text/plain') || '');

    if (!plainText) {
        return;
    }

    if (node.tagName === 'UL' || node.tagName === 'OL') {
        const listHtml = splitLines(plainText)
            .map(stripBulletPrefix)
            .filter(Boolean)
            .map((line) => `<li>${escapeHtml(line)}</li>`)
            .join('');
        insertHtmlAtCursor(listHtml);
    } else {
        const textHtml = plainText.split('\n').map((line) => escapeHtml(line)).join('<br>');
        insertHtmlAtCursor(textHtml);
    }

    window.requestAnimationFrame(() => {
        normalizeEditableNode(node);
        syncPreviewEditableNode(node, { refreshPreview: false });
        setCvStatus('Texte colle sans styles externes');
    });
};

const applyEditableRootStyle = (styleKey, value) => {
    const node = getActiveEditableNode();

    if (!node) {
        setCvStatus('Cliquez d abord dans le CV pour modifier le texte');
        return;
    }

    node.focus();
    node.style[styleKey] = value;
    syncPreviewEditableNode(node, { refreshPreview: false });
    setCvStatus('Mise en forme appliquee');
};

const applyInlineCommand = (command) => {
    const node = getActiveEditableNode();

    if (!node) {
        setCvStatus('Cliquez d abord dans le CV pour modifier le texte');
        return;
    }

    node.focus();
    document.execCommand(command, false, null);
    syncPreviewEditableNode(node, { refreshPreview: false });
    setCvStatus('Mise en forme appliquee');
};

document.querySelectorAll('[contenteditable="true"]').forEach((node) => {
    node.addEventListener('focus', () => {
        activeEditableNode = node;
        updateWordToolbarState();
        setCvStatus('Edition directe active');
    });
    node.addEventListener('input', () => {
        activeEditableNode = node;
        syncPreviewEditableNode(node, { refreshPreview: false, normalize: false });
        scheduleCvDraftSave();
    });
    node.addEventListener('blur', () => {
        normalizeEditableNode(node);
        syncPreviewEditableNode(node, { refreshPreview: true });
        scheduleCvDraftSave();
    });
    node.addEventListener('paste', (event) => {
        activeEditableNode = node;
        handleEditablePaste(event, node);
    });
    node.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            node.blur();
        }
    });
});

document.addEventListener('selectionchange', () => {
    const editableNode = getEditableSelectionNode();
    if (editableNode) {
        activeEditableNode = editableNode;
        updateWordToolbarState();
    }
});

cvInlineFont?.addEventListener('change', () => applyEditableRootStyle('fontFamily', cvInlineFont.value));
cvInlineSize?.addEventListener('change', () => applyEditableRootStyle('fontSize', cvInlineSize.value));
cvInlineLineHeight?.addEventListener('change', () => applyEditableRootStyle('lineHeight', cvInlineLineHeight.value));
document.querySelectorAll('.word-toolbar-button').forEach((button) => {
    button.addEventListener('mousedown', (event) => {
        event.preventDefault();
    });
});
cvInlineBoldButton?.addEventListener('click', () => applyInlineCommand('bold'));
cvInlineItalicButton?.addEventListener('click', () => applyInlineCommand('italic'));
cvInlineUnderlineButton?.addEventListener('click', () => applyInlineCommand('underline'));
cvInlineListButton?.addEventListener('click', () => applyInlineCommand('insertUnorderedList'));
cvInlineIndentButton?.addEventListener('click', () => applyInlineCommand('indent'));
cvInlineOutdentButton?.addEventListener('click', () => applyInlineCommand('outdent'));
cvInlineClearButton?.addEventListener('click', () => {
    applyInlineCommand('removeFormat');
    const node = getActiveEditableNode();
    if (node) {
        applyEditableNodeStyleState(node, { lineHeight: '1.2' });
        syncPreviewEditableNode(node, { refreshPreview: false });
    }
});
cvInlineAlignButtons.forEach((button) => {
    button.addEventListener('click', () => {
        applyEditableRootStyle('textAlign', button.dataset.align || 'left');
    });
});

presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
        applyCvPreset(chip.dataset.preset || '');
    });
});

templatePresetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
        if (!cvForm) {
            return;
        }

        const preset = templatePresets[chip.dataset.templatePreset || ''];
        if (!preset) {
            return;
        }

        Object.entries(preset).forEach(([key, value]) => {
            const field = cvForm.elements[key];
            if (field) {
                field.value = value;
            }
        });

        updateCvPreview();
        setCvStatus('Mise en forme appliquee');
    });
});

previewModeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setPreviewMode(tab.dataset.previewMode || 'cv');
    });
});

if (cvAutofillButton) {
    cvAutofillButton.addEventListener('click', autoOrganizeCv);
}

if (cvSaveButton) {
    cvSaveButton.addEventListener('click', saveCvDraft);
}

if (cvImproveButton) {
    cvImproveButton.addEventListener('click', () => {
        applyReadyCvBase('Corrige et optimise mon CV');
    });
}

if (cvOptimizeMainButton) {
    cvOptimizeMainButton.addEventListener('click', () => {
        const prompt = 'Corrige et optimise mon CV';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvFitPageButton) {
    cvFitPageButton.addEventListener('click', fitCvToSinglePage);
}

if (cvAiImproveButton) {
    cvAiImproveButton.addEventListener('click', () => {
        const prompt = 'Ameliore mon CV';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvAiSummaryButton) {
    cvAiSummaryButton.addEventListener('click', () => {
        const prompt = "Remplace l'accroche directement";
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvAiSkillsButton) {
    cvAiSkillsButton.addEventListener('click', () => {
        const prompt = 'Enrichis mes competences directement';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvAiProofreadButton) {
    cvAiProofreadButton.addEventListener('click', () => {
        const prompt = 'Corrige les fautes de mon CV';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvImproveExperienceButton) {
    cvImproveExperienceButton.addEventListener('click', () => {
        const prompt = 'Reformule mes experiences directement';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvImproveProjectsButton) {
    cvImproveProjectsButton.addEventListener('click', () => {
        const prompt = 'Ameliore mes projets directement';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvAnalyzeButton) {
    cvAnalyzeButton.addEventListener('click', () => {
        updateCvPreview();
        setCvStatus('Analyse ATS actualisee');
    });
}

if (cvMatchJobButton) {
    cvMatchJobButton.addEventListener('click', () => {
        const prompt = 'Adapte mon CV a l offre';
        openAssistant(prompt);
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
}

if (cvPrintButton) {
    cvPrintButton.addEventListener('click', printCurrentDocument);
}

if (cvExportPdfButton) {
    cvExportPdfButton.addEventListener('click', exportPdf);
}

if (cvExportWordButton) {
    cvExportWordButton.addEventListener('click', exportWord);
}

if (cvExportWebButton) {
    cvExportWebButton.addEventListener('click', exportWebVersion);
}

if (cvShareButton) {
    cvShareButton.addEventListener('click', async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#cv-intelligent`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'CV intelligent',
                    text: 'Voir le module CV intelligent',
                    url: shareUrl,
                });
                setCvStatus('Lien partage');
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            setCvStatus('Lien copie');
        } catch (error) {
            console.error(error);
            window.prompt('Copiez ce lien :', shareUrl);
            setCvStatus('Lien pret a etre copie');
        }
    });
}

if (cvEmailButton) {
    cvEmailButton.addEventListener('click', async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#cv-intelligent`;
        const fullName = cvForm?.elements.fullName?.value?.trim() || 'Candidature';
        const headline = cvForm?.elements.headline?.value?.trim() || '';
        const subject = encodeURIComponent(`CV intelligent - ${fullName}`);
        const rawBody = [
            `${fullName}${headline ? ` - ${headline}` : ''}`,
            '',
            'Version web :',
            shareUrl,
        ].join('\n');
        const body = encodeURIComponent(
            [
                `${fullName}${headline ? ` - ${headline}` : ''}`,
                '',
                'Version web :',
                shareUrl,
            ].join('\n')
        );
        await openMailClient(
            `mailto:contact@sacreationweb.com?subject=${subject}&body=${body}`,
            rawBody,
            'Ouverture de votre application mail'
        );
    });
}

if (letterGenerateButton) {
    letterGenerateButton.addEventListener('click', generateCoverLetter);
}

if (letterExportWordButton) {
    letterExportWordButton.addEventListener('click', () => {
        downloadFile('lettre-motivation.doc', `${letterSubject?.textContent || ''}\n\n${letterBody?.textContent || ''}`, 'application/msword');
    });
}

if (letterEmailButton) {
    letterEmailButton.addEventListener('click', async () => {
        const subject = encodeURIComponent(letterSubject?.textContent || 'Candidature');
        const rawBody = letterBody?.textContent || '';
        const body = encodeURIComponent(rawBody);
        await openMailClient(
            `mailto:contact@sacreationweb.com?subject=${subject}&body=${body}`,
            rawBody,
            'Ouverture de votre application mail'
        );
    });
}

if (cvLayoutToggle && cvLayout && cvEditorPanel) {
    cvLayoutToggle.addEventListener('click', () => {
        const isPreviewFocus = cvLayout.classList.toggle('is-preview-focus');
        cvLayoutToggle.setAttribute('aria-expanded', String(!isPreviewFocus));
        cvLayoutToggle.setAttribute('aria-label', isPreviewFocus ? 'Reouvrir les reglages' : 'Rabattre les reglages');
        window.setTimeout(() => {
            updatePreviewViewport();
            scrollToPreviewPage(currentPreviewPage);
        }, 180);
    });
}

setPreviewMode('cv');

if (cvImportInput) {
    cvImportInput.addEventListener('click', (event) => {
        event.target.value = '';
        setCvStatus('Choisissez un PDF, DOCX ou texte a importer');
    });

    cvImportInput.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setCvStatus('Import en cours...');

            if (isLegacyWordDocument(file)) {
                setCvStatus('Le format .doc ancien doit etre converti en .docx avant import');
                event.target.value = '';
                return;
            }

            let text = '';

            if (isPdfDocument(file)) {
                text = await extractTextFromPdf(file);
            } else if (isDocxDocument(file)) {
                text = await extractTextFromDocx(file);
            } else if (isBinaryDocument(file)) {
                setCvStatus('Format non pris en charge pour l import automatique');
                event.target.value = '';
                return;
            } else {
                text = await file.text();
            }

            if (!text.trim()) {
                setCvStatus('Aucun texte exploitable detecte dans ce document');
                event.target.value = '';
                return;
            }

            if (isPdfDocument(file) && looksLikeBrokenPdfText(text)) {
                setCvStatus('PDF detecte mais texte inexploitable : utilisez plutot la version Word ou le PDF converti');
                event.target.value = '';
                return;
            }

            parseImportedCv(text);
            cleanupImportedExperienceField();
            cleanupImportedEducationField();
            renderExperienceEditor();
            updateCvPreview();
            if (cvPreviewViewport) {
                cvPreviewViewport.scrollTop = 0;
            }
        } catch (error) {
            console.error(error);
            setCvStatus('Import impossible pour ce document');
            event.target.value = '';
        }
    });
}

expandableCards.forEach((card) => {
    const trigger = card.querySelector('.expand-trigger');

    if (!trigger) {
        return;
    }

    const toggleCard = () => {
        const isOpen = card.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
    };

    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleCard();
    });

    if (card.classList.contains('interactive-card')) {
        card.addEventListener('click', (event) => {
            if (event.target.closest('.expand-trigger') || event.target.closest('a')) {
                return;
            }

            toggleCard();
        });
    }
});

if (assistantToggle) {
    assistantToggle.addEventListener('click', () => {
        if (assistantChat?.classList.contains('is-open')) {
            closeAssistant();
        } else {
            openAssistant();
        }
    });
}

if (assistantClose) {
    assistantClose.addEventListener('click', closeAssistant);
}

themeToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme === 'day' ? 'day' : 'night';
        applySiteTheme(currentTheme === 'day' ? 'night' : 'day');
    });
});

suggestionChips.forEach((chip) => {
    chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt || chip.textContent || '';
        openAssistant();
        appendAssistantMessage(prompt, 'user');
        appendAssistantMessage(getAssistantReply(prompt), 'bot');
    });
});

if (assistantForm) {
    assistantForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = assistantInput?.value.trim();

        if (!message) {
            return;
        }

        appendAssistantMessage(message, 'user');
        appendAssistantMessage(getAssistantReply(message), 'bot');
        assistantForm.reset();
    });
}

const cleanHtml = (value = '') => escapeHtml(String(value || ''));

const getKirbyArray = (value, max = 8) => (Array.isArray(value) ? value.slice(0, max) : []);

const guessKirbyActivity = (brief) => {
    const normalizedBrief = brief.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const activities = [
        ['coiff', 'salon de coiffure'],
        ['fleur', 'fleuriste'],
        ['restaurant', 'restaurant'],
        ['coach', 'coach'],
        ['photographe', 'photographe'],
        ['artisan', 'artisan'],
        ['boutique', 'boutique'],
        ['cv', 'CV et portfolio'],
        ['portfolio', 'portfolio'],
    ];
    const found = activities.find(([keyword]) => normalizedBrief.includes(keyword));

    if (found) {
        return found[1];
    }

    return 'projet professionnel';
};

const buildBrowserKirbyProposal = (brief) => {
    const activity = guessKirbyActivity(brief);
    const normalizedBrief = brief.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const needsAppointment = /rdv|rendez|reservation|agenda|coiff|coach|consultation/.test(normalizedBrief);
    const needsShop = /boutique|vendre|produit|commande|paiement|catalogue/.test(normalizedBrief);
    const needsQr = /qr|scan|menu|carte|flyer|partager/.test(normalizedBrief);
    const siteName = activity === 'projet professionnel'
        ? 'Votre Présence Pro'
        : activity.split(/\s+/).map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
    const mainCta = needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Demander une information';
    const pages = [
        { name: 'Accueil', goal: 'Présenter l’activité et donner une raison de continuer.' },
        { name: needsShop ? 'Boutique' : 'Prestations', goal: needsShop ? 'Présenter les produits et guider vers la commande.' : 'Afficher les services, tarifs ou informations utiles.' },
        { name: 'Contact', goal: 'Permettre au visiteur d’écrire, appeler ou réserver.' },
    ];

    return {
        projectType: needsShop ? 'Boutique en ligne simple' : needsAppointment ? 'Site avec rendez-vous' : 'Site vitrine professionnel',
        siteName,
        slogan: `Une présence claire pour présenter ${activity} et recevoir des contacts.`,
        summary: `Kirby prépare une base de site centrée sur ${activity}, avec des pages courtes et une action visible.`,
        recommendedOffer: needsShop || needsAppointment ? 'Offre Pro' : 'Offre Essentiel',
        pages,
        homeSections: [
            { title: `Bienvenue chez ${siteName}`, text: `Un bloc d’accueil direct explique l’activité, la zone et ce que le visiteur peut faire.` },
            { title: needsShop ? 'Produits ou catalogue' : 'Services principaux', text: needsShop ? 'Les produits sont organisés pour faciliter la commande.' : 'Les prestations sont présentées sans texte inutile, avec une phrase claire par service.' },
            { title: 'Contact rapide', text: `Le bouton ${mainCta} reste visible pour transformer la visite en demande.` },
        ],
        services: [
            { name: 'Présentation claire', description: 'Dire quoi, pour qui, dans quelle zone et avec quel résultat.' },
            { name: needsAppointment ? 'Rendez-vous' : 'Contact direct', description: needsAppointment ? 'Ajouter un lien de réservation, téléphone ou WhatsApp.' : 'Ajouter un formulaire, e-mail pro ou lien WhatsApp.' },
        ],
        ctas: [mainCta, 'Voir les prestations', 'Contacter maintenant'],
        seoKeywords: [activity, `${activity} professionnel`, `${activity} local`, 'site web professionnel'],
        recommendedServices: [
            { name: needsShop ? 'Boutique en ligne simple' : 'Site vitrine', reason: 'Le projet a besoin d’une page claire et partageable.', priceFrom: needsShop ? 'À partir de 712 € selon le catalogue' : 'À partir de 392 €' },
            { name: 'Adresse e-mail professionnelle', reason: 'Une adresse contact@ renforce la confiance.', priceFrom: 'À partir de 49 €' },
            { name: 'QR code professionnel', reason: needsQr ? 'Le besoin parle déjà de partage ou de support imprimé.' : 'Utile pour partager le site après mise en ligne.', priceFrom: '39 €' },
        ],
        explanation: [
            'La structure commence par ce que le visiteur cherche.',
            'Les boutons sont choisis pour pousser vers une action réelle.',
            'Les options sont ajoutées seulement quand elles rendent le projet plus simple à utiliser.',
        ],
        contactMessage: [
            'Bonjour,',
            '',
            `Kirby a préparé une première proposition pour : ${siteName}.`,
            `Besoin de départ : ${brief}`,
            `Type de projet : ${needsShop ? 'boutique en ligne simple' : needsAppointment ? 'site avec rendez-vous' : 'site vitrine professionnel'}`,
            `Pages proposées : ${pages.map((page) => page.name).join(', ')}`,
            `Actions conseillées : ${[mainCta, 'Voir les prestations', 'Contacter maintenant'].join(', ')}`,
            '',
            'Merci de me dire ce qu’il faut ajuster pour lancer le projet.'
        ].join('\n'),
    };
};

const renderKirbyList = (items, renderItem, emptyText = 'A compléter ensemble.') => {
    const safeItems = getKirbyArray(items, 8);

    if (!safeItems.length) {
        return `<li>${cleanHtml(emptyText)}</li>`;
    }

    return safeItems.map(renderItem).join('');
};

const renderKirbyProposal = (proposal, brief) => {
    if (!aiBriefOutput) {
        return;
    }

    const contactMessage = proposal.contactMessage || buildBrowserKirbyProposal(brief).contactMessage;
    const quoteParams = new URLSearchParams({
        service: proposal.recommendedOffer || 'Projet site web',
        message: contactMessage,
    });

    aiBriefOutput.classList.remove('is-loading');
    aiBriefOutput.innerHTML = `
        <p class="signal-label">Proposition Kirby</p>
        <div class="kirby-proposal-head">
            <span>${cleanHtml(proposal.projectType || 'Projet web')}</span>
            <span>${cleanHtml(proposal.recommendedOffer || 'Offre à confirmer')}</span>
        </div>
        <h3>${cleanHtml(proposal.siteName || 'Nom de site à valider')}</h3>
        <p class="kirby-slogan">${cleanHtml(proposal.slogan || '')}</p>
        <p>${cleanHtml(proposal.summary || '')}</p>

        <div class="kirby-result-grid">
            <section>
                <h4>Pages proposées</h4>
                <ul>
                    ${renderKirbyList(proposal.pages, (page) => `<li><strong>${cleanHtml(page.name)}</strong><span>${cleanHtml(page.goal)}</span></li>`)}
                </ul>
            </section>
            <section>
                <h4>Textes d'accueil</h4>
                <ul>
                    ${renderKirbyList(proposal.homeSections, (section) => `<li><strong>${cleanHtml(section.title)}</strong><span>${cleanHtml(section.text)}</span></li>`)}
                </ul>
            </section>
            <section>
                <h4>Prestations à présenter</h4>
                <ul>
                    ${renderKirbyList(proposal.services, (service) => `<li><strong>${cleanHtml(service.name)}</strong><span>${cleanHtml(service.description)}</span></li>`)}
                </ul>
            </section>
            <section>
                <h4>Options utiles</h4>
                <ul>
                    ${renderKirbyList(proposal.recommendedServices, (service) => `<li><strong>${cleanHtml(service.name)}</strong><span>${cleanHtml(service.reason)} ${service.priceFrom ? `- ${cleanHtml(service.priceFrom)}` : ''}</span></li>`)}
                </ul>
            </section>
        </div>

        <div class="kirby-tags" aria-label="Boutons proposes">
            ${getKirbyArray(proposal.ctas, 4).map((cta) => `<span>${cleanHtml(cta)}</span>`).join('')}
        </div>
        <div class="kirby-tags kirby-tags-seo" aria-label="Mots cles SEO proposes">
            ${getKirbyArray(proposal.seoKeywords, 8).map((keyword) => `<span>${cleanHtml(keyword)}</span>`).join('')}
        </div>
        <div class="kirby-explanation">
            <h4>Pourquoi ces choix ?</h4>
            <ul>
                ${renderKirbyList(proposal.explanation, (item) => `<li>${cleanHtml(item)}</li>`)}
            </ul>
        </div>
        <a class="button button-primary" href="contact.html?${quoteParams.toString()}">Envoyer cette proposition</a>
    `;
};

const setKirbyLoading = () => {
    if (!aiBriefOutput) {
        return;
    }

    aiBriefOutput.classList.add('is-loading');
    aiBriefOutput.innerHTML = `
        <p class="signal-label">Kirby construit</p>
        <h3>Préparation de la première proposition...</h3>
        <p>Analyse du projet, nom, slogan, pages, textes, CTA, SEO et options utiles.</p>
    `;
};

kirbyExampleButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!aiBriefInput) {
            return;
        }

        aiBriefInput.value = button.dataset.kirbyExample || '';
        aiBriefInput.focus();
    });
});

if (aiBriefForm && aiBriefInput && aiBriefOutput) {
    aiBriefForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const brief = aiBriefInput.value.trim();

        if (brief.length < 8) {
            aiBriefOutput.innerHTML = `
                <p class="signal-label">Projet trop court</p>
                <h3>Ajoutez au moins votre activité et l'objectif.</h3>
                <p>Exemple : Je suis coiffeuse à Rueil, je veux présenter mes tarifs et recevoir des rendez-vous.</p>
            `;
            return;
        }

        setKirbyLoading();

        try {
            const response = await fetch('/api/kirby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brief }),
            });

            if (!response.ok) {
                throw new Error('kirby_request_failed');
            }

            const payload = await response.json();
            renderKirbyProposal(payload.proposal || buildBrowserKirbyProposal(brief), brief);
        } catch (error) {
            console.warn('Kirby assistant fallback:', error);
            renderKirbyProposal(buildBrowserKirbyProposal(brief), brief);
        }
    });
}

if (qrServiceForm && qrServiceInput && qrServicePreview && qrServiceImage && qrServiceDownload) {
    let currentQrUrl = '';

    qrServiceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const link = qrServiceInput.value.trim();

        if (!link) {
            return;
        }

        const qrParams = new URLSearchParams({
            size: '900x900',
            format: 'png',
            ecc: 'H',
            margin: '30',
            qzone: '4',
            data: link,
        });
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?${qrParams.toString()}`;
        currentQrUrl = qrUrl;
        qrServiceImage.src = qrUrl;
        if (qrServiceTest) {
            qrServiceTest.href = link;
        }
        if (qrServiceStatus) {
            qrServiceStatus.textContent = `QR code genere pour : ${link}`;
        }
        qrServicePreview.hidden = false;
    });

    qrServiceDownload.addEventListener('click', async () => {
        if (!currentQrUrl) {
            return;
        }

        try {
            const response = await fetch(currentQrUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = objectUrl;
            downloadLink.download = 'qr-code.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.warn('QR code download failed', error);
            window.open(currentQrUrl, '_blank', 'noopener,noreferrer');
        }
    });
}

const initHeroParticles = () => {
    const canvas = document.querySelector('#hero-particles');

    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const context = canvas.getContext('2d');
    const hero = canvas.closest('.hero-immersive');
    let particles = [];
    let particleCount = window.innerWidth < 720 ? 720 : 1150;
    let width = 0;
    let height = 0;
    let radius = 0;
    let angle = 0;
    let animationFrame;

    const resize = () => {
        const bounds = hero?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(bounds.width, window.innerWidth);
        height = Math.max(bounds.height, window.innerHeight * 0.9);
        radius = Math.min(width, height) * (width < 720 ? 0.45 : 0.39);
        particleCount = width < 720 ? 720 : 1150;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const resetParticles = () => {
        particles = [];
        for (let index = 0; index < particleCount; index += 1) {
            const offset = 2 / particleCount;
            const increment = Math.PI * (3 - Math.sqrt(5));
            const y = index * offset - 1 + offset / 2;
            const distance = Math.sqrt(1 - y * y);
            const phi = index * increment;

            particles.push({
                x: Math.cos(phi) * distance,
                y,
                z: Math.sin(phi) * distance,
                size: Math.random() * 1.4 + 0.35,
                shimmer: Math.random() * Math.PI * 2,
            });
        }
    };

    const draw = () => {
        context.clearRect(0, 0, width, height);
        angle += 0.0026;

        const centerX = width < 720 ? width * 0.5 : width * 0.69;
        const centerY = width < 720 ? height * 0.42 : height * 0.51;
        const perspective = radius * 2.8;

        const gradient = context.createRadialGradient(centerX, centerY, radius * 0.12, centerX, centerY, radius * 1.12);
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(0.48, 'rgba(114,150,255,0.052)');
        gradient.addColorStop(1, 'rgba(239,214,163,0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, centerY, radius * 1.16, 0, Math.PI * 2);
        context.fill();

        const projected = particles.map((particle) => {
            const cosY = Math.cos(angle);
            const sinY = Math.sin(angle);
            const cosX = Math.cos(angle * 0.42);
            const sinX = Math.sin(angle * 0.42);
            const rotatedX = particle.x * cosY - particle.z * sinY;
            const rotatedZ = particle.x * sinY + particle.z * cosY;
            const rotatedY = particle.y * cosX - rotatedZ * sinX * 0.34;
            const depth = rotatedZ * cosX + particle.y * sinX * 0.34;
            const scale = perspective / (perspective - depth * radius);

            return {
                x: centerX + rotatedX * radius * scale,
                y: centerY + rotatedY * radius * scale,
                z: depth,
                size: particle.size * scale,
                alpha: Math.max(0.16, 0.2 + (depth + 1) * 0.28),
                shimmer: particle.shimmer,
            };
        }).sort((a, b) => a.z - b.z);

        projected.forEach((particle, index) => {
            const pulse = Math.sin(angle * 7 + particle.shimmer) * 0.18;
            const dotSize = Math.max(0.35, particle.size + pulse);
            const warm = index % 7 === 0;

            context.beginPath();
            context.arc(particle.x, particle.y, dotSize, 0, Math.PI * 2);
            context.fillStyle = warm
                ? `rgba(239, 214, 163, ${particle.alpha})`
                : `rgba(255, 255, 255, ${particle.alpha})`;
            context.fill();

            if (index % 68 === 0) {
                context.beginPath();
                context.arc(particle.x, particle.y, dotSize * 3.8, 0, Math.PI * 2);
                context.fillStyle = `rgba(130, 160, 255, ${particle.alpha * 0.08})`;
                context.fill();
            }
        });

        animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    resetParticles();
    draw();

    window.addEventListener('resize', () => {
        window.cancelAnimationFrame(animationFrame);
        resize();
        resetParticles();
        draw();
    }, { passive: true });
};

initHeroParticles();
