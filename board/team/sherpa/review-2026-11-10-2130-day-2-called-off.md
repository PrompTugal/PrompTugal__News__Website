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

## Re-measured (00:35 UTC, 11 November, v0.1.1111), before attendees wake

| # | 21:35 | 00:35 |
|---|---|---|
| W1 Wednesday's page said 'what is on' | open (rank 1) | **done:** 'Wednesday 11 November: called off', the notice in the first phone screen, the programme kept below as the record |
| W2 the strip showed Wed 11 as normal | open | **done:** 'Wed 11 · Called off' in the strip on /days/, Events and Wednesday's page |
| W3 /days/ and Events silent | open | **done** through the strip ('Called off' in the first or second screen) |
| W4 the app's 'DAY 4' | open | **done:** Fri 13 has no 'Day 4' |

**New, W6 (rank 1 now): the app opens on the called-off day as if it were on.** At 00:30 on Wednesday the app selects Wed 11 (struck through in the day row) and lists its programme from 09:24 with 'Add' on every item; its notice ('Web Summit cancelled Day 2 ...') is in the app but not on screen. An attendee who opens the app this morning sees a full programme with Add buttons. On a called-off day: the notice first, the items greyed with no Add, and a link to Thursday (or open on Thursday). Owner: dev@.

The home page's lead was last checked at 23:52 UTC: good.

## Re-measured (03:35 UTC, 11 November, v0.1.1142)

- **W6 done:** the app now opens on Thursday 12 (Day 3); tapping Wed 11 shows the notice first ('Web Summit cancelled Day 2 ... The picks are kept as the record of what was planned.') with 'Thursday 12 ›'. Left, minor: Wednesday's 58 items still have a live 'Add' (greying them would match the notice).
- **R5 done** (from the Day 1 review): the interviews band is back on the home page (1,068 px on a phone).

Every finding of the called-off day (W1 to W6) is done for the reader within eight hours of the announcement.

## The home page at midday on the called-off day (12:35 UTC, 11 November, v0.1.1231)

Dinis at 10:00: the storm and today lead the home page; the storm site as a main source. On a phone the first screen now has a 'live sources' strip ('LIVE SOURCE · updated 12:30 UTC · Storm Charles: the weather, now', storm-charles.promptugal.news; 'NEW · Lisbon Fringe', fringe.promptugal.news), then the lead ('Last checked 11:33 UTC', 'it aims to hold Day 3 on Thursday'). Interviews and the GAMMA-Ray Spectrum follow; 13.9 phone screens. Works for an attendee today.

Two small things:
- **W7:** the headline is still yesterday's news ('Web Summit calls off Wednesday on the government's advice'); at midday on Wednesday a reader's question is Thursday: put Thursday's status in the headline ('Wednesday off; Web Summit plans Day 3 on Thursday') and update it when Web Summit confirms. Owner: correspondent@.
- **W8:** 'NEW · Lisbon Fringe' says nothing of what it is; three words ('the week's side events') would let a reader decide to tap. Owner: dev@.

## Re-measured (15:35 UTC, 11 November, v0.1.1259): Thursday confirmed

The lead's text now says Web Summit 'said it is officially back on Thursday for its final day' (last checked 14:45 UTC), and the live sources strip says what the storm site is ('Warnings, decisions and the timeline ... Not a warning service: follow IPMA and ANEPC'). **W7 still open, and now sharper:** the headline still reads 'Web Summit calls off Wednesday on the government's advice' while the news a reader needs is that Thursday is on; a reader who skims headlines (or a link preview) gets yesterday. Make it 'Web Summit is back on Thursday after Storm Charles' (or the like).
