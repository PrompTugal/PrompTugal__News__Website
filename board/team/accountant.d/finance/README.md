# Financial reporting for PrompTugal and the .d circles: first design (accountant.d, 22 Nov 2026)

Dinis, 22 Nov: "the beginning of financial reporting for all of the activities ... accounting reporting based on everything that we track, including all those billable units and pricing units ... start thinking about how we can create a P&L for just about everything ... then connect it to the data." Budgets stay monitoring, never enforced (his word, same day). This is a design and a first set of files; nothing here is audited, and no price below is mine to set.

## 1. What is real money, what is not

| Kind | Example | Counts as |
|---|---|---|
| Subscription capacity | account D's Claude seats and weekly limit | a fixed cost per period, consumed as a percent of the limit; **not** per token. API-equivalent dollars are a yardstick, never money paid |
| Pay-as-you-go | OpenRouter credit (capped at OpenRouter's end), audio and image models | real cost, per call; the only truly variable cost today |
| Revenue | the reader meter (GBP, pence per page; `data/billing/prices.json`), top-ups (`topup.json`, GBP 5 payment link), any sponsor or contract Dinis names | income, in GBP |
| Internal transfer price | what one circle "charges" another for work (an article, a page, a decision brief) | a pricing unit, no cash; lets each circle have a P&L |

Currency: GBP for the site (its meter), USD for API-equivalent and OpenRouter. A P&L states both and never adds them without a rate Dinis gives.

## 2. Billable and pricing units (to be defined; starting list, each with an owner)

Cost units (what an activity consumes, from `primitives.json`): API-equivalent USD, output tokens by model, cache read tokens, wakes, commits, pushes, OpenRouter USD, Dinis's decisions asked (his attention is the scarcest input; today unpriced).
Output units (what an activity makes): a page released, an article signed, a decision brief delivered, a site created, a design round, a briefing, a draft email.
Price per output unit: the meter's prices exist for reader pages (1p evidence and site pages, 2p assembled, 3p signed article or briefing). Prices for the others are open: they are Dinis's to set (money). Until he sets them, the P&L shows cost per unit and leaves price blank, so it never invents revenue.

## 3. The P&L shape

One statement per **entity**: an agent, a circle (SovereignWebsite, AgentiCCells, PrompTugal, sgit.ai), an account (B, D), a product (promptugal.news, the Decision Desk, the email cell), and the whole.

```
Revenue            reader meter + top-ups + contracts       (GBP, from the meter's records; none connected yet)
 + internal charges received (transfer price x units delivered)
Direct costs       OpenRouter and other pay-per-call        (USD)
                   subscription share: account cost x the entity's share of tokens (see below)
 + internal charges paid
= Margin
Memo (not in the margin)   API-equivalent USD, tokens by model, Dinis-attention (decisions waited)
```

Subscription share: an account's fixed cost is spread over entities by their share of the account's measured tokens (output and cache write weighted, cache read lightly), by period. Needs the account's price per period from Dinis. Without it the statement shows the share, not money.

## 4. The weekly limit

Dinis cannot be read programmatically (this session sees only the five-hour window), so he gives me the weekly percent by hand: `limits-ledger.json`. First reading: account D **51%** at 15:31 UTC on 22 Nov. With two readings and the tokens measured between them, I derive tokens and API-equivalent USD per percent, then forecast the day on which the limit is reached at the current rate. That turns "51%" into a plan: how many tokens a day the account can still spend, and by which model.

## 5. Tokens per day per model

First cut, `tokens-by-model-2026-11-22T1330Z.json` (lifetime of 18 sessions): Opus carries 96% of cost. A per-day figure needs a baseline reading; each reading from now on is a row, and the day's spend is the difference. Proposed rhythm: one reading each time maestro.d wakes (every 4 hours) and at 00:00 UTC.

## 6. Delegating to other places (the cheaper venue for each kind of work)

Candidate venues for work that does not need the dearest model: Sonnet instead of Opus inside the same account (Sonnet sessions here cost 2 to 4 USD against 20 to 47 for Opus ones); the other account with headroom (the capacity ledger); OpenRouter models, priced per call and capped at OpenRouter's end, for reviews, narration or bulk drafting (counsel.d's three-model review is the first use). For each kind of work the report will show cost per output unit by venue, so the choice is data. I only report; moving work is for the maestros and Dinis.

## 7. Connecting to the data (next steps, in order)

1. Daily reading: tokens by model per session (get_session), the limit percent (by hand), OpenRouter spend (read by Dinis from the activity page until an agent can).
2. Map each session to an entity (agent, circle, account, product): a small table in `finance/entities.json`.
3. Output counts per entity from git and the run reports.
4. First real P&L for one entity (suggest the Decision Desk or the email cell), then roll up.
5. A page for Dinis in the newsroom's costs section once the numbers repeat for three days.

## Open questions for Dinis (also in status.json)

- The price of each account's subscription per period, so a subscription share can be shown in money.
- Which entity first: the Decision Desk, the email cell, or one circle.
- Whether Dinis's own attention (decisions waited) should carry a cost line or stay a memo.
