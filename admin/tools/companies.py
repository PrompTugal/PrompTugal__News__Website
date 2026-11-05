#!/usr/bin/env python3
"""The newsroom's company data (build step 3): data/companies.json, from the team's company map.

    python3 -I admin/tools/companies.py <the team's data/companies.json> [--results recheck.json]

Keeps only the public fields of each company (name, website, what, category, country, attending,
attending_as, sources) and drops the team's own notes (why_it_matters, decision, priority, owner,
status, assets), which are not facts about the company (CLAUDE.md, Content). Then re-checks each
company at its source: the first websummit.com lis26 page in its sources, and its own website,
one request every 1.5 seconds, and records the HTTP status and when. --results reuses a check
already made (the JSON this script writes beside its output as .recheck.json is the same shape).
"""
import json, re, subprocess, sys, time, datetime, os

PUBLIC = ['id', 'name', 'website', 'what', 'category', 'country', 'attending', 'attending_as', 'sources']
UA = 'web-summit.newsroom.sgit.ai fact re-check (newsroom@web-summit.dinis)'


def get(url):
    try:
        r = subprocess.run(['curl', '-sL', '-m', '25', '-A', UA, '-o', '/dev/null', '-w', '%{http_code}', url], capture_output=True, timeout=40)
        return int(r.stdout.decode() or 0)
    except Exception:
        return 0


def recheck(c):
    ws = [s['url'] for s in c['sources'] if re.search(r'websummit\.com/(appearances|attendees|sessions)/lis26/', s['url'])]
    r = {'checked_at': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')}
    if ws:
        r['summit_page'] = {'url': ws[0], 'status': get(ws[0])}
        time.sleep(1.5)
    r['website'] = {'url': c['website'], 'status': get(c['website'])}
    return r


def main():
    src = sys.argv[1]
    team = json.load(open(src))
    results = json.load(open(sys.argv[sys.argv.index('--results') + 1])) if '--results' in sys.argv else {}
    out = []
    for c in team['companies']:
        r = results.get(c['id']) or recheck(c)
        for k in ('summit_page', 'website'):
            if k in r: r[k] = {'url': r[k]['url'], 'status': r[k]['status']}
        out.append({**{k: c[k] for k in PUBLIC}, 'recheck': r})
    doc = {
        'about': "Public facts about the companies the Web Summit 2026 team follows, for the newsroom's company pages. From the team's company map (SGit-AI/SGit-AI__Website__Web-Summit, data/companies.json), public fields only; the team's notes are left out. Each company carries the sources the team recorded, with the date read, and this newsroom's re-check of them.",
        'from': {'repository': 'SGit-AI/SGit-AI__Website__Web-Summit', 'path': 'data/companies.json', 'read_on': team.get('read_on')},
        'made_by': 'newsroom@web-summit.dinis, with admin/tools/companies.py',
        'companies': out,
    }
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    with open(os.path.join(root, 'data', 'companies.json'), 'w') as f:
        json.dump(doc, f, indent=1, ensure_ascii=False); f.write('\n')
    print(f'{len(out)} companies written to data/companies.json')


if __name__ == '__main__':
    main()
