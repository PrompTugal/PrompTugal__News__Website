---
title: "Brief 6: the RiskMandate agent iPad (Dinis, 8 November 2026, about 13:35 UTC, relayed by conductor.b@ in memo 2)"
by: customers@PrompTugal.dinis (account B session session_01Kw9UwByCpfEYBvX2htoDEB)
written: 2026-11-08T14:10Z
page: content/newsroom/decisions/the-riskmandate-agent-ipad.md (/newsroom/decisions/the-riskmandate-agent-ipad/), a "For Dinis" decision
issue: WS-177
---
# Brief 6: the RiskMandate agent iPad

**Dinis's words** are in memo 2 (`board/team/conductor.b/memos/2026-11-08-the-riskmandate-agent-ipad.md`), quoted on the page. conductor.b@ relayed the brief on a session message at 13:36 UTC; the memo is its commit on dev (438508c8).

## What I did

- Wrote the decision page: the proposition, the box, the value, the buyers, four offers (A kit about 1,500; B kit about 2,000; C bring your own iPad; D kit plus service), how it is bought, five checks, a recommendation (C now, A after the checks, D later).
- Read the sources myself or through three web-fetch sub-agents (read-only): riskmandate.ai (home, pricing, about, ABP); Apple's Media Services Terms (UK) and the Apple Business user guide (Managed Apple Accounts, sign-up, release, enrolment); Apple's UK buy pages for prices (read with curl from the pages' own price data, 13:50 UTC).

## What I could not check (said on the page)

- Apple's iPad warranty text (the page loads by script): whether it passes to a buyer and where it holds.
- The "Service access with Managed Apple Accounts" page (limits on purchases and iCloud for a managed account).
- VAT and customs for a UK-bought device handed over in Portugal: for Dinis and an accountant, not stated.
- The prices are the lowest on each buy page; re-check before any quote.

## Findings that change the idea

1. A personal Apple Account for an agent is not what Apple's terms describe (a person aged 13 or more, personal, non-commercial use). Apple's route for organisations is Apple Business, with a Managed Apple Account or none for a dedicated-use device.
2. A device released from one organisation's Apple Business must be erased and restored, so "set up and hand over" either means we keep managing it or the set-up is done again in the buyer's organisation.
3. Offer B at 2,000 is below RiskMandate's own published 1,500 level plus an iPad Air at list price (2,249), and riskmandate.ai says "one price" and "no subscription".
4. riskmandate.ai says nothing about devices today: a device product needs a line there first.

## Routed

- conductor.b@: told on its inbox that the page is up.
- investors@: the business case (cost, margin) when it is next on; the page's numbers are list prices only.
- The iPads themselves: Dinis and the iOS team.

## Update, 14:20 UTC: memo 3, two products

Dinis (about 13:55, relayed by conductor.b@ in memo 3, `board/team/conductor.b/memos/2026-11-08-two-appliances-and-the-field-reporter.md`) sharpened memo 2 into two products of about 1,500 each: the **RiskMandate Appliance** (an isolated iPad holding one RiskMandate environment's data; the RiskMandate app in appliance mode; maybe a local model) and the **PrompTugal Field Reporter** (a field journalist's production device; the PrompTugal app; optional extras; sold to newsrooms equipping staff; Indi and Vicky first). The device's Apple account is the agent's own Google Workspace account, held by a person.

The page (same URL) now carries both: a side-by-side table; for each, the box, the value, the buyers and price bands (R1 to R3, F1 to F3, proposals); what both share (the account, the boxes, how bought); six checks; and a new recommendation: **pre-orders for both, used by the team first**, since neither appliance mode nor the production workflow exists yet.

What memo 3 changes in my findings: the Google Workspace account can become a Managed Apple Account by federated authentication (Apple Business guide), which is Apple's route for this; offers A to D of the first draft are replaced by R1 to R3 and F1 to F3.
