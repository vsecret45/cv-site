const navLinks = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main section[id]')];
const contactForm = document.querySelector('#contact-form');
const cards = document.querySelectorAll('.card');
const revealSections = document.querySelectorAll('.reveal-section');
const cvForm = document.querySelector('#cv-form');
const cvPrintButton = document.querySelector('#cv-print');
const cvExportPdfButton = document.querySelector('#cv-export-pdf');
const cvAutofillButton = document.querySelector('#cv-autofill');
const cvImproveButton = document.querySelector('#cv-improve');
const cvSaveButton = document.querySelector('#cv-save');
const cvFitPageButton = document.querySelector('#cv-fit-page');
const cvImportInput = document.querySelector('#cv-import');
const cvExportWordButton = document.querySelector('#cv-export-word');
const cvExportWebButton = document.querySelector('#cv-export-web');
const cvShareButton = document.querySelector('#cv-share');
const cvEmailButton = document.querySelector('#cv-email');
const cvAiImproveButton = document.querySelector('#cv-ai-improve');
const cvStatus = document.querySelector('#cv-status');
const atsScoreValue = document.querySelector('#ats-score-value');
const jobMatchValue = document.querySelector('#job-match-value');
const cvAnalysisList = document.querySelector('#cv-analysis-list');
const cvSuggestionsList = document.querySelector('#cv-suggestions-list');
const cvAnalyzeButton = document.querySelector('#cv-analyze');
const cvMatchJobButton = document.querySelector('#cv-match-job');
const jobOfferField = document.querySelector('#job-offer');
const cvZoomSelect = document.querySelector('#cv-zoom');
const cvLayout = document.querySelector('#cv-layout');
const cvEditorPanel = document.querySelector('#cv-editor-panel');
const cvLayoutToggle = document.querySelector('#cv-layout-toggle');
const cvPreviewViewport = document.querySelector('#cv-preview-viewport');
const cvPreviewStage = document.querySelector('#cv-preview-stage');
const cvPrevPageButton = document.querySelector('#cv-prev-page');
const cvNextPageButton = document.querySelector('#cv-next-page');
const cvPageIndicator = document.querySelector('#cv-page-indicator');
const previewPageThumbnails = document.querySelector('#preview-page-thumbnails');
const previewModeTabs = document.querySelectorAll('[data-preview-mode]');
const cvOverflowIndicator = document.querySelector('#cv-overflow-indicator');
const previewHeadlineScale = document.querySelector('#preview-headline-scale');
const previewLineSpacing = document.querySelector('#preview-line-spacing');
const previewLayoutTheme = document.querySelector('#preview-layout-theme');
const previewFitInlineButton = document.querySelector('#preview-fit-inline');
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
const expandableCards = document.querySelectorAll('[data-expandable]');
const presetChips = document.querySelectorAll('.preset-chip');
const templatePresetChips = document.querySelectorAll('[data-template-preset]');
const PDFJS_MODULE_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs';

let pdfjsLoader;
let currentPreviewPage = 1;
let currentPreviewMode = 'cv';
let isAutoFittingCv = false;
let cvSectionOrder = ['summary', 'skills', 'experience', 'education', 'activities', 'languages'];

const previewNodes = {
    fullName: document.querySelector('#preview-name'),
    meta: document.querySelector('#preview-meta'),
    headline: document.querySelector('#preview-headline'),
    summary: document.querySelector('#preview-summary'),
    experience: document.querySelector('#preview-experience'),
    skills: document.querySelector('#preview-skills'),
    education: document.querySelector('#preview-education'),
    languages: document.querySelector('#preview-languages'),
    activities: document.querySelector('#preview-activities'),
    preview: document.querySelector('#cv-preview'),
};

const templateThemeMap = {
    classic: 'template-classic',
    modern: 'template-modern',
    executive: 'template-executive',
    minimal: 'template-minimal',
};

const cvSectionLabels = {
    summary: 'Profil',
    skills: 'Competences',
    experience: 'Experiences professionnelles',
    education: 'Formations',
    activities: 'Activites',
    languages: 'Langues',
};

const templatePresets = {
    classic: {
        layoutTheme: 'classic',
        fontTheme: 'lato',
        colorTheme: 'graphite',
        designMood: 'clean',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#334155',
    },
    professional: {
        layoutTheme: 'executive',
        fontTheme: 'inter',
        colorTheme: 'indigo',
        designMood: 'editorial',
        lineSpacing: 'normal',
        textAlign: 'left',
        accentColor: '#2f3f7f',
    },
    design: {
        layoutTheme: 'modern',
        fontTheme: 'manrope',
        colorTheme: 'rose',
        designMood: 'startup',
        lineSpacing: 'airy',
        textAlign: 'left',
        accentColor: '#b83280',
    },
    luxury: {
        layoutTheme: 'executive',
        fontTheme: 'playfair',
        colorTheme: 'graphite',
        designMood: 'luxury',
        lineSpacing: 'airy',
        textAlign: 'left',
        accentColor: '#9a7b43',
    },
};

const offerKeywordMap = {
    react: ['react', 'javascript', 'frontend', 'front-end', 'component'],
    ux: ['ux', 'ui', 'experience utilisateur', 'interface', 'figma'],
    api: ['api', 'integration', 'donnees', 'base de donnees'],
    client: ['relation client', 'accompagnement', 'service client', 'conseil'],
};

const applyCvPreset = (preset) => {
    if (!cvForm) {
        return;
    }

    const form = cvForm.elements;

    if (preset === 'frontend') {
        form.headline.value = 'Developpeuse web front-end';
        form.summary.value = "Je conçois des interfaces web modernes, claires et orientées expérience utilisateur.";
        form.skills.value = ['HTML', 'CSS', 'JavaScript', 'React', 'UI / UX', 'Figma', 'Responsive Design', 'Git'].join('\n');
        form.jobTarget.value = 'developpeur web';
        form.location.value = 'Rueil-Malmaison (92500)';
        form.phone.value = '07.77.46.48.37';
        form.email.value = 'purvelours@proton.me';
        form.permit.value = 'Permis B';
        form.fontTheme.value = 'inter';
        form.layoutTheme.value = 'modern';
        form.colorTheme.value = 'indigo';
        form.designMood.value = 'startup';
    }

    if (preset === 'client') {
        form.headline.value = 'Conseillere relation client';
        form.summary.value = "Professionnelle de la relation client, de l'accompagnement et de l'organisation, avec une approche claire et orientée solutions.";
        form.skills.value = ['Relation client', 'Accompagnement', 'Analyse des besoins', 'Organisation', 'Gestion', 'Communication'].join('\n');
        form.jobTarget.value = 'relation client';
        form.location.value = 'Rueil-Malmaison (92500)';
        form.phone.value = '07.77.46.48.37';
        form.email.value = 'purvelours@proton.me';
        form.permit.value = 'Permis B et D';
        form.fontTheme.value = 'lato';
        form.layoutTheme.value = 'classic';
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
        form.layoutTheme.value = 'minimal';
        form.fontTheme.value = 'roboto';
        form.colorTheme.value = 'graphite';
        form.designMood.value = 'clean';
        form.textAlign.value = 'left';
        form.lineSpacing.value = 'normal';
    }

    updateCvPreview();
    setCvStatus('Preset applique');
};

const assistantAnswers = [
    {
        test: /cv|resume|curriculum/i,
        reply: "Je peux vous aider a creer un CV intelligent : remplissez le formulaire, choisissez un style, puis exportez le document en PDF.",
    },
    {
        test: /site|creation|plateforme/i,
        reply: "Je peux presenter la creation digitale, les interfaces modernes, les plateformes personnalisees et les solutions sur mesure adaptees a votre projet.",
    },
    {
        test: /automatisation|workflow|process/i,
        reply: "Je peux orienter vers des parcours automatises, des formulaires intelligents et des integrations digitales pour structurer un service.",
    },
    {
        test: /ia|ai|intelligence/i,
        reply: "Je peux suggérer des usages IA pour assister un utilisateur, organiser des informations ou enrichir une plateforme digitale.",
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

const getCvDraftStorageKey = () => 'cv-site-builder-draft-v1';

const setCvStatus = (message) => {
    if (cvStatus) {
        cvStatus.textContent = message;
    }
};

const saveCvDraft = () => {
    if (!cvForm) {
        return;
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());
    window.localStorage.setItem(getCvDraftStorageKey(), JSON.stringify(values));
    setCvStatus('CV sauvegarde localement');
};

const loadCvDraft = () => {
    if (!cvForm) {
        return;
    }

    const raw = window.localStorage.getItem(getCvDraftStorageKey());
    if (!raw) {
        return;
    }

    try {
        const values = JSON.parse(raw);
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
    } catch (error) {
        console.error(error);
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
        const line = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (line) {
            pageTexts.push(line);
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

    if (layoutThemeField && layoutThemeField.value === 'executive') {
        layoutThemeField.value = 'classic';
    }

    if (headlineField?.value.length > 64) {
        headlineField.value = headlineField.value.slice(0, 61).trim();
    }

    if (summaryField?.value.length > 240) {
        summaryField.value = `${summaryField.value.slice(0, 237).trim()}...`;
    }

    if (experienceField) {
        experienceField.value = splitLines(experienceField.value)
            .slice(0, 5)
            .map((line) => line.split(' • ').slice(0, 4).join(' • '))
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
        splitLines(values.skills || '').length +
        splitLines(values.education || '').length +
        splitLines(values.languages || '').length +
        splitLines(values.activities || '').length +
        Math.ceil(((values.summary || '').trim().length || 0) / 110);

    const isOverflow = totalLines > 22;

    if (isOverflow && currentPreviewMode === 'cv' && !isAutoFittingCv) {
        isAutoFittingCv = true;
        applyCompactCvLayout(true);
        updateCvPreview();
        isAutoFittingCv = false;
        return;
    }

    previewNodes.preview.classList.toggle('is-two-page', isOverflow);
    if (cvOverflowIndicator) {
        cvOverflowIndicator.textContent = isOverflow ? 'Depassement A4' : '1 page';
        cvOverflowIndicator.classList.toggle('is-overflow', isOverflow);
    }
    updatePreviewViewport();
};

const getZoomLevel = () => Number(cvZoomSelect?.value || 0.75);

const getVisiblePreviewPages = () =>
    [...(cvPreviewStage?.querySelectorAll('.cv-preview') || [])].filter((page) => !page.classList.contains('is-hidden-preview'));

const getPreviewPageCount = () => getVisiblePreviewPages().length || 1;

const setPreviewMode = (mode) => {
    currentPreviewMode = mode === 'letter' ? 'letter' : 'cv';

    if (previewNodes.preview) {
        const showCv = currentPreviewMode === 'cv';
        previewNodes.preview.classList.toggle('is-hidden-preview', !showCv);
        previewNodes.preview.setAttribute('aria-hidden', String(!showCv));
    }

    if (letterPagePreview) {
        const showLetter = currentPreviewMode === 'letter';
        letterPagePreview.classList.toggle('is-hidden-preview', !showLetter);
        letterPagePreview.setAttribute('aria-hidden', String(!showLetter));
    }

    if (coverLetterPanel) {
        coverLetterPanel.classList.toggle('is-hidden-panel', currentPreviewMode !== 'letter');
    }

    previewModeTabs.forEach((tab) => {
        const isActive = tab.dataset.previewMode === currentPreviewMode;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    currentPreviewPage = 1;
    updatePreviewViewport();
};

const updatePreviewPagination = () => {
    const totalPages = getPreviewPageCount();
    currentPreviewPage = Math.min(Math.max(currentPreviewPage, 1), totalPages);

    if (cvPageIndicator) {
        cvPageIndicator.textContent = `Page ${currentPreviewPage} / ${totalPages}`;
    }

    if (cvPrevPageButton) {
        cvPrevPageButton.disabled = currentPreviewPage <= 1;
    }

    if (cvNextPageButton) {
        cvNextPageButton.disabled = currentPreviewPage >= totalPages;
    }

    if (previewPageThumbnails) {
        previewPageThumbnails.innerHTML = '';
        for (let page = 1; page <= totalPages; page += 1) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `page-thumb${page === currentPreviewPage ? ' is-active' : ''}`;
            button.textContent = `${page}`;
            button.setAttribute('aria-label', `Voir la page ${page}`);
            button.addEventListener('click', () => scrollToPreviewPage(page));
            previewPageThumbnails.appendChild(button);
        }
    }
};

const updatePreviewViewport = () => {
    if (!previewNodes.preview || !cvPreviewStage) {
        return;
    }

    const zoom = getZoomLevel();
    const stagePages = getVisiblePreviewPages();
    const pageGap = stagePages.length > 1 ? (stagePages.length - 1) * 18 * 3.78 : 0;
    const totalHeight = stagePages.reduce((sum, page) => {
        page.style.transform = `scale(${zoom})`;
        return sum + page.scrollHeight * zoom;
    }, 0);

    cvPreviewStage.style.height = `${totalHeight + pageGap + 24}px`;
    updatePreviewPagination();
};

const fitCvToSinglePage = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }
    applyCompactCvLayout(false);
    updateCvPreview();
    setCvStatus('CV ajuste pour tenir sur 1 page');
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
    updatePreviewPagination();
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
    const cleanLine = line.replace(/\s{2,}/g, ' ').trim();
    const dateMatch = cleanLine.match(experienceDateRegex);
    const date = dateMatch ? `${dateMatch[1]} - ${dateMatch[2]}` : '';
    const withoutDate = dateMatch ? cleanLine.replace(dateMatch[0], '').replace(/\s+,/g, ',').trim() : cleanLine;
    const bulletParts = withoutDate
        .split(/\s+•\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
    const header = bulletParts.shift() || cleanLine;
    const headerParts = header.split(/\s+[–-]\s+/).map((part) => part.trim()).filter(Boolean);

    return {
        title: headerParts[0] || header,
        meta: headerParts.slice(1).join(' - '),
        date,
        bullets: bulletParts.length ? bulletParts : [],
    };
};

const renderExperienceList = (target, items) => {
    if (!target) {
        return;
    }

    target.innerHTML = '';
    target.classList.add('cv-experience-list');

    dedupeImportedItems(items.filter(Boolean)).forEach((item) => {
        const entry = parseExperienceEntry(item);
        const li = document.createElement('li');
        li.className = 'cv-experience-item';

        const head = document.createElement('div');
        head.className = 'cv-experience-head';

        const title = document.createElement('div');
        title.className = 'cv-experience-title';
        title.textContent = entry.title;
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

const updateCvPreview = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());

    previewNodes.fullName.textContent = values.fullName || 'Votre nom';
    if (previewNodes.meta) {
        previewNodes.meta.textContent = [values.location, values.phone, values.email].filter(Boolean).join(' | ');
    }
    previewNodes.headline.textContent = values.headline || 'Intitule du metier';
    if (previewNodes.summary) {
        previewNodes.summary.textContent = values.summary || '';
    }

    const skillItems = dedupeImportedItems(splitLines(values.skills || ''));
    const experienceItems = dedupeImportedItems(splitLines(values.experience || ''));
    const educationItems = dedupeImportedItems(splitLines(values.education || ''));
    const languageItems = dedupeImportedItems(splitLines(values.languages || ''));
    const activityItems = dedupeImportedItems(splitLines(values.activities || ''));

    renderExperienceList(previewNodes.experience, experienceItems);
    fillList(previewNodes.skills, skillItems);
    fillList(previewNodes.education, educationItems);
    fillList(previewNodes.languages, languageItems);
    fillList(previewNodes.activities, activityItems);

    if (previewSectionsRoot) {
        const sectionMap = {
            summary: Boolean((values.summary || '').trim()),
            skills: skillItems.length,
            experience: experienceItems.length,
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
        'template-modern',
        'template-executive',
        'template-minimal'
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

    const content = `${values.headline || ''} ${values.summary || ''} ${values.skills || ''} ${values.experience || ''}`.toLowerCase();
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
    const skills = splitLines(values.skills || '');
    const education = splitLines(values.education || '');
    const activities = splitLines(values.activities || '');
    const jobTarget = (values.jobTarget || '').toLowerCase();
    const headline = (values.headline || '').toLowerCase();
    const baseContent = `${values.headline || ''} ${values.summary || ''} ${values.skills || ''} ${values.experience || ''}`.toLowerCase();

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

const adaptCvToJobOffer = () => {
    if (!cvForm || !jobOfferField?.value.trim()) {
        setCvStatus('Ajoutez une offre d emploi pour adapter le CV');
        return;
    }

    const offer = jobOfferField.value.trim();
    const offerLower = offer.toLowerCase();
    const headlineField = cvForm.elements.headline;
    const summaryField = cvForm.elements.summary;
    const skillsField = cvForm.elements.skills;

    const injectedKeywords = Object.entries(offerKeywordMap)
        .filter(([key]) => offerLower.includes(key))
        .flatMap(([, keywords]) => keywords)
        .slice(0, 4);

    if (headlineField?.value && injectedKeywords.length) {
        headlineField.value = `${headlineField.value.split('|')[0].trim()} - ${injectedKeywords.slice(0, 2).join(' / ')}`;
    }

    if (summaryField?.value) {
        summaryField.value = `${summaryField.value.trim()} Profil ajuste selon l annonce pour mettre en avant les competences les plus pertinentes.`;
    }

    if (skillsField && injectedKeywords.length) {
        const existing = splitLines(skillsField.value);
        skillsField.value = [...new Set([...injectedKeywords.map(toTitleCase), ...existing])].slice(0, 12).join('\n');
    }

    updateCvPreview();
    setCvStatus('CV adapte a l offre');
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
        const lines = splitLines(textarea.value).map(toTitleCase);
        textarea.value = lines.join('\n');
    });

    const headlineField = cvForm.elements.headline;

    if (headlineField && headlineField.value) {
        headlineField.value = toTitleCase(headlineField.value.trim());
    }

    updateCvPreview();

    setCvStatus('Sections auto-organisees');
};

const improveCv = () => {
    if (!cvForm) {
        return;
    }

    const summaryField = cvForm.elements.summary;
    const headlineField = cvForm.elements.headline;
    const targetField = cvForm.elements.jobTarget;
    const experienceField = cvForm.elements.experience;

    if (headlineField?.value && targetField?.value) {
        headlineField.value = `${toTitleCase(headlineField.value.trim())} | ${toTitleCase(targetField.value)}`;
    }

    if (summaryField?.value) {
        summaryField.value = `Profil ${targetField?.value || 'professionnel'} oriente resultats. ${summaryField.value.trim()} Je cree des interfaces claires, performantes et adaptees aux attentes des recruteurs et utilisateurs.`;
    }

    if (experienceField?.value) {
        experienceField.value = splitLines(experienceField.value)
            .map((line) => `${toTitleCase(line)} avec une approche structuree et orientee impact`)
            .join('\n');
    }

    updateCvPreview();

    setCvStatus('CV ameliore pour recruteurs');
};

const normalizeForMatch = (value) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const cleanImportedSectionLine = (line) =>
    line
        .replace(/^[•\-\u2022]+\s*/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

const looksLikeSectionHeading = (line) => {
    const normalized = normalizeForMatch(line);

    if (!normalized || normalized.length > 40) {
        return false;
    }

    return (
        normalized.includes('competences') ||
        normalized.includes('experience') ||
        normalized.includes('formations') ||
        normalized.includes('certifications') ||
        normalized.includes('profil') ||
        normalized.includes('resume') ||
        normalized.includes('objectif')
    );
};

const getSectionKey = (line) => {
    const normalized = normalizeForMatch(line);

    if (normalized.includes('competences')) {
        return 'skills';
    }

    if (normalized.includes('experience')) {
        return 'experience';
    }

    if (normalized.includes('formations') || normalized.includes('certifications')) {
        return 'education';
    }

    if (normalized.includes('profil') || normalized.includes('resume') || normalized.includes('objectif')) {
        return 'summary';
    }

    return null;
};

const preprocessImportedCvText = (text) =>
    normalizeImportedText(text)
        .replace(
            /\b(COMP[ÉE]TENCES(?:\s+CL[EÉ]S)?|EXP[ÉE]RIENCES(?:\s+PROFESSIONNELLES)?|FORMATIONS(?:\s*&\s*CERTIFICATIONS)?|CERTIFICATIONS|PROFIL|R[ÉE]SUM[ÉE]|OBJECTIF)\b/gi,
            '\n$1\n'
        )
        .replace(/((?:janv(?:ier)?|f[ée]vr(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|ao[uû]t|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|d[ée]c(?:embre)?|\d{4})\s*[–-]\s*(?:janv(?:ier)?|f[ée]vr(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|ao[uû]t|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|d[ée]c(?:embre)?|\d{4}|aujourd'hui|present|pr[ée]sent))/gi, '\n$1\n')
        .replace(/\s+([•\-])\s+/g, '\n$1 ')
        .replace(/\s{2,}/g, ' ')
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
    const preSkills = joinedText.split(/\bCOMP[ÉE]TENCES(?:\s+CL[EÉ]S)?\b/i)[0] || joinedText;
    const compact = stripContactFragments(preSkills, [nameLine, locationLine, phoneLine, emailLine, permitLine])
        .replace(/\s*\|\s*/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

    const splitMatch = compact.match(/^(.*?)(?=\b(rigoureuse|rigoureux|autonome|attachee|attach[eé]|motivee|motiv[eé]e|professionnelle|professionnel|titulaire|exp[ée]rience|habitu[ée]e|je)\b)([\s\S]*)/i);
    const extractedHeadline = splitMatch?.[1]?.trim() || headlineLine || '';
    const extractedSummary = splitMatch ? compact.slice(extractedHeadline.length).trim() : getSummaryFallback(cleanLines, extractedHeadline || headlineLine);

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
    dedupeImportedItems(
        items
            .map((item) => item.replace(/^[-•]\s*/, '').replace(/\s{2,}/g, ' ').trim())
            .filter(
                (item) =>
                    item &&
                    item.length < 180 &&
                    !looksLikeSectionHeading(item) &&
                    !isLikelyExperienceHeader(item) &&
                    !/\b(?:responsable|conseill[eè]re|machiniste|receveur|service premium|gestion d[’']equipe)\b/i.test(item)
            )
    );

const groupImportedExperiences = (items) => {
    const groups = [];
    let current = '';

    items.forEach((rawItem) => {
        const item = rawItem.replace(/^[-•]\s*/, '').replace(/\s{2,}/g, ' ').trim();

        if (!item || looksLikeSectionHeading(item) || /\b(?:comp[ée]tences?|formations?|certifications?)\b/i.test(item)) {
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

        current += ` • ${item}`;
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

const parseImportedCv = (text) => {
    if (!cvForm || !text) {
        return;
    }

    const normalizedText = preprocessImportedCvText(text);
    const lines = splitLines(normalizedText);
    const cleanLines = lines.filter((line) => !/^%PDF-|^\/(Title|Parent|Dest|Next|Prev)\b/i.test(line));
    const joinedText = cleanLines.join('\n');
    const sectionStops = [
        /\bCOMP[ÉE]TENCES(?:\s+CL[EÉ]S)?\b/i,
        /\bEXP[ÉE]RIENCES(?:\s+PROFESSIONNELLES)?\b/i,
        /\bFORMATIONS(?:\s*&\s*CERTIFICATIONS)?\b/i,
        /\bCERTIFICATIONS\b/i,
        /\bPROFIL\b/i,
        /\bR[ÉE]SUM[ÉE]\b/i,
        /\bOBJECTIF\b/i,
    ];

    cvForm.elements.summary.value = '';
    cvForm.elements.skills.value = '';
    cvForm.elements.experience.value = '';
    cvForm.elements.education.value = '';
    cvForm.elements.headline.value = '';
    cvForm.elements.permit.value = '';
    if (cvForm.elements.languages) {
        cvForm.elements.languages.value = '';
    }
    if (cvForm.elements.activities) {
        cvForm.elements.activities.value = '';
    }

    const nameLine =
        cleanLines.find((line) => /^[A-ZÀ-ÖØ-Ý' -]{6,}$/.test(line) && line.length < 40) ||
        cleanLines.find((line) => /^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(line) && line.length < 40) ||
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
    const permitValue = extractPermitValue(permitLine || joinedText);
    if (permitValue) {
        cvForm.elements.permit.value = permitValue;
    }

    const locationLine = cleanLines.find((line) => /\(\d{5}\)|france|malmaison|paris|nanterre|roissy/i.test(line));
    if (locationLine) {
        const extractedLocation = extractLocationValue(locationLine) || locationLine;
        cvForm.elements.location.value = extractedLocation.replace(cvForm.elements.fullName.value || '', '').trim();
    }

    const headlineLine =
        cleanLines.find((line) =>
            /developp|front|emploi|marketing|relation client|designer|ux|ui|conseill|responsable|charg[eé]e|conductr|machiniste|receveur|transport/i.test(line) &&
            line.length < 120 &&
            !/@|\d{2}\.\d{2}\.\d{2}/.test(line)
        ) || '';

    if (headlineLine) {
        cvForm.elements.headline.value = headlineLine;
    }

    const summarySection = extractSectionContent(
        joinedText,
        [
            /\b(?:PROFIL|R[ÉE]SUM[ÉE]|OBJECTIF)\b([\s\S]+)$/i,
        ],
        sectionStops
    );
    const skillsSection = extractSectionContent(
        joinedText,
        [
            /\bCOMP[ÉE]TENCES(?:\s+CL[EÉ]S)?\b([\s\S]+)$/i,
        ],
        sectionStops
    );
    const experienceSection = extractSectionContent(
        joinedText,
        [
            /\bEXP[ÉE]RIENCES(?:\s+PROFESSIONNELLES)?\b([\s\S]+)$/i,
        ],
        sectionStops
    );
    const educationSection = extractSectionContent(
        joinedText,
        [
            /\bFORMATIONS(?:\s*&\s*CERTIFICATIONS)?\b([\s\S]+)$/i,
            /\bCERTIFICATIONS\b([\s\S]+)$/i,
        ],
        sectionStops
    );

    const fallbackSections = { summary: [], skills: [], experience: [], education: [] };
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

    const summaryValue = (summarySection || extractedProfile.summary || getSummaryFallback(cleanLines, headlineLine))
        .replace(/\bCOMP[ÉE]TENCES(?:\s+CL[EÉ]S)?\b[\s\S]*$/i, '')
        .replace(/\bEXP[ÉE]RIENCES(?:\s+PROFESSIONNELLES)?\b[\s\S]*$/i, '')
        .replace(/\bFORMATIONS(?:\s*&\s*CERTIFICATIONS)?\b[\s\S]*$/i, '')
        .replace(/\bACTIVIT[ÉE]S?(?:\s*&\s*INT[ÉE]R[ÊE]TS)?\b[\s\S]*$/i, '')
        .replace(/\n+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const skillsItems = normalizeSkillItems(splitImportedItems(skillsSection || fallbackSections.skills.join('\n')));
    const experienceItems = groupImportedExperiences(splitImportedItems(experienceSection || fallbackSections.experience.join('\n')));
    const educationItems = normalizeEducationItems(splitImportedItems(educationSection || fallbackSections.education.join('\n')));

    cvForm.elements.headline.value = extractedProfile.headline || headlineLine || cvForm.elements.headline.value;

    if (summaryValue) {
        cvForm.elements.summary.value = summaryValue;
    }

    if (skillsItems.length) {
        cvForm.elements.skills.value = skillsItems.slice(0, 12).join('\n');
    }

    if (experienceItems.length) {
        cvForm.elements.experience.value = experienceItems.slice(0, 8).join('\n');
    }

    if (educationItems.length) {
        cvForm.elements.education.value = educationItems.slice(0, 8).join('\n');
    }

    const languageLines = cleanLines.filter((line) => /\b(francais|anglais|espagnol|arabe|italien|allemand)\b/i.test(line));
    if (languageLines.length && cvForm.elements.languages) {
        cvForm.elements.languages.value = dedupeImportedItems(languageLines).slice(0, 6).join('\n');
    }

    updateCvPreview();
    setPreviewMode('cv');

    setCvStatus('CV importe et analyse');
};

const exportWord = () => {
    const activePreview = currentPreviewMode === 'letter' ? letterPagePreview : previewNodes.preview;
    const clone = activePreview?.cloneNode(true);
    clone?.querySelectorAll('.cv-section-actions').forEach((node) => node.remove());
    const content = clone?.innerText || activePreview?.innerText || '';
    downloadFile(currentPreviewMode === 'letter' ? 'lettre-motivation.doc' : 'cv-intelligent.doc', content, 'application/msword');
};

const exportPdf = async () => {
    const activePreview = currentPreviewMode === 'letter' ? letterPagePreview : previewNodes.preview;

    if (!activePreview || !window.html2pdf) {
        setCvStatus('Export PDF indisponible pour le moment');
        return;
    }

    setCvStatus('Generation du PDF...');

    const clone = activePreview.cloneNode(true);
    clone.querySelectorAll('.cv-section-actions').forEach((node) => node.remove());
    clone.style.transform = 'none';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-99999px';
    wrapper.style.top = '0';
    wrapper.style.background = '#ffffff';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
        await window.html2pdf()
            .set({
                margin: 0,
                filename: currentPreviewMode === 'letter' ? 'lettre-motivation.pdf' : 'cv-intelligent.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] },
            })
            .from(clone)
            .save();

        setCvStatus('PDF telecharge');
    } catch (error) {
        console.error(error);
        setCvStatus('Echec de generation du PDF');
    } finally {
        wrapper.remove();
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

const getAssistantReply = (message) => {
    const found = assistantAnswers.find((entry) => entry.test.test(message));

    if (found) {
        return found.reply;
    }

    return "Je peux vous aider a clarifier votre besoin, presenter les services du site, ouvrir le module CV intelligent ou suggerer une direction de projet.";
};

window.addEventListener('load', () => {
    document.body.classList.remove('is-preload');
    document.body.classList.add('is-ready');
    loadCvDraft();
    updateCvPreview();
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
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = (formData.get('name') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const message = (formData.get('message') || '').toString().trim();

        const subject = encodeURIComponent(`Projet web - ${name || 'Prise de contact'}`);
        const body = encodeURIComponent(
            [
                `Nom : ${name || '-'}`,
                `Email : ${email || '-'}`,
                '',
                'Message :',
                message || '-',
            ].join('\n')
        );

        window.location.href = `mailto:purvelours@proton.me?subject=${subject}&body=${body}`;
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

if (cvForm) {
    cvForm.addEventListener('input', updateCvPreview);
    cvForm.addEventListener('change', updateCvPreview);
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

const syncPreviewEditableNode = (node) => {
    if (!cvForm) {
        return;
    }

    const target = node.getAttribute('data-edit-target');
    const field = target ? cvForm.elements[target] : null;

    if (!field) {
        return;
    }

    if (target === 'fullName' || target === 'headline') {
        field.value = node.textContent.trim();
    } else if (target === 'summary') {
        field.value = node.textContent.trim();
    } else if (target === 'permit') {
        field.value = node.textContent.trim();
    } else if (target === 'location') {
        const parts = node.textContent
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
        field.value = items.join('\n');
    }

    updateCvPreview();
    setCvStatus('Modification appliquee');
};

document.querySelectorAll('[contenteditable="true"]').forEach((node) => {
    node.addEventListener('focus', () => {
        setCvStatus('Edition directe active');
    });
    node.addEventListener('blur', () => {
        syncPreviewEditableNode(node);
    });
    node.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            node.blur();
        }
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
    cvImproveButton.addEventListener('click', improveCv);
}

if (cvFitPageButton) {
    cvFitPageButton.addEventListener('click', fitCvToSinglePage);
}

if (cvAiImproveButton) {
    cvAiImproveButton.addEventListener('click', () => {
        improveCv();
        openAssistant('Ameliore mon CV');
        appendAssistantMessage('Ameliore mon CV', 'user');
        appendAssistantMessage("J'ai reformule le profil, clarifie le titre et renforce la structure pour une lecture recruteur plus nette.", 'bot');
    });
}

if (cvAnalyzeButton) {
    cvAnalyzeButton.addEventListener('click', () => {
        updateCvPreview();
        setCvStatus('Analyse ATS actualisee');
    });
}

if (cvMatchJobButton) {
    cvMatchJobButton.addEventListener('click', adaptCvToJobOffer);
}

if (cvPrintButton) {
    cvPrintButton.addEventListener('click', () => {
        document.body.classList.add('print-cv');
        window.print();
        window.setTimeout(() => document.body.classList.remove('print-cv'), 300);
    });
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
            await navigator.clipboard.writeText(shareUrl);
            setCvStatus('Lien copie');
        } catch (error) {
            console.error(error);
            setCvStatus('Impossible de copier le lien');
        }
    });
}

if (cvEmailButton) {
    cvEmailButton.addEventListener('click', () => {
        const subject = encodeURIComponent('CV intelligent - candidature');
        const body = encodeURIComponent(previewNodes.preview?.innerText || '');
        window.location.href = `mailto:purvelours@proton.me?subject=${subject}&body=${body}`;
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
    letterEmailButton.addEventListener('click', () => {
        const subject = encodeURIComponent(letterSubject?.textContent || 'Candidature');
        const body = encodeURIComponent(letterBody?.textContent || '');
        window.location.href = `mailto:purvelours@proton.me?subject=${subject}&body=${body}`;
    });
}

if (cvZoomSelect) {
    cvZoomSelect.addEventListener('change', () => {
        updatePreviewViewport();
        scrollToPreviewPage(currentPreviewPage);
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

if (cvPrevPageButton) {
    cvPrevPageButton.addEventListener('click', () => {
        scrollToPreviewPage(currentPreviewPage - 1);
    });
}

if (cvNextPageButton) {
    cvNextPageButton.addEventListener('click', () => {
        scrollToPreviewPage(currentPreviewPage + 1);
    });
}

if (cvPreviewViewport) {
    cvPreviewViewport.addEventListener('scroll', () => {
        if (!cvPreviewStage) {
            return;
        }

        const pages = getVisiblePreviewPages();
        let nearestPage = 1;
        let nearestDistance = Number.POSITIVE_INFINITY;

        pages.forEach((page, index) => {
            const distance = Math.abs(page.offsetTop - cvPreviewViewport.scrollTop);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPage = index + 1;
            }
        });

        currentPreviewPage = nearestPage;
        updatePreviewPagination();
    });
}

setPreviewMode('cv');

if (cvImportInput) {
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
