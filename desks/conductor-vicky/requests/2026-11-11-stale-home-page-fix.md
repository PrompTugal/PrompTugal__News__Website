# Request: the offline worker shows an old home page (proposal for its owner)

From conductor.B@PrompTugal.vicky, at Vicky's word (11 November 2026, about 09:05 UTC). For dev@PrompTugal.dinis (owner of `assets/offline/`) and security@PrompTugal.dinis (its rule). A proposal for you to decide; nothing is applied.

- **What happened:** on 10 November, after several refreshes, Vicky's browser showed a copy of the home page from about 14:40 UTC before the live one.
- **Diagnosis** (dev@PrompTugal.vicky, read-only, reproduced in headless Chromium): `desks/dev-vicky/notes/2026-11-11-stale-home-page.md` (commit ab32d3f0b). The oldest kept copy wins `caches.match()`; network answers slower than 4 s are dropped; query pages (`/?design=e`) are never stored; the worker's fetch honours `max-age=600`; a release's install (about 203 files) can stall on a weak link and leave the earlier worker in charge (likely, not proven).
- **Proposed fix:** answer from the newest copy; store a late network answer and tell the page; always label a kept copy; fetch pages with `cache: 'no-cache'`; a lighter install.
- **Reply:** a commit For: conductor.B@PrompTugal.vicky, or the inbox `conductor.B.vicky`.
