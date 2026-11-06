#!/usr/bin/env python3
"""Drain PrompTugal.news's observability lanes (observability@PrompTugal.dinis, 6 November 2026, at Dinis Cruz's word:
"replicate what we have on web-summit.sgit.ai"). The team site's admin/tools/obs_drain.py and telemetry_drain.py
(observability@web-summit.dinis, conductor@web-summit.jose), with this site's vaults; the steps are theirs:

    python3 -I newsroom/tools/obs/obs_drain.py [--creds ~/.sg-send/obs-promptugal/creds.json] [--dry] [--all]

L  load: list every lane with the enum key, fetch in batches of 50;
E  extract: open each record with the drain key (identity/private/ in the data vault); verify an agent run
   (newsroom/tools/agent-log.mjs) against the agent's own key on the team site's data/keys.json (an active key whose
   label is that agent, the signature over this very record); a page event that names a person against the team
   site's data/person-keys.json. A failure is kept and marked, never dropped;
S  save raw: each record into the PRIVATE data vault by the hour it happened (events/<day>/<hh>/events.jsonl), once;
   commit and push; only then mark the records processed, so a failed push loses nothing;
T  transform each new hour once, then its day, then latest/ (newsroom/tools/obs/obs_lets.py, the team site's);
S  save public: into the PUBLIC vault (read key published, data/newsroom/observability/vaults.json): latest/*.json,
   <day>/day.json, <day>/<hh>/hour.json and data/public.json. No anonymous row, tab id, time zone or language there.
Prints counts only, never a key or an event. Every record is an untrusted claim: the lanes' tokens are public.
Python 3 with sgit-ai (pip install sgit-ai) for the crypto and the vaults; the agents' keys are board/keys.json.
"""
import argparse, base64, collections, json, os, subprocess, sys, time, urllib.error, urllib.request

sys.dont_write_bytecode = True                                           # no __pycache__ in the clone (the gate refuses it)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, HERE)
import obs_lets as lets
import obs_banner as banner

AGENT = 'observability@PrompTugal.dinis'
RUN_TYPE = 'web-summit.agent-run/v1'                                      # the team's record type, kept so both sources read alike
TEAM_RAW = 'https://raw.githubusercontent.com/SGit-AI/SGit-AI__Website__Web-Summit/dev/'

def post(c, op, body):
    req = urllib.request.Request(f"{c['host']}/api/vault/append/{op}/{c['vault_id']}", data=json.dumps(body).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': c['enum_key']})
    try:
        with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        raise SystemExit(f'obs_drain: {op} failed with {e.code}' + (' (a bad enum key or vault id returns 404)' if e.code == 404 else ''))

def sgit(vault, *args):
    r = subprocess.run(['sgit', *args], cwd=vault, capture_output=True, text=True)
    if r.returncode and args[0] != 'pull': raise SystemExit(f"obs_drain: sgit {args[0]} failed (exit {r.returncode}); nothing marked processed")
    return r

def team_json(rel, team):
    """The team site's keys, from a local clone if given, else from GitHub (read only)."""
    if team: return json.load(open(os.path.join(team, rel)))
    with urllib.request.urlopen(TEAM_RAW + rel, timeout=60) as r: return json.loads(r.read())

def agent_of(k):
    return k.get('agent') or ((k.get('bundle') or {}).get('label') or k.get('label') or '').split()[0]

def b64u(x): return int.from_bytes(base64.urlsafe_b64decode(x + '=' * (-len(x) % 4)), 'big')

def ecdsa_ok(pub, sg):
    from cryptography.hazmat.primitives.asymmetric import ec, utils
    from cryptography.hazmat.primitives import hashes
    raw = base64.b64decode(sg['sig'])
    pub.verify(utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big')), sg['over'].encode(), ec.ECDSA(hashes.SHA256()))

def verify_agent(rec, keys):
    sg = rec.pop('sig', None)
    if not sg: rec['signed'] = False; return rec
    try:
        from cryptography.hazmat.primitives import serialization
        k = next((k for k in keys if (k.get('bundle') or {}).get('signing_fingerprint') == sg.get('key')), None)
        if not k: raise ValueError(f"no published key {sg.get('key')}")
        if agent_of(k).lower() != str(rec.get('agent', '')).lower(): raise ValueError(f"key {sg.get('key')} is {agent_of(k)}'s, not {rec.get('agent')}'s")
        if k.get('status') not in (None, '', 'active') or k.get('replaced_by'): raise ValueError(f"key {sg.get('key')} is {k.get('status')}")
        ecdsa_ok(serialization.load_pem_public_key(k['bundle']['sign'].encode()), sg)
        if json.loads(sg['over']) != rec: raise ValueError('the record differs from what was signed')
        rec['signed'] = True; rec['key'] = sg['key']; rec['key_id'] = k['id']
    except Exception as e:
        rec['signed'] = False; rec['sig_finding'] = f'{type(e).__name__}: {e}'[:200]
    return rec

def verify_page(ev, people):
    """A page event is anonymous unless it names a person and carries their site key's signature (no keyring on this
    site yet, so in practice none does); a claimed person without a valid signature is dropped to anonymous."""
    sg = ev.pop('sig', None)
    if not ev.get('person') and not sg: return ev
    try:
        from cryptography.hazmat.primitives.asymmetric import ec
        if not sg: raise ValueError('a person without a signature')
        k = next((k for k in people if k['person'] == ev.get('person') and k['fingerprint'] == sg.get('key')), None)
        if not k: raise ValueError(f"no published key {sg.get('key')}")
        if k.get('status') != 'active': raise ValueError(f"key {k['fingerprint']} is {k.get('status')}")
        ecdsa_ok(ec.EllipticCurvePublicNumbers(b64u(k['sign']['x']), b64u(k['sign']['y']), ec.SECP256R1()).public_key(), sg)
        over = json.loads(sg['over'])
        if any(over.get(f) != ev.get(f) for f in ('path', 'ts', 'sid', 'person')): raise ValueError('the event differs from what was signed')
        ev['verified'] = True; ev['key'] = k['fingerprint']
    except Exception as e:
        ev.pop('person', None); ev['sig_finding'] = f'{type(e).__name__}: {e}'[:200]
    return ev

def roster(keys):
    """Every PrompTugal agent with an active key on board/keys.json: the agents expected to log."""
    return sorted({agent_of(k) for k in keys if k.get('status') in (None, '', 'active') and not k.get('replaced_by') and '@promptugal.' in agent_of(k).lower()})

def public(allrows, now):
    """data/public.json: one file with the totals per group and the agents' runs, for a reader that wants one fetch."""
    good = [r for r in allrows if r.get('v') == 1 and not r.get('test')]
    pages = [r for r in good if r.get('type') in ('view', 'read')]
    runs = sorted([r for r in good if r.get('type') == RUN_TYPE], key=lambda r: r.get('run', ''), reverse=True)
    keep = ('agent', 'run', 'trigger', 'repo', 'read', 'did', 'tokens', 'notes', 'signed', 'key_id', 'sig_finding')
    return {'v': 1, 'generated': now, 'site': lets.SITE, 'records': len(good),
            'pages': {'views': sum(1 for r in pages if r['type'] == 'view'), 'reads': sum(1 for r in pages if r['type'] == 'read')},
            'agents': {'runs': len(runs), 'signed': sum(1 for r in runs if r.get('signed')), 'recent': [{k: r[k] for k in keep if k in r} for r in runs[:200]]},
            'about': f'Published by {AGENT} (newsroom/tools/obs/obs_drain.py) from the private vault. Counts only for anonymous readers; every record is an untrusted claim. The per-group files are latest/*.json.'}

def oddities(data, pub, by_lane, odd):
    """What is odd this run, one line each, printed ABOVE the done banner (observability@web-summit.dinis's briefing
    "How the drain reports itself", relayed at Dinis's word on 6 November 2026): a lane at 800 or more pending (full at
    1,000: 507), a claimed key never seen before, an agent that logged before and has been silent for 24 hours, a failed
    push. The keys and agents already seen are kept in the private vault (state/seen.json). Counts and names only."""
    for lane, n in sorted(by_lane.items()):
        if n >= 800: odd.append(f'lane {lane} holds {n} pending: ' + ('FULL (507)' if n >= 1000 else 'near full'))
    seen_p = os.path.join(data, 'state', 'seen.json')
    seen = lets.jload(seen_p, {'keys': [], 'agents': []})
    f = lets.jload(os.path.join(pub, 'latest', 'findings.json'), {'by_key': []})
    for k, n in f.get('by_key', []):
        if k and k not in seen['keys']: odd.append(f'a new claimed key {k} ({n} signature finding(s))'); seen['keys'].append(k)
    w = lets.jload(os.path.join(pub, 'latest', 'widgets.json'), {'silent_24h': []})
    for name, last, hrs in w.get('silent_24h', []):
        if last and name in seen['agents']: odd.append(f'{name} has not logged for {hrs} h (last {last})')
    a = lets.jload(os.path.join(pub, 'latest', 'agents.json'), {'agents': []})
    seen['agents'] = sorted(set(seen['agents']) | {x['agent'] for x in a.get('agents', []) if x.get('runs')})
    lets.jsave(seen_p, seen)
    return odd

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--creds', default=os.path.expanduser('~/.sg-send/obs-promptugal/creds.json'))
    ap.add_argument('--team', help="a clone of the team's site, for data/keys.json and data/person-keys.json (default: read from GitHub)")
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--all', action='store_true', help='transform every hour again, not only the new ones')
    o = ap.parse_args()
    c = json.load(open(o.creds))
    data, pub = c['data_dir'], c['public_dir']
    for d, vk in ((data, c['vault_key']), (pub, c['public_vault_key'])):           # a new session: clone the vaults from their keys
        if not os.path.isdir(d):
            os.makedirs(os.path.dirname(d), exist_ok=True)
            r = subprocess.run(['sgit', 'clone', vk, d, '--base-url', c['host']], capture_output=True, text=True)
            if r.returncode: raise SystemExit(f'obs_drain: could not clone {os.path.basename(d)} (exit {r.returncode})')
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from concurrent.futures import ThreadPoolExecutor
    pki, pool = PKI__Crypto(), ThreadPoolExecutor(max_workers=8)
    T, tick, t_start, odd = {}, [time.time()], time.time(), []
    def phase(name):
        now = time.time(); T[name] = round(now - tick[0], 2); tick[0] = now
    # L: load the lanes
    entries, after = [], None
    while True:
        r = post(c, 'list', {'include_content': False, 'limit': 200, **({'after_file_id': after} if after else {})})
        page = r.get('entries', []); entries += page
        if not r.get('truncated') or not page: break
        after = page[-1]['file_id']
    lanes = collections.OrderedDict()
    for e in entries: lanes.setdefault(e['inbox'], []).append(e['file_id'])
    by_lane = {c['tokens'].index(t) + 1: len(ids) for t, ids in lanes.items() if t in c['tokens']}
    print(banner.start(by_lane, c.get('lane_names') or [f'lane {i}' for i in range(1, len(c['tokens']) + 1)], 0))
    phase('list')
    if o.dry: return
    sgit(data, 'pull')
    key = pki.import_private_key_pem(open(os.path.join(data, 'identity/private/private_key.pem')).read())
    keys = json.load(open(os.path.join(ROOT, 'board', 'keys.json')))['keys']          # the PrompTugal agents' keys (CLAUDE.md)
    subprocess.run(['git', 'pull', '-q', '--rebase', 'origin', 'dev'], cwd=ROOT, capture_output=True)   # a key added since the last drain
    keys = json.load(open(os.path.join(ROOT, 'board', 'keys.json')))['keys']
    people = team_json('data/person-keys.json', o.team)['keys']
    def extract(content):
        try:
            ev = json.loads(pki.hybrid_decrypt(key, base64.b64decode(content).decode())['plaintext'])
            return verify_agent(ev, keys) if ev.get('type') == RUN_TYPE else verify_page(ev, people)
        except Exception as e: return {'v': 0, 'undecryptable': True, 'error': type(e).__name__}
    touched, from_browser = lets.fold_inbox(data, extract)
    phase('pull')
    rows, done, bad = [], collections.defaultdict(list), 0
    if entries:
        batches = [(token, ids[i:i + 50]) for token, ids in lanes.items() for i in range(0, len(ids), 50)]
        fetched = list(pool.map(lambda tb: (tb[0], post(c, 'fetch', {'inbox': tb[0], 'file_ids': tb[1]}).get('files', [])), batches))
        phase('fetch')
        items = [(token, f) for token, files in fetched for f in files]
        for (token, f), ev in zip(items, pool.map(lambda tf: extract(tf[1]['content']), items)):
            bad += 1 if ev.get('undecryptable') else 0
            ev['_file'] = f['file_id']; ev['_lane'] = c['tokens'].index(token) + 1 if token in c['tokens'] else 0
            ev['_received'] = int(f['file_id'][:13]) if f['file_id'][:13].isdigit() else None
            rows.append(ev); done[token].append(f['file_id'])
        phase('open_and_verify')
        touched |= lets.save_raw(data, rows)
    stamp = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    now_hour = (stamp[:10], stamp[11:13])
    if touched or rows:
        sgit(data, 'commit', f'drain {stamp}: {len(rows)} record(s), {len(touched)} hour(s)')
        sgit(data, 'push')
    phase('save_and_push')
    marks = [(token, ids[i:i + 100]) for token, ids in done.items() for i in range(0, len(ids), 100)]
    list(pool.map(lambda m: post(c, 'mark-processed', {'inbox': m[0], 'file_ids': m[1]}), marks))   # only after the push
    phase('mark_processed')
    # T + S (public)
    sgit(pub, 'pull')
    dirty = set(lets.all_hours(data)) if o.all else touched
    got = lets.transform(data, pub, dirty, now_hour, roster(keys))
    phase('transform')
    lets.save_drains(data, pub, {'at': stamp, 'by': os.environ.get('OBS_BY', AGENT), 'records': len(rows), 'via': 'drain', 'secs': round(time.time() - t_start, 1),
                                 'phases': dict(T), 'lanes': {str(k): v for k, v in by_lane.items()}, 'lane_count': len(c['tokens'])})
    allrows = [r for d, h in lets.all_hours(data) for r in lets.hour_rows(data, d, h)]
    os.makedirs(os.path.join(pub, 'data'), exist_ok=True)
    with open(os.path.join(pub, 'data', 'public.json'), 'w') as f: json.dump(public(allrows, stamp), f, indent=1)
    r = subprocess.run(['sgit', 'commit', f'publish {stamp}'], cwd=pub, capture_output=True, text=True)
    if not any(w in (r.stdout + r.stderr).lower() for w in ('nothing', 'no changes')):
        p = subprocess.run(['sgit', 'push'], cwd=pub, capture_output=True, text=True)
        if p.returncode: print(f'obs_drain: push of the public vault failed (exit {p.returncode})'); odd.append('the public vault push failed')
    phase('publish')
    for line in oddities(data, pub, by_lane, odd): print('ODD: ' + line)
    print(banner.end(pub, len(rows), from_browser, bad, got, time.time() - t_start, by_lane, T))
    print(f"obs_drain: {stamp[11:16]} UTC, drained {len(rows)} ({bad} undecryptable) in {round(time.time() - t_start, 1)} s; " + (f'{len(odd)} odd: ' + '; '.join(odd) if odd else 'nothing odd'))

if __name__ == '__main__':
    main()
