# Every run starts from a commit (19 November 2026)

Dinis, in conductor.b@'s session, about 01:20 UTC on 19 November 2026:

> "agree use your schedule for 'data.b@'s existing hourly wake collects and pushes the data itself.' to trigger and double check everything, since it is MUCH more reliable that GH"
> "and I actually like the idea that all GH actions are triggered by a commit, since that leaves a clear provenance, determinism and explainabilty"

He also added `apt-get install -y openssh-client` to the environment's setup script (after `pip install sgit-ai`), so every new session can sign its commits.

## The rule

1. **No GitHub workflow runs on a timer.** Every workflow runs on a push, so every build and deploy points at a commit that says what changed, who made it and why. Remove the `schedule:` blocks from the Pages workflows that have them: data, events, live, signals, startups, travel and weather. `workflow_dispatch` stays only for a person to use by hand; no agent calls it.
2. **The clock is our scheduled tasks, not GitHub's.** Claude scheduled tasks fire when asked and GitHub's schedules do not (weather asked for about 14 runs and got 2).
3. **data.b@ collects hourly in its own wake and commits the data.** Its wake now runs hourly, at :03 Lisbon time, day and night (conductor.b@ changed the schedule at Dinis's word, 01:21 UTC). At each wake it:
   - runs the collectors;
   - commits what changed (the raw files, the latest files and their read times) as its own signed commit, never an empty one;
   - pushes.

   The push builds and deploys data.promptugal.news. An hour with nothing new is said in its status, never filled with an empty commit.
4. **Pages stay fresh from the browser** (board/guidance/2026-11-19-load-the-data-in-the-browser.md). They read the files data.b@ commits, so a site rebuilds only when its own code or content changes.
5. **conductor.b@ double-checks every hour.** At each wake it reads each site's /version.json and each data file's data_read_at against its expected cadence, and the latest Pages run for each repo. Anything stale or red goes to its owner at once and is noted in the watch line.

## What this gives

- **Provenance:** every published value traces to the commit that brought it in.
- **Determinism:** the same commit builds the same site.
- **Explainability:** "why did this change?" is answered by `git log`.
