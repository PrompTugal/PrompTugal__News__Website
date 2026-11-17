# Brief: the PrompTugal data site, and focused newsrooms on top

From writer-09 (newsroom.sgit.ai), written at Dinis's request from his dictated brief, sent to conductor@PrompTugal.dinis on 17 November 2026 at 17:30 UTC; recorded here by the conductor for the team on account B. Decisions marked [Dinis] are his. The public article: https://newsroom.sgit.ai/articles/newsrooms-on-open-data.html

## Why

When Dinis shows PrompTugal.news, people like the live data most: weather, fire risk, flights, each value with its provenance. The data is spread across PrompTugal__News__Website, PrompTugal__News__Storm-Charles and others. Consolidate it, then build focused newsrooms on it.

## 1. Observability first

- Visits collected on every site and a daily debrief.
- **Checked by the conductor, 17 November, 17:35 UTC:** `obs.js` is on promptugal.news (front page and place pages, `assets/obs/obs.js`) and on storm-charles.promptugal.news (`app/agents/obs.js`); newsroom.sgit.ai has none. observability@'s hourly drain in `board/schedule.json` has been disabled since the account move on 16 November, and observability@ was not restarted on account B, so **views are collected but not drained and no daily debrief is made.**
- To do: restart observability@ (or give the drain to another agent), re-enable the drain, and produce one daily debrief per site and page (visits, reads, countries and cities, referrers if captured), sealed to Dinis as now. Its drain credentials are recoverable from `newsroom/observability/sealed/dinis.json` (its own notes). Observability on newsroom.sgit.ai: [Dinis].

## 2. A data repository and site

- New repo and site, name [Dinis]. Suggestion: PrompTugal Data, data.promptugal.news, repo PrompTugal/PrompTugal__Data.
- Public sources only; one folder and one vault per source. Start with what runs today: IPMA (warnings, station observations, city forecasts, fire risk d0 to d2, UV, sea forecast), adsb.lol flights around Faro, MeteoAlarm CAP Portugal, Wikipedia pinned revisions, the 34 Storm Charles datasets (archived with hashes), the place files' public sources.
- Per source: the collector as code (move `board/tools/local-now.mjs` and the storm site's collectors there; keep 2 to 3 seconds between requests and backoff); a versioned vault with a public read key where the source is public; OpenAPI 3.1 and a Swagger page (reuse `newsroom/build/features/openapi.mjs`); provenance on every value (source, page, read_at, by); a card with the owner agent, the schedule, the source's reuse terms (public is not always free to republish) and the split below.
- PrompTugal.news and the place pages then read the data site's APIs instead of their own copies.

## 3. Code, agents and people, and tokens

Per dataset and per page made from it: what runs by code (no model), what by agents (which agent, which model), what a person checks; tokens and API-equivalent cost from accountant@'s ledger, shown on each card. Mostly code means nearly free to run.

## 4. Focused newsrooms (after the data site)

Sub-brands under promptugal.news [Dinis: names, domains], each run by a small agentic team, each a possible company. Candidates: Agriculture; Investors; The sea; Fire and civil protection (the storm site made permanent); Tourism and travel; AI. Each publishes with the provenance model and the reading meter.

## 5. Also on newsroom.sgit.ai today

"paid-by-the-read" (monetisation for newsrooms: the meter, a revenue share when PrompTugal.news carries a newsroom's story with its source tracked, the associations to approach); Dinis wants a PrompTugal variation of it, quoting the newsroom article. "any-data-with-any-data" (connecting datasets in nine steps, sold as cells).

## Questions for Dinis

1. The data site's name and domain. 2. Which focused newsroom first. 3. Observability on newsroom.sgit.ai too?
