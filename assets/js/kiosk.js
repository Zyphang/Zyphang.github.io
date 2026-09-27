/*
 * kiosk.js — fonctions « stand » communes aux pages de l'atelier :
 *  - bouton plein écran
 *  - badges obtenus (sessionStorage : effacés à la fermeture de l'onglet)
 *  - retour automatique à l'accueil de l'atelier après 3 min d'inactivité,
 *    pour que le visiteur suivant reparte de zéro.
 */
(function () {
    'use strict';
    var BADGE_KEY = 'atelier-badges';
    var IDLE_MS = 3 * 60 * 1000;

    function badges() {
        try {
            var v = JSON.parse(window.sessionStorage.getItem(BADGE_KEY) || '[]');
            return Array.isArray(v) ? v.filter(function (x) { return typeof x === 'string'; }) : [];
        } catch (e) { return []; }
    }
    function clearBadges() {
        try { window.sessionStorage.removeItem(BADGE_KEY); } catch (e) { /* ignoré */ }
    }

    /* Plein écran */
    var fs = document.getElementById('fullscreen');
    if (fs) {
        if (!document.documentElement.requestFullscreen) fs.hidden = true;
        fs.addEventListener('click', function () {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen().catch(function () { /* refusé */ });
        });
    }

    /* QR code : agrandi au clic, refermé au clic n'importe où ou avec Échap */
    var qrOpen = document.getElementById('qr-open');
    var qrDialog = document.getElementById('qr-dialog');
    if (qrOpen && qrDialog && typeof qrDialog.showModal === 'function') {
        qrOpen.addEventListener('click', function () { qrDialog.showModal(); });
        qrDialog.addEventListener('click', function () { qrDialog.close(); });
    }

    /* Accueil de l'atelier : marquer les missions terminées */
    function markCards() {
        var got = badges();
        var cards = document.querySelectorAll('[data-mission-card]');
        Array.prototype.forEach.call(cards, function (c) {
            c.classList.toggle('is-done', got.indexOf(c.getAttribute('data-mission-card')) !== -1);
        });
        var count = document.getElementById('badge-count');
        if (count) count.textContent = String(got.length);
    }
    markCards();

    var resetBadges = document.getElementById('reset-badges');
    if (resetBadges) resetBadges.addEventListener('click', function () { clearBadges(); markCards(); });

    var note = document.getElementById('idle-note');
    if (note && new URLSearchParams(window.location.search).get('reset') === '1') note.hidden = false;

    /* Inactivité → retour à l'accueil de l'atelier, badges effacés */
    var timer = null;
    function arm() {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            clearBadges();
            window.location.replace('atelier.html?reset=1');
        }, IDLE_MS);
    }
    ['pointerdown', 'keydown', 'input', 'scroll'].forEach(function (evt) {
        document.addEventListener(evt, arm, { passive: true });
    });
})();
