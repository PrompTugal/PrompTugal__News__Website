// The article page: the newsroom's real first article, rendered from content/articles/.
import fs from 'node:fs'
import { R, LIVE, esc, page } from './lib.mjs'

const abs = u => /^(https?:|#)/.test(u) ? u : LIVE + u.replace(/^(\.\.\/)+/, '').replace(/\.md(#|$)/, '.html$1')
const inline = s => {
    const codes = []
    s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${esc(c)}</code>`); return `\u0000${codes.length - 1}\u0000` })
    s = esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${abs(u)}">${t}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i])
}

export function articlePage(file) {
    const src = fs.readFileSync(R('content/articles/newsroom-status-four-days-out.md'), 'utf8')
    const [, fm, md] = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    const meta = Object.fromEntries(fm.split('\n').map(l => l.match(/^([a-z_]+):\s*(.*)$/)).filter(Boolean).map(m => [m[1], m[2]]))
    const out = [], toc = []
    const lines = md.split('\n')
    let i = 0, para = [], heading = ''
    const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = [] } }
    while (i < lines.length) {
        const l = lines[i]; let m
        if (/^```/.test(l)) {
            flush(); const buf = []; i++
            while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++])
            i++
            out.push(`<figure class="ascii"><pre><code>${esc(buf.join('\n'))}</code></pre><figcaption><span>${esc(heading)}. Plain text: copy it anywhere and it keeps its shape.</span><button class="zoom" type="button" aria-pressed="false">Enlarge</button></figcaption></figure>`)
            continue
        }
        if ((m = l.match(/^##\s+(.*?)\s*\{#([a-z0-9-]+)\}\s*$/))) { flush(); heading = m[1]; toc.push([m[2], m[1]]); out.push(`<h2 id="${m[2]}">${inline(m[1])}</h2>`); i++; continue }
        if (/^\s*$/.test(l)) { flush(); i++; continue }
        if (/^- /.test(l)) {
            flush(); const it = []
            while (i < lines.length && /^- /.test(lines[i])) it.push(`<li>${inline(lines[i++].slice(2))}</li>`)
            out.push(`<ul>${it.join('')}</ul>`); continue
        }
        para.push(l.trim()); i++
    }
    flush()
    const body = `
<div class="art">
<header class="art-head">
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="index.html#latest">News</a> / How PrompTugal.news is made</nav>
<p class="kicker"><a href="topic.html">How PrompTugal.news is made</a></p>
<h1>${esc(meta.title)}</h1>
<p class="lead">${esc(meta.summary)}</p>
<div class="byline"><span>By <span class="by">newsroom@web-summit.dinis</span>, an AI agent; editor Dinis Cruz</span><time datetime="${meta.date}">Thu 5 Nov 2026</time><span class="rt">4 min read</span><a class="sig" href="${LIVE}articles/newsroom-status-four-days-out.md.sig" title="Signed with the newsroom's key, record sha256:2cbb6cfafdcbbce7">✓ Signed</a></div>
</header>
<details class="toc" open><summary>On this page</summary><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${inline(t)}</a></li>`).join('')}</ol></details>
<div class="art-body body">
${out.join('\n')}
<div class="meter-line" role="note"><span>Reading credit <b>£5.00</b></span><span class="meter-bar" aria-hidden="true"><i style="width:38%"></i></span><span>38% of this page read. You pay for the share you read; it never blocks a page. <a href="account.html">How it works</a></span></div>
<p class="corrections"><b>Corrections.</b> None so far. Something wrong? <a href="about.html#corrections">Tell us</a> and we correct it on this page, dated, with the old text left visible.</p>
<p class="twin">Plain text of this page: <a href="${LIVE}articles/newsroom-status-four-days-out.md">newsroom-status-four-days-out.md</a> · For AI agents: <a href="${LIVE}llms.txt">llms.txt</a></p>
</div>
<aside class="art-side" aria-label="About this article">
<div class="box"><h2>This article</h2><ul><li>Written and signed by an AI agent, newsroom@web-summit.dinis</li><li>Edited by Dinis Cruz</li><li>CC BY 4.0: reuse it, say where it is from</li></ul></div>
<div class="box"><h2>Go from here</h2><ul><li><a href="events.html">The full agenda</a></li><li><a href="topic.html">109 companies, by field</a></li><li><a href="about.html">Who makes this newsroom</a></li><li><a href="chat.html">Ask about this article</a></li></ul></div>
</aside>
</div>`
    return page({
        file, title: meta.title, section: 'News', body, main: 'wide',
        mock: 'the article page, with the newsroom\'s real first article (content/articles/newsroom-status-four-days-out.md). Every 64-column picture fits a 390px phone: the block runs edge to edge and the type follows the screen width; "Enlarge" sets it at 13px and lets it scroll.',
        script: `document.querySelectorAll('.ascii .zoom').forEach(b=>b.addEventListener('click',()=>{const f=b.closest('.ascii');const on=f.classList.toggle('is-zoomed');b.setAttribute('aria-pressed',on);b.textContent=on?'Fit to screen':'Enlarge';}));if(matchMedia('(max-width: 1099px)').matches)document.querySelector('details.toc').removeAttribute('open');`,
    })
}
