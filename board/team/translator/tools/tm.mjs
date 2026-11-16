// Translation memory tool (translator@PrompTugal.dinis). No dependencies.
// PROVISIONAL until board/spec-translations.md lands: a segment is one whole string value;
// normalised = NFC, LF newlines kept (markdown lists), runs of spaces collapsed, trimmed; key = first 16 hex of sha256(normalised).
// Entry (board/spec-translations.md): data/i18n/tm/<culture>/<key[0..2]>.json = { "<key>": { "t", "by", "model", "at", "src": first 60 chars of the English, "ok": false until a second pass } }
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
export const norm = s => s.normalize('NFC').replace(/\r\n?/g, '\n').replace(/[ \t\u00a0]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); // keeps line breaks: a markdown list stays a list
export const key = s => crypto.createHash('sha256').update(norm(s)).digest('hex').slice(0, 16);
const root = new URL('../../../../', import.meta.url).pathname;
const tmDir = c => path.join(root, 'data/i18n/tm', c);
export function load(c, k) { try { return JSON.parse(fs.readFileSync(path.join(tmDir(c), k.slice(0, 2) + '.json'), 'utf8')); } catch { return {}; } }
export const has = (c, s) => key(s) in load(c, key(s));
export function put(c, en, t, by = 'translator@PrompTugal.dinis', at = new Date().toISOString().slice(0, 10), model = 'claude-sonnet-5-5') {
  const k = key(en), f = path.join(tmDir(c), k.slice(0, 2) + '.json'), o = load(c, k);
  if (o[k]) return false; // never overwrite: a segment with an entry is never translated again
  o[k] = { t, by, model, at, src: norm(en).slice(0, 60), ok: false };
  fs.mkdirSync(tmDir(c), { recursive: true });
  const sorted = Object.fromEntries(Object.entries(o).sort());
  fs.writeFileSync(f, JSON.stringify(sorted, null, 1) + '\n'); return true;
}
export function segments() { // by-place prose
  const out = new Map(), add = (s, w) => { if (typeof s === 'string' && s.trim()) out.set(key(s), { en: norm(s), where: w }); };
  const d = path.join(root, 'data/by-place');
  const pl = JSON.parse(fs.readFileSync(path.join(d, 'places.json'), 'utf8'));
  for (const [k, v] of Object.entries(pl.copy || {})) add(v, 'places.json#copy.' + k);
  for (const f of fs.readdirSync(d).sort()) {
    if (!f.endsWith('.json') || ['places.json', 'connections.json'].includes(f)) continue;
    const x = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
    add(x.mandate, f + '#mandate');
    for (const [k, v] of Object.entries(x.voice || {})) add(v, f + '#voice.' + k);
    add((x.gravity || {}).text, f + '#gravity.text');
    (x.ai_news || []).forEach((n, i) => { add(n.title, f + '#ai_news.' + i + '.title'); add(n.summary, f + '#ai_news.' + i + '.summary'); });
  }
  return out;
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [cmd, c, arg] = process.argv.slice(2);
  const segs = segments();
  if (cmd === 'todo') { // print segments of culture c with no entry
    const todo = [...segs].filter(([k, v]) => !(k in load(c, k)));
    fs.writeFileSync(arg, JSON.stringify(Object.fromEntries(todo.map(([k, v]) => [k, v.en])), null, 1));
    console.log(`${c}: ${todo.length} of ${segs.size} segments to translate`);
  } else if (cmd === 'apply') { // arg: JSON {key: translation}
    const m = JSON.parse(fs.readFileSync(arg, 'utf8')); let n = 0;
    for (const [k, t] of Object.entries(m)) { const s = segs.get(k); if (!s) { console.log('unknown key', k); continue; } if (put(c, s.en, t)) n++; }
    console.log(`${c}: ${n} entries added`);
  } else if (cmd === 'review') { // arg: JSON {key: true | "corrected translation"}: second pass; true marks ok, a string replaces t (by stays, rev records the reviewer)
    const m = JSON.parse(fs.readFileSync(arg, 'utf8')); let ok = 0, fixed = 0;
    for (const [k, v] of Object.entries(m)) {
      const f = path.join(tmDir(c), k.slice(0, 2) + '.json'), o = load(c, k); if (!o[k]) { console.log('no entry', k); continue; }
      if (v === true) { o[k].ok = true; ok++; } else if (typeof v === 'string' && v.trim()) { o[k].t = v; o[k].ok = true; o[k].rev = 'translator@PrompTugal.dinis second pass'; fixed++; }
      fs.writeFileSync(f, JSON.stringify(Object.fromEntries(Object.entries(o).sort()), null, 1) + '\n');
    }
    console.log(`${c}: ${ok} confirmed, ${fixed} corrected`);
  } else if (cmd === 'count') {
    for (const cc of fs.existsSync(path.join(root, 'data/i18n/tm')) ? fs.readdirSync(path.join(root, 'data/i18n/tm')) : []) {
      const n = [...segs].filter(([k]) => k in load(cc, k)).length; console.log(`${cc}: ${n}/${segs.size}`);
    }
  } else console.log('usage: tm.mjs todo <culture> <out.json> | apply <culture> <in.json> | review <culture> <in.json> | count');
}
