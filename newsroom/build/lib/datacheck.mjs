// The data's own checks, run by the gate (newsroom/build/validate.js): every JSON file under data/ follows the schema of
// its kind (data/schemas/), every reference between entities resolves, and the derived files are what the
// derivation makes now (newsroom/tools/derive.mjs --check, in memory).
import fs from 'node:fs'
import path from 'node:path'
import { R, walk } from './config.mjs'
import { loadSchemas, validate } from './schema.mjs'
import { derive } from './derive.mjs'
import { derivationInputs, derivedOnDisk, loadData } from './data.mjs'

// which schema a data file follows, by its path
export const KINDS = [
    [/^data\/companies\/[^/]+\/company\.json$/, 'company'],
    [/^data\/companies\/[^/]+\/sources\.json$/, 'company-sources'],
    [/^data\/companies\/[^/]+\/facts\.json$/, 'company-facts'],
    [/^data\/companies\/[^/]+\/edges\.json$/, 'company-edges'],
    [/^data\/companies\/[^/]+\/recheck\.json$/, 'company-recheck'],
    [/^data\/companies\/[^/]+\/flows\.json$/, 'company-flows'],     // its schema is the ontologist's (data/schemas/)
    [/^data\/events\/[^/]+\/event\.json$/, 'event'],
    [/^data\/people\/[^/]+\/person\.json$/, 'person'],
    [/^data\/organisations\/[^/]+\/organisation\.json$/, 'organisation'],
    [/^data\/places\/[^/]+\/place\.json$/, 'place'],
    [/^data\/topics\/[^/]+\/topic\.json$/, 'topic'],
    [/^data\/stories\/[^/]+\/story\.json$/, 'story'],
    [/^data\/evidence\/[^/]+\/capture\.json$/, 'evidence'],
    [/^data\/matching\.json$/, 'matching'],
    [/^data\/ontology\.json$/, 'ontology'],
    [/^data\/site\/site\.json$/, 'site'],
    [/^data\/site\/nav\.json$/, 'nav'],
    [/^data\/newsroom\/agents\.json$/, 'newsroom-agents'],        // the newsroom section's roster, plan and team-site snapshot
    [/^data\/newsroom\/plan\.json$/, 'newsroom-plan'],            // (its runs ledger is data/newsroom/runs/*.jsonl, checked by
    [/^data\/newsroom\/team-site\.json$/, 'newsroom-team-site'],  // features/newsroom.mjs against newsroom-run.schema.json)
    [/^data\/newsroom\/observability\/vaults\.json$/, 'newsroom-observability-vaults'],   // the observability report's sources
    [/^data\/curation\/organisations\.json$/, 'curation-organisations'],
    [/^data\/curation\/events\.json$/, 'curation-events'],
    [/^data\/curation\/speakers\.json$/, 'curation-speakers'],
    [/^data\/billing\/prices\.json$/, 'billing-prices'],
    [/^data\/billing\/topup\.json$/, 'billing-topup'],
    [/^data\/billing\/vault\.json$/, 'billing-vault'],
]

export function checkData() {
    const errors = []
    const reg = loadSchemas(R('data/schemas'))
    const rel = p => path.relative(R(''), p).split(path.sep).join('/')
    // 1. schemas
    for (const f of walk(R('data'), p => p.endsWith('.json'))) {
        const r = rel(f)
        if (r.startsWith('data/schemas/')) { try { JSON.parse(fs.readFileSync(f, 'utf8')) } catch { errors.push(`${r}: not JSON`) } continue }
        const kind = (KINDS.find(([re]) => re.test(r)) || [])[1]
        if (!kind) { errors.push(`${r}: no schema for this kind of file (add one to data/schemas/ and to KINDS in newsroom/build/lib/datacheck.mjs)`); continue }
        let v
        try { v = JSON.parse(fs.readFileSync(f, 'utf8')) } catch { errors.push(`${r}: not JSON`); continue }
        for (const e of validate(v, `${kind}.schema.json`, reg)) errors.push(`${r}: ${e} (${kind}.schema.json)`)
        // the folder is the id
        const m = r.match(/^data\/[^/]+\/([^/]+)\/[^/]+\.json$/)
        if (m && v.id && v.id !== m[1] && !r.startsWith('data/site/')) errors.push(`${r}: id "${v.id}" is not its folder's name`)
        if (m && v.company && v.company !== m[1]) errors.push(`${r}: company "${v.company}" is not its folder's name`)
    }
    if (errors.length) return errors
    // 2. references
    const s = loadData()
    const need = (where, ref) => { if (ref && !s.has(ref)) errors.push(`${where}: ${ref} does not exist`) }
    for (const c of s.companies) {
        const ids = new Set(c.sources.map(x => x.id))
        for (const [field, list] of Object.entries(c.field_sources)) for (const id of list) if (!ids.has(id)) errors.push(`data/companies/${c.id}: field ${field} cites ${id}, which is not in sources.json`)
        for (const a of c.aliases) if (a.source && !ids.has(a.source)) errors.push(`data/companies/${c.id}: alias "${a.name}" cites ${a.source}, which is not in sources.json`)
        for (const fl of c.flows) for (const st of [fl, ...(fl.steps || [])]) for (const id of [st.source].flat().filter(Boolean)) if (!ids.has(id)) errors.push(`data/companies/${c.id}/flows.json: flow "${fl.id}" cites ${id}, which is not in sources.json`)
        for (const f of c.facts) if (!ids.has(f.source)) errors.push(`data/companies/${c.id}/facts.json: ${f.id} cites ${f.source}, which is not in sources.json`)
        for (const e of c.edges) {
            if (!ids.has(e.source)) errors.push(`data/companies/${c.id}/edges.json: ${e.verb} cites ${e.source}, which is not in sources.json`)
            if (!e.to === !e.to_url) errors.push(`data/companies/${c.id}/edges.json: a ${e.verb} edge needs exactly one of to or to_url`)
            need(`data/companies/${c.id}/edges.json`, e.to)
        }
    }
    for (const e of s.events) {
        const w = `data/events/${e.id}`
        need(w, e.place); need(w, e.part_of); need(w, e.organised_by)
        for (const sp of e.speakers) { need(w, sp.person); need(w, sp.org) }
        for (const h of e.hosted_by || []) need(w, h.org)
    }
    for (const p of s.people) { need(`data/people/${p.id}`, p.org); for (const l of p.listings) { need(`data/people/${p.id}`, l.org); need(`data/people/${p.id}`, l.event) } }
    for (const p of s.places) need(`data/places/${p.id}`, p.located_in)
    for (const t of s.topics) for (const b of t.broader) need(`data/topics/${t.id}`, b)
    for (const x of s.stories) { need(`data/stories/${x.id}`, x.topic); for (const r of x.rests_on) need(`data/stories/${x.id}`, r) }
    for (const x of s.evidence) for (const n of x.names) need(`data/evidence/${x.id}`, n.ref)
    // no social handle in what we publish about a person (the derivation drops them; this catches a hand edit)
    const HANDLE = /(^|[\s(,;])@[A-Za-z0-9_]{2,}/
    for (const p of s.people) for (const v of [p.role, p.organisation, ...p.listings.flatMap(l => [l.role, l.organisation])]) if (v && HANDLE.test(v)) errors.push(`data/people/${p.id}: a social handle in "${v}"`)
    for (const e of s.events) for (const sp of e.speakers) if (HANDLE.test(sp.as_listed) || HANDLE.test(sp.role || '')) errors.push(`data/events/${e.id}: a social handle in a speaker listing`)
    // a place's located_in never loops
    for (const p of s.places) { let at = p, n = 0; while (at && at.located_in && n++ < 20) at = s.get(at.located_in); if (n >= 20) errors.push(`data/places/${p.id}: located_in loops`) }
    // 3. derived files are fresh
    const { files } = derive(derivationInputs())
    const body = o => JSON.stringify(o, null, 2) + '\n'
    for (const [r, obj] of Object.entries(files)) {
        if (!fs.existsSync(R(r))) { errors.push(`${r}: missing; run node newsroom/tools/derive.mjs`); continue }
        const have = fs.readFileSync(R(r), 'utf8')
        if (have !== body(obj) && JSON.parse(have).derived) errors.push(`${r}: stale (a desk's file or hand-edited data changed); run node newsroom/tools/derive.mjs`)
    }
    for (const r of derivedOnDisk()) if (!(r in files)) errors.push(`${r}: derived from something that is no longer there; run node newsroom/tools/derive.mjs`)
    return errors
}
