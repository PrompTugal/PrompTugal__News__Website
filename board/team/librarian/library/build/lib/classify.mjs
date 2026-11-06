// The call number: class and subclass by the first matching rule of classification.json, the slug as cutter.
import { slug } from './util.mjs'

function matches(when, card) {
  let any = false
  for (const [k, v] of Object.entries(when)) {
    any = true
    if (k === 'id') { if (card.id !== v) return false }
    else if (k === 'type') { if (card.type !== v) return false }
    else if (k === 'kind') { if (card.kind !== v) return false }
    else if (k === 'section') { if (card.section !== v) return false }
    else if (k === 'path_exact') { if (card.path !== v) return false }
    else if (k === 'path_prefix') { if (!(card.path || '').startsWith(v)) return false }
    else if (k === 'path_regex') { if (!new RegExp(v).test(card.path || '')) return false }
    else return false // an unknown condition never matches
  }
  return any
}

export function classify(card, cls) {
  const ov = cls.overrides && cls.overrides[card.id]
  if (ov) return { class: ov.class, sub: ov.sub, rule: 'override', special: ov.special || null, fallback: false }
  for (const r of cls.rules) {
    if (matches(r.when, card)) return { class: r.class, sub: r.sub, rule: r.id, special: r.special || null, fallback: false }
  }
  const f = cls.fallback
  return { class: f.class, sub: f.sub, rule: 'fallback', special: null, fallback: true }
}

export function cutter(card) {
  const colon = card.id.indexOf(':')
  const key = card.id.slice(colon + 1)
  if (card.type === 'idea' || card.type === 'question' || card.type === 'concept' || card.type === 'desk' || card.type === 'agent') {
    return slug(card.type === 'agent' ? (card.key || key) : key)
  }
  if (card.type === 'finding') return slug(key.replace('#', '-'))
  // page or board: the path's last part without its extension; the parent folder for an index
  const parts = (card.path || key).replace(/\/+$/, '').split('/')
  let last = parts[parts.length - 1].replace(/\.[A-Za-z0-9]+$/, '')
  if (last === 'index') last = parts.length > 1 ? parts[parts.length - 2] : 'home'
  return slug(last || 'home')
}

export const baseCall = (c, cut) => `${c.class}.${c.sub} ${cut}`
