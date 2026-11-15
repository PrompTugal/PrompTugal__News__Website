// The JSON-first audit (datasci.places@PrompTugal.dinis, 15 November 2026, at Dinis's word: "everything accessed from
// JSON ... no data that only exists in HTML"). Two parts:
//
//   audit(ctx)     run by features/openapi.mjs's final step (it needs every page written and every API file made):
//                  for every kind of page, how many outside links (the facts' sources) it shows and how many of them
//                  some served JSON file holds; for every by-place page, the same against that place's own endpoints.
//                  Published as api/v1/datasci/audit.json, and drawn on /datasci/.
//   validate(gate) the gate's rule for by-place pages: a place page may link out only to what its JSON holds
//                  (api/v1/by-place/<id>.json, api/v1/data/places/<id>.json and api/v1/places/<id>/*.json). A page that
//                  shows a source its JSON lacks fails the build, with the place and the links named.
//
// A link counts as data when its URL appears as a string in the JSON. Links every page carries (the shell's own) and
// share links are left out; the shell's are read from the about page, the share hosts are listed below.
import fs from 'node:fs'
import { words, fillW } from './datasci-places.mjs'

const SHARE = /^https:\/\/(promptugal\.news|twitter\.com|x\.com|www\.linkedin\.com|wa\.me|www\.facebook\.com|bsky\.app|t\.me|reddit\.com|www\.reddit\.com)(\/|$)/
// a commit link is folded to its first nine hex digits and the repository's lower-case name, so a page linking
// commit/5396cc850 and a JSON holding the full hash (or only the hash, as a value) agree
const REPO_COMMIT = 'https://github.com/promptugal/promptugal__news__website/commit/'
export const norm = u => u.replace(/&amp;/g, '&').replace(/\/+$/, '').replace(/^http:/, 'https:')
    .replace(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/commit\/([0-9a-f]{7,40})$/i, (m, repo, sha) => `https://github.com/${repo.toLowerCase()}/commit/${sha.slice(0, 9).toLowerCase()}`)
const linksOf = html => [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => norm(m[1]))
const urlsIn = (s, set) => {
    String(s).replace(/https?:\/\/[^\s"\\<>)\]]+/g, u => { set.add(norm(u)); set.add(norm(u.replace(/[.,;:!?]+$/, ''))) })
    String(s).replace(/"(?:sha|hash|commit)"\s*:\s*"([0-9a-f]{7,40})"/gi, (_, h) => set.add(REPO_COMMIT + h.slice(0, 9).toLowerCase()))
    return set
}

// the part of a place page that is the place (the by-place frame), so the shell and its neighbours are not counted
export function frameOf(html) {
    const m = /<div class="bp-frame[^"]*"[^>]*>/.exec(html)
    if (!m) return null
    const re = /<\/?div\b[^>]*>/g
    re.lastIndex = m.index
    let depth = 0, x
    while ((x = re.exec(html))) { depth += x[0][1] === '/' ? -1 : 1; if (depth === 0) return html.slice(m.index, re.lastIndex) }
    return html.slice(m.index)
}

// a place's JSON: every API file named for it (a segment <id> or a file <id>.json), and the files every place page
// draws from (the index of places, viz.places@'s agents panel); a feature that draws on place pages from a new file
// adds it here or names its file for the place
export const SHARED = ['api/v1/by-place/index.json', 'api/v1/viz/agents.json', 'assets/viz/cast.json']
export const placeFiles = (id, all) => [...SHARED, ...all.filter(p => !SHARED.includes(p) && (p.startsWith('api/v1/') && p.split('/').some((s, i, a) => s === id || (i === a.length - 1 && s === `${id}.json`))))]

const chromeOf = read => { try { return new Set(linksOf(read('about/index.html'))) } catch { return new Set() } }
const shownOn = (html, chrome) => [...new Set(linksOf(html).filter(u => !SHARE.test(u) && !chrome.has(u)))]

// the by-place rule, shared by the audit and the gate
export function placeCheck(places, read, apiPaths) {
    const chrome = chromeOf(read), out = []
    for (const p of places) {
        const rel = `${p.path}index.html`
        let html
        try { html = read(rel) } catch { continue }
        const frame = frameOf(html)
        if (!frame) { out.push({ id: p.id, page: rel, shown: 0, held: 0, missing: [], note: 'no by-place frame on the page' }); continue }
        const held = new Set()
        for (const f of placeFiles(p.id, apiPaths)) { try { urlsIn(read(f), held) } catch {} }
        const shown = shownOn(frame, chrome), missing = shown.filter(u => !held.has(u))
        out.push({ id: p.id, page: rel, files: placeFiles(p.id, apiPaths), shown: shown.length, held: shown.length - missing.length, missing })
    }
    return out
}

export function audit(ctx) {
    const read = rel => fs.readFileSync(ctx.R(rel), 'utf8')
    const held = new Set()
    for (const a of ctx.api || []) if (/\.json$/.test(a.path)) urlsIn(typeof a.data === 'string' ? a.data : JSON.stringify(a.data), held)
    const chrome = chromeOf(read)
    const apiByFeature = {}
    for (const a of ctx.api || []) apiByFeature[a.feature] = (apiByFeature[a.feature] || 0) + 1
    const kinds = new Map()
    for (const p of ctx.pages) {
        if (!p.rel.endsWith('.html')) continue
        let html
        try { html = read(p.rel) } catch { continue }
        const key = `${p.feature}:${p.rel.includes('/') ? p.rel.split('/')[0] + '/' : p.rel}`
        const k = kinds.get(key) || { kind: key, feature: p.feature, section: p.rel.includes('/') ? p.rel.split('/')[0] + '/' : p.rel, pages: 0, api_files_of_feature: apiByFeature[p.feature] || 0, links_shown: 0, links_in_json: 0, examples_missing: [] }
        const shown = shownOn(html, chrome), miss = shown.filter(u => !held.has(u))
        k.pages++; k.links_shown += shown.length; k.links_in_json += shown.length - miss.length
        for (const u of miss) if (k.examples_missing.length < 8 && !k.examples_missing.some(e => e.url === u)) k.examples_missing.push({ url: u, page: p.rel })
        kinds.set(key, k)
    }
    const rows = [...kinds.values()].map(k => ({ ...k, share_in_json: k.links_shown ? Math.round(100 * k.links_in_json / k.links_shown) / 100 : null }))
        .sort((a, b) => (b.links_shown - b.links_in_json) - (a.links_shown - a.links_in_json) || b.pages - a.pages)
    let places = []
    try { places = ctx.readJSON('data/by-place/places.json').places } catch {}
    const apiPaths = (ctx.api || []).map(a => a.path)
    const byPlace = placeCheck(places, read, apiPaths)
    const totShown = rows.reduce((s, r) => s + r.links_shown, 0), totHeld = rows.reduce((s, r) => s + r.links_in_json, 0)
    return {
        about: words(ctx).audit.about,
        version: ctx.VERSION, built: ctx.TODAY, by: 'datasci.places@PrompTugal.dinis',
        method: words(ctx).audit.method,
        summary: { pages: rows.reduce((s, r) => s + r.pages, 0), kinds: rows.length, links_shown: totShown, links_in_json: totHeld, share_in_json: totShown ? Math.round(100 * totHeld / totShown) / 100 : null, by_place_pages: byPlace.length, by_place_missing: byPlace.reduce((s, p) => s + p.missing.length, 0), kinds_fully_in_json: rows.filter(r => r.links_shown === r.links_in_json).length },
        by_place: byPlace,
        kinds: rows,
    }
}

// the gate: a by-place page shows no outside link its JSON does not hold
export function validate(gate) {
    let places
    try { places = gate.json('data/by-place/places.json').places } catch { return [] }
    const apiPaths = [...gate.generated].filter(p => p.startsWith('api/v1/') && p.endsWith('.json'))
    const read = rel => gate.text(rel)
    const out = []
    for (const r of placeCheck(places, read, apiPaths)) {
        if (r.note) { out.push(`datasci-audit: ${r.page}: ${r.note}`); continue }
        if (r.missing.length) out.push(`datasci-audit: ${r.page} shows ${r.missing.length} source${r.missing.length === 1 ? '' : 's'} its JSON does not hold (api/v1/ files named for ${r.id}, and ${SHARED.join(', ')}): ${r.missing.slice(0, 5).join(' ')}${r.missing.length > 5 ? ' ...' : ''}`)
    }
    return out
}
