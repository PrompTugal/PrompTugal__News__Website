---
story: T1
draft: desks/journalist-vicky/drafts/t1-angelos-communication-graph.md
reviewed: 2026-11-06
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: Fix first
---

# T1 review: Angelo's communication graph: watch our agents talk

**Verdict: Fix first.** Three small points of accuracy and the pronouns; everything else checks out, including both screenshots. 650 words (news up to 700 is fine): no cut needed. Reviewed the draft as of commit `8e499a96`. Not to be published yet in any case: Vicky shows it to Angelo first.

How it was checked, 6 November 2026, about 21:20 UTC: the map's counts rebuilt from the team site at the release the draft cites (v0.2.862, commit `9aab98c5`, `people/angelo/app/data.mjs`); the map's layouts, shapes, rings and buttons read in `people/angelo/app/app.js`; Replay's rows, kinds, speeds, filters and the commit card in `people/angelo/app/replay.js`; "For:" over seven days and the merged names in `people/angelo/tools/team-map.mjs`; security@PrompTugal.dinis's page on messages outside git; every link opened (all 200).

## Fix first

1. **"In short", bullet 4 says more than the story does.** "Both show the same thing: a few conductor agents sit at the centre, and most of the work flows through them." The body (rightly) says "more than four in ten messages went to a conductor": 1,227 of 2,907 counted pairs' messages at v0.2.862, 42%. "Most of the work flows through them" is not that. The conductors don't sit at the centre in the default "People ring" layout either (people are on the ring, agents around them; see the screenshot), and Replay doesn't show it as such. Suggest: "The conductor agents are the hubs: by our count, more than four in ten messages went to one."
2. **"In short", bullet 2: one line per pair, not per message.** "The map draws a line between two agents, or an agent and a person, each time one addresses work to the other in a commit." The code draws one arc per pair that wrote to each other in the last seven days, wider for more (app.js: "An arc is a pair that wrote to each other, wider for more"). The body already says it right ("Each curved line is a pair ... thicker means more"). Suggest: "The map draws a line between two agents, or an agent and a person, who addressed work to each other in a commit in the last seven days; thicker for more."
3. **"Tap a dot to open its commit on GitHub."** A tap opens a card under the timeline with the commit's subject, agent, time and issues, and a link, "The commit on GitHub" (replay.js, `detail`). Suggest: "Tap a dot to see its commit, with a link to it on GitHub."
4. **Pronouns.** "from his command centre" (twice) and "ask him for a tour": no source gives Angelo's pronouns (the team's `data/team.json` uses "they" and "their" for Angelo), so STYLE.md says use the name: "from Angelo's command centre", "ask Angelo for a tour".

## To check with Angelo (Vicky is showing it to him)

- **"look for Angelo and ask him for a tour."** It promises a tour on Angelo's behalf, and says Angelo will be at the summit with no source in the list. The team's `data/team.json` does name Angelo among the seven going to Lisbon; if the line stays, Angelo should agree to it, and that page can be added as a source. If not, an alternative: "If you are at the summit and curious how a team works with AI agents, the live map and Replay are open to everyone."

## Small, the journalist's call

- "A bigger dot made more commits": true of the round dots; the diamonds (PrompTugal's agents) are all one size. "A bigger round dot" would be exact.
- The counts are from v0.2.862, the screenshots from v0.2.871 and v0.2.872, and the live map has moved on (v0.2.874: 94 agents and 3,020 messages, after Angelo's agents' renames were merged). The draft says so ("The numbers change with every release", and the release in the sources), so this is fine as written.
- "Another of our articles counts those": security@PrompTugal.dinis's piece is a newsroom page, not an article. "Another of our pages" is exact.

## What checks out

- 6 people, 111 agents active in seven days and 2,915 messages, at v0.2.862 (the page's own words: "6 people and 111 agents active in the last 7 days ... and 2915 messages").
- More than four in ten messages to a conductor (42%); work by kind: content and the newsroom (445), building the site (173), running the team (127), then the rest. Each of the six people has a conductor agent.
- The map: people as large circles, agents around them in their colour, round dots for the team site's agents and diamonds for PrompTugal's, solid ring for a scheduled agent and dashed for a fresh session each run, tap to focus and again to clear; the buttons "People ring", "Agents at the centre", "Agents and their work", "Full screen" and "Copy link".
- Replay: every commit since 2 November, a row per agent grouped by person, a row per person on a phone; kinds Work, Report to a conductor, Request from a conductor, Decision recorded; stand-ups and CI's releases marked; speeds 1 h, 6 h and a day a second; jump to a stand-up; filters by time, person, kind, agent and issue.
- Renamed agents drawn once (team-map.mjs: "renamed on 6 November, each drawn once under its role").
- **The screenshots.** The map: six people (first names only, as on the team site), their agents and the arcs; no agent names, nothing private, no contact detail. Replay: 24 hours, one row per person (the phone view), the 12:00 and 18:00 stand-ups marked. Both alt texts and captions match what they show; both images are served (200, image/webp) at the addresses the draft uses, and each caption links the live view.
- Format: front matter valid YAML, in STYLE.md's order; title 6 words; "In short" 4 bullets; "What this does not claim" and "Where this comes from" present, sources as links with read dates; no em-dashes; British spelling.

## Status

Set to `status: fix` in the draft's front matter (STYLE.md, Status). No style edit: the points above go to the journalist first.

## Check again, 6 November 2026, about 22:00 UTC

**Verdict: Ready, but held for Vicky's approval and her call on the closing line.** Compared with the verdict's commit (`8e499a96`), journalist-ai's fixes (`a4f05b23`) are all in and right: bullet 2 (one line per pair, seven days), bullet 4 (the hubs, "more than four in ten"), Replay's tap ("see its commit, with a link to it on GitHub"), the pronouns (the name throughout), "a bigger round dot", "another of our pages". 658 words.

The new closing line, shared by T1 to T5, is the one open point; it is for Vicky, not the journalist (see `t2-who-does-the-work.md`, "The closing line", which applies to all five).

Style edit (mine, one line): the two captions said "The map is Angelo's, from Angelo's command centre"; now "From Angelo's command centre." No fact changed.

Status: `in-review` until Vicky decides the closing line; then `ready`, and Vicky sets `approved`. Not to be published before Angelo has seen it and Vicky approves.
