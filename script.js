const navLinks = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main section[id]')];
const contactForm = document.querySelector('#contact-form');
const cards = document.querySelectorAll('.card');
const cvForm = document.querySelector('#cv-form');
const cvPrintButton = document.querySelector('#cv-print');
const cvAutofillButton = document.querySelector('#cv-autofill');
const cvStatus = document.querySelector('#cv-status');
const interactiveCards = document.querySelectorAll('.interactive-card');
const assistantToggle = document.querySelector('#assistant-toggle');
const assistantClose = document.querySelector('#assistant-close');
const assistantChat = document.querySelector('#assistant-chat');
const assistantForm = document.querySelector('#assistant-form');
const assistantInput = document.querySelector('#assistant-input');
const assistantMessages = document.querySelector('#assistant-messages');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

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

    previewNodes.preview.classList.remove('theme-executive', 'theme-creative', 'theme-compact');
    previewNodes.preview.classList.add(`theme-${values.layoutTheme || 'executive'}`);

    previewNodes.preview.classList.remove('font-manrope', 'font-serif', 'font-mono');
    previewNodes.preview.classList.add(`font-${values.fontTheme || 'manrope'}`);

    if (cvStatus) {
        cvStatus.textContent = 'CV synchronise';
    }
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

    if (cvStatus) {
        cvStatus.textContent = 'Sections auto-organisees';
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

if (cvForm) {
    cvForm.addEventListener('input', updateCvPreview);
    cvForm.addEventListener('change', updateCvPreview);
}

if (cvAutofillButton) {
    cvAutofillButton.addEventListener('click', autoOrganizeCv);
}

if (cvPrintButton) {
    cvPrintButton.addEventListener('click', () => {
        document.body.classList.add('print-cv');
        window.print();
        window.setTimeout(() => document.body.classList.remove('print-cv'), 300);
    });
}

interactiveCards.forEach((card) => {
    card.addEventListener('click', () => {
        const target = card.dataset.target;
        const section = target ? document.querySelector(target) : null;

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (target === '#assistant-ia') {
            openAssistant();
        }
    });
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
