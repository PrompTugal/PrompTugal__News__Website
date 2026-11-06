---
title: "The architecture of the library of PrompTugal.news"
by: librarian@PrompTugal.dinis (written by its architect sub-agent, 6 November 2026)
commission: board/team/librarian/library/COMMISSION.md (Dinis Cruz, 6 November 2026, about 13:15 UTC)
status: design, proposed; nothing here exists until REALITY.md says so
reads: CLAUDE.md, board/abp/librarian.md, ROLE.md, catalogue.mjs, data/ontology.json, newsroom/build/features/graph.mjs, assets/graph/, search.mjs, the SG/Send librarian (read only)
---
# The architecture of the library

A library is a catalogue, an authority file, a classification and a desk, kept by one person for many readers. This
design takes the centuries-old parts and fits them to a repository of about 2,700 holdings, 26 agents and one
night's guidance from Dinis. Three rules govern everything below.

1. **The library describes, links and flags. It never moves, rewrites or deletes another agent's file** (grant, "Never").
2. **Every card says who made the thing, when, and from what evidence.** A card without provenance is not catalogued.
3. **Beyond the SG/Send librarian**: it kept an index of what exists (EXISTS and PROPOSED per domain). This library
   adds the card with typed connections, the authority file, accession, a desk that answers on the record, and a
   graph the existing engines draw. Its reality tree keeps the same two states per domain and keeps the fractal rule.

What already exists and is kept: `board/team/librarian/catalogue.mjs` (reads the build, git and the board; writes
`board/catalogue.json|md`, `jump.json`, `waits-on-dinis.md|json`). The first build round turns its gathering code into
a module and leaves its three outputs working, so `jump.json` (for dev.search@) never breaks.

## 1. Collections and holdings

A **holding** is one thing the library has: it has a place (path or URL), a maker, a date and a reason to be kept. A
**collection** is a set of holdings of one kind or one origin, with a finding aid. Holdings are catalogued by
reading them (the page's twin, a file's front matter and first lines), never by name alone.

| Holding type | What it is | Where it lives | Catalogued from |
|---|---|---|---|
| `page` | a page of the site (site, article, company, event, person, organisation, place, topic, list, newsroom, decision) | the build's output, `.generated.txt` | each page's markdown twin |
| `board` | a file of the board: plans, briefs, specs, guidance, tools, runs, abp, inboxes (the box, never its contents) | `board/**` | front matter, first lines, git |
| `desk` | a desk and its files | `desks/<desk>/` | the desk's README, file list |
| `pass` | a focused round of work | `board/passes/*.md` | the pass file's table of steps |
| `finding` | one finding in a pass | inside a pass file | the pass file, numbered rows |
| `decision` | a decision page (PT or For Dinis) | `content/newsroom/decisions/` | front matter, options, state |
| `idea` | one idea of Dinis's night memos, in his words | `board/guidance/` ledger | the ideas ledger |
| `question` | an open question (Dinis's, the team's) or a **call slip** of the desk | ledger, `desk/slips/` | ledger, slips |
| `concept` | a named notion (RiskMandate, the fractal rule, a pass) | ledger, ROLE and brief files | authority file |
| `agent` | one agent: role, key id, lands, status | `board/keys.json`, `data/newsroom/agents.json`, `board/team/<role>/` | the three files |
| `commit` | a commit, **only when a card cites it as evidence** (landmarks: handovers, pass opening and closing, decisions) | git | git log, short hash |
| `vault` | a vault, **by name only**, with its purpose and holder; never an id, key or token | named in board files | the file that names it |
| `source` | an external source cited by an article, a decision, a pass or the guidance; sources of company facts stay in `data/` and are linked, not copied | URLs | the citing file, date read |
| `run` | an agent's run report | `board/runs/<role>/` | report front matter |
| `debrief` | a debrief | `board/team/<role>/debriefs/` | front matter |

Not holdings: generated files that duplicate a source (the library's own indexes, `.generated.txt`), anything under
`.credentials/` or `.sg-send/`, any private half. Entity pages (about 1,100) are cards, but in the library graph they
appear as **reference nodes** joined to the main graph's nodes (section 6), not as copies of them.

**Special collections** (own finding aid, shown first, their words never edited):
- **S1 Dinis's guidance**: `board/guidance/`, the night memos, the ideas ledger. Each idea keeps his words verbatim as
  transcribed, with `captured_in`, `owner`, `later`, `trigger`.
- **S2 The founding record**: `BRIEF.md`, `BRIEF-CORRECTIONS.md`, `REALITY.md`, `CLAUDE.md`, the brand guide, the
  commission. Editions are tracked (git), not copied.
- **S3 Decisions**: every decision page, with state and what follows each answer.
- **S4 Errata**: corrections the site made to itself (`BRIEF-CORRECTIONS.md` and later), each linked to what it corrects.

## 2. The card

One **main entry** card per holding, and **added entries** (the other headings under which the card is also found: title,
subject, agent, series). Cards are JSON, one per line, sharded by class.

```json
{
  "id": "pass:2026-11-06-the-newsroom-search",
  "acc": "ACC-20261106-0412",
  "call": "WRK.PASS the-newsroom-search",
  "type": "pass",
  "status": "current",
  "title": "The newsroom search",
  "what": "One sentence from the file's own words, no verdict of the library's.",
  "where": { "path": "board/passes/2026-11-06-the-newsroom-search.md", "url": "https://promptugal.news/board/passes/2026-11-06-the-newsroom-search.md", "twin": null },
  "subjects": ["subj:search", "subj:passes"],
  "added": [ { "kind": "title", "heading": "Newsroom search, the" }, { "kind": "agent", "heading": "auth:agent:dev-search" } ],
  "links": [ { "rel": "made_by", "to": "auth:agent:conductor" }, { "rel": "part_of", "to": "coll:passes" }, { "rel": "cites", "to": "decision:search-engine" } ],
  "provenance": {
    "made": { "by": "conductor@PrompTugal.dinis", "on": "2026-11-06T03:50:00Z", "commit": "a1b2c3d" },
    "changed": { "by": "dev.search@PrompTugal.dinis", "on": "2026-11-06T12:00:00Z", "commit": "d4e5f6a" },
    "evidence": [ { "kind": "file", "ref": "board/passes/2026-11-06-the-newsroom-search.md", "read_on": "2026-11-06" } ],
    "catalogued": { "by": "librarian@PrompTugal.dinis", "at": "2026-11-06T16:00:00Z", "wake": "2026-11-06T16:56", "rule": "class:WRK.PASS", "generator": "library.mjs 0.1.0" }
  },
  "ontology": { "ref": null, "type_proposed": "pass" },
  "special": null,
  "former_ids": []
}
```

**Id.** Stable and human: `<type>:<key>`, as in today's `catalogue.json` (`page:companies/replit/index.html`,
`board:board/WS-177-plan.md`, `finding:<pass>#<n>`, `idea:PB-01`, `agent:<role>-promptugal`). A rename seen in git keeps
the **accession** number, moves the old id to `former_ids` and leaves a `see` from the old id.

**Accession number.** `ACC-<YYYYMMDD>-<seq>`: the day the library first saw the holding and a four-digit sequence in
the day, from the **accession register** (`accession-register.jsonl`, append-only: `{acc, id, call, at, wake, retro,
made_on, commit}`). Never reused, never changed, never regenerated: the generator only appends, and the gate compares
with the committed copy. The first run is a **retrospective accession** of the existing holdings (`retro: true`,
dated the run, `made_on` carrying the real date from git).

**Call number.** Where the card stands on the shelf: `<CLASS>.<SUB> <cutter>`. The **classification** is our own,
**PTC** (the PrompTugal Classification), ten classes with subclasses, in `classification.json` (an ordered list of
path and type rules; the first match wins; `overrides` for hand cases):

| Class | Name | Subclasses (examples) | Takes in |
|---|---|---|---|
| `GEN` | The repository | `README`, `RULES`, `BRIEF`, `REALITY` | root files, CLAUDE.md, BRIEF |
| `PUB` | The publication | `ART` articles, `FRONT`, `SITE`, `LIST`, `NEWS` (newsroom pages), `BRAND` | pages, content/, design/ |
| `DAT` | Data and the ontology | `CO`, `EV`, `PE`, `ORG`, `PL`, `TOP`, `SCH` schemas, `ONT` | data/, entity pages |
| `BLD` | Build, code and release | `FEAT` features, `TOOL`, `GATE`, `CI`, `ASSET` | newsroom/build, newsroom/tools, assets code, .github |
| `TEAM` | Agents, roles, keys | `ROLE`, `KEY`, `ABP`, `INBOX`, `SCHED`, `BUDGET` | board/team, keys, abp, inboxes |
| `WRK` | Work in hand | `PASS`, `FIND`, `DEC`, `STORY`, `DESK`, `PLAN` | passes, findings, decisions, desks, specs |
| `GDN` | Guidance (special) | `MEMO`, `IDEA`, `Q`, `CONC` | board/guidance, ledger |
| `EVD` | Evidence and sources | `SRC`, `VAULT`, `CAP` | external sources, vaults, captures |
| `RDR` | Readers and observability | `OBS`, `SYN` synthetic readers, `SHERPA` | observability, reader findings |
| `LIB` | The library | `CAT`, `AUTH`, `DESK`, `REAL`, `STOCK` | everything under the library |

The **cutter** is the card's slug (the path's last part without its extension, the idea's number). Two holdings with the
same class and cutter get `:2`, `:3` in order of accession. The call number is **derived by rule** and recomputed
each run; a change of rule moves the card and leaves the old call number in `former_calls`. The **shelf list** is the
cards in call-number order: `shelf-list.md`, one table per class.

**Added entries and headings.** Four kinds: `title` (the inverted form in the card's own words), `subject` (controlled
heading), `agent` (authority id), `series` (the pass or collection). The indexes are generated:
`indexes/title.json`, `subject.json`, `agent.json`, `series.json`, each heading mapping to card ids.

**Connections (typed links).** Each has a named inverse. Stored once on the card that asserts it; the inverse is read
backwards, as the ontology does.

| `rel` | inverse | From to | Use | Ontology |
|---|---|---|---|---|
| `see_also` | `see_also` (reciprocal) | card to card | related holding worth reading with this one | **proposal** (ontology bans a verb that is its own inverse; the feed writes two directed edges, `see_also` and `also_seen_from`) |
| `part_of` | `includes` | card to card or collection | a finding in a pass, a file in a desk, a page in a section | exists (`part_of`/`includes`, events only: proposal to widen) |
| `made_by` | `made` | card to authority (agent) | maker, from git trailers and `made.by` | **proposal** |
| `supersedes` | `superseded_by` | card to card | a later holding replaces an earlier one | **proposal** |
| `answers` | `answered_by` | question, call slip or finding to decision or card | the decision that closes a question, the card that answers a slip | **proposal** |
| `cites` | `cited_by` | card to card or source | a file names another by path, id, hash or URL | **proposal** |
| `about` | `subject_of` | card to subject heading or ontology node | what it is about | exists (`about`/`subject_of`) |
| `evidenced_by` | `evidences` | card to source or commit | the proof a statement rests on | exists |
| `derived_from` | `source_of` | generated card to its source | a generated file and the file it came from | **proposal** |
| `held_in` | `holds` | card to vault | where a holding's full text or image lives (vault by name) | **proposal** |

A **"see" reference** is not a link between cards. It lives in the authority file and the vocabulary: a variant form
or a former id points to the authorised one ("`dev.search@` see `dev.search@PrompTugal.dinis`"; "`admin` see
`newsroom`", the move of 6 November). A reader who searches a variant lands on the authorised card.

**Mapping to the ontology** (`data/ontology.json`, 13 types, 20 verbs). Cards for entity pages carry
`ontology.ref` (`company:replit`), so the library never invents a second identity for a company. Cards for the
newsroom's own work have no type in the ontology today. **Proposals for ontologist@ only** (in
`proposals/ontology.md`, a proposal is not an edit): a world `team` ("The newsroom's work") with types `agent`, `pass`,
`finding`, `decision`, `idea`, `question`, `board` (file), `vault`; the verbs in the table marked proposal; widening
`part_of` and `about` to those types; `see_also` as the first reciprocal verb, or rejection. Until answered, the
library ships its own slice (`vocabulary/library-ontology.json`, same shape as `ontology.json`) so the explorer works.

**Provenance, in the card's own words.** `made` comes from git's first commit of the path (agent from the `Agent:`
trailer, else the subject prefix), as `catalogue.mjs` does today; `changed` the last; `evidence` the files, pages,
commits or sources that justify the card's `what` and links; `catalogued` the library's own act (who, when, which
wake, which rule, which generator version). A held-back item (not yet read) is not catalogued.

## 2a. The authority file and the vocabulary

**Authority file** (`authority/<kind>.json`): one **authority record** per agent, person, company, organisation, place,
topic and concept, one authorised heading each.

```json
{ "id": "auth:agent:dev-search", "kind": "agent", "heading": "dev.search@PrompTugal.dinis",
  "forms": ["dev.search@", "dev.search-promptugal", "work/dev.search", "search developer"],
  "see_from": ["dev.search@"], "see_also": ["auth:agent:dev"], "ontology": null,
  "key_id": "dev.search-promptugal", "role_file": "board/team/dev.search/ROLE.md",
  "established": { "by": "librarian@PrompTugal.dinis", "on": "2026-11-06", "from": ["board/keys.json", "CLAUDE.md#table"] },
  "note": "Sonnet worker; dev@ reviews its branch work/dev.search." }
```

Sources of authority (the library derives, never edits): **agents** from `board/keys.json`, `data/newsroom/agents.json`,
the CLAUDE.md table and each ROLE.md; **company, person, organisation, place, topic** read from `data/` (ontologist@'s),
using the data's own `aliases`, `same_as` and tracks as the forms of name; the heading is the data's name. **Persons**:
public professional form only, as the data has it; no contact, no photo, nothing the site does not already show.
**Concepts** are the library's own, hand file `authority/concepts.json` (RiskMandate, reality tree, the fractal rule,
hold, pass, call slip), reviewed by ontologist@. A name found in a card and in no authority record is a stocktake
finding ("heading not authorised"), not a silent new record.

**Subject headings** (`vocabulary/subjects.json`): a controlled vocabulary of about 80 headings, each with `id`, the
authorised `heading`, `use_for` (UF: variants), `broader` (BT), `narrower` (NT), `related` (RT), a scope note and
`ontology` (the `topic:` id it equals, where one exists). Two layers: the **publication's subjects** are the 17 topics
of `data/topics/` as they stand (the library adds no rival taxonomy there); the **team's subjects** (agent inboxes,
budgets, keys, decisions as pages, the passes, the gate, vaults, snapshots) are the library's, proposed to
ontologist@ for review. Free-text words in a card's `what` are matched to `use_for`; an unmatched frequent word goes
to `vocabulary/candidates.md` for a human decision, never added automatically. At most four subjects per card.

## 3. The reality tree ("the holdings by subject")

Same idea as the SG/Send tree, built for this site: one directory per domain, each with what **EXISTS** (with
evidence) and what is **PROPOSED**, and the fractal rule. It lives at `reality/` under the library folder.

```
reality/index.md                  master: domain table, counts, last checked, link to the changelog
reality/domains.json              the domains (id, name, takes in, owner agent, extendable by adding an entry)
reality/<domain>/index.md         EXISTS: one line per thing, each with its evidence
reality/<domain>/proposed/index.md  PROPOSED: what is asked, by whom, where, its state
reality/changelog.md              one pointer line per change (what, domain, evidence)
reality/for-conductor.md          the differences with REALITY.md, for the conductor's inbox (section below)
```

**Domains for this site**, extendable (`domains.json`, an unknown path falls into `misc` and is flagged):
`publication` (pages, articles, the front page, the summit's days), `data` (data/, schemas, derivation),
`graph` (explorer, minigraph, gravity, world map), `search`, `build-gate-ci` (build, gate, release, CI, versions),
`identity` (keys, person keys, sign-in, signatures), `inboxes` (conductor's inbox, agent inboxes, drains),
`team` (agents, roles, schedule, budgets), `abp` (policies, hooks, run reports), `passes-decisions` (passes,
findings, decisions pages), `newsroom-section` (/newsroom/ and its sub-sections), `brand-design`, `vaults-media`
(vault names, images, snapshots), `observability`, `desks-stories` (desks, story pipeline, projects), `summit`
(what the summit and Portugal's ecosystem facts are, as the site holds them), `library` (this).

**An entry** is one line, machine-checkable:

```
- EX-search-003 | The search index is sharded, 328 term shards, and is built at every release | evidence: newsroom/build/features/search.mjs@a1b2c3d; page /search/ | checked 2026-11-06 | by librarian@ | card: board:...
- PR-search-001 | Answers from an LLM on the search page | proposed by dev.search@ (board/passes/2026-11-06-the-newsroom-search.md#4) | state: in progress | since 2026-11-06
```

Rules: an EXISTS line without evidence is **a claim**, listed under "unevidenced" and not counted. Evidence is a path
with a short commit, a live URL read on a date, a gate check name, or a card id. A PROPOSED line names who proposed it
and where. When something ships its line moves from PROPOSED to EXISTS and the changelog says so; when it goes
(superseded), the line stays with `status: superseded` and a `see` to its successor (weeding, never deleting).

**Fractal rule.** A domain file over about 300 lines is split before the next addition: the index keeps a one-line
summary and links to sub-files by sub-topic (`reality/graph/explorer.md`, `reality/graph/minigraph.md`). The stocktake
counts lines and flags 250 as a warning, 300 as a fault; the `reality-split` helper splits mechanically at H2 headings
and the librarian reviews the result. The master index stays under 120 lines.

**Generated and hand parts.** Counts, the lists of pages by section, agents by status, passes by state are generated
between markers (`<!-- gen:begin id -->` and `<!-- gen:end -->`) from the cards, so they cannot drift. The EXISTS lines
for features, tools and processes are hand-curated from commits, ROLE files and REALITY.md by the librarian (or its
reviewer sub-agent), always with evidence; the generator checks that every evidence path resolves and every commit
exists, and flags a line whose evidence file changed after its `checked` date ("stale: reread").

**Relation to REALITY.md.** REALITY.md is the conductor's statement and the project's rule ("a thing not in it does not
exist"). The tree **feeds it and never replaces it**: each wake the library compares the two and writes
`reality/for-conductor.md` with (a) tree EXISTS entries that REALITY.md does not state ("candidates to add"), (b)
REALITY.md claims no evidence backs ("unevidenced"), (c) claims whose evidence has changed. It goes to the conductor's
lane by inbox, as material. The library never edits REALITY.md (not in its grant, and the conductor's).

## 4. The reference desk

Two kinds of visitors, one rule: **every question is a call slip, and every answer is on the record.**

**Agents.** They ask through the librarian's inbox (`board/inboxes/librarian.json`, an append lane sealed to the
librarian's key, signed by the asker; opened and drained with sgit at each wake). Message format (a convention, not a
schema, because a message is material): first line `QUESTION`, then the question, then optionally `RE:` (a path or
card), `NEEDED BY:`. A message that is an instruction (do this, change that) is **not a question**: logged as
`declined: not a reference question`, answered with who to ask. Two more lanes, flagged as proposals: an `asks_librarian`
list in a role's `status.json` (read at every wake with the waits list; works when an inbox cannot be drained, as the
bug file of 6 November records), and a question in a commit message trailer `Ask: librarian: ...`.

**The call slip** (`desk/slips/<yyyy>/<mm>/QS-<yyyymmdd>-<seq>.json`), the register's one row:

```json
{ "id": "QS-20261106-0003", "state": "answered",
  "asked_by": "journalist@PrompTugal.dinis", "asked_via": "inbox", "asked_at": "2026-11-06T15:02:11Z",
  "question": "Where is the decision on the front page's top?", "re": null,
  "answer": "desk/answers/QS-20261106-0003.md", "answered_at": "2026-11-06T16:58:40Z", "answered_in_wakes": 1,
  "cards_cited": ["decision:the-top-of-the-page", "board:board/spec-the-top-of-the-page.md"],
  "sent_back": { "to": "journalist@PrompTugal.dinis", "via": "inbox", "at": "2026-11-06T17:00:02Z" },
  "also": { "wants": false, "referred_to": null } }
```

States: `received`, `answering`, `answered`, `referred` (a question for an owner, with the owner named and the
answer sent when it comes), `not-held` (the library has nothing: the slip itself is the finding, and the question goes
to `desk/wants.md`, the **wants list** of things the library should acquire, with the owner who could supply it),
`declined`. The register is `desk/register.jsonl` (append and update by id, generated into `desk/index.md`, newest
first, with a page per month). Answers are markdown: the answer first, then "On the record" (cards cited with call
numbers, links and the date read), then "What the library does not know". Every cited card must exist (the gate checks).
The answer is **published in the repository** and **sent back sealed** with
`python3 -I board/tools/agent_inboxes.py send . --from librarian --to <role> --text '...'` (signed by the librarian's
key). The slip is committed in the same wake.

**Turnaround.** Within one wake (three hours) is the standard; two wakes is late and the stocktake flags it; an
unanswered slip older than one day is raised to the conductor. A question that matters now may be marked `NEEDED BY`;
the librarian cannot wake itself (R4), so it says in its answer when the next wake is.

**Privacy.** An agent's question is public: agents are not private persons and the board is public. The only
redactions are the standing ones: a key, token, vault key or contact detail in a question or answer is replaced by
`[removed: R8]` and the slip says so; security@ may ask for more. **Readers' questions** never carry anything that
identifies the reader: no name, no address, no IP, no cookie, no exact time (day at most), no account. Design, in
order of what is possible without a new feature: (1) the reading room has a "common questions" page built from
agents' answered slips that are general; (2) the site's search already answers locally in the reader's browser and
the library stores nothing; (3) **proposal** for Dinis and observability@: a reader may *choose* to send a question
to the desk through a write-only public lane (as the conductor's inbox has one), stored as text only, stripped of
metadata, published as a slip with `asked_by: "a reader"` after security@'s pre-filter, and counted by topic only
when five or more are alike. No reader's question is ever published with its time to the minute or anything of the
sender; a reader question that names a person is declined.

## 5. The pipeline

**The librarian's wake** (every three hours at :56 UTC; each step writes its own file, so a failed step leaves the rest
whole):

1. Pull `dev`; read CLAUDE.md, `board/guidance/`, the plan and the newsroom move; stop on `board/HOLD.md`.
2. Build, then `git fetch --unshallow` once if the clone is shallow.
3. **Drain the desk**: open the inbox, write a slip per message, check each signature against `board/keys.json`.
4. **Accession**: `library.mjs accession` finds holdings with no card, appends to the register (new) or notes
   renames and withdrawals (changed).
5. **Catalogue**: cards, authority, vocabulary matches, links, indexes, shelf list.
6. **Answer the desk**: the slips of step 3 and any waiting, from the cards (sub-agent drafts, the librarian signs off).
7. **Reality tree**: refresh generated blocks, check evidence, write `for-conductor.md`.
8. **Stocktake** (below) and the weeding report; **waits on Dinis** (existing generator).
9. **Graphs** (section 6) and finding aids.
10. **Publish**: the library gate (`library.mjs check`), the repository gate, then
    `AGENT=librarian@PrompTugal.dinis newsroom/tools/release.sh`; the run report (`abp.mjs run-report`) in `board/runs/librarian/`;
    `status.json` rewritten; a commit saying what was done and what blocks.

**The sub-agent loop inside the librarian's area** (Dinis: "do the loop we're doing with the other devs, all in your
area"; R4 says sub-agents only where the grant says so, so the grant must name them, see open questions):

| Sub-agent | Model | Does | Output |
|---|---|---|---|
| architect | Sonnet | this design; reruns when a round ends or the ontology changes | ARCHITECTURE.md, proposals/ |
| dev | Sonnet | builds a round from this plan; tests first | `build/`, `tests/` |
| information designer | Sonnet | the reading room, card layout, finding-aid templates, graph presets, labels | `design/` notes, templates, `graph/presets.json` |
| cataloguer | Haiku | drafts `what`, subjects and see-also for new cards from their text; marks `draft` | proposed card fields |
| reviewer | Sonnet | a different mind: checks a round against the plan, rules and the commission | `reviews/<round>.md` |

The librarian (Opus) accepts what passes its own gate, as dev@ does for the dotted workers; a sub-agent never
commits as the librarian without the librarian's release (R9). Sub-agent work is under the librarian's name and says
so in the commit. A round larger than a wake uses a pass (`board/passes/`) so accountant@ gives it a budget.

**What other agents review** (a request is a sealed message with the files and a short checklist; an answer comes by
inbox; findings are cards, not edits):

| Reviewer | Reviews | Question asked |
|---|---|---|
| ontologist@ | authority file, subject vocabulary, the ontology proposals, mapping of cards to types | does it keep the grammar (named inverses, no related_to, sourced)? |
| dev@ | the generator's code, its gate checks, anything that imports from `newsroom/build/` | does it run without dependencies and break nothing? |
| dev.graphs@ | the graph feed's shape and presets, the reality tree view | does the explorer load it and rank it? |
| designer@ | the reading room, card and finding-aid layouts (once there is a site section) | does it fit the brand and the design system? |
| security@ | what is published: a scan for keys, contacts, private data; the privacy rules of the desk; the vault listing | is there anything here that should not be public? |
| sherpa@ | the reading room and the desk as a reader meets them | can a cold visitor find a thing in 30 seconds and ask a question? |
| conductor@ | `for-conductor.md`, waits-on-dinis, the order of rounds | does it help the plan? |
| abp@ | the grant, sub-agent naming, the new paths | is it inside the mandate or a request? |

**Stocktake** (the health scan, `stocktake/<date>-<wake>.md` and `stocktake/latest.json`; findings have a code, a
severity and an **owner**; the librarian flags, never fixes another's file): `ST01` holding with no card;
`ST02` card whose file is gone (withdrawal, becomes `status: withdrawn`); `ST03` dangling link; `ST04` orphan (no
inbound or outbound link, not in a collection); `ST05` card without provenance or evidence; `ST06` duplicate call
number or id; `ST07` accession gap or edit of the register; `ST08` agent or name not in the authority file;
`ST09` subject heading not in the vocabulary; `ST10` reality file over 250 or 300 lines; `ST11` EXISTS line without
evidence or with stale evidence; `ST12` REALITY.md claim without a tree entry; `ST13` slip unanswered over two
wakes; `ST14` agent named in CLAUDE.md with no row, key or ROLE.md (carried from the existing scan);
`ST15` pass finding with no owner; `ST16` anything matching a key shape or a contact detail in what the library would
publish (uses the gate's own `newsroom/build/secrets.cjs` read only; severity blocker: the file is left out of the
output and security@ is told); `ST17` the waits list items older than a day. The first stocktake is
`health-2026-11-06.md`; this replaces its hand form with a generated one.

**Weeding** is a catalogue status, never a deletion of anything. `status`: `current`; `superseded` (a later holding
replaces it, by a `supersedes` link, a front-matter note, a `v2`/dated successor of the same slug, or the owner's
word); `withdrawn` (gone from the tree, with the commit that removed it; the card stays); `draft`. Superseded and
withdrawn cards stay in the catalogue and the shelf list, shown struck through, hidden from default reading-room
views, `jump.json` and the explorer's default view, and listed in `weeding.md` with the reason and the successor.
The library proposes ("candidates for weeding": stale status files, a page replaced by another); **the owner decides**.

## 6. The graphs: the existing engines, fed

No new engine. The library writes JSON in the **explorer's own format**
(`api/v1/graph/explorer.json`, produced by `explorerData()` in `newsroom/build/features/graph.mjs`, loaded by
`assets/graph/explorer.js` from the `data-data` attribute and drawn by Cytoscape 3.30.2) and prerenders small SVGs the
way `miniGraph` does.

**`graph/library-graph.json`**, the library graph of cards and connections. Shape (copied, field for field):
`{ id, version, about, grammar, counts, worlds[], types[], verbs[], views[], sources[], nodes[], edges[] }`.
- `worlds`: `[{id:"team", label:"The newsroom's work", types:[...]}, {id:"record", label:"The record"}, {id:"reference", label:"Reference to the main graph"}]`.
- `types`: the card classes as node types (`agent`, `pass`, `finding`, `decision`, `idea`, `board`, `desk`, `vault`, `source`, `subject`, `ref`), each `{id,label,world}`; `ref` is a node standing for an ontology node.
- `verbs`: the link table of section 2 as `{verb, inverse, world, bridge, reads, reads_inverse}`; `see_also` is expanded to two directed edges.
- `nodes[i]`: `{ id, type, label, page, src, kind, by, status, category, date, read, deg, bc, pr, x, y }`. `page` is the path served as is (`board/passes/....md`), `kind` is the PTC class, `by` the maker, `category` the first subject heading, `date` the accession day, `status` current or superseded: these are the explorer's **existing facet fields** (`FACET_FIELDS`), so the filters work unchanged.
- `edges[j]`: `[fromIndex, toIndex, verbIndex, sourceIndex, readDate|0, edgeBetweenness]`.
- `deg`, `bc`, `pr`, `x`, `y`: computed by the generator by **importing, read only**, `newsroom/build/features/graph/rank.mjs` and `layout.mjs` (the same functions the build uses). If dev@ moves them the stocktake says so and the generator falls back to degree only and a grid layout.
- Views (`views[]`): `team` (agents, passes, findings, decisions), `guidance` (S1: ideas and memos), `agents` (who made what), `supersession` (chains of `supersedes`), `desk` (slips and the cards they cite), `whole`.
- Size: pages that are entities are not copied: of the ~2,700 cards the graph has about 1,500 nodes (board, pass, finding, decision, idea, agent, desk, vault, subject, source, and `ref` nodes for the entity pages that a card links to), which the explorer's whole-graph map (1,441 nodes at half a second) already handles.

**Joining the main graph.** A `ref` node has `id` equal to the main graph's (`company:replit`, `article:...`) and `page`
to its entity page; an `about` edge from a card to a `ref` is how a finding about a company sits beside the company.
The explorer today loads one file, so the library graph is a separate view until the main graph includes it (Beyond
the grant, with ontologist@ and dev.graphs@); a `ref` node's "Open in the graph" goes to `/graph/?focus=<id>`.

**`graph/reality-tree.json`**, the same shape, a tree: a root `reality`, a node per domain (type `domain`), a node per
entry (type `exists` or `proposed`, `status` set), `part_of` edges entry to domain to root, `evidenced_by` edges
entry to its card or source, `layout` preset `tree` (an explorer layout that already exists). Colour by the
`status` facet; a domain's `deg` shows how much it holds. The librarian can see where the tree is thin.

**Minigraph for finding aids.** For a card, a pass or a collection, `graph/mini/<id>.svg`: the card in the middle,
its connections above and below, built by calling `miniGraph(g, ref, {href, verbs})` from
`newsroom/build/features/graph/minigraph.mjs` with an object that has the whole graph's interface (nodes, edges and
`outOf`). Checking that interface is the first task of round 3; if it does not fit, the information designer draws a
simpler SVG in the same style. `href` points at the card's page in the reading room (or the served file).

**Reading room v0** (inside the grant, no build feature): `reading-room.html`, a hand file in the library folder with
the explorer's markup (copied from `explorerHtml()`), `data-data="graph/library-graph.json"`, loading
`/assets/vendor/cytoscape/cytoscape.min.js`, `/assets/graph/engine.js` and `explorer.js` from the site. It is a plain
page without the site's shell and nav, served as is. Risk: the markup copy drifts when dev@ changes the explorer, so
the stocktake compares ids the script reads (`gx-q`, `gx-cy`, ...) against the file and flags a missing one.

## 7. Files and paths

Everything is under `board/team/librarian/library/`, served as is at
`https://promptugal.news/board/team/librarian/library/`. **HAND** is written by the librarian or a sub-agent and
reviewed; **GEN** is written by the generator and never edited; **APPEND** is history the generator only extends.

```
library/
  ARCHITECTURE.md  COMMISSION.md  README.md         HAND   (README: how to read the library, a 30-second guide)
  classification.json                                HAND   PTC: classes, ordered rules, overrides
  accession-register.jsonl                           APPEND the register
  catalogue/<CLASS>.jsonl                            GEN    cards, one per line, one file per class
  cards.json                                         GEN    all cards, compact (one fetch for the reading room)
  shelf-list.md                                      GEN    cards in call-number order
  indexes/{title,subject,agent,series}.json          GEN    headings to card ids
  authority/{agent,person,company,organisation,place,topic}.json   GEN   from board/ and data/, read only
  authority/concepts.json  authority/forms.json      HAND   concepts, extra forms and "see" references
  vocabulary/subjects.json  vocabulary/links.json    HAND   headings (BT NT RT UF), link types and inverses
  vocabulary/library-ontology.json                   GEN    the slice in ontology.json's shape (from the two above)
  vocabulary/candidates.md                           GEN    frequent unmatched words for a human
  reality/index.md  domains.json  changelog.md  <domain>/index.md  <domain>/proposed/index.md   HAND + GEN blocks
  reality/for-conductor.md                           GEN
  desk/{register.jsonl, index.md, wants.md, slips/, answers/}   register APPEND, slips and answers HAND-by-librarian
  finding-aids/<collection>.md  finding-aids/passes/<pass>.md   GEN container list + HAND scope note
  special/{guidance,founding-record,decisions,errata}.md        GEN with HAND introductions
  stocktake/<date>-<wake>.md  stocktake/latest.json  weeding.md   GEN
  graph/{library-graph.json, reality-tree.json, presets.json, mini/<id>.svg}   GEN (presets HAND)
  proposals/{ontology.md, beyond-the-grant.md}       HAND   proposals, never edits
  reading-room.html                                  HAND   reading room v0 (round 3)
  reviews/<round>.md                                 HAND   by the reviewer sub-agent and other agents
  build/library.mjs  build/lib/*.mjs  tests/*.mjs  tests/fixtures/   HAND   the generator and its tests
```

**The generator**: Node 18, no dependencies, ES modules, one entry point and small modules, a fixture directory for
tests. Commands: `node board/team/librarian/library/build/library.mjs <step>` with steps `accession`, `cards`,
`authority`, `reality`, `desk`, `graph`, `stocktake`, `check`, `all` (the wake's order). It reads the build's output
and git; it writes only under `library/`, `board/catalogue.*`, `board/team/librarian/jump.json` and
`waits-on-dinis.*` (all in the grant). `check` is the library's own gate: ids and call numbers unique, every card
with provenance and evidence, every link resolving, every subject in the vocabulary, the register unchanged but for
appended lines (compared with `git show HEAD:`), no key shape or contact detail in any output, JSON valid, reality
files under 300 lines. It runs before release and exits non-zero on a fault. Idempotent: a second run produces no diff.

**Beyond the grant** (proposed to Dinis and abp@; nothing here is done). The library is served as files today. A
section of the site, `/library/`, would need:

| What | Path | Why | Who |
|---|---|---|---|
| A build feature | `newsroom/build/features/library.mjs` (order about 66, after places) | pages from the library's JSON: the reading room home with search, browse by class, a page per card, per authority record, per subject, the reality tree by domain, the desk register and a page per answer, the stocktake, the graph view | dev@ or dev.pages@, to the library's spec; the librarian does not write `newsroom/build/` |
| Content | `content/library/index.md`, `content/library/about.md` (how to use the library, the call-number scheme, what a card is), `content/library/desk.md` | the words of the section, as the project wants words in `content/`, not in code | librarian@ (needs `content/library/**` in its grant) |
| Assets | `assets/library/library.css`, `library.js` (browse, filter by class and subject, ask-the-desk form) | the reading room's look and behaviour | designer@ and dev.pages@ |
| Navigation and llms | one entry each in `data/site/nav.json` (a "Library" link, or under Newsroom) and the llms groups | the section reachable | dev@ |
| Search | `searchDocs(ctx)` rows for card pages (so the main search finds a card) | one search, not two | dev.search@ |
| The main graph | a world `team` in `data/ontology.json` and `lib/graph.mjs` reading the library's cards, only if ontologist@ accepts the proposals | cards beside companies in the explorer | ontologist@, dev@, dev.graphs@ |
| A reader's question lane | a write-only public append lane as the conductor's inbox has, and its intake page | readers ask the desk (section 4, proposal 3) | Dinis (privacy, the law), security@, observability@, dev@ |
| The sub-agents in the grant | a line in `board/abp/librarian.md` naming architect, dev, information designer, cataloguer, reviewer | R4: "sub-agents only where the grant says so" | Dinis and abp@ |
| A drain tool | a drain for the inboxes without `sgit_ai` (the bug of 6 November) | the desk cannot open its inbox otherwise | dev@ or devops@ |

The gate for that feature: every card page resolves, every `cites` and `see_also` target exists, no card page for a
withdrawn holding is served as current, and the gate's no-contact-details check covers `content/library/`.

## 8. Build plan (for the dev sub-agent, in rounds)

Each round ends with the tests green, `library.mjs check` green, the repository gate OK, a reviewer sub-agent's
note in `reviews/`, and a commit. Fixtures live in `tests/fixtures/` (a small fake repository with a rename, a
deletion, a superseded file, an agent with variant names, a question).

**Round 1: cards, accession, provenance (the foundation).**
- Move `catalogue.mjs`'s gathering (git history, pages, board, desks, passes, findings, ideas, concepts, agents) into
  `build/lib/gather.mjs`; `catalogue.mjs` calls it and still writes its three outputs unchanged.
- `classification.json` and the call-number rule; `cards` step writing `catalogue/<CLASS>.jsonl` and `cards.json`;
  `accession` step with the retrospective run and the register; `authority/agent.json` from keys, agents.json and
  CLAUDE.md; `shelf-list.md`; `check`.
- Checked by: (1) counts per type equal `board/catalogue.json`'s (1,107 pages, 481 board files, 12 desks, 27 passes,
  124 findings, 494 ideas, 26 agents at v0.1.254, or the current numbers); (2) a second run changes nothing; (3) the
  fixture's rename keeps the accession and fills `former_ids`; (4) every card has provenance (`ST05` zero); (5) a
  deleted fixture file becomes `withdrawn`, not gone; (6) `jump.json` is byte-compatible for dev.search@.

**Round 2: links, authority, vocabulary, reality tree, stocktake, weeding.**
- The link extractors: `part_of` (from the folder, pass or desk), `made_by` (git), `cites` (path, id, short hash, URL
  found in text; each verified to resolve), `about` (subject matches), `answers` (a finding with a decision),
  `supersedes` (front matter note, versioned slug, owner's word in `authority/forms.json`), `derived_from`.
- Authority for company, person, organisation, place, topic from `data/` (forms from aliases); `concepts.json`;
  `subjects.json` seeded with the 17 topics and about 60 team headings; the four indexes.
- `reality/` with the domains of section 3, seeded from `REALITY.md` (every line of it split by domain, with evidence
  found or marked `unevidenced`), the generated blocks, the 300-line rule, `for-conductor.md`.
- `stocktake` (ST01 to ST17) and `weeding.md`.
- Checked by: no dangling link (`ST03` zero); every agent name in any card resolves to an authority record or is a
  finding; the fixture's seeded faults (an orphan, a duplicate call number, a stale EXISTS line, a 320-line domain
  file, a key-shaped string) are each caught by the right code; the reality tree has no EXISTS line without evidence;
  `for-conductor.md` names at least the REALITY.md lines the tree cannot back; a reviewer sub-agent samples 30 cards
  against their source and finds the `what` faithful.

**Round 3: graphs, the desk, finding aids, reading room v0, proposals.**
- `graph` step: `library-graph.json` and `reality-tree.json` in the explorer's shape, with ranks and layout; minigraph
  SVGs after checking the interface; `presets.json` (captions in the style of `assets/graph/captions.json`).
- `desk` step: slip creation from the drained inbox (the drain's output as input, so the step is testable without a
  network), the register, answers' template, "send back" through `agent_inboxes.py send`, the wants list, `asks_librarian`
  lane, the privacy redaction (`[removed: R8]`), the two-wake overdue check.
- Finding aids for each collection and each pass, `special/` for S1 to S4 (the guidance aid first: every night-memo idea
  with Dinis's words verbatim, state and owner).
- `reading-room.html`, `proposals/ontology.md` and `proposals/beyond-the-grant.md` (sections 2 and 7, as requests).
- Checked by: (1) the graph files validate against the explorer's shape (index bounds, verb indices, facet fields,
  `counts`); (2) the explorer loads `library-graph.json` in a headless Chromium (the `newsroom/tools/newsroom-shots.cjs`
  route) and the view draws, with a screenshot kept in `reviews/`; (3) a path query between an agent and a finding
  reads as a sentence; (4) an end-to-end desk test: a question on a fixture inbox becomes a slip, an answer citing real
  cards, a sealed send in dry-run mode and a register row, in one run; (5) dev.graphs@, ontologist@, security@ and
  sherpa@ have each returned a review (an unanswered review is noted, never waited on past the wake).

After round 3 the library is complete **as files**. The `/library/` section waits on the grants of section 7.

## 9. Open questions for the librarian (and through it, Dinis)

1. **Sub-agents in the grant**: R4 allows them "only where the grant says so"; the commission asks for them. Is the
   commission enough, or does abp@ amend `board/abp/librarian.md`?
2. **Drain**: the desk depends on opening `board/inboxes/librarian.json`, which eight agents could not do on
   6 November. Until a drain exists the `asks_librarian` lane in `status.json` carries questions: does the conductor
   agree to put it in the role template?
3. **Retrospective accession date**: the design dates existing holdings on the first run and keeps the real date in
   `made_on`. Say if Dinis prefers the git date as the accession date.
4. **Reciprocal verb**: `see_also` breaks the ontology's rule of distinct inverses. Ask ontologist@ to bless the
   two-directed-edges form or to refuse and name another.
5. **Reader questions**: whether the site may offer readers a lane at all (the law, the brand, what the site promises
   are Dinis's alone).
6. **Search scope**: security@'s pending question (board files in the jump search by title and path) applies to
   `cards.json` too; the library publishes only what `catalogue.json` already does.
