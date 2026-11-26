// The gate's hold on the place files (cl-6.security's condition, 26 Nov 2026). Place data reaches data/by-place/ only through
// newsroom/tools/sync-places.mjs, which takes each file from a commit signed by the pinned key and records its sha256 in
// newsroom/tools/place-sources.json. A place file whose bytes are not the recorded ones (a hand edit, a file that did not come through the
// sync) is an error. The signature of the commit was verified at sync time (the commit objects are in the homes, not here); what the gate
// can and does check is that nothing changed since. Pure: ids, the recorded sources and a reader are parameters (tests/test_place_sources.mjs).
import crypto from 'node:crypto'
import fs from 'node:fs'
import { R } from './config.mjs'

const load = f => { try { return JSON.parse(fs.readFileSync(R(f), 'utf8')) } catch { return null } }
const sha = b => crypto.createHash('sha256').update(b).digest('hex')

export function checkPlaceSources(ids, src, read) {
    ids = ids || (load('data/by-place/places.json')?.places || []).map(p => p.id)
    if (!ids.length) return []
    src = src || load('newsroom/tools/place-sources.json')?.places
    if (!src) return ['newsroom/tools/place-sources.json: missing or not JSON (the place files come only through newsroom/tools/sync-places.mjs)']
    read = read || (f => { try { return fs.readFileSync(R(f)) } catch { return null } })
    const errors = []
    for (const id of ids) for (const f of [`data/by-place/${id}.json`, `data/by-place/now/${id}.json`]) {
        const b = read(f); if (b == null) continue
        const rec = src[id] && src[id].files && src[id].files[f]
        if (!rec) { errors.push(`${f}: not in place-sources.json (place files come only through newsroom/tools/sync-places.mjs)`); continue }
        if (sha(b) !== rec.sha256) errors.push(`${f}: differs from the version synced at ${String(rec.commit).slice(0, 9)} (sync it again; do not edit it here)`)
    }
    return errors
}
