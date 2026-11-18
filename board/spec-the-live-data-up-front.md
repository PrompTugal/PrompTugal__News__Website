---
title: "The live data up front: the home page's lead and the town band"
by: designer@PrompTugal.dinis
date: 2026-11-16, about 19:50 UTC
for: dev.places@PrompTugal.dinis (the build: front-e.mjs, by-place.mjs), designer.places@PrompTugal.dinis (the look in assets/by-place/), datasci.places@PrompTugal.dinis (the readings)
from: Dinis, 16 Nov 10:40 UTC: the live public data is "ridiculously powerful" but "quite hidden", and "a lot ... go to JSON files ... we can't have that" (board/guidance/2026-11-16-live-data-up-front-and-the-home-page-details.md; board/briefs/2026-11-16-live-data-up-front.md)
issue: WS-177
---
# The live data up front

Read on the build of v0.1.1647 at 19:35 UTC, desktop 1280 px and phone 390 px. The pictures are mock-ups drawn from the real files in `data/by-place/now/` by `design/live-data/mock.mjs` (no AI), injected into the built pages: `design/decisions/live-data/home-desktop.png`, `home-phone.png`, `faro-desktop.png`, `faro-phone.png`.

## What I found

1. **The home page's lead has an empty right half.** `.fe-band .fe-w` is a two-column grid made for a figure; today's lead ("PrompTugal.news goes local") has none, so half of the first screen on a desktop is plain green.
2. **The home page's live line still links JSON.** "Now in the Algarve" (`.fe-now`, from `item:now` in `assets/front-e/front-e.tmpl`) links `api.ipma.pt/.../observations.json` and `.../warnings_www.json`: the two things Dinis asked to end. It is also one small line under the ticker, the opposite of up front.
3. **The town band shows today only.** The files hold five days of forecast; tomorrow and Wednesday are 100% rain in Faro, the story of the week, and the page does not say it.
4. **The warning reads as data:** "rough sea from 2026-11-18 12:00". No end, no where (IPMA's text says the west coast, waves of 4 to 5 m).
5. **Four towns read "no reading"** (Loulé, Quarteira, Lagos, Monchique): their station sent nothing at 14:00.
6. **Everything is five hours old.** Every file was read at 14:40 UTC; `board/tools/local-now.mjs` has not run since. The band greys the value ("5 h ago"), which is honest, but the loop is off.

## What to build

| # | What | Who |
|---|---|---|
| LD1 | **"Now in the Algarve" fills the lead's right column** whenever the lead has no figure (and below the lead on a phone): the live dot and title; the warning in words; the 17 towns west to east, each its temperature in big serif, linking its page; Faro's next five days (highest, chance of rain, rain of 60% or more inverted paper-on-green); one source line, IPMA's page for people, the time read and its age, "every town →". Picture: `home-desktop.png`, `home-phone.png`; markup and CSS in `mock.mjs` (`homePanel()`, `.ld*`), to copy | dev.places@ (front-e.mjs and the template) |
| LD2 | **No JSON link on the home page:** `.fe-now` goes (LD1 replaces it); if it stays anywhere, its links are IPMA's pages (`/en/otempo/obs.superficie/`, `/en/otempo/prev-sam/`), as the town bands already do | dev.places@ |
| LD3 | **The five days under every town's band**: a strip of five cells (day and date, low / high, "rain N%"), rain of 60% or more marked paper-on-ink. Picture: `faro-desktop.png`, `faro-phone.png` | dev.places@ (the markup in `nowBlock`), designer.places@ (the look) |
| LD4 | **The warning in words:** level chip, the kind and where ("rough sea, west coast"), then from and to as "Wed 18, 12:00 to Thu 19, 07:00 UTC", the figure from IPMA's text, the link to IPMA's warnings page | dev.places@ |
| LD5 | **No town without a temperature:** where the town's station is silent, the nearest station that answered, named ("Loulé: 20° at Faro, 12 km"); "no reading" only when none within 25 km did | datasci.places@ (in `local-now.mjs`) |
| LD6 | **Hourly readings:** `local-now.mjs` back on its hourly run (the brief gave it to datasci.places@'s wake; the conductor ran it until then) | datasci.places@, conductor.b@ |

## The rules it keeps (brand v2.0)

- Colour only for meaning: the green dot is "live"; IPMA's level chips keep IPMA's colours; rain is marked by inverting paper and ink, not by a new blue.
- Every value shows its source and the time it was read; a reader never lands on a `.json` file. The JSON stays one click deeper, on the API pages.
- Type: values in the serif (Newsreader), labels in the sans, times in the mono; no label under 11 px.

## Check (I check at my next wake after it ships)

LD1 to LD4 at 1280 and 390 px, light and dark; no `href` ending `.json` in `.fe-band`, `.bp-nowband` or the home page outside the API pages; the read time under three hours.

## Checked 17 Nov, 00:45 UTC (v0.1.1675)
LD1 to LD5 not built. LD2 still fails: the home page's `.fe-now` links `api.ipma.pt/...observations.json` and `warnings_www.json`, and now `api.adsb.lol` too. LD6 in part: datasci.places@ refreshes the readings, and dev@ marks a stale airport read "last read" (7a7e53f9f).

## 17 Nov, 06:45 UTC: designer.places@'s two home strips (design/experiments/home-live-strip/mockup.html.txt)
Its A (figures in a one-line strip) and B (the place pages' ink band on the home page, source and age beside each value) are taken in. **One home panel, not two:** LD1 stands (the lead's empty right column on a desktop, below the lead on a phone, all 17 towns and the five days), and takes from B the source and age under each value and the ink register when the lead *has* a figure (then the panel goes full width under the lead, as B). A's red rule is not used: red is the wordmark's, and nothing here is an alarm. dev.places@ builds one, from LD1's markup.

Checked at v0.1.1690: LD1 to LD5 still not built; the home page still links `api.ipma.pt` and `api.adsb.lol` (LD2).

## 17 Nov, 08:50 UTC
LD1 and LD2 are now a PT decision page, `/newsroom/design/decisions/the-home-live-panel/` (options A, B, C in full; C recommended, the default unless a reviewer objects by the next wake). LD5 matters more: at 07:19 UTC only 6 of 17 towns had a reading from their own station.

## Checked 18 Nov, 02:45 UTC (v0.1.1767)
The five sites' band under the masthead (conductor@, 5525d8ae7) reads well at 1280 and 390, and pages fit. LD1 still open: the lead's right half is empty on a desktop; the live line is still one small line. LD2 still fails: the live line links `api.ipma.pt/.../observations.json`, `.../warnings_www.json` and `api.adsb.lol`, 40 hours after Dinis asked (sent to dev.places@ on its lane). A wording slip in the live line: "Faro airport: 1 airline flights near" (singular when 1).

## Checked 18 Nov, 18:50 UTC (v0.1.1818)
dev@'s 2589626c5: the town band now refreshes live from data.promptugal.news, the built lines as fallback; on Faro the band reads current (20.9 °C, read this hour) and links no JSON (0 `.json` links in `.bp-nowband`). LD3 and LD4 look unchanged; LD1 and LD2 on the home page not re-checked this wake.
