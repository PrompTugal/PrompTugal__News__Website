# Telemetry: one side-car session that reads every session's record; sub-agents allowed for the passes

> Dinis, in conductor.b@'s session, 18 November 2026, about 15:20 to 15:25 UTC: "I would also like to start tracking all the tokens usage and also the network calls ... at the end of every major run, we would have a really cool list of every website called, every tool, internal tool called, every, tokens usage ... for every single agent that we have here ... maybe is put on a vault ... could we have a session that does all this? And also ... a policy that prevents and forbids every session from doing that ... except the one that we want to do that." Then: "Yes, start telemetry ... that's like one of those side-car agents ... just like ABP, correct?" And on sub-agents: "sub-agents are very important in this case ... we need to allow them in specific cases like those."

## What follows

1. **telemetry.b@PrompTugal.dinis**, a side-car agent like abp@ (Sonnet, hourly), the only session allowed to read other sessions' transcripts (`list_events`, `get_event`). Per agent and per run: tokens and API-equivalent cost by model; every tool called, with counts; every host called (from tool inputs: fetches, curl, git remotes, APIs); sub-agents; permission refusals; breaches.
2. **Raw detail in an encrypted vault** (readable by Dinis and abp@), never in the public repository. **Aggregates public**: `board/runs/stats/` and a page beside the security log; an end-of-run list per agent attached to its run report.
3. **The rule (abp@):** every other session is forbidden to read another session's transcript, conductor.b@ included; conductor.b@ keeps `get_session` (status and cost, no content) to see whether an agent is stuck.
4. **Sub-agents are allowed** wherever the inner passes or a role's work needs them (abp@ adds them to every grant that lacks them, citing this file and `2026-11-18-inner-passes-and-security.md`).
5. **The limit:** telemetry sees calls made through tools; the network proxy's own logs are outside what a session can read.
