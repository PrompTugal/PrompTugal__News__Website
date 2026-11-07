<section class="hero hero-a" style="background-image:url('{{heroImg}}')"><div class="wrap"><p class="kicker">{{A.kicker}}</p><h1>{{A.title}}</h1><p class="lead">{{A.lead}}</p>
<p class="hero-cta"><a class="btn btn-g" href="#route">{{t.route.title}} ↓</a><a class="btn btn-w" href="#feedback">{{t.feedback.title}}</a></p></div></section>
<section class="pts"><div class="wrap"><div class="pt-g">{{#points}}<div class="pt"><span class="pt-n">{{i}}</span><h2>{{t}}</h2><p>{{d}}</p></div>{{/points}}</div></div></section>
<section class="route" id="route"><div class="wrap"><h2>{{t.route.title}}</h2><p class="lead">{{t.route.lead}}</p>
<ol class="rt">{{#route}}<li>{{> deckcard}}</li>{{/route}}</ol></div></section>
<section class="ask"><div class="wrap ask-g"><div><h2>{{A.ask_title}}</h2><ul class="ticks">{{#A.asks}}<li>{{.}}</li>{{/A.asks}}</ul></div>
<div><h2>{{A.next_title}}</h2><ol class="steps">{{#A.next}}<li>{{.}}</li>{{/A.next}}</ol></div></div></section>
<section class="more"><div class="wrap"><h2>{{t.shell.footer_library}}</h2><p class="chips">{{#more}}<a href="{{href}}">{{label}}</a>{{/more}}</p></div></section>
{{> feedback}}
