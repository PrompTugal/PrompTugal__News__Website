---
title: "What 99.9% uptime covers: how five providers count downtime"
date: 2026-11-26
story: S86
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "An uptime promise is a number plus rules for what counts as down, over what period and what the customer gets. Five providers' own pages, read on 26 November 2026, differ on all three."
status: draft
beat: AI and robotics
categories: AI
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, agents in real work, reliability, service levels
---
## In short

- An uptime promise is more than its percentage. The rules decide what counts as down, over what period, and what the customer gets.
- Google's page for its Gemini API defines downtime precisely. The OpenAI and Anthropic pages read here do not.
- Anthropic's commercial terms, as read, make no uptime commitment. Its 99.5% target is for a legacy tier that is closed to new buyers.
- This reads each provider's own pages as they stood on 26 November 2026. It ranks nobody.

## The story

Uptime is the share of time a service works. An SLA, short for service level agreement, is the written promise about it. A service credit is money taken off a later bill when the promise is missed. A buyer of AI or cloud services should read how downtime is counted, not only the number.

The number alone allows a lot. In a 30-day month of 43,200 minutes, 99.9% allows about 43 minutes of downtime, 99.5% about 3.6 hours and 99.99% about 4 minutes. That is arithmetic, not any provider's figure.

**Google, Gemini API.** The page sets 99.5% a month for two Gemini methods on Gemini Enterprise Agent Platform. For models that Google's documentation designates for shorter availability, the objective is 95% instead. Downtime means more than a five percent error rate, measured on the server. It counts only in stretches of five or more consecutive minutes. Shorter, intermittent problems do not count. Credits are 10%, 25% or 50% of the monthly bill for the affected service, by how far the month fell short. The customer must claim within 30 days and supply logs. Credits are capped at 50% of the bill.

**OpenAI, Scale Tier.** The page says Scale Tier, for Enterprise customers on models released before GPT-5.6, comes with a 99.9% uptime SLA and a latency SLA. If both are missed, the customer is credited with the greater of the two amounts. The page does not say how downtime is counted or how large a credit is.

**Anthropic.** Its service-tiers page says the standard tier has best-effort availability. It says the Priority Tier "targets 99.5 percent uptime". The page also says service tiers are legacy. Capacity commitments for the Priority Tier are no longer available for purchase, and organisations with an existing commitment can use it until their contract ends. The page does not define downtime or credits. The Commercial Terms say the services are provided "AS IS" and "AS AVAILABLE" and are not warranted to be uninterrupted. No uptime commitment appeared in the terms as read.

**GitLab.** The page covers GitLab's hosted service, not self-managed GitLab, on the Ultimate tier bought or renewed from 1 January 2026. It promises 99.9% each calendar month for issues and merge requests, Git operations, the container and package registries and the API requests for those. A downtime minute is one in which 5% or more of valid customer requests end in server errors. Scheduled and emergency maintenance, force majeure and general internet problems are excluded. Credits are 5% of monthly fees below 99.9% and 10% below 99.5%.

**AWS, EC2.** The page, last updated 25 May 2022, says AWS will use commercially reasonable efforts to meet two levels. One is 99.99% for a region when instances run in two or more availability zones, which are separate locations within a region. The other is 99.5% for a single instance. A single instance counts as unavailable when it has no external connectivity. Credits go against future payments, and the page calls the SLA the customer's sole and exclusive remedy, unless the customer's agreement says otherwise.

## What this does not claim

- **This is not a ranking.** The promises cover different services, tiers and customers, so they cannot be set in one order.
- **Pages change.** Each is as read on 26 November 2026. Contracts may add terms the pages do not show.
- **A missing definition is not a missing promise.** Where a page does not define downtime, the period or credits, the article says so, and it does not say none exists.
- **Nothing here is about any one outage.** It rests on the six pages alone.

## Where this comes from

- [Google Cloud, "Gemini Online Inference API on Gemini Enterprise Agent Platform Service Level Agreement (SLA)"](https://cloud.google.com/vertex-ai/generative-ai/sla) (the 99.5% objective, the downtime definition, the credits), read 26 November 2026
- [OpenAI, "Scale Tier for API Customers"](https://openai.com/api-scale-tier) (the 99.9% uptime SLA and the credit rule), read 26 November 2026
- [Anthropic, "Service tiers"](https://docs.claude.com/en/api/service-tiers) (best-effort standard tier, the Priority Tier target), read 26 November 2026
- [Anthropic, "Commercial Terms of Service"](https://www.anthropic.com/legal/commercial-terms) ("AS IS" and "AS AVAILABLE"), read 26 November 2026
- [GitLab Handbook, "Service Level Agreement"](https://handbook.gitlab.com/handbook/engineering/infrastructure-platforms/service-level-agreement/) (the 99.9% promise, the downtime minute, the exclusions, the credits), read 26 November 2026
- [Amazon Web Services, "Amazon Compute Service Level Agreement"](https://aws.amazon.com/compute/sla/) (EC2's two promises and the definition of unavailable), read 26 November 2026
- From the curator's map: S86, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. How AI providers promise reliability, with cloud providers as comparison.
- ai_steps: 0
- ai_places: none named.
- Cover could show: the title and three large facts: "99.9% = about 43 minutes a month", "5 minutes in a row, Google", "no external connectivity, AWS".
- Chart: none drawn. A chart, if wanted, would show the minutes allowed by each percentage, drawn by the designer.
- Terms: uptime, SLA and service credit are explained in plain words at first use. Availability zone is glossed.
- Length: explainer, about 640 words from "In short" to the end of "What this does not claim".
- Round 2: the four facts and the wording point from the review of 26 November are fixed (Anthropic's legacy tier, Google's 95% models, GitLab's hosted service, AWS's efforts wording).
- Source note: no GitHub capture or any GitHub figure is used, as the task says. The AWS page is dated 25 May 2022 by its own "Last Updated" line. The OpenAI page now sends models from GPT-5.6 on to a different tier, which the draft notes.
