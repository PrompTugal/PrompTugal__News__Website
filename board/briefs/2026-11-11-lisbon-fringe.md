# Brief: Lisbon Fringe (fringe.promptugal.news)

> **Superseded by the full brief in the repository: https://github.com/PrompTugal/PrompTugal__News__Fringe/blob/dev/BRIEF.md (and the kick-off prompt for conductor.b@, KICKOFF.md).** This first version stays for the record.
>
> For Dinis to start on account B (conductor.b@PrompTugal.dinis's account). Written by conductor@web-summit.dinis at Dinis's word, 11 November 2026, about 10:00 UTC. The name is Dinis's choice. The guidance is `board/guidance/2026-11-11-the-site-follows-the-storm-and-lisbon-fringe.md`.

## What it is

**An independent guide to everything happening around Web Summit Lisbon:** the alternative and unconference events, the communities, the side events and meetups, and the people who want to meet. It has two aims:
- help someone in Lisbon this week find out what is on, where and how to join;
- connect the dots between people and events.

It matters most today. Storm Charles cancelled the summit's Wednesday, and much of the week is moving elsewhere or online. "There seems to be like an Uncon event going on ... lots of people want to do that ... a massive opportunity."

**What it is not:** Web Summit's site, or one speaking for it. It never uses Web Summit's name or logo as its own brand, says plainly that it is independent, and links to the organisers' own pages for anything official.

## The mapping: what to build first

1. **Events now.** One page listing what is on today, tomorrow and Friday:
   - for each event: name, organiser, place (or online), time, how to join, and whether it moved because of the storm;
   - every fact carries its source URL and the time it was read.
2. **Communities.** The groups behind the events: meetups, open-source projects, national delegations, founders' circles, unconferences. Give each what it is, how to join and its public links.
3. **Connect the dots.** A graph of events, communities, topics and places, for example "everything about AI agents this week". It reuses pt.news's graph and the GAMMA-Ray company cards where a company is involved.
4. **Submit an event.** A simple public form that sends to a private lane. A person or an agent checks each submission before it is published, and every listing says where it came from.
5. **Today's practical layer.** The storm, from https://storm-charles.promptugal.news (its `/api/v1/index.json`). Show warnings, transport and what has moved. Link it rather than copying it.
6. **Data for agents.** `/api/v1/events.json` and `/llms.txt`, as the storm site does, so other agents (pt.news, the apps, the Team app) can use it.

## Sources (public only)

- Event platforms' public pages: Luma, Meetup, Eventbrite.
- Organisers' own sites and their public social posts.
- Web Summit's public side-event listings, read by hand. The incident team found that websummit.com's terms forbid automated reading (Terms 48.2, 52.1), so no scraping of websummit.com; follow its public social accounts and the press instead.
- social.watch@PrompTugal.dinis's fringe beat.
- pt.news's events data (`data/events`).

No contact details beyond what an organiser publishes for joining. Nothing about private people.

## The team (account B; start as few sessions as the work needs)

| Agent | Job |
|---|---|
| **fringe.conductor@PrompTugal.dinis** | runs the site and the team; the brief to Dinis; links to pt.news and the storm site |
| **fringe.dev@PrompTugal.dinis** | the site: fast build and fast CI, copying the storm site's pipeline (PrompTugal/PrompTugal__News__Storm-Charles: a push live in about 23 s); events JSON, the form, the graph |
| **fringe.researcher@PrompTugal.dinis** | finds and checks events and communities; sources and times on every fact |
| **fringe.security@PrompTugal.dinis** | the baseline: reviews every commit (keys, contact details, the submission lane, third-party requests) |

Add a designer (or let fringe.dev@ reuse pt.news's Front Page design E) and the work desk (a reporter and a journalist of the agents' work) when the first version is live.

## Set-up (Dinis)

1. **Create the repository**, PrompTugal/PrompTugal__News__Fringe (created by Dinis), and point the subdomain fringe.promptugal.news at it, as was done for storm-charles.promptugal.news.
2. **Start fringe.conductor@ on account B** with this file as its first prompt. It starts the others as it needs them, at Dinis's word.
3. **Each agent** makes its own session key and publishes the public half in pt.news's `board/keys.json`.

## Day one, done means

- The site is live with today's and tomorrow's events (at least the ones social.watch@ and the press have found, each sourced).
- The storm block reads from the storm site.
- pt.news's home page links to it.
- `/api/v1/events.json` is served.
