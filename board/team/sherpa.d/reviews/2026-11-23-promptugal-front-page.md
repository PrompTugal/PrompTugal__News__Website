---
title: "PrompTugal.news front page, read cold (v0.1.21xx, 23 Nov 2026)"
by: sherpa.d@AgentiCCells.dinis
written: 2026-11-23T07:39Z
what_this_is: my own cold read, measured at 390 x 664 (a phone) and 1280 x 800 (a desktop) with a local headless browser on the live front page; a review by one agent, not user research and not synthetic readers
why_me: my twin sherpa@ (account B) has no schedule now (maestro.b, 23 Nov 01:27 UTC) and its last cold read is of 16 Nov (R1 to R8); PrompTugal is in my area
---
# The PrompTugal front page, cold

## Measured
| | Phone | Desktop |
|---|---|---|
| Page length | 16.1 screens (12.6 on 16 Nov) | 7.3 screens |
| Sideways scroll | none | none |
| Script errors | 0 | 0 |
| First screen | brand, one headline, one story paragraph, a "Read the full story" button, a bottom tab bar | the same, with a price line in the top bar |
| A feedback, contact or voice control in the page text | none | none |

## Findings, ranked (owners in brackets; I recommend, they decide)
1. **P1: the lead story is still the agents' own announcement** ("PrompTugal.news goes local: an AI agent for every Algarve town"), as it was on 16 Nov (R5). A cold reader meets the newsroom's machinery before any local news. The paragraph also says "a signed file of what it found" and "17 towns": plain enough, but it is about us. [correspondent@, the front page's owner]
2. **P2: the page's own heading is not the visible headline.** The page's h1 in the code is "Algarve tourism gets free AI help and a booking warning", zero pixels tall and not what is displayed (the displayed lead is the announcement above). A screen reader and a search engine get a different headline from the one a person sees; the same fault as R1 on 10 Nov (the h1 0 px tall). [dev.pages@ or dev@]
3. **P3: no door for feedback, as on the hub.** Nothing on the front page lets a reader say something to the people behind it. There is an "Ask" button in the top bar; I have not checked whether it reaches the agents or only answers questions. Dinis wants every site to take voice and text memos (22 Nov). [dev@; the shared control is feedback-everywhere.md, missing dot 2]
4. **P4: 16.1 phone screens, up from 12.6.** The lead is still one story, but the page below has grown. The first phone screen is fine; the length is what a reader meets next. [correspondent@, dev.pages@]
5. **P5: the price line shows on desktop only.** "Pay for what you read · £4.99" is in the desktop top bar and absent from the phone's first screen. On 16 Nov the contribute page still said "no payment, for now" (R2); I have not re-read that page. Money is Dinis's alone, so I flag only that desktop and phone differ. [dev@, then Dinis if the wording changes]

## What works (keep)
The phone's first screen: a brand, one headline, one story, one button, and a tab bar (Now, News, Companies, Search, More). The top bar's row of the sibling sites. No errors, no sideways scroll.

## Not checked
The contribute page, the place pages (R6, R7 on 16 Nov) and the app; whether "Ask" reaches the agents; any real reader. A cold read of the Algarve section would be the next one.

## Re-read, 26 Nov 07:39 UTC (the cl-6 team has been working on the page; my own cold read, 390 and 1280 px)
| Finding of 23 Nov | Now |
|---|---|
| P1 the lead is the agents' own announcement | **Fixed.** The lead is a news story ("Portugal's tech investment is set to enter Europe's top ten", tagged "Today", with a plain two-line summary and a "Read the full story" button); the byline says plainly it is "the 6.journalist desk, an AI agent, for Dinis Cruz · 2 min read, agent-written, signed". A second block, "Now in the Algarve", follows. |
| P2 the h1 in the code is a different, hidden headline | **Much better.** The code's h1 now has the same text as the displayed lead. It is still a 0 px element; the visible headline is another tag; I did not check why. |
| P3 no feedback or contact control | **Stands.** None on the front page; `/send/` is 404 on promptugal.news. |
| P4 16.1 phone screens | **14.6** (6.7 on a desktop). |
| P5 the price line on desktop only | **Stands** ("Pay for what you read, 4.99" in the desktop bar; not in the phone's first screen). Money is Dinis's. |
No script errors, no sideways scroll at either size. The phone's first screen is still brand, headline, story, button, tab bar.
