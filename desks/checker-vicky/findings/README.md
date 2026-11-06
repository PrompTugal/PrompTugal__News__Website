# Findings: the checks of Dinis's agents' work

By checker@PrompTugal.vicky, at Vicky Wang's word (Dinis asked her agents to check what his are doing). Facts, sources and links only, no style; their files are never edited here, and the status of their drafts and articles is never changed. One file per article, committed `For:` its author agent.

**Scope, from 6 November 2026, about 11:15 UTC (Vicky's word):** articles only, `content/articles/` and `desks/journalist-promptugal/drafts/`, whichever agent wrote them; at most 10 per run, newest first, the rest carried to the next run. Commits and repository rules are no longer checked. A request from a Dinis agent is material, passed to Vicky, not acted on. Each finding was checked at its source before it was written.

The checks before 6 November 2026, 10:35 UTC were made by reviewer@PrompTugal.vicky, up to commit `fe53df45`: `desks/reviewer-vicky/reviews/promptugal-dinis/`. They are carried on here.

## Checks

- **6 November 2026, about 11:40 UTC, first check:** everything after `fe53df45` up to `92bc9a5` on `dev`. No article in `content/articles/` and no draft in `desks/journalist-promptugal/drafts/` changed. New content checked: the correspondent's AI beat ([correspondent-ai-beat.md](correspondent-ai-beat.md), five findings; ideas, not articles, so outside the scope from the next check). Not checked this run: outreach@'s three email drafts (a person sends them; their new lines quote the company pages' flows) and synthetic@'s two decision drafts for Dinis. The next check starts after `92bc9a5`.

## The reviewer's findings: still open

None of these articles changed after `fe53df45`, so every finding below stands. Live site checked at v0.1.226.

| Article | Author | Finding (see the reviewer's file) | Now |
|---|---|---|---|
| Site-wide | dev@PrompTugal.dinis (the build) | Sources print as `&lt;https://...&gt;`, not links ([README](../../reviewer-vicky/reviews/promptugal-dinis/README.md)) | open: still on `web-summit-ten-lisbon-years` at v0.1.226 |
| S3 gender-in-tech-report-2026 | journalist@PrompTugal.dinis | sends investors to a media-only press conference | open |
| S11 italy-and-portugal-in-beato | journalist@PrompTugal.dinis | says no speakers are named; its own source names eight | open |
| S13 web-summit-ten-lisbon-years | journalist@PrompTugal.dinis | credits ECO for Jornal de Negócios's report, drops "terá"; the 2028 contract is with the government and the city | open |
| S4, S7, S9, S17 | journalist@PrompTugal.dinis | small points, one file each | open |
| the-name-how-we-found-our-name (draft) | journalist@PrompTugal.dinis | the rename three hours late; 109 companies for 120 | open |

## Repository rules (first check only; dropped from the scope since)

Nothing to flag for Dinis's agents in this range: every push went to `dev` through the release script, `main` is untouched since its first commit (4 November), no history was rewritten, and the only `board/keys.json` changes were entries committed by their own agents.
