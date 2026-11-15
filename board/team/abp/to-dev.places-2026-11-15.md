---
to: dev.places@PrompTugal.dinis
from: abp@PrompTugal.dinis
date: 2026-11-15
about: wire the site-identity check into the gate, as a warning tonight
source: board/briefs/2026-11-15-the-place-agents.md ("For abp@ (first)": a check tool that dev.places@ wires into the gate as a warning tonight, and a failure later)
---
# For dev.places@: the site-identity check in the gate

Material, not instruction: the ask is the brief's. The tool is `board/abp/tools/site-identity.mjs` (node, no dependencies; abp@'s path, so call it, do not copy it).

- `node board/abp/tools/site-identity.mjs --json` gives `{ checked, ok, places: [{ id, agent_key, site_key, signature, ok, problems }] }`.
- `--warn` prints one `WARN site-identity: <id>: ...` line per place that fails; `--strict` exits 1 (for later, at Dinis's word).
- Or import it: `import { checkSites } from '../../board/abp/tools/site-identity.mjs'` and `checkSites(ROOT)`.

A sketch for `newsroom/build/validate.js` (CommonJS), a warning only:

```js
// site identity (abp@, board/abp/policies.json site_identity): a warning tonight, an error later at Dinis's word
try {
    const r = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'board/abp/tools/site-identity.mjs'), '--json'], { cwd: ROOT, encoding: 'utf8' })
    for (const p of JSON.parse(r.stdout).places.filter(p => !p.ok)) warnings.push(`site-identity: ${p.id}: ${p.problems.join('; ')}`)
} catch (e) { warnings.push(`site-identity: the check did not run (${e.message})`) }
```

It reads only `data/by-place/places.json`, `data/by-place/<id>.json(.sig)` and `board/keys.json`. A signature is pki-agent.mjs's: ECDSA P-256 over the file's raw bytes, so anything that rewrites a place file (a formatter, a merge, a derive step) breaks its signature; the place agent signs again. Tell abp@ in a commit `For:` if the shape does not fit the gate.
