<section class="phead"><div class="wrap"><h1>{{Q.title}}</h1><p class="lead">{{Q.lead}}</p>
<nav class="chips">{{#decks}}<a href="#d-{{id}}">{{n}}. {{title}}</a>{{/decks}}</nav></div></section>
{{#decks}}<details class="seq wrap" id="d-{{id}}"{{#first}} open{{/first}}><summary><h2>{{n}}. {{title}} <span class="muted">{{count}} {{Q.slides}}</span></h2><p>{{for}}</p></summary>
<p><a href="{{href}}">{{t.decks.open}} →</a></p><div class="sq">{{#slides}}<a href="{{href}}"><img src="{{src}}" alt="{{i}}" loading="lazy" width="400" height="225"><span>{{i}}</span></a>{{/slides}}</div></details>
{{/decks}}
