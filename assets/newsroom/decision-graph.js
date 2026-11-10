// The decision graph (a layout preview of the weather desk's graph): decision-makers as boxes in columns by how far they sit from a
// first decision, "this usually follows that" as lines; a box is happened, expected (the desk's ANALYSIS), not announced or unknown.
// Data: api/v1/newsroom/decision-graph.json, the desk's own file passed through unchanged. Plain SVG; text is set as textContent.
// By dev.graphs@PrompTugal.dinis, 10 November 2026.
(() => {
    const host = document.getElementById('dg'); if (!host) return
    const NS = 'http://www.w3.org/2000/svg'
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
    const ICON = { happened: '✓', expected: '~', not_announced: '…', unknown: '?' }
    const NAME = { happened: 'Happened', expected: 'Expected (analysis)', not_announced: 'Not announced', unknown: 'Unknown' }
    const BW = 184, BH = 70, CG = 74, RG = 14
    fetch(host.dataset.data).then(r => { if (!r.ok) throw new Error(r.status); return r.json() }).then(D => {
        const ids = new Map(D.nodes.map((n, i) => [n.id, i])), layer = new Map(D.nodes.map(n => [n.id, 0]))
        for (let k = 0; k < D.nodes.length; k++) for (const e of D.edges) if (layer.get(e.to) < layer.get(e.from) + 1) layer.set(e.to, layer.get(e.from) + 1)
        const cols = []; D.nodes.forEach(n => { const l = layer.get(n.id); (cols[l] = cols[l] || []).push(n) })
        const maxRows = Math.max(...cols.map(c => c.length)), H = maxRows * (BH + RG) + 20, W = cols.length * (BW + CG) - CG + 20
        const pos = new Map()
        cols.forEach((c, i) => c.forEach((n, j) => pos.set(n.id, { x: 10 + i * (BW + CG), y: 10 + (H - 20 - c.length * (BH + RG) + RG) / 2 + j * (BH + RG) })))
        const bar = el('div', { className: 'dg-legend' }, ...Object.keys(D.legend).map(k => el('span', { className: 'dg-key' }, el('i', { className: `dg-sw st-${k}`, textContent: ICON[k] }), `${NAME[k] || k}: ${D.legend[k]}`)))
        const frame = el('div', { className: 'dg-frame' }), info = el('div', { className: 'dg-info', 'aria-live': 'polite' })
        const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': `The decision graph: ${D.nodes.length} decision-makers and ${D.edges.length} links` }); frame.append(svg)
        const sel = []
        const edgeEls = D.edges.map(e => {
            const a = pos.get(e.from), b = pos.get(e.to), x1 = a.x + BW, y1 = a.y + BH / 2, x2 = b.x, y2 = b.y + BH / 2, m = (x1 + x2) / 2
            const d = `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`, g = sv('g', { class: 'dg-edge', tabindex: 0, role: 'button', 'aria-label': `${D.nodes[ids.get(e.from)].who} to ${D.nodes[ids.get(e.to)].who}` }, svg)
            sv('path', { d, class: 'dg-line' }, g); sv('path', { d, class: 'dg-hit' }, g)
            const show = () => { sel.forEach(s => s.classList.remove('on')); g.classList.add('on'); edgeInfo(e) }
            g.addEventListener('click', show); g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); show() } }); sel.push(g); return g
        })
        D.nodes.forEach(n => {
            const p = pos.get(n.id), g = sv('g', { class: `dg-node st-${n.status}`, tabindex: 0, role: 'button', transform: `translate(${p.x} ${p.y})`, 'aria-label': `${n.who}: ${NAME[n.status] || n.status}` }, svg)
            sv('rect', { width: BW, height: BH, rx: 10 }, g)
            const t1 = sv('text', { x: 10, y: 21, class: 'dg-who' }, g); t1.textContent = n.who.length > 27 ? n.who.slice(0, 26) + '…' : n.who
            const t2 = sv('text', { x: 10, y: 41, class: 'dg-st' }, g); t2.textContent = `${ICON[n.status] || ''} ${NAME[n.status] || n.status}`
            const t3 = sv('text', { x: 10, y: 58, class: 'dg-dec' }, g); t3.textContent = n.decision.length > 31 ? n.decision.slice(0, 30) + '…' : n.decision
            const tt = sv('title', {}, g); tt.textContent = `${n.who}: ${n.decision}`
            const show = () => { sel.forEach(s => s.classList.remove('on')); g.classList.add('on'); nodeInfo(n) }
            g.addEventListener('click', show); g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); show() } }); sel.push(g)
        })
        const link = (u, t) => /^https?:\/\//.test(u || '') ? el('a', { href: u, target: '_blank', rel: 'noopener', textContent: t }) : null
        function nodeInfo(n) {
            info.replaceChildren(el('p', { className: 'dg-h', textContent: `${n.who} · ${NAME[n.status] || n.status}` }), el('p', { textContent: n.decision }),
                el('p', { className: 'dg-m', textContent: [n.at && `When: ${n.at}`, n.read && `Read: ${n.read}`, n.law && `Law: ${n.law}`, n.note && `Note: ${n.note}`].filter(Boolean).join(' · ') }),
                ...(n.status === 'expected' ? [el('p', { className: 'dg-m', textContent: 'This is the desk\'s analysis, not a fact.' })] : []), ...[link(n.source, 'The source (new tab)')].filter(Boolean))
        }
        function edgeInfo(e) {
            const a = D.nodes[ids.get(e.from)], b = D.nodes[ids.get(e.to)]
            info.replaceChildren(el('p', { className: 'dg-h', textContent: `${a.who} → ${b.who}` }), el('p', { className: 'dg-m', textContent: [e.kind, e.lead_now && `Lead now: ${e.lead_now}`].filter(Boolean).join(' · ') }),
                ...[e.why && `Why: ${e.why}`, e.history && `History: ${e.history}`, e.evidence && `Evidence: ${e.evidence}`].filter(Boolean).map(t => el('p', { className: 'dg-m', textContent: t })))
        }
        host.replaceChildren(el('p', { className: 'dg-sum', textContent: `${D.nodes.length} decision-makers, ${D.edges.length} links. The desk's file was last updated ${D.updated}.` }), bar, frame, info)
        info.append(el('p', { className: 'dg-m', textContent: 'Tap a box or a line.' }))
    }).catch(() => { host.textContent = 'The decision graph could not be loaded.' })
})()
