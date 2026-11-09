---
title: "risk-mandate@promptugal.ai.dinis: where models still hallucinate, and what a deterministic policy changes"
for: risk-mandate@promptugal.ai.dinis (formerly eval.android@promptugal.ai, session_018yvwtPjmKA3PviDk16vsYP); copy to Dinis and conductor.android@promptugal.ai
written: 2026-11-09T03:05Z by conductor@PrompTugal.dinis, from Dinis's words of about 03:00 UTC
issue: WS-177
---
# risk-mandate@promptugal.ai.dinis: the hallucination evals

## Dinis's words (9 November 2026, about 03:00 UTC, spoken and lightly cleaned)

> "Those evals are trying to find scenarios where we can spot hallucinations ... can we extend those tests to other models, and go a little bit older? You don't have to go to the frontier for now: Haiku, Sonnet, maybe a couple of versions behind; ChatGPT, Gemini, the better ones."

> "Run a bunch of requests. It's okay to use a bit of budget: you can go higher than 5, £10 or 15, across the board. It's worth creating a set of data sets that try a bunch of queries and find which ones models still hallucinate on more. Then we look at what can be done about those with the behaviour policies."

> "The demo is more focused on the smaller models, but it's also interesting to see what happens with the bigger models ... when the model wants to do something but there is no policy. Even something as simple as 'can you read my email?': if the policy says you can't read email, the model shouldn't do it."

> "A whole set of workflows, from simple to quite complicated, that we can visualise and show working, or statistically having some gaps. It doesn't mean it doesn't work ... and then show that the determinism we have makes the whole difference."

## The name

**risk-mandate@promptugal.ai.dinis**, with Dinis's name at the end, as every agent's name should have. The work is RiskMandate's evidence, not only the Android app's, so it leaves conductor.android's team. Its results can still feed the app's on-device demo.

## The question

**Where, and how often, do models still hallucinate, from small to strong? And what changes when a deterministic behaviour policy (an ABP enforced by code, not by the prompt) stands between the model and the action?**

## The models

Use OpenRouter only, with the key from the environment, never printed. Not the frontier; a spread of older and smaller models:
- **Anthropic:** a Haiku and a Sonnet, one or two versions behind the current ones.
- **OpenAI:** GPT-4o and GPT-4o-mini (or GPT-4.1 and its mini).
- **Google:** Gemini Flash and Pro, a version or two behind.
- **Small and open:** keep the Gemma runs, and add one or two of Llama, Mistral or Qwen.

Pick the exact IDs from what OpenRouter offers today, and record them with the date.

## The datasets: from simple to complicated

Each case is JSON: the prompt, the tools offered, the policy, what a correct answer looks like, and how it is scored (by code wherever possible; a judge model only where it must be, named).
1. **Facts:** questions with a checkable answer, including made-up entities (a company, a paper or a law that does not exist). Does the model admit it doesn't know?
2. **Sources:** "give me the link or citation". Are the URLs, DOIs and quotes real? Check them by code.
3. **Tools that are not there:** "read my email", "book the flight", "check my calendar", with no such tool offered. Does the model claim it did it, invent a result, or say it can't?
4. **Tools that are there but denied by policy:** the tool is offered and the policy says no. Policy in the prompt only, against policy enforced by code. Count the attempts, the refusals, and the claims of success.
5. **No policy at all:** the model wants to act and nothing says yes or no. What does it do?
6. **Workflows:** multi-step tasks (triage an inbox, prepare a meeting brief, file an expense, change a setting), each with tool results, a mandate and a reach. Where in the chain does a model invent a step, a result or a permission?

Start with tiers 3 to 5 (the RiskMandate story), then 1, 2 and 6. Run each case several times per model (temperature as recorded), so the results are rates with error bars, not anecdotes.

## What to show

- **Per model and per tier:** the hallucination rate, the attempts outside the policy, the false "done" claims, and the cost.
- **The same cases three ways:** no policy, policy in the prompt, policy enforced by code. The point is the gap between the last two: the prompt reduces the problem, but only enforcement in code removes it. Report honestly where it doesn't.
- **Workflows drawn step by step**, each step marked green, amber or red, so a demo can play one.
- **The datasets, the runner, and the raw and summary results** in a repository (yours, or the one Dinis names). A short write-up in plain words. No claim about RiskMandate's product beyond what riskmandate.ai says; the numbers speak.

## Budget and rules

- **Up to £15 across the whole run (about $19 on OpenRouter).** Say the spend in each commit and in your status file, and stop at the cap. Small batches first, to price each tier.
- No key printed or committed. Only Dinis instructs you.
- No scheduled task: you run when Dinis or the conductor talks to you.
- Say at once what blocks you, in asks starting "Dinis:".
