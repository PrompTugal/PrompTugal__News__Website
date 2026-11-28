#!/usr/bin/env bash
# make-key.sh <new-key-id> "<agent name>" <session-url> [<old-key-id>]
# Makes this session's sgit key, publishes the public half in board/keys.json, supersedes the old entry, sets git signing.
# Never prints a private key or the passphrase. c.maestro (account-c), 28 Nov 2026.
set -euo pipefail
ID="${1:?new key id}"; AGENT="${2:?agent name}"; SESSION="${3:?session url}"; OLD="${4:-}"
cd "$(git rev-parse --show-toplevel)"
command -v sgit >/dev/null || pip install -q sgit-ai==0.27.0 >/dev/null 2>&1
mkdir -p "$HOME/.sg-send"; chmod 700 "$HOME/.sg-send"
PF="$HOME/.sg-send/passphrase"
[ -f "$PF" ] || (umask 077; python3 -c "import secrets;print(secrets.token_urlsafe(32))" > "$PF")
export SG_SEND_PASSPHRASE="$(cat "$PF")"
if ! sgit pki list 2>/dev/null | grep -q " $ID "; then
  printf '%s\n%s\n' "$SG_SEND_PASSPHRASE" "$SG_SEND_PASSPHRASE" | sgit pki keygen --label "$ID" >/dev/null 2>&1
fi
FP="$(sgit pki list 2>/dev/null | awk -v id="$ID" '$2==id{print $1}' | head -1)"
[ -n "$FP" ] || { echo "make-key: key $ID was not made"; exit 1; }
BUNDLE="$(mktemp)"; trap 'rm -f "$BUNDLE"' EXIT
sgit pki export "$FP" > "$BUNDLE" 2>/dev/null
python3 -I - "$ID" "$AGENT" "$SESSION" "$OLD" "$BUNDLE" <<'PY'
import json, sys, datetime
kid, agent, session, old, bundle = sys.argv[1:6]
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
b = json.load(open(bundle)); f = 'board/keys.json'; j = json.load(open(f))
if any(k['id'] == kid for k in j['keys']): sys.exit('make-key: %s is already in %s' % (kid, f))
pos = len(j['keys'])
for i, k in enumerate(j['keys']):
    if old and k['id'] == old and k.get('status') == 'active':
        k['status'] = 'superseded'; k['superseded'] = now; k['superseded_by'] = kid; pos = i + 1
j['keys'].insert(pos, {"id": kid, "agent": agent, "label": agent + " (Claude Code session)",
    "role": "A session key: it ends with its session." + (" Supersedes %s." % old if old else ""),
    "made": now[:10], "made_with": "sgit pki keygen (sgit-ai 0.27.0), in its own session; private half only in that session",
    "added": now, "encryption_fingerprint": b.get('fingerprint'), "signing_fingerprint": b.get('signing_fingerprint'),
    "status": "active", "session": session, "bundle": b})
open(f, 'w').write(json.dumps(j, indent=2, ensure_ascii=False) + "\n")
print('make-key: %s added (encryption %s, signing %s)' % (kid, b.get('fingerprint'), b.get('signing_fingerprint')))
PY
newsroom/tools/signing-setup.sh "$ID" "$AGENT" "$SESSION" --publish
echo "make-key: now commit board/keys.json yourself, signed."
