---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-18T06:59:31Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 92 agents, 217 keys (122 active), 54 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| librarian@PrompTugal.dinis | `librarian-promptugal` | 2 | 2026-11-18 06:57Z | 36 | 2026-11-18T04:15Z |  | account B: on |
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-18 06:50Z | 74 | 2026-11-18T06:52Z |  |  |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 2 | 2026-11-18 06:41Z | 46 | 2026-11-18T00:55Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| abp@PrompTugal.dinis | `abp-promptugal-c` | 2 | 2026-11-18 06:38Z | 56 | 2026-11-18T06:50Z |  |  |
| place.districts@PrompTugal.dinis | `place.districts-promptugal-2`, `site.aveiro-promptugal-2`, `site.leiria-promptugal-2`, `site.lisboa-promptugal-2`, `site.porto-promptugal-2`, `site.coimbra-promptugal-2`, `site.braga-promptugal-2`, `site.viana-do-castelo-promptugal-2`, `site.vila-real-promptugal-2`, `site.braganca-promptugal-2`, `site.viseu-promptugal-2`, `site.guarda-promptugal-2`, `site.santarem-promptugal-2`, `site.castelo-branco-promptugal-2`, `site.portalegre-promptugal-2`, `site.setubal-promptugal-2`, `site.evora-promptugal-2`, `site.beja-promptugal-2` | 18 | 2026-11-18 06:37Z | 57 | 2026-11-18T06:45Z |  | 18 active keys, one per purpose (Dinis: a key for every application) |
| designer@PrompTugal.dinis | `designer-promptugal-4` | 3 | 2026-11-18 06:34Z | 37 | 2026-11-18T06:45Z |  | account B: on |
| dev@PrompTugal.dinis | `dev-promptugal` | 2 | 2026-11-18 06:13Z | 157 | 2026-11-18T06:20Z |  | account B: on |
| security@PrompTugal.dinis | `security-promptugal-2` | 1 | 2026-11-18 06:04Z | 51 | 2026-11-18T06:10Z |  |  |
| datasci.places@PrompTugal.dinis | `datasci.places-promptugal-b` | 1 | 2026-11-18 05:16Z | 44 | 2026-11-18T05:16Z |  |  |
| dev.places@PrompTugal.dinis | `dev.places-promptugal-2` | 1 | 2026-11-18 05:15Z | 76 | 2026-11-18T05:40Z |  |  |
| designer.places@PrompTugal.dinis | `designer.places-2-promptugal` | 1 | 2026-11-18 04:56Z | 48 | 2026-11-18T05:10Z |  |  |
| translator@PrompTugal.dinis | `translator-promptugal-2` | 1 | 2026-11-18 04:04Z | 38 | 2026-11-18T04:30Z |  |  |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-18 03:17Z | 102 | 2026-11-16T15:35Z |  |  |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` | 1 | 2026-11-18 02:16Z | 9 | 2026-11-18T02:25Z |  | 2 active keys, one per purpose (Dinis: a key for every application) |
| outreach@PrompTugal.dinis | `outreach-c-promptugal` | 2 | 2026-11-18 00:40Z | 11 | 2026-11-18T00:50Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word (idle: the 50 wait for him)) |
| place.algarve.central@PrompTugal.dinis | `place.algarve.central-promptugal`, `site.albufeira-promptugal`, `site.loule-promptugal`, `site.quarteira-promptugal`, `site.faro-promptugal`, `site.sao-bras-de-alportel-promptugal`, `site.olhao-promptugal` |  | 2026-11-18 00:26Z | 11 | 2026-11-18T00:35Z |  | 7 active keys, one per purpose (Dinis: a key for every application) |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 2 | 2026-11-18 00:22Z | 33 | 2026-11-18T00:45Z |  | account B: on |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 2 | 2026-11-17 22:44Z | 28 | 2026-11-17T22:44Z |  | account B: on |
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-3` | 3 | 2026-11-17 21:02Z | 116 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-c` | 2 | 2026-11-17 20:49Z | 28 |  |  |  |
| place.algarve.east@PrompTugal.dinis | `place.algarve.east-promptugal`, `site.tavira-promptugal-2`, `site.castro-marim-promptugal-2`, `site.vila-real-de-santo-antonio-promptugal-2`, `site.alcoutim-promptugal-2`, `site.algarve-promptugal-2` |  | 2026-11-17 17:39Z | 13 | 2026-11-17T18:50Z |  | 6 active keys, one per purpose (Dinis: a key for every application) |
| place.algarve.west@PrompTugal.dinis | `place.algarve.west-promptugal` |  | 2026-11-17 17:23Z | 21 | 2026-11-17T17:50Z |  |  |
| curator@PrompTugal.vicky | `curator-vicky-3-promptugal` | 3 | 2026-11-17 15:37Z | 68 |  |  |  |
| local@PrompTugal.jose | `local-jose-promptugal` |  | 2026-11-17 13:00Z | 9 |  |  |  |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-17 12:35Z | 2 |  |  |  |
| conductor@PrompTugal.jose | `conductor-jose-promptugal` |  | 2026-11-17 11:57Z | 10 |  |  |  |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-c` | 2 | 2026-11-17 10:17Z | 19 |  |  |  |
| researcher@PrompTugal.dinis | `researcher-promptugal` | 2 | 2026-11-17 04:54Z | 2 | 2026-11-08T01:30Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| sherpa@PrompTugal.dinis | `sherpa-promptugal-3` | 2 | 2026-11-16 21:30Z | 12 | 2026-11-16T21:40Z | silent 33 h | account B: on |
| place.albufeira@PrompTugal.dinis | `place.albufeira-promptugal` |  | 2026-11-16 20:16Z | 8 | 2026-11-16T20:15Z | silent 35 h |  |
| place.monchique@PrompTugal.dinis | `place.monchique-promptugal`, `site.monchique-promptugal` |  | 2026-11-16 20:11Z | 13 | 2026-11-16T20:15Z | silent 35 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| detective.places@PrompTugal.dinis | `detective.places-promptugal` |  | 2026-11-16 20:11Z | 18 | 2026-11-16T20:20Z | silent 35 h |  |
| place.sao-bras-de-alportel@PrompTugal.dinis | `place.sao-bras-de-alportel-promptugal` | 1 | 2026-11-16 20:10Z | 12 | 2026-11-16T20:20Z | silent 35 h |  |
| place.olhao@PrompTugal.dinis | `place.olhao-promptugal` | 1 | 2026-11-16 20:10Z | 12 | 2026-11-16T20:15Z | silent 35 h |  |
| place.tavira@PrompTugal.dinis | `place.tavira-promptugal` | 1 | 2026-11-16 20:10Z | 32 | 2026-11-16T20:15Z | silent 35 h |  |
| place.castro-marim@PrompTugal.dinis | `place.castro-marim-promptugal` | 1 | 2026-11-16 20:10Z | 11 | 2026-11-16T20:15Z | silent 35 h |  |
| place.vila-real-de-santo-antonio@PrompTugal.dinis | `place.vila-real-de-santo-antonio-promptugal` | 1 | 2026-11-16 15:40Z | 25 | 2026-11-16T15:40Z | silent 39 h |  |
| place.quarteira@PrompTugal.dinis | `place.quarteira-promptugal` | 1 | 2026-11-16 15:34Z | 15 | 2026-11-16T16:10Z | silent 39 h |  |
| data.places@PrompTugal.dinis | `data.places-promptugal` |  | 2026-11-16 15:33Z | 53 | 2026-11-16T15:45Z | silent 39 h |  |
| place.silves@PrompTugal.dinis | `place.silves-promptugal`, `site.silves-promptugal` |  | 2026-11-16 15:33Z | 14 | 2026-11-16T15:45Z | silent 39 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-16 15:28Z | 17 | 2026-11-16T15:45Z | silent 40 h |  |
| place.aljezur@PrompTugal.dinis | `place.aljezur-promptugal`, `site.aljezur-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:35Z | silent 40 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.portimao@PrompTugal.dinis | `place.portimao-promptugal`, `site.portimao-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:40Z | silent 40 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.alcoutim@PrompTugal.dinis | `place.alcoutim-promptugal` | 1 | 2026-11-16 15:28Z | 14 | 2026-11-16T15:40Z | silent 40 h |  |
| place.portugal@PrompTugal.dinis | `place.portugal-promptugal`, `site.portugal-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:40Z | silent 40 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.algarve@PrompTugal.dinis | `place.algarve-promptugal` | 1 | 2026-11-16 15:27Z | 19 | 2026-11-16T15:45Z | silent 40 h |  |
| place.faro@PrompTugal.dinis | `place.faro-promptugal` | 1 | 2026-11-16 15:27Z | 25 | 2026-11-16T15:45Z | silent 40 h |  |
| place.vila-do-bispo@PrompTugal.dinis | `place.vila-do-bispo-promptugal`, `site.vila-do-bispo-promptugal` |  | 2026-11-16 15:26Z | 8 | 2026-11-16T15:40Z | silent 40 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.loule@PrompTugal.dinis | `place.loule-promptugal` | 1 | 2026-11-16 15:26Z | 16 | 2026-11-16T15:40Z | silent 40 h |  |
| place.lagoa@PrompTugal.dinis | `place.lagoa-promptugal`, `site.lagoa-promptugal` |  | 2026-11-16 15:26Z | 17 | 2026-11-16T15:35Z | silent 40 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.lagos@PrompTugal.dinis | `place.lagos-promptugal`, `site.lagos-promptugal` |  | 2026-11-16 15:26Z | 11 | 2026-11-16T15:40Z | silent 40 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| viz.places@PrompTugal.dinis | `viz.places-promptugal` |  | 2026-11-16 15:24Z | 18 | 2026-11-16T15:24Z | silent 40 h |  |
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-16 12:46Z | 7 |  | silent 42 h |  |
| analyst@PrompTugal.vicky | `analyst-vicky-promptugal` |  | 2026-11-16 12:44Z | 13 |  | silent 42 h |  |
| conductor@web-summit.dinis | none |  | 2026-11-16 00:33Z | 13 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-c` | 2 | 2026-11-15 13:16Z | 35 |  | silent 66 h |  |
| conductor@web-summit.vicky | `conductor-vicky-3-promptugal` | 1 | 2026-11-14 18:48Z | 14 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-2` | 2 | 2026-11-14 14:10Z | 28 |  | silent 89 h |  |
| reporter@PrompTugal.vicky | `reporter-vicky-promptugal` |  | 2026-11-14 10:37Z | 1 |  | silent 92 h |  |
| internal@web-summit.vicky | none |  | 2026-11-14 10:36Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-c` | 2 | 2026-11-13 16:40Z | 16 |  | silent 110 h |  |
| social.watch@PrompTugal.dinis | `social-watch-promptugal` |  | 2026-11-12 14:53Z | 23 | 2026-11-12T14:53Z | silent 136 h |  |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-12 14:11Z | 10 |  | silent 137 h |  |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  | 2026-11-12 12:51Z | 49 |  | silent 138 h |  |
| conductor.android@promptugal.ai.dinis | none |  | 2026-11-12 12:26Z | 7 |  | commits with no active key; silent 139 h |  |
| weather@PrompTugal.vicky | `weather-vicky-promptugal` |  | 2026-11-12 08:49Z | 63 |  | silent 142 h |  |
| programme@PrompTugal.vicky | none | 3 | 2026-11-12 07:03Z | 13 |  | commits with no active key; silent 144 h |  |
| reporter.newsroom@PrompTugal.dinis | `reporter.newsroom-promptugal` |  | 2026-11-12 00:30Z | 12 | 2026-11-12T00:45Z | silent 150 h |  |
| journalist.newsroom@PrompTugal.dinis | `journalist.newsroom-promptugal` |  | 2026-11-11 22:01Z | 12 | 2026-11-11T22:20Z | silent 153 h |  |
| journalist@PrompTugal.vicky | none | 3 | 2026-11-11 20:30Z | 22 |  | commits with no active key; silent 154 h |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-c` | 2 | 2026-11-11 19:16Z | 10 |  | silent 156 h |  |
| conductor.fringe@PrompTugal.angelo | `conductor.fringe-angelo` |  | 2026-11-11 11:30Z | 1 |  | silent 163 h |  |
| conductor.fringe@PrompTugal.vicky | `conductor.fringe-vicky` |  | 2026-11-11 11:04Z | 1 |  | silent 164 h |  |
| conductor.fringe@PrompTugal.dinis | `conductor.fringe-promptugal` | 1 | 2026-11-11 10:47Z | 2 |  | silent 164 h |  |
| conductor.B@ios.PrompTugal.dinis | none |  | 2026-11-11 10:44Z | 1 |  | commits with no active key; silent 164 h |  |
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
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| investors.packs@PrompTugal.dinis | `investors.packs-promptugal` |  |  |  |  | a key, no commit in 7 days | account B: none (no wake: Dinis works with it in its session; real people's data only in vaults, never in t) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  |  |  |  | a key, no commit in 7 days | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| site.albufeira@PrompTugal.dinis | none | 1 |  |  |  | a key, no commit in 7 days |  |
