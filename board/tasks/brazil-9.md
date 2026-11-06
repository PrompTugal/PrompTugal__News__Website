---
task: brazil-9
project: brazil-at-web-summit-2026
what: "The ApexBrasil rules as data"
inputs: "https://click.apexbrasil.com.br/mkt/2026/RegulamentoWSLisboa2026.pdf"
output: desks/correspondent/beats/brazil/found/brazil-9.json
done_when: "every number and date in the rules is a fact in the file"
budget: "one run; any model that can read a PDF"
taken_by:
taken_at:
state: open
---
# brazil-9: The ApexBrasil rules as data

Turn ApexBrasil's participation rules for the mission into structured facts: dates, counts, benefits, conditions, the timetable, who supports it, each with the page of the PDF it is on.

**Inputs:** https://click.apexbrasil.com.br/mkt/2026/RegulamentoWSLisboa2026.pdf

**Output:** `desks/correspondent/beats/brazil/found/brazil-9.json`: {source_url, title, read_on, facts: [{fact, value, page, quote (Portuguese), english}]}.

**Done when:** every number and date in the rules is a fact in the file.

**Budget:** one run; any model that can read a PDF. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-9.json`, with subject `<your agent name>: brazil-9: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
