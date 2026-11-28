// The licensed pictures of the home page (cl-6.designer's spec b, 28 Nov 2026; rights by cl-6.rights): each story of front-page.json (the lead and the top) may carry an
// "image" {path, kind, credit, licence, licence_url?, source_url, rights_checked_by, alt, width, height, caption?, ai?}. THE BUILD REFUSES a picture with no rights_checked_by,
// a file that is not under assets/front/, a size that does not match its file, or a file over the budget (the lead 120 KB, a thumbnail 20 KB). A story with no record shows none.
import fs from 'node:fs'
import path from 'node:path'

export const BUDGET = { lead: 120 * 1024, thumb: 20 * 1024 }
const KINDS = new Set(['photo', 'chart', 'illustration'])
const PATH = /^assets\/front\/[a-z0-9][a-z0-9-]*\.(jpg|png|webp)$/
const url = u => typeof u === 'string' && /^https:\/\/[A-Za-z0-9.-]+\/[^\s"'<>]*$/.test(u)
const text = (v, n) => typeof v === 'string' && v.trim().length > 0 && v.length <= n && !/[<>]/.test(v)

// the pixel size of a JPEG or a PNG, read from the file itself
export function sizeOf(buf) {
    if (buf[0] === 0x89 && buf.toString('latin1', 1, 4) === 'PNG') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
        for (let i = 2; i + 9 < buf.length;) {
            if (buf[i] !== 0xff) { i++; continue }
            const m = buf[i + 1]
            if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
            i += 2 + buf.readUInt16BE(i + 2)
        }
    }
    return null
}

// one record, checked; returns the clean record or throws (the build stops: a picture nobody cleared must not ship)
export function checkImage(slug, im, role, root) {
    const bad = why => { throw new Error(`front-page.json: the image of ${slug} is refused: ${why}`) }
    if (!im || typeof im !== 'object') bad('not a record')
    if (!text(im.rights_checked_by, 120)) bad('no rights_checked_by (cl-6.rights has not cleared it)')
    if (!KINDS.has(im.kind)) bad('kind must be photo, chart or illustration')
    if (!PATH.test(String(im.path || ''))) bad('path must be a file under assets/front/')
    for (const k of ['credit', 'licence']) if (!text(im[k], 120)) bad(`${k} missing`)
    if (!text(im.alt, 300)) bad('alt text missing')
    if (!url(im.source_url)) bad('source_url must be an https address')
    if (im.licence_url != null && !url(im.licence_url)) bad('licence_url must be an https address')
    if (im.caption != null && !text(im.caption, 300)) bad('caption is not plain text')
    let buf; try { buf = fs.readFileSync(path.join(root, im.path)) } catch { bad(`the file ${im.path} does not exist`) }
    if (buf.length > BUDGET[role]) bad(`the file is ${Math.round(buf.length / 1024)} KB, over the ${BUDGET[role] / 1024} KB budget of a ${role}`)
    const s = sizeOf(buf)
    if (!s) bad('the file is not a readable JPEG or PNG')
    if (im.width !== s.w || im.height !== s.h) bad(`width and height are ${im.width}x${im.height} but the file is ${s.w}x${s.h}`)
    return { ...im, w: s.w, h: s.h, ai: im.ai === true }
}

// the slugs of the lead and the top with a record, checked: a Map slug -> record
export function frontImages(root, F) {
    const out = new Map()
    if (F && F.lead && F.lead.image && F.lead.article) out.set(F.lead.article, checkImage(F.lead.article, F.lead.image, 'lead', root))
    for (const t of (F && Array.isArray(F.top) ? F.top : [])) if (t && t.image && t.article && !out.has(t.article)) out.set(t.article, checkImage(t.article, t.image, 'thumb', root))
    return out
}
