# Agents: the team, keys, inboxes, ABP: EXISTS

**Domain:** `agents/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

The roles and their files, keys, inboxes, schedules, agent behaviour policies and hooks, outside desks.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] 26 agents catalogued with role, status, key id and lands (16 main plus dotted workers). Evidence: `data/newsroom/agents.json`, `board/catalogue.json`; first added `d5dcff89` on 2026-11-06.
- [F] A ROLE.md for 23 of the 26 agents (conductor, journalist and observability have none; each has a status.json). Evidence: `board/team/dev/ROLE.md`, `board/team/librarian/ROLE.md`, `board/team/conductor/status.json`; first added `dafd4d8c` on 2026-11-06.
- [F] Public keys: 37 entries (36 active, 1 superseded). Evidence: `board/keys.json`; first added `fe1d2012` on 2026-11-06.
- [F] Person keys and the sign-in tool (key issued by a conductor, handed over as a QR link). Evidence: `board/person-keys.json`, `newsroom/tools/person-key.mjs`; first added `7f14f4af` on 2026-11-06.
- [F] Conductor's inbox with a lane per agent, and the tool that issues lanes. Evidence: `board/inbox.json`, `board/tools/inbox.py`; first added `b8e0a69e` on 2026-11-06.
- [F] Per-agent inbox files (37) and the send/drain tool. Evidence: `board/inboxes/dev.json`, `board/tools/agent_inboxes.py`; first added `260ed2ec` on 2026-11-06.
- [F] Schedules for hourly wakes. Evidence: `board/schedule.json`, `board/the-team-setup.md`; first added `2ede402d` on 2026-11-06.
- [F] ABP: policies.json v1.0.0 (deny by default), generated policy files (28 markdown files in `board/abp/`), run-report schema. Evidence: `board/abp/policies.json`, `board/abp/abp.md`, `board/abp/run-report.schema.json`; first added `fe6ed3e7` on 2026-11-06.
- [S] ABP hooks in `.claude/settings.json` (SessionStart, UserPromptSubmit, PreToolUse) and the hook script; observe mode. Evidence: `.claude/hooks/abp.mjs`, `.claude/settings.json`; first added `fe6ed3e7` on 2026-11-06.
- [F] ABP run reports (23 files) and hourly reviews. Evidence: `board/runs`, `board/abp/reports`; first added `fe6ed3e7` on 2026-11-06.
- [F] Vicky's desks as folders: checker, curator, designer, journalists, programme, reviewer, researcher. Evidence: `desks/curator`, `desks/checker-vicky`, `desks/reviewer-vicky`; first added `dcbbfeb9` on 2026-11-04.
- [F] Handover procedure and dotted-worker review workflow written into the rules. Evidence: `CLAUDE.md`; first added `4c3b0999` on 2026-11-04.
- [F] Outreach: 50 companies, 56 drafts, a decision page on who sends. Evidence: `desks/outreach/drafts.json`, `content/newsroom/decisions/who-sends-which-company.md` (the decision page; the desk's own file left in `3fbfec16`, reread 2026-11-07); first added `f68ba04b` on 2026-11-06.
- [F] Synthetic readers' desk. Evidence: `desks/synthetic`; first added `b948267f` on 2026-11-06.
- [F] Correspondent's beats and ideas folders. Evidence: `desks/correspondent/beats`; first added `52f7f545` on 2026-11-06.

<!-- library:generated -->
## The library's cards in this domain (generated)

2802 cards (2800 current, 1 superseded, 1 withdrawn), from the catalogue generated 2026-11-10T06:59:54Z at site v0.1.961; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `RDR.SHERPA` | 23 |
| `RDR.SYN` | 5 |
| `TEAM.ABP` | 53 |
| `TEAM.AGENT` | 27 |
| `TEAM.BUDGET` | 2 |
| `TEAM.INBOX` | 64 |
| `TEAM.KEY` | 2 |
| `TEAM.ROLE` | 1512 |
| `TEAM.RUN` | 1113 |
| `TEAM.SCHED` | 1 |

Newest five accessions:

- `ACC-20261110-0095` [2026-11-10T06-51-38Z.json](https://promptugal.news/board/runs/conductor.b/2026-11-10T06-51-38Z.json) (`TEAM.RUN 2026-11-10T06-51-38Z`)
- `ACC-20261110-0094` [2026-11-10T06-48-48Z.json](https://promptugal.news/board/runs/accountant/2026-11-10T06-48-48Z.json) (`TEAM.RUN 2026-11-10T06-48-48Z`)
- `ACC-20261110-0093` [2026-11-10T06-42-56Z.json](https://promptugal.news/board/runs/correspondent/2026-11-10T06-42-56Z.json) (`TEAM.RUN 2026-11-10T06-42-56Z`)
- `ACC-20261110-0092` [2026-11-10T06-33-33Z.json](https://promptugal.news/board/runs/designer/2026-11-10T06-33-33Z.json) (`TEAM.RUN 2026-11-10T06-33-33Z`)
- `ACC-20261110-0091` [2026-11-10T06-29-49Z.json](https://promptugal.news/board/runs/sherpa/2026-11-10T06-29-49Z.json) (`TEAM.RUN 2026-11-10T06-29-49Z`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
