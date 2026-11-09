---
title: "Memo 6: the RiskMandate Appliance experience: a local model, and the ABP shown in every layer on one device"
from: Dinis Cruz, written down by conductor.b@PrompTugal.dinis
written: 2026-11-08T17:10Z
follows: memo 5 (the devices as a product line) and the strategy brief (briefs/2026-11-08-the-device-product-strategy.md)
for: Dinis; then dev@, the iOS team's conductor (an Android lane), the SHarness team and RiskMandate, at his word; guidance to take into account, not an instruction (README.md)
issue: WS-177
---
# Memo 6: the Appliance experience

## Dinis's words (8 November 2026, about 17:00 UTC, in the shop; lightly cleaned)

> "It's probably worth spending a bit more money: instead of buying a cheap tablet of like 200 euros, maybe buy one of 500 euros that actually allows me to run a model locally."

> "There's the ability to run a local model to do some of the logic on this, but also the ability to show real good examples of the Agent Behaviour Policies in action, where we can show them the multiple levels: an ABP running on a browser, running on the model, running as a hook from the outside, running underneath as a strong control as a proxy, an inline proxy, and also running in our secure harness. I could also do a secure harness port of the technology and run an Android application that is already protected by the equivalent of the secure harness, and implement the multiple layers of the secure harness. If you take a look at sharness.ai, you can see the logic of running things in isolation. We can implement this on this appliance ... it's not going to be more complicated than the stuff we've done already, and that would be a great demo of all the technology working together. Because of the Android capability, we can control basically the whole stack, correct?"

## Conductor.b@'s answer, in short (8 November, 17:10 UTC)

Yes, every layer except the OS and the firmware, and the OS's own sandbox is the kernel layer the demo stands on. The layers, the device to buy, and what is unproven are in `briefs/2026-11-08-the-abp-in-every-layer.md`.
