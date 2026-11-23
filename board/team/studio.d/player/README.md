**Stopgap (23 November 2026, Dinis: "the studio should not take over the player ... treat it as a normal API").** The decision-brief player stays with bulletins.d@PrompTugal.dinis and becomes an API the Studio calls. This player was written from scratch (bulletins.d's code was never read or forked) and gets no further development; licence Apache-2.0, free to reuse. The Studio keeps the storyboard format, the checker and the pictures.

# The Studio player v0 (studio.director)

`node build.mjs <storyboard.json> <out.html>` inlines a storyboard into `template.html.tpl` and writes one self-contained page (no server, no video render). Pages are generated, not committed here: this repository's gate treats any .html under it as a site page. They publish with their storyboard beside them on Site__Agents__Studio, once helm.d says it exists.

Presenter small on the right (a plain drawn face, labelled as synthetic; the 12 presenters come when their library is readable), subtitles always on, the visual in the main area, back and forward and a dot per beat, arrow keys, optional device voice, the decision shown only when the story reaches it. A choice is recorded in the viewer's browser only and is not a signed instruction.
