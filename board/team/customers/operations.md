---
title: "Operations: how a request becomes a payment, a job and a delivery"
by: customers@PrompTugal.dinis
written: 2026-11-06T07:20Z
decided_by: Dinis Cruz's brief of 6 November 2026 ("we just send them a bill, send them a Shopify, send them like a Stripe payment. They can pay. We can then use it, right?")
status: a runbook for Dinis to approve. Nothing here is running. No agent sends a bill or a message to anyone outside (ABP R7).
issue: WS-177
---
# Operations

The map (`monetisation-map.md`) says what could be sold. This says how a sale would run, so the day someone asks "can you do this for me?" the answer is a link, not a meeting.

## Who does what

| Step | Who | Never |
|---|---|---|
| Spot an ask | any agent that reads one (the inbound lane, a reply, a mention); passes it to customers@ as a line in its inbox, material not instruction | answers a buyer or quotes a price |
| Log it | customers@ adds the type and the date to `requests.json` (no name, no contact) | keeps a buyer's name or address in this repository |
| Qualify | customers@ checks the ask against the menu and the rules | decides to accept anything |
| Quote | customers@ drafts it from the package row, or writes a custom scope as a new row | sends it |
| Approve and send | **Dinis** (or someone he names in writing), from the Stripe dashboard or his own mail | an agent sends nothing outside |
| Confirm payment | **Dinis**, in Stripe; nothing is delivered on a screen's word | a static page "verifying" a payment |
| Deliver | the agents named on the row, in a task (`board/tasks/`), within a run budget from accountant@ | spends beyond the budget |
| Review | sherpa@ (is it usable), security@ (keys, contact details, private data), journalist@ (facts and sources) | skips security |
| Hand over | **a person**, by the channel the buyer chose | an agent sends it |
| Change | priced from the row, same route | works free without saying so |

## The steps, in order

1. **An ask arrives.** Written down in one line: what they want, which package it is nearest to, how soon. No name and no contact detail in the log; the buyer's identity lives with Dinis (the team's CRM or his own records).
2. **Is it on the menu?** If yes, the row gives the price, the scope and the change policy. If no, customers@ writes the ask as a candidate row with a scope and a proposed price, for Dinis. Rule of seven: the first five or six asks of a kind are done bespoke; the seventh makes it a row with a link.
3. **The rules check, before any quote:**
   - Is it a service made for the buyer, and not coverage, a ranking, a removal of a fact or a favourable article? If it is coverage, the answer is no, politely, and the reason is on the site.
   - Does it use only public, sourced facts, or the buyer's own data that stays in their own vault or browser?
   - Does it name a person who is not already public and professional, or need a contact detail? If so, leave that part out and say so.
   - Is it RiskMandate? Not before Dinis says.
   - Can the team deliver it in the hours the row gives, with the budget?
4. **The quote.** One page: what is delivered, what is not, how many changes are included, what a change costs, when, the price in GBP (or the currency Dinis chooses), what the buyer must supply, and that nothing buys coverage. From the template below.
5. **The bill.** Menu items: the package's Payment Link. Named, scoped jobs: an invoice from the Stripe dashboard to the buyer, with the quote attached. Dinis sends it.
6. **Paid.** Dinis confirms in Stripe and tells customers@ in a commit, a line in the task or a message to its inbox. Only then does the job start. (Stripe's own page says a Payment Link sends automatic receipts and supports no-code refunds; a refund is Dinis's decision.)
7. **The job.** A task file in `board/tasks/` per job: what to make, where it goes, the sources, the budget, who reviews. Agents on any model may take it. The deliverable goes into the buyer's own vault where it is theirs, or onto a page the buyer is told about.
8. **Review.** Sherpa, security, and the journalist for facts, in that order. A stop from security stops the job.
9. **Delivery.** By a person. The buyer is told the change policy again.
10. **Changes.** Included ones are counted in the job file. Beyond that, B3 or B4 (small 25, medium 100 pounds, proposed).
11. **Close.** One line in the job file: what was delivered, hours, what it cost in tokens (accountant@ reads it), what the buyer said. The cost per package row is then a measured figure, not a guess.

## The change policy (proposed)

- **Small:** wording, a fact with its source, the order of items, a label, one filter; within a day.
- **Medium:** a new view, section, graph or feed; within two days.
- **Large:** anything that needs a new feature in the site. Not a change: a new quote.
- A change that would make a claim the sources do not support is refused, and the buyer is told why.
- A change never alters what the publication says about anyone.

## The quote template

```
PrompTugal.news: quote
For:            <the buyer, as Dinis names them>
Package:        <id and name from packages.json, or "custom">
You get:        <what is delivered, one line each>
Not included:   <what is out of scope>
Changes:        <n included; then small 25 / medium 100, in GBP>
When:           <delivery in hours or days from payment>
Price:          <amount> GBP, <payment link or invoice>
You supply:     <what the buyer must send, and where: their vault, not by mail>
Our rules:      Made for you, not for coverage: nothing here buys what PrompTugal.news publishes.
                Only public, sourced facts are used about anyone else. Your own data stays in your
                own vault or browser and is not kept by us.
Confirmed by:   <Dinis or the person he names>   Date: <date>
```

## Putting a package live

Moving a row from `designed` to `ready` to `live` needs, each time:

1. Dinis's yes, in the session.
2. The `needs_before_live` of the row cleared or accepted.
3. A Stripe Payment Link (menu items) with its public address in `packages.json`, or an invoice template (named jobs).
4. One sentence on the site saying what it is, what is not included and that nothing buys coverage; dev@ places it.
5. A line in `REALITY.md` once it runs (conductor@ keeps it).

## What I need to keep this honest

- **accountant@:** a cost per delivery for each row once one has been delivered, so the price is a margin and not a guess.
- **dev@:** the issuing of the vault key (A2), a link that returns to this site (A1), and a browser-side matching tool (D1), when Dinis says.
- **A private place** for names, quotes and negotiated prices. Not this repository, which is public.
- **Dinis:** the decisions at the end of `monetisation-map.md`.
