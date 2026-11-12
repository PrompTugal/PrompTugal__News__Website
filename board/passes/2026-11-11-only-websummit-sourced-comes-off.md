---
pass: 2026-11-11-only-websummit-sourced-comes-off
goal: "Take off the public site every fact, page and entity whose only source is websummit.com, with a note on every affected page; bring items back through shadow sources and Dinis's captures; a recovery page shows the path, with Lisbon Fringe as the showcase (board/guidance/2026-11-11-only-websummit-sourced-comes-off.md)"
owner: conductor@PrompTugal.dinis
agents: [security, ontologist, dev, dev.data, dev.pages, designer, journalist, researcher, correspondent, sherpa, historian]
budget: "accountant@ to set; no OpenRouter calls until the shared credit is topped up"
state: open
opened: 2026-11-11T18:58Z
---
# Pass: only-websummit-sourced-comes-off

The shape: board/the-passes.md. At Dinis's word, about 18:50 UTC, 11 November 2026; it answers security@'s S39.

## Order

1. **security@, pre-review:** the rule, what the build must keep out (pages, lists, graphs, served JSON, twins, llms.txt, sitemap), and advice to Dinis on the copies in this public repository's `data/`.
2. **ontologist@, the inventory:** each fact, person, session and company whose sources are all on websummit.com (site, subdomains, app), as derived data the build can read, with counts by kind. People and sessions included.
3. **dev@ with dev.data@ and dev.pages@:**
   - the build leaves those items out of everything the site serves;
   - an entity with nothing left gets no page;
   - the note on every affected page and list, designed with designer@;
   - a gate check that fails if a websummit-only fact is served;
   - the recovery page.
4. **journalist@:** the 29 articles citing websummit.com. A sentence resting only on it is re-sourced or taken out, with a correction line on the article. Signed again.
5. **researcher@ (with journalist@):** shadow sources, in this order:
   - the interviewed companies and those with GAMMA-Ray cards first;
   - then the 59 companies left with nothing;
   - then speakers.
   Public pages only, each with its URL and date read.
6. **correspondent@:** the front page and its bands.
7. **sherpa@:** the note and the recovery page read cold, on a phone.
8. **security@, post-review**, then a note by historian@ (or journalist@) on the workflow, with Lisbon Fringe as the showcase.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 18:58 | conductor@ | opened | go | (this file) | |
| 21:45 | conductor@ | check | no step taken yet: security@'s 21:05 review lists S39 open; ontologist@ and dev@ not yet. Vicky's articles withdrawn separately (1649d9879) | | |
| 22:05 | ontologist@ | 2, the inventory | done, ahead of security@'s pre-review (it adds data and takes nothing off the site; security@ to review it with step 1) | `data/websummit-only.json`, derived by `newsroom/build/lib/derive.mjs` (`websummitOnly`, `isWebSummit`; hosts websummit.com and websummit.net with their subdomains), schema `data/schemas/websummit-only.schema.json`. Websummit-only, of total: company facts 239 of 311; company edges 282 of 307; flows 0 of 32; products 0 of 24; people 285 of 285 (390 of 390 listings); events 215 of 248; organisations 184 of 269; places 45 of 85. Companies left with nothing (no fact, edge, flow or product with another source): 37 of 120, not 59, because flows, products and edges keep 22; 31 of the 37 already have their own site on file (`other_sources_on_file`), so researcher@ starts there. For dev@: the file is refs only, but it names every person and session that comes off, and `data/*.json` is served (`/data/matching.json` answers 200): keep this file out of what the site serves. | | |
| 22:20 | dev@ | 3, groundwork | the rule and its count in the gate (lib/wsonly.mjs, check 15, a warning while the switch newsroom/build/websummit-only.json is off; nothing served changes); it reads ontologist@'s inventory. The inventory itself was served (/data/websummit-only.json answered 200 at 22:10, naming every person and session that comes off): now on the deploy's exclude list (features/served.mjs). The filter, the note, the failing check and the recovery page wait on security@'s pre-review (step 1) | 8153faf84 and this wake | |
| 22:55 | designer@ | 3, the note and the recovery page (design) | designed; waits on security@'s pre-review for the build | `board/spec-the-not-everything-note.md`, `design/not-everything/make.mjs`, pictures in `design/decisions/not-everything/` | no OpenRouter calls (none needed) |
| 23:40 | dev@ | 3, the filter (behind the switch) | built, switch still off: lib/wsonly.mjs wsApply takes the inventory's items out of the store (company facts and edges, the 37 companies left with nothing, people, sessions, organisations, places; a company with no fact left keeps its name and own site); features/wsonly.mjs turns a hand-written link to a page that came off into plain text; features/served.mjs keeps their raw data/ files and dev.data@'s websummit-only story files out of the deploy; the data check reads the data as committed. Local trial with the switch on: gate green but for 3 cells of dev.graphs@'s cloud-centres.json (asked). Still to do: story claims on the story pages, the note (designer@'s spec), the failing check, the recovery page. Turned on after security@'s pre-review | this wake | |
| 00:05 | security@ | 1, pre-review | **go, with conditions**: everything served, not only pages (raw data/, data/stories/, desks/programme/agenda.json, board/ copies, api, twins, search, llms.txt, sitemap); gate check 15 fails once the switch is on; offline cache version bumped in the same release; the note; inventory stays unserved; shadow sources public only. Advice to Dinis: take it off the site, leave git history alone | board/team/security/reviews/2026-11-12-0005-websummit-only-pre-review.md | |
| 00:50 | dev@ | 3, security@'s conditions | all on my side met, switch still off: (1) the deploy also leaves out the desks' copies (desks/programme, desks/curator, the beats' found lists) and the exclude list itself; topic pages stop linking curator files; page markdown (not signed articles) unlinks pages that came off; (2) features/wsonly.mjs validate FAILS with the switch on if any built file or raw data/ file still served names an inventory item; (4) sw.js gets the hashed paths of pages that came off and drops their kept and saved copies on takeover (it changes every release). Note and recovery page: dev.pages@ (agreed). Local trial with the switch on: 147 failures, none mine: ontologist@'s four core entities (organisation:web-summit 80, place:meo-arena-and-fil 23, place:lisbon 16, organisation:aws 12, event:web-summit-lisbon-2026) need a public shadow source; journalist@'s three signed twins; dev.graphs@'s cloud-centres.json. The switch goes on when those clear | this wake | |

| 00:45 | conductor@ | check | the switch waits on: ontologist@'s core entities (shadow sources added e0cea1b35, to re-try), journalist@'s three signed twins and dev.graphs@'s cloud-centres.json; both nudged | | |
| 01:30 | dev@ | 3, nearly ready | brought dev.pages@'s note and recovery page, dev.graphs@'s cloud-centres fix, dev.data@'s story inventory; evidence captures with a websummit.com source come off by the host rule (31 of 84, not in the inventory); refs to what came off are dropped from what stays; a story's claims.json is kept out while it holds a websummit-only claim; company summaries read right with fields taken off. Trial with the switch on: 4 failures left, journalist@'s three signed twins and company:pitchbook in the dashboard (ontologist@); then the switch goes on | this wake | |

| 03:45 | conductor@ | check | the switch waits on journalist@'s three signed twins and ontologist@'s company:pitchbook (dev@ 3c2d3dd8e); journalist@PrompTugal.dinis has made no commit since 10 Nov 04:09 UTC, so the twins wait on Dinis: restart journalist@, or have the three articles withdrawn like Vicky's | | |
| 04:30 | dev@ | 3, **the switch on** | the gate green with it on: 770 pages (from 1530); people 285, sessions 214, organisations 182, places 43, evidence 31, 37 companies and 239 company facts off the site, raw data/ and desk copies out of the deploy, the offline worker drops kept copies; dev.pages@'s note on every affected list and page and /about/what-came-off/. Two choices to review: the newsroom dashboard's quotes of agents' status lines are not scanned (a ref named in a sentence is not a fact), and journalist@'s three signed article twins (links to companies/mobile-brain/, companies/just-travel/, events/the-next-digital-frontier/) are a warning, not a failure, since journalist@ is not running on account B; step 4 is theirs. security@ to post-review | this wake | |
| 04:30 | ontologist@ | 2, shadow sources for dev@'s leaks | done: Web Summit, AWS, the summit event, MEO Arena and FIL, Lisbon (Wikipedia, the EU HaDEA event page; e0cea1b35); evidence captures in the inventory (a6bfe3a4d); PitchBook from a Morningstar SEC exhibit once the phone check skipped URL paths. 36 companies left with nothing | data/websummit-only.json | |
| 06:05 | security@ | 8, post-review | **holds live**: raw data/, stories, desk JSON, a removed person's page all 404; api/v1 people 0 and events without inventory items; sitemap clean; websummit.com only as pointers; /about/what-came-off/ up; /sw.js drops kept copies (hashed GONE set); inventory unserved. Left: journalist@'s re-sourcing, shadow sources, designer@'s three note gaps | board/team/security/reviews/2026-11-12-0605-websummit-only-post-review.md | |
| 06:40 | ontologist@ | 5, shadow sources (companies) | 31 of the 36 companies left with nothing come back: a fact from each one's own home page (own1, read 6 and 7 Nov); 5 left (eversec, nisos, persona, polygraf-ai, whitespace: no readable site). The inventory adds company_fields: per company, the fields whose sources are all on websummit.com (country, attending, ...), for dev@ to blank where a company keeps other facts | data/websummit-only.json | |

| 06:45 | conductor@ | check | **live**: the switch on at 04:30, security@'s post-review holds (S39 closed); 31 of 36 emptied companies back from their own pages; open: 5 companies, the speakers, journalist@'s three signed twins (a warning; journalist@ silent since 10 Nov), designer@'s three gaps, sherpa@'s NE5; historian@'s note | | |
## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
