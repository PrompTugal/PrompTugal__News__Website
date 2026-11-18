---
title: "The look of library.promptugal.news: a library website in the PrompTugal brand"
by: designer@PrompTugal.dinis
date: 2026-11-18, about 15:45 UTC
for: library.b@PrompTugal.dinis (builds it in PrompTugal/PrompTugal__News__Library), with librarian@ and ontologist@
from: Dinis, 18 Nov about 15:30 UTC (board/guidance/2026-11-18-the-library.md; board/briefs/2026-11-18-the-library.md): "ask the designer to make it look really good. It should try to look like a library website"
issue: WS-177
---
# The look of the library

Pictures, no AI: `design/decisions/library/home-desktop.png`, `home-phone.png`, `card-desktop.png`, `card-phone.png`. The markup and CSS to build from: `design/library/library.html.txt` (one file: the home page, then the reading room), made by `design/library/mock.mjs` from this repository's own published articles, places and media records, so every sample entry is real. Brand v2.0 throughout: paper, ink, Newsreader, IBM Plex Sans and Mono; red and green only as the brand uses them. In the build, use the supplied SVG wordmark, not the typed one in the mock (brand guide: never recreate it with spans).

## The home page: the hall

| # | What |
|---|---|
| L1 | **The hall:** a mono kicker ("library.promptugal.news · the catalogue at the heart of PrompTugal.news"), one large serif line ("Everything we found, *catalogued,* sourced and linked."), one sentence on what a card holds, closed by a double rule, as a library's reading room has a threshold. |
| L2 | **The catalogue search first,** a single wide field in a 2 px ink frame ("Search the catalogue: a title, a person, a place, a call number"), then "Browse by place, topic, organisation, event, person, date, call number". |
| L3 | **The holdings in numbers**, from the catalogue's own counts (serif figure, mono label). |
| L4 | **The shelves:** each collection a book spine, upright on a shelf, its call-number prefix and count in mono at the foot, its name in the serif up the spine; widths equal, heights vary a little so it reads as a shelf, colours from the brand (deep green, sand, ink, the red deepened for one collection) and a dashed empty spine "Your collection here" for what is still to come. Scrolls sideways on a phone if it must, never wraps. |
| L5 | **New on the shelves** (accessions): call number in green mono, the title in the serif, date and who in the sans. **Finding aids** beside it: guides to a place, an event, who covers where, the open data, how call numbers work, and "What is not here" (the gaps, honestly). |
| L6 | **The invitation to librarians** as a deep green band before the foot: "Are you a librarian? Help us build this." with one sentence and one button, as Dinis asked. Repeat it on the about page. |
| L7 | **The foot** says the licences once (our catalogue and cards CC BY 4.0; each item keeps its source's licence, linked on its card), the JSON root, and the principles and report links (`board/spec-principles-and-report-links.md`). |

## Call numbers

A stable, readable address per item: `<COLLECTION> <YEAR>/<SEQ>`, e.g. `ART 2026/0090` for an article, `PLC` places, `MED` news organisations, `WS26` Web Summit Lisbon 2026. Assigned once, in the order catalogued, never reused or renumbered; the URL carries it (`/item/ART-2026-0090/`). The mock numbers this site's published articles by date to show the look; the real numbers are library.b@'s to assign and record.

## The reading room and the catalogue card

| # | What |
|---|---|
| L8 | **Each item has a reading room:** the breadcrumb ending in its call number; a kicker naming the room and the kind; the title; the summary; one button "Read it at its source →" (media by link or the platform's embed, never copied); "On the same shelf" and "Connected in the graph", each line led by its call-number prefix. |
| L9 | **The card beside it** (under it on a phone), drawn as a library index card: warm card stock, ruled lines, a red rule under the call number, the call number in red mono, the title in the serif, then What, Who, When, Where, Source, Licence (the licence mark of `board/spec-the-licence-mark.md`), Found (when and by which agent), and JSON, markdown and cite at the foot; a punched hole at the bottom. Every field on the card is also in the item's JSON. |

## For library.b@
Start from `design/library/library.html.txt`; tell designer@ when the first build is up and I check it at 1280 and 390 px, light and dark (a dark theme follows brand v2.0's dark tokens: the card becomes ink with a paper rule).
