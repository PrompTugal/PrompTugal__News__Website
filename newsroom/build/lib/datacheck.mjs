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
    [/^data\/companies\/[^/]+\/flows\.json$/, 'company-flows'],
    [/^data\/companies\/[^/]+\/products\.json$/, 'company-products'],   // THE RESTART: a company's named products (the ontologist's)     // its schema is the ontologist's (data/schemas/)
    [/^data\/events\/[^/]+\/event\.json$/, 'event'],
    [/^data\/people\/[^/]+\/person\.json$/, 'person'],
    [/^data\/organisations\/[^/]+\/organisation\.json$/, 'organisation'],
    [/^data\/organisations\/[^/]+\/network\.json$/, 'organisation-network'],
    [/^data\/places\/[^/]+\/place\.json$/, 'place'],
    [/^data\/topics\/[^/]+\/topic\.json$/, 'topic'],
    [/^data\/stories\/[^/]+\/story\.json$/, 'story'],
    [/^data\/evidence\/[^/]+\/capture\.json$/, 'evidence'],
    // a story project's data folder (board/the-story-projects.md; schemas by the ontologist), beside the derived story.json
    [/^data\/stories\/[^/]+\/sources\/[^/]+\.json$/, 'story-source'],
    [/^data\/stories\/[^/]+\/entities\.json$/, 'story-entities'],
    [/^data\/stories\/[^/]+\/claims\.json$/, 'story-claims'],
    [/^data\/stories\/[^/]+\/graph\.json$/, 'story-graph'],
    [/^data\/stories\/[^/]+\/timeline\.json$/, 'story-timeline'],
    [/^data\/stories\/[^/]+\/blocks\.json$/, 'story-blocks'],
    // Wikipedia, read as data (newsroom/tools/wikipedia.mjs; schemas by the ontologist; board/projects/wikipedia.md)
    [/^data\/wikipedia\/[^/]+\/article\.json$/, 'wikipedia-article'],
    [/^data\/wikipedia\/[^/]+\/statements\.json$/, 'wikipedia-statements'],
    [/^data\/wikipedia\/[^/]+\/references\.json$/, 'wikipedia-references'],
    [/^data\/wikipedia\/[^/]+\/tables\.json$/, 'wikipedia-tables'],
    [/^data\/wikipedia\/[^/]+\/links\.json$/, 'wikipedia-links'],
    [/^data\/wikipedia\/[^/]+\/meets\.json$/, 'wikipedia-meets'],
    [/^data\/translations\/(events|articles|companies)\/[^/]+\/[a-z]{2,3}-[A-Z]{2}\.json$/, 'translation'],   // machine translations (Dinis, 9 Nov 19:25; the ontologist's schema)
    [/^data\/concepts\.json$/, 'concepts'],
    [/^data\/matching\.json$/, 'matching'],
    [/^data\/websummit-only\.json$/, 'websummit-only'],   // what rests only on websummit.com (derive.mjs)
    [/^data\/ontology\.json$/, 'ontology'],
    [/^data\/site\/site\.json$/, 'site'],
    [/^data\/site\/nav\.json$/, 'nav'],
    [/^data\/site\/list-views\.json$/, 'list-views'],
    [/^data\/site\/withdrawn\.json$/, 'withdrawn'],   // the withdrawn pages (lib/withdrawn.mjs, features/withdrawn.mjs)
    [/^data\/site\/contributors\.json$/, 'contributors'],
    [/^data\/site\/gamma-ray\.json$/, 'gamma-ray'],   // GAMMA-Ray's cards (newsroom/tools/gamma-pull.mjs; features/gamma.mjs)   // the collaborators' wall (features/contribute.mjs)
    [/^data\/front\/days\.json$/, 'front-days'],
    [/^data\/corrections\/removals\.json$/, 'removals'],   // applied to rebuilt past days (past-day.mjs)   // the correspondent's five a day (dev.pages@ reads it)   // the switch's words on the list pages (dev.pages@)
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
        const sm = r.match(/^data\/stories\/([^/]+)\/(?:sources\/[^/]+|entities|claims|graph|timeline|blocks)\.json$/)
        if (sm && v.story !== sm[1]) errors.push(`${r}: story "${v.story}" is not its folder's name`)
        if (/\/sources\/[^/]+\.json$/.test(r) && sm && v.id !== path.basename(r, '.json')) errors.push(`${r}: id "${v.id}" is not its file's name`)
    }
    if (errors.length) return errors
    // 2. references
    const s = loadData({ raw: true })   // the data as committed, before the websummit-only pass takes anything off
    const need = (where, ref) => { if (ref && !s.has(ref)) errors.push(`${where}: ${ref} does not exist`) }
    for (const c of s.companies) {
        const ids = new Set(c.sources.map(x => x.id))
        for (const [field, list] of Object.entries(c.field_sources)) for (const id of list) if (!ids.has(id)) errors.push(`data/companies/${c.id}: field ${field} cites ${id}, which is not in sources.json`)
        for (const a of c.aliases) if (a.source && !ids.has(a.source)) errors.push(`data/companies/${c.id}: alias "${a.name}" cites ${a.source}, which is not in sources.json`)
        for (const fl of c.flows) for (const st of [fl, ...(fl.steps || [])]) for (const id of [st.source].flat().filter(Boolean)) if (!ids.has(id)) errors.push(`data/companies/${c.id}/flows.json: flow "${fl.id}" cites ${id}, which is not in sources.json`)
        for (const f of c.facts) if (!ids.has(f.source)) errors.push(`data/companies/${c.id}/facts.json: ${f.id} cites ${f.source}, which is not in sources.json`)
        { const fids = new Set(c.flows.map(x => x.id)), pids = new Set()
          for (const p of c.products || []) {
            if (pids.has(p.id)) errors.push(`${c.id}/products.json: ${p.id} x2`); pids.add(p.id)
            if (!ids.has(p.source)) errors.push(`${c.id}/products.json: ${p.id}: ${p.source}`)
            for (const fl of p.flows || []) if (!fids.has(fl)) errors.push(`${c.id}/products.json: ${p.id}: flow ${fl}`)
          } }
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
    // a story project's folder: every citation resolves inside the folder, every graph ref exists
    for (const x of s.stories) {
        const dir = R(`data/stories/${x.id}`), w = `data/stories/${x.id}`
        const j = n => fs.existsSync(path.join(dir, n)) ? JSON.parse(fs.readFileSync(path.join(dir, n), 'utf8')) : null
        const srcDir = path.join(dir, 'sources'), srcs = new Set(fs.existsSync(srcDir) ? fs.readdirSync(srcDir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : [])
        const ent = j('entities.json'), cl = j('claims.json'), gr = j('graph.json'), tl = j('timeline.json'), bl = j('blocks.json')
        if (!(srcs.size || ent || cl || gr || tl || bl)) continue
        const claims = new Set((cl?.claims || []).map(c => c.id)), ents = new Set((ent?.entities || []).map(e => e.ref))
        const cite = (where, ids, set, what) => { for (const id of [ids].flat().filter(Boolean)) if (!set.has(id)) errors.push(`${w}/${where}: cites ${what} ${id}, which is not in the folder`) }
        const ref = (where, r) => { if (r && !r.startsWith('local:')) need(`${w}/${where}`, r) }
        for (const e of ent?.entities || []) { cite('entities.json', e.sources, srcs, 'source'); ref('entities.json', e.ref) }
        for (const c of cl?.claims || []) { cite('claims.json', c.source, srcs, 'source'); for (const a of c.about || []) ref('claims.json', a) }
        const verbs = new Set([...s.ontology.verbs.flatMap(v => [v.verb, v.inverse]), ...(gr?.verbs || []).flatMap(v => [v.verb, v.inverse])])
        for (const e of gr?.edges || []) {
            if (!verbs.has(e.verb)) errors.push(`${w}/graph.json: verb ${e.verb} is neither in data/ontology.json nor declared in the file`)
            for (const end of [e.from, e.to]) if (!ents.has(end)) errors.push(`${w}/graph.json: ${end} is not in entities.json`)
            const ov = s.ontology.verbs.find(v => v.verb === e.verb), ty = r => r.split(':')[0]
            if (ov) for (const [end, ok] of [[e.from, ov.from], [e.to, ov.to]]) if (ty(end) !== 'local' && !ok.includes(ty(end))) errors.push(`${w}/graph.json: ${e.verb} takes ${ok.join(' or ')} there, not ${end}`)
            cite('graph.json', e.source, srcs, 'source'); cite('graph.json', e.claim, claims, 'claim')
        }
        for (const t of tl?.events || []) { cite('timeline.json', t.source, srcs, 'source'); cite('timeline.json', t.claim, claims, 'claim'); for (const a of t.about || []) ref('timeline.json', a) }
        for (const b of bl?.blocks || []) cite('blocks.json', b.claims, claims, 'claim')
        if (bl && !fs.existsSync(R(bl.article))) errors.push(`${w}/blocks.json: ${bl.article} does not exist`)
    }
    // Wikipedia, read as data: where an article meets our graph, every ref exists and every statement is the article's
    const wroot = R('data/wikipedia')
    if (fs.existsSync(wroot)) for (const a of fs.readdirSync(wroot)) {
        const f = n => path.join(wroot, a, n), w = `data/wikipedia/${a}`
        if (!fs.existsSync(f('meets.json'))) continue
        const m = JSON.parse(fs.readFileSync(f('meets.json'), 'utf8')), art = fs.existsSync(f('article.json')) ? JSON.parse(fs.readFileSync(f('article.json'), 'utf8')) : null
        const ids = new Set(fs.existsSync(f('statements.json')) ? JSON.parse(fs.readFileSync(f('statements.json'), 'utf8')).statements.map(x => x.id) : [])
        if (art && m.revid !== art.revid) errors.push(`${w}/meets.json: written against revision ${m.revid}, the capture is ${art.revid}; read the findings again`)
        for (const x of [...m.links, ...m.rows]) need(`${w}/meets.json`, x.ref)
        for (const x of m.findings) if (x.statement && !ids.has(x.statement)) errors.push(`${w}/meets.json: ${x.id} names statement ${x.statement}, which is not in statements.json`)
    }
    // the board's machine-read files (board/the-team-setup.md, board/spec-budgets-schema.md), against data/schemas/
    const board = (r, kind) => { if (!fs.existsSync(R(r))) return null; let v; try { v = JSON.parse(fs.readFileSync(R(r), 'utf8')) } catch { errors.push(`${r}: not JSON`); return null } for (const e of validate(v, `${kind}.schema.json`, reg)) errors.push(`${r}: ${e}`); return v }
    const mine = (r, a, role) => { if (a && a !== `${role}@PrompTugal.dinis`) errors.push(`${r}: agent ${a} != folder`) }
    const teamDir = R('board/team')
    if (fs.existsSync(teamDir)) for (const role of fs.readdirSync(teamDir).filter(d => fs.statSync(path.join(teamDir, d)).isDirectory())) {
        const sr = `board/team/${role}/status.json`, rr = `board/team/${role}/ROLE.md`
        mine(sr, board(sr, 'team-status')?.agent, role)
        if (!fs.existsSync(R(rr))) continue
        const fm = {}, m = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(R(rr), 'utf8').replace(/\r\n/g, '\n'))
        for (const l of (m ? m[1] : '').split('\n')) { const k = /^([a-z_]+):\s*(.*)$/.exec(l); if (k) fm[k[1]] = k[2].trim() }
        for (const e of validate(fm, 'team-role.schema.json', reg)) errors.push(`${rr}: ${e}`)
        mine(rr, fm.agent, role)
    }
    const sched = board('board/schedule.json', 'team-schedule'), on = new Set()
    for (const t of sched?.tasks || []) if (t.state === 'enabled') { if (on.has(t.agent) || !t.trigger) errors.push(`board/schedule.json: ${t.agent}`); on.add(t.agent) }
    const bud = board('board/budgets.json', 'budgets'), rows = new Set()
    if (bud && !(bud.thresholds.warn < bud.thresholds.stop)) errors.push('board/budgets.json: warn >= stop')
    for (const a of bud?.agents || []) { if (rows.has(a.agent)) errors.push(`board/budgets.json: ${a.agent}`); rows.add(a.agent) }
    for (const p of bud?.passes || []) if (p.file !== `board/passes/${p.pass}.md` || !fs.existsSync(R(p.file))) errors.push(`board/budgets.json: ${p.pass}`)
    // an organisation's network: every graph ref exists, every verb is declared or the ontology's, every local end is defined
    for (const o of s.organisations) {
        const f = R(`data/organisations/${o.id}/network.json`); if (!fs.existsSync(f)) continue
        const n = JSON.parse(fs.readFileSync(f, 'utf8')), w = `data/organisations/${o.id}/network.json`
        const local = new Set([...n.programmes, ...n.roles].map(x => x.id)), vs = new Set([...s.ontology.verbs.map(v => v.verb), ...(n.verbs || []).map(v => v.verb)])
        for (const e of n.edges) { if (!vs.has(e.verb)) errors.push(`${w}: verb ${e.verb}`); for (const r of [e.from, e.to]) /^(programme|role):/.test(r) ? (local.has(r) || errors.push(`${w}: ${r}`)) : need(w, r) }
    }
    // the concepts: ids unique, every see path exists
    if (fs.existsSync(R('data/concepts.json'))) { const cs = JSON.parse(fs.readFileSync(R('data/concepts.json'), 'utf8')).concepts, ids = new Set(); for (const x of cs) { if (ids.has(x.id)) errors.push(`data/concepts.json: ${x.id} twice`); ids.add(x.id); for (const p of x.see || []) if (!fs.existsSync(R(p))) errors.push(`data/concepts.json: ${x.id} sees ${p}`) } }
    // translations: the entity exists, the locale is one of the app's cultures (not the original), the file is where it says
    if (fs.existsSync(R('data/translations'))) {
        const cultures = new Set(JSON.parse(fs.readFileSync(R('assets/app/i18n.json'), 'utf8')).cultures.filter(c => c.machine).map(c => c.id))
        const TYPE = { events: 'event', articles: 'article', companies: 'company' }
        for (const f of walk(R('data/translations'), p => p.endsWith('.json'))) {
            const r = rel(f), m = r.match(/^data\/translations\/([^/]+)\/([^/]+)\/([^/]+)\.json$/); if (!m) continue
            const v = JSON.parse(fs.readFileSync(f, 'utf8'))
            if (v.of !== `${TYPE[m[1]]}:${m[2]}`) errors.push(`${r}: of "${v.of}" is not its folder (${TYPE[m[1]]}:${m[2]})`)
            if (v.locale !== m[3]) errors.push(`${r}: locale "${v.locale}" is not its file's name`)
            if (!cultures.has(v.locale)) errors.push(`${r}: ${v.locale} is not a machine-translated culture of assets/app/i18n.json`)
            if (m[1] !== 'articles') need(r, v.of)
        }
    }
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
