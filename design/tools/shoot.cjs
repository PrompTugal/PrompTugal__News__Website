// Screenshots of every mockup: 390x844 (phone) and 1280 wide (desktop), full page, capped in height.
//   node design/tools/shoot.cjs [name.html ...] [--dark]
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path')
const dir = path.resolve(__dirname, '..', 'mockups'), out = path.resolve(__dirname, '..', 'shots')
const args = process.argv.slice(2), dark = args.includes('--dark')
const files = args.filter(a => a.endsWith('.html')).length ? args.filter(a => a.endsWith('.html')) : fs.readdirSync(dir).filter(f => f.endsWith('.html'))
;(async () => {
    const b = await chromium.launch()
    for (const f of files) for (const [tag, w, h, cap] of [['phone', 390, 844, 5200], ['desktop', 1280, 900, 4200]]) {
        const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: dark ? 'dark' : 'light' })
        const p = await ctx.newPage()
        await p.goto('file://' + path.join(dir, f), { waitUntil: 'networkidle' })
        await p.evaluate(() => document.fonts.ready)
        await p.waitForTimeout(250)
        const sw = await p.evaluate(() => document.documentElement.scrollWidth)
        if (sw > w) console.log(`  OVERFLOW ${f} ${tag}: scrollWidth ${sw} > ${w}`)
        const fixedPane = ['chat.html', 'vault.html'].includes(f)
        const full = fixedPane ? h : await p.evaluate(() => document.documentElement.scrollHeight)
        const name = f.replace(/\.html$/, '') + '-' + tag + (dark ? '-dark' : '') + '.png'
        await p.screenshot({ path: path.join(out, name), fullPage: !fixedPane, clip: { x: 0, y: 0, width: w, height: Math.min(full, cap) } })
        console.log(name, full > cap ? `(first ${cap} of ${full}px)` : `${full}px`)
        await ctx.close()
    }
    await b.close()
})()
