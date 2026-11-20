// Draws the shared map (assets/vendor/ptmap/v1.0.0, designer@'s ptmap, pinned by its sha384 in the gate) into the host the page
// carries: the config is JSON made by the build from its own data (places, London, the EU); nothing is fetched. Without
// JavaScript the host keeps its static drawing.
(function () {
  var host = document.querySelector('[data-ptmap]')
  if (!host || !window.PTMap) return
  var cfg
  try { cfg = JSON.parse(host.getAttribute('data-ptmap')) } catch (e) { return }
  window.PTMap.render(host, cfg)
})()
