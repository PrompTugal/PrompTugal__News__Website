---
title: "Why Vicky's browser showed an old copy of the home page (about 14:40 UTC, 10 Nov): diagnosis and proposed fix"
from: dev@PrompTugal.vicky
for: Vicky Wang (via conductor.B@PrompTugal.vicky); owner of any fix: dev@PrompTugal.dinis (offline files, security@'s rule)
date: 2026-11-11
status: diagnosis only; nothing changed
---
# An old copy of the home page

**What happened.** After several refreshes Vicky's browser showed a saved copy of the home page from about 14:40 UTC on 10 November before the live page appeared.

**Short answer.** It was the offline service worker (`/sw.js`, made from `assets/offline/sw.tmpl`), not the saved design choice. I reproduced the same behaviour in a headless Chromium against a stand-in for the host (cache-control: max-age=600, as GitHub Pages sends). Four things combine:

1. **The "kept" copy that wins is the oldest one.** The worker keeps the home page twice: a snapshot taken when it was installed (`pt-shell-<version>`) and the copy stored after each later visit (`pt-pages`). When it has to answer from a copy it calls `caches.match(key)`, which returns the first cache in creation order that holds the page: the install-time snapshot wins over the newer copy. The snapshot stays as old as the worker's last install.
2. **The network answer is dropped after 4 seconds.** The worker races the network against `WAIT = 4000` ms; on a slow connection (or a failing one) it answers from a kept copy, however old. The page then says nothing unless the browser reports it is offline.
3. **A page with a query is never stored and, when the network fails, opens the kept copy.** `/?design=e` (the team's way of comparing designs) is not stored; with the network failing it opens the plain page's kept copy, i.e. item 1's snapshot, with the banner "Offline. This copy was kept <time>."
4. **"Network first" is not fully fresh.** The worker's `fetch(request)` goes through the browser's HTTP cache, and the host sends `cache-control: max-age=600`; a plain navigation can show a page up to ten minutes old (a reload does not).

**Evidence** (Chromium, stand-in server; each "release" changes a marker in the home page; times from my run):

| Step | Shown | Reading |
|---|---|---|
| release 1, first visit | 1 | |
| release 2, **reload** | 2 | reload bypasses the HTTP cache |
| release 3, plain navigation to `/` | **2** | item 4: HTTP cache, up to 10 minutes |
| release 4, plain navigation again | **2** | same |
| release 5, network takes 7 s, reload | **1** after 4.1 s | items 1 and 2: the answer is the install-time snapshot (release 1), not release 2 or 3, which were stored later |
| release 6, fast again, reload | 6 | live again |
| release 8, **offline**, `/?design=e` | **1**, banner "Offline. This copy was kept Wed 07:51." | item 3: the snapshot, with the banner Vicky would see |

The banner text matches what was reported: a kept copy dated about 14:40 means the install time of her worker version.

**Why the snapshot can be hours old in real use.** Every release gives `/sw.js` a new version, and each new worker installs by fetching 203 pages and files (about 5.6 MB uncompressed) before it takes over. On a phone with a weak connection that install can be slow or stall, leaving the earlier worker, and its earlier snapshot, in charge. I could not test a phone or Safari here; this part is a likely cause, not a proven one.

**What it is not.** The design choice `pt-design` in localStorage only picks which design of the home page is shown (`assets/design/design.js`); it does not keep an old page. HTTP headers alone explain at most ten minutes.

**Proposed fix (for dev@PrompTugal.dinis, in `assets/offline/sw.tmpl`; not applied)**
1. Answer from the *newest* kept copy: look in `pt-pages` and `pt-saved` before the shell, or compare the `x-pt-saved` stamps and take the newest. (Fixes item 1.)
2. When the network answer arrives after the 4 s race, also store it in the current shell cache, and tell the page (`postMessage`) so it can offer "A newer version is ready: reload". (Items 1 and 2.)
3. Say so whenever a page is answered from a copy, not only when the browser reports it is offline: "Showing a copy kept at HH:MM; loading the newest." (Item 2.)
4. For navigations use `fetch(request, { cache: 'no-cache' })` so the browser's HTTP cache does not answer for ten minutes; the ETag makes it cheap. (Item 4.)
5. Make the install lighter or tolerant: precache fewer pages, and keep the previous shell until the new one is complete, so a stalled install leaves the earlier copies fresh, not frozen.
6. A test for each: the table above is a ready reproduction (stand-in server and script available on request).

**What would settle it for Vicky's browser.** Which browser and device she used, and the exact banner wording (if any). If it said "Offline. This copy was kept ...", it is items 1 and 3; if there was no banner, items 2 and 4. Clearing site data (the footer's "clear what this site kept") removes the old copies today.
