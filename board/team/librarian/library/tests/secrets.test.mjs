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
