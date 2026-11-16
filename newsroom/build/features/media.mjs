// News organisations (organisation.json with kind "media"): /media/<id>/ for each outlet, /media/ for the list, and
// mediaBlock() for each place's "Local media" block (outlets for the place first, then those covering the area above it).
// Words are in assets/media/copy.json. Spec: board/briefs/2026-11-16-media-kind.md (ontologist@).
import { readFileSync } from 'node:fs'
export const order = 66
let COPY = null
const C = ctx => COPY || (COPY = JSON.parse(readFileSync(new URL('../../../assets/media/copy.json', import.meta.url), 'utf8')))
const okUrl = u => typeof u === 'string' && /^https?:\/\//i.test(u)
const day = s => String(s || '').slice(0, 10)
const outlets = ctx => (ctx.store.organisations || []).filter(o => o.kind === 'media' && o.media).sort((a, b) => a.name.localeCompare(b.name))
const covers = o => (o.media.places_covered || []).map(x => String(x).replace(/^place:/, ''))
const mdLink = (ctx, t, u) => `[${ctx.md.cell(String(t))}](${u})`

// the place's own outlets, then those that cover an area above it (chain: the place, its parent, the region, the country)
export function localMedia(ctx, p, chain) {
    const all = outlets(ctx), own = all.filter(o => covers(o).includes(p.id))
    const row = o => ({ id: o.id, name: o.name, outlet_kind: o.media.outlet_kind, website: okUrl(o.media.website) ? o.media.website : null, page: `https://promptugal.news/media/${o.id}/` })
    return { own: own.map(row), wider: all.filter(o => !own.includes(o) && covers(o).some(id => chain.includes(id))).map(row) }
}
export function mediaBlock(ctx, p, rel, chain) {
    const { own, wider } = localMedia(ctx, p, chain), c = C(ctx)
    if (!own.length && !wider.length) return ''
    const li = o => `- ${mdLink(ctx, o.name, ctx.link(rel, `media/${o.id}/index.html`))} · ${ctx.md.cell(o.outlet_kind.replace(/-/g, ' '))}${o.website ? ` · ${mdLink(ctx, 'site', o.website)}` : ''}`
    // dev@ (review, 16 Nov): no empty list when the place has only wider-area outlets; the wider ones under their own label
    return `{.mini-h}\n${c.block_h}\n\n${c.block_intro}\n\n` + (own.length ? `{.bp-media}\n${own.map(li).join('\n')}\n\n` : '') +
        (wider.length ? `${c.block_wider}:\n\n{.bp-media}\n${wider.map(li).join('\n')}\n\n` : '')
}

function outletPage(ctx, o) {
    const rel = `media/${o.id}/index.html`, m = o.media, c = C(ctx), cell = ctx.md.cell
    const places = covers(o).map(id => { const pl = ctx.store.get ? ctx.store.get(`place:${id}`) : null; return cell(pl?.name || id) }).join(', ')
    const rows = [[c.facts_kind, cell(m.outlet_kind.replace(/-/g, ' '))], [c.facts_covers, places], m.language && [c.facts_lang, m.language.map(cell).join(', ')],
        okUrl(m.website) && [c.facts_site, `[${cell(m.website)}](${m.website})`], m.owner && m.owner.name && [c.facts_owner, cell(m.owner.name)]].filter(Boolean)
    const src = s => `${mdLink(ctx, s.url, s.url)}, read ${day(s.read_at)}${s.how ? `: ${cell(s.how)}` : ''}`
    const md = `{.facts}\n| | |\n|---|---|\n${rows.map(r => `| **${r[0]}** | ${r[1]} |`).join('\n')}\n\n` +
        ((m.feeds || []).filter(f => okUrl(f.url)).length ? `## ${c.feeds_h} {#feeds}\n\n${m.feeds.filter(f => okUrl(f.url)).map(f => `- ${mdLink(ctx, f.url, f.url)} (${cell(f.format)}${f.scope ? `, ${cell(f.scope)}` : ''})${f.source ? ` · read ${day(f.source.read_at)}` : ''}`).join('\n')}\n\n` : '') +
        (m.contact && okUrl(m.contact.page) ? `## ${c.contact_h} {#contact}\n\n${c.contact_note}\n\n- ${mdLink(ctx, m.contact.page, m.contact.page)}${m.contact.source ? ` · read ${day(m.contact.source.read_at)}` : ''}\n\n` : '') +
        ((m.people || []).length ? `## ${c.people_h} {#people}\n\n${m.people.map(x => `- ${cell(x.name)}${x.role ? `, ${cell(x.role)}` : ''}${x.beat ? ` (${cell(x.beat)})` : ''}${x.source && okUrl(x.source.url) ? ` · ${mdLink(ctx, 'source', x.source.url)}` : ''}`).join('\n')}\n\n` : '') +
        `## ${c.sources_h} {#sources}\n\n{.sources}\n${(m.sources || []).filter(s => okUrl(s.url)).map(s => `- ${src(s)}`).join('\n')}\n\n[${c.all}](../index.md)`
    const dates = [...(m.sources || []), ...(m.feeds || []).map(f => f.source).filter(Boolean)].map(s => day(s.read_at)).sort()
    return { src: `data/organisations/${o.id}/organisation.json`, rel, type: 'organisation', date: dates.pop() || ctx.TODAY,
        crumbs: [['media/index.html', c.index_title], [null, o.name]], title: o.name,
        summary: `${cell(m.outlet_kind.replace(/-/g, ' '))} covering ${places}. Its own site, feed and contact page, with the date we read each.`, md }
}

export function pages(ctx) {
    const os = outlets(ctx), c = C(ctx), rel = 'media/index.html'
    return [{ src: 'data/organisations/', rel, type: 'site', date: ctx.TODAY, title: c.index_title, summary: c.index_summary, crumbs: [[null, c.index_title]],
        md: `${c.index_intro}\n\n` + (os.length ? `{.rows .links-cols}\n${os.map(o => `- ${mdLink(ctx, o.name, ctx.link(rel, `media/${o.id}/index.html`))}`).join('\n')}` : c.index_empty) },
    ...os.map(o => outletPage(ctx, o))]
}

export const searchDocs = ctx => outlets(ctx).map(o => ({ id: `media:${o.id}`, url: `media/${o.id}/index.html`, title: o.name, type: 'organisation', date: ctx.TODAY, text: `${o.name} ${o.media.outlet_kind} ${covers(o).join(' ')}` }))
