---
title: "How CrewAI says teams earn trust: start with full human review"
date: 2026-11-23
story: S80
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "CrewAI, a maker of AI-agent software, says its customers start with a person checking every output and reduce that check as the agents prove themselves. Its own blog post, with figures that were not independently checked."
status: approved
beat: AI and robotics
categories: AI, Corporate
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, agents in real work, human review
---
## In short

- CrewAI, which sells software for building AI agents, published a post on what it learnt from its customers.
- It says the teams with the best results began with a person reviewing every output, then reduced the review.
- Its main example is an HR services team whose agent now handles over half of its tickets' steps without review.
- Every figure and case is CrewAI's own statement.

## The story

CrewAI's blog post, dated 24 January 2026, is called "Lessons From 2 Billion Agentic Workflows". An agentic workflow is a job done in steps, where software built on an AI model, called an agent, does some of the steps. Human review means a person checks what the agent produced before it goes on.

CrewAI says its software ran about 2 billion of these workflows in the past 12 months. The post's main point is about trust. It says the teams with the biggest results "started with 100% human review and worked their way down". It adds that customers often go from reviewing every output to reviewing half.

**The HR example.** CrewAI describes an HR services company with more than 3,000 employee tickets a month and a compliance team that could not keep up. The company did not name it. Its agent, called Andy, drafted replies, found the relevant policies and flagged unusual cases. A person checked every ticket before it reached an employee.

After a few thousand runs, CrewAI says, the compliance team saw the quality. Its senior vice president asked whether the outputs could help train human staff. Today, the post says, Andy handles over 50% of "touches" without human review. CrewAI says this took weeks, not months.

**The sales example.** The post says DocuSign built a flow of five agents, named the Identifier, Researcher, Composer, Validator and Orchestrator, inside a fixed sequence that controls the order of steps and handles errors. It describes three checks on each result. One is an AI model scoring the quality of another's output. One compares claims with the source material to catch statements the agent made up. One is a quality score from another system. The post names better open, reply and conversion rates but gives no figures.

PagerDuty, another vendor, published its own account of running agents in production. We covered it in [an earlier article](../articles/pagerduty-agents-in-production.html).

## What this does not claim

- **Nothing here was independently checked.** The only source is CrewAI's own post. The 2 billion runs, the ticket numbers, the 50% and the weeks are its statements.
- **The post does not define a "touch".** It gives no error rates and does not say what share of tickets Andy closes alone.
- **The HR company is unnamed,** and neither company has confirmed the account.
- **The sales results have no figures.** The post only says they improved.
- **This is a vendor's account of its own product.** It is not advice, and no verdict on whether the approach works elsewhere.

## Where this comes from

- [CrewAI blog, "Lessons From 2 Billion Agentic Workflows"](https://blog.crewai.com/lessons-from-2-billion-agentic-workflows/) (every claim about CrewAI, the HR company and DocuSign), 24 January 2026 from the page's metadata, read 23 November 2026
- [PrompTugal.news, "What PagerDuty says it learned running AI agents in production"](https://promptugal.news/articles/pagerduty-agents-in-production.html) (a comparison only), 12 November 2026, read 23 November 2026
- From the curator's map: S80, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. A vendor's account of running AI agents with human review.
- ai_steps: 0
- ai_places: none named in the post.
- Chart: none drawn. A chart could show the three figures as large numbers, not bars, since they are not comparable. The designer would draw it.
- Cover could show: the title and three large facts: "2 billion runs", "3,000+ tickets a month", "50%+ without review".
- Terms: agentic workflow, human review, hallucination checks and "LLM-as-judge" are explained in plain words. "LLM-as-judge" is not used as a term in the article.
- Length: news, about 450 words from "In short" to the end of "What this does not claim".
- Source note: the post's author is not named on the page text I read, so it is credited to CrewAI. The date is from the page's metadata (published_time 2026-01-24).
