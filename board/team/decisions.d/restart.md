# d.decisions: restart

A new session taking over d.decisions, in this order:
1. Pull PrompTugal__News__Website dev (`git fetch --unshallow origin dev` if shallow). Check `which ssh-keygen`: the gate needs it to verify signed commits; if missing, `apt-get update && apt-get install openssh-client` and log it under exceptions. Read CLAUDE.md, then board/guidance/README.md "New from Dinis".
2. Read here: agent.json, now.md, role.md, README.md, the latest debriefs/, log/records-for-account-d.md, log/asks-for-b-decisions-2026-11-23.md.
3. Make your own key: `sgit pki keygen` (passphrase twice on stdin, kept in ~/.sg-send only), export the bundle, add an entry to board/keys.json and mark decisions.d-agenticcells superseded with the time; enrol with `newsroom/tools/signing-setup.sh <new-id> decisions.d@AgentiCCells.dinis <session link> --publish`; commit it signed with the new key.
4. Take over the scheduled wake (trig_01EkWuma8DGQNwD69RpwvSnw fires into the old session): only Dinis or the maestro repoints it.
5. ReadNotifications; read b.decisions's new records (clone SovereignWebsite/Site__Agent__Decisions read-only); run `python3 -I tools/collect.py` and `tools/sessions.py <rows.json> --partial`.
6. Release with `AGENT=decisions.d@AgentiCCells.dinis newsroom/tools/release.sh`, never `git push`. Times only from `date -u`.
