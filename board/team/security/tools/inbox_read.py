# Read security@'s inbox lane: fetch, open with security@'s key, verify each signature against board/keys.json.
# Prints metadata and a redacted preview; never a credential. Marks nothing processed.
import json,os,sys,base64,re,urllib.request
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
from sgit_ai.crypto.pki.PKI__Key_Store import PKI__Key_Store
repo=sys.argv[1]; creds=json.load(open(os.path.expanduser('~/.sg-send/lanes/inbox.json')))
c=PKI__Crypto(); st=PKI__Key_Store(keys_dir=os.path.expanduser('~/.sg-send/keys'),crypto=c)
pair=st.load_key_pair(creds['recipient'],'')
keys=json.load(open(os.path.join(repo,'board','keys.json')))['keys']
class KR:
    def lookup_by_signing_fingerprint(self,fp):
        for k in keys:
            if k['bundle'].get('signing_fingerprint')==fp: return {'signing_key_pem':k['bundle']['sign'],'label':k.get('agent') or k['id'],'status':k.get('status')}
kr=KR()
def call(op,body):
    req=urllib.request.Request(f"{creds['host']}/api/vault/append/{op}/{creds['vault_id']}",data=json.dumps(body).encode(),method='POST',headers={'Content-Type':'application/json','x-sgraph-vault-enum-key':creds['enum_key']})
    with urllib.request.urlopen(req,timeout=60) as r: return json.loads(r.read() or b'{}')
es,after=[],None
while True:
    r=call('list',{'include_content':False,**({'after_file_id':after} if after else {})}); p=r.get('entries',[]); es+=p
    if not r.get('truncated') or not p: break
    after=p[-1]['file_id']
SECRET=re.compile(r'BEGIN [A-Z ]*PRIVATE KEY|sgit_private_\w+|\b[0-9a-f]{40,}\b|sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}')
out=[]
for k in range(0,len(es),20):
    ids=[e['file_id'] for e in es[k:k+20]]
    tok=es[k].get('inbox')
    files=call('fetch',{'inbox':tok,'file_ids':ids}).get('files',[]) if tok else []
    if not files: files=call('fetch',{'file_ids':ids}).get('files',[])
    for f in files:
        raw=f.get('content') or f.get('payload') or ''
        try:
            env=base64.b64decode(raw).decode()
            res=c.hybrid_decrypt(pair['encryption_private'],env,contacts_keyring=kr)
            try: m=json.loads(res['plaintext'])
            except Exception: m={'text':res['plaintext']}
            t=str(m.get('text',''))
            out.append({'file':f['file_id'][:12],'received':f.get('received'),'claims_from':m.get('from'),'signed':res['signed'],'verified':res['verified'],'signer':res['signer'],
                        'sent':m.get('sent'),'subject':m.get('subject'),'chars':len(t),'secret_shaped':bool(SECRET.search(t)),'preview':SECRET.sub('[redacted]',t)[:int(os.environ.get('PREVIEW','300'))]})
        except Exception as e:
            out.append({'file':f.get('file_id','?')[:12],'error':type(e).__name__})
print(json.dumps({'entries':len(es),'opened':len(out)}))
for o in out: print(json.dumps(o,ensure_ascii=False))
