/**
 * vault.js: the reader's vault, as a pane on the right of every page (#nr-pane), ported from newsroom.sgit.ai's
 * assets/vault-pane/vault-pane.js (read 5 November 2026; a beta there). Loaded by assets/vault/boot.js only when needed.
 *
 *   Vault    sign in with a passkey: the passkey's PRF bytes derive the door (door.js); the door opens the master, the
 *            master opens the reader vault and gives the access key (vault-core.js). No door at the address means no
 *            vault yet: create one (a vault access key, pasted once, kept in the master; without it nothing is
 *            created and the pane says exactly what is missing and where it will come from), or type the recovery
 *            code to add this passkey to a vault made elsewhere. Update the vault: this device's records (reads,
 *            top-ups, ratings, personas) as one file in the reader vault, plus what features saved through
 *            window.__vault, one publish, only when the reader asks. Across your devices: every device's file read,
 *            consolidated, totals recomputed (sync.js); after a sign-in on another device what the vault holds and
 *            this browser does not is brought in, and the page reloads with the whole account.
 *   Reading  every page read in this browser, newest first, with what it cost.
 *   Saved    what the site's features keep for you (apps/ in the vault, and this browser's copy).
 *   Keys     every vault of the account with its key, revealed only on request, to open any of them on your own.
 *
 * Left out of the port, for now: the reference's notes, lane, inbox ("connect with a link"), device chooser and
 * merging, shared viewer and Calls tab. Where the keys live:
 * this page's memory only (PT decision "where the vault key lives", option B: leave the page and they are gone); nothing is written to localStorage but this
 * device's id and label, the saved items and the time of the last update. The library (assets/vendor/sg-vault, twelve
 * pinned files and one local extension) is loaded from this origin the first time it is needed. Every call goes to
 * the vault server in data/billing/vault.json and nowhere else.
 *
 * @module vault
 */
import * as NV from './vault-core.js'
import { doorFrom, prfBytes, recoveryBytes, recoveryCode, PRF_INPUT_TEXT, sha256 } from './door.js'
import * as S from './sync.js'
const OB = () => import('../onboard/onboard.js')   // vault onboarding: loaded only when needed
let onboardCtx = null

const ROOT = new URL('../../', import.meta.url)
const at = p => new URL(p, ROOT).href
export const LIB = ['sg-send/sg-send-crypto.js', 'sg-send/sg-send.js', 'sg-vault/sg-vault-crypto.js', 'sg-vault/sg-vault-object-store.js', 'sg-vault/sg-vault-ref-manager.js',
    'sg-vault/sg-vault-commit.js', 'sg-vault/sg-vault.js', 'sg-vault/sg-vault--file-ops.js', 'sg-vault/sg-vault--folder-ops.js', 'sg-vault/sg-vault--sync.js',
    'sg-vault/sg-vault--history.js', 'sg-vault/sg-vault--branches.js'].map(f => `assets/vendor/sg-vault/v0.2.3/${f}`).concat(['assets/vendor/sg-vault/local/sg-vault--create-with-id.js'])
const K = { session: 'web-summit.newsroom.vault.session', label: 'web-summit.newsroom.device-label', open: 'web-summit.newsroom.vault.open', last: 'web-summit.newsroom.vault.last-sync', items: 'web-summit.newsroom.vault.items', merged: 'web-summit.newsroom.vault.merged' }
const TOKEN_FILE = { folder: '/.vault', name: 'access-token.json' }    // where the library's readEmbeddedAccessToken() looks
const TABS = [['vault', 'Vault'], ['reading', 'Reading'], ['saved', 'Saved'], ['keys', 'Keys']]

// ------------------------------------------------------------ config: public facts only (api/v1/billing/*.json)
const getJson = async p => { try { const r = await fetch(at(p), { cache: 'no-cache' }); return r.ok ? await r.json() : null } catch (e) { return null } }
const CFG = (await getJson('api/v1/billing/vault.json')) || { endpoint: 'https://dev.send.sgraph.ai', access_key: { status: 'not-issued', what: 'A vault access key.', where: 'Not issued yet.' } }
const MCFG = (await getJson('api/v1/billing/meter.json')) || { storageKey: 'web-summit.newsroom.meter.v1', start: 500, symbol: '£' }
export const ENDPOINT = CFG.endpoint

// ------------------------------------------------------------ helpers
const h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag)
    for (const [k, v] of Object.entries(attrs || {})) { if (v === false || v == null) continue; if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v) }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid instanceof Node ? kid : String(kid))
    return el
}
const kv = rows => h('dl', { class: 'kv' }, rows.filter(Boolean).flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)]))
const err = e => (e && e.name && e.name !== 'Error' ? `${e.name}: ` : '') + String(e && e.message || e)
const money = p => `${p < -0.004 ? '−' : ''}${MCFG.symbol || '£'}${(Math.abs(p) / 100).toFixed(2)}`
const when = iso => iso ? String(iso).slice(0, 16).replace('T', ' ') : ''
const readState = () => { try { return JSON.parse(localStorage.getItem(MCFG.storageKey) || 'null') } catch (e) { return null } }
const emptyState = () => ({ v: 3, created: new Date().toISOString(), balance: MCFG.start, spent: 0, reads: 0, declined: 0, paused: false, log: [], topups: [], cart: [], sessions: [], active: 'me', personas: [{ id: 'me', name: '', created: new Date().toISOString(), on: [], off: [] }] })
const lastSync = () => { try { return localStorage.getItem(K.last) || '' } catch (e) { return '' } }
const savedStore = () => { try { const s = JSON.parse(localStorage.getItem(K.items) || 'null'); return s && s.items ? s : { v: 1, items: {} } } catch (e) { return { v: 1, items: {} } } }
const savedList = () => Object.entries(savedStore().items).map(([path, x]) => ({ path, ...x }))
const markSaved = paths => { const s = savedStore(), now = new Date().toISOString(); for (const p of paths) if (s.items[p]) { s.items[p].in_vault = true; s.items[p].vault_at = now } try { localStorage.setItem(K.items, JSON.stringify(s)) } catch (e) { /* fine */ } }
const copyBtn = text => { const b = h('button', { type: 'button', class: 'btn quiet nr-sm', onclick: async () => { try { await navigator.clipboard.writeText(text); b.textContent = 'Copied' } catch (e) { b.textContent = 'Could not copy' } setTimeout(() => { b.textContent = 'Copy' }, 1500) } }, 'Copy'); return b }
const secret = (text, label) => {
    const masked = `•••••••• (${text.length} characters)`
    const span = h('span', { class: 'nr-mono' }, masked)
    let shown = false
    const btn = h('button', { type: 'button', class: 'btn quiet nr-sm', onclick: () => { shown = !shown; span.textContent = shown ? text : masked; btn.textContent = shown ? 'Hide' : `Reveal ${label}` } }, `Reveal ${label}`)
    return h('span', { class: 'nr-secret' }, span, ' ', btn, ' ', copyBtn(text))
}
// PT decision "where the vault key lives", option B: the keys (the door and the token) live in this page's memory only,
// never in sessionStorage or localStorage, where a script on any other page could read them. Leave the vault page and
// they are gone: sign in again. Other pages save to the browser; this page publishes.
let sessionRec = null
const session = {
    get() { return sessionRec },
    set(v) { sessionRec = v || null },
}
export const isOpen = () => !!sessionRec
export const canWrite = () => !!(sessionRec && sessionRec.token)
let libLoading = null
export function loadLibrary() {
    if (typeof SGVault !== 'undefined' && typeof SGVault.createWithId === 'function') return Promise.resolve()
    if (libLoading) return libLoading
    libLoading = (async () => {
        for (const f of LIB) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = at(f); s.onload = res; s.onerror = () => rej(new Error(`could not load ${f}`)); document.head.append(s) })
    })()
    return libLoading
}

// ------------------------------------------------------------ state
let deviceId = NV.deviceBranch()
let label = ''; try { label = localStorage.getItem(K.label) || '' } catch (e) { /* fine */ }
const state = { vaults: null, sg: null, tab: 'vault', consolidated: null, inbound: null, note: null, drawn: false }

async function client(token) { await loadLibrary(); if (!state.sg) state.sg = NV.client({ endpoint: ENDPOINT, token: token || '' }); if (token) state.sg.token = token; return state.sg }

/** Open everything from a session record { door: {passphrase, vaultId}, path, token? }: the door, the master (and its access key), the reader vault. */
async function openAll(rec) {
    const sg = await client(rec.token || '')
    const u = await NV.unlock({ sgSend: sg, door: rec.door })
    let token = rec.token || ''
    if (!token) { try { const t = await NV.readJson(u.master, `${TOKEN_FILE.folder}/${TOKEN_FILE.name}`); token = (t && t.token) || '' } catch (e) { token = '' } }
    if (token) sg.token = token
    state.vaults = { ...u, token }
    session.set({ ...rec, token })
    status()
    return state.vaults
}
async function ensureOpen() {
    if (state.vaults) return state.vaults
    const rec = session.get()
    if (!rec) throw new Error('the vault is not open in this tab')
    return openAll(rec)
}
function status() {
    const rec = session.get()
    const b = document.getElementById('nr-vault-btn'); if (b) b.classList.toggle('on', !!rec)
    try { window.dispatchEvent(new CustomEvent('nr-vault-status', { detail: { open: !!rec, canWrite: !!(rec && rec.token) } })) } catch (e) { /* fine */ }
    renderPending()
}

// ------------------------------------------------------------ the pane
let pane, body, secs, strip
function build() {
    if (pane) return
    let root = document.getElementById('nr-pane')
    if (!root) { root = h('div', { id: 'nr-pane' }); document.body.append(root) }
    const tabs = h('div', { class: 'pane-tabs', role: 'tablist' })
    secs = Object.fromEntries(TABS.map(([id]) => [id, h('section', { id: `nr-vault-sec-${id}`, role: 'tabpanel', 'aria-labelledby': `nr-vault-tab-${id}`, hidden: true })]))
    body = secs.vault
    strip = h('div', { class: 'nr-vault-strip', id: 'nr-vault-strip', hidden: true })
    pane = h('aside', { class: 'pane nr-vault-pane', id: 'nr-vault-pane', 'aria-label': 'Your vault', hidden: true },
        h('header', { class: 'pane-head' }, h('h2', {}, 'Your vault'), h('span', { class: 'nr-beta' }, 'beta'), h('span', { class: 'spacer' }), h('button', { type: 'button', id: 'nr-vault-close', onclick: () => close() }, 'Close')),
        strip, tabs, h('div', { class: 'pane-body' }, ...TABS.map(([id]) => secs[id])))
    for (const [id, name] of TABS) tabs.append(h('button', { type: 'button', role: 'tab', id: `nr-vault-tab-${id}`, 'aria-selected': 'false', 'aria-controls': `nr-vault-sec-${id}`, onclick: () => showTab(id) }, name))
    root.append(pane)
    window.addEventListener('nr-pane-open', e => { if (e.detail && e.detail.id !== 'vault') close(true) })
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pane.hidden) close() })
    document.addEventListener('sg:meter.changed', () => renderPending())
    window.addEventListener('nr-vault-saved', () => { renderPending(); if (state.tab === 'saved' && !pane.hidden) drawSaved() })
}
const fill = (...kids) => body.replaceChildren(...kids.flat().filter(k => k != null && k !== false))
const remember = on => { try { if (on) sessionStorage.setItem(K.open, state.tab); else sessionStorage.removeItem(K.open) } catch (e) { /* fine */ } }

export function open(tab) {
    build()
    try { window.dispatchEvent(new CustomEvent('nr-pane-open', { detail: { id: 'vault' } })) } catch (e) { /* fine */ }
    pane.hidden = false
    if (pane.parentElement && pane.parentElement.id === 'nr-pane') pane.parentElement.hidden = false   // the shell renders #nr-pane hidden until a pane opens
    document.documentElement.classList.add('vault-open'); document.body.classList.add('pane-open')
    const b = document.getElementById('nr-vault-btn'); if (b) b.setAttribute('aria-expanded', 'true')
    if (!state.drawn) draw()
    showTab(tab || state.tab)
}
export function close(quiet) {
    if (!pane) return
    pane.hidden = true
    const root = pane.parentElement
    if (root && root.id === 'nr-pane' && ![...root.children].some(c => !c.hidden)) root.hidden = true
    document.documentElement.classList.remove('vault-open'); document.body.classList.remove('pane-open')
    const b = document.getElementById('nr-vault-btn'); if (b) { b.setAttribute('aria-expanded', 'false'); if (!quiet) b.focus() }
    remember(false)
}
export function toggle() { if (pane && !pane.hidden) close(); else open() }
function showTab(id) {
    state.tab = TABS.some(([k]) => k === id) ? id : 'vault'
    for (const [k] of TABS) { document.getElementById(`nr-vault-tab-${k}`).setAttribute('aria-selected', String(k === state.tab)); secs[k].hidden = k !== state.tab }
    if (state.tab === 'reading') drawReading()
    if (state.tab === 'saved') drawSaved()
    if (state.tab === 'keys') drawKeys()
    if (!pane.hidden) remember(true)
}

/** What only this browser holds: the strip above the tabs and the count on the Vault button. */
function renderPending() {
    const p = S.pending(readState(), lastSync(), savedList())
    const b = document.getElementById('nr-vault-btn')
    if (b) { const n = b.querySelector('.pend'); if (n) { n.textContent = p.count ? String(p.count) : ''; n.hidden = !p.count } b.title = p.count ? `Your vault: ${p.count} change(s) only in this browser` : 'Your vault: your reading account, carried between your devices' }
    const row = document.getElementById('nr-vault-pending-row'); if (row) row.textContent = p.any ? S.describePending(p) : 'nothing: the vault has everything of this device'
    if (!strip) return
    strip.hidden = !p.any
    if (p.any) strip.replaceChildren(...[h('span', {}, `Only in this browser: ${S.describePending(p)}. ${p.last ? `Last update from here ${when(p.last)}.` : 'This device has never updated a vault.'}`),
        session.get() ? h('button', { type: 'button', class: 'btn primary nr-sm', onclick: () => { showTab('vault'); sync() } }, 'Update the vault') : null].filter(Boolean))
}

// ------------------------------------------------------------ the Vault tab
async function draw() {
    state.drawn = true
    const rec = session.get()
    if (!rec) return drawLocked()
    let note = null
    try { const m = JSON.parse(sessionStorage.getItem(K.merged) || 'null'); if (m && Date.now() - m.at < 15000) { sessionStorage.removeItem(K.merged); note = h('p', { class: 'nr-ok', id: 'nr-vault-merged' }, `Brought in: ${m.added.reads} read(s), ${m.added.topups} top-up(s), ${m.added.personas} persona(s) from your other devices. The meter now shows the whole account.`) } } catch (e) { /* fine */ }
    fill(note, h('p', { class: 'meta' }, 'Opening your vault…'))
    try { await openAll(rec); await drawUnlocked(note) }
    catch (e) { session.set(null); status(); drawLocked(h('p', { class: 'nr-warn' }, `The vault could not be opened from this tab's session: ${err(e)}. Sign in again.`)) }
}

function accessKeyWords() {
    const a = CFG.access_key || {}
    return a.status === 'not-issued' ? 'not issued yet: Dinis Cruz will add how readers get one' : 'issued by the newsroom: paste yours when you create the vault'
}
function missingKeyBox(id) {
    const a = CFG.access_key || {}
    return h('div', { class: 'notice nr-missing', id: id || 'nr-vault-missing', role: 'alert' },
        h('p', {}, h('strong', {}, 'What is missing: a vault access key.')),
        h('p', {}, h('strong', {}, 'What it is. '), a.what || ''),
        h('p', {}, h('strong', {}, 'Where it will come from. '), a.where || ''),
        h('p', {}, 'Nothing was created, and nothing was sent to the vault server.'))
}

function drawLocked(note) {
    const st = readState() || emptyState()
    const passkeys = typeof window.PublicKeyCredential === 'function'
    fill(
        note || null,
        h('h3', {}, 'Carry your reading between devices'),
        h('p', { class: 'meta' }, 'Your credit and history live in this browser. A vault is their second home: an encrypted folder only you can open, with no password and no email.'),
        passkeys ? null : h('p', { class: 'nr-warn' }, 'This browser offers no passkeys, so it cannot sign in with one. A recovery code from a vault made elsewhere still opens it here.'),
        h('ol', { class: 'steps' },
            h('li', {}, h('strong', {}, 'Sign in with a passkey'), h('br'), h('span', { class: 'meta' }, 'Your phone or laptop unlocks it, the way it unlocks your apps.'),
                h('p', { class: 'nr-acts' },
                    h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-enable', disabled: !passkeys, onclick: enable }, 'Use a passkey'),
                    h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-make', disabled: !passkeys, onclick: makePasskey }, 'Make a passkey for this site'))),
            h('li', {}, h('strong', {}, 'Create your vault, once'), h('br'), h('span', { class: 'meta' }, `This browser makes the keys; the vault keeps them, sealed to your passkey. It needs a vault access key, ${accessKeyWords()}.`)),
            h('li', {}, h('strong', {}, 'Update it from each device'), h('br'), h('span', { class: 'meta' }, 'One encrypted file per device; your totals are worked out from them. Open it on another device with the same passkey.'))),
        h('p', {}, h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-recover', onclick: () => drawRecover() }, 'I have a recovery code'), ' ', CFG.doorcode ? h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-code-mode', onclick: () => drawDoorCode() }, CFG.doorcode.button) : null),
        kv([
            ['In this browser only', `${(st.log || []).length} pages · ${money(st.balance)}${savedList().length ? ` · ${savedList().length} saved item(s)` : ''}`],
            ['Vault', 'not open on this device'],
            ['Access key', accessKeyWords()],
            ['Leaves this browser', 'only what you choose, encrypted before it goes'],
        ]),
        h('p', { class: 'notice' }, 'This works like the reading vault on newsroom.sgit.ai, where it is a beta. Nothing about the vault is needed to read this site. ', h('a', { href: at('account/vault.html') }, 'How it works'), '.'),
    )
}

async function withBusy(btnId, fn) {
    const b = btnId && document.getElementById(btnId); if (b) b.disabled = true
    try { return await fn() } finally { const b2 = btnId && document.getElementById(btnId); if (b2) b2.disabled = false }
}

async function enable() {
    await withBusy('nr-vault-enable', async () => {
        const st = h('p', { class: 'meta', id: 'nr-vault-status' }, 'Waiting for your passkey…'); body.prepend(st)
        let prf
        try { prf = await prfBytes(PRF_INPUT_TEXT, location.hostname) }
        catch (e) {
            if (e.code === 'ENOPRF') { st.replaceWith(h('p', { class: 'nr-warn' }, 'The passkey signed but gave no PRF bytes: this passkey provider cannot open a vault here. A recovery code is the way in on this device.')); return }
            st.replaceWith(h('div', { class: 'nr-warn' }, h('p', {}, `No passkey answered (${err(e)}). If you have none for this site yet, make one first.`)))
            return
        }
        st.textContent = 'Deriving the door from the passkey…'
        const door = await doorFrom(prf.bytes)
        try {
            st.textContent = 'Opening the door, the master and your reader vault…'
            await openAll({ door, path: prf.path, credId: prf.credId })
            await afterUnlock()
        } catch (e) {
            if (e.code === 'ENOVAULT') drawNoDoor(door, prf)
            else st.replaceWith(h('p', { class: 'nr-warn' }, err(e)))
        }
    })
}

async function makePasskey() {
    try {
        await navigator.credentials.create({ publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { id: location.hostname, name: 'web-summit.newsroom.sgit.ai' },
            user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'reader', displayName: 'A reader of web-summit.newsroom.sgit.ai' },
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
            authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
            extensions: { prf: { eval: { first: await sha256(PRF_INPUT_TEXT) } } }, timeout: 120000,
        } })
        drawLocked(h('p', { class: 'nr-ok', id: 'nr-vault-made' }, 'A passkey was made for this site. Now sign in with it.'))
    } catch (e) { drawLocked(h('p', { class: 'nr-warn' }, `The passkey was not made: ${err(e)}`)) }
}

function drawNoDoor(door, prf, mode) {
    const access = h('input', { type: 'password', class: 'input', id: 'nr-vault-access', autocomplete: 'off', spellcheck: 'false', placeholder: 'kept in memory, then inside your master vault' })
    const code = h('input', { type: 'text', class: 'input', id: 'nr-vault-code', autocomplete: 'off', placeholder: 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XX' })
    const missingSlot = h('div', { id: 'nr-vault-missing-slot' })
    const pilot = h('div', { id: 'nr-vault-pilot' })
    offerPilotKey(pilot, access, mode)
    fill(
        h('p', { class: 'notice', id: 'nr-vault-nodoor' }, `No vault answers to this passkey yet (door ${door.vaultId}, ${prf.path}). Either this is your first device, or your vault was made with another passkey.`),
        h('h3', {}, 'Create your vault'),
        h('p', { class: 'meta' }, 'Three vaults are made: this door, a master that keeps your keys, and your reader vault for your data. The vault server accepts a new vault only with a vault access key; it is written into your master, so no other device of yours needs it typed.'),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-access' }, 'Vault access key'), access, h('span', { class: 'hint' }, `Status: ${accessKeyWords()}. Sent only to ${ENDPOINT}.`)),
        pilot,
        missingSlot,
        h('p', {}, h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-create', onclick: () => createAccount(door, prf, access.value.trim(), missingSlot, mode) }, 'Create your vault')),
        h('h3', {}, 'Another device of an existing vault'),
        h('p', { class: 'meta' }, 'Type the recovery code once: it opens the recovery door, the master comes with its access key, and this passkey gets a door of its own.'),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-code' }, 'Recovery code'), code),
        h('p', { class: 'nr-acts' }, h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-join', onclick: () => joinWithCode(code.value, door, prf) }, 'Add this device with the code'), h('button', { type: 'button', class: 'btn quiet', onclick: () => drawLocked() }, 'Back')),
    )
}

function drawRecover() {
    const code = h('input', { type: 'text', class: 'input', id: 'nr-vault-code', autocomplete: 'off', placeholder: 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XX' })
    fill(
        h('h3', {}, 'Open with the recovery code'),
        h('p', { class: 'meta' }, 'The code derives the recovery door, which holds the key of your master. Use it on a device without your passkey.'),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-code' }, 'Recovery code'), code),
        h('p', { class: 'nr-acts' }, h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-join', onclick: () => joinWithCode(code.value, null, null) }, 'Open'), h('button', { type: 'button', class: 'btn quiet', onclick: () => drawLocked() }, 'Back')),
    )
}

/** The recovery code, shown once (sherpa@, PT decision "where the vault key lives", condition 3): the reader must type back its last
 *  four characters before the code is hidden, because a code shown once is the step a reader gets wrong. */
function recoveryNotice(shown) {
    const W = CFG.recovery || { shown: 'Your recovery code, shown once: ', why: '', ask: 'Type the last four characters of the code', button: 'Done', wrong: 'No match.', done: 'Confirmed.' }
    const tail = shown.replace(/[^A-Za-z0-9]/g, '').slice(-4).toUpperCase()
    const box = h('div', { class: 'notice nr-recovery', id: 'nr-vault-recovery-shown' })
    const msg = h('p', { class: 'meta', role: 'status' })
    const typed = h('input', { type: 'text', id: 'nr-vault-recovery-tail', class: 'input', maxlength: '8', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'The last four characters of the code' })
    box.append(
        h('p', {}, h('strong', {}, W.shown), h('span', { class: 'nr-mono' }, shown)),
        h('p', {}, W.why),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-recovery-tail' }, W.ask), typed),
        h('p', { class: 'nr-acts' }, h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-recovery-done', onclick: () => {
            if (typed.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase() !== tail) { msg.textContent = W.wrong; return }
            box.replaceChildren(h('p', { class: 'nr-ok' }, W.done))
        } }, W.button)),
        msg)
    return box
}

/** A door code in place of a passkey (the no-PRF path of vault onboarding): 128 random bits as 26 characters, the same form as
 *  a recovery code, from which the door is derived exactly as from a passkey's PRF bytes. Made here, shown once in a form a
 *  password manager offers to save, with an optional download; its last four characters are typed back before it is hidden.
 *  There is no recovery door in this mode: the code is the way in. The words are data (data/billing/vault.json doorcode). */
const DOOR_PATH = { path: 'door-secret', credId: '' }
function drawDoorCode(note) {
    const W = CFG.doorcode
    const code = h('input', { type: 'text', class: 'input', id: 'nr-vault-doorcode', autocomplete: 'off', spellcheck: 'false', placeholder: 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XX' })
    fill(note || null, h('h3', {}, W.title), h('p', { class: 'meta' }, W.hint),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-doorcode' }, W.open_label), code),
        h('p', { class: 'nr-acts' }, h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-doorcode-open', onclick: () => enterWithDoorCode(code.value) }, W.open),
            h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-doorcode-make', onclick: makeDoorCode }, W.make), h('button', { type: 'button', class: 'btn quiet', onclick: () => drawLocked() }, 'Back')))
}
async function enterWithDoorCode(text) {
    const W = CFG.doorcode, bytes = recoveryBytes(text)
    if (!bytes) { drawDoorCode(h('p', { class: 'nr-warn', id: 'nr-vault-doorcode-bad' }, W.bad)); return }
    const door = await doorFrom(bytes)
    try { await openAll({ door, ...DOOR_PATH }); await afterUnlock() }
    catch (e) { if (e.code === 'ENOVAULT') drawDoorCode(h('p', { class: 'nr-warn', id: 'nr-vault-doorcode-none' }, W.novault)); else drawDoorCode(h('p', { class: 'nr-warn' }, err(e))) }
}
function makeDoorCode() {
    const W = CFG.doorcode, rc = recoveryCode()
    const tail = rc.shown.replace(/[^A-Za-z0-9]/g, '').slice(-4).toUpperCase()
    const typed = h('input', { type: 'text', id: 'nr-vault-doorcode-tail', class: 'input', maxlength: '8', autocomplete: 'off', spellcheck: 'false', 'aria-label': W.ask })
    const msg = h('p', { class: 'meta', role: 'status' })
    const user = h('input', { type: 'text', name: 'username', value: 'promptugal.news vault', autocomplete: 'username', readonly: true, hidden: true })
    const secret = h('input', { type: 'password', name: 'password', id: 'nr-vault-doorcode-shown', value: rc.shown, autocomplete: 'new-password', readonly: true, class: 'input nr-mono' })
    const href = URL.createObjectURL(new Blob([rc.shown + '\n\n' + W.file + '\n'], { type: 'text/plain' }))
    fill(h('h3', {}, W.title),
        h('form', { onsubmit: e => e.preventDefault() }, h('p', {}, h('strong', {}, W.shown)), user, h('div', { class: 'field' }, secret),
            h('p', { class: 'nr-acts' }, secret && h('a', { class: 'btn quiet', href, download: 'promptugal-vault-key.txt', id: 'nr-vault-doorcode-download' }, W.download))),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-doorcode-tail' }, W.ask), typed),
        h('p', { class: 'nr-acts' }, h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-doorcode-go', onclick: async () => {
            if (typed.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase() !== tail) { msg.textContent = W.wrong; return }
            const door = await doorFrom(rc.bytes)
            try { await openAll({ door, ...DOOR_PATH }); await afterUnlock() }
            catch (e) { if (e.code === 'ENOVAULT') drawNoDoor(door, DOOR_PATH, 'door-secret'); else msg.textContent = err(e) }
        } }, W.go)), msg)
}

/** Vault onboarding (board/spec-vault-onboarding.md): where the site config says it is open, a reader with no access key can
 *  draw a pilot key from the public pool instead of asking for one; their browser makes their keys, opens the licence, and
 *  the access key lands in the field the create step reads. The words are data (data/billing/vault.json onboarding). */
async function offerPilotKey(slot, access, mode) {
    const W = CFG.onboarding
    if (!W) return
    let ob, cfg
    try { ob = await OB(); cfg = await ob.loadConfig() } catch (e) { return }
    if (!ob.isOpen(cfg)) return
    const msg = h('p', { class: 'meta', id: 'nr-vault-pilot-msg', role: 'status' })
    const btn = h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-pilot-draw', onclick: async () => {
        btn.disabled = true
        try {
            const r = await ob.drawKey(cfg, step => { msg.textContent = W[step] || '' }, mode || 'passkey-prf')
            access.value = r.accessKey; onboardCtx = r.ctx; msg.textContent = W.ready
        } catch (e) { msg.textContent = e && e.code === 'EEMPTY' ? W.empty : W.failed + err(e) } finally { btn.disabled = false }
    } }, W.button)
    slot.replaceChildren(h('p', { class: 'meta' }, W.hint), h('p', {}, btn), msg)
}

/** The account in one go: three vaults, the access key in the master, a recovery door, the account file. As newsroom.sgit.ai's createAccount. */
export async function createAccount(door, prf, token, slot, mode) {
    if (!token) { (slot || body).replaceChildren(missingKeyBox()); return }
    await withBusy('nr-vault-create', async () => {
        const st = h('p', { class: 'meta' }, 'Creating three vaults: six key derivations and three first commits…'); body.prepend(st)
        try {
            const sg = await client(token)
            const a = await NV.createAccount({ sgSend: sg, door, record: { kind: 'passkey', path: prf.path, credential_id: prf.credId, device: label || deviceId } })
            await NV.writeFile(a.master, TOKEN_FILE.folder, TOKEN_FILE.name, JSON.stringify({ token }))
            const byCode = mode === 'door-secret'      // a door code: no recovery door, the code is the way in
            if (!byCode) await NV.writeFile(a.master, '/', 'recovery.json', JSON.stringify({ v: 1, note: 'the recovery code is shown once and kept by the reader; this file records only that one exists', made: new Date().toISOString() }))
            await NV.publish(a.master)
            const rc = byCode ? null : recoveryCode()
            const added = byCode ? { doors: a.doors } : await NV.addDoor({ sgSend: sg, master: a.master, door: await doorFrom(rc.bytes), record: { kind: 'recovery', device: label || deviceId } })
            await NV.writeFile(a.reader, '/activity', 'account.json', JSON.stringify(S.accountFile(MCFG, deviceId), null, 1))
            await NV.publish(a.reader)
            state.vaults = { door: a.door, master: a.master, reader: a.reader, doors: added.doors || a.doors, record: a.record, token }
            let claimNote = null
            if (onboardCtx) {
                const W = CFG.onboarding || {}
                try { const r = await (await OB()).afterCreate(onboardCtx, a.master); claimNote = h('p', { class: 'meta', id: 'nr-vault-claimed' }, r.posted ? W.claimed : W.claim_failed) } catch (e) { claimNote = h('p', { class: 'meta', id: 'nr-vault-claimed' }, W.claim_failed) }
                onboardCtx = null
            }
            session.set({ door, path: prf.path, credId: prf.credId, token }); status()
            await drawUnlocked(h('div', {}, rc ? recoveryNotice(rc.shown) : null, claimNote))
        } catch (e) { st.replaceWith(h('p', { class: 'nr-warn' }, e.code === 'EEXISTS' ? 'A vault already exists at this door: sign in again to open it.' : /401|403|access token/i.test(String(e && e.message)) ? `The vault server refused that access key (${err(e)}). Nothing was created.` : err(e))) }
    })
}

async function joinWithCode(codeText, door, prf) {
    const bytes = recoveryBytes(codeText)
    if (!bytes) { body.prepend(h('p', { class: 'nr-warn' }, 'That is not a 26-character recovery code.')); return }
    await withBusy('nr-vault-join', async () => {
        const st = h('p', { class: 'meta' }, 'Opening the recovery door…'); body.prepend(st)
        try {
            const rdoor = await doorFrom(bytes)
            const u = await openAll({ door: rdoor, path: 'recovery' })
            if (door && prf) {
                st.textContent = 'Adding this passkey as a door…'
                if (!u.token) throw new Error('The master holds no access key, so a door cannot be written from here.')
                const sg = await client(u.token)
                await NV.addDoor({ sgSend: sg, master: u.master, door, record: { kind: 'passkey', path: prf.path, credential_id: prf.credId, device: label || deviceId } })
                session.set({ door, path: prf.path, credId: prf.credId, token: u.token })
            }
            await afterUnlock(h('p', { class: 'nr-ok' }, door ? 'This passkey now opens your vault; the code is not needed here again.' : 'Opened with the recovery code.'))
        } catch (e) { st.replaceWith(h('p', { class: 'nr-warn' }, e.code === 'ENOVAULT' ? 'No vault answers to that code.' : err(e))) }
    })
}

/** After a sign-in: bring in what the vault holds that this browser does not, so the meter shows the whole account at once. */
async function afterUnlock(note) {
    const v = state.vaults
    // the issuer's messages for a vault made through onboarding (the mailbox), best effort and silent when there are none
    OB().then(async m => { const cfg = await m.loadConfig(); if (!m.isOpen(cfg) || !v.master) return; const got = await m.checkMailbox(v.master, cfg); if (got.length) window.dispatchEvent(new CustomEvent('pt:mailbox', { detail: got })) }).catch(() => { })
    if (!v.reader) return drawUnlocked(note)
    fill(note || null, h('p', { class: 'meta' }, 'Reading your devices’ files…'))
    let c = null
    try { try { await v.reader.pull() } catch (e) { /* fine */ } c = await readAll() } catch (e) { c = null }
    if (c && S.inbound(c, readState() || emptyState(), deviceId).any) return merge()
    return drawUnlocked(note)
}

async function drawUnlocked(note) {
    const v = state.vaults, st = readState() || emptyState()
    const own = (st.log || []).filter(e => !e.device || e.device === deviceId).length
    const device = h('input', { type: 'text', class: 'input', id: 'nr-vault-label', value: label, maxlength: 40, placeholder: 'this device, e.g. "my phone"' })
    device.addEventListener('change', () => { label = device.value.trim(); try { localStorage.setItem(K.label, label) } catch (e) { /* fine */ } })
    const access = h('input', { type: 'password', class: 'input', id: 'nr-vault-access', autocomplete: 'off', placeholder: 'kept in memory, then inside your master vault' })
    const p = S.pending(st, lastSync(), savedList())
    fill(
        note || null,
        h('h3', {}, 'Your vault is open'),
        kv([
            ['Device', h('span', {}, label ? h('b', {}, label) : null, label ? ' · ' : '', h('span', { class: 'nr-mono' }, deviceId))],
            ['Door', h('span', { class: 'nr-mono' }, `${v.door.vaultId}${session.get() && session.get().path ? ' · ' + session.get().path : ''}`)],
            ['Master', h('span', { class: 'nr-mono' }, v.master.vaultId)],
            ['Reader vault', v.reader ? h('span', { class: 'nr-mono' }, v.reader.vaultId) : 'none'],
            ['Access key', v.token ? 'in your master vault; in memory here' : 'none in your master yet'],
            ['Here', `${own} read(s) of this device, ${(st.log || []).length - own} brought in, balance ${money(st.balance)}`],
            ['Not yet in the vault', h('span', { id: 'nr-vault-pending-row' }, p.any ? S.describePending(p) : 'nothing: the vault has everything of this device')],
            ['Not yet here', h('span', { id: 'nr-vault-inbound' }, 'reading the vault…')],
        ]),
        h('div', { class: 'field' }, h('label', { for: 'nr-vault-label' }, 'This device’s name'), device),
        v.token ? null : h('div', { id: 'nr-vault-notoken' },
            missingKeyBox('nr-vault-missing-unlocked'),
            h('div', { class: 'field' }, h('label', { for: 'nr-vault-access' }, 'Vault access key'), access),
            h('p', {}, h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-add-token', onclick: () => addToken(access.value.trim()) }, 'Add the access key'))),
        h('p', { class: 'nr-acts' },
            h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-sync', disabled: !v.token || !v.reader, onclick: sync }, 'Update the vault'),
            h('button', { type: 'button', class: 'btn primary', id: 'nr-vault-bring', hidden: true, onclick: () => merge() }, 'Bring them here'),
            h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-refresh', onclick: () => refreshAcross() }, 'Check the vault'),
            h('button', { type: 'button', class: 'btn quiet', id: 'nr-vault-forget', onclick: () => { session.set(null); state.vaults = null; state.sg = null; status(); drawLocked(h('p', { class: 'meta' }, 'Signed out on this device; the vault is unchanged.')) } }, 'Sign out here')),
        h('div', { id: 'nr-vault-out', 'aria-live': 'polite' }),
        h('h3', {}, 'Across your devices'), h('div', { id: 'nr-vault-across' }, h('p', { class: 'meta' }, 'Reading your devices’ files…')),
    )
    await refreshAcross()
}

async function addToken(token) {
    if (!token) { document.getElementById('nr-vault-missing-unlocked').scrollIntoView({ block: 'nearest' }); return }
    await withBusy('nr-vault-add-token', async () => {
        try {
            const sg = await client(token)
            await NV.writeFile(state.vaults.master, TOKEN_FILE.folder, TOKEN_FILE.name, JSON.stringify({ token }))
            await NV.publish(state.vaults.master)
            state.vaults.token = token
            session.set({ ...(session.get() || {}), token }); status()
            await drawUnlocked(h('p', { class: 'nr-ok' }, 'The access key is in your master vault now; every device of yours gets it from there.'))
        } catch (e) { body.prepend(h('p', { class: 'nr-warn' }, /401|403|access token/i.test(String(e && e.message)) ? `The vault server refused that key (${err(e)}).` : err(e))) }
    })
}

async function readAll() {
    const v = state.vaults
    const names = (await NV.listFiles(v.reader, S.PATHS.devicesFolder).catch(() => [])).filter(n => n.endsWith('.json'))
    const files = []
    for (const n of names) { try { files.push(await NV.readJson(v.reader, `${S.PATHS.devicesFolder}/${n}`)) } catch (e) { /* skip a broken file */ } }
    const account = await NV.readJson(v.reader, S.PATHS.account).catch(() => null)
    state.consolidated = S.consolidate(files, account || S.accountFile(MCFG, deviceId))
    return state.consolidated
}

async function refreshAcross() {
    const box = document.getElementById('nr-vault-across'); if (!box || !state.vaults || !state.vaults.reader) return
    try {
        const c = await readAll()
        const i = state.inbound = S.inbound(c, readState() || emptyState(), deviceId)
        const ib = document.getElementById('nr-vault-inbound'); if (ib) ib.textContent = i.any ? S.describeInbound(i) : 'nothing: this browser has everything in the vault'
        const bring = document.getElementById('nr-vault-bring'); if (bring) bring.hidden = !i.any
        box.replaceChildren(
            c.devices.length ? h('div', { class: 'table' }, h('table', { class: 'ledger' },
                h('thead', {}, h('tr', {}, h('th', {}, 'Device'), h('th', { class: 'num' }, 'Reads'), h('th', { class: 'num' }, 'Spent'), h('th', { class: 'num' }, 'Top-ups'))),
                h('tbody', {}, c.devices.map(d => h('tr', {}, h('td', {}, h('b', {}, d.label || d.id), d.id === deviceId ? ' (this one)' : '', h('br'), h('span', { class: 'meta' }, `last update ${when(d.last_sync) || 'never'}`)), h('td', { class: 'num' }, String(d.reads)), h('td', { class: 'num' }, `${d.spent}p`), h('td', { class: 'num' }, String(d.topups)))))))
                : h('p', { class: 'meta' }, 'No device has updated this vault yet.'),
            kv([['The whole account', `${c.totals.reads} read(s) · ${money(c.totals.spent)} spent · ${money(c.totals.credit)} topped up · balance ${money(c.totals.balance)}`]]))
    } catch (e) { box.replaceChildren(h('p', { class: 'nr-warn' }, `The devices could not be read: ${err(e)}`)) }
}

/** This device's file and the saved items, written into the reader vault and published once: the one write of the model. */
export async function writeDevice() {
    const v = state.vaults, st = readState() || emptyState()
    try { await v.reader.pull() } catch (e) { /* fine */ }
    const prev = await NV.readJson(v.reader, S.PATHS.device(deviceId)).catch(() => null)
    const file = S.combine(prev, S.extract(st, { id: deviceId, label, agent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '' }, prev))
    await NV.writeFile(v.reader, S.PATHS.devicesFolder, `${deviceId}.json`, JSON.stringify(file, null, 1))
    if (!(await NV.readJson(v.reader, S.PATHS.account).catch(() => null))) await NV.writeFile(v.reader, '/activity', 'account.json', JSON.stringify(S.accountFile(MCFG, deviceId), null, 1))
    const ids = (await NV.listFiles(v.reader, S.PATHS.devicesFolder).catch(() => [])).filter(n => n.endsWith('.json')).map(n => n.slice(0, -5)).sort()
    await NV.writeFile(v.reader, '/activity', 'index.json', JSON.stringify({ v: 1, devices: ids, note: 'the device files in activity/devices/, for apps that cannot list a folder' }, null, 1))
    const items = savedList().filter(x => !x.in_vault), done = []
    for (const x of items) { const a = S.appPath(x.path); if (!a) continue; await NV.writeFile(v.reader, a.folder, a.name, JSON.stringify(x.data, null, 1)); done.push(x.path) }
    await NV.publish(v.reader)
    markSaved(done)
    try { localStorage.setItem(K.last, file.device.last_sync) } catch (e) { /* fine */ }
    renderPending()
    return { file, items: done.length }
}
async function sync() {
    await withBusy('nr-vault-sync', async () => {
        const out = document.getElementById('nr-vault-out'); if (out) out.replaceChildren(h('p', { class: 'meta' }, 'Writing this device’s records as one commit, then publishing…'))
        try {
            const r = await writeDevice()
            if (out) out.replaceChildren(h('p', { class: 'nr-ok', id: 'nr-vault-synced' }, `Updated: ${S.describe(r.file)}${r.items ? ` and ${r.items} saved item(s)` : ''}, published. Update ${r.file.device.syncs} from this device.`))
            await refreshAcross()
        } catch (e) { if (out) out.replaceChildren(h('p', { class: 'nr-warn' }, `The vault was not updated: ${err(e)}`)) }
    })
}

/** The vault's records into this browser, then a reload so the meter shows the whole account. */
async function merge() {
    const st = readState() || emptyState()
    const c = state.consolidated || await readAll()
    const m = S.mergeInto(st, c, deviceId)
    try { localStorage.setItem(MCFG.storageKey, JSON.stringify(m.state)) } catch (e) { body.prepend(h('p', { class: 'nr-warn' }, 'This browser’s storage refused the write.')); return }
    // no reload any more: the keys live in this page's memory only (PT decision, option B), and a reload would lose them
    body.prepend(h('p', { class: 'nr-ok', id: 'nr-vault-merged' }, `Brought in: ${m.added.reads} read(s), ${m.added.topups} top-up(s), ${m.added.personas} persona(s) from your other devices. The meter shows the whole account on the next page you open.`))
}

// ------------------------------------------------------------ the other tabs
function drawReading() {
    const st = readState() || emptyState()
    const log = (st.log || []).slice(0, 40)
    secs.reading.replaceChildren(
        h('h3', {}, 'What you have read'),
        kv([['Balance', money(st.balance)], ['Pages', String((st.log || []).length)], ['Spent', money(st.spent || 0)]]),
        log.length ? h('ul', { class: 'nr-list' }, log.map(e => h('li', {}, h('a', { href: e.path }, e.title || e.path), h('br'), h('span', { class: 'meta' }, `${when(e.at)} · ${String(e.kind || '').replace('_', ' · ')} · ${e.declined ? 'declined' : (e.cost || 0) + 'p'}${e.device ? ' · another device' : ''}`))))
            : h('p', { class: 'meta' }, 'Nothing read in this browser yet.'),
        h('p', {}, h('a', { href: at('account/index.html') }, 'Your whole reading account'), '.'))
}
async function drawSaved() {
    const local = savedList().sort((a, b) => a.path.localeCompare(b.path))
    secs.saved.replaceChildren(
        h('h3', {}, 'What the site keeps for you'),
        h('p', { class: 'meta' }, 'Parts of this site (such as the newsroom’s agent, for your conversations) can keep things for you. They are kept in this browser at once, and in your vault, under apps/, when it is open or the next time you update it.'),
        local.length ? h('ul', { class: 'nr-list', id: 'nr-vault-saved' }, local.map(x => h('li', {}, h('span', { class: 'nr-mono' }, x.path), h('br'), h('span', { class: 'meta' }, `${when(x.at)} · ${x.in_vault ? 'in your vault and this browser' : 'only in this browser'}`))))
            : h('p', { class: 'meta', id: 'nr-vault-saved-empty' }, 'Nothing saved yet.'),
        h('div', { id: 'nr-vault-saved-remote' }))
    if (!session.get()) return
    try {
        const paths = await listItems('')
        const box = document.getElementById('nr-vault-saved-remote')
        if (box) box.replaceChildren(h('h3', {}, 'In your vault'), paths.length ? h('ul', { class: 'nr-list' }, paths.map(p => h('li', { class: 'nr-mono' }, `apps/${p}.json`))) : h('p', { class: 'meta' }, 'Nothing under apps/ yet.'))
    } catch (e) { /* the local list stands */ }
}
async function drawKeys() {
    const v = state.vaults
    if (!v) { secs.keys.replaceChildren(h('h3', {}, 'Your vaults'), h('p', { class: 'meta' }, 'Sign in, in the Vault tab, to see the vaults of your account and their keys.')); return }
    const rec = session.get() || {}
    secs.keys.replaceChildren(
        h('h3', {}, 'Your vaults'),
        h('p', { class: 'meta' }, 'Every vault of your account, with its key, so you can open any of them on your own (sgit clone <key>, or the key pasted into dev.vault.sgraph.ai). A key opens that vault to whoever holds it, and the master’s opens everything: treat them like the recovery code. A key is shown only when you press Reveal, and this page keeps none of them.'),
        kv([
            ['This door', h('span', {}, h('span', { class: 'nr-mono' }, `${v.door.vaultId}${rec.path ? ' · ' + rec.path : ''}`), h('br'), secret(NV.prefixedKey(v.door), 'the key'))],
            ...((v.doors || []).filter(d => d.vault_id !== v.door.vaultId).map(d => [`Door · ${d.kind || 'passkey'}`, h('span', {}, h('span', { class: 'nr-mono' }, d.vault_id), h('br'), d.vault_key ? secret(d.vault_key, 'the key') : '')])),
            ['Master', h('span', {}, h('span', { class: 'nr-mono' }, v.master.vaultId), h('br'), secret(NV.prefixedKey(v.master), 'the key'))],
            v.reader ? ['Reader vault', h('span', {}, h('span', { class: 'nr-mono' }, v.reader.vaultId), h('br'), secret(NV.prefixedKey(v.reader), 'the key'))] : null,
        ]))
}

// ------------------------------------------------------------ the hook's other half (assets/vault/boot.js calls these)
/** One saved item into the reader vault: apps/<path>.json, one commit, published. Needs the vault open with an access key. */
export async function saveItem(path, data) {
    const a = S.appPath(path); if (!a) throw new Error(`not a path for the vault: ${path}`)
    const v = await ensureOpen()
    if (!v.token) throw new Error('the vault holds no access key yet, so nothing can be written')
    await NV.writeFile(v.reader, a.folder, a.name, JSON.stringify(data, null, 1))
    await NV.publish(v.reader)
    return { path: a.path, file: a.file }
}
export async function loadItem(path) {
    const a = S.appPath(path); if (!a) return null
    const v = await ensureOpen()
    return NV.readJson(v.reader, a.file)
}
/** The saved paths under prefix in the reader vault (apps/), without .json. */
export async function listItems(prefix) {
    const v = await ensureOpen()
    const out = []
    const walk = async (folder, depth) => {
        for (const n of await NV.listFiles(v.reader, folder).catch(() => [])) {
            if (n.endsWith('/')) { if (depth < 4) await walk(`${folder}/${n.slice(0, -1)}`, depth + 1) }
            else if (n.endsWith('.json')) out.push(`${folder}/${n}`.replace(/^\/apps\//, '').replace(/\.json$/, ''))
        }
    }
    await walk(S.PATHS.apps, 0)
    return out.filter(p => p.startsWith(String(prefix || '')))
}
export async function removeItem(path) {
    const a = S.appPath(path); if (!a) return false
    const v = await ensureOpen()
    if (!v.token) return false
    const gone = await NV.removeFile(v.reader, a.folder, a.name)
    if (gone) await NV.publish(v.reader)
    return gone
}

renderPending()
