#!/usr/bin/env node
// PrompTugal.news over time (Dinis, 6 November 2026): every hour, screenshots of the front page and the main
// sections of the live site into the vault promptugal-snapshots (images live in vaults, not git), and the index
// board/snapshots.json. Also a side-by-side "then and now" of the front page for the conductor's report.
//   node board/tools/snapshot.mjs [--vault ~/vaults/promptugal-snapshots] [--sheet <out.png>]
// Needs Playwright (pre-installed) and sgit with the vault cloned. Prints no key.
import { createRequire } from 'module'
const { chromium } = createRequire(import.meta.url)('playwright')
import fs from 'fs'; import path from 'path'; import os from 'os'; import { execFileSync } from 'child_process'
const arg = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined }
const VAULT = arg('vault') || path.join(os.homedir(), 'vaults/promptugal-snapshots')
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const INDEX = path.join(ROOT, 'board/snapshots.json')
const PAGES = [['front', '/'], ['articles', '/articles/'], ['companies', '/companies/'], ['people', '/people/'], ['portugal', '/portugal/'], ['graph', '/graph/'], ['newsroom', '/newsroom/']]
const stamp = new Date().toISOString().slice(0, 16).replace(':', '') + 'Z'
const dir = path.join(VAULT, stamp); fs.mkdirSync(dir, { recursive: true })
const b = await chromium.launch(); const shots = []
let version = ''
for (const [name, url] of PAGES) {
  for (const [vp, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    if (vp === 'phone' && name !== 'front') continue
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
    try {
      await p.goto('https://promptugal.news' + url + '?snap=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 })
      if (!version) version = (await p.content()).match(/v0\.\d+\.\d+/)?.[0] || ''
      const f = `${name}-${vp}.jpg`
      await p.screenshot({ path: path.join(dir, f), type: 'jpeg', quality: 70, fullPage: true, clip: undefined })
      shots.push({ page: name, url, viewport: vp, file: `${stamp}/${f}` })
    } catch (e) { shots.push({ page: name, url, viewport: vp, error: String(e.message || e).slice(0, 120) }) }
    await p.close()
  }
}
const idx = fs.existsSync(INDEX) ? JSON.parse(fs.readFileSync(INDEX, 'utf8')) : { about: '', snapshots: [] }
const prev = idx.snapshots.at(-1)
// then and now, front page, side by side (top 1800 px of each)
const sheet = arg('sheet')
if (sheet && prev) {
  const p = await b.newPage({ viewport: { width: 1800, height: 1200 } })
  const img = f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(VAULT, f)).toString('base64')
  const now = shots.find(s => s.page === 'front' && s.viewport === 'desktop' && s.file)
  const then = prev.shots.find(s => s.page === 'front' && s.viewport === 'desktop' && s.file)
  if (now && then && fs.existsSync(path.join(VAULT, then.file))) {
    await p.setContent(`<body style="margin:0;font:600 22px sans-serif;background:#f6f3ec;display:flex;gap:20px;padding:20px">
      ${[['then', prev.stamp, prev.version, then.file], ['now', stamp, version, now.file]].map(([l, s, v, f]) => `<div style="flex:1"><div style="margin-bottom:8px">${l}: ${s} · ${v}</div><div style="height:1100px;overflow:hidden;border:1px solid #999"><img src="${img(f)}" style="width:100%"></div></div>`).join('')}</body>`)
    await p.screenshot({ path: sheet })
  }
}
await b.close()
idx.about = "PrompTugal.news over time: hourly screenshots of the live front page and main sections, in the vault promptugal-snapshots on dev.send.sgraph.ai (images live in vaults, not git, at Dinis's word); read it with the public read key below. Taken by conductor@PrompTugal.dinis with board/tools/snapshot.mjs."
idx.snapshots.push({ stamp, version, shots })
fs.writeFileSync(INDEX, JSON.stringify(idx, null, 1) + '\n')
execFileSync('sgit', ['commit', `snapshot ${stamp} (${version})`], { cwd: VAULT, stdio: 'ignore' })
execFileSync('sgit', ['push'], { cwd: VAULT, stdio: 'ignore' })
console.log(`snapshot ${stamp} (${version}): ${shots.filter(s => s.file).length} screenshots, ${shots.filter(s => s.error).length} errors${sheet && prev ? ', sheet ' + sheet : ''}`)
