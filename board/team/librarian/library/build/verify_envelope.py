#!/usr/bin/env python3
"""Cryptographic check of the signature on a sealed message (the librarian's desk, round 3).

A sealed message is the base64 of a JSON payload {v, w, i, c, s, f}: c is the AES-GCM ciphertext, s the ECDSA P-256
(SHA-256, raw r||s) signature over the ciphertext bytes, f the signer's signing fingerprint (sgit_ai PKI__Crypto,
hybrid_encrypt). The signature is checked WITHOUT opening the message, against the signer's 'sign' public key in
board/keys.json: the key is found by its fingerprint, and the fingerprint is recomputed from the key itself, so a label
in keys.json is never trusted on its own. The drain (feedback_drain.py) records only the envelope's CLAIMED fingerprint
(sealed_by) and keeps neither the signature nor the ciphertext, so a fingerprint match alone proves nothing.

    verify_envelope.py check --keys board/keys.json --envelope FILE      FILE: the sealed text (base64) or the lane file's JSON
    verify_envelope.py lane  --creds ~/.sg-send/lanes/inbox.json --keys board/keys.json [--out results.json]
                              reads the lane's pending files (read only: nothing is opened, moved or marked processed) and checks each

Prints a JSON object {file id: {verified, signer, key, fingerprint, status, reason}} and never a credential, a message
or a private key. verified is true (checked), false (the signature is invalid or the signer is unknown) or null (the
message carries no signature, or could not be read). Python 3 with `cryptography` (sgit_ai is used when installed).
"""
import argparse, base64, hashlib, json, os, sys, urllib.error, urllib.request

try:
    from cryptography.hazmat.primitives.asymmetric import ec, utils
    from cryptography.hazmat.primitives import hashes, serialization
except Exception as e:  # pragma: no cover
    sys.exit(f'verify_envelope: needs the cryptography package ({type(e).__name__})')


def fingerprint(public_key) -> str:
    # the same as sgit_ai PKI__Crypto.compute_fingerprint: sha256 of the DER SubjectPublicKeyInfo, first 16 hex digits
    der = public_key.public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
    return 'sha256:' + hashlib.sha256(der).hexdigest()[:16]


def payload_of(text):
    """The payload dict of a sealed text (base64 of JSON), or of a lane file's JSON that holds it."""
    t = text.strip()
    if t.startswith('{'):
        d = json.loads(t)
        if 'c' in d and 'w' in d:
            return d
        t = d.get('content') or d.get('sealed') or ''
    raw = base64.b64decode(t)
    try:
        return json.loads(base64.b64decode(raw))   # a lane file's content is base64 of the sealed text
    except Exception:
        return json.loads(raw)


def verify_payload(payload, keys):
    """-> dict(verified, signer, key, fingerprint, status, reason) for one payload and board/keys.json's key list."""
    f, s, c = payload.get('f'), payload.get('s'), payload.get('c')
    if not (f and s and c):
        return dict(verified=None, signer=None, key=None, fingerprint=f or None, status=None, reason='the message carries no signature')
    cands = [k for k in keys if (k.get('bundle') or {}).get('signing_fingerprint') == f and (k.get('bundle') or {}).get('sign')]
    if not cands:
        return dict(verified=False, signer=None, key=None, fingerprint=f, status=None, reason='no key in board/keys.json has this signing fingerprint')
    cands.sort(key=lambda k: (k.get('status') or 'active') != 'active')
    try:
        sig = base64.b64decode(s)
        ct = base64.b64decode(c)
        if len(sig) != 64:
            raise ValueError('a raw r||s signature is 64 bytes')
        der = utils.encode_dss_signature(int.from_bytes(sig[:32], 'big'), int.from_bytes(sig[32:], 'big'))
    except Exception as e:
        return dict(verified=False, signer=None, key=None, fingerprint=f, status=None, reason=f'the signature or ciphertext is malformed ({type(e).__name__})')
    last = 'the signature does not match the key'
    for k in cands:
        b = k['bundle']
        try:
            pub = serialization.load_pem_public_key(b['sign'].encode())
            if fingerprint(pub) != f:
                last = f"the key {k.get('id')} does not hash to its own signing fingerprint"
                continue
            pub.verify(der, ct, ec.ECDSA(hashes.SHA256()))
            return dict(verified=True, signer=k.get('agent'), key=k.get('id'), fingerprint=f, status=k.get('status') or 'active',
                        reason='ECDSA P-256 over the sealed ciphertext, against the key in board/keys.json')
        except Exception as e:
            last = 'the signature does not match the key' if type(e).__name__ == 'InvalidSignature' else f'{type(e).__name__}'
    return dict(verified=False, signer=None, key=None, fingerprint=f, status=None, reason=last)


def call(c, op, body):
    req = urllib.request.Request(f"{c['host']}/api/vault/append/{op}/{c['vault_id']}", data=json.dumps(body).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': c['enum_key']})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        raise SystemExit(f'verify_envelope: {op} failed with {e.code}')
    except Exception as e:
        raise SystemExit(f'verify_envelope: {op} failed ({type(e).__name__})')


def lane(creds_file, keys):
    c = json.load(open(os.path.expanduser(creds_file)))
    entries, after = [], None
    while True:
        r = call(c, 'list', {'include_content': False, **({'after_file_id': after} if after else {})})
        page = r.get('entries', [])
        entries += page
        if not r.get('truncated') or not page:
            break
        after = page[-1]['file_id']
    mine = [e for e in entries if e.get('inbox') == c['append_token']]
    out = {}
    for k in range(0, len(mine), 20):
        ids = [e['file_id'] for e in mine[k:k + 20]]
        for f in call(c, 'fetch', {'inbox': c['append_token'], 'file_ids': ids}).get('files', []):
            fid = f['file_id'].replace('.enc', '')
            try:
                out[fid] = verify_payload(payload_of(f['content']), keys)
            except Exception as e:
                out[fid] = dict(verified=None, signer=None, key=None, fingerprint=None, status=None, reason=f'could not be read ({type(e).__name__})')
    return out


def main():
    a = argparse.ArgumentParser()
    a.add_argument('mode', choices=['check', 'lane'])
    a.add_argument('--keys', required=True)
    a.add_argument('--envelope')
    a.add_argument('--creds')
    a.add_argument('--out')
    o = a.parse_args()
    keys = json.load(open(o.keys)).get('keys', [])
    if o.mode == 'check':
        if not o.envelope:
            sys.exit('verify_envelope: check needs --envelope')
        res = {os.path.basename(o.envelope): verify_payload(payload_of(open(o.envelope).read()), keys)}
    else:
        if not o.creds:
            sys.exit('verify_envelope: lane needs --creds')
        res = lane(o.creds, keys)
    text = json.dumps(res, indent=1, sort_keys=True) + '\n'
    if o.out:
        open(o.out, 'w').write(text)
    else:
        sys.stdout.write(text)


if __name__ == '__main__':
    main()
