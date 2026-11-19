// The sites bar and its registry (Dinis, 18 November 2026, about 22:00 UTC; board/guidance/2026-11-18-the-sites-bar.md).
//   api/v1/sites.json   the registry of every *.promptugal.news site (assets/sites/sites.json), with the bar's files and
//                       their sha256, for each site to vendor and pin
//   version.json        this site's version and build time, which the bar reads on every site
//   preview.svg         this site's own preview: an infographic of its numbers, provenance and licence inside
//   sites/index.html    the list of sites and the preview spec
// The bar itself (assets/sites-bar/<version>/) goes on every page that is not bare. dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { ledger } from './payments.mjs'
export const order = 992
export const BAR = '1.1.1'
const ROOT = new URL('../../../', import.meta.url)
const R = p => readFileSync(new URL(p, ROOT))
// pins in SRI form (sha256-<base64>): what browsers use, and no long hex run for the sites' leak scans (1.1.1)
const sha = p => 'sha256-' + createHash('sha256').update(R(p)).digest('base64')
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const JS = `assets/sites-bar/${BAR}/sites-bar.js`, CSS = `assets/sites-bar/${BAR}/sites-bar.css`, RENDER = `assets/sites-bar/${BAR}/sites-bar-render.mjs`
const { render } = await import(`../../../${RENDER}`)

// the bar rendered here at build from the registry (the spec: each site renders it at build time), first in <body>
let HTML = null
export function decorate(p) {
    if (p.bare || p.raw || p.sitesBar || !p.md) return
    p.sitesBar = true
    if (HTML === null) HTML = render(registry(), { here: 'promptugal.news', newTab: true })
    if (!HTML) return
    p.top = HTML
    p.assets = { ...(p.assets || {}), css: [...((p.assets && p.assets.css) || []), CSS], js: [...((p.assets && p.assets.js) || []), JS] }
}
const reg = () => JSON.parse(R('assets/sites/sites.json'))
// the registry as served: each site's version_url and preview (promptugal.news's under api/v1/ until the root paths are in .gitignore)
const registry = () => ({ sites: reg().sites.map(s => s.id === 'news' ? { ...s, version_url: `${s.url}api/v1/version.json`, preview: `${s.url}api/v1/preview.svg` }
    : { ...s, version_url: `${s.url}version.json`, preview: `${s.url}preview.svg` }) })

export function pages(ctx) {
    const S = reg()
    const md = [S.summary, S.page.table + '\n|---|---|\n' + S.sites.map(s => `| [${s.name}](${s.url}) | ${s.line} |`).join('\n'),
        `## ${S.page.bar_heading} {#bar}`, S.page.bar.replace('{bar}', BAR),
        `## ${S.page.preview_heading} {#preview}`, S.preview_spec.map(l => `- ${l}`).join('\n')].join('\n\n')
    return [{ rel: 'sites/index.html', src: 'assets/sites/sites.json', type: 'site', title: S.title, summary: S.summary, md }]
}

export function api(ctx) {
    const S = reg()
    return [{ path: 'api/v1/sites.json', schema: null, data: {
        about: S.about, version: ctx.VERSION, sites: registry().sites,
        bar: { version: BAR, js: `https://promptugal.news/${JS}`, css: `https://promptugal.news/${CSS}`, integrity: { js: sha(JS), css: sha(CSS), render: sha(RENDER) }, render: `https://promptugal.news/${RENDER}`, spec: 'https://github.com/promptugal/promptugal__news__website/blob/dev/board/spec-the-sites-bar.md',
            install: S.bar_install },
        preview_spec: S.preview_spec } }, ...previewFiles(ctx)]
}

const TPL = () => R('design/sites-bar/preview-template.svg.txt').toString()
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const stamp = d => `${d.getUTCDate()} ${MON[d.getUTCMonth()]}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
const num = n => /^[0-9][0-9.,%]{0,8}$/.test(String(n)) ? String(n) : '–'
function previewFiles(ctx) {
    const built = new Date(), S = reg(), P = S.preview
    const arts = ctx.pages.filter(p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html' && !p.withdrawn).length
    let pl = []; try { pl = JSON.parse(R('data/by-place/places.json')).places } catch { }
    const fill = { site: 'PrompTugal.news', line: P.line, accent: '#006600', SITE: P.site, n1: num(arts), label1: P.labels[0], n2: num(pl.length), label2: P.labels[1],
        n3: num(pl.filter(p => p.parent === 'algarve').length), label3: P.labels[2], read_at: stamp(built), licence: P.licence }
    // the designer's template, every value XML-escaped; provenance in a <desc>
    const svg = TPL().replace(/\{\{(\w+)\}\}/g, (m, k) => x(fill[k] ?? '')).replace(/(<svg[^>]*>)/, `$1\n  <desc>${x(P.desc)}</desc>`)
    return [
        // under api/v1/ until the root /version.json and /preview.svg are in .gitignore (outside dev@'s grant: asked)
        { path: 'api/v1/version.json', schema: null, data: { version: ctx.VERSION, built: built.toISOString(), site: 'https://promptugal.news/' } },
        { path: 'api/v1/preview.svg', schema: null, data: svg },
    ]
}

// the bar's pinned hashes match its files, and the registry links only to promptugal.news sites
export function validate(gate) {
    let d; try { d = gate.json('api/v1/sites.json') } catch { return ['api/v1/sites.json is missing'] }
    const p = []
    if (d.bar.integrity.js !== sha(JS) || d.bar.integrity.css !== sha(CSS) || d.bar.integrity.render !== sha(RENDER)) p.push('the sites bar\'s published integrity does not match its files')
    if (!render(d, { here: 'promptugal.news' })) p.push('sites.json: the bar\'s renderer refuses the registry (an entry fails its checks)')
    // our own preview (the spec's Safety 5): no script, no foreignObject, no event attribute, no outside reference
    let svg = ''; try { svg = gate.text('api/v1/preview.svg') } catch { p.push('api/v1/preview.svg is missing') }
    if (/<script|<foreignObject|\son\w+\s*=|(href|src)\s*=\s*["'](?!#)/i.test(svg)) p.push('api/v1/preview.svg has a script, a foreignObject, an event attribute or an outside reference')
    return p
}
