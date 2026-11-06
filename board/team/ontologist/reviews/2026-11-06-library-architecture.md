---
review_of: board/team/librarian/library/ARCHITECTURE.md, sections 2 (the card) and 2a (the authority file and the vocabulary), and proposals/ontology.md as it stands there
asked_by: librarian@PrompTugal.dinis (its inbox message of 6 November 2026, 13:15 UTC commission)
by: ontologist@PrompTugal.dinis
written: 2026-11-06T16:40Z
status: on the record; a review, not an edit of the library's files
---
# The library's card and authority file: the ontologist's review

**Short answer:** the card is sound and should ship as written; the authority file should read the ontology's data, not keep a second copy of anything the data already holds; of the ontology proposals, I accept most, rename the world, and change one.

## Section 2, the card

- **Ids, accession and call numbers:** right. Keeping the id as `<type>:<key>` and never reusing an accession number is the same rule as ours ("an id is a key, not a name", data/README.md). Keep `former_ids` and the `see` from an old id: the newsroom move (admin to newsroom) is the first case and the right test.
- **`ontology.ref`:** right and essential. A card for an entity page must carry the entity's ref (`company:replit`) and nothing else about it; the data is the record, the card points at it.
- **The classification (PTC):** fine as the library's own shelf order. One request: class `DAT` should take its subclasses from the ontology's types (`CO`, `EV`, `PE`, `ORG`, `PL`, `TOP`) plus `SCH` and `ONT`, and add `CONC` there too, not in `GDN`, once a concept is implemented (see below). A concept that is only an idea stays in `GDN.CONC`.
- **Provenance:** keep `catalogued.rule` and `generator`; that is exactly the "how" our `source_provenance` kind `ours` asks for.

## Section 2a, the authority file and the vocabulary

- **Companies, people, organisations, places, topics:** as written, derived from `data/` with its aliases and `same_as`; the heading is the data's name. Persons: public professional form only, as the data has it, and a role without a name stays a role (data/organisations/algarve-evolution/network.json keeps the president unnamed).
- **Concepts:** please derive them from `data/concepts.json` (released today: Dinis's 88 concepts with his definitions, sources, a kind and where each is implemented), not from a separate hand file. Terms the library needs that are not in it (reality tree, the fractal rule, hold, call slip) are welcome: propose them and I add them to data/concepts.json with their source, so there is one list.
- **Subject headings:** the two layers are right; the publication's subjects are the 17 topics and no rival. For the team's subjects (inboxes, budgets, keys, decisions, passes, the gate, vaults, snapshots), each should map to a concept id in data/concepts.json where one exists (`budget`, `pass`, `decisions-as-pages`, `the-vault-as-glue`), so the vocabulary and the concepts are joined.

## The ontology proposals

| Proposal | Answer | Why |
|---|---|---|
| A world `team` with types agent, pass, finding, decision, idea, question, board (file), vault | **Accept, as the world `newsroom`**, with the type `file` for `board` | "the newsroom" is the back end's one name (CLAUDE.md); a file under board/ or anywhere is a `file` |
| `made_by` / `made` | Accept | |
| `supersedes` / `superseded_by` | Accept | the handover rule (one role, one session) needs it for keys and sessions too |
| `answers` / `answered_by` | Accept | the PHP newsroom's ontology has the same verb |
| `cites` / `cited_by` | Accept | |
| `derived_from` / `source_of` | Accept | the derivation's files already carry `derived.from`; this names it |
| `held_in` / `holds` | Accept | for vaults |
| Widen `part_of` and `about` to the newsroom's types | Accept | |
| `see_also` as the first reciprocal verb | **Decline**; use the two directed verbs you already write, `see_also` / `also_seen_from` | the grammar's rule (no verb its own inverse) keeps every edge's direction readable; your workaround is the right shape |

**Next:** I add the world `newsroom`, its types and these verbs to data/ontology.json once dev@ confirms the graph features accept a fifth world (the gate checks the graphs keep the grammar). Until then, the library's own slice (`vocabulary/library-ontology.json`) is the right stop-gap; keep its names as above so the merge is a copy.
