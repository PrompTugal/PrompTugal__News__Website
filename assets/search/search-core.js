/* search-core.js: the newsroom's search, the half that has no DOM.
 *
 * One file, two homes: the build (newsroom/build/features/search.mjs) requires it to tokenise the pages and write the
 * index; the browser loads it as a plain script (window.NRSearchCore) to read the index and rank. Ported from
 * newsroom.sgit.ai's assets/search/search.js (fold, stem, BM25 over weighted fields), changed for a sharded index:
 *
 *   api/v1/search/docs.json         one row per page: [id, type, title, summary, url, facets, extra], plus the facet
 *                                   labels, the synonyms and the list of shards; loaded first, enough for titles
 *   api/v1/search/terms/<xx>.json   the postings of every term starting with the two letters xx: { term: [doc, score,
 *                                   doc, score, ...] }, the score already weighted by field (title > aliases > headings
 *                                   > facets > body) and saturated (BM25F); a query loads only the shards it needs
 *
 * Words are folded (case and accents: Conceição is conceicao), lightly stemmed (agents agent, stories story), the last
 * word of a query is also read as a prefix (results as you type), and synonyms from the data and a short hand list
 * widen a word. Nothing is sent anywhere: the files are fetched from this site and the ranking runs in the page.
 */
(function (root, factory) {
    const api = factory()
    if (typeof module === 'object' && module.exports) module.exports = api
    else root.NRSearchCore = api
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'

    const STOP = new Set(('a an and are as at be but by for from has have had i in is it its of on or that the this to was were will with not no do does did ' +
        'you your we our they their he she his her them what which who whom how why when where than then so if into about over under after before can could ' +
        'would should may might there here these those been being also just only more most very').split(' '))
    // the fields of a page and their weights; b is how much a long field is discounted (only the body)
    const FIELDS = { title: { w: 8, b: 0 }, alias: { w: 5, b: 0 }, heads: { w: 3, b: 0 }, facet: { w: 2, b: 0 }, body: { w: 1, b: 0.75 } }
    const K1 = 1.2
    const TYPE_BOOST = { topic: 1.15, article: 1.1, company: 1.05, event: 1, person: 1, story: 0.95, place: 0.9, site: 0.9, organisation: 0.85 }
    const TYPE_LABEL = { company: 'Company', event: 'Event', person: 'Person', organisation: 'Organisation', topic: 'Topic', place: 'Place', article: 'Article', site: 'Page', story: 'Story' }
    const TYPE_PLURAL = { company: 'Companies', event: 'Events', person: 'People', organisation: 'Organisations', topic: 'Topics', place: 'Places', article: 'Articles', site: 'Pages', story: 'Stories' }

    const LETTERS = { 'ø': 'o', 'æ': 'ae', 'œ': 'oe', 'ß': 'ss', 'ł': 'l', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'ı': 'i' }
    const fold = s => String(s == null ? '' : s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[øæœßłđðþı]/g, c => LETTERS[c])
    const words = s => fold(s).match(/[a-z0-9]+/g) || []
    function stem(w) {
        if (w.length <= 3 || /^\d+$/.test(w)) return w
        if (w.endsWith('ies') && w.length > 4) w = w.slice(0, -3) + 'y'
        else if (w.endsWith('sses')) w = w.slice(0, -2)
        else if (/(ss|us|is)$/.test(w)) { /* keep */ }
        else if (/(ch|sh|x|z)es$/.test(w)) w = w.slice(0, -2)
        else if (w.endsWith('s')) w = w.slice(0, -1)
        if (w.endsWith('ing') && w.length > 5) { w = w.slice(0, -3); if (/([^lsz])\1$/.test(w)) w = w.slice(0, -1) }
        else if (w.endsWith('ed') && w.length > 4) { w = w.slice(0, -2); if (/([^lsz])\1$/.test(w)) w = w.slice(0, -1) }
        else if (w.endsWith('ly') && w.length > 5) w = w.slice(0, -2)
        if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1)
        return w
    }
    const terms = s => words(s).map(stem).filter(t => t.length >= 2)
    const shardOf = t => t.slice(0, 2)

    /* ------------------------------------------------------------------ the build side: pages -> docs and shards */

    /**
     * @param {Array} pages  [{ id, type, title, summary, url, facets, extra, fields: { title, alias, heads, facet, body } }]
     * @param {object} opts  { synonyms: { word: [words] } }
     * @returns {{ docs: Array, shards: Object<string, Object<string, number[]>>, syn: Object }}
     */
    function buildIndex(pages, opts) {
        opts = opts || {}
        const N = pages.length
        const avg = {}
        const tfs = pages.map(p => {
            const out = {}
            for (const f of Object.keys(FIELDS)) {
                const ts = terms(p.fields[f] || '')
                const tf = new Map()
                for (const t of ts) tf.set(t, (tf.get(t) || 0) + 1)
                out[f] = { tf, len: ts.length }
                avg[f] = (avg[f] || 0) + ts.length / Math.max(1, N)
            }
            return out
        })
        const post = new Map()   // term -> [[doc, score]]
        tfs.forEach((byField, i) => {
            const acc = new Map()
            for (const [f, { w, b }] of Object.entries(FIELDS)) {
                const { tf, len } = byField[f]
                const norm = 1 - b + b * (len / Math.max(1, avg[f] || 1))
                for (const [t, n] of tf) acc.set(t, (acc.get(t) || 0) + w * n / norm)
            }
            for (const [t, x] of acc) {
                const s = Math.round(100 * x * (K1 + 1) / (x + K1))
                if (!post.has(t)) post.set(t, [])
                post.get(t).push([i, s])
            }
        })
        const shards = {}
        for (const t of [...post.keys()].sort()) {
            const k = shardOf(t)
            if (!/^[a-z0-9]{2}$/.test(k)) continue
            shards[k] = shards[k] || {}
            shards[k][t] = post.get(t).flat()
        }
        const syn = {}
        for (const [w, list] of Object.entries(opts.synonyms || {})) {
            const k = stem(fold(w))
            syn[k] = [...new Set([...(syn[k] || []), ...list.flatMap(x => terms(x))])].filter(x => x !== k)
        }
        const docs = pages.map(p => [p.id, p.type, p.title, p.summary || '', p.url, p.facets || {}, p.extra || {}])
        return { docs, shards, syn }
    }

    /* ------------------------------------------------------------------ the query side */

    function parseQuery(q) {
        const raw = String(q || '')
        const ws = words(raw)
        let kept = ws.filter(w => !STOP.has(w))
        if (!kept.length) kept = ws
        const open = ws.length > 0 && !/\s$/.test(raw)
        return { raw, words: kept, last: open ? ws[ws.length - 1] : null, phrase: ws.join(' ') }
    }

    const docObj = (row, i) => ({ i, id: row[0], type: row[1], title: row[2], summary: row[3], url: row[4], facets: row[5] || {}, extra: row[6] || {} })

    /**
     * A search engine over the index files. fetchJSON(path) returns a Promise of the parsed file; path is relative to
     * the site's root (api/v1/search/docs.json). Each file is fetched once.
     */
    function createEngine(fetchJSON, base) {
        base = base || 'api/v1/search/'
        const cache = new Map()
        const load = p => { if (!cache.has(p)) cache.set(p, fetchJSON(base + p).catch(e => { cache.delete(p); throw e })); return cache.get(p) }
        const stats = { files: new Set() }
        const docsFile = () => load('docs.json').then(d => { stats.files.add('docs.json'); return d })
        const shard = (k, have) => have.has(k) ? load('terms/' + k + '.json').then(s => { stats.files.add('terms/' + k + '.json'); return s }) : Promise.resolve({ t: {} })

        async function query(q, opts) {
            opts = opts || {}
            const limit = opts.limit || 20
            const d = await docsFile()
            const pq = parseQuery(q)
            if (!pq.words.length) return { query: q, total: 0, results: [], facets: {}, shards: [] }
            const have = new Set(d.shards)
            const syn = d.syn || {}
            // each query word: the vocabulary terms it may stand for, with a weight
            const plan = pq.words.map(w => {
                const forms = [[stem(w), 1]]
                for (const s of syn[stem(w)] || []) forms.push([s, 0.7])
                return { w, forms, prefix: (w === pq.last && w.length >= 2) || w.length >= 4 ? w : null }
            })
            const keys = new Set()
            for (const p of plan) { for (const [t] of p.forms) keys.add(shardOf(t)); if (p.prefix) keys.add(shardOf(p.prefix)) }
            const shards = {}
            await Promise.all([...keys].filter(k => k.length === 2).map(k => shard(k, have).then(s => { shards[k] = s.t || {} })))
            const N = d.docs.length
            const idf = df => Math.log(1 + (N - df + 0.5) / (df + 0.5))
            const perWord = plan.map(p => {
                const best = new Map()   // doc -> score for this word
                const add = (t, weight) => {
                    const list = (shards[shardOf(t)] || {})[t]
                    if (!list) return false
                    const f = idf(list.length / 2) * weight
                    for (let j = 0; j < list.length; j += 2) {
                        const s = f * list[j + 1] / 100
                        if (s > (best.get(list[j]) || 0)) best.set(list[j], s)
                    }
                    return true
                }
                let exact = false
                for (const [t, wt] of p.forms) exact = add(t, wt) || exact
                if (p.prefix && (p.prefix === pq.last || !exact)) {
                    const sh = shards[shardOf(p.prefix)] || {}
                    const cands = Object.keys(sh).filter(t => t !== stem(p.w) && t.startsWith(p.prefix)).sort((a, b) => sh[b].length - sh[a].length).slice(0, 80)
                    for (const t of cands) add(t, 0.75)
                }
                return best
            })
            const scores = new Map(), hits = new Map()
            for (const best of perWord) for (const [i, s] of best) { scores.set(i, (scores.get(i) || 0) + s); hits.set(i, (hits.get(i) || 0) + 1) }
            const phrase = pq.phrase
            let all = [...scores.entries()].map(([i, s]) => {
                const doc = docObj(d.docs[i], i)
                const cover = hits.get(i) / plan.length
                let score = s * cover * cover * (TYPE_BOOST[doc.type] || 1)
                const ft = words(doc.title).join(' ')
                if (ft === phrase) score *= 2.5
                else if (ft.startsWith(phrase)) score *= 2.0              // the title starts with what is being typed ("rep" -> Replit)
                else if ((' ' + ft).includes(' ' + phrase)) score *= 1.4
                return { doc, score }
            })
            all.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
            // facet counts: for each facet, over what the other filters keep (so a count is what a click would give)
            const matched = all.map(r => r.doc), facets = {}
            for (const k of ['type', 'topic', 'country', 'organiser', 'day']) { const f = Object.assign({}, opts); delete f[k]; facets[k] = countFacets(matched.filter(x => keep(x, f)))[k] }
            all = all.filter(r => keep(r.doc, opts))
            return { query: q, total: all.length, results: all.slice(0, limit), facets, shards: [...keys].sort(), words: pq.words }
        }

        return { query, docs: docsFile, stats, load }
    }

    function keep(doc, f) {
        if (f.type && (Array.isArray(f.type) ? !f.type.includes(doc.type) : doc.type !== f.type)) return false
        const fc = doc.facets || {}
        if (f.topic && !(fc.tp || []).includes(f.topic)) return false
        if (f.country && fold(fc.c || '') !== fold(f.country)) return false
        if (f.organiser && fc.o !== f.organiser) return false
        if (f.day && !(fc.d || []).includes(f.day)) return false
        return true
    }

    function countFacets(docs) {
        const out = { type: {}, topic: {}, country: {}, organiser: {}, day: {} }
        const inc = (m, k) => { if (k) m[k] = (m[k] || 0) + 1 }
        for (const d of docs) {
            inc(out.type, d.type)
            for (const t of d.facets.tp || []) inc(out.topic, t)
            inc(out.country, d.facets.c)
            inc(out.organiser, d.facets.o)
            for (const x of d.facets.d || []) inc(out.day, x)
        }
        return out
    }

    /** The text as [[part, matched?], ...], marking the query's words (and words they begin). */
    function mark(text, qwords) {
        const t = String(text || '')
        if (!qwords || !qwords.length) return [[t, false]]
        const out = []
        const re = /[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu
        let m
        while ((m = re.exec(t))) {
            const tok = m[0], f = fold(tok)
            const hit = /[\p{L}\p{N}]/u.test(tok) && qwords.some(w => f.startsWith(w) || stem(f) === stem(w))
            if (out.length && out[out.length - 1][1] === hit) out[out.length - 1][0] += tok
            else out.push([tok, hit])
        }
        return out
    }

    /** The `search` tool for window.__tool (registered by search.js; used as is by newsroom/tests/chat.test.mjs). */
    function searchTool(engine, base) {
        base = base || ''
        return {
            level: 'read', owner: 'search',
            description: 'Search the whole newsroom (companies, sessions and other events, people, organisations, topics, places, articles, pages). Words are matched by prefix, accents ignored. Filters: type, topic (topic id), country, organiser (web-summit or other), day (YYYY-MM-DD). Returns refs to pass to get_entity or neighbours.',
            params: { type: 'object', properties: { query: { type: 'string' }, type: { type: 'string', description: 'company, event, person, organisation, topic, place, article or site' }, topic: { type: 'string' }, country: { type: 'string' }, organiser: { type: 'string', enum: ['web-summit', 'other'] }, day: { type: 'string', description: 'YYYY-MM-DD' }, limit: { type: 'integer', description: 'default 8, at most 30' } }, required: ['query'] },
            example: { query: 'security', type: 'company' },
            async run(a) {
                const r = await engine.query(a.query, { type: a.type, topic: a.topic, country: a.country, organiser: a.organiser, day: a.day, limit: Math.min(30, a.limit || 8) })
                const facets = {}
                for (const [k, m] of Object.entries(r.facets || {})) if (Object.keys(m).length > 1) facets[k] = m
                return {
                    query: a.query, total: r.total,
                    results: r.results.map(x => ({ ref: x.doc.id, type: x.doc.type, title: x.doc.title, summary: x.doc.summary, url: base + x.doc.url, ...(x.doc.type === 'event' && x.doc.extra.s ? { when: `${(x.doc.facets.d || [])[0] || ''} ${x.doc.extra.s}${x.doc.extra.e ? '-' + x.doc.extra.e : ''}`.trim(), where: x.doc.extra.w } : {}) })),
                    facets,
                }
            },
        }
    }

    return { STOP, FIELDS, TYPE_LABEL, TYPE_PLURAL, fold, words, stem, terms, shardOf, buildIndex, parseQuery, createEngine, keep, countFacets, mark, docObj, searchTool }
})
