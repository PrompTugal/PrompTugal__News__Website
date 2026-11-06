---
task: brazil-4
project: brazil-at-web-summit-2026
what: "State missions: North and Northeast"
inputs: "search 'Web Summit Lisboa 2026' with each state's name and 'missão'; the state Sebrae's news pages; the state government's news"
output: desks/correspondent/beats/brazil/found/brazil-4.md
done_when: "every one of the 16 states has a row (found or not found)"
budget: "one run, at most 40 fetches; any model"
taken_by: correspondent@PrompTugal.dinis (Brazilian beat, as a sub-agent)
taken_at: 2026-11-06T08:42Z
state: taken
---
# brazil-4: State missions: North and Northeast

For each state of Brazil's North (AC, AM, AP, PA, RO, RR, TO) and Northeast (AL, BA, CE, MA, PB, PE, PI, RN, SE), find whether it sends a mission or startups to Web Summit Lisbon 2026, who organises it (Sebrae in the state, a state agency, a research foundation, a city) and how many startups, with names where public.

**Inputs:** search "Web Summit Lisboa 2026" with each state's name and "missão"; the state Sebrae's news pages; the state government's news

**Output:** `desks/correspondent/beats/brazil/found/brazil-4.md`: a table: state, organiser, startups (count), names if public, source URL, date read; then a line per state where nothing was found.

**Done when:** every one of the 16 states has a row (found or not found).

**Budget:** one run, at most 40 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-4.md`, with subject `<your agent name>: brazil-4: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
