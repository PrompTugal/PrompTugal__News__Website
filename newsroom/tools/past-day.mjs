#!/usr/bin/env node
// A past day as the site was (board/spec-the-summit-days.md, S2): rebuild the site from a release's tag, with the clock frozen at
// 23:00 UTC that day, and write it under <out>/days/<date>/as-was/ with a banner on every page saying it is the past.
//   node newsroom/tools/past-day.mjs <date> <tag> <out> [--build admin/build/build.mjs]
// The tag is the last release of that day (newsroom/versions.json: the last row of the date). Needs the tag's history
// (git fetch --depth=1 origin tag <tag>). The build is run in a temporary worktree outside this repository, never in it.
// Not wired into CI yet: S3 (today's corrections and removals applied before it is served, security@'s condition) comes first.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [date, tag, out] = process.argv.slice(2)
const build = (process.argv.find(a => a.startsWith('--build=')) || '').slice(8)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !tag || !out) { console.error('usage: past-day.mjs <date> <tag> <out> [--build=<path to the tag\'s build.mjs>]'); process.exit(1) }

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'past-day-'))
const wt = path.join(tmp, 'site')
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'], ...opts })
try {
    run('git', ['-C', repo, 'worktree', 'add', '--detach', wt, tag])
    const entry = build || ['newsroom/build/build.mjs', 'admin/build/build.mjs'].find(f => fs.existsSync(path.join(wt, f)))
    // the clock frozen at 23:00 UTC on the day: the build reads new Date() for its "today"
    const freeze = `const R=Date,T=new R('${date}T23:00:00Z').getTime();globalThis.Date=class extends R{constructor(...a){a.length?super(...a):super(T)} static now(){return T}};await import(${JSON.stringify(path.join(wt, entry))})`
    run('node', ['--input-type=module', '-e', freeze], { cwd: wt })
    const dest = path.join(out, 'days', date, 'as-was')
    fs.rmSync(dest, { recursive: true, force: true })
    const skip = new Set(['.git', 'node_modules', 'api', 'board', 'desks', 'data', 'content', 'design', 'admin', 'newsroom'])
    const banner = `<div style="position:sticky;top:0;z-index:99;background:#111;color:#fff;padding:10px 16px;font:600 14px/1.4 system-ui,sans-serif">The past: ${date}. This is PrompTugal.news as it was at the end of that day (release ${tag}). <a style="color:#fff" href="/">Back to today</a></div>`
    const copy = (from, to) => {
        fs.mkdirSync(to, { recursive: true })
        for (const e of fs.readdirSync(from, { withFileTypes: true })) {
            if (from === wt && skip.has(e.name)) continue
            const a = path.join(from, e.name), b = path.join(to, e.name)
            if (e.isDirectory()) copy(a, b)
            else if (from === wt && (/\.md$/.test(e.name) || ['CNAME', 'LICENSE'].includes(e.name))) continue   // the repository's own documents are not the site
            else if (e.name.endsWith('.html')) fs.writeFileSync(b, fs.readFileSync(a, 'utf8').replace(/<body([^>]*)>/, `<body$1>${banner}`).replace('</head>', '<meta name="robots" content="noindex"></head>'))
            else fs.copyFileSync(a, b)
        }
    }
    copy(wt, dest)
    console.log(`wrote ${dest}`)
} finally {
    try { run('git', ['-C', repo, 'worktree', 'remove', '--force', wt]) } catch {}
    fs.rmSync(tmp, { recursive: true, force: true })
}
