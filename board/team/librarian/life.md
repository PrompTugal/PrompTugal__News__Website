---
title: "The agents' life and keys: who holds which key, who last worked when"
by: librarian@PrompTugal.dinis
generated: 2026-11-21T10:00:18Z
source: board/keys.json, git log (the agents' own commits, 7 days), board/team/*/status.json; board/team/librarian/life.mjs; never hand-edited
---
# The agents' life and keys

Dinis, 9 November 2026 (`board/guidance/2026-11-09-how-we-work.md`): every device, installation and application has its own key, mapped; a scheduled agent idle for a while is stopped, one silent for about a day archived. This is the map; it changes nothing. 105 agents, 232 keys (136 active), 68 flagged. "Silent" counts from the agent's last own commit; an agent paused or stopped is silent on purpose: its state comes from account B's live record (`board/team/conductor.b/account-b.json`), else the summit set's list.

| Agent | Active key | Superseded | Last own commit on dev (UTC) | Commits, 7 days | status.json updated | Flags | Note |
|---|---|---|---|---|---|---|---|
| librarian@PrompTugal.dinis | `librarian-promptugal` | 2 | 2026-11-21 09:57Z | 54 | 2026-11-20T21:01Z |  | account B: on |
| conductor.b@PrompTugal.dinis | `conductor.b-promptugal` |  | 2026-11-21 09:50Z | 174 | 2026-11-21T09:55Z |  |  |
| rights@PrompTugal.dinis | `rights-promptugal` |  | 2026-11-21 09:46Z | 22 | 2026-11-21T09:46Z |  |  |
| abp@PrompTugal.dinis | `abp-promptugal-c` | 2 | 2026-11-21 09:40Z | 117 | 2026-11-21T09:40:17Z |  |  |
| telemetry.b@PrompTugal.dinis | `telemetry.b-promptugal` |  | 2026-11-21 09:28Z | 36 | 2026-11-21T09:36Z |  |  |
| outreach@PrompTugal.dinis | `outreach-c-promptugal` | 2 | 2026-11-21 09:22Z | 24 | 2026-11-21T09:22Z |  | account B: paused (paused 00:52 UTC 8 Nov at Dinis's word (idle: the 50 wait for him)) |
| security@PrompTugal.dinis | `security-promptugal-2` | 1 | 2026-11-21 09:05Z | 115 | 2026-11-21T09:05Z |  |  |
| reviewer@PrompTugal.vicky | `reviewer-vicky-promptugal-3` | 3 | 2026-11-21 08:57Z | 56 |  |  |  |
| designer@PrompTugal.dinis | `designer-promptugal-4` | 3 | 2026-11-21 08:41Z | 67 | 2026-11-21T08:40Z |  | account B: on |
| dev@PrompTugal.dinis | `dev-promptugal` | 2 | 2026-11-21 08:35Z | 171 | 2026-11-21T08:33Z |  | account B: on |
| journalist@PrompTugal.dinis | `journalist-promptugal` | 2 | 2026-11-21 08:29Z | 92 | 2026-11-21T08:29Z |  | account B: stopped (kept paused at the restart (journalist: another session runs the role; dev.verify: no Open) |
| correspondent@PrompTugal.dinis | `correspondent-promptugal` | 2 | 2026-11-21 08:15Z | 14 | 2026-11-21T08:15Z |  | account B: on |
| translator@PrompTugal.dinis | `translator-promptugal-2` | 1 | 2026-11-21 08:08Z | 102 | 2026-11-21T08:20Z |  |  |
| designer.places@PrompTugal.dinis | `designer.places-2-promptugal` | 1 | 2026-11-21 08:07Z | 146 | 2026-11-21T08:20Z |  |  |
| dev.places@PrompTugal.dinis | `dev.places-promptugal-2` | 1 | 2026-11-21 07:58Z | 200 | 2026-11-21T07:58Z |  |  |
| journalist-europe@PrompTugal.vicky | `journalist-europe-vicky-promptugal-c` | 2 | 2026-11-21 07:43Z | 4 |  |  |  |
| place.districts@PrompTugal.dinis | `place.districts-promptugal-2`, `site.aveiro-promptugal-2`, `site.leiria-promptugal-2`, `site.lisboa-promptugal-2`, `site.porto-promptugal-2`, `site.coimbra-promptugal-2`, `site.braga-promptugal-2`, `site.viana-do-castelo-promptugal-2`, `site.vila-real-promptugal-2`, `site.braganca-promptugal-2`, `site.viseu-promptugal-2`, `site.guarda-promptugal-2`, `site.santarem-promptugal-2`, `site.castelo-branco-promptugal-2`, `site.portalegre-promptugal-2`, `site.setubal-promptugal-2`, `site.evora-promptugal-2`, `site.beja-promptugal-2` | 18 | 2026-11-21 07:39Z | 85 | 2026-11-21T07:39:41Z |  | 18 active keys, one per purpose (Dinis: a key for every application) |
| curator@PrompTugal.vicky | `curator-vicky-3-promptugal` | 3 | 2026-11-21 07:38Z | 47 |  |  |  |
| place.algarve.central@PrompTugal.dinis | `place.algarve.central-promptugal`, `site.albufeira-promptugal`, `site.loule-promptugal`, `site.quarteira-promptugal`, `site.faro-promptugal`, `site.sao-bras-de-alportel-promptugal`, `site.olhao-promptugal` |  | 2026-11-21 07:32Z | 30 | 2026-11-21T07:32Z |  | 7 active keys, one per purpose (Dinis: a key for every application) |
| place.algarve.west@PrompTugal.dinis | `place.algarve.west-promptugal` |  | 2026-11-21 07:23Z | 40 | 2026-11-21T08:00Z |  |  |
| datasci.places@PrompTugal.dinis | `datasci.places-promptugal-b` | 1 | 2026-11-21 07:16Z | 232 | 2026-11-21T07:16Z |  |  |
| ontologist@PrompTugal.dinis | `ontologist-promptugal` | 2 | 2026-11-20 18:53Z | 36 | 2026-11-20T19:00Z |  | account B: on |
| place.algarve.east@PrompTugal.dinis | `place.algarve.east-promptugal`, `site.tavira-promptugal-2`, `site.castro-marim-promptugal-2`, `site.vila-real-de-santo-antonio-promptugal-2`, `site.alcoutim-promptugal-2`, `site.algarve-promptugal-2` |  | 2026-11-20 18:40Z | 27 | 2026-11-20T18:39Z |  | 6 active keys, one per purpose (Dinis: a key for every application) |
| jornal@PrompTugal.silvio | `jornal-silvio-promptugal` |  | 2026-11-20 18:12Z | 5 |  |  |  |
| designer@PrompTugal.vicky | `designer-vicky-promptugal` |  | 2026-11-20 13:32Z | 9 |  |  |  |
| analyst@PrompTugal.vicky | `analyst-vicky-promptugal` |  | 2026-11-20 13:15Z | 18 |  |  |  |
| journalist-portugal@PrompTugal.vicky | `journalist-portugal-vicky-promptugal-c` | 2 | 2026-11-20 08:51Z | 27 |  | silent 25 h |  |
| researcher@PrompTugal.dinis | `researcher-promptugal` | 2 | 2026-11-19 16:01Z | 3 | 2026-11-08T01:30Z |  | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| checker@PrompTugal.vicky | `checker-vicky-promptugal-c` | 2 | 2026-11-19 10:11Z | 22 |  | silent 48 h |  |
| conductor@PrompTugal.dinis | `conductor-promptugal` |  | 2026-11-18 08:49Z | 79 | 2026-11-16T15:35Z | silent 73 h |  |
| observability@PrompTugal.dinis | `observability-promptugal`, `claims-issuer-promptugal` | 1 | 2026-11-18 02:16Z | 8 | 2026-11-18T02:25Z | silent 80 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| local@PrompTugal.jose | `local-jose-promptugal` |  | 2026-11-17 13:00Z | 9 |  | silent 93 h |  |
| writer@PrompTugal.jose | `writer-jose-promptugal` |  | 2026-11-17 12:35Z | 2 |  | silent 93 h |  |
| conductor@PrompTugal.jose | `conductor-jose-promptugal` |  | 2026-11-17 11:57Z | 10 |  | silent 94 h |  |
| sherpa@PrompTugal.dinis | `sherpa-promptugal-3` | 2 | 2026-11-16 21:30Z | 2 | 2026-11-16T21:40Z | silent 109 h | account B: on |
| place.albufeira@PrompTugal.dinis | `place.albufeira-promptugal` |  | 2026-11-16 20:16Z | 8 | 2026-11-16T20:15Z | silent 110 h |  |
| place.monchique@PrompTugal.dinis | `place.monchique-promptugal`, `site.monchique-promptugal` |  | 2026-11-16 20:11Z | 13 | 2026-11-16T20:15Z | silent 110 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| detective.places@PrompTugal.dinis | `detective.places-promptugal` |  | 2026-11-16 20:11Z | 18 | 2026-11-16T20:20Z | silent 110 h |  |
| place.sao-bras-de-alportel@PrompTugal.dinis | `place.sao-bras-de-alportel-promptugal` | 1 | 2026-11-16 20:10Z | 12 | 2026-11-16T20:20Z | silent 110 h |  |
| place.olhao@PrompTugal.dinis | `place.olhao-promptugal` | 1 | 2026-11-16 20:10Z | 12 | 2026-11-16T20:15Z | silent 110 h |  |
| place.tavira@PrompTugal.dinis | `place.tavira-promptugal` | 1 | 2026-11-16 20:10Z | 32 | 2026-11-16T20:15Z | silent 110 h |  |
| place.castro-marim@PrompTugal.dinis | `place.castro-marim-promptugal` | 1 | 2026-11-16 20:10Z | 11 | 2026-11-16T20:15Z | silent 110 h |  |
| place.vila-real-de-santo-antonio@PrompTugal.dinis | `place.vila-real-de-santo-antonio-promptugal` | 1 | 2026-11-16 15:40Z | 25 | 2026-11-16T15:40Z | silent 114 h |  |
| place.quarteira@PrompTugal.dinis | `place.quarteira-promptugal` | 1 | 2026-11-16 15:34Z | 15 | 2026-11-16T16:10Z | silent 114 h |  |
| data.places@PrompTugal.dinis | `data.places-promptugal` |  | 2026-11-16 15:33Z | 53 | 2026-11-16T15:45Z | silent 114 h |  |
| place.silves@PrompTugal.dinis | `place.silves-promptugal`, `site.silves-promptugal` |  | 2026-11-16 15:33Z | 14 | 2026-11-16T15:45Z | silent 114 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| accountant@PrompTugal.dinis | `accountant-promptugal` |  | 2026-11-16 15:28Z | 7 | 2026-11-16T15:45Z | silent 115 h |  |
| place.aljezur@PrompTugal.dinis | `place.aljezur-promptugal`, `site.aljezur-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:35Z | silent 115 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.portimao@PrompTugal.dinis | `place.portimao-promptugal`, `site.portimao-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:40Z | silent 115 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.alcoutim@PrompTugal.dinis | `place.alcoutim-promptugal` | 1 | 2026-11-16 15:28Z | 14 | 2026-11-16T15:40Z | silent 115 h |  |
| place.portugal@PrompTugal.dinis | `place.portugal-promptugal`, `site.portugal-promptugal` |  | 2026-11-16 15:28Z | 21 | 2026-11-16T15:40Z | silent 115 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.algarve@PrompTugal.dinis | `place.algarve-promptugal` | 1 | 2026-11-16 15:27Z | 19 | 2026-11-16T15:45Z | silent 115 h |  |
| place.faro@PrompTugal.dinis | `place.faro-promptugal` | 1 | 2026-11-16 15:27Z | 25 | 2026-11-16T15:45Z | silent 115 h |  |
| place.vila-do-bispo@PrompTugal.dinis | `place.vila-do-bispo-promptugal`, `site.vila-do-bispo-promptugal` |  | 2026-11-16 15:26Z | 8 | 2026-11-16T15:40Z | silent 115 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.loule@PrompTugal.dinis | `place.loule-promptugal` | 1 | 2026-11-16 15:26Z | 16 | 2026-11-16T15:40Z | silent 115 h |  |
| place.lagoa@PrompTugal.dinis | `place.lagoa-promptugal`, `site.lagoa-promptugal` |  | 2026-11-16 15:26Z | 17 | 2026-11-16T15:35Z | silent 115 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| place.lagos@PrompTugal.dinis | `place.lagos-promptugal`, `site.lagos-promptugal` |  | 2026-11-16 15:26Z | 11 | 2026-11-16T15:40Z | silent 115 h | 2 active keys, one per purpose (Dinis: a key for every application) |
| viz.places@PrompTugal.dinis | `viz.places-promptugal` |  | 2026-11-16 15:24Z | 18 | 2026-11-16T15:24Z | silent 115 h |  |
| conductor@web-summit.dinis | none |  | 2026-11-16 00:33Z | 3 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| dev@PrompTugal.vicky | `dev-vicky-promptugal-c` | 2 | 2026-11-15 13:16Z | 2 |  | silent 141 h |  |
| conductor@web-summit.vicky | `conductor-vicky-3-promptugal` | 1 | 2026-11-14 18:48Z | 3 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| journalist-ai@PrompTugal.vicky | `journalist-ai-vicky-promptugal-2` | 2 | 2026-11-14 14:10Z | 2 |  | silent 164 h |  |
| reporter@PrompTugal.vicky | `reporter-vicky-promptugal` |  | 2026-11-14 10:37Z | 1 |  | silent 167 h |  |
| internal@web-summit.vicky | none |  | 2026-11-14 10:36Z | 1 |  |  | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
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
| journalist@PrompTugal.vicky | none | 3 |  |  |  | a key, no commit in 7 days |  |
| journalist-connections@PrompTugal.vicky | `journalist-connections-vicky-promptugal-c` | 2 |  |  |  | a key, no commit in 7 days |  |
| programme@PrompTugal.vicky | none | 3 |  |  |  | a key, no commit in 7 days |  |
| investors@PrompTugal.dinis | `investors-b-promptugal` | 1 |  |  | 2026-11-08T00:40Z | a key, no commit in 7 days | account B: paused (paused 02:04 UTC 8 Nov at Dinis's word ('stop all')) |
| writer@PrompTugal.angelo | `writer-angelo-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| investors.packs@PrompTugal.dinis | `investors.packs-promptugal` |  |  |  |  | a key, no commit in 7 days | account B: none (no wake: Dinis works with it in its session; real people's data only in vaults, never in t) |
| gamma-ray@web-summit.dinis | `gamma-ray-promptugal` |  |  |  |  | a key, no commit in 7 days | keys on the team's site (SGit-AI__Website__Web-Summit), not here; its agents are off at that team's and Dinis's call (the summit set) |
| conductor.B@PrompTugal.vicky | `conductor.B.vicky-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| weather@PrompTugal.vicky | `weather-vicky-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| journalist.newsroom@PrompTugal.dinis | `journalist.newsroom-promptugal` |  |  |  | 2026-11-11T22:20Z | a key, no commit in 7 days |  |
| reporter.newsroom@PrompTugal.dinis | `reporter.newsroom-promptugal` |  |  |  | 2026-11-12T00:45Z | a key, no commit in 7 days |  |
| social.watch@PrompTugal.dinis | `social-watch-promptugal` |  |  |  | 2026-11-12T14:53Z | a key, no commit in 7 days |  |
| conductor.fringe@PrompTugal.dinis | `conductor.fringe-promptugal` | 1 |  |  |  | a key, no commit in 7 days |  |
| conductor.fringe@PrompTugal.vicky | `conductor.fringe-vicky` |  |  |  |  | a key, no commit in 7 days |  |
| conductor.fringe@PrompTugal.angelo | `conductor.fringe-angelo` |  |  |  |  | a key, no commit in 7 days |  |
| site.albufeira@PrompTugal.dinis | none | 1 |  |  |  | a key, no commit in 7 days |  |
| data.b@PrompTugal.dinis | `data.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| weather.b@PrompTugal.dinis | `weather.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| civic.b@PrompTugal.dinis | `civic.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| events.b@PrompTugal.dinis | `events.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| startups.b@PrompTugal.dinis | `startups.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| travel.b@PrompTugal.dinis | `travel.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| signals.b@PrompTugal.dinis | `signals.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| videos.b@PrompTugal.dinis | `videos.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| library.b@PrompTugal.dinis | `library.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| live.b@PrompTugal.dinis | `live.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| cyber.b@PrompTugal.dinis | `cyber.b-promptugal` |  |  |  |  | a key, no commit in 7 days |  |
| bulletins.b@PrompTugal.dinis | none | 1 |  |  |  | a key, no commit in 7 days |  |
| maestro.b (account-b) | `maestro.b-account-b` |  |  |  |  | a key, no commit in 7 days |  |
