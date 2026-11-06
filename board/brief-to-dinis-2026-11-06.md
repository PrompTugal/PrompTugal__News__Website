---
title: "For Dinis: what PrompTugal.news needs from you before Friday 10:00 UTC"
by: conductor@PrompTugal.dinis
written: 2026-11-06T00:25Z
issue: WS-177
---
# For Dinis: what needs you

**Update at 00:45 UTC, after your answers:** keys, board and admin now live in this repository (`board/keys.json`, `board/`, `/admin/`), the team site is not touched; the spelling is PrompTugal, capital P and T; the brand guide (`design/brand/Promptugal-Brand-Guide.pdf`) settles the logo; the story of the name goes in the admin section; you are on the email addresses. Items 1, 2, 3 and 7's first point are settled; 4 is in hand; 5, 6 and Silvio's agents remain.

**Status at 00:25 UTC.** promptugal.news is live (v0.1.37) on GitHub Pages with HTTPS; DNS and the CNAME are right. The plan for the six agents is `board/WS-177-plan.md`. Eight articles are drafted and reviewed Ready; the agents can publish them tonight without you. What follows cannot move without you, most urgent first.

## 1. Access for this session to the team's site (settled: keys and board live here now)

Attaching SGit-AI/SGit-AI__Website__Web-Summit with push was refused by this session's permission check. My session key exists (record sha256:4a76444c8799594b, encryption sha256:0d045a0b55734ac7, linked locally to your key sha256:db7f79fdd87e030a); its public half, ready as the `data/keys.json` entry `conductor-promptugal`, is in this repository at `board/keys/conductor-promptugal.json`. **Either** allow `add_repo` for that repository in this session, **or** have conductor@web-summit.dinis copy that entry in. Until then nothing I sign can be checked against the team's keys. The other five agents will hit the same refusal on their first run.

## 2. The logo (blocks: the masthead, the cards)

Eight options from designer@web-summit.vicky in `desks/designer-vicky/logos/` (01 to 08, plus two marks). The site uses the brand v2.0 wordmark today. **Your pick:** a number, or "keep the v2.0 wordmark".

## 3. The spelling on the cards (blocks: the cards, every email signature)

Four spellings are in use tonight: **PrompTugal.news** (brand v2.0, this repository's CLAUDE.md), **PromptUGAL** (WS-177's title and text), **Promptugal News** (the team site's commits, v0.2.682 to v0.2.684), **PROMPTugal** (logo option 03). **Your word:** one spelling, for the cards, the masthead and the emails. I will then ask for the others to be brought in line.

## 4. Email addresses on promptugal.news (blocks: outreach)

WS-177 item 5 says you set them up. Needed: the mail provider and MX records for promptugal.news, and which addresses the editors send from (for example one per editor, or one shared). The agents only draft; a person sends. Tell me the addresses' shape (not the passwords), and outreach@ writes the drafts' signatures to it. Nothing about them is published until you say so.

## 5. The old address (blocks: WS-177 item 4)

web-summit.newsroom.sgit.ai now answers 404. Its DNS already points at sgit-ai.github.io (dev@PrompTugal.dinis checked), and dev@ has written `admin/tools/old-host.mjs`, which makes the redirect pages. **What it needs from you:** a new repository in the SGit-AI organisation with Pages on and the custom domain web-summit.newsroom.sgit.ai (REALITY.md, "Waits on Dinis", has the steps), or your word to leave it dead. Note: that repository is outside this one, so it is an exception to "don't touch the other repos" only if you say so.

## 6. Access tokens (none committed, ever)

- **None is needed for 10:00** beyond the above. The agents push with this session's GitHub access.
- **Later:** the vault access key for readers (REALITY.md, "Waits on Dinis"), and a Stripe payment link that returns to promptugal.news (REALITY.md's steps for it still name web-summit.newsroom.sgit.ai as the return address; use promptugal.news). If the CRM's private vault key should reach outreach@PrompTugal.dinis, it goes sealed to its session key once that key is on the team's site (item 1), never in a repository.

## 7. Two decisions only you can make

- **The story of the name**, as an article (WS-177 item 1): the journalist needs it in your words, or your yes to quote WS-177's text ("If you don't get the name, you're not the target audience ... it's about prompts in Portugal.").
- **Silvio's agents.** The team site asks you (conductor@web-summit.silvio, 5 November) for Silvio's push access to this repository and agents named `<agent>@PrompTugal.silvio`. This repository's CLAUDE.md names only six `@PrompTugal.dinis` agents. Your word decides whether they join, and as what.
