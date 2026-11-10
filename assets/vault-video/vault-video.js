// A video played straight out of a public SG/Vault (journalist@PrompTugal.dinis, 10 November 2026, at Dinis Cruz's word:
// "the video should go on the vault, and you need to embed the vault on the page").
//
// <figure class="vault-video" data-endpoint data-vault data-key data-path> holds the vault's public read key and the
// folder of the video. The folder has manifest.json, poster.jpg and the video as 4-second fragmented-MP4 segments
// (init.mp4, seg-NNN.m4s), each under the vault's 4 MB object limit, so every byte comes through the vault's read API
// (which answers any origin) and is decrypted here with Web Crypto, by SGVaultEmbed.Reader
// (assets/vendor/sgit-ai/2026-11-05/vault-embed.js). Nothing is fetched until the reader presses play, except the
// poster. Played through Media Source Extensions where the browser has them (it starts after the first segments);
// otherwise the segments are joined into one Blob and played from that. Vault strings reach the page as text only.
(() => {
    'use strict'
    const boxes = [...document.querySelectorAll('figure.vault-video')]
    if (!boxes.length || !window.SGVaultEmbed) return
    const dec = new TextDecoder()
    const el = (tag, attrs = {}, kids = []) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'text') e.textContent = v; else e.setAttribute(k, v) } e.append(...kids); return e }
    const mb = n => (n / 1048576).toFixed(1) + ' MB'

    for (const box of boxes) mountOne(box).catch(err => {
        const s = box.querySelector('.vv-status'); if (s) s.textContent = 'The video could not be opened from the vault: ' + (err && err.message || err)
    })

    async function mountOne(box) {
        const cfg = { endpoint: box.dataset.endpoint, vault_id: box.dataset.vault, read_key: box.dataset.key.replace(/^sgit_public_read_/, '') }
        const dir = box.dataset.path.replace(/\/$/, '') + '/'
        const status = el('p', { class: 'vv-status', text: 'Opening the vault ' + cfg.vault_id + ': deriving ids, fetching ciphertext, decrypting…' })
        const video = el('video', { controls: '', playsinline: '', preload: 'none' })
        const stage = el('div', { class: 'vv-stage' }, [video])
        const play = el('button', { type: 'button', class: 'vv-play', 'aria-label': 'Play the interview' }, [el('span', { text: '▶' })])
        stage.append(play)
        box.prepend(stage, status)

        const R = await new window.SGVaultEmbed.Reader(cfg).init()
        await R.open()
        const man = JSON.parse(dec.decode(await R.readBytes(dir + 'manifest.json')))
        try { video.poster = URL.createObjectURL(new Blob([await R.readBytes(dir + 'poster.jpg')], { type: 'image/jpeg' })) } catch { }
        const files = [man.init, ...man.segments.map(s => s.file)]
        const total = man.total_bytes || 0
        const mins = Math.floor(man.duration / 60), secs = String(Math.round(man.duration % 60)).padStart(2, '0')
        status.textContent = `From vault ${cfg.vault_id}, decrypted in your browser: ${mins}:${secs}, ${files.length} encrypted pieces, ${mb(total)}. Press play.`

        let started = false
        const start = () => { if (started) return; started = true; play.remove(); (canMSE(man.mime) ? viaMSE : viaBlob)(R, dir, files, man, video, status, total).catch(e => { status.textContent = 'Playback failed: ' + (e && e.message || e) }) }
        play.addEventListener('click', start)
        video.addEventListener('play', () => { if (!started) { video.pause(); start() } }, { once: true })
    }

    function canMSE(mime) {
        const MS = window.ManagedMediaSource || window.MediaSource
        return !!(MS && MS.isTypeSupported && MS.isTypeSupported(mime))
    }

    // fetch the pieces a few at a time, hand them over in order
    async function* pieces(R, dir, files, onBytes) {
        const ahead = 4, queue = []
        let next = 0
        const take = () => { const f = files[next++]; const p = R.readBytes(dir + f).then(b => { onBytes(b.length); R.mem.clear(); return b }); queue.push(p) }
        while (next < files.length && queue.length < ahead) take()
        while (queue.length) { const b = await queue.shift(); if (next < files.length) take(); yield b }
    }

    async function viaMSE(R, dir, files, man, video, status, total) {
        const Managed = !!window.ManagedMediaSource, MS = window.ManagedMediaSource || window.MediaSource
        const ms = new MS()
        if (Managed) video.disableRemotePlayback = true
        video.src = URL.createObjectURL(ms)
        await new Promise(r => ms.addEventListener('sourceopen', r, { once: true }))
        ms.duration = man.duration
        const sb = ms.addSourceBuffer(man.mime)
        const appended = b => new Promise((res, rej) => { sb.addEventListener('updateend', res, { once: true }); sb.addEventListener('error', rej, { once: true }); sb.appendBuffer(b) })
        let got = 0, n = 0
        for await (const b of pieces(R, dir, files, x => { got += x })) {
            await appended(b); n++
            status.textContent = `Streaming from the vault, decrypted in your browser: ${n} of ${files.length} pieces (${mb(got)} of ${mb(total)}).`
            if (n === 3) video.play().catch(() => { })
        }
        ms.endOfStream()
        status.textContent = `Played from vault ${R.vaultId}: all ${files.length} pieces fetched and decrypted in your browser (${mb(got)}).`
    }

    async function viaBlob(R, dir, files, man, video, status, total) {
        const parts = []; let got = 0
        for await (const b of pieces(R, dir, files, x => { got += x; status.textContent = `Fetching and decrypting from the vault: ${mb(got)} of ${mb(total)}…` })) parts.push(b)
        video.src = URL.createObjectURL(new Blob(parts, { type: 'video/mp4' }))
        status.textContent = `Played from vault ${R.vaultId}: all ${files.length} pieces fetched and decrypted in your browser (${mb(got)}).`
        video.play().catch(() => { })
    }
})()
