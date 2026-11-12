#!/usr/bin/env python3
"""Split data/stories/<id>/ into a public folder and a sibling <id>-websummit folder.

The build keeps a story's claims.json out of what the site serves while it holds any claim resting only on websummit.com
(newsroom/build/features/served.mjs; dev@, 12 November 01:30). To keep the claims that have other sources public, the
websummit-only sources, claims, timeline events and entity sources move to <id>-websummit, which is then wholly websummit
and kept out whole. Claim ids stay the same in both folders. Run ws_story_inventory.py afterwards.
Usage: python3 -I board/team/dev.data/tools/ws_split_story.py S41   (from the repository root)
"""
import json, glob, os, sys, shutil
from urllib.parse import urlparse
def ws(u):
    h = (urlparse(u).hostname or '').lower()
    return h in ('websummit.com', 'websummit.net') or h.endswith('.websummit.com') or h.endswith('.websummit.net')
sid = sys.argv[1]; src = f'data/stories/{sid}/'; dst = f'data/stories/{sid}-websummit/'
assert not os.path.exists(dst), dst + ' exists'
for f in os.listdir(src): assert f in ('claims.json', 'entities.json', 'sources', 'story.json', 'timeline.json', 'graph.json', 'blocks.json'), 'unsupported file ' + f
S = {}
for f in glob.glob(src + 'sources/*.json'):
    o = json.load(open(f)); S[o['id']] = (f, o)
wsids = {i for i, (f, o) in S.items() if ws(o['url'])}
cl = json.load(open(src + 'claims.json')); C = cl['claims']
wsc = [x for x in C if x['source'] in wsids]; pub = [x for x in C if x['source'] not in wsids]
wscids = {x['id'] for x in wsc}; pubids = {x['id'] for x in pub}
ent = json.load(open(src + 'entities.json')); E = ent['entities']
tl = json.load(open(src + 'timeline.json')); T = tl['events']
os.makedirs(dst + 'sources')
for i in wsids:
    p = dst + 'sources/' + os.path.basename(S[i][0]); shutil.move(S[i][0], p); o = json.load(open(p)); o['story'] = sid + '-websummit'; json.dump(o, open(p, 'w'), indent=2, ensure_ascii=False)
def hdr(d, new): d = dict(d); d['story'] = new; return d
# claims
json.dump({**hdr(cl, sid + '-websummit'), 'claims': wsc}, open(dst + 'claims.json', 'w'), indent=2, ensure_ascii=False)
json.dump({**cl, 'claims': pub}, open(src + 'claims.json', 'w'), indent=2, ensure_ascii=False)
# timeline
tws = []; tpub = []
def srcs(ev): return ev['source'] if isinstance(ev['source'], list) else [ev['source']]
def keep(ev, ok_src, ok_cl):
    ev = dict(ev); l = [x for x in srcs(ev) if x in ok_src]
    cl = ev['claim'] if isinstance(ev['claim'], list) else [ev['claim']]; cl = [c for c in cl if c in ok_cl]
    if not l or not cl: return None
    ev['claim'] = cl if isinstance(ev['claim'], list) else cl[0]
    ev['source'] = l if isinstance(ev['source'], list) else l[0]; return ev
for ev in T:
    a = keep(ev, wsids, wscids); b = keep(ev, set(S) - wsids, pubids)
    if a: tws.append(a)
    if b: tpub.append(b)
json.dump({**hdr(tl, sid + '-websummit'), 'events': tws}, open(dst + 'timeline.json', 'w'), indent=2, ensure_ascii=False)
json.dump({**tl, 'events': tpub}, open(src + 'timeline.json', 'w'), indent=2, ensure_ascii=False)
# entities: a ref stays where a claim of that folder is about it
def build(claims, ids_ok):
    need = {r for x in claims for r in x.get('about', [])}
    out = []
    for e in E:
        s = [x for x in e['sources'] if x in ids_ok]
        if e['ref'] in need or s:
            e2 = dict(e); e2['sources'] = s or sorted({x['source'] for x in claims if e['ref'] in x.get('about', [])}); out.append(e2)
    return out
pubsrc = set(S) - wsids
json.dump({**hdr(ent, sid + '-websummit'), 'entities': build(wsc, wsids)}, open(dst + 'entities.json', 'w'), indent=2, ensure_ascii=False)
json.dump({**ent, 'entities': build(pub, pubsrc)}, open(src + 'entities.json', 'w'), indent=2, ensure_ascii=False)
print(sid, 'public claims', len(pub), '| websummit claims', len(wsc), '| public events', len(tpub), '| websummit events', len(tws))
