// What rests only on websummit.com (Dinis, 11 November 2026, about 18:50 UTC; board/guidance/2026-11-11-only-websummit-
// sourced-comes-off.md; the pass board/passes/2026-11-11-only-websummit-sourced-comes-off.md, step 3): a fact, a company
// field, a person's listing or a session whose every source is websummit.com (the site, its subdomains, the app) comes
// off what the site serves; an entity left with nothing gets no page. This file is the rule and its count. The pass runs
// in order: security@'s pre-review, ontologist@'s inventory (step 2), then the build. Until the switch is on
// (newsroom/build/websummit-only.json "on"), the gate only counts (a dry run) and nothing served changes. When ontologist@'s
// inventory exists the switch names it and it is read in place of the host rule below.
import fs from 'node:fs'
import { R } from './config.mjs'

export const isWs = u => { try { return /(^|\.)websummit\.(com|net)$/i.test(new URL(String(u)).hostname) } catch { return false } }
// every source given is websummit.com (no source at all counts as resting on nothing else)
const only = urls => urls.filter(Boolean).every(isWs)

let S
export function wsSwitch() {
    if (S) return S
    try { S = JSON.parse(fs.readFileSync(R('newsroom/build/websummit-only.json'), 'utf8')) } catch { S = {} }
    return S
}

// the count over the store, by kind: [total, websummit-only] and the entities left with nothing
export function wsReport(store) {
    const r = { facts: [0, 0], companies_empty: [], people: [0, 0], events: [0, 0] }
    for (const c of store.companies) {
        const url = new Map(c.sources.map(s => [s.id, s.url]))
        let kept = 0
        for (const f of c.facts) { r.facts[0]++; if (only([f.source].flat().map(id => url.get(id)))) r.facts[1]++; else kept++ }
        if (!kept) r.companies_empty.push(c.id)
    }
    for (const p of store.people) { r.people[0]++; if (only((p.listings || []).map(l => l.source))) r.people[1]++ }
    for (const e of store.events) { r.events[0]++; if (only([e.source_url, e.session_url])) r.events[1]++ }
    return r
}
export const wsLine = r => `company facts ${r.facts[1]} of ${r.facts[0]} (${r.companies_empty.length} companies left with none), people ${r.people[1]} of ${r.people[0]}, sessions ${r.events[1]} of ${r.events[0]}`
// ontologist@'s inventory (data/websummit-only.json, derived by lib/derive.mjs), named by the switch; null when absent
let I
export function wsInventory() {
    if (I !== undefined) return I
    try { I = wsSwitch().inventory ? JSON.parse(fs.readFileSync(R(wsSwitch().inventory), 'utf8')) : null } catch { I = null }
    return I
}
// the gate's line (validate.js check 15): the inventory's counts when it exists, else the host rule's
export function wsGate(store) {
    const i = wsInventory(), mode = wsSwitch().on ? 'on' : 'dry run, nothing taken off yet'
    if (!i) return `websummit-only (${mode}): ${wsLine(wsReport(store))}`
    return `websummit-only (${mode}; ${wsSwitch().inventory}): ` + Object.entries(i.counts).map(([k, c]) => `${k} ${c.websummit_only} of ${c.total}`).join(', ')
}
// the switch on: the store as the site may serve it (loadData calls this last). Company facts and edges in the inventory
// go; a company left with nothing goes; one with no fact left keeps its name and its own site and loses the fields that
// rested on the facts (ontologist@, 22:22: company.json fields have no per-field source); the people, sessions,
// organisations and places in the inventory go. Returns what it took, by kind, for the note and the recovery page.
export function wsApply(store) {
    const i = wsInventory(); if (!wsSwitch().on || !i) return null
    const id = r => String(r).replace(/^[a-z]+:/, ''), gone = { companies: new Set(), people: new Set(), events: new Set(), organisations: new Set(), places: new Set(), evidence: new Set() }
    const items = new Set(i.company_items.map(x => `${id(x.company)}|${x.kind}|${x.id}`))
    for (const c of i.companies) if (c.left_with_nothing) gone.companies.add(id(c.company))
    const fields = new Map((i.company_fields || []).map(x => [id(x.company), x.fields]))
    const bare = new Set(i.companies.filter(c => !c.left_with_nothing && c.facts_left === 0).map(c => id(c.company)))
    for (const [k, list] of [['people', i.people.map(x => x.person)], ['events', i.events.map(x => x.event)], ['organisations', i.organisations.map(x => x.organisation)], ['places', i.places.map(x => x.place)]]) for (const r of list) gone[k].add(id(r))
    store.companies = store.companies.filter(c => !gone.companies.has(c.id)).map(c => {
        const k = (kind, x) => !items.has(`${c.id}|${kind}|${x.id}`)
        const out = { ...c, facts: c.facts.filter(x => k('fact', x)), edges: c.edges.filter(x => k('edge', x)), flows: c.flows.filter(x => k('flow', x)), products: c.products.filter(x => k('product', x)), ws_taken: c.facts.length - c.facts.filter(x => k('fact', x)).length }
        // the fields whose sources are all on websummit.com (the inventory's company_fields, ontologist@ 12 November 06:25);
        // the name stays (it is how we refer to it) and so does the category (ours, not a fact)
        for (const f of fields.get(c.id) || (bare.has(c.id) ? ['what', 'country', 'attending', 'attending_as'] : [])) if (f !== 'name' && f !== 'category') out[f] = ''
        return out
    })
    // evidence captures are not in the inventory: one whose source is websummit.com is a copy of its page (the speakers,
    // the featured startups, the updates), so it comes off by the host rule
    gone.evidence = new Set([...(store.evidence || []).filter(e => isWs(e.source_url)).map(e => e.id), ...(i.evidence || []).map(x => id(x.evidence))])   // the inventory's list too (ontologist@, 12 November 02:33)
    for (const k of ['people', 'events', 'organisations', 'places', 'evidence']) store[k] = store[k].filter(x => !gone[k].has(x.id))
    // what stays may not point at what came off: a ref to it is dropped from a list (or the list's object that carries it),
    // and a field that is only that ref is emptied
    const P = { companies: 'company', people: 'person', events: 'event', organisations: 'organisation', places: 'place', evidence: 'evidence' }
    const refs = new Set(Object.entries(gone).flatMap(([k, ids]) => [...ids].map(x => `${P[k]}:${x}`)))
    const bad = v => typeof v === 'string' ? refs.has(v) : v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).some(x => typeof x === 'string' && refs.has(x))
    const scrub = o => { for (const [k, v] of Object.entries(o)) {
        if (Array.isArray(v)) o[k] = v.filter(x => !bad(x)).map(x => x && typeof x === 'object' ? scrub({ ...x }) : x)
        else if (typeof v === 'string' && refs.has(v)) o[k] = null
        else if (v && typeof v === 'object') o[k] = scrub({ ...v }) }
        return o }
    for (const k of ['companies', 'events', 'people', 'organisations', 'places', 'topics', 'stories', 'evidence']) store[k] = (store[k] || []).map(x => scrub({ ...x }))
    store.wsGone = gone
    return gone
}
