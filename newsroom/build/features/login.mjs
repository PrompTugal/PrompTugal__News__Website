// Sign in (Dinis, 6 November 2026): a person signs in with the key a conductor issued them, handed over as a QR code
// of the sign-in link (newsroom/tools/person-key.mjs). The page /login/ (its words: content/login.md) takes it in;
// assets/login/keyring.js holds it in the browser (window.PTKeyring, non-extractable, IndexedDB) and
// assets/login/login.js proves it against board/person-keys.json (window.PTLogin, tool auth.whoami, the chip in
// #nr-tools once signed in). Both scripts are on every page, so a person signed in once is known everywhere: the
// drain on /newsroom/observability/ uses it. Nothing on the site is hidden from readers who are not signed in.
import crypto from 'node:crypto'
export const order = 6
export const assets = { css: ['assets/login/login.css'], js: ['assets/login/keyring.js', 'assets/login/login.js'] }
const REGISTER = 'board/person-keys.json', JSQR = 'assets/vendor/jsqr/1.4.0/jsQR.js', JSQR_VENDOR = 'assets/vendor/jsqr/1.4.0/VENDOR.md'
const fp = jwk => 'sha256:' + crypto.createHash('sha256').update(`${jwk.crv}:${jwk.x}:${jwk.y}`).digest('hex').slice(0, 16)

// the page itself is content/login.md (its words); this feature fills the one line the register decides
export const fill = {
    'login:people': (page, ctx) => {
        const keys = ctx.exists(REGISTER) ? ctx.readJSON(REGISTER).keys : []
        const people = [...new Set(keys.filter(k => k.status === 'active').map(k => k.person))]
        return people.length ? people.join(', ') : 'none'
    },
}

export const llms = ctx => `## Sign in\n- [login/](${ctx.BASE}login/index.md): editors and agents sign in with the key a conductor issued them (a QR code of the sign-in link); the browser proves it against [board/person-keys.json](${ctx.BASE}board/person-keys.json). Readers need no account. In a browser: \`window.PTLogin.state()\`, tool \`auth.whoami\` (read).\n\n`

export function validate(gate) {
    const out = []
    // the register: public halves only, each fingerprint what the key gives, one active key per person
    let reg = null
    try { reg = gate.json(REGISTER) } catch { out.push(`${REGISTER}: missing or not JSON`) }
    if (reg) {
        if (/"d"\s*:/.test(JSON.stringify(reg))) out.push(`${REGISTER}: holds a private key component ("d"): only public halves may be committed`)
        const active = {}
        for (const k of reg.keys || []) {
            if (!k.person || !k.encrypt || !k.sign) { out.push(`${REGISTER}: an entry without person, encrypt or sign`); continue }
            if (fp(k.encrypt) !== k.fingerprint) out.push(`${REGISTER}: ${k.person}'s fingerprint ${k.fingerprint} is not its encryption key's (${fp(k.encrypt)})`)
            if (k.signing_fingerprint && fp(k.sign) !== k.signing_fingerprint) out.push(`${REGISTER}: ${k.person}'s signing_fingerprint is not its signing key's`)
            if (k.status === 'active') { if (active[k.person]) out.push(`${REGISTER}: two active keys for ${k.person}`); active[k.person] = 1 }
        }
    }
    // the vendored QR reader is unedited
    const want = (gate.text(JSQR_VENDOR).match(/`jsQR\.js` \| `([0-9a-f]{64})`/) || [])[1]
    if (!want || gate.sha256(gate.text(JSQR)) !== want) out.push(`${JSQR}: its SHA-256 differs from ${JSQR_VENDOR}: a vendored file was edited`)
    if (!/Apache License/.test(gate.text('assets/vendor/jsqr/1.4.0/LICENSE'))) out.push('assets/vendor/jsqr/1.4.0/LICENSE: the licence must stay beside the file')
    return out
}
