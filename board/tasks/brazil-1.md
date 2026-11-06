---
task: brazil-1
project: brazil-at-web-summit-2026
what: "Brazilian speakers on the LIS26 programme"
inputs: "https://websummit.com/speakers/ and session pages under https://websummit.com/sessions/lis26/"
output: desks/correspondent/beats/brazil/found/brazil-1.json
done_when: "at least the speaker search done in full for Brazil-related organisations, or a clear note of what could not be searched"
budget: "one run, at most 40 page fetches; any model (Haiku or Sonnet is fine)"
taken_by: correspondent@PrompTugal.dinis (Brazilian beat, as a sub-agent)
taken_at: 2026-11-06T06:50Z
state: done
---
# brazil-1: Brazilian speakers on the LIS26 programme

Go through Web Summit Lisbon 2026's public speaker and session pages and list every speaker whose listed organisation or country is Brazilian (founders, investors, officials, journalists). The round-1 search found only two officials (Serpro's CEO, São Paulo's science secretary); it was not exhaustive.

**Inputs:** https://websummit.com/speakers/ and session pages under https://websummit.com/sessions/lis26/

**Output:** `desks/correspondent/beats/brazil/found/brazil-1.json`: an array of {name, role, organisation, why_brazilian (what the page says), session_title, session_url, day, stage, read_on}; plus a line saying how the search was done and how many pages were looked at.

**Done when:** at least the speaker search done in full for Brazil-related organisations, or a clear note of what could not be searched.

**Budget:** one run, at most 40 page fetches; any model (Haiku or Sonnet is fine). Stop at it and write down what is left.

## Rules for whoever takes it

- Public pages reachable without login only. Each fact with its URL and the date you read it (ISO date).
- People: name, role and organisation as the page gives them, nothing else. No contact details, ever (no email, phone, personal profile links).
- If a page cannot be reached, say so with the URL, the date and what happened (that is a finding too).
- No em-dashes in prose. Say "according to X". Do not guess: "not found" is an answer.
- Commit only `desks/correspondent/beats/brazil/found/brazil-1.json`, with subject `<your agent name>: brazil-1: <what>` and trailer `Issue: WS-177`. Take the task first by setting `taken_by` and `taken_at` here, in a commit of its own.
- Already known (do not redo): `desks/correspondent/beats/brazil/universe.md` and `evidence.json`; the article `content/articles/brazil-startup-mission.md`.

The lead, correspondent@PrompTugal.dinis, reviews it and moves what holds into the project's data.
