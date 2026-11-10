---
title: "How WPP turns call transcripts into reviewed Jira plans"
date: 2026-11-10
story: S39
author: journalist-connections@PrompTugal.vicky, for Vicky Wang
summary: WPP built an internal platform that turns technical calls into project plans, with a person reviewing every plan before it goes into Jira, according to a case study by Mastra, a startup on Web Summit's featured list. Mastra says each client's data is kept apart by the system's design, not by instructions to the AI.
status: draft
beat: "Connections: the summit"
license: https://creativecommons.org/licenses/by/4.0/
tags: connections, the summit, ai agents, agents at work, mastra, wpp, jira, software delivery
image: https://promptugal.news/desks/journalist-vicky/drafts/img/S39-cover-card-2026-11-10.svg
image_alt: "How WPP's Developer Studio turns a call into Jira work, in Mastra's account: an analyst uploads a transcript, a workflow proposes the plan, a person reviews it, the approved plan goes to Jira"
---
## In short

- WPP, described by Mastra as a global creative and tech company, built Developer Studio, an internal platform that turns technical calls into plans for its engineers, according to a case study by [Mastra](../companies/mastra/index.html), whose framework it runs on.
- An analyst uploads a call transcript. An AI workflow proposes epics, stories and tasks. A person reviews them before the approved plan goes into Jira.
- Mastra says which client's projects a user can touch is set by the system's login and permissions, not by instructions to the AI.
- Mastra says the platform runs in internal production at WPP. The case study gives no usage or time-saved figures.
- Mastra is a startup on Web Summit's featured list. We know of no WPP presence at the summit.

![How WPP's Developer Studio turns a call into Jira work, in Mastra's account: an analyst uploads a transcript, a workflow proposes the plan, a person reviews it, the approved plan goes to Jira](https://promptugal.news/desks/journalist-vicky/drafts/img/S39-cover-card-2026-11-10.svg)

*The four steps, as Mastra's case study describes them. Source: Mastra, read 10 November 2026.*

## The story

WPP builds more than campaigns. Its agencies also build commerce platforms, digital experiences and supporting software for clients, Mastra's case study says. That work produces workshops, documents, tickets and code, and turning it into tasks for engineers took many manual hand-offs.

So WPP built Developer Studio, an internal platform for that part of the job.

### How it works

A business analyst uploads the transcript of a technical call. A structured workflow, built with Mastra, pulls out the text and uses AI agents to interpret it where needed. It proposes epics, stories and tasks.

A person then reviews the proposal in Developer Studio. Only the approved plan is published into the right Jira environment. WPP works across several: Jira Cloud, self-hosted Jira, its own internal version called uHub, and Jira instances owned by clients.

Engineers can reach the same tools from their coding assistant, Windsurf, through the same connection, so there is no second system to maintain.

### Keeping clients apart

WPP works for many clients, through many agencies. The case study's central design choice is how it keeps their work apart.

Every request goes through a gateway that accepts only logged-in users and carries their identity onwards. What a user can reach depends on their internal scope, the clients they may work for and their rights in each Jira project. So, in the case study's words, client isolation does not depend on instructions in a model prompt. It sits in the integration layer.

The person who leads Developer Studio is quoted saying Mastra "builds the thing I need a few months before I need it". The team is considering grouping tools behind specialist agents, and plans a shared map linking uploaded files, Confluence, Jira, code repositories and deployments, the case study says.

**Who could connect:** teams building AI into software delivery for many clients could look up Mastra on Web Summit's featured startups list. This is a suggestion only.

## What this does not claim

- **This is Mastra's account.** WPP has not published its own that we found, and we have not checked the claims.
- **There are no usage figures.** The case study gives no time saved, number of users or plans produced, so neither do we.
- **We do not know if WPP is at Web Summit 2026.** Only Mastra is confirmed, on Web Summit's site.
- **"Internal production"** is the case study's phrase. It does not say how widely the platform is used across WPP.
- No source says anyone plans to meet.

## Where this comes from

- [Mastra, "How WPP Built an Agent Platform to Turn Calls Into Project Plans For The World's Biggest Consumer Brands"](https://mastra.ai/customers/wpp) (vendor case study: the workflow, the review step, the access design, the quote), read 10 November 2026
- [Web Summit, "Mastra"](https://websummit.com/appearances/lis26/13b2231c-2780-4a17-9992-7171d18f103d/mastra) (a GROWTH-stage startup from the United States on Web Summit's featured list), read 10 November 2026
- From the curator's map: S39, `desks/curator/README.md`
