#!/usr/bin/env node
// Derives the entity files the desks' output implies (admin/build/lib/derive.mjs says which), and writes them.
//   node admin/tools/derive.mjs            write data/events, data/people, data/organisations, data/evidence,
//                                          data/stories and data/matching.json; delete derived files no longer derived
//   node admin/tools/derive.mjs --check    write nothing; exit 1 if a committed derived file is missing, stale or extra
// Run it after a desk's file changes (desks/programme/agenda.json, desks/curator/*.json) or after hand-edited data
// that the derivation reads changes (data/companies, data/places, data/topics, data/curation). The gate runs --check.
// Never hand-edit a file that carries "derived": edit the desk's file or data/curation/ and run this again.
import fs from 'node:fs'
import path from 'node:path'
import { R } from '../build/lib/config.mjs'
import { derive } from '../build/lib/derive.mjs'
import { derivationInputs, derivedOnDisk } from '../build/lib/data.mjs'

const check = process.argv.includes('--check')
const { files } = derive(derivationInputs())
const body = obj => JSON.stringify(obj, null, 2) + '\n'
const problems = []
let wrote = 0, removed = 0
for (const [rel, obj] of Object.entries(files)) {
    const p = R(rel), want = body(obj)
    const have = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null
    if (have === want) continue
    if (have !== null && !JSON.parse(have).derived) { problems.push(`${rel}: a hand-written file is where a derived one would go (left alone)`); continue }
    if (check) { problems.push(`${rel}: ${have === null ? 'missing' : 'stale'}`); continue }
    fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, want); wrote++
}
for (const rel of derivedOnDisk()) if (!(rel in files)) {
    if (check) { problems.push(`${rel}: derived from something that is no longer there`); continue }
    fs.unlinkSync(R(rel)); removed++
    const dir = path.dirname(R(rel)); if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
}
if (check) {
    if (problems.length) { for (const p of problems) console.error(p); console.error(`${problems.length} derived file(s) out of date: run node admin/tools/derive.mjs`); process.exit(1) }
    console.log(`derived files up to date (${Object.keys(files).length})`)
} else {
    for (const p of problems) console.error(p)
    console.log(`derived ${Object.keys(files).length} files: ${wrote} written, ${removed} removed`)
}
