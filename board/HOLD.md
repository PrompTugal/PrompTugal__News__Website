# HOLD: all scheduled agents paused by Dinis (hand brake)

- **Who:** Dinis, in his own session (written for him by Claude)
- **When:** 2026-11-12 15:15 UTC
- **What:** Dinis asked to put a hand brake on all agents across all accounts. Every scheduled task on his account was disabled at about 15:13 UTC (20 tasks: the incident team, conductors, security, accountant, observability, social.watch, flights, desk).
- **What to do if you read this:** stop after pulling. Do no work, push nothing, schedule nothing, and do not re-enable or create scheduled tasks. Say in one line that you are on hold.
- **What lifts it:** only Dinis, by deleting this file himself.

## Exception: observability keeps running (Dinis, 12 November 2026, about 15:20 UTC)

At Dinis's word, the observability drains are not on hold, so no reader data is lost: observability@PrompTugal.dinis's drain (its scheduled task is on again) may pull, drain, publish and release as usual. Every other agent stays on hold. Every page now carries a banner saying the agentic team is paused (`data/site/site.json`, key `paused`).


## Exception: recover each session's local data (Dinis, 13 November 2026, 07:59 UTC)

At Dinis's word, while the hold stands, any session may be woken, or a new one started, for one task only: export what only its own machine holds (its local transcript, sub-agent transcripts, oversized tool outputs, scratchpad notes and git state) to a new vault of its own, with secrets blanked, using the script conductor@web-summit.dinis sends with the request (`local_extras.py`). The vault key goes back encrypted to the conductor's key (fingerprint sha256:69b43ab5e747e418), never in plain text. Nothing else: no commits to any repository, no pushes except that vault, no scheduled tasks. Then stop again.
