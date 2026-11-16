#!/usr/bin/env python3
"""Bring researcher@'s staged outlet records (branch work/researcher, desks/researcher/media/) into
data/organisations/<id>/organisation.json in the media shape (data/schemas/organisation.schema.json).
Contacts: only the outlet's own contact PAGE is kept; an address or number stays on the researcher's branch.
Run from the repository root:  python3 -I board/team/ontologist/tools/media-from-researcher.py [ref]"""
import json, os, re, subprocess, sys
ref = sys.argv[1] if len(sys.argv) > 1 else 'origin/work/researcher'
NOW = '2026-11-16'
BY = 'ontologist@PrompTugal.dinis'
KW = [  # (keyword, place id): first match wins; coarse = placed at the district capital
 ('açores','acores'),('acores','acores'),('ponta delgada','acores'),('madeira','madeira'),('funchal','madeira'),
 ('viana do castelo','viana-do-castelo'),('arcos de valdevez','viana-do-castelo'),('alto minho','viana-do-castelo'),
 ('bragança','braganca'),('vila real','vila-real'),('trás-os-montes','vila-real'),('alto tâmega','vila-real'),
 ('braga','braga'),('famalicão','braga'),('cávado','braga'),('minho','braga'),
 ('porto','porto'),('aveiro','aveiro'),('viseu','viseu'),
 ('guarda','guarda'),('almeida','guarda'),('sabugal','guarda'),('pinhel','guarda'),('figueira de castelo rodrigo','guarda'),('serra da estrela','guarda'),
 ('covilhã','castelo-branco'),('sertã','castelo-branco'),('cernache','castelo-branco'),('castelo branco','castelo-branco'),
 ('coimbra','coimbra'),('figueira da foz','coimbra'),('cantanhede','coimbra'),
 ('leiria','leiria'),('caldas da rainha','leiria'),('nazaré','leiria'),
 ('santarém','santarem'),('ribatejo','santarem'),('médio tejo','santarem'),('tomar','santarem'),('torres novas','santarem'),('alcanena','santarem'),('entroncamento','santarem'),('golegã','santarem'),('abrantes','santarem'),
 ('setúbal','setubal'),('évora','evora'),('beja','beja'),('portalegre','portalegre'),('alentejo','evora'),
 ('lisboa','lisbon'),('lisbon','lisbon'),('portugal','portugal'),('região centro','portugal'),
]
def place_of(s):
    t = s.lower()
    for k, p in KW:
        if k in t: return p
    return 'portugal'
KIND = {'newspaper':'newspaper','online':'online','radio':'radio','tv':'tv','magazine':'magazine','news-agency':'agency','blog':'blog'}
FMT = {'rss':'rss','atom':'atom','json':'json-feed','json-feed':'json-feed','api':'api','sitemap':'sitemap'}
BAD = re.compile(r'@|(?:\+?\d[\d .-]{7,}\d)')
def src(url, read_at, how): return {'url': url, 'read_at': read_at or NOW, 'how': how}
names = [n for n in subprocess.check_output(['git','ls-tree','--name-only',ref,'desks/researcher/media/'],text=True).split() if n.endswith('.json')]
made = 0
for n in names:
    d = json.loads(subprocess.check_output(['git','show',f'{ref}:{n}'],text=True))
    i = d['id']; path = f'data/organisations/{i}/organisation.json'
    if os.path.exists(path) and 'media' not in json.load(open(path)): print('skip (an organisation of another kind exists):', i); continue
    cov, fine = [], []
    for p in d['places_covered']:
        s = p['place'] if isinstance(p, dict) else p
        pid = place_of(s); 
        if f'place:{pid}' not in cov: cov.append(f'place:{pid}')
        if s.lower() not in (pid, 'portugal') and not re.fullmatch(r'[\w ãçéíóúâêô-]+', s) is None and pid.replace('-',' ') not in s.lower(): fine.append(s)
    m = {'outlet_kind': ('regional-newspaper' if d['media_kind']=='newspaper' and d.get('reach')!='national' else KIND.get(d['media_kind'],'other')),
         'places_covered': cov, 'language': [d['language']] if d.get('language') else [], 'website': d['website']}
    if not m['language']: del m['language']
    o = d.get('owner')
    if isinstance(o, dict) and not BAD.search(o['name']): m['owner'] = {'name': o['name'], 'source': src(o['source_url'], o.get('read_at'), 'the outlet\'s own page, as the researcher read it')}
    fs = []
    for f in d.get('feeds', []):
        fm = FMT.get(f.get('kind','').lower())
        if fm and f.get('url'): fs.append({'url': f['url'], 'format': fm, 'source': src(f['url'], f.get('read_at'), 'checked by the researcher: ' + re.sub(BAD, '', f.get('checked','read')))})
    if fs: m['feeds'] = fs
    if d.get('contact_page_url'): m['contact'] = {'page': d['contact_page_url'], 'source': src(d['contact_page_url'], NOW, "the outlet's own contact page; an address or number, if public, is on the researcher's staged record, not copied here")}
    ps = []
    for x in d.get('people', []):
        if BAD.search(x['name']+x['role']+x.get('beat','')): continue
        e = {'name': x['name'], 'role': x['role'], 'source': src(x['source_url'], x.get('read_at'), 'named by the outlet itself on this page')}
        if x.get('beat'): e['beat'] = x['beat']
        ps.append(e)
    if ps: m['people'] = ps
    m['sources'] = [src(s['url'], s.get('read_at'), BAD.sub('', s['how'])) for s in d['sources']]
    note = 'From researcher@\'s staged record (desks/researcher/media/, branch work/researcher), converted by ontologist@ on 16 November 2026.'
    if fine: note += ' Placed at the district capital; finer localities named: ' + '; '.join(fine) + '.'
    if d.get('gaps'): note += ' Gaps: ' + ' '.join(BAD.sub('', g).rstrip('.') + '.' for g in d['gaps'])
    org = {'$schema': '../../schemas/organisation.schema.json', 'id': i, 'type': 'organisation', 'kind': 'media', 'name': d['name'], 'names_as_listed': d.get('names_as_listed') or [d['name']], 'note': note, 'media': m,
           'sources': [src(s['url'], s.get('read_at'), BAD.sub('', s['how'])) | {'by': BY} for s in d['sources']]}
    for s in org['sources']: pass
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(org, open(path,'w'), indent=2, ensure_ascii=False); open(path,'a').write('\n'); made += 1
print('written', made)
