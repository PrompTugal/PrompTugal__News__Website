---
pass: 2026-11-06-the-top-of-the-page
goal: "The top of every page: Dinis's feedback (board/guidance/2026-11-06-design-and-passes.md, section 1). Quick fixes first (logo left and things right, the card tagline 'People and AI agents, reporting together.', no Powered by RiskMandate in the masthead, the credit top right, no Vault button for now, the Newsroom link reachable on a phone in portrait), then at least three mock-ups of the top for Dinis to choose."
owner: conductor@PrompTugal.dinis
agents: [sherpa, designer, dev, synthetic]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 03:50 UTC)"
state: open
opened: 2026-11-06T04:10Z
---
# Pass: the-top-of-the-page

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:10 | conductor@ | opened | go | (this file) | |
| 03:50 | accountant@ | budget set (board/budgets.json): runs, dollars, output tokens; a hard stop | go | (budget commit) | not counted |
| 03:50 | security@ | pre-review | go, with conditions: no new script, font or request to another host; no screenshot or mock-up shows a signed-in view or the observability pane open; the credit top right shows the price only, never a reader's account or key; the Newsroom link on a phone points at public pages only (board/team/security/reviews/2026-11-06-0350-first-review.md) | (the commit of this review) | one wake |
| 04:05 | sherpa@ | review (the reader, phone and desktop, live v0.1.93) | change: 13 findings, T1 to T3 first; six questions for the mock-ups (board/team/sherpa/review-2026-11-06-the-top-of-the-page.md, design/shots/sherpa/top/) | (this commit) | one wake |
| 05:40 | designer@ | round 1: the card's tagline released (T5, v0.1.123); quick fixes Q1 to Q9 for dev@; four mock-ups A to D for Dinis (board/spec-the-top-of-the-page.md; before and after: /newsroom/design/v0-1-123-the-top-of-the-page/) | change: Dinis chooses a top; dev@ the quick fixes | (designer's commits of this run) | 1 run |
| 06:40 | sherpa@ | re-measure after round 1 (live v0.1.152) | partial: T5 done; T1 worse (a fifth round button, 1.5 of 8 sections on a phone); T2, T4, T6, T7 open; ranked: Q5 (T1, T2), Q1 (T4), Q2 (T7) first, none waits on the mock-up choice (board/team/sherpa/review-2026-11-06-0630-wake.md, section 1) | (this commit) | part of one wake |
| 09:50 | sherpa@ | re-measure (live v0.1.187) | no change: Q1 to Q9 not live; new: a search box on every page adds about 80 px on a phone, its placeholder cut off, a second search beside the bar's (board/team/sherpa/review-2026-11-06-0930-wake.md, section 3) | (this commit) | part of one wake |
| 10:45 | designer@ | spec check on live v0.1.210: T5 live; Q1 to Q8 not yet; Q9 partly (the new search box); order proposed: Q5, Q8, Q1, Q2 (board/team/designer/sessions/session_018yvwtQG4hfVbvycXkifYXc/spec-check-v0.1.210.md) | change: dev@ | (designer's commit of this run) | part of 1 run |
| 11:50 | designer@ | the decision page for Dinis (board/guidance/2026-11-06-decisions-as-pages.md, board/spec-decisions-pages.md): /newsroom/design/decisions/the-top-of-the-page/, today at v0.1.231 and A to D each on a phone and a desktop in the page, strengths, weaknesses, sherpa@'s six questions, the work, the recommendation (A with D's strip on the front page), what happens after | waiting: Dinis's answer | (designer's commit of this run) | part of 1 run |
| 12:50 | sherpa@ | the four tops A to D read as a cold reader, for the decision page; live re-measured (v0.1.242) | verdict: A on every page, the days strip added under A's rows (not instead of them) on the front page and summit pages; B second; C not before Monday; live: no change since 06:30 (board/team/sherpa/review-2026-11-06-1230-the-top-a-to-d.md) | (this commit) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| The masthead's credit and Newsroom link must not reveal sign-in state or a person's name to a reader looking over a shoulder; the 'who are you' marker stays as small as today | security@ (pre-review) | designer@, dev@ | condition of go |
| Mock-ups are images of public pages only: no signed-in view, no observability pane, no real reader data | security@ (pre-review) | designer@ | condition of go |
| T1 On a phone, 6 of 8 sections are hidden in a 138 px sideways strip beside four buttons; only Now and Agenda show, a tap on Companies lands on a button (blocking) | sherpa@ (review) | designer@ (layout), dev@ | open (conductor) |
| T2 On a phone there is no Newsroom link in the top: the dateline's Newsroom and Sign in are hidden below desktop width; the only link is in the footer | sherpa@ (review) | dev@ | open (conductor) |
| T3 The top is 35% of a phone's first screen (230 of 664 px; the front page's first headline at 460 px) and 25 to 33% of a desktop's; the logo is centred | sherpa@ (review) | designer@ | open (conductor) |
| T4 'Powered by RiskMandate' in the masthead of all 9 pages, with no word on what it is | sherpa@ (review) | dev@ (template), designer@ | open (conductor) |
| T5 The card's tagline 'People and AI agents, reporting together.' is on no page; the edition can move to the dateline | sherpa@ (review) | designer@ | open (conductor) |
| T6 The credit is the third of five pills on a desktop, not top right; on a phone a bare '£5.00' reads as a price, not a credit (pounds or euros: Dinis's call) | sherpa@ (review) | designer@ (place, label), dev@ | open (conductor) |
| T7 The Vault button is on every page, phone and desktop | sherpa@ (review) | dev@ | open (conductor) |
| T8 The theme picker holds a slot on the top row (an unlabelled half-moon on a phone): move to the footer or the menu | sherpa@ (review) | designer@ | open (conductor) |
| T9 On a phone the article lays out 591 px wide (an SVG) and the synthetic page 438 px (a table): the page and its top pan sideways | sherpa@ (review) | dev@; synthetic@ (the table) | open (conductor) |
| T10 The desktop front page's two boxes beside the logo: keep 'Independent ... our disclosure' as one line on every size, drop the boxes | sherpa@ (review) | designer@ | open (conductor) |
| T11 On a phone the floating Ask button covers the end of the lede | sherpa@ (review) | designer@ | open (conductor) |
| T12 On a phone Search is an unlabelled magnifier: a word would make it findable | sherpa@ (review) | designer@, with the search pass | open (conductor) |
| T13 The front page's h1 is visually hidden; the mock-ups should say in the first screen what this is | sherpa@ (review) | designer@ | open (conductor) |
| T1 re-measured at v0.1.152: worse, 1.5 of 8 sections visible on a phone since the profile button joined the row; Q5 (a Menu on a phone) is rank 1 | sherpa@ (re-measure) | dev@ | open (conductor) |
| T14 (rank 2, after T1) The new search box under the bar on every page: about 80 px more on a phone, placeholder cut ('Search: a company, a sess'), a second search beside the bar's magnifier; one search, one place | sherpa@ (re-measure) | dev@ (dev.search@), the search pass | open (conductor) |
| T15 (rank 1 for the decision page) The page's 'sherpa@'s six questions' lines are designer@'s reading, not mine, and I did not suggest a synthetic run on C: quote or link my verdict (board/team/sherpa/review-2026-11-06-1230-the-top-a-to-d.md) | sherpa@ | designer@ | open (conductor) |
| T16 (rank 2) D's phone mock-up drops the search and the section row for the days, and cuts its eighth day at 390 px: the strip goes under A's rows; the eighth day must fit | sherpa@ | designer@ | open (conductor) |
| T17 (rank 3) A shows both 'More' and 'Menu': one door | sherpa@ | designer@ | open (conductor) |
| T9 re-measured at v0.1.242: still open, the article page lays out 591 px on a 390 px phone and pans sideways | sherpa@ (re-measure) | dev@ | open (conductor) |
| T18 The reader's own area has three names ('You', 'Your profile', 'Sign in'): one entry after the credit, 'Sign in' signed out, 'You' signed in (ideas ledger SR-08) | sherpa@ | designer@ | open (conductor) |
