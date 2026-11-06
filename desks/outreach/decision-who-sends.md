---
title: "Who sends which company's email"
summary: "Fifty outreach drafts are ready; each must be sent by one person from their own .agent address on promptugal.news. Which person sends which company?"
decision: open
asked_by: outreach@PrompTugal.dinis
since: 2026-11-06T06:40Z
blocks: every outreach email (none can go until each has a sender)
answer:
answered_at:
---
# Who sends which company's email

Written by outreach@PrompTugal.dinis, 6 November 2026, about 11:45 UTC, in the shape of `board/spec-decisions-pages.md`. It lives in this desk until the decisions index exists (`content/newsroom/decisions/`, dev@'s; `content/` is outside this desk's grant): dev@ or the conductor may move it there as is.

## 1. The question

Fifty drafts (56 with the Portuguese versions) are ready in `desks/outreach/`, each leading with its company's live page. Dinis decided at about 06:25 UTC that a person sends each, "a mix between Vicky or Indi or Silvio or Jose, or even me ... on that format of vicky.agent" (`board/guidance/2026-11-06-companies-graphs-media-backups.md`, section 17). **Which person sends which company?** It blocks every email: nothing goes until each draft has its sender.

## 2. The options

**A. As proposed now.** Dinis the 6 Portuguese-language companies; the other 44 alternate Vicky and Indi, by Silvio's rank. Counts: Dinis Cruz 6, Indi Gupte 22, Vicky Wang 22.

**B. By kind of ask (recommended).** Dinis the 6 Portuguese-language companies; Silvio the 16 English "meet" companies of priority 1 (his WS-26 list, his sealed tracker already holds their published channels, and his plan of 5 November was to send WS-26 himself); Vicky and Indi alternate the other 28 (the interviews and the write-abouts, closest to the editors' work). Counts: Dinis Cruz 6, Indi Gupte 14, Silvio Switha 16, Vicky Wang 14.

**C. One sender.** Silvio sends all 50, as his WS-26 plan said ("Silvio sends all of WS-26 unless a person claims a company"), from his .agent address; the editors claim any company they want.

**D. Each person picks.** The five read the list and claim companies (a column in `desks/outreach/targets.json`, or tell the conductor); whatever is unclaimed by a time Dinis sets falls back to B.

Jose is in none of A to C by name: his surname is in no public source this desk can cite, and the draft signs with a full name. He can take any company in D, or in B in place of Vicky or Indi, once he says how he signs.

## 3. For each option

| | Good | Bad | Work |
|---|---|---|---|
| A | Ready now; editors sign as Editor | Silvio, who owns the list and the channels, sends none; the 44 land on two people | none |
| B | Each company gets the person closest to it: Silvio the meetings he planned, the editors the stories, Dinis the Portuguese | Silvio signs as "PrompTugal.news", not Editor (he is not on the editorial board) | one line in the generator, one run |
| C | One voice, one inbox to watch; matches the existing plan | 50 emails from one person reads as a campaign; the editors' names unused | one line, one run |
| D | Each sender owns what they chose | Slowest; needs a deadline | a column, a run per claim |

Readers: synthetic@'s comms director (run 3, SYNTHETIC) said signing as a named editor "worked"; no reader has seen a non-editor's signature yet.

## 4. Recommendation

**B.** It keeps the editors' signatures on the stories, puts the meetings with the person who planned them and holds their channels, and gives Dinis the Portuguese companies, where his name carries most.

## 5. What happens after

On Dinis's answer, outreach@ sets `SENDER_OF` in `desks/outreach/make-drafts.mjs`, runs it and releases at its next wake (each draft's signature and card follow); then each person reads their companies' pages and drafts and sends from their own .agent address, 3 to 5 first, as Silvio's plan says. Replies and contacts stay in the private CRM, never here.

## 6. Sources

- Dinis, section 17 of `board/guidance/2026-11-06-companies-graphs-media-backups.md` (who sends)
- Silvio's WS-26 plan, `people/silvio/outreach/README.md` on the team site (who sends, small batches)
- `desks/outreach/drafts.json`, `desks/outreach/targets.json`; `board/team/outreach/status.json` (asks)

## 7. How to answer

Tell the conductor in your session (A, B, C or D, or your own split); the conductor records it here and in `board/guidance/`.

## The fifty, with the sender under A and B

| Rank | Company | Ask | Lang | A | B | Draft |
|---|---|---|---|---|---|---|
| 1 | [1Password](https://promptugal.news/companies/1password/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/1password/comms/2026-11-06-promptugal-page/) |
| 2 | [Airia](https://promptugal.news/companies/airia/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/airia/comms/2026-11-06-promptugal-page/) |
| 3 | [Cisco (Outshift by Cisco)](https://promptugal.news/companies/cisco-outshift/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/cisco-outshift/comms/2026-11-06-promptugal-page/) |
| 4 | [Cloudflare](https://promptugal.news/companies/cloudflare/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/cloudflare/comms/2026-11-06-promptugal-page/) |
| 5 | [Conscium](https://promptugal.news/companies/conscium/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/conscium/comms/2026-11-06-promptugal-page/) |
| 6 | [Delinea](https://promptugal.news/companies/delinea/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/delinea/comms/2026-11-06-promptugal-page/) |
| 7 | [Descope](https://promptugal.news/companies/descope/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/descope/comms/2026-11-06-promptugal-page/) |
| 8 | [Emergence](https://promptugal.news/companies/emergence-ai/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/emergence-ai/comms/2026-11-06-promptugal-page/) |
| 9 | [Feedzai](https://promptugal.news/companies/feedzai/) | meet | pt | Dinis Cruz | Dinis Cruz | [thread](companies/feedzai/comms/2026-11-06-promptugal-page/) |
| 10 | [KPMG](https://promptugal.news/companies/kpmg-portugal/) | meet | pt | Dinis Cruz | Dinis Cruz | [thread](companies/kpmg-portugal/comms/2026-11-06-promptugal-page/) |
| 11 | [Linux Foundation (Agentic AI Foundation)](https://promptugal.news/companies/linux-foundation-aaif/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/linux-foundation-aaif/comms/2026-11-06-promptugal-page/) |
| 12 | [Mastra](https://promptugal.news/companies/mastra/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/mastra/comms/2026-11-06-promptugal-page/) |
| 13 | [Polygraf AI](https://promptugal.news/companies/polygraf-ai/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/polygraf-ai/comms/2026-11-06-promptugal-page/) |
| 14 | [Primitive](https://promptugal.news/companies/primitive/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/primitive/comms/2026-11-06-promptugal-page/) |
| 15 | [Qase](https://promptugal.news/companies/qase/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/qase/comms/2026-11-06-promptugal-page/) |
| 16 | [Replit](https://promptugal.news/companies/replit/) | meet | en | Indi Gupte | Silvio Switha | [thread](companies/replit/comms/2026-11-06-promptugal-page/) |
| 17 | [Scrut Automation](https://promptugal.news/companies/scrut-automation/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/scrut-automation/comms/2026-11-06-promptugal-page/) |
| 18 | [Startup Portugal](https://promptugal.news/companies/startup-portugal/) | meet | pt | Dinis Cruz | Dinis Cruz | [thread](companies/startup-portugal/comms/2026-11-06-promptugal-page/) |
| 19 | [Hexamind](https://promptugal.news/companies/hexamind/) | meet | en | Vicky Wang | Silvio Switha | [thread](companies/hexamind/comms/2026-11-06-promptugal-page/) |
| 20 | [CrowdStrike](https://promptugal.news/companies/crowdstrike/) | write-about | en | Indi Gupte | Vicky Wang | [thread](companies/crowdstrike/comms/2026-11-06-promptugal-page/) |
| 21 | [AICEP - Portugal Trade & Invest](https://promptugal.news/companies/aicep/) | meet | pt | Dinis Cruz | Dinis Cruz | [thread](companies/aicep/comms/2026-11-06-promptugal-page/) |
| 22 | [ChatPlace](https://promptugal.news/companies/chatplace/) | meet | pt | Dinis Cruz | Dinis Cruz | [thread](companies/chatplace/comms/2026-11-06-promptugal-page/) |
| 23 | [Cnext](https://promptugal.news/companies/cnext/) | meet | en | Vicky Wang | Indi Gupte | [thread](companies/cnext/comms/2026-11-06-promptugal-page/) |
| 24 | [Firefox Enterprise by Mozilla](https://promptugal.news/companies/firefox-enterprise-mozilla/) | meet | en | Indi Gupte | Vicky Wang | [thread](companies/firefox-enterprise-mozilla/comms/2026-11-06-promptugal-page/) |
| 25 | [Melious AI GmbH](https://promptugal.news/companies/melious-ai/) | meet | en | Vicky Wang | Indi Gupte | [thread](companies/melious-ai/comms/2026-11-06-promptugal-page/) |
| 26 | [Risiq GmbH](https://promptugal.news/companies/risiq/) | meet | en | Indi Gupte | Vicky Wang | [thread](companies/risiq/comms/2026-11-06-promptugal-page/) |
| 27 | [SpaceComputer](https://promptugal.news/companies/spacecomputer/) | meet | en | Vicky Wang | Indi Gupte | [thread](companies/spacecomputer/comms/2026-11-06-promptugal-page/) |
| 28 | [Trent AI](https://promptugal.news/companies/trent-ai/) | meet | en | Indi Gupte | Vicky Wang | [thread](companies/trent-ai/comms/2026-11-06-promptugal-page/) |
| 29 | [TrustScale](https://promptugal.news/companies/trustscale/) | meet | en | Vicky Wang | Indi Gupte | [thread](companies/trustscale/comms/2026-11-06-promptugal-page/) |
| 30 | [AISLE](https://promptugal.news/companies/aisle/) | interview | en | Indi Gupte | Vicky Wang | [thread](companies/aisle/comms/2026-11-06-promptugal-page/) |
| 31 | [Kiggu](https://promptugal.news/companies/kiggu/) | interview | en | Vicky Wang | Indi Gupte | [thread](companies/kiggu/comms/2026-11-06-promptugal-page/) |
| 32 | [Temporal](https://promptugal.news/companies/temporal/) | interview | en | Indi Gupte | Vicky Wang | [thread](companies/temporal/comms/2026-11-06-promptugal-page/) |
| 33 | [Air Apps](https://promptugal.news/companies/air-apps/) | write-about | pt | Dinis Cruz | Dinis Cruz | [thread](companies/air-apps/comms/2026-11-06-promptugal-page/) |
| 34 | [European Commission](https://promptugal.news/companies/european-commission/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/european-commission/comms/2026-11-06-promptugal-page/) |
| 35 | [Exa](https://promptugal.news/companies/exa/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/exa/comms/2026-11-06-promptugal-page/) |
| 36 | [Exein](https://promptugal.news/companies/exein/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/exein/comms/2026-11-06-promptugal-page/) |
| 37 | [GetVocal AI](https://promptugal.news/companies/getvocal-ai/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/getvocal-ai/comms/2026-11-06-promptugal-page/) |
| 38 | [JetBrains](https://promptugal.news/companies/jetbrains/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/jetbrains/comms/2026-11-06-promptugal-page/) |
| 39 | [Keewano](https://promptugal.news/companies/keewano/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/keewano/comms/2026-11-06-promptugal-page/) |
| 40 | [LaunchDarkly](https://promptugal.news/companies/launchdarkly/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/launchdarkly/comms/2026-11-06-promptugal-page/) |
| 41 | [LawVu](https://promptugal.news/companies/lawvu/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/lawvu/comms/2026-11-06-promptugal-page/) |
| 42 | [Ledger](https://promptugal.news/companies/ledger/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/ledger/comms/2026-11-06-promptugal-page/) |
| 43 | [LEGALFLY](https://promptugal.news/companies/legalfly/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/legalfly/comms/2026-11-06-promptugal-page/) |
| 44 | [Manus AI](https://promptugal.news/companies/manus-ai/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/manus-ai/comms/2026-11-06-promptugal-page/) |
| 45 | [National Cyber Security Centre (UK)](https://promptugal.news/companies/ncsc-uk/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/ncsc-uk/comms/2026-11-06-promptugal-page/) |
| 46 | [Open VSX (Eclipse Foundation)](https://promptugal.news/companies/open-vsx/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/open-vsx/comms/2026-11-06-promptugal-page/) |
| 47 | [Persona](https://promptugal.news/companies/persona/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/persona/comms/2026-11-06-promptugal-page/) |
| 48 | [Proton](https://promptugal.news/companies/proton/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/proton/comms/2026-11-06-promptugal-page/) |
| 49 | [ROOST (Robust Open Online Safety Tools)](https://promptugal.news/companies/roost/) | write-about | en | Vicky Wang | Vicky Wang | [thread](companies/roost/comms/2026-11-06-promptugal-page/) |
| 50 | [RWS Group](https://promptugal.news/companies/rws/) | write-about | en | Indi Gupte | Indi Gupte | [thread](companies/rws/comms/2026-11-06-promptugal-page/) |
