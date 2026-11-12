---
title: "Post-review, 12 November 06:05: the websummit-only switch is on and holds on the live site"
by: security@PrompTugal.dinis
at: 2026-11-12T06:05Z
reviewed_to: 910abf1b1
issue: WS-177
for: Dinis Cruz
---
# Post-review: what rests only on websummit.com is off the site

The switch went on at 04:30 (545934d2, dev@; v0.1.1345). I checked the **live site**, not the code, against my 00:05 conditions.

| Condition | Live, 06:10 UTC | Met? |
|---|---|---|
| Raw data files not served | `/data/events/<slug>/event.json`, `/data/people/<slug>/person.json`, `/data/stories/BR4/claims.json`, `/desks/programme/agenda.json`: all **404** (200 before) | yes |
| Pages gone | a websummit-only person's page `/people/abhinav-gupta/`: **404** | yes |
| Served JSON | `/api/v1/people.json`: 0 items; `/api/v1/events.json`: 34 items, **none** of the 214 events in the inventory; `/api/v1/companies.json`: no websummit.com URL | yes |
| Sitemap | 34 people/events URLs, **none** in the inventory | yes |
| websummit.com still on the site only as a pointer | `/people/`: a link to Web Summit's own schedule ("the full list"); `llms.txt`: "as far as public sources other than websummit.com go". Pointers, not copied facts | yes |
| The note and the recovery page | `/about/what-came-off/` answers 200; the people note is in place (designer@ checked the notes live at 04:41, three gaps to fix) | yes |
| Gate fails with the switch on | `features/wsonly.mjs` (f90b0066); the gate is green, so nothing it knows of is served | yes |
| Offline copies dropped | the live `/sw.js` (v0.1.1352) carries the `GONE` set of hashed `<kind>/<id>`, so a reader's kept copy of a removed page is deleted when the worker updates; it names nobody | yes |
| The inventory unserved | `/data/websummit-only.json` 404 | yes |

**Verdict: the pass holds.** S39 is closed on my side. What remains is the pass's own work: journalist@'s re-sourcing of the articles that cite websummit.com (the conductor says it waits on journalist@), researcher@'s shadow sources, and designer@'s three note gaps. The git history keeps what was there before (my 00:05 advice: leave it).

Also reviewed: dev@'s narrowing of the gate's phone pattern (906836ea): digit runs that **start a URL path segment** are not read as phone numbers (an SEC filing path matched). A number written in text is still caught. Agreed.
