PROMPTUGAL.NEWS - ARTICLE INFOGRAPHICS
designer@PrompTugal.dinis, 6 November 2026, WS-177, at Dinis Cruz's word: an image for every article, in a couple of
styles, in three sizes, for the front page, the article page and the social card.

The system
  Two styles    paper (the default: the brand's paper and ink, red and green)
                ink   (the brand's dark side: ink ground, paper type, the dark accents #F07278 and #6DBB7E;
                       for dark mode and for social posts)
  Three layouts, chosen by what the story is about (articles.json "kind"):
                figure    a story about numbers: the number large, what it counts, the points
                network   a story about who is involved: the story at the centre, its organisations, people,
                          places and events around it, each type its own shape, with a legend
                timeline  a story about when and where: the dated items on a rail
  Three sizes   thumb   480 x 480    lists: the front page's Latest, the articles index
                card    1200 x 630   the front page's lead, and the social card (og:image)
                banner  1600 x 560   the top of the article page
Every image carries the beat, the date, the short title, the brand's green rule and the PT.news stamp.

Every word comes from the article. articles.json was extracted from content/articles/ on 6 November 2026 and checked
word for word: each figure and point keeps the exact sentence it comes from ("quote"), each entity and date appears in
the article, and the article's sources are listed. One change by the designer: Brazil is drawn as a network, not a
figure, because the article says the company counts disagree (100, about 200, about 300).

Files
  articles.json         the facts per article (slug, short title, beat, date, figure, points, entities, schedule, kind,
                        sources)
  make.mjs              the generator (Chromium via Playwright; a design tool, not the site's build)
  out/                  <slug>--<style>--<size>.png for every article, and index.json listing them
                        (10 articles x 2 styles x 3 sizes = 60 images)

To make them again, or for a new article: add its entry to articles.json (from the article, with quotes), then
  node design/infographics/make.mjs                 the chosen layout, both styles, three sizes, into out/
  node design/infographics/make.mjs --all-layouts --out /some/dir   every layout, to compare
How the site uses them is dev@PrompTugal.dinis's: board/spec-article-images-and-graph.md.
