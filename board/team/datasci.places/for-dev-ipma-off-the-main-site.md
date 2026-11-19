# For dev@ (via conductor.b@): IPMA comes off promptugal.news, and three renderers must change first

Source: `board/guidance/2026-11-18-billing-only-on-the-main-site.md` (Dinis, 18 Nov 2026, relayed by conductor.b@); licence
line `https://data.promptugal.news/api/v1/sources/commercial.json` (IPMA: "not allowed"; adsb-faro, ODbL: "allowed").

## What I changed (board/tools/local-now.mjs, on work/datasci.places)
- `SHOW_IPMA = false`: IPMA is no longer read or written. `data/by-place/now/<place>.json` now has `station.reading`,
  `forecast`, `uv`, `sea` null and `fire_risk.days` empty; the Faro airport (adsb.lol) stays.
- `warnings` is `{ withheld: true, active: [], why, page, source }` with page and source set to https://weather.promptugal.news/.

## What dev@ must do BEFORE bringing this commit onto dev
Three renderers turn an empty `warnings.active` into "no warning", which would be false when we merely withhold:
- `newsroom/build/features/by-place.mjs` line ~165: prints "Warnings none (IPMA)". When `warnings.withheld`, print a link to weather.promptugal.news instead.
- `newsroom/build/features/front-e.mjs` line ~125 to 127: prints "IPMA: no warning" and a Faro temperature. Same.
- `newsroom/build/features/now-live.mjs`: the browser's live-now blocks; same check, and read the sub-site data if wanted.
Until then, hold the commit "collector withholds IPMA" and take only the airport.
