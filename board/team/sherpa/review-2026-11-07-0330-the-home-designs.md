---
title: "sherpa@: the home page's eight designs, read cold on a phone and a desktop (v0.1.426)"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
measured: 2026-11-07T03:35Z, live site v0.1.426, https://promptugal.news/?design=today, a, b, c, d, e, f, g
how: Playwright with Chromium; phone = iPhone 13 profile (390 x 664), desktop = 1440 x 900; tap reach by elementFromPoint at each link's centre; first phone screens side by side in design/shots/sherpa/0330/
for: the home page's picker (board/briefs/2026-11-06-front-page-mock-e.md, step 3: sherpa@ and synthetic@ read it cold), board/passes/2026-11-06-the-front-page.md
issue: WS-177
---
# The eight home designs, read cold

A review, not user research: what a cold reader meets in the first phone screen (a founder who got our e-mail, an attendee on the metro), measured. The choice is Dinis's; this is the reader's side of it.

## The first phone screen, design by design

| Design | What a cold reader sees first (390 x 664, under the tab bar) | A story in the first screen? | Phone screens |
|---|---|---|---|
| today (the default) | the credit and Ask, the tagline, the disclosure paragraph, the days strip, the lead image; the headline under the tab bar | no | 14.4 |
| A, The Edition | the date and countdown, nameplate, the Ask box and three suggested questions, Now and next | no | 8.1 |
| B, Summit Live | nameplate, My day and Ask, a live desk bar (31 stories, 215 events, 120 companies), the Ask box, the days strip, section buttons, Today and next | no | 6.7 |
| C, The Atlas | nameplate, 'The universe of AI in Portugal, mapped', the Ask box, the numbers | no (the site's promise, not a story) | 12.2 |
| D, The Brief | nameplate, 'Get the daily', the date, a one-line brief, **the lead's headline**, its image | **yes** | 7.1 |
| E, The Front Page | date and countdown, nameplate, **the lead's section, headline, standfirst, by-line and pill** on the dark band | **yes** (the fullest) | 8.0 |
| F, Signal | nameplate, 'What matters in AI in Portugal, right now', the Ask box, the numbers and countdown, the ticker | no | 8.2 |
| G, The Magazine | nameplate, the edition line with the countdown, 'The universe of AI in Portugal, mapped', **three headlines** (cover story, Portugal, Brazil) | **yes** (three) | 7.3 |

**For the reader:** someone who arrives from our e-mail or a link needs to see in one screen that this is a newspaper with real stories: E, G and D do that; A, B, C and F lead with an Ask box, which asks the reader to do the work before showing them anything. During the summit (9 to 12 November) an attendee needs today's programme first: B, then A, do that best. So: **E or G for the cold reader; B for the attendee on the day.** All seven new designs are shorter on a phone than the default (6.7 to 12.2 screens against 14.4).

## Findings, ranked

| # | Finding | Designs | Owner |
|---|---|---|---|
| H1 | **The picker button still covers text on a phone** (N1, now folded): a 40 px round button fixed at 548 px on the right edge, over the end of a line in every screen ('(b...' in A's Now and next, 'Lag...' in B's, the lead image in E). Smaller than at 00:35, still on top of the page. Move it into the tab bar's More, or above the page's end only | all | dev@ |
| H2 | **Now and next leads with 'DevFest Lagos 2026' and no place:** it is Lagos in the Algarve (`data/events/devfest-lagos-2026/event.json`: 'Lagos, Algarve'), but the line does not say so, and a reader (as I did at 23:00) takes it for Nigeria. Show the place on each line ('Lagos, Algarve'), from the data all designs share | A, B, E, F | dev@ (lib/home.mjs), correspondent@ |
| H3 | **D's countdown is cut on a phone:** 'Opening Night in' with no number (E3, fixed on E, is back on D) | D | dev@ |
| H4 | **F's ticker starts mid-item** on a phone ('30 Registration...'): E7, fixed on E, is back on F | F | dev@ |
| H5 | **The lead carries four kickers** ('The summit, practical guide, transport, registration'; D adds 'The big one'): one section is enough (E5) | D, E, today | dev@, ontologist@ |
| H6 | **Small type and small targets on A, B and F:** 25 to 32 lines under 12 px in the first two phone screens on A and B; 9 targets under 24 px on F's phone, 21 on its desktop | A, B, F | designer@, dev@ |
| H7 | **The default still shows '£5.00 credit'** in the first phone screen, before any story (the pounds-or-euros question is with Dinis) | today | designer@ (where), Dinis (the currency) |

E's own, from the 23:00 review: E2 (the section row cut on a phone) is **done** (no row on a phone now; the tab bar carries the sections). E10: the phone picture for the lead is in designer@'s check of v0.1.400; I measure it next with a full-page read.

Correction to my review of 23:00: I called DevFest Lagos 'Nigeria'; it is Lagos in the Algarve. Corrected in `review-2026-11-06-2300-mock-e.md`; the finding (show the place) stands as H2.

## Re-measured (06:35 UTC, v0.1.456)

First phone screens side by side: `design/shots/sherpa/0630/`. designer@ answered H6 and H7 with selectors in `board/spec-home-page-designs.md` section 9 (its inbox note, 03:41), for dev@.

| # | 03:35 | 06:35 |
|---|---|---|
| H1 the picker button over the page | open (rank 1) | **done:** no fixed button on any design; on the default it is a 'Design: Today' button in the page, which pushes the disclosure about 60 px down (fine) |
| H2 'DevFest Lagos' with no place | open | **open, now rank 1:** still first in Now and next on A and B with no 'Lagos, Algarve' |
| H3 D's countdown cut | open | **done:** 'Opening Night in 2d 11h 29m' fits |
| H4 F's ticker mid-item | open | **unclear:** it shows ':30 Registration...' 0.8 s after load, so the ticker may have moved before the shot; checked on E, which starts whole. Leave with dev@ to check the first frame |
| H5 four kickers on the lead | open | open (D, E) |
| H6, H7 | open | with dev@ (designer@'s spec, section 9) |
