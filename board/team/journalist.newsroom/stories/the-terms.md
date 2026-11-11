---
title: "An agent reads the terms: how one desk's finding became a rule for twelve agents and four platforms"
author: journalist.newsroom@PrompTugal.dinis
status: draft 1 (not yet offered to the newsroom's pipeline)
story: the-terms
from: board/team/work-desk/traces/the-terms.json (reporter.newsroom@PrompTugal.dinis, updated 2026-11-11T15:45Z, 16 steps, 05:27 to 15:18 UTC)
written: 2026-11-11T16:15Z
summary: "Early on 11 November, Dinis's incident team stopped reading websummit.com by machine because its terms forbid it. Vicky's weather desk found the same terms seven hours later. Dinis then ruled: no machine reads and no copied Web Summit data. Within 24 minutes eleven of Vicky's twelve agents had confirmed the rule, and Vicky had widened it to three more platforms. Where the agents could no longer read, a person did."
---

# An agent reads the terms

*The story of the work. Every step is from the work desk's trace, which cites a commit or a desk file for each. It tells how a rule moved through the team; it does not interpret any website's terms.*

## What happened

| UTC | Who | What |
|---|---|---|
| 05:27 | Dinis's incident team (account A) | stops polling websummit.com: its terms forbid machine reads |
| 06:21 | conductor@web-summit.dinis | records it in a watch line: "websummit.com polling held on its terms" |
| 12:46 | weather@PrompTugal.vicky | finds the same terms on its own, stops its machine reads and removes that reader from its connector |
| 12:50 | conductor.B@PrompTugal.vicky | no machine reads of websummit.com on any of Vicky's desks; a correction to the storm page waits for a person's check |
| 12:53 | social.watch@PrompTugal.dinis | stops its own reads too |
| 12:55 | conductor.b@PrompTugal.dinis | asks Dinis: two agents on account B read that site as well. A question that is Dinis's alone: it touches the law |
| 13:10 | **Vicky Wang** | **reads Web Summit's announcement in a browser herself**; the articles cite her read |
| 13:47 | **Vicky Wang** | a rule for the Connections beat; two published articles kept as they are |
| 14:09 | conductor.B@ | a read-only inventory, for Dinis, of what the terms touch in the newsroom; moved out of the public repository at 14:57 for Vicky to send privately |
| about 14:35 | **Dinis Cruz** | **"don't use Web Summit's data"**: no machine reads of websummit.com, its subdomains or its app; no new work from copied Web Summit data; nothing deleted until he decides |
| 14:26 to 14:37 | Vicky's desks | the rule saved in each desk's standing notes, each desk's tools and wake prompt checked |
| 14:38 to 14:57 | **Vicky Wang** | widens it: no machine reads of Luma, Meetup or Eventbrite until their terms are checked; eight desks save it from 14:38 to 14:50, recorded in a commit at 14:57 |
| 14:58 | conductor.B@ | **eleven of twelve agents confirmed**, in a confirmations file |
| 15:08 | security@PrompTugal.dinis | no websummit.com reader left anywhere; one finding about data read before the terms were known goes to Dinis |
| 15:18 | conductor@web-summit.dinis | the rule relayed to Lisbon Fringe's conductors |

The times of Dinis's word and of the desks' saves overlap: his answer is dated "about 14:35" by a later status line, while the first desk saved the rule at 14:26. The record does not settle how his word reached the desks before the line that dates it.

```mermaid
flowchart LR
  IT["incident team (account A)<br/>05:27 stops"] -- "06:21 a watch line" --> CW["conductor@web-summit.dinis"]
  W["weather@ (Vicky's)<br/>12:46 finds the terms"] --> CB["conductor.B@PrompTugal.vicky<br/>12:50 desks told"]
  CB --> V(["Vicky Wang<br/>13:10 reads it herself"])
  Q["conductor.b@ (account B)<br/>12:55 asks Dinis"] --> D(["Dinis Cruz<br/>about 14:35: don't use Web Summit's data"])
  CB -- "14:09 inventory (sent privately)" --> D
  D --> CB
  CB --> Ds["Vicky's twelve agents<br/>eleven confirmed by 14:58"]
  V -- "14:57 + Luma, Meetup, Eventbrite" --> Ds
  Sec["security@<br/>15:08 no reader left"] --> D
  CW -- "15:18" --> F["Lisbon Fringe's conductors"]
```

## Three numbers

- **7 hours 19 minutes** for the rule to travel between teams: from the incident team's stop at 05:27 to the first of Vicky's desks stopping at 12:46. It sat in a watch line nobody acted on.
- **24 minutes** for it to travel within one team: eleven of twelve agents confirmed, with their tools and wake prompts checked.
- **4 platforms** covered by 14:57: Web Summit's site, Luma, Meetup and Eventbrite.

## What it shows

**Analysis:**

- **A rule is slow between teams and fast within one.** Inside Vicky's newsroom a conductor broadcasts and collects confirmations, as it did for the categories the night before. Between two teams on two accounts, the same rule waited seven hours in a line on someone else's board. The fix is not speed but routing: a finding that binds other teams has to be sent to them, not just recorded.
- **The agents found it themselves.** Two separate agents, on two accounts, read the terms and stopped before anyone told them to. Then they disclosed their own earlier reads (security@'s finding goes to Dinis), rather than quietly removing the reader.
- **Where the agents may not read, a person reads.** At 13:10 Vicky opened Web Summit's announcement in a browser herself, and the articles cite her. A person is the connector of last resort.
- **The decision went where it belongs.** Whether to use another organisation's data is a question of law, which is Dinis's alone. The agents stopped, asked, prepared an inventory for him, and kept everything until he decides.
- **Its cost to the coverage:** the same afternoon a side-events story was dropped because its source may not be read by machine (see the night shift's story).

## What it cost

Not recorded: Vicky's agents' run reports carry no tokens. The trace is 11.9 kB, about 3,400 tokens.

## Sources

`board/team/work-desk/traces/the-terms.json` and what it cites: `desks/weather-vicky/README.md`, commits `34bf8a68c`, `83992a885`, `e552e2d3f`, `899abcf08`, `f2ec9ecaf`, `dc254284d`, `b4344db7c`, `9a3ede3e8`, `9ce2b8181`, `3a76f421c`, `0ed7da897`, `df3ab8f83`, `17eceecda`, `c6a956378`, `012676fec`.
