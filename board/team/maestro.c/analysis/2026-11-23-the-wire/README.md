# The wire: seeing every message between the agents (proposal, maestro.c, 23 November 2026)

Dinis, maestro.c's session, about 01:25 UTC 23 Nov: "I should have a website. One of our agents should be able to show me these exact communications. I want to be able to see these exact messages and when they happen and what's the flow and figure out a way to publish this data. Even if it's sort of afterwards ... every single message and every single sort of communication that happens within the agents, because especially as we productize this and give to other customers, this level of visibility is absolutely critical."

## Where the messages are today

| Channel | Example | Who can see it now | Recorded? |
|---|---|---|---|
| send_message between sessions (same account only) | maestro.c to conductor.c, about 40 on account C since 22 Nov 17:15 | only in the two sessions' transcripts | no: lost unless someone reads the transcripts |
| Repository files written for another agent | board/team/maestros/from-*.md; conductor.c's to-d.md; claims.md | anyone, in git | yes, with time, author and signature |
| Sealed vault inboxes | board/inboxes/<role>.json lanes | only the holder of the key | yes, sealed |
| The routers' ledger | board/routers/ledger/ requests, claims, receipts | anyone, in git | yes, signed |
| Dinis's words in a session | "yes start router.c's :08 wake" | that session only | only where an agent copies them into a decisions/ file |
| Scheduled wakes and their prompts | maestro.c's :33 task | list_triggers on that account | the prompt yes, each firing no |

So most of what crosses accounts is already in git, while most of what happens within an account (send_message) is not recorded anywhere a page can read.

## Options

**A. Harvest what is already in git (no change to any agent).** A collector walks the git history of every repository the agents write (this one, the Factory, the site repositories) and turns each line of from-*.md and to-*.md, each claims row, each ledger request, claim and receipt, each inbox append and each decisions/ record into one event: time, from, to, channel, kind (state, ask, answer, claim, dinis, request, receipt), the text or its hash, the commit and its signature. Good: works today, signed, covers every cross-account message. Bad: misses send_message entirely, and the in-session words of Dinis that nobody copied.

**B. Record every send_message at the sender, with the hook.** The ABP hook (.claude/hooks/abp.mjs) already runs before every tool call in sessions on this repository. One addition: when the tool is send_message (or create_session, create_trigger, archive_session), append an event to the session's own log (board/comms/<date>/<agent>.jsonl, committed at the next wake): time, from session and name, to session, the text, its hash. Good: complete for this repository's sessions, no reliance on agents remembering. Bad: sessions on other repositories (the Factory, the site repositories) need the same hook in their .claude/; .claude/ and the hooks are abp@'s to change (R6), with Dinis's yes.

**C. Read it back from the transcripts.** telemetry.b (account B) is the only session allowed to read other sessions' transcripts (Dinis, 18 Nov). Per account, a telemetry agent lists each session's send_message calls and the messages each received (list_events), and writes the same events. Good: catches everything on that account, sender and receiver both, including messages from sessions that have no hook. Bad: one telemetry agent per account (telemetry.c here), transcripts are raw and may hold things that must not be published, so this one is an audit, kept in a vault.

## Recommendation

All three, in this order, because each covers what the others miss:
1. **Now: A**, by observability.c (account C; observability already owns "what the agents do") with the data in this repository at board/comms/ (one JSONL per day, one event per line, the schema below), refreshed at each of its wakes.
2. **Next: B**, a proposal to abp@ (account B, back since 00:27 UTC) for the hook change, then the same hook seeded into the Factory's starter files so every site repository has it.
3. **Then: C** as the check: telemetry.b and a telemetry.c compare what the hooks logged with what the transcripts show, and report any message that went unlogged.

**The page:** hub.c already plans "the agents now and over time and how they connect" on hub.sovereignweb.site. The wire becomes that page: a timeline of messages (newest first, filter by agent, account, channel, kind), a graph of who talks to whom over a chosen hour or day, and each message opening to its text, its signature and the commit or session it came from. For customers it is the same page on their own hub, reading their own log.

## What is published and what is not

- Public (the default for agent-to-agent messages, which are already written to be public in this estate): time, from, to, channel, kind, the text, the signature.
- Sealed (in a vault only Dinis and the owner can open): anything a sender marks private, every sealed-inbox message (published as time, from, to and hash only), and everything harvested from transcripts by C.
- Never: a key, a token, a contact detail, a private person's name, an account email; the collector runs the same scans as the gate and holds back any event that fails them, listing it as "withheld" with its hash.

## The event (one line of board/comms/<YYYY-MM-DD>.jsonl)

```json
{"at":"2026-11-23T01:22:00Z","from":"maestro.c (account-c)","to":"maestro.b (account-b)","account_from":"c","account_to":"b","channel":"repo:from-c.md","kind":"ask","text":"...","sha256":"...","source":"PrompTugal__News__Website@<commit>","signed_by":"maestro.c-account-c","visibility":"public"}
```

## For Dinis

1. Yes to A now by observability.c, data in board/comms/, page by hub.c?
2. Yes to sending B to abp@ as a proposal?
3. Start telemetry.c on account C for C (or wait and let telemetry.b do account B first)?
