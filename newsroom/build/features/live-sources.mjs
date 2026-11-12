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

// a line for a while (correspondent@, 12 November: the Fringe's last evening): shown until its time, with the usual line kept
// in data-line so sources.js puts it back in the reader's browser once the time has passed, even with no new build
const lineOf = s => { const f = s.line_for; if (!f || !(Date.now() < Date.parse(f.until))) return { line: esc(s.line), until: '' }
    return { line: esc(f.line), until: ` data-until="${esc(f.until)}" data-line="${esc(s.line)}"` } }
function strip(rel) {
    let d; try { d = JSON.parse(fs.readFileSync(R('assets/sources/sources.json'), 'utf8')) } catch { return '' }
    const on = (d.sources || []).filter(s => s.live && /^https:\/\//.test(s.url)); if (!on.length) return ''
    return put(part('strip'), { '#items': on.map(s => put(item('source'), { tone: esc(s.tone), url: esc(s.url), kicker: esc(s.kicker), name: esc(s.name), ...lineOf(s),
        host: esc(new URL(s.url).host), updated: s.updated ? ` data-updated="${esc(s.updated)}"` : '' })
        // our own page for the source, from every page but itself (the home page always links the storm page, whatever leads)
        + (s.here && s.here !== rel ? put(item('here'), { href: esc(s.here), name: esc(s.here_name) }) : '')).join('') })
}
export function decorate(p) {
    if (!PAGES.includes(p.rel)) return
    const s = strip(p.rel); if (!s) return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/sources/sources.css'], js: [...(p.assets?.js || []), 'assets/sources/sources.js'] }
    p.before = s + (p.before || '')
}
