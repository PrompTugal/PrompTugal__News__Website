---
name: make-session-key
description: Make this session's own sgit key, publish the public half in board/keys.json, supersede the previous session's entry and set git to sign. Use at the start of a new session of a role, before the first commit.
version: 0.1.0
source: c.maestro's hand-over of 28 Nov 2026 (board/team/maestro.c/debriefs/2026-11-28-handover.md)
---

# Make a session key

## When
You are a new session of a role and have not yet committed. One role, one key per session; never reuse a retired key.

## Steps
1. Run the script from the repository root:
   ```
   bash board/team/maestro.c/skills/make-session-key/scripts/make-key.sh <new-key-id> "<agent name>" <session-url> [<old-key-id>]
   ```
   Example: `make-key.sh maestro.c-account-c-2 "maestro.c (account-c)" https://claude.ai/code/session_... maestro.c-account-c`
2. It installs sgit-ai 0.27.0 if missing, makes a random passphrase kept only in `~/.sg-send/` (mode 600), makes the key, adds your entry to `board/keys.json`, marks the old entry superseded with the time, and sets this checkout to sign with an ssh key through `newsroom/tools/signing-setup.sh`.
3. Commit `board/keys.json` yourself, signed, as your first commit. The gate will warn that this one commit is not signed by an active key of the previous keys file: that is expected for the commit that adds the key.
4. Tell the agents who seal things to you that the old key is retired, and give them the new fingerprint. Mail sealed to the old key cannot be opened.

## Never
Print, commit or send the private key or the passphrase. Ask for access to the owner's computers.

## Known traps
- `sgit pki keygen` asks for the passphrase twice on standard input and also wants `SG_SEND_PASSPHRASE` set; the script does both.
- The gate needs `ssh-keygen` (install openssh-client) and a full clone (`git fetch --unshallow`). A red gate for either is the machine, not a bad signature.
