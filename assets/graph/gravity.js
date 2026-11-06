// Centres of gravity (/graph/gravity/): the companies of the graph as bodies orbiting the wells of their field or country.
// A well's mass is its members' PageRank; a body's size is its degree. Plain canvas, no dependency. By dev.graphs@PrompTugal.dinis.
(() => {
    const root = document.getElementById('gv'); if (!root) return
    const U = JSON.parse(root.dataset.ui)
    const el = (tag, props, ...kids) => { const x = Object.assign(document.createElement(tag), props); x.append(...kids); return x }
    const chip = (text, attrs) => { const b = el('button', { type: 'button', className: 'chip', textContent: text }); for (const k in attrs) b.setAttribute(k, attrs[k]); return b }
    const cv = el('canvas'), cap = el('p', { className: 'gv-cap' }), side = el('aside', { className: 'gv-side' })
    cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', U.canvas); cap.setAttribute('aria-live', 'polite')
    root.append(el('div', { className: 'gv-bar' }, chip(U.field, { 'data-by': 'category', 'aria-pressed': 'true' }), chip(U.country, { 'data-by': 'country', 'aria-pressed': 'false' }), chip(U.png, { 'data-png': '' })),
        el('div', { className: 'gv-main' }, el('div', {}, cv, cap), side))
    const ctx = cv.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const PAL = ['#1f6feb', '#d1242f', '#1a7f37', '#bf8700', '#8250df', '#0a8a8a', '#c2410c', '#57606a', '#cf222e']
    let D, by = 'category', wells = [], bodies = [], W = 0, H = 0, t = 0, sel = null, hover = null, dpr = 1
    const label = k => String(k || 'other').replace(/-/g, ' ').replace(/\s*\(.*\)$/, '')
    function build() {
        const co = D.nodes.filter(n => n.type === 'company')
        const g = new Map()
        for (const n of co) { const k = label(n[by]); (g.get(k) || g.set(k, []).get(k)).push(n) }
        let list = [...g.entries()].map(([k, m]) => ({ k, m, mass: m.reduce((s, n) => s + n.pr, 0) })).sort((a, b) => b.mass - a.mass)
        if (by === 'country' && list.length > 8) {
            const rest = list.slice(8).flatMap(w => w.m)
            list = list.slice(0, 8); list.push({ k: 'Other countries', m: rest, mass: rest.reduce((s, n) => s + n.pr, 0) })
        }
        const tot = list.reduce((s, w) => s + w.mass, 0), cx = W / 2, cy = H / 2
        const R = Math.min(W, H) * 0.33
        wells = list.map((w, i) => {
            const a = i / list.length * Math.PI * 2 - Math.PI / 2, ring = i === 0 ? 0 : R * (0.55 + 0.45 * (i % 2))
            return { ...w, i, x: cx + Math.cos(a) * ring * (W / H > 1.2 ? 1.5 : 1), y: cy + Math.sin(a) * ring, r: Math.max(22, Math.sqrt(w.mass / tot) * Math.min(W, H) * 0.36), col: PAL[i % PAL.length] }
        })
        for (let k = 0; k < 200; k++) for (const a of wells) for (const b of wells) {
            if (a === b) continue
            const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, min = a.r + b.r + 64
            if (d < min) { const f = (min - d) / 2 / d; a.x -= dx * f; a.y -= dy * f; b.x += dx * f; b.y += dy * f }
        }
        for (const w of wells) { const m = w.r + 50; w.x = Math.max(m, Math.min(W - m, w.x)); w.y = Math.max(m + 30, Math.min(H - m, w.y)) }
        bodies = []
        for (const w of wells) w.m.sort((a, b) => b.deg - a.deg).forEach((n, j) => {
            const ring = w.r * (0.35 + 0.65 * Math.sqrt((j + 1) / w.m.length)) + 8
            bodies.push({ n, w, ring, ph: j * 2.399963, sp: (0.25 + 80 / (ring + 40)) * (j % 2 ? 1 : -1) * 0.5, r: 3 + Math.sqrt(n.deg) * 1.9 })
        })
        caption()
    }
    function caption() {
        const top = wells.slice(0, 3), n = bodies.length
        cap.textContent = `${n} companies in ${wells.length} wells by ${by === 'category' ? 'field' : 'country'}. Heaviest: ` + top.map(w => `${w.k} (${w.m.length})`).join(', ') + '.'
    }
    const pos = b => ({ x: b.w.x + Math.cos(b.ph + t * b.sp) * b.ring, y: b.w.y + Math.sin(b.ph + t * b.sp) * b.ring * 0.78 })
    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.fillStyle = css('--panel') || '#fff'; ctx.fillRect(0, 0, W, H)
        const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666'
        for (const w of wells) {
            const gr = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r * 1.5)
            gr.addColorStop(0, w.col + '33'); gr.addColorStop(1, w.col + '00')
            ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(w.x, w.y, w.r * 1.5, 0, 7); ctx.fill()
            ctx.strokeStyle = w.col + '55'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(w.x, w.y, w.r + 8, (w.r + 8) * 0.78, 0, 0, 7); ctx.stroke()
        }
        const P = new Map()
        for (const b of bodies) {
            const p = pos(b); P.set(b, p)
            ctx.fillStyle = b.w.col; ctx.globalAlpha = sel && sel !== b ? 0.35 : 0.9
            ctx.beginPath(); ctx.arc(p.x, p.y, b.r, 0, 7); ctx.fill()
        }
        ctx.globalAlpha = 1
        const pick = sel || hover
        if (pick) { const p = P.get(pick); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, pick.r + 4, 0, 7); ctx.stroke(); ctx.fillStyle = ink; ctx.font = '600 13px system-ui, sans-serif'; ctx.fillText(pick.n.label, p.x + pick.r + 8, p.y + 4) }
        const halo = (txt, x, y) => { ctx.strokeStyle = css('--panel') || '#fff'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeText(txt, x, y); ctx.fillText(txt, x, y) }
        ctx.textAlign = 'center'
        for (const w of wells) {
            const y = w.y - (w.r + 8) * 0.78 - 10
            ctx.font = '700 14px system-ui, sans-serif'; ctx.fillStyle = ink; halo(w.k.toUpperCase() + ' · ' + w.m.length, w.x, y)
        }
        ctx.textAlign = 'start'
        cv._P = P
    }
    function frame() { if (!still) t += 0.016; draw(); if (!still) requestAnimationFrame(frame) }
    function size() {
        dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = Math.max(420, Math.min(720, W * 0.72))
        cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'
        if (D) { build(); draw() }
    }
    const at = e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 14
        for (const [b, p] of cv._P || []) { const d = Math.hypot(p.x - x, p.y - y) - b.r; if (d < bd) { bd = d; best = b } } return best }
    cv.addEventListener('mousemove', e => { hover = at(e); cv.style.cursor = hover ? 'pointer' : 'default'; if (still) draw() })
    cv.addEventListener('click', e => { sel = at(e); panel(); if (still) draw() })
    function panel() {
        side.replaceChildren()
        if (!sel) { side.append(Object.assign(document.createElement('p'), { textContent: U.empty })); return }
        const n = sel.n, h = document.createElement('h2'); h.textContent = n.label
        const p = document.createElement('p'); p.textContent = n.what || ''
        const m = document.createElement('p'); m.className = 'gv-meta'; m.textContent = `${label(n.category)} · ${n.country ? label(n.country) : ''} · ${n.deg} connections`
        side.append(h, m, p)
        if (n.page) { const a = document.createElement('a'); a.href = root.dataset.root + n.page; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open the page (new tab)'; side.append(a) }
    }
    root.querySelectorAll('[data-by]').forEach(b => b.addEventListener('click', () => {
        by = b.dataset.by; sel = null; panel(); root.querySelectorAll('[data-by]').forEach(x => x.setAttribute('aria-pressed', x === b)); build(); if (still) draw()
    }))
    root.querySelector('[data-png]').addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = `promptugal-gravity-by-${by}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
    addEventListener('resize', size)
    fetch(root.dataset.data).then(r => r.json()).then(d => { D = d; size(); panel(); frame() }).catch(() => { cap.textContent = U.fail })
})()
