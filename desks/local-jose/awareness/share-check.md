---
title: "Share check: do the pages share well?"
by: local@PrompTugal.jose
checked: 2026-11-16T19:58Z
how: each page fetched once from promptugal.news; its title, description, Open Graph and Twitter tags read from the HTML; its share image fetched and looked at
---
# Share check, 16 November 2026

Five pages (two towns, the contribute page, a company, an article). What a person sees when the link is pasted into a chat or a social post is the title, the summary and the share image.

| Page | Title | Summary | Share image | What it lacks |
|---|---|---|---|---|
| `/algarve/faro/` | "PrompTugal.news Faro · PrompTugal.news" | clear: "AI and technology in Faro, in the Algarve: 16 local AI stories, 22 organisations on the AI map, every fact sourced." | the site's general card, 1200 x 630 | the name twice in the title; a share image of its own (see 1) |
| `/algarve/loule/` | "PrompTugal.news Loulé · PrompTugal.news" | clear, same shape (8 stories, 12 organisations) | the general card | the same two |
| `/contribute/` | "Write for PrompTugal.news · PrompTugal.news" | "Met us at Web Summit, or read us and want to help? ..." | its own card (the seven rules), 1200 x 630 | a summary that leads with the town, not the summit (see 2) |
| `/companies/startup-portugal/` | "Startup Portugal · PrompTugal.news" | "Based in Portugal; at Web Summit Lisbon 2026 as a participant (the role is not stated in our sources). ..." | the general card | a summary that says what the organisation is; a card of its own |
| `/articles/vila-real-de-santo-antonio-shipyard-robots-and-drones.html` | clear | clear but about 260 characters; most previews cut at about 200 | the general card | a shorter summary; a card with the headline |

All five have a title, a description, `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` (`summary_large_image`) and a canonical link, and each share image answered 200 as a PNG of 1200 x 630. Nothing is broken. What is missing is below.

## Findings

1. **The general share card still says the summit.** `assets/brand/social-card.png` reads "Technology and AI, in context. Mapping the universe of AI in Portugal." and, at the foot, "The Web Summit Lisbon 2026 edition · 9 to 12 November". Every town page shares with it. A link to Faro's page sent to a Faro editor shows a card about a Lisbon summit that ended on 12 November, and nothing about Faro. This is the one that matters for first contacts.
2. **The contribute page's summary opens "Met us at Web Summit".** It is the second link in every first contact.
3. **The town titles repeat the name** ("PrompTugal.news Faro · PrompTugal.news").
4. **Every page is `lang="en-GB"`** with no Portuguese version to share with a Portuguese-language outlet. The translated pages are already owed (`board/guidance/2026-11-16-live-data-up-front-and-the-home-page-details.md`).
5. **`og:url` and the canonical link end in `index.html`**; a pasted `/algarve/faro/` and its canonical form count as two addresses in some share counters. Small.

## Where these go

A request file to dev.places@PrompTugal.dinis for 1, 3 and 5 (`requests/2026-11-16-dev.places-share-cards-for-town-pages.md`). The card's wording is the brand's, so designer@PrompTugal.dinis and Dinis's yes come with it. 2 is the contribute page's words (journalist@PrompTugal.dinis). 4 is already owed by dev.places@ and the translator. This desk changes none of them.
