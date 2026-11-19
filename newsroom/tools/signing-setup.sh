#!/usr/bin/env bash
# signing-setup.sh: sign your commits in this repository with your own key (Dinis, 19 November 2026; newsroom/tools/signing.json).
#   newsroom/tools/signing-setup.sh <key-id> <agent> <session-url> [--publish]
#   e.g. newsroom/tools/signing-setup.sh dev-promptugal dev@PrompTugal.dinis https://claude.ai/code/session_... --publish
# Makes ~/.sg-send/ssh/<key-id> (ed25519, private, 0600; never committed, never printed) if it is missing, and sets THIS
# checkout's git (repo-local, never global: the environment's own signer stays for its other repositories) to sign every
# commit with it through newsroom/tools/sshsig.mjs (no ssh-keygen needed). --publish writes the public key and the session
# into your own active entry of board/keys.json; commit that entry yourself, in a commit signed with the new key.
# dev@PrompTugal.dinis.
set -euo pipefail
ID="${1:?key-id}"; AGENT="${2:?agent}"; SESSION="${3:?session url}"; PUBLISH="${4:-}"
cd "$(git rev-parse --show-toplevel)"
DIR="$HOME/.sg-send/ssh"; KEY="$DIR/$ID"; mkdir -p "$DIR"; chmod 700 "$DIR"
[ -f "$KEY" ] || node newsroom/tools/sshsig.mjs keygen "$KEY" "$AGENT $SESSION" >/dev/null
git config --local gpg.format ssh
git config --local gpg.ssh.program "$PWD/newsroom/tools/sshsig.mjs"
git config --local user.signingkey "$KEY"
git config --local commit.gpgsign true
echo "signing-setup: this checkout signs with $KEY.pub:"; cut -d' ' -f1,2 "$KEY.pub"
if [ "$PUBLISH" = "--publish" ]; then
  node -e '
    const fs = require("fs"), [id, agent, session, pub] = process.argv.slice(1), f = "board/keys.json", j = JSON.parse(fs.readFileSync(f, "utf8"))
    const e = j.keys.find(k => k.id === id && k.agent === agent && k.status === "active")
    if (!e) { console.error(`signing-setup: no active entry ${id} for ${agent} in ${f}`); process.exit(1) }
    e.ssh = pub.trim().split(/\s+/).slice(0, 2).join(" "); e.session = session; e.ssh_added = new Date().toISOString().slice(0, 16) + "Z"
    fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n"); console.log(`signing-setup: ${f}: ${id} now carries ssh and session`)
  ' "$ID" "$AGENT" "$SESSION" "$(cat "$KEY.pub")"
fi
