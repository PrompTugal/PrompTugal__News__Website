---
title: "The on-device LLM, next: the iPad, a workbench of scenarios, models judging models, and one shared mobile repository"
for: conductor@web-summit.dinis (the iOS apps), conductor.android@promptugal.ai (the Android app), the new mobile@promptugal.ai.dinis, risk-mandate@promptugal.ai.dinis; copy to Dinis
written: 2026-11-09T10:45Z by conductor@PrompTugal.dinis, from Dinis's words of about 10:30 UTC
follows: board/guidance/2026-11-09-the-llm-in-the-app.md (the positioning), board/guidance/2026-11-08-three-apps-three-lines.md, board/briefs/2026-11-09-risk-mandate-evals.md
issue: WS-177
---
# The on-device LLM, next

## Dinis's words (9 November 2026, about 10:30 UTC, spoken and lightly cleaned)

> "It's super critical for us to run the LLM on the iPad. Add it to the RiskMandate app first; actually both, but do it once in one and then the other."

> "First, really go to town on the art of the possible. We've done this before: a whole bunch of pages with a whole bunch of scenarios. You can run them individually or in sequence, and each is designed to confirm a couple of little things: can you run a query, can you run the LLM?"

> "These tests are often brittle. If a test says 'say hi', the LLM returns 'hello', and that's hard to check with a regex. The good news is that we can now use the LLM to analyse the result: a second layer, even a third. Use the local LLM to review the results. On the RiskMandate and team iPads we also use OpenRouter, so we have more models. Call the local LLM to evaluate something, then call a Sonnet to evaluate it, and see what is actually happening."

> "Tool calling makes the whole difference. But here we have to be ridiculously focused on prompt size, and this is where we already need our ABPs, our agent behaviour policies. And can we use the LLM to help with the ABP?"

> "Evals, and capturing the data: find where models hallucinate and make mistakes, especially the open-source models. We need ABPs to control them. What is a good behaviour policy for a Gemma 4B, or another open model? Very specific evals and tests that run on our models and our workflows. All of this needs to be a massive workbench: multiple UIs, multiple things."

> "The cross-collaboration and cross-innovation between the Android team and the iOS team: you should have an agent that just focuses on this. Reuse as much as possible. A new project, `PrompTugal__App__Mobile`: mobile, not app, because app could be desktop. Native code stays native, Swift on one side and Kotlin on the other, but with an abstraction layer between them, so we have the exact same features and workflows. Especially HTML and JavaScript, which some of the UI will be even when it runs locally: the same on both. Changes we should not make in both repos, only in the shared mobile repo, applied to both: updated dynamically, because it's just JSON and content, or rebuilt on both, which is fine."

> "The chat needs to be there in a good UI, especially for tools, as a demo: look, this runs offline, this is an LLM. But what I'm very, very interested in is app intelligence: what can we start using? This is about shipping fast. We have a huge amount of credit, so let's go to town."

> "The next milestone: an LLM on the iPad, and maybe two or three modes: one using the Google one, one using the Apple one ..." *(cut off here)*

## The next milestone: M-iPad

**The RiskMandate app on iPad runs a model on the device, in up to three modes, side by side:**
1. **Google:** LiteRT-LM with the same Gemma 4 E2B/E4B files as Android. The same model and prompts on both platforms is the shared baseline.
2. **Apple:** the on-device Foundation Models framework (recent iPadOS, Apple Intelligence devices): no download, and Apple's own guarded tool calling.
3. **A third if it earns its place:** MLX on Apple silicon, or llama.cpp with the same Gemma GGUF.

Plus **OpenRouter** (the app's own key, from the environment or the user's vault, never in the code) as the cloud comparison and the second judge.

**Done when:** on the team's iPad, each mode answers the same 10 scenarios, with tokens per second, the time to the first token, memory and the model's size shown, behind the "Runs on this device" badge. Then the team app, from the same shared code.

## The workbench (on both platforms, from one definition)

- **Scenarios as data.** Each is a JSON file in the shared mobile repo: the prompt, the tools offered, the ABP, the expected behaviour, and how to judge it. Run one, a group, or all in sequence; results kept and exportable.
- **Three layers of judging:**
  1. code (exact checks, schema, the tool call made or not);
  2. the local model as judge;
  3. a cloud model (a Sonnet via OpenRouter) as judge.
  Every disagreement between the layers is recorded: it is data in its own right.
- **Tool calling with a budget.** Each scenario shows its prompt size, and the workbench reports what fits in a small model's context. The ABP is the policy layer: what the model may call, enforced by code, never by the prompt alone. Experiment: the LLM proposing ABP rules, and a person or code accepting them.
- **The one-shot request builder.** Port the idea of SG/Send's **sg-llm "One-Shot Reality Constructor"** (`the-cyber-boardroom/SGraph-AI__App__Send`, `team/humans/dinis_cruz/briefs/03/30/v0.19.11__architect-review__sg-llm-reality-constructor.md`; the components `sg-llm-request`, `sg-llm-events` and the vault-chat dev pack `library/sgraph-send/dev_packs/v0.27.80__vault-chat/`). There is no chat history: the request is built block by block (system, context documents, constructed history, tool results, question), with the token count and cost visible before sending. That suits small on-device models.
- **App intelligence experiments** (the point of it all): the welcome brief when the app opens; the user's graph matched to the news graph; small workflows moved from code to the model, each under an ABP.
- **The chat** stays, in a good UI, as the demo that it runs offline and with tools.

## One shared mobile repository

- **`PrompTugal/PrompTugal__App__Mobile`**, which **Dinis creates** (agents cannot create repositories). It holds:
  - the scenarios and evals (JSON);
  - the ABPs for the apps' models;
  - the prompts and the base system block;
  - the HTML and JavaScript UI that both apps load in a web view;
  - content, and a feature manifest each app reads.
- The native apps keep the runtimes (LiteRT-LM, Foundation Models), storage and the OS integration behind **one small bridge interface with the same names on both sides**: `llm.generate`, `llm.tools`, `abp.check`, `vault.read` and the like. The shared JavaScript calls only the bridge.
- **A change in the shared repo** is either fetched at run time (JSON and content, signed and versioned) or built into both apps at the next release.

## Who does what

- **mobile@promptugal.ai.dinis (new, at Dinis's word):**
  - the cross-collaboration between the Android and iOS teams;
  - the bridge interface;
  - the shared repo's layout;
  - a weekly "what each app learnt" note (prompts, models, speed figures, eval results) both teams read.
- **M-iPad's owner: for Dinis to name.** conductor@web-summit.dinis has no iOS agent (10:27 UTC). PrompTugal__App__iOS's recent commits (to v0.4.26, 9 Nov 01:14 UTC) come from sessions on Dinis's account B (session_01Kw9UwBDmPVKbqs5VjGCN6v the most), which are in neither team's roster. Material from the Web Summit team for the scenarios and ABPs: its public demos, videos, `/abp/` and the X-ray scenarios (WS-191 to WS-198).
- **conductor.android:** moves its scenarios, prompts and the Workbench brief into the shared repo's format, so Android and iPad run the same cases.
- **risk-mandate@promptugal.ai.dinis:** its eval cases become workbench scenarios; it measures the open models under ABPs on both platforms.
- **The news app (App Store):** untouched. No LLM until Dinis says.

## Asks for Dinis

1. Create `PrompTugal/PrompTugal__App__Mobile` (empty, `dev` as default) and give the mobile agent push access.
2. **Who builds M-iPad:** the account-B session that ships PrompTugal__App__iOS, or a new iOS agent.
3. Which iPad models the team has (Apple's on-device model needs an Apple Intelligence device).
4. The rest of the cut-off sentence: the three modes.


## Dinis's answers (9 November, about 10:40 UTC)

1. **`PrompTugal/PrompTugal__App__Mobile` is created.**
2. **The devices:** an iPad Air 11-inch (M4) and an iPhone 16 Plus. Both can run Apple Intelligence, so the Apple mode is open on both.
3. **Lean into Apple.** His words: "We're using the Apple capabilities, the Apple models, and maybe the native Apple Intelligence capabilities. They're about to add stuff, so see if there is something new that is not widely used yet, because Apple is pushing Apple Intelligence. What's really powerful about what we have now is a really, really good use case for intelligence in our product. A lot of these companies are missing good use cases and good examples of what you can do with it. We have that. So let's leverage this."

**So the Apple mode goes beyond a chat on Apple's model.** Find which Apple Intelligence capabilities the app can use, and the newest ones few apps use yet, each checked against Apple's current documentation before it is built:
- the on-device Foundation Models framework, with guided generation into Swift types and its own tool calling;
- App Intents, so the app's actions and content reach Siri, Spotlight and Shortcuts;
- the system's Writing Tools and Visual Intelligence where they fit.

Each gets a workbench scenario, and the strongest becomes a demo of RiskMandate's case for intelligence that works. The aim is a reference example, built well, that Apple itself would want to show.
