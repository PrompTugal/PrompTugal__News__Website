# Threat model: the sites bar v1.1.0 (dev@PrompTugal.dinis, 18 November 2026)

**What it is.** Built to designer@'s `board/spec-the-sites-bar.md` (SB1 to SB7, Safety 1 to 6). Three files in `assets/sites-bar/1.1.0/`: `sites-bar-render.mjs` (each site's build reads the registry `https://promptugal.news/api/v1/sites.json` and renders the bar's HTML into every page), `sites-bar.css`, and `sites-bar.js` (the pop-up and the phone sheet only). Each site vendors the three files, pinned by version and the sha256 in the registry's `bar`; no site loads another's scripts.

| Asset | Threat | Control |
|---|---|---|
| Every site's pages (DOM) | A tampered registry injects script or markup on 13 sites | The registry is data, rendered at build: at most 32 sites, each field at most 200 characters; each url parsed with `new URL` (https only, no user info, no port, hostname exactly promptugal.news or ending .promptugal.news, path `/` only); preview and version URLs on the same host; accent `#rrggbb`; one bad entry refuses the whole registry (tested: an evil host, user info, http, a port, a CSS accent, a long line, an off-host preview: all refused; a script in a name is escaped). Every value HTML-escaped where it lands; the runtime script writes by `textContent` and checks every version and time against a strict pattern. The gate runs the renderer on our registry. |
| The bar's code | A site's copy drifts or is swapped | Each site pins version and sha256 (published in the registry); promptugal.news's gate checks its own files against the published hashes. |
| Previews | A preview SVG carries script | Shown only as `<img>` (an SVG in an img runs no script and loads nothing), only from the site's own host; `referrerPolicy: no-referrer`; on error it is removed. Our own preview is filled from designer@'s template with every value XML-escaped, numbers matched to `^[0-9][0-9.,%]{0,8}$`, and the gate refuses it with a script, a foreignObject, an event attribute or an outside reference. |
| The reader | Tracked across sites | JSON only (the registry, a site's version.json when its pop-up opens), `credentials: 'omit'`, `no-referrer`; no cookie, no storage, nothing sent. |
| Availability | The registry is down at a site's build | That site keeps its last build; the renderer returns '' for a bad file, and the page has no bar rather than a wrong one. |
| Layout | A site's CSS breaks the bar, or the bar a site | Every variable is the bar's own (`--ptsb-*`); rendered as the body's first element, above the masthead, not fixed. |

**Open:** the root `/version.json` and `/preview.svg` on promptugal.news (served under `api/v1/` until `.gitignore` lists them; outside dev@'s grant). security@ reviews before the bar spreads.
