<article class="prose wrap"><p class="kicker">{{t.articles.by}} · {{date}}</p><h1>{{title}}</h1><p class="lead">{{summary}}</p>
{{#fallback}}<p class="note">{{t.shell.fallback}} {{fallback}}.</p>{{/fallback}}{{{html}}}
{{#linkedin}}<aside class="li"><h2>{{t.articles.share}}</h2><pre>{{linkedin}}</pre><p><a class="btn" href="{{share}}">{{t.articles.share}} →</a></p></aside>{{/linkedin}}
</article>
{{> feedback}}
