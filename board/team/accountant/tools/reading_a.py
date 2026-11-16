# usage: python3 reading_a.py HHMM now.json ios.json  (account A only, from 16 November; account B retired)
import json,sys,re
stamp,nowf,iosf=sys.argv[1:4]; hhmm=stamp[:2]+":"+stamp[2:]
p='board/budgets.json'; d=json.load(open(p)); base=d["baseline"]["A"]; now=json.load(open(nowf)); ios=json.load(open(iosf))
have={a["agent"] for a in d["agents"]}
for k in now:
    if k not in have:
        d["agents"].append({"agent":k,"per_day":{"releases":24,"usd":10,"output_tokens":200000},"spent_today":{},"used":0.0,"state":"ok","why":"from 16 November (accountant@'s line, a PT decision): Sonnet; captured, never a stop"})
        base.setdefault(k,{"usd":0,"output_tokens":0,"note":"started after the day's baseline"})
rows=[]
for a in d["agents"]:
    k=a["agent"]
    if k in now:
        u=round(now[k][0]-base.get(k,{}).get("usd",0),2); o=now[k][1]-base.get(k,{}).get("output_tokens",0)
    else: u,o=0,0
    a["spent_today"]={"releases":0,"usd":u,"output_tokens":o,"read_at":f"{d['day']}T{hhmm}Z","usd_by_account":{"A":u,"B":0}}
    a["used"]=round(u/a["per_day"]["usd"],2); a["state"]="warn" if a["used"]>=0.8 else "ok"
    w=re.sub(r';? ?OVER at [0-9:]+ UTC on [^;]*\(used [0-9.]+\); keeps working \(capture, not block\)','',a.get("why","")).strip("; ")
    if a["used"]>=1: w=(w+"; " if w else "")+f"OVER at {hhmm} UTC on usd (used {a['used']}); keeps working (capture, not block)"
    a["why"]=w or "captured, never a stop"; rows.append((k,u))
ib=d["ios_team"]["baseline_2026-11-16T00:48Z"]; it={k:round(v[0]-ib.get(k,{}).get("usd",0),2) for k,v in ios.items()}
d["ios_team"]["spent_today"]={"read_at":f"{d['day']}T{hhmm}Z","by_agent":it,"total":round(sum(it.values()),2)}
t=round(sum(u for _,u in rows),2); prev=d["team"]["spent_today"].get("usd",0)
d["team"]["spent_today"]={"releases":0,"usd":t,"read_at":f"{d['day']}T{hhmm}Z","usd_by_account":{"A":t,"B":0},"ios_team":d["ios_team"]["spent_today"]["total"]}
d["team"]["used"]=round(t/d["team"]["per_day"]["usd"],2)
d["team"]["rate"]=f"API-equivalent, {d['day']}: {t} by {hhmm} (account A; iOS team {d['ios_team']['spent_today']['total']} more); {round(t-prev,2)} since the reading before"
d["real_limits"]["read_at"]=f"{d['day']}T{hhmm}Z"; d["updated"]=f"{d['day']}T{hhmm}Z"
open(p,'w').write(json.dumps(d,indent=1,ensure_ascii=False)+"\n")
snap={"about":"A reading of the day: every account A PrompTugal session (get_session) minus the day's baseline. API-equivalent.","read_at":f"{d['day']}T{hhmm}Z","rows":[{"agent":k,"today":u} for k,u in sorted(rows,key=lambda r:-r[1]) if u],"ios_team":it,"total":{"team":t,"ios_team":d["ios_team"]["spent_today"]["total"],"since_previous":round(t-prev,2)}}
open(f'board/team/accountant/ledger/{d["day"]}T{stamp}Z.json','w').write(json.dumps(snap,indent=1)+"\n")
print(snap["total"]); [print(r) for r in snap["rows"][:8]]; print("over:",[(a["agent"].split("@")[0],a["used"]) for a in d["agents"] if a["used"]>=1]); print(it)
