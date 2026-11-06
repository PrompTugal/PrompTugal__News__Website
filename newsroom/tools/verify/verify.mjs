#!/usr/bin/env node
// dev.verify@PrompTugal.dinis: the verification pipeline (first version).
// For one article: read its claims, fetch its public sources, ask several models (OpenRouter) whether each claim is
// supported by those sources, and write board/team/dev.verify/records/<slug>/verified.json plus the dated "verified" block.
// OPEN_ROUTER_KEY is read from the environment only; it is never printed, logged or written.
// Usage: node newsroom/tools/verify/verify.mjs <article-slug> [--dry-run] [--max-claims N] [--max-usd X] [--models a,b,c]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('../../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const slug = args.find(a => !a.startsWith('--'));
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : (args[i + 1] ?? true); };
const DRY = args.includes('--dry-run');
const MAX_CLAIMS = Number(flag('max-claims', 12));
const MAX_USD = Number(flag('max-usd', 0.5));
const MODELS = String(flag('models', 'anthropic/claude-haiku-5.5,google/gemini-3.8-flash,deepseek/deepseek-v4.1-flash')).split(',');
const EXTRACTOR = MODELS[0];
if (!slug) { console.error('usage: verify.mjs <article-slug> [--dry-run]'); process.exit(2); }

const file = path.join(ROOT, 'content/articles', slug + '.md');
const raw = fs.readFileSync(file, 'utf8');
const body = raw.replace(/^---[\s\S]*?\n---\n/, '');
const section = (h) => { const m = body.match(new RegExp('^## ' + h + '[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))', 'm')); return m ? m[1] : ''; };
const story = [section('In short'), section('The story')].join('\n').trim();
const sourcesBlock = section('Where this comes from');
const urls = [...new Set([...sourcesBlock.matchAll(/<(https?:\/\/[^>\s]+)>/g)].map(m => m[1]))].filter(u => !/tried and not reached/i.test(sourcesBlock.split(u)[0].split('\n').pop()));

const text = (html) => html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

async function fetchSource(url) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'PrompTugal-verify/0.1 (+https://promptugal.news)' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return { url, status: r.status, text: '' };
    return { url, status: r.status, text: text(await r.text()).slice(0, 24000) };
  } catch (e) { return { url, status: 0, text: '', error: String(e.message || e) }; }
}

let spent = 0;
async function ask(model, prompt) {
  const key = process.env.OPEN_ROUTER_KEY;
  if (!key) throw new Error('OPEN_ROUTER_KEY is not set');
  if (spent >= MAX_USD) throw new Error('budget reached: ' + spent.toFixed(4) + ' USD');
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model, temperature: 0, usage: { include: true }, messages: [{ role: 'user', content: prompt }] }),
    signal: AbortSignal.timeout(120000),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(model + ': HTTP ' + r.status + ' ' + JSON.stringify(j.error || '').slice(0, 200));
  spent += Number(j.usage?.cost || 0);
  return j.choices?.[0]?.message?.content || '';
}
const json = (s) => { const m = s.match(/[\[{][\s\S]*[\]}]/); return JSON.parse(m ? m[0] : s); };

const sources = await Promise.all(urls.map(fetchSource));
const ok = sources.filter(s => s.text);
console.log(`article ${slug}: ${urls.length} source urls, ${ok.length} fetched, story ${story.length} chars`);
if (DRY) { for (const s of sources) console.log(' ', s.status, s.url, s.text.length); process.exit(0); }
if (!ok.length) { console.error('no source could be read: nothing to verify against'); process.exit(1); }

const corpus = ok.map((s, i) => `[S${i + 1}] ${s.url}\n${s.text}`).join('\n\n');
const claims = json(await ask(EXTRACTOR,
  `List the factual claims in this article text, each atomic and checkable (a date, a time, a number, a name, a place, an attribution). Skip opinions and advice. Reply with JSON only: [{"id":"c1","claim":"..."}]. At most ${MAX_CLAIMS}, the most checkable first.\n\n${story}`)).slice(0, MAX_CLAIMS);

const rows = [];
for (const c of claims) {
  const verdicts = await Promise.all(MODELS.map(async (m) => {
    try {
      const v = json(await ask(m,
        `You verify one claim from a news article against its sources only. Use nothing else you know.\nClaim: ${c.claim}\n\nSources:\n${corpus}\n\nReply with JSON only: {"verdict":"supported|partly|unsupported|contradicted|exaggerated","source":"S<n> or null","quote":"the shortest exact words from the source that decide it, or empty","note":"one sentence"}. "supported" only if a source says it; "exaggerated" if the claim says more than the source.`));
      return { model: m, ...v };
    } catch (e) { return { model: m, verdict: 'error', note: String(e.message).slice(0, 160) }; }
  }));
  const vs = verdicts.filter(v => v.verdict !== 'error').map(v => v.verdict);
  const agree = vs.length > 0 && vs.every(v => v === vs[0]);
  rows.push({ id: c.id, claim: c.claim, verdicts, consensus: agree ? vs[0] : 'disagree', flag_to_journalist: !agree || vs[0] !== 'supported' });
  console.log(` ${c.id} ${agree ? vs[0] : 'DISAGREE ' + vs.join('/')}`);
}

const date = new Date().toISOString().slice(0, 10);
const out = { $schema: 'none', article: slug, verified_on: date, by: 'dev.verify@PrompTugal.dinis', models: MODELS,
  sources: sources.map(({ url, status }) => ({ url, status })), spent_usd: Number(spent.toFixed(4)), claims: rows };
const dir = path.join(ROOT, 'board/team/dev.verify/records', slug);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'verified.json'), JSON.stringify(out, null, 2) + '\n');
const n = rows.length, good = rows.filter(r => !r.flag_to_journalist).length;
const md = `## Verified\n\nOn ${date}, ${n} claims in this article were each checked against its public sources by ${MODELS.length} models (${MODELS.join(', ')}). All models agreed that ${good} are supported; ${n - good} are flagged to the journalist. Sources read: ${ok.length} of ${urls.length}. The record: board/team/dev.verify/records/${slug}/verified.json.\n`;
fs.writeFileSync(path.join(dir, 'verified-block.md'), md);
console.log(`wrote ${path.relative(ROOT, dir)}; ${good}/${n} supported by all; spent ${spent.toFixed(4)} USD`);
