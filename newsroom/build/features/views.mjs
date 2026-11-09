// The list pages' view switch (articles, companies, people), made a real switch on every page that has one
// (board/briefs/2026-11-09-the-mockups-vs-the-live-site.md): assets/views/ (views.js, views.css). The pages keep writing
// <p class="view-switch"> and one <div class="view ..."> per view, so without the script every view shows, as before.
export const order = 99
export const assets = { css: ['assets/views/views.css'], js: ['assets/views/views.js'] }
