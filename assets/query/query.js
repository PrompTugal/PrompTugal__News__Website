/* The query page (data.places@PrompTugal.dinis, 15 November 2026): a SQL box over this site's own JSON tables
 * (api/v1/data/), run in the browser by assets/query/sql.js and graph.js. Nothing is sent anywhere: the tables are
 * fetched from this site, and the query never leaves the page. Each example's code block gets a Run button.
 * A query can be shared as a link (#sql=...). Tools: data.query, data.tables (window.__tool).
 */
(function () {
    'use strict'
    const mount = document.querySelector('.pq-mount')
    if (!mount || !window.PTSQL) return
    const scriptSrc = (document.currentScript && document.currentScript.src) || [...document.scripts].map(s => s.src).find(s => /assets\/query\/query\.js/.test(s)) || ''
    const ROOT = scriptSrc.replace(/assets\/query\/query\.js.*$/, '')
    const scope = (/scope: place = '([a-z-]+)'/.exec(mount.textContent) || [])[1] || null

    let INDEX = null
    const TABLES = {}, pending = {}
    const getJSON = url => fetch(ROOT + url, { credentials: 'omit' }).then(r => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json() })
    const index = () => INDEX ? Promise.resolve(INDEX) : getJSON('api/v1/data/index.json').then(j => (INDEX = j))
    function table(name) {
        if (TABLES[name]) return Promise.resolve(TABLES[name])
        if (!pending[name]) pending[name] = index().then(ix => { const t = ix.tables.find(x => x.name === name); if (!t) throw new Error(`no table ${name}`); return getJSON(t.url) })
            .then(f => (TABLES[name] = { columns: f.columns.map(c => c.name), rows: f.rows }))
        return pending[name]
    }
    // the tables a query names (and the graph's two when it walks the graph)
    async function load(sql) {
        const ix = await index(), names = new Set(ix.tables.map(t => t.name.toLowerCase())), want = new Set()
        let toks = []; try { toks = PTSQL.tokenize(sql) } catch (e) { /* the run reports it */ }
        for (const t of toks) if (t.t === 'id') { const l = t.v.toLowerCase(); if (names.has(l)) want.add(l); if (l === 'neighbours' || l === 'paths') { want.add('nodes'); want.add('edges') } }
        await Promise.all([...want].map(table))
        const db = { tables: {} }
        for (const n of Object.keys(TABLES)) db.tables[n] = TABLES[n]
        db.functions = window.PTGraph ? PTGraph.functions(db) : {}
        return db
    }
    async function runQuery(sql) { const db = await load(sql); return PTSQL.run(sql, db) }

    // ---- the box
    const el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v) } for (const k of kids) if (k !== null && k !== undefined) e.append(k); return e }
    const first = document.querySelector('pre.pq-example code')
    const start = (location.hash.startsWith('#sql=') && decodeURIComponent(location.hash.slice(5))) || (first ? first.textContent.trim() : 'SELECT * FROM places')
    const box = el('textarea', { class: 'pq-sql', spellcheck: 'false', rows: '8', 'aria-label': 'SQL query' })
    box.value = start
    const status = el('span', { class: 'pq-status', role: 'status' })
    const out = el('div', { class: 'pq-out' })
    const chips = el('div', { class: 'pq-tables' }, el('span', { class: 'pq-label' }, 'Tables: '))
    const runBtn = el('button', { type: 'button', class: 'pq-run', onclick: () => go() }, 'Run')
    const shareBtn = el('button', { type: 'button', class: 'pq-btn', onclick: share }, 'Copy link')
    const csvBtn = el('button', { type: 'button', class: 'pq-btn', onclick: () => download('csv'), disabled: '' }, 'CSV')
    const jsonBtn = el('button', { type: 'button', class: 'pq-btn', onclick: () => download('json'), disabled: '' }, 'JSON')
    const ui = el('div', { class: 'pq-box' },
        box,
        el('div', { class: 'pq-bar' }, runBtn, el('span', { class: 'pq-hint' }, 'Ctrl or Cmd + Enter'), shareBtn, csvBtn, jsonBtn, status),
        chips, out)
    mount.replaceWith(ui)
    box.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); go() } })
    index().then(ix => {
        for (const t of ix.tables) chips.append(el('button', { type: 'button', class: 'pq-chip', title: t.about, onclick: () => { box.value = `SELECT *\nFROM ${t.name}${scope && ['news', 'map', 'sources', 'gaps', 'events'].includes(t.name) ? `\nWHERE place = '${scope}'` : ''}\nLIMIT 50`; go() } }, `${t.name} `, el('small', {}, String(t.count))))
    }).catch(() => {})

    // a Run button on every example
    for (const pre of document.querySelectorAll('pre.pq-example')) {
        const code = pre.querySelector('code'); if (!code) continue
        const b = el('button', { type: 'button', class: 'pq-btn pq-try', onclick: () => { box.value = code.textContent.trim(); ui.scrollIntoView({ behavior: 'smooth', block: 'start' }); go() } }, 'Run this in the box')
        pre.after(b)
    }

    let LAST = null
    const isUrl = v => typeof v === 'string' && /^https?:\/\/[^\s]+$/.test(v)
    function cell(col, v) {
        const td = el('td')
        if (v === null || v === undefined) { td.className = 'pq-null'; td.textContent = 'null'; return td }
        if (typeof v === 'number') td.className = 'pq-num'
        if (isUrl(v)) td.append(el('a', { href: v, rel: 'noopener nofollow', target: '_blank' }, v.replace(/^https?:\/\/(www\.)?/, '').slice(0, 60)))
        else if (col === 'page' && /^[a-z0-9][\w\-/.]*\.html(#.*)?$/.test(v)) td.append(el('a', { href: ROOT + v }, v))
        else td.textContent = String(v)
        return td
    }
    async function go() {
        const sql = box.value
        status.textContent = 'Running...'; runBtn.disabled = true
        try {
            const r = await runQuery(sql)
            LAST = r
            out.replaceChildren()
            const tbl = el('table', { class: 'pq-grid' }), head = el('tr')
            for (const c of r.columns) head.append(el('th', { scope: 'col' }, c))
            tbl.append(el('thead', {}, head))
            const body = el('tbody'), MAX = 500
            for (const row of r.rows.slice(0, MAX)) { const tr = el('tr'); row.forEach((v, i) => tr.append(cell(r.columns[i], v))); body.append(tr) }
            tbl.append(body)
            out.append(el('div', { class: 'pq-scroll' }, tbl))
            graphButton(r)
            status.textContent = `${r.rows.length} row${r.rows.length === 1 ? '' : 's'}${r.rows.length > MAX ? `, the first ${MAX} shown` : ''}, ${r.ms} ms`
            csvBtn.removeAttribute('disabled'); jsonBtn.removeAttribute('disabled')
            if (history.replaceState) history.replaceState(null, '', '#sql=' + encodeURIComponent(sql))
        } catch (e) {
            LAST = null
            out.replaceChildren(el('p', { class: 'pq-error' }, String(e.message || e)))
            status.textContent = 'Error'
            csvBtn.setAttribute('disabled', ''); jsonBtn.setAttribute('disabled', '')
        } finally { runBtn.disabled = false }
    }
    // a result that holds paths (path_ids) or edges (src and dst) can be drawn, with the vendored Cytoscape.js (MIT)
    const COLOURS = { place: '#0b6b2e', company: '#1f5fae', organisation: '#c46a12', news: '#6b6b6b', event: '#7a3fa0', article: '#222', topic: '#2a8a8a', local: '#c46a12' }
    let CY = null
    const loadCy = () => window.cytoscape ? Promise.resolve() : new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = ROOT + 'assets/vendor/cytoscape/cytoscape.min.js'; sc.onload = ok; sc.onerror = no; document.head.append(sc) })
    function graphButton(r) {
        const ci = c => r.columns.indexOf(c), pi = ci('path_ids'), si = ci('src'), di = ci('dst')
        if (pi < 0 && (si < 0 || di < 0)) return
        const b = el('button', { type: 'button', class: 'pq-btn', onclick: () => drawGraph(r, b) }, 'Show as a graph')
        out.prepend(el('div', { class: 'pq-graphbar' }, b))
    }
    async function drawGraph(r, b) {
        b.disabled = true
        try {
            await Promise.all([loadCy(), table('nodes')])
            const N = TABLES.nodes, ix = N.columns.indexOf('id'), it = N.columns.indexOf('type'), il = N.columns.indexOf('label')
            const info = new Map(N.rows.map(x => [x[ix], { type: x[it], label: x[il] }]))
            const nodes = new Map(), edges = new Map(), ci = c => r.columns.indexOf(c)
            const node = id => { if (!nodes.has(id)) { const n = info.get(id) || { type: String(id).split(':')[0], label: id }; nodes.set(id, { data: { id, label: String(n.label).length > 34 ? String(n.label).slice(0, 32) + '…' : String(n.label), colour: COLOURS[n.type] || '#888', size: nodes.size ? 14 : 26 } }) } }
            const edge = (a, z, verb) => { node(a); node(z); const id = a + '|' + z + '|' + (verb || ''); if (!edges.has(id)) edges.set(id, { data: { id, source: a, target: z, label: verb || '' } }) }
            for (const row of r.rows.slice(0, 400)) {
                if (ci('path_ids') >= 0 && row[ci('path_ids')]) { const ids = String(row[ci('path_ids')]).split(' > '); ids.forEach(node); for (let k = 1; k < ids.length; k++) edge(ids[k - 1], ids[k], '') }
                else if (ci('src') >= 0) edge(row[ci('src')], row[ci('dst')], ci('verb') >= 0 ? row[ci('verb')] : '')
            }
            const box = el('div', { class: 'pq-graph', role: 'img', 'aria-label': `A graph of ${nodes.size} nodes and ${edges.size} edges` })
            out.querySelector('.pq-graph')?.remove(); b.parentNode.after(box)
            if (CY) CY.destroy()
            CY = window.cytoscape({ container: box, elements: [...nodes.values(), ...edges.values()], layout: { name: 'cose', animate: false, nodeRepulsion: 60000, idealEdgeLength: 140, nodeOverlap: 40, padding: 24 },
                style: [{ selector: 'node', style: { 'background-color': 'data(colour)', label: 'data(label)', 'font-size': 10, 'text-wrap': 'wrap', 'text-max-width': 110, color: getComputedStyle(document.body).color, width: 'data(size)', height: 'data(size)' } },
                    { selector: 'edge', style: { width: 1, 'line-color': '#aaa', 'curve-style': 'bezier', 'target-arrow-shape': 'triangle', 'target-arrow-color': '#aaa', 'arrow-scale': 0.6, label: 'data(label)', 'font-size': 8, color: '#888' } }] })
            CY.on('tap', 'node', e => { box.title = e.target.id() })
        } catch (e) { status.textContent = 'The graph could not be drawn: ' + (e.message || e) } finally { b.disabled = false }
    }
    function share() {
        const u = location.href.split('#')[0] + '#sql=' + encodeURIComponent(box.value)
        if (navigator.clipboard) navigator.clipboard.writeText(u).then(() => { status.textContent = 'Link copied' }, () => { status.textContent = u })
        else status.textContent = u
    }
    function download(kind) {
        if (!LAST) return
        let body, type
        if (kind === 'csv') {
            const q = v => v === null || v === undefined ? '' : /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v)
            body = [LAST.columns.map(q).join(','), ...LAST.rows.map(r => r.map(q).join(','))].join('\n'); type = 'text/csv'
        } else { body = JSON.stringify({ query: box.value, columns: LAST.columns, rows: LAST.rows }, null, 1); type = 'application/json' }
        const a = el('a', { href: URL.createObjectURL(new Blob([body], { type })), download: `promptugal-query.${kind}` })
        document.body.append(a); a.click(); a.remove()
    }

    // the page's tools, for the chat and for agents driving a browser
    const reg = (name, spec) => (window.__toolQueue = window.__toolQueue || []).push(['register', name, spec])
    reg('data.query', { level: 'read', description: 'Run SQL over the data (and neighbours(), paths()); up to 50 rows.',
        params: { type: 'object', properties: { sql: { type: 'string' } }, required: ['sql'] },
        run: async args => { const r = await runQuery(args.sql); return { columns: r.columns, rows: r.rows.slice(0, 50), count: r.rows.length } } })
    reg('data.tables', { level: 'read', description: 'The tables, their columns and counts.', params: { type: 'object', properties: {} },
        run: async () => (await index()).tables.map(t => ({ name: t.name, count: t.count, columns: t.columns.map(c => c.name) })) })

    go()
})()
