---
task: brazil-2
project: brazil-at-web-summit-2026
what: "Brazilian companies with a LIS26 appearance page"
inputs: "websummit.com appearance pages; the 11 Brazilian companies the team already follows are in data/companies/*/company.json with 'country': 'Brazil' (mark them, do not redo them)"
output: desks/correspondent/beats/brazil/found/brazil-2.json
done_when: "every result of at least five searches opened and listed, the searches written down"
budget: "one run, at most 50 fetches; any model"
taken_by: correspondent@PrompTugal.dinis (Brazilian beat, as a sub-agent)
taken_at: 2026-11-06T04:45Z
state: done
---
# brazil-2: Brazilian companies with a LIS26 appearance page

Find Brazilian companies (startups, partners, exhibitors) that have a LIS26 appearance page on websummit.com, by searching (for example `site:websummit.com lis26 Brazil`, `São Paulo`, `.com.br`) and opening each page.

**Inputs:** websummit.com appearance pages; the 11 Brazilian companies the team already follows are in data/companies/*/company.json with "country": "Brazil" (mark them, do not redo them)

**Output:** `desks/correspondent/beats/brazil/found/brazil-2.json`: an array of {name, website, what (one line, from the page), city, attending_as, appearance_url, read_on, already_followed (true/false)}.

**Done when:** every result of at least five searches opened and listed, the searches written down.

**Budget:** one run, at most 50 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-2.json`, with subject `<your agent name>: brazil-2: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
