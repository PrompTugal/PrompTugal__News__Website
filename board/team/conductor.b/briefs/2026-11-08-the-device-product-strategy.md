---
title: "The device product strategy: product, commercial and release (draft for Dinis)"
for: Dinis
written: 2026-11-08T16:50Z by conductor.b@PrompTugal.dinis
from: memo 5 (memos/2026-11-08-the-device-product-strategy.md), with memos 2 and 3, the Android brief, and customers@'s page /newsroom/decisions/the-riskmandate-agent-ipad/
issue: WS-177
---
# The device product strategy (draft)

**The idea in one line:** RiskMandate and PrompTugal ship as *devices you hold*: a locked-down Android phone or tablet that boots into our app and holds one customer's data. It is the demo, the delivery and the product at once. The iPad is the premium option. Launched at Web Summit, 9 to 12 November 2026, with pre-orders and one question: would you buy this?

Nothing here is decided or on sale. Money, the brand, the law and what RiskMandate is are Dinis's. Hardware prices are rough and unchecked.

## 1. Where Dinis's instinct is right, and one correction

- **Right: Android is cheaper, more controllable, and faster to release.** It can boot straight into our app (a "dedicated device" in lock task mode, set when the device is first set up). We can install our own app the same day without any store (sideload, or a private app on managed Google Play). The device signs in with the agent's Google Workspace account. Phones from about £100 and tablets from about £200 make "hand it over" and "ship it as a demo" affordable.
- **Correction: an iPad *can* boot into one app.** Single App Mode works on a *supervised* iPad (set up through Apple Configurator on a Mac, or Apple Business plus a device management service). It is more set-up, costs more and has more Apple in the loop, but it is possible. So the iPad is a *premium* appliance, not an impossible one.
- **Google Play timing (to check before relying on it):** a *personal* developer account opened recently must run a closed test with at least 12 testers for 14 days before a public listing; an *organisation* account (verified with a company number) is not held to that. After that, review usually takes hours to a few days. **For the summit we need no store at all.**

## 2. The product line (proposed)

| # | Product | What it is | Device | Indicative price | Who it is for |
|---|---|---|---|---|---|
| D1 | **RiskMandate Demo Device** | A phone loaded with one company's X-ray or ABP: "experience it yourself". Lent at the stand, or sent after a meeting. | Android phone, about £100 to £150 | free to lend, or £150 to keep | prospects; the start of a sale |
| D2 | **RiskMandate Appliance** | One RiskMandate environment, isolated: the mappings, the reviews and the analysis, on a device the customer locks in a drawer. Comes with an engagement. | Android tablet, about £200 to £300 | **in the £1,500 level** (store.sgit.ai level 04, "ABP Reviewed"), or **+£250** on level 03 (£500) | CISOs, risk leads, auditors (one per client) |
| D3 | **RiskMandate Appliance Pro** | The same on an iPad: the gravitas option | supervised iPad, from £429 | about £1,500 + the level | buyers who want Apple |
| D4 | **PrompTugal Field Reporter** | A reporter's production kit: capture, edit, publish into the newsroom workflow (Indi and Vicky first) | Android tablet and phone, about £350 to £600 | about £750 to £1,500 per seat, or per newsroom | newsrooms equipping staff; event coverage |
| D5 | **Field Reporter Pro** | The same on iPad and iPhone | about £1,000+ | about £1,500 + | newsrooms on Apple |

**The margin rule Dinis set:** in a £1,500 engagement, a £200 device is fine. So the device is *in* the price at level 04 and an *add-on* below it. It is never a loss leader, except D1 lent at the stand.

## 3. The commercial strategy

1. **Sell where we already sell: store.sgit.ai.** It sells RiskMandate's ABP at four levels (Pack £10, Vault £50, Tailored £500, Reviewed £1,500; read 8 November 2026). Add a fifth row, *"on a device"*, as an option on levels 03 and 04, plus a "Devices" page listing D1 to D5 as **pre-orders**. PrompTugal's Field Reporter belongs on the PrompTugal side (The Cyber Boardroom as publisher), not in RiskMandate's store. Who sells which is Dinis's call (the decision page's point 4).
2. **The summit test, "would you buy this?":**
   - At the stand: two devices running (an Android tablet as the Appliance, a phone as the Demo Device), and their boxes if ready.
   - A card per product with its price and a QR code to "register interest / pre-order".
   - We count three things, by product and price: *interested*, *would buy at this price*, *pre-ordered*. That data decides what we build first.
3. **Price testing:** show two prices for the Appliance on alternate days (for example £1,500 with device included vs £500 + £250 device). This is the team's A/B rule (CLAUDE.md, decisions are pages) applied to price, and it needs Dinis's yes.
4. **What may be said:** "launched and presented at Web Summit, pre-orders open". It may not say "available now", or claim anything for RiskMandate beyond riskmandate.ai and store.sgit.ai, which today say nothing about devices, until RiskMandate's founders add it there.
5. **Selling a device brings duties that a download does not:** the consumer's return right (14 days in the UK and the EU) when sold to a person, VAT on hardware, the warranty (we pass the maker's through), and shipping. Business-to-business sales in an engagement are simpler, so start there.

## 4. The release strategy

| When | Android | iPad and iPhone |
|---|---|---|
| **Before Monday (8 to 9 Nov)** | **Kiosk demo, no app:** the two devices set up from new on the agent's Workspace account; Chrome or a kiosk app locked to the RiskMandate X-ray and promptugal.news pages (possible today) | the team's own iPads, as now |
| **Summit week (9 to 12 Nov)** | "Launched at Web Summit": demos plus pre-orders; an Android lane starts (way A in the Android brief: a thin Kotlin shell with the vault) if Dinis says so | TestFlight once Dinis's Apple set-up is done |
| **1 to 2 weeks after** | way A: the app installed privately (sideload or managed Google Play) on pre-ordered devices; first D1 and D2 delivered | Single App Mode on supervised iPads for D3 |
| **After** | public Google Play listing (organisation account); D4 with Indi and Vicky | App Store; D5 |

## 5. For Dinis to decide

1. **The line-up:** D1 to D5 as above, or fewer? My recommendation: launch D1, D2 and D4 at the summit, with D3 and D5 named as "Pro, on Apple, coming".
2. **The prices**, or two to test.
3. **Who sells which** (The Cyber Boardroom, the RiskMandate company being set up), and whether store.sgit.ai gets the device rows.
4. **The Google Play account:** an organisation account (which avoids the 12-tester wait), in which company's name, and held by which person.
5. **Who to wake**, since all of account B is paused: customers@ (turn this into the For Dinis page, replacing the iPad-only one), investors@ (margins and the investor line "hardware-delivered agent governance"), designer@ and designer@web-summit.dinis (boxes and sleeves for an Android tablet and a phone), and the iOS team's conductor for an Android lane (a new session only at Dinis's word).

## What I think

It is a good move, for one reason above the price: **a device makes RiskMandate tangible in under a minute.** "Here is your agents' map; hold it" beats any laptop demo, and the locked device *is* the security story. The risk is promising hardware we cannot yet deliver. So call it a *launch with pre-orders*, keep the summit claims to what runs, and let the count of "would buy" decide what the Android app does first.
