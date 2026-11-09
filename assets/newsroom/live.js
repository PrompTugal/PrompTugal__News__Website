// The live map of Dinis's agents (/newsroom/live/), drawn from api/v1/newsroom/live.json (built from this repository's commits by
// newsroom/build/features/live.mjs). After Angelo's Live view (dev.map@PrompTugal.angelo, SGit-AI/SGit-AI__Website__Web-Summit,
// people/angelo/app/live.js): a hexagon, a hub per person, a line per exchange, each exchange travelling its line at its real moment,
// and a faint constant flow along each line as dense as that pair's recent traffic. Our own code, data and look.
// One clock (the map's time) drives everything: live follows the wall clock a few minutes behind; the time controls of phase 2 move it.
// Plain canvas, no dependency. By dev.graphs@PrompTugal.dinis, 7 November 2026 (WS-177).
(() => {
    const root = document.getElementById('lv'); if (!root) return
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const S = 1000, C = S / 2, SCALE = 0.84, PULL = 0.55, TRAVEL = 1600, FADE = 3200, DELAY = 4 * 6e4, HALF_H = 3, POLL = 60000
    const HEX = [[250, 67], [750, 67], [1000, 500], [750, 933], [250, 933], [0, 500]]
    const HUES = { dinis: null, silvio: 30, vicky: 280, angelo: 195, jose: 340, indi: 120, other: 220 }
    const KIND = { f: 'named in For: or To:', m: 'named in the commit subject', s: 'at work' }
    const lis = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    const when = ms => lis.format(ms).replace(',', '')
    const cv = el('canvas', { className: 'lv-cv', tabIndex: 0 }), stage = el('div', { className: 'lv-stage' }, cv)
    const bar = el('div', { className: 'lv-bar' }), side = el('aside', { className: 'lv-side' }), status = el('p', { className: 'lv-status', role: 'status' })
    const pop = el('button', { type: 'button', className: 'lv-btn', textContent: 'Pop out' })
    const showS = el('input', { type: 'checkbox', checked: true, id: 'lv-s' }), showM = el('input', { type: 'checkbox', checked: true, id: 'lv-m' })
    bar.append(pop, el('label', { htmlFor: 'lv-m' }, showM, ' also: named in a subject'), el('label', { htmlFor: 'lv-s' }, showS, ' at work (pulse)'))
    const clock = el('output', { className: 'lv-clock' }), tl = el('canvas', { className: 'lv-tl', height: 56 }), tip = el('p', { className: 'lv-tip' })
    const bPlay = el('button', { type: 'button', className: 'lv-btn', textContent: 'Play' }), bBack = el('button', { type: 'button', className: 'lv-btn', textContent: '◀ Previous', title: 'Back to the previous exchange' }), bFwd = el('button', { type: 'button', className: 'lv-btn', textContent: 'Next ▶', title: 'Forward to the next exchange' }), bNow = el('button', { type: 'button', className: 'lv-btn', textContent: 'Live' })
    const spd = el('select', { className: 'lv-btn', ariaLabel: 'Speed' }, ...[[1, '1 minute a second'], [10, '10 minutes a second'], [60, '1 hour a second'], [360, '6 hours a second'], [1440, '1 day a second']].map(([v, t]) => el('option', { value: v, textContent: t }))); spd.value = 60
    const rng = el('input', { type: 'range', className: 'lv-rng', min: 0, max: 1, step: 1, ariaLabel: 'Time: move the map back or forward' })
    const time = el('div', { className: 'lv-time' }, el('div', { className: 'lv-ctl' }, bBack, bPlay, bFwd, spd, bNow, clock), tl, rng, tip)
    root.append(bar, time, el('div', { className: 'lv-main' }, stage, side), status)

    let D = null, det = null, nodes = new Map(), byAgent = [], links = [], W = 0, H = 0, sel = null, hot = null, win = window
    let T = Date.now() - DELAY, lastT = T, pulses = [], flow = new Map(), raf = 0, ctx = cv.getContext('2d'), seq = 0
    const mode = { live: true }

    // ---------- layout: Dinis at the centre, his agents in rings; the other people at the hexagon, their agents beside them
    function layout() {
        nodes = new Map(); byAgent = []
        const ag = D.agents, cnt = ag.map(() => 0)
        for (const e of D.events) { cnt[e[1]]++; for (const t of e[3]) cnt[t]++ }
        const groups = new Map()
        ag.forEach((a, i) => { const p = a.person; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(i) })
        groups.set('dinis', groups.get('dinis') || [])
        const others = [...groups.keys()].filter(p => p !== 'dinis').sort((a, b) => groups.get(b).length - groups.get(a).length)
        const place = (id, x, y, o) => { const n = Object.assign({ id, x, y, deg: 0 }, o); nodes.set(id, n); return n }
        const colour = p => HUES[p] == null ? (css('--brand') || '#1a7f37') : `hsl(${HUES[p]} 62% 48%)`
        place('p:dinis', C, C, { kind: 'p', label: 'Dinis', person: 'dinis', col: colour('dinis') })
        others.forEach((p, k) => {
            const a = -Math.PI / 2 + k * 2 * Math.PI / others.length + (others.length > 1 ? 0.3 : 0), hx = C + 345 * Math.cos(a), hy = C + 345 * Math.sin(a)
            place('p:' + p, hx, hy, { kind: 'p', label: p[0].toUpperCase() + p.slice(1), person: p, col: colour(p), a })
        })
        for (const [p, list] of groups) {
            const mine = list.filter(i => !(D.agents[i].id.indexOf('@') < 0)).sort((x, y) => cnt[y] - cnt[x]), hub = nodes.get('p:' + p)
            if (!hub) continue
            if (p === 'dinis') {
                let k = 0, ring = 0
                while (k < mine.length) { const cap = 8 + ring * 6, take = mine.slice(k, k + cap), r = 130 + ring * 62; take.forEach((i, j) => { const a = -Math.PI / 2 + (j + 0.5 * (ring % 2)) * 2 * Math.PI / take.length; nodes.set(i, { id: i, x: C + r * Math.cos(a), y: C + r * Math.sin(a), kind: 'a', person: p, col: hub.col, deg: 0, label: lab(D.agents[i]), ang: a }) }); k += cap; ring++ }
            } else {
                const spread = Math.min(Math.PI * 1.1, 0.3 * mine.length + 0.4)
                mine.forEach((i, j) => { const a = hub.a + (mine.length > 1 ? -spread / 2 + j * spread / (mine.length - 1) : 0), r = 62 + (j % 2) * 26; nodes.set(i, { id: i, x: hub.x + r * Math.cos(a), y: hub.y + r * Math.sin(a), kind: 'a', person: p, col: hub.col, deg: 0, label: lab(D.agents[i]), ang: a }) })
            }
        }
        // an agent index for a person ("dinis", "silvio") draws at that person's hub
        ag.forEach((a, i) => { byAgent[i] = nodes.get(i) || nodes.get('p:' + a.person) || nodes.get('p:dinis') })
    }
    const lab = a => a.id.split('@')[0] + (/@web-summit\./i.test(a.id) ? ' (ws)' : '')
    const bend = (a, b) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; return { x: mx + (C - mx) * PULL, y: my + (C - my) * PULL } }
    const at = (a, b, u) => { const q = bend(a, b), v = 1 - u; return { x: v * v * a.x + 2 * v * u * q.x + u * u * b.x, y: v * v * a.y + 2 * v * u * q.y + u * u * b.y } }

    // ---------- events that count now
    const visible = e => e[2] === 'f' || (e[2] === 'm' && showM.checked) || (e[2] === 's' && showS.checked)
    const ends = e => e[2] === 's' ? [byAgent[e[1]], byAgent[e[1]]] : e[3].map(t => [byAgent[e[1]], byAgent[t]]).flat()
    const QUIET = 3 * 36e5   // an agent with no commit for this long, at the map's moment, is drawn dim: the nearest thing to "offline" the public history shows
    let act = new Map()
    function recount() {
        flow = new Map(); links = []; act = new Map()
        for (const e of D.events) { const t = e[0] * 6e4; if (t <= T + (mode.live ? DELAY : 0)) act.set(e[1], t) }
        const lam = Math.LN2 / (HALF_H * 36e5), ref = T
        for (const e of D.events) {
            if (e[2] === 's' || !visible(e)) continue
            const t = e[0] * 6e4; if (t > ref || ref - t > 48 * 36e5) continue
            for (const tg of e[3]) { const a = e[1] < tg ? e[1] + ':' + tg : tg + ':' + e[1]; flow.set(a, (flow.get(a) || 0) + Math.exp(-lam * (ref - t))) }
        }
        const all = new Set()
        for (const e of D.events) if (e[2] !== 's') for (const tg of e[3]) all.add(e[1] < tg ? e[1] + ':' + tg : tg + ':' + e[1])
        links = [...all].map(k => k.split(':').map(Number))
        nodes.forEach(n => (n.deg = 0)); for (const [a, b] of links) { if (byAgent[a]) byAgent[a].deg++; if (byAgent[b]) byAgent[b].deg++ }
    }
    function spawn(from, to) {
        const pick = D.events.filter(e => { const t = e[0] * 6e4; return t > from && t <= to && visible(e) }).slice(-40)
        for (const e of pick) {
            const when_ = performance.now() + (still ? 0 : Math.random() * 3000)
            if (e[2] === 's') pulses.push({ a: byAgent[e[1]], b: byAgent[e[1]], t0: when_, e, solo: true })
            else for (const tg of e[3]) pulses.push({ a: byAgent[e[1]], b: byAgent[tg], t0: when_, e })
        }
    }

    // ---------- drawing
    function size() { const r = stage.getBoundingClientRect(); W = Math.max(280, r.width); H = Math.max(280, r.height); const k = Math.min(2, win.devicePixelRatio || 1); cv.width = W * k; cv.height = H * k; ctx.setTransform(k, 0, 0, k, 0, 0) }
    const px = n => { const m = Math.min(W, H) / S, ox = (W - S * m) / 2, oy = (H - S * m) / 2; return { x: ox + (C + (n.x - C) * SCALE) * m, y: oy + (C + (n.y - C) * SCALE) * m, m } }
    const P = n => px(n)
    function curve(a, b) { ctx.beginPath(); const q = bend(a, b), A = P(a), Q = P(q), B = P(b); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(Q.x, Q.y, B.x, B.y) }
    function draw(now) {
        const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', hair = css('--hair') || '#ddd', brand = css('--brand') || '#1a7f37', panel = css('--panel') || '#fff'
        ctx.fillStyle = panel; ctx.fillRect(0, 0, W, H)
        const m = Math.min(W, H) / S, ox = (W - S * m) / 2, oy = (H - S * m) / 2
        ctx.beginPath(); HEX.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](ox + x * m, oy + y * m)); ctx.closePath()
        ctx.fillStyle = css('--wash') || 'rgba(127,127,127,.06)'; ctx.fill(); ctx.strokeStyle = brand; ctx.globalAlpha = .7; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1
        // links: faint, lit by recent traffic
        let mx = 0; for (const v of flow.values()) mx = Math.max(mx, v)
        for (const [a, b] of links) {
            const A = byAgent[a], B = byAgent[b]; if (!A || !B || A === B) continue
            const v = flow.get(a < b ? a + ':' + b : b + ':' + a) || 0, k = mx ? v / mx : 0, isSel = sel && (byAgent[sel.i] === A || byAgent[sel.i] === B)
            curve(A, B); ctx.strokeStyle = isSel ? ink : A.col; ctx.globalAlpha = isSel ? .75 : 0.08 + 0.4 * Math.sqrt(k); ctx.lineWidth = 0.6 + 2.6 * Math.sqrt(k); ctx.stroke()
        }
        ctx.globalAlpha = 1
        // the constant flow, as dense as the pair's recent traffic
        if (!still) for (const [k, v] of flow) {
            const [a, b] = k.split(':').map(Number), A = byAgent[a], B = byAgent[b]; if (!A || !B || A === B) continue
            const n = Math.min(6, Math.ceil(2.4 * Math.sqrt(v / (mx || 1)))); if (v < 0.02) continue
            for (let j = 0; j < n; j++) { const u = ((now / 3000) + j / n + (a * 7 + b) * 0.13) % 1, p = at(A, B, u), Q = P(p); ctx.fillStyle = A.col; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(Q.x, Q.y, 1.9, 0, 7); ctx.fill() }
        }
        ctx.globalAlpha = 1
        // nodes
        for (const n of nodes.values()) {
            const p = P(n), hotN = hot && (hot.a === n || hot.b === n), on = sel && byAgent[sel.i] === n
            const idle = n.kind === 'a' && !hotN && !on && !(act.has(n.id) && T - act.get(n.id) < QUIET + (mode.live ? DELAY : 0)); ctx.globalAlpha = idle ? 0.32 : 1
            ctx.beginPath(); ctx.arc(p.x, p.y, (n.kind === 'p' ? 9 : 4.6 + Math.min(3, n.deg * 0.18)) * Math.max(0.8, p.m * 1.15), 0, 7); ctx.fillStyle = n.col; ctx.fill()
            if (on || hotN) { ctx.lineWidth = 2.5; ctx.strokeStyle = ink; ctx.stroke() }
            ctx.globalAlpha = idle ? 0.5 : 1
            if (n.kind === 'p' || on || hotN || W > 560) { ctx.fillStyle = n.kind === 'p' ? ink : ink3; ctx.font = (n.kind === 'p' ? '700 13px' : '400 10.5px') + ' system-ui, sans-serif'; ctx.textAlign = 'center'; if (n.kind === 'p') { ctx.fillText(n.label, p.x, p.y - 15) } else { const c = Math.cos(n.ang), s2 = Math.sin(n.ang); ctx.textAlign = c > 0.35 ? 'left' : c < -0.35 ? 'right' : 'center'; ctx.fillText(n.label, p.x + c * 9, p.y + s2 * 9 + 3.5) } }
        }
        ctx.globalAlpha = 1
        // the exchanges, each travelling its line at its moment
        pulses = pulses.filter(q => now - q.t0 < TRAVEL + FADE)
        for (const q of pulses) {
            const age = now - q.t0; if (age < 0 || !q.a || !q.b) continue
            const col = q.a.col
            if (q.solo) { const p = P(q.a), r = 6 + 20 * Math.min(1, age / FADE); ctx.strokeStyle = col; ctx.globalAlpha = 1 - Math.min(1, age / FADE); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.stroke(); continue }
            const u = Math.min(1, age / TRAVEL), fade = age > TRAVEL ? 1 - (age - TRAVEL) / FADE : 1
            curve(q.a, q.b); ctx.strokeStyle = col; ctx.globalAlpha = .75 * fade; ctx.lineWidth = 3; ctx.stroke()
            const p = P(at(q.a, q.b, u)); ctx.globalAlpha = fade; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, 5.5, 0, 7); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = panel; ctx.stroke()
            ctx.fillStyle = ink; ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(when(q.e[0] * 6e4).slice(-5), p.x + 8, p.y - 7)
        }
        ctx.globalAlpha = 1
    }

    // ---------- the timeline: exchanges per hour over the whole record, the map's moment as a line; hover or tap to read a time
    let tlr = null
    function drawTl() {
        if (!D) return
        const w = tl.clientWidth || 600, h = 56, k = Math.min(2, win.devicePixelRatio || 1); if (tl.width !== w * k) { tl.width = w * k; tl.height = h * k }
        const c = tl.getContext('2d'); c.setTransform(k, 0, 0, k, 0, 0)
        const ink = css('--ink') || '#111', ink3 = css('--ink-3') || '#666', hair = css('--hair') || '#ddd', brand = css('--brand') || '#1a7f37'
        const t0 = Date.parse(D.from), t1 = Math.max(Date.now(), T), span = Math.max(36e5, t1 - t0), hrs = Math.ceil(span / 36e5), bk = new Array(hrs + 1).fill(0)
        for (const e of D.events) if (e[2] !== 's') bk[Math.min(hrs, Math.floor((e[0] * 6e4 - t0) / 36e5))]++
        const mxb = Math.max(1, ...bk), bw = w / (hrs + 1)
        c.clearRect(0, 0, w, h); c.fillStyle = brand; c.globalAlpha = .55
        bk.forEach((n, i) => { const bh = (h - 22) * n / mxb; c.fillRect(i * bw, h - 16 - bh, Math.max(1, bw - 0.6), bh) })
        c.globalAlpha = 1; c.strokeStyle = hair; c.beginPath(); c.moveTo(0, h - 15.5); c.lineTo(w, h - 15.5); c.stroke()
        c.fillStyle = ink3; c.font = '400 10.5px system-ui, sans-serif'; c.textAlign = 'left'
        const day0 = new Date(t0); day0.setUTCHours(0, 0, 0, 0)
        for (let d = day0.getTime(); d <= t1; d += 864e5) { if (d < t0) continue; const x = (d - t0) / span * w; c.fillRect(x, h - 15, 1, 5); c.fillText(new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }), x + 3, h - 3) }
        const x = (Math.min(T, t1) - t0) / span * w; c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h - 15); c.stroke(); c.lineWidth = 1
        tlr = { t0, span, w }
    }
    const tAt = ev => { const r = tl.getBoundingClientRect(); return tlr ? tlr.t0 + Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * tlr.span : 0 }
    tl.addEventListener('pointermove', ev => { tip.textContent = when(tAt(ev)) + ' (Lisbon)' })
    tl.addEventListener('pointerleave', () => { tip.textContent = '' })
    function readout() { clock.textContent = `${mode.live ? 'Live' : playing ? 'Playing' : 'Paused'}: ${when(T)} Lisbon` + (mode.live ? ` (${Math.round(DELAY / 6e4)} minutes behind)` : '') }

    // ---------- time travel: go(t) puts the map at a moment; play moves it on; Live goes back to the clock
    let playing = false, lastNow = 0
    const tmax = () => Date.now() - DELAY, tmin = () => Date.parse(D.from)
    function go(t, fire) {
        mode.live = false; T = Math.max(tmin(), Math.min(tmax(), t)); pulses = []; hot = null; recount(); list(); readout(); drawTl()
        if (fire) spawn(T - 1, T)
        rng.min = tmin(); rng.max = tmax(); rng.value = T
    }
    function live() { mode.live = true; playing = false; bPlay.textContent = 'Play'; T = tmax(); pulses = []; recount(); list(); readout(); drawTl() }
    const marks = () => D.events.filter(e => e[2] !== 's' && visible(e)).map(e => e[0] * 6e4)
    function step(dir) {
        const m = marks(), cur = mode.live ? tmax() : T
        const t = dir < 0 ? [...m].reverse().find(x => x < cur - 30000) : m.find(x => x > cur + 30000)
        if (t != null) { playing = false; bPlay.textContent = 'Play'; go(t, true) }
    }
    bPlay.addEventListener('click', () => { playing = !playing; if (playing && mode.live) { mode.live = false; T = tmin() } bPlay.textContent = playing ? 'Pause' : 'Play'; lastNow = performance.now(); if (playing && T >= tmax() - 1000) go(tmin()) })
    bBack.addEventListener('click', () => step(-1)); bFwd.addEventListener('click', () => step(1)); bNow.addEventListener('click', live)
    rng.addEventListener('input', () => { playing = false; bPlay.textContent = 'Play'; go(+rng.value) })
    let drag = false
    tl.addEventListener('pointerdown', ev => { drag = true; tl.setPointerCapture(ev.pointerId); playing = false; bPlay.textContent = 'Play'; go(tAt(ev)) })
    tl.addEventListener('pointermove', ev => { if (drag) go(tAt(ev)) })
    tl.addEventListener('pointerup', () => { drag = false })
    cv.addEventListener('keydown', ev => { if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1) } else if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1) } else if (ev.key === ' ') { ev.preventDefault(); bPlay.click() } else if (ev.key.toLowerCase() === 'l') live() })

    function frame() {
        raf = 0; const now = performance.now()
        if (mode.live) { const t = Date.now() - DELAY; if (t > T) { spawn(T, t); T = t } }
        else if (playing) {
            const dt = Math.min(250, now - lastNow); lastNow = now
            const to = Math.min(tmax(), T + dt / 1000 * (+spd.value) * 6e4); if (to > T) { spawn(T, to); T = to; if (now - (frame.rc || 0) > 400) { frame.rc = now; recount(); list(); rng.value = T } }
            if (to >= tmax()) live()
        }
        draw(now); if (now - (frame.tl || 0) > 1000) { frame.tl = now; drawTl(); readout() }
        raf = win.requestAnimationFrame(frame)
    }

    // ---------- side panel: the latest exchanges, and the one you tapped
    function list() {
        const ev = D.events.filter(e => e[2] !== 's' && visible(e) && e[0] * 6e4 <= (mode.live ? T + DELAY : T)).slice(-14).reverse()
        side.replaceChildren(el('h2', { textContent: 'Latest exchanges' }), el('p', { className: 'lv-meta', textContent: 'Lisbon time. Tap one to light it.' }),
            el('ul', { className: 'lv-list' }, ...ev.map(e => el('li', {}, el('button', { type: 'button', className: 'lv-row', onclick: () => pick(e), textContent: `${nm(e[1])} → ${e[3].map(nm).join(', ')} · ${when(e[0] * 6e4)} · ${KIND[e[2]]}` })))))
    }
    const nm = i => D.agents[i].id.replace(/@promptugal\.dinis$/i, '@').replace(/@web-summit\./i, '@ws.').replace(/@promptugal\./i, '@')
    function pick(e) {
        hot = { a: byAgent[e[1]], b: byAgent[e[3][0] == null ? e[1] : e[3][0]] }
        pulses.push(...(e[3].length ? e[3] : [e[1]]).map(t => ({ a: byAgent[e[1]], b: byAgent[t], t0: performance.now(), e, solo: !e[3].length })))
        announce(`${nm(e[1])} to ${e[3].map(nm).join(', ') || 'no one (at work)'}, ${when(e[0] * 6e4)}`); detail(e)
    }
    // the details of one exchange: the commit behind it (public already), read from live-details.json when first asked for
    let dets = null
    const page = f => { const m = f.match(/^content\/(.+?)(?:\/index)?\.md$/); return m && m[1] !== 'index' ? m[1] : null }
    async function detail(e) {
        const sha = e[4], back = el('button', { type: 'button', className: 'lv-btn', onclick: () => { hot = null; list() }, textContent: 'Back to the latest' })
        side.replaceChildren(el('h2', { textContent: `${nm(e[1])} → ${e[3].map(nm).join(', ') || 'at work'}` }), el('p', { className: 'lv-meta', textContent: `${when(e[0] * 6e4)} Lisbon · ${KIND[e[2]]}` }), el('p', { className: 'lv-meta', textContent: 'Reading the commit…' }), back)
        try {
            if (!dets) { const r = await fetch(root.dataset.details, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); dets = (await r.json()).commits }
            const c = dets[sha]; if (!c) throw new Error('no details')
            const pg = (c.f || []).map(page).find(Boolean), tr = Object.entries(c.t || {})
            side.replaceChildren(
                el('h2', { textContent: `${nm(e[1])} → ${e[3].map(nm).join(', ') || 'at work'}` }),
                el('p', { className: 'lv-meta', textContent: `${when(Date.parse(c.at))} Lisbon · ${KIND[e[2]]} · commit ${sha}` }),
                el('p', { className: 'lv-subject', textContent: c.s }),
                ...(c.b ? [el('pre', { className: 'lv-body', textContent: c.b })] : []),
                ...(tr.length ? [el('dl', { className: 'lv-tr' }, ...tr.flatMap(([k, v]) => [el('dt', { textContent: k }), el('dd', { textContent: v })]))] : []),
                el('p', { className: 'lv-meta', textContent: `${c.n} file${c.n === 1 ? '' : 's'} touched` }),
                el('ul', { className: 'lv-files' }, ...(c.f || []).map(f => el('li', { textContent: f })), ...(c.n > (c.f || []).length ? [el('li', { textContent: `and ${c.n - c.f.length} more` })] : [])),
                el('p', { className: 'lv-links' }, el('a', { href: `${root.dataset.repo}/commit/${sha}`, target: '_blank', rel: 'noopener', textContent: 'The commit on GitHub' }), ...(pg ? [' · ', el('a', { href: `../../${pg}/`, target: '_blank', rel: 'noopener', textContent: 'The page it changed' })] : [])),
                back)
        } catch (err) { side.replaceChildren(el('h2', { textContent: `${nm(e[1])} → ${e[3].map(nm).join(', ') || 'at work'}` }), el('p', { className: 'lv-meta', textContent: `${when(e[0] * 6e4)} Lisbon · ${KIND[e[2]]} · commit ${sha}` }), el('p', { className: 'lv-meta', textContent: 'The commit text could not be loaded.' }), el('a', { href: `${root.dataset.repo}/commit/${sha}`, target: '_blank', rel: 'noopener', textContent: 'The commit on GitHub' }), back) }
    }
    function announce(t) { status.textContent = t }
    cv.addEventListener('click', ev => {
        const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top; let best = null, bd = 18
        byAgent.forEach((n, i) => { if (!n) return; const p = P(n), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i } })
        if (best == null) {
            let lb = null, ld = 9
            for (const [a, b] of links) { const A = byAgent[a], B = byAgent[b]; if (!A || !B || A === B) continue; for (let u = 0.04; u < 1; u += 0.04) { const q = P(at(A, B, u)), d = Math.hypot(q.x - x, q.y - y); if (d < ld) { ld = d; lb = [a, b] } } }
            if (lb) { const lim = mode.live ? T + DELAY : T, e = [...D.events].reverse().find(e => e[2] !== 's' && visible(e) && e[0] * 6e4 <= lim && ((e[1] === lb[0] && e[3].includes(lb[1])) || (e[1] === lb[1] && e[3].includes(lb[0])))); if (e) { sel = null; pick(e); return } }
        }
        sel = best == null ? null : { i: best }; hot = null
        if (sel) { const a = D.agents[sel.i], mine = D.events.filter(e => e[1] === sel.i || e[3].includes(sel.i)).slice(-8).reverse(); side.replaceChildren(el('h2', { textContent: a.id }), el('p', { className: 'lv-meta', textContent: `${mine.length ? 'Its latest exchanges' : 'No exchanges yet'}, Lisbon time.` }), el('ul', { className: 'lv-list' }, ...mine.map(e => el('li', {}, el('button', { type: 'button', className: 'lv-row', onclick: () => pick(e), textContent: `${nm(e[1])} → ${e[3].map(nm).join(', ') || 'at work'} · ${when(e[0] * 6e4)} · ${KIND[e[2]]}` })))), el('button', { type: 'button', className: 'lv-btn', onclick: () => { sel = null; list() }, textContent: 'Back to the latest' })) } else list()
    })

    // ---------- pop out (Chrome and Edge on a desktop): the map in a small always-on-top window
    if (!('documentPictureInPicture' in window)) pop.hidden = true
    pop.addEventListener('click', async () => {
        try {
            const w = await documentPictureInPicture.requestWindow({ width: 420, height: 420 })
            for (const l of document.querySelectorAll('link[rel=stylesheet]')) w.document.head.append(l.cloneNode())
            w.document.body.style.margin = '0'; const pipStage = el('div', { className: 'lv-stage lv-pip' }); w.document.body.append(pipStage); pipStage.append(cv)
            win.cancelAnimationFrame(raf); win = w; stage.append(el('p', { className: 'lv-note', textContent: 'The map is in its own window.' }));
            w.addEventListener('pagehide', () => { win = window; stage.replaceChildren(cv); stage.querySelector('.lv-note')?.remove(); win.cancelAnimationFrame(raf); resize(); raf = win.requestAnimationFrame(frame) })
            w.addEventListener('resize', resize); resize(); raf = w.requestAnimationFrame(frame)
        } catch (e) { announce('This browser would not open a pop-out window.') }
    })

    // ---------- start
    function resize() { const host = cv.parentElement; const r = host.getBoundingClientRect(); const h = host.classList.contains('lv-pip') ? win.innerHeight : Math.round(Math.min(win.innerHeight * 0.78, Math.max(320, r.width * 0.88))); host.style.height = h + 'px'; size(); }
    async function load(first) {
        try {
            const r = await fetch(root.dataset.data + '?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status)
            const d = await r.json(); const fresh = !D || d.built_at !== D.built_at; if (!fresh) return
            D = d; layout(); recount()
            if (first) { T = Date.now() - DELAY; lastT = T; const newest = D.events.length ? D.events[D.events.length - 1][0] * 6e4 : 0; announce(`${D.events.length} exchanges since ${when(Date.parse(D.from))}; the latest ${when(newest)}.`); resize(); rng.min = tmin(); rng.max = tmax(); rng.value = tmax(); raf = win.requestAnimationFrame(frame) }
            list()
        } catch (e) { if (first) root.append(el('p', { className: 'note', textContent: 'The live map could not load its data.' })) }
    }
    ;[showS, showM].forEach(c => c.addEventListener('change', () => { if (D) { recount(); list() } }))
    win.addEventListener('resize', () => { if (D) resize() })
    document.addEventListener('visibilitychange', () => { if (!document.hidden && D && mode.live) { T = Math.max(T, Date.now() - DELAY - 30000) } })
    load(true); setInterval(() => load(false), POLL)
    root.__lv = { get T() { return T }, set T(v) { T = v }, mode, recount, spawn, draw, get D() { return D } }
})()
