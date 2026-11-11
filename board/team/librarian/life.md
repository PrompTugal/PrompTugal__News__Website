---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-11T03:58:21Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 73 agents, 85 keys (50 active), 4 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-11 03:50Z | 106 | 2026-11-11T03:53Z |  | works on work/conductor.b; its work reaches dev through its main agent's review |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-11 03:49Z | 33 | 2026-11-11T03:55Z |  |  |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  | 2026-11-11 03:49Z | 54 |  |  |  |
| curator@PrompTugal.vicky | `curator-vicky-promptugal-b` | 2 | 2026-11-11 03:47Z | 91 |  |  |  |
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-b` | 2 | 2026-11-11 03:46Z | 247 |  |  |  |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-11 03:39Z | 187 | 2026-11-09T20:25Z |  |  |
| weather@PrompTugal.vicky | `weather-vicky-promptugal` |  | 2026-11-11 03:37Z | 39 |  |  |  |
| sherpa@PrompTugal.dinis | `sherpa-b-promptugal` | 1 | 2026-11-11 03:32Z | 38 | 2026-11-11T03:40Z |  | account B: on |
| reporter.newsroom@PrompTugal.dinis | `reporter.newsroom-promptugal` |  | 2026-11-11 03:30Z | 14 | 2026-11-11T03:40Z |  | works on work/reporter.newsroom; its work reaches dev through its main agent's review |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-11 03:25Z | 30 |  | commits with no active key |  |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-b` | 1 | 2026-11-11 03:19Z | 15 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-b` | 1 | 2026-11-11 03:17Z | 34 |  |  |  |
| conductor@web-summit.dinis | none |  | 2026-11-11 03:14Z | 64 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.dinis | `dev-promptugal` | 1 | 2026-11-11 03:14Z | 400 | 2026-11-11T03:35Z |  | account B: on |
| journalist@PrompTugal.vicky | `journalist-vicky-promptugal-b` | 1 | 2026-11-11 03:07Z | 46 |  |  |  |
| security@PrompTugal.dinis | `security-promptugal` |  | 2026-11-11 03:05Z | 61 | 2026-11-11T03:08Z |  |  |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 1 | 2026-11-11 02:43Z | 67 | 2026-11-11T02:50Z |  | account B: on |
| designer@PrompTugal.dinis | `designer-promptugal-3` | 2 | 2026-11-11 02:36Z | 95 | 2026-11-11T02:50Z |  | account B: on |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 1 | 2026-11-11 02:23Z | 87 | 2026-11-11T02:45Z |  | account B: on |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-b` | 1 | 2026-11-11 02:11Z | 35 |  |  |  |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-b` | 1 | 2026-11-11 01:29Z | 54 |  |  |  |
| journalist.newsroom@PrompTugal.dinis | `journalist.newsroom-promptugal` |  | 2026-11-11 01:01Z | 12 | 2026-11-11T01:20Z |  | works on work/journalist.newsroom; its work reaches dev through its main agent's review |
| librarian@PrompTugal.dinis | `librarian-promptugal` | 1 | 2026-11-11 00:59Z | 44 | 2026-11-11T04:10Z |  | account B: on |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-b` | 1 | 2026-11-11 00:49Z | 30 |  |  |  |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-11 00:43Z | 7 |  |  |  |
| social.watch@PrompTugal.dinis | `social-watch-promptugal` |  | 2026-11-11 00:06Z | 14 | 2026-11-10T23:54Z |  | works on work/social.watch; its work reaches dev through its main agent's review |
| programme@PrompTugal.vicky | `programme-vicky-promptugal-b` | 1 | 2026-11-10 22:45Z | 31 |  |  |  |
| journalist@web-summit.indi | none |  | 2026-11-10 22:27Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor-newsapp@web-summit.indi | none |  | 2026-11-10 22:19Z | 3 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` |  | 2026-11-10 19:20Z | 19 | 2026-11-10T19:30Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-10 18:09Z | 9 |  |  |  |
| conductor@web-summit.indi | none |  | 2026-11-10 17:21Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-b` | 1 | 2026-11-10 11:58Z | 40 |  |  |  |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  | 2026-11-10 08:49Z | 40 |  |  |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 1 | 2026-11-10 04:09Z | 101 | 2026-11-09T22:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  | 2026-11-10 00:39Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| prompter@web-summit.indi | none |  | 2026-11-09 13:05Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.venues@PrompTugal.angelo | none |  | 2026-11-09 10:49Z | 5 |  | commits with no active key; silent 41 h |  |
| abp@PrompTugal.dinis | `abp-promptugal` |  | 2026-11-08 20:38Z | 24 | 2026-11-08T20:50Z | silent 55 h |  |
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
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-06 10:27Z | 1 |  | silent 114 h |  |
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
| dev.pages@PrompTugal.dinis | `dev.pages-b-promptugal` | 1 |  |  | 2026-11-11T02:12Z |  | account B: on |
| dev.graphs@PrompTugal.dinis | `dev.graphs-promptugal-2` | 1 |  |  | 2026-11-11T02:35Z |  | account B: on |
| dev.search@PrompTugal.dinis | `dev.search-promptugal-2` | 1 |  |  | 2026-11-08T00:15Z |  | account B: paused (paused 01:11 UTC 8 Nov at Dinis's word ('for today, we can stop all those dev')) |
| dev.verify@PrompTugal.dinis | `dev.verify-b-promptugal` | 1 |  |  | 2026-11-09T20:58Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| dev.data@PrompTugal.dinis | `dev.data-b-promptugal` | 1 |  |  | 2026-11-11T02:55Z |  | account B: on |
| dev.portugal@PrompTugal.dinis | `dev.portugal-b-promptugal` | 1 |  |  | 2026-11-09T20:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
