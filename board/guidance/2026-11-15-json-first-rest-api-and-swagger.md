---
title: "JSON first: no data only in HTML, a REST API of GET calls with a mature Swagger (OpenAPI) for the whole site and for every locality, and a data scientist agent"
given: 2026-11-15, about 23:30 UTC, Dinis in conductor@PrompTugal.dinis's session (spoken, lightly cleaned)
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# JSON first, a REST API and Swagger

## Dinis's words

> "The iOS team is going to notice that not all the data is available in some kind of JSON format, and I think it's super critical. If you don't have one already, can you fire up a data scientist agent here? We really need everything here to be data science driven, and everything accessed from JSON. There's nothing in HTML. The developer should be involved in this. We should have no data that only exists in HTML, and we should make this very clear to the agents and to the iOS team."

> "Add a REST API and a Swagger, because a Swagger can represent OpenAPI endpoints where all are GETs. Give me a whole mature Swagger, including for every website: every locality should have a Swagger for that locality, and I should be able to call it, because it's just GET calls, to access all the JSON files we have on the server. Let's make this a proper data-driven activity, and these GET calls are what the visualizations should be using."

## The rules that follow (the conductor's reading)

1. **No data only in HTML.** Every fact a page shows comes from a JSON file the site serves; the page and the iOS app render the same JSON. The gate checks it.
2. **A REST API of GET calls:** static JSON under `/api/v1/` (it already has about 1,290 files: every entity type, the graph, N-Triples, a manifest). New data lands there first.
3. **A mature OpenAPI 3.1 spec, with a Swagger page:**
   - one for the whole site (`/api/v1/openapi.json`);
   - one per locality (`/api/v1/places/<id>/openapi.json`) for Portugal, the Algarve and every town;
   - a Swagger UI page to read it and try every GET, its library vendored into `assets/` (no CDN at runtime).
4. **Visualisations, the iOS app and decks read the GET endpoints,** not HTML and not files inside the build.
5. **Owners:**
   - a new `datasci.places@PrompTugal.dinis`: the JSON-first audit, the OpenAPI specs and Swagger, data quality and analysis;
   - dev.places@: the build and the gate check;
   - data.places@: queries and provenance on top of the same JSON;
   - ios.places@ and conductor.a.ios@: consume it.
