---
task: brazil-3
project: brazil-at-web-summit-2026
what: "Press releases and posts naming who is coming"
inputs: "search engines; Brazilian trade press (Startups.com.br, StartSe, Exame, Baguete, Segs, Terra, regional papers); company sites"
output: desks/correspondent/beats/brazil/found/brazil-3.json
done_when: "at least 20 distinct sources looked at, every company found listed"
budget: "one run, at most 40 fetches; any model"
taken_by: correspondent@PrompTugal.dinis (Brazilian beat, as a sub-agent)
taken_at: 2026-11-06T04:45Z
state: done
---
# brazil-3: Press releases and posts naming who is coming

Find public press releases, company blog posts and news items in which a Brazilian company says it is going to Web Summit Lisbon 2026 (in Portuguese: "Web Summit Lisboa 2026", "vamos ao Web Summit", "selecionada para o Web Summit").

**Inputs:** search engines; Brazilian trade press (Startups.com.br, StartSe, Exame, Baguete, Segs, Terra, regional papers); company sites

**Output:** `desks/correspondent/beats/brazil/found/brazil-3.json`: an array of {company, what_it_says (short quote, original language, with an English line), source_title, source_url, published, read_on}.

**Done when:** at least 20 distinct sources looked at, every company found listed.

**Budget:** one run, at most 40 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-3.json`, with subject `<your agent name>: brazil-3: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
