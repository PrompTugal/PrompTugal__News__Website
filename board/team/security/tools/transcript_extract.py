# usage: python3 -I extract.py <session_id> <file-with-list_events-result> >> out/<session>.jsonl
# Reads a saved list_events result (JSON, possibly wrapped in text) and prints one JSON line per agent-to-agent act:
# outbound tool calls (send_message, create_session, create_trigger, update_trigger, fire_trigger, send_later,
# interrupt_session, archive_session, set_session_title) and inbound cross-session messages and scheduled wakes.
# Never prints message text: only sizes, times, ids, flags and a sha256 prefix.
import json,sys,re,hashlib
sid,path=sys.argv[1],sys.argv[2]
raw=open(path,encoding='utf-8',errors='replace').read()
i=raw.find('{'); j=raw.rfind('}')
d=json.loads(raw[i:j+1])
def find(o):
    if isinstance(o,dict):
        if isinstance(o.get('data'),list): return o
        for v in o.values():
            r=find(v)
            if r: return r
    if isinstance(o,list):
        for v in o:
            r=find(v)
            if r: return r
d=find(d) or {'data':[]}
ACTS={'send_message','create_session','create_trigger','update_trigger','fire_trigger','send_later','interrupt_session','archive_session','unarchive_session','set_session_title','delete_trigger'}
SECRET=re.compile(r'BEGIN [A-Z ]*PRIVATE KEY|sgit_private_|sk-(ant-|or-)?[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|[A-Za-z0-9_-]{20,}:[0-9a-f]{8}-[0-9a-f]{4}-|"d"\s*:\s*"[A-Za-z0-9_-]{20,}')
def flags(t):
    return {'chars':len(t),'sha':hashlib.sha256(t.encode()).hexdigest()[:16],
            'claims_dinis':bool(re.search(r"Dinis('s)? (words|said|asked|word)|relaying Dinis|at Dinis's word|In his words",t)),
            'secret_like':bool(SECRET.search(t))}
def walk(o):
    if isinstance(o,dict):
        yield o
        for v in o.values(): yield from walk(v)
    elif isinstance(o,list):
        for v in o: yield from walk(v)
seen=set()
for e in d['data']:
    ts=e.get('created_at','')
    for b in walk(e):
        if b.get('type')=='tool_use' and isinstance(b.get('name'),str):
            name=b['name'].split('__')[-1]
            if name in ACTS:
                inp=b.get('input') or {}
                text=str(inp.get('message') or inp.get('prompt') or inp.get('text') or '')
                key=('o',b.get('id'))
                if key in seen: continue
                seen.add(key)
                r={'ts':ts,'dir':'out','act':name,'from':sid,'to':inp.get('session_id') or inp.get('persistent_session_id') or inp.get('trigger_id') or ('new-session' if name=='create_session' else ('this-session' if name in('create_trigger','send_later') and not inp.get('create_new_session_on_fire') else '')),
                   'title':inp.get('title') or inp.get('name') or ''}
                r.update(flags(text)); print(json.dumps(r))
        if b.get('type')=='tool_use' and b.get('name')=='Bash':
            cmd=str((b.get('input') or {}).get('command',''))
            for m in re.finditer(r"agent_inboxes\.py\s+send\b[^\n]*?--from\s+([\w.-]+)[^\n]*?--to\s+([\w.$-]+)", cmd):
                key=('b',b.get('id'),m.start())
                if key in seen: continue
                seen.add(key)
                r={'ts':ts,'dir':'out','act':'inbox_send','from':sid,'from_role':m.group(1),'to':m.group(2)+'@PrompTugal'}; r.update(flags(m.group(0))); print(json.dumps(r))
            if '/api/vault/append/write/' in cmd:
                key=('a',b.get('id'))
                if key not in seen:
                    seen.add(key); print(json.dumps({'ts':ts,'dir':'out','act':'lane_append','from':sid,'to':'an append lane'}))
        if b.get('type')=='text' or 'content' in b and isinstance(b.get('content'),str):
            t=b.get('text') if isinstance(b.get('text'),str) else b.get('content') if isinstance(b.get('content'),str) else ''
            if not t: continue
            for m in re.finditer(r'<cross-session-message from-session="([^"]+)">(.*?)</cross-session-message>',t,re.S):
                key=('i',ts,m.group(1),len(m.group(2)))
                if key in seen: continue
                seen.add(key)
                r={'ts':ts,'dir':'in','act':'send_message','from':m.group(1),'to':sid}; r.update(flags(m.group(2))); print(json.dumps(r))
            m=re.search(r'Fired by routine "([^"]+)" \(trigger_id: (trig_[A-Za-z0-9]+)\)',t)
            if m:
                key=('w',ts,m.group(2))
                if key not in seen:
                    seen.add(key); print(json.dumps({'ts':ts,'dir':'in','act':'scheduled_wake','from':m.group(2),'to':sid,'title':m.group(1)}))
STRICT=[(re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'),'private key'),(re.compile(r'sgit_private_(vault|read)_[A-Za-z0-9]{6}'),'sgit private key'),
 (re.compile(r'\b(sk-(ant-|or-v1-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,})'),'API token'),
 (re.compile(r'(?<![A-Za-z0-9_-])[A-Za-z0-9_-]{20,}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-'),'vault-key shape'),
 (re.compile(r'"d"\s*:\s*"[A-Za-z0-9_-]{30,}"'),'private JWK'),(re.compile(r'"enum_key"\s*:\s*"[0-9a-f]{32,}"'),'enum key'),
 (re.compile(r'"vault_key"\s*:\s*"[^"]{10,}"'),'vault key field')]
for e in d['data']:
    ts=e.get('created_at','')
    blob=json.dumps(e)
    for rx,what in STRICT:
        for m in rx.finditer(blob):
            # the redaction pattern in the hook and the gate's fixtures are code, not secrets: skip regex-looking hits
            ctx=blob[max(0,m.start()-30):m.start()]
            if '\\b(' in ctx or "'+" in ctx or 'r(' in ctx: continue
            key=('s',ts,what,m.group(0)[:12])
            if key in seen: continue
            seen.add(key); ev=next((b.get('uuid') for b in walk(e) if isinstance(b,dict) and b.get('uuid')),None); print(json.dumps({'ts':ts,'dir':'scan','act':'secret_in_transcript','from':sid,'shape':what,'id':hashlib.sha256(m.group(0).encode()).hexdigest()[:12],'event':ev}))
print(json.dumps({'page':True,'session':sid,'events':len(d['data']),'first_id':d.get('first_id'),'has_more':d.get('has_more')}),file=sys.stderr)
