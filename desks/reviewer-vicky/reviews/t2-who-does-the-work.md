---
story: T2
draft: desks/journalist-vicky/drafts/t2-who-does-the-work.md
reviewed: 2026-11-06
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: Fix first
---

# T2 review: who does the work

**Verdict: Fix first.** The counts hold: 93 agents, and every person's number (Dinis 38, of them 11 on the team's site and 27 in the newsroom; Vicky 18; Indi 10; Jose 10; Silvio 9; Angelo 8), recomputed from both keys files as the draft describes. Four sentences need the journalist, and the closing line needs Vicky. 532 words: no cut needed. Reviewed as of commit `a4f05b23`; held for Vicky's approval in any case.

Checked 6 November 2026, about 21:45 UTC, against the team site's `data/keys.json`, `data/team.json` and `people/*/agents.json`, the newsroom's `board/keys.json` and `CLAUDE.md`, each as it stood when the draft was written (the last changes to them were before 21:00).

## Fix first

1. **"Some agents work inside another agent's session, such as Jose's code reviewer, or Angelo's writer and his conductor's hourly runner."** Only Jose's reviewer does ("a sub-agent in each of Jose's agents' sessions", `people/jose/agents.json`). Angelo's writer runs in "a Claude Code cloud session per piece", and the conductor's runner in "a fresh Claude Code cloud session for every run"; they have no key, and the runner commits under the conductor's name (`people/angelo/agents.json`). Suggest: "Some agents have no key of their own, such as Jose's code reviewer, which works inside his other agents' sessions, or Angelo's writer and the conductor's hourly runner, which commits under the conductor's name." (Use the names, not "his": see 4.)
2. **"For Vicky, Indi and Silvio the two match exactly."** Only Vicky's match agent by agent. Indi's and Silvio's match in number only: Indi's keys include a recruiter and not the designer, the list the other way round; Silvio's keys include vault@ and not outreach@, the list the other way round. Suggest: "For Vicky the two match exactly; for Indi and Silvio the totals match."
3. **"We counted every key without those marks."** Not quite what gives 93: three unmarked team-site keys are left out (`vault-registry`, and `conductor` and `conductor-2`, which say "ended" only in their role text), and Indi's two conductor keys count as one agent. Taken literally the sentence gives 96. The choices are sound; say them: "...and left out keys that say elsewhere they have ended, or that belong to a vault, not an agent."
4. **Pronouns.** "Vicky's designer waits until she asks" and "Angelo's writer and his ...": no source gives Vicky's or Angelo's pronouns (the team's `data/team.json` uses "they" for both), so STYLE.md says use the name. Dinis's "he" and "his" are fine: `data/team.json` uses them.

## The closing line (all of T1 to T5): for Vicky

"Want to see these agents at work? Meet the team behind PrompTugal.news at Web Summit, booth A1-30 in Pavilion 1, on Thursday 12 November."

- **The stand is RiskMandate's.** The cited page says: "RiskMandate exhibits on Thursday 12 November 2026, booth A1-30, in ALPHA 1, Pavilion 1" (https://web-summit.sgit.ai/summit/). Date, booth and pavilion are right; the line just doesn't say whose stand it is, so a reader looks for a PrompTugal.news sign. Suggest: "Meet the team behind PrompTugal.news at RiskMandate's stand at Web Summit: booth A1-30, Pavilion 1, on Thursday 12 November."
- **Where the booth details come from.** The same page gives its own source as "Web Summit's Startup Success team, email to the RiskMandate team, received 5 November 2026 (not public; forwarded by Silvio)". The page is public, but the newsroom's rule is to publish only public facts. Vicky's call (and RiskMandate's stand may be Dinis's): publish as is, or wait until Web Summit shows the booth in its own public app or map.
- **Format.** Its source sits in a "Who made this" section; STYLE.md says the publisher writes that section. The line belongs in "Where this comes from".

## Small, the journalist's call

- "Nimay works without them": say "the others work without them" rather than naming one person.
- "Ten of Vicky's 18 agents write and check the news": by name, eight do (five journalists, the curator, the reviewer, the checker); ten if the programme agent and the researcher count. The "By job" table is the draft's own sorting, and says so.

## What checks out

The 93 and each person's count; Dinis's 11 and 27, the 27 named in the newsroom's CLAUDE.md; Vicky's five beat journalists, curator, reviewer and checker; a conductor for each of the six, two for Dinis; a dashboard agent for five of them; the "superseded", "retired" and "ended" marks; the roles in the table, from `data/team.json`; Vicky's designer paused until Vicky asks; every source link. No contact details, nothing personal beyond the professional, no claim for RiskMandate.

## Status

Set to `status: fix`. No style edit yet.

## Check again, 6 November 2026, about 22:10 UTC

journalist-ai's commit `bfecef10` (21:38, a minute before this review was committed) settles the first point under "The closing line": it now names "the RiskMandate booth, A1-30 in Pavilion 1", as the source says. Dinis's row now reads "Operator: RiskMandate, the strategy", which is what the team's `data/team.json` says ("Operator: RiskMandate, the strategy, the senior meetings"). Still open: the four Fix first points above, the booth details' non-public origin (Vicky's call), and moving the stand's source line from "Who made this" into "Where this comes from". Verdict unchanged: Fix first.

## Check again, 6 November 2026, about 22:25 UTC

**Verdict: Ready. Held for Vicky's approval.** journalist-ai's commit `d2586e1c` makes every Fix first change above, each checked at its source. The booth line stands with Dinis's yes (21:35 UTC, Vicky's word).

Style edit (mine, committed on its own): the stand's source line moved from "Who made this" into "Where this comes from", unchanged. Words: 573, unchanged; no cut needed.

Status: `ready`. Vicky sets `approved`.

Checked: The counting rule now says what was left out and that an agent with two keys counts once; "for Indi and Silvio the totals match"; the keyless helpers described as they are; Vicky by name. "Ten of Vicky's 18 agents research, write and check the news" counts the researcher and the programme agent: fair.

## Images, 6 November 2026, about 22:25 UTC

At Vicky's word, images only (journalist-ai's commits `732a07c3` and `7f1d77fd`), rendered at phone width (390 px screen, 358 px in the article column, as on the live T1 page). The bar chart: readable on a phone (names and values at about 13 px); its six bars match the alt text, the table and the text (Dinis 38, Vicky 18, Indi 10, Jose 10, Silvio 9, Angelo 8, 93 in all); its caption's sources are the two keys files the counts come from, both in the source list; light and dark colours. **Images: pass.**
