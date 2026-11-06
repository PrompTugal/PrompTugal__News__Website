/**
 * vault-core.js: everything web-summit.newsroom.sgit.ai does with vaults, ported from newsroom.sgit.ai's
 * assets/newsroom-vault.js (read 5 November 2026), on top of the vault library that runs dev.vault.sgraph.ai
 * (assets/vendor/sg-vault/v0.2.3, pinned and unedited) and its one local extension
 * (assets/vendor/sg-vault/local/sg-vault--create-with-id.js).
 *
 * What changed in the port, and nothing else: this site's own device id key (web-summit.newsroom.device) and
 * device id prefix (wsn-), this site's name in the reader vault's README, and the lane, inbox and shared-viewer
 * helpers left out (this site has none of them yet). The functions kept are the reference's, verbatim:
 *
 *   createVault, createVaultWithId, openVault      the library's create, createWithId and open, with the key prefix
 *                                                   stripped on the way in and this device's clone branch passed
 *   ensureLoaded, writeFile, publish               the tested helpers from the sgit.ai page: load a folder before
 *                                                   writing into it, every write is one commit, publish with
 *                                                   compare-and-swap and merge on ECAS, never push()
 *   readText, readJson, listFiles, removeFile      reading, loading the folder first
 *   createAccount, unlock, addDoor                 the design: a door vault (derived id and passphrase) holds the
 *                                                   master vault's key; the master holds the reader vault's key and
 *                                                   the list of doors; every door records where it came from
 *
 * The library's globals (SGSend, SGVault, SGVaultCrypto) must be loaded first, as plain scripts, in the order
 * v0.2.3/VENDOR.md gives (assets/vault/vault.js loads them). Nothing in this module logs or stores a key.
 *
 * @module vault-core
 */

function libs() {
    try { return { SGSend, SGVault, SGVaultCrypto } }                                  // global lexical bindings, as the page loads them
    catch (e) { throw new Error('The vault library is not loaded: the twelve scripts of assets/vendor/sg-vault/v0.2.3 and the local extension must load before this module.') }
}

// ------------------------------------------------------------ keys and names
const PREFIX = 'sgit_private_' + 'vault_'                                             // split so the tree holds no key-shaped literal
export const vaultKeyString = (passphrase, vaultId) => PREFIX + passphrase + ':' + vaultId
export const stripKey = key => libs().SGVaultCrypto.stripKeyPrefix(key)
export const keyParts = key => libs().SGVaultCrypto.parseVaultKey(stripKey(key))
/** An open vault's key in the form that leaves the page: prefixed, so sgit and a reader know what it is. */
export const prefixedKey = vault => { const k = vault.getVaultKey(), i = k.lastIndexOf(':'); return vaultKeyString(k.slice(0, i), k.slice(i + 1)) }

/** 24 characters of [a-z0-9], as sgit init makes, by rejection sampling (from the sgit.ai page). */
export function randomPassphrase(n = 24) {
    const abc = 'abcdefghijklmnopqrstuvwxyz0123456789', out = []
    while (out.length < n) {                             // rejection sampling: no modulo bias
        for (const b of crypto.getRandomValues(new Uint8Array(n))) if (b < 252 && out.length < n) out.push(abc[b % 36])
    }
    return out.join('')
}

/** This device's clone branch, made once and kept in local storage; in memory where there is no storage. */
let memBranch = null
export const DEVICE_KEY = 'web-summit.newsroom.device'
/** This browser takes another id as its own (the vault pane, when the reader says which device this is). */
export function setDeviceBranch(id) { memBranch = id; try { localStorage.setItem(DEVICE_KEY, id) } catch (e) { /* memory only */ } }
export function deviceBranch() {
    const KEY = DEVICE_KEY
    try { const v = localStorage.getItem(KEY); if (v) return v } catch (e) { /* no storage */ }
    if (!memBranch) memBranch = 'wsn-' + crypto.randomUUID().slice(0, 8)
    try { localStorage.setItem(KEY, memBranch) } catch (e) { /* fine */ }
    return memBranch
}

/** The HTTP client: endpoint and, for writes, the access token (sent as x-sgraph-access-token and nothing else). */
export function client({ endpoint, token }) { return new (libs().SGSend)({ endpoint, token: token || '' }) }

// ------------------------------------------------------------ the five actions
export async function createVault(sgSend, { name, description, passphrase } = {}) {
    return libs().SGVault.create(sgSend, passphrase || randomPassphrase(), { name, description })
}

/** A vault at a known id (a door): the local extension, until the library takes create(…, { vaultId }). */
export async function createVaultWithId(sgSend, passphrase, vaultId, { name, description, cloneBranch } = {}) {
    const { SGVault } = libs()
    if (typeof SGVault.createWithId !== 'function') throw new Error('SGVault.createWithId is missing: load assets/vendor/sg-vault/local/sg-vault--create-with-id.js')
    return SGVault.createWithId(sgSend, stripKey(passphrase), vaultId, { name, description, cloneBranch: cloneBranch || deviceBranch() })
}

/** Open with a vault key, prefixed or bare, on this device's clone branch. A missing vault throws with code ENOVAULT. */
export async function openVault(sgSend, key, { cloneBranch } = {}) {
    try { return await libs().SGVault.open(sgSend, stripKey(key), { cloneBranch: cloneBranch || deviceBranch() }) }
    catch (e) { if (/HEAD ref missing/.test(String(e && e.message))) { e.code = 'ENOVAULT' } throw e }
}

/** Open read-only with a read key as published: `sgit_public_read_<64 hex>:<vault id>` (the pool of vault onboarding).
 *  The library derives the ref's file id from the read key and the id alone; no passphrase, no write. ENOVAULT as above. */
export async function openReadOnly(sgSend, readKey) {
    const { SGVault, SGVaultCrypto } = libs()
    const bare = stripKey(readKey), i = bare.lastIndexOf(':')
    if (i < 0) throw new Error('a read key needs its vault id: <64 hex>:<vault id>')
    const c = await SGVaultCrypto.deriveReadOnlyCreds(bare.slice(i + 1), bare.slice(0, i))
    try { return await SGVault.openReadOnly(sgSend, c.vaultId, c.readKeyB64, c.refFileId) }
    catch (e) { if (/HEAD ref missing/.test(String(e && e.message))) { e.code = 'ENOVAULT' } throw e }
}

/** Load every folder on the path (from the sgit.ai page). */
export async function ensureLoaded(vault, folder) {          // load every folder on the path
  let path = ''
  for (const part of folder.split('/').filter(Boolean)) {
    path += '/' + part
    if (vault.needsLoading(path)) await vault.loadSubTreeOnDemand(path)
  }
}

/** Write one file as one commit, creating folders as needed (from the sgit.ai page). */
export async function writeFile(vault, folder, name, data) {
  await ensureLoaded(vault, folder)                       // REQUIRED, see the warning below
  let path = ''
  for (const part of folder.split('/').filter(Boolean)) { // create missing folders
    path += '/' + part
    if (!vault.listFolder(path)) await vault.createFolder(path)
  }
  const bytes  = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const exists = (vault.listFolder(folder) || []).some(e => e.name === name && e.type === 'file')
  return exists ? vault.updateFile(folder, name, bytes) : vault.addFile(folder, name, bytes)
}

/** Publish with compare-and-swap; on ECAS merge and retry; never push() (from the sgit.ai page). */
export async function publish(vault) {
  if (vault._refManager.lastRawRef(vault._refFileId) === undefined)
    await vault.getBehindCount()               // only if never read: arms the compare-and-swap
  try { await vault.pushIfMatch(); return }
  catch (e) { if (e.code !== 'ECAS') throw e } // somebody else published first
  const theirs = await vault._refManager.readRef(vault._refFileId)
  const r = await vault.merge(theirs, { publish: false })   // fast-forward or three-way, file level
  if (r.conflicts.length) throw new Error('conflicts: ' + r.conflicts.join(', '))
  await vault.pushIfMatch()
}

/** A file as text; null when it is not there. */
export async function readText(vault, filePath) {
    const parts = filePath.split('/').filter(Boolean), name = parts.pop(), folder = '/' + parts.join('/')
    await ensureLoaded(vault, folder)
    const listed = vault.listFolder(folder) || []
    if (!listed.some(e => e.name === name && e.type === 'file')) return null
    return new TextDecoder().decode(await vault.getFile(folder, name))
}
export async function readJson(vault, filePath) { const t = await readText(vault, filePath); return t == null ? null : JSON.parse(t) }
export async function listFiles(vault, folder = '/') { await ensureLoaded(vault, folder); return (vault.listFolder(folder) || []).map(e => e.name + (e.type === 'folder' ? '/' : '')) }

// ------------------------------------------------------------ the account: door, master, reader
export const DOOR = { key: 'master-key.json', record: 'door.json' }
export const MASTER = { reader: 'reader.json', doors: 'doors.json', lane: 'lane.json', inbox: 'inbox.json' }

const now = () => new Date().toISOString()
const doorRecord = (door, record) => ({
    v: 1, kind: record.kind || 'passkey', provider: record.provider || '', path: record.path || '', credential_id: record.credential_id || '',
    device: record.device || '', created: now(), vault_id: door.vaultId,
})

/**
 * First device: the door (at its derived address), the master and the reader vault, as three real vaults.
 *   door   = { passphrase, vaultId } from doorFrom(bytes)
 *   record = { kind, provider, path, credential_id, device }: where this door came from
 * Returns { door, master, reader } as open vault objects, and the records written.
 */
export async function createAccount({ sgSend, door, record = {}, cloneBranch, names = {} }) {
    const master = await createVault(sgSend, { name: names.master || 'master' })
    const reader = await createVault(sgSend, { name: names.reader || 'reader' })
    const doorVault = await createVaultWithId(sgSend, door.passphrase, door.vaultId, { name: names.door || 'door', cloneBranch })
    const rec = doorRecord(door, record)
    await writeFile(doorVault, '/', DOOR.key, JSON.stringify({ v: 1, master: prefixedKey(master) }, null, 1))
    await writeFile(doorVault, '/', DOOR.record, JSON.stringify(rec, null, 1))
    await publish(doorVault)
    const doors = { v: 1, doors: [{ ...rec, vault_key: vaultKeyString(door.passphrase, door.vaultId) }] }
    await writeFile(master, '/', MASTER.reader, JSON.stringify({ v: 1, reader: prefixedKey(reader) }, null, 1))
    await writeFile(master, '/', MASTER.doors, JSON.stringify(doors, null, 1))
    await publish(master)
    await writeFile(reader, '/', 'README.md', '# A reader vault\n\nMade by web-summit.newsroom.sgit.ai. activity/ holds each device\'s reading account; apps/ holds what the site\'s features saved for you.\n')
    await publish(reader)
    return { door: doorVault, master, reader, record: rec, doors: doors.doors }
}

/**
 * Unlock: open the door at the derived address, read the master's key, open the master, read the reader's key, open it.
 * Throws with code ENOVAULT when there is no door at the address: the caller says "no door here for this path yet".
 */
export async function unlock({ sgSend, door, cloneBranch }) {
    const doorVault = await openVault(sgSend, vaultKeyString(door.passphrase, door.vaultId), { cloneBranch })
    const key = await readJson(doorVault, '/' + DOOR.key)
    if (!key || !key.master) { const e = new Error('The door has no master key in it'); e.code = 'EDOOR'; throw e }
    const master = await openVault(sgSend, key.master, { cloneBranch })
    const readerKey = await readJson(master, '/' + MASTER.reader)
    const reader = readerKey && readerKey.reader ? await openVault(sgSend, readerKey.reader, { cloneBranch }) : null
    const doors = (await readJson(master, '/' + MASTER.doors)) || { doors: [] }
    const record = await readJson(doorVault, '/' + DOOR.record)
    return { door: doorVault, master, reader, doors: doors.doors, record }
}

/** While unlocked: a second path's door, holding the same master key, and the master's list updated. Nothing typed. */
export async function addDoor({ sgSend, master, door, record = {}, cloneBranch }) {
    const doorVault = await createVaultWithId(sgSend, door.passphrase, door.vaultId, { name: 'door', cloneBranch })
    const rec = doorRecord(door, record)
    await writeFile(doorVault, '/', DOOR.key, JSON.stringify({ v: 1, master: prefixedKey(master) }, null, 1))
    await writeFile(doorVault, '/', DOOR.record, JSON.stringify(rec, null, 1))
    await publish(doorVault)
    const doors = (await readJson(master, '/' + MASTER.doors)) || { v: 1, doors: [] }
    doors.doors.push({ ...rec, vault_key: vaultKeyString(door.passphrase, door.vaultId) })
    await writeFile(master, '/', MASTER.doors, JSON.stringify(doors, null, 1))
    await publish(master)
    return { door: doorVault, record: rec, doors: doors.doors }
}


/** Remove one file as one commit; false when it was not there (from the reference, its files section). */
export async function removeFile(vault, folder, name) {
    await ensureLoaded(vault, folder)
    if (!(vault.listFolder(folder) || []).some(e => e.name === name && e.type === 'file')) return false
    await vault.removeFile(folder, name)
    return true
}
