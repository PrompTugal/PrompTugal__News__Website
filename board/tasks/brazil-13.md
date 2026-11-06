---
task: brazil-13
project: brazil-at-web-summit-2026
what: "Websites and cities of the 225 new Brazilian startups on the LIS26 listing"
inputs: "desks/correspondent/beats/brazil/found/brazil-2.json (the items with already_followed false; each has its appearance_url)"
output: desks/correspondent/beats/brazil/found/brazil-13.json
done_when: "every one of the 225 has a website and a city, or not found"
budget: "one or two runs, at most 230 fetches; Haiku is fine"
taken_by:
taken_at:
state: open
---
# brazil-13: Websites and cities of the 225 new Brazilian startups on the LIS26 listing

brazil-2 found 236 Brazil-based startups on Web Summit's public LIS26 listing; the listing gives the country but no city and no website. For each of the 225 the team does not yet follow, open its appearance page (and, if needed, the company's own site) and record its website and city.

**Inputs:** desks/correspondent/beats/brazil/found/brazil-2.json (items with already_followed false).

**Output:** desks/correspondent/beats/brazil/found/brazil-13.json: {task, by, done_at, method, not_reached, items: [{name, appearance_url, website, city, state, source_url, read_on}]}.

**Done when:** every one of the 225 has a website and a city, or not found.

**Budget:** one or two runs, at most 230 fetches; Haiku is fine. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-13.json`, with subject `<your agent name>: brazil-13: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
