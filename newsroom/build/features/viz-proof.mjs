// The proof layer as a page (board/briefs/2026-11-16-every-story-has-an-address.md, item 7, with data.places@): for every
// story on the case-study pages (Loulé and Faro), the chain of custody from the local source to the page, each link read
// from the record: the source and its read date, data.places@'s capture (data/query/captures.json), the commit that
// brought it into the place's file (its git history), the signature by the site key (abp@'s check), the release, the
// data index (datasci.places@'s api/v1/places/<id>/), the detective's connections, the pages. Words: assets/viz/proof.json.
// By viz.places@PrompTugal.dinis, 16 November 2026.
import crypto from 'node:crypto'
import { checkSites } from '../../../board/abp/tools/site-identity.mjs'
import { short, hm, dm } from './viz-record.mjs'
import { places, newsroomRel, W, trim, noPrefix, noDash, repoCommit } from './viz-agents.mjs'
import { history } from './viz-newsroom.mjs'

export const order = 99
const REL = 'agentic-system/proof/index.html', CASES = ['loule', 'faro']
let COPY = null
const copy = ctx => COPY || (COPY = ctx.readJSON('assets/viz/proof.json'))
const arr = v => Array.isArray(v) ? v : []
const safe = u => String(u || '').trim().replace(/\(/g, '%28').replace(/\)/g, '%29')

function page(ctx) {
    const C = copy(ctx), L = C.lines, S = C.steps, c = s => ctx.md.cell(String(s ?? ''))
    let caps = []
    try { caps = arr(ctx.readJSON('data/query/captures.json').captures) } catch {}
    const capOf = new Map(caps.map(k => [k.url, k]))
    let links = []
    try { links = arr(ctx.readJSON('data/by-place/connections.json').links) } catch {}
    let sites = []
    try { sites = checkSites(ctx.ROOT) } catch {}
    let md = `${C.intro}\n\n`
    for (const id of CASES) {
        const p = places(ctx).find(x => x.id === id)
        if (!p) continue
        const d = p.data || {}, news = arr(d.ai_news), H = history(ctx, p), site = sites.find(s => s.id === id)
        let sha = ''
        try { sha = crypto.createHash('sha256').update(ctx.readText(`data/by-place/${id}.json`)).digest('hex').slice(0, 16) } catch {}
        const first = new Map()
        for (const h of H) for (const k of h.keys) if (!first.has(k)) first.set(k, h)
        md += `## ${W(C.h_place, { name: p.name, n: news.length })} {#${id}}\n\n`
        for (const a of news) {
            const key = `news:${String(a.url || a.title || '').toLowerCase()}`, h = first.get(key), cap = capOf.get(a.url)
            const nConn = links.filter(l => l.source_url && a.url && l.source_url.trim() === a.url.trim()).length
            const rows = [
                [S.read, W(L.read, { publisher: c(a.publisher || a.url), url: safe(a.url), date: c(a.date || '?'), agent: c(short(p.agent.toLowerCase())), read_on: c(a.read_on || '?') })],
                [S.capture, cap ? W(L.capture, { when: c(String(cap.captured_at || '').slice(0, 16).replace('T', ' ')), by: c(short(String(cap.by || '').toLowerCase())), status: c(cap.status), sha: c(cap.image && cap.image.sha256 ? cap.image.sha256.slice(0, 16) : '?') }) : L.capture_none],
                [S.commit, h ? W(L.commit, { sha: h.sha, href: repoCommit(ctx, h.sha), agent: c(short(h.agent.toLowerCase())), when: `${dm(h.t)} ${hm(h.t)}`, subject: c(trim(noDash(noPrefix(h.subject)), 110)) }) : L.commit_none],
                [S.signed, W(L.signed, { id, sha, sig: c(site ? site.signature : '?'), key: c(site && site.site_key ? site.site_key : '?') })],
                [S.release, h && h.release ? W(L.release, { v: h.release }) : L.release_none],
                [S.indexed, W(L.indexed, { id, stories: ctx.link(REL, `api/v1/places/${id}/stories.json`), prov: ctx.link(REL, `api/v1/places/${id}/provenance.json`) })],
                [S.connected, nConn ? W(L.connected, { n: nConn }) : L.connected_none],
                [S.pages, W(L.pages, { name: c(p.name), place: ctx.link(REL, `${p.path}index.html`), newsroom: ctx.link(REL, newsroomRel(p)) })],
            ]
            md += `### ${c(a.title)}\n\n{.vz-proof}\n${rows.map(([k, v], i) => `${i + 1}. **${k}:** ${v}`).join('\n')}\n\n`
        }
    }
    md += `[${C.back}](${ctx.link(REL, 'agentic-system/index.html')})\n`
    return { rel: REL, type: 'site', layout: 'wide', date: ctx.TODAY, section: 'about', group: 'About', crumbs: [['agentic-system/index.html', 'The agentic system'], [null, 'The proof layer']], title: C.title, summary: C.summary, md }
}

export function pages(ctx) { return [page(ctx)] }
