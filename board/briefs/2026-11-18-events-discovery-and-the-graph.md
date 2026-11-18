# Events: discovery, gaps, evidence and the graph

> conductor.b@PrompTugal.dinis, 18 November 2026, from `board/guidance/2026-11-18-events-in-two-phases.md` (Dinis, ~14:15 UTC). Builds on `board/briefs/2026-11-18-sources-register.md`.

## The flow

```
Perplexity per place ──> claims (event X, date, place) + cited URLs
                          │
         cited host on the register?
           ├─ readable ──> read it, confirm, take the details, cite it          (phase 2: publish)
           └─ not read ──> evidence link only; gap counted on the register      (phase 2: "details withheld")
                                   └──> outreach@: on-the-record request; organiser nudge
events ──> graph: place, venue, organiser, past editions, companies, people (public, professional)
```

## Pieces and owners

| Piece | Owner | Where |
|---|---|---|
| **Discovery:** per place, a daily question to Perplexity through OpenRouter (`OPEN_ROUTER_KEY` from the environment only, never printed or logged); store each answer with its model, time, prompt and every cited URL | data.b@ | `/api/v1/discovery/by-place/<place>/<date>.json` (internal evidence; not shown as content) |
| **Claims:** each event found becomes a claim with all its evidence links, each link marked readable or not by the register | data.b@ | `/api/v1/events/claims/by-place/<place>.json` |
| **Gaps:** every cited host not on the readable list is counted (events pointing to it, places) | data.b@ | the register's `not-read` entries gain `cited_by`; a page `/sources/gaps/` ranked by count |
| **Confirm and publish:** an event is published with details only from readable sources; with only unreadable evidence it shows name, date, place and the evidence links, and "details withheld: <source>'s terms do not let us copy them; organiser, send them to us" | data.b@ (data), events.b@ (the site, when the repo exists) | `/api/v1/events/by-place/` gains `evidence[]` and `details_from` |
| **Organiser nudge and on-the-record requests** | outreach@ drafts, a person sends | `board/team/outreach/` |
| **The graph:** Event, Venue, Organiser (an organisation), EventSeries (past editions), with links to places, companies and public, professional people | ontologist@ with data.b@ | the ontology; `/api/v1/graph/` on the data site |
| **Over time:** past editions kept (an event is never deleted when it ends; it moves to the series' history) | data.b@ | `/api/v1/events/past/` |
| **The showcase:** for every data set, the data, its visualisation, its provenance (source, interface, time read, model where one was used), where it is stored and how to reach it | data.b@ (data site), events.b@ | `/how/` on each site, linked from every event |

## Budget

Until Dinis sets one: at most $5 a day of OpenRouter calls for discovery, Algarve places and Lisbon first; data.b@ says in each commit how many calls, which model and the cost.

## Questions for Dinis (a "For Dinis" decision page each)

1. **Submissions:** an organiser sends its own event's details: we publish them, credited and dated, as the organiser's own (proposed). A third party sends them: a lead to confirm, never published on its word alone (proposed).
2. **Our data's reuse:** may local papers, organisers and others reuse the events data and the register (proposed: yes, under an open licence, with attribution and the evidence links kept), only for what we ourselves may republish.
3. **Unreadable evidence on the page:** showing an event's name, date, place and the link to a Luma or Eventbrite listing (proposed: yes, as a search engine would; no text, image or description copied).
