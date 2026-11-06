#!/usr/bin/env python3
"""Offline tests of the vault-onboarding server side (claims_lib, pool_mint, claims_sweep), as the brief's build plan
lists them: a draw and its licence, a forged licence and a forged mailbox message rejected, a duplicate draw (the first
claim wins, the second gets a fresh key), an unsigned or mis-signed claim kept and marked, an empty pool (N = 0), a failed
push leaves the claims pending. No network: the lane is in memory, the vaults are folders, the push is a stand-in.

    python3 -I newsroom/tools/obs/test_claims.py        (prints OK, or the first failure)
"""
import base64, json, os, shutil, sys, tempfile
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import claims_lib as L, pool_mint as P, claims_sweep as S
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from cryptography.hazmat.primitives import serialization
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto

pem = lambda k: k.public_key().public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode()

class Lane:
    """An append lane in memory: write, list, fetch, mark-processed, with server-assigned <epoch ms>_<hex> names."""
    def __init__(self): self.pending, self.marked, self.t = {}, [], 1793990000000
    def write(self, tok, payload): self.t += 7; fid = f'{self.t}_{os.urandom(12).hex()}'; self.pending[fid] = (tok, payload); return fid
    def __call__(self, op, body):
        if op == 'list': return {'entries': [{'file_id': f, 'inbox': t} for f, (t, _) in sorted(self.pending.items())], 'truncated': False}
        if op == 'fetch': return {'files': [{'file_id': f, 'content': self.pending[f][1]} for f in body['file_ids'] if f in self.pending]}
        if op == 'mark-processed':
            for f in body['file_ids']: self.pending.pop(f, None); self.marked.append(f)
            return {'moved': body['file_ids']}

def reader():
    s, e = ec.generate_private_key(ec.SECP256R1()), rsa.generate_private_key(public_exponent=65537, key_size=2048)
    return {'sign': s, 'enc': e, 'sign_pub': pem(s), 'encrypt_pub': pem(e), 'fp': L.fingerprint(s.public_key())}

def claim_payload(rd, lookup, sweep_pub, mailbox=None, sign_with=None, door='passkey-prf'):
    c = {'v': 1, 'kind': 'claim', 'lookup': lookup, 'site': 'promptugal.news', 'reader': {'sign_pub': rd['sign_pub'], 'encrypt_pub': rd['encrypt_pub']},
         'mailbox': mailbox or os.urandom(16).hex(), 'door_mode': door, 'at': L.now()}
    signer = sign_with or rd
    env = L.seal_to(sweep_pub, c, (signer['sign'], rd['fp']))           # the envelope names rd's fingerprint
    return base64.b64encode(env.encode()).decode(), c

def read_mail(rd, pool, box, n, issuer_pub, issuer_fp):
    f = json.load(open(os.path.join(pool, 'mailbox', box, f'{n}.json')))
    inner = json.loads(PKI__Crypto().hybrid_decrypt(rd['enc'], f['envelope'])['plaintext'])
    L.verify_obj(issuer_pub, inner, issuer_fp); assert inner['n'] == n, 'n not bound to the path'
    return inner

def main():
    T = tempfile.mkdtemp(); ok = []
    try:
        pool, ledger, pub = (os.path.join(T, x) for x in ('pool', 'ledger', 'pub'))
        for d in (pool, ledger, pub): os.makedirs(d)
        iss, enc = ec.generate_private_key(ec.SECP256R1()), rsa.generate_private_key(public_exponent=65537, key_size=2048)
        keys = {'issuer': iss, 'issuer_fp': L.fingerprint(iss.public_key()), 'enc': enc, 'enc_fp': L.fingerprint(enc.public_key())}
        sweep_pub, ipub = pem(enc), iss.public_key()
        cfg = {'pool_n': 3, 'daily_cap': 50, 'plan': 'pilot', 'access_key_name': 'pilot-test'}
        AK = 'test-access-key-not-real'
        # 1. mint and draw
        st = {}; assert P.mint(pool, keys, cfg, st, AK, 'pilot-test') == 3
        poolj = json.load(open(P.pool_file(pool))); L.verify_obj(ipub, poolj, keys['issuer_fp'])
        a, b, c3 = (e['api_key'] for e in poolj['entries'])
        lic = L.open_licence(a, json.load(open(os.path.join(pool, 'licences', L.lookup_of(a) + '.json'))), ipub, keys['issuer_fp'])
        assert lic['access_key'] == AK and lic['lookup'] == L.lookup_of(a); ok.append('mint, draw and open a licence')
        # 2. a forged licence (signed by another key) and a licence copied to another path are refused
        rogue = ec.generate_private_key(ec.SECP256R1())
        _, forged = L.make_licence(a, 'evil', 'x', rogue, keys['issuer_fp'])
        try: L.open_licence(a, forged, ipub, keys['issuer_fp']); raise AssertionError('a forged licence was accepted')
        except AssertionError: raise
        except Exception: pass
        try: L.open_licence(b, json.load(open(os.path.join(pool, 'licences', L.lookup_of(a) + '.json'))), ipub, keys['issuer_fp']); raise AssertionError('a licence opened with another key')
        except AssertionError: raise
        except Exception: pass
        ok.append('forged and moved licences refused')
        # 3. claims: r1 and r2 draw the same key (r1 first), r3 another, a forged envelope, an unknown lookup
        lane = Lane(); TOK = 'tok'
        r1, r2, r3, r4, r5 = (reader() for _ in range(5))
        p1, c1 = claim_payload(r1, L.lookup_of(a), sweep_pub); lane.write(TOK, p1)
        p2, c2 = claim_payload(r2, L.lookup_of(a), sweep_pub, door='door-secret'); lane.write(TOK, p2)
        p3, c3c = claim_payload(r3, L.lookup_of(b), sweep_pub); lane.write(TOK, p3)
        p4, _ = claim_payload(r4, L.lookup_of(c3), sweep_pub, sign_with=r5); lane.write(TOK, p4)     # signed by someone else
        p5, _ = claim_payload(r5, '0' * 32, sweep_pub); lane.write(TOK, p5)
        lane.write(TOK, base64.b64encode(b'not an envelope').decode())
        pushed = []
        out = S.run({'pool_n': 3, 'daily_cap': 50, 'access_key_name': 'pilot-test'}, keys, pool, ledger, pub, AK, opener=lane, pusher=lambda d, m: pushed.append(d), log=lambda s: None)
        assert out['won'] == 2 and out['duplicate'] == 1 and out['invalid'] == 2 and out['ignored'] == 1, out
        assert not lane.pending and len(lane.marked) == 6 and len(pushed) == 3, 'marked before or without the pushes'
        ok.append('first claim wins; forged, unreadable and unknown claims kept and marked; marked only after the pushes')
        # 4. the pool: the two claimed keys retired, refilled to N
        poolj = json.load(open(P.pool_file(pool))); L.verify_obj(ipub, poolj, keys['issuer_fp'])
        ks = [e['api_key'] for e in poolj['entries']]
        assert len(ks) == 3 and a not in ks and b not in ks and c3 in ks, ks; ok.append('retired and refilled to N')
        # 5. the mailbox: r1 welcomed; r2 told it was a duplicate, with a fresh key whose licence opens; a forged message fails
        w = read_mail(r1, pool, c1['mailbox'], 1, ipub, keys['issuer_fp']); assert w['kind'] == 'welcome'
        d = read_mail(r2, pool, c2['mailbox'], 1, ipub, keys['issuer_fp']); assert d['kind'] == 'duplicate'
        fresh = d['body']['api_key']; assert fresh not in ks
        L.open_licence(fresh, json.load(open(os.path.join(pool, 'licences', L.lookup_of(fresh) + '.json'))), ipub, keys['issuer_fp'])
        bad = L.sign_obj(rogue, {'v': 1, 'kind': 'rekey', 'n': 2, 'body': {'api_key': 'sgk_evil'}, 'at': L.now()}, keys['issuer_fp'])
        os.makedirs(os.path.join(pool, 'mailbox', c2['mailbox']), exist_ok=True)
        json.dump({'v': 1, 'envelope': L.seal_to(r2['encrypt_pub'], bad)}, open(os.path.join(pool, 'mailbox', c2['mailbox'], '2.json'), 'w'))
        try: read_mail(r2, pool, c2['mailbox'], 2, ipub, keys['issuer_fp']); raise AssertionError('a forged mailbox message was accepted')
        except AssertionError: raise
        except Exception: pass
        ok.append('welcome and duplicate replies sealed, signed and n-bound; a forged rekey refused')
        # 6. the ledger and the counts carry no secret
        led = open(os.path.join(ledger, 'claims', os.listdir(os.path.join(ledger, 'claims'))[0])).read()
        assert led.count('\n') == 6 and 'sgk_' not in led and AK not in led
        daily = json.load(open(os.path.join(pub, 'claims', 'daily.json')))
        day = list(daily['days'])[0]; assert daily['days'][day]['won'] == 2 and 'lookup' not in json.dumps(daily)
        ok.append('ledger one line per claim, no key; daily counts only')
        # 7. a failed push leaves the claims pending; a claim against an already-won key is a duplicate next sweep
        p6, _ = claim_payload(reader(), L.lookup_of(a), sweep_pub); lane.write(TOK, p6)
        def fail(d, m): raise RuntimeError('push refused')
        out = S.run({'pool_n': 3, 'daily_cap': 50}, keys, pool, ledger, pub, AK, opener=lane, pusher=fail, log=lambda s: None)
        assert out['pushed'] is False and len(lane.pending) == 1; ok.append('a failed push marks nothing')
        out = S.run({'pool_n': 3, 'daily_cap': 50}, keys, pool, ledger, pub, AK, opener=lane, pusher=lambda d, m: None, log=lambda s: None)
        assert out.get('already') == 1 and not out.get('duplicate') and not lane.pending; ok.append('a late claim on a won key is a duplicate, answered once even across a failed push')
        # 8. N = 0 empties the pool; no access key mints nothing; the agents' token is refused
        st = {}; P.mint(pool, keys, {'pool_n': 0}, st, AK, 'x'); assert json.load(open(P.pool_file(pool)))['entries'] == []
        out = S.run({'pool_n': 3}, keys, pool, ledger, pub, None, opener=lane, pusher=lambda d, m: None, log=lambda s: None)
        assert out['refilled'] == 0 and json.load(open(P.pool_file(pool)))['entries'] == []
        os.environ['SG_SEND_ACCESS_TOKEN'] = os.environ['PT_PILOT_ACCESS_KEY'] = 'same'
        try: P.access_key_from_env(); raise AssertionError('the agents\' token was accepted')
        except SystemExit: pass
        ok.append('N = 0 is a kill switch; nothing minted without an access key; the agents\' token refused')
        print('OK: ' + '; '.join(ok))
    finally:
        shutil.rmtree(T, ignore_errors=True)

if __name__ == '__main__': main()
