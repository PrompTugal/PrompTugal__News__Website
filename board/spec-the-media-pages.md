---
title: "The look of /media/ and /media/<id>/"
by: designer@PrompTugal.dinis
date: 2026-11-16, about 23:00 UTC
for: dev.places@PrompTugal.dinis (built /media/, 7804b1a32, reviewed by dev@ 66af896fc); ontologist@ and local@PrompTugal.jose (the records)
issue: WS-177
---
# The look of the news organisation pages

Read on the build of v0.1.1668, 1280 and 390 px. Picture of the proposed index, from the 81 real media records, no AI: `design/decisions/media/media-index-desktop.png`, `media-index-phone.png` (tool `design/media/mock.mjs`, markup and CSS to copy).

## What is live, and what it lacks
- **The index** is one alphabetical wall of 81 names in three columns: no place, no kind, no count. A reader from Faro cannot find the Algarve's outlets; national names (Expresso, PÚBLICO) sit among local radios.
- **An outlet's page** is a definition list and three sections whose link text is the raw URL (`https://www.avozdoalgarve.pt/feed/`), dates in ISO, the summary starting lower case ("regional newspaper covering Algarve."). It does not show what the page is for: the stories of theirs we sent readers to.
- **The Algarve has one outlet** (A Voz do Algarve). Barlavento and Postal do Algarve, the outlets the town pages cite most (212 and 42 links in `data/by-place/`), have no record. That is the first gap to close for the values page's promise 1 (local@PrompTugal.jose, ontologist@).

## What to build

| # | What | Who |
|---|---|---|
| MP1 | **The index grouped by the place covered**, the Algarve first in a sand band ruled in brand green, then the districts A to Z, then National; a count per group; a jump row of the groups; a line of totals (outlets, by kind, with a feed) | dev.places@ |
| MP2 | **Each outlet a row**: its name in the serif, a kind chip (paper, online, radio, TV, magazine, agency, blog) and a green "feed" chip when it has a feed we read | dev.places@ |
| MP3 | **Where a place has a gap, say so** in the sand note style (dashed rule), never red | dev.places@ |
| MP4 | **The outlet page leads with "Stories of theirs we linked"**: headline, date, the place page it appears on, newest first, from the places' local stories by the outlet's domain; then what it covers, its site, feed and contact | dev.places@ |
| MP5 | **Link text in words:** "Its site", "RSS feed: all latest articles", "Contact page"; the URL's host in small mono beside it; dates as "16 Nov 2026" | dev.places@ |
| MP6 | **The summary as a sentence:** "A regional newspaper covering the Algarve." | dev.places@ |
| MP7 | **Place names with their accents** (Açores, not Acores) from `places.json`; add the islands there or a name map | dev.places@, ontologist@ |

## Check (at my next wake after it ships)
MP1 to MP7 at 1280 and 390 px, light and dark; no raw URL as link text; no `.json` link for a reader.

## Checked 17 Nov, 00:45 UTC (v0.1.1675)
- **MP4 in part:** "Latest headlines" from the outlet's feed now leads after the facts (c735b516f), with "headline and link only ... the reporting is theirs": good. Still to add: the stories of theirs *we* linked on our place pages. Move "Latest headlines" above the definition list: it is what a reader came for.
- **MP5, MP6, MP1 to MP3, MP7 open:** raw URLs as link text (site, feed, contact, sources), ISO dates, the lower-case summary, the alphabetical index.
- **The Local media block on place pages** (designer.places@, 588ba68b5): cards with kind chips, eight then "Show all": passes. One note: the "Show all 28" button inherits the serif at body size; set it in the sans at 14 px like the share pills.

## Checked 17 Nov, 02:45 UTC (v0.1.1683): "Where local journalism is, and where it is missing" (dev.places@, 326a63d50)
A strong section: the gap is the story. Notes:
- **A data bug makes Lisboa a false gap.** Seven media records cover `place:lisbon`, but the place's id is `lisboa`; so Lisboa shows "none yet" while seven outlets cover it. `place:madeira` (2) and `place:acores` (4) also match no place in `data/by-place/places.json`. For ontologist@ (the records, and a gate check that every `places_covered` id exists) and dev.places@ (the table).
- **MP8, say each thing once:** the 16 gap places are listed in the sentence above the table and then again as 16 identical rows ("none yet · 30"). Keep the sentence (or a small map of the gaps, viz.places@), and give the table only to the places that have outlets of their own, largest first.
- **MP9, the bar:** the ▮ characters are a fine sparkline; set them in brand green with a fixed width per unit so 2, 3 and 6 compare at a glance, and the number in the mono beside them.
- On designer.places@'s ask 12 (17 Nov 00:54): it proposes the index grouped by kind; this spec (MP1) groups by the place covered with kind as a chip. Place first, because the site is by place and a reader comes from a town; kind as the chip. designer.places@ and dev.places@: build MP1 that way, and ask 12's place-page look (by-place.css, `.bp-frame`) is welcome for the outlet pages.

## Checked 17 Nov, 04:45 UTC (180 media records)
- **The place-id bug has grown:** `place:lisbon` 10 records (the id is `lisboa`), `place:madeira` 6 and `place:acores` 6 (no such places). Lisboa still reads as a gap. Still no gate check. ontologist@ (records and the check), place.districts@ (whether Madeira and the Açores get places).
- **The Algarve now has three outlets** (A Voz do Algarve, Algarve Primeiro, Barlavento): the gap I noted at 23:00 is closing. Postal do Algarve still missing.
- MP1 to MP3 and MP5 to MP9 not built yet.

## Checked 17 Nov, 06:45 UTC
Unchanged: `place:lisbon` 10, `place:madeira` 6, `place:acores` 6; no gate check yet; MP1 to MP3 and MP5 to MP9 not built.

## Checked 17 Nov, 12:45 UTC (v0.1.1720): dev.places@'s look hooks (51e6a18f4, designer.places@'s ask 12)
A clear step up: the outlet cards with kind chips, "Show all", the outlet page sectioned with "Latest headlines" in cards near the top. Notes, in order:
1. **A reader-facing JSON link:** Barlavento's Feeds list links `https://www.barlavento.pt/wp-json/wp/v2/posts` ("the site's WordPress REST API, latest posts as JSON"). Dinis, 16 Nov 10:40: never a JSON link for a reader. List only RSS feeds for readers; keep the API in the record and the outlet's API data.
2. **The page lost its lede:** the summary line under the name is gone. Put back one sentence: "A regional newspaper covering the Algarve, Faro and Loulé, since 1975." (MP6, from the record's own facts).
3. **Lisboa is still a false gap:** `place:lisbon` (10), `place:madeira` (6), `place:acores` (6) still match no place. ontologist@.
4. **The index groups by kind** (ask 12), not by place (MP1). Live is fine; keep it, and add a place filter above "The outlets" ("Show outlets covering: [Algarve] [Lisboa] ..." from the coverage table), so a reader from Faro can get to the Algarve's outlets in one tap. The coverage table's place names can be that filter.
5. **The "covering the area" column reads 30 or 29 on every row**: it says nothing; drop it, or say once above the table "30 national outlets cover every place".
6. MP5 (raw URLs as link text; dates in ISO) still open: "RSS: all latest articles", "RSS: the Faro section", "Contact page (Ficha técnica)"; "16 Nov 2026".

## Checked 17 Nov, 14:45 UTC
designer.places@'s facts band (02f1605e0) live on Barlavento: the facts read as a band under the name, the kind as a chip: passes. Still open: the lede (note 2 of 12:45), the WordPress JSON feed for readers (note 1), Lisboa (note 3), MP5.
