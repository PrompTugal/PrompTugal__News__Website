---
title: "The daily newsletter: the design of an edition, its page and its email (designer@)"
by: designer@PrompTugal.dinis
written: 2026-11-06T16:55Z
from: Dinis, 16:20 UTC (board/guidance/2026-11-06-the-daily-newsletter.md)
for: dev@PrompTugal.dinis and dev.pages@PrompTugal.dinis (newsroom/build/features/newsletter.mjs), the correspondent (the opening line)
measured: the feature at v0.1.293, built with the clock set to Saturday 7 November (the morning edition and its email)
issue: WS-177
---
# The daily newsletter: the design

The feature works: an edition from data, a page and a plain-text email. This is how it should look and read.

## The email (plain text, no images: Dinis, "we can't put screenshots on emails")

The exact shape, from Saturday's real morning edition: `design/newsletter/morning-email-example.txt`.

| # | Change | Why |
|---|---|---|
| E1 | A masthead of three lines: `PROMPTUGAL.NEWS · MORNING EDITION`, the date and "sent 07:30 Lisbon", the card's tagline; a rule of `=` | a reader knows at a glance what it is and when it was true |
| E2 | One opening line of two sentences (the correspondent's, from the day; a default from data: "N days to Web Summit Lisbon") | the email says why to read it today |
| E3 | **Links as numbered references** ([1] to [n]) listed at the end, never inline after a title | inline URLs double every line's length and break mid-word on a phone |
| E4 | Lines wrapped at 50 characters, times in a 7-character gutter, wrapped lines indented under the title | plain text is read in a narrow pane |
| E5 | **Merge entries with the same title on the same day**: one "Registration opens" with its two places and times | the same entry twice reads as a mistake (synthetic@'s F40) |
| E6 | Events outside Lisbon grouped under "In the Algarve, not in Lisbon" (by place region) | a Lisbon reader must not plan for Lagos |
| E7 | "Following from afar": three numbered stories, the title and one shortened line; then "Every article" | three is read; five is skipped |
| E8 | The foot: "Written by AI agents and edited by Dinis Cruz, Indi Gupte and Vicky Wang. Every fact links to its source, with the date we read it. Independent: not affiliated with Web Summit." Not "technology and AI, in context" (the old tagline) | who writes it, said plainly (F35); "sourced" not "checked" (F45) |
| E9 | No unsubscribe or sender lines here: the Web Summit team adds them when it sends (the comms protocol) | nothing private on this side |

## The edition page (`/newsletter/<date>-<edition>/`)

| # | Change |
|---|---|
| P1 | An edition band above the title: the PT.news stamp at 40 px, "Morning edition · Saturday 7 November · sent 07:30 Lisbon", a link to the other edition of the day and to yesterday's |
| P2 | Each story in "Following from afar" with its thumbnail (the article image, `--paper--thumb`), kicker, title, one line |
| P3 | E5 and E6 on the page too (merged entries; the Algarve apart) |
| P4 | "Add to my day" as a small text button at the end of the item's meta line, not a full-width box under every item |
| P5 | The byline: "Made by the correspondent and journalist agents, edited by Dinis Cruz, Indi Gupte and Vicky Wang", not "By PrompTugal.news" |
| P6 | /newsletter/ lists the editions as cards, newest first, morning and evening side by side per day, each with its opening line |

The evening edition takes the same shape: "What happened today" (the day's articles and moments), "Tomorrow" (three things), the same foot.
