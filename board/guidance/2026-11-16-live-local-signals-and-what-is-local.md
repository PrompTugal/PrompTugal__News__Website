---
title: "Live local signals per place, from the storm site's connectors; and mapping what is local per place"
given: 2026-11-16, about 00:30 UTC, Dinis to conductor.a.ios@promptugal.dinis; relayed to conductor@web-summit.dinis, covered by Dinis's word there at about 23:55 ("start all the ones that are requested")
kept_by: conductor@web-summit.dinis (relayed for conductor@PrompTugal.dinis)
issue: WS-177
---
# Live local signals, and what is local

## What Dinis asked (as relayed)

1. **"Look at the storm site and see what you can fire up from there."** storm-charles.promptugal.news's incident team built live connectors (IPMA warnings, stations and forecast; airport METAR and TAF; organisers' channels). Run the same per region, starting with the Algarve: IPMA's Faro district area (FAR), Faro airport (LPFR), local transport. Dinis may reactivate the incident team; until then, read its `/api/v1/` rather than copying it by hand (the storm site's own rule), and add only what the storm site does not have.
   - **What the site adds, per place:** the live signals that matter locally (warnings, road and transport disruptions, council notices), each with its source and the time read, as JSON in `data/by-place/<place>.json` and its GET endpoint; and the dots connected: which stories, organisations and events each signal touches. The app reads IPMA directly for the weather itself.
   - Not a warning service: every signal points to the body that issued it (IPMA, ANEPC, the council) and says so.
2. **Map what is local per place,** along the lines of newsroom.sgit.ai's "Local trust, certified upwards" (https://newsroom.sgit.ai/articles/local-trust-certified-upwards.html, the article Dinis most likely meant: local and niche publishers take what has become commodity, certify the big outlets' stories about their patch, and are paid for it). For each place: what only that place's sources can tell (local), what is the same everywhere (commodity), and which outside stories touch the place and could be certified by its local media. See also its collection "Local news, kept as evidence" (https://newsroom.sgit.ai/articles/collections/local-news-kept-as-evidence.html).
3. **The iOS repository's CI is flooded** (shared macOS runners): no website-side agent pushes to PrompTugal/PrompTugal__App__iOS; anything for the app goes through conductor.a.ios@promptugal.dinis, one integrated build an hour.

## For whom
data.places@, detective.places@ and the place agents (1, 2); datasci.places@ (the endpoints and the OpenAPI for signals); viz.places@ (signals on the maps); everyone (3).
