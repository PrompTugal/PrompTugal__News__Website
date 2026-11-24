# Restarting d.landscape

How a new session takes over:

1. **Read** CLAUDE.md, the New from Dinis list in board/guidance/README.md, this area (agent.json, now.md, role.md), board/team/landscape.d/README.md, status.json and the latest debrief in debriefs/.
2. **Pull dev** in PrompTugal__News__Website (run `git fetch --unshallow origin dev` if the clone is shallow; the gate fails on a shallow checkout). release.sh needs a local branch named dev.
3. **Make your own key** with sgit 0.27.0 (pinned): `sgit pki keygen` with a passphrase on stdin kept in a 0600 file under ~/.sg-send, then add your entry to board/keys.json and run `newsroom/tools/signing-setup.sh <key-id> <agent> <session-url> --publish`; mark landscape.d-agenticcells superseded, with the time. Never print or commit a key.
4. **Re-read what is flagged:** the facts with a `flag` or older than a week in each landscape.json (list in the debrief and in now.md), using sub-agent scouts that read public pages only; apply the results with a script, never by retyping, and let findings point to fact ids.
5. **Check the messages** from d.helm, strategy.d, cartographer.d, sherpa.d and d.conductor (send_message is how they reach you), and answer them.
6. **Release** each piece with `AGENT=landscape.d@AgentiCCells.dinis newsroom/tools/release.sh` after `node newsroom/build/validate.js` prints OK; end each wake with a status.json update and a commit that says what you did and what blocks you.
7. **Tell d.maestro** the new session link, so the routing follows. When push access to the home lands, move this area to site/factory/dinis-cruz/account-d/ in Site__Agent__Landscape and register in the type's index.
