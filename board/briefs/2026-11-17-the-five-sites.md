# The five PrompTugal sites: what they share

conductor@PrompTugal.dinis, 17 November 2026, at Dinis's word ("let's do them all in one go ... spin up an agentic team for them to set them up (Opus and Sonnet), and then once we have the first version that we are happy with, we archive them, and I start them on a schedule on my other Claude account"). Read with `board/briefs/2026-11-17-data-site-and-focused-newsrooms.md`.

| Site | Repo | Lead agent | Focus |
|---|---|---|---|
| data.promptugal.news | PrompTugal/PrompTugal__News__Data | data@PrompTugal.dinis | raw public sources: one collector, one vault, one API, one card per source; no articles; every other site reads from it |
| weather.promptugal.news | PrompTugal/PrompTugal__News__Weather | weather@PrompTugal.dinis | weather and civil protection, place by place, with visualisations; Storm Charles as its first archived event |
| civic.promptugal.news | PrompTugal/PrompTugal__News__Civic | civic@PrompTugal.dinis | public money, public services and bureaucracy, explained and cross-mapped; never presented as official |
| startups.promptugal.news | PrompTugal/PrompTugal__News__Startups | startups@PrompTugal.dinis | startups and funding, place by place; investors as a section |
| travel.promptugal.news | PrompTugal/PrompTugal__News__Travel | travel@PrompTugal.dinis | travel and tourism: flights, transport and strikes, weather for visitors, events; tourism as an industry as a section |

## How each team works

- **One session per site**: an Opus lead (the role above) that runs Sonnet sub-agents inside its own run (dev, design, data, writer as needed), named with a dot (`weather.dev@PrompTugal.dinis`). No new sessions, no scheduled tasks: Dinis schedules them later on his other account.
- **Its own repo, dev only.** Never push to main, never force-push, never rewrite history, never disable a check. Commit as `<role>@PrompTugal.dinis: <what>` with trailers `Agent:`, `Issue: WS-177`, `For: Dinis`.
- **The estate's standard** (as PrompTugal__News__Website): a `CLAUDE.md`, a `BRIEF.md` (the focus below, in full), `REALITY.md` (what exists; a thing not in it does not exist), a version on every push shown on every page, a build and a gate in Node 18 with no dependencies, a markdown twin for every page and `llms.txt`. Copy what helps from PrompTugal__News__Website (`newsroom/build/`, the release script); keep it small.
- **Identity:** make a session key (`pki-agent.mjs keygen --session`, from https://pki.sgit.ai/agents/pki-agent.mjs), publish its public half in the repo's `board/keys.json`. Private halves never in a repository.
- **Brand:** PrompTugal.news brand v2.0 (`design/brand/` and `design/brand/brand-tokens.css` in PrompTugal__News__Website): the same wordmark family, paper, ink, red and green; each site a sub-brand ("PrompTugal.news · Weather").
- **Data:** read from data.promptugal.news's APIs. Until they exist, read PrompTugal__News__Website's `data/by-place/*.json` and `data/by-place/now/*.json` (signed, public) and the Storm Charles repo's data; the Data team owns the collectors.
- **Facts:** public sources only, each value with its source, page and the date read. Never a private person's contact; public contacts only as published on an official page, linked with the date read. Never machine-read websummit.com, lu.ma, luma.com, meetup.com or eventbrite.*. Read politely (2 to 3 seconds between requests, a named user agent, backoff). A refusal (403, bot check, robots) is respected and recorded as a gap, never worked around. No em-dashes in prose.
- **Every page shows how it was made** (the provenance model: `board/spec-provenance-and-review.md`): what runs as code, what agents wrote (which agent, which model), what a person checked.
- **Pay for what you read:** the statement in the masthead, linking to https://promptugal.news/account/ until each site has its own meter.
- **Secrets:** `SG_SEND_ACCESS_TOKEN` (vault writes) and `OPEN_ROUTER_KEY` (images, within budget) are in the environment: read them from the environment only; never print, log or commit them.

## The first version (then stop)

1. The repo set up to the standard above; the site live at its domain over HTTPS.
2. A front page and the three to five core pages that show the focus with real data.
3. One design pass: three variations of the front page side by side for Dinis to choose (`/design/`).
4. `REALITY.md` true; a hand-over debrief in `board/team/<role>/debriefs/2026-11-17-first-version.md` (what exists, what is next, what blocks you, what Dinis must decide) so a session on another account can carry on.
5. Tell the conductor (send_message to its session, the one that started yours) in five lines: the URL, what is live, what is next, what you need from Dinis. Then stop.
