const navLinks = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main section[id]')];
const contactForm = document.querySelector('#contact-form');
const cards = document.querySelectorAll('.card');
const revealSections = document.querySelectorAll('.reveal-section');
const cvForm = document.querySelector('#cv-form');
const cvPrintButton = document.querySelector('#cv-print');
const cvAutofillButton = document.querySelector('#cv-autofill');
const cvImproveButton = document.querySelector('#cv-improve');
const cvImportInput = document.querySelector('#cv-import');
const cvExportWordButton = document.querySelector('#cv-export-word');
const cvExportWebButton = document.querySelector('#cv-export-web');
const cvEmailButton = document.querySelector('#cv-email');
const cvStatus = document.querySelector('#cv-status');
const atsScoreValue = document.querySelector('#ats-score-value');
const cvAnalysisList = document.querySelector('#cv-analysis-list');
const cvSuggestionsList = document.querySelector('#cv-suggestions-list');
const interactiveCards = document.querySelectorAll('.interactive-card');
const assistantToggle = document.querySelector('#assistant-toggle');
const assistantClose = document.querySelector('#assistant-close');
const assistantChat = document.querySelector('#assistant-chat');
const assistantForm = document.querySelector('#assistant-form');
const assistantInput = document.querySelector('#assistant-input');
const assistantMessages = document.querySelector('#assistant-messages');
const suggestionChips = document.querySelectorAll('.suggestion-chip');
const expandableCards = document.querySelectorAll('[data-expandable]');
const PDFJS_MODULE_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs';

let pdfjsLoader;

const previewNodes = {
    fullName: document.querySelector('#preview-name'),
    headline: document.querySelector('#preview-headline'),
    summary: document.querySelector('#preview-summary'),
    experience: document.querySelector('#preview-experience'),
    skills: document.querySelector('#preview-skills'),
    education: document.querySelector('#preview-education'),
    preview: document.querySelector('#cv-preview'),
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

const setCvStatus = (message) => {
    if (cvStatus) {
        cvStatus.textContent = message;
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
        Math.ceil(((values.summary || '').trim().length || 0) / 110);

    previewNodes.preview.classList.toggle('is-two-page', totalLines > 20);
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

    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        target.appendChild(li);
    });
};

const updateCvPreview = () => {
    if (!cvForm || !previewNodes.preview) {
        return;
    }

    const formData = new FormData(cvForm);
    const values = Object.fromEntries(formData.entries());

    previewNodes.fullName.textContent = values.fullName || 'Votre nom';
    previewNodes.headline.textContent = values.headline || 'Intitule du profil';
    previewNodes.summary.textContent = values.summary || 'Resume du profil';

    fillList(previewNodes.experience, splitLines(values.experience || ''));
    fillList(previewNodes.skills, splitLines(values.skills || ''));
    fillList(previewNodes.education, splitLines(values.education || ''));

    previewNodes.preview.classList.remove('theme-executive', 'theme-creative', 'theme-compact', 'theme-ats', 'theme-web');
    previewNodes.preview.classList.add(`theme-${cvModeThemeMap[values.cvMode] || 'executive'}`);

    previewNodes.preview.classList.remove('font-manrope', 'font-serif', 'font-mono');
    previewNodes.preview.classList.add(`font-${values.fontTheme || 'manrope'}`);

    previewNodes.preview.classList.remove(
        'size-normal',
        'size-large',
        'size-compact',
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
        'mood-luxury'
    );
    previewNodes.preview.classList.add(`size-${values.fontSize || 'normal'}`);
    previewNodes.preview.classList.add(`palette-${values.colorTheme || 'indigo'}`);
    previewNodes.preview.classList.add(`mood-${values.designMood || 'clean'}`);

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
};

const analyzeCv = (values) => {
    const summary = (values.summary || '').trim();
    const experiences = splitLines(values.experience || '');
    const skills = splitLines(values.skills || '');
    const education = splitLines(values.education || '');
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

const parseImportedCv = (text) => {
    if (!cvForm || !text) {
        return;
    }

    const normalizedText = normalizeImportedText(text);
    const lines = splitLines(normalizedText);
    const blocks = normalizedText.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
    const cleanLines = lines.filter((line) => !/^%PDF-|^\/(Title|Parent|Dest|Next|Prev)\b/i.test(line));

    const nameLine =
        cleanLines.find((line) => /^[A-ZÀ-ÖØ-Ý' -]{6,}$/.test(line) && line.length < 40) ||
        cleanLines.find((line) => /^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(line) && line.length < 40) ||
        '';

    if (nameLine) {
        cvForm.elements.fullName.value = toTitleCase(nameLine.toLowerCase());
    }

    const headlineLine =
        cleanLines.find((line) => /developp|front|emploi|marketing|relation client|designer|ux|ui/i.test(line) && line.length < 120) ||
        '';

    if (headlineLine) {
        cvForm.elements.headline.value = headlineLine;
    }

    const summaryBlock =
        blocks.find((block) => /objectif|profil|resume|accompagnement|experience|emploi|interface|utilisateur/i.test(block) && block.length < 600) ||
        blocks.find((block) => block.length > 80 && block.length < 600) ||
        '';

    if (summaryBlock) {
        cvForm.elements.summary.value = summaryBlock.replace(/\n/g, ' ').trim();
    }

    const skillLines = cleanLines.filter((line) =>
        /html|css|javascript|react|ux|figma|git|web|communication|analyse|organisation|client/i.test(line)
    );
    if (skillLines.length) {
        cvForm.elements.skills.value = skillLines.slice(0, 12).join('\n');
    }

    const experienceLines = cleanLines.filter((line) =>
        /experience|mission|projet|developp|interface|site|conseil|accompagnement|relation client|gestion/i.test(line)
    );
    if (experienceLines.length) {
        cvForm.elements.experience.value = experienceLines.slice(0, 10).join('\n');
    }

    const educationLines = cleanLines.filter((line) =>
        /formation|ecole|certif|diplome|apprentissage|qualification|certification/i.test(line)
    );
    if (educationLines.length) {
        cvForm.elements.education.value = educationLines.slice(0, 10).join('\n');
    }

    updateCvPreview();

    setCvStatus('CV importe et analyse');
};

const exportWord = () => {
    const content = previewNodes.preview?.innerText || '';
    downloadFile('cv-intelligent.doc', content, 'application/msword');
};

const exportWebVersion = () => {
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
  <article class="cv">${previewNodes.preview?.innerHTML || ''}</article>
</body>
</html>`;
    downloadFile('cv-web.html', html, 'text/html');
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

if (cvAutofillButton) {
    cvAutofillButton.addEventListener('click', autoOrganizeCv);
}

if (cvImproveButton) {
    cvImproveButton.addEventListener('click', improveCv);
}

if (cvPrintButton) {
    cvPrintButton.addEventListener('click', () => {
        document.body.classList.add('print-cv');
        window.print();
        window.setTimeout(() => document.body.classList.remove('print-cv'), 300);
    });
}

if (cvExportWordButton) {
    cvExportWordButton.addEventListener('click', exportWord);
}

if (cvExportWebButton) {
    cvExportWebButton.addEventListener('click', exportWebVersion);
}

if (cvEmailButton) {
    cvEmailButton.addEventListener('click', () => {
        const subject = encodeURIComponent('CV intelligent - candidature');
        const body = encodeURIComponent(previewNodes.preview?.innerText || '');
        window.location.href = `mailto:purvelours@proton.me?subject=${subject}&body=${body}`;
    });
}

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
