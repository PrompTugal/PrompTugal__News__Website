---
title: "The appliance as an OEM offer: your product, delivered as a governed device (draft for Dinis)"
for: Dinis
written: 2026-11-08T17:35Z by conductor.b@PrompTugal.dinis
from: memo 7 (memos/2026-11-08-the-appliance-as-oem.md), with memos 5 and 6
issue: WS-177
---
# The appliance as an OEM offer (draft)

**In one line:** another company's product, delivered as a locked-down Android device that boots into it, with every agent and process under a written policy. We validate, test, configure and ship it. The method is open source; what we sell is doing it, and doing it right.

Nothing here is decided or on sale. Money, the brand and who sells it are Dinis's.

## 1. The offer

| | What the customer (a startup or product company) gets |
|---|---|
| **The device** | their product as the only app, booting straight into it; their logo on the boot screen and the box; phone or tablet, chosen for their product (with a local model if it needs one) |
| **The controls** | the policy layers of the six-layer brief: their app's agents under an ABP, their processes under a PBP (SHarness's process policies), the device under a device policy, and all traffic out through one inline proxy (VPN) that allows only their hosts |
| **The data** | an SGit vault held only on the device, or on storage the device is attached to, encrypted, with the keys in the device's secure chip. The storage holds ciphertext and the device holds the key. |
| **The delivery** | validated, tested and configured by us; shipped ready; updates pushed silently; remote wipe; a written record of what each device is allowed to do |
| **The proof** | the policy hash on the device and on the box: what this device may do, signed |

**Why a company buys it rather than doing it themselves:** the method is public, but the work is not 20 minutes. Device provisioning, kiosk and policy gotchas, the proxy, the vault, the testing on real hardware and the logistics are all needed. Our edge is that we have done it for RiskMandate and PrompTugal already, and we have the production line.

## 2. Who it fits (the criteria for the summit)

A company is a good fit if most of these are true:
1. Its product **does an action or captures data at a place** (a shop floor, a clinic, a site, an event, a field team), not only in a browser.
2. **Installation or deployment is its pain:** onboarding takes days, IT departments block it, or it ships its own hardware today.
3. **The data is sensitive**, so "it never leaves this device" or "it only talks to these hosts" is a sales point.
4. It is **an early-stage startup** that needs an MVP or a pilot in customers' hands fast, before it builds its own hardware line.
5. It **uses AI agents**, so the ABP layers are a feature it can sell in turn.

Typical shapes: security tools (scanners, audit kits), field data capture (inspection, health, logistics), event and retail kiosks, AI assistants for regulated work, IoT companies that need a control panel.

**How to find them at the summit:** the summit's company list (the team's data) filtered by these criteria. The shortlist and any notes on a company are the team's private notes, not published here (CLAUDE.md: notes are not facts). outreach@ and correspondent@ hold them, at Dinis's word.

## 3. The open-source icebreaker

The pitch at the stand: *"We built this for ourselves: RiskMandate and PrompTugal run as appliances. It is open source, and here is the plan for your product."* Then we hand them a one-page **appliance plan for their product**: device, layers, policy, vault, rollout and cost. The plan is free. Building and running it is the paid part. It also gives us a reason to follow up.

## 4. The business model (proposed, to price)

| Tier | What | Indicative price (to be set) |
|---|---|---|
| **O1 Plan** | the one-page appliance plan for their product | free (the icebreaker) |
| **O2 Pilot** | 3 to 5 devices, configured, tested, delivered; 60 to 90 days | device cost + set-up fee (e.g. £1,500 to £3,000) |
| **O3 Fleet** | per device: hardware + markup + set-up + yearly management (updates, policy changes, wipe, support) | device + £X per device + £Y per device per year |
| **O4 Licence** | they run the production themselves, with our tools and our review | a yearly fee |

The markup is on the work, not the hardware: devices at cost plus a fixed fee per device keeps us honest on a public method. The device rule from memo 5 still holds: the device sits inside the price, never as a loss.

## 5. A name for the device layer

We have the Agent Behaviour Policy (ABP, the agent) and the Process Behaviour Policy (PBP, SHarness). The device layer is a third. "Android Behaviour Policy" clashes with ABP, so I propose a **Device Behaviour Policy (DBP)**. One policy hash covers all three: what the agent may do, what each process may do, and what the device may do. This is the brand's and Dinis's call.

## 6. What must be true first

1. **Our own appliance works:** way A of the Android brief, and at least layers 1, 2, 4 and 6. We sell the OEM offer only on what runs for us.
2. **The devices Dinis buys today** are the test bench for us and for the first pilot.
3. **The legal side of selling hardware for others:** warranty, liability for their product, data protection when we configure devices holding their customers' data, and VAT. These are Dinis's calls, with advice.
4. **Who sells it:** The Cyber Boardroom, the RiskMandate company being set up, or a new line.

## 7. At the summit (9 to 12 November)

- Show our two appliances (RiskMandate, Field Reporter) as the proof.
- The card: "Your product as an appliance: we did it for ours. Ask for your plan."
- Count, by company: interested, plan requested, pilot discussed. Plans are written after the summit from those conversations.

## For Dinis

1. Is the OEM offer part of the summit message, or a quiet conversation with a few chosen companies?
2. The tiers and prices to show, if any.
3. The name of the device layer (DBP or another).
4. Whom to wake to shortlist companies (outreach@, correspondent@, in the private CRM) and to price it (investors@, customers@).
