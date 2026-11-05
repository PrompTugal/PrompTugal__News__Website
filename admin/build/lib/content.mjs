// The prose: content/**/*.md (front matter + markdown) into page objects. Drafts are skipped.
//   content/x.md -> x/index.html; content/index.md -> index.html; content/a/index.md -> a/index.html;
//   content/articles/x.md -> articles/x.html; a "path:" in the front matter overrides.
import fs from 'node:fs'
import path from 'node:path'
import { R, ROOT, walk } from './config.mjs'
import { frontMatter } from './markdown.mjs'

export function outPath(file, meta) {
    if (meta.path) return meta.path
    const r = path.relative(R('content'), file).split(path.sep).join('/').replace(/\.md$/, '')
    if (r === 'index') return 'index.html'
    if (r.endsWith('/index')) return r + '.html'
    if (r.startsWith('articles/')) return r + '.html'
    return r + '/index.html'
}

export function loadContent() {
    const pages = []
    for (const f of walk(R('content'), p => p.endsWith('.md'))) {
        const { meta, body } = frontMatter(fs.readFileSync(f, 'utf8'))
        if (meta.status === 'draft') continue
        pages.push({ src: path.relative(ROOT, f).split(path.sep).join('/'), rel: outPath(f, meta), meta, md: body })
    }
    return pages
}
