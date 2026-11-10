# Proposal: one page for the storm on promptugal.news

From weather@PrompTugal.vicky, 10 November 2026, at Dinis's guidance ([the storm as our case study](../../board/guidance/2026-11-10-the-storm-as-our-case-study.md)). **A proposal, not a build:** dev.graphs@ and designer@PrompTugal.dinis help with the graph and the layout only at Vicky's or Dinis's word. The reviewer publishes; the desk supplies data.

## The page

**Path:** `/storm/charles/` (or `/the-summit/storm/` if the summit section is preferred). Title: "Storm Charles and Web Summit: what is decided, by whom, and what it means for Wednesday". Linked from S41 and from the S41 lead on the home page.

From the top, on a phone first:

1. **The status strip** (one line each, with the time read): IPMA's Lisbon warnings (wind red 12:00 to 21:00, rain red 12:00 to 18:00); the government's alert situation (00:00 to 23:59 Wednesday); Web Summit's word on Wednesday ("no change announced" until it says otherwise). Data: `desks/weather-vicky/s41-lead.json`.
2. **What it means for you tomorrow:** transport (Metro, Carris, Fertagus, ferries, CP, the airport), the venue, side events and meetups, parks and the waterfront. Only what each operator or authority has said, with "not announced" where nothing is. Data: `live.md`, from the connectors.
3. **The decision graph, live:** decision-makers as nodes (IPMA, ANEPC, the government, the city, the schools, the port, the operators, the venue, Web Summit); edges "this usually follows that". Each node coloured happened / expected / not announced, with the time and the source; each edge with the lead time history shows. Predictions drawn dashed and labelled "analysis". Data: `desks/weather-vicky/decision-graph.json` (next run).
4. **The timeline:** newest first, every entry with its source and UTC time (= Lisbon time). Data: `live.md`'s timeline.
5. **Then and now:** past storms (the historian's table) and how long each step took then, against now. After Wednesday: what was predicted against what happened.
6. **The evidence:** the observed wind at Lisbon's stations and the airport's gusts, hour by hour, against the warning window (IPMA open data, `data/*.json` snapshots). A simple bar or line chart.
7. **The sources:** the source map, with which ones a machine can read and which a person must read (lisboa.pt, the airport, CP).
8. **The team behind it:** the agents (weather desk and its sub-agents: meteorologist, historian, researcher, law, Câmara), each with what it did and its commits; the reviewer and the journalist. Links to the run reports.

## What it needs

- **Data, from the desk (ready or next run):** `s41-lead.json`, `live.md`, `decision-graph.json`, `data/<time>.json` snapshots, the historian's and the law agent's tables.
- **Build (dev.graphs@, at Vicky's or Dinis's word):** a page that reads those files at build time; the graph as SVG from the JSON (no new dependency); the chart from the snapshots.
- **Design (designer@, same word):** the status strip and the graph legend in the Front Page (design E) style.
- **Review:** the reviewer checks every line against its source, as for S41; nothing on the page that is not in the desk's sourced files.

## What it must not do

No forecast of our own; no advice beyond the authorities' own; no inference about Web Summit's programme; no contact details; no press reports used as fact for the present (history may cite press, labelled as press).
