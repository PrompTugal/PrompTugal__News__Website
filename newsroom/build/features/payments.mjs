// /payments/simulated/: a simulated payout to the sources (Dinis, 18 November 2026, about 15:35 UTC;
// board/guidance/2026-11-18-people-blogs-cyber-and-simulated-payments.md). The attribution ledger from what pages already
// carry (articles' outside links, place pages' source fields and live data), the model's assumptions from
// assets/payments/model.json, and "Your £5" worked out in the reader's browser from the meter's local log
// (assets/payments/mine.js): nothing about the reader is sent. Every page says no money moves. dev@PrompTugal.dinis.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
export const order = 59
const ROOT = new URL('../../../', import.meta.url)
const R = p => readFileSync(new URL(p, ROOT), 'utf8')
const OURS = /(^|\.)(promptugal\.news|sgit\.ai|sgraph\.ai|riskmandate\.ai|creativecommons\.org|github\.com|githubusercontent\.com|web\.archive\.org)$/i
const IMG = /\.(png|jpe?g|gif|webp|svg)(\?|$)/i

export const hostOf = u => { try { const h = new URL(u).hostname.toLowerCase().replace(/^www\./, ''); return OURS.test(h) ? null : h } catch { return null } }
// the meter logs location.pathname with index.html taken off
export const pathOf = rel => '/' + rel.replace(/(^|\/)index\.html$/, '$1')

// an article: each outside link is a cited fact, inside a quotation (a line starting ">") quoted words
export function fromArticle(md) {
    const out = new Map()
    for (const line of md.replace(/^---[\s\S]*?\n---\n/, '').split('\n')) {
        const quoted = /^\s*>/.test(line)
        for (const m of line.matchAll(/(?<!!)\[[^\]]*\]\((https?:\/\/[^)\s]+)\)|<(https?:\/\/[^>\s]+)>/g)) {
            const u = m[1] || m[2]; if (IMG.test(u)) continue
            const h = hostOf(u); if (!h) continue
            const kind = quoted ? 'quoted' : 'cited', k = h + '|' + kind
            out.set(k, (out.get(k) || 0) + 1)
        }
    }
    return out
}

// a place: every source_url (or source, link, url that is a web address) is discovery evidence; the live file is data
function fromPlace(id) {
    const out = new Map(), add = (u, kind) => { const h = hostOf(u); if (h) out.set(h + '|' + kind, (out.get(h + '|' + kind) || 0) + 1) }
    const walk = (o, kind) => { if (Array.isArray(o)) o.forEach(x => walk(x, kind)); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (typeof v === 'string' && /^(source_url|source|url|link|evidence_url|href)$/.test(k) && /^https?:\/\//.test(v)) add(v, kind); else walk(v, kind) } }
    try { walk(JSON.parse(R(`data/by-place/${id}.json`)), 'evidence') } catch { }
    try { walk(JSON.parse(R(`data/by-place/now/${id}.json`)), 'data') } catch { }
    return out
}

export function ledger(model) {
    const W = Object.fromEntries(Object.entries(model.weights).map(([k, v]) => [k, v.weight]))
    const pages = {}, sources = {}
    const put = (path, title, m) => {
        if (!m.size) return
        const per = {}
        for (const [k, n] of m) { const [h, kind] = k.split('|'); per[h] = (per[h] || 0) + W[kind] * n
            const s = sources[h] || (sources[h] = { host: h, pages: 0, weight: 0, kinds: {} }); s.weight += W[kind] * n; s.kinds[kind] = (s.kinds[kind] || 0) + n }
        for (const h of Object.keys(per)) sources[h].pages++
        pages[path] = { title, sources: Object.entries(per).map(([h, w]) => [h, Math.round(w * 100) / 100]).sort((a, b) => b[1] - a[1]) }
    }
    for (const f of readdirSync(new URL('content/articles/', ROOT)).filter(f => f.endsWith('.md'))) {
        const md = R(`content/articles/${f}`), t = (md.match(/^title:\s*"?(.*?)"?\s*$/m) || [])[1] || f
        if (/^free:\s*true\s*$/m.test(md.split('\n---')[0])) continue   // a free page is never in the simulated payments (rights@'s C6)
        put(pathOf(`articles/${f.replace(/\.md$/, '.html')}`), t, fromArticle(md))
    }
    let places = []; try { places = JSON.parse(R('data/by-place/places.json')).places } catch { }
    for (const p of places) if (p.path && existsSync(new URL(`data/by-place/${p.id}.json`, ROOT))) put(pathOf(p.path), p.name, fromPlace(p.id))
    const list = Object.values(sources).map(s => ({ ...s, weight: Math.round(s.weight * 100) / 100 })).sort((a, b) => b.weight - a.weight || a.host.localeCompare(b.host))
    return { pages, sources: list }
}

const money = (m, x) => m.symbol + x.toFixed(2)

export function pages(ctx) {
    const m = JSON.parse(R('assets/payments/model.json')), L = ledger(m)
    const pool = m.example_spend * (1 - m.kept_for_costs)
    const md = [
        `> **${m.banner}**`, ...m.intro,
        `## ${m.assumptions_heading} {#assumptions}`,
        `| Assumption | Value |\n|---|---|\n| Kept for costs | ${Math.round(m.kept_for_costs * 100)}% |\n| Shared with sources, of ${money(m, m.example_spend)} | ${money(m, pool)} |\n| Minimum before a payout | ${money(m, m.minimum_payout)} |\n` +
            Object.values(m.weights).map(w => `| Weight: ${w.label} (${w.about}) | ${w.weight} |`).join('\n'),
        `## ${m.mine_heading} {#mine}`, m.mine_about,
        `## ${m.ledger_heading} {#ledger}`, m.ledger_about,
        `**${L.sources.length}** sources behind **${Object.keys(L.pages).length}** pages.`,
        '| Source | Pages | Weight | Cited | Quoted | Data | Evidence |\n|---|---|---|---|---|---|---|\n' +
            L.sources.slice(0, m.ledger_top).map(s => `| [${s.host}](https://${s.host}/) | ${s.pages} | ${s.weight} | ${s.kinds.cited || 0} | ${s.kinds.quoted || 0} | ${s.kinds.data || 0} | ${s.kinds.evidence || 0} |`).join('\n'),
        `## ${m.how_heading} {#how}`, ...m.how.map(x => `- ${x}`).join('\n').split('\n\n'),
    ].join('\n\n')
    // bare (no obs.js, no meter, no site-wide script) with a meta CSP: the page reads the reader's log and must send nothing
    const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"
    return [{ rel: 'payments/simulated/index.html', src: 'assets/payments/model.json', type: 'site', title: m.title, summary: m.summary, md, bare: true,
        head: `<meta http-equiv="Content-Security-Policy" content="${csp}">\n<meta name="referrer" content="no-referrer">`,
        assets: { module: ['assets/payments/mine.js'], css: ['assets/payments/payments.css'] },
        postHtml: html => html.replace('<h2 id="ledger">', `<div id="mine" class="pay-mine"><p>${m.mine_no_js.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p></div>\n<h2 id="ledger">`) }]
}

export function api(ctx) {
    const m = JSON.parse(R('assets/payments/model.json')), L = ledger(m)
    return [{ path: 'api/v1/payments/attribution.json', schema: null, data: {
        about: m.api_about, simulated: m.banner, version: ctx.VERSION,
        model: { currency: m.currency, symbol: m.symbol, example_spend: m.example_spend, kept_for_costs: m.kept_for_costs, minimum_payout: m.minimum_payout, weights: m.weights },
        pages: L.pages, sources: L.sources } }]
}

// the banner on the page and in the data, and a ledger that found something
export function validate(gate) {
    let d; try { d = gate.json('api/v1/payments/attribution.json') } catch { return ['api/v1/payments/attribution.json is missing'] }
    const p = []
    if (!/no money moves/i.test(d.simulated || '')) p.push('the payments data does not say it is simulated')
    if (!d.sources.length) p.push('the payments ledger found no source')
    return p
}
