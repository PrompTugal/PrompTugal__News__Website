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
export const BAR = '1.0.0'
const ROOT = new URL('../../../', import.meta.url)
const R = p => readFileSync(new URL(p, ROOT))
const sha = p => createHash('sha256').update(R(p)).digest('hex')
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const JS = `assets/sites-bar/${BAR}/sites-bar.js`, CSS = `assets/sites-bar/${BAR}/sites-bar.css`

export function decorate(p) {
    if (p.bare || p.raw || p.sitesBar || !p.md) return
    p.sitesBar = true
    p.assets = { ...(p.assets || {}), css: [...((p.assets && p.assets.css) || []), CSS], js: [...((p.assets && p.assets.js) || []), JS] }
}

const reg = () => JSON.parse(R('assets/sites/sites.json'))

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
        about: S.about, version: ctx.VERSION, sites: S.sites.map(s => s.id === 'news' ? { ...s, version_url: `${s.url}api/v1/version.json`, preview: `${s.url}api/v1/preview.svg`, preview_png: null }
            : { ...s, version_url: `${s.url}version.json`, preview: `${s.url}preview.svg`, preview_png: `${s.url}preview.png` }),
        bar: { version: BAR, js: `https://promptugal.news/${JS}`, css: `https://promptugal.news/${CSS}`, sha256: { js: sha(JS), css: sha(CSS) },
            install: S.bar_install },
        preview_spec: S.preview_spec } }, ...previewFiles(ctx)]
}

function previewFiles(ctx) {
    const built = new Date().toISOString()
    const arts = ctx.pages.filter(p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html' && !p.withdrawn).length
    let places = 0; try { places = JSON.parse(R('data/by-place/places.json')).places.length } catch { }
    const S = reg(), sources = ledger(JSON.parse(R('assets/payments/model.json'))).sources.length
    const nums = [arts, places, sources, ctx.pages.length].map((n, i) => [n, S.preview.labels[i]])
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
<title>PrompTugal.news: ${x(ctx.VERSION)}</title>
<desc>${x(S.preview.desc.replace('{built}', built))}</desc>
<rect width="1200" height="630" fill="#fffdf8"/><rect width="1200" height="14" fill="#c8102e"/>
<text x="70" y="120" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#111">PrompTugal.news</text>
<text x="70" y="172" font-family="system-ui, sans-serif" font-size="28" fill="#444">${x(S.preview.tagline)}</text>
${nums.map(([n, l], i) => `<g transform="translate(${70 + (i % 2) * 540},${250 + Math.floor(i / 2) * 150})"><text font-family="system-ui, sans-serif" font-size="72" font-weight="700" fill="#c8102e">${x(n)}</text><text y="44" font-family="system-ui, sans-serif" font-size="24" fill="#333">${x(l)}</text></g>`).join('\n')}
<text x="70" y="590" font-family="system-ui, sans-serif" font-size="20" fill="#666">${x(ctx.VERSION)} · built ${x(built.slice(0, 16).replace('T', ' '))} UTC · CC BY 4.0</text>
</svg>\n`
    return [
        // under api/v1/ until the root /version.json and /preview.svg are in .gitignore (outside dev@'s grant: asked)
        { path: 'api/v1/version.json', schema: null, data: { version: ctx.VERSION, built, site: 'https://promptugal.news/' } },
        { path: 'api/v1/preview.svg', schema: null, data: svg },
    ]
}

// the bar's pinned hashes match its files, and the registry links only to promptugal.news sites
export function validate(gate) {
    let d; try { d = gate.json('api/v1/sites.json') } catch { return ['api/v1/sites.json is missing'] }
    const p = []
    if (d.bar.sha256.js !== sha(JS) || d.bar.sha256.css !== sha(CSS)) p.push('the sites bar\'s published sha256 does not match its files')
    for (const s of d.sites) if (!/^https:\/\/([a-z0-9-]+\.)?promptugal\.news\/$/.test(s.url) || !/^#[0-9a-f]{6}$/i.test(s.mark)) p.push(`sites.json: ${s.id} has a url or mark the bar would refuse`)
    return p
}
