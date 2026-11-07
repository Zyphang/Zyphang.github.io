/*
 * missions-data.js — contenu des mini-ateliers (niveau débutant).
 *
 * Ce fichier ne contient QUE des données : le moteur (mission.js) les affiche
 * via textContent. Les **mots entre doubles astérisques** sont mis en gras.
 *
 * Types d'étapes :
 *  - info    : explication simple, bouton « Suivant »
 *  - choice  : une question, plusieurs réponses (une seule bonne) — on peut réessayer
 *  - order   : toucher les éléments dans le bon ordre
 *  - spot    : repérer N éléments « à risque » dans une liste (code ou publications)
 *  - tries   : essayer des boutons jusqu'à trouver le bon (simulation)
 *  - caesar  : curseur de décalage pour déchiffrer un message
 *  - hash    : comparer des empreintes (pré-calculées, SHA-256)
 *
 * Toutes les personnes, marques, sites et adresses sont FICTIFS.
 */
window.MISSIONS = {

    /* ═══════════════════════════════ RÉSEAU ═══════════════════════════════ */
    reseau: {
        n: 1, icon: '🌐', title: 'Le voyage d\'un message',
        theme: 'Réseau', duration: '4 min',
        tagline: 'Que se passe-t-il quand tu ouvres un site ?',
        badge: 'Voyageur du réseau',
        steps: [
            {
                type: 'info', title: 'Internet, c\'est une grande poste',
                text: ['Quand tu ouvres un site ou envoies un message, tes données sont découpées en petits morceaux appelés **paquets**.',
                       'Chaque paquet voyage de machine en machine, comme une lettre qui passe par plusieurs bureaux de poste.'],
                word: { term: 'Paquet', def: 'Un petit morceau de données qui voyage sur le réseau, avec une adresse de départ et d\'arrivée.' }
            },
            {
                type: 'order', title: 'Remets le voyage dans l\'ordre',
                text: ['Tu regardes une vidéo sur ton téléphone. Touche les étapes dans l\'ordre du trajet de ta demande.'],
                items: ['📱 Ton téléphone', '📶 La box Wi-Fi', '🌍 Internet', '🖥️ Le serveur du site'],
                hint: 'Ça part de toi, et ça arrive à l\'ordinateur qui stocke la vidéo.',
                success: 'Exactement ! Et la vidéo fait le chemin inverse pour revenir jusqu\'à toi.'
            },
            {
                type: 'choice', title: 'Qui connaît l\'adresse du site ?',
                text: ['Les ordinateurs ne comprennent pas « monjeu.fr ». Ils ont besoin d\'une adresse en chiffres, comme un numéro de téléphone : l\'**adresse IP**.',
                       'Qui donne cette adresse à ton téléphone ?'],
                options: [
                    { t: '📖 Le DNS', ok: true, why: 'Oui ! Le DNS traduit « monjeu.fr » en adresse IP, comme un annuaire traduit un nom en numéro.' },
                    { t: '🗺️ Une application de cartes', why: 'Pas tout à fait : les cartes trouvent des lieux, pas des sites. Cherche plutôt un « annuaire ».' },
                    { t: '🎲 Le téléphone devine au hasard', why: 'Heureusement non ! Il demande à un service spécialisé, comme un annuaire.' }
                ],
                hint: 'Pense à un annuaire : on y cherche un nom, et on obtient un numéro.',
                word: { term: 'DNS (Domain Name System)', def: 'Quand tu tapes « monjeu.fr », ton téléphone demande au DNS l\'adresse IP du site, puis il peut s\'y connecter.' }
            },
            {
                type: 'choice', title: 'Espionne le Wi-Fi du café',
                text: ['Un pirate est connecté au même Wi-Fi public que Marilou. Il capture les paquets qui passent. Voici ce qu\'il voit quand Marilou se connecte à un vieux site :'],
                visual: { kind: 'packets', rows: [
                    ['Marilou', 'vieux-forum.fr', 'GET /accueil'],
                    ['Marilou', 'vieux-forum.fr', 'identifiant=marilou ; motdepasse=Chaton22'],
                    ['vieux-forum.fr', 'Marilou', 'Bienvenue Marilou !']
                ] },
                options: [
                    { t: 'Chaton22', ok: true, why: 'Bien vu… et c\'était beaucoup trop facile ! Ce site envoie tout en clair.' },
                    { t: 'marilou', why: 'Ça, c\'est son identifiant. Regarde juste après « motdepasse= ».' },
                    { t: 'Impossible à savoir', why: 'Regarde bien la deuxième ligne : tout est lisible !' }
                ],
                question: 'Quel est le mot de passe de Marilou ?'
            },
            {
                type: 'choice', title: 'Et avec le cadenas ?',
                text: ['Maintenant Marilou va sur un site avec un **cadenas 🔒** dans la barre d\'adresse (https). Le pirate capture ceci :'],
                visual: { kind: 'packets', rows: [
                    ['Marilou', 'forum-moderne.fr', '8f#Kq!2zP0x@Lw9…'],
                    ['Marilou', 'forum-moderne.fr', 'Vb7$pQ1&mZ4r^tE…'],
                    ['forum-moderne.fr', 'Marilou', 'J2n!X0q#8sLp%aY…']
                ] },
                question: 'Pourquoi le pirate ne peut plus rien lire ?',
                options: [
                    { t: '🔒 Les données sont chiffrées', ok: true, why: 'Oui ! Avec HTTPS, les paquets sont chiffrés : seuls Marilou et le site peuvent les lire.' },
                    { t: '📴 Le Wi-Fi est tombé en panne', why: 'Non, les paquets passent bien… mais ils sont devenus illisibles. Pourquoi ?' },
                    { t: '🐢 Le site est trop lent', why: 'La vitesse n\'y est pour rien. Pense au cadenas.' }
                ],
                word: { term: 'HTTPS', def: 'La version sécurisée du web : le cadenas 🔒 signifie que les échanges sont chiffrés.' }
            }
        ],
        learned: ['Tes données voyagent en petits paquets.', 'Le DNS est l\'annuaire d\'Internet.', 'Le cadenas 🔒 (HTTPS) protège ce que tu envoies, surtout sur un Wi-Fi public.'],
        job: { title: 'Administrateur·rice réseau · Analyste SOC', text: 'Ils construisent les réseaux et surveillent ce qui y circule pour repérer les attaques en direct.' },
        facilitator: {
            goal: 'Comprendre les paquets, le DNS et l\'intérêt du HTTPS.',
            tips: ['Montrer le cadenas dans la barre d\'adresse du navigateur du stand.', 'Demander : « Tu te connectes souvent au Wi-Fi de la gare ou d\'un fast-food ? »']
        }
    },

    /* ═══════════════════════════════ DEVSECOPS ═══════════════════════════════ */
    devsecops: {
        n: 2, icon: '⚙️', title: 'L\'usine à applis',
        theme: 'DevSecOps', duration: '4 min',
        tagline: 'Construire une appli sans laisser de failles.',
        badge: 'Gardien·ne de l\'usine',
        steps: [
            {
                type: 'info', title: 'Une appli, ça se fabrique',
                text: ['Une application (comme un jeu ou un réseau social) est fabriquée comme dans une usine : on **écrit le code**, on le **teste**, puis on le **met en ligne**.',
                       'Le **DevSecOps**, c\'est ajouter des contrôles de sécurité à chaque étape, pour attraper les erreurs avant qu\'elles n\'arrivent chez les utilisateurs.'],
                word: { term: 'Code', def: 'Les instructions écrites par les développeurs pour dire à l\'ordinateur quoi faire.' }
            },
            {
                type: 'order', title: 'Remets la chaîne de fabrication dans l\'ordre',
                text: ['Touche les étapes dans l\'ordre, de l\'idée jusqu\'à l\'appli sur ton téléphone.'],
                items: ['✍️ Écrire le code', '🔍 Vérifier la sécurité du code', '🧪 Tester l\'appli', '🚀 Mettre en ligne'],
                hint: 'On ne peut pas vérifier un code qui n\'est pas encore écrit… et on met en ligne tout à la fin.',
                success: 'Parfait ! Cette chaîne automatique s\'appelle un « pipeline ».'
            },
            {
                type: 'spot', title: 'Trouve les 3 erreurs dans ce code',
                text: ['Voici un morceau (simplifié) du code d\'une appli de quiz. Touche les **3 lignes** dangereuses.'],
                style: 'code', need: 3,
                items: [
                    { t: 'nom_appli = "SuperQuiz"', why: 'Juste le nom de l\'appli : aucun danger.' },
                    { t: 'mot_de_passe_admin = "admin123"', bad: true, why: 'Un mot de passe écrit dans le code : toute personne qui lit le code peut le voir !' },
                    { t: 'afficher("Bienvenue !")', why: 'Afficher un message de bienvenue : aucun danger.' },
                    { t: 'bibliotheque_images = version 1.0 (de 2015)', bad: true, why: 'Une pièce très ancienne : des failles connues existent sûrement. Il faut la mettre à jour.' },
                    { t: 'droits_joueurs = "tout le monde peut tout modifier"', bad: true, why: 'Trop de droits : n\'importe qui pourrait changer les scores ou supprimer des comptes.' },
                    { t: 'sauvegarde = "tous les jours"', why: 'Une sauvegarde quotidienne, c\'est une bonne pratique !' }
                ],
                hint: 'Cherche un secret, une vieille pièce et une ligne qui donne trop de pouvoir.'
            },
            {
                type: 'choice', title: 'Le robot de sécurité a sonné',
                text: ['Dans le pipeline, un **robot de sécurité** bloque la mise en ligne : il a trouvé un mot de passe dans le code. Ton équipe est pressée…'],
                question: 'Que fais-tu ?',
                options: [
                    { t: '🔑 J\'enlève le mot de passe du code et je le change', ok: true, why: 'Bravo ! Il a peut-être déjà été vu : on le retire ET on le change.' },
                    { t: '🙈 Je débranche le robot pour aller plus vite', why: 'Dangereux ! Le robot est là justement pour éviter ce genre d\'accident.' },
                    { t: '🤞 Je mets en ligne quand même, on verra plus tard', why: 'Risqué : une fois en ligne, un pirate peut trouver le mot de passe avant toi.' }
                ]
            }
        ],
        learned: ['Une appli se fabrique en plusieurs étapes : c\'est le pipeline.', 'On ne met jamais de mot de passe dans le code.', 'Des robots de sécurité vérifient le code automatiquement.'],
        job: { title: 'Ingénieur·e DevSecOps', text: 'Il ou elle automatise la fabrication des applis en y intégrant des contrôles de sécurité.' },
        facilitator: {
            goal: 'Découvrir le cycle de fabrication logicielle et les erreurs classiques (secret en dur, dépendance obsolète, droits excessifs).',
            tips: ['Faire le lien avec les mises à jour de leurs applis : « Pourquoi ton téléphone te demande de mettre à jour ? »', 'Montrer le workflow de sécurité de ce site sur GitHub.']
        }
    },

    /* ═══════════════════════════════ OSINT ═══════════════════════════════ */
    osint: {
        n: 3, icon: '🔍', title: 'Le détective d\'Internet',
        theme: 'OSINT', duration: '5 min',
        tagline: 'Ce que tes publications racontent sur toi.',
        badge: 'Détective OSINT',
        steps: [
            {
                type: 'info', title: 'Enquêter avec ce qui est public',
                text: ['L\'**OSINT**, c\'est enquêter uniquement avec des informations publiques : réseaux sociaux, sites, photos…',
                       'Les enquêteurs s\'en servent pour résoudre des affaires. Les pirates aussi, pour deviner des mots de passe !',
                       'Voici le profil public de **Simon**, 19 ans (personnage inventé).'],
                word: { term: 'OSINT', def: 'Open Source Intelligence : le renseignement à partir de sources ouvertes, accessibles à tous.' }
            },
            {
                type: 'choice', title: 'La question secrète',
                text: ['Sur un site, Simon a choisi la question secrète : « Quel est le nom de ton premier animal ? »'],
                visual: { kind: 'posts', ref: 'simon' },
                question: 'Quelle est la réponse de Simon ?',
                options: [
                    { t: 'Sanka', ok: true, why: 'Trouvé ! Il suffisait de lire ses publications…' },
                    { t: 'Aigle', why: 'Relis les publications : l\'une d\'elles parle d\'un chat.' },
                    { t: 'Pesto', why: 'Ça, c\'est la sauce de ses pâtes 😄 Cherche un animal.' }
                ]
            },
            {
                type: 'choice', title: 'Deviner le mot de passe',
                text: ['Comme beaucoup de gens, Simon utilise **le nom de son chat + son année de naissance**.'],
                visual: { kind: 'posts', ref: 'simon' },
                question: 'Quel est son mot de passe probable ? (On est en 2026.)',
                options: [
                    { t: 'Sanka2007', ok: true, why: 'Exact : 19 ans en 2026, né en 2007. Son mot de passe tient en deux publications !' },
                    { t: 'Sanka2012', why: 'Presque ! Il a eu 19 ans cette année : 2026 − 19 = ?' },
                    { t: 'Fac2026', why: 'Non, relis l\'indice : le chat + l\'année de naissance.' }
                ]
            },
            {
                type: 'spot', title: 'Quelles publications aident un pirate ?',
                text: ['Touche les **3 publications** qui donnent des informations utiles à un pirate.'],
                style: 'posts', need: 3,
                items: [
                    { t: '🎂 19 ans aujourd\'hui ! Merci pour tous vos messages (12 mars)', bad: true, why: 'Date de naissance : souvent utilisée dans les mots de passe et pour vérifier une identité.' },
                    { t: '🍝 Les pâtes au pesto, meilleur repas du monde', why: 'Un goût culinaire : pas vraiment utile à un pirate.' },
                    { t: '😺 Sanka a encore mangé ma chaussette…', bad: true, why: 'Le nom de l\'animal : réponse classique aux questions secrètes.' },
                    { t: '🏫 Premier jour à la fac Jean-Moulin, rentrée en licence !', bad: true, why: 'La fac et la formation : ça permet de te localiser et de se faire passer pour quelqu\'un que tu connais.' },
                    { t: '🌅 Trop beau ce coucher de soleil', why: 'Une jolie photo sans lieu ni nom : peu de risque.' }
                ],
                hint: 'Cherche une date, un nom et un lieu.'
            },
            {
                type: 'choice', title: 'Aide Simon à se protéger',
                text: ['Simon est un peu inquiet. Quel est le meilleur conseil ?'],
                options: [
                    { t: '🛡️ Compte en privé, et un mot de passe sans infos perso', ok: true, why: 'Oui ! Et astuce de pro : pour une question secrète, on peut répondre quelque chose de faux… dont on se souvient.' },
                    { t: '🚫 Supprimer tous ses réseaux sociaux', why: 'Un peu radical ! On peut garder ses réseaux en faisant attention à ce qu\'on publie.' },
                    { t: '🔁 Mettre le même mot de passe partout, pour ne pas l\'oublier', why: 'Au contraire : si un site se fait pirater, tous ses comptes tombent.' }
                ]
            }
        ],
        learned: ['Ce qu\'on publie peut servir à deviner nos mots de passe.', 'Un bon mot de passe ne contient ni prénom, ni animal, ni date.', 'Un compte privé limite ce que les inconnus voient.'],
        job: { title: 'Analyste OSINT · Enquêteur·rice cyber', text: 'Dans les entreprises ou les forces de l\'ordre, ils enquêtent à partir d\'informations publiques.' },
        facilitator: {
            goal: 'Prendre conscience de l\'exposition de ses informations personnelles.',
            tips: ['Ne jamais faire chercher le profil réel d\'un visiteur ou d\'une personne présente.', 'Relancer : « Et toi, ta question secrète, quelqu\'un pourrait la trouver ? »']
        }
    },

    /* ═══════════════════════════════ PENTEST ═══════════════════════════════ */
    pentest: {
        n: 4, icon: '🎯', title: 'Le cambrioleur autorisé',
        theme: 'Pentest', duration: '5 min',
        tagline: 'Tester un site… avec la permission.',
        badge: 'Pentesteur·se en herbe',
        steps: [
            {
                type: 'choice', title: 'Avant de commencer',
                text: ['Un **pentesteur** est payé pour attaquer un site et trouver ses failles avant les vrais pirates. Aujourd\'hui, tu testes **BoutiqueDémo**, une boutique en ligne (inventée).'],
                question: 'De quoi as-tu besoin AVANT de commencer ?',
                options: [
                    { t: '📝 L\'autorisation écrite du propriétaire', ok: true, why: 'Indispensable ! Sans autorisation, s\'introduire dans un système est puni par la loi, même « pour tester ».' },
                    { t: '🕶️ Des lunettes de soleil et une capuche', why: 'Ça, c\'est le hacker des films 😄 Dans la vraie vie, il faut surtout une chose : la permission.' },
                    { t: '🤷 Rien, si c\'est pour la bonne cause', why: 'Attention : sans autorisation écrite, c\'est illégal, même avec de bonnes intentions.' }
                ],
                word: { term: 'Pentest', def: 'Test d\'intrusion : une attaque autorisée pour trouver les failles d\'un système.' }
            },
            {
                type: 'choice', title: 'D\'abord, observer',
                text: ['Beaucoup de sites ont un fichier **robots.txt**, qui dit aux robots des moteurs de recherche quelles pages ne pas afficher. Voici celui de BoutiqueDémo :'],
                visual: { kind: 'file', name: 'boutique-demo/robots.txt', lines: ['User-agent: *', 'Disallow: /panier', 'Disallow: /admin-secret', 'Disallow: /images/temp'] },
                question: 'Quelle page semble la plus intéressante à tester ?',
                options: [
                    { t: '/admin-secret', ok: true, why: 'Bien vu ! Ce fichier voulait cacher la page… mais il l\'a surtout signalée. Un panneau, ce n\'est pas un verrou.' },
                    { t: '/panier', why: 'Le panier est normal sur une boutique. Une autre ligne a un nom plus… tentant.' },
                    { t: '/images/temp', why: 'Des images temporaires, peu intéressant. Cherche le mot « admin ».' }
                ]
            },
            {
                type: 'tries', title: 'La porte d\'entrée',
                text: ['La page /admin-secret demande un mot de passe. Beaucoup d\'appareils et de sites gardent leur **mot de passe par défaut**. Essaie les plus courants :'],
                url: 'boutique-demo/admin-secret',
                attempts: [
                    { label: '123456', result: ['❌ Mot de passe incorrect'] },
                    { label: 'motdepasse', result: ['❌ Mot de passe incorrect'] },
                    { label: 'admin', ok: true, result: ['✅ Bienvenue, administrateur !', 'Tableau de bord · 1 284 commandes'] }
                ],
                success: 'Tu es entré·e ! Le mot de passe n\'avait jamais été changé. C\'est une des failles les plus fréquentes.'
            },
            {
                type: 'tries', title: 'Changer un numéro',
                text: ['Tu es connecté·e comme un client normal. Ta commande s\'affiche à cette adresse. Et si tu changes le numéro à la fin ?'],
                url: 'boutique-demo/commande?id=',
                attempts: [
                    { label: '1041', urlSuffix: '1041', result: ['📦 Ta commande n°1041', '1 × Sweat à capuche · Livraison chez toi'] },
                    { label: '1042', urlSuffix: '1042', ok: true, result: ['📦 Commande n°1042 — Mme C. Durand', '12 rue des Lilas · 06 •• •• •• 42', '1 × Casque audio'] }
                ],
                success: 'Oups ! Tu vois la commande et l\'adresse de quelqu\'un d\'autre. Le site ne vérifie pas que la commande t\'appartient.'
            },
            {
                type: 'choice', title: 'Le rapport',
                text: ['Tu as trouvé deux failles graves. Tu es un·e pentesteur·se professionnel·le.'],
                question: 'Que fais-tu maintenant ?',
                options: [
                    { t: '📄 J\'écris un rapport et je préviens le client', ok: true, why: 'Exactement : le vrai travail, c\'est d\'expliquer les failles et comment les corriger.' },
                    { t: '💾 Je télécharge toutes les commandes', why: 'Non ! Un pentesteur prouve la faille, sans jamais prendre ou abîmer les données.' },
                    { t: '📢 Je le poste sur les réseaux', why: 'Surtout pas : les pirates pourraient l\'exploiter avant la correction.' }
                ]
            }
        ],
        learned: ['Un pentest se fait toujours avec une autorisation écrite.', 'Mots de passe par défaut et contrôles oubliés sont des failles courantes.', 'Le vrai livrable du pentesteur, c\'est son rapport.'],
        job: { title: 'Pentesteur·se · Auditeur·rice sécurité', text: 'Ils attaquent (légalement) les systèmes des entreprises pour les rendre plus solides. Certains participent aussi à des programmes de « bug bounty ».' },
        facilitator: {
            goal: 'Découvrir la démarche du pentest (autorisation, reconnaissance, exploitation, rapport) et son cadre légal.',
            tips: ['Insister sur l\'autorisation : accéder sans droit à un système est un délit (art. 323-1 du Code pénal).', 'Rappeler que BoutiqueDémo est une simulation : rien n\'est réellement attaqué.', 'Parler des CTF et de Root-Me pour s\'entraîner légalement.']
        }
    },

    /* ═══════════════════════════════ CRYPTO ═══════════════════════════════ */
    crypto: {
        n: 5, icon: '🔐', title: 'Messages secrets',
        theme: 'Cryptographie', duration: '5 min',
        tagline: 'De Jules César aux cadenas d\'aujourd\'hui.',
        badge: 'Maître des codes',
        steps: [
            {
                type: 'caesar', title: 'Le code de Jules César',
                text: ['Il y a 2 000 ans, César décalait chaque lettre de l\'alphabet. Avec un décalage de 1 : A devient B, B devient C…',
                       'Fais glisser le curseur pour retrouver le message.'],
                message: 'BRAVO TU AS CASSE LE CODE',
                hint: 'Le premier mot a 5 lettres et veut dire « félicitations ».',
                success: 'Message déchiffré ! 🎉'
            },
            {
                type: 'choice', title: 'Un code solide ?',
                text: ['Il n\'existe que 25 décalages possibles.'],
                question: 'Combien de temps faut-il à un ordinateur pour tous les essayer ?',
                options: [
                    { t: '⚡ Moins d\'une seconde', ok: true, why: 'Oui ! C\'est pour ça qu\'aujourd\'hui on utilise des méthodes avec des milliards de milliards de possibilités.' },
                    { t: '📅 Une semaine', why: 'Beaucoup moins ! Un ordinateur fait des millions d\'essais par seconde.' },
                    { t: '♾️ C\'est impossible', why: 'Tu viens de le faire toi-même avec un curseur 😉' }
                ],
                word: { term: 'Chiffrement', def: 'Transformer un message pour que seules les personnes qui ont la clé puissent le lire.' }
            },
            {
                type: 'hash', title: 'L\'empreinte d\'un mot de passe',
                text: ['Les sites sérieux ne gardent pas ton mot de passe, seulement son **empreinte** : un résumé unique, impossible à « défaire ».',
                       'Touche les mots pour voir leur empreinte. Compare « chat », « chats » et « Chat ».'],
                words: [
                    { w: 'chat', h: '31e06f7d89feb99a0e6c0affe198748c' },
                    { w: 'chats', h: 'e3c260f121aa83828564f6074b253af8' },
                    { w: 'Chat', h: '460b3a7da007b7af9d35bca54181dc91' },
                    { w: 'motdepasse', h: '967520ae23e8ee14888bae72809031b9' }
                ],
                need: 3,
                question: 'Qu\'est-ce que tu remarques ?',
                options: [
                    { t: 'Une toute petite différence change toute l\'empreinte', ok: true, why: 'Exactement ! Même une majuscule donne une empreinte complètement différente.' },
                    { t: 'Les empreintes se ressemblent pour des mots proches', why: 'Regarde bien : aucune ressemblance entre « chat » et « chats » !' },
                    { t: 'L\'empreinte contient le mot en entier', why: 'Non : on ne peut pas retrouver le mot en lisant l\'empreinte.' }
                ],
                word: { term: 'Empreinte (hash)', def: 'Un résumé unique d\'une donnée. Le site compare les empreintes sans jamais connaître ton mot de passe.' }
            },
            {
                type: 'choice', title: 'Le cadenas magique',
                text: ['Aujourd\'hui, on utilise des **cadenas** que tout le monde peut fermer, mais que toi seul·e peux ouvrir avec ta clé.',
                       'David veut t\'envoyer un secret par la poste, sans que personne ne puisse le lire en chemin.'],
                question: 'Qu\'envoies-tu à David ?',
                options: [
                    { t: '🔓 Un cadenas ouvert (tu gardes la clé)', ok: true, why: 'Parfait ! David ferme la boîte avec ton cadenas, et toi seul·e peux l\'ouvrir. C\'est le principe de la clé publique et de la clé privée.' },
                    { t: '🔑 Ta clé', why: 'Si ta clé se perd en chemin, n\'importe qui pourra ouvrir tes boîtes !' },
                    { t: '📦 Une boîte sans cadenas', why: 'Le facteur (ou un pirate) pourrait lire le secret.' }
                ],
                word: { term: 'Clé publique / clé privée', def: 'Le cadenas (public) peut être donné à tous ; la clé (privée) ne se partage jamais.' }
            }
        ],
        learned: ['Les anciens codes se cassent en un instant.', 'Les sites stockent une empreinte, pas ton mot de passe.', 'Le cadenas public et la clé privée protègent tes messages et le HTTPS.'],
        job: { title: 'Cryptographe · Ingénieur·e sécurité', text: 'Ils conçoivent et vérifient les systèmes qui protègent nos messages, nos paiements et nos données.' },
        facilitator: {
            goal: 'Découvrir chiffrement, empreinte et clé publique/privée avec des analogies simples.',
            tips: ['Pour le César, laisser chercher : la plupart trouvent en moins d\'une minute.', 'Faire le lien avec le cadenas HTTPS de la mission Réseau et avec WhatsApp/Signal (chiffrement de bout en bout).']
        }
    },

    /* ═══════════════════════════════════════════════════════════════════
       DEUXIÈME CORDÉE (level: 2)
       Pas de bouton indice ni d'explication après une erreur : l'animateur
       accompagne. Les « hint » restent dans les données : ils s'affichent
       uniquement dans l'Espace animateur.
       ═══════════════════════════════════════════════════════════════════ */

    /* ─────────────── RÉSEAU · niveau 2 ─────────────── */
    reseau2: {
        level: 2, n: 1, icon: '🏗️', title: 'L\'architecte du réseau',
        theme: 'Réseau', duration: '10 min',
        tagline: 'Concevoir un réseau qui résiste quand une machine tombe.',
        badge: 'Architecte réseau',
        steps: [
            {
                type: 'info', title: 'Trois zones, trois niveaux de confiance',
                text: ['La start-up **PixelBox** (inventée) ouvre sa boutique en ligne. C\'est toi qui conçois son réseau.',
                       'On le découpe en zones : **Internet** (on ne fait confiance à personne), la **DMZ** (ce qui doit être joignable depuis Internet) et le **réseau interne** (les postes et les données). Un **pare-feu** contrôle tout ce qui passe d\'une zone à l\'autre.'],
                word: { term: 'DMZ', def: 'Zone démilitarisée : une zone tampon qui héberge les serveurs exposés à Internet, isolée du réseau interne.' }
            },
            {
                type: 'assign', title: 'Place chaque élément dans sa zone',
                text: ['Pour chaque élément, choisis la zone où il doit se trouver, puis vérifie.'],
                zones: ['Internet', 'DMZ', 'Réseau interne'],
                items: [
                    { t: '🌍 Un client qui visite la boutique', zone: 'Internet' },
                    { t: '🛒 Serveur web de la boutique', zone: 'DMZ' },
                    { t: '📨 Relais de messagerie', zone: 'DMZ' },
                    { t: '🗄️ Base de données clients', zone: 'Réseau interne' },
                    { t: '💻 PC de la comptable', zone: 'Réseau interne' },
                    { t: '🖨️ Imprimante du bureau', zone: 'Réseau interne' }
                ],
                hint: 'Ce qui doit répondre aux internautes va en DMZ ; les données et les postes de travail restent à l\'intérieur.',
                success: 'Réseau bien découpé : seuls les serveurs qui doivent parler à Internet sont exposés, les données restent à l\'abri.'
            },
            {
                type: 'rules', title: 'Configure le pare-feu',
                text: ['Par défaut, le pare-feu **bloque tout**. Coche uniquement les flux à autoriser.'],
                question: 'Quels flux autorises-tu ?',
                items: [
                    { t: 'Internet → Serveur web (DMZ) · port 443 (HTTPS)', ok: true, why: 'les clients doivent pouvoir accéder à la boutique.' },
                    { t: 'Internet → Base de données (interne) · port 3306', why: 'personne sur Internet n\'a à parler directement à la base.' },
                    { t: 'Serveur web (DMZ) → Base de données (interne) · port 3306', ok: true, why: 'le site a besoin de lire les produits et les commandes.' },
                    { t: 'Internet → PC de la comptable · port 3389 (bureau à distance)', why: 'un bureau à distance exposé est une porte d\'entrée classique des rançongiciels.' },
                    { t: 'Réseau interne → Internet · port 443 (navigation web)', ok: true, why: 'les employés doivent pouvoir naviguer.' },
                    { t: 'Serveur web (DMZ) → Réseau interne · tous les ports', why: 'si le serveur web est piraté, l\'attaquant aurait accès à tout le réseau.' }
                ],
                verify: 'Appliquer les règles',
                hint: 'Autorisés : 443 vers le web, web → base sur 3306, interne → Internet sur 443. Tout le reste reste bloqué.',
                success: 'Pare-feu bien réglé. C\'est le principe du moindre privilège : tout est fermé, on n\'ouvre que le strict nécessaire.'
            },
            {
                type: 'choice', title: 'Le serveur web est piraté',
                text: ['Un attaquant prend le contrôle du serveur web de la boutique.'],
                question: 'Avec ton réseau, jusqu\'où peut-il aller ?',
                options: [
                    { t: 'Seulement vers la base de données, et uniquement sur le port 3306', ok: true, why: 'Exact : la segmentation limite les dégâts. C\'est pour ça qu\'on surveille aussi ce flux et qu\'on donne au site un compte de base de données aux droits minimum.' },
                    { t: 'Partout dans le réseau interne', why: '' },
                    { t: 'Nulle part : une machine en DMZ ne peut pas être piratée', why: '' }
                ],
                hint: 'Regarde les règles que tu as autorisées depuis la DMZ.',
                word: { term: 'Segmentation', def: 'Découper un réseau en zones séparées par des pare-feux, pour qu\'une machine compromise ne donne pas accès à tout.' }
            }
        ],
        learned: ['On découpe un réseau en zones de confiance : Internet, DMZ, réseau interne.', 'Un pare-feu bloque tout par défaut et n\'ouvre que le nécessaire.', 'La segmentation limite les dégâts quand une machine est piratée.'],
        job: { title: 'Architecte réseau et sécurité · Administrateur·rice pare-feu', text: 'Ils conçoivent les réseaux des entreprises et règlent les pare-feux pour qu\'une attaque reste contenue.' },
        facilitator: {
            goal: 'Comprendre la segmentation (Internet / DMZ / interne) et le moindre privilège sur un pare-feu.',
            tips: ['Faire le lien avec mes projets OPNsense (section Projets du cyberfolio).', 'Si blocage sur le pare-feu : « Qui a vraiment besoin de parler à qui ? »']
        }
    },

    /* ─────────────── DEVSECOPS · niveau 2 ─────────────── */
    devsecops2: {
        level: 2, n: 2, icon: '🚰', title: 'Le pipeline qui fuit',
        theme: 'DevSecOps', duration: '10 min',
        tagline: 'Trouver les failles dans de vrais fichiers de configuration.',
        badge: 'Plombier·e DevSecOps',
        steps: [
            {
                type: 'info', title: 'Un pipeline, c\'est du texte',
                text: ['Sur GitHub, un pipeline est décrit dans un fichier **YAML** : à chaque envoi de code, des machines l\'installent, le testent puis le déploient automatiquement.',
                       'Pratique… mais une erreur dans ce fichier peut ouvrir une faille sur tout le projet. Ce site utilise exactement ce mécanisme.'],
                word: { term: 'Workflow', def: 'Fichier qui décrit les étapes automatiques d\'un pipeline GitHub Actions (installation, tests, déploiement).' }
            },
            {
                type: 'spot', title: 'Le fichier de pipeline',
                text: ['Voici le pipeline de la boutique PixelBox (inventée). Repère les **4 lignes** dangereuses.'],
                style: 'code', need: 4,
                items: [
                    { t: 'on: push', why: '' },
                    { t: 'permissions: write-all', bad: true, why: 'Le pipeline a tous les droits sur le dépôt. Il faut le strict minimum, par exemple « contents: read ».' },
                    { t: '  - uses: actions/checkout@<SHA du commit>', why: '' },
                    { t: '  - uses: super-deploy/action@main', bad: true, why: 'Une action tierce prise sur la branche « main » peut être modifiée à tout moment par son auteur. On l\'épingle sur un SHA de commit.' },
                    { t: '  - run: npm test', why: '' },
                    { t: '  - run: deploy --password "Pixel2026!"', bad: true, why: 'Un mot de passe en clair dans le dépôt : toute personne qui lit le code peut l\'utiliser. Il va dans les secrets chiffrés de GitHub.' },
                    { t: '  - run: curl http://outils-deploiement.net/install.sh | bash', bad: true, why: 'On télécharge un script en HTTP (non chiffré, modifiable en route) et on l\'exécute sans le vérifier.' }
                ],
                hint: 'Droits du pipeline, action non épinglée, mot de passe en clair, script téléchargé en HTTP puis exécuté.'
            },
            {
                type: 'spot', title: 'Le Dockerfile',
                text: ['Le **Dockerfile** décrit le conteneur dans lequel tourne l\'appli. Repère les **4 lignes** à corriger.'],
                style: 'code', need: 4,
                items: [
                    { t: 'FROM node:latest', bad: true, why: '« latest » change sans prévenir : on fige une version précise et maintenue.' },
                    { t: 'WORKDIR /app', why: '' },
                    { t: 'COPY . .', bad: true, why: 'Tout le dossier est copié, y compris le fichier .env et ses secrets. Il faut un .dockerignore.' },
                    { t: 'RUN npm ci', why: '' },
                    { t: 'ENV DB_PASSWORD=motdepasse123', bad: true, why: 'Le mot de passe reste lisible dans l\'image par quiconque la télécharge.' },
                    { t: 'USER root', bad: true, why: 'Si l\'appli est piratée, l\'attaquant est administrateur du conteneur. On utilise un utilisateur sans privilèges.' },
                    { t: 'CMD ["node", "server.js"]', why: '' }
                ],
                hint: 'Version non figée, copie de trop de fichiers, mot de passe dans l\'image, utilisateur root.'
            },
            {
                type: 'choice', title: 'Une CVE dans les dépendances',
                text: ['Le scan des dépendances bloque le pipeline : une bibliothèque utilisée par la boutique a une **faille critique connue**.'],
                question: 'Que fais-tu ?',
                options: [
                    { t: 'Je passe à la version corrigée et je relance les tests', ok: true, why: 'Exact : on corrige à la source, et les tests vérifient que rien n\'est cassé.' },
                    { t: 'Je désactive le scan pour pouvoir déployer', why: '' },
                    { t: 'Je déploie : personne ne connaît cette faille', why: '' }
                ],
                hint: 'Une faille « connue » est publique : les attaquants la connaissent aussi.',
                word: { term: 'CVE', def: 'Identifiant public d\'une faille connue (ex. CVE-2021-44228). Les outils de scan comparent tes dépendances à cette liste.' }
            }
        ],
        learned: ['Le fichier de pipeline est aussi sensible que le code.', 'Pas de secret dans un dépôt ou une image : on utilise un coffre à secrets.', 'Versions figées, droits minimum, dépendances à jour.'],
        job: { title: 'Ingénieur·e DevSecOps · AppSec', text: 'Ils sécurisent la chaîne qui fabrique et livre les logiciels, de la première ligne de code à la production.' },
        facilitator: {
            goal: 'Repérer les erreurs classiques dans un workflow GitHub Actions et un Dockerfile.',
            tips: ['Montrer le vrai workflow du cyberfolio (.github/workflows/security.yml) : actions épinglées par SHA, droits en lecture seule.', 'Expliquer « | bash » avec une image : « tu signes un chèque en blanc ».']
        }
    },

    /* ─────────────── OSINT · niveau 2 ─────────────── */
    osint2: {
        level: 2, n: 3, icon: '🗂️', title: 'Enquête sur une entreprise',
        theme: 'OSINT', duration: '10 min',
        tagline: 'Préparer un test de phishing autorisé avec des infos publiques.',
        badge: 'Enquêteur·rice confirmé·e',
        steps: [
            {
                type: 'info', title: 'Une mission autorisée',
                text: ['L\'entreprise **Lumen Logistique** (inventée) t\'a mandaté pour tester la résistance de ses salariés au phishing. Avant d\'écrire le moindre e-mail, tu fais une **reconnaissance** : uniquement avec ce qui est public.',
                       'Comme pour un pentest, ce travail n\'est légal qu\'avec un accord écrit de l\'entreprise.'],
                word: { term: 'Reconnaissance', def: 'Première phase d\'un test : collecter des informations publiques sur la cible pour préparer la suite.' }
            },
            {
                type: 'choice', title: 'Une offre d\'emploi bavarde',
                text: ['Sur un site d\'emploi, tu trouves cette annonce :'],
                visual: { kind: 'file', name: 'Offre — Technicien·ne support H/F · Lumen Logistique', lines: [
                    'Missions : support des 80 utilisateurs, gestion des tickets.',
                    'Environnement : Microsoft 365, VPN Fortinet, GLPI.',
                    'Rattachement : Karim Haddad, responsable informatique.',
                    'Candidature : c.martin@lumen-logistique.fr (RH)'
                ] },
                question: 'Quelle information rendrait un faux e-mail le plus crédible ?',
                options: [
                    { t: 'Les outils : Microsoft 365 et un VPN Fortinet', ok: true, why: 'Exact : un faux message « mise à jour obligatoire du VPN » serait très crédible pour ces salariés. Les offres d\'emploi révèlent souvent l\'environnement technique.' },
                    { t: 'Le nombre d\'utilisateurs', why: '' },
                    { t: 'Le mot « tickets »', why: '' }
                ],
                hint: 'Un bon phishing parle des outils que la victime utilise vraiment.'
            },
            {
                type: 'choice', title: 'Deviner les adresses e-mail',
                text: ['La page « Notre équipe » du site présente : **Paul Lemaire** (directeur), **Sophie Bernard** (directrice financière) et **Karim Haddad** (informatique). L\'annonce donnait l\'adresse de la RH, **Claire Martin** : c.martin@lumen-logistique.fr.'],
                question: 'Quelle est l\'adresse probable de la directrice financière ?',
                options: [
                    { t: 's.bernard@lumen-logistique.fr', ok: true, why: 'Oui : une seule adresse suffit pour déduire le format (initiale du prénom + nom). Ça permet de cibler la finance, très visée par les fraudes au virement.' },
                    { t: 'sophie.bernard@lumen-logistique.fr', why: '' },
                    { t: 'bernard.s@lumen.fr', why: '' }
                ],
                hint: 'Applique le même format que c.martin.'
            },
            {
                type: 'choice', title: 'Les métadonnées d\'un PDF',
                text: ['Tu télécharges la plaquette commerciale publiée sur le site, et tu regardes ses propriétés :'],
                visual: { kind: 'file', name: 'Propriétés — Plaquette_Lumen_2026.pdf', lines: [
                    'Auteur : khaddad',
                    'Application : Microsoft Word 2013',
                    'Créé le : 03/02/2026',
                    'Chemin d\'origine : \\\\SRV-FICHIERS\\Commercial\\Plaquette.docx'
                ] },
                question: 'Qu\'est-ce que ce document révèle ?',
                options: [
                    { t: 'Un format d\'identifiant, une version de Word ancienne et le nom d\'un serveur interne', ok: true, why: 'Exact : trois informations utiles à un attaquant, publiées sans le vouloir. Word 2013 n\'est plus maintenu par Microsoft.' },
                    { t: 'Rien : ce ne sont que des informations techniques', why: '' },
                    { t: 'Seulement la date de création', why: '' }
                ],
                hint: 'Regarde chaque ligne : qui, avec quoi, et où le fichier a été créé.',
                word: { term: 'Métadonnées', def: 'Informations cachées dans un fichier (auteur, logiciel, date, chemin…). À nettoyer avant toute publication.' }
            },
            {
                type: 'choice', title: 'Ton rapport',
                text: ['Ta reconnaissance est terminée. Avant même d\'envoyer un e-mail de test, tu peux déjà conseiller Lumen.'],
                question: 'Quelle recommandation est la plus utile ?',
                options: [
                    { t: 'Nettoyer les métadonnées, limiter les détails techniques dans les offres et sensibiliser la finance au phishing ciblé', ok: true, why: 'Exact : réduire ce qui est public et préparer les personnes les plus visées.' },
                    { t: 'Supprimer la page « Notre équipe » et ne plus publier d\'offres d\'emploi', why: '' },
                    { t: 'Changer le nom de domaine de l\'entreprise', why: '' }
                ],
                hint: 'On ne supprime pas tout : on réduit l\'exposition et on forme les gens.'
            }
        ],
        learned: ['Une entreprise se dévoile sans le vouloir : offres d\'emploi, site, documents.', 'Une seule adresse e-mail suffit pour deviner toutes les autres.', 'Les métadonnées des fichiers publiés sont une fuite fréquente.'],
        job: { title: 'Analyste CTI · Red teamer', text: 'Ils étudient les menaces et simulent de vraies attaques, toujours avec l\'accord de l\'entreprise, pour qu\'elle s\'y prépare.' },
        facilitator: {
            goal: 'Comprendre la reconnaissance OSINT sur une organisation et le cadre légal d\'un test d\'ingénierie sociale.',
            tips: ['Insister sur le mandat écrit : sans lui, c\'est illégal.', 'Faire le lien avec mon projet de cours OSINT (plans de recherche, fiabilité des sources).']
        }
    },

    /* ─────────────── PENTEST · niveau 2 ─────────────── */
    pentest2: {
        level: 2, n: 4, icon: '💉', title: 'Injection SQL pas à pas',
        theme: 'Pentest', duration: '10 min',
        tagline: 'Comprendre la faille web la plus célèbre, puis la corriger.',
        badge: 'Chasseur·se de failles web',
        steps: [
            {
                type: 'info', title: 'Comment un site vérifie ton mot de passe',
                text: ['Quand tu te connectes, le site envoie une question à sa base de données, dans un langage appelé **SQL** :'],
                visual: { kind: 'file', name: 'Requête de connexion', lines: [
                    "SELECT * FROM utilisateurs",
                    "WHERE login = 'ce que tu tapes'",
                    "  AND mdp = 'ce que tu tapes';"
                ] },
                word: { term: 'SQL', def: 'Langage utilisé pour interroger une base de données : chercher, ajouter, modifier des informations.' }
            },
            {
                type: 'sqli', title: 'Entre sans le mot de passe',
                text: ['La boutique **BoutiqueDémo** (simulée, rien n\'est réellement attaqué) construit sa requête en collant ton texte tel quel. Ton objectif : te connecter en tant que **admin** sans connaître son mot de passe.',
                       'Regarde la requête changer pendant que tu tapes. Que se passe-t-il si tu écris une apostrophe ?'],
                hint: 'Identifiant : admin\' --   (le « -- » transforme la fin de la requête en commentaire). Autre solution : \' OR \'1\'=\'1 dans le mot de passe.',
                success: 'Tu es connecté·e comme admin ! Ton apostrophe a fermé le texte, et la vérification du mot de passe a disparu de la requête.'
            },
            {
                type: 'choice', title: 'Pourquoi ça a marché ?',
                text: ['Repense à la requête que tu as vue s\'afficher.'],
                question: 'Quelle est la vraie cause de la faille ?',
                options: [
                    { t: 'Le site mélange mon texte et le code de la requête', ok: true, why: 'Exact : ce que tu tapes devient du code SQL. C\'est la famille « Injection » du classement OWASP des failles web.' },
                    { t: 'Le mot de passe de l\'admin était trop court', why: '' },
                    { t: 'Le site n\'utilise pas HTTPS', why: '' }
                ],
                hint: 'Ton texte a changé le sens de la requête.',
                word: { term: 'OWASP', def: 'Fondation qui publie le classement des failles web les plus critiques (OWASP Top 10), une référence pour les pentesteurs.' }
            },
            {
                type: 'sqli', prepared: true, title: 'Le correctif',
                text: ['Les développeurs utilisent maintenant une **requête préparée** : la requête et ton texte sont envoyés séparément.',
                       'Retente exactement la même attaque.'],
                hint: 'Faire taper admin\' -- : l\'attaque échoue, le texte reste une simple donnée.',
                success: 'L\'attaque échoue : ton texte est traité comme une donnée, jamais comme du code. C\'est la bonne correction.'
            },
            {
                type: 'choice', title: 'Ta recommandation',
                text: ['Tu rédiges le rapport de pentest.'],
                question: 'Que recommandes-tu en priorité ?',
                options: [
                    { t: 'Des requêtes préparées partout, et un compte de base de données aux droits minimum', ok: true, why: 'Exact : on corrige la cause, et on limite les dégâts si une autre faille existe.' },
                    { t: 'Interdire l\'apostrophe dans les formulaires', why: '' },
                    { t: 'Cacher la page de connexion', why: '' }
                ],
                hint: 'On corrige la cause, pas un symptôme. Interdire un caractère se contourne et bloque les « O\'Brien ».'
            }
        ],
        learned: ['Une injection SQL transforme ton texte en code.', 'Une apostrophe qui provoque une erreur est un signal d\'alerte.', 'La correction : les requêtes préparées, pas un filtre sur les caractères.'],
        job: { title: 'Pentesteur·se web · Chasseur·se de bug bounty', text: 'Ils cherchent ces failles dans les applications des entreprises, avec autorisation, et expliquent comment les corriger.' },
        facilitator: {
            goal: 'Comprendre le mécanisme d\'une injection SQL et sa correction par requêtes préparées.',
            tips: ['Rappeler le cadre légal : tester un site sans autorisation est un délit (art. 323-1 du Code pénal). Pour s\'entraîner : Root-Me, plateformes de CTF.', 'Faire taper une seule apostrophe d\'abord : l\'erreur SQL est le meilleur indice.']
        }
    },

    /* ─────────────── CRYPTO · niveau 2 ─────────────── */
    crypto2: {
        level: 2, n: 5, icon: '💾', title: 'La fuite de base de données',
        theme: 'Cryptographie', duration: '10 min',
        tagline: 'Casser des empreintes, puis découvrir comment les protéger.',
        badge: 'Gardien·ne des mots de passe',
        steps: [
            {
                type: 'info', title: 'Une base a fuité',
                text: ['La table des utilisateurs d\'un forum (inventé) circule sur Internet. Les mots de passe n\'y sont pas en clair : seulement leur **empreinte SHA-256**.',
                       'Mais un attaquant n\'a pas besoin de « défaire » l\'empreinte : il calcule celle de mots de passe courants et compare.'],
                word: { term: 'Attaque par dictionnaire', def: 'Tester une liste de mots de passe probables en comparant leurs empreintes à celles de la fuite.' }
            },
            {
                type: 'crack', title: 'Lance l\'attaque',
                text: ['Lance l\'attaque avec la liste ci-dessous et observe le résultat.'],
                users: [
                    { u: 'admin', h: '240be518fabd2724' },
                    { u: 'marilou', h: 'e93e24c1b877a15d' },
                    { u: 'simon', h: '0065ac2f17d68ac6' },
                    { u: 'david', h: 'ff204d12e1fb5f85' },
                    { u: 'nora', h: 'e93e24c1b877a15d' },
                    { u: 'hugo', h: '5318d40e1a888f48' }
                ],
                wordlist: [
                    { w: '123456', h: '8d969eef6ecad3c2' }, { w: 'motdepasse', h: '967520ae23e8ee14' },
                    { w: 'admin123', h: '240be518fabd2724' }, { w: 'azerty', h: 'f2d81a260dea8a10' },
                    { w: 'soleil', h: 'e93e24c1b877a15d' }, { w: 'Sanka2007', h: '0065ac2f17d68ac6' },
                    { w: 'chocolat', h: '8d16498453b03d44' }, { w: 'iloveyou', h: 'e4ad93ca07acb8d9' }
                ],
                hint: 'Il suffit de cliquer sur « Lancer l\'attaque » : 4 mots de passe sur 6 tombent.',
                success: '4 comptes sur 6 cassés en quelques secondes, avec seulement 8 mots testés.'
            },
            {
                type: 'choice', title: 'Un détail troublant',
                text: ['Regarde les empreintes de marilou et de nora.'],
                question: 'Qu\'est-ce que ça signifie ?',
                options: [
                    { t: 'Elles ont le même mot de passe', ok: true, why: 'Exact : sans protection supplémentaire, même mot de passe = même empreinte. Casser l\'un, c\'est casser l\'autre.' },
                    { t: 'C\'est un bug de la base de données', why: '' },
                    { t: 'Elles ont le même compte', why: '' }
                ],
                hint: 'Une empreinte dépend uniquement du texte d\'origine.'
            },
            {
                type: 'crack', salted: true, title: 'Ajoutons du sel',
                text: ['Le forum stocke désormais chaque mot de passe avec un **sel** : une valeur aléatoire, différente pour chaque utilisateur, ajoutée avant le calcul de l\'empreinte.',
                       'Mêmes mots de passe qu\'avant. Relance exactement la même attaque.'],
                users: [
                    { u: 'admin', salt: 'a3f9', h: 'e1aecdba1e8f3ef5' },
                    { u: 'marilou', salt: '7c21', h: 'c90a030c49287794' },
                    { u: 'simon', salt: 'e04b', h: 'e9d94c56bf3aedbb' },
                    { u: 'david', salt: '19d6', h: '196008bcf4071ae4' },
                    { u: 'nora', salt: '5b8e', h: '2f1f3a6d562bfcc2' },
                    { u: 'hugo', salt: 'c2a7', h: '4af5d365dcffb918' }
                ],
                wordlist: [
                    { w: '123456', h: '8d969eef6ecad3c2' }, { w: 'motdepasse', h: '967520ae23e8ee14' },
                    { w: 'admin123', h: '240be518fabd2724' }, { w: 'azerty', h: 'f2d81a260dea8a10' },
                    { w: 'soleil', h: 'e93e24c1b877a15d' }, { w: 'Sanka2007', h: '0065ac2f17d68ac6' },
                    { w: 'chocolat', h: '8d16498453b03d44' }, { w: 'iloveyou', h: 'e4ad93ca07acb8d9' }
                ],
                hint: 'Lancer l\'attaque : aucun mot de passe ne tombe, et marilou et nora n\'ont plus la même empreinte.',
                success: 'Plus rien ne correspond, et marilou et nora n\'ont plus la même empreinte. L\'attaquant devrait tout recalculer pour chaque utilisateur, avec son sel.'
            },
            {
                type: 'choice', title: 'Comment stocker les mots de passe ?',
                text: ['Tu conseilles les développeurs du forum.'],
                question: 'Quelle méthode recommandes-tu ?',
                options: [
                    { t: 'Un algorithme lent conçu pour ça (Argon2, bcrypt), avec un sel unique par utilisateur', ok: true, why: 'Exact : le sel empêche les comparaisons en masse, et la lenteur rend chaque essai coûteux pour l\'attaquant.' },
                    { t: 'SHA-256 sans sel, c\'est déjà illisible', why: '' },
                    { t: 'En clair, mais dans une base protégée par un mot de passe', why: '' }
                ],
                hint: 'Il faut à la fois un sel et un algorithme volontairement lent.',
                word: { term: 'Sel', def: 'Valeur aléatoire unique ajoutée à chaque mot de passe avant le calcul de l\'empreinte.' }
            }
        ],
        learned: ['Une empreinte sans sel se casse avec une simple liste de mots courants.', 'Même mot de passe = même empreinte, sauf avec un sel.', 'Pour stocker des mots de passe : Argon2 ou bcrypt, avec un sel unique.'],
        job: { title: 'Ingénieur·e sécurité · Cryptographe', text: 'Ils choisissent et vérifient la façon dont les applications protègent les données sensibles, comme les mots de passe.' },
        facilitator: {
            goal: 'Comprendre l\'attaque par dictionnaire, le rôle du sel et des algorithmes de hachage lents.',
            tips: ['Faire remarquer que « Sanka2007 » vient de la mission OSINT : les missions se répondent.', 'Rappeler le lien avec haveibeenpwned.com pour vérifier si son e-mail a fuité.']
        }
    }

};

/* Profil fictif utilisé par la mission OSINT (visual.kind = "posts") */
window.MISSION_PROFILES = {
    simon: {
        name: 'Simon D.', handle: '@simon.d_07', bio: 'Étudiant · Foot ⚽ · Mon chat = ma vie',
        posts: ['🎂 19 ans aujourd\'hui ! Merci pour tous vos messages (12 mars)', '😺 Sanka a encore mangé ma chaussette…', '🍝 Les pâtes au pesto, meilleur repas du monde', '🏫 Premier jour à la fac Jean-Moulin, rentrée en licence !']
    }
};
