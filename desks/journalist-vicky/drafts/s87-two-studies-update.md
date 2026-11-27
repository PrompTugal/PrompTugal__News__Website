---
title: "Update: the review study's full text, merge shares and limits"
date: 2026-11-27
story: S87
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "An update note for the published 'Two studies of agent-written code point to size and review' (content/articles/two-studies-agent-code-size-and-review.md): what the second paper's full text says about its data, merge shares and limits."
status: draft
beat: AI and robotics
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, software engineering, research, update
updates: two-studies-agent-code-size-and-review
---

**For the publisher.** This is not a new article. It is a note to place at the top of the published `content/articles/two-studies-agent-code-size-and-review.md`, directly before `## In short`, as a quote block (STYLE.md, "Update notes"). It is the article's first note. The article's own text stays as it is.

---

> **Update, 27 November 2026.** The article described "When AI Teammates Meet Code Review" from its abstract alone. The [paper's full text](https://arxiv.org/pdf/2602.19441), read since, adds the following. The PDF carries the MSR '26 conference header.
>
> - **The data.** 33,596 agent-written pull requests from 1,797 developers across 2,807 repositories, all with at least 100 GitHub stars. The dataset does not say whether a person or the agent itself opened each pull request, so the paper treats them all alike.
> - **Outcomes.** 71.5% were merged, 21.6% were closed without merging, and 6.9% were still open when the data was collected. Merge shares differed by agent: 82.6% for Codex, 43.0% for Copilot and 53.8% for Devin. Decisions also came at different speeds. The median was under an hour for Codex, 13 hours for Copilot and 9 hours for Devin. A merge share is not a quality score.
> - **The signals.** Getting at least one review was the strongest correlate of a merge. The links with force pushes during review and with larger changes held even after allowing for the agent and for reviewer engagement. Neither the number of revisions nor added tests was significantly linked to merging once those were counted.
> - **The paper's limits.** It is observational and makes no causal claims. It covers large public repositories only, so the results may not carry over to private projects, smaller communities or later agents. The figures are the paper's and were not checked.

## Where this comes from

- [arXiv, "When AI Teammates Meet Code Review: Collaboration Signals Shaping the Integration of Agent-Authored Pull Requests" (Costain Nachuma, Minhaz Zibran), full text (PDF)](https://arxiv.org/pdf/2602.19441) (the data, the outcomes, the signals and the limits), submitted 23 February 2026, read 27 November 2026
- From the curator's map: S87, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. A study of AI coding agents' pull requests.
- ai_steps: 0
- ai_places: none named in the paper.
- Update note: the article's first, so within the limits (standing answer 100). One note, a short list (standing answer 95).
- Round 2: the data bullet now gives the paper's reason for treating the pull requests alike (the dataset does not say who opened each one) and the 100-star filter. The repetition the review listed is cut: the "What it measures" bullet, and the force-push and size claims already in the article.
- Source note: the PDF was read for the data, the outcome rates, the merge shares and medians, the signals and the threats to validity. The figures match the curator's commission. The note lists the agents in the paper's order (Codex, Copilot, Devin) and draws no ranking.
