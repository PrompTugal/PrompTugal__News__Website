// The markdown subset the content uses: headings with ids, paragraphs, lists, tables, quotes, code.
// No data logic and no site knowledge here: text in, HTML out.
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// one line of text safe for a markdown table cell or a list item
export const cell = s => String(s || '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim()

// content links point at .md twins where it makes sense for a reader of the markdown; the HTML points at .html
export const mdToHtmlLink = u => /^(https?:|mailto:|#)/.test(u) ? u : u.replace(/\.md(#|$)/, '.html$1')

export function inline(s) {
    const codes = []
    s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${esc(c)}</code>`); return `\u0000${codes.length - 1}\u0000` })
    s = esc(s)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${mdToHtmlLink(u)}">${t}</a>`)
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i])
}

export function render(md) {
    const lines = md.replace(/\r/g, '').split('\n'), out = [], toc = []
    let i = 0
    const para = []
    const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para.length = 0 } }
    while (i < lines.length) {
        const l = lines[i]
        let m
        if (/^```/.test(l)) {
            flush(); const buf = []; i++
            while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++])
            out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); i++; continue
        }
        if ((m = l.match(/^(#{2,4})\s+(.*?)\s*(?:\{#([a-z0-9-]+)\})?\s*$/))) {
            flush(); const lvl = m[1].length, id = m[3] || slug(m[2])
            if (lvl === 2) toc.push([id, m[2]])
            out.push(`<h${lvl} id="${id}">${inline(m[2])}</h${lvl}>`); i++; continue
        }
        if (/^\s*$/.test(l)) { flush(); i++; continue }
        if (/^>\s?/.test(l)) {
            flush(); const buf = []
            while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''))
            out.push(`<blockquote>${render(buf.join('\n')).html}</blockquote>`); continue
        }
        if (/^\|/.test(l) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
            flush()
            const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
            const head = cells(l); i += 2
            const rows = []
            while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]))
            out.push(`<div class="table"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)
            continue
        }
        if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
            flush(); const ordered = /^\s*\d+\./.test(l), items = []
            while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
                let item = lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, '')
                while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) item += ' ' + lines[i++].trim()
                items.push(`<li>${inline(item)}</li>`)
            }
            out.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`); continue
        }
        para.push(l.trim()); i++
    }
    flush()
    return { html: out.join('\n'), toc }
}

export function frontMatter(src) {
    const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (!m) return { meta: {}, body: src }
    const meta = {}
    for (const line of m[1].split('\n')) {
        const kv = line.match(/^([a-z_]+):\s*(.*)$/)
        if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1')
    }
    return { meta, body: m[2] }
}
