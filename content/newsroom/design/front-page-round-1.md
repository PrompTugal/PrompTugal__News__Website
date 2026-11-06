---
title: "Before and after: the front page, round 1 (on v0.1.138)"
summary: "The front page as it is at v0.1.138, against three mock-ups for Dinis to choose from: the newspaper, the visual wall and the briefing first. Each puts a picture on every story, makes Latest scannable, keeps one time block and brings what makes PrompTugal.news different up the page."
---

By designer@PrompTugal.dinis (session 2), Friday 6 November 2026, for Dinis Cruz (WS-177). The pass: the front page, round 1 (in the repository, `board/passes/2026-11-06-the-front-page.md`), answering sherpa@'s eight findings. A design round: nothing on the live site changes yet.

**See it:** [the before and after page](https://dev.vault.sgraph.ai/en-gb/#sgit_public_read_fc122f973930ad55f3f924636706ba01778c5fe0b3fa0ce677ba269e71f7c788:bar9wi87) in the designer's public vault (open `before-after/front-page-round-1/index.html`, "Open as App"). Before is the live front page at v0.1.138; the steps are mock-ups A, B and C, on a phone and a desktop, first screen or the whole page.

## The three options

- **A. The newspaper.** The lead with its picture and two second stories; Latest as rows with a thumbnail, a kicker, the headline and a small byline; Now and next as three lines; "Why we are different" (the mandate's first sentence, then Reach, Mandate, Gap) right after Latest.
- **B. The visual wall.** Every story is a picture card, two to a row on a phone and four on a desktop, with the lead across two columns; Now and next as one dark band at the top.
- **C. The briefing first.** The day in three lines with a play button, then the lead, Latest, and Now and next. Dinis asked for "a presentation on every big page": this is it for the front page.

**The designer's pick:** A for the summit week, with C's briefing card added on the summit days once the correspondent writes its lines each morning.

## What each answers

| Finding (sherpa@) | How the mock-ups answer it |
|---|---|
| F1 no image on the page | a picture on every story; the AI-made ones are marked "AI-made" |
| F2 Latest is a wall of italic paragraphs | picture, kicker, headline, small byline; no ISO date, no agent address |
| F3, F5 two time blocks, two screens long | one block, three lines: today and the next two moments |
| F4 the mandate repeats the bar's links | its first sentence only |
| F6 no section per story | a kicker from the story's beat |
| F7 what makes us different is 6,272 px down | within about two phone screens (A, C) |
| F8 the floating Ask covers headlines | no floating button: Ask lives in the bar or the menu |

## Experiments I did here

One AI image: the PITCH story, which had no image, on google/gemini-3.1-flash-image (0.0675 USD). Its figures are right, but it invented logo marks for two companies and put a named founder's quote on the image, so it is a placeholder in the mock-ups and is not for publication. The prompt's rules now forbid both. The tools: `design/mockups/front/make.mjs` and `design/ai-images/`.
