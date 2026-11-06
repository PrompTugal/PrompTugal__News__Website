#!/usr/bin/env node
// dev.verify@PrompTugal.dinis: the verification pipeline (first version).
// For one article: read its claims, fetch its public sources, ask several models (OpenRouter) whether each claim is
// supported by those sources, and write board/team/dev.verify/records/<slug>/verified.json plus the dated "verified" block.
// OPEN_ROUTER_KEY is read from the environment only; it is never printed, logged or written.
// Usage: node newsroom/tools/verify/verify.mjs <article-slug> [--dry-run] [--max-claims N] [--max-usd X] [--models a,b,c]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(new URL('../../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const slug = args.find(a => !a.startsWith('--'));
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : (args[i + 1] ?? true); };
const DRY = args.includes('--dry-run');
const MAX_CLAIMS = Number(flag('max-claims', 12));
const MAX_USD = Number(flag('max-usd', 0.5));
const MODELS = String(flag('models', 'anthropic/claude-haiku-5.5,google/gemini-3.8-flash,deepseek/deepseek-v4.1-flash')).split(',');
const EXTRACTOR = MODELS[0];
const CONTEXT = String(flag('context', 'auto'));  // whole sources when they fit (A/B on your-first-day: 4/10 whole, 2/10 passages), else the passages most like the claim
const OUT = flag('out', '');
const PROMPTS = JSON.parse(fs.readFileSync(new URL('./prompts.json', import.meta.url), 'utf8'));
const fill = (t, v) => t.replace(/\{\{(\w+)\}\}/g, (_, k) => String(v[k]));
if (!slug) { console.error('usage: verify.mjs <article-slug> [--dry-run]'); process.exit(2); }

const file = path.join(ROOT, 'content/articles', slug + '.md');
const raw = fs.readFileSync(file, 'utf8');
const body = raw.replace(/^---[\s\S]*?\n---\n/, '');
const section = (h) => { const m = body.match(new RegExp('^## ' + h + '[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))', 'm')); return m ? m[1] : ''; };
const story = [section('In short'), section('The story')].join('\n').trim();
const sourcesBlock = section('Where this comes from');
const urls = [...new Set([...sourcesBlock.matchAll(/<(https?:\/\/[^>\s]+)>|\]\((https?:\/\/[^)\s]+)\)/g)].map(m => m[1] || m[2]))].filter(u => !/tried and not reached/i.test(sourcesBlock.split(u)[0].split('\n').pop()));

const text = (html) => html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

async function fetchSource(url) {
  const get = (ua) => fetch(url, { headers: { 'user-agent': ua, accept: 'text/html,application/pdf,*/*' }, signal: AbortSignal.timeout(30000) });
  try {
    let r = await get('PrompTugal-verify/0.2 (+https://promptugal.news)');
    if (r.status === 403) r = await get('Mozilla/5.0 (compatible; PrompTugal-verify/0.2; +https://promptugal.news)');
    if (!r.ok) return { url, status: r.status, text: '' };
    if ((r.headers.get('content-type') || '').includes('pdf') || /\.pdf($|\?)/i.test(url)) {
      const tmp = path.join(os.tmpdir(), 'verify-' + process.pid + '.pdf');
      fs.writeFileSync(tmp, Buffer.from(await r.arrayBuffer()));
      const t = spawnSync('pdftotext', ['-layout', tmp, '-'], { encoding: 'utf8', maxBuffer: 64e6 });
      fs.rmSync(tmp, { force: true });
      return { url, status: r.status, text: (t.stdout || '').replace(/\s+/g, ' ').trim().slice(0, 400000) };
    }
    return { url, status: r.status, text: text(await r.text()).slice(0, 400000) };
  } catch (e) { return { url, status: 0, text: '', error: String(e.message || e) }; }
}

// The passages of the sources most like the claim (numbers and capitalised words weigh most), so a long page is read whole, not cut.
const tokens = (t) => (t.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}.,:'-]*/gu) || []);
function passagesFor(claim, ok, n = 8, size = 1600) {
  const want = new Map();
  for (const w of claim.match(/[\p{Lu}\p{N}][\p{L}\p{N}.,:-]*/gu) || []) want.set(w.toLowerCase(), 3);
  for (const w of tokens(claim)) if (w.length > 3 && !want.has(w)) want.set(w, 1);
  const all = [];
  ok.forEach((src, i) => {
    for (let o = 0; o < src.text.length; o += size - 300) {
      const chunk = src.text.slice(o, o + size), set = new Set(tokens(chunk));
      let sc = 0; for (const [w, wt] of want) if (set.has(w)) sc += wt;
      all.push({ i, o, chunk, sc });
    }
  });
  return all.sort((a, b) => b.sc - a.sc).slice(0, n).sort((a, b) => a.i - b.i || a.o - b.o)
    .map(x => `[S${x.i + 1}] ${ok[x.i].url}\n...${x.chunk}...`).join('\n\n');
}

let spent = 0;
async function ask(model, prompt, maxTokens = 3000) {
  const key = process.env.OPEN_ROUTER_KEY;
  if (!key) throw new Error('OPEN_ROUTER_KEY is not set');
  if (spent >= MAX_USD) throw new Error('budget reached: ' + spent.toFixed(4) + ' USD');
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model, temperature: 0, max_tokens: maxTokens, usage: { include: true }, messages: [{ role: 'user', content: prompt }] }),
    signal: AbortSignal.timeout(120000),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(model + ': HTTP ' + r.status + ' ' + JSON.stringify(j.error || '').slice(0, 200));
  spent += Number(j.usage?.cost || 0);
  return j.choices?.[0]?.message?.content || '';
}
const json = (s) => { const m = s.match(/[\[{][\s\S]*[\]}]/); return JSON.parse(m ? m[0] : s); };

const sources = await Promise.all(urls.map(fetchSource));
const ok = sources.filter(s => s.text.length >= 300);
console.log(`article ${slug}: ${urls.length} source urls, ${ok.length} fetched, story ${story.length} chars`);
if (DRY) { for (const s of sources) console.log(' ', s.status, s.url, s.text.length); process.exit(0); }
if (!ok.length) { console.error('no source could be read: nothing to verify against'); process.exit(1); }

const cacheFile = path.join(ROOT, 'board/team/dev.verify/records', slug, 'claims.json');
let claims;
if (!args.includes('--reextract') && fs.existsSync(cacheFile)) claims = JSON.parse(fs.readFileSync(cacheFile, 'utf8')).slice(0, MAX_CLAIMS);
else {
  claims = json(await ask(EXTRACTOR,
  fill(PROMPTS.extract, { max: MAX_CLAIMS, story }))).slice(0, MAX_CLAIMS);
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(claims, null, 1) + '\n');
}

const rows = [];
for (const c of claims) {
  const corpus = (CONTEXT === 'whole' || (CONTEXT === 'auto' && ok.reduce((n, x) => n + Math.min(x.text.length, 40000), 0) <= 120000)) ? ok.map((x, i) => `[S${i + 1}] ${x.url}\n${x.text.slice(0, 40000)}`).join('\n\n') : passagesFor(c.claim, ok);
  const verdicts = await Promise.all(MODELS.map(async (m) => {
    try {
      const prompt = fill(PROMPTS.judge, { claim: c.claim, corpus });
      let v;
      try { v = json(await ask(m, prompt, 8000)); } catch (e) { if (/budget|HTTP/.test(String(e.message))) throw e; v = json(await ask(m, prompt, 8000)); }
      return { model: m, ...v };
    } catch (e) { return { model: m, verdict: 'error', note: String(e.message).slice(0, 160) }; }
  }));
  const vs = verdicts.filter(v => v.verdict !== 'error').map(v => v.verdict);
  const agree = vs.length > 0 && vs.every(v => v === vs[0]);
  rows.push({ id: c.id, claim: c.claim, verdicts, consensus: vs.length === 0 ? 'unchecked' : vs.length < MODELS.length ? 'incomplete' : agree ? vs[0] : 'disagree', flag_to_journalist: vs.length > 0 && (!agree || vs[0] !== 'supported') });
  console.log(` ${c.id} ${vs.length === 0 ? 'UNCHECKED (budget or errors)' : vs.length < MODELS.length ? 'INCOMPLETE ' + vs.join('/') : agree ? vs[0] : 'DISAGREE ' + vs.join('/')}`);
}

const date = new Date().toISOString().slice(0, 10);
const out = { $schema: 'none', article: slug, verified_on: date, by: 'dev.verify@PrompTugal.dinis', models: MODELS,
  sources: sources.map(({ url, status, text }) => ({ url, status, read: text.length >= 300, chars: text.length })), spent_usd: Number(spent.toFixed(4)), claims: rows };
const dir = OUT ? path.resolve(ROOT, String(OUT), slug) : path.join(ROOT, 'board/team/dev.verify/records', slug);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'verified.json'), JSON.stringify(out, null, 2) + '\n');
const n = rows.filter(r => r.consensus !== 'unchecked' && r.consensus !== 'incomplete').length, good = rows.filter(r => r.consensus === 'supported').length;
const md = fill(PROMPTS.block, { date, n, nmodels: MODELS.length, models: MODELS.join(', '), good, flagged: n - good, unchecked: rows.length > n ? fill(PROMPTS.unchecked, { count: rows.length - n }) : '', read: ok.length, listed: urls.length, slug });
fs.writeFileSync(path.join(dir, 'verified-block.md'), md);
console.log(`wrote ${path.relative(ROOT, dir)}; ${good}/${n} supported by all; spent ${spent.toFixed(4)} USD`);
