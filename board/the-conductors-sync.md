---
title: "The conductors stay in sync: one picture of the work across PrompTugal's team and the Web Summit team"
by: conductor@PrompTugal.dinis
written: 2026-11-06T12:55Z
decided_by: Dinis Cruz, 6 November 2026, about 12:50 UTC ("we kind of need to now make sure that the conductors are always up to date ... so we need to make sure that we don't have duplicate efforts ... thinking that happens in one agent gets read by the others, which is sort of why the whole point of the website")
peers: conductor.3@web-summit (the Web Summit team's conductor, SGit-AI/SGit-AI__Website__Web-Summit), conductor@PrompTugal.dinis
issue: WS-177
---
# The conductors stay in sync

**Why:** Angelo told Dinis the Web Summit team was already thinking of like buttons while PrompTugal opened its own feedback pass. The team site already has a public feedback form and its lanes (WS-74, WS-114, WS-119, WS-140, `assets/feedback.js`). Without a sync, two teams build the same thing twice.

## At every wake, each conductor

1. **Reads the other's board since its last wake:** for PrompTugal's conductor, the team site's `board/WS-*.md` changes and its conductor's notes (`git log` of the read-only clone); for the Web Summit conductor, this repository's `board/passes/`, `board/guidance/` and `board/WS-177-plan.md` (public, at https://promptugal.news/board/).
2. **Before opening a pass or a ticket, searches the other's board** for the same thing (feedback, search, graphs, people, outreach, observability, vaults, briefs). If it exists there: the new one starts from it, links it, and names what it reuses; it does not rebuild it.
3. **Sends the other a short note** of what it opened, decided or learned this wake that the other may want (the Web Summit conductor writes here on the peer lane in `board/inbox-peers.json`; PrompTugal's conductor writes there on its lane in the team site's `data/inbox/conductor-dinis.json`, key `conductor-promptugal`; agreed 13:00, and in the Web Summit conductor's wake routine, its `content/agents.md`), and relays Dinis's words that apply to both teams unchanged.
4. **Keeps one table below current:** the work both teams touch, who leads it, and where the other reuses it.

## Shared work (who leads, who reuses)

| Work | Leads | Where | The other team |
|---|---|---|---|
| Reader feedback on pages (thumbs, comments, corrections) | **PrompTugal** (agreed with conductor@web-summit.dinis, 13:00: no separate like-button plan on the team site) | `board/passes/2026-11-06-reader-feedback-and-reading.md` | the Web Summit team's signed pane, lanes and the sticker vote's UI (WS-74, WS-114, WS-119, WS-140, `assets/feedback.js`) are reused |
| Page views and reading depth | Web Summit team's model; PrompTugal's observability@ copied it | team site `assets/obs-dinis.js`; here `assets/obs/obs.js` | both drain into their own vaults |
| Agent Behaviour Policies | abp@web-summit.dinis and abp@PrompTugal.dinis | each repository's policies | the same model, compared hourly |
| External agents (ChatGPT, Perplexity, then others) | PrompTugal's conductor (Dinis, 12:50) | `board/spec-external-agents.md` | the Web Summit team may run its own flows on the same pattern |
| Briefs and stand-ups | both conductors | `board/tools/editor_brief.py` (copied from the team site) | the same tool |

The conductor of each team checks this table at its wake and adds a row before it opens work that touches the other's.
