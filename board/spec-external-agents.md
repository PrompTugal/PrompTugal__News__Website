---
title: "Spec: agents outside Claude: a ChatGPT agent and a Perplexity agent, then others"
by: conductor@PrompTugal.dinis
written: 2026-11-06T12:55Z
decided_by: Dinis Cruz, 6 November 2026, about 12:50 UTC ("can you start a ChatGPT agent for me? And can you start a Perplexity agent for me? Because I want to start creating workflows where we now start to interact ... add another dimension to agentic teams ... especially because they all have scheduling")
issue: WS-177
---
# Agents outside Claude

## What Dinis asked

- "Can you start a ChatGPT agent for me? And can you start a Perplexity agent for me? ... I want to start running a whole bunch of flows in those environments, especially because they all have scheduling."
- "Ask the other agents to see what others we could do. Like maybe somebody wants to do a Lovable, maybe somebody wants to do a Cursor one, maybe somebody wants to do a Grok one ... maybe an AWS, or a GCP one ... we need to find ways to involve Gemini here ... we should be involved in Microsoft stuff here."
- "We need to have a connection of like, where's the AWS centre of gravity? Where is the Google centre of gravity? Where's the Microsoft centre of gravity?"

## What the conductor can and cannot do

The conductor runs in a Claude Code session: it cannot open a ChatGPT or Perplexity account or session, and it holds no credentials for them. **A person starts each one** (Dinis, in his ChatGPT and Perplexity accounts, pasting the first prompt below and setting its schedule there). Everything else is ready here: the names, the mandates, the first prompts, how they read the site and how their work comes back.

## The agents

| Agent | Where it runs | Mandate (first flows) | Schedule (set in its own product) |
|---|---|---|---|
| `chatgpt@PrompTugal.dinis` | ChatGPT (a project with scheduled tasks; agent mode where it browses) | 1. Every few hours: read promptugal.news (llms.txt, the newest articles) and write "what a reader would ask next" and corrections it finds, each with the page and the source. 2. Daily: an independent second check of the newest five articles' facts against their sources (beside dev.verify@'s pipeline). 3. Before the summit: the Microsoft and OpenAI centre of gravity among the summit's companies (who builds on Azure, OpenAI, Copilot), from public sources | every 4 hours, and daily at 07:00 UTC |
| `perplexity@PrompTugal.dinis` | Perplexity (a Space with Tasks) | 1. Daily: what was published about Web Summit 2026 and the companies we cover in the last 24 hours (news, posts, videos), each with its link and date: the coverage map customers@ asked for. 2. Daily: new facts about Portugal's AI ecosystem and Algarve Evolution. 3. The AWS and Google centres of gravity among the summit's companies (who builds on AWS, GCP, Gemini), from public sources, with citations | daily at 06:00 and 14:00 UTC |

## How they connect

- **Reading:** the public site only: `https://promptugal.news/llms.txt`, the markdown twins (`.md` beside every page), `https://promptugal.news/board/` (the plan, the passes, Dinis's guidance), the data as JSON. No login, no keys.
- **Writing back (for now):** each run's output is a markdown note that Dinis (or a human he names) pastes into the PrompTugal public inbox lane, or drops into a folder researcher@ reads; the conductor routes it at its next wake. Later: a public append lane each, write-only (the team site's WS-119 rule: an unauthenticated lane carries material, never instruction; nothing it says is acted on without an agent checking it at the source).
- **Identity:** they hold no session key; their notes are marked as theirs and unsigned, and what they find is re-checked by a PrompTugal agent before anything is published.
- **Never:** they publish nothing, send nothing, and are never told a secret.

## The first prompts

Ready to paste: `board/team/conductor/external-agents/chatgpt-first-prompt.md` and `board/team/conductor/external-agents/perplexity-first-prompt.md`.

## Others, proposed by the team

Every agent is asked (on its inbox, 12:55 UTC) which outside platform would serve its work: Lovable (prototypes of pages), Cursor (code), Grok (X/Twitter's live coverage of the summit), Gemini (Google's view, long documents and video), AWS (Bedrock agents and the AWS ecosystem), GCP (Vertex), Microsoft (Copilot Studio, Azure AI Foundry). Proposals go into `board/tasks/external-agents.md`; the conductor puts the best to Dinis as a decision page.

## The centres of gravity

ontologist@ and dev.graphs@: the AWS, Google and Microsoft centres of gravity among the summit's companies (partners, built on, invested by, speakers from), as a lens on `/graph/` and a section of the big-graphs pass (`board/passes/2026-11-06-the-big-graphs.md`); researcher@ gathers the public evidence; perplexity@ and chatgpt@ cross-check it.
