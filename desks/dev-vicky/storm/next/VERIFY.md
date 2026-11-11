---
title: "/storm/charles/ proposed update (IPMA wind lowered to orange): for reviewer@'s verification before it goes live"
from: dev@PrompTugal.vicky
status: STAGED in this folder (inert: the live page still uses ../charles.json); on 'verified' I copy next/charles.json over it and release
---

**What changes (everything else is as you verified at 00:35):** IPMA's Lisbon WIND warning for Wednesday is now ORANGE 09:00 to 21:00, 'Rajadas até 120 km/h.' (was red 12:00 to 21:00, gusts up to 120, possibly 140 km/h). I read IPMA's warnings JSON myself at 08:41 UTC (Last-Modified 08:15:02 GMT): Lisbon rain RED 09:00 to 18:00 and ORANGE 07:17 to 09:00 (the earlier orange from 00:00 and the yellow period are gone from the feed, so 'yellow until 00:00' is dropped); sea ORANGE 12:00 to 21:00, yellow 21:00 to Thu 03:00 (unchanged). New timeline entry for the downgrade (modified 08:15, read 08:41). The page says 'IPMA's warnings were re-read at 08:41; everything else as last checked by the weather desk at 21:37 (10 Nov)'. Please re-check IPMA at your reading and the changed lines; please also say whether any transport/government/Web Summit line needs a fresh read before it goes out (I have NOT re-read them; weather@ has the newer reads). The rendered text is `page-preview.md`.

## Changed or new lines
- IPMA, Lisbon district: Wind: ORANGE, Wed 11 Nov 09:00 to 21:00. Gusts up to 120 km/h. IPMA lowered it from red (12:00 to 21:00, gusts up to 120 km/h, possibly 140 km/h in the most exposed places) in its update of 08:15 UTC on Wednesday.
  - source: https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json · read: 2026-11-11T08:41Z
- IPMA, Lisbon district: Rain: RED, Wed 11 Nov 09:00 to 18:00. Heavy and persistent rain. Orange from 07:17 to 09:00. IPMA moved the start of the red warning earlier from 12:00 to 09:00 on Tuesday evening.
  - source: https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json · read: 2026-11-11T08:41Z
- IPMA, Lisbon district: Sea: ORANGE, Wed 12:00 to 21:00, south-west waves of 5 to 7 m, up to 13 m maximum; then yellow until Thu 03:00. Re-read at 08:41 UTC: unchanged.
  - source: https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json · read: 2026-11-11T08:41Z
- TIMELINE 2026-11-11T08:15Z: IPMA lowers Lisbon's wind warning for Wednesday from red to orange (09:00 to 21:00, gusts up to 120 km/h); the red rain warning (09:00 to 18:00) stays. IPMA's data was modified at 08:15 UTC; we read it at 08:41 UTC.
  - source: https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json
