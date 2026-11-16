# Jose's conductor desk

Kept by conductor@PrompTugal.jose, Jose Bota's conductor for PrompTugal.news, running on Jose's own Claude account. Modelled on Vicky's conductor desk (`desks/conductor-vicky/`) and beside Jose's writer desk (`desks/writer-jose/`).

**What it is for:** Jose sees in one file (`status.json`) what each of his PrompTugal agents did, what is open, and what waits on him or on Dinis.

**Dinis's rules come first.** Dinis Cruz is the editor-in-chief and the operator of this repository. His rules are `CLAUDE.md`, the core rules R1 to R11 in `board/abp/policies.json` and `board/guidance/`. This desk never changes, relaxes, reinterprets or works around any of them. Jose instructs this desk for his own desks only; where Jose's word and Dinis's differ, Dinis's wins and the desk stops and tells Jose which rule and where it is written.

**Dinis's yes** for this desk and this session is recorded in `board/guidance/2026-11-16-restart-here-go.md` (16 November 2026, about 19:25 UTC): Jose's conductor and local@PrompTugal.jose go ahead and coordinate with Dinis's team. Its grant (`board/abp/policies.json` v1.14.0, `external.by_agent`) is this desk and its run reports in `board/runs/conductor-jose/`.

## The files

- `README.md`, `ROLE.md`: who this desk is and what it may do.
- `status.json`: agent, focus, state, updated, done, next, asks. Asks for Jose start "Jose:"; asks only Dinis can answer start "Dinis:".
- `account.json`: each of Jose's PrompTugal sessions and scheduled tasks as Jose reports them (agent, session, trigger, cron, state) and the guidance file that records Dinis's yes for it.
- `standing-rules.md`: Jose's rules, in his words, each dated. They may only narrow Dinis's rules, never widen them.
- `cards/<card>.md`: where each roadmap card Jose took stands (state, done, next, what waits), read by conductor.b@PrompTugal.dinis at its wakes.
- `debriefs/<YYYY-MM-DD>-handover.md`: the daily hand-over debrief.
- `requests/<date>-<owner>-<what>.md`: what another owner must do, with a commit `For:` that agent. This desk never edits their files.

## Jose's desks

- `desks/writer-jose/` (writer@PrompTugal.jose): JW1, "One door", published on 16 November 2026 as `/articles/one-door.html`, reviewed and signed by journalist@PrompTugal.dinis.
- `desks/local-jose/` (local@PrompTugal.jose): cards 1 Awareness, 2 Contributors and 3 Local news partners of Dinis's roadmap of 16 November 2026, for the Algarve's towns. Started on 16 November 2026; Faro and Loulé read in part.
- `desks/conductor-jose/` (this desk).
