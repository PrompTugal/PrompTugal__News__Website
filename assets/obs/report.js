// The observability report of the control centre (/newsroom/observability/), observability@PrompTugal.dinis, 6 November
// 2026, at Dinis Cruz's word: "report in that admin section, both what we have today, and the new promptugal site".
// Two sources, read live in this browser from their published read keys (data/newsroom/observability/vaults.json):
// the team site's public observability vault (aym98gsm, web-summit.sgit.ai, observability@web-summit.dinis) and
// PrompTugal.news's (made with newsroom/tools/obs/obs_setup.py). Both drains write the same files (obs_lets.py), so
// this page reads latest/summary.json, pages.json, agents.json and runs.json from each (and places.json from
// PrompTugal's) and draws them side by side and combined. sgit.ai's vault reader (assets/vendor/sgit-ai/2026-11-05/
// vault-embed.js, unmodified) derives each address from the read key, fetches ciphertext and decrypts it here; this
// file walks only the folders it needs (latest/). Vault bytes are untrusted input: drawn as text, never as HTML.
(() => {
    'use strict'
    const box = document.querySelector('.obs-report'); if (!box || !window.SGVaultEmbed) return
    const SOURCES = JSON.parse(box.dataset.sources)
    const GROUPS = ['readers', 'team', 'synthetic', 'crawlers']
    const LABEL = { readers: 'Readers', team: 'Team (by key)', synthetic: 'Synthetic', crawlers: 'Crawlers' }
    const dec = new TextDecoder()
    const fmt = n => (n || 0).toLocaleString('en-GB')
    const h = (tag, attrs = {}, kids = []) => {
        const e = document.createElement(tag)
        for (const [k, v] of Object.entries(attrs || {})) if (v != null) k === 'text' ? e.textContent = v : k === 'class' ? e.className = v : e.setAttribute(k, v)
        for (const c of [].concat(kids)) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)))
        return e
    }
    const table = (head, rows, cls = 'obs-t') => h('div', { class: 'obs-scroll' }, [h('table', { class: cls }, [h('thead', {}, [h('tr', {}, head.map(x => h('th', { text: x })))]), h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => h('td', {}, [c])))))])])
    const link = (href, text) => h('a', { href, target: '_blank', rel: 'noopener' }, [text])
    const LOG = [], logBox = box.querySelector('[data-log]')
    const log = s => { LOG.push(s); if (logBox) logBox.append(h('li', { text: s })) }

    // a lazy reader: the ref, the commit, then only the trees on the path asked for
    async function open(src) {
        const R = await new window.SGVaultEmbed.Reader({ endpoint: src.endpoint, vault_id: src.vault_id, read_key: src.read_key.replace(/^sgit_public_read_/, '') }).init()
        const t0 = performance.now()
        const refId = 'ref-pid-muw-' + await R.fileId('sg-vault-v1:file-id:ref:' + src.vault_id)
        const ref = JSON.parse(dec.decode(await R.decrypt(await R.raw('bare/refs/' + refId))))
        const commit = await R.objJson(ref.commit_id)
        const trees = new Map()
        const entries = async id => {
            if (trees.has(id)) return trees.get(id)
            const t = await R.objJson(id), out = {}
            for (const e of t.entries || []) out[await R.decB64(e.name_enc)] = e
            trees.set(id, out); return out
        }
        const read = async path => {
            let cur = await entries(commit.tree_id); const parts = path.split('/')
            for (const [i, p] of parts.entries()) {
                const e = cur[p]; if (!e) return null
                if (i === parts.length - 1) { const t1 = performance.now(), b = await R.obj(e.blob_id); log(`${src.site}: ${path} decrypted (${fmt(b.length)} bytes, ${Math.round(performance.now() - t1)} ms)`); return JSON.parse(dec.decode(b)) }
                cur = await entries(e.tree_id)
            }
        }
        log(`${src.site}: vault ${src.vault_id} opened from its read key, commit ${String(ref.commit_id).slice(0, 18)}… (${Math.round(performance.now() - t0)} ms)`)
        return { read }
    }

    const sum = (o, k) => GROUPS.reduce((a, g) => a + ((o && o[g] && o[g][k]) || 0), 0)

    async function load(src) {
        try {
            const v = await open(src)
            const [summary, pages, agents, runs, places] = await Promise.all(['summary', 'pages', 'agents', 'runs', 'places'].map(f => v.read(`latest/${f}.json`).catch(() => null)))
            return { src, summary, pages, agents, runs, places, ok: !!summary }
        } catch (e) { log(`${src.site}: could not read the vault (${e && e.message || e})`); return { src, ok: false, error: String(e && e.message || e) } }
    }

    const sec = (id, title, intro, body) => h('section', { class: 'obs-sec', id }, [h('h2', { text: title }), intro ? h('p', { class: 'obs-m', text: intro }) : null, body])

    function draw(D) {
        const out = box.querySelector('[data-out]'); out.textContent = ''
        const ok = D.filter(d => d.ok)
        // 1. the numbers, side by side and combined
        const tiles = (label, T, runs, nAgents, pagesN, gen) => h('div', { class: 'obs-card' }, [h('h3', { text: label }),
            h('dl', { class: 'adm-stats' }, [['Views', sum(T, 'views')], ['Reads', sum(T, 'reads')], ['Tabs', sum(T, 'tabs')], ['Pages seen', pagesN], ['Agent runs', runs], ['Agents', nAgents]]
                .map(([k, v]) => h('div', {}, [h('dt', { text: k }), h('dd', { text: fmt(v) })]))),
            T ? table(['Group', 'Views', 'Reads', 'Tabs'], GROUPS.map(g => [LABEL[g], fmt(T[g] && T[g].views), fmt(T[g] && T[g].reads), fmt(T[g] && T[g].tabs)])) : null,
            gen ? h('p', { class: 'obs-m', text: `Data as of ${gen} UTC.` }) : null])
        const comb = {}; for (const g of GROUPS) comb[g] = { views: 0, reads: 0, tabs: 0 }
        for (const d of ok) for (const g of GROUPS) for (const k of ['views', 'reads', 'tabs']) comb[g][k] += (d.summary.totals[g] || {})[k] || 0
        const allAgents = new Set(ok.flatMap(d => (d.agents?.agents || []).filter(a => a.runs).map(a => a.agent)))
        out.append(sec('numbers', 'The numbers', 'Each source as its drain last published it, and the two added up. A tab is one browser tab (a random id that dies with it); groups are declared first (a crawler or automation flag, a verified team key), then inferred.',
            h('div', { class: 'obs-cards' }, [...D.map(d => d.ok ? tiles(d.src.site, d.summary.totals, d.summary.agents?.runs || 0, (d.agents?.agents || []).filter(a => a.runs).length, d.summary.pages || 0, d.summary.generated)
                : h('div', { class: 'obs-card' }, [h('h3', { text: d.src.site }), h('p', { class: 'obs-m', text: d.error ? 'Could not be read: ' + d.error : 'No data yet: the drain has not published latest/ yet.' })])),
            tiles('Both, combined', comb, ok.reduce((a, d) => a + (d.summary.agents?.runs || 0), 0), allAgents.size, ok.reduce((a, d) => a + (d.summary.pages || 0), 0), '')])))

        // 2. by day
        const days = {}
        for (const d of ok) for (const [day, v] of d.summary.days || []) { const x = days[day] = days[day] || {}; x[d.src.id] = GROUPS.reduce((a, g) => a + (v[g] || 0), 0) }
        const dk = Object.keys(days).sort(), mx = Math.max(1, ...dk.map(k => Object.values(days[k]).reduce((a, b) => a + b, 0)))
        out.append(sec('days', 'Views by day', 'All groups, per source. The bar is both sources together.',
            table(['Day', ...D.map(d => d.src.site), 'Both', ''], dk.map(k => { const t = Object.values(days[k]).reduce((a, b) => a + b, 0); return [k, ...D.map(d => fmt(days[k][d.src.id])), fmt(t), h('span', { class: 'obs-bar', style: `width:${Math.round(120 * t / mx)}px` })] }))))

        // 3. which pages
        const P = ok.flatMap(d => (d.pages?.pages || []).map(p => ({ ...p, site: d.src.site })))
        P.sort((a, b) => b.total - a.total)
        out.append(sec('pages', 'Which pages', 'The 40 most viewed pages across both sites, with the views of each group, the reads (a page counts as read when its tab was hidden or closed), the average time visible and the average deepest scroll.',
            table(['Site', 'Page', 'Views', 'Readers', 'Team', 'Synthetic', 'Crawlers', 'Reads', 'Avg time', 'Avg scroll'],
                P.slice(0, 40).map(p => [p.site, link('https://' + p.site + p.path, p.path), fmt(p.total), ...GROUPS.map(g => fmt(p.views[g])), fmt(p.reads), p.read_s_avg ? p.read_s_avg + ' s' : '', p.reads ? p.scroll_avg + '%' : '']))))

        // 4. who reads what: places (PrompTugal) and referrers
        const pl = D.find(d => d.places)
        if (pl) out.append(sec('places', 'Where readers are (PrompTugal.news)', `Tabs by country, from the browser's own lookup (the IP in the answer is never read or kept). A city is shown only once ${pl.places.city_min} or more tabs came from it; the rest is summed as other.`,
            h('div', { class: 'obs-cards' }, [h('div', { class: 'obs-card' }, [h('h3', { text: 'Countries' }), table(['Country', 'Tabs', 'Readers'], pl.places.countries.slice(0, 30).map(([cc, n, v]) => [`${n}${cc ? ' (' + cc + ')' : ''}`, fmt(GROUPS.reduce((a, g) => a + v[g], 0)), fmt(v.readers)]))]),
                h('div', { class: 'obs-card' }, [h('h3', { text: 'Cities' }), table(['City', 'Tabs'], [...pl.places.cities.slice(0, 30).map(([cc, n, v]) => [`${n}${cc ? ', ' + cc : ''}`, fmt(GROUPS.reduce((a, g) => a + v[g], 0))]), ['Other (fewer tabs each)', fmt(GROUPS.reduce((a, g) => a + (pl.places.cities_other[g] || 0), 0))]])])])))
        const refs = ok.flatMap(d => (d.summary.referrers || []).map(([r, n]) => [d.src.site, r, n])).sort((a, b) => b[2] - a[2])
        if (refs.length) out.append(sec('referrers', 'Where readers came from', 'The referring site, host only.', table(['Site', 'Came from', 'Views'], refs.slice(0, 20).map(([s, r, n]) => [s, r, fmt(n)]))))

        // 5. which agents ran
        const A = ok.flatMap(d => (d.agents?.agents || []).map(a => ({ ...a, site: d.src.site })))
        const pt = A.filter(a => /@promptugal\./i.test(a.agent)), rest = A.filter(a => !/@promptugal\./i.test(a.agent) && a.runs)
        const arow = a => [a.agent, a.site, a.runs ? fmt(a.runs) : 'never logged', a.runs ? `${fmt(a.signed)} of ${fmt(a.runs)}` : '', a.last || '', `${fmt(a.read_md)} / ${fmt(a.read_html)} / ${fmt(a.read_repo)}`, fmt(a.did),
            Object.entries(a.checklist || {}).map(([k, v]) => (v ? '✓ ' : '✗ ') + k).join(' ')]
        out.append(sec('agents', 'Which agents ran', 'Every agent logs each run (what it read, what it did), signed with its own session key: the PrompTugal team into PrompTugal\'s agents lane (newsroom/tools/agent-log.mjs), the team site\'s agents into theirs (WS-160). A run is signed when the drain verified it against an active key whose label is that agent (board/keys.json for the PrompTugal team, the team site\'s keys page for its own agents). "Never logged" is an agent with a key that has not logged a run yet.',
            h('div', {}, [h('h3', { text: 'The PrompTugal team' }), pt.length ? table(['Agent', 'Lane', 'Runs', 'Signed', 'Last run (UTC)', 'Read md / html / repo', 'Did', 'Read this run set'], pt.sort((a, b) => (b.last || '').localeCompare(a.last || '')).map(arow)) : h('p', { class: 'obs-m', text: 'No PrompTugal agent has logged a run yet.' }),
                h('h3', { text: 'The team site\'s agents' }), table(['Agent', 'Lane', 'Runs', 'Signed', 'Last run (UTC)', 'Read md / html / repo', 'Did', 'Checklist'], rest.sort((a, b) => (b.last || '').localeCompare(a.last || '')).map(arow))])))

        // 6. the latest runs, both lanes
        const R = ok.flatMap(d => (d.runs?.runs || []).map(r => ({ ...r, site: d.src.site }))).sort((a, b) => (b.run || '').localeCompare(a.run || ''))
        out.append(sec('runs', 'The latest runs', 'The 60 newest agent runs across both lanes.',
            table(['When (UTC)', 'Agent', 'Lane', 'Trigger', 'Read', 'Did', 'Signed', 'Notes'], R.slice(0, 60).map(r => [r.run || '', r.agent || '', r.site, r.trigger || '', fmt((r.read || []).length), fmt((r.did || []).length), r.signed ? 'yes' : 'no', (r.notes || '').slice(0, 140)]))))
    }

    const t0 = performance.now()
    Promise.all(SOURCES.map(load)).then(D => {
        draw(D)
        const note = box.querySelector('[data-note]')
        if (note) note.textContent = `Read and decrypted in your browser in ${Math.round(performance.now() - t0)} ms from ${D.filter(d => d.ok).length} of ${D.length} vaults. Nothing was sent anywhere but the vault host.`
    }).catch(e => { const note = box.querySelector('[data-note]'); if (note) note.textContent = 'Could not read the vaults: ' + (e && e.message || e) })
})()
