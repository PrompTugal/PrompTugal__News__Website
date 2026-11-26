// The place picker (cl-6.sherpa's S1, the conductor's yes of 26 Nov 2026): a fill marker, <!-- place-picker -->, that the owner of /contribute/ puts in the page.
// The build turns it into the list of places from data/by-place/places.json, grouped the Algarve, the rest of Portugal, Europe, each name linked to that place's own page.
// No script, nothing written; names go through plain(). The marker is not placed yet: /contribute/ is content/** and waits for its owner. cl-6.dev@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
import { plain } from '../lib/agent-text.mjs'
export const order = 61

const GROUPS = [['algarve', 'The Algarve'], ['portugal', 'The rest of Portugal'], ['europe', 'Europe']]
const inTree = (byId, p, id) => { for (let q = p, i = 0; q && i < 6; q = byId.get(q.parent), i++) if (q.id === id) return true; return false }

// the places, grouped: pure, so it can be tested with a list
export function groupPlaces(places) {
    const byId = new Map(places.map(p => [p.id, p])), out = { algarve: [], portugal: [], europe: [] }
    for (const p of places) {
        if (p.kind === 'country') continue
        const g = p.group === 'Europe' ? 'europe' : inTree(byId, p, 'algarve') ? 'algarve' : inTree(byId, p, 'portugal') ? 'portugal' : ''
        if (g && typeof p.path === 'string' && /^[a-z0-9-]+(\/[a-z0-9-]+)*\/$/.test(p.path)) out[g].push(p)
    }
    for (const g of Object.keys(out)) out[g].sort((a, b) => (a.id === 'algarve' ? -1 : b.id === 'algarve' ? 1 : String(a.name).localeCompare(String(b.name), 'pt')))
    return out
}

export const fill = {
    'place-picker': (page, ctx) => {
        let places; try { places = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'data/by-place/places.json'), 'utf8')).places } catch { return '' }
        const g = groupPlaces(places)
        return GROUPS.filter(([k]) => g[k].length).map(([k, label]) => `**${label}:** ` + g[k].map(p => `[${plain(p.name)}](${ctx.link(page.rel, `${p.path}index.html`)})`).join(' · ')).join('\n\n')
    },
}
