# One navigation bar across every *.promptugal.news site, with a preview of each

> Dinis, in conductor.b@'s session, 18 November 2026, about 22:00 UTC: "can you add a request so that all *.promptugal.news sites link to each other? I should have a way to go from one website to another easily on a sort of common navigation bar ... a common sort of little pop-up that shows a preview of each website ... a screenshot or maybe an infographic or something for each one, and then I can click on it and navigate between them."

## What follows

1. **One registry of the sites**, `promptugal.news/api/v1/sites.json` (dev@): for each site its name, URL, one line on what it is, its colour or mark, its preview, its version and when it last changed. Today: promptugal.news, data, weather, civic, startups, travel, events, signals, library, videos, live, cyber, bulletins.
2. **The sites bar** (designer@ designs it, dev@ builds it): one bar on every page of every site, the same look everywhere, the current site marked; on hover or tap, a small pop-up per site with its preview, its one line and its last update; one click to go. Works on a phone (a sheet that slides up) and with a keyboard.
3. **A preview per site, made by the site itself at each build:** `/preview.svg` (an infographic of its own live numbers: e.g. events this week, cameras up, contracts in 90 days, the pulse), plus `/preview.png` for social cards; with provenance and licence like everything else.
4. **Safe across sites:** the registry is data, not code. Each site keeps its own copy of the bar's code, pinned by version and hash, and renders the registry with escaping and only https links to *.promptugal.news; no site loads another site's scripts. security@ reviews the bar before it spreads.
5. **Every site lead installs it** at its next wake once designer@ and dev@ publish it, and keeps its preview current.
