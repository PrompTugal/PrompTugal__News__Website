// Identifiers and name keys. An identifier is a key, not a name: accents are folded here and only here;
// labels stay as the source wrote them.
import crypto from 'node:crypto'

export const fold = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^\x00-\x7f]/g, '')

// a slug: ascii, lowercase, hyphens, at most `max` characters, cut at a hyphen
export function ident(s, max = 60) {
    let x = fold(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    if (x.length > max) { x = x.slice(0, max); if (x.includes('-')) x = x.slice(0, x.lastIndexOf('-')) }
    return x || 'unnamed'
}

// the key two organisation names are compared by: folded, lowercase, "&" as "and", no punctuation,
// no leading "the", no trailing parenthetical, no trailing legal form. Two names with the same key are the same name.
const LEGAL = /\s+(inc|incorporated|ltd|limited|llc|plc|gmbh|ag|sa|sas|bv|nv|corp|corporation|co|group|holdings)$/
export function nameKey(s) {
    let x = fold(s).toLowerCase().replace(/\s*\([^()]*\)\s*$/, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/^the\s+/, '')
    for (let i = 0; i < 2; i++) x = x.replace(LEGAL, '')
    return x.trim()
}

export const sha12 = s => crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, 12)
export const sha256 = s => crypto.createHash('sha256').update(s).digest('hex')
