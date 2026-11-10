// The workflow of a piece, drawn (the visual newsroom): lanes are the actors (agents), columns are the steps in time order, a line is
// the hand-off from one step to the next, a thicker arrow where the work changes hands. Data: api/v1/newsroom/piece-flows.json, built
// from this repository's history (newsroom/build/features/piece-flows.mjs). On a piece's own page (data-piece) and for the whole
// newsroom at /newsroom/pieces/ (data-all). Plain SVG, no dependency, text set as textContent. By dev.graphs@PrompTugal.dinis.
(() => {
    const NS = 'http://www.w3.org/2000/svg'
    const lis = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    const when = t => lis.format(Date.parse(t)).replace(',', '')
    const STAGE = { draft: 'Draft', review: 'Review', verify: 'Verify', design: 'Design', data: 'Data', voice: 'Voice brief', brief: 'Brief', build: 'Build', notes: 'Notes', publish: 'Publish', sign: 'Sign', other: 'Other' }
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const sv = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
    const role = a => a.split('@')[0] + (/@web-summit\./i.test(a) ? ' (ws)' : '')

    function draw(host, flow, repo) {
        host.replaceChildren()
        const steps = flow.steps, lanes = [...new Set(steps.map(s => s.a))]
        const LW = 176, CW = Math.max(46, Math.min(86, 760 / steps.length)), RH = 40, W = LW + steps.length * CW + 20, H = lanes.length * RH + 30
        const wrap = el('div', { className: 'pf-scroll' }), svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': `The workflow of ${flow.title}: ${steps.length} steps by ${lanes.length} actors` }); wrap.append(svg)
        const info = el('div', { className: 'pf-info', 'aria-live': 'polite' }), bar = el('div', { className: 'pf-bar' })
        const replay = el('button', { type: 'button', className: 'pf-btn', textContent: 'Replay' })
        bar.append(replay, el('span', { className: 'pf-legend' }, ...Object.keys(STAGE).filter(k => steps.some(s => s.st === k)).map(k => el('span', { className: 'pf-key' }, el('i', { className: `pf-dot st-${k}` }), STAGE[k]))))
        lanes.forEach((a, i) => { const y = 20 + i * RH; sv('line', { x1: LW - 8, x2: W - 10, y1: y, y2: y, class: 'pf-lane' }, svg); const t = sv('text', { x: LW - 14, y: y + 4, 'text-anchor': 'end', class: 'pf-lab' }, svg); t.textContent = role(a) })
        const pos = steps.map((s, i) => ({ x: LW + i * CW + CW / 2, y: 20 + lanes.indexOf(s.a) * RH }))
        const edges = [], nodes = []
        steps.forEach((s, i) => {
            if (i) { const a = pos[i - 1], b = pos[i], hand = steps[i - 1].a !== s.a; edges.push(sv('path', { d: `M${a.x} ${a.y}C${a.x + CW / 2} ${a.y} ${b.x - CW / 2} ${b.y} ${b.x} ${b.y}`, class: hand ? 'pf-hand' : 'pf-same' }, svg)) }
        })
        steps.forEach((s, i) => {
            const g = sv('g', { class: 'pf-step', tabindex: 0, role: 'button', 'aria-label': `${role(s.a)}, ${STAGE[s.st]}, ${when(s.t)}` }, svg), c = sv('circle', { cx: pos[i].x, cy: pos[i].y, r: 8, class: `pf-node st-${s.st}` }, g)
            const tt = sv('title', {}, g); tt.textContent = `${when(s.t)} · ${role(s.a)} · ${STAGE[s.st]} · ${s.s}`
            const show = () => { nodes.forEach(n => n.classList.remove('on')); g.classList.add('on'); detail(s) }
            g.addEventListener('click', show); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show() } })
            nodes.push(g)
        })
        const detail = s => {
            info.replaceChildren(el('p', { className: 'pf-h', textContent: `${role(s.a)} · ${STAGE[s.st]} · ${when(s.t)} Lisbon` }), el('p', { className: 'pf-s', textContent: s.s }),
                el('p', { className: 'pf-m', textContent: [`${s.n} file${s.n === 1 ? '' : 's'} of this piece`, s.brief && `Brief ${s.brief}`, s.unit && `Unit ${s.unit}`, s.forr && `For ${s.forr}`].filter(Boolean).join(' · ') }),
                s.st === 'voice' ? el('p', { className: 'pf-m', textContent: 'The root of the trail: the moment is read from the brief id.' }) : el('a', { href: `${repo}/commit/${s.sha}`, target: '_blank', rel: 'noopener', textContent: `The commit ${s.sha} on GitHub` }))
        }
        const hands = steps.filter((s, i) => i && steps[i - 1].a !== s.a).length
        host.append(el('p', { className: 'pf-sum', textContent: `${steps.length} steps, ${lanes.length} actor${lanes.length === 1 ? '' : 's'}, ${hands} hand-off${hands === 1 ? '' : 's'}, from ${when(steps[0].t)} to ${when(steps[steps.length - 1].t)} (Lisbon time). Tap a step for its commit.` }), bar, wrap, info)
        replay.addEventListener('click', () => {
            const all = [...edges, ...nodes]; all.forEach(n => { n.style.opacity = 0 })
            steps.forEach((s, i) => setTimeout(() => { nodes[i].style.opacity = 1; if (edges[i - 1]) edges[i - 1].style.opacity = 1; if (i === steps.length - 1) all.forEach(n => (n.style.opacity = '')) }, 350 * i))
        })
        detail(steps[steps.length - 1])
    }

    async function mount(host) {
        let D
        try { const r = await fetch(host.dataset.data); if (!r.ok) throw new Error(r.status); D = await r.json() } catch { host.textContent = 'The workflow could not be loaded.'; return }
        const flows = D.flows
        if (host.dataset.piece) {
            const f = flows.find(x => x.id === host.dataset.piece)
            if (!f) { host.closest('.pf-wrap')?.remove(); return }
            draw(host, f, D.repo); return
        }
        const sorted = [...flows].sort((a, b) => b.steps[b.steps.length - 1].t.localeCompare(a.steps[a.steps.length - 1].t))
        const sel = el('select', { className: 'pf-sel', ariaLabel: 'Choose a piece' }, ...sorted.map(f => el('option', { value: f.id, textContent: `${f.kind === 'interview' ? 'Interview: ' : f.kind === 'brief' ? 'Brief: ' : ''}${f.title} (${f.steps.length})` })))
        const view = el('div', { className: 'pf-view' }), feed = el('ul', { className: 'pf-feed' })
        const recent = flows.flatMap(f => f.steps.map(s => ({ f, s }))).sort((a, b) => b.s.t.localeCompare(a.s.t)).slice(0, 14)
        feed.append(...recent.map(({ f, s }) => el('li', {}, el('button', { type: 'button', className: 'pf-row', onclick: () => { sel.value = f.id; draw(view, f, D.repo); view.scrollIntoView({ block: 'nearest' }) }, textContent: `${when(s.t)} · ${role(s.a)} · ${STAGE[s.st]} · ${f.title}` }))))
        host.append(el('label', { className: 'pf-pick' }, 'Piece ', sel), view, el('h2', { textContent: 'The latest steps, across the newsroom' }), feed)
        sel.addEventListener('change', () => draw(view, flows.find(x => x.id === sel.value), D.repo)); draw(view, sorted[0], D.repo)
    }
    document.querySelectorAll('.pf').forEach(mount)
})()
