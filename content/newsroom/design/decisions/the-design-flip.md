---
title: "Round 1: the design flip for the agentic edition, three Portuguese directions"
summary: "THE RESTART asks for a heavy design flip of pt.news: modern, very Portuguese, at the quality of the investor decks. Three directions for the home page, all inside brand v2.0's colours and fonts: A Azulejo (tile patterns), B Calcada (pavement waves, a dark top), C Jornal (a modern broadsheet). Each with the GAMMA-Ray leaderboard at the top, the two interviews and the graph. The designer recommends B, with A's tiles as a detail."
decision: open
asked_by: designer@PrompTugal.dinis
asked_of: the team (a PT decision); reviewers sherpa@ and synthetic@. One part is Dinis's alone: any colour beyond brand v2.0 (azulejo blue) and setting the masthead in type
since: 2026-11-10T06:55Z
blocks: "dev@ and dev.pages@'s build of the agentic edition's home page"
answer: null
answered_at: null
---
**The ask.** Dinis, 10 November, about 02:40 UTC (`board/guidance/2026-11-10-the-restart.md`): *"A heavy design flip: modern, very Portuguese, at the quality of the investor decks."* The home page leads with "State of agentic": the GAMMA-Ray leaderboard and cards, then our content (the two interviews), then the graph in place of the company list.

**The rules for round 1.**
- Every direction stays inside brand v2.0: paper, ink, red and green, and the fonts Newsreader, Plex Sans and Plex Mono. The logo is unchanged.
- "Portuguese" comes from form, not new colours: tile geometry, the black-and-white pavement waves of Lisbon's calcada, the ruled broadsheet.
- **Placeholders:** the companies and scores are invented ("Company A, 82"). No GAMMA-Ray data is in the repository yet. The interviews' names are real; their one-line summaries are mine, for the mock-ups only.
- Made by `design/home-designs/flip/make.mjs` (HTML, no AI).

## A. Azulejo: a tile grid

![A on a desktop](../../../../design/decisions/the-design-flip/flip-a--desktop.jpg)

A band of tile pattern under the masthead. The same tile marks each section and fills the corner of each card.

- **Does well:** unmistakably Portuguese at a glance, and the tile can carry through to cards, the app and share pictures. The leaderboard boxed in ink reads as an instrument.
- **Does badly:** the pattern is busy, and on a phone the band and tiles take space. Done carelessly it turns into decoration. Azulejo is usually blue and white; in ink and red it reads as tile but not as *the* tile. Real azulejo blue needs Dinis.

## B. Calcada: pavement waves, a dark top (recommended)

![B on a desktop](../../../../design/decisions/the-design-flip/flip-b--desktop.jpg)

The top of the page is ink, like a night at the summit. "State of agentic" sits in big Newsreader with the italic in red, and the leaderboard has score bars in green. A wave, Lisbon's pavement, turns the page to paper. The section heads are in italic serif.

- **Does well:** the most modern of the three, and the closest to the investor decks' feel: a dark hero and one strong statement. The leaderboard is the first thing you see on a phone after the headline. The wave is simple enough to reuse as the site's one Portuguese signature, in the footer, the app and the share pictures.
- **Does badly:** a dark top on a paper site is a big change, and it has to work in dark mode too, where the whole page is dark and the wave must invert. The bars invite comparing scores at a glance, so the "beta, with evidence" line must stay beside them.

## C. Jornal: a modern broadsheet

![C on a desktop](../../../../design/decisions/the-design-flip/flip-c--desktop.jpg)

A ruled masthead with the name set big in type, three ruled columns, and the leaderboard as a results table.

- **Does well:** the most "newspaper": calm, dense, credible, the quickest to build from today's page.
- **Does badly:** the least Portuguese and the least of a flip. It is close to what we have. Setting the name in type in place of the wordmark is a logo change, which is Dinis's.

## On a phone

![A on a phone](../../../../design/decisions/the-design-flip/flip-a--phone.jpg)
![B on a phone](../../../../design/decisions/the-design-flip/flip-b--phone.jpg)
![C on a phone](../../../../design/decisions/the-design-flip/flip-c--phone.jpg)

## The recommendation

**B, with A's tile as a small detail** (the leaderboard's corner, the section marks). B makes the flip the restart asks for without leaving brand v2.0. It needs no new colour and no logo change, so it is the team's to ship.

**What follows each answer:**
- **B (the default, per CLAUDE.md "the owner's recommendation is the default"):** round 2 next wake. Dark mode, the GAMMA-Ray card and an explainer block, and the wave in the footer and the app. Then a spec for dev.pages@. The leaderboard waits for GAMMA-Ray's JSON.
- **A:** the same round 2, plus a "For Dinis" on azulejo blue.
- **C:** a smaller step, buildable today. The masthead stays the wordmark unless Dinis says yes.
- **An A/B test** if sherpa@ and synthetic@ split: B against today's home page.

**Reviewers:** sherpa@ and synthetic@, please read the phones first.
