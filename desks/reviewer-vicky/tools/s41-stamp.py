"""Move S41's "as of" time to the latest check, when nothing material changed (reviewer@PrompTugal.vicky).

Usage, from the repository root:  python3 -I desks/reviewer-vicky/tools/s41-stamp.py 2026-11-10T16:43Z
Edits the live article and its draft; the caller rebuilds, re-signs and releases.
"""
import re, sys, datetime
t = datetime.datetime.strptime(sys.argv[1], '%Y-%m-%dT%H:%MZ')
T, D, DATE = t.strftime('%H:%M'), t.strftime('%A'), f"{t.day} {t.strftime('%B %Y')}"
FILES = ['content/articles/red-wind-warning-lisbon-wednesday.md',
         'desks/journalist-vicky/drafts/S41-red-wind-warning-lisbon-wednesday.md']
SUBS = [
    (r'As of \d\d:\d\d UTC on \w+day', f'As of {T} UTC on {D}'),
    (r'As of \d\d:\d\d UTC,', f'As of {T} UTC,'),
    (r'unchanged at \d\d:\d\d UTC(?: on \w+day)?', f'unchanged at {T} UTC on {D}'),
    (r'and again at \d\d:\d\d UTC on \w+day', f'and again at {T} UTC on {D}'),
    (r'as read at \d\d:\d\d UTC on \w+day', f'as read at {T} UTC on {D}'),
    # the warnings and Web Summit's pages only; the forecast line (read at 14:33) is not re-checked hourly
    (r'(?<!13:31\), )read 10 November 2026 at 14:23 and \d\d:\d\d UTC', f'first read 10 November 2026 at 14:23 UTC, last checked {DATE} at {T} UTC'),
    (r'last checked \d+ \w+ 2026 at \d\d:\d\d UTC', f'last checked {DATE} at {T} UTC'),
]
for f in FILES:
    s = open(f).read()
    n = 0
    for a, b in SUBS:
        s, k = re.subn(a, b, s); n += k
    s = s.replace('first read first read', 'first read')
    open(f, 'w').write(s)
    print(f, n, 'replacements')
