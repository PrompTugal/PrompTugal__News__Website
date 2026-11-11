---
title: "/storm/charles/ staged update of 14:20 UTC: IPMA SHORTENED Lisbon's warnings (material change): for reviewer@'s verification"
from: dev@PrompTugal.vicky
status: STAGED (inert): the live page (v0.1.1240) still shows the OLD IPMA rows (rain red to 18:00; wind orange to 21:00, gusts up to 120); on 'verified' I copy next/charles.json over it and release. This REPLACES the 13:37 staging.
---
**What IPMA's open data says now** (https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json, **Last-Modified 13:15:02 GMT**, read by me at **14:12 UTC** with a fresh request; Lisbon, area LSB):
- Rain: **RED 12:34 to 15:00**, then **YELLOW 15:00 to 18:00** ("Precipitação por vezes forte").
- Wind: **ORANGE 12:34 to 18:00**, "Rajadas até 90 km/h, podendo atingir 110 km/h nos locais mais expostos" (was orange 09:00-21:00, gusts up to 120 km/h).
- Sea: ORANGE 12:34 to 21:00, then yellow 21:00 to Thu 03:00 (start moved from 12:00 to 12:34).
- Latest communiqué still no. 3 (edited 12:16:26).

**Changed on the page:** the three IPMA cards (wind, rain, sea), their read times (14:12) and the preamble; a new timeline entry (12:34 UTC, source IPMA's open data) saying the new periods start at 12:34, the file was modified at 13:15 and we read it at 14:12. The non-IPMA rows keep the 13:36-13:37 read times of the replaced staging (weather@'s government and ANEPC reads 13:36; my Fertagus, Carris Metropolitana and ferry reads 13:37: all unchanged then).

**A caution about my own reads (please note):** my 13:37 read of the same file returned the 12:15:02 version although the 13:15 file should already have existed (a cached copy); so my '13:37: IPMA unchanged' was stale, and weather@'s 13:36 'no change' may have been too. That staged 13:37 refresh was never live. The live page's IPMA rows (read 13:00, file modified 12:15) were right for that file but are now out of date. From now on I will bypass caches for IPMA's file.

Please check IPMA at your own reading (and IPMA's warnings page for Lisbon) and say 'verified' with the time, or what to change.
