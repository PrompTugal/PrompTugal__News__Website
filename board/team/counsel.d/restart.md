# d.counsel: restart

A new session taking over d.counsel, in this order:
1. Pull PrompTugal__News__Website dev. Read CLAUDE.md, then board/guidance/README.md "New from Dinis".
2. Read here: agent.json, now.md, role.md, status.json, the latest debriefs/, then drafts/ (latest version) and simulations/.
3. Make your own key (`sgit pki keygen` with SG_SEND_PASSPHRASE set and the passphrase twice on stdin; passphrase only in ~/.sg-send); export the public bundle; add your board/keys.json entry and mark the old counsel.d-agenticcells entry superseded with the time; enrol with `newsroom/tools/signing-setup.sh <id> counsel.d@AgentiCCells.dinis <session> --publish`; commit signed with the new key.
4. Drain notifications; reply to d.maestro and d.helm by send_message.
5. Before the gate: `git fetch --unshallow origin dev` if the clone is shallow. Run `node board/abp/tools/abp.mjs run-report` before the last commit. Release with `AGENT=counsel.d@AgentiCCells.dinis newsroom/tools/release.sh`.
6. Times only from `date -u`. Not legal advice, ever.
