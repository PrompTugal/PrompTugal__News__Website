// The newsroom section's pictures: plain-text pictures (64 columns at most, so they fit a phone, like the first
// article's) and SVG charts drawn at build (no script needed; a <title> on every mark is its tooltip). Templates
// only: the data comes from newsroom-model.mjs. Not a feature by itself (it exports no hook); features/newsroom.mjs uses it.
import { esc } from '../lib/markdown.mjs'

export const W = 64
const D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const ms = t => Date.parse(t)
export const hm = t => new Date(t).toISOString().slice(11, 16)
export const dayOf = t => new Date(t).toISOString().slice(0, 10)
export const dayLabel = t => { const d = new Date(String(t).length === 10 ? t + 'T12:00:00Z' : t); return `${D[d.getUTCDay()]} ${d.getUTCDate()} ${M[d.getUTCMonth()]}` }
export const when = t => `${dayLabel(t)} ${hm(t)}`
export const short = name => name ? name.replace('@web-summit.', '@') : 'CI'
const fit = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + '~' : s }
const pad = (s, n) => fit(s, n).padEnd(n)
const lpad = (s, n) => fit(s, n).padStart(n)

// ---------- plain-text pictures ----------

// a box of labelled progress bars: [{ part, of10, note }]
export function glanceBox(title, rows) {
    const lw = Math.max(...rows.map(r => r.part.length)) + 4, edge = '+' + '-'.repeat(W - 2) + '+'
    const line = s => '| ' + pad(s, W - 4) + ' |'
    return [edge, line(title), edge, ...rows.map(r => {
        const n = Math.max(0, Math.min(10, r.of10))
        return line(`${(r.part + ' ').padEnd(lw - 1, '.')} [${'#'.repeat(n)}${'.'.repeat(10 - n)}] ${r.note}`)
    }), edge].join('\n')
}

// a table in columns: cols [{ head, width, right }], rows [[...]]
export function textTable(cols, rows) {
    const cell = (c, v) => c.right ? lpad(v, c.width) : pad(v, c.width)
    const out = [cols.map(c => cell(c, c.head)).join('  ').trimEnd(), cols.map(c => '-'.repeat(c.width)).join('  ')]
    for (const r of rows) out.push(cols.map((c, i) => cell(c, r[i] ?? '')).join('  ').trimEnd())
    return out.join('\n')
}

// horizontal bars in text: [[label, n, note?]]
export function textBars(rows, { width = 30, labelWidth } = {}) {
    const lw = labelWidth || Math.min(16, Math.max(...rows.map(r => String(r[0]).length)))
    const max = Math.max(1, ...rows.map(r => r[1]))
    return rows.map(([l, n, note]) => `${pad(l, lw)}  ${'#'.repeat(Math.round(n / max * width)).padEnd(width)}  ${lpad(n, 4)}${note ? '  ' + note : ''}`.slice(0, W).trimEnd()).join('\n')
}

// the desks' pipeline, after the first article's picture: three pairs of boxes joined by arrows, then the desks
// beside the line. stages: { research, curate, write, check, publish, site } each { name, state, last }
export function pipelinePicture(groups, beside) {
    const b = s => pad(s, 16)
    const pair = (L, R) => [
        '+------------------+      +------------------+',
        `| ${b(L.name)} | ---> | ${b(R.name)} |`,
        `| ${b(L.state)} |      | ${b(R.state)} |`,
        `| ${b(L.last)} |      | ${b(R.last)} |`,
        '+------------------+      +------------------+',
    ]
    const join = ['                                   |', null, '         +-------------------------+', '         v']
    const out = []
    groups.forEach((g, i) => {
        if (i) { out.push(join[0]); out.push(pad(g.head, 35) + '|'); out.push(join[2], join[3]) } else out.push(g.head)
        out.push(...pair(g.left, g.right))
    })
    out.push('', 'BESIDE THE LINE', ...beside.map(x => fit(x, W)))
    return out.join('\n')
}

// a chain of boxes, top to bottom, with a note to the right of each: [{ text: [..lines], note: [..lines] }]
export function chainPicture(items) {
    const out = []
    items.forEach((it, i) => {
        if (i) out.push('               |', '               v')
        const lines = it.text, notes = it.note || []
        out.push('+-----------------------------+')
        lines.forEach((l, j) => out.push(`| ${pad(l, 27)} |${notes[j] ? '   ' + fit(notes[j], W - 34) : ''}`))
        out.push('+--------------+--------------+'.replace(/\+--------------\+--------------\+/, i < items.length - 1 ? '+--------------+--------------+' : '+-----------------------------+'))
    })
    return out.join('\n')
}

// ---------- SVG ----------

export function figure({ svg, caption, minWidth = 0, label }) {
    return `<figure class="adm-fig"${label ? ` aria-label="${esc(label)}"` : ''}><div class="adm-scroll"${minWidth ? ` style="--min:${minWidth}px"` : ''}>${svg}</div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}
const svgOpen = (w, h, title) => `<svg class="adm-svg" viewBox="0 0 ${w} ${h}" style="max-width:${w}px" role="img" aria-label="${esc(title)}" preserveAspectRatio="xMinYMin meet"><title>${esc(title)}</title>`

// horizontal bars: rows [{ label, value, href, title }]; one series, so no legend: the title names it
export function hbars(rows, { title, unit = '', labelW = 170, w = 720, max } = {}) {
    const bh = 18, gap = 8, top = 6, h = top + rows.length * (bh + gap) + 4
    const m = max || Math.max(1, ...rows.map(r => r.value)), area = w - labelW - 70
    const body = rows.map((r, i) => {
        const y = top + i * (bh + gap), bw = Math.max(2, r.value / m * area)
        const lab = `<text class="lab" x="${labelW - 10}" y="${y + bh * .72}" text-anchor="end">${esc(fit(r.label, 26))}</text>`
        const bar = `<rect class="bar" x="${labelW}" y="${y}" width="${bw.toFixed(1)}" height="${bh}" rx="3"><title>${esc(r.title || `${r.label}: ${r.value}${unit}`)}</title></rect>`
        const val = `<text class="val" x="${(labelW + bw + 6).toFixed(1)}" y="${y + bh * .72}">${r.value.toLocaleString('en-GB')}${unit}</text>`
        return r.href ? `<a href="${esc(r.href)}">${lab}</a>${bar}${val}` : lab + bar + val
    }).join('')
    return svgOpen(w, h, title) + `<line class="ax" x1="${labelW}" y1="0" x2="${labelW}" y2="${h}"/>` + body + '</svg>'
}

export const KINDS = [['conductor', 'Conductor'], ['desk', 'Desk'], ['builder', 'Builder'], ['ci', 'CI release']]
export const legend = (kinds = KINDS) => `<span class="adm-legend">${kinds.map(([k, l]) => `<span><i class="sw k-${k}"></i>${l}</span>`).join('')}</span>`

// runs per hour, stacked by the kind of agent: events [{ t, kind, title }]
export function hourBars(events, { title, w = 1000, h = 220 } = {}) {
    if (!events.length) return ''
    const t0 = Math.floor(Math.min(...events.map(e => ms(e.t))) / 36e5) * 36e5, t1 = Math.ceil((Math.max(...events.map(e => ms(e.t))) + 1) / 36e5) * 36e5
    const hours = Math.max(1, (t1 - t0) / 36e5), L = 34, B = 34, area = w - L - 8, bw = area / hours
    const buckets = Array.from({ length: hours }, () => ({}))
    for (const e of events) { const i = Math.min(hours - 1, Math.floor((ms(e.t) - t0) / 36e5)); (buckets[i][e.kind] ??= []).push(e) }
    const max = Math.max(1, ...buckets.map(b => Object.values(b).reduce((n, l) => n + l.length, 0))), unit = (h - B - 10) / max
    let out = svgOpen(w, h, title)
    for (let v = 0; v <= max; v += Math.max(1, Math.ceil(max / 4))) { const y = h - B - v * unit; out += `<line class="grid" x1="${L}" y1="${y}" x2="${w - 4}" y2="${y}"/><text class="tick" x="${L - 6}" y="${y + 4}" text-anchor="end">${v}</text>` }
    buckets.forEach((b, i) => {
        let y = h - B
        const x = L + i * bw + 1
        for (const [k] of KINDS) {
            const l = b[k]; if (!l) continue
            const hh = l.length * unit
            out += `<rect class="k-${k}" x="${x.toFixed(1)}" y="${(y - hh + 1).toFixed(1)}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${Math.max(1, hh - 2).toFixed(1)}" rx="2"><title>${esc(`${hm(new Date(t0 + i * 36e5))} to ${hm(new Date(t0 + (i + 1) * 36e5))}: ${l.length} ${k === 'ci' ? 'release' : k} run${l.length > 1 ? 's' : ''}: ${l.map(e => e.title).join('; ')}`)}</title></rect>`
            y -= hh
        }
        const at = new Date(t0 + i * 36e5)
        if (at.getUTCHours() % 3 === 0) out += `<text class="tick" x="${x}" y="${h - B + 14}">${hm(at).slice(0, 2)}h</text>`
        if (at.getUTCHours() === 0 || i === 0) out += `<text class="tick strong" x="${x}" y="${h - B + 28}">${dayLabel(at)}</text>`
    })
    return out + `<line class="ax" x1="${L}" y1="${h - B}" x2="${w - 4}" y2="${h - B}"/></svg>`
}

// swim lanes: lanes [{ label, sub, kind, href, events: [{ t, type: commit|merge|desk|release|start, title, href }],
// span: [t0, t1] | null, running }], over [from, to]; one lane per agent, time left to right
export function swimlanes(lanes, { from, to, title, w = 1000, nowLabel } = {}) {
    const L = 190, R = 78, top = 30, lh = 34, h = top + lanes.length * lh + 26, area = w - L - R
    const x = t => L + (ms(t) - from) / Math.max(1, to - from) * area
    const span = to - from, step = [5, 10, 15, 30, 60, 120, 180, 360].map(m => m * 6e4).find(s => span / s <= 9) || 7.2e6
    let out = svgOpen(w, h, title)
    for (let t = Math.ceil(from / step) * step; t <= to; t += step) {
        const xx = x(new Date(t)).toFixed(1)
        out += `<line class="grid" x1="${xx}" y1="${top - 8}" x2="${xx}" y2="${h - 22}"/><text class="tick" x="${xx}" y="${top - 14}" text-anchor="middle">${hm(new Date(t))}</text>`
    }
    lanes.forEach((ln, i) => {
        const y = top + i * lh + lh / 2
        out += `<line class="lane" x1="${L}" y1="${y}" x2="${w - R + 8}" y2="${y}"/>`
        const label = `<text class="lab" x="${L - 10}" y="${y - 2}" text-anchor="end">${esc(fit(ln.label, 24))}</text><text class="sub" x="${L - 10}" y="${y + 11}" text-anchor="end">${esc(fit(ln.sub || '', 28))}</text>`
        out += ln.href ? `<a href="${esc(ln.href)}">${label}</a>` : label
        if (ln.span) {
            const a = Math.max(L, x(ln.span[0])), b = Math.min(w - R + 8, ln.running ? w - R + 8 : x(ln.span[1]))
            out += `<rect class="span k-${ln.kind}${ln.running ? ' running' : ''}" x="${a.toFixed(1)}" y="${y - 5}" width="${Math.max(2, b - a).toFixed(1)}" height="10" rx="5"><title>${esc(`${ln.label}: ${when(ln.span[0])}${ln.running ? ', still running' : ` to ${hm(ln.span[1])}`}`)}</title></rect>`
            if (ln.running) out += `<text class="sub" x="${(w - R + 14).toFixed(1)}" y="${y + 4}">${esc(nowLabel || 'running')}</text>`
        }
        for (const e of ln.events) {
            const xx = x(e.t).toFixed(1), t = `<title>${esc(`${when(e.t)} ${e.title}`)}</title>`
            const mark = e.type === 'release' ? `<path class="mk k-ci" d="M${xx} ${y - 7}l7 7-7 7-7-7z">${t}</path>`
                : e.type === 'desk' ? `<rect class="mk k-${ln.kind}" x="${+xx - 6}" y="${y - 6}" width="12" height="12" rx="1">${t}</rect>`
                    : e.type === 'start' ? `<circle class="mk start" cx="${xx}" cy="${y}" r="6">${t}</circle>`
                        : `<circle class="mk k-${ln.kind}${e.type === 'merge' ? ' merge' : ''}" cx="${xx}" cy="${y}" r="6">${t}</circle>`
            out += e.href ? `<a href="${esc(e.href)}">${mark}</a>` : mark
        }
    })
    return out + '</svg>'
}
export const markLegend = () => `<span class="adm-legend"><span><svg viewBox="0 0 14 14" class="key"><circle class="mk k-builder" cx="7" cy="7" r="5"/></svg>a commit here</span><span><svg viewBox="0 0 14 14" class="key"><rect class="mk k-desk" x="2" y="2" width="10" height="10" rx="1"/></svg>a run reported on the team's site</span><span><svg viewBox="0 0 14 14" class="key"><path class="mk k-ci" d="M7 1l6 6-6 6-6-6z"/></svg>a release by CI</span><span><svg viewBox="0 0 14 14" class="key"><circle class="mk start" cx="7" cy="7" r="5"/></svg>fired up</span><span><svg viewBox="0 0 22 14" class="key wide"><rect class="span k-builder" x="1" y="4" width="20" height="6" rx="3"/></svg>at work (first to last)</span></span>`

// a run schedule as ticks on a 24-hour strip, one row per phase: phases [{ label, times }]
export function scheduleStrip(phases, { title, w = 760 } = {}) {
    const L = 10, top = 22, rh = 40, h = top + phases.length * rh + 24, area = w - 2 * L
    const x = hh => L + hh / 24 * area
    let out = svgOpen(w, h, title)
    for (let hh = 0; hh <= 24; hh += 3) out += `<line class="grid" x1="${x(hh)}" y1="${top - 4}" x2="${x(hh)}" y2="${h - 20}"/><text class="tick" x="${x(hh)}" y="${h - 6}" text-anchor="${hh === 0 ? 'start' : hh === 24 ? 'end' : 'middle'}">${String(hh % 24).padStart(2, '0')}:00</text>`
    phases.forEach((p, i) => {
        const y = top + i * rh
        out += `<text class="lab" x="${L}" y="${y + 6}">${esc(p.label)}</text>`
        for (const t of p.times) { const [a, b] = t.split(':').map(Number), xx = x(a + b / 60); out += `<rect class="bar" x="${(xx - 3).toFixed(1)}" y="${y + 12}" width="6" height="16" rx="2"><title>${esc(`${p.label}: a run at ${t} UTC`)}</title></rect>` }
    })
    return out + '</svg>'
}
