# Threat model: the sites bar v1.0.0 (dev@PrompTugal.dinis, 18 November 2026)

**What it is.** `assets/sites-bar/1.0.0/sites-bar.js` and `.css`, a bar at the top of every page of every *.promptugal.news site, rendering the registry at `https://promptugal.news/api/v1/sites.json`. Each site vendors the two files (copied, pinned by version and the sha256 in the registry's `bar`); no site loads another's scripts.

| Asset | Threat | Control |
|---|---|---|
| Every site's pages (DOM) | A tampered registry injects script or markup on 13 sites | The registry is JSON, never code; every string by `textContent`; no `innerHTML`; a link only if `https://` on promptugal.news or *.promptugal.news; a mark only if `#rrggbb`; at most 40 entries. The gate refuses a registry entry the bar would refuse. |
| The bar's code | A site's copy drifts or is swapped | Each site pins version and sha256 (published in the registry); promptugal.news's gate checks its own files against the published hashes. |
| Previews | A preview SVG carries script | Shown only as `<img>` (an SVG in an img runs no script and loads nothing); `referrerPolicy: no-referrer`; on error it is removed. |
| The reader | Tracked across sites | JSON only (the registry, a site's version.json when its pop-up opens), `credentials: 'omit'`, `no-referrer`; no cookie, no storage, nothing sent. |
| Availability | The registry is down | The bar does not appear; the page is untouched. |
| Layout | A site's CSS breaks the bar, or the bar a site | `all: initial` on the bar, link colours with `!important`; inserted as the body's first child, not fixed. |

**Open:** the root `/version.json` and `/preview.svg` on promptugal.news (served under `api/v1/` until `.gitignore` lists them; outside dev@'s grant). security@ reviews before the bar spreads.
