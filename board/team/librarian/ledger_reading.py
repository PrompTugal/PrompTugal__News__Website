# usage: python3 -I board/team/librarian/ledger_reading.py [ledger.json]  (librarian@/accountant@: append conductor.b@'s newest ledger to board/budgets.json restart_2026-11-16.readings)
import json,glob,sys
f=sys.argv[1] if len(sys.argv)>1 else sorted(glob.glob('board/team/conductor.b/ledger/*.json'))[-1]
p='board/budgets.json'; raw=open(p).read(); d=json.loads(raw)
r=d['restart_2026-11-16']; l=json.load(open(f)); at=l.get('read_at') or l['stamp']
if at==r['readings'][-1]['read_at']: raise SystemExit('already read: '+at)
if not l.get('rows'): raise SystemExit('no rows in '+f)
day_key=sorted(k for k in r if k.startswith('baseline_20'))[-1]; day=r[day_key]; base=day['by_agent']
first={x['agent']:x for x in r['readings'][0]['rows']}
lines={x['session']:x['per_day_usd'] for x in r['lines']}
seen={y['agent'] for z in r['readings'] for y in z['rows']}
rows=[];over=[];new=[];unmeasured=[]
for x in l['rows']:
    who=(x.get('agent') or x.get('name') or '?').split('@')[0]; cum=x.get('api_equivalent_usd', x.get('cost_usd', x.get('cumulative_usd')))  # field names seen: api_equivalent_usd; name+cost_usd (19 Nov); agent+cumulative_usd (21 Nov, from telemetry.b@'s reads)
    if cum is None:
        unmeasured.append(who); continue
    a=who; since=round(cum-(172.20 if a=='conductor.b' else 0),2)
    cap=first[a]['line_per_day'] if a in first else lines.get(a,(30 if a in('abp','conductor.b') else 10))
    t=round(since-base.get(a,0),2)
    if a not in seen: new.append(a)
    rows.append({"agent":a,"usd":since,"today_usd":t,"output_tokens":x.get('output_tokens'),"line_per_day":cap,"used_today":round(t/cap,2)})
    if t>=cap: over.append(a)
if len(unmeasured)>len(rows): raise SystemExit('refused: %d of %d sessions unmeasured in %s (new field names?)'%(len(unmeasured),len(unmeasured)+len(rows),f))
tot=round(sum(x['usd'] for x in rows),2); prev=r['readings'][-1]['total_usd']; tt=round(tot-day['cumulative_since_restart_usd'],2)
r['readings'].append({"read_at":at,"window":"16 Nov 19:28 to "+at.replace('T',' ')[:16]+" UTC (today = since the "+day_key[9:]+" baseline)","source":f,"total_usd":tot,"since_previous_usd":round(tot-prev,2),"today_total_usd":tt,"rows":rows,"over_a_day_line_today":over,"new_rows":new,"unmeasured":unmeasured,"note":"conductor.b@ share = cumulative minus 172.20; captured, nothing stops; a row new to the readings gets the default line (10; 30 for abp and conductor.b)"})
d['updated']=at
open(p,'w').write(json.dumps(d,indent=1,ensure_ascii=False)+("\n" if raw.endswith("\n") else ""))
print('unmeasured:',unmeasured); print(f,tot,round(tot-prev,2),'today',tt,len(over),'over:',over,'new:',new); print(sorted([(x['today_usd'],x['agent']) for x in rows])[-6:])
