---
title: "The summit's days in time, from the reader's side: sherpa@'s review for the pass the-summit-days (round 1: proposals)"
by: sherpa@PrompTugal.dinis
written: 2026-11-06T04:50Z
pass: board/passes/2026-11-06-the-summit-days.md
against: board/guidance/2026-11-06-front-page-timeline-publication.md, section 2 (Dinis's words)
measured_on: https://promptugal.news/summit/ and /summit/agenda.html, v0.1.94; phone = iPhone 13 profile (390 x 664); desktop = 1440 x 900
issue: WS-177
---
# The summit's days

Round 1 is proposals only, so this review says what exists, and what a reader needs from any proposal. Not a design.

## What exists

- **The agenda already thinks in days.** `/summit/agenda.html` has a list of eight days, Thursday 5 to Thursday 12 November, with "(past)" and "(today)" in the headings: the seed of Dinis's block. But it is a bulleted list at the top of one very long page (74 screens on a phone, 26 on a desktop; Tuesday alone is 20 phone screens), "today" is a word in brackets, not a highlight, Thursday 5 (past) still comes first, and there is no day after the summit (13 November).
- **`/summit/`** (When, Where, Find your way, Coming next; 5 phone screens, no picture) has no days block at all.
- **The front page** has none either: Now and next runs Friday, Saturday, Sunday as headings in a list (front page review, F3).
- The site keeps every release (versions.json, a tag each, v0.1.94 now), so "the site as it was that day" has its raw material.

## What a reader needs from any proposal

| # | Need | Why (the reader) | Owner |
|---|---|---|---|
| D1 | **The days as one strip, all visible at once on a phone**: Fri 6 to Fri 13 is eight days; eight short chips ("Fri 6") fit in 390 px. Before, the summit (9 to 12) and after should be told apart at a glance, and today unmistakable (filled, not a word in brackets). | An attendee checks "what is on today, tomorrow" on a phone in a queue; a strip is one tap, a list is a scroll | designer@ |
| D2 | **A past day must say it is the past, loudly.** "You are reading Saturday 7 November as it was. Today is ..." at the top of every snapshot, with a way back to today. Otherwise a reader who lands from a search reads old logistics as current. | A reader from a search or a shared link does not know which day they are in | designer@, dev@ |
| D3 | **A future day must say it is planned**, not news: "What is planned for Wednesday 11, as listed by Web Summit on [date read]; times may change", each item with its source, as the agenda does now. | No one should be told a talk "happened" before it does; the site's rule is every fact sourced | correspondent@ (the day's page), dev@ |
| D4 | **Each day short.** A day page is that day's front page: the three to five things that matter, then "every item for this day" collapsed. Tuesday's 20 phone screens of agenda are a reference, not a page. | 20 phone screens for one day loses everyone | correspondent@, designer@ |
| D5 | **The same strip everywhere it appears** (front page block, /summit/, the agenda, each day page), at the same place, so it is learned once. On a desktop, Dinis's "block on the right"; on a phone, the strip under the top bar, not after the lead. | Consistency is what makes "go back and forward in time" feel like one newsroom, not several pages | designer@ |
| D6 | **The snapshot of a past day is the site of that day**, not today's site filtered: the historian and dev@ should say which release is "the site at the end of Saturday 7" and that is what is shown. | Dinis: "show what the website looked like at that moment in time" | historian@, dev@ |
| D7 | Personalisation (later, his word): when it comes, the reader must be able to see why something is shown and turn it off, and nothing that identifies them may be kept (observability@'s rule). | Trust, for the CISO and journalist this site wants | observability@, later |

**Keep:** the agenda's honesty line ("each read at its public source ... times may change: check the summit's own schedule before you go"); every day page should carry it.
