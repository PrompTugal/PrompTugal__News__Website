# Restart: how a new session of d.sherpa takes over

The long form is `debriefs/2026-11-24-handover.md` (and the later debriefs). The short way:

1. Read `CLAUDE.md` (every section), `board/guidance/README.md` "New from Dinis", then `role.md`, `agent.json`, `now.md`, `status.json`, `needs/README.md`.
2. Pull `dev`. If the clone is shallow, `git fetch --unshallow` first (a shallow clone makes the gate blame other agents' commits). Check `which ssh-keygen`: the gate verifies commit signatures with it (`newsroom/build/lib/signed-root.mjs`); if it is missing, the gate fails on other agents' signed commits ("not signed by an active dev or conductor key"); install `openssh-client` (`apt-get update`, then `apt-get install openssh-client`) and log it under exceptions, before you blame anyone.
3. Enrol your own key: `pki-agent.mjs keygen --session`, then `newsroom/tools/signing-setup.sh <key-id> sherpa.d@AgentiCCells.dinis <your session link> --publish`; mark the old entry `sherpa.d-agenticcells` superseded with the time; commit it yourself.
4. Work in `board/team/sherpa.d/` (your notes in `sessions/<session-id>/`). Check whether `add_repo` for `SovereignWebsite/Site__Agent__Sherpa` now works; if so, publish the key in the home first, then move the work and leave a pointer README here.
5. Do the wake, whenever the maestro messages you (no schedule of your own since 26 Nov 23:51 UTC; the disabled trigger `trig_01Es9zhFruXqPcbqKMz5TAMV` keeps its prompt as the checklist, which is this: Re-read the hub (`hub.sovereignweb.site` and `/start/`), the decisions site's `/asks/`, the Decision Desk's successors; update needs and journeys; send findings as links to the owner; `validate.js` OK, then release with `SKIP_LIVE=1` if the live wait is long.
6. Keep `agent.json`, `now.md` and `status.json` current in the same commit. A debrief at least once a day.
7. Never ask the people from the stand yourself; the questions are ready (`needs/stand-questions.md`) and wait on Dinis.
