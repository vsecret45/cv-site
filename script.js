const navLinks = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main section[id]')];
const contactForm = document.querySelector('#contact-form');

window.addEventListener('load', () => {
    document.body.classList.remove('is-preload');
    document.body.classList.add('is-ready');
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
