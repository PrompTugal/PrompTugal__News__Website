#!/usr/bin/env node
/* test_billing_browser.mjs: the reading meter, the account, the top-up and the vault pane in Chromium, on the built site.
 *
 *   node newsroom/build/build.mjs && node newsroom/build/tests/test_billing_browser.mjs
 *
 * Serves the repository root on http://localhost:<port>/ (as GitHub Pages serves it) and drives the site as a reader:
 *   - an article: the chip in the top bar, a tenth charged on opening, the balance going down as the page is read
 *     (slowly: scrolling alone is not reading), the line at its foot, a rating that re-prices;
 *   - a company page, priced as its type and freshness; the account page (balance, history, receipts, export);
 *   - the top-up page, with the real payment link (never followed) and what happens after paying; the return page,
 *     once per reference, and the paste box for a return to newsroom.sgit.ai;
 *   - the vault pane: locked; with a virtual passkey (Chromium's WebAuthn with the PRF extension) no vault yet, and
 *     "Create your vault" without an access key shows what is missing and creates nothing; with the mock's key, the
 *     vaults are made, the recovery code shown, the vault updated, a feature's item saved through window.__vault;
 *     then a second browser opens the vault with the recovery code and the first browser's reading comes in.
 * The vault server is newsroom/build/tests/vault-mock.mjs, in place of https://dev.send.sgraph.ai (requests to it are
 * routed to the mock), so no real vault is made. The payment link is checked, never opened.
 * Screenshots at 390 and 1280 wide go to design/shots/feature-billing-*.png, with the designer's stylesheet
 * (design/site.css) dropped in for assets/site.css, as the site will look once the restyle is merged.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { startMock } from './vault-mock.mjs'

const require = createRequire(import.meta.url)
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
const SHOTS = path.join(ROOT, 'design/shots')
let chromium
try { ({ chromium } = require('playwright')) } catch (e) { console.log('SKIP: playwright is not installed'); process.exit(0) }
if (!fs.existsSync(path.join(ROOT, 'account/index.html'))) { console.log('FAIL: build the site first (node newsroom/build/build.mjs)'); process.exit(1) }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.tpl': 'text/plain', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.md': 'text/markdown', '.png': 'image/png' }
const server = http.createServer((req, res) => {
    let p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (p.startsWith(ROOT) && fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html')
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return }
    res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' })
    fs.createReadStream(p).pipe(res)
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const B = `http://localhost:${server.address().port}/`
const mock = await startMock()
const browser = await chromium.launch()

let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
const errors = []
const KEY = 'web-summit.newsroom.meter.v1'
const ARTICLE = 'articles/newsroom-status-four-days-out.html'
const COMPANY = 'companies/replit/index.html'

/** A browser: the vault server routed to the mock, the designer's stylesheet dropped in. */
async function newBrowser(width) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 1 })
    await ctx.route('https://dev.send.sgraph.ai/**', async route => {
        const u = new URL(route.request().url())
        const r = await route.fetch({ url: mock.baseLocalhost + u.pathname + u.search })
        await route.fulfill({ response: r })
    })
    await ctx.route('**/assets/site.css', route => route.fulfill({ status: 200, contentType: 'text/css', body: '@import url("../design/site.css");\n' }))
    await ctx.route('https://buy.stripe.com/**', route => { errors.push('the payment link was requested: ' + route.request().url()); route.abort() })
    return ctx
}
async function newPage(ctx) {
    const pg = await ctx.newPage()
    pg.on('pageerror', e => errors.push(`${pg.url()}: ${e.message}`))
    pg.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(`${pg.url()}: ${m.text()}`) })
    return pg
}
const state = pg => pg.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), KEY)
const ready = pg => pg.waitForFunction(() => window.__meter && window.__meter.meter, null, { timeout: 15000 })
const shot = async (pg, name, full = false) => { await pg.mouse.move(1, 1); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(200); await pg.screenshot({ path: path.join(SHOTS, name), fullPage: full }) }
async function readSlowly(pg) {
    for (let i = 0; i < 150; i++) {
        const done = await pg.evaluate(() => { window.scrollBy(0, Math.round(window.innerHeight * 0.3)); return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4 })
        await pg.waitForTimeout(1600)
        if (done) break
    }
    await pg.waitForTimeout(2500)
}
async function virtualPasskey(ctx, pg) {
    try {
        const cdp = await ctx.newCDPSession(pg)
        await cdp.send('WebAuthn.enable')
        await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true, hasPrf: true } })
        return true
    } catch (e) { console.log(`     no virtual passkey with PRF in this Chromium (${e.message}); the passkey steps are skipped`); return false }
}
const noSideways = async (pg, what) => { const w = await pg.evaluate(() => document.documentElement.scrollWidth); check(w <= 390, `no sideways scroll at 390px: ${what} (${w})`) }

try {
    // ------------------------------------------------------------ desktop, device A
    const A = await newBrowser(1280)
    const pg = await newPage(A)
    await pg.goto(B + ARTICLE); await ready(pg)
    let s = await state(pg)
    const e0 = s.log[0]
    check(e0 && e0.kind.startsWith('article_') && Math.abs(e0.cost - e0.price * 0.1) < 0.01, `opening the article charges a tenth of its price (${e0 && e0.kind}, ${e0 && e0.cost}p of ${e0 && e0.price}p)`)
    const chip = await pg.textContent('#nr-tools #nr-meter-chip')
    check(/^£4\.\d\d/.test(chip) && chip.includes('credit'), `the chip in the top bar shows the balance (${chip.trim()})`)
    check((await pg.getAttribute('#nr-vault-btn', 'hidden')) !== null, 'the Vault button is hidden when signed out')
    await readSlowly(pg)
    s = await state(pg)
    check(s.log[0].depth > 0.5 && s.log[0].cost > e0.cost && s.balance < 500 - e0.cost, `reading the page, slowly, charges the share read (${Math.round(s.log[0].depth * 100)}%, ${s.log[0].cost}p, balance ${s.balance})`)
    const line = await pg.textContent('#nr-meter-line')
    check(/This page/.test(line) && /Balance/.test(line), 'the line at the foot of the page says what it cost and the balance')
    await pg.click('#nr-meter-line summary')
    const before = (await state(pg)).log[0].cost
    await pg.click('#nr-meter-line .nr-scale button:nth-child(5)'); await pg.waitForTimeout(300)
    s = await state(pg)
    check(Math.abs(s.log[0].cost - before * 2) < 0.11 && s.log[0].rating.useful === 5, `rated excellent, it costs double (${before}p to ${s.log[0].cost}p)`)
    await pg.click('#nr-meter-line .nr-scale button:nth-child(3)'); await pg.waitForTimeout(300)
    await pg.locator('#nr-meter-line').scrollIntoViewIfNeeded()
    await shot(pg, 'feature-billing-article-1280.png')
    // a company page
    await pg.goto(B + COMPANY); await ready(pg)
    s = await state(pg)
    check(s.log[0].kind.startsWith('company') && s.log.length === 2, `a company page is priced as a company (${s.log[0].kind}, ${s.log[0].price}p)`)
    await pg.click('#nr-meter-line summary')
    check(!(await pg.isVisible('#nr-meter-line .nr-reasons')), 'the reasons for not paying stay folded until asked for')
    await pg.click('#nr-meter-line .nr-decline')
    await pg.click('#nr-meter-line .nr-reasons button:nth-of-type(2)'); await pg.waitForTimeout(300)
    s = await state(pg)
    check(s.log[0].declined && s.log[0].declined.reason === 'not-relevant' && s.log[0].cost === 0 && /Not charged/.test(await pg.textContent('#nr-meter-line')), 'declining a page refunds it, keeps the reason, and says so')
    // the account
    await pg.goto(B + 'account/index.html'); await ready(pg)
    s = await state(pg)
    const rows = await pg.locator('#nr-account table.ledger tbody tr').count()
    check(rows === 2 && s.log.length === 2, 'the account lists both pages read, and the account page itself is free')
    check((await pg.textContent('#nr-balance')) === `£${(s.balance / 100).toFixed(2)}`, `the balance card shows the balance (${await pg.textContent('#nr-balance')})`)
    const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('#nr-export')])
    const exported = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'))
    check(exported.log.length === 2 && exported.balance === s.balance, 'Export as JSON downloads the whole account')
    await pg.evaluate(() => window.scrollTo(0, 0))
    await shot(pg, 'feature-billing-account-1280.png')
    // the top-up
    await pg.goto(B + 'account/top-up.html'); await ready(pg)
    const href = await pg.getAttribute('#nr-pay', 'href')
    check(href === 'https://buy.stripe.com/6oUfZ9ez65vVgU2fY15os04?client_reference_id=web-summit-newsroom', `the top-up button is the live payment link, with this site's reference (${href})`)
    const tbody = await pg.textContent('main')
    check(/newsroom\.sgit\.ai/.test(tbody) && /paste/i.test(tbody), 'the page says plainly that Stripe returns to newsroom.sgit.ai for now, and how to add the credit here')
    await shot(pg, 'feature-billing-topup-1280.png')
    // the return page, once per reference
    const bal0 = (await state(pg)).balance
    await pg.goto(B + 'account/topped-up.html?session_id=cs_test_playwright'); await ready(pg); await pg.waitForTimeout(300)
    await pg.reload(); await ready(pg); await pg.waitForTimeout(300)
    s = await state(pg)
    check(Math.abs(s.balance - (bal0 + 500)) < 0.01 && s.topups.length === 1 && /Already added/.test(await pg.textContent('#nr-topped')), 'the return page adds £5.00 once per payment reference')
    await pg.goto(B + 'account/topped-up.html'); await ready(pg)
    await pg.fill('#nr-paste', 'https://newsroom.sgit.ai/account/topped-up.html?session_id=cs_test_pasted')
    await pg.click('#nr-paste-add'); await pg.waitForTimeout(300)
    s = await state(pg)
    check(s.topups.length === 2 && s.topups[0].ref === 'cs_test_pasted', 'pasting the address Stripe returned to on newsroom.sgit.ai adds the credit here, once')
    // the vault pane
    await pg.goto(B + 'account/vault.html'); await ready(pg)   // the pane lives on the vault page only (PT decision, option B)
    await pg.waitForSelector('#nr-vault-pane:not([hidden]) #nr-vault-enable')
    check(await pg.isVisible('#nr-pane #nr-vault-pane') && (await pg.getAttribute('#nr-vault-btn', 'hidden')) === null, 'the vault page opens the pane in #nr-pane')
    check((await pg.textContent('#nr-vault-sec-vault')).includes('not issued yet'), 'the locked pane says the access key is not issued yet')
    await shot(pg, 'feature-billing-vault-1280.png')
    let code = null
    if (await virtualPasskey(A, pg)) {
        await pg.click('#nr-vault-make'); await pg.waitForSelector('#nr-vault-made', { timeout: 15000 })
        await pg.click('#nr-vault-enable'); await pg.waitForSelector('#nr-vault-nodoor', { timeout: 30000 })
        check(true, 'a passkey with PRF signs in, and no vault answers to it yet')
        const vaultsBefore = mock.vaults().length
        await pg.click('#nr-vault-create'); await pg.waitForSelector('#nr-vault-missing')
        const miss = await pg.textContent('#nr-vault-missing')
        check(/What is missing: a vault access key/.test(miss) && /Where it will come from/.test(miss) && /Dinis Cruz/.test(miss) && mock.vaults().length === vaultsBefore, 'Create without an access key says what is missing and where it will come from, and creates nothing')
        await shot(pg, 'feature-billing-vault-missing-key-1280.png')
        await pg.fill('#nr-vault-access', mock.token)
        await pg.click('#nr-vault-create'); await pg.waitForSelector('#nr-vault-recovery-shown', { timeout: 60000 })
        code = (await pg.textContent('#nr-vault-recovery-shown .nr-mono')).trim()
        check(/^[A-Z2-7]{4}(-[A-Z2-7]{1,4}){6}$/.test(code) && mock.vaults().length === vaultsBefore + 4, 'with the key: door, master, reader and recovery door made, the recovery code shown once')
        // the recovery code must be typed back (its last four characters) before it is hidden (PT decision, condition 3)
        await pg.fill('#nr-vault-recovery-tail', 'ZZZZ'); await pg.click('#nr-vault-recovery-done')
        check(/does not match/.test(await pg.textContent('#nr-vault-recovery-shown')) && (await pg.textContent('#nr-vault-recovery-shown')).includes(code), 'a wrong tail keeps the code')
        await pg.fill('#nr-vault-recovery-tail', code.replace(/-/g, '').slice(-4).toLowerCase()); await pg.click('#nr-vault-recovery-done')
        check(!(await pg.textContent('#nr-vault-recovery-shown')).includes(code) && /confirmed/i.test(await pg.textContent('#nr-vault-recovery-shown')), 'the right tail hides the code')
        await pg.click('#nr-vault-sync'); await pg.waitForSelector('#nr-vault-synced', { timeout: 60000 })
        const nReads = (await state(pg)).log.length
        check(new RegExp(`^Updated: ${nReads} read\\(s\\), 2 top-up\\(s\\)`).test(await pg.textContent('#nr-vault-synced')), `Update the vault writes this device's ${nReads} reads and 2 top-ups`)
        check(!(await pg.isVisible('#nr-vault-bring')) && /nothing: the vault has everything/.test(await pg.textContent('#nr-vault-pending-row')), 'after the update nothing is left only in this browser, and nothing waits to be brought in')
        const saved = await pg.evaluate(() => window.__vault.save('chat/conversations/playwright', { messages: [{ role: 'user', text: 'Who speaks about agents on Tuesday?' }] }))
        check(saved.where === 'vault' && saved.path === 'chat/conversations/playwright', 'window.__vault.save writes a feature\'s item into the open vault')
        check((await pg.evaluate(() => window.__vault.list('chat/'))).some(x => x.path === 'chat/conversations/playwright' && x.where === 'both'), 'window.__vault.list sees it in the vault and in this browser')
        const leaked = await pg.evaluate(t => Object.keys(localStorage).some(k => (localStorage.getItem(k) || '').includes(t)), mock.token)
        check(!leaked, 'the access key is never in localStorage')
        await pg.click('#nr-vault-tab-vault'); await pg.waitForTimeout(400)
        await shot(pg, 'feature-billing-vault-open-1280.png')
    }
    const readsA = (await state(pg)).log.length

    // ------------------------------------------------------------ another device: open with the recovery code
    if (code) {
        const Bx = await newBrowser(1280)
        const p2 = await newPage(Bx)
        await p2.goto(B + 'account/vault.html'); await ready(p2)
        await p2.waitForSelector('#nr-vault-pane:not([hidden]) #nr-vault-recover')
        check(true, 'the vault page opens the pane on arrival')
        await p2.click('#nr-vault-recover'); await p2.fill('#nr-vault-code', code)
        await p2.click('#nr-vault-join')   // no reload any more: the keys are in this page's memory only (PT decision, option B)
        await p2.waitForSelector('#nr-vault-merged', { timeout: 30000 })
        const s2 = await state(p2)
        check(s2.log.filter(e => e.device).length === readsA && s2.topups.length === 2, `on the other device the vault brings in the first device's ${readsA} reads and 2 top-ups`)
        const item = await p2.evaluate(() => window.__vault.load('chat/conversations/playwright'))
        check(item && item.messages[0].text === 'Who speaks about agents on Tuesday?', 'window.__vault.load reads the feature\'s item on the other device')
        await Bx.close()
    }
    await A.close()

    // ------------------------------------------------------------ phone
    const M = await newBrowser(390)
    const m = await newPage(M)
    await m.goto(B + ARTICLE); await ready(m)
    await readSlowly(m)
    await m.locator('#nr-meter-line').scrollIntoViewIfNeeded()
    await noSideways(m, ARTICLE)
    await shot(m, 'feature-billing-article-390.png')
    for (const [u, name] of [['account/index.html', 'account'], ['account/top-up.html', 'topup']]) {
        await m.goto(B + u); await ready(m)
        await noSideways(m, u)
        await shot(m, `feature-billing-${name}-390.png`)
    }
    await m.goto(B + 'account/topped-up.html'); await ready(m); await noSideways(m, 'account/topped-up.html')
    await m.goto(B + 'account/billing.html'); await ready(m); await noSideways(m, 'account/billing.html')
    await m.goto(B + 'account/vault.html'); await ready(m)
    await m.waitForSelector('#nr-vault-pane:not([hidden]) #nr-vault-enable')
    await noSideways(m, 'account/vault.html with the pane open')
    await shot(m, 'feature-billing-vault-390.png')
    if (await virtualPasskey(M, m)) {
        await m.click('#nr-vault-make'); await m.waitForSelector('#nr-vault-made', { timeout: 15000 })
        await m.click('#nr-vault-enable'); await m.waitForSelector('#nr-vault-nodoor', { timeout: 30000 })
        await m.click('#nr-vault-create'); await m.waitForSelector('#nr-vault-missing')
        await m.locator('#nr-vault-missing').scrollIntoViewIfNeeded()
        await shot(m, 'feature-billing-vault-missing-key-390.png')
    }
    await M.close()
    check(errors.length === 0, `no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`)
} finally {
    await browser.close()
    await mock.close()
    server.close()
}
console.log(failed ? `${failed} FAILED` : 'ALL BILLING BROWSER CHECKS PASS')
process.exit(failed ? 1 : 0)
