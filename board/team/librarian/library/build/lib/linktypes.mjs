// The typed links of the library: each has a named inverse. A link is stored once, on the card that asserts it
// ({rel, to}); where the target is a card the inverse is written on the target ({rel: inverse, to, inv: true}), so
// every such connection is two directed edges. A target that is an authority record or a subject heading
// keeps its inverse in the indexes (indexes/agent.json, indexes/subject.json), not on the record.
export const LINK_TYPES = [
  { rel: 'made_by', inverse: 'made', from: 'card', to: 'authority record (agent)', target: 'auth', use: 'the maker, from the git trailer or the first commit of the path', ontology: 'proposal' },
  { rel: 'part_of', inverse: 'includes', from: 'card', to: 'card', target: 'card', use: 'a finding in a pass, a file in a desk or an agent folder, a run report or inbox of an agent', ontology: 'exists (events only; proposal to widen)' },
  { rel: 'cites', inverse: 'cited_by', from: 'card', to: 'card', target: 'card', use: 'a file names another card by path, address or pass name; each target is an existing card', ontology: 'proposal' },
  { rel: 'about', inverse: 'subject_of', from: 'card', to: 'subject heading or authority record', target: 'subj|auth', use: 'what the card is about: a subject of vocabulary/subjects.json, or the entity (company, organisation, person, place, topic) its page is', ontology: 'exists' },
  { rel: 'answers', inverse: 'answered_by', from: 'finding or question', to: 'card', target: 'card', use: 'the decision page a finding names, or the card where an answered question says it stands', ontology: 'proposal' },
  { rel: 'supersedes', inverse: 'superseded_by', from: 'card', to: 'card', target: 'card', use: 'a later holding replaces an earlier one (front matter, a versioned name, or the owner\'s word in authority/forms.json)', ontology: 'proposal' },
  { rel: 'derived_from', inverse: 'source_of', from: 'card', to: 'card', target: 'card', use: 'a generated file and the file its own header says it came from', ontology: 'proposal' },
  { rel: 'see', inverse: 'see_from', from: 'card', to: 'card', target: 'card', use: 'a former or withdrawn holding points to the one that took its place', ontology: 'proposal' },
  { rel: 'see_also', inverse: 'also_seen_from', from: 'card', to: 'card', target: 'card', use: 'related holdings worth reading together (two cards that cite each other, or the owner\'s word); written as two directed edges because the ontology bans a verb that is its own inverse', ontology: 'proposal' },
]
export const REL = Object.fromEntries(LINK_TYPES.map((t) => [t.rel, t]))
export const INVERSE = Object.fromEntries(LINK_TYPES.map((t) => [t.inverse, t.rel]))
export const REL_ORDER = LINK_TYPES.flatMap((t) => [t.rel, t.inverse])
