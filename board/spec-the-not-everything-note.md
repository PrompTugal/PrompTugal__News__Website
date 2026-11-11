---
title: "The websummit-only pass: the note on every affected page and list, and the recovery page"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-11T22:55Z
for: dev@PrompTugal.dinis and dev.pages@PrompTugal.dinis (step 3 of the pass, after security@'s pre-review); journalist@ (the words); sherpa@ (reads it cold, step 7)
pass: board/passes/2026-11-11-only-websummit-sourced-comes-off.md (step 3: "the note on every affected page and list, designed with designer@"; the recovery page)
rule: board/guidance/2026-11-11-only-websummit-sourced-comes-off.md (Dinis, 18:50 UTC), rules 3 and 6
pictures: design/decisions/not-everything/, made by design/not-everything/make.mjs (the note put on the live companies list and Cloudflare's page; the recovery page as a mock-up)
issue: WS-177
---
# The note, and the recovery page

## The note (rule 3)

![On the companies list (left) and on a company's page (right), on a phone](../design/decisions/not-everything/note-list--phone.jpg)

**One component in two lengths, the same on every affected page and list.**

**Look.** A sand band (#efe6d2; #1d1f25 in dark mode) with a 3 px ink rule on top. A kicker in ink small caps: it is **not red**, because this is not a warning and nothing is wrong with what is shown. The words are in Newsreader 15.5 px. It ends with the link "How items come back" in brand green, to the recovery page.

**Placement.** Under the page's title and lede, before the share buttons and the switch, so it is read before the list.

**The words** follow Dinis's five points in order. journalist@ may tune them; keep all five.
- **On a list:** "This list is not everything. Web Summit's licence does not let us republish data from its site, so on 11 November we took off what rested only on it. Every company here has another public source, cited on its page; the others come back as we find one. *N of M shown.* How items come back."
- **On a page with facts taken off:** "Not everything we held. Some facts on this page rested only on Web Summit's site, which we may not republish; on 11 November we took them off. What you see has another public source, each cited. A fact comes back when we find one. How items come back."
- **On a page with nothing taken off:** no note.
- "N of M shown" is read from ontologist@'s inventory at build. The 61 of 120 in the picture is from the conductor's count at 18:55 UTC (59 of 120 companies left with nothing).

## The recovery page (rule 6)

![The recovery page on a phone](../design/decisions/not-everything/recovery--phone--light.jpg)

Title: "What came off the site, and how it comes back". Under About, linked from every note. In order:
1. **The standfirst:** the licence, the date, and how a fact returns.
2. **By kind:** company facts, people, sessions and events. Each gets one bar: paper for kept, ink for came off, green for came back. Under it, "X of Y came off" and "N back". The time of the inventory read is shown; the figures are read at each release, never typed.
3. **The route, for one fact:** three boxes. A dashed one, "Came off, 11 Nov". An ink one, "A shadow source". A green one, "Came back". Below them, the best real examples as they return, each with its route and sources.
4. **The method:** "Sources and their shadows" (newsroom.sgit.ai), and "no login, no paywall, no bot challenge is read around".
5. **The showcase:** Lisbon Tech Fringe, "built from open sources", linked.

The same bar and route also go on a page whose fact came back, beside that fact: "came back on <date>, from <source>".
