---
task: brazil-10
project: brazil-at-web-summit-2026
what: "Who hosts the German-Brazilian Startup Night"
inputs: "https://websummit.com/sessions/lis26/8614a78e-c6b7-4c95-8f7b-a52a4cc38885/german-brazilian-startup-night/; search engines; the German-Brazilian chambers (AHK)"
output: desks/correspondent/beats/brazil/found/brazil-10.md
done_when: "the organisers found, or the pages tried listed"
budget: "one run, at most 15 fetches; any model"
taken_by:
taken_at:
state: open
---
# brazil-10: Who hosts the German-Brazilian Startup Night

Web Summit lists a German-Brazilian Startup Night on 10 November, 17:30 to 22:30, with no hosts. Find who organises it (chambers of commerce, embassies, accelerators) and whether it needs registration.

**Inputs:** https://websummit.com/sessions/lis26/8614a78e-c6b7-4c95-8f7b-a52a4cc38885/german-brazilian-startup-night/; search engines; the German-Brazilian chambers (AHK)

**Output:** `desks/correspondent/beats/brazil/found/brazil-10.md`: the organisers, what the event is, how to attend, each with its source and date read.

**Done when:** the organisers found, or the pages tried listed.

**Budget:** one run, at most 15 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-10.md`, with subject `<your agent name>: brazil-10: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
