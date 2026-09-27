# Cyberfolio — Damien Dathueyt (Zyphang)

Portfolio cybersécurité statique publié sur **https://zyphang.github.io/**.
HTML / CSS / JavaScript natif, aucune dépendance, aucun build, aucune ressource tierce.

```
.
├── index.html                  Profil · Compétences · Projets · Certifications · Expérience · Atelier · Contact
├── atelier.html                Accueil de l'atelier : choix des missions, badges
├── mission.html                Page unique des missions (mission.html?m=reseau|devsecops|osint|pentest|crypto)
├── express.html                Parcours express : mot de passe + phishing (2 min)
├── animateur.html              Fiches animateur (réponses, relances), non indexée
├── 404.html
├── assets/
│   ├── css/styles.css          Styles + palette (variables en haut du fichier)
│   ├── css/atelier.css
│   ├── js/guard.js             Anti-clickjacking + thème (chargé en premier)
│   ├── js/main.js              Menu, thème, onglets, filtres, email
│   ├── js/missions-data.js     ★ Contenu des missions (textes, questions, réponses)
│   ├── js/mission.js           Moteur des missions
│   ├── js/kiosk.js             Plein écran, badges, retour auto après 3 min
│   ├── js/express.js           Parcours express
│   ├── js/animateur.js         Génère les fiches animateur
│   └── img/                    favicon, QR code de l'atelier
├── .well-known/security.txt    Contact de divulgation (RFC 9116)
├── .nojekyll                   Nécessaire pour publier .well-known/
├── tools/check-security.sh     Contrôles de sécurité (aussi lancés par la CI)
├── .github/workflows/security.yml
├── .github/dependabot.yml
└── SECURITY.md
```

## Modifier le contenu

Tout le contenu est **directement dans `index.html`**, section par section (repère les bandeaux `═══ 01 · PROFIL ═══`, etc.).
Pas de fichier de données ni de rendu JavaScript : le site s'affiche même sans JS et aucun contenu n'est injecté dans la page.

- **Textes à compléter** : tout ce qui est en orange sur le site (`class="todo"` / `todo-block` dans le code). Remplace le texte et retire la classe.
- **Compétence** : copie un `<li class="skill" data-level="1">`. Niveaux : 1 notions · 2 en progression · 3 opérationnel · 4 confirmé.
- **Projet** : le plus simple, `bash tools/nouveau-projet.sh` (il pose les questions et ajoute la carte en tête de la section). À la main : copie un `<article class="card project" data-type="…">` ; `data-type` = `cours`, `perso` ou `prod` (utilisé par le filtre). Ne supprime pas le repère `NOUVEAU PROJET` dans `index.html`.
- **Certification** : `cert cert-done` (obtenue) ou `cert cert-planned` (prévue).
- **Expérience** : copie un `<li class="tl-item" data-type="…">`. `data-type` = `stage`, `ctf`, `clusir` ou `avant`.
- **CV** : dépose `assets/docs/CV.pdf` et décommente le bouton dans la section Profil (pense à retirer les métadonnées du PDF : `exiftool -all= CV.pdf`).
- **Email** : il est stocké en Base64, en deux morceaux (`data-u` / `data-d` du bouton « Afficher »). Pour le changer :
  `printf 'nouveau' | base64` et `printf 'domaine.fr' | base64`.

Avant chaque push : `bash tools/check-security.sh`.

## Atelier (journées portes ouvertes)

Pensé pour un public **débutant, jeune et parfois timide** : tout se fait au toucher (presque pas de clavier),
chaque mission dure environ 5 minutes, se joue seul·e, chaque erreur donne une explication et un nouvel essai,
et chaque fin de mission présente un badge et le métier correspondant.

| Mission | Thème | Ce que le visiteur fait |
|---|---|---|
| 🌐 Le voyage d'un message | Réseau | Remet le trajet d'un paquet dans l'ordre, découvre le DNS, « espionne » un Wi-Fi public (HTTP vs HTTPS) |
| ⚙️ L'usine à applis | DevSecOps | Remet un pipeline dans l'ordre, repère 3 erreurs dans du code, réagit à une alerte de sécurité |
| 🔍 Le détective d'Internet | OSINT | Retrouve la question secrète et le mot de passe d'un personnage fictif grâce à ses publications |
| 🎯 Le cambrioleur autorisé | Pentest | Autorisation, robots.txt, mot de passe par défaut, IDOR, rapport (site simulé) |
| 🔐 Messages secrets | Crypto | Casse un code de César, compare des empreintes SHA-256, comprend clé publique / clé privée |
| ⚡ Parcours express | Réflexes | Force d'un mot de passe + quiz phishing |

**Sur le stand** : bouton *Plein écran*, bouton *Nouveau joueur* (efface les badges), retour automatique à l'accueil
de l'atelier après 3 minutes d'inactivité. Tout fonctionne hors ligne une fois la page chargée.
Les fiches animateur (objectifs, bonnes réponses, relances) sont sur `animateur.html` (lien discret en pied de page, imprimable).

**Modifier ou ajouter une mission** : tout est dans `assets/js/missions-data.js` (types d'étapes documentés en tête de fichier).
Pour une nouvelle mission, ajoute un bloc dans `window.MISSIONS` et une carte dans `atelier.html` avec `data-mission-card="<id>"`.

## Sécurité

### Ce qui est en place

| Menace | Protection |
|---|---|
| XSS / injection de script | CSP stricte en `<meta>` : `default-src 'none'`, `script-src 'self'`, aucun `unsafe-inline` ni `unsafe-eval` |
| DOM-XSS | **Trusted Types** imposés (`require-trusted-types-for 'script'; trusted-types 'none'`) : `innerHTML`, `eval` & co lèvent une erreur. Le JS n'utilise que `textContent` |
| Compromission d'un CDN / supply chain | Zéro ressource tierce : pas de CDN, de police Google, d'analytics ni de bibliothèque |
| Exfiltration de données | `connect-src 'none'`, `form-action 'none'`, aucun formulaire, aucun cookie |
| Clickjacking | `guard.js` masque la page si elle est chargée dans une iframe et tente d'en sortir |
| Injection de `<base>` / plugins | `base-uri 'none'`, `object-src 'none'` |
| Fuite de l'URL vers les sites tiers | `<meta name="referrer" content="no-referrer">` et `rel="noopener noreferrer"` sur les liens externes |
| Contenu mixte | `upgrade-insecure-requests` + HTTPS forcé par GitHub Pages |
| Spam / scraping d'email | Adresse jamais en clair dans le code, assemblée au clic |
| Secrets poussés par erreur | gitleaks dans la CI à chaque push et chaque lundi |
| Régression de sécurité | `tools/check-security.sh` bloque la CI si une page perd sa CSP, contient du code inline, une ressource externe ou un sink DOM-XSS |
| Actions GitHub compromises | Actions épinglées par SHA de commit, jeton en lecture seule, mises à jour via Dependabot |
| Divulgation responsable | `security.txt` (RFC 9116) + `SECURITY.md` |

### Limites connues (à assumer, et à savoir expliquer en entretien)

GitHub Pages **ne permet pas d'envoyer d'en-têtes HTTP personnalisés**. Donc :
- `frame-ancestors`, `report-uri` et `sandbox` sont ignorés en `<meta>` → l'anti-clickjacking repose sur JavaScript ;
- pas de `Permissions-Policy`, `X-Content-Type-Options`, `Cross-Origin-Opener-Policy` ni de HSTS avec `preload` contrôlés par toi.

Pour aller au bout : un **nom de domaine perso derrière Cloudflare** (offre gratuite) avec des *Transform Rules* qui ajoutent ces en-têtes. Le site obtiendrait alors un A+ sur securityheaders.com.

### Réglages GitHub à activer (5 minutes)

- [ ] **Compte** : double authentification (clé d'accès / passkey ou application TOTP, pas SMS).
- [ ] **Settings → Pages** : *Enforce HTTPS* coché.
- [ ] **Settings → Code security** : *Private vulnerability reporting*, *Dependabot alerts*, *Dependabot security updates*, *Secret scanning* et *Push protection* activés.
- [ ] **Settings → Actions → General** : *Workflow permissions* = « Read repository contents » ; exiger une approbation pour les workflows venant de forks.
- [ ] **Settings → Rules → Rulesets** sur `main` : bloquer le force push et la suppression, exiger le passage des « Contrôles de sécurité », exiger des commits signés.
- [ ] **Commits signés** : `git config --global gpg.format ssh`, `git config --global user.signingkey ~/.ssh/id_ed25519.pub`, `git config --global commit.gpgsign true`, puis ajouter la clé comme *Signing key* sur GitHub.
- [ ] Si tu passes à un domaine perso : **vérifie le domaine** dans les paramètres Pages de ton compte (évite le *subdomain takeover*).

## Tester en local

```bash
python3 -m http.server 8000     # puis http://localhost:8000
bash tools/check-security.sh
```

---
*Code réutilisable librement. Contenu (textes, parcours) © Damien Dathueyt.*
