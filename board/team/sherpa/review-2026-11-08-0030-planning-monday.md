---
title: "sherpa@: the attendee on Sunday night, planning Monday (Opening Night) on a phone (v0.1.677)"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
measured: 2026-11-08T00:35Z, live site v0.1.677
how: Playwright with Chromium, iPhone 13 profile (390 x 664) and 1440 x 900; the Agenda tab's page, /summit/, /days/2026-11-09/, /events/opening-night/; screenshots in design/shots/sherpa/2026-11-08-0030/
for: board/passes/2026-11-06-the-summit-days.md
issue: WS-177
---
# Planning Monday, the night before

A review, not user research. The persona: an attendee in a Lisbon hotel on Sunday night, phone in hand, who wants to know what to do tomorrow (Monday 9 November: registration, then Opening Night at 18:00).

## What works (keep)

- **Monday's day page (`/days/2026-11-09/`) is exactly what they need:** 'Monday 9 November: what is on', 4.8 phone screens, a dated note ('Planned ... as listed on Sunday 8 November. Times and rooms can move'), 'Five things' with time, end, place and kind (07:30 registration at the airport, 18:00 Opening Night at Centre Stage, the 20:00 meet-and-greets), 'Add to my day' on each, '22 more' one link away, and 'Earlier: Sunday' / 'Later: Tuesday' at the foot.
- **Opening Night's own page** answers the question in its first sentence ('Monday 9 November, 18:00 to 20:00, Centre Stage, MEO Arena and FIL') with 'Add to my day' above it.
- **The days strip** marks Sun 8 'Today' and Mon 9 'Opening' on the summit page and the day page.

## Findings, ranked

| # | Finding | Owner |
|---|---|---|
| A1 | **The Agenda tab does not lead to the day.** It opens 'Events' (`events/index.html`): 51.5 phone screens, a first screen of introduction ('Every event we know of ... Two lists, kept apart'), no days strip and no 'tomorrow'. The reader has to know to go to the summit page, find the strip and tap Mon 9. From now to Thursday, the Agenda tab should open today's day page (or tomorrow's after the day's last item), with the full list one link away; at least, put the days strip and 'Today / Tomorrow' at the top of Events | dev.pages@, dev@ |
| A2 | **The reading meter at the foot of every page reads as a bill:** 'This page 0.1p of 1p · read 5% · Balance £5.00 · Rate it, or do not pay for it', and the header pill shows £5.00 on one page and £4.99 on the next. An attendee planning their day does not know what they are paying for, in pounds, in Lisbon. Say once what it is (a reading credit, nothing charged) or keep it to the reader's account page; the currency is Dinis's question | designer@, dev@, Dinis |
| A3 | **The default home page is now 15.8 phone screens** (it was 14.4), led by 'Plan your week by field'; the night before Opening Night, the first screen does not say 'Tomorrow: Opening Night, 18:00' (the countdown designs E, G, D do) | correspondent@, dev@ |
| A4 | **The drawing on an event page** (Opening Night's place in the graph) has labels of about 6 px on a phone; for an attendee it is decoration under the facts. Fine to keep below the facts; no change needed unless it grows | (none) |
