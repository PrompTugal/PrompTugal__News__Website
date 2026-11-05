#!/usr/bin/env node
// web-summit.newsroom.sgit.ai: the build. No dependencies; Node 18+.
//   node admin/build/build.mjs
// The core is small: it loads the prose (content/), the data (data/), and every feature in admin/build/features/,
// asks each feature for its pages, its JSON files and its search documents, and writes, for every page: the HTML
// (through the shell, lib/shell.mjs), its markdown twin, its line in llms.txt and its <url> in sitemap.xml. The
// contract a feature follows is in admin/build/README.md. Everything written is gitignored (generated output is
// never committed) and listed in .generated.txt; files an earlier build wrote and this one did not are deleted.
import path from 'node:path'
import * as config from './lib/config.mjs'
import * as markdown from './lib/markdown.mjs'
import { loadContent } from './lib/content.mjs'
import { loadData } from './lib/data.mjs'
import { loadFeatures } from './lib/features.mjs'
import { buildGraph } from './lib/graph.mjs'
import { htmlPage, twinPage, twinOf } from './lib/shell.mjs'
import { write, json, llmsTxt, sitemapXml, robotsTxt, finish, written } from './lib/writers.mjs'

const { NAV, BASE, VERSION, matches, gitDate } = config
const features = await loadFeatures()

// a markdown link from one page to another (the twin's .md; the renderer turns it into .html for the page)
const link = (fromRel, toRel) => {
    const [p, hash] = toRel.split('#')
    const r = path.posix.relative(path.posix.dirname(fromRel), p) || path.posix.basename(p)
    return twinOf(r) + (hash ? `#${hash}` : '')
}

const ctx = {
    ...config, md: markdown, link,
    content: loadContent(),
    store: loadData(),
    features: features.map(f => f.name),
    pages: [],
}
// the whole graph, built once on first use (lib/graph.mjs): features read it for navigators and write its views
let whole
ctx.graph = () => whole || (whole = buildGraph(ctx.store, ctx))

// 1. pages, from every feature in order
const pages = []
for (const f of features) if (f.pages) for (const p of await f.pages(ctx)) pages.push({ ...p, feature: p.feature || f.name })
const seen = new Map()
for (const p of pages) {
    if (seen.has(p.rel)) throw new Error(`${p.rel} is made twice (by ${seen.get(p.rel)} and ${p.feature})`)
    seen.set(p.rel, p.feature)
}
// 2. features may decorate any page (the articles feature adds the byline to articles, for example)
for (const f of features) if (f.decorate) for (const p of pages) f.decorate(p, ctx)
// 3. defaults every page gets: its section, its llms.txt group, its type and date, its crumbs
const groupOf = rel => (NAV.llms_groups.find(g => matches(rel, g.match)) || { group: 'Other' }).group
for (const p of pages) {
    p.title = p.title || p.meta?.title || 'Untitled'
    p.summary = p.summary ?? p.meta?.summary ?? ''
    p.section = p.section ?? ([...NAV.nav, ...(NAV.utility || [])].find(n => matches(p.rel, n.match)) || {}).id ?? ''
    p.group = p.group || groupOf(p.rel)
    p.type = p.type || 'site'
    p.date = p.date || p.meta?.date || (p.src && gitDate(p.src)) || config.TODAY
    p.crumbs = p.crumbs || (p.rel === 'index.html' ? [] : [[null, p.title]])
    p.listed = p.listed !== false
}
ctx.pages = pages
// 4. markers in the prose (<!-- name -->) filled by the features that offer them
const fills = Object.assign({}, ...features.map(f => f.fill || {}))
for (const p of pages) p.md = p.md.replace(/<!-- ([a-z0-9:-]+) -->/g, (m, name) => {
    if (!fills[name]) throw new Error(`${p.src || p.rel}: no feature fills the marker ${m}`)
    return fills[name](p, ctx)
})

// 5. write every page and its twin
const site = {
    ...config, SITE: config.SITE,
    nav: NAV.nav, footer: NAV.footer,
    // a utility link (Admin) shows only once its page exists, so the link never breaks before its feature lands
    utility: (NAV.utility || []).filter(u => /^https?:/.test(u.href) || seen.has(u.href)),
    assets: { css: features.flatMap(f => f.assets?.css || []), js: features.flatMap(f => f.assets?.js || []) },
}
for (const p of pages) {
    const { html, toc } = markdown.render(p.md)
    let out = htmlPage({ ...p, bodyHtml: p.postHtml ? p.postHtml(html) : html, toc: p.toc ?? toc }, site)
    if (p.absolute) out = out.replace(/href="(?!https?:|#)([^"]+)"/g, (m, h) => `href="/${h.replace(/^(\.\.\/)+/, '')}"`)
    write(p.rel, out)
    write(twinOf(p.rel), twinPage({ ...p, md: p.twinMd ?? p.md }, site))
}

// 6. the JSON API: every feature's files, each with its schema name, then the search documents and the manifest
const api = []
for (const f of features) if (f.api) for (const file of await f.api(ctx)) api.push({ ...file, feature: f.name })
const searchDocs = []
for (const f of features) if (f.searchDocs) searchDocs.push(...await f.searchDocs(ctx))
if (searchDocs.length) api.push({ path: 'api/v1/search-docs.json', schema: 'search-docs', feature: 'core', data: { version: VERSION, count: searchDocs.length, docs: searchDocs } })
const manifest = []
for (const file of api) {
    const body = typeof file.data === 'string' ? file.data : json(file.data)
    write(file.path, body)
    manifest.push({ path: file.path, bytes: Buffer.byteLength(body), sha256: (await import('node:crypto')).createHash('sha256').update(body).digest('hex'), schema: file.schema || null, feature: file.feature })
}
if (api.length) write('api/v1/manifest.json', json({ version: VERSION, about: 'Every file of this site\'s JSON API, with its size, SHA-256 and the schema it follows (data/schemas/<schema>.schema.json, where one exists). The manifest does not list itself.', count: manifest.length, files: manifest }))
ctx.api = api

// 7. llms.txt, sitemap.xml, robots.txt
const listed = pages.filter(p => p.listed)
const order = [...NAV.llms_groups.map(g => g.group), ...new Set(listed.map(p => p.group))]
const groups = [...new Set(order)].map(group => ({ group, pages: listed.filter(p => p.group === group) }))
const apiLines = features.flatMap(f => f.llms ? [f.llms(ctx)] : []).join('')
write('llms.txt', llmsTxt(config, pages.find(p => p.rel === 'index.html'), groups, apiLines))
write('sitemap.xml', sitemapXml(BASE, listed))
write('robots.txt', robotsTxt(BASE))

finish()
console.log(`built ${pages.length} pages (${written.size} files) at ${VERSION}`)
