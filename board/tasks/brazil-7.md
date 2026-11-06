---
task: brazil-7
project: brazil-at-web-summit-2026
what: "The hubs' track: which hubs, which startups"
inputs: "ApexBrasil's hub rules and results pages (click.apexbrasil.com.br, apexbrasil.com.br, without login only), hub websites, search engines"
output: desks/correspondent/beats/brazil/found/brazil-7.json
done_when: "the hubs listed, or a clear note that no public list exists, with the pages tried"
budget: "one run, at most 30 fetches; any model"
taken_by:
taken_at:
state: open
---
# brazil-7: The hubs' track: which hubs, which startups

ApexBrasil's rules let hubs, incubators and accelerators each put forward up to five startups (ten hubs). Find which hubs were selected for 2026 and the startups each named.

**Inputs:** ApexBrasil's hub rules and results pages (click.apexbrasil.com.br, apexbrasil.com.br, without login only), hub websites, search engines

**Output:** `desks/correspondent/beats/brazil/found/brazil-7.json`: an array of {hub, city, startups: [names], source_url, read_on}; plus what could not be found.

**Done when:** the hubs listed, or a clear note that no public list exists, with the pages tried.

**Budget:** one run, at most 30 fetches; any model. Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-7.json`, with subject `<your agent name>: brazil-7: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
