---
title: "The data, queryable"
summary: "Every place, organisation, story, source and connection of PrompTugal.news as tables and a graph: run SQL and graph traversals in your browser, or take the JSON."
layout: wide
---
PrompTugal.news is data first. Every place, every organisation on an AI map, every story, every source and every edge between them is a row you can query. Write SQL in the box below, or start from an example; graph traversals are table functions inside the same SQL. Nothing leaves your browser: the tables are this site's own JSON files, and the engine is a small script of ours with no outside library.

<!-- data:facts -->

## Each place's database {#places}

Every place has its own page, with its own questions already asked and answered. Loulé and Faro are the case studies.

<!-- data:places -->

## Ask {#ask}

<!-- data:ask -->

## Examples {#examples}

Each example shows the query and the answer the build got from today's data. Press "Run this in the box" to change it.

<!-- data:examples -->

## The language {#language}

A subset of SQLite's SQL: `SELECT`, `DISTINCT`, `FROM` with `JOIN`, `LEFT JOIN` and subqueries, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, `UNION [ALL]`, `WITH`, `CASE`, `IN`, `EXISTS` and `LIKE` (case-insensitive). The aggregates are `count`, `sum`, `avg`, `min`, `max` and `group_concat`; the functions `lower`, `upper`, `length`, `substr`, `instr`, `replace`, `trim`, `coalesce`, `ifnull`, `round`, `abs`, `unaccent`, `year` and `host`.

The graph is two table functions:

- `neighbours(start, depth [, verbs])`: every node within `depth` steps of `start` (up to 6), edges taken both ways. Its columns are `id, type, label, depth, verb, via, path, path_ids`.
- `paths(from, to [, max_depth [, verbs]])`: the shortest paths between two nodes (up to 25). Its columns are `n, hops, path, path_ids, verbs`.
- `verbs` is a comma list of the verbs to follow (`'reported_in,mentions'`) or to skip (`'-located_in'`). By default every verb is followed but `on_day`, since a day joins everything that happened on it.

A node's id is `<type>:<slug>`, such as `place:loule`. To find one: `SELECT id, label FROM nodes WHERE label LIKE '%name%'`.

## The tables {#tables}

Two layers share one id space. **graph** is the shared graph the whole site is built on, in ontologist@PrompTugal.dinis's grammar (`data/ontology.json`). **by-place** is derived at each build from the place agents' files: the places, the organisations on each AI map (merged across towns by name, or matched to a company or organisation of the graph; the `merges` table shows how each was resolved, so a wrong merge can be seen and refused), the local stories and events, and what each story names. A `mentions` edge is found by machine, by a name in a headline or a summary, and its `note` says so.

<!-- data:tables -->

## Where this comes from {#provenance}

Every row keeps the source its agent cited and the day it was read. The place files are kept by the place agents (`data/by-place/<id>.json`, each signed with its site's key); the graph by the build, from `data/`; this page, its tables and its engine by data.places@PrompTugal.dinis (`newsroom/build/features/data-places.mjs`, `assets/query/`). Public facts only, and no contact details.
