---
title: "Wikipedia as a source and a graph: round 1 done, the list for the team"
for: conductor@PrompTugal.dinis (to route), dev@, designer@, accountant@, journalist@, devops@, security@, historian@
by: ontologist@PrompTugal.dinis
written: 2026-11-06
asked_by: Dinis Cruz, in the ontologist's session, 6 November 2026
project: board/projects/wikipedia.md
status: a brief, not an instruction. Only Dinis instructs; what it asks of your lane is yours to weigh and the conductor's to route
issue: WS-177
---
# Wikipedia: round 1, and what it asks of each of you

**Dinis's ask, short:** Wikipedia is one of our best sources and already a graph; read it as data, quote it, use it for shadow views (a reputable source that has seen a page we cannot read), show on every page where a fact came from ("this comes from Wikipedia"), take a screenshot of every page we consume, separate opinion from fact from Wikipedia-style reference, and grow it in rounds under the accountant's budget, bringing the team along. His words are in the project file.

**Done (round 1, ontologist):** the tool `newsroom/tools/wikipedia.mjs`; the Web Summit article as data at revision 1383690798 (`data/wikipedia/web-summit/`: 79 statements classed by wording, 63 references, the timeline table, 373 links); where it meets our graph and five findings for a person (`meets.json`); six schemas checked by the gate; `article_kind` and `source_provenance` in the ontology. The Web Summit article is weak where we are strong: its lead contradicts its own timeline (Dublin "until 2016"), and the timeline stops at 2024 though the organiser published 2025's dates and figures.

## Asks, by lane

| Who | Ask | Why now |
|---|---|---|
| accountant@ | A budget for round 2 (proposed: dev@ two wakes, designer@ one, ontologist@ two, the capture tool one devops@ wake), before it starts | Dinis: no rabbit holes |
| dev@ | Own `newsroom/tools/wikipedia.mjs` (written by me to the tools' shape; review it). Build `/wikipedia/` and a page per article from `data/wikipedia/<slug>/` (list items 1 and 2 of the project). The port note below says what to reuse | the data is there and checked |
| designer@ | The article page's layout (statements by class, references held and not, the findings as edit requests), and a provenance mark per source kind | item 2: provenance on every page |
| devops@ with security@ | The capture tool: a screenshot and a hashed copy of every page we cite (Playwright is in the container), paywalls kept as teaser and marked shadow; security@ on what may be kept | Dinis: "a screenshot of every page we consume" |
| journalist@ | `kind:` in each article's front matter from `article_kind`; my proposal for the eleven is in the project file | opinion, fact and reference kept apart |
| historian@ | Read the PHP newsroom's brief and debriefs on Wikipedia (paths below) for lessons to brief the team | its ontologist did this before |
| conductor@ | Route the above; the charter (item 11) is yours, from the PHP newsroom's eleven principles | CLAUDE.md is yours |

## The port note (a read-only study of the PHP newsroom's code, 6 November)

- **Where:** fetch `__team/records/desks/wikipedia/fetch.py`; parsing and the classifier `__press/build/wikitext.py` (stdlib only, no model); pages and graph `__press/build/build.py` (`wiki_load`, `wiki_graph`, `build_wikipedia`, about lines 7630 to 8290); the graph viewer `__press/assets/components/sg-graph/v1/v1.0/v1.0.1/` (plain JS web component, Apache-2.0). Repositories: SGit-AI/SGit-AI__Website__Newsroom__2026__Oct__PHP__team and __press, public.
- **Reuse as is:** the API calls and pacing (identifying User-Agent, 2 s per request, back-off on 429 and 503), one file per revision, statement ids by hash, the delta between revisions (set difference plus a similarity of 0.6 or more for "changed"), revert detection by tags, talk-page threading, the graph shape and its ontology (13 kinds, 19 verbs with inverses), `sg-graph`, the licence lines.
- **Adapt:** Python to Node 18; the classifier's English word lists, plus Portuguese ones for pt.wikipedia.org; reference-to-capture matching by normalised URL onto our `sources.json` records; `build.py`'s page functions depend on its globals and are a model, not a library.
- **Drop:** the CVE nodes, fact-check and contradictions, the DBpedia check, editors' names (their code keeps registered usernames; we keep none), raw talk-page wikitext in the repository (an IP address can survive in a post).
- **Their captures:** page.html, rendered.html, text.txt, a screenshot, headers and provenance, each with its sha256, taken by Playwright, kept in a private vault with only hashes published; paywalled pages are teaser-only, status `paywalled`. That is the shape for item 3.
- **Their lessons:** the article `__site/content/articles/2026-10-25__ontologist__what-wikipedia-knows-about-being-right.md`, the brief `__team/records/briefs/2026-10-25__brief__wikipedia-as-an-anchor.md`, the debriefs under `__team/records/agents/ontologist/debriefs/` (2026-10-25).
- **No "shadow" view as such exists there:** the nearest is the paywalled-teaser status. Our `source_provenance` kind `shadow` is new: cite what a readable reputable source says a page says, and say so.

## Risks

CC BY-SA share-alike on any page that carries Wikipedia's sentences; the classifier is wording only and English only; a pass over hundreds of revisions is quadratic if done naively; and Wikipedia's rule against model-written text, which is why nothing of ours ever goes there but through a person.
