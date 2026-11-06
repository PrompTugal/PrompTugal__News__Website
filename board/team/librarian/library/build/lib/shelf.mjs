// The shelf list: the cards in call-number order. An index page, and one page per class (numbered parts when a
// class has more than ROWS_PER_PAGE rows), each table at most ROWS_PER_TABLE rows (READING-ROOM.md, section 2).
import { cmp, dateWords, mdCell, GENERATOR } from './util.mjs'
import { cardUrl } from './cards.mjs'

export const ROWS_PER_TABLE = 25
export const ROWS_PER_PAGE = 100

const short = (n) => (n ? String(n).replace(/@PrompTugal\.dinis$/, '@') : '')

function front(ctx, title) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    'by: librarian@PrompTugal.dinis',
    `generated: ${JSON.stringify('by ' + GENERATOR + ' from board/catalogue.json as generated ' + (ctx.catalogue.generated || 'unknown'))}`,
    `site_version: ${JSON.stringify(ctx.catalogue.site_version || '')}`,
    'source: board/catalogue.json',
    '---',
  ].join('\n')
}

function row(c) {
  const url = cardUrl(c)
  const title = url ? `[${mdCell(c.title)}](${url})` : mdCell(c.title)
  const made = c.provenance.made && c.provenance.made.by ? `${short(c.provenance.made.by)} ${dateWords(c.provenance.made.on)}`.trim() : ''
  const flag = c.status === 'withdrawn' ? ' (withdrawn)' : c.status === 'superseded' ? ' (superseded)' : ''
  return `| \`${c.call}\` | ${title}${flag} | ${c.kind || c.type} | ${mdCell(made)} |`
}

export function shelfPages(cards, ctx) {
  const cls = ctx.classification.classes
  const byClass = new Map()
  for (const c of cards) {
    const k = c.call.split('.')[0]
    if (!byClass.has(k)) byClass.set(k, [])
    byClass.get(k).push(c)
  }
  const files = {}
  const index = []
  for (const k of [...byClass.keys()].sort(cmp)) {
    const list = byClass.get(k)
    const nParts = Math.ceil(list.length / ROWS_PER_PAGE)
    const name = cls[k] ? cls[k].name : k
    const links = []
    for (let p = 0; p < nParts; p++) {
      const part = list.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE)
      const file = nParts === 1 ? `shelf-list/${k}.md` : `shelf-list/${k}-${p + 1}.md`
      links.push({ file, from: part[0].call, to: part[part.length - 1].call, n: part.length })
      const out = [front(ctx, `Shelf list: ${k}, ${name}${nParts > 1 ? ` (part ${p + 1} of ${nParts})` : ''}`), '']
      out.push(`# Shelf list: ${k}, ${name}${nParts > 1 ? ` (part ${p + 1} of ${nParts})` : ''}`, '')
      out.push(`${part.length} cards, from \`${part[0].call}\` to \`${part[part.length - 1].call}\`. The call number (where a card stands on the shelf) is class, subclass and the thing's own short name. Click a title to open the thing.`, '')
      for (let t = 0; t < part.length; t += ROWS_PER_TABLE) {
        const chunk = part.slice(t, t + ROWS_PER_TABLE)
        out.push(`**Cards ${p * ROWS_PER_PAGE + t + 1} to ${p * ROWS_PER_PAGE + t + chunk.length}**`, '')
        out.push('| Call number | Title | Kind | Made |', '|---|---|---|---|')
        for (const c of chunk) out.push(row(c))
        out.push('')
      }
      const nav = ['[Back to the shelf list](../shelf-list.md)']
      if (p > 0) nav.push(`[Previous part](${k}-${p}.md)`)
      if (p < nParts - 1) nav.push(`[Next part](${k}-${p + 2}.md)`)
      out.push(nav.join(' | '), '')
      files[file] = out.join('\n')
    }
    index.push({ k, name, n: list.length, links })
  }
  const total = cards.length
  const idx = [front(ctx, 'The shelf list of the library of PrompTugal.news'), '']
  idx.push('# The shelf list', '')
  idx.push(`Every card in call-number order (the shelf list: the cards as they stand on the shelf). ${total} cards in ${index.length} classes. A call number is a class, a subclass and the thing's own short name; the classes are in \`classification.json\`.`, '')
  idx.push('| Class | What it holds | Cards | Pages |', '|---|---|---|---|')
  for (const i of index) {
    const pages = i.links.map((l, n) => `[${i.links.length > 1 ? n + 1 : 'open'}](${l.file})`).join(' ')
    idx.push(`| \`${i.k}\` | ${mdCell(i.name)} | ${i.n} | ${pages} |`)
  }
  idx.push('', 'Cards of a holding that has left the repository stay on the shelf, marked withdrawn. Nothing is deleted.', '')
  files['shelf-list.md'] = idx.join('\n')
  return files
}
