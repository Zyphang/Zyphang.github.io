# 🛡️ Cyberfolio — Damien Dathueyt (Zyphang)

Portfolio cybersécurité statique, hébergé sur GitHub Pages.
**Stack** : HTML5 / CSS3 / JavaScript natif — aucune dépendance, aucun build.

---

## 🚀 Déploiement sur GitHub Pages — pas-à-pas

### Étape 1 — Créer le dépôt sur GitHub

Sur GitHub.com, crée un nouveau dépôt nommé **exactement** :

```
Zyphang.github.io
```

> ⚠️ Le nom doit être `<TonPseudoGitHub>.github.io` (insensible à la casse) pour bénéficier de l'URL par défaut **`https://zyphang.github.io/`**.

Coche **Public** (obligatoire pour GitHub Pages gratuit) et laisse les options « Add a README » / `.gitignore` / licence **décochées** (on a déjà tout ce qu'il faut).

### Étape 2 — Pousser les fichiers depuis ton ordinateur

Ouvre un terminal dans le dossier `cyberfolio/`, puis :

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial cyberfolio"
git remote add origin https://github.com/Zyphang/Zyphang.github.io.git
git push -u origin main
```

> 💡 Si tu n'as pas encore configuré Git :
> ```bash
> git config --global user.name  "Damien Dathueyt"
> git config --global user.email "ton-email-git@example.com"
> ```

### Étape 3 — Activer GitHub Pages

1. Sur ton dépôt, va dans **Settings → Pages**.
2. Sous **Source**, choisis **Deploy from a branch**.
3. Branche : `main`, dossier : `/ (root)`. Clique **Save**.
4. Patiente 1–2 minutes. Une bannière verte apparaît : *« Your site is live at https://zyphang.github.io/ »*.

✅ **Ton site est en ligne.**

### Étape 4 — Mettre à jour le contenu

À chaque modification :
```bash
git add .
git commit -m "docs: update projets"
git push
```
Le site se redéploie automatiquement (~30 sec).

---

## 🛠️ Tester en local avant de pousser

GitHub Pages affiche le site exactement comme il l'est dans ton dossier. Pour le prévisualiser :

**Option A — Ouvre simplement `index.html`** dans ton navigateur (suffisant 90 % du temps).

**Option B — Avec un serveur local** (recommandé, plus fidèle au comportement GitHub Pages) :
```bash
# Si tu as Python (préinstallé sur Linux/Mac, à installer sur Windows)
python3 -m http.server 8000
# Puis ouvre http://localhost:8000
```

---

## 📂 Architecture du projet

```
cyberfolio/
├── index.html              # Page principale (one-page scroll)
├── 404.html                # Page d'erreur custom
├── robots.txt              # SEO — autorisation des bots Google
├── sitemap.xml             # SEO — plan du site (à mettre à jour si tu changes l'URL)
├── README.md               # Ce fichier
└── assets/
    ├── css/
    │   └── styles.css      # 100% des styles + variables CSS
    ├── js/
    │   ├── data.js         # ★ TON CONTENU (édite ici)
    │   └── main.js         # Logique d'injection + interactions
    ├── img/
    │   ├── favicon.svg     # Icône d'onglet
    │   └── og-image.png    # (à ajouter) image Open Graph 1200×630
    └── docs/
        └── CV.pdf          # (à ajouter) ton CV pour le bouton de téléchargement
```

---

## ✏️ Comment modifier le contenu

**95 % des modifications se font dans `assets/js/data.js`.** Pas besoin de toucher au HTML/CSS.

### Ajouter un projet
Ouvre `data.js`, trouve `projects:` et ajoute un objet :
```js
{
    title: "Nom du projet",
    year: "2026",
    description: "Une à deux phrases qui décrivent.",
    tags: ["pentest", "python"],
    url: "https://github.com/Zyphang/mon-projet"  // ou "" si pas de lien
}
```

### Ajouter une certification
```js
{
    status: "obtained",         // ou "pending"
    title: "CompTIA Security+",
    meta: "obtenue 2026"
}
```

### Mettre à jour ton email / LinkedIn / GitHub
Section `contact:` dans `data.js`. Note que l'email est volontairement séparé en deux champs (`emailLocal` et `emailDomain`) pour éviter le scraping.

### Activer le bouton "Télécharger CV"
1. Place ton CV à `assets/docs/CV.pdf`.
2. Dans `data.js`, passe `cta.cv.enabled` à `true`.

### Changer les couleurs
Toute la palette est dans `assets/css/styles.css`, en haut du fichier, dans `:root { ... }`.
Modifie `--color-accent` (l'accent bleu) si tu veux changer la couleur principale partout en une ligne.

---

## ⚙️ À personnaliser avant le premier push

Cherche-remplace ces chaînes dans le code :

| Fichier | Chaîne à remplacer | Par |
|---|---|---|
| `index.html` | `https://zyphang.github.io/` | Ton URL réelle (4 occurrences) |
| `sitemap.xml` | `https://zyphang.github.io/` | Ton URL réelle |
| `robots.txt` | `https://zyphang.github.io/` | Ton URL réelle |
| `README.md` | `Zyphang` | Ton pseudo GitHub |

> 💡 Sur Linux/Mac, en une commande depuis le dossier racine :
> `grep -rl 'zyphang.github.io' . | xargs sed -i 's|zyphang.github.io|TON-VRAI-DOMAINE|g'`

---

## 🎨 Image Open Graph (LinkedIn / réseaux sociaux)

Quand quelqu'un partage le lien de ton portfolio sur LinkedIn, c'est cette image qui s'affiche.

**Dimensions** : 1200×630 px (ratio 1.91:1)
**Format** : PNG ou JPG
**Outil gratuit** : [Canva](https://canva.com), [Figma](https://figma.com), ou [og-image.vercel.app](https://og-image.vercel.app/)

Place le fichier à `assets/img/og-image.png`.

---

## ⚡ Performance & accessibilité

- **Lighthouse** visé : >95 sur toutes les métriques (Performance, Accessibilité, Bonnes pratiques, SEO).
- **Aucune dépendance** JavaScript externe (pas de jQuery, pas de framework).
- **Polices** chargées avec `display=swap` pour éviter le FOIT.
- **WCAG AA** : contraste suffisant, focus clavier visible, skip link, attributs ARIA.
- **`prefers-reduced-motion`** respecté : les animations s'arrêtent pour les utilisateurs sensibles.

Pour vérifier toi-même : ouvre Chrome DevTools → onglet **Lighthouse** → Generate Report.

---

## 🔒 Sécurité OPSEC

Lis le **guide OPSEC** fourni dans la conversation. Points clés :

- ✅ Email **alias dédié** ProtonMail (`dathueyt@proton.me`) — pas l'email perso
- ✅ Email **obfusqué** : assemblé côté client uniquement, jamais en clair dans le HTML
- ✅ **Pas de numéro de téléphone**, pas d'adresse postale, pas de date de naissance
- ✅ **Avant chaque commit** : audit avec `gitleaks` ou `git secrets` pour ne jamais push de credential

---

## 🆘 FAQ rapide

**Q : Je vois `404 page not found` après avoir activé GitHub Pages.**
A : Patiente 2-3 minutes, le déploiement initial peut prendre du temps. Vérifie aussi que le repo s'appelle bien `Zyphang.github.io` (pas un autre nom).

**Q : Mes modifications ne s'affichent pas après un push.**
A : Vide le cache du navigateur (`Ctrl+Shift+R` / `Cmd+Shift+R`). GitHub Pages peut aussi prendre 30-60 sec pour rebuilder.

**Q : Je veux un nom de domaine personnalisé (ex: `damien-dathueyt.fr`).**
A :
1. Achète le domaine (Gandi, Namecheap, OVH ~12€/an).
2. Ajoute un fichier `CNAME` à la racine contenant juste `damien-dathueyt.fr`.
3. Chez ton registrar, configure le DNS comme indiqué [ici](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
4. Dans Settings → Pages, coche **Enforce HTTPS**.

**Q : Comment ajouter un mode clair (light mode) plus tard ?**
A : Toutes les couleurs sont dans `:root` du CSS. Il suffit d'ajouter un `[data-theme="light"]` avec les mêmes variables redéfinies, et un toggle JS qui change l'attribut sur `<html>`.

---

## 📝 Licence

Code source : libre de réutilisation pour ton propre portfolio. Le contenu (textes, projets) reste la propriété de Damien Dathueyt.

---

*Dernière mise à jour : avril 2026*
