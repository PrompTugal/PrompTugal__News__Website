# Hand-over: /storm/charles/ (dev@PrompTugal.vicky, 11 Nov 2026, about 19:15 UTC)

Stopped at Vicky's word (relayed by conductor.B@, about 19:05 UTC). I release nothing more to /storm/charles/.

## State
- **Live:** v0.1.1272 content (IPMA's 16:15 data: no wind warning; rain yellow 15:56-18:00; sea orange to 21:00). Its read times are from 16:37 (IPMA) and 15:36 (government, ANEPC, transport), so it is out of date: rain "yellow to 18:00" has ended and the minister's 16:49 statement is not on it.
- **Staged, inert, NOT verified or released:** `desks/dev-vicky/storm/next/` (`charles.json`, `page-preview.md`, `VERIFY.md`), my last staging of 18:45 UTC (in v0.1.1287). It carries: IPMA read 18:37 (file 18:15:01 GMT; only the sea warning left, orange to 21:00 then yellow to Thu 03:00; rain ended 18:00; no wind); the minister's 16:49 statement (alert to 23:59 Wednesday; Thursday extension not planned; our translation; source in VERIFY.md); weather@'s 18:37 reads (Fertagus 18:10, Carris Metropolitana 20 alerts, Trafaria ferry notice of 14:39 still latest). reviewer@ had not yet answered it. To release: reviewer@ verifies, then copy `next/charles.json` over `charles.json`, `node newsroom/build/build.mjs`, copy `storm/charles/index.md` to `desks/dev-vicky/storm/page-preview.md`, gate, commit with the run report, `AGENT=... newsroom/tools/release.sh`, check the public page.
- Nothing else is unfinished from me.

## What I learned
- Re-read IPMA's open data with the cache bypassed (`Cache-Control: no-cache` and a `?t=` query): my 13:37 read and weather@'s 16:36 read returned older cached copies and produced a false "no change". IPMA's file is re-issued at :15 past the hour and the warning periods start at odd minutes.
- Node fetch ignores the agent proxy here; use curl.
- The Web Summit row and lead are never machine-read (Dinis's rule, 12:45 UTC); they change only with a person's own browser read. Likewise no machine reads of Luma, Meetup or Eventbrite. Rules saved in `desks/dev-vicky/README.md`.
- Staged-then-verified cycle works; an inert staging release can take 6+ minutes because CI cancels runs when others push; `release.sh` may "give up after 5 attempts" (its commit still rides the next push; retry it).
- Where the live page text states a time-bound fact ("in force", "until 18:00") it goes wrong when the time passes; the build could say "ended" automatically (an idea for the team dev@, not built).
- A level class exists for red, orange, gov, summit; yellow and green cards use the plain grey rule (no styling for them).

## Where things are
Desk: `desks/dev-vicky/` (README with the rules, `notes/`, `storm/`). Page builder: `newsroom/build/features/storm.mjs`, styles `assets/storm/`. Satellite loop: `assets/satellite/`. Categories: `newsroom/build/lib/categories.mjs`.
