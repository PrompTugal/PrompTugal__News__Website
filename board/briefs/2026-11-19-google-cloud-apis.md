# Google Cloud APIs: what exists (19 November 2026)

From videos.b@'s brief to conductor.b@ (about 01:00 UTC, 19 Nov). Dinis set this up in the Google Cloud console with videos.b@ between about 23:45 UTC on 18 Nov and about 01:00 UTC on 19 Nov. This is material, recorded so that every agent knows what exists. No key value is in this file or anywhere in this repository: each key is held only as a network secret on the cloud environment, and the proxy adds it to the request.

## 1. The free project: promptugal-news-apis (no billing)

- One key, restricted to five APIs: YouTube Data v3, Fact Check Tools, Knowledge Graph Search, PageSpeed Insights and Books.
- Web Risk is off, at Dinis's word (its price).
- The key is a network secret on the environment "PrompTugal - Full Access" for www.googleapis.com, factchecktools.googleapis.com, kgsearch.googleapis.com and pagespeedonline.googleapis.com. It is sent as the X-Goog-Api-Key header.
- Custom Search JSON API is closed to new projects (403 at about 00:20 UTC). It is disabled and removed from the key.
- Steps for people: https://videos.promptugal.news/how/google-api-key/

## 2. The paid project: promptugal-news-apis-billing

- On Dinis's trial credit, the only project on that billing account.
- Vertex AI Search (Discovery Engine API), pay on demand. Published Standard price: 10,000 searches a month free, then USD 1.50 per 1,000. Generative answers are off; they would cost USD 10 per 1,000.
- Data store "promptugal-news-sites": website content, basic indexing, covering 15 Portuguese sites. These are 11 news sites (rtp, publico, observador, expresso, dn, jn, sapo, lusa, iol, barlavento, sulinformacao) plus portugal.gov.pt, ine, ipma and diariodarepublica.
- Its own key, restricted to the Discovery Engine API only, is a network secret for discoveryengine.googleapis.com.
- Tested once at about 01:00 UTC (searchLite, 200).

## 3. Spending controls

- Google's spend cap does not cover Discovery Engine. The per-minute quotas shown are Google's fixed system limits, so we cannot lower them.
- A budget on the billing account emails Dinis at 50, 90 and 100 per cent. A trial account is not charged after the credit ends.
- videos.b@'s callers stop after 50 searches per run, and nothing calls search from CI.

## 4. The rules for the team

- Any session on "PrompTugal - Full Access" can reach these hosts. Agents that want search, YouTube or fact-check data ask through conductor.b@; they do not build their own collectors.
- Paid search has one owner. Who owns it is Dinis's to say (money); videos.b@ suggests data.b@, which runs the collectors. Until he says, no agent but videos.b@ calls Discovery Engine.
- Every source read through these APIs is on the register first, with its terms quoted (R15). rights@ reviews YouTube (R6). Whether Vertex AI Search results drawn from the 15 sites may be shown on a page, and on which site (R12, R13), is for rights@ to review before anything is published.
