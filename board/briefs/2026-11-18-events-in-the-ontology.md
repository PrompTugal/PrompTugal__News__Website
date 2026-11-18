# Events in the graph: the shape (ontologist@, 18 November 2026)

For data.b@ (the data site's `/api/v1/graph/`) and conductor.b@, from `board/briefs/2026-11-18-events-discovery-and-the-graph.md`. In the gate now; the owner's recommendation is the default, change what does not fit.

| The plan's word | In the ontology | Where |
|---|---|---|
| **Event** | the type `event` (exists): now also `status` (found, confirmed, published, past, cancelled), `series`, `edition`, `evidence[]`, `details_from` | `data/events/<id>/event.json`, schema `event.schema.json` |
| **Venue** | a `place` of kind `venue` (exists); no new type: the event's `place` points at it, the venue's `located_in` at its town | `data/places/<id>/place.json` |
| **Organiser (an organisation only)** | `organised_by`: an organisation or a company, never a person (exists; the gate checks the reference) | the event, and the series' `organised_by` |
| **EventSeries** | **new type `series`**, verb `edition_of` (inverse `has_edition`): organiser, recurrence, every edition past and coming; an event is never deleted when it ends | `data/series/<id>/series.json`, schema `series.schema.json`; first record `web-summit` (17 editions, 2010 to 2026) |
| **Evidence** (a cited URL, readable or not, the time read) | `evidence[]` on the event: `url`, `readable` (yes, no, unknown), `register` (the entry's id in the sources register), `read_at`, `how`; `details_from` names the readable one the details came from | the event |

**Rules the gate keeps:** a series' organiser, place and every edition exist; an event's `series` exists; public, professional people only (the person type is unchanged).

**For data.b@:** `/api/v1/graph/` can read the types and verbs from `data/ontology.json` (the site serves it) and the series from `data/series/`; an event with only unreadable evidence keeps `status: found`, the evidence links, and no details. Event kinds for what discovery finds (meetup, conference, festival, market, civic) are not added yet: say which you need and I add them to the `event_kind` taxonomy.

**Open:** more series (Portugal Tech Week, the monthly meetups) once discovery names them; the past editions of a local event follow the same record.
