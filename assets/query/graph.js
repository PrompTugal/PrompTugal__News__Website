/* PrompTugal.news query engine: graph traversals as SQL table functions over the nodes and edges tables.
 * data.places@PrompTugal.dinis, 15 November 2026. Same file in the browser (window.PTGraph) and the build (require).
 *
 *   neighbours(start, depth [, verbs])   every node within `depth` steps of `start`, edges taken both ways
 *       columns: id, type, label, depth, verb, via, path, path_ids
 *   paths(from, to [, max_depth [, verbs]])  the shortest paths between two nodes (up to 25), edges taken both ways
 *       columns: n, hops, path, path_ids, verbs
 *   verbs: a comma list of the verbs to follow ('reported_in,mentions'), or of verbs to skip ('-on_day,-in_track');
 *       null or '' follows every verb but on_day (a day joins everything that happened on it, so it is skipped
 *       unless named).
 */
(function (root) {
    'use strict'
    function make(db) {
        let G = null
        const graph = () => {
            if (G) return G
            const N = db.tables.nodes, E = db.tables.edges
            if (!N || !E) throw new Error('needs the nodes and edges tables')
            const ni = c => N.columns.indexOf(c), ei = c => E.columns.indexOf(c)
            const [nid, nty, nla] = [ni('id'), ni('type'), ni('label')], [es, ed, ev] = [ei('src'), ei('dst'), ei('verb')]
            const node = new Map(), adj = new Map()
            for (const r of N.rows) node.set(r[nid], { type: r[nty], label: r[nla] })
            const add = (a, b, verb, dir) => { if (!adj.has(a)) adj.set(a, []); adj.get(a).push([b, verb, dir]) }
            for (const r of E.rows) { add(r[es], r[ed], r[ev], '>'); add(r[ed], r[es], r[ev], '<') }
            return (G = { node, adj })
        }
        const filter = verbs => {
            const v = String(verbs || '').split(',').map(s => s.trim()).filter(Boolean)
            if (!v.length) return verb => verb !== 'on_day'
            const inc = v.filter(x => !x.startsWith('-')), exc = new Set(v.filter(x => x.startsWith('-')).map(x => x.slice(1)))
            return inc.length ? verb => inc.includes(verb) && !exc.has(verb) : verb => !exc.has(verb)
        }
        const label = (g, id) => (g.node.get(id) || {}).label || id
        function check(g, id, what) { if (!g.node.has(id)) throw new Error(`${what}: no node ${id}; ids look like place:loule (see the nodes table)`) }

        function neighbours([start, depth, verbs]) {
            const g = graph(); check(g, start, 'neighbours'); depth = Math.max(0, Math.min(6, Number(depth) || 1))
            const ok = filter(verbs), seen = new Map([[start, { depth: 0, via: null, verb: null }]])
            let frontier = [start]
            for (let d = 1; d <= depth && frontier.length; d++) {
                const next = []
                for (const a of frontier) for (const [b, verb] of g.adj.get(a) || []) {
                    if (!ok(verb) || seen.has(b)) continue
                    seen.set(b, { depth: d, via: a, verb }); next.push(b)
                }
                frontier = next
            }
            const rows = []
            for (const [id, s] of seen) {
                const ids = []; for (let x = id; x; x = seen.get(x).via) ids.unshift(x)
                const n = g.node.get(id) || {}
                rows.push([id, n.type || null, n.label || id, s.depth, s.verb, s.via, ids.map(x => label(g, x)).join(' > '), ids.join(' > ')])
            }
            return { columns: ['id', 'type', 'label', 'depth', 'verb', 'via', 'path', 'path_ids'], rows }
        }

        function paths([from, to, max, verbs]) {
            const g = graph(); check(g, from, 'paths'); check(g, to, 'paths'); max = Math.max(1, Math.min(6, Number(max) || 4))
            const ok = filter(verbs)
            // BFS levels with every parent kept, then walk back all shortest paths
            const dist = new Map([[from, 0]]), parents = new Map([[from, []]])
            let frontier = [from]
            for (let d = 1; d <= max && frontier.length && !dist.has(to); d++) {
                const next = []
                for (const a of frontier) for (const [b, verb, dir] of g.adj.get(a) || []) {
                    if (!ok(verb)) continue
                    if (!dist.has(b)) { dist.set(b, d); parents.set(b, []); next.push(b) }
                    if (dist.get(b) === d) parents.get(b).push([a, verb, dir])
                }
                frontier = next
            }
            const rows = []
            if (!dist.has(to)) return { columns: ['n', 'hops', 'path', 'path_ids', 'verbs'], rows }
            const walk = (x, acc) => {
                if (rows.length >= 25) return
                if (x === from) { const ids = [from, ...acc.map(s => s[0])]; rows.push([rows.length + 1, acc.length, ids.map(i => label(g, i)).join(' > '), ids.join(' > '), acc.map(s => s[1]).join(', ')]); return }
                for (const [p, verb, dir] of parents.get(x)) walk(p, [[x, dir === '>' ? verb : verb + ' (inverse)'], ...acc])
            }
            walk(to, [])
            return { columns: ['n', 'hops', 'path', 'path_ids', 'verbs'], rows }
        }
        return { neighbours, paths }
    }
    const PTGraph = { functions: make }
    root.PTGraph = PTGraph
    if (typeof module === 'object' && module.exports) module.exports = PTGraph
})(typeof window !== 'undefined' ? window : globalThis)
