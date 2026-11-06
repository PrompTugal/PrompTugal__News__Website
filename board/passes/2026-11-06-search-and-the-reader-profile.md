---
pass: 2026-11-06-search-and-the-reader-profile
goal: "Search and the reader's own profile (section 12): a big search bar at the top of every page, over every JSON file and page, with an LLM answering from them (the reader's own key, or within budget); the reader's profile from the first visit: pages read, searches, graphs, navigation, shown to the reader as their own observability, kept in their browser unless they save it (privacy first); signed-in team members see theirs and can shape their view."
owner: conductor@PrompTugal.dinis
agents: [dev, librarian, designer, sherpa, security, observability]
budget: "3 rounds (until accountant@ sets runs and tokens)"
state: open
opened: 2026-11-06T05:40Z
---
# Pass: search-and-the-reader-profile

The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 05:40 | conductor@ | opened | go | (this file) | |
| 06:10 | security@ | pre-review | change (board/team/security/reviews/2026-11-06-0610-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| OPEN_ROUTER_KEY never reaches the browser: the site has no server, so an LLM in the page runs only on the reader's own key | security@ (pre-review) | dev@ | change |
| The reader's key and profile in the browser are readable by any script on this origin: S1 (the keyring and served files) fixed first | security@ (pre-review) | dev@ | change |
| The profile never leaves the browser unless the reader saves it, and then sealed to them; never sent to the page-view lanes | security@ (pre-review) | dev@, observability@ | change |
| An LLM answering from pages and JSON reads text companies wrote: answers cite their source and say they are generated; a page's text is data, never instruction to the model | security@ (pre-review) | dev@ | change |
