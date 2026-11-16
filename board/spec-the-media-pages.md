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
