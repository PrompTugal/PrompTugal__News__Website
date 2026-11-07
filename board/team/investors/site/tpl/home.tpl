<section class="hero" style="background-image:url('{{heroImg}}')"><div class="wrap">
<p class="kicker">{{h.kicker}}</p><h1>{{h.h1}}</h1><p class="lead">{{h.lead}}</p>
<p class="hero-cta"><a class="btn btn-g" href="#who">{{h.cta_who}}</a><a class="btn btn-w" href="/investors/decks/9-the-tour/">{{h.cta_tour}}</a>{{#hasMap}}<a class="btn btn-w" href="/investors/decks/0-the-map/">{{h.cta_map}}</a>{{/hasMap}}</p>
</div></section>
<section class="who" id="who"><div class="wrap"><h2>{{h.who_title}}</h2><p class="lead">{{h.who_lead}}</p><div class="who-g">
{{#cards}}<a class="wc" href="{{href}}"><span class="wc-img" style="background-image:url('{{img}}')"></span><span class="wc-b"><span class="wc-k">{{k}}</span><span class="wc-t">{{t}}</span><span class="wc-d">{{d}}</span><span class="wc-go">→</span></span></a>
{{/cards}}</div></div></section>
<section class="where"><div class="wrap"><h2>{{h.where_title}}</h2><p class="lead">{{h.where_lead}}</p><div class="stats">
{{#h.stats}}<div class="st"><span class="st-n">{{n}}</span><span class="st-l">{{l}}</span></div>{{/h.stats}}
</div><p><a class="btn" href="/investors/what-works/">{{h.where_cta}} →</a></p></div></section>
<section class="decks-home"><div class="wrap"><h2>{{h.decks_title}}</h2><p class="lead">{{h.decks_lead}}</p>
<div class="wall">{{#wall}}<a href="{{href}}" title="{{title}}"><img src="{{cover}}" alt="{{title}}" loading="lazy" width="720" height="405"></a>{{/wall}}</div>
<p class="row"><a class="btn btn-g" href="/investors/decks/">{{h.decks_all}} →</a><a class="btn" href="/investors/sequence/">{{h.decks_seq}} →</a></p></div></section>
{{#hasArticles}}<section class="arts"><div class="wrap"><h2>{{h.articles_title}}</h2><div class="ac-g">{{#articles}}{{> articlecard}}{{/articles}}</div><p><a class="btn" href="/investors/articles/">{{h.articles_all}} →</a></p></div></section>{{/hasArticles}}
{{> feedback}}
