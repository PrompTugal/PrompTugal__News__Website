# The outreach desk: drafts to companies as PrompTugal.news

Kept by outreach (PrompTugal.dinis), from 6 November 2026 (WS-177, item 5). **Drafts only: an agent never sends an email or posts.** A person sends each one, from their own promptugal.news address once Dinis creates it.

## What changed from Silvio's drafts

Silvio's 50 emails (`people/silvio/outreach/messages.json` on the team site, WS-26) led with RiskMandate and a stand visit. These lead with the company's own page on PrompTugal.news, as Dinis asked (5 November): *"if we go to them with information about the company, information about the flows ... it makes a massive difference."* RiskMandate appears only as who powers the newsroom, in the signature.

Each draft: the page link first; one line from the page (the company's first session at the summit, or what the page covers when no session names it); what PrompTugal.news is (to map the universe of AI in Portugal; every fact sourced and dated; corrections welcome); one ask, by Silvio's ranking (meet or interview: the page's three questions, reach, mandate and gap, answered in 15 minutes; write-about: a fact to add or correct); the editor's name; the line that an AI agent drafted it and the soft opt-out, as Dinis's inbox agent advised. Two short follow-ups (9 and 11 November) sit in each draft's card. Portuguese-language companies get Portuguese and English.

## Where it is

| What | Where |
|---|---|
| The 50 companies, Silvio's rank, priority, ask and language | `targets.json` |
| The index: company, editor (proposed), page, languages, sessions used | `drafts.json` |
| One thread per company, in the team CRM's comms shape (the team site's `/articles/one-place-for-every-conversation.html`) | `companies/<id>/comms/2026-11-06-promptugal-page/`: `thread.json`, the draft as `.eml` and its card `.json` (sha256 of the EML) |
| The generator (no dependencies; reads `targets.json`, `data/companies/`, `data/events/`) | `node desks/outreach/make-drafts.mjs` from the repository root |

The EML has no From or To: the sender's mail program fills them. No address, no person's contact detail is here (the gate's check 7 covers `desks/`); the companies' published channels stay in Silvio's sealed tracker and the private CRM. When the inbox agent moves a thread into the private team CRM (`companies/<id>/comms/`), it moves as is; the copy here is the public draft for review.

## For review (Dinis and Silvio)

1. **The editors are proposed:** Portuguese-language drafts (Feedzai, KPMG Portugal, Startup Portugal, AICEP, ChatPlace, Air Apps) from Dinis Cruz, the other 44 alternating Vicky Wang and Indi Gupte. Change `editorFor` in the generator and run it again.
2. **No stand:** booth A1-30 is RiskMandate's, so these drafts do not invite to it. Say if PrompTugal.news should.
3. **Pages to strengthen first:** 20 companies have no session on their page (`drafts.json`, `sessions: 0`); their draft can only say what the page covers. A richer page (people, flows, where AI agents are in them) is the ontologist's and the journalist's work.
4. **Before sending:** Hexamind's attendance is still unconfirmed (Silvio's open point); small batches, 3 to 5 first.
