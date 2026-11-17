// PrompTugal.news by place (Dinis's brief, 14 November 2026: board/guidance/2026-11-14-promptugal-by-place.md).
// One publication, three levels of place. The list is data/by-place/places.json; each place's research is
// data/by-place/<id>.json, written by its own agent (place.<id>@PrompTugal.dinis). This feature makes the region's page
// (algarve/) and one page per town (algarve/<town>/). Each page is a lens: local AI news big, wider news smaller.
// The Portugal level is the existing portugal/ page, which links here. Built by conductor@PrompTugal.dinis at Dinis's
// word (15 Nov 2026, for his meeting with Algarve Evolution); dev@ owns it from here.
export const order = 69
import { checkSites } from '../../../board/abp/tools/site-identity.mjs'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import crypto from 'node:crypto'

const LIST = 'data/by-place/places.json'
const DEF_ACCENT = '#1f5f3f'

const arr = v => Array.isArray(v) ? v : []
const okUrl = u => typeof u === 'string' && /^https?:\/\/[^\s]+$/i.test(u.trim())
// a URL safe inside a markdown link: http(s) only, no spaces or bare parentheses (they would end the link)
const url = u => okUrl(u) ? u.trim().replace(/\(/g, '%28').replace(/\)/g, '%29') : ''

import { mediaBlock, localMedia } from './media.mjs'
import { placeFeed } from '../lib/feeds.mjs'
import { nearbyOf } from './datasci-places.mjs'
function load(ctx) {
    const raw = ctx.readJSON(LIST)
    const byId = new Map()
    for (const p of raw.places) {
        const f = `data/by-place/${p.id}.json`
        let d = {}, broken = false
        // nineteen agents write these files tonight: one bad file must not stop the build of the other 866 pages
        try { d = ctx.exists(f) ? ctx.readJSON(f) : {} } catch { broken = true }
        if (!d || typeof d !== 'object' || Array.isArray(d)) { d = {}; broken = true }
        const clean = {
            ...d,
            ai_news: arr(d.ai_news).filter(a => a && a.title && okUrl(a.url)).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))),
            ai_map: arr(d.ai_map).filter(m => m && m.name),
            sources: arr(d.sources).filter(s => s && s.name && okUrl(s.url)),
            events: arr(d.events).filter(e => e && e.title && okUrl(e.url)),
            extras: arr(d.extras).filter(x => x && x.label && x.value),
            gaps: arr(d.gaps).filter(g => typeof g === 'string' && g.trim()),
            ...Object.fromEntries(['start_company', 'investors', 'talent', 'contacts'].map(k => [k, arr(d[k]).filter(x => x && x.name)])),
        }
        if (!/^#[0-9a-f]{6}$/i.test((d.look && d.look.accent) || '')) clean.look = { ...(d.look || {}), accent: undefined }
        byId.set(p.id, { ...clean, id: p.id, name: p.name, kind: p.kind, parent: p.parent, path: p.path, agent: p.agent, at: p.at, label: p.label, mandate: d.mandate || p.name, _broken: broken })
    }
    return { list: raw.places.map(p => byId.get(p.id)), byId, copy: raw.copy || {} }
}

const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
const dmy = s => (s && /^\d{4}-\d{2}-\d{2}/.test(s)) ? s.slice(0, 10) : (s || '')
const isLocalPlace = p => p.kind === 'municipality' || p.kind === 'city'
// the Algarve's towns (parent algarve, or a city inside one of them) for the region page, its map and its counts; every
// local place, the district capitals under portugal included (place.districts@), still gets its own page
const inAlgarve = (L, p) => { for (let q = p, i = 0; q && i < 5; q = L.byId.get(q.parent), i++) if (q.parent === 'algarve') return true; return false }
const towns = (L) => L.list.filter(p => isLocalPlace(p) && inAlgarve(L, p))
const pagePlaces = (L) => L.list.filter(isLocalPlace)
const W = (L, key, vars = {}) => String(L.copy[key] || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
const n = (k, one, many) => `${k} ${k === 1 ? one : (many || one + 's')}`

function esc(ctx, s) { return ctx.md.cell(String(s ?? '')) }

function newsCards(ctx, items, cls) {
    if (!items || !items.length) return ''
    return `{.bp-cards${cls ? ' .' + cls : ''}}\n` + items.map(a =>
        `- ${a._town ? `\`${esc(ctx, a._town)}\` ` : ''}**[${esc(ctx, a.title)}](${url(a.url)})**${a.summary ? ` ${esc(ctx, a.summary)}` : ''} *${esc(ctx, [a.publisher || host(a.url), dmy(a.date)].filter(Boolean).join(', '))}${a.ai_path ? ` · AI path${typeof a.steps === 'number' ? ` (${a.steps === 0 ? 'direct' : n(a.steps, 'step')})` : ''}: ${esc(ctx, String(a.ai_path).replace(/\.$/, ''))}` : ''}*`
    ).join('\n')
}

function mapRows(ctx, items, withPlace) {
    if (!items || !items.length) return ''
    const order = ['startup', 'company', 'institution', 'organisation', 'community', 'public body', 'investor']
    const rank = t => { const i = order.indexOf(t); return i < 0 ? order.length : i }
    const sorted = [...items].sort((a, b) => (rank(a.type) - rank(b.type)) || String(a.name).localeCompare(String(b.name)))
    return `{.bp-map${sorted.length > 12 ? ' .bp-long' : ''}}\n| Who | What | AI path | Source |\n|---|---|---|---|\n` + sorted.map(m =>
        `| ${url(m.url) ? `[${esc(ctx, m.name)}](${url(m.url)})` : esc(ctx, m.name)}${withPlace && m._place ? ` *${esc(ctx, m._place)}*` : ''} | ${esc(ctx, [m.type, m.what].filter(Boolean).join(': '))} | ${esc(ctx, m.ai_path || '')}${typeof m.steps === 'number' ? ` (${m.steps === 0 ? 'direct' : n(m.steps, 'step')})` : ''} | ${url(m.source_url) ? `[${esc(ctx, host(m.source_url))}](${url(m.source_url)})` : ''}${m.read_on ? `, read ${esc(ctx, dmy(m.read_on))}` : ''} |`
    ).join('\n')
}

function voiceBlock(std, voice) {
    if (!voice) return `${std}\n`
    return `::: bp-std\n${std}\n:::\n::: bp-voice\n${voice}\n:::\n`
}

const statusWord = (L, st) => W(L, `status_${['live', 'researching'].includes(st) ? st : 'stub'}`)

// the place's picture (look.photo, designer.places@'s ask 8): a band with its credit, nothing when absent or missing
function photoBand(ctx, L, p, rel) {
    const ph = p.look && p.look.photo
    if (!ph || !ph.file || !/^assets\/by-place\/photos\/[a-z0-9._-]+\.(jpe?g|png|webp)$/.test(ph.file) || !ctx.exists(ph.file)) return ''
    const credit = [ph.author && esc(ctx, ph.author), ph.licence && (okUrl(ph.licence_url) ? `[${esc(ctx, ph.licence)}](${url(ph.licence_url)})` : esc(ctx, ph.licence)), okUrl(ph.source) ? `[${esc(ctx, W(L, 'photo_source'))}](${url(ph.source)})` : ''].filter(Boolean).join(' · ')
    return `\n::: bp-photo\n![${esc(ctx, ph.alt || p.name)}](${ctx.link(rel, ph.file)})\n\n{.bp-photo-credit}\n${credit}\n:::\n`
}

function mast(ctx, L, p, parentName) {
    const v = p.voice || {}
    return `::: bp-mast\n{.bp-kicker}\nPrompTugal.news · ${esc(ctx, p.name)}${p.look && p.look.landmark ? ` · ${esc(ctx, p.look.landmark)}` : ''}\n\n` +
        voiceBlock(`{.bp-mandate}\n${esc(ctx, p.mandate)}`, v.mandate ? `{.bp-mandate}\n${v.lede ? esc(ctx, v.lede) + ' ' : ''}${esc(ctx, v.mandate)}` : null) +
        (p._broken ? `\n{.bp-empty}\n${W(L, 'map_unreadable')}\n` : '') +
        `\n{.bp-meta}\n${statusWord(L, p.status)} · updated ${esc(ctx, dmy(p.updated))} by \`${esc(ctx, p.agent)}\`${p.identity && p.identity.key_id ? ` · site identity \`${esc(ctx, p.identity.key_id)}\`` : ''}${parentName ? ` · part of ${parentName}` : ''}\n:::\n`
}

// each site's identity (abp@'s check, board/abp/tools/site-identity.mjs): its key, the signature over its file
let IDS = null
const identityOf = (ctx, id) => { if (!IDS) { try { IDS = new Map(checkSites(ctx.ROOT).map(r => [r.id, r])) } catch { IDS = new Map() } } return IDS.get(id) }
function identityNote(ctx, L, p) {
    const r = p && identityOf(ctx, p.id)
    if (!r) return ''
    const keys = ctx.readJSON('board/keys.json').keys || []
    const k = keys.find(x => x.id === r.site_key), fp = k && k.bundle && k.bundle.signing_fingerprint
    return '\n\n{.bp-note .bp-id}\n' + W(L, `identity_${['valid', 'invalid', 'missing', 'wrong-key'].includes(r.signature) ? r.signature.replace('-', '_') : 'other'}`, {
        name: p.name, key: r.site_key ? `\`${r.site_key}\`` : W(L, 'identity_nokey'), fp: fp ? `\`${fp}\`` : '', agent: `\`${r.agent}\``,
        keys: ctx.link(`${p.path}index.html`, 'board/keys.json'), file: `data/by-place/${p.id}.json`,
    })
}

function testNote(ctx, L, rel, p) {
    return `## How this page is made {#how}

{.bp-note}
${W(L, 'test_note', { graph: ctx.link(rel, 'graph/index.html'), region: ctx.link(rel, `${(L.byId.get('algarve') || { path: 'algarve/' }).path}index.html`) })}${identityNote(ctx, L, p)}\n\n{.bp-note .bp-id}\n${W(L, 'talk_note', { talk: ctx.link(rel, 'talk/index.html') })}${p ? `\n\n{.bp-note .bp-id}\n${W(L, 'json_note', { json: ctx.link(rel, `api/v1/by-place/${p.id}.json`), index: ctx.link(rel, 'api/v1/by-place/index.json') })}` : ''}`
}

// our own articles about a place: front matter town: <id>, or region: <id> (the brief's tags for the place agents' articles)
function tagged(ctx, test) {
    return ctx.content.filter(c => c.rel.startsWith('articles/') && c.meta && c.meta.date && c.meta.status !== 'draft' && test(c.meta))
        .sort((a, b) => String(b.meta.date).localeCompare(String(a.meta.date)))
}
const articleList = (ctx, rel, list) => `{.bp-latest}\n${list.map(c => `- [${esc(ctx, c.meta.title)}](${ctx.link(rel, c.rel)}) · ${esc(ctx, dmy(String(c.meta.date)))}`).join('\n')}\n\n`

function gravityBlock(ctx, L, p) {
    const v = p.voice || {}, srcs = arr(p.gravity && p.gravity.sources).filter(s => okUrl(s && s.url))
    return `## The centre of gravity {#gravity}\n\n` + (p.gravity && p.gravity.text ? voiceBlock(esc(ctx, p.gravity.text) + (srcs.length ? `\n\n{.bp-src}\nSources: ${srcs.map(s => `[${esc(ctx, s.title || host(s.url))}](${url(s.url)})`).join(', ')}.` : ''), v.gravity ? esc(ctx, v.gravity) : null) : `{.bp-empty}\n${W(L, 'gravity_empty', { name: p.name })}\n`) + '\n'
}

// a list of named entries (starting a company, investors, talent, contacts), each linked and sourced
function entries(ctx, items, cls, extra) {
    return `{.bp-entries${cls ? ' .' + cls : ''}}\n` + items.map(x => `- ${url(x.url) ? `[${esc(ctx, x.name)}](${url(x.url)})` : `**${esc(ctx, x.name)}**`}${extra ? extra(x) : ''}${x.what ? ` ${esc(ctx, x.what)}` : ''} *${url(x.source_url) ? `[${esc(ctx, host(x.source_url))}](${url(x.source_url)})` : ''}${x.read_on ? `, read ${esc(ctx, dmy(x.read_on))}` : ''}*`).join('\n') + '\n\n'
}

// Now in <town> (Dinis, 16 Nov: the storm's local data, refreshed): data/by-place/now/<id>.json, written by
// board/tools/local-now.mjs from IPMA and adsb.lol; every line links its source and says when it was read
function nowBlock(ctx, p) {
    let d; try { d = ctx.readJSON(`data/by-place/now/${p.id}.json`) } catch { return '' }
    const t = s => String(s || '').slice(11, 16) + ' UTC', out = []
    const r = d.station && d.station.reading
    if (r) out.push(`- **Now** ${r.temp_c ?? '?'} °C · humidity ${r.humidity_pct ?? '?'}% · wind ${r.wind_kmh ?? '?'} km/h *[${esc(ctx, d.station.name)}](${d.station.page || d.station.source}), ${d.station.km} km, ${t(r.at)}*`)
    const f = d.forecast && d.forecast.days && d.forecast.days[0]
    if (f) out.push(`- **Today** ${f.t_min_c ?? '?'} to ${f.t_max_c ?? '?'} °C · rain ${f.rain_prob_pct ?? '?'}% *[IPMA, ${esc(ctx, d.forecast.place)}](${d.forecast.page || d.forecast.source})${d.forecast.km > 5 ? `, ${d.forecast.km} km` : ''}*`)
    const w = d.warnings && d.warnings.active || []
    out.push(w.length ? w.map(x => `- **Warning** ${esc(ctx, String(x.level).replace(/^./, c => c.toUpperCase()))}: ${esc(ctx, x.type)} from ${esc(ctx, String(x.start).slice(0, 16).replace('T', ' '))} *[IPMA](${d.warnings.page || d.warnings.source})*`).join('\n') : `- **Warnings** none *[IPMA](${d.warnings.page || d.warnings.source})*`)
    const fr = d.fire_risk && d.fire_risk.days && d.fire_risk.days[0]
    if (fr) out.push(`- **Fire risk** ${esc(ctx, fr.level)} *[IPMA](${d.fire_risk.page || d.fire_risk.source})*`)
    if (d.sea) out.push(`- **Sea** waves ${d.sea.waves_max_m ?? '?'} m · ${d.sea.sea_temp_max_c ?? '?'} °C *[IPMA, ${esc(ctx, d.sea.coast)}](${d.sea.page || d.sea.source})*`)
    if (d.airport) out.push(`- **Faro airport** ${d.airport.airline.length} airline, ${d.airport.other_aircraft} other, ${d.airport.within_nm} nm${d.airport.airline.length ? ` (${d.airport.airline.slice(0, 6).map(a => esc(ctx, a.callsign)).join(', ')})` : ''} *[adsb.lol](${d.airport.page || d.airport.source}), ${d.airport.stale ? 'last read ' : ''}${t(d.airport.at)}*`)   // stale: the collector kept the last read (dev@, 17 Nov)
    return `{.mini-h}\nNow in ${esc(ctx, p.name)}\n\n{.bp-now}\n${out.join('\n')}\n\n`
}

function sideCol(ctx, L, p, rel, inside) {
    const v = p.voice || {}
    let md = ''
    if (inside.length) md += `{.mini-h}\nInside ${esc(ctx, p.name)}\n\n${inside.map(x => `- [${esc(ctx, x.name)}](${ctx.link(rel, `${x.path}index.html`)})`).join('\n')}\n\n`
    md += mediaBlock(ctx, p, rel, [p.id, p.parent, 'algarve', 'portugal'].filter(Boolean))
    md += `{.mini-h}\nEvents\n\n` + (p.events.length ? `{.bp-events}\n${p.events.map(e => `- [${esc(ctx, e.title)}](${url(e.url)})${e.date ? ` · ${esc(ctx, e.date)}` : ''}${typeof e.ai_path === 'string' && e.ai_path ? ` · AI path: ${esc(ctx, e.ai_path)}` : ''}`).join('\n')}` : `{.bp-empty}\nNone found yet.`) + '\n\n'
    if (p.kind !== 'country' && !nowBlock(ctx, p)) md += `{.mini-h}\nWeather\n\n${W(L, 'weather', { name: p.name })}\n\n`
    if (p.extras.length) md += `{.mini-h}\nIn figures\n\n{.bp-extras}\n${p.extras.map(x => `- **${esc(ctx, x.label)}:** ${esc(ctx, x.value)}${url(x.source_url) ? ` ([source](${url(x.source_url)}))` : ''}`).join('\n')}\n\n`
    if (p.start_company.length) md += `{.mini-h}\n${W(L, 'start_h', { name: esc(ctx, p.name) })}\n\n` + entries(ctx, p.start_company, '', x => x.kind ? ` \`${esc(ctx, x.kind)}\`` : '')
    if (p.contacts.length) md += `{.mini-h}\n${W(L, 'contacts_h')}\n\n` + entries(ctx, p.contacts, '', x => x.channel ? `: ${esc(ctx, x.channel)}${/[.!?:]$/.test(x.channel.trim()) || !x.what ? '' : '.'}` : '')
    md += `{.mini-h}\nSources we read\n\n` + (p.sources.length ? `{.bp-sources}\n${p.sources.map(s => `- [${esc(ctx, s.name)}](${url(s.url)})${s.kind ? ` · ${esc(ctx, s.kind)}` : ''}${okUrl(s.feed) ? ` · [feed](${url(s.feed)})` : ''}`).join('\n')}` : `{.bp-empty}\nBeing listed.`) + '\n\n'
    md += `{.mini-h}\nGaps\n\n` + voiceBlock((p.gaps.length ? `{.bp-gaps}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}` : 'None recorded.'), v.gaps_intro ? `{.bp-gaps}\n- ${esc(ctx, v.gaps_intro)}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}` : null) + '\n'
    return md
}

// "Around <town>" (Dinis, 16 Nov; board/briefs/2026-11-16-blast-radius.md): the neighbours' stories that reach this place,
// nearest first, from datasci-places' nearby rule. Words: assets/by-place/around.json. The same list is in the place's JSON.
let AROUND = null
const aroundW = ctx => AROUND || (AROUND = ctx.readJSON('assets/by-place/around.json'))
function aroundItems(ctx, p, skipUrls) {
    let d; try { d = nearbyOf(ctx, p.id) } catch { return [] }
    return ((d && d.items) || []).filter(i => i.shown && i.from !== p.id && url(i.url) && !skipUrls.includes(i.url)).sort((a, b) => (b.adjacent - a.adjacent) || ((a.km ?? 999) - (b.km ?? 999))).slice(0, 5)
        .map(i => ({ title: i.title, url: i.url, publisher: i.publisher || null, date: i.date || null, from: i.from, from_name: i.from_name, km: i.km, distance: i.distance, adjacent: !!i.adjacent, why: i.why }))
}
function aroundBlock(ctx, p, items) {
    const w = aroundW(ctx)
    if (!items.length) return ''
    return `## ${w.heading.replace('{name}', esc(ctx, p.name))} {#around}\n\n${w.intro}\n\n{.bp-cards .bp-small}\n` +
        items.map(i => `- \`${esc(ctx, i.distance)}\`${i.adjacent ? ` · ${w.next_door}` : ''} **[${esc(ctx, i.title)}](${url(i.url)})** *${esc(ctx, [i.publisher || host(i.url), dmy(i.date)].filter(Boolean).join(', '))}*`).join('\n') + '\n\n'
}

function townPage(ctx, L, p) {
    const rel = `${p.path}index.html`
    const parent = L.byId.get(p.parent)
    const region = L.byId.get('algarve')
    const parentLink = parent ? `[${esc(ctx, parent.name)}](${ctx.link(rel, `${parent.path}index.html`)})` : ''
    const inside = L.list.filter(x => x.parent === p.id)
    const local = p.ai_news
    const algarve = inAlgarve(L, p), wider = (algarve ? (region ? region.ai_news : []) : (L.byId.get('portugal') || { ai_news: [] }).ai_news).slice(0, 4)
    const ours = tagged(ctx, m => m.town === p.id || inside.some(x => m.town === x.id))
    const latest = tagged(ctx, m => !ours.some(o => o.meta === m)).slice(0, 4)
    let md = mast(ctx, L, p, parentLink) + photoBand(ctx, L, p, rel)
    { const nb = nowBlock(ctx, p); if (nb) md += `::: bp-nowband\n${nb}:::\n\n` }   // live, at the top (Dinis, 16 Nov: 'quite hidden')
    md += `\n::: cols-8-4\n::: col\n`
    md += gravityBlock(ctx, L, p)
    md += `## AI in ${esc(ctx, p.name)} {#local}\n\n` + (local.length ? newsCards(ctx, local, 'bp-big') : `{.bp-empty}\n${W(L, 'local_empty')}`) + '\n\n'
    const around = algarve && isLocalPlace(p) ? aroundItems(ctx, p, wider.map(a => a.url)) : []
    md += aroundBlock(ctx, p, around)
    if (ours.length) md += `## ${W(L, 'articles_h', { name: esc(ctx, p.name) })} {#ours}\n\n${articleList(ctx, rel, ours)}`
    if (wider.length) md += `## ${algarve ? 'From the Algarve' : 'From Portugal'} {#region}\n\n${newsCards(ctx, wider, 'bp-small')}\n\n`
    if (latest.length) md += `## ${W(L, 'national_h')} {#national}\n\n${articleList(ctx, rel, latest)}`
    md += `## The AI map {#map}\n\n${W(L, 'map_intro', { name: p.name })}\n\n` + (mapRows(ctx, p.ai_map) || `{.bp-empty}\nBeing mapped.`) + '\n\n'
    if (p.investors.length) md += `## ${W(L, 'investors_h')} {#investors}\n\n${W(L, 'investors_intro', { name: esc(ctx, p.name) })}\n\n` + entries(ctx, p.investors, 'bp-invest', x => [x.type && ` \`${esc(ctx, x.type)}\``, x.amount && ` **${esc(ctx, x.amount)}**`, x.date && ` (${esc(ctx, x.date)})`].filter(Boolean).join(''))
    if (p.talent.length) md += `## ${W(L, 'talent_h')} {#talent}\n\n${W(L, 'talent_intro')}\n\n` + entries(ctx, p.talent, 'bp-talent', x => x.role ? `, ${esc(ctx, x.role)}.` : '')
    md += `:::\n::: col\n` + (algarve && Array.isArray(p.at) ? `{.bp-svgmap .bp-locator}\n[${esc(ctx, W(L, 'locator_link'))}](${ctx.link(rel, `${L.byId.get('algarve').path}index.html`)})\n\n` : '') + sideCol(ctx, L, p, rel, inside)
    md += `:::\n:::\n\n` + testNote(ctx, L, rel, p)
    const accent = (p.look && p.look.accent) || DEF_ACCENT
    return {
        src: `data/by-place/${p.id}.json`, rel, type: 'place', layout: 'wide', date: dmy(p.updated) || ctx.TODAY,
        section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], ...(!algarve ? [] : p.parent === 'loule' ? [['algarve/index.html', 'The Algarve'], [`algarve/loule/index.html`, 'Loulé']] : [['algarve/index.html', 'The Algarve']]), [null, p.name]],
        title: `PrompTugal.news ${p.name}`,
        summary: W(L, 'town_summary', { name: p.name, local: n(local.length, 'local AI story', 'local AI stories'), map: n((p.ai_map || []).length, 'organisation') }),
        assets: { css: ['assets/by-place/by-place.css'], js: ['assets/by-place/by-place.js'] },
        postHtml: html => `<div class="bp-frame" data-place="${p.id}" style="--accent:${accent}">${html.replace(/<p class="bp-svgmap bp-locator">([\s\S]*?)<\/p>/, (m, link) => `<figure class="bp-svgmap bp-locator">${algarveSvg(ctx, L, rel, towns(L), p.id)}<figcaption>${link}</figcaption></figure>`)}</div>`,
        md,
    }
}

// The region's map, drawn at build time (no script): the coast and the border from assets/portugal/algarve-outline.json
// (Natural Earth, public domain), a dot per place at its seat (places.json "at"), in its own accent, linked to its site.
// A pin's href is .html, not ctx.link's .md: raw SVG is never rewritten by the markdown (Dinis, 16 Nov: the pins opened the twin).
// The markup is assets/by-place/region-map.tmpl; the words are places.json's copy.
const VIEW = { w: 1000, h: 470, lon0: -9.12, lon1: -7.30, lat0: 36.92, lat1: 37.62 }
let OUTLINE = null, TMPL = null
const fillT = (t, v) => t.replace(/\{\{(\w+)\}\}/g, (_, k) => v[k] ?? '')
const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
function algarveSvg(ctx, L, rel, T, focus) {
    if (!OUTLINE) { try { OUTLINE = ctx.readJSON('assets/portugal/algarve-outline.json') } catch { OUTLINE = { countries: {} } } }
    if (!TMPL) { loadTmpl(ctx) }
    const k = Math.cos(37.2 * Math.PI / 180)
    const sc = Math.min(VIEW.w / ((VIEW.lon1 - VIEW.lon0) * k), VIEW.h / (VIEW.lat1 - VIEW.lat0))
    const X = lon => ((lon - VIEW.lon0) * k * sc).toFixed(1), Y = lat => ((VIEW.lat1 - lat) * sc).toFixed(1)
    const h = Math.round((VIEW.lat1 - VIEW.lat0) * sc)
    const ring = r => 'M' + r.map(([lo, la]) => `${X(lo)},${Y(la)}`).join('L') + 'Z'
    const land = (name, cls) => (OUTLINE.countries[name] || []).map(poly => fillT(TMPL.land, { cls, d: poly.map(ring).join('') })).join('')
    const pins = T.filter(t => Array.isArray(t.at)).map(t => {
        const x = +X(t.at[0]), y = +Y(t.at[1])
        const r = 7 + Math.min(9, Math.sqrt(t.ai_map.length + t.ai_news.length) * 1.6), g = r + 6
        const side = t.label || 's'
        const [lx, ly, anchor] = side === 'n' ? [x, y - g, 'middle'] : side === 'e' ? [x + g, y + 5, 'start'] : side === 'w' ? [x - g, y + 5, 'end'] : side === 'sw' ? [x + 8, y + g + 12, 'end'] : [x, y + g + 12, 'middle']
        return fillT(TMPL.pin, {
            pincls: focus ? (t.id === focus ? ' focus' : ' dim') : '', href: (ctx.link(rel, `${t.path}index.html`)).replace(/\.md(#|$)/, '.html$1'), accent: (t.look && t.look.accent) || DEF_ACCENT, x, y, r: r.toFixed(1), cls: t.status === 'live' ? 'live' : 'ring',
            lx: lx.toFixed(1), ly: ly.toFixed(1), anchor, name: xmlEsc(t.name),
            title: xmlEsc(W(L, 'pin_title', { name: t.name, local: n(t.ai_news.length, 'local AI story', 'local AI stories'), map: t.ai_map.length })),
        })
    }).join('')
    return fillT(TMPL.frame, { w: VIEW.w, h, aria: xmlEsc(W(L, 'map_aria', { count: T.length })), land: land('Spain', 'es') + land('Portugal', 'pt'),
        seaX: X(-8.35), seaY: Y(36.97), sea: xmlEsc(W(L, 'sea_label')), esX: X(-7.38), esY: Y(37.55), spain: xmlEsc(W(L, 'spain_label')), pins })
}

function loadTmpl(ctx) {
    const parts = ctx.readText('assets/by-place/region-map.tmpl').split(/\n?<!-- ([\w-]+) -->\n/)
    TMPL = { frame: parts[0].trim() }
    for (let i = 1; i < parts.length; i += 2) TMPL[parts[i]] = parts[i + 1].trim()
}

// each town card in its own accent and its status, as a style block from the template
function townStyles(ctx, T) {
    if (!TMPL) loadTmpl(ctx)
    return T.map((t, i) => fillT(TMPL.card, { i: i + 1, accent: (t.look && t.look.accent) || DEF_ACCENT }) + (TMPL[`card-${t.status}`] ? fillT(TMPL[`card-${t.status}`], { i: i + 1 }) : '')).join('')
}

// what the region page computes from the towns' files, shared with its JSON (JSON first: nothing only in the HTML)
function regionAgg(L) {
    const p = L.byId.get('algarve'), T = towns(L), allMap = []
    for (const t of [p, ...T]) for (const m of t.ai_map) allMap.push({ ...m, _place: t.id === 'algarve' ? 'the region' : t.name, _place_id: t.id })
    const seen = new Set(), map = allMap.filter(m => { const k = m.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true })
    const localCount = T.reduce((s, t) => s + t.ai_news.length, 0)
    const latestLocal = T.flatMap(t => t.ai_news.map(a => ({ ...a, _town: t.name, _town_id: t.id }))).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8)
    return { map, localCount, latestLocal, live: T.filter(t => t.status === 'live').length, places: T.length }
}

function regionPage(ctx, L) {
    const p = L.byId.get('algarve'), rel = `${p.path}index.html`
    const T = towns(L)
    const { map, localCount, latestLocal } = regionAgg(L)
    let md = mast(ctx, L, p, `[Portugal](${ctx.link(rel, 'portugal/index.html')})`)
    { const nb = nowBlock(ctx, p); if (nb) md += `::: bp-nowband\n${nb}:::\n\n` }
    md += `\n{.bp-tiles}\n- **${T.length}** places in the first wave\n- **${localCount}** local AI stories\n- **${map.length}** on the AI map\n- **${T.filter(t => t.status === 'live').length}** places live\n\n`
    md += `## The map {#places}\n\n{.bp-lede}\n${W(L, 'region_map_lede')}\n\n{.bp-svgmap}\n${T.map(t => `[${esc(ctx, t.name)}](${ctx.link(rel, `${t.path}index.html`)})`).join(' · ')}\n\n`
    md += `## The towns {#towns}\n\n${W(L, 'towns_intro')}\n\n{.bp-towns}\n` +
        T.map(t => `- [**${esc(ctx, t.name)}**](${ctx.link(rel, `${t.path}index.html`)})${t.look && t.look.landmark ? ` *${esc(ctx, t.look.landmark)}*` : ''} \`${statusWord(L, t.status)}\` ${n(t.ai_news.length, 'story', 'stories')} · ${n(t.ai_map.length, 'on the map', 'on the map')}`).join('\n') + '\n\n'
    md += `::: cols-8-4\n::: col\n`
    md += `## The latest from the towns {#latest}\n\n` + (latestLocal.length ? newsCards(ctx, latestLocal, 'bp-big') : `{.bp-empty}\nThe towns' agents are starting their research.`) + '\n\n'
    if ((p.ai_news || []).length) md += `## Across the region {#region}\n\n${newsCards(ctx, p.ai_news.slice(0, 10), 'bp-small')}\n\n`
    const ours = tagged(ctx, m => m.region === 'algarve' || T.some(t => m.town === t.id))
    if (ours.length) md += `## ${W(L, 'articles_h', { name: 'the Algarve' })} {#ours}\n\n${articleList(ctx, rel, ours.slice(0, 10))}`
    md += `:::\n::: col\n`
    md += `{.mini-h}\nOne publication, three levels\n\n${W(L, 'levels', { portugal: ctx.link(rel, 'portugal/index.html'), count: T.length })}\n\n`
    md += `{.mini-h}\nThe first wave\n\n{.bp-status}\n| Place | Status | Stories | Map |\n|---|---|---|---|\n${T.map(t => `| [${esc(ctx, t.name)}](${ctx.link(rel, `${t.path}index.html`)}) | ${t.status || 'stub'} | ${(t.ai_news || []).length} | ${(t.ai_map || []).length} |`).join('\n')}\n\n`
    if ((p.sources || []).length) md += `{.mini-h}\nRegional sources\n\n{.bp-sources}\n${p.sources.map(s => `- [${esc(ctx, s.name)}](${url(s.url)})${okUrl(s.feed) ? ` · [feed](${url(s.feed)})` : ''}`).join('\n')}\n\n`
    if ((p.gaps || []).length) md += `{.mini-h}\nGaps\n\n{.bp-gaps}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}\n\n`
    md += `:::\n:::\n\n`
    md += `## The AI map of the Algarve {#map}\n\n${W(L, 'region_map_intro', { ae: ctx.link(rel, 'portugal/algarve-evolution/index.html') })}\n\n` + (mapRows(ctx, map, true) || `{.bp-empty}\nBeing mapped.`) + '\n\n'
    md += testNote(ctx, L, rel, p)
    return {
        src: LIST, rel, type: 'place', layout: 'wide', date: ctx.TODAY, section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], [null, 'The Algarve']],
        title: 'PrompTugal.news The Algarve',
        summary: W(L, 'region_summary', { count: T.length, local: n(localCount, 'local AI story', 'local AI stories'), map: n(map.length, 'organisation') }),
        assets: { css: ['assets/by-place/by-place.css'], js: ['assets/by-place/by-place.js'] },
        postHtml: html => {
            if (!TMPL) loadTmpl(ctx)
            const accOf = new Map(T.map(t => [t.name, (t.look && t.look.accent) || DEF_ACCENT]))
            html = html.replace(/<li><code>([^<]+)<\/code> /g, (m, name) => accOf.has(name.replace(/&amp;/g, '&')) ? fillT(TMPL['town-label'], { accent: accOf.get(name.replace(/&amp;/g, '&')), name }) : m)
            html = html.replace(/<p class="bp-svgmap">[\s\S]*?<\/p>/, () => `<figure class="bp-svgmap">${algarveSvg(ctx, L, rel, T)}</figure>`)
            html = `<style>${townStyles(ctx, T)}</style>` + html
            return `<div class="bp-frame bp-region" data-place="algarve" style="--accent:${(p.look && p.look.accent) || DEF_ACCENT}">${html}</div>`
        },
        md,
    }
}

// the translated pages (board/spec-translations.md, item 5; dev.places@'s part): each culture with a translation memory in
// data/i18n/tm/<culture>/ gets /<culture>/<path> for every place page, rendered from the same data with each string the
// memory holds replaced (its key: the first 16 hex of sha256 of the NFC, space-collapsed English, as translator@'s
// board/team/translator/tools/tm.mjs); a string not yet translated stays in English. The page notes the machine
// translation and links its English original.
const TM_DIR = 'data/i18n/tm'
const tmNorm = s => s.normalize('NFC').replace(/\r\n?/g, '\n').replace(/[ \t\u00a0]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
const tmKey = s => crypto.createHash('sha256').update(tmNorm(s)).digest('hex').slice(0, 16)
function memories(ctx) {
    const out = []
    let cultures = []; try { cultures = fs.readdirSync(ctx.R(TM_DIR)).filter(c => /^[a-z]{2}-[A-Z]{2}$/.test(c)).sort() } catch { return out }
    for (const c of cultures) {
        const m = new Map()
        for (const f of fs.readdirSync(ctx.R(`${TM_DIR}/${c}`)).filter(f => f.endsWith('.json'))) {
            try { for (const [k, v] of Object.entries(ctx.readJSON(`${TM_DIR}/${c}/${f}`))) if (v && typeof v.t === 'string' && v.t.trim()) m.set(k, v.t) } catch { }
        }
        if (m.size) out.push({ culture: c, m })
    }
    return out
}
function translateDeep(v, m, skip) {
    if (typeof v === 'string') { if (!v.trim() || /^https?:/.test(v)) return v; const t = m.get(tmKey(v)); return t || v }
    if (Array.isArray(v)) return v.map(x => translateDeep(x, m, skip))
    if (v && typeof v === 'object') { const o = {}; for (const [k, x] of Object.entries(v)) o[k] = skip.has(k) ? x : translateDeep(x, m, skip); return o }
    return v
}
const KEEP = new Set(['id', 'kind', 'parent', 'path', 'agent', 'status', 'updated', 'by', 'url', 'source_url', 'read_on', 'date', 'feed', 'accent', 'at', 'label', 'identity', 'name', 'publisher', 'type', 'steps', 'file', '$schema'])
function translatedL(L, culture, m) {
    const byId = new Map()
    for (const p of L.list) byId.set(p.id, { ...translateDeep(p, m, KEEP), path: p.kind === 'country' ? p.path : `${culture}/${p.path}`, _en: p.path, _culture: culture })
    return { list: L.list.map(p => byId.get(p.id)), byId, copy: translateDeep(L.copy, m, new Set()), culture }
}
function cultureNote(ctx, L, page, enRel) {
    return `{.bp-note .bp-i18n}\n${W(L, 'i18n_note', { culture: L.culture, original: ctx.link(page.rel, enRel) })}\n\n`
}
function translatedPages(ctx, L) {
    const out = []
    for (const { culture, m } of memories(ctx)) {
        const Lc = translatedL(L, culture, m)
        const make = (pg, enRel) => ({ ...pg, md: cultureNote(ctx, Lc, pg, enRel) + pg.md, lang: culture, crumbs: [[enRel, 'English'], ...pg.crumbs.slice(-1)] })
        out.push(make(regionPage(ctx, Lc), 'algarve/index.html'))
        for (const t of pagePlaces(Lc)) out.push(make(townPage(ctx, Lc, t), `${t._en}index.html`))
    }
    return out
}

export function pages(ctx) {
    const L = load(ctx)
    const en = [regionPage(ctx, L), ...pagePlaces(L).map(t => townPage(ctx, L, t))]
    const tr = translatedPages(ctx, L), cultures = [...new Set(tr.map(p => p.lang))]
    // each English page links its translations (and so the translated pages are reached)
    if (cultures.length) for (const pg of en) pg.md += `\n\n{.bp-note .bp-i18n}\n${W(L, 'i18n_links')} ${cultures.filter(c => tr.some(t => t.rel === `${c}/${pg.rel}`)).map(c => `[${c}](${ctx.link(pg.rel, `${c}/${pg.rel}`)})`).join(' · ')}\n`
    // hreflang alternates: each place page and its translations name one another (board/spec-translations.md, item 5)
    for (const pg of en) {
        const alts = [{ lang: 'en-GB', rel: pg.rel }, { lang: 'x-default', rel: pg.rel }, ...tr.filter(t => t.rel === `${t.lang}/${pg.rel}`).map(t => ({ lang: t.lang, rel: t.rel }))]
        pg.alternates = alts
        for (const t of tr) if (t.rel === `${t.lang}/${pg.rel}`) t.alternates = alts
        // the place's feeds (lib/feeds.mjs) in the head, for feed readers and local media; no link in the page (dev@, 16 Nov)
        const place = L.list.find(x => `${x.path}index.html` === pg.rel)
        if (place) pg.feeds = [{ type: 'application/rss+xml', title: `PrompTugal.news: ${place.name}`, rel: `api/v1/by-place/${place.id}/feed.xml` },
            { type: 'application/feed+json', title: `PrompTugal.news: ${place.name}`, rel: `api/v1/by-place/${place.id}/feed.json` }]
    }
    return [...en, ...tr]
}

// the national lens (data/by-place/portugal.json, place.portugal@'s file) at the top of portugal/index.html
function portugalLens(ctx, L, rel) {
    const p = L.byId.get('portugal'), region = L.byId.get('algarve'), T = towns(L)
    if (!p) return ''
    const regionMap = [region, ...T].reduce((s, t) => s + (t ? t.ai_map.length : 0), 0), regionNews = [region, ...T].reduce((s, t) => s + (t ? t.ai_news.length : 0), 0)
    const ours = tagged(ctx, m => m.region || m.town).slice(0, 6)
    let md = `::: bp-frame bp-country\n` + mast(ctx, L, p, '')
    md += `\n::: cols-8-4\n::: col\n` + gravityBlock(ctx, L, p)
    md += `## AI in Portugal {#local}\n\n` + (p.ai_news.length ? newsCards(ctx, p.ai_news.slice(0, 8), 'bp-big') : `{.bp-empty}\n${W(L, 'local_empty')}`) + '\n\n'
    md += `## ${W(L, 'by_place_h')} {#by-place}\n\n${W(L, 'by_place_intro', { region: ctx.link(rel, 'algarve/index.html'), news: n(regionNews, 'local AI story', 'local AI stories'), map: n(regionMap, 'organisation'), count: T.length })}\n\n${fill['by-place:towns']({ rel }, ctx)}\n\n`
    if (ours.length) md += `{.mini-h}\n${W(L, 'articles_h', { name: 'the places' })}\n\n${articleList(ctx, rel, ours)}`
    md += `## The national AI map {#map}\n\n${W(L, 'map_intro', { name: 'Portugal' })}\n\n` + (mapRows(ctx, p.ai_map) || `{.bp-empty}\nBeing mapped.`) + '\n\n'
    md += `:::\n::: col\n` + sideCol(ctx, L, p, rel, [])
    md += `:::\n:::\n${identityNote(ctx, L, p)}\n\n{.bp-note .bp-id}\n${W(L, 'json_note', { json: ctx.link(rel, 'api/v1/by-place/portugal.json'), index: ctx.link(rel, 'api/v1/by-place/index.json') })}\n:::\n`
    return md
}

export const fill = {
    'by-place:portugal': (page, ctx) => portugalLens(ctx, load(ctx), page.rel),
    'by-place:towns': (page, ctx) => {
        const L = load(ctx), T = towns(L)
        return `{.chip-list}\n- [The Algarve](${ctx.link(page.rel, 'algarve/index.html')})\n${T.map(t => `- [${esc(ctx, t.name)}](${ctx.link(page.rel, `${t.path}index.html`)})`).join('\n')}`
    },
}

// the place data as clean JSON for the app and for anyone (ios.places@, show-the-power brief, 15 Nov 2026): the index,
// and one file per place with its lists checked (http(s) links only, stories newest first), its page, its look, its seat
// on the map, its site identity as verified at build, the places inside it and our articles tagged to it
const SITE_URL = 'https://promptugal.news/'
function placeRecord(ctx, L, p) {
    const r = identityOf(ctx, p.id) || {}
    const inside = L.list.filter(x => x.parent === p.id).map(x => x.id)
    const arts = tagged(ctx, m => m.town === p.id || m.region === p.id || inside.includes(m.town)).map(c => ({ title: c.meta.title, summary: c.meta.summary || null, author: c.meta.author || null, date: dmy(String(c.meta.date)), town: c.meta.town || null, region: c.meta.region || null, signature: `${SITE_URL}${c.rel.replace(/\.html$/, '.md')}.sig`, url: SITE_URL + c.rel.replace(/index\.html$/, ''), md: SITE_URL + c.rel.replace(/\.html$/, '.md') }))
    return {
        id: p.id, name: p.name, kind: p.kind, parent: p.parent || null, inside, agent: p.agent,
        status: ['live', 'researching'].includes(p.status) ? p.status : 'stub', updated: p.updated || null, by: p.by || null,
        page: SITE_URL + p.path, twin: SITE_URL + p.path + 'index.md', raw: `${SITE_URL}data/by-place/${p.id}.json`,
        at: Array.isArray(p.at) ? { lon: p.at[0], lat: p.at[1] } : null,
        look: { image: p.look && p.look.photo && p.look.photo.file && ctx.exists(p.look.photo.file) ? { url: SITE_URL + p.look.photo.file, ...p.look.photo } : null, accent: (p.look && p.look.accent) || DEF_ACCENT, landmark: (p.look && p.look.landmark) || null, motif: (p.look && p.look.motif) || null },
        mandate: p.mandate, gravity: p.gravity || null,
        counts: { ai_news: p.ai_news.length, ai_map: p.ai_map.length, events: p.events.length, sources: p.sources.length, articles: arts.length },
        ai_news: p.ai_news.map(a => ({ ...a, provenance: provenance(p, r, a, 'story') })), ai_map: p.ai_map.map(m => ({ ...m, provenance: provenance(p, r, { ...m, url: m.source_url }, 'map entry') })), events: p.events, sources: p.sources, extras: p.extras, start_company: p.start_company, investors: p.investors, talent: p.talent, contacts: p.contacts, gaps: p.gaps, voice: p.voice || null,
        articles: arts,
        ...(inAlgarve(L, p) && isLocalPlace(p) ? { around: aroundItems(ctx, p, (L.byId.get('algarve') ? L.byId.get('algarve').ai_news : []).slice(0, 4).map(a => a.url)) } : {}),
        local_media: localMedia(ctx, p, [p.id, p.parent, 'algarve', 'portugal'].filter(Boolean)),
        // the wider stories its page shows ("From the Algarve" or "From Portugal"), so the page holds nothing its JSON does not
        ...(isLocalPlace(p) ? (() => { const from = inAlgarve(L, p) ? 'algarve' : 'portugal', src = L.byId.get(from); return { wider_news: { from, items: (src ? src.ai_news : []).slice(0, 4) } } })() : {}),
        team: { agent: p.agent, status: `${SITE_URL}board/team/${p.agent.split('@')[0]}/status.json`, debriefs: `https://github.com/PrompTugal/PrompTugal__News__Website/tree/dev/board/team/${p.agent.split('@')[0]}/debriefs`, runs: `https://github.com/PrompTugal/PrompTugal__News__Website/tree/dev/board/runs/${p.agent.split('@')[0]}` },
        ...(p.id === 'algarve' ? (() => { const g = regionAgg(L); return { region: {
            places: g.places, live: g.live, local_ai_news: g.localCount,
            latest_from_towns: g.latestLocal.map(({ _town, _town_id, ...a }) => ({ ...a, town: _town_id })),
            ai_map: g.map.map(({ _place, _place_id, ...m }) => ({ ...m, place: _place_id })),
        } } })() : {}),
        identity: { key_id: r.site_key || (p.identity && p.identity.key_id) || null, signed_by: r.agent || null, signature: r.signature || 'unchecked', keys: SITE_URL + 'board/keys.json' },
    }
}

// the agents behind a place, from the record only (status.json, git, run reports), for the app (ios.places@) and the
// agents panel: the place's own agent first, then the shared agents who build every place
const SHARED = ['conductor@PrompTugal.dinis', 'abp@PrompTugal.dinis', 'dev.places@PrompTugal.dinis', 'designer.places@PrompTugal.dinis', 'viz.places@PrompTugal.dinis', 'data.places@PrompTugal.dinis', 'detective.places@PrompTugal.dinis']
const readJ = (ctx, f) => { try { return ctx.readJSON(f) } catch { return null } }
function commitsOf(ctx, paths, n = 10) {
    try {
        return execFileSync('git', ['log', `-${n}`, '--format=%H%x1f%cI%x1f%s', '--', ...paths], { cwd: ctx.ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
            .trim().split('\n').filter(Boolean).map(l => { const [hash, date, subject] = l.split('\x1f'); return { hash: hash.slice(0, 9), date, subject, url: `https://github.com/PrompTugal/PrompTugal__News__Website/commit/${hash}` } })
    } catch { return [] }
}
function agentRecord(ctx, agent, role, paths) {
    const r = agent.split('@')[0], st = readJ(ctx, `board/team/${r}/status.json`) || {}
    let runs = 0; try { runs = fs.readdirSync(ctx.R(`board/runs/${r}`)).filter(f => f.endsWith('.json')).length } catch { }
    return { agent, role, state: st.state || null, updated: st.updated || null, focus: st.focus || null, done: st.done || [], next: st.next || [], asks: (st.asks || []).filter(a => /^Dinis:/.test(a)), run_reports: runs, status: `${SITE_URL}board/team/${r}/status.json`, commits: commitsOf(ctx, paths) }
}
function agentsFile(ctx, L, p) {
    const roles = readJ(ctx, 'board/team/conductor/place-agents.json')
    const own = agentRecord(ctx, p.agent, 'place', [`data/by-place/${p.id}.json`, `board/team/${p.agent.split('@')[0]}/`])
    const shared = SHARED.map(a => agentRecord(ctx, a, 'shared', [`board/team/${a.split('@')[0]}/`]))
    return { about: W(L, 'api_agents_about', { name: p.name }), place: p.id, version: ctx.VERSION, built: ctx.TODAY, count: 1 + shared.length, roster: roles ? `${SITE_URL}board/team/conductor/place-agents.json` : null, agents: [own, ...shared] }
}
// a story's provenance: where it was read, when, by whom, and the signed file it lives in
const provenance = (p, r, item, src) => ({ source_url: item.url || item.source_url || null, publisher: item.publisher || null, published: item.date || null, read_on: item.read_on || null, read_by: p.agent, file: `${SITE_URL}data/by-place/${p.id}.json`, signature: r.signature || 'unchecked', site_key: r.site_key || null, ...(src ? { kind: src } : {}) })

export function api(ctx) {
    const L = load(ctx)
    const recs = L.list.map(p => placeRecord(ctx, L, p))
    // which place pages exist in each culture, and how much of the memory they use (spec item 8)
    const i18n = memories(ctx).map(({ culture, m }) => ({ path: `api/v1/i18n/${culture}/index.json`, schema: null, data: { culture, version: ctx.VERSION, built: ctx.TODAY, memory_entries: m.size,
        memory: `${SITE_URL}${TM_DIR}/${culture}/`, pages: [L.byId.get('algarve'), ...pagePlaces(L)].filter(Boolean).map(p => ({ place: p.id, page: `${SITE_URL}${culture}/${p.path}`, original: `${SITE_URL}${p.path}` })) } }))
    return [
        ...i18n,
        { path: 'api/v1/by-place/index.json', schema: null, data: { about: W(L, 'api_index_about'), version: ctx.VERSION, built: ctx.TODAY,
            places: recs.map(r => ({ id: r.id, name: r.name, kind: r.kind, parent: r.parent, path: L.byId.get(r.id).path, agent: r.agent, status: r.status, updated: r.updated, ai_news: r.counts.ai_news, ai_map: r.counts.ai_map, articles: r.counts.articles, page: r.page, api: `${SITE_URL}api/v1/by-place/${r.id}.json`, at: r.at, accent: r.look.accent, landmark: r.look.landmark, identity: L.byId.get(r.id).identity || null, signature: r.identity.signature })) } },
        ...recs.map(r => ({ path: `api/v1/by-place/${r.id}.json`, schema: null, data: { about: W(L, 'api_place_about', { name: r.name }), version: ctx.VERSION, ...r } })),
        ...recs.flatMap(r => { try { return [{ path: `api/v1/by-place/${r.id}/now.json`, schema: null, data: ctx.readJSON(`data/by-place/now/${r.id}.json`) }] } catch { return [] } }),
        ...recs.map(r => ({ path: `api/v1/by-place/${r.id}/agents.json`, schema: null, data: agentsFile(ctx, L, L.byId.get(r.id)) })),
        ...recs.flatMap(r => placeFeed(SITE_URL, r).map(f => ({ ...f, schema: null }))),   // feeds out (lib/feeds.mjs; dev@, 16 Nov)
        ...recs.map(r => ({ path: `api/v1/by-place/${r.id}/articles.json`, schema: null, data: { about: W(L, 'api_articles_about', { name: r.name }), place: r.id, version: ctx.VERSION, articles: r.articles } })),
    ]
}

export const searchDocs = ctx => {
    const L = load(ctx)
    return [{ id: 'page:algarve/index.html', url: 'algarve/index.html', title: 'PrompTugal.news The Algarve', type: 'place', date: ctx.TODAY, text: 'Algarve AI technology towns Faro Loulé Quarteira Silves Tavira Portimão Lagos Olhão Albufeira Lagoa Monchique Aljezur Vila do Bispo Castro Marim Alcoutim São Brás de Alportel Vila Real de Santo António AI map Algarve Evolution' },
        ...pagePlaces(L).map(t => ({ id: `page:${t.path}index.html`, url: `${t.path}index.html`, title: `PrompTugal.news ${t.name}`, type: 'place', date: dmy(t.updated) || ctx.TODAY, text: [t.name, t.mandate, t.gravity && t.gravity.text, ...(t.ai_news || []).map(a => a.title), ...(t.ai_map || []).map(m => m.name)].filter(Boolean).join(' ') }))]
}

export function llms(ctx) {
    const L = load(ctx)
    return `## PrompTugal.news by place\n- [The Algarve](algarve/index.md): the region and its ${towns(L).length} towns, each a lens on the same stories\n${towns(L).map(t => `- [${t.name}](${t.path}index.md)`).join('\n')}\n\n`
}

// abp@'s site-identity rule (every place site has its own key and a valid signature over its file): a warning tonight,
// a failure once Dinis says so (board/briefs/2026-11-15-the-place-agents.md)
export function warn(gate) {
    return checkSites(gate.ROOT).filter(r => !r.ok).map(r => `site-identity: ${r.id}: ${r.problems.join('; ')}`)
}

export function validate(gate) {
    const out = []
    let L
    try { L = JSON.parse(gate.text(LIST)) } catch { return [`${LIST} unreadable`] }
    for (const p of L.places) {
        if (p.kind === 'country') continue
        const rel = `${p.path}index.html`
        try { const t = gate.text(rel); if (!t.includes('bp-mandate')) out.push(`${rel} lacks its mandate`) } catch { out.push(`missing ${rel}`) }
        try {
            const d = JSON.parse(gate.text(`data/by-place/${p.id}.json`))
            for (const a of (d.ai_news || [])) if (!a.url || !a.ai_path || !a.read_on) out.push(`data/by-place/${p.id}.json: an AI story without its source, its AI path or its read date`)
            for (const m of (d.ai_map || [])) if (/websummit\.com|lu\.ma|luma\.com|meetup\.com|eventbrite\./.test(`${m.url} ${m.source_url}`)) out.push(`data/by-place/${p.id}.json: ${m.name} rests on a source we do not read by machine`)
            for (const a of (d.ai_news || [])) if (/websummit\.com|lu\.ma|luma\.com|meetup\.com|eventbrite\./.test(a.url)) out.push(`data/by-place/${p.id}.json: a story rests on a source we do not read by machine`)
        } catch {}
    }
    return out
}
