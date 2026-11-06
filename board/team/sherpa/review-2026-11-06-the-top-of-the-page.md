---
title: "The top of every page, as a cold reader meets it: sherpa@'s review for the pass the-top-of-the-page"
by: sherpa@PrompTugal.dinis
written: 2026-11-06T04:00Z
pass: board/passes/2026-11-06-the-top-of-the-page.md
against: board/guidance/2026-11-06-design-and-passes.md, section 1 (Dinis's words)
measured_on: https://promptugal.news, v0.1.93, Playwright and Chromium; phone = iPhone 13 profile (390 x 664, portrait); desktop = 1440 x 900
issue: WS-177
---
# The top of every page

**What was measured.** Nine pages, each on a phone in portrait and on a desktop: the front page, an article (`/articles/brazil-startup-mission.html`), a company (`/companies/feedzai/`), Events, the Agenda, About, the newsroom, the synthetic readers page and Sign in. For each: the masthead's height, every link and button in the first screen with its position and whether a tap reaches it, the text of the masthead, the page's width. The numbers are in `design/shots/sherpa/top/report.json`; eight of the eighteen screenshots are kept in `design/shots/sherpa/top/` (design/shots/ is already 48% of the repository, synthetic@ measured, so the rest stay out). This is one reviewer's reading, not user research: no real reader was asked.

**The masthead is the same on all nine pages**, so every finding below holds for every page unless it says otherwise.

## What a cold reader sees first

**On a phone** (`phone-home-top.jpg`): the date and countdown, the wordmark centred, two lines of spaced capitals ("Technology and AI, in context. The Web Summit Lisbon 2026 edition"), "Powered by [RM] RiskMandate", a double rule, then one row: **NOW, AGENDA, a faded "N"**, and four round buttons (a half-moon, a magnifier, "£5.00", "Vault"). The first story's headline starts 69% of the way down the first screen.

**On a desktop** (`desktop-home-top.jpg`): a dateline with "Newsroom · Sign in" at the right, the wordmark centred and large, flanked on the front page by two boxed notes ("Every fact sourced", "Independent"), the same tagline on one line, "Powered by RiskMandate", then eight sections left and five pills right (Paper, Search, "£5.00 credit", Vault, Ask). One third of the screen is the top before anything to read.

## Where they get lost, ranked

| # | Finding | Measured | Against Dinis's words | Owner |
|---|---|---|---|---|
| T1 | **On a phone, six of the eight sections cannot be seen.** The sections sit in a strip 138 px wide beside the four round buttons; it scrolls sideways (617 px of links in 138 px) with no cue but a faded "N". News, Companies, People, Portugal, The graph and About are behind a swipe nobody knows to make; a tap where Companies would be lands on the button row. A reader who came for a company page cannot find the companies from the top. | every page, phone | "a massive mess"; he could not find the Newsroom on his phone: it is worse than that one link | designer@ (the layout), dev@ |
| T2 | **On a phone there is no way to the Newsroom from the top.** "Newsroom · Sign in" is in the desktop dateline and hidden below desktop width; the only links to /newsroom/ are in the footer (about 8,000 px down the front page). | every page, phone | "on his phone in portrait he cannot find the Newsroom link" | dev@ |
| T3 | **The top is mostly space.** Phone: 230 of 664 px (35%) before the page begins; on the front page the first headline starts at 460 px. Desktop: the front page's top is 294 of 900 px (33%), other pages 226 px (25%). The logo is centred, with nothing at its right on a phone and two boxes on the desktop front page. | every page | "a massive wasted space"; "the logo on the left and a bunch of stuff on the right" | designer@ |
| T4 | **"Powered by RiskMandate" is in the masthead of all nine pages**, the third thing a reader meets, with no word on what RiskMandate is or does here. A cold reader reads it as the owner or sponsor of the news. synthetic@'s readers said the same (findings F26 and the run-1 founder). | 18 of 18 captures | "take away this Powered by RiskMandate ... it's just confusing" | dev@ (the template); designer@ |
| T5 | **The tagline is not the card's.** Every page says "Technology and AI, in context. The Web Summit Lisbon 2026 edition"; "People and AI agents, reporting together." is on none. It is also the one line that tells a cold reader what is unusual here (agents write it). The edition can live in the dateline, which already says "4 days to the summit". | 0 of 9 pages | "I like the tagline that we were talking about on the business cards" | designer@ |
| T6 | **The credit is not top right, and on a phone it reads as a price.** Desktop: "£5.00 credit" is the third of five pills, with Vault and Ask at its right. Phone: a bare "£5.00" in a pill, no word "credit": a cold reader takes it for a paywall. It falls a penny a page (£5.00 to £4.98 over this review) and links to /account/, whose title says it is kept in this browser only; the reader never learns that from the top. Pounds on a Lisbon, European site: Dinis's call (asked in status.json). | every page | "the credit ... probably should be on the top right always" | designer@ (place, label), dev@ |
| T7 | **The Vault button is on every page**, phone and desktop, a full pill on the phone's only row. | every page | "I don't think we need the vault for now" | dev@ |
| T8 | **The theme picker takes a slot on the most valuable row**: "Paper ▾" on the desktop, an unlabelled half-moon on the phone. It is the control a cold reader needs least; it can live in the footer or the menu. | every page | "you mix a whole bunch of stuff" | designer@ |
| T9 | **On a phone, two pages pan sideways, the top with them.** The article lays out 591 px wide on a 390 px phone (an SVG in the body reaches 525 px) and the synthetic readers page 438 px (a table reaches 594 px): the reader can drag the whole page, masthead included, off the screen. | article, synthetic, phone | (not in his words; found here) | dev@ (the article's SVG); synthetic@ and dev@ (the table) |
| T10 | **The two boxes beside the desktop logo** (front page only) say two true and useful things, "Every fact sourced" and "Independent ... our disclosure", but as boxes they compete with the logo and vanish on the phone. The independence line is the one a CISO or journalist looks for: keep it, as one line under the top, on every size. | desktop front page | "a bunch of stuff on the right" (it is the stuff, in the wrong form) | designer@ |
| T11 | **On a phone the floating Ask button covers the end of the lede** (front page, company page: the bottom right corner of the first screen). | phone | | designer@ |
| T12 | **Search is an unlabelled magnifier on a phone.** It works, and it is the thing the newsroom search pass is building on; a word ("Search") would make it findable for the reader who came for one company. | phone | section 2 (the newsroom search) | designer@, with the search pass |
| T13 | The front page's h1 ("What is on at Web Summit Lisbon 2026") is visually hidden; a sighted reader's first statement is the mandate box. Fine for now; note it for the mock-ups, which should say in the first screen what this is. | front page | | designer@ |

## What works, to keep

- The bar sticks on scroll, on both sizes: the sections stay one tap away once the top is fixed.
- The date and "4 days to the summit": it says this is live, and why now.
- Breadcrumbs on every inner page, and on the newsroom's pages the band "The newsroom · how PrompTugal.news is made, in public": a cold reader always knows where they are.
- The version in the dateline: small, honest, and the joke lands for this audience.

## What the mock-ups need to answer, from the reader's side

Not a design (designer@'s), the questions each mock-up should pass, on a phone first:

1. Can a reader reach every section and the Newsroom in one tap from the first screen? (a menu, or at most four sections and "More")
2. Is the logo at the left, with search and the credit at the right, in one row of at most about 60 px on a phone?
3. Does the first screen say what this is in the card's words, once?
4. Is the credit labelled as a credit, not a price, and always top right?
5. Is there nothing about RiskMandate in the top, and the independence line one tap or one line away?
6. Does the page's content start in the top third of a phone's first screen?
