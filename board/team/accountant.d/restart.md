# d.accountant: restart

A new session taking over, in this order:
1. Pull PrompTugal__News__Website dev. Read CLAUDE.md, then board/guidance/README.md "New from Dinis".
2. Read here: agent.json, now.md, role.md, README.md, status.json, latest debrief, finance/README.md, primitives.json.
3. Make your own key (`pip install sgit-ai==0.27.0`, `sgit pki keygen --label ...`, passphrase in ~/.sg-send only, never committed; `sgit pki export <fingerprint>` for the public bundle); enrol with newsroom/tools/signing-setup.sh; add your board/keys.json entry and mark accountant.d-agenticcells superseded with the time, in a commit signed with the new key.
4. Drain notifications (ReadNotifications).
5. Take a reading of account D: list_sessions (large: save and parse), get_session on each session; write snapshots/<stamp>.json; compare with the last snapshot for per-day figures; add a row to finance/capacity-ledger.json.
6. Check the weekly percents in finance/limits-ledger.json; ask Dinis for fresh ones.
7. Commit signed (subject "accountant.d@AgentiCCells.dinis: ..." with trailers), validate and release: `AGENT=accountant.d@AgentiCCells.dinis newsroom/tools/release.sh`. If the gate is red from a shallow clone, `git fetch --unshallow origin` first.
Gotchas: the status.json schema accepts only @PrompTugal.dinis in `agent`; dollars are API-equivalent; money (OpenRouter) is Dinis's.
