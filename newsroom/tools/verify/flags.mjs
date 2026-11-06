#!/usr/bin/env node
// Regenerates board/team/dev.verify/flags-for-journalist.md from the records (verified.json per article).
// A claim is flagged unless all models answered "supported".
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const dir = path.join(ROOT, 'board/team/dev.verify/records');
let out = [], total = 0, ok = 0, arts = 0;
for (const slug of fs.readdirSync(dir).sort()) {
  const f = path.join(dir, slug, 'verified.json');
  if (!fs.existsSync(f)) continue;
  const v = JSON.parse(fs.readFileSync(f, 'utf8'));
  const bad = v.claims.filter(c => !(c.verdicts.length && c.verdicts.every(x => x.verdict === 'supported')));
  arts++; total += v.claims.length; ok += v.claims.length - bad.length;
  out.push(`## ${slug}: ${v.claims.length - bad.length}/${v.claims.length} supported by all`);
  for (const c of bad) out.push(`- ${c.id}: ${c.claim} (${c.verdicts.map(x => x.verdict).join(' / ')})`);
  out.push('');
}
const stamp = new Date().toISOString().slice(0, 16).replace('T', ', ') + ' UTC';
fs.writeFileSync(path.join(ROOT, 'board/team/dev.verify/flags-for-journalist.md'),
  `# Verification flags for journalist@ (dev.verify@, ${stamp})\n\nA flag is a prompt to re-read the source, not a finding of error. ${arts} articles checked, ${total} claims, ${ok} supported by all models (a claim is verified only if all models answered and agreed). Not read: pages that need JavaScript, pages behind a login or a viewer, anything under 300 characters. An article about the newsroom itself scores low when the cited repository page does not state its figures: they come from our own data.\n\n${out.join('\n')}`);
console.log(`${arts} articles, ${total} claims, ${ok} supported by all`);
