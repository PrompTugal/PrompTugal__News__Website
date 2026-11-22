// page.mjs: draws org-chart.html (animated org chart, circles, decision matrix) from org-chart.json and decisions.json.
// A script, no model. holacracy.d@AgentiCCells.dinis. usage: node board/team/holacracy.d/tools/page.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const chart = JSON.parse(fs.readFileSync(path.join(dir, 'org-chart.json'), 'utf8'))
const dec = JSON.parse(fs.readFileSync(path.join(dir, 'decisions.json'), 'utf8'))
const data = JSON.stringify({ chart, dec }).replace(/</g, '\\u003c')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Org chart and decisions</title>
<style>
:root{--bg:#0f1420;--panel:#171e2e;--ink:#e8ecf4;--mute:#9aa6bd;--line:#2a3550;--acc:#6ea8fe;--ok:#4cc38a;--warn:#f0b34a;--rev:#b794f6;--idle:#7d8aa5;--work:#5aa2ff;--bad:#ef6b73}
@media (prefers-color-scheme:light){:root:not([data-theme=dark]){--bg:#f5f7fb;--panel:#fff;--ink:#16203a;--mute:#5b6784;--line:#d5dbe8;--acc:#2a62d6;--ok:#168a58;--warn:#b57400;--rev:#7b4fd0;--idle:#6b7692;--work:#2a62d6;--bad:#c33d46}}
:root[data-theme=light]{--bg:#f5f7fb;--panel:#fff;--ink:#16203a;--mute:#5b6784;--line:#d5dbe8;--acc:#2a62d6;--ok:#168a58;--warn:#b57400;--rev:#7b4fd0;--idle:#6b7692;--work:#2a62d6;--bad:#c33d46}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
header{padding:20px 16px 8px;max-width:1200px;margin:auto}h1{margin:0 0 4px;font-size:22px}.sub{color:var(--mute);font-size:14px;max-width:70ch}
nav{display:flex;gap:8px;max-width:1200px;margin:12px auto 0;padding:0 16px;flex-wrap:wrap}
nav button,.btn{background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:8px 16px;font:inherit;cursor:pointer}
nav button[aria-selected=true],.btn.on{background:var(--acc);color:#fff;border-color:var(--acc)}
main{max-width:1200px;margin:12px auto 40px;padding:0 16px}
.stats{display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 12px}.stat{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 14px;min-width:110px}.stat b{font-size:22px;display:block}.stat span{color:var(--mute);font-size:12px}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px}@media(max-width:900px){.grid{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px}
.legend{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--mute);margin-bottom:8px}.legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px}
svg text{fill:var(--ink);font-size:12px}svg .m{fill:var(--mute);font-size:10.5px}
.edge{fill:none;stroke:var(--line);stroke-width:1.6;stroke-dasharray:4 5;animation:flow 2.2s linear infinite}@keyframes flow{to{stroke-dashoffset:-18}}
.node{cursor:pointer;opacity:0;animation:pop .5s ease forwards}@keyframes pop{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
.pulse{animation:pulse 1.8s ease-out infinite;transform-box:fill-box;transform-origin:center}@keyframes pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.3);opacity:0}}
.node:hover circle.d,.node.sel circle.d{stroke-width:3.5}
.det h3{margin:0 0 4px;font-size:16px}.det dl{margin:8px 0 0;font-size:13px}.det dt{color:var(--mute);margin-top:8px}.det dd{margin:0}
.det a{color:var(--acc)}.pill{display:inline-block;border-radius:999px;padding:2px 10px;font-size:12px;color:#fff}
.circles{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.circ{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;animation:pop .5s ease both}.circ h4{margin:0 0 2px}.circ p{margin:2px 0 8px;color:var(--mute);font-size:12.5px}
.chip{display:inline-flex;gap:6px;align-items:center;border:1px solid var(--line);border-radius:999px;padding:3px 10px;margin:3px 4px 0 0;font-size:12.5px;cursor:pointer;background:var(--bg)}.chip i{width:9px;height:9px;border-radius:50%}
.bnote{border:1px dashed var(--line);border-radius:12px;padding:12px;margin-top:14px;color:var(--mute);font-size:13px}
.dl{display:grid;grid-template-columns:240px minmax(0,1fr);gap:14px}@media(max-width:900px){.dl{grid-template-columns:1fr}}
.dlist button{display:block;width:100%;text-align:left;background:var(--panel);border:1px solid var(--line);color:var(--ink);border-radius:10px;padding:8px 10px;margin-bottom:6px;cursor:pointer;font:inherit;font-size:13.5px}
.dlist button[aria-current=true]{border-color:var(--acc);box-shadow:0 0 0 2px color-mix(in srgb,var(--acc) 35%,transparent)}.dlist .ok{color:var(--ok)}
.opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-top:10px}
.opt{background:var(--bg);border:2px solid var(--line);border-radius:14px;padding:12px;animation:rise .45s ease both;cursor:pointer;text-align:left;color:var(--ink);font:inherit}
.opt:nth-child(2){animation-delay:.12s}.opt:nth-child(3){animation-delay:.24s}@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.opt.rec{border-color:var(--ok)}.opt.pick{background:color-mix(in srgb,var(--acc) 16%,var(--bg));border-color:var(--acc)}
.opt h5{margin:0 0 6px;font-size:14.5px}.opt .g{color:var(--ok);font-size:13px}.opt .b{color:var(--bad);font-size:13px}.opt .f{color:var(--mute);font-size:12.5px;margin-top:6px}
.tag{font-size:11px;border-radius:999px;padding:1px 8px;margin-left:6px;color:#fff;background:var(--ok)}.tag.p{background:var(--acc)}
.row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}textarea{width:100%;min-height:90px;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:8px;font:12.5px/1.4 ui-monospace,monospace}
.bar{height:6px;background:var(--line);border-radius:6px;overflow:hidden;margin:6px 0 10px}.bar i{display:block;height:100%;background:var(--acc);transition:width .4s}
.matrix{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:14px;display:block;overflow-x:auto}.matrix th,.matrix td{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}.matrix td.pk{background:color-mix(in srgb,var(--acc) 18%,transparent)}.matrix td.rc{box-shadow:inset 0 0 0 2px var(--ok)}
@media(prefers-reduced-motion:reduce){*{animation:none!important}.node,.circ,.opt{opacity:1!important}}
</style></head><body>
<header><h1>The agents of account D, and what is waiting for you</h1>
<div class="sub">Drawn by holacracy.d from the governance record (org-chart.json, <span id="gen"></span>) by a script. Account D is seen, account B is reported, not seen. The central circle's roles are helm.d's proposals, not yet ratified.</div></header>
<nav role="tablist"><button role="tab" aria-selected="true" data-t="tree">Who started whom</button><button role="tab" aria-selected="false" data-t="circles">Circles</button><button role="tab" aria-selected="false" data-t="dec">Decisions</button><button class="btn" id="theme" style="margin-left:auto">Light / dark</button></nav>
<main>
<section id="tree"><div class="stats" id="stats"></div>
<div class="grid"><div class="card"><div class="legend" id="legend"></div><div id="svgwrap"></div></div><aside class="card det" id="det"><h3>Click an agent</h3><div class="sub">Purpose, domains, repository, state and cost appear here.</div></aside></div>
<div class="bnote" id="bnote"></div></section>
<section id="circles" hidden><div class="circles" id="circgrid"></div></section>
<section id="dec" hidden><div class="dl"><div class="dlist card"><div class="bar"><i id="prog"></i></div><div id="plist"></div><div class="row"><button class="btn" id="play">Play the tour</button></div></div>
<div class="card" id="dmain"></div></div>
<div class="card" style="margin-top:14px"><b>All decisions at a glance</b> <span class="sub">(your pick is shaded, the recommendation has a green frame)</span><div id="mx"></div>
<div class="row"><button class="btn" id="copy">Copy my picks</button><span class="sub">Paste them to holacracy.d in its session: a pick here is only a note until you say it there.</span></div><textarea id="out" readonly></textarea></div></section>
</main>
<script id="data" type="application/json">${data}</script>
<script>
(function(){
var D=JSON.parse(document.getElementById('data').textContent),C=D.chart,A=C.agents_account_d,DEC=D.dec.decisions;
var $=function(i){return document.getElementById(i)},NS='http://www.w3.org/2000/svg';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
$('gen').textContent=C.generated;
function st(a){var s=(a.state||'').toLowerCase();if(/blocked|needs input|waiting/.test(s))return 'blocked';if(/review/.test(s))return 'review';if(/working/.test(s))return 'working';if(/completed/.test(s))return 'done';return 'idle'}
var COL={blocked:'var(--warn)',review:'var(--rev)',working:'var(--work)',done:'var(--ok)',idle:'var(--idle)'},LBL={blocked:'waiting on Dinis',review:'review ready',working:'working',done:'completed',idle:'idle'};
var CIRC={};function cc(c){var k=(c||'').replace(/ \\(.*$/,'');return k}
var pal=['#e07a5f','#3d9be9','#81b29a','#f2cc8f','#b794f6','#4cc3c3','#e56b9b','#9aa6bd'],ci=0;
A.forEach(function(a){var k=cc(a.circle);if(!(k in CIRC))CIRC[k]=pal[ci++%pal.length];a._c=k});
// stats
var cnt={};A.forEach(function(a){var s=st(a);cnt[s]=(cnt[s]||0)+1});
var cost=A.reduce(function(t,a){return t+(a.cost||0)},0);
$('stats').innerHTML=[['agents',A.length],['waiting on Dinis',cnt.blocked||0],['working',cnt.working||0],['circles',Object.keys(CIRC).length],['spend seen (stale)','$'+cost.toFixed(0)]].map(function(x){return '<div class="stat"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>'}).join('');
$('legend').innerHTML=Object.keys(LBL).map(function(k){return '<span><i style="background:'+COL[k]+'"></i>'+LBL[k]+'</span>'}).join('')+'<span>ring colour = circle</span>';
// tree layout (left to right)
var by={};A.forEach(function(a){by[a.id]=a;a.kids=[]});A.forEach(function(a){if(a.parent&&by[a.parent])by[a.parent].kids.push(a)});
var root=A.filter(function(a){return !a.parent})[0],y=14,STEP=30,XS=[40,330,620];
function lay(n,d){n.d=d;n.x=XS[Math.min(d,2)];if(!n.kids.length){n.y=y;y+=STEP}else{n.kids.forEach(function(k){lay(k,d+1)});n.y=(n.kids[0].y+n.kids[n.kids.length-1].y)/2}}
lay(root,0);var H=y+20,W=900;
var svg='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Org chart of account D, by who started whom">';
A.forEach(function(n){n.kids.forEach(function(k){var mx=(n.x+k.x)/2;svg+='<path class="edge" d="M'+(n.x+12)+','+(n.y+10)+' C'+mx+','+(n.y+10)+' '+mx+','+(k.y+10)+' '+(k.x-12)+','+(k.y+10)+'"/>'});});
var i=0;A.forEach(function(n){var s=st(n);i++;
svg+='<g transform="translate('+n.x+','+(n.y+10)+')"><g class="node" data-id="'+esc(n.id)+'" style="animation-delay:'+(i*45)+'ms">'+(s==='working'?'<circle class="pulse" r="9" fill="'+COL[s]+'"/>':'')+(s==='blocked'?'<circle class="pulse" r="9" fill="'+COL[s]+'" style="animation-duration:2.6s"/>':'')+'<circle class="d" r="9" fill="'+COL[s]+'" stroke="'+CIRC[n._c]+'" stroke-width="2.5"/><text x="16" y="-1">'+esc(n.id)+'</text><text class="m" x="16" y="11">'+esc(n.cost!=null?'$'+n.cost.toFixed(2)+' ':'')+esc(n._c)+'</text></g></g>'});
svg+='</svg>';$('svgwrap').innerHTML=svg;
function det(id){var a=by[id];if(!a)return;var s=st(a);document.querySelectorAll('.node').forEach(function(g){g.classList.toggle('sel',g.getAttribute('data-id')===id)});
var h='<h3>'+esc(a.name)+'</h3><span class="pill" style="background:'+COL[s]+'">'+LBL[s]+'</span><dl>';
function row(k,v){if(v)h+='<dt>'+k+'</dt><dd>'+v+'</dd>'}
row('Circle',esc(a.circle));row('Started by',esc(a.parent||'Dinis, through maestro.d'));row('Purpose',esc(a.purpose));row('Domains',esc(a.domains));row('Accountabilities',esc(a.accountabilities));row('Overlap',esc(a.overlap));row('Twin',esc(a.twin));row('Repository',esc(a.repo));row('Model',esc(a.model)+(a.configured&&a.configured!==a.model?' (configured '+esc(a.configured)+')':''));row('Cost',a.cost!=null?'$'+a.cost.toFixed(2)+(a.cost_seen?' (as of '+esc(a.cost_seen)+')':''):'not fetched');row('State',esc(a.state)+(a.state_seen?' (as of '+esc(a.state_seen)+')':''));row('Wake',esc(a.wake));
row('Written by',esc(a.written_by));row('Session',a.session?'<a href="'+esc(a.session)+'" target="_blank" rel="noopener">open session</a>':'');
$('det').innerHTML=h+'</dl>'}
$('svgwrap').addEventListener('click',function(e){var g=e.target.closest('.node');if(g)det(g.getAttribute('data-id'))});
// account B
var B=C.account_b,bt='<b>Account B: reported, not seen.</b> '+esc(B.state)+'. ';
Object.keys(B.tree).forEach(function(m){bt+='<br>'+esc(m)+': '+B.tree[m].conductors.map(esc).join('; ')+'. Dormant: '+esc(B.tree[m].dormant)+'.'});
$('bnote').innerHTML=bt+'<br>Source: '+esc(B.status);
// circles view
var cg='';Object.keys(CIRC).forEach(function(k,n){var m=A.filter(function(a){return a._c===k});var meta=(C.circles.filter(function(c){return c.name.indexOf(k)===0||c.id===k})[0])||{};
cg+='<div class="circ" style="border-top:4px solid '+CIRC[k]+';animation-delay:'+(n*80)+'ms"><h4>'+esc(k)+'</h4><p>Lead: '+esc(meta.lead||'(not written)')+'<br>Purpose: '+esc(meta.purpose||'(not written)')+'</p>'+m.map(function(a){return '<span class="chip" data-id="'+esc(a.id)+'"><i style="background:'+COL[st(a)]+'"></i>'+esc(a.id)+'</span>'}).join('')+'</div>'});
$('circgrid').innerHTML=cg;$('circgrid').addEventListener('click',function(e){var c=e.target.closest('.chip');if(c){tab('tree');det(c.getAttribute('data-id'));document.getElementById('det').scrollIntoView({behavior:'smooth',block:'nearest'})}});
// tabs
function tab(t){['tree','circles','dec'].forEach(function(x){$(x).hidden=x!==t});document.querySelectorAll('nav [role=tab]').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-t')===t)})}
document.querySelectorAll('nav [role=tab]').forEach(function(b){b.onclick=function(){tab(b.getAttribute('data-t'))}});
$('theme').onclick=function(){var r=document.documentElement;r.setAttribute('data-theme',r.getAttribute('data-theme')==='light'?'dark':'light')};
// decisions
var picks={},cur=0,timer=null;try{picks=JSON.parse(localStorage.getItem('holacracy-picks')||'{}')}catch(e){}
function save(){try{localStorage.setItem('holacracy-picks',JSON.stringify(picks))}catch(e){}}
function plist(){$('plist').innerHTML=DEC.map(function(d,i){return '<button data-i="'+i+'" '+(i===cur?'aria-current="true"':'')+'>'+d.id+' '+esc(d.title)+(picks[d.id]?' <span class="ok">&#10003; '+esc(picks[d.id])+'</span>':'')+'</button>'}).join('');$('prog').style.width=(Object.keys(picks).length/DEC.length*100)+'%'}
var still=false;function show(){var d=DEC[cur];$('dmain').innerHTML='<h3 style="margin:0">'+d.id+'. '+esc(d.title)+'</h3><div class="sub">'+esc(d.tension)+'</div><div class="sub">Source: '+esc(d.source)+'</div><div class="opts">'+d.options.map(function(o){return '<button class="opt'+(d.rec.indexOf(o.k)>=0?' rec':'')+(picks[d.id]===o.k?' pick':'')+'" data-k="'+o.k+'"><h5>'+o.k+'. '+esc(o.label)+(d.rec.indexOf(o.k)>=0?'<span class="tag">recommended</span>':'')+(picks[d.id]===o.k?'<span class="tag p">your pick</span>':'')+'</h5><div class="g">+ '+esc(o.good)+'</div><div class="b">- '+esc(o.bad)+'</div><div class="f">If chosen: '+esc(o.follows)+'</div></button>'}).join('')+'</div><div class="row"><button class="btn" id="prev">Back</button><button class="btn" id="next">Next</button><button class="btn" id="clear">Clear my pick</button></div>';
$('prev').onclick=function(){go(cur-1)};$('next').onclick=function(){go(cur+1)};$('clear').onclick=function(){delete picks[d.id];save();render()};if(still){document.querySelectorAll('.opt').forEach(function(x){x.style.animation='none'});still=false}plist();matrix()}
function go(i){cur=(i+DEC.length)%DEC.length;show()}
function matrix(){var h='<table class="matrix"><tr><th>Decision</th><th>A</th><th>B</th><th>C</th></tr>';DEC.forEach(function(d){h+='<tr><td><b>'+d.id+'</b> '+esc(d.title)+'</td>';['A','B','C'].forEach(function(k){var o=d.options.filter(function(x){return x.k===k})[0];h+=o?'<td class="'+(picks[d.id]===k?'pk ':'')+(d.rec.indexOf(k)>=0?'rc':'')+'">'+esc(o.label)+'</td>':'<td></td>'});h+='</tr>'});$('mx').innerHTML=h+'</table>';
var t='Picks for holacracy.d (notes only, my word is only what I say in your session):\\n';DEC.forEach(function(d){t+=d.id+' '+d.title+': '+(picks[d.id]?picks[d.id]+' ('+d.options.filter(function(o){return o.k===picks[d.id]})[0].label+')':'no pick')+'\\n'});$('out').value=t}
function render(){show()}
$('dmain').addEventListener('click',function(e){var o=e.target.closest('.opt');if(o){var d=DEC[cur];picks[d.id]=o.getAttribute('data-k');save();still=true;show()}});
$('plist').addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)go(+b.getAttribute('data-i'))});
$('play').onclick=function(){if(timer){clearInterval(timer);timer=null;this.textContent='Play the tour';return}this.textContent='Stop the tour';cur=0;show();timer=setInterval(function(){if(cur>=DEC.length-1){clearInterval(timer);timer=null;$('play').textContent='Play the tour';return}go(cur+1)},7000)};
$('copy').onclick=function(){var t=$('out');t.select();try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand('copy')}};
render();
})();
</script></body></html>`
fs.writeFileSync(path.join(dir, 'org-chart.html'), html)
console.log('org-chart.html written,', html.length, 'bytes')
