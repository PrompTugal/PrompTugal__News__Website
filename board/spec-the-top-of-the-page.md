---
title: "The top of every page, round 1: the quick fixes for dev@, and four mock-ups for Dinis to choose from"
by: designer@PrompTugal.dinis (session 2)
written: 2026-11-06T05:20Z
pass: board/passes/2026-11-06-the-top-of-the-page.md (round 1, designer)
for: dev@PrompTugal.dinis (the template, newsroom/build/lib/shell.mjs and assets/site.css), Dinis (the choice)
answers: sherpa@'s T1 to T13 (board/team/sherpa/review-2026-11-06-the-top-of-the-page.md); security@'s conditions (public pages only, the credit shows the price only)
issue: WS-177
---
# The top of every page, round 1

## 1. Done in this commit (the designer's own)

- **T5, the tagline.** `data/site/site.json` `motto` is now the card's "People and AI agents, reporting together" (no full stop: the footer adds one). The edition already lives in the dateline. It shows in the masthead and the footer on every page from this release.

## 2. Quick fixes for dev@ (whatever mock-up Dinis picks, these hold)

| # | Change | Where |
|---|---|---|
| Q1 (T4) | Drop the endorse line ("Powered by RiskMandate") from the masthead. Keep it in the footer with the disclosure, where it already is. | `shell.mjs`, the `endorse` paragraph in `<header class="mast">` |
| Q2 (T7) | No Vault button in `#nr-tools` for now, phone and desktop ("I don't think we need the vault for now"). | the feature that fills `#nr-tools` |
| Q3 (T6) | The credit is the last pill, top right, and always says "credit": "£5.00 credit" on a phone too. Price only, never an account or key (security@). | `#nr-tools`, `assets/site.css` |
| Q4 (T8) | The theme picker leaves the top row: into the footer (and the phone menu, Q5). | `#nr-tools`, footer |
| Q5 (T1, T2) | On a phone (below 768 px): a **Menu** button at the right of the bar that opens every section, Newsroom, Sign in and the theme; the sideways strip shows at most four sections and "More". Public pages only behind it. | `shell.mjs`, `assets/site.css` |
| Q6 (T3) | Below 768 px: the wordmark at the left, 20 to 26 px high, in the same row as the tools; no motto block between them (the tagline is one line under the bar). The whole top at most about 100 px. | `assets/site.css` |
| Q7 (T10) | Front page, desktop: the two boxes (ears) become one line under the bar: "Every fact sourced and dated. Independent: not affiliated with Web Summit. Our disclosure". Same line on a phone. | `shell.mjs` (`ears`), css |
| Q8 (T11, F8) | No floating Ask on a phone: Ask goes in the Menu (A, D) or the bottom tab bar (C). On a desktop it stays in the bar. | the Ask feature, css |
| Q9 (T12) | Search keeps its word on a desktop ("Search /"); on a phone the magnifier has `aria-label="Search"` and a visible label in options B and C. | `#nr-tools` |

## 3. The mock-ups (Dinis chooses; the images in the designer's public vault, see `board/team/designer/vaults.json`, and on the private proof page)

Each in paper and ink, phone (390 x 664) and desktop (1440 x 900), the front page's lead below the top with its article image, so you can see where the page begins. Made with `node design/mockups/top/make.mjs`; notes per option in its `index.json`.

- **A. One bar.** Logo left; Search, the credit and Menu right; one 56 px row on a phone and one 68 px row on a desktop with all eight sections in it. The tagline and the independence line as one line under it. The plainest fix; the closest to the quick fixes.
- **B. The slim nameplate.** The front page keeps a nameplate, but left-aligned: logo left, tagline and the boxes' words right; the credit in the dateline top right; on a phone every section as a chip in two rows with Search as a word. Inner pages use A's bar.
- **C. The app.** Phone: the PT.news stamp and the name, the credit; a tab bar at the bottom (Now, Agenda, News, Search, Ask, More) where the thumb is. Desktop: a real search field in the top bar (the door of the newsroom search pass).
- **D. The summit edition.** A's bar, with the summit's days (Fri 6 to Fri 13 November) as a strip under it: today in ink, the summit days tinted; a past day opens the front page as it was, a future one what is on (the summit days pass). It is the countdown and the edition in one, and leaves the top after the summit.

Against sherpa@'s six questions: every option puts every section and the Newsroom one tap from the first screen (Menu, chips or More), the logo left and the credit right, the card's words once, the credit labelled, nothing of RiskMandate in the top, and the first story in the top third of a phone's screen (C and A best, then D, then B).

**My recommendation:** A as the bar on every page, with D's day strip on the front page and the summit pages until 13 November. C's bottom bar is worth a synthetic readers' run before anyone builds it.
