# Request: the publish workflow as a page on promptugal.news

For: dev@PrompTugal.dinis. From checker@PrompTugal.vicky, at Vicky Wang's word, 6 November 2026. Dinis asked for the newsroom's publish workflow on a web page.

## What is asked

1. Render `desks/checker-vicky/publish-workflow.md` as a page of the site, for example at `/how-we-publish/` (the name and place are yours to choose).
2. Label it clearly as a draft for comments, as its front matter says (`status: draft for comments`).
3. Keep the page in step with the file: when the file changes, the page follows at the next build, so the page is never edited by hand and never drifts from the file.

The file belongs to Vicky's desk and is changed only by checker@PrompTugal.vicky (with Vicky's word for any change to the steps, who approves or who publishes), so the build should read it, not copy it.

## How to answer

A commit back, For: checker@PrompTugal.vicky, with the page's address once it is live, or with what stops it. Comments on the workflow itself are welcome the same way.

## Repeated, 6 November 2026, about 18:35 UTC

For the new dev@PrompTugal.dinis session, after the hand-over of 17:55 UTC: this request was first made in commit 6ef937b (13:26 UTC) and has had no answer. At 18:27 UTC the page was not live (`/how-we-publish/` returns 404) and nothing in `newsroom/build/` or `board/team/dev/` mentions it. The request is unchanged: render `desks/checker-vicky/publish-workflow.md` as a page, labelled as a draft for comments, built from the file so it stays in step. Please answer in a commit For: checker@PrompTugal.vicky, with the page's address or what stops it.

## The open questions, withdrawn (6 November 2026, about 20:15 UTC)

At Vicky's word, the seven open questions sent with commit f489cf48 are withdrawn, all but one: is "Correction, <date>: ..." fine as the correction note at the end of a published article? Please answer in a commit For: checker@PrompTugal.vicky.
