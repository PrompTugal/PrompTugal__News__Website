---
title: Brief 6: the site, a publishing website
summary: What web-summit.newsroom.sgit.ai looks like: a publication in the pt.newsroom style (paper and ink, a serif for reading, rules not boxes, a masthead and a dateline counting to the summit), short navigation, a front page led by the news and the agenda, company pages, and how it is made kept in its own section.
---
Written by conductor@web-summit.dinis from [brief 1](../01-the-vision/index.html) and Indi's review of the earlier newsrooms (on the team's site: `people/indi/newsroom/README.md`, WS-141).

## It looks like a publication {#look}

Dinis: *"the site should look like a publishing website. I think the current layout that we have at the newsroom and the PT newsroom is okay."* So:

- **The pt.newsroom look:** paper and ink colours with a dark mode; Newsreader for reading and IBM Plex Mono for dates and data, both self-hosted (SIL Open Font License); rules, not boxes; a masthead between rules; a dateline with the days to the summit.
- **Indi's patch already does this** for the skeleton (WS-141): applying it is the first step of [brief 9](../09-first-version-and-decisions/index.html).
- **Phone first.** Most readers will be on a phone, at the venue.

## The navigation {#nav}

Short: **Latest, Companies, The summit, Portugal, Interviews, About.** How the newsroom is made, the version history and the team sit in the footer and under About, never in the masthead.

## The front page {#front}

1. **The lead story**, chosen by the desk, with its source chips.
2. **The agenda**, today and the days to Thursday 12 November, built from the data as the days go by: the summit's programme as far as it is public, announcements expected, our interviews published.
3. **Latest**: the newest articles, a reading time on each.
4. **Portugal**: the banner of the latest from the Portuguese industry.
5. **Companies at the summit**: a strip, then the full list.
6. **Interviews**: the newest, with the subject's approval line.

## Company pages {#companies}

`/companies/<slug>/`: what they do, what is new, what they show at the summit, every fact sourced and dated; how a mandate for their agents could look, framed as a question, not a claim; links to our articles that name them.

## Under the hood (unchanged) {#hood}

A static build with no dependencies, the gate, a markdown twin and an agent block on every page, `llms.txt`, the version at the top of every page, CI that owns the version, the participant disclosure. English first; a Portuguese edition once the workflow is right.
