---
pass: 2026-11-06-algarve-evolution-sprint
goal: "The best page about Algarve Evolution anywhere, better than its own site: a mini-site at /portugal/algarve-evolution/, wide, with every approved redesign idea, the mapping, graphs and visualisations of everything we know about Algarve Evolution and its past, live by 14:45 UTC for Dinis's meeting at 15:00 with António Pinto Guerreiro"
owner: conductor@PrompTugal.dinis
agents: [dev.portugal, dev.graphs, researcher, designer, dev, ontologist, sherpa, synthetic, correspondent]
budget: "one hour; measured, never blocking"
state: open
priority: "TOP, above everything else, 14:10 to 14:45 UTC"
opened: 2026-11-06T14:12Z
---
# Sprint: Algarve Evolution, for Dinis's meeting at 15:00

## Dinis's words (14:10 UTC)

"Can you prioritize for the next hour the next version of this? ... I'm meeting António Pinto Guerreiro, which is the main guy there, I think, or one of the main guys. So can you go to town? Can you ask the agents to really focus on this? Make all the ideas that we have and approved for redesign, just basically try to push it ... especially on this page ... create a good mapping and visualization and graphs of everything we know about Algarve Evolution and the past, and do some research and really try to make this the best page possible about Algarve Evolution ... Better than what they have, because this is the power that we have ... I want him to then look at it and going, wow, this is really good, I want more of this. So from a design point of view, feel free to go wide, feel free to use a lot of the space on the page, almost create a mini site here ... a great way to benchmark how everything works here. So I'm meeting him at 3, so we have an hour and a bit."

## Deadline

**Everything live on promptugal.news by 14:45 UTC.** Push in small pieces from 14:25; nothing waits for polish. dev@ brings work/dev.portugal and work/dev.graphs onto dev **as soon as each push passes the gate**, not at its wake.

## Who does what

| Agent | Work, by 14:45 |
|---|---|
| researcher@ | Everything public about Algarve Evolution and its past: founding, mandate, programmes, events by year, partners, the people by public role (António Pinto Guerreiro by his public role, from its own site or a public source), numbers, press; each fact with its link and date read, into `desks/researcher/` by 14:30 |
| dev.portugal@ | The mini-site at `/portugal/algarve-evolution/`: wide (full width), a hero with the mandate in one line and the numbers as tiles; sections as tabs or a left-hand map with collapsible sections (newsroom.sgit.ai's reading modes); a timeline of its past (years, events, Web Summit 2025); programmes as cards; partners as a map; the Algarve in summit week; "Correct us, add to us" kept; C's top. Pushes every 10 minutes |
| dev.graphs@ | The graphs for the page: the network (Algarve Evolution at the centre: programmes, partners, universities, municipalities, companies, events), a timeline, a map of the Algarve with places, and its links to the summit's companies and Portugal's ecosystem; save as PNG; into `assets/portugal/` for dev.portugal@ |
| ontologist@ | Algarve Evolution's entities and edges in `data/` (organisation, programmes, partners, places, events, people by public role) so the graph and the page read one source |
| designer@ | Go wide: the page's design in the brand, a mini-site, at desktop and phone; one pass on dev.portugal@'s pushes at 14:30, fixes sent straight to it |
| dev@ | Reviews and brings dev.portugal@ and dev.graphs@ onto dev on every push until 14:45; ships C's top if it is ready, but never holds the Algarve page for it |
| sherpa@, synthetic@ | At 14:35, read the live page as António Pinto Guerreiro would (the head of the organisation, first time on the site, on a phone and a desktop): what makes him say "I want more of this", what loses him; findings straight to dev.portugal@ and designer@ |
| correspondent@ | Algarve Evolution on the front page from 14:40 |

## Rules that still hold

Public, professional facts only, each with its source. No contact details. António Pinto Guerreiro is named by his public role only if a public source shows it (Dinis named him to the conductor; the naming decision page is answered for him by that). Nothing about RiskMandate beyond its own site.

| Time (UTC) | Agent | Step |
|---|---|---|
| 14:12 | conductor@ | opened at Dinis's word; every agent told in its session |
| 14:20 | designer@ | the design for dev.portugal@: board/spec-algarve-evolution-minisite.md and design/mockups/algarve/make.mjs (a self-contained page to lift: wide hero with the mandate and six tiles, a sticky left map with Everything/Short, a timeline 2018 to 2027, programme cards, partners grouped, the map, summit week, Correct us; phone and desktop); pictures design/decisions/algarve-evolution/ |
| 14:22 | designer@ | the pass on dev.portugal@'s build (bad30876): keep its content and timeline; six fixes, 1 and 3 first (go wide with a full-bleed hero; goals for 2032 apart from what is done): board/spec-algarve-evolution-fixes-1420.md |
| 14:30 | designer@ | the 14:30 check: live is still v0.1.269 (the old reading-column page, 666 px main on a 1440 screen, 8,277 px on a phone); dev.portugal@'s mini-site is on dev since 14:20 and waits for CI; its 14:24 push adds the network, timeline and map links; none of my six fixes is in yet: 1 (go wide, full-bleed hero) and 3 (goals for 2032 apart from what is done) still matter most (board/spec-algarve-evolution-fixes-1420.md) |
