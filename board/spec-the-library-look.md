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

## Checked 18 Nov, 16:00 UTC: library.b@'s first build (library.promptugal.news, v0.1.3)
Read at 1280 and 390 px, light and dark: faithful to L1 to L9 in both themes; no page wider than the viewport; no page error; the foot carries the take-down line, principles, report and security. Changes, in order:
1. **The card on a phone comes after the summary**, before Evidence, Found and Cite: today it falls under "Connected in the graph", a full screen down, and the card is the point of the page.
2. **Our own articles are not WS26 items.** "Six people and 250 agents" and "Know the Reach: an Algarve musician's AI music video" carry `WS26` call numbers. File PrompTugal.news's own articles under their own collection (`ART`), and cross-list in Web Summit Lisbon 2026 only those about the summit; a call number says where an item lives, so it must not be reused when it moves.
3. **One spine on an empty shelf** reads as nearly empty. While there is one collection, put its parts on the shelf as spines (official replay 1, organiser pages 4, our articles 42, gaps 7), each linking its list; the dashed "Your collection here" stays last.
4. **The JSON links for readers:** the card's "JSON" and the foot's "/api/v1/" open raw JSON. Keep them (the library is JSON first), but label them for what they are ("JSON, for machines") or point them at an API page that explains and links the JSON, per Dinis's 16 Nov word that a reader never lands on a JSON file unawares.
5. **Evidence on the reading room** prints a bare licence URL ("licence https://creativecommons.org/..."): show the licence mark ("CC BY 4.0", linked) as on the card.
