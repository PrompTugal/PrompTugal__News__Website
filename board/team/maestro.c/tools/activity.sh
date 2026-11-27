#!/usr/bin/env bash
# Who worked where, from GitHub commits (read-only): ./activity.sh 4h|1d|1w
# Groups commits in the orgs this session can see by the Agent trailer's account prefix.
set -euo pipefail
win="${1:-4h}"
case "$win" in *h) since=$(date -u -d "-${win%h} hour" +%Y-%m-%dT%H:%M:%SZ);; *d) since=$(date -u -d "-${win%d} day" +%Y-%m-%dT%H:%M:%SZ);; *w) since=$(date -u -d "-$(( ${win%w}*7 )) day" +%Y-%m-%dT%H:%M:%SZ);; esac
echo "Commits since $since (window $win)"
for org in SovereignWebsite PrompTugal SGit-AI AgentiCCells; do
  gh api -X GET search/commits -f q="org:$org committer-date:>=$since" -f per_page=100 \
    --jq '.items[] | "\(.repository.full_name)\t\((.commit.message|capture("Agent: (?<a>[^\n]+)").a) // .commit.author.name)"' 2>/dev/null
done | awk -F'\t' '{a=$2; acct="other";
  if (a ~ /^cl-[0-9]+\./) {split(a,p,"."); acct=p[1]}
  else if (a ~ /^(a\.|[a-z.-]+\.a@|maestro\.a)/) acct="cl-1 (A)"
  else if (a ~ /^(b\.|[a-z.-]+\.b@|maestro\.b)/) acct="cl-2 (B)"
  else if (a ~ /^(c\.|[a-z.-]+\.c@|maestro\.c|c\.maestro)/) acct="cl-3 (C)"
  else if (a ~ /^(d\.|[a-z.-]+\.d@|maestro\.d)/) acct="cl-4 (D)"
  else if (a ~ /vicky/) acct="Vicky team"
  else if (a ~ /\[bot\]|GitHub Actions/) acct="bots"
  n[acct]++; r[acct" "$1]++} END {for (k in n) print n[k]"\t"k; print "--- by account and repository"; for (k in r) print r[k]"\t"k}' | sort -rn
