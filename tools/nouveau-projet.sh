#!/usr/bin/env bash
# Ajoute une carte dans la section Projets d'index.html en répondant à quelques questions.
# Utilisation (depuis Git Bash, dans le dossier du site) :  bash tools/nouveau-projet.sh
set -euo pipefail
cd "$(dirname "$0")/.."

FILE="index.html"
MARK="NOUVEAU PROJET : ne pas supprimer ce repère"
grep -qF "$MARK" "$FILE" || { echo "✗ Repère introuvable dans $FILE : la carte ne peut pas être ajoutée."; exit 1; }

# Échappe le HTML : ce que tu tapes s'affiche tel quel, rien n'est interprété comme du code.
esc() { printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' -e 's/"/\&quot;/g'; }
trim() { local s="$1"; s="${s#"${s%%[![:space:]]*}"}"; printf '%s' "${s%"${s##*[![:space:]]}"}"; }

echo "── Nouveau projet ──────────────────────────────"
read -rp "Titre du projet : " title
[ -n "$(trim "$title")" ] || { echo "✗ Le titre est obligatoire."; exit 1; }
read -rp "Année (ex. 2026) : " year
echo "Type :  1) Cours   2) Perso   3) En prod"
read -rp "Choix [1-3] : " choice
case "$choice" in
  1) type="cours"; badge='<span class="badge">Cours</span>' ;;
  2) type="perso"; badge='<span class="badge badge-perso">Perso</span>' ;;
  3) type="prod";  badge='<span class="badge badge-prod">En prod</span>' ;;
  *) echo "✗ Choix invalide."; exit 1 ;;
esac
read -rp "Description (2–3 phrases : contexte, ce que tu as fait, résultat) : " desc
read -rp "Tags séparés par des virgules (ex. Python, OSINT, GRC) : " tags
read -rp "Lien vers le projet (https://…, laisse vide si aucun) : " url
url="$(trim "$url")"
if [ -n "$url" ] && ! [[ "$url" =~ ^https://[A-Za-z0-9./?=_%:#~+@-]+$ ]]; then
  echo "✗ Lien refusé : il doit commencer par https:// et ne contenir que des caractères d'URL simples."; exit 1
fi

tag_html=""
IFS=',' read -ra parts <<< "$tags"
for t in "${parts[@]}"; do
  t="$(trim "$t")"; [ -n "$t" ] && tag_html+="<li>$(esc "$t")</li>"
done

card="$(mktemp)"
{
  echo "                <article class=\"card project\" data-type=\"$type\">"
  echo "                    <div class=\"card-meta\">$badge<span>$(esc "$(trim "$year")")</span></div>"
  echo "                    <h3 class=\"card-title\">$(esc "$(trim "$title")")</h3>"
  echo "                    <p>$(esc "$(trim "$desc")")</p>"
  [ -n "$tag_html" ] && echo "                    <ul class=\"tags\">$tag_html</ul>"
  [ -n "$url" ] && echo "                    <a class=\"card-link\" href=\"$url\" target=\"_blank\" rel=\"noopener noreferrer\">Voir le projet →</a>"
  echo "                </article>"
  echo ""
} > "$card"

# Insère la carte juste après le repère (les projets les plus récents apparaissent en premier)
tmp="$(mktemp)"
awk -v mark="$MARK" -v cardfile="$card" '
  { print }
  index($0, mark) { while ((getline line < cardfile) > 0) print line; close(cardfile) }
' "$FILE" > "$tmp" && cat "$tmp" > "$FILE"

# Premier projet perso : on remet le bouton de filtre « Perso »
if [ "$type" = "perso" ] && ! grep -q 'data-value="perso"' "$FILE"; then
  awk '{ print } /data-value="cours"/ && !done { sub(/data-value="cours" aria-pressed="false">Cours/, "data-value=\"perso\" aria-pressed=\"false\">Perso"); print; done=1 }' "$FILE" > "$tmp" && cat "$tmp" > "$FILE"
fi
rm -f "$card" "$tmp"

echo
echo "✓ Carte « $(trim "$title") » ajoutée en tête de la section Projets."
echo "  Vérifie-la en ouvrant index.html dans ton navigateur, puis publie :"
echo "    bash tools/check-security.sh && git add -A && git commit -m \"docs: nouveau projet\" && git push"
