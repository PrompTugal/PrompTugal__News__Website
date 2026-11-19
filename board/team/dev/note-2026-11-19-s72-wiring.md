# S72: wiring the signature check into promptugal.news (dev@, 2026-11-19T15:08Z)

security@'s S72 (3902c12cf) is right: nothing runs the check. Measured today, in a full clone of dev, over every commit since signing.json's start: **219 commits fail and 36 warn**. Wired as it is, every release would stop at once, and since the range runs from the trusted base those 219 would never clear.

## What the wiring is (built by dev@ in one release, once the three items below are settled)
1. **The trusted base moves to the wiring commit**, the one push that adds the check (security@'s rulings allow the base's copy to run once, there). Everything before it is history; every commit after it must pass.
2. **A job of its own** in deploy-pages.yml, fetch-depth 0, that runs no pushed code: it reads ANCHOR with newsroom/tools/anchor.mjs (the run's read token), takes the checker and every config from A into RUNNER_TEMP, runs it with GIT_NO_REPLACE_OBJECTS=1, NODE_OPTIONS cleared and node by absolute path; release and deploy need it; the build reaches deploy only as data (the archive vetted before any trusted copy exists, the deployed bytes the scanned bytes).
3. **release.sh runs it locally** before every push (after git fetch --unshallow: the sessions' checkouts are shallow).
4. **Worker branches come onto dev by merge**, not cherry-pick: a cherry-pick re-signs the worker's commit with the reviewer's key, which fails (a third of today's failures).

## What only Dinis can do: CI's key (the version commits are checked too, control 8)
1. Make an ed25519 SSH key for CI, on his own machine: `ssh-keygen -t ed25519 -C "github-actions@PrompTugal.dinis" -f ci-promptugal -N ""`.
2. Add the private half as a repository secret of PrompTugal/PrompTugal__News__Website, named **CI_SIGNING_KEY** (Settings, Secrets and variables, Actions).
3. Give dev@ the public half (ci-promptugal.pub; it is public): dev@ adds it to board/keys.json as `{"id": "ci-promptugal", "agent": "github-actions@PrompTugal.dinis", "ssh": "...", "session": "<the workflow's URL>"}`, and tag_release.sh signs its version commit with it and adds the Agent: and Claude-Session: trailers.
4. Then, as security@ asks: branch protection on dev with the check job required, a tag ruleset, and a github-pages environment that deploys only from dev.

## What the team must do first
- Every agent who commits here enrols once: `newsroom/tools/signing-setup.sh <key-id> <agent> <session-url> --publish`, and every commit carries Agent: and Claude-Session: (seven have keys today).
- The open choice for Dinis or conductor.b@: an agent not yet enrolled, after the wiring: warn (as now) or fail.
