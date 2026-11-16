# The storm, from here: what can be shown locally, per place

By conductor@PrompTugal.dinis, 16 November 2026, at Dinis's word (`board/guidance/2026-11-16-reactivate-the-storm-locally.md`). Measured against IPMA's open data (https://api.ipma.pt/open-data/, no key) read at about 00:50 UTC on 16 November, and the storm site's own source maps (PrompTugal/PrompTugal__News__Storm-Charles: `sources/ipma/api.json`, `sources/ipma/data/places.json`, `sources/ipma/data/stations.json`).

## The answer in one line

Every one of the 17 Algarve places can show, every hour and with no model: the weather station nearest it, a 5-day forecast, the IPMA warnings for the Faro district, its own municipality's fire risk for three days, UV, and (on the coast) the sea. Faro airport traffic is a second step.

## What the storm site's sources give each place

| Data set (IPMA endpoint id) | Local to | Algarve coverage, 16 Nov | Refresh |
|---|---|---|---|
| `observations` (stations, hourly) | the nearest station | 20 stations in the region, 18 reporting at 23:00 UTC | hourly |
| `city-daily` (5-day forecast) | 4 forecast places: Faro 1080500, Loulé 1080800, Portimão 1081100, Sagres 1081505 | every place, nearest of the four (table below) | twice a day |
| `warnings` | area FAR (the Faro district = the Algarve) | the whole region; 9 entries, one yellow (rough sea, from 18 Nov 12:00 UTC) | as issued |
| `fire-risk` (rcm d0 to d2) | the municipality (DICO 0801 to 0816) | all 16 municipalities, each its own value (all "low" on 16 Nov) | daily |
| `uv` | Faro 1080500, Sagres 1081525 | region, two points | daily |
| `sea-forecast` | Faro coast 1080526, Sagres coast 1081526 | the coastal places (waves, period, sea temperature) | daily |
| `seismic` | the mainland area | region | as issued |
| Flights (adsb.lol, no key, storm site's `flights-poll`) | Faro airport LPFR | not yet: the storm's poller covered Lisbon and Madeira only | to decide |
| Transport (storm site's `transport-*`) | Lisbon only | none for the Algarve yet | to find |

## Per place: the nearest station and forecast

Approximate town centres; the collector uses each place's own coordinates. The machine-readable version: `board/briefs/2026-11-16-storm-local-map.json`.

| Place | Municipality (DICO) | Nearest station | Nearest forecast place |
|---|---|---|---|
| faro | 0805 | Faro (Aeródromo), 4 km | Faro, 1 km |
| loule | 0808 | Loulé (CML), 4 km | Loulé, 0 km |
| quarteira | 0808 | Loulé (CML), 7 km | Loulé, 11 km |
| silves | 0813 | Portimão (Praia da Rocha), 11 km | Portimão, 8 km |
| tavira | 0814 | Tavira, 3 km | Faro, 28 km |
| vila-real-de-santo-antonio | 0816 | Vila Real de S. António, 1 km | Faro, 50 km |
| portimao | 0811 | Portimão (Praia da Rocha), 2 km | Portimão, 2 km |
| lagos | 0807 | Portimão (Aeródromo), 10 km | Portimão, 15 km |
| olhao | 0810 | Olhão, EPPO, 2 km | Faro, 8 km |
| albufeira | 0801 | Albufeira, 1 km | Loulé, 21 km |
| lagoa | 0806 | Portimão (Praia da Rocha), 7 km | Portimão, 6 km |
| monchique | 0809 | Fóia, 4 km | Portimão, 19 km |
| aljezur | 0803 | Aljezur, 0 km | Portimão, 31 km |
| vila-do-bispo | 0815 | Sagres, 8 km | Sagres, 8 km |
| castro-marim | 0804 | Castro Marim (RN Sapal), 1 km | Faro, 49 km |
| alcoutim | 0802 | Alcoutim, Mart.Longo, 26 km | Loulé, 61 km |
| sao-bras-de-alportel | 0812 | Olhão, EPPO, 15 km | Loulé, 12 km |

Where the forecast place is far (the eastern towns, Aljezur, Alcoutim), the page says which place the forecast is for and how far; the station reading is the town's own.

## Which storm agents, and how (the lean plan)

- **No incident agent is re-enabled.** Their tasks stay disabled: they are Lisbon-scoped, their hand-overs need a fresh key and setup each, and every one carried large contexts. The storm site stays as the archive and the template.
- **One collector, no model, run here:** datasci.places@ ports the storm site's IPMA reader (`tools/ipma-read.mjs`: polite, one request every 3 seconds, endpoints from `api.json`) to this repository, limited to the 7 requests the Algarve needs (`observations`, `warnings`, `city-daily` for 4 places, `fire-risk` d0, `uv`, `sea-forecast` d0), run at its own hourly wake. Raw responses stay out of git (the storm site's rule); it writes small JSON only: `data/by-place/now/<place>.json` and the GET `/api/v1/places/<id>/now.json`, each value with its source URL, the IPMA field and the time read, documented in the OpenAPI.
- **On the pages:** dev.places@ adds "Now in <town>" (station, forecast, fire risk, warnings, sea) on each town page and the region page, pointing every value to IPMA; not a warning service. viz.places@ draws the 17 on the region map. ios.places@ reads the same endpoint, through conductor.a.ios@ (no pushes to the iOS repository from this side).
- **Second step, for Dinis:** Faro airport traffic (the storm's `flights-poll` with an LPFR area, adsb.lol's free limit is per IP and shared with nothing else here now), and the Algarve's transport (Vamus Algarve, CP's Linha do Algarve) if they publish open data.

## Cost

IPMA: 7 requests an hour, about 60 KB without the full observations file (about 1 MB; the collector keeps only the region's 20 stations). No model, no OpenRouter, no new session, no new scheduled task.
