---
title: "The front page, round 1: three mock-ups for Dinis, and what dev@ (or dev.pages@) builds whichever he picks"
by: designer@PrompTugal.dinis (session 2)
written: 2026-11-06T06:00Z
pass: board/passes/2026-11-06-the-front-page.md (round 1, designer)
for: Dinis (the choice), dev@PrompTugal.dinis and dev.pages@PrompTugal.dinis (the build), correspondent@ (the time block, the briefing's lines), ontologist@ (the kicker)
issue: WS-177
---
# The front page, round 1

The mock-ups (A the newspaper, B the visual wall, C the briefing first), on a phone and a desktop, first screen and whole page: the designer's vault `bar9wi87`, `front-page/round-1/mockups/`, and the before and after page `before-after/front-page-round-1/` (linked from /newsroom/design/front-page-round-1/). Made with `node design/mockups/front/make.mjs`. **My pick: A, with C's briefing card on the summit days.**

## Round 2 (08:50 UTC): synthetic@'s run 6 on round 1

F35 (blocking): bylines name the AI agent (P2 above, corrected). F36: a band under the top on every size, 'Every fact links to its source, with the date we read it. Written by AI agents, edited by Dinis Cruz, Indi Gupte and Vicky Wang. Independent of Web Summit.' (P7; first line reworded at 13:45 after synthetic@'s F45: 'every fact sourced' read as 'every fact checked'). F37: on a phone the lead shows the article's card image (session 1's, large type), the AI infographic one tap inside; on a desktop the infographic carries 'AI-made, every figure checked against the article' (P8). F38: B dropped. Mock-ups: vault `front-page/round-2/`, before and after `before-after/front-page-round-2/` (/newsroom/design/front-page-round-2/); `node design/mockups/front/make.mjs --round 2`.

| P7 | The band under the top (F36): the three lines above, on every page or at least the front page | F36 | dev@ |
| P8 | Phone images: the article's card image for the lead on a phone; the AI infographic on the article page and on desktop, with its caption (F37) | F37 | dev@ |

## Whichever is picked

| # | Change | Finding | Owner |
|---|---|---|---|
| P1 | Every story on the front page shows its image: the lead's banner, the seconds' card, a 96 x 69 px thumbnail in Latest. Images from the designer's vault by the public read key (as the observability report reads its vault with `assets/vendor/sgit-ai/2026-11-05/vault-embed.js`), or copied at build time from an `images.json` the designer keeps; never a new host. AI-made images carry a small "AI-made" label on the picture | F1 | dev@ |
| P2 | Latest rows: thumbnail, kicker, headline (the link), one small byline line: **the article's author agent by name, then 'an AI agent', then who it was for** (from the front matter's `author`, e.g. 'journalist-europe@web-summit.vicky, an AI agent, for Vicky Wang'), reading time, 'signed'; no ISO date. Never 'PrompTugal.news' or 'Vicky Wang's desk' in place of the agent (round 2, synthetic@'s F35: round 1's bylines hid that an agent wrote the story) | F2, F35 | dev@ |
| P3 | Now and next: three lines (today, and the next two dated moments), each "DAY DATE  what", linked to the summit day by day; drop "Around the summit, next" as a second block | F3, F5 | correspondent@ (which lines), dev@ |
| P4 | The mandate breaker: its first sentence only ("Our mandate: to map the universe of AI in Portugal. The companies, the people, the events and how they connect, every fact with its source."), no links; it moves into "Why we are different" with Reach, Mandate, Gap, right after Latest | F4, F7 | the journalist (words), dev@ |
| P5 | A kicker per story: its `beat` from the front matter (or its first tag), without the bracketed part | F6 | dev@; ontologist@ for a topic page to link it to |
| P6 | No floating Ask on a phone (with the top's Q8) | F8 | dev@ |

## If C (or A with C's card)

A briefing card, "Before the summit, in 30 seconds" (and on the summit days, "Day N in 30 seconds"): three lines written each morning by the correspondent from published stories, each line linking to its story and saying nothing a story does not; a "Play" that steps through the three stories' pictures. Data: `data/front/briefing.json` (the correspondent's), rendered by a small feature (dev@).

## Images for every story

The front page needs a picture for each story every day. The designer makes them: the session 1 article images (`design/infographics/`) and AI infographics (`design/ai-images/`, about 0.07 to 0.16 USD each, checked against the article before use) into the vault, listed in an `images.json` per article. Blocked today by the OpenRouter credit (about 3 USD left).

## Images (17:45 UTC)

Six AI infographics added to `design/infographics/out/` (thumb and card, paper and an identical ink twin), listed in its `index.json` with `layout: ai-infographic` and an `ai` record. For dev@: `newsroom/build/features/front.mjs` takes only `.png`; accepting `.jpg` too (`--paper--card.jpg`) would cut each card from about 120 KB to about 60 KB.
