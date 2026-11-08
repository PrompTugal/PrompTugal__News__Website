---
story: company batches C1 and P1
reviewed: 2026-11-08
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: 18 Ready and released; Fretefy Fix first
---

# Company batches C1 and P1: review (standing answers 23 and 24)

A one-off review batch Vicky started on 8 November 2026, about 18:05 UTC (standing answer 24: publishing the Ready files of a batch she started is approved). C1, journalist-connections (10 files, commit `53b3db8c`); P1, journalist-portugal (9 files, commit `efd0fdd3`). Every cited source opened on 8 November 2026 (Web Summit's pages in a headless browser; the companies' sites in a browser and as served), by four read-only checkers whose every finding I re-checked at the source before acting.

## Verdicts

| Company | Verdict | My edits (standing answer 17) |
|---|---|---|
| Cloudflare | Ready | The sentence about what its site now leads with dropped: it describes the site, not what Cloudflare does (standing answer 23). |
| Descope | Ready | None. |
| Emergence | Ready | None. |
| Exein | Ready | "find weaknesses in firmware before release" became "it says, find and fix weaknesses in firmware without leaving the build environment" ("before release" was inferred). |
| Ledger | Ready | "offers AI agents limited permissions" became "It says its users' AI agents can propose transactions and prepare payments, while the owner approves them" (its page: "but you manage approvals"; "limited" was not on it). |
| Manus AI | Ready | The "Times are as Web Summit lists them" line dropped: the file lists no times. |
| You.com | Ready | "accurate, up-to-date information" attributed ("it says"). |
| Proofpoint | Ready | None. |
| Proton | Ready | None. |
| ROOST | Ready | None. |
| Just Travel | Ready | None. |
| MEO | Ready | "a telecoms operator" was marked with a Web Summit attendee page that does not say it; MEO's own site does ("Escolhe o operador com menos reclamações"), so both About claims now cite it. |
| Mobile Brain | Ready | None. |
| sheerME | Ready | None. |
| AI Infinity | Ready | Its service sentence attributed ("It says ..."). |
| ChatPlace | Ready | None. |
| DIG-IN | Ready | "restaurants, bars and cafés" became "restaurants and other hospitality venues" (no source names bars); who uses it attributed ("It says it serves ..."). |
| FIDO | Ready | "covers each step of a loan ... and payment" became "connects origination, analysis, the credit decision, the contract and settlement in one place" (its page's five steps: "originação, análise, motor de crédito, formalização e liquidação"). |
| Fretefy | **Fix first**, to journalist-portugal | See below. |

## The points Vicky named

- **Manus AI:** its About is one sentence, a plain rendering of Manus's own description ("the action engine that goes beyond answers to execute tasks, automate workflows"); not padded, and none added. Its only participation is Tao Zhang, "Co-founder & CPO", on Web Summit's speakers page; the file claims no session and no exhibiting.
- **Speaker country and company location:** no file uses a speaker's country as the company's location. Where a file says where a company is based, it cites a Web Summit company (appearance) page, never the speakers page (for example, Tao Zhang is listed with "China"; the Manus file says nothing about where Manus is based).
- **Fretefy:** Fix first, for a fact and a source note, not wording. Its own site (cited as source 2) is not only script: the page as served says "Fretefy agora é Mobiis" and "FRETEFY AGORA É MOBIIS! Conheça todas as soluções da Mobiis!", while its title and description still name only Fretefy. The file says "the page loads by script, so only its title and description were read", and its About leaves out that the company now presents itself as Mobiis. For journalist-portugal: say what the site says about Mobiis (for example "Its site says Fretefy is now Mobiis (2)"), correct the note on how the site was read, and keep the rest, which checks out (Web Summit: "Logtech SaaS que conecta embarcadores e transportadoras com gestão, cotação automatizada e rastreamento de fretes em tempo real", Brazil, GROWTH, SaaS). Do not use the contact details on that page.
- **No session or exhibition detail inferred:** every participation line matches its Web Summit page; where a page gives no day or session (the startups), the files say so or give none.

## Notes, not changes

- MEO: "Wednesday" for 11 November is not printed on the session page but is the right day.
- Several session lines name only the company's speaker; the session pages list others too. Fine on a company's page.
- sheerME: "Portuguese company" rests on Web Summit's "Portugal" (cited); its site's footer has a Brazilian-style company name ("sheerME Digital Media Ltda") and lists Portugal, Spain and Brazil.
- The page shows the About from the file; its "At the summit" list and "Based in" row come from the team's company data, not from these files (template as built for PILOT-REPLIT).

## Live checks, 8 November 2026, about 18:30 UTC (v0.1.732)

All 18 released pages answer 200 and show the About section, at 390 px and at 1280 px: no horizontal scroll, the section inside its column (to 374 of 390 px; 730 of 1280 px), read on screenshots at 390 px. The About sections do not contradict the pages' "Based in" rows.

**For the data's owner (not these files, not a template defect):** the company pages' "Based in" row comes from `data/companies/<id>/company.json`, and for speaker-only companies it has no sourced location. Proton's says so itself, "France (the speaker's Web Summit listing; headquarters not sourced)", which is a speaker's country shown as the company's location; Manus AI's "China" matches its speaker's listing too. Nothing changed in `data/` by the reviewer (standing answer 10); for ontologist@PrompTugal.dinis, who owns `data/`, and the team's company map it is derived from.

## Fretefy, check again, 8 November 2026, about 18:50 UTC

**Verdict: Ready, released.** journalist-portugal's revision (`70b9dab2`) adds the rebrand and corrects the source note, each checked at its source today:
- Fretefy's site, as served, says "FRETEFY AGORA É MOBIIS!" and "Fretefy agora é Mobiis" and links to https://www.mobiis.com.br/; the note on how it was read now says the page was read as served.
- Mobiis's site: "A Mobiis é um software completo para a logística" and "Consuma informações da plataforma Fretefy". Its title: "Mobiis | Tecnologia para transformar sua logística".
- Nothing says how the rebrand came about, and the file does not say either.

My edit, at Vicky's word (committed on its own): the clause "while its title still names Fretefy's three systems, TMS, YMS and DMS" dropped, so the About stays on what the company does and what its site now says; the title stays in the citation. Three sentences. The participation line is unchanged and right (Startup, GROWTH, SaaS; no session or exhibition day).
