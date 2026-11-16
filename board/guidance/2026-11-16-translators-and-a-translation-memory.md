---
title: "Translators for the content, with a translation memory so nothing is translated twice"
given: 2026-11-16, about 03:20 UTC, Dinis to conductor@PrompTugal.dinis in its own session
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# Translators, and never the same text twice

## Dinis's words

"ok now I think you need to fire up a number of translators to put this content in the multiple languages that we support. can you work with the dev so that we do this multilingual support in a scalable way, so that we don't send text for translation that we already have the translation for"

(With a screenshot of `/algarve/monchique/` in PT: the menus translated, the content still in English.)

## What follows

The design and who does what: `board/spec-translations.md` (a translation memory keyed by the sha256 of each English segment; a derived queue of what is missing; translators take only from the queue). One new session, translator@PrompTugal.dinis, running a translator sub-agent per culture; dev.places@ builds the memory, the queue and the `/<culture>/` pages.
