---
title: "How Intercom lets AI approve code, and keeps people accountable"
date: 2026-11-23
story: S81
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "Intercom says over 19% of its code changes are now approved by an AI agent with no human reviewer. Its own engineering post lists the rules and the results, which were not independently checked."
status: draft
beat: AI and robotics
categories: AI, Corporate
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, agents in real work, software engineering
---
## In short

- Intercom says over 93% of its code changes across its two main codebases are agent-driven, and over 19% are approved with no human reviewer.
- Its rules: approval is never forced, any engineer can ask for a human review, and the engineer who ships a change stays accountable.
- Intercom reports no reverts in a pilot of over 100 changes and lower revert rates for AI-written code.
- All figures are the company's own and were not independently checked.

## The story

On 21 April 2026 Intercom's engineering blog described how an AI agent now approves some of its code changes. A code change is called a pull request: a proposed edit that a colleague checks before it joins the product. An approved change is "merged", and a change that is undone after it causes a problem is "reverted".

Intercom says humans cannot review the volume of code that AI now produces. Its answer is a review agent made of several sub-agents, smaller AI helpers that each take one part of the job. One judges the description of the change, another checks the code matches it, and others look at safety, logic and good practice.

**The rules.** The post names several. Automated approval is never forced, and any engineer can ask for a human review at any time. The engineer who ships a change still has to watch it go live and roll it back if needed. The agent refuses large changes and asks for them to be split. Each AI approval is labelled and logged, so it can be audited later.

**The results, as Intercom reports them.** A pilot of over 100 pull requests had zero reverts of AI-approved changes. In the first four weeks of a wider rollout, 497 changes went through fully autonomously, with an AI writing the code and the approval system reviewing and shipping it. Intercom also compares AI-written code with human-written code: 0.53% reverted against 5.39% on the backend, and 0.22% against 2.00% on the frontend. The company adds that it does not expect zero reverts to hold forever.

For another vendor's account of when to remove human review, see [our article on CrewAI](../articles/crewai-trust-starts-with-human-review.html).

## What this does not claim

- **None of this was independently checked.** The only source is Intercom's own post, and every figure is its statement.
- **It does not show that AI approval is safer than human review.** The revert rates compare AI-written code with human-written code, not the two kinds of approval.
- **The post gives no error rates for the review agent itself,** and no breakdown of which changes it approved or refused.
- **It is one company's engineering practice.** Nothing here says other teams would get the same results.

## Where this comes from

- [Intercom blog, "AI is approving our pull requests: Here's how we made it safe"](https://intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe) (every claim about Intercom, its rules and its figures), 21 April 2026, read 23 November 2026
- [PrompTugal.news, "How CrewAI says teams earn trust: start with full human review"](https://promptugal.news/articles/crewai-trust-starts-with-human-review.html) (a comparison only), read 23 November 2026
- From the curator's map: S81, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. A company's account of AI agents reviewing and approving code.
- ai_steps: 0
- ai_places: none named in the post.
- Cover could show: the title and three large facts: "93% agent-driven", "19% approved with no human reviewer", "497 fully autonomous in four weeks".
- Chart: none drawn. A chart, if wanted, would show those three figures as large numbers, drawn by the designer.
- Terms: pull request, revert, merge and sub-agent are explained in plain words at first use.
- Length: news, about 450 words from "In short" to the end of "What this does not claim".
- Source note: the post names two authors in its byline. They are not named here because the article credits the company. The "time to approval" figures in the post were left out as they are not needed.
