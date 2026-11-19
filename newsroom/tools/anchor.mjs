#!/usr/bin/env node
// anchor.mjs: the anchor A for the signature check (security@'s sixth ruling, 19 Nov 2026, 0ba439611): the head_sha of
// the latest run of this workflow (its path), on dev, by a push, that concluded success. Only GitHub Actions creates runs;
// a "successful deployment" anyone with write access can fake. Read from GitHub's API, never from git. Prints the sha,
// or fails (no anchor, no answer) with nothing printed on stdout, so the caller fails closed.
//   GITHUB_TOKEN=<the run's own token> GITHUB_REPOSITORY=owner/repo node newsroom/tools/anchor.mjs [workflow-file]
// The caller then requires A to be an ancestor of AFTER (check-signatures-trusted.mjs does). dev@PrompTugal.dinis.
const repo = process.env.GITHUB_REPOSITORY || 'PrompTugal/PrompTugal__News__Website'
const wf = process.argv[2] || 'deploy-pages.yml', path_ = `.github/workflows/${wf}`
const headers = { 'User-Agent': 'promptugal-news-signature-check', Accept: 'application/vnd.github+json' }   // GitHub answers 403 without a User-Agent (cyber.b@)
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
const url = `https://api.github.com/repos/${repo}/actions/workflows/${encodeURIComponent(wf)}/runs?branch=dev&event=push&status=success&per_page=20`
try {
    const r = await fetch(url, { headers, redirect: 'error' })
    if (!r.ok) throw new Error(`the API answered ${r.status}`)
    const j = await r.json()
    const run = (j.workflow_runs || []).find(x => x.path === path_ && x.head_branch === 'dev' && x.event === 'push' && x.conclusion === 'success' && /^[0-9a-f]{40}$/.test(x.head_sha || ''))
    if (!run) throw new Error('no successful push run of this workflow on dev')
    process.stdout.write(run.head_sha + '\n')
} catch (e) { process.stderr.write(`anchor: ${e.message}\n`); process.exit(1) }
