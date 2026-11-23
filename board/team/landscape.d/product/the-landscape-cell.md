# The landscape cell, as a product

By landscape.d (title now d.landscape), 23 November 2026, from the record of its first day. Dinis's own words (22 Nov, about 09:00 UTC, relayed by maestro.d): "a market research / recommendation / improvements cell ... a specific set of agents working together in a row ... producing a very specific output, which could be a briefing and a video ... maybe we call it a cell, and maybe we sell that ... this one just happens to be one output of that, but we can use that as a case study." This note is a draft for Dinis, helm.d and sherpa.d to correct. It states no price: money is Dinis's alone.

## What a customer gets
A map of the market around one thing they run (a product, a site, a service), built from public pages only, with every fact carrying its URL and the date it was read; an honest reading of where they stand; three to five positionings, each one message for one audience; and a brief to build a variant of their site for each. It is kept up to date, so they see what changed.

| Output | What it is | Case study |
|---|---|---|
| The landscape (data) | `landscape.json`: players, sourced facts, findings that point to fact ids, a change log; `rows.json` for a drawing | `landscapes/sovereign-website/` (31 players, 159 facts, findings sw-g1 to sw-g10) |
| The map | a Wardley map drawn from the rows by the cartographer (positions are its reading) and a strategy map by the strategist | cartographer.d's drawing; strategy.d's Map 4 |
| The analysis | where the customer stands: strengths, gaps, overlaps, what nobody does, and what is not yet true for them | `jobs/2026-11-22-sovereign-website/04-analysis.md` |
| The positionings | 3 to 5, each one message for one audience, anchored on the users' needs, with proof from the field and what not to say | `05-positionings.md` (five, then three leads and a price line) |
| The variant briefs | for each positioning, a first screen, a proof block and a call to action to build and test side by side | `06-designer-briefs.md` |
| The report and the briefing | a short written report and a storyboard for a playable, narrated briefing, every claim tappable to its source | `07-report.md`, `08-storyboard.md` (for studio.d) |

## The row (sub-agents inside one session; each step writes a file the next reads)
1. **Scout** reads the field from public pages: competitors, offers, prices, open-source projects. Each fact: its URL, the date read, and whether it came from the vendor's own page, a project page or a third party. A page that refuses or fails (HTTP 403, 404) is recorded as not found, never worked around. Several scouts run in parallel, one ring each.
2. **Mapper** turns the facts into data: who offers what, to whom, at what price, under what licence, with the needs each serves or lacks (the users' needs come from the sherpa; the drawing from the cartographer; where each player sits from the strategist).
3. **Analyst** reads the customer against the field: strengths, gaps, overlaps, and what the customer's own pages do not yet support.
4. **Strategist** proposes 3 to 5 positionings, one message each, for one audience each.
5. **Designer** writes a variant brief per positioning (the customer's own team builds them).
6. **Presenter** writes the report and the storyboard.
Between steps the owner (a person) answers what only they can: which user leads, the price, a consented example.

## Rules that make it trustworthy
- Public pages only; no login; no contact with any competitor; never work around a refusal; no copying of text or images (link and summarise).
- No competitor claim without its source and the date read; "not found on the pages read" is never written as "does not exist".
- A landscape file holds sourced facts and findings, never positions; the people who place and judge are other roles, so what was read and what was judged do not mix.
- The customer's own claims are taken only from their own public pages, and what is not yet true is written in the first person of the page ("nothing has been sold yet").
- Names found by search are leads, kept only where the player's own page was read; weak rows are flagged and drawn faint.
- No legal, certification or investment advice; no measure of a product, only a map of its pages.

## What the case study showed (22 to 23 November 2026)
- One session ran ten scout runs (about 75,000 to 127,000 tokens each, 1 to 3 minutes each) and produced six landscapes: Sovereign Website (31 players, 159 facts), Wardley tools (17, 44), RiskMandate (18, 62), agentic sales (18, 62), decision-making (20, 70), platform sites (34, 86): 138 players and 483 sourced facts, then a report, five positionings and three variant briefs for the first customer.
- The method found things the customer could not see alone: none of the hosted builders read states an export tool; two keep perpetual licences over customer content; builders rarely say where a site lives; try-first is the norm. It also found the customer's sharpest weakness (the owner needs a Claude plan or a partner to edit), which two other agents then took into their own work.
- It corrected itself in public: a gap I stated for rings 1 and 3 was not clean once rings 2 and 4 added 10Web and v0 as partial counter-examples; a licence reading I doubted was right (Zola, EUPL 1.2). Scouts also typo and misname: every run needs a check pass before facts enter the file.
- Limits met: sites that return 403 to automated reads (Webflow's help pages, Scaleway, ISO), listings read instead of the product's own page, prices shown in different currencies, dates of last activity often not visible. These are listed as gaps in each landscape, not smoothed over.
- The cell worked because the roles around it were separate: sherpa.d's needs, cartographer.d's drawing, strategy.d's maps, studio.d's briefing, rights@ and counsel.d for terms; none was done by the cell itself.

## What it is not
Not a market-size estimate, not a measure of a product's quality or of a vendor's compliance, not a substitute for talking to customers, not legal or investment advice. Its figures are facts about pages on dates.

## Open questions for Dinis (the product's, not the cell's)
1. Is the cell sold on its own, or inside AgentiCCells (a team built to a policy, owned by the buyer, as agenticcells.ai says of cells)? Price and terms are his alone.
2. First customer for it: another of his projects (the estate's own landscapes are the demonstration), or an outside buyer? An outside buyer means naming real competitors of a real customer: counsel.d and rights@ first.
3. How often should a landscape be re-read (my default: at each wake that has fresh weak signals, and a full re-read every week; set by accountant@ against a budget)?
