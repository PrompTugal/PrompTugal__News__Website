// The agent setup guide, interactive (articles/agent-setup-guide.html; newsroom/build/features/guides.mjs).
// writer@PrompTugal.angelo, 7 November 2026, from the guide's first interactive version (conductor@web-summit.angelo,
// dev@PrompTugal.angelo, people/angelo/proposals/WS-125/ on the team site).
// It reads the article's own tables (inside the .asg-* layout hooks) and draws controls from them, so a correction to
// the article reaches the controls with no second copy of the text. The questionnaire's advice lines are the only
// text kept here. Nothing is sent or stored, except the reader's chosen audience in this browser (localStorage).
(function () {
    'use strict'
    if (!document.querySelector('.asg-audience')) return
    const $ = (s, r = document) => r.querySelector(s)
    const $$ = (s, r = document) => [...r.querySelectorAll(s)]
    const h = (tag, attrs = {}, ...kids) => {
        const e = document.createElement(tag)
        for (const [k, v] of Object.entries(attrs)) {
            if (v == null || v === false) continue
            if (k === 'class') e.className = v
            else if (k.startsWith('on')) e.addEventListener(k.slice(2), v)
            else e.setAttribute(k, v === true ? '' : v)
        }
        for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : document.createTextNode(String(k)))
        return e
    }
    const SVG = 'http://www.w3.org/2000/svg'
    const s = (tag, attrs = {}) => { const e = document.createElementNS(SVG, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e }
    const rows = part => $$(`.${part} table tbody tr`).map(tr => $$('td', tr).map(td => td.textContent.trim()))
    const store = { get: k => { try { return localStorage.getItem(k) } catch { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch { } } }
    const LEVELS = ['Watch', 'Reviewed', 'Enforced']
    const SEC = {
        find: ['find-your-guide', 'Find your guide'],
        audience: ['read-this-as', 'Read this as'],
        ladder: ['the-six-steps-from-chatbot-to-agent-team', 'The six steps'],
        levels: ['the-four-kinds-of-barrier-and-three-levels-of-practice', 'The kinds of barrier'],
        deploy: ['where-to-start-by-deployment', 'Where to start'],
        setup: ['the-setup-six-decisions', 'The setup'],
        product: ['it-works-with-your-product', 'Your product'],
        lessons: ['what-running-our-own-agent-team-taught-us', 'What we learnt'],
        open: ['open-source-and-who-can-help', 'Open source'],
    }
    const secLink = k => h('a', { href: '#' + SEC[k][0] }, SEC[k][1])
    const enhance = part => { const box = $('.' + part); box.classList.add('asg-on'); return box }

    // ---- 1. Read this as: the seven audiences, from the article's table ------------------------------------------------
    const AUD_KEYS = ['ceo', 'ciso', 'dpo', 'dev', 'devsecops', 'agentic', 'chat']
    const AUD = rows('asg-audience').map((r, i) => ({ key: AUD_KEYS[i] || 'a' + i, who: r[0], q: r[1], a: r[2] }))
    const audBox = enhance('asg-audience')
    const card = h('div', { class: 'asg-card', 'aria-live': 'polite' })
    const chips = h('div', { class: 'asg-chips', role: 'group', 'aria-label': 'Read this as' })
    const tableWrap = $('.table', audBox)
    function setAud(key) {
        $$('button', chips).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === key)))
        const a = AUD.find(x => x.key === key)
        card.replaceChildren()
        if (!a) { card.hidden = true; if (tableWrap) tableWrap.hidden = false; store.set('asg-aud', 'all'); return }
        if (tableWrap) tableWrap.hidden = true
        card.hidden = false
        card.append(h('p', { class: 'asg-eyebrow' }, 'Your answer in thirty seconds · ' + a.who), h('p', { class: 'asg-q' }, a.q), h('p', {}, a.a))
        store.set('asg-aud', key)
    }
    AUD.forEach(a => chips.append(h('button', { type: 'button', 'data-k': a.key, onclick: () => setAud(a.key) }, a.who)))
    chips.append(h('button', { type: 'button', 'data-k': 'all', onclick: () => setAud('all') }, 'All, as a table'))
    audBox.prepend(chips, card)
    setAud(AUD.some(a => a.key === store.get('asg-aud')) ? store.get('asg-aud') : AUD[AUD.length - 1]?.key)

    // ---- 2. The six steps: a staircase, from the article's table ----------------------------------------------------------
    const STEPS = rows('asg-ladder').map(r => ({ name: r[0].replace(/^\d+\.\s*/, ''), what: r[1], reach: r[2] }))
    const ladBox = enhance('asg-ladder')
    const stairs = h('div', { class: 'asg-stairs', role: 'group', 'aria-label': 'The six steps' })
    const stepCard = h('div', { class: 'asg-card', 'aria-live': 'polite' })
    let youStep = 0
    function pickStep(i) {
        $$('button', stairs).forEach((b, j) => { b.setAttribute('aria-pressed', String(j === i)); b.classList.toggle('you', j + 1 === youStep) })
        const st = STEPS[i]
        stepCard.replaceChildren(h('p', { class: 'asg-eyebrow' }, `Step ${i + 1} of ${STEPS.length}` + (i + 1 === youStep ? ' · you are here' : '')),
            h('p', { class: 'asg-q' }, st.name), h('p', {}, st.what), h('p', {}, h('b', {}, 'Reach: '), st.reach))
    }
    STEPS.forEach((st, i) => stairs.append(h('button', { type: 'button', style: `--h:${30 + i * 14}px`, onclick: () => pickStep(i) },
        h('span', { class: 'asg-n' }, String(i + 1)), h('span', {}, st.name))))
    $('.table', ladBox).hidden = true
    ladBox.prepend(stairs, stepCard)
    pickStep(0)

    // ---- 3. The dial: five deployments, three levels, from the article's table and the list under it ---------------------
    const DEPS = rows('asg-dial').map((r, i) => ({ name: r[0], l: [r[1], r[2], r[3]], start: Math.max(1, Math.min(3, parseInt(r[4], 10) || 2)), i }))
    const dialBox = enhance('asg-dial')
    const notes = $$('.asg-dial > ul > li')
    const depBtns = h('div', { class: 'asg-chips', role: 'group', 'aria-label': 'Pick a deployment' })
    const gauge = s('svg', { viewBox: '-24 0 348 172', class: 'asg-gauge', role: 'img' })
    const ang = l => [-60, 0, 60][l - 1]
    const pt = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [150 + r * Math.cos(a), 160 + r * Math.sin(a)] }
    const arc = (from, to, r) => { const [x1, y1] = pt(from, r), [x2, y2] = pt(to, r); return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}` }
    const arcs = [[-90, -31], [-29, 29], [31, 90]].map(([a, b], i) => { const p = s('path', { d: arc(a, b, 120), class: 'asg-arc l' + (i + 1) }); gauge.append(p); return p })
    const startMark = s('path', { class: 'asg-start' }); gauge.append(startMark)
    const needle = s('g', { class: 'asg-needle' }); needle.append(s('path', { d: 'M147 160 L150 58 L153 160 Z' }), s('circle', { cx: 150, cy: 160, r: 9 })); gauge.append(needle)
    LEVELS.forEach((n, i) => { const [x, y] = pt([-62, 0, 62][i], 146); const t = s('text', { x: x.toFixed(0), y: y.toFixed(0), 'text-anchor': 'middle', class: 'asg-glabel' }); t.textContent = n.toUpperCase(); gauge.append(t) })
    const range = h('input', { type: 'range', min: 1, max: 3, step: 1, value: 2, 'aria-label': 'Level of control' })
    const dialOut = h('div', { class: 'asg-card', 'aria-live': 'polite' })
    let cur = DEPS[0]
    function renderDial() {
        const l = +range.value
        range.setAttribute('aria-valuetext', LEVELS[l - 1])
        needle.style.transform = `rotate(${ang(l)}deg)`
        arcs.forEach((p, i) => p.classList.toggle('dim', i + 1 !== l))
        const [x, y] = pt(ang(cur.start), 106), [x1, y1] = pt(ang(cur.start) - 5, 92), [x2, y2] = pt(ang(cur.start) + 5, 92)
        startMark.setAttribute('d', `M${x.toFixed(1)} ${y.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}Z`)
        gauge.setAttribute('aria-label', `${cur.name}: dial at ${LEVELS[l - 1]}; we would start at ${LEVELS[cur.start - 1]}`)
        const verdict = l === cur.start ? 'Where we would start for this deployment' : l > cur.start ? 'Stronger than we would start with: fine if you can afford it' : 'Below where we would start (the mark on the dial)'
        dialOut.replaceChildren(
            h('p', { class: 'asg-eyebrow' }, cur.name),
            h('p', { class: 'asg-q' }, h('span', { class: 'asg-lvl l' + l }, LEVELS[l - 1]), ' ', cur.l[l - 1]),
            h('p', { class: 'asg-verdict ' + (l >= cur.start ? 'ok' : 'low') }, verdict))
        const n = notes[cur.i]
        if (n) { const li = n.cloneNode(true); dialOut.append(h('p', { class: 'asg-note' }, ...li.childNodes)) }
    }
    function pickDep(i) {
        cur = DEPS[i]
        $$('button', depBtns).forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)))
        range.value = cur.start
        renderDial()
    }
    DEPS.forEach((d, i) => depBtns.append(h('button', { type: 'button', onclick: () => pickDep(i) }, d.name)))
    range.addEventListener('input', renderDial)
    $('.table', dialBox).hidden = true
    const instr = h('div', { class: 'asg-instrument' }, gauge, h('label', { class: 'asg-range' }, h('span', {}, 'Watch'), range, h('span', {}, 'Enforced')))
    dialBox.prepend(h('p', { class: 'asg-try' }, 'Try it: pick a deployment, then turn the dial.'), depBtns, instr, dialOut)
    if (notes.length) notes[0].parentElement.classList.add('asg-listed')
    pickDep(0)

    // ---- 4. What has gone wrong: tick what you have run into, from the article's table ------------------------------------
    const FIX = rows('asg-fixes').map(r => ({ what: r[0], fix: r[1] }))
    const FIX_SEC = [[/copying/i, 'ladder'], [/forgets|drifts/i, 'setup'], [/admin/i, 'setup'], [/didn.t expect/i, 'levels'], [/email or a web page/i, 'levels'],
        [/overnight/i, 'lessons'], [/cost/i, 'lessons'], [/keys|passwords/i, 'setup'], [/overwrote/i, 'lessons'], [/legal/i, 'levels'], [/nobody noticed/i, 'lessons'], [/adopt/i, 'find']]
    const fixBox = enhance('asg-fixes')
    const fixForm = h('form', { class: 'asg-form' })
    const fixOut = h('div', { class: 'asg-card', 'aria-live': 'polite', hidden: true })
    const fixTiles = h('fieldset', {}, h('legend', {}, 'Tick everything you have run into'))
    FIX.forEach((f, i) => fixTiles.append(h('label', { class: 'asg-tile' }, h('input', { type: 'checkbox', name: 'fx', value: i }), f.what)))
    fixForm.append(fixTiles, h('button', { type: 'submit', class: 'asg-go' }, 'Show the fixes'))
    fixForm.addEventListener('submit', e => {
        e.preventDefault()
        const sel = new FormData(fixForm).getAll('fx').map(Number)
        fixOut.hidden = false
        if (!sel.length) { fixOut.replaceChildren(h('p', {}, 'Tick at least one.')); return }
        fixOut.replaceChildren(h('p', { class: 'asg-eyebrow' }, 'Your fixes'), h('ol', {}, sel.map(i => {
            const k = (FIX_SEC.find(([re]) => re.test(FIX[i].what)) || [])[1]
            return h('li', {}, h('b', {}, FIX[i].what + ': '), FIX[i].fix + '.', k ? [' Read: ', secLink(k), '.'] : null)
        })))
    })
    $('.table', fixBox).hidden = true
    fixBox.prepend(fixForm, fixOut)

    // ---- 5. Find your guide: the questions and the actions are the article's own lists (inside .asg-find) -----------------
    // Questions 3 to 7 list their answers after the bold question, separated by ";". The actions keep the article's order
    // (ACTS below names them in that order); the gate checks the counts (features/guides.mjs).
    const findBox = enhance('asg-find')
    const cap = t => t.charAt(0).toUpperCase() + t.slice(1)
    const after = li => { const b = $('strong', li); return li.textContent.slice(b ? b.textContent.length : 0).trim() }
    const answers = li => after(li).replace(/\.\s*$/, '').split(';').map(x => cap(x.trim())).filter(Boolean)
    const Q = $$('.asg-find > ol > li').map(li => ({ q: ($('strong', li)?.textContent || '').trim(), a: answers(li) }))
    const ACTS = ['early', 'mail', 'nopolicy', 'unchecked', 'boundary', 'inject', 'pii', 'blind', 'cost', 'lock', 'locked', 'time']
    const ACT = Object.fromEntries($$('.asg-find > ul > li').map((li, i) => [ACTS[i], cap(after(li))]))
    const REACH = ['mail', 'docs', 'code', 'prod', 'pii', 'money', 'public', 'inbound'], RW = [1, 1, 1.5, 2.5, 2, 3, 1.5, 2]
    const PROD = ['claude', 'ms', 'other'], ENV = ['personal', 'light', 'locked']
    const WORRY = ['leak', 'inject', 'irrev', 'cost', 'law', 'blind', 'lock', 'time']
    const DEP_IDS = ['assist', 'code', 'team', 'front', 'money']
    const pair = (keys, i) => (Q[i]?.a || []).map((t, j) => [keys[j] || 'x' + j, t])
    const radios = (name, list, checked) => list.map(([v, t], i) => h('label', { class: 'asg-tile' }, h('input', { type: 'radio', name, value: v, checked: i === checked }), t))
    const boxes = (name, list) => list.map(([v, t]) => h('label', { class: 'asg-tile' }, h('input', { type: 'checkbox', name, value: v }), t))
    const fs = (i, ...kids) => h('fieldset', {}, h('legend', {}, `${i + 1}. ${Q[i]?.q || ''}`), ...kids)
    const WHO = Q[3]?.a || []
    const whoRange = h('input', { type: 'range', name: 'who', min: 0, max: Math.max(0, WHO.length - 1), step: 1, value: 0, 'aria-valuetext': WHO[0] || '' })
    const whoText = h('span', { class: 'asg-whotext' }, WHO[0] || '')
    whoRange.addEventListener('input', () => { whoText.textContent = WHO[+whoRange.value]; whoRange.setAttribute('aria-valuetext', WHO[+whoRange.value]) })
    const findForm = h('form', { class: 'asg-form' },
        fs(0, radios('role', AUD.map(a => [a.key, a.who]), AUD.length - 1)),
        fs(1, radios('stage', STEPS.map((st, i) => [String(i + 1), `${i + 1}. ${st.name}`]), 0)),
        fs(2, boxes('reach', pair(REACH, 2))),
        fs(3, h('label', { class: 'asg-range' }, whoRange, whoText)),
        fs(4, radios('prod', pair(PROD, 4), 0)),
        fs(5, radios('env', pair(ENV, 5), 0)),
        fs(6, boxes('worry', pair(WORRY, 6))),
        h('button', { type: 'submit', class: 'asg-go' }, 'Show my guide'))
    const findOut = h('div', { class: 'asg-card asg-result', 'aria-live': 'polite', hidden: true })
    function gapGauge(reach, control) {
        const g = s('svg', { viewBox: '0 0 180 120', width: 180, role: 'img', 'aria-label': `Reach ${Math.round(reach * 100)} percent, decided and checked ${Math.round(control * 100)} percent` })
        const half = (r, cls, frac) => { const len = Math.PI * r; const p = s('path', { d: `M${90 - r} 100 A${r} ${r} 0 0 1 ${90 + r} 100`, class: cls }); if (frac != null) p.setAttribute('stroke-dasharray', `${(len * frac).toFixed(1)} 999`); g.append(p) }
        half(70, 'asg-track'); half(70, 'asg-reach', reach); half(56, 'asg-track thin'); half(56, 'asg-control', control)
        const t = s('text', { x: 90, y: 88, 'text-anchor': 'middle', class: 'asg-gapn' }); t.textContent = Math.max(0, Math.round((reach - control) * 100)); g.append(t)
        const l = s('text', { x: 90, y: 110, 'text-anchor': 'middle', class: 'asg-glabel' }); l.textContent = 'THE GAP'; g.append(l)
        return g
    }
    findForm.addEventListener('submit', e => {
        e.preventDefault()
        const f = new FormData(findForm)
        const role = f.get('role'), stage = +f.get('stage'), reach = f.getAll('reach'), who = +f.get('who'), prod = f.get('prod'), env = f.get('env'), worry = f.getAll('worry')
        let dep = 'assist'
        if (reach.includes('money') || reach.includes('prod')) dep = 'money'
        else if (reach.includes('inbound')) dep = 'front'
        else if (stage >= 6) dep = 'team'
        else if (stage === 5 || reach.includes('code')) dep = 'code'
        const D = DEPS[DEP_IDS.indexOf(dep)] || DEPS[0]
        let lvl = D.start; if (reach.includes('pii') && lvl < 2) lvl = 2
        const W = Object.fromEntries(REACH.map((k, i) => [k, RW[i]]))
        const rScore = Math.min(1, (stage / 6) * 0.45 + reach.reduce((a, k) => a + (W[k] || 1), 0) / 14)
        const cScore = Math.min(1, who / 3 * 0.85 + (env === 'locked' ? 0.1 : 0))
        const want = [
            stage <= 2 && 'early', stage <= 3 && reach.includes('mail') && 'mail', who < 2 && 'nopolicy', who === 2 && 'unchecked', lvl === 3 && 'boundary',
            (worry.includes('inject') || reach.includes('inbound')) && 'inject', (worry.includes('law') || reach.includes('pii') || role === 'dpo') && 'pii',
            worry.includes('blind') && 'blind', worry.includes('cost') && 'cost', (worry.includes('lock') || prod === 'other') && 'lock',
            env === 'locked' && 'locked', worry.includes('time') && 'time']
        const acts = want.filter(k => k && ACT[k]).map(k => ACT[k])
        if (!acts.length && ACT.nopolicy) acts.push(ACT.nopolicy)
        const reads = [stage <= 3 ? 'ladder' : null, 'levels', 'deploy', (role === 'dev' || role === 'devsecops') ? 'setup' : null, prod !== 'claude' ? 'product' : null, stage >= 4 ? 'lessons' : null, 'open'].filter(Boolean)
        const a = AUD.find(x => x.key === role) || AUD[0]
        findOut.hidden = false
        findOut.replaceChildren(
            h('div', { class: 'asg-result-top' }, gapGauge(rScore, cScore), h('div', {},
                h('p', { class: 'asg-eyebrow' }, 'Your guide'),
                h('p', { class: 'asg-q' }, `Read it as ${a.who}; you are on step ${stage} of ${STEPS.length}`),
                h('p', {}, h('b', {}, 'Your deployment: '), D.name + '. ', h('b', {}, 'Start at: '), h('span', { class: 'asg-lvl l' + lvl }, `level ${lvl}, ${LEVELS[lvl - 1]}`)),
                h('p', { class: 'asg-small' }, 'The outer arc: how much your agents can reach. The inner arc: how much is decided and checked. The number is the gap between them.'))),
            h('p', {}, h('b', {}, 'First actions')),
            h('ol', {}, acts.slice(0, 5).map(x => h('li', {}, x))),
            h('p', {}, h('b', {}, 'Read next: '), reads.flatMap((k, i) => i ? [' · ', secLink(k)] : [secLink(k)])),
            h('button', { type: 'button', class: 'asg-go', onclick: () => { setAud(role); youStep = stage; pickStep(stage - 1); pickDep(D.i); range.value = lvl; renderDial(); document.getElementById(SEC.audience[0])?.scrollIntoView({ behavior: 'smooth' }) } },
                `Switch the guide to ${a.who}`))
        youStep = stage; pickStep(stage - 1)
        findOut.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
    $$(':scope > ol, :scope > ul, :scope > p', findBox).forEach(e => { e.hidden = true })
    findBox.prepend(findForm, findOut)
})()
