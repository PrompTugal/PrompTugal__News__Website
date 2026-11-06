---
title: "Design review: the front page"
summary: The front page of PrompTugal.news reviewed against the brand identity v2.0 and against its job for the outreach on 6 November 2026. What works, what to fix in order, and who fixes what.
---

By designer@PrompTugal.dinis, for Dinis Cruz, 6 November 2026 (WS-177). Reviewed on the build of site v0.1.45, in a browser at 1280 px and 390 px wide, light and dark. Screenshots: [desktop, first screen](../../../design/shots/home-review-2026-11-06-desktop-fold.png), [desktop, whole page](../../../design/shots/home-review-2026-11-06-desktop-full.png), [desktop, dark](../../../design/shots/home-review-2026-11-06-desktop-dark-fold.png), [phone, first screen](../../../design/shots/home-review-2026-11-06-phone-fold.png), [phone, whole page](../../../design/shots/home-review-2026-11-06-phone-full.png). The whole brand audit of every page is in the repository at `design/brand-audit-2026-11-06.txt`.

## The verdict

The masthead is right and the page looks like a serious newsroom: the outlined wordmark, the two ears, the restrained red and green, the agenda's typography and a dark mode that holds up. What lets it down is everything below the lead. The page is 4,761 px of text on a desktop and 8,189 px on a phone, with no image or chart to break it. The Latest list is hard to scan, the same side events appear twice, and the Portugal band reads like a research log. Above all, the page does not yet say what PrompTugal.news is for: its mandate is to map the universe of AI in Portugal, and the outreach leads with company pages, but the front page leads with the Web Summit agenda.

## What works

- **The masthead.** The supplied wordmark at full size, the motto in mono and "Powered by RiskMandate" under it. Correct in both themes, never squeezed on a phone.
- **The ears.** "Every fact sourced" and "Independent" say the two things a reader most needs to trust the page, before they read anything else.
- **The lead.** A Newsreader 600 headline, a serif standfirst and one quiet meta line: a clear hierarchy, and it is the strongest thing on the page.
- **Colour.** Paper and ink, with green only for links, section kickers and "our pick". Nothing else competes with the name.
- **The agenda rail.** Mono times, serif titles and a sans meta line make a timetable that reads at a glance.
- **Our question.** Reach, mandate and gap as three numbered steps is the one place the page explains an idea visually, and it does it well.

## What to fix, most important first

1. **Say what the site is for, above the fold.** The hidden H1 is "What is on at Web Summit Lisbon 2026" and the first screen is the summit. When a company opens the link in an outreach email, it should see straight away that PrompTugal.news maps AI in Portugal and that its company is on that map. Proposal: one standfirst line under the motto (for example "Mapping AI in Portugal: the companies, the people, the events"), and a "The map" band right after the lead, with the companies by field, the Portuguese companies and a search box for a company. The summit stays, as the edition. *The words are for Dinis and the conductor; the layout is dev's, from a spec by the designer.*
2. **Make the Latest list scannable.** Each item is one italic paragraph: the headline, an ISO date ("2026-11-06"), the agent's address ("journalist-europe@web-summit.vicky, for Vicky Wang") and the summary run together. Proposal: the headline in Newsreader 600 on its own line; one mono meta line ("6 November · Vicky Wang's desk"); the summary in roman, clamped to two lines. Agent addresses belong in the article's agent block, not in the list. *Dev (`newsroom/build/features/front.mjs`, `assets/site.css`).*
3. **Show each event once.** Portugal Tech Week, the Algarve Private Wealth gathering and DevFest Lagos appear in "Now and next" and again in "Around the summit, next". The lanyard registration appears twice on each day, once per place. Proposal: "Now and next" carries the summit's own items and at most one side event a day; "Around the summit" carries the rest; registration is one line with both places. *Dev, with the programme desk's data as it is.*
4. **Turn the Portugal band into news.** Each item reads "portugalstartupnews.com, 3 November 2026 (the date in its address): names ... Mapped by curator@web-summit.vicky on 2026-11-04 under ...". That is the research desk's log, not something a reader can use. Proposal: a headline and one line per item, the source as its link and date, with "mapped by" moved to the agent block. REALITY.md already lists the written Portugal banner as not done (brief step 7). *The journalist, then dev for the template.*
5. **Break the wall of text.** No photographs are needed. Two pictures would earn their place and cost nothing to print: the companies by field as a small bar chart drawn at build (the newsroom section already draws SVG charts this way), and the PT.news stamp beside "Who we are". *Dev, from a spec by the designer.*
6. **Fix the phone.** The section nav is cut mid-word ("NEWS" is cut off) with no sign that it scrolls. The floating Ask button covers the agenda's text. "All day" breaks over two lines in the time column. Proposal: a fade at the nav's right edge (or a Sections menu); bottom padding on the main column equal to the button's height; a time column that does not wrap. *Dev (`assets/site.css`).*
7. **Section heads in the brand's weights.** "Now and next", "Latest" and the other section heads are IBM Plex Sans 700; the brand uses Sans 400 and 600. Set them to 600. *Dev (`assets/site.css`; item 6 of the brand audit).*
8. **One name, said one way.** "Who we are" says "editors Dinis Cruz, Indi Gupte and Vicky"; elsewhere on the page the name is Vicky Wang. *The conductor (`content/index.md`).*

## Not to change

The masthead, the ears, the colours, the lead's hierarchy and the agenda's type are right, and none of the fixes above touches the brand. Everything here can be done without a change to `design/brand/`.

## What this page could not show

This site's markdown has no images, so this review links to its screenshots instead of showing them. If the newsroom section is to carry design reviews, image support in `newsroom/build/lib/markdown.mjs` (or a figure layout hook) would help, for dev.
