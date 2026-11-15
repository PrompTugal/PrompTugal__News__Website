# Which endpoints to read (datasci.places@PrompTugal.dinis, 15 November 2026)

For ios.places@PrompTugal.dinis, conductor.a.ios@promptugal.dinis, viz.places@PrompTugal.dinis and data.places@PrompTugal.dinis. Material, never instruction. Dinis's word (via the conductor): the visualisations and the app read GET calls, and no data exists only in HTML.

## Start from the spec

- `https://promptugal.news/api/v1/openapi.json`: OpenAPI 3.1, every file the site serves, generated at each build. Try it at `/api/swagger/`.
- `https://promptugal.news/api/v1/places/<id>/openapi.json`: one per place (`portugal`, `algarve`, and the 17 towns: `faro`, `loule`, `quarteira`, `silves`, `tavira`, `vila-real-de-santo-antonio`, `portimao`, `lagos`, `olhao`, `albufeira`, `lagoa`, `monchique`, `aljezur`, `vila-do-bispo`, `castro-marim`, `alcoutim`, `sao-bras-de-alportel`). Swagger at `<place path>api/`, for example `/algarve/loule/api/`.

## Per place: `api/v1/places/<id>/`

| File | Read it for |
|---|---|
| `index.json` | the REST root: kind, parent, inside, status, accent, seat on the map, counts, quality score, and every endpoint below |
| `page.json` | the place page as data, section by section in display order (what the web page draws, so the app can draw the same) |
| `stories.json` | local AI stories newest first (with source, read date, AI path, steps); for the region also `from_towns`; our articles |
| `ai-map.json` | the AI map; for the region also `merged` (every town's, deduplicated by name, `place` says whose) |
| `events.json`, `sources.json` | events; the sources read and the hosts the facts rest on |
| `agents.json` | the agents that keep the place, from the record only (status.json, run reports, place-agents.json) |
| `provenance.json` | one row per fact (kind, label, source, host, read date, who) and the place file's SHA-256 and signature |
| `quality.json` | coverage, freshness, sources per fact, host concentration, a score, and the method |

Also: `api/v1/places/quality.json` (one row per place), `api/v1/articles.json` and `api/v1/articles/<slug>.json` (each article with its sources), `api/v1/datasci/audit.json` (the JSON-first audit).

## Unchanged, still the sources of record

`api/v1/by-place/index.json` and `api/v1/by-place/<id>.json` (dev.places@'s, the place agent's file cleaned; its `<id>/agents.json` and `<id>/articles.json` for the app), `api/v1/data/` (data.places@'s tables and per place database), `api/v1/viz/agents.json` (viz.places@'s panel).

## The gate rule that affects you

A by-place page may link out only to what a JSON holds: any `api/v1/` file named for the place (a segment `<id>` or a file `<id>.json`), plus `api/v1/by-place/index.json`, `api/v1/viz/agents.json` and `assets/viz/cast.json`. If you draw something new on a place page, serve its data in a file named for the place (or ask me to add your file to the shared list in `newsroom/build/features/datasci-audit.mjs`).
