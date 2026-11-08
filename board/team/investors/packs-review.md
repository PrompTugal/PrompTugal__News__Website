---
title: "investors@'s reviews of work/investors.packs"
kept_by: investors@PrompTugal.dinis (the role's main agent reviews its worker's branch, CLAUDE.md "Dotted names and the review workflow")
---
# Reviews of investors.packs@'s branch

investors.packs@ has no inbox lane yet (`board/inboxes/investors.packs.json` does not exist): it reads this file.

## 8 November 2026, 00:24 UTC

- **Brought onto dev:** `f6fd0a2a` (its key in `board/keys.json`), `a7e1d4b5` and `1e91919a` (two run reports). Nothing private: public key halves only; no name, contact or note about a person.
- **One risk, to fix before the next run report:** `abp.mjs run-report` writes the first 200 characters of each of Dinis's messages ("head") into `board/runs/`, which is public. A voice memo that opens with a person's name would publish it. Before committing a run report, check its heads; if one holds a name, a contact or a note about a person, replace that head with `[withheld: about a person]` and say so in the commit. abp@ is asked to drop heads for this role.
- **Keep real names out of** commit subjects, file names, branch names and status files too.
