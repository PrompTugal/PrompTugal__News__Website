---
title: "PrompTugal.news as an investable business: a first picture from public facts and the team's own record"
by: investors@PrompTugal.dinis
written: 2026-11-06T20:30Z
issue: WS-177
status: a first picture for Dinis. No numbers about money, no projections. Every open question that is his is on the decision page.
---
# PrompTugal.news for investors: round 1

Public sources only, each with its link and the date read (6 November 2026 unless said). **Read** means the page was opened; **snippet** means only a search engine's summary was seen. Counts from this repository are as of commit `86e3933` on `dev` (v0.1.329), 6 November 2026, about 20:15 UTC.

## 1. What it is {#what}

- **A publication:** "technology and AI, in context, from Portugal for Europe, made to outlive the summit" (CLAUDE.md). Its first edition covers the companies going to Web Summit Lisbon (9 to 12 November 2026) through RiskMandate's lens (reach, mandate, gap). https://promptugal.news/ (read, HTTP 200).
- **Made and run by AI agents with a named human operator**, Dinis Cruz, in the open: every page, the board, the keys and the decisions are in this public repository.
- **Published by The Cyber Boardroom** (Dinis, 6 November 2026, 06:25 UTC, recorded in `board/team/conductor/status.json`), prices in pounds.

## 2. The company: The Cyber Boardroom Limited {#company}

| Fact | Source | How |
|---|---|---|
| THE CYBER BOARDROOM LIMITED, company number 15623827, private limited company, **Active** | [Companies House](https://find-and-update.company-information.service.gov.uk/company/15623827) | read |
| Incorporated 7 April 2024; registered office in London | same | read (the street address is not repeated here) |
| Nature of business (SIC) 63120, web portals | same | read |
| Last accounts made up to 30 April 2025; next due by 31 January 2027; last confirmation statement 6 April 2026 | same | read |
| Dinis's own site calls it "UK-registered and trading for almost two years ... today the commercial vehicle behind sgit.ai and RiskMandate.ai" | [sgit.ai/about](https://sgit.ai/about/index.md) | read |
| It has a public investment repository: business plan v0.9, pitch-deck narratives, "who should invest", revenue model, and a paper on how news providers can monetise trust and knowledge with personalised semantic graphs; last commit 15 February 2025 | [the-cyber-boardroom/cbr-investment](https://github.com/the-cyber-boardroom/cbr-investment) | read (cloned) |
| The Cyber Boardroom is joining Algarve Evolution as a member | [Joining Algarve Evolution](https://newsroom.sgit.ai/articles/joining-algarve-evolution.html), 31 Oct 2026 | via the Web Summit team's research (not re-opened) |

**Not confirmed:** that company 15623827 is Dinis's: the match is the exact name and his own site's words; his name on the register's officers page was not checked. The accounts' figures were not opened and are not reported here (no financial figure that is not given by Dinis).

**The thread worth noticing.** In February 2025 The Cyber Boardroom's public investment repository already argued that news providers could be paid for "LLM-ready content services", "trust-as-a-service" and a personalised news feed built on semantic graphs (`docs/partners/monetising-trust-and-knowledge__for-news-providers.md`, `docs/strategy/personalised-news-feed-architecture.md`). PrompTugal.news is, twenty months later, a running instance of that idea: sourced, signed, a markdown twin and JSON for every page, a graph of companies, people and events. That is the company's own earlier writing, not an outside view.

## 3. What has been built, in numbers {#built}

From this repository (counted with `ls`/`node`; nothing estimated):

| What | Count | Where |
|---|---|---|
| Releases, each built, gated, tagged and deployed by CI | 329 (v0.1.1 on 4 November 2026 to v0.1.329 on 6 November 2026) | `newsroom/versions.json` |
| Published, signed articles | 23 (each with a `.sig`) | `content/articles/`, `articles/*.sig` |
| Pages (markdown sources) | 94 | `content/` |
| Companies with sourced profiles | 120 | `data/companies/` |
| Summit events, places, topics | 240, 83, 17 | `data/events/`, `data/places/`, `data/topics/` |
| People (public and professional only), organisations | 264, 238 | `data/people/`, `data/organisations/` |
| Story candidates | 75 files | `data/stories/` |
| Agents' public keys (including other operators' agents) | 41 entries | `board/keys.json` |
| Role folders of this team | 27 (with this one) | `board/team/` |

What sells and what is only designed is customers@'s map, not mine: one thing is on sale (the 5 pound reading top-up); 19 packages and 20 products are proposals; the flagship is "the personalisation and event management platform being made for this summit by proxy", not for sale until the summit shows it works (`board/team/customers/monetisation-map.md`, `products.json`, `briefs/2026-11-06-the-event-platform.md`).

## 4. The market (analysis, not a forecast) {#market}

| Fact | Source | How |
|---|---|---|
| Portugal had 5,091 active startups in 2025 (+8% on 2024), about 28,000 workers, 2.856 billion euros turnover (+9%) | [Startup Portugal, ecosystem report 2025](https://startupportugal.com/startup-entrepreneurial-ecosystem-report-2025/), 12 Nov 2025 | read |
| Web Summit Lisbon 2025: about 71,386 attendees from 157 countries, 1,857 investors from 86 countries (up from 1,066), about 2,725 startups | [Web Summit, record investors](https://websummit.com/blog/news/record-investors-at-web-summit-2025-bucking-industry-trends/), 13 Nov 2025; [ECO](https://eco.sapo.pt/2025/11/09/sao-esperadas-mais-de-70-mil-pessoas-e-2-500-startups-na-web-summit-2025/) | **snippet**: the Web Summit page opened without its text; the figures are from search summaries citing it |

What this says, and does not: there is a large, recurring, international audience in Lisbon each November and a growing domestic startup base that wants to be seen in Europe. It does not say that anyone pays for a publication or a personal schedule about it; customers@'s rule of seven is the test.

## 5. What an investor would ask {#questions}

1. **Which company?** The Cyber Boardroom (UK) publishes; the Web Summit team offers My Feeds (Portugal) to investors for the agentic-team services. Is PrompTugal.news an asset of the first, a product of the second, or its own? (Dinis's.)
2. **Is it for sale or for investment at all,** or is it the shop window that sells services (customers@'s map) and RiskMandate?
3. **Does it outlive the summit?** The brief says so ("made to outlive the summit"); after 12 November there is no evidence yet.
4. **Readers.** observability@ counts page views without identifying anyone; no reader numbers are public yet, and none are given here.
5. **Cost.** What the agents cost to run (accountant@'s `board/budgets.json`, dollars API-equivalent) against what it earns (5 pound top-ups so far). Not stated here: it is Dinis's to publish.
6. **Editorial independence.** The disclosure says plainly this is not independent coverage; how investors and buyers keep apart from what is published (customers@'s rule 1) is a question every investor in media asks.
7. **Defensibility.** All open source; Dinis's own line is that the execution is not forkable (the Web Summit team's research, section 2).

## 6. What is not known yet {#unknowns}

Reader numbers; revenue beyond the top-up; any cost figure; the relation between The Cyber Boardroom, My Feeds and PrompTugal.news; whether any investment is sought for PrompTugal.news at all; whether the platform sells to a second event.
