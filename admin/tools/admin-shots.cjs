// Screenshots of the control centre's pages at 390 (phone) and 1280 (desktop), full page capped in height, into
// design/shots/feature-admin-<page>-<phone|desktop>.png. Build first (node admin/build/build.mjs). Uses the
// Playwright that is installed on the machine; reports any page wider than the screen.
//   node admin/tools/admin-shots.cjs [--dark]
const { chromium } = require('playwright')
const path = require('path')
const ROOT = path.resolve(__dirname, '..', '..'), out = path.join(ROOT, 'design/shots')
const dark = process.argv.includes('--dark')
const PAGES = [['overview', 'admin/index.html'], ['runs', 'admin/runs/index.html'], ['agents', 'admin/agents/index.html'], ['agent', 'admin/agents/newsroom-dinis.html'],
    ['timeline', 'admin/timeline/index.html'], ['data', 'admin/data/index.html'], ['workflows', 'admin/workflows/index.html'], ['lab', 'admin/lab/index.html'], ['releases', 'admin/versions.html']]
;(async () => {
    const b = await chromium.launch()
    for (const [name, rel] of PAGES) for (const [tag, w, h, cap] of [['phone', 390, 844, 6000], ['desktop', 1280, 900, 5000]]) {
        const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: dark ? 'dark' : 'light' })
        const p = await ctx.newPage()
        await p.goto('file://' + path.join(ROOT, rel), { waitUntil: 'load' })
        await p.evaluate(() => document.fonts.ready)
        await p.waitForTimeout(150)
        const sw = await p.evaluate(() => document.documentElement.scrollWidth)
        if (sw > w) console.log(`  OVERFLOW ${rel} ${tag}: scrollWidth ${sw} > ${w}`)
        const full = await p.evaluate(() => document.documentElement.scrollHeight)
        const file = `feature-admin-${name}-${tag}${dark ? '-dark' : ''}.png`
        await p.screenshot({ path: path.join(out, file), fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(full, cap) } })
        console.log(file, full > cap ? `(first ${cap} of ${full}px)` : `${full}px`)
        await ctx.close()
    }
    await b.close()
})()
