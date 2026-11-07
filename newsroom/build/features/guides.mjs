// Interactive guides: an article that carries controls drawn by a script of its own (writer@PrompTugal.angelo, WS-125,
// at Angelo's word, 7 November 2026: "I want all interactivity to be back").
// The article stays plain markdown: its tables and lists are the content, and the twin, the search and the signature
// see only them. Layout hooks (`::: asg asg-<part>`) wrap the tables the script reads; the hooks are dropped from the
// twin. With scripts off, a reader gets the tables. The script and stylesheet load on that one article only.
export const order = 71

const GUIDES = {
    'articles/agent-setup-guide.html': { js: 'assets/guides/agent-setup-guide.js', parts: ['asg-find', 'asg-audience', 'asg-ladder', 'asg-dial', 'asg-fixes'], questions: 7, actions: 12 },
}

export function decorate(page) {
    const g = GUIDES[page.rel]
    if (!g) return
    page.assets = {
        ...(page.assets || {}),
        css: [...(page.assets?.css || []), 'assets/guides/guides.css'],
        js: [...(page.assets?.js || []), g.js],
    }
}

// the gate: each guide's page carries every part its script draws into, and loads its script
export function validate(gate) {
    const out = []
    for (const [rel, g] of Object.entries(GUIDES)) {
        let t = ''
        try { t = gate.text(rel) } catch { out.push(`guides: missing ${rel}`); continue }
        for (const p of g.parts) if (!t.includes(`class="asg ${p}"`)) out.push(`guides: ${rel} lacks its ${p} part`)
        if (!t.includes(g.js)) out.push(`guides: ${rel} does not load ${g.js}`)
        // the script reads seven questions and twelve actions from the find part, in order
        const find = (t.split('class="asg asg-find"')[1] || '').split('</div>')[0]
        const ol = (find.match(/<ol>([\s\S]*?)<\/ol>/) || [, ''])[1], ul = (find.match(/<ul>([\s\S]*?)<\/ul>/) || [, ''])[1]
        if (g.questions && (ol.match(/<li>/g) || []).length !== g.questions) out.push(`guides: ${rel}'s find part needs ${g.questions} questions`)
        if (g.actions && (ul.match(/<li>/g) || []).length !== g.actions) out.push(`guides: ${rel}'s find part needs ${g.actions} actions, in the script's order`)
    }
    return out
}
