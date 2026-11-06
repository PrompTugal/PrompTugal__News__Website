/* json-tools.js: two read-level page tools that give the chat and the search answer every JSON file of the API, not
 * only the page index: api.files (the manifest, filtered by words in the path) and api.read (one file under api/v1/,
 * optionally one part of it picked by a dotted path, and rows filtered by a word, capped). Files are fetched from this
 * site; nothing is sent anywhere. Descriptions are the model's instructions, not page words.
 */
(function (w) {
    'use strict'
    const Site = w.NRSite
    if (!Site) return
    const OK = /^api\/v1\/[a-z0-9][a-z0-9/_.-]*\.json$/i
    const fold = s => String(s == null ? '' : s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    const reg = (name, spec) => (w.__toolQueue = w.__toolQueue || []).push(['register', name, { level: 'read', owner: 'search', ...spec }])

    reg('api.files', {
        description: 'List the JSON files of the site API (api/v1/...), with their size and the feature that makes them. Optional "match": words that must all appear in the path. Use it to find which file holds what, then api.read.',
        params: { type: 'object', properties: { match: { type: 'string' }, limit: { type: 'integer', description: 'default 40, at most 100' } } },
        example: { match: 'newsroom desks' },
        async run(a) {
            const m = await Site.fetchJSON('api/v1/manifest.json')
            const ws = fold(a.match).split(/\s+/).filter(Boolean)
            const rows = m.files.filter(f => ws.every(x => fold(f.path).includes(x)))
            return { total: rows.length, files: rows.slice(0, Math.min(100, a.limit || 40)).map(f => ({ path: f.path, bytes: f.bytes, feature: f.feature })) }
        },
    })
    reg('api.read', {
        description: 'Read one JSON file under api/v1/ (path as api.files gives it). Big files are cut: pick a part with "pick" (a dotted path such as "nodes" or "types.0"), and for a list keep only the rows containing "match" (a word, accents and case ignored); "limit" caps the rows (default 20, at most 100).',
        params: { type: 'object', properties: { path: { type: 'string' }, pick: { type: 'string' }, match: { type: 'string' }, limit: { type: 'integer' } }, required: ['path'] },
        example: { path: 'api/v1/topics.json', match: 'security', limit: 5 },
        async run(a) {
            const path = String(a.path || '').replace(/^\/+/, '')
            if (!OK.test(path) || path.includes('..')) throw new Error('only JSON files under api/v1/ can be read')
            let j = await Site.fetchJSON(path)
            for (const k of String(a.pick || '').split('.').filter(Boolean)) { if (j == null || typeof j !== 'object' || !(k in j)) throw new Error(`nothing at "${a.pick}" (stopped at "${k}")`); j = j[k] }
            const limit = Math.min(100, a.limit || 20), word = fold(a.match)
            const rowsOf = x => Array.isArray(x) ? x : null
            let rows = rowsOf(j)
            if (!rows && j && typeof j === 'object') {
                const lists = Object.entries(j).filter(([, v]) => Array.isArray(v))
                if (lists.length === 1) { rows = lists[0][1]; j = { [lists[0][0]]: rows } }
            }
            if (rows) {
                const kept = word ? rows.filter(r => fold(JSON.stringify(r)).includes(word)) : rows
                return { path, rows_total: rows.length, rows_matching: kept.length, rows: kept.slice(0, limit) }
            }
            if (word && j && typeof j === 'object') { const keys = Object.keys(j).filter(k => fold(k + JSON.stringify(j[k])).includes(word)); return { path, keys_matching: keys.length, entries: Object.fromEntries(keys.slice(0, limit).map(k => [k, j[k]])) } }
            return { path, value: j }
        },
    })
})(window)
