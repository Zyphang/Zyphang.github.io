/*
 * mission.js — moteur des mini-ateliers (mission.html?m=<id>).
 * Lit window.MISSIONS (missions-data.js) et construit chaque étape avec
 * createElement + textContent uniquement. Aucune donnée n'est envoyée.
 */
(function () {
    'use strict';

    var MISSIONS = window.MISSIONS || {};
    var PROFILES = window.MISSION_PROFILES || {};
    var BADGE_KEY = 'atelier-badges';

    /* ── Helpers ─────────────────────────────────────────────────── */
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined && text !== null) n.textContent = text;
        return n;
    }
    function rich(tag, cls, str) {                   // **gras** → <strong>, le reste en texte brut
        var n = el(tag, cls);
        String(str).split('**').forEach(function (part, i) {
            if (!part) return;
            n.appendChild(i % 2 ? el('strong', null, part) : document.createTextNode(part));
        });
        return n;
    }
    function button(label, cls) {
        var b = el('button', cls || 'btn', label);
        b.type = 'button';
        return b;
    }
    function randInt(max) {
        var buf = new Uint32Array(1), limit = Math.floor(0x100000000 / max) * max;
        do { window.crypto.getRandomValues(buf); } while (buf[0] >= limit);
        return buf[0] % max;
    }
    function shuffled(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = randInt(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }
    function readBadges() {
        try {
            var v = JSON.parse(window.sessionStorage.getItem(BADGE_KEY) || '[]');
            return Array.isArray(v) ? v.filter(function (x) { return Object.prototype.hasOwnProperty.call(MISSIONS, x); }) : [];
        } catch (e) { return []; }
    }
    function saveBadge(id) {
        var b = readBadges();
        if (b.indexOf(id) === -1) b.push(id);
        try { window.sessionStorage.setItem(BADGE_KEY, JSON.stringify(b)); } catch (e) { /* ignoré */ }
    }

    /* ── Sélection de la mission (liste blanche) ─────────────────── */
    var params = new URLSearchParams(window.location.search);
    var id = params.get('m') || '';
    var root = document.getElementById('mission');
    if (!root) return;

    if (!Object.prototype.hasOwnProperty.call(MISSIONS, id)) {
        root.appendChild(el('h1', 'mission-title', 'Mission introuvable'));
        var back = el('a', 'btn', '← Choisir une mission');
        back.href = 'atelier.html';
        root.appendChild(back);
        return;
    }

    var M = MISSIONS[id];
    document.title = M.title + ' — Atelier cyber';
    document.body.setAttribute('data-mission', id);

    var stepIdx = 0;

    /* ── Squelette ───────────────────────────────────────────────── */
    var head = el('div', 'mission-head');
    var icon = el('span', 'mission-icon', M.icon);
    icon.setAttribute('aria-hidden', 'true');
    var headText = el('div');
    headText.appendChild(el('p', 'eyebrow', 'Mission ' + M.n + ' · ' + M.theme + ' · ≈ ' + M.duration));
    headText.appendChild(el('h1', 'mission-title', M.title));
    head.appendChild(icon);
    head.appendChild(headText);

    var progress = el('ol', 'progress');
    progress.setAttribute('aria-label', 'Progression');
    var stage = el('section', 'stage');
    stage.setAttribute('aria-live', 'polite');

    root.appendChild(head);
    root.appendChild(progress);
    root.appendChild(stage);

    function renderProgress() {
        while (progress.firstChild) progress.removeChild(progress.firstChild);
        for (var i = 0; i <= M.steps.length; i++) {
            var li = el('li');
            if (i < stepIdx || stepIdx >= M.steps.length) li.className = 'done';
            else if (i === stepIdx) { li.className = 'current'; li.setAttribute('aria-current', 'step'); }
            li.appendChild(el('span', 'sr-only', i === M.steps.length ? 'Fin' : 'Étape ' + (i + 1)));
            progress.appendChild(li);
        }
    }

    /* ── Visuels ─────────────────────────────────────────────────── */
    function renderVisual(v) {
        if (!v) return null;
        if (v.kind === 'packets') {
            var wrap = el('div', 'packets');
            var table = el('table');
            var thead = el('thead'), tr = el('tr');
            ['De', 'Vers', 'Contenu capturé'].forEach(function (h) { tr.appendChild(el('th', null, h)); });
            thead.appendChild(tr); table.appendChild(thead);
            var tbody = el('tbody');
            v.rows.forEach(function (r) {
                var row = el('tr');
                r.forEach(function (c, i) { row.appendChild(el('td', i === 2 ? 'mono' : null, c)); });
                tbody.appendChild(row);
            });
            table.appendChild(tbody); wrap.appendChild(table);
            return wrap;
        }
        if (v.kind === 'file') {
            var f = el('div', 'fakefile');
            f.appendChild(el('div', 'fakefile-bar', v.name));
            var pre = el('div', 'fakefile-body');
            v.lines.forEach(function (l) { pre.appendChild(el('div', 'mono', l)); });
            f.appendChild(pre);
            return f;
        }
        if (v.kind === 'posts') {
            var p = PROFILES[v.ref];
            if (!p) return null;
            var card = el('div', 'profile');
            var top = el('div', 'profile-top');
            var avatar = el('span', 'avatar', p.name.charAt(0));
            avatar.setAttribute('aria-hidden', 'true');
            var who = el('div');
            who.appendChild(el('p', 'profile-name', p.name));
            who.appendChild(el('p', 'profile-handle', p.handle + ' · profil public'));
            top.appendChild(avatar); top.appendChild(who);
            card.appendChild(top);
            card.appendChild(el('p', 'profile-bio', p.bio));
            var list = el('ul', 'profile-posts');
            p.posts.forEach(function (t) { list.appendChild(el('li', null, t)); });
            card.appendChild(list);
            return card;
        }
        return null;
    }

    /* ── Composants d'interaction ────────────────────────────────── */
    function feedback(box, kind, text) {
        box.className = 'feedback-box ' + kind;
        box.textContent = text;
        box.hidden = false;
    }

    function renderChoice(container, step, fb, onSolved) {
        if (step.question) container.appendChild(el('p', 'question', step.question));
        var grid = el('div', 'options');
        step.options.forEach(function (o) {
            var b = button(o.t, 'option');
            b.addEventListener('click', function () {
                if (o.ok) {
                    b.classList.add('is-right');
                    Array.prototype.forEach.call(grid.children, function (x) { x.disabled = true; });
                    feedback(fb, 'good', o.why);
                    onSolved();
                } else {
                    b.classList.add('is-wrong');
                    b.disabled = true;
                    feedback(fb, 'retry', o.why + ' Essaie encore !');
                }
            });
            grid.appendChild(b);
        });
        container.appendChild(grid);
    }

    function renderOrder(container, step, fb, onSolved) {
        var seq = el('ol', 'sequence');
        var slots = [];
        step.items.forEach(function (_, i) {
            var s = el('li', 'slot', String(i + 1));
            slots.push(s); seq.appendChild(s);
        });
        var pool = el('div', 'options pool');
        var next = 0;
        var items = shuffled(step.items);
        if (items.join() === step.items.join()) items.reverse();
        items.forEach(function (label) {
            var b = button(label, 'option');
            b.addEventListener('click', function () {
                if (label === step.items[next]) {
                    slots[next].textContent = label;
                    slots[next].classList.add('filled');
                    b.disabled = true; b.classList.add('is-used');
                    next++;
                    fb.hidden = true;
                    if (next === step.items.length) {
                        feedback(fb, 'good', step.success || 'Bravo !');
                        onSolved();
                    }
                } else {
                    b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
                    feedback(fb, 'retry', 'Pas encore ! Ce n\'est pas l\'étape n°' + (next + 1) + '. Essaie une autre carte.');
                }
            });
            pool.appendChild(b);
        });
        container.appendChild(seq);
        container.appendChild(pool);
    }

    function renderSpot(container, step, fb, onSolved) {
        var found = 0;
        var counter = el('p', 'counter', 'Trouvées : 0 / ' + step.need);
        var list = el('ul', 'spot spot-' + (step.style || 'code'));
        step.items.forEach(function (it) {
            var li = el('li');
            var b = button(it.t, 'spot-item' + (step.style === 'code' ? ' mono' : ''));
            b.addEventListener('click', function () {
                b.disabled = true;
                if (it.bad) {
                    found++;
                    b.classList.add('is-found');
                    counter.textContent = 'Trouvées : ' + found + ' / ' + step.need;
                    if (found === step.need) {
                        feedback(fb, 'good', it.why + ' — Tu as tout trouvé, bravo !');
                        list.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
                        onSolved();
                    } else feedback(fb, 'good', it.why);
                } else {
                    b.classList.add('is-safe');
                    feedback(fb, 'retry', it.why + ' Cherche encore.');
                }
            });
            li.appendChild(b);
            list.appendChild(li);
        });
        container.appendChild(counter);
        container.appendChild(list);
    }

    function renderTries(container, step, fb, onSolved) {
        var browser = el('div', 'browser');
        var bar = el('div', 'browser-bar');
        bar.appendChild(el('span', 'browser-dots'));
        var first = step.attempts[0];
        var url = el('span', 'browser-url mono', step.url + (first.urlSuffix || ''));
        bar.appendChild(url);
        var body = el('div', 'browser-body');
        if (first.urlSuffix) first.result.forEach(function (line, i) { body.appendChild(el('p', i === 0 ? 'browser-strong' : null, line)); });
        else body.appendChild(el('p', 'browser-strong', '🔒 Espace administrateur · Mot de passe : ••••••'));
        browser.appendChild(bar); browser.appendChild(body);
        container.appendChild(browser);

        var grid = el('div', 'options');
        step.attempts.forEach(function (a) {
            var b = button(a.urlSuffix ? 'id = ' + a.label : 'Essayer « ' + a.label + ' »', 'option mono');
            b.addEventListener('click', function () {
                if (a.urlSuffix) url.textContent = step.url + a.urlSuffix;
                while (body.firstChild) body.removeChild(body.firstChild);
                a.result.forEach(function (line, i) { body.appendChild(el('p', i === 0 ? 'browser-strong' : null, line)); });
                b.classList.add(a.ok ? 'is-right' : 'is-tried');
                if (a.ok) {
                    Array.prototype.forEach.call(grid.children, function (x) { x.disabled = true; });
                    feedback(fb, 'good', step.success);
                    onSolved();
                } else if (!a.urlSuffix) {
                    b.disabled = true;
                    feedback(fb, 'retry', 'Raté, essaie le suivant.');
                } else {
                    feedback(fb, 'retry', 'C\'est bien ta commande. Et si tu changes le numéro ?');
                }
            });
            grid.appendChild(b);
        });
        container.appendChild(grid);
    }

    function shiftText(t, k) {
        return t.replace(/[A-Z]/g, function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 + k + 26) % 26 + 65); });
    }

    function renderCaesar(container, step, fb, onSolved) {
        var key = 3 + randInt(20);
        var solvedOnce = false;
        container.appendChild(el('p', 'label-small', 'Message intercepté :'));
        container.appendChild(el('p', 'mono-box cipher', shiftText(step.message, key)));
        var label = el('label', 'label-small', 'Décalage : ');
        var val = el('strong', null, '0');
        label.appendChild(val);
        label.htmlFor = 'shift';
        var range = el('input');
        range.type = 'range'; range.id = 'shift'; range.min = '0'; range.max = '25'; range.value = '0';
        var out = el('p', 'mono-box cipher plain', shiftText(step.message, key));
        out.setAttribute('aria-live', 'polite');
        var abc = el('p', 'abc mono');
        function update() {
            var s = parseInt(range.value, 10) || 0;
            val.textContent = String(s);
            abc.textContent = 'A→' + shiftText('A', -s) + '  B→' + shiftText('B', -s) + '  C→' + shiftText('C', -s);
            var plain = shiftText(shiftText(step.message, key), -s);
            out.textContent = plain;
            var ok = plain === step.message;
            out.classList.toggle('solved', ok);
            if (ok && !solvedOnce) { solvedOnce = true; feedback(fb, 'good', step.success); onSolved(); }
        }
        range.addEventListener('input', update);
        container.appendChild(label);
        container.appendChild(range);
        container.appendChild(abc);
        container.appendChild(out);
        update();
    }

    function renderHash(container, step, fb, onSolved) {
        var seen = {};
        var count = 0;
        var words = el('div', 'options pool');
        var table = el('table', 'hashes');
        var tbody = el('tbody');
        table.appendChild(tbody);
        var after = el('div');
        after.hidden = true;
        step.words.forEach(function (w) {
            var b = button(w.w, 'option mono');
            b.addEventListener('click', function () {
                if (seen[w.w]) return;
                seen[w.w] = true; count++;
                b.classList.add('is-used');
                var tr = el('tr');
                tr.appendChild(el('th', 'mono', w.w));
                tr.appendChild(el('td', 'mono', w.h + '…'));
                tbody.appendChild(tr);
                if (count >= step.need && after.hidden) {
                    after.hidden = false;
                    renderChoice(after, step, fb, onSolved);
                }
            });
            words.appendChild(b);
        });
        container.appendChild(words);
        container.appendChild(table);
        container.appendChild(after);
    }

    /* ── Rendu d'une étape ───────────────────────────────────────── */
    function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

    function renderStep() {
        renderProgress();
        clear(stage);
        if (stepIdx >= M.steps.length) return renderEnd();

        var step = M.steps[stepIdx];
        var card = el('div', 'step-card');
        card.appendChild(el('p', 'step-count', 'Étape ' + (stepIdx + 1) + ' sur ' + M.steps.length));
        var h = el('h2', 'step-title', step.title);
        h.tabIndex = -1;
        card.appendChild(h);
        (step.text || []).forEach(function (t) { card.appendChild(rich('p', 'step-text', t)); });

        var vis = renderVisual(step.visual);
        if (vis) card.appendChild(vis);

        var zone = el('div', 'interaction');
        var fb = el('p', 'feedback-box');
        fb.hidden = true;
        fb.setAttribute('role', 'status');

        var nav = el('div', 'step-nav');
        var hintBtn = null;
        if (step.hint) {
            hintBtn = button('💡 Un indice ?', 'btn btn-ghost');
            hintBtn.addEventListener('click', function () {
                feedback(fb, 'hint', step.hint);
                hintBtn.disabled = true;
            });
            nav.appendChild(hintBtn);
        }
        var isLast = stepIdx === M.steps.length - 1;
        var nextBtn = button(isLast ? 'Terminer la mission 🏁' : 'Suivant →', 'btn btn-next');
        nextBtn.disabled = step.type !== 'info';
        nextBtn.addEventListener('click', function () { stepIdx++; renderStep(); });
        nav.appendChild(nextBtn);

        function solved() {
            nextBtn.disabled = false;
            if (hintBtn) hintBtn.hidden = true;
            nextBtn.focus({ preventScroll: true });
        }

        switch (step.type) {
            case 'choice': renderChoice(zone, step, fb, solved); break;
            case 'order':  renderOrder(zone, step, fb, solved); break;
            case 'spot':   renderSpot(zone, step, fb, solved); break;
            case 'tries':  renderTries(zone, step, fb, solved); break;
            case 'caesar': renderCaesar(zone, step, fb, solved); break;
            case 'hash':   renderHash(zone, step, fb, solved); break;
            default: break;
        }
        card.appendChild(zone);
        card.appendChild(fb);

        if (step.word) {
            var word = el('aside', 'word');
            word.appendChild(el('p', 'word-label', '📘 Le mot à retenir'));
            var def = el('p');
            def.appendChild(el('strong', null, step.word.term + ' : '));
            def.appendChild(document.createTextNode(step.word.def));
            word.appendChild(def);
            card.appendChild(word);
        }
        card.appendChild(nav);
        stage.appendChild(card);
        if (stepIdx > 0) { h.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    }

    function renderEnd() {
        saveBadge(id);
        var card = el('div', 'step-card end-card');
        var medal = el('div', 'medal', M.icon);
        medal.setAttribute('aria-hidden', 'true');
        card.appendChild(medal);
        card.appendChild(el('p', 'eyebrow', 'Mission accomplie'));
        var h = el('h2', 'step-title', 'Badge obtenu : ' + M.badge);
        h.tabIndex = -1;
        card.appendChild(h);

        card.appendChild(el('p', 'end-sub', 'Ce que tu as appris :'));
        var ul = el('ul', 'learned');
        M.learned.forEach(function (l) { ul.appendChild(el('li', null, l)); });
        card.appendChild(ul);

        var job = el('aside', 'word job');
        job.appendChild(el('p', 'word-label', '💼 Le métier derrière la mission'));
        job.appendChild(el('p', 'job-title', M.job.title));
        job.appendChild(el('p', null, M.job.text));
        card.appendChild(job);

        var nav = el('div', 'step-nav');
        var again = button('Recommencer', 'btn btn-ghost');
        again.addEventListener('click', function () { stepIdx = 0; renderStep(); });
        var hub = el('a', 'btn btn-next', 'Choisir une autre mission →');
        hub.href = 'atelier.html';
        nav.appendChild(again); nav.appendChild(hub);
        card.appendChild(nav);
        stage.appendChild(card);
        h.focus({ preventScroll: true });
        window.scrollTo(0, 0);
    }

    renderStep();
})();
