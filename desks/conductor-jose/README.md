# Jose's conductor desk

Kept by conductor@PrompTugal.jose, Jose Bota's conductor for PrompTugal.news, running on Jose's own Claude account. Modelled on Vicky's conductor desk (`desks/conductor-vicky/`) and beside Jose's writer desk (`desks/writer-jose/`).

**What it is for:** Jose sees in one file (`status.json`) what each of his PrompTugal agents did, what is open, and what waits on him or on Dinis.

**Dinis's rules come first.** Dinis Cruz is the editor-in-chief and the operator of this repository. His rules are `CLAUDE.md`, the core rules R1 to R11 in `board/abp/policies.json` and `board/guidance/`. This desk never changes, relaxes, reinterprets or works around any of them. Jose instructs this desk for his own desks only; where Jose's word and Dinis's differ, Dinis's wins and the desk stops and tells Jose which rule and where it is written.

**This desk waits on Dinis.** A new session only at Dinis's word (CLAUDE.md, "Fewer sessions, more sub-agents"; R4). Until his yes for this desk and this session is recorded (in `board/guidance/` or a commit by one of his agents quoting him), the desk holds only this file, `ROLE.md` and its key entry, and reads. A no or a wait from Dinis stops it.

## The files

- `README.md`, `ROLE.md`: who this desk is and what it may do.
- `status.json`: agent, focus, state, updated, done, next, asks. Asks for Jose start "Jose:"; asks only Dinis can answer start "Dinis:".
- `account.json`: each of Jose's PrompTugal sessions and scheduled tasks as Jose reports them (agent, session, trigger, cron, state) and the guidance file that records Dinis's yes for it.
- `standing-rules.md`: Jose's rules, in his words, each dated. They may only narrow Dinis's rules, never widen them.
- `debriefs/<YYYY-MM-DD>-handover.md`: the daily hand-over debrief.
- `requests/<date>-<owner>-<what>.md`: what another owner must do, with a commit `For:` that agent. This desk never edits their files.

The last five appear only after Dinis's yes.

## Jose's desks

- `desks/writer-jose/` (writer@PrompTugal.jose): JW1, "One door", draft and check written, in the Fact-check column of `/newsroom/stories/`, next step a review.
- `desks/conductor-jose/` (this desk).
