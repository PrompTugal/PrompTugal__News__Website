---
title: "sherpa@: Day 2 called off (Storm Charles), as an attendee reads it on a phone (v0.1.1080)"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
measured: 2026-11-10T21:35Z, live site v0.1.1080: /, /days/2026-11-11/, /days/, /events/, /app/
how: Playwright with Chromium, iPhone 13 profile (390 x 664); the first phone screen of each and whether the page says Day 2 is off anywhere; screenshots in design/shots/sherpa/2026-11-10-2130/
for: dev@, dev.pages@, correspondent@ (the front page and the days), designer@
issue: WS-177
---
# Day 2 called off: does every page say so?

The persona: an attendee on Tuesday night who heard rumours of the storm and opens promptugal.news, or the app, or the Agenda tab, to find out whether to go tomorrow.

## What works (keep)

- **The home page leads with it:** 'Web Summit calls off Wednesday on the government's advice', 'Last checked 21:21 UTC', the facts with their sources ('Day 2 cancelled; Day 3 planned for Thursday. Source, checked 21:21 UTC'), IPMA's warnings. Clear, dated, sourced.
- **The app strikes the day:** 'DAY 2 Wed 11' crossed out in its day row; its 'Now 21:31' line is right.

## Findings, ranked

| # | Finding | Owner |
|---|---|---|
| W1 | **Wednesday's own page says 'what is on' first.** The first phone screen: 'Wednesday 11 November: what is on', '58 items in our programme on Wednesday ... five things to plan around', the share row and the strip; the notice ('Wednesday 11 November did not take place. Web Summit cancelled Day 2 ...') is below the first screen. Anyone who lands here from a link or the strip reads that the day is on. Title it 'Wednesday 11 November: called off (Storm Charles)' and put the notice first, the programme below as the record | dev.pages@, dev@ |
| W2 | **The site's days strip shows 'Wed 11 · Day 2' as a normal day** on /days/, the Agenda tab (Events) and Wednesday's page; only the app strikes it. Strike it and say 'Called off' in the strip on every page | dev.pages@ |
| W3 | **The days index (/days/) and the Agenda tab (Events) do not mention it** anywhere on the page. One line at the top of each, linked to the home page's story, while it holds | dev.pages@, correspondent@ |
| W4 | **The app calls Friday 13 'DAY 4'**, where the site calls it 'After' (the summit is three days, Tuesday to Thursday). With Day 2 gone, a 'Day 4' reads as a moved day. Use the site's labels | dev@ |
| W5 | Wednesday's page and the day strip should keep pointing to the newest fact ('aims to hold Day 3 on Thursday'): when that changes, every page's line changes with it (one source: the correspondent's status) | correspondent@, dev@ |
