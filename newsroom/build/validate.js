#!/usr/bin/env node
// promptugal.news: the gate. Run from anywhere: node newsroom/build/validate.js
// It builds the site once itself, then checks it. Any failure exits 1: no release, no deploy. Prints OK when clean.
//   1. the build touches no tracked file (generated output is gitignored, never committed), and no source is ignored
//   2. version agreement: version.txt against every page's badge, llms.txt and every markdown twin
//   3. internal links: every relative href/src in every page resolves; no page is an orphan
//   4. canonical host: every page declares a canonical and og:url on the host in CNAME
//   5. the agent surface: every page has its .md twin, is in llms.txt and in sitemap.xml (unless it says noindex), and ends with an agent block
//   6. key-leak tripwire: no private key, sgit key, vault-key shape or API token in any file (newsroom/build/secrets.cjs)
//   7. public forever: no email address or phone number in content/, data/ or desks/ (desks/ is served as is)
//   8. articles: front matter complete (title, date, author, summary, license), a title under 12 words (brief 8),
//      a markdown twin, and a .sig by an active key in board/keys.json that verifies over the twin without its
//      version (newsroom/build/signed-form.cjs); an older .sig over the twin as built is a warning until it is re-signed
//   9. div balance, and no em-dash in prose
//  10. the shape of the estate: CLAUDE.md, REALITY.md (with the version), BRIEF.md, BRIEF-CORRECTIONS.md, CNAME,
//      the participant disclosure, and the about page naming the operator
//  11. the data (newsroom/build/checks.mjs): every file under data/ follows its schema (data/schemas/), every reference
//      between entities resolves, and the derived files are what newsroom/tools/derive.mjs makes now
//  12. the features' own checks (newsroom/build/checks.mjs): each feature's validate(gate) hook, e.g. the graphs and the API
//  14. the five themes: each sets every colour token, and the picker and the stylesheet agree
//  13. every page declares its page-type and page-date (the billing meter prices pages by them)
'use strict'
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const crypto = require('crypto')
const SIGNED = require('./signed-form.cjs')

const ROOT = path.resolve(__dirname, '..', '..')
const errors = [], warnings = []
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
// withdrawn pages (data/site/withdrawn.json; features/withdrawn.mjs checks each shows only the notice, is noindex, is in
// neither llms.txt nor the sitemap, and that its .sig is left out of the deploy): like the 404, deliberately unlisted
const WD = (() => { try { return JSON.parse(read('data/site/withdrawn.json')) } catch { return {} } })()
const WITHDRAWN = new Set(WD.articles || []), WITHDRAWN_PAGES = new Set([...(WD.articles || []).map(s => `articles/${s}.html`), ...(WD.stories || []).map(id => `newsroom/stories/${id}/index.html`)])

// 2. version agreement
const VERSION = read('newsroom/build/version.txt').trim()
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
for (const f of html) if (rel(f) !== '404.html' && !WITHDRAWN_PAGES.has(rel(f)) && !seen.has(rel(f))) errors.push(`${rel(f)}: an orphan (no link reaches it from index.html)`)

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
    if (r === '404.html' || WITHDRAWN_PAGES.has(r)) continue
    // a page kept out of search (<meta name="robots" content="noindex...">, newsroom/build/lib/seo.mjs) stays out of the sitemap too
    if (!listed.includes(r) && !/<meta name="robots" content="noindex/.test(t)) errors.push(`sitemap.xml is missing ${r}`)
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
const PHONE = /(?<![\w/])(?:\+|00)\d[\d ()-]{8,}\d/g   // not from inside a word or a hash (outreach@, 7 November: a sha256 matched), nor a URL's path segment (ontologist@, 12 November: an SEC filing's /000110465916150147/); tel:+... is still caught
const AGENT_NAME = /@(web-summit|PrompTugal)\.(dinis|vicky|indi|silvio|jose|angelo|zed|stranger|person)$/i   // the operators' names only, and three made-up ones the team's tests use (zed, stranger, person) (security@'s S31: web-summit.com passed)   // agent names (newsroom@web-summit.dinis, ontologist@PrompTugal.dinis) are names, not mail
// one published address, one file: Dinis's own investor contact (his words, 7 November 2026, about 01:00 UTC: "link to
// dinis.agent@promptugal.news, because that already exists"; board/team/investors/dinis-2026-11-07-my-feeds.md). Nowhere else.
const ALLOWED = { 'content/investors.md': ['dinis.agent@promptugal.news'],
    // security@'s S31 finding quotes the made-up addresses that passed the earlier rule (no mailbox, no person)
    'board/team/security/reviews/2026-11-09-0805-wake.md': ['someone@promptugal.io', 'someone@web-summit.com', 'someone@promptugal.example-mail.com'] }
// board/ too (security@'s S21, 9 November 2026: it is served and public forever), where the team's own words may also
// name agent handles in their newer forms (risk-mandate@promptugal.ai.dinis, x@ios.PrompTugal.dinis), the publication's
// own addresses (promptugal.news, promptugal.ai: roles and Dinis's published contact) and placeholders (example.*,
// company.pt). A person's address anywhere else, and any phone-number shape, is still refused.
// exact domains only (security@'s S31: a prefix match let someone@promptugal.io through)
const BOARD_OK = /@(?:promptugal\.news|promptugal\.ai|promptugal\.ai\.dinis|ios\.promptugal\.dinis|example\.(?:com|org|net|pt)|company\.pt)$/i
for (const f of files.filter(f => /^(content|data|desks|board)\//.test(rel(f)) && !secrets.BINARY.test(f))) {   // desks/ is served as is, so it is checked too; the verifier's records quote pages (security@'s S21, S28, S28b)
    const board = rel(f).startsWith('board/')
    for (const m of text(f).matchAll(EMAIL)) if (!AGENT_NAME.test(m[0]) && !(board && BOARD_OK.test(m[0])) && !/^actions@github\.com$/.test(m[0]) && !(ALLOWED[rel(f)] || []).includes(m[0])) errors.push(`${rel(f)}: an email address (${m[0].replace(/^(.).*@/, '$1…@')})`)
    for (const m of text(f).matchAll(PHONE)) errors.push(`${rel(f)}: a phone-number shape`)
}

// 8. articles (signatures checked against board/keys.json; see newsroom/build/signed-form.cjs)
const KEYS = (() => { try { return JSON.parse(read('board/keys.json')).keys || [] } catch { errors.push('board/keys.json: missing or not JSON'); return [] } })()
// a withdrawn article (WITHDRAWN, above) is no longer published: its page is the notice and its .sig is left out of the
// deploy (features/withdrawn.mjs checks both); its source and signature stay in the repository untouched
for (const f of files.filter(f => /^content\/articles\/[^/]+\.md$/.test(rel(f)) && !rel(f).endsWith('/index.md') && !WITHDRAWN.has(path.basename(f, '.md')))) {
    const fm = (text(f).match(/^---\n([\s\S]*?)\n---/) || [, ''])[1]
    if (/^status:\s*draft/m.test(fm)) continue
    for (const k of ['title', 'date', 'author', 'summary', 'license']) if (!new RegExp(`^${k}:\\s*\\S`, 'm').test(fm)) errors.push(`${rel(f)}: front matter has no ${k}`)
    const title = (fm.match(/^title:\s*(.+)$/m) || [, ''])[1].replace(/^["']|["']$/g, '')
    if (title.split(/\s+/).filter(Boolean).length >= 12) errors.push(`${rel(f)}: the title has ${title.split(/\s+/).filter(Boolean).length} words; the house rule is under 12 (brief 8, rule 6)`)
    const out = rel(f).replace(/^content\//, '').replace(/\.md$/, '')
    if (!exists(out + '.html') || !exists(out + '.md')) errors.push(`${rel(f)}: no page or markdown twin built`)
    const sig = `${out}.md.sig`
    if (!exists(sig)) { errors.push(`${out}.md: not signed (no ${sig})`); continue }
    let s
    try { s = JSON.parse(read(sig)) } catch { errors.push(`${sig}: not JSON`); continue }
    if (!/^sha256:[0-9a-f]{16}$/.test(s.fingerprint || '') || !s.signature) { errors.push(`${sig}: no signer fingerprint or signature`); continue }
    // the signer must be a key in board/keys.json, active; a signature over the version-free form must verify
    const key = KEYS.find(k => k.bundle && k.bundle.signing_fingerprint === s.fingerprint)
    if (!key) { errors.push(`${sig}: signed by ${s.fingerprint}, which is not in board/keys.json`); continue }
    if (key.status !== 'active') { errors.push(`${sig}: signed by ${key.id}, whose key is ${key.status || 'not active'} in board/keys.json`); continue }
    if (s.form === SIGNED.FORM || s.form === SIGNED.LEGACY_FORM) {
        if (!exists(out + '.md')) continue
        if (SIGNED.builderLines(read(out + '.md')) > 1) { errors.push(`${out}.md: more than one 'built by: ' line; only the agent block's may have that shape`); continue }
        let ok = false
        try { ok = crypto.verify('sha256', Buffer.from(SIGNED.signedFormFor(s.form, read(out + '.md'))), { key: key.bundle.sign, dsaEncoding: 'ieee-p1363' }, Buffer.from(s.signature, 'base64')) } catch (e) { errors.push(`${sig}: cannot verify (${e.message})`); continue }
        if (!ok) errors.push(`${sig}: the signature by ${key.id} does not verify against ${out}.md (the article changed since it was signed: sign it again with newsroom/tools/sign-article.mjs)`)
    } else if (s.form) errors.push(`${sig}: unknown form "${s.form}"`)
    else warnings.push(`${sig}: signed by ${key.id} over a twin with its version in it, so it cannot be verified after a release; sign it again with newsroom/tools/sign-article.mjs`)
}

// 9. div balance; no em-dash in prose
for (const f of html) {
    const t = text(f)
    const open = (t.match(/<div\b/g) || []).length, close = (t.match(/<\/div>/g) || []).length
    if (open !== close) errors.push(`${rel(f)}: ${open} <div> vs ${close} </div>`)
}
for (const f of files.filter(f => /^content\/.*\.md$/.test(rel(f)))) if (text(f).includes('\u2014')) errors.push(`${rel(f)}: an em-dash in prose (use a colon, a comma or two sentences)`)

// 10. the shape of the estate
for (const p of ['CLAUDE.md', 'REALITY.md', 'BRIEF.md', 'BRIEF-CORRECTIONS.md', 'CNAME', 'LICENSE', '.github/workflows/deploy-pages.yml', 'newsroom/build/tag_release.sh', 'newsroom/tools/release.sh', 'about/participant.html', 'about/index.html'])
    if (!exists(p)) errors.push(`missing ${p}`)
if (!/\(site v\d+\.\d+\.\d+\)/.test(read('REALITY.md'))) errors.push('REALITY.md does not carry "(site vX.Y.Z)" for CI to update')
if (exists('about/index.html') && !read('about/index.html').includes('Dinis Cruz')) errors.push('about/index.html does not name the human operator')

// 11 and 12. the data, and the features' own checks
try {
    const out = execFileSync('node', [path.join(__dirname, 'checks.mjs')], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).toString()
    const r = JSON.parse(out); errors.push(...(Array.isArray(r) ? r : r.problems)); if (!Array.isArray(r)) warnings.push(...r.warnings)
} catch (e) { errors.push(`checks.mjs failed: ${(e.stderr || e.message).toString().slice(-2000)}`) }

// 14. the themes (assets/tokens.css, assets/themes.js): every theme the picker offers sets every colour token the default
// sets, so none ships half applied; and the picker's list and the stylesheet's agree
{
    const css = read('assets/tokens.css'), js = read('assets/themes.js')
    const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    const block = sel => { const bs = rules.filter(m => m[1].includes(sel)).map(m => m[2]); return bs.length ? bs.join(';') : null }
    const names = b => new Set([...b.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]))
    const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')))
    const colour = [...names(root)].filter(n => new RegExp(`${n}:\\s*(#|rgba?\\()`).test(root) || /^--(shadow|focus)/.test(n))
    const offered = [...js.matchAll(/^\s*([a-z]+):\s*\{\s*label:/gm)].map(m => m[1])
    if (offered.length !== 5) errors.push(`assets/themes.js: expected five themes, found ${offered.length}`)
    for (const t of offered.filter(t => t !== 'paper')) {
        const b = block(`:root[data-theme="${t}"]`)
        if (!b) { errors.push(`assets/tokens.css: the theme "${t}" the picker offers has no block`); continue }
        const has = names(b), miss = colour.filter(n => !has.has(n))
        if (miss.length) errors.push(`assets/tokens.css: the theme "${t}" leaves out ${miss.join(', ')}`)
    }
}

// 13. page-type and page-date on every page
const TYPES = ['article', 'company', 'event', 'person', 'organisation', 'topic', 'place', 'story', 'evidence', 'site', 'account', 'index', 'data']
for (const f of html) {
    const t = text(f)
    const type = (t.match(/<meta name="page-type" content="([^"]*)">/) || [])[1], date = (t.match(/<meta name="page-date" content="([^"]*)">/) || [])[1]
    if (!TYPES.includes(type)) errors.push(`${rel(f)}: page-type "${type}" is not one of ${TYPES.join(', ')}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) errors.push(`${rel(f)}: page-date "${date}" is not a date`)
}

// 15. what rests only on websummit.com (lib/wsonly.mjs; the pass 2026-11-11-only-websummit-sourced-comes-off): counted
// at every run; while the switch is off this is a dry run and nothing served changes
{
    const js = "import { wsGate } from './lib/wsonly.mjs'; import { loadData } from './lib/data.mjs'; console.log(wsGate(loadData()))"
    try { warnings.push(execFileSync(process.execPath, ['--input-type=module', '-e', js], { cwd: __dirname, encoding: 'utf8' }).trim()) } catch (e) { errors.push('wsonly: ' + e.message) }
}

for (const w of warnings) console.error('WARN ' + w)
if (errors.length) {
    for (const e of errors) console.error('FAIL ' + e)
    console.error(`${errors.length} problem(s); the gate is red`)
    process.exit(1)
}
console.log(`OK (${VERSION}: ${html.length} pages, ${files.length} files, 14 checks)`)
