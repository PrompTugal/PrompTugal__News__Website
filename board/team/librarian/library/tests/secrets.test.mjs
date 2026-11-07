// What the library may publish: agent handles yes, any other address no (ST16).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { secretFindings } from '../build/lib/secrets.mjs'

test('agent handles of every known operator are not contact details', () => {
  for (const h of ['librarian@PrompTugal.dinis', 'reviewer@PrompTugal.vicky', 'writer@PrompTugal.angelo', 'design@web-summit.silvio', 'a@web-summit.indi'])
    assert.deepEqual(secretFindings(`made by ${h}`), [], h)
})

test('an address that is not an agent handle is refused; example domains are placeholders', () => {
  assert.deepEqual(secretFindings('write to someone@company.pt'), ['contains an address that is not an agent handle'])
  assert.deepEqual(secretFindings('write to someone@PrompTugal.stranger'), ['contains an address that is not an agent handle'])
  assert.deepEqual(secretFindings('jane@example.org'), [])
})

// the library's link types against the site's ontology (data/ontology.json is ontologist@'s; read, never written)
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ontologyOf } from '../build/lib/linktypes.mjs'

test('link types: read from data/ontology.json; verb, inverse, absent or differs; nothing without an ontology', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lib-onto-'))
  assert.deepEqual(ontologyOf(root), {})
  fs.mkdirSync(path.join(root, 'data'))
  fs.writeFileSync(path.join(root, 'data/ontology.json'), JSON.stringify({ verbs: [
    { verb: 'cites', inverse: 'cited_by', world: 'newsroom' },
    { verb: 'made_by', inverse: 'makes', world: 'newsroom' },
    { verb: 'source_of', inverse: 'derived_from', world: 'newsroom' },
  ] }))
  const o = ontologyOf(root)
  assert.equal(o.cites.state, 'verb')
  assert.equal(o.made_by.state, 'differs')
  assert.equal(o.derived_from.state, 'inverse')
  assert.equal(o.answers.state, 'absent')
  assert.equal(o.see, undefined) // no see verb: ontologist@, 7 November 2026
  fs.rmSync(root, { recursive: true, force: true })
})
