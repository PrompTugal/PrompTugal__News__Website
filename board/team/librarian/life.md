---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-10T15:58:23Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 67 agents, 81 keys (46 active), 6 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-10 15:49Z | 93 | 2026-11-10T15:53Z |  | works on work/conductor.b; its work reaches dev through its main agent's review |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-10 15:48Z | 28 | 2026-11-10T15:55Z |  |  |
| programme@PrompTugal.vicky | `programme-vicky-promptugal-b` | 1 | 2026-11-10 15:46Z | 21 |  |  |  |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-10 15:42Z | 173 | 2026-11-09T20:25Z |  |  |
| sherpa@PrompTugal.dinis | `sherpa-b-promptugal` | 1 | 2026-11-10 15:31Z | 34 | 2026-11-10T15:40Z |  | account B: on |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-10 15:25Z | 22 |  | commits with no active key |  |
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-b` | 2 | 2026-11-10 15:23Z | 146 |  |  |  |
| conductor@web-summit.dinis | none |  | 2026-11-10 15:17Z | 47 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist@PrompTugal.vicky | `journalist-vicky-promptugal-b` | 1 | 2026-11-10 15:10Z | 22 |  |  |  |
| conductor-newsapp@web-summit.indi | none |  | 2026-11-10 15:07Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 1 | 2026-11-10 14:43Z | 60 | 2026-11-10T14:52Z |  | account B: on |
| curator@PrompTugal.vicky | `curator-vicky-promptugal-b` | 2 | 2026-11-10 14:42Z | 46 |  |  |  |
| designer@PrompTugal.dinis | `designer-promptugal-3` | 2 | 2026-11-10 14:37Z | 89 | 2026-11-10T15:00Z |  | account B: on |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 1 | 2026-11-10 14:31Z | 81 | 2026-11-10T14:45Z |  | account B: on |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-b` | 1 | 2026-11-10 14:30Z | 45 |  |  |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-b` | 1 | 2026-11-10 14:16Z | 30 |  |  |  |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-10 14:13Z | 8 |  |  |  |
| security@PrompTugal.dinis | `security-promptugal` |  | 2026-11-10 14:07Z | 53 | 2026-11-10T14:08Z |  |  |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-b` | 1 | 2026-11-10 13:27Z | 9 |  |  |  |
| librarian@PrompTugal.dinis | `librarian-promptugal` | 1 | 2026-11-10 13:02Z | 40 | 2026-11-10T16:20Z |  | account B: on |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-b` | 1 | 2026-11-10 12:38Z | 14 |  |  |  |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-b` | 1 | 2026-11-10 11:58Z | 40 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-b` | 1 | 2026-11-10 11:58Z | 23 |  |  |  |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  | 2026-11-10 08:49Z | 40 |  |  |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 1 | 2026-11-10 04:09Z | 101 | 2026-11-09T22:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  | 2026-11-10 00:39Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.dinis | `dev-promptugal` | 1 | 2026-11-09 23:13Z | 373 | 2026-11-09T23:25Z |  | account B: stopped (still paused: re-enabling refused by the session's safety check at 04:51 UTC 10 Nov; waits) |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` |  | 2026-11-09 19:20Z | 18 | 2026-11-09T19:30Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| prompter@web-summit.indi | none |  | 2026-11-09 13:05Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.venues@PrompTugal.angelo | none |  | 2026-11-09 10:49Z | 5 |  | commits with no active key; silent 29 h |  |
| abp@PrompTugal.dinis | `abp-promptugal` |  | 2026-11-08 20:38Z | 24 | 2026-11-08T20:50Z | silent 43 h |  |
| customers@PrompTugal.dinis | `customers-b-promptugal` | 1 | 2026-11-08 13:56Z | 10 | 2026-11-08T14:25Z |  | account B: none () |
| researcher@PrompTugal.dinis | `researcher-b-promptugal` | 1 | 2026-11-08 01:16Z | 71 | 2026-11-08T01:30Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| synthetic@PrompTugal.dinis | `synthetic-promptugal` | 1 | 2026-11-08 00:46Z | 82 | 2026-11-08T00:55Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| outreach@PrompTugal.dinis | `outreach-b-promptugal` | 1 | 2026-11-08 00:38Z | 71 | 2026-11-08T00:45Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word (idle: the 50 wait for him)) |
| investors@PrompTugal.dinis | `investors-b-promptugal` | 1 | 2026-11-08 00:25Z | 77 | 2026-11-08T00:40Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| devops@PrompTugal.dinis | `devops-b-promptugal` | 1 | 2026-11-08 00:16Z | 37 | 2026-11-08T00:25Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| backup@PrompTugal.dinis | `backup-b-promptugal` | 1 | 2026-11-08 00:10Z | 13 | 2026-11-08T00:16Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word) |
| investors.packs@PrompTugal.dinis | `investors.packs-promptugal` |  | 2026-11-07 23:23Z | 3 |  |  | account B: none (no wake: Dinis works with it in its session; real people's data only in vaults, never in t) |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-07 22:31Z | 5 |  | silent 65 h |  |
| historian@PrompTugal.dinis | `historian-b-promptugal` | 1 | 2026-11-07 01:58Z | 7 | 2026-11-07T02:40Z |  | account B: none () |
| designer.experiments@PrompTugal.dinis | `designer.experiments-b-promptugal` | 1 | 2026-11-06 22:45Z | 1 | 2026-11-07T23:05Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-06 10:27Z | 1 |  | silent 102 h |  |
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
