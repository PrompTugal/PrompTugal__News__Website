# data/: every fact as JSON, a folder per entity

Prose (articles, the brief, about) is markdown in `content/`. Everything that is data is here, as JSON, one folder per
entity, every kind of file with a JSON Schema in `schemas/`. The build (`newsroom/build/`) makes the pages, the JSON API
(`/api/v1/`) and the graphs from it. Public facts only, each with its source URL and the date read; nothing about a
person beyond what the summit lists (name, role, organisation); no contact details, ever; the team's own notes
(decision, priority, owner, why it matters) are never here.

## The layout

```
data/
  ontology.json            the grammar: 13 types in 4 worlds, 20 verbs each with a distinct inverse, the forbidden
                           verbs, the taxonomies (event organisers and kinds, place kinds, topic kinds)       HAND
  schemas/                 one JSON Schema per file kind (24); the gate validates every file here against its own HAND
  site/site.json           the shell's words (masthead, dateline, who made it)                                HAND
  site/nav.json            the navigation, the footer, the llms.txt groups                                    HAND
  companies/<id>/          the 120 companies: the 109 the team follows, and 11 of the Brazilian delegation      HAND
                           from the public team CRM (6 November, re-checked; `from` names the CRM record)
    company.json           identity: name, website, what, category, country, attending, attending_as; for each
                           field the sources that support it; aliases (the names the summit's pages use for it)
    sources.json           every source: url, read_on, read_by, what it supports, its kind (optional
                           vault_capture and sha256 when a capture exists)
    facts.json             one dated claim per source note (more may be added by hand)
    edges.json             typed links: filed_under a topic, based_in a country, appears_in / hosts a session
                           (by its URL, resolved to the event by the build)
    recheck.json           PrompTugal.news's re-check log (appended, never rewritten)
    flows.json             (when mapped) its flows: how work moves through its product, step by step, who acts,
                           and where an AI agent acts, each flow and step citing sources.json; only what a source
                           says (schema company-flows; the company page renders it, or says it is not mapped yet)
  places/<slug>/place.json the 77 places: countries, regions, cities, districts, venues, buildings, stages, rooms,
                           each located_in another, with the exact "where" strings that map to it            HAND
  topics/<slug>/topic.json the 17 topics: 8 fields (the company categories), 3 themes, 6 beats; broader topics;
                           the summit tracks bridged to each                                                  HAND
  curation/                hand decisions the derivation applies                                              HAND
    organisations.json     same_as (a name as listed is one of our companies, and why), not_same (a near miss
                           looked at and refused), markers (listing placeholders such as "Freelance")
    events.json            which umbrella event an item is part_of (the summit, Portugal Tech Week); kinds
    speakers.json          listings the comma rule splits wrongly
  events/<slug>/event.json the 211 events: every agenda item (organiser web-summit: the official programme; or
                           other: side events, Portugal Tech Week, conferences elsewhere in Portugal), with kind,
                           date, time, where and its place, track, part_of, organised_by, speakers (each linked to
                           a person and an organisation), hosted_by, our_pick, source_url, read_at         DERIVED
                           (+ web-summit-lisbon-2026, the summit itself, and its 16 past editions,
                           web-summit-dublin-2010 to web-summit-lisbon-2025: dates and venue from Wikipedia's
                           timeline at a pinned revision, 2025 from AICEP with the organiser's figures; listed
                           under "Past editions" on /events/)                                                 HAND
  people/<slug>/person.json the 248 people the summit's pages list: name, role, organisation (as listed and as a
                           link), and every listing with its source and when it was read                    DERIVED
  organisations/<slug>/    the 188 organisations named by a source that are not our companies               DERIVED
    organisation.json      (+ web-summit, the organiser)                                                      HAND
  evidence/<id>/capture.json  the curator's 26 captures: source, beat, the names it carries                 DERIVED
  stories/<id>/story.json  every story and its column on the board (board/the-story-pipeline.md): idea, drafting,
                           draft, fact-check, review, waits-on-dinis, ready, published, held, read from its files
                           (the curator's candidates, desks/<desk>/ideas|drafts|checks|reviews/, content/articles/
                           and their .sig), with assignee, needs, held, the draft, check, reviews, article, the next
                           step and the history of moves (dated by each file); the angle stays in the desk's file DERIVED
  stories/<id>/ (a story project's data folder, board/the-story-projects.md; HAND, beside the derived story.json):
    sources/<source>.json  one per source, fetched once: url, title, publisher, published, read_on, read_by, kind,
                           access (public only), what it says, the entities it names, the links that matter
    entities.json          who and what the story is about: a graph entity (<type>:<id>) or local:<slug> for one
                           not in the graph yet, each with the sources that name it
    claims.json            every claim, marked fact, estimate or opinion, with its source (and its words)
    graph.json             edges between the entities: an ontology verb (types checked) or one declared in the file
    timeline.json          what happened when, with its source
    blocks.json            the article as linkable blocks, each with the claims it carries
                           The gate: each file against its story-* schema; every citation resolves in the folder,
                           every edge's ends are in entities.json, every <type>:<id> exists
  wikipedia/<slug>/        a Wikipedia article read as data at one revision (newsroom/tools/wikipedia.mjs; never hand-
                           edited, re-run the tool): article.json, statements.json (classed by wording: record,
                           stated, attributed, quote, hedged), references.json, tables.json, links.json; CC BY-SA 4.0,
                           the revision id is the attribution; no editor's name kept. meets.json (HAND, ontologist):
                           where it meets our graph and the findings for a person to take to its talk page
  concepts.json            Dinis's named concepts (88, from the ideas ledger of 6 November 2026): each with his
                           definition and where he said it, a kind (publication, process, role, measure,
                           principle, control, data, design) and where the team implements it                 HAND
  matching.json            the derivation's report: names matched to a company and how, names that are not,
                           near misses, unmatched places, tracks with no topic, company sessions not found  DERIVED
```

## The rules

1. **HAND files are the sources of truth.** Edit them; the gate checks them against their schemas.
2. **DERIVED files are never edited by hand.** They carry `"derived": {"by", "from"}`. They are written by
   `node newsroom/tools/derive.mjs` from what the desks write (`desks/programme/agenda.json`, `desks/curator/*.json`)
   and from the HAND files above. The desks keep their own formats. Run the tool after a desk's file or a HAND file
   it reads changes; the gate re-derives in memory and fails, naming the file, if a committed derived file is
   missing, stale or no longer derived (`node newsroom/tools/derive.mjs --check` does the same).
3. **Derived files are committed**, not generated at build, so that a desk's change arrives as a diff someone can
   review (brief 4: security reviews every run's diff, and a new person, a changed role or a new organisation shows
   there), and so that other agents can read the entities at stable paths in the repository. Generated output (the
   pages and `/api/`) is never committed.
4. **To correct a derived fact**, correct its source: the desk's file (ask the desk), or add a decision to
   `curation/` with who decided, when and why. To add an entity the desks do not have, write it by hand in the same
   folder without `"derived"`: a hand-written entity always wins over a derived one with the same slug (that is how
   `events/web-summit-lisbon-2026/` and `organisations/web-summit/` exist).
5. **Companies** come from the team's company map, public fields only: `node newsroom/tools/companies.mjs --from
   <the team's data/companies.json> [--recheck]`. A re-run keeps what was added by hand (sources whose id is not
   `sN`, facts whose id is not `f-sN`, edges whose `by` is not the tool, aliases marked `"hand": true`, and every
   re-check). It was run first on 5 November 2026 from this site's earlier `data/companies.json` (the team's
   map of 1 November plus this site's re-check), which it replaces; a run from the team's map itself gives the
   same files.
6. **From the team CRM** (ws-team-crm-public, SG/Send vault pqm9vtul, its read key in the team site's `data/crm.json`):
   a company the team's map does not have, but the CRM's own agent (crm@web-summit.dinis) completed with sources, comes
   in as a hand-written company: the summit's page re-read first (source `r1`), the CRM record's sources kept as `cN`
   with who read them, its "AI and agents" line as a fact that says only what the pitch says, and none of the CRM's
   team notes. The first were the eleven Brazilian startups and ApexBrasil (an organisation), on 6 November 2026.
   The 50 outreach targets (WS-26) were all among the 109 already; the outreach ranking and owners are team notes.
7. **An id is a key, not a name**: ASCII, lowercase, hyphens; the folder's name is the id. Labels stay as the source
   wrote them, accents and all. A reference is `<type>:<id>` (`company:replit`, `place:centre-stage`).
8. **Every node and edge in the graphs names its source**: the URL read and when, or the repository file it was
   derived from. A fact without a source is not published.

## How names are matched (and when they are not)

A person is listed under an organisation as the speaker card writes it ("Name (Role, Organisation)": the
organisation is after the last comma inside the brackets; `curation/speakers.json` corrects the two listings where
the organisation has a comma of its own). That name is linked to one of our companies only when:

- the company's own sources use that name for it (its `aliases`: the summit's appearance page, a session page that
  "names X as the speaker's organisation", an attendee page listing its speaker under X), or
- a person decided it, with the reason, in `curation/organisations.json` (`same_as`).

Two names are the same name when they differ only in case, accents, punctuation, a leading "The", a trailing
bracket or a legal form ("Inc.", "Ltd", "Group", "Holdings"). Everything else becomes an organisation of its own,
named as listed. A near miss (an organisation whose name contains one of our companies' names, word for word) is
listed in `matching.json` for a person to decide, never linked automatically: on 5 November there were three
(Cisco Systems, twice spelled, now `same_as` Cisco; Atlassian Williams F1 Team, `not_same`). A person listed in one
of our companies' own sources (an attendee page the team's curator recorded for that company) is linked to that
company by provenance. People are merged by name; a person listed under two organisations keeps both listings
(none on 5 November). A social handle inside a listing is dropped; the gate refuses one anywhere in a person's data.

## Decisions that differ from the brief, and why

- **Organisations are their own type, not companies with a flag.** The companies are the team's curated list, each
  with a profile, a re-check, sources for every field and the RiskMandate question. The organisations come from a
  name on a speaker card or in a capture: no website, no country, often not a company at all (the European
  Parliament, a university, a newspaper, "Freelance"). Folding them in would turn 188 names into thin company
  profiles and blur what PrompTugal.news has checked. Both types are targets of the same verbs (`listed_under`,
  `hosts`, `names`), so the graph does not care, and a name moves from organisation to company with one decision.
- **Countries are places** (kind `country`), not a separate type: a company is `based_in` a place, and the place
  tree runs from the stage to the country, so a company in Portugal and a session on Centre Stage meet at
  `place:portugal`.
- **Tracks and days are graph nodes without folders.** They are read straight off the events (`track`, `date`); a
  track is the summit's vocabulary, kept verbatim, and is bridged to our topics by `summit_tracks` in a topic's
  file (`maps_to`): two vocabularies, bridged, never merged.
- **Company to event links are kept by URL** in `edges.json` (`to_url`), because event slugs are derived and the
  session URL is the stable key; the build resolves them, and `matching.json` lists the two that resolve to no event
  (their session pages answered 404 to the programme desk on 4 November).
- **Story candidates are data but not pages.** They are the curator's working notes: their titles, beats and the
  captures they rest on are in the graph and the API; their angles stay in the desk's file. Captures keep their
  source, beat and names; the researcher's summaries stay in the research vault.
- **No "related company" edge.** The grammar forbids a symmetric verb; two companies are related by a path (both at
  an event, both filed under a field), and each company page says which.
- **The views are zooms of one graph**, so a company graph is exactly a part of the whole (the gate checks it,
  object for object). The fractal step proper is between worlds: a company opens into the evidence world (its
  facts, `described_by`, and the pages they were read on, `evidenced_by`), and a stage into the summit's
  programme, each with its own verbs, joined by named bridge verbs (marked `"bridge": true` in the ontology).

## The JSON API

Built from this folder at every release, never committed: `/api/v1/index.json` lists everything; see
`/api/index.html` on the site. The graph shape is `{id, title, version, grammar, counts, nodes, edges}`, a node
`{id, type, label, source, ...}`, an edge `{id, from, to, verb, source, read}`; `whole.cytoscape.json` carries the same
graph as Cytoscape elements (`data.family` is the type, `data.kind` the verb), the shape graphs.sgit.ai's viewers load.

## data/newsroom/: the newsroom section's record

`/newsroom/` (the feature `newsroom`) is built from four things here, none of them generated at build:

- `runs/<YYYY-MM-DD>.jsonl`: the runs ledger, one line per commit of this repository (when, agent, what, issues, for,
  the release that carried it, files and lines by area), appended only by `node newsroom/tools/runs.mjs` from the full git
  history; re-running adds only new commits. Schema `newsroom-run`, checked by the feature's own gate check.
- `agents.json`: every agent working on PrompTugal.news (who fired it up, when and how we know, kind, desk, status, where
  its work lands, its key ids on the team's keys page). Hand-kept; schema `newsroom-agents`. An agent that commits must be
  in it, or the gate fails.
- `plan.json`: the plan at a glance, the build order's states, what waits on a person, the run's schedule and the lab's
  ideas. Hand-kept; schema `newsroom-plan`.
- `team-site.json`: the desks' run lines, the newsroom's board issues and the keys' public facts, from the team's site by
  `node newsroom/tools/desks-snapshot.mjs --team <clone>`. Never edited by hand; schema `newsroom-team-site`.

