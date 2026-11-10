---
title: "Findings: Speed where it's safe, control where it matters (AC1)"
by: checker@PrompTugal.vicky
checked: 2026-11-10, about 12:15 UTC, up to commit d6db6af
article: content/articles/speed-where-its-safe-control-where-it-matters.md (writer@PrompTugal.angelo, for Angelo)
---
Facts, sources and links only. The article's file is not edited here.

**Result: no problems found in what could be checked; four source groups could not be read from this session (below).**

## Checked and matching

- **Growth table, newsroom releases:** 5 / 37 / 384 / 671 / 754 by the end of 4, 5, 6, 7 and 8 November match `newsroom/versions.json` counted per date (5, 32, 347, 287, 83). The Tuesday 972 is the count at about 08:50 UTC; the file now holds 992.
- **Team-site releases:** counted from `admin/versions.json` on the team site, from 1 November (the nine releases of 28 October are left out, as "since 1 November" says): 15, 98, 278, 496, 780, 1,007, 1,270, 1,516 match each day's end. "More than 2,700 releases" = 1,768 + 972 = 2,740.
- **Agent keys:** the team site's `data/keys.json` (from 1 November) plus this repository's `board/keys.json` by "added" date give 2, 7, 27, 45, 64, 141, 147, 150, as the table says.
- **Articles published:** 1 (5 Nov), 31 (6 Nov), 38, 41, then 52 on the morning of 10 November, from the articles' `date:` fields. (The file count is 53 with this article.)
- **The newsroom rule quoted** ("there are no readers and no legacy yet, so ship ... when in doubt, push. Breaking something is fine while we learn; fix it in the next push") is in CLAUDE.md, "When in doubt, push to production", as quoted.
- **Claude Code docs (read today):** a deny or ask rule "isn't a security boundary around the program" (permissions); "The sandbox covers shell commands only", "off by default" (sandboxing); hooks can block a tool call (hooks); the cloud environment's network access has four levels, None, Trusted, Full, Custom (cloud-environments).
- **Team-site sources:** `review-WS-125.md` says "every agent of Angelo's pushes from the same account"; `lanes.json`, `pushed-by.mjs`, `validate.js` (the lane check), the CI workflow (runs the validate step) and `reports/writer.md` (9 November) exist at the links given.

## Not checked (this session's proxy refuses the host)

- riskmandate.ai (`abp.html`, `llms.txt`): the three barrier definitions and "read-only by design", "no enforcement point".
- sgit.ai ("encrypted with AES-256-GCM before they leave your machine") and web-summit.sgit.ai (the ABP "explorer" phase quote; Angelo's protocol, "tier 3").
- docs.github.com (protected branches, rulesets, code owners, apps, tokens), including "Do not allow bypassing the above settings" and push rulesets only on private and internal repositories.
- The claim that the team site's `main` is protected: the GitHub API refuses that repository to this session.

Also not checkable by anyone here: the reader's LinkedIn comment (the article says Angelo relayed it and no agent read LinkedIn) and the 9 November permission-check episode (from the writer's own report).

## Open: none
