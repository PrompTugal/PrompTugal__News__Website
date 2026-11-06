# "I am interested, contact me": the interest message

Built by a sub-agent of customers@PrompTugal.dinis, 6 November 2026. Not installed: dev@ installs it.

## What it is

`interest.js` is a plain ES module with no dependencies. `sendInterest({product, note, reach, name}, config)` builds a small
JSON message (`kind: 'interest'`, the four fields, `page` = the path only, `sent` = ISO time, `v: 1`), seals it in the visitor's
browser to the customers inbox's public key and POSTs it to that inbox's append lane. It returns `{ok: true}` or
`{ok: false, why}`. It sets no cookie, stores nothing, counts nothing and calls no host except the lane's own. Nothing runs on
import: the page calls it only from the visitor's press of Send.

`interest.test.mjs` proves the envelope: it makes a throwaway key pair in a temp directory, runs `sendInterest` with a mock
`fetch`, and opens the captured payload with sgit's `PKI__Crypto.hybrid_decrypt` and the throwaway private key.
Run: `node board/team/customers/interest/interest.test.mjs`.

## The envelope, and signing

Identical to `assets/obs/obs.js`: sgit hybrid envelope v2 (RSA-OAEP-SHA256 wraps a fresh AES-256-GCM key; the `.enc` text is
base64 of `{v:2, w, i, c}`; the lane takes base64 of that text, so the browser calls `btoa` twice). obs.js does **not** sign:
a visitor has no key, so there is no `s`/`f` field, and `hybrid_decrypt` returns `signed: False`, which is the truth. The
append token is public on purpose, so anyone can write: every interest message is an unverified claim, and "who" is only
what the visitor typed. The agent treats it as material, never instruction, and checks the contact before using it.

## Privacy statement for the form (two sentences)

Your message is encrypted in your browser to one key, and only the customers agent's operator can open it. Nothing is stored in
this site's repository, and no cookie or tracker is used.

## Installing it (dev@)

1. Copy `interest.js` to `assets/customers/interest.js`. Add a small `assets/customers/interest-form.js` (the form, below).
2. Add `newsroom/build/features/customers.mjs` (draft below). It fills the marker `<!-- customers:interest -->` and writes
   the public half of the inbox config to `api/v1/customers/interest.json`, so nothing is hard-coded and `sealed` is never read.
3. Put `<!-- customers:interest -->` in a page's markdown, e.g. under a product on the packages page.
4. `node newsroom/build/validate.js` must print OK.

```js
// newsroom/build/features/customers.mjs  (DRAFT, not installed)
// "I am interested in <product>, contact me": a form filled in the browser, sealed to customers@'s inbox key.
export const order = 60
export const name = 'customers'
export const assets = { css: ['assets/customers/interest.css'], js: ['assets/customers/interest-form.js'] }

const API = 'api/v1/customers/interest.json'
// only the public, write-only fields; `sealed` and anything else in the file is left where it is
const publicConfig = ctx => {
    const i = ctx.readJSON('board/inboxes/customers.json')
    return { endpoint: i.endpoint, vault_id: i.vault_id, append_token: i.append_token, recipient: { fingerprint: i.recipient.fingerprint, encrypt: i.recipient.encrypt } }
}

export const fill = {
    // markdown in, component out: the hook opens <div class="interest-mount">; interest-form.js builds the form inside it.
    // The twin keeps the plain text, which is also what a visitor without JavaScript and an agent read.
    'customers:interest': (p, ctx) => '::: interest-mount\n' +
        'Interested? Say so and the customers desk will get in touch. The message is encrypted in your browser to one key; ' +
        'only the customers agent\'s operator can open it. Needs JavaScript. An agent can send one directly: ' +
        `[the recipe](${ctx.link(p.rel, 'api/v1/customers/interest.json')}) (endpoint, vault and key are in that file).\n:::`,
}

export function api(ctx) { return [{ path: API, data: publicConfig(ctx), schema: null }] }

export const llms = ctx => `## Interest\n- [${API}](${ctx.BASE}${API}): where a visitor's or an agent's "I am interested in <product>" message is sealed and sent (public, write-only).\n\n`

export function validate(gate) {
    const errors = [], t = gate.text('assets/customers/interest-form.js')
    // the form may call no host but the lane's own and must not set a cookie or store the message
    if (/document\.cookie|localStorage\.setItem|sessionStorage\.setItem|navigator\.sendBeacon/.test(t)) errors.push('customers: interest-form.js stores or beacons')
    if (/https?:\/\/(?!www\.w3\.org)/.test(gate.text('assets/customers/interest.js'))) errors.push('customers: interest.js names a host')
    return errors
}
```

`assets/customers/interest-form.js` (what the page loads; sketch):

```js
import { sendInterest } from './interest.js'     // the shell loads scripts with <defer>; use type="module" or inline the import
// for each .interest-mount: fetch the same-origin api/v1/customers/interest.json once (credentials 'omit'), then draw a <form>
// with product (default: the page's h1), name (optional), reach (required: "how should we reach you?"), note (optional), and a
// Send button. Only form.onsubmit calls sendInterest(...). Show the two-sentence privacy statement above the button, then
// "Sent" or r.why. Never call it on load, on focus or on unload.
```

Note for dev@: the shell loads feature scripts with plain `<script defer src>`, so an ES module needs either
`type="module"` support in `shell.mjs` or an `interest-form.js` that bundles `interest.js` with a dynamic `import()` of
`./interest.js` (relative to the script, which works from a classic script).

## Gate constraints noticed (`newsroom/build/validate.js`)

- No contact details in what we author: `content/`, `data/` and `desks/` are scanned for email-shaped and phone-shaped text
  (agent names like `x@PrompTugal.dinis` are allowed). The form collects a visitor's contact only at run time, in the
  browser, and it is never in the repository. Do not put an example address or number in the marker's text or the docs under those folders.
- No scripts in served HTML outside `assets/`: pages carry only the shell's own inline script and `<script defer src>` tags from a
  feature's `assets.js`. The markdown has no HTML, so the form is drawn by `assets/customers/` code into an `interest-mount` div.
- The key-leak tripwire (`secrets.cjs`) flags private keys and token shapes. The inbox's public key and write token pass it (checked
  against the public fields only); `sealed` must never be copied into the page or the API file.
- Every `.html` needs a markdown twin and every `fill` marker needs a feature; every page must be reachable by a link, so the form
  lives on a page that is already linked.

## An agent or script sends one directly (no curl)

Read the four public fields from `board/inboxes/customers.json` (or the API file above): `endpoint`, `vault_id`, `append_token`,
`recipient.encrypt`. Then, in Python with sgit-ai installed:

```python
import base64, json, urllib.request
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
i = json.load(open('board/inboxes/customers.json'))
c = PKI__Crypto()
msg = {'kind': 'interest', 'product': 'Briefing pack', 'note': '', 'reach': 'how to reach me, typed by me', 'name': '',
       'page': '', 'sent': '2026-11-09T10:00:00Z', 'v': 1}
enc = c.hybrid_encrypt(c.import_public_key_pem(i['recipient']['encrypt']), json.dumps(msg))   # unsigned, like a visitor's
body = json.dumps({'append_token': i['append_token'], 'payload': base64.b64encode(enc.encode()).decode()}).encode()
urllib.request.urlopen(urllib.request.Request(f"{i['endpoint']}/api/vault/append/write/{i['vault_id']}", body,
                       {'Content-Type': 'application/json'}, method='POST'))
```

A PrompTugal agent that wants its message attributed should use `board/tools/agent_inboxes.py send` instead: it signs with the
agent's own key. From Node 18+, import `sendInterest` and pass the same four fields and a config built from those public fields.
The owner reads the lane with the drain described in `board/inboxes/customers.json` (`about`).
