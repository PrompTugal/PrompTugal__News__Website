// RiskMandate's ring (/graph/riskmandate/): RiskMandate's three questions at the centre, every company of the graph on the
// outer ring on equal terms, grouped by field. It draws only what the site publishes: no relationship, no prospect, no score.
// Plain canvas, no dependency. By dev.graphs@PrompTugal.dinis.
(() => {
    const root = document.getElementById('gr'); if (!root) return
    const U = JSON.parse(root.dataset.ui)
    const el = (tag, props, ...kids) => { const x = Object.assign(document.createElement(tag), props); x.append(...kids); return x }
    const chip = (text, attrs) => { const b = el('button', { type: 'button', className: 'chip', textContent: text }); for (const k in attrs) b.setAttribute(k, attrs[k]); return b }
    const cv = el('canvas'), cap = el('p', { className: 'gv-cap', textContent: U.caption }), side = el('aside', { className: 'gv-side' })
    cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', U.canvas)
    root.append(el('div', { className: 'gv-bar' }, chip(U.replay, { 'data-replay': '' }), chip(U.png, { 'data-png': '' })), el('div', { className: 'gv-main' }, el('div', {}, cv, cap), side))
    const ctx = cv.getContext('2d'), still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const PAL = ['#1f6feb', '#d1242f', '#1a7f37', '#bf8700', '#8250df', '#0a8a8a', '#c2410c', '#57606a']
    const label = k => String(k || '').replace(/-/g, ' ')
    let D, W = 0, H = 0, dpr = 1, dots = [], t0 = 0, p = 1, sel = null, hover = null
    const Q = [['reach', U.reach], ['mandate', U.mandate], ['gap', U.gap]]
    function build() {
        const co = D.nodes.filter(n => n.type === 'company'), g = new Map()
        for (const n of co) (g.get(n.category) || g.set(n.category, []).get(n.category)).push(n)
        const fields = [...g.entries()].sort((a, b) => b[1].length - a[1].length)
        dots = []; let i = 0
        fields.forEach(([k, m], f) => m.sort((a, b) => a.label.localeCompare(b.label)).forEach(n => { dots.push({ n, col: PAL[f % PAL.length], i: i++, field: label(k) }) }))
        dots.forEach(d => { d.ang = d.i / dots.length * Math.PI * 2 - Math.PI / 2 })
        cv._cx = W / 2; cv._cy = H / 2; cv._R = Math.min(W, H) / 2 - 24
    }
    const pt = (d, e) => ({ x: cv._cx + Math.cos(d.ang) * cv._R * e, y: cv._cy + Math.sin(d.ang) * cv._R * e })
    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = css('--panel') || '#fff'; ctx.fillRect(0, 0, W, H)
        const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', cx = cv._cx, cy = cv._cy, R = cv._R, e = Math.min(1, p)
        ctx.strokeStyle = ink3; ctx.globalAlpha = 0.25; ctx.lineWidth = 1; for (const r of [0.28, 0.62, 1]) { ctx.beginPath(); ctx.arc(cx, cy, R * r * e, 0, 7); ctx.stroke() }
        ctx.globalAlpha = 1
        const P = new Map()
        dots.forEach(d => { const k = Math.max(0, Math.min(1, (p * 1.6 - d.i / dots.length * 0.6))), q = pt(d, k); P.set(d, q); ctx.fillStyle = d.col; ctx.globalAlpha = (sel && sel !== d ? 0.4 : 0.9) * k; ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, 7); ctx.fill() })
        ctx.globalAlpha = 1
        Q.forEach(([k, txt], j) => { const a = -Math.PI / 2 + j * Math.PI * 2 / 3, x = cx + Math.cos(a) * R * 0.28 * e, y = cy + Math.sin(a) * R * 0.28 * e
            ctx.fillStyle = css('--panel') || '#fff'; ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 27, 0, 7); ctx.fill(); ctx.stroke()
            ctx.fillStyle = ink; ctx.font = '700 11px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(k.toUpperCase(), x, y + 4) })
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 7); ctx.fill()
        const pick = sel || hover
        if (pick && P.has(pick)) { const q = P.get(pick); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(q.x, q.y, 9, 0, 7); ctx.stroke()
            const lx = q.x + (q.x > cx ? -14 : 14); ctx.font = '600 13px system-ui, sans-serif'; ctx.textAlign = q.x > cx ? 'end' : 'start'
            ctx.strokeStyle = css('--panel') || '#fff'; ctx.lineWidth = 4; ctx.strokeText(pick.n.label, lx, q.y + 4); ctx.fillStyle = ink; ctx.fillText(pick.n.label, lx, q.y + 4) }
        ctx.textAlign = 'start'; cv._P = P
    }
    function frame(ts) { if (!t0) t0 = ts; p = still ? 1 : Math.min(1, (ts - t0) / 1800); draw(); if (p < 1) requestAnimationFrame(frame) }
    const at = e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 12
        for (const [d, q] of cv._P || []) { const m = Math.hypot(q.x - x, q.y - y) - 4.5; if (m < bd) { bd = m; best = d } } return best }
    cv.addEventListener('mousemove', e => { hover = at(e); cv.style.cursor = hover ? 'pointer' : 'default'; if (p >= 1) draw() })
    cv.addEventListener('click', e => { sel = at(e); panel(); draw() })
    function panel() {
        side.replaceChildren()
        if (!sel) { side.append(el('p', { textContent: U.empty })); return }
        const n = sel.n
        side.append(el('h2', { textContent: n.label }), el('p', { className: 'gv-meta', textContent: sel.field }), el('p', { textContent: U.notasked.replace('{name}', n.label) }))
        if (n.page) side.append(el('a', { href: root.dataset.root + n.page, target: '_blank', rel: 'noopener', textContent: U.open }))
    }
    root.querySelector('[data-replay]').addEventListener('click', () => { t0 = 0; requestAnimationFrame(frame) })
    root.querySelector('[data-png]').addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'promptugal-riskmandate-ring.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
    function size() { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = Math.max(420, Math.min(680, W * 0.85)); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; if (D) { build(); draw() } }
    addEventListener('resize', size)
    fetch(root.dataset.data).then(r => r.json()).then(d => { D = d; size(); panel(); requestAnimationFrame(frame) }).catch(() => { cap.textContent = U.fail })
})()
