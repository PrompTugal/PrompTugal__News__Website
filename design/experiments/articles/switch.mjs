// Round 3 of the articles experiments: ONE page, every published article, a working switch between three views
// (By day, The wire, By topic) with a topic filter and search. Self-contained: the site's tokens are inlined, the images
// are embedded as relative paths (copy design/infographics/out/<slug>--paper--card.png beside it) or fall back to the title.
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/articles/switch.mjs [--out DIR]   -> DIR/switch.html, DIR/img/<slug>.png, DIR/switch--<phone|desktop>--<view>.png
// Bylines follow synthetic@'s F35 rule: the author agent's name, "an AI agent", and who it was for.
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
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-articles-switch')
fs.mkdirSync(path.join(OUT, 'img'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const arts = fs.readdirSync(path.join(root, 'content/articles')).filter(f => f.endsWith('.md')).map(f => {
    const fm = fs.readFileSync(path.join(root, 'content/articles', f), 'utf8').split('---')[1] || ''
    const get = k => { const m = fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')); return m ? m[1].replace(/^"|"$/g, '').trim() : '' }
    const slug = f.replace(/\.md$/, '')
    const m = get('author').match(/^([a-z0-9.-]+@[A-Za-z.-]+)(?:,\s*(?:for\s+([^,]+)|round[^,]*))?/)
    const src = path.join(root, `design/infographics/out/${slug}--paper--card.png`)
    if (get('status') !== 'published' || !fs.existsSync(src)) return null
    fs.copyFileSync(src, path.join(OUT, 'img', slug + '.png'))
    return { s: slug, t: get('title'), d: get('date'), sum: get('summary'), b: (get('beat') || 'News').replace(/\s*\(.*$/, ''), g: get('tags').split(',').map(x => x.trim()).filter(Boolean), by: (m ? m[1] : get('author')) + ', an AI agent' + (m && m[2] ? ', for ' + m[2] : '') }
}).filter(Boolean).sort((a, b) => b.d.localeCompare(a.d) || a.t.localeCompare(b.t))
const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Everything we have published: three views, one page</title>
<style>${TOK}
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans,system-ui)} .wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0} .bar b{font:700 20px var(--serif)} h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 4px} .lede{color:var(--ink-2);margin:0 0 12px}
.ctl{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:12px 0;position:sticky;top:0;background:var(--paper);padding:8px 0;z-index:2;border-bottom:1px solid var(--hair)}
.seg{display:flex;border:1px solid var(--ink);border-radius:3px;overflow:hidden} .seg button{font:600 14px var(--sans);padding:8px 14px;border:0;background:var(--panel);color:var(--ink);cursor:pointer;min-height:40px} .seg button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
input{flex:1;min-width:160px;font:16px var(--sans);padding:8px 12px;border:2px solid var(--ink);border-radius:3px;background:var(--panel);color:var(--ink);min-height:40px} select{font:15px var(--sans);padding:8px;min-height:40px;border:1px solid var(--rule-2);background:var(--panel);color:var(--ink)}
.cnt,.m{font:12px var(--mono);color:var(--ink-3)} .tag{font:11px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--brand)}
h2{font:600 21px var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:24px 0 10px;display:flex;justify-content:space-between} h2 small{font:12px var(--mono);color:var(--ink-3)}
h3{font:600 18px/1.2 var(--serif);margin:3px 0} p{margin:0} img{display:block;width:100%;height:auto;background:var(--paper-2)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px} .card{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:10px} .card p.s,.row p.s{font-size:14px;color:var(--ink-2)}
.row{display:grid;grid-template-columns:70px 1fr;gap:14px;padding:14px 0;border-bottom:1px solid var(--hair)} .row.w{grid-template-columns:70px 110px 1fr}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px} .it{padding:10px 0;border-bottom:1px solid var(--hair)} .it h3{font-size:16px}
.empty{padding:24px 0;color:var(--ink-3)} .note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px} @media(max-width:600px){.row.w{grid-template-columns:64px 1fr}.row.w .im{display:none}}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b></div><h1>Everything we have published</h1>
<p class=lede>One list, three ways to read it. The default is By day; the view you pick is remembered in this browser only (nothing is sent) and is in the address so you can share it.</p>
<div class=ctl role=group aria-label="Articles controls"><div class=seg id=seg><button data-v=day>By day</button><button data-v=wire>The wire</button><button data-v=topic>By topic</button></div>
<input id=q type=search placeholder="Search title or summary" aria-label="Search articles"><select id=tg aria-label="Topic"></select><span class=cnt id=cnt></span></div>
<main id=out></main><p class=note>Experiment, not on the site. Articles and images from content/articles/ and design/infographics/out/. Day grouping is thin today: it fills as the summit days arrive.</p></div>
<script>
const D=${JSON.stringify(arts)};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dek=(s,n)=>s.length>n?s.slice(0,n-1).replace(/\\s+\\S*$/,'')+'…':s;
const day=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
const tc={};D.forEach(a=>a.g.forEach(t=>tc[t]=(tc[t]||0)+1));const tags=Object.keys(tc).sort((a,b)=>tc[b]-tc[a]||a.localeCompare(b));
$('#tg').innerHTML='<option value="">All topics</option>'+tags.map(t=>'<option>'+esc(t)+'</option>').join('');
const st={v:'day',q:'',g:''},V=['day','wire','topic'];
function read(){const p=new URLSearchParams(location.hash.slice(1));let sv='';try{sv=localStorage.getItem('pt-articles-view')||''}catch(e){}st.v=V.includes(p.get('v'))?p.get('v'):(V.includes(sv)?sv:'day');st.q=p.get('q')||'';st.g=p.get('g')||'';$('#q').value=st.q;$('#tg').value=st.g}
function write(){try{localStorage.setItem('pt-articles-view',st.v)}catch(e){}const p=new URLSearchParams();p.set('v',st.v);if(st.q)p.set('q',st.q);if(st.g)p.set('g',st.g);history.replaceState(null,'','#'+p)}
const img=a=>'<img loading=lazy src="img/'+a.s+'.png" alt="">',by=a=>'<p class=m>'+esc(a.by)+'</p>';
const card=a=>'<div class=card>'+img(a)+'<span class=tag>'+esc(a.b)+'</span><h3>'+esc(a.t)+'</h3><p class=s>'+esc(dek(a.sum,120))+'</p>'+by(a)+'</div>';
function render(){
 const q=st.q.toLowerCase();const l=D.filter(a=>(!st.g||a.g.includes(st.g))&&(!q||(a.t+' '+a.sum).toLowerCase().includes(q)));
 $('#cnt').textContent=l.length+' of '+D.length;document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.v));let h='';
 if(!l.length)h='<p class=empty>No article matches. Clear the search or pick All topics.</p>';
 else if(st.v==='day')h=[...new Set(l.map(a=>a.d))].map(d=>{const x=l.filter(a=>a.d===d);return '<h2>'+day(d)+'<small>'+x.length+' article'+(x.length>1?'s':'')+'</small></h2><div class=grid>'+x.map(card).join('')+'</div>'}).join('');
 else if(st.v==='wire')h=l.map(a=>'<div class="row w"><span class=m>'+a.d.slice(5)+'</span><span class=im>'+img(a)+'</span><div><span class=tag>'+esc(a.b)+'</span><h3>'+esc(a.t)+'</h3><p class=s>'+esc(dek(a.sum,150))+'</p>'+by(a)+'</div></div>').join('');
 else{const g={};l.forEach(a=>a.g.filter(t=>!/^the summit$/i.test(t)).forEach(t=>(g[t]??=[]).push(a)));h='<div class=cols>'+Object.entries(g).sort((a,b)=>b[1].length-a[1].length).slice(0,9).map(([t,x])=>'<div><h2>'+esc(t)+'<small>'+x.length+'</small></h2>'+x.map(a=>'<div class=it><h3>'+esc(a.t)+'</h3><p class=m>'+a.d.slice(5)+' · '+esc(a.b)+'</p></div>').join('')+'</div>').join('')+'</div>'}
 $('#out').innerHTML=h}
document.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>{st.v=b.dataset.v;write();render()});
$('#q').oninput=e=>{st.q=e.target.value;write();render()};$('#tg').onchange=e=>{st.g=e.target.value;write();render()};addEventListener('hashchange',()=>{read();render()});read();render();
</script>`
const f = path.join(OUT, 'switch.html'); fs.writeFileSync(f, html)
const browser = await chromium.launch(); let ok = true
for (const [s, vp] of Object.entries({ phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } })) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)))
    await p.goto(pathToFileURL(f).href + '#v=day'); await p.waitForTimeout(300)
    for (const v of ['day', 'wire', 'topic']) {
        await p.click(`#seg button[data-v=${v}]`); await p.waitForTimeout(250)
        console.log(s, v, await p.textContent('#cnt'), p.url().split('#')[1]); await p.screenshot({ path: path.join(OUT, `switch--${s}--${v}.png`) })
    }
    await p.fill('#q', 'robot'); await p.waitForTimeout(100); console.log(s, 'search robot', await p.textContent('#cnt'))
    if (errs.length) { ok = false; console.log('ERRORS', errs) } await ctx.close()
}
await browser.close(); console.log(ok ? 'no page errors' : 'page errors')
