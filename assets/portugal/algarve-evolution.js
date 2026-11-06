// Algarve Evolution, drawn: the network (Algarve Evolution at the centre, its programmes, partners, municipalities, events and its
// links to Web Summit), the timeline of its past (wide, scrolls) and a map of the Algarve with its places. All from
// algarve-evolution-data.json, each fact with its source; each picture saves as a PNG. Mount: <div id="ae-viz" data-data data-outline>.
// Plain canvas, no dependency. By dev.graphs@PrompTugal.dinis for dev.portugal@'s page /portugal/algarve-evolution/.
(() => {
    const root = document.getElementById('ae-viz'); if (!root) return
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const COL = { role: '#57606a', centre: '#1a7f37', programme: '#1f6feb', partner: '#bf8700', municipality: '#8250df', summit: '#d1242f', event: '#0a8a8a' }
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let D, O
    const dpr = () => Math.min(2, devicePixelRatio || 1)
    const halo = (c, s, x, y) => { c.strokeStyle = css('--panel') || '#fff'; c.lineWidth = 4; c.lineJoin = 'round'; c.strokeText(s, x, y); c.fillText(s, x, y) }
    function wrap(c, text, max) { const w = String(text).split(' '), out = []; let line = ''; for (const x of w) { const t = line ? line + ' ' + x : x; if (c.measureText(t).width > max && line) { out.push(line); line = x } else line = t } if (line) out.push(line); return out }
    function section(title, id) {
        const cv = el('canvas'), side = el('aside', { className: 'gv-side' }), cap = el('p', { className: 'gv-cap' })
        const png = el('button', { type: 'button', className: 'chip', textContent: D.ui.png })
        png.addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = `algarve-evolution-${id}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
        const wrapEl = el('div', { className: 'ae-scroll' }, cv)
        root.append(el('section', { className: 'ae-sec' }, el('div', { className: 'gv-bar' }, el('h2', { textContent: title }), png), wrapEl, cap, side))
        side.append(el('p', { textContent: D.ui.empty }))
        const show = (heading, meta, text, srcs, extra) => { side.replaceChildren(el('h2', { textContent: heading }), el('p', { className: 'gv-meta', textContent: meta || '' }), el('p', { textContent: text || '' })); for (const s of srcs || []) side.append(el('a', { href: s.url, target: '_blank', rel: 'noopener', textContent: `${D.ui.source}: ${s.label}${s.read ? ', read ' + s.read : ''}` }), el('br')); if (extra && extra.length) side.append(el('ul', { className: 'gw-list' }, ...extra)) }
        return { cv, c: cv.getContext('2d'), cap, show, wrapEl }
    }
    // ------------------------------------------------------------------ the network
    function network() {
        const S = section(D.ui.network, 'network'), { cv, c } = S
        const N = D.nodes.map((n, i) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0, r: n.kind === 'centre' ? 22 : 9 })), byId = new Map(N.map(n => [n.id, n]))
        const L = D.links.map(([a, b, v, s]) => ({ a: byId.get(a), b: byId.get(b), v, s })), kinds = ['programme', 'partner', 'role', 'summit', 'event']
        let W, H, sel = null, hover = null, t0 = 0, p = 1
        const ring = { programme: 0.3, partner: 0.62, role: 0.5, summit: 0.55, event: 0.85 }
        function layout() {
            const R = Math.min(W, H) / 2 - 70, cx = W / 2, cy = H / 2, per = {}
            N.forEach(n => { if (n.kind === 'centre') { n.x = cx; n.y = cy; return } const k = (per[n.kind] = (per[n.kind] || 0) + 1); n._k = k })
            const kindAng = { programme: -1.9, partner: 0.2, role: 1.9, summit: -0.6, event: 2.9 }, span = { programme: 2.2, partner: 3.0, role: 0.8, summit: 0.9, event: 2.2 }
            N.forEach(n => { if (n.kind === 'centre') return; const a = kindAng[n.kind] + (n._k / (per[n.kind] + 1) - 0.5) * span[n.kind]; n.x = cx + Math.cos(a) * R * ring[n.kind] * (W / H > 1.3 ? 1.35 : 1); n.y = cy + Math.sin(a) * R * ring[n.kind] })
            for (let it = 0; it < 260; it++) {
                for (const a of N) for (const b of N) { if (a === b) continue; const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 1, f = 5200 / d2, d = Math.sqrt(d2); a.vx += dx / d * f; a.vy += dy / d * f }
                for (const l of L) { const dx = l.b.x - l.a.x, dy = l.b.y - l.a.y, d = Math.hypot(dx, dy) + 0.1, f = (d - 120) * 0.012; l.a.vx += dx / d * f; l.a.vy += dy / d * f; l.b.vx -= dx / d * f; l.b.vy -= dy / d * f }
                for (const n of N) { if (n.kind === 'centre') { n.vx = n.vy = 0; continue } n.vx += (cx - n.x) * 0.0016; n.vy += (cy - n.y) * 0.0016; n.x += Math.max(-6, Math.min(6, n.vx)); n.y += Math.max(-6, Math.min(6, n.vy)); n.vx *= 0.6; n.vy *= 0.6; n.x = Math.max(150, Math.min(W - 150, n.x)); n.y = Math.max(34, Math.min(H - 62, n.y)) }
            }
        }
        function draw() {
            const r = dpr(); c.setTransform(r, 0, 0, r, 0, 0); c.fillStyle = css('--panel') || '#fff'; c.fillRect(0, 0, W, H)
            const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', e = Math.min(1, p), cx = W / 2, cy = H / 2, at = n => [cx + (n.x - cx) * e, cy + (n.y - cy) * e]
            const hot = sel || hover, touches = l => hot && (l.a === hot || l.b === hot)
            for (const l of L) { const [x1, y1] = at(l.a), [x2, y2] = at(l.b); c.strokeStyle = ink3; c.globalAlpha = hot ? (touches(l) ? 0.9 : 0.12) : 0.35; c.lineWidth = touches(l) ? 2 : 1; c.setLineDash(l.b.dashed || l.a.dashed ? [5, 4] : []); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke() }
            c.setLineDash([]); c.globalAlpha = 1
            c.font = '600 12px system-ui, sans-serif'
            for (const n of N) { const [x, y] = at(n), dim = hot && hot !== n && !L.some(l => touches(l) && (l.a === n || l.b === n)); c.globalAlpha = dim ? 0.3 : 1
                c.fillStyle = COL[n.kind]; c.strokeStyle = ink; c.lineWidth = hot === n ? 2.5 : 0.8; c.beginPath(); c.arc(x, y, n.r, 0, 7); if (n.dashed || n.listed) { c.fillStyle = css('--panel') || '#fff'; c.fill(); c.strokeStyle = COL[n.kind]; c.setLineDash([3, 2]); c.lineWidth = 2 } else c.fill(); c.stroke(); c.setLineDash([])
                c.fillStyle = ink
                if (n.kind === 'centre') { c.textAlign = 'center'; c.font = '700 14px system-ui, sans-serif'; halo(c, n.label, x, y + n.r + 16); c.font = '600 12px system-ui, sans-serif' }
                else { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, txt = n.label.length > 34 ? n.label.slice(0, 33) + '…' : n.label
                    c.textAlign = Math.abs(ux) < 0.35 ? 'center' : ux > 0 ? 'left' : 'right'; halo(c, txt, x + (Math.abs(ux) < 0.35 ? 0 : ux * (n.r + 6)), y + (Math.abs(ux) < 0.35 ? uy * (n.r + 12) + 4 : 4)) } }
            c.globalAlpha = 1
            if (hot) for (const l of L) if (touches(l)) { const [x1, y1] = at(l.a), [x2, y2] = at(l.b); c.font = '400 11px system-ui, sans-serif'; c.fillStyle = ink3; c.textAlign = 'center'; halo(c, l.v, (x1 + x2) / 2, (y1 + y2) / 2 - 3) }
            c.textAlign = 'start'; c.font = '400 12px system-ui, sans-serif'; let lx = 12
            for (const k of ['centre', ...kinds]) { c.fillStyle = COL[k]; c.beginPath(); c.arc(lx + 5, H - 14, 5, 0, 7); c.fill(); c.fillStyle = ink3; c.fillText(D.ui.kinds[k], lx + 14, H - 10); lx += 28 + c.measureText(D.ui.kinds[k]).width }
        }
        function frame(ts) { if (!t0) t0 = ts; p = still ? 1 : Math.min(1, (ts - t0) / 1200); draw(); if (p < 1) requestAnimationFrame(frame) }
        const hit = ev => { const b = cv.getBoundingClientRect(), x = ev.clientX - b.left, y = ev.clientY - b.top; let best = null, bd = 12; for (const n of N) { const d = Math.hypot(n.x - x, n.y - y) - n.r; if (d < bd) { bd = d; best = n } } return best }
        cv.addEventListener('mousemove', ev => { hover = hit(ev); cv.style.cursor = hover ? 'pointer' : 'default'; if (p >= 1) draw() })
        cv.addEventListener('click', ev => { sel = hit(ev); if (sel) S.show(sel.label, (D.ui.kinds[sel.kind] || sel.kind), sel.note, sel.srcs, L.filter(l => l.a === sel || l.b === sel).map(l => el('li', {}, `${l.a.label} ${l.v} ${l.b.label}`, ...(l.s && l.s[0] ? [' ', el('a', { href: l.s[0].url, target: '_blank', rel: 'noopener', textContent: '(source)' })] : [])))); draw() })
        function size() { const r = dpr(); W = Math.max(S.wrapEl.clientWidth, 940); H = Math.max(560, Math.round(W * 0.6)); cv.width = W * r; cv.height = H * r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; layout(); draw() }
        S.cap.textContent = D.ui.dashedNote; addEventListener('resize', size); size(); requestAnimationFrame(frame)
    }
    // ------------------------------------------------------------------ the timeline
    function timeline() {
        const S = section(D.ui.timeline, 'timeline'), { cv, c } = S, T = D.timeline, CARD = 150, GAP = 14
        let W, H = 420, sel = null
        const x = i => 40 + i * (CARD + GAP) + CARD / 2, ok = () => { const r = dpr(); c.setTransform(r, 0, 0, r, 0, 0) }
        function draw() {
            ok(); c.fillStyle = css('--panel') || '#fff'; c.fillRect(0, 0, W, H); const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', mid = H / 2
            c.strokeStyle = ink3; c.lineWidth = 2; c.beginPath(); c.moveTo(20, mid); c.lineTo(W - 20, mid); c.stroke()
            T.forEach((e, i) => { const up = i % 2 === 0, cx = x(i), top = up ? 24 : mid + 34, h = mid - 58
                c.strokeStyle = ink3; c.lineWidth = 1; c.setLineDash(e.future ? [4, 3] : []); c.beginPath(); c.moveTo(cx, mid); c.lineTo(cx, up ? top + h : top); c.stroke(); c.setLineDash([])
                c.fillStyle = e.future ? (css('--panel') || '#fff') : COL.centre; c.strokeStyle = COL.centre; c.lineWidth = 2; c.beginPath(); c.arc(cx, mid, 6, 0, 7); c.fill(); c.stroke()
                c.fillStyle = sel === e ? (css('--paper-2') || '#eee') : (css('--panel') || '#fff'); c.strokeStyle = sel === e ? ink : css('--hair') || '#ccc'; c.lineWidth = sel === e ? 2 : 1; c.setLineDash(e.future ? [4, 3] : [])
                c.beginPath(); c.rect(cx - CARD / 2, top, CARD, h); c.fill(); c.stroke(); c.setLineDash([]); e._box = [cx - CARD / 2, top, CARD, h]
                c.textAlign = 'start'; c.fillStyle = COL.centre; c.font = '700 12px system-ui, sans-serif'; c.fillText(e.when + (e.future ? ' · ' + D.ui.future : ''), cx - CARD / 2 + 8, top + 18)
                c.fillStyle = ink; c.font = '700 13px system-ui, sans-serif'; let y = top + 36; for (const ln of wrap(c, e.title, CARD - 16).slice(0, 3)) { c.fillText(ln, cx - CARD / 2 + 8, y); y += 16 }
                c.fillStyle = ink3; c.font = '400 12px system-ui, sans-serif'; y += 2; for (const ln of wrap(c, e.stat || e.text, CARD - 16).slice(0, Math.max(1, Math.floor((top + h - y - 4) / 15)))) { c.fillText(ln, cx - CARD / 2 + 8, y); y += 15 } })
        }
        const hit = ev => { const b = cv.getBoundingClientRect(), px = ev.clientX - b.left, py = ev.clientY - b.top; return T.find(e => e._box && px >= e._box[0] && px <= e._box[0] + e._box[2] && py >= e._box[1] && py <= e._box[1] + e._box[3]) }
        cv.addEventListener('mousemove', ev => { cv.style.cursor = hit(ev) ? 'pointer' : 'default' })
        cv.addEventListener('click', ev => { sel = hit(ev) || null; if (sel) S.show(sel.title, sel.when, sel.text + (sel.stat ? ' (' + sel.stat + ', self-reported)' : ''), sel.srcs); draw() })
        const r = dpr(); W = Math.max(S.wrapEl.clientWidth, 80 + T.length * (CARD + GAP)); cv.width = W * r; cv.height = H * r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; draw()
    }
    // ------------------------------------------------------------------ the map
    function map() {
        const S = section(D.ui.map, 'map'), { cv, c } = S, B = { lon0: -9.1, lon1: -7.25, lat0: 37.55, lat1: 36.85 }, K = Math.cos(37.1 * Math.PI / 180)
        let W, H, sel = null
        const proj = ([lo, la]) => [(lo - B.lon0) / (B.lon1 - B.lon0) * W, (B.lat0 - la) / (B.lat0 - B.lat1) * H]
        function draw() {
            const r = dpr(); c.setTransform(r, 0, 0, r, 0, 0); const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666'
            c.fillStyle = '#dbe8ef'; c.fillRect(0, 0, W, H)
            for (const [name, fill] of [['Spain', css('--paper') || '#f1eee6'], ['Portugal', css('--paper-2') || '#e8e4da']]) for (const poly of O.countries[name] || []) { c.beginPath(); poly[0].forEach((q, i) => { const [x, y] = proj(q); i ? c.lineTo(x, y) : c.moveTo(x, y) }); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = ink3; c.lineWidth = 1; c.stroke() }
            c.font = '600 12px system-ui, sans-serif'
            for (const p of D.places) { const [x, y] = proj(p.ll); p._xy = [x, y]; c.fillStyle = p.hq ? COL.centre : COL.event; c.strokeStyle = ink; c.lineWidth = sel === p ? 3 : 1; c.beginPath(); c.arc(x, y, p.hq ? 10 : 7, 0, 7); c.fill(); c.stroke(); c.fillStyle = ink; c.textAlign = 'center'; halo(c, p.name, x, y - (p.hq ? 16 : 12)) }
            c.textAlign = 'start'; c.fillStyle = ink3; c.font = '400 11px system-ui, sans-serif'; c.fillText(D.ui.mapNote, 10, H - 10)
        }
        const hit = ev => { const b = cv.getBoundingClientRect(), x = ev.clientX - b.left, y = ev.clientY - b.top; return D.places.find(p => p._xy && Math.hypot(p._xy[0] - x, p._xy[1] - y) < 14) }
        cv.addEventListener('mousemove', ev => { cv.style.cursor = hit(ev) ? 'pointer' : 'default' })
        cv.addEventListener('click', ev => { sel = hit(ev) || null; if (sel) S.show(sel.name, sel.hq ? D.ui.kinds.centre : '', sel.note, sel.srcs); draw() })
        function size() { const r = dpr(); W = S.wrapEl.clientWidth; H = Math.round(W * (B.lat0 - B.lat1) / ((B.lon1 - B.lon0) * K)); cv.width = W * r; cv.height = H * r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; draw() }
        addEventListener('resize', size); size()
    }
    function figures() {
        if (!D.figures || !D.figures.length) return
        const KIND = { fact: 'fact', 'self-reported': 'self-reported', target: 'target' }
        root.append(el('section', { className: 'ae-sec' }, el('div', { className: 'gv-bar' }, el('h2', { textContent: D.ui.figures || 'The numbers' })),
            el('div', { className: 'ae-figs' }, ...D.figures.map(f => el('div', { className: 'ae-fig' }, el('strong', { textContent: f.value }), el('span', { textContent: f.what }), el('small', { textContent: [f.as_of, KIND[f.kind] || f.kind].filter(Boolean).join(' · ') }),
                ...(f.srcs && f.srcs[0] ? [el('a', { href: f.srcs[0].url, target: '_blank', rel: 'noopener', textContent: D.ui.source })] : []))))))
    }
    Promise.all([fetch(root.dataset.data).then(r => r.json()), fetch(root.dataset.outline).then(r => r.json())])
        .then(([d, o]) => { D = d; O = o; network(); timeline(); map(); figures() }).catch(() => root.append(el('p', { textContent: 'The data could not be loaded.' })))
})()
