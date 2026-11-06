import json,sys
raw=open(sys.argv[1],encoding='utf-8',errors='replace').read()
d=json.loads(raw[raw.find('{'):raw.rfind('}')+1])
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
ts=sorted(e.get('created_at','') for e in d['data'] if e.get('created_at'))
print(ts[0] if ts else None, ts[-1] if ts else None)
