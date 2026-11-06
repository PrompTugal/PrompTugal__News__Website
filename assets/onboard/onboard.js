/* onboard.js: vault onboarding in the browser (board/spec-vault-onboarding.md), loaded by the vault pane only when a
 * reader has no vault yet and the site config (assets/obs/claims.json) says onboarding is open. Nothing runs on import.
 *
 *   drawKey(cfg, say)         the reader's key pair, a key drawn from the pool vault, its licence opened and checked:
 *                             returns the access key and what the later steps need (never stored by this module)
 *   afterCreate(ctx, master)  the reader's keys, API key and mailbox id into the master vault; then the signed claim to the lane
 *   checkMailbox(master, say) the issuer's messages in the pool vault's mailbox, from the last one read
 *
 * The pure checks are in onboard-core.js (tested in Node and against the sweep's Python); the words are data, in
 * data/billing/vault.json "onboarding". The claim is best effort: a failed post never undoes a vault that was made.
 */
import * as NV from '../vault/vault-core.js'
import { readKeyString } from '../vault/door.js'
import * as K from '../vendor/pki/2026-11-06/keys.js'
import * as O from './onboard-core.js'

const CONFIG = new URL('../obs/claims.json', import.meta.url)
const FILE = { folder: '/', name: 'onboarding.json' }
const readHex = s => String(s).replace(/^sgit_public_read_/, '')
const poolKey = cfg => readKeyString(readHex(cfg.pool.read_key), cfg.pool.vault_id)

export async function loadConfig() {
    try { const r = await fetch(CONFIG, { credentials: 'same-origin' }); return r.ok ? await r.json() : null } catch (e) { return null }
}
export const isOpen = cfg => !!(cfg && cfg.enabled === true && cfg.pool && cfg.pool.vault_id && cfg.pool.read_key && cfg.issuer && cfg.claims && cfg.sweep)

async function openPool(cfg) {
    const sg = NV.client({ endpoint: cfg.endpoint })
    return NV.openReadOnly(sg, poolKey(cfg))
}

/** 0 and 1 of the flow: a key pair, a key from the pool, the licence. Throws with a plain reason; says what it is doing. */
export async function drawKey(cfg, say = () => { }, doorMode = 'passkey-prf') {
    const issuers = await O.issuersFromConfig(cfg)
    if (!issuers.size) throw new Error('the site config’s issuer does not match its pinned fingerprint')
    say('keys')
    const reader = await O.newReader('reader')
    say('pool')
    const pool = await openPool(cfg)
    const file = await NV.readJson(pool, 'pool/available.json')
    if (!(await O.verifyPool(file, issuers))) throw new Error('the pool is not signed by the pinned issuer')
    const entry = O.pick(file)
    if (!entry) { const e = new Error('the pool is empty'); e.code = 'EEMPTY'; throw e }
    say('licence')
    const { lookup } = await O.derive(entry.api_key)
    const lic = await NV.readJson(pool, `licences/${lookup}.json`)
    if (!lic) throw new Error('the licence for the key drawn is missing')
    const licence = await O.openLicence(lic, entry.api_key, { issuers })
    return { accessKey: licence.access_key, ctx: { cfg, apiKey: entry.api_key, lookup, licence, reader, mailbox: O.newMailboxId(), doorMode, issuers } }
}

const pkcs8 = u8 => K.b64(u8)
/** The master keeps what the reader must keep; one secret (the door's) stays the reader's. */
async function saveToMaster(ctx, master, lastRead = 0) {
    const body = { v: 1, api_key: ctx.apiKey, lookup: ctx.lookup, mailbox: ctx.mailbox, last_read: lastRead, door_mode: ctx.doorMode,
        reader: { bundle: ctx.reader.bundle, private: { encrypt: pkcs8(ctx.reader.private.encrypt), sign: pkcs8(ctx.reader.private.sign) } }, licence: ctx.licence, saved: new Date().toISOString() }
    await NV.writeFile(master, FILE.folder, FILE.name, JSON.stringify(body))
    await NV.publish(master)
}

/** The claim: sealed to the sweep, signed by the reader, appended to the lane. Returns { posted, status } and never throws. */
async function postClaim(ctx) {
    const { cfg } = ctx
    try {
        const claim = O.claimFor({ lookup: ctx.lookup, reader: ctx.reader, mailbox: ctx.mailbox, doorMode: ctx.doorMode })
        const enc = await O.sealClaim(claim, { encrypt: cfg.sweep.encrypt, signing_fingerprint: '' }, ctx.reader)
        const body = JSON.stringify({ append_token: cfg.claims.append_token, payload: O.lanePayload(enc) })
        let status = 0
        for (let i = 0; i < 3; i++) {
            const r = await fetch(`${cfg.endpoint}/api/vault/append/write/${cfg.claims.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
            status = r.status
            if (r.ok) return { posted: true, status }
            if (status !== 507) break                                   // a full lane: try again; anything else: stop
            await new Promise(res => setTimeout(res, 1500 * (i + 1)))
        }
        return { posted: false, status }
    } catch (e) { return { posted: false, status: 0, error: String(e && e.message || e) } }
}

export async function afterCreate(ctx, master) {
    await saveToMaster(ctx, master)
    return postClaim(ctx)
}

/** The mailbox: n = last_read+1, +2, … until one is missing. Each message is opened and checked; the master's last_read moves. */
export async function checkMailbox(master, cfg) {
    let mine
    try { mine = await NV.readJson(master, `${FILE.folder}${FILE.name}`.replace('//', '/')) } catch (e) { mine = null }
    if (!mine || !mine.mailbox || !mine.reader) return []
    const issuers = await O.issuersFromConfig(cfg)
    const reader = { bundle: mine.reader.bundle, private: { encrypt: K.unb64(mine.reader.private.encrypt), sign: K.unb64(mine.reader.private.sign) } }
    const pool = await openPool(cfg)
    const out = []
    let n = (mine.last_read || 0) + 1
    for (; n < (mine.last_read || 0) + 50; n++) {
        let file; try { file = await NV.readJson(pool, `mailbox/${mine.mailbox}/${n}.json`) } catch (e) { file = null }
        if (!file) break
        try { out.push(await O.openMailbox(file, { reader, issuers, n })) } catch (e) { out.push({ kind: 'refused', n, reason: String(e && e.message || e) }) }
    }
    if (out.length) { mine.last_read = (mine.last_read || 0) + out.length; await NV.writeFile(master, FILE.folder, FILE.name, JSON.stringify(mine)); await NV.publish(master) }
    return out
}
