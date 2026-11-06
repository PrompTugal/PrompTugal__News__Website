---
title: "Spec check: the live front page at v0.1.347 against the approved A (with C's top)"
by: designer@PrompTugal.dinis (session 2)
checked: 2026-11-06T21:30Z, https://promptugal.news/ at v0.1.347, Chromium at 1280 px and 390 px, cache bypassed
against: design/decisions/the-front-page/A--*.jpg (front page round 2, Dinis's answer A) and design/decisions/the-top-of-the-page/answered--*.jpg (C with D's strip)
asked: conductor@, relaying Dinis at 21:00 UTC ("the live front page does not look like the approved mock-ups")
for: dev@PrompTugal.dinis, dev.pages@PrompTugal.dinis
issue: WS-177
---
# The live front page against A: eleven differences

Side by side: `design/decisions/the-front-page/check-v0.1.347--desktop.jpg` (live left, approved right) and `check-v0.1.347--phone.jpg` (the first 3,200 px of the phone page). The page reads as the right brand but the wrong order: the approved page is *one lead, then Latest with pictures and agent bylines beside it, then why we are different*; the live page is *a mandate box, the lead, then a long programme listing*, and the news sits below it.

| # | Where | Live (v0.1.347) | Approved (A, with C's top) | Owner |
|---|---|---|---|---|
| F1 | under the top, front page | **no band.** | one band under the top: "Every fact links to its source, with the date we read it · Written by AI agents, edited by Dinis Cruz, Indi Gupte and Vicky Wang · Independent of Web Summit · our disclosure" (spec P7) | dev.pages@ |
| F2 | above the lead | a mandate box ("Our mandate: to map the universe of AI in Portugal...") | none above the lead; the mandate lives in "Why we are different" (F7) | dev.pages@ |
| F3 | the strip of days, desktop | squeezed into the right column (343 px), "Opening" breaks as "Openin g" | full width under the top, one row, eight days, today in ink (answered top) | dev@ |
| F4 | the strip of days, phone | under the lead at 835 px, 485 px wide in a 358 px box: three days hidden behind a scroll | directly under the top (before the lead), all eight days visible at 390 px (two-letter day, the date, a dot for items) | dev@ |
| F5 | the right column opens with | **Now and next** as a long programme: a day's text, then each event of Friday to Monday with times and "Add to my day" buttons (Latest starts at 913 px on desktop, 3,010 px on a phone) | **Now and next in three lines** (today, and the next two moments, each one line), then **Latest** | dev.pages@ |
| F6 | Latest | headline, summary, then the kicker below it; no picture on most rows; **no byline** | per row: a 96 px picture, the kicker *above*, the headline, then the byline naming the agent in words, one line on a phone ("the Europe desk, an AI agent, for Vicky Wang"; the address stays on the article, sherpa@'s F9); no summary (P2, F35: a byline never hides an agent) | dev.pages@ |
| F7 | after Latest | "Our question" at 7,645 px on a phone, after the whole programme | **Why we are different** (reach, mandate, gap, with the mandate from F2) directly after Latest on desktop; on a phone after the lead and the three lines of now and next (synthetic@'s F7 with sherpa@'s F10: now and next stays right after the lead) | dev.pages@ |
| F8 | under the lead, desktop | nothing beside or under the lead but its summary | two second stories with pictures under the lead (A) | dev.pages@ |
| F9 | the end of the page | "Around the summit, next", a second programme block | gone: the programme is the Agenda tab and the day pages (P3, F5) | dev.pages@ |
| F10 | the lead | the economic-impact story (fine: the correspondent picks the lead) with its byline in grey 12 px under the summary | as now, but the byline reads "the journalist, an AI agent · 4 min · signed", the same form as Latest | dev.pages@ |
| F11 | the phone page | 12,493 px long | about 6,000 px: the strip, the lead, three lines of now and next, why we are different, Latest (eight rows), Portugal, companies | follows from F5, F7, F9 |

**Already right** (no change): C's one-row top with the tab bar on a phone; **one search on a desktop** (the bar's field; the two other search boxes are hidden at both widths: fixed since my v0.1.298 check); the AI infographic as the lead picture; kickers in green capitals; thumbnails on the rows that have them.

**Order of work, if dev@ wants one:** F5 and F9 (the most visible, and they fix F11), then F6, F1, F2 with F7, F3 with F4, then F8 and F10.

**When they are fixed** I post a before and after (this release's screenshots in the vault, `before-after/front-page-v0.1.347/`, are the "before"), as /newsroom/design/ does for every design release.
