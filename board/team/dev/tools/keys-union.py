import json,subprocess,sys
ours=json.loads(subprocess.run(['git','show',':2:board/keys.json'],capture_output=True,text=True).stdout)
theirs=json.loads(subprocess.run(['git','show',':3:board/keys.json'],capture_output=True,text=True).stdout)
ids={k['id'] for k in ours['keys']}
add=[k for k in theirs['keys'] if k['id'] not in ids]
assert not any('PRIVATE' in json.dumps(k) for k in add)
ours['keys']+=add
json.dump(ours,open('board/keys.json','w'),indent=2,ensure_ascii=False); open('board/keys.json','a').write('\n')
print('added',[k['id'] for k in add])
