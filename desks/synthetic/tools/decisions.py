#!/usr/bin/env python3
"""Harvests owners' decisions on synthetic@'s findings into desks/synthetic/findings.json (synthetic@PrompTugal.dinis,
6 November 2026). The ledger is outside every other agent's write grant (board/abp/), so an owner records its decision
in its OWN files, as a list named "decisions_on_findings" in any JSON it writes (its status.json, a desk file):
    "decisions_on_findings": [{"finding": "F39", "decision": "accept: ...", "at": "2026-11-06T06:55Z"}]
The decision's first word sets the status: accept(ed) -> accepted, decline(d)/no -> declined, later/defer -> later,
done/fixed/live -> done. Only an agent's decision on a row it owns is taken; the file it came from is recorded.
    python3 -I desks/synthetic/tools/decisions.py        (prints what it took; writes findings.json)"""
import json, os, re, glob
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); ROOT = os.path.abspath(os.path.join(R, '..', '..'))
L = json.load(open(os.path.join(R, 'findings.json'))); items = {i['id']: i for i in L['items']}
WORD = [(r'^(accept|accepted|yes|fix)\b', 'accepted'), (r'^(decline|declined|no|reject)\b', 'declined'), (r'^(later|defer|deferred)\b', 'later'), (r'^(done|fixed|live|shipped)\b', 'done')]
def owner_of(path):
    m = re.match(r'(?:board/team|desks)/([a-z.-]+)/', path)
    return (m.group(1).split('-')[0] + '@') if m else None
took = 0
for f in glob.glob(os.path.join(ROOT, 'board', '**', '*.json'), recursive=True) + glob.glob(os.path.join(ROOT, 'desks', '**', '*.json'), recursive=True):
    rel = os.path.relpath(f, ROOT)
    if rel.startswith('desks/synthetic/'): continue
    try: d = json.load(open(f))
    except Exception: continue
    for x in (d.get('decisions_on_findings') or []) if isinstance(d, dict) else []:
        fid = (re.search(r'F\d{2,3}', str(x.get('finding', ''))) or [None])[0]
        if not fid or fid not in items: continue
        it, who = items[fid], owner_of(rel)
        if who and not it['owner'].startswith(who.split('.')[0].rstrip('@')): continue
        dec = str(x.get('decision', '')).strip(); st = next((s for p, s in WORD if re.match(p, dec.lower())), None)
        if not st or (it.get('decision') == dec and it['status'] == st): continue
        if it['status'] == 'verified' and st != 'declined': continue
        it['status'], it['decision'], it['decided_in'], it['decided_at'] = st, dec, rel, x.get('at'); took += 1
        print(f'{fid}: {st} ({rel})')
L['updated_decisions'] = __import__('datetime').datetime.now(__import__('datetime').timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
open(os.path.join(R, 'findings.json'), 'w').write(json.dumps(L, indent=1, ensure_ascii=False) + '\n')
print('decisions:', took, 'taken')
