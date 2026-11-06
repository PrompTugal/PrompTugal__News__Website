// Proves the browser-side envelope opens with the library the inbox owner uses (sgit PKI__Crypto.hybrid_decrypt),
// against a THROWAWAY key pair made in a temp directory. Never touches ~/.sg-send or any team key.
// Run: node board/team/customers/interest/interest.test.mjs
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { sendInterest } from './interest.js'

const dir = mkdtempSync(join(tmpdir(), 'interest-test-'))
const py = (code, ...args) => execFileSync('python3', ['-I', '-c', code, ...args], { encoding: 'utf8' })
try {
    py(`import sys
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
c=PKI__Crypto(); priv,pub=c.generate_encryption_key_pair()
open(sys.argv[1]+'/priv.pem','w').write(c.export_private_key_pem(priv)); open(sys.argv[1]+'/pub.pem','w').write(c.export_public_key_pem(pub))`, dir)
    const config = { endpoint: 'https://lane.test', vault_id: 'abcd1234', append_token: 'test-token-not-real', recipient: { encrypt: readFileSync(join(dir, 'pub.pem'), 'utf8') } }

    let seen = null
    const mock = async (url, init) => { seen = { url, init, body: JSON.parse(init.body) }; return { ok: true, status: 200 } }
    const when = new Date('2026-11-09T10:11:12Z')
    const fields = { product: 'Briefing pack', note: 'Ünïcode ✓ and "quotes"', reach: 'by the team chat, weekdays', name: 'A. Visitor' }
    const r = await sendInterest(fields, config, { fetch: mock, now: when })
    assert.deepEqual(r, { ok: true })
    assert.equal(seen.url, 'https://lane.test/api/vault/append/write/abcd1234')
    assert.equal(seen.init.method, 'POST'); assert.equal(seen.init.credentials, 'omit')
    assert.deepEqual(Object.keys(seen.body).sort(), ['append_token', 'payload'])
    assert.equal(seen.body.append_token, 'test-token-not-real')
    assert.ok(!seen.init.body.includes('Briefing') && !seen.init.body.includes('team chat'), 'plaintext must not appear on the wire')

    writeFileSync(join(dir, 'payload.txt'), seen.body.payload)
    const out = py(`import sys, json, base64
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
c=PKI__Crypto(); key=c.import_private_key_pem(open(sys.argv[1]+'/priv.pem').read())
enc=base64.b64decode(open(sys.argv[1]+'/payload.txt').read()).decode()
print(c.hybrid_decrypt(key, enc)['plaintext'])`, dir)
    const msg = JSON.parse(out)
    assert.deepEqual(msg, { kind: 'interest', product: 'Briefing pack', note: fields.note, reach: fields.reach, name: 'A. Visitor', page: '', sent: '2026-11-09T10:11:12.000Z', v: 1 })

    // a second send is sealed afresh (new key and iv), and failures are reported, not thrown
    await sendInterest(fields, config, { fetch: mock, now: when })
    assert.notEqual(seen.body.payload, readFileSync(join(dir, 'payload.txt'), 'utf8'))
    assert.equal((await sendInterest(fields, config, { fetch: async () => ({ ok: false, status: 507 }) })).ok, false)
    assert.equal((await sendInterest(fields, config, { fetch: async () => { throw new TypeError('x') } })).ok, false)
    assert.equal((await sendInterest({ product: '', reach: 'x' }, config, { fetch: mock })).ok, false)
    assert.equal((await sendInterest({ product: 'p', reach: '' }, config, { fetch: mock })).ok, false)
    assert.equal((await sendInterest(fields, {}, { fetch: mock })).ok, false)
    console.log('OK: the envelope opens with sgit PKI__Crypto.hybrid_decrypt and the fields round-trip')
} finally { rmSync(dir, { recursive: true, force: true }) }
