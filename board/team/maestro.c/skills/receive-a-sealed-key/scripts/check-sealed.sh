#!/usr/bin/env bash
# check-sealed.sh <file> <encryption-fingerprint>
# Checks that a sealed envelope opens with your key. Prints only sizes and field names; never the plaintext.
set -euo pipefail
F="${1:?sealed file}"; FP="${2:?your encryption fingerprint}"
export SG_SEND_PASSPHRASE="$(cat "$HOME/.sg-send/passphrase")"
umask 077; T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
# A committed wrapper: JSON with the envelope as an object under "sealed". Turn it into the base64 form sgit expects.
python3 -I - "$F" "$T/in.enc" <<'PY'
import json, base64, sys
src, dst = sys.argv[1:3]; raw = open(src).read().strip()
try:
    d = json.loads(raw)
    env = d['sealed'] if isinstance(d, dict) and isinstance(d.get('sealed'), dict) else d
    raw = base64.b64encode(json.dumps(env).encode()).decode()
except ValueError:
    pass
open(dst, 'w').write(raw)
PY
sgit pki decrypt --fingerprint "$FP" -o "$T/out" "$T/in.enc" >/dev/null 2>&1 || { echo "check-sealed: does NOT open with $FP"; exit 1; }
python3 -I - "$T/out" <<'PY'
import json, sys, os
p = sys.argv[1]; n = os.path.getsize(p)
try:
    d = json.load(open(p)); print('check-sealed: opens; %d bytes; fields: %s' % (n, sorted(d) if isinstance(d, dict) else type(d).__name__))
except ValueError:
    print('check-sealed: opens; %d bytes; not JSON' % n)
PY
