#!/usr/bin/env node
/* test_vault.mjs: real vaults from this site's vault code, against a mock of the vault API.
 *
 *   node admin/build/tests/test_vault.mjs
 *
 * Ported from newsroom.sgit.ai's admin/build/test_vault.mjs. Loads the vendored library the way the page does
 * (vm.runInThisContext, one realm, in VENDOR.md's order), the local extension, then assets/vault/vault-core.js,
 * door.js and sync.js, and against admin/build/tests/vault-mock.mjs (which behaves as dev.send.sgraph.ai does):
 *   - the vendored files hash to what the two VENDOR.md files record;
 *   - the door derivation is this site's own: the same bytes give a different door here than on newsroom.sgit.ai;
 *   - a door, a master and a reader vault are created from derived bytes; creating needs the access token (a write
 *     without it is refused by the server, so the pane's "missing key" path is the real one);
 *   - unlocked again from the same bytes on another device; an unknown door address is ENOVAULT, not an error;
 *   - two devices write their own files (sync.js extract) and the consolidated view adds them up with one starting
 *     credit; mergeInto brings the other device's reads and top-ups into a browser and recomputes its balance;
 *   - a feature's item (window.__vault.save) lands at apps/<path>.json and reads back on the other device;
 *   - a recovery door opens the same master.
 * No key, token, PRF byte or recovery code is printed: test keys are made per run and discarded.
 */
import vm from 'node:vm'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { startMock } from './vault-mock.mjs'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
const VENDOR = path.join(ROOT, 'assets/vendor/sg-vault/v0.2.3')
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const rowsOf = f => [...fs.readFileSync(f, 'utf8').matchAll(/\| `([^`]+)` \| `([0-9a-f]{64})` \|/g)].map(m => [m[1], m[2]])

// --- the library, as the page loads it -----------------------------------------------------------------------
const ORDER = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js',
    'sg-vault/sg-vault-ref-manager.js', 'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js',
    'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js', 'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js']
const inner = Object.fromEntries(rowsOf(path.join(VENDOR, 'VENDOR.md')))
check(ORDER.every(f => inner[f] === sha(path.join(VENDOR, f))), 'the twelve vendored library files hash to what v0.2.3/VENDOR.md records')
check(rowsOf(path.join(ROOT, 'assets/vendor/sg-vault/VENDOR.md')).every(([f, h]) => sha(path.join(ROOT, 'assets/vendor/sg-vault', f)) === h), 'the local extension and the inner VENDOR.md hash to what VENDOR.md records')
const page = fs.readFileSync(path.join(ROOT, 'assets/vault/vault.js'), 'utf8')
check(ORDER.every(f => page.includes(`'${f}'`)) && page.includes('sg-vault--create-with-id.js'), 'the pane loads the same thirteen files')
for (const f of ORDER) vm.runInThisContext(fs.readFileSync(path.join(VENDOR, f), 'utf8'), { filename: f })
vm.runInThisContext(fs.readFileSync(path.join(ROOT, 'assets/vendor/sg-vault/local/sg-vault--create-with-id.js'), 'utf8'), { filename: 'sg-vault--create-with-id.js' })
vm.runInThisContext('globalThis.SGSend = SGSend; globalThis.SGVault = SGVault; globalThis.SGVaultCrypto = SGVaultCrypto; globalThis.SGSendCrypto = SGSendCrypto')
const imp = p => import(pathToFileURL(path.join(ROOT, p)).href)
const nv = await imp('assets/vault/vault-core.js')
const door = await imp('assets/vault/door.js')
const S = await imp('assets/vault/sync.js')
check(typeof SGVault.createWithId === 'function' && typeof nv.createAccount === 'function', 'the library, the local extension and vault-core.js load in one realm')

// --- this site's door is its own ---------------------------------------------------------------------------------
const prf = crypto.getRandomValues(new Uint8Array(32))
const d1 = await door.doorFrom(prf)
const seedRef = await door.hkdf(prf, await door.sha256('newsroom.sgit.ai'), 'sgit/door/v1', 32)
const passRef = door.hex(await door.hkdf(seedRef, new Uint8Array(0), 'sgit/door/v1/passphrase', 32))
check(d1.passphrase !== passRef && door.PRF_INPUT_TEXT === 'web-summit.newsroom.sgit.ai/door/v1', 'the same passkey bytes derive a different door here than on newsroom.sgit.ai, and the PRF input names this site')
check(/^[0-9a-f]{64}$/.test(d1.passphrase) && /^[a-z0-9]{8}$/.test(d1.vaultId) && JSON.stringify(await door.doorFrom(prf)) === JSON.stringify(d1), 'the door is deterministic: 64 hex of passphrase and an 8-character id')

// --- the mock ------------------------------------------------------------------------------------------------------
const mock = await startMock()
try {
    // A. creating needs the access token
    let refused = null
    try { await nv.createAccount({ sgSend: nv.client({ endpoint: mock.base, token: '' }), door: d1, cloneBranch: 'wsn-x' }) } catch (e) { refused = e }
    check(refused && mock.vaults().length <= 2 && !mock.vaults().includes(d1.vaultId), 'without an access token the server refuses to create the vaults (and no door is made)')

    // B. the account
    const sg = nv.client({ endpoint: mock.base, token: mock.token })
    const d1b = await door.doorFrom(prf)
    const acct = await nv.createAccount({ sgSend: sg, door: d1b, record: { kind: 'passkey', path: 'platform', credential_id: 'cred-1', device: 'laptop' }, cloneBranch: 'wsn-dev1' })
    await nv.writeFile(acct.master, '/.vault', 'access-token.json', JSON.stringify({ token: mock.token })); await nv.publish(acct.master)
    await nv.writeFile(acct.reader, '/activity', 'account.json', JSON.stringify(S.accountFile({ start: 500, symbol: '£' }, 'wsn-dev1'))); await nv.publish(acct.reader)
    check(mock.vaults().includes(d1b.vaultId) && acct.master.vaultId !== acct.reader.vaultId, 'a door at its derived id, a master and a reader vault exist on the server')
    check((await nv.readText(acct.reader, '/README.md') || '').includes('web-summit.newsroom.sgit.ai'), 'the reader vault says which site made it')

    // C. unknown door
    let code = null
    try { await nv.openVault(sg, nv.vaultKeyString((await door.doorFrom(crypto.getRandomValues(new Uint8Array(32)))).passphrase, 'zzzzzzzz'), { cloneBranch: 'wsn-dev2' }) } catch (e) { code = e.code }
    check(code === 'ENOVAULT', 'an unknown door is ENOVAULT: the pane offers to create the vault')

    // D. device one writes its file and a saved item
    const now = new Date().toISOString()
    const state1 = { created: now, balance: 491, spent: 9, reads: 2, declined: 0, log: [
        { id: 'r1', at: now, path: '/articles/a.html', title: 'A', kind: 'article_fresh', price: 12, depth: 0.5, cost: 6, persona: 'me' },
        { id: 'r2', at: now, path: '/companies/replit/', title: 'Replit', kind: 'company_new', price: 5, depth: 0.6, cost: 3, persona: 'me', rating: { useful: 3 } }],
        topups: [], sessions: [], active: 'me', personas: [{ id: 'me', name: '', on: [], off: [] }] }
    const f1 = S.extract(state1, { id: 'wsn-dev1', label: 'laptop' })
    await nv.writeFile(acct.reader, S.PATHS.devicesFolder, 'wsn-dev1.json', JSON.stringify(f1))
    const item = S.appPath('chat/conversations/2026-11-05-first')
    check(item && item.file === '/apps/chat/conversations/2026-11-05-first.json' && S.appPath('../x') === null && S.appPath('nofolder') === null, 'a feature path maps to apps/<path>.json; a bad path is refused')
    await nv.writeFile(acct.reader, item.folder, item.name, JSON.stringify({ messages: [{ role: 'user', text: 'Who is speaking about agents?' }] }))
    await nv.publish(acct.reader)

    // E. device two: unlock from the same bytes, write its own file with a top-up, consolidate, merge
    const u = await nv.unlock({ sgSend: sg, door: await door.doorFrom(prf), cloneBranch: 'wsn-dev2' })
    const tok = await nv.readJson(u.master, '/.vault/access-token.json')
    check(u.reader.vaultId === acct.reader.vaultId && tok && tok.token === mock.token, 'another device opens the same vaults from the same passkey, and finds the access key in the master')
    const state2 = { created: now, balance: 1000 - 1, spent: 1, reads: 1, declined: 0, log: [{ id: 'r3', at: now, path: '/people/x/', title: 'X', kind: 'person', price: 1, depth: 1, cost: 1, persona: 'me' }],
        topups: [{ ref: 'cs_test_9', at: now, credit: 500, source: 'link' }], sessions: ['cs_test_9'], active: 'me', personas: [{ id: 'me', name: '', on: [], off: [] }] }
    await nv.writeFile(u.reader, S.PATHS.devicesFolder, 'wsn-dev2.json', JSON.stringify(S.extract(state2, { id: 'wsn-dev2', label: 'phone' })))
    await nv.publish(u.reader)
    const names = (await nv.listFiles(u.reader, S.PATHS.devicesFolder)).filter(n => n.endsWith('.json'))
    const files = await Promise.all(names.map(n => nv.readJson(u.reader, `${S.PATHS.devicesFolder}/${n}`)))
    const c = S.consolidate(files, await nv.readJson(u.reader, S.PATHS.account))
    check(c.devices.length === 2 && c.totals.reads === 3 && c.totals.spent === 10 && c.totals.credit === 500 && c.totals.balance === 990, `the consolidated account: 3 reads, 10p spent, £5 topped up, balance from one starting credit (${c.totals.balance})`)
    const m = S.mergeInto(state1, c, 'wsn-dev1')
    check(m.added.reads === 1 && m.added.topups === 1 && m.state.balance === 990 && m.state.sessions.includes('cs_test_9'), 'bringing them into device one adds the other device\'s read and top-up and recomputes the balance')
    check(S.inbound(c, m.state, 'wsn-dev1').any === 0, 'after the merge nothing is left to bring in')
    const f1again = S.extract(m.state, { id: 'wsn-dev1', label: 'laptop' }, f1)
    check(f1again.reads.length === 2 && f1again.topups.length === 0 && f1again.device.syncs === 2, 'device one\'s next update writes only its own records')
    const got = await nv.readJson(u.reader, item.file)
    check(got && got.messages[0].text === 'Who is speaking about agents?', 'the saved item reads back on the other device')
    const p = S.pending(m.state, '', [{ path: 'chat/x', in_vault: false }])
    check(p.items === 1 && p.reads === 2, 'pending counts this device\'s own reads and the saved items not yet in the vault')

    // F. the recovery door
    const rc = door.recoveryCode()
    const rdoor = await door.doorFrom(rc.bytes)
    await nv.addDoor({ sgSend: sg, master: u.master, door: rdoor, record: { kind: 'recovery', device: 'phone' }, cloneBranch: 'wsn-dev2' })
    const u3 = await nv.unlock({ sgSend: sg, door: await door.doorFrom(door.recoveryBytes(rc.shown)), cloneBranch: 'wsn-dev3' })
    check(u3.master.vaultId === acct.master.vaultId && u3.doors.length === 2, 'the recovery code, typed as shown, opens the same master on a third device')
    check(!mock.log.some(l => /token|key/i.test(l.replace(/\/api\/vault\/[a-z-]+\//, ''))), 'the mock\'s log holds methods, paths and statuses, never a key')
} finally {
    await mock.close()
}
console.log(`     mock: ${mock.stats.reads} reads, ${mock.stats.writes} writes in ${mock.stats.batches} batches, ${mock.stats.conflicts} conflict(s)`)
console.log(failed ? `${failed} FAILED` : 'ALL VAULT CHECKS PASS')
process.exit(failed ? 1 : 0)
