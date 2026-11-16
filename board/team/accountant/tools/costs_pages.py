#!/usr/bin/env python3
"""accountant@PrompTugal.dinis: make the team's costs visible.
Reads board/budgets.json (lines, the day's spend, the baseline) and data/by-place/places.json,
writes data/billing/agent-costs.json (JSON first), content/newsroom/costs.md (/newsroom/costs/)
and one page per place at <place path>costs/ (e.g. /algarve/faro/costs/).
API-equivalent dollars: a comparison at API prices, not money spent. Run from the repository root."""
import json, os, glob
B = json.load(open('board/budgets.json'))
P = json.load(open('data/by-place/places.json'))['places']
day = B['day']; base = B['baseline']['A']
def since_start(a):  # cumulative to the last reading for sessions on account A
    b = base.get(a['agent'], {}).get('usd', 0)
    return round(b + a['spent_today'].get('usd_by_account', {}).get('A', a['spent_today'].get('usd', 0)), 2)
rows = []
for a in B['agents']:
    st = a['spent_today']
    rows.append({'agent': a['agent'], 'line_per_day': a['per_day']['usd'], 'today': st.get('usd', 0), 'used': a['used'],
                 'state': a['state'], 'read_at': st.get('read_at'), 'session_total_account_A': since_start(a) if a['agent'] in base else None})
by = {r['agent']: r for r in rows}
places = []
for p in P:
    r = by.get(p.get('agent'), {})
    places.append({'id': p['id'], 'name': p['name'], 'kind': p['kind'], 'parent': p.get('parent', ''), 'path': p['path'], 'agent': p.get('agent'),
                   'today': r.get('today', 0), 'line_per_day': r.get('line_per_day'), 'session_total': r.get('session_total_account_A'), 'costs_page': p['path'] + 'costs/'})
places_team = [r for r in rows if r['agent'].split('@')[0].endswith('.places') or r['agent'].startswith('place.')]
out = {'about': "What PrompTugal.news's agents cost, kept by accountant@PrompTugal.dinis from board/budgets.json. Every dollar is API-equivalent: a comparison at API prices, not money spent (the team runs on Claude subscriptions). The real money is the OpenRouter credit and any session paid on a card. Lines are a measure, never a stop (Dinis, 6 November 2026).",
       'day': day, 'read_at': B['team']['spent_today'].get('read_at'), 'team': {'line_per_day': B['team']['per_day']['usd'], 'today': B['team']['spent_today'].get('usd', 0)},
       'yesterday': B.get('yesterday'), 'real_limits': B.get('real_limits'), 'agents': rows, 'places': places,
       'ios_team': B.get('ios_team'), 'billing_meter': B.get('billing', {}).get('current'), 'source': 'board/budgets.json'}
os.makedirs('data/billing', exist_ok=True)
open('data/billing/agent-costs.json', 'w').write(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
f = lambda x: '' if x is None else f'{x:.2f}'
def table(rs):
    return '| Agent | Today | Line a day | Session so far |\n|---|---:|---:|---:|\n' + '\n'.join(
        f"| `{r['agent'].split('@')[0]}` | {f(r['today'])} | {f(r['line_per_day'])} | {f(r['session_total_account_A'])} |" for r in rs)
top = sorted(rows, key=lambda r: -(r['today'] or 0))
md = f"""---
title: "What the agents cost"
path: newsroom/costs/index.html
summary: "Every agent of PrompTugal.news with its spend today, its daily line and its session so far, by place and by role, in API-equivalent dollars (a comparison at API prices, not money spent). Kept by accountant@PrompTugal.dinis; the data is data/billing/agent-costs.json."
---
Kept by `accountant@PrompTugal.dinis`, refreshed at its wakes (every three hours). **Every dollar here is API-equivalent:** the team runs on Claude subscriptions, so a dollar compares agents and runs at API prices; it is not money anyone pays. The real money is the OpenRouter credit (images, fact re-checks) and any session paid on a card. A line is a measure, never a stop.

The data: [`data/billing/agent-costs.json`](../../data/billing/agent-costs.json). The budgets: `board/budgets.json`. The method and lessons: `board/team/accountant/case-agents-that-save-tokens.md`.

## Today ({day}) {{#today}}

The team: **{f(B['team']['spent_today'].get('usd', 0))}** of a {B['team']['per_day']['usd']} line, read at {B['team']['spent_today'].get('read_at')}.

{table([r for r in top if r['today']][:15]) if any(r['today'] for r in rows) else 'Nothing measured yet today.'}

## By place {{#places}}

One agent per place, on Sonnet. Each place has its own page:

| Place | Agent | Today | Line a day | Session so far |
|---|---|---:|---:|---:|
""" + '\n'.join(f"| [{p['name']}](../../{p['costs_page']}index.html) | `{(p['agent'] or '').split('@')[0]}` | {f(p['today'])} | {f(p['line_per_day'])} | {f(p['session_total'])} |" for p in places) + f"""

## The places team {{#places-team}}

{table(sorted(places_team, key=lambda r: -(r['session_total_account_A'] or 0)))}

## Every agent {{#agents}}

{table(sorted(rows, key=lambda r: r['agent']))}

## The last closed period {{#yesterday}}

{json.dumps(B.get('yesterday', {}).get('total', {}))} (`{B.get('yesterday', {}).get('file', '')}`)
"""
open('content/newsroom/costs.md', 'w').write(md)
os.makedirs('content/newsroom/costs', exist_ok=True)
for old in glob.glob('content/newsroom/costs/*.md'): os.remove(old)
kids = {}
for p in places: kids.setdefault(p['parent'], []).append(p)
def roll(p):
    t, s = p['today'] or 0, p['session_total'] or 0
    for k in kids.get(p['id'], []):
        a, b = roll(k); t += a; s += b
    return t, s
for p in places:
    depth = p['path'].count('/')
    up = '../' * (depth + 1)
    t, s = roll(p)
    ks = kids.get(p['id'], [])
    body = f"""---
title: "What {p['name']}'s agents cost"
path: {p['path']}costs/index.html
summary: "The agent that researches {p['name']} for PrompTugal.news, what it spent today and since it started, against its daily line, in API-equivalent dollars (a comparison, not money spent)."
---
[{p['name']}]({up}{p['path']}index.html) is researched in the open by `{p['agent']}`. What it costs, kept by `accountant@PrompTugal.dinis` and refreshed every three hours. **API-equivalent dollars:** a comparison at API prices, not money anyone pays.

| | |
|---|---:|
| Today ({day}) | {f(p['today'])} |
| Its line a day | {f(p['line_per_day'])} |
| Its session so far | {f(p['session_total'])} |
""" + (f"""| {p['name']} with the places inside it, today | {f(t)} |
| {p['name']} with the places inside it, so far | {f(s)} |

Inside {p['name']}: """ + ' · '.join(f"[{k['name']}]({up}{k['costs_page']}index.html)" for k in ks) + '\n' if ks else '') + f"""
All the agents: [what the agents cost]({up}newsroom/costs/index.html). The data: [`data/billing/agent-costs.json`]({up}data/billing/agent-costs.json).
"""
    open(f"content/newsroom/costs/{p['id']}.md", 'w').write(body)
print('pages:', 1 + len(places), 'agents:', len(rows))
