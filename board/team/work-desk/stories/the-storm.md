---
title: "How a team of agents covered the storm"
author: journalist.newsroom@PrompTugal.dinis
status: outline (waiting for reporter.newsroom@'s trace, board/team/work-desk/traces/the-storm.json)
story: the-storm
written: 2026-11-10T17:30Z
---

# How a team of agents covered the storm (outline)

> The story of the work, not of the weather. Built only from reporter.newsroom@PrompTugal.dinis's trace and the commits it cites. Every time, actor and cost below comes from the trace; where the trace has no value, the story says "not recorded" and does not guess. Analysis is labelled as analysis. When it is ready it is offered to the newsroom's pipeline as a draft: the newsroom publishes, not this desk.

## What is known before the trace (from the record, read 10 November 2026, about 17:25 UTC)

- Dinis's guidance of 17:15 UTC names the storm as the case study and the five steps to trace (`board/guidance/2026-11-10-the-storm-as-our-case-study.md`).
- The weather desk (weather@PrompTugal.vicky, `desks/weather-vicky/`, story S41) made its key and first live page at 16:55 UTC, and by 17:21 UTC had committed transport, sea and venue sources, the government's alert situation, the decision chain and draft values for the home-page lead (five commits, `git log -- desks/weather-vicky`).
- Its README keeps a source map that marks, for each source, whether a machine can read it. That map is where step 1 below starts.

## The shape of the story

1. **The lede (one paragraph).** A red wind warning for Lisbon on the third day of the summit, and a newsroom that answered it by growing a team in hours. One number up front from the trace: how many agents, how many hand-offs, how many minutes from the first raw source to the first reader-facing page.
2. **The cast.** One short entry per actor in the trace (`materials/the-storm/actors.json`): what it is for (from its brief or ROLE file), what it did here, first and last step, minutes on the story, tokens if its run report records them. People are named only by public, professional role (Dinis, the operator; Vicky, who directs her desks).
3. **The five steps, as a detective story** (each with its commit or file as evidence):
   1. a researcher hits a raw source (IPMA's warnings JSON, or a page where one part matters);
   2. it asks for a parser for that part only;
   3. an architect writes a plan as a markdown file;
   4. the developer builds it and the designer maps it;
   5. a UI turns noise into signal.
   Where the trace shows a step did not happen (or happened in another order), the story says so. That is a finding, not a gap to fill.
4. **The diagram.** The sequence of hand-offs drawn from the trace (`materials/the-storm/the-storm.mmd`), with every hand-off between a person and an agent drawn heavier (`flow.mmd`).
5. **The decision graph, as the agents built it.** Not the storm's decisions themselves (that is the weather desk's story) but how the agents assembled them: who found which node, from which source, at what time.
6. **Looking back (analysis, labelled).** How early the first signal was in the record against when the agents acted on it; what a reader would have known, and when.
7. **What it cost.** Tokens and minutes per actor and in total, from run reports. The comparison accountant@PrompTugal.dinis asked for: what a visualiser would have read without the trace against with it. Estimates are labelled as estimates.
8. **What did not work.** Blocked agents, missing tools, retries, anything waiting on a person. From the record only.
9. **Sources.** Every commit, file and run report cited, with its time.

## Rules this story keeps

Public facts only; no contact details; nothing from a private conversation; no em-dashes; no claim for RiskMandate beyond riskmandate.ai and the team's site.
