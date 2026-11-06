// The past summits (/graph/past-summits/): attendance at Web Summit in Lisbon, 2016 to 2025, one column per edition, drawn from
// assets/graph/past-summits.json. The mark says how far each figure was read: at source, in Wikipedia's table, in a summary only,
// or not found. Plain canvas. By dev.graphs@PrompTugal.dinis.
(() => {
    const root = document.getElementById('gp'); if (!root) return
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const cv = el('canvas'), cap = el('p', { className: 'gv-cap' }), side = el('aside', { className: 'gv-side' })
    let D, W = 0, H = 0, sel = null, p = 1, t0 = 0, cols = []
    const ctx = cv.getContext('2d'), MAX = 80000
    const short = d => (d.label.startsWith('about') ? '~' : '') + (d.value / 1000).toFixed(d.value % 1000 > 99 && d.value % 1000 < 900 ? 1 : 0).replace(/\.0$/, '') + 'k'
    function draw() {
        const r = Math.min(2, devicePixelRatio || 1); ctx.setTransform(r, 0, 0, r, 0, 0); ctx.fillStyle = css('--panel') || '#fff'; ctx.fillRect(0, 0, W, H)
        const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', col = css('--brand') || '#1a7f37', hair = css('--hair') || '#ddd', L = 46, B = H - 46, T = 24, n = D.editions.length, cw = (W - L - 12) / n, e = 1 - Math.pow(1 - Math.min(1, p), 3)
        ctx.font = '400 11px system-ui, sans-serif'; ctx.textAlign = 'right'
        for (const v of [0, 20000, 40000, 60000, 80000]) { const y = B - (B - T) * v / MAX; ctx.strokeStyle = hair; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 6, y); ctx.stroke(); ctx.fillStyle = ink3; ctx.fillText(v.toLocaleString('en-GB'), L - 6, y + 4) }
        cols = []
        D.editions.forEach((d, i) => {
            const x = L + i * cw + cw * 0.18, w = cw * 0.64, on = sel === d; cols.push({ x: x - cw * 0.18, w: cw, d })
            ctx.textAlign = 'center'; ctx.fillStyle = ink; ctx.font = (on ? '700' : '600') + ' 12px system-ui, sans-serif'; ctx.fillText(d.year, x + w / 2, B + 18)
            if (d.value) {
                const h = (B - T) * d.value / MAX * e, y = B - h
                if (d.status === 'summary') { ctx.setLineDash([5, 4]); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); ctx.setLineDash([]) }
                else { ctx.globalAlpha = d.status === 'tertiary' ? 0.55 : 1; ctx.fillStyle = col; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1 }
                if (on) { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.strokeRect(x, y, w, h) }
                ctx.fillStyle = ink; ctx.font = (cw < 40 ? '600 10px' : '600 11px') + ' system-ui, sans-serif'; ctx.globalAlpha = e; ctx.fillText(cw < 40 ? short(d) : d.label, x + w / 2, y - 6); ctx.globalAlpha = 1
            } else { ctx.strokeStyle = ink3; ctx.lineWidth = on ? 2 : 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, B - 1); ctx.lineTo(x + w, B - 1); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = ink3; ctx.font = '400 11px system-ui, sans-serif'; ctx.fillText(d.label, x + w / 2, B - 8) }
        })
        // legend
        ctx.textAlign = 'start'; ctx.font = '400 11px system-ui, sans-serif'; let lx = L, ly = 14
        for (const k of ['read', 'tertiary', 'summary', 'none']) { const sw = 12, tw = ctx.measureText(D.ui.legend[k]).width; if (lx + sw + 5 + tw > W - 6 && lx > L) { lx = L; ly += 16 } ctx.fillStyle = col; ctx.strokeStyle = k === 'none' ? ink3 : col
            if (k === 'summary' || k === 'none') { ctx.setLineDash([3, 2]); ctx.lineWidth = 1.5; ctx.strokeRect(lx, ly - 10, sw, sw); ctx.setLineDash([]) } else { ctx.globalAlpha = k === 'tertiary' ? 0.55 : 1; ctx.fillRect(lx, ly - 10, sw, sw); ctx.globalAlpha = 1 }
            ctx.fillStyle = ink3; ctx.fillText(D.ui.legend[k], lx + sw + 5, ly); lx += sw + 18 + tw }
    }
    function show(d) {
        sel = d; side.replaceChildren(el('h2', { textContent: `Web Summit ${d.year}` }), el('p', { className: 'gv-meta', textContent: `${d.dates} · ${d.venue} · ${D.ui.legend[d.status]}` }), el('p', { textContent: d.note }))
        const s = D.sources[d.src]; if (s) side.append(el('a', { href: s.url, target: '_blank', rel: 'noopener', textContent: `${D.ui.source}: ${s.label}` })); draw()
    }
    cv.addEventListener('click', ev => { const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, c = cols.find(q => x >= q.x && x < q.x + q.w); if (c) show(c.d) })
    cv.addEventListener('mousemove', ev => { const r = cv.getBoundingClientRect(), x = ev.clientX - r.left; cv.style.cursor = cols.some(q => x >= q.x && x < q.x + q.w) ? 'pointer' : 'default' })
    function size() { const r = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = Math.max(340, Math.round(W * 0.55)); cv.width = W * r; cv.height = H * r; cv.style.height = H + 'px'; if (D) draw() }
    function frame(ts) { if (!t0) t0 = ts; p = still ? 1 : Math.min(1, (ts - t0) / 1100); draw(); if (p < 1) requestAnimationFrame(frame) }
    addEventListener('resize', size)
    fetch(root.dataset.data).then(r => r.json()).then(d => { D = d; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', d.ui.caption)
        const png = el('button', { type: 'button', className: 'chip', textContent: d.ui.png }); png.addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'promptugal-past-summits.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
        cap.textContent = d.ui.caption + ' ' + d.ui.cautions; side.append(el('p', { textContent: d.ui.empty })); root.append(el('div', { className: 'gv-bar' }, png), el('div', { className: 'gv-main' }, el('div', {}, cv, cap), side)); size(); requestAnimationFrame(frame) }).catch(() => root.append(el('p', { textContent: 'The data could not be loaded.' })))
})()
