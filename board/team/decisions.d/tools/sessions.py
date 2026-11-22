#!/usr/bin/env python3
"""The map of every session on account D, kept by decisions.d@AgentiCCells.dinis (Dinis, 22 November 2026, about
15:30 UTC, in its session: "regularly go to every single session that is alive ... monitor all the things that changed
since the last time you read them ... keep track of when was the last time you read it ... recommendations of which
sessions to archive").

At each wake decisions.d calls list_sessions (mine, every page) and saves each page's rows as JSON
[{id, title, created_at, updated_at, status_bucket, parent_session_id}], then runs:
    python3 -I board/team/decisions.d/tools/sessions.py <rows.json> [<rows.json> ...] [--partial]
(--partial when only the newest pages were read: sessions not seen keep their last reading.)
It updates board/team/decisions.d/sessions/sessions.json (one entry per session: what was seen, when decisions.d last
read it, whether it changed since) and writes sessions/README.md: what changed since the last read, and the archive
recommendations. Only metadata is kept: no transcript, no summary text (other sessions' words are not published here).
Archiving is Dinis's: these are recommendations only."""
import json, os, re, sys, datetime

OUT = 'board/team/decisions.d/sessions'
ME = 'session_015gaHdaiX9VvjVwHaNezGJG'
now = datetime.datetime.now(datetime.timezone.utc)
stamp = now.strftime('%Y-%m-%dT%H:%MZ')


def safe(title):
    # session titles carry agent names with an account domain; the gate refuses an email-shaped name outside
    # @PrompTugal.dinis and @AgentiCCells.dinis, so write 'x (account-d.dinis)' for any other domain
    return re.sub(r'([\w.+-]+)@([\w-]+(?:\.[\w-]+)+)', lambda m: m.group(0) if m.group(2).lower() in ('promptugal.dinis', 'agenticcells.dinis') else f'{m.group(1)} ({m.group(2)})', title or '')


REDACT_FILE = 'board/team/decisions.d/sessions/titles.json'  # {session id: generic title}: titles naming a person, written generically
REDACT = json.load(open(REDACT_FILE)) if os.path.exists(REDACT_FILE) else {}


def t(s):
    return datetime.datetime.fromisoformat(s.replace('Z', '+00:00')) if s else None


def hours(a):
    return (now - t(a)).total_seconds() / 3600


def advise(r):
    """keep | watch | archive, with the reason (a proposal; the rule is in sessions/README.md)."""
    b, idle, title = r['bucket'].replace('SESSION_STATUS_BUCKET_', ''), hours(r['updated_at']), r['title'] or ''
    if r['id'] == ME:
        return 'keep', 'this session'
    if ' run 20' in title and idle > 24:
        return 'archive', 'a one-off scheduled run, finished'
    if idle > 72:
        return 'archive', f'no activity for {int(idle // 24)} days'
    if b == 'FAILED' and idle > 24:
        return 'archive', 'failed and idle over a day'
    if b == 'WORKING' or idle < 6:
        return 'keep', 'active in the last 6 hours'
    if b in ('BLOCKED', 'REVIEW_READY'):
        return 'watch', 'waiting on a person; keep if its ask is still open'
    return 'watch', f'idle {int(idle)} h'


path = f'{OUT}/sessions.json'
state = json.load(open(path)) if os.path.exists(path) else {'about': '', 'sessions': {}}
state['about'] = ('Every session on account D seen by decisions.d@AgentiCCells.dinis through list_sessions (metadata only). '
                  'last_read: when decisions.d last read it; changed: whether it moved since the read before. Made by tools/sessions.py.')
seen = set()
for f in [a for a in sys.argv[1:] if not a.startswith('--')]:
    for row in json.load(open(f)):
        sid = row['id']; seen.add(sid)
        old = state['sessions'].get(sid)
        e = {'title': REDACT.get(sid) or safe(row.get('title')), 'created_at': (row.get('created_at') or '')[:19] + 'Z', 'updated_at': (row.get('updated_at') or '')[:19] + 'Z',
             'bucket': row.get('status_bucket') or '', 'parent': row.get('parent_session_id'),
             'first_seen': old['first_seen'] if old else stamp, 'last_read': stamp,
             'changed': (old is None) or old.get('updated_at') != (row.get('updated_at') or '')[:19] + 'Z' or old.get('bucket') != row.get('status_bucket'),
             'new': old is None}
        e['advice'], e['why'] = advise({'id': sid, **e})
        state['sessions'][sid] = e
PARTIAL = '--partial' in sys.argv  # only the newest page(s) read: sessions not seen are not marked gone
for sid, e in state['sessions'].items():
    if sid not in seen and not PARTIAL:
        e['gone'] = True
    elif sid not in seen:
        e['changed'] = False; e['new'] = False
state['read_at'] = stamp
os.makedirs(OUT, exist_ok=True)
json.dump(state, open(path, 'w'), indent=1, ensure_ascii=False)

S = state['sessions']
row = lambda sid, e: f"| {e['title']} | `{sid[-8:]}` | {e['bucket'].replace('SESSION_STATUS_BUCKET_', '').lower()} | {e['updated_at'][:16].replace('T', ' ')} | {e['why']} |"
md = ['# Sessions on account D', '',
      f'Read {stamp} by decisions.d from list_sessions (metadata only: titles, times, status; no transcripts). {len(S)} sessions. Made by `tools/sessions.py`. Archiving is Dinis\'s; the advice below is a recommendation.', '',
      '**The rule proposed:** keep a session that is working, was active in the last 6 hours, or that Dinis wants to work with closely; watch one waiting on a person; recommend archiving a finished one-off run, one idle for over 3 days, or one failed and idle for a day. A session can always be started fresh from its debrief.', '']
for label, pick in [('Changed since the last read', lambda e: e['changed'] and not e.get('new')), ('New since the last read', lambda e: e.get('new') and state.get('runs', 0) > 0),
                    ('Keep', lambda e: e['advice'] == 'keep'), ('Watch', lambda e: e['advice'] == 'watch'), ('Recommend archiving', lambda e: e['advice'] == 'archive')]:
    rows = sorted([(s, e) for s, e in S.items() if pick(e) and not e.get('gone')], key=lambda x: x[1]['updated_at'], reverse=True)
    md += [f'## {label} ({len(rows)})', '']
    if rows:
        md += ['| Session | Id | Status | Last active (UTC) | Why |', '|---|---|---|---|---|'] + [row(s, e) for s, e in rows]
    md.append('')
state['runs'] = state.get('runs', 0) + 1
json.dump(state, open(path, 'w'), indent=1, ensure_ascii=False)
open(f'{OUT}/README.md', 'w').write('\n'.join(md))
print(f"sessions: {len(S)} seen; keep {sum(e['advice']=='keep' for e in S.values())}, watch {sum(e['advice']=='watch' for e in S.values())}, archive {sum(e['advice']=='archive' for e in S.values())}")
