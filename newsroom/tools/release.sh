#!/usr/bin/env bash
# Copied from the team site (SGit-AI__Website__Web-Summit, admin/tools/release.sh) on 4 November 2026; only the example name changed.
# Release from any person's or agent's clone, safely while others push too. CI owns the version
# (https://newsroom.sgit.ai/articles/ci-owns-the-version.html): you never write a number.
#   AGENT=newsroom@web-summit.dinis newsroom/tools/release.sh ["one sentence, for your own log"]
# Before running: commit your SOURCE changes with the convention (subject "<your name>: <what>", trailer
# "Agent: <your name>"); never generated pages, version.txt or versions.json. This script then: fetches dev,
# rebases your commits on it, builds and runs the gate locally (so a red gate never leaves your machine),
# pushes (rebasing again if someone pushed first), and waits for CI to number your release and for the live
# site to serve it. CI's release commit is "site vX.Y.Z: <your subject>".
#   SKIP_LIVE=1  do not wait for CI and the live site     DRY=1  do everything but push
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

# board/keys.json is a list every new session appends its key to; two appends at the end of the list are a
# textual conflict but not a real one. During a stopped rebase or merge, `release.sh --resolve-keys` merges the
# three versions entry by entry (by id): an entry changed on one side only takes that side's change, a new entry
# from either side is kept (ours first, then theirs, in their order); an entry or a top-level field changed
# differently on both sides is a real conflict and is left for a person (exit 1). CI's test merge of a worker's
# branch calls it too. (devops@PrompTugal.dinis, 7 November 2026: the account B onboarding burst, runs 768 to 776.)
resolve_keys() {
  [ "$(git diff --name-only --diff-filter=U)" = "board/keys.json" ] || return 1
  node --input-type=module - <<'JS' || return 1
import { execFileSync } from 'node:child_process'; import fs from 'node:fs'
const stage = n => { try { return JSON.parse(execFileSync('git', ['show', `:${n}:board/keys.json`], { encoding: 'utf8' })) } catch { return null } }
const [base, ours, theirs] = [stage(1) || { keys: [] }, stage(2), stage(3)]
if (!ours || !theirs) process.exit(1)
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const pick = (b, o, t, what) => {
  if (same(o, t) || same(t, b)) return o
  if (same(o, b)) return t
  console.error(`release.sh: board/keys.json: ${what} changed differently on both sides`); process.exit(1)
}
const out = {}
for (const f of new Set([...Object.keys(ours), ...Object.keys(theirs)])) if (f !== 'keys') {
  const v = pick(base[f], ours[f], theirs[f], `the field ${f}`); if (v !== undefined) out[f] = v
}
const byId = l => new Map((l || []).map(k => [k.id, k]))
const [B, O, T] = [byId(base.keys), byId(ours.keys), byId(theirs.keys)]
out.keys = []
for (const id of [...new Set([...O.keys(), ...T.keys()])]) {
  const v = pick(B.get(id), O.get(id), T.get(id), `the entry ${id}`); if (v !== undefined) out.keys.push(v)
}
fs.writeFileSync('board/keys.json', JSON.stringify(out, null, 2) + '\n')
console.log(`release.sh: board/keys.json merged entry by entry (${out.keys.length} keys)`)
JS
  git add board/keys.json
}
if [ "${1:-}" = "--resolve-keys" ]; then resolve_keys; exit $?; fi

AGENT=${AGENT:?set AGENT to your name, e.g. AGENT=newsroom@web-summit.dinis}
BRANCH=dev
[ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || { echo "release.sh: be on $BRANCH"; exit 1; }
if [ -n "$(git status --porcelain)" ]; then
  echo "release.sh: commit your source changes first (never generated pages); the tree is not clean:"; git status --short | head -20; exit 1
fi
for attempt in 1 2 3 4 5; do
  git fetch -q origin "$BRANCH"
  if ! git rebase -q "origin/$BRANCH"; then
    # appends to board/keys.json on both sides are merged by id; anything else stops for a person
    rebasing() { [ -d "$(git rev-parse --git-path rebase-merge)" ] || [ -d "$(git rev-parse --git-path rebase-apply)" ]; }
    while rebasing && resolve_keys; do GIT_EDITOR=true git rebase --continue >/dev/null 2>&1 || true; done
  fi
  if [ -d "$(git rev-parse --git-path rebase-merge)" ] || [ -d "$(git rev-parse --git-path rebase-apply)" ]; then
    echo "release.sh: your commits conflict with dev; resolve them by hand:"; git diff --name-only --diff-filter=U; git rebase --abort; exit 1
  fi
  [ "$(git rev-list --count "origin/$BRANCH..HEAD")" = 0 ] && { echo "release.sh: nothing of yours to push"; exit 0; }
  # a hold on dev (board/HOLD.md, written by security@, lifted only by Dinis; board/the-team-setup.md) stops every
  # release, except the push that writes, changes or removes the hold itself (devops@PrompTugal.dinis, 6 November 2026)
  if [ -e board/HOLD.md ] && ! git diff --name-only "origin/$BRANCH..HEAD" | grep -qx 'board/HOLD.md'; then
    echo "release.sh: dev is on hold (board/HOLD.md); nothing pushed. Your commits stay here; release them when Dinis lifts the hold:"
    sed -n '1,12p' board/HOLD.md; exit 1
  fi
  # a pure rename (R100, as in the move of admin/ to newsroom/) changes no number; any other change does
  if git diff -M --name-status "origin/$BRANCH..HEAD" | grep -vE '^R100' | grep -qE '(^|\s)(admin|newsroom)/(build/version\.txt|versions\.json)$'; then
    echo "release.sh: your commits change version.txt or versions.json; only CI writes those now. Drop those changes."; exit 1
  fi
  # the derived entities (data/events, people, organisations, evidence, stories, matching.json) follow the desks'
  # files: the tool writes them, in a commit of their own, so a desk agent commits only its own desks/<desk>/ and
  # never hand-edits derived data (5 November 2026: Vicky's programme and curator desks were held by the gate)
  node newsroom/tools/derive.mjs >/dev/null
  if [ -n "$(git status --porcelain -- data)" ]; then
    git add -A data
    git commit -q -m "$AGENT: derived data brought up to date (newsroom/tools/derive.mjs, run by release.sh)" -m "Agent: $AGENT"
    echo "release.sh: the derived data changed with your desk files; committed it separately"
  fi
  node newsroom/build/validate.js   # the gate builds the site itself, once (check 9)
  [ "${DRY:-0}" = 1 ] && { echo "DRY: would push $(git rev-list --count "origin/$BRANCH..HEAD") commit(s)"; exit 0; }
  MINE=$(git rev-parse HEAD)
  if git push -q origin "HEAD:$BRANCH"; then echo "pushed ${MINE:0:9}; CI numbers the release"; break; fi
  echo "release.sh: someone pushed first; rebasing and trying again"
  [ "$attempt" = 5 ] && { echo "release.sh: gave up after 5 attempts"; exit 1; }
  sleep $((attempt * 3))
done
[ "${SKIP_LIVE:-0}" = 1 ] && exit 0
HOST=$(cat CNAME)
for i in $(seq 1 36); do
  git fetch -q --tags origin "$BRANCH"
  TAG=$(git tag --contains "$MINE" --list 'v*' | sort -V | head -1 || true)
  if [ -n "$TAG" ]; then
    LIVE=$(curl -s -H 'Cache-Control: no-cache' "https://$HOST/llms.txt?release=${MINE:0:9}-$i" | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' | head -1 || true)
    if [ "$(printf '%s\n%s\n' "$TAG" "${LIVE:-v0.0.0}" | sort -V | tail -1)" = "${LIVE:-}" ]; then echo "live: $HOST serves $LIVE (your commit is in $TAG)"; exit 0; fi
  fi
  sleep 10
done
# say which half is late: CI numbering it (a run queued or dropped: its commits ride the next one), or Pages serving it
if [ -n "${TAG:-}" ]; then
  echo "release.sh: CI released ${MINE:0:9} as $TAG; $HOST still serves ${LIVE:-nothing readable} after 6 minutes. Your release is done: Pages queues each deploy (5 to 10 minutes when the team is busy) and it goes live with this run or the next; nothing to do unless the deploy-pages run is red"
else
  echo "release.sh: pushed ${MINE:0:9}, but no release contains it after 6 minutes: its deploy-pages run is queued behind another or was dropped (its commit rides the next release)"
fi
exit 1
