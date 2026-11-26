import test from 'node:test'
import assert from 'node:assert/strict'
import { checkMediaContact, registrable } from '../build/lib/media-contact.mjs'

const NOW = new Date('2026-11-26T12:00:00Z')
const ok = () => ({
    id: 'jornal-x', kind: 'media',
    media: { website: 'https://www.jornalx.pt/', contact: { page: 'https://www.jornalx.pt/contactos', official_email: 'redacao@jornalx.pt', source: { url: 'https://www.jornalx.pt/contactos', read_at: '2026-11-26', how: 'read the outlet contact page' } } },
})
const bad = (o) => checkMediaContact(o, NOW)

test('a role address on the outlet\'s own site passes', () => assert.deepEqual(bad(ok()), []))
test('a record with no email and only a page passes', () => { const o = ok(); delete o.media.contact.official_email; assert.deepEqual(bad(o), []) })
test('a personal-looking address fails', () => {
    for (const a of ['maria.silva@jornalx.pt', 'm.silva@jornalx.pt', 'joao123@jornalx.pt', 'msilva@jornalx.pt']) { const o = ok(); o.media.contact.official_email = a; assert.ok(bad(o).some(x => /role mailbox/.test(x)), a) }
})
test('a foreign domain fails', () => { const o = ok(); o.media.contact.official_email = 'redacao@outro.pt'; assert.ok(bad(o).some(x => /own domain/.test(x))) })
test('a page or source on another domain, or not https, fails', () => {
    let o = ok(); o.media.contact.page = 'https://outro.pt/c'; assert.ok(bad(o).some(x => /contact page/.test(x)))
    o = ok(); o.media.contact.source.url = 'http://www.jornalx.pt/contactos'; assert.ok(bad(o).some(x => /contact source/.test(x)))
})
test('a phone number of any kind fails', () => { const o = ok(); o.media.contact.official_phone = '+351 21 000 0000'; assert.ok(bad(o).some(x => /phone/.test(x))) })
test('the read date in how is not a phone number', () => { const o = ok(); o.media.contact.source.how = 'read on 2026-11-26'; assert.deepEqual(bad(o), []) })
test('a page-only contact must be https and carry a read date', () => {
    let o = ok(); delete o.media.contact.official_email; o.media.contact.page = 'http://www.jornalx.pt/c'; assert.ok(bad(o).some(y => /https/.test(y)))
    o = ok(); delete o.media.contact.official_email; delete o.media.contact.source.read_at; assert.ok(bad(o).some(y => /date it was read/.test(y)))
})
test('a shared host is never an outlet\'s own domain', () => {
    const o = ok(); o.media.website = 'https://jornalx.blogspot.com/'; o.media.contact = { page: 'https://jornalx.blogspot.com/c', official_email: 'info@jornalx.blogspot.com', source: { url: 'https://jornalx.blogspot.com/c', read_at: '2026-11-26', how: 'read' } }
    assert.ok(bad(o).some(y => /shared host/.test(y)))
})
test('a missing or future read date fails', () => {
    let o = ok(); delete o.media.contact.source.read_at; assert.ok(bad(o).some(x => /date it was read/.test(x)))
    o = ok(); o.media.contact.source.read_at = '2027-01-01'; assert.ok(bad(o).some(x => /future/.test(x)))
})
test('a contact on a non-media record fails', () => assert.ok(bad({ id: 'acme', contact: { official_email: 'info@acme.pt' } }).some(x => /media record only/.test(x))))
test('registrable domains', () => { assert.equal(registrable('www.jornalx.pt'), 'jornalx.pt'); assert.equal(registrable('mail.bbc.co.uk'), 'bbc.co.uk') })
test('a phone-like number in any text of the contact fails', () => { const o = ok(); o.media.contact.source.how = 'read the page, call 21 000 00 00'; assert.ok(bad(o).some(x => /phone-like/.test(x))) })
test('com.pt and org.pt are second levels: two outlets under them are not one domain', () => {
    assert.equal(registrable('x.com.pt'), 'x.com.pt'); assert.notEqual(registrable('x.com.pt'), registrable('y.com.pt')); assert.equal(registrable('www.y.org.pt'), 'y.org.pt')
    const o = ok(); o.media.website = 'https://x.com.pt/'; o.media.contact = { page: 'https://y.com.pt/c', official_email: 'info@y.com.pt', source: { url: 'https://y.com.pt/c', read_at: '2026-11-26', how: 'read' } }
    assert.ok(bad(o).some(x => /own domain/.test(x)))
})
