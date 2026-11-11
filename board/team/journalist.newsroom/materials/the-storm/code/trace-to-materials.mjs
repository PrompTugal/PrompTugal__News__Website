#!/usr/bin/env node
// trace-to-materials.mjs: turn a work-desk trace into materials for the visualisers.
// No dependencies, Node 18+.
//
//   node board/team/work-desk/materials/the-storm/code/trace-to-materials.mjs \
//        board/team/work-desk/traces/the-storm.json board/team/work-desk/materials/the-storm
//
// Reads a trace (JSON: { story, steps: [ {time, actor, input, output, handoff_to, evidence, ...} ] }
// or a bare array of steps) and writes, beside the README:
//   actors.json     one row per actor: kind, steps, first and last time, span in minutes, hand-offs out and in, tokens if known
//   handoffs.json   the edges: from, to, count, times, and whether a person and an agent meet (person_agent: true)
//   timeline.json   the steps, sorted by time, with a stable id and the minutes since the first step
//   <story>.mmd     a Mermaid sequence diagram of the hand-offs (renders on GitHub)
//   flow.mmd        a Mermaid flowchart of actors and hand-off counts
// Field names are read loosely (time | time_utc | at; handoff_to | hand_off_to | to), so the reporter's
// schema can move without breaking this. Nothing is invented: a value missing in the trace stays null.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const [, , tracePath, outDir = '.'] = process.argv;
if (!tracePath) { console.error('usage: trace-to-materials.mjs <trace.json> [outDir]'); process.exit(2); }

const raw = JSON.parse(readFileSync(tracePath, 'utf8'));
const stepsIn = Array.isArray(raw) ? raw : (raw.steps || raw.trace || []);
const story = (!Array.isArray(raw) && (raw.story || raw.id)) || basename(tracePath, '.json');

const pick = (o, ...ks) => { for (const k of ks) if (o[k] !== undefined && o[k] !== null && o[k] !== '') return o[k]; return null; };
const name = a => (a && typeof a === 'object') ? (a.id || a.name || a.agent || JSON.stringify(a)) : a;
const kindOf = (a, step) => {
  const k = (a && typeof a === 'object' && a.kind) || pick(step, 'actor_kind', 'kind');
  if (k) return k;
  const n = String(name(a) || '');
  return n.includes('@') ? 'agent' : (n ? 'person' : null); // agents carry an @ name; people do not
};

const targetKind = new Map();
const steps = stepsIn.map((s, i) => {
  const actor = name(pick(s, 'actor', 'who', 'agent'));
  let to = pick(s, 'handoff_to', 'hand_off_to', 'handoff', 'to');
  const toRaw = Array.isArray(to) ? to : (to ? [to] : []);
  for (const t of toRaw) if (t && typeof t === 'object' && t.kind) targetKind.set(name(t), t.kind); // keep a target's own kind (organisation, public authority)
  to = toRaw.map(name);
  return {
    id: s.id || (s.n != null ? `s${String(s.n).padStart(3, '0')}` : `s${String(i + 1).padStart(3, '0')}`),
    time: pick(s, 'time', 'time_utc', 'at', 'utc'),
    actor, actor_kind: kindOf(pick(s, 'actor', 'who', 'agent'), s),
    input: pick(s, 'input'), output: pick(s, 'output'),
    handoff_to: to,
    evidence: pick(s, 'evidence', 'source', 'commit') ?? null,
    tokens: pick(s, 'tokens', 'token_count') ?? null,
    hand_off: pick(s, 'hand_off', 'handoff_kind'),
    workflow_step: pick(s, 'workflow_step'),
  };
}).sort((a, b) => String(a.time).localeCompare(String(b.time)));

const t0 = steps.find(s => s.time)?.time;
const mins = t => (t && t0) ? Math.round((Date.parse(t) - Date.parse(t0)) / 60000) : null;
steps.forEach(s => { s.minute = mins(s.time); });

const actors = new Map();
const actor = n => {
  if (!actors.has(n)) actors.set(n, { actor: n, kind: null, steps: 0, first: null, last: null, span_minutes: null, handoffs_out: 0, handoffs_in: 0, tokens: null });
  return actors.get(n);
};
const edges = new Map();
for (const s of steps) {
  if (!s.actor) continue;
  const a = actor(s.actor);
  a.kind = a.kind || s.actor_kind; a.steps++;
  if (s.time) { a.first = a.first && a.first < s.time ? a.first : s.time; a.last = a.last && a.last > s.time ? a.last : s.time; }
  if (typeof s.tokens === 'number') a.tokens = (a.tokens || 0) + s.tokens;
  for (const to of s.handoff_to) {
    a.handoffs_out++;
    const b = actor(to); b.handoffs_in++;
    b.kind = b.kind || targetKind.get(to) || kindOf(to, {});
    const k = `${s.actor}\u0000${to}`;
    if (!edges.has(k)) edges.set(k, { from: s.actor, to, count: 0, times: [], person_agent: false });
    const e = edges.get(k); e.count++; if (s.time) e.times.push(s.time);
  }
}
for (const a of actors.values()) if (a.first && a.last) a.span_minutes = Math.round((Date.parse(a.last) - Date.parse(a.first)) / 60000);
for (const e of edges.values()) e.person_agent = [e.from, e.to].some(n => actors.get(n).kind === 'person') && [e.from, e.to].some(n => actors.get(n).kind === 'agent');

// Mermaid: ids must be plain, labels may be anything.
const ids = new Map(); [...actors.keys()].forEach((n, i) => ids.set(n, `A${i}`));
const esc = s => String(s ?? '').replace(/["\n\r]/g, ' ').replace(/[;#]/g, ',');
const clip = (s, n = 80) => { s = esc(s); return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)) + ' ...'; }; // whole words only: a cut name reads as mail to the gate
const seq = ['sequenceDiagram', `  title ${esc(story)}: who handed what to whom`];
for (const n of actors.keys()) seq.push(`  participant ${ids.get(n)} as ${esc(n)}`);
for (const s of steps) for (const to of s.handoff_to)
  seq.push(`  ${ids.get(s.actor)}->>${ids.get(to)}: ${esc((s.time || '').slice(11, 16))} ${clip(s.output || s.input)}`);
const flow = ['flowchart LR'];
for (const [n, a] of actors) flow.push(`  ${ids.get(n)}${a.kind === 'person' ? `(["${esc(n)}"])` : `["${esc(n)}"]`}`);
for (const e of edges.values()) flow.push(`  ${ids.get(e.from)} ${e.person_agent ? '==>' : '-->'}|${e.count}| ${ids.get(e.to)}`);

mkdirSync(outDir, { recursive: true });
const meta = { story, from: tracePath, made_by: 'trace-to-materials.mjs', steps: steps.length, first: t0 || null, last: steps.at(-1)?.time || null };
const w = (f, v) => writeFileSync(join(outDir, f), typeof v === 'string' ? v + '\n' : JSON.stringify(v, null, 2) + '\n');
w('actors.json', { ...meta, actors: [...actors.values()] });
w('handoffs.json', { ...meta, handoffs: [...edges.values()] });
w('timeline.json', { ...meta, steps });
w(`${story}.mmd`, seq.join('\n'));
w('flow.mmd', flow.join('\n'));
console.log(`${story}: ${steps.length} steps, ${actors.size} actors, ${edges.size} hand-off edges -> ${outDir}`);
