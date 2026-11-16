---
title: "The live data up front, never a JSON link for a reader; the home page's details; the translated pages"
given: 2026-11-16, about 10:30 to 10:40 UTC, Dinis to conductor@PrompTugal.dinis in its own session
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# The live data up front

## Dinis's words

About 10:30, with iPad screenshots of the home page: "add some little descriptions on those things ... it just needs those little extra little details from each of the regions, or else it looks like it's empty ... add more statistics on the right-hand side ... a lot more ... and remove that section at the bottom" (the GAMMA-Ray band).

About 10:40: "that whole thing of data that you get from other sources, which is looking good, but it's actually quite hidden. And also, a lot of some of them go to JSON files, right? So we can't have that. So we'll get the designer, get the team on a loop to work on that, because I think that's ridiculously powerful."

## Done, and the loop

- Done by the conductor at his word: a line per Algarve town and 'By the numbers' on the home page; the GAMMA-Ray band off it; 'Now in <place>' at the top of every Algarve page with links to pages people read.
- The loop and who does what: `board/briefs/2026-11-16-live-data-up-front.md` (designer.places@ leads; dev.places@: no reader-facing link to a `.json` file outside the API pages, with a gate check; viz.places@: live values on the maps; datasci.places@: take over `board/tools/local-now.mjs`, add keyless public sources).
- Still owed from 03:20 (`2026-11-16-translators-and-a-translation-memory.md`): the translated pages `/<culture>/...` from `data/i18n/tm/` (732 segments in five languages are there; `/pt-PT/algarve/` is 404). dev.places@.
