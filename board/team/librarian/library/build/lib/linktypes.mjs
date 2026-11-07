import fs from 'node:fs'
import path from 'node:path'

// The typed links of the library: each has a named inverse. A link is stored once, on the card that asserts it
// ({rel, to}); where the target is a card the inverse is written on the target ({rel: inverse, to, inv: true}), so
// every such connection is two directed edges. A target that is an authority record or a subject heading
// keeps its inverse in the indexes (indexes/agent.json, indexes/subject.json), not on the record.
export const LINK_TYPES = [
  { rel: 'made_by', inverse: 'made', from: 'card', to: 'authority record (agent)', target: 'auth', use: 'the maker, from the git trailer or the first commit of the path' },
  { rel: 'part_of', inverse: 'includes', from: 'card', to: 'card', target: 'card', use: 'a finding in a pass, a file in a desk or an agent folder, a run report or inbox of an agent' },
  { rel: 'cites', inverse: 'cited_by', from: 'card', to: 'card', target: 'card', use: 'a file names another card by path, address or pass name; each target is an existing card' },
  { rel: 'about', inverse: 'subject_of', from: 'card', to: 'subject heading or authority record', target: 'subj|auth', use: 'what the card is about: a subject of vocabulary/subjects.json, or the entity (company, organisation, person, place, topic) its page is' },
  { rel: 'answers', inverse: 'answered_by', from: 'finding or question', to: 'card', target: 'card', use: 'the decision page a finding names, or the card where an answered question says it stands' },
  { rel: 'supersedes', inverse: 'superseded_by', from: 'card', to: 'card', target: 'card', use: 'a later holding replaces an earlier one (front matter, a versioned name, or the owner\'s word in authority/forms.json)' },
  { rel: 'derived_from', inverse: 'source_of', from: 'card', to: 'card', target: 'card', use: 'a generated file and the file its own header says it came from' },
  { rel: 'see_also', inverse: 'also_seen_from', from: 'card', to: 'card', target: 'card', use: 'related holdings worth reading together (two cards that cite each other, or the owner\'s word); written as two directed edges because the ontology bans a verb that is its own inverse' },
]
// Where each link type stands in the site's ontology (data/ontology.json, ontologist@'s): read at every build, never
// written by hand. 'verb' when the ontology has it with the same inverse, 'inverse' when it is the inverse of an
// ontology verb, 'absent' when the ontology does not have it, 'differs' when the ontology names another inverse.
export function ontologyOf(root) {
  let verbs = []
  try { verbs = JSON.parse(fs.readFileSync(path.join(root, 'data/ontology.json'), 'utf8')).verbs || [] } catch { verbs = [] }
  const byVerb = new Map(verbs.map((v) => [v.verb, v]))
  const byInverse = new Map(verbs.filter((v) => v.inverse).map((v) => [v.inverse, v]))
  const out = {}
  if (!verbs.length) return out // no ontology to read (a fixture, or the file is gone): nothing to say
  for (const t of LINK_TYPES) {
    const v = byVerb.get(t.rel)
    const w = byInverse.get(t.rel)
    if (v) out[t.rel] = { state: v.inverse === t.inverse ? 'verb' : 'differs', world: v.world, ontology_inverse: v.inverse || null }
    else if (w) out[t.rel] = { state: w.verb === t.inverse ? 'inverse' : 'differs', world: w.world, ontology_inverse: w.verb }
    else out[t.rel] = { state: 'absent', world: null, ontology_inverse: null }
  }
  return out
}
export const REL = Object.fromEntries(LINK_TYPES.map((t) => [t.rel, t]))
export const INVERSE = Object.fromEntries(LINK_TYPES.map((t) => [t.inverse, t.rel]))
export const REL_ORDER = LINK_TYPES.flatMap((t) => [t.rel, t.inverse])
