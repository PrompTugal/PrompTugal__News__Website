// Derive a regional variant from its base culture (translator@PrompTugal.dinis).
// node variant.mjs <variant> <base> [overrides.json]: every segment the base has and the variant lacks is copied
// from the base (entry gets "from": base, ok:false) with the overrides' text where a regional change was made.
// A segment the variant already has is never touched. Mechanical rule for de-CH: ß becomes ss.
import fs from 'node:fs'; import path from 'node:path';
import { segments, load, put } from './tm.mjs';
const [variant, base, ov] = process.argv.slice(2);
const over = ov ? JSON.parse(fs.readFileSync(ov, 'utf8')) : {};
const root = new URL('../../../../', import.meta.url).pathname;
let n = 0, changed = 0;
for (const [k, s] of segments()) {
  if (k in load(variant, k)) continue;
  const b = load(base, k)[k]; if (!b) continue;
  let t = over[k] ?? b.t; if (variant === 'de-CH') t = t.replace(/ß/g, 'ss');
  if (put(variant, s.en, t)) {
    const f = path.join(root, 'data/i18n/tm', variant, k.slice(0, 2) + '.json'), o = JSON.parse(fs.readFileSync(f, 'utf8'));
    o[k].from = base; if (t !== b.t) { o[k].adapted = true; changed++; }
    fs.writeFileSync(f, JSON.stringify(o, null, 1) + '\n'); n++;
  }
}
console.log(`${variant}: ${n} derived from ${base}, ${changed} adapted`);
