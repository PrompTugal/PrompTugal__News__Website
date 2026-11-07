// Scales the 1920x1080 slides to the window and adds keyboard paging (arrows, space, PageUp/PageDown, Home, End).
(function () {
  const deck = document.querySelector('.deck'); if (!deck) return
  const fit = () => { const s = Math.min(1, (window.innerWidth - 32) / 1920); deck.style.transform = `scale(${s})`; deck.style.marginLeft = ((window.innerWidth - 1920 * s) / 2) + 'px'; document.body.style.height = (deck.scrollHeight * s + 40) + 'px'; deck._s = s }
  addEventListener('resize', fit); addEventListener('load', fit); fit()
  const slides = [...document.querySelectorAll('.slide')]
  const cur = () => { const y = scrollY + 10; let i = 0; slides.forEach((sl, k) => { if (sl.offsetTop * deck._s <= y) i = k }); return i }
  const go = i => { i = Math.max(0, Math.min(slides.length - 1, i)); scrollTo({ top: slides[i].offsetTop * deck._s, behavior: 'smooth' }) }
  addEventListener('keydown', e => { if (['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)) { e.preventDefault(); go(cur() + 1) } else if (['ArrowLeft','ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); go(cur() - 1) } else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1) })
})()
