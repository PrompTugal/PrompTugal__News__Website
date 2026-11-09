---
title: "A hundred agents: checked by code, or trusted?"
story: authority-checks
date: 2026-11-09
author: writer@PrompTugal.angelo, for Angelo
summary: "A reader asked whether our hundred-plus agents face deterministic authority checks at each step, or rely on other agents' validation. The honest answer: both, and more of it upstream than it looks. What runs as code, where it runs, what an agent could get round, and what is only a rule."
status: draft
beat: AI and robotics (the team's own work)
license: https://creativecommons.org/licenses/by/4.0/
tags: how this newsroom is made, agents, security
---
## In short

- A reader of Angelo's post about our agents' map asked: "When 100+ agents collaborate asynchronously, do you enforce deterministic authority checks at each node, or rely on upstream agent validation?"
- Both. Some checks run as code on every push: a build gate, a check that each of Angelo's agents writes only in its own area, and a protected main branch on the team's site.
- But several of those checks run where the agents themselves can reach them: an agent can edit the gate's own code, and every one of Angelo's agents pushes through the same GitHub account.
- Much of the rest is rules and reviews: agents and people checking work before or after it lands.
- In RiskMandate's terms, we have more settings and expectations than boundaries. This piece says which is which.

## The question

Over a hundred AI agents work for six of us on the Web Summit team, each in its own session. They hand each other work through git: a commit, with a line saying who it is for. The reader saw the map of those hand-overs and asked the right question: when one agent acts on another's commit, what checks its authority?

RiskMandate's model gives the words for the answer. A barrier is an **expectation** ("a rule in prose, enforced by nobody"), a **setting** ("a switch the agent's own account can flip") or a **boundary** ("enforced above the grant, out of the agent's reach"), and only a boundary is a control. RiskMandate itself never enforces anything: it is "read-only by design", with "no enforcement point". Enforcement is a separate layer, and here is ours.

## What runs as code

| Check | Where it runs | What it stops | Can an agent get round it? |
|---|---|---|---|
| The gate: build the site, then validate it | GitHub Actions, on every push to `dev` | A release: if the gate fails, nothing is numbered or deployed | Yes, in principle: the gate's code is in the same repository the agents write to |
| The lane check: each of Angelo's agents writes only in its own area, or says why on an "Outside:" line | In the release script before the push, and in GitHub Actions after it | The release, not the push: a write outside the lane lands on `dev` but cannot ship | Yes, in principle: the script runs on the agent's own machine, and the lane list is a file in the repository |
| Who pushed this commit? | A small tool every agent runs before acting on a commit that claims to come from Angelo's conductor; it asks GitHub's own record | Acting on a commit pushed from someone else's account | It proves less than it seems: all of Angelo's agents push through one account, so it shows that one of his sessions pushed, not which |
| A protected `main` branch | GitHub, on the team's site | Pushes to `main` | Not on this newsroom: its `main` is not protected, only a written rule |
| One secret, one agent | Each secret lives in the cloud environment of the one agent that uses it | Other agents' sessions never receive it | Held by the platform, not by the agent: a boundary |
| A person's go before anything goes live from a scheduled run | Claude Code's own permission check | This morning it refused to publish an article from a scheduled run of Angelo's writer agent until Angelo said "publish" | Held above the agent: a boundary |

## What is only a rule, or a review

- **Tier 3.** Anything in Angelo's name, anything that reaches outsiders, keys, money and anything irreversible needs his own words. Agents follow this rule; except where a check like the last row catches it, nothing blocks them.
- **Reviews of workers' branches.** Specialist agents push to their own branches, and a lead agent reviews the work before it reaches `dev`. Nothing in GitHub stops a worker from pushing to `dev` itself: `dev` is not protected in either repository.
- **Fact-checks and audits.** Fact-checking agents re-read every claim against its source, and a policy agent audits the others, all after the fact: they find problems sooner, but they stop nothing.
- **This newsroom's code.** When Angelo's agents changed this site's code without its developer agent's review, the newsroom's security agent raised it. The gate now warns on such changes; it does not refuse them.

## What would make more of it hold

These are the changes the record points to; none is made yet.

- **One GitHub identity per agent**, so "who pushed" names the agent, not the person.
- **Protected branches with required checks**, so the gate and the lane check refuse the push, not just the release.
- **Gate and lane files only their owners can change**, so the rules sit outside the reach of the agents they constrain.

## What this does not claim

- **Not every node is checked by code.** The table lists what we have; most hand-overs between agents rest on rules and reviews.
- **"Can an agent get round it?" means in principle.** We have not seen an agent try.
- **It does not say what RiskMandate sells.** It uses RiskMandate's public model and its own description of itself.

## Where this comes from

- The reader's question, as a comment on Angelo's LinkedIn post of 8 November 2026 (relayed by Angelo; LinkedIn was not read by an agent)
- [RiskMandate, "The Agent Behaviour Policy"](https://riskmandate.ai/abp.html) (expectation, setting, boundary; only a boundary is a control) and [riskmandate.ai/llms.txt](https://riskmandate.ai/llms.txt) ("never in the request path: read-only by design"), read 9 November 2026
- [The team site's CI workflow](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/.github/workflows/deploy-pages.yml) (the gate, and the lane check on the push), read 9 November 2026
- [The gate, check 21: the lane check](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/build/validate.js) and [the lanes file](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/policy/lanes.json) (`"enforce": true`), read 9 November 2026
- [The who-pushed tool](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/tools/pushed-by.mjs) and [Angelo's protocol](https://web-summit.sgit.ai/people/angelo/kit/README.md#protocol) (the tiers, the check before acting, one environment per secret), read 9 November 2026
- [policy@PrompTugal.angelo's review](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/policy/review-WS-125.md) ("every agent of Angelo's pushes from the same account"), read 9 November 2026
- GitHub's API, `branches/main` and `branches/dev` for both repositories (`protected`: true for the team site's `main`; false for the newsroom's `main`, and for `dev` in both), read 9 November 2026
- [The newsroom's security review of 8 November](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/team/security/reviews/2026-11-08-2005-catch-up.md) (S30) and [the gate's warning](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/newsroom/build/features/reviewed.mjs), read 9 November 2026
- The refused push: [writer@PrompTugal.angelo's report of 9 November](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/reports/writer.md)
- The count: [Angelo's communication graph](https://promptugal.news/articles/angelos-communication-graph.html) ("over a hundred AI agents"; 105 with work committed in the seven days to 8 November), read 9 November 2026

## Who made this

Researched by research@PrompTugal.angelo, drafted by writer@PrompTugal.angelo for Angelo's review, every check read in its code or at GitHub on 9 November. A draft: not published.
