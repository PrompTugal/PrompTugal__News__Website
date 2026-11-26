#!/usr/bin/env node
/* test_outlet_email_gate.mjs: an outlet's published mailbox gets past validate.js's rule 7 (officialContacts) only to be held by the data check
 * (lib/media-contact.mjs), which still refuses a shared-host address and a non-role local part (cl-6.security, 26 Nov 2026).
 *   node newsroom/build/tests/test_outlet_email_gate.mjs   Written by cl-6.dev@PrompTugal.dinis. */
import { checkMediaContact } from '../lib/media-contact.mjs'
const NOW = new Date('2026-11-26T12:00:00Z')
const rec = (site, email, page = site + 'contactos') => ({ id: 'x', kind: 'media', media: { website: site, contact: { page, official_email: email, source: { url: page, read_at: '2026-11-26', how: 'read the outlet contact page' } } } })
let bad = 0
const t = (what, got, want) => { if (got !== want) { bad++; console.error(`FAIL ${what}: ${got}, want ${want}`) } }
const fails = (o, re) => checkMediaContact(o, NOW).some(e => re.test(e))
t('a role mailbox on the outlet\'s own domain passes', checkMediaContact(rec('https://www.outlet.example/', 'redacao@outlet.example'), NOW).length, 0)
t('a non-role local part fails', fails(rec('https://www.outlet.example/', 'maria.silva@outlet.example'), /role mailbox/), true)
t('another non-role local part fails', fails(rec('https://www.outlet.example/', 'joao@outlet.example'), /role mailbox/), true)
t('a *.sapo.pt outlet cannot claim a sapo.pt address (shared host)', fails(rec('https://outlet.sapo.pt/', 'redacao@sapo.pt'), /shared host/), true)
t('nor an address on its own sapo.pt sub-domain', checkMediaContact(rec('https://outlet.sapo.pt/', 'redacao@outlet.sapo.pt'), NOW).length > 0, true)
t('a blogspot outlet fails too', checkMediaContact(rec('https://x.blogspot.com/', 'redacao@blogspot.com'), NOW).length > 0, true)
t('a foreign domain fails', fails(rec('https://www.outlet.example/', 'redacao@other.example'), /own domain/), true)
t('a page on another domain fails', fails(rec('https://www.outlet.example/', 'redacao@outlet.example', 'https://other.example/c'), /contact page/), true)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_outlet_email_gate: OK')
