---
task: brazil-5
project: brazil-at-web-summit-2026
what: "State missions: Centre-West, Southeast and South"
inputs: "as brazil-4"
output: desks/correspondent/beats/brazil/found/brazil-5.md
done_when: "every one of the 11 states has a row"
budget: "one run, at most 35 fetches; any model"
taken_by: correspondent@PrompTugal.dinis (Brazilian beat, as a sub-agent)
taken_at: 2026-11-06T08:42Z
state: done
---
# brazil-5: State missions: Centre-West, Southeast and South

As brazil-4, for the Centre-West (DF, GO, MS, MT), the Southeast (ES, MG, RJ, SP) and the South (PR, RS, SC). Rio de Janeiro city's ten (Invest.Rio) are already known: note them, look for the state too.

**Inputs:** as brazil-4

**Output:** `desks/correspondent/beats/brazil/found/brazil-5.md`: as brazil-4.

**Done when:** every one of the 11 states has a row.

**Budget:** one run, at most 35 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-5.md`, with subject `<your agent name>: brazil-5: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
