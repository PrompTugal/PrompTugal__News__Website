#!/usr/bin/env node
// Wikipedia, read as data (board/projects/wikipedia.md; ontologist@PrompTugal.dinis, 6 November 2026, at Dinis's word;
// the model is the PHP newsroom's /wikipedia/ section, refs.php.oct.2026.newsroom.sgit.ai/wikipedia/). For dev@ to own.
//
//   node newsroom/tools/wikipedia.mjs <Article_title> [--id <slug>]     fetch, parse, write data/wikipedia/<slug>/
//
// One English Wikipedia article at its latest revision, through the MediaWiki API (action=parse and action=query,
// a named User-Agent, no key), written as five files:
//   article.json     the article: title, url, revision id and time, length, revision count and first edit, the
//                    Wikidata item, categories, languages, sections, and the licence (CC BY-SA 4.0, by the article's
//                    contributors; the revision id is the attribution)
//   statements.json  one per sentence of prose, by section, classed by wording (never by whether it holds):
//                    record, stated, attributed, quote, hedged (the PHP newsroom's five classes), with the
//                    references each cites
//   references.json  every reference: its number, url, title, work or publisher, date, access date, archive url,
//                    and which statements cite it
//   tables.json      every wikitable (the timeline of editions is one), as rows of cells
//   links.json       the article's links to other articles (Wikipedia's own graph) and to the web
// No editor's name is kept: the history is counted (revisions per year), not attributed (privacy first).
// Re-running replaces the five files; the revision id says which text they come from. Prints counts, writes nothing else.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const API = 'https://en.wikipedia.org/w/api.php'
const UA = 'PrompTugal.news-ontologist/0.1 (https://promptugal.news/; the newsroom reads Wikipedia as data)'
const args = process.argv.slice(2), title = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--id')
if (!title) { console.error('usage: node newsroom/tools/wikipedia.mjs <Article_title> [--id <slug>]'); process.exit(2) }
const slug = args.includes('--id') ? args[args.indexOf('--id') + 1] : title.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const get = async q => { const r = await fetch(`${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...q })}`, { headers: { 'user-agent': UA } }); if (!r.ok) throw new Error(`${r.status} for ${JSON.stringify(q)}`); return r.json() }
const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z')

// ---- text helpers
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…' }
const decode = s => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&([a-z]+);/g, (m, n) => ENT[n] ?? m)
const text = h => decode(h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0 } return h.toString(16).padStart(8, '0') }

// ---- the five classes, by wording (as the PHP newsroom defines them)
const ATTRIB = /\b(said|says|stated|states|told|according to|reported|reports|announced|claimed|claims|argued|wrote|described|called|estimated by|believes?|criticis|criticiz|accused|alleged|denied|apologi[sz]ed)\b/i
const HEDGE = /\b(may|might|could|reportedly|allegedly|is believed|are believed|estimated|approximately|about \d|around \d|nearly|some|several|many|often|likely|possibly|appears?|seems?)\b/i
const RECORD = /\b(1[89]\d\d|20\d\d)\b|\b\d[\d,.]*\s*(%|per cent|percent|attendees|people|companies|startups|investors|countries|million|billion)\b/i
function classify(s) {
    if (/[“"][^”"]{12,}[”"]/.test(s)) return 'quote'
    if (ATTRIB.test(s)) return 'attributed'
    if (HEDGE.test(s)) return 'hedged'
    if (RECORD.test(s)) return 'record'
    return 'stated'
}

const parse = (await get({ action: 'parse', page: title, prop: 'text|sections|links|externallinks|categories|revid|langlinks|displaytitle', redirects: '1' })).parse
const q = (await get({ action: 'query', titles: parse.title, prop: 'revisions|info|pageprops', rvlimit: '500', rvprop: 'ids|timestamp|size', inprop: 'url' })).query.pages[0]
const html = parse.text, revid = parse.revid
const rev = q.revisions.find(r => r.revid === revid) || q.revisions[0]

// ---- references: the rendered list, numbered as the article numbers them
const references = []
const refList = [...html.matchAll(/<li id="cite(?:_|&#95;)note-([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)].map(([m, note, b]) => [m, decode(note), b])
refList.forEach(([, note, body], i) => {
    const cite = /<cite[^>]*>([\s\S]*?)<\/cite>/.exec(body)?.[1] || /<span class="reference-text">([\s\S]*)<\/span>/.exec(body)?.[1] || body
    const links = [...cite.matchAll(/<a[^>]*class="external[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => ({ url: decode(m[1]), label: text(m[2]) }))
    const main = links.find(l => !/web\.archive\.org|archive\.(org|today|ph|is)/.test(l.url)) || null
    const arch = links.find(l => /web\.archive\.org|archive\.(org|today|ph|is)/.test(l.url)) || null
    const t = text(cite)
    references.push({
        n: i + 1, note, url: main ? main.url : null, title: main ? main.label.replace(/^"|"$/g, '') : null,
        work: (/<i>([\s\S]*?)<\/i>/.exec(cite) || [])[1] ? text(/<i>([\s\S]*?)<\/i>/.exec(cite)[1]) : null,
        date: (t.match(/\((\d{1,2} \w+ \d{4}|\w+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2}|\w+ \d{4})\)/) || [])[1] || null,
        accessed: (t.match(/Retrieved (\d{1,2} \w+ \d{4}|\w+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2})/) || [])[1] || null,
        archive: arch ? arch.url : null, text: t, cited_by: [],
    })
})
const refByNote = new Map(references.map(r => [r.note, r]))

// ---- statements: the prose paragraphs, by section heading, split into sentences, with their [n] markers
const statements = []
let section = 'Lead'
const body = html.split(/<div class="mw-references-wrap|<ol class="references"/)[0]
for (const m of body.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>|<p>([\s\S]*?)<\/p>|<li>([\s\S]*?)<\/li>/g)) {
    if (m[2]) { section = text(m[2]).replace(/\[edit\]$/, '').trim(); continue }
    const para = m[3] ?? null
    if (para == null) continue                                     // list items are links and navigation, not prose
    const marked = para.replace(/<sup[^>]*class="reference"[^>]*>[\s\S]*?href="#cite_note-([^"]+)"[\s\S]*?<\/sup>/g, ' ⟦$1⟧ ')
    const plain = text(marked)
    if (plain.length < 30) continue
    // a sentence ends at . ! or ? and keeps the citation markers that follow it
    for (const raw of plain.replace(/([.!?][”"]?)((?:\s*⟦[^⟧]+⟧)*)\s+(?=[A-Z“"(])/g, '$1$2\u0001').split('\u0001')) {
        const notes = [...raw.matchAll(/⟦([^⟧]+)⟧/g)].map(x => x[1])
        const sentence = raw.replace(/\s*⟦[^⟧]+⟧\s*/g, ' ').replace(/\s+([.,;:])/g, '$1').replace(/\s+/g, ' ').trim()
        if (sentence.length < 20) continue
        const refs = [...new Set(notes.map(n => refByNote.get(n)?.n).filter(Boolean))]
        const id = hash(sentence)
        statements.push({ id, section, class: classify(sentence), text: sentence, refs })
        for (const n of refs) references[n - 1].cited_by.push(id)
    }
}
// a statement whose sentence has no marker but whose paragraph closes with one is cited by it in Wikipedia's practice;
// we keep only what the marker shows, so an uncited sentence stays uncited here (as the article shows it)

// ---- tables
const tables = [...body.matchAll(/<table class="wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/g)].map(([, t], i) => {
    const caption = text(/<caption>([\s\S]*?)<\/caption>/.exec(t)?.[1] || '') || null
    const rows = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(([, r]) => [...r.matchAll(/<t([hd])([^>]*)>([\s\S]*?)<\/t[hd]>/g)].map(([, k, attr, c]) => ({ head: k === 'h', text: text(c.replace(/<sup[\s\S]*?<\/sup>/g, '')), rowspan: +((/rowspan="(\d+)"/.exec(attr) || [])[1] || 1) })))
    // fill rowspans so every row has every column, as the reader sees it
    const out = [], carry = []
    for (const r of rows) {
        const row = []; let k = 0
        for (let col = 0; r.length || carry[col]; col++) {
            if (carry[col] && carry[col].left > 0) { row.push(carry[col].text); carry[col].left--; continue }
            const c = r.shift(); if (!c) break
            row.push(c.text); if (c.rowspan > 1) carry[col] = { text: c.text, left: c.rowspan - 1 }
            k++
        }
        out.push(row)
    }
    return { n: i + 1, caption, header: out[0] || [], rows: out.slice(1) }
})

// ---- links (Wikipedia's graph) and the article's record
const links = { articles: parse.links.filter(l => l.ns === 0 && l.exists).map(l => l.title).sort(), external: [...new Set(parse.externallinks)].sort() }
const years = {}; for (const r of q.revisions) years[r.timestamp.slice(0, 4)] = (years[r.timestamp.slice(0, 4)] || 0) + 1
const counts = statements.reduce((o, s) => (o[s.class] = (o[s.class] || 0) + 1, o), {})
const LICENCE = `CC BY-SA 4.0, by the contributors to the English Wikipedia article "${parse.title}"; revision ${revid} is the attribution (https://en.wikipedia.org/w/index.php?oldid=${revid})`
const head = (kind, extra = {}) => ({ $schema: `../../schemas/wikipedia-${kind}.schema.json`, article: slug, revid, read_at: now, read_by: 'ontologist@PrompTugal.dinis', licence: LICENCE, ...extra })
const dir = path.join(ROOT, 'data/wikipedia', slug)
fs.mkdirSync(dir, { recursive: true })
const W = (f, o) => fs.writeFileSync(path.join(dir, f), JSON.stringify(o, null, 2) + '\n')
W('article.json', {
    ...head('article'), id: slug, type: 'wikipedia-article', title: parse.title, url: q.fullurl, oldid_url: `https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(parse.title.replace(/ /g, '_'))}&oldid=${revid}`,
    revision_at: rev.timestamp, length: q.length, wikidata: q.pageprops?.wikibase_item || null,
    history: { revisions_read: q.revisions.length, complete: q.revisions.length < 500, first_edit: q.revisions.at(-1).timestamp, per_year: years },
    categories: parse.categories.filter(c => !c.hidden).map(c => c.category.replace(/_/g, ' ')), languages: parse.langlinks.map(l => l.lang).sort(),
    sections: parse.sections.map(s => ({ level: s.toclevel, title: text(s.line) })),
    counts: { statements: statements.length, by_class: counts, uncited: statements.filter(s => !s.refs.length).length, references: references.length, tables: tables.length, links_to_articles: links.articles.length, links_to_web: links.external.length },
})
W('statements.json', { ...head('statements'), statements })
W('references.json', { ...head('references'), references })
W('tables.json', { ...head('tables'), tables })
W('links.json', { ...head('links'), ...links })
console.log(`wikipedia: ${parse.title} rev ${revid}: ${statements.length} statements (${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}), ${references.length} references, ${tables.length} tables, ${links.articles.length} links to articles -> data/wikipedia/${slug}/`)
