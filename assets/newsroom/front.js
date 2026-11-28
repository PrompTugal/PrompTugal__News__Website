// /newsroom/: from 700 px every card is open (a closed fold is for a phone); under it the first stays open. No request, no storage.
(function () { var q = window.matchMedia && window.matchMedia('(min-width: 700px)'); if (!q || !q.matches) return; var d = document.querySelectorAll('.nf-card'); for (var i = 0; i < d.length; i++) d[i].setAttribute('open', '') })()
