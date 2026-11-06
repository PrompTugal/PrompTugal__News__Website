#!/usr/bin/env node
/* search.test.mjs: the search index and its ranking, in Node, against the files the build wrote.
 *
 *   node newsroom/build/build.mjs && node newsroom/tests/search.test.mjs
 *
 * What is in the index, the owner's kinds of query (a company by name, a word being typed, a Portuguese name without
 * its accent, a synonym, a plural, a stage, filters), and the bytes: the size of the index, and what a typical query
 * loads (docs.json once, then a shard or two). After newsroom.sgit.ai's admin/build/test_search.mjs.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { createRequire } from 'node:module'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const require = createRequire(import.meta.url)
const S = require(path.join(ROOT, 'assets/search/search-core.js'))
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }

const DIR = path.join(ROOT, 'api/v1/search')
if (!fs.existsSync(path.join(DIR, 'docs.json'))) { console.log('FAIL api/v1/search/docs.json is missing: run node newsroom/build/build.mjs first'); process.exit(1) }
const loads = []
const fetchJSON = async rel => {
    const f = path.join(ROOT, rel)
    const buf = fs.readFileSync(f)
    loads.push({ rel, bytes: buf.length, gz: zlib.gzipSync(buf).length })
    return JSON.parse(buf)
}
const engine = S.createEngine(fetchJSON)
const docs = JSON.parse(fs.readFileSync(path.join(DIR, 'docs.json')))
const version = fs.readFileSync(path.join(ROOT, 'newsroom/build/version.txt'), 'utf8').trim()

// ---------------------------------------------------------------- what is in it
check(docs.version === version, `the index is of this release (${docs.version})`)
const types = docs.types
check(types.company > 100 && types.event > 200 && types.person > 200 && types.topic >= 17 && types.place > 50 && types.article >= 1, `every kind is in it: ${JSON.stringify(types)}`)
check(docs.docs.every(d => d[4] && fs.existsSync(path.join(ROOT, d[4]))) && !docs.docs.some(d => d[4].startsWith('search/')), 'every row points at a page that exists, and the search page is not in it')
check(docs.shards.every(k => fs.existsSync(path.join(DIR, 'terms', k + '.json'))), `every shard listed is written (${docs.shards.length})`)
const ev = docs.docs.find(d => d[1] === 'event' && d[6].s)
check(!!ev && /^\d\d:\d\d$/.test(ev[6].s) && /^2026-11-\d\d$/.test(ev[5].d[0]), 'events carry their day and start time for the agenda')
check(S.fold('Conceição São Søren Wöhle') === 'conceicao sao soren wohle', 'folding: accents and Nordic letters')
check(S.stem('agents') === S.stem('agent') && S.stem('stories') === S.stem('story') && S.stem('companies') === S.stem('company'), 'stemming: agents agent, stories story, companies company')

// ---------------------------------------------------------------- ranking
const top = async (q, o) => (await engine.query(q, o || {})).results
const first = async (q, ref, n = 1, o) => (await top(q, o)).slice(0, n).some(r => r.doc.id === ref)
check(await first('Replit', 'company:replit'), 'Replit: the company first')
check(await first('rep', 'company:replit', 5), 'rep (being typed): Replit in the first five')
check(await first('1password', 'company:1password'), '1password: the company first')
check(await first('Centre Stage', 'place:centre-stage', 3), 'Centre Stage: the stage in the first three')
check(await first('joao nuno ferreira', 'person:joao-nuno-ferreira'), 'joao nuno ferreira (no accent): João Nuno Ferreira first')
check(await first('soren', 'person:sren-bramer-schmidt', 3), 'soren: Søren Bramer Schmidt in the first three')
check(await first('security', 'topic:security', 2), 'security: the Security topic in the first two')
const cyber = await top('cyber', { type: 'company', limit: 50 })
check(cyber.length >= 10 && cyber.every(r => r.doc.type === 'company'), `cyber (a synonym of security), companies only: ${cyber.length}`)
check(await first('Cisco Systems', 'company:cisco-outshift', 2), 'Cisco Systems (the name on speaker cards): Cisco (Outshift) in the first two')
const sec = await engine.query('security', { type: 'company', country: 'Portugal' })
check(sec.results.every(r => r.doc.type === 'company' && r.doc.facets.c === 'Portugal'), `filters: security companies in Portugal (${sec.total})`)
const tue = await engine.query('centre stage', { type: 'event', day: '2026-11-10', limit: 100 })
check(tue.total > 5 && tue.results.every(r => (r.doc.facets.d || []).includes('2026-11-10')), `filters: Centre Stage sessions on Tuesday 10 November (${tue.total})`)
check((await engine.query('agents')).facets.type.company > 0, 'facet counts come back with the results')
check((await top('')).length === 0 && (await top('   ')).length === 0, 'an empty query finds nothing')
check((await top('zzqxv')).length === 0, 'nonsense finds nothing')
const mk = S.mark('Plug-and-play on-chain privacy', ['privac'])
check(mk.some(([t, hit]) => hit && t === 'privacy'), 'the snippet marks a word the query begins')

// ---------------------------------------------------------------- bytes
const sizes = docs.shards.map(k => fs.statSync(path.join(DIR, 'terms', k + '.json')).size)
const docsBytes = fs.statSync(path.join(DIR, 'docs.json')).size
const docsGz = zlib.gzipSync(fs.readFileSync(path.join(DIR, 'docs.json'))).length
const total = sizes.reduce((a, b) => a + b, 0)
console.log(`\nindex: docs.json ${(docsBytes / 1024).toFixed(1)} KB (${(docsGz / 1024).toFixed(1)} KB gzipped), ${docs.docs.length} rows; ${sizes.length} shards, ${(total / 1024).toFixed(1)} KB in all, largest ${(Math.max(...sizes) / 1024).toFixed(1)} KB, median ${(sizes.sort((a, b) => a - b)[sizes.length >> 1] / 1024).toFixed(1)} KB`)
const per = []
for (const q of ['replit', 'security', 'what is on centre stage', 'joão', 'agents identity', 'portugal startup']) {
    const fresh = S.createEngine(async rel => { const buf = fs.readFileSync(path.join(ROOT, rel)); per.push({ q, rel, bytes: buf.length, gz: zlib.gzipSync(buf).length }); return JSON.parse(buf) })
    await fresh.query(q)
}
const byQ = {}
for (const x of per) { byQ[x.q] = byQ[x.q] || { files: 0, bytes: 0, gz: 0, shardBytes: 0 }; byQ[x.q].files++; byQ[x.q].bytes += x.bytes; byQ[x.q].gz += x.gz; if (/terms/.test(x.rel)) byQ[x.q].shardBytes += x.bytes }
for (const [q, v] of Object.entries(byQ)) console.log(`query "${q}": ${v.files} files, ${(v.bytes / 1024).toFixed(1)} KB (${(v.gz / 1024).toFixed(1)} KB gzipped); after the first query, ${(v.shardBytes / 1024).toFixed(1)} KB of shards`)
check(Object.values(byQ).every(v => v.shardBytes < 40 * 1024), 'no typical query needs more than 40 KB of shards')
check(docsGz < 80 * 1024, `docs.json is under 80 KB gzipped (${(docsGz / 1024).toFixed(1)} KB)`)

console.log(failed ? `\n${failed} FAILED` : '\nALL SEARCH CHECKS PASS')
process.exit(failed ? 1 : 0)
