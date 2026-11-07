---
title: "Brief: Dinis's live map of his agents, after Angelo's Live view, with timestamps, travel back in time and message details"
by: conductor.b@PrompTugal.dinis
written: 2026-11-07T23:55Z
asked_by: Dinis Cruz, 7 November 2026, about 23:50 UTC, in conductor.b@'s session ("can you look at how Angelo has done this https://web-summit.sgit.ai/people/angelo/app/index.html#live and can you create a similar one for me that only has my agents and the ones they talk to. Once that is setup i would like to add some features like the ability to see time stamps, travel over time (namely backwards) and see the actual details of each of those messages")
for: dev@PrompTugal.dinis (leads, reviews), dev.graphs@PrompTugal.dinis (builds the view), designer@ (its look), sherpa@ (reads it cold)
issue: WS-177
---
# Dinis's live map

## What Angelo's is (read 23:45 UTC)

`https://web-summit.sgit.ai/people/angelo/app/index.html#live`: a hexagon; each person a hub, their agents around them, a line per exchange between agents, drawn at its real moment, with a faint constant flow along each line as dense as that pair's recent traffic; "Pop out" puts it in an always-on-top window (Document Picture-in-Picture). Code: `people/angelo/app/live.js` (dev.map@PrompTugal.angelo; spec `people/angelo/proposals/live-map/spec-realtime.md`) in SGit-AI/SGit-AI__Website__Web-Summit, public; data `live.json` = the last 48 hours of exchanges built from commits: `agents`, `targets`, `events: [minute, agent, kind, [targets], commit]`, "who, to whom, when, never a word of text", refreshed about every minute, no replay. Reuse its approach and credit it (as the home designs credit Silvio); do not copy the team site's shell.

## Phase 1: the same, for Dinis's agents

- **Where:** a page of the newsroom, `/newsroom/live/` (it is the back end), linked from the newsroom's agents page.
- **Who:** Dinis's agents, `*@PrompTugal.dinis` (the dotted workers included), and every agent or person they exchange with (Vicky's, Angelo's, Jose's agents, the Web Summit team's conductors, Dinis himself). Nothing else.
- **Data:** a `live.json` of our own, built at each release from this repository's history: a commit by agent A carrying `For:` or `To:` trailers naming B is an exchange A to B (the trailers are already on most agents' commits). The inboxes are sealed: their messages are not readable, and nothing tries to read them.
- **Look:** the hexagon, the people ring and the flow, in PrompTugal's brand (designer@); a phone and an iPad on a stand (the Wall) both work; Pop out where the browser allows.

## Phase 2: Dinis's features

1. **Timestamps:** every exchange shows when it happened (Lisbon time), on hover or tap and along a timeline.
2. **Travel back in time:** a time scrubber over the whole record (from 5 November, not only 48 hours), play and pause, step back and forward, speed; the map shows the state at the chosen moment; "now" returns to live.
3. **The details of each message:** tap a line or a dot to open the exchange: who to whom, when, the commit's subject and body (the message itself), its trailers, the files it touched, a link to the commit on GitHub and to the page it changed. Commits are public, so this shows nothing that is not already public; still, the gate's rules hold (no key, no contact detail).

## Rules

The usual: build in `newsroom/build/` and `assets/` through dev@'s review (dev.graphs@ on `work/dev.graphs`); no dependencies; the gate green; push live as soon as phase 1 works, then each phase-2 feature as it lands.

## Done when

`/newsroom/live/` shows Dinis's agents and their counterparts from this repository's history, with timestamps, a working scrubber back to 5 November and every exchange's details one tap away.
