<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>__TITLE__</title>
<style>
:root{--bg:#f6f8fa;--card:#fff;--fg:#1c2733;--mut:#5b6b7a;--line:#d3dbe3;--acc:#0b6e4f;--accb:#e3f4ec;--warn:#9a4d00;--warnb:#fff1e0;--bar:#2f6fb0}
@media (prefers-color-scheme:dark){:root{--bg:#0e151b;--card:#16212a;--fg:#e8eef4;--mut:#9fb0bf;--line:#2a3a47;--acc:#5fd3a6;--accb:#12332a;--warn:#ffb066;--warnb:#3a2a14;--bar:#6fb0f0}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;min-height:100dvh;display:flex;flex-direction:column}
header{padding:12px 16px 4px}h1{font-size:18px;margin:0}header p{margin:2px 0 0;color:var(--mut);font-size:13px}
main{flex:1;display:grid;grid-template-columns:1fr 150px;gap:12px;padding:8px 16px;align-items:start}
#stage{background:var(--card);border:1px solid var(--line);border-radius:14px;min-height:300px;padding:18px;overflow:hidden}
aside{position:sticky;top:8px;text-align:center}
#pres{width:130px;height:150px}#pres .mouth{transition:d .08s}
.tag{font-size:11px;color:var(--mut)}
#subs{margin:8px 16px;padding:10px 14px;background:var(--card);border:1px solid var(--line);border-radius:12px;font-size:17px;min-height:3.2em}
nav{display:flex;gap:8px;align-items:center;padding:6px 16px calc(12px + env(safe-area-inset-bottom))}
button{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:10px;padding:10px 14px;min-width:46px;cursor:pointer}
button.p{background:var(--acc);color:var(--bg);border-color:var(--acc);font-weight:700}
nav{flex-wrap:wrap}#dots{display:flex;gap:8px;flex:1 1 100%;order:-1;justify-content:center;flex-wrap:wrap;padding-bottom:4px}#dots i{width:12px;height:12px;border-radius:50%;background:var(--line);cursor:pointer;display:block}#dots i.on{background:var(--acc);transform:scale(1.3)}#dots i.done{background:var(--mut)}
.big{font-size:64px;font-weight:800;color:var(--acc);line-height:1}.lab{color:var(--mut);margin-top:8px}
.bar{display:flex;align-items:center;gap:8px;margin:10px 0}.bar span.l{width:130px;font-size:14px}.bar div{height:22px;background:var(--bar);border-radius:5px;width:0;transition:width .9s}.bar b{font-size:14px}
.fl{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.nd{padding:8px 12px;border:1.5px solid var(--acc);background:var(--accb);border-radius:9px;font-weight:600;opacity:0;transform:translateY(6px);transition:all .4s}.ar{opacity:0;transition:opacity .4s;color:var(--mut);font-size:12px}
.show{opacity:1!important;transform:none!important}
ul.rv{list-style:none;padding:0;margin:0}ul.rv li{padding:10px 12px;margin:8px 0;border:1px solid var(--line);border-radius:10px;opacity:0;transform:translateX(-8px);transition:all .4s}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:12px}.cmp>div{border:1px solid var(--line);border-radius:10px;padding:12px;opacity:0;transition:opacity .5s}.cmp h3{margin:0 0 6px;font-size:15px}
.opt{border:1.5px solid var(--line);border-radius:12px;padding:12px;margin:10px 0}.opt.rec{border-color:var(--acc);background:var(--accb)}.opt .g{color:var(--acc);font-size:14px}.opt .b{color:var(--warn);font-size:14px}.opt button{margin-top:8px}
.jr{display:grid;grid-template-columns:minmax(220px,360px) minmax(260px,420px);justify-content:center;gap:18px;align-items:start}.jsvg{width:100%;height:auto;max-height:70vh;display:block}.jbox{border:1.5px dashed var(--line);border-radius:10px;padding:10px;margin:6px 0;min-height:70px}.jsh{margin:6px 0;color:var(--acc);font-weight:600;font-size:14px}.wk{animation:bob 1s ease-in-out infinite alternate}@keyframes bob{to{transform:translateY(-3px)}}.fl2{animation:drop .9s ease-in both}@keyframes drop{from{transform:translateY(-40px);opacity:0}}@media(max-width:560px){.jr{grid-template-columns:1fr}.jsvg{max-width:340px;margin:0 auto}}
.src{font-size:12px;color:var(--mut);margin:6px 16px}.src a{color:var(--mut)}
@media(max-width:560px){#subs{order:-1;font-size:15px;margin:4px 16px}header{order:-2}main{grid-template-columns:1fr 96px}#pres{width:90px;height:105px}.big{font-size:48px}.bar span.l{width:90px}.cmp{grid-template-columns:1fr}}
</style></head><body>
<header><h1 id="ttl"></h1><p id="aud"></p></header>
<main><section id="stage" aria-live="polite"></section>
<aside><svg id="pres" viewBox="0 0 130 150" role="img" aria-label="Synthetic presenter">
<circle cx="65" cy="62" r="46" fill="#f2c14e" stroke="#7a5a10" stroke-width="3"/><circle cx="48" cy="52" r="6" fill="#222"/><circle cx="82" cy="52" r="6" fill="#222"/>
<path class="mouth" id="mouth" d="M46 80 Q65 90 84 80" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
<rect x="30" y="112" width="70" height="34" rx="12" fill="#2f6fb0"/></svg>
<div class="tag">Synthetic presenter<br>(not a real person)</div></aside></main>
<div id="subs" aria-live="polite"></div>
<nav><button id="back" aria-label="Back">&#9664;</button><button id="play" class="p" aria-label="Play">&#9654; Play</button><button id="fwd" aria-label="Forward">&#9654;&#9654;</button><div id="dots"></div><button id="voice" aria-pressed="false" title="Read aloud with this device's voice">Voice off</button></nav>
<div class="src" id="src"></div>
<script id="sb" type="application/json">__JSON__</script>
<script id="svgs" type="application/json">__SVGS__</script>
<script>
const SVGS=JSON.parse(document.getElementById('svgs').textContent),SB=JSON.parse(document.getElementById('sb').textContent),B=SB.beats,decs=SB.decisions||(SB.decision?[SB.decision]:[]);
const $=id=>document.getElementById(id),el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.textContent=h;return e};
$('ttl').textContent=SB.title;$('aud').textContent='For: '+SB.audience+' · asked by '+SB.requested_by;
const total=B.length+decs.length;let i=0,playing=false,voice=false,timer=null,mt=null;
const dots=$('dots');for(let k=0;k<total;k++){const d=el('i');d.onclick=()=>go(k);dots.append(d)}
const srcMap=Object.fromEntries((SB.sources||[]).map(s=>[s.id,s]));
function show(k){i=k;[...dots.children].forEach((d,j)=>d.className=j==k?'on':j<k?'done':'');const st=$('stage');st.innerHTML='';
 if(k<B.length){const b=B[k];$('subs').textContent=b.narration;draw(st,b.visual);
  $('src').innerHTML='Sources: '+(b.facts||[]).map(f=>srcMap[f]?`<a href="${srcMap[f].url}" target="_blank" rel="noopener">${srcMap[f].title} (read ${srcMap[f].read})</a>`:'').join(' · ');
 }else{const d=decs[k-B.length];$('subs').textContent=d.question;decision(st,d,k-B.length);$('src').textContent='The recommendation is the default. Your answer here is recorded in this browser only; it is not a signed instruction.'}
 $('back').disabled=k==0;$('fwd').disabled=k==total-1;speak(k)}
function draw(st,v){const k=v.kind;
 if(k=='title'){st.append(el('div','big',v.text||''));st.lastChild.style.fontSize='34px'}
 else if(k=='stat'){st.append(el('div','big',v.value),el('div','lab',v.label))}
 else if(k=='bars'){const m=Math.max(...v.items.map(x=>x.value));v.items.forEach(x=>{const r=el('div','bar');r.append(el('span','l',x.label));const d=el('div');r.append(d,el('b','',x.value.toLocaleString('en-GB')+(v.unit&&v.unit!='count'?' '+v.unit:'')));st.append(r);setTimeout(()=>d.style.width=(x.value/m*70)+'%',60)})}
 else if(k=='list'){const u=el('ul','rv');v.items.forEach((t,j)=>{const li=el('li','',t);u.append(li);setTimeout(()=>li.classList.add('show'),250*j+80)});st.append(u)}
 else if(k=='flow'){const f=el('div','fl');const lab=Object.fromEntries(v.nodes.map(n=>[n.id,n.label]));let n=0;
  const seen=new Set();const add=id=>{if(seen.has(id))return;seen.add(id);const d=el('div','nd',lab[id]||id);f.append(d);setTimeout(()=>d.classList.add('show'),400*n++)};
  (v.edges||[]).forEach(e=>{add(e.from);const a=el('span','ar','→ '+(e.label||''));f.append(a);setTimeout(()=>a.classList.add('show'),400*n++);add(e.to)});v.nodes.forEach(x=>add(x.id));st.append(f)}

 else if(k=='journey'){journey(st,v)}
 else if(k=='timeline'){const u=el('ul','rv');v.items.forEach((t,j)=>{const li=el('li');li.append(el('b','',t.when+': '),document.createTextNode(t.what));u.append(li);setTimeout(()=>li.classList.add('show'),400*j+80)});st.append(u)}
 else if(k=='compare'){const c=el('div','cmp');[v.left,v.right].forEach((s,j)=>{const d=el('div');d.append(el('h3','',s.title));const u=el('ul');u.style.paddingLeft='18px';s.points.forEach(p=>u.append(el('li','',p)));d.append(u);c.append(d);setTimeout(()=>d.style.opacity=1,500*j+80)});st.append(c)}
 else if(k=='svg'||(k=='image'&&v.seek!=null&&SVGS[v.src||v.url])){const t=SVGS[v.src||v.url];if(!t){st.append(el('div','lab','(SVG not inlined: '+(v.src||v.url)+')'));return}const h=el('div');h.innerHTML=t;const sv=h.querySelector('svg');if(sv){sv.style.width='100%';sv.style.height='auto';st.append(h);const at=v.at!=null?v.at:(v.seek||0);try{sv.pauseAnimations();sv.setCurrentTime(at);if(v.play){setTimeout(()=>{try{sv.unpauseAnimations();setTimeout(()=>sv.pauseAnimations(),v.play*1000)}catch(e){}},400)}}catch(e){}}if(v.caption)st.append(el('div','lab',v.caption))}
 else if(k=='image'){const im=el('img');im.src=v.url;im.alt=v.alt||'';im.style.maxWidth='100%';st.append(im,el('div','lab',v.credit||''))}
 else st.append(el('div','lab',v.note||'(a visual the player cannot draw yet)'))}

const STOPS=[['base-camp','⛺','Base camp'],['trail','🥾','Trail'],['fork','🔀','Fork'],['fog','🌫️','Fog'],['cliff','🧗','Cliff'],['ravine','🕳️','Ravine'],['bridge','🌉','Bridge'],['rope','🪢','Rope'],['hut','🛖','Hut'],['summit','🏔️','Summit']];
function journey(st,v){const w=v.walkers||{},wrap=el('div','jr'),NS='http://www.w3.org/2000/svg';
 const idx=Math.max(0,STOPS.findIndex(x=>x[0]==v.stop)),stop=STOPS[idx][0];
 const mkSvg=(W,H,label)=>{const sv=document.createElementNS(NS,'svg');sv.setAttribute('viewBox','0 0 '+W+' '+H);sv.setAttribute('class','jsvg');sv.setAttribute('role','img');sv.setAttribute('aria-label',label);
  sv.mk=(t,a,x,par)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;(par||sv).append(e);return e};return sv};
 // the path, left
 const W=260,H=390,svg=mkSvg(W,H,'The path up the mountain; the walkers are at the '+STOPS[idx][2]),mk=svg.mk;
 mk('path',{d:'M0 390 L70 190 L110 240 L170 70 L260 200 L260 390Z',fill:'var(--line)',opacity:.45});
 const pos=i=>({x:60+(i%2?64:0)+(i%3)*10,y:360-i*34});
 let d='';STOPS.forEach((_,i)=>{const q=pos(i);d+=(i?' L':'M')+q.x+' '+q.y});mk('path',{d,fill:'none',stroke:'var(--mut)','stroke-width':2.5,'stroke-dasharray':'5 5'});
 STOPS.forEach((x,i)=>{const q=pos(i);mk('text',{x:q.x,y:q.y+7,'text-anchor':'middle','font-size':i==idx?28:17,opacity:i==idx?1:.4},x[1])});
 const lab=(x,y,t,c)=>{const g=mk('g',{});mk('rect',{x:x-2,y:y-13,width:t.length*7.4+8,height:18,rx:5,fill:'var(--card)',stroke:c,'stroke-width':1.5},null,g);mk('text',{x:x+2,y:y,'font-size':13,'font-weight':700,fill:c},t,g)};
 const cur=pos(idx),n=Math.min(24,w.here!=null?w.here:0);
 for(let i=0;i<n;i++){const g=mk('g',{class:'wk',style:'animation-delay:'+(i*60)+'ms'}),x=cur.x-52+(i%9)*12,y=cur.y+22+Math.floor(i/9)*22;mk('circle',{cx:x,cy:y,r:3.6,fill:'var(--acc)'},null,g);mk('path',{d:`M${x} ${y+3.6}v7M${x-5} ${y+6}h10M${x} ${y+10.6}l-3.5 5M${x} ${y+10.6}l3.5 5`,stroke:'var(--acc)','stroke-width':1.8,'stroke-linecap':'round',fill:'none'},null,g)}
 const f=Math.min(24,w.fell||0),rav=pos(5);
 for(let i=0;i<f;i++){mk('circle',{cx:rav.x-60+(i%8)*9,cy:rav.y+62+Math.floor(i/8)*10,r:3.8,fill:'var(--warn)',class:'fl2',style:'animation-delay:'+(i*90)+'ms'})}
 if(w.fell)lab(rav.x-60,rav.y+104,w.fell+' fell','var(--warn)');
 if(w.through)lab(pos(9).x-50,pos(9).y-18,w.through+' through','var(--acc)');
 // the site, right: a wireframe that changes with the stop
 const SW=300,SH=330,ws=mkSvg(SW,SH,'A wireframe of the site at this stop: '+((v.site&&v.site.shows)||'')),m=ws.mk;
 m('rect',{x:2,y:2,width:SW-4,height:SH-4,rx:10,fill:'var(--card)',stroke:'var(--line)','stroke-width':2});
 m('rect',{x:2,y:2,width:SW-4,height:26,rx:10,fill:'var(--line)'});[16,30,44].forEach(x=>m('circle',{cx:x,cy:15,r:4,fill:'var(--mut)'}));m('rect',{x:62,y:8,width:150,height:14,rx:7,fill:'var(--bg)'});
 m('rect',{x:12,y:38,width:SW-24,height:26,rx:5,fill:'var(--accb)',stroke:'var(--line)'});[20,70,120].forEach(x=>m('rect',{x:x+4,y:46,width:36,height:10,rx:3,fill:'var(--mut)',opacity:.5}));
 const shows=(v.site&&v.site.shows)||'',ctrl=/tell the team/i.test(shows)&&['bridge','rope','hut','summit'].includes(stop);
 const wr=(t,x,y,w,fs,fill)=>{const words=t.split(' ');let line='',ls=[];words.forEach(q=>{if((line+' '+q).trim().length>w){ls.push(line);line=q}else line=(line+' '+q).trim()});ls.push(line);ls.slice(0,4).forEach((l,i)=>m('text',{x,y:y+i*(fs+3),'text-anchor':'middle','font-size':fs,fill},l))};
 if(ctrl){m('rect',{x:SW-124,y:41,width:104,height:20,rx:10,fill:stop=='bridge'?'none':'var(--acc)',stroke:'var(--acc)','stroke-width':2,'stroke-dasharray':stop=='bridge'?'4 3':'0'});m('text',{x:SW-72,y:55,'text-anchor':'middle','font-size':12,'font-weight':700,fill:stop=='bridge'?'var(--acc)':'var(--bg)'},'Tell the team')}
 m('rect',{x:12,y:76,width:SW-24,height:/galaxy/i.test(shows)?150:70,rx:6,fill:'var(--bg)',stroke:'var(--line)'});if(/galaxy/i.test(shows)){let r=7;const rnd=()=>(r=(r*9301+49297)%233280)/233280;for(let i=0;i<70;i++){const hi=i==17&&/highlight/i.test(shows);m('circle',{cx:24+rnd()*(SW-48),cy:88+rnd()*126,r:hi?6:2.2+rnd()*2,fill:hi?'var(--warn)':'var(--bar)',opacity:hi?1:.75})}}else{m('rect',{x:24,y:90,width:150,height:12,rx:3,fill:'var(--mut)',opacity:.6});m('rect',{x:24,y:110,width:210,height:8,rx:3,fill:'var(--mut)',opacity:.35});m('rect',{x:24,y:126,width:180,height:8,rx:3,fill:'var(--mut)',opacity:.35})}
 (/galaxy/i.test(shows)?[]:[12,160]).forEach(x=>{m('rect',{x:x,y:158,width:128,height:78,rx:6,fill:'var(--bg)',stroke:'var(--line)'});m('rect',{x:x+10,y:170,width:80,height:10,rx:3,fill:'var(--mut)',opacity:.5});m('rect',{x:x+10,y:188,width:100,height:7,rx:3,fill:'var(--mut)',opacity:.3})});
 if(stop=='fog'){m('rect',{x:2,y:30,width:SW-4,height:SH-34,fill:'var(--card)',opacity:.72});m('text',{x:SW/2,y:130,'text-anchor':'middle','font-size':38},'🌫️');wr(shows,SW/2,170,30,14,'var(--fg)')}
 if(stop=='ravine'){m('rect',{x:30,y:240,width:240,height:62,rx:8,fill:'var(--fg)',opacity:.88});wr(shows,SW/2,262,34,12,'var(--bg)')}
 if(stop=='bridge'){m('text',{x:SW/2,y:268,'text-anchor':'middle','font-size':12,fill:'var(--acc)','font-weight':700},'Sketch: a proposal, not built')}
 if(stop=='cliff'){m('path',{d:'M0 300 L300 300 L300 262 L190 262 L190 330',fill:'none'});m('rect',{x:200,y:246,width:90,height:56,rx:6,fill:'var(--warnb)',stroke:'var(--warn)','stroke-width':2});wr('a step too high',245,270,14,11,'var(--warn)')}
 if(stop=='hut'){m('rect',{x:30,y:246,width:SW-60,height:44,rx:8,fill:'var(--accb)',stroke:'var(--acc)','stroke-width':2});wr(/tell the team/i.test(shows)?'Received. Here is who has it.':shows,SW/2,266,34,12,'var(--acc)')}
 if(stop=='summit'){[110,140,170].forEach((x,i)=>m('circle',{cx:x,cy:272,r:10,fill:['var(--acc)','var(--bar)','var(--warn)'][i]}));m('text',{x:SW/2,y:306,'text-anchor':'middle','font-size':12,fill:'var(--mut)'},'The owner, the lead agent and the Sherpa, on one rope')}
 const sm=el('div','jsite');sm.append(ws);const inside=['fog','ravine'].includes(stop)||(stop=='hut'&&!/tell the team/i.test(shows));if(!inside)sm.append(el('div','lab',shows));
 if(v.sherpa)sm.append(el('div','jsh','Sherpa: '+v.sherpa));
 sm.append(el('div','tag','Walkers '+(w.here!=null?w.here:'?')+' of '+(w.start!=null?w.start:'?')+(w.fell?', fell '+w.fell:'')+(w.through?', through '+w.through:'')+' · '+(w.basis=='measured'?'measured'+(w.source?' ('+(srcMap[w.source]?srcMap[w.source].title:w.source)+')':''):'ILLUSTRATIVE, not measured')+' · synthetic characters · wireframe, not the real page'));
 wrap.append(svg,sm);st.append(wrap)}
function decision(st,d,n){st.append(el('h2','',d.question));
 if(d.answer){const a=el('div','opt rec');a.append(el('b','','Answered'+(d.answer.at?' ('+d.answer.at+(d.answer.where?', '+d.answer.where:'')+')':'')+': '+((d.options.find(o=>o.id==d.answer.option)||{}).label||d.answer.option)));if(d.answer.words)a.append(el('div','lab','Dinis, verbatim: \u201c'+d.answer.words+'\u201d'));st.append(a)}d.options.forEach(o=>{const c=el('div','opt'+(o.id==d.recommendation?' rec':''));c.append(el('b','',o.label+(o.id==d.recommendation?'  (recommended)':'')));
 (o.good||[]).forEach(t=>c.append(el('div','g','+ '+t)));(o.bad||[]).forEach(t=>c.append(el('div','b','− '+t)));(o.blocks||[]).forEach(t=>c.append(el('div','b','Holds up: '+t)));
 const bt=el('button','',o.id==d.recommendation?'Choose this (recommended)':'Choose this');if(d.answer){bt.style.display='none'}bt.onclick=()=>{try{localStorage.setItem('studio:'+SB.slug+':'+n,o.id+'@'+new Date().toISOString())}catch(e){}document.dispatchEvent(new CustomEvent('studio-answer',{detail:{slug:SB.slug,q:n,option:o.id,at:new Date().toISOString()}}));bt.textContent='Recorded in this browser: '+o.label};c.append(bt);st.append(c)});
 if(d.why)st.append(el('p','lab','Why: '+d.why))}
const words=s=>s.split(/\s+/).filter(Boolean).length;
function talk(ms){clearInterval(mt);const m=$('mouth');let o=0;mt=setInterval(()=>{o^=1;m.setAttribute('d',o?'M46 78 Q65 100 84 78':'M46 80 Q65 88 84 80')},140);setTimeout(()=>{clearInterval(mt);m.setAttribute('d','M46 80 Q65 90 84 80')},ms)}
function speak(k){clearTimeout(timer);speechSynthesis&&speechSynthesis.cancel();const txt=$('subs').textContent;const ms=Math.max(2500,words(txt)/2.5*1000);
 if(!playing){return}
 talk(ms);if(voice&&window.SpeechSynthesisUtterance){const u=new SpeechSynthesisUtterance(txt);u.lang='en-GB';u.onend=()=>next(k);speechSynthesis.speak(u);timer=setTimeout(()=>next(k),ms+8000)}
 else timer=setTimeout(()=>next(k),ms+800)}
function next(k){if(!playing||k!==i)return;if(k<B.length)show(k+1);else setPlay(false)}
function go(k){show(Math.max(0,Math.min(total-1,k)))}
function setPlay(p){playing=p;$('play').innerHTML=p?'&#10073;&#10073; Pause':'&#9654; Play';if(p)speak(i);else{clearTimeout(timer);clearInterval(mt);speechSynthesis&&speechSynthesis.cancel()}}
$('back').onclick=()=>go(i-1);$('fwd').onclick=()=>go(i+1);$('play').onclick=()=>setPlay(!playing);
$('voice').onclick=()=>{voice=!voice;$('voice').textContent=voice?'Voice on':'Voice off';$('voice').setAttribute('aria-pressed',voice)};
addEventListener('keydown',e=>{if(e.key=='ArrowRight')go(i+1);if(e.key=='ArrowLeft')go(i-1);if(e.key==' '){e.preventDefault();setPlay(!playing)}});
show(0);
</script></body></html>
