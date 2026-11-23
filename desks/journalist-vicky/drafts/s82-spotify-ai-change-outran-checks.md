---
title: "Spotify says AI made change outrun its checks"
date: 2026-11-23
story: S82
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "Spotify Engineering says it found no direct AI-written cause in the incidents it reviewed, but that the volume of change grew faster than its checks. Its own post, with figures that were not independently checked."
status: approved
beat: AI and robotics
categories: AI, Corporate
license: https://creativecommons.org/licenses/by/4.0/
tags: AI agents, agents in real work, software engineering, quality
---
## In short

- Spotify Engineering says that in the incidents it has reviewed, AI-written code was not a material direct cause.
- It says the amount of change grew faster than some of its checks could adapt, and it is strengthening them.
- Its example is an automated software update that passed its checks but still failed in production.
- Every figure and finding is Spotify's own statement and was not independently checked.

## The story

Spotify Engineering published a post on 16 September 2026, according to the page's metadata, called "AI Changed How Spotify Builds. What We Learned (and Fixed) About Quality at Higher Velocity". It says Spotify had quality problems earlier in the year. It says "AI slop", meaning careless AI-made output, was not among the causes.

**The finding.** Each month Spotify reviews its major incidents. During its AI ramp-up it began asking whether AI-written code directly contributed, and whether the growing volume of change strained the way it reviews, tests, releases or monitors changes. It says: "Across the incidents reviewed so far, we did not identify AI-authored code as a material direct contributor." It did see the second risk. The volume of change grew faster than some of its verification controls could adapt.

**The volume.** A pull request is a proposed code change that a colleague checks before it joins the product. Spotify says the number of merged pull requests more than doubled year over year in August, from roughly 8,100 to 17,000.

**The example.** Spotify runs tools that make changes across its services automatically. A dependency upgrade, an automatic update to a piece of other software that its own code relies on, passed its checks this year but still failed in production and affected users. The company says it is strengthening safeguards and adding capacity for rollbacks, which return a service to its previous working version. It is also scheduling automated changes during the owning teams' working hours.

**The warning signs.** Spotify says two measures are creeping up: code complexity and the size of pull requests. Before AI these were clear quality concerns. It says a bigger pull request may now just mean a person and an agent worked together on a larger piece of work. It says it has no conviction either way and is not rewriting its thresholds.

Its summary: "AI increased the capacity to produce change. The next constraint became our ability to verify it."

For another company's account of when to ease human review, see [our article on CrewAI](../articles/crewai-trust-starts-with-human-review.html).

## What this does not claim

- **Nothing here was independently checked.** The only source is Spotify's own post, and every figure and finding is its statement.
- **It is not a verdict on AI code quality.** Spotify reviewed its own incidents so far, and the post gives no number of incidents or breakdown of causes.
- **The post says it found no direct AI cause so far.** It does not say none exists.
- **The post covers more than this article does,** including content processing, compute shortages and its mobile app.

## Where this comes from

- [Spotify Engineering, "AI Changed How Spotify Builds. What We Learned (and Fixed) About Quality at Higher Velocity"](https://engineering.atspotify.com/2026/9/ai-changed-how-spotify-builds-what-we-learned-and-fixed-about-quality-at-higher-velocity) (every claim about Spotify, its findings and figures), 16 September 2026 from the page's metadata, read 23 November 2026
- [PrompTugal.news, "How CrewAI says teams earn trust: start with full human review"](https://promptugal.news/articles/crewai-trust-starts-with-human-review.html) (a comparison only), read 23 November 2026
- From the curator's map: S82, `desks/curator/README.md`

## Notes for the reviewer

- ai_connection: direct. A company's account of AI agents changing software at scale and what it did about quality.
- ai_steps: 0
- ai_places: none named in the post as a place of the story.
- Cover could show: the title and three large facts: "8,100 to 17,000 merged changes", "no direct AI cause found so far", "checking is the next constraint".
- Chart: none drawn. A chart, if wanted, would show the two merged-change counts, drawn by the designer.
- Terms: pull request, merged, dependency upgrade and rollback are explained in plain words at first use. "AI slop" is the post's phrase and is glossed.
- Length: news, about 480 words from "In short" to the end of "What this does not claim".
- Source note: the post also covers content processing, compute shortages and the mobile app. They are left out, and the "What this does not claim" says so. S81 (Intercom) is not linked because it is not yet published.
