/* ════════════════════════════════════════════════════════════════════
   CYBERFOLIO — Fichier de données
   ════════════════════════════════════════════════════════════════════

   Structure :
   - portfolioData.identity       → nom, pseudo, baseline, description
   - portfolioData.contact        → email, LinkedIn, GitHub
   - portfolioData.cta            → boutons CV, GitHub, LinkedIn du hero
   - portfolioData.skills         → compétences groupées par catégorie
   - portfolioData.projects       → projets / labs / writeups
   - portfolioData.certifications → certifs obtenues + en cours
   - portfolioData.timeline       → expériences et engagements

   ════════════════════════════════════════════════════════════════════ */

const portfolioData = {

    /* ── IDENTITÉ ────────────────────────────────────────────────── */
    identity: {
        fullName: "Damien Dathueyt",
        pseudo: "Zyphang",
        baseline: "Cybersécurité & gouvernance · Guardia B1 · Lyon",
        // Paragraphe de présentation (utilise de balise <strong>...</strong> pour mettre en valeur)
        description: `Reconverti vers la cybersécurité après plusieurs années dans la
            <strong>restauration haut de gamme et le bar en palace</strong>, j'apporte
            au métier ce que ces environnements m'ont enseigné : rigueur, sang-froid sous
            pression et sens du client. Étudiant à <strong>Guardia Cybersecurity School</strong>,
            membre du <strong>CLUSIR Auvergne-Rhône-Alpes</strong> et compétiteur Root-Me Pro lors d'atelier ou de CTF,
            je m'oriente vers les métiers GRC et le conseil cyber.
            Recherche stage de fin de B2 principalement dans un grand groupe ou le secteur public.`,
        // Texte d'introduction de la section contact
        contactIntro: "Disponible pour échanger sur un stage de fin de B2 principalement grand groupe, secteur public/défense, région lyonnaise."
    },

    /* ── CONTACT ─────────────────────────────────────────────────────

       ────────────────────────────────────────────────────────────── */
    contact: {
        emailLocal: "dathueyt",      // partie avant le @ (anti-scraping)
        emailDomain: "proton.me",    // partie après le @ (anti-scraping)
        linkedinUrl: "https://www.linkedin.com/in/damien-dathueyt",
        linkedinLabel: "linkedin.com/in/damien-dathueyt",
        githubUrl: "https://github.com/Zyphang",
        githubLabel: "github.com/Zyphang"
    },

    /* ── CTA (boutons du hero) ──────────────────────────────────────
       Pour activer le bouton CV :  CV à assets/docs/CV.pdf
       puis passe "enabled: true". Tant qu'il est false, le bouton n'apparaît pas.
       ────────────────────────────────────────────────────────────── */
    cta: {
        cv: { enabled: false, label: "CV.pdf", href: "assets/docs/CV.pdf" },
        github: { enabled: true, label: "github.com/Zyphang" },
        linkedin: { enabled: true, label: "LinkedIn" }
    },

    /* ── COMPÉTENCES ─────────────────────────────────────────────────
       Niveaux suggérés (adopte ce qui te ressemble, mais reste honnête) :
       "notions" → "en cours" → "opérationnel" → "à l'aise" → "expert"
       Pour un B1, "notions" et "en cours" sont les plus crédibles.
       Tu peux ajouter / supprimer des catégories sans toucher au reste.
       ────────────────────────────────────────────────────────────── */
    skills: [
        {
            category: "GRC",
            items: [
                { name: "Gestion de crise",   level: "notions" },
                { name: "Cryptographie",      level: "notions" },
                { name: "DevSecOps",          level: "notions" }
            ]
        },
        {
            category: "Réseau / OS",
            items: [
                { name: "Linux",              level: "notions" },
                { name: "Windows",            level: "notions" },
                { name: "Réseau (TCP/IP)",    level: "notions" }
            ]
        },
        {
            category: "Langages",
            items: [
                { name: "Python · C++",       level: "notions" },
                { name: "HTML / CSS",         level: "notions" },
                { name: "PHP / MySQL",        level: "notions" }
            ]
        },
        {
            category: "Outils",
            items: [
                { name: "Burp Suite",         level: "notions" },
                { name: "Git / GitHub",       level: "notions" },
                { name: "Root-Me Pro",        level: "en cours" }
            ]
        }
    ],

    /* ── PROJETS ─────────────────────────────────────────────────────
       Pour ajouter un projet : copie un bloc { … }, remplis-le.
       url: laisse "" si pas de lien. Sinon mets un lien GitHub / writeup.
       ────────────────────────────────────────────────────────────── */
    projects: [
        {
            title: "Atelier gestion de crise cyber",
            year: "2026",
            description: "Simulation d'une connexion externe sur un E-mail d'une PME fictive : déclenchement de la cellule de crise, communication interne/externe, coordination technique-juridique-direction.",
            tags: ["Detection", "Stratégie", "Incertitude"],
            url: ""
        },
        {
            title: "Projet cryptographie",
            year: "2026",
            description: "Étude des algorithmes symétriques et asymétriques (AES, RSA), implémentation pédagogique en Python pour un système de messagerie.",
            tags: ["Cryptographie", "Python", "AES · RSA"],
            url: ""
        },
        {
            title: "Initiation DevSecOps",
            year: "2025",
            description: "Intégration d'outils de sécurité (SAST, dépendance scanning) dans une pipeline CI/CD GitHub Actions sur un projet web simple.",
            tags: ["DevSecOps", "CI/CD", "SAST"],
            url: ""
        }
        // → Ajoute d'autres projets ici en copiant le bloc ci-dessus
    ],

    /* ── CERTIFICATIONS ──────────────────────────────────────────────
       status: "obtained" → encadré vert
       status: "pending"  → encadré ambre pointillé (= en cours / à venir)
       ────────────────────────────────────────────────────────────── */
    certifications: [
        {
            status: "obtained",
            title: "MOOC SecNumacadémie",
            meta: "ANSSI"
        },
        {
            status: "pending",
            title: "CompTIA Security+",
            meta: "objectif B2/B3"
        }
        // → Ajoute d'autres certifs ici
    ],

    /* ── TIMELINE / EXPÉRIENCE ──────────────────────────────────────
       state: "current" → puce bleue (engagement actuel)
       state: "past"    → puce grise (expérience passée)
       ────────────────────────────────────────────────────────────── */
    timeline: [
        {
            state: "current",
            title: "Membre — CLUSIR Auvergne-Rhône-Alpes",
            period: "2025 — présent",
            description: "Participation aux événements et conférences cyber lyonnaises, networking avec les RSSI de la région."
        },
        {
            state: "current",
            title: "Compétiteur — Root-Me Pro & CTF Guardia",
            period: "en continu",
            description: "Challenges réguliers sur Root-Me Pro, participation à un CTF en équipe avec Guardia Cybersecurity School."
        },
        {
            state: "past",
            title: "Restauration haut de gamme & bar de palace",
            period: "expérience pro",
            description: "Plusieurs années en environnement exigeant : gestion du stress, relation client de haut niveau, rigueur opérationnelle : soft skills directement transférables au conseil et à la GRC."
        }
        // → Ajoute d'autres expériences ici
    ]
};

// Expose la donnée à main.js
if (typeof window !== "undefined") {
    window.portfolioData = portfolioData;
}
