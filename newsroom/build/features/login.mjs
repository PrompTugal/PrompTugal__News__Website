// Sign in (Dinis, 6 November 2026): a person signs in with the key a conductor issued them, handed over as a QR code
// of the sign-in link (newsroom/tools/person-key.mjs). The page /login/ takes it in (camera, picture or pasted link);
// assets/login/keyring.js holds it in the browser (window.PTKeyring, non-extractable, IndexedDB) and
// assets/login/login.js proves it against board/person-keys.json (window.PTLogin, tool auth.whoami, the chip in
// #nr-tools once signed in). Both scripts are on every page, so a person signed in once is known everywhere: the
// drain on /newsroom/observability/ uses it. Nothing on the site is hidden from readers who are not signed in.
import crypto from 'node:crypto'
export const order = 6
export const assets = { css: ['assets/login/login.css'], js: ['assets/login/keyring.js', 'assets/login/login.js'] }
const REL = 'login/index.html', REGISTER = 'board/person-keys.json', JSQR = 'assets/vendor/jsqr/1.4.0/jsQR.js', JSQR_VENDOR = 'assets/vendor/jsqr/1.4.0/VENDOR.md'
const fp = jwk => 'sha256:' + crypto.createHash('sha256').update(`${jwk.crv}:${jwk.x}:${jwk.y}`).digest('hex').slice(0, 16)

export function pages(ctx) {
    const keys = ctx.exists(REGISTER) ? ctx.readJSON(REGISTER).keys : []
    const people = [...new Set(keys.filter(k => k.status === 'active').map(k => k.person))]
    const md = `@@LOGIN@@

## How it works {#how}

1. **The conductor issues your key.** conductor@PrompTugal.dinis makes a pair of keys for you (\`newsroom/tools/person-key.mjs issue\`) and publishes the public half in [board/person-keys.json](${ctx.link(REL, 'board/person-keys.json')}). It gives you the private half as a QR code of your sign-in link (\`https://promptugal.news/login/#key=…\`), and to you only.
2. **You sign in once per browser.** Scan the QR code with your phone's camera and open the link, or on this page scan it, choose a picture of it, or paste the link. The key goes into this browser's own storage as keys the page can use but never read out; it leaves the address bar at once, and the part after \`#\` is never sent to any server.
3. **The page checks it.** Your browser signs a fresh challenge with your key, and the public key published for you must verify it. Only then are you signed in.
4. **What it is for.** The parts of the site that act for a person know who you are: today the drain on [Observability](${ctx.link(REL, 'newsroom/observability/index.html')}), which opens the vault keys sealed to your key. Nothing on the site is hidden from readers who are not signed in.
5. **Signing out** removes the key from this browser. A key lives as long as the conductor's session that issued it; a new one replaces it (the old one is marked replaced in the register).

The conductor that issues a key holds its private half too, and says so: it can read what is sealed to you. This is the first step; the next is each person holding their own key on [pki.sgit.ai](https://pki.sgit.ai/).

## For agents {#agents}

\`window.PTLogin.state()\` and the read tool \`auth.whoami\` say who is signed in on this browser (person, key fingerprint, verified or not), never the key. People with an active key today: ${people.length ? people.join(', ') : 'none'}.`
    return [{
        rel: REL, type: 'site', date: ctx.gitDate(REGISTER) || ctx.TODAY, src: REGISTER, toc: [],
        title: 'Sign in', summary: 'For PrompTugal.news\'s editors and agents: sign in with the key the conductor gave you as a QR code. Readers need no account; every page is public.',
        crumbs: [[null, 'Sign in']],
        md, twinMd: md.replace('@@LOGIN@@', 'The sign-in panel is drawn in the browser (it needs JavaScript): your state, and three ways in: the camera, a picture of the QR code, or the pasted link.'),
        postHtml: html => html.replace('<p>@@LOGIN@@</p>', '<div id="pt-login"><noscript><p class="notice"><strong>Signing in needs JavaScript.</strong></p></noscript></div>'),
    }]
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
