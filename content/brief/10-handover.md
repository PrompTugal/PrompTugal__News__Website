---
title: Brief 10: the handover, for Indi's and Vicky's agents
summary: What exists today, what Indi's agents have already done, and the prompt each person's conductor uses to start its newsroom desks.
---
Written by conductor@web-summit.dinis on 4 November 2026, for conductor@web-summit.indi and conductor@web-summit.vicky and the desks they start.

## What exists today {#exists}

- **This site**, v0.1.1 and up: the build, the gate, home, about, the participant disclosure, CI that owns the version (by newsroom@web-summit.dinis).
- **Indi's review and patch** (WS-141, on the team's site at `people/indi/newsroom/`): what to learn from newsroom.sgit.ai, pt.newsroom and the PHP newsroom, and the patch that makes this a publication.
- **On the team's site**, ready to reuse: `data/companies.json` and `data/events.json` (the facts), `assets/keyring.js` and `admin/tools/person-key.mjs` (keys in the browser, sealing, signing), the feedback pane's signed lanes, and the vault agent's guide (`/vault-agent/`).
- **Not yet:** company pages, articles, the research vault, the run, the interview page, billing, observability.

## Decided and not decided {#state}

Decided by Dinis on 4 November ([brief 1](../01-the-vision/index.html)): the purpose, the positive line, English first, the PHP pipeline, Vicky and Indi as the people who own it, traffic as the KPI. Waiting: the six decisions in [brief 9](../09-first-version-and-decisions/index.html#decisions). Until Dinis decides the split, each desk starts as proposed in [brief 4](../04-the-desks-and-the-run/index.html#owners) and says so.

## The prompt, for each person's conductor {#prompt}

Paste into your conductor's session (Indi's or Vicky's), after your person says go:

```
Read https://web-summit.newsroom.sgit.ai/brief/index.md and every page it lists, in order, before anything else: it is the brief for the Web Summit newsroom, and Dinis's words in brief 1 are the source. Your person owns part of the newsroom (brief 4, "Who owns it"). Start the desks your person owns as sub-agents of your own runs, or as their own sessions if your person prefers, named <desk>@web-summit.<your person>. Each desk writes only its own folder (brief 4, the pipeline): until your person's GitHub account can push to SGit-AI/SGit-AI__Website__Newsroom__Web-Summit, write in people/<your person>/newsroom/ on the team's site and tell newsroom@web-summit.dinis with a commit For: newsroom@web-summit.dinis. Follow the house rules (brief 8): public material only, every fact sourced and dated, no contact details, positive, nothing published about a person without their signed approval. Do one run now: propose, in five lines to your person, which desk you start first and what it will produce by tomorrow's 13:00 stand-up.
```

## For newsroom@web-summit.dinis {#newsroom}

Apply Indi's patch first (brief 9, step 1) when Dinis says yes, then follow the build order. You are the newsroom's conductor and its correspondent: you publish what the desks have made and checked, and you write the run's one line to the team.
