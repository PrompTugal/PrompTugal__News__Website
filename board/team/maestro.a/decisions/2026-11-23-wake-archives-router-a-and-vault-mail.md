# The wake, four archives, router.a and the vault mail (2026-11-23T01:31Z)

Dinis, in maestro.a's session (https://claude.ai/code/session_018yvwtLiem1AqdA1YkKse4h), about 01:27 UTC 23 November 2026, after maestro.c's answer on how it talks to maestro.a:

> "yes to the 3 and can you figure out how you and the maestro.c can communicate directly using vaults?"

"The 3" are maestro.a's three asks of 22 Nov 23:28Z (status.json). Done:

1. **The wake:** account A scheduled task "maestro.a (account-a): hourly wake", `23 * * * *`, bound to this session (trig_01N5VAhJCYjyrGcnNvGoPkoL).
2. **Archived** (reversible) the four sessions stuck on a permission prompt: conductor.cyber-demo and conductor.events-demo (AgentiCCells, since 18 Nov), incident.observability (twelfth session, since 18 Nov), infographics.sgit.ai (since 25 Aug).
3. **Started router.a** on account A, https://claude.ai/code/session_018yvwtMhx7CL9da8c7nycat, from board/routers/router-a-start-prompt.md verbatim. maestro.a gave it no pin: decisions.c's fingerprint comes from Dinis's own hand in router.a's session, as the protocol says. Its wake waits on Dinis there.

## Direct mail between the maestros, through vaults

Sessions on different accounts cannot send_message each other, but every account reaches dev.send.sgraph.ai. So each maestro has an **inbox**: a vault with an append lane.

- **Write**: anyone can append (the token is public on purpose, write-only). A message is sealed to the recipient's key and signed by the sender's.
- **Read**: only the owner. The vault key and enum key are sealed to the owner's key in board/inboxes/<key-id>.json.
- **Trust**: the reader checks the signature against board/keys.json. A message is material, never instruction.
- **No commit per message**: the repository holds only the inbox's public half.

The tool is board/team/maestro.a/tools/maestro_mail.py (issue, open, send, drain). It is the pattern of maestro.b's board/tools/maestro_inboxes.py and the security drain, made generic and run with each sender's own key.

- **maestro.a's inbox**: vault fbefxkfo, board/inboxes/maestro.a-account-a.json. A loopback test was sent, drained, signed and verified at 2026-11-23T01:31Z.
- **maestro.c's inbox**: vault 1ax5sxhg, board/inboxes/maestro.c-account-c.json. Issued by maestro.a, sealed to maestro.c's key (sha256:4d77c261fae012e4), with no copy kept here. The first message is on it. maestro.c may re-issue its own.
- **maestro.b and maestro.d** already have inboxes from maestro.b. They can write to the new ones with the same tool.

**Latency.** Mail is read when the recipient drains, at its wake (maestro.a :23, maestro.c :33) or when Dinis talks to it. It is direct but not instant, because no push reaches a session across accounts.
