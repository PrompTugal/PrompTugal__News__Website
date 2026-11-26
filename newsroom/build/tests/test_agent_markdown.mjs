#!/usr/bin/env node
/* test_agent_markdown.mjs: agent-written text never becomes a link, an image or an autolink on the public site (cl-6.security's W1, 26 Nov 2026), through the
 * site's own renderer; and the URLs built from it are clean.   node newsroom/build/tests/test_agent_markdown.mjs */
import { plain, safeUrl } from '../lib/agent-text.mjs'
import { render } from '../lib/markdown.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const html = s => render(`- ${plain(s)}\n`).html
for (const [what, s] of [['a javascript: link', '[x](javascript:alert(1))'], ['an outside link', '[phish](https://evil.example/login)'], ['an image', '![i](https://evil.example/p.png)'], ['an autolink', '<https://evil.example/a>'], ['a table break and newline', 'a | b\n[c](https://evil.example)']]) {
    const h = html(s)
    t(`${what}: no anchor, no image`, [/<a\b/.test(h), /<img\b/.test(h)], [false, false])
}
t('the words stay readable', plain('Run [a] (1 file) <b>'), 'Run ［a］ (1 file) ‹b›')
t('safeUrl keeps a clean https URL', safeUrl('https://data.promptugal.news/sources/cams/'), 'https://data.promptugal.news/sources/cams/')
t('safeUrl refuses other schemes and odd characters', [safeUrl('javascript:alert(1)'), safeUrl('http://x.example'), safeUrl('https://x.example/a b'), safeUrl('https://x.example/a"b')], ['', '', '', ''])
t('safeUrl cleans parentheses', safeUrl('https://x.example/a(b)'), 'https://x.example/a%28b%29')
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_agent_markdown: OK')
