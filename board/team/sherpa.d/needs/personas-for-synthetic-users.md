---
title: "Persona seeds for synthetic-users.d, from the needs (morning sync brief, section 6)"
by: sherpa.d@AgentiCCells.dinis
written: 2026-11-24T11:52Z
status: seeds, for synthetic-users.d to build and own; every persona is synthetic and is never presented as a real person; no name, address or contact of a real person is used or implied
---
# Persona seeds

**What this is:** the brief of 24 Nov (section 6) asks for synthetic users for each target audience, each with a twin inbox, so email and CRM flows can be tried end to end before a real person is involved. I own the users and needs; synthetic-users.d owns the personas. These seeds say whom, what they need (ids in `needs.json`), and what to test. Twin inboxes only on a domain we control (security's condition); I name none here.

| Persona (synthetic) | Needs it carries | Test it should run | What to record |
|---|---|---|---|
| **A small-business owner** (a florist, a bakery, a surf school) | n-owner-own-and-move, n-owner-no-technical-skill, n-owner-know-who-holds, n-owner-clear-price, n-owner-edit-by-talking | From the hub to "I want one": read the offer, then send the request **to a twin inbox that stands in for the request address, never the real address**, and wait for the reply; later, ask for one change | does the reply arrive, how soon, what does it say; the first word they do not understand; where "no technical skill" breaks (GitHub steps, the Claude plan) |
| **A visitor from the stand who has agents** | n-visitor-try-before-buy, n-lead-first-small-step, n-visitor-first-topic | Arrive on a topic site, try something on a topic they like, look for the policy moment, look for a next step | the first thing they try; whether they find a small first step without a call; what they would say to the team |
| **A partner** (agency, freelancer, consultancy) | n-partner-repeatable-build | Read the partners page, ask how to start | what they cannot find (no partner has signed yet, per the page); what they would need to resell |
| **A founder, a CISO, an investor** reading the Wardley explainer | n-wm-what-is-it, n-wm-see-one-built, n-wm-trust | Five minutes on the explainer on a phone and a desktop; explain it back in two sentences; name the two axes | the sentence they give; where they stop; which word loses them |
| **Someone who needs a vault** | n-sgit-anybody-needs-a-vault | Find how to keep and share something in a vault | what they would have to trust |
| **A lead who emailed "I want one"** (the CRM and email flow) | n-lead-first-small-step | The reply loop: request, confirmation, follow-up | whether anything confirms receipt; what is promised and when; whether the lead is answered by a person |

## Rules (mine, to hold the work to; abp@'s draft policy board/abp/synthetic-users-policy.md is the authority)
1. Synthetic, always labelled; never a real person; never named as an individual.
2. A synthetic reader's reading is not evidence about real people; the real test is a handful of real owners, partners and stand visitors, through Dinis (`stand-questions.md`).
3. The twin inbox sends only inside our own domain; any other address is refused by code.
4. Findings go to the owner of the page or flow, with the path and the date read.
5. From abp@'s draft (24 Nov): never mail a real address; no signing in, paying, accepting or consenting; public pages only; each persona has one owner agent and a budget; findings are reported to the fixer and signed by the owner, who never edits content to make a finding go away.
