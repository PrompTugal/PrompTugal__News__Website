# The weather desk (weather@PrompTugal.vicky)

A temporary desk on Vicky Wang's newsroom team for PrompTugal.news, started on 10 November 2026 by conductor.B@PrompTugal.vicky at Dinis's word, for one story: **S41**, IPMA's red wind warning for Lisbon on Wednesday 11 November 2026, the third day of Web Summit Lisbon. It runs until the warning and Wednesday's programme are over.

What it does: watches the official, primary sources; keeps a timestamped list of what is established and what is not; maps who decides what. It never edits or publishes an article: verified changes go to reviewer@PrompTugal.vicky, who holds Vicky's standing approval to update the live S41.

- **[live.md](live.md)**: the facts now and the timeline, newest first, every fact with its source and the UTC time it was read.
- **[decision-chain.md](decision-chain.md)**: who decides what, in what order, as far as public sources show it. Analysis is labelled as analysis.
- **[decision-graph.json](decision-graph.json)**: the decision graph (nodes, edges, lead times; predictions labelled as analysis).
- **[law.md](law.md)**: who has the legal power to decide what, quoted from the law.
- **[history.md](history.md)**: past storms and what was decided, when (press labelled).
- **[s41-lead.json](s41-lead.json)**: the field values for S41's home-page lead, for the reviewer.
- **[proposal-storm-page.md](proposal-storm-page.md)**: a proposal for one storm page on the site (not a build).
- **[tools/watch.mjs](tools/watch.mjs)** and **data/**: the connectors and their timestamped snapshots.
- **This file**: the source map.

## The team in this desk's runs (sub-agents, not sessions)

At Dinis's guidance of 10 November ([the storm as our case study](../../board/guidance/2026-11-10-the-storm-as-our-case-study.md)): a meteorologist (IPMA, the connectors), a historian (history.md), a researcher (the source map), a Portuguese-law agent (law.md) and a Câmara de Lisboa agent (the city's decisions; lisboa.pt refuses automated reads, so **a person must read it**, and the desk does not try to get round the site's bot check).

## Connectors (`node desks/weather-vicky/tools/watch.mjs [--only <name>] [--save]`)

| Reader | Source | Takes only |
|---|---|---|
| `ipma` | IPMA warnings JSON | Lisbon's warnings in full; which areas are red, by type |
| `communiques` | IPMA communiqués RSS | the latest three communiqués and the feed's build time |
| `stations` | IPMA station observations | the last six hours of mean wind and rain at five Lisbon stations |
| `lppt` | NOAA Aviation Weather API (IPMA's TAF and METAR for Lisbon airport) | the TAF, the last METARs and any gusts in them |
| `carrismet` | Carris Metropolitana alerts JSON | weather alerts by header and effect; how many are suspensions (NO_SERVICE) |
| `ttsl` | Transtejo/Soflusa notices RSS | the latest four ferry notices |
| `gov` | the government's declaration page | the declared period; any mention of contingency or calamity |
| `websummit` | Web Summit homepage and news page (raw) | storm words (weather, storm, Charles, IPMA, cancelled due...) |

With `--save`, each run writes `data/<UTC>.json`: the record to check the decision graph and the forecasts against what happened.

Times: Lisbon is on UTC in November (WET), so Lisbon time and UTC are the same until 29 March 2027. IPMA's warning times are local.

Public sources only. No contact details are copied here, even where a source page shows them.

## The source map

Each source: what it publishes, how often, the language, and whether a machine can read it. Status as checked on 10 November 2026; "read" means this desk opened it itself or through its own sub-agent, with the time in live.md.

### Weather: IPMA (Instituto Português do Mar e da Atmosfera), the national meteorological authority

| Source | What | How often | Lang | Machine-readable |
|---|---|---|---|---|
| [Warnings open data, `warnings_www.json`](https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json) | Every active warning by area (`idAreaAviso`; Lisbon district = `LSB`), type (Vento = wind, Precipitação = rain, Agitação Marítima = sea, Trovoada = thunder), level (green, yellow, orange, red), start and end (local time) and text | Updated as IPMA changes a warning, several times a day in a storm | PT | Yes, JSON, no key. **The first place a level change shows.** |
| [Area codes, `distrits-islands.json`](https://api.ipma.pt/open-data/distrits-islands.json) | Maps `idAreaAviso` codes to places (LSB Lisboa, STB Setúbal, MCS Madeira south coast...) | Static | PT | Yes |
| [Warnings map, prev-sam](https://www.ipma.pt/pt/otempo/prev-sam/) | The same warnings as a map, for people | As above | PT/EN | No (page) |
| [Communiqués, comunicados](https://www.ipma.pt/pt/otempo/comunicados/) and its [RSS feed](https://www.ipma.pt/resources.www/rss/comunicados.xml) | Special weather information: names the storm, its track, the expected gusts and rain, and says when it will be updated | "Será atualizado sempre que necessário" (updated whenever needed) | PT | Yes, RSS |
| [Daily forecast for Lisbon, `1110600.json`](https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json) | Five days: rain probability, min and max temperature, wind direction and a daily wind class (a mean-wind class, not gusts) | Twice a day or more (`dataUpdate`) | PT codes | Yes |
| [Station observations, `observations.json`](https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json) with [stations.json](https://api.ipma.pt/open-data/observation/meteorology/stations/stations.json) | The last 24 hours, hourly, per station: mean wind (km/h), direction, rain, temperature, pressure. Lisbon stations include Lisboa (Geofísico) 1200535, Lisboa Relógio 1210580, Tapada da Ajuda 1210762, Amoreiras 7240919, Carnide (CML) 6215302. **No gusts in this feed.** | Hourly | codes | Yes. **The evidence of what actually happened on Wednesday.** |
| Lisbon airport TAF and METAR (LPPT), issued by IPMA as the aeronautical met office, read through the [US NOAA Aviation Weather Center's public API](https://aviationweather.gov/api/data/taf?ids=LPPT&format=raw) | The airport's forecast (TAF) and hourly observations (METAR), **with gusts**, in knots | TAF every 6 hours plus amendments; METAR every 30 minutes | ICAO code | Yes, plain text. A point forecast for the airport, for pilots; not a public warning. |

### Sea and port

| Source | What | How often | Lang | Machine-readable |
|---|---|---|---|---|
| [Autoridade Marítima Nacional (AMN), news](https://www.amn.pt/Media/Paginas/DetalheNoticia.aspx?nid=7101) | The maritime authority and the Navy: sea-state warnings and advice; harbour-master (Capitania) notices on bar closures | When conditions change | PT | No (page; the avisos path we tried was 404) |
| [Port of Lisbon (APL)](https://www.portodelisboa.pt) and its [port safety news](https://www.portodelisboa.pt/noticias-seguranca-portuaria) | Port notices; a [met tool](https://portodelisboa.hidromod.com/meteoapl/) (not read) | Irregular | PT | No |

### Transport

| Source | What | Lang | Machine-readable |
|---|---|---|---|
| [Carris Metropolitana alerts](https://api.carrismetropolitana.pt/v2/alerts) | Regional bus alerts, GTFS-RT shape, with cause (WEATHER), effect and active period | PT | **Yes, JSON, no key: the best transport feed to poll** |
| [Transtejo/Soflusa notices](https://ttsl.pt/avisos/) and [RSS](https://ttsl.pt/avisos/feed/) | Ferry suspensions by route; the most exposed service | PT | **Yes, RSS** |
| [Fertagus, public information](https://www.fertagus.pt/Fertagus-pt/Viajar/Comunicados-e-Campanhas/Informa%C3%A7%C3%A3o-ao-P%C3%BAblico) | Rail across the 25 de Abril bridge | PT | No |
| [Carris](https://www.carris.pt) | City buses and trams; homepage notice | PT/EN | No |
| [Metro de Lisboa](https://www.metrolisboa.pt), [RSS](https://www.metrolisboa.pt/feed/), [open data](https://www.metrolisboa.pt/dados-abertos/) | Line status (needs a browser or its API, said to need a token) | PT/EN | Partly |
| [CP](https://www.cp.pt) | National and suburban rail (Sintra, Cascais, Azambuja lines) | PT/EN | No: renders only in a browser; not read |
| [Lisbon airport (ANA)](https://www.aeroportolisboa.pt) and [NAV Portugal](https://www.nav.pt) | Flights and notices; air traffic control | PT/EN | ANA returns a bot check to our tools; not read. NAV read |

### The venue and the summit

| Source | What | Machine-readable |
|---|---|---|
| [Web Summit](https://websummit.com/) and [news](https://websummit.com/blog/news/) | The organiser: any change to the programme would appear here first, with its app and social accounts (X, Instagram, LinkedIn, Facebook, as listed on its site; not read by us) | No; the support centre refuses automated reads (403) |
| [MEO Arena](https://arena.meo.pt) and [FIL](https://www.fil.pt) | The venues at Parque das Nações | No |

### Civil protection, government, city

| Source | What | Lang | Machine-readable |
|---|---|---|---|
| [Government, news (XXV Governo)](https://portugal.gov.pt/gc25/comunicacao/noticias/) | Declarations of alert, contingency or calamity and their measures (schools, events, parks); ministers' statements | PT | No (the RSS path we tried was 404) |
| [ANEPC, news and communiqués](https://prociv.gov.pt/pt/noticias/) | The civil-protection authority: readiness, SMS warnings, preventive measures | PT | No RSS found; the site resets connections at times |
| [ANEPC, warnings to the population](https://prociv.gov.pt/pt/avisos-a-populacao/) | Numbered public warnings (Aviso 21 for CHARLES), with PDFs | PT | No |
| [ANEPC, how alerts work](https://prociv.gov.pt/pt/prevencao-e-preparacao/monitorizacao-alerta-e-aviso/alerta/) | Who issues special alerts | PT | No |
| ANEPC incidents (the public occurrences map's ArcGIS service, `prociv-agserver.geomai.mai.gov.pt`) | Live incidents by place and type | codes | Yes in principle; it reset every connection on 10 Nov. **The evidence of impact on Wednesday, if it can be read.** |
| [Câmara Municipal de Lisboa](https://www.lisboa.pt) and [informacao.lisboa.pt](https://informacao.lisboa.pt) | The city and its municipal civil-protection service: city measures, the municipal emergency plan, park closures | PT | No: refuses automated reads (403). Needs a person or a browser |
| [Diário da República](https://diariodarepublica.pt) | The official gazette, where a declaration may be published | PT | No: a JavaScript app |

## Article categories (Vicky's approval, relayed by conductor.B@PrompTugal.vicky, 10 November 2026)

- Articles have 8 main categories, the only ones in the articles dropdown: Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate. Definitions: `desks/conductor-vicky/taxonomy/categories.md`; the site reads `desks/curator/categories.json` (the curator's).
- Storm and weather articles go under **Web Summit 2026**, with the secondary tag `storm`.
- The curator assigns each article one or more main categories when commissioning it; the reviewer checks them before publication.
- This desk never puts categories in article front matter and never invents one; tags stay secondary. When it proposes an article, it suggests the category to the curator.
- A new main category only with Vicky's approval, through the curator.

## Hourly read times for /storm/charles/ (conductor.B@PrompTugal.vicky, 11 November 2026, 09:48 UTC)

While IPMA's Lisbon warnings run (until 21:00 on 11 November), at every hourly check this desk sends dev@PrompTugal.vicky and reviewer@PrompTugal.vicky its fresh read times for the page's rows (IPMA, the government, ANEPC, Web Summit, transport), with any change and its source, and "re-read HH:MM UTC, no change" when nothing changed. dev@ refreshes the page; the reviewer verifies before release.
