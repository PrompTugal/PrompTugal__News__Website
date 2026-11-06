// Loads reading-room.htm in headless Chromium (Playwright), served from the repository root so the site's absolute
// /assets/ paths resolve, and checks that the graph draws with no console error and no request to another host.
//   node board/team/librarian/library/tests/reading-room.check.cjs [--shots DIR] [--assets DIR]
// --assets DIR serves DIR in place of /assets/graph/ (for an explorer that is not on dev yet). The checks that need the explorer's data-driven
// views, presets and type looks (work/dev.graphs, 5d2e3dba) run only when the explorer served has them; the report says which ran.
// Prints a JSON report; exits 1 on a failed check.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../../../../..')
const page_path = '/board/team/librarian/library/reading-room.htm'
const MIME = { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain' }
const overlay = (() => { const i = process.argv.indexOf('--assets'); return i >= 0 ? path.resolve(process.argv[i + 1]) : null })()
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null }

function serve() {
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let f = path.join(root, u)
    if (!f.startsWith(root)) { res.writeHead(403); return res.end() }
    if (overlay && u.startsWith('/assets/graph/')) f = path.join(overlay, u.slice('/assets/graph/'.length))
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
  const explorerSrc = fs.readFileSync(path.join(overlay || path.join(root, 'assets/graph'), 'explorer.js'), 'utf8')
  const driven = /data\.presets/.test(explorerSrc) && /S\.G\.data\.views/.test(explorerSrc) && /typeRules/.test(explorerSrc)
  report.data_driven_explorer = driven
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
      await page.evaluate(() => window.NRGraphExplorer.ready)
      await page.waitForTimeout(900)   // the explorer applies ?preset= just after it is ready
      const st = await page.evaluate(() => window.NRGraphExplorer.state())
      ok(`${tag}: explorer ready`, st && st.nodes > 0, 'no state')
      ok(`${tag}: the graph drew nodes`, st && st.nodes >= 20 && st.edges > 0, JSON.stringify(st && { n: st.nodes, e: st.edges }))
      ok(`${tag}: a canvas is on the page`, (await page.locator('#gx-cy canvas').count()) > 0)
      const horiz = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      ok(`${tag}: no horizontal scroll`, horiz <= 1, `overflow ${horiz}px`)
      const g = JSON.parse(fs.readFileSync(path.join(root, 'board/team/librarian/library/graph/library-graph.json'), 'utf8'))
      // the chips the explorer expects, for the library's own worlds, types and verbs
      const chips = await page.evaluate(() => ({ w: document.querySelectorAll('[data-world]').length, t: document.querySelectorAll('[data-type]').length, v: document.querySelectorAll('[data-verb]').length, sw: document.querySelectorAll('[data-type] .sw').length, n: [...document.querySelectorAll('[data-type] .n')].filter((x) => x.textContent).length }))
      ok(`${tag}: a chip for each world, type and verb`, chips.w === g.worlds.length && chips.t === g.types.length && chips.v === g.verbs.length, JSON.stringify(chips))
      ok(`${tag}: each type chip wears its colour and shows a count`, chips.sw === g.types.length && chips.n > 0, JSON.stringify(chips))
      // where the picture is: the canvas, the doors and the graph menu
      const box = await page.evaluate(() => { const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), h: Math.round(b.height) } }; return { canvas: r('#gx-canvas'), doors: r('.rr-doors'), views: r('.rr-views'), bar: r('.gx-bar'), find: r('.rr-find') } })
      report[`layout ${tag}`] = box
      if (vp.w === 390) {
        const visible = Math.min(box.canvas.bottom, vp.h) - box.canvas.top
        ok('390: the drawn graph is on the first screen', box.canvas.top < vp.h - 200 && visible >= 300, JSON.stringify(box.canvas) + ' visible ' + visible)
        ok('390: the doors and the graph menu are below the canvas', box.doors.top >= box.canvas.bottom && box.views.top >= box.canvas.bottom, JSON.stringify({ doors: box.doors, canvas: box.canvas }))
        ok('390: the explorer bar is below the canvas', box.bar.top >= box.canvas.bottom - 1, JSON.stringify(box.bar))
      } else {
        ok('1280: the doors and the graph menu are beside the head', box.doors.top < box.canvas.top, JSON.stringify(box))
      }
      if (driven) {
        const pm = await page.evaluate(() => [...document.querySelectorAll('#gx-view option')].map((o) => o.value).filter(Boolean))
        ok(`${tag}: the explorer's View menu holds the graph's own presets`, JSON.stringify(pm) === JSON.stringify(g.presets.map((p) => p.key)), JSON.stringify(pm))
        const start = await page.evaluate(() => document.getElementById('gx-view').value)
        if (vp.w === 390) {
          ok('390: the phone opens on the 30-node view', start === 'overview-phone' && st.nodes <= 32 && st.nodes >= 20, JSON.stringify({ start, n: st.nodes }))
          const fs_ = await page.evaluate(() => { const cy = document.getElementById('gx-cy')._cyreg.cy; return Math.round(cy.nodes()[0].numericStyle('font-size') * cy.zoom() * 10) / 10 })
          report['label size on screen (px) 390'] = fs_
          ok('390: labels are legible (at least 9px on screen)', fs_ >= 9, String(fs_))
        } else {
          ok('1280: the desktop opens on the 60 most connected (58 drawn: ties and filters)', start === g.presets[0].key && st.nodes >= 50 && st.nodes <= 60, JSON.stringify({ start, n: st.nodes }))
        }
        const looks = await page.evaluate(() => { const cy = document.getElementById('gx-cy')._cyreg.cy; const seen = {}; cy.nodes().forEach((n) => { seen[n.data('type')] = n.style('shape') + ' ' + n.style('background-color') }); return seen })
        const shapes = new Set(Object.values(looks).map((x) => x.split(' ')[0]))
        ok(`${tag}: types are drawn with their own shape and colour`, Object.keys(looks).length >= 3 && shapes.size >= 3, JSON.stringify(looks))
      }
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
      if (vp.w === 1280 && driven) {
        // the presets by the explorer's own menu, then the reality tree (another file, so the page reloads)
        await page.selectOption('#gx-view', 'who-made-what')
        await page.waitForTimeout(600)
        const s2 = await page.evaluate(() => window.NRGraphExplorer.state())
        ok('preset who-made-what draws agents and collections', s2.nodes >= 20 && s2.edges >= 20, JSON.stringify({ n: s2.nodes, e: s2.edges }))
        const cap = await page.locator('#gx-caption').textContent()
        ok('the preset caption shows', /agent/i.test(cap || ''), cap)
        await page.selectOption('#gx-view', 'guidance')
        await page.waitForTimeout(600)
        const s3 = await page.evaluate(() => window.NRGraphExplorer.state())
        ok('preset guidance draws ideas', s3.nodes >= 50, JSON.stringify({ n: s3.nodes }))
        await page.selectOption('#rr-view', 'reality')
        await page.waitForFunction(() => window.NRGraphExplorer && /data=reality/.test(location.hash) && document.querySelectorAll('[data-type="exists"]').length, null, { timeout: 15000 })
        const s4 = await page.evaluate(() => window.NRGraphExplorer.ready.then((a) => a && a.state()))
        ok('the reality tree loads and draws', s4 && s4.nodes >= 100, JSON.stringify(s4 && { n: s4.nodes }))
        ok('the reality tree is read from reality-tree.json', await page.evaluate(() => document.getElementById('gx').getAttribute('data-data').indexOf('reality-tree.json') >= 0))
        const rp = await page.evaluate(() => document.getElementById('gx-view').value)
        ok('the reality tree opens on its own first preset', rp === 'reality-tree', rp)
        await page.waitForTimeout(400)
      }
      if (shotsDir) {
        fs.mkdirSync(shotsDir, { recursive: true })
        // the library graph at rest, for the shot (the reality tree has its own)
        if (vp.w === 1280) { await page.goto(base + page_path, { waitUntil: 'load' }); await page.waitForFunction(() => window.NRGraphExplorer); await page.evaluate(() => window.NRGraphExplorer.ready); await page.waitForTimeout(500) }
        const f = path.join(shotsDir, `reading-room-${tag}.png`)
        await page.screenshot({ path: f, fullPage: false })
        report.shots.push(f)
        if (vp.w === 1280 && driven) {
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
