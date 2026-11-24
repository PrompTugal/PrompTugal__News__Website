---
title: "Update: how the five-agent study defined a revert, and its limits"
date: 2026-11-24
story: S84
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "An update note for the published 'A study of five coding agents: reverts, security and review waits' (content/articles/five-coding-agents-reverts-security-waits.md): what the paper's full text says about its revert count, its baseline and its own limits."
status: draft
beat: AI and robotics
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, software engineering, research, update
updates: five-coding-agents-reverts-security-waits
---

**For the publisher.** This is not a new article. It is a note to place at the top of the published `content/articles/five-coding-agents-reverts-security-waits.md`, directly before `## In short`, as a quote block (STYLE.md, "Update notes"). It is the article's first note. The article's own text stays as it is.

---

> **Update, 24 November 2026.** The article was written from the paper's abstract alone. The [paper's full text](https://arxiv.org/pdf/2609.17598), read since, answers some of what was left open. The PDF is marked "A PREPRINT" and dated 17 September 2026.
>
> - **A revert.** The paper counted a revert as a revert-style commit, flagged by its message, among the commits that touched a pull request's most-changed file in the 90 days after it merged.
> - **The baseline.** The human comparison was 4,027 pull requests alongside 9,750 agent pull requests in the same 810 repositories.
> - **The agents.** Codex had 6.1% of its pull requests reverted, against 11.5% for the human baseline, with an odds ratio of 0.50. An odds ratio below 1 means reverted less often. Devin had 14.5%, with an odds ratio of 1.31. Copilot, Cursor and Claude Code were statistically indistinguishable from humans.
> - **The paper's own limits.** Revert detection by message misses silent rewrites. Agents were not randomly assigned to tasks, so the quality of the code and the kind of task are mixed together. The corpus was public repositories with more than 100 stars, three programming languages and December 2024 to July 2025, so the results may not transfer to private code, other languages or later versions of the agents.
> - **Still unknown.** The paper counts reverts, not outages in production. The text read here does not say whether it has been peer reviewed. The figures are the paper's and were not checked.

## Where this comes from

- [arXiv, "Not All Agents Are Equal" (Obada Kraishan), full text (PDF)](https://arxiv.org/pdf/2609.17598) (the revert definition, the baseline, the odds ratios and the limits), marked a preprint and dated 17 September 2026, read 24 November 2026
- From the curator's map: S84, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. A study of AI coding agents' code quality.
- ai_steps: 0
- ai_places: none named in the paper.
- Update note: the article's first, so within the limits (standing answer 100). One note, a short list (standing answer 95).
- Source note: the PDF was read in full for the definitions, the baseline sizes, Table 2 and the limits. The paper's revert table counts more agent pull requests per agent than the 9,750 in the matched baseline, so the note gives the baseline sizes and the per-agent rates separately and does not pair them. The abstract page says submitted 12 September 2026 and the PDF header says 17 September 2026. The note quotes the PDF's date.
- Length: update note, about 250 words.
