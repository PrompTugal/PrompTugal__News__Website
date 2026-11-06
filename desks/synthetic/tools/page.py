#!/usr/bin/env python3
"""Writes content/newsroom/synthetic.md from desks/synthetic/ (findings.json, page.json, the runs). synthetic@PrompTugal.dinis.
Order (sherpa@'s review, pass 2026-11-06-the-synthetic-readers-page): the scoreboard, every fix with its decision, the latest
run, one line per earlier run, how this was made. Lists, not tables, so the page never pans on a phone. No em-dashes.
    python3 -I desks/synthetic/tools/page.py"""
import json, os, re, collections
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ROOT = os.path.abspath(os.path.join(R, '..', '..'))
L = json.load(open(os.path.join(R, 'findings.json')))
P = json.load(open(os.path.join(R, 'page.json')))
clean = lambda s: re.sub(r'\s*[—–]\s*', ', ', str(s or '')).replace('|', '/').strip()
first = lambda s: clean(re.split(r'(?<=[.!?])\s', clean(s), maxsplit=1)[0])
items = L['items']; by = collections.Counter(i['status'] for i in items)
OPEN = ('open', 'accepted', 'later', 'reopened')
waiting = collections.Counter(i['owner'] for i in items if i['status'] in OPEN)
SEV = {'blocking': 0, 'costly': 1, 'minor': 2}
GH = 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/'
o = ['---', 'title: "Synthetic readers"', f'summary: "{clean(P["summary"])}"', 'path: newsroom/synthetic.html', '---',
     '**Everybody on this page is invented (SYNTHETIC).** The readers, their names and every word attributed to them were written by a language model looking at screenshots of this site. This is not user research: no sentence here is evidence about a real person.', '',
     '## The scoreboard', '', '::: navigator n3', '::: nv', '### The fixes', '',
     f'{len(items)} fixes sent to their owners since run 1:', '', '{.rows}']
for k in ('open', 'accepted', 'later', 'declined', 'done', 'verified', 'reopened'):
    if by.get(k): o.append(f'- **{by[k]}** {k}: {L["statuses"][k]}')
o += ['', 'Waiting, by owner: ' + ', '.join(f'{a} {n}' for a, n in waiting.most_common()) + '.', ':::', '::: nv', '### Fix first', '', '{.rows}']
for fid in P['top']:
    i = next(x for x in items if x['id'] == fid); o.append(f'- **{fid}** ({i["owner"]}): {first(i["finding"])}')
o += [':::', '::: nv', '### Questions for Dinis', '', 'Asked, not answered here:', '', '{.rows}']
o += [f'- {clean(q)}' for q in P['questions']]
o += [':::', ':::', '', f'**Latest:** {clean(P["latest_line"])} ([the run](#latest))', '',
      '## Every fix and its decision', '',
      'Each owner sets its decision at its next wake (accepted, declined with why, later, done) in [findings.json](' + GH + 'findings.json); synthetic@ re-measures what is done and marks it verified. "No decision yet" means nobody has said.', '']
for a in sorted({i['owner'] for i in items}, key=lambda a: (-waiting.get(a, 0), a)):
    rows = sorted([i for i in items if i['owner'] == a], key=lambda i: (i['status'] in ('done', 'verified', 'declined'), SEV.get(i['severity'], 3), i['id']))
    o += [f'### {a} ({waiting.get(a, 0)} waiting)', '', '{.rows}']
    for i in rows:
        d = clean(i.get('decision')) or ('measured live: ' + clean(i['evidence']) if i['status'] == 'verified' and i.get('evidence') else 'no decision yet')
        o.append(f'- **{i["id"]}** {i["severity"]}, **{i["status"]}** (run {i["run"]}): {first(i["finding"])} *Decision: {d}.*')
    o.append('')
o += [f'## {P.get("latest_title", "Latest")} {{#latest}}', '', clean(P['latest_intro']), '', '{.rows}']
o += [f'- **{clean(p["who"])}** ({clean(p["knows"])}; {clean(p["device"])}): {"ranked" if "run 6 " in P["latest_line"] else "read"} *{clean(p["story"])}*. {clean(p["line"])}' for p in P['latest_readers']]
o += ['', clean(P['latest_signed']), '', '**What held, for all four:** ' + clean(P['latest_held']), '', '**What lost them:** ' + clean(P['latest_lost']), '',
      '## Earlier runs', '', '{.rows}']
o += [f'- **Run {r["run"]}** ({clean(r["when"])}, {clean(r["who"])}): {clean(r["line"])} [The runs]({GH}run-{r["run"]}/runs/).' for r in P['earlier']]
o += ['', '## How this was made', '']
o += [clean(x) + '\n' for x in P['method']]
o += ['## Not done yet', '', '{.rows}'] + [f'- {clean(x)}' for x in P['not_done']] + ['']
open(os.path.join(ROOT, 'content', 'newsroom', 'synthetic.md'), 'w').write('\n'.join(o))
print('page: content/newsroom/synthetic.md,', len('\n'.join(o).split()), 'words')
