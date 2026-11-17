/**
 * pair.js: the pairing page (/account/pair.html), one reader across devices, step 1, as a DRY RUN: nothing is sent.
 * The protocol is pair-core.js; this file is the page: the device key in IndexedDB, show an offer (QR code, copy, link),
 * read an offer (paste or the link's #fragment, cleared at once), the match code, and the hello sealed and signed, shown
 * but not sent until the vault access key exists. security@'s conditions P1 to P8: board/passes/2026-11-17-pairing-step-1.md.
 * Every outside string is written with textContent, never as HTML. dev@PrompTugal.dinis, 17 November 2026.
 */
import * as P from './pair-core.js'
import qrcode from '../vendor/qrcode-generator/2.0.4/qrcode.mjs'

// P3: read the offer from the fragment, then clear it from the address bar and the history entry at once
const fromLink = location.hash.length > 1 ? location.hash.slice(1) : ''
if (fromLink) history.replaceState(null, '', location.pathname + location.search)

const root = document.getElementById('pair')
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
const say = (box, text, cls = '') => { box.replaceChildren(el('p', cls, text)); return box }

// ------------------------------------------------------------ IndexedDB: the device key and the nonces seen
const DB = 'nr.device.v1'
const idb = () => new Promise((ok, no) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => { r.result.createObjectStore('kv'); r.result.createObjectStore('nonces') }
    r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error)
})
const tx = async (store, mode, fn) => { const db = await idb(); return new Promise((ok, no) => { const t = db.transaction(store, mode), s = t.objectStore(store), r = fn(s); t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error) }) }
const getDevice = () => tx('kv', 'readonly', s => s.get('device'))
const putDevice = d => tx('kv', 'readwrite', s => s.put(d, 'device'))
const seen = async n => !!(await tx('nonces', 'readonly', s => s.get(n)))
const markSeen = (n, until) => tx('nonces', 'readwrite', s => s.put(until, n))
const forgetOld = () => tx('nonces', 'readwrite', s => { const r = s.openCursor(); r.onsuccess = () => { const c = r.result; if (c) { if (Date.parse(c.value) < Date.now()) c.delete(); c.continue() } }; return null })

async function device() {
    let d = await getDevice()
    if (d && d.bundle && d.keys) return d
    const box = say(el('div', 'pair-status'), 'Making this device\'s key (a few seconds the first time)…'); root.append(box)
    d = await P.newDevice(guessName()); await putDevice(d); box.remove()
    return d
}
// the default name: the browser's family and the platform, never the full user agent; the reader can change it
function guessName() {
    const ua = navigator.userAgent, b = /Firefox\//.test(ua) ? 'Firefox' : /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser'
    const os = /iPhone|iPad/.test(ua) ? 'iPhone or iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : ''
    return P.cleanName(os ? `${b} on ${os}` : b)
}

// ------------------------------------------------------------ show an offer (device A)
function qrSvg(text) {
    const q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make()
    const n = q.getModuleCount(), cell = 4, size = (n + 8) * cell
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`); svg.setAttribute('width', String(Math.min(size, 360))); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Pairing code')
    const bg = document.createElementNS(ns, 'rect'); bg.setAttribute('width', size); bg.setAttribute('height', size); bg.setAttribute('fill', '#fff'); svg.append(bg)
    let d = ''
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${(c + 4) * cell} ${(r + 4) * cell}h${cell}v${cell}h-${cell}z`
    const path = document.createElementNS(ns, 'path'); path.setAttribute('d', d); path.setAttribute('fill', '#000'); svg.append(path)
    return svg
}

async function showOffer(dev, out) {
    const offer = P.makeOffer(dev, { name: dev.bundle.label, lane: null })   // dry run: no lane until the vault access key exists
    const text = P.offerText(offer), link = P.offerLink(offer, new URL('../', location.href).href)
    out.replaceChildren()
    out.append(el('p', '', `Show this on the device that has your vault. On the other device, open this page and paste the text, or open the link. It is valid for ${P.OFFER_MINUTES} minutes and works once.`))
    try { out.append(qrSvg(text)) } catch (e) { out.append(el('p', 'note', 'The code is too long for one QR code; copy the text or the link instead.')) }
    const row = el('p', 'pair-actions')
    const copy = el('button', 'btn', 'Copy the text'); copy.type = 'button'
    copy.onclick = async () => { try { await navigator.clipboard.writeText(text); copy.textContent = 'Copied' } catch (e) { copy.textContent = 'Copy failed: select the text below' } }
    const copyLink = el('button', 'btn', 'Copy the link'); copyLink.type = 'button'
    copyLink.onclick = async () => { try { await navigator.clipboard.writeText(link); copyLink.textContent = 'Copied' } catch (e) { copyLink.textContent = 'Copy failed' } }
    row.append(copy, ' ', copyLink); out.append(row)
    const pre = el('textarea', 'pair-text'); pre.readOnly = true; pre.rows = 4; pre.value = text; out.append(pre)
    out.append(el('p', 'note', `This device: ${dev.bundle.label || 'unnamed'} (${dev.bundle.signing_fingerprint}). Expires ${offer.expires.replace('T', ' ').replace('Z', ' UTC')}.`))
    out.append(el('p', 'note', 'Dry run: the other device can check this code and prepare its answer, but nothing is sent yet. Sending needs the vault access key, which is not issued yet.'))
}

// ------------------------------------------------------------ read an offer (device B)
async function readOffer(dev, text, out) {
    out.replaceChildren()
    const r = await P.readOffer(text, { seen })
    if (!r.offer) { out.append(el('p', 'pair-bad', 'This is not a pairing code this page can use:')); const ul = el('ul'); for (const p of r.problems) ul.append(el('li', '', p)); out.append(ul); return }
    if (r.offer.device === dev.bundle.signing_fingerprint) { out.append(el('p', 'pair-bad', 'That is this device\'s own code. Open it on your other device.')); return }
    // P2 and replay: this nonce is spent on this device as soon as it is read, until it expires
    await markSeen(r.offer.nonce, r.offer.expires)
    const code = await P.matchCode(r.offer.nonce, r.offer.device, dev.bundle.signing_fingerprint)
    out.append(el('p', '', 'Pair with:'))
    out.append(el('p', 'pair-who', `${r.offer.name || 'a device with no name'} (${r.offer.device})`))
    // P1 (security@'s post-review): only this device can show the code in step 1; the binding check is on the other
    // device, whose Allow waits for this code once hellos are received (step 4)
    out.append(el('p', 'pair-code', code.replace(/(\d{3})(\d{3})/, '$1 $2')))
    out.append(el('p', '', 'Your other device will show this code: allow there only if it matches.'))
    const go = el('button', 'btn', 'Prepare the answer'); go.type = 'button'
    go.onclick = async () => {
        go.disabled = true
        try {
            const hello = await P.makeHello(dev, r.offer, r.bundle, { name: dev.bundle.label })
            out.append(el('p', '', `The answer is sealed to that device's key and signed by this one (${hello.length} characters). Dry run: it is not sent. Sending needs the vault access key, which is not issued yet.`))
        } catch (e) { out.append(el('p', 'pair-bad', 'Could not prepare the answer: ' + e.message)) }
    }
    out.append(go)
}

// ------------------------------------------------------------ the page
async function main() {
    if (!root) return
    if (!globalThis.crypto || !crypto.subtle || !window.indexedDB) { say(root, 'This browser cannot keep a device key (no Web Crypto or IndexedDB). Try a current browser.'); return }
    forgetOld().catch(() => {})
    const dev = await device()
    root.replaceChildren()
    root.append(el('p', 'note', `This device: ${dev.bundle.label || 'unnamed'} · ${dev.bundle.signing_fingerprint}`))
    const showBox = el('div', 'pair-box'), readBox = el('div', 'pair-box')
    const show = el('button', 'btn', 'Show a pairing code'); show.type = 'button'; show.onclick = () => showOffer(dev, showBox).catch(e => say(showBox, 'Could not make the code: ' + e.message))
    root.append(el('h2', '', 'This device has your vault'), show, showBox)
    const area = el('textarea', 'pair-text'); area.rows = 4; area.placeholder = 'Paste the pairing text or link here'
    const read = el('button', 'btn', 'Check it'); read.type = 'button'; read.onclick = () => readOffer(dev, area.value, readBox).catch(e => say(readBox, 'Could not read it: ' + e.message))
    root.append(el('h2', '', 'This device should join'), area, read, readBox)
    if (fromLink) await readOffer(dev, '#' + fromLink, readBox)
}
main().catch(e => say(root, 'The pairing page could not start: ' + e.message))
