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

## Check of the first edition: Saturday 7 November, morning (designer@ session 3, 07:40 UTC)

Read live at 07:35 Lisbon: https://promptugal.news/newsletter/2026-11-07-morning/ (desktop and phone: `design/newsletter/check-2026-11-07-morning.jpg`) and its email, `api/v1/newsletter/2026-11-07-morning.txt`. It went out on time and from data; the editions are numbered, linked and public, with nothing private (E9 passes). Most of the design above is not built yet. In order of what a reader notices first:

| # | Result | What the first edition does |
|---|---|---|
| E5, P3 | **fail** | "Registration: collect your lanyard and wristband..." twice (09:30 at the airport, 12:00 at Pavilhão de Portugal): one entry with its two places and times |
| E6, P3 | **fail** | the first item is "DevFest Lagos 2026" with the place "Lagos", no region: a Lisbon reader cannot tell it is in the Algarve (sherpa@'s H2 too); put it under "In the Algarve, not in Lisbon" |
| new | **fail** | "Five things to plan around today" lists four: count them, or say "What to plan around today" |
| E3, E4 | **fail** | every link inline in brackets after its title, lines up to 330 characters: numbered references at the end, 50-character lines |
| E7 | **fail** | five stories with their full summaries (one is four lines long): three, one short line each, then "Every article" |
| E8, P5 | **fail** | the foot uses the old line "technology and AI, in context, from Portugal for Europe"; the page says "By PrompTugal.news": both as E8 and P5 say (who writes it: AI agents, edited by Dinis Cruz, Indi Gupte and Vicky Wang) |
| E1, E2 | **fail** | no masthead (PROMPTUGAL.NEWS · MORNING EDITION, the date and "sent 07:30 Lisbon"); the opening line is generic, not the day's ("2 days to Opening Night" from data at least) |
| P1 | **fail** | no edition band (stamp, "sent 07:30 Lisbon", links to the evening edition and to yesterday) |
| P2 | **fail** | no thumbnails for the stories (every article has `design/infographics/out/<slug>--paper--thumb.png`) |
| P4 | **fail** | a full-width "Add to my day" box under every item: a small text button on the meta line |
| P6 | **fail** | /newsletter/ is a plain list of two links, and already lists the evening edition before its time has come: cards, newest first, an edition only once its time has come |
| E9 | pass | no unsubscribe or sender lines |

Owner: dev.pages@ (the editions), dev@ (review). The evening edition is the next chance to see these.

**Re-check at v0.1.480 (08:40 UTC), the morning email rebuilt:** E3 and E4 pass (numbered references, 50-character lines; dev@, d20958472); E5 and E6 pass (registration one entry, "also at Pavilhão de Portugal, 12:00"; TMCT'26 and DevFest Lagos "in the Algarve, not Lisbon"; dev@, 071a5fd3e); the count is right (five things, five items). Still open: E1, E2, E7, E8, P1, P2, P4, P5, P6.
