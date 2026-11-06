---
title: "Decision for Dinis: the top of every page (A, B, C or D)"
summary: "Which top should every page of PrompTugal.news have? Four mock-ups, each shown on a phone and a desktop, with what each does well and badly, what the reviewers found, the work it takes, the designer's recommendation and what happens after you choose."
decision: open
asked_by: designer@PrompTugal.dinis
asked_of: Dinis Cruz
since: 2026-11-06T05:40Z
blocks: "dev@'s quick fixes Q1 to Q9 (they hold for every option) and round 2 of the pass the-top-of-the-page; the strip of days (the summit days pass) sits in option D"
answer: null
answered_at: null
---

By designer@PrompTugal.dinis, Friday 6 November 2026 (WS-177). A decision page, at Dinis's word of about 11:00 UTC: "decisions like the one about the design ... should be done via a page in the site, with full details and explanations." The pass: the top of the page (in the repository, `board/passes/2026-11-06-the-top-of-the-page.md`).

## The question {#question}

**Which top should every page have: A, B, C or D?** It matters now because the top is on every one of the site's more than 1,000 pages, a phone today cannot reach six of the eight sections from it, and dev@'s quick fixes wait on the shape you pick. The summit starts on Monday.

## Today, at v0.1.231 {#today}

![The top today on a phone, v0.1.231](../../../../design/decisions/the-top-of-the-page/now--phone.jpg)

![The top today on a desktop, v0.1.231](../../../../design/decisions/the-top-of-the-page/now--desktop.jpg)

What you said of it (04:00 UTC): "a massive mess ... a massive wasted space"; the card's tagline is better (done since v0.1.123); take away "Powered by RiskMandate"; "the logo on the left and a bunch of stuff on the right"; the credit "on the top right always"; no Vault for now; on a phone in portrait you could not find the Newsroom link. sherpa@ measured it (T1 to T13): on a phone six of eight sections hide in a 138 px sideways strip, there is no Newsroom link, and the top takes 35% of the first screen.

## Option A: one bar {#a}

![Option A on a phone](../../../../design/decisions/the-top-of-the-page/A--phone.jpg)

![Option A on a desktop](../../../../design/decisions/the-top-of-the-page/A--desktop.jpg)

The logo at the left; Search, the credit (labelled "credit") and a Menu at the right, in one 56 px row on a phone; on a desktop one 68 px row with all eight sections in it. The tagline and the independence line as one line under the bar. The Menu holds every section, the Newsroom, Sign in and the theme.

- **Does well:** the plainest answer to every one of your points; the shortest top on a desktop; the Menu answers T1 and T2 (every section and the Newsroom one tap away); the least work, since it is the quick fixes plus a layout.
- **Does badly:** on a phone only four sections show in the second row (the rest under More); the front page loses the newspaper feel of a nameplate.
- **sherpa@'s six questions:** every section one tap away (Menu); logo left, search and credit right in one row; the card's words once; the credit labelled; nothing of RiskMandate in the top; the page starts in the top third of a phone (yes, about 120 px).
- **Work:** dev@, about one wake: the bar's layout in `newsroom/build/lib/shell.mjs` and `assets/site.css`, the Menu, and Q1 to Q9.

## Option B: the slim nameplate {#b}

![Option B on a phone](../../../../design/decisions/the-top-of-the-page/B--phone.jpg)

![Option B on a desktop](../../../../design/decisions/the-top-of-the-page/B--desktop.jpg)

The front page keeps a nameplate, but left-aligned: the logo at the left, the tagline and the two boxes' words at its right as two lines. The credit sits top right in the dateline, beside Newsroom and Sign in. On a phone every section is a chip in two short rows, with Search as a word. Inner pages use A's bar.

- **Does well:** keeps a publication's front page, which matters for a press pass; every section visible on a phone with no menu; the credit always top right.
- **Does badly:** the tallest of the four on a phone (168 px); two different tops to build and keep (front page and inner pages).
- **sherpa@'s six questions:** all yes but the last: the first story starts lower on a phone.
- **Work:** dev@, about two wakes (two tops).

## Option C: the app, tabs at the bottom {#c}

![Option C on a phone](../../../../design/decisions/the-top-of-the-page/C--phone.jpg)

![Option C on a desktop](../../../../design/decisions/the-top-of-the-page/C--desktop.jpg)

On a phone, the PT.news stamp and the name with the date at the left and the credit at the right, in one 52 px row; Now, Agenda, News, Search, Ask and More in a tab bar at the bottom, where the thumb is. On a desktop, search as a real field in the top bar (the door of the newsroom search), the date, Newsroom, the credit and Ask at the right.

- **Does well:** the most space for the page on a phone; Search and Ask where a thumb reaches; no floating Ask covering text (T11, F8); the big search Dinis asked for at 05:35 ("a big search bar ... at the top") built into the bar.
- **Does badly:** least like a newspaper; a bottom bar must keep out of the way of each page's own end; the most work and the most risk before Monday.
- **sherpa@'s six questions:** all yes; the page starts highest of the four.
- **Work:** dev@, two to three wakes; sherpa@ suggested a synthetic readers' run on it before anyone builds it.

## Option D: the summit edition, A with the days {#d}

![Option D on a phone](../../../../design/decisions/the-top-of-the-page/D--phone.jpg)

![Option D on a desktop](../../../../design/decisions/the-top-of-the-page/D--desktop.jpg)

Option A's bar, and under it the summit's days, Friday 6 to Friday 13 November: today in ink, Opening Night and the three conference days tinted. A day before today opens the site as it was that day; a day after shows what is planned. The strip is the countdown and the edition in one, and leaves the top after the summit.

- **Does well:** your idea of the site over time ("a block on the right that has Web Summit, and then it has the days") in the top of every page; the past view is proven (Thursday 5 November rebuilt from its own release, v0.1.37: `/newsroom/design/summit-days-round-1/`).
- **Does badly:** a second row on every page for a week; the past and future day pages must exist before the strip links to them.
- **sherpa@'s six questions:** all yes; the page starts a little lower than A.
- **Work:** A's work, plus the strip (S1 in `board/spec-the-summit-days.md`, about one wake) and the day pages (S2 to S5, more).

## What the readers found {#readers}

The synthetic readers (invented, SYNTHETIC) have not yet read these four tops; they read the front page's mock-ups, which use A's bar, and did not object to the bar. On today's top, run 4's founder said "Powered by RiskMandate" on a company page kept the page from her leader (F26), which every option removes.

## The recommendation {#recommendation}

**A on every page, with D's strip of days on the front page and the summit pages until 13 November.** A answers every point you made with the least work before Monday; the strip carries your idea of the site over time where it matters most and leaves when the summit ends. C is worth a synthetic run after the summit; B keeps a nameplate, but two tops are more to build and keep than this week allows. No agent has dissented.

## What happens after you choose {#after}

- **Whichever you choose:** dev@ builds Q1 to Q9 (no Powered by in the masthead, no Vault button, the credit last and labelled, the theme picker to the footer, the Menu on a phone, the boxes as one line, no floating Ask, Search labelled) in its next wake; the designer checks the build against the mock-up at the next wake and writes the before and after.
- **A or D:** dev@ builds the bar (one wake). **D:** dev@ adds the strip and the day pages (the summit days pass). **B:** dev@ builds two tops (two wakes). **C:** a synthetic readers' run first, then dev@ (two to three wakes).
- This page records your answer (front matter `answer`, `answered_at`) and moves to Decided; the conductor writes it into `board/guidance/`.

## How to answer {#answer}

For now, tell the conductor in your session (or the designer in its own): "the top: A" (or B, C, D, or a change). Later, signed in, a choice on this page itself.

## Sources {#sources}

- Your words: `board/guidance/2026-11-06-design-and-passes.md` (section 1), `board/guidance/2026-11-06-decisions-as-pages.md`.
- The pass and sherpa@'s review: `board/passes/2026-11-06-the-top-of-the-page.md`, `board/team/sherpa/review-2026-11-06-the-top-of-the-page.md`.
- The spec: `board/spec-the-top-of-the-page.md`; the check of the live site at v0.1.210: `board/team/designer/sessions/session_018yvwtQG4hfVbvycXkifYXc/spec-check-v0.1.210.md`.
- The before and after of round 1: [v0.1.123: the top of the page, round 1](../../v0-1-123-the-top-of-the-page/index.html). The mock-ups are made with `design/mockups/top/make.mjs`; full-size copies in the designer's vault, `top-of-the-page/round-1/mockups/`.
