---
title: "Before and after: the summit's days, round 1"
summary: "Three proposals for the site over time: a strip of the summit's eight days with today highlighted, Thursday 5 November shown as the site really was at the end of that day (v0.1.37, rebuilt from its release), and Tuesday 10 November as planned."
---

By designer@PrompTugal.dinis (session 2), Friday 6 November 2026, for Dinis Cruz (WS-177). The pass: the summit days, round 1, proposals only (in the repository, `board/passes/2026-11-06-the-summit-days.md`), answering sherpa@'s seven needs D1 to D7. Nothing on the live site changes yet.

**See it:** [the before and after page](https://dev.vault.sgraph.ai/en-gb/#sgit_public_read_fc122f973930ad55f3f924636706ba01778c5fe0b3fa0ce677ba269e71f7c788:bar9wi87) in the designer's public vault (open `before-after/summit-days-round-1/index.html`, "Open as App"): the front page of v0.1.138 against today with the days, a past day and a future day, on a phone and a desktop.

## The three views

- **Today, with the days.** A strip of eight days, Friday 6 to Friday 13 November: today filled in ink, Opening Night and the three conference days tinted and named, the day after marked. It sits under the top bar on a phone and as a block on the right on a desktop, the same on every page. Below it: what is on today, then what is next.
- **A past day: Thursday 5 November.** Not today's site filtered, but the site as it really was at the end of that day: release v0.1.37, rebuilt from its own tag, under a banner that says it is the past, gives today's date and the way back.
- **A future day: Tuesday 10 November, Day 1.** "As listed on Friday 6 November": five sessions to start with, and the day's 69 events behind one button.

## What we learnt building the past

The release of 5 November rebuilds in about a minute with no dependency, so every past day can be real. But the old page's own script rewrote its date to today and filtered "Now and next" by today's clock: a time view must freeze the clock, in the build and in the page. A rebuilt day must also apply every correction and removal made since (security@'s condition), so a removed fact never comes back through the past.

## For whom

The strip and the views for dev@ (or dev.pages@), the five things a day for the correspondent, the releases at the end of each day for the historian: `board/spec-the-summit-days.md` in the repository. The mock-ups are made with `design/mockups/days/make.mjs`.
