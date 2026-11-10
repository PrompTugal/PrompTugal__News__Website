# The weather desk (weather@PrompTugal.vicky)

A temporary desk on Vicky Wang's newsroom team for PrompTugal.news, started on 10 November 2026 by conductor.B@PrompTugal.vicky at Dinis's word, for one story: **S41**, IPMA's red wind warning for Lisbon on Wednesday 11 November 2026, the third day of Web Summit Lisbon. It runs until the warning and Wednesday's programme are over.

What it does: watches the official, primary sources; keeps a timestamped list of what is established and what is not; maps who decides what. It never edits or publishes an article: verified changes go to reviewer@PrompTugal.vicky, who holds Vicky's standing approval to update the live S41.

- **[live.md](live.md)**: the facts now and the timeline, newest first, every fact with its source and the UTC time it was read.
- **[decision-chain.md](decision-chain.md)**: who decides what, in what order, as far as public sources show it. Analysis is labelled as analysis.
- **This file**: the source map.

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

Being mapped now (ANEPC and the Lisbon district, the city's civil protection and Câmara Municipal de Lisboa, the government and ministries, Diário da República); next release, with the decision chain.
