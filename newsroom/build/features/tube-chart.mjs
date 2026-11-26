// The Tube strikes chart (cl-6.designer's SVG, 26 Nov 2026), made at each build from assets/article/tube-strikes-2026/strikes.json: a strike's mark is filled
// once its start has passed (London time), outlined before. The template is chart.tmpl beside it; the result is api/v1/charts/tube-strikes-2026.svg
// (the light and dark PNGs are static, in assets/article/). cl-6.dev@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
export const order = 62

const london = d => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/London', dateStyle: 'short', timeStyle: 'medium' }).format(d).replace(' ', 'T')   // 2026-11-26T12:00:00

export function chart(tmpl, strikes, now) {
    const t = london(now); let i = 0
    return tmpl.replace(/<rect class="(?:fl|ol)"( x="[\d.]+" y="[\d.]+" width="8\.0" height="18")\/>/g, (m, rest) => {
        const s = strikes[i++]
        return `<rect class="${s && s.start <= t ? 'fl' : 'ol'}"${rest}/>`
    })
}

export function api(ctx) {
    const dir = path.join(ctx.ROOT, 'assets/article/tube-strikes-2026')
    const strikes = JSON.parse(fs.readFileSync(path.join(dir, 'strikes.json'), 'utf8')).strikes
    return [{ path: 'api/v1/charts/tube-strikes-2026.svg', schema: null, data: chart(fs.readFileSync(path.join(dir, 'chart.tmpl'), 'utf8'), strikes, new Date()) }]
}
