// The provenance line (data.places@PrompTugal.dinis, 15 November 2026; Dinis: "for every news story, on the side: the
// provenance, when it was done, what was collected, screenshots ... the provenance line has to be super powerful"):
//   - on each place page, a box at the top of the side column: who keeps the page, its signature, what it rests on
//     and when that was read, and how much of it is captured;
//   - beside every cited link that has a capture, a badge with the capture's hash, to the place's provenance page;
//   - on every article, "How this story was made": who made it and when (from git), its signature, its sources and
//     their captures;
//   - a provenance page per place (query/<place>/provenance/): every item, its source, its read date, its capture.
// The captures are taken by board/team/data.places/tools/capture.mjs into the sgit vault promptugal-captures; their
// index is data/query/captures.json (or, until the gate knows that file, board/team/data.places/captures.json).
import { execFileSync } from 'node:child_process'
import { database } from './data-places.mjs'
import { checkSites } from '../../../board/abp/tools/site-identity.mjs'

export const order = 87
const INDEXES = ['data/query/captures.json', 'board/team/data.places/captures.json']
const CAT_FILE = 'assets/query/catalogue.json'
const ASSETS = { css: ['assets/query/provenance.css'] }
const fillT = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m)
const dmy = s => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '')); if (!m) return s || ''; return `${+m[3]} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1]} ${m[1]}` }
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase() } catch { return null } }
const escHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let S = null, KEYS = null
const keysOf = ctx => KEYS || (KEYS = (() => { try { return ctx.readJSON('board/keys.json').keys || [] } catch { return [] } })())
function state(ctx) {
    if (S) return S
    const W = ctx.readJSON(CAT_FILE).words
    let idx = { captures: [], vault: {} }
    for (const f of INDEXES) if (ctx.exists(f)) { try { idx = ctx.readJSON(f); idx.file = f; break } catch {} }
    const byUrl = new Map((idx.captures || []).map(c => [c.url, c]))
    let sites = []
    try { sites = checkSites(ctx.ROOT) } catch {}
    S = { W, idx, byUrl, sites: new Map(sites.map(s => [s.id, s])) }
    return S
}
const capKey = c => (c.image && c.image.path || c.url).split('/').pop().replace(/\.\w+$/, '')
// git: who first wrote a file and who last changed it (the agent is the commit subject's name, before the colon)
let SHALLOW = null
function history(ctx, file) {
    try {
        if (SHALLOW === null) SHALLOW = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: ctx.ROOT }).toString().trim() === 'true'
        const out = execFileSync('git', ['log', '--follow', '--format=%aI\t%s', '--', file], { cwd: ctx.ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\n').filter(Boolean)
        if (!out.length) return null
        const parse = l => { const [at, subj] = l.split('\t'); const who = (/^([a-z][\w.-]*@[\w.-]+):/i.exec(subj || '') || [])[1] || null; return { at: at.slice(0, 16).replace('T', ' ') + ' UTC', who } }
        const commits = out.map(parse)
        return { first: SHALLOW ? null : commits[commits.length - 1], last: commits[0], count: commits.length, agents: [...new Set(commits.map(c => c.who).filter(Boolean))] }
    } catch { return null }
}

// the place's items, each with its source and its capture
function items(ctx, p) {
    const db = database(ctx), st = state(ctx), out = []
    const t = name => db.tables[name], col = (name, c) => t(name).columns.indexOf(c)
    for (const r of t('news').rows.filter(r => r[0] === p.id)) out.push({ kind: 'story', label: r[3], date: r[4], url: r[6], read_on: r[8], cap: st.byUrl.get(r[6]) })
    for (const r of t('map').rows.filter(r => r[0] === p.id)) out.push({ kind: 'map', label: r[3], url: r[col('map', 'source_url')], read_on: r[col('map', 'read_on')], cap: st.byUrl.get(r[col('map', 'source_url')]) })
    for (const r of t('events').rows.filter(r => r[0] === p.id)) out.push({ kind: 'event', label: r[2], date: r[3], url: r[4], read_on: r[5], cap: st.byUrl.get(r[4]) })
    const f = p.file || {}
    for (const s of (f.gravity && f.gravity.sources) || []) if (s && s.url) out.push({ kind: 'gravity', label: s.title || s.url, url: s.url, read_on: s.read_on, cap: st.byUrl.get(s.url) })
    for (const r of t('sources').rows.filter(r => r[0] === p.id)) out.push({ kind: 'source', label: r[2], url: r[3], read_on: null, cap: st.byUrl.get(r[3]) })
    return out
}
function summary(ctx, p) {
    const its = items(ctx, p).filter(i => i.kind !== 'source'), reads = its.map(i => i.read_on).filter(Boolean).sort()
    const urls = [...new Set(its.map(i => i.url).filter(Boolean))], caps = urls.map(u => state(ctx).byUrl.get(u)).filter(c => c && c.ok)
    return { items: its.length, urls: urls.length, hosts: new Set(urls.map(hostOf)).size, first: reads[0], last: reads[reads.length - 1], captured: caps.length, capturedAt: caps.map(c => c.captured_at).sort().pop() }
}

// ---- the place page's box (top of the side column) and its badges
function placeBox(ctx, p, rel) {
    const { W } = state(ctx), s = summary(ctx, p), site = state(ctx).sites.get(p.id) || {}, h = history(ctx, `data/by-place/${p.id}.json`)
    const sig = site.signature === 'valid' ? fillT(W.pv_sig_valid, { key: site.site_key || '' }) : site.signature ? fillT(W.pv_sig_other, { state: site.signature, key: site.site_key || '' }) : W.pv_sig_none
    const lines = [
        `**${W.pv_kept}** ${p.agent || ''}${h ? `, ${h.first ? fillT(W.pv_commits, { n: h.count, first: h.first.at, last: h.last.at }) : fillT(W.pv_last, { last: h.last.at, who: h.last.who || '' })}` : ''}`,
        `**${W.pv_signed}** ${sig}`,
        `**${W.pv_rests}** ${fillT(W.pv_rests_text, { items: s.items, urls: s.urls, hosts: s.hosts })}${s.first ? `, ${s.first === s.last ? fillT(W.pv_read_on, { day: dmy(s.first) }) : fillT(W.pv_read, { first: dmy(s.first), last: dmy(s.last) })}` : ''}`,
        `**${W.pv_captured}** ${!s.urls ? W.pv_none : s.captured ? fillT(W.pv_captured_text, { n: s.captured, of: s.urls, at: dmy(s.capturedAt) || '' }) : fillT(W.pv_captured_zero, { of: s.urls })}`,
    ]
    return `::: pv-box\n{.pv-h}\n${W.pv_title}\n\n${lines.map(l => `- ${l}`).join('\n')}\n\n{.more-line}\n[${W.pv_every}](${ctx.link(rel, `query/${p.id}/provenance/index.html`)})\n:::\n\n`
}
function badges(html, ctx, rel, p) {
    const st = state(ctx), target = ctx.link(rel, `query/${p.id}/provenance/index.html`).replace(/\.md$/, '.html')
    for (const c of st.idx.captures || []) {
        if (!c.ok || !c.image) continue
        const re = new RegExp(`(<a\\b[^>]*href="${reEsc(escHtml(c.url))}"[^>]*>[\\s\\S]*?</a>)`, 'g')
        html = html.replace(re, `$1<a class="pv-badge" href="${target}#c-${capKey(c)}" title="${escHtml(fillT(st.W.pv_badge_title, { at: c.captured_at, sha: c.image.sha256 }))}">${escHtml(c.image.sha256.slice(0, 8))}</a>`)
    }
    return html
}

// ---- the article's box
function articleBox(ctx, page) {
    const { W, byUrl } = state(ctx), slug = page.rel.replace(/^articles\/|\.html$/g, ''), src = `content/articles/${slug}.md`
    const h = history(ctx, src), m = page.meta || {}
    let sig = W.pv_art_unsigned
    try { const fp = ctx.readJSON(`articles/${slug}.md.sig`).fingerprint, k = keysOf(ctx).find(x => x.bundle && x.bundle.signing_fingerprint === fp)
        sig = fillT(W.pv_art_signed, { key: k ? k.id : fp, who: k ? k.agent || '' : '' }) } catch {}
    const links = [...new Set([...String(page.md || '').matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map(x => x[1]))]
    const caps = links.map(u => byUrl.get(u)).filter(c => c && c.ok)
    const lines = [
        `**${W.pv_made}** ${m.author || ''}, ${m.date ? dmy(String(m.date)) : ''}${h ? `; ${h.first ? fillT(W.pv_art_git, { first: h.first.at, who: h.first.who || '', n: h.count, last: h.last.at }) : fillT(W.pv_last, { last: h.last.at, who: h.last.who || '' })}` : ''}`,
        `**${W.pv_signed}** ${sig}`,
        `**${W.pv_collected}** ${fillT(W.pv_art_sources, { n: links.length, hosts: new Set(links.map(hostOf)).size })}`,
        `**${W.pv_captured}** ${!links.length ? W.pv_none : caps.length ? fillT(W.pv_captured_text, { n: caps.length, of: links.length, at: dmy(caps.map(c => c.captured_at).sort().pop()) || '' }) : fillT(W.pv_captured_zero, { of: links.length })}`,
        `**${W.pv_built}** ${String(ctx.VERSION).replace(/^v?/, 'v')}, ${dmy(ctx.TODAY)}`,
    ]
    return `::: pv-box pv-side\n{.pv-h}\n${W.pv_art_title}\n\n${lines.map(l => `- ${l}`).join('\n')}\n:::\n\n`
}

// ---- the provenance page per place
function provenancePage(ctx, p) {
    const rel = `query/${p.id}/provenance/index.html`, st = state(ctx), W = st.W, its = items(ctx, p), s = summary(ctx, p)
    const cell = v => (ctx.md.cell ? ctx.md.cell(String(v ?? '')) : String(v ?? '').replace(/\|/g, '\\|')).replace(/\n/g, ' ')
    let md = `${fillT(W.pv_page_intro, { name: p.name })}\n\n` + placeBox(ctx, p, rel)
    md += `{.facts}\n| | |\n|---|---|\n| ${W.pv_vault} | \`${st.idx.vault && st.idx.vault.name || ''}\` (${st.idx.vault && st.idx.vault.vault_id || ''}), ${st.idx.vault && st.idx.vault.endpoint || ''} |\n| ${W.pv_access} | ${cell(st.idx.vault && st.idx.vault.access || '')} |\n| ${W.pv_how} | ${cell(W.pv_how_text)} |\n| ${W.pv_tool} | \`board/team/data.places/tools/capture.mjs\` |\n| ${W.pv_data} | [${p.name}: the data](${ctx.link(rel, `query/${p.id}/index.html`)}) |\n\n`
    const KIND = { story: W.pv_k_story, map: W.pv_k_map, event: W.pv_k_event, gravity: W.pv_k_gravity, source: W.pv_k_source }
    for (const k of ['story', 'map', 'event', 'gravity', 'source']) {
        const list = its.filter(i => i.kind === k); if (!list.length) continue
        md += `## ${KIND[k]} {#${k}}\n\n{.pv-table}\n| ${W.pv_col_item} | ${W.pv_col_source} | ${W.pv_col_read} | ${W.pv_col_capture} |\n|---|---|---|---|\n`
        md += list.map(i => {
            const c = i.cap
            const cap = !c ? W.pv_not_yet : c.ok ? `${dmy(c.captured_at)}, ${c.status}: image \`${c.image.sha256.slice(0, 16)}\`, text \`${c.text.sha256.slice(0, 16)}\` {#c-${capKey(c)}}` : `${W.pv_failed}: ${cell(c.note || '')}`
            return `| ${cell(i.label)}${i.date ? ` (${dmy(i.date)})` : ''} | ${i.url ? `[${hostOf(i.url)}](${i.url})` : ''} | ${dmy(i.read_on) || ''} | ${cap} |`
        }).join('\n') + '\n\n'
    }
    md += `## ${W.pv_hashes_h} {#hashes}\n\n${W.pv_hashes_text}\n\n{.pv-table}\n| ${W.pv_col_source} | ${W.pv_col_path} | image sha256 | text sha256 |\n|---|---|---|---|\n`
    md += [...new Set(its.map(i => i.url))].map(u => st.byUrl.get(u)).filter(c => c && c.ok).map(c => `| ${cell(c.url)} | \`${c.image.path}\` | \`${c.image.sha256}\` | \`${c.text.sha256}\` |`).join('\n') + '\n'
    // an id on a table cell is not markdown: the {#c-..} anchors are made by postHtml below
    return { rel, title: `${p.name}: provenance`, summary: fillT(W.pv_page_summary, { name: p.name, n: s.captured, of: s.urls }), md, type: 'site', layout: 'wide', assets: ASSETS, src: `data/by-place/${p.id}.json`,
        crumbs: [['query/index.html', 'The data'], [`query/${p.id}/index.html`, p.name], [null, 'Provenance']],
        postHtml: html => html.replace(/\s*\{#(c-[0-9a-f]{12})\}/g, (m, id) => `<span id="${id}"></span>`) ,
        twinMd: md.replace(/\s*\{#c-[0-9a-f]{12}\}/g, '') }
}

export function pages(ctx) { return database(ctx).places.map(p => provenancePage(ctx, p)) }

export function decorate(page, ctx) {
    if (page.raw || typeof page.md !== 'string') return
    const db = database(ctx)
    const p = db.places.find(x => page.rel === `${x.path}index.html`)
    if (p) {
        // the box at the top of the side column (the second ::: col of the page's cols-8-4), else at the end
        const box = placeBox(ctx, p, page.rel), marks = [...page.md.matchAll(/^::: col\s*$/gm)]
        page.md = marks.length >= 2 ? page.md.slice(0, marks[1].index + marks[1][0].length) + '\n' + box + page.md.slice(marks[1].index + marks[1][0].length + 1) : page.md + '\n\n' + box
        const prev = page.postHtml; page.postHtml = h => badges(prev ? prev(h) : h, ctx, page.rel, p)
        page.assets = { css: [...(page.assets?.css || []), ...ASSETS.css], js: page.assets?.js || [] }
        return
    }
    if (/^articles\/[^/]+\.html$/.test(page.rel) && page.type === 'article') {
        // after the build renders the body; the signed twin is left as it was signed
        const box = ctx.md.render ? ctx.md.render(articleBox(ctx, page)) : null
        const html = box && (typeof box === 'string' ? box : box.html)
        if (!html) return
        const prev = page.postHtml; page.postHtml = h => html + (prev ? prev(h) : h)
        page.assets = { css: [...(page.assets?.css || []), ...ASSETS.css], js: page.assets?.js || [] }
    }
}

export function api(ctx) {
    const st = state(ctx), db = database(ctx)
    return db.places.map(p => ({ path: `api/v1/data/provenance/${p.id}.json`, schema: 'provenance-place', data: {
        about: fillT(st.W.pv_api_about, { name: p.name }), id: p.id, version: ctx.VERSION, built: ctx.TODAY, page: `query/${p.id}/provenance/index.html`,
        vault: st.idx.vault || null, summary: summary(ctx, p),
        items: items(ctx, p).map(i => ({ kind: i.kind, label: i.label, date: i.date || null, url: i.url || null, read_on: i.read_on || null,
            capture: i.cap ? { ok: !!i.cap.ok, captured_at: i.cap.captured_at, status: i.cap.status, note: i.cap.note || null, image: i.cap.image || null, text: i.cap.text || null } : null })),
    } }))
}
export const searchDocs = ctx => database(ctx).places.map(p => ({ id: `page:query/${p.id}/provenance/index.html`, url: `query/${p.id}/provenance/index.html`, title: `${p.name}: provenance`, type: 'site', date: ctx.TODAY, text: `${p.name} provenance sources captures screenshots read dates signature` }))
