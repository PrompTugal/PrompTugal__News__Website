---
title: "sherpa@: offline mode, as an attendee at the venue with no Wi-Fi (v0.1.492)"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
measured: 2026-11-07T09:35Z, live site v0.1.492
how: Playwright with Chromium, iPhone 13 profile (390 x 664). Online once: the home page, one article (tapped 'Save for offline'), /summit/. Then the network off (context.setOffline) and eleven pages opened. Screenshots in design/shots/sherpa/0930/
for: board/passes/2026-11-06-offline-mode.md, row 4 (sherpa@, synthetic@)
issue: WS-177
---
# Offline mode, read as the attendee with no Wi-Fi

A review, not user research. The persona: an attendee who opened PrompTugal.news once on the hotel Wi-Fi, saved one article, and is now in the MEO Arena with no signal.

## What works (keep)

- **The service worker is live** (scope `/`), and **the home page and /summit/ open offline**, each with a plain band at the top: 'Offline. This copy was kept Sat 09:30.' Clear, honest, the copy's time shown (security@'s condition met).
- **'Save for offline' on an article** is easy to find (435 px down on a phone, under the standfirst) and turns into 'Saved for offline (remove)' at once; the saved article opens offline with the band.

## Findings, ranked

| # | Finding | Owner |
|---|---|---|
| O1 | **Four of the five tabs fail offline.** The tab bar is what an attendee taps, and only Now works: **Agenda** (`events/index.html`) and each event page show 'You are offline. This page was not kept on this device'; so do **News** (`articles/index.html`) and **Companies**. The pass's first promise ('the summit's days and agenda ... open with no network') is the Agenda tab, and it is the one that fails. Cache the Agenda tab's page and the event pages for the summit's days (they are small), and the News list | dev@, dev.pages@ |
| O2 | **Any address with a query fails with the browser's own error page,** not the site's offline page: `?design=e` (any home design but the default) and a search (`search/index.html?q=...`). A reader sees Chrome's 'No internet', with no way back. The service worker should answer these with the cached page (ignore the query for the home designs) or the site's offline page | dev@ |
| O3 | **The site's offline page looks broken:** no styles, no top, no tab bar, blue underlined links; a reader takes it for an error. It lists only 'The front page' and 'The summit, day by day', not the articles the reader saved ('Articles you saved for offline open as usual', without naming them). Give it the site's look and the tab bar, and list the saved articles by title | dev@, designer@ |
| O4 | **Which articles open offline is a guess:** an article the reader did not save ('Beyond the pavilion', Brazil's doors) opened offline, while another linked from the same home page (Rio's ten startups) did not. Mark the links that will open offline on the cached pages (a small 'saved' or 'kept' mark), or keep every article linked from the cached home page | dev@, designer@ |
| O5 | **The reading credit went down** from £5.00 to £4.99 between visits, and shows offline too; a reader at the venue will wonder what they are spending (the pounds-or-euros question is with Dinis) | designer@, Dinis |

## For synthetic@

Not tested here: Safari on a real iPhone (the service worker's storage limits and eviction differ in WebKit), and a reader whose first visit was days ago (the copy's age). T24 and these belong in a WebKit run.

## Re-measured after dev@'s two offline rounds (12:35 UTC, v0.1.532)

The same test (online once, one article saved, network off), plus the Search tab and an Agenda address with a query; and a look at what the service worker keeps (Cache Storage after 3, 20 and 60 seconds: 195 entries, one cache `pt-shell-v0.1.532`).

| # | 09:35 | 12:35 |
|---|---|---|
| O1 four of five tabs fail | open (rank 1) | **still fails for the reader, for a new reason (O6)** |
| O2 query addresses get the browser's error | open | **done:** `?design=e` opens the kept home page with the band; a search or an Agenda address with a query opens the site's offline page |
| O3 the offline page unstyled, saved articles not listed | open | **done:** 'Offline copies' is a page of the site with the top and the tab bar, and lists 'Articles you saved' with the time each was kept |
| O4 which articles open offline is a guess | open | open: Rio's ten startups (on the home page) still does not open; Brazil's doors does. The 'kept' marks on links are designed (designer@'s spec, round 2) |
| O5 the credit changes | open | open (with Dinis) |

**O6, new, rank 1: the pages are kept, but under another address than the links ask for.** The service worker keeps `/events/`, `/articles/`, `/companies/` and 80+ event pages as `/events/<slug>/`, and they open offline at those addresses ('Events', 'Articles', 'Opening Night'). But every link on the site, the tab bar's included, asks for `.../index.html` (`/events/index.html`, `/articles/index.html`, `/events/opening-night/index.html`), which the cache does not match, so the reader lands on 'Offline copies' instead. Tapping Agenda, News or Companies with no network still does not give the page. One fix: in the service worker, match `<path>/index.html` and `<path>/` as the same page (both when keeping and when answering). Screenshot: `design/shots/sherpa/1230/` (the Agenda tab offline).
