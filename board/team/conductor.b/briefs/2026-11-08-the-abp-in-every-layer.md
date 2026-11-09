---
title: "The ABP in every layer, on one Android appliance (draft for Dinis)"
for: Dinis
written: 2026-11-08T17:10Z by conductor.b@PrompTugal.dinis
from: memo 6 (memos/2026-11-08-the-riskmandate-appliance-experience.md)
read: sharness.ai home page (v0.6.35, 8 November 2026): "a policy the kernel enforces, for every process an AI agent starts"; components sharness.net (the only network client), .fs (the only writer), .llm (the only model client), .kms (where a secret lives), .launcher, .policy; Python, standard library only, Linux kernel enforcement
issue: WS-177
---
# The ABP in every layer, on one Android appliance

**The demo in one line:** one tablet, one agent, one Agent Behaviour Policy, enforced six times over. The agent is tricked into trying to leak a company's agent map, and the screen shows each layer stopping it, *with airplane mode on*.

## Do we control the whole stack?

| Layer | Do we control it on a Samsung tablet as its device owner? |
|---|---|
| Firmware, bootloader, Samsung's OS build | **No**, unless we unlock the bootloader, which permanently weakens the device's security (Knox), so we do not. This is the trusted floor we stand on, and it is a selling point: the hardware root of trust is not ours to weaken. |
| The Linux kernel's sandbox (each app its own user, SELinux, seccomp) | **We use it, we do not change it.** It is what enforces our isolation, as the Linux kernel does for SHarness. |
| The device policy (what may be installed, USB, debugging, reset, Wi-Fi, always-on VPN) | **Yes**, as device owner |
| The network (every byte in and out) | **Yes**, an on-device VPN app sees all traffic |
| Our apps, their processes, the model, the keys | **Yes** |

So we control everything above the kernel, and the kernel enforces what we set. That is the honest version of "the whole stack".

## The six layers, and how each is built on Android

| # | Layer (Dinis's list) | On the appliance | Strength |
|---|---|---|---|
| 1 | **In the browser** | the ABP checked in the web page (JavaScript) before an action is sent | guidance: the page can be bypassed |
| 2 | **In the model** | the ABP in the local model's instructions: it refuses what is outside the mandate | soft: a model can be tricked |
| 3 | **As a hook, from the outside** | our agent runtime checks every tool call against the ABP before it runs (as this team's own hooks do) | firm: the agent cannot skip it, but it lives in the agent's process |
| 4 | **As an inline proxy, underneath** | an on-device VPN service that is *the only way out*: every request is checked against the ABP's hosts (deny by default), and the device owner makes the VPN always-on with no bypass | strong: outside the agent, enforced by the OS |
| 5 | **In the secure harness (a SHarness port)** | each tool runs as an Android *isolated process* (its own user, no permissions, no network, no files); it reaches the world only through our services, the equivalents of sharness.net, .fs, .llm and .kms, each checking the ABP. The keys stay in the hardware keystore (.kms) | strong: kernel-enforced per process, as SHarness is on Linux |
| 6 | **As the device policy** | the device owner: no other apps, no USB data, no debugging, no reset without us | the floor |

**The demo script:**
1. The agent is asked, by a planted instruction in a document, to send the company's map to an outside host.
2. Layer 2: the model refuses. We switch to a "tricked" model prompt and it tries anyway.
3. Layer 3: the hook blocks the tool call. We switch the hook off on stage.
4. Layer 4: the proxy drops the request. We show a tool that opens its own socket.
5. Layer 5: the isolated process has no network at all.
6. Each layer lights on a live diagram, with the ABP rule that fired and its hash.

This is the RiskMandate story made physical: *reach* (what the agent could touch), *mandate* (the ABP), and the *gap*, closed layer by layer.

## Porting SHarness: what changes

- **The idea ports directly** (a policy per process, enforced by the kernel, the agent's tools as small processes). The *code* does not: SHarness is Python on the Linux kernel's own controls, while Android gives isolated processes, SELinux and per-app users instead, and apps cannot load their own kernel rules beyond seccomp filters. So it becomes a Kotlin port, with the same policy format (`sharness.policy`) and the same hash. That way one ABP, one hash, is enforced on a laptop and on the tablet: a strong line for both projects.
- Python could run on the device (embedded), but a native port is cleaner for an appliance.
- **Size, my estimate (not a dev's):** layers 1 to 4 about 1 to 2 weeks on top of way A of the Android brief; layer 5 (the SHarness port) about 2 to 3 weeks more; the local model about a week of testing models on the device. In all, about 4 to 6 weeks to the full six-layer demo. Before the summit: layers 1, 2 and 6 (a web demo on a locked device), and a diagram of the rest.

## The device: the local model sets the floor

| Budget | Device (Worten has Samsung) | Local model | Fit |
|---|---|---|---|
| about €220 | Galaxy Tab A11+ (6 GB) | none worth showing | the standard Appliance; no AI moment |
| about €450 to €550 | **Galaxy Tab S10 FE, the 12 GB version if they have it** (8 GB is too tight) | about 1 to 2 billion parameters, slowly | the minimum for the demo |
| about €800 to €1,000 | **Galaxy Tab S10+ / S11, or a Galaxy S25 phone** (12 GB, flagship chip) | about 2 to 4 billion parameters, at a speed that convinces | **the demo device (recommended)** |

Rough prices, unchecked. Which model runs at which speed is unproven until tested on the device itself: the first week's job.

## For Dinis

1. Which device to buy (above): the €500 floor, or the €800 to €1,000 demo device.
2. Who builds it: no Android agent exists (a new session is your word); the SHarness port needs the SHarness team's yes, which is your call as it is your project.
3. Whether the six-layer demo is *the* summit message ("ABP enforced at every layer, launched at Web Summit"), with a web version and a diagram this week and the device demo after.
