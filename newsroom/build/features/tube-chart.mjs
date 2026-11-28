// The Tube strikes chart (a strike's mark: outlined before it starts, solid while it runs, faded once it has ended; the sentence that says where the strikes stand is made from the date, its words in strikes.json)
// The Tube strikes chart (cl-6.designer's SVG, 26 Nov 2026), made at each build from assets/article/tube-strikes-2026/strikes.json: a strike's mark is filled
// once its start has passed (London time), outlined before. The template is chart.tmpl beside it; the result is api/v1/charts/tube-strikes-2026.svg
// (the light and dark PNGs are static, in assets/article/). cl-6.dev@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
export const order = 62

const london = d => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/London', dateStyle: 'short', timeStyle: 'medium' }).format(d).replace(' ', 'T')   // 2026-11-26T12:00:00

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// "17 to 18 Dec", or "31 Dec to 1 Jan" across a month's end, from a strike's own start and end (London time, as written)
const dates = s => { const [a, b] = [s.start, s.end].map(v => ({ d: +v.slice(8, 10), m: MON[+v.slice(5, 7) - 1] })); return a.m === b.m ? `${a.d} to ${b.d} ${a.m}` : `${a.d} ${a.m} to ${b.d} ${b.m}` }
const fill = (w, v) => String(w).replace(/\{(\w+)\}/g, (m, k) => v[k] ?? '')

// the sentence that says where the strikes stand, from the date: it cannot go stale (cl-6.conductor, 28 Nov: "The first is under way." was still live after it ended)
export function stateLine(strikes, words, now) {
    const t = london(now), done = strikes.filter(s => s.end < t), on = strikes.find(s => s.start <= t && t <= s.end), next = strikes.find(s => s.start > t)
    const v = { first: dates(strikes[0]), next: next ? dates(next) : '', done: done.length, all: strikes.length }
    if (on) return on === strikes[0] ? words.under_way : fill(words.other_under_way, { ...v, n: on.n, dates: dates(on), next: v.next || 'none announced' })
    if (!done.length) return fill(words.before, v)
    if (!next) return fill(words.all_ended, v)
    return fill(done.length === 1 ? words.first_ended : words.some_ended, v)
}

// every word put into the SVG is escaped (cl-6.security, 28 Nov): the words are repo-held today, so this keeps it so if they ever are not
const xml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function chart(tmpl, strikes, now, words, byLine) {
    const t = london(now); let i = 0
    const ended = strikes[0].end < t, B = (ended ? byLine.after : byLine.before), vals = { state: stateLine(strikes, words, now), by_head: B.head, by_note: B.note, desc_first: B.desc }
    B.rows.forEach((r, k) => { vals[`r${k + 1}t`] = r[0]; vals[`r${k + 1}n`] = r[1] })
    return tmpl.replace(/\{\{(\w+)\}\}/g, (m, k) => xml(vals[k] ?? '')).replace(/<rect class="(?:fl|ol|pa)"( x="[\d.]+" y="[\d.]+" width="8\.0" height="18")\/>/g, (m, rest) => {
        const s = strikes[i++]
        return `<rect class="${!s || s.start > t ? 'ol' : s.end < t ? 'pa' : 'fl'}"${rest}/>`
    })
}

export function api(ctx) {
    const dir = path.join(ctx.ROOT, 'assets/article/tube-strikes-2026')
    const data = JSON.parse(fs.readFileSync(path.join(dir, 'strikes.json'), 'utf8')), strikes = data.strikes
    return [{ path: 'api/v1/charts/tube-strikes-2026.svg', schema: null, data: chart(fs.readFileSync(path.join(dir, 'chart.tmpl'), 'utf8'), strikes, new Date(), data.words, data.by_line) }]
}
