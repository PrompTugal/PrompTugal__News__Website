#!/usr/bin/env python3
"""Fill the pool vault back up to N API keys, each with its signed, encrypted licence (observability@PrompTugal.dinis,
6 November 2026, from Dinis's brief board/spec-vault-onboarding.md; formats in claims_lib.py).

    PT_PILOT_ACCESS_KEY=... python3 -I newsroom/tools/obs/pool_mint.py [--creds ~/.sg-send/claims-promptugal/creds.json] [--dry]

The access key every pilot licence carries is read from PT_PILOT_ACCESS_KEY only: a token made for the pilot (the
brief's ask (1)), never the agents' SG_SEND_ACCESS_TOKEN, which this tool refuses. N and the daily cap D come from the
creds file ("pool_n", "daily_cap"); N = 0 is the kill switch. Licences of retired keys stay in place, so a reader who
drew one keeps working. Prints counts only.
"""
import argparse, json, os, sys, time
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import claims_lib as L

def pool_file(pool): return os.path.join(pool, 'pool', 'available.json')

def read_pool(pool, issuer_fp):
    p = L.jload(pool_file(pool), None)
    return p if p else {'v': 1, 'kind': 'pool', 'issuer': issuer_fp, 'updated': L.now(), 'entries': []}

def write_pool(pool, entries, keys):
    L.jsave(pool_file(pool), L.sign_obj(keys['issuer'], {'v': 1, 'kind': 'pool', 'updated': L.now(), 'entries': entries}, keys['issuer_fp']))

def minted_today(state):
    day = time.strftime('%Y-%m-%d', time.gmtime())
    return state.get('minted', {}).get(day, 0), day

def mint(pool, keys, cfg, state, access_key, access_key_name):
    """Refill to N, within the daily cap. Returns how many were minted. state (the ledger's state/pool.json) counts per day."""
    n = int(cfg.get('pool_n', 0)); cap = int(cfg.get('daily_cap', 200))
    entries = read_pool(pool, keys['issuer_fp'])['entries']
    done, day = minted_today(state)
    want = max(0, min(n - len(entries), cap - done))
    for _ in range(want):
        api = L.new_api_key()
        lk, f = L.make_licence(api, access_key, access_key_name, keys['issuer'], keys['issuer_fp'], plan=cfg.get('plan', 'pilot'), days=int(cfg.get('licence_days', 92)))
        L.jsave(os.path.join(pool, 'licences', lk + '.json'), f)
        entries.append({'api_key': api, 'added': L.now()})
    if n == 0 and entries: entries = []                          # the kill switch empties the pool (licences stay)
    write_pool(pool, entries, keys)
    state.setdefault('minted', {})[day] = done + want
    return want

def access_key_from_env():
    ak = os.environ.get('PT_PILOT_ACCESS_KEY', '')
    if not ak: raise SystemExit('pool_mint: PT_PILOT_ACCESS_KEY is not set (the pilot\'s own access token, at Dinis\'s word); nothing minted')
    if ak == os.environ.get('SG_SEND_ACCESS_TOKEN'): raise SystemExit('pool_mint: PT_PILOT_ACCESS_KEY is the agents\' token; the brief asks for one made for the pilot. Nothing minted')
    return ak

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--creds', default=os.path.expanduser('~/.sg-send/claims-promptugal/creds.json')); ap.add_argument('--dry', action='store_true')
    o = ap.parse_args(); c = json.load(open(o.creds)); keys = L.load_keys(c['keys_dir'])
    pool, ledger = c['pool_dir'], c['ledger_dir']
    sp = os.path.join(ledger, 'state', 'pool.json'); state = L.jload(sp, {})
    have = len(read_pool(pool, keys['issuer_fp'])['entries'])
    if o.dry: print(f'pool_mint: {have} in the pool, N = {c.get("pool_n", 0)} (dry: nothing minted)'); return
    k = mint(pool, keys, c, state, access_key_from_env(), c.get('access_key_name', 'pilot-shared'))
    L.jsave(sp, state)
    import claims_sweep
    claims_sweep.commit_push(pool, f'pool: {k} minted'); claims_sweep.commit_push(ledger, f'pool state: {k} minted')
    print(f'pool_mint: {k} minted; the pool holds {len(read_pool(pool, keys["issuer_fp"])["entries"])} (N = {c.get("pool_n", 0)})')

if __name__ == '__main__': main()
