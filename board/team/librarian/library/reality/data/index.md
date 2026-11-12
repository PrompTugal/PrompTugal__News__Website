# Data: the knowledge graph, schemas, evidence and verification: EXISTS

**Domain:** `data/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

The entity folders, the ontology, the schemas, derivation, curation, story data folders, evidence, Wikipedia material, the JSON API, and the verification tool.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Data layout and rules (`data/README.md`). Evidence: `data/README.md`; first added `a2e0ff08` on 2026-11-05.
- [F] Ontology: 9 top-level parts (worlds, types, verbs with inverses, forbidden, taxonomies). Evidence: `data/ontology.json`; first added `e29205c7` on 2026-11-05.
- [F] 50 JSON schemas (REALITY.md says 24). Evidence: `data/schemas/common.schema.json`, `data/schemas/story.schema.json`, `data/schemas/company.schema.json`; first added `e29205c7` on 2026-11-05.
- [F] 120 company folders made by tool from the team's data; public fields only; re-check per company. Evidence: `newsroom/tools/companies.mjs`, `data/companies`; first added `d5dcff89` on 2026-11-06.
- [F] Entity folders: events 235, people 264, organisations 223, places 80, topics 17. Evidence: `data/events`, `data/people`, `data/organisations`, `data/places`, `data/topics`; first added `e29205c7` on 2026-11-05.
- [F] Derivation from desks to data (release.sh runs it; gate fails if stale). Evidence: `newsroom/tools/derive.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Curation files (events, organisations, speakers) and matching. Evidence: `data/curation/events.json`, `data/matching.json`; first added `e29205c7` on 2026-11-05.
- [F] Story data folders (blocks, sources, entities, claims, timeline) for AI1 to AI5, BR1, BR2 and others. Evidence: `data/stories`, `data/schemas/story-claims.schema.json`; first added `e29205c7` on 2026-11-05.
- [F] Evidence folders (33 captures, dated sources). Evidence: `data/evidence`, `data/schemas/evidence.schema.json`; first added `e29205c7` on 2026-11-05.
- [F] Wikipedia material tool and schemas (articles, links, references, statements, tables). Evidence: `newsroom/tools/wikipedia.mjs`, `data/wikipedia`; first added `ae93221b` on 2026-11-06.
- [F] The JSON API `/api/v1/` built at every release, never committed: index, a file per entity, graphs, ontology, search docs, manifest with SHA-256. Evidence: `newsroom/build/features/api.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Verification tool v0.1: three models re-check each claim of an article; first record of 10 claims. Evidence: `newsroom/tools/verify/verify.mjs`, `board/team/dev.verify/records/europe-in-pavilion-4`; first added `666dcaa3` on 2026-11-06.
- [S] Past events: Web Summit's 16 earlier editions listed on `/events/` (S: ontologist@ status). Evidence: `board/team/ontologist/status.json`; first added `59aea535` on 2026-11-06.
- [F] Company flows (outreach landing material) as data per company. Evidence: `data/schemas/company-flows.schema.json`; first added `eaf30ca2` on 2026-11-06.

<!-- library:generated -->
## The library's cards in this domain (generated)

0 cards (0 current, 0 superseded, 0 withdrawn), from the catalogue generated 2026-11-12T00:58:33Z at site v0.1.1328; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

No cards fall in this domain yet.
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
