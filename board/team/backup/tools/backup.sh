#!/usr/bin/env bash
# backup@PrompTugal.dinis: a full backup of this repository (all refs) as one git bundle, with a manifest.
# Usage: board/team/backup/tools/backup.sh [OUT_DIR]   (default: ../promptugal-backups, outside the repository; never commit the output)
# Verifies the bundle, records sha256 and size. Encryption and the destination (Google Drive) are separate steps
# and need Dinis's grant (ABP R3); no secret is read or written here.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
out="${1:-../promptugal-backups}"; mkdir -p "$out"
ts="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
name="promptugal-news-website-$ts"
git bundle create "$out/$name.bundle" --all >/dev/null 2>&1
git bundle verify "$out/$name.bundle" >/dev/null 2>&1
sha="$(sha256sum "$out/$name.bundle" | cut -d' ' -f1)"
cat > "$out/$name.manifest.json" <<J
{"repo":"PrompTugal/PrompTugal__News__Website","made":"$ts","by":"backup@PrompTugal.dinis","head":"$(git rev-parse HEAD)","branch":"$(git rev-parse --abbrev-ref HEAD)","bundle":"$name.bundle","sha256":"$sha","bytes":$(stat -c %s "$out/$name.bundle"),"verified":true}
J
echo "$out/$name.bundle sha256:$sha"
