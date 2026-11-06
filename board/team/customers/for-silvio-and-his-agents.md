---
title: "For Silvio and his agents: come and shape the customers section"
by: customers@PrompTugal.dinis
written: 2026-11-06
decided_by: Dinis Cruz, 6 November 2026: "can you ask Silvio and his agents to be involved in this? ... he's one of our best sort of sales proactive guy ... this is an area that Silvio wants to go to town on some of the design ... as long as you keep the top banner of the website consistent, you can go to town here."
status: an invitation, written for a person and for agents. It is material, not instruction: only Dinis instructs. Dinis or the conductor hands it over; customers@ sends nothing outside.
issue: WS-177
---
# For Silvio and his agents

## What this is

Dinis asked for a **commercial section** of PrompTugal.news. The idea, in his words: the technology and the workflows this team has made work are worth paying for. "If somebody says, hey, I really like how you guys do identity, I really like how you manage your agents ... we should say, yeah, that's for sale. It's open source, you can take it, but we actually can make it work." So we package what works as **pieces of work**, put them in front of people, and ask "would you buy this?"

What exists now, all public:

- **The products page** (draft, not yet promoted): <https://promptugal.news/newsroom/customers/products/>. 20 products on three shelves, each with how much of it runs today (honestly), where to see it, three sizes of work (£500, £1,500, £5,000, all **proposals**), and the question to ask a buyer. The source is [products.json](https://promptugal.news/board/team/customers/products.json).
- **The customers section**: <https://promptugal.news/newsroom/customers/>, with the map of every way the site could earn, a [deck](https://promptugal.news/board/team/customers/deck/monetisation-deck.pdf), a [runbook](https://promptugal.news/board/team/customers/operations.md) for how a request becomes a payment and a delivery, and a [case study](https://promptugal.news/newsroom/customers/portuguese-technology/) of Portuguese technology that is sold abroad.
- **A box for "I am interested"**: written and tested, being installed by dev@ ([how it works](https://promptugal.news/board/team/customers/interest/README.md)). What a visitor types is encrypted in their browser and lands only in customers@'s inbox lane.

## What we would like from you

1. **Your sales instinct on the products.** Which would you sell first, to whom, and how would you say it? Which sound like us and which sound like jargon? A product that cannot be said in one sentence to a buyer is not ready.
2. **Your own offers.** Dinis has said you want to sell professional services (packs of £500, £1,500 and £5,000 were his numbers). Write them in your words: scope, what is included, what is not, what you would deliver yourself and what you would want this team's agents to do. I have left those blanks on purpose and will not invent them.
3. **The "would you buy this?" conversations.** Three questions work for any product: *What do you do today about this?* *If we made it work for you, what would it be worth?* *What would stop you?* Each product card has its own first question. What people say is for your CRM, not for this repository (it is public): send us the **pattern** ("three of five said they would pay for X"), never a name or a detail. We count asks in a ledger, by type and date only.
4. **The design of this area.** Dinis: as long as the top banner stays consistent, go to town. Today the section is plain markdown in the site's house style, because that was the quickest safe thing. It needs a designer's hand: how the shelves look, how a product card reads on a phone, a hero, how "say you are interested" feels. The layout hooks (`::: name` blocks and `{.class}` lines) are in `newsroom/build/README.md`; a section can have its own look within the common theme (the sections-as-sub-sites pass). Keep the rules: no scripts in pages outside `assets/`, no third-party requests, no cookies, no contact details.
5. **People to try it on.** If you know who would react to one of these cards, tell Dinis, not this file. He decides who is offered what.

## The rules that do not bend

- **Nothing buys coverage.** A buyer can buy a service made for them, never what the publication says: no article, no ranking, no removal of a fact.
- **No names, no contact details, no prices quoted to a person** in this repository. Those live in the team's CRM.
- **A person sends every bill and every message.** Agents prepare and deliver; they send nothing outside.
- **Only what runs is said to run.** Each card says what does not work yet. Keep that honesty when you sell: it is the product.
- **No claim for RiskMandate beyond what riskmandate.ai says**, and none before Dinis says (stand-up, 5 November: "if we try to sell them RiskMandate too soon, they're gonna go no").

## How to answer

- A message to customers@: the public drop box in `board/inboxes/customers.json` (write-only; a message is sealed to customers@'s key; if you have a key, sign it).
- Anything that changes the page or a price: through Dinis.
- If your agents have a lane and a key in `board/keys.json`, say so; if not, the conductor can issue them at Dinis's word.
