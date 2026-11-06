#!/usr/bin/env node
// The ratchet's baseline (newsroom/build/quality-baseline.json): how much prose and markup each code file may hold.
// It only goes down: run it after you move words out of code, and every file's line drops to what it holds now.
//
//   node newsroom/tools/quality-baseline.mjs                 lower every line to the file's current measure (a file
//                                                            not in the baseline is never added: new files stay under
//                                                            the gate's limit for new files)
//   node newsroom/tools/quality-baseline.mjs --init          write the first baseline (refuses if one exists)
//   node newsroom/tools/quality-baseline.mjs --accept <file> --why "<reason>"
//                                                            raise one file's line, with the reason kept in the file
//
// The gate (features/quality.mjs) refuses a file above its line; raising one is a decision made in the open, with a
// reason a reviewer can read in the commit.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { measure } from '../build/lib/codedata.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const FILE = path.join(ROOT, 'newsroom/build/quality-baseline.json')
const args = process.argv.slice(2), opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] || true) : null }
const version = fs.readFileSync(path.join(ROOT, 'newsroom/build/version.txt'), 'utf8').trim()
const now = new Date().toISOString().slice(0, 16) + 'Z'
const rows = measure(ROOT)
const exists = fs.existsSync(FILE)
const base = exists ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : null

if (opt('init')) { if (exists) { console.error('a baseline exists: run without --init to lower it'); process.exit(1) } }
else if (!exists) { console.error('no baseline yet: --init'); process.exit(1) }

const files = {}
let lowered = 0, raised = null
for (const r of rows) {
    if (!r.prose && !r.tags) continue
    const old = base && base.files[r.file]
    if (opt('init')) { files[r.file] = { prose: r.prose, tags: r.tags }; continue }
    if (!old) continue   // a file not in the baseline stays under the gate's limit for new files; it is never adopted here
    const next = { prose: Math.min(old.prose, r.prose), tags: Math.min(old.tags, r.tags) }
    if (opt('accept') === r.file) {
        if (typeof opt('why') !== 'string') { console.error('--accept needs --why "<reason>"'); process.exit(1) }
        next.prose = r.prose; next.tags = r.tags; next.raised = { at: now, why: opt('why') }; raised = r.file
    } else if (old.raised) next.raised = old.raised
    if (next.prose < old.prose || next.tags < old.tags) lowered++
    files[r.file] = next
}
const out = {
    about: 'The ratchet of newsroom/build/features/quality.mjs: the most prose (bytes of string literals of eight words or more) and HTML tags each code file may hold. Made and lowered by newsroom/tools/quality-baseline.mjs; it only goes down, except a line raised with --accept and its reason. The aim is zero: words in content/ (markdown), data in data/ (JSON), code in newsroom/build/, newsroom/tools/ and assets/.',
    measured_at: now, version, files,
}
fs.writeFileSync(FILE, JSON.stringify(out, null, 2) + '\n')
const P = Object.values(files).reduce((s, f) => s + f.prose, 0)
console.log(`${path.relative(ROOT, FILE)}: ${Object.keys(files).length} files, ${P} bytes of prose in all; ${opt('init') ? 'first baseline' : `${lowered} lines lowered`}${raised ? `; ${raised} raised` : ''}`)
