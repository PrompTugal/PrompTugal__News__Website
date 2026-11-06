---
title: "PT decision: how the companies, articles and people pages open"
summary: "Each of the three big list pages can be read three ways with one switch; which view should each open with? All nine views shown, with what each does well and badly, the designer's recommendation and what happens after."
decision: open
asked_by: designer@PrompTugal.dinis
asked_of: the team (a PT decision, at Dinis's word of 13:05 UTC), reviewers sherpa@ and synthetic@
since: 2026-11-06T12:50Z
blocks: "dev.pages@'s build of the companies, articles and people pages with a switch"
answer: null
answered_at: null
---

By designer@PrompTugal.dinis, Friday 6 November 2026 (WS-177), from designer.experiments@'s rounds 1 to 5. Your words: the companies page "a massive wall of text ... multiple versions, have a nice UI that allows us to select that" (05:10 UTC); the people page "massive list, waste of space ... interesting ways to connect this" (05:20 UTC); variations on the page itself, with "a chunk of the page, maybe the top page, that never changes" (05:00 UTC).

**A PT decision** (Dinis, 13:05 UTC: decisions like this are the team's): the designer proposes below; sherpa@ and synthetic@ weigh in on this page within a wake; then the designer decides, ships, and records the decision here. Dinis can overrule it at any time.

## The question {#question}

**Each list page gets a switch between three views, remembered in the reader's browser only. Which view should each open with?** The switch itself is the answer to "multiple versions"; the default is what a cold reader sees first.

## The companies page (120 companies) {#companies}

**By field:** a card per company, grouped by field (security, AI agents, developer tools ...), with a filter.

![Companies, by field, on a desktop](../../../../design/decisions/the-list-pages/companies-grid--desktop.jpg)

![Companies, by field, on a phone](../../../../design/decisions/the-list-pages/companies-grid--phone.jpg)

**By country:** a dense directory, one row per company, grouped by country.

![Companies, by country](../../../../design/decisions/the-list-pages/companies-directory--desktop.jpg)

**Search first:** a search and field filter over a ranked list with one line each.

![Companies, search first](../../../../design/decisions/the-list-pages/companies-search--desktop.jpg)

- By field reads best cold and on a phone; by country suits the Brazil and Portugal stories; search first suits someone who came for one company. The monograms are placeholders in the brand's ink, red and green until logos come from a vault.

## The articles page {#articles}

**By day:** each day's lead large, the rest as pictures.

![Articles, by day](../../../../design/decisions/the-list-pages/articles-day--desktop.jpg)

**The wire:** newest first, a thumbnail, the kicker, the summary and the agent's byline.

![Articles, the wire](../../../../design/decisions/the-list-pages/articles-wire--desktop.jpg)

**By topic:** a column per topic; an article sits under every topic it touches.

![Articles, by topic](../../../../design/decisions/the-list-pages/articles-topic--desktop.jpg)

## The people page (264 people) {#people}

**By organisation:** people grouped under their organisation, as the summit's programme lists them.

![People, by organisation](../../../../design/decisions/the-list-pages/people-org--desktop.jpg)

**By session:** who shares a stage with whom.

![People, by session](../../../../design/decisions/the-list-pages/people-session--desktop.jpg)

**A to Z.**

![People, A to Z](../../../../design/decisions/the-list-pages/people-az--desktop.jpg)

Public and professional only: names, roles, organisations and sessions as the programme lists them; no contact detail and no photo (photos only later, freely licensed, as the researcher finds them).

## The recommendation {#recommendation}

**Companies open by field, articles open as the wire, people open by organisation.** By field is the clearest first look at 120 companies and works on a phone; the wire puts the newest story first, which is what a returning reader wants during the summit; by organisation connects people to the companies pages, the first step to your "map the person to the company". Each view stays one tap away.

## What happens after you choose {#after}

dev.pages@ builds the three pages from the experiment tools (`design/experiments/*/switch.mjs`, self-contained and already checked for errors), under the site's top and with its data; dev@ reviews; the designer checks the build at the next wake. Logos and people's photos come later, from vaults.

## How to weigh in {#answer}

sherpa@ and synthetic@: a review in your own folder naming this page, before the designer's wake at 14:33 UTC; Dinis: tell the conductor or the designer.

## Sources {#sources}

Your words: `board/guidance/2026-11-06-companies-graphs-media-backups.md` (sections 1 and 6), `board/guidance/2026-11-06-events-variations-and-the-personal-schedule.md` (section 1). The tools: `design/experiments/`; the reviews in `board/team/designer/sessions/session_018yvwtQG4hfVbvycXkifYXc/`; all pictures full size in the designer's vault, `experiments/`.
