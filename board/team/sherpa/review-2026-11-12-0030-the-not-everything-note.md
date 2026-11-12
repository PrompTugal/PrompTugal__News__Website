---
title: "sherpa@: the 'not everything we held' note and the recovery page, read on a phone before the switch goes on"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
read: 2026-11-12T00:35Z, designer@'s pictures (design/decisions/not-everything/*phone*) and spec (board/spec-the-not-everything-note.md); the filter is built behind a switch, off at v0.1.1323
for: designer@ (who asked: 'read cold when built'), dev@, journalist@ (the words), the conductor (timing)
issue: WS-177
---
# The note and the recovery page, for the reader

A review of pictures before the build is switched on, so the words can change first. The decision to take websummit.com-only facts off is Dinis's (18:50, 11 November) and rests on the licence: not a reader's call, and not questioned here.

## What works (keep)

- **The note reads plainly:** 'Web Summit's licence does not let us republish data from its site, so on 11 November we took off what rested only on it. Every company here has another public source, cited on its page; the others come back as we find one. 61 of 120 shown. How items come back.' Sand with an ink rule, not an alarm.
- **The recovery page** says what came off, by kind, with counts and a route for one fact (came off, a shadow source, came back). Honest and short.

## What a reader loses, and when (for the switch's timing)

The recovery page's own counts: **People 285 of 285 come off; sessions and events 215 of 248; company facts 239 of 311.** If the switch goes on during Thursday 12 November, the summit's last day, an attendee who opens the Agenda tab, Thursday's day page or the app that morning finds most of the day's sessions gone, and the People page empty.

## Findings, ranked

| # | Finding | Owner |
|---|---|---|
| NE1 | **On the agenda, the day pages and the app, the note must say where the reader can still find the programme today**: 'Web Summit's own app and websummit.com/schedule have the full programme.' The note's only link, 'How items come back', is about our recovery, not about the reader's next hour. (A link to the official schedule is a link, not republishing.) | designer@, journalist@ (the words), dev@ |
| NE2 | **On the People page with 0 of 285 shown, the note is the page:** say why in its first line and what is still there (the companies, their sources), so the page does not read as broken | designer@, dev@ |
| NE3 | **Timing (for the conductor to put to Dinis if it is open):** switched on before the day starts, the app's 'My picks' lose sessions an attendee saved; the app's note should say that their picks were kept on their device, if they were (the app stores picks in the browser) | dev@, the conductor |

**03:35 (12 Nov, v0.1.1339):** designer@ took NE1 to NE3 into its spec (the 'Not the full programme' line naming Web Summit's app and schedule; the empty-page note for People; the picks line asked of dev@). The switch is still off, waiting on four items. Thursday morning ready: the home page leads with Thursday's practical guide; the app opens on Thursday's programme from 07:30.

## Live, after the switch (06:35 UTC, 12 November, the last day; v0.1.1355)

| # | Finding | Now |
|---|---|---|
| NE1 on the site | **done:** the Agenda and Thursday's page open with 'Not the full programme: The full programme is in Web Summit's own app and at websummit.com/schedule' (a link), in the first phone screen |
| NE2 People | **done:** 'The speaker list came from Web Summit's site, and its licence does not let us republish it, so all of it was taken off on 11 November.' first |
| Companies | the list's note and Cloudflare's 'Not everything' note are there (Cloudflare's below the first phone screen) |
| **NE5 (new, rank 1): the app on the last day says only 'Nothing matches on this day.'** | It opens on Thu 12 (Day 3) with an empty list and that one line, no note: it reads as a failed search or a broken app, at 06:30 on the summit's last day. Show the same 'Not the full programme' note in the app, with Web Summit's app and websummit.com/schedule, in place of 'Nothing matches' |
| NE4 | Thursday's page's standfirst still says '0 items in our programme on Thursday 12 November ... five things to plan around, every session by time and by stage', above a note that says the programme came off: drop the template line when a day has 0 items |
| NE3 picks | not seen (no saved picks in a fresh browser); dev@'s answer pending |

**09:35 (12 Nov, v0.1.1361 or later): NE4 and NE5 done.** The app's empty day now says 'Not the full programme. Web Summit's licence does not let us republish its schedule, so we show only the sessions with another public source. The full programme is in Web Summit's own app and at websummit.com/schedule.' in the first screen; Thursday's page now reads '0 items in our programme on Thursday 12 November ...: nothing from our programme is listed for this day; the full programme is in Web Summit's own app.' designer@ passed NE3 live (the picks line). Every way in (Agenda, the day page, People, Companies, the app) now tells the reader where the programme is, on the last day.
