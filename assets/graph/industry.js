// The industry map (/graph/industry/): a radial tree. Fields are hubs around the centre, companies are their leaves
// (closer to the centre = more connected), and the summit's programme tracks sit on the outer ring where they map to a field.
// Plain canvas, no dependency. By dev.graphs@PrompTugal.dinis.
(() => {
    const root = document.getElementById('gi'); if (!root) return
    const U = JSON.parse(root.dataset.ui)
    const el = (tag, props, ...kids) => { const x = Object.assign(document.createElement(tag), props); x.append(...kids); return x }
    const chip = (text, attrs) => { const b = el('button', { type: 'button', className: 'chip', textContent: text }); for (const k in attrs) b.setAttribute(k, attrs[k]); return b }
    const cv = el('canvas'), cap = el('p', { className: 'gv-cap' }), side = el('aside', { className: 'gv-side' })
    cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', U.canvas); cap.setAttribute('aria-live', 'polite')
    root.append(el('div', { className: 'gv-bar' }, chip(U.replay, { 'data-replay': '' }), chip(U.png, { 'data-png': '' })), el('div', { className: 'gv-main' }, el('div', {}, cv, cap), side))
    const ctx = cv.getContext('2d'), still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const PAL = ['#1f6feb', '#d1242f', '#1a7f37', '#bf8700', '#8250df', '#0a8a8a', '#c2410c', '#57606a']
    const label = k => String(k || '').replace(/^topic:/, '').replace(/-/g, ' ')
    let D, W = 0, H = 0, dpr = 1, hubs = [], leaves = [], tracks = [], t0 = 0, p = 1, sel = null, hover = null
    function build() {
        const N = D.nodes, id = new Map(N.map(n => [n.id, n])), by = new Map()
        for (const e of D.edges) {
            const v = D.verbs[e[2]].verb, a = N[e[0]], b = N[e[1]]
            if (v === 'filed_under' && a.type === 'company') (by.get(b.id) || by.set(b.id, []).get(b.id)).push(a)
        }
        const fields = [...by.entries()].sort((a, b) => b[1].length - a[1].length)
        const total = fields.reduce((s, f) => s + f[1].length, 0), cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 96
        let a0 = -Math.PI / 2
        hubs = []; leaves = []; tracks = []
        fields.forEach(([k, m], i) => {
            const span = m.length / total * Math.PI * 2, mid = a0 + span / 2, col = PAL[i % PAL.length]
            const hub = { k, label: label(k), n: m.length, mid, span, col, x: cx + Math.cos(mid) * R * 0.28, y: cy + Math.sin(mid) * R * 0.28, a0 }
            hubs.push(hub)
            m.sort((a, b) => b.deg - a.deg).forEach((n, j) => {
                const rings = Math.max(1, Math.ceil(Math.sqrt(m.length / 3))), ring = j % rings, per = Math.ceil(m.length / rings)
                const idx = Math.floor(j / rings), ang = a0 + span * ((idx + 0.5 + (ring % 2) * 0.5) / per)
                leaves.push({ n, hub, ang, rad: R * (0.5 + 0.38 * (ring + 1) / rings), r: 3 + Math.sqrt(n.deg) * 1.6 })
            })
            a0 += span
        })
        const hubOf = new Map(hubs.map(h => [h.k, h]))
        for (const e of D.edges) {
            if (D.verbs[e[2]].verb !== 'maps_to') continue
            const tr = N[e[0]], h = hubOf.get(N[e[1]].id)
            if (tr.type === 'track' && h) tracks.push({ n: tr, hub: h })
        }
        const seen = new Map(); tracks.forEach(t => { const c = seen.get(t.hub) || 0; seen.set(t.hub, c + 1); t.ang = t.hub.mid + (c - 0.0) * 0.12; t.rad = R * 0.95 + 44 })
        cap.textContent = U.caption.replace('{c}', leaves.length).replace('{f}', hubs.length).replace('{t}', tracks.length).replace('{top}', hubs.slice(0, 3).map(h => `${h.label} (${h.n})`).join(', '))
        cv._cx = cx; cv._cy = cy; cv._R = R
    }
    const lp = l => { const e = Math.min(1, p) ** 0.5; return { x: cv._cx + Math.cos(l.ang) * l.rad * e, y: cv._cy + Math.sin(l.ang) * l.rad * e * 0.92 } }
    const tp = tr => ({ x: cv._cx + Math.cos(tr.ang) * tr.rad * Math.min(1, p), y: cv._cy + Math.sin(tr.ang) * tr.rad * 0.92 * Math.min(1, p) })
    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = css('--panel') || '#fff'; ctx.fillRect(0, 0, W, H)
        const ink = css('--ink') || '#111', cx = cv._cx, cy = cv._cy
        for (const h of hubs) { ctx.strokeStyle = h.col; ctx.globalAlpha = 0.07; ctx.fillStyle = h.col; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.ellipse(cx, cy, cv._R * 0.9 * Math.min(1, p), cv._R * 0.9 * 0.92 * Math.min(1, p), 0, h.a0, h.a0 + h.span); ctx.closePath(); ctx.fill() }
        ctx.globalAlpha = 0.28; ctx.lineWidth = 1
        const P = new Map()
        for (const l of leaves) { const q = lp(l); P.set(l, q); ctx.strokeStyle = l.hub.col; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(q.x, q.y); ctx.stroke() }
        ctx.globalAlpha = 1
        for (const l of leaves) { const q = P.get(l); ctx.fillStyle = l.hub.col; ctx.globalAlpha = sel && sel !== l ? 0.4 : 0.92; ctx.beginPath(); ctx.arc(q.x, q.y, l.r, 0, 7); ctx.fill() }
        ctx.globalAlpha = 1
        const T = new Map()
        for (const tr of tracks) { const q = tp(tr); T.set(tr, q); ctx.fillStyle = tr.hub.col; ctx.fillRect(q.x - 5, q.y - 5, 10, 10) }
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill()
        const halo = (s, x, y) => { ctx.strokeStyle = css('--panel') || '#fff'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); ctx.fillText(s, x, y) }
        ctx.font = '700 13px system-ui, sans-serif'
        for (const h of hubs) { const c = Math.cos(h.mid), e = Math.min(1, p); ctx.textAlign = Math.abs(c) < 0.25 ? 'center' : c > 0 ? 'start' : 'end'; ctx.fillStyle = ink; halo(h.label.toUpperCase() + ' · ' + h.n, cx + c * (cv._R * 0.95 + 12) * e, cy + Math.sin(h.mid) * (cv._R * 0.95 + 12) * 0.92 * e + (Math.sin(h.mid) < -0.9 ? -4 : 4)) }
        ctx.font = '400 12px system-ui, sans-serif'; ctx.textAlign = 'start'
        const pick = sel || hover
        if (pick && P.has(pick)) { const q = P.get(pick); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(q.x, q.y, pick.r + 4, 0, 7); ctx.stroke(); ctx.font = '600 13px system-ui, sans-serif'; ctx.fillStyle = ink; halo(pick.n.label, q.x + pick.r + 8, q.y + 4) }
        if (pick && T.has(pick)) { const q = T.get(pick); ctx.font = '600 13px system-ui, sans-serif'; ctx.fillStyle = ink; halo(pick.n.label, q.x + 10, q.y + 4) }
        cv._P = P; cv._T = T
    }
    function frame(ts) { if (!t0) t0 = ts; p = still ? 1 : Math.min(1, (ts - t0) / 1400); draw(); if (p < 1) requestAnimationFrame(frame) }
    const replay = () => { t0 = 0; requestAnimationFrame(frame) }
    const at = e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 14
        for (const m of [cv._P, cv._T]) for (const [b, q] of m || []) { const d = Math.hypot(q.x - x, q.y - y) - (b.r || 6); if (d < bd) { bd = d; best = b } } return best }
    cv.addEventListener('mousemove', e => { hover = at(e); cv.style.cursor = hover ? 'pointer' : 'default'; if (p >= 1) draw() })
    cv.addEventListener('click', e => { sel = at(e); panel(); draw() })
    function panel() {
        side.replaceChildren()
        if (!sel) { side.append(el('p', { textContent: U.empty })); return }
        const n = sel.n, h = el('h2', { textContent: n.label }), m = el('p', { className: 'gv-meta', textContent: sel.hub.label + (n.country ? ' · ' + n.country : '') + (n.type === 'company' ? ` · ${n.deg} connections` : '') })
        side.append(h, m, el('p', { textContent: n.what || '' }))
        if (n.page) side.append(el('a', { href: root.dataset.root + n.page, target: '_blank', rel: 'noopener', textContent: U.open }))
    }
    root.querySelector('[data-replay]').addEventListener('click', replay)
    root.querySelector('[data-png]').addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'promptugal-industry-map.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
    function size() { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = Math.max(440, Math.min(760, W * 0.9)); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; if (D) { build(); draw() } }
    addEventListener('resize', size)
    fetch(root.dataset.data).then(r => r.json()).then(d => { D = d; size(); panel(); requestAnimationFrame(frame) }).catch(() => { cap.textContent = U.fail })
})()
