'use strict';

/* ═══════════════════════════════════════════════════════════
   site-music.js — renders the "Listening to" section.
   Single responsibility: one section, one function.
═══════════════════════════════════════════════════════════ */
function renderMusic(tracks) {
  const row = $('music-row');
  row.innerHTML = '';

  if (!tracks || !tracks.length) {
    row.innerHTML = '<li style="font-family:var(--font-mono,monospace);font-size:11px;color:var(--dark-muted)">no tracks configured</li>';
    return;
  }

  tracks.forEach(t => {
    const li     = el('li', { class: 'music-card' });
    const cover  = el('figure', { class: 'music-cover' });
    const img    = el('img', { src: t.artworkUrl, alt: `${t.trackName} by ${t.artistName}`, loading: 'lazy' });
    cover.appendChild(img);

    li.append(
      cover,
      el('p', { class: 'music-track' }, t.trackName),
      el('p', { class: 'music-artist' }, t.artistName),
    );
    row.appendChild(li);
  });
}
