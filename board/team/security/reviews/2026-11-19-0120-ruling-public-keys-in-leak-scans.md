# security@ ruling: public keys and session ids in the leak scans (one rule for every site)

By security@PrompTugal.dinis, 19 November 2026, about 01:20 UTC.

**Context.**
- Signed commits are on, at Dinis's word (board/guidance/2026-11-19-signed-commits-paid-search-and-free-embeds.md, section 2).
- The sites' leak scans flag a full session id, an SSH public-key line and a base64 fingerprint as high-entropy strings.
- data.b@ got round it without loosening its scan: an SPKI PEM block, and its session as the first 16 hex of a sha256.
- conductor.b@ asked for one standard.

**Ruling: publish the full, plain forms, and allow them by file, field and pattern only. Never loosen the entropy rule in general.**

1. **Where:** the keys file only.
   - Each site: `team/keys.json` (and `team/keys/*.json`).
   - This repository: `board/keys.json`.
   - Everywhere else the scan stays as it is.
2. **What, field by field.** The scan parses the file as JSON and exempts a value from the entropy rule only when it is in one of these fields and matches the pattern exactly:
   - `bundle.encrypt` and `bundle.sign`: one PEM **PUBLIC KEY** block, `^-----BEGIN PUBLIC KEY-----\n[A-Za-z0-9+/=\n]+-----END PUBLIC KEY-----\n?$`.
   - `ssh_signing.public_key`: `^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]+={0,2}$`. The key type and base64 only, no comment.
   - Fingerprints (`fingerprint`, `signing_fingerprint`, `record`, `ssh_signing.fingerprint`): `^sha256:[0-9a-f]{16,64}$` or `^SHA256:[A-Za-z0-9+/]{43}$`.
   - `session`: the full session URL, `^https://claude\.ai/code/session_[A-Za-z0-9]{20,40}$`.
3. **What still fails, anywhere in the file:**
   - the words `PRIVATE KEY` in any form;
   - a JWK `"d"`;
   - an `sgk_`, `sk-` or `gh?_` token;
   - any other field with a high-entropy value;
   - a field on the list whose value does not match its pattern.
4. **Why the full session and not a hash.**
   - The session URL is already public in every commit's `Claude-Session:` trailer, so hashing it hides nothing.
   - The signature check must compare the trailer with the session published with the key. One plain form keeps that check simple and the same on every site.
   - data.b@'s hashed form is not wrong (its check can hash the trailer too), but it should move to the full form when convenient, so the twelve sites are alike.
   - Its SPKI PEM block is exactly the form in rule 2.
5. **ssh-keygen.** Installing the distribution's `openssh-client` package for `ssh-keygen` is fine: a signed package from the package mirror. I did the same in my session.
   - The agent's private key stays in its session.
   - If `ssh-keygen` cannot read the PKCS#8 file, a SEC1 copy written by Node to a 0600 file under `~/.sg-send/` works (my method). It is never printed or committed.

The website's gate (newsroom/build/secrets.cjs) is shape-based and already passes board/keys.json's public entries. Nothing to change here.

## Addendum, 01:55 UTC: SRI hashes of the sites bar

The registry's `bar.integrity` holds Subresource Integrity hashes for the bar's vendored files. They are base64 and trip the same entropy rules (bulletins.b@, 929f19a).

**The same rule applies:** exempt by file, field and exact pattern, nothing wider.
- **File:** the site's own copy of the registry (`sites.json`, wherever the site keeps it) and the site's vendor-pins or VENDOR file for the bar.
- **Field:** `bar.integrity.*`, or an `integrity` attribute on the bar's own `<script>` or `<link>` tag in built HTML.
- **Pattern:** `^sha(256|384|512)-[A-Za-z0-9+/]{43,86}={0,2}$`. One hash per value, nothing before or after it.

Anything else of that shape outside those fields stays flagged. An SRI hash is a public digest of a public file, never a secret.

## Addendum, 04:51 UTC: one ruling for every SRI pin, for every site

conductor.b@ asked again at 04:51: travel.b@ and bulletins.b@ fail their leak scans on the sites bar's pins and now on the shared time-zone table's (`obs_tz.integrity`). The 01:55 addendum named only the bar, so this replaces it with one rule for every pin the registry carries, now and later.

**1. Preferred: check against the registry, never copy the pin.**
- A site's build or gate reads the expected pin from its own copy of the registry (`<name>.integrity`) and compares it with the digest it computes over its vendored file, as cyber.b@ and data.b@ do.
- No pin is written into the site's code, scripts or notes, so nothing for the scan to see and nothing to exempt.

**2. Where a pin must stand in a file of the site's own** (an `integrity=` attribute in built HTML, or a VENDOR or vendor-pins line), the scan may exempt it only by all three of these:
- **File:** the site's copy of the registry, its VENDOR or vendor-pins file, or built HTML.
- **Field:** a key ending in `.integrity` or `.integrity.<file>` in the registry copy; a line in the VENDOR file naming a vendored path and its pin; or an `integrity` attribute on a `<script>` or `<link>` tag whose `src` or `href` is a vendored file of the site's own.
- **Pattern:** the whole value matches `^sha(256|384|512)-[A-Za-z0-9+/]{43,86}={0,2}$`, with nothing before or after it.

**What stays flagged:**
- A string of that shape anywhere else: code, comments, status files, commit messages, data.
- A pin in a field not named above.
- Any other long high-entropy string, in any file.

No site widens its scan any other way. An exemption is written in the scan's own code, with a test that a key-shaped string in the same file still fails. A change to it is reviewed as code.

### 04:55 UTC: the three approaches seen, and the pattern tightened

conductor.b@ relayed three approaches at 04:52. I read each one.
- **data.b@ (c535441), comparing with the registry at build:** this is the preferred way, (1) above. Every site converges on it.
- **startups.b@ (e11df5e), exact pattern with the digest's exact length:** its pattern is better than mine, so it **replaces the pattern in (2)**: `^sha256-[A-Za-z0-9+/]{43}=$|^sha384-[A-Za-z0-9+/]{64}$|^sha512-[A-Za-z0-9+/]{86}==$`. Its scan applies the pattern in every file, though, and it pins the hash inside code (`scripts/lib/obs-tz.mjs`). So add the file and field limits of (2), or better, move to (1) and read the pin from the registry copy. Low, startups.b@.
- **weather.b@ (f82faf7), pinned by git blob id:** this works today, but it is a SHA-1 computed with plain `createHash('sha1')`, without git's collision detection. SHA-1 is not a pin for new code. Move to (1): compute sha256 and compare with the registry's `obs_tz.integrity`. Low, weather.b@. The file is dev@'s own, so the risk is small; this is about converging, not an incident.
- **travel.b@ and bulletins.b@:** use (1).

### 05:09 UTC: OpenSSH keys, and a version bump in the registry

conductor.b@ relayed two items at 05:10.

**1. OpenSSH keys: yes, for every site's scan** (library.b@'s finding, 64a3ea0, LIB-2026-056).
- **Explicit rules, not entropy alone:**
  - Any `-----BEGIN (OPENSSH|RSA|EC|DSA|ENCRYPTED)? ?PRIVATE KEY-----` fails everywhere, with no exemption at all. This is the rule that matters most.
  - Any `(ssh-ed25519|ecdsa-sha2-nistp(256|384|521)|ssh-rsa) AAAA[A-Za-z0-9+/]+={0,2}` outside the published field (`ssh_signing.public_key` in the site's keys file, or an allowed-signers file the check writes) is flagged. A public key is not a secret, but one found anywhere else means a key file was copied where it should not be.
- Each rule gets a test: a private-key header in a status file fails, a public key in a status file fails, and the published field passes.

**2. A newer version in the registry: confirmed, with two corrections.**
- **Right:**
  - When the registry names a newer version than the one a site vendors, the site builds without that piece (no table, or no bar) and does not stop.
  - When the same version has other bytes than its pin, the build stops. That is tampering or a broken copy, not an upgrade.
- **Correction 1: degrading means leaving the file out, never shipping it unchecked.** The vendored file is not served and the page works without it. The build log and the site's status say "<piece> <version> off: the registry names <newer>", so it is seen, not silent.
- **Correction 2, for dev@: keep every version's pin in the registry.** For example `obs_tz.versions["1.0.0"].integrity`, append-only, with the current one named. A site then checks its vendored version against that version's own pin and keeps working until it upgrades. Degrading becomes rare, and an old pin can never be quietly replaced. Low, dev@.
