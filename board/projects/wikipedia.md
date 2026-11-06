---
project: wikipedia
goal: "Wikipedia as one of PrompTugal.news's best sources and its best graph: every article we lean on read as data at a pinned revision (statements classed, references, tables, links, history), joined to our graph so a reader sees where each fact came from, and our own pages written to Wikipedia's standard where they are reference; where Wikipedia is weak and we hold the sources, a reviewer's reading a person can take to its talk page."
lead: ontologist@PrompTugal.dinis
asked_by: Dinis Cruz, 6 November 2026, in the ontologist's session
model: the PHP newsroom's Wikipedia section (https://refs.php.oct.2026.newsroom.sgit.ai/wikipedia/, code in SGit-AI/SGit-AI__Website__Newsroom__2026__Oct__PHP__team and __press) and its ontologist's article "What Wikipedia knows about being right" (https://php.oct.2026.newsroom.sgit.ai/articles/what-wikipedia-knows-about-being-right/)
data: data/wikipedia/<slug>/
budget: "asked of accountant@: round 1 is one ontologist wake plus one dev@ and one designer@ wake; no loop without a budget"
state: open
opened: 2026-11-06
---
# Wikipedia

## Why (Dinis, 6 November 2026, in his words)

- "Wikipedia is one of our best sources of data ... already a massive graph-like structure and a really powerful way for us to access data, not just for Web Summit, but also for companies."
- "One of the sources that we can quote, and ... shadow reporting or shadow views of news": a reputable source that has seen a page we cannot read, even behind a paywall.
- "Weirdly, the Wikipedia page [Web Summit] is actually quite weak ... so ironically, we actually might be able to do something good."
- "Start separating ... what's an opinion article, what is a factual article, what's more of a Wikipedia-style article where it's all about the facts."
- "We should have a screenshot of every page that we consume", and "show the provenance of where the data come from: this comes from Wikipedia".
- "Every article, every entity here needs to have its own ontology and taxonomy and explanation and graphs and connections", fractal: a graph of the story, of the evidence, of what is happening, of the flow, of the timeline, and how they fit.
- "Start small and then grow"; "work with the accountant so that we don't end up in massive rabbit holes"; "bring the rest of the team with you".

## Round 1 (6 November 2026): done by the ontologist

| What | Where |
|---|---|
| A tool that reads one English Wikipedia article at its latest revision through the MediaWiki API (named User-Agent, no key) and writes it as data; no editor's name kept | `newsroom/tools/wikipedia.mjs` (for dev@ to own) |
| The Web Summit article, revision 1383690798: 79 statements in 20 sections, classed by wording (33 stated, 20 record, 13 attributed, 7 quote, 6 hedged), 63 references (62 with a URL, each cited by a sentence), the timeline table (17 rows), 373 links to other articles, 434 revisions since 23 March 2013, Wikidata Q16967344, 11 languages | `data/wikipedia/web-summit/` (article, statements, references, tables, links) |
| Where it meets our graph: 14 of its links are our entities (Lisbon, Dublin, the Royal Dublin Society, Parque das Nações, Paddy Cosgrave, CNN ...), its 15 Dublin and Lisbon timeline rows are our past-edition events | `data/wikipedia/web-summit/meets.json` |
| Five findings for a person to weigh: the lead says Dublin "until 2016" against its own timeline (W-01); no 2025 row though the organiser published the dates and figures (W-02); nothing on 2026 (W-03); 2009 has no venue (W-04); 30 of 79 sentences uncited (W-05) | `meets.json`, `findings` |
| Schemas, checked by the gate: six `wikipedia-*` kinds; a meets file must match the capture's revision, its refs must exist | `data/schemas/wikipedia-*.schema.json`, `newsroom/build/lib/datacheck.mjs` |
| Two taxonomies in the ontology: `article_kind` (report, reference, explainer, analysis, opinion, how-we-work) and `source_provenance` (primary, press, wikipedia, shadow, ours) | `data/ontology.json` |

## The rules of engagement (from the PHP newsroom's eleven, kept short)

1. **Never edit Wikipedia.** No agent posts to Wikipedia or its talk pages (its March 2026 guideline refuses model-written text, and it is right to). Our findings are written for a person, in the edit-request shape: the current wording, the proposed wording, the source.
2. **Pin the revision.** Every fact taken from Wikipedia cites the article's oldid; the oldid is the attribution (CC BY-SA 4.0). A page that carries Wikipedia's sentences carries the licence.
3. **Say where you read it.** A reference we have read ourselves is cited as that page, not as Wikipedia; Wikipedia is the map to the primary sources, and a relay is not a second source.
4. **Directly supports.** One claim, one assertion, one kind of support; no synthesis of two sources into a third claim.
5. **Classes by wording, never by truth.** record, stated, attributed, quote, hedged say how a sentence is written, not whether it holds.
6. **Privacy first.** No editor's name, no IP address, no talk-page signature is kept; history is counted, not attributed.
7. **The ten-year test.** Our reference pages carry what will still matter; the day's detail lives on the timeline.

## The list (to grow; the accountant budgets each round before it starts)

| # | What | Who | State |
|---|---|---|---|
| 1 | `/wikipedia/` section: an index of the articles read, a page per article (statements by class with their references, references with the ones we hold, the timeline table, the links that are our entities, the findings), its graph as JSON | dev@ (port of `__press/build/build.py` `build_wikipedia`, adapted), designer@ (layout) | open |
| 2 | "From Wikipedia, revision N" on every entity and fact whose source is Wikipedia (the past editions first), and a provenance mark per source kind (`source_provenance`) on every page | dev@, designer@ | open |
| 3 | A screenshot and a hashed capture of every page we cite (Playwright, as the PHP newsroom's source watch: page.html, text, screenshot, headers, sha256), Wikipedia's references first; paywalled pages kept as teaser only, marked shadow | dev@ or devops@ (the tool), researcher desk (the run), security@ (what may be kept) | open |
| 4 | The articles of our graph's entities: Lisbon, MEO Arena, Paddy Cosgrave (public and professional only), Portugal's AI companies with an article, the companies we follow that have one (match by website and Wikidata) | ontologist@ | open |
| 5 | Wikidata: the item's statements as facts with their own references (start, location, founder, official website) | ontologist@ | open |
| 6 | History and talk: revisions as statement deltas (added, removed, changed), the talk page's threads; with the privacy rule above | ontologist@, then dev@ | open |
| 7 | Portuguese Wikipedia (pt.wikipedia.org): the same tool with Portuguese word lists (disse, afirmou, segundo, de acordo com; poderá, alegadamente, terá) and section names (Referências, Ligações externas, Ver também) | ontologist@ | open |
| 8 | Articles labelled by kind (`kind:` in each article's front matter, from `article_kind`): proposed below | journalist@ | open |
| 9 | Our reference pages to Wikipedia's good-article criteria (well written, verifiable, broad, neutral, stable, illustrated), as a review in each pass | sherpa@, synthetic@, journalist@ | open |
| 10 | The fractal view: a story's graph, its evidence's graph, the timeline and the flows as zooms of one graph (the PHP newsroom's `/fractal/`), stored once, transformed, stored again | ontologist@ (the shapes), dev@ (the viewer: `sg-graph`, Apache-2.0, reusable as is) | open |
| 11 | The charter: our own rules of engagement for agents, in Wikipedia's manner (burden on the one who adds, bold-revert-discuss, edit requests across lanes), from the PHP newsroom's article | conductor@ (CLAUDE.md is his), historian@ | open |

## Article kinds, proposed for the eleven published (for journalist@)

| Article | Kind |
|---|---|
| Brazil's startup mission comes to Web Summit Lisbon | report |
| Europe in Pavilion 4 | report |
| Following robotics at Web Summit | explainer |
| From the PITCH stage to new markets | report |
| Gender in Tech report: 84% see women in leadership | report |
| Lisbon's universities at Web Summit | report |
| The newsroom four days out, in pictures | how-we-work |
| Road 2 Web Summit | report |
| Tuesday 10 November: three ways in | explainer |
| Web Summit 2026 in numbers | reference |
| Your first day at Web Summit | explainer |

## What was learnt in round 1

- The article is weak where we are strong: its timeline stops at 2024, and its lead contradicts its own table. The organiser's own pages close both gaps, which is the reviewer's reading the PHP newsroom made for its article.
- The rendered HTML (action=parse, prop=text) is easier to read as statements than the wikitext, but its ids are entity-escaped (`cite&#95;note`) and citation markers sit between a sentence's full stop and the next one: both handled in the tool.
- Re-serialising a hand-formatted JSON file rewrites all of it: edit `data/ontology.json` in its own one-line-per-item style.
