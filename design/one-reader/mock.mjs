// designer@PrompTugal.dinis, 17 Nov 2026: the pairing screens and the personal front page
// (board/spec-one-reader-across-devices.md; designer@'s look: board/spec-one-reader-the-look.md).
// Injects the proposed markup into the built /about/ page served on :8765 and screenshots it. No AI.
// The QR code is real (the vendored qrcode-generator) but encodes an example offer with no real token or key.
//   python3 -m http.server 8765 &  node design/one-reader/mock.mjs
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import qrcode from '../../newsroom/tools/vendor/qrcode-generator-2.0.4.mjs'
const { chromium } = createRequire(import.meta.url)('playwright')
const J = f => JSON.parse(readFileSync(f, 'utf8'))

// An example offer: the shape of the spec, every value a placeholder.
const offer = { v: 1, kind: 'promptugal.news/pair/v1', device: 'sha256:EXAMPLE0000000000', lane: { vault: 'EXAMPLE', token: 'EXAMPLE-NOT-A-TOKEN' }, nonce: 'EXAMPLENONCE', expires: '2026-11-17T11:10:00Z' }
const qr = qrcode(0, 'M'); qr.addData('https://promptugal.news/pair/#' + Buffer.from(JSON.stringify(offer)).toString('base64url')); qr.make()
const QR = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })

const phone = (title, body) => `<div class="ph"><div class="ph-bar"><span class="ph-mark">PT<i>.news</i></span><span>${title}</span></div><div class="ph-body">${body}</div></div>`
const match = '<span class="mc">7F A1 · 3C 0D</span>'
const pair = `<section class="or-row"><h2>Pairing: four screens</h2><p class="or-note">A shows the offer; B scans or pastes it; A allows; both show the same match code. The match code is the first characters of the two fingerprints, as in Bluetooth pairing.</p><div class="or-phones">
${phone('Your devices', `<p class="k">Step 1 of 3 · on this device</p><h3>Open your PrompTugal.news on another device</h3><div class="qr">${QR}</div><p class="t">On your phone, open <b>PrompTugal.news → You → Add this device</b> and point the camera here.</p><p class="row"><button class="b2">Copy as text</button><span class="tm">expires in 9:41</span></p><p class="fine">This code lets the other device <b>send</b> you a request, nothing more. Nothing is opened until you say yes here.</p>`)}
${phone('Add this device', `<p class="k">Step 2 of 3 · on the new device</p><h3>Join Dinis's MacBook, Safari?</h3><dl><dt>Device</dt><dd>MacBook · Safari</dd><dt>Its key</dt><dd class="m">sha256:7fa1…</dd></dl><p class="t">Say yes only if you are holding both devices, or you know the person who is.</p><button class="b1">Yes, ask to join</button><button class="b3">Not now</button>`)}
${phone('Your devices', `<p class="k">Step 3 of 3 · on this device</p><h3>An iPhone wants to join</h3><p class="t">Check this code is the same on both screens:</p>${match}<p class="t">If you allow it, the iPhone gets the key to your reading history, places and saved stories.</p><button class="b1">Allow</button><button class="b3">Refuse</button>`)}
${phone('Your devices', `<p class="k">Done</p><h3>Paired</h3><ul class="dev"><li><b>This MacBook</b><span>Safari · since 12 Nov</span></li><li><b>iPhone</b><span>the app · just now</span></li></ul><p class="t">Both now show the same places, the same "since your last visit" and the same saved stories.</p><p class="fine">To remove a device, open it here. Removing changes the key on the others; until that ships, this page says so.</p>`)}
</div></section>`

// Since your last visit, from the real place files: Loulé, the Algarve, Portugal, newest first.
const items = id => (J(`data/by-place/${id}.json`).ai_news || []).filter(x => x.date && x.date > LAST).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
const LAST = '2026-11-05' // the reader's last visit in the mock-up
const DAY = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const ring = (label, name, id, n) => `<div class="rg rg-${n}"><h3><i></i>${label} <b>${name}</b></h3><ol>${items(id).map(x => `<li><a href="#">${x.title}</a><span>${x.publisher || ''} · ${DAY(x.date)}</span></li>`).join('') || '<li class="none">Nothing new here since your last visit.</li>'}</ol></div>`
const since = `<section class="or-row"><h2>The front page, for a reader in Loulé</h2>
<div class="wy"><span>Reading from <b>Loulé</b></span><a href="#">change</a><span class="wy-s">set by you on this browser · not sent anywhere</span></div>
<div class="sl"><div class="sl-h"><h3>Since your last visit</h3><span>Thu 5 Nov, 21:40 · on your iPhone</span></div>
<div class="rgs">${ring('In your town', 'Loulé', 'loule', 1)}${ring('In your region', 'the Algarve', 'algarve', 2)}${ring('In the country', 'Portugal', 'portugal', 3)}</div></div>
<h2 style="margin-top:34px">The first visit: one question</h2>
<div class="fv"><h3>Where are you reading from?</h3><p>We put your town's news first. The answer stays in this browser.</p><div class="fv-b"><button class="b1">Use my location</button><button class="b2">Pick a town</button><button class="b3">Skip: all of Portugal</button></div><p class="fine">"Use my location" asks your browser, matches the nearest place on this device, and sends nothing.</p></div></section>`

const CSS = `.or{max-width:1152px;margin:0 auto;padding:24px 0 60px;font-family:var(--serif,Georgia);color:var(--ink,#16181b)}
.or h1{font:600 38px var(--serif,Georgia);margin:0 0 4px}.or>p{font:15px var(--sans,system-ui);color:var(--ink-3,#555)}
.or h2{font:700 11px var(--mono,monospace)!important;letter-spacing:.12em!important;text-transform:uppercase!important;border:0!important;border-top:2px solid var(--ink,#111)!important;padding:10px 0 0!important;margin:26px 0 8px!important}
.or h3{font:600 20px/1.2 var(--serif,Georgia);margin:4px 0 10px;text-transform:none;letter-spacing:0;border:0;padding:0}
.or-note{font:14px var(--sans,system-ui);color:var(--ink-3,#555);max-width:720px}
.or-phones{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.ph{background:var(--paper,#f5f2ea);border:1px solid #cfc8b8;border-radius:22px;overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,.08);min-height:520px}
.ph-bar{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #ddd6c8;font:600 12px var(--sans,system-ui)}
.ph-mark{font:700 15px var(--serif,Georgia)}.ph-mark i{font-weight:400;color:#006600}
.ph-body{padding:16px 16px 18px}.ph .k{font:700 10.5px var(--mono,monospace);letter-spacing:.08em;text-transform:uppercase;color:#006600;margin:0}
.ph .t{font:14px/1.45 var(--sans,system-ui);margin:0 0 12px}.ph .fine,.fv .fine{font:12px/1.4 var(--sans,system-ui);color:var(--ink-3,#666);margin:10px 0 0}
.qr{background:#fff;padding:12px;border-radius:6px;margin:6px 0 12px;width:100%;box-sizing:border-box;max-width:220px}.qr svg{display:block;width:100%;height:auto}
.row{display:flex;justify-content:space-between;align-items:center;gap:8px}.tm{font:12px var(--mono,monospace);color:var(--ink-3,#666)}
.b1,.b2,.b3{font:600 14px var(--sans,system-ui);border-radius:999px;padding:10px 16px;cursor:pointer;display:block;width:100%;margin:6px 0 0;min-height:44px}
.b1{background:#16181b;color:#f5f2ea;border:1px solid #16181b}.b2{background:transparent;border:1px solid #16181b;color:#16181b;width:auto}.b3{background:transparent;border:0;color:var(--ink-3,#555);text-decoration:underline}
.ph dl{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font:14px var(--sans,system-ui);margin:0 0 12px}.ph dt{color:var(--ink-3,#666)}.ph dd{margin:0}.ph .m{font-family:var(--mono,monospace);font-size:13px}
.mc{display:block;text-align:center;font:600 26px var(--mono,monospace);letter-spacing:.06em;background:#ece7db;border-radius:6px;padding:14px 0;margin:4px 0 12px}
.dev{list-style:none;margin:0 0 12px;padding:0}.dev li{display:flex;justify-content:space-between;gap:8px;padding:10px 0;border-bottom:1px solid #ddd6c8;font:14px var(--sans,system-ui)}.dev span{color:var(--ink-3,#666)}
.wy{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;font:14px var(--sans,system-ui);padding:8px 0}.wy a{color:inherit}.wy-s{color:var(--ink-3,#666);font-size:12px}
.sl{background:#0a3a14;color:#f6f3ec;border-radius:4px;padding:18px 20px 20px}
.sl-h{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px 12px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:10px;margin-bottom:14px}
.sl-h h3{color:#fff;margin:0;font-size:24px}.sl-h span{font:12px var(--mono,monospace);color:#cfe0cf}
.rgs{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:22px}
.rg h3{font:700 11px var(--mono,monospace);letter-spacing:.1em;text-transform:uppercase;color:#cfe0cf;display:flex;gap:8px;align-items:center;margin:0 0 8px}.rg h3 b{color:#fff}
.rg h3 i{display:inline-block;border:2px solid #8fd18f;border-radius:50%;width:8px;height:8px}.rg-2 h3 i{width:12px;height:12px}.rg-3 h3 i{width:16px;height:16px}
.rg ol{list-style:none;margin:0;padding:0}.rg li{padding:8px 0;border-top:1px solid rgba(255,255,255,.14)}
.rg a{color:#fff;text-decoration:none;font:500 16px/1.3 var(--serif,Georgia)}.rg-1 a{font-size:19px}.rg li.none{font:14px var(--sans,system-ui);color:#cfe0cf}.rg li span{display:block;font:12px var(--sans,system-ui);color:#cfe0cf;margin-top:3px}
.fv{border:1px solid #cfc8b8;background:#ece7db;border-radius:4px;padding:18px 20px;max-width:640px}.fv p{font:15px var(--sans,system-ui);margin:0 0 10px}
.fv-b{display:flex;flex-wrap:wrap;gap:8px}.fv-b .b1,.fv-b .b2{width:auto}.fv-b .b3{width:auto}
@media(max-width:820px){.or{padding:16px}.or-phones{grid-template-columns:1fr}.ph{min-height:0}.rgs{grid-template-columns:1fr}}`
const html = `<div class="or"><h1>One reader across devices</h1><p>designer@'s look for the pairing screens and the personal front page, 17 November 2026. Headlines are the real ones in the place files; the QR code encodes an example with no key or token.</p>${pair}${since}</div>`

const out = 'design/decisions/one-reader'; mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:8765/about/', { waitUntil: 'load' }); await p.waitForTimeout(600)
  await p.evaluate(([c, h]) => { const s = document.createElement('style'); s.textContent = c; document.head.append(s); (document.querySelector('main') || document.body).innerHTML = h }, [CSS, html])
  const el = await p.$('.or'); await el.screenshot({ path: `${out}/one-reader-${tag}.png` })
  await p.close()
}
await b.close(); console.log('done')
