---
title: "Sync, 15 November: what happened since the summit, what this week's newsroom.sgit.ai articles mean for pt.news, and a lean restart"
for: Dinis (and the conductors once he decides)
written: 2026-11-15, about 19:30 UTC, by conductor@PrompTugal.dinis, at Dinis's ask ("sync up with the work we have been doing on this site and others ... since our weekly token usage just got reset")
issue: WS-177
---
# Sync, 15 November

## Where pt.news stands (read from the repository and the scheduled tasks, 15 Nov ~19:20 UTC)

- **Live:** v0.1.1476. The websummit-only takedown is live (12 Nov 04:30). Recovery since: 31 companies back from their own pages, and PitchBook from an SEC filing.
- **The hand brake:** Dinis paused every scheduled agent on 12 Nov at 15:15 UTC (`board/HOLD.md`, f6a2c429a). The hold was lifted on 13 Nov at 14:31 (f2687c2a5).
- **Our tasks never came back on.** On account A, only the newsroom's "Ten days" publisher is enabled. My conductor task (trig_01X8SF35DkefoBeVgKyWYbWx) is disabled since 12 Nov 15:13, and so are security@'s and accountant@'s. dev@ and ontologist@ last committed on 12 Nov at about 14:20.
- **Vicky's desks kept the site alive:** about 90 commits since 12 Nov, each published under R-PUB-1:
  - S61: Humanos wins Road 2 Web Summit;
  - S62 and S63: Humans and AI;
  - S65: Best Number One, Loulé;
  - S66: Neuraspace (drafting);
  - Vicky's own page, "Humans and AI".
  They also produced:
  - one cover style;
  - a "Write like a person" style rule;
  - a topics analyst;
  - a front page after the summit (PagerDuty leads, the storm block off).

## Waiting on our side (asks addressed to us while we were off)

1. **websummit.com links still live on company pages.** These are the template's pointer to the schedule and the derived company data's attendee and session links (e.g. /companies/rws/). Vicky's conductor asked for both to go: `desks/conductor-vicky/requests/2026-11-13-1810-company-pages-web-summit-links.md`. Owners: dev@ and ontologist@. It finishes the takedown pass.
2. **One line of CSS so covers are not stretched** (`img, svg { max-width: 100%; height: auto; }` in `assets/site.css`): `desks/conductor-vicky/requests/2026-11-14-1840-img-height-auto.md`. Owner: dev@.
3. **journalist@'s three signed articles still link pages that came off.** It is a gate warning. journalist@ has been silent since 10 Nov.

## This week on newsroom.sgit.ai (about 30 articles, 9 to 15 Nov), and what each means here

| Article | What it says | For pt.news |
|---|---|---|
| [PrompTugal.news, the newsroom we ran](https://newsroom.sgit.ai/articles/promptugal-news-the-newsroom-we-ran.html) | 73 signed articles in ten days; 61 agents in 43 roles; Vicky's journalists wrote about 53; one verdict per draft; 50 outreach drafts, none sent; the accountant | Our own record, published. Its lessons are now the house rules: a readable pipeline, one verdict, sending stays human, count the work |
| [Don't micromanage your agents](https://newsroom.sgit.ai/articles/dont-micromanage-your-agents.html) | Vicky stopped reading everything and managed through guidance and structure, backed by specialist agents from another team | The working model after the summit: Vicky's desks write; our agents are the specialists (dev, security, data) who support them |
| [Spend fewer tokens](https://newsroom.sgit.ai/articles/spend-fewer-tokens.html) | Files as memory, stable rules for caching, code where you can, the right model per step, no pasting, static outputs, count it | The restart should be small, file-driven and measured, not 25 agents waking hourly |
| [Stop copying and pasting between your agents](https://newsroom.sgit.ai/articles/stop-copying-and-pasting-between-your-agents.html) | Agents talk through recorded channels (lanes, inboxes, commits); people read outputs and decisions | We already run this: inboxes, the board, decision pages. Keep relays through lanes, not through Dinis |
| [Six setups of an agentic system](https://newsroom.sgit.ai/articles/six-setups-of-an-agentic-system.html) | Task, agent, sub-agents, sessions, conductor and team, conductors of conductors; control is reach | pt.news ran at the top setup. After the summit, a conductor with a few on-demand roles is enough |
| [Selling mini agentic teams](https://newsroom.sgit.ai/articles/selling-mini-agentic-teams.html) and [Starting AgentiCCells](https://newsroom.sgit.ai/articles/starting-agenticcells.html) | A business that sets up small agentic teams with a control centre to see, start and stop them; **PrompTugal.news is the first customer**: an editor, regional newsrooms (Vicky in Lisbon, José in the Algarve), city desks, journalists, agencies | The next shape of pt.news, and the control centre is what it needs first. The decisions (who runs which newsroom, money) are Dinis's |
| [Always-on agents at team scale](https://newsroom.sgit.ai/articles/always-on-agents-at-team-scale.html) | Anthropic's five primitives (inbox, timers, memory, permissions, outbox) set beside our ~250 agents; then the next problems: agents starting agents, identity, stopping, many humans | Our gaps are known: stopping that reaches every agent (the hand brake worked, but restarting did not), and tasks left off after a hold |
| [The new data lake](https://newsroom.sgit.ai/articles/the-new-data-lake.html) | Append-only signed lanes; a curator turns rows into a graph; the graph draws its pictures | It describes our researcher, curator and graph (877 entities, 1,026 edges); keep that pipeline as the core |
| [Reading your way into an agentic team](https://newsroom.sgit.ai/articles/reading-your-way-into-an-agentic-team.html), [A hub for agentic sites](https://newsroom.sgit.ai/articles/a-hub-for-agentic-sites.html) | Eight public sites to read first; a hub where each site lives in a repository and a vault | pt.news should be one of the eight a new team reads, and be listed on the hub |
| [Coding standards are behaviour policies](https://newsroom.sgit.ai/articles/coding-standards-are-behaviour-policies.html) | A standard is a policy; 31 rules kept by habit, none by a CI guard | For dev@ and abp@: the gate is where our rules become barriers |
| [Ten days at Web Summit](https://newsroom.sgit.ai/articles/ten-days-at-web-summit.html), [The team's operating system](https://newsroom.sgit.ai/articles/the-teams-operating-system.html), [Storm Charles](https://newsroom.sgit.ai/articles/storm-charles-a-newsroom-built-in-a-night.html), [Native apps by agents](https://newsroom.sgit.ai/articles/native-apps-by-agents.html) | The series map: about 20,000 commits, 224 sessions, more than 60 at once | Context; the series continues twice a day |

## A lean restart (the conductor's recommendation; Dinis decides, ABP R4)

1. **Week shape:** Vicky's desks keep writing. Our side runs as specialists on demand, not on hourly wakes.
2. **First, in one short dev@ session:** items 1 and 2 above (the websummit.com links and the CSS line), then the gate check that keeps websummit.com links out.
3. **The conductor** (this session): one wake a day, or on call. It keeps the board, REALITY.md and the asks, and briefs Dinis weekly.
4. **security@ and accountant@:** one wake a day each (post-review of the day's commits; the day's cost).
5. **Not restarted** unless Dinis asks: the 25-agent fleet, the dotted workers, the work desk, the stand-up PDFs.
6. **Next build, if Dinis wants it:** a control-centre page for pt.news (who runs, what each may reach, start and stop), as AgentiCCells' first-customer case.
