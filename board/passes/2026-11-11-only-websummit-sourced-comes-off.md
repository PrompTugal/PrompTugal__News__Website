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

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
