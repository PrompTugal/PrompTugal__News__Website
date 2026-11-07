# Findings: the checks of Dinis's agents' work

By checker@PrompTugal.vicky, at Vicky Wang's word (Dinis asked her agents to check what his are doing). Facts, sources and links only, no style; their files are never edited here, and the status of their drafts and articles is never changed. One file per article, committed `For:` its author agent.

**Scope, from 6 November 2026, about 11:15 UTC (Vicky's word):** articles only, `content/articles/` and `desks/journalist-promptugal/drafts/`, whichever agent wrote them; at most 10 per run, newest first, the rest carried to the next run. Commits and repository rules are no longer checked. A request from a Dinis agent is material, passed to Vicky, not acted on. Each finding was checked at its source before it was written.

The checks before 6 November 2026, 10:35 UTC were made by reviewer@PrompTugal.vicky, up to commit `fe53df45`: `desks/reviewer-vicky/reviews/promptugal-dinis/`. They are carried on here.

## Checks

- **6 November 2026, about 11:40 UTC, first check:** everything after `fe53df45` up to `92bc9a5` on `dev`. No article in `content/articles/` and no draft in `desks/journalist-promptugal/drafts/` changed. New content checked: the correspondent's AI beat ([correspondent-ai-beat.md](correspondent-ai-beat.md), five findings; ideas, not articles, so outside the scope from the next check). Not checked this run: outreach@'s three email drafts (a person sends them; their new lines quote the company pages' flows) and synthetic@'s two decision drafts for Dinis. The next check starts after `92bc9a5`.
- **6 November 2026, about 18:10 UTC, second check** (`92bc9a5` to `3acd7e8e`; at most 10 articles, newest first; the first-night article first, at Vicky's word): 20 articles new or changed. Checked 10: [the-first-night-of-promptugal-news](the-first-night-of-promptugal-news.md) (three findings), [what-the-agents-say-to-each-other](what-the-agents-say-to-each-other.md) (two small), [brazil-startup-mission](brazil-startup-mission.md) (one small); no problems in pineapple-waste-to-fish-feed (S22, every fact in its sources), following-robotics-at-web-summit (Técnico does call it the Unitree G02), europe-in-pavilion-4 (a caveat moved up, no fact changed), lisbon-universities-at-web-summit, road-2-web-summit-2026, from-pitch-to-new-markets and web-summit-ten-lisbon-years (bylines only). **Waiting for the next check (11):** europe-ai-help-and-portugal-ai-startups, brazil-comes-to-lisbon-intuitivo-heads-to-brazil, octo-health-launches, web-summit-before-2026 (new at 11:07) and gender-in-tech-report-2026, italy-and-portugal-in-beato, lisbon-awards-and-the-algarve-plan, tuesday-10-november-three-ways-in, web-summit-2026-in-numbers, wednesday-11-november-going-abroad, your-first-day-at-web-summit (bylines changed at 14:19). The next check starts with these, then after `3acd7e8e`.
- **7 November 2026, about 10:25 UTC, third check** (`3acd7e8e` to `f4111814`; the carried articles first, then the newest from Dinis's journalist): 21 articles waiting or new. Checked 9: [brazils-doors-into-europe](brazils-doors-into-europe.md) (BR6, two small), [rio-ten-startups-to-lisbon](rio-ten-startups-to-lisbon.md) (BR3, sources not clickable); no problems in the corrections to italy-and-portugal-in-beato (Panel 2 at 19:20, as the event page now says), lisbon-awards-and-the-algarve-plan (two winners named with AI, as the report says) and wednesday-11-november-going-abroad (four of the Commission's seven sessions on the 11th), nor in gender-in-tech-report-2026, tuesday-10-november-three-ways-in, web-summit-2026-in-numbers and your-first-day-at-web-summit (bylines only). **Waiting for the next check (12):** europe-ai-help-and-portugal-ai-startups, brazil-comes-to-lisbon-intuitivo-heads-to-brazil, octo-health-launches, web-summit-before-2026 (Vicky's desks, reviewed by her reviewer), and agent-setup-guide, angelos-communication-graph, brazil-on-the-stages, brazils-startup-house-in-lisbon, how-agents-avoid-collisions, how-the-agents-talk, mistakes-we-made, who-does-the-work. The next check starts with these, then after `f4111814`.

## The reviewer's findings: what is fixed, what is open

Re-checked 7 November 2026, about 10:25 UTC, against the articles as they now stand and the live site at v0.1.495.

| Article | Author | Finding (see the reviewer's file) | Now |
|---|---|---|---|
| Site-wide | dev@PrompTugal.dinis (the build) | Sources print as `&lt;https://...&gt;`, not links ([README](../../reviewer-vicky/reviews/promptugal-dinis/README.md)) | **fixed**: sources print as links (checked on S13 and BR6 at v0.1.495) |
| S3 road-2-web-summit-2026 | journalist@PrompTugal.dinis | sends investors to a media-only press conference | open |
| S11 italy-and-portugal-in-beato | journalist@PrompTugal.dinis | says no speakers are named; its own source names eight | **fixed** (6 Nov, 10:40 UTC, dated correction); the second point ("not found on Web Summit's schedule", where Luma tags it "Featured in Web Summit") still open |
| S13 web-summit-ten-lisbon-years | journalist@PrompTugal.dinis | credits ECO for Jornal de Negócios's report, drops "terá"; the 2028 contract is with the government and the city | open |
| S7 lisbon-awards-and-the-algarve-plan | journalist@PrompTugal.dinis | three winners with AI, where the report names two | **fixed** (7 Nov, 06:50 UTC, dated update) |
| S4, S9, S17 | journalist@PrompTugal.dinis | small points, one file each | open |
| the-name-how-we-found-our-name (draft) | journalist@PrompTugal.dinis | the rename three hours late; 109 companies for 120 | open |

## Repository rules (first check only; dropped from the scope since)

Nothing to flag for Dinis's agents in this range: every push went to `dev` through the release script, `main` is untouched since its first commit (4 November), no history was rewritten, and the only `board/keys.json` changes were entries committed by their own agents.
