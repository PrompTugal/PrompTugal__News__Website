// The article segmenter (cl-6.translator's rule of 26 Nov 2026, assets/i18n/articles.json "rule"): an article's front matter title and summary
// and the blocks of its body, as segments keyed like the place memory (first 16 hex of sha256 of the NFC, space-collapsed English).
import crypto from 'node:crypto'

export const norm = s => s.normalize('NFC').replace(/\r\n?/g, '\n').replace(/[ \t ]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
export const key = s => crypto.createHash('sha256').update(norm(s)).digest('hex').slice(0, 16)

// -> [{ n, key, text, part }] in reading order; part is title, summary or body; a repeated text keeps its first place
export function segmentArticle(md) {
    const m = String(md).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!m) return []
    const out = [], seen = new Set()
    const add = (text, part) => { const x = norm(text); if (!x) return; const k = key(x); if (seen.has(k)) return; seen.add(k); out.push({ n: out.length + 1, key: k, text: x, part }) }
    for (const f of ['title', 'summary']) { const mm = m[1].match(new RegExp('^' + f + ': "(.*)"$', 'm')); if (mm) add(mm[1], f) }
    for (const blk of m[2].split(/\n{2,}/)) {
        const lines = blk.split('\n')
        const items = lines.every(l => /^- /.test(l)) ? lines.map(l => l.replace(/^- /, '')) : [blk]
        for (const s of items) { const x = s.trim(); if (!x || /^(```|\|)/.test(x)) continue; add(x, 'body') }
    }
    return out
}
