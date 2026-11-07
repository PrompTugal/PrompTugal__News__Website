// The form of an article's markdown twin that its signature covers: the twin with the site version taken out, so a
// signature stays good across releases (the twin carries the version twice: in its source line and its agent block;
// both come from newsroom/build/lib/shell.mjs). Used by the gate (validate.js, check 8) to verify, and by
// newsroom/tools/sign-article.mjs to sign. A .sig made over this form says so: "form": FORM.
'use strict'
// Form 2 (7 November 2026, synthetic@'s F43) also takes out the agent block's "built by" line, so the site can say who
// builds it without breaking a signature. A form 1 signature covered that line as it then read: it is checked with the
// line put back as it was, so no article goes red while journalist@ re-signs in form 2.
const FORM = 'twin-without-version-or-builder/2'
const LEGACY_FORM = 'twin-without-version/1'
const LEGACY_BUILT_BY = 'built by: newsroom@web-summit.dinis (a Claude Code session), operator Dinis Cruz'
const noVersion = twin => twin
    .replace(/^(\*Source: <[^>\n]+> · site )v\d+\.\d+\.\d+( ·)/m, '$1VERSION$2')
    .replace(/^version: v\d+\.\d+\.\d+$/m, 'version: VERSION')
// only the agent block's line, the last of its shape (security@, 7 November 06:05): a body line that looks like it stays
// signed, and the gate refuses a twin with more than one (builderLines)
const BUILT_BY = /^built by: .*$/gm
const builderLines = twin => (twin.match(BUILT_BY) || []).length
const lastBuiltBy = (twin, line) => { let at = -1, len = 0; for (const m of twin.matchAll(BUILT_BY)) { at = m.index; len = m[0].length } return at < 0 ? twin : twin.slice(0, at) + line + twin.slice(at + len) }
const signedForm = twin => lastBuiltBy(noVersion(twin), 'built by: BUILDER')
const signedFormFor = (form, twin) => form === FORM ? signedForm(twin) : noVersion(lastBuiltBy(twin, LEGACY_BUILT_BY))
module.exports = { FORM, LEGACY_FORM, signedForm, signedFormFor, builderLines }
