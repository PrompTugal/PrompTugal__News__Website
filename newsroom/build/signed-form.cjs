// The form of an article's markdown twin that its signature covers: the twin with the site version taken out, so a
// signature stays good across releases (the twin carries the version twice: in its source line and its agent block;
// both come from newsroom/build/lib/shell.mjs). Used by the gate (validate.js, check 8) to verify, and by
// newsroom/tools/sign-article.mjs to sign. A .sig made over this form says so: "form": FORM.
'use strict'
const FORM = 'twin-without-version/1'
const signedForm = twin => twin
    .replace(/^(\*Source: <[^>\n]+> · site )v\d+\.\d+\.\d+( ·)/m, '$1VERSION$2')
    .replace(/^version: v\d+\.\d+\.\d+$/m, 'version: VERSION')
module.exports = { FORM, signedForm }
