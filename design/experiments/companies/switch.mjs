// Round 2 of the companies experiments: ONE page, all 120 companies, with a working switch between the three views
// (Grid by field, Directory by country, Search first) and a live filter. Self-contained HTML, no dependency, no request to another host.
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/companies/switch.mjs [--out DIR]   -> DIR/switch.html and switch--<phone|desktop>--<grid|directory|search>.png
// Public data only (data/companies/<id>/company.json). The view and the filter live in the URL hash, so a view can be linked.
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
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-companies-switch')
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.join(root, p)).href
const FIELD = { security: 'Security', 'ai-agents': 'AI agents', devtools: 'Developer tools', other: 'Other', grc: 'Risk and compliance', 'portugal-startup': 'Portugal startups', platform: 'Platforms', investor: 'Investors' }
const cos = fs.readdirSync(path.join(root, 'data/companies')).map(id => {
    const f = path.join(root, 'data/companies', id, 'company.json'); if (!fs.existsSync(f)) return null
    const d = JSON.parse(fs.readFileSync(f, 'utf8'))
    const t = (d.what || '').split(/(?<=[.;:])\s/)[0].replace(/[:;,]$/, '')
    return { id, n: d.name, w: t.length > 130 ? t.slice(0, 127).replace(/\s+\S*$/, '') + '…' : t, f: d.category || 'other', c: d.country || 'Unknown', a: d.attending_as || '' }
}).filter(Boolean).sort((a, b) => a.n.localeCompare(b.n))
// the site's tokens are inlined, so the page works from a vault or any folder, not only from this checkout (designer@'s round-3 note)
const TOK = fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Companies: three views, one page</title>
<style>${TOK}

*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)} .wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0} .bar b{font:700 20px var(--serif)}
h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 4px} .lede{color:var(--ink-2);margin:0 0 12px}
.ctl{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:12px 0;position:sticky;top:0;background:var(--paper);padding:8px 0;z-index:2;border-bottom:1px solid var(--hair)}
.seg{display:flex;border:1px solid var(--ink);border-radius:3px;overflow:hidden} .seg button{font:600 14px var(--sans);padding:8px 14px;border:0;background:var(--panel);color:var(--ink);cursor:pointer;min-height:40px} .seg button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
input{flex:1;min-width:180px;font:16px var(--sans);padding:8px 12px;border:2px solid var(--ink);border-radius:3px;background:var(--panel);color:var(--ink);min-height:40px}
select{font:15px var(--sans);padding:8px;min-height:40px;border:1px solid var(--rule-2);background:var(--panel);color:var(--ink)}
.cnt{font:12px var(--mono);color:var(--ink-3)} h2{font:600 21px var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:24px 0 10px;display:flex;justify-content:space-between} h2 small{font:12px var(--mono);color:var(--ink-3)}
.mono{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:3px;font:600 12px var(--mono);color:var(--paper);background:var(--m);flex:none}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px} .card{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:12px;display:flex;gap:10px} .card h3,li h3{font:600 17px/1.2 var(--serif);margin:0} .card p,li p{margin:2px 0 0;font-size:14px;color:var(--ink-2)} .m{font:11px var(--mono);color:var(--ink-3)}
table{width:100%;border-collapse:collapse} td{padding:8px 6px;border-bottom:1px solid var(--hair);vertical-align:top;font-size:15px} td.n{font:600 16px var(--serif);white-space:nowrap}
ol{list-style:none;padding:0;margin:0} li{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--hair)} .empty{padding:24px 0;color:var(--ink-3)}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px} @media(max-width:600px){td.f{display:none}}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b></div><h1>Companies at Web Summit Lisbon</h1><p class=lede>One list, three ways to read it. The default is By field; the view you pick is remembered in this browser only (nothing is sent), and it is in the address so you can share it.</p>
<div class=ctl role=group aria-label="Companies controls"><div class=seg id=seg><button data-v=grid>By field</button><button data-v=directory>By country</button><button data-v=search>Search first</button></div>
<input id=q type=search placeholder="Search name or what they do" aria-label="Search companies"><select id=fs aria-label="Field"></select><span class=cnt id=cnt></span></div>
<main id=out></main><p class=note>Experiment, not on the site. Data: data/companies/ (public facts; each company's page has its sources). Logos will load from a vault; the monogram is a placeholder.</p></div>
<script>
const D=${JSON.stringify(cos)},F=${JSON.stringify(FIELD)};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const acc=n=>['var(--ink)','var(--brand-red)','var(--brand-green)'][[...n].reduce((h,ch)=>(h*31+ch.charCodeAt(0))%3,0)],mono=c=>'<span class=mono style="--m:'+acc(c.n)+'" aria-hidden=true>'+esc(c.n.replace(/[^A-Za-z0-9]/g,'').slice(0,2))+'</span>';
const fields=[...new Set(D.map(c=>c.f))].sort((a,b)=>D.filter(c=>c.f===b).length-D.filter(c=>c.f===a).length);
$('#fs').innerHTML='<option value="">All fields</option>'+fields.map(f=>'<option value="'+f+'">'+(F[f]||f)+' ('+D.filter(c=>c.f===f).length+')</option>').join('');
const st={v:'grid',q:'',f:''};
function read(){const p=new URLSearchParams(location.hash.slice(1));let sv='';try{sv=localStorage.getItem('pt-companies-view')||''}catch(e){}const V=['grid','directory','search'];st.v=V.includes(p.get('v'))?p.get('v'):(V.includes(sv)?sv:'grid');st.q=p.get('q')||'';st.f=p.get('f')||'';$('#q').value=st.q;$('#fs').value=st.f}
function write(){try{localStorage.setItem('pt-companies-view',st.v)}catch(e){}const p=new URLSearchParams();p.set('v',st.v);if(st.q)p.set('q',st.q);if(st.f)p.set('f',st.f);history.replaceState(null,'','#'+p)}
const grp=(a,k)=>a.reduce((m,c)=>((m[k(c)]??=[]).push(c),m),{});
function render(){
 let l=D.filter(c=>(!st.f||c.f===st.f)&&(!st.q||(c.n+' '+c.w).toLowerCase().includes(st.q.toLowerCase())));
 if(st.v==='search'&&st.q){const q=st.q.toLowerCase();l=l.sort((a,b)=>(b.n.toLowerCase().includes(q)-a.n.toLowerCase().includes(q))||a.n.localeCompare(b.n))}
 $('#cnt').textContent=l.length+' of '+D.length;
 document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.v));
 let h='';
 if(!l.length)h='<p class=empty>No company matches. Clear the search or pick All fields.</p>';
 else if(st.v==='grid')h=Object.entries(grp(l,c=>c.f)).sort((a,b)=>b[1].length-a[1].length).map(([k,v])=>'<h2>'+(F[k]||k)+'<small>'+v.length+'</small></h2><div class=grid>'+v.map(c=>'<div class=card>'+mono(c)+'<div><h3>'+esc(c.n)+'</h3><p>'+esc(c.w)+'</p><span class=m>'+esc(c.c)+(c.a?' · '+esc(c.a):'')+'</span></div></div>').join('')+'</div>').join('');
 else if(st.v==='directory')h=Object.entries(grp(l,c=>c.c)).sort((a,b)=>b[1].length-a[1].length).map(([k,v])=>'<h2>'+esc(k)+'<small>'+v.length+'</small></h2><table>'+v.map(c=>'<tr><td class=n>'+esc(c.n)+'</td><td>'+esc(c.w)+'</td><td class="f m">'+(F[c.f]||c.f)+'</td></tr>').join('')+'</table>').join('');
 else h='<ol>'+l.map(c=>'<li>'+mono(c)+'<div><h3>'+esc(c.n)+' <span class=m>'+esc(c.c)+' · '+(F[c.f]||c.f)+'</span></h3><p>'+esc(c.w)+'</p></div></li>').join('')+'</ol>';
 $('#out').innerHTML=h}
document.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>{st.v=b.dataset.v;write();render()});
$('#q').oninput=e=>{st.q=e.target.value;write();render()};$('#fs').onchange=e=>{st.f=e.target.value;write();render()};
addEventListener('hashchange',()=>{read();render()});read();render();
</script>`
const f = path.join(OUT, 'switch.html'); fs.writeFileSync(f, html)
const browser = await chromium.launch()
const sizes = { phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } }
let ok = true
for (const [s, vp] of Object.entries(sizes)) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage()
    const errs = []; p.on('pageerror', e => errs.push(String(e)))
    await p.goto(pathToFileURL(f).href + '#v=grid'); await p.waitForTimeout(300)
    for (const v of ['grid', 'directory', 'search']) {
        await p.click(`#seg button[data-v=${v}]`)
        if (v === 'search') await p.fill('#q', 'identity')
        await p.waitForTimeout(150)
        const n = await p.textContent('#cnt'); console.log(s, v, n, p.url().split('#')[1])
        await p.screenshot({ path: path.join(OUT, `switch--${s}--${v}.png`) })
    }
    if (errs.length) { ok = false; console.log('ERRORS', errs) }
    await ctx.close()
}
await browser.close(); console.log(ok ? 'no page errors' : 'page errors')
