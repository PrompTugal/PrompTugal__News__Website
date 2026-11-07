#!/usr/bin/env node
// Personal versions of the investor site (investors@PrompTugal.dinis, 7 November 2026, at Dinis Cruz's word: "a version
// of this website that is dedicated for [one person] ... an access key ... a QR code ... a vault key that opens up the
// unlocks the website for a particular audience. And then from that moment on, all of the pages of the website reflect
// that"; board/team/investors/dinis-2026-11-07-the-investor-site.md).
//
// A pack (who it is for, a greeting, what we know, why them, their route through the decks, a note from Dinis, slide
// wording changed for them, their language and an accent colour) is sealed with AES-256-GCM under a fresh random key.
// The sealed pack is public (site/personas/<id>.json); the key travels only in the link's #fragment, which a browser
// never sends to a server: https://promptugal.news/investors/#pk=<id>.<key>, and as a QR code of that link.
// The browser side is site/persona.js (served only from dev@'s reviewed copy, S1b).
//
//   node board/team/investors/tools/persona.mjs seal <pack.json> --demo     a FICTIONAL persona: the link and QR code are
//                                                                            published on purpose (site/personas/demo.json, qr/)
//   node board/team/investors/tools/persona.mjs seal <pack.json> --out <dir>  a real person: the link and QR code go to <dir>,
//                                                                            OUTSIDE this repository (never committed)
//   node board/team/investors/tools/persona.mjs open <id> <key>             check a pack opens (prints the pack, not the key)
//
// A real person's pack holds only what Dinis gives for it and what is public and professional; until Dinis decides
// where real packs live (a vault rather than git), real packs are not committed here.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { qrcode } from '../../../../newsroom/tools/vendor/qrcode-generator-2.0.4.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, '../site'), DIR = path.join(SITE, 'personas')
const BASE = 'https://promptugal.news/investors/'
const b64u = b => Buffer.from(b).toString('base64url')
const [cmd, a1, a2, ...rest] = process.argv.slice(2)
const flag = n => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1] ?? true }

function seal(pack) {
    const key = crypto.randomBytes(32), iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key, iv)
    const ct = Buffer.concat([c.update(JSON.stringify(pack), 'utf8'), c.final(), c.getAuthTag()])
    return { key: b64u(key), sealed: { v: 'inv-persona-1', id: pack.id, iv: iv.toString('base64'), ct: ct.toString('base64') } }
}
function open(sealed, key) {
    const ct = Buffer.from(sealed.ct, 'base64'), d = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'base64url'), Buffer.from(sealed.iv, 'base64'))
    d.setAuthTag(ct.subarray(ct.length - 16)); return JSON.parse(Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]).toString('utf8'))
}
const qrSvg = url => { const q = qrcode(0, 'M'); q.addData(url); q.make(); return q.createSvgTag({ cellSize: 6, margin: 3, scalable: true }) }

if (cmd === 'seal') {
    const pack = JSON.parse(fs.readFileSync(a1, 'utf8'))
    const words = l => { const f = path.join(SITE, 'i18n', l + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).persona || {} : {} }
    pack.ui = { ...words('en'), ...words(pack.lang || 'en'), ...(pack.ui || {}) }   // the banner's and page's words, in the pack's language
    if (!/^[a-z0-9-]{2,40}$/.test(pack.id || '')) throw new Error('pack.id: 2 to 40 of a-z 0-9 -')
    const demo = !!flag('--demo'), out = flag('--out')
    if (!demo && (!out || path.resolve(out).startsWith(path.resolve(HERE, '../../../..')))) throw new Error('a real pack: --out <dir> outside this repository')
    if (demo && !pack.demo) throw new Error('--demo needs "demo": true in the pack (a fictional persona)')
    const { key, sealed } = seal(pack), link = `${BASE}#pk=${pack.id}.${key}`
    fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(path.join(DIR, pack.id + '.json'), JSON.stringify(sealed, null, 1) + '\n')
    if (open(sealed, key).id !== pack.id) throw new Error('the sealed pack does not open')
    if (demo) {
        fs.mkdirSync(path.join(DIR, 'qr'), { recursive: true }); fs.writeFileSync(path.join(DIR, 'qr', pack.id + '.svg'), qrSvg(link))
        const list = fs.existsSync(path.join(DIR, 'demo.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'demo.json'), 'utf8')) : { about: 'Fictional personas: their links carry their keys and are public on purpose, to try the personal versions (investors@PrompTugal.dinis).', personas: [] }
        list.personas = [...list.personas.filter(p => p.id !== pack.id), { id: pack.id, name: pack.name, role: pack.role, place: pack.place, lang: pack.lang, audience: pack.audience, accent: pack.accent, link, qr: `personas/qr/${pack.id}.svg` }].sort((x, y) => x.id.localeCompare(y.id))
        fs.writeFileSync(path.join(DIR, 'demo.json'), JSON.stringify(list, null, 2) + '\n')
        console.log(`sealed ${pack.id} (demo): site/personas/${pack.id}.json, its link and QR code in site/personas/demo.json and qr/${pack.id}.svg`)
    } else {
        fs.mkdirSync(out, { recursive: true, mode: 0o700 })
        fs.writeFileSync(path.join(out, pack.id + '.link.txt'), link + '\n', { mode: 0o600 }); fs.writeFileSync(path.join(out, pack.id + '.qr.svg'), qrSvg(link), { mode: 0o600 })
        console.log(`sealed ${pack.id}: site/personas/${pack.id}.json; the link and QR code are in ${out} (not printed)`)
    }
} else if (cmd === 'open') {
    console.log(JSON.stringify(open(JSON.parse(fs.readFileSync(path.join(DIR, a1 + '.json'), 'utf8')), a2), null, 2))
} else console.log('usage: persona.mjs seal <pack.json> (--demo | --out <dir>) | open <id> <key>')
