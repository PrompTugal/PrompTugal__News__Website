// PrompTugal.news by place: the playful local-voice toggle (Dinis's brief, 14 Nov 2026: "Algarvio, with each town's own
// sayings and place references ... the facts stay identical, it is clearly labelled as playful"). Shown only where the
// place's agent has written a voice; the choice is remembered per reader in this browser only.
(function () {
    var frame = document.querySelector('.bp-frame')
    if (!frame || !frame.querySelector('.bp-voice')) return
    var mast = frame.querySelector('.bp-mast')
    if (!mast) return
    var label = document.createElement('p'); label.className = 'bp-voice-label'
    label.textContent = 'Playful local voice: same facts, said the Algarvio way'
    mast.insertBefore(label, mast.firstChild)
    var b = document.createElement('button'); b.type = 'button'; b.className = 'bp-toggle'
    var KEY = 'pt-bp-voice'
    function set(on) { frame.classList.toggle('voice', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? 'Back to plain English' : 'Say it in Algarvio'; try { localStorage.setItem(KEY, on ? '1' : '0') } catch (e) {} }
    b.addEventListener('click', function () { set(!frame.classList.contains('voice')) })
    mast.appendChild(b)
    var on = false; try { on = localStorage.getItem(KEY) === '1' } catch (e) {}
    set(on)
})()
