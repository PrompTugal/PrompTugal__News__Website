---
title: "The monetisation map: what PrompTugal.news could sell, to whom, and how it would run"
by: customers@PrompTugal.dinis
written: 2026-11-06T07:00Z
decided_by: Dinis Cruz, his brief of 6 November 2026 (his words quoted below)
status: a map for Dinis to decide on. Only the 5 pound reading top-up is on sale. Every other price is a proposal.
issue: WS-177
data: board/team/customers/packages.json (the register this file is written from)
---
# The monetisation map

## What Dinis asked for

Dinis, 6 November 2026: map "the multiple types of monetization angles that we have", "prepare for us to be able to sell to people that are interested", have it "in our back pocket" and "only put live if needed". The pieces he named:

1. The same thing as the other site: pay the 5 pound top-up.
2. A token that buys vaults: "we'll just sell a monthly ticket ... you can create as many vaults as you want for a month", with the price started small and raised "to see how much the market goes".
3. Customised work: "for 50 quid or 500 quid ... we'll create a customized schedule for somebody", the Brazil work as the example; "maybe we start charging per change".
4. The rule of seven: "we do it for 5 or 6. And then if we have the 7 asking, we just have ... a sale". A sale during the summit, and post-summit follow-ups.
5. Professional services packs "for 500 quid or 1500 quid or even 5k", which the team's partners also want to sell; the agentic workflows "are worth somebody paying for it".
6. When someone asks "can you do this for me?", "we just send them a bill ... a Stripe payment". The sales cycle: see something we did, ask for more or for a feature, and "you pay for it".

This file maps all of that, says what exists and what does not, and puts the decisions that are Dinis's at the end. The deck is `deck/monetisation-deck.pdf`, the register is `packages.json`, how an order runs is `operations.md`.

## The one-line version

**People see something we made, ask for more, and pay for a made-to-order version of it; a few things sell themselves.** Five families and a set-aside list: 23 rows in the register, 19 of them things to sell and 4 set aside on principle. **One is on sale** (the reading top-up). The nearest to ready are the vault month and the personal schedule.

| Family | What | On sale? |
|---|---|---|
| A. Readers pay | 5 pound reading top-up; the vault month; bigger top-ups | the top-up only |
| B. Made for you | personal schedule (50), delegation schedule (500), changes (25, 100), a graph (250) | no |
| C. Professional services | Starter 500, Team 1,500, Build 5,000; a workshop | no |
| D. Data you can use | match your own list to the graph (250) | no |
| E. The days and after | summit brief (500), a QR at the door (5), post-summit pack (500), **a personal newsreel (25) and a slice for an investor, founder or company (250)**, a standing brief (750 a month) | no |
| X. Set aside | ads, paying for coverage, selling readers, a paywall | never, unless Dinis says |

## What we do now that people would pay for

Read from the repository on 6 November 2026 (counts from `data/`); what is there, not what is planned.

| What exists | Size today | Who it is worth something to | What it could sell as |
|---|---|---|---|
| Companies as sourced profiles (each fact with its source URL and date read, re-checked at the source) | 120 companies | a company, an investor, a sales or events team | D1, E1 |
| The programme as data: events, places, topics, people as the summit lists them | 226 events, 80 places, 17 topics, 249 people, 204 organisations | an attendee deciding where to be | B1, B2, E2 |
| The graph that connects them, and the articles written from it | 11 signed articles, 28 story candidates | a journalist, a delegation, a researcher | B2, E1, E3 |
| The Brazil story as a method: map the delegation, connect the companies, find the evidence, visualise, review | one story, being finished | any group that is "a delegation" | B2, C3 |
| Images and infographics, every word checked against its article | 61 files in `design/infographics/out/` | a company or a journalist with a story | B5 |
| Agents that run with written policies, budgets, a hold and a record | the role folders in `board/team/`, each with its policy | a company that wants to run agents the same way | C1 to C3, C4 |
| The reading meter and the vault | a meter that never blocks; a vault pane waiting for an access key | a reader who wants a plan and notes kept | A1, A2 |
| JSON for every page and a prompt for it | `/api/v1/`, llms.txt, a markdown twin per page | a person building their own view | A2, D1 |
| The method itself: multi-pass work, "map, evidence, visualise, review", signed output | the Passes, the book team's method (board/briefs/2026-11-06-what-the-book-team-did.md) | anyone who wants a book, a deck or a newsroom made | C3 |

**What adds the most value, and why (my reading, from Dinis's own words):**

- **The thing that shows a buyer their own world.** The 18:00 stand-up of 5 November: the signal is a company asking "can you add more stuff?" and not "what are you doing?" (board/guidance/2026-11-05-1800-the-stand-up.md, section 6). A page about them is the demonstration; the order follows.
- **Time-boxed relevance.** The meter itself says it: pages matter most in the days around the event (`data/billing/prices.json`, "decays because it matters most in the days around it"). A schedule is worth most on 8 November and little on 20 November. That is why E sells in the days and a standing brief later.
- **Judgement and checking, not data.** What we publish is public by design (public by default, a source for everything). Charging for it would fight the thing that makes the site worth reading. What can be sold is the work on top: the match, the schedule, the brief, the check, the change.
- **The method.** Dinis's own point: the agentic setup is "worth somebody paying for it, especially because they're going to now experience it". The site is the demonstration of the method; C sells the method.

## The rules every row follows

1. **Editorial and commercial stay apart.** A buyer can buy a service made for them. They can never buy what the publication says. No coverage, no ranking, no removal of a fact, no favourable article. (The editors decide what is published: content/riskmandate.md.) The page that offers anything says so in a sentence.
2. **No ads, no paywall, no selling readers.** Dinis: "We have no ads"; privacy first, "no selling of the user". The meter never blocks.
3. **A person takes the money and sends the bill.** An agent prepares the quote and the invoice draft; Dinis (or someone he names) sends it and confirms payment in Stripe. ABP R7: nothing is sent outside without a person.
4. **Public facts only, sourced.** A paid piece uses the same sourcing as an article. Nothing about a person that is not already public and professional; no contact details, ever. A buyer's own data stays in their own vault or browser and is not kept by us.
5. **Fixed scope, fixed price, a change policy.** Every package says what is included and what is not, and what a change costs, so a buyer never meets a surprise. (operations.md.)
6. **No claim for RiskMandate beyond what riskmandate.ai says.** And not before Dinis says: "If we try to sell them RiskMandate too soon, they're gonna go no" (stand-up, section 7). The Agent Behaviour Policy work is RiskMandate's to sell, not a row here.
7. **Say what is live.** The site says only what runs. This map is designed, not running, except the top-up.

## Family A: readers pay

**A1. The 5 pound reading top-up (live).** `data/billing/topup.json`: one payment of 5.00 GBP on Stripe's page; credit is kept in the reader's browser. Two things are open and are already in REALITY.md: the link is newsroom.sgit.ai's and returns there, and a static page cannot verify a payment, so the credit is a screen's word. Fine at 5 pounds, wrong for anything bigger. The meter's own rule applies: pages are priced by kind and freshness (an article 6, a briefing 5, a company profile 3, a reference page 1, never a block).

**A2. The vault month (proposal: 5 pounds per 30 days, to be raised).**
- *What the buyer gets:* the access key the vault server wants before it accepts a write (`data/billing/vault.json`: "Opening and reading a vault needs none; creating one, and updating it, does"). For 30 days they can create and update as many vaults as they like. When the month ends their vaults still open and read; only writing stops. That is a fair and honest edge, and it matches how the server works today.
- *Why a month and not per vault:* Dinis's call, and it fits: a person's schedule, notes and views are many small vaults, and counting them would be tedious for everyone.
- *The price ladder:* start small, raise as the market shows. The price is a setting in Stripe, so raising it needs no release. Decide beforehand whether early buyers keep their price (a "founding price") or not; a founding price costs little and buys goodwill.
- *What does not exist:* **the issuing of the key.** A static site cannot do it. There are two ways: (1) by hand first, Dinis or a person he names sees the payment in Stripe and sends the key, one at a time, fine for the first dozen; (2) a small function, called by a Stripe webhook, that asks the vault server for a token and shows it on the return page. (2) is a server component nobody has built; dev@ would own it, with Dinis's yes. I do not know whether the vault server's tokens can carry an expiry or a quota; the SG/Send team or Dinis can say. Until that is known, "30 days" is a promise a person keeps by hand.
- *Subscription or one-off:* a Stripe Payment Link can be a subscription, and the Stripe customer portal lets a buyer cancel, update a card and download invoices without writing to us (Stripe documentation, below). One-off 30-day tickets are simpler to explain; a subscription needs the portal switched on. Dinis's word was "ticket": I would start with the ticket.

**A3. Bigger top-ups and gifts (parked).** The same credit in steps of 20 and 50 pounds, for a team. Held back until a payment can be checked by something other than the reader's own screen.

## Family B: made for you

The pattern is one sentence: **a thing we already do for everyone, made for one person or group.**

| Package | Proposed price | What is in it | Change policy |
|---|---|---|---|
| B1 Your schedule | 50 | a personal plan for the summit days from the programme and the graph, as a page in their vault and a calendar file | three changes included |
| B2 Your delegation's schedule | 500 | the Brazil formula for a group of up to ten: per person and per group, a graph, the data as JSON | ten changes included |
| B3 A change, small | 25 | words, data, order or one view of something we made for them, in a day | per change |
| B4 A change, medium | 100 | a new view, section, graph or feed, in two days | per change |
| B5 A graph or infographic | 250 (1,000 for five, animated) | made from their data or public data, every word checked, with the data behind it | per change |

*The per-change idea, made concrete:* sell the thing once, then the changes. Changes are where the value shows ("they like it so much, they want changes"). A small change is cheap enough to say yes without thinking; a medium one is where the price should make a person pause. The bundles above include a few changes so the first sale is not nickel-and-dimed.

*What is missing:* the personal-schedule pass (personas to graph to schedule) is the machinery for B1 and B2; until it exists a schedule is made by hand from the agenda. And the Brazil story has to be done for real before B2's price is a fact and not a hope.

## Family C: professional services packs

500, 1,500 and 5,000 pounds, as Dinis said. These are the packs the team's partners also want to sell, so the model is a shop window plus delivery: PrompTugal.news shows the work and takes the order, the named person or firm on each pack delivers it with this team's agents, a person signs it off.

| Pack | Price | In one line |
|---|---|---|
| C1 Starter | 500 | one workflow looked at, written down and running once, in a week |
| C2 Team | 1,500 | three workflows, or one to a team's standard, with the agents, their written policies, the review steps and a hand-over, in two weeks |
| C3 Build | 5,000 | a book, a deck or a small newsroom made by the multi-pass method, with a hand-over of how |
| C4 Workshop or talk | 1,500 a half day (parked) | the method in a room; a person's diary, not an agent job |

*What I did not do:* write the partners' own offers. Dinis named three partners who want to sell professional services; their scope, their rates and their promises are theirs to set down. I have left each pack as the shape and the price Dinis said, with "the partner named on the pack" as a blank to fill, and I have not put anyone's name on a public page.

*The question under C:* who contracts and who invoices. A Stripe invoice has one seller. Which legal entity that is (Dinis's, a company, a partner's) decides VAT, terms and liability. It is the first thing to settle before the first invoice and it is not mine to answer.

## Family D: data you can use

We publish public data, so we do not sell the data. D1 sells the **match**: the buyer's list of companies or attendees, matched to our graph, in their own browser or vault so we never hold their list. It is parked until a browser-side matching tool exists.

## Family E: the summit days and after

| Package | Price | When it sells |
|---|---|---|
| E1 Summit brief for a company or an investor | 500 | now to 12 November; "Hey, look, I got a service for you" (stand-up) |
| E2 On the days: a QR at the door | 5 | 9 to 12 November: the business cards already carry a QR; a stranger pays 5 pounds and has a plan |
| E3 Post-summit follow-up pack | 500 | 13 to 30 November |
| E4 A standing brief, monthly | 750 a month (parked) | after the summit, if anyone asks |
| E5 Your newsreel: a personal debrief of what happened, with the videos worth watching | 25 (a guess) | 9 November onward; the idea of 6 November, see below |
| E6 A slice for an investor, a founder or a company | 250, or 500 for a company (guesses) | 13 November onward |

### E5 and E6: the personal newsreel (added later on 6 November)

Dinis's idea: a calendar and a **personalised newsreel** for anyone, at the summit or not: the core ideas of what happened in their slice, the videos they can watch, a debrief, from "every single thing that has been published about the summit", and delivered to a vault sealed to the buyer's key. His question, "how much would this be worth? Would somebody pay?", is open: the prices above are guesses, and the brief sets three cheap tests (the ask, a pay-what-you-want link, a free first day) to find out. The honest risk is that the organiser already publishes its own summaries and Centre Stage video; the product is the personal slice, the cross-source map and the sealed delivery, and the test says whether that is worth anything. The full brief, with the sources I checked, the source rules (public, no login, link and cite, a post is a person, click-to-load embeds) and who does what, is `briefs/2026-11-06-the-personal-newsreel.md`; it is for the conductor to route.

## What is set aside, and why

- **Advertising and sponsored placements.** The newsletter market is real (benchmarks below), but Dinis said it plainly, "we have no ads", and a buyer beside our judgement on every page would undo what the publication is for. Reopen on Dinis's word only.
- **Paying for coverage, a ranking or the removal of a fact.** Never. This is the line that lets everything else exist.
- **Selling who reads what.** Privacy first.
- **A paywall.** The meter never blocks.

## How it runs: "we just send them a bill"

The full runbook is `operations.md`. The shape:

```
 an ask ──▶ is it on the menu? ──▶ a quote ──▶ Dinis sends the Stripe link or invoice ──▶ paid? ──▶ the job ──▶ review ──▶ delivered ──▶ changes priced
 (inbound   (a package row,        (customers@  (a person; an agent never sends)         (Dinis    (agents,    (sherpa,    (a person
  lane, a    or a custom scope      drafts it                                              sees it   a person    security,   hands it
  message)   written as a row)      from the row)                                          in Stripe) checks)    journalist) over)
```

**Stripe, as its own documentation says (read 6 November 2026):** a Payment Link is a reusable link anyone can pay through; it can be a one-time product, a subscription, a "customer chooses what to pay", or have an adjustable quantity; it sends receipts and refunds without code. An **invoice** is for one named customer, can start from a quote, can take part payments, and can be shared as a link or emailed from the Dashboard. So: **menu items get Payment Links** (A, B1, B3, B4, E1 to E3), **named, scoped jobs get an invoice** (B2, B5, C1 to C3, C4). A Payment Link's address is public by design and may sit in `packages.json`; a Stripe key, a webhook secret or a customer detail never does.

**The first five or six are bespoke; the seventh is a package.** A log of requests (`requests.json`, the type and the date, no name and no contact) counts the asks. On the seventh ask for the same thing it is promoted to a row, with a link, and a sentence on the site. This is Dinis's rule and the register is its ledger.

## Benchmarks (directional only)

These are anchors for the proposals above, not authority. Most come from vendors with an interest in the number. I opened Stripe's page; the rest I read as search summaries and did not open the pages, and I say so. Read 6 November 2026.

| Anchor | What it says | Source |
|---|---|---|
| Stripe Payment Links | reusable links; subscriptions; customer-chooses-price; adjustable quantity; receipts; refunds without code | https://docs.stripe.com/payment-links |
| Stripe customer portal | no-code; buyers cancel, change card, download invoices; works with Payment Links | https://docs.stripe.com/customer-management |
| Stripe no-code subscriptions | subscription links and invoices without code | https://docs.stripe.com/no-code/subscriptions |
| AI consultant day rates, UK | job-board median for an AI consultant contract in the City of London about 662 pounds a day (6 months to 8 February 2026); vendor sites give 600 to 1,200 for a generalist and 800 to 1,200 for a senior; those are contract rates and understate a consultancy's price | https://www.itjobswatch.co.uk/contracts/city%20of%20london/artificial%20intelligence%20consultant.do |
| Fixed-scope AI work | one consultancy site lists projects at 3,000 to 25,000 pounds, monthly advisory at 750 to 3,000, executive workshops at 1,500 to 4,000; no method stated | https://whitehat-seo.co.uk/blog/ai-consulting-costs-roi |
| Tech newsletter sponsorship (why ads are set aside, not dismissed) | tech newsletters about 2,295 US dollars per sponsorship on one platform (April 2026); mid-sized lists 500 to 3,000 per placement | https://dupple.com/learn/newsletter-advertising-cost-2026 and https://www.beehiiv.com/blog/newsletter-sponsorship-cost |

What the benchmarks say about the proposals: C1 at 500 pounds is less than one day at the job-board median (662) and well under a senior day; it is priced as an entry, and it is cheap. C2 and C3 are well under the bottom of the "defined project" range quoted above, which is deliberate while the team has no track record; they can rise. None of this is evidence that anyone will pay: the rule of seven is the test.

## What needs Dinis

1. **Currency.** GBP, as the meter shows, or EUR for a Lisbon, European publication? (Sherpa asked the same.)
2. **Who is the seller.** Which entity receives the money and invoices (VAT, terms, liability).
3. **The vault month's key.** By hand first? Who sends it? Can the vault server's tokens expire? Is a small issuing function wanted, and from dev@?
4. **A Stripe link of our own for A1, and the others as they go live.** I prepare each as a row (price, text, return address); Dinis makes the link in Stripe and the address goes in `packages.json`. The existing link belongs to newsroom.sgit.ai's account and returns there.
5. **Which rows go live, and when.** My suggestion: A2 (by hand) and B1 first, as they are the smallest and Dinis's own; E1 the moment someone asks; the rest on the seventh ask.
6. **The partners' offers.** The three partners' own professional-services packs, in their words, for C.
7. **Where the private half lives.** This repository is public: the menu, the prices and the process are fine here. A buyer's name, a quote and a negotiated price are not. They belong in the team's CRM or a vault. I have none and will not make one; tell me where.
8. **Public or not.** The newsroom page I added shows the menu. Say the word and it comes down.
9. **A line on the participant disclosure** (`/about/participant.html`) saying that services are sold and that nothing buys coverage. It is not mine to write: dev@ or the journalist.
10. **The press pass.** Whether selling services affects becoming "a publication" in Portugal. I do not know; it deserves a look by whoever handles the application.
