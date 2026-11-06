---
title: "The summit's days, round 1: the strip, a past day, a future day; what dev@, the correspondent and the historian build"
by: designer@PrompTugal.dinis (session 2)
written: 2026-11-06T06:55Z
pass: board/passes/2026-11-06-the-summit-days.md (round 1, proposals)
for: Dinis (go or change), dev@ and dev.pages@ (the strip, the views), correspondent@ (five things a day), historian@ (the release at each day's end), security@ (removals honoured)
issue: WS-177
---
# The summit's days, round 1

Mock-ups (today, past, future; phone and desktop): the designer's vault `bar9wi87`, `summit-days/round-1/`, and the before and after page `before-after/summit-days-round-1/` (linked from /newsroom/design/summit-days-round-1/). Made with `node design/mockups/days/make.mjs`.

| # | What | Need | Owner |
|---|---|---|---|
| S1 | The strip: eight days, Fri 6 to Fri 13 November; each cell weekday, date, label (Today, Opening, Day 1 to 3, After); today filled ink, the summit days tinted, the day being viewed ringed in red; "Earlier days" for before the 6th. Phone: under the top bar, eight cells of about 44 px; desktop: a block at the top of the right column, "Web Summit Lisbon · the days". Same place on every page | D1, D5 | dev@ (a feature in the shell, from `data/site/site.json` countdown dates) |
| S2 | A past day at `/days/2026-11-05/` (and each day before today): the site as built from the last release of that day (from `newsroom/versions.json`, the last row of the date), with the clock frozen at 23:00 UTC that day (the build's TODAY, and the page's date script disabled), under a banner: "The past · <day>. This is PrompTugal.news as it was at the end of that day: release vX. Today is <today>. Back to today · What changed since" | D2, D6 | dev@; historian@ for the day-to-release map |
| S3 | Removals: an old release rebuilt for the time view applies today's corrections and removals list before it is served (no removed name or fact comes back) | security@'s condition | dev@, security@ to review |
| S4 | A future day at `/days/2026-11-10/`: "Planned · <day> · as listed on <today>. Times and rooms can move; each item links to its source"; five things (the correspondent's pick, in `data/front/days.json`), then "All N events" collapsed | D3, D4 | correspondent@ (the five), dev@ |
| S5 | Today: the day's things, then "Next" (the next two or three dated items) | D4 | dev@, correspondent@ |
| S6 | No personalisation | D7 | until a pass with security@ |

The past view was proven here: v0.1.37 rebuilt from its tag (`git worktree add <dir> v0.1.37 && node admin/build/build.mjs`; the build was under `admin/` then) and rendered with Playwright's clock fixed at 2026-11-05T23:00Z.
