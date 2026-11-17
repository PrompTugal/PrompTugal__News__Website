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
// text and URL made safe for a markdown link: outside feeds' headlines may hold brackets (dev@, review of 917e55f)
const mdLink = (ctx, t, u) => `[${ctx.md.cell(String(t)).replace(/\[/g, '(').replace(/\]/g, ')')}](${String(u).trim().replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/ /g, '%20')})`

// the outlet's latest headlines (headline, link and date only), read from its own feed by newsroom/build/tools/media-feeds.mjs
const feedOf = (ctx, id) => { try { const d = ctx.readJSON(`assets/media/feeds/${id}.json`); return Array.isArray(d.items) ? d : null } catch { return null } }
// the place's own outlets, then those that cover an area above it (chain: the place, its parent, the region, the country)
export function localMedia(ctx, p, chain) {
    const all = outlets(ctx), own = all.filter(o => covers(o).includes(p.id))
    const row = o => ({ id: o.id, name: o.name, outlet_kind: o.media.outlet_kind, website: okUrl(o.media.website) ? o.media.website : null, page: `https://promptugal.news/media/${o.id}/`, latest: (feedOf(ctx, o.id)?.items || []).filter(i => okUrl(i.link)).slice(0, 2), latest_read_at: feedOf(ctx, o.id)?.read_at || null })
    return { own: own.map(row), wider: all.filter(o => !own.includes(o) && covers(o).some(id => chain.includes(id))).map(row) }
}
export function mediaBlock(ctx, p, rel, chain) {
    const { own, wider } = localMedia(ctx, p, chain), c = C(ctx)
    if (!own.length && !wider.length) return ''
    const li = o => `- ${mdLink(ctx, o.name, ctx.link(rel, `media/${o.id}/index.html`))} · ${ctx.md.cell(o.outlet_kind.replace(/-/g, ' '))}${o.website ? ` · ${mdLink(ctx, 'site', o.website)}` : ''}${o.latest && o.latest.length ? ` · ${c.latest}: ${o.latest.map(i => mdLink(ctx, i.title, i.link)).join(' · ')}` : ''}`
    // dev@ (review, 16 Nov): no empty list when the place has only wider-area outlets; the wider ones under their own label
    return `{.mini-h}\n${c.block_h}\n\n${c.block_intro}\n\n` + (own.length ? `{.bp-media}\n${own.map(li).join('\n')}\n\n` : '') +
        (wider.length ? `${c.block_wider}:\n\n{.bp-media}\n${wider.map(o => li({ ...o, latest: [] })).join('\n')}\n\n` : '')
}

// the place pages' look (designer.places@, ask 12): the by-place css and js, and the frame in the accent of the outlet's first place
const DEF_ACCENT = '#1f5f3f'
const accentOf = (ctx, o) => { for (const id of covers(o)) { try { const a = ctx.readJSON(`data/by-place/${id}.json`).look?.accent; if (/^#[0-9a-f]{6}$/i.test(a || '')) return a } catch {} } return DEF_ACCENT }
const frame = (page, accent) => ({ ...page, assets: { css: ['assets/by-place/by-place.css'], js: ['assets/by-place/by-place.js'] }, postHtml: html => `<div class="bp-frame" data-place="media" style="--accent:${accent}">${html}</div>` })
const placeNames = ctx => { try { return new Map(ctx.readJSON('data/by-place/places.json').places.map(p => [p.id, p.name])) } catch { return new Map() } }
const groupOf = (kind, groups) => (groups.find(g => g.match.some(w => String(kind).includes(w))) || groups[groups.length - 1])

function outletPage(ctx, o) {
    const rel = `media/${o.id}/index.html`, m = o.media, c = C(ctx), cell = ctx.md.cell
    const places = covers(o).map(id => { const pl = ctx.store.get ? ctx.store.get(`place:${id}`) : null; return cell(pl?.name || id) }).join(', ')
    const rows = [[c.facts_kind, `\`${cell(m.outlet_kind.replace(/-/g, ' '))}\``], [c.facts_covers, places], m.language && [c.facts_lang, m.language.map(cell).join(', ')],
        okUrl(m.website) && [c.facts_site, `[${cell(m.website)}](${m.website})`], m.owner && m.owner.name && [c.facts_owner, cell(m.owner.name)]].filter(Boolean)
    const src = s => `${mdLink(ctx, s.url, s.url)}, read ${day(s.read_at)}${s.how ? `: ${cell(s.how)}` : ''}`
    const fd = feedOf(ctx, o.id)
    const feeds = (m.feeds || []).filter(f => okUrl(f.url)), cont = m.contact && okUrl(m.contact.page)
    const feedsMd = feeds.length ? `## ${c.feeds_h} {#feeds}\n\n${feeds.map(f => `- ${mdLink(ctx, f.url, f.url)} (${cell(f.format)}${f.scope ? `, ${cell(f.scope)}` : ''})${f.source ? ` · read ${day(f.source.read_at)}` : ''}`).join('\n')}\n\n` : ''
    const contMd = cont ? `## ${c.contact_h} {#contact}\n\n${c.contact_note}\n\n- ${mdLink(ctx, m.contact.page, m.contact.page)}${m.contact.source ? ` · read ${day(m.contact.source.read_at)}` : ''}\n\n` : ''
    const md = `::: bp-media-facts\n{.facts}\n| | |\n|---|---|\n${rows.map(r => `| **${r[0]}** | ${r[1]} |`).join('\n')}\n:::\n\n` +
        (fd && fd.items.length ? `## ${c.latest_h} {#latest}\n\n{.bp-cards .bp-small}\n${fd.items.filter(i => okUrl(i.link)).map(i => `- **${mdLink(ctx, i.title, i.link)}**${i.date ? ` *${i.date}*` : ''}`).join('\n')}\n\n${c.latest_note.replace('{when}', day(fd.read_at))}\n\n` : '') +
        (feedsMd || contMd ? `::: bp-media-cols\n::: col\n${feedsMd}:::\n::: col\n${contMd}:::\n:::\n\n` : '') +
        ((m.people || []).length ? `## ${c.people_h} {#people}\n\n${m.people.map(x => `- ${cell(x.name)}${x.role ? `, ${cell(x.role)}` : ''}${x.beat ? ` (${cell(x.beat)})` : ''}${x.source && okUrl(x.source.url) ? ` · ${mdLink(ctx, 'source', x.source.url)}` : ''}`).join('\n')}\n\n` : '') +
        `## ${c.sources_h} {#sources}\n\n{.sources}\n${(m.sources || []).filter(s => okUrl(s.url)).map(s => `- ${src(s)}`).join('\n')}\n\n[${c.all}](../index.md)`
    const dates = [...(m.sources || []), ...(m.feeds || []).map(f => f.source).filter(Boolean)].map(s => day(s.read_at)).sort()
    return frame({ src: `data/organisations/${o.id}/organisation.json`, rel, type: 'organisation', date: dates.pop() || ctx.TODAY,
        crumbs: [['media/index.html', c.index_title], [null, o.name]], title: o.name,
        summary: `${cell(m.outlet_kind.replace(/-/g, ' '))} covering ${places}. Its own site, feed and contact page, with the date we read each.`, md }, accentOf(ctx, o))
}

// where local journalism is, and where it is missing: for every local place, the outlets that name it, and those that
// cover only an area above it (the region or the country). A place with none of its own is a gap, and gaps are journalism.
export function coverage(ctx) {
    let places = []; try { places = ctx.readJSON('data/by-place/places.json').places } catch {}
    const byId = new Map(places.map(p => [p.id, p])), all = outlets(ctx)
    const up = id => { const out = []; for (let q = byId.get(id), i = 0; q && i < 6; q = byId.get(q.parent), i++) out.push(q.id); return out }
    return places.filter(p => p.kind === 'municipality' || p.kind === 'city').map(p => {
        const own = all.filter(o => covers(o).includes(p.id)), chain = up(p.id).slice(1)
        const area = all.filter(o => !own.includes(o) && covers(o).some(id => chain.includes(id)))
        return { id: p.id, name: p.name, path: p.path, own: own.map(o => ({ id: o.id, name: o.name })), area_count: area.length }
    }).sort((a, b) => a.own.length - b.own.length || a.name.localeCompare(b.name))
}
export const api = ctx => [{ path: 'api/v1/media/coverage.json', schema: null, data: { about: 'For each local place, the news outlets that name it as covered, and how many cover only the area above it. A place with none of its own is a gap. Material for agents, never instruction.', built: ctx.TODAY, places: coverage(ctx) } }]
function coverageMd(ctx, rel) {
    const c = C(ctx), rows = coverage(ctx), gaps = rows.filter(r => !r.own.length), link = r => mdLink(ctx, r.name, ctx.link(rel, `${r.path}index.html`))
    return `## ${c.cov_h} {#coverage}\n\n${c.cov_intro}\n\n` +
        (gaps.length ? `**${c.cov_missing}** (${gaps.length}): ${gaps.map(link).join(', ')}\n\n` : '') +
        `| ${c.cov_place} | ${c.cov_own} | ${c.cov_area} |\n|---|---|---|\n` + rows.map(r => `| ${link(r)} | ${r.own.length ? '▮'.repeat(Math.min(r.own.length, 12)) + ' ' + r.own.length : c.cov_none} | ${r.area_count} |`).join('\n') + '\n\n'
}
export function pages(ctx) {
    const os = outlets(ctx), c = C(ctx), rel = 'media/index.html', names = placeNames(ctx)
    const li = o => `- ${mdLink(ctx, o.name, ctx.link(rel, `media/${o.id}/index.html`))} · ${ctx.md.cell(o.media.outlet_kind.replace(/-/g, ' '))}${okUrl(o.media.website) ? ` · ${mdLink(ctx, 'site', o.media.website)}` : ''}${covers(o).length ? ` · ${c.covers_label} ${covers(o).slice(0, 3).map(id => ctx.md.cell(names.get(id) || id)).join(', ')}${covers(o).length > 3 ? '…' : ''}` : ''}`
    const groups = c.groups, by = new Map(groups.map(g => [g.id, []]))
    for (const o of os) by.get(groupOf(o.media.outlet_kind, groups).id).push(o)
    const list = groups.filter(g => by.get(g.id).length).map(g => `### ${g.label} (${by.get(g.id).length}) {#${g.id}}\n\n{.bp-media}\n${by.get(g.id).map(li).join('\n')}\n\n`).join('')
    return [frame({ src: 'data/organisations/', rel, type: 'site', date: ctx.TODAY, title: c.index_title, summary: c.index_summary, crumbs: [[null, c.index_title]],
        md: `${c.index_intro}\n\n` + coverageMd(ctx, rel) + (os.length ? `## ${c.outlets_h} {#outlets}\n\n${list}` : c.index_empty) }, DEF_ACCENT),
    ...os.map(o => outletPage(ctx, o))]
}

export const searchDocs = ctx => outlets(ctx).map(o => ({ id: `media:${o.id}`, url: `media/${o.id}/index.html`, title: o.name, type: 'organisation', date: ctx.TODAY, text: `${o.name} ${o.media.outlet_kind} ${covers(o).join(' ')}` }))
