---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-16T21:58:55Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 96 agents, 192 keys (122 active), 30 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| dev@PrompTugal.dinis | `dev-promptugal` | 2 | 2026-11-16 21:51Z | 148 | 2026-11-16T22:00Z |  | account B: on |
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-16 21:49Z | 71 | 2026-11-16T21:51Z |  |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 2 | 2026-11-16 21:42Z | 17 | 2026-11-16T21:55Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| outreach@PrompTugal.dinis | `outreach-c-promptugal` | 2 | 2026-11-16 21:39Z | 3 | 2026-11-16T21:50Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word (idle: the 50 wait for him)) |
| abp@PrompTugal.dinis | `abp-promptugal-c` | 2 | 2026-11-16 21:38Z | 23 | 2026-11-16T21:50Z |  |  |
| dev.places@PrompTugal.dinis | `dev.places-promptugal-2` | 1 | 2026-11-16 21:35Z | 60 | 2026-11-16T21:00Z |  |  |
| sherpa@PrompTugal.dinis | `sherpa-promptugal-3` | 2 | 2026-11-16 21:30Z | 21 | 2026-11-16T21:40Z |  | account B: on |
| place.algarve.west@PrompTugal.dinis | `place.algarve.west-promptugal` |  | 2026-11-16 21:23Z | 11 | 2026-11-16T21:40Z |  |  |
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-3` | 3 | 2026-11-16 21:18Z | 254 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-c` | 2 | 2026-11-16 21:08Z | 44 |  |  |  |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 2 | 2026-11-16 20:45Z | 38 | 2026-11-16T20:45Z |  | account B: on |
| designer@PrompTugal.dinis | `designer-promptugal-4` | 3 | 2026-11-16 20:37Z | 33 | 2026-11-16T21:05Z |  | account B: on |
| place.districts@PrompTugal.dinis | `place.districts-promptugal`, `site.lisboa-promptugal`, `site.porto-promptugal`, `site.braga-promptugal`, `site.viana-do-castelo-promptugal`, `site.vila-real-promptugal`, `site.braganca-promptugal`, `site.aveiro-promptugal`, `site.viseu-promptugal`, `site.guarda-promptugal`, `site.coimbra-promptugal`, `site.castelo-branco-promptugal`, `site.leiria-promptugal`, `site.santarem-promptugal`, `site.portalegre-promptugal`, `site.setubal-promptugal`, `site.evora-promptugal`, `site.beja-promptugal` |  | 2026-11-16 20:36Z | 24 | 2026-11-16T20:45Z |  | 18 active keys, one per purpose (Dinis: a key for every application) |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-16 20:31Z | 105 | 2026-11-16T15:35Z |  |  |
| conductor@PrompTugal.jose | `conductor-jose-promptugal` |  | 2026-11-16 20:27Z | 4 |  |  |  |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 2 | 2026-11-16 20:26Z | 34 | 2026-11-16T20:45Z |  | account B: on |
| local@PrompTugal.jose | `local-jose-promptugal` |  | 2026-11-16 20:19Z | 4 |  |  |  |
| place.albufeira@PrompTugal.dinis | `place.albufeira-promptugal` |  | 2026-11-16 20:16Z | 8 | 2026-11-16T20:15Z |  |  |
| datasci.places@PrompTugal.dinis | `datasci.places-promptugal-b` | 1 | 2026-11-16 20:16Z | 10 | 2026-11-16T20:16Z |  |  |
| place.monchique@PrompTugal.dinis | `place.monchique-promptugal`, `site.monchique-promptugal` |  | 2026-11-16 20:11Z | 13 | 2026-11-16T20:15Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| detective.places@PrompTugal.dinis | `detective.places-promptugal` |  | 2026-11-16 20:11Z | 18 | 2026-11-16T20:20Z |  |  |
| place.sao-bras-de-alportel@PrompTugal.dinis | `place.sao-bras-de-alportel-promptugal` | 1 | 2026-11-16 20:10Z | 12 | 2026-11-16T20:20Z |  |  |
| translator@PrompTugal.dinis | `translator-promptugal-2` | 1 | 2026-11-16 20:10Z | 23 | 2026-11-16T20:05Z |  |  |
| place.olhao@PrompTugal.dinis | `place.olhao-promptugal` | 1 | 2026-11-16 20:10Z | 12 | 2026-11-16T20:15Z |  |  |
| place.tavira@PrompTugal.dinis | `place.tavira-promptugal`, `site.tavira-promptugal` |  | 2026-11-16 20:10Z | 32 | 2026-11-16T20:15Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.castro-marim@PrompTugal.dinis | `place.castro-marim-promptugal`, `site.castro-marim-promptugal` |  | 2026-11-16 20:10Z | 11 | 2026-11-16T20:15Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| security@PrompTugal.dinis | `security-promptugal-2` | 1 | 2026-11-16 20:05Z | 49 | 2026-11-16T20:10Z |  |  |
| place.algarve.central@PrompTugal.dinis | `place.algarve.central-promptugal`, `site.albufeira-promptugal`, `site.loule-promptugal`, `site.quarteira-promptugal`, `site.faro-promptugal`, `site.sao-bras-de-alportel-promptugal`, `site.olhao-promptugal` |  | 2026-11-16 19:59Z | 2 | 2026-11-16T20:15Z |  | 7 active keys, one per purpose (Dinis: a key for every application) |
| place.algarve.east@PrompTugal.dinis | `place.algarve.east-promptugal` |  | 2026-11-16 19:55Z | 3 | 2026-11-16T20:30Z |  |  |
| librarian@PrompTugal.dinis | `librarian-promptugal` | 2 | 2026-11-16 19:36Z | 22 | 2026-11-16T19:46Z |  | account B: on |
| designer.places@PrompTugal.dinis | `designer.places-2-promptugal` | 1 | 2026-11-16 19:33Z | 30 | 2026-11-16T19:40Z |  |  |
| researcher@PrompTugal.dinis | `researcher-promptugal` | 1 | 2026-11-16 19:32Z | 1 | 2026-11-08T01:30Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| place.vila-real-de-santo-antonio@PrompTugal.dinis | `place.vila-real-de-santo-antonio-promptugal`, `site.vila-real-de-santo-antonio-promptugal` |  | 2026-11-16 15:40Z | 25 | 2026-11-16T15:40Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| curator@PrompTugal.vicky | `curator-vicky-3-promptugal` | 3 | 2026-11-16 15:38Z | 128 |  |  |  |
| place.quarteira@PrompTugal.dinis | `place.quarteira-promptugal` | 1 | 2026-11-16 15:34Z | 15 | 2026-11-16T16:10Z |  |  |
| data.places@PrompTugal.dinis | `data.places-promptugal` |  | 2026-11-16 15:33Z | 53 | 2026-11-16T15:45Z |  |  |
| place.silves@PrompTugal.dinis | `place.silves-promptugal`, `site.silves-promptugal` |  | 2026-11-16 15:33Z | 14 | 2026-11-16T15:45Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-16 15:28Z | 27 | 2026-11-16T15:45Z |  |  |
| place.aljezur@PrompTugal.dinis | `place.aljezur-promptugal`, `site.aljezur-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:35Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.portimao@PrompTugal.dinis | `place.portimao-promptugal`, `site.portimao-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:40Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.alcoutim@PrompTugal.dinis | `place.alcoutim-promptugal`, `site.alcoutim-promptugal` |  | 2026-11-16 15:28Z | 14 | 2026-11-16T15:40Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.portugal@PrompTugal.dinis | `place.portugal-promptugal`, `site.portugal-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:40Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.algarve@PrompTugal.dinis | `place.algarve-promptugal`, `site.algarve-promptugal` |  | 2026-11-16 15:27Z | 19 | 2026-11-16T15:45Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.faro@PrompTugal.dinis | `place.faro-promptugal` | 1 | 2026-11-16 15:27Z | 25 | 2026-11-16T15:45Z |  |  |
| place.vila-do-bispo@PrompTugal.dinis | `place.vila-do-bispo-promptugal`, `site.vila-do-bispo-promptugal` |  | 2026-11-16 15:26Z | 8 | 2026-11-16T15:40Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.loule@PrompTugal.dinis | `place.loule-promptugal` | 1 | 2026-11-16 15:26Z | 16 | 2026-11-16T15:40Z |  |  |
| place.lagoa@PrompTugal.dinis | `place.lagoa-promptugal`, `site.lagoa-promptugal` |  | 2026-11-16 15:26Z | 17 | 2026-11-16T15:35Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.lagos@PrompTugal.dinis | `place.lagos-promptugal`, `site.lagos-promptugal` |  | 2026-11-16 15:26Z | 11 | 2026-11-16T15:40Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| viz.places@PrompTugal.dinis | `viz.places-promptugal` |  | 2026-11-16 15:24Z | 18 | 2026-11-16T15:24Z |  |  |
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-16 12:46Z | 7 |  |  |  |
| analyst@PrompTugal.vicky | `analyst-vicky-promptugal` |  | 2026-11-16 12:44Z | 13 |  |  |  |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-c` | 2 | 2026-11-16 10:18Z | 16 |  |  |  |
| conductor@web-summit.dinis | none |  | 2026-11-16 00:33Z | 48 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-c` | 2 | 2026-11-15 13:16Z | 53 |  | silent 33 h |  |
| conductor@web-summit.vicky | `conductor-vicky-3-promptugal` | 1 | 2026-11-14 18:48Z | 14 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-2` | 2 | 2026-11-14 14:10Z | 48 |  | silent 56 h |  |
| reporter@PrompTugal.vicky | `reporter-vicky-promptugal` |  | 2026-11-14 10:37Z | 1 |  | silent 59 h |  |
| internal@web-summit.vicky | none |  | 2026-11-14 10:36Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-c` | 2 | 2026-11-13 16:40Z | 29 |  | silent 77 h |  |
| social.watch@PrompTugal.dinis | `social-watch-promptugal` |  | 2026-11-12 14:53Z | 39 | 2026-11-12T14:53Z | silent 103 h |  |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-12 14:11Z | 19 |  | silent 104 h |  |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  | 2026-11-12 12:51Z | 106 |  | silent 105 h |  |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-12 12:26Z | 30 |  | commits with no active key; silent 106 h |  |
| weather@PrompTugal.vicky | `weather-vicky-promptugal` |  | 2026-11-12 08:49Z | 108 |  | silent 109 h |  |
| programme@PrompTugal.vicky | none | 3 | 2026-11-12 07:03Z | 36 |  | commits with no active key; silent 111 h |  |
| reporter.newsroom@PrompTugal.dinis | `reporter.newsroom-promptugal` |  | 2026-11-12 00:30Z | 28 | 2026-11-12T00:45Z | silent 117 h |  |
| journalist.newsroom@PrompTugal.dinis | `journalist.newsroom-promptugal` |  | 2026-11-11 22:01Z | 26 | 2026-11-11T22:20Z | silent 120 h |  |
| journalist@PrompTugal.vicky | none | 3 | 2026-11-11 20:30Z | 58 |  | commits with no active key; silent 121 h |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-c` | 2 | 2026-11-11 19:16Z | 27 |  | silent 123 h |  |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` |  | 2026-11-11 18:21Z | 2 | 2026-11-11T18:30Z | silent 124 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| conductor.fringe@PrompTugal.angelo | `conductor.fringe-angelo` |  | 2026-11-11 11:30Z | 1 |  | silent 130 h |  |
| conductor.fringe@PrompTugal.vicky | `conductor.fringe-vicky` |  | 2026-11-11 11:04Z | 1 |  | silent 131 h |  |
| conductor.fringe@PrompTugal.dinis | `conductor.fringe-promptugal` | 1 | 2026-11-11 10:47Z | 2 |  | silent 131 h |  |
| conductor.B@ios.PrompTugal.dinis | none |  | 2026-11-11 10:44Z | 1 |  | commits with no active key; silent 131 h |  |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-11 00:43Z | 2 |  | silent 141 h |  |
| journalist@web-summit.indi | none |  | 2026-11-10 22:27Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor-newsapp@web-summit.indi | none |  | 2026-11-10 22:19Z | 3 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor@web-summit.indi | none |  | 2026-11-10 17:21Z | 4 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  | 2026-11-10 08:49Z | 10 |  | silent 157 h |  |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  | 2026-11-10 00:39Z | 9 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev.venues@PrompTugal.angelo | none |  | 2026-11-09 10:49Z | 1 |  | commits with no active key; silent 179 h |  |
| designer.experiments@PrompTugal.dinis | `designer.experiments-b-promptugal` | 1 |  |  | 2026-11-07T23:05Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| synthetic@PrompTugal.dinis | `synthetic-promptugal` | 1 |  |  | 2026-11-08T00:55Z | a key, no commit in 7 days | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| historian@PrompTugal.dinis | `historian-b-promptugal` | 1 |  |  | 2026-11-07T02:40Z | a key, no commit in 7 days | account B: none () |
| devops@PrompTugal.dinis | `devops-b-promptugal` | 1 |  |  | 2026-11-08T00:25Z | a key, no commit in 7 days | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| customers@PrompTugal.dinis | `customers-b-promptugal` | 1 |  |  | 2026-11-08T14:25Z | a key, no commit in 7 days | account B: none () |
| backup@PrompTugal.dinis | `backup-b-promptugal` | 1 |  |  | 2026-11-08T00:16Z | a key, no commit in 7 days | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word) |
| dev.pages@PrompTugal.dinis | `dev.pages-b-promptugal` | 1 |  |  | 2026-11-12T13:19Z |  | account B: on |
| dev.graphs@PrompTugal.dinis | `dev.graphs-promptugal-2` | 1 |  |  | 2026-11-12T12:35Z |  | account B: on |
| dev.search@PrompTugal.dinis | `dev.search-promptugal-2` | 1 |  |  | 2026-11-08T00:15Z |  | account B: paused (paused 01:11 UTC 8 Nov at Dinis's word ('for today, we can stop all those dev')) |
| dev.verify@PrompTugal.dinis | `dev.verify-b-promptugal` | 1 |  |  | 2026-11-09T20:58Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| dev.data@PrompTugal.dinis | `dev.data-b-promptugal` | 1 |  |  | 2026-11-12T12:34Z |  | account B: on |
| dev.portugal@PrompTugal.dinis | `dev.portugal-b-promptugal` | 1 |  |  | 2026-11-09T20:35Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| investors@PrompTugal.dinis | `investors-b-promptugal` | 1 |  |  | 2026-11-08T00:40Z | a key, no commit in 7 days | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| investors.packs@PrompTugal.dinis | `investors.packs-promptugal` |  |  |  |  | a key, no commit in 7 days | account B: none (no wake: Dinis works with it in its session; real people's data only in vaults, never in t) |
| site.albufeira@PrompTugal.dinis | none | 1 |  |  |  | a key, no commit in 7 days |  |
