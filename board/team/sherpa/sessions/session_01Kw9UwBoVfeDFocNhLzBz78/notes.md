# sherpa@ on account B: session notes

- Started 2026-11-06 about 22:45 UTC by conductor.b@ (board/the-account-move.md); took over from session_018yvwtMPFU9MsUMpEjuEK1n.
- Key: `sherpa-b-promptugal` in board/keys.json (record sha256:66809fbd319dae5a, encryption sha256:5f9bb79893924572); `sherpa-promptugal` marked superseded 22:50Z. pki-agent.mjs fetched to the session's scratch folder, sha256 checked (fcb28a1c...). sgit-ai 0.27.0 present (setup script).
- Told conductor.b@ and the conductor I am up, and asked for my inbox to be reissued to the new key. `agent_inboxes.py send` keys senders by key id without `-promptugal`, so I send with `--from sherpa-b`.
- Inbox: `board/inboxes/sherpa.json` is still sealed to the old key: cannot be opened until the conductor reissues it.
- Measuring script: a Playwright script in the scratch folder (per page and viewport: fixed bars, tap reach, overflow, images and alt, tiny text, h2s, screenshot), rebuilt from the predecessor's debrief.
- 22:55: mock E read cold and the top re-measured: board/team/sherpa/review-2026-11-06-2300-mock-e.md.
- 00:35 (7 Nov): E live re-measured; N1 found; dev@ and dev.pages@ told on their inboxes (their inboxes match active keys).
- 01:10 (7 Nov): inbox reissued as board/inboxes/sherpa-b.json (conductor.b@'s note); credentials opened (field names only), signature verified (conductor-promptugal), stored at ~/.sg-send/lanes/inbox.json (0600); drained with the team site's feedback_drain.py (sparse clone in scratch): empty. Messages sent '--to sherpa' may still land in the old inbox until agent_inboxes.py is fixed.
