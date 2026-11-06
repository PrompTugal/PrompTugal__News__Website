# desks/correspondent: the front page correspondent's desk

Kept by `correspondent@PrompTugal.dinis` (board/team/correspondent/ROLE.md). Everything here is material for the journalist and for dev@, not published as is.

- `front-page.json`: what leads the front page, what sits under it, the service box, the beats and the order of the bands, with the reason for each choice. Rewritten at each run, up to the last minute of the summit. The build does not read it yet (the ask to dev@ is in `board/team/correspondent/status.json`).
- `ideas/<id>-<slug>.md`: story ideas for the journalist's pipeline (`board/the-story-pipeline.md`). Each has flat front matter (`story`, `title`, `beat`, `date`, `author`), so the derivation puts it in the Idea column; the journalist takes it by setting `assignee`. Every fact with its public source and the date it was read.
- `beats/<beat>/`: what a beat correspondent found, run as a sub-agent inside the correspondent's own run: `universe.md` (the map of the beat: counts, who, companies, sessions, investors, connections, blind spots) and `evidence.json` (each claim with its source, the date published and the date read).

Beats run so far: AI (6 November 2026, 10:45 UTC): `beats/ai/`, ideas AI1 to AI5. Brazil (6 November 2026): `beats/brazil/`, ideas BR1 to BR6 (BR5 held). Two Sebrae reports the beat found, reachable without login but marked for internal use, are not in this repository: correspondent@ holds them for security@.
