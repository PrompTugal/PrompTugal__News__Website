// The gate's rule for an outlet's published newsroom contact (cl-6.security's five conditions, 26 Nov 2026; the website's
// CLAUDE.md "Contacts" rule): only on a media record, only a role mailbox the outlet publishes on its own site, with the
// page it came from and the date read. No phone number of any kind, no personal-looking address, no foreign domain.
// Extend ROLE_MAILBOXES only by a reviewed change.
export const ROLE_MAILBOXES = ['redacao', 'redaccao', 'newsroom', 'news', 'noticias', 'geral', 'info', 'imprensa', 'press', 'editor', 'editorial', 'tips', 'contacto', 'contact']

// Shared hosts never count as an outlet's own domain (any outlet can have a page there).
export const SHARED_HOSTS = ['blogspot.com', 'blogspot.pt', 'wordpress.com', 'medium.com', 'substack.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com', 'linkedin.com', 'youtube.com', 'tumblr.com', 'wixsite.com', 'github.io', 'linktr.ee', 'sapo.pt']

const SECOND_LEVEL = new Set(['co', 'com', 'org', 'net', 'gov', 'ac', 'edu'])

// The registrable domain of a host: the last two labels, three after a country second level (bbc.co.uk).
export function registrable(host) {
    const l = String(host || '').toLowerCase().replace(/\.$/, '').split('.').filter(Boolean)
    if (l.length < 2) return ''
    if (l.length >= 3 && l[l.length - 1].length === 2 && SECOND_LEVEL.has(l[l.length - 2])) return l.slice(-3).join('.')
    return l.slice(-2).join('.')
}

// A phone-like run of digits (7 or more, with spaces, dots, dashes or brackets between): refused in any text of a contact.
const PHONE_LIKE = /\+?\d[\d\s().-]{6,}\d/

function parse(u) { try { return new URL(u) } catch { return null } }

// Returns a list of problems (empty when fine) for one organisation record `o`; `now` is a Date.
export function checkMediaContact(o, now = new Date()) {
    const w = `data/organisations/${o.id}`, out = []
    const c = o.media?.contact
    if (!o.media) { if (o.contact || o.media_contact) out.push(`${w}: a contact belongs on a media record only`); return out }
    if (!c) return out
    if (c.official_phone) out.push(`${w}: no phone number in an outlet contact`)
    for (const [k, v] of [['how', c.source?.how], ['official_email', c.official_email]]) if (typeof v === 'string' && PHONE_LIKE.test(v.replace(/\d{4}-\d\d-\d\d/g, ''))) out.push(`${w}: a phone-like number in contact ${k}`)
    const e = c.official_email
    const site = parse(o.media.website)
    const page = parse(c.page), src = parse(c.source?.url)
    const readAt = Date.parse(c.source?.read_at)
    const sharedHost = (h) => SHARED_HOSTS.includes(registrable(h))
    if (c.page && parse(c.page)?.protocol !== 'https:') out.push(`${w}: contact page must be https`)
    if ((c.page || c.source?.url || e) && !c.source?.read_at) out.push(`${w}: contact needs the date it was read`)
    else if (c.source?.read_at && Number.isNaN(readAt)) out.push(`${w}: contact read date is not a date`)
    else if (readAt > now.getTime() + 24 * 3600 * 1000) out.push(`${w}: contact read date is in the future`)
    if (e) {
        const m = /^([^@\s]+)@([^@\s]+)$/.exec(e)
        if (!m) { out.push(`${w}: official_email is not an address`); return out }
        if (!ROLE_MAILBOXES.includes(m[1].toLowerCase())) out.push(`${w}: official_email is not a role mailbox (${ROLE_MAILBOXES.join(', ')})`)
        const dom = registrable(m[2])
        if (SHARED_HOSTS.includes(dom)) out.push(`${w}: official_email is on a shared host`)
        if (!site || registrable(site.hostname) !== dom) out.push(`${w}: official_email is not on the outlet's own domain`)
        if (!page || registrable(page.hostname) !== dom || sharedHost(page.hostname)) out.push(`${w}: contact page must be on the outlet's own domain`)
        if (!src || src.protocol !== 'https:' || registrable(src.hostname) !== dom || sharedHost(src.hostname)) out.push(`${w}: contact source must be https and on the outlet's own domain`)
    }
    return out
}
