---
title: "The team setup: agents working round the clock on focused things, and Dinis's dashboard"
by: conductor@PrompTugal.dinis
written: 2026-11-06T03:15Z
decided_by: Dinis Cruz, 6 November 2026, about 03:05 UTC ("I need a dashboard here ... what are all the agents doing and how are they coordinating and where are they firing"; "look at the book ... we did a really good job of having the agents working around the clock on focus specific things")
model: the book team's setup, https://the-ultimate-insider.book.sgit.ai/admin/ (its wake protocol, schedule and dashboard), copied in shape, not in content
issue: WS-177
---
# The team setup

**What Dinis asked for:** a dashboard in the newsroom that shows every agent, what it is doing, when it fires and how the agents hand work to each other; and a team that runs like the book's: each agent on one focused thing, round the clock, with a record of what it did and why (provenance and explainability of the setup itself).

## What the book's team had that we do not yet

| The book's team | Here today | What we adopt |
|---|---|---|
| `team/<id>/ROLE.md` with "Done when" | the CLAUDE.md table, one line each | `board/team/<role>/ROLE.md`: the focus, the paths it writes, what done looks like, what it never does |
| `team/<id>/status.json` (state, done, next, asks) | nothing: state is only in commit messages | `board/team/<role>/status.json`, rewritten at the end of every wake |
| A wake record per wake, five steps | an hourly prompt, a closing commit | the wake's line in `status.json` (`wakes`: started, outcome, release, one line), a debrief in `board/team/<role>/debriefs/` when it shipped something |
| The schedule page | `board/schedule.json` (now) | the dashboard reads it |
| The dashboard: now, next wakes, holds, what waits on the editor, a wake grid | the control centre's runs and timeline (from git, a commit behind) | `/newsroom/dashboard/`, below |
| Notes between members on commits (`To-<id>:`) and mail | `For:` trailers; the conductor's inbox lanes | a `To: <role>@PrompTugal.dinis` trailer for a short note to one agent, read at its next wake |
| A hold that stops every wake (`HOLD.md`) | none | `board/HOLD.md`: if it exists, every agent's wake stops after pulling and reports why; only Dinis lifts it |
| Definition of done, then the agent pauses its own task | hourly until told | the ROLE.md "Done when"; an agent whose list all holds says so, and the conductor puts it to Dinis |

## The dashboard: `/newsroom/dashboard/` (Dinis's page)

Built at each release from `board/schedule.json`, `board/team/*/status.json`, `board/HOLD.md`, the runs ledger, the story board and the git log; the clock and next wakes run live in the browser.

1. **Now:** the time, any hold, what waits on Dinis (from every `status.json`'s `asks` and the story board's "Waits on Dinis"), oldest first.
2. **The agents:** one row each: its focus, its minute and next wake, its last wake (outcome, release), its state, done and next, in its own words.
3. **Where they fire:** a grid, agents by hour, each cell a wake (ok, partial, idle, failed, held), today and the last 24 hours.
4. **How they coordinate:** who handed what to whom: arrows from the `For:` and `To:` trailers, the inbox lanes and the findings synthetic@ files for each owner; the rows of `board/the-newsroom-move.md` and `board/the-story-pipeline.md` as hand-offs with their state.
5. **The record:** every task's prompt and schedule as data, so the setup itself has provenance (who set it up, at whose word, when).

## Who does what

| Order | Agent | The work | Done looks like |
|---|---|---|---|
| 1 | every agent | At its next wake: write `board/team/<role>/ROLE.md` (focus, paths, done when, never) and `status.json` (`agent`, `focus`, `state`, `done`, `next`, `asks` for Dinis, `wakes`); rewrite `status.json` at the end of every wake | eight ROLE.md and eight status.json in `board/team/` |
| 1 | `ontologist@PrompTugal.dinis` | Schemas for `status.json`, `ROLE.md`'s front matter and `board/schedule.json`, checked by the gate | the gate refuses a malformed status |
| 2 | `dev@PrompTugal.dinis` | `/newsroom/dashboard/` as above, and `/api/v1/newsroom/dashboard.json`; the gate's check that every scheduled agent has a status no older than two of its wakes; `board/HOLD.md` honoured by the release script | the page live, every agent on it, the grid filled from today's wakes |
| 2 | `observability@PrompTugal.dinis` | The agents' activity (the agent-log runs) joined to the dashboard's grid | each cell links to its run |
| 3 | `designer@PrompTugal.dinis` | The dashboard in the brand; the grid and the hand-off arrows legible on a phone | screenshots in `design/shots/` |
| always | `conductor@PrompTugal.dinis` | `board/schedule.json` true; the brief to Dinis every three hours, as an ASCII picture, drawn from the same files | the brief matches the dashboard |

The story board (`board/the-story-pipeline.md`) stays first in order for ontologist@ and dev@; the dashboard comes right after it.
