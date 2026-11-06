# Count an append lane's entries (metadata only: no content fetched, no credential printed).
import json,os,sys,urllib.request,collections
c=json.load(open(os.path.expanduser(sys.argv[1])))
def call(op,body):
    req=urllib.request.Request(f"{c['host']}/api/vault/append/{op}/{c['vault_id']}",data=json.dumps(body).encode(),method='POST',
        headers={'Content-Type':'application/json','x-sgraph-vault-enum-key':c['enum_key']})
    with urllib.request.urlopen(req,timeout=60) as r: return json.loads(r.read() or b'{}')
es,after=[],None
while True:
    r=call('list',{'include_content':False,**({'after_file_id':after} if after else {})}); p=r.get('entries',[]); es+=p
    if not r.get('truncated') or not p: break
    after=p[-1]['file_id']
fields=sorted({k for e in es for k in e})
print(json.dumps({'entries':len(es),'fields':[f for f in fields if f!='inbox'],
  'sizes':[e.get('size') for e in es][:50],'times':[e.get('created_at') or e.get('timestamp') for e in es][:50],
  'processed':collections.Counter(str(e.get('processed')) for e in es)}))
