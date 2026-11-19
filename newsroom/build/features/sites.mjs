// The sites bar and its registry (Dinis, 18 November 2026, about 22:00 UTC; board/guidance/2026-11-18-the-sites-bar.md).
//   api/v1/sites.json   the registry of every *.promptugal.news site (assets/sites/sites.json), with the bar's files and
//                       their sha256, for each site to vendor and pin
//   version.json        this site's version and build time, which the bar reads on every site
//   preview.svg         this site's own preview: an infographic of its numbers, provenance and licence inside
//   sites/index.html    the list of sites and the preview spec
// The bar itself (assets/sites-bar/<version>/) goes on every page that is not bare. dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { ledger } from './payments.mjs'
export const order = 992
export const BAR = '1.2.1'
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
    if (HTML === null) HTML = render(registry(), { here: 'promptugal.news' })   // the sister sites open in the same tab (Dinis, 19 Nov 03:18)
    if (!HTML) return
    p.top = HTML
    p.assets = { ...(p.assets || {}), css: [...((p.assets && p.assets.css) || []), CSS], js: [...((p.assets && p.assets.js) || []), JS] }
}
const reg = () => JSON.parse(R('assets/sites/sites.json'))
// every version's pin, append-only (assets/sites/pins.json; security@, 19 Nov): a site checks its own version's pin
const PINS = () => JSON.parse(R('assets/sites/pins.json'))
// the shared map's current version and its files' sha384 (the SRI designer@ published in its manifest)
const MAPV = '1.0.0', MAPDIR = `design/shared-map/v${MAPV}`
const sha384 = p => 'sha384-' + createHash('sha384').update(R(p)).digest('base64')
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
            install: S.bar_install,
            // each version's pins under .integrity.<file> (the key every site's leak scan exempts: security@, 19 Nov); the bare js, css and render keys stay until the sites move
            versions: Object.fromEntries(Object.entries(PINS().bar).map(([v, x]) => [v, { integrity: { ...x }, ...x }])) },
        preview_spec: S.preview_spec,
        // the one time-zone-to-country table for every site's page views (Dinis, 19 Nov 03:15: no IP lookup)
        obs_tz: { file: 'https://promptugal.news/assets/obs/tz-country.json', integrity: sha('assets/obs/tz-country.json'), version: JSON.parse(R('assets/obs/tz-country.json')).version, zones: Object.keys(JSON.parse(R('assets/obs/tz-country.json')).zones).length, install: S.obs_tz_install,
            // the same shape as bar.versions: versions[v].integrity.<file>; the bare sha256 kept until the sites move
            versions: Object.fromEntries(Object.entries(PINS().obs_tz).map(([v, x]) => [v, { integrity: { 'tz-country.json': x.integrity }, sha256: x.integrity }])) },
        // the shared map, ptmap (designer@'s design/shared-map/; Dinis, 19 Nov 17:40): vendored from this repository, never
        // loaded from promptugal.news (design/ scripts are not deployed); review: security@'s, before any site vendors it
        map: { version: MAPV, files: `https://github.com/promptugal/promptugal__news__website/tree/dev/${MAPDIR}`, spec: 'https://github.com/promptugal/promptugal__news__website/blob/dev/board/spec-the-shared-map.md',
            review: 'pending: security@ (asked 19 Nov)', install: S.map_install,
            versions: Object.fromEntries(Object.entries(PINS().map || {}).map(([v, x]) => [v, { integrity: { ...x } }])) } } }, ...previewFiles(ctx)]
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
    // pins.json: append-only, and the current versions listed with their true hashes (a version never changes bytes)
    const P = PINS(), TZV = JSON.parse(R('assets/obs/tz-country.json')).version
    if (JSON.stringify(P.bar[BAR]) !== JSON.stringify({ js: sha(JS), css: sha(CSS), render: sha(RENDER) })) p.push(`assets/sites/pins.json: the sites bar ${BAR} is not listed with its files' integrity (a new version needs a new number)`)
    if (!P.obs_tz[TZV] || P.obs_tz[TZV].integrity !== sha('assets/obs/tz-country.json')) p.push(`assets/sites/pins.json: tz-country ${TZV} is not listed with its integrity (a new version needs a new number)`)
    const MP = (P.map || {})[MAPV] || {}
    for (const f of ['ptmap.js', 'ptmap.css']) if (MP[f] !== sha384(`${MAPDIR}/${f}`)) p.push(`assets/sites/pins.json: the shared map ${MAPV}'s ${f} is not listed with its file's integrity (a new version needs a new number)`)
    // append-only against EVERY committed version of the file, not only HEAD (security@'s S71): an old pin rewritten
    // and committed still fails, however many commits ago
    const ROOT_ = new URL('../../../', import.meta.url).pathname, run = a => execFileSync('git', a, { cwd: ROOT_, stdio: ['ignore', 'pipe', 'ignore'] }).toString()
    let revs = []; try { revs = run(['log', '--format=%H', '--', 'assets/sites/pins.json']).split('\n').filter(Boolean) } catch { }
    for (const h of revs) { let old; try { old = JSON.parse(run(['show', `${h}:assets/sites/pins.json`])) } catch { continue }
        for (const piece of ['bar', 'obs_tz', 'map']) for (const [v, pin] of Object.entries(old[piece] || {})) if (JSON.stringify((P[piece] || {})[v]) !== JSON.stringify(pin)) p.push(`assets/sites/pins.json: ${piece} ${v} differs from its pin in ${h.slice(0, 9)} (the list is append-only)`) }
    // the page-view script's built-in table is the published one
    const T = JSON.parse(R('assets/obs/tz-country.json')).zones, js = R('assets/obs/obs.js').toString(), m = js.match(/const TZ = Object\.assign\(Object\.create\(null\), (\{[^}]*\})\)/)
    if (!m || JSON.stringify(Object.entries(JSON.parse(m[1])).sort()) !== JSON.stringify(Object.entries(T).sort())) p.push('assets/obs/obs.js: its time-zone table is not assets/obs/tz-country.json')
    // our own preview (the spec's Safety 5): no script, no foreignObject, no event attribute, no outside reference
    let svg = ''; try { svg = gate.text('api/v1/preview.svg') } catch { p.push('api/v1/preview.svg is missing') }
    if (/<script|<foreignObject|\son\w+\s*=|(href|src)\s*=\s*["'](?!#)/i.test(svg)) p.push('api/v1/preview.svg has a script, a foreignObject, an event attribute or an outside reference')
    return p
}
