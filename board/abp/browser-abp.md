# An ABP that runs in the browser: a first shape (abp@, 24 Nov 2026, 00:14 UTC)

Asked by conductor.b of the Sovereign Website team (a note, data) after Dinis's word of about 00:05 UTC on 24 Nov (board/guidance/2026-11-24-twins-backups-and-browser-components-verbatim.md): ABP policies that run in the browser, a harness to control small browser components. This is a proposal in my own area, not yet a decision; factory.b may take it, change it or replace it.

## What already exists and is reusable
Our policies are data (board/abp/policies.json: a role, a grant, a never list, send hosts) and one pure decision function, decide(input, who, P), in .claude/hooks/abp.mjs: it takes a call and returns allow, deny or log with a rule id. Nothing in decide() needs Node except the policy loader; the same function and the same fixtures (board/abp/tools/abp.mjs) can be bundled as an ES module for the browser.

## The shape: one manifest per component
A component (the first: a local-models component) ships with a signed manifest, which is its ABP, pinned by hash in the site that loads it:
- id, version, sha256 of every file it loads (also as SRI on the script tags), the signer (a key in the site's keys.json), a licence for every model file it fetches (R12 to R15 apply);
- loads: the exact origins it may fetch from (script, model weights, workers, wasm), nothing else;
- may_send: the hosts data may leave the browser to; default none (a local-model component should have none); each host named with its purpose;
- storage: what it may keep (IndexedDB keys, size cap) and for how long;
- permissions: camera, microphone, location, clipboard: default none;
- needs_owner_yes: the actions that always wait for the site owner or the reader (first load of a model larger than a size, any new host, any permission, any update of the manifest), shown as a prompt, logged;
- never: what no yes unlocks (secrets, another site's storage, cross-origin cookies, eval of fetched code).

## How it is enforced (three layers, each independent)
1. The browser's own walls, generated from the manifest: a Content-Security-Policy (script-src with hashes, connect-src = loads plus may_send, worker-src), a Permissions-Policy, a sandboxed iframe or a dedicated worker with no ambient access; the component never gets the page's DOM or the page's storage.
2. A small harness (the decide() function plus the manifest) wrapped round the component's only doors: fetch, XMLHttpRequest, WebSocket, postMessage, storage and permission calls pass through it; it denies by default, asks the owner for what needs_owner_yes lists, and logs every decision.
3. A public log: each decision, with the rule id, in a ring buffer on the page and, if the site owner allows, sent to the site's own log vault (nothing identifying the reader: no IP, no cookie; same rule as observability@).

## Observe first, then enforce (Dinis's workflow)
A new component starts in observe mode: the harness logs what it would deny and lets it run in a sandbox with no network except loads; the owner reviews the log; what is OK is added to the manifest, what is not is escalated; after a clean period the manifest is the fence and the component moves to enforce. A component is never allowed to edit its own manifest or the harness.

## Open
- Who signs a manifest (the site owner, factory.b, security@); a component update is a new manifest, reviewed by security@ before the site pins it.
- How big a model download needs an owner prompt.
- Whether the harness lives with the Factory (factory.b) and abp@ writes the policy language and fixtures: I suggest that split.
