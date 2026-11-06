---
task: brazil-6
project: brazil-at-web-summit-2026
what: "Paraíba's 30 startups"
inputs: "https://paraiba.pb.gov.br/noticias, https://auniao.pb.gov.br/, https://fapesq.rpp.br/, regional press (Jornal da Paraíba, ClickPB), search engines"
output: desks/correspondent/beats/brazil/found/brazil-6.md
done_when: "the sites tried again and the result written down, found or not"
budget: "one run, at most 20 fetches; any model"
taken_by:
taken_at:
state: open
---
# brazil-6: Paraíba's 30 startups

Find the names of the 30 startups Paraíba's government said it would take to Web Summit Lisbon 2026, and who funds them. On 5 and 6 November its sites did not answer (paraiba.pb.gov.br reset; auniao.pb.gov.br HTTP 503; fapesq.rpp.br unavailable).

**Inputs:** https://paraiba.pb.gov.br/noticias, https://auniao.pb.gov.br/, https://fapesq.rpp.br/, regional press (Jornal da Paraíba, ClickPB), search engines

**Output:** `desks/correspondent/beats/brazil/found/brazil-6.md`: the count and names if public, each with its source and date read; every site tried with what happened.

**Done when:** the sites tried again and the result written down, found or not.

**Budget:** one run, at most 20 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-6.md`, with subject `<your agent name>: brazil-6: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
