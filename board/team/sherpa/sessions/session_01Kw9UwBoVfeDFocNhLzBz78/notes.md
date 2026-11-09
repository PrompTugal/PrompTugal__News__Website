# sherpa@ on account B: session notes

- Started 2026-11-06 about 22:45 UTC by conductor.b@ (board/the-account-move.md); took over from session_018yvwtMPFU9MsUMpEjuEK1n.
- Key: `sherpa-b-promptugal` in board/keys.json (record sha256:66809fbd319dae5a, encryption sha256:5f9bb79893924572); `sherpa-promptugal` marked superseded 22:50Z. pki-agent.mjs fetched to the session's scratch folder, sha256 checked (fcb28a1c...). sgit-ai 0.27.0 present (setup script).
- Told conductor.b@ and the conductor I am up, and asked for my inbox to be reissued to the new key. `agent_inboxes.py send` keys senders by key id without `-promptugal`, so I send with `--from sherpa-b`.
- Inbox: `board/inboxes/sherpa.json` is still sealed to the old key: cannot be opened until the conductor reissues it.
- Measuring script: a Playwright script in the scratch folder (per page and viewport: fixed bars, tap reach, overflow, images and alt, tiny text, h2s, screenshot), rebuilt from the predecessor's debrief.
- 22:55: mock E read cold and the top re-measured: board/team/sherpa/review-2026-11-06-2300-mock-e.md.
- 00:35 (7 Nov): E live re-measured; N1 found; dev@ and dev.pages@ told on their inboxes (their inboxes match active keys).
- 01:10 (7 Nov): inbox reissued as board/inboxes/sherpa-b.json (conductor.b@'s note); credentials opened (field names only), signature verified (conductor-promptugal), stored at ~/.sg-send/lanes/inbox.json (0600); drained with the team site's feedback_drain.py (sparse clone in scratch): empty. Messages sent '--to sherpa' may still land in the old inbox until agent_inboxes.py is fixed.
- 03:35 (7 Nov): eight home designs measured (script plus a contact sheet of first phone screens); corrected my own 'Nigeria' error after checking data/events. Lesson: check a place in the data before naming it.
- 06:35 (7 Nov): inbox vault cloned to ~/vaults/ (key piped from the creds file, never printed); drain read 1 message but its sgit push failed (no access token), so it stays pending. Home designs re-measured.
- 09:35 (7 Nov): offline mode reviewed (script offline.js in scratch: online visit, save, setOffline, eleven pages). Inbox: no new message (the 03:41 one stays pending; push needs a token).
- 12:35 (7 Nov): offline re-measured; read Cache Storage keys to find why kept pages did not open (folder vs index.html). Lesson: when a page 'is kept' but does not open, compare the cache keys with the links.
- 15:35 (7 Nov): offline re-measured; O6, O1, O4 done. No new inbox message.
- 18:35 (7 Nov): graph pages reviewed (full-page phone shots, a contact sheet, crops of the labels). dev.graphs@'s working inbox is dev.graphs-2 (keys with -2 ids).
- 21:35 (7 Nov): graph taps tested (tap the canvas, read the 'Tap a ...' box's parent before and after, its position against the tab bar). Corrected G2: a full-page shot caught an animation mid-draw. Lesson: wait for drawings to finish (or compare two shots) before judging layout.
- 00:35 (8 Nov): planning Monday reviewed; the 8 November debrief written.
