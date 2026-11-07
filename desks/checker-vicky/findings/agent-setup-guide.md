# agent-setup-guide (WS125): five findings

For: writer@PrompTugal.angelo. Checked 7 November 2026, about 18:40 UTC, by checker@PrompTugal.vicky: facts, sources and links only, not the advice. Each point checked at its source that day.

1. **"None of these products enforces a policy on the processes an agent starts."** Claude Code, in the guide's own table, does: "The Bash sandbox is a boundary that the operating system enforces around the shell commands Claude runs ... the limits apply to Bash, PowerShell, and Monitor commands and the processes they start" (https://code.claude.com/docs/en/sandboxing.md). Gemini CLI documents sandboxing too (macOS Seatbelt, containers, gVisor: https://geminicli.com/docs/cli/sandbox/).
2. **"No tool listed here keeps a secret from the agent that uses it. Today an agent that can use a secret can read it."** Claude Code's cloud environments: "A network secret is an API key or token you store on a cloud environment so Claude can call that API from any session in the environment without seeing the key" (https://code.claude.com/docs/en/cloud-environments.md).
3. **"the main branch is protected and merged by a person."** True of the team site; not of this newsroom's repository, whose `main` is not protected (GitHub API, `repos/PrompTugal/PrompTugal__News__Website/branches/main`: `"protected": false`, 7 November 2026). The rule (never push to main) is in CLAUDE.md; the protection is not on GitHub.
4. **"Dinis Cruz authorised its publication on PrompTugal.news."** The only record is Angelo's own words: the writer's check file says "Still open: Dinis's authorisation is recorded only in Angelo's words (dev@'s item 7); Angelo asks Dinis to confirm it" (`desks/writer-angelo/checks/ws125.md`). No commit from Dinis or his conductor confirms it in either repository.
5. **"on 6 November Angelo's agents changed it"** (the rule on other people's files). The change was Angelo's own: "Other people's files: change them directly, without clashing (Angelo, 6 November, replacing option 1 of 5 November ...)" (team site, `people/angelo/kit/README.md`).

Smaller: the GitHub page cited for "GitHub Copilot coding agent" now redirects to "GitHub Copilot on GitHub.com and GitHub Mobile", which calls it "Copilot cloud agent"; we cannot see what it said on 6 November.

## What checks out

RiskMandate's barrier table and ABP definitions, word for word; SHarness's status and licence; sgit's licence; the Claude help pages on Projects and connectors; "Scheduled tasks" (formerly routines) and their plans; Microsoft's and Gemini CLI's descriptions; the team's figures at 6 November, 23:56 UTC (9 people, 70 active keys); Angelo's protocol as quoted; the session branches; the provenance and the signature. No key, token or contact detail. All links open except the Gemini CLI GitHub page, which this session could not reach.
