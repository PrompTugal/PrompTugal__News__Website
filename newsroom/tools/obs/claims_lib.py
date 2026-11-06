#!/usr/bin/env python3
"""Vault onboarding for PrompTugal.news readers: the shared formats (observability@PrompTugal.dinis, 6 November 2026,
from Dinis's brief board/spec-vault-onboarding.md, "File and message formats"; the server side is the observability
lane pattern again, so it is this role's). Used by claims_setup.py, pool_mint.py and claims_sweep.py; the browser side
(dev.search@'s onboard.js) must compute exactly the same, so every rule is written out here:

  canonical JSON   json.dumps(obj without "sig", sort_keys=True, separators=(",", ":"), ensure_ascii=False), UTF-8
  issuer signature ECDSA P-256 over SHA-256 of the canonical JSON, raw r||s (64 bytes, IEEE P1363), base64: "sig"
                   (WebCrypto: sign/verify {name: 'ECDSA', hash: 'SHA-256'} gives and takes exactly this form)
  API key          "sgk_" + 32 hex (128 random bits)
  lookup           first 32 hex of HKDF-SHA256(ikm = the API key's UTF-8 bytes, salt = none (32 zero bytes),
                   info = "pt.news/licence/lookup/v1", length 32)
  kenc             HKDF-SHA256(same ikm, salt none, info = "pt.news/licence/enc/v1", length 32): an AES-256-GCM key
  licence file     licences/<lookup>.json = {"v":1, "iv": b64(12 bytes), "c": b64(AES-256-GCM(kenc) of the signed
                   licence's canonical JSON with its "sig", i.e. json.dumps(signed, sort_keys, compact))}
  claim            the lane payload: base64 of sgit hybrid envelope v2 (RSA-OAEP-SHA256 + AES-256-GCM, as obs.js),
                   sealed to the sweep's encryption key and SIGNED in the envelope by the reader ("s" = P1363 over
                   the ciphertext, "f" = the reader's signing fingerprint, sha256:<16 hex> of the SPKI DER)
  mailbox message  mailbox/<mailbox>/<n>.json = {"v":1, "envelope": <hybrid envelope v2 to reader.encrypt_pub>}, its
                   plaintext an issuer-signed object with "n" equal to the path's n
Nothing here prints a key.
"""
import base64, hashlib, json, os, secrets, time, urllib.error, urllib.request

POOL_INFO_LOOKUP = b'pt.news/licence/lookup/v1'
POOL_INFO_ENC = b'pt.news/licence/enc/v1'
API_PREFIX = 'sgk_'                                     # the brief's placeholder; the team decides (spec, asks)

def now(): return time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

def canon(obj):
    return json.dumps({k: v for k, v in obj.items() if k != 'sig'}, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()

def b64(b): return base64.b64encode(b).decode()
def unb64(s): return base64.b64decode(s)

def _p1363(der):
    from cryptography.hazmat.primitives.asymmetric import utils
    r, s = utils.decode_dss_signature(der); return r.to_bytes(32, 'big') + s.to_bytes(32, 'big')

def sign_obj(priv, obj, issuer_fp):
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.hazmat.primitives import hashes
    o = {**obj, 'issuer': issuer_fp}; o.pop('sig', None)
    o['sig'] = b64(_p1363(priv.sign(canon(o), ec.ECDSA(hashes.SHA256()))))
    return o

def verify_raw(pub, raw, data):
    from cryptography.hazmat.primitives.asymmetric import ec, utils
    from cryptography.hazmat.primitives import hashes
    if len(raw) != 64: raise ValueError('a signature is 64 bytes, r||s')
    pub.verify(utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big')), data, ec.ECDSA(hashes.SHA256()))

def verify_obj(pub, obj, issuer_fp=None):
    if issuer_fp and obj.get('issuer') != issuer_fp: raise ValueError('signed by another issuer')
    verify_raw(pub, unb64(obj['sig']), canon(obj)); return True

def fingerprint(pub):
    from cryptography.hazmat.primitives import serialization
    return 'sha256:' + hashlib.sha256(pub.public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)).hexdigest()[:16]

def pem_pub(pem):
    from cryptography.hazmat.primitives import serialization
    return serialization.load_pem_public_key(pem.encode() if isinstance(pem, str) else pem)

def hkdf(api_key, info):
    from cryptography.hazmat.primitives.kdf.hkdf import HKDF
    from cryptography.hazmat.primitives import hashes
    return HKDF(algorithm=hashes.SHA256(), length=32, salt=None, info=info).derive(api_key.encode())

def new_api_key(): return API_PREFIX + secrets.token_hex(16)
def lookup_of(api_key): return hkdf(api_key, POOL_INFO_LOOKUP).hex()[:32]
def kenc_of(api_key): return hkdf(api_key, POOL_INFO_ENC)

def make_licence(api_key, access_key, access_key_name, issuer_priv, issuer_fp, plan='pilot', limits=None, days=92):
    """The signed licence for one API key, and the encrypted file that holds it at licences/<lookup>.json."""
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    lk = lookup_of(api_key)
    lic = sign_obj(issuer_priv, {'v': 1, 'kind': 'licence', 'lookup': lk, 'access_key': access_key, 'access_key_name': access_key_name,
                                 'plan': plan, 'limits': limits or {'vaults': 5, 'bytes': 104857600}, 'issued': now(),
                                 'not_after': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(time.time() + days * 86400))}, issuer_fp)
    iv = os.urandom(12)
    c = AESGCM(kenc_of(api_key)).encrypt(iv, json.dumps(lic, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode(), None)
    return lk, {'v': 1, 'iv': b64(iv), 'c': b64(c)}

def open_licence(api_key, file_obj, issuer_pub, issuer_fp):
    """What the browser does (for the tests): decrypt with kenc, verify the issuer, the lookup binding and not_after."""
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    lic = json.loads(AESGCM(kenc_of(api_key)).decrypt(unb64(file_obj['iv']), unb64(file_obj['c']), None))
    verify_obj(issuer_pub, lic, issuer_fp)
    if lic['lookup'] != lookup_of(api_key): raise ValueError('the licence is bound to another lookup')
    if lic['not_after'] < now(): raise ValueError('the licence has expired')
    return lic

def seal_to(encrypt_pub_pem, obj, signer=None):
    """Hybrid envelope v2 to a reader (or to the sweep), optionally signed in the envelope by (private, fingerprint)."""
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    k = PKI__Crypto()
    return k.hybrid_encrypt(k.import_public_key_pem(encrypt_pub_pem), json.dumps(obj, ensure_ascii=False),
                            signing_private_key=signer[0] if signer else None, signing_fingerprint=signer[1] if signer else None)

def open_claim(enc_priv, lane_content):
    """A lane record: base64 of the envelope. Open it, then check the envelope's signature against the sign_pub the claim
    carries (that it is the claimant's key, not who they are). Returns (claim, None) or (claim or None, finding)."""
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    try:
        env_text = unb64(lane_content).decode()
        env = json.loads(unb64(env_text))
        r = PKI__Crypto().hybrid_decrypt(enc_priv, env_text)
        claim = json.loads(r['plaintext'])
    except Exception as e:
        return None, f'unreadable: {type(e).__name__}'
    try:
        if claim.get('v') != 1 or claim.get('kind') != 'claim': raise ValueError('not a claim v1')
        if not (isinstance(claim.get('lookup'), str) and len(claim['lookup']) == 32): raise ValueError('no lookup')
        if not (isinstance(claim.get('mailbox'), str) and len(claim['mailbox']) == 32 and all(ch in '0123456789abcdef' for ch in claim['mailbox'])): raise ValueError('no mailbox id')
        if not env.get('s') or not env.get('f'): raise ValueError('the envelope is not signed')
        pub = pem_pub(claim['reader']['sign_pub'])
        if fingerprint(pub) != env['f']: raise ValueError('signed by a key other than the one the claim carries')
        verify_raw(pub, unb64(env['s']), unb64(env['c']))
        pem_pub(claim['reader']['encrypt_pub'])
        if any(k in json.dumps(claim) for k in ('sgk_', 'sgit_private_')): raise ValueError('the claim carries a secret it must not')
        return claim, None
    except Exception as e:
        return claim, f'{type(e).__name__}: {e}'[:200]

def lane(c, op, body, opener=None):
    """One append-lane call (list, fetch, mark-processed) with the enum key; opener is injectable for the tests."""
    if opener: return opener(op, body)
    req = urllib.request.Request(f"{c['host']}/api/vault/append/{op}/{c['lane_vault_id']}", data=json.dumps(body).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': c['enum_key']})
    try:
        with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        raise SystemExit(f'claims: lane {op} failed with {e.code}')

def jload(p, default):
    try: return json.load(open(p))
    except Exception: return default

def jsave(p, obj):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp'
    with open(tmp, 'w') as f: json.dump(obj, f, indent=1, sort_keys=True, ensure_ascii=False)
    os.replace(tmp, p)

def load_keys(kdir):
    """The sweep's own keys, outside the repository: issuer.pem (ECDSA P-256, signs the pool, licences and mailbox) and
    sweep.pem (RSA-4096, opens claims)."""
    from cryptography.hazmat.primitives import serialization
    rd = lambda n: serialization.load_pem_private_key(open(os.path.join(kdir, n), 'rb').read(), password=None)
    iss, enc = rd('issuer.pem'), rd('sweep.pem')
    return {'issuer': iss, 'issuer_fp': fingerprint(iss.public_key()), 'enc': enc, 'enc_fp': fingerprint(enc.public_key())}
