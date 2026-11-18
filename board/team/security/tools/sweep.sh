#!/bin/bash
# usage: sweep.sh <repo-dir> <from-commit>   (scans added lines from..HEAD; prints counts and masked hits)
R=$1; L=$2; cd "$R" || exit 1
F=$(mktemp); git diff $L..HEAD -U0 -- . ':!*.png' ':!*.jpg' ':!*.jpeg' ':!*.webp' ':!*.pdf' ':!*.sig' ':!*.woff*' | awk '/^\+\+\+ /{f=$2} /^\+[^+]/{print f"\t"$0}' > $F
echo "commits $(git log --oneline $L..HEAD | wc -l), added lines $(wc -l < $F)"
echo "secrets: $(grep -cE 'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|sk-(ant-|or-)[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9]{32,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|"d" *: *"[A-Za-z0-9_-]{20,}|sgk_[A-Za-z0-9]{8,}|[a-z0-9-]{3,}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' $F)"
echo "emails:"; grep -oiE '[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z.]{2,}' $F | grep -viE '@(PrompTugal|web-summit|promptugal|AgentiCCells|example)\.|noreply@|actions@github' | sed -E 's/^([^@]{0,2})[^@]*@/  \1***@/' | sort | uniq -c
echo "phones:"; grep -oE '.{30}(\+|00)[1-9][0-9 ()-]{8,}[0-9]' $F | grep -vE '[0-9]{10}-[0-9]{10}|PC6450|d="|<path' | sed -E 's/([0-9]{3})[0-9 ]{3,}([0-9]{2})$/\1***\2/' | cut -c1-90 | sed 's/^/  /'
echo "ips: $(grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' $F | grep -vE '^(0|1|2|10|127|192\.168)\.' | sort -u | wc -l)"
echo "key files: $(git diff --name-only $L..HEAD | grep -iE '\.pem$|\.key$|\.env$|credential|\.sg-send|private_key' | tr '\n' ' ')"
echo "injection-shaped: $(grep -ciE 'ignore (all |any )?(previous|prior|above) (instructions|prompts)|disregard (the|your) (previous|above)|new instructions:|override (your|the) (rules|instructions)|<\|?(system|im_start)\|?>|\[INST\]' $F)"
echo "code: $(git diff --stat $L..HEAD -- '*.js' '*.mjs' '*.py' '*.cjs' '*.sh' '*.yml' '*.yaml' '*.tmpl' '.claude' | tail -1)"
echo "innerHTML added: $(grep -E '\.(js|mjs|html|tmpl)	' $F | grep -cE 'innerHTML|insertAdjacentHTML|outerHTML *=|document\.write')"
echo "host reads added: $(grep -oE '(fetch|curl|get)\(?[^)]{0,40}https?://[a-z0-9.-]+' $F | grep -oE 'https?://[a-z0-9.-]+' | sort -u | tr '\n' ' ')"
echo "forbidden hosts: $(grep -ciE '(fetch|curl|wget|get)\(?[^)]{0,60}(websummit\.com|lu\.ma|luma\.com|meetup\.com|eventbrite\.)' $F)"
rm -f $F
