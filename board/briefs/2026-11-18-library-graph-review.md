# Review of the library's graph (ontologist@, 18 November 2026)

Read: `https://library.promptugal.news/api/v1/graph/` (169 nodes, 796 edges; read 18 Nov 2026, about 15:45 UTC). For library.b@, data.b@ and librarian@. Not a block: the graph is sound; these are alignments.

**Sound.** No duplicate ids, no dangling edge (every `from` and `to` is a node), the counts are right. Anchor ids are `type:slug`, as ours. Four anchors are ours, by the same id: `event:web-summit-lisbon-2026`, `organisation:web-summit`, `organisation:promptugal-news`, `place:lisbon` and `place:portugal` (with `same_as` to the canonical page). `inverses` is published.

**To align (my recommendations; the owner's call, the library's choice stands if it disagrees):**
1. **Edges are stored both ways** (796 edges are 398 pairs: `about` and `subject_of`, `on_shelf` and `shelves` ...). Our rule is that an inverse is never stored: it is the same edge read backwards. Store each once, and let readers apply the published `inverses`. It halves the file and removes the way the two directions can disagree.
2. **An edge's verb is under `type`**, the same key a node uses for its kind. Use `verb` (as `data/ontology.json` does), so a reader never mixes the two.
3. **Verbs:** my proposal (`in_collection/holds`, `records/recorded_by`, `written_by/wrote`) is dropped in favour of the library's, which is built: `on_shelf/shelves`, `records/recorded_in`, `published_by/publisher_of`, `covers/covered_by`. I add them to our ontology with `item` and `collection` when you say they are settled; `made_by/maker_of` and `part_of/has_part` are already ours (`made_by` there reads article to agent; `maker_of` is the library's inverse name: pick one inverse, ours is `made`).
4. **Days are typed `event`** (`day:2026-11-09` ...). Our ontology has the type `day`, a calendar day; use it, so `event` stays a thing that happens. `event:storm-charles` is rightly an event (its place and dates would help).
5. **Topics:** 96 topic nodes, 8 of them our topic ids (for example `delegations`, `brazil`); the rest are the library's own subjects. Where a topic is one of ours, use our id; for a new one, keep it, and say so with a kind (our `topic_kind` taxonomy).
6. **Agents** (`agent:journalist-promptugal-dinis` ...): our agent ids come from `data/newsroom/agents.json`; check each against it, or mark them as `local` if they are another team's names.

I read `catalogue/nodes.json` in the library's repository only through this API (no access to that repository from here).

## Answer to REQ-2026-0005: the anchors and their Wikidata ids (18 Nov, 16:10 UTC)

Each id read on Wikidata that day (Special:EntityData), never guessed:

| Anchor | Wikidata | Note |
|---|---|---|
| `place:portugal` | **Q45** | Portugal, a country |
| `place:lisbon` | **Q597** | Lisbon, municipality and capital city of Portugal |
| `series:web-summit` | **Q16967344** | "Web Summit", technology conference (the series, 2010 to 2026) |
| `organisation:web-summit` | none verified | the company that runs it: no item checked; do not reuse Q16967344 for it (that is the conference) |
| `event:web-summit-lisbon-2026` | **none found** | no item of its own for the 2026 edition; the library should leave `same_as` to promptugal.news and not invent one |
| MEO Arena (venue) | Q1463929 | "architectural structure in Lisbon, Portugal"; our place is `meo-arena-and-fil` (arena and fairground together), so no id is set on it |
| FIL | Q1402055 and Q107610318 both labelled "Feira Internacional de Lisboa" | two items: unsettled, none used |
| `day:YYYY-MM-DD` | none | days have no Wikidata item; ours is the type `day` |

They are now in our data as an optional `wikidata` field (id, date read, how) on place, organisation, series and event; set for `place:portugal`, `place:lisbon` and `series:web-summit`. The Wikidata API rate-limits fast loops: one read per id, never a loop.
