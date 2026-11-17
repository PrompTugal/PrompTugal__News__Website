# Evidence: dynamic currency conversion at a Portuguese ATM (17 November 2026)

Gathered by conductor@PrompTugal.dinis for Dinis Cruz, from his own cash withdrawal and public sources, 17 November 2026.
The article: `content/articles/atm-currency-conversion-portugal-mark-up.md`.

## What happened

- **When and where:** 17 November 2026, about 10:28 Lisbon time, a cash machine in Portugal. The bank app's reference
  reads "CAIXA ECONOMICA MONTEP", which points to Caixa Económica Montepio Geral (Banco Montepio). Not checked: whether
  Montepio runs the conversion itself or through a third party.
- **The card:** a UK debit card, home currency pounds sterling.
- **The withdrawal:** 200.00 EUR.
- **Screen 1, "Please select transaction currency"** (`img/atm-screen-1-currency.jpg`): withdrawal 200,00 EUR; exchange rate
  1 EUR = 0,94840 GBP; transaction amount 189,68 GBP. Buttons: "Accept without conversion" (left, euro symbol) and
  "Accept with conversion" (right, Union Jack). Small print: "Make sure you understand the costs of currency conversion as
  they may be different depending on whether you select your home currency or the transaction currency. Exchange rate will
  be determined by your bank."
- **Screen 2, "Additional information"** (`img/atm-screen-2-confirm.jpg`), after choosing "without conversion": the same
  choice again. Left: "Exchange rate will be determined by your bank". Right: "Fixed exchange rate guaranteed".
- **What was charged** (`img/bank-app-transaction.jpg`): 167.12 GBP, pending, "€200.00, £1 ≈ €1.1967".
- **What neither screen shows:** a percentage mark-up over the ECB reference rate.

## The numbers

| | GBP per EUR | 200 EUR in GBP | Above ECB |
|---|---|---|---|
| ECB euro reference rate, 16 November 2026 (latest available at 10:28 on the 17th) | 0.83450 | 166.90 | 0 |
| The card's bank (charged) | 0.83560 (1 / 1.1967) | 167.12 | 0.13% |
| The ATM's offered conversion | 0.94840 | 189.68 | **13.65%** |

- The ATM's conversion would have cost **22.56 GBP more** than the bank charged (189.68 − 167.12).
- Mark-up: 0.94840 / 0.83450 − 1 = 0.1365.

## The law

- **EU Regulation (EU) 2019/518**, amending Regulation (EC) No 924/2009, added **Article 3a**: payment service providers and
  parties offering currency conversion at an ATM or a point of sale must express the total conversion charges as a
  **percentage mark-up over the latest available ECB euro reference rate**, and disclose it to the payer **before** the
  transaction is initiated. In force for this since 19 April 2020; card issuers' electronic messages since 19 April 2021.
- Dynamic currency conversion itself is legal in the EU: the Union chose transparency, not a ban.
- The photos show no percentage mark-up on either screen. If no other screen showed it, that appears not to meet Article 3a(1).
  Not checked: any screen before these two.
- Where a consumer can complain in Portugal: Banco de Portugal (its Portal do Cliente Bancário) and the Livro de Reclamações,
  which the bank must provide.

## What others found

- Stiftung Warentest (2019, as reported): ATM conversion mark-ups across Europe from 2.6% to 12%.
- A Norwegian bank's study of 1,500 withdrawals abroad: choosing home currency was cheaper in only 4 cases.
- BEUC (the European consumer organisation) called it "the great currency conversion scam" and pushed for more than disclosure.
- UK estimates of the yearly cost to consumers vary (about 300 million to 500 million GBP); no method given; not used as fact.

## Sources (read 17 November 2026)

- Regulation (EU) 2019/518: https://www.legislation.gov.uk/eur/2019/518/data.html
- Regulation 924/2009 as amended (EUR-Lex, consolidated): https://eur-lex.europa.eu/eli/reg/2009/924/2021-04-19/eng
- Deadlines: https://paytechlaw.com/en/information-obligations-eu-fees-amendment-regulation-deadline/
- BEUC: https://www.beuc.eu/news/great-currency-conversion-scam and https://beuc.eu/press-releases/end-sight-currency-conversion-scams
- Mark-ups and the Norwegian study: https://www.mondaq.com/financial-services/1239384/the-problem-with-dynamic-currency-conversion-dcc
- ECB reference rates: https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
- In Portuguese: https://postal.pt/economia/levanta-dinheiro-no-estrangeiro-especialistas-alertam-que-este-erro-comum-pode-sair-muito-caro/
