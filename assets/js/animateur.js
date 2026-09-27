/* animateur.js — génère les fiches animateur à partir de missions-data.js (textContent uniquement). */
(function () {
    'use strict';
    var MISSIONS = window.MISSIONS || {};
    var list = document.getElementById('anim-list');
    if (!list) return;

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    }
    function plain(s) { return String(s).split('**').join(''); }

    function answer(step) {
        switch (step.type) {
            case 'choice':
            case 'hash':   return (step.options.filter(function (o) { return o.ok; })[0] || {}).t || '';
            case 'order':  return step.items.join(' → ');
            case 'spot':   return step.items.filter(function (i) { return i.bad; }).map(function (i) { return i.t; }).join(' | ');
            case 'tries':  return (step.attempts.filter(function (a) { return a.ok; })[0] || {}).label || '';
            case 'caesar': return step.message + ' (décalage aléatoire à chaque partie)';
            default:       return '— (explication)';
        }
    }

    Object.keys(MISSIONS).forEach(function (id) {
        var m = MISSIONS[id];
        var card = el('section', 'card anim-card');
        var h = el('h2', 'card-title', m.icon + '  Mission ' + m.n + ' — ' + m.title);
        card.appendChild(h);
        card.appendChild(el('p', 'muted', m.theme + ' · ≈ ' + m.duration + ' · badge « ' + m.badge + ' »'));

        var goal = el('p');
        goal.appendChild(el('strong', null, 'Objectif : '));
        goal.appendChild(document.createTextNode(m.facilitator.goal));
        card.appendChild(goal);

        var ol = el('ol', 'anim-steps');
        m.steps.forEach(function (s) {
            var li = el('li');
            li.appendChild(el('strong', null, plain(s.title)));
            li.appendChild(el('span', 'anim-answer', 'Réponse : ' + answer(s)));
            if (s.hint) li.appendChild(el('span', 'anim-hint', 'Indice : ' + s.hint));
            ol.appendChild(li);
        });
        card.appendChild(ol);

        card.appendChild(el('p', 'end-sub', 'Relances et points de vigilance'));
        var tips = el('ul', 'learned');
        m.facilitator.tips.forEach(function (t) { tips.appendChild(el('li', null, t)); });
        card.appendChild(tips);

        var link = el('a', 'card-link', 'Ouvrir la mission →');
        link.href = 'mission.html?m=' + encodeURIComponent(id);
        card.appendChild(link);
        list.appendChild(card);
    });
})();
