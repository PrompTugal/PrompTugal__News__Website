// A small graph as static SVG: nodes placed by hand (the page graphs) or by a seeded force layout (the explorer).
import { esc } from './lib.mjs'

// node: { id, kind: co|person|session|topic|place, x, y, label, sub, focus, w }
export function graphSvg({ w = 640, h = 380, nodes, edges, title }) {
    const by = Object.fromEntries(nodes.map(n => [n.id, n]))
    const e = edges.map(([a, b, strong]) => {
        const A = by[a], B = by[b]
        return `<line class="g-edge${strong ? ' strong' : ''}" x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}"/>`
    }).join('')
    const n = nodes.map(nd => {
        const lab = esc(nd.label), sub = nd.sub ? esc(nd.sub) : ''
        if (nd.kind === 'co' || nd.kind === 'person') {
            const r = nd.r || (nd.focus ? 13 : nd.kind === 'co' ? 8 : 9)
            const below = nd.labelPos !== 'right'
            return `<g class="g-node n-${nd.kind}${nd.focus ? ' focus' : ''}"><title>${lab}</title><circle cx="${nd.x}" cy="${nd.y}" r="${r}"/>` +
                (below ? `<text x="${nd.x}" y="${nd.y + r + 17}" text-anchor="middle"${nd.focus ? ' style="font-weight:700;font-size:16px"' : ''}>${lab}</text>${sub ? `<text class="sub" x="${nd.x}" y="${nd.y + r + 31}" text-anchor="middle">${sub}</text>` : ''}`
                    : `<text x="${nd.x + r + 6}" y="${nd.y + 5}">${lab}</text>${sub ? `<text class="sub" x="${nd.x + r + 6}" y="${nd.y + 20}">${sub}</text>` : ''}`) + `</g>`
        }
        if (nd.dot) return `<g class="g-node n-${nd.kind}"><title>${lab}</title><rect x="${nd.x - 7}" y="${nd.y - 7}" width="14" height="14" rx="2"/><text x="${nd.x + 12}" y="${nd.y + 5}">${lab}</text>${sub ? `<text class="sub" x="${nd.x + 12}" y="${nd.y + 20}">${sub}</text>` : ''}</g>`
        const bw = nd.w || Math.max(96, Math.min(240, nd.label.length * 8.6 + 22)), bh = sub ? 42 : 30
        return `<g class="g-node n-${nd.kind}"><title>${lab}</title><rect x="${(nd.x - bw / 2).toFixed(1)}" y="${(nd.y - bh / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh}" rx="2"/><text x="${nd.x}" y="${nd.y + (sub ? -3 : 5)}" text-anchor="middle">${lab}</text>${sub ? `<text class="sub" x="${nd.x}" y="${nd.y + 14}" text-anchor="middle">${sub}</text>` : ''}</g>`
    }).join('')
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${e}${n}</svg>`
}

// a seeded force layout (no dependencies), run here so the explorer mockup is a static, repeatable picture
export function layout(nodes, edges, { w = 1000, h = 680, iters = 600, seed = 7 } = {}) {
    let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
    nodes.forEach(n => { n.x = n.x ?? w / 2 + (rnd() - .5) * w * .6; n.y = n.y ?? h / 2 + (rnd() - .5) * h * .6; n.vx = 0; n.vy = 0 })
    const by = Object.fromEntries(nodes.map(n => [n.id, n]))
    for (let it = 0; it < iters; it++) {
        const t = 1 - it / iters
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j]; let dx = a.x - b.x, dy = a.y - b.y; const d2 = Math.max(dx * dx + dy * dy, 25)
            const f = 7000 / d2; const d = Math.sqrt(d2); dx /= d; dy /= d
            a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f
        }
        for (const [p, q, , len = 70] of edges) {
            const a = by[p], b = by[q]; const dx = b.x - a.x, dy = b.y - a.y; const d = Math.sqrt(dx * dx + dy * dy) || 1
            const f = (d - len) * 0.04; a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f
        }
        for (const n of nodes) {
            if (n.fixed) { n.vx = n.vy = 0; continue }
            n.vx += (w / 2 - n.x) * 0.003; n.vy += (h / 2 - n.y) * 0.003
            n.x += Math.max(-12, Math.min(12, n.vx)) * t; n.y += Math.max(-12, Math.min(12, n.vy)) * t
            n.vx *= .55; n.vy *= .55
        }
    }
    // fit into the box with a margin for labels
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y)
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys)
    const m = 70, sx = (w - 2 * m) / (maxx - minx || 1), sy = (h - 2 * m) / (maxy - miny || 1)
    nodes.forEach(n => { n.x = +(m + (n.x - minx) * sx).toFixed(1); n.y = +(m + (n.y - miny) * sy).toFixed(1) })
    return nodes
}
