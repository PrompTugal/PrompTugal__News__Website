// The OpenAPI 3.1 specs and the Swagger pages (datasci.places@PrompTugal.dinis, 15 November 2026, at Dinis's word: "add
// a REST API and a Swagger ... a whole mature Swagger, including for every website: every locality should have a
// Swagger for that locality, and I should be able to call it, because it's just GET calls").
//
//   api/v1/openapi.json                 every file the site serves under /api/v1/ (and its few others), as GET operations,
//                                       generated at build time from the files themselves: paths that repeat become one
//                                       templated path whose parameter lists every value; each response has its schema
//                                       (data/schemas/<name>.schema.json where the file names one, otherwise inferred
//                                       from the files and marked x-inferred) and a real example cut from a real file
//   api/v1/places/<id>/openapi.json     the same for one place (Portugal, the Algarve, each town): its own endpoints,
//                                       concrete, each with that place's own file as the example
//   api/v1/datasci/audit.json           the JSON-first audit (features/datasci-audit.mjs)
//   api/swagger/index.html              Swagger UI on the whole spec; <place>/api/index.html on each place's
//   datasci/index.html                  the data quality dashboard and the audit, drawn from the JSON above
//
// Swagger UI is vendored (assets/vendor/swagger-ui/5.33.3/, unedited, hashes checked below): no CDN at runtime. The gate checks
// that the spec covers every file the manifest lists, that each place spec's paths are files the build wrote, and the
// vendored hashes.
import fs from 'node:fs'
import { audit } from './datasci-audit.mjs'
import { placeList, endpoints, quality, words, fillW } from './datasci-places.mjs'

export const order = 98
const SITE = 'https://promptugal.news'
const SW = 'assets/vendor/swagger-ui/5.33.3'
const VENDORED = { 'swagger-ui-bundle.js': '3861ec4cc8e7b9fa9f250280da9350436e418137788282c753b9a2ac5fb7bd2f', 'swagger-ui.css': '1ac324f7dcd27e4b9386b4bd6421271ec147e922a22c05ba24b11515e9aa6321' }
const ASSETS = { css: [`${SW}/swagger-ui.css`, 'assets/swagger/swagger-page.css'], js: [`${SW}/swagger-ui-bundle.js`, 'assets/swagger/swagger-page.js'] }
// files made in the build's final step (after the API), which the spec cannot read as data; each named with its type
const FINALS = [{ path: 'api/v1/deploy-exclude.txt', type: 'text/plain' }, { path: 'sw.js', type: 'text/javascript' }, { path: 'api/v1/manifest.json', type: 'application/json' }]
const TYPES = { json: 'application/json', nt: 'application/n-triples', txt: 'text/plain', js: 'text/javascript', md: 'text/markdown', xml: 'application/xml', csv: 'text/csv' }
const tagOf = p => { const s = p.replace(/^api\/v1\//, '').split('/'); if (s.length === 1) return /^(index|manifest|ontology|openapi|triples|search-docs)\b/.test(s[0]) ? (s[0].startsWith('search') ? 'search' : 'meta') : s[0].replace(/\.[a-z]+$/, ''); return s[0] }
const extOf = p => (p.match(/\.([a-z0-9]+)$/) || [])[1] || ''
const opId = p => 'get_' + p.replace(/[{}]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '')

// ---- schemas: data/schemas/ into components, refs rewritten; and inference for files without one ----
function components(ctx) {
    const dir = ctx.R('data/schemas'), out = {}
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.schema.json'))) {
        const name = f.replace(/\.schema\.json$/, '')
        const fix = (v) => {
            if (Array.isArray(v)) return v.map(fix)
            if (!v || typeof v !== 'object') return v
            const o = {}
            for (const [k, x] of Object.entries(v)) {
                if (k === '$id' || k === '$schema') continue
                if (k === '$ref' && typeof x === 'string') {
                    const [file, frag = ''] = x.split('#')
                    const target = file ? file.replace(/\.schema\.json$/, '') : name
                    o.$ref = `#/components/schemas/${target}${frag}`
                } else o[k] = fix(x)
            }
            return o
        }
        try { out[name] = fix(JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'))) } catch {}
    }
    return out
}

const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v
function infer(samples, depth = 0) {
    const types = new Set(samples.map(typeOf))
    if (types.has('integer') && types.has('number')) types.delete('integer')
    const s = {}
    const t = [...types]
    s.type = t.length === 1 ? t[0] : t
    if (depth > 5) return s
    const objs = samples.filter(v => typeOf(v) === 'object')
    if (objs.length) {
        const keys = new Map()
        for (const o of objs) for (const k of Object.keys(o)) keys.set(k, (keys.get(k) || 0) + 1)
        if (keys.size > 80) { s.additionalProperties = true; return s }
        s.properties = {}
        for (const k of keys.keys()) s.properties[k] = infer(objs.filter(o => k in o).map(o => o[k]).slice(0, 200), depth + 1)
        const req = [...keys].filter(([, c]) => c === objs.length).map(([k]) => k)
        if (req.length) s.required = req
    }
    const arrs = samples.filter(Array.isArray)
    if (arrs.length) { const items = arrs.flatMap(a => a.slice(0, 50)).slice(0, 300); if (items.length) s.items = infer(items, depth + 1) }
    const strs = samples.filter(v => typeof v === 'string')
    if (strs.length >= 3 && strs.every(x => /^https?:\/\//.test(x))) s.format = 'uri'
    else if (strs.length >= 3 && strs.every(x => /^\d{4}-\d{2}-\d{2}$/.test(x))) s.format = 'date'
    return s
}

// a real example, cut to a readable size: arrays to three items, long strings shortened
function cut(v, depth = 0) {
    if (Array.isArray(v)) return v.slice(0, depth > 3 ? 1 : 3).map(x => cut(x, depth + 1))
    if (v && typeof v === 'object') { const o = {}; let n = 0; for (const [k, x] of Object.entries(v)) { if (n++ > 40) { o['...'] = `${Object.keys(v).length - 40} more keys`; break } o[k] = cut(x, depth + 1) } return o }
    if (typeof v === 'string' && v.length > 400) return v.slice(0, 400) + '...'
    return v
}
const exampleOf = data => { if (typeof data === 'string') return data.slice(0, 600) + (data.length > 600 ? '\n...' : ''); const c = cut(data); return JSON.stringify(c).length > 24000 ? undefined : c }

// ---- grouping files into paths ----
function group(files) {
    const left = new Map(files.map(f => [f.path, f]))
    const groups = []
    // directories that repeat: a/b/<X>/c.json for three or more X, same feature
    const dirKey = new Map()
    for (const f of files) {
        const s = f.path.split('/')
        if (s.length < 4) continue
        for (let i = 2; i < s.length - 1; i++) {
            const key = [...s.slice(0, i), '{id}', ...s.slice(i + 1)].join('/') + '|' + f.feature
            if (!dirKey.has(key)) dirKey.set(key, [])
            dirKey.get(key).push({ f, v: s[i] })
        }
    }
    for (const [key, list] of [...dirKey].sort((a, b) => b[1].length - a[1].length)) {
        const live = list.filter(x => left.has(x.f.path))
        if (live.length < 3 || new Set(live.map(x => x.v)).size < 3) continue
        groups.push({ template: key.split('|')[0], param: 'id', values: live.map(x => x.v), files: live.map(x => x.f) })
        for (const x of live) left.delete(x.f.path)
    }
    // names that repeat in one directory: a/b/<slug>.json, three or more, same feature and schema
    const nameKey = new Map()
    for (const f of left.values()) {
        const i = f.path.lastIndexOf('/'), dir = f.path.slice(0, i), base = f.path.slice(i + 1), ext = extOf(base)
        if (/^(index|openapi|quality|manifest)\.json$/.test(base) || dir === 'api/v1') continue
        const key = `${dir}/{slug}.${ext}|${f.feature}|${f.schema || ''}`
        if (!nameKey.has(key)) nameKey.set(key, [])
        nameKey.get(key).push({ f, v: base.slice(0, -(ext.length + 1)) })
    }
    for (const [key, list] of nameKey) {
        if (list.length < 3) continue
        groups.push({ template: key.split('|')[0], param: 'slug', values: list.map(x => x.v), files: list.map(x => x.f) })
        for (const x of list) left.delete(x.f.path)
    }
    for (const f of left.values()) groups.push({ template: f.path, files: [f] })
    return groups.sort((a, b) => a.template.localeCompare(b.template))
}

function operation(g, comps, { exampleFile } = {}) {
    const S = WORDS.spec
    const f0 = g.files[0], ext = extOf(f0.path), type = TYPES[ext] || 'application/octet-stream'
    const schemaName = f0.schema && comps[f0.schema] ? f0.schema : null
    const ex = exampleFile || [...g.files].sort((a, b) => (a.bytes || 0) - (b.bytes || 0))[Math.min(g.files.length - 1, Math.floor(g.files.length / 3))]
    let schema
    if (schemaName) schema = { $ref: `#/components/schemas/${schemaName}` }
    else if (type === 'application/json') schema = { ...infer(g.files.filter(f => f.data && typeof f.data === 'object').slice(0, 60).map(f => f.data)), 'x-inferred': true }
    else schema = { type: 'string' }
    const content = { [type]: { schema } }
    const example = ex && ex.data !== undefined ? exampleOf(ex.data) : undefined
    if (example !== undefined) content[type].examples = { [ex.path.split('/').pop().replace(/\.[a-z]+$/, '') || 'example']: { summary: `/${ex.path}`, description: `${SITE}/${ex.path}`, value: example } }
    else if (ex) content[type].examples = { full: { summary: fillW(S.too_large, { path: `/${ex.path}` }), externalValue: `${SITE}/${ex.path}` } }
    const about = (ex && ex.data && typeof ex.data === 'object' && typeof ex.data.about === 'string') ? ex.data.about : (g.about || '')
    const params = g.param ? [{ name: g.param, in: 'path', required: true, description: fillW(S.param, { n: g.values.length, some: g.values.slice(0, 3).join(', ') }), schema: { type: 'string', enum: [...new Set(g.values)].sort() }, example: ex ? ex.path.split('/').find((s, i) => g.template.split('/')[i] === `{${g.param}}` || g.template.split('/')[i] === `{${g.param}}.${ext}`)?.replace(/\.[a-z0-9]+$/, '') : undefined }] : []
    return {
        get: {
            operationId: opId(g.template), tags: [tagOf(g.template)],
            summary: g.param ? `${g.values.length} files: /${g.template}` : `/${g.template}`,
            description: [about, f0.feature ? fillW(S.made_by, { feature: f0.feature }) + (schemaName ? fillW(S.follows, { schema: schemaName }) : S.inferred) : ''].filter(Boolean).join('\n\n'),
            ...(params.length ? { parameters: params } : {}),
            responses: { 200: { description: S.ok, content }, 404: { description: S.not_found } },
            'x-files': g.files.length, 'x-feature': f0.feature || null,
        },
    }
}

function refsIn(o, out = new Set()) { if (Array.isArray(o)) o.forEach(x => refsIn(x, out)); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (k === '$ref' && typeof v === 'string' && v.startsWith('#/components/schemas/')) out.add(v.split('/')[3]); else refsIn(v, out) } return out }
function closure(comps, roots) { const need = new Set(roots), q = [...roots]; while (q.length) { const n = q.pop(); for (const r of refsIn(comps[n] || {})) if (!need.has(r)) { need.add(r); q.push(r) } } return Object.fromEntries([...need].filter(n => comps[n]).sort().map(n => [n, comps[n]])) }

let WORDS
const info = (ctx, title, description) => ({ title, version: ctx.VERSION, description, license: { name: WORDS.spec.licence, identifier: 'CC-BY-4.0' }, contact: { name: 'PrompTugal.news', url: `${SITE}/api/` } })

export function final(ctx) {
    WORDS = words(ctx)
    const S = WORDS.spec, TAGS = S.tags
    const comps = components(ctx)
    const out = []
    // the audit first, so the spec describes it too
    const report = audit(ctx)
    const auditFile = { path: 'api/v1/datasci/audit.json', data: report, feature: 'openapi', schema: null }
    const places = placeList(ctx)
    const placeSpecPaths = places.map(r => `api/v1/places/${r.id}/openapi.json`)
    const files = [...(ctx.api || []).map(a => ({ ...a, bytes: typeof a.data === 'string' ? a.data.length : JSON.stringify(a.data).length })), { ...auditFile, bytes: JSON.stringify(report).length }]
    const groups = group(files)
    const paths = {}
    for (const g of groups) paths[`/${g.template}`] = operation(g, comps)
    for (const f of FINALS) paths[`/${f.path}`] = operation({ template: f.path, about: S.finals[f.path], files: [{ path: f.path, feature: 'core' }] }, comps)
    const specOp = (about, values) => ({ get: { operationId: opId(values ? 'api/v1/places/{id}/openapi.json' : 'api/v1/openapi.json'), tags: ['meta'], summary: about, ...(values ? { parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', enum: values } }] } : {}), responses: { 200: { description: S.doc, content: { 'application/json': { schema: { type: 'object', required: ['openapi', 'info', 'paths'], properties: { openapi: { const: '3.1.0' }, info: { type: 'object' }, paths: { type: 'object' } } } } } } } } })
    paths['/api/v1/openapi.json'] = specOp(S.this_doc)
    paths['/api/v1/places/{id}/openapi.json'] = specOp(S.place_doc, places.map(r => r.id))
    const used = refsIn(paths)
    const whole = {
        openapi: '3.1.0',
        info: info(ctx, S.whole_title, fillW(S.whole, { files: files.length + FINALS.length, paths: Object.keys(paths).length, site: SITE, id: '{id}' })),
        servers: [{ url: SITE, description: S.production }],
        tags: [...new Set(Object.values(paths).map(p => p.get.tags[0]))].sort().map(t => ({ name: t, description: TAGS[t] || '' })),
        externalDocs: { description: S.docs, url: `${SITE}/api/` },
        paths,
        components: { schemas: closure(comps, [...used]) },
        'x-generated': { by: 'newsroom/build/features/openapi.mjs (datasci.places@PrompTugal.dinis)', version: ctx.VERSION, built: ctx.TODAY, files: files.length + FINALS.length + 1 + placeSpecPaths.length },
    }
    out.push({ path: 'api/v1/openapi.json', data: JSON.stringify(whole, null, 1) + '\n' })
    // one per place: its own files, concrete, and the shared files every place reads
    const shared = ['api/v1/by-place/index.json', 'api/v1/places/quality.json', 'api/v1/data/index.json']
    const byPath = new Map(files.map(f => [f.path, f]))
    for (const r of places) {
        const mine = files.filter(f => f.path === `api/v1/by-place/${r.id}.json` || f.path.startsWith(`api/v1/by-place/${r.id}/`) || f.path === `api/v1/data/places/${r.id}.json` || f.path.startsWith(`api/v1/places/${r.id}/`) || f.path === `api/v1/places/${r.id}.json` || f.path === `api/v1/graph/places/${r.id}.json`)
        const p = {}
        for (const f of mine) p[`/${f.path}`] = operation({ template: f.path, files: [f] }, comps)
        for (const s of shared) if (byPath.has(s)) p[`/${s}`] = operation({ template: s, files: [byPath.get(s)] }, comps)
        const tables = files.filter(f => /^api\/v1\/data\/tables\/[^/]+\.json$/.test(f.path))
        if (tables.length) p['/api/v1/data/tables/{slug}.json'] = operation({ template: 'api/v1/data/tables/{slug}.json', param: 'slug', values: tables.map(f => f.path.split('/').pop().replace('.json', '')), files: tables }, comps)
        p[`/api/v1/places/${r.id}/openapi.json`] = { get: { operationId: opId(`api/v1/places/${r.id}/openapi.json`), tags: ['meta'], summary: S.this_place_doc, responses: { 200: { description: S.doc, content: { 'application/json': { schema: { type: 'object' } } } } } } }
        for (const op of Object.values(p)) op.get.tags = [op.get.tags[0] === 'meta' ? 'meta' : (op.get.tags[0] === 'places' ? r.name : op.get.tags[0])]
        const spec = {
            openapi: '3.1.0',
            info: info(ctx, fillW(S.place_title, { name: r.name }), fillW(S.place, { page: r.page, id: r.id, agent: r.agent, name: r.name })),
            servers: [{ url: SITE, description: S.production }],
            tags: [{ name: r.name, description: fillW(S.place_tag, { name: r.name }) }, { name: 'by-place', description: TAGS['by-place'] }, { name: 'data', description: TAGS.data }, { name: 'meta', description: TAGS.meta }],
            externalDocs: { description: `PrompTugal.news ${r.name}`, url: r.page },
            paths: p,
            components: { schemas: closure(comps, [...refsIn(p)]) },
            'x-place': { id: r.id, name: r.name, kind: r.kind, agent: r.agent, endpoints: endpoints(r.id) },
        }
        out.push({ path: `api/v1/places/${r.id}/openapi.json`, data: JSON.stringify(spec, null, 1) + '\n' })
    }
    out.push({ path: auditFile.path, data: JSON.stringify(report, null, 2) + '\n' })
    return out
}

// ---- pages: Swagger, site-wide and per place, and the quality dashboard ----
const up = rel => '../'.repeat(rel.split('/').length - 1)
const swaggerHtml = (rel, spec) => html => `${html}\n<div id="swagger-ui" data-spec="${up(rel)}${spec}"></div>`

export function pages(ctx) {
    const places = placeList(ctx), cell = s => ctx.md.cell(String(s ?? '')), P = words(ctx).pages
    let list = { places: [] }
    try { list = ctx.readJSON('data/by-place/places.json') } catch {}
    const pathOf = id => (list.places.find(p => p.id === id) || {}).path
    const out = []
    const rel0 = 'api/swagger/index.html'
    out.push({
        rel: rel0, title: P.swagger_title, type: 'site', layout: 'wide', assets: ASSETS, src: 'newsroom/build/features/openapi.mjs',
        summary: P.swagger_summary,
        crumbs: [['api/index.html', 'The data, as JSON'], [null, 'Swagger']],
        md: fillW(P.swagger_md, { spec: ctx.link(rel0, 'api/v1/openapi.json') }) + '\n\n' +
            `{.chip-list}\n- [${P.whole_site}](${ctx.link(rel0, 'api/v1/openapi.json')})\n${places.map(r => `- [${cell(r.name)}](${ctx.link(rel0, `${pathOf(r.id)}api/index.html`)})`).join('\n')}\n\n` +
            fillW(P.swagger_quality, { quality: ctx.link(rel0, 'datasci/index.html') }),
        postHtml: swaggerHtml(rel0, 'api/v1/openapi.json'),
    })
    for (const r of places) {
        const base = pathOf(r.id); if (!base) continue
        const rel = `${base}api/index.html`, e = endpoints(r.id)
        const rows = Object.entries(P.rows).map(([k, what]) => [k, fillW(what, { agent: r.agent })])
        out.push({
            rel, title: fillW(P.place_title, { name: r.name }), type: 'place', layout: 'wide', assets: ASSETS, src: `data/by-place/${r.id}.json`, section: 'portugal', group: 'Portugal',
            summary: fillW(P.place_summary, { name: r.name }),
            crumbs: [...(r.kind === 'country' ? [] : [['portugal/index.html', 'Portugal']]), ...(r.kind === 'country' || r.kind === 'region' ? [] : [['algarve/index.html', 'The Algarve']]), [`${base}index.html`, r.name], [null, 'API']],
            md: fillW(P.place_md, { name: cell(r.name), page: ctx.link(rel, `${base}index.html`), specpath: `api/v1/places/${r.id}/openapi.json`, spec: ctx.link(rel, `api/v1/places/${r.id}/openapi.json`), swagger: ctx.link(rel, 'api/swagger/index.html') }) + '\n\n' +
                `{.facts}\n${P.endpoint_h}\n|---|---|\n${rows.map(([k, what]) => `| [${e[k].replace(SITE + '/', '')}](${ctx.link(rel, e[k].replace(SITE + '/', ''))}) | ${cell(what)} |`).join('\n')}\n`,
            postHtml: swaggerHtml(rel, `api/v1/places/${r.id}/openapi.json`),
        })
    }
    out.push(dashboard(ctx, places, pathOf))
    return out
}

// the quality dashboard, drawn at build time from the same numbers api/v1/places/quality.json serves (no script)
function dashboard(ctx, places, pathOf) {
    const rel = 'datasci/index.html', cell = s => ctx.md.cell(String(s ?? '')), Wd = words(ctx), P = Wd.pages
    const pct = x => x === null || x === undefined ? 'n/a' : `${Math.round(x * 100)}%`
    let rows = []
    try { rows = places.map(r => ({ r, q: quality(ctx, r) })) } catch { rows = [] }
    const bar = v => `<span class="ds-bar" style="--v:${Math.max(0, Math.min(100, v))}"><span>${v}</span></span>`
    const md = fillW(P.dash_intro, { all: ctx.link(rel, 'api/v1/places/quality.json') }) + '\n\n' +
        `## ${P.dash_places_h} {#places}\n\n{.ds-table}\n${P.dash_head}\n|---|---|---|---|---|---|---|---|---|\n` +
        rows.sort((a, b) => b.q.score.value - a.q.score.value).map(({ r, q }) => `| [${cell(r.name)}](${ctx.link(rel, `${pathOf(r.id)}index.html`)}) | DSBAR${q.score.value} | ${q.counts.facts} | ${pct(q.coverage.overall)} | ${pct(q.coverage.with_source)} | ${q.freshness.median_read_age_days === null ? 'n/a' : fillW(P.days, { n: q.freshness.median_read_age_days })} | ${q.sources.distinct_hosts} | ${pct(q.sources.top_host_share)} | [quality.json](${ctx.link(rel, `api/v1/places/${r.id}/quality.json`)}) · [Swagger](${ctx.link(rel, `${pathOf(r.id)}api/index.html`)}) |`).join('\n') +
        `\n\n## ${P.dash_method_h} {#method}\n\n${Object.entries(Wd.method).map(([k, v]) => `- **${k}:** ${cell(v)}`).join('\n')}\n\n` +
        `## ${P.dash_audit_h} {#audit}\n\n` + fillW(P.dash_audit, { audit: ctx.link(rel, 'api/v1/datasci/audit.json'), swagger: ctx.link(rel, 'api/swagger/index.html') }) + '\n'
    return { rel, title: P.dash_title, type: 'site', layout: 'wide', src: 'newsroom/build/features/datasci-places.mjs', summary: P.dash_summary, crumbs: [['api/index.html', 'The data, as JSON'], [null, 'Data quality']], assets: { css: ['assets/swagger/swagger-page.css'] },
        postHtml: html => html.replace(/DSBAR(\d+)/g, (m, v) => bar(+v)), md, twinMd: md.replace(/DSBAR(\d+)/g, '$1') }
}

// each place page links to its data: the Swagger page, its REST root and its quality
export function decorate(page, ctx) {
    let list
    try { list = ctx.readJSON('data/by-place/places.json').places } catch { return }
    const p = list.find(x => `${x.path}index.html` === page.rel)
    if (!p || page.feature === 'openapi') return
    page.md += `

{.bp-note .ds-api}
` + fillW(words(ctx).pages.note, { swagger: ctx.link(page.rel, `${p.path}api/index.html`), index: ctx.link(page.rel, `api/v1/places/${p.id}/index.json`), page: ctx.link(page.rel, `api/v1/places/${p.id}/page.json`), spec: ctx.link(page.rel, `api/v1/places/${p.id}/openapi.json`), quality: ctx.link(page.rel, `api/v1/places/${p.id}/quality.json`) }) + '\n'
}

export const llms = ctx => fillW(words(ctx).pages.llms, { base: ctx.BASE })

// the gate: the spec covers every file the manifest lists, each place spec names only files the build wrote, and
// the vendored Swagger UI is unedited
export function validate(gate) {
    const errors = []
    for (const [f, h] of Object.entries(VENDORED)) { try { if (gate.sha256(gate.text(`${SW}/${f}`)) !== h) errors.push(`openapi: ${SW}/${f} was edited (its SHA-256 is not the vendored one)`) } catch { errors.push(`openapi: ${SW}/${f} missing`) } }
    let spec
    try { spec = gate.json('api/v1/openapi.json') } catch { return [...errors, 'openapi: api/v1/openapi.json missing or unreadable'] }
    if (spec.openapi !== '3.1.0' || !spec.info || !spec.paths) errors.push('openapi: api/v1/openapi.json is not an OpenAPI 3.1 document')
    const res = Object.entries(spec.paths).map(([p, op]) => {
        const enums = Object.fromEntries((op.get.parameters || []).map(x => [x.name, new Set(x.schema.enum || [])]))
        const names = [...p.matchAll(/\{(\w+)\}/g)].map(m => m[1])
        return { re: new RegExp('^' + p.slice(1).replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{(\w+)\}/g, '([^/]+)') + '$'), names, enums }
    })
    const covered = path => res.some(r => { const m = r.re.exec(path); return m && r.names.every((n, i) => !r.enums[n] || !r.enums[n].size || r.enums[n].has(m[i + 1])) })
    const manifest = gate.json('api/v1/manifest.json')
    const miss = manifest.files.map(f => f.path).filter(p => !covered(p))
    if (miss.length) errors.push(`openapi: ${miss.length} served file${miss.length === 1 ? '' : 's'} not in api/v1/openapi.json: ${miss.slice(0, 6).join(', ')}${miss.length > 6 ? ' ...' : ''}`)
    // every concrete path in a place spec is a file the build wrote
    for (const f of manifest.files.filter(f => /^api\/v1\/places\/[^/]+\/openapi\.json$/.test(f.path))) {
        const s = gate.json(f.path)
        for (const p of Object.keys(s.paths)) if (!p.includes('{') && !gate.generated.has(p.slice(1))) errors.push(`openapi: ${f.path} names ${p}, which the build did not write`)
    }
    return errors
}
