#!/usr/bin/env node
// promptugal.news: the gate. Run from anywhere: node admin/build/validate.js
// It builds the site once itself, then checks it. Any failure exits 1: no release, no deploy. Prints OK when clean.
//   1. the build touches no tracked file (generated output is gitignored, never committed), and no source is ignored
//   2. version agreement: version.txt against every page's badge, llms.txt and every markdown twin
//   3. internal links: every relative href/src in every page resolves; no page is an orphan
//   4. canonical host: every page declares a canonical and og:url on the host in CNAME
//   5. the agent surface: every page has its .md twin, is in llms.txt and in sitemap.xml, and ends with an agent block
//   6. key-leak tripwire: no private key, sgit key, vault-key shape or API token in any file (admin/build/secrets.cjs)
//   7. public forever: no email address or phone number in content/, data/ or desks/ (desks/ is served as is)
//   8. articles: front matter complete (title, date, author, summary, license), a title under 12 words (brief 8),
//      a markdown twin, and a .sig naming a signer
//   9. div balance, and no em-dash in prose
//  10. the shape of the estate: CLAUDE.md, REALITY.md (with the version), BRIEF.md, BRIEF-CORRECTIONS.md, CNAME,
//      the participant disclosure, and the about page naming the operator
//  11. the data (admin/build/checks.mjs): every file under data/ follows its schema (data/schemas/), every reference
//      between entities resolves, and the derived files are what admin/tools/derive.mjs makes now
//  12. the features' own checks (admin/build/checks.mjs): each feature's validate(gate) hook, e.g. the graphs and the API
//  13. every page declares its page-type and page-date (the billing meter prices pages by them)
'use strict'
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const errors = []
const rel = f => path.relative(ROOT, f).split(path.sep).join('/')
const cache = new Map()
const text = f => { if (!cache.has(f)) cache.set(f, fs.readFileSync(f, 'utf8')); return cache.get(f) }
const read = p => text(path.join(ROOT, p))
const exists = p => fs.existsSync(path.join(ROOT, p))
function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (['.git', 'node_modules', '.sg_vault', '.credentials'].includes(name)) continue
        const p = path.join(dir, name)
        if (fs.statSync(p).isDirectory()) walk(p, out); else out.push(p)
    }
    return out
}
const git = args => execFileSync('git', args, { cwd: ROOT }).toString()

// 1. build once; it must change no tracked file
try {
    const snap = () => git(['diff', 'HEAD', '--stat']) + git(['status', '--porcelain'])
    const before = snap()
    execFileSync('node', [path.join(__dirname, 'build.mjs')], { cwd: ROOT, stdio: 'pipe' })
    if (snap() !== before) errors.push('build.mjs changed a tracked file: generated output must be gitignored and never committed (.gitignore)')
} catch (e) { console.error(`FAIL build.mjs failed: ${(e.stderr || e.message).toString().slice(-2000)}`); process.exit(1) }
const generated = new Set(read('.generated.txt').split('\n').filter(Boolean))
try {
    // anything ignored that this build did not write is a source CI would never see, except the credentials tier and local noise
    const NOT_SOURCE = /(^|\/)(\.credentials|\.sg-send|\.sg_vault|node_modules|__pycache__)\/|(^|\/)(\.env(\..*)?|[^/]*\.(pem|key|log)|id_rsa[^/]*|id_ed25519[^/]*|\.DS_Store)$/
    const ignored = git(['ls-files', '--others', '--ignored', '--exclude-standard']).split('\n').filter(Boolean)
    for (const f of ignored.filter(f => !generated.has(f) && f !== '.generated.txt' && !NOT_SOURCE.test(f))) errors.push(`${f}: a source file is gitignored, so CI would never see it`)
} catch { }

const files = walk(ROOT)
const html = files.filter(f => f.endsWith('.html'))

// 2. version agreement
const VERSION = read('admin/build/version.txt').trim()
if (!/^v\d+\.\d+\.\d+$/.test(VERSION)) errors.push(`version.txt does not carry a vX.Y.Z version: "${VERSION}"`)
for (const f of html) {
    const badges = [...text(f).matchAll(/class="ver"[^>]*>(v\d+\.\d+\.\d+)</g)].map(m => m[1])
    if (!badges.length) errors.push(`${rel(f)}: no version badge`)
    for (const b of badges) if (b !== VERSION) errors.push(`${rel(f)}: version badge ${b} != ${VERSION}`)
}
if (!read('llms.txt').includes(VERSION)) errors.push(`llms.txt does not name ${VERSION}`)
for (const f of [...generated].filter(g => g.endsWith('.md'))) if (!read(f).includes(`site ${VERSION}`)) errors.push(`${f}: twin does not name ${VERSION}`)

// 3. internal links, and orphans (every page reachable by links from index.html)
const HOST = read('CNAME').trim()
const linksOf = f => [...text(f).matchAll(/(?:href|src)="([^"#?]*)(?:[#?][^"]*)?"/g)].map(m => m[1]).filter(u => u && !/^(https?:|mailto:|data:|\/\/)/.test(u))
for (const f of html) {
    if (rel(f) === '404.html') continue   // absolute paths, served from any depth
    for (const u of linksOf(f)) if (!fs.existsSync(path.resolve(path.dirname(f), u))) errors.push(`${rel(f)}: broken link -> ${u}`)
}
const seen = new Set(['index.html']), queue = ['index.html']
while (queue.length) {
    const p = queue.shift(), f = path.join(ROOT, p)
    if (!p.endsWith('.html') || !fs.existsSync(f)) continue
    for (const u of linksOf(f)) {
        const t = rel(path.resolve(path.dirname(f), u))
        if (!seen.has(t)) { seen.add(t); queue.push(t) }
    }
}
for (const f of html) if (rel(f) !== '404.html' && !seen.has(rel(f))) errors.push(`${rel(f)}: an orphan (no link reaches it from index.html)`)

// 4. canonical host
if (!/^[a-z0-9.-]+$/.test(HOST)) errors.push(`CNAME does not carry a hostname: "${HOST}"`)
for (const f of html) {
    const t = text(f)
    const claimed = [...t.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g), ...t.matchAll(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/g)].map(m => m[1])
    if (claimed.length < 2) errors.push(`${rel(f)}: no canonical link or og:url`)
    for (const u of claimed) if (!u.startsWith(`https://${HOST}/`)) errors.push(`${rel(f)}: canonical/og:url is not on ${HOST} -> ${u}`)
}

// 5. the agent surface
const llms = read('llms.txt')
const listed = [...read('sitemap.xml').matchAll(new RegExp(`<loc>https://${HOST.replace(/\./g, '\\.')}/([^<]+)</loc>`, 'g'))].map(m => m[1])
for (const p of listed) if (!exists(p)) errors.push(`sitemap.xml lists a page that does not exist: /${p}`)
for (const f of html) {
    const r = rel(f), t = text(f)
    if (!exists(r.replace(/\.html$/, '.md'))) errors.push(`${r}: no markdown twin`)
    if (!/class="agent-block"[\s\S]*<\/div>\s*<\/body>/.test(t)) errors.push(`${r}: does not end with an agent block`)
    if (r === '404.html') continue
    if (!listed.includes(r)) errors.push(`sitemap.xml is missing ${r}`)
    if (!llms.includes(r.replace(/\.html$/, '.md'))) errors.push(`llms.txt does not name ${r.replace(/\.html$/, '.md')}`)
}

// 6. key-leak tripwire
const secrets = require('./secrets.cjs')
errors.push(...secrets.selfTest())
for (const f of files) {
    if (secrets.BINARY.test(f)) continue
    for (const what of secrets.keyHits(text(f))) errors.push(`${rel(f)}: contains ${what}`)
}

// 7. public forever: no contact details in what we author
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]*[A-Za-z]{2,}/g
const PHONE = /(?:\+|00)\d[\d ()-]{8,}\d/g
const AGENT_NAME = /@(web-summit|PrompTugal)\.[a-z0-9-]+$/   // agent names (newsroom@web-summit.dinis, ontologist@PrompTugal.dinis) are names, not mail
for (const f of files.filter(f => /^(content|data|desks)\//.test(rel(f)) && !secrets.BINARY.test(f))) {   // desks/ is served as is, so it is checked too
    for (const m of text(f).matchAll(EMAIL)) if (!AGENT_NAME.test(m[0]) && !/^actions@github\.com$/.test(m[0])) errors.push(`${rel(f)}: an email address (${m[0].replace(/^(.).*@/, '$1…@')})`)
    for (const m of text(f).matchAll(PHONE)) errors.push(`${rel(f)}: a phone-number shape`)
}

// 8. articles
for (const f of files.filter(f => /^content\/articles\/[^/]+\.md$/.test(rel(f)) && !rel(f).endsWith('/index.md'))) {
    const fm = (text(f).match(/^---\n([\s\S]*?)\n---/) || [, ''])[1]
    if (/^status:\s*draft/m.test(fm)) continue
    for (const k of ['title', 'date', 'author', 'summary', 'license']) if (!new RegExp(`^${k}:\\s*\\S`, 'm').test(fm)) errors.push(`${rel(f)}: front matter has no ${k}`)
    const title = (fm.match(/^title:\s*(.+)$/m) || [, ''])[1].replace(/^["']|["']$/g, '')
    if (title.split(/\s+/).filter(Boolean).length >= 12) errors.push(`${rel(f)}: the title has ${title.split(/\s+/).filter(Boolean).length} words; the house rule is under 12 (brief 8, rule 6)`)
    const out = rel(f).replace(/^content\//, '').replace(/\.md$/, '')
    if (!exists(out + '.html') || !exists(out + '.md')) errors.push(`${rel(f)}: no page or markdown twin built`)
    const sig = `${out}.md.sig`
    if (!exists(sig)) { errors.push(`${out}.md: not signed (no ${sig})`); continue }
    try {
        const s = JSON.parse(read(sig))
        if (!/^sha256:[0-9a-f]{16}$/.test(s.fingerprint || '') || !s.signature) errors.push(`${sig}: no signer fingerprint or signature`)
    } catch { errors.push(`${sig}: not JSON`) }
}

// 9. div balance; no em-dash in prose
for (const f of html) {
    const t = text(f)
    const open = (t.match(/<div\b/g) || []).length, close = (t.match(/<\/div>/g) || []).length
    if (open !== close) errors.push(`${rel(f)}: ${open} <div> vs ${close} </div>`)
}
for (const f of files.filter(f => /^content\/.*\.md$/.test(rel(f)))) if (text(f).includes('\u2014')) errors.push(`${rel(f)}: an em-dash in prose (use a colon, a comma or two sentences)`)

// 10. the shape of the estate
for (const p of ['CLAUDE.md', 'REALITY.md', 'BRIEF.md', 'BRIEF-CORRECTIONS.md', 'CNAME', 'LICENSE', '.github/workflows/deploy-pages.yml', 'admin/build/tag_release.sh', 'admin/tools/release.sh', 'about/participant.html', 'about/index.html'])
    if (!exists(p)) errors.push(`missing ${p}`)
if (!/\(site v\d+\.\d+\.\d+\)/.test(read('REALITY.md'))) errors.push('REALITY.md does not carry "(site vX.Y.Z)" for CI to update')
if (exists('about/index.html') && !read('about/index.html').includes('Dinis Cruz')) errors.push('about/index.html does not name the human operator')

// 11 and 12. the data, and the features' own checks
try {
    const out = execFileSync('node', [path.join(__dirname, 'checks.mjs')], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).toString()
    errors.push(...JSON.parse(out))
} catch (e) { errors.push(`checks.mjs failed: ${(e.stderr || e.message).toString().slice(-2000)}`) }

// 13. page-type and page-date on every page
const TYPES = ['article', 'company', 'event', 'person', 'organisation', 'topic', 'place', 'story', 'evidence', 'site', 'account', 'index', 'data']
for (const f of html) {
    const t = text(f)
    const type = (t.match(/<meta name="page-type" content="([^"]*)">/) || [])[1], date = (t.match(/<meta name="page-date" content="([^"]*)">/) || [])[1]
    if (!TYPES.includes(type)) errors.push(`${rel(f)}: page-type "${type}" is not one of ${TYPES.join(', ')}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) errors.push(`${rel(f)}: page-date "${date}" is not a date`)
}

if (errors.length) {
    for (const e of errors) console.error('FAIL ' + e)
    console.error(`${errors.length} problem(s); the gate is red`)
    process.exit(1)
}
console.log(`OK (${VERSION}: ${html.length} pages, ${files.length} files, 13 checks)`)
