---
title: "Reactivate the storm, from here: only the relevant parts, and refresh what can be shown locally"
given: 2026-11-16, Dinis to conductor@PrompTugal.dinis in its own session
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# Reactivate the storm, from here

## Dinis's words

"Can you look at reactivating the storm? Maybe we do it from here, but let's see if you can do it so that we don't have all the agents, maybe some of it, see how we can do it ... or maybe see the ones that are relevant, because one of the things that I was asking and showing, asking the iOS and the agents to look at is what information can we show locally, right? So what information from that website that we now collected, that we have the data for, how much information can we actually show locally? So then we should refresh that data and have that data nicely updated."

## What this means (conductor's reading)

- Not the storm site's 46 incident agents. The parts that read open data with no model (IPMA first) run from here, for every place, and stay fresh.
- The question to answer per place: what the storm site's sources can say about that town, today and every hour. The answer, measured on 16 November: `board/briefs/2026-11-16-storm-local-data.md`.
- It extends `2026-11-16-live-local-signals-and-what-is-local.md` (relayed earlier the same night): this is the build order for its point 1.

## For whom
datasci.places@ (the collector and `/api/v1/places/<id>/now.json`), dev.places@ (the "Now in <town>" panel), viz.places@ (the region map), ios.places@ through conductor.a.ios@ (the app reads the same GET), data.places@ (signals linked to stories).

## Faro airport traffic: yes (Dinis, 16 November, about 01:00 UTC, in the conductor's session)

"yes, add Faro airport traffic too"

- datasci.places@ adds Faro airport (LPFR) to the same collector: the storm site's `tools/flights-poll.mjs` (and `flights-common.mjs`) with an area around 37.0144, -7.9659, 40 nm, from adsb.lol's public API (no key; 500 requests a day per IP: one poll every 10 minutes at most, 144 a day).
- **Its privacy rule, unchanged:** airline flights (an airline's ICAO code and a flight number) keep callsign, airline and type; every other aircraft keeps only its category and a rounded position, never a callsign, ICAO24 address, registration or type; aircraft withheld at their owner's request are counted, never shown.
- Out: `data/by-place/now/faro.json` (and the region's) gains `airport` (airline flights near LPFR in the last hour, arriving and leaving, the count of others, the time read, the source); the GET `/api/v1/places/faro/now.json` and the OpenAPI say so. viz.places@ may draw it on the region map; the iOS app reads the same endpoint.
- Probe at about 00:55 UTC: adsb.lol answered (HTTP 200), no aircraft within 40 nm at that hour.
