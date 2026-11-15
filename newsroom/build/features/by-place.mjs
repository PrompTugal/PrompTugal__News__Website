// PrompTugal.news by place (Dinis's brief, 14 November 2026: board/guidance/2026-11-14-promptugal-by-place.md).
// One publication, three levels of place. The list is data/by-place/places.json; each place's research is
// data/by-place/<id>.json, written by its own agent (place.<id>@PrompTugal.dinis). This feature makes the region's page
// (algarve/) and one page per town (algarve/<town>/). Each page is a lens: local AI news big, wider news smaller.
// The Portugal level is the existing portugal/ page, which links here. Built by conductor@PrompTugal.dinis at Dinis's
// word (15 Nov 2026, for his meeting with Algarve Evolution); dev@ owns it from here.
export const order = 69
import { checkSites } from '../../../board/abp/tools/site-identity.mjs'

const LIST = 'data/by-place/places.json'
const DEF_ACCENT = '#1f5f3f'

const arr = v => Array.isArray(v) ? v : []
const okUrl = u => typeof u === 'string' && /^https?:\/\/[^\s]+$/i.test(u.trim())
// a URL safe inside a markdown link: http(s) only, no spaces or bare parentheses (they would end the link)
const url = u => okUrl(u) ? u.trim().replace(/\(/g, '%28').replace(/\)/g, '%29') : ''

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
        }
        if (!/^#[0-9a-f]{6}$/i.test((d.look && d.look.accent) || '')) clean.look = { ...(d.look || {}), accent: undefined }
        byId.set(p.id, { ...clean, id: p.id, name: p.name, kind: p.kind, parent: p.parent, path: p.path, agent: p.agent, at: p.at, label: p.label, mandate: d.mandate || p.name, _broken: broken })
    }
    return { list: raw.places.map(p => byId.get(p.id)), byId, copy: raw.copy || {} }
}

const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
const dmy = s => (s && /^\d{4}-\d{2}-\d{2}/.test(s)) ? s.slice(0, 10) : (s || '')
const towns = (L) => L.list.filter(p => p.kind === 'municipality' || p.kind === 'city')
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
${W(L, 'test_note', { graph: ctx.link(rel, 'graph/index.html'), region: ctx.link(rel, 'algarve/index.html') })}${identityNote(ctx, L, p)}`
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

function sideCol(ctx, L, p, rel, inside) {
    const v = p.voice || {}
    let md = ''
    if (inside.length) md += `{.mini-h}\nInside ${esc(ctx, p.name)}\n\n${inside.map(x => `- [${esc(ctx, x.name)}](${ctx.link(rel, `${x.path}index.html`)})`).join('\n')}\n\n`
    md += `{.mini-h}\nEvents\n\n` + (p.events.length ? `{.bp-events}\n${p.events.map(e => `- [${esc(ctx, e.title)}](${url(e.url)})${e.date ? ` · ${esc(ctx, e.date)}` : ''}${typeof e.ai_path === 'string' && e.ai_path ? ` · AI path: ${esc(ctx, e.ai_path)}` : ''}`).join('\n')}` : `{.bp-empty}\nNone found yet.`) + '\n\n'
    if (p.kind !== 'country') md += `{.mini-h}\nWeather\n\n${W(L, 'weather', { name: p.name })}\n\n`
    if (p.extras.length) md += `{.mini-h}\nIn figures\n\n{.bp-extras}\n${p.extras.map(x => `- **${esc(ctx, x.label)}:** ${esc(ctx, x.value)}${url(x.source_url) ? ` ([source](${url(x.source_url)}))` : ''}`).join('\n')}\n\n`
    md += `{.mini-h}\nSources we read\n\n` + (p.sources.length ? `{.bp-sources}\n${p.sources.map(s => `- [${esc(ctx, s.name)}](${url(s.url)})${s.kind ? ` · ${esc(ctx, s.kind)}` : ''}${okUrl(s.feed) ? ` · [feed](${url(s.feed)})` : ''}`).join('\n')}` : `{.bp-empty}\nBeing listed.`) + '\n\n'
    md += `{.mini-h}\nGaps\n\n` + voiceBlock((p.gaps.length ? `{.bp-gaps}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}` : 'None recorded.'), v.gaps_intro ? `{.bp-gaps}\n- ${esc(ctx, v.gaps_intro)}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}` : null) + '\n'
    return md
}

function townPage(ctx, L, p) {
    const rel = `${p.path}index.html`
    const parent = L.byId.get(p.parent)
    const region = L.byId.get('algarve')
    const parentLink = parent ? `[${esc(ctx, parent.name)}](${ctx.link(rel, `${parent.path}index.html`)})` : ''
    const inside = L.list.filter(x => x.parent === p.id)
    const local = p.ai_news
    const wider = (region ? region.ai_news : []).slice(0, 4)
    const ours = tagged(ctx, m => m.town === p.id || inside.some(x => m.town === x.id))
    const latest = tagged(ctx, m => !ours.some(o => o.meta === m)).slice(0, 4)
    let md = mast(ctx, L, p, parentLink) + photoBand(ctx, L, p, rel)
    md += `\n::: cols-8-4\n::: col\n`
    md += gravityBlock(ctx, L, p)
    md += `## AI in ${esc(ctx, p.name)} {#local}\n\n` + (local.length ? newsCards(ctx, local, 'bp-big') : `{.bp-empty}\n${W(L, 'local_empty')}`) + '\n\n'
    if (ours.length) md += `## ${W(L, 'articles_h', { name: esc(ctx, p.name) })} {#ours}\n\n${articleList(ctx, rel, ours)}`
    if (wider.length) md += `## From the Algarve {#region}\n\n${newsCards(ctx, wider, 'bp-small')}\n\n`
    if (latest.length) md += `## ${W(L, 'national_h')} {#national}\n\n${articleList(ctx, rel, latest)}`
    md += `## The AI map {#map}\n\n${W(L, 'map_intro', { name: p.name })}\n\n` + (mapRows(ctx, p.ai_map) || `{.bp-empty}\nBeing mapped.`) + '\n\n'
    md += `:::\n::: col\n` + (Array.isArray(p.at) ? `{.bp-svgmap .bp-locator}\n[${esc(ctx, W(L, 'locator_link'))}](${ctx.link(rel, 'algarve/index.html')})\n\n` : '') + sideCol(ctx, L, p, rel, inside)
    md += `:::\n:::\n\n` + testNote(ctx, L, rel, p)
    const accent = (p.look && p.look.accent) || DEF_ACCENT
    return {
        src: `data/by-place/${p.id}.json`, rel, type: 'place', layout: 'wide', date: dmy(p.updated) || ctx.TODAY,
        section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], ...(p.parent === 'loule' ? [['algarve/index.html', 'The Algarve'], [`algarve/loule/index.html`, 'Loulé']] : [['algarve/index.html', 'The Algarve']]), [null, p.name]],
        title: `PrompTugal.news ${p.name}`,
        summary: W(L, 'town_summary', { name: p.name, local: n(local.length, 'local AI story', 'local AI stories'), map: n((p.ai_map || []).length, 'organisation') }),
        assets: { css: ['assets/by-place/by-place.css'], js: ['assets/by-place/by-place.js'] },
        postHtml: html => `<div class="bp-frame" data-place="${p.id}" style="--accent:${accent}">${html.replace(/<p class="bp-svgmap bp-locator">([\s\S]*?)<\/p>/, (m, link) => `<figure class="bp-svgmap bp-locator">${algarveSvg(ctx, L, rel, towns(L), p.id)}<figcaption>${link}</figcaption></figure>`)}</div>`,
        md,
    }
}

// The region's map, drawn at build time (no script): the coast and the border from assets/portugal/algarve-outline.json
// (Natural Earth, public domain), a dot per place at its seat (places.json "at"), in its own accent, linked to its site.
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
            pincls: focus ? (t.id === focus ? ' focus' : ' dim') : '', href: ctx.link(rel, `${t.path}index.html`), accent: (t.look && t.look.accent) || DEF_ACCENT, x, y, r: r.toFixed(1), cls: t.status === 'live' ? 'live' : 'ring',
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

function regionPage(ctx, L) {
    const p = L.byId.get('algarve'), rel = 'algarve/index.html'
    const T = towns(L)
    const allMap = []
    for (const t of [p, ...T]) for (const m of (t.ai_map || [])) allMap.push({ ...m, _place: t.id === 'algarve' ? 'the region' : t.name })
    const seen = new Set(), map = allMap.filter(m => { const k = m.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true })
    const localCount = T.reduce((s, t) => s + (t.ai_news || []).length, 0)
    const latestLocal = T.flatMap(t => t.ai_news.map(a => ({ ...a, _town: t.name }))).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8)
    let md = mast(ctx, L, p, `[Portugal](${ctx.link(rel, 'portugal/index.html')})`)
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

export function pages(ctx) {
    const L = load(ctx)
    return [regionPage(ctx, L), ...towns(L).map(t => townPage(ctx, L, t))]
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
    md += `:::\n:::\n${identityNote(ctx, L, p)}\n:::\n`
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
    const arts = tagged(ctx, m => m.town === p.id || m.region === p.id || inside.includes(m.town)).map(c => ({ title: c.meta.title, date: dmy(String(c.meta.date)), url: SITE_URL + c.rel.replace(/index\.html$/, ''), md: SITE_URL + c.rel.replace(/\.html$/, '.md') }))
    return {
        id: p.id, name: p.name, kind: p.kind, parent: p.parent || null, inside, agent: p.agent,
        status: ['live', 'researching'].includes(p.status) ? p.status : 'stub', updated: p.updated || null, by: p.by || null,
        page: SITE_URL + p.path, twin: SITE_URL + p.path + 'index.md', raw: `${SITE_URL}data/by-place/${p.id}.json`,
        at: Array.isArray(p.at) ? { lon: p.at[0], lat: p.at[1] } : null,
        look: { accent: (p.look && p.look.accent) || DEF_ACCENT, landmark: (p.look && p.look.landmark) || null, motif: (p.look && p.look.motif) || null },
        mandate: p.mandate, gravity: p.gravity || null,
        counts: { ai_news: p.ai_news.length, ai_map: p.ai_map.length, events: p.events.length, sources: p.sources.length, articles: arts.length },
        ai_news: p.ai_news, ai_map: p.ai_map, events: p.events, sources: p.sources, extras: p.extras, gaps: p.gaps, voice: p.voice || null,
        articles: arts,
        identity: { key_id: r.site_key || (p.identity && p.identity.key_id) || null, signed_by: r.agent || null, signature: r.signature || 'unchecked', keys: SITE_URL + 'board/keys.json' },
    }
}

export function api(ctx) {
    const L = load(ctx)
    const recs = L.list.map(p => placeRecord(ctx, L, p))
    return [
        { path: 'api/v1/by-place/index.json', schema: null, data: { about: W(L, 'api_index_about'), version: ctx.VERSION, built: ctx.TODAY,
            places: recs.map(r => ({ id: r.id, name: r.name, kind: r.kind, parent: r.parent, path: L.byId.get(r.id).path, agent: r.agent, status: r.status, updated: r.updated, ai_news: r.counts.ai_news, ai_map: r.counts.ai_map, articles: r.counts.articles, page: r.page, api: `${SITE_URL}api/v1/by-place/${r.id}.json`, at: r.at, accent: r.look.accent, landmark: r.look.landmark, identity: L.byId.get(r.id).identity || null, signature: r.identity.signature })) } },
        ...recs.map(r => ({ path: `api/v1/by-place/${r.id}.json`, schema: null, data: { about: W(L, 'api_place_about', { name: r.name }), version: ctx.VERSION, ...r } })),
    ]
}

export const searchDocs = ctx => {
    const L = load(ctx)
    return [{ id: 'page:algarve/index.html', url: 'algarve/index.html', title: 'PrompTugal.news The Algarve', type: 'place', date: ctx.TODAY, text: 'Algarve AI technology towns Faro Loulé Quarteira Silves Tavira Portimão Lagos Olhão Albufeira Lagoa Monchique Aljezur Vila do Bispo Castro Marim Alcoutim São Brás de Alportel Vila Real de Santo António AI map Algarve Evolution' },
        ...towns(L).map(t => ({ id: `page:${t.path}index.html`, url: `${t.path}index.html`, title: `PrompTugal.news ${t.name}`, type: 'place', date: dmy(t.updated) || ctx.TODAY, text: [t.name, t.mandate, t.gravity && t.gravity.text, ...(t.ai_news || []).map(a => a.title), ...(t.ai_map || []).map(m => m.name)].filter(Boolean).join(' ') }))]
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
