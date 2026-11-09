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
