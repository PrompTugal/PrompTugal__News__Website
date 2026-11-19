# Google APIs: terms quoted (R15), read 19 Nov 2026 about 01:15 UTC by rights@

Not legal advice. Quoted from the pages as served; no agent accepts these terms (R14): only Dinis does.

## Google APIs Terms of Service (https://developers.google.com/terms, last modified 9 November 2021)
Applies to all five free APIs and, through Google Cloud, to Vertex AI Search (whose own Cloud terms, https://cloud.google.com/terms/service-terms, I have not yet read in full).
- Content returned from the APIs: you may not "Scrape, build databases, or otherwise create permanent copies of such content, or keep cached copies longer than permitted by the cache header" and may not "Copy, translate, modify, create a derivative work of, sell, lease, lend, convey, distribute, publicly display, or sublicense to any third party" it, unless the API's documentation allows it. (Note the sentence is qualified in the full text; the exact scope per API is to be read with each API's documentation.)
- Attribution: "You agree to display any attribution(s) required by Google as described in the documentation for the API."
- You may not "Remove, obscure, or alter any Google terms of service or any links to or notices of those terms."

## Books API (https://developers.google.com/books/terms, last modified 25 April 2012)
- Fees: "You may not charge users any fee for the use of your application, unless you have entered into a separate agreement with Google or obtained Google's written permission." This bears on promptugal.news, the only billing site: no Books API data there.
- Content removal on request, and contact information for rights holders to request removals.

## Knowledge Graph Search API (https://developers.google.com/knowledge-graph/terms, last modified 8 December 2015)
- "By using this API, you consent to be bound by the Google APIs Terms of Service." Nothing more found on the page about commercial use; to be read with the API documentation before use.

## Fact Check Tools API (https://developers.google.com/fact-check/tools/api/terms, last updated 25 May 2023)
- Claim Search: "Use of the FactCheck Claim Search API is subject to Google's API Terms of Service." Each claim review remains its publisher's (a ClaimReview): credit the publisher and link it.

## PageSpeed Insights
- The terms page at developers.google.com/speed/docs/insights/terms returned 404; terms to be found and quoted before first use on a page.

## Vertex AI Search over 15 Portuguese sites
Results are titles, snippets and links drawn from other organisations' sites: each site's own terms and robots decide whether a title or snippet may be shown, and a Google API's terms do not replace them.
Until each of the fifteen sites' terms are quoted on the register and Dinis settles it: not shown on any page. On promptugal.news (the billing site): not shown at all, per R13, because the sites' terms are not "allowed" commercially.

## commercial_use set by rights@ (proposal for data.promptugal.news's commercial.json)
- youtube-data / replays: unclear (embedded-player condition)
- books: not allowed (no fee may be charged; promptugal.news bills)
- knowledge-graph-search: unclear
- fact-check-tools: per item (each ClaimReview is its publisher's)
- pagespeed-insights: unclear (terms not found)
- vertex-search results: unclear, not shown on any page yet

---

# YouTube developer policies: quoted for the free case-study page on promptugal.news (read 19 Nov 2026 about 01:30 UTC; every page last updated 2026-11-06 UTC)

Sources: https://developers.google.com/youtube/terms/developer-policies (DP), https://developers.google.com/youtube/terms/required-minimum-functionality (RMF), https://developers.google.com/youtube/terms/api-services-terms-of-service (ToS). Not legal advice; only Dinis accepts terms (R14).

1. **No charging, no gating (DP, Playback Integrity):** "API Clients must not charge users to watch content in an embedded YouTube player. API Clients must not otherwise gate access to a video by requiring a user to take an action other than clicking the play button to view or continue playing YouTube audiovisual content."
2. **Advertising and sponsorship (DP):** an API client must not "sell advertising, sponsorships, or promotions that are placed on or within YouTube audiovisual content or the YouTube player without YouTube's prior written approval; or sell advertising, sponsorships, or promotions on any page or screen that contains YouTube API Data unless other data, content, or material not obtained from YouTube appears on the same page and offers enough independent value to justify such sales if the YouTube API Data were removed."
3. **Attribution (DP):** "You and your API Clients must not ... interfere with or obscure any attribution provided by YouTube, including attribution provided via or shown in embedded YouTube players. Your API Clients must display applicable YouTube Brand Features and any other YouTube-provided attribution on all types of devices."
4. **Player (RMF):** "Embedded players must have a viewport that is at least 200px by 200px ... We recommend 16:9 players be at least 480 pixels wide and 270 pixels tall." "You must not display overlays, frames, or other visual elements in front of any part of a YouTube embedded player, including player controls ... or use overlays, frames or other visual elements to obscure any part of an embedded player." "You must not make changes to the YouTube player that are not explicitly described by the API documentation." "You must not use mouseovers or touch events on a YouTube player to initiate any action on the user's behalf."
5. **Storage (DP):** non-authorized data may be stored "no longer than 30 calendar days. After 30 calendar days, the API Client must either delete or refresh the stored data." Autoplay rules are in RMF (not until visible).
6. **YouTube's terms linked:** the ToS defines the YouTube Terms as https://www.youtube.com/t/terms; link it where the player is shown. The branding guidelines page (https://developers.google.com/youtube/terms/branding-guidelines) is to be read before the page's design is final.

## Verdict on the free-page design (Dinis, via conductor.b@, 19 Nov about 01:10 UTC): GO, with these conditions
The design is within the quoted policies **if and only if** the page:
- **C1** is never charged and never gated: no paywall, sign-in, cookie wall, meter count or "pay to continue" between the reader and the play button (quote 1). The page is flagged free in the billing data and the gate fails any charged page that carries a YouTube embed.
- **C2** carries **no advertising, sponsorship or promotion** on or around the player; if the "Support us" banner is shown on the page, it is a plain request for support, not a sale of advertising (quote 2). dev@ to keep ads off the page; if the site ever sells ads, this page and every YouTube page stays out of it unless other, non-YouTube content gives the page independent value (the case-study text may do that; rights@ re-checks).
- **C3** uses YouTube's own iframe player (youtube-nocookie), at least 200px by 200px and, by recommendation, 480 by 270 for 16:9, with nothing laid over any part of it, no mouseover actions, and no change to the player beyond the documented parameters (quote 4).
- **C4** credits YouTube and links https://www.youtube.com/t/terms next to the player, and does not hide YouTube's own attribution (quotes 3 and 6).
- **C5** stores nothing from the API for more than 30 days (data.b@'s collector already deletes at 25).
- **C6** does not create a metered "read" for the page in the reading log or the simulated payments model, so the bill never counts it.
Nothing is published until dev@ shows rights@ the built page against C1 to C6; rights@ then says "published, within the policies" or names what must change. Branding guidelines to be quoted in that review.

---

# History sources: weather (read 19 Nov 2026 about 01:35 UTC; for "show the past", board/guidance/2026-11-19-show-the-past.md)

Not legal advice. Moved here because it is the register rights@ keeps; it is not about Google. Quotes as served.

## IPMA (past forecasts, observations, normals)
Source: https://www.ipma.pt/en/siteinfo/index.html (terms of the site, "Protection of intellectual property"); api.ipma.pt's page states "Copyright © IPMA 2017" and names webmaster@ipma.pt as the operator's contact.
- "The User can freely copy, import or use information or national symbols in this site for personal or public use, provided that for no purposes of profit or offence. The User must always mention the source of the information."
- Nothing in these terms says either way about keeping an archive or republishing a past reading; they allow public use that is not for profit, with the source named. So: keeping and showing IPMA's past forecasts and observations **on the free sites is within these terms, with IPMA named as the source** (the free sites bill nothing). **On promptugal.news, which bills, it is not allowed** (profit). Same for IPMA's climate normals and reports when they are on ipma.pt. Whether a past reading counts as "information in this site" or the open-data API is a question for IPMA; outreach@ may ask the questions on the record (a person sends).
- commercial_use: not allowed (unchanged).

## Open-Meteo, historical archive (and forecasts)
Source: https://open-meteo.com/en/terms (read 19 Nov).
- "By using the Free API for non-commercial use you agree to following terms: Less than 10'000 API calls per day, 5'000 per hour and 600 per minute. You may only use the free API services for non-commercial purposes. You accept to the CC-BY 4.0 licence, as specified in the licence conditions."
- So the historical archive may be read through the free API for the free sites only, credited as CC BY 4.0 (the licence page is https://open-meteo.com/en/license), within the call limits. **Not on promptugal.news** (commercial: a paid plan would be needed, and that is Dinis's to decide, money). Not accepted by any agent (R14): a free API with a rate limit does not need an account, but data.b@ must stay within the limits.
- commercial_use: not allowed (unchanged).

## What the rule gives
- The full weather history (observed days, "what we said beside what happened") lives on weather.promptugal.news and data.promptugal.news (free), each row carrying its read time, source, licence link and the collection it came from, as the guidance says.
- Our own record of what we forecast is ours (CC BY 4.0), but it holds IPMA's values: the archive of "what we showed" is a copy of IPMA's forecasts, so it too stays off promptugal.news.
- promptugal.news may link to the weather history; it shows no history values from IPMA or Open-Meteo.
