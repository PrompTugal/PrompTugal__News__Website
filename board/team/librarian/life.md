---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-11T12:59:33Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 77 agents, 89 keys (53 active), 6 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-b` | 2 | 2026-11-11 12:53Z | 291 |  |  |  |
| social.watch@PrompTugal.dinis | `social-watch-promptugal` |  | 2026-11-11 12:53Z | 25 | 2026-11-11T12:53Z |  | works on work/social.watch; its work reaches dev through its main agent's review |
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-11 12:51Z | 115 | 2026-11-11T12:54Z |  | works on work/conductor.b; its work reaches dev through its main agent's review |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  | 2026-11-11 12:50Z | 70 |  |  |  |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-11 12:49Z | 36 | 2026-11-11T12:55Z |  |  |
| weather@PrompTugal.vicky | `weather-vicky-promptugal` |  | 2026-11-11 12:46Z | 60 |  |  |  |
| programme@PrompTugal.vicky | `programme-vicky-promptugal-b` | 1 | 2026-11-11 12:45Z | 39 |  |  |  |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 1 | 2026-11-11 12:44Z | 72 | 2026-11-11T12:55Z |  | account B: on |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-11 12:41Z | 193 | 2026-11-09T20:25Z |  |  |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-b` | 1 | 2026-11-11 12:39Z | 41 |  |  |  |
| designer@PrompTugal.dinis | `designer-promptugal-3` | 2 | 2026-11-11 12:35Z | 100 | 2026-11-11T12:45Z |  | account B: on |
| sherpa@PrompTugal.dinis | `sherpa-b-promptugal` | 1 | 2026-11-11 12:32Z | 41 | 2026-11-11T12:40Z |  | account B: on |
| reporter.newsroom@PrompTugal.dinis | `reporter.newsroom-promptugal` |  | 2026-11-11 12:30Z | 20 | 2026-11-11T12:45Z |  | works on work/reporter.newsroom; its work reaches dev through its main agent's review |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-11 12:25Z | 33 |  | commits with no active key |  |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 1 | 2026-11-11 12:24Z | 92 | 2026-11-11T12:30Z |  | account B: on |
| conductor@web-summit.dinis | none |  | 2026-11-11 12:17Z | 68 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.dinis | `dev-promptugal` | 1 | 2026-11-11 12:15Z | 425 | 2026-11-11T12:25Z |  | account B: on |
| journalist@PrompTugal.vicky | `journalist-vicky-promptugal-b` | 1 | 2026-11-11 12:07Z | 55 |  |  |  |
| security@PrompTugal.dinis | `security-promptugal` |  | 2026-11-11 12:06Z | 64 | 2026-11-11T12:08Z |  |  |
| conductor.fringe@PrompTugal.angelo | `conductor.fringe-angelo` |  | 2026-11-11 11:30Z | 1 |  |  |  |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-b` | 1 | 2026-11-11 11:26Z | 26 |  |  |  |
| conductor.fringe@PrompTugal.vicky | `conductor.fringe-vicky` |  | 2026-11-11 11:04Z | 1 |  |  |  |
| conductor.fringe@PrompTugal.dinis | `conductor.fringe-promptugal` | 1 | 2026-11-11 10:47Z | 2 |  |  | works on work/conductor.fringe; its work reaches dev through its main agent's review |
| conductor.B@ios.PrompTugal.dinis | none |  | 2026-11-11 10:44Z | 1 |  | commits with no active key |  |
| curator@PrompTugal.vicky | `curator-vicky-promptugal-b` | 2 | 2026-11-11 10:43Z | 107 |  |  |  |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-11 10:10Z | 11 |  |  |  |
| journalist.newsroom@PrompTugal.dinis | `journalist.newsroom-promptugal` |  | 2026-11-11 10:01Z | 18 | 2026-11-11T10:15Z |  | works on work/journalist.newsroom; its work reaches dev through its main agent's review |
| librarian@PrompTugal.dinis | `librarian-promptugal` | 1 | 2026-11-11 09:59Z | 47 | 2026-11-11T13:20Z |  | account B: on |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-b` | 1 | 2026-11-11 09:41Z | 42 |  |  |  |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-b` | 1 | 2026-11-11 08:28Z | 56 |  |  |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-b` | 1 | 2026-11-11 07:12Z | 40 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-b` | 1 | 2026-11-11 06:21Z | 40 |  |  |  |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-11 00:43Z | 7 |  |  |  |
| journalist@web-summit.indi | none |  | 2026-11-10 22:27Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor-newsapp@web-summit.indi | none |  | 2026-11-10 22:19Z | 3 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` |  | 2026-11-10 19:20Z | 19 | 2026-11-10T19:30Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| conductor@web-summit.indi | none |  | 2026-11-10 17:21Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  | 2026-11-10 08:49Z | 40 |  | silent 28 h |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 1 | 2026-11-10 04:09Z | 101 | 2026-11-09T22:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  | 2026-11-10 00:39Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| prompter@web-summit.indi | none |  | 2026-11-09 13:05Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.venues@PrompTugal.angelo | none |  | 2026-11-09 10:49Z | 5 |  | commits with no active key; silent 50 h |  |
| abp@PrompTugal.dinis | `abp-promptugal` |  | 2026-11-08 20:38Z | 24 | 2026-11-08T20:50Z | silent 64 h |  |
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
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-06 10:27Z | 1 |  | silent 123 h |  |
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
| dev.pages@PrompTugal.dinis | `dev.pages-b-promptugal` | 1 |  |  | 2026-11-11T11:23Z |  | account B: on |
| dev.graphs@PrompTugal.dinis | `dev.graphs-promptugal-2` | 1 |  |  | 2026-11-11T10:35Z |  | account B: on |
| dev.search@PrompTugal.dinis | `dev.search-promptugal-2` | 1 |  |  | 2026-11-08T00:15Z |  | account B: paused (paused 01:11 UTC 8 Nov at Dinis's word ('for today, we can stop all those dev')) |
| dev.verify@PrompTugal.dinis | `dev.verify-b-promptugal` | 1 |  |  | 2026-11-09T20:58Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| dev.data@PrompTugal.dinis | `dev.data-b-promptugal` | 1 |  |  | 2026-11-11T10:55Z |  | account B: on |
| dev.portugal@PrompTugal.dinis | `dev.portugal-b-promptugal` | 1 |  |  | 2026-11-09T20:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
