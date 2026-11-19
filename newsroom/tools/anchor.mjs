#!/usr/bin/env node
// anchor.mjs: the anchor A for the signature check (security@'s sixth ruling, 19 Nov 2026, 0ba439611): the head_sha of
// the latest run of this workflow (its path), on dev, by a push, that concluded success. Only GitHub Actions creates runs;
// a "successful deployment" anyone with write access can fake. Read from GitHub's API, never from git. Prints the sha,
// or fails (no anchor, no answer) with nothing printed on stdout, so the caller fails closed.
//   GITHUB_TOKEN=<the run's own token> GITHUB_REPOSITORY=owner/repo node newsroom/tools/anchor.mjs [workflow-file]
// A run counts only if the security job, by its name (ANCHOR_JOB, default "signatures"), ran in it and concluded
// success: a pushed workflow that drops the job still "succeeds", so the run's conclusion alone is not enough (live.b@'s
// review a4c6fce, HIGH 2). A workflow that keeps the name but weakens the job is closed only by branch protection.
// The caller then requires A to be an ancestor of AFTER (check-signatures-trusted.mjs does). dev@PrompTugal.dinis.
const repo = process.env.GITHUB_REPOSITORY || 'PrompTugal/PrompTugal__News__Website'
const wf = process.argv[2] || 'deploy-pages.yml', path_ = `.github/workflows/${wf}`
const JOB = process.env.ANCHOR_JOB || 'signatures'
const headers = { 'User-Agent': 'promptugal-news-signature-check', Accept: 'application/vnd.github+json' }   // GitHub answers 403 without a User-Agent (cyber.b@)
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
const url = `https://api.github.com/repos/${repo}/actions/workflows/${encodeURIComponent(wf)}/runs?branch=dev&event=push&status=success&per_page=20`
try {
    const r = await fetch(url, { headers, redirect: 'error' })
    if (!r.ok) throw new Error(`the API answered ${r.status}`)
    const j = await r.json()
    const runs = (j.workflow_runs || []).filter(x => x.path === path_ && x.head_branch === 'dev' && x.event === 'push' && x.conclusion === 'success' && Number.isInteger(x.id) && /^[0-9a-f]{40}$/.test(x.head_sha || ''))
    for (const run of runs) {                     // newest first, as the API lists them
        const jr = await fetch(`https://api.github.com/repos/${repo}/actions/runs/${run.id}/jobs?filter=latest&per_page=100`, { headers, redirect: 'error' })
        if (!jr.ok) throw new Error(`the jobs API answered ${jr.status}`)
        const jobs = ((await jr.json()).jobs || []).filter(x => x.name === JOB)
        if (jobs.length === 1 && jobs[0].status === 'completed' && jobs[0].conclusion === 'success' && jobs[0].head_sha === run.head_sha) {
            process.stdout.write(run.head_sha + '\n'); process.exit(0)
        }
    }
    throw new Error(`no successful push run on dev in which the job "${JOB}" passed`)
} catch (e) { process.stderr.write(`anchor: ${e.message}\n`); process.exit(1) }
