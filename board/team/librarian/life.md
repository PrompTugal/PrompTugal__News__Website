---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-11T19:01:06Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 78 agents, 90 keys (54 active), 6 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| social.watch@PrompTugal.dinis | `social-watch-promptugal` |  | 2026-11-11 18:57Z | 31 | 2026-11-11T18:57Z |  |  |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  | 2026-11-11 18:55Z | 89 |  |  |  |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-11 18:53Z | 38 | 2026-11-11T18:55Z |  |  |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 1 | 2026-11-11 18:45Z | 76 | 2026-11-11T18:55Z |  | account B: on |
| conductor@web-summit.vicky | `conductor-vicky-2-promptugal` |  | 2026-11-11 18:44Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-11 18:40Z | 197 | 2026-11-09T20:25Z |  |  |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-b` | 1 | 2026-11-11 18:38Z | 56 |  |  |  |
| weather@PrompTugal.vicky | `weather-vicky-promptugal` |  | 2026-11-11 18:37Z | 76 |  |  |  |
| designer@PrompTugal.dinis | `designer-promptugal-3` | 2 | 2026-11-11 18:34Z | 103 | 2026-11-11T12:45Z |  | account B: on |
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-b` | 2 | 2026-11-11 18:34Z | 317 |  |  |  |
| sherpa@PrompTugal.dinis | `sherpa-b-promptugal` | 1 | 2026-11-11 18:30Z | 43 | 2026-11-11T18:40Z |  | account B: on |
| reporter.newsroom@PrompTugal.dinis | `reporter.newsroom-promptugal` |  | 2026-11-11 18:30Z | 24 | 2026-11-11T18:45Z |  |  |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-11 18:26Z | 35 |  | commits with no active key |  |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 1 | 2026-11-11 18:22Z | 95 | 2026-11-11T18:25Z |  | account B: on |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` |  | 2026-11-11 18:21Z | 20 | 2026-11-11T18:30Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-11 18:14Z | 14 |  |  |  |
| conductor@web-summit.dinis | none |  | 2026-11-11 18:14Z | 70 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.dinis | `dev-promptugal` | 1 | 2026-11-11 18:12Z | 444 | 2026-11-11T18:20Z |  | account B: on |
| journalist@PrompTugal.vicky | `journalist-vicky-promptugal-b` | 1 | 2026-11-11 18:06Z | 67 |  |  |  |
| security@PrompTugal.dinis | `security-promptugal` |  | 2026-11-11 18:05Z | 66 | 2026-11-11T18:08Z |  |  |
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-11 17:50Z | 120 | 2026-11-11T17:53Z |  |  |
| curator@PrompTugal.vicky | `curator-vicky-promptugal-b` | 2 | 2026-11-11 17:25Z | 126 |  |  |  |
| librarian@PrompTugal.dinis | `librarian-promptugal` | 1 | 2026-11-11 16:03Z | 51 | 2026-11-11T19:15Z |  | account B: on |
| journalist.newsroom@PrompTugal.dinis | `journalist.newsroom-promptugal` |  | 2026-11-11 16:01Z | 22 | 2026-11-11T16:20Z |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-b` | 1 | 2026-11-11 15:45Z | 50 |  |  |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-b` | 1 | 2026-11-11 15:45Z | 47 |  |  |  |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-b` | 1 | 2026-11-11 15:45Z | 66 |  |  |  |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-b` | 1 | 2026-11-11 15:45Z | 32 |  |  |  |
| programme@PrompTugal.vicky | `programme-vicky-promptugal-b` | 1 | 2026-11-11 14:37Z | 43 |  |  |  |
| conductor.fringe@PrompTugal.angelo | `conductor.fringe-angelo` |  | 2026-11-11 11:30Z | 1 |  |  |  |
| conductor.fringe@PrompTugal.vicky | `conductor.fringe-vicky` |  | 2026-11-11 11:04Z | 1 |  |  |  |
| conductor.fringe@PrompTugal.dinis | `conductor.fringe-promptugal` | 1 | 2026-11-11 10:47Z | 2 |  |  |  |
| conductor.B@ios.PrompTugal.dinis | none |  | 2026-11-11 10:44Z | 1 |  | commits with no active key |  |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-b` | 1 | 2026-11-11 09:41Z | 42 |  |  |  |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-11 00:43Z | 7 |  |  |  |
| journalist@web-summit.indi | none |  | 2026-11-10 22:27Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor-newsapp@web-summit.indi | none |  | 2026-11-10 22:19Z | 3 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor@web-summit.indi | none |  | 2026-11-10 17:21Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  | 2026-11-10 08:49Z | 40 |  | silent 34 h |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 1 | 2026-11-10 04:09Z | 101 | 2026-11-09T22:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  | 2026-11-10 00:39Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| prompter@web-summit.indi | none |  | 2026-11-09 13:05Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.venues@PrompTugal.angelo | none |  | 2026-11-09 10:49Z | 5 |  | commits with no active key; silent 56 h |  |
| abp@PrompTugal.dinis | `abp-promptugal` |  | 2026-11-08 20:38Z | 24 | 2026-11-08T20:50Z | silent 70 h |  |
| customers@PrompTugal.dinis | `customers-b-promptugal` | 1 | 2026-11-08 13:56Z | 10 | 2026-11-08T14:25Z |  | account B: none () |
| researcher@PrompTugal.dinis | `researcher-b-promptugal` | 1 | 2026-11-08 01:16Z | 71 | 2026-11-08T01:30Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| synthetic@PrompTugal.dinis | `synthetic-promptugal` | 1 | 2026-11-08 00:46Z | 82 | 2026-11-08T00:55Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| outreach@PrompTugal.dinis | `outreach-b-promptugal` | 1 | 2026-11-08 00:38Z | 71 | 2026-11-08T00:45Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word (idle: the 50 wait for him)) |
| investors@PrompTugal.dinis | `investors-b-promptugal` | 1 | 2026-11-08 00:25Z | 77 | 2026-11-08T00:40Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| devops@PrompTugal.dinis | `devops-b-promptugal` | 1 | 2026-11-08 00:16Z | 37 | 2026-11-08T00:25Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| backup@PrompTugal.dinis | `backup-b-promptugal` | 1 | 2026-11-08 00:10Z | 13 | 2026-11-08T00:16Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word) |
| investors.packs@PrompTugal.dinis | `investors.packs-promptugal` |  | 2026-11-07 23:23Z | 3 |  |  | account B: none (no wake: Dinis works with it in its session; real people's data only in vaults, never in t) |
| historian@PrompTugal.dinis | `historian-b-promptugal` | 1 | 2026-11-07 01:58Z | 7 | 2026-11-07T02:40Z |  | account B: none () |
| designer.experiments@PrompTugal.dinis | `designer.experiments-b-promptugal` | 1 | 2026-11-06 22:45Z | 1 | 2026-11-07T23:05Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-06 10:27Z | 1 |  | silent 129 h |  |
| journalist@web-summit.vicky | none |  | 2026-11-06 10:16Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| reviewer@web-summit.vicky | none |  | 2026-11-06 10:15Z | 27 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-connections@web-summit.vicky | none |  | 2026-11-06 09:45Z | 10 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-portugal@web-summit.vicky | none |  | 2026-11-06 09:44Z | 11 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-europe@web-summit.vicky | none |  | 2026-11-06 09:41Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| programme@web-summit.vicky | none |  | 2026-11-06 08:21Z | 5 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| curator@web-summit.vicky | none |  | 2026-11-06 07:47Z | 14 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom@web-summit.dinis | none |  | 2026-11-06 00:44Z | 16 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@web-summit.dinis | none |  | 2026-11-06 00:25Z | 2 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-ai@web-summit.vicky | none |  | 2026-11-05 20:22Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| designer@web-summit.vicky | none |  | 2026-11-05 19:37Z | 2 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-billing@web-summit.dinis | none |  | 2026-11-05 03:36Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-graph@web-summit.dinis | none |  | 2026-11-05 03:33Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-admin@web-summit.dinis | none |  | 2026-11-05 03:30Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-interact@web-summit.dinis | none |  | 2026-11-05 03:29Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-designer@web-summit.dinis | none |  | 2026-11-05 03:18Z | 2 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| newsroom-dev@web-summit.dinis | none |  | 2026-11-05 02:58Z | 6 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.pages@PrompTugal.dinis | `dev.pages-b-promptugal` | 1 |  |  | 2026-11-11T17:14Z |  | account B: on |
| dev.graphs@PrompTugal.dinis | `dev.graphs-promptugal-2` | 1 |  |  | 2026-11-11T16:35Z |  | account B: on |
| dev.search@PrompTugal.dinis | `dev.search-promptugal-2` | 1 |  |  | 2026-11-08T00:15Z |  | account B: paused (paused 01:11 UTC 8 Nov at Dinis's word ('for today, we can stop all those dev')) |
| dev.verify@PrompTugal.dinis | `dev.verify-b-promptugal` | 1 |  |  | 2026-11-09T20:58Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| dev.data@PrompTugal.dinis | `dev.data-b-promptugal` | 1 |  |  | 2026-11-11T16:55Z |  | account B: on |
| dev.portugal@PrompTugal.dinis | `dev.portugal-b-promptugal` | 1 |  |  | 2026-11-09T20:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
