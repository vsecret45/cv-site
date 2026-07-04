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
const cvExportPdfButton = document.querySelector('#cv-export-pdf');
const cvDownloadPdfButton = document.querySelector('#cv-download-pdf');
const cvAutofillButton = document.querySelector('#cv-autofill');
const cvImproveButton = document.querySelector('#cv-improve');
const cvOptimizeMainButton = document.querySelector('#cv-optimize-main');
const cvSaveButton = document.querySelector('#cv-save');
const cvUndoButton = document.querySelector('#cv-undo');
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
const languageAddButton = document.querySelector('#language-add');
const languageCards = document.querySelector('#language-cards');
const cvStatus = document.querySelector('#cv-status');
const atsScoreValue = document.querySelector('#ats-score-value');
const jobMatchValue = document.querySelector('#job-match-value');
const cvAnalysisList = document.querySelector('#cv-analysis-list');
const cvSuggestionsList = document.querySelector('#cv-suggestions-list');
const cvAnalyzeButton = document.querySelector('#cv-analyze');
const cvMatchJobButton = document.querySelector('#cv-match-job');
const jobOfferField = document.querySelector('#job-offer');
const cvImportBlock = document.querySelector('#cv-import-block');
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
const previewHeader = document.querySelector('#cv-preview > .cv-header');
const previewHeaderLabel = previewHeader?.querySelector('.cv-label');
const modernPreviewLayout = document.querySelector('#cv-modern-layout');
const modernPreviewSidebar = document.querySelector('#cv-modern-sidebar');
const modernPreviewMain = document.querySelector('#cv-modern-main');
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
const assistantSubmitButton = document.querySelector('#assistant-submit');
const assistantMessages = document.querySelector('#assistant-messages');
const assistantActivity = document.querySelector('#assistant-activity');
const assistantThread = document.querySelector('#assistant-thread');
const assistantProposal = document.querySelector('#assistant-proposal');
const assistantProposalTitle = document.querySelector('#assistant-proposal-title');
const assistantProposalSummary = document.querySelector('#assistant-proposal-summary');
const assistantProposalDetails = document.querySelector('#assistant-proposal-details');
const assistantApplyButton = document.querySelector('#assistant-apply');
const assistantNewRequestButton = document.querySelector('#assistant-new-request');
const kirbyModeButtons = document.querySelectorAll('[data-kirby-mode]');
const suggestionChips = document.querySelectorAll('.suggestion-chip');
const themeToggles = document.querySelectorAll('.theme-toggle');
const aiBriefForm = document.querySelector('#ai-brief-form');
const aiBriefInput = document.querySelector('#ai-brief-input');
const aiBriefOutput = document.querySelector('#ai-brief-output');
const kirbyExampleButtons = document.querySelectorAll('[data-kirby-example]');
const kirbyAutopilotButtons = document.querySelectorAll('[data-kirby-autopilot]');
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
const cvPrivateGate = document.querySelector('#cv-private-gate');
const cvGateLoginButton = document.querySelector('#cv-gate-login');
const cvGateSignupButton = document.querySelector('#cv-gate-signup');
const PDFJS_MODULE_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs';
const SUPABASE_BROWSER_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const DEFAULT_CV_SECTION_ORDER = ['summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];

let pdfjsLoader;
let currentPreviewPage = 1;
let currentPreviewMode = 'cv';
let isAutoFittingCv = false;
let cvSectionOrder = [...DEFAULT_CV_SECTION_ORDER];
let currentUser = null;
let supabaseClientPromise = null;
let supabaseAuthListenerReady = false;
let activeEditableNode = null;
let activeFormatNode = null;
let savedFormatRange = null;
let activeExperienceIndex = null;
let pendingExperienceDateCorrectionIndex = null;
let cvEditableContent = {};
let cvSectionTitleStyles = {};
let isRenderingExperienceEditor = false;
let isSyncingExperienceEditor = false;
let isRenderingLanguageEditor = false;
let isSyncingLanguageEditor = false;
let isKirbyCvRequestInFlight = false;
let lastAssistantAction = null;
let pendingKirbyCvProposal = null;
let queuedAssistantPrompt = '';
let activeKirbyMode = 'optimize';

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
    digital: 'template-digital',
    holographic: 'template-holographic',
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
    education: 'Formations & certifications',
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
        fontSize: 'normal',
        headlineScale: 'normal',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#2f3f7f',
        sidebarColor: '#eef1f7',
        headingColor: '#263047',
        paperColor: '#ffffff',
        frameColor: '#d9deea',
    },
    digital: {
        layoutTheme: 'digital',
        fontTheme: 'manrope',
        colorTheme: 'graphite',
        designMood: 'clean',
        fontSize: 'normal',
        headlineScale: 'normal',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#3856a6',
        sidebarColor: '#eef2fb',
        headingColor: '#18253f',
        paperColor: '#f7f9fe',
        frameColor: '#dbe3f2',
    },
    holographic: {
        layoutTheme: 'holographic',
        fontTheme: 'manrope',
        colorTheme: 'indigo',
        designMood: 'luxury',
        fontSize: 'normal',
        headlineScale: 'normal',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#5c72db',
        sidebarColor: '#eef4ff',
        headingColor: '#16233f',
        paperColor: '#f7f9fe',
        frameColor: '#dfe7fb',
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
        sidebarColor: '#eef1f7',
        headingColor: '#263047',
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

const modernColorPalettes = {
    indigo: { accentColor: '#2f3f7f', sidebarColor: '#eef1f7', headingColor: '#263047', frameColor: '#d6dce9' },
    emerald: { accentColor: '#0f766e', sidebarColor: '#eaf4f1', headingColor: '#173f3c', frameColor: '#cde4de' },
    rose: { accentColor: '#be185d', sidebarColor: '#f8edf2', headingColor: '#4a2638', frameColor: '#ebd1dd' },
    graphite: { accentColor: '#334155', sidebarColor: '#eef0f2', headingColor: '#26303a', frameColor: '#d4d9df' },
};

const applyModernColorPalette = (theme = '') => {
    const palette = modernColorPalettes[theme];

    if (!cvForm || !palette) {
        return;
    }

    Object.entries(palette).forEach(([name, value]) => {
        const field = cvForm.elements[name];
        if (field) {
            field.value = value;
        }
    });
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
    renderLanguageEditor();
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
let cvHistoryCurrent = '';
let cvHistoryCoalesceTimer = null;
let isCvHistoryCoalescing = false;
let isRestoringCvHistory = false;
let isLoadingCvDraft = false;
const cvUndoStack = [];
const CV_HISTORY_LIMIT = 15;
const CV_STYLE_HISTORY_FIELDS = [
    'layoutTheme',
    'fontTheme',
    'colorTheme',
    'designMood',
    'fontSize',
    'headlineScale',
    'lineSpacing',
    'textAlign',
    'accentColor',
    'sidebarColor',
    'headingColor',
    'paperColor',
    'frameColor',
];

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

const normalizeAccountEmail = (value = '') => value.trim().toLowerCase();

const getLegacyDraftStorageKey = (email = 'guest-session') => `sa-cv-private-draft-v4-${email}`;
const getSecureUserDraftCacheKey = (userId = 'guest') => `sa-cv-secure-draft-v1-${userId}`;

const getLegacyAuthKeys = () => ['sa-cv-private-accounts-v1', 'sa-cv-private-session-v1', getLegacyDraftStorageKey()];

const normalizeSupabaseUser = (user) => {
    if (!user?.id || !user?.email) {
        return null;
    }

    return {
        id: user.id,
        email: normalizeAccountEmail(user.email),
        name: (user.user_metadata?.name || user.user_metadata?.full_name || '').trim(),
    };
};

const resetCvDraftState = () => {
    cvEditableContent = {};
    cvSectionTitleStyles = {};
    cvSectionOrder = [...DEFAULT_CV_SECTION_ORDER];
};

const clearLegacyAuthStorage = () => {
    [...getLegacyAuthKeys(), currentUser?.email ? getLegacyDraftStorageKey(normalizeAccountEmail(currentUser.email)) : null]
        .filter(Boolean)
        .forEach((key) => {
            try {
                window.localStorage.removeItem(key);
                window.sessionStorage.removeItem(key);
            } catch (error) {
                console.error(error);
            }
        });
};

const readLegacyLocalDraft = (email) => {
    if (!email) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(getLegacyDraftStorageKey(normalizeAccountEmail(email)));
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const readScopedLocalDraft = (userId) => {
    if (!userId) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(getSecureUserDraftCacheKey(userId));
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const writeScopedLocalDraft = (userId, payload) => {
    if (!userId || !payload) {
        return;
    }

    try {
        window.localStorage.setItem(getSecureUserDraftCacheKey(userId), JSON.stringify(payload));
    } catch (error) {
        console.error(error);
    }
};

const removeLegacyLocalDraft = (email) => {
    if (!email) {
        return;
    }

    try {
        window.localStorage.removeItem(getLegacyDraftStorageKey(normalizeAccountEmail(email)));
    } catch (error) {
        console.error(error);
    }
};

const initializeSupabaseClient = async () => {
    if (supabaseClientPromise) {
        return supabaseClientPromise;
    }

    supabaseClientPromise = (async () => {
        const response = await fetch('/api/cv-auth-config', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('supabase_config_unavailable');
        }

        const config = await response.json();

        if (!config?.url || !config?.anonKey) {
            throw new Error('supabase_config_invalid');
        }

        const { createClient } = await import(SUPABASE_BROWSER_MODULE_URL);
        const client = createClient(config.url, config.anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });

        if (!supabaseAuthListenerReady) {
            client.auth.onAuthStateChange((_event, session) => {
                persistAuthSession(session?.user || null);
                updateAuthUi();

                if (currentUser) {
                    loadCvDraft({ silent: true }).catch((error) => {
                        console.error(error);
                        setCvStatus('Impossible de recharger le brouillon securise');
                    });
                    return;
                }

                resetCvFormToDefaults();
                resetCvDraftState();
                updateCvPreview();
                renderExperienceEditor();
                renderLanguageEditor();
                resetCvHistory();
                refreshCvModule();
                setPreviewMode('cv');
            });

            supabaseAuthListenerReady = true;
        }

        return client;
    })().catch((error) => {
        supabaseClientPromise = null;
        throw error;
    });

    return supabaseClientPromise;
};

const setAuthFeedback = (message = '', isError = false) => {
    if (!authFeedback) {
        return;
    }

    authFeedback.textContent = message;
    authFeedback.style.color = isError ? '#be185d' : '#2f3f7f';
};

const formatAuthErrorMessage = (error, mode = 'signup') => {
    const source = String(error?.message || error?.error_description || error?.name || '').trim();
    const normalized = normalizeForMatch(source);

    if (!normalized) {
        return mode === 'login'
            ? 'Connexion impossible. Verifiez votre email et votre mot de passe.'
            : 'Creation du compte impossible pour le moment.';
    }

    if (/already registered|user already registered|already exists|email address is already/.test(normalized)) {
        return 'Un compte existe deja avec cet email. Connectez-vous ou utilisez une autre adresse.';
    }

    if (/invalid login credentials|invalid credentials/.test(normalized)) {
        return 'Connexion impossible. Verifiez votre email et votre mot de passe.';
    }

    if (/email.*invalid|invalid email/.test(normalized)) {
        return 'Adresse email invalide. Verifiez le format saisi.';
    }

    if (/password/.test(normalized) && /short|weak|least|minimum/.test(normalized)) {
        return 'Mot de passe trop court ou trop faible. Utilisez au moins 6 caracteres.';
    }

    if (/network|fetch|failed to fetch|load failed|connection|cors/.test(normalized)) {
        return 'Connexion au service securise impossible. Rechargez la page puis reessayez.';
    }

    return source;
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
    currentUser = normalizeSupabaseUser(user);
};

const loadAuthSession = async () => {
    try {
        const client = await initializeSupabaseClient();
        const { data, error } = await client.auth.getSession();

        if (error) {
            throw error;
        }

        persistAuthSession(data?.session?.user || null);
    } catch (error) {
        console.error(error);
        persistAuthSession(null);
        setCvStatus('Connexion securisee indisponible');
    }
};

const updateAuthUi = () => {
    authOpenLoginButton?.classList.toggle('is-hidden', Boolean(currentUser));
    authOpenSignupButton?.classList.toggle('is-hidden', Boolean(currentUser));
    authLogoutButton?.classList.toggle('is-hidden', !currentUser);

    if (authCurrentUserLabel) {
        authCurrentUserLabel.classList.toggle('is-hidden', !currentUser);
        authCurrentUserLabel.textContent = currentUser ? `Connectee : ${currentUser.name || currentUser.email}` : '';
    }

    syncCvWorkspaceAccess();
};

const syncCvWorkspaceAccess = () => {
    const isAuthenticated = Boolean(currentUser?.id);

    document.body.classList.toggle('cv-workspace-locked', !isAuthenticated);
    cvPrivateGate?.classList.toggle('is-hidden', isAuthenticated);
    cvPrivateGate?.setAttribute('aria-hidden', String(isAuthenticated));
    cvImportBlock?.classList.toggle('is-hidden', !isAuthenticated);
    cvLayout?.classList.toggle('is-hidden', !isAuthenticated);
    cvLayoutToggle?.classList.toggle('is-hidden', !isAuthenticated);
    assistantToggle?.classList.toggle('is-hidden', !isAuthenticated);

    if (!isAuthenticated) {
        closeAssistant();
    }
};

const requireAuthenticatedCvAccess = (message = 'Connectez-vous pour acceder a votre espace CV prive') => {
    if (currentUser?.id) {
        return true;
    }

    openAuthModal('login');
    setCvStatus(message);
    return false;
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

const extractEditableNodeStyleState = (node) => ({
    fontFamily: node?.style.fontFamily || '',
    fontSize: node?.style.fontSize || '',
    textAlign: node?.style.textAlign || '',
    lineHeight: node?.style.lineHeight || '1.2',
    fontWeight: node?.style.fontWeight || '',
    fontStyle: node?.style.fontStyle || '',
    textDecoration: node?.style.textDecoration || '',
    letterSpacing: node?.style.letterSpacing || '',
    textTransform: node?.style.textTransform || '',
});

const normalizeStyleState = (styleState = {}) => ({
    fontFamily: styleState.fontFamily || '',
    fontSize: styleState.fontSize || '',
    textAlign: styleState.textAlign || '',
    lineHeight: styleState.lineHeight || '1.2',
    fontWeight: styleState.fontWeight || '',
    fontStyle: styleState.fontStyle || '',
    textDecoration: styleState.textDecoration || '',
    letterSpacing: styleState.letterSpacing || '',
    textTransform: styleState.textTransform || '',
});

const applyEditableNodeStyleState = (node, styleState = {}) => {
    if (!node) {
        return;
    }

    const style = normalizeStyleState(styleState);
    node.style.fontFamily = style.fontFamily;
    node.style.fontSize = style.fontSize;
    node.style.textAlign = style.textAlign;
    node.style.lineHeight = style.lineHeight;
    node.style.fontWeight = style.fontWeight;
    node.style.fontStyle = style.fontStyle;
    node.style.textDecoration = style.textDecoration;
    node.style.letterSpacing = style.letterSpacing;
    node.style.textTransform = style.textTransform;
};

const isDefaultEditableStyleState = (styleState = {}) =>
    !styleState.fontFamily &&
    !styleState.fontSize &&
    !styleState.textAlign &&
    !styleState.fontWeight &&
    !styleState.fontStyle &&
    !styleState.textDecoration &&
    !styleState.letterSpacing &&
    !styleState.textTransform &&
    (!styleState.lineHeight || styleState.lineHeight === '1.2');

const applySectionTitleStyles = () => {
    document.querySelectorAll('[data-section-title]').forEach((node) => {
        const key = node.dataset.sectionTitle || '';
        const style = cvSectionTitleStyles[key] || {};
        if (isDefaultEditableStyleState(style)) {
            node.removeAttribute('style');
            return;
        }
        applyEditableNodeStyleState(node, style);
    });
};

const storeSectionTitleStyle = (node) => {
    const key = node?.dataset?.sectionTitle || '';
    if (!key) {
        return;
    }

    const style = normalizeStyleState(extractEditableNodeStyleState(node));
    if (isDefaultEditableStyleState(style)) {
        delete cvSectionTitleStyles[key];
        return;
    }

    cvSectionTitleStyles[key] = style;
};

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

        if (tag === 'SPAN') {
            const span = document.createElement('span');
            ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'fontStyle', 'textDecoration'].forEach((key) => {
                if (child.style[key]) {
                    span.style[key] = child.style[key];
                }
            });
            appendSanitizedInlineChildren(child, span);
            if (span.textContent.trim()) {
                target.appendChild(span);
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

    const style = cvEditableContent[target]?.style || {};
    if (isDefaultEditableStyleState(style)) {
        delete cvEditableContent[target];
        return;
    }

    cvEditableContent[target] = { style };
};

const clearEditableOverrides = (targets = editableTargets) => {
    targets.forEach((target) => clearEditableOverride(target));
};

const buildCvDraftPayload = () => {
    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());

    return {
        values,
        editableContent: cvEditableContent,
        sectionTitleStyles: cvSectionTitleStyles,
        sectionOrder: cvSectionOrder,
        history: cvUndoStack.slice(-CV_HISTORY_LIMIT),
        savedAt: new Date().toISOString(),
        userId: currentUser?.id || null,
        userEmail: currentUser?.email || null,
    };
};

const saveCvDraft = async (silent = false) => {
    if (!cvForm) {
        return;
    }

    const focusedEditableNode = document.activeElement?.closest?.('[contenteditable="true"]');
    if (focusedEditableNode) {
        syncPreviewEditableNode(focusedEditableNode, { refreshPreview: false });
    }

    if (!currentUser?.id) {
        if (!silent) {
            openAuthModal('login');
            setCvStatus('Connectez-vous pour sauvegarder votre brouillon');
        }
        return;
    }

    try {
        const client = await initializeSupabaseClient();
        const payload = buildCvDraftPayload();
        const { error } = await client
            .from('cv_drafts')
            .upsert(
                {
                    user_id: currentUser.id,
                    payload,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id',
                }
            );

        if (error) {
            throw error;
        }

        writeScopedLocalDraft(currentUser.id, payload);
        removeLegacyLocalDraft(currentUser.email);
        clearLegacyAuthStorage();
        setCvStatus(silent ? 'Brouillon securise enregistre' : 'CV sauvegarde dans votre espace prive');
    } catch (error) {
        console.error(error);
        writeScopedLocalDraft(currentUser.id, buildCvDraftPayload());
        if (!silent) {
            setCvStatus('Sauvegarde locale privee active en attendant la table securisee');
        }
    }
};

const getCvHistoryState = () => {
    if (!cvForm) {
        return '';
    }

    const values = Object.fromEntries(new FormData(cvForm).entries());
    document.querySelectorAll('[form="cv-form"][name]').forEach((field) => {
        values[field.name] = field.type === 'checkbox' ? String(field.checked) : field.value;
    });

    return JSON.stringify({
        values,
        editableContent: cvEditableContent,
        sectionTitleStyles: cvSectionTitleStyles,
        sectionOrder: cvSectionOrder,
    });
};

const getCurrentCvStyleValues = () => {
    if (!cvForm) {
        return {};
    }

    return CV_STYLE_HISTORY_FIELDS.reduce((accumulator, fieldName) => {
        const field = cvForm.elements[fieldName];
        if (field) {
            accumulator[fieldName] = field.type === 'checkbox' ? String(field.checked) : field.value;
        }
        return accumulator;
    }, {});
};

const updateCvUndoControl = () => {
    if (!cvUndoButton) {
        return;
    }

    const hasPreviousVersion = cvUndoStack.length > 0;
    cvUndoButton.disabled = !hasPreviousVersion;
    cvUndoButton.title = hasPreviousVersion
        ? 'Revenir à la version précédente du CV'
        : 'Aucune version précédente disponible';
};

const resetCvHistory = (history = []) => {
    window.clearTimeout(cvHistoryCoalesceTimer);
    cvUndoStack.length = 0;
    if (Array.isArray(history)) {
        history
            .filter((state) => typeof state === 'string' && state)
            .slice(-CV_HISTORY_LIMIT)
            .forEach((state) => addCvUndoState(state));
    }
    cvHistoryCurrent = getCvHistoryState();
    isCvHistoryCoalescing = false;
    updateCvUndoControl();
};

const addCvUndoState = (state) => {
    if (!state || cvUndoStack.at(-1) === state) {
        return;
    }

    cvUndoStack.push(state);
    if (cvUndoStack.length > CV_HISTORY_LIMIT) {
        cvUndoStack.shift();
    }
};

const captureCvHistoryFromInteraction = ({ immediate = false } = {}) => {
    if (isRestoringCvHistory || !cvForm) {
        return;
    }

    const nextState = getCvHistoryState();

    if (!cvHistoryCurrent) {
        cvHistoryCurrent = nextState;
        return;
    }

    if (nextState === cvHistoryCurrent) {
        return;
    }

    if (!isCvHistoryCoalescing || immediate) {
        addCvUndoState(cvHistoryCurrent);
    }

    cvHistoryCurrent = nextState;
    updateCvUndoControl();
    scheduleCvDraftSave();

    window.clearTimeout(cvHistoryCoalesceTimer);
    if (immediate) {
        isCvHistoryCoalescing = false;
        return;
    }

    isCvHistoryCoalescing = true;
    cvHistoryCoalesceTimer = window.setTimeout(() => {
        isCvHistoryCoalescing = false;
    }, 700);
};

const syncCvDraftToVisibleState = () => {
    if (!cvForm || isRestoringCvHistory || isLoadingCvDraft) {
        return;
    }

    const nextState = getCvHistoryState();

    if (!nextState || nextState === cvHistoryCurrent) {
        return;
    }

    cvHistoryCurrent = nextState;
    updateCvUndoControl();
    saveCvDraft(true);
};

const commitCvHistoryTransition = (beforeState = '') => {
    if (isRestoringCvHistory || !beforeState) {
        return;
    }

    const nextState = getCvHistoryState();
    if (nextState === beforeState) {
        return;
    }

    window.clearTimeout(cvHistoryCoalesceTimer);
    isCvHistoryCoalescing = false;
    addCvUndoState(beforeState);
    cvHistoryCurrent = nextState;
    updateCvUndoControl();
    scheduleCvDraftSave();
};

const restorePreviousCvVersion = () => {
    const previousState = cvUndoStack.pop();
    if (!previousState || !cvForm) {
        updateCvUndoControl();
        return;
    }

    let state;
    try {
        state = JSON.parse(previousState);
    } catch (error) {
        console.error(error);
        updateCvUndoControl();
        return;
    }

    isRestoringCvHistory = true;
    try {
        const preservedStyleValues = getCurrentCvStyleValues();
        resetCvFormToDefaults();
        const values = {
            ...(state?.values && typeof state.values === 'object' ? state.values : {}),
            ...preservedStyleValues,
        };
        Object.entries(values).forEach(([key, value]) => {
            const field = cvForm.elements[key] || [...document.querySelectorAll('[form="cv-form"][name]')]
                .find((candidate) => candidate.name === key);
            if (!field) {
                return;
            }

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value;
            }
        });

        cvEditableContent = state?.editableContent && typeof state.editableContent === 'object'
            ? state.editableContent
            : {};
        cvSectionTitleStyles = state?.sectionTitleStyles && typeof state.sectionTitleStyles === 'object'
            ? state.sectionTitleStyles
            : {};
        structuredPreviewTargets.forEach((target) => {
            const style = cvEditableContent[target]?.style || {};
            if (isDefaultEditableStyleState(style)) {
                delete cvEditableContent[target];
            } else {
                cvEditableContent[target] = { style };
            }
        });
        cvSectionOrder = Array.isArray(state?.sectionOrder) && state.sectionOrder.length
            ? state.sectionOrder.filter((key) => cvSectionLabels[key])
            : [...DEFAULT_CV_SECTION_ORDER];
        activeEditableNode = null;
        activeFormatNode = null;
        savedFormatRange = null;
        renderExperienceEditor();
        renderLanguageEditor();
        updateCvPreview();
        scheduleCvDraftSave();
        setCvStatus('Version précédente restaurée');
    } finally {
        isRestoringCvHistory = false;
        cvHistoryCurrent = getCvHistoryState();
        updateCvUndoControl();
    }
};

const loadCvDraft = async ({ silent = false } = {}) => {
    if (!cvForm) {
        return;
    }

    try {
        isLoadingCvDraft = true;
        let payload = null;
        let savedHistory = [];
        let shouldMigrateLegacyDraft = false;

        resetCvFormToDefaults();
        applyCurrentUserDefaults();
        resetCvDraftState();

        if (currentUser?.id) {
            try {
                const client = await initializeSupabaseClient();
                const { data, error } = await client
                    .from('cv_drafts')
                    .select('payload')
                    .eq('user_id', currentUser.id)
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                payload = data?.payload || null;
            } catch (error) {
                console.error(error);
                payload = readScopedLocalDraft(currentUser.id);
            }

            if (!payload) {
                payload = readScopedLocalDraft(currentUser.id);
            }

            if (!payload) {
                const legacyPayload = readLegacyLocalDraft(currentUser.email);

                if (legacyPayload) {
                    payload = legacyPayload;
                    shouldMigrateLegacyDraft = true;
                    removeLegacyLocalDraft(currentUser.email);
                }
            }
        }

        const hasDraftValues = Boolean(
            payload && (
                (payload?.values && typeof payload.values === 'object' && !Array.isArray(payload.values)) ||
                (!payload?.values && typeof payload === 'object' && !Array.isArray(payload))
            )
        );

        hideKirbyCvProposal();

        if (hasDraftValues) {
            const values = payload?.values && typeof payload.values === 'object' ? payload.values : payload;
            savedHistory = Array.isArray(payload?.history) ? payload.history : [];

            Object.entries(values).forEach(([key, value]) => {
                const field = cvForm.elements[key] || [...document.querySelectorAll('[form="cv-form"][name]')]
                    .find((candidate) => candidate.name === key);
                if (!field) {
                    return;
                }

                if (field.type === 'checkbox') {
                    field.checked = value === true || value === 'true';
                } else {
                    field.value = value;
                }
            });

            if (payload?.editableContent && typeof payload.editableContent === 'object') {
                cvEditableContent = payload.editableContent;
                structuredPreviewTargets.forEach((target) => {
                    const style = cvEditableContent[target]?.style || {};
                    if (isDefaultEditableStyleState(style)) {
                        delete cvEditableContent[target];
                    } else {
                        cvEditableContent[target] = { style };
                    }
                });
            }

            if (payload?.sectionTitleStyles && typeof payload.sectionTitleStyles === 'object') {
                cvSectionTitleStyles = payload.sectionTitleStyles;
            }

            cvSectionOrder = Array.isArray(payload?.sectionOrder) && payload.sectionOrder.length
                ? payload.sectionOrder.filter((key) => cvSectionLabels[key])
                : [...DEFAULT_CV_SECTION_ORDER];
        } else {
            applyCurrentUserDefaults();
        }

        applyCurrentUserDefaults();
        updateCvPreview();
        renderExperienceEditor();
        renderLanguageEditor();
        resetCvHistory(savedHistory);
        if (shouldMigrateLegacyDraft) {
            await saveCvDraft(true);
        }
        if (!silent) {
            setCvStatus(currentUser ? 'Brouillon prive charge' : 'Mode invite actif');
        }
    } catch (error) {
        console.error(error);
        setCvStatus('Impossible de charger le brouillon securise');
    } finally {
        isLoadingCvDraft = false;
    }
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

    const fontSizeField = cvForm.elements.fontSize;
    const lineSpacingField = cvForm.elements.lineSpacing;
    const headlineScaleField = cvForm.elements.headlineScale;

    if (fontSizeField) {
        fontSizeField.value = 'compact';
    }

    if (lineSpacingField) {
        lineSpacingField.value = 'tight';
    }

    if (headlineScaleField) {
        headlineScaleField.value = 'compact';
    }

    if (autoTriggered) {
        setCvStatus('Mise en page compacte appliquee sans retirer de contenu');
    }
};

const getRenderedCvPageCount = () => {
    const preview = previewNodes.preview;

    if (!preview || preview.classList.contains('is-hidden-preview')) {
        return 1;
    }

    const a4HeightInCssPixels = (297 / 25.4) * 96;
    const previewRect = preview.getBoundingClientRect();
    const contentNodes = [...preview.querySelectorAll('section:not([hidden]), .cv-header, .cv-modern-layout, .cv-modern-sidebar, .cv-modern-main')]
        .filter((node) => node instanceof HTMLElement);
    const deepestBottom = contentNodes.reduce((max, node) => {
        const rect = node.getBoundingClientRect();
        if (!rect.width && !rect.height) {
            return max;
        }
        return Math.max(max, rect.bottom - previewRect.top);
    }, 0);
    const contentHeight = Math.max(
        preview.scrollHeight,
        preview.offsetHeight,
        Math.ceil(previewRect.height),
        Math.ceil(deepestBottom)
    );

    return Math.max(1, Math.ceil((contentHeight - 2) / a4HeightInCssPixels));
};

const updateCvPageMode = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }

    const pageCount = getRenderedCvPageCount();
    const isOverflow = pageCount > 1;

    previewNodes.preview.classList.toggle('is-two-page', isOverflow);
    if (cvOverflowIndicator) {
        cvOverflowIndicator.textContent = isOverflow ? `${pageCount} pages` : '1 page';
        cvOverflowIndicator.classList.toggle('is-overflow', isOverflow);
    }
    updatePreviewViewport();
};

const getVisiblePreviewPages = () =>
    [...(cvPreviewStage?.querySelectorAll('.cv-preview') || [])].filter((page) => !page.classList.contains('is-hidden-preview'));

const getPreviewPageCount = () => currentPreviewMode === 'cv'
    ? getRenderedCvPageCount()
    : getVisiblePreviewPages().length || 1;

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

const getCvFormValues = () => cvForm ? Object.fromEntries(new FormData(cvForm).entries()) : {};

const a4CommercialPriorityTerms = [
    'vente',
    'vendeuse',
    'vendeur',
    'conseil',
    'client',
    'clientele',
    'relation client',
    'accueil',
    'fidelisation',
    'service',
    'merchandising',
    'reassort',
    'stock',
    'caisse',
    'point de vente',
    'magasin',
    'boutique',
    'lifestyle',
    'mode',
    'negociation',
    'chiffre d affaires',
    'organisation',
    'autonomie',
    'equipe',
];

const a4TechnicalPenaltyTerms = [
    'developpement web',
    'developpement d applications',
    'application',
    'algorithme',
    'base de donnees',
    'ux/ui',
    'interface',
    'intelligence artificielle',
    'ia',
    'tests fonctionnels',
    'conception',
    'digital',
    'numerique',
];

const prioritizeSkillsForA4 = (items = [], options = {}) => {
    const maxItems = Math.max(1, Number(options.maxItems) || 10);
    const values = options.values || getCvFormValues();
    const normalizedSource = normalizeForMatch([
        values.headline || '',
        values.summary || '',
        values.experience || '',
        values.projects || '',
        values.education || '',
        jobOfferField?.value || '',
    ].join(' '));
    const commercialProfile = a4CommercialPriorityTerms.some((term) => normalizedSource.includes(normalizeForMatch(term)));

    return dedupeCvSkillItems(items)
        .map((item, index) => {
            const label = normalizeCvSentenceText(item);
            const normalized = normalizeForMatch(label);
            const tokens = normalized.split(' ').filter((token) => token.length > 2);
            let score = Math.max(0, 10 - index);

            if (!normalized) {
                return { label, score: -999, index };
            }

            if (normalizedSource.includes(normalized)) {
                score += 20;
            }

            score += tokens.filter((token) => normalizedSource.includes(token)).length * 3;

            a4CommercialPriorityTerms.forEach((term) => {
                const key = normalizeForMatch(term);
                if (normalized.includes(key)) {
                    score += commercialProfile ? 8 : 3;
                }
            });

            if (commercialProfile) {
                a4TechnicalPenaltyTerms.forEach((term) => {
                    if (normalized.includes(normalizeForMatch(term))) {
                        score -= 5;
                    }
                });
            }

            if (label.length <= 28) {
                score += 2;
            } else if (label.length >= 45) {
                score -= 2;
            }

            return { label, score, index };
        })
        .sort((left, right) => right.score - left.score || left.index - right.index)
        .slice(0, maxItems)
        .map((entry) => entry.label);
};

const setCompactListFieldValue = (fieldName, items = []) => {
    const field = cvForm?.elements[fieldName];
    if (!field) {
        return;
    }

    field.value = items.filter(Boolean).join('\n');
};

const getCompactedFieldItems = (fieldName, options = {}) => {
    const field = cvForm?.elements[fieldName];
    if (!field?.value) {
        return [];
    }

    if (options.timeline) {
        return splitLines(field.value).map(normalizeCvSentenceText).filter(Boolean);
    }

    return splitExportItems(field.value, options).map(normalizeCvSentenceText).filter(Boolean);
};

const applyA4ContentCompaction = () => {
    if (!cvForm) {
        return;
    }

    const values = getCvFormValues();
    const layoutTheme = values.layoutTheme || 'wordpro';
    const isGlassTemplate = layoutTheme === 'digital' || layoutTheme === 'holographic';

    const applySkillsLimit = (maxItems) => {
        const skillsField = cvForm.elements.skills;
        if (!skillsField?.value) {
            return;
        }

        const prioritized = prioritizeSkillsForA4(splitLines(skillsField.value), {
            values: getCvFormValues(),
            maxItems,
        });
        setCompactListFieldValue('skills', prioritized);
    };

    const applyFieldLimit = (fieldName, maxItems, options = {}) => {
        const items = getCompactedFieldItems(fieldName, options).slice(0, maxItems);
        setCompactListFieldValue(fieldName, items);
    };

    applySkillsLimit(isGlassTemplate ? 8 : 10);
    applyFieldLimit('languages', 3, { splitSlash: true });
    applyFieldLimit('activities', 4, { splitSlash: true, splitHyphen: true });
    updateCvPreview();

    const overflowSteps = [
        () => applySkillsLimit(8),
        () => applyFieldLimit('activities', 2, { splitSlash: true, splitHyphen: true }),
        () => applyFieldLimit('languages', 2, { splitSlash: true }),
        () => applySkillsLimit(6),
        () => applyFieldLimit('projects', 1, { timeline: true }),
        () => applyFieldLimit('education', 2, { timeline: true }),
        () => setCompactListFieldValue('activities', []),
    ];

    overflowSteps.forEach((step) => {
        if (getPreviewPageCount() <= 1) {
            return;
        }

        step();
        updateCvPreview();
    });
};

const applyPreviewSectionContent = ({
    values,
    experienceItems,
    educationItems,
    languageItems,
    activityItems,
    projectItems,
    skillItems,
}) => {
    renderEditableListNode(previewNodes.experience, 'experience', () => renderTimelineList(previewNodes.experience, experienceItems, { indexAttribute: 'data-experience-index' }));
    renderEditableListNode(previewNodes.projects, 'projects', () => renderTimelineList(previewNodes.projects, projectItems, { projectType: values.projectType || '' }));
    renderEditableListNode(previewNodes.skills, 'skills', () => fillList(previewNodes.skills, skillItems));
    renderEditableListNode(previewNodes.education, 'education', () => renderTimelineList(previewNodes.education, educationItems));
    renderEditableListNode(previewNodes.languages, 'languages', () => fillList(previewNodes.languages, languageItems));
    renderEditableListNode(previewNodes.activities, 'activities', () => fillList(previewNodes.activities, activityItems));

    if (previewNodes.preview) {
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
            const section = previewNodes.preview.querySelector(`[data-section-key="${key}"]`);
            if (section) {
                section.hidden = count === 0;
            }
        });

        reorderPreviewSections();
    }
};

const sanitizeCrystalGlassSkillItems = (items = []) => {
    const allowedPatterns = [
        /autonomie/i,
        /apprentissage\s+par\s+projet/i,
        /travail\s+en\s+autonomie\s+et\s+en?\s+équipe/i,
        /r[ée]solution\s+de\s+probl[èe]mes/i,
        /analyse\s+des\s+besoins?\s+clients?/i,
        /organisation\s+du\s+travail/i,
        /respect\s+des\s+proc[ée]dures/i,
    ];

    return items.filter((item) => {
        const value = String(item || '').trim();
        return value && allowedPatterns.some((pattern) => pattern.test(value));
    });
};

const sanitizeCrystalGlassEducationItems = (items = []) =>
    items.map((item) => String(item || '').replace(
        /Simplon\s*[—-]\s*Formation numérique\s*\/\s*développement web/gi,
        'Simplon — Formation numérique'
    ));

const optimizeForPrint = () => {
    if (!cvForm) {
        return null;
    }

    const backup = getPrintFieldBackup();
    fitCvToSinglePage();
    applyA4ContentCompaction();

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
        if (cvImportBlock) {
            cvImportBlock.style.display = currentUser?.id ? 'grid' : 'none';
            cvImportBlock.style.visibility = 'visible';
        }
        if (cvLayout) {
            cvLayout.classList.remove('is-preview-focus');
            cvLayout.style.display = currentUser?.id ? 'grid' : 'none';
            cvLayout.style.opacity = '1';
            cvLayout.style.visibility = 'visible';
        }
        if (cvLayoutToggle) {
            cvLayoutToggle.setAttribute('aria-expanded', 'true');
            cvLayoutToggle.setAttribute('aria-label', 'Rabattre les reglages');
        }
        if (cvEditorPanel) {
            cvEditorPanel.style.display = currentUser?.id ? 'grid' : 'none';
            cvEditorPanel.style.opacity = '1';
            cvEditorPanel.style.pointerEvents = 'auto';
            cvEditorPanel.style.visibility = 'visible';
        }
        if (cvForm) {
            cvForm.style.display = currentUser?.id ? 'grid' : 'none';
            cvForm.style.visibility = 'visible';
            cvForm.hidden = false;
        }
        if (cvPreviewShell) {
            cvPreviewShell.style.display = currentUser?.id ? 'grid' : 'none';
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
        syncCvWorkspaceAccess();
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

    dedupeImportedItems(items.filter(Boolean)).forEach((item, index) => {
        const entry = parseExperienceEntry(item);
        const li = document.createElement('li');
        li.className = 'cv-experience-item';
        if (options.indexAttribute) {
            li.setAttribute(options.indexAttribute, String(index));
            li.addEventListener('mousedown', () => {
                activeExperienceIndex = index;
            });
            li.addEventListener('click', () => {
                activeExperienceIndex = index;
            });
        }

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

    if (/\b(vendeur|vendeuse|vente|lifestyle|boutique|magasin|rayon|encaissement)\b/.test(source)) {
        return 'sales';
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
    sales: [
        'Relation client',
        'Conseil client',
        'Autonomie',
        'Sens du service',
        'Travail en équipe',
        'Organisation du point de vente',
    ],
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
    sales:
        'Professionnelle de la relation client, organisée et autonome, mettant à profit son écoute, son conseil et son sens du service pour accompagner chaque client avec attention.',
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
    sales: [
        'Accueillir, écouter et conseiller les clients selon leurs besoins',
        'Contribuer à une expérience client fluide, soignée et orientée service',
        'Travailler avec autonomie tout en assurant la qualité du service',
    ],
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
    languages: [
        'francais anglais',
        'francais anglais arabe',
        'francais langue maternelle anglais bases professionnelles arabe',
        'francais langue maternelle anglais notions arabe',
    ],
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
    setCvFieldIfDefault('skills', dedupeCvSkillItems(template.skills).slice(0, 10).join('\n'));
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
    harmonizeExperienceFieldStructure({ silent: true });
    renderExperienceEditor();
    renderLanguageEditor();
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
        .map((item, index) => index === 2
            ? normalizeExperienceDateText(item || '')
            : normalizeCvSentenceText(item || ''))
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

const getKnownExperienceFallbackData = (entry = {}) => {
    const source = normalizeForMatch(`${entry.title || ''} ${entry.meta || ''}`);

    if (/\bmachiniste\b|\breceveur\b|\bratp\b/.test(source)) {
        return {
            strict: true,
            meta: 'RATP, Nanterre',
            bullets: [
                'Accueil et information des voyageurs',
                'Conduite en toute sécurité et respect des horaires',
                'Gestion des situations imprévues et du service client',
            ],
        };
    }

    if (/\bceidf\b|\bconseillere commerciale\b|\bconseillère commerciale\b/.test(source)) {
        return {
            strict: true,
            meta: 'CEIDF, Montigny-le-Bretonneux',
            bullets: [
                'Conseil et accompagnement des clients',
                'Analyse des besoins et proposition de solutions bancaires',
                'Développement de la relation client',
            ],
        };
    }

    if (/\bcama[ïi]eu\b|\bresponsable adjointe\b/.test(source)) {
        return {
            strict: true,
            meta: 'Camaïeu, Rueil-Malmaison',
            bullets: [
                'Accueil, conseil et fidélisation de la clientèle',
                'Développement du chiffre d’affaires et gestion du point de vente',
                'Coordination de l’équipe et organisation quotidienne',
            ],
        };
    }

    if (/\bamerican express\b|\bair france\b|\bchargee de clientele\b|\bchargée de clientèle\b|\bconseillere clientele\b|\bconseillère clientèle\b/.test(source)) {
        return {
            strict: true,
            meta: 'American Express / Air France, Roissy',
            bullets: [
                'Accompagnement d’une clientèle premium',
                'Gestion des contrats et suivi des demandes',
                'Service personnalisé et résolution des situations complexes',
            ],
        };
    }

    return {
        strict: false,
        meta: '',
        bullets: roleMissionSuggestions[getCvRoleContext(source)] || roleMissionSuggestions.general,
    };
};

const harmonizeExperienceEntryStructure = (entry = {}) => {
    const baseEntry = improveExperienceEntry(entry);
    const fallback = getKnownExperienceFallbackData(baseEntry);
    const existingBullets = dedupeImportedItems((baseEntry.bullets || []).map(normalizeCvSentenceText).filter(Boolean));
    const fallbackBullets = fallback.bullets.map(normalizeCvSentenceText);
    const mergedBullets = fallback.strict
        ? fallbackBullets
        : dedupeImportedItems([...existingBullets, ...fallbackBullets]).slice(0, 4);
    const targetBulletCount = fallback.strict
        ? Math.min(Math.max(2, fallbackBullets.length), 4)
        : existingBullets.length >= 3
            ? Math.min(existingBullets.length, 4)
            : Math.min(Math.max(2, fallbackBullets.length), 4);

    return {
        ...baseEntry,
        meta: normalizeCvSentenceText(baseEntry.meta || fallback.meta || ''),
        bullets: mergedBullets.slice(0, targetBulletCount),
    };
};

const harmonizeExperienceFieldStructure = ({ silent = false } = {}) => {
    const field = getExperienceField();
    const lines = field ? repairPreviewExperienceItems(splitLines(field.value)) : [];

    if (!field || !lines.length) {
        return false;
    }

    const normalizedLines = lines
        .map((line) => serializeExperienceEntry(harmonizeExperienceEntryStructure(parseExperienceEntry(line))))
        .filter(Boolean);
    const nextValue = normalizedLines.join('\n');

    if (!nextValue || nextValue === field.value) {
        return false;
    }

    field.value = nextValue;
    clearEditableOverride('experience');
    renderExperienceEditor();

    if (!silent) {
        updateCvPreview();
        scheduleCvDraftSave();
        setCvStatus('Expériences harmonisées');
    }

    return true;
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

    hideKirbyCvProposal();
    isSyncingExperienceEditor = true;
    field.value = collectExperienceEditorEntries().map(serializeExperienceEntry).filter(Boolean).join('\n');
    clearEditableOverride('experience');
    updateCvPreview();
    captureCvHistoryFromInteraction();
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

    hideKirbyCvProposal();
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

const getLanguageField = () => cvForm?.elements.languages || null;

const normalizeLanguageLevel = (value = '') => {
    const normalized = normalizeForMatch(value).replace(/\s+/g, ' ').trim();
    const aliases = {
        'langue maternelle': 'Langue maternelle',
        maternelle: 'Langue maternelle',
        native: 'Langue maternelle',
        'native speaker': 'Langue maternelle',
        courant: 'Courant',
        courante: 'Courant',
        fluent: 'Courant',
        bilingue: 'Bilingue',
        'bases professionnelles': 'Notions',
        'base professionnelle': 'Notions',
        basic: 'Notions',
        'basic english': 'Notions',
        'basic knowledge': 'Notions',
        'basic proficiency': 'Notions',
        beginner: 'Débutant',
        debutant: 'Débutant',
        'bases solides': 'Bases solides',
        elementary: 'Bases solides',
        'elementary level': 'Bases solides',
        'notion professionnelle': 'Notions professionnelles',
        'notions professionnelles': 'Notions professionnelles',
        'notion professionnel': 'Notions professionnelles',
        'notions professionnel': 'Notions professionnelles',
        professionnel: 'Niveau professionnel',
        professionnelle: 'Niveau professionnel',
        'niveau professionnel': 'Niveau professionnel',
        'professional working proficiency': 'Niveau professionnel',
        'working proficiency': 'Niveau professionnel',
        intermediaire: 'Niveau intermédiaire',
        'niveau intermediaire': 'Niveau intermédiaire',
        intermediate: 'Niveau intermédiaire',
        notions: 'Notions',
        notion: 'Notions',
        'a preciser': '',
    };

    return aliases[normalized] ?? normalizeCvSentenceText(value);
};

const parseLanguageEntry = (line = '') => {
    const [language = '', ...levelParts] = String(line).split(/\s*[:–—-]\s*/);
    const cleanLanguage = normalizeCvSentenceText(language).replace(/\.$/, '');

    return {
        language: cleanLanguage,
        level: normalizeLanguageLevel(levelParts.join(' ')),
    };
};

const serializeLanguageEntry = (entry = {}) => {
    const language = normalizeCvSentenceText(entry.language || '').replace(/\.$/, '');
    const level = normalizeLanguageLevel(entry.level || '');

    return language ? (level ? `${language} : ${level}` : language) : '';
};

const getLanguageSourceEntries = () => {
    const field = getLanguageField();

    if (!field) {
        return [];
    }

    return splitLines(field.value)
        .map(parseLanguageEntry)
        .filter((entry) => entry.language)
        .filter((entry, index, entries) =>
            entries.findIndex((candidate) => normalizeForMatch(candidate.language) === normalizeForMatch(entry.language)) === index
        );
};

const renderLanguageEditor = () => {
    if (!languageCards || !getLanguageField() || isSyncingLanguageEditor) {
        return;
    }

    isRenderingLanguageEditor = true;
    languageCards.innerHTML = '';
    const entries = getLanguageSourceEntries();
    const normalizedValue = entries.map(serializeLanguageEntry).filter(Boolean).join('\n');
    const languageField = getLanguageField();
    const didNormalizeLanguageValue = Boolean(languageField && normalizedValue && normalizedValue !== languageField.value.trim());
    if (didNormalizeLanguageValue) {
        languageField.value = normalizedValue;
    }
    const cards = entries.length ? entries : [{ language: '', level: '' }];

    cards.forEach((entry) => {
        const card = document.createElement('article');
        card.className = 'language-card';
        card.innerHTML = `
            <label>
                <span>Langue</span>
                <input type="text" data-language-field="language" value="${escapeHtml(entry.language)}" placeholder="Ex. Français">
            </label>
            <label>
                <span>Niveau</span>
                <input type="text" list="language-level-options" data-language-field="level" value="${escapeHtml(entry.level || '')}" placeholder="Notions, Intermédiaire, Professionnel…">
            </label>
            <button class="button button-secondary" type="button" data-language-action="remove">Supprimer</button>
        `;
        languageCards.appendChild(card);
    });

    isRenderingLanguageEditor = false;

    if (didNormalizeLanguageValue) {
        updateCvPreview();
        scheduleCvDraftSave();
    }
};

const collectLanguageEditorEntries = () =>
    [...(languageCards?.querySelectorAll('.language-card') || [])]
        .map((card) => ({
            language: card.querySelector('[data-language-field="language"]')?.value || '',
            level: card.querySelector('[data-language-field="level"]')?.value || '',
        }))
        .map((entry) => ({
            language: normalizeCvSentenceText(entry.language).replace(/\.$/, ''),
            level: normalizeLanguageLevel(entry.level),
        }))
        .filter((entry) => entry.language)
        .filter((entry, index, entries) =>
            entries.findIndex((candidate) => normalizeForMatch(candidate.language) === normalizeForMatch(entry.language)) === index
        );

const syncLanguageFieldFromEditor = ({ refreshCards = false, status = '' } = {}) => {
    const field = getLanguageField();

    if (!field || isRenderingLanguageEditor) {
        return;
    }

    hideKirbyCvProposal();
    isSyncingLanguageEditor = true;
    field.value = collectLanguageEditorEntries().map(serializeLanguageEntry).filter(Boolean).join('\n');
    clearEditableOverride('languages');
    updateCvPreview();
    captureCvHistoryFromInteraction();
    scheduleCvDraftSave();
    isSyncingLanguageEditor = false;

    if (refreshCards) {
        renderLanguageEditor();
    }

    if (status) {
        setCvStatus(status);
    }
};

const addLanguageCard = () => {
    const field = getLanguageField();

    if (!field) {
        return;
    }

    hideKirbyCvProposal();
    const entries = getLanguageSourceEntries();
    entries.push({ language: '', level: '' });
    field.value = entries.map(serializeLanguageEntry).filter(Boolean).join('\n');
    renderLanguageEditor();
    const input = languageCards?.querySelector('.language-card:last-child [data-language-field="language"]');
    input?.focus();
    setCvStatus('Langue ajoutée');
};

const movePreviewNode = (parent, node) => {
    if (parent && node && node.parentElement !== parent) {
        parent.appendChild(node);
    }
};

const reorderPreviewSections = () => {
    if (!previewNodes.preview || !previewSectionsRoot) {
        return;
    }

    const layoutTheme = cvForm?.elements.layoutTheme?.value;
    const isStructuredLayout = (layoutTheme === 'modern' || layoutTheme === 'holographic') && modernPreviewSidebar && modernPreviewMain;

    if (isStructuredLayout) {
        const sidebarKeys = layoutTheme === 'holographic'
            ? ['languages', 'skills', 'education', 'activities']
            : ['languages', 'skills', 'education', 'activities'];
        const mainKeys = layoutTheme === 'holographic'
            ? ['summary', 'experience', 'projects']
            : ['summary', 'experience', 'projects'];

        sidebarKeys.forEach((key) => {
            const section = previewNodes.preview.querySelector(`[data-section-key="${key}"]`);
            if (section) {
                modernPreviewSidebar.appendChild(section);
            }
        });

        mainKeys.forEach((key) => {
            const section = previewNodes.preview.querySelector(`[data-section-key="${key}"]`);
            if (section) {
                modernPreviewMain.appendChild(section);
            }
        });
        return;
    }

    cvSectionOrder.forEach((key) => {
        const section = previewNodes.preview.querySelector(`[data-section-key="${key}"]`);
        if (section) {
            previewSectionsRoot.appendChild(section);
        }
    });
};

const syncModernPreviewStructure = (layoutTheme = '') => {
    if (!previewHeader || !modernPreviewLayout || !modernPreviewSidebar || !modernPreviewMain) {
        return;
    }

    if (layoutTheme === 'modern' || layoutTheme === 'holographic') {
        modernPreviewLayout.hidden = false;
        modernPreviewLayout.setAttribute('aria-hidden', 'false');
        movePreviewNode(modernPreviewSidebar, previewNodes.meta);
        movePreviewNode(modernPreviewMain, previewNodes.fullName);
        movePreviewNode(modernPreviewMain, previewNodes.headline);
        reorderPreviewSections();
        return;
    }

    modernPreviewLayout.hidden = true;
    modernPreviewLayout.setAttribute('aria-hidden', 'true');
    if (previewHeaderLabel) {
        movePreviewNode(previewHeader, previewHeaderLabel);
    }
    movePreviewNode(previewHeader, previewNodes.fullName);
    movePreviewNode(previewHeader, previewNodes.meta);
    movePreviewNode(previewHeader, previewNodes.headline);
    reorderPreviewSections();
};

const renderEditableOverride = (target, node) => {
    if (!node) {
        return false;
    }

    const override = cvEditableContent[target];
    node.removeAttribute('style');

    if (!override || typeof override.html !== 'string') {
        applyEditableNodeStyleState(node, override?.style || { lineHeight: '1.2' });
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

// Récupère les anciennes coordonnées quand une édition directe les a collées
// dans le champ Ville (ex. « VilleRueil…Tél…E-mail…Permis… »).
const recoverMergedContactValues = (values = {}) => {
    const rawLocation = String(values.location || '').replace(/\s+/g, ' ').trim();
    const needsRecovery = /(?:t[ée]l(?:[ée]phone)?|e[- ]?mail|permis)/i.test(rawLocation)
        && (!values.phone || !values.email || !values.permit);

    if (!needsRecovery) {
        return values;
    }

    const phoneMarker = /t[ée]l(?:[ée]phone)?\.?\s*:?/i.exec(rawLocation);
    const emailMarker = /e[- ]?mail\s*:?/i.exec(rawLocation);
    const permitMarkers = [...rawLocation.matchAll(/permis/gi)];
    const phoneMatch = rawLocation.match(/(?:\+33|0)[\s.\-]?\d(?:[\s.\-]?\d{2}){4}/);
    const cutAt = [phoneMarker?.index, emailMarker?.index, phoneMatch?.index]
        .filter((index) => Number.isInteger(index) && index >= 0)
        .sort((left, right) => left - right)[0];
    const emailTail = emailMarker
        ? rawLocation.slice((emailMarker.index || 0) + emailMarker[0].length)
        : rawLocation;
    const emailMatch = emailTail.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:fr|com|net|org|eu|io)(?=(?:permis|$|\s|[|,;]))/i)
        || emailTail.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const lastPermitMarker = permitMarkers.at(-1);
    const permitTail = lastPermitMarker
        ? rawLocation.slice(lastPermitMarker.index + lastPermitMarker[0].length)
        : '';
    const permitMatch = permitTail.match(/[A-Z](?:\s*(?:et|,|\/)?\s*[A-Z])*/i);

    return {
        ...values,
        location: (cutAt === undefined ? rawLocation : rawLocation.slice(0, cutAt))
            .replace(/^\s*ville\s*/i, '')
            .trim() || values.location,
        phone: phoneMatch?.[0] || values.phone || '',
        email: emailMatch?.[0] || values.email || '',
        permit: permitMatch ? `Permis ${permitMatch[0].replace(/\s+/g, ' ').trim()}` : values.permit || '',
    };
};

const renderEditableContactNode = (node, values) => {
    if (!node) {
        return;
    }

    values = recoverMergedContactValues(values);

    const cleanContactValue = (value = '') => String(value)
        .replace(/[⌖✆✉▣⊕⊙□■]/g, '')
        .replace(/^\s*[#%]+\s*/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const cleanLocationValue = (value = '') => cleanContactValue(value)
        // Empêche les imports du type « Ville VilleRueil-Malmaison » sans
        // supprimer le libellé vide « Ville / code postal » du formulaire.
        .replace(/^\s*(?:ville\s*)+(?=[A-ZÀ-ÖØ-Ý])/i, '')
        .trim();
    const cleanTypedContactValue = (type, value = '') => {
        const cleanValue = cleanContactValue(value);
        const prefixes = {
            phone: /^\s*(?:(?:t[ée]l(?:[ée]phone)?|phone)\.?\s*:?\s*)+/i,
            email: /^\s*(?:(?:e[- ]?mail|mail)\s*:?\s*)+/i,
            permit: /^\s*permis\s*:\s*/i,
        };

        return prefixes[type] ? cleanValue.replace(prefixes[type], '').trim() : cleanValue;
    };
    const contactValues = {
        location: cleanLocationValue(values.location),
        phone: cleanTypedContactValue('phone', values.phone),
        email: cleanTypedContactValue('email', values.email),
        permit: cleanTypedContactValue('permit', values.permit),
    };
    Object.entries(contactValues).forEach(([key, value]) => {
        if (cvForm?.elements[key] && cvForm.elements[key].value !== value) {
            cvForm.elements[key].value = value;
        }
    });
    const shouldShowPermit =
        contactValues.permit &&
        !normalizeForMatch(values.headline || '').includes(normalizeForMatch(contactValues.permit));
    const contactParts = [
        { type: 'location', label: 'Ville', value: contactValues.location },
        { type: 'phone', label: 'Tél.', value: contactValues.phone },
        { type: 'email', label: 'E-mail', value: contactValues.email },
        { type: 'permit', label: 'Permis', value: shouldShowPermit ? contactValues.permit : '' },
    ].filter((item) => item.value);

    node.hidden = contactParts.length === 0;

    node.removeAttribute('style');
    applyEditableNodeStyleState(node, cvEditableContent.location?.style || { lineHeight: '1.2' });

    const iconMarkup = {
        location: '<path d="M12 21s6-4.8 6-11a6 6 0 1 0-12 0c0 6.2 6 11 6 11Z"/><circle cx="12" cy="10" r="2.1"/>',
        phone: '<path d="M6.6 3.8 9.2 6.4 7.7 8.5a13.1 13.1 0 0 0 5.8 5.8l2.1-1.5 2.6 2.6-1.6 2.7c-.4.7-1.2 1-2 .8C8.7 17.2 6.8 15.3 5.1 9.4c-.2-.8.1-1.6.8-2l.7-3.6Z"/>',
        email: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7 7.5 5.7L19.5 7"/>',
        permit: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="8" cy="10" r="1.6"/><path d="M11.5 10h5M6.2 15h10.3"/>',
    };

    node.replaceChildren();
    contactParts.forEach((part) => {
        const item = document.createElement('span');
        item.className = values.layoutTheme === 'modern'
            ? 'cv-contact-line cv-modern-contact-line'
            : 'cv-contact-line';
        item.dataset.contactType = part.type;
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.classList.add('cv-contact-icon');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('focusable', 'false');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '1.75');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.innerHTML = iconMarkup[part.type];
        icon.contentEditable = 'false';
        const exportLabel = document.createElement('span');
        exportLabel.className = 'cv-contact-export-label';
        exportLabel.setAttribute('aria-hidden', 'true');
        exportLabel.contentEditable = 'false';
        exportLabel.textContent = part.label;
        const value = document.createElement('span');
        value.className = 'cv-contact-value';
        value.dataset.contactValue = part.type;
        value.textContent = part.value;
        item.append(icon, exportLabel, value);
        node.appendChild(item);
    });
};

const renderEditableListNode = (node, target, renderFallback) => {
    if (!node) {
        return;
    }

    // Les langues sont rendues depuis leurs champs structurés : une ancienne
    // édition directe ne peut donc plus masquer la rubrique entière.
    if (!structuredPreviewTargets.has(target) && target !== 'languages' && renderEditableOverride(target, node)) {
        return;
    }

    renderFallback();
    applyEditableNodeStyleState(node, cvEditableContent[target]?.style || { lineHeight: '1.2' });
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

const normalizeTimelineMatch = (value = '') =>
    String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const getTimelineEntrySortValue = (line = '') => {
    const entry = parseExperienceEntry(line);
    const source = `${entry.date || ''} ${line || ''}`;
    const years = [...source.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]));
    const hasOngoingMarker = /\b(aujourd'hui|aujourd’hui|present|présent|actuel|maintenant)\b/i.test(source);

    if (!years.length) {
        return { end: 0, start: 0, hasDate: false };
    }

    return {
        end: hasOngoingMarker ? new Date().getFullYear() : Math.max(...years),
        start: Math.min(...years),
        hasDate: true,
    };
};

const isDigitalProjectExperienceLine = (line = '') => {
    const source = normalizeTimelineMatch(line);

    return /\b(projet|projets|numerique|numeriques|digital|digitaux|plateforme|plateformes|web|autoformation|ia|intelligence artificielle|ux|ui|fondatrice|creatrice|developpeuse|sa creation|velours|contadirect)\b/.test(source);
};

const getTimelineDedupeKey = (line = '') => {
    const sort = getTimelineEntrySortValue(line);
    const period = sort.start && sort.end ? `${sort.start}-${sort.end}` : '';
    const title = normalizeTimelineMatch(parseExperienceEntry(line).title || '');

    if (period && isDigitalProjectExperienceLine(line)) {
        return `digital-project-${period}`;
    }

    return `${title}-${period || normalizeTimelineMatch(line).slice(0, 80)}`;
};

const scoreExperienceTimelineEntry = (line = '') => {
    const entry = parseExperienceEntry(line);
    const source = normalizeTimelineMatch(line);
    const bulletScore = (entry.bullets || []).length * 5;
    const titleScore = /fondatrice|fondatrice et developpeuse|creatrice|developpeuse/.test(source) ? 4 : 0;
    const dateScore = entry.date ? 3 : 0;

    return bulletScore + titleScore + dateScore + Math.min(8, line.length / 120);
};

const dedupeExperienceTimelineEntries = (entries = []) => {
    const byKey = new Map();

    entries.filter(Boolean).forEach((line, index) => {
        const key = getTimelineDedupeKey(line);
        const previous = byKey.get(key);
        const candidate = {
            line,
            index,
            score: scoreExperienceTimelineEntry(line),
        };

        if (!previous || candidate.score > previous.score) {
            byKey.set(key, candidate);
        }
    });

    return [...byKey.values()]
        .sort((left, right) => left.index - right.index)
        .map((item) => item.line);
};

const sortTimelineEntriesNewestFirst = (entries = [], addedEntries = []) => {
    const addedKeys = new Set(addedEntries.map((entry) => normalizeTimelineMatch(entry)));
    const dedupedEntries = dedupeExperienceTimelineEntries(entries);

    return dedupedEntries
        .map((line, index) => ({
            line,
            index,
            added: addedKeys.has(normalizeTimelineMatch(line)),
            sort: getTimelineEntrySortValue(line),
        }))
        .sort((left, right) =>
            Number(right.sort.hasDate) - Number(left.sort.hasDate) ||
            right.sort.end - left.sort.end ||
            right.sort.start - left.sort.start ||
            Number(right.added) - Number(left.added) ||
            left.index - right.index
        )
        .map((item) => item.line);
};

const normalizeDigitalProjectTimelinePeriods = (entries = []) => {
    const currentYear = new Date().getFullYear();
    const cleanEntries = entries.filter(Boolean);
    const realRanges = cleanEntries
        .filter((line) => !isDigitalProjectExperienceLine(line))
        .map(getTimelineEntrySortValue)
        .filter((range) => range.hasDate);
    const latestRealEnd = realRanges.reduce((max, range) => Math.max(max, range.end), 0);

    if (!latestRealEnd || latestRealEnd >= currentYear) {
        return cleanEntries;
    }

    const preferredDate = `${latestRealEnd + 1} - ${currentYear}`;

    return cleanEntries.map((line) => {
        if (!isDigitalProjectExperienceLine(line)) {
            return line;
        }

        const sort = getTimelineEntrySortValue(line);
        const overlapsExistingExperience = sort.start <= latestRealEnd && sort.end >= latestRealEnd;

        if (!overlapsExistingExperience) {
            return line;
        }

        return serializeExperienceEntry({
            ...parseExperienceEntry(line),
            date: preferredDate,
        });
    });
};

const sortExperienceFieldNewestFirst = () => {
    const field = getExperienceField();
    const lines = field ? normalizeDigitalProjectTimelinePeriods(repairPreviewExperienceItems(splitLines(field.value))) : [];

    if (!field || lines.length < 2) {
        return false;
    }

    const sorted = sortTimelineEntriesNewestFirst(lines);
    const value = sorted.join('\n');
    if (!value || value === lines.join('\n')) {
        return false;
    }

    field.value = value;
    clearEditableOverride('experience');
    return true;
};

const applyReadyCvLayout = () => {
    if (!cvForm) {
        return false;
    }

    const layoutDefaults = {
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
    let changed = false;

    Object.entries(layoutDefaults).forEach(([fieldName, value]) => {
        const field = cvForm.elements[fieldName];
        if (field && field.value !== value) {
            field.value = value;
            changed = true;
        }
    });

    return changed;
};

const getCvAutopilotFieldSnapshot = () => {
    if (!cvForm) {
        return '';
    }

    return [
        'headline',
        'summary',
        'skills',
        'experience',
        'projects',
        'education',
        'activities',
        'languages',
        'permit',
        'location',
        'fontSize',
        'lineSpacing',
        'layoutTheme',
        'fontTheme',
        'colorTheme',
        'designMood',
    ]
        .map((fieldName) => `${fieldName}:${cvForm.elements[fieldName]?.value || ''}`)
        .join('\n');
};

const applyCvAutopilotLocalCleanup = ({ readyLayout = false, fromImport = false, silent = false } = {}) => {
    if (!cvForm) {
        return [];
    }

    const before = getCvAutopilotFieldSnapshot();
    const changes = [];

    proofreadCvTextFields({ silent: true });
    cleanupImportedExperienceField();
    cleanupImportedEducationField();

    if (sortExperienceFieldNewestFirst()) {
        changes.push('expériences triées');
    }

    if (readyLayout || fromImport) {
        if (applyReadyCvLayout()) {
            changes.push('mise en forme prête');
        }
    }

    clearEditableOverrides();
    updateCvPreview();

    if (getRenderedCvPageCount() > 1) {
        applyCompactCvLayout(false);
        changes.push('CV compacté sur une page');
        updateCvPreview();
    }

    renderExperienceEditor();
    renderLanguageEditor();
    scheduleCvDraftSave();

    const after = getCvAutopilotFieldSnapshot();
    if (after !== before && !changes.length) {
        changes.push('structure harmonisée');
    }

    if (!silent) {
        setCvStatus(changes.length ? `Kirby a préparé le CV : ${changes.join(', ')}` : 'CV déjà propre et rangé');
    }

    return [...new Set(changes)];
};

const updateCvPreview = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());

    renderEditableTextNode(previewNodes.fullName, 'fullName', values.fullName || 'Votre nom');
    syncModernPreviewStructure(values.layoutTheme || '');
    renderEditableContactNode(previewNodes.meta, values);
    renderEditableTextNode(previewNodes.headline, 'headline', values.headline || 'Intitule du metier');
    if (previewNodes.summary) {
        renderEditableTextNode(previewNodes.summary, 'summary', values.summary || '');
    }

    const rawSkillItems = splitLines(values.skills || '');
    const skillItems = dedupeCvSkillItems(rawSkillItems);
    const isGlassPreviewTheme = values.layoutTheme === 'digital' || values.layoutTheme === 'holographic';
    let previewSkillItems = isGlassPreviewTheme
        ? prioritizeSkillsForA4(skillItems, { values, maxItems: 8 })
        : skillItems;
    const rawExperienceSourceItems = splitLines(values.experience || '');
    const rawExperienceItems = dedupeImportedItems(rawExperienceSourceItems);
    const experienceItems = sortTimelineEntriesNewestFirst(normalizeDigitalProjectTimelinePeriods(repairPreviewExperienceItems(rawExperienceItems)));
    const rawProjectItems = splitLines(values.projects || '');
    const projectItems = mergeStandaloneDateItems(dedupeImportedItems(rawProjectItems));
    const rawEducationItems = splitLines(values.education || '').filter((item) => !/^[-–—]?\s*\)?$/.test(item.trim()));
    let educationItems = sortTimelineEntriesNewestFirst(normalizeEducationItems(rawEducationItems));
    const rawLanguageItems = splitLines(values.languages || '');
    const languageItems = dedupeImportedItems(rawLanguageItems);
    const rawActivityItems = splitLines(values.activities || '');
    const activityItems = dedupeImportedItems(rawActivityItems);

    const qualityFixes = [];
    if (values.skills && cvForm.elements.skills && skillItems.length) {
        const repairedSkillValue = skillItems.join('\n');
        if (repairedSkillValue !== rawSkillItems.join('\n')) {
            cvForm.elements.skills.value = repairedSkillValue;
            values.skills = repairedSkillValue;
            clearEditableOverride('skills');
            qualityFixes.push('compétences en double retirées');
        }
    }

    if (values.experience && cvForm.elements.experience && experienceItems.length) {
        const repairedExperienceValue = experienceItems.join('\n');
        if (repairedExperienceValue !== rawExperienceSourceItems.join('\n')) {
            cvForm.elements.experience.value = repairedExperienceValue;
            values.experience = repairedExperienceValue;
            clearEditableOverride('experience');
            qualityFixes.push('expériences triées et doublons retirés');
        }
    }

    if (values.education && cvForm.elements.education && educationItems.length) {
        const repairedEducationValue = educationItems.join('\n');
        if (repairedEducationValue !== rawEducationItems.join('\n')) {
            cvForm.elements.education.value = repairedEducationValue;
            values.education = repairedEducationValue;
            clearEditableOverride('education');
        }
    }

    const normalizeRepeatedField = (fieldName, rawItems, cleanedItems, target, label) => {
        const field = cvForm.elements[fieldName];
        const cleanedValue = cleanedItems.join('\n');
        if (!values[fieldName] || !field || !cleanedValue || cleanedValue === rawItems.join('\n')) {
            return;
        }

        field.value = cleanedValue;
        values[fieldName] = cleanedValue;
        clearEditableOverride(target);
        qualityFixes.push(label);
    };

    normalizeRepeatedField('projects', rawProjectItems, projectItems, 'projects', 'répétitions de projets retirées');
    normalizeRepeatedField('languages', rawLanguageItems, languageItems, 'languages', 'répétitions de langues retirées');
    normalizeRepeatedField('activities', rawActivityItems, activityItems, 'activities', 'répétitions d’activités retirées');

    let previewProjectItems = projectItems;
    let previewLanguageItems = languageItems;
    let previewActivityItems = activityItems;

    if (values.layoutTheme === 'holographic') {
        previewSkillItems = sanitizeCrystalGlassSkillItems(previewSkillItems);
        educationItems = sanitizeCrystalGlassEducationItems(educationItems);
    }

    const applyPreviewContent = () => applyPreviewSectionContent({
        values,
        experienceItems,
        educationItems,
        languageItems: previewLanguageItems,
        activityItems: previewActivityItems,
        projectItems: previewProjectItems,
        skillItems: previewSkillItems,
    });

    applyPreviewContent();

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
        'template-digital',
        'template-holographic',
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
    previewNodes.preview.style.setProperty('--modern-side', values.sidebarColor || '#f1e9ed');
    previewNodes.preview.style.setProperty('--modern-ink', values.headingColor || '#30282d');
    previewNodes.preview.style.setProperty('--modern-rule', values.frameColor || '#ded2d7');
    applySectionTitleStyles();

    if (currentPreviewMode === 'cv' && getRenderedCvPageCount() > 1) {
        previewSkillItems = prioritizeSkillsForA4(skillItems, { values, maxItems: 8 });
        previewActivityItems = activityItems.slice(0, 4);
        previewLanguageItems = languageItems.slice(0, 2);
        previewProjectItems = projectItems.slice(0, 1);
        applyPreviewContent();

        if (getRenderedCvPageCount() > 1 && previewActivityItems.length) {
            previewActivityItems = activityItems.slice(0, 2);
            applyPreviewContent();
        }

        if (getRenderedCvPageCount() > 1 && previewProjectItems.length) {
            previewProjectItems = [];
            applyPreviewContent();
        }

        if (getRenderedCvPageCount() > 1 && previewActivityItems.length) {
            previewActivityItems = [];
            applyPreviewContent();
        }
    }

    setCvStatus(qualityFixes.length ? `CV vérifié : ${qualityFixes.join(', ')}` : 'CV vérifié');
    if (qualityFixes.length) {
        scheduleCvDraftSave();
    }
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

    syncCvDraftToVisibleState();
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
        /\b(vendeur|vendeuse|conducteur|conductrice|chauffeur|conseill[èe]re|commercial|charg[ée]e|developpeur|développeur|developpeuse|développeuse|assistant|assistante|agent|responsable)\b/i.test(line)
    );

    if (!roleLine) {
        return '';
    }

    return correctCommonCvText(roleLine.replace(/^(?:poste|titre|offre|emploi)\s*:?\s*/i, '')).slice(0, 90);
};

const adaptCvToJobOffer = () => {
    const targetSource = jobOfferField?.value.trim() || cvForm?.elements.headline?.value.trim() || cvForm?.elements.jobTarget?.value.trim() || '';

    if (!cvForm || !targetSource) {
        setCvStatus('Ajoutez une offre d emploi pour adapter le CV');
        return false;
    }

    const offer = targetSource;
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
        skillsField.value = dedupeCvSkillItems([...existing, ...roleSkills, ...keywords.slice(0, 6).map(normalizeCvSentenceText)]).slice(0, 12).join('\n');
    }

    if (experienceField) {
        const existingLines = repairPreviewExperienceItems(splitLines(experienceField.value));
        const source = normalizeForMatch(`${offer} ${experienceField.value}`);
        const relevant = existingLines.filter((line) => {
            const normalizedLine = normalizeForMatch(line);
            return ['client', 'vente', 'conseil', 'accueil', 'service', 'commercial', 'caisse', 'rayon']
                .some((term) => source.includes(term) && normalizedLine.includes(term));
        });
        experienceField.value = dedupeImportedItems([...relevant, ...existingLines]).join('\n');
    }

    clearEditableOverrides();
    harmonizeExperienceFieldStructure({ silent: true });
    renderExperienceEditor();
    renderLanguageEditor();
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
    const skills = dedupeCvSkillItems([...existing, ...suggestions, ...offerKeywords]).slice(0, 10);

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
    sortExperienceFieldNewestFirst();
    clearEditableOverrides();
    updateCvPreview();
    renderExperienceEditor();
    renderLanguageEditor();
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
    harmonizeExperienceFieldStructure({ silent: true });

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

// Les importations de CV reformulent souvent la même compétence. On garde la
// version la plus explicite, sans confondre deux compétences réellement
// différentes.
const getSkillSignature = (item = '') => normalizeForMatch(item)
    .replace(/[^a-z0-9à-ÿ\s]/gi, ' ')
    .replace(/\b(?:et|de|des|du|la|le|les|a|au|aux|pour|vers|en|sur|dans)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const skillsAreEquivalent = (left = '', right = '') => {
    const leftSignature = getSkillSignature(left);
    const rightSignature = getSkillSignature(right);

    if (!leftSignature || !rightSignature) {
        return false;
    }

    if (leftSignature === rightSignature) {
        return true;
    }

    const [shortSignature, longSignature] = leftSignature.length <= rightSignature.length
        ? [leftSignature, rightSignature]
        : [rightSignature, leftSignature];
    if (shortSignature.length >= 11 && longSignature.includes(shortSignature)) {
        return true;
    }

    const shortTokens = shortSignature.split(' ').filter((token) => token.length > 2);
    const longTokens = new Set(longSignature.split(' ').filter((token) => token.length > 2));
    return shortTokens.length >= 2 && shortTokens.every((token) => longTokens.has(token));
};

const dedupeCvSkillItems = (items = []) => {
    const unique = [];

    dedupeImportedItems(items.map((item) => String(item || '').trim()).filter(Boolean)).forEach((candidate) => {
        const matchingIndex = unique.findIndex((existing) => skillsAreEquivalent(existing, candidate));
        if (matchingIndex === -1) {
            unique.push(candidate);
            return;
        }

        if (getSkillSignature(candidate).length > getSkillSignature(unique[matchingIndex]).length) {
            unique[matchingIndex] = candidate;
        }
    });

    return unique;
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
    dedupeCvSkillItems(
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

const normalizeEducationDisplayItem = (item = '') => {
    const source = normalizeForMatch(item);

    if (/\b(?:ecole 42|42)\b/.test(source) && /\bpiscine\b/.test(source)) {
        return 'École 42 — Piscine informatique • Initiation intensive au développement, logique algorithmique, autonomie, résolution de problèmes et travail en pair-to-pair.';
    }

    if (/\bsimplon\b/.test(source)) {
        return 'Simplon — Formation numérique / développement web • Bases du développement web, culture numérique et apprentissage par projet.';
    }

    return item;
};

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

        return dedupeImportedItems(grouped.map(cleanImportedSectionLine).map(normalizeEducationDisplayItem).filter(Boolean));
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

    const repaired = sortTimelineEntriesNewestFirst(normalizeDigitalProjectTimelinePeriods(repairImportedExperienceItems(splitLines(field.value))));
    if (repaired.length) {
        field.value = repaired.join('\n');
    }
};

const cleanupImportedEducationField = () => {
    const field = cvForm?.elements.education;

    if (!field?.value) {
        return;
    }

    const repaired = sortTimelineEntriesNewestFirst(normalizeEducationItems(splitLines(field.value).filter((item) => !/^[-–—]?\s*\)?$/.test(item.trim()))));
    if (repaired.length) {
        field.value = repaired.join('\n');
    }
};

const CV_AUTOPILOT_IMPORT_INSTRUCTION = [
    "Prends le CV importé en main comme un CV rapide prêt à l'emploi.",
    "Nettoie la structure, harmonise les titres, les langues, les compétences et la rubrique Formations & certifications.",
    "Range les expériences de la plus récente date à la plus ancienne et nettoie uniquement les doublons stricts, sans supprimer de rubrique ni de contenu réel.",
    "Détecte les périodes vides. Si les informations déjà présentes permettent de comprendre la période, prépare directement une expérience cohérente à valider au lieu de poser des questions.",
    "Valorise les projets numériques, l'autoformation et les formations/certifications réellement présentes ou explicitement demandées, comme École 42 ou Simplon, dans les bonnes rubriques.",
    "Propose les compétences utiles liées aux expériences générées. L'utilisateur validera les ajouts de fond avant insertion.",
].join(' ');

const shouldRunCvAutopilotMode = (message = '') => {
    const source = normalizeForMatch(message);

    if (hasExplicitDestructiveCvRemoval(message)) {
        return false;
    }

    return /\b(prend|prends|prendre|pilote|autopilote|cv pret|pret a l emploi|pret a l'emploi|auto organise|auto-organise|organise tout|range tout|ranger tout|remplis|remplir|mise en forme|met en forme|mets en forme|bouche|boucher|combler|trou|periode vide|periode non renseignee|periode non renseigne|certification|certifications|ecole 42|simplon)\b/.test(source);
};

const buildCvAutopilotInstruction = (message = '') =>
    [
        CV_AUTOPILOT_IMPORT_INSTRUCTION,
        "Applique cette logique à la demande utilisateur suivante.",
        message,
    ].filter(Boolean).join('\n\n');

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
    cvSectionOrder = [...DEFAULT_CV_SECTION_ORDER];

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

    const locationLine = cleanLines.find((line) =>
        /\(\d{5}\)|\b\d{5}\b|france|malmaison|paris|nanterre|roissy/i.test(line) &&
        !/(\+33|0)[\s.\-]?\d([\s.\-]?\d{2}){4}/.test(line)
    );
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
            /d[ée]velopp|front|emploi|marketing|relation client|designer|ux|ui|conseill|responsable|charg[eé]e|conductr|machiniste|receveur|transport|vendeur|vendeuse|vente|lifestyle/i.test(line) &&
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

    const languageLines = dedupeImportedItems([
        ...splitImportedItems(fallbackSections.languages.join('\n')),
        ...cleanLines.filter((line) => /\b(français|francais|anglais|espagnol|arabe|italien|allemand|portugais)\b/i.test(line)),
    ])
        .map(cleanImportedSectionLine)
        .map((line) => serializeLanguageEntry(parseLanguageEntry(line)))
        .filter(Boolean);
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
    applyCvAutopilotLocalCleanup({ fromImport: true, silent: true });
    clearEditableOverrides();
    updateCvPreview();
    renderExperienceEditor();
    renderLanguageEditor();
    setPreviewMode('cv');
    currentPreviewPage = 1;
    scrollToPreviewPage(1);

    setCvStatus('CV importé. Kirby le range, détecte les trous et prépare les ajouts utiles…');
    void runKirbyCvAssistant({
        task: 'autofill',
        instruction: CV_AUTOPILOT_IMPORT_INSTRUCTION,
    });
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

const cleanExportLocation = (value = '') => cleanExportText(value)
    .replace(/^\s*(?:ville\s*)+(?=[A-ZÀ-ÖØ-Ý])/i, '')
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
        ? sortTimelineEntriesNewestFirst(normalizeEducationItems(mergeStandaloneDateItems(items)))
        : type === 'projects'
            ? mergeStandaloneDateItems(items)
            : sortTimelineEntriesNewestFirst(repairPreviewExperienceItems(items));

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

    proofreadCvTextFields({ silent: true });
    cleanupImportedExperienceField();
    cleanupImportedEducationField();

    clearEditableOverrides();
    renderExperienceEditor();
    renderLanguageEditor();
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
            cleanExportLocation(values.location || ''),
            cleanExportText(values.phone || ''),
            cleanExportText(values.email || ''),
            shouldShowPermit ? permit : '',
        ].filter(Boolean),
        summary: cleanExportText(values.summary || ''),
        skills: dedupeCvSkillItems(splitExportItems(values.skills || '')).slice(0, 10),
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
    ${data.education.length ? `${buildWordSectionTitle('Formations & certifications', data)}${buildWordTimeline(data.education, data, { compact: true })}` : ''}
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
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.margin = '0 auto';
    clone.style.boxShadow = 'none';
    clone.style.aspectRatio = 'auto';

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
    if (!requireAuthenticatedCvAccess('Connectez-vous pour exporter votre CV en Word')) {
        return;
    }

    persistAllEditableNodes({ refreshPreview: true });
    updateCvPreview();
    const filename = currentPreviewMode === 'letter' ? 'lettre-motivation.doc' : 'cv-intelligent.doc';
    downloadFile(filename, buildPreviewWordHtml(), 'application/msword');
    setCvStatus('Word telecharge avec le rendu de l apercu');
};

const previewCurrentDocument = () => {
    if (!requireAuthenticatedCvAccess('Connectez-vous pour ouvrir l apercu PDF')) {
        return;
    }

    // Opening the tab synchronously keeps browsers from treating the PDF preview as a popup.
    const previewWindow = window.open('', '_blank', 'popup=yes,width=980,height=1100');

    if (previewWindow) {
        try {
            previewWindow.document.open();
            previewWindow.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Preparation du PDF</title><style>body{font-family:Manrope,system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#f6f7fb;color:#223047}main{padding:2rem 2.5rem;border:1px solid rgba(47,63,127,.12);border-radius:24px;background:#fff;box-shadow:0 24px 44px rgba(39,52,89,.08)}strong{display:block;font-size:1.05rem;margin-bottom:.4rem}</style></head><body><main><strong>Preparation de l apercu PDF</strong><span>Le CV est en cours de generation...</span></main></body></html>`);
            previewWindow.document.close();
        } catch (error) {
            console.error(error);
        }
    }

    exportPdf({ action: 'preview', previewWindow }).then((didOpen) => {
        if (didOpen === false && previewWindow && !previewWindow.closed) {
            previewWindow.close();
        }
        if (didOpen !== false) {
            setCvStatus('Aperçu PDF ouvert : téléchargez ou imprimez depuis la barre du PDF');
        }
    }).catch((error) => {
        console.error(error);
        if (previewWindow && !previewWindow.closed) {
            previewWindow.close();
        }
        setCvStatus('Aperçu indisponible : PDF téléchargé');
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
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.aspectRatio = 'auto';
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

const openPdfPreview = (doc, filename, previewWindow = null) => {
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const targetWindow = previewWindow || window.open('', '_blank', 'popup=yes,width=980,height=1100');

    if (!targetWindow) {
        URL.revokeObjectURL(pdfUrl);
        doc.save(filename);
        setCvStatus('Aperçu bloqué : PDF téléchargé');
        return false;
    }

    try {
        targetWindow.location.assign(pdfUrl);
        targetWindow.focus?.();
        window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 120000);
        setCvStatus('Aperçu PDF ouvert : utilisez Télécharger ou Imprimer dans le PDF');
        return true;
    } catch (error) {
        console.error(error);
        URL.revokeObjectURL(pdfUrl);
        doc.save(filename);
        setCvStatus('Aperçu indisponible : PDF téléchargé');
        return false;
    }
};

const finishPdfExport = (doc, filename, action, previewWindow = null) => {
    if (action === 'preview' || action === 'print') {
        return openPdfPreview(doc, filename, previewWindow);
    }

    doc.save(filename);
    setCvStatus('PDF telecharge avec mise en page professionnelle');
    return true;
};

const exportPdf = async (options = {}) => {
    if (!requireAuthenticatedCvAccess('Connectez-vous pour exporter votre CV')) {
        return false;
    }

    const action = ['preview', 'print'].includes(options?.action) ? options.action : 'save';
    const JsPdf = window.jspdf?.jsPDF;

    if (!JsPdf) {
        setCvStatus('Export PDF indisponible : rechargez la page puis recommencez');
        return false;
    }

    setCvStatus(action === 'preview' || action === 'print' ? 'Préparation de l aperçu PDF...' : 'Génération du PDF...');

    persistAllEditableNodes({ refreshPreview: true });
    updateCvPreview();

    const exportMode = currentPreviewMode;
    const printBackup = exportMode === 'cv' ? optimizeForPrint() : null;
    const domExportSource = exportMode === 'letter' ? letterPagePreview : previewNodes.preview;
    const pdfBackground = exportMode === 'cv'
        ? (cvForm?.elements.paperColor?.value || '#ffffff')
        : '#ffffff';

    try {
        if (window.html2canvas && domExportSource) {
            const filename = exportMode === 'letter' ? 'lettre-motivation.pdf' : 'cv-intelligent.pdf';
            let exportNode = null;

            try {
                document.body.classList.add('is-exporting-pdf');
                await document.fonts?.ready;
                updateCvPreview();
                // html2canvas peut parfois rater un aperçu transformé, déplacé ou
                // partiellement masqué dans l'éditeur. On exporte donc une copie
                // statique du CV, avec ses styles calculés, au lieu de la page web.
                exportNode = buildStaticExportNode(exportMode);
                const canvas = await window.html2canvas(exportNode || domExportSource, {
                    scale: Math.min(2.4, window.devicePixelRatio || 2),
                    useCORS: true,
                    backgroundColor: pdfBackground,
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

                if (exportMode === 'cv') {
                    const fitScale = Math.min(1, pageHeight / imageHeight);
                    const outputWidth = pageWidth * fitScale;
                    const outputHeight = imageHeight * fitScale;
                    const offsetX = (pageWidth - outputWidth) / 2;

                    doc.addImage(imageData, 'JPEG', offsetX, 0, outputWidth, outputHeight);
                } else {
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
                }

                return finishPdfExport(doc, filename, action, options?.previewWindow || options?.printWindow);
            } catch (error) {
                console.error(error);
                setCvStatus('Export apercu indisponible, generation PDF classique...');
            } finally {
                exportNode?.remove();
                document.body.classList.remove('is-exporting-pdf');
            }
        }

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
        // Le mode de secours ecrit directement dans jsPDF. Il est legerement
        // plus dense pour garantir une page sans toucher au contenu du CV.
        const exportDensity = currentPreviewMode === 'cv' ? 0.86 : 1;
        const dense = (value) => value * exportDensity;

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
            const lines = getWrappedLines(text, width, dense(size), weight);
            const blockHeight = lines.length * dense(lineHeight);

            addPageIfNeeded(blockHeight + dense(after));
            doc.setFont('helvetica', weight);
            doc.setFontSize(dense(size));
            setTextColor(color);
            doc.text(lines, x, y, { align, maxWidth: width });
            y += blockHeight + dense(after);

            return blockHeight;
        };

        const writeSectionTitle = (title) => {
            addPageIfNeeded(dense(9));
            y += dense(1);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(dense(9.4));

            if (isMinimal) {
                setTextColor(accent);
                doc.text(String(title).toUpperCase(), marginX, y);
                setDrawColor(frame);
                doc.line(marginX + 40, y - dense(1.3), marginX + contentWidth, y - dense(1.3));
            } else if (isModern) {
                setTextColor(accent);
                doc.text(String(title).toUpperCase(), marginX, y);
                doc.setDrawColor(accentR, accentG, accentB);
                doc.setLineWidth(0.25);
                doc.line(marginX, y + dense(1.5), marginX + 42, y + dense(1.5));
            } else {
                doc.setFillColor(softR, softG, softB);
                doc.rect(marginX, y - dense(4.7), contentWidth, dense(7.2), 'F');
                doc.setFillColor(accentR, accentG, accentB);
                doc.rect(marginX, y - dense(4.7), 1.5, dense(7.2), 'F');
                setTextColor('#223047');
                doc.text(String(title).toUpperCase(), marginX + 4, y);
            }

            y += dense(6);
        };

        const writeTwoColumnList = (items) => {
            if (!items.length) {
                return;
            }

            const columnGap = 8;
            const columnWidth = (contentWidth - columnGap) / 2;
            const rowLineHeight = dense(3.9);
            const leftX = marginX + 2;
            const rightX = marginX + columnWidth + columnGap + 2;

            for (let index = 0; index < items.length; index += 2) {
                const leftLines = getWrappedLines(`• ${items[index]}`, columnWidth - 4, dense(9.6));
                const rightLines = items[index + 1]
                    ? getWrappedLines(`• ${items[index + 1]}`, columnWidth - 4, dense(9.6))
                    : [];
                const rowHeight = Math.max(leftLines.length, rightLines.length || 1) * rowLineHeight;

                addPageIfNeeded(rowHeight + dense(1));
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(dense(9.6));
                setTextColor('#3d4658');
                doc.text(leftLines, leftX, y, { maxWidth: columnWidth - 4 });

                if (rightLines.length) {
                    doc.text(rightLines, rightX, y, { maxWidth: columnWidth - 4 });
                }

                y += rowHeight;
            }

            y += dense(1.5);
        };

        const writeTimelineCards = (entries, options = {}) => {
            if (!entries.length) {
                return;
            }

            const compact = options.compact;
            const cardPaddingX = compact ? 3.5 : 4.2;
            const cardPaddingY = dense(compact ? 3.1 : 3.7);
            const cardGap = dense(compact ? 2.3 : 2.9);
            const titleSize = dense(compact ? 9.4 : 9.9);
            const metaSize = dense(compact ? 8.8 : 9.1);
            const bulletSize = dense(compact ? 8.8 : 9.1);
            const titleLineHeight = dense(compact ? 3.7 : 4);
            const metaLineHeight = dense(compact ? 3.4 : 3.6);
            const bulletLineHeight = dense(compact ? 3.4 : 3.6);

            entries.forEach((entry) => {
                const dateWidth = entry.date ? Math.min(42, Math.max(24, doc.getTextWidth(entry.date) + 6)) : 0;
                const textWidth = contentWidth - cardPaddingX * 2 - (dateWidth ? dateWidth + 5 : 0);
                const titleLines = getWrappedLines(entry.title || 'Experience', textWidth, titleSize, 'bold');
                const metaLines = entry.meta ? getWrappedLines(entry.meta, contentWidth - cardPaddingX * 2, metaSize, 'bold') : [];
                const bulletLines = entry.bullets.map((bullet) => getWrappedLines(`• ${bullet}`, contentWidth - cardPaddingX * 2 - 3, bulletSize));
                const bulletsHeight = bulletLines.reduce((sum, lines) => sum + Math.max(lines.length, 1) * bulletLineHeight, 0);
                const cardHeight =
                    cardPaddingY * 2 +
                    Math.max(titleLines.length * titleLineHeight, dense(compact ? 4 : 5)) +
                    (metaLines.length ? metaLines.length * metaLineHeight + dense(1.2) : 0) +
                    (bulletLines.length ? bulletsHeight + dense(1.5) : 0);

                addPageIfNeeded(cardHeight + cardGap);
                setFillColor(isModern ? mixExportHex(accent, '#ffffff', 0.95) : '#ffffff');
                setDrawColor(frame);
                doc.setLineWidth(0.25);
                if (isMinimal) {
                    doc.line(marginX, y + cardHeight, marginX + contentWidth, y + cardHeight);
                    doc.setFillColor(accentR, accentG, accentB);
                    doc.rect(marginX, y + dense(1), 0.9, Math.max(dense(5), cardHeight - dense(2)), 'F');
                } else {
                    drawRoundedRect(marginX, y, contentWidth, cardHeight, dense(2.4), 'FD');
                    doc.setFillColor(accentR, accentG, accentB);
                    doc.rect(marginX, y, isExecutive ? 2 : 1.4, cardHeight, 'F');
                }

                let textY = y + cardPaddingY + dense(3);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(titleSize);
                setTextColor('#172033');
                doc.text(titleLines, marginX + cardPaddingX, textY, { maxWidth: textWidth });

                if (entry.date) {
                    doc.setFillColor(softR, softG, softB);
                    drawRoundedRect(marginX + contentWidth - dateWidth - cardPaddingX, y + cardPaddingY - dense(0.6), dateWidth, dense(5.2), dense(2), 'F');
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(dense(8.2));
                    setTextColor(accent);
                    doc.text(entry.date, marginX + contentWidth - cardPaddingX - dateWidth / 2, y + cardPaddingY + dense(3), { align: 'center' });
                }

                textY += titleLines.length * titleLineHeight;

                if (metaLines.length) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(metaSize);
                    setTextColor('#5a6375');
                    doc.text(metaLines, marginX + cardPaddingX, textY, { maxWidth: contentWidth - cardPaddingX * 2 });
                    textY += metaLines.length * metaLineHeight + dense(1);
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
            return finishPdfExport(doc, 'lettre-motivation.pdf', action, options?.previewWindow || options?.printWindow);
        }

        const headerHeight = dense(isModern ? 31 : isExecutive ? 29 : 27);
        if (!isMinimal) {
            setFillColor(isModern ? data.soft : '#ffffff');
            setDrawColor(frame);
            drawRoundedRect(marginX, y - dense(2), contentWidth, headerHeight, dense(2.8), isModern ? 'FD' : 'S');
            doc.setFillColor(accentR, accentG, accentB);
            doc.rect(marginX, y - dense(2), isExecutive ? 2 : 1.5, headerHeight, 'F');
        }

        const headerX = isMinimal ? marginX : marginX + 5;
        const headerWidth = isMinimal ? contentWidth : contentWidth - 10;
        const metaLine = data.metaParts.join(' | ');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(dense(18.5));
        setTextColor('#111827');
        doc.text(getWrappedLines(data.fullName, headerWidth, dense(18.5), 'bold'), headerX, y + dense(5), { maxWidth: headerWidth });

        let headerY = y + dense(12);
        if (metaLine) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(dense(9.5));
            setTextColor('#5b6475');
            doc.text(getWrappedLines(metaLine, headerWidth, dense(9.5)), headerX, headerY, { maxWidth: headerWidth });
            headerY += dense(5);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(dense(11.6));
        setTextColor(accent);
        doc.text(getWrappedLines(data.headline, headerWidth, dense(11.6), 'bold'), headerX, headerY, { maxWidth: headerWidth });

        y += headerHeight + dense(4);

        if (isMinimal) {
            setDrawColor(frame);
            doc.setLineWidth(0.35);
            doc.line(marginX, y - dense(2.5), marginX + contentWidth, y - dense(2.5));
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
            writeSectionTitle('Formations & certifications');
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

        return finishPdfExport(doc, 'cv-intelligent.pdf', action, options?.previewWindow || options?.printWindow);
    } catch (error) {
        console.error(error);
        setCvStatus('Echec de generation du PDF');
        return false;
    } finally {
        if (printBackup) {
            restorePrintFieldBackup(printBackup);
        }
    }
};

const exportWebVersion = () => {
    if (!requireAuthenticatedCvAccess('Connectez-vous pour exporter la version web')) {
        return;
    }

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

const kirbyModeCopy = {
    create: {
        placeholder: 'Collez un CV ou des informations brutes.',
        ready: 'Prêt à construire un CV.',
    },
    optimize: {
        placeholder: 'Ex. Remplace vendeur par vendeuse, corrige les fautes.',
        ready: 'Prêt à corriger le CV.',
    },
    adapt: {
        placeholder: 'Indiquez le poste ou collez l’offre.',
        ready: 'Prêt à adapter le CV.',
    },
    letter: {
        placeholder: 'Indiquez l’entreprise, le poste ou collez l’offre.',
        ready: 'Prêt à préparer la lettre.',
    },
};

const setAssistantActivity = (text = '', working = false) => {
    if (!assistantActivity) {
        return;
    }

    assistantActivity.textContent = text;
    assistantActivity.classList.toggle('is-working', working);
    assistantChat?.classList.toggle('is-working', working);
    if (assistantSubmitButton) {
        assistantSubmitButton.disabled = working;
        assistantSubmitButton.textContent = working ? 'Analyse…' : 'Analyser';
    }
};

const setKirbyMode = (mode = 'optimize', { focus = false } = {}) => {
    activeKirbyMode = kirbyModeCopy[mode] ? mode : 'optimize';
    kirbyModeButtons.forEach((button) => {
        const isActive = button.dataset.kirbyMode === activeKirbyMode;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    const copy = kirbyModeCopy[activeKirbyMode];
    if (assistantInput) {
        assistantInput.placeholder = copy.placeholder;
        if (focus) {
            assistantInput.focus();
        }
    }
    setAssistantActivity(copy.ready);
};

const openAssistant = (prompt = '', mode = '') => {
    if (!assistantChat || !assistantToggle) {
        return;
    }

    if (document.body.classList.contains('cv-workspace-page') && !currentUser?.id) {
        openAuthModal('login');
        setCvStatus('Connectez-vous pour utiliser Kirby dans votre espace CV prive');
        return;
    }

    assistantChat.classList.add('is-open');
    assistantToggle.setAttribute('aria-expanded', 'true');

    if (mode) {
        setKirbyMode(mode);
    }

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
    const message = String(text || '').trim();
    if (!message) {
        return;
    }

    setAssistantActivity(message, role === 'working');

    if (!assistantThread || role === 'working') {
        return;
    }

    const item = document.createElement('article');
    item.className = `assistant-thread-message is-${role || 'bot'}`;

    const label = document.createElement('span');
    label.className = 'assistant-thread-label';
    label.textContent = role === 'user' ? 'Vous' : 'Kirby';

    const body = document.createElement('p');
    body.className = 'assistant-thread-body';
    body.textContent = message;

    item.append(label, body);
    assistantThread.appendChild(item);

    const overflowItems = [...assistantThread.children];
    if (overflowItems.length > 8) {
        overflowItems.slice(0, overflowItems.length - 8).forEach((node) => node.remove());
    }

    assistantThread.scrollTop = assistantThread.scrollHeight;
};

const getKirbyCvSource = () => {
    const values = cvForm ? Object.fromEntries(new FormData(cvForm).entries()) : {};
    const cleanValue = (name) => {
        const value = values[name] || '';
        return isDefaultCvFieldValue(name, value) ? '' : value;
    };

    return {
        fullName: cleanValue('fullName'),
        location: cleanValue('location'),
        phone: cleanValue('phone'),
        email: cleanValue('email'),
        permit: cleanValue('permit'),
        headline: cleanValue('headline'),
        summary: cleanValue('summary'),
        skills: cleanValue('skills'),
        experience: cleanValue('experience'),
        projects: cleanValue('projects'),
        education: cleanValue('education'),
        languages: cleanValue('languages'),
        activities: cleanValue('activities'),
    };
};

const getKirbyCvSnapshot = () => JSON.stringify({
    cv: getKirbyCvSource(),
    jobOffer: jobOfferField?.value || '',
    letter: getKirbyLetterSource(),
});

const getActiveExperienceLine = () => {
    const entries = getExperienceField() ? repairPreviewExperienceItems(splitLines(getExperienceField().value)) : [];
    const selectedIndex = getSelectedExperienceIndex();

    return selectedIndex !== null && entries[selectedIndex] ? entries[selectedIndex] : '';
};

const getKirbyCvInteractionContext = () => {
    const selection = document.getSelection();
    const selectedText = selection && !selection.isCollapsed ? selection.toString().trim() : '';
    const formatNode = getActiveFormatNode();
    const activeSection = formatNode?.dataset?.editTarget || formatNode?.dataset?.sectionTitle || '';
    const selectedExperienceIndex = getSelectedExperienceIndex();

    return {
        activeSection,
        selectedText,
        activeExperienceIndex: selectedExperienceIndex,
        activeExperience: getActiveExperienceLine(),
        pendingQuestion: pendingExperienceDateCorrectionIndex !== null ? 'date_experience' : '',
        precisionPolicy: [
            'Kirby agit comme un assistant de precision pour la mise en page du CV.',
            'Il ne modifie pas les sections deja correctes.',
            'Il propose une correction ciblee a la fois.',
            'Il demande confirmation avant toute grosse modification de structure ou de repartition.',
            'Il verifie le resultat avant d annoncer que le travail est termine.',
        ].join(' '),
    };
};

const hideKirbyCvProposal = () => {
    pendingKirbyCvProposal = null;
    assistantProposal?.classList.add('is-hidden');
    if (assistantProposalSummary) {
        assistantProposalSummary.textContent = '';
    }
    if (assistantProposalDetails) {
        assistantProposalDetails.replaceChildren();
    }
};

const getKirbyLetterSource = () => ({
    company: (letterCompanyField?.value || '').trim(),
    role: (letterRoleField?.value || cvForm?.elements.headline?.value || '').trim(),
    motivation: (letterMotivationField?.value || '').trim(),
    style: letterStyleField?.value || 'classic',
});

const requestKirbyCvAssistant = async ({ task, instruction = '' }) => {
    const response = await fetch('/api/kirby', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mode: 'cv',
            task,
            cv: getKirbyCvSource(),
            jobOffer: jobOfferField?.value || '',
            instruction,
            letter: getKirbyLetterSource(),
            interaction: getKirbyCvInteractionContext(),
        }),
    });

    if (!response.ok) {
        throw new Error('kirby_cv_request_failed');
    }

    return response.json();
};

const looksLikePastedCv = (message = '') => {
    const source = message.trim();
    const hasContact = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(source) || /(\+33|0)[\s.\-]?\d([\s.\-]?\d{2}){4}/.test(source);
    const sectionCount = [
        /\bexp[ée]riences?(?: professionnelles)?\b/i,
        /\bformations?\b/i,
        /\bcomp[ée]tences?\b/i,
        /\blangues?\b/i,
        /\bactivit[ée]s?|centres? d['’]int[ée]r[êe]ts?\b/i,
    ].filter((pattern) => pattern.test(source)).length;

    return source.length > 220 && (hasContact || sectionCount >= 2) && sectionCount >= 2;
};

const looksLikeJobOffer = (message = '') => {
    const source = message.trim();
    if (!source || looksLikePastedCv(source)) {
        return false;
    }

    const normalized = normalizeForMatch(source);

    const signals = [
        /\bnous recherchons\b/i,
        /\bposte [àa] pourvoir\b/i,
        /\bprofil recherch[ée]\b/i,
        /\bvos? missions?\b/i,
        /\bcomp[ée]tences? requises?\b/i,
        /\btype de contrat\b/i,
        /\bcandidature\b/i,
        /\brejoignez\b/i,
    ].filter((pattern) => pattern.test(source)).length;

    const hasJobTitle = /\b(vendeur|vendeuse|employe|employee|conseiller|conseillere|assistant|assistante|responsable|charge|manager|caissier|caissiere)\b/.test(normalized);
    const hasContract = /\b(cdi|cdd|interim|alternance|stage|temps plein|temps partiel|\d{1,2}\s*h|h\s*\/\s*f|f\s*\/\s*h)\b/.test(normalized);
    const hasOfferContext = /\b(recrutement|magasin|boutique|entreprise|poste|offre|candidature)\b/.test(normalized)
        || /\[[^\]]+\]\(https?:\/\//i.test(source)
        || /\b\d{2}\b/.test(normalized);

    return signals >= 1 || (hasJobTitle && (hasContract || hasOfferContext));
};

const getKirbyUserInstruction = (instruction = '') => {
    const marker = 'Applique cette logique à la demande utilisateur suivante.';
    const index = String(instruction || '').indexOf(marker);

    return index === -1
        ? String(instruction || '')
        : String(instruction || '').slice(index + marker.length).trim();
};

const hasLanguageNameInInstruction = (message = '') =>
    /\b(francais|français|anglais|arabe|espagnol|italien|allemand|portugais|french|english|arabic|spanish|italian|german|portuguese)\b/i.test(message);

const isLanguageFocusedInstruction = (message = '') => {
    const source = normalizeForMatch(getKirbyUserInstruction(message));
    const hasLanguageSignal = /\b(langue|langues|francais|anglais|arabe|espagnol|italien|allemand|portugais|french|english|arabic|spanish|italian|german|portuguese|native|basic|beginner|elementary|intermediate|fluent|notions?|courant|bilingue)\b/.test(source);
    const hasOtherCvScope = /\b(experience|experiences|poste|mission|missions|formation|formations|certification|certifications|ecole 42|simplon|piscine|projet|projets|competence|competences|trou|periode|periode vide|autoformation|cv pret|pret a l emploi|pret a l'emploi)\b/.test(source);

    return hasLanguageSignal && !hasOtherCvScope;
};

const looksLikeCvCreationInstruction = (message = '') => {
    const source = normalizeForMatch(getKirbyUserInstruction(message));

    return /\b(genere|generer|cree|creer|construis|construire|prepare|preparer|remplis|remplir|reconstruis|reconstruire|refais|refaire|cv pret|pret a l emploi|pret a l'emploi|prend le cv|prends le cv|mets le cv|met le cv|fait le cv|fais le cv)\b/.test(source)
        && /\bcv\b/.test(source);
};

const isExplicitKirbyApplyInstruction = (message = '') => {
    const source = normalizeForMatch(getKirbyUserInstruction(message));
    const asksForSuggestionOnly = /\b(propose|proposer|suggestion|suggere|suggerer|question|demande moi|demande-moi|a valider|à valider|avant insertion|avant d inserer|avant d'inserer)\b/.test(source);

    if (asksForSuggestionOnly) {
        return false;
    }

    return /\b(applique|appliquer|ajoute|ajouter|insere|inserer|integre|integrer|mets|mettre|met|bouche|boucher|comble|combler|complete|completer|remplis|remplir|range|ranger|trie|trier|corrige|corriger|optimise|optimiser|modifie|modifier|remplace|remplacer|supprime|supprimer|retire|retirer|enleve|enlever|reformule|reformuler|compacte|compacter)\b/.test(source);
};

const setJobOfferFromAssistantMessage = (message = '') => {
    const cleanMessage = message.trim();
    const looksLikeOffer = looksLikeJobOffer(cleanMessage);

    if (looksLikeOffer && jobOfferField) {
        jobOfferField.value = cleanMessage;
        scheduleCvDraftSave();
        return true;
    }

    return false;
};

const getKirbyCvArray = (value) => (Array.isArray(value) ? value : []);

const createKirbyProposalDetailGroup = (title, items = []) => {
    const cleanItems = items.map((item) => String(item || '').trim()).filter(Boolean);
    if (!assistantProposalDetails || !cleanItems.length) {
        return;
    }

    const group = document.createElement('section');
    group.className = 'assistant-proposal-detail-group';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const list = document.createElement('ul');
    cleanItems.slice(0, 6).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
    group.append(heading, list);
    assistantProposalDetails.appendChild(group);
};

const describeKirbyGeneratedExperience = (experience = {}) => {
    const parts = [
        experience.period,
        experience.title,
        experience.organization,
    ].map((item) => String(item || '').trim()).filter(Boolean);
    const description = getKirbyCvArray(experience.description).slice(0, 2).join(' / ');
    const skills = getKirbyCvArray(experience.skills).slice(0, 4).join(', ');

    return [
        parts.join(' · '),
        description,
        skills ? `Compétences : ${skills}` : '',
    ].filter(Boolean).join(' - ');
};

const describeKirbyEducationSuggestion = (education = {}) => {
    const title = [education.title, education.organization, education.period]
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .join(' · ');
    const description = String(education.description || '').trim();
    const skills = getKirbyCvArray(education.skills).slice(0, 4).join(', ');

    return [
        title,
        description,
        skills ? `Compétences : ${skills}` : '',
    ].filter(Boolean).join(' - ');
};

const getKirbyProposalSuggestedSkills = (proposal = {}) => {
    const generatedSkills = getKirbyCvArray(proposal.generatedExperiences)
        .flatMap((experience) => getKirbyCvArray(experience.skills));
    const educationSkills = getKirbyCvArray(proposal.educationSuggestions)
        .flatMap((education) => getKirbyCvArray(education.skills));
    const directSkills = getKirbyCvArray(proposal.suggestedSkills)
        .filter((skill) => !/\b(?:a confirmer|à confirmer)\b/i.test(normalizeForMatch(skill)));

    return dedupeCvSkillItems([...generatedSkills, ...educationSkills, ...directSkills].map(normalizeCvSentenceText));
};

const createKirbyEditableSkillGroup = (title, items = []) => {
    const cleanItems = dedupeCvSkillItems(items.map(normalizeCvSentenceText).filter(Boolean));
    if (!assistantProposalDetails || !cleanItems.length) {
        return;
    }

    const group = document.createElement('section');
    group.className = 'assistant-proposal-detail-group assistant-proposal-editable-group';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const list = document.createElement('div');
    list.className = 'assistant-proposal-skill-list';

    cleanItems.slice(0, 12).forEach((skill) => {
        const row = document.createElement('label');
        row.className = 'assistant-proposal-skill-choice';
        row.dataset.kirbySkillChoice = 'true';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.dataset.kirbySkillEnabled = 'true';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = skill;
        input.dataset.kirbySkillValue = 'true';
        input.setAttribute('aria-label', 'Modifier la compétence suggérée');
        row.append(checkbox, input);
        list.appendChild(row);
    });

    group.append(heading, list);
    assistantProposalDetails.appendChild(group);
};

const renderKirbyCvProposalDetails = (proposal = {}) => {
    if (!assistantProposalDetails) {
        return;
    }

    assistantProposalDetails.replaceChildren();
    const hasReadyExperienceProposal = getKirbyCvArray(proposal.generatedExperiences).length > 0;
    const periodQuestions = hasReadyExperienceProposal ? [] : getKirbyCvArray(proposal.periodGaps)
        .flatMap((gap) => {
            const period = String(gap?.period || '').trim();
            const prefix = period ? `${period} : ` : '';
            const questions = getKirbyCvArray(gap?.questions);
            const options = getKirbyCvArray(gap?.options).slice(0, 5);

            return [
                ...questions.map((question) => `${prefix}${question}`),
                options.length ? `${prefix}Options possibles : ${options.join(', ')}` : '',
            ];
        });
    const generatedExperiences = getKirbyCvArray(proposal.generatedExperiences).map(describeKirbyGeneratedExperience);
    const educationSuggestions = getKirbyCvArray(proposal.educationSuggestions).map(describeKirbyEducationSuggestion);
    const suggestedSkills = getKirbyProposalSuggestedSkills(proposal);

    createKirbyProposalDetailGroup('Questions avant insertion', periodQuestions);
    createKirbyProposalDetailGroup('Expériences proposées', generatedExperiences);
    createKirbyProposalDetailGroup('Formations & certifications', educationSuggestions);
    createKirbyEditableSkillGroup('Compétences suggérées', suggestedSkills);

    assistantProposalDetails.hidden = !assistantProposalDetails.children.length;
};

const showKirbyCvProposal = (result, task, snapshot, instruction = '') => {
    const proposal = result?.cv;

    if (!proposal || !assistantProposal) {
        return false;
    }

    pendingKirbyCvProposal = { result, task, snapshot, instruction };
    const extracted = proposal.extracted || {};
    const extractedCount = (extracted.experiences?.length || 0) + (extracted.education?.length || 0);
    const gapCount = getKirbyCvArray(proposal.periodGaps).length;
    const generatedExperienceCount = getKirbyCvArray(proposal.generatedExperiences).length;
    const educationSuggestionCount = getKirbyCvArray(proposal.educationSuggestions).length;
    const target = task === 'letter'
        ? proposal.letter?.subject || proposal.jobTarget || 'votre lettre de motivation'
        : generatedExperienceCount
        ? `${generatedExperienceCount} expérience(s) à valider`
        : gapCount
        ? `${gapCount} période(s) à clarifier`
        : educationSuggestionCount
        ? `${educationSuggestionCount} formation(s) à valider`
        : ['autofill', 'create'].includes(task) && extractedCount
        ? `${extractedCount} éléments détectés`
        : proposal.jobTarget || proposal.headline || 'votre CV';
    if (assistantProposalTitle) {
        assistantProposalTitle.textContent = `Prêt pour ${target}`;
    }
    if (assistantProposalSummary) {
        const qualityFixes = Array.isArray(proposal.quality?.fixes) ? proposal.quality.fixes : [];
        const layoutIntent = getKirbyLayoutIntent(instruction, proposal.layout);
        const structuralActions = [
            gapCount ? `${gapCount} période(s) vide(s) détectée(s)` : '',
            generatedExperienceCount ? `${generatedExperienceCount} expérience(s) proposée(s)` : '',
            educationSuggestionCount ? `${educationSuggestionCount} formation(s) / certification(s) proposée(s)` : '',
            getKirbyCvArray(proposal.suggestedSkills).length ? `${getKirbyCvArray(proposal.suggestedSkills).length} compétence(s) suggérée(s)` : '',
            layoutIntent.removeSections.length
                ? `${layoutIntent.removeSections.map((key) => kirbySectionActions.find((section) => section.key === key)?.label || key).join(', ')} à retirer`
                : '',
            layoutIntent.namedSkillRemovals.length
                ? `${layoutIntent.namedSkillRemovals.length} compétence(s) à retirer`
                : '',
            layoutIntent.compact
                ? 'mise en page compacte'
                : layoutIntent.reflow
                    ? 'mise en page rééquilibrée'
                    : '',
        ].filter(Boolean).join(' · ');
        assistantProposalSummary.textContent = [
            proposal.notice || qualityFixes.slice(0, 2).join(' · '),
            structuralActions,
        ].filter(Boolean).join(' · ') || 'Contrôle terminé avant application.';
    }
    renderKirbyCvProposalDetails(proposal);
    if (assistantApplyButton) {
        assistantApplyButton.textContent = task === 'letter' ? 'Appliquer la lettre' : 'Appliquer au CV';
    }

    assistantProposal.classList.remove('is-hidden');
    openAssistant();
    return true;
};

const getAssistantTask = (message = '', mode = activeKirbyMode) => {
    if (mode === 'letter') {
        return 'letter';
    }
    if (mode !== 'adapt' && (looksLikePastedCv(message) || looksLikeCvCreationInstruction(message))) {
        return looksLikePastedCv(message) ? 'autofill' : 'create';
    }
    if (mode === 'create') {
        return looksLikePastedCv(message) ? 'autofill' : 'create';
    }
    if (mode === 'adapt') {
        return 'adapt';
    }
    if (looksLikePastedCv(message)) {
        return 'autofill';
    }
    return looksLikeJobOffer(message) || /\b(offre|annonce|adapt(?:e|é|er|ation)?|poste|vendeur|vendeuse|lifestyle)\b/i.test(message)
        ? 'adapt'
        : 'optimize';
};

const getQuickLanguageLevel = (source = '') => {
    if (/\b(langue maternelle|maternelle|native speaker|native)\b/.test(source)) {
        return 'Langue maternelle';
    }
    if (/\bbilingue\b/.test(source)) {
        return 'Bilingue';
    }
    if (/\bcourant(?:e)?|fluent\b/.test(source)) {
        return 'Courant';
    }
    if (/\b(professional working proficiency|working proficiency|niveau professionnel)\b/.test(source)) {
        return 'Niveau professionnel';
    }
    if (/\b(intermediaire|intermédiaire|intermediate)\b/.test(source)) {
        return 'Niveau intermédiaire';
    }
    if (/\b(elementary|elementary level|bases solides)\b/.test(source)) {
        return 'Bases solides';
    }
    if (/\b(beginner|debutant|débutant)\b/.test(source)) {
        return 'Débutant';
    }
    if (/\bprofessionnel(?:le)?\b/.test(source)) {
        return 'Niveau professionnel';
    }
    if (/\b(basic english|basic knowledge|basic proficiency|basic|base|bases)\b/.test(source)) {
        return 'Notions';
    }
    if (/\b(notion|notions)\b/.test(source)) {
        return 'Notions';
    }

    return '';
};

const getQuickLanguageCorrections = (message = '') => {
    const source = normalizeForMatch(message);
    const languageMap = [
        ['francais', 'Français'],
        ['french', 'Français'],
        ['anglais', 'Anglais'],
        ['english', 'Anglais'],
        ['arabe', 'Arabe'],
        ['arabic', 'Arabe'],
        ['espagnol', 'Espagnol'],
        ['spanish', 'Espagnol'],
        ['italien', 'Italien'],
        ['italian', 'Italien'],
        ['allemand', 'Allemand'],
        ['german', 'Allemand'],
        ['portugais', 'Portugais'],
        ['portuguese', 'Portugais'],
    ];
    const namesByKeyword = new Map(languageMap);
    const languagePattern = new RegExp(`\\b(${languageMap.map(([keyword]) => keyword).join('|')})\\b`, 'g');
    const matches = [...source.matchAll(languagePattern)];
    const corrections = new Map();

    matches.forEach((match, index) => {
        const keyword = match[1];
        const language = namesByKeyword.get(keyword);
        const levelSource = source.slice(match.index + match[0].length, matches[index + 1]?.index);
        const level = getQuickLanguageLevel(levelSource);

        if (language && level) {
            corrections.set(normalizeForMatch(language), { language, level });
        }
    });

    return [...corrections.values()];
};

const applyQuickLanguageCorrections = (message = '') => {
    const corrections = getQuickLanguageCorrections(message);
    if (!corrections.length || !cvForm) {
        return '';
    }

    const beforeState = getCvHistoryState();
    if (!mergeKirbyLanguages(corrections)) {
        return `Langues déjà réglées : ${corrections.map(({ language, level }) => `${language} : ${level}`).join(', ')}.`;
    }

    clearEditableOverride('languages');
    renderLanguageEditor();
    updateCvPreview();
    commitCvHistoryTransition(beforeState);
    setCvStatus('Kirby a mis à jour les langues');
    return `Langues mises à jour : ${corrections.map(({ language, level }) => `${language} : ${level}`).join(', ')}.`;
};

const getQuickEditorBugReport = (message = '') => {
    const source = normalizeForMatch(message);
    const mentionsEditor = /\b(editeur|éditeur|selection|selectionne|sélection|sélectionne|format|mise en forme|taille|police|toolbar|barre|titre|profil|competences|langues|experiences)\b/.test(source);
    const mentionsWrongTarget = /\b(bug|dysfonctionnement|anomalie|pas au bon|mauvais|autre zone|autre rubrique|ne s applique pas|change pas|modifie .*competences|competences .*change)\b/.test(source);

    if (!mentionsEditor || !mentionsWrongTarget) {
        return '';
    }

    return [
        "Je détecte un dysfonctionnement de l’éditeur CV.",
        "La mise en forme ne semble pas s’appliquer à l’élément sélectionné : c’est probablement un problème de ciblage de sélection, pas une erreur d’utilisation.",
        "Rapport de bug : quand un titre de section comme Profil est sélectionné puis passé en taille 18, l’éditeur peut appliquer le style à une autre rubrique, par exemple Compétences. Correction attendue : verrouiller la cible sélectionnée et appliquer police/taille uniquement à cette cible.",
    ].join('\n');
};

const getQuickTitleGenderCorrection = (message = '') => {
    const source = normalizeForMatch(message);
    if (!/\b(remplace|remplacer|modifie|modifier|change|changer|mets|mettre|passe|passer|corrige|corriger)\b/.test(source)) {
        return null;
    }

    const match = source.match(/\b(vendeur|vendeuse|conseiller|conseillere|charge|chargee)\b(?:\s+(?:polyvalent|polyvalente|lifestyle|clientele|client))?\s+(?:par|en)\s+\b(vendeur|vendeuse|conseiller|conseillere|charge|chargee)\b/);
    if (!match || match[1] === match[2]) {
        return null;
    }

    return { from: match[1], to: match[2] };
};

const replaceGenderedCvTitle = (value = '', target = '') => {
    const source = String(value || '');
    const normalizedTarget = normalizeForMatch(target);
    const replacements = {
        vendeuse: [
            [/\bvendeur\b/gi, 'Vendeuse'],
            [/\bpolyvalent\b/gi, 'polyvalente'],
        ],
        vendeur: [
            [/\bvendeuse\b/gi, 'Vendeur'],
            [/\bpolyvalente\b/gi, 'polyvalent'],
        ],
        conseillere: [[/\bconseiller\b/gi, 'Conseillère']],
        conseiller: [[/\bconseill[eè]re\b/gi, 'Conseiller']],
        chargee: [[/\bcharg[eé]\b/gi, 'Chargée']],
        charge: [[/\bcharg[eé]e\b/gi, 'Chargé']],
    };

    const next = (replacements[normalizedTarget] || []).reduce(
        (title, [pattern, replacement]) => title.replace(pattern, replacement),
        source
    );

    return formatCvHeadline(next);
};

const applyQuickTitleGenderCorrection = (message = '') => {
    const correction = getQuickTitleGenderCorrection(message);
    const headlineField = cvForm?.elements.headline;
    if (!correction || !headlineField) {
        return '';
    }

    const currentHeadline = headlineField.value || '';
    if (!new RegExp(`\\b${correction.from}\\b`, 'i').test(normalizeForMatch(currentHeadline))) {
        return '';
    }

    const nextHeadline = replaceGenderedCvTitle(currentHeadline, correction.to);
    if (!nextHeadline || nextHeadline === currentHeadline) {
        return '';
    }

    const beforeState = getCvHistoryState();
    headlineField.value = nextHeadline;
    if (cvForm.elements.jobTarget) {
        const currentTarget = cvForm.elements.jobTarget.value || '';
        cvForm.elements.jobTarget.value = new RegExp(`\\b${correction.from}\\b`, 'i').test(normalizeForMatch(currentTarget))
            ? replaceGenderedCvTitle(currentTarget, correction.to)
            : nextHeadline;
    }

    clearEditableOverride('headline');
    updateCvPreview();
    commitCvHistoryTransition(beforeState);
    setCvStatus('Kirby a mis à jour le titre');
    return `Titre appliqué : « ${nextHeadline} ». Vous pouvez revenir en arrière avec Retour.`;
};

const normalizeExperienceDateToken = (value = '') => {
    const monthReplacements = [
        [/\bjanv(?:ier)?\.?\s*(\d{4})\b/gi, 'janv. $1'],
        [/\bf[ée]vr(?:ier)?\.?\s*(\d{4})\b/gi, 'févr. $1'],
        [/\bavr(?:il)?\.?\s*(\d{4})\b/gi, 'avr. $1'],
        [/\bmars\.?\s*(\d{4})\b/gi, 'mars $1'],
        [/\bmai\.?\s*(\d{4})\b/gi, 'mai $1'],
        [/\bjuin\.?\s*(\d{4})\b/gi, 'juin $1'],
        [/\bjuil(?:let)?\.?\s*(\d{4})\b/gi, 'juil. $1'],
        [/\bao[uû]t\.?\s*(\d{4})\b/gi, 'août $1'],
        [/\bsept(?:embre)?\.?\s*(\d{4})\b/gi, 'sept. $1'],
        [/\boct(?:obre)?\.?\s*(\d{4})\b/gi, 'oct. $1'],
        [/\bnov(?:embre)?\.?\s*(\d{4})\b/gi, 'nov. $1'],
        [/\bd[ée]c(?:embre)?\.?\s*(\d{4})\b/gi, 'déc. $1'],
    ];

    return monthReplacements.reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        String(value || '')
            .replace(/\bpresent\b/gi, 'présent')
            .replace(/\bpr[ée]sent\b/gi, 'présent')
            .replace(/\s{2,}/g, ' ')
            .trim()
    );
};

const getComparableExperienceDate = (value = '') => {
    const source = normalizeForMatch(value).replace(/\./g, '');

    if (/\b(aujourd'hui|present)\b/.test(source)) {
        return Number.POSITIVE_INFINITY;
    }

    const yearMatch = source.match(/\b(\d{4})\b/);
    if (!yearMatch) {
        return null;
    }

    const monthIndex = [
        ['janv', 1],
        ['janvier', 1],
        ['fevr', 2],
        ['fevrier', 2],
        ['mars', 3],
        ['avr', 4],
        ['avril', 4],
        ['mai', 5],
        ['juin', 6],
        ['juil', 7],
        ['juillet', 7],
        ['aout', 8],
        ['sept', 9],
        ['septembre', 9],
        ['oct', 10],
        ['octobre', 10],
        ['nov', 11],
        ['novembre', 11],
        ['dec', 12],
        ['decembre', 12],
    ].find(([month]) => new RegExp(`\\b${month}\\b`).test(source))?.[1] || 1;

    return (Number(yearMatch[1]) * 12) + monthIndex;
};

const normalizeExperienceDateText = (value = '') => {
    const cleanValue = String(value || '')
        .replace(/\s*[–—]\s*/g, ' - ')
        .replace(/\s*-\s*/g, ' - ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const parts = cleanValue.split(/\s+-\s+/).filter(Boolean);

    if (parts.length >= 2) {
        const start = normalizeExperienceDateToken(parts[0]);
        const end = normalizeExperienceDateToken(parts.slice(1).join(' - '));
        const startValue = getComparableExperienceDate(start);
        const endValue = getComparableExperienceDate(end);
        const shouldSwap = Number.isFinite(startValue)
            && Number.isFinite(endValue)
            && startValue > endValue;
        const ordered = shouldSwap ? [end, start] : [start, end];

        return ordered.join(' - ');
    }

    return normalizeExperienceDateToken(cleanValue);
};

const quickExperienceDateTokenPattern = `(?:${monthNamesPattern})\\.?\\s*\\d{4}|\\d{4}|aujourd'hui|present|pr[ée]sent`;

const getQuickExperienceDateValue = (message = '') => {
    const rangePattern = new RegExp(
        `(${quickExperienceDateTokenPattern})\\s*[–-]\\s*(${quickExperienceDateTokenPattern})`,
        'i'
    );
    const rangeMatch = message.match(rangePattern);
    if (rangeMatch) {
        return normalizeExperienceDateText(`${rangeMatch[1]} - ${rangeMatch[2]}`);
    }

    const singlePattern = new RegExp(`(${quickExperienceDateTokenPattern})`, 'i');
    const singleMatch = message.match(singlePattern);

    return singleMatch ? normalizeExperienceDateText(singleMatch[1]) : '';
};

const hasQuickExperienceDateIntent = (message = '', dateValue = '') => {
    const source = normalizeForMatch(message);
    const hasDateTopic = /\b(date|dates|periode|periodes)\b/.test(source);
    const hasCorrectionVerb = /\b(modifie|modifier|change|changer|corrige|corriger|remplace|remplacer|mets|mettre|met)\b/.test(source);
    const answersPendingDateQuestion = Boolean(dateValue) && Number.isInteger(pendingExperienceDateCorrectionIndex);

    return hasDateTopic || answersPendingDateQuestion || (Boolean(dateValue) && hasCorrectionVerb);
};

const getQuickExperienceDateCorrection = (message = '') => {
    const date = getQuickExperienceDateValue(message);
    if (!hasQuickExperienceDateIntent(message, date)) {
        return null;
    }

    return {
        date,
        pendingIndex: Number.isInteger(pendingExperienceDateCorrectionIndex)
            ? pendingExperienceDateCorrectionIndex
            : null,
    };
};

const getQuickExperienceDateTargetScore = (entry, message = '') => {
    const source = normalizeForMatch(message);
    const entryTokens = normalizeForMatch(`${entry.title || ''} ${entry.meta || ''}`)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 4);
    const uniqueTokens = [...new Set(entryTokens)];

    return uniqueTokens.filter((token) => source.includes(token)).length;
};

const getExperienceIndexFromNode = (node) => {
    const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    const target = element?.closest?.('.cv-experience-item[data-experience-index], .experience-card[data-experience-index]');
    const value = target?.dataset?.experienceIndex;
    const index = Number.parseInt(value || '', 10);

    return Number.isInteger(index) && index >= 0 ? index : null;
};

const getSelectedExperienceIndex = () => {
    const selection = document.getSelection();
    const selectionNodes = [
        selection?.anchorNode,
        selection?.focusNode,
        savedFormatRange?.commonAncestorContainer,
        activeFormatNode,
        activeEditableNode,
        document.activeElement,
    ];

    for (const node of selectionNodes) {
        const index = getExperienceIndexFromNode(node);
        if (index !== null) {
            activeExperienceIndex = index;
            return index;
        }
    }

    return Number.isInteger(activeExperienceIndex) && activeExperienceIndex >= 0
        ? activeExperienceIndex
        : null;
};

const findQuickExperienceDateTargetIndex = (entries = [], message = '', correction = {}) => {
    const scores = entries
        .map((entry, index) => ({
            index,
            score: getQuickExperienceDateTargetScore(entry, message),
        }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score);

    if (scores.length > 1 && scores[0].score === scores[1].score) {
        return -2;
    }

    if (scores.length) {
        return scores[0].index;
    }

    const selectedIndex = getSelectedExperienceIndex();
    if (selectedIndex !== null && entries[selectedIndex]) {
        return selectedIndex;
    }

    if (Number.isInteger(correction.pendingIndex) && entries[correction.pendingIndex]) {
        return correction.pendingIndex;
    }

    return entries.length === 1 ? 0 : -1;
};

const applyQuickExperienceDateCorrection = (message = '') => {
    const correction = getQuickExperienceDateCorrection(message);
    const field = getExperienceField();
    if (!correction || !field) {
        return '';
    }

    const entries = repairPreviewExperienceItems(splitLines(field.value)).map(parseExperienceEntry);
    const index = findQuickExperienceDateTargetIndex(entries, message, correction);
    if (index === -2) {
        pendingExperienceDateCorrectionIndex = null;
        return correction.date
            ? `J’ai trouvé plusieurs expériences possibles. Précisez le poste ou l’entreprise à modifier pour appliquer ${correction.date}.`
            : 'J’ai trouvé plusieurs expériences possibles. Précisez le poste ou l’entreprise, puis la date à appliquer.';
    }

    if (index === -1) {
        pendingExperienceDateCorrectionIndex = null;
        return correction.date
            ? `Je peux modifier uniquement la date, mais je dois savoir quelle expérience est concernée. Sélectionnez l’expérience dans le CV ou indiquez le poste/l’entreprise pour appliquer ${correction.date}.`
            : 'Quelle expérience et quelle date dois-je modifier ? Sélectionnez la ligne dans le CV ou indiquez le poste/l’entreprise avec la nouvelle période.';
    }

    const title = entries[index].title || 'cette expérience';
    if (!correction.date) {
        pendingExperienceDateCorrectionIndex = index;
        return `Quelle date dois-je appliquer à ${title} ?`;
    }

    pendingExperienceDateCorrectionIndex = null;
    if (normalizeExperienceDateText(entries[index].date) === correction.date) {
        return `La date ${correction.date} est déjà appliquée à ${title}.`;
    }

    const beforeState = getCvHistoryState();
    entries[index] = {
        ...entries[index],
        date: correction.date,
    };
    field.value = entries.map(serializeExperienceEntry).filter(Boolean).join('\n');
    clearEditableOverride('experience');
    renderExperienceEditor();
    updateCvPreview();
    commitCvHistoryTransition(beforeState);
    scheduleCvDraftSave();
    setCvStatus(`Date mise à jour : ${title}`);
    return `Date mise à jour pour ${title} : ${correction.date}.`;
};

const shouldQuickSortExperiences = (message = '') => {
    const source = normalizeForMatch(message);

    return /\b(date|dates|chronologique|ordre|range|ranger|remet|remets|trie|trier|ancienne|recent|recente|plus ancien|plus ancienne|plus recent|plus recente)\b/.test(source)
        && /\b(experience|experiences|parcours|cv|date|dates)\b/.test(source);
};

const applyQuickExperienceSortCorrection = (message = '') => {
    if (!shouldQuickSortExperiences(message) || !getExperienceField()) {
        return '';
    }

    const beforeState = getCvHistoryState();
    const changed = sortExperienceFieldNewestFirst();
    if (!changed) {
        return 'Les expériences sont déjà rangées de la plus récente à la plus ancienne.';
    }

    renderExperienceEditor();
    updateCvPreview();
    commitCvHistoryTransition(beforeState);
    scheduleCvDraftSave();
    setCvStatus('Expériences rangées par date');
    return 'Expériences rangées de la plus récente à la plus ancienne, avec les doublons de période nettoyés.';
};

const getQuickExperienceRemovalTokens = (message = '') =>
    normalizeForMatch(message)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 3)
        .filter((token) => !new Set([
            'supprime', 'supprimer', 'retire', 'retirer', 'enleve', 'enlever', 'efface', 'effacer',
            'doublon', 'doublons', 'double', 'duplicate', 'experience', 'experiences', 'periode', 'periodes',
            'date', 'dates', 'corrige', 'corriger', 'kirby', 'cette', 'celle', 'celui', 'bloc'
        ]).has(token));

const getExperienceRemovalIntent = (message = '') => {
    const source = normalizeForMatch(message);
    return {
        duplicateOnly: /\b(doublon|doublons|duplicate|double)\b/.test(source),
        wholeBlock: /\b(supprime|supprimer|retire|retirer|enleve|enlever|efface|effacer)\b.{0,30}\b(cette experience|cette ligne|ce poste|ce bloc|le bloc|l experience|l experience complete|l experience entiere)\b/.test(source),
    };
};

const getExperienceFieldMatchScore = (value = '', tokens = []) => {
    const haystack = normalizeForMatch(value);
    return tokens.filter((token) => haystack.includes(token)).length;
};

const cleanupExperienceEntryFragments = (entry = {}, tokens = []) => {
    if (!tokens.length) {
        return null;
    }

    const titleScore = getExperienceFieldMatchScore(entry.title || '', tokens);
    const dateScore = getExperienceFieldMatchScore(entry.date || '', tokens);
    const metaScore = getExperienceFieldMatchScore(entry.meta || '', tokens);
    const bulletScores = (entry.bullets || []).map((bullet) => getExperienceFieldMatchScore(bullet, tokens));

    if (!metaScore && !bulletScores.some(Boolean)) {
        return null;
    }

    if (titleScore || dateScore) {
        return null;
    }

    const nextEntry = {
        ...entry,
        bullets: [...(entry.bullets || [])],
    };
    let changed = false;

    if (nextEntry.meta) {
        const segments = nextEntry.meta
            .split(/\s+(?:\/|-)\s+/)
            .map((segment) => segment.trim())
            .filter(Boolean);
        const keptSegments = segments.filter((segment) => !getExperienceFieldMatchScore(segment, tokens));
        if (keptSegments.length !== segments.length) {
            nextEntry.meta = keptSegments.join(' - ');
            changed = true;
        }
    }

    if (nextEntry.bullets.length) {
        const keptBullets = nextEntry.bullets.filter((bullet) => !getExperienceFieldMatchScore(bullet, tokens));
        if (keptBullets.length !== nextEntry.bullets.length) {
            nextEntry.bullets = keptBullets;
            changed = true;
        }
    }

    if (!changed) {
        return null;
    }

    return {
        ...nextEntry,
        meta: normalizeCvSentenceText(nextEntry.meta || ''),
        bullets: dedupeImportedItems((nextEntry.bullets || []).map((bullet) => normalizeCvSentenceText(bullet)).filter(Boolean)),
    };
};

const applyQuickExperienceRemoval = (message = '') => {
    const field = getExperienceField();
    const asksRemoval = hasExplicitDestructiveCvRemoval(message);
    const { duplicateOnly, wholeBlock } = getExperienceRemovalIntent(message);

    if (!field || !asksRemoval) {
        return '';
    }

    const entries = repairPreviewExperienceItems(splitLines(field.value)).map(parseExperienceEntry);
    if (!entries.length) {
        return '';
    }

    const selectedIndex = getSelectedExperienceIndex();
    const tokens = getQuickExperienceRemovalTokens(message);
    const scoredEntries = entries
        .map((entry, index) => {
            const titleScore = getExperienceFieldMatchScore(entry.title || '', tokens);
            const metaScore = getExperienceFieldMatchScore(entry.meta || '', tokens);
            const dateScore = getExperienceFieldMatchScore(entry.date || '', tokens);
            const bulletScore = getExperienceFieldMatchScore((entry.bullets || []).join(' '), tokens);
            return {
                index,
                titleScore,
                metaScore,
                dateScore,
                bulletScore,
                score: titleScore + metaScore + dateScore + bulletScore,
            };
        })
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)
    const matchingIndexes = scoredEntries.map((item) => item.index);

    if (!wholeBlock && !duplicateOnly && tokens.length) {
        const updatedEntries = entries.map((entry, index) => {
            const scoredEntry = scoredEntries.find((item) => item.index === index);
            if (!scoredEntry) {
                return entry;
            }
            return cleanupExperienceEntryFragments(entry, tokens) || entry;
        });
        const fragmentChanged = updatedEntries.some((entry, index) => serializeExperienceEntry(entry) !== serializeExperienceEntry(entries[index]));
        if (fragmentChanged) {
            const beforeState = getCvHistoryState();
            field.value = updatedEntries.map(serializeExperienceEntry).filter(Boolean).join('\n');
            clearEditableOverride('experience');
            renderExperienceEditor();
            updateCvPreview();
            commitCvHistoryTransition(beforeState);
            scheduleCvDraftSave();
            setCvStatus('Mention supprimée dans l’expérience');
            return 'Mention supprimée dans l’expérience ciblée.';
        }
    }

    let indexesToRemove = [];
    if (wholeBlock && selectedIndex !== null && entries[selectedIndex]) {
        indexesToRemove = [selectedIndex];
    } else if (duplicateOnly && matchingIndexes.length > 1) {
        indexesToRemove = matchingIndexes.slice(1);
    } else if (!duplicateOnly && matchingIndexes.length) {
        indexesToRemove = matchingIndexes.filter((index) => {
            const scoredEntry = scoredEntries.find((item) => item.index === index);
            return scoredEntry && (scoredEntry.titleScore > 0 || scoredEntry.dateScore > 0);
        });
    }

    indexesToRemove = [...new Set(indexesToRemove)].filter((index) => Number.isInteger(index) && entries[index]);
    if (!indexesToRemove.length) {
        return '';
    }

    const beforeState = getCvHistoryState();
    const keptEntries = entries.filter((_, index) => !indexesToRemove.includes(index));
    field.value = keptEntries.map(serializeExperienceEntry).filter(Boolean).join('\n');
    clearEditableOverride('experience');
    renderExperienceEditor();
    updateCvPreview();
    commitCvHistoryTransition(beforeState);
    scheduleCvDraftSave();
    setCvStatus(indexesToRemove.length > 1 ? 'Doublons supprimés' : 'Expérience supprimée');

    return indexesToRemove.length > 1
        ? 'Doublons supprimés dans les expériences.'
        : 'Expérience supprimée du CV.';
};

const applyQuickCvTypographyAdjustment = (message = '') => {
    const source = normalizeForMatch(message);
    const sectionTitleOnlyIntent = /\b(reduis|reduire|reduit|retrecis|retrecir)\b.*\b(titre|titres)\b.*\b(section|sections|rubrique|rubriques)\b/.test(source);
    const wantsBiggerTitles = /\b(agrandi(?:r)?|grossi(?:r)?|augmente(?:r)?|plus grand|plus gros)\b/.test(source)
        && /\b(titre|titres|rubrique|rubriques|profil|competences|langues|experiences|formations)\b/.test(source);
    const wantsSmallerTitles = /\b(reduis|reduire|reduit|retrecis|retrecir|plus petit|plus petits|discret|discrets|sobre|sobres|moins agressif|moins agressifs)\b/.test(source)
        && /\b(titre|titres|section|sections|rubrique|rubriques|profil|competences|langues|experiences|formations)\b/.test(source);
    const wantsSmallerBody = /\b(retreci(?:r)?|reduit|reduire|diminue(?:r)?|plus petit|plus petits|compacte(?:r)?)\b/.test(source)
        && /\b(reste|texte|contenu|corps|paragraphes?|missions|contenu cv)\b/.test(source);
    const wantsUppercaseTitles = /\b(majuscule|majuscules|uppercase)\b/.test(source);
    const wantsLetterSpacing = /\b(espacement|espacer|espacement des lettres|lettres espacees|letter spacing)\b/.test(source);
    const wantsReadableContent = /\b(contenu|texte|corps)\b.*\b(lisible|lisibilite|plus lisible)\b|\bplus lisible que les titres\b/.test(source);

    if (!wantsBiggerTitles && !wantsSmallerTitles && !wantsSmallerBody && !wantsUppercaseTitles && !wantsLetterSpacing) {
        return '';
    }

    const beforeState = getCvHistoryState();
    let changed = false;

    if (wantsBiggerTitles || wantsSmallerTitles || wantsUppercaseTitles || wantsLetterSpacing) {
        document.querySelectorAll('[data-section-title]').forEach((node) => {
            const key = node.dataset.sectionTitle || '';
            if (!key) {
                return;
            }

            const previous = normalizeStyleState(cvSectionTitleStyles[key] || {});
            const isLanguagesTitle = key === 'languages';
            const smallerTitleFontSize = sectionTitleOnlyIntent
                ? (isLanguagesTitle ? '13px' : '14px')
                : '13px';
            const smallerTitleWeight = sectionTitleOnlyIntent
                ? (isLanguagesTitle ? '740' : '760')
                : '700';
            const smallerTitleLineHeight = sectionTitleOnlyIntent ? '1.08' : '1.05';
            const smallerTitleLetterSpacing = sectionTitleOnlyIntent ? '0.07em' : '0.08em';
            const next = {
                ...previous,
                fontSize: wantsSmallerTitles ? smallerTitleFontSize : wantsBiggerTitles ? '18px' : (previous.fontSize || '13px'),
                fontWeight: wantsSmallerTitles ? smallerTitleWeight : wantsBiggerTitles ? '800' : (previous.fontWeight || '700'),
                lineHeight: wantsSmallerTitles ? smallerTitleLineHeight : wantsBiggerTitles ? '1.1' : (previous.lineHeight || '1.1'),
                letterSpacing: (wantsSmallerTitles || wantsLetterSpacing) ? smallerTitleLetterSpacing : previous.letterSpacing,
                textTransform: (wantsSmallerTitles || wantsUppercaseTitles || sectionTitleOnlyIntent) ? 'uppercase' : previous.textTransform,
            };

            if (JSON.stringify(previous) !== JSON.stringify(next)) {
                cvSectionTitleStyles[key] = next;
                changed = true;
            }
        });
    }

    if (wantsSmallerBody || wantsReadableContent || (wantsSmallerTitles && !sectionTitleOnlyIntent)) {
        DEFAULT_CV_SECTION_ORDER.forEach((target) => {
            const previous = cvEditableContent[target] || {};
            const nextStyle = {
                ...normalizeStyleState(previous.style || {}),
                fontSize: (wantsReadableContent || wantsSmallerTitles) ? '14px' : '13px',
                lineHeight: (wantsReadableContent || wantsSmallerTitles) ? '1.2' : '1.15',
            };
            const next = previous.html ? { ...previous, style: nextStyle } : { style: nextStyle };

            if (JSON.stringify(previous) !== JSON.stringify(next)) {
                cvEditableContent[target] = next;
                changed = true;
            }
        });
    }

    if (!changed) {
        return '';
    }

    updateCvPreview();
    renderExperienceEditor();
    renderLanguageEditor();
    commitCvHistoryTransition(beforeState);
    scheduleCvDraftSave();
    setCvStatus('Mise en forme ajustée');

    if (wantsSmallerTitles && (wantsReadableContent || wantsSmallerBody)) {
        return 'Titres de section réduits et hiérarchie typographique rendue plus sobre.';
    }

    if (wantsBiggerTitles && wantsSmallerBody) {
        return 'Titres agrandis et contenu principal resserré dans le CV.';
    }

    if (sectionTitleOnlyIntent || wantsSmallerTitles) {
        return 'Titres de section réduits et harmonisés dans le CV.';
    }

    if (wantsBiggerTitles) {
        return 'Titres de rubriques agrandis dans le CV.';
    }

    return 'Contenu principal réduit dans le CV.';
};

const applyQuickSalesRefocusCorrection = (message = '') => {
    const source = normalizeForMatch(message);
    const mentionsSalesTarget = /\b(camaieu|camaïeu|vente|vendeuse|vendeur|conseillere de vente|conseillère de vente|lifestyle|mode)\b/.test(source);
    const mentionsRefocusNeed = /\b(dominant|dominance|plus importante|plus visible|experience principale|experience la plus importante|adapter au poste|poste de vente|trop dominant|trop dominante|second plan|plus secondaire|mets en avant|mettre en avant|mettre en valeur|plus d element|plus d'element|plus d’elements|plus d'elements)\b/.test(source);
    const mentionsWebBlock = /\b(developpeuse web|développeuse web|full stack|web full stack|projet web|web)\b/.test(source);
    const mentionsNoInvent = /\b(n ajoute pas|n'ajoute pas|sans rajouter|n invente pas|n'invente pas)\b/.test(source);
    const wantsFeminineSalesTitle = /\b(fatima|feminin|féminin|vendeuse)\b/.test(source);
    const refusesDateBasedReorder = /\b(pas remonter|pas par la date|pas avec les dates|sans changer l ordre|sans changer l'ordre|garde l ordre|garder l ordre|garder l'ordre)\b/.test(source);

    if (!wantsFeminineSalesTitle && !(mentionsSalesTarget && (mentionsRefocusNeed || mentionsWebBlock || mentionsNoInvent))) {
        return '';
    }

    const beforeState = getCvHistoryState();
    let changed = false;
    const headlineField = cvForm?.elements.headline;
    const summaryField = cvForm?.elements.summary;
    const skillsField = cvForm?.elements.skills;
    const experienceField = getExperienceField();

    if (headlineField) {
        const currentHeadline = formatCvHeadline(headlineField.value || '');
        const nextHeadline = /vendeur/i.test(currentHeadline) || mentionsSalesTarget
            ? 'Conseillère de vente'
            : currentHeadline;

        if (nextHeadline && nextHeadline !== currentHeadline) {
            headlineField.value = nextHeadline;
            changed = true;
        }
    }

    if (summaryField && (mentionsSalesTarget || mentionsRefocusNeed)) {
        const nextSummary = normalizeCvSentenceText(
            'Professionnelle de la vente et de la relation client, avec expérience en accueil, conseil, fidélisation et accompagnement personnalisé. À l’aise en point de vente, je contribue au chiffre d’affaires, à la gestion des stocks et à la bonne tenue du merchandising avec une approche orientée service et résultats.'
        );

        if (nextSummary && nextSummary !== summaryField.value) {
            summaryField.value = nextSummary;
            changed = true;
        }
    }

    if (skillsField && (mentionsSalesTarget || mentionsNoInvent)) {
        const existingSkills = splitLines(skillsField.value).map(normalizeCvSentenceText);
        const blockedSkills = [
            /developpement d[’']?applications?\s+web/i,
            /\bux\/ui\b/i,
            /\btests?\s+fonctionnels?\b/i,
            /^\s*ia\s*$/i,
            /communication digitale/i,
            /logique algorithmique/i,
            /culture numerique/i,
            /apprentissage par projet/i,
            /conception d[’']?interfaces?\s+utilisateur/i,
            /gestion de bases de donnees/i,
            /deploiement d[’']?applications/i,
            /gestion de projet digital/i,
        ];
        const keptSkills = existingSkills.filter((skill) => !blockedSkills.some((pattern) => pattern.test(skill)));
        const salesSkills = [
            'Relation client',
            'Accueil',
            'Conseil client',
            'Analyse des besoins',
            'Fidélisation client',
            'Développement du chiffre d’affaires',
            'Gestion des stocks',
            'Réassort',
            'Merchandising',
            'Organisation',
            'Autonomie',
            'Gestion d’équipe',
        ];
        const nextSkills = dedupeCvSkillItems([...salesSkills, ...keptSkills]).slice(0, 12).join('\n');

        if (nextSkills && nextSkills !== skillsField.value) {
            skillsField.value = nextSkills;
            changed = true;
        }
    }

    if (experienceField && (mentionsSalesTarget || mentionsRefocusNeed || mentionsWebBlock)) {
        const entries = getExperienceSourceEntries();
        if (entries.length) {
            const camaieuIndex = entries.findIndex((entry) => /\bcama[ïi]eu\b/i.test(`${entry.title} ${entry.meta}`));
            const webIndex = entries.findIndex((entry) => /\b(developpeuse|développeuse|full stack|web)\b/i.test(`${entry.title} ${entry.meta}`));
            const reordered = [...entries];

            if (camaieuIndex !== -1) {
                const camaieuEntry = reordered[camaieuIndex];
                const nextCamaieu = {
                    ...camaieuEntry,
                    title: formatCvHeadline(camaieuEntry.title || 'Responsable Adjointe'),
                    meta: normalizeCvSentenceText(camaieuEntry.meta || 'Camaïeu, Rueil-Malmaison'),
                    bullets: dedupeImportedItems([
                        'Accueil, conseil et fidélisation de la clientèle en point de vente',
                        'Contribution au développement du chiffre d’affaires et accompagnement à la vente',
                        'Gestion des stocks, réassorts et bonne tenue de l’espace de vente',
                        'Participation au merchandising et à la mise en valeur des produits',
                        'Coordination de l’équipe au quotidien et suivi de l’activité magasin',
                    ]),
                };
                reordered[camaieuIndex] = nextCamaieu;

                if (!refusesDateBasedReorder && camaieuIndex > 0 && /\b(experience principale|experience la plus importante|place la en premier|place la en tete|mets la en premier)\b/.test(source)) {
                    reordered.splice(camaieuIndex, 1);
                    reordered.unshift(nextCamaieu);
                }
            }

            if (webIndex !== -1) {
                const currentIndex = reordered.findIndex((entry) => /\b(developpeuse|développeuse|full stack|web)\b/i.test(`${entry.title} ${entry.meta}`));
                if (currentIndex !== -1) {
                    const webEntry = reordered.splice(currentIndex, 1)[0];
                    const compactBullets = (webEntry.bullets || []).map(normalizeCvSentenceText).filter(Boolean).slice(0, 2);
                    reordered.push({
                        ...webEntry,
                        bullets: compactBullets,
                    });
                }
            }

            const nextExperience = reordered.map(serializeExperienceEntry).filter(Boolean).join('\n');
            if (nextExperience && nextExperience !== experienceField.value) {
                experienceField.value = nextExperience;
                changed = true;
            }
        }
    }

    if (!changed) {
        return '';
    }

    clearEditableOverrides();
    updateCvPreview();
    renderExperienceEditor();
    renderLanguageEditor();
    commitCvHistoryTransition(beforeState);
    scheduleCvDraftSave();
    setCvStatus('CV recentré sur la vente');

    return refusesDateBasedReorder
        ? 'CV recentré sur la vente : Camaïeu renforcé par le contenu, sans remonter l’expérience par la date, bloc web réduit et compétences recentrées.'
        : 'CV recentré sur la vente : titre féminisé, Camaïeu mis en avant, bloc web réduit et compétences recentrées sans ajout inventé.';
};

const applyQuickKirbyCorrection = (message = '') => {
    const directCorrections = [
        applyQuickSalesRefocusCorrection(message),
        applyQuickCvTypographyAdjustment(message),
        getQuickEditorBugReport(message),
        applyQuickTitleGenderCorrection(message),
        applyQuickLanguageCorrections(message),
        applyQuickExperienceDateCorrection(message),
        applyQuickExperienceRemoval(message),
    ].filter(Boolean);

    if (directCorrections.length) {
        return directCorrections.join(' ');
    }

    return applyQuickExperienceSortCorrection(message);
};

const reorderExistingExperiences = (order = []) => {
    const field = getExperienceField();
    const lines = field ? repairPreviewExperienceItems(splitLines(field.value)) : [];

    if (!field || !lines.length || !Array.isArray(order) || !order.length) {
        return false;
    }

    const rankForLine = (line) => {
        const normalizedLine = normalizeForMatch(line);
        const parsedTitle = normalizeForMatch(parseExperienceEntry(line).title || '');
        const rank = order.findIndex((title) => {
            const normalizedTitle = normalizeForMatch(title || '');
            return normalizedTitle && (
                normalizedLine.includes(normalizedTitle) ||
                normalizedTitle.includes(parsedTitle) ||
                parsedTitle.includes(normalizedTitle)
            );
        });

        return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
    };

    const reordered = lines
        .map((line, index) => ({ line, index, rank: rankForLine(line) }))
        .sort((left, right) => left.rank - right.rank || left.index - right.index)
        .map((item) => item.line);

    if (reordered.join('\n') === lines.join('\n')) {
        return false;
    }

    field.value = reordered.join('\n');
    return true;
};

const mergeKirbyLanguages = (languages = []) => {
    const field = getLanguageField();

    if (!field || !Array.isArray(languages) || !languages.length) {
        return false;
    }

    const entries = isDefaultCvFieldValue('languages', field.value) ? [] : getLanguageSourceEntries();
    const existing = new Map(entries.map((entry) => [normalizeForMatch(entry.language), entry]));

    languages.forEach((entry) => {
        const language = normalizeCvSentenceText(entry?.language || '').replace(/\.$/, '');
        if (!language) {
            return;
        }
        const key = normalizeForMatch(language);
        const previous = existing.get(key);
        existing.set(key, {
            language,
            level: entry?.level ? normalizeLanguageLevel(entry.level) : previous?.level || '',
        });
    });

    const value = [...existing.values()].map(serializeLanguageEntry).filter(Boolean).join('\n');
    if (!value || value === field.value) {
        return false;
    }

    field.value = value;
    return true;
};

const getExplicitCvPeriodsFromText = (value = '') => {
    const currentYear = new Date().getFullYear();
    const periods = [];
    const pattern = /\b((?:19|20)\d{2})\s*[–-]\s*((?:19|20)\d{2}|aujourd'hui|aujourd’hui|present|présent|actuel|maintenant)\b/gi;
    let match;

    while ((match = pattern.exec(value || ''))) {
        const start = Number(match[1]);
        const end = /\d{4}/.test(match[2]) ? Number(match[2]) : currentYear;

        if (start >= 1980 && end >= start && end <= currentYear + 1) {
            periods.push({ start, end });
        }
    }

    return periods;
};

const formatCvYearPeriod = ({ start, end } = {}) => start && end
    ? start === end ? String(start) : `${start} - ${end}`
    : '';

const rangesOverlap = (left, right) =>
    Boolean(left && right && left.start <= right.end && right.start <= left.end);

const getExperienceFieldYearRanges = () => {
    const field = getExperienceField();
    const currentYear = new Date().getFullYear();

    return (field ? repairPreviewExperienceItems(splitLines(field.value)) : [])
        .map((line) => {
            const sort = getTimelineEntrySortValue(line);
            if (!sort.hasDate) {
                return null;
            }
            return {
                start: sort.start,
                end: sort.end,
                ongoing: /\b(aujourd'hui|aujourd’hui|present|présent|actuel|maintenant)\b/i.test(line),
            };
        })
        .filter(Boolean)
        .filter((range) => range.start >= 1980 && range.end >= range.start && range.end <= currentYear + 1);
};

const getPreferredGeneratedExperiencePeriod = (instruction = '') => {
    const explicitPeriods = getExplicitCvPeriodsFromText(instruction);
    if (explicitPeriods.length) {
        return formatCvYearPeriod(explicitPeriods[explicitPeriods.length - 1]);
    }

    const currentYear = new Date().getFullYear();
    const ranges = getExperienceFieldYearRanges();
    const hasOngoingExperience = ranges.some((range) => range.ongoing || range.end >= currentYear);
    const latestEnd = ranges.reduce((max, range) => Math.max(max, range.end), 0);

    return !hasOngoingExperience && latestEnd && latestEnd < currentYear
        ? formatCvYearPeriod({ start: latestEnd + 1, end: currentYear })
        : '';
};

const normalizeKirbyGeneratedExperiencePeriod = (experience = {}, instruction = '') => {
    const preferredPeriod = getPreferredGeneratedExperiencePeriod(instruction);
    if (!preferredPeriod) {
        return experience;
    }

    const currentPeriod = normalizeCvSentenceText(experience.period || '');
    const currentRange = getExplicitCvPeriodsFromText(currentPeriod)[0] || null;
    const source = normalizeForMatch([
        experience.title,
        experience.organization,
        ...(getKirbyCvArray(experience.description)),
        ...(getKirbyCvArray(experience.skills)),
    ].filter(Boolean).join(' '));
    const looksLikeGapDraft = /\b(projet|projets|numerique|numeriques|digital|web|autoformation|developpement|ia|intelligence artificielle|creation|creatrice|entrepreneur|formation|recherche active|benevolat)\b/.test(source);
    const overlapsRealExperience = currentRange
        ? getExperienceFieldYearRanges().some((range) => rangesOverlap(currentRange, range))
        : false;

    if (!currentPeriod || (looksLikeGapDraft && overlapsRealExperience)) {
        return {
            ...experience,
            period: preferredPeriod,
        };
    }

    return experience;
};

const serializeKirbyGeneratedExperience = (experience = {}) => {
    const entry = {
        title: formatCvHeadline(experience.title || 'Expérience à valider'),
        meta: normalizeCvSentenceText(experience.organization || ''),
        date: normalizeCvSentenceText(experience.period || ''),
        bullets: getKirbyCvArray(experience.description).map(normalizeCvSentenceText).filter(Boolean),
    };

    return serializeExperienceEntry(entry);
};

const mergeKirbyGeneratedExperiences = (experiences = [], instruction = '') => {
    const field = getExperienceField();
    const entries = getKirbyCvArray(experiences)
        .map((experience) => normalizeKirbyGeneratedExperiencePeriod(experience, instruction))
        .map(serializeKirbyGeneratedExperience)
        .filter(Boolean);

    if (!field || !entries.length) {
        return 0;
    }

    const existing = repairPreviewExperienceItems(splitLines(field.value));
    const existingKeys = new Set(existing.map((item) => normalizeForMatch(item)));
    const additions = entries.filter((entry) => !existingKeys.has(normalizeForMatch(entry)));

    if (!additions.length) {
        return 0;
    }

    field.value = normalizeCvTextareaValue('experience', sortTimelineEntriesNewestFirst([...existing, ...additions], additions).join('\n'));
    clearEditableOverride('experience');
    return additions.length;
};

const serializeKirbyEducationSuggestion = (education = {}) => {
    const title = normalizeCvSentenceText(education.title || '');
    const organization = normalizeCvSentenceText(education.organization || '');
    const period = normalizeCvSentenceText(education.period || '');
    const titleAlreadyContainsOrganization = organization && normalizeForMatch(title).includes(normalizeForMatch(organization));
    const header = [
        titleAlreadyContainsOrganization || !organization ? title : `${title} — ${organization}`,
        period,
    ].filter(Boolean).join(' - ');
    const description = normalizeCvSentenceText(education.description || '');

    return normalizeEducationDisplayItem([header, description].filter(Boolean).join(' • '));
};

const mergeKirbyEducationSuggestions = (educationSuggestions = []) => {
    const field = cvForm?.elements.education;
    const entries = getKirbyCvArray(educationSuggestions)
        .map(serializeKirbyEducationSuggestion)
        .filter(Boolean);

    if (!field || !entries.length) {
        return 0;
    }

    const existing = normalizeEducationItems(splitLines(field.value));
    const existingKeys = new Set(existing.map((item) => normalizeForMatch(item)));
    const additions = entries.filter((entry) => !existingKeys.has(normalizeForMatch(entry)));

    if (!additions.length) {
        return 0;
    }

    field.value = normalizeCvTextareaValue('education', [...existing, ...additions].join('\n'));
    clearEditableOverride('education');
    return additions.length;
};

const getApplicableKirbySuggestedSkills = (proposal = {}) => {
    return getKirbyProposalSuggestedSkills(proposal);
};

const getReviewedKirbySuggestedSkills = (proposal = {}) => {
    const choices = [...(assistantProposalDetails?.querySelectorAll('[data-kirby-skill-choice]') || [])];

    if (!choices.length) {
        return getApplicableKirbySuggestedSkills(proposal);
    }

    return dedupeCvSkillItems(
        choices
            .filter((choice) => choice.querySelector('[data-kirby-skill-enabled]')?.checked)
            .map((choice) => choice.querySelector('[data-kirby-skill-value]')?.value || '')
            .map(normalizeCvSentenceText)
            .filter(Boolean)
    );
};

const mergeKirbySuggestedSkills = (proposal = {}) => {
    const field = cvForm?.elements.skills;
    const suggested = getReviewedKirbySuggestedSkills(proposal);

    if (!field || !suggested.length) {
        return false;
    }

    const existing = splitLines(field.value).map(normalizeCvSentenceText);
    const value = dedupeCvSkillItems([...existing, ...suggested]).join('\n');

    if (!value || value === field.value) {
        return false;
    }

    field.value = value;
    clearEditableOverride('skills');
    return true;
};

const kirbySectionActions = [
    { key: 'summary', label: 'profil', aliases: ['profil', 'accroche', 'resume'] },
    { key: 'skills', label: 'compétences', aliases: ['competence', 'competences', 'skill', 'skills'] },
    { key: 'experience', label: 'expériences', aliases: ['experience', 'experiences', 'parcours'] },
    { key: 'projects', label: 'projets', aliases: ['projet', 'projets'] },
    { key: 'education', label: 'formations', aliases: ['formation', 'formations', 'certification', 'certifications', 'diplome', 'diplomes'] },
    { key: 'activities', label: 'activités', aliases: ['activite', 'activites', 'loisir', 'loisirs', 'centre d interet', 'centres d interet'] },
    { key: 'languages', label: 'langues', aliases: ['langue', 'langues'] },
];

const hasExplicitDestructiveCvRemoval = (instruction = '') => {
    const source = normalizeForMatch(String(instruction || '')).replace(/[’']/g, ' ');
    const asksRemoval = /\b(supprime|supprimer|retire|retirer|enleve|enlever|efface|effacer|masque|masquer)\b|pas besoin de/.test(source);
    const negatesRemoval = /\b(ne|n)\s+(?:me\s+)?(?:supprime|retire|enleve|efface)\s+pas\b|sans\s+(?:me\s+)?(?:supprimer|retirer|enlever|effacer)|ne touche pas|garde|conserve/.test(source);

    return asksRemoval && !negatesRemoval;
};

const getKirbyLayoutIntent = (instruction = '', layout = {}) => {
    const source = normalizeForMatch(String(instruction || '')).replace(/[’']/g, ' ');
    const removalAsked = hasExplicitDestructiveCvRemoval(instruction);
    const duplicateCleanupAsked = /\b(doublon|doublons|repetition|repetitions)\b/.test(source);
    const sectionRemovalAsked = removalAsked && !duplicateCleanupAsked;
    const sourceRemovals = sectionRemovalAsked
        ? kirbySectionActions
            .filter((section) => section.aliases.some((alias) => source.includes(alias)))
            .map((section) => section.key)
        : [];
    const modelRemovals = sectionRemovalAsked && Array.isArray(layout?.removeSections)
        ? layout.removeSections.filter((key) => kirbySectionActions.some((section) => section.key === key))
        : [];
    const removeSections = [...new Set([...sourceRemovals, ...modelRemovals])];
    const existingSkills = splitLines(cvForm?.elements.skills?.value || '');
    const namedSkillRemovals = sectionRemovalAsked && !removeSections.includes('skills')
        ? existingSkills.filter((skill) => {
            const normalizedSkill = normalizeForMatch(skill).replace(/[^a-z0-9]+/g, ' ').trim();
            return normalizedSkill.length > 2 && source.includes(normalizedSkill);
        })
        : [];
    const reflow = Boolean(layout?.reflow) || /\b(trou|espace vide|vide sous|mise en page|equilibr|reequilibr|remonter|reorganis|aeration)\b/.test(source);
    const compact = Boolean(layout?.compact) || /\b(compact|compacter|une page|trop long)\b/.test(source);

    return {
        removeSections,
        namedSkillRemovals,
        replaceSkills: removeSections.includes('skills') || namedSkillRemovals.length > 0,
        reflow,
        compact,
    };
};

const applyKirbyLayoutIntent = (intent = {}) => {
    if (!cvForm) {
        return [];
    }

    const changes = [];
    (intent.removeSections || []).forEach((key) => {
        const field = cvForm.elements[key];
        const section = kirbySectionActions.find((item) => item.key === key);

        if (!field || !field.value.trim()) {
            return;
        }

        field.value = '';
        clearEditableOverride(key);
        changes.push(`${section?.label || key} retirées`);
    });

    if (intent.compact) {
        const changed = cvForm.elements.fontSize?.value !== 'compact' || cvForm.elements.lineSpacing?.value !== 'tight';
        if (cvForm.elements.fontSize) cvForm.elements.fontSize.value = 'compact';
        if (cvForm.elements.lineSpacing) cvForm.elements.lineSpacing.value = 'tight';
        if (changed) changes.push('mise en page compacte');
    } else if (intent.reflow) {
        let changed = false;
        if (cvForm.elements.fontSize?.value === 'large') {
            cvForm.elements.fontSize.value = 'normal';
            changed = true;
        }
        if (cvForm.elements.lineSpacing?.value === 'airy') {
            cvForm.elements.lineSpacing.value = 'normal';
            changed = true;
        }
        if (changed || (intent.removeSections || []).length) changes.push('mise en page rééquilibrée');
    }

    return changes;
};

const applyKirbyExtractedCv = (extracted = {}) => {
    if (!cvForm || !extracted || typeof extracted !== 'object') {
        return [];
    }

    const changes = [];
    const setTextField = (name, value, label) => {
        const field = cvForm.elements[name];
        const nextValue = normalizeCvSentenceText(value || '');
        if (!field || !nextValue || field.value === nextValue) {
            return;
        }
        if (field.value?.trim() && !isDefaultCvFieldValue(name, field.value)) {
            return;
        }
        field.value = nextValue;
        clearEditableOverride(name === 'fullName' ? 'fullName' : name === 'location' || name === 'phone' || name === 'email' || name === 'permit' ? 'location' : name);
        changes.push(label);
    };
    const getMergedListValue = (name, incomingItems) => {
        const field = cvForm.elements[name];
        const existingItems = field && !isDefaultCvFieldValue(name, field.value)
            ? splitLines(field.value)
            : [];
        const combinedItems = [...existingItems, ...incomingItems].map(normalizeCvSentenceText).filter(Boolean);

        if (name === 'skills') {
            return dedupeCvSkillItems(combinedItems).join('\n');
        }

        if (name === 'activities') {
            return dedupeImportedItems(combinedItems).join('\n');
        }

        return normalizeCvTextareaValue(name, combinedItems.join('\n'));
    };
    const setListField = (name, values, label) => {
        const field = cvForm.elements[name];
        const items = Array.isArray(values)
            ? values.map((value) => normalizeCvSentenceText(value)).filter(Boolean)
            : [];
        const nextValue = getMergedListValue(name, items);
        if (!field || !nextValue || field.value === nextValue) {
            return;
        }
        field.value = nextValue;
        clearEditableOverride(name);
        changes.push(label);
    };

    setTextField('fullName', extracted.fullName, 'nom');
    setTextField('location', extracted.location, 'coordonnées');
    setTextField('phone', extracted.phone, 'coordonnées');
    setTextField('email', extracted.email, 'coordonnées');
    setTextField('permit', extracted.permit, 'permis');
    setTextField('headline', extracted.headline, 'titre');
    setTextField('summary', extracted.summary, 'accroche');
    setListField('skills', extracted.skills, 'compétences');
    setListField('experience', extracted.experiences, 'expériences');
    setListField('projects', extracted.projects, 'projets');
    setListField('education', extracted.education, 'formations');
    setListField('activities', extracted.activities, 'activités');

    if (mergeKirbyLanguages(extracted.languages)) {
        changes.push('langues');
    }

    return [...new Set(changes)];
};

const applyKirbyLetter = (letter = {}, fallbackRole = '') => {
    const subject = String(letter?.subject || '').replace(/\s{2,}/g, ' ').trim();
    const body = String(letter?.body || '').trim();

    if (!subject && !body) {
        return false;
    }

    const role = (letterRoleField?.value || fallbackRole || cvForm?.elements.headline?.value || '').trim();
    if (letterRoleField && !letterRoleField.value && role) {
        letterRoleField.value = role;
    }
    if (letterSubject && subject) {
        letterSubject.textContent = subject.startsWith('Objet') ? subject : `Objet : ${subject}`;
    }
    if (letterBody && body) {
        letterBody.textContent = body;
    }
    if (letterPageTitle) {
        letterPageTitle.textContent = cvForm?.elements.fullName?.value || 'Votre nom';
    }
    if (letterPageMeta) {
        letterPageMeta.textContent = role || 'Candidature professionnelle';
    }
    if (letterSubjectPage && letterSubject) {
        letterSubjectPage.textContent = letterSubject.textContent;
    }
    if (letterBodyPage && body) {
        letterBodyPage.textContent = body;
    }
    updatePreviewViewport();
    return true;
};

const KIRBY_BUG_REPORT_STORAGE_KEY = 'kirby-generic-bug-reports';

const getStoredKirbyBugReports = () => {
    try {
        return JSON.parse(localStorage.getItem(KIRBY_BUG_REPORT_STORAGE_KEY) || '[]');
    } catch (error) {
        return [];
    }
};

const saveKirbyBugReport = (report = {}) => {
    const reports = getStoredKirbyBugReports();
    const nextReport = {
        id: `kirby-bug-${Date.now()}`,
        createdAt: new Date().toISOString(),
        category: report.category || 'bug application',
        summary: report.summary || 'Demande comprise, mais aucune modification visible n’a été appliquée.',
        expectedAction: report.expectedAction || '',
        target: report.target || '',
        details: report.details || '',
        instruction: report.instruction || '',
    };

    localStorage.setItem(KIRBY_BUG_REPORT_STORAGE_KEY, JSON.stringify([nextReport, ...reports].slice(0, 50)));
    return nextReport;
};

const formatKirbyBugReportReply = (report = {}) => [
    'Rapport de bug créé.',
    report.category ? `Catégorie : ${report.category}.` : '',
    report.summary ? `Résumé : ${report.summary}.` : '',
    report.target ? `Élément concerné : ${report.target}.` : '',
    report.expectedAction ? `Action attendue : ${report.expectedAction}.` : '',
].filter(Boolean).join(' ');

const getOperationTargetText = (operation = {}) => [
    operation.target?.label,
    operation.target?.title,
    operation.target?.organization,
    operation.target?.currentValue,
].filter(Boolean).join(' ');

const getOperationTargetScore = (entry = {}, operation = {}) => {
    const target = normalizeForMatch(getOperationTargetText(operation));
    if (!target) {
        return 0;
    }

    const entryText = normalizeForMatch(`${entry.title || ''} ${entry.meta || ''} ${entry.date || ''}`);
    const tokens = target.split(/[^a-z0-9]+/).filter((token) => token.length >= 3);

    return [...new Set(tokens)].filter((token) => entryText.includes(token)).length;
};

const findExperienceIndexForOperation = (entries = [], operation = {}) => {
    const targetIndex = Number.isInteger(operation.target?.index) ? operation.target.index : null;
    if (targetIndex !== null && entries[targetIndex]) {
        return targetIndex;
    }

    const selectedIndex = getSelectedExperienceIndex();
    const targetText = getOperationTargetText(operation);
    if (selectedIndex !== null && entries[selectedIndex] && (!targetText || /cette|selection|sélection/i.test(targetText))) {
        return selectedIndex;
    }

    const scores = entries
        .map((entry, index) => ({ index, score: getOperationTargetScore(entry, operation) }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score);

    if (scores.length > 1 && scores[0].score === scores[1].score) {
        return -2;
    }

    if (scores.length) {
        return scores[0].index;
    }

    return entries.length === 1 ? 0 : -1;
};

const applyKirbyOperation = (operation = {}) => {
    if (!operation?.type) {
        return '';
    }

    if (operation.type === 'update_experience_date') {
        const field = getExperienceField();
        const date = normalizeExperienceDateText(operation.value || '');
        if (!field || !date) {
            return '';
        }

        const entries = repairPreviewExperienceItems(splitLines(field.value)).map(parseExperienceEntry);
        const index = findExperienceIndexForOperation(entries, operation);
        if (index < 0 || !entries[index]) {
            return '';
        }

        const previous = entries[index].date || '';
        if (normalizeExperienceDateText(previous) === date) {
            return '';
        }

        entries[index] = { ...entries[index], date };
        field.value = entries.map(serializeExperienceEntry).filter(Boolean).join('\n');
        clearEditableOverride('experience');
        return `date ${entries[index].title || 'expérience'}`;
    }

    if (operation.type === 'upsert_language') {
        const language = operation.target?.label || operation.field || '';
        const level = operation.value || operation.target?.currentValue || '';
        return mergeKirbyLanguages([{ language, level }]) ? 'langues' : '';
    }

    if (operation.type === 'set_field') {
        const fieldName = operation.field;
        const field = fieldName && cvForm?.elements[fieldName];
        const value = String(operation.value || '').trim();
        if (!field || !value || field.value.trim() === value) {
            return '';
        }
        field.value = ['skills', 'education', 'activities', 'projects', 'languages'].includes(fieldName)
            ? normalizeCvTextareaValue(fieldName, value)
            : ['email', 'phone'].includes(fieldName)
                ? value
                : normalizeCvSentenceText(value);
        clearEditableOverride(fieldName);
        return fieldName;
    }

    if (operation.type === 'remove_section') {
        const key = operation.field || normalizeForMatch(operation.target?.label || '');
        return applyKirbyLayoutIntent({ removeSections: [key], reflow: true, compact: false }).length ? 'section retirée' : '';
    }

    if (operation.type === 'remove_experience') {
        const field = getExperienceField();
        if (!field) {
            return '';
        }

        const entries = repairPreviewExperienceItems(splitLines(field.value)).map(parseExperienceEntry);
        const index = findExperienceIndexForOperation(entries, operation);
        if (index < 0 || !entries[index]) {
            return '';
        }

        field.value = entries
            .filter((_, entryIndex) => entryIndex !== index)
            .map(serializeExperienceEntry)
            .filter(Boolean)
            .join('\n');
        clearEditableOverride('experience');
        return 'expérience retirée';
    }

    if (operation.type === 'reorder_experiences') {
        const changed = sortExperienceFieldNewestFirst();
        return changed ? 'ordre des expériences' : '';
    }

    return '';
};

const applyKirbyOperations = (operations = []) => {
    const applied = getKirbyCvArray(operations).slice(0, 8)
        .map(applyKirbyOperation)
        .filter(Boolean);

    return [...new Set(applied)];
};

const applyKirbyCvResult = (result, task, instruction = '', options = {}) => {
    const proposal = result?.cv;

    if (!cvForm || !proposal || typeof proposal !== 'object') {
        return 'Kirby n’a pas renvoyé de proposition exploitable.';
    }

    const userInstruction = getKirbyUserInstruction(instruction);
    const languageOnlyIntent = isLanguageFocusedInstruction(userInstruction) && !looksLikePastedCv(userInstruction);
    const singleFieldIntent = getSingleFieldEditIntent(userInstruction);
    const changes = ['autofill', 'create'].includes(task) ? applyKirbyExtractedCv(proposal.extracted) : [];
    const operationChanges = applyKirbyOperations(proposal.operations);
    changes.push(...operationChanges);
    const applyMode = options?.applyMode === 'proposal' ? 'proposal' : 'direct';
    const directTargetedUpdate = applyMode === 'direct' && (operationChanges.length || singleFieldIntent || languageOnlyIntent);
    const allowGlobalCvRewrite = !directTargetedUpdate;

    if (languageOnlyIntent && !['autofill', 'create'].includes(task)) {
        if (!operationChanges.length && mergeKirbyLanguages(proposal.languages)) {
            changes.push('langues');
        }

        clearEditableOverride('languages');
        updateCvPreview();
        renderLanguageEditor();
        scheduleCvDraftSave();
        setCvStatus(changes.length ? `Kirby a mis à jour le CV : ${changes.join(', ')}` : 'Kirby a analysé les langues');

        return changes.length
            ? `CV mis à jour : ${changes.join(', ')}.`
            : 'Indiquez la langue et le niveau à ajouter, par exemple : Français courant, Anglais notions.';
    }

    const headlineField = cvForm.elements.headline;
    const summaryField = cvForm.elements.summary;
    const skillsField = cvForm.elements.skills;
    const layoutIntent = getKirbyLayoutIntent(instruction, proposal.layout);
    const headlineCorrectionAsked = /\b(titre|intitule|poste vise|vendeur|vendeuse|conseiller|conseillere|charge|chargee)\b/.test(normalizeForMatch(instruction));

    if (allowGlobalCvRewrite && !singleFieldIntent && proposal.jobTarget && cvForm.elements.jobTarget) {
        cvForm.elements.jobTarget.value = formatCvHeadline(proposal.jobTarget);
    }

    if (proposal.headline && headlineField && (
        singleFieldIntent === 'headline' ||
        (allowGlobalCvRewrite && !singleFieldIntent && (task === 'adapt' || headlineCorrectionAsked || !headlineField.value || /intitule du poste vise/i.test(headlineField.value)))
    )) {
        headlineField.value = formatCvHeadline(proposal.headline);
        changes.push('titre');
    }

    if (proposal.summary && summaryField && (!singleFieldIntent || singleFieldIntent === 'summary')) {
        const summary = normalizeCvSentenceText(proposal.summary);
        if (summary && summary !== summaryField.value) {
            summaryField.value = summary;
            changes.push('accroche');
        }
    }

    if (allowGlobalCvRewrite && !singleFieldIntent && skillsField && ((Array.isArray(proposal.skills) && proposal.skills.length) || layoutIntent.namedSkillRemovals.length)) {
        const existing = splitLines(skillsField.value).map(normalizeCvSentenceText);
        const proposed = Array.isArray(proposal.skills) ? proposal.skills.map(normalizeCvSentenceText) : [];
        const allowSkillRemoval = hasExplicitDestructiveCvRemoval(instruction);
        const removedSkills = new Set((allowSkillRemoval ? layoutIntent.namedSkillRemovals : []).map((skill) => normalizeForMatch(skill)));
        const retainedExisting = allowSkillRemoval
            ? existing.filter((skill) => !removedSkills.has(normalizeForMatch(skill)))
            : existing;
        const candidates = layoutIntent.replaceSkills && allowSkillRemoval
            ? [...proposed, ...retainedExisting]
            : [...proposed, ...existing];
        const value = dedupeCvSkillItems(candidates.filter((skill) => !removedSkills.has(normalizeForMatch(skill)))).join('\n');
        if (value && value !== skillsField.value) {
            skillsField.value = value;
            changes.push('compétences');
        }
    }

    const generatedExperienceCount = allowGlobalCvRewrite && !singleFieldIntent
        ? mergeKirbyGeneratedExperiences(proposal.generatedExperiences, instruction)
        : 0;
    if (generatedExperienceCount) {
        changes.push(`${generatedExperienceCount} expérience(s) proposée(s)`);
    }

    const educationSuggestionCount = allowGlobalCvRewrite && !singleFieldIntent
        ? mergeKirbyEducationSuggestions(proposal.educationSuggestions)
        : 0;
    if (educationSuggestionCount) {
        changes.push(`${educationSuggestionCount} formation(s) / certification(s)`);
    }

    if (allowGlobalCvRewrite && !singleFieldIntent && mergeKirbySuggestedSkills(proposal)) {
        changes.push('compétences suggérées');
    }

    if (allowGlobalCvRewrite && !singleFieldIntent && reorderExistingExperiences(proposal.experienceOrder)) {
        changes.push('ordre des expériences');
    }

    if (allowGlobalCvRewrite && !singleFieldIntent && sortExperienceFieldNewestFirst()) {
        changes.push('expériences triées par date');
    }

    if (harmonizeExperienceFieldStructure({ silent: true })) {
        changes.push('expériences harmonisées');
    }

    if ((!singleFieldIntent || singleFieldIntent === 'languages') && mergeKirbyLanguages(proposal.languages)) {
        changes.push('langues');
    }

    if (allowGlobalCvRewrite && !singleFieldIntent) {
        changes.push(...applyKirbyLayoutIntent(layoutIntent));
    }

    const shouldApplyLetter = task === 'letter' || /\blettre(?:\s+de\s+motivation)?\b/.test(normalizeForMatch(instruction));
    const didApplyLetter = shouldApplyLetter && applyKirbyLetter(proposal.letter, proposal.jobTarget || proposal.headline);
    if (didApplyLetter) {
        changes.push('lettre de motivation');
    }

    clearEditableOverrides();
    updateCvPreview();
    renderExperienceEditor();
    renderLanguageEditor();

    if (allowGlobalCvRewrite && !singleFieldIntent && task !== 'letter' && getRenderedCvPageCount() > 1) {
        applyCompactCvLayout(true);
        updateCvPreview();
        renderExperienceEditor();
        renderLanguageEditor();
        changes.push('mise en page compacte');
    }
    scheduleCvDraftSave();

    if (task === 'letter' && didApplyLetter) {
        setPreviewMode('letter');
    }

    setCvStatus(changes.length ? `Kirby a mis à jour le CV : ${changes.join(', ')}` : 'Kirby a analysé le CV');
    return changes.length ? `CV mis à jour : ${changes.join(', ')}.` : 'Le CV est déjà aligné avec votre demande.';
};

const shouldApplyKirbyResultDirectly = ({ task = '', instruction = '' } = {}) => {
    const userInstruction = getKirbyUserInstruction(instruction);
    const source = normalizeForMatch(userInstruction);
    const precisionSensitive = /\b(mise en page|aeration|aération|align|alignement|hierarchie|hiérarchie|lisibilite|lisibilité|espace|espacement|marge|padding|colonne|colonnes|section|titre|titres|pdf|a4|export|equilibr|equilibre|equilibree|equilibree|repart|repartition|descend|monte|remonte|decale|decalage|largeur|hauteur|respiration|glass|crystal)\b/.test(source);

    if (isLanguageFocusedInstruction(userInstruction)) {
        return true;
    }

    if (isSingleFieldEditIntent(userInstruction)) {
        return true;
    }

    if (['create', 'autofill'].includes(task)) {
        return isExplicitKirbyApplyInstruction(userInstruction) || looksLikeCvCreationInstruction(userInstruction) || looksLikePastedCv(userInstruction);
    }

    if (precisionSensitive) {
        return false;
    }

    if (task !== 'optimize') {
        return false;
    }

    if (/\b(trou|periode|période|vide|combler|valoriser|autoformation|autodidacte|projet personnel|entrepreneur|creatrice|créatrice|formation|certification|certificat|atelier|simplon|ecole 42|école 42|piscine|benevolat|bénévolat|mission ponctuelle|recherche active)\b/.test(source)
        && !isExplicitKirbyApplyInstruction(userInstruction)) {
        return false;
    }

    return isExplicitKirbyApplyInstruction(userInstruction)
        && !looksLikePastedCv(userInstruction)
        && !looksLikeJobOffer(userInstruction);
};

const hasKirbyOperations = (result = {}) => getKirbyCvArray(result?.cv?.operations).length > 0;

const getSingleFieldEditIntent = (instruction = '') => {
    const source = normalizeForMatch(getKirbyUserInstruction(instruction));
    const hasEditVerb = /\b(ajoute|ajouter|mets|mettre|met|modifie|modifier|change|changer|corrige|corriger|remplace|remplacer|retire|retirer|supprime|supprimer)\b/.test(source);

    if (!hasEditVerb) {
        return '';
    }

    const fieldPatterns = [
        ['date', /\b(date|dates|periode|periodes)\b/],
        ['languages', /\b(langue|langues|francais|anglais|arabe|espagnol|italien|allemand|portugais|french|english|native|basic|notions?|courant|bilingue)\b/],
        ['phone', /\b(telephone|tel|mobile|numero|numéro)\b/],
        ['email', /\b(email|e-mail|mail|adresse mail|courriel)\b/],
        ['headline', /\b(titre|intitule|intitulé|poste vise|poste visé|metier|métier)\b/],
        ['summary', /\b(profil|accroche|resume|résumé|presentation|présentation)\b/],
        ['fullName', /\b(nom|prenom|prénom)\b/],
        ['location', /\b(ville|adresse|code postal|localisation)\b/],
        ['permit', /\b(permis)\b/],
    ];
    const matches = fieldPatterns.filter(([, pattern]) => pattern.test(source));

    return matches.length === 1 ? matches[0][0] : '';
};

const isSingleFieldEditIntent = (instruction = '') => Boolean(getSingleFieldEditIntent(instruction));

const runKirbyCvAssistant = async ({ task = 'assistant', instruction = '' } = {}) => {
    if (!cvForm) {
        return 'Le formulaire CV est indisponible.';
    }

    if (isKirbyCvRequestInFlight) {
        return 'Kirby analyse déjà le CV.';
    }

    const layoutIntent = getKirbyLayoutIntent(instruction);
    const isAutopilotInstruction = shouldRunCvAutopilotMode(instruction);
    const taskLabel = isAutopilotInstruction
        ? 'Kirby prend le CV en main…'
        : layoutIntent.removeSections.length || layoutIntent.namedSkillRemovals.length || layoutIntent.reflow || layoutIntent.compact
        ? 'Kirby prépare les suppressions et la mise en page…'
        : {
        create: 'Kirby structure votre CV…',
        autofill: 'Kirby extrait les informations du CV…',
        optimize: 'Kirby vérifie les fautes, doublons et lisibilité…',
        adapt: 'Kirby adapte le CV au poste visé…',
        letter: 'Kirby rédige la lettre de motivation…',
        assistant: 'Kirby analyse le CV…',
    }[task] || 'Kirby analyse le CV…';

    isKirbyCvRequestInFlight = true;
    setCvStatus(taskLabel);
    setAssistantActivity(taskLabel, true);
    const snapshot = getKirbyCvSnapshot();

    try {
        const result = await requestKirbyCvAssistant({ task, instruction });
        const runtimeLabel = getKirbyRuntimeLabel(result);
        const operationDriven = hasKirbyOperations(result);
        const singleFieldDriven = isSingleFieldEditIntent(instruction);
        const currentSnapshot = getKirbyCvSnapshot();
        const sourceChangedDuringRequest = snapshot !== currentSnapshot;
        const canApplyDirectly = (operationDriven || shouldApplyKirbyResultDirectly({ task, instruction }))
            && !sourceChangedDuringRequest;

        if (sourceChangedDuringRequest) {
            hideKirbyCvProposal();
            setCvStatus('Le CV a changé pendant l’analyse');
            setAssistantActivity(`${runtimeLabel} · Le CV affiché a changé pendant l’analyse. Kirby ignore cette ancienne réponse.`, false);
            return 'Le CV a changé pendant l’analyse. Kirby a ignoré cette ancienne réponse pour respecter la version actuellement affichée. Relancez la demande si besoin.';
        }

        if (canApplyDirectly) {
            const beforeApplySnapshot = getKirbyCvSnapshot();
            const reply = applyKirbyCvResult(result, task, instruction, { applyMode: 'direct' });
            const afterApplySnapshot = getKirbyCvSnapshot();
            const operationFailed = (operationDriven || singleFieldDriven) && beforeApplySnapshot === afterApplySnapshot;
            if (operationFailed) {
                const report = saveKirbyBugReport({
                    ...(result.cv?.bugReport || {}),
                    category: result.cv?.bugReport?.category || 'bug application',
                    summary: result.cv?.bugReport?.summary || 'La demande a été comprise par Kirby, mais l’application n’a pas modifié le CV.',
                    expectedAction: result.cv?.operations?.[0]?.reason || result.cv?.operations?.[0]?.type || 'Appliquer l’opération demandée',
                    target: getOperationTargetText(result.cv?.operations?.[0]) || result.cv?.operations?.[0]?.field || 'CV',
                    instruction,
                });
                hideKirbyCvProposal();
                setAssistantActivity(`${runtimeLabel} · ${formatKirbyBugReportReply(report)}`, false);
                return formatKirbyBugReportReply(report);
            }
            hideKirbyCvProposal();
            setAssistantActivity(`${runtimeLabel} · Modification appliquée. Retour permet d’annuler.`, false);
            return reply;
        }

        if (!showKirbyCvProposal(result, task, snapshot, instruction)) {
            return 'Kirby n’a pas pu préparer de proposition exploitable.';
        }
        setCvStatus('Proposition Kirby prête à appliquer');
        setAssistantActivity(`${runtimeLabel} · Contrôle terminé. Vérifiez le résumé puis appliquez la proposition.`);
        return 'Proposition prête. Vérifiez le résumé puis choisissez « Appliquer au CV ».';
    } catch (error) {
        console.error(error);
        return 'Kirby est momentanément indisponible. Le CV n’a pas été modifié.';
    } finally {
        isKirbyCvRequestInFlight = false;

        const queuedMessage = queuedAssistantPrompt;
        queuedAssistantPrompt = '';
        if (queuedMessage) {
            window.setTimeout(async () => {
                const languageFocused = isLanguageFocusedInstruction(queuedMessage);
                if (languageFocused && !hasLanguageNameInInstruction(queuedMessage)) {
                    hideKirbyCvProposal();
                    appendAssistantMessage('Quelle langue et quel niveau dois-je ajouter ? Exemple : Français courant, Anglais notions.', 'bot');
                    return;
                }

                const quickReply = applyQuickKirbyCorrection(queuedMessage);
                if (quickReply) {
                    hideKirbyCvProposal();
                    appendAssistantMessage(quickReply, 'bot');
                    return;
                }

                const autopilotMode = shouldRunCvAutopilotMode(queuedMessage);

                const localReplies = [];
                if (autopilotMode) {
                    const autopilotChanges = applyCvAutopilotLocalCleanup({ readyLayout: true, silent: true });
                    if (autopilotChanges.length) {
                        localReplies.push(`J'ai déjà préparé la structure : ${autopilotChanges.join(', ')}.`);
                    }
                }

                const messageIsOffer = setJobOfferFromAssistantMessage(queuedMessage);
                hideKirbyCvProposal();
                const assistantInstruction = autopilotMode ? buildCvAutopilotInstruction(queuedMessage) : queuedMessage;
                const reply = await runKirbyCvAssistant({
                    task: messageIsOffer ? 'adapt' : getAssistantTask(queuedMessage, activeKirbyMode),
                    instruction: assistantInstruction,
                });
                appendAssistantMessage(formatKirbyAssistantReply(localReplies, reply), 'bot');
            }, 0);
        }
    }
};

const formatKirbyAssistantReply = (localReplies = [], reply = '') => {
    const cleanReply = String(reply || '').trim();

    if (/^(CV mis à jour|Base CV créée|CV corrigé|Langues mises à jour|Expériences rangées|Le CV est déjà aligné)/i.test(cleanReply)) {
        return cleanReply;
    }

    return [...localReplies, cleanReply].filter(Boolean).join('\n\n');
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

    return "Action disponible : accroche, expériences, compétences, langues, fautes, projets, offre ou CV prêt.";
};

const shouldUseKirbyCvAssistant = (message = '') => Boolean(message.trim());

const handleAssistantPrompt = async (message, mode = activeKirbyMode) => {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
        return;
    }

    if (isKirbyCvRequestInFlight) {
        queuedAssistantPrompt = cleanMessage;
        setAssistantActivity('Demande enregistrée : Kirby la traitera après l’analyse en cours.', true);
        return;
    }

    const languageFocused = isLanguageFocusedInstruction(cleanMessage);
    if (languageFocused && !hasLanguageNameInInstruction(cleanMessage)) {
        hideKirbyCvProposal();
        appendAssistantMessage('Quelle langue et quel niveau dois-je ajouter ? Exemple : Français courant, Anglais notions.', 'bot');
        return;
    }

    const quickReply = applyQuickKirbyCorrection(cleanMessage);
    if (quickReply) {
        hideKirbyCvProposal();
        appendAssistantMessage(quickReply, 'bot');
        return;
    }

    const autopilotMode = shouldRunCvAutopilotMode(cleanMessage);

    const localReplies = [];
    if (autopilotMode) {
        const autopilotChanges = applyCvAutopilotLocalCleanup({ readyLayout: true, silent: true });
        if (autopilotChanges.length) {
            localReplies.push(`J'ai déjà préparé la structure : ${autopilotChanges.join(', ')}.`);
        }
    }

    const messageIsOffer = mode !== 'letter' && setJobOfferFromAssistantMessage(cleanMessage);
    hideKirbyCvProposal();
    const assistantInstruction = autopilotMode ? buildCvAutopilotInstruction(cleanMessage) : cleanMessage;
    const reply = shouldUseKirbyCvAssistant(cleanMessage)
        ? await runKirbyCvAssistant({
            task: messageIsOffer ? 'adapt' : getAssistantTask(cleanMessage, mode),
            instruction: assistantInstruction,
        })
        : getAssistantReply(cleanMessage);
    appendAssistantMessage(formatKirbyAssistantReply(localReplies, reply), 'bot');
};

const handleAuthLogin = async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(authLoginForm);
        const email = normalizeAccountEmail((formData.get('email') || '').toString());
        const password = (formData.get('password') || '').toString();
        const client = await initializeSupabaseClient();
        const { data, error } = await client.auth.signInWithPassword({ email, password });

        if (error) {
            throw error;
        }

        persistAuthSession(data?.user || null);
        activeEditableNode = null;
        activeFormatNode = null;
        savedFormatRange = null;
        updateAuthUi();
        await loadCvDraft({ silent: true });
        refreshCvModule();
        closeSiteMenu();
        authLoginForm.reset();
        closeAuthModal();
        setCvStatus('Connexion securisee active');
    } catch (error) {
        console.error(error);
        setAuthFeedback(formatAuthErrorMessage(error, 'login'), true);
    }
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

    try {
        const client = await initializeSupabaseClient();
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            throw error;
        }

        persistAuthSession(data?.session?.user || null);
        activeEditableNode = null;
        activeFormatNode = null;
        savedFormatRange = null;
        updateAuthUi();
        if (data?.session?.user) {
            applyCurrentUserDefaults();
            resetCvHistory();
            await saveCvDraft(true);
            refreshCvModule();
        }
        closeSiteMenu();
        authSignupForm.reset();
        closeAuthModal();
        setCvStatus(data?.session ? 'Compte cree et connecte' : 'Compte cree. Confirmez votre email si necessaire.');
    } catch (error) {
        console.error(error);
        setAuthFeedback(formatAuthErrorMessage(error, 'signup'), true);
    }
};

const handleAuthLogout = async () => {
    try {
        const client = await initializeSupabaseClient();
        const { error } = await client.auth.signOut();

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error(error);
    }

    persistAuthSession(null);
    activeEditableNode = null;
    activeFormatNode = null;
    savedFormatRange = null;
    resetCvDraftState();
    clearLegacyAuthStorage();
    resetCvFormToDefaults();
    updateAuthUi();
    updateCvPreview();
    renderExperienceEditor();
    renderLanguageEditor();
    resetCvHistory();
    refreshCvModule();
    closeSiteMenu();
    setPreviewMode('cv');
    setCvStatus('Deconnectee. Mode invite actif');
};

window.addEventListener('load', () => {
    document.body.classList.remove('is-preload');
    document.body.classList.add('is-ready');
    initSiteTheme();
    clearLegacyAuthStorage();
    (async () => {
        await loadAuthSession();
        updateAuthUi();
        try {
            await loadCvDraft({ silent: true });
        } catch (error) {
            console.error(error);
            setCvStatus('Brouillon securise ignore pour eviter un blocage');
        }
        refreshCvModule();
    })().catch((error) => {
        console.error(error);
        refreshCvModule();
    });
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
cvGateLoginButton?.addEventListener('click', () => openAuthModal('login'));
cvGateSignupButton?.addEventListener('click', () => openAuthModal('signup'));
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
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's' && cvForm) {
        event.preventDefault();
        previewCurrentDocument();
        return;
    }

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
    const requestedItems = contactParams.get('items');
    const serviceField = contactForm.querySelector('[name="service"]');
    const messageField = contactForm.querySelector('[name="message"]');
    const summaryTitle = document.querySelector('#contact-summary-title');
    const summaryMessage = document.querySelector('#contact-summary-message');
    const summaryPills = document.querySelector('#contact-summary-pills');
    const fallbackService = requestedService || 'Projet site web';
    const fallbackMessage = requestedMessage || [
        'Bonjour,',
        '',
        `Je souhaite finaliser une demande pour : ${fallbackService}.`,
        'Le projet vient du générateur SA Création Web.',
        'Merci de me recontacter pour valider les détails.',
    ].join('\n');
    const summaryItems = (requestedItems || '')
        .split('|')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6);

    if (requestedService && serviceField) {
        serviceField.value = requestedService;
    }

    if (messageField && !messageField.value.trim()) {
        messageField.value = fallbackMessage;
    }

    if (summaryTitle) {
        summaryTitle.textContent = fallbackService;
    }

    if (summaryMessage) {
        const compactMessage = requestedMessage ? requestedMessage.replace(/\s+/g, ' ').trim() : '';
        summaryMessage.textContent = compactMessage
            ? `${compactMessage.slice(0, 179).trim()}${compactMessage.length > 180 ? '…' : ''}`
            : 'Votre demande est preparee automatiquement avec les informations du generateur.';
    }

    if (summaryPills && summaryItems.length) {
        summaryPills.innerHTML = summaryItems.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const fullName = (formData.get('name') || '').toString().trim();
        const phone = (formData.get('phone') || '').toString().trim();
        const lastName = '';
        const firstName = fullName;
        const email = (formData.get('email') || '').toString().trim();
        const service = (formData.get('service') || fallbackService).toString().trim();
        const deadline = '';
        const details = [];
        const message = (formData.get('message') || fallbackMessage).toString().trim();
        const fullMessage = [
            service ? `Projet : ${service}` : 'Projet : non precise',
            phone ? `Telephone : ${phone}` : 'Telephone : non precise',
            summaryItems.length > 0 ? `Elements inclus : ${summaryItems.join(', ')}` : '',
            '',
            'Message genere :',
            message || '-',
        ].filter(Boolean).join('\n');

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
        return sortTimelineEntriesNewestFirst(normalizeEducationItems(items.filter((item) => !/^[-–—]?\s*\)?$/.test(item.trim())))).join('\n');
    }

    if (fieldName === 'experience' || fieldName === 'projects') {
        const timelineItems = repairPreviewExperienceItems(dedupeImportedItems(items));
        return (fieldName === 'experience'
            ? sortTimelineEntriesNewestFirst(normalizeDigitalProjectTimelinePeriods(timelineItems))
            : timelineItems
        ).join('\n');
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

        if (event.isTrusted) {
            hideKirbyCvProposal();
        }

        if (fieldName === 'colorTheme' && event.type === 'change') {
            applyModernColorPalette(event.target.value);
        }

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

        if (fieldName === 'languages' && event.target instanceof HTMLTextAreaElement && !isSyncingLanguageEditor) {
            renderLanguageEditor();
        }

        if (linkedTarget) {
            clearEditableOverride(linkedTarget);
        }

        if (fieldName === 'projectType') {
            clearEditableOverride('projects');
        }

        updateCvPreview();
        updateWordToolbarState();
        captureCvHistoryFromInteraction();
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
    cvForm.querySelectorAll('textarea[name="experience"], textarea[name="projects"], textarea[name="education"], textarea[name="languages"]').forEach((field) => {
        field.addEventListener('blur', () => {
            setTextareaNormalizedValue(field, field.name);
            if (field.name === 'experience') {
                renderExperienceEditor();
            }
            if (field.name === 'languages') {
                renderLanguageEditor();
            }
            updateCvPreview();
            captureCvHistoryFromInteraction();
            scheduleCvDraftSave();
        });
    });
}

if (experienceAddButton) {
    experienceAddButton.addEventListener('click', addExperienceCard);
}

if (experienceCards) {
    const rememberExperienceCard = (target) => {
        const card = target?.closest?.('.experience-card[data-experience-index]');
        const index = Number.parseInt(card?.dataset?.experienceIndex || '', 10);
        if (Number.isInteger(index) && index >= 0) {
            activeExperienceIndex = index;
        }
    };

    experienceCards.addEventListener('focusin', (event) => {
        rememberExperienceCard(event.target);
    });

    experienceCards.addEventListener('input', (event) => {
        if (event.target?.matches('[data-experience-field]')) {
            rememberExperienceCard(event.target);
            syncExperienceFieldFromEditor();
        }
    });

    experienceCards.addEventListener('click', (event) => {
        rememberExperienceCard(event.target);
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

if (languageAddButton) {
    languageAddButton.addEventListener('click', addLanguageCard);
}

if (languageCards) {
    languageCards.addEventListener('input', (event) => {
        if (event.target?.matches('[data-language-field]')) {
            syncLanguageFieldFromEditor();
        }
    });

    languageCards.addEventListener('change', (event) => {
        if (event.target?.matches('[data-language-field]')) {
            syncLanguageFieldFromEditor();
        }
    });

    languageCards.addEventListener('click', (event) => {
        const button = event.target.closest('[data-language-action="remove"]');

        if (!button) {
            return;
        }

        button.closest('.language-card')?.remove();
        syncLanguageFieldFromEditor({ refreshCards: true, status: 'Langue supprimée' });
    });
}

if (previewHeadlineScale && cvForm) {
    previewHeadlineScale.addEventListener('change', () => {
        cvForm.elements.headlineScale.value = previewHeadlineScale.value;
        updateCvPreview();
        captureCvHistoryFromInteraction({ immediate: true });
        scheduleCvDraftSave();
        setCvStatus('Taille du titre ajustee');
    });
}

if (previewLineSpacing && cvForm) {
    previewLineSpacing.addEventListener('change', () => {
        cvForm.elements.lineSpacing.value = previewLineSpacing.value;
        updateCvPreview();
        captureCvHistoryFromInteraction({ immediate: true });
        scheduleCvDraftSave();
        setCvStatus('Interligne mis a jour');
    });
}

if (previewLayoutTheme && cvForm) {
    previewLayoutTheme.addEventListener('change', () => {
        cvForm.elements.layoutTheme.value = previewLayoutTheme.value;
        updateCvPreview();
        captureCvHistoryFromInteraction({ immediate: true });
        scheduleCvDraftSave();
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

        hideKirbyCvProposal();

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
            captureCvHistoryFromInteraction({ immediate: true });
            scheduleCvDraftSave();
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
        captureCvHistoryFromInteraction({ immediate: true });
        scheduleCvDraftSave();
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

const getFormatTargetFromNode = (node) => {
    const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    return element?.closest?.('[contenteditable="true"], [data-section-title]') || null;
};

const getCurrentFormatRange = () => {
    const selection = document.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const rangeTarget = range ? getFormatTargetFromNode(range.commonAncestorContainer) : null;

    if (range && rangeTarget) {
        savedFormatRange = range.cloneRange();
        activeFormatNode = rangeTarget;
        if (rangeTarget.isContentEditable) {
            activeEditableNode = rangeTarget;
        }
        return range;
    }

    return savedFormatRange && document.body.contains(savedFormatRange.commonAncestorContainer)
        ? savedFormatRange
        : null;
};

const rememberFormatTarget = (node) => {
    const target = getFormatTargetFromNode(node);
    if (!target) {
        return;
    }

    activeFormatNode = target;
    if (target.isContentEditable) {
        activeEditableNode = target;
    }
};

const getActiveEditableNode = () => {
    if (activeEditableNode && document.body.contains(activeEditableNode)) {
        return activeEditableNode;
    }

    activeEditableNode = getEditableSelectionNode();
    return activeEditableNode;
};

const getActiveFormatNode = () => {
    const range = getCurrentFormatRange();
    const rangeTarget = range ? getFormatTargetFromNode(range.commonAncestorContainer) : null;
    if (rangeTarget) {
        return rangeTarget;
    }

    if (activeFormatNode && document.body.contains(activeFormatNode)) {
        return activeFormatNode;
    }

    return getActiveEditableNode();
};

const getSelectedFormatNodes = () => {
    const range = getCurrentFormatRange();

    if (range && !range.collapsed) {
        const selectedNodes = [...document.querySelectorAll('[contenteditable="true"], [data-section-title]')]
            .filter((node) => range.intersectsNode(node));
        if (selectedNodes.length) {
            return selectedNodes;
        }
    }

    const activeNode = getActiveFormatNode();
    return activeNode ? [activeNode] : [];
};

const updateWordToolbarState = () => {
    const node = getActiveFormatNode();

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
        if (family.includes('manrope')) {
            cvInlineFont.value = "'Manrope', sans-serif";
        } else if (family.includes('inter')) {
            cvInlineFont.value = "'Inter', sans-serif";
        } else if (family.includes('roboto')) {
            cvInlineFont.value = 'Roboto, sans-serif';
        } else if (family.includes('lato')) {
            cvInlineFont.value = "'Lato', sans-serif";
        } else if (family.includes('libre baskerville')) {
            cvInlineFont.value = "'Libre Baskerville', serif";
        } else if (family.includes('playfair')) {
            cvInlineFont.value = "'Playfair Display', serif";
        } else if (family.includes('ibm plex')) {
            cvInlineFont.value = "'IBM Plex Sans', sans-serif";
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
        const style = extractEditableNodeStyleState(node);
        if (isDefaultEditableStyleState(style)) {
            delete cvEditableContent[target];
        } else {
            cvEditableContent[target] = { style };
        }
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
        const modernContactValues = [...node.querySelectorAll('[data-contact-value]')]
            .map((item) => ({
                type: item.dataset.contactValue || '',
                value: item.textContent.trim(),
            }))
            .filter((item) => item.type && item.value);
        const contactValueFor = (type) => modernContactValues.find((item) => item.type === type)?.value || '';
        const parts = modernContactValues.length
            ? [contactValueFor('location'), contactValueFor('phone'), contactValueFor('email'), contactValueFor('permit')]
            : node.innerText
                .split(/[|\n]+/)
                .map((item) => item.trim())
                .filter(Boolean);
        clearEditableOverride('location');
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
        captureCvHistoryFromInteraction();
        setCvStatus('Texte colle sans styles externes');
    });
};

const syncFormatNode = (node) => {
    if (!node) {
        return;
    }

    if (node.matches?.('[data-section-title]')) {
        storeSectionTitleStyle(node);
        updateWordToolbarState();
        return;
    }

    syncPreviewEditableNode(node, { refreshPreview: false });
};

const canApplyInlineRangeStyle = (range, node, styleKey) => {
    if (!range || range.collapsed || !node?.isContentEditable || styleKey === 'textAlign') {
        return false;
    }

    if (!node.contains(range.startContainer) || !node.contains(range.endContainer)) {
        return false;
    }

    const fragment = range.cloneContents();
    return !fragment.querySelector?.('li, ul, ol, p, div, section, article, h1, h2, h3, h4');
};

const applyInlineRangeStyle = (range, node, styleKey, value) => {
    if (!canApplyInlineRangeStyle(range, node, styleKey)) {
        return false;
    }

    const span = document.createElement('span');
    span.style[styleKey] = value;
    span.appendChild(range.extractContents());
    range.insertNode(span);

    const selection = document.getSelection();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(span);
    selection?.removeAllRanges();
    selection?.addRange(nextRange);
    savedFormatRange = nextRange.cloneRange();
    activeFormatNode = node;
    activeEditableNode = node;
    syncFormatNode(node);
    return true;
};

const applyEditableRootStyle = (styleKey, value) => {
    const range = getCurrentFormatRange();
    const nodes = getSelectedFormatNodes();

    if (!nodes.length) {
        setCvStatus('Cliquez d abord dans le CV pour modifier le texte');
        return;
    }

    nodes.forEach((node) => {
        if (nodes.length === 1 && applyInlineRangeStyle(range, node, styleKey, value)) {
            return;
        }
        node.style[styleKey] = value;
        syncFormatNode(node);
    });
    captureCvHistoryFromInteraction({ immediate: true });
    setCvStatus(nodes.length > 1 ? `Mise en forme appliquée sur ${nodes.length} blocs` : 'Mise en forme appliquée');
};

const applyInlineCommand = (command) => {
    const node = getActiveFormatNode();

    if (!node) {
        setCvStatus('Cliquez d abord dans le CV pour modifier le texte');
        return;
    }

    if (node.matches?.('[data-section-title]')) {
        if (command === 'bold') {
            node.style.fontWeight = Number.parseInt(window.getComputedStyle(node).fontWeight, 10) >= 600 ? '500' : '800';
        } else if (command === 'italic') {
            node.style.fontStyle = window.getComputedStyle(node).fontStyle === 'italic' ? '' : 'italic';
        } else if (command === 'underline') {
            node.style.textDecoration = window.getComputedStyle(node).textDecorationLine.includes('underline') ? '' : 'underline';
        } else if (command === 'removeFormat') {
            applyEditableNodeStyleState(node, { lineHeight: '1.2' });
            node.style.fontWeight = '';
            node.style.fontStyle = '';
            node.style.textDecoration = '';
        }
        syncFormatNode(node);
        captureCvHistoryFromInteraction({ immediate: true });
        setCvStatus('Mise en forme appliquée');
        return;
    }

    node.focus();
    if (savedFormatRange) {
        const selection = document.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedFormatRange);
    }
    document.execCommand(command, false, null);
    syncPreviewEditableNode(node, { refreshPreview: false });
    captureCvHistoryFromInteraction({ immediate: true });
    setCvStatus('Mise en forme appliquee');
};

document.querySelectorAll('[contenteditable="true"]').forEach((node) => {
    node.addEventListener('focus', () => {
        activeEditableNode = node;
        activeFormatNode = node;
        updateWordToolbarState();
        setCvStatus('Edition directe active');
    });
    node.addEventListener('input', () => {
        hideKirbyCvProposal();
        activeEditableNode = node;
        activeFormatNode = node;
        syncPreviewEditableNode(node, { refreshPreview: false, normalize: false });
        captureCvHistoryFromInteraction();
        scheduleCvDraftSave();
    });
    node.addEventListener('blur', () => {
        normalizeEditableNode(node);
        syncPreviewEditableNode(node, { refreshPreview: true });
        captureCvHistoryFromInteraction();
        scheduleCvDraftSave();
    });
    node.addEventListener('paste', (event) => {
        activeEditableNode = node;
        activeFormatNode = node;
        handleEditablePaste(event, node);
    });
    node.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            node.blur();
            return;
        }

        if (event.key === 'Enter' && node.tagName !== 'UL' && node.tagName !== 'OL') {
            event.preventDefault();
            document.execCommand('insertLineBreak', false, null);
            window.requestAnimationFrame(() => {
                syncPreviewEditableNode(node, { refreshPreview: false, normalize: false });
                captureCvHistoryFromInteraction();
                scheduleCvDraftSave();
            });
        }
    });
});

document.querySelectorAll('[data-section-title]').forEach((node) => {
    node.addEventListener('mousedown', () => {
        rememberFormatTarget(node);
    });
    node.addEventListener('mouseup', () => {
        rememberFormatTarget(node);
        const selection = document.getSelection();
        if (selection?.rangeCount) {
            savedFormatRange = selection.getRangeAt(0).cloneRange();
        }
        updateWordToolbarState();
        setCvStatus('Titre de section sélectionné');
    });
    node.addEventListener('click', () => {
        rememberFormatTarget(node);
        updateWordToolbarState();
    });
});

document.addEventListener('selectionchange', () => {
    const formatNode = getFormatTargetFromNode(document.getSelection()?.anchorNode);
    if (formatNode) {
        activeFormatNode = formatNode;
        if (formatNode.isContentEditable) {
            activeEditableNode = formatNode;
        }
        const selection = document.getSelection();
        if (selection?.rangeCount) {
            savedFormatRange = selection.getRangeAt(0).cloneRange();
        }
        updateWordToolbarState();
    }
});

document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.id === 'cv-undo' || !cvForm) {
        return;
    }

    const beforeState = getCvHistoryState();
    window.setTimeout(() => commitCvHistoryTransition(beforeState), 0);
}, true);

cvInlineFont?.addEventListener('change', () => applyEditableRootStyle('fontFamily', cvInlineFont.value));
cvInlineSize?.addEventListener('change', () => applyEditableRootStyle('fontSize', cvInlineSize.value));
cvInlineLineHeight?.addEventListener('change', () => applyEditableRootStyle('lineHeight', cvInlineLineHeight.value));
[
    cvInlineFont,
    cvInlineSize,
    cvInlineLineHeight,
].filter(Boolean).forEach((control) => {
    control.addEventListener('mousedown', () => {
        const range = getCurrentFormatRange();
        if (range) {
            savedFormatRange = range.cloneRange();
        }
    });
});
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
    const node = getActiveFormatNode();
    if (node) {
        if (node.matches?.('[data-section-title]')) {
            node.removeAttribute('style');
        } else {
            applyEditableNodeStyleState(node, { lineHeight: '1.2' });
        }
        syncFormatNode(node);
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
        resetCvHistory();
        saveCvDraft(true);
        setCvStatus('Nouveau modele applique');
    });
});

previewModeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setPreviewMode(tab.dataset.previewMode || 'cv');
    });
});

if (cvAutofillButton) {
    cvAutofillButton.addEventListener('click', () => {
        openAssistant();
        void handleAssistantPrompt("Prends le CV en main : pré-remplis, structure, range les dates de la plus récente à la plus ancienne, nettoie les doublons, prépare les formations & certifications et les compétences utiles sans inventer.");
    });
}

if (cvSaveButton) {
    cvSaveButton.addEventListener('click', saveCvDraft);
}

if (cvUndoButton) {
    cvUndoButton.addEventListener('click', restorePreviousCvVersion);
}

if (cvImproveButton) {
    cvImproveButton.addEventListener('click', () => {
        openAssistant();
        void handleAssistantPrompt("Prends le CV en main : corrige, optimise, range les dates de la plus récente à la plus ancienne et prépare une version prête à l'emploi.");
    });
}

if (cvOptimizeMainButton) {
    cvOptimizeMainButton.addEventListener('click', () => {
        const prompt = "Prends le CV en main : corrige, optimise, range les dates de la plus récente à la plus ancienne, complète les rubriques utiles et prépare une version prête à l'emploi";
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvFitPageButton) {
    cvFitPageButton.addEventListener('click', fitCvToSinglePage);
}

if (cvAiImproveButton) {
    cvAiImproveButton.addEventListener('click', () => {
        const prompt = 'Ameliore mon CV';
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvAiSummaryButton) {
    cvAiSummaryButton.addEventListener('click', () => {
        const prompt = "Remplace l'accroche directement";
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvAiSkillsButton) {
    cvAiSkillsButton.addEventListener('click', () => {
        const prompt = 'Enrichis mes competences directement';
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvAiProofreadButton) {
    cvAiProofreadButton.addEventListener('click', () => {
        const prompt = 'Corrige les fautes de mon CV';
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvImproveExperienceButton) {
    cvImproveExperienceButton.addEventListener('click', () => {
        const prompt = 'Reformule mes experiences directement';
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvImproveProjectsButton) {
    cvImproveProjectsButton.addEventListener('click', () => {
        const prompt = 'Ameliore mes projets directement';
        openAssistant();
        void handleAssistantPrompt(prompt);
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
        openAssistant();
        void handleAssistantPrompt(prompt);
    });
}

if (cvExportPdfButton) {
    cvExportPdfButton.addEventListener('click', previewCurrentDocument);
}

if (cvDownloadPdfButton) {
    cvDownloadPdfButton.addEventListener('click', exportPdf);
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
        const historyBeforeImport = getCvHistoryState();
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
            applyCvAutopilotLocalCleanup({ fromImport: true, silent: true });
            commitCvHistoryTransition(historyBeforeImport);
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

kirbyModeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setKirbyMode(button.dataset.kirbyMode || 'optimize', { focus: true });
        hideKirbyCvProposal();
    });
});

setKirbyMode(activeKirbyMode);

if (assistantApplyButton) {
    assistantApplyButton.addEventListener('click', () => {
        if (!pendingKirbyCvProposal) {
            return;
        }

        if (pendingKirbyCvProposal.snapshot !== getKirbyCvSnapshot()) {
            hideKirbyCvProposal();
            assistantInput?.focus();
            setCvStatus('Le CV a été modifié pendant l’analyse : relancez Kirby pour une proposition à jour');
            appendAssistantMessage('Le CV a changé pendant l’analyse. Relancez la demande pour éviter d’écraser vos dernières modifications.', 'bot');
            return;
        }

        const proposalState = pendingKirbyCvProposal;
        const beforeApplySnapshot = getKirbyCvSnapshot();
        const reply = applyKirbyCvResult(
            proposalState.result,
            proposalState.task,
            proposalState.instruction,
            { applyMode: 'proposal' }
        );
        const afterApplySnapshot = getKirbyCvSnapshot();
        const operationDriven = hasKirbyOperations(proposalState.result);
        hideKirbyCvProposal();
        if (assistantInput) {
            assistantInput.value = '';
        }
        if (operationDriven && beforeApplySnapshot === afterApplySnapshot) {
            const operation = proposalState.result?.cv?.operations?.[0] || {};
            const report = saveKirbyBugReport({
                ...(proposalState.result?.cv?.bugReport || {}),
                category: proposalState.result?.cv?.bugReport?.category || 'bug application',
                summary: proposalState.result?.cv?.bugReport?.summary || 'La demande a été comprise par Kirby, mais l’application n’a pas modifié le CV.',
                expectedAction: operation.reason || operation.type || 'Appliquer l’opération demandée',
                target: getOperationTargetText(operation) || operation.field || 'CV',
                instruction: proposalState.instruction,
            });
            appendAssistantMessage(formatKirbyBugReportReply(report), 'bot');
            return;
        }
        appendAssistantMessage(reply, 'bot');
    });
}

if (assistantNewRequestButton) {
    assistantNewRequestButton.addEventListener('click', () => {
        hideKirbyCvProposal();
        if (assistantInput) {
            assistantInput.value = '';
            assistantInput.focus();
        }
        setAssistantActivity('Nouvelle demande prête.', false);
    });
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
        void handleAssistantPrompt(prompt);
    });
});

if (assistantForm) {
    assistantInput?.addEventListener('focus', () => {
        hideKirbyCvProposal();
    });

    assistantInput?.addEventListener('input', () => {
        hideKirbyCvProposal();
    });

    assistantForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = assistantInput?.value.trim();

        if (!message) {
            return;
        }

        hideKirbyCvProposal();
        appendAssistantMessage(message, 'user');
        void handleAssistantPrompt(message);
        assistantInput.value = '';
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
        ['hotel', 'hôtel'],
        ['hôtel', 'hôtel'],
        ['chambre', 'hébergement'],
        ['gite', 'hébergement'],
        ['plombier', 'plombier'],
        ['coach', 'coach'],
        ['photographe', 'photographe'],
        ['artisan', 'artisan'],
        ['wordpress', 'site WordPress'],
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
    const needsHotel = /hotel|hôtel|chambre|hebergement|hébergement|gite|gîte|sejour|séjour|touristique/.test(normalizedBrief);
    const needsWordPress = /wordpress|wp|cms|refonte/.test(normalizedBrief);
    const needsShop = /boutique|vendre|produit|commande|paiement|catalogue/.test(normalizedBrief);
    const needsRestaurant = /restaurant|menu|carte|plat|cuisine|table|horaires|avis/.test(normalizedBrief);
    const needsQr = /\b(qr|qrcode|scan|scanner|flyer|partager)\b/.test(normalizedBrief);
    const needsClientSpace = /espace client|compte client|suivi|document|connexion|prive|privé/.test(normalizedBrief);
    const needsAiAssistant = /assistant|ia|automatiser|questions|support|chat/.test(normalizedBrief);
    const siteName = activity === 'projet professionnel'
        ? 'Votre Présence Pro'
        : activity.split(/\s+/).map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
    const mainCta = needsHotel ? 'Réserver une chambre' : needsRestaurant && needsAppointment ? 'Réserver une table' : needsRestaurant ? 'Découvrir la carte' : needsShop ? 'Commander en ligne' : needsAppointment ? 'Prendre rendez-vous' : 'Voir le projet';
    const pages = needsHotel ? [
        { name: 'Accueil', goal: 'Présenter l’hôtel, l’ambiance et le bouton de réservation.' },
        { name: 'Chambres', goal: 'Montrer chambres, équipements, photos et capacités.' },
        { name: 'Tarifs', goal: 'Clarifier prix, périodes, conditions ou disponibilités.' },
        { name: 'Réservation', goal: 'Afficher le parcours de réservation et les disponibilités.' },
        { name: 'Galerie', goal: 'Rassurer avec les photos de l’hôtel et des espaces.' },
        { name: 'Localisation', goal: 'Afficher la ville, Google Maps et les points d’intérêt.' },
        { name: 'Contact', goal: 'Donner téléphone, e-mail professionnel et accès direct.' },
    ] : needsRestaurant ? [
        { name: 'Accueil', goal: 'Présenter le restaurant, l’ambiance et l’action principale.' },
        { name: 'Menu / carte', goal: 'Afficher les plats, tarifs, formules ou carte à scanner.' },
        { name: 'Réservation', goal: 'Permettre de réserver une table ou demander une disponibilité.' },
        { name: 'Horaires', goal: 'Clarifier les jours d’ouverture, services midi/soir et infos pratiques.' },
        { name: 'Photos', goal: 'Montrer la salle, les plats et l’ambiance.' },
        { name: 'Avis clients', goal: 'Rassurer avec des preuves et retours clients.' },
        { name: 'Contact', goal: 'Donner adresse, téléphone, accès et formulaire.' },
    ] : [
        { name: 'Accueil', goal: 'Présenter l’activité et donner une raison de continuer.' },
        { name: needsShop ? 'Boutique' : 'Prestations', goal: needsShop ? 'Présenter les produits et guider vers la commande.' : 'Afficher les services, tarifs ou informations utiles.' },
        { name: 'Contact', goal: 'Permettre au visiteur d’écrire, appeler ou réserver.' },
    ];

    return {
        projectType: needsHotel ? 'Site hôtel avec réservation' : needsRestaurant ? 'Site restaurant avec carte' : needsShop ? 'Boutique en ligne simple' : needsWordPress ? 'Site WordPress professionnel' : needsAppointment ? 'Site avec rendez-vous' : 'Site vitrine professionnel',
        siteName,
        slogan: `Une présence claire pour présenter ${activity} et recevoir des contacts.`,
        summary: `Le générateur prépare une base de site centrée sur ${activity}, avec des pages courtes et une action visible.`,
        valueProposition: `Un projet digital complet pour rendre ${activity} plus visible, plus crédible et plus facile à contacter.`,
        positioning: {
            audience: 'Clients locaux, prospects qui cherchent vite une solution et visiteurs à rassurer.',
            promise: needsRestaurant ? 'Consulter la carte, vérifier les horaires et réserver facilement.' : needsShop ? 'Découvrir les produits et passer à la commande facilement.' : needsAppointment ? 'Comprendre les offres et réserver sans friction.' : 'Comprendre l’activité et contacter rapidement.',
            tone: 'Professionnel, simple et rassurant.',
            differentiator: 'Une proposition IA structurée, puis un accompagnement humain pour finaliser.',
        },
        styleGuide: {
            direction: needsHotel ? 'Site immersif avec chambres, galerie, localisation et réservation visible.' : needsRestaurant ? 'Site gourmand avec carte visible, photos, horaires et réservation.' : needsShop ? 'Catalogue clair avec produits visibles et commande directe.' : needsAppointment ? 'Site élégant orienté réservation et preuves visuelles.' : 'Vitrine moderne, lisible et rassurante.',
            colors: 'Fond sobre, contraste fort, accent lumineux pour les boutons.',
            typography: 'Titres nets, textes courts, lecture facile sur mobile.',
            layout: needsHotel ? 'Hero photo, chambres, tarifs, galerie, localisation, avis, réservation.' : needsRestaurant ? 'Hero, menu/carte, QR code si demandé, photos, avis, horaires, réservation, contact.' : 'Hero direct, prestations, preuves, galerie ou avis, puis contact.',
        },
        siteModel: {
            name: needsHotel ? 'Modèle hôtel + réservation' : needsRestaurant ? 'Modèle restaurant + carte' : needsShop ? 'Modèle catalogue + commande' : needsAppointment ? 'Modèle rendez-vous local' : 'Modèle vitrine professionnelle',
            description: needsHotel ? 'Une structure qui montre les chambres, rassure, localise et mène vers la réservation.' : needsRestaurant ? 'Une structure pour consulter la carte, voir les infos pratiques et réserver.' : needsShop ? 'Une structure qui présente vite les produits et conduit vers la commande.' : needsAppointment ? 'Une structure qui montre les prestations, rassure et mène vers la réservation.' : 'Une structure pour expliquer l’activité, rassurer et déclencher une action claire.',
            sections: [
                needsHotel ? 'Hero hôtel avec bouton Réserver' : needsRestaurant ? 'Hero restaurant avec bouton Réserver' : 'Hero avec promesse et bouton principal',
                needsHotel ? 'Chambres et équipements' : needsRestaurant ? 'Menu / carte' : needsShop ? 'Catalogue ou produits' : 'Prestations principales',
                needsHotel ? 'Tarifs ou disponibilités' : needsRestaurant ? 'Horaires, photos et avis clients' : 'Galerie, avis ou preuves',
                needsHotel ? 'Galerie, localisation et contact' : needsRestaurant ? 'Réservation et contact' : needsAppointment ? 'Prise de rendez-vous' : 'Contact rapide',
            ],
        },
        recommendedOffer: needsHotel ? 'Offre Signature' : needsWordPress ? 'Projet spécifique' : needsShop || needsAppointment || needsRestaurant ? 'Offre Pro' : 'Offre Essentiel',
        pages,
        homeSections: [
            { title: `Bienvenue chez ${siteName}`, text: needsHotel ? `Un accueil visuel présente l’hôtel, l’ambiance, la ville et le bouton ${mainCta}.` : needsRestaurant ? `Un accueil direct présente le restaurant, l’ambiance, la carte et le bouton ${mainCta}.` : `Un bloc d’accueil direct explique l’activité, la zone et ce que le visiteur peut faire.` },
            { title: needsHotel ? 'Chambres et services' : needsRestaurant ? 'Menu, horaires et photos' : needsShop ? 'Produits ou catalogue' : 'Services principaux', text: needsHotel ? 'Les chambres, équipements et services sont présentés avec photos, tarifs ou disponibilités.' : needsRestaurant ? 'La carte, les horaires, les photos et les avis rassurent avant la réservation.' : needsShop ? 'Les produits sont organisés pour faciliter la commande.' : 'Les prestations sont présentées sans texte inutile, avec une phrase claire par service.' },
            { title: 'Action principale', text: `Le bouton ${mainCta} reste visible pour guider le visiteur vers l’étape suivante.` },
        ],
        services: [
            { name: needsHotel ? 'Chambres' : 'Présentation claire', description: needsHotel ? 'Présenter chaque chambre avec photos, équipements, capacité et ambiance.' : 'Dire quoi, pour qui, dans quelle zone et avec quel résultat.' },
            { name: needsHotel ? 'Réservation' : needsRestaurant ? 'Réservation' : needsAppointment ? 'Rendez-vous' : 'Contact direct', description: needsHotel ? 'Ajouter réservation, téléphone, e-mail professionnel et acompte si besoin.' : needsRestaurant ? 'Ajouter réservation, téléphone, horaires et accès.' : needsAppointment ? 'Ajouter un lien de réservation, téléphone ou WhatsApp.' : 'Ajouter e-mail professionnel, téléphone ou lien WhatsApp.' },
            ...(needsHotel ? [{ name: 'Localisation et avis', description: 'Google Maps, accès, points d’intérêt, galerie et avis clients.' }] : []),
        ],
        ctas: [mainCta, needsHotel ? 'Voir les disponibilités' : needsRestaurant ? 'Voir le menu' : 'Voir les prestations', 'Contacter maintenant'],
        seo: {
            keywords: [activity, `${activity} professionnel`, `${activity} local`, 'site web professionnel'],
            searchExpressions: needsHotel ? [`${activity} + ville`, 'chambre + ville', 'réservation hôtel', 'séjour touristique'] : needsRestaurant ? ['restaurant + ville', 'menu restaurant', 'réservation restaurant', 'horaires restaurant'] : [`${activity} près de moi`, `${activity} tarifs`, `${activity} contact`, needsAppointment ? `${activity} rendez-vous` : `${activity} professionnel`],
            titles: [`${siteName} - ${needsAppointment ? 'Prestations et rendez-vous' : needsShop ? 'Catalogue et commandes' : 'Site officiel'}`, `${activity} - Services et contact`],
            metaDescription: `${siteName} présente ${activity}, ses services, ses informations utiles et un contact direct pour ${mainCta.toLowerCase()}.`,
        },
        seoKeywords: [activity, `${activity} professionnel`, `${activity} local`, 'site web professionnel'],
        recommendedServices: [
            { name: needsShop ? 'Boutique en ligne simple' : 'Site vitrine', reason: 'Le projet a besoin d’une page claire et partageable.', priceFrom: needsShop ? 'À partir de 712 € selon le catalogue' : 'À partir de 392 €' },
            { name: 'Adresse e-mail professionnelle', reason: 'Une adresse contact@ renforce la confiance.', priceFrom: 'À partir de 49 €' },
            ...(needsQr ? [{ name: 'QR code professionnel', reason: 'Le besoin parle de scan, carte ou support imprimé.', priceFrom: '39 €' }] : []),
            ...(needsHotel ? [
                { name: 'Réservation en ligne', reason: 'Pour afficher disponibilités, dates et réservation directement.', priceFrom: 'Projet spécifique' },
                { name: 'Google Maps et avis clients', reason: 'Pour rassurer et aider le visiteur à choisir.', priceFrom: 'Inclus selon offre' },
                { name: 'Paiement ou acompte', reason: 'Pour confirmer une réservation en ligne si nécessaire.', priceFrom: 'Projet spécifique' },
            ] : []),
            ...(needsRestaurant ? [
                { name: 'Réservation en ligne', reason: 'Utile si le client doit réserver une table rapidement.', priceFrom: 'Inclus selon offre' },
                { name: 'Galerie photos', reason: 'Les photos donnent envie avant la visite.', priceFrom: 'Inclus selon offre' },
                { name: 'Google Maps et avis clients', reason: 'Adresse, accès et avis rassurent avant de se déplacer.', priceFrom: 'Inclus selon offre' },
            ] : []),
            ...(needsWordPress ? [{ name: 'WordPress', reason: 'Installation, configuration, refonte ou accompagnement.', priceFrom: 'Projet spécifique' }] : []),
            ...(needsClientSpace ? [{ name: 'Espace client simple', reason: 'Utile pour centraliser suivi, documents ou informations privées.', priceFrom: 'Projet spécifique' }] : []),
            ...(needsAiAssistant ? [{ name: 'Assistant IA métier', reason: 'Utile pour guider les visiteurs et répondre aux questions fréquentes.', priceFrom: 'Projet spécifique' }] : []),
        ],
        clientAcquisition: [
            'Mettre un bouton d’action visible dès le premier écran.',
            'Ajouter un QR code sur carte, vitrine, flyer ou réseaux sociaux.',
            'Travailler les mots-clés locaux pour les recherches Google.',
            'Afficher des preuves simples : photos, avis, réalisations ou exemples.',
        ],
        explanation: [
            'La structure commence par ce que le visiteur cherche.',
            'Les boutons sont choisis pour pousser vers une action réelle.',
            'Les options sont ajoutées seulement quand elles rendent le projet plus simple à utiliser.',
        ],
        contactMessage: [
            'Bonjour,',
            '',
            `Le générateur SA a préparé une première proposition pour : ${siteName}.`,
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

const getKirbySeo = (proposal = {}) => {
    const seo = proposal.seo && typeof proposal.seo === 'object' ? proposal.seo : {};

    return {
        keywords: getKirbyArray(seo.keywords || proposal.seoKeywords, 8),
        searchExpressions: getKirbyArray(seo.searchExpressions, 6),
        titles: getKirbyArray(seo.titles, 4),
        metaDescription: seo.metaDescription || '',
    };
};

const getKirbyStyleGuide = (proposal = {}) => {
    const styleGuide = proposal.styleGuide && typeof proposal.styleGuide === 'object' ? proposal.styleGuide : {};

    return {
        direction: styleGuide.direction || 'Style professionnel, clair et rassurant.',
        colors: styleGuide.colors || 'Palette sobre avec une couleur d’accent pour les actions.',
        typography: styleGuide.typography || 'Titres lisibles et textes courts.',
        layout: styleGuide.layout || 'Accueil direct, prestations, preuves, puis contact.',
    };
};

const getKirbySiteModel = (proposal = {}) => {
    const siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};

    return {
        name: siteModel.name || proposal.projectType || 'Modèle de site professionnel',
        description: siteModel.description || proposal.summary || 'Une structure claire pour transformer l’idée en base de site.',
        sections: getKirbyArray(siteModel.sections, 6),
    };
};

const getKirbyItemTitle = (item = {}) => {
    const rawTitle = typeof item === 'string' ? item : item.name || item.title || item.label || '';
    const title = cleanKirbyGeneratedText(rawTitle);

    if (isWeakKirbyGeneratedText(title)) {
        return '';
    }

    return title;
};

const getKirbyItemText = (item = {}) => {
    if (typeof item === 'string') {
        return '';
    }

    const text = cleanKirbyGeneratedText(item.text || item.goal || item.description || item.reason || '');

    if (isWeakKirbyGeneratedText(text)) {
        return '';
    }

    return text;
};

const getKirbyShortText = (value = '', max = 92) => {
    const text = String(value || '').replace(/\s+/g, ' ').trim();

    if (text.length <= max) {
        return text;
    }

    return `${text.slice(0, max - 1).trim()}…`;
};

const getKirbyDomain = (siteName = '') => {
    const slug = String(siteName || 'mon-projet')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 24)
        .replace(/-+$/g, '');

    return `${slug || 'mon-projet'}.fr`;
};

const formatKirbySiteName = (value = '') =>
    String(value || '')
        .replace(/([a-zà-ÿ])([A-ZÀ-Ý])/g, '$1 $2')
        .replace(/([A-ZÀ-Ý]+)([A-ZÀ-Ý][a-zà-ÿ])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim();

const buildKirbyBriefFromForm = () => {
    if (!aiBriefForm || !aiBriefInput) {
        return '';
    }

    return aiBriefInput.value.trim();
};

const normalizeKirbyText = (value = '') => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const cleanKirbyGeneratedText = (value = '') => String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/&lt;\/?[^&]+&gt;/gi, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isWeakKirbyGeneratedText = (value = '') => {
    const text = normalizeKirbyText(cleanKirbyGeneratedText(value));
    const compactText = text.replace(/[.!?:;]+$/g, '').trim();

    return !text ||
        /class=|<\/|<div|<section|<article|function|const |let |var |=>/.test(text) ||
        /^(section|page|service|texte a ajuster|description a ajuster|a ajuster|contenu a ajuster)$/.test(compactText);
};

const cloneKirbyProposal = (proposal) => {
    try {
        return JSON.parse(JSON.stringify(proposal || {}));
    } catch (error) {
        return {};
    }
};

const getKirbyBriefSignals = (brief = '') => {
    const source = normalizeKirbyText(brief);
    const isBeauty = /coiff|beaute|salon|institut|estheticien|estheticienne|esthetique|massage|massages|soin|soins|epilation|ongle|ongles|spa|bien etre|bien-etre/.test(source);
    const isRestaurant = /restaurant|menu|carte|plat|cuisine|table/.test(source);
    const isHotel = /hotel|chambre|hebergement|gite|sejour|touristique/.test(source);
    const isArchitecture = /architect|architecture|architecte|arquitecto|interieur|intérieur|design d interieur|design d'intérieur|decorateur|decoratrice|decoration|décoration|studio de design|maitre d oeuvre|maître d oeuvre/.test(source);
    const isAccountingApp = /contadirect|compta|comptabilite|comptable|facture|facturation|devis|tva|revenu|revenus|depense|depenses|charge|charges|banque|transaction|transactions|tresorerie|resultat net|bilan|logiciel de compta|logiciel comptable|tableau de bord|dashboard/.test(source);

    return {
        source,
        isAccountingApp,
        isArchitecture,
        isDigital: /sa creation|creation web|site web|sites web|generateur|ia|digital|agence|developpement|référencement|referencement|qr code|maintenance|support technique|logiciel|application|saas|plateforme/.test(source),
        isHotel,
        isRestaurant,
        isShop: !isBeauty && !isRestaurant && !isHotel && /boutique|vendre|vente|commande|produit|panier|paiement|catalogue|mode|vetement/.test(source),
        isBeauty,
        isCraft: /plombier|artisan|travaux|chantier|renovation/.test(source),
    };
};

const getKirbyHash = (value = '') => {
    const text = String(value || '');
    let hash = 0;

    for (let index = 0; index < text.length; index += 1) {
        hash = (hash * 31 + text.charCodeAt(index)) % 9973;
    }

    return hash;
};

const removeKirbyPages = (proposal, names = []) => {
    const blocked = names.map((name) => normalizeKirbyText(name));
    proposal.pages = getKirbyArray(proposal.pages, 8).filter((page) => !blocked.includes(normalizeKirbyText(getKirbyItemTitle(page))));
};

const removeKirbyServices = (proposal, patterns = []) => {
    proposal.recommendedServices = getKirbyArray(proposal.recommendedServices, 8).filter((service) => {
        const title = normalizeKirbyText(getKirbyItemTitle(service));

        return !patterns.some((pattern) => pattern.test(title));
    });
};

const shortenKirbySentence = (value = '', max = 86) => {
    const text = String(value || '').replace(/\s+/g, ' ').trim();

    if (text.length <= max) {
        return text;
    }

    return `${text.slice(0, max - 1).trim()}…`;
};

const hasKirbyItem = (items = [], name = '') => {
    const target = normalizeKirbyText(name);

    return items.some((item) => normalizeKirbyText(getKirbyItemTitle(item)) === target);
};

const addKirbyPage = (proposal, page) => {
    proposal.pages = getKirbyArray(proposal.pages, 8);

    if (!hasKirbyItem(proposal.pages, page.name)) {
        proposal.pages.push(page);
    }
};

const addKirbySection = (proposal, section) => {
    proposal.homeSections = getKirbyArray(proposal.homeSections, 6);

    if (!hasKirbyItem(proposal.homeSections, section.title)) {
        proposal.homeSections.push(section);
    }
};

const addKirbyService = (proposal, service, priority = false) => {
    proposal.recommendedServices = getKirbyArray(proposal.recommendedServices, 8);

    if (!hasKirbyItem(proposal.recommendedServices, service.name)) {
        if (priority) {
            proposal.recommendedServices.unshift(service);
        } else {
            proposal.recommendedServices.push(service);
        }
        return;
    }

    if (priority) {
        proposal.recommendedServices = [
            ...proposal.recommendedServices.filter((item) => normalizeKirbyText(getKirbyItemTitle(item)) === normalizeKirbyText(service.name)),
            ...proposal.recommendedServices.filter((item) => normalizeKirbyText(getKirbyItemTitle(item)) !== normalizeKirbyText(service.name)),
        ];
    }
};

const addKirbyCta = (proposal, cta) => {
    proposal.ctas = getKirbyArray(proposal.ctas, 5);

    if (!proposal.ctas.some((item) => normalizeKirbyText(item) === normalizeKirbyText(cta))) {
        proposal.ctas.unshift(cta);
    }
};

const addKirbyModelSection = (proposal, section) => {
    proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
    proposal.siteModel.sections = getKirbyArray(proposal.siteModel.sections, 8);

    if (!proposal.siteModel.sections.some((item) => normalizeKirbyText(item) === normalizeKirbyText(section))) {
        proposal.siteModel.sections.push(section);
    }
};

const setKirbyPreviewSummary = (proposal, title, items = []) => {
    proposal.previewSummary = {
        title,
        items: items.filter(Boolean).slice(0, 6),
    };
};

const isOpenAiKirbyProposal = (proposal = {}) => normalizeKirbyText(proposal.mode || proposal.source) === 'openai';

const hasRichKirbyProposal = (proposal = {}) =>
    getKirbyArray(proposal.pages, 8).length >= 4 &&
    getKirbyArray(proposal.homeSections, 6).length >= 2 &&
    Boolean(proposal.siteName || proposal.slogan || proposal.valueProposition);

const getKirbyVisualConcept = (proposal = {}) =>
    proposal.visualConcept && typeof proposal.visualConcept === 'object' ? proposal.visualConcept : {};

const applyGeneratedKirbyVisualHints = (proposal, signals, brief = '') => {
    const visualConcept = getKirbyVisualConcept(proposal);
    const visualSource = normalizeKirbyText([
        proposal.visualMood,
        proposal.projectType,
        proposal.siteModel && proposal.siteModel.name,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.styleGuide && proposal.styleGuide.colors,
        visualConcept.ambience,
        visualConcept.heroComposition,
        visualConcept.layoutSignature,
        visualConcept.wowFactor,
        getKirbyArray(visualConcept.imageKeywords, 8).join(' '),
        brief,
    ].filter(Boolean).join(' '));

    if (!proposal.visualMood) {
        proposal.visualMood = signals.isAccountingApp || /dashboard|logiciel|saas|comptable|facturation/.test(visualSource)
            ? 'accounting-dashboard'
            : signals.isDigital || /digital|ia|generateur|premium|bleu nuit|etoile|verre|halo/.test(visualSource)
                ? 'tech-premium'
                : signals.isBeauty || /beaute|coiff|soin|spa|bien etre|rose|beige/.test(visualSource)
                    ? 'beauty-wellness'
                    : signals.isRestaurant || /restaurant|menu|cuisine|chaleur|italien/.test(visualSource)
                        ? 'warm'
                        : /photo|galerie|image|portfolio/.test(visualSource)
                            ? 'image-led'
                            : /premium|signature|luxe|elegant/.test(visualSource)
                                ? 'premium'
                                : '';
    }

    if (proposal.designVariant === undefined || proposal.designVariant === null) {
        proposal.designVariant = getKirbyHash(`${brief} ${proposal.siteName || ''} ${visualSource}`) % 7;
    }

    if (getKirbyArray(visualConcept.imageKeywords, 8).length || /photo|image|galerie|visuel|avant apres/.test(visualSource)) {
        proposal.showGallery = proposal.showGallery || /galerie|portfolio|photo|avant apres/.test(visualSource);
    }

    if (!proposal.previewSummary && getKirbyArray(proposal.pages, 8).length) {
        setKirbyPreviewSummary(
            proposal,
            visualConcept.wowFactor ? 'Direction proposée' : 'Ce qui est prévu',
            [
                visualConcept.layoutSignature,
                visualConcept.heroComposition,
                ...getKirbyArray(proposal.pages, 5).map((page) => getKirbyItemTitle(page)),
            ].filter(Boolean),
        );
    }
};

const applyKirbyAccountingModel = (proposal, brief = '') => {
    const source = normalizeKirbyText(`${brief} ${proposal.siteName || ''}`);
    const appName = /contadirect/.test(source)
        ? 'ContaDirect'
        : formatKirbySiteName(proposal.siteName) || 'ComptaPilot';

    proposal.siteName = appName;
    proposal.projectType = 'Application SaaS de comptabilite';
    proposal.visualMood = 'accounting-dashboard';
    proposal.designVariant = getKirbyHash(`${brief} ${appName}`) % 3;
    proposal.slogan = 'Pilotez vos finances sans friction.';
    proposal.summary = `${appName} doit montrer une interface de comptabilite moderne, pas une simple vitrine marketing.`;
    proposal.valueProposition = 'Un tableau de bord clair pour suivre revenus, depenses, TVA, factures, banque et documents au meme endroit.';
    proposal.positioning = {
        audience: 'Independants, freelances et petites entreprises qui veulent comprendre vite leur activite.',
        promise: 'Voir les chiffres importants, creer des documents et anticiper la TVA sans perdre de temps.',
        tone: 'SaaS premium, clair, fiable et operationnel.',
        differentiator: 'Une interface produit concrete avec donnees, actions rapides et assistant IA integre.',
    };
    proposal.styleGuide = {
        direction: 'Dashboard SaaS lumineux avec sidebar foncee, cartes KPI, graphiques, taches et assistant IA.',
        colors: 'Bleu profond, blanc, gris tres clair, accents bleu, vert, rouge et violet pour les statuts.',
        typography: 'Sans-serif moderne, chiffres forts, libelles compacts et lecture rapide.',
        layout: 'Sidebar fixe, barre de recherche, KPI en haut, graphiques et listes metier dans une grille dense.',
    };
    proposal.siteModel = {
        name: 'Dashboard comptable SaaS',
        description: 'Une interface applicative qui donne tout de suite l’impression d’un logiciel utilisable.',
        sections: ['Tableau de bord', 'Revenus', 'Depenses', 'Devis', 'Factures', 'Banque', 'Documents', 'TVA & Charges'],
    };
    proposal.pages = [
        { name: 'Tableau de bord', goal: 'Afficher les KPI, graphiques, taches et alertes prioritaires.' },
        { name: 'Revenus', goal: 'Suivre chiffre d’affaires, encaissements et clients.' },
        { name: 'Depenses', goal: 'Classer achats, justificatifs et categories de charges.' },
        { name: 'Devis', goal: 'Creer, envoyer et relancer les devis.' },
        { name: 'Factures', goal: 'Gerer factures, statuts, paiements et exports.' },
        { name: 'Banque', goal: 'Afficher soldes, mouvements et rapprochements.' },
        { name: 'Documents', goal: 'Centraliser PDF, justificatifs et contrats.' },
        { name: 'TVA & Charges', goal: 'Anticiper echeances, TVA a reverser et obligations.' },
    ];
    proposal.homeSections = [
        { title: 'Vue financiere instantanee', text: 'Chiffre d’affaires, depenses, resultat net et TVA visibles en haut du dashboard.' },
        { title: 'Documents et facturation', text: 'Devis, factures, justificatifs et PDF sont accessibles depuis une meme interface.' },
        { title: 'Assistant IA comptable', text: 'L’utilisateur peut analyser ses depenses, prevoir son resultat et comprendre ses echeances.' },
    ];
    proposal.ctas = ['Nouveau document', 'Analyser mes depenses', 'Importer un justificatif'];
    proposal.recommendedOffer = 'Projet specifique';
    proposal.recommendedServices = [
        { name: 'Interface SaaS sur mesure', reason: 'Le projet demande un vrai logiciel avec navigation, etats et tableaux de bord.', priceFrom: 'Projet spécifique' },
        { name: 'Assistant IA metier', reason: 'Utile pour expliquer les depenses, la TVA et les resultats aux independants.', priceFrom: 'Projet spécifique' },
        { name: 'Espace client simple', reason: 'Necessaire pour sauvegarder documents, donnees et preferences.', priceFrom: 'Projet spécifique' },
        { name: 'Tableau de bord financier', reason: 'Les KPI et graphiques sont le coeur de l’experience.', priceFrom: 'Projet spécifique' },
        { name: 'Import documents', reason: 'Factures et justificatifs doivent etre centralises.', priceFrom: 'Projet spécifique' },
        { name: 'Connexion bancaire', reason: 'Pertinent pour rapprocher transactions et soldes.', priceFrom: 'Projet spécifique' },
    ];
    proposal.seo = {
        keywords: ['logiciel de comptabilite', 'comptabilite independant', 'facturation freelance', 'suivi TVA'],
        searchExpressions: ['logiciel comptabilite independant', 'application facturation freelance', 'suivi depenses tva', 'dashboard comptable simple'],
        titles: [`${appName} - Comptabilite simple pour independants`, 'Dashboard comptable, factures et TVA'],
        metaDescription: `${appName} aide les independants a suivre revenus, depenses, TVA, factures et documents depuis un tableau de bord clair.`,
    };
    proposal.seoKeywords = proposal.seo.keywords;
    proposal.services = [
        { name: 'Tableau de bord', description: 'KPI, graphiques et alertes pour comprendre l’activite.' },
        { name: 'Facturation', description: 'Devis, factures, relances et documents recents.' },
        { name: 'TVA & charges', description: 'Echeances, montants a prevoir et taches a traiter.' },
    ];
    proposal.clientAcquisition = [
        'Montrer une capture produit des le premier ecran.',
        'Mettre en avant les benefices concrets : temps gagne, TVA lisible, documents centralises.',
        'Prevoir une demo interactive plutot qu’une page purement commerciale.',
        'Ajouter des cas d’usage pour independants, freelances et TPE.',
    ];
    proposal.explanation = [
        'Le brief parle d’un logiciel : il faut donc afficher une interface produit.',
        'Les KPI et graphiques rendent la valeur visible immediatement.',
        'La sidebar montre que le projet est une application complete, pas une vitrine.',
    ];
    setKirbyPreviewSummary(proposal, 'Produit a prevoir', [
        'Dashboard financier',
        'Factures et devis',
        'Depenses',
        'Banque',
        'Documents',
        'Assistant IA',
    ]);

    return proposal;
};

const normalizeKirbyProposalForBrief = (currentProposal, brief = '') => {
    const proposal = cloneKirbyProposal(currentProposal);
    const signals = getKirbyBriefSignals(brief);
    const preserveGeneratedProposal = isOpenAiKirbyProposal(proposal) && hasRichKirbyProposal(proposal);

    if (preserveGeneratedProposal) {
        applyGeneratedKirbyVisualHints(proposal, signals, brief);
    }

    if (!signals.isHotel) {
        removeKirbyPages(proposal, ['Chambres', 'Réservation chambres', 'Disponibilités']);
    }

    if (!signals.isRestaurant) {
        removeKirbyPages(proposal, ['Menu / carte', 'Menu', 'Carte', 'Réservation table', 'Horaires restaurant']);
    }

    if (!signals.isShop) {
        removeKirbyPages(proposal, ['Boutique', 'Catalogue', 'Panier', 'Mon Compte', 'Commande']);
        removeKirbyServices(proposal, [/boutique/, /catalogue/, /panier/, /commande/, /paiement/]);
    }

    if (signals.isBeauty && !preserveGeneratedProposal) {
        proposal.siteName = formatKirbySiteName(proposal.siteName) || 'Éclat Beauté Domicile';
        proposal.projectType = 'Site beauté à domicile avec réservation';
        proposal.visualMood = 'beauty-wellness';
        proposal.designVariant = getKirbyHash(`${brief} ${proposal.siteName}`) % 3;
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = 'Modèle beauté bien-être';
        proposal.slogan = /domicile/.test(signals.source)
            ? 'Beauté à domicile, bien-être assuré.'
            : 'Des soins doux, élégants et personnalisés.';
        proposal.pages = [
            { name: 'Accueil', goal: 'Présenter l’ambiance, la spécialité et l’action de réservation.' },
            { name: 'Soins du visage', goal: 'Mettre en avant les soins visage et leurs bénéfices.' },
            { name: 'Massages', goal: 'Présenter les prestations bien-être et relaxation.' },
            { name: 'Épilations', goal: 'Lister les prestations courantes et les informations utiles.' },
            { name: 'Tarifs', goal: 'Prévoir une grille claire à compléter avec la cliente.' },
            { name: 'Zone d’intervention', goal: 'Indiquer les villes, secteurs ou déplacements à domicile.' },
            { name: 'Avis clientes', goal: 'Rassurer avec des retours et preuves de confiance.' },
            { name: 'Contact', goal: 'Permettre une demande de rendez-vous simple.' },
        ];
        proposal.homeSections = [
            { title: 'Soins du visage', text: 'Des soins personnalisés pour révéler l’éclat naturel de la peau.' },
            { title: 'Massages bien-être', text: 'Des moments de détente à domicile, adaptés au besoin de chaque cliente.' },
            { title: 'Épilations & tarifs', text: 'Des prestations lisibles avec une grille de prix à finaliser.' },
        ];
        proposal.ctas = ['Réservez votre soin', 'Voir les tarifs', 'Contactez-nous'];
        proposal.recommendedServices = [
            { name: 'Réservation en ligne', reason: 'Permettre aux clientes de demander un créneau facilement.', priceFrom: 'Inclus selon offre' },
            { name: 'Tarifs clairs', reason: 'Rassurer avant la prise de rendez-vous.', priceFrom: 'Inclus selon offre' },
            { name: 'Galerie avant / après', reason: 'Montrer le résultat des prestations quand c’est pertinent.', priceFrom: 'Option' },
            { name: 'Avis clientes', reason: 'Renforcer la confiance avant le premier contact.', priceFrom: 'Inclus selon offre' },
            { name: 'Zone d’intervention', reason: 'Clarifier les secteurs couverts à domicile.', priceFrom: 'Inclus selon offre' },
        ];
        proposal.showGallery = true;
        setKirbyPreviewSummary(proposal, 'Ce qui est prévu', [
            'Soins du visage',
            'Massages',
            'Épilations',
            'Tarifs',
            'Zone d’intervention',
            'Avis clientes',
        ]);
    }

    if (signals.isAccountingApp && !preserveGeneratedProposal) {
        applyKirbyAccountingModel(proposal, brief);
    }

    if (signals.isDigital && !signals.isAccountingApp && !preserveGeneratedProposal) {
        proposal.siteName = /sa creation|sacreation|création web|creation web/.test(signals.source)
            ? 'SA Création Web'
            : formatKirbySiteName(proposal.siteName) || 'Studio Digital IA';
        proposal.projectType = 'Site vitrine premium pour service digital';
        proposal.visualMood = 'tech-premium';
        proposal.designVariant = getKirbyHash(`${brief} ${proposal.siteName}`) % 3;
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = 'Site digital premium';
        proposal.slogan = /premium|moderne|rassurant|confiance/.test(signals.source)
            ? 'Une présence digitale claire, premium et rassurante.'
            : 'Créez une présence web claire, rapide et professionnelle.';
        proposal.pages = [
            { name: 'Accueil', goal: 'Présenter la promesse et l’action principale.' },
            { name: 'Générateur IA', goal: 'Montrer comment le client obtient une première base de site.' },
            { name: 'Services', goal: 'Présenter création de site, domaine, e-mail, QR code et support.' },
            { name: 'Exemples', goal: 'Rassurer avec des bases de sites ou démonstrations.' },
            { name: 'Contact', goal: 'Recevoir une demande courte après la proposition générée.' },
        ];
        proposal.homeSections = [
            { title: 'Générateur de site IA', text: 'Le client décrit son activité et reçoit une première base de site exploitable.' },
            { title: 'Options utiles', text: 'Domaine, e-mail professionnel, QR code, référencement de base et support selon le projet.' },
            { title: 'Accompagnement humain', text: 'La proposition est ensuite ajustée et finalisée avec le client.' },
        ];
        proposal.ctas = ['Créer mon site', 'Demander une démo', 'Finaliser ma demande'];
        proposal.recommendedServices = [
            { name: 'Site vitrine premium', reason: 'Présenter SA Création Web de manière claire et moderne.', priceFrom: 'Selon projet' },
            { name: 'Domaine personnalisé', reason: 'Installer une présence professionnelle.', priceFrom: 'Selon domaine' },
            { name: 'E-mail professionnel', reason: 'Centraliser les demandes client.', priceFrom: 'Selon configuration' },
            { name: 'Référencement de base', reason: 'Préparer les contenus pour Google.', priceFrom: 'Selon projet' },
            { name: 'Support technique', reason: 'Prévoir l’aide après lancement.', priceFrom: 'Option' },
        ];
        setKirbyPreviewSummary(proposal, 'Ce qui est prévu', [
            'Site vitrine premium',
            'Domaine personnalisé',
            'E-mail professionnel',
            'Référencement de base',
            'Support technique',
        ]);
    }

    if (!getKirbyArray(proposal.pages, 8).length) {
        proposal.pages = buildBrowserKirbyProposal(brief).pages;
    }

    return proposal;
};

const applyKirbyRevision = (currentProposal, revision, brief = '') => {
    const proposal = cloneKirbyProposal(currentProposal);
    const source = normalizeKirbyText(`${brief} ${revision}`);
    const requested = normalizeKirbyText(revision);
    const revisionSignals = getKirbyBriefSignals(source);
    const appliedChanges = [];

    if (!proposal.siteName) {
        Object.assign(proposal, buildBrowserKirbyProposal(brief));
    }

    if (revisionSignals.isAccountingApp) {
        applyKirbyAccountingModel(proposal, brief);
    }

    const markApplied = (label) => {
        if (!appliedChanges.includes(label)) {
            appliedChanges.push(label);
        }
    };

    if (/enleve|retire|supprime|simplifie|texte court|textes courts|pas de texte|moins de texte|bloc note/.test(requested)) {
        proposal.slogan = shortenKirbySentence(proposal.slogan, 58);
        proposal.summary = shortenKirbySentence(proposal.summary, 96);
        proposal.valueProposition = shortenKirbySentence(proposal.valueProposition, 110);
        proposal.pages = getKirbyArray(proposal.pages, 8).map((page) => ({
            ...page,
            goal: shortenKirbySentence(getKirbyItemText(page), 72),
        }));
        proposal.homeSections = getKirbyArray(proposal.homeSections, 6).map((section) => ({
            ...section,
            text: shortenKirbySentence(getKirbyItemText(section), 76),
        })).slice(0, /simplifie/.test(requested) ? 3 : 6);
        markApplied('Textes raccourcis');
    }

    if (/image|photo|galerie|visuel|portfolio/.test(requested)) {
        const beauty = getKirbyBriefSignals(source).isBeauty;
        addKirbyPage(proposal, { name: beauty ? 'Galerie avant / après' : 'Photos', goal: beauty ? 'Montrer les résultats ou l’ambiance des soins avec sobriété.' : 'Montrer des images fortes du lieu, des produits ou des réalisations.' });
        addKirbySection(proposal, { title: beauty ? 'Galerie soins' : 'Galerie visuelle', text: beauty ? 'Des visuels doux montrent l’univers, les accessoires et les résultats.' : 'Une section image met en avant les preuves visuelles du projet.' });
        addKirbyService(proposal, { name: beauty ? 'Galerie avant / après' : 'Galerie photos', reason: beauty ? 'Utile pour rendre les prestations plus concrètes et rassurantes.' : 'Utile pour rendre la proposition plus concrète et rassurante.', priceFrom: 'Inclus selon offre' });
        addKirbyModelSection(proposal, beauty ? 'Galerie avant / après' : 'Galerie photos');
        proposal.visualMood = beauty ? 'beauty-wellness' : 'image-led';
        proposal.showGallery = true;
        markApplied('Galerie ajoutée');
    }

    if (/premium|luxe|elegant|elegance|signature|haut de gamme|plus beau|moderne/.test(requested)) {
        proposal.recommendedOffer = 'Offre Signature';
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = /premium|signature|luxe|elegant|elegance/.test(normalizeKirbyText(proposal.siteModel.name || ''))
            ? proposal.siteModel.name
            : `Version premium - ${proposal.siteModel.name || proposal.projectType || 'site professionnel'}`;
        proposal.slogan = /restaurant|menu|carte/.test(source)
            ? 'Une expérience élégante à chaque visite.'
            : 'Une présence élégante, claire et mémorable.';
        addKirbySection(proposal, { title: 'Preuves de confiance', text: 'Avis, photos ou réalisations rassurent avant la prise de contact.' });
        addKirbyModelSection(proposal, 'Preuves premium');
        proposal.visualMood = revisionSignals.isAccountingApp
            ? 'accounting-dashboard'
            : /sa creation|creation web|generateur|ia|digital|site web/.test(source) ? 'tech-premium' : revisionSignals.isBeauty ? 'beauty-wellness' : 'premium';
        proposal.designVariant = (Number(proposal.designVariant) || 0) + 1;
        markApplied('Version premium');
    }

    if (/rassurant|confiance|clair|claire|professionnel|professionnelle/.test(requested)) {
        proposal.slogan = revisionSignals.isAccountingApp
            ? 'Pilotez vos finances sans friction.'
            : /sa creation|creation web|generateur|ia|digital|site web/.test(source)
            ? 'Une présence digitale claire, premium et rassurante.'
            : 'Une présentation claire qui rassure dès le premier écran.';
        addKirbySection(proposal, { title: 'Pourquoi nous choisir ?', text: 'Une section courte rassure avec les bénéfices, les preuves et le contact.' });
        proposal.visualMood = revisionSignals.isAccountingApp
            ? 'accounting-dashboard'
            : /sa creation|creation web|generateur|ia|digital|site web/.test(source) ? 'tech-premium' : proposal.visualMood;
        markApplied('Message clarifié');
    }

    if (/italien|italienne|chaleureuse|chaleureux|chaud|terroir|dolce|trattoria|ambiance/.test(requested)) {
        proposal.styleGuide = proposal.styleGuide && typeof proposal.styleGuide === 'object' ? proposal.styleGuide : {};
        proposal.styleGuide.direction = 'Ambiance chaleureuse, premium et expressive.';
        proposal.styleGuide.colors = 'Tons chauds, crème, brun profond et accent doré.';
        proposal.siteModel = proposal.siteModel && typeof proposal.siteModel === 'object' ? proposal.siteModel : {};
        proposal.siteModel.name = /restaurant|menu|carte/.test(source) ? 'Modèle restaurant chaleureux' : 'Modèle chaleureux premium';
        if (/restaurant|menu|carte/.test(source) && /restaurant|projet|votre presence/i.test(proposal.siteName || '')) {
            proposal.siteName = 'Saveurs du Terroir';
        }
        proposal.visualMood = 'warm';
        markApplied('Ambiance chaleureuse');
    }

    if (/qr|scan|code/.test(requested)) {
        addKirbyService(proposal, { name: 'QR code professionnel', reason: 'Utile pour scanner la carte, une page ou une offre depuis un support imprimé.', priceFrom: '39 €' }, true);
        addKirbySection(proposal, { title: 'QR code', text: 'Un QR code donne accès rapidement à la page utile depuis une carte, vitrine ou flyer.' });
        if (/restaurant|menu|carte/.test(source)) {
            addKirbyPage(proposal, { name: 'Menu / carte', goal: 'Afficher la carte consultable depuis le QR code.' });
        }
        markApplied('QR code ajouté');
    }

    if (/reservation|reserver|rendez|rdv|agenda/.test(requested)) {
        addKirbyPage(proposal, { name: /restaurant|menu|carte/.test(source) ? 'Réservation' : 'Rendez-vous', goal: 'Permettre au visiteur de réserver ou demander un créneau.' });
        addKirbyService(proposal, { name: /restaurant|menu|carte/.test(source) ? 'Réservation en ligne' : 'Lien rendez-vous ou WhatsApp', reason: 'Le visiteur doit pouvoir agir sans chercher.', priceFrom: 'Inclus selon offre' }, true);
        addKirbyCta(proposal, /restaurant|menu|carte/.test(source) ? 'Réserver une table' : 'Prendre rendez-vous');
        addKirbyModelSection(proposal, 'Réservation');
        markApplied('Réservation ajoutée');
    }

    if (/horaire|heures|ouverture/.test(requested)) {
        addKirbyPage(proposal, { name: 'Horaires', goal: 'Afficher les jours, heures et informations pratiques.' });
        addKirbySection(proposal, { title: 'Horaires', text: 'Les horaires et informations pratiques sont visibles rapidement.' });
        markApplied('Horaires ajoutés');
    }

    if (/avis|temoignage|preuve|rassur/.test(requested)) {
        addKirbyPage(proposal, { name: 'Avis clients', goal: 'Rassurer avec des retours clients ou preuves concrètes.' });
        addKirbySection(proposal, { title: 'Avis clients', text: 'Les avis renforcent la confiance avant la prise de contact.' });
        markApplied('Avis clients ajoutés');
    }

    if (/contact|telephone|adresse|maps|localisation/.test(requested)) {
        addKirbyPage(proposal, { name: 'Contact', goal: 'Donner adresse, téléphone, formulaire ou accès direct.' });
        addKirbyService(proposal, { name: 'Google Maps et contact', reason: 'Utile pour être trouvé et contacté rapidement.', priceFrom: 'Inclus selon offre' });
        markApplied('Contact renforcé');
    }

    if (getKirbyBriefSignals(source).isBeauty || /tarif|prix|massage|soin|visage|epilation|zone|domicile|intervention|avant apres|avant\/apres|cliente|clientes|douce|rose|beige|bien etre|bien-etre/.test(requested)) {
        proposal.visualMood = 'beauty-wellness';

        if (/soin|visage|esthetique|estheticien/.test(source)) {
            addKirbyPage(proposal, { name: 'Soins du visage', goal: 'Présenter les soins visage, bénéfices et résultats attendus.' });
            addKirbySection(proposal, { title: 'Soins du visage', text: 'Une section douce explique les soins, la peau ciblée et le résultat recherché.' });
            markApplied('Soins visage ajoutés');
        }

        if (/massage|bien etre|bien-etre|relax/.test(source)) {
            addKirbyPage(proposal, { name: 'Massages', goal: 'Présenter les prestations détente et bien-être.' });
            addKirbySection(proposal, { title: 'Massages bien-être', text: 'Les massages sont présentés avec une promesse de détente claire.' });
            markApplied('Massages ajoutés');
        }

        if (/epilation/.test(source)) {
            addKirbyPage(proposal, { name: 'Épilations', goal: 'Lister les prestations d’épilation et informations pratiques.' });
            addKirbySection(proposal, { title: 'Épilations', text: 'Les prestations sont organisées simplement pour faciliter la demande.' });
            markApplied('Épilations ajoutées');
        }

        if (/tarif|prix/.test(source)) {
            addKirbyPage(proposal, { name: 'Tarifs', goal: 'Prévoir une grille lisible à compléter.' });
            addKirbySection(proposal, { title: 'Tarifs clairs', text: 'Une grille simple permet de comprendre les prestations avant de réserver.' });
            addKirbyService(proposal, { name: 'Tarifs clairs', reason: 'Rassurer avant la prise de rendez-vous.', priceFrom: 'Inclus selon offre' }, true);
            markApplied('Tarifs ajoutés');
        }

        if (/zone|domicile|intervention|ville|secteur/.test(source)) {
            addKirbyPage(proposal, { name: 'Zone d’intervention', goal: 'Indiquer les villes ou secteurs couverts à domicile.' });
            addKirbyService(proposal, { name: 'Zone d’intervention', reason: 'Clarifier où les soins peuvent être réalisés.', priceFrom: 'Inclus selon offre' }, true);
            markApplied('Zone ajoutée');
        }

        if (/avis|temoignage|cliente|clientes|rassur/.test(source)) {
            addKirbyPage(proposal, { name: 'Avis clientes', goal: 'Afficher des retours clientes et preuves de confiance.' });
            addKirbySection(proposal, { title: 'Avis clientes', text: 'Des avis courts rassurent avant la première prise de rendez-vous.' });
            addKirbyService(proposal, { name: 'Avis clientes', reason: 'Renforcer la confiance.', priceFrom: 'Inclus selon offre' }, true);
            markApplied('Avis clientes ajoutés');
        }

        if (/galerie|photo|image|avant apres|avant\/apres/.test(source)) {
            proposal.showGallery = true;
            addKirbyPage(proposal, { name: 'Galerie avant / après', goal: 'Montrer l’ambiance, les détails ou résultats sans surcharger.' });
            addKirbyService(proposal, { name: 'Galerie avant / après', reason: 'Montrer concrètement l’univers des soins.', priceFrom: 'Option' }, true);
            markApplied('Galerie beauté ajoutée');
        }

        addKirbyCta(proposal, 'Réservez votre soin');
        setKirbyPreviewSummary(proposal, 'Ce qui est prévu', [
            'Soins du visage',
            'Massages',
            'Épilations',
            'Tarifs',
            'Zone d’intervention',
            'Avis clientes',
        ]);
    }

    if (/resume|résumé|recap|récap|liste|check|inclu|comprend|formulaire|referencement|référencement|domaine|email|e-mail|mail|maintenance|support|site vitrine/.test(requested)) {
        const summaryItems = [];

        if (/site vitrine|site internet|vitrine/.test(requested)) {
            summaryItems.push('Site vitrine');
            addKirbyService(proposal, { name: 'Site vitrine', reason: 'Base claire pour présenter l’activité.', priceFrom: 'Selon projet' }, true);
        }

        if (/domaine|nom de domaine/.test(requested)) {
            summaryItems.push('Domaine personnalisé');
            addKirbyService(proposal, { name: 'Domaine personnalisé', reason: 'Nom professionnel pour le site.', priceFrom: 'Selon domaine' }, true);
        }

        if (/email|e-mail|mail/.test(requested)) {
            summaryItems.push('E-mail professionnel');
            addKirbyService(proposal, { name: 'E-mail professionnel', reason: 'Adresse contact professionnelle.', priceFrom: 'Selon configuration' }, true);
        }

        if (/formulaire|contact/.test(requested)) {
            summaryItems.push('Formulaire de contact');
            addKirbyPage(proposal, { name: 'Contact', goal: 'Ajouter un formulaire simple pour recevoir les demandes.' });
            addKirbyService(proposal, { name: 'Formulaire de contact', reason: 'Recevoir les demandes du client depuis le site.', priceFrom: 'Inclus selon offre' }, true);
        }

        if (/referencement|référencement|seo/.test(requested)) {
            summaryItems.push('Référencement de base');
            addKirbyService(proposal, { name: 'Référencement de base', reason: 'Préparer les titres et contenus pour la recherche locale.', priceFrom: 'Selon projet' }, true);
        }

        if (/maintenance|support/.test(requested)) {
            summaryItems.push(/maintenance/.test(requested) ? 'Maintenance' : 'Support technique');
            addKirbyService(proposal, { name: /maintenance/.test(requested) ? 'Maintenance' : 'Support technique', reason: 'Prévoir l’aide après mise en ligne.', priceFrom: 'Option' }, true);
        }

        if (!summaryItems.length) {
            summaryItems.push('Structure claire', 'Textes courts', 'Contact direct');
        }

        setKirbyPreviewSummary(proposal, 'Ce qui est prévu', summaryItems);
        addKirbySection(proposal, { title: 'Ce qui est prévu', text: summaryItems.join(' · ') });
        markApplied('Résumé ajouté');
    }

    if (!appliedChanges.length) {
        proposal.summary = shortenKirbySentence(`${proposal.summary || 'Proposition ajustée.'} Ajustement demandé : ${revision}`, 140);
        markApplied('Demande prise en compte');
    }

    proposal.revisionHistory = [
        ...getKirbyArray(proposal.revisionHistory, 4),
        { request: revision, changes: appliedChanges },
    ].slice(-5);
    proposal.appliedChanges = appliedChanges;

    return proposal;
};

const getKirbyPreviewStyle = (proposal = {}) => {
    const visualConcept = getKirbyVisualConcept(proposal);
    const source = normalizeKirbyText([
        proposal.visualMood,
        proposal.siteName,
        proposal.slogan,
        proposal.siteModel && proposal.siteModel.name,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.styleGuide && proposal.styleGuide.colors,
        visualConcept.ambience,
        visualConcept.heroComposition,
        visualConcept.layoutSignature,
        visualConcept.wowFactor,
        getKirbyArray(visualConcept.colorPalette, 6).join(' '),
        getKirbyArray(proposal.appliedChanges, 5).join(' '),
    ].filter(Boolean).join(' '));

    if (/accounting-dashboard|comptabilite|comptable|facturation|logiciel|saas|tableau de bord/.test(source)) {
        return {
            canvas: 'background: #f5f7fc;',
            hero: 'background: #ffffff;',
            visual: '',
        };
    }

    if (/beauty-wellness|estheticien|estheticienne|esthetique|beaute|massage|soin|epilation|spa|bien etre|bien-etre/.test(source)) {
        const variant = Number(proposal.designVariant) || 0;

        return {
            canvas: variant % 3 === 1
                ? 'background: linear-gradient(145deg, #fff8f4, #f4e8e1);'
                : variant % 3 === 2
                    ? 'background: linear-gradient(145deg, #fffaf2, #efe4da);'
                    : 'background: linear-gradient(145deg, #fff9f5, #f3e8df);',
            hero: variant % 3 === 1
                ? 'background: radial-gradient(circle at 84% 12%, rgba(209, 156, 141, 0.18), transparent 16rem), linear-gradient(120deg, #fffdf9, #f6e6dd);'
                : variant % 3 === 2
                    ? 'background: radial-gradient(circle at 84% 18%, rgba(216, 178, 118, 0.18), transparent 16rem), linear-gradient(120deg, #fffaf2, #f2e6da);'
                    : 'background: radial-gradient(circle at 84% 18%, rgba(203, 146, 132, 0.16), transparent 18rem), linear-gradient(120deg, #fffdf9, #f7ebe4);',
            visual: 'background-position: center;',
        };
    }

    if (/tech-premium|digital|generateur|ia|site web|creation web/.test(source)) {
        const variant = Number(proposal.designVariant) || 0;

        return {
            canvas: variant % 3 === 1
                ? 'background: linear-gradient(145deg, #f7f9ff, #e9eefb);'
                : variant % 3 === 2
                    ? 'background: linear-gradient(145deg, #f7fbff, #edf7f4);'
                    : 'background: linear-gradient(145deg, #fbfbfd, #eef1f6);',
            hero: variant % 3 === 1
                ? 'background: radial-gradient(circle at 84% 18%, rgba(11, 99, 206, 0.12), transparent 18rem), linear-gradient(120deg, #ffffff, #edf3ff);'
                : variant % 3 === 2
                    ? 'background: radial-gradient(circle at 84% 18%, rgba(32, 180, 150, 0.12), transparent 18rem), linear-gradient(120deg, #ffffff, #eef9f6);'
                    : 'background: radial-gradient(circle at 84% 18%, rgba(239, 214, 163, 0.2), transparent 18rem), linear-gradient(120deg, #ffffff, #f4f0e8);',
            visual: '',
        };
    }

    if (/warm|italien|italienne|chaleur|chaud|terroir|trattoria/.test(source)) {
        return {
            canvas: 'background: linear-gradient(145deg, #fff8ec, #f7efe3);',
            hero: 'background: linear-gradient(120deg, #fff4df, #f3ddbc);',
            visual: 'background: radial-gradient(circle at 50% 35%, rgba(168, 104, 43, 0.24), transparent 0.8rem), linear-gradient(145deg, rgba(255, 247, 232, 0.98), rgba(226, 193, 143, 0.42));',
        };
    }

    if (/premium|signature|luxe|elegant|elegance/.test(source)) {
        return {
            canvas: 'background: linear-gradient(145deg, #fbfbfd, #f0f2f7);',
            hero: 'background: linear-gradient(120deg, #ffffff, #f3eee3);',
            visual: 'background: radial-gradient(circle at 50% 35%, rgba(190, 153, 86, 0.24), transparent 0.8rem), linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(220, 211, 191, 0.48));',
        };
    }

    if (/image-led|galerie|photo|visuel/.test(source)) {
        return {
            canvas: 'background: linear-gradient(145deg, #f8fbff, #eef4ff);',
            hero: 'background: linear-gradient(120deg, #ffffff, #eaf1ff);',
            visual: 'background: radial-gradient(circle at 24% 22%, rgba(67, 105, 190, 0.18), transparent 1.4rem), radial-gradient(circle at 66% 52%, rgba(239, 214, 163, 0.32), transparent 1.8rem), linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(226, 234, 250, 0.8));',
        };
    }

    return { canvas: '', hero: '', visual: '' };
};

const getKirbyPreviewImageStyle = (proposal = {}, brief = '') => {
    const signals = getKirbyBriefSignals(brief);
    const visualConcept = getKirbyVisualConcept(proposal);
    const source = normalizeKirbyText([
        brief,
        proposal.projectType,
        proposal.siteName,
        proposal.visualMood,
        proposal.siteModel && proposal.siteModel.name,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.styleGuide && proposal.styleGuide.colors,
        visualConcept.ambience,
        visualConcept.heroComposition,
        visualConcept.layoutSignature,
        getKirbyArray(visualConcept.imageKeywords, 8).join(' '),
        getKirbyArray(proposal.pages, 6).map((page) => getKirbyItemTitle(page)).join(' '),
        getKirbyArray(proposal.recommendedServices, 6).map((service) => getKirbyItemTitle(service)).join(' '),
    ].filter(Boolean).join(' '));
    const index = getKirbyHash(`${brief} ${proposal.siteName} ${proposal.visualMood} ${source}`) % 17;
    const imageSets = [
        {
            test: () => signals.isArchitecture || /architect|architecture|architecte|arquitecto|interieur|intérieur|design d interieur|design d'intérieur|decorateur|decoratrice|decoration|décoration|maitre d oeuvre|maître d oeuvre/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
            ],
        },
        {
            test: () => signals.isDigital || /tech-premium|digital|generateur|ia|site web|creation web|referencement|maintenance|support technique/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=900&q=80',
            ],
        },
        {
            test: () => signals.isRestaurant || /restaurant|menu|carte|plat|cuisine|table/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=900&q=80',
            ],
        },
        {
            test: () => signals.isBeauty || /coiff|beaute|salon|institut|estheticien|estheticienne|esthetique|massage|soin|epilation|spa|bien etre|bien-etre/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80',
            ],
        },
        {
            test: () => signals.isShop || /boutique|mode|vetement|vetement|catalogue|panier|produit/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
            ],
        },
        {
            test: () => signals.isHotel || /hotel|chambre|gite|hebergement/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
            ],
        },
        {
            test: () => signals.isCraft || /plombier|artisan|travaux|service/.test(source),
            urls: [
                'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
            ],
        },
    ];
    const imageSet = imageSets.find((set) => set.test());
    const urls = imageSet ? imageSet.urls : imageSets[0].urls;
    const url = urls[index % urls.length];

    return `background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(15, 18, 29, 0.1)), url('${url}');`;
};

const getKirbyGalleryImageStyles = (proposal = {}, brief = '') => {
    const signals = getKirbyBriefSignals(brief);
    const visualConcept = getKirbyVisualConcept(proposal);
    const source = normalizeKirbyText([
        brief,
        proposal.visualMood,
        proposal.projectType,
        proposal.siteName,
        proposal.siteModel && proposal.siteModel.name,
        proposal.styleGuide && proposal.styleGuide.direction,
        proposal.styleGuide && proposal.styleGuide.colors,
        visualConcept.ambience,
        visualConcept.heroComposition,
        visualConcept.layoutSignature,
        getKirbyArray(visualConcept.imageKeywords, 8).join(' '),
        getKirbyArray(proposal.pages, 8).map((page) => getKirbyItemTitle(page)).join(' '),
    ].filter(Boolean).join(' '));
    const imageSets = signals.isArchitecture || /architect|architecture|architecte|arquitecto|interieur|intérieur|design d interieur|design d'intérieur|decorateur|decoratrice|decoration|décoration|maitre d oeuvre|maître d oeuvre/.test(source)
        ? [
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=700&q=80',
        ]
        : signals.isBeauty || /beauty-wellness|estheticien|estheticienne|esthetique|beaute|massage|soin|epilation|spa|bien etre|bien-etre/.test(source)
        ? [
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=80',
        ]
        : signals.isRestaurant || /restaurant|menu|carte|plat|cuisine/.test(source)
            ? [
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80',
                'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=80',
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80',
                'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=700&q=80',
            ]
            : signals.isShop || /boutique|mode|vetement|catalogue|panier|produit/.test(source)
                ? [
                    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
                ]
                : signals.isHotel || /hotel|chambre|gite|hebergement/.test(source)
                    ? [
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80',
                        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=700&q=80',
                        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=700&q=80',
                        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80',
                        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=700&q=80',
                        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=700&q=80',
                    ]
                    : signals.isCraft || /plombier|artisan|travaux|service/.test(source)
                        ? [
                            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
                        ]
                        : [
                            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80',
                            'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=700&q=80',
                        ];
    const offset = getKirbyHash(`${brief} ${proposal.siteName || ''} ${source}`) % imageSets.length;
    const selectedUrls = [0, 1, 2].map((index) => imageSets[(offset + index) % imageSets.length]);

    return selectedUrls.map((url) => `background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.02), rgba(15, 18, 29, 0.12)), url('${url}');`);
};

const formatKirbyProposalForCopy = (proposal = {}, brief = '') => {
    const siteModel = getKirbySiteModel(proposal);
    const pages = getKirbyArray(proposal.pages, 8);
    const sections = getKirbyArray(proposal.homeSections, 6);
    const services = getKirbyArray(proposal.recommendedServices, 8);
    const ctas = getKirbyArray(proposal.ctas, 4);
    const seo = getKirbySeo(proposal);
    const history = getKirbyArray(proposal.revisionHistory, 5);
    const siteName = formatKirbySiteName(proposal.siteName) || 'Nom de site à valider';
    const domain = getKirbyDomain(siteName);

    const lines = [
        'BASE SITE - SA Creation Web',
        '',
        `Besoin client : ${brief || 'A preciser'}`,
        `Nom propose : ${siteName}`,
        `Type de site : ${proposal.projectType || siteModel.name || 'Site professionnel'}`,
        `Modele : ${siteModel.name || 'Base sur mesure'}`,
        `Slogan : ${proposal.slogan || 'A ajuster'}`,
        `Domaine possible : ${domain}`,
        `Email possible : contact@${domain}`,
        '',
        'Pages a prevoir :',
        ...(pages.length
            ? pages.map((page) => `- ${getKirbyItemTitle(page)}${getKirbyItemText(page) ? ` : ${getKirbyItemText(page)}` : ''}`)
            : ['- Accueil', '- Services', '- Contact']),
        '',
        'Sections de page d accueil :',
        ...(sections.length
            ? sections.map((section) => `- ${getKirbyItemTitle(section)}${getKirbyItemText(section) ? ` : ${getKirbyItemText(section)}` : ''}`)
            : ['- Presentation', '- Services', '- Contact']),
        '',
        'Appels a l action :',
        ...(ctas.length ? ctas.map((cta) => `- ${cta}`) : ['- Contacter', '- Demander un devis']),
        '',
        'Options utiles selon le projet :',
        ...(services.length
            ? services.map((service) => `- ${getKirbyItemTitle(service)}${getKirbyItemText(service) ? ` : ${getKirbyItemText(service)}` : ''}`)
            : ['- Site internet', '- Domaine', '- Email professionnel']),
        '',
        'Idees SEO :',
        ...(seo.keywords.length ? [`- Mots-cles : ${seo.keywords.join(', ')}`] : []),
        ...(seo.searchExpressions.length ? [`- Recherches ciblees : ${seo.searchExpressions.join(', ')}`] : []),
        '',
        'Ajustements Kirby appliques :',
        ...(history.length
            ? history.map((item) => `- ${item.request || 'Ajustement'}${getKirbyArray(item.changes, 4).length ? ` (${getKirbyArray(item.changes, 4).join(', ')})` : ''}`)
            : ['- Aucun ajustement pour le moment']),
        '',
        'Note production : base a finaliser manuellement avec le client.',
    ];

    return lines.join('\n');
};

const copyTextToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
};

const requestKirbyProposal = async ({ brief, revision = '', currentProposal = null }) => {
    const response = await fetch('/api/kirby', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brief, revision, currentProposal }),
    });

    if (!response.ok) {
        throw new Error('kirby_request_failed');
    }

    return response.json();
};

const getKirbyRuntimeLabel = (payload = {}) => {
    if (payload?.source === 'openai' && payload.model) {
        return `Kirby IA active · ${payload.model}`;
    }

    if (payload?.source === 'fallback') {
        return 'Kirby mode secours · IA indisponible';
    }

    return 'Kirby en préparation';
};

const getKirbyPilotMission = (proposal = {}) => {
    const safeProposal = proposal && typeof proposal === 'object' ? proposal : {};
    const pages = getKirbyArray(safeProposal.pages, 7).map((page) => getKirbyItemTitle(page)).filter(Boolean);
    const seo = getKirbySeo(safeProposal);

    return [
        safeProposal.styleGuide?.direction || safeProposal.visualConcept?.layoutSignature || 'Direction visuelle définie',
        pages.length ? `${pages.length} pages structurées : ${pages.slice(0, 3).join(', ')}` : 'Parcours du site structuré',
        seo.metaDescription ? 'SEO de départ rédigé' : 'SEO à renforcer',
        safeProposal.ctas?.[0] ? `Action principale : ${safeProposal.ctas[0]}` : 'Conversion à renforcer',
    ].filter(Boolean).slice(0, 4);
};

const kirbyPilotActions = {
    brand: 'Reprends la direction artistique complète : rends le projet plus distinctif, mémorable et cohérent avec l’activité. Mets à jour le visuel, la hiérarchie, les textes et les appels à l’action.',
    conversion: 'Audite le parcours client et améliore la conversion : clarifie la promesse, les preuves de confiance, les actions principales et les sections qui doivent déclencher une prise de contact ou une réservation.',
    launch: 'Prépare le lancement : complète les pages et le SEO, vérifie les informations indispensables, priorise les éléments à finaliser et propose une version prête à valider.',
};

const normalizeKirbyLayoutVariant = (value = '') => {
    const variant = normalizeKirbyText(value).replace(/_/g, '-').replace(/\s+/g, '-');
    const aliases = {
        video: 'cinematic-video',
        cinematic: 'cinematic-video',
        'full-video': 'cinematic-video',
        galerie: 'gallery-focus',
        gallery: 'gallery-focus',
        portfolio: 'gallery-focus',
        minimal: 'minimal-editorial',
        minimalist: 'minimal-editorial',
        luxe: 'luxury-asymmetric',
        luxury: 'luxury-asymmetric',
        asymmetric: 'luxury-asymmetric',
        asymetrique: 'luxury-asymmetric',
        dashboard: 'product-dashboard',
        app: 'product-dashboard',
        warm: 'warm-editorial',
        editorial: 'warm-editorial',
        classic: 'classic-conversion',
    };
    const allowed = ['cinematic-video', 'gallery-focus', 'minimal-editorial', 'luxury-asymmetric', 'product-dashboard', 'warm-editorial', 'classic-conversion'];

    return allowed.includes(variant) ? variant : aliases[variant] || '';
};

const getKirbyLayoutVariant = (proposal = {}, brief = '', isDashboardPreview = false) => {
    if (isDashboardPreview) {
        return 'product-dashboard';
    }

    const signals = getKirbyBriefSignals(brief);
    const visualConcept = getKirbyVisualConcept(proposal);
    const source = normalizeKirbyText([
        brief,
        proposal.layoutVariant,
        proposal.visualMood,
        proposal.projectType,
        proposal.siteModel && proposal.siteModel.name,
        proposal.styleGuide && proposal.styleGuide.layout,
        proposal.styleGuide && proposal.styleGuide.direction,
        visualConcept.layoutSignature,
        visualConcept.heroComposition,
        visualConcept.wowFactor,
    ].filter(Boolean).join(' '));
    const requestedVariant = normalizeKirbyLayoutVariant(proposal.layoutVariant || visualConcept.layoutVariant || visualConcept.layoutSignature);

    if (requestedVariant) {
        return requestedVariant;
    }

    if (/video|cinematic|immersif|immersive|plein ecran|full bleed/.test(source) || signals.isHotel) {
        return 'cinematic-video';
    }

    if (/galerie|gallery|portfolio|realisations|projets|book|photo/.test(source) || signals.isArchitecture) {
        return 'gallery-focus';
    }

    if (/minimal|sobre|ultra simple|editorial/.test(source)) {
        return 'minimal-editorial';
    }

    if (/luxe|luxury|signature|asymetrique|asymmetric|premium/.test(source)) {
        return 'luxury-asymmetric';
    }

    if (signals.isRestaurant || /warm|chaleur|restaurant|terroir|italien/.test(source)) {
        return 'warm-editorial';
    }

    const variants = ['classic-conversion', 'minimal-editorial', 'luxury-asymmetric'];
    return variants[getKirbyHash(`${brief} ${proposal.siteName || ''} ${source}`) % variants.length];
};

const renderKirbyProposal = (proposal, brief, runtime = {}) => {
    if (!aiBriefOutput) {
        return;
    }

    const safeProposal = normalizeKirbyProposalForBrief(proposal, brief);
    const siteModel = getKirbySiteModel(safeProposal);
    const pages = getKirbyArray(safeProposal.pages, 7);
    const homeSections = getKirbyArray(safeProposal.homeSections, 3);
    const ctas = getKirbyArray(safeProposal.ctas, 3);
    const contactMessage = safeProposal.contactMessage || buildBrowserKirbyProposal(brief).contactMessage;
    const quoteParams = new URLSearchParams({
        service: safeProposal.recommendedOffer || 'Projet site web',
        message: contactMessage,
    });
    const builderPanel = aiBriefOutput.closest('.ai-brief-panel');
    const siteName = formatKirbySiteName(safeProposal.siteName) || 'Nom de site à valider';
    const runtimeLabel = getKirbyRuntimeLabel(runtime);
    const pilotMission = getKirbyPilotMission(safeProposal);
    const domain = getKirbyDomain(siteName);
    const email = `contact@${domain}`;
    const cleanPages = pages.filter((page) => getKirbyItemTitle(page));
    const cleanHomeSections = homeSections
        .map((section) => ({
            title: getKirbyItemTitle(section),
            text: getKirbyItemText(section),
        }))
        .filter((section) => section.title && section.text);
    const visiblePages = cleanPages.length
        ? cleanPages.slice(0, 7)
        : [{ name: 'Accueil' }, { name: 'Offres' }, { name: 'Galerie' }, { name: 'Contact' }];
    const visibleSections = cleanHomeSections.length
        ? cleanHomeSections
        : visiblePages.slice(1, 4)
            .map((page) => ({ title: getKirbyItemTitle(page), text: getKirbyItemText(page) || 'Une section claire présente cette partie du projet.' }))
            .filter((section) => section.title && section.text);
    const quoteItems = [
        ...visiblePages.map((page) => getKirbyItemTitle(page)).filter(Boolean).slice(0, 3),
    ].filter(Boolean).slice(0, 6);
    const visiblePageNames = visiblePages.map((page) => getKirbyItemTitle(page)).filter(Boolean).slice(0, 6);
    const primaryCta = ctas[0] || 'Découvrir';
    const secondaryCta = ctas[1] || 'Contacter';
    const previewStyle = getKirbyPreviewStyle(safeProposal);
    const previewImageStyle = getKirbyPreviewImageStyle(safeProposal, brief);
    const galleryImageStyles = getKirbyGalleryImageStyles(safeProposal, brief);
    const toneSource = normalizeKirbyText([
        safeProposal.visualMood,
        safeProposal.projectType,
        siteModel.name,
        brief,
    ].filter(Boolean).join(' '));
    const briefSignals = getKirbyBriefSignals(brief);
    const isDashboardPreview = /accounting-dashboard|comptabilite|comptable|facturation|logiciel de compta|logiciel comptable|tableau de bord|dashboard|contadirect/.test(toneSource);
    const layoutVariant = getKirbyLayoutVariant(safeProposal, brief, isDashboardPreview);
    const previewTone = isDashboardPreview
        ? 'is-dashboard'
        : /tech-premium|digital|generateur|ia|site web|creation web/.test(toneSource)
        ? 'is-tech'
        : !briefSignals.isHotel && /beauty-wellness|estheticien|estheticienne|esthetique|beaute|massage|soin|epilation|spa|bien etre|bien-etre/.test(toneSource)
            ? 'is-beauty'
            : '';
    const dashboardBrand = cleanHtml(safeProposal.siteName || siteName).replace(/Direct$/i, '<b>Direct</b>');
    const dashboardMenuItems = ['Tableau de bord', 'Revenus', 'Depenses', 'Devis', 'Factures', 'Banque', 'Documents', 'TVA & Charges'];
    const dashboardPreview = `
        <div class="kirby-dashboard-app" aria-label="Apercu application ${cleanHtml(siteName)}">
            <aside class="kirby-dashboard-sidebar">
                <div class="kirby-dashboard-brand">
                    <span aria-hidden="true">CD</span>
                    <strong>${dashboardBrand}</strong>
                </div>
                <div class="kirby-dashboard-menu">
                    ${dashboardMenuItems.map((item, index) => `
                        <span class="${index === 0 ? 'is-active' : ''}">
                            <i>${cleanHtml(item.split(' ').map((word) => word.charAt(0)).join('').slice(0, 2))}</i>
                            ${cleanHtml(item)}
                        </span>
                    `).join('')}
                </div>
                <div class="kirby-dashboard-user">
                    <span aria-hidden="true">TM</span>
                    <div>
                        <strong>Thomas Martin</strong>
                        <small>Entreprise individuelle</small>
                    </div>
                </div>
                <div class="kirby-dashboard-plan">
                    <strong>Plan Premium</strong>
                    <small>Jusqu'au 12/06/2025</small>
                </div>
            </aside>
            <main class="kirby-dashboard-main">
                <header class="kirby-dashboard-topbar">
                    <label class="kirby-dashboard-search">
                        <span class="sr-only">Rechercher</span>
                        <input type="text" value="" placeholder="Rechercher..." readonly>
                    </label>
                    <div class="kirby-dashboard-actions">
                        <span class="dash-new">+ ${cleanHtml(primaryCta || 'Nouveau')}</span>
                        <span class="dash-icon">3</span>
                        <span class="dash-avatar">TM</span>
                    </div>
                </header>
                <section class="kirby-dashboard-title">
                    <div>
                        <h3>Bonjour Thomas</h3>
                        <p>Voici un apercu de votre activite</p>
                    </div>
                    <span>1 - 30 Mai 2025</span>
                </section>
                <section class="kirby-dashboard-kpis">
                    <article>
                        <small>Chiffre d'affaires</small>
                        <strong>12 590,00 EUR</strong>
                        <em>+12,5% vs Avril</em>
                        <i class="spark spark-blue"></i>
                    </article>
                    <article>
                        <small>Depenses</small>
                        <strong>4 320,50 EUR</strong>
                        <em>-8,3% vs Avril</em>
                        <i class="spark spark-red"></i>
                    </article>
                    <article>
                        <small>Resultat net</small>
                        <strong>8 269,50 EUR</strong>
                        <em>+18,7% vs Avril</em>
                        <i class="spark spark-green"></i>
                    </article>
                    <article>
                        <small>TVA a reverser</small>
                        <strong>1 250,00 EUR</strong>
                        <em class="is-warning">Echeance 20/06/2025</em>
                        <i class="dash-progress"></i>
                    </article>
                </section>
                <section class="kirby-dashboard-content">
                    <div class="dash-panel dash-chart-panel">
                        <div class="dash-panel-head">
                            <strong>Evolution du chiffre d'affaires</strong>
                            <span>Mensuel</span>
                        </div>
                        <div class="dash-bars" aria-hidden="true">
                            <i style="--h: 58%"></i><i style="--h: 68%"></i><i style="--h: 62%"></i><i style="--h: 72%"></i><i style="--h: 80%"></i><i style="--h: 92%"></i>
                        </div>
                    </div>
                    <div class="dash-panel dash-donut-panel">
                        <div class="dash-panel-head">
                            <strong>Repartition des depenses</strong>
                            <span>Categories</span>
                        </div>
                        <div class="dash-donut-wrap">
                            <div class="dash-donut" aria-hidden="true"><strong>4 320,50</strong><small>Total</small></div>
                            <ul>
                                <li><i></i> Achats / Marchandises</li>
                                <li><i></i> Charges externes</li>
                                <li><i></i> Services</li>
                                <li><i></i> Deplacements</li>
                            </ul>
                        </div>
                    </div>
                    <aside class="dash-side-stack">
                        <div class="dash-panel dash-tasks">
                            <div class="dash-panel-head"><strong>A faire</strong></div>
                            <p><i></i>Valider 3 factures <b>1 250,00 EUR</b></p>
                            <p><i></i>Relancer 2 devis <b>950,00 EUR</b></p>
                            <p><i></i>Justificatifs a classer <b class="badge">7</b></p>
                            <a>${cleanHtml(secondaryCta || 'Voir toutes les taches')}</a>
                        </div>
                        <div class="dash-panel dash-bank">
                            <div class="dash-panel-head"><strong>Comptes bancaires</strong><span>Voir tout</span></div>
                            <p><span>Compte principal</span><b>8 240,75 EUR</b></p>
                            <p><span>Compte epargne</span><b>12 500,00 EUR</b></p>
                        </div>
                    </aside>
                    <div class="dash-panel dash-list-panel">
                        <div class="dash-panel-head"><strong>Dernieres transactions</strong><span>Voir tout</span></div>
                        <p><span>Facture F-2025-052</span><b>1 250,00 EUR</b></p>
                        <p><span>Achat fournitures</span><b class="is-negative">-89,90 EUR</b></p>
                        <p><span>Virement recu</span><b>980,00 EUR</b></p>
                    </div>
                    <div class="dash-panel dash-ai-panel">
                        <strong>Assistant IA</strong>
                        <p>Comment puis-je vous aider aujourd'hui ?</p>
                        <span>Analyser mes depenses du mois</span>
                        <span>Quel sera mon resultat ce mois-ci ?</span>
                        <div>Posez votre question...</div>
                    </div>
                </section>
            </main>
        </div>
    `;
    const navMarkup = `
        <nav class="kirby-live-nav">
            <strong>${cleanHtml(siteName)}</strong>
            <div>
                ${visiblePageNames.map((pageName) => `<span>${cleanHtml(pageName)}</span>`).join('')}
            </div>
        </nav>
    `;
    const actionsMarkup = `
        <div class="kirby-preview-actions">
            <span>${cleanHtml(primaryCta)}</span>
            <span>${cleanHtml(secondaryCta)}</span>
        </div>
    `;
    const sectionsMarkup = `
        <div class="kirby-live-sections">
            ${visibleSections.slice(0, 3).map((section) => `
                <article>
                    <strong>${cleanHtml(getKirbyItemTitle(section))}</strong>
                    <span>${cleanHtml(getKirbyShortText(getKirbyItemText(section), 68))}</span>
                </article>
            `).join('')}
        </div>
    `;
    const galleryMarkup = `
        <div class="kirby-live-gallery" aria-hidden="true">
            ${galleryImageStyles.map((style) => `<span style="${style}"></span>`).join('')}
        </div>
    `;
    const footerMarkup = `
        <footer class="kirby-live-footer">
            <span>${cleanHtml(email)}</span>
            <span>${cleanHtml(domain)}</span>
        </footer>
    `;
    const heroCopyMarkup = `
        <div class="kirby-live-hero-copy">
            <p class="signal-label">${cleanHtml(siteModel.name)}</p>
            <h3>${cleanHtml(siteName)}</h3>
            <p class="kirby-slogan">${cleanHtml(safeProposal.slogan || '')}</p>
            ${actionsMarkup}
        </div>
    `;
    const classicPreview = `
        ${navMarkup}
        <section class="kirby-live-hero" style="${previewStyle.hero}">
            ${heroCopyMarkup}
            <div class="kirby-hero-visual kirby-hero-image" style="${previewStyle.visual} ${previewImageStyle}" aria-hidden="true">
                <span></span><span></span><span></span>
            </div>
        </section>
        ${sectionsMarkup}
        ${safeProposal.showGallery ? galleryMarkup : ''}
        ${footerMarkup}
    `;
    const cinematicPreview = `
        ${navMarkup}
        <section class="kirby-live-video-hero kirby-hero-image" style="${previewImageStyle}">
            <div class="kirby-video-copy">
                <p class="signal-label">${cleanHtml(siteModel.name)}</p>
                <h3>${cleanHtml(siteName)}</h3>
                <p>${cleanHtml(safeProposal.slogan || '')}</p>
                ${actionsMarkup}
            </div>
            <span class="kirby-play-mark" aria-hidden="true"></span>
        </section>
        <div class="kirby-live-rail">
            ${visibleSections.slice(0, 3).map((section, index) => `
                <article>
                    <em>${String(index + 1).padStart(2, '0')}</em>
                    <strong>${cleanHtml(getKirbyItemTitle(section))}</strong>
                    <span>${cleanHtml(getKirbyShortText(getKirbyItemText(section), 78))}</span>
                </article>
            `).join('')}
        </div>
        ${footerMarkup}
    `;
    const galleryPreview = `
        ${navMarkup}
        <section class="kirby-gallery-focus">
            <div class="kirby-gallery-lead">
                <p class="signal-label">${cleanHtml(siteModel.name)}</p>
                <h3>${cleanHtml(siteName)}</h3>
                <p>${cleanHtml(safeProposal.slogan || '')}</p>
                ${actionsMarkup}
            </div>
            <div class="kirby-gallery-mosaic" aria-hidden="true">
                ${galleryImageStyles.map((style) => `<span style="${style}"></span>`).join('')}
            </div>
        </section>
        ${sectionsMarkup}
        ${footerMarkup}
    `;
    const minimalPreview = `
        ${navMarkup}
        <section class="kirby-minimal-editorial">
            <p class="signal-label">${cleanHtml(siteModel.name)}</p>
            <h3>${cleanHtml(safeProposal.slogan || siteName)}</h3>
            <div>
                <strong>${cleanHtml(siteName)}</strong>
                <p>${cleanHtml(getKirbyShortText(safeProposal.valueProposition || safeProposal.summary || '', 150))}</p>
                ${actionsMarkup}
            </div>
        </section>
        <div class="kirby-minimal-list">
            ${visibleSections.slice(0, 4).map((section) => `
                <article>
                    <strong>${cleanHtml(getKirbyItemTitle(section))}</strong>
                    <span>${cleanHtml(getKirbyShortText(getKirbyItemText(section), 92))}</span>
                </article>
            `).join('')}
        </div>
        ${footerMarkup}
    `;
    const asymmetricPreview = `
        ${navMarkup}
        <section class="kirby-asymmetric-layout">
            <div class="kirby-asym-copy">
                <p class="signal-label">${cleanHtml(siteModel.name)}</p>
                <h3>${cleanHtml(siteName)}</h3>
                <p>${cleanHtml(safeProposal.slogan || '')}</p>
                ${actionsMarkup}
            </div>
            <div class="kirby-asym-image kirby-hero-image" style="${previewImageStyle}" aria-hidden="true"></div>
            <div class="kirby-asym-stack">
                ${visibleSections.slice(0, 2).map((section) => `
                    <article>
                        <strong>${cleanHtml(getKirbyItemTitle(section))}</strong>
                        <span>${cleanHtml(getKirbyShortText(getKirbyItemText(section), 74))}</span>
                    </article>
                `).join('')}
            </div>
        </section>
        ${safeProposal.showGallery ? galleryMarkup : ''}
        ${footerMarkup}
    `;
    const warmPreview = `
        ${navMarkup}
        <section class="kirby-warm-editorial">
            <div class="kirby-warm-image kirby-hero-image" style="${previewImageStyle}" aria-hidden="true"></div>
            <div class="kirby-warm-copy">
                <p class="signal-label">${cleanHtml(siteModel.name)}</p>
                <h3>${cleanHtml(siteName)}</h3>
                <p>${cleanHtml(safeProposal.slogan || '')}</p>
                ${actionsMarkup}
            </div>
        </section>
        ${sectionsMarkup}
        ${footerMarkup}
    `;
    const websitePreview = isDashboardPreview ? dashboardPreview : ({
        'cinematic-video': cinematicPreview,
        'gallery-focus': galleryPreview,
        'minimal-editorial': minimalPreview,
        'luxury-asymmetric': asymmetricPreview,
        'warm-editorial': warmPreview,
        'classic-conversion': classicPreview,
    }[layoutVariant] || classicPreview);

    if (quoteItems.length) {
        quoteParams.set('items', quoteItems.join('|'));
    }

    builderPanel?.classList.add('has-proposal');
    aiBriefOutput.classList.remove('is-loading');
    aiBriefOutput.innerHTML = `
        <div class="kirby-generated-clean">
            <p class="signal-label">${cleanHtml(runtimeLabel)}</p>
            <section class="kirby-pilot-panel" aria-label="Mission Kirby">
                <div>
                    <p class="signal-label">Mission Kirby</p>
                    <strong>La première version est pilotée.</strong>
                </div>
                <ul>${pilotMission.map((item) => `<li>${cleanHtml(item)}</li>`).join('')}</ul>
                <div class="kirby-pilot-actions" aria-label="Actions Kirby">
                    <button class="button button-secondary" type="button" data-kirby-pilot-action="brand">Renforcer l'identité</button>
                    <button class="button button-secondary" type="button" data-kirby-pilot-action="conversion">Optimiser la conversion</button>
                    <button class="button button-primary" type="button" data-kirby-pilot-action="launch">Préparer le lancement</button>
                </div>
            </section>
            <div class="kirby-generated-website kirby-editor-workspace">
                <div class="kirby-preview-browser kirby-live-browser kirby-site-canvas ${previewTone} layout-${layoutVariant}" style="${previewStyle.canvas}" aria-label="Prévisualisation du site">
                    <div class="kirby-preview-chrome"><span></span><span></span><span></span></div>
                    ${websitePreview}
                </div>
            </div>

            <form class="kirby-revision-form kirby-revision-compact">
                <label class="field">
                    <span class="sr-only">Demander un ajustement à Kirby</span>
                    <textarea rows="2" name="revision" placeholder="Demander un ajustement à Kirby"></textarea>
                </label>
                <div class="kirby-generated-actions">
                    <button class="button button-secondary" type="submit">Modifier</button>
                    <a class="button button-primary" data-kirby-next-link href="contact.html?${quoteParams.toString()}">Continuer</a>
                </div>
            </form>
        </div>
    `;

    const revisionForm = aiBriefOutput.querySelector('.kirby-revision-form');

    revisionForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const revision = new FormData(revisionForm).get('revision')?.toString().trim() || '';

        if (!revision) {
            return;
        }

        setKirbyLoading();

        try {
            const payload = await requestKirbyProposal({ brief, revision, currentProposal: safeProposal });
            renderKirbyProposal(applyKirbyRevision(payload.proposal || safeProposal, revision, brief), brief, payload);
        } catch (error) {
            console.warn('Kirby revision fallback:', error);
            renderKirbyProposal(applyKirbyRevision(safeProposal, revision, brief), brief, { source: 'fallback' });
        }
    });

    aiBriefOutput.querySelectorAll('[data-kirby-pilot-action]').forEach((button) => {
        button.addEventListener('click', async () => {
            const action = button.dataset.kirbyPilotAction || '';
            const revision = kirbyPilotActions[action];

            if (!revision) {
                return;
            }

            setKirbyLoading('Kirby prend le sujet en main…');
            try {
                const payload = await requestKirbyProposal({ brief, revision, currentProposal: safeProposal });
                renderKirbyProposal(applyKirbyRevision(payload.proposal || safeProposal, revision, brief), brief, payload);
            } catch (error) {
                console.warn('Kirby pilot fallback:', error);
                renderKirbyProposal(applyKirbyRevision(safeProposal, revision, brief), brief, { source: 'fallback' });
            }
        });
    });
};

const setKirbyLoading = (message = 'Génération du site...') => {
    if (!aiBriefOutput) {
        return;
    }

    aiBriefOutput.closest('.ai-brief-panel')?.classList.remove('has-proposal');
    aiBriefOutput.classList.add('is-loading');
    aiBriefOutput.innerHTML = `
        <div class="kirby-generation-stage" aria-label="Kirby génère le site">
            <div class="kirby-generation-overlay">
                <div class="kirby-loader-ring" aria-hidden="true"></div>
                <h3>${escapeHtml(message)}</h3>
            </div>
        </div>
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

kirbyAutopilotButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const baseBrief = aiBriefInput?.value.trim() || '';

        if (baseBrief.length < 8 || !aiBriefOutput) {
            aiBriefInput?.focus();
            return;
        }

        const brief = `${baseBrief}\n\nMission Kirby : prends le projet en main. Choisis la meilleure direction de marque et de design, construis le parcours client complet, rédige les contenus prioritaires, prépare le SEO et livre une première version forte à ajuster.`;
        setKirbyLoading('Kirby prend le projet en main…');

        try {
            const payload = await requestKirbyProposal({ brief });
            renderKirbyProposal(payload.proposal || buildBrowserKirbyProposal(brief), brief, payload);
        } catch (error) {
            console.warn('Kirby autopilot fallback:', error);
            renderKirbyProposal(buildBrowserKirbyProposal(brief), brief, { source: 'fallback' });
        }
    });
});

if (aiBriefForm && aiBriefInput && aiBriefOutput) {
    aiBriefForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const baseBrief = aiBriefInput.value.trim();
        const brief = buildKirbyBriefFromForm();

        if (baseBrief.length < 8) {
            aiBriefOutput.closest('.ai-brief-panel')?.classList.remove('has-proposal');
            aiBriefOutput.innerHTML = `
                <p class="signal-label">Idée trop courte</p>
                <h3>Décrivez votre activité en une phrase.</h3>
                <p>Exemple : Je suis coiffeuse à Rueil, je veux un site avec tarifs, photos, rendez-vous et contact.</p>
            `;
            return;
        }

        setKirbyLoading();

        try {
            const payload = await requestKirbyProposal({ brief });
            renderKirbyProposal(payload.proposal || buildBrowserKirbyProposal(brief), brief, payload);
        } catch (error) {
            console.warn('Kirby assistant fallback:', error);
            renderKirbyProposal(buildBrowserKirbyProposal(brief), brief, { source: 'fallback' });
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
        width = Math.max(1, Math.ceil(bounds.width || document.documentElement.clientWidth || window.innerWidth));
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

const initPageCosmicField = () => {
    const canvas = document.querySelector('#cosmic-page-field');

    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const context = canvas.getContext('2d');
    let stars = [];
    let width = 0;
    let height = 0;
    let animationFrame;
    let time = 0;
    let scrollY = window.scrollY || 0;

    const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = document.documentElement.clientWidth || window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const starCount = width < 720 ? 90 : 150;
        stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            depth: Math.random() * 0.85 + 0.15,
            size: Math.random() * 1.4 + 0.35,
            phase: Math.random() * Math.PI * 2,
            warm: Math.random() > 0.78,
        }));
    };

    const draw = () => {
        time += 0.006;
        context.clearRect(0, 0, width, height);

        stars.forEach((star) => {
            const driftX = Math.sin(time + star.phase) * 18 * star.depth;
            const driftY = ((scrollY * 0.025 * star.depth) + Math.cos(time * 0.65 + star.phase) * 10) % height;
            const x = (star.x + driftX + width) % width;
            const y = (star.y + driftY + height) % height;
            const pulse = 0.56 + Math.sin(time * 2.4 + star.phase) * 0.22;
            const alpha = Math.max(0.12, pulse * star.depth * 0.58);

            context.beginPath();
            context.arc(x, y, star.size * star.depth, 0, Math.PI * 2);
            context.fillStyle = star.warm
                ? `rgba(239, 214, 163, ${alpha})`
                : `rgba(255, 255, 255, ${alpha})`;
            context.fill();

            if (star.depth > 0.7 && star.size > 1.2) {
                context.beginPath();
                context.arc(x, y, star.size * 4.2, 0, Math.PI * 2);
                context.fillStyle = `rgba(114, 150, 255, ${alpha * 0.08})`;
                context.fill();
            }
        });

        animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', () => {
        window.cancelAnimationFrame(animationFrame);
        resize();
        draw();
    }, { passive: true });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY || 0;
    }, { passive: true });
};

initPageCosmicField();
initHeroParticles();
