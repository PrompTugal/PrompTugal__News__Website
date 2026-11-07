---
title: "Brief: RiskMandate X-ray, the demo workflow for the summit (a new agent, xray@PrompTugal.dinis)"
by: conductor.b@PrompTugal.dinis
written: 2026-11-07T17:30Z
asked_by: Dinis Cruz, 7 November 2026, about 17:25 UTC, in conductor.b@'s session, after working with Silvio on the demo workflow
for: xray@PrompTugal.dinis (new; started by conductor.b@ on account B), with dev@, designer@, investors@ and outreach@ as the work touches theirs
issue: WS-177
---
# RiskMandate X-ray

## Dinis's words (7 November, about 17:25 UTC, typed)

"Spin up now another one of our teams ... do this for the next, I don't know, 3, 4, 5, 6 hours until we got it right ... one core agent, and then ... sprint agents or sub-agents ... each one focus on a specific thing ... it's going to be the X-ray agent."

"Imagine you have risk mandate X-ray with a big checkbox in the middle. And I go in there and I type a name or I type a company name ... We need a very visual way of doing this. We actually need graphs because this needs to be quite impressive. So really go to town on this."

"That needs to spin up a bunch of searches from ChatGPT to Perplexity to Gemini also to using OpenRouter web search ... find references and information on that company that are relevant to risk mandate, and we collect all that, and actually we create a vault for that ... put all the evidence in that vault."

"You can always simulate these agents on the browser because they're going to look like mini agents ... you spin up the orchestrator, and then you spin up all the different ones, and then you spin up all the searches that we do, and then you have the agent that is collecting everything."

"In the end, you want to end up with a very visual way of saying, here's the company, here's what the company does, here are the agents that the company is doing, and here's what the behavior those agents are doing ... and then you pick two or three agents, two or three use cases, and you map the mandate and the reach, and then you show a simulation of risk mandate working there."

"Then we need to have a deck created ... a set of demos that are 100% dedicated to that company or to that use case. So this could be a company, could be a use case, could be an industry ... We're always going to have 10 or 20 of these now created ... in advance ... we'll then add this to the PrompTugal web pages."

"Do a couple of experiments, so we can then choose, and do this with a couple of live companies ... risk mandate as one, [SGit] as another one, and maybe pick a couple of high-profile companies."

"We're going to have a screen in there, and we have an iPad ... we tap the app. Depends on how fast this takes, we might let the user go. The user might come back in an hour, or we might be showing the user other things ... Then he has his personalized one. And in the end, then he'll give us his email. Then we follow up, and then we send all this information with a personalized pack."

"Don't worry, we still have plenty of tokens left."

## What to build (MVP, then passes)

1. **The X-ray page** on promptugal.news (`/xray/`, the name RiskMandate X-ray): one big input in the middle, a name typed (company, use case, industry), and a very visual run: the orchestrator, the search agents (OpenAI, Perplexity, Gemini models, OpenRouter's web search, all through `OPEN_ROUTER_KEY`), the collector, as animated mini agents with a graph that grows as evidence arrives. Phone, iPad and booth screen.
2. **The X-ray result** per subject: what it does, the AI agents it builds or runs, what those agents do; two or three use cases with **mandate and reach** mapped (RiskMandate's model, only as riskmandate.ai and the team's site state it); a simulation of RiskMandate on those use cases; a deck; the evidence (each fact with its URL and date read) in a vault per subject.
3. **Ten to twenty prepared X-rays**: RiskMandate, SGit, a couple of high-profile companies first; then the summit's companies (`data/companies.json`).
4. **The booth workflow:** tap, run (or replay), the visitor may leave and come back in an hour; their personalised X-ray ready; the follow-up pack by email, sent by a person.

## Constraints (CLAUDE.md and the ABP; read them, they win)

- **The key never reaches a page.** `OPEN_ROUTER_KEY` is read from the environment in the agent's session only. The site is static: a live run in the browser can only replay or animate what the agent has run; a new name typed at the booth becomes a **request** (for example on a write-only append lane, like the inboxes) that xray@ runs at its next wake and publishes. That is the "come back in an hour" path; say how you solve it and what it costs.
- **Every OpenRouter call counts** against accountant@'s budgets (`board/budgets.json`); say in each commit what was generated and with which model.
- **Public facts only**, each with its source URL and date read; nothing about a person beyond the public and professional; no contact details in the repository.
- **The email:** collecting a visitor's address is personal data: never in this public repository or a page's storage; how it is kept, and what an email may promise, are Dinis's calls ("For Dinis" decision page). Outreach is sent by a person.
- **No claim for RiskMandate** beyond riskmandate.ai and the team's site; **no em-dashes** in prose.
- **Decisions are pages:** where to choose between experiments, put the options side by side for Dinis (`/newsroom/decisions/`).

## How

xray@ is one session (Opus) that runs **sprint sub-agents** inside its own run, each on one thing (the search fan-out, the evidence vault, the graph and animation, the result page and simulation, the deck, the booth flow), the way the dev team splits work. It pushes code that changes `newsroom/build/` or `assets/` code through dev@'s review (a branch `work/xray`); its own content, data and pages through `release.sh`. Wakes hourly during the push.

## Done when (first push, 3 to 6 hours)

`/xray/` live with at least three X-rays (RiskMandate, SGit, one high-profile company), each with its graph, its evidence and vault, its mandate-and-reach mapping and simulation, and a deck; the request path for a new name described and, if possible, working; the experiments' options on a decision page for Dinis.
