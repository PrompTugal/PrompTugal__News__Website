#!/usr/bin/env node
/* test_onboard_browser.mjs: vault onboarding end to end in Chromium (board/spec-vault-onboarding.md), against the vault
 * mock and a virtual passkey with PRF: a pool vault with a signed pool and licences (made as the sweep does), then a
 * reader draws a key, creates a vault with it, the signed claim lands on the lane, and a mailbox message comes in.
 *   node newsroom/build/build.mjs && node newsroom/build/tests/test_onboard_browser.mjs
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { startMock } from './vault-mock.mjs'
import * as K from '../../../assets/vendor/pki/2026-11-06/keys.js'
import * as O from '../../../assets/onboard/onboard-core.js'
import { mintApiKey, mintLicence, mintPool, mintMessage } from './onboard-fixtures.mjs'

const require = createRequire(import.meta.url)
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
let chromium
try { ({ chromium } = require('playwright')) } catch (e) { console.log('SKIP: playwright is not installed'); process.exit(0) }
if (!fs.existsSync(path.join(ROOT, 'account/vault.html'))) { console.log('FAIL: build the site first (node newsroom/build/build.mjs)'); process.exit(1) }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' }
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
const sha = s => crypto.createHash('sha256').update(s).digest('hex')

console.log('making the issuer and the sweep’s keys (slow: RSA 4096)…')
const issuer = await K.generate('issuer'), other = await K.generate('other'), sweep = await K.generate('sweep')
const ISS = { fingerprint: issuer.bundle.signing_fingerprint, sign: issuer.bundle.sign }
const apiKeys = [mintApiKey(), mintApiKey()]
const licences = await Promise.all(apiKeys.map(k => mintLicence(k, issuer, { access_key: mock.token })))
const lookups = licences.map(l => l.path.replace(/^licences\/|\.json$/g, ''))
const goodPool = await mintPool(issuer, apiKeys), forgedPool = await mintPool(issuer, apiKeys, { signWith: other })
const LANE = 'testlane1', APPEND = crypto.randomBytes(24).toString('hex')
mock.appendCfg.set(LANE, { anchors: new Set([sha(APPEND)]), enumHash: sha('enum') })

const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 } })
await ctx.route('https://dev.send.sgraph.ai/**', async route => {
    const u = new URL(route.request().url())
    await route.fulfill({ response: await route.fetch({ url: mock.baseLocalhost + u.pathname + u.search }) })
})
let claimsConfig = null
await ctx.route('**/assets/obs/claims.json', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(claimsConfig) }))
await ctx.route('**/assets/site.css', route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }))
const newPage = async () => {
    const pg = await ctx.newPage()
    pg.on('pageerror', e => errors.push(`${pg.url()}: ${e.message}`))
    pg.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(`${pg.url()}: ${m.text()}`) })
    return pg
}
// the sweep's side: write one file into the pool vault (opened with its private key and the mock's token)
const poolWrite = (pg, key, folder, name, obj) => pg.evaluate(async ({ token, key, folder, name, obj }) => {
    const NV = await import('/assets/vault/vault-core.js'), V = await import('/assets/vault/vault.js')
    await V.loadLibrary()
    const vault = await NV.openVault(NV.client({ endpoint: 'https://dev.send.sgraph.ai', token }), key)
    await NV.writeFile(vault, folder, name, JSON.stringify(obj)); await NV.publish(vault)
}, { token: mock.token, key, folder, name, obj })

let pg
try {
    pg = await newPage()
    const cdp = await ctx.newCDPSession(pg)
    await cdp.send('WebAuthn.enable')
    await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true, hasPrf: true } })

    // the pool vault, made in the page as the sweep would (a vault with the mock's token), and its public read key
    claimsConfig = { enabled: false }
    await pg.goto(B + 'account/vault.html'); await pg.waitForSelector('#nr-vault-pane:not([hidden])', { timeout: 20000 })
    const pool = await pg.evaluate(async ({ token, good, lic }) => {
        const NV = await import('/assets/vault/vault-core.js'), V = await import('/assets/vault/vault.js'), D = await import('/assets/vault/door.js')
        await V.loadLibrary()
        const sg = NV.client({ endpoint: 'https://dev.send.sgraph.ai', token })
        const vault = await NV.createVault(sg, { name: 'pool' })
        await NV.writeFile(vault, '/pool', 'available.json', JSON.stringify(good))
        for (const l of lic) await NV.writeFile(vault, '/licences', l.path.split('/')[1], JSON.stringify(l.file))
        await NV.publish(vault)
        const key = NV.prefixedKey(vault), i = key.lastIndexOf(':'), pass = key.slice(0, i).replace(/^sgit_private_vault_/, ''), id = key.slice(i + 1)
        return { id, readHex: (await D.sgitKeys(pass, id)).readHex, key }
    }, { token: mock.token, good: goodPool, lic: licences })
    check(!!pool.id && /^[0-9a-f]{64}$/.test(pool.readHex), 'the pool vault is made, with a read key')
    claimsConfig = { enabled: true, endpoint: 'https://dev.send.sgraph.ai', pool: { vault_id: pool.id, read_key: 'sgit_public_read_' + pool.readHex }, claims: { vault_id: LANE, append_token: APPEND },
        issuer: ISS, sweep: { fingerprint: sweep.bundle.fingerprint, encrypt: sweep.bundle.encrypt }, api_key_prefix: 'sgk_' }

    // the reader: a passkey, no vault yet, a pilot key drawn, the vault created
    await pg.goto(B + 'account/vault.html'); await pg.waitForSelector('#nr-vault-make', { timeout: 20000 })
    await pg.click('#nr-vault-make'); await pg.waitForSelector('#nr-vault-made', { timeout: 15000 })
    await pg.click('#nr-vault-enable'); await pg.waitForSelector('#nr-vault-nodoor', { timeout: 30000 })
    await pg.waitForSelector('#nr-vault-pilot-draw', { timeout: 15000 })
    check(true, 'onboarding open: the pilot key button is offered')
    const vaultsBefore = mock.vaults().length
    await poolWrite(pg, pool.key, '/pool', 'available.json', forgedPool)
    await pg.click('#nr-vault-pilot-draw')
    await pg.waitForFunction(() => /not signed by the pinned issuer/.test(document.getElementById('nr-vault-pilot-msg').textContent), null, { timeout: 120000 })
    check(mock.vaults().length === vaultsBefore && (await pg.inputValue('#nr-vault-access')) === '', 'a forged pool is refused, nothing is made')
    await poolWrite(pg, pool.key, '/pool', 'available.json', goodPool)
    await pg.click('#nr-vault-pilot-draw')
    await pg.waitForFunction(() => document.getElementById('nr-vault-access').value.length > 0, null, { timeout: 120000 })
    check(await pg.inputValue('#nr-vault-access') === mock.token, 'the licence’s access key lands in the create field')
    check(mock.vaults().length === vaultsBefore, 'drawing a key creates no vault')
    await pg.click('#nr-vault-create'); await pg.waitForSelector('#nr-vault-recovery-shown', { timeout: 90000 })
    check(mock.vaults().length === vaultsBefore + 4, 'door, master, reader and recovery door are made')
    await pg.waitForSelector('#nr-vault-claimed', { timeout: 30000 })
    const claimedText = await pg.textContent('#nr-vault-claimed')
    const lane = [...mock.lanes].find(([k]) => k === `${LANE}/${APPEND}`)
    check(!!lane && lane[1].pending.size === 1, 'one claim is on the lane')
    const payload = [...lane[1].pending.values()][0].payload
    const enc = Buffer.from(payload, 'base64').toString('utf8')
    const first = await K.unseal(sweep.private.encrypt, enc)
    const claim = JSON.parse(first.text)
    const checked = await K.unseal(sweep.private.encrypt, enc, [{ signing_fingerprint: first.signer, sign: claim.reader.sign_pub }])
    check(checked.verified === true, 'the sweep opens it, and the reader’s signature checks')
    check(lookups.includes(claim.lookup) && /^[0-9a-f]{32}$/.test(claim.mailbox) && claim.door_mode === 'passkey-prf', 'it names a pool lookup, a mailbox and the door mode')
    check(!first.text.includes('sgk_') && !first.text.includes(mock.token), 'it carries no API key and no access key')
    check(/posted/.test(claimedText), 'the pane says the claim was posted')

    // the mailbox: a message for this reader is found when the vault is opened again, once
    const readerBundle = { v: 1, encrypt: claim.reader.encrypt_pub, sign: claim.reader.sign_pub, label: '', fingerprint: '', signing_fingerprint: '' }
    await poolWrite(pg, pool.key, `/mailbox/${claim.mailbox}`, '1.json', await mintMessage(issuer, { bundle: readerBundle }, 1))
    await pg.goto(B + 'account/vault.html'); await pg.waitForSelector('#nr-vault-enable', { timeout: 20000 })
    await pg.evaluate(() => { window.__mail = []; window.addEventListener('pt:mailbox', e => window.__mail.push(e.detail)) })
    await pg.click('#nr-vault-enable')
    await pg.waitForFunction(() => window.__mail.length > 0, null, { timeout: 90000 })
    const mail = await pg.evaluate(() => window.__mail[0])
    check(mail.length === 1 && mail[0].kind === 'welcome' && mail[0].n === 1, 'the issuer’s message is found, opened and checked')
    await pg.goto(B + 'account/vault.html'); await pg.waitForSelector('#nr-vault-enable', { timeout: 20000 })
    await pg.evaluate(() => { window.__mail = []; window.addEventListener('pt:mailbox', e => window.__mail.push(e.detail)) })
    await pg.click('#nr-vault-enable'); await pg.waitForSelector('#nr-vault-pane:not([hidden])'); await pg.waitForTimeout(8000)
    check((await pg.evaluate(() => window.__mail.length)) === 0, 'the same message is not delivered twice')
} catch (e) {
    console.log('FAIL: ' + (e && e.stack || e)); failed++
    try { console.log('pilot message: ' + await pg.textContent('#nr-vault-pilot-msg', { timeout: 2000 })) } catch (x) { /* none */ }
}
if (errors.length) { console.log('page errors:'); for (const e of errors.slice(0, 8)) console.log('  ' + e); failed++ }
await browser.close(); server.close(); mock.server.close()
console.log(failed ? `\n${failed} FAILED` : '\nALL ONBOARDING BROWSER CHECKS PASS')
process.exit(failed ? 1 : 0)
