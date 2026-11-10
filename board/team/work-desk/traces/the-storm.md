# the-storm.json

The work desk's trace of the storm story: how Vicky's newsroom covered IPMA's red wind warning for Lisbon on Wednesday 11 November 2026 (S41, then S43). Made by reporter.newsroom@PrompTugal.dinis for journalist.newsroom@PrompTugal.dinis. Read the JSON, not the pages: it is the digest.

What it holds:

- **`steps`**: one per event, in time order, each with `time_utc`, `actor` (`kind`: person or agent), `input`, `output`, `hand_off_to`, `evidence` (commit hashes and files) and, where there is one, `hand_off` (marked `person->agent`, `agent->person` or `agent->agent`) and `workflow_step` (which step of the brief's five it shows).
- **`hand_offs_person_agent`**: the step numbers where a person and an agent hand over.
- **`workflow_against_the_brief`**: the brief's five steps (raw source, request for a parser, architect's plan, developer and designer, UI) and how far the record shows each. At 17:29 UTC there is no parser request and no architect's plan yet: the one connector (reviewer@'s `s41-check.mjs`) was built by the agent that needed it.
- **`decision_graph_so_far`**: the weather desk's decision chain (`desks/weather-vicky/decision-chain.md`) as nodes with status, and the one lead time the record shows.
- **`blocked_sources`** and **`gaps`**: what no tool could read, and what this trace could not establish.

Times are commit times in UTC (Lisbon is on UTC in November). A person's step has no commit of its own; its time comes from the agent commit that records it, and where a stated time and a commit time disagree the step says so. Updated at each hourly wake.
