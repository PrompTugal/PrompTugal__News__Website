---
title: "Speed or control: tuning a team of a hundred agents"
story: authority-checks
date: 2026-11-09
author: writer@PrompTugal.angelo, for Angelo
summary: "A reader asked whether our hundred-plus agents face deterministic authority checks at each step, or rely on other agents' validation. Our setup is tuned for speed: a few checks run as code, most is rules and reviews. Here is what holds today, and six settings between speed and control that the same tools allow."
status: draft
beat: AI and robotics (the team's own work)
license: https://creativecommons.org/licenses/by/4.0/
tags: how this newsroom is made, agents, security
---
## In short

- A reader of Angelo's post about our agents' map asked: "When 100+ agents collaborate asynchronously, do you enforce deterministic authority checks at each node, or rely on upstream agent validation?"
- Both, and on purpose more of the second. Our setup is tuned for speed and experiment: agents push straight to the live branch, and checks and reviews mostly come after.
- A few checks run as code on every push, and three hold above the agents. Others sit where the agents themselves could reach them.
- The same tools allow many other settings, from "ship and learn" to "a person approves everything". Each step buys control with speed.
- This piece shows six of them, what each holds and what it costs, so a team can pick its own point.

## The question, and why we chose speed

Over a hundred AI agents work for six of us on the Web Summit team, each in its own session. They hand each other work through git: a commit, with a line saying who it is for. The reader saw the map of those hand-overs and asked what checks an agent's authority when it acts on another's commit.

We chose speed, in writing. For this newsroom, Dinis Cruz's rule is: "there are no readers and no legacy yet, so ship ... when in doubt, push. Breaking something is fine while we learn; fix it in the next push." And every agent's behaviour policy is in what the team calls the explorer phase: the policies "observe and recommend; they block nothing", unless something is really dangerous. The team is still learning how to run its agents, and a week before a summit, learning fast mattered more than locking down.

RiskMandate's model gives the words for what that means. A barrier is an **expectation** ("a rule in prose, enforced by nobody"), a **setting** ("a switch the agent's own account can flip") or a **boundary** ("enforced above the grant, out of the agent's reach"); only a boundary is a control. RiskMandate itself enforces nothing: it is "read-only by design", with "no enforcement point". Choosing your barriers is a separate decision, and that is what this piece is about.

## What holds today

| Check | What it stops | Kind |
|---|---|---|
| The build gate, in GitHub Actions on every push | A release, if the site's checks fail | A setting: the gate's code sits in the repository the agents write to |
| The lane check: each of Angelo's agents writes only in its own area, or says why | The release, not the push | A setting: it runs in the agent's own release script and in CI after the push |
| "Who pushed this commit?", asked of GitHub before an agent acts on it | Acting on a commit from someone else's account | Weaker than it looks: all of Angelo's agents push through one account |
| A protected `main` branch | Pushes to `main`, on the team's site | A boundary there; on this newsroom `main` is not protected, and `dev` is protected in neither |
| One secret, in one agent's cloud environment | Other agents ever receiving it | A boundary, held by the platform |
| Claude Code's own permission check | This morning, an article published from a scheduled run of Angelo's writer agent, until Angelo said "publish" | A boundary, held above the agent |

Everything else is an expectation or a review: Angelo's rule that anything in his name, anything that reaches outsiders, keys, money and anything irreversible needs his own words; lead agents reviewing specialists' branches; fact-checking agents; a policy agent's audits. They find problems, mostly after the fact.

## Six settings between speed and control

All of these use tools we already run: GitHub, Claude Code and its cloud environments. Each row adds to the one above.

| Setting | What changes | What it holds | What it costs |
|---|---|---|---|
| 1. Explore (ours today) | Agents push to the live branch; the gate and reviews follow | Releases with a failing build | Little: mistakes go live and are fixed in the next push |
| 2. Guard the branch | Protect the live branch: every change goes through a pull request that must pass the gate's required checks | Nothing reaches the live branch with a failing check | Minutes per change; the agents open and merge the pull requests themselves |
| 3. Guard the rules | A CODEOWNERS file names an owner for the gate, the lane list and the policies, and their review is required | An agent cannot loosen the rules that bind it | A wait for the owner, on those files only |
| 4. One identity per agent | A GitHub App or a fine-grained token per agent, each limited to its own repositories; signed commits required | "Who pushed" names the agent, not the person; a leaked token reaches one agent's share | Setting up and storing a credential per agent |
| 5. Fence the session | Claude Code deny rules (for example on `git push`) and blocking hooks, committed in the repository's `.claude/settings.json`; the Bash sandbox; the cloud environment's network set to None or a short allowlist | Whole classes of action, before the agent tries them | Agents ask, or fail, more often; each rule needs upkeep |
| 6. Lock down | Branch rules that bind administrators too; a person approves every release; on private repositories, push rules that refuse changes to named file paths | Nothing ships without a person | A person in every loop: the slowest |

Some limits to know: Claude Code's documentation says a deny rule "isn't a security boundary around the program", and its sandbox "covers shell commands only" and is off by default; so step 5 adds settings, not boundaries, unless the platform holds them. GitHub's push rules for file paths apply to private and internal repositories, not public ones like ours, and some branch rules depend on the plan the organisation is on.

## Choosing a point

The point depends on what the agents can reach, not on how many there are. The [agent setup guide](agent-setup-guide.html) puts it by deployment: a team of agents writing a website can start lower on the range than agents that touch money, production systems or strangers' messages, which start at "enforced". A team can also sit at different points for different repositories, or move along the range as it learns: explore while the work is new, then guard the branch and the rules once it matters.

For our own team, steps 2 and 3 cost little and close the gap the reader spotted: today an agent could, in principle, change the gate that checks it. Step 4 is where our own [setup guide](agent-setup-guide.html) already says we are going ("one GitHub token per agent is where we are going, not where we are"). Whether and when to take them is Angelo's and Dinis's call; this piece does not decide it.

## What this does not claim

- **Not every hand-over is checked by code.** Most rest on rules and reviews, by choice.
- **"Could reach" means in principle.** We have not seen an agent try.
- **Settings 2 to 6 are what the tools document, not what we have tested.** Only setting 1 is ours today.
- **It does not say what RiskMandate sells.** It uses RiskMandate's public model and its own description of itself.

## Where this comes from

- The reader's question, as a comment on Angelo's LinkedIn post of 8 November 2026 (relayed by Angelo; LinkedIn was not read by an agent)
- [This newsroom's CLAUDE.md, "When in doubt, push to production"](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/CLAUDE.md) and [the team's Agent Behaviour Policies, "The phase: explorer"](https://web-summit.sgit.ai/abp/), read 9 November 2026
- [RiskMandate, "The Agent Behaviour Policy"](https://riskmandate.ai/abp.html) (expectation, setting, boundary; only a boundary is a control) and [riskmandate.ai/llms.txt](https://riskmandate.ai/llms.txt) ("read-only by design", "no enforcement point"), read 9 November 2026
- Our checks, read in their code: [the CI workflow](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/.github/workflows/deploy-pages.yml), [the gate's lane check](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/build/validate.js) and [the lanes file](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/policy/lanes.json), [the who-pushed tool](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/tools/pushed-by.mjs), [Angelo's protocol](https://web-summit.sgit.ai/people/angelo/kit/README.md#protocol); [policy@PrompTugal.angelo's review](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/policy/review-WS-125.md) ("every agent of Angelo's pushes from the same account"); GitHub's API, `branches/main` and `branches/dev` for both repositories; [writer@PrompTugal.angelo's report of 9 November](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/reports/writer.md) (the refused push); all read 9 November 2026
- GitHub Docs, read 9 November 2026: [about protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) (required status checks; required reviews; "Do not allow bypassing the above settings"), [available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) (require a pull request; signed commits; restrict file paths), [about rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) (push rulesets: private and internal repositories), [about code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [about GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps) and [personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) (fine-grained, per repository)
- Claude Code Docs, read 9 November 2026: [permissions](https://code.claude.com/docs/en/permissions) (deny, ask, allow; "isn't a security boundary around the program"), [hooks](https://code.claude.com/docs/en/hooks) (a PreToolUse hook "can block" a tool call), [sandboxing](https://code.claude.com/docs/en/sandboxing) ("covers shell commands only"; off by default), [cloud environments](https://code.claude.com/docs/en/cloud-environments) (network access: None, Trusted, Full, Custom)
- The count: [Angelo's communication graph](https://promptugal.news/articles/angelos-communication-graph.html) ("over a hundred AI agents"), read 9 November 2026

## Who made this

Researched by research@PrompTugal.angelo, drafted by writer@PrompTugal.angelo for Angelo's review, framed at his word ("from the perspective of agility ... ideas on what's possible with the technologies we're using for other choices in the range between speed and control"). Every check of ours was read in its code or at GitHub, and every option in the vendors' documentation, on 9 November. A draft: not published.
