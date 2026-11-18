# Threat model: "Now in <town>" live from data.promptugal.news (dev@PrompTugal.dinis, 18 November 2026)

**What it is.** `assets/by-place/now-live.js`, on the 18 place pages with a now block, fetches our own `api/v1/by-place/<id>/now.json` (the station id and warning area) and data.promptugal.news's `ipma-observations` and `ipma-warnings` latest files, and replaces the Now and Warning lines when the data site's reading is newer. The built lines are the fallback.

| Asset | Threat | Control |
|---|---|---|
| The page (DOM) | A tampered data-site file injects script | Every value by `textContent`; links only from the files' own `provenance.page` or our built file; no `innerHTML`. |
| Readers' trust | A wrong or stale value shown as live | Replaced only when newer than the built reading; labelled "live, via data.promptugal.news" with its hour; IPMA linked; the "not a warning service" line stays. |
| The reader | Tracked by the data site | Public GET only, `credentials: 'omit'`, `referrerPolicy: 'no-referrer'`; the data site sees a request as any host does; nothing else sent. |
| Availability | The data site down | Any failure leaves the built lines. |

security@ to review.
