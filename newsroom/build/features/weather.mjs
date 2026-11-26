// The free weather page (/weather/; content/weather/index.md, free: true, so no meter loads) and the camera links on the town pages (Dinis, 26 Nov 2026:
// IPMA values may show on a page that carries no charge, with its credit and the line "This page is free"; a credited link to APL's and AEMTG's own pages
// is allowed, MEO and Skyline are not). From assets/weather/snapshot.json (newsroom/tools/sync-weather.mjs), which the deploy leaves out. A feed read more
// than 48 hours before the build is not shown. The words are in assets/weather/weather.json. cl-6.dev@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
import { cell } from '../lib/markdown.mjs'
export const order = 62

export const snap = ctx => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'assets/weather/snapshot.json'), 'utf8')) } catch { return null } }
export const words = ctx => JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'assets/weather/weather.json'), 'utf8'))
const fill = (t, o) => Object.entries(o).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), t)
export const fresh = (read_at, W, now = new Date()) => { const t = Date.parse(read_at || ''); return Number.isFinite(t) && (now - t) / 36e5 < W.stale_hours }
const feed = (S, k, W, f) => !S || !S[k] ? W.missing : fresh(S[k].read_at, W) ? f(S[k]) : fill(W.stale, { read: S[k].read_at.slice(0, 10), hours: W.stale_hours })

const fillers = {
    'weather:status': (page, ctx) => { const S = snap(ctx), W = words(ctx); return S ? fill(W.status, { read: S.read.slice(0, 10), hours: W.stale_hours }) : W.missing },
    'weather:warnings': (page, ctx) => { const S = snap(ctx), W = words(ctx); return feed(S, 'warnings', W, f => {
        const by = l => f.active.filter(x => x.level === l).map(x => `- ${cell(fill(W.warning, { area: x.area_name, type: x.type, from: x.start.replace('T', ' '), to: x.end.replace('T', ' '), text: x.text }))}`)
        const parts = ['red', 'orange', 'yellow'].flatMap(l => by(l).length ? [`### ${W.levels[l]}\n\n${by(l).join('\n')}`] : [])
        return parts.length ? parts.join('\n\n') : W.none }) },
    'weather:sea': (page, ctx) => { const S = snap(ctx), W = words(ctx); return feed(S, 'sea', W, f => `${W.sea_head}\n|---|---|---|---|\n` + f.coasts.map(c => `| ${cell(c.name)} | ${c.waves_min_m ?? ''} to ${c.waves_max_m ?? ''} | ${cell(c.wave_dir)} | ${c.sea_temp_min_c ?? ''} to ${c.sea_temp_max_c ?? ''} |`).join('\n')) },
    'weather:fire': (page, ctx) => { const S = snap(ctx), W = words(ctx); return feed(S, 'fire', W, f => Object.entries(f.today).map(([l, n]) => `- ${cell(fill(W.fire_line, { level: l, n, total: f.municipalities ?? '' }))}`).join('\n')) },
}
export { fillers as fill }

// the camera links for one town, for its "Now in" block: cleared operators only, only when the camera feed was read in the last 48 hours
export function camLines(ctx, placeId, now = new Date()) {
    const S = snap(ctx), W = words(ctx); if (!S || !S.cams || !fresh(S.cams.read_at, W, now)) return []
    return S.cams.items.filter(c => c.place === placeId).map(c => fill(W.cam, { name: cell(c.name), page: c.page, credit: cell(c.credit), read: S.cams.read_at.slice(0, 10) }))
}
