#!/usr/bin/env python3
"""Tests for obs_lets.py's classification, votes and per-place stats (observability@PrompTugal.dinis, 18 November 2026).

    python3 -I newsroom/tools/obs/test_lets.py        prints OK or fails

Covers: a tab's view count is rebuilt from the rows every time (it used to grow at every drain until old tabs became crawlers);
cloud and data-centre towns are classed synthetic; anonymous votes are counted per page, place and class (web, ios, test), once
each; test hosts stay visible in sites.json; per-place stats count readers on promptugal.news only.
"""
import json, os, sys, tempfile
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import obs_lets as L

def ev(sid, path, ts, t='view', site='promptugal.news', **kw):
    return {'v': 1, 'type': t, 'sid': sid, 'path': path, 'ts': ts, 'site': site, 'tz': kw.pop('tz', 'Europe/Lisbon'), 'lang': 'pt-PT', 'screen': 'phone', **kw}

def write(vault, rows):
    for i, r in enumerate(rows): r['_file'] = f'f{i}'
    L.save_raw(vault, rows)

def main():
    with tempfile.TemporaryDirectory() as tmp:
        data, pub = os.path.join(tmp, 'data'), os.path.join(tmp, 'pub')
        rows = [ev('real1', '/algarve/', '2026-11-18T01:00Z', city='Lisbon'), ev('real1', '/algarve/faro/', '2026-11-18T01:01Z', city='Lisbon'),
                ev('real1', '/algarve/faro/', '2026-11-18T01:01Z', t='read', visible_s=30, scroll=80, city='Lisbon'),
                ev('dc1', '/algarve/', '2026-11-18T01:02Z', city='Boydton', tz='America/Los_Angeles', lang='en-US'),
                ev('t1', '/algarve/', '2026-11-18T01:03Z', site='localhost:8765', tz='UTC'),
                {'v': 1, 'type': 'vote', 'vote': 1, 'voted_on': '/algarve/faro/', 'site': 'promptugal.news', 'ts': '2026-11-18T01:10Z', 'sid': 'v1'},
                {'v': 1, 'type': 'vote', 'vote': 1, 'voted_on': '/algarve/faro/', 'site': 'promptugal.news', 'ts': '2026-11-18T01:10Z', 'sid': 'v1'},
                {'v': 1, 'type': 'vote', 'vote': -1, 'voted_on': '/algarve/faro/', 'site': 'ios.app.promptugal.news', 'ts': '2026-11-18T01:11Z'},
                {'v': 1, 'type': 'vote', 'vote': 1, 'voted_on': '/algarve/lagos/#https://example.org/s', 'site': 'ios.app.promptugal.news', 'ts': '2026-11-18T01:12Z'}]
        write(data, rows)
        for _ in range(60):                                     # many drains: the old code made 'real1' a crawler after about 40
            L.transform(data, pub, set(L.all_hours(data)), ('2026-11-18', '01'), [])
        g = {k: v['group'] for k, v in json.load(open(os.path.join(data, 'state', 'sessions.json'))).items()}
        assert g['real1'] == 'readers', ('a reader stayed a reader across 60 drains', g)
        assert g['dc1'] == 'synthetic', ('a data-centre town is synthetic', g)
        assert g['t1'] == 'synthetic', ('a test tab (UTC) is synthetic', g)
        vt = json.load(open(os.path.join(pub, 'latest', 'votes.json')))
        assert vt['totals']['web'] == {'up': 1, 'down': 0}, ('the duplicate vote counts once', vt['totals'])
        assert vt['totals']['ios'] == {'up': 1, 'down': 1}, vt['totals']
        assert vt['stories'][0]['story'] == 'https://example.org/s' and vt['stories'][0]['up'] == 1, vt['stories']
        st = {s['site']: s for s in json.load(open(os.path.join(pub, 'latest', 'sites.json')))['sites']}
        assert st['localhost:8765']['class'] == 'test' and st['promptugal.news']['class'] == 'web', st
        pl = json.load(open(os.path.join(pub, 'latest', 'places-stats.json')))['places']
        assert pl['faro']['views'] == 1 and pl['faro']['reads'] == 1 and pl['faro']['votes']['web']['up'] == 1 and pl['faro']['votes']['ios']['down'] == 1, pl['faro']
        assert pl['algarve']['views'] == 1, ('only the real reader counts', pl['algarve'])           # not the data-centre tab, not the test tab
        assert ['/algarve/', '/algarve/faro/', 1] in pl['faro']['flows'], pl['faro']['flows']
        assert os.path.exists(os.path.join(pub, 'latest', 'places', 'faro.json')) and os.path.exists(os.path.join(pub, 'latest', 'datacentre.json'))
        assert L.place_of('/algarve/costs/') == 'algarve' and L.place_of('/algarve/faro/costs/') == 'faro' and L.place_of('/portugal/x/') == 'portugal' and L.place_of('/events/') is None
    print('OK')

if __name__ == '__main__': main()
