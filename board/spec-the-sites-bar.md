---
title: "The sites bar: one bar across every *.promptugal.news site, with a preview of each"
by: designer@PrompTugal.dinis
date: 2026-11-18, about 22:30 UTC
for: dev@PrompTugal.dinis (builds it, and the registry api/v1/sites.json), every site lead (installs it and fills its own preview), security@ (reviews the bar before it spreads)
from: Dinis, 18 Nov about 22:00 UTC (board/guidance/2026-11-18-the-sites-bar.md, item 2: "designer@ designs it, dev@ builds it")
issue: WS-177
---
# The sites bar

Pictures, no AI: `design/decisions/sites-bar/desktop-light.png`, `desktop-dark.png`, `phone-light.png`, `phone-dark.png`. Markup and CSS to build from: `design/sites-bar/sites-bar.html.txt`. The preview card's template: `design/sites-bar/preview-template.svg.txt`. Tool: `design/sites-bar/mock.mjs`. In the pictures the preview is promptugal.news's own (98 articles, 36 places, 17 Algarve towns, from this repository); the "updated" time and version under it are examples.

## The bar

| # | What |
|---|---|
| SB1 | **One thin ink bar, 36 px, above each site's own masthead,** the same on all thirteen sites, in light and dark (the bar stays ink in both; dark uses a deeper ink). Left: "PrompTugal.news sites" in the serif with the wordmark's red T and green "ugal". Then the sites by name in the sans at 12.5 px, in the registry's order. |
| SB2 | **The current site is marked** with `aria-current="page"`: full-contrast text and a 2 px green underline; the others in a muted grey that lifts on hover and focus. |
| SB3 | **A pop-up per site** on hover, on focus, and on tap: 340 px wide, under the name, with a small pointer; the site's preview (SB6), then its name and address in the serif, its one line, and a foot line "updated <time> · v<version>" with **Go →**. One click on the name goes straight to the site; the pop-up never blocks that. Opens after 150 ms of hover, closes on leaving or Escape. |
| SB4 | **On a phone** (under 760 px) the names fold into one "Sites ▾" button at the right of the bar; it opens a **sheet from the bottom** (rounded top, a grab handle, a scrim behind) listing every site with its one line, rows at least 44 px, the current one marked "you are here". No previews in the sheet: they cost data on a phone. Swipe down, the scrim or Escape closes it. |
| SB5 | **Keyboard:** the names are links in a `nav` with `aria-label="The PrompTugal.news sites"`; Tab moves through them, focus opens the pop-up, Escape closes it, focus returns to the name; the sheet traps focus while open and returns it to "Sites" on close. Visible focus everywhere. |

## The preview card (each site makes its own)

| # | What |
|---|---|
| SB6 | **320 × 180 SVG, `/preview.svg`, made by each site at each build from its own live numbers** (`preview-template.svg.txt`): a 4 px rule in the site's accent at the top; "<SITE> · NOW" in mono; one big figure with its label; two smaller figures with theirs; a hairline; "read <time> · <licence>" at the foot. Three numbers that say what the site is for today, e.g. weather: warnings in force, places with a reading, the next rain; events: events this week, places, sources; library: items, collections, gaps. Paper background in both themes so it reads as a card. A `/preview.png` of the same at 2x for social cards. |
| SB7 | **Provenance and licence** on the card's foot line, like every other value (`board/spec-the-licence-mark.md`). The registry entry links the data the numbers came from. |

## Safety (guidance item 4; tightened after the AppSec post-review of 18 Nov, 22:35)
1. **Copied, pinned, never loaded across sites:** each site keeps its own copy of the bar's code, pinned by version and hash; no site loads another site's script.
2. **The registry is data:** `api/v1/sites.json` is edited only by dev@ (a commit on this repository, through the gate); each site reads it at build time, caps it (at most 32 sites, each field at most 200 characters) and refuses the whole file if any entry fails the checks below.
3. **Escape on output, everywhere:** every registry field (name, id, line, version, time) is HTML-escaped where it lands, in text and in attributes; numbers and times in the preview match a strict pattern (`^[0-9][0-9.,%]{0,8}$`, `^\d{1,2} [A-Z][a-z]{2}, \d{2}:\d{2} UTC$`) or the card shows a dash. The build-time fill of `preview-template.svg.txt` XML-escapes every value; `accent` must match `^#[0-9a-f]{6}$` or falls back to ink.
4. **Links by exact host:** each `url` is parsed with `new URL`; only `https:`, no user info, no port, and a hostname that is exactly `promptugal.news` or ends with `.promptugal.news` after parsing (never a substring or prefix test). Links carry `rel="noopener noreferrer"`.
5. **Previews as images only:** the pop-up loads `/preview.svg` with `<img>` (never inlined, never `<object>` or `<iframe>`), so no script in an SVG can run; each site serves it as `image/svg+xml` with `X-Content-Type-Options: nosniff`, and its CSP's `img-src` lists the *.promptugal.news hosts. The gate checks each site's own preview.svg has no `<script>`, `<foreignObject>`, event attribute or external `href`.
6. **security@ reviews the bar and the registry check before the bar spreads** (guidance item 4).

## Checked 19 Nov, 00:50 UTC: dev@'s build, v1.1.0 (bf7001f7a), on promptugal.news at v0.1.1834
Pictures of the build: `design/decisions/sites-bar/built/desktop-light.png`, `phone-sheet-dark.png`. At 1280 and 390 px, light and dark; no page wider than the viewport; no page error.
- **Pass:** SB1 (36 px ink bar, the mark, 13 names), SB2 ("News" marked here), SB3 (the pop-up on hover with name, address, one line and Go), SB4 ("Sites ▾" on a phone opens the bottom sheet with every site and its line, "you are here" on the current one; Escape closes it), SB5 in part (Escape works; Tab order not yet checked).
- **Not yet seen: SB6, the previews.** The pop-up shows no preview card; no site serves `/preview.svg` yet (my check loaded only this site). Each site lead adds its own at its next wake (guidance item 5); the pop-up looks right without one.
- **One duplicate to retire:** the old "Also from PrompTugal.news" tab (`.cmore-net`, fixed to the right edge) now repeats five of the bar's sites and covers content at 1280 px. With the bar on every page it can go.

## v1.2: one switcher, every site (Dinis, 19 Nov about 03:18 UTC; the guidance's new section "One way to move between the sites")
Written at 03:20 UTC. Picture: `design/decisions/sites-bar/phone-light.png`, `phone-dark.png` (a sub-site, the library, selected and scrolled into view).
| # | What |
|---|---|
| SB8 | **The bar is the one switcher.** It replaces the hard-coded "The PrompTugal.news sites" block (`em-net` in assets/top/top.tmpl, 5 of 13 sites, new tabs) on promptugal.news and anything like it on a sub-site; every list comes from `api/v1/sites.json`. The old "Also from PrompTugal.news" side tab (`.cmore-net`) goes too. |
| SB9 | **One tap, same tab:** each name is a plain link to the site, no `target`, no pop-up on a phone. On a desktop the pop-up (SB3) is a hover or focus extra; a click still goes straight there. |
| SB10 | **On a phone, one row that scrolls sideways** (replacing SB4's "Sites ▾" and sheet): the names in a single line inside the 36 px bar, 13 px, 44 px tall touch targets, no scrollbar, a fade at both edges so a reader sees there is more, snap to names; on load the current site is scrolled to the centre (`scrollIntoView({inline: 'center'})`) and shown as a filled chip with the green underline. The "PrompTugal.news sites" label is dropped on a phone to save room. |
| SB11 | **On a desktop, all at a glance:** every name in one line (13 fit at 1280 px); if the registry grows past one line, the row wraps to a second line rather than scrolling. |
| SB12 | **promptugal.news always first** on every sub-site, labelled "News"; on promptugal.news itself it is first and selected. The rest keep the registry's order. |
| SB13 | **Keyboard and screen readers:** the row is a `nav` list; arrow keys need nothing special (Tab moves link to link); `aria-current="page"` on the current one; the scroll position never traps focus. |
