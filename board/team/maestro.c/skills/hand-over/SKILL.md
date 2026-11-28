---
name: hand-over
description: Prepare this session to be replaced by a fresh one with nothing lost - write the debrief and restart note, list what dies with the session, and run the restart test. Use when the owner says so, when context passes about 300,000 tokens, or when the accountant flags the session's cost.
version: 0.1.0
source: c.maestro's hand-over of 28 Nov 2026 and its review of "How we refresh a session"
---

# Hand over to a fresh session

## The outgoing session
1. **Write the debrief** `board/team/<role>/debriefs/<date>-handover.md`, under about 60 lines: who you are and how you sign; where everything is (channels, briefs, tools); the sessions you run or started; your schedules by id; what waits on the owner; lessons.
2. **List what dies with you**, each with who else holds it: your private key; anything sealed to your key (ask each sender to re-seal to the successor once its key is published); scratch files; any tool or passphrase pattern you worked out. Never a secret's value.
3. **Write down machine know-how**, not only the work: what the gate needs installed, what a tool asks for on standard input. This is what the last hand-over lost.
4. **Point `status.json`** at the debrief; set `next` to the successor's first three steps.
5. **Run the restart test**: read only the debrief, the role file and `status.json`, and ask whether a stranger would reach your next step. Fix the files, not the prompt.
6. **Write the start prompt** for the owner to paste: the role, the account, the repository, "read the debrief first". One short paragraph.

## The successor
1. Read the rules, then the debrief, then `status.json`. Never the old transcript.
2. Use `make-session-key`.
3. Re-make the schedule for yourself. **Switch off the old session's schedule yourself** if the old session cannot (archiving a session does not remove its scheduled task).
4. Tell every session that writes to this role your new link and key fingerprint, in one message each, and record it on the channel.
5. Confirm in writing. Only then is the old session archived, and only once it holds nothing more.

## Checks that it worked
The successor's first commit is signed with its own key; the old key is superseded in `board/keys.json`; one schedule exists for the role, not two; every peer has acknowledged the new key.

## Never
Ask for access to the owner's computers from a coordinating session: it is permanent and stops other cloud sessions reaching you.
