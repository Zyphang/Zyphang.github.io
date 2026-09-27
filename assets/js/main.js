/*
 * main.js — interactions du cyberfolio.
 * Règles de sécurité suivies dans ce fichier :
 *  - aucun innerHTML / outerHTML / insertAdjacentHTML / eval (Trusted Types les bloque de toute façon)
 *  - le texte est toujours injecté via textContent
 *  - aucune requête réseau (connect-src 'none' dans la CSP)
 */
(function () {
    'use strict';

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    /* ── Année du footer ─────────────────────────────────────────── */
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ── Menu mobile ─────────────────────────────────────────────── */
    var toggle = $('.nav-toggle');
    var menu = $('#nav-menu');
    if (toggle && menu) {
        var setOpen = function (open) {
            toggle.setAttribute('aria-expanded', String(open));
            menu.classList.toggle('open', open);
        };
        toggle.addEventListener('click', function () {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });
        $$('a', menu).forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    /* ── Thème clair / sombre ────────────────────────────────────── */
    var themeBtn = $('#theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var root = document.documentElement;
            var current = root.getAttribute('data-theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            var next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { window.localStorage.setItem('theme', next); } catch (e) { /* ignoré */ }
        });
    }

    /* ── Onglets accessibles (compétences) ───────────────────────── */
    $$('[data-tabs]').forEach(function (wrap) {
        var tabs = $$('[role="tab"]', wrap);
        var select = function (tab, focus) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
                var panel = document.getElementById(t.getAttribute('aria-controls'));
                if (panel) panel.hidden = !on;
            });
            if (focus) tab.focus();
        };
        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { select(tab, false); });
            tab.addEventListener('keydown', function (e) {
                var idx = null;
                if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
                else if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
                else if (e.key === 'Home') idx = 0;
                else if (e.key === 'End') idx = tabs.length - 1;
                if (idx !== null) { e.preventDefault(); select(tabs[idx], true); }
            });
        });
        select(tabs[0], false);
    });

    /* ── Filtre de l'expérience ──────────────────────────────────── */
    $$('[data-filter="timeline"]').forEach(function (group) {
        var target = document.getElementById('timeline');
        if (!target) return;
        var items = $$('[data-type]', target);
        var buttons = $$('button', group);
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var value = btn.getAttribute('data-value');
                buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
                items.forEach(function (item) {
                    item.hidden = !(value === 'all' || item.getAttribute('data-type') === value);
                });
            });
        });
    });

    /* ── Projets : filtre par type + recherche par titre ou tag ──── */
    (function () {
        var grid = document.getElementById('projects');
        var group = $('[data-filter="projects"]');
        var input = $('#project-search');
        var status = $('#project-status');
        var empty = $('#project-empty');
        if (!grid) return;

        // Minuscules et sans accents : « Réseau » est trouvé en tapant « reseau »
        var norm = function (str) {
            return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
        };

        var cards = $$('.project', grid).map(function (card) {
            var title = $('.card-title', card);
            var tags = $$('.tags li', card).map(function (li) { return li.textContent; });
            return {
                el: card,
                type: card.getAttribute('data-type'),
                text: norm((title ? title.textContent : '') + ' ' + tags.join(' ')),
                tagEls: $$('.tags li', card)
            };
        });
        var type = 'all';
        var total = cards.length;

        function apply() {
            var q = input ? norm(input.value) : '';
            var words = q ? q.split(' ') : [];
            var shown = 0;
            cards.forEach(function (c) {
                var ok = (type === 'all' || c.type === type) &&
                         words.every(function (w) { return c.text.indexOf(w) !== -1; });
                c.el.hidden = !ok;
                if (ok) shown++;
                c.tagEls.forEach(function (li) { li.classList.toggle('is-active', q !== '' && norm(li.textContent) === q); });
            });
            if (status) status.textContent = (q || type !== 'all') ? shown + ' projet' + (shown > 1 ? 's' : '') + ' sur ' + total : '';
            if (empty) empty.hidden = shown !== 0;
        }

        if (group) {
            var buttons = $$('button', group);
            buttons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    type = btn.getAttribute('data-value');
                    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
                    apply();
                });
            });
        }

        if (input) {
            input.addEventListener('input', apply);
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { input.value = ''; apply(); }
            });
        }

        // Cliquer sur un tag d'une carte = rechercher ce tag
        cards.forEach(function (c) {
            c.tagEls.forEach(function (li) {
                li.tabIndex = 0;
                li.setAttribute('role', 'button');
                li.setAttribute('title', 'Voir les projets « ' + li.textContent + ' »');
                var pick = function () {
                    if (!input) return;
                    var same = norm(input.value) === norm(li.textContent);
                    input.value = same ? '' : li.textContent;   // re-cliquer sur le tag annule
                    apply();
                };
                li.addEventListener('click', pick);
                li.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
                });
            });
        });

        var clearBtn = $('#project-clear');
        if (clearBtn) clearBtn.addEventListener('click', function () {
            if (input) input.value = '';
            type = 'all';
            if (group) $$('button', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === 'all')); });
            apply();
            if (input) input.focus();
        });
    })();

    /* ── Email anti-scraping ─────────────────────────────────────── */
    var reveal = $('#email-reveal');
    var copyBtn = $('#email-copy');
    var slot = $('#email-value');
    var EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    var decode = function (b64) {
        try { return window.atob(b64); } catch (e) { return ''; }
    };

    if (reveal && slot) {
        reveal.addEventListener('click', function () {
            var email = decode(reveal.getAttribute('data-u')) + '@' + decode(reveal.getAttribute('data-d'));
            if (!EMAIL_RE.test(email)) return;             // garde-fou : on n'affiche qu'une adresse valide
            var link = document.createElement('a');
            link.href = 'mailto:' + email;
            link.textContent = email;
            slot.textContent = '';
            slot.appendChild(link);
            reveal.hidden = true;
            if (copyBtn) {
                copyBtn.hidden = false;
                copyBtn.addEventListener('click', function () {
                    if (!navigator.clipboard) return;
                    navigator.clipboard.writeText(email).then(function () {
                        copyBtn.textContent = 'Copié ✓';
                        window.setTimeout(function () { copyBtn.textContent = 'Copier'; }, 2000);
                    }, function () { /* refusé : l'adresse reste visible */ });
                });
            }
        });
    }
})();
