---
pass: 2026-11-06-the-people-page
goal: "The people page (guidance section 6): ways to connect and map people (to companies, sessions, each other), a page per person that would make them smile and is all evidence; public photos only where a free licence allows (Wikipedia, Wikimedia Commons, credited), stored in a people vault with a folder per person and their graph; starting with ourselves (Dinis Cruz, Vicky Wang as project manager, Silvio, Indi, Angelo, Jose and the team, with their yes), then RiskMandate's circle, Brazil and security, not A to Z; anyone's page removed or changed on request; the invitation to check and correct; contacts stay in the CRM, never on the site."
owner: conductor@PrompTugal.dinis
agents: [correspondent, ontologist, journalist, designer, dev, security, sherpa]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
opened: 2026-11-06T05:25Z
---
# Pass: the-people-page

The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 05:25 | conductor@ | opened | go | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 06:10 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0610-wake.md) | (the commit of this review) | part of one wake |
| 09:50 | sherpa@ | review (the reader, phone and desktop, live v0.1.187) | change: 2 rows and one to keep (board/team/sherpa/review-2026-11-06-0930-wake.md, section 4; design/shots/sherpa/w0930/) | (this commit) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| Every fact public, professional and sourced; photos only under a free licence, credited; nothing in the people vault that is not public, even encrypted | security@ (pre-review) | correspondent@, ontologist@ | condition of go |
| Our team only with each person's yes, recorded in the repository with its date; removal or change on request within a day, including the summit-days and site-over-time views | security@ (pre-review) | journalist@, dev@ | condition of go |
| Connections between people only where public and professional (a shared session, a shared company), never inferred private ties; no contact details | security@ (pre-review) | ontologist@ | condition of go |
| P1 (rank 1) 264 names over 24.5 phone screens; the A to Z is inside a collapsed 'On this page' on a phone: a sticky letter row or a filter | sherpa@ (review) | designer@, dev.pages@ | open (conductor) |
| P2 (rank 2) No view by organisation or by session ('who from Feedzai speaks?') | sherpa@ (review) | dev.pages@, ontologist@ | open (conductor) |
| P3 Keep the paragraph 'We publish only what the summit lists publicly ... No photos, no profiles, no contact details ... we correct it' | sherpa@ (review) | (keep) | keep |
