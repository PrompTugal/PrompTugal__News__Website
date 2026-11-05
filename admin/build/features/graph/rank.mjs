// Importance in the whole graph, computed once at build so the explorer can rank without recomputing: degree,
// betweenness (Brandes 2001, undirected, for nodes and for edges) and PageRank (undirected, damping 0.85).
// Pure: arrays in, arrays out. Not a feature (this folder is not loaded by lib/features.mjs); graph.mjs uses it.
//   rank(n, pairs) -> { degree: number[], betweenness: number[], edgeBetweenness: number[], pagerank: number[] }
//   n: node count; pairs: [[fromIndex, toIndex], ...] one per edge

export function rank(n, pairs) {
    // adjacency in compressed rows (typed arrays): neighbour and edge index per slot
    const degree = new Array(n).fill(0)
    for (const [a, b] of pairs) if (a !== b) { degree[a]++; degree[b]++ }
    const start = new Int32Array(n + 1)
    for (let i = 0; i < n; i++) start[i + 1] = start[i] + degree[i]
    const nb = new Int32Array(start[n]), eid = new Int32Array(start[n]), fill = start.slice(0, n)
    pairs.forEach(([a, b], ei) => { if (a === b) return; nb[fill[a]] = b; eid[fill[a]++] = ei; nb[fill[b]] = a; eid[fill[b]++] = ei })

    // Brandes: one BFS per source, then dependencies accumulated back down the BFS order. In an undirected graph
    // the predecessors of w are its neighbours one step nearer the source, so they are found, not stored.
    const bc = new Float64Array(n), ebc = new Float64Array(pairs.length)
    const sigma = new Float64Array(n), dist = new Int32Array(n), delta = new Float64Array(n), order = new Int32Array(n)
    for (let s = 0; s < n; s++) {
        sigma.fill(0); dist.fill(-1); delta.fill(0)
        sigma[s] = 1; dist[s] = 0
        let qh = 0, qt = 0
        order[qt++] = s
        while (qh < qt) {
            const v = order[qh++]
            for (let k = start[v]; k < start[v + 1]; k++) {
                const w = nb[k]
                if (dist[w] < 0) { dist[w] = dist[v] + 1; order[qt++] = w }
                if (dist[w] === dist[v] + 1) sigma[w] += sigma[v]
            }
        }
        for (let i = qt - 1; i > 0; i--) {
            const w = order[i], dw = dist[w] - 1
            for (let k = start[w]; k < start[w + 1]; k++) {
                const v = nb[k]
                if (dist[v] !== dw) continue
                const c = (sigma[v] / sigma[w]) * (1 + delta[w])
                ebc[eid[k]] += c; delta[v] += c
            }
            bc[w] += delta[w]
        }
    }
    // undirected: every pair was counted from both ends
    const norm = n > 2 ? 2 / ((n - 1) * (n - 2)) : 1
    const betweenness = [...bc].map(x => x / 2 * norm)
    const edgeBetweenness = [...ebc].map(x => x / 2)

    // PageRank by power iteration; dangling (isolated) nodes spread evenly
    const d = 0.85
    let pr = new Float64Array(n).fill(1 / n)
    for (let it = 0; it < 60; it++) {
        const next = new Float64Array(n).fill((1 - d) / n)
        let dangling = 0
        for (let v = 0; v < n; v++) {
            if (!degree[v]) { dangling += pr[v]; continue }
            const share = d * pr[v] / degree[v]
            for (let k = start[v]; k < start[v + 1]; k++) next[nb[k]] += share
        }
        for (let v = 0; v < n; v++) next[v] += d * dangling / n
        pr = next
    }
    return { degree, betweenness, edgeBetweenness, pagerank: [...pr] }
}
