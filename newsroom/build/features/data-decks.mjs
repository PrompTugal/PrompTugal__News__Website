// Decks made from the data (data.places@PrompTugal.dinis, 15 November 2026; Dinis: "put this into visualizations, ways
// to present it, custom decks"): every slide is a query over the tables of /query/ (data-places.mjs), run by the
// build, and links to its query so it can be run, changed and checked. A deck is a page, query/decks/<id>/, shown as
// slides (arrow keys, Present for full screen, print or save as PDF one slide a page). The slides are data:
// assets/query/decks.json (a deck per place from its place_deck template, and the decks written for a meeting).
import { createRequire } from 'node:module'
import { database, runSQL } from './data-places.mjs'
const require = createRequire(import.meta.url)

export const order = 88
const FILE = 'assets/query/decks.json'
const ASSETS = { css: ['assets/query/deck.css'], js: ['assets/query/deck.js'] }
const fillT = (s, v) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined && v[k] !== null ? v[k] : (k in v ? '' : m))
// a value made safe for one line of markdown
const safe = v => v === null || v === undefined ? '' : String(v).replace(/\|/g, '/').replace(/[*_`]/g, '').replace(/\[/g, '(').replace(/\]/g, ')').replace(/\s+/g, ' ').trim()
const label = c => c.replace(/_/g, ' ').replace(/\bAI\b/i, 'AI')

function decksOf(ctx) {
    const D = ctx.readJSON(FILE), db = database(ctx)
    const named = (D.decks || []).map(d => ({ ...d, vars: {} }))
    const places = db.places.map(p => ({ id: p.id, place: p, title: `${p.name}: AI in context`, summary: `${p.name} on PrompTugal.news, as slides made from the data: its AI map, its stories, who it shares with the region, two steps out, provenance and gaps.`, slides: D.place_deck, vars: { place: p.id, name: p.name } }))
    return { named, places, all: [...named, ...places] }
}

function slideMd(ctx, rel, deck, s, i) {
    const v = { version: String(ctx.VERSION).replace(/^v?/, 'v'), today: ctx.TODAY, ...deck.vars }
    const sql = s.sql ? fillT(s.sql, v) : null
    let rows = [], cols = [], err = null
    if (sql) { try { const r = runSQL(ctx, sql); rows = r.rows; cols = r.columns } catch (e) { err = e.message } }
    const obj = r => Object.fromEntries(cols.map((c, k) => [c, r[k]]))
    const first = rows[0] ? obj(rows[0]) : {}
    let body = ''
    const empty = `{.pq-empty}\n${safe(fillT(s.empty || 'Nothing in the data yet.', v))}\n\n`
    if (err) body = `{.pq-empty}\n${safe(err)}\n\n`
    else if (s.kind === 'title') body = s.text ? `{.pq-lede}\n${safe(fillT(s.text, v))}\n\n` : ''
    else if (s.kind === 'text') body = rows.length || !sql ? `{.pq-lede}\n${safe(fillT(s.text, { ...v, ...Object.fromEntries(Object.entries(first).map(([k, x]) => [k, safe(x)])) }))}\n\n` : empty
    else if (s.kind === 'stat') body = rows.length ? `{.pq-figures}\n${cols.map(c => `- **${safe(first[c])}** ${safe(label(c))}`).join('\n')}\n\n` + (s.text ? `{.pq-note}\n${safe(fillT(s.text, v))}\n\n` : '') : empty
    else if (s.kind === 'list') body = rows.length ? `{.pq-items}\n${rows.slice(0, s.max || 8).map(r => `- ${fillT(s.item, Object.fromEntries(Object.entries(obj(r)).map(([k, x]) => [k, safe(x)])))}`).join('\n')}\n\n` + (rows.length > (s.max || 8) ? `{.pq-note}\n${rows.length - (s.max || 8)} more in the query.\n\n` : '') : empty
    else if (s.kind === 'table') body = rows.length ? `| ${cols.map(safe).join(' | ')} |\n|${cols.map(() => '---').join('|')}|\n${rows.slice(0, s.max || 8).map(r => `| ${r.map(safe).join(' | ')} |`).join('\n')}\n\n` : empty
    else if (s.kind === 'bars') {
        const list = rows.slice(0, s.max || 12), top = Math.max(1, ...list.map(r => +r[1] || 0))
        body = list.length ? `{.pq-bars}\n${list.map(r => `- ${safe(r[0])} \`${'█'.repeat(Math.max(0, Math.round(16 * (+r[1] || 0) / top))) || '·'}\` ${safe(r[1])}`).join('\n')}\n\n` : empty
    }
    const from = sql ? `{.pq-from}\n[${i + 1} · the query behind this slide](${ctx.link(rel, 'query/index.html')}#sql=${encodeURIComponent(sql).replace(/[()'*!]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())})\n` : `{.pq-from}\n${i + 1}\n`
    return `::: pq-slide pq-${s.kind}\n${s.kicker ? `{.pq-kicker}\n${safe(fillT(s.kicker, v))}\n\n` : ''}{.pq-stitle}\n${safe(fillT(s.title, v))}\n\n${body}${from}:::\n\n`
}

function deckPage(ctx, deck) {
    const rel = `query/decks/${deck.id}/index.html`
    let md = `{.pq-deckbar}\n${deck.for ? `For ${safe(deck.for)}. ` : ''}${deck.slides.length} slides, made from the data at build ${String(ctx.VERSION).replace(/^v?/, 'v')}. Arrow keys to move; Present for full screen; print to save it as a PDF.\n\n`
    md += `::: pq-deck\n` + deck.slides.map((s, i) => slideMd(ctx, rel, deck, s, i)).join('') + `:::\n`
    return { rel, title: deck.title, summary: deck.summary, md, type: 'site', layout: 'wide', assets: ASSETS, toc: false,
        crumbs: [['query/index.html', 'The data'], ['query/decks/index.html', 'Decks'], [null, deck.title]] }
}
function indexPage(ctx) {
    const rel = 'query/decks/index.html', { named, places } = decksOf(ctx)
    let md = `Slides made from PrompTugal.news's data. Every slide is a query over the tables of [the data](${ctx.link(rel, 'query/index.html')}), run when the site is built, and links to its query, so a figure on a slide can be checked, changed and run again. A deck is written as data, \`assets/query/decks.json\`: a new one is a list of slides, each a title and a query.\n\n`
    md += `## For meetings {#meetings}\n\n{.rows}\n${named.map(d => `- [${safe(d.title)}](${ctx.link(rel, `query/decks/${d.id}/index.html`)})${d.for ? `: for ${safe(d.for)}` : ''}`).join('\n')}\n\n`
    md += `## A deck per place {#places}\n\nLoulé and Faro first, then every place.\n\n{.chip-list}\n${[...places].sort((a, b) => (['loule', 'faro'].indexOf(b.id) + 1 ? 1 : 0) - (['loule', 'faro'].indexOf(a.id) + 1 ? 1 : 0)).map(d => `- [${safe(d.place.name)}](${ctx.link(rel, `query/decks/${d.id}/index.html`)})`).join('\n')}\n\n`
    return { rel, title: 'Decks from the data', summary: 'Slides made from PrompTugal.news\'s data, every figure a query you can run: for meetings, and one per place.', md, type: 'site', crumbs: [['query/index.html', 'The data'], [null, 'Decks']] }
}

export function pages(ctx) { return [indexPage(ctx), ...decksOf(ctx).all.map(d => deckPage(ctx, d))] }

export const fill = {
    'data:decks': (page, ctx) => { const { named } = decksOf(ctx)
        return `{.rows}\n${named.map(d => `- [${safe(d.title)}](${ctx.link(page.rel, `query/decks/${d.id}/index.html`)})${d.for ? `: for ${safe(d.for)}` : ''}`).join('\n')}\n- [Every deck, one per place](${ctx.link(page.rel, 'query/decks/index.html')})\n\n` },
}

export const searchDocs = ctx => decksOf(ctx).all.map(d => ({ id: `page:query/decks/${d.id}/index.html`, url: `query/decks/${d.id}/index.html`, title: d.title, type: 'site', date: ctx.TODAY, text: `deck slides ${d.title} ${d.summary}` }))

// the gate: every slide's query runs on the served tables
export function validate(gate) {
    const SQL = require('../../../assets/query/sql.js'), PTGraph = require('../../../assets/query/graph.js'), fs = require('node:fs')
    const D = JSON.parse(fs.readFileSync(`${gate.ROOT}/${FILE}`, 'utf8')), idx = gate.json('api/v1/data/index.json'), tables = {}
    for (const t of idx.tables) { const f = gate.json(t.url); tables[t.name] = { columns: f.columns.map(c => c.name), rows: f.rows } }
    const db = { tables }; db.functions = PTGraph.functions(db)
    const out = [], v = { version: 'v0', today: '' }
    for (const d of D.decks || []) d.slides.forEach((s, i) => { if (s.sql) try { SQL.run(fillT(s.sql, v), db) } catch (e) { out.push(`deck ${d.id}, slide ${i + 1}: ${e.message}`) } })
    for (const p of idx.places) D.place_deck.forEach((s, i) => { if (s.sql) try { SQL.run(fillT(s.sql, { ...v, place: p.id, name: p.name }), db) } catch (e) { out.push(`deck ${p.id}, slide ${i + 1}: ${e.message}`) } })
    return out
}
