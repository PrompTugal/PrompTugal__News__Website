// The cloud centres (/graph/cloud-centres/): where Google, Amazon (and AWS) and Microsoft stand among the summit's companies, as a
// matrix of three centres by four relations, each cell found (with its source), searched and not found, or not looked at yet.
// Drawn from assets/graph/cloud-centres.json; it shows what the evidence says and no more. Plain canvas. By dev.graphs@PrompTugal.dinis.
(() => {
    const root = document.getElementById('gc'); if (!root) return
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    let D; const cv = el('canvas'), cap = el('p', { className: 'gv-cap' }), side = el('aside', { className: 'gv-side' })
    cv.setAttribute('role', 'img'); const ctx = cv.getContext('2d'); let W = 0, H = 0, sel = null, boxes = []
    function wrap(text, max) { const out = []; let line = ''; for (const w of String(text).split(' ')) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > max && line) { out.push(line); line = w } else line = t } if (line) out.push(line); return out }
    function draw() {
        const r = Math.min(2, devicePixelRatio || 1); ctx.setTransform(r, 0, 0, r, 0, 0); ctx.fillStyle = css('--panel') || '#fff'; ctx.fillRect(0, 0, W, H)
        const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', rowW = Math.min(170, W * 0.24), colW = (W - rowW - 20) / D.centres.length, top = 64, rowH = (H - top - 14) / D.relations.length
        boxes = []; ctx.textAlign = 'center'
        D.centres.forEach((c, i) => { const x = rowW + 10 + i * colW + colW / 2; ctx.fillStyle = c.color; ctx.globalAlpha = 0.14; ctx.fillRect(x - colW / 2 + 4, 6, colW - 8, H - 12); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.font = (colW < 130 ? '700 13px' : '700 16px') + ' system-ui, sans-serif'; wrap(c.label, colW - 10).forEach((ln, k, a) => ctx.fillText(ln, x, 36 - (a.length - 1) * 8 + k * 16)) })
        D.relations.forEach((rel, j) => { const y = top + j * rowH; ctx.textAlign = 'left'; ctx.fillStyle = ink; ctx.font = '600 13px system-ui, sans-serif'; wrap(rel.label, rowW - 8).forEach((ln, k) => ctx.fillText(ln, 8, y + rowH / 2 - 6 + k * 16))
            D.centres.forEach((c, i) => { const cell = c.cells[rel.id], x = rowW + 10 + i * colW + colW / 2, cy = y + rowH / 2, on = sel && sel.cell === cell
                ctx.lineWidth = on ? 3 : 1.5; ctx.strokeStyle = on ? ink : c.color; ctx.setLineDash(cell.state === 'none' ? [5, 4] : []); ctx.beginPath(); ctx.arc(x, cy - 8, 17, 0, 7)
                if (cell.state === 'found') { ctx.fillStyle = c.color; ctx.fill() } ctx.stroke(); ctx.setLineDash([])
                ctx.textAlign = 'center'; ctx.fillStyle = ink3; ctx.font = (colW < 130 ? '400 10.5px' : '400 12px') + ' system-ui, sans-serif'; wrap(cell.state === 'found' ? (cell.label || D.ui.states.found) : D.ui.states[cell.state], colW - 8).slice(0, 2).forEach((ln, k) => ctx.fillText(ln, x, cy + 26 + k * 12))
                boxes.push({ x, y: cy - 8, r: 22, cell, c, rel }) }) })
        ctx.textAlign = 'start'
    }
    function show(b) {
        sel = b; side.replaceChildren(el('h2', { textContent: `${b.c.label}: ${b.rel.label}` }), el('p', { className: 'gv-meta', textContent: D.ui.states[b.cell.state] }), el('p', { textContent: b.cell.text }))
        const s = D.sources[b.cell.src]; if (s) side.append(el('a', { href: s.url, target: '_blank', rel: 'noopener', textContent: `${D.ui.source}: ${s.label}` }), el('br'))
        if (b.cell.page) side.append(el('a', { href: root.dataset.root + b.cell.page, target: '_blank', rel: 'noopener', textContent: D.ui.page })); draw()
    }
    cv.addEventListener('click', ev => { const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top, b = boxes.find(q => Math.hypot(q.x - x, q.y - y) < q.r); if (b) show(b) })
    cv.addEventListener('mousemove', ev => { const r = cv.getBoundingClientRect(); cv.style.cursor = boxes.some(q => Math.hypot(q.x - (ev.clientX - r.left), q.y - (ev.clientY - r.top)) < q.r) ? 'pointer' : 'default' })
    function size() { const r = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = Math.max(420, Math.round(W * 0.7)); cv.width = W * r; cv.height = H * r; cv.style.height = H + 'px'; if (D) draw() }
    addEventListener('resize', size)
    fetch(root.dataset.data).then(r => r.json()).then(d => { D = d; cv.setAttribute('aria-label', d.ui.caption)
        const png = el('button', { type: 'button', className: 'chip', textContent: d.ui.png }); png.addEventListener('click', () => cv.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'promptugal-cloud-centres.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000) }))
        cap.textContent = d.ui.caption; side.append(el('p', { textContent: d.ui.empty })); root.append(el('div', { className: 'gv-bar' }, png), el('div', { className: 'gv-main' }, el('div', {}, cv, cap), side)); size() }).catch(() => root.append(el('p', { textContent: 'The data could not be loaded.' })))
})()
