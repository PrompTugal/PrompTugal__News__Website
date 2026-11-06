---
pass: 2026-11-06-the-front-page
goal: "The front page modern, slick and very visual, like a news organisation's (board/guidance/2026-11-06-front-page-timeline-publication.md, section 1): a better layout for the masthead's two boxes, the mandate breaker without repeating the navigation, an image or infographic on every story (the designer's 60 images placed), Now and Next presented well. Several rounds of design and comments, the synthetic readers' opinion in each."
owner: conductor@PrompTugal.dinis
agents: [sherpa, synthetic, designer, dev, correspondent]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
opened: 2026-11-06T04:35Z
---
# Pass: the-front-page

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:35 | conductor@ | opened | go | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 04:05 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |
| 04:50 | sherpa@ | review (the reader below the top, phone and desktop, live v0.1.94; waits on security@'s go) | change: 8 findings, F1 to F3 first (board/team/sherpa/review-2026-11-06-the-front-page.md, design/shots/sherpa/front/) | (this commit) | part of one wake |
| 06:00 | designer@ | round 1: three mock-ups (A the newspaper, B the visual wall, C the briefing first) answering F1 to F8; the spec for dev@ (board/spec-the-front-page.md); before and after: /newsroom/design/front-page-round-1/ | change: Dinis chooses; dev@ (dev.pages@) builds the choice and places the images | (designer's commit of this run) | 1 run, 0.0675 USD of images |
| 06:20 | synthetic@ | review of round 1: the four run-5 readers (SYNTHETIC) on today's front page (v0.1.140) and mock-ups A, B, C. Scored: A 9, C 9, today 6, B 0 (B last for all four). Blocking F35: the mock-ups' bylines hide that an AI agent wrote the work. Costly: F36 the sourcing promise to the bottom, F37 the AI chart unreadable on a phone and its mission dates read as the summit's, F38 B's bare figures, F39 C's briefing without sources (desks/synthetic/run-6/to/) | review: A or C both work for readers, with F35 and F36 fixed | (this commit) | one wake, 4 sub-agents |
| 08:55 | designer@ | round 2: synthetic@'s run 6 answered: F35 bylines name the AI agent (blocking; spec P2 corrected), F36 the band under the top, F37 a readable card image on a phone, F38 B dropped; before and after /newsroom/design/front-page-round-2/ | change: Dinis chooses A or C; dev@ builds P1 to P8 | (designer's commit of this run) | 1 run, no images |
| 08:55 | synthetic@ | re-check of round 2 against run 6's readers (no sub-agents: on the mock-up images): F35 verified in the mock-ups (bylines name the AI agent and the editor), F36 (the band names the editors and 'Every fact sourced'), F37 (card readable, the mission's dates captioned), F38 (B dropped). Each becomes verified when live. Still in the lead: the unsourced 2025 claim (F41, journalist@) | go: round 2 answers the readers; A or C both fine for them | (this commit) | one wake, no sub-agents |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| F1 No image anywhere on the front page; the designer's 61 article images are placed on no page | sherpa@ (review) | dev@ (feature), designer@ | open (conductor) |
| F2 Latest is eleven identical italic paragraphs: ISO date, agent address read as an e-mail, summary; needs picture, headline, one line, small byline | sherpa@ (review) | designer@, dev@ | open (conductor) |
| F3 Now and next is two phone screens, mostly the same registration item per place and day; pushes Latest three screens down: one line per day, today and the next few | sherpa@ (review) | correspondent@, dev@, designer@ | open (conductor) |
| F4 The mandate breaker repeats three links the bar has: keep its first sentence, drop the links | sherpa@ (review) | designer@, the journalist | open (conductor) |
| F5 'Around the summit, next' repeats Now and next lower down: one time block | sherpa@ (review) | correspondent@, designer@ | open (conductor) |
| F6 The stories have no section; one short kicker each, linked to its topic | sherpa@ (review) | designer@, ontologist@ | open (conductor) |
| F7 'Our question' and 'Who we are', what makes the site different, are 6,272 px down on a phone | sherpa@ (review) | designer@, the journalist | open (conductor) |
| F8 On a phone the floating Ask covers the end of a headline in every screen | sherpa@ (review) | designer@ | open (conductor) |
| An OpenRouter key for the designer is a secret: held only in the designer's session or sealed to its key, never committed, never in a prompt file or page; spend capped (accountant@) | security@ (pre-review) | designer@, accountant@ | condition of go |
| AI images are marked as AI-made; no cartoon or made-up picture of a real, named person; a photo of a person only with its source and licence | security@ (pre-review) | designer@ | condition of go |
| Screenshots in design/shots/ and mock-ups show public pages only: no signed-in view, no observability pane | security@ (pre-review) | sherpa@, designer@ | condition of go |
