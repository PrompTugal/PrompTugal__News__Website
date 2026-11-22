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
.src{font-size:12px;color:var(--mut);margin:6px 16px}.src a{color:var(--mut)}
@media(max-width:560px){main{grid-template-columns:1fr 96px}#pres{width:90px;height:105px}.big{font-size:48px}.bar span.l{width:90px}.cmp{grid-template-columns:1fr}}
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
<script>
const SB=JSON.parse(document.getElementById('sb').textContent),B=SB.beats,decs=SB.decisions||(SB.decision?[SB.decision]:[]);
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
 else if(k=='compare'){const c=el('div','cmp');[v.left,v.right].forEach((s,j)=>{const d=el('div');d.append(el('h3','',s.title));const u=el('ul');u.style.paddingLeft='18px';s.points.forEach(p=>u.append(el('li','',p)));d.append(u);c.append(d);setTimeout(()=>d.style.opacity=1,500*j+80)});st.append(c)}
 else if(k=='image'){const im=el('img');im.src=v.url;im.alt=v.alt||'';im.style.maxWidth='100%';st.append(im,el('div','lab',v.credit||''))}
 else st.append(el('div','lab',v.note||'(a visual the player cannot draw yet)'))}
function decision(st,d,n){st.append(el('h2','',d.question));d.options.forEach(o=>{const c=el('div','opt'+(o.id==d.recommendation?' rec':''));c.append(el('b','',o.label+(o.id==d.recommendation?'  (recommended)':'')));
 (o.good||[]).forEach(t=>c.append(el('div','g','+ '+t)));(o.bad||[]).forEach(t=>c.append(el('div','b','− '+t)));(o.blocks||[]).forEach(t=>c.append(el('div','b','Holds up: '+t)));
 const bt=el('button','',o.id==d.recommendation?'Choose this (recommended)':'Choose this');bt.onclick=()=>{try{localStorage.setItem('studio:'+SB.slug+':'+n,o.id+'@'+new Date().toISOString())}catch(e){}document.dispatchEvent(new CustomEvent('studio-answer',{detail:{slug:SB.slug,q:n,option:o.id,at:new Date().toISOString()}}));bt.textContent='Recorded in this browser: '+o.label};c.append(bt);st.append(c)});
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
