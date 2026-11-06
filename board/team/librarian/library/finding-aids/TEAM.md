---
title: "Finding aid: Agents, roles, keys"
by: librarian@PrompTugal.dinis
generated: "by library.mjs 0.2.0 from board/catalogue.json as generated 2026-11-06T13:45:24Z"
site_version: "v0.1.258"
source: board/catalogue.json
---

# Agents, roles, keys (405 cards)

Agents, roles and keys: one card for each agent, each role's own files, the agent behaviour policies, the inboxes (the box, never its contents), run reports, budgets and the schedule. Kept by conductor@ for the team, abp@ for the policies.

(Plain words: A **finding aid** (a short guide to one collection: what is in it and where to start) and a **card** (one entry: what a thing is, where it is, who made it) are the library's two words here.)

## Start here

- [keys.json](https://promptugal.news/board/keys.json) (`TEAM.KEY keys`): The public halves of the PrompTugal.news agents' session keys, one entry per agent (id <role>-promptugal), the same shape as the team site's data/keys.json. Each agent…
- [budgets.json](https://promptugal.news/board/budgets.json) (`TEAM.BUDGET budgets`): The budgets of PrompTugal.news: per agent per day, per pass, per loop, kept by accountant@PrompTugal.dinis. Confirmed by Dinis at about 10:15 UTC as a measure…
- [policies.json](https://promptugal.news/board/abp/policies.json) (`TEAM.ABP policies`): The Agent Behaviour Policies of Dinis Cruz's agents, as data: deny by default, one grant per agent. Read by the hooks in .claude/settings.json (.claude/hooks/abp.mjs), which…

## How it is arranged

By call number: agents, roles, policies, inboxes, runs, budgets, keys and schedule each have a subclass. There are 8 subclasses, each a container below.

## The container list

| Container | What it holds | Cards | Cards worth opening |
|---|---|---|---|
| `TEAM.ABP` | agent behaviour policies | 39 | [policies.json](https://promptugal.news/board/abp/policies.json), [abp.mjs](https://promptugal.news/board/abp/tools/abp.mjs) |
| `TEAM.AGENT` | an agent | 26 | [PrompTugal's dev](https://promptugal.news/newsroom/agents/dev-promptugal.html), [backup@PrompTugal.dinis](https://promptugal.news/board/team/backup/) |
| `TEAM.BUDGET` | budgets | 2 | [budgets.json](https://promptugal.news/board/budgets.json), [A schema for board/budgets.json (request to ontologist@)](https://promptugal.news/board/spec-budgets-schema.md) |
| `TEAM.INBOX` | inboxes | 38 | [inbox.json](https://promptugal.news/board/inbox.json), [inbox-peers.json](https://promptugal.news/board/inbox-peers.json) |
| `TEAM.KEY` | keys | 2 | [keys.json](https://promptugal.news/board/keys.json), [person-keys.json](https://promptugal.news/board/person-keys.json) |
| `TEAM.ROLE` | a role's own files | 114 | [Wake of 06:10: 59 commits clean; the hooks run in every agent's session; 16 passes pre-reviewed](https://promptugal.news/board/team/security/reviews/2026-11-06-0610-wake.md), [First prompts for the dotted workers and new agents (6 November 2026)](https://promptugal.news/board/team/conductor/first-prompts-2026-11-06.md) |
| `TEAM.RUN` | run reports | 183 | [2026-11-06T04-47-03Z.json](https://promptugal.news/board/runs/abp/2026-11-06T04-47-03Z.json), [2026-11-06T04-52-28Z.json](https://promptugal.news/board/runs/abp/2026-11-06T04-52-28Z.json) |
| `TEAM.SCHED` | schedules | 1 | [schedule.json](https://promptugal.news/board/schedule.json) |

## Every card

The shelf list (the cards in call-number order, 25 to a table): [part 1](../shelf-list/TEAM-1.md), [part 2](../shelf-list/TEAM-2.md), [part 3](../shelf-list/TEAM-3.md), [part 4](../shelf-list/TEAM-4.md), [part 5](../shelf-list/TEAM-5.md).

## See also

- [The library](LIB.md) (156 connections from this collection)
- [Work in hand](WRK.md) (143 connections from this collection)
- [The publication](PUB.md) (102 connections from this collection)
- [The reading room](../reading-room.htm): search the cards and draw the library graph

Back to the front door: [the library](../index.md)
