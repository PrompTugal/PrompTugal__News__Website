// The release history page, generated from newsroom/versions.json (CI writes the rows; nobody else does).
import { loadVersions } from '../lib/versions.mjs'
export const order = 90

export function pages(ctx) {
    const versions = loadVersions()
    const md = versions.length
        ? `| Version | Date | What changed | By |\n|---|---|---|---|\n` + versions.map(v => `| <span id="${v.version}"></span>${v.version} | ${v.date} | ${String(v.what).replace(/\|/g, '/')} | ${v.by || ''}${v.from ? ` (from \`${v.from}\`)` : ''} |`).join('\n')
        : `No release yet: this build is ${ctx.VERSION}, before CI's first number.`
    return [{
        src: 'newsroom/versions.json', rel: 'newsroom/versions.html', type: 'site', date: versions[0]?.date,
        title: 'Release history',
        summary: 'Every release of this site, newest first: the version, the date, what changed and who pushed it. CI owns the number (newsroom/build/tag_release.sh); nobody who pushes writes one.',
        md,
        // the version rows carry an anchor each: kept raw in the HTML, dropped from the twin
        postHtml: html => html.replace(/&lt;span id=&quot;(v[0-9.]+)&quot;&gt;&lt;\/span&gt;/g, '<span id="$1"></span>'),
        twinMd: md.replace(/<span id="v[0-9.]+"><\/span>/g, ''),
    }]
}
