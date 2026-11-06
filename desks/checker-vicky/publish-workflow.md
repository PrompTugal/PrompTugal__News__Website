---
title: "The newsroom's publish workflow (draft for comment)"
by: checker@PrompTugal.vicky, for Vicky Wang
written: 2026-11-06
asked_by: Dinis Cruz (a publish workflow for the newsroom); drafted at Vicky's word
status: draft, for comments from conductor@PrompTugal.dinis and journalist@PrompTugal.dinis
---
# The publish workflow

One path for every story, whichever side writes it: Vicky's desks (`@PrompTugal.vicky`) or Dinis's agents (`@PrompTugal.dinis`). It sits under the story pipeline's Kanban board (`board/the-story-pipeline.md`): the board shows where a story is; this page says who moves it.

## The steps

| Step | What happens | Who does it |
|---|---|---|
| 1. Assign | A storyline is picked, with its sources. | The curator (`curator@PrompTugal.vicky`, and any curator Dinis names). |
| 2. Write | A journalist writes the draft, after checking `content/articles/` and every `desks/*/drafts/` folder that no one has written it yet. | Any journalist, Vicky's or Dinis's. |
| 3. Fact-check | Every fact, number, name, date and link is checked at its source. | A checker from the other side: Vicky's checker checks Dinis's drafts; Dinis's checker checks Vicky's. Never the writer. |
| 4. Edit | Style, length and format, in the house style of the desk that wrote it. | That desk's reviewer or editor (for Vicky's desks, `desks/journalist-vicky/STYLE.md`). |
| 5. Approve | The editor says yes. | Vicky for her desks; Dinis for his. |
| 6. Publish | The draft becomes `content/articles/<slug>.md`, signed. | `journalist@PrompTugal.dinis`; or Vicky's reviewer, when Vicky asks. |
| 7. Correct | A mistake found after publishing is fixed by the writer, re-checked by a reviewer, and the article shows a dated correction note saying what changed. | Writer, then reviewer. |

## The status field

Every draft has `status:` in its front matter, with one of these values:

| Value | Means | Who may set it |
|---|---|---|
| `draft` | being written | the writer |
| `in-review` | written; waiting for the fact-check and the edit | the writer |
| `fix` | the check or edit found something the writer must fix | the checker or the reviewer |
| `ready` | checked and edited, nothing open | the reviewer of the writing desk, once the checker has nothing open |
| `approved` | the editor said yes | the editor only (Vicky or Dinis), or an agent recording their word in a commit that quotes it |
| `published` | live on promptugal.news | the publisher, in the same commit that publishes |
| `dropped` | stopped; the file stays, with the reason | the editor, or the writer at the editor's word |

**Nothing is published without `approved`.** The publisher checks the value, and who set it, before publishing.

A writer moves `fix` back to `in-review` after fixing. A correction (step 7) does not change `published`; it adds the dated note.

## Open questions

1. Who is Dinis's checker for Vicky's drafts: a named agent (`dev.verify@`?), or `journalist@PrompTugal.dinis` itself until one exists?
2. Who records Dinis's approval: Dinis in a commit, or the conductor quoting him? Same question for Vicky.
3. Can the gate refuse an article in `content/articles/` whose draft never reached `approved`? (Needs dev@ and the ontologist.)
4. Should `in-review` be split into "fact-check" and "edit", to match the Kanban board's columns?
5. Who curates for Dinis's side, and how do the two curators avoid picking the same storyline?
6. What should a correction note look like on the page (place, wording, and whether the `.sig` is renewed)?
7. Do the articles already published before this workflow need an `approved` record, or does it start from today?

Comments welcome in a commit back, addressed `For: checker@PrompTugal.vicky`.
