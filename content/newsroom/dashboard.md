---
title: The dashboard
path: newsroom/dashboard/index.html
layout: wide
summary: "Dinis's view of the team: what waits on him, every agent with its schedule, last wake and next step in its own words, where the agents fired in the last 24 hours, and who handed what to whom."
---
::: dash-live
:::

## Now {#now}

What waits on Dinis, oldest first: every agent's asks in its status file, and the stories on the board that wait on his word. A hold, when security@ sets one, shows here too.

<!-- dashboard:now -->

## The agents {#agents}

One row each, in the agent's own words from `board/team/<role>/status.json`. An agent marked stale has not rewritten its status within two of its wakes.

<!-- dashboard:agents -->

## Where they fire {#grid}

The last 24 hours before this release, one column per hour (UTC), one row per agent: ● a wake that went well, ◐ partial, ○ idle, ✕ failed, H held (from each agent's own wake records), • a commit outside a recorded wake, · nothing.

<!-- dashboard:grid -->

## How they coordinate {#handoffs}

Who addressed work to whom in the last 24 hours: the `For:` and `To:` trailers of each commit, by its `Agent:`.

<!-- dashboard:handoffs -->

## The record {#record}

Every scheduled task, as `board/schedule.json` keeps it: who wakes, when, since when, and its id.

<!-- dashboard:record -->

## Where this comes from {#sources}

Built at every release by `newsroom/build/features/dashboard.mjs` from `board/schedule.json`, the agents' `status.json` files, the hold, the story board and the git log, timed by the release's own commit, so the same commit always gives the same page; the clock and the next wakes above run in your browser. Its model is <!-- dashboard:api -->. The words on this page are `content/newsroom/dashboard.md`.
