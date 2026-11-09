import json,glob,re,os
import os
N=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+"/"  # desks/curator/ of the clone this file sits in
VC="/home/user/vaults/research-41j3e9s9/captures/"
maps=[json.load(open(f)) for f in sorted(glob.glob(N+"*.json"))]
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
rests={}
for m in maps:
    for s in m.get("story_candidates",[]): rests[s["id"]]=list(s["rests_on"])
rests["S5"]+= ["v-websummit-speakers"]      # revision in 2026-11-05-1145.json
rests["S7"]+= ["v-tecnico-web-summit-2026"] # revision in 2026-11-04-1955.json
rests["S1"]+= ["v-carris-web-summit-shuttle"] # revision in 2026-11-05-1945.json
rests["S1"]+= ["v-parque-das-nacoes-traffic"] # revision in 2026-11-06-1945.json
rests["S5"]+= ["v-ey-web-summit-economic-impact"] # revision in 2026-11-05-1945.json
PUBLISHED={"S28":("https://promptugal.news/articles/five-ai-builders-to-know.html","8 Nov"),"S29":("https://promptugal.news/articles/who-builds-the-parts-of-an-ai-agent.html","8 Nov"),"S30":("https://promptugal.news/articles/health-startups-by-problem.html","8 Nov")}  # id -> (article URL, date); set when an article or draft covers it
DROPPED={"S14":"duplicates","S21":"duplicates","S23":"duplicates"}
import subprocess
NOW=subprocess.check_output(["date","-u","+%A %-d %B %Y, %H:%M UTC"],text=True).strip()
EXTRA_SRC={"page-newsletter":("PrompTugal.news","The daily newsletter","https://promptugal.news/newsletter/index.html","2026-11-07 19:50"),"page-venue-map":("PrompTugal.news","The venue map","https://promptugal.news/summit/venue/index.html","2026-11-07 19:50"),"note-the-sign-in":("PrompTugal.news newsroom notes","The sign-in: a key in a QR code, and what it is for","https://promptugal.news/newsroom/notes/2026-11-06-the-sign-in/index.html","2026-11-07 11:55")}
stories=[ # id, title, beat, angle, added, note
("S32","Rehab beyond the clinic: three Portuguese startups at Web Summit","Connections: Portugal","Braining, UpSpeech and Twin Factory: different technology on the same problem, helping people recover outside the clinic.","9 Nov","Not ready: each company is known only from one article's one-line description; waits for the companies' own pages."),
("S31","Beyond Lisbon: where Road 2 Web Summit's 78 startups come from","Portugal","Lisbon has 41 of the 78 startups selected for Road 2 Web Summit; a tour of the other 37, from Porto and Braga to the Azores and Madeira, and what they build.","9 Nov","For journalist-portugal."),
("S30","Eleven health startups at Web Summit, by the problem they tackle","Connections: the summit","The health and wellness startups on Web Summit's featured list, grouped by the problem each says it tackles, from a first look at the list.","8 Nov","For journalist-connections. From the first page of 26 only."),
("S29","Who builds the parts of an AI agent? Startups at Web Summit","AI and robotics","A reader's guide to the AI-agent stack as eight startups on the featured list describe themselves, from frameworks and databases to governance and the products on top.","8 Nov","For journalist-ai (AI desk). From the first page of 26 only."),
("S28","Five AI builders on Web Summit's speaker list worth knowing","Connections: the summit","A theme-led guide to five AI builders on the speakers page: who they are by role and why a founder in the field might want to hear them.","8 Nov","Theme-led (standing answers 19 and 20), for journalist-connections; different from S12, S15 and S16."),
("S27","A map of Web Summit's buildings, and what each holds","AI and robotics","A new page draws the summit's buildings in Parque das Nações from OpenStreetMap and counts the programme's sessions in each; no people on it.","7 Nov","A team topic (a site change)."),
("S26","Two editions a day: PrompTugal.news starts a daily newsletter","AI and robotics","A morning edition (what is on today) and an evening edition (what happened and what is next), each a page and a short plain-text email with links.","7 Nov","A team topic (a site change)."),
("S25","The sign-in: how editors and agents prove who they are","AI and robotics","How PrompTugal.news lets its editors and agents sign in with a key handed over as a QR code, and the limits it states itself: readers need no account.","7 Nov","A team topic (Vicky: our team's work is a standing topic), not in the five-part series."),
("S24","Driving to Web Summit? Road closures and drop-off points","The summit","Which roads near the venue close from 8 to 12 November, where to be dropped off, and Carris's temporary terminal.","6 Nov",None),
("S23","Waste into value: AgroGrINTech and Seamoretech, two circular Portuguese startups","Connections: Portugal","Two startups that turn waste into resources, both grown from university research.","6 Nov",None),
("S22","From pineapple waste to fish feed: AgroGrINTech's pilot in Maia","Portugal","A Portuguese startup makes a fish feed ingredient from pineapple by-products.","6 Nov",None),
("S21","One backer, two fields: 3xP Global's Granter and Octo Health","Connections: Portugal","The same Portuguese investor led rounds in AI for grants and in health tracking. Widens S14.","6 Nov",None),
("S20","Lisbon's Octo Health launches health tracking in Portugal and the US","Portugal","A young Lisbon healthtech goes live in two countries, with testing for over 110 biomarkers.","6 Nov",None),
("S19","Brazil comes to Lisbon as Intuitivo heads to Brazil","Connections: announcements","About 200 Brazilian companies arrive as a Porto startup expands into Brazil: Lisbon as a bridge both ways.","5 Nov",None),
("S18","Tuesday 10 November: Europe on Centre Stage, universities pitching, first-timers meeting","Connections: the summit","One day, three ways in, with a note that two of them overlap.","5 Nov",None),
("S17","11 November for startups going abroad: three events to know","Connections: Europe","EU funding, the Dutch delegation and an Italy and Portugal event on scaling, for Portuguese startups growing into Europe.","5 Nov",None),
("S16","Europe's AI and funding help, a walk from Portugal's AI startups","Connections: Europe","The Commission's AI, data and supercomputer help in Pavilion 4, and the Portuguese AI startups it is made for.","5 Nov",None),
("S15","From Técnico's stand to the lineup: following robotics at Web Summit","Connections: the summit","Robotics on stage and on the floor, linked for anyone following the field. Builds on S12.","5 Nov",None),
("S14","Granter and Intuitivo: two PITCH winners, one backer, new markets","Connections: Portugal","Two past PITCH winners backed by the same fund, both growing abroad.","5 Nov",None),
("S13","Web Summit's ten Lisbon years: 2.5 billion euros, says EY","Portugal","What ten editions have meant for Portugal's economy and its startups, in EY's figures as reported.","5 Nov",None),
("S12","A robot among 800 speakers: Web Summit 2026 turns to robotics","The summit","800 speakers, a lineup led by robotics and AI companies, and a robot listed as a speaker.","5 Nov",None),
("S11","Italy and Portugal meet in Beato on how European tech scales","Europe","Italian and Portuguese founders and investors talk about growing beyond home markets, on 11 November.","5 Nov",None),
("S10","Lisbon's universities at Web Summit: two stands and a pitch day","Portugal","ULisboa and Técnico show robots, spin-offs and projects, and nine universities pitch on 10 November.","5 Nov","Takes in S8 (Técnico on its own), which is listed here and not again."),
("S9","About 200 Brazilian companies come to Lisbon for Web Summit","Announcements","Brazil brings some 200 companies and a pavilion in the MEO Arena to meet investors.","4 Nov",None),
("S7","The Portugal banner: awards, funding and the Algarve's plan","Portugal","Short items for the Portugal banner: Unicorn Factory Lisboa's awards, new funding rounds, the Algarve's startup plan.","4 Nov",None),
("S6","Gender in Tech report: 84% see women in leadership","Announcements","Web Summit's report finds most people now see women in leadership at work, and is honest about what still needs to change.","4 Nov",None),
("S5","Web Summit 2026 in numbers: 70,000 people, 10,000 startups","Announcements","The size of the week in Web Summit's own figures, and what its survey found about AI at work.","4 Nov","Updated 4 and 5 Nov (twice)."),
("S4","From the PITCH stage to new markets: Portuguese startups raising","Portugal","Past PITCH winners and a Porto startup raise money to grow abroad.","4 Nov",None),
("S3","Road 2 Web Summit: Portugal's startups head for Lisbon","Portugal","Eleven years of a programme that brings up to 125 Portuguese startups to the summit.","4 Nov",None),
("S2","Europe arrives in Pavilion 4: the Commission's week at Web Summit","Europe","The European Commission comes to help builders, with talks, masterclasses and funding sessions.","4 Nov",None),
("S1","Web Summit Lisbon: your first day, from airport to arena","The summit","A practical guide: where to collect your wristband, how to get there, what to bring.","4 Nov","Updated 4, 5 and 6 Nov with the transport pass, the Carris shuttle and the drop-off points."),
]
allst=stories
stories=[s for s in allst if s[0] not in DROPPED]
out=["# The curator's story candidates","",
"Kept by curator@PrompTugal.vicky (until 6 November curator@web-summit.vicky), Vicky's curator desk for PrompTugal.news. The curator reads what the researcher found and suggests stories for the journalist. This page lists every story idea that is still open, newest first, each with its sources underneath. It is updated at every curator run (07:45, 11:45, 15:45 and 19:45 UTC).","",
"**About the sources.** Each source is a public page the researcher captured in the research vault (41j3e9s9), with the publisher, its title and the day the researcher read it, written as the newsroom's STYLE.md asks. The curator copies them from the researcher's captures and does not open or check them; that is the fact-checkers' job, on both sides: reviewer@PrompTugal.vicky for Vicky's desks, and Indi's fact-checker for Indi's. Only pages that are public and open without a login are listed. A storyline with nothing behind it yet says \"no source yet\".","",
"**Connections** (from 5 November, at Dinis's direction): stories that link startups and companies at Web Summit so each gets the most out of the week: startups in the same field, startups and the investors or programmes that back that field, companies on the same stage or day, Portuguese startups and the European ones they could work with. They are marked \"Connections\" in the beat. Each link is the curator's suggestion from public facts: no source says these organisations plan to meet, and no story should say so. Organisations only; nothing private about anyone.","","Last updated: "+NOW+".","",
"## At a glance","","| Id | Title | Beat | Added |","|---|---|---|---|"]
for s in stories: out.append(f"| {s[0]} | {s[1]}{' (published '+PUBLISHED[s[0]][1]+')' if s[0] in PUBLISHED else ''} | {s[2]} | {s[4]} |")
out.append("")
for sid,title,beat,angle,added,note in stories:
    out+= [f"## {sid}: {title}","",f"{beat}, added {added}. {angle}" + (f" {note}" if note else "") + (f" Published on {PUBLISHED[sid][1]} 2026: {PUBLISHED[sid][0]}. Not to be written again." if sid in PUBLISHED else ""),"","Sources:",""]
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
READY=["S31"]  # ids of connection storylines ready to write now; empty unless one is listed here (check first with the duplicate check below)
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
ASSIGN=[("S31","the Portugal desk (journalist-portugal)","where the 78 Road 2 Web Summit startups come from, city by city and what they build; the source is Portugal Startup News' account of Startup Portugal's selection, not a Web Summit page, so re-read it and Startup Portugal's own page the same day; descriptions are not checked; do not give a city for Humanos until its country is checked")]
out+=["## Assignments by desk: order and readiness","","For the five journalists, in priority order (standing answers 20 and 22, the desk review of 8 November). Each was checked against the articles and drafts at this run.","","Ready to write now:",""]
for k,(sid,desk,cond) in enumerate(ASSIGN,1):
    out.append(f"{k}. {sid}, {[s[1] for s in allst if s[0]==sid][0]}: for {desk}. {cond[0].upper()+cond[1:]}.")
out+=["","Already published, not to be written again: "+"; ".join(f"{k} ({v[0]})" for k,v in PUBLISHED.items())+".","","No assignment this run: the summit desk (the pitch times are not captured yet) and the Europe desk (its two requests to the researcher are still open); the AI and connections desks have nothing new that is ready. Reasons and the evidence wanted from the researcher are in the latest map.","","Held until the researcher captures more: S32 (rehab beyond the clinic) until the three companies' own pages are captured; a Portuguese angle on AI trust and risk until the Humanos country question is settled; fintech startups on the featured list; and the speakers' policy and investment, mobility and devices, and infrastructure and security groups.",""]
out+=["## Dropped","","Taken off the list on 6 November 2026, at Vicky's word, as duplicates of other candidates:","",]
for s in allst:
    if s[0] in DROPPED: out.append(f"- {s[0]}: {s[1]} ({DROPPED[s[0]]})")
out.append("")
s="\n".join(out)
assert not re.search('\u2014',s), [m.start() for m in re.finditer('[\u2014\u2013]',s)]
assert not re.search(r'@[\w-]+\.\w+\.md',s)
assert set(re.findall(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)+',s))<={"curator@web-summit.vicky","curator@PrompTugal.vicky","reviewer@PrompTugal.vicky"}
open(N+"README.md","w").write(s)
print(s[-900:])