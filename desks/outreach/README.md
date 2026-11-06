# The outreach desk: drafts to companies as PrompTugal.news

Kept by outreach (PrompTugal.dinis), from 6 November 2026 (WS-177, item 5). **Drafts only: an agent never sends an email or posts.** A person sends each one, from their own promptugal.news address once Dinis creates it.

## What changed from Silvio's drafts

Silvio's 50 emails (`people/silvio/outreach/messages.json` on the team site, WS-26) led with RiskMandate and a stand visit. These lead with the company's own page on PrompTugal.news, as Dinis asked (5 November): *"if we go to them with information about the company, information about the flows ... it makes a massive difference."* RiskMandate appears only in one line after the signature, in the words of the participant disclosure, with the link to `/about/participant.html`.

Each draft (revised 6 November, 01:00 UTC, after synthetic@PrompTugal.dinis's run 1, `desks/synthetic/run-1/to/outreach.md`): the page link first; one line true to the page (the company's first session at the summit, or the topic the page files it under); for a company, the page's empty flows section (how work moves through its product and where AI agents act in it) as the reason to reply; what PrompTugal.news is (to map the universe of AI in Portugal; every fact sourced and dated; corrections welcome); one ask by kind of organisation (a company: the page's three questions, reach, mandate and gap, in two written lines or 15 minutes; a public body or foundation: what it sees in AI coming to Portugal and Europe; since 6 November, 14:00 UTC, no longer varied by the team's ranking, which is private); that answering is optional and that a conversation need not be published; the editor's name; the line that an AI agent drafted it and the soft opt-out. The Portuguese drafts say the page is in English for now. Two short follow-ups (9 and 11 November) sit in each draft's card. Portuguese-language companies get Portuguese and English.

Revised again at 02:00 UTC after synthetic@'s run 2 (`desks/synthetic/run-2/to/outreach.md`): the newsroom's "aim", not its "mandate", so it does not blur with RiskMandate's; "powered by RiskMandate" in the signature replaced by that disclosure line; two lines in writing offered as well as a call; "the European Commission", "the National Cyber Security Centre", "the Linux Foundation" in running text; the EML in CRLF throughout (the body had LF line ends inside a CRLF message, which may be why run 2's reader saw no greeting: every draft opens with one).

Revised at 03:00 UTC after synthetic@'s run 3 (`desks/synthetic/run-3/to/outreach.md`) and the first mapped flows: the disclosure line now says what `/about/participant.html` says, in its words (not independent coverage; we may write about companies the team hopes to meet or sell to), so the email no longer understates it; a company whose page maps its flows (`data/companies/<id>/flows.json`; so far 1Password) is asked whether the mapping is right instead of told the section is empty; a published article that links the company is cited after the hook (so far Startup Portugal, Road 2 Web Summit).

## Where it is

| What | Where |
|---|---|
| The 50 companies and their language (the ranking, priority and kind of ask live in the private CRM, at Dinis's word, S4) | `targets.json` |
| The index: company, editor (proposed), page, languages, sessions used | `drafts.json` |
| One thread per company, in the team CRM's comms shape (the team site's `/articles/one-place-for-every-conversation.html`) | `companies/<id>/comms/2026-11-06-promptugal-page/`: `thread.json`, the draft as `.eml` and its card `.json` (sha256 of the EML) |
| The generator (no dependencies; reads `targets.json`, `data/companies/`, `data/events/`) | `node desks/outreach/make-drafts.mjs` from the repository root |

The EML has no From or To: the sender's mail program fills them. No address, no person's contact detail is here (the gate's check 7 covers `desks/`); the companies' published channels stay in Silvio's sealed tracker and the private CRM. **Everything here is public, and this desk has no access to the private team CRM, by design** (Dinis, 6 November 2026: "the private CRM happens on the other side"). The threads keep the CRM's comms shape so that the other side can take a reviewed draft as is; what is sent, replies and contacts live only there.

## For review (Dinis and Silvio)

1. **Who sends which company:** for Dinis, as a page: `content/newsroom/decisions/who-sends-which-company.md` (https://promptugal.news/newsroom/decisions/who-sends-which-company/).
2. **What the email promises:** it says answering is optional and that "if you would rather talk than publish, we can just talk". synthetic@'s founder persona would also want to hear that she approves her words before they go up and that an answer is not used for sales; the drafts say neither until Dinis says they are true.
3. **No stand:** booth A1-30 is RiskMandate's, so these drafts do not invite to it. Say if PrompTugal.news should.
4. **Pages to strengthen first:** 20 companies have no session on their page (`drafts.json`, `sessions: 0`); their draft can only say what the page covers. A richer page (people, flows, where AI agents are in them) is the ontologist's and the journalist's work.
5. **Before sending:** Hexamind's attendance is still unconfirmed (Silvio's open point); small batches, 3 to 5 first.
