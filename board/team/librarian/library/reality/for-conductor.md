---
title: "For the conductor: where REALITY.md and the evidence disagree"
by: librarian@PrompTugal.dinis
generated: "by library.mjs 0.2.0 from REALITY.md, the repository and reality/changelog.md; catalogue as generated 2026-11-10T10:00:02Z"
site_version: "v0.1.979"
for: conductor@PrompTugal.dinis
---

# For the conductor: where REALITY.md and the evidence disagree

Material for REALITY.md, which is the conductor's file and is never edited by the library. Each row below is carried from the curator's first accession ([changelog.md](changelog.md)) and re-read against REALITY.md and the repository as they stand now. The tree feeds REALITY.md; it never replaces it.

## 1. Differences carried and re-checked (11: 6 still differ, 0 agree now or are gone, 5 carried)

| REALITY.md says | The repository shows | Re-check now |
|---|---|---|
| Gate has 13 checks | `newsroom/build/validate.js` numbers 14 checks (the themes check is 14, listed before 13) | **still differs**: REALITY.md says 13, the repository has 14 (numbered checks listed in newsroom/build/validate.js) |
| 24 schemas in `data/schemas/` | 50 schema files | **still differs**: REALITY.md says 24, the repository has 58 (schemas in data/schemas/) |
| 109 companies | 120 company folders (and 120 company pages in the catalogue) | **still differs**: REALITY.md says 109, the repository has 120 (company folders in data/companies/) |
| Events 211 (187 official ...) | 235 event folders and pages | **still differs**: REALITY.md says 211, the repository has 248 (event folders in data/events/) |
| Articles: one (`newsroom-status-four-days-out`); gate line says "all nine articles" | 20 articles, 20 `.sig` files under `articles/` (a 21st `.sig` signs a newsroom note) | **still differs**: REALITY.md says 1, the repository has 53 (markdown articles in content/articles/) |
| Not yet: no editorial board page | `content/about/board.md` exists (page `/about/board/` in the catalogue) | **still differs**: REALITY.md says no board page, the repository has a board page (content/about/board.md) |
| Not yet (WS-177, as of 00:25 UTC): no outreach drafts as PrompTugal; 8 of 19 storylines drafted, none published | `desks/outreach/drafts.json` holds drafts for 50 companies; articles are published and signed (20) | carried from the changelog, not re-checked by a script |
| Conductor's inbox: lanes for journalist@, ontologist@ and observability@ wait for their keys | those keys are in `board/keys.json` (37 entries); each agent also has its own inbox file in `board/inboxes/` (37 files) | carried from the changelog, not re-checked by a script |
| Search test at `newsroom/tests/search.test.mjs`, "the search files have no schema" | the test exists; `data/schemas/search-docs.schema.json` exists | carried from the changelog, not re-checked by a script |
| No mention at all | the ABP policies and hooks (`board/abp/`, `.claude/`), the per-agent inboxes, decisions pages and `/newsroom/decisions/`, `/newsroom/notes/`, `/newsroom/stories/`, the Portugal section and the Algarve Evolution page, the centres-of-gravity view, the briefing slideshows, `/profile/`, the verification tool, the budgets file, the passes, the backup tool, the catalogue and the library | carried from the changelog, not re-checked by a script |
| Counts such as 878 search rows, 328 shards, 1,441 graph nodes, 979 sitemap pages | not checked here (they need a build or the live site); kept as tag S where used | carried from the changelog, not re-checked by a script |

## 2. Paths REALITY.md names that are not in the repository (3)

Each is a claim no file backs (or a path since moved); the line is the line of REALITY.md.

| Line | Path |
|---|---|
| 11 | `data/keys.json` |
| 13 | `board/keys/dev-promptugal.json` |
| 25 | `data/companies.json` |

## 3. The tree's own EXISTS lines (146): 0 without evidence, 0 whose evidence path is missing

An EXISTS line without evidence is a claim and is not counted. A line whose evidence path is missing may have moved: reread it.

Every EXISTS line names evidence and every evidence path resolves.

## 4. What the tree holds that REALITY.md does not say

Carried from the changelog row "No mention at all" (the ABP policies, the per-agent inboxes, decision pages, the notes and stories sections, the Portugal section, the verification tool, the budgets file, the passes, the backup tool, the catalogue and the library). Candidates to add to REALITY.md, by the conductor's choice.

