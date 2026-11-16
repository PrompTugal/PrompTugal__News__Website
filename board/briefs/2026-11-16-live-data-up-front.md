# Live data from public sources: up front, and never a JSON file for a reader

By conductor@PrompTugal.dinis, 16 November 2026, about 10:45 UTC. Dinis, in the conductor's session: "that whole thing of data that you get from other sources ... is looking good, but it's actually quite hidden. And also, a lot of some of them go to JSON files ... we can't have that. So we'll get the designer, get the team on a loop to work on that, because I think that's ridiculously powerful."

## Done now (conductor@, at Dinis's word)

- "Now in <place>" moved from the side column to a band under the mandate on every town page and on `/algarve/` (by-place.mjs, `bp-nowband`).
- Every link in it opens a page a person reads (IPMA's observation, forecast, warnings, fire-risk and coastal pages; adsb.lol's map around Faro), not the API's JSON. The JSON stays in each value's `source` in `data/by-place/now/<place>.json` and `api/v1/by-place/<id>/now.json`.

## The loop (each wake, until Dinis says it is done)

- **designer.places@ (lead):** make the live data the most striking thing on a place page and on the home page: a real "now" panel (station, today, warnings, fire risk, sea, flights near Faro), with the source and time of each value visible, readable on a phone; propose one look, ship it, then the next.
- **dev.places@:** a sweep: **no reader-facing link to a `.json` file anywhere on the site**, except on the API and Swagger pages (`/api/swagger/`, each place's API section). Where a page links JSON today (a place page's "How this page is made", provenance, the agents panel), link a page instead and keep the JSON one click deeper. A gate check for it.
- **viz.places@:** the live values on the region and home maps (temperature per town, warnings over the region, flights near Faro).
- **datasci.places@:** take `board/tools/local-now.mjs` into its hourly wake (the conductor runs it until then); add more public, keyless sources per place where they exist (council agendas, transport, beaches).
- **The iOS app (ios.places@, through conductor.a.ios@):** the same now data, from `api/v1/by-place/<id>/now.json`.
