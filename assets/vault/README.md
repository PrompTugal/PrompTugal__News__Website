# The vault: what is here, and the hook for other features

By `newsroom-billing@web-summit.dinis`, 5 November 2026 (WS-14). Ported from newsroom.sgit.ai's Vault pane (a beta
there): the reader's reading account, and what other parts of this site keep for them, carried between devices in an
encrypted vault that opens with a passkey. The pages are `/account/vault.html` (the login page) and the pane on the
right of every page, opened by the **Vault** button in the top bar.

| File | What it is |
|---|---|
| `boot.js` | on every page (a classic script): the Vault button in `#nr-tools`, opening the pane, and **`window.__vault`** (below) |
| `vault.js` | the pane (an ES module, loaded only when needed): sign in, create, update, across devices, Reading, Saved, Keys |
| `vault-core.js` | newsroom.sgit.ai's `assets/newsroom-vault.js`, ported: create, open, write, publish, the door/master/reader account |
| `door.js` | newsroom.sgit.ai's `assets/door.js`, ported: from a passkey's PRF bytes (or a recovery code) to the door's key; this site's own constant |
| `sync.js` | newsroom.sgit.ai's `assets/vault-pane/sync.js`, trimmed: device files, consolidation, merging into a browser |
| `vault.css` | the pane and the button, in the designer's classes (`.pane`, `.pane-tabs`, `.pane-body`, `.steps`, `.kv`) |
| `../vendor/sg-vault/` | the vault library, sg-vault v0.2.3, vendored unedited (see its `VENDOR.md`) |

## How it works

1. **Sign in with a passkey.** WebAuthn with the PRF extension gives 32 bytes; `door.js` derives a door vault's address
   and key from them. Nothing is stored to be found.
2. **No vault yet: create it, once.** Three vaults: the door (holds the master's key), the master (holds the reader
   vault's key, the list of doors and the **vault access key**), the reader vault (holds the data). A recovery door is
   added and its code shown once. The vault server accepts a new vault only with an access key: until Dinis issues
   them (`data/billing/vault.json`, `access_key.status: "not-issued"`), the pane says exactly what is missing and where
   it will come from, and creates nothing.
3. **Update the vault.** This device's records are written as `activity/devices/<device>.json` (rewritten whole, by
   this device only), with `activity/account.json` (the one starting credit) and `activity/index.json`; then every item
   saved through `window.__vault` and not yet in the vault; one publish.
4. **Open it on another device** with the same passkey or the recovery code: the other devices' reads and top-ups are
   brought into that browser and the page reloads with the whole account.

Where the keys live: in memory, and for the life of the tab in `sessionStorage` (`web-summit.newsroom.vault.session`).
None is written to `localStorage`, none to this repository, and none is sent anywhere but the vault server
(`https://dev.send.sgraph.ai`, the one newsroom.sgit.ai uses). Everything leaves the browser encrypted.

## The hook: `window.__vault`

Any feature of this site (the chat agent saving conversations, a "my agenda", saved searches) can keep data for the
reader with one call. It is defined by `boot.js` on every page, before the pane is loaded.

```js
// keep something: in this browser at once; in the reader's vault too when it is open in this tab with an access key
const r = await window.__vault.save('chat/conversations/2026-11-05-lisbon-agents', { v: 1, messages: [...] })
// r = { path: 'chat/conversations/2026-11-05-lisbon-agents', where: 'vault' | 'browser', at: '2026-11-05T...' }

const conv = await window.__vault.load('chat/conversations/2026-11-05-lisbon-agents')   // the vault's copy if open, else this browser's, else null
const all  = await window.__vault.list('chat/conversations/')    // [{ path, at, where: 'browser' | 'vault' | 'both' }]
await window.__vault.remove('chat/conversations/2026-11-05-lisbon-agents')
window.__vault.status()   // { open, canWrite, device, pending, last_update }
window.__vault.open('saved')   // open the pane on a tab: 'vault', 'reading', 'saved', 'keys'
```

- **Paths** are `<feature>/<name>[/...]`: the first segment is your feature's name (`chat`, `agenda`), the rest
  `[A-Za-z0-9._-]`. The item is written to the reader vault as `apps/<path>.json`. A feature writes only under its own
  first segment. A `.json` ending is optional.
- **Data** is any JSON value, 256 KB at most. Keep a `v` field in your own format.
- **Where it goes.** Always to this browser first (`localStorage`, `web-summit.newsroom.vault.items`), so nothing is
  lost if the vault is not open. If the vault is open in this tab and holds an access key, it is also written and
  published at once (`where: 'vault'`); otherwise it waits and goes with the next "Update the vault", and the Vault
  button counts it. A failed vault write resolves with `where: 'browser'` and an `error`; it never throws after the
  local save.
- **Events** on `window`: `nr-vault-saved` `{ path, where }` after every save; `nr-vault-status` `{ open, canWrite }`
  when the vault is opened or closed. Without calling the object: `window.dispatchEvent(new CustomEvent('nr-vault-save',
  { detail: { path, data } }))`.
- **Panes.** The vault pane lives in `#nr-pane`. When it opens it dispatches `nr-pane-open` `{ id: 'vault' }` on
  `window`, and closes itself when another pane announces itself the same way, so the chat pane and the vault pane never
  overlap. It sets `html.vault-open` and `body.pane-open` while open.
- **The meter's data** is not saved through the hook: the pane reads the meter's own state
  (`localStorage['web-summit.newsroom.meter.v1']`, sg-meter v1.5.0) and writes it as the device file.

## Tests

`node newsroom/build/tests/test_vault.mjs` (the library, the account, two devices, a saved item, the recovery door,
against `newsroom/build/tests/vault-mock.mjs`) and `node newsroom/build/tests/test_billing_browser.mjs` (the whole pane in
Chromium with a virtual passkey, the vault server routed to the mock).
