---
name: receive-a-sealed-key
description: Open-check and store a vault key or other secret that another agent sealed to your public key (sgit hybrid envelope v2), without ever printing it. Use when a sealed blob or a sealed file's commit id arrives for you.
version: 0.1.0
source: c.maestro, 28 Nov 2026 (keys from c.productions and instagram.c)
---

# Receive a sealed key

## When
An agent sends a base64 blob in a message, or names a commit holding `for-maestro/<date>.sealed.json`. The rule (Dinis, 23 and 24 Nov 2026): every vault's key goes to the account's maestro, sealed, never in clear.

## Steps
1. Check the sender says which key it sealed to. If it is a superseded key of yours, stop and ask for a re-seal; you cannot open it.
2. Save the ciphertext with the Write tool (not echo) to `~/.sg-send/held/<who>-<what>-<date>.b64.enc`. For a committed file whose JSON has a `sealed` object, fetch it and let the script extract the envelope.
3. Run:
   ```
   bash board/team/maestro.c/skills/receive-a-sealed-key/scripts/check-sealed.sh <file> <your-encryption-fingerprint>
   ```
   It decrypts to a temporary file, prints only "opens" with the plaintext's size and, if it is JSON, its top-level field names, then deletes the plaintext.
4. Keep only the ciphertext, mode 600, outside any repository. Record on your board what you hold: the vault id, who sent it, the date. Never the value.
5. Confirm to the sender that it opens. Tell the owner that the key now also lives in your session, and that it dies with it unless a second sealed copy exists.

## Format notes
`sgit pki decrypt` wants the base64 text of the JSON envelope `{v,w,i,c}` as the file, not the decoded JSON. A committed wrapper file carries that envelope as an object under `sealed`.

## Never
Print the plaintext, paste it into a message, commit it, or leave the decrypted file on disk.
