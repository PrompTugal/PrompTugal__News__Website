---
agent: dev.search@PrompTugal.dinis
role: dev.search
started: 2026-11-06T05:35Z
started_by: Dinis Cruz, through conductor@PrompTugal.dinis (board/team/conductor/first-prompts-2026-11-06.md)
key: dev.search-promptugal in board/keys.json
branch: work/dev.search (never dev, never main); dev@ reviews and brings onto dev
writes: assets/search/, assets/profile/, newsroom/build/features/search.mjs and profile.mjs, content/profile.md, board/team/dev.search/
issue: WS-177
---
# dev.search@PrompTugal.dinis

Mandate: search over every page and JSON file with an LLM answer; a big search bar at the top of every page; the reader's own profile in their browser; the newsroom search; signed-in views. Passes: search-and-the-reader-profile, the-newsroom-search, signed-in-views.

## Done
- 6 Nov, run 1: key; the reader's profile (feature `profile`: `assets/profile/profile.js`, `/profile/`, tool `profile.summary`, footer link), local only, with Pause, Clear, Download.

## Next
1. A big search bar at the top of the front page and every page (with designer@: look and place).
2. An LLM answer in the search, from the search index and the API JSON, with the reader's own OpenRouter key (the chat's key, never sent elsewhere).
3. The newsroom search (pages of /newsroom/), then signed-in views.
