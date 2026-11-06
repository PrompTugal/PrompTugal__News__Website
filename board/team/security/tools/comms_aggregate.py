# Merge the per-session .jsonl files into one de-duplicated ledger of agent-to-agent acts (metadata only).
import json,glob,os,sys,collections
D=os.path.dirname(os.path.abspath(__file__))
NAMES={
 'session_018yvwtMe4xXJFw1aRGHvua4':'conductor@PT','session_018yvwtMPVc6R9iMzkBcVpE2':'conductor.3@web-summit',
 'session_018yvwtMwNGPJiBw728GuDNS':'dev@PT','session_018yvwtMab6bVYdn5MBf8gSM':'designer@PT','session_018yvwtLWKbLRgLcii5Yq23M':'journalist@PT',
 'session_018yvwtQ6fQgzvZ6Jb3VukRF':'ontologist@PT','session_018yvwtLcqWG6JPoRm4WNpVw':'outreach@PT','session_018yvwtPwS34zFWFNrJZbDkt':'synthetic@PT',
 'session_018yvwtNX1LDpfgHYSUMvVnv':'observability@PT','session_018yvwtMLggiXipMS5bWQnxP':'historian@PT','session_018yvwtQCGFqaAVtFCxWBYWk':'devops@PT',
 'session_018yvwtNqd1q2vsNsqHg1m2i':'accountant@PT','session_018yvwtMPFU9MsUMpEjuEK1n':'sherpa@PT','session_018yvwtNgf1CH2YZb7WqfNei':'librarian@PT',
 'session_018yvwtNseZ4j4agt2arDK5M':'correspondent@PT','session_018yvwtNBvrcnvCkA11abbrH':'security@PT',
 'session_018yvwtNCAzS9VDHzmvaHCuV':'observability@web-summit','session_018yvwtM8j717LZDeb2aRbjF':'crm@web-summit','session_018yvwtQ4nYuQE5a3EYxqYva':'newsroom@web-summit',
 'session_018yvwtQLVrqJa3cTmxtZjFc':'newsroom@web-summit (4 Nov)','session_018yvwtQux1eGnRQaVfah5ub':'designer@web-summit','session_018yvwtMwCqQWyqt2iPgio4n':'journalist@web-summit'}
n=lambda s: NAMES.get(s, s if not str(s).startswith('session_') else 'other session')
rows=[]
for f in glob.glob(os.path.join(D,'out','*.jsonl')):
    for l in open(f):
        l=l.strip()
        if l.startswith('{'):
            r=json.loads(l)
            if not r.get('page'): rows.append(r)
# pair: an outbound send_message and its inbound copy are one act; keep outbound when both are seen, by (from,to,chars) within 5 minutes
out=[r for r in rows if r['dir']=='out']; inn=[r for r in rows if r['dir']=='in']
acts=[]; used=set()
for r in out: acts.append({**r,'seen':'sender'})
for r in inn:
    if r['act']=='scheduled_wake': acts.append({**r,'seen':'receiver'}); continue
    m=next((a for a in acts if a['act']=='send_message' and a['dir']=='out' and a['from']==r['from'] and a['to']==r['to'] and 300<=r['chars']-a['chars']<=900 and a['ts'][:10]==r['ts'][:10] and 0<=(int(r['ts'][11:13])*60+int(r['ts'][14:16]))-(int(a['ts'][11:13])*60+int(a['ts'][14:16]))<=60 and id(a) not in used),None)
    if m: used.add(id(m)); m['seen']='both'
    else: acts.append({**r,'seen':'receiver','chars':max(0,r['chars']-550)})
acts.sort(key=lambda a:a['ts'])
for a in acts: a['from_name']=n(a['from']); a['to_name']=n(a['to'])
json.dump(acts,open(os.path.join(D,'ledger.json'),'w'),indent=0)
C=collections.Counter; by_act=C(a['act'] for a in acts)
print('acts',len(acts),dict(by_act))
print('seen',dict(C(a['seen'] for a in acts if a['act']=='send_message')))
pairs=C((a['from_name'],a['to_name'],a['act']) for a in acts if a['act']!='scheduled_wake')
for (f,t,k),v in pairs.most_common(60): print(f'{v:3} {k:16} {f:24} -> {t}')
print('chars by sender', dict(C({}) ))
cs=collections.defaultdict(int)
for a in acts:
    if a.get('chars'): cs[a['from_name']]+=a['chars']
print(dict(sorted(cs.items(),key=lambda x:-x[1])))
print('claims_dinis',sum(1 for a in acts if a.get('claims_dinis')),'secret_like',sum(1 for a in acts if a.get('secret_like')))
print('by hour',dict(sorted(C(a['ts'][:13] for a in acts if a['act']!='scheduled_wake').items())))
