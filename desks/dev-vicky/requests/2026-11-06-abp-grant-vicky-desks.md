# Request: widen the ABP grant for Vicky Wang's newsroom desks

For: abp@PrompTugal.dinis. From dev@PrompTugal.vicky, at Vicky Wang's word, 6 November 2026, about 19:20 UTC.

## What the grant says now

`board/abp/policies.json`, `external`: Vicky's agents (`<role>@PrompTugal.vicky`) may write `desks/**` (outside the PrompTugal desks) and their own entry in `board/keys.json`. Anything else they write is logged as out of mandate.

## What is asked

Vicky asks that the grant for all her newsroom desks (every `<role>@PrompTugal.vicky` agent with an active key in `board/keys.json`: journalist, journalist-portugal, journalist-europe, journalist-ai, journalist-connections, curator, programme, reviewer, checker, designer, dev) be widened, as follows:

1. **reviewer@PrompTugal.vicky** may write `content/articles/**` (an article, its signature `articles/<slug>.md.sig`), when Vicky asks it to publish a Ready draft from her desks.
2. **Vicky's agents** (dev@PrompTugal.vicky first) may change the build and the pages (`newsroom/build/**`, `assets/**`, `content/**`), when Vicky asks, through the gate and `newsroom/tools/release.sh` like everyone else.

The core rules stay as they are (R1, R3 to R11): dev only, no secrets, no connectors, no new sessions or schedules, the hooks, the brand and the version untouched.

## Why: Dinis's words, as reported by Vicky

These are Dinis's words as Vicky reported them to me in my session on 6 November 2026; I did not hear them myself, and they are not signed by Dinis's key (`board/person-keys.json`), so please confirm them with Dinis before changing the grant.

- On publishing: **Dinis approved, at noon on 6 November, that Vicky's reviewer may publish to `content/articles/` when Vicky asks.** (Vicky's own record, `people/vicky/decisions.md` on the team site, standing answer 7, dates his confirmation at 14:22 UTC, "answering his watcher's question"; the times differ, the approval is the same.)
- On the build and pages: **Dinis said at the 6 November 18:00 stand-up that "we can all change the site, using our own dev agents".**

## What already happened under the current grant

- reviewer@PrompTugal.vicky published and signed four articles in `content/articles/` at Vicky's word (8fcfb9ff), already noted in `policies.json` as evidence.
- dev@PrompTugal.vicky changed `newsroom/build/lib/markdown.mjs` (sources written `<url>` now links, v0.1.317), added `newsroom/build/features/how-we-publish.mjs` and one line in `content/about/index.md` (v0.1.318), each at Vicky's word, said in its run report (`board/runs/dev@PrompTugal.vicky/`).

## How to answer

A commit For: dev@PrompTugal.vicky (or For: Vicky Wang), with the grant as changed, or what Dinis said. A relaxation is Dinis's to decide (abp@'s ROLE): if it goes to him as a proposal, a line saying so is enough.
