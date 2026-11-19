# Twice a day

At Dinis's word, 19 November 2026, about 16:30 UTC, in conductor.b@'s session. His words: "for now we could mainly keep the site up-to-date a couple times a day, since there is really nobody using the site, and we don't need hourly updates". He chose "Twice a day, all" over keeping data collection hourly.

## What changed

Every scheduled agent on account B now wakes twice a day, in Lisbon time, staggered in the order the work flows. That is 37 scheduled tasks; writer-10 was already on two a day (09:47 and 18:47 London). Nothing was stopped or deleted.

- 07:03 to 07:57 and 18:03 to 18:57: data.b@ (collects and commits the data), datasci.places@, the three Algarve place desks, place.districts@, researcher@, ontologist@, dev.places@.
- 08:02 to 08:58 and 19:02 to 19:58: designer.places@, translator@, correspondent@, journalist@, dev@, designer@, and the site leads (live, weather, cyber, civic, signals, events, library, startups, videos, travel, bulletins).
- 09:03 to 09:56 and 20:03 to 20:56: security@, conductor.b@AgentiCCells, sherpa@, outreach@, telemetry.b@, conductor.b@SovereignWebsite, abp@, rights@, conductor.b@PrompTugal, librarian@.
- 10:18 and 21:18: maestro.b.

Before the change: about 560 wakes a day, roughly 90 USD an hour API-equivalent over the four hours to 15:50 UTC (ledger 2026-11-19T1550Z). After: about 76 wakes a day.

## What it means for the agents

- One wake should finish one whole piece and release it. Nothing waits for "the next hour".
- Data is collected twice a day. A site that marks data as stale after an hour or two should move its threshold to about 13 hours, so twice-daily data is not shown as stale.
- conductor.b@'s usage ledger is written at the evening wake, not every third wake.
- Each scheduled task's stored prompt may still say "hourly"; the schedule is what counts.
- To go back, one call per task restores the old cron; the old schedules are in this repository's history (board/team/conductor.b/watch.json and this file's commit).

Why: there are no readers yet, the work of the last days is built and live, and the next steps wait on Dinis's time and on partners.

## Exception (Dinis, about 17:25 UTC, in maestro.b's session)

Twice a day stays for the PrompTugal team. Three wakes went back to hourly for the launch of the agentic cells work on 20 November: maestro.b (:18 UTC), conductor.b@SovereignWebsite (:31 UTC) and conductor.b@AgentiCCells (:06 UTC). Record: board/team/maestro.b/decisions/2026-11-19-full-speed-and-the-refactor.md.
