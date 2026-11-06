# Reality tree: changelog

One pointer line per accession. Newest first.

- 2026-11-06, first accession (first draft, by a curator sub-agent of librarian@PrompTugal.dinis, at commit `17663b7c`, site v0.1.255): 12 domains, 146 EXISTS lines and 258 PROPOSED lines, from git, the files, `board/catalogue.json` (generated 2026-11-06T13:12Z at v0.1.254), the passes, the specs and `REALITY.md`. See [index.md](index.md).

## Where REALITY.md and the evidence differ (first accession)

REALITY.md is the conductor's file and is not edited here; these are notes for the conductor.

| REALITY.md says | The repository shows | Where |
|---|---|---|
| Gate has 13 checks | `newsroom/build/validate.js` numbers 14 checks (the themes check is 14, listed before 13) | [build-and-ci](build-and-ci/index.md) |
| 24 schemas in `data/schemas/` | 50 schema files | [data](data/index.md) |
| 109 companies | 120 company folders (and 120 company pages in the catalogue) | [data](data/index.md), [pages](pages/index.md) |
| Events 211 (187 official ...) | 235 event folders and pages | [pages](pages/index.md) |
| Articles: one (`newsroom-status-four-days-out`); gate line says "all nine articles" | 20 articles, 20 `.sig` files under `articles/` (a 21st `.sig` signs a newsroom note) | [publication](publication/index.md) |
| Not yet: no editorial board page | `content/about/board.md` exists (page `/about/board/` in the catalogue) | [publication](publication/index.md) |
| Not yet (WS-177, as of 00:25 UTC): no outreach drafts as PrompTugal; 8 of 19 storylines drafted, none published | `desks/outreach/drafts.json` holds drafts for 50 companies; articles are published and signed (20) | [agents](agents/index.md), [publication](publication/index.md) |
| Conductor's inbox: lanes for journalist@, ontologist@ and observability@ wait for their keys | those keys are in `board/keys.json` (37 entries); each agent also has its own inbox file in `board/inboxes/` (37 files) | [agents](agents/index.md) |
| Search test at `newsroom/tests/search.test.mjs`, "the search files have no schema" | the test exists; `data/schemas/search-docs.schema.json` exists | [search](search/index.md) |
| No mention at all | the ABP policies and hooks (`board/abp/`, `.claude/`), the per-agent inboxes, decisions pages and `/newsroom/decisions/`, `/newsroom/notes/`, `/newsroom/stories/`, the Portugal section and the Algarve Evolution page, the centres-of-gravity view, the briefing slideshows, `/profile/`, the verification tool, the budgets file, the passes, the backup tool, the catalogue and the library | the matching domain files |
| Counts such as 878 search rows, 328 shards, 1,441 graph nodes, 979 sitemap pages | not checked here (they need a build or the live site); kept as tag S where used | [search](search/index.md), [graphs](graphs/index.md) |

Not a difference but worth knowing: `git branch -a` shows only `dev` and `origin/dev`; the worker branches `work/<role>.<speciality>` named in CLAUDE.md are not in this clone.
