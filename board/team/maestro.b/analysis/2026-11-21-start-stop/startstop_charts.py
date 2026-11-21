import json,csv,datetime as dt,sys,html
A=sys.argv[1]
T0=dt.datetime(2026,11,4); T1=dt.datetime(2026,11,23,1)
def p(s): s=s.rstrip('Z'); return dt.datetime.fromisoformat(s[:16])
W,H=1600,900; L,R,TOP,BOT=90,40,110,0
INK='#1d2433'; MUT='#6b7280'; GRID='#e5e7eb'; BG='#ffffff'
KC={'stop':'#c2410c','slow':'#b45309','start':'#15803d','move':'#1d4ed8','limit':'#7c3aed','rule':'#64748b'}
def head(title,sub):
    return [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Inter,Helvetica,Arial,sans-serif">',
      f'<rect width="{W}" height="{H}" fill="{BG}"/>',
      f'<text x="{L}" y="48" font-size="30" font-weight="700" fill="{INK}">{html.escape(title)}</text>',
      f'<text x="{L}" y="80" font-size="17" fill="{MUT}">{html.escape(sub)}</text>']
def xs(t,x0,x1): return x0+(x1-x0)*((t-T0).total_seconds()/(T1-T0).total_seconds())
def daygrid(s,x0,x1,y0,y1):
    d=T0
    while d<=T1:
        x=xs(d,x0,x1); s.append(f'<line x1="{x:.1f}" y1="{y0}" x2="{x:.1f}" y2="{y1}" stroke="{GRID}"/>')
        if d<T1: s.append(f'<text x="{x+3:.1f}" y="{y1+18}" font-size="12" fill="{MUT}">{d.day} Nov</text>')
        d+=dt.timedelta(days=1)
ev=json.load(open(f'{A}/events.json'))
def markers(s,x0,x1,y0,y1,label=True):
    for i,e in enumerate(ev,1):
        t=p(e['at']); x=xs(t,x0,x1); c=KC[e['kind']]
        s.append(f'<line x1="{x:.1f}" y1="{y0}" x2="{x:.1f}" y2="{y1}" stroke="{c}" stroke-width="2" stroke-dasharray="4 3"/>')
        if label:
            yy=y0-6-((i%3)*16)
            s.append(f'<circle cx="{x:.1f}" cy="{yy-5}" r="8" fill="{c}"/><text x="{x:.1f}" y="{yy-1}" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">{i}</text>')
# 1 commits per hour
rows=list(csv.DictReader(open(f'{A}/commits-per-hour.csv')))
x0,x1,y0,y1=L,W-R,170,700
mx=max(int(r['total']) for r in rows)
s=head('Commits per hour, 4 to 21 November 2026','Every commit in the PrompTugal__News__Website repository (8,027), by hour, UTC; numbered markers are the starts, stops and slow-downs in events.json')
daygrid(s,x0,x1,y0,y1)
for v in (0,25,50,75,100):
    if v>mx: break
    y=y1-(y1-y0)*v/mx; s.append(f'<text x="{x0-10}" y="{y+4:.1f}" font-size="12" fill="{MUT}" text-anchor="end">{v}</text>')
bw=(x1-x0)/((T1-T0).total_seconds()/3600)
for r in rows:
    t=p(r['hour_utc']); n=int(r['total']); ci=int(r['CI'])
    x=xs(t,x0,x1); h=(y1-y0)*n/mx; hc=(y1-y0)*ci/mx
    s.append(f'<rect x="{x:.1f}" y="{y1-h:.1f}" width="{max(bw-0.4,1):.1f}" height="{h-hc:.1f}" fill="#334155"/>')
    s.append(f'<rect x="{x:.1f}" y="{y1-hc:.1f}" width="{max(bw-0.4,1):.1f}" height="{hc:.1f}" fill="#94a3b8"/>')
markers(s,x0,x1,y0,y1)
ly=760
for i,e in enumerate(ev,1):
    col=(i-1)//8; row=(i-1)%8
    xx=L+col*500; yy=ly+row*16.5
    s.append(f'<circle cx="{xx+6}" cy="{yy-4}" r="7" fill="{KC[e["kind"]]}"/><text x="{xx+6}" y="{yy-1}" font-size="9" fill="#fff" text-anchor="middle" font-weight="700">{i}</text>')
    s.append(f'<text x="{xx+18}" y="{yy}" font-size="12" fill="{INK}">{html.escape(e["at"][5:10].replace("-","/")+" "+e["at"][11:16]+"  "+e["what"][:62]+("..." if len(e["what"])>62 else ""))}</text>')
s.append(f'<text x="{W-R}" y="112" font-size="13" fill="{MUT}" text-anchor="end">dark: agents, light: CI release commits</text>')
s.append('</svg>'); open(f'{A}/1-commits-per-hour.svg','w').write('\n'.join(s))
# 2 ledger
led=json.load(open(f'{A}/ledger.json'))
s=head('Account B spend, API-equivalent USD (not money paid)','Cumulative cost of the sessions in conductor.b@\'s ledger; two eras: the first account-B team (6 to 12 Nov) and the team restarted on 16 Nov; bars are USD per hour between reads')
x0,x1,y0,y1=L,W-R,170,520
mx=4000
daygrid(s,x0,x1,y0,y1)
for v in range(0,4001,1000):
    y=y1-(y1-y0)*v/mx; s.append(f'<text x="{x0-10}" y="{y+4:.1f}" font-size="12" fill="{MUT}" text-anchor="end">${v:,}</text>')
era=[[],[]]
for r in led: era[0 if r['read_at']<'2026-11-15' else 1].append(r)
for k,e in enumerate(era):
    pts=' '.join(f'{xs(p(r["read_at"]),x0,x1):.1f},{y1-(y1-y0)*r["total_usd"]/mx:.1f}' for r in e)
    s.append(f'<polyline points="{pts}" fill="none" stroke="{["#1d4ed8","#0f766e"][k]}" stroke-width="3"/>')
    last=e[-1]; s.append(f'<text x="{xs(p(last["read_at"]),x0,x1)+6:.1f}" y="{y1-(y1-y0)*last["total_usd"]/mx-6:.1f}" font-size="13" fill="{INK}">${last["total_usd"]:,.0f}</text>')
# rate bars
ry0,ry1=600,820; rmx=130
s.append(f'<text x="{L}" y="{ry0-12}" font-size="15" fill="{INK}" font-weight="600">USD per hour between ledger reads (hatched: new sessions joined, so part of the step is their history)</text>')
for v in (0,50,100):
    y=ry1-(ry1-ry0)*v/rmx; s.append(f'<text x="{x0-10}" y="{y+4:.1f}" font-size="12" fill="{MUT}" text-anchor="end">{v}</text><line x1="{x0}" y1="{y:.1f}" x2="{x1}" y2="{y:.1f}" stroke="{GRID}"/>')
for e in era:
    for a,b in zip(e,e[1:]):
        hrs=(p(b['read_at'])-p(a['read_at'])).total_seconds()/3600
        if hrs<=0: continue
        rate=(b['total_usd']-a['total_usd'])/hrs; grew=(b['sessions'] or 0)>(a['sessions'] or 0)
        xa,xb=xs(p(a['read_at']),x0,x1),xs(p(b['read_at']),x0,x1); h=(ry1-ry0)*min(rate,rmx)/rmx
        s.append(f'<rect x="{xa:.1f}" y="{ry1-h:.1f}" width="{max(xb-xa-1,1):.1f}" height="{h:.1f}" fill="{"#a5b4fc" if grew else "#475569"}"/>')
        if rate>rmx: s.append(f'<text x="{(xa+xb)/2:.1f}" y="{ry0-0:.1f}" font-size="11" fill="{MUT}" text-anchor="middle">{rate:.0f}</text>')
markers(s,x0,x1,y0,ry1,label=True)
s.append('</svg>'); open(f'{A}/2-spend.svg','w').write('\n'.join(s))
# 3 wakes per day
wk=list(csv.DictReader(open(f'{A}/wakes-per-day.csv')))
s=head('Scheduled wakes per day: the throttle','Each step is one decision by Dinis, applied by a conductor editing scheduled tasks; counts and estimates in wakes-per-day.csv')
x0,x1,y0,y1=L,W-R,170,620; mx=600
daygrid(s,x0,x1,y0,y1)
for v in (0,100,200,300,400,500,600):
    y=y1-(y1-y0)*v/mx; s.append(f'<text x="{x0-10}" y="{y+4:.1f}" font-size="12" fill="{MUT}" text-anchor="end">{v}</text>')
pts=[]
for a,b in zip(wk,wk[1:]+[{'from_utc':'2026-11-23T00:25Z'}]):
    xa,xb=xs(p(a['from_utc']),x0,x1),xs(p(b['from_utc']),x0,x1); y=y1-(y1-y0)*int(a['wakes_per_day'])/mx
    s.append(f'<rect x="{xa:.1f}" y="{y:.1f}" width="{xb-xa:.1f}" height="{y1-y:.1f}" fill="#cbd5e1" stroke="#475569"/>')
    s.append(f'<text x="{xa+3:.1f}" y="{y-6:.1f}" font-size="13" font-weight="700" fill="{INK}">{a["wakes_per_day"]}</text>')
xm=xs(p('2026-11-23T00:25Z'),x0,x1); s.append(f'<line x1="{xm:.1f}" y1="{y0}" x2="{xm:.1f}" y2="{y1}" stroke="#15803d" stroke-width="2" stroke-dasharray="5 4"/><text x="{xm-4:.1f}" y="{y0-8}" font-size="12" fill="#15803d" text-anchor="end">restore after the weekly reset</text>')
for i,r in enumerate(wk):
    s.append(f'<text x="{L}" y="{680+i*19}" font-size="13" fill="{INK}">{r["from_utc"][5:10].replace("-","/")} {r["from_utc"][11:16]}  {r["wakes_per_day"]:>4} a day  {html.escape(r["regime"])}</text>')
s.append('</svg>'); open(f'{A}/3-wakes-per-day.svg','w').write('\n'.join(s))
# 4 per session
per=sorted([x for x in json.load(open(f'{A}/ledger-latest-per-session.json')) if x['usd']],key=lambda x:-x['usd'])
s=head('Who spent what: the restarted team, 16 to 21 November','Cumulative API-equivalent USD per session at the 21 Nov 09:50 ledger read; a running conductor rereads its whole context on every wake, which is why the conductor leads')
bx0=420; bx1=W-120; y=130; mx=per[0]['usd']
for x in per[:36]:
    w=(bx1-bx0)*x['usd']/mx
    s.append(f'<text x="{bx0-10}" y="{y+13}" font-size="13" fill="{INK}" text-anchor="end">{html.escape(x["name"][:46])}</text><rect x="{bx0}" y="{y}" width="{w:.1f}" height="16" fill="#334155"/><text x="{bx0+w+6:.1f}" y="{y+13}" font-size="12" fill="{MUT}">${x["usd"]:,.0f}</text>')
    y+=20.5
s.append('</svg>'); open(f'{A}/4-per-session.svg','w').write('\n'.join(s))
print('charts ok')
