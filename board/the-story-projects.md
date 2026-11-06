---
title: "Story projects: going deep on one story, with a budget, its own data folder, and work anyone can pick up"
by: conductor@PrompTugal.dinis
written: 2026-11-06T05:05Z
decided_by: Dinis Cruz, 6 November 2026, about 05:00 UTC (board/guidance/2026-11-06-the-brazil-story-and-story-projects.md)
issue: WS-177
---
# Story projects

A **story project** goes deep on one story (or topic) in several rounds, until it is the best map of its subject anywhere: add, refactor, make it easy; add more, refactor, clean up. It has a budget (accountant@), a data folder, a lead agent, and a task list that agents from any team can pick up. The first is **Brazil at Web Summit Lisbon 2026**.

## The parts of every story project

| Part | Where | What |
|---|---|---|
| The project file | `board/projects/<slug>.md` | goal, lead, budget, rounds, state, the task list, what was learnt |
| The data folder | `data/stories/<id>/` (story.json today) plus `sources/`, `entities.json`, `claims.json`, `graph.json`, `timeline.json` | each source fetched once and processed (what it says, its facts, entities, links, date read), the entities and how they connect, every claim marked fact, estimate or opinion with its source, the timeline; the article as structured blocks (JSON) as well as markdown |
| The article | `content/articles/<slug>.md` | the story, rewritten each round; In short; an infographic; the article's graph; modes (focus, links, claims, data) as dev@ builds them |
| Reference notes | `content/newsroom/notes/` or `content/articles/` | a short article on each important source document, as newsroom.sgit.ai does |
| The section | `/brazil/` (and later `/uk/`, `/portugal/` as it is) | everything known about a country at the summit: companies, founders, organisers, sessions, events, stories |
| The invitation | the end of every project article | "If you are part of this, tell us": the agents' address, a pull request, a sealed message (board/inbox.json's public lane), corrections welcome |
| The tasks | `board/tasks/<slug>-<n>.md` | small, specified pieces anyone (any team's agent, any model) can pick up: what, inputs, output path, done when, budget |

## Brazil at Web Summit Lisbon 2026: round 1

| Agent | The work |
|---|---|
| `correspondent@` (lead; the Brazil beat as a sub-agent) | the project file and its task list; the universe: ApexBrasil's and Sebrae's delegation, the 100 selected startups, the state missions, Brazilian companies and founders already at the summit, press releases naming who is coming, where the counts disagree |
| `ontologist@` | the data folder's schema (sources, entities, claims, graph, timeline, blocks); the Brazilian companies and organisations in the graph, linked to sessions, investors, topics; the article as blocks |
| `journalist@` | round 1's rewrite of S9 from the data folder (shorter text, more structure); a reference note on each key source (the Sebrae rules, ApexBrasil's announcement, the Lusa report); the invitation at the end |
| `designer@` | the article's infographic and layout (no wall of text; the space used), the Brazil section's look |
| `dev@` | the article page's modes (focus, links, data with the JSON to download) and the `/brazil/` section, from the data folder |
| `outreach@` | when the companies are known: one draft each, leading with their page and the project |
| `sherpa@`, `synthetic@` | the reader's review after each round |
| `accountant@` | the project's budget in runs and tokens; stop at it |
| `security@` | pre-review and post-review (no personal data beyond public and professional) |
| `historian@` | what was learnt, for the next project (Técnico, the UK delegation) |

## Others can pick up tasks

At Dinis's word, Vicky's, Angelo's and Indi's agents, and agents on cheaper models or other accounts, may take tasks from `board/tasks/`. A task says what to fetch or write, where the output goes, what done looks like and its budget; whoever takes it writes `taken_by` and a date, and commits only its output path. The conductor reviews the list at each wake.

## The measure

How many people contribute (and the agents they bring): a count kept by observability@ and historian@, shown on Dinis's dashboard, apart from page views.
