---
title: "A PT decision: the live data on the home page"
summary: "Where 'Now in the Algarve' goes on the home page and what it shows: three options shown in full (today's one-line strip, the place pages' ink band, a panel in the lead's empty column), what each does well and badly, and the designer's recommendation, which is the default unless the reviewers find a reason against it."
decision: open
asked_by: designer@PrompTugal.dinis
asked_of: the team (a PT decision: the owner proposes, sherpa@, synthetic@ and security@ weigh in, the owner decides and dev.places@ ships), at Dinis's word of 16 November 2026, 10:40 UTC
since: 2026-11-17T08:50Z
blocks: "dev.places@'s build of LD1 and LD2 (board/spec-the-live-data-up-front.md)"
answer: null
answered_at: null
---

By designer@PrompTugal.dinis, 17 November 2026 (WS-177). Dinis, 16 November, about 10:40 UTC: the live data from public sources is "looking good, but it's actually quite hidden. And also, a lot of some of them go to JSON files ... we can't have that ... I think that's ridiculously powerful" (`board/guidance/2026-11-16-live-data-up-front-and-the-home-page-details.md`).

## What is live today {#today}

On a desktop, the lead story fills the left half of a green band; the right half, made for a picture, is empty because the lead has none. Under the ticker, one line of small type: "Now in the Algarve Faro 19.3 °C · fire risk low · IPMA: yellow rough sea from 11-18 ... read 03:17 UTC". Its links open `api.ipma.pt` and `api.adsb.lol` JSON files: what Dinis asked to end. The data behind it holds much more: a temperature for each town from its nearest station (13 of 17 answered at 14:40 UTC on 16 November, only 6 at 07:19 UTC on 17 November), five days of forecast (Tuesday and Wednesday 100% rain in Faro), the warning's end and where it applies.

## The options {#options}

### A: keep the strip, as figures {#a}

designer.places@'s variant A (`design/experiments/home-live-strip/mockup.html.txt`): the same line, but each value a labelled figure, scrolling sideways on a phone.

- **Good:** small; keeps the page's rhythm; quick to build.
- **Bad:** still under the fold on a phone; one source line for four values; shows Faro only, so 16 towns are absent; leaves the lead's empty half empty.

### B: the place pages' ink band, under the lead {#b}

designer.places@'s variant B: the dark "Now in" band every town page has, full width under the lead, each value with its source and age.

- **Good:** the home page teaches where the live data lives on every town page; source and age beside each value.
- **Bad:** about 150 px more before the stories; still Faro only; the lead's empty half stays empty.

### C: a panel in the lead's empty column (recommended) {#c}

![The home page with 'Now in the Algarve' in the lead's right column: the warning in words, the 17 towns west to east with their temperatures, Faro's next five days](../../../../design/decisions/live-data/home-desktop.png)

![The same on a phone: the panel follows the lead](../../../../design/decisions/live-data/home-phone.png)

The panel fills the space the lead leaves when it has no picture (below the lead on a phone, and full width under it, in B's ink register, when the lead has a picture): the live dot; the warning in words with its dates ("Rough sea on the west coast, waves of 4 to 5 m, Wed 18, 12:00 to Thu 19, 07:00"); the 17 towns west to east, each with its temperature, linking its page; Faro's next five days; one source line linking IPMA's pages for people, with the time read and its age.

- **Good:** the live data is on the first screen of a desktop, with no space taken from the stories; every town is there, so a reader from Lagos finds Lagos; the rain of the next two days, the week's story, is visible; no JSON link.
- **Bad:** more to build than A or B; at 07:19 UTC on 17 November only 6 of the 17 towns had a reading from their station, so the panel needs the nearest station that answered, named (LD5), or it shows more gaps than figures; the per-value source of B is folded into one line.

## What the reviewers found {#reviews}

Waiting on sherpa@, synthetic@ and security@ (each writes here). The question for them: does a cold reader on a phone understand the panel without the town page, and does any value need its own source line?

## Recommendation {#recommendation}

**C**, with B's register when the lead has a picture, and B's source and age per value in the town pages' band (already live). Build it from the markup in `design/live-data/mock.mjs` (`homePanel()`); the full list is LD1 to LD6 in `board/spec-the-live-data-up-front.md`.

## What follows each answer {#follows}

- **C (the default, unless a reviewer finds a reason against it by the next wake):** dev.places@ builds LD1 and LD2 in `front-e.mjs` and its template; designer@ checks it at 1280 and 390 px, light and dark, and that no reader-facing link ends in `.json`.
- **B:** the same build, the panel full width under the lead and Faro only; the empty half stays until the lead has a picture.
- **A:** only LD2 (the links to IPMA's pages) and the figures; the home page stays as it is.
