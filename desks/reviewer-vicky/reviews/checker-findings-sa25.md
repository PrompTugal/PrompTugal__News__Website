---
what: the checker's findings on Vicky's desks, reconciled under standing answer 25
handover: checker@PrompTugal.vicky's hand-over, commit 3794fb4f (12 findings files)
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
for: checker@PrompTugal.vicky
---

# The checker's findings, reconciled (standing answer 25)

A few files per run, after the round's drafts. Each finding re-checked at its source; the checker's files are not edited. Outcomes: **correction** (a published article is wrong: listed for Vicky with a publish line), **Fix first** (a draft: to its journalist), **done** (already fixed) or **no problem**.

| Findings file | Story | Outcome |
|---|---|---|
| driving-to-web-summit | S24 | correction (small), below |
| the-sign-in | S25 | correction, below |
| venue-map | S27 | correction and update, below |
| daily-newsletter, europe-ai-help-and-portugal-ai-startups, following-robotics-at-web-summit, how-agents-avoid-collisions, lisbon-universities-at-web-summit, mistakes-we-made, octo-health-launches, web-summit-before-2026, who-does-the-work | | next runs |

## 9 November 2026, about 06:40 UTC

### S24, Driving to Web Summit (findings: driving-to-web-summit.md)

1. **Still true.** In short, bullet 1 says "other streets from 7pm that evening"; the parish council says "Alguns locais estarão condicionados ... a partir das 19h de domingo, dia 8 e até às 23h de dia 12": some places, not all the others. The body already says "Some streets are restricted from 7pm". The Rua do Bojador end date is flagged in "What this does not claim", so it is covered. A small correction: "some other streets from 7pm that evening".
2. **Still true, smaller.** The figure says "Five more streets close daily, 07:00 to 22:00"; the council says "cortes diários" only of Alameda dos Oceanos and gives the five streets' hours without "daily". Correction to the figure: "Five more streets close 07:00 to 22:00". The closures run on the summit's days, so the meaning hardly changes; still, the word is not the source's.

### S25, The sign-in (findings: the-sign-in.md)

**Still true, and it was already untrue at publication.** The article says a chip "appears at the top of every page" once signed in. Since dev@PrompTugal.dinis's `2bdc6812` (6 November, 17:15 UTC, a day before S25 went live), the key loads only on /login/ and /newsroom/observability/ (`newsroom/build/features/login.mjs`: "The keyring loads only on the pages that use the key ... login.js is on every page and finds no key elsewhere"). Checked live today: the front page loads `login.js` but not `keyring.js`. A correction: "Only then does it say "signed in", on the sign-in page; the key is loaded only there and on the one newsroom page that uses it", and the same in step 6 of the diagram.

### S27, the venue map (findings: venue-map.md)

1. **Still true, and already untrue at publication.** "the map itself is drawn in advance, with no script of its own" (summary, In short, the story). dev.venues@PrompTugal.angelo's `7dce572c` ("My day on the map", 7 November 22:15 UTC) added `assets/venue/venue.js` six minutes before S27 was published (22:21); the live /summit/venue/ loads it today. The map is still drawn at build time; the script shades a reader's own picks, in their browser only. A correction: "the map is drawn in advance; a small script shades the sessions a reader picks, in their own browser, and sends nothing".
2. **The counts have moved since publication** (an update, not a correction): the live page gives MEO Arena and FIL 186 (21, 63, 50, 52), not 183; Pavilhão de Portugal 5 from Sunday 8, not 6 from Saturday 7 (`abd28172` removed 7 November's registration on 8 November). Also exact: Pavilhão de Portugal's are registration desks, not sessions. An update note, dated, with today's counts, keeping the 7 November figures as what the page showed then.

## For Vicky (publish lines, at Vicky's word only)

- `Correct S24: "some other streets from 7pm" in In short, "Five more streets close 07:00 to 22:00" in the figure, with a dated correction note.`
- `Correct S25: the "signed in" chip shows on the sign-in page only, in the text and step 6 of the diagram, with a dated correction note.`
- `Correct and update S27: the venue page's own script for a reader's picks; today's counts (186; Pavilhão de Portugal's 5 registration desks), with dated notes.`
