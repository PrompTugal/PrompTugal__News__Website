import json,glob,re,os
import os
N=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+"/"  # desks/curator/ of the clone this file sits in
maps=[json.load(open(f)) for f in sorted(glob.glob(N+"2*.json"))]  # the dated maps only (not stories.json)
# id -> vault file
idfile={}
for m in maps:
    for e in m.get("earlier_captures",[]):
        for i in e["as"]: idfile[i]=e["vault_file"].split("captures/")[1]
    for c in m.get("captures",[]):
        if c["id"].startswith("v-"): idfile[c["id"]]=c["file"].split("captures/")[1]
def meta(fn):
    t=open(VC+fn).read()
    g=lambda k: re.search(r'^%s:\s*(.+)$'%k,t,re.M).group(1).strip().strip('"')
    return g("source"),g("publisher"),g("read_on"),g("title")
MON=["January","February","March","April","May","June","July","August","September","October","November","December"]
def day(s):
    y,mo,d=s.split()[0].split("-"); return f"{int(d)} {MON[int(mo)-1]} {y}"
import argparse,sys
ap=argparse.ArgumentParser(description="Rebuild desks/curator/README.md from desks/curator/stories.json and the research vault's captures")
ap.add_argument("--captures",default="/home/user/vaults/research-41j3e9s9/captures/",help="the research vault's captures folder")
ap.add_argument("--check",action="store_true",help="rebuild in memory; exit 1 if it differs from README.md (ignoring the Last updated line)")
ARGS=ap.parse_args()
VC=ARGS.captures.rstrip("/")+"/"
if not os.path.isdir(VC): sys.exit("readme.py: the captures folder is missing: "+VC+" (pass --captures <folder>, or sgit pull the research vault)")
D=json.load(open(N+"stories.json"))
rests={k:list(v) for k,v in D["rests"].items()}
PUBLISHED={k:tuple(v) for k,v in D["PUBLISHED"].items()}
WITHDRAWN=set(D["WITHDRAWN"])
DRAFTED=dict(D["DRAFTED"])
DROPPED=dict(D["DROPPED"])
EXTRA_SRC={k:tuple(v) for k,v in D["EXTRA_SRC"].items()}
READY=list(D["READY"])
ASSIGN=[tuple(x) for x in D["ASSIGN"]]
stories=[tuple(x) for x in D["stories"]]
import subprocess
NOW=subprocess.check_output(["date","-u","+%A %-d %B %Y, %H:%M UTC"],text=True).strip()
allst=stories
stories=[s for s in allst if s[0] not in DROPPED]
out=["# The curator's story candidates","",
"Kept by curator@PrompTugal.vicky (until 6 November curator@web-summit.vicky), Vicky's curator desk for PrompTugal.news. The curator reads what the researcher found and suggests stories for the journalist. This page lists every story idea that is still open, newest first, each with its sources underneath. It is updated at every curator run (07:45, 11:45, 15:45 and 19:45 UTC).","",
"**About the sources.** Each source is a public page the researcher captured in the research vault (41j3e9s9), with the publisher, its title and the day the researcher read it, written as the newsroom's STYLE.md asks. The curator copies them from the researcher's captures and does not open or check them; that is the fact-checkers' job, on both sides: reviewer@PrompTugal.vicky for Vicky's desks, and Indi's fact-checker for Indi's. Only pages that are public and open without a login are listed. A storyline with nothing behind it yet says \"no source yet\".","",
"**Connections** (from 5 November, at Dinis's direction): stories that link startups and companies at Web Summit so each gets the most out of the week: startups in the same field, startups and the investors or programmes that back that field, companies on the same stage or day, Portuguese startups and the European ones they could work with. They are marked \"Connections\" in the beat. Each link is the curator's suggestion from public facts: no source says these organisations plan to meet, and no story should say so. Organisations only; nothing private about anyone.","","Last updated: "+NOW+".","",
"**Categories** (Vicky, 10 November 2026): the curator assigns every article its main categories from `desks/curator/categories.json` (one or more of Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate) when commissioning it, and adds its line to that file before the article is published. A new main category only with Vicky's approval; routine corrections are the curator's. Corporate versus Startups & Scaleups by the story's subject and angle, never by size, valuation, funding round or headcount. No article file is edited for this.","",
"**Categories with every commission** (conductor.B at Vicky's word, 11 November 2026): every commission in a map carries its `categories` (in the story and in its note and README line); and as soon as a draft goes to review, the curator sends reviewer@PrompTugal.vicky the slug (the draft file name without the S-number) and the categories line, with the curator's word for reviewer@ to add it to `categories.json` in the same release as the article, so nothing Ready waits for it.","",
"**Standing source rule: storm-charles.promptugal.news** (conductor.B at Vicky's word, 11 November 2026, at Dinis's request; full rule `desks/conductor-vicky/sources/storm-charles.md`): Dinis's incident team's storm site (JSON at `/api/v1/index.json`, `llms.txt`) is an input for storm and summit-disruption angles, a pointer and never the source we cite. Every fact is read and cited at the official source (IPMA, ANEPC, the government, an operator, Web Summit) before commissioning or publishing; it is not independent confirmation of our weather desk or social.watch (it reads both); its hypothesis and analysis rows are never stated as fact; check each row's read time. Its closures list and Thursday outlook may suggest angles.","",
"**Standing source rule: lisbontechfringe.com** (conductor.B at Vicky's word, 11 November 2026, 13:20 UTC, at Dinis's suggestion): the Lisbon Fringe site (data at `/api/v1/events.json` and `/api/v1/graph.json`) is an input for side-event angles (events moved or cancelled by the storm, communities, meetups), under the same rule as the storm site: a pointer, never the citation; every fact is checked and cited at the organiser's own page before we publish; its \"unknown\" or unconfirmed rows are never stated as fact; it is built by Dinis's swarm including Vicky's own fringe conductor, so it is not independent confirmation of what our desks already say. From 11 November 17:24 UTC (conductor.B, until the researcher audits its 16:13 UTC pass, which refreshed read_at times without re-checking each event's status): treat a Fringe entry's read_at as a pointer only; any side-event fact commissioned rests on the organiser's own page read by a person, or the organiser's own post.","",
"**Connections: how participation in Web Summit is confirmed** (conductor.B relaying Vicky, 11 November 2026, about 13:45 UTC; updates standing answer 19's confirmation step): for Connections storylines, participation may be confirmed by the person's or company's own public page or post, a press report, or Vicky's own browser read of their Web Summit page. **No machine reads of websummit.com by any desk** (from this note on the curator makes none: no curl or script against websummit.com; Web Summit facts come from its public statements as quoted by others, the organiser pages of side events, or a person's read in a browser). The duplicate checks stand.","",
"**Web Summit: no machine reads, no copied data for new work** (conductor.B relaying Vicky after Dinis's answer \"yes, don't use them\", 11 November 2026, about 14:30 UTC): (1) No machine reads of websummit.com, any of its subdomains or the Web Summit app by this desk: no curl, fetch, script, sub-agent, headless or automated browser, API or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press. (2) The desk's tools, scripts, notes and wake prompt carry no step that reads websummit.com (checked 11 November 2026, 14:35 UTC; the generator reads only the local research-vault clone and writes this page; the websummit.com links on this page are citations of stories already published, not reads). (3) No new work from data copied from Web Summit's site: the programme agenda (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places` and the Web Summit links in `data/companies`, and the researcher's startup capture in the vault; nothing of it is deleted or changed until Dinis says what to do with it.","",
"**No machine reads of Luma, Meetup or Eventbrite** (conductor.B relaying Vicky, 11 November 2026, about 14:40 UTC, until Dinis decides on Luma and the terms of Meetup and Eventbrite are checked): no machine reads of luma.com, lu.ma or Luma's API, meetup.com or eventbrite.com by this desk. Side-event leads from lisbontechfringe.com stay usable as pointers; a fact that needs the organiser's page on those sites needs a person's browser read. (The curator read three Luma pages by machine at 13:35 UTC on 11 November, before the rule; that is recorded on S57.)","",
"**Sources for anything about Web Summit** (conductor.B relaying Vicky, 11 November 2026, about 15:45 UTC, until Dinis decides): use press reports, the companies', speakers' and organisers' own posts and releases, official public bodies, and a person's browser check for single facts. Link to Web Summit's pages instead of copying or summarising them. Applied to commissioning: each brief says which of these sources support the angle, and no angle rests on summarising Web Summit's own pages.","",
"**Temporary discovery workflow** (Vicky, 11 November 2026, about 00:30 UTC, until her researcher returns; full text `desks/conductor-vicky/discovery/WORKFLOW.md`): at each wake the curator reads new leads in `desks/journalist-vicky/leads/` and social.watch's public findings (`board/team/social.watch/`: newest `hourly/` file, `coverage.json`, `signals/`; read-only material), runs the usual duplicate check and source checks, re-reads each source before commissioning, and commissions as usual with categories in `categories.json`. Connections still needs a public Web Summit source confirming participation. Each map carries a `leads_reviewed` list (each lead: commissioned with story id, held with why, or dropped with why). Research gaps go to `desks/journalist-vicky/leads/requests.md` (desk, gap, sources wanted) as well as `gaps_for_the_researcher`. When the researcher returns, the curator finishes the logged leads and hands over requests.md and the open gaps.","",
"## At a glance","","| Id | Title | Beat | Added |","|---|---|---|---|"]
for s in stories: out.append(f"| {s[0]} | {s[1]}{' (withdrawn 11 Nov)' if s[0] in WITHDRAWN else ' (published '+PUBLISHED[s[0]][1]+')' if s[0] in PUBLISHED else (' ('+DRAFTED[s[0]]+')' if s[0] in DRAFTED else '')} | {s[2]} | {s[4]} |")
out.append("")
for sid,title,beat,angle,added,note in stories:
    out+= [f"## {sid}: {title}","",f"{beat}, added {added}. {angle}" + (f" {note}" if note else "") + (" Status: withdrawn 11 Nov. "+(f"Was published on {PUBLISHED[sid][1]} 2026: {PUBLISHED[sid][0]}. " if sid in PUBLISHED else "")+"Not to be written again." if sid in WITHDRAWN else (f" Published on {PUBLISHED[sid][1]} 2026: {PUBLISHED[sid][0]}. Not to be written again." if sid in PUBLISHED else "")),"","Sources:",""]
    seen=[]
    for cid in rests[sid]:
        if cid in EXTRA_SRC:
            p,t,u,r=EXTRA_SRC[cid]; seen.append(cid); out.append(f'- [{p}, "{t}"]({u}), read {day(r)}'); continue
        fn=idfile[cid]
        if fn in seen: continue
        seen.append(fn)
        u,p,r,t=meta(fn)
        out.append(f'- [{p}, "{t}"]({u}), read {day(r)}')
    if not seen: out.append("- no source yet")
    out.append("")
import glob as _g
def _words(s): return {w for w in re.findall(r"[a-z0-9]+",s.lower()) if len(w)>3}
def _titles():
    root=os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))+"/"
    for f in _g.glob(root+"content/articles/*.md")+_g.glob(root+"desks/*/drafts/*.md"):
        for l in open(f,errors="ignore"):
            l=l.strip()
            if l.startswith("# ") or l.startswith("title:"):
                yield f.split("/")[-1], l.lstrip("#").replace("title:","").strip().strip('"'); break
def dup_matches(title,skip=()):
    a=_words(title); out=[]
    for fn,t in _titles():
        b=_words(t)
        if a and b and len(a&b)/len(a|b)>=0.5 and fn not in skip: out.append((fn,t))
    return out
for sid in READY:
    t=[s[1] for s in allst if s[0]==sid][0]
    assert not dup_matches(t),("ready story already has an article or draft",sid,dup_matches(t))
for sid in PUBLISHED:
    pass
out+=["## Assignments by desk: order and readiness","","For the five journalists, in priority order (standing answers 20 and 22, the desk review of 8 November). Each was checked against the articles and drafts at this run.","","Ready to write now:",""]
for k,(sid,desk,cond) in enumerate(ASSIGN,1):
    out.append(f"{k}. {sid}, {[s[1] for s in allst if s[0]==sid][0]}: for {desk}. {cond[0].upper()+cond[1:]}.")
out+=["","Already published, not to be written again: "+"; ".join(f"{k} ({v[0]})" for k,v in PUBLISHED.items())+".","","Already drafted, not to be written again: "+("; ".join(f"{k} ({v})" for k,v in DRAFTED.items()) or "none")+".","","No assignment this run: the summit, Europe, AI and connections desks (PagerDuty's production-agents post is held for the rest of the post and a second source). Reasons and the evidence wanted from the researcher are in the latest map.","","Held until the researcher captures more: S32 (rehab beyond the clinic) until the three companies' own pages are captured; a Portuguese angle on AI trust and risk until the Humanos country question is settled; fintech startups on the featured list; and the speakers' policy and investment, mobility and devices, and infrastructure and security groups.",""]
out+=["## Dropped","","Taken off the list on 6 November 2026, at Vicky's word, as duplicates of other candidates:","",]
for s in allst:
    if s[0] in DROPPED: out.append(f"- {s[0]}: {s[1]} ({DROPPED[s[0]]})")
out.append("")
s="\n".join(out)
assert not re.search('\u2014',s), [m.start() for m in re.finditer('[\u2014\u2013]',s)]
assert not re.search(r'@[\w-]+\.\w+\.md',s)
assert set(re.findall(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)+',s))<={"curator@web-summit.vicky","curator@PrompTugal.vicky","reviewer@PrompTugal.vicky"}
if ARGS.check:
    strip=lambda t: re.sub(r"^Last updated:.*$","",t,flags=re.M)
    if strip(open(N+"README.md").read())!=strip(s): sys.exit("readme.py --check: README.md differs from what stories.json builds; run python3 -I desks/curator/tools/readme.py")
    print("readme.py --check: OK"); sys.exit(0)
open(N+"README.md","w").write(s)
print(s[-900:])