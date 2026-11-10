---
title: "How a team of agents covered the storm"
author: journalist.newsroom@PrompTugal.dinis
status: draft 1 (not yet offered to the newsroom's pipeline; the trace is updated hourly and this draft follows it)
story: the-storm
from: board/team/work-desk/traces/the-storm.json (reporter.newsroom@PrompTugal.dinis, updated 2026-11-10T17:25Z, covering 14:08 to 17:22 UTC)
written: 2026-11-10T17:45Z
summary: "In three hours on 10 November, Vicky's newsroom agents went from one article about a red wind warning to a weather desk with a live page, a decision chain and the data for the home page's lead. Twelve hand-offs between a person and an agent; the first connector built by the agent that needed it; the architect not yet called."
---

# How a team of agents covered the storm

*The story of the work, not of the weather. Every time, actor and step below is from the work desk's trace (`board/team/work-desk/traces/the-storm.json`), which cites a commit or a file for each. Figures marked as estimates are the agents' own; analysis is labelled as analysis.*

On Monday afternoon, 10 November 2026, IPMA, Portugal's weather authority, had Lisbon under a red wind warning for Wednesday, the third day of Web Summit. By 17:22 UTC, PrompTugal.news had an article on it, an update on it, and a new agent whose only job was the storm. The record of how that happened spans **194 minutes, 21 steps and 16 actors** (Dinis and Vicky, twelve agents, the readers, and a person asked for but not yet named), with **twelve moments where a person and an agent hand over**.

## The cast

| Actor | What it is for | What it did here | When (UTC) |
|---|---|---|---|
| Vicky Wang | directs her newsroom's desks | started the manual pass that found the story; approved publication and later updates; relayed Dinis's ask for a fuller lead | 14:08 to 17:12 |
| Dinis Cruz | the operator of the agents | asked for a weather agent (16:50) and a fuller lead (17:12); his guidance made the storm the case study | 16:47 to 17:20 |
| curator@PrompTugal.vicky | picks stories | commissioned S41 (14:08) and S43, the government's alert (17:06) | 14:08, 17:06 |
| journalist@PrompTugal.vicky | drafts and re-checks | wrote S41, 413 words with an SVG card from IPMA's data (14:25); re-checked it (17:06) | 14:25, 17:06 |
| reviewer@PrompTugal.vicky | publishes and updates under Vicky's approval | published S41 (14:36); recorded the standing approval for updates (15:23); wrote two small tools to check and stamp it (16:44) | 14:36 to 16:44 |
| conductor.B@PrompTugal.vicky | Vicky's conductor; starts desks | started the weather desk two minutes after Dinis asked (16:52); asked the front page and Vicky's developer for the lead's new fields (17:14) | 16:52, 17:14 |
| weather@PrompTugal.vicky | sources, facts and the decision chain; never publishes | its key and live page (16:56); transport, sea and venue (17:02); the government's alert and a seven-step decision chain (17:02); asked for a person to read three sources (17:04); the lead's draft data (17:21) | 16:56 to 17:21 |
| conductor@web-summit.dinis | turns Dinis's memos into guidance and routes them | three pieces of guidance and the start of the work desk | 16:47 to 17:20 |
| correspondent@PrompTugal.dinis, dev@PrompTugal.vicky | the front page; Vicky's developer | asked for the lead's new fields; their work is after this trace | 17:14 |
| accountant@, dashboard@PrompTugal.angelo | the cost case; the visualisation of the work | routed by the guidance; their work is after this trace | 17:11, 17:18 |
| reporter.newsroom@PrompTugal.dinis | the work desk's reporter | this trace | 17:22 |

## The afternoon, drawn from the trace

```mermaid
sequenceDiagram
  participant V as Vicky Wang
  participant D as Dinis Cruz
  participant Cu as curator@
  participant J as journalist@
  participant R as reviewer@
  participant CB as conductor.B@
  participant W as weather@
  participant Rd as readers
  V->>Cu: 14:08 manual pass
  Cu->>J: 14:08 commission S41
  J->>R: 14:25 draft, SVG card from IPMA JSON
  V-->>R: 14:36 publish
  R->>Rd: 14:36 S41 live
  V-->>R: 15:23 standing approval for updates
  R->>R: 16:44 builds s41-check.mjs and s41-stamp.py
  D->>CB: 16:50 a weather agent for the red warning
  CB->>W: 16:52 desk started
  W->>R: 16:56 live page and source map
  W->>R: 17:02 transport, sea, venue; the government's alert; decision chain
  W->>CB: 17:04 asks for a person to read lisboa.pt, ANA, CP
  Cu->>J: 17:06 commission S43
  D->>V: 17:12 a fuller lead
  V->>CB: 17:12 relayed
  CB->>W: 17:14 the lead's fields (correspondent@ and dev@ asked too)
  W->>R: 17:21 s41-lead.json, draft
```

Dashed arrows are a person's approval recorded by an agent's commit. The full graph of all 16 actors is `materials/the-storm/flow.mmd`.

## The five steps, against what happened

Dinis described the path he expects an agentic team to take with a new source (guidance of 17:15 UTC). The record so far shows a shorter path.

1. **A researcher hits a raw source: seen.** IPMA's warnings, forecasts and observations are JSON. journalist@ drew a card from them at 14:25; weather@ read five IPMA feeds and the transport feeds within ten minutes of starting.
2. **It asks for a parser: not yet.** The one request, at 17:04, was for a *person*: seven sources could not be read by any tool (lisboa.pt and the city's information site returned 403, the airport a bot check, CP needs a browser, the civil-protection map and the interior ministry reset the connection, the Diário da República is a JavaScript app, Web Summit's support centre returned 403).
3. **An architect writes a plan: not yet.** There is no architect and no plan file for this story.
4. **The developer builds, the designer maps: partly.** The connector came first, and from the agent that needed it: at 16:44 reviewer@ wrote `s41-check.mjs`, a reader for only the part of IPMA's and Web Summit's pages that mattered to S41, in the same run, without a request or a plan. At 17:14 conductor.B@ asked a developer for the lead's new fields. No designer step yet.
5. **A UI turns noise into signal: in progress.** At 17:21 weather@ reduced dozens of feeds to `s41-lead.json`: a standfirst, three developments each with its source, and one line on what it means for Web Summit's Wednesday. Rendering it waits on the front page and the developer.

**Analysis:** when the source is readable JSON and the need is small, the agent builds the tool itself and the five-step path collapses into one run. The architect's step earns its place on sources no agent can read, which is exactly the list in step 2. That is where to watch next.

## How long it took

- Dinis's ask for a weather agent to the desk running: **2 minutes** (16:50 to 16:52).
- Desk started to its first live page: **4 minutes**; to the decision chain: **10 minutes**.
- Dinis's ask for a fuller lead to the data for it: **9 minutes** (17:12 to 17:21), through Vicky, her conductor and the desk.

## What it cost

Not known yet for Vicky's agents: their run reports carry no token figures, and the weather desk's hooks saw only part of its work (one request and eight tool calls logged for a run that read dozens of sources). What is known, as estimates by the agents themselves: the reporter read about **40,000 tokens** of record to make the trace and wrote about 14,000. The trace is about **6,000 tokens**. **Analysis:** every agent that reads the trace instead of the record reads about a seventh as much, and that saving repeats for each reader and each turn it stays in context. Details: `materials/the-storm/cost.json`.

## The decisions, as the agents found them

The weather desk's chain at 17:02 had seven nodes: IPMA's red warning (issued); ANEPC's special readiness and public SMS (done); the government's *situação de alerta* for mainland Portugal on Wednesday, with schools closed and outdoor events suspended (declared, page dated 12:10 UTC); Lisbon's civil-protection commissions (not read: lisboa.pt 403); the port's sea warning (issued, no closure found); the transport operators (disruption possible, nothing suspended at 16:59); Web Summit and its venues (no notice at 17:20).

**Looking back (from the record):** IPMA's first communiqué, at 13:17 on 9 November, expected orange and did not rule out an upgrade. The government's alert is dated about 23 hours later. The time of the red upgrade itself is not in the desk's files.

## What did not work

- Seven official sources unreadable by any tool; the request for a person to read three of them is open.
- Vicky's agents' run reports record no tokens, and the ABP hooks saw only part of the weather desk's run, so the trace rests on commits and desk files.

## Sources

The trace and every commit it cites: `4a2c32dd`, `839847a9`, `c8820e0e`, `8824680d`, `2bf973d8`, `f2d22651`, `1caaf8e`, `4c704f8`, `7db3000`, `e91f778`, `f360b4b`, `eca7b39`, `cde6581`, `fbaa1ae`, `683727f`, `f6af27d`, `dcb7c2a`, `a7b9c73`, `171372a`, `e3e12a6`, `0338ca7`; the desk's files `desks/weather-vicky/` (README, live.md, decision-chain.md, s41-lead.json); `board/runs/reporter.newsroom/2026-11-10T17-21-34Z.json`.
