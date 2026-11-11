// What rests only on websummit.com (Dinis, 11 November 2026, about 18:50 UTC; board/guidance/2026-11-11-only-websummit-
// sourced-comes-off.md; the pass board/passes/2026-11-11-only-websummit-sourced-comes-off.md, step 3): a fact, a company
// field, a person's listing or a session whose every source is websummit.com (the site, its subdomains, the app) comes
// off what the site serves; an entity left with nothing gets no page. This file is the rule and its count. The pass runs
// in order: security@'s pre-review, ontologist@'s inventory (step 2), then the build. Until the switch is on
// (newsroom/build/websummit-only.json "on"), the gate only counts (a dry run) and nothing served changes. When ontologist@'s
// inventory exists the switch names it and it is read in place of the host rule below.
import fs from 'node:fs'
import { R } from './config.mjs'

export const isWs = u => { try { return /(^|\.)websummit\.com$/i.test(new URL(String(u)).hostname) } catch { return false } }
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
