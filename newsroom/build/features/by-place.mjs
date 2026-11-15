// PrompTugal.news by place (Dinis's brief, 14 November 2026: board/guidance/2026-11-14-promptugal-by-place.md).
// One publication, three levels of place. The list is data/by-place/places.json; each place's research is
// data/by-place/<id>.json, written by its own agent (place.<id>@PrompTugal.dinis). This feature makes the region's page
// (algarve/) and one page per town (algarve/<town>/). Each page is a lens: local AI news big, wider news smaller.
// The Portugal level is the existing portugal/ page, which links here. Built by conductor@PrompTugal.dinis at Dinis's
// word (15 Nov 2026, for his meeting with Algarve Evolution); dev@ owns it from here.
export const order = 69

const LIST = 'data/by-place/places.json'
const DEF_ACCENT = '#1f5f3f'

function load(ctx) {
    const list = ctx.readJSON(LIST).places
    const byId = new Map()
    for (const p of list) {
        const f = `data/by-place/${p.id}.json`
        const d = ctx.exists(f) ? ctx.readJSON(f) : {}
        byId.set(p.id, { ...p, ...d, path: p.path, agent: p.agent })
    }
    return { list: list.map(p => byId.get(p.id)), byId, copy: ctx.readJSON(LIST).copy || {} }
}

const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
const dmy = s => (s && /^\d{4}-\d{2}-\d{2}/.test(s)) ? s.slice(0, 10) : (s || '')
const towns = (L) => L.list.filter(p => p.kind === 'municipality' || p.kind === 'city')
const W = (L, key, vars = {}) => String(L.copy[key] || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
const n = (k, one, many) => `${k} ${k === 1 ? one : (many || one + 's')}`

function esc(ctx, s) { return ctx.md.cell(String(s ?? '')) }

function newsCards(ctx, items, cls) {
    if (!items || !items.length) return ''
    return `{.bp-cards ${cls || ''}}\n` + items.map(a =>
        `- **[${esc(ctx, a.title)}](${a.url})**${a.summary ? ` ${esc(ctx, a.summary)}` : ''} ${esc(ctx, [a.publisher || host(a.url), dmy(a.date)].filter(Boolean).join(', '))} · AI path${typeof a.steps === 'number' ? ` (${a.steps === 0 ? 'direct' : n(a.steps, 'step')})` : ''}: ${esc(ctx, a.ai_path)}.`
    ).join('\n')
}

function mapRows(ctx, items, withPlace) {
    if (!items || !items.length) return ''
    const order = ['startup', 'company', 'institution', 'organisation', 'community', 'public body', 'investor']
    const sorted = [...items].sort((a, b) => (order.indexOf(a.type) - order.indexOf(b.type)) || a.name.localeCompare(b.name))
    return `{.bp-map}\n| Who | What | AI path | Source |\n|---|---|---|---|\n` + sorted.map(m =>
        `| ${m.url ? `[${esc(ctx, m.name)}](${m.url})` : esc(ctx, m.name)}${withPlace && m._place ? `<br><small>${esc(ctx, m._place)}</small>` : ''} | ${esc(ctx, [m.type, m.what].filter(Boolean).join(': '))} | ${esc(ctx, m.ai_path || '')}${typeof m.steps === 'number' ? ` (${m.steps === 0 ? 'direct' : n(m.steps, 'step')})` : ''} | [${esc(ctx, host(m.source_url))}](${m.source_url}), read ${esc(ctx, dmy(m.read_on))} |`
    ).join('\n')
}

function voiceBlock(std, voice) {
    if (!voice) return `${std}\n`
    return `::: bp-std\n${std}\n:::\n::: bp-voice\n${voice}\n:::\n`
}

function mast(ctx, p, parentName) {
    const v = p.voice || {}
    return `::: bp-mast\n{.bp-kicker}\nPrompTugal.news · ${esc(ctx, p.name)}${p.look && p.look.landmark ? ` · ${esc(ctx, p.look.landmark)}` : ''}\n\n` +
        voiceBlock(`{.bp-mandate}\n${esc(ctx, p.mandate)}`, v.mandate ? `{.bp-mandate}\n${esc(ctx, v.lede ? v.lede + ' ' : '')}${esc(ctx, v.mandate)}` : null) +
        `\n{.bp-meta}\n${p.status === 'stub' ? 'Research starting' : p.status === 'researching' ? 'Research in progress' : 'Live'} · updated ${esc(ctx, dmy(p.updated))} by \`${esc(ctx, p.agent)}\`${p.identity && p.identity.key_id ? ` · site identity \`${esc(ctx, p.identity.key_id)}\`` : ''}${parentName ? ` · part of ${parentName}` : ''}\n:::\n`
}

function testNote(ctx, L, rel) {
    return `## How this page is made {#how}

{.bp-note}
${W(L, 'test_note', { graph: ctx.link(rel, 'graph/index.html'), region: ctx.link(rel, 'algarve/index.html') })}`
}

function townPage(ctx, L, p) {
    const rel = `${p.path}index.html`
    const parent = L.byId.get(p.parent)
    const region = L.byId.get('algarve')
    const parentLink = parent ? `[${esc(ctx, parent.name)}](${ctx.link(rel, `${parent.path}index.html`)})` : ''
    const inside = L.list.filter(x => x.parent === p.id)
    const local = (p.ai_news || [])
    const wider = (region && region.ai_news || []).slice(0, 4)
    const latest = ctx.content.filter(c => c.rel.startsWith('articles/') && c.meta && c.meta.date && c.meta.status !== 'draft').sort((a, b) => String(b.meta.date).localeCompare(String(a.meta.date))).slice(0, 4)
    const v = p.voice || {}
    let md = mast(ctx, p, parentLink)
    md += `\n::: cols-8-4\n::: col\n`
    md += `## The centre of gravity {#gravity}\n\n` + (p.gravity && p.gravity.text ? voiceBlock(esc(ctx, p.gravity.text) + (p.gravity.sources && p.gravity.sources.length ? `\n\n{.bp-src}\nSources: ${p.gravity.sources.map(s => `[${esc(ctx, s.title || host(s.url))}](${s.url})`).join(', ')}.` : ''), v.gravity ? esc(ctx, v.gravity) : null) : `{.bp-empty}\n${W(L, 'gravity_empty', { name: p.name })}\n`) + '\n'
    md += `## AI in ${esc(ctx, p.name)} {#local}\n\n` + (local.length ? newsCards(ctx, local, 'bp-big') : `{.bp-empty}\n${W(L, 'local_empty')}`) + '\n\n'
    if (wider.length) md += `## From the Algarve {#region}\n\n${newsCards(ctx, wider, 'bp-small')}\n\n`
    if (latest.length) md += `## From PrompTugal.news {#national}\n\n{.bp-latest}\n${latest.map(c => `- [${esc(ctx, c.meta.title)}](${ctx.link(rel, c.rel)}) · ${esc(ctx, dmy(String(c.meta.date)))}`).join('\n')}\n\n`
    md += `## The AI map {#map}\n\n${W(L, 'map_intro', { name: p.name })}\n\n` + (mapRows(ctx, p.ai_map) || `{.bp-empty}\nBeing mapped.`) + '\n\n'
    md += `:::\n::: col\n`
    if (inside.length) md += `{.mini-h}\nInside ${esc(ctx, p.name)}\n\n${inside.map(x => `- [${esc(ctx, x.name)}](${ctx.link(rel, `${x.path}index.html`)})`).join('\n')}\n\n`
    md += `{.mini-h}\nEvents\n\n` + ((p.events || []).length ? `{.bp-events}\n${p.events.map(e => `- [${esc(ctx, e.title)}](${e.url})${e.date ? ` · ${esc(ctx, e.date)}` : ''}${e.ai_path ? ` · AI path: ${esc(ctx, e.ai_path)}` : ''}`).join('\n')}` : `{.bp-empty}\nNone found yet.`) + '\n\n'
    md += `{.mini-h}\nWeather\n\n${W(L, 'weather', { name: p.name })}` + ((p.extras || []).length ? `\n\n{.bp-extras}\n${p.extras.map(x => `- **${esc(ctx, x.label)}:** ${esc(ctx, x.value)} ([source](${x.source_url}))`).join('\n')}` : '') + '\n\n'
    md += `{.mini-h}\nSources we read\n\n` + ((p.sources || []).length ? `{.bp-sources}\n${p.sources.map(s => `- [${esc(ctx, s.name)}](${s.url})${s.kind ? ` · ${esc(ctx, s.kind)}` : ''}${s.feed ? ` · [feed](${s.feed})` : ''}`).join('\n')}` : `{.bp-empty}\nBeing listed.`) + '\n\n'
    md += `{.mini-h}\nGaps\n\n` + voiceBlock(((p.gaps || []).length ? `{.bp-gaps}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}` : 'None recorded.'), v.gaps_intro ? `{.bp-gaps}\n- ${esc(ctx, v.gaps_intro)}\n${(p.gaps || []).map(g => `- ${esc(ctx, g)}`).join('\n')}` : null) + '\n'
    md += `:::\n:::\n\n` + testNote(ctx, L, rel)
    const accent = (p.look && p.look.accent) || DEF_ACCENT
    return {
        src: `data/by-place/${p.id}.json`, rel, type: 'place', layout: 'wide', date: dmy(p.updated) || ctx.TODAY,
        section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], ...(p.parent === 'loule' ? [['algarve/index.html', 'The Algarve'], [`algarve/loule/index.html`, 'Loulé']] : [['algarve/index.html', 'The Algarve']]), [null, p.name]],
        title: `PrompTugal.news ${p.name}`,
        summary: W(L, 'town_summary', { name: p.name, local: n(local.length, 'local AI story', 'local AI stories'), map: n((p.ai_map || []).length, 'organisation') }),
        assets: { css: ['assets/by-place/by-place.css'], js: ['assets/by-place/by-place.js'] },
        postHtml: html => `<div class="bp-frame" data-place="${p.id}" style="--accent:${accent}">${html}</div>`,
        md,
    }
}

function regionPage(ctx, L) {
    const p = L.byId.get('algarve'), rel = 'algarve/index.html'
    const T = towns(L)
    const allMap = []
    for (const t of [p, ...T]) for (const m of (t.ai_map || [])) allMap.push({ ...m, _place: t.id === 'algarve' ? 'the region' : t.name })
    const seen = new Set(), map = allMap.filter(m => { const k = m.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true })
    const localCount = T.reduce((s, t) => s + (t.ai_news || []).length, 0)
    const latestLocal = T.flatMap(t => (t.ai_news || []).map(a => ({ ...a, title: `${t.name}: ${a.title}` }))).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8)
    let md = mast(ctx, p, `[Portugal](${ctx.link(rel, 'portugal/index.html')})`)
    md += `\n{.bp-tiles}\n- **${T.length}** places in the first wave\n- **${localCount}** local AI stories\n- **${map.length}** on the AI map\n- **${T.filter(t => t.status === 'live').length}** places live\n\n`
    md += `## The towns {#towns}\n\n${W(L, 'towns_intro')}\n\n{.bp-towns}\n` +
        T.map(t => `- [**${esc(ctx, t.name)}**${t.look && t.look.landmark ? `<br><small>${esc(ctx, t.look.landmark)}</small>` : ''}](${ctx.link(rel, `${t.path}index.html`)}) ${n((t.ai_news || []).length, 'story', 'stories')} · ${n((t.ai_map || []).length, 'on the map', 'on the map')}`).join('\n') + '\n\n'
    md += `::: cols-8-4\n::: col\n`
    md += `## The latest from the towns {#latest}\n\n` + (latestLocal.length ? newsCards(ctx, latestLocal, 'bp-big') : `{.bp-empty}\nThe towns' agents are starting their research.`) + '\n\n'
    if ((p.ai_news || []).length) md += `## Across the region {#region}\n\n${newsCards(ctx, p.ai_news, 'bp-small')}\n\n`
    md += `## The AI map of the Algarve {#map}\n\n${W(L, 'region_map_intro', { ae: ctx.link(rel, 'portugal/algarve-evolution/index.html') })}\n\n` + (mapRows(ctx, map, true) || `{.bp-empty}\nBeing mapped.`) + '\n\n'
    md += `:::\n::: col\n`
    md += `{.mini-h}\nOne publication, three levels\n\n${W(L, 'levels', { portugal: ctx.link(rel, 'portugal/index.html'), count: T.length })}\n\n`
    md += `{.mini-h}\nThe first wave\n\n{.bp-status}\n| Place | Status | Stories | Map |\n|---|---|---|---|\n${T.map(t => `| [${esc(ctx, t.name)}](${ctx.link(rel, `${t.path}index.html`)}) | ${t.status || 'stub'} | ${(t.ai_news || []).length} | ${(t.ai_map || []).length} |`).join('\n')}\n\n`
    if ((p.sources || []).length) md += `{.mini-h}\nRegional sources\n\n{.bp-sources}\n${p.sources.map(s => `- [${esc(ctx, s.name)}](${s.url})${s.feed ? ` · [feed](${s.feed})` : ''}`).join('\n')}\n\n`
    if ((p.gaps || []).length) md += `{.mini-h}\nGaps\n\n{.bp-gaps}\n${p.gaps.map(g => `- ${esc(ctx, g)}`).join('\n')}\n\n`
    md += `:::\n:::\n\n` + testNote(ctx, L, rel)
    return {
        src: LIST, rel, type: 'place', layout: 'wide', date: ctx.TODAY, section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], [null, 'The Algarve']],
        title: 'PrompTugal.news The Algarve',
        summary: W(L, 'region_summary', { count: T.length, local: n(localCount, 'local AI story', 'local AI stories'), map: n(map.length, 'organisation') }),
        assets: { css: ['assets/by-place/by-place.css'], js: ['assets/by-place/by-place.js'] },
        postHtml: html => `<div class="bp-frame bp-region" data-place="algarve" style="--accent:${(p.look && p.look.accent) || DEF_ACCENT}">${html}</div>`,
        md,
    }
}

export function pages(ctx) {
    const L = load(ctx)
    return [regionPage(ctx, L), ...towns(L).map(t => townPage(ctx, L, t))]
}

export const fill = {
    'by-place:towns': (page, ctx) => {
        const L = load(ctx), T = towns(L)
        return `{.chip-list}\n- [The Algarve](${ctx.link(page.rel, 'algarve/index.html')})\n${T.map(t => `- [${esc(ctx, t.name)}](${ctx.link(page.rel, `${t.path}index.html`)})`).join('\n')}`
    },
}

export function api(ctx) {
    const L = load(ctx)
    return [{ path: 'api/v1/by-place/index.json', data: { about: 'PrompTugal.news by place: each place, its status, its agent and its counts', places: L.list.map(p => ({ id: p.id, name: p.name, kind: p.kind, parent: p.parent, path: p.path, agent: p.agent, status: p.status || 'stub', updated: p.updated || null, ai_news: (p.ai_news || []).length, ai_map: (p.ai_map || []).length, identity: p.identity || null })) }, schema: null }]
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
