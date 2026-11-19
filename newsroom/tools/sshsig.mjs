#!/usr/bin/env node
// sshsig.mjs: git's SSH signing program, in Node only (no ssh-keygen in the agents' sessions; this repository takes no
// dependencies). Signed commits for every agent (Dinis, 19 November 2026, about 01:10 UTC: board/guidance/2026-11-19-
// signed-commits-paid-search-and-free-embeds.md, section 2). It speaks the part of ssh-keygen's interface git uses, and
// writes OpenSSH's SSHSIG format (PROTOCOL.sshsig) with ed25519, so OpenSSH verifies what it signs and the reverse:
//   sshsig.mjs keygen <file> <comment>                 a new key: <file> (PKCS#8 PEM, private, 0600) and <file>.pub
//   sshsig.mjs -Y sign -n <ns> -f <key> <data-file>    writes <data-file>.sig (git: gpg.ssh.program)
//   sshsig.mjs -Y find-principals -f <allowed> -s <sig>
//   sshsig.mjs -Y verify -n <ns> -f <allowed> -I <principal> -s <sig>   (the data on stdin)
//   sshsig.mjs -Y check-novalidate -n <ns> -s <sig>                      (the data on stdin)
// The private key never leaves its file; nothing is printed but public keys, principals and verdicts. dev@PrompTugal.dinis.
import crypto from 'node:crypto'
import fs from 'node:fs'
const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const u32 = n => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b }
const str = x => { const b = Buffer.isBuffer(x) ? x : Buffer.from(x); return Buffer.concat([u32(b.length), b]) }
const read = (b, o) => { const n = b.readUInt32BE(o); return [b.subarray(o + 4, o + 4 + n), o + 4 + n] }
const raw = pub => Buffer.from(pub.export({ format: 'jwk' }).x, 'base64url')
const blob = pubRaw => Buffer.concat([str('ssh-ed25519'), str(pubRaw)])
const line = (pubRaw, c = '') => `ssh-ed25519 ${blob(pubRaw).toString('base64')}${c ? ' ' + c : ''}`
const fp = b => 'SHA256:' + crypto.createHash('sha256').update(b).digest('base64').replace(/=+$/, '')
const pubOf = b64 => { const b = Buffer.from(b64, 'base64'); const [t, o] = read(b, 0); if (t.toString() !== 'ssh-ed25519') throw new Error('only ssh-ed25519 keys'); return read(b, o)[0] }
const keyOf = r => crypto.createPublicKey({ key: { kty: 'OKP', crv: 'Ed25519', x: r.toString('base64url') }, format: 'jwk' })
const toSign = (ns, msg) => Buffer.concat([Buffer.from('SSHSIG'), str(ns), str(''), str('sha512'), str(crypto.createHash('sha512').update(msg).digest())])
function armor(b) { const s = b.toString('base64').match(/.{1,70}/g).join('\n'); return `-----BEGIN SSH SIGNATURE-----\n${s}\n-----END SSH SIGNATURE-----\n` }
function parse(file) {
    const t = fs.readFileSync(file, 'utf8').replace(/-----(BEGIN|END) SSH SIGNATURE-----/g, '').replace(/\s+/g, '')
    const b = Buffer.from(t, 'base64'); if (b.subarray(0, 6).toString() !== 'SSHSIG' || b.readUInt32BE(6) !== 1) throw new Error('not an SSHSIG v1 signature')
    let o = 10, pk, ns, rs, ha, sg;[pk, o] = read(b, o);[ns, o] = read(b, o);[rs, o] = read(b, o);[ha, o] = read(b, o);[sg, o] = read(b, o)
    const [st, so] = read(sg, 0); if (st.toString() !== 'ssh-ed25519') throw new Error('only ssh-ed25519 signatures')
    return { pubBlob: pk, pub: read(pk, read(pk, 0)[1])[0], ns: ns.toString(), hash: ha.toString(), sig: read(sg, so)[0] }
}
function allowed(file) {   // principal namespaces="git" ssh-ed25519 AAAA... (the subset ssh-keygen's file format we write)
    return fs.readFileSync(file, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => {
        const m = l.match(/^(\S+)\s+(?:(\S+="[^"]*"(?:,\S+="[^"]*")*)\s+)?ssh-ed25519\s+(\S+)/); if (!m) return null
        const nss = (m[2] || '').match(/namespaces="([^"]*)"/); return { principals: m[1].split(','), ns: nss ? nss[1].split(',') : null, pub: pubOf(m[3]) }
    }).filter(Boolean)
}
const stdin = () => fs.readFileSync(0)
const check = (s, ns, msg) => (!ns || s.ns === ns) && /^sha(256|512)$/.test(s.hash) && crypto.verify(null, s.hash === 'sha512' ? toSign(s.ns, msg) : Buffer.concat([Buffer.from('SSHSIG'), str(s.ns), str(''), str('sha256'), str(crypto.createHash('sha256').update(msg).digest())]), keyOf(s.pub), s.sig)
const out = x => process.stdout.write(x + '\n'), die = (m, c = 1) => { process.stderr.write(m + '\n'); process.exit(c) }

try {
    if (a[0] === 'keygen') {
        const [file, comment = ''] = [a[1], a.slice(2).join(' ')]
        if (!file) die('keygen <file> <comment>'); if (fs.existsSync(file)) die(`${file} exists: not overwritten`)
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
        fs.writeFileSync(file, privateKey.export({ format: 'pem', type: 'pkcs8' }), { mode: 0o600 })
        fs.writeFileSync(file + '.pub', line(raw(publicKey), comment) + '\n'); out(line(raw(publicKey), comment))
    } else if (a[0] === '-Y' && a[1] === 'sign') {
        const key = crypto.createPrivateKey(fs.readFileSync(opt('-f'))), ns = opt('-n'), data = a[a.length - 1]
        const pr = raw(crypto.createPublicKey(key)), msg = fs.readFileSync(data)
        const sig = crypto.sign(null, toSign(ns, msg), key)
        const b = Buffer.concat([Buffer.from('SSHSIG'), u32(1), str(blob(pr)), str(ns), str(''), str('sha512'), str(Buffer.concat([str('ssh-ed25519'), str(sig)]))])
        fs.writeFileSync(data + '.sig', armor(b))
    } else if (a[0] === '-Y' && a[1] === 'find-principals') {
        const s = parse(opt('-s')), hit = allowed(opt('-f')).filter(e => e.pub.equals(s.pub))
        if (!hit.length) die('no principal matched', 1); out(hit.flatMap(e => e.principals).join('\n'))
    } else if (a[0] === '-Y' && a[1] === 'verify') {
        const s = parse(opt('-s')), who = opt('-I'), ns = opt('-n'), msg = stdin()
        const e = allowed(opt('-f')).find(x => x.principals.includes(who) && x.pub.equals(s.pub) && (!x.ns || x.ns.includes(ns)))
        if (!e || !check(s, ns, msg)) die(`Could not verify signature.`, 255)
        out(`Good "${ns}" signature for ${who} with ED25519 key ${fp(s.pubBlob)}`)
    } else if (a[0] === '-Y' && a[1] === 'check-novalidate') {
        const s = parse(opt('-s')), ns = opt('-n'), msg = stdin()
        if (!check(s, ns, msg)) die('Signature verification failed', 255)
        out(`Good "${ns}" signature with ED25519 key ${fp(s.pubBlob)}`)
    } else die('usage: keygen <file> <comment> | -Y sign|find-principals|verify|check-novalidate ...', 2)
} catch (e) { die(String(e.message || e), 255) }
