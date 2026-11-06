#!/usr/bin/env bash
# backup@PrompTugal.dinis: a pack-mode sgit vault backup of the repository tree, with a restore test.
# Usage: board/team/backup/tools/backup-vault.sh [OUT_DIR]   (default ../promptugal-backups; never inside the repository)
# Needs sgit-ai 0.27.0 (pip install sgit-ai==0.27.0). Sends nothing but the empty-vault registration `sgit init` makes
# on its own host; no token is used and nothing is pushed. The vault key is kept under ~/.sg-send/backup-vaults/ (0600),
# NEVER in the zip: the zip holds only the vault's encrypted bare/ store (a pack vault's .sg_vault/local/ holds the keys).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
out="${1:-../promptugal-backups}"; mkdir -p "$out"; out="$(cd "$out" && pwd)"
ts="$(date -u +%Y-%m-%dT%H-%M-%SZ)"; head="$(git rev-parse HEAD)"; name="promptugal-news-website-vault-$ts"
w="$(mktemp -d)"; trap 'rm -rf "$w"' EXIT
san() { sed -E 's/[A-Za-z0-9_-]{28,}/[redacted]/g'; }   # never let a key reach the log
# 1. snapshot of the tracked tree at HEAD
mkdir "$w/src"; git archive HEAD | tar -x -C "$w/src"
# sgit skips .github and obeys .gitignore (the repository's ignores hide tracked files), so rename both: _dot_github, _dot_gitignore
[ -d "$w/src/.github" ] && mv "$w/src/.github" "$w/src/_dot_github"
find "$w/src" -name .gitignore -execdir mv .gitignore _dot_gitignore \;
# 2. a normal vault, then rewritten into a pack vault (blobs deflated; packs form on a push, which we do not do)
( cd "$w/src" && sgit init --existing . >/dev/null 2>&1 && sgit commit "backup $ts of $head" >/dev/null 2>&1 )
sgit pack import "$w/src" "$w/pk" 2>&1 | san | tail -3
sgit pack verify "$w/pk" 2>&1 | san | tail -1
# 3. keep the key outside the zip; zip bare/ only
kd="$HOME/.sg-send/backup-vaults"; mkdir -p "$kd"; chmod 700 "$kd"
cp "$w/pk/.sg_vault/local/vault_key" "$kd/$name.key"; chmod 600 "$kd/$name.key"
python3 - "$w/pk/.sg_vault" "$out/$name.zip" <<'P'
import sys,os,zipfile
base,dst=sys.argv[1:3]
z=zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED)
for r,_,fs in os.walk(os.path.join(base,'bare')):
    for f in fs:
        p=os.path.join(r,f); z.write(p,os.path.relpath(p,base))
z.close()
P
unzip -l "$out/$name.zip" | grep -q "local/" && { echo "FAIL: zip holds local/" >&2; exit 1; }
# 4. restore test: fresh directory, the zip and the kept key only
r="$w/restore"; mkdir -p "$r/.sg_vault/local"; unzip -q "$out/$name.zip" -d "$r/.sg_vault"
cp "$w/pk/.sg_vault/local/config.json" "$w/pk/.sg_vault/local/base_url" "$r/.sg_vault/local/"
cp "$kd/$name.key" "$r/.sg_vault/local/vault_key"
( cd "$r" && sgit history revert --force 2>&1 | san | tail -1 )
sgit pack verify "$r" 2>&1 | san | tail -1
( cd "$r" && sgit check fsck 2>&1 | san | tail -1 )
d="$(diff -rq --exclude=.sg_vault "$r" "$w/src" | head -5 || true)"; [ -z "$d" ] || { echo "$d" >&2; echo "restore test FAILED: files differ" >&2; rm -f "$out/$name.zip"; exit 1; }
files="$(find "$r" -path "$r/.sg_vault" -prune -o -type f -print | wc -l)"
sha="$(sha256sum "$out/$name.zip" | cut -d' ' -f1)"
cat > "$out/$name.manifest.json" <<J
{"repo":"PrompTugal/PrompTugal__News__Website","made":"$ts","by":"backup@PrompTugal.dinis","head":"$head","kind":"sgit pack vault (bare/ only)","zip":"$name.zip","sha256":"$sha","bytes":$(stat -c %s "$out/$name.zip"),"files":$files,"restore_tested":true,"renamed":"_dot_github and _dot_gitignore: rename back (.github, .gitignore) after a restore","restore":"unzip into <dir>/.sg_vault, add local/ with the vault key, sgit history revert --force"}
J
chmod 444 "$out/$name.zip" "$out/$name.manifest.json"   # read-only once the restore test has passed
echo "$out/$name.zip sha256:$sha files:$files restore OK"
