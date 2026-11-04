---
title: Brief 3: what we publish, the beats and the shape of an article
summary: The newsroom's beats (the companies at the summit, the summit itself and its logistics, Portugal, Europe, announcements, interviews, and how this newsroom is made), the shape of every article, and the corrections rule.
---
Written by conductor@web-summit.dinis from [brief 1](../01-the-vision/index.html). Brief 1 wins where they differ.

## The beats {#beats}

| Beat | What goes in it | Where it comes from |
|---|---|---|
| **The companies** | a page per company going to the summit: what they do, what is new, what they will show; how their agents could be given a mandate, where it fits | the team's `data/companies.json` (read, never written), each fact re-checked at the company's own pages |
| **The summit** | what is on, day by day; logistics (venue, getting there, passes, the apps); the schedule as far as it is public | websummit.com and the team's `data/events.json`, with dates read |
| **Portugal** | the Portuguese industry: the latest news, startups, government support, the ecosystem; *"that banner that we already have on the other site about the Portuguese industry"* (newsroom.sgit.ai's Portugal section) | public news and official sources, gathered by the research run ([brief 4](../04-the-desks-and-the-run/index.html)) |
| **Europe** | European tech, policy and companies at the summit: *"we should be really doing a massive push"* | the same |
| **Announcements** | what companies and the summit announce, as it happens, before and during | press releases, the summit's own channels |
| **Interviews and podcasts** | original conversations with people at the summit, published only with their approval | [brief 5](../05-interviews/index.html) |
| **How this newsroom is made** | the agentic team, its behaviour policies in action, its near misses, the vaults, the keys: our technology shown working | the team's site and this repository; its own section, never mixed into the news |

## The shape of an article {#article}

From the estate's newsrooms (newsroom.sgit.ai, the PHP newsroom), kept as they work:

1. **A title under 12 words** (Indi's review: the earlier newsrooms' 30 to 50 word headlines lost readers).
2. **In short:** three to five bullets, the whole story for someone with ten seconds.
3. **The body**, in short sentences, plain words, British spelling, no em-dashes.
4. **What this does not claim**: the limits, said plainly.
5. **Where this comes from**: every source, with the date read.
6. **The agent block** at the end, and the article signed with the newsroom's key.

Front matter: `title`, `date`, `author`, `summary`, `status`, `license`, `tags` (the beat, the companies named).

## The positive line, in practice {#positive}

- Lead with what is good and new; best in class, innovation, people.
- A comparison or a ranking needs a source for every number in it.
- Never invent enthusiasm: a quote is a quote someone said, publicly or to us with approval.
- A company that asks to be featured, or to be left out, gets an answer within a day.

## Corrections {#corrections}

Anyone can ask for a correction, by the feedback pane or by email to the team. A correction is published on the page it corrects, dated, with what changed, and never silently. A request for a correction is a good sign (one of the KPIs), not a problem.
