---
title: "The LLM in the app: a model running offline on the device changes how the apps are built"
given: 2026-11-09, about 10:15 UTC, Dinis in the conductor's session (spoken, transcribed; his words lightly cleaned, nothing added). His message was cut off mid-sentence; the rest of the brain dump follows.
kept_by: conductor@PrompTugal.dinis
evidence: PrompTugal/PrompTugal__App__Android on dev. Build 0.1.78 gave the first on-device chat on the Lenovo Idea Tab Plus (conductor.android's status, 9 Nov, 09:33 UTC), running Gemma 4 (E2B and E4B, `.litertlm`) on Google's LiteRT-LM. The "Runs on this device" badge (pt-PT "Funciona neste dispositivo") and a base riskmandate.ai system block on every request followed Dinis's tablet findings (09:42 to 09:54 UTC). Next: the Workbench brief, an experiment control centre and tool-calling tests (10:06 UTC).
issue: WS-177
---
# The LLM in the app

## The milestone (Dinis's words)

> "We just shipped an offline model running on our Android app, on our Android tablet. This is a major moment. For me, this is the first time I've seen, in this kind of app environment, the LLM working at a decent speed, not that bad, in ways that now allow us to really think about what we can do with it."

> "My first question: this was running on an Android tablet. Let's do the same thing for the iPad."

## The positioning (Dinis's words)

> "This changes the whole process completely, and we have to absolutely focus on this, because it introduces something I've wanted to do for a long time. I only tend to think about stuff when I know there is mileage in it, and this is a good example of that."

> "The fact that we now have an LLM running offline, at a little bit of speed, allows us to add a level of intelligence and a level of logic to the application that we don't have to have in code. Right now, everything we do in the app has to be code. The power of the LLM is that we can now lift some of the business logic, some of the workflows, some of the experience to an LLM that runs as soon as the app loads, or while it is loading."

> "This is not about running everything as an LLM. It's about having a certain amount of functionality that is now built into the application. For example: 'Hey Dinis, welcome to the app. Here's what's been going on, here's the latest news, here's what you care about, here's the connection.' The connection between the semantic graph of the user and the semantic graph of the news: a lot of that maintenance, a lot of that workflow."

> "So we need to experiment now with the art of the possible."

> "We also need to learn from each other's apps."

## The three apps, and where the LLM goes first

As Dinis set it out (and on 8 November, "three apps, three lines", `2026-11-08-three-apps-three-lines.md`):

| App | Who it's for | Store | The on-device LLM |
|---|---|---|---|
| **The news and event app** (PT News, the Lisbon event) | the public | **the App Store, the only one** | **Not for now.** Keep it light; get it accepted first. "I don't want to add complexity to it." |
| **The team app** (PT News Team) | the team only | never | **First, with RiskMandate's app**: the place for experiments |
| **The RiskMandate app** | the public, for demos | not in a store for now | **First**: demos of the model on the device, and the ABP in every layer |

> "For now, a lot of the innovation, all these LLMs, we'll first do on the RiskMandate app and the team app, and then take it to the other one."

> "Only the news app is on the App Store, and eventually we'll add to it, but I don't want to add complexity to it. I don't think it should have a full LLM inside it for now. I really want to make sure that, for now, we see if we can get the Summit app on the App Store ..." *(cut off here)*

## What follows (the conductor's reading, for Dinis to correct; not his words)

1. **The iPad, the same as the Android tablet.** The team app and the RiskMandate app on iPad get an on-device model, behind the same "Runs on this device" badge and the same base system block. The options to test (research, not yet decided):
   - LiteRT-LM's iOS runtime with the same Gemma 4 files, so the model and prompts match Android;
   - Apple's own on-device model (the Foundation Models framework on recent iPadOS), with no model download;
   - MLX on Apple silicon.
   The test on each: speed in tokens per second on the team's iPad, memory, app size, battery, and the same eval cases risk-mandate@ runs.
2. **Who builds it.** The iOS apps are in `PrompTugal/PrompTugal__App__iOS`, worked on by the Web Summit team (conductor@web-summit.dinis). The conductors are directly connected on this account: the Web Summit conductor messaged this session on 8 November at 23:55 UTC, so this note can go to it as written.
3. **Learning across apps.** One shared folder of what each app learnt (prompts, the base system block, model choices, speed figures, eval results) is read by both the Android and the iOS teams. risk-mandate@'s evals measure the same cases on both.
4. **The first experiments** (from Dinis's example):
   - a welcome brief when the app opens ("here's what's been going on, here's what you care about");
   - matching the user's graph to the news graph on the device;
   - small workflows lifted from code to the model, each with a policy (ABP) that decides what the model may do.
5. **The news app stays out of it** until it is on the App Store and Dinis says otherwise.
