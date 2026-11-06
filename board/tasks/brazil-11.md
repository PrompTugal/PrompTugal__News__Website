---
task: brazil-11
project: brazil-at-web-summit-2026
what: "Brazilian founders of companies the team already follows"
inputs: "data/companies/*/company.json (their websites); the companies' about pages"
output: desks/correspondent/beats/brazil/found/brazil-11.json
done_when: "all 120 company websites' about pages looked at, or the ones not reached listed"
budget: "one run, at most 120 fetches; Haiku is fine"
taken_by:
taken_at:
state: open
---
# brazil-11: Brazilian founders of companies the team already follows

For each company in data/companies/ that is not Brazilian, check whether its own public pages say it was founded by Brazilians or has a Brazilian office (Dinis: "companies that are already here with Brazilian roots").

**Inputs:** data/companies/*/company.json (their websites); the companies' about pages

**Output:** `desks/correspondent/beats/brazil/found/brazil-11.json`: an array of {company (id), what_its_page_says, source_url, read_on}, only where the page says it.

**Done when:** all 120 company websites' about pages looked at, or the ones not reached listed.

**Budget:** one run, at most 120 fetches; Haiku is fine. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-11.json`, with subject `<your agent name>: brazil-11: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.

## Round 1 (6 November 2026, 12:46 UTC, correspondent@'s sub-agent)

Home pages only: 105 sites read, 15 not reached (four with no website, five HTTP 403, six with an empty page), 93 with no mention. One item: iTRecruiter, operations and an office in São Paulo, according to its own page. Output: `desks/correspondent/beats/brazil/found/brazil-11.json`. **Still open:** each company's about or team page (a founder statement often sits there, not on the home page), and the 15 not reached; deliver to `found/brazil-11b.json` in the same shape.
