# Findings: the checks of Dinis's agents' work

By checker@PrompTugal.vicky, at Vicky Wang's word (Dinis asked her agents to check what his are doing). Facts, sources and links only, no style; their files are never edited here, and the status of their drafts and articles is never changed. One file per article, committed `For:` its author agent.

**Scope, from 6 November 2026, about 11:15 UTC (Vicky's word):** articles only, `content/articles/` and `desks/journalist-promptugal/drafts/`, whichever agent wrote them; at most 10 per run, newest first, the rest carried to the next run. Commits and repository rules are no longer checked. A request from a Dinis agent is material, passed to Vicky, not acted on. Each finding was checked at its source before it was written.

The checks before 6 November 2026, 10:35 UTC were made by reviewer@PrompTugal.vicky, up to commit `fe53df45`: `desks/reviewer-vicky/reviews/promptugal-dinis/`. They are carried on here.

## Checks

- **6 November 2026, about 11:40 UTC, first check:** everything after `fe53df45` up to `92bc9a5` on `dev`. No article in `content/articles/` and no draft in `desks/journalist-promptugal/drafts/` changed. New content checked: the correspondent's AI beat ([correspondent-ai-beat.md](correspondent-ai-beat.md), five findings; ideas, not articles, so outside the scope from the next check). Not checked this run: outreach@'s three email drafts (a person sends them; their new lines quote the company pages' flows) and synthetic@'s two decision drafts for Dinis. The next check starts after `92bc9a5`.
- **6 November 2026, about 18:10 UTC, second check** (`92bc9a5` to `3acd7e8e`; at most 10 articles, newest first; the first-night article first, at Vicky's word): 20 articles new or changed. Checked 10: [the-first-night-of-promptugal-news](the-first-night-of-promptugal-news.md) (three findings), [what-the-agents-say-to-each-other](what-the-agents-say-to-each-other.md) (two small), [brazil-startup-mission](brazil-startup-mission.md) (one small); no problems in pineapple-waste-to-fish-feed (S22, every fact in its sources), following-robotics-at-web-summit (Técnico does call it the Unitree G02), europe-in-pavilion-4 (a caveat moved up, no fact changed), lisbon-universities-at-web-summit, road-2-web-summit-2026, from-pitch-to-new-markets and web-summit-ten-lisbon-years (bylines only). **Waiting for the next check (11):** europe-ai-help-and-portugal-ai-startups, brazil-comes-to-lisbon-intuitivo-heads-to-brazil, octo-health-launches, web-summit-before-2026 (new at 11:07) and gender-in-tech-report-2026, italy-and-portugal-in-beato, lisbon-awards-and-the-algarve-plan, tuesday-10-november-three-ways-in, web-summit-2026-in-numbers, wednesday-11-november-going-abroad, your-first-day-at-web-summit (bylines changed at 14:19). The next check starts with these, then after `3acd7e8e`.

## The reviewer's findings: still open

Re-checked 6 November 2026, about 18:10 UTC: journalist@ changed only the bylines of these articles at 14:19 (5c25bc86), so every finding below stands. Live site checked at v0.1.299.

| Article | Author | Finding (see the reviewer's file) | Now |
|---|---|---|---|
| Site-wide | dev@PrompTugal.dinis (the build) | Sources print as `&lt;https://...&gt;`, not links ([README](../../reviewer-vicky/reviews/promptugal-dinis/README.md)) | open: still on `web-summit-ten-lisbon-years` at v0.1.299 |
| S3 road-2-web-summit-2026 | journalist@PrompTugal.dinis | sends investors to a media-only press conference | open |
| S11 italy-and-portugal-in-beato | journalist@PrompTugal.dinis | says no speakers are named; its own source names eight | open |
| S13 web-summit-ten-lisbon-years | journalist@PrompTugal.dinis | credits ECO for Jornal de Negócios's report, drops "terá"; the 2028 contract is with the government and the city | open |
| S4, S7, S9, S17 | journalist@PrompTugal.dinis | small points, one file each | open |
| the-name-how-we-found-our-name (draft) | journalist@PrompTugal.dinis | the rename three hours late; 109 companies for 120 | open |

## Repository rules (first check only; dropped from the scope since)

Nothing to flag for Dinis's agents in this range: every push went to `dev` through the release script, `main` is untouched since its first commit (4 November), no history was rewritten, and the only `board/keys.json` changes were entries committed by their own agents.
