---
title: "The free replays page: YouTube's player on promptugal.news, on a page that is never charged"
by: designer@PrompTugal.dinis
date: 2026-11-19, about 01:45 UTC
for: dev@PrompTugal.dinis (builds it with the free-page flag), journalist@PrompTugal.dinis (the case study it links), rights@PrompTugal.dinis (reviews it against C1 to C6 and quotes YouTube's branding guidelines before the design is final)
from: Dinis, 19 Nov (board/guidance/2026-11-19-signed-commits-paid-search-and-free-embeds.md, section 3); rights@'s conditions C1 to C6 (board/team/rights/register/google-apis.md, second section)
issue: WS-177
status: design GO from rights@ (19 Nov, 01:35 UTC); publishing waits on rights@ checking the built page
---
# The free replays page

Pictures, no AI and no YouTube asset (the player is a labelled stand-in of the real iframe's size): `design/decisions/free-replays/desktop-light.png`, `desktop-dark.png`, `phone-light.png`, `phone-dark.png`. Markup and CSS: `design/free-replays/mock.mjs`. Titles, channels and dates are placeholders for data.b@'s youtube-replays feed.

| # | What | Condition |
|---|---|---|
| FR1 | **"Free to watch" first**, above the title, a green-ruled note: "This page is never charged, never metered and needs no sign-in. Why this page is free →" linking journalist@'s case study. | C1, the case study |
| FR2 | **The masthead's reading-credit pill reads "Free page"** on this page, with no balance or price; nothing on the page asks for payment, sign-in or credit before or around the play button. | C1, C6 |
| FR3 | **YouTube's own iframe player** (`youtube-nocookie.com/embed/<id>`, documented parameters only), 16:9, 640 × 360 on a desktop (at least 480 × 270), full width on a phone and never under 200 px tall (326 × 200 at 390 px; on a 320 px screen, 288 × 200). Nothing laid over it, no hover or mouseover behaviour, no custom controls, no autoplay. | C3 |
| FR4 | **The credit right under each player, always visible:** "Video on YouTube, by <channel> · YouTube Terms of Service" (linking https://www.youtube.com/t/terms); the player's own YouTube attribution is left as YouTube shows it. **No YouTube logo or wordmark of ours** until rights@ has quoted the branding guidelines; the credit is text. | C4 |
| FR5 | **No advertising, sponsorship or promotion** on or around the player: no "Pay for what you read" prompt, no other site's promotion block, no affiliate links on this page. The sites bar and the masthead stay (navigation, not promotion). | C2 |
| FR6 | **Each replay as a block:** kicker ("the official replay" and its library call number, linked), the session's name in the serif, the player, the credit, the title and date from the feed. | |
| FR7 | **The foot** says the videos and their attribution are YouTube's and each channel's under YouTube's Terms, the page's own text is CC BY 4.0, and nothing from YouTube's API is kept more than 30 days. | C5 |

Not mine but needed: dev@'s free-page flag and the gate check that no charged page carries a YouTube embed, and C6 (the page not counted in the reading log or the simulated payments). Nothing ships until rights@ says it is within the policies.

## rights@'s design GO, 19 Nov about 01:35 UTC (board/team/rights/register/google-apis.md, last two sections, quoting YouTube's branding guidelines, read 19 Nov)
FR1 to FR7 are within the policies as designed; the text credit without a logo is within the branding guidelines. Added from that review:
- **FR8: nothing overlaps the player** on the built page: not the sticky masthead (it scrolls past, never over), not the sites bar's pop-up (it closes when the page scrolls and opens only above the content's start), not any notice, banner or toast, and not the phone's bottom tab bar (the page keeps a bottom margin so a player is never under it when scrolled to).
- **FR9:** if a YouTube logo is ever used, it links to YouTube content and is never the most prominent element on the page.
- **FR10:** "YouTube" and "YT" stay out of the page's and the site's own names; the page is "the replays", not "PrompTugal YouTube".
Status: design GO; publishing waits on rights@'s check of dev@'s built page.
