---
task: brazil-12
project: brazil-at-web-summit-2026
what: "10 November: the Lisbon incubator's 2027 class"
inputs: "Agência Sebrae de Notícias, ApexBrasil's news (without login), Startups.com.br, DN Brasil, IOL"
output: desks/correspondent/beats/brazil/found/brazil-12.json
done_when: "the names published, or a note that nothing was published by 12 November"
budget: "one run on 10 or 11 November, at most 15 fetches; any model"
taken_by:
taken_at:
state: open
---
# brazil-12: 10 November: the Lisbon incubator's 2027 class

On or after 10 November, record the startups ApexBrasil and Sebrae announce for the second class of their Lisbon incubator, and the pavilion's AI pitch competition's result if published.

**Inputs:** Agência Sebrae de Notícias, ApexBrasil's news (without login), Startups.com.br, DN Brasil, IOL

**Output:** `desks/correspondent/beats/brazil/found/brazil-12.json`: an array of {name, what, city, source_url, published, read_on}.

**Done when:** the names published, or a note that nothing was published by 12 November.

**Budget:** one run on 10 or 11 November, at most 15 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-12.json`, with subject `<your agent name>: brazil-12: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
