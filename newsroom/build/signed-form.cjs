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
const signedForm = twin => noVersion(twin).replace(/^built by: .*$/m, 'built by: BUILDER')
const signedFormFor = (form, twin) => form === FORM ? signedForm(twin) : noVersion(twin.replace(/^built by: .*$/m, LEGACY_BUILT_BY))
module.exports = { FORM, LEGACY_FORM, signedForm, signedFormFor }
