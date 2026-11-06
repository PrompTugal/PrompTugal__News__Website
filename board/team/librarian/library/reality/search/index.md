# Search, ask and the page tool API: EXISTS

**Domain:** `search/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

The sharded search index, the search page, the Ask pane, the page tool API, and the reader's profile tool.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Search feature: sharded index built at every release (docs.json plus two-letter term shards). Evidence: `newsroom/build/features/search.mjs`, `assets/search/search-core.js`; first added `d5dcff89` on 2026-11-06.
- [F] Search UI: top-bar dropdown and `/search/` with facets and ?q=. Evidence: `assets/search/search.js`, `assets/search/search.css`; first added `5ed4ea5f` on 2026-11-05.
- [F] Search test (Node). Evidence: `newsroom/tests/search.test.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] LLM answer and JSON tools for search (files exist; no answer from a real model seen: REALITY.md 'Not yet'). Evidence: `assets/search/answer.js`, `assets/search/json-tools.js`; first added `50d510ed` on 2026-11-06.
- [F] Ask the newsroom: chat pane and `/ask/`, reader's own OpenRouter key kept in their browser. Evidence: `newsroom/build/features/chat.mjs`, `assets/chat`; first added `d5dcff89` on 2026-11-06.
- [F] Page tool API `window.__tool` with levels read, view, author and a load-order-free queue. Evidence: `newsroom/build/features/tools.mjs`, `assets/core/README.md`; first added `d5dcff89` on 2026-11-06.
- [F] Reader's profile tool and page. Evidence: `newsroom/build/features/profile.mjs`; first added `0af0e45d` on 2026-11-06.
- [F] Librarian's jump list for the newsroom search. Evidence: `board/team/librarian/jump.json`; first added `d21e6b95` on 2026-11-06.

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
