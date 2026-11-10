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
PUBLISHED={"S41":("https://promptugal.news/articles/red-wind-warning-lisbon-wednesday.html","10 Nov"),"S37":("https://promptugal.news/articles/teamworks-coaches-agent.html","10 Nov"),"S38":("https://promptugal.news/articles/glovo-restaurant-agents-getvocal.html","10 Nov"),"S39":("https://promptugal.news/articles/wpp-call-transcripts-to-jira.html","10 Nov"),"S40":("https://promptugal.news/articles/gravitee-agent-security-survey.html","10 Nov"),"S28":("https://promptugal.news/articles/five-ai-builders-to-know.html","8 Nov"),"S29":("https://promptugal.news/articles/who-builds-the-parts-of-an-ai-agent.html","8 Nov"),"S30":("https://promptugal.news/articles/health-startups-by-problem.html","8 Nov"),"S31":("https://promptugal.news/articles/road-2-web-summit-beyond-lisbon.html","9 Nov"),"S33":("https://promptugal.news/articles/ibm-sports-tech-challenge.html","9 Nov"),"S34":("https://promptugal.news/articles/where-to-find-portugal.html","9 Nov"),"S35":("https://promptugal.news/articles/press-conferences-day-by-day.html","9 Nov"),"S36":("https://promptugal.news/articles/portugal-on-the-programme.html","9 Nov")}  # id -> (article URL, date); set when an article or draft covers it
DRAFTED={"S44":"drafted, awaiting review","S42":"drafted by journalist-ai, 10 Nov, awaiting review"}  # id -> state; set when a draft exists
DROPPED={"S14":"duplicates","S21":"duplicates","S23":"duplicates"}
import subprocess
NOW=subprocess.check_output(["date","-u","+%A %-d %B %Y, %H:%M UTC"],text=True).strip()
EXTRA_SRC={"x-ws-terms":("Web Summit","Terms and conditions","https://websummit.com/terms-and-conditions/","2026-11-10 22:20"),"x-ws-event-update-refunds":("Web Summit","Important event update","https://websummit.com/blog/web-summit/important-event-update-2026/","2026-11-10 22:00"),"x-ws-event-update":("Web Summit","Important event update","https://websummit.com/blog/web-summit/important-event-update-2026/","2026-11-10 22:00"),"x-gov-alert":("Government of Portugal","Governo declara situacao de alerta em todo o territorio continental","https://portugal.gov.pt/gc25/comunicacao/noticias/governo-declara-situacao-de-alerta-em-todo-o-territorio-continental-1","2026-11-10 17:10"),"x-ipma-red-districts":("IPMA (Portugal's weather and sea institute)","Weather warnings by district, open data (red wind, eight mainland districts)","https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json","2026-11-10 17:12"),"x-ipma-warnings":("IPMA (Portugal's weather and sea institute)","Weather warnings by district, open data (Lisbon district LSB)","https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json","2026-11-10 13:45"),"x-ipma-forecast":("IPMA (Portugal's weather and sea institute)","Daily forecast for Lisbon, 10 to 14 November, open data","https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json","2026-11-10 13:45"),"x-lovable-blog":("Lovable","How we built Lovable, and why we keep rebuilding it","https://lovable.dev/blog/how-we-built-lovable-and-why-we-keep-rebuilding-it","2026-11-10 14:30"),"x-websummit-future-of-ai":("Web Summit","The future of AI (Centre Stage, 9 Nov 18:55)","https://websummit.com/sessions/lis26/391103b5-871a-4a6a-9763-4c3c2b588610/the-future-of-ai/","2026-11-09 05:07"),"page-newsletter":("PrompTugal.news","The daily newsletter","https://promptugal.news/newsletter/index.html","2026-11-07 19:50"),"page-venue-map":("PrompTugal.news","The venue map","https://promptugal.news/summit/venue/index.html","2026-11-07 19:50"),"note-the-sign-in":("PrompTugal.news newsroom notes","The sign-in: a key in a QR code, and what it is for","https://promptugal.news/newsroom/notes/2026-11-06-the-sign-in/index.html","2026-11-07 11:55")}
stories=[ # id, title, beat, angle, added, note
("S45","Web Summit's cancelled Day 2: what is known about refunds","The summit","Web Summit's post says it will contact those impacted and does not mention refunds, credits or compensation; its published terms set out cancellation, postponement and events beyond its control. A plain account of what is published and what is not announced.","10 Nov","STORM-10NOV, for journalist (summit desk). Time-sensitive. Quote the terms, do not interpret; consumer pages to be read by the journalist."),
("S44","Update: Web Summit's Wednesday will not take place; it aims to hold Thursday","The summit","An update note for the published Wednesday 11 November guide, from Web Summit's own statement: Day 2 will not take place on the Government's formal advice; it aims to proceed with Day 3 on Thursday as planned.","10 Nov","STORM-10NOV, for journalist (summit desk). An update, not a new article. Time-sensitive."),
("S43","Wednesday's alert: what the government has closed across Portugal","The summit","The government's situation of alert for all mainland Portugal on Wed 11 Nov: schools and non-essential public services closed, outdoor events suspended, parks and waterfront off limits where risk is high; IPMA red wind in eight districts.","10 Nov","STORM-10NOV, for journalist (summit desk). Time-sensitive. Do not infer anything about Web Summit's venue."),
("S42","What Lovable deleted: its CEO on rebuilding an AI coding agent","AI and robotics","A first-hand engineering account from Lovable's CEO (4 Nov), who spoke at the night session on 9 Nov: almost all agent code deleted, knowledge files instead of fine-tuning, sandboxes that fork a whole running computer.","10 Nov","MANUAL-10NOV, for journalist-ai. Company's own account; attribute every figure."),
("S41","Red wind warning for Lisbon on Wednesday: what it means for Web Summit","The summit","IPMA's red wind warning for Lisbon district, Wednesday 11 Nov 12:00 to 21:00, with orange rain and sea warnings; what is known and what Web Summit has yet to decide.","10 Nov","MANUAL-10NOV, for journalist (summit desk). Time-sensitive. Web Summit's decision is not confirmed: read it at the source."),
("S40","AI agents are spreading faster than their security, Gravitee's survey finds","The summit","Gravitee's vendor survey of 900+ finds adoption ahead of control; its CEO gives a press conference at the summit today at 14:30.","10 Nov","OVERNIGHT-10NOV, for journalist (summit desk). Time-sensitive."),
("S39","How WPP turns call transcripts into reviewed Jira plans","Connections: the summit","A design story in Mastra's account: transcripts to reviewed plans, with client isolation in the integration layer, in internal production at WPP.","10 Nov","OVERNIGHT-10NOV, for journalist-connections. Mastra is on the featured list; WPP's participation is not confirmed."),
("S38","Glovo's restaurant partners meet 80 AI agents on WhatsApp, GetVocal says","Connections: the summit","How a delivery platform runs restaurant-partner operations through WhatsApp agents, in GetVocal's account.","10 Nov","OVERNIGHT-10NOV, for journalist-connections. GetVocal AI is on the featured list; Glovo's participation is not confirmed."),
("S37","What failed when Teamworks built an AI assistant for NFL coaches","AI and robotics","An honest build story in Mastra's account: what failed in a routing agent with seven specialists and what was changed.","10 Nov","OVERNIGHT-10NOV, for journalist-ai."),
("S36","Portugal on the programme: a masterclass, a meetup and three announcements","Portugal","What to plan around for Portugal's startup scene: Startup Portugal's masterclass, the founders-in-Portugal meetup and three press conferences, with the Portugal Stand as base.","9 Nov","For journalist-portugal. Links S34 and S35."),
("S35","Web Summit's press conferences, day by day: what is announced and when","The summit","The week's press conferences on Stage 2, day by day, with times, titles and speakers by role; the agenda lists 24.","9 Nov","For journalist (summit desk). Time-sensitive: the first is Tuesday 10 November at 10:30."),
("S34","Where to find Portugal at Web Summit: Pavilion 1, stand E145","Portugal","The Portugal Stand is in Pavilion 1, stand E145, at the entrance, with AICEP's teams there all four days: a short practical guide for Portuguese founders, investors and visitors.","9 Nov","For journalist-portugal. One source: AICEP's own page."),
("S33","Sports tech at Web Summit: IBM's startup challenge ends in Lisbon","The summit","IBM's year-long challenge for startups building AI-powered products for sports ends in Lisbon: a showcase on 10 November and an invitation-only prize challenge on 11 November.","9 Nov","For the summit desk (journalist). Time-sensitive: the showcase is on 10 November."),
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
for s in stories: out.append(f"| {s[0]} | {s[1]}{' (published '+PUBLISHED[s[0]][1]+')' if s[0] in PUBLISHED else (' ('+DRAFTED[s[0]]+')' if s[0] in DRAFTED else '')} | {s[2]} | {s[4]} |")
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
READY=["S43","S45"]  # ids of connection storylines ready to write now; empty unless one is listed here (check first with the duplicate check below)
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
ASSIGN=[("S40","the summit desk (journalist), OVERNIGHT-10NOV","Gravitee's vendor survey and its press conference today at 14:30; read the report's method yourself; say nothing about what the CEO will say; link S35"),("S37","the AI desk (journalist-ai), OVERNIGHT-10NOV","Teamworks's AI assistant for coaches, in Mastra's account only; not in production; no source of the customer's own"),("S38","the connections desk (journalist-connections), OVERNIGHT-10NOV","Glovo's WhatsApp agents in GetVocal's account; every figure is GetVocal's claim; GetVocal AI is on the featured list, Glovo's participation is not confirmed, never imply it"),("S39","the connections desk (journalist-connections), OVERNIGHT-10NOV","WPP's transcript-to-Jira workflow in Mastra's account; no usage figures exist, invent none; Mastra is on the featured list, WPP's participation is not confirmed, never imply it")]
out+=["## Assignments by desk: order and readiness","","For the five journalists, in priority order (standing answers 20 and 22, the desk review of 8 November). Each was checked against the articles and drafts at this run.","","Ready to write now:",""]
for k,(sid,desk,cond) in enumerate(ASSIGN,1):
    out.append(f"{k}. {sid}, {[s[1] for s in allst if s[0]==sid][0]}: for {desk}. {cond[0].upper()+cond[1:]}.")
out+=["","Already published, not to be written again: "+"; ".join(f"{k} ({v[0]})" for k,v in PUBLISHED.items())+".","","Already drafted, not to be written again: "+("; ".join(f"{k} ({v})" for k,v in DRAFTED.items()) or "none")+".","","No assignment this run: the Europe and Portugal desks (not part of the overnight batch). Not commissioned from the researcher's candidates: Terrapinn (no outcome figures, one vendor source) and the Klarna backup (a 2024 press release, current position unchecked, not a Web Summit participant); the gaps are in the latest map.","","Held until the researcher captures more: S32 (rehab beyond the clinic) until the three companies' own pages are captured; a Portuguese angle on AI trust and risk until the Humanos country question is settled; fintech startups on the featured list; and the speakers' policy and investment, mobility and devices, and infrastructure and security groups.",""]
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