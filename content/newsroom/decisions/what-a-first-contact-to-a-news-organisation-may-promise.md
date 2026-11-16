---
title: "For Dinis: what may a first email to a news organisation promise?"
summary: "Dinis asked for first contacts to every local news organisation and journalist: scale journalism, make it pay. The draft template is ready; what it may promise (feeds, an agentic desk, credit and readers, a share of the meter) is his. Four ways to word it, what each does well and badly, and what has to be live before a person sends."
decision: open
asked_by: outreach@PrompTugal.dinis
asked_of: Dinis Cruz
since: 2026-11-16T19:40Z
blocks: "Every first contact to an outlet or a journalist. Outreach@ drafts only; a person sends, and not before this is answered."
answer: null
answered_at: null
---
## In short {#short}

Dinis, 16 November 2026: start reaching out to news organisations and embrace journalists, "not replacing journalism, scaling journalism and making journalism pay". The format (`desks/outreach/media/FORMAT.md`) and the template (`desks/outreach/media/template.md`) are ready. What an email may promise is Dinis's alone (CLAUDE.md, "Decisions are pages"), so no draft goes to a person to send until he answers.

## What exists today, so the email cannot promise more {#known}

Read from `REALITY.md`, `data/billing/prices.json` and the build on 16 November 2026:

- **The meter** (`api/v1/billing/meter.json`, generated from `data/billing/prices.json`) prices a reader's use of each kind of page. It does not yet record what a source would earn; the "wallet" in Dinis's brief is not built.
- **Per-place and per-topic feeds** and **the outlet pages** (`/media/<id>/`): not in `REALITY.md`. media.map (researcher@, local@) and dev.places@ are only starting them.
- **`/contribute/`** exists as a page since 9 November (`board/spec-contribute-page.md`), with its own conditions (open source, the author owns the work, we review and publish what is good, no payment for now). An email that invites a journalist to write for a town must say the last of those.
- **No outlet has been mapped yet** and no journalist is listed. Every draft waits on its outlet record and on a contact the outlet publishes.

## The options {#options}

**Option A: only what is live.** The email says what the page is, links the outlet first, says we do not copy text, and asks them to correct the page. It offers feeds, a desk, the meter and writing for a town only once each is live, and only those. Nothing about money.

**Option B: live offers plus the intent in one honest line.** As A, and one line: "we want to share what our meter counts for your work with you; we have not built that yet, and we will tell you its terms before it exists." No amount, no date.

**Option C: the full offer in Dinis's words.** Feeds, an agentic desk, credit and readers, and "in time a share of what the meter counts" as an offer, with the meter's page as the only price source. The wording is the template's; the money line promises the principle, not an amount.

**Option D: no money in a first contact.** The first email is a request to check the page and a thank-you link. Feeds, a desk and money come in the second email after a reply.

## For each option {#weigh}

| | Does well | Does badly |
|---|---|---|
| A | Cannot be wrong; every line checkable; the quickest to ship | Says nothing of the thing that makes this different (making journalism pay); an editor may read it as one more aggregator |
| B | Honest about the gap; keeps the principle; a journalist remembers it and can quote it back | An editor can hold us to "we will tell you the terms"; it promises a future thing that is Dinis's to settle |
| C | Closest to what Dinis asked; strongest first line for a local editor | Promises a share of money before the wallet is built or any amount is set; if the meter changes, the email is on record; outlets may ask for the terms in the first reply |
| D | Smallest ask, the highest reply rate on a cold email, nothing to retract | Slower; the second email needs another person to send; the pay line arrives after trust, which some outlets will read as late |

## Reviews {#reviews}

None asked yet. They are invited here: sherpa@ (is it one clear thing to an editor?), synthetic@ (a local editor and a regional-paper journalist as readers), security@ (no contact detail in a draft; the channel is the outlet's own page).

## The recommendation {#recommendation}

**B, in the order of the template:** page first, correct us, then the offers that are live at the moment a person sends, then the one honest money line. It is the one option that carries Dinis's principle (journalism must pay) without a number or a date he has not set. Each offer is checked live by the draft (`offers_checked`) and dropped when it is not, so the email never promises a thing that does not yet exist. If Dinis wants C, the template already holds it: the `meter` clause changes from "we will tell you its terms" to the principle, nothing else.

## What follows each answer {#follows}

| If Dinis says | outreach@ does next |
|---|---|
| A, B, C or D | Rewrites the template's money and offer clauses to it, drafts a first batch of three outlets (the Algarve's, from local@'s records, then researcher@'s), each with its page as the first line; a person reviews and sends. |
| "Say it your way" | B, as recommended. |

## Questions that are his alone {#asks}

1. Which option for the first email (A to D)?
2. Who sends, from which address, for the Algarve outlets (Jose's team) and for the nationals (the comms protocol keeps private details on the Web Summit side)?
3. May the email say PrompTugal.news is published by My Feeds (the investors decision of 7 November), or should it say nothing of the company?
4. Does a journalist, who is not the outlet, get the same email or a shorter one addressed through the outlet's published newsroom channel?

---
*Drafted by outreach@PrompTugal.dinis, an AI agent, on 16 November 2026. Sources: `REALITY.md`, `data/billing/prices.json`, `board/guidance/2026-11-16-positioning-collaborators-local-media-paid.md`, `board/spec-contribute-page.md`, `content/newsroom/decisions/promptugal-for-investors.md`.*
