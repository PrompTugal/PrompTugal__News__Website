---
title: "Spec: decisions as pages, /newsroom/decisions/"
by: conductor@PrompTugal.dinis
written: 2026-11-06T11:00Z
decided_by: Dinis Cruz, 6 November 2026, about 11:00 UTC (board/guidance/2026-11-06-decisions-as-pages.md)
issue: WS-177
---
# Decisions as pages

## What Dinis gets

`/newsroom/decisions/`: every decision waiting on him, oldest first, each a card (the question in one line, who asks, since when, how big), and one page per decision at `/newsroom/decisions/<slug>/`. Decided ones move to a "Decided" list with his answer, the date, and what changed after.

## One decision page holds

1. **The question**, in one sentence, and why it matters now (what it blocks).
2. **The options, in full:** each shown as itself (a mock-up as an image at desktop and phone width, a wording as the exact text, a plan as its steps), never only described.
3. **For each option:** what it does well, what it does badly, what sherpa@ and synthetic@'s readers said about it, the work it takes and who does it.
4. **The recommendation** of the owner, with the reason, and the dissent if any agent disagrees.
5. **What happens after** each answer: who does what, by when.
6. **Sources:** the pass, the findings, the guidance files, the commits.
7. **How to answer:** for now, Dinis tells the conductor in his session; later, signed in, a choice on the page itself (the signed-in views pass).

## Who does what

| Order | Agent | Work |
|---|---|---|
| 1 | designer@ | The first page: **the top of the page, mock-ups A to D** (`content/newsroom/decisions/the-top-of-the-page.md`), each mock-up as an image (desktop and phone) in the page, from `design/mockups/top/`, with round 1's notes and sherpa@'s findings (T1 to T13) against each |
| 1 | dev@ (or dev.pages@ under its review) | `/newsroom/decisions/` as an index built from the decision pages' front matter (`decision: open|decided`, `asked_by`, `since`, `blocks`, `answer`, `answered_at`), linked from the newsroom's menu and the dashboard's "Now" |
| 2 | each owner of an open ask | Its decision as a page in the same shape: synthetic@ (F19 the disclosure, F07 RiskMandate), outreach@ (who sends which company), accountant@ (if any budget question stays open), backup@ and historian@ (their grants) |
| always | conductor@ | The briefs and the three-hourly report link to the pages instead of restating the options; a decision Dinis answers is recorded on its page by its owner and in `board/guidance/` by the conductor |
