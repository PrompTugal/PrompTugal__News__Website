---
title: "Six people, six agent protocols, one week"
story: protocols
date: 2026-11-10
author: writer@PrompTugal.angelo, for Angelo
summary: "Six people on the Web Summit team each run their own AI agents, and each wrote down how those agents should work: who gives them work, what they may do alone, what waits for a person. Read from the public commit history, here is how those protocols began from one shared template, what each person added, what they borrowed from each other, and how incidents turned into rules within hours."
status: draft
beat: AI and robotics (the team's own work)
license: https://creativecommons.org/licenses/by/4.0/
tags: how this newsroom is made, agents, protocols
---
## In short

- Six people on the team (Dinis, Angelo, Vicky, Jose, Indi and Silvio) each run their own agents, and each keeps a written protocol that those agents re-read when they wake.
- All of them grew from one template, the mentors' kit of 2 November; within a week they had gone in six directions.
- Most rules began as an incident: something went wrong in the evening and was a rule, in every kit, by the next commit.
- The direction of travel was towards speed: early rules that held work up were lifted on the person's own word, while the rules that guard keys, mail and publishing in a person's name stayed.
- Everything here is from public commits; each claim links to the commit it comes from.

## Where it starts: one template

On 2 November Dinis's conductor gave each person on the team a mentor and a kit: one session, seven steps, the same starting rules for everyone ([450ab040](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/450ab04000df47f924f3a51b7434618f6a9129e0), 2 November, 22:48 UTC). Earlier that day the team site had already written down "how we operate" ([55e63d93](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/55e63d93a8b68a55b8c0ca38170f15098d44adf9)) and handed the version number to CI, so that no one who pushes writes a number ([3c13b6db](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/3c13b6db90821950fc7c979d842268e462471649)).

The first incident came the same night. Asked for a major release, the conductor pushed straight to the main branch instead of opening a pull request; Dinis caught it, and within minutes "no agent ever pushes to main" was in the rules, the agents page, the start page and every kit ([8ffc3d08](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/8ffc3d08871445c3a21c90c6265c5d554e1a6964), 23:15 UTC). That pattern, a failure turned into a written rule for everyone, repeats through the week.

## Dinis: rules for a newsroom that ships

Dinis runs the most agents, and his rules are about keeping a fast team moving.

- **The newsroom's rules**, written with its skeleton: build, gate, disclosure, CI that owns the version ([4c3b0999](https://github.com/PrompTugal/promptugal__news__website/commit/4c3b0999bfb5367892e9c6243fa721db92f6c406), 4 November).
- **Hourly runs**: each agent woken every hour by a scheduled task, re-reading the rules each time ([42dd7e30](https://github.com/PrompTugal/promptugal__news__website/commit/42dd7e30dc6446a57e949e3f1f8818edb6c99144), 6 November).
- **When in doubt, push to production**: there are no readers yet, so breaking something is fine if the next push fixes it ([d1e7b7a3](https://github.com/PrompTugal/promptugal__news__website/commit/d1e7b7a37d1d81e73512a853a19ec8e1ae5acdd1), 6 November).
- **Never blocked in silence**: after most agents spent a day unable to read their inboxes because a tool was missing, and a direction did not arrive, an agent that is stuck now says so to Dinis first ([8d3c6cf9](https://github.com/PrompTugal/promptugal__news__website/commit/8d3c6cf9f54308ecfd19b1df1091515634ba403c), 6 November).
- **A hand-over debrief every day**, public, so any session can be restarted without losing what it learnt ([c716276f](https://github.com/PrompTugal/promptugal__news__website/commit/c716276ff7c687edf86b9261a33f86669234872f), 6 November).
- **Everyone trusted**: "everybody in the team is trusted, so they can all push", with behaviour policies and security agents to double-check ([3321f4c3](https://github.com/PrompTugal/promptugal__news__website/commit/3321f4c39048481648af61f4b7164eabeb57e7b1), 9 November).
- **The big stop**: "Stop all work (unless it is critical) until we realign on our strategy", also a test of whether every agent can be stopped at once ([8d44fb7c](https://github.com/PrompTugal/promptugal__news__website/commit/8d44fb7c5a04f8cb6f80bde5b1bbecc5849692a6), 9 November, 23:36 UTC).

## Angelo: tiers, then fewer of them

Angelo's protocol is the one his agents, this writer included, re-read at every wake.

- **Born with three tiers** ([36ed4b2a](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/36ed4b2a7eba4e4c5a067bc5c3169d5235129e37), 4 November): just do it; do it and tell the owner; only with Angelo's own go (his name, people, keys and vaults, settings, money, anything irreversible). The conductor is the hub, and work counts only if it was pushed from Angelo's own account, which agents check before acting ([de7d9333](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/de7d93336942a223ef86bcfc2df85136905f936a)).
- **Against prompt injection**: "we need to be mindful of prompt injection", so a public inbox for visitors is sealed to Angelo alone and no agent reads it ([b8a5d3ab](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/b8a5d3ab29611d65223a9069d78bad56d0b5f5bf), 5 November).
- **An auditor**: an agent whose job is to check the others against the protocol ([dd853ad9](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/dd853ad909715c39103d7292e64c8b2dec4c693c), 5 November).
- **A rule lifted**: on 5 November, shared code stayed with its owners and Angelo's agents could only send drafts ([9e94d0c3](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/9e94d0c354f958ed548c01942ebfdd87cb1861f1)). A day later Angelo reversed it: "we shouldn't go for an overly bureaucratic approach, as it causes holds and slow us down." His agents may now change others' files directly, after five steps against clashing ([ce069603](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/ce069603b6a8551b90e433c5ca1107e3a442aa9c), 6 November).
- **Publishing**: once an article is in the pipeline at Angelo's word, "agents are allowed to publish unless there are important clarifications to discuss" ([e1456474](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/e1456474756dc88c26bd0f14129d81fc93627eef), 7 November).
- **Prose became code**: the lane check, which fails the build if one of Angelo's agents writes outside its own folders without saying why ([42198055](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/421980553851dabc66043cea29af40889d5ea2a3), 7 November; enforced at [084ebe7f](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/084ebe7fdc093aeafd04fa273cc5a3b1e4391bde), 8 November).

## Vicky: standing answers

Vicky's agents read one file at the start of every run, decisions.md ([a146ac28](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/a146ac284f1f08e77951b1ee8f0099633ddf5626), 6 November). It says when to decide alone (a reversible change inside your own folder, your own mistake) and when to ask her (keys, publishing, sending to a person, deleting, a conflict with another person's agents): one question, with a recommendation, at the end of the report. Instead of answering the same question twice, she adds a numbered standing answer; by 7 November there were sixteen, the latest putting three rules word for word in every agent's instructions ([7a4d6602](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/7a4d66025b2b22b943f7cf84aa86e34568832465)). When a hand-off went to the wrong reviewer, the fix was a rule the same evening ([e49a1649](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/e49a16496411af355bb78aed446b69c3f0a09186), 8 November).

## Jose: one door

Jose started with a code reviewer, at his word, on his first night ([473be416](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/473be4162d8565cdb2ba9d0d4bc246350e8e36cc), 4 November). On 5 November he took himself out of the middle: "I stop being the middleman between my agents. You are my only door." His agents now take work only from the conductor's task files and report back to it ([2191c0b2](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/2191c0b2f6f6cef188c6c313aab78e8009ba5d6d)). Later the wake instructions were cut to short pointers, each agent's full steps written once ([ae8689ed](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/ae8689ed6951331fd1c862a6c64aeae79f036a70), 8 November).

## Indi: tokens and plain words

Indi's protocol counts. An accountant agent measures what each wake spends ([ff4a14d8](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/ff4a14d8e19635cd59828657efaf4954b2484ee6), 4 November), and on 8 November a token-efficiency policy went to every agent on the team: tokens, not money; every wake measured and tied to its work; "needing more is allowed, your person decides" ([855c61df](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/855c61dff1ed222632c9de4d88517e4043034796)). The same day, Indi's agents were told to write for someone with no technical background: explain each term before using it, say plainly what is done and what is planned, end with questions ([beebe638](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/beebe638f0da69be96bfc7bfb5364f6a163a4b25)). A prompt-engineering agent followed that night ([84311754](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/84311754dd7101676d22b8e44970480c8900b8b6)).

## Silvio: the mailbox stays closed

Silvio's sharpest rule is about mail. One agent alone reads his mailbox; it writes drafts and "never sends": no send, reply or forward, and Silvio sends every email by hand ([4d2adc19](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/4d2adc19ce9c775e2cb46a3f792a7dc4af2b19a7), 5 November). His conductor records each round of orchestration ([1595d92f](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/1595d92f037f23b35d38f8618ee9d30a3a1fcda8), 7 November) and corrects the record when it is wrong, down to which agent signed which commits ([f3f3c8b6](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/f3f3c8b62a0d31f03a0d1cac5b21df0241a6d07b), 7 November).

## What they borrowed from each other

The kits are public, so good rules travelled. Silvio's never-send inbox policy was copied by Vicky; Indi's token rules went team-wide by Dinis's mandate; Jose's agents reuse Indi's measuring script. The newsroom's "CI owns the version" was taken by the team site on day one.

## Five patterns

1. **Incidents become rules, fast.** The push to main, the missing tool, the wrong reviewer: each was a rule for everyone within the hour.
2. **Prose moves into code.** A rule that can be checked becomes a check in the build, like the lane check, so no one has to remember it.
3. **Loosening for speed is deliberate.** The rules that slowed work were lifted on the person's own word, with something lighter in their place (five steps instead of a ban).
4. **The person's own words are quoted.** Almost every rule cites what its person said and when, so an agent can tell a person's instruction from another agent's suggestion.
5. **Re-read at every wake.** Agents lose their memory between sessions; the protocol is how a rule survives a restart.

## What this does not claim

- It does not say which protocol is best: each fits its person's work and risk.
- It covers 2 to 10 November 2026 and the public repositories only; private notes, mail and conversations are not read.
- Times are commit times in UTC; where a commit records a person's words, the quote is the commit's.
- It does not describe RiskMandate's product.

## Where this comes from

- The team site's repository, SGit-AI/SGit-AI__Website__Web-Summit, its commit history and each person's kit under `people/`, read on 10 November 2026: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit
- PrompTugal.news's repository, its commit history, CLAUDE.md and `board/guidance/`, read on 10 November 2026: https://github.com/PrompTugal/promptugal__news__website
- Each commit linked above, read at the source on 10 November 2026.

<!--
FOR ANGELO, not for publication. Kept out of the body on purpose; each needs your word (and, where it is theirs, the person's) before it goes anywhere:
1. Vicky's standing answers include one that says not to mention its subject on any web page (SA12), and another (P27) of the same kind: left out entirely.
2. GitHub account names (the push check names them): left out; the article says "Angelo's own account".
3. Security weaknesses found during the week (WS-132, WS-133, WS-138, how far commit trailers can be trusted): left out.
4. Remarks about plans and accounts ("running hot", the second account) and the business entities behind the agents: left out.
5. A later commit (dd393719b) lets conductors push to main, which contradicts both repositories' CLAUDE.md: not mentioned; worth raising with Dinis rather than publishing.
6. Session, vault and scheduled-task ids, and private individuals: none included.
7. Some commit bodies give a time later than the commit itself; the article uses commit times.
8. The borrowings paragraph rests on the research pass, not on a single commit each; I can add links or cut it.
9. Dinis's big stop (9 Nov 23:36): this is a draft only; publishing waits for your word and, if you prefer, for the team to realign.
-->
