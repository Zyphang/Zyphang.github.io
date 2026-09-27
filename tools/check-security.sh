#!/usr/bin/env bash
# Vérifie que le site respecte ses propres règles de sécurité.
# Lancé par la CI à chaque push ; utilisable en local : bash tools/check-security.sh
set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
section_fail=0
err()   { echo "  ✗ $*"; fail=1; section_fail=1; }
start() { section_fail=0; }
done_() { [ "$section_fail" -eq 0 ] && echo "✓ $1" || echo "✗ $1"; }

# Contenu sans commentaires (les commentaires documentent les règles, ils ne doivent pas les déclencher)
html() { perl -0pe 's/<!--.*?-->//gs' "$1"; }
js()   { perl -0pe 's{/\*.*?\*/}{}gs; s{^\s*//.*$}{}mg' "$1"; }

html_files=$(ls ./*.html)
js_files=$(ls assets/js/*.js)

start
for f in $html_files; do
  c=$(html "$f")
  grep -q 'http-equiv="Content-Security-Policy"' <<<"$c" || err "$f : CSP absente"
  grep -q "default-src 'none'" <<<"$c"                   || err "$f : default-src 'none' absent"
  grep -q "require-trusted-types-for 'script'" <<<"$c"   || err "$f : Trusted Types absent"
  grep -qiE "unsafe-(inline|eval|hashes)" <<<"$c"        && err "$f : directive unsafe-* interdite"
done
done_ "CSP stricte sur chaque page"

start
for f in $html_files; do
  c=$(html "$f")
  grep -nE '<script(\s[^>]*)?>' <<<"$c" | grep -v 'src=' && err "$f : <script> inline"
  grep -nEi '<[a-z][^>]*\son[a-z]+\s*=' <<<"$c"          && err "$f : gestionnaire d'événement inline (on…=)"
  grep -nEi '<[a-z][^>]*\sstyle\s*=' <<<"$c"             && err "$f : attribut style="
  grep -nEi '<style' <<<"$c"                              && err "$f : bloc <style> inline"
  grep -nEi 'javascript:' <<<"$c"                         && err "$f : URL javascript:"
done
done_ "Aucun code inline"

start
for f in $html_files; do
  html "$f" | grep -nEi '<(script|img|link|iframe|source|embed|object)[^>]+(src|href|data)="(https?:)?//' | grep -v 'rel="canonical"' && err "$f : ressource externe"
done
done_ "Aucune ressource tierce chargée"

start
for f in $html_files; do
  html "$f" | grep -nE 'target="_blank"' | grep -v 'rel="noopener noreferrer"' && err "$f : target=_blank sans rel=\"noopener noreferrer\""
done
done_ "Liens externes protégés (noopener noreferrer)"

start
for f in $js_files; do
  js "$f" | grep -nE '\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML|document\.write|\beval\s*\(|new Function\s*\(|set(Timeout|Interval)\s*\(\s*["'\'']' && err "$f : sink DOM-XSS"
done
done_ "JS sans sink DOM-XSS"

start
grep -rnE 'dathueyt@|@proton\.me' --include='*.html' --include='*.js' . && err "Adresse email personnelle en clair"
done_ "Email personnel non exposé"

start
exp=$(grep -i '^Expires:' .well-known/security.txt 2>/dev/null | cut -d' ' -f2)
if [ -z "$exp" ] || [ "$(date -u -d "$exp" +%s)" -lt "$(date -u +%s)" ]; then err "security.txt absent, expiré ou sans Expires"; fi
[ -f .nojekyll ] || err ".nojekyll absent : .well-known/ ne serait pas publié"
done_ "security.txt valide${exp:+ (expire le $exp)}"

# Avertissement non bloquant
todo=$(grep -c 'À COMPLÉTER\|class="todo' index.html || true)
[ "$todo" -gt 0 ] && echo "⚠ $todo ligne(s) d'index.html contiennent encore des textes à compléter"

echo
[ "$fail" -eq 0 ] && echo "Tous les contrôles sont passés." || echo "Des contrôles ont échoué."
exit $fail
