// The world map (/graph/world/): every country with companies in the graph as a bubble sized by how many, each joined to Lisbon,
// where Web Summit is held; filter by field; tap a country for its companies. Outlines: assets/vendor/world-atlas (Natural Earth,
// ISC). Plain canvas, no other dependency. By dev.graphs@PrompTugal.dinis.
(() => {
    const root = document.getElementById('gw'); if (!root) return
    const U = JSON.parse(root.dataset.ui)
    const el = (tag, props, ...kids) => { const x = Object.assign(document.createElement(tag), props); x.append(...kids); return x }
    const chip = (text, attrs) => { const b = el('button', { type: 'button', className: 'chip', textContent: text }); for (const k in attrs) b.setAttribute(k, attrs[k]); return b }
    const cv = el('canvas'), cap = el('p', { className: 'gv-cap' }), side = el('aside', { className: 'gv-side' }), bar = el('div', { className: 'gv-bar' })
    cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', U.canvas); cap.setAttribute('aria-live', 'polite')
    const ctx = cv.getContext('2d'), still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const label = k => String(k || '').replace(/-/g, ' ')
    const VIEWS = { world: { lon0: -180, lon1: 180, lat0: 84, lat1: -58, h: 0.395, k: 1 }, europe: { lon0: -13, lon1: 33, lat0: 62, lat1: 34, h: 0.62, k: 0.7 } }
    let V = VIEWS.world
    let D, M, topo, land = [], spots = [], fields = [], field = '', W = 0, H = 0, dpr = 1, t0 = 0, p = 1, sel = null, hover = null
    const proj = (lon, lat) => [(lon - V.lon0) / (V.lon1 - V.lon0) * W, (V.lat0 - lat) / (V.lat0 - V.lat1) * H]
    function decode(t) {
        const [sx, sy] = t.transform.scale, [tx, ty] = t.transform.translate
        const arcs = t.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty] }) })
        const ring = idx => idx.flatMap(i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse())
        return t.objects.countries.geometries.map(g => {
            const polys = g.type === 'Polygon' ? [g.arcs] : g.arcs
            return { name: g.properties.name, rings: polys.map(pl => pl.map(ring)) }
        })
    }
    const centre = c => { let best = null, ba = -1; for (const poly of c.rings) { const r = poly[0], xs = r.map(q => q[0]), ys = r.map(q => q[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys); if (w * h > ba) { ba = w * h; best = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2] } } return best }
    function build() {
        const co = D.nodes.filter(n => n.type === 'company'), byName = new Map(land.map(c => [c.name, c]))
        const g = new Map()
        for (const n of co) { const raw = String(n.country || '').replace(/\s*\(.*\)\s*$/, ''), nm = M.aliases[raw] || raw; (g.get(nm) || g.set(nm, []).get(nm)).push(n) }
        fields = [...new Set(co.map(n => n.category))].sort()
        if (!bar.querySelector('[data-f]')) {
            bar.append(chip(U.all, { 'data-f': '', 'aria-pressed': 'true' }), ...fields.map(f => chip(label(f), { 'data-f': f, 'aria-pressed': 'false' })), chip(U.europe, { 'data-v': 'europe', 'aria-pressed': 'false' }), chip(U.png, { 'data-png': '' }))
            const vb = bar.querySelector('[data-v]'); vb.addEventListener('click', () => { const eu = V === VIEWS.world; V = eu ? VIEWS.europe : VIEWS.world; vb.setAttribute('aria-pressed', eu); vb.textContent = eu ? U.worldv : U.europe; sel = null; panel(); size() })
            bar.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { field = b.dataset.f; bar.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-pressed', x === b)); sel = null; panel(); layout(); draw() }))
            bar.querySelector('[data-png]').addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'promptugal-world-map.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
        }
        spots = [...g.entries()].map(([nm, m]) => { const c = byName.get(nm), ll = M.points[nm] || (c && centre(c)); return ll ? { nm, m, ll } : null }).filter(Boolean)
        layout()
    }
    function layout() {
        for (const s of spots) { const [x, y] = proj(...s.ll); s.x = x; s.y = y; s.k = field ? s.m.filter(n => n.category === field) : s.m; s.r = s.k.length ? (5 + Math.sqrt(s.k.length) * 4.2) * V.k : 0; s.on = s.x > -s.r && s.x < W + s.r && s.y > -s.r && s.y < H + s.r }
        const shown = spots.filter(s => s.k.length && s.on), n = shown.reduce((a, s) => a + s.k.length, 0)
        cap.textContent = U.caption.replace('{c}', n).replace('{n}', shown.length).replace('{top}', [...shown].sort((a, b) => b.k.length - a.k.length).slice(0, 3).map(s => `${s.nm} (${s.k.length})`).join(', '))
    }
    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = css('--panel') || '#fff'; ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = css('--paper-2') || '#e8e4da'; ctx.strokeStyle = css('--panel') || '#fff'; ctx.lineWidth = 0.7
        for (const c of land) for (const poly of c.rings) { ctx.beginPath(); poly.forEach(r => r.forEach(([lo, la], i) => { const [x, y] = proj(lo, la); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) })); ctx.fill('evenodd'); ctx.stroke() }
        const [lx, ly] = proj(...M.lisbon), ink = css('--ink') || '#111', col = css('--brand') || '#1a7f37'
        ctx.lineWidth = 1.2; ctx.strokeStyle = col
        for (const s of spots) if (s.k.length && s.on && s.nm !== 'Portugal') {
            const e = Math.max(0, Math.min(1, p * 1.5 - (s.x / W) * 0.5)); if (!e) continue
            const mx = (s.x + lx) / 2, my = Math.min(s.y, ly) - Math.abs(s.x - lx) * 0.18
            ctx.globalAlpha = (sel && sel !== s ? 0.08 : 0.32) * e; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.quadraticCurveTo(mx, my, s.x + (lx - s.x) * e, s.y + (ly - s.y) * e); ctx.stroke()
        }
        ctx.globalAlpha = 1
        for (const s of spots) if (s.k.length && s.on) { const e = Math.min(1, p * 1.4); ctx.fillStyle = col; ctx.globalAlpha = (sel && sel !== s ? 0.3 : 0.62) * e; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * e, 0, 7); ctx.fill(); ctx.globalAlpha = e; ctx.strokeStyle = ink; ctx.lineWidth = sel === s || hover === s ? 2 : 0.8; ctx.stroke() }
        ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(lx, ly, 3, 0, 7); ctx.fill()
        const halo = (s, x, y) => { ctx.strokeStyle = css('--panel') || '#fff'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); ctx.fillText(s, x, y) }
        ctx.font = '700 12px system-ui, sans-serif'; ctx.fillStyle = ink; ctx.textAlign = 'right'; halo(U.lisbon, lx - 8, ly + 18)
        const pick = sel || hover
        if (pick) { ctx.textAlign = 'center'; ctx.font = '600 13px system-ui, sans-serif'; halo(`${pick.nm} · ${pick.k.length}`, pick.x, pick.y - pick.r - 6) }
        ctx.textAlign = 'start'
    }
    function frame(ts) { if (!t0) t0 = ts; p = still ? 1 : Math.min(1, (ts - t0) / 1800); draw(); if (p < 1) requestAnimationFrame(frame) }
    const at = e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 6
        for (const s of spots) if (s.k.length && s.on) { const d = Math.hypot(s.x - x, s.y - y) - s.r; if (d < bd) { bd = d; best = s } } return best }
    cv.addEventListener('mousemove', e => { hover = at(e); cv.style.cursor = hover ? 'pointer' : 'default'; if (p >= 1) draw() })
    cv.addEventListener('click', e => { sel = at(e); panel(); draw() })
    function panel() {
        side.replaceChildren()
        if (!sel) { side.append(el('p', { textContent: U.empty })); return }
        side.append(el('h2', { textContent: sel.nm }), el('p', { className: 'gv-meta', textContent: U.count.replace('{n}', sel.k.length) }),
            el('ul', { className: 'gw-list' }, ...[...sel.k].sort((a, b) => b.deg - a.deg).map(n => el('li', {}, n.page ? el('a', { href: root.dataset.root + n.page, target: '_blank', rel: 'noopener', textContent: n.label }) : n.label, ' ', el('small', { textContent: label(n.category) })))))
    }
    function size() { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = Math.max(240, Math.round(W * V.h)); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; if (D) { layout(); draw() } }
    addEventListener('resize', size)
    root.append(bar, el('div', { className: 'gv-main' }, el('div', {}, cv, cap), side))
    Promise.all([fetch(root.dataset.data).then(r => r.json()), fetch(root.dataset.world).then(r => r.json()), fetch(root.dataset.outline).then(r => r.json())])
        .then(([d, m, t]) => { D = d; M = m; land = decode(t); size(); build(); panel(); requestAnimationFrame(frame) }).catch(() => { cap.textContent = U.fail })
})()
