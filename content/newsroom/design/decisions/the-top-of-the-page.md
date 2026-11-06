---
title: "Decided by Dinis: the top of every page is C, with the summit's days on the front page"
summary: "Which top should every page of PrompTugal.news have? Four mock-ups, each shown on a phone and a desktop, with what each does well and badly, what the reviewers found, the work it takes, the designer's recommendation and what happens after you choose."
decision: decided
asked_by: designer@PrompTugal.dinis
asked_of: the team (a PT decision, at Dinis's word of 13:05 UTC; first asked of Dinis at 05:40)
since: 2026-11-06T05:40Z
blocks: "dev@'s quick fixes Q1 to Q9 (they hold for every option) and round 2 of the pass the-top-of-the-page; the strip of days (the summit days pass) sits in option D"
answer: "C on every page (the app: one row at the top, a tab bar at the bottom of a phone, search as a field on a desktop), with D's strip of the summit's days on the front page and the summit pages; the quick fixes Q1 to Q9 with it"
decided_by: Dinis Cruz, about 13:20 UTC (board/guidance/2026-11-06-the-four-design-decisions.md); it supersedes the designer's PT decision of 13:45 (A with the days), which was made before his answer reached the designer
answered_at: 2026-11-06T13:20Z
---

By designer@PrompTugal.dinis, Friday 6 November 2026 (WS-177). **Answered by Dinis at about 13:20 UTC: C on every page, with the strip of days on the front page** ([the answer](#decided)). His answer reached the designer after it had decided A as a PT decision at 13:45; his answer stands. A decision page, at Dinis's word of about 11:00 UTC: "decisions like the one about the design ... should be done via a page in the site, with full details and explanations." The pass: the top of the page (in the repository, `board/passes/2026-11-06-the-top-of-the-page.md`).

## Answered by Dinis: C on every page, with the days on the front page {#decided}

![The answered top on a phone: C with the strip of days](../../../../design/decisions/the-top-of-the-page/answered--phone.jpg)

![The answered top on a desktop: C with the strip of days](../../../../design/decisions/the-top-of-the-page/answered--desktop.jpg)

Dinis, about 13:20 UTC, reading this page: "we should have C on every page and D on the homepage, or all the pages that have that. So you basically on the homepage you add that layer of the history, right? Which I think is super powerful. What do you think of it?" (in the repository, `board/guidance/2026-11-06-the-four-design-decisions.md`).

**What the designer thinks:** yes. C gives the page the most room on a phone and puts search where the thumb is, and the strip on the front page carries the site's history where it is most useful. sherpa@ raised two risks with C at 12:50, and both can be fixed within C, as the pictures above show:

- **Companies was under More.** The founder who got our e-mail looks for Companies, so it gets a tab: Now, Agenda, News, Companies, Search, More. Ask moves to the top row, beside the credit.
- **A bar at the bottom meets Safari's own bar on an iPhone.** The tab bar sits above the phone's safe area (`env(safe-area-inset-bottom)`; the page already sets `viewport-fit=cover`), so the two never overlap.

The strip shows all eight days at 390 px, and with it the top row needs no countdown. If the team is unsure about the tab bar once it is live, it is the first A/B test: C's tab bar against A's Menu, measured by observability@ and read by synthetic@ (Dinis: "maybe start to have this sort of A/B testing when needed").

**What happens now:** dev@ (or dev.pages@) builds Q1 to Q9 and C's top (`board/spec-the-top-of-the-page.md`), then the strip (S1 in `board/spec-the-summit-days.md`); the designer checks the build against these pictures and writes the before and after.

### Superseded: the designer's PT decision of 13:45 (A, with the days under it)

Before Dinis's answer reached the designer, it had decided A, from sherpa@'s verdict:

![The decided top on a phone](../../../../design/decisions/the-top-of-the-page/decided--phone.jpg)

![The decided top on a desktop](../../../../design/decisions/the-top-of-the-page/decided--desktop.jpg)

**A on every page; on the front page and the summit pages until 13 November, the strip of the summit's days under A's two rows, not instead of them.** Decided by designer@ at 13:45 UTC, from sherpa@'s verdict of 12:50 (in the repository, `board/team/sherpa/review-2026-11-06-1230-the-top-a-to-d.md`), which agreed with the recommendation below and refined it three ways, all taken:

- the strip goes under A's search and sections, never in their place (D's phone mock-up had lost both);
- one door: the Menu, with no "More" beside it, so the sections row shows sections only;
- all eight days fit a 390 px phone (D's mock-up cut Friday 13 off).

Why A: it answers every point Dinis made with the least work before Monday, and it is the only option where both things this site is for, the news and the companies, are in view on a phone. B is the tallest on a phone; C hides Companies under More and puts a second bar beside Safari's own at the bottom of an iPhone. synthetic@'s run 8 (F45) also changes one line: "Every fact sourced and dated" read to a reporter as "every fact checked", so the line under the top says what is true: **"Every fact links to its source, with the date we read it."**

**What happens now:** dev@ (or dev.pages@) builds the quick fixes Q1 to Q9 and A's bar (`board/spec-the-top-of-the-page.md`), then the strip (S1 in `board/spec-the-summit-days.md`); the designer checks the build against these pictures at the next wake and writes the before and after.

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
- **sherpa@'s answers to its six questions (12:50):** yes to all six: four sections in view and the rest in the Menu; logo, search, credit and Menu in about 56 px; the page starts at about 125 px of 664.
- **Work:** dev@, about one wake: the bar's layout in `newsroom/build/lib/shell.mjs` and `assets/site.css`, the Menu, and Q1 to Q9.

## Option B: the slim nameplate {#b}

![Option B on a phone](../../../../design/decisions/the-top-of-the-page/B--phone.jpg)

![Option B on a desktop](../../../../design/decisions/the-top-of-the-page/B--desktop.jpg)

The front page keeps a nameplate, but left-aligned: the logo at the left, the tagline and the two boxes' words at its right as two lines. The credit sits top right in the dateline, beside Newsroom and Sign in. On a phone every section is a chip in two short rows, with Search as a word. Inner pages use A's bar.

- **Does well:** keeps a publication's front page, which matters for a press pass; every section visible on a phone with no menu; the credit always top right.
- **Does badly:** the tallest of the four on a phone (168 px); two different tops to build and keep (front page and inner pages).
- **sherpa@'s answers (12:50):** best for every section one tap away (seven chips in view), but no search in the top row and the first story lowest of the four (about 165 px).
- **Work:** dev@, about two wakes (two tops).

## Option C: the app, tabs at the bottom {#c}

![Option C on a phone](../../../../design/decisions/the-top-of-the-page/C--phone.jpg)

![Option C on a desktop](../../../../design/decisions/the-top-of-the-page/C--desktop.jpg)

On a phone, the PT.news stamp and the name with the date at the left and the credit at the right, in one 52 px row; Now, Agenda, News, Search, Ask and More in a tab bar at the bottom, where the thumb is. On a desktop, search as a real field in the top bar (the door of the newsroom search), the date, Newsroom, the credit and Ask at the right.

- **Does well:** the most space for the page on a phone; Search and Ask where a thumb reaches; no floating Ask covering text (T11, F8); the big search Dinis asked for at 05:35 ("a big search bar ... at the top") built into the bar.
- **Does badly:** least like a newspaper; a bottom bar must keep out of the way of each page's own end; the most work and the most risk before Monday.
- **sherpa@'s answers (12:50):** only partly for every section (Companies, People and Portugal under More); the page starts highest of the four; a bottom bar sits where Safari's toolbar is on an iPhone. "Not before Monday."
- **Work:** dev@, two to three wakes; the designer (not sherpa@) suggested a synthetic readers' run on it first.

## Option D: the summit edition, A with the days {#d}

![Option D on a phone](../../../../design/decisions/the-top-of-the-page/D--phone.jpg)

![Option D on a desktop](../../../../design/decisions/the-top-of-the-page/D--desktop.jpg)

Option A's bar, and under it the summit's days, Friday 6 to Friday 13 November: today in ink, Opening Night and the three conference days tinted. A day before today opens the site as it was that day; a day after shows what is planned. The strip is the countdown and the edition in one, and leaves the top after the summit.

- **Does well:** your idea of the site over time ("a block on the right that has Web Summit, and then it has the days") in the top of every page; the past view is proven (Thursday 5 November rebuilt from its own release, v0.1.37: `/newsroom/design/summit-days-round-1/`).
- **Does badly:** a second row on every page for a week; the past and future day pages must exist before the strip links to them.
- **sherpa@'s answers (12:50):** on a phone the strip replaced the search and the row of sections, and Friday 13 was cut off at 390 px; the strip itself meets its needs D1 to D6.
- **Work:** A's work, plus the strip (S1 in `board/spec-the-summit-days.md`, about one wake) and the day pages (S2 to S5, more).

## What the readers found {#readers}

The synthetic readers (invented, SYNTHETIC) have not yet read these four tops; they read the front page's mock-ups, which use A's bar, and did not object to the bar. On today's top, run 4's founder said "Powered by RiskMandate" on a company page kept the page from her leader (F26), which every option removes.

## The recommendation, before the decision {#recommendation}

**A on every page, with D's strip of days on the front page and the summit pages until 13 November.** A answers every point you made with the least work before Monday; the strip carries your idea of the site over time where it matters most and leaves when the summit ends. C is worth a synthetic run after the summit (the designer's suggestion); B keeps a nameplate, but two tops are more to build and keep than this week allows. sherpa@ agreed at 12:50, with the three refinements above.

## What happens after you choose {#after}

- **Whichever you choose:** dev@ builds Q1 to Q9 (no Powered by in the masthead, no Vault button, the credit last and labelled, the theme picker to the footer, the Menu on a phone, the boxes as one line, no floating Ask, Search labelled) in its next wake; the designer checks the build against the mock-up at the next wake and writes the before and after.
- **A or D:** dev@ builds the bar (one wake). **D:** dev@ adds the strip and the day pages (the summit days pass). **B:** dev@ builds two tops (two wakes). **C:** a synthetic readers' run first, then dev@ (two to three wakes).
- This page records your answer (front matter `answer`, `answered_at`) and moves to Decided; the conductor writes it into `board/guidance/`.

## How to change it {#answer}

Decided as a PT decision. Dinis can overrule it at any time: tell the conductor or the designer.

## Sources {#sources}

- Your words: `board/guidance/2026-11-06-design-and-passes.md` (section 1), `board/guidance/2026-11-06-decisions-as-pages.md`.
- The pass and sherpa@'s review: `board/passes/2026-11-06-the-top-of-the-page.md`, `board/team/sherpa/review-2026-11-06-the-top-of-the-page.md`.
- The spec: `board/spec-the-top-of-the-page.md`; the check of the live site at v0.1.210: `board/team/designer/sessions/session_018yvwtQG4hfVbvycXkifYXc/spec-check-v0.1.210.md`.
- The before and after of round 1: [v0.1.123: the top of the page, round 1](../../v0-1-123-the-top-of-the-page/index.html). The mock-ups are made with `design/mockups/top/make.mjs`; full-size copies in the designer's vault, `top-of-the-page/round-1/mockups/`.
