---
title: "The payment desk that could not take payment"
date: 2026-11-17
author: conductor@PrompTugal.dinis
type: opinion
provenance_origin: dictated
provenance_research: author
provenance_level: P1
summary: "Paying a utility bill at a service desk took two clerks, two systems and a card network that accepts only one kind of card. Dinis Cruz's argument: AI's real impact on business is in these small failures, in finding them and in driving the change to fix them, while the payment itself should stay plain, auditable code."
status: published
region: portugal
license: https://creativecommons.org/licenses/by/4.0/
tags: AI, business, technical debt, payments, change, opinion
---
## In short

- Dinis Cruz, PrompTugal.news's operator, went to a service desk in Portugal on 17 November 2026 to pay a utility bill. It took two clerks: the first could find the bill but her system could not take the payment; the second one's system "kind of" worked. Only Multibanco cards were accepted.
- None of this is about one company or one country. The same small failures happen in England, and everywhere else.
- His argument: when people talk about AI and business, they talk about replacing people and systems. **The real gains are in the little things**: the desk that fails, the hand-over nobody records, the card nobody can use.
- **AI to find the problems and drive the change; plain, auditable code for the money.**

![Paying one bill, in four small failures: the invoice works; the first clerk's system cannot take payment; the second clerk's half works; only Multibanco cards. The one job that must always work: read the invoice number, take the money. Code for the payment, AI for everything around it.](https://promptugal.news/board/briefs/2026-11-17-the-payment-desk/img/the-payment-desk.svg)

## Four small failures

**The invoice.** It carries everything needed to pay it: who is owed, how much, and a reference. In Portugal a bill like this can usually also be paid at any Multibanco terminal or in home banking with an entity number, a reference and the amount.

**The first clerk** found the bill, then could not take the payment: something in her system did not work. "You could argue that it's one of the most fundamental things that you should be able to [do] as a system," Dinis says.

**The second clerk** typed the same number in again. Her system was "kind of working". Hardware fails, and things break. The question is what happens next: "Who's clocking this?" A machine that works if you shake it, a screen that fails every few days, a hand-over between two desks: each is a signal, and a source of data, if anyone records it.

**The card.** The desk took only Multibanco cards: no Visa, no Mastercard, nothing from outside the Portuguese network. Multibanco itself is a quietly impressive system: the same network lets you pay bills, the State and phone top-ups from a cash machine, "almost like a mini website", which the UK does not have. But refusing every other card is technical debt, or a cost decision, and either way it is bad service for anyone with a foreign card.

## The minimum viable desk

If most people who walk into that office come to pay an invoice, then taking that payment is the one job that must keep working even with the rest of the system on fire. Read the invoice number, take the money, reconcile later if the link is down. Everything else can wait; that cannot.

This is the idea of a minimum viable company, or a minimum viable system: know the few things that must never fail, and make them never fail.

## Code for the money, AI for the change

Dinis is clear about where AI does not belong. "You want code that is reliable, that is auditable, that we can check, that we can verify for this mission critical stuff. You shouldn't be using AI for that."

Where it belongs is everything around it: noticing that a desk fails every week, mapping who has to agree to fix it, what it costs, what it breaks, and following it up until it is done. "What you should be using is AI to figure out everything that is needed to get this decision done." Driving change in an organisation is hard, and should be, because there are many moving parts. That is exactly why it is a good place for AI: it maps the parts.

## Agents with wallets

He also rejects the idea that people will not trust agents with money. "We will give agents money, absolutely. We'll give agents wallet, absolutely, as soon as we trust it." An agent with a 10, 50 or 100 pound budget, able to create a single-use card for one payment, "that would be way more secure than what I have now". The payment itself, again, is just code underneath: what the agent removes is the friction around it.

## One by one

This newsroom is built the same way: a small problem at a time, each fixed, recorded and checked. The interesting work is not the grand replacement. It is the queue at the desk, the second clerk, and the card that does not work.

## Sources

- Dinis Cruz's account of paying a utility bill at a service desk in Portugal, 17 November 2026 (the company is not named: the point is not about one company).
- Paying a bill by Multibanco with an entity, a reference and the amount, at any Multibanco terminal or in home banking (Santander Portugal, read 17 November 2026): https://www.santander.pt/empresas/tesouraria/pagamentos-cobrancas/pagamento-servicos
- What else the Multibanco network does, from service payments to payments to the State (SIBS, MULTIBANCO API Market, 2019): https://www.sibs.com/wp-content/uploads/sites/13/2019/11/2019-11-22_API-Market_MULTIBANCO.pdf
