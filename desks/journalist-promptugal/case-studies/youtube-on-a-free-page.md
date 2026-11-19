---
title: "Why this page is free: YouTube on a site that charges by the read"
summary: "promptugal.news charges for what you read. This page does not, and that is the point: YouTube's terms forbid charging to watch its embedded player, and a meter that prices page by page can leave one page out."
status: draft, not published (waits for rights@'s "within the policies" on the built page, C1 to C6; Dinis's guidance of 19 November 2026, section 3)
for: dev@ (to place on the free page and as its case-study page) and designer@ (the page around the player)
written_by: journalist@PrompTugal.dinis, 19 November 2026
sources_read: 19 November 2026
---

<!-- Two texts: (A) the short line that sits on the free page next to the player; (B) the case study it links to. No em-dashes. Every claim about YouTube's terms is quoted from rights@'s register (board/team/rights/register/google-apis.md), which quotes YouTube's own pages, read 19 November 2026; every claim about our meter is from assets/meter/meter.js and data/billing/. -->

## (A) On the free page, beside the player

**This page is free.** You are not charged for it, it does not count as a read, and nothing stands between you and the play button. YouTube's terms say a site must not charge people to watch its embedded player, so we do not. The videos play in YouTube's own player and are credited to YouTube: [YouTube's Terms of Service](https://www.youtube.com/t/terms). [Why this page is free](CASE-STUDY-LINK).

## (B) The case study: why this page is free

### The short answer

promptugal.news asks you to pay for what you read, a few pence a page. YouTube's terms forbid charging people to watch videos in its embedded player. So the one page on promptugal.news that shows YouTube videos is never charged. The meter we built prices each page on its own, which makes leaving one page out simple: we mark it free, and the build checks that no charged page carries a YouTube player.

### How the rest of the site charges

The meter on promptugal.news works page by page. Each page has a price set by its kind and how fresh it is. As you read, the meter counts the share of the page you actually had on screen long enough to read, and charges that share of the price, never less than a tenth of it. You can rate a page: "not useful" makes it free, "excellent" doubles it. You can decline a charge and say why, and it is refunded. Your balance and your reading log stay in your own browser; nothing is sent to us. A top-up is one payment of £5.00 on Stripe's own page.

Only promptugal.news charges. The other PrompTugal sites (data, weather, civic and the rest) carry no billing at all, by Dinis Cruz's decision of 18 November 2026.

### What YouTube's terms say

We read YouTube's developer policies on 19 November 2026, with our licensing agent, rights@, quoting each one from the source:

- **No charging, no gating.** "API Clients must not charge users to watch content in an embedded YouTube player. API Clients must not otherwise gate access to a video by requiring a user to take an action other than clicking the play button to view or continue playing YouTube audiovisual content." ([Developer Policies](https://developers.google.com/youtube/terms/developer-policies))
- **No advertising sold on the player**, and none on a page of YouTube data unless the page has enough of its own content to justify it. (Developer Policies)
- **YouTube's attribution stays visible.** A site must not "interfere with or obscure any attribution provided by YouTube, including attribution provided via or shown in embedded YouTube players." (Developer Policies)
- **The player is left as YouTube made it:** at least 200 by 200 pixels, nothing laid over it, no actions on mouseover, no changes beyond the documented ones. ([Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality))
- **Nothing kept for more than 30 days** from the API without refreshing it. (Developer Policies)

### What we do about it

This page meets those terms in six ways, each checked by rights@ before the page went live:

1. **It is never charged or gated.** No paywall, no sign-in, no cookie wall and no meter before the play button. The page is marked free in the billing data, and the site's build fails if any charged page carries a YouTube player.
2. **No advertising, sponsorship or promotion** on or around the player.
3. **YouTube's own player** (the privacy-enhanced youtube-nocookie one), at a size it recommends, with nothing over it.
4. **YouTube is credited**, its Terms linked beside the player, and its own attribution left visible.
5. **Nothing from YouTube's API is kept more than 30 days.** Our data feed deletes it sooner.
6. **The page is not a read.** It does not appear in your reading log, it is not charged, and it is left out of our simulated share-out to sources.

### What it shows about the model

A subscription or a paywall works on a whole site: everything inside it is paid for, so a video whose terms forbid charging cannot sit inside it. A meter that prices page by page can make an exception of one page without changing anything else. Here that exception is a source's own rule. It could just as well be a page of public safety information, or one whose source allows only non-commercial use.

The same rule already applies elsewhere. Data whose licence does not allow commercial use, such as the Portuguese weather service IPMA's, stays off promptugal.news's charged pages and is shown on the free sites instead. YouTube is the first case where we keep the source on the paying site and take the charge off the page.

### What we do not claim

This is our reading of YouTube's published terms, not legal advice, and not an agreement with YouTube or Google. Only Dinis Cruz accepts terms on PrompTugal's behalf. If YouTube's terms change, rights@ re-reads them, and this page changes or comes down.

*Sources, read 19 November 2026: YouTube's [Developer Policies](https://developers.google.com/youtube/terms/developer-policies), [Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality) and [API Services Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service) (each last updated 6 November 2026), as quoted in rights@'s register; the meter's own description in `assets/meter/meter.js`; the top-up in `data/billing/topup.json`; Dinis Cruz's guidance of 18 and 19 November 2026.*
