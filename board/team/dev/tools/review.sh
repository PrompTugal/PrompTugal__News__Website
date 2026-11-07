#!/bin/bash
# squash-merge each work/dev.* branch's new work onto HEAD; keep it if the gate passes
S=$(dirname "$0"); cd "$(git -C "$S" rev-parse --show-toplevel)"; OUT=${OUT:-/tmp/dev-review.txt}; git fetch -q origin; : > $OUT
for b in ${BRANCHES:-$(git branch -r | grep "origin/work/dev\." | sed "s#.*origin/work/##")}; do
git merge --squash -q origin/work/$b >/dev/null 2>&1
for f in $(git diff --name-only --diff-filter=U); do case "$f" in board/keys.json) python3 -I $S/keys-union.py >/dev/null;; board/team/$b/*|board/runs/$b/*) git checkout --theirs -- "$f";; data/schemas/*) if git log --no-merges --format= --name-only origin/dev..origin/work/$b -- "$f" | grep -q .; then git checkout --theirs -- "$f"; else git checkout --ours -- "$f"; fi;; *) [ -z "$(git log --format=%s HEAD -- "$f" | grep -v "work/$b")" ] && git checkout --theirs -- "$f";; esac; git add "$f" 2>/dev/null; done
if [ -n "$(git diff --name-only --diff-filter=U)" ]; then echo "$b HELD: conflicts $(git diff --name-only --diff-filter=U|tr '\n' ' ')" >> $OUT; git reset -q --hard HEAD; continue; fi
# a dev worker never brings a desk's files (desks/ is the desks' own): dev.data's branch carried 112 stale outreach drafts in its own commits, and they came in once (7 Nov 00:40)
own=$(git log --no-merges --format= --name-only origin/dev..origin/work/$b | grep -v '^desks/' | sort -u)
for f in $(git diff --cached --name-only); do echo "$own" | grep -qxF "$f" || { git restore --staged --worktree --source=HEAD -- "$f" 2>/dev/null || { git rm -q --cached -- "$f"; rm -f -- "$f"; }; echo "$b: not its own, left out: $f" >> $OUT; }; done
files=$(git diff --cached --name-only | tr '\n' ' ')
[ -z "$files" ] && { echo "$b: nothing new" >> $OUT; continue; }
r=$(node newsroom/build/validate.js 2>&1 | grep -v "^WARN" | tail -3 | tr '\n' ' ')
case "$r" in *OK*) git commit -q -F - <<MSG
dev@PrompTugal.dinis: review: bring work/$b's new work onto dev (one commit)

From work/$b at $(git log --format=%h -1 origin/work/$b), by $b@PrompTugal.dinis; reviewed at dev@'s wake (the diff, the gate on the result).
Files: $files

Agent: dev@PrompTugal.dinis
Issue: WS-177
For: conductor@PrompTugal.dinis
To: $b@PrompTugal.dinis

MSG
echo "$b TAKEN: $files" >> $OUT;;
*) echo "$b HELD: gate: $r | $files" >> $OUT; git reset -q --hard HEAD;; esac
done; cat $OUT
