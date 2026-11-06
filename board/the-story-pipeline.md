---
title: "The story pipeline: every story on one Kanban board, from idea to published"
by: conductor@PrompTugal.dinis
written: 2026-11-06T02:45Z
decided_by: Dinis Cruz, 6 November 2026, about 02:40 UTC ("we need to build now a pipeline for stories ... drafts ... release ... as a Kanban board")
issue: WS-177
---
# The story pipeline

**What Dinis asked for:** one pipeline for stories, so that drafts are made, checked and released in the open, shown as a Kanban board. Today the pieces exist but are scattered: the curator's candidates (`data/stories/S1` to `S19`, all `status: candidate`, derived from `desks/curator/`), Vicky's drafts (`desks/journalist-vicky/drafts/`), her reviewer's verdicts (`desks/reviewer-vicky/reviews/`), the journalist's own work in its session, and the articles (`content/articles/`). Nothing shows where a story is, or who has it.

## The columns (one state per story)

| Column | Means | Who moves a story in | Evidence the build reads |
|---|---|---|---|
| **Idea** | a storyline worth doing, with its sources | curator desks, any agent, Dinis | `desks/curator/*.json` or `desks/<desk>/ideas/<id>.md` |
| **Drafting** | someone has it | the journalist (or a desk's journalist) | `assignee` set on the story |
| **Draft** | a full text exists, in the repository | the writer | `desks/<desk>/drafts/<id>-<slug>.md` |
| **Fact-check** | every fact being re-opened at its source | the journalist or a reviewer desk | a check file `desks/<desk>/checks/<id>.md` |
| **Review** | a second pair of eyes (Vicky's reviewer, synthetic readers for tone) | reviewer desks | `desks/reviewer-*/reviews/<id>.md` with a verdict |
| **Waits on Dinis** | needs his word (a claim, a person, the name's story) | anyone, saying what is needed | `needs: dinis` and the question |
| **Ready** | reviewed, checked, nothing open | the reviewer | verdict Ready |
| **Published** | live and signed | the journalist | `content/articles/<slug>.md` and its `.sig` |
| **Held** | stopped, with the reason | anyone | `held: <why>` |

Every card shows: the id and title, the column, who has it, its sources (count, oldest read date), links to the draft, the review and the article, and the next step.

## Who builds what

| Order | Agent | The work | Done looks like |
|---|---|---|---|
| 1 | `ontologist@PrompTugal.dinis` | The story schema with the columns above (`status`, `assignee`, `needs`, `held`, `draft`, `check`, `review`, `article`, `history` of moves with time and agent); the derivation reads each state from the evidence files, so a story's column follows its files and nobody edits derived data by hand | `data/schemas/story.schema.json` with the columns; `derive.mjs` sets S1 to S19 and every published article to the right column; the gate's check 11 OK |
| 2 | `dev@PrompTugal.dinis` | The board at `/newsroom/stories/`: columns, cards, filters by desk, beat and assignee, counts per column, and `/api/v1/newsroom/stories.json`; a card page per story with its whole trail; no script needed to read it | The page live, every story in one column, the counts matching the API |
| 3 | `journalist@PrompTugal.dinis` | Works through the board: drafts go into `desks/journalist-promptugal/drafts/` as files (not only in its session), then check, review, publish. First: commit the name's draft there, in "Waits on Dinis" | Every story it touches moves column by its files; "How we found our name" visible as a draft |
| 3 | `synthetic@PrompTugal.dinis` | Its reader runs on a draft count as a review of tone, filed as `desks/synthetic/reviews/<id>.md` | Reviews show on the cards |
| 3 | `outreach@PrompTugal.dinis` | When a story is about a company it writes to, the card links the company and the draft email | Company pages and stories link both ways |
| 4 | `conductor@PrompTugal.dinis` | Reads the board at each wake; what sits in "Waits on Dinis" goes into the brief to him | The brief lists every card waiting on him |

Until the board is live, the journalist keeps working in order (S4 next) and commits its drafts to its desk folder.
