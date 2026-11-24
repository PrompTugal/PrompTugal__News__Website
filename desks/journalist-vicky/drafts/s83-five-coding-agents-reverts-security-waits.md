---
title: "A study of five coding agents: reverts, security and review waits"
date: 2026-11-24
story: S83
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "A paper on arXiv studies 37,623 code changes from five AI coding agents and finds that revert rates differ by agent. Read from its abstract only, with figures that were not checked."
status: approved
beat: AI and robotics
categories: AI, Corporate
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, agents in real work, software engineering, research
---
## In short

- A paper posted to arXiv on 12 September 2026 studies 37,623 code changes from five AI coding agents and a matched human baseline.
- It reports that revert rates differ by agent, and that agent code overall was less likely to contain a security smell.
- It also reports that human review of agent work is uneven, with one agent's changes waiting a median 12.6 hours for a first review.
- This is read from the paper's abstract only. The figures are the paper's and were not checked.

## The story

The paper is titled "Not All Agents Are Equal: Code Quality and Post-Merge Maintenance Across Five Autonomous Coding Agents in the Wild", by Obada Kraishan. A pull request is a proposed code change that a colleague checks before it joins a project. It studies 37,623 of them from 2,807 public GitHub repositories, written between December 2024 and July 2025 by OpenAI Codex, Devin, GitHub Copilot, Cursor and Claude Code, and by humans as a matched comparison.

**Reverts.** A revert is a change that is undone after it causes a problem. The abstract says quality differences are specific to each agent, not uniform. Codex's pull requests were reverted about half as often as the human ones: 6.1% against 11.5%. Devin's were reverted more often, at 14.5%.

**Security.** A security smell is a pattern in code that often points to a weakness. The abstract says code from the agents, pooled together, was less likely than human code to contain one. It says this was driven by fewer hardcoded credentials, which are passwords or keys written into the code, and fewer eval-style constructs, a risky way of running text as code.

**Review.** The abstract says human review is spread unevenly. Copilot's pull requests drew the most human reviews and requests for changes. Claude Code's waited longest for a first human review, a median of 12.6 hours.

The paper measures reverts, not outages in production. Its code dates from before the accounts of three companies we covered: [CrewAI](../articles/crewai-trust-starts-with-human-review.html), [Intercom](../articles/intercom-ai-approves-code-changes.html) and [Spotify](../articles/spotify-ai-change-outran-checks.html).

## What this does not claim

- **Only the abstract was read.** The full paper and its method were not, so how the agents' pull requests were matched to human ones is unchecked.
- **The figures are the paper's own** and were not checked here. The page does not say whether the paper has been peer reviewed.
- **A revert is not an outage.** The paper counts undone changes, not incidents in production.
- **The period is earlier.** The code is from December 2024 to July 2025, before the companies' own accounts.
- **There is no ranking here beyond the paper's wording,** and no verdict on AI-written code.

## Where this comes from

- [arXiv, "Not All Agents Are Equal: Code Quality and Post-Merge Maintenance Across Five Autonomous Coding Agents in the Wild" (Obada Kraishan), abstract page](https://arxiv.org/abs/2609.17598) (every claim about the paper), submitted 12 September 2026, read 24 November 2026
- [PrompTugal.news, "How CrewAI says teams earn trust: start with full human review"](https://promptugal.news/articles/crewai-trust-starts-with-human-review.html) (a comparison only), read 24 November 2026
- [PrompTugal.news, "How Intercom lets AI approve code, and keeps people accountable"](https://promptugal.news/articles/intercom-ai-approves-code-changes.html) (a comparison only), read 24 November 2026
- [PrompTugal.news, "Spotify says AI made change outrun its checks"](https://promptugal.news/articles/spotify-ai-change-outran-checks.html) (a comparison only), read 24 November 2026
- From the curator's map: S83, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. A study of AI coding agents' code quality.
- ai_steps: 0
- ai_places: none named in the abstract.
- Cover could show: the title and three large facts: "37,623 code changes", "6.1% against 11.5% reverted", "12.6 hours to a first review".
- Chart: none drawn. A chart, if wanted, would show the revert rates the abstract gives, drawn by the designer.
- Terms: pull request, revert, security smell, hardcoded credentials and eval-style constructs are explained in plain words at first use. The abstract's odds ratios are left out.
- Length: news, about 440 words from "In short" to the end of "What this does not claim".
- Source note: abstract page only, so the paper's method, its definitions and its other results were not read.
