/**
 * sync.js: the reading account between a browser's local storage and the reader vault, as pure functions.
 * Ported from newsroom.sgit.ai's assets/vault-pane/sync.js (read 5 November 2026); this site has no notes and no wire
 * yet, so their parts are left out, and otherwise the rules are the reference's:
 *
 *   - local storage stays the primary store, updated as the reader reads; the vault is updated when the reader asks;
 *   - the vault holds RAW records, never totals: each device writes one file with everything it originated
 *     (reads with their share read, rating and decline; top-ups; personas), rewritten whole on every update, so a
 *     device only ever overwrites its own file and two devices cannot conflict;
 *   - a consolidated view is computed from all the device files each time it is needed, and the totals
 *     (reads, spent, declined, credit, balance) are recomputed from the records with one starting credit for the
 *     account, never copied from a device;
 *   - bringing other devices' records into a browser adds them to its local state tagged with the device they came
 *     from, so the next update from that browser writes only its own records back.
 *
 * Nothing here touches storage or the network: the pane (vault.js) reads and writes, this file decides. The meter's
 * state is sg-meter-core's (v1.5.0): { v, created, balance, spent, reads, declined, log[], topups[], sessions[],
 * active, personas[] }; a log entry: { id, at, path, title, kind, topics, price, depth, cost, persona, rating?, declined? }.
 *
 * @module vault-sync
 */

export const FORMAT = 1
export const PATHS = {
    account: '/activity/account.json',
    devicesFolder: '/activity/devices',
    device: id => `/activity/devices/${id}.json`,
    index: '/activity/index.json',
    apps: '/apps',
}
const r1 = x => Math.round(x * 10) / 10
const topupKey = t => (t.ref && t.ref !== 'undefined' && t.source === 'link') ? `ref:${t.ref}` : `at:${t.at}|${t.credit}|${t.device || ''}`

/** The account file, written once by the device that creates the account: the one starting credit. */
export function accountFile(cfg, deviceId) {
    return { v: FORMAT, start: Number(cfg.start) || 0, symbol: cfg.symbol || '£', created: new Date().toISOString(), created_by: deviceId }
}

/** This device's file: the records it originated, whole. Records merged in from other devices (tagged with their device) are left out. */
export function extract(state, device, prev = null) {
    const own = e => !e.device || e.device === device.id
    const now = new Date().toISOString()
    return {
        v: FORMAT,
        device: { id: device.id, label: device.label || '', agent: device.agent || '', first_sync: (prev && prev.device && prev.device.first_sync) || now, last_sync: now, syncs: ((prev && prev.device && prev.device.syncs) || 0) + 1 },
        created: state.created || null,
        reads: (state.log || []).filter(own).map(e => ({ ...e, device: device.id })),
        topups: (state.topups || []).filter(own).map(t => ({ ...t, device: device.id })),
        personas: (state.personas || []).filter(p => own(p)).map(p => ({ ...p, device: p.device || device.id })),
        active: state.active || 'me',
    }
}

/** The best version of one read seen in several places: the one that knows most. */
function newer(a, b) {
    if (!a) return b
    if (!b) return a
    const score = e => (e.declined ? 4 : 0) + (e.rating ? 2 : 0) + (e.depth || 0)
    return score(b) > score(a) ? b : a
}

/** Two files of the same device into one: every record of either kept, the one that knows more where both have it. */
export function combine(prev, next) {
    if (!prev) return next
    if (!next) return prev
    const [older, newer_] = String((prev.device || {}).last_sync || '') <= String((next.device || {}).last_sync || '') ? [prev, next] : [next, prev]
    const reads = new Map(); for (const x of [...(older.reads || []), ...(newer_.reads || [])]) reads.set(x.id, newer(reads.get(x.id), x))
    const topups = new Map(); for (const t of [...(older.topups || []), ...(newer_.topups || [])]) topups.set(topupKey(t), t)
    const personas = new Map(); for (const p of [...(older.personas || []), ...(newer_.personas || [])]) personas.set(p.id, { ...(personas.get(p.id) || {}), ...p })
    const d0 = older.device || {}, d1 = newer_.device || {}
    return {
        ...newer_,
        device: { ...d1, first_sync: [d0.first_sync, d1.first_sync].filter(Boolean).sort()[0] || d1.first_sync, syncs: Math.max(d0.syncs || 0, d1.syncs || 0) },
        created: older.created || newer_.created || null,
        reads: [...reads.values()].sort((a, b) => String(b.at).localeCompare(String(a.at))),
        topups: [...topups.values()].sort((a, b) => String(b.at).localeCompare(String(a.at))),
        personas: [...personas.values()],
    }
}

/** Every device's file into one view, with the totals recomputed from the records. */
export function consolidate(files, account) {
    const start = account && Number.isFinite(Number(account.start)) ? Number(account.start) : 0
    const reads = new Map(), topups = new Map(), personas = new Map(), devices = []
    for (const f of (files || []).filter(Boolean).sort((a, b) => String((a.device || {}).last_sync || '').localeCompare(String((b.device || {}).last_sync || '')))) {
        const d = f.device || {}
        let spent = 0, credit = 0
        for (const e of f.reads || []) { reads.set(e.id, newer(reads.get(e.id), e)); spent += e.cost || 0 }
        for (const t of f.topups || []) { topups.set(topupKey(t), t); credit += t.credit || 0 }
        for (const p of f.personas || []) {
            if (p.id === 'me' && personas.has('me')) { const m = personas.get('me'); personas.set('me', { ...m, on: [...new Set([...(m.on || []), ...(p.on || [])])], off: [...new Set([...(m.off || []), ...(p.off || [])])], name: m.name || p.name }) }
            else personas.set(p.id, p)
        }
        devices.push({ id: d.id, label: d.label || '', agent: d.agent || '', first_sync: d.first_sync, last_sync: d.last_sync, syncs: d.syncs || 0,
                       reads: (f.reads || []).length, spent: r1(spent), topups: (f.topups || []).length, credit: r1(credit) })
    }
    const allReads = [...reads.values()].sort((a, b) => String(b.at).localeCompare(String(a.at)))
    const allTopups = [...topups.values()].sort((a, b) => String(b.at).localeCompare(String(a.at)))
    const spent = r1(allReads.reduce((s, e) => s + (e.cost || 0), 0))
    const declined = r1(allReads.reduce((s, e) => s + (e.declined ? (e.declined.refunded || 0) : 0), 0))
    const credit = r1(allTopups.reduce((s, t) => s + (t.credit || 0), 0))
    return {
        v: FORMAT, start, devices, reads: allReads, topups: allTopups, personas: [...personas.values()],
        totals: { reads: allReads.length, spent, declined, credit, balance: r1(start + credit - spent), devices: devices.length },
    }
}

/**
 * Other devices' records into this browser's state: reads and top-ups it does not have, tagged with their device;
 * personas it does not have; the totals recomputed from the merged records with the account's starting credit.
 * The local state's own records are never changed. Returns { state, added }.
 */
export function mergeInto(state, consolidated, deviceId, { own = false } = {}) {
    const s = { ...state, log: [...(state.log || [])], topups: [...(state.topups || [])], sessions: [...(state.sessions || [])], personas: [...(state.personas || [])] }
    const added = { reads: 0, topups: 0, personas: 0 }
    const have = new Set(s.log.map(e => e.id))
    for (const e of consolidated.reads || []) {
        if (have.has(e.id)) continue
        if (e.device === deviceId) { if (!own) continue; const { device, ...mine } = e; s.log.push(mine); have.add(e.id); added.reads++; continue }
        s.log.push({ ...e }); have.add(e.id); added.reads++
    }
    s.log.sort((a, b) => String(b.at).localeCompare(String(a.at)))
    const haveT = new Set(s.topups.map(topupKey))
    for (const t of consolidated.topups || []) {
        if (haveT.has(topupKey(t))) continue
        if (t.device === deviceId) { if (!own) continue; const { device, ...mine } = t; s.topups.push(mine) } else s.topups.push({ ...t })
        haveT.add(topupKey(t)); added.topups++
        if (t.source === 'link' && t.ref && !s.sessions.includes(t.ref)) s.sessions.push(t.ref)
    }
    s.topups.sort((a, b) => String(b.at).localeCompare(String(a.at)))
    const haveP = new Set(s.personas.map(p => p.id))
    for (const p of consolidated.personas || []) { if (haveP.has(p.id)) continue; s.personas.push({ ...p }); haveP.add(p.id); added.personas++ }
    const start = Number.isFinite(Number(consolidated.start)) ? Number(consolidated.start) : 0
    s.spent = r1(s.log.reduce((a, e) => a + (e.cost || 0), 0))
    s.declined = r1(s.log.reduce((a, e) => a + (e.declined ? (e.declined.refunded || 0) : 0), 0))
    s.reads = s.log.length
    s.balance = r1(start + s.topups.reduce((a, t) => a + (t.credit || 0), 0) - s.spent)
    return { state: s, added }
}

/** What the vault holds that this browser does not: the records a merge would add, counted without writing. */
export function inbound(consolidated, state, deviceId, opts = {}) {
    const m = mergeInto(state || {}, consolidated, deviceId, opts)
    const devices = (consolidated.devices || []).filter(d => d.id !== deviceId).length
    return { ...m.added, devices, any: m.added.reads + m.added.topups + m.added.personas }
}

const words = list => { const parts = list.filter(([n]) => n).map(([n, one]) => `${n} ${one}${n === 1 ? '' : 's'}`); return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : (parts[0] || 'nothing') }
/** In words: "17 reads and 2 top-ups from 3 other devices". */
export function describeInbound(i) { const w = words([[i.reads, 'read'], [i.topups, 'top-up'], [i.personas, 'persona']]); return i.devices ? `${w} from ${i.devices} other device${i.devices === 1 ? '' : 's'}` : w }
/** What an update wrote, in words. */
export function describe(file) { return `${file.reads.length} read(s), ${file.topups.length} top-up(s), ${file.personas.length} persona(s) from ${file.device.label || file.device.id}` }

/** What this browser holds that the vault does not yet: own records changed after the last update from this device. */
export function pending(state, last, savedItems = []) {
    const after = at => !!at && (!last || String(at) > last)
    const st = state || {}
    const reads = (st.log || []).filter(e => !e.device && (after(e.at) || after(e.rating && e.rating.at) || after(e.declined && e.declined.at))).length
    const topups = (st.topups || []).filter(t => !t.device && after(t.at)).length
    const items = savedItems.filter(x => !x.in_vault).length
    return { count: reads + topups + items, reads, topups, items, any: reads + topups + items > 0, last }
}
export function describePending(p) { return words([[p.reads, 'read'], [p.topups, 'top-up'], [p.items, 'saved item']]) }

/** A feature's path into the reader vault: apps/<path>, path segments of [a-z0-9._-], ending .json. Null when it is not one. */
export function appPath(path) {
    const p = String(path || '').replace(/^\/+/, '')
    if (!/^[a-z0-9][a-z0-9-]*(\/[A-Za-z0-9][A-Za-z0-9._-]*)+$/.test(p) || p.includes('..')) return null
    const full = p.endsWith('.json') ? p : p + '.json'
    const parts = full.split('/'), name = parts.pop()
    return { path: full.replace(/\.json$/, ''), folder: `${PATHS.apps}/${parts.join('/')}`, name, file: `${PATHS.apps}/${full}` }
}
