/*
 * guard.js — chargé en premier, de façon synchrone, dans le <head>.
 *
 * 1. Anti-clickjacking : GitHub Pages ne permet ni l'en-tête X-Frame-Options
 *    ni la directive CSP frame-ancestors (ignorée en <meta>). Si la page est
 *    affichée dans une iframe d'un autre site, on masque tout le contenu
 *    (classe "framed" → body masqué en CSS) et on tente de sortir du cadre.
 * 2. Thème : applique le thème mémorisé avant l'affichage (pas de flash).
 * 3. Marque la page comme "JS actif" pour l'amélioration progressive.
 */
(function () {
    'use strict';
    var root = document.documentElement;

    if (window.self !== window.top) {
        root.classList.add('framed');
        try { window.top.location.replace(window.self.location.href); } catch (e) { /* cadre cross-origin : le contenu reste masqué */ }
    }

    try {
        var saved = window.localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (e) { /* stockage indisponible : thème du système */ }

    root.classList.add('js');
})();
