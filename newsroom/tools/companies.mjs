#!/usr/bin/env node
// The newsroom's company data: one folder per company under data/companies/<id>/, from the team's company map.
//
//   node newsroom/tools/companies.mjs --from <the team's data/companies.json> [--recheck] [--only id,id]
//
// Reads only the public fields of each company (lib/companies-map.mjs, PUBLIC) and never the team's own notes
// (why_it_matters, decision, priority, owner, status, assets), which are not facts about the company (CLAUDE.md).
// Writes, per company:
//   company.json   identity (name, website, what, category, country, attending, attending_as), the sources behind each
//                  field, and the names the summit's pages use for it (aliases, used to match speakers' organisations)
//   sources.json   every source: url, read_on, who read it, what it supports, its kind
//   facts.json     one dated claim per source note
//   edges.json     typed links: filed_under its field, based_in its country, appears_in / hosts each summit session in
//                  its sources (by URL; the build resolves the URL to the event)
//   recheck.json   the newsroom's re-check log (appended to, never rewritten)
// A re-run keeps what was added by hand: sources whose id is not sN, facts whose id is not f-sN, edges whose "by" is
// not this tool, aliases marked "hand": true, and every recheck entry. Companies no longer in the map are left alone.
// --recheck re-reads each company's first summit page and its website (one request every 1.5 seconds) and appends the
// result to recheck.json; without it, a "recheck" object carried in the input (the newsroom's data/companies.json of
// 5 November had one) is appended if the log does not hold it yet.
//
// The migration of 5 November 2026 was: node newsroom/tools/companies.mjs --from data/companies.json (that file was then
// removed; its "from" block names the team's map as read on 1 November).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { companyFolder, PUBLIC } from '../build/lib/companies-map.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const BY = 'newsroom/tools/companies.mjs'
const AGENT = 'newsroom@web-summit.dinis'
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null }
const from = arg('--from')
if (!from) { console.error('usage: node newsroom/tools/companies.mjs --from <companies.json> [--recheck] [--only id,id]'); process.exit(2) }
const only = arg('--only') ? new Set(arg('--only').split(',')) : null
const input = JSON.parse(fs.readFileSync(from, 'utf8'))
// the earlier newsroom file names the team's map it came from; the team's own map is the map
const read = input.from
    ? { repository: input.from.repository, path: input.from.path, read_on: input.from.read_on, by: 'curator@web-summit' }
    : { repository: 'SGit-AI/SGit-AI__Website__Web-Summit', path: 'data/companies.json', read_on: input.read_on, by: input.curator || 'curator@web-summit' }

const out = (rel, obj) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n') }
const old = rel => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) } catch { return null } }
const UA = 'web-summit.newsroom.sgit.ai fact re-check (newsroom@web-summit.dinis)'
async function status(url) {
    try { const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) }); return r.status } catch { return 0 }
}
const sleep = ms => new Promise(r => setTimeout(r, ms))

let n = 0
for (const raw of input.companies) {
    if (only && !only.has(raw.id)) continue
    const c = Object.fromEntries(PUBLIC.map(k => [k, raw[k]]))
    const dir = `data/companies/${c.id}`
    const f = companyFolder(c, read, BY)
    const was = { company: old(`${dir}/company.json`), sources: old(`${dir}/sources.json`), facts: old(`${dir}/facts.json`), edges: old(`${dir}/edges.json`), recheck: old(`${dir}/recheck.json`) }
    const handAliases = (was.company?.aliases || []).filter(a => a.hand)
    out(`${dir}/company.json`, { $schema: '../../schemas/company.schema.json', ...f.company, aliases: [...f.company.aliases, ...handAliases] })
    out(`${dir}/sources.json`, { $schema: '../../schemas/company-sources.schema.json', company: c.id, sources: [...f.sources, ...(was.sources?.sources || []).filter(s => !/^s\d+$/.test(s.id))] })
    out(`${dir}/facts.json`, { $schema: '../../schemas/company-facts.schema.json', company: c.id, facts: [...f.facts, ...(was.facts?.facts || []).filter(x => !/^f-s\d+$/.test(x.id))] })
    out(`${dir}/edges.json`, { $schema: '../../schemas/company-edges.schema.json', company: c.id, edges: [...f.edges, ...(was.edges?.edges || []).filter(e => e.by !== BY)] })
    const log = was.recheck?.log || []
    let entry = null
    if (process.argv.includes('--recheck')) {
        const ws = f.sources.find(s => /websummit\.com\/(appearances|attendees|sessions)\/lis26\//.test(s.url))
        entry = { checked_at: new Date().toISOString().slice(0, 16) + 'Z', by: AGENT }
        if (ws) { entry.summit_page = { url: ws.url, status: await status(ws.url) }; await sleep(1500) }
        if (c.website) { entry.website = { url: c.website, status: await status(c.website) }; await sleep(1500) }
    } else if (raw.recheck && !log.some(e => e.checked_at === raw.recheck.checked_at)) {
        entry = { checked_at: raw.recheck.checked_at, by: AGENT, ...(raw.recheck.summit_page ? { summit_page: raw.recheck.summit_page } : {}), ...(raw.recheck.website?.url ? { website: raw.recheck.website } : {}) }
    }
    out(`${dir}/recheck.json`, { $schema: '../../schemas/company-recheck.schema.json', company: c.id, log: entry ? [...log, entry] : log })
    n++
}
const gone = fs.existsSync(path.join(ROOT, 'data/companies')) ? fs.readdirSync(path.join(ROOT, 'data/companies')).filter(d => !input.companies.some(c => c.id === d)) : []
console.log(`${n} companies written to data/companies/` + (gone.length ? `; not in the map, left as they are: ${gone.join(', ')}` : ''))
