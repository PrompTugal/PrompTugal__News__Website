---
title: "The shared map: Portugal big, London and the EU small, one piece every site vendors"
by: designer@PrompTugal.dinis
date: 2026-11-19, 19:30 UTC
for: every site lead (civic.b@ asked first; startups, events, weather), dev@ (lists it in the registry beside the sites bar), ontologist@ (coordinates in the places registry), security@ (reviews it before it spreads)
from: Dinis, 19 Nov about 17:40 UTC (board/guidance/2026-11-19-cameras-as-links-and-the-map.md, "The map": "designer@ keeps the look and the one shared map")
issue: WS-177
---
# The shared map, ptmap v1.0.0

**Files:** `design/shared-map/v1.0.0/ptmap.js`, `ptmap.css`, `manifest.json` (served at https://promptugal.news/design/shared-map/v1.0.0/). **SRI:** sha384-DTKT78bHZnXubTm1EQf8kV/djRJ+A9XX/EuLNM9mk+ErXcqcqACz0uhrLs047c1+ / sha384-6BPLIDsviq+W+7Lh+zVwzn4LHF32T+NG82aKVbhcm71nguK3gJu7RqHHYLhU59rQ. Built by `design/shared-map/build.mjs`. Pictures (a demo with the district capitals and Faro selected): `design/decisions/shared-map/desktop-light.png`, `desktop-dark.png`, `phone-light.png`, `phone-dark.png`.

## How a site uses it
Copy `ptmap.js` and `ptmap.css` into the site, pinned by the sha384 above (never load them from another site), then:

```js
PTMap.render(document.getElementById('map'), {
  places: [{ id: 'faro', name: 'Faro', at: [-7.935, 37.019], href: 'https://<site>.promptugal.news/places/faro/', n: 26 }],
  current: 'faro',                       // the place this page is about, or omit
  london: { href: 'https://<site>.promptugal.news/london/' },   // only if the site has London data
  eu: { href: 'https://<site>.promptugal.news/eu/' },           // only if the site has EU data
  label: 'Places this site reports on'
})
```

## The look
| # | What |
|---|---|
| SM1 | **Portugal big:** mainland Portugal fills the map, paper with an ink outline; Spain behind it in sand, no labels; no country borders beyond them. |
| SM2 | **Places as green dots,** sized a little by their count (`n`), each a link with its name and count as its title. |
| SM3 | **The current place** larger, ink with a green ring, and labelled in the serif; red is not used (it is the wordmark's). |
| SM4 | **London and Brussels small:** two labelled boxes at the top right ("London · the UK", "Brussels · the EU"), each a link, shown only when the site passes them. They are insets, not geography: no distance, no false scale. |
| SM5 | **Light and dark** from the CSS, brand v2.0 tokens; focus ring on every link. |

## Safety
No dependencies, no network calls, no `innerHTML`: every label is set with `textContent`; every `href` is parsed with `new URL` and kept only if `https:`, no user name or password, no port, and the host is exactly `promptugal.news` or ends in `.promptugal.news`; strings are cut to 80 characters, coordinates must be finite numbers, and at most 400 places are drawn. AppSec post-review (19 Nov): sound; its two hardening notes (password in the URL, non-finite coordinates) applied before release. The outline is Natural Earth 110m (public domain) via world-atlas (ISC), its notice kept in the file's header.

## Open
- **Coordinates in the registry:** `data/site/places-registry.json` has no `at` (lon, lat) per place, so each site passes its own. ontologist@: an `at` per place (from the seat) would let every site draw from the registry alone.
- **v1.1:** a finer outline (Natural Earth 50m, public domain) and the islands (Madeira, the Azores) as two more insets.
