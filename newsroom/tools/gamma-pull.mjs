#!/usr/bin/env node
// gamma-pull.mjs: GAMMA-Ray's published Spectrum cards into data/site/gamma-ray.json, for the build (THE RESTART, Dinis
// 10 November: "the data comes from GAMMA-Ray as JSON; pt.news shows it, and links to gamma-ray.sgit.ai for the source";
// scores published under his "Go and confirmed" of 05:45: beta and provisional, with the evidence behind each).
// Reads, never writes elsewhere: the Spectrum index (the computed levels A R C O, the stage and its n of 16, as
// gamma-ray.sgit.ai renders them) and each card's scan JSON (its company, what it is, the date read, the review). It
// keeps no vault key and no evidence text: the card on gamma-ray.sgit.ai is the source a reader follows.
//   node newsroom/tools/gamma-pull.mjs            write data/site/gamma-ray.json
//   node newsroom/tools/gamma-pull.mjs --check    say what would change, write nothing
import fs from 'node:fs'
import path from 'node:path'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..'), OUT = path.join(ROOT, 'data/site/gamma-ray.json')
const BASE = 'https://gamma-ray.sgit.ai/'
const get = async (u, json) => { const r = await fetch(u, { headers: { 'user-agent': 'promptugal-news-build' } }); if (!r.ok) throw new Error(`${u}: ${r.status}`); return json ? r.json() : r.text() }

const index = await get(BASE + 'spectrum/index.md')
const version = (index.match(/GAMMA-Ray v([0-9.]+)/) || [])[1] || ''
const rows = [...index.matchAll(/^\| \[([^\]]+)\]\(\.\.\/spectrum\/cards\/([a-z0-9-]+)\/index\.md\) \| ([^|]+)\| ([^|]+)\| ([^|]*)\| ([^|]*)\| ([^|]*)\|/gm)]
const LV = s => { const o = {}; for (const m of s.matchAll(/([ARCO])([0-9–-])/g)) o[m[1]] = /\d/.test(m[2]) ? +m[2] : 0; return o }
const cards = []
for (const [, name, id, lv, stage, modes, lit, next] of rows) {
    let scan = {}
    try { scan = await get(`${BASE}data/scans/${id}.json`, true) } catch (e) { console.error(`gamma-pull: ${id}: no scan JSON (${e.message}); kept from the index only`) }
    const st = stage.trim().match(/^(\w+) \((\d+)\)/)
    cards.push({ id, name: name.trim(), company: scan.company || null, ours: !!scan.ours, what: String(scan.what || '').slice(0, 300),
        levels: LV(lv), stage: st ? st[1] : stage.trim(), n: st ? +st[2] : null, of: 16, modes: modes.trim(), lit: lit.trim(), next: next.trim(),
        read: scan.read || null, review: scan.review?.status || null, vendor_reviewed: !!scan.seen_by_operator, card: `${BASE}spectrum/cards/${id}/` })
}
if (!cards.length) { console.error('gamma-pull: no cards read; data/site/gamma-ray.json left as it was'); process.exit(1) }
const data = { about: 'GAMMA-Ray Spectrum cards as gamma-ray.sgit.ai publishes them (beta; every rating experimental), read by newsroom/tools/gamma-pull.mjs. Levels: A autonomy, R reach, C control, O openness, 1 to 4, 0 where not yet evidenced. The source of every card is its page on gamma-ray.sgit.ai.',
    source: BASE + 'spectrum/', version, read_at: new Date().toISOString().slice(0, 16) + 'Z', cards }
const before = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
const after = JSON.stringify(data, null, 1) + '\n'
const same = before && JSON.stringify({ ...JSON.parse(before), read_at: '' }) === JSON.stringify({ ...data, read_at: '' })
if (process.argv.includes('--check')) { console.log(same ? 'gamma-pull: no change' : `gamma-pull: ${cards.length} cards, would change`); process.exit(0) }
if (same) { console.log(`gamma-pull: ${cards.length} cards, no change`); process.exit(0) }
fs.writeFileSync(OUT, after); console.log(`gamma-pull: ${cards.length} cards written (GAMMA-Ray v${version})`)
