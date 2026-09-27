/*
 * express.js — parcours express de l'atelier (mot de passe + phishing).
 * Tout est calculé localement : aucune donnée ne quitte le navigateur
 * (la CSP interdit d'ailleurs toute requête réseau : connect-src 'none').
 * Texte injecté uniquement via textContent.
 */
(function () {
    'use strict';

    var $ = function (id) { return document.getElementById(id); };
    var clear = function (node) { while (node.firstChild) node.removeChild(node.firstChild); };
    var addLi = function (list, text, cls) {
        var li = document.createElement('li');
        li.textContent = text;
        if (cls) li.className = cls;
        list.appendChild(li);
    };
    var randInt = function (max) {             // entier aléatoire cryptographique dans [0, max)
        var buf = new Uint32Array(1), limit = Math.floor(0x100000000 / max) * max;
        do { window.crypto.getRandomValues(buf); } while (buf[0] >= limit);
        return buf[0] % max;
    };

    /* ═══════════════════ 1. MOT DE PASSE ═══════════════════ */
    var COMMON = ['123456', '123456789', '12345678', '1234', '0000', '000000', '111111', '123123', 'password',
        'motdepasse', 'azerty', 'azertyuiop', 'qwerty', 'soleil', 'doudou', 'loulou', 'chouchou', 'bonjour',
        'marseille', 'paris', 'lyon', 'olympique', 'football', 'chocolat', 'princesse', 'iloveyou', 'jetaime',
        'admin', 'welcome', 'nicolas', 'camille', 'thomas', 'coucou', 'dragon', 'monkey', 'pokemon', 'minecraft'];
    var RATE = 1e10;                               // essais par seconde (GPU, hash rapide)

    var pwd = $('pwd'), bar = $('pwd-bar'), timeOut = $('pwd-time'), verdict = $('pwd-verdict'), tips = $('pwd-tips');

    function humanTime(seconds) {
        if (seconds < 1) return 'instantané';
        var units = [['siècle', 3153600000], ['an', 31536000], ['mois', 2592000], ['jour', 86400], ['heure', 3600], ['minute', 60], ['seconde', 1]];
        if (seconds > 3153600000 * 1e6) return 'plus que l\'âge de l\'univers';
        for (var i = 0; i < units.length; i++) {
            if (seconds >= units[i][1]) {
                var n = Math.floor(seconds / units[i][1]);
                var label = units[i][0];
                var plural = n > 1 && label !== 'mois' ? (label === 'an' ? 'ans' : label + 's') : label;
                return (n >= 1e6 ? n.toExponential(1).replace('e+', ' × 10^') : n.toLocaleString('fr-FR')) + ' ' + plural;
            }
        }
        return 'instantané';
    }

    function analyse(p) {
        var hints = [];
        if (!p) return null;
        var lower = p.toLowerCase().replace(/[0-9!@#$%^&*._-]+$/, '');
        var pool = 0;
        if (/[a-z]/.test(p)) pool += 26;
        if (/[A-Z]/.test(p)) pool += 26;
        if (/[0-9]/.test(p)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(p)) pool += 33;
        var bits = p.length * Math.log2(Math.max(pool, 1));

        if (COMMON.indexOf(p.toLowerCase()) !== -1 || COMMON.indexOf(lower) !== -1) {
            bits = Math.min(bits, 10);
            hints.push('Il fait partie des mots de passe les plus utilisés : c\'est le premier testé.');
        }
        if (/(.)\1{2,}/.test(p)) { bits -= 8; hints.push('Évite les caractères répétés (aaa, 111).'); }
        if (/(0123|1234|2345|3456|4567|5678|6789|abcd|azer|qwer)/i.test(p)) { bits -= 10; hints.push('Évite les suites (1234, abcd, azerty).'); }
        if (/(19|20)\d{2}/.test(p)) { bits -= 6; hints.push('Une année (naissance…) se devine facilement.'); }
        if (p.length < 12) hints.push('Vise au moins 12 caractères : la longueur compte plus que tout.');
        if (!/[A-Z]/.test(p) || !/[0-9]/.test(p) || !/[^a-zA-Z0-9]/.test(p)) hints.push('Mélanger majuscules, chiffres et symboles agrandit l\'espace à tester.');
        hints.push('Un mot de passe différent pour chaque site, rangé dans un gestionnaire de mots de passe.');

        bits = Math.max(bits, 0);
        var seconds = Math.pow(2, bits) / 2 / RATE;
        var score = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
        return { seconds: seconds, score: score, hints: hints };
    }

    var VERDICTS = ['Très faible', 'Faible', 'Moyen', 'Solide', 'Très solide'];

    function renderPwd() {
        var r = analyse(pwd.value);
        clear(tips);
        if (!r) {
            bar.setAttribute('data-score', '0');
            bar.classList.remove('filled');
            timeOut.textContent = '—';
            verdict.textContent = '';
            return;
        }
        bar.classList.add('filled');
        bar.setAttribute('data-score', String(r.score));
        timeOut.textContent = humanTime(r.seconds);
        verdict.textContent = VERDICTS[r.score];
        verdict.setAttribute('data-score', String(r.score));
        r.hints.slice(0, 3).forEach(function (h) { addLi(tips, h); });
    }

    if (pwd) {
        pwd.addEventListener('input', renderPwd);
        $('pwd-show').addEventListener('click', function () {
            var show = pwd.type === 'password';
            pwd.type = show ? 'text' : 'password';
            this.setAttribute('aria-pressed', String(show));
            this.textContent = show ? 'Masquer' : 'Afficher';
        });
    }

    var WORDS = ['abeille', 'balcon', 'bougie', 'cactus', 'canard', 'cerise', 'citron', 'comete', 'corail', 'crayon',
        'dauphin', 'desert', 'etoile', 'falaise', 'fenetre', 'fusee', 'galaxie', 'girafe', 'glacier', 'guitare',
        'hibou', 'igloo', 'jardin', 'kiwi', 'lanterne', 'lavande', 'licorne', 'lune', 'marmotte', 'melodie',
        'meteore', 'moustache', 'nuage', 'orage', 'papillon', 'parapluie', 'pasteque', 'phare', 'pingouin', 'planete',
        'poisson', 'pomme', 'radis', 'renard', 'robot', 'sapin', 'sirene', 'tambour', 'tempete', 'tortue',
        'trompette', 'tulipe', 'valise', 'vanille', 'violon', 'volcan', 'wagon', 'yaourt', 'zebre', 'ecureuil'];

    var genBtn = $('passphrase-gen');
    if (genBtn) {
        genBtn.addEventListener('click', function () {
            var words = [];
            for (var i = 0; i < 4; i++) words.push(WORDS[randInt(WORDS.length)]);
            $('passphrase').textContent = words.join('-') + '-' + randInt(100);
        });
    }

    /* ═══════════════════ 2. PHISHING ═══════════════════ */
    var MESSAGES = [
        {
            kind: 'SMS', from: '+33 7 56 12 98 40', subject: '',
            body: 'ColisRapide : votre colis est bloqué en entrepôt. Des frais de 1,99 € sont à régler sous 24 h pour la livraison.',
            link: 'colisrapide-suivi-livraison.info/p/x7Kq',
            answer: 'phish',
            clues: ['Urgence (« sous 24 h ») pour t\'empêcher de réfléchir.', 'Petite somme pour obtenir ta carte bancaire.', 'Le lien ne pointe pas vers le site officiel du transporteur.']
        },
        {
            kind: 'Email', from: 'Banque Horizon <info@banque-horizon.fr>', subject: 'Votre relevé de compte est disponible',
            body: 'Bonjour, votre relevé du mois est disponible dans votre espace client. Pour le consulter, connectez-vous comme d\'habitude depuis l\'application Banque Horizon.',
            link: '',
            answer: 'legit',
            clues: ['Aucun lien, aucune pièce jointe.', 'Aucune urgence ni demande d\'informations.', 'Il te renvoie vers l\'application que tu utilises déjà.']
        },
        {
            kind: 'Email', from: 'Direction Générale <direction.generale.pdg@gmail.com>', subject: 'URGENT et confidentiel',
            body: 'Je suis en réunion et injoignable. J\'ai besoin que tu effectues un virement de 18 400 € pour une acquisition confidentielle. N\'en parle à personne, je t\'envoie le RIB.',
            link: '',
            answer: 'phish',
            clues: ['« Fraude au président » : autorité + urgence + secret.', 'Adresse Gmail pour un dirigeant d\'entreprise.', 'Réflexe : rappeler la personne sur un numéro connu.']
        },
        {
            kind: 'Email', from: 'StreamFlix <no-reply@streamflix-account-help.net>', subject: 'Votre abonnement a été suspendu',
            body: 'Nous n\'avons pas pu débiter votre carte. Mettez à jour vos informations de paiement pour éviter la suppression de votre compte.',
            link: 'streamflix-account-help.net/login',
            answer: 'phish',
            clues: ['Le domaine n\'est pas celui du service (« -account-help.net »).', 'Menace de suppression du compte.', 'Demande de coordonnées bancaires via un lien.']
        },
        {
            kind: 'Email', from: 'FitZone <rappels@fitzone.fr>', subject: 'Rappel : ta séance demain à 18 h',
            body: 'Salut ! Petit rappel pour ta séance de demain à 18 h. Pour l\'annuler ou la déplacer, rendez-vous dans l\'appli FitZone.',
            link: '',
            answer: 'legit',
            clues: ['Information attendue (tu as réservé une séance).', 'Aucune demande d\'identifiants ni de paiement.', 'Pas de lien : il renvoie vers l\'appli.']
        },
        {
            kind: 'Email', from: 'Support informatique <helpdesk@mon-ecole-support.com>', subject: 'Votre boîte mail est pleine (99 %)',
            body: 'Votre messagerie va bientôt cesser de recevoir des messages. Revalidez votre compte avec votre identifiant et votre mot de passe pour obtenir plus d\'espace.',
            link: 'mon-ecole-support.com/revalidation',
            answer: 'phish',
            clues: ['Un vrai service informatique ne demande jamais ton mot de passe.', 'Domaine externe qui imite celui de l\'école.', 'Peur de perdre ses messages = pression.']
        }
    ];

    var phishIdx = 0, phishScore = 0;

    function renderPhish() {
        var m = MESSAGES[phishIdx];
        $('phish-progress').textContent = (phishIdx + 1) + ' / ' + MESSAGES.length;
        $('phish-kind').textContent = m.kind;
        $('phish-from').textContent = m.from;
        $('phish-subject').textContent = m.subject;
        $('phish-subject').hidden = !m.subject;
        $('phish-body').textContent = m.body;
        $('phish-link').textContent = m.link;
        $('phish-link-wrap').hidden = !m.link;
        $('phish-card').hidden = false;
        $('phish-choice').hidden = false;
        $('phish-feedback').hidden = true;
        $('phish-end').hidden = true;
    }

    function answerPhish(ans) {
        var m = MESSAGES[phishIdx];
        var ok = ans === m.answer;
        if (ok) phishScore++;
        var v = $('phish-verdict');
        v.textContent = (ok ? 'Bien vu ! ' : 'Raté… ') + (m.answer === 'phish' ? 'C\'était du phishing.' : 'Ce message était légitime.');
        v.setAttribute('data-ok', String(ok));
        var list = $('phish-clues');
        clear(list);
        m.clues.forEach(function (c) { addLi(list, c); });
        $('phish-choice').hidden = true;
        $('phish-feedback').hidden = false;
        $('phish-next').textContent = phishIdx === MESSAGES.length - 1 ? 'Voir mon score →' : 'Message suivant →';
        $('phish-next').focus();
    }

    function resetPhish() { phishIdx = 0; phishScore = 0; renderPhish(); }

    if ($('phish-card')) {
        Array.prototype.forEach.call(document.querySelectorAll('#phish-choice [data-answer]'), function (b) {
            b.addEventListener('click', function () { answerPhish(b.getAttribute('data-answer')); });
        });
        $('phish-next').addEventListener('click', function () {
            if (phishIdx < MESSAGES.length - 1) { phishIdx++; renderPhish(); return; }
            $('phish-card').hidden = true;
            $('phish-feedback').hidden = true;
            $('phish-score').textContent = phishScore + ' / ' + MESSAGES.length;
            $('phish-end').hidden = false;
        });
        $('phish-restart').addEventListener('click', resetPhish);
        resetPhish();
    }

    /* ═══════════════════ Recommencer ═══════════════════ */
    function resetAll() {
        if (pwd) {
            pwd.value = '';
            pwd.type = 'password';
            $('pwd-show').textContent = 'Afficher';
            $('pwd-show').setAttribute('aria-pressed', 'false');
            $('passphrase').textContent = '—';
            renderPwd();
        }
        resetPhish();
        var first = $('tab-pwd');
        if (first) first.click();
        window.scrollTo(0, 0);
    }

    var resetBtn = $('reset-all');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
})();
