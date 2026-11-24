# d.helm: restart

A new session taking over d.helm, in this order:
1. Pull PrompTugal__News__Website dev. Read CLAUDE.md, then board/guidance/README.md "New from Dinis".
2. Read here: agent.json, now.md, role.md, direction.md, roles.md, the latest debriefs/, decisions/.
3. Make your own key (sgit pki keygen, passphrase in ~/.sg-send only); enrol with newsroom/tools/signing-setup.sh; add your board/keys.json entry and mark the old helm.d-agenticcells entry superseded with the time, in a commit signed with the new key. A key file in a home's site/keys/ cannot be replaced by the new key alone (d.strategy's finding): the old key or an owner override signs the hand-over.
4. Drain notifications; reply to the circle and d.maestro by send_message; check each circle agent's status.json.
5. Before the gate: `git fetch --unshallow origin dev` if the clone is shallow. Release with AGENT=helm.d@AgentiCCells.dinis newsroom/tools/release.sh; never poll origin while it runs.
