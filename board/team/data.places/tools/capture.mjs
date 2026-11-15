// Captures of the third-party pages the place files cite (data.places@PrompTugal.dinis, 15 November 2026; Dinis:
// "screenshots ... you can create vaults to store screenshots of third-party websites we grab"). For each source URL of
// the places named: a screenshot (JPEG, the top 1280x1600 of the page) and the page's visible text, each hashed
// (SHA-256), written to the sgit vault promptugal-captures (images live in vaults, not git), and an index entry in the
// repository that the build shows beside each item (newsroom/build/features/data-places.mjs).
//   node board/team/data.places/tools/capture.mjs --places loule,faro [--vault ~/.sg-send/vaults/promptugal-captures]
//        [--index data/query/captures.json] [--max 60] [--refresh] [--no-push]
// Public pages only: no login, no paywall, no bot challenge passed (a challenge is recorded as such, not got round).
// Never websummit.com, lu.ma, luma.com, meetup.com or eventbrite. Prints no key.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../..')
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true) }
const PLACES = String(arg('places', 'loule,faro')).split(',').filter(Boolean)
const VAULT = String(arg('vault', path.join(os.homedir(), '.sg-send/vaults/promptugal-captures'))).replace(/^~/, os.homedir())
const INDEX = path.join(ROOT, String(arg('index', 'data/query/captures.json')))
const MAX = +arg('max', 60), REFRESH = !!arg('refresh', false), PUSH = !arg('no-push', false)
const BANNED = /(^|\.)(websummit\.com|websummit\.net|lu\.ma|luma\.com|meetup\.com|eventbrite\.[a-z.]+)$/i
const AGENT = 'data.places@PrompTugal.dinis'
const sha = b => crypto.createHash('sha256').update(b).digest('hex')
const host = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase() } catch { return null } }
const ok = u => typeof u === 'string' && /^https?:\/\//.test(u) && host(u) && !BANNED.test(host(u))

// the URLs, with what cites each
const want = new Map()
const add = (url, ref) => { if (!ok(url)) return; if (!want.has(url)) want.set(url, []); want.get(url).push(ref) }
for (const id of PLACES) {
    const f = path.join(ROOT, `data/by-place/${id}.json`); if (!fs.existsSync(f)) continue
    const d = JSON.parse(fs.readFileSync(f, 'utf8'))
    ;(d.ai_news || []).forEach((a, i) => add(a.url, { place: id, kind: 'news', n: i + 1, label: a.title }))
    ;(d.ai_map || []).forEach((m, i) => { add(m.source_url, { place: id, kind: 'map', n: i + 1, label: m.name }); if (m.url && m.url !== m.source_url) add(m.url, { place: id, kind: 'map-site', n: i + 1, label: m.name }) })
    ;(d.events || []).forEach((e, i) => add(e.url, { place: id, kind: 'event', n: i + 1, label: e.title }))
    ;(d.gravity && d.gravity.sources || []).forEach((s, i) => add(s.url, { place: id, kind: 'gravity', n: i + 1, label: s.title }))
    ;(d.sources || []).forEach((s, i) => add(s.url, { place: id, kind: 'source', n: i + 1, label: s.name }))
}
const index = fs.existsSync(INDEX) ? JSON.parse(fs.readFileSync(INDEX, 'utf8')) : { $schema: '../schemas/provenance-captures.schema.json', about: '', vault: {}, captures: [] }
const have = new Map(index.captures.map(c => [c.url, c]))
const todo = [...want.keys()].filter(u => REFRESH || !have.has(u) || !have.get(u).ok).slice(0, MAX)
console.log(`capture: ${want.size} URLs cited by ${PLACES.join(', ')}; ${todo.length} to capture`)

const { chromium } = require('playwright')
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 1600 }, locale: 'pt-PT', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 PrompTugal.news-capture/1.0 (+https://promptugal.news/query/)' })
const day = new Date().toISOString().slice(0, 10)
let n = 0
for (const url of todo) {
    const page = await context.newPage()
    const rec = { url, host: host(url), captured_at: null, by: AGENT, ok: false, status: null, final_url: null, title: null, note: null, image: null, text: null }
    try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
        await page.waitForLoadState('load', { timeout: 8000 }).catch(() => {})
        await page.waitForTimeout(1500)
        rec.status = resp ? resp.status() : null
        rec.final_url = page.url()
        rec.title = (await page.title()).slice(0, 300)
        const text = (await page.evaluate(() => document.body ? document.body.innerText : '')).slice(0, 60000)
        const challenge = /just a moment|attention required|verify you are human|access denied|cf-chl|captcha/i.test(rec.title + ' ' + text.slice(0, 600))
        const img = await page.screenshot({ type: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1280, height: 1600 } })
        const key = sha(url).slice(0, 12), dir = `captures/${day}/${rec.host}`
        fs.mkdirSync(path.join(VAULT, dir), { recursive: true })
        fs.writeFileSync(path.join(VAULT, dir, `${key}.jpg`), img)
        fs.writeFileSync(path.join(VAULT, dir, `${key}.txt`), `${url}\n${rec.final_url}\n${rec.title}\n\n${text}`)
        rec.captured_at = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
        rec.image = { path: `${dir}/${key}.jpg`, sha256: sha(img), bytes: img.length, width: 1280, height: 1600 }
        const tb = fs.readFileSync(path.join(VAULT, dir, `${key}.txt`))
        rec.text = { path: `${dir}/${key}.txt`, sha256: sha(tb), chars: text.length }
        rec.ok = !challenge && rec.status !== null && rec.status < 400 && text.trim().length > 40
        if (challenge) rec.note = 'a bot challenge or an access page was served; recorded as such, not got round'
        else if (rec.status >= 400) rec.note = `the server answered ${rec.status}`
        else if (text.trim().length <= 40) rec.note = 'the page showed almost no text'
    } catch (e) {
        rec.captured_at = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
        rec.note = `not captured: ${String(e.message).split('\n')[0].slice(0, 160)}`
    }
    await page.close()
    have.set(url, rec); n++
    console.log(`${String(n).padStart(3)} ${rec.ok ? 'ok ' : 'NO '} ${rec.status || '-'} ${url.slice(0, 100)}${rec.note ? `  (${rec.note})` : ''}`)
}
await browser.close()

// the refs are recomputed for every capture of these places (an item may have moved)
for (const [url, c] of have) { const r = want.get(url); if (r) c.cited_by = r }
index.about = 'Captures of the third-party pages that PrompTugal.news\'s place files cite: a screenshot and the visible text of each, hashed, kept in the sgit vault promptugal-captures. Made by data.places@PrompTugal.dinis with board/team/data.places/tools/capture.mjs; shown beside each item by newsroom/build/features/data-places.mjs.'
index.vault = { name: 'promptugal-captures', vault_id: '8pvcgf0m', endpoint: 'https://dev.send.sgraph.ai', access: 'private for now: the read key is held by data.places@ and given to Dinis; whether to publish it is Dinis\'s decision (see board/team/data.places/status.json)' }
index.updated = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
index.captures = [...have.values()].sort((a, b) => a.url.localeCompare(b.url))
fs.mkdirSync(path.dirname(INDEX), { recursive: true })
fs.writeFileSync(INDEX, JSON.stringify(index, null, 2) + '\n')
// the vault's own index, then commit and push
fs.writeFileSync(path.join(VAULT, 'index.json'), JSON.stringify({ about: index.about, updated: index.updated, captures: index.captures.map(({ cited_by, ...c }) => c) }, null, 2) + '\n')
if (PUSH) {
    const sg = a => execFileSync('sgit', a, { cwd: VAULT, stdio: ['ignore', 'pipe', 'pipe'] }).toString()
    try { sg(['commit', '-m', `captures ${day}: ${n} pages for ${PLACES.join(', ')}`]); sg(['push', '--token', process.env.SGIT_TOKEN || 'placeholder-the-proxy-injects-the-credential']); console.log('capture: the vault is committed and pushed') }
    catch (e) { console.log(`capture: the vault push failed: ${String((e.stdout || '') + (e.stderr || '') + e.message).split('\n').filter(l => !/key|token/i.test(l)).slice(0, 3).join(' / ')}`) }
}
console.log(`capture: ${index.captures.filter(c => c.ok).length} of ${index.captures.length} captured in the index ${path.relative(ROOT, INDEX)}`)
