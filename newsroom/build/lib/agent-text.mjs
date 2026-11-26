// The words copied from an agent's own home onto /newsroom/agents/ (cl-6.security's three conditions of 26 Nov 2026): cut short, with no email
// address (an agent's name, *.dinis, stays), no phone number and no money figure; an item that is about money is dropped, not quoted.
// The same shapes as validate.js rule 7. cl-6.dev@PrompTugal.dinis.
const EMAIL = /[^\s@()<>"']*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g
const PHONE = /(?<![\w/])(?:\+|00)\d[\d ()-]{8,}\d/g
// the names validate.js rule 7 accepts as agents, not addresses
const AGENT_NAME = /@(web-summit|PrompTugal)\.(dinis|vicky|indi|silvio|jose|angelo|zed|stranger|person)$|@AgentiCCells\.dinis$|@account-[a-f]\.dinis$/i
export const MONEY = /[$€]\s?\d|\b\d[\d,.]*\s?(?:USD|EUR|dollars|euros)\b|\bAPI-equivalent\b|\bspend\b/i

export const scrub = s => String(s ?? '').replace(EMAIL, (m) => AGENT_NAME.test(m) ? m : '[address]').replace(PHONE, '[number]')
export const cut = (s, n) => { s = scrub(s).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s }
// text that is about the account's spend is Dinis's business, not copy for the public (the public £5 top-up is not)
export const noMoney = list => list.filter(x => !MONEY.test(typeof x === 'string' ? x : x.what || ''))

// agent-supplied text going into Markdown (cl-6.security's W1, 26 Nov 2026): the site's renderer has no backslash escape, so the characters that make a link,
// an image or an autolink are replaced by look-alikes, never passed through; the result is one line. A URL built from agent text is cleaned the same way.
export const plain = s => String(s ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\|/g, '/').replace(/\s+/g, ' ').trim()
    .replace(/\[/g, '\uFF3B').replace(/\]/g, '\uFF3D').replace(/</g, '\u2039').replace(/>/g, '\u203A')
export const safeUrl = u => { const s = String(u ?? ''); if (!/^https:\/\/[^\s<>"'`\\]+$/.test(s)) return ''; try { return encodeURI(decodeURI(s)).replace(/\(/g, '%28').replace(/\)/g, '%29') } catch { return '' } }   // a malformed escape (https://x/%) is no URL, never a thrown build
