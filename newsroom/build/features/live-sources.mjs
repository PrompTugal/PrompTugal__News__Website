// The live sources strip (Dinis, 11 November 10:00 UTC: "a clear, visible link to the storm site at the top, named as
// the live source; Lisbon Fringe beside it once live"; designer@'s board/spec-the-live-sources-strip.md, L1 to L6): the
// first thing under the masthead on the home page and on /storm/charles/. Sources from assets/sources/sources.json (a
// source with live: false is left out); markup assets/sources/; the storm site's updated time is read in the browser.
import fs from 'node:fs'
export const order = 25
const R = f => new URL(`../../../${f}`, import.meta.url)
const T = fs.readFileSync(R('assets/sources/sources.tmpl'), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const PAGES = ['index.html', 'storm/charles/index.html']

function strip() {
    let d; try { d = JSON.parse(fs.readFileSync(R('assets/sources/sources.json'), 'utf8')) } catch { return '' }
    const on = (d.sources || []).filter(s => s.live && /^https:\/\//.test(s.url)); if (!on.length) return ''
    return put(part('strip'), { '#items': on.map(s => put(item('source'), { tone: esc(s.tone), url: esc(s.url), kicker: esc(s.kicker), name: esc(s.name), line: esc(s.line),
        host: esc(new URL(s.url).host), updated: s.updated ? ` data-updated="${esc(s.updated)}"` : '' })).join('') })
}
export function decorate(p) {
    if (!PAGES.includes(p.rel)) return
    const s = strip(); if (!s) return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/sources/sources.css'], js: [...(p.assets?.js || []), 'assets/sources/sources.js'] }
    p.before = s + (p.before || '')
}
