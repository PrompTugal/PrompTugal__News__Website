// /apis/: the Swagger of Swaggers (Dinis, 18 November 2026, about 16:00 UTC; board/guidance/2026-11-18-the-pipeline-standard-and-the-fact-checker.md).
// Every PrompTugal site's OpenAPI document in one picker, on the vendored Swagger UI (features/openapi.mjs vendors it and
// checks its hashes). Words and sites in assets/apis/apis.json. dev@PrompTugal.dinis.
export const order = 59
const SW = 'assets/vendor/swagger-ui/5.33.3'
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

export function pages(ctx) {
    const W = ctx.readJSON('assets/apis/apis.json')
    const list = W.sites.map(s => `- **${s.name}**: [${s.spec.startsWith('http') ? s.spec : 'api/v1/openapi.json'}](${s.spec})`).concat(W.waiting.map(n => `- ${n}: ${W.waiting_label}`)).join('\n')
    return [{ rel: 'apis/index.html', src: 'assets/apis/apis.json', type: 'site', layout: 'wide', title: W.title, summary: W.summary,
        assets: { css: [`${SW}/swagger-ui.css`, 'assets/datasci/swagger-page.css'], js: [`${SW}/swagger-ui-bundle.js`, 'assets/apis/apis.js'] },
        md: W.md.join('\n\n') + '\n\n' + list,
        postHtml: html => `${html}\n<div id="apis" class="apis" data-pick="${esc(W.pick)}" data-sites="${esc(JSON.stringify(W.sites))}"><p>${esc(W.no_js)}</p></div>\n<div id="swagger-ui"></div>` }]
}
