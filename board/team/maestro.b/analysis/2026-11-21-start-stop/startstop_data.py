import json,subprocess,re,glob,os,collections,sys
OUT=sys.argv[1]
def san(s):
    s=s or ''
    def f(m):
        local,dom=m.group(1),m.group(2)
        if dom in('PrompTugal.dinis','AgentiCCells.dinis'): return m.group(0)
        return f"{local} ({dom})"
    return re.sub(r'([\w.+-]+)@([\w.-]+\.\w+)',f,s)
# commits
fmt='%H%x1f%aI%x1f%an%x1f%s%x1f%(trailers:key=Agent,valueonly,separator=;)%x1e'
raw=subprocess.check_output(['git','log','--reverse',f'--format={fmt}'],text=True)
rows=[]
for rec in raw.split('\x1e'):
    rec=rec.strip('\n')
    if not rec: continue
    h,t,an,subj,agent=(rec.split('\x1f')+['']*5)[:5]
    agent=agent.strip().split(';')[0].strip()
    if not agent:
        m=re.match(r'([\w.]+@[\w.]+)',subj) or re.match(r'(maestro\.b) \(account-b\)',subj)
        agent=m.group(1) if m else ''
    if subj.startswith('site v'): kind='ci-release'; agent='CI (GitHub Actions)'
    elif 'derived data brought up to date' in subj: kind='derived'
    else: kind='work'
    a=agent.lower()
    if 'maestro' in a: grp='maestro.b'
    elif a.startswith('conductor.b@prompt'): grp='conductor.b (account B)'
    elif a.startswith('conductor@prompt') : grp='conductor (account A)'
    elif re.search(r'\.(vicky|jose)\b',a) or 'local@' in a: grp='partner desks (Vicky, Jose)'
    elif kind=='ci-release': grp='CI'
    elif a.endswith('.b@promptugal.dinis') or re.match(r'(data|live|weather|cyber|civic|signals|events|library|startups|videos|travel|bulletins|telemetry)\.b',a): grp='site leads (.b)'
    elif a in('abp@promptugal.dinis','security@promptugal.dinis','rights@promptugal.dinis','librarian@promptugal.dinis') : grp='side-cars (abp, security, rights, librarian)'
    elif a.endswith('@promptugal.dinis'): grp='newsroom desks'
    elif 'web-summit' in a or 'newsroom@' in a: grp='web-summit team / builder'
    else: grp='other'
    rows.append(dict(sha=h[:9],time=t[:19]+'Z' if t.endswith('+00:00') else t,agent=san(agent),group=grp,kind=kind,subject=san(subj)[:140]))
json.dump(rows,open(f'{OUT}/commits.json (not kept: regenerate with startstop_data.py)','w'),indent=0)
# hourly
hr=collections.Counter(); hg=collections.defaultdict(collections.Counter)
for r in rows:
    k=r['time'][:13]; hr[k]+=1; hg[k][r['group']]+=1
groups=sorted({r['group'] for r in rows})
with open(f'{OUT}/commits-per-hour.csv','w') as f:
    f.write('hour_utc,total,'+','.join(groups)+'\n')
    for k in sorted(hr): f.write(f"{k}:00Z,{hr[k]},"+','.join(str(hg[k][g]) for g in groups)+'\n')
# ledger
led=[]
for p in sorted(glob.glob('board/team/conductor.b/ledger/*.json')):
    d=json.load(open(p))
    tot=d.get('all_total_usd') or d.get('total_api_equivalent_usd') or d.get('restarted_sessions_total_usd')
    led.append(dict(file=os.path.basename(p),read_at=d.get('read_at') or d.get('stamp'),total_usd=tot,
        change_usd=d.get('change_since_previous_usd'),hours=d.get('hours_since_previous'),
        sessions=d.get('sessions') if isinstance(d.get('sessions'),int) else (len(d['rows']) if isinstance(d.get('rows'),list) else None),
        rate_limit=san(str(d.get('rate_limit','')))[:120]))
json.dump(led,open(f'{OUT}/ledger.json','w'),indent=1)
# latest per-agent
d=json.load(open(sorted(glob.glob('board/team/conductor.b/ledger/*.json'))[-1]))
per=[dict(name=san(r.get('agent') or r.get('name','')),model=r.get('model'),usd=r.get('cumulative_usd') or r.get('usd'),delta_13h_usd=r.get('delta_usd')) for r in d.get('rows',[]) if isinstance(r,dict)]
json.dump(per,open(f'{OUT}/ledger-latest-per-session.json','w'),indent=1)
print(len(rows),'commits',len(led),'ledger reads',len(per),'sessions')
print(led[0]); print(led[-1])
