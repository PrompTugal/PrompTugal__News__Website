// The events page: Web Summit's official programme against the events around it, by day, filterable.
// All 210 items from desks/programme/agenda.json are embedded; the page renders a day and filters in the browser.
import { esc, AGENDA, DAYS, LONGDAY, NOW_DAY, page } from './lib.mjs'

export function eventsPage(file) {
    const data = AGENDA.items.map(i => ({ d: i.date, t: i.time, w: i.what, p: i.where, k: i.kind, u: i.session_url || i.source_url, s: i.speakers || [] }))
    const days = Object.keys(DAYS)
    const cnt = d => AGENDA.items.filter(i => i.date === d)
    const seg = days.map(d => `<button role="tab" data-day="${d}" aria-selected="${d === NOW_DAY}"><b>${DAYS[d][0]}${d === NOW_DAY ? ' · today' : ''}</b>${DAYS[d][1]} Nov <span class="n" style="font:500 11px/1 var(--mono);color:var(--ink-3)">${cnt(d).length}</span></button>`).join('')
    const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / Agenda</nav>
<h1>The agenda</h1>
<p class="lead">Web Summit's own programme, and the events around it, from Thursday 5 to Thursday 12 November. ${AGENDA.count} items, each linked to the page it was read on.</p>
<div class="seg" role="tablist" aria-label="Day">${seg}</div>
<div class="filters" role="group" aria-label="Show"><span class="label">Show</span><button class="chip" data-f="all" aria-pressed="true">Everything</button><button class="chip" data-f="official" aria-pressed="false">Web Summit's programme</button><button class="chip" data-f="side" aria-pressed="false">Around the summit</button><button class="chip" data-f="pick" aria-pressed="false">Our picks</button></div>
<div class="filters" role="group" aria-label="Kind" style="padding-top:0"><span class="label">Kind</span><button class="chip" data-k="Centre Stage" aria-pressed="false">Centre Stage</button><button class="chip" data-k="announcement" aria-pressed="false">Press conferences</button><button class="chip" data-k="pitch" aria-pressed="false">PITCH</button><button class="chip" data-k="Masterclass" aria-pressed="false">Masterclasses</button><button class="chip" data-k="night-summit" aria-pressed="false">Night Summit</button><button class="chip" data-k="registration" aria-pressed="false">Registration</button></div>
<label class="visually-hidden" for="af">Filter this day</label><input id="af" class="input" type="search" placeholder="Filter: a name, a company, a stage" style="margin:4px 0 18px;max-width:420px">
<div class="grid g-8-4">
<section aria-labelledby="off-h"><div class="day-head"><h3 id="off-h">Web Summit's programme</h3><span class="note" id="off-n"></span></div><ol class="agenda" id="off"></ol></section>
<section class="split" aria-labelledby="side-h"><div class="day-head"><h3 id="side-h">Around the summit</h3><span class="note" id="side-n"></span></div><p class="count-line">Side events, meetups and Portugal Tech Week: not run by Web Summit unless it says so.</p><ol class="agenda" id="side"></ol></section>
</div>
<p class="notice">Times are Lisbon time (UTC in November) and may change: check <a href="https://websummit.com/schedule/">the summit's own schedule</a> before you go. Read between ${AGENDA.items.map(i => i.read_at).sort()[0].slice(0, 10)} and ${AGENDA.items.map(i => i.read_at).sort().pop().slice(0, 10)} by programme@web-summit.vicky, the programme desk. The summit lists hundreds of sessions a day; this agenda holds Centre Stage, PITCH, the press conferences, Night Summit, registration and our picks.</p>`
    const script = `
const A=${JSON.stringify(data)};
const KIND=${JSON.stringify({ registration: 'Registration', summit: 'Programme', announcement: 'Press conference', pitch: 'PITCH', 'night-summit': 'Night Summit', 'side-event': 'Around the summit', 'team-pick': 'Our pick' })};
const KC={'side-event':'k-side','team-pick':'k-pick',announcement:'k-press'};
const NOW_DAY='${NOW_DAY}',NOW_T='11:52';
let day=NOW_DAY,f='all',k=null,q='';
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pl=w=>String(w||'').replace(/, MEO Arena and FIL$/,'');
const who=i=>i.s.map(x=>{const m=x.match(/^(.*?) \\((.*)\\)$/);if(!m)return x;const p=m[2].split(', ');return m[1]+', '+p[p.length-1]}).join(' · ');
function st(i){if(i.d!==NOW_DAY||!i.t)return '';const [a,b]=i.t.split('-');if(b<=NOW_T)return 'is-past';if(a<=NOW_T&&NOW_T<b)return 'is-now';return ''}
function slot(i){const s=st(i);const lab=/Centre Stage/.test(i.p)&&i.k==='summit'?'Centre Stage':KIND[i.k];return '<li class="slot '+s+'"><time class="t">'+(i.t?i.t.slice(0,5)+'<small>'+i.t.slice(6)+'</small>':'All day')+'</time><div><a class="s-what" href="'+e(i.u)+'">'+e(i.w)+'</a>'+(i.s.length?'<span class="s-who">'+e(who(i))+'</span>':'')+'<span class="s-where">'+e(pl(i.p))+'</span></div><div class="tags">'+(s==='is-now'?'<span class="tag k-now">On now</span>':'')+'<span class="tag '+(KC[i.k]||'')+'">'+e(lab)+'</span></div></li>'}
function ok(i){if(f==='official'&&i.k==='side-event')return false;if(f==='side'&&i.k!=='side-event')return false;if(f==='pick'&&i.k!=='team-pick')return false;
 if(k&&!(i.k===k||(i.p||'').includes(k)))return false;if(q&&!(i.w+' '+i.p+' '+i.s.join(' ')).toLowerCase().includes(q))return false;return true}
function draw(){const L=A.filter(i=>i.d===day&&ok(i)).sort((a,b)=>(a.t||'00').localeCompare(b.t||'00'));
 const off=L.filter(i=>i.k!=='side-event'),side=L.filter(i=>i.k==='side-event');let h='',last='';
 const past=off.filter(i=>st(i)==='is-past'),rest=off.filter(i=>st(i)!=='is-past');
 if(past.length)h+='<li class="earlier"><details><summary>Earlier today: '+past.length+' item'+(past.length===1?'':'s')+', over</summary><ol class="agenda">'+past.map(slot).join('')+'</ol></details></li>';
 rest.forEach(i=>{const hr=i.t?i.t.slice(0,2)+':00':'';if(hr&&hr!==last){h+='<li class="hour" aria-hidden="true">'+hr+'</li>';last=hr}h+=slot(i)});
 document.getElementById('off').innerHTML=h||'<li class="empty">Nothing in Web Summit\\'s programme matches, on this day.</li>';
 document.getElementById('side').innerHTML=side.map(slot).join('')||'<li class="empty">Nothing around the summit matches, on this day.</li>';
 document.getElementById('off-n').textContent=off.length+' item'+(off.length===1?'':'s');document.getElementById('side-n').textContent=side.length+' event'+(side.length===1?'':'s');}
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-selected',x===b));day=b.dataset.day;draw()});
document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-f]').forEach(x=>x.setAttribute('aria-pressed',x===b));f=b.dataset.f;draw()});
document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';document.querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed',on);k=on?b.dataset.k:null;draw()});
document.getElementById('af').oninput=ev=>{q=ev.target.value.trim().toLowerCase();draw()};
const u=new URLSearchParams(location.search);if(u.get('k')){const b=document.querySelector('[data-k="'+u.get('k')+'"]');if(b)b.click()}
draw();
const sel=document.querySelector('.seg [aria-selected="true"]');if(sel)sel.parentNode.scrollLeft=sel.offsetLeft-sel.parentNode.clientWidth/2+sel.clientWidth/2;`
    return page({ file, title: 'The agenda', section: 'Agenda', body, script, live: true, mock: 'the events page on Tuesday 10 November at 11:52: Web Summit\'s programme beside the events around it, by day, with filters. All 210 real items from desks/programme/agenda.json are in this file; the buttons work.', head: '.slot.hour, .hour{display:block}' })
}
