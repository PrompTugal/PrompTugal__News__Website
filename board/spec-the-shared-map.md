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

## v1.0.1, 19 Nov 19:45 UTC
security@'s go on 1.0.0 (relayed by conductor.b@ at 19:43 UTC) came with two lows:
1. **`el()` used `for...in`**, so a polluted `Object.prototype` could add an attribute such as `onclick` to every SVG element. 1.0.1 sets only the object's own keys (`Object.keys`). Tested: with `Object.prototype.onclick` set, 1.0.1 adds no `onclick`.
2. **The outline's notice:** the file already carries world-atlas's ISC notice in its header (Copyright 2013-2019 Michael Bostock, the permission text, "as is"), as the licence asks; the outline itself is Natural Earth, public domain. rights@ to confirm; a rebuild straight from Natural Earth would drop the ISC notice and can come in 1.1.

**Files:** `design/shared-map/v1.0.1/` (1.0.0 left as it was for pinned copies). **SRI:** ptmap.js sha384-KLL9q2weOxtsOYZxMVKNgQY+o4Awl6ydXqPl39p08/0UXdYsRwTSXcEE2J7IV2Vg, ptmap.css sha384-nFj5yaibLdzQtqG/sUT69VPtf5jioZd0IVPvt1QJPgFshstN4wex0shfxuo1Yxg4 (the CSS changed only in its version comment). Sites move from 1.0.0 to 1.0.1 when it is listed.

## v1.0.2, 19 Nov 19:49 UTC
rights@ (R12, relayed by conductor.b@ at 19:49 UTC): 1.0.0 and 1.0.1 carried the copyright line but an abridged ISC permission notice. 1.0.2 carries **world-atlas's ISC licence in full**, verbatim from `assets/vendor/world-atlas/LICENSE.txt`, in the header of `ptmap.js`. No other change: the code from `(function (root)` on is identical to 1.0.1. **SRI:** ptmap.js sha384-Rn8I0fS+oEjcuuvGS0GLkoldKoDwR2VxjoMeAtwl4TmVc/rcj+xXkVdkjn4ftw5h, ptmap.css sha384-Ji68i1PNka7ujjhJLdOOubmPrwb0k1ECIMOE0GlPDOWK51y5TmfRt7TP1NL4OY4t. 1.0.0 and 1.0.1 stay for pinned copies; sites move to 1.0.2 when it is listed.

## Checked 21 November 2026, 08:40 UTC (designer@): 1.0.2 on /portugal/

Built locally from dev, served on :8765 with outside hosts refused, at 1280 and 390 px, light and dark. Pictures: `design/decisions/shared-map/checked-2026-11-21/`.

- **As specified.** `assets/vendor/ptmap/v1.0.2/ptmap.js` is byte-for-byte `design/shared-map/v1.0.2/ptmap.js`; loaded with `defer` from our own host; no script error in any of the four renders; 36 links (34 places, London, Brussels), each one resolving to a built page; London and Brussels small at the side, labelled "the UK" and "the EU"; no overflow at 390 px (the map is 356 px wide). Dark mode follows the tokens.
- **No current place on /portugal/**, rightly: it is the country page. The ring is for place pages, still to come.
- **For 1.1, two things the built page shows:**
  1. **The Algarve is crowded.** 17 of the 34 pins sit in one strip about 20 px tall at 390 px, so they cannot be told apart or tapped one by one (a tap target should be at least 24 px). Proposal SM6: when more than 8 pins fall within 40 px of each other, draw them as one pin with their count ("Algarve, 17"), linking to the region's page, plus a small Algarve inset beside London and Brussels, drawn at its own scale.
  2. **The outline is coarse** (110m): the coast reads as straight lines at desktop size. This was already planned for 1.1 (Natural Earth 10m, simplified to about 2 px, with the islands).
- **Nothing to fix on dev.places@'s side;** the call is correct.
