---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-10T13:02:20Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 66 agents, 81 keys (46 active), 6 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-b` | 2 | 2026-11-10 12:57Z | 136 |  |  |  |
| programme@PrompTugal.vicky | `programme-vicky-promptugal-b` | 1 | 2026-11-10 12:53Z | 15 |  |  |  |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-10 12:53Z | 7 |  |  |  |
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-10 12:52Z | 90 | 2026-11-10T12:57Z |  | works on work/conductor.b; its work reaches dev through its main agent's review |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-10 12:49Z | 27 | 2026-11-10T12:55Z |  |  |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 1 | 2026-11-10 12:43Z | 59 | 2026-11-10T12:55Z |  | account B: on |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-10 12:40Z | 170 | 2026-11-09T20:25Z |  |  |
| conductor@web-summit.dinis | none |  | 2026-11-10 12:39Z | 44 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-b` | 1 | 2026-11-10 12:38Z | 14 |  |  |  |
| designer@PrompTugal.dinis | `designer-promptugal-3` | 2 | 2026-11-10 12:35Z | 88 | 2026-11-10T12:55Z |  | account B: on |
| sherpa@PrompTugal.dinis | `sherpa-b-promptugal` | 1 | 2026-11-10 12:30Z | 33 | 2026-11-10T12:40Z |  | account B: on |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-10 12:27Z | 19 |  | commits with no active key |  |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 1 | 2026-11-10 12:25Z | 79 | 2026-11-10T12:45Z |  | account B: on |
| security@PrompTugal.dinis | `security-promptugal` |  | 2026-11-10 12:07Z | 52 | 2026-11-10T12:08Z |  |  |
| journalist@PrompTugal.vicky | `journalist-vicky-promptugal-b` | 1 | 2026-11-10 12:03Z | 18 |  |  |  |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-b` | 1 | 2026-11-10 11:58Z | 40 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-b` | 1 | 2026-11-10 11:58Z | 23 |  |  |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-b` | 1 | 2026-11-10 11:58Z | 29 |  |  |  |
| curator@PrompTugal.vicky | `curator-vicky-promptugal-b` | 2 | 2026-11-10 11:57Z | 37 |  |  |  |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-b` | 1 | 2026-11-10 11:57Z | 40 |  |  |  |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-b` | 1 | 2026-11-10 11:57Z | 8 |  |  |  |
| librarian@PrompTugal.dinis | `librarian-promptugal` | 1 | 2026-11-10 10:00Z | 39 | 2026-11-10T13:40Z |  | account B: on |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  | 2026-11-10 08:49Z | 40 |  |  |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 1 | 2026-11-10 04:09Z | 101 | 2026-11-09T22:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  | 2026-11-10 00:39Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.dinis | `dev-promptugal` | 1 | 2026-11-09 23:13Z | 373 | 2026-11-09T23:25Z |  | account B: stopped (still paused: re-enabling refused by the session's safety check at 04:51 UTC 10 Nov; waits) |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` |  | 2026-11-09 19:20Z | 18 | 2026-11-09T19:30Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| prompter@web-summit.indi | none |  | 2026-11-09 13:05Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.venues@PrompTugal.angelo | none |  | 2026-11-09 10:49Z | 5 |  | commits with no active key; silent 26 h |  |
| abp@PrompTugal.dinis | `abp-promptugal` |  | 2026-11-08 20:38Z | 24 | 2026-11-08T20:50Z | silent 40 h |  |
| customers@PrompTugal.dinis | `customers-b-promptugal` | 1 | 2026-11-08 13:56Z | 10 | 2026-11-08T14:25Z |  | account B: none () |
| researcher@PrompTugal.dinis | `researcher-b-promptugal` | 1 | 2026-11-08 01:16Z | 71 | 2026-11-08T01:30Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| synthetic@PrompTugal.dinis | `synthetic-promptugal` | 1 | 2026-11-08 00:46Z | 82 | 2026-11-08T00:55Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| outreach@PrompTugal.dinis | `outreach-b-promptugal` | 1 | 2026-11-08 00:38Z | 71 | 2026-11-08T00:45Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word (idle: the 50 wait for him)) |
| investors@PrompTugal.dinis | `investors-b-promptugal` | 1 | 2026-11-08 00:25Z | 77 | 2026-11-08T00:40Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| devops@PrompTugal.dinis | `devops-b-promptugal` | 1 | 2026-11-08 00:16Z | 37 | 2026-11-08T00:25Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| backup@PrompTugal.dinis | `backup-b-promptugal` | 1 | 2026-11-08 00:10Z | 13 | 2026-11-08T00:16Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word) |
| investors.packs@PrompTugal.dinis | `investors.packs-promptugal` |  | 2026-11-07 23:23Z | 3 |  |  | account B: none (no wake: Dinis works with it in its session; real people's data only in vaults, never in t) |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-07 22:31Z | 5 |  | silent 63 h |  |
| historian@PrompTugal.dinis | `historian-b-promptugal` | 1 | 2026-11-07 01:58Z | 7 | 2026-11-07T02:40Z |  | account B: none () |
| designer.experiments@PrompTugal.dinis | `designer.experiments-b-promptugal` | 1 | 2026-11-06 22:45Z | 1 | 2026-11-07T23:05Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-06 10:27Z | 1 |  | silent 99 h |  |
| journalist@web-summit.vicky | none |  | 2026-11-06 10:16Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| reviewer@web-summit.vicky | none |  | 2026-11-06 10:15Z | 27 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-connections@web-summit.vicky | none |  | 2026-11-06 09:45Z | 10 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-portugal@web-summit.vicky | none |  | 2026-11-06 09:44Z | 11 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-europe@web-summit.vicky | none |  | 2026-11-06 09:41Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| programme@web-summit.vicky | none |  | 2026-11-06 08:21Z | 5 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| curator@web-summit.vicky | none |  | 2026-11-06 07:47Z | 14 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom@web-summit.dinis | none |  | 2026-11-06 00:44Z | 17 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@web-summit.dinis | none |  | 2026-11-06 00:25Z | 2 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-ai@web-summit.vicky | none |  | 2026-11-05 20:22Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| designer@web-summit.vicky | none |  | 2026-11-05 19:37Z | 2 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-billing@web-summit.dinis | none |  | 2026-11-05 03:36Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-graph@web-summit.dinis | none |  | 2026-11-05 03:33Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-admin@web-summit.dinis | none |  | 2026-11-05 03:30Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-interact@web-summit.dinis | none |  | 2026-11-05 03:29Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-designer@web-summit.dinis | none |  | 2026-11-05 03:18Z | 2 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-dev@web-summit.dinis | none |  | 2026-11-05 02:58Z | 6 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.pages@PrompTugal.dinis | `dev.pages-b-promptugal` | 1 |  |  | 2026-11-09T22:14Z |  | account B: stopped (still paused: re-enabling refused by the session's safety check at 04:51 UTC 10 Nov; waits) |
| dev.graphs@PrompTugal.dinis | `dev.graphs-promptugal-2` | 1 |  |  | 2026-11-09T22:35Z |  | account B: on |
| dev.search@PrompTugal.dinis | `dev.search-promptugal-2` | 1 |  |  | 2026-11-08T00:15Z |  | account B: paused (paused 01:11 UTC 8 Nov at Dinis's word ('for today, we can stop all those dev')) |
| dev.verify@PrompTugal.dinis | `dev.verify-b-promptugal` | 1 |  |  | 2026-11-09T20:58Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| dev.data@PrompTugal.dinis | `dev.data-b-promptugal` | 1 |  |  | 2026-11-09T23:05Z |  | account B: on |
| dev.portugal@PrompTugal.dinis | `dev.portugal-b-promptugal` | 1 |  |  | 2026-11-09T20:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
