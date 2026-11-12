#!/usr/bin/env python3
"""Regenerate board/team/dev.data/findings/2026-11-11-websummit-only-in-story-folders.json.

The build (newsroom/build/features/served.mjs) reads this file: `entirely_websummit` (folder ids whose every claim rests
on websummit.com: all their files are kept out of what the site serves) and `folders[id].sources_on_websummit` (source
ids to keep out of partly affected folders). Run it after any change to data/stories/<id>/sources or claims.
Usage: python3 -I board/team/dev.data/tools/ws_story_inventory.py   (from the repository root)
"""
import json, glob, os, collections, datetime
from urllib.parse import urlparse
OUT = 'board/team/dev.data/findings/2026-11-11-websummit-only-in-story-folders.json'
def ws(u):
    h = (urlparse(u).hostname or '').lower()
    return h in ('websummit.com', 'websummit.net') or h.endswith('.websummit.com') or h.endswith('.websummit.net')
out = {}; tot = collections.Counter()
for d in sorted(glob.glob('data/stories/*/')):
    sid = os.path.basename(d.rstrip('/'))
    sf = glob.glob(d + 'sources/*.json')
    if not sf or not os.path.exists(d + 'claims.json'): continue
    S = {}
    for f in sf:
        o = json.load(open(f)); S[o['id']] = o
    wsids = {i for i, o in S.items() if ws(o['url'])}
    C = json.load(open(d + 'claims.json'))['claims']
    wsc = [x['id'] for x in C if x['source'] in wsids]
    oth = [x['id'] for x in C if x['source'] not in wsids]
    out[sid] = {"sources_total": len(S), "sources_on_websummit": sorted(wsids), "claims_total": len(C),
                "claims_resting_only_on_websummit": wsc, "claims_with_another_source": oth}
    tot['folders'] += 1; tot['sources'] += len(S); tot['ws_sources'] += len(wsids); tot['claims'] += len(C); tot['ws_claims'] += len(wsc)
whole = [k for k, v in out.items() if v['claims_total'] and not v['claims_with_another_source']]
part = [k for k, v in out.items() if v['claims_resting_only_on_websummit'] and v['claims_with_another_source']]
prev = {}
try: prev = json.load(open(OUT))
except Exception: pass
inv = {"about": prev.get("about", ""), "rule": "board/guidance/2026-11-11-only-websummit-sourced-comes-off.md",
       "regenerated": datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
       "regenerated_by": "board/team/dev.data/tools/ws_story_inventory.py",
       "entirely_websummit": whole, "partly_websummit": part, "folders": out, "totals": dict(tot)}
json.dump(inv, open(OUT, 'w'), indent=1, ensure_ascii=False)
print('entirely:', whole, '| partly:', part, '|', dict(tot))
