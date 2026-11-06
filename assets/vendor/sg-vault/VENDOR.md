# The vault library, vendored: sg-vault v0.2.3 and newsroom.sgit.ai's local extension

Copied unedited on 5 November 2026 from newsroom.sgit.ai (repository SGit-AI/SGit-AI__Website__Newsroom,
`assets/vendor/sg-vault/`), which runs the same library as dev.vault.sgraph.ai. The twelve files of the library, with
their upstream commit, load order and hashes, are described in `v0.2.3/VENDOR.md` (copied with them, unedited); the
one local extension newsroom.sgit.ai adds, `SGVault.createWithId` (a vault at a known id: the passkey's door), is in
`local/`. One code base writes vaults: this site's `assets/vault/vault-core.js` calls the library and writes none of
the format itself. The library is loaded only when the vault pane needs it, never on every page.

**Licence:** Apache License 2.0, the code licence of the repository it was copied from (newsroom.sgit.ai); upstream
is the-cyber-boardroom/SGraph-AI__App__Send (see `v0.2.3/VENDOR.md`), whose own licence was not re-read for this copy.

The gate (newsroom/build/features/account.mjs, check 12) recomputes the hashes below and those in `v0.2.3/VENDOR.md`.

| File | SHA-256 |
|---|---|
| `local/sg-vault--create-with-id.js` | `b668c4ab0062a3b385882fa593f7213f50f667c777d0614b5ba8abcb5721372e` |
| `v0.2.3/VENDOR.md` | `72b1b247062e1cd0b9502fb689c5e5d90bc79c27d9696af2047f1a2fccf7e9af` |
