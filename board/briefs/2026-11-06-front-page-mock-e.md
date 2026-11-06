---
title: "Brief for the dev team on account B: Silvio's mock E becomes the home page"
by: conductor@PrompTugal.dinis
written: 2026-11-06T22:50Z
asked_by: Dinis Cruz, 6 November 2026, about 22:40 UTC ("can you brief the dev team (once fully wired on Account B) to wire these designs to the home page (making the required quality fixes) https://web-summit.sgit.ai/people/silvio/lab/mocks/e.htm")
for: dev@PrompTugal.dinis (leads), dev.pages@, designer@, sherpa@, synthetic@, observability@
supersedes: the front page's answer of 13:20 (A, the newspaper), for the home page only; C's top stays on every other page
issue: WS-177
---
# Silvio's mock E becomes the home page

## The source

- **The mock:** https://web-summit.sgit.ai/people/silvio/lab/mocks/e.htm ("The Front Page", option E, Silvio's favourite), by design@web-summit.silvio; read-only clone: `SGit-AI__Website__Web-Summit/people/silvio/lab/mocks/e.htm`, with `make.py` and the screenshots `shots/e-desktop.jpg`, `shots/e-first-screen.jpg`, `shots/e-phone.jpg`. Latest change read: 22:23 UTC ("the numbers band slim and in sand, not mint").
- **Credit:** the page says it is Silvio's design (the agent block and the before-and-after).

## What it is, top to bottom (desktop)

1. A thin line: the date; "Opening Night in 2d 21h 37m"; "Lisbon · Independent".
2. A centred nameplate (the PrompTugal.news wordmark) and the sections as one centred row (Now, Agenda, News, Companies, People, Portugal, The graph, About).
3. **The lead band:** full width, dark green; the lead's section, headline (with the key figure underlined), standfirst, by-line and the "agent-written · checked · signed" pill on the left; its infographic as a card on the right.
4. **"This week":** a ticker of the week's items (time, title) across the full width.
5. **Three columns:** "The briefing" (numbered 1 to 5, headline and section); the main stories (section, headline, standfirst, the pill, a thumbnail); "Now and next" (time badges and the next items).
6. The numbers band (slim, in sand) and the rest of the page as the mock has it.

## The quality fixes (required before it ships)

- **From data, never hard-coded:** the lead and the order from correspondent@'s `desks/correspondent/front-page.json`; the briefing and stories from the published articles; "This week" and "Now and next" from the day data (`api/v1/days.json`); the countdown to Opening Night (Monday 9 November, MEO Arena) computed, and gone after it.
- **Nothing loaded from another site:** the mock links `web-summit.sgit.ai/people/silvio/lab/design.css` and `design.js`; copy what is needed into `assets/` (fonts self-hosted as today), no third-party script, under security@'s CSP.
- **No lab chrome:** drop the "LAB MOCK E · not the live site" bar, "All options · The original", the floating "Design: The Front Page" button and the palette switcher (the brand v2.0 palette only, unless designer@ keeps a choice for the A/B).
- **The pills only where true:** "signed" when the gate verified the article's signature, "checked" when dev.verify@'s verified block exists; otherwise no pill.
- **Accessible:** the ticker pauses on hover and focus, stops under `prefers-reduced-motion`, and is reachable by keyboard; every image has its alt text and its "AI-made" label; contrast checked on the dark band.
- **The phone:** as `shots/e-phone.jpg`, with C's tab bar at the bottom kept (Dinis's 13:20 decision for every page); the countdown and ticker readable at 390 px.
- **The site's contract:** the markdown twin, the version badge, the agent block, offline mode (the service worker caches it), no em-dashes, images sized for the page, the gate green.
- **The top:** the home page uses E's nameplate; every other page keeps C. Keep the current front page (A) behind the A/B switch so observability@ can measure E against it.

## Who does what (on account B)

| Order | Agent | Work |
|---|---|---|
| 1 | dev@ | Reads this brief and the mock; splits the work; builds the page shell and the lead band; reviews dev.pages@ |
| 1 | dev.pages@ | The three columns, the ticker and the numbers band from data |
| 2 | designer@ | Checks the build against `shots/e-*.jpg` and Silvio's mock, writes the before and after |
| 3 | sherpa@, synthetic@ | Read it cold on a phone and a desktop; the A/B against A |
| 3 | observability@ | The A/B variant in the page events (as for the top) |

Done when E is live at https://promptugal.news/ from data, with every fix above, and designer@'s check passes.
