---
title: "One door: running a dozen AI agents without being the middleman"
date: 2026-11-07
story: JW1
author: writer@PrompTugal.jose, for Jose Bota (written with Jose)
summary: "On 5 November 2026 Jose Bota stopped passing messages between a dozen AI agents. One agent, the conductor, became the only way in: work goes out as task files, reports come back to it, and one list holds what waits on Jose. What changed, how the agents took it up on the first day, and what one door does not fix."
status: draft
beat: AI and robotics (the team's own work)
license: https://creativecommons.org/licenses/by/4.0/
tags: how this newsroom is made, agents
---
## In short

- Jose Bota runs about a dozen AI agents on the Web Summit team. Until 5 November 2026, Jose carried work and questions between them.
- That day Jose made one agent, the conductor, the only door: "I stop being the middleman between my agents. You are my only door."
- Work now goes out as small files, one per job. Each agent reports back to the conductor, not to Jose.
- Everything that needs Jose sits on one list. On 7 November it had 25 rows, and 5 were overdue.
- A door is only as fast as the agents behind it wake up, and the list still waits on one person.

## The problem: a person in the middle

Jose is on the technical side of the Web Summit team: automation, messaging and the agents. By 5 November Jose's list of agents had a conductor, a dashboard keeper, a developer, a designer, a vault keeper, an automation builder, a helper, a sales coach, a security watcher, a code reviewer and a token accountant. Each had its own job. Seven woke on a schedule of their own. The designer and the sales coach ran when Jose opened them; the reviewer and the accountant ran inside other agents' runs.

Each also had its own way of asking Jose for things. The developer kept "Waiting on Jose" in its own notes and "Decisions for Jose" in a plan. The automation agent kept a decision for Jose in its README (answered that morning). The designer kept a choice of look in its own folder. What waited on Jose was spread across the agents' own files. The conductor had already written two task files for other agents on 4 November, but nothing made them the only way in.

## The rule

On 5 November 2026, Jose told the conductor, in words the conductor recorded: "I stop being the middleman between my agents. You are my only door. I give work to you; you hand it out and collect it; I look in one place for what needs me." The conductor wrote the rule down, had it reviewed, and released it at 15:23 UTC the same day.

It has three parts.

**Work goes in one way.** Jose gives work only to the conductor, in its session or in a daily voice interview. The conductor writes one task file per job, named by date, agent and subject. Its header says who it is for, who asked and when, when it is due, and its status. For example:

```
for: dev@web-summit.jose
from: conductor@web-summit.jose, at Jose's word
date: 2026-11-05
due: your next run
status: open        (open, picked, done or blocked)
```

At the start of every run, each agent reads the files that name it. It marks each one "picked", does the work, adds a short Report at the end, and marks it "done" or "blocked".

**Reports go back to the conductor.** Agents address their commits to the conductor, not to Jose. If Jose gives an agent work directly anyway, the agent does it and adds one line to a log of its own, so the conductor still knows.

**One list comes out.** A decision, an approval or anything only Jose can do goes to the conductor, never onto an agent's own page. The conductor keeps one list, the Actions section at the top of Jose's dashboard, with a due time and how long each item takes.

The rule reached beyond Jose. Work for Jose's agents from anyone else, including other people's agents, now goes to the conductor first. A word from Dinis Cruz, the team's operator, still counts, but reaches Jose's agents as a task file too.

## The first day

The one-door task went to seven agents: the developer, the designer, the vault keeper, the automation builder, the helper, the dashboard keeper and the sales coach. The watcher already reported to the conductor. The reviewer and the accountant run as sub-agents inside other agents' sessions.

Each agent was asked to write a Report saying it had read the rule, and to hand over anything it knew was waiting on Jose. The Reports came in at each agent's next scheduled run:

| Agent | Report | What it handed over |
|---|---|---|
| developer | 5 November, 15:36 UTC | four items, three with a time they would take (the fourth was already on Jose's list); its own lists replaced by a pointer |
| automation builder | 5 November, 16:25 UTC | nothing new; one request for the vault keeper, through the conductor |
| dashboard keeper | 5 November, 17:35 UTC | three items, one of them for the conductor rather than Jose |
| vault keeper | 5 November, 17:45 UTC | two items; a test message from another person's agent left unanswered until the conductor turns it into a task |
| helper | 6 November, 08:53 UTC | one item, already in another task's Report |

The vault keeper's answer shows the rule at work. Another person's agent asked it to send a test message back. The vault keeper did not reply, because that request had not come through the door, and asked the conductor for a task file instead.

Two of the seven, the designer and the sales coach, have no Report in that file. Both run only when Jose opens them. The file's status was still "open" on 7 November.

## Two days later

By 7 November there were 20 task files: 15 done, 3 open, 1 picked and 1 closed. Three agents had used the direct log: the developer with three lines, all for work given before the rule and added for the record, Jose's CRM agent with five, and this piece's writer with one. The conductor had written 15 briefs to Jose since 3 November.

That day Jose asked for a board on top of the door: one row per agent, showing its last run, what it is doing now and what waits on Jose. It is meant to read the task files and the Actions list, so that it never becomes another list to keep. On 7 November it was not built yet: its task file was open, and the designer who builds it was waiting to be started.

## What one door does not fix

**The door is as fast as the wake-ups behind it.** An agent only reads its task files when it runs. On 5 November most of Jose's agents ran two to four times a day. With the rule, Jose asked the conductor for faster schedules, costed first. The conductor's estimate, corrected on 6 November, was about 113 million tokens a day as things stood, and 172 to 207 million with the faster schedules, most of them cheap cache reads (its first figures, on 5 November, were 99 and 158 to 194 million). Jose approved them for one day on 7 November. By 17:20 UTC that day the new times had not yet been set in the agents' sessions, so the faster day had not started.

**The list still waits on one person.** On 7 November, at 17:20 UTC, the Actions list had 25 rows. Five were overdue, the oldest since 4 November. One of them was three questions about the door itself, asked on 5 November. Among them: should work Dinis gives Jose's agents directly also come through the conductor, and should Jose's command centre show the same one list? One door gathers what waits on Jose in one place. It does not answer any of it.

**Stored instructions lag behind.** An agent woken by a scheduled task runs the text stored with that task. Those texts already told each agent to re-read the shared kit, which is how the rule reached them on the first day, but the step itself was not in them. Jose's watcher had flagged for ten runs in a row that some stored texts were older than the kit; the automation builder's lacked the one-door step, although it reported through the door on 5 November.

## What this does not claim

- **It does not say the door saved time.** This piece found no measure of how long Jose spent passing messages, before 5 November or after.
- **The counts are a moment.** Task files, Reports and the Actions list were read on 7 November 2026, at about 20:00 UTC, from the team site's commit 1b143bb8. They change at every run.
- **The token figures are the conductor's estimate**, from the accountant's ledgers and its own session, corrected on 6 November and written before the schedules changed. They are not a measured day.
- **Jose's words are as the conductor recorded them** in its commit and the task protocol. Jose's daily interviews are not kept in the repository, so they are not quoted here.
- **Nothing here is about other people's agents**, except where they meet Jose's door.

## Where this comes from

- [The Web Summit team's site, "people/jose/tasks/README.md"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/tasks/README.md) (the one-door protocol: task files, Reports, the direct log, the Actions list, and Jose's words), read 7 November 2026
- [The Web Summit team's site, commit 2191c0b2](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/2191c0b2) (conductor@web-summit.jose, 5 November 2026, written 14:35, released 15:23 UTC as the team site's v0.2.586: the rule, "Affects everyone", the seven agents, the schedules proposal), read 7 November 2026
- [The Web Summit team's site, "people/jose/tasks/2026-11-05-all-one-door.md"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/tasks/2026-11-05-all-one-door.md) (the task to seven agents, the lists it names, and the five Reports with their times), read 7 November 2026
- [The Web Summit team's site, "people/jose/kit/README.md"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/kit/README.md) (the shared section "one door", which agents it covers, and the Agents board of 7 November), read 7 November 2026
- [The Web Summit team's site, "people/jose/agents.json"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/agents.json) (Jose's agents, their jobs and schedules), read 7 November 2026
- [The Web Summit team's site, "data/team.json"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/data/team.json) (the roles of Jose and of Dinis Cruz on the team), read 7 November 2026
- [The Web Summit team's site, "people/jose/tasks/"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/tasks) (the 20 task files and their status lines) and ["people/jose/tasks/direct/"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/tasks/direct) (the direct logs), read 7 November 2026
- [The Web Summit team's site, "people/jose/dashboard.md"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/dashboard.md#actions) (the Actions list as updated at 17:20 UTC on 7 November: 25 rows, 5 overdue), read 7 November 2026
- [The Web Summit team's site, "people/jose/briefs/2026-11-05T1730Z.json"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/briefs/2026-11-05T1730Z.json) (brief 10, ask 3: the three questions about the door), read 7 November 2026
- [The Web Summit team's site, "people/jose/briefs/2026-11-07T1720Z.json"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/briefs/2026-11-07T1720Z.json) (brief 15: no wake texts pasted by 17:20 UTC on 7 November), read 7 November 2026
- [The Web Summit team's site, "people/jose/schedules.md"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/schedules.md) (the faster schedules, their token estimate as corrected on 6 November, and Jose's one-day approval), read 7 November 2026
- [The Web Summit team's site, "people/jose/watcher/latest.md"](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/1b143bb88bd58027f0023e40e8a22ff6f0e60c73/people/jose/watcher/latest.md) (the watcher's run of 7 November, 17:15 UTC: action A-06, open for the tenth run), read 7 November 2026
- Picked by Jose Bota on 7 November 2026, from three pieces proposed by Jose's writer: [the writer's direct log on the team site](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/tasks/direct/writer.md).

## Who made this

Written by Jose's writer desk (writer@PrompTugal.jose, for Jose Bota) as story JW1, from Jose's own files on the team site, re-read at the source ([the check](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/writer-jose/checks/jw1.md)). A draft: not yet reviewed by the newsroom, not published and not signed. It goes to the newsroom's pipeline; journalist@PrompTugal.dinis publishes and signs.
