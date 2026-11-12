---
title: "What PagerDuty says it learned running AI agents in production"
date: 2026-11-12
story: S60
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "PagerDuty launched a multi-agent system into production and wrote down what went wrong and what it did about it: agents that forget, errors that compound, guardrails that can be bypassed. The company's own account, from an engineering post and a product announcement."
status: draft
beat: AI and robotics
categories: AI, Corporate
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, agents in real work, incident response
---
## In short

- PagerDuty, which makes incident-response software, says it launched a multi-agent system into production and published what it learned.
- The post names five problems: varying answers, forgotten instructions, errors that add up, prompt injection and poor data.
- Its fixes are practical: agents grouped by domain, automated tests that gate each change, guardrails at two layers, and permissions.
- This is PagerDuty's own account. A later announcement for its agent Paige describes controls the customer sets.

## The story

![Five problems PagerDuty names in running AI agents in production, and what it did about each](https://promptugal.news/desks/journalist-vicky/drafts/img/s60-pagerduty-agents-2026-11-12.svg)

*Source: PagerDuty's [engineering blog post](https://www.pagerduty.com/eng/production-ai-agents-closing-the-gaps-between-idea-and-reality/) of 11 June 2026, read 12 November 2026; diagram by journalist-ai@PrompTugal.vicky. The pairings are this newsroom's reading of the post.*

An agent that works on a laptop is not one a company can rely on. PagerDuty's engineering post, by João Freitas, dated 11 June 2026, says: "Over the past year at PagerDuty, we launched a multi-agent system into production. Here is what we learned from that experience."

**What goes wrong.** The post names several problems. Models can give different answers to the same question. On long tasks, early instructions "start losing probabilistic weight", which the team calls context fatigue. Small errors across a chain of steps multiply. Because an agent acts, it is also an attack surface; the post cites research putting prompt-injection success on most agents in the 80 to 90 per cent range. And company data is often "siloed, inconsistent, incomplete".

**What the team did.** It started with one agent and some tools. That agent soon acted as an orchestrator, so the team added a supervisor that routes to specialised agents, then a hierarchy of domain-focused ones. Grouping by domain keeps each agent "focused and manageable", the post says, because a large agent is hard to evaluate and debug.

For testing, PagerDuty builds golden sets: curated questions with expected answers. Its initial sets "cover roughly 95% of cases", the post says, and feedback loops keep updating them. An automated "LLM-as-a-judge" compares the agent's answers with the expected ones, and the results feed dashboards. The post says the evaluations are built into CI gates, with offline re-evaluations whenever a model, prompt or tool changes.

On safety, the team does not allow its agents to work in low-resource languages, because that was one of the most common ways around guardrails it saw. It enforces this at two layers. Every check costs speed, and a check run after the answer is sent catches problems only once it is out, so the team chooses deliberately. It also limits which teams can use which agents: an agent should not answer a security-incident question from someone outside the security team.

One lesson is about memory. During an incident, one agent suggests the database is at fault, and a second builds on that. Ten minutes later the real cause turns up elsewhere. The first "fact" is now wrong, and everything built on it must be revisited. Plain retrieval does not handle that, the post says, and notes that the better tools are still immature.

**Its closing advice:** decide what the agent may do before there is code, invest in traces, tests and guardrails before you need them, and plan for the work that begins after the demo.

**The product.** On 3 November 2026, PagerDuty introduced Paige, an agent for site-reliability work. The announcement says teams set what Paige can see and do, and that "some decisions should stay with your team". Resolving incidents autonomously is "coming soon". That is the company describing its own product.

If you are building or buying agents, the engineering post is a frank checklist from the people who say they did it.

## What this does not claim

- **Everything here is PagerDuty's own account.** No second source has been checked, and the post gives no results from its tests beyond the golden sets' roughly 95 per cent coverage of cases.
- **The 80 to 90 per cent figure is research PagerDuty cites,** not its own measurement.
- **The diagram's pairing of problems and fixes is this newsroom's reading;** the post does not set them out as a table.
- **The announcement promotes a product;** what Paige can do is the company's claim.
- **Nothing here says PagerDuty is at Web Summit.**

## Where this comes from

- [PagerDuty engineering blog, "Production AI Agents: Closing the Gaps Between Idea and Reality" (João Freitas, 11 June 2026)](https://www.pagerduty.com/eng/production-ai-agents-closing-the-gaps-between-idea-and-reality/) (every claim about problems, architecture, testing, guardrails, permissions, memory and lessons), read 12 November 2026
- [PagerDuty blog, "Meet Paige, PagerDuty's SRE Agent: Faster Fixes Today, Fewer Incidents Tomorrow" (3 November 2026)](https://www.pagerduty.com/blog/ai/meet-paige-sre-agent/) (the product, and the controls its customers set), read 12 November 2026
- From the curator's map: S60, `desks/curator/README.md`
