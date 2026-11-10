// GAMMA-Ray on pt.news, the agentic edition (THE RESTART, Dinis 10 November 02:40 and 12:40; scores published under his
// "Go and confirmed" of 05:45: beta and provisional, every rating with its evidence, positive, public, open to correction;
// designer@'s board/spec-the-agentic-home-page.md H3, H4, H9, H10).
//   Load       data/site/gamma-ray.json (newsroom/tools/gamma-pull.mjs reads gamma-ray.sgit.ai's published cards); a
//              company's own link (data/companies/<id>/company.json gamma_ray.id), else GAMMA-Ray's company id when it is ours
//   Transform  each card as assets/gamma/gamma.tmpl's card: the product, its company, four chips (A R C O at 1 to 4, dashed
//              where not yet evidenced), the stage and its n of 16, the date read, the link to the card's evidence
//   Save       /agentic/ (every card, ranked); the strip on the home page (features/front-e.mjs places it); the block on
//              each rated company's page. No data, no strip and no block (H9): never an empty or made-up card.
import fs from 'node:fs'
export const order = 24

const R = f => new URL(`../../../${f}`, import.meta.url)
const T = fs.readFileSync(R('assets/gamma/gamma.tmpl'), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const DIMS = [['A', 'Autonomy'], ['R', 'Reach'], ['C', 'Control'], ['O', 'Openness']]

let D
export function gammaData() {
    if (D !== undefined) return D
    try { D = JSON.parse(fs.readFileSync(R('data/site/gamma-ray.json'), 'utf8')); if (!D.cards?.length) D = null } catch { D = null }
    return D
}
const ranked = d => [...d.cards].sort((a, b) => (b.n || 0) - (a.n || 0) || a.name.localeCompare(b.name))
// our company for a card: the company's own gamma_ray link first, then GAMMA-Ray's company id when it is one of ours
function companyOf(ctx, card) {
    const linked = ctx.store.companies.find(c => { try { return JSON.parse(fs.readFileSync(R(`data/companies/${c.id}/company.json`), 'utf8')).gamma_ray?.id === card.id } catch { return false } })
    return linked || ctx.store.companies.find(c => c.id === card.company) || null
}
export function cardHtml(ctx, card, up) {
    const co = companyOf(ctx, card)
    const chips = DIMS.map(([k, name]) => { const l = card.levels?.[k] || 0
        return put(item('chip'), { level: l, dim: k, shown: l ? String(l) : '–', title: l ? `${name}: level ${l} of 4` : `${name}: not yet evidenced` }) }).join('')
    return put(part('card'), { card: esc(card.card), name: esc(card.name), company: co ? `<a href="${up}companies/${co.id}/index.html">${esc(co.name)}</a>` : (card.ours ? 'Our own team' : ''),
        '#chips': chips, n: card.n || 0, stage: esc(card.stage), read: esc(card.read || ''), review: card.review === 'approved' ? item('review') : '' })
}
// the home page's strip (front-e.mjs puts it under the lead): the eight furthest along
export function stripHtml(ctx, up = '') {
    const d = gammaData(); if (!d) return ''
    return put(part('strip'), { up, '#cards': ranked(d).slice(0, 8).map(c => cardHtml(ctx, c, up)).join(''), total: d.cards.length, read_at: esc(d.read_at.replace('T', ' ').replace('Z', ' UTC')) })
}

export function pages(ctx) {
    const d = gammaData(); if (!d) return []
    const when = d.read_at.replace('T', ' ').replace('Z', ' UTC'), md = put(part('page'), { version: esc(d.version), read_at: when })
    return [{ rel: 'agentic/index.html', src: 'data/site/gamma-ray.json', type: 'site', section: 'now', title: 'State of agentic: GAMMA-Ray Spectrum', layout: 'wide',
        summary: put(part('summary'), { total: d.cards.length }), md,
        assets: { css: ['assets/gamma/gamma.css'] },
        postHtml: h => h.replace(/<p>PTGAMMA-all<\/p>/, `<div class="gr-grid gr-all">${ranked(d).map(c => cardHtml(ctx, c, '../')).join('')}</div>`) }]
}

// a rated company's page: its cards under its lead, before the first section (H10)
export function decorate(p, ctx) {
    const d = gammaData(); if (!d || !ctx) return
    const m = p.rel.match(/^companies\/([^/]+)\/index\.html$/)
    if (p.rel === 'index.html') { p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/gamma/gamma.css'] }; return }
    if (!m) return
    const mine = d.cards.filter(c => companyOf(ctx, c)?.id === m[1]); if (!mine.length) return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/gamma/gamma.css'] }
    const block = put(part('block'), { '#cards': mine.map(c => cardHtml(ctx, c, '../../')).join('') }), prev = p.postHtml
    p.postHtml = h => { const out = prev ? prev(h) : h, i = out.indexOf('<h2'); return i < 0 ? out + block : out.slice(0, i) + block + out.slice(i) }
}

export const llms = ctx => gammaData() ? `## State of agentic\n- [agentic/](${ctx.BASE}agentic/index.md): GAMMA-Ray Spectrum cards (beta) for the agentic products we follow, ranked, each linking to its evidence on gamma-ray.sgit.ai.` : ''
