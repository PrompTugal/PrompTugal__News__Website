// A force layout of the whole graph, computed once at build, so the explorer can draw a large view (hundreds or all
// 1,441 nodes) instantly from fixed positions instead of running a physics layout in the browser (Cytoscape's cose
// takes over 30 seconds on the whole). Fruchterman-Reingold with a Barnes-Hut quadtree for the repulsion (n log n),
// a gentle gravity so the small components stay near, a seeded start so the map is the same on every build.
// Pure. Not a feature (this folder is not loaded by lib/features.mjs); graph.mjs uses it.
//   forceLayout(n, pairs, { iters, seed }) -> [[x, y], ...]

export function forceLayout(n, pairs, { iters = 220, seed = 11, k = 34 } = {}) {
    let s = seed
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
    const R = Math.sqrt(n) * k * 0.9
    const x = new Float64Array(n), y = new Float64Array(n), dx = new Float64Array(n), dy = new Float64Array(n)
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * R; x[i] = Math.cos(a) * r; y[i] = Math.sin(a) * r }
    const deg = new Float64Array(n)
    for (const [a, b] of pairs) { deg[a]++; deg[b]++ }
    const k2 = k * k, theta2 = 0.81
    let temp = R / 4
    for (let it = 0; it < iters; it++) {
        dx.fill(0); dy.fill(0)
        // the quadtree: cells with mass (1 + degree, so hubs push harder) and centre of mass
        let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity
        for (let i = 0; i < n; i++) { if (x[i] < minx) minx = x[i]; if (x[i] > maxx) maxx = x[i]; if (y[i] < miny) miny = y[i]; if (y[i] > maxy) maxy = y[i] }
        const size = Math.max(maxx - minx, maxy - miny) + 1
        const root = { x0: minx, y0: miny, s: size, m: 0, cx: 0, cy: 0, body: -1, kids: null }
        const insert = (c, i, depth) => {
            const mi = 1 + deg[i]
            if (!c.kids && c.m === 0) { c.body = i; c.m = mi; c.cx = x[i]; c.cy = y[i]; return }
            if (!c.kids && depth < 40) {
                const h = c.s / 2
                c.kids = [0, 1, 2, 3].map(q => ({ x0: c.x0 + (q & 1) * h, y0: c.y0 + (q >> 1) * h, s: h, m: 0, cx: 0, cy: 0, body: -1, kids: null }))
                const b = c.body; c.body = -1
                place(c, b, depth)   // c's own mass already counts b
            }
            c.cx = (c.cx * c.m + x[i] * mi) / (c.m + mi); c.cy = (c.cy * c.m + y[i] * mi) / (c.m + mi); c.m += mi
            if (c.kids) place(c, i, depth)
        }
        const place = (c, i, depth) => { const h = c.s / 2, q = (x[i] >= c.x0 + h ? 1 : 0) + (y[i] >= c.y0 + h ? 2 : 0); insert(c.kids[q], i, depth + 1) }
        for (let i = 0; i < n; i++) insert(root, i, 0)
        const push = (c, i) => {
            if (c.m === 0 || c.body === i) return
            const ddx = x[i] - c.cx, ddy = y[i] - c.cy, d2 = ddx * ddx + ddy * ddy + 0.01
            if (!c.kids || (c.s * c.s) / d2 < theta2) {
                const f = k2 * c.m / d2 * 0.6
                dx[i] += ddx * f; dy[i] += ddy * f
                return
            }
            for (const kk of c.kids) push(kk, i)
        }
        for (let i = 0; i < n; i++) push(root, i)
        for (const [a, b] of pairs) {
            if (a === b) continue
            const ddx = x[a] - x[b], ddy = y[a] - y[b], d = Math.sqrt(ddx * ddx + ddy * ddy) + 0.01
            const f = d / k / Math.min(deg[a], deg[b])
            dx[a] -= ddx * f; dy[a] -= ddy * f; dx[b] += ddx * f; dy[b] += ddy * f
        }
        for (let i = 0; i < n; i++) {
            dx[i] -= x[i] * 0.012; dy[i] -= y[i] * 0.012   // gravity: a weak spring to the centre, so loners stay near
            const m = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) + 1e-9, step = Math.min(m, temp)
            x[i] += dx[i] / m * step; y[i] += dy[i] / m * step
        }
        temp = Math.max(1, temp * 0.98)
    }
    // what floats far out (nodes with no edge) is brought in to the rim of the rest
    const r = Array.from({ length: n }, (_, i) => Math.hypot(x[i], y[i])).sort((a, b) => a - b), rim = r[Math.floor(n * 0.98)] || 1
    for (let i = 0; i < n; i++) { const d = Math.hypot(x[i], y[i]); if (d > rim * 1.05) { x[i] *= rim * 1.05 / d; y[i] *= rim * 1.05 / d } }
    return Array.from({ length: n }, (_, i) => [Math.round(x[i]), Math.round(y[i])])
}
