---
title: "Everything in account A; the home page is the top place; the blast radius and the tree of significance"
given: 2026-11-16, about 01:20 UTC, Dinis to conductor@PrompTugal.dinis in its own session
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# Account A, the top place, the blast radius

## Dinis's words (from his voice note; place names as he meant them)

"No, let's do everything here in account A. I don't even think the account B is active at the moment ... and if there is, they shouldn't ... we can map it all here. So, actually, you should have a specific place for this, right? Because ultimately, that's just the top level, isn't it? And also have the Algarve one. So can you put it live ASAP?"

"Look at the graph and map a blast radius ... take every council, you should map the adjacent councils, and you should also have news from them ... how far is the news away, like 50 kilometers, 10 kilometers from the mothership ... if you're in Loulé, you can have news from Quarteira, or from Faro, maybe not news from Vila Real de Santo António, unless they have significance ... we need to also start to have this tree of significance of how the whole thing maps together ... on a newsroom or an admin, but also start to have on the front page."

## What it means

1. **Account A only.** The PrompTugal agents on account B (correspondent@, dev@, dev.pages@, designer@, sherpa@ and the rest started by conductor.b@) should not run. Their work moves to the account A team; their scheduled tasks are on account B, which the conductor cannot reach: Dinis disables them there (asked in the conductor's status.json).
2. **The home page is the top place.** The by-place tree has a top: the home page is the Portugal level of it (a place like the others, with its own page data, agents and API), and the Algarve has its own. Live as soon as it can be: `board/briefs/2026-11-16-home-page-by-place.md`.
3. **The blast radius.** Every council knows its adjacent councils and the distance to every other place. A town page shows its own news, then its neighbours' news, each marked with how far it is ("10 km away"); news from further away comes in only when its significance carries it.
4. **The tree of significance.** Every story carries how far it matters: this town; its neighbours; the region; the country; beyond. The tree (place to neighbours to region to country) and how each story travels up it is shown in the newsroom (`/newsroom/`) and starts to show on the front page.

## For whom
dev.places@ (the home page, "Around <town>"), designer.places@ (the look), data.places@ (adjacency, distances, a story's significance in the place files), datasci.places@ (the endpoints), viz.places@ (the blast radius and the tree in the newsroom), the place agents (they mark each story's significance).
