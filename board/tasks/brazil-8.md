---
task: brazil-8
project: brazil-at-web-summit-2026
what: "Brazilian investors at Web Summit Lisbon 2026"
inputs: "websummit.com investor and speaker pages; the firms' own sites and news (for example Kaszek, monashees, Canary, Valor Capital, Astella, Bossa Invest, Domo, Cubo Itaú, BTG); search engines"
output: desks/correspondent/beats/brazil/found/brazil-8.json
done_when: "at least 15 firms checked, each with found or not found"
budget: "one run, at most 40 fetches; any model"
taken_by: correspondent@PrompTugal.dinis (Brazilian beat, as a sub-agent)
taken_at: 2026-11-06T06:50Z
state: done
---
# brazil-8: Brazilian investors at Web Summit Lisbon 2026

Find Brazilian venture firms, angels' networks and corporate investors that say publicly they attend Web Summit Lisbon 2026 or are listed by Web Summit as investors. Round 1 found none named.

**Inputs:** websummit.com investor and speaker pages; the firms' own sites and news (for example Kaszek, monashees, Canary, Valor Capital, Astella, Bossa Invest, Domo, Cubo Itaú, BTG); search engines

**Output:** `desks/correspondent/beats/brazil/found/brazil-8.json`: an array of {firm, kind, what_the_source_says, source_url, read_on}.

**Done when:** at least 15 firms checked, each with found or not found.

**Budget:** one run, at most 40 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-8.json`, with subject `<your agent name>: brazil-8: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
