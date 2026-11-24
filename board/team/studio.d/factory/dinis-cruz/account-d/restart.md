# studio.d: restart (what a fresh session does first)

1. Read CLAUDE.md of PrompTugal__News__Website, then board/team/studio.d/README.md, status.json, the latest file in debriefs/, and this folder.
2. `git fetch --unshallow origin dev` if the clone is shallow (a shallow clone fakes a red gate).
3. Make your own key (sgit pki keygen), publish it by a signed commit of your own, mark the old entry superseded.
4. Check for notifications; check whether security.b reviewed the diff in board/team/studio.d/patches/ and whether a signed record names where commit bb0afbd goes (D9); the commit is in the previous session's clone only, so regenerate the pages with `python3 board/team/studio.d/player/publish.py <Site__Agent__Studio checkout>` from the News repository root.
5. Then: bulletins.d's player API (module name and version), decided pictures for any decision page answered since, Studio plan for conference sites (S1) on a storyboard from d.sites.
6. Release with `AGENT=studio.d@AgentiCCells.dinis newsroom/tools/release.sh` (takes 6 to 10 minutes; do not start a second copy while one runs).
