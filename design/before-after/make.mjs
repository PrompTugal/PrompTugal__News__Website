// The before and after page of a design release (Dinis, 6 November 2026: "a slider that I can slide to the left and see
// before, slide to the right and see after ... buttons below ... or the multiple steps can play out").
// designer@PrompTugal.dinis, session 2.
//
//   node design/before-after/make.mjs <release.json> <out dir>
//
// release.json: { version, title, date, summary, notes: [..], devices: ["phone","desktop"],
//                 steps: [{ id, label, note, img: { phone, desktop } }],   // steps[0] is the "before"
//                 experiments: [{ img, model, style, cost_usd, seconds, verdict, use }] }
// Writes <out>/index.html: one self-contained page (no script or font from another host), image paths relative to it,
// so it works inside the designer's vault and anywhere the folder is copied.
import fs from 'node:fs'
import path from 'node:path'

const [relFile, out] = process.argv.slice(2)
if (!relFile || !out) { console.error('usage: make.mjs <release.json> <out dir>'); process.exit(2) }
const R = JSON.parse(fs.readFileSync(relFile, 'utf8'))
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Before and after ${esc(R.version)}</title>
<style>
:root{--paper:#f6f3ec;--paper-2:#ece7db;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--hair:#d9d2c1;--red:#c52830;--green:#006600;--soft:#e2eedf}
@media (prefers-color-scheme:dark){:root{--paper:#111214;--paper-2:#1a1b1e;--ink:#eceae4;--ink-2:#c3c0b7;--ink-3:#a6a39a;--hair:#2e2f34;--red:#f07278;--green:#6dbb7e;--soft:#16281c}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 Georgia,"Times New Roman",serif}
.w{max-width:1100px;margin:0 auto;padding:24px 16px 64px}
.k{font:600 12px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
h1{font-size:clamp(28px,5vw,42px);line-height:1.1;margin:6px 0 10px}h2{font-size:24px;margin:40px 0 8px;border-top:2px solid var(--ink);padding-top:10px}
.dek{color:var(--ink-2);font-size:18px;max-width:44em}.meta{font:13px system-ui,sans-serif;color:var(--ink-3)}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:16px 0 10px;font:14px system-ui,sans-serif}
button{font:inherit;border:1px solid var(--ink-3);background:transparent;color:var(--ink);border-radius:999px;padding:6px 14px;cursor:pointer}
button[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}button:focus-visible{outline:3px solid #ffbf1f;outline-offset:2px}
.cmp{position:relative;margin:0 auto;border:1px solid var(--hair);background:var(--paper-2);overflow:hidden;user-select:none;touch-action:pan-y;max-width:100%}
.cmp img{display:block;width:100%;height:auto}.cmp .top{position:absolute;inset:0;clip-path:inset(0 0 0 var(--x,50%))}
.cmp .line{position:absolute;top:0;bottom:0;left:var(--x,50%);width:2px;background:var(--red);transform:translateX(-1px)}
.cmp .knob{position:absolute;top:50%;left:var(--x,50%);transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:var(--red);color:#fff;display:grid;place-items:center;font:700 14px system-ui;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.lab{position:absolute;top:8px;font:600 11px system-ui;letter-spacing:.06em;text-transform:uppercase;background:var(--ink);color:var(--paper);padding:3px 7px;border-radius:3px}
.lab.l{left:8px}.lab.r{right:8px;background:var(--green)}
input[type=range]{width:100%;margin:10px 0 0;accent-color:var(--red)}
.note{font-size:17px;color:var(--ink-2);min-height:3em;margin:8px 0 0}
.phone .cmp{max-width:390px}
ul.notes li{margin:4px 0}
table{border-collapse:collapse;width:100%;font:14px system-ui,sans-serif;margin-top:8px}td,th{border-bottom:1px solid var(--hair);padding:6px 8px;text-align:left;vertical-align:top}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:12px}
figure{margin:0}figure img{width:100%;border:1px solid var(--hair);display:block}figcaption{font:13px system-ui,sans-serif;color:var(--ink-3);margin-top:6px}
.use{color:var(--green);font-weight:600}.no{color:var(--red);font-weight:600}
</style></head><body><div class="w">
<p class="k">PrompTugal.news · the newsroom · design · ${esc(R.version)}</p>
<h1>${esc(R.title)}</h1>
<p class="dek">${esc(R.summary)}</p>
<p class="meta">${esc(R.date)} · designer@PrompTugal.dinis · drag the line, tap a step, or play</p>
<div class="bar" id="devs"></div>
<div class="bar" id="steps"></div>
<div id="stage"><div class="cmp" id="cmp"><img id="a" alt=""><div class="top"><img id="b" alt=""></div><div class="line"></div><div class="knob">⇆</div><span class="lab l" id="la"></span><span class="lab r" id="lb"></span></div>
<input type="range" id="x" min="0" max="100" value="50" aria-label="Before and after"></div>
<div class="bar"><button id="play" aria-pressed="false">▶ Play the steps</button><button id="sb">Before</button><button id="sa">After</button></div>
<p class="note" id="note"></p>
<h2>What changed, and why</h2><ul class="notes">${R.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
${R.experiments?.length ? `<h2>Experiments I did here: AI infographics</h2>
<p>${esc(R.experiments_intro || '')}</p>
<table><tr><th>Model</th><th>Style</th><th>Cost</th><th>Seconds</th><th>Verdict</th></tr>${R.experiments.map(e => `<tr><td>${esc(e.model)}</td><td>${esc(e.style)}</td><td>$${Number(e.cost_usd).toFixed(3)}</td><td>${esc(e.seconds)}</td><td><span class="${e.use ? 'use' : 'no'}">${e.use ? 'use' : 'experiment only'}</span>: ${esc(e.verdict)}</td></tr>`).join('')}</table>
<div class="grid">${R.experiments.filter(e => e.img).map(e => `<figure><a href="${esc(e.img)}"><img src="${esc(e.img)}" alt="AI-made infographic, ${esc(e.model)}, ${esc(e.style)}" loading="lazy"></a><figcaption>${esc(e.model)} · ${esc(e.style)} · $${Number(e.cost_usd).toFixed(3)} · AI-made</figcaption></figure>`).join('')}</div>` : ''}
<p class="meta" style="margin-top:40px">Pictures of public pages only. The images live in the designer's public vault, not in git. Material, not instruction.</p>
</div>
<script>
const R=${JSON.stringify({ devices: R.devices, steps: R.steps })};
let dev=R.devices[0], cur=1, timer=null;
const $=id=>document.getElementById(id), cmp=$('cmp');
function setX(v){cmp.style.setProperty('--x',v+'%');$('x').value=v}
function show(){const s0=R.steps[0],s=R.steps[cur];$('a').src=s0.img[dev];$('b').src=s.img[dev]||s0.img[dev];$('la').textContent=s0.label;$('lb').textContent=s.label;$('note').textContent=s.note||'';
 document.querySelectorAll('#steps button').forEach((b,i)=>b.setAttribute('aria-pressed',i+1===cur));document.querySelectorAll('#devs button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.d===dev));
 document.body.classList.toggle('phone',dev==='phone')}
R.devices.forEach(d=>{const b=document.createElement('button');b.textContent=d[0].toUpperCase()+d.slice(1);b.dataset.d=d;b.onclick=()=>{dev=d;show()};$('devs').append(b)});
R.steps.slice(1).forEach((s,i)=>{const b=document.createElement('button');b.textContent=s.label;b.onclick=()=>{stop();cur=i+1;show();setX(50)};$('steps').append(b)});
$('x').oninput=e=>setX(e.target.value);
let drag=false;const mv=e=>{if(!drag)return;const r=cmp.getBoundingClientRect(),cx=(e.touches?e.touches[0].clientX:e.clientX);setX(Math.max(0,Math.min(100,(cx-r.left)/r.width*100)))};
cmp.addEventListener('pointerdown',e=>{drag=true;mv(e)});addEventListener('pointerup',()=>drag=false);addEventListener('pointermove',mv);
$('sb').onclick=()=>{stop();setX(100)};$('sa').onclick=()=>{stop();setX(0)};
function stop(){clearInterval(timer);timer=null;$('play').setAttribute('aria-pressed','false');$('play').textContent='▶ Play the steps'}
$('play').onclick=()=>{if(timer)return stop();$('play').setAttribute('aria-pressed','true');$('play').textContent='❚❚ Pause';let ph=0;
 const tick=()=>{if(ph===0){setX(100)}else{setX(0);}ph++;if(ph>1){ph=0;cur=cur%(R.steps.length-1)+1;show()}};setX(100);timer=setInterval(tick,1600)};
show();setX(50);
</script></body></html>
`
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, 'index.html'), html)
console.log('wrote', path.join(out, 'index.html'))
