// The tests of one reader across devices, step 1 (assets/vault/pair-core.js; security@'s pre-review condition P8,
// board/passes/2026-11-17-pairing-step-1.md): offers parse, and expired, replayed, mismatched and padded ones are
// refused; the match code is the same on both sides and changes with any input; a hello seals, signs and opens, and a
// tampered or wrongly addressed one is refused; keys.js's own unseal reads what pair-core seals.
//   node newsroom/tests/pair.test.mjs     (no network, no build; about 10 seconds: RSA-4096 keys are made)
import * as P from '../../assets/vault/pair-core.js'
import * as K from '../../assets/vendor/pki/2026-11-06/keys.js'

let fails = 0
const check = (name, cond, extra = '') => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${!cond && extra ? `: ${extra}` : ''}`); if (!cond) fails++ }

const A = await P.newDevice('Laptop, Firefox')
const B = await P.newDevice('Phone')
const C = await P.newDevice('Someone else')
check('device keys are not extractable', !A.keys.sign.extractable && !A.keys.decrypt.extractable)
check('the bundle is pki.sgit.ai\'s own shape and checks', (await K.checkBundle(A.bundle)).length === 0)

const now = new Date('2026-11-17T12:00:00Z')
const lane = { vault: 'v-test', token: 't-test' }
const offer = P.makeOffer(A, { lane, now })
check('the offer holds only the spec\'s fields (P5)', Object.keys(offer).sort().join() === 'device,expires,key,kind,lane,name,nonce,v')
check('the offer expires in ten minutes', Date.parse(offer.expires) - now.getTime() === 10 * 60e3)

let r = await P.readOffer(P.offerText(offer), { now })
check('a fresh offer reads', r.offer && r.problems.length === 0, r.problems.join('; '))
check('its key is A\'s', r.bundle && r.bundle.signing_fingerprint === A.bundle.signing_fingerprint)
r = await P.readOffer(P.offerLink(offer), { now })
check('the link (the offer in the #fragment) reads', !!r.offer, r.problems.join('; '))
r = await P.readOffer(P.offerText(offer), { now: new Date(now.getTime() + 11 * 60e3) })
check('an expired offer is refused', !r.offer && r.problems.some(p => /expired/.test(p)))
r = await P.readOffer(P.offerText(offer), { now, seen: n => n === offer.nonce })
check('a used nonce is refused (replay, P2)', !r.offer && r.problems.some(p => /used already/.test(p)))
r = await P.readOffer(P.offerText({ ...offer, device: C.bundle.signing_fingerprint }), { now })
check('a key that is not the named device is refused (P7)', !r.offer && r.problems.some(p => /not the device it names/.test(p)))
r = await P.readOffer(P.offerText({ ...offer, accessKey: 'x' }), { now })
check('an offer with extra fields is refused (P5)', !r.offer && r.problems.some(p => /never holds/.test(p)))
r = await P.readOffer(P.offerText({ ...offer, lane: { ...lane, endpoint: 'https://evil.example' } }), { now })
check('a lane elsewhere than the vault server is refused', !r.offer)
r = await P.readOffer(P.offerText({ ...offer, expires: new Date(now.getTime() + 60 * 60e3).toISOString() }), { now })
check('an offer claiming more than ten minutes is refused', !r.offer)
r = await P.readOffer('hello there', { now })
check('text that is not an offer is refused', !r.offer)

const m1 = await P.matchCode(offer.nonce, A.bundle.signing_fingerprint, B.bundle.signing_fingerprint)
const m2 = await P.matchCode(offer.nonce, A.bundle.signing_fingerprint, B.bundle.signing_fingerprint)
const m3 = await P.matchCode(offer.nonce, A.bundle.signing_fingerprint, C.bundle.signing_fingerprint)
check('the match code is six digits and the same on both sides (P1)', /^\d{6}$/.test(m1) && m1 === m2)
check('the match code changes with the other device', m1 !== m3)

const read = await P.readOffer(P.offerText(offer), { now })
const hello = await P.makeHello(B, read.offer, read.bundle, { name: 'Phone', at: now })
let h = await P.openHello(A, offer, hello)
check('a hello opens on A, signed by B (P7)', h.ok && h.hello.device === B.bundle.signing_fingerprint, h.problems.join('; '))
const henv = K.parseEnvelope(hello)
check('keys.js reads the envelope and checks its signature (interop with sgit pki)', henv.v === 2 && henv.f === B.bundle.signing_fingerprint && await K.verifyBytes(B.bundle.sign, K.unb64(henv.s), K.unb64(henv.c)))
check('the hello carries no readable text (its kind and nonce are inside the seal)', !/pair-hello|nonce/.test(atob(hello)) && !atob(hello).includes(offer.nonce))
h = await P.openHello(C, offer, hello)
check('a hello does not open on another device', !h.ok)
h = await P.openHello(A, { ...offer, nonce: 'AAAAAAAAAAAAAAAAAAAAAA' }, hello)
check('a hello for another offer is refused', !h.ok && h.problems.some(p => /another offer/.test(p)))
const env = K.parseEnvelope(hello), forged = btoa(JSON.stringify({ ...env, f: C.bundle.signing_fingerprint }))
h = await P.openHello(A, offer, forged)
check('a hello claiming another signer is refused', !h.ok)
const env2 = { ...env, s: K.b64(new Uint8Array(64)) }
h = await P.openHello(A, offer, btoa(JSON.stringify(env2)))
check('a hello with a bad signature is refused', !h.ok && h.problems.some(p => /signature/.test(p)))
const noSig = { v: 2, w: env.w, i: env.i, c: env.c }
h = await P.openHello(A, offer, btoa(JSON.stringify(noSig)))
check('an unsigned hello is refused', !h.ok && h.problems.some(p => /not signed/.test(p)))
check('names are cleaned (no markup, one line, 60 characters)', P.cleanName('<b>x</b>\n' + 'y'.repeat(80)).length <= 60 && !/[<>\n]/.test(P.cleanName('<b>x</b>\n')))

console.log(fails ? `\n${fails} FAILED` : '\nall passed')
process.exit(fails ? 1 : 0)
