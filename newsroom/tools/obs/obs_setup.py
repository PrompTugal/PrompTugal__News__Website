#!/usr/bin/env python3
"""Make PrompTugal.news's observability vaults (observability@PrompTugal.dinis, 6 November 2026, at Dinis Cruz's word:
"replicate what we have on web-summit.sgit.ai"). The same model as the team site's (its admin/tools/obs_drain.py,
obs_lets.py and lane_for.py; the observability pack), with its own vaults:

    SG_SEND_ACCESS_TOKEN=... python3 -I newsroom/tools/obs/obs_setup.py [--team <a clone of the team's site>]

1. the PRIVATE data vault (promptugal-obs-data): a README, the drain key (identity/private/, an RSA-4096 pair made
   here; only its public half leaves the vault), identity/lanes.json (which lane is which, by the SHA-256 of its
   token); then append lanes configured on it: 'site' (four, written by assets/obs/obs.js on every page) and
   'agents' (two, written by newsroom/tools/agent-log.mjs), and the enum key that lists them;
2. the PUBLIC vault (promptugal-obs-public): a README; the drain writes the transformed files into it, and its read
   key is published, so anyone can read it (Dinis: "for now all data is also public");
3. writes the public half to this repository: assets/obs/obs.json (the endpoint, the vault id, the lanes' append
   tokens and the drain's public key: public on purpose, a token can only write to its lane and the key can only
   encrypt) and data/newsroom/observability/vaults.json (the public vault's id and read key);
4. keeps the credentials (both vault keys, the enum key, the tokens) in ~/.sg-send/obs-promptugal/creds.json (0600),
   outside the repository, and seals them to Dinis's site key (ws-ecies-1, the team site's
   admin/tools/person-key.mjs) into newsroom/observability/sealed/dinis.json, so they outlive this session.
Run once. Prints no credential.
"""
import argparse, datetime, hashlib, json, os, secrets, shutil, subprocess, sys, tempfile, urllib.request

sys.dont_write_bytecode = True
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
HOST = 'https://dev.send.sgraph.ai'
AGENT = 'observability@PrompTugal.dinis'
CREDS = os.path.expanduser('~/.sg-send/obs-promptugal/creds.json')
VAULTS = os.path.expanduser('~/vaults')
h = lambda s: hashlib.sha256(s.encode()).hexdigest()

def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method='POST', headers={'Content-Type': 'application/json', **headers})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read() or b'{}')

def sgit(cwd, *a):
    r = subprocess.run(['sgit', *a], cwd=cwd, capture_output=True, text=True)
    if r.returncode: sys.exit(f'obs_setup: sgit {a[0]} failed (exit {r.returncode}): ' + (r.stderr or r.stdout).strip().splitlines()[-1][:200])
    return r.stdout

def wjson(p, obj, mode=None):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f: f.write(json.dumps(obj, indent=2, ensure_ascii=False) + '\n')
    if mode: os.chmod(p, mode)

def create(name, readme, token):
    os.makedirs(VAULTS, exist_ok=True)
    d = os.path.join(VAULTS, name)
    if os.path.exists(d): sys.exit(f'obs_setup: {d} exists; this runs once')
    sgit(VAULTS, 'create', name, '--base-url', HOST, '--token', token, '--no-push')
    open(os.path.join(d, 'README.md'), 'w').write(readme)
    return d

def push(d, msg):
    sgit(d, 'commit', msg); sgit(d, 'push')
    vk = open(os.path.join(d, '.sg_vault', 'local', 'vault_key')).read().strip()
    return vk, vk.split(':')[-1]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--team', required=True, help="a clone of SGit-AI/SGit-AI__Website__Web-Summit (for Dinis's site key)")
    o = ap.parse_args()
    if os.path.exists(CREDS): sys.exit(f'obs_setup: {CREDS} exists; the vaults are made already')
    token = os.environ['SG_SEND_ACCESS_TOKEN']
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from sgit_ai.crypto.Vault__Crypto import Vault__Crypto
    pki, today = PKI__Crypto(), datetime.datetime.now(datetime.timezone.utc).strftime('%-d %B %Y')

    # 1. the private data vault, with the drain key inside it
    data = create('promptugal-obs-data', f'# PrompTugal.news observability: the data vault (private)\n\nMade by {AGENT} on {today}, at Dinis Cruz\'s word, with newsroom/tools/obs/obs_setup.py in PrompTugal/PrompTugal__News__Website. Page views and reads from promptugal.news (assets/obs/obs.js) and the PrompTugal agents\' run records (newsroom/tools/agent-log.mjs) arrive sealed to the drain key (identity/) on this vault\'s append lanes; the drain (newsroom/tools/obs/obs_drain.py) opens them, keeps them here by the hour (events/<day>/<hh>/events.jsonl) and publishes counts to the public vault. Private: its read key would give out the lanes\' enum key and the drain key.\n', token)
    priv, pub = pki.generate_encryption_key_pair()
    pub_pem, priv_pem = pki.export_public_key_pem(pub), pki.export_private_key_pem(priv)
    fp = pki.compute_fingerprint(pub)
    os.makedirs(os.path.join(data, 'identity', 'private'), exist_ok=True)
    open(os.path.join(data, 'identity', 'private', 'private_key.pem'), 'w').write(priv_pem)
    wjson(os.path.join(data, 'identity', 'public-bundle.json'), {'encrypt': pub_pem, 'fingerprint': fp, 'label': 'PrompTugal.news observability drain'})
    names = ['site 1', 'site 2', 'site 3', 'site 4', 'agents 1', 'agents 2']
    toks = [secrets.token_hex(32) for _ in names]
    wjson(os.path.join(data, 'identity', 'lanes.json'), {'about': 'The append lanes, in order, by the SHA-256 of each token (the anchor the server holds).',
                                                         'lanes': [{'name': n, 'anchor': h(t)} for n, t in zip(names, toks)]})
    data_vk, data_id = push(data, 'the data vault: README, the drain key, the lanes')
    enum_key = secrets.token_hex(32)
    write_key = Vault__Crypto().derive_keys_from_vault_key(data_vk)['write_key']
    r = post(f'{HOST}/api/vault/append/configure/{data_id}', {'append_anchors': [h(t) for t in toks], 'enum_key_hash': h(enum_key)},
             {'x-sgraph-vault-write-key': write_key, 'x-sgraph-access-token': token})
    if r.get('status') != 'configured': sys.exit(f'obs_setup: configure answered {r.get("status")}')

    # 2. the public vault
    pubv = create('promptugal-obs-public', f'# Who reads promptugal.news, and what its agents do (public)\n\nMade by {AGENT} on {today}, at Dinis Cruz\'s word ("for now all data is also public"). Written by the drain (newsroom/tools/obs/obs_drain.py in PrompTugal/PrompTugal__News__Website): latest/*.json (the current totals, pages, agents, runs), <day>/day.json and <day>/<hh>/hour.json (the history), data/public.json (one file with everything). Counts only for anonymous readers: no IP, no cookie, no tab id, no time zone or language in any file. Read by https://promptugal.news/newsroom/observability/ in the browser, from this vault\'s published read key.\n', token)
    pub_vk, pub_id = push(pubv, 'the public vault: README')
    read_key = Vault__Crypto().derive_keys_from_vault_key(pub_vk)['read_key']
    read_key = read_key if isinstance(read_key, str) else read_key.hex()

    # 3. the public half, in this repository
    wjson(os.path.join(ROOT, 'assets', 'obs', 'obs.json'), {
        'about': f'PrompTugal.news\'s observability lanes ({AGENT}, {today}, at Dinis Cruz\'s word; the team site\'s model, assets/obs-dinis.json). Public on purpose: each append token can only write to its lane, and the key can only encrypt. \'site\' is used by assets/obs/obs.js on every page; \'agents\' by newsroom/tools/agent-log.mjs, which every PrompTugal agent runs at the end of each run. The data vault is private; its drain is {AGENT}\'s.',
        'enabled': True, 'endpoint': HOST, 'vault_id': data_id,
        'lanes': {'site': toks[:4], 'agents': toks[4:]},
        'recipient': {'fingerprint': fp, 'encrypt': pub_pem}})
    wjson(os.path.join(ROOT, 'data', 'newsroom', 'observability', 'vaults.json'), {
        'about': 'The observability vaults the control centre reads in the browser (/newsroom/observability/). Only published read keys (sgit_public_read_ + 64 hex), never a vault key: a read key can only read, and these vaults hold counts and agents\' runs, public at Dinis Cruz\'s word (6 November 2026).',
        'vaults': [
            {'id': 'promptugal', 'name': 'Who reads promptugal.news: the published data', 'site': 'promptugal.news', 'vault_id': pub_id, 'read_key': 'sgit_public_read_' + read_key,
             'by': AGENT, 'made': datetime.date.today().isoformat(), 'private_data_vault': data_id, 'drain': 'newsroom/tools/obs/obs_drain.py'},
        ]})

    # 4. the credentials: outside the repository, and sealed to Dinis so they outlive this session
    creds = {'host': HOST, 'vault_id': data_id, 'vault_key': data_vk, 'enum_key': enum_key, 'tokens': toks, 'lane_names': names,
             'public_vault_id': pub_id, 'public_vault_key': pub_vk, 'data_dir': data, 'public_dir': pubv, 'made': today, 'by': AGENT}
    wjson(CREDS, creds, 0o600)
    tmp = tempfile.mkdtemp(dir=os.path.dirname(CREDS)); os.chmod(tmp, 0o700)
    try:
        src = os.path.join(tmp, 'plain.json'); wjson(src, {'type': 'promptugal.obs/creds', **{k: v for k, v in creds.items() if not k.endswith('_dir')}}, 0o600)
        out = os.path.join(ROOT, 'newsroom', 'observability', 'sealed', 'dinis.json'); os.makedirs(os.path.dirname(out), exist_ok=True)
        r = subprocess.run(['node', os.path.join(o.team, 'admin/tools/person-key.mjs'), 'seal', '--person', 'dinis', '--in', src, '--out', out, '--by', AGENT], capture_output=True, text=True)
        if r.returncode: print('obs_setup: sealing to dinis failed: ' + r.stderr.strip()[:200])
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f'obs_setup: data vault {data_id} (private, 6 lanes configured), public vault {pub_id} (read key published); drain key {fp}; '
          f'assets/obs/obs.json and data/newsroom/observability/vaults.json written; credentials in {CREDS} and sealed to dinis')

if __name__ == '__main__': main()
