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
                    { t: '📖 Le DNS, l\'annuaire d\'Internet', ok: true, why: 'Oui ! Le DNS traduit « monjeu.fr » en adresse IP, comme un annuaire traduit un nom en numéro.' },
                    { t: '🗺️ Une application de cartes', why: 'Pas tout à fait : les cartes trouvent des lieux, pas des sites. Cherche plutôt un « annuaire ».' },
                    { t: '🎲 Le téléphone devine au hasard', why: 'Heureusement non ! Il demande à un service spécialisé, comme un annuaire.' }
                ],
                word: { term: 'DNS', def: 'L\'annuaire d\'Internet : il transforme un nom de site en adresse IP.' }
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
    }
};

/* Profil fictif utilisé par la mission OSINT (visual.kind = "posts") */
window.MISSION_PROFILES = {
    simon: {
        name: 'Simon D.', handle: '@simon.d_07', bio: 'Étudiant · Foot ⚽ · Mon chat = ma vie',
        posts: ['🎂 19 ans aujourd\'hui ! Merci pour tous vos messages (12 mars)', '😺 Sanka a encore mangé ma chaussette…', '🍝 Les pâtes au pesto, meilleur repas du monde', '🏫 Premier jour à la fac Jean-Moulin, rentrée en licence !']
    }
};
