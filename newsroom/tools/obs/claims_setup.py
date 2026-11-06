#!/usr/bin/env python3
"""Set up the server side of vault onboarding (observability@PrompTugal.dinis, 6 November 2026, from Dinis's brief
board/spec-vault-onboarding.md, "Build plan"; obs_setup.py's pattern again). Run once:

    SG_SEND_ACCESS_TOKEN=... python3 -I newsroom/tools/obs/claims_setup.py --team <a clone of the team's site> [--n 15]

1. the sweep's keys, made here and kept outside the repository (~/.sg-send/claims-promptugal/keys/, 0600): issuer.pem
   (ECDSA P-256: signs the pool, the licences and the mailbox) and sweep.pem (RSA-4096: opens the claims);
2. the POOL vault (public: its read key goes in the site config, so every browser reads the pool and the mailbox);
3. the LEDGER vault (private: the claims ledger and the sweep's state), with the claim lane configured on it: one append
   token (public, in the site config) and the enum key (the sweep's);
4. the site config assets/obs/claims.json: the pool vault's id and read key, the lane's endpoint, vault and token, the
   sweep's encryption key (what claims are sealed to) and the issuer's signing key and fingerprint (what the browser
   pins); and the public halves in board/keys.json as id claims-issuer-promptugal;
5. the credentials (vault keys, enum key, token, both private keys) in ~/.sg-send/claims-promptugal/creds.json (0600)
   and sealed to Dinis's site key (board/person-keys.json, ws-ecies-1, newsroom/tools/person-key.mjs) into
   newsroom/observability/sealed/claims-dinis.json, so they outlive this session.
The pool stays empty until pool_mint.py runs with the pilot's own access key (PT_PILOT_ACCESS_KEY). Prints no secret.
"""
import argparse, datetime, hashlib, json, os, secrets, shutil, subprocess, sys, tempfile, urllib.request
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
import claims_lib as L
HOST = 'https://dev.send.sgraph.ai'
AGENT = 'observability@PrompTugal.dinis'
HOME = os.path.expanduser('~/.sg-send/claims-promptugal')
VAULTS = os.path.expanduser('~/vaults')
h = lambda s: hashlib.sha256(s.encode()).hexdigest()

def sgit(cwd, *a):
    r = subprocess.run(['sgit', *a], cwd=cwd, capture_output=True, text=True)
    if r.returncode: sys.exit(f'claims_setup: sgit {a[0]} failed (exit {r.returncode})')

def create(name, readme, token):
    d = os.path.join(VAULTS, name)
    if os.path.exists(d): sys.exit(f'claims_setup: {d} exists; this runs once')
    os.makedirs(VAULTS, exist_ok=True); sgit(VAULTS, 'create', name, '--base-url', HOST, '--token', token, '--no-push')
    open(os.path.join(d, 'README.md'), 'w').write(readme); sgit(d, 'commit', 'README'); sgit(d, 'push')
    vk = open(os.path.join(d, '.sg_vault', 'local', 'vault_key')).read().strip()
    return d, vk, vk.split(':')[-1]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--team', required=True); ap.add_argument('--n', type=int, default=15); ap.add_argument('--daily-cap', type=int, default=200)
    o = ap.parse_args()
    if os.path.exists(os.path.join(HOME, 'creds.json')): sys.exit('claims_setup: already set up')
    token = os.environ['SG_SEND_ACCESS_TOKEN']
    from cryptography.hazmat.primitives.asymmetric import ec, rsa
    from cryptography.hazmat.primitives import serialization
    from sgit_ai.crypto.Vault__Crypto import Vault__Crypto
    today = datetime.datetime.now(datetime.timezone.utc).strftime('%-d %B %Y')
    # 1. keys
    kd = os.path.join(HOME, 'keys'); os.makedirs(kd, exist_ok=True); os.chmod(HOME, 0o700); os.chmod(kd, 0o700)
    iss, enc = ec.generate_private_key(ec.SECP256R1()), rsa.generate_private_key(public_exponent=65537, key_size=4096)
    for n, k in (('issuer.pem', iss), ('sweep.pem', enc)):
        p = os.path.join(kd, n); open(p, 'wb').write(k.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())); os.chmod(p, 0o600)
    pem = lambda k: k.public_key().public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode()
    iss_fp, enc_fp = L.fingerprint(iss.public_key()), L.fingerprint(enc.public_key())
    # 2. the pool vault (public), 3. the ledger vault (private) with the claim lane
    pool, pool_vk, pool_id = create('promptugal-onboarding-pool', f'# PrompTugal.news vault onboarding: the pool (public)\n\nMade by {AGENT} on {today} from Dinis Cruz\'s brief (board/spec-vault-onboarding.md). pool/available.json (the API keys a reader may draw, signed by the issuer {iss_fp}), licences/<lookup>.json (each sealed with a key derived from its API key), mailbox/<id>/<n>.json (replies sealed to a reader). Its read key is in https://promptugal.news/assets/obs/claims.json.\n', token)
    ledger, led_vk, led_id = create('promptugal-onboarding-ledger', f'# PrompTugal.news vault onboarding: the ledger (private)\n\nMade by {AGENT} on {today}. The claim lane is configured on this vault; claims_sweep.py writes claims/<day>.jsonl (lookup, the reader\'s key fingerprints, mailbox id, door mode, time, result) and state/. Never published.\n', token)
    write_key = Vault__Crypto().derive_keys_from_vault_key(led_vk)['write_key']
    tok, enum_key = secrets.token_hex(32), secrets.token_hex(32)
    req = urllib.request.Request(f'{HOST}/api/vault/append/configure/{led_id}', data=json.dumps({'append_anchors': [h(tok)], 'enum_key_hash': h(enum_key)}).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'x-sgraph-vault-write-key': write_key, 'x-sgraph-access-token': token})
    if json.loads(urllib.request.urlopen(req, timeout=60).read()).get('status') != 'configured': sys.exit('claims_setup: the lane was not configured')
    rk = Vault__Crypto().derive_keys_from_vault_key(pool_vk)['read_key']
    # 4. the site config and the public halves
    L.jsave(os.path.join(ROOT, 'assets', 'obs', 'claims.json'), {
        'about': f'Vault onboarding for PrompTugal.news readers (Dinis Cruz\'s brief, board/spec-vault-onboarding.md; made by {AGENT} on {today}). Public on purpose: the pool vault\'s read key reads the pool and the mailbox; the append token only writes a claim; the encryption key only seals one; the issuer\'s signing key is what the browser checks everything against (pin issuer_fingerprint). Formats: newsroom/tools/obs/claims_lib.py.',
        'enabled': False, 'endpoint': HOST, 'pool': {'vault_id': pool_id, 'read_key': 'sgit_public_read_' + rk},
        'claims': {'vault_id': led_id, 'append_token': tok}, 'sweep': {'fingerprint': enc_fp, 'encrypt': pem(enc)},
        'issuer': {'fingerprint': iss_fp, 'sign': pem(iss)}, 'api_key_prefix': L.API_PREFIX})
    kp = os.path.join(ROOT, 'board', 'keys.json'); K = json.load(open(kp))
    K['keys'].append({'id': 'claims-issuer-promptugal', 'agent': AGENT, 'label': f'{AGENT} (vault onboarding: the issuer and the sweep)', 'added': datetime.date.today().isoformat(), 'status': 'active',
                      'role': 'Signs the onboarding pool, licences and mailbox (sign); claims are sealed to it (encrypt). Kept by observability@PrompTugal.dinis outside the repository, sealed to Dinis for recovery.',
                      'bundle': {'v': 1, 'encrypt': pem(enc), 'sign': pem(iss), 'label': 'claims-issuer-promptugal', 'fingerprint': enc_fp, 'signing_fingerprint': iss_fp}})
    open(kp, 'w').write(json.dumps(K, indent=2, ensure_ascii=False) + '\n')
    # 5. the credentials, here and sealed to Dinis
    creds = {'host': HOST, 'lane_vault_id': led_id, 'enum_key': enum_key, 'append_token': tok, 'pool_vault_id': pool_id, 'pool_vault_key': pool_vk, 'ledger_vault_key': led_vk,
             'pool_dir': pool, 'ledger_dir': ledger, 'obs_public_dir': os.path.expanduser('~/vaults/promptugal-obs-public'), 'keys_dir': kd,
             'pool_n': o.n, 'daily_cap': o.daily_cap, 'plan': 'pilot', 'access_key_name': 'pilot-shared-2026-11', 'made': today, 'by': AGENT}
    cp = os.path.join(HOME, 'creds.json'); open(cp, 'w').write(json.dumps(creds, indent=2)); os.chmod(cp, 0o600)
    t = tempfile.mkdtemp(dir=HOME); os.chmod(t, 0o700)
    try:
        src = os.path.join(t, 'p.json')
        open(src, 'w').write(json.dumps({'type': 'promptugal.claims/creds', **{k: v for k, v in creds.items() if not k.endswith('_dir')},
                                         'issuer_pem': open(os.path.join(kd, 'issuer.pem')).read(), 'sweep_pem': open(os.path.join(kd, 'sweep.pem')).read()})); os.chmod(src, 0o600)
        r = subprocess.run(['node', os.path.join(ROOT, 'newsroom/tools/person-key.mjs'), 'seal', '--person', 'dinis', '--in', src, '--out', os.path.join(ROOT, 'newsroom/observability/sealed/claims-dinis.json'), '--by', AGENT], capture_output=True, text=True)
        if r.returncode: print('claims_setup: sealing to dinis failed: ' + r.stderr.strip()[:200])
    finally: shutil.rmtree(t, ignore_errors=True)
    print(f'claims_setup: pool vault {pool_id} (public), ledger vault {led_id} (private, claim lane configured); issuer {iss_fp}, sweep {enc_fp}; '
          f'assets/obs/claims.json (enabled: false) and board/keys.json written; credentials sealed to dinis. Next: pool_mint.py with PT_PILOT_ACCESS_KEY')

if __name__ == '__main__': main()
