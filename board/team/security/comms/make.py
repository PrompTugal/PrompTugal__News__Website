#!/usr/bin/env python3
"""The agents' messages, mapped (security@PrompTugal.dinis, 6 November 2026, at Dinis's word: "track it ... map the
architecture ... visualise it ... on my dashboard").

    python3 -I board/team/security/comms/make.py <ledger.json from the collector>

Reads the collector's ledger (made in security@'s session from every session's transcript with list_events: one row
per act, metadata only) and writes, beside this file:
    comms.json   the public ledger: time to the minute, channel, sender, receiver, size in characters, whether it
                 claims to carry Dinis's words; never the text, never a session id or a hash
    map.svg      the picture: who creates, schedules and messages whom
Prints the counts. No dependencies."""
import json, sys, os, collections, math, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
src = json.load(open(sys.argv[1]))
CH = {'send_message': 'message', 'create_session': 'creates a session', 'create_trigger': 'writes a schedule',
      'update_trigger': 'rewrites a schedule', 'delete_trigger': 'deletes a schedule', 'scheduled_wake': 'scheduled wake',
      'inbox_send': 'inbox message (signed)', 'lane_append': 'lane append (own script)'}
def who(x):
    x = x.replace('@PT', '@PrompTugal')
    return x
rows = []
for a in src:
    to = a['to_name']
    if to.startswith('$') or to.startswith('<'): to = 'several agents (a loop)'
    if a['act'] == 'lane_append': to = 'an append lane'
    if a['act'] == 'create_session': to = who((a.get('title') or 'a new session').replace('.dinis', '').replace('PrompTugal', 'PrompTugal'))
    if a['act'] in ('create_trigger',) and to in ('this-session',): to = a['from_name']
    if a['act'] in ('update_trigger', 'delete_trigger'):
        to = 'a schedule'
    if a['act'] == 'scheduled_wake':
        rows.append({'at': a['ts'][:16] + 'Z', 'channel': CH[a['act']], 'from': 'the scheduler', 'to': who(a['to_name']), 'chars': None, 'claims_dinis': None}); continue
    if to.endswith('.dinis'): to = to[:-6]
    rows.append({'at': a['ts'][:16] + 'Z', 'channel': CH[a['act']], 'from': who(a['from_name']), 'to': who(to),
                 'chars': a.get('chars'), 'claims_dinis': bool(a.get('claims_dinis')), 'seen_by': a.get('seen')})
rows.sort(key=lambda r: r['at'])
C = collections.Counter
by_channel = C(r['channel'] for r in rows)
edges = C((r['from'], r['to'], r['channel']) for r in rows if r['channel'] != 'scheduled wake')
chars = collections.defaultdict(int)
for r in rows:
    if r['chars']: chars[r['from']] += r['chars']
summary = {
    'about': "Every act by which one agent tells another what to do or what happened, outside git and the board, from the session transcripts (list_events), 5 November 00:00 to 6 November 16:10 UTC. Metadata only: never the text. Made by security@PrompTugal.dinis (board/team/security/comms/make.py).",
    'made': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
    'coverage': "Round 2 (6 November 04:30 to 16:10, 29 sessions, read at 16:10): not read for conductor@ 04:30 to 05:16, designer@ 04:30 to 04:47, correspondent@ 04:30 to 04:42, librarian@ 04:30 to 13:16, security@ 04:30 to 08:05. Round 1: both conductors, dev, designer, journalist, ontologist, historian, devops, accountant, sherpa, librarian, correspondent, observability@web-summit. Read in part: outreach (from 01:40 on 6 November), crm@web-summit (from 17:50 on 5 November), newsroom@web-summit (from 03:00 on 5 November). Not read yet: synthetic, observability@PrompTugal, security (its one message is counted from the sender). Not countable from transcripts: the append-lane inboxes (sealed; counted from receipts once they exist).",
    'totals': dict(by_channel),
    'claims_dinis': sum(1 for r in rows if r.get('claims_dinis')),
    'chars_by_sender': dict(sorted(chars.items(), key=lambda x: -x[1])),
    'edges': [{'from': f, 'to': t, 'channel': c, 'n': n} for (f, t, c), n in edges.most_common()],
    'rows': rows}
json.dump(summary, open(os.path.join(HERE, 'comms.json'), 'w'), indent=1, ensure_ascii=False)

# ---- the picture -------------------------------------------------------------------------------------------
W, H = 1400, 1180
cx, cy = 720, 540
PT = ['dev', 'designer', 'journalist', 'ontologist', 'outreach', 'synthetic', 'observability', 'historian', 'correspondent',
      'devops', 'accountant', 'security', 'sherpa', 'librarian', 'abp', 'customers']
OUT = ['dev.search', 'dev.pages', 'dev.graphs', 'dev.portugal', 'dev.data', 'dev.verify', 'designer.experiments', 'researcher', 'backup']
pos = {'conductor@PrompTugal': (cx, cy)}
for i, r in enumerate(PT):
    ang = -math.pi / 2 + 2 * math.pi * i / len(PT)
    pos[r + '@PrompTugal'] = (cx + 330 * math.cos(ang), cy + 270 * math.sin(ang))
for i, r in enumerate(OUT):
    ang = -math.pi / 2 + math.pi / 9 + 2 * math.pi * i / len(OUT)
    pos[r + '@PrompTugal'] = (cx + 560 * math.cos(ang), cy + 440 * math.sin(ang))
pos.update({'conductor.3@web-summit': (95, 120), 'newsroom@web-summit': (95, 330), 'observability@web-summit': (95, 450),
            'crm@web-summit': (95, 690), 'designer@web-summit': (95, 810), 'journalist@web-summit': (95, 930),
            'Dinis Cruz': (1300, 80), 'several agents (a loop)': (1300, 960)})
COL = {'message': '#2563eb', 'creates a session': '#b91c1c', 'writes a schedule': '#b45309', 'rewrites a schedule': '#b45309',
       'deletes a schedule': '#b45309', 'inbox message (signed)': '#15803d'}
def nm(x):
    return x.replace('@PrompTugal', '').replace('@web-summit', '@ws')
out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="system-ui,-apple-system,Segoe UI,sans-serif">',
       '<title>How PrompTugal\'s agents talk to each other, 5 to 6 November 2026</title>',
       f'<rect width="{W}" height="{H}" fill="#fbfaf7"/>', f'<rect y="{H - 110}" width="{W}" height="110" fill="#f1efe8"/>',
       '<defs>' + ''.join(f'<marker id="m{i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="{c}"/></marker>' for i, c in enumerate(dict.fromkeys(COL.values()))) + '</defs>']
mk = {c: f'm{i}' for i, c in enumerate(dict.fromkeys(COL.values()))}
agg = C()
for (f, t, c), n in edges.items():
    if c.startswith('lane append'): continue
    k = 'schedule' if 'schedule' in c else c
    agg[(f, t, k)] += n
for (f, t, k), n in sorted(agg.items(), key=lambda x: x[1]):
    if f == t or f not in pos or t not in pos: continue
    (x1, y1), (x2, y2) = pos[f], pos[t]
    col = COL.get(k, COL['writes a schedule'])
    off = {'message': 0, 'creates a session': 14, 'schedule': -14, 'inbox message (signed)': 7}[k]
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy) or 1
    ox, oy = -dy / L * off, dx / L * off
    sx, sy, ex, ey = x1 + dx / L * 40 + ox, y1 + dy / L * 26 + oy, x2 - dx / L * 44 + ox, y2 - dy / L * 28 + oy
    out.append(f'<line x1="{sx:.0f}" y1="{sy:.0f}" x2="{ex:.0f}" y2="{ey:.0f}" stroke="{col}" stroke-opacity="0.75" stroke-width="{min(9, 1.2 + 0.7 * n):.1f}" marker-end="url(#{mk[col]})"/>')
# Dinis: the only person; his words reach agents through the conductor's session (spoken), never signed
out.append(f'<line x1="1270" y1="102" x2="{cx + 70}" y2="{cy - 22}" stroke="#6b7280" stroke-dasharray="6 5" stroke-width="2" marker-end="url(#m0)"/>')
out.append('<text x="1050" y="140" font-size="12" fill="#4b5563">his words, spoken in the agents\' sessions,</text><text x="1050" y="155" font-size="12" fill="#4b5563">relayed as "at Dinis\'s word": unsigned</text>')
deg = C()
for (f, t, k), n in agg.items(): deg[f] += n; deg[t] += n
for name, (x, y) in pos.items():
    big = name.startswith('conductor')
    fill = '#111827' if name == 'Dinis Cruz' else '#7c2d12' if big else '#ffffff'
    tc = '#ffffff' if (big or name == 'Dinis Cruz') else '#111827'
    w = 150 if big or name == 'Dinis Cruz' else 118
    stroke = '#9ca3af' if '@web-summit' in name else '#111827'
    out.append(f'<rect x="{x - w / 2:.0f}" y="{y - 20:.0f}" width="{w}" height="40" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="1.5"{' stroke-dasharray="4 3"' if "@web-summit" in name else ""}/>')
    out.append(f'<text x="{x:.0f}" y="{y - 2:.0f}" text-anchor="middle" font-size="13" font-weight="600" fill="{tc}">{nm(name)}</text>')
    if name != 'Dinis Cruz':
        out.append(f'<text x="{x:.0f}" y="{y + 13:.0f}" text-anchor="middle" font-size="10.5" fill="{tc}" opacity="0.8">{deg[name]} acts</text>')
out.append('<text x="24" y="40" font-size="20" font-weight="700" fill="#111827">Who tells whom what to do, outside git</text>')
out.append('<text x="24" y="62" font-size="12.5" fill="#4b5563">5 Nov 00:00 to 6 Nov 16:10 UTC, from the session transcripts; line width = number of acts; dashed boxes: the team site\'s agents; outer ring: the dotted workers</text>')
ly = 1110
for i, (lab, col) in enumerate([('sends a session message (send_message)', COL['message']), ('sends a signed inbox message', COL['inbox message (signed)']), ('creates a session (writes its first prompt)', COL['creates a session']), ('writes or rewrites a schedule (its standing prompt)', COL['writes a schedule'])]):
    x = 560 + i * 0
    out.append(f'<line x1="{40 + (i % 2) * 380}" y1="{ly - 30 + (i // 2) * 18}" x2="{70 + (i % 2) * 380}" y2="{ly - 30 + (i // 2) * 18}" stroke="{col}" stroke-width="3"/><text x="{78 + (i % 2) * 380}" y="{ly - 26 + (i // 2) * 18}" font-size="12" fill="#111827">{lab}</text>')
t = summary['totals']
out.append(f'<text x="40" y="{ly + 22}" font-size="12" fill="#111827">{t.get("message", 0)} session messages · {t.get("inbox message (signed)", 0)} signed inbox messages · {t.get("lane append (own script)", 0)} lane writes by hand · {t.get("creates a session", 0)} sessions created · {t.get("writes a schedule", 0) + t.get("rewrites a schedule", 0) + t.get("deletes a schedule", 0)} schedule writes · {t.get("scheduled wake", 0)} wakes</text>')
out.append(f'<text x="40" y="{ly + 40}" font-size="12" font-weight="600" fill="#b91c1c">{summary["claims_dinis"]} say they carry Dinis\'s word, unsigned by him; the inbox messages are signed by their sender</text>')
out.append('</svg>')
open(os.path.join(HERE, 'map.svg'), 'w').write('\n'.join(out) + '\n')
print(json.dumps({'totals': t, 'claims_dinis': summary['claims_dinis'], 'edges': len(summary['edges'])}))
