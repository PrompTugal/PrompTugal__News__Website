// Experiments for the people page (pass board/passes/2026-11-06-the-people-page.md), round 1, as ONE page with a working switch:
// By organisation, By session (who is on the same stage: the connection Dinis asked for), A to Z. Live search.
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/people/switch.mjs [--out DIR]   -> DIR/switch.html (+ fonts/) and DIR/switch--<phone|desktop>--<view>.png
// Public, professional data only, as listed by the summit's own programme: name, role, organisation, the session. No photos, no contact details,
// nothing from the team's notes. Self-contained: tokens and the brand's faces travel with the page. The view is kept in this browser only.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out')
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-people')
fs.mkdirSync(OUT, { recursive: true })
fs.cpSync(path.join(root, 'assets/fonts'), path.join(OUT, 'fonts'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const rd = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const evTitle = {}, evWhen = {}
for (const id of fs.readdirSync(path.join(root, 'data/events'))) {
    const f = path.join(root, 'data/events', id, 'event.json'); if (!fs.existsSync(f)) continue
    const e = rd(f); evTitle['event:' + id] = e.title; evWhen['event:' + id] = (e.date || '').slice(5) + ' ' + (e.start || '')
}
const P = fs.readdirSync(path.join(root, 'data/people')).map(id => {
    const f = path.join(root, 'data/people', id, 'person.json'); if (!fs.existsSync(f)) return null
    const d = rd(f)
    const ev = [...new Set((d.listings || []).map(l => l.event).filter(Boolean))].filter(e => evTitle[e]).map(e => [evTitle[e], evWhen[e], e])
    return { n: d.name, r: d.role || '', o: d.organisation || '', e: ev }
}).filter(p => p && p.n).sort((a, b) => a.n.localeCompare(b.n))
const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>People: three views, one page</title>
<style>${TOK}
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)} .wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0} .bar b{font:700 20px var(--serif)} h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 4px} .lede{color:var(--ink-2);margin:0 0 12px;max-width:46em}
.ctl{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:12px 0;position:sticky;top:0;background:var(--paper);padding:8px 0;z-index:2;border-bottom:1px solid var(--hair)}
.seg{display:flex;border:1px solid var(--ink);border-radius:3px;overflow:hidden} .seg button{font:600 14px var(--sans);padding:8px 14px;border:0;background:var(--panel);color:var(--ink);cursor:pointer;min-height:40px} .seg button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
input{flex:1;min-width:180px;font:16px var(--sans);padding:8px 12px;border:2px solid var(--ink);border-radius:3px;background:var(--panel);color:var(--ink);min-height:40px}
.cnt,.m{font:12px var(--mono);color:var(--ink-3)} h2{font:600 21px/1.2 var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:22px 0 10px;display:flex;justify-content:space-between;gap:10px} h2 small{font:12px var(--mono);color:var(--ink-3);white-space:nowrap}
h3{font:600 17px/1.2 var(--serif);margin:0} p{margin:0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px} .card{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:10px 12px} .card p{font-size:14px;color:var(--ink-2)}
.sess{border-top:2px solid var(--rule);padding:8px 0 12px} .sess h3{font-size:19px} .ppl{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px} .pill{border:1px solid var(--rule-2);border-radius:999px;padding:3px 11px;font-size:14px;background:var(--panel)} .pill i{font-style:normal;color:var(--ink-3);font-size:12px}
.az{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0} .az a{font:600 13px var(--mono);padding:3px 8px;border:1px solid var(--rule-2);color:var(--ink);text-decoration:none;background:var(--panel)}
.row{display:grid;grid-template-columns:minmax(150px,1fr) 2fr;gap:14px;padding:9px 0;border-bottom:1px solid var(--hair)} .row p{font-size:14px;color:var(--ink-2)}
.empty{padding:24px 0;color:var(--ink-3)} .note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px} @media(max-width:600px){.row{grid-template-columns:1fr;gap:2px}}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b></div><h1>People at Web Summit Lisbon</h1>
<p class=lede>Names, roles and sessions as the summit's own programme lists them: public and professional only. Three ways in: by organisation, by who shares a stage, or A to Z. The default is By organisation; your choice is remembered in this browser only.</p>
<div class=ctl role=group aria-label="People controls"><div class=seg id=seg><button data-v=org>By organisation</button><button data-v=session>By session</button><button data-v=az>A to Z</button></div>
<input id=q type=search placeholder="Search a name, role, organisation or session" aria-label="Search people"><span class=cnt id=cnt></span></div>
<main id=out></main><p class=note>Experiment, not on the site. Data: data/people/ and data/events/ (each fact has its source on the person's page). No photos and no contact details; a photo would need a free licence and a credit.</p></div>
<script>
const D=${JSON.stringify(P)};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={v:'org',q:''},V=['org','session','az'];
function read(){const p=new URLSearchParams(location.hash.slice(1));let sv='';try{sv=localStorage.getItem('pt-people-view')||''}catch(e){}st.v=V.includes(p.get('v'))?p.get('v'):(V.includes(sv)?sv:'org');st.q=p.get('q')||'';$('#q').value=st.q}
function write(){try{localStorage.setItem('pt-people-view',st.v)}catch(e){}const p=new URLSearchParams();p.set('v',st.v);if(st.q)p.set('q',st.q);history.replaceState(null,'','#'+p)}
const card=p=>'<div class=card><h3>'+esc(p.n)+'</h3><p>'+esc(p.r)+(p.o?', '+esc(p.o):'')+'</p>'+(p.e.length?'<p class=m>'+p.e.length+' session'+(p.e.length>1?'s':'')+'</p>':'')+'</div>';
function render(){
 const q=st.q.toLowerCase();const l=D.filter(p=>!q||(p.n+' '+p.r+' '+p.o+' '+p.e.map(e=>e[0]).join(' ')).toLowerCase().includes(q));
 $('#cnt').textContent=l.length+' of '+D.length;document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.v));let h='';
 if(!l.length)h='<p class=empty>No one matches. Clear the search.</p>';
 else if(st.v==='org'){const g={};l.forEach(p=>(g[p.o||'Organisation not listed']??=[]).push(p));h=Object.entries(g).sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0])).slice(0,40).map(([o,x])=>'<h2>'+esc(o)+'<small>'+x.length+'</small></h2><div class=grid>'+x.map(card).join('')+'</div>').join('')}
 else if(st.v==='session'){const g={};l.forEach(p=>p.e.forEach(e=>(g[e[2]]??={t:e[0],w:e[1],p:[]}).p.push(p)));
  h=Object.values(g).filter(s=>s.p.length>0).sort((a,b)=>b.p.length-a.p.length||a.w.localeCompare(b.w)).slice(0,30).map(s=>'<div class=sess><span class=m>'+esc(s.w)+' · '+s.p.length+' on stage</span><h3>'+esc(s.t)+'</h3><div class=ppl>'+s.p.map(p=>'<span class=pill>'+esc(p.n)+' <i>'+esc(p.o)+'</i></span>').join('')+'</div></div>').join('')||'<p class=empty>No session matches.</p>'}
 else{const ls=[...new Set(l.map(p=>p.n[0].toUpperCase()))];h='<div class=az>'+ls.map(c=>'<a href="#'+c+'" onclick="return false">'+c+'</a>').join('')+'</div>'+l.map(p=>'<div class=row><h3>'+esc(p.n)+'</h3><p>'+esc(p.r)+(p.o?', '+esc(p.o):'')+'</p></div>').join('')}
 $('#out').innerHTML=h}
document.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>{st.v=b.dataset.v;write();render()});
$('#q').oninput=e=>{st.q=e.target.value;write();render()};addEventListener('hashchange',()=>{read();render()});read();render();
</script>`
const f = path.join(OUT, 'switch.html'); fs.writeFileSync(f, html)
const browser = await chromium.launch(); let ok = true
for (const [s, vp] of Object.entries({ phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } })) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)))
    await p.goto(pathToFileURL(f).href + '#v=org'); await p.waitForTimeout(300)
    for (const v of ['org', 'session', 'az']) { await p.click(`#seg button[data-v=${v}]`); await p.waitForTimeout(250); console.log(s, v, await p.textContent('#cnt')); await p.screenshot({ path: path.join(OUT, `switch--${s}--${v}.png`) }) }
    if (errs.length) { ok = false; console.log('ERRORS', errs) } await ctx.close()
}
await browser.close(); console.log(ok ? 'no page errors' : 'page errors', P.length, 'people')
