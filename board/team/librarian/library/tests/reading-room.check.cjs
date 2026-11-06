// Loads reading-room.htm in headless Chromium (Playwright), served from the repository root so the site's absolute
// /assets/ paths resolve, and checks that the graph draws with no console error and no request to another host.
//   node board/team/librarian/library/tests/reading-room.check.cjs [--shots DIR] [--json]
// Prints a JSON report; exits 1 on a failed check.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../../../../..')
const page_path = '/board/team/librarian/library/reading-room.htm'
const MIME = { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain' }
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null }

function serve() {
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let f = path.join(root, u)
    if (!f.startsWith(root)) { res.writeHead(403); return res.end() }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html')
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found') }
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
    fs.createReadStream(f).pipe(res)
  })
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok(srv)))
}

async function run() {
  const { chromium } = require('playwright')
  const srv = await serve()
  const base = `http://127.0.0.1:${srv.address().port}`
  const browser = await chromium.launch()
  const report = { checks: {}, errors: [], external: [], shots: [] }
  const ok = (k, v, why) => { report.checks[k] = !!v; if (!v) report.errors.push(`${k}: ${why || 'failed'}`) }
  const shotsDir = arg('--shots')
  try {
    for (const vp of [{ w: 390, h: 844 }, { w: 1280, h: 800 }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 })
      const page = await ctx.newPage()
      const consoleErrors = []
      page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
      page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message))
      page.on('request', (r) => { if (!r.url().startsWith(base) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) report.external.push(r.url()) })
      const tag = `${vp.w}x${vp.h}`
      await page.goto(base + page_path, { waitUntil: 'load' })
      await page.waitForFunction(() => window.NRGraphExplorer, null, { timeout: 15000 })
      const st = await page.evaluate(() => window.NRGraphExplorer.ready.then((a) => a && a.state()))
      ok(`${tag}: explorer ready`, st && st.nodes > 0, 'no state')
      ok(`${tag}: the graph drew nodes`, st && st.nodes >= 30 && st.edges > 0, JSON.stringify(st && { n: st.nodes, e: st.edges }))
      ok(`${tag}: a canvas is on the page`, (await page.locator('#gx-cy canvas').count()) > 0)
      const horiz = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      ok(`${tag}: no horizontal scroll`, horiz <= 1, `overflow ${horiz}px`)
      // search: a card is found and its source is the link
      await page.fill('#rr-q', 'ideas ledger')
      const n = await page.locator('#rr-results li').count()
      ok(`${tag}: search finds cards`, n > 0, `${n} results`)
      const href = await page.locator('#rr-results li a').first().getAttribute('href')
      ok(`${tag}: a result links to a source file`, /^\/[A-Za-z0-9_./-]+/.test(href || ''), String(href))
      // a title is never markup: the search shows text only
      const markup = await page.evaluate(() => document.querySelectorAll('#rr-results li a *').length)
      ok(`${tag}: result titles are text`, markup === 0)
      await page.fill('#rr-q', '')
      if (vp.w === 1280) {
        // the presets: who made what, then the reality tree (another file, so the page reloads)
        await page.selectOption('#rr-view', 'who-made-what')
        await page.waitForTimeout(600)
        const s2 = await page.evaluate(() => window.NRGraphExplorer.state())
        ok('preset who-made-what draws agents and collections', s2.nodes >= 20 && s2.edges >= 20, JSON.stringify({ n: s2.nodes, e: s2.edges }))
        const cap = await page.locator('#gx-caption').textContent()
        ok('the preset caption shows', /agent/i.test(cap || ''), cap)
        await page.selectOption('#rr-view', 'guidance')
        await page.waitForTimeout(600)
        const s3 = await page.evaluate(() => window.NRGraphExplorer.state())
        ok('preset guidance draws ideas', s3.nodes >= 50, JSON.stringify({ n: s3.nodes }))
        await page.selectOption('#rr-view', 'reality-tree')
        await page.waitForFunction(() => window.NRGraphExplorer && /data=reality/.test(location.hash), null, { timeout: 15000 })
        const s4 = await page.evaluate(() => window.NRGraphExplorer.ready.then((a) => a && a.state()))
        ok('the reality tree loads and draws', s4 && s4.nodes >= 100, JSON.stringify(s4 && { n: s4.nodes }))
        ok('the reality tree is read from reality-tree.json', await page.evaluate(() => document.getElementById('gx').getAttribute('data-data').indexOf('reality-tree.json') >= 0))
        await page.waitForTimeout(400)
      }
      if (shotsDir) {
        fs.mkdirSync(shotsDir, { recursive: true })
        // the library graph at rest, for the shot (the reality tree has its own)
        if (vp.w === 1280) { await page.goto(base + page_path, { waitUntil: 'load' }); await page.waitForFunction(() => window.NRGraphExplorer); await page.evaluate(() => window.NRGraphExplorer.ready); await page.waitForTimeout(500) }
        const f = path.join(shotsDir, `reading-room-${tag}.png`)
        await page.screenshot({ path: f, fullPage: false })
        report.shots.push(f)
        if (vp.w === 1280) {
          await page.evaluate(() => window.NRGraphExplorer.preset({ key: 'collections' }))
          await page.waitForTimeout(700)
          const f2 = path.join(shotsDir, `reading-room-1280x800-collections.png`)
          await page.locator('#gx').scrollIntoViewIfNeeded()
          await page.screenshot({ path: f2, fullPage: false })
          report.shots.push(f2)
        }
      }
      ok(`${tag}: no console error`, consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
      await ctx.close()
    }
    ok('no request to another host', report.external.length === 0, report.external.slice(0, 3).join(' '))
  } finally { await browser.close(); srv.close() }
  return report
}

run().then((r) => { console.log(JSON.stringify(r, null, 1)); process.exit(r.errors.length ? 1 : 0) }).catch((e) => { console.error(e); process.exit(1) })
