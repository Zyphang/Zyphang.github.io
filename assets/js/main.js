/* ════════════════════════════════════════════════════════════════════
   CYBERFOLIO — Logique principale
   ════════════════════════════════════════════════════════════════════

   Ce que fait ce fichier :
   1. Lit window.portfolioData (depuis data.js) et le pousse dans le HTML
   2. Génère dynamiquement les cartes : skills, projets, certifs, timeline
   3. Anti-scraping : assemble l'email côté client uniquement
   4. Bouton "copier l'email" + lien mailto: dynamique
   5. Toggle du menu mobile (hamburger)
   6. Animations d'apparition au scroll (IntersectionObserver)
   7. Met à jour l'année du footer automatiquement

   Aucune dépendance externe — JavaScript natif uniquement.
   ════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // Garde-fou : si data.js n'a pas chargé, on s'arrête proprement
    if (!window.portfolioData) {
        console.error('[cyberfolio] portfolioData manquant. Vérifie que data.js est chargé avant main.js.');
        return;
    }

    const data = window.portfolioData;

    /* ──────────────────────────────────────────────────────────────────
       Helpers DOM
       ────────────────────────────────────────────────────────────────── */
    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    /** Crée un élément HTML avec attributs et enfants en une ligne. */
    function el(tag, attrs = {}, children = []) {
        const node = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'class') node.className = value;
            else if (key === 'html') node.innerHTML = value;
            else if (key === 'text') node.textContent = value;
            else if (key.startsWith('data-')) node.setAttribute(key, value);
            else node.setAttribute(key, value);
        }
        (Array.isArray(children) ? children : [children])
            .filter(Boolean)
            .forEach(c => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
        return node;
    }


    /* ──────────────────────────────────────────────────────────────────
       1. INJECTION DES TEXTES SIMPLES (data-text-id)
       ────────────────────────────────────────────────────────────────── */
    function injectTexts() {
        const map = {
            'hero-name':        data.identity.fullName,
            'hero-pseudo':      data.identity.pseudo,
            'hero-baseline':    data.identity.baseline,
            'contact-intro':    data.identity.contactIntro
        };
        for (const [id, value] of Object.entries(map)) {
            const target = $(`[data-text-id="${id}"]`);
            if (target) target.textContent = value;
        }
        // Description : autorise du HTML (pour les <strong>) — c'est notre
        // propre contenu, donc pas de risque XSS
        const desc = $('[data-text-id="hero-description"]');
        if (desc) desc.innerHTML = data.identity.description;
    }


    /* ──────────────────────────────────────────────────────────────────
       2. CTA HERO : génère les boutons CV / GitHub / LinkedIn
       ────────────────────────────────────────────────────────────────── */
    function buildHeroCTA() {
        const container = $('#hero-cta');
        if (!container) return;

        // Icônes (SVG inline — Lucide-style)
        const icons = {
            download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
            github:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
            linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
        };

        // Bouton CV (uniquement si activé)
        if (data.cta.cv.enabled) {
            container.appendChild(el('a', {
                class: 'btn btn-primary',
                href: data.cta.cv.href,
                download: '',
                'aria-label': 'Télécharger le CV en PDF',
                html: icons.download + '<span>' + data.cta.cv.label + '</span>'
            }));
        }
        // GitHub
        if (data.cta.github.enabled) {
            container.appendChild(el('a', {
                class: data.cta.cv.enabled ? 'btn btn-secondary' : 'btn btn-primary',
                href: data.contact.githubUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': 'Voir mon profil GitHub',
                html: icons.github + '<span>' + data.cta.github.label + '</span>'
            }));
        }
        // LinkedIn
        if (data.cta.linkedin.enabled) {
            container.appendChild(el('a', {
                class: 'btn btn-secondary',
                href: data.contact.linkedinUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': 'Voir mon profil LinkedIn',
                html: icons.linkedin + '<span>' + data.cta.linkedin.label + '</span>'
            }));
        }
    }


    /* ──────────────────────────────────────────────────────────────────
       3. SECTION COMPÉTENCES
       ────────────────────────────────────────────────────────────────── */
    function buildSkills() {
        const container = $('#skills-grid');
        if (!container) return;

        data.skills.forEach(group => {
            const card = el('div', { class: 'skill-card fade-in' });

            const header = el('div', { class: 'skill-card-header' }, [
                el('span', { class: 'skill-card-dot', 'aria-hidden': 'true' }),
                el('span', { class: 'skill-card-title', text: group.category })
            ]);

            const list = el('div', { class: 'skill-list' });
            group.items.forEach(item => {
                list.appendChild(el('div', { class: 'skill-row' }, [
                    el('span', { class: 'skill-name', text: item.name }),
                    el('span', { class: 'skill-level', text: item.level })
                ]));
            });

            card.appendChild(header);
            card.appendChild(list);
            container.appendChild(card);
        });
    }


    /* ──────────────────────────────────────────────────────────────────
       4. SECTION PROJETS
       ────────────────────────────────────────────────────────────────── */
    function buildProjects() {
        const container = $('#projects-list');
        if (!container) return;

        data.projects.forEach(project => {
            // Si une URL est fournie, la carte est un <a>, sinon un <article>
            const tag = project.url ? 'a' : 'article';
            const attrs = { class: 'project-card fade-in' };
            if (project.url) {
                attrs.href = project.url;
                attrs.target = '_blank';
                attrs.rel = 'noopener noreferrer';
                attrs['aria-label'] = `Projet : ${project.title} (ouvre dans un nouvel onglet)`;
            }
            const card = el(tag, attrs);

            const header = el('div', { class: 'project-header' }, [
                el('h3', { class: 'project-title', text: project.title }),
                el('span', { class: 'project-year', text: project.year })
            ]);

            const desc = el('p', { class: 'project-description', text: project.description });

            const tags = el('div', { class: 'project-tags' });
            project.tags.forEach(t => {
                tags.appendChild(el('span', { class: 'project-tag', text: t }));
            });

            card.appendChild(header);
            card.appendChild(desc);
            card.appendChild(tags);
            container.appendChild(card);
        });
    }


    /* ──────────────────────────────────────────────────────────────────
       5. SECTION CERTIFICATIONS
       ────────────────────────────────────────────────────────────────── */
    function buildCertifications() {
        const container = $('#certs-grid');
        if (!container) return;

        data.certifications.forEach(cert => {
            const isObtained = cert.status === 'obtained';
            const card = el('div', {
                class: `cert-card fade-in ${isObtained ? 'is-obtained' : 'is-pending'}`
            });

            card.appendChild(el('div', {
                class: `cert-status ${isObtained ? 'is-obtained' : 'is-pending'}`,
                text: isObtained ? '[ OBTENUE ]' : '[ EN COURS / À VENIR ]'
            }));
            card.appendChild(el('div', { class: 'cert-title', text: cert.title }));
            card.appendChild(el('div', { class: 'cert-meta', text: cert.meta }));

            container.appendChild(card);
        });
    }


    /* ──────────────────────────────────────────────────────────────────
       6. TIMELINE
       ────────────────────────────────────────────────────────────────── */
    function buildTimeline() {
        const container = $('#timeline');
        if (!container) return;

        data.timeline.forEach(item => {
            const li = el('li', {
                class: `timeline-item fade-in ${item.state === 'past' ? 'is-past' : ''}`
            });

            const header = el('div', { class: 'timeline-header' }, [
                el('h3', { class: 'timeline-title', text: item.title }),
                el('span', { class: 'timeline-period', text: item.period })
            ]);

            const desc = el('p', { class: 'timeline-description', text: item.description });

            li.appendChild(header);
            li.appendChild(desc);
            container.appendChild(li);
        });
    }


    /* ──────────────────────────────────────────────────────────────────
       7. CONTACT — assemblage de l'email + actions
       OPSEC : l'email n'est jamais présent en clair dans le HTML statique.
       ────────────────────────────────────────────────────────────────── */
    function setupContact() {
        const email = `${data.contact.emailLocal}@${data.contact.emailDomain}`;
        const display = $('#email-display');
        const copyBtn = $('#email-copy');
        if (display) display.textContent = email;

        // Bouton "copier"
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(email);
                    copyBtn.textContent = '✓ copié';
                    copyBtn.classList.add('is-copied');
                    setTimeout(() => {
                        copyBtn.textContent = 'copier';
                        copyBtn.classList.remove('is-copied');
                    }, 2200);
                } catch (e) {
                    // Fallback : ouvre le client mail si le presse-papier est bloqué
                    window.location.href = 'mailto:' + email;
                }
            });
        }

        // Liens LinkedIn / GitHub
        const linkedin = $('#link-linkedin');
        if (linkedin) {
            linkedin.href = data.contact.linkedinUrl;
            linkedin.textContent = data.contact.linkedinLabel;
        }
        const github = $('#link-github');
        if (github) {
            github.href = data.contact.githubUrl;
            github.textContent = data.contact.githubLabel;
        }
    }


    /* ──────────────────────────────────────────────────────────────────
       8. MENU MOBILE (hamburger)
       ────────────────────────────────────────────────────────────────── */
    function setupMobileMenu() {
        const toggle = $('.nav-toggle');
        const menu = $('#nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        // Ferme le menu après clic sur un lien
        $$('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* ──────────────────────────────────────────────────────────────────
       9. ANIMATIONS D'APPARITION (IntersectionObserver)
       Ne s'active que sur les éléments .fade-in
       Désactivée si l'utilisateur préfère "reduced motion" (déjà géré en CSS)
       ────────────────────────────────────────────────────────────────── */
    function setupScrollReveal() {
        const elements = $$('.fade-in');
        if (!elements.length || !('IntersectionObserver' in window)) {
            // Pas de support : on affiche tout immédiatement
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        elements.forEach(el => observer.observe(el));
    }


    /* ──────────────────────────────────────────────────────────────────
       10. ANNÉE DU FOOTER
       ────────────────────────────────────────────────────────────────── */
    function setFooterYear() {
        const span = $('#footer-year');
        if (span) span.textContent = String(new Date().getFullYear());
    }


    /* ──────────────────────────────────────────────────────────────────
       INITIALISATION
       ────────────────────────────────────────────────────────────────── */
    function init() {
        injectTexts();
        buildHeroCTA();
        buildSkills();
        buildProjects();
        buildCertifications();
        buildTimeline();
        setupContact();
        setupMobileMenu();
        setupScrollReveal();
        setFooterYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
