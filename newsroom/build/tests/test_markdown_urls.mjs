#!/usr/bin/env node
/* test_markdown_urls.mjs: the renderer refuses javascript:, data: and other schemes as a link or an image (cl-6.security's S12, 26 Nov 2026).
 * node newsroom/build/tests/test_markdown_urls.mjs */
import { render } from '../lib/markdown.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const h = s => render(s + '\n').html
for (const u of ['javascript:alert(1)', 'JavaScript:alert(1)', 'data:text/html,x', 'vbscript:x', 'file:///etc/passwd']) {
    t(`${u} as a link: no anchor, the text stays`, [/<a\b/.test(h(`[go](${u})`)), /go/.test(h(`[go](${u})`))], [false, true])
    t(`${u} as an image: no img, the alt stays`, [/<img\b/.test(h(`![pic](${u})`)), /pic/.test(h(`![pic](${u})`))], [false, true])
}
for (const u of ['https://example.org/a', 'http://example.org/a', 'mailto:a@example.org', 'a/b.html', '../x/index.md', '#top', 'dir/a:b.html'])
    t(`${u} is allowed as a link`, /<a\b/.test(h(`[go](${u})`)), true)
t('an https image is allowed', /<img\b/.test(h('![pic](https://example.org/p.png)')), true)
t('a relative image is allowed', /<img\b/.test(h('![pic](img/p.png)')), true)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_markdown_urls: OK')
