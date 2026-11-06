#!/usr/bin/env python3
"""The claims sweep (observability@PrompTugal.dinis, 6 November 2026, from Dinis's brief board/spec-vault-onboarding.md,
"The sweep agent"): obs_drain.py's loop again, for the readers' vault claims. Run inside this role's hourly wake.

    PT_PILOT_ACCESS_KEY=... python3 -I newsroom/tools/obs/claims_sweep.py [--creds ~/.sg-send/claims-promptugal/creds.json] [--dry]

1. list the claim lane with the enum key, fetch in batches of 100;
2. open each claim with the sweep's key and verify the reader's signature against the sign_pub it carries; a failure is
   kept and marked in the ledger, never dropped; a lookup neither in the pool nor retired at the last sweep is ignored;
3. the first claim per lookup wins, by the epoch-ms prefix of its server-assigned file name, also across sweeps (the
   ledger's state/claimed.json); a later claimant gets a "duplicate" mailbox message carrying a fresh API key (its own
   licence, never added to the pool); the winner gets a "welcome";
4. retire the claimed keys from pool/available.json and refill to N within the daily cap (pool_mint.mint; N = 0 stops);
5. write the ledger (private vault): one line per claim, claims/<day>.jsonl: lookup, the reader's fingerprints, mailbox
   id, door mode, lane file, time, result;
6. mailbox replies: mailbox/<mailbox>/<n>.json in the pool vault, sealed to the reader, signed by the issuer, n bound;
7. daily counts to the observability public vault (claims/daily.json): the dashboard's vault sign-ups;
8. commit and push the pool, the ledger and the counts; ONLY THEN mark the claims processed: a failed push loses nothing.
Without PT_PILOT_ACCESS_KEY it still records and verifies, but mints nothing (no refill, no fresh key for a duplicate),
and says so. Prints counts only.
"""
import argparse, collections, hashlib, json, os, subprocess, sys, time
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import claims_lib as L
import pool_mint as P

def commit_push(d, msg):
    r = subprocess.run(['sgit', 'commit', msg], cwd=d, capture_output=True, text=True)
    if r.returncode and not any(w in (r.stdout + r.stderr).lower() for w in ('nothing', 'no changes')):
        raise RuntimeError(f'commit of {os.path.basename(d)} failed (exit {r.returncode})')
    p = subprocess.run(['sgit', 'push'], cwd=d, capture_output=True, text=True)
    if p.returncode: raise RuntimeError(f'push of {os.path.basename(d)} failed (exit {p.returncode})')

def mail(pool, ledger_state, keys, claim, kind, body, in_reply_to):
    box = claim['mailbox']; n = ledger_state.setdefault('mailbox', {}).get(box, 0) + 1
    inner = L.sign_obj(keys['issuer'], {'v': 1, 'kind': kind, 'n': n, 'in_reply_to': in_reply_to, 'body': body, 'at': L.now()}, keys['issuer_fp'])
    L.jsave(os.path.join(pool, 'mailbox', box, f'{n}.json'), {'v': 1, 'envelope': L.seal_to(claim['reader']['encrypt_pub'], inner)})
    ledger_state['mailbox'][box] = n
    return n

def run(c, keys, pool, ledger, obs_pub, access_key, opener=None, pusher=commit_push, log=print):
    """One sweep. Returns its counts. pusher(dir, msg) raises on failure; opener(op, body) stands in for the lane API."""
    t0 = time.time()
    st_p = os.path.join(ledger, 'state', 'sweep.json'); S = L.jload(st_p, {})
    S['sweep'] = S.get('sweep', 0) + 1; me = S['sweep']
    claimed, retired = S.setdefault('claimed', {}), S.setdefault('retired', {})
    pst_p = os.path.join(ledger, 'state', 'pool.json'); PS = L.jload(pst_p, {})
    # 1. list and fetch
    entries, after = [], None
    while True:
        r = L.lane(c, 'list', {'include_content': False, 'limit': 200, **({'after_file_id': after} if after else {})}, opener)
        page = r.get('entries', []); entries += page
        if not r.get('truncated') or not page: break
        after = page[-1]['file_id']
    by_tok = collections.defaultdict(list)
    for e in entries: by_tok[e['inbox']].append(e['file_id'])
    files = []
    for tok, ids in by_tok.items():
        for i in range(0, len(ids), 100): files += [(tok, f) for f in L.lane(c, 'fetch', {'inbox': tok, 'file_ids': ids[i:i + 100]}, opener).get('files', [])]
    # 2. open and verify
    pool_now = {L.lookup_of(e['api_key']): e for e in P.read_pool(pool, keys['issuer_fp'])['entries']}
    recs, counts = [], collections.Counter()
    for tok, f in files:
        claim, finding = L.open_claim(keys['enc'], f['content'])
        fid = f['file_id']; epoch = int(fid[:13]) if fid[:13].isdigit() else 0
        env_hash = hashlib.sha256(f['content'].encode()).hexdigest()
        rec = {'file': fid, 'epoch_ms': epoch, 'tok': tok, 'claim': claim, 'finding': finding, 'in_reply_to': env_hash}
        if not finding and claim['lookup'] not in pool_now and not (claim['lookup'] in retired and retired[claim['lookup']] >= me - 1) and claim['lookup'] not in claimed:
            rec['finding'] = 'ignored: the lookup is neither in the pool nor retired at the last sweep'
        recs.append(rec)
    # 3. first claim per lookup wins (also against earlier sweeps); later ones are duplicates
    minted_fresh = 0
    done_before = set(S.get('files', []))                        # recorded by a sweep whose push then failed: never twice
    for rec in sorted(recs, key=lambda r: (r['epoch_ms'], r['file'])):
        cl = rec['claim']
        if rec['file'] in done_before: rec['result'] = 'already'; counts['already'] += 1; continue
        if rec['finding']: rec['result'] = 'invalid' if not rec['finding'].startswith('ignored') else 'ignored'; counts[rec['result']] += 1; continue
        if cl['lookup'] not in claimed:
            claimed[cl['lookup']] = {'file': rec['file'], 'mailbox': cl['mailbox'], 'at': L.now()}
            retired[cl['lookup']] = me
            rec['result'] = 'won'; counts['won'] += 1
            rec['mail'] = mail(pool, S, keys, cl, 'welcome', {'text': 'Your PrompTugal.news vaults are recorded. Keep your door secret or passkey safe: we hold no copy.'}, rec['in_reply_to'])
        else:
            rec['result'] = 'duplicate'; counts['duplicate'] += 1
            if access_key:
                api = L.new_api_key(); lk, lf = L.make_licence(api, access_key, c.get('access_key_name', 'pilot-shared'), keys['issuer'], keys['issuer_fp'], plan=c.get('plan', 'pilot'))
                L.jsave(os.path.join(pool, 'licences', lk + '.json'), lf); minted_fresh += 1
                claimed[lk] = {'file': rec['file'], 'mailbox': cl['mailbox'], 'at': L.now(), 'reissued_for': cl['lookup']}
                rec['mail'] = mail(pool, S, keys, cl, 'duplicate', {'api_key': api}, rec['in_reply_to'])
            else: rec['mail_pending'] = 'no access key set: the fresh key waits for the next sweep with one'
        counts[cl.get('door_mode', '?')] += 1
    # 4. retire and refill
    left = [e for k, e in pool_now.items() if k not in claimed]
    P.write_pool(pool, left, keys)
    refilled = P.mint(pool, keys, c, PS, access_key, c.get('access_key_name', 'pilot-shared')) if access_key else 0
    # 5. the ledger
    day = time.strftime('%Y-%m-%d', time.gmtime())
    S['files'] = S.setdefault('files', [])[-5000:]; seen = set(S['files'])
    os.makedirs(os.path.join(ledger, 'claims'), exist_ok=True)
    with open(os.path.join(ledger, 'claims', f'{day}.jsonl'), 'a') as out:
        for rec in recs:
            if rec['file'] in seen: continue
            cl = rec['claim'] or {}
            sign_fp = enc_fp = ''
            try: sign_fp = L.fingerprint(L.pem_pub(cl['reader']['sign_pub'])); enc_fp = L.fingerprint(L.pem_pub(cl['reader']['encrypt_pub']))
            except Exception: pass
            out.write(json.dumps({'file': rec['file'], 'lookup': cl.get('lookup', ''), 'sign_fp': sign_fp, 'encrypt_fp': enc_fp, 'mailbox': cl.get('mailbox', ''),
                                  'door_mode': cl.get('door_mode', ''), 'at': cl.get('at', ''), 'received_ms': rec['epoch_ms'], 'result': rec.get('result'),
                                  'finding': rec['finding'], 'mail_n': rec.get('mail'), 'mail_pending': rec.get('mail_pending')}, sort_keys=True) + '\n')
            S['files'].append(rec['file'])
    # 7. daily counts for the dashboard (no lookup, no fingerprint, no mailbox: counts only)
    dp = os.path.join(obs_pub, 'claims', 'daily.json'); D = L.jload(dp, {'v': 1, 'days': {}})
    dd = D['days'].setdefault(day, {})
    for k, v in counts.items(): dd[k] = dd.get(k, 0) + v
    D.update(generated=L.now(), pool={'available': len(P.read_pool(pool, keys['issuer_fp'])['entries']), 'n': int(c.get('pool_n', 0))},
             about='Vault sign-ups on promptugal.news per UTC day (claims swept by observability@PrompTugal.dinis): won, duplicate, invalid, ignored, and by door mode. Counts only.')
    L.jsave(dp, D)
    L.jsave(st_p, S); L.jsave(pst_p, PS)
    # 8. push, then mark
    stamp = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    try:
        for d, m in ((pool, f'sweep {stamp}: pool and mailbox'), (ledger, f'sweep {stamp}: {len(recs)} claim(s)'), (obs_pub, f'sweep {stamp}: claim counts')):
            if d: pusher(d, m)
    except Exception as e:
        log(f'claims_sweep: {e}; nothing marked processed, the claims stay on the lane'); return {'records': len(recs), 'pushed': False, **counts}
    for tok, ids in by_tok.items():
        for i in range(0, len(ids), 100): L.lane(c, 'mark-processed', {'inbox': tok, 'file_ids': ids[i:i + 100]}, opener)
    out = {'records': len(recs), 'pushed': True, 'refilled': refilled, 'fresh_for_duplicates': minted_fresh, 'secs': round(time.time() - t0, 1), **counts}
    log('claims_sweep: ' + ', '.join(f'{k} {v}' for k, v in out.items()) + ('' if access_key else '; no PT_PILOT_ACCESS_KEY: nothing minted'))
    return out

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--creds', default=os.path.expanduser('~/.sg-send/claims-promptugal/creds.json')); ap.add_argument('--dry', action='store_true')
    o = ap.parse_args()
    if not os.path.exists(o.creds): print('claims_sweep: not set up (no creds); nothing to sweep'); return
    c = json.load(open(o.creds)); keys = L.load_keys(c['keys_dir'])
    if o.dry:
        n = len(L.lane(c, 'list', {'include_content': False, 'limit': 200}).get('entries', [])); print(f'claims_sweep: {n} claim(s) pending (dry)'); return
    for d in (c['pool_dir'], c['ledger_dir'], c['obs_public_dir']): subprocess.run(['sgit', 'pull'], cwd=d, capture_output=True)
    ak = os.environ.get('PT_PILOT_ACCESS_KEY') or None
    if ak and ak == os.environ.get('SG_SEND_ACCESS_TOKEN'): ak = None; print('claims_sweep: PT_PILOT_ACCESS_KEY is the agents\' token; refusing to put it in licences')
    run(c, keys, c['pool_dir'], c['ledger_dir'], c['obs_public_dir'], ak)

if __name__ == '__main__': main()
