---
title: "The list pages and the summit's days: what I check when dev.pages@ builds them"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-09T02:50Z
for: dev.pages@PrompTugal.dinis (builds), dev@PrompTugal.dinis (reviews)
from: board/briefs/2026-11-09-the-mockups-vs-the-live-site.md (step 3 is mine); the decisions content/newsroom/design/decisions/the-list-pages.md and the-summit-days.md (Dinis, 6 November, 13:20 UTC: "just implement it all"); the summit set (board/guidance/2026-11-09-the-summit-set.md)
pictures: design/decisions/the-list-pages/, design/decisions/the-summit-days/, and the brief's side-by-sides
issue: WS-177
---
# The list pages and the summit's days: the acceptance check

Written before the build, as for mock E, so it is built to a short list and my check at each wake is a table. Every row: desktop 1440 px and phone 390 px, light and dark.

## Every list page (companies, people, articles)

| # | Pass when |
|---|---|
| L1 | **A real switch**, three views, one tap each; the view kept in the address (`?view=`) and in the reader's browser only; not anchor links to sections of one long page |
| L2 | **The default view** as decided: companies **by field**, articles **the wire**, people **by organisation** |
| L3 | **Cards, not a text list:** companies with a monogram (brand ink, red, green; logos later from a vault), name, field, country; people with name, role, organisation (no photo until the people vault); articles with the `--paper--thumb` picture, kicker, title, summary and byline in words |
| L4 | **Search with a live count** ("120 of 120", "12 of 120" as you type), and on companies a field filter; no empty unlabelled box |
| L5 | **Length:** the default view of each page under about 6 phone screens before "more" (today: companies 16,500 px, people 29,700 px on a phone) |
| L6 | The site's contract: C's top, the tab bar on a phone, no sideways scroll, nothing under 12 px, targets 24 px, the markdown twin |

## The summit's days

| # | Pass when |
|---|---|
| D1 | **The strip of the eight days** (Fri 6 to Fri 13) on the summit pages, today marked, each day a link to its own page, all eight visible on a 390 px phone (wrap or scroll with a cue) |
| D2 | **A page per day** (`/summit/<day>/` or `/events/<day>/`); `/events/` becomes the week's overview, not 34,000 px of every event |
| D3 | **Three views of a day** with the same switch as the list pages: A a timeline, B stages in columns, **C by default: five things first**, the rest folded under "Everything else today (N)" |
| D4 | **The five things are the correspondent's pick** (`data/front/days.json`), not the first five by time; when the pick is empty, say "The five are picked by the morning" rather than inventing them |
| D5 | Each item: time, title, place with its region ("Lagos, Algarve"), kind; "Add to my day" as a small text button on the meta line |
| D6 | Past days as they were (later, with security@'s review of removals); future days from the events data |

I check against the decision pictures at the first wake after each page ships, and record the result under it here.

## Check at v0.1.782 (04:45 UTC, 9 November): the list pages

Read live at 390 and 1440 px (`design/decisions/the-list-pages/check-v0.1.782--phone.jpg`: companies, people, articles).

| # | Companies | People | Articles |
|---|---|---|---|
| L1 switch | pass (By field, By country, A to Z), but below four paragraphs of prose on a phone | **pass**: a segmented switch, then search | **pass** (sherpa@'s one-letter-per-line fixed, 13c87d0471) |
| L2 default | pass: by field | pass: by organisation | pass: the wire |
| L3 cards | pass: 120 cards (monograms not seen in the first screen) | pass: 275 cards, name, role, organisation, sessions | pass: thumbnail, title, summary, kicker, byline |
| L4 search, count | pass (live region) | **pass**: "275 of 275" beside the box | no search on the page (the site's search is one tap away); fine |
| L5 length | **fail**: about 25 phone screens (21,175 px) | **fail**: about 43 (36,509 px) | 16 (13,554 px) |
| L6 contract | pass (no sideways scroll) | pass | pass |

**For dev.pages@, in order:** (1) L5: show the first 6 groups (companies by field, people by organisation) folded to their first 3 cards with "All 30 in security" to open the rest, so a phone reaches every field in a few screens; (2) on companies, the switch and search above the prose: move the four paragraphs under the list or behind "About this list".

## Re-check at v0.1.808 (08:40 UTC): the list pages pass

After dev.pages@'s L5 work (dev@'s 6a672799b8, 6c824d25f1): on a phone, companies 8.7 screens (was 25), people 6.6 (was 45), articles 6.9; on a desktop 5.0, 3.7 and 4.0. Companies now opens with one sentence, then the switch, search, a field filter and "120 of 120", and monogram cards ("1P"); people "285 of 285". **L1 to L6 pass on all three** (`design/decisions/the-list-pages/check-v0.1.808--phone.jpg`). Next: the day pages (D1 to D6), when they ship.

## Check at 10:45 UTC, 9 November: the summit's days

Read live on a 390 px phone (`design/decisions/the-summit-days/check-2026-11-09-day--phone.jpg`: Tuesday 10).

| # | Result |
|---|---|
| D1 strip | **pass**: on the summit and day pages, today marked, each day a link; six of eight in view on a phone, the seventh cut at the edge as the cue to scroll |
| D2 a page per day | **pass**: `/days/<date>/` (Tuesday 10: 76 items, 3.9 phone screens). **Open:** `/events/` is still every event on one page (34,383 px, about 40 phone screens); make it the week's overview (the strip and each day's five, as `/days/` does) and keep the full list one tap away |
| D3 three views | **pass**: "Five things" (default), "Every session, by time", "By stage"; the rest folded under "Everything else on this day (71)" |
| D4 the correspondent's five | **pass**: from its `day_picks` (desks/correspondent/front-page.json), marked "Our pick"; an unpicked day says "The five are picked by the morning" |
| D5 items | pass: time, title, until, the stage linked, kind |
| D6 past days | not checked yet (the summit starts today) |

**Re-check at 12:40 UTC:** `/events/` as the week's overview (dev.pages@, 92440941b7): 10,201 px on a phone (about 12 screens, was 40), opening with the strip and "Today, Monday 9 November →" and "Tomorrow, Tuesday 10 November →", then the official programme and the other events kept apart. **D2 passes.** The day pages' D1 to D5 all pass; D6 (past days) from tomorrow.
