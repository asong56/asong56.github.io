'use strict';

/* ═══════════════════════════════════════════════════════════
   site-season.js — seasonal atmosphere class toggle.
   index.txt §14: only changes atmosphere, never layout.
   Single responsibility: date → body class. Nothing else.
═══════════════════════════════════════════════════════════ */
function applySeason() {
  const m = new Date().getMonth() + 1; // 1–12
  let season;
  if ([12, 1, 2].includes(m))      season = 'winter';
  else if ([3, 4, 5].includes(m))  season = 'spring';
  else if ([6, 7, 8].includes(m))  season = 'summer';
  else                              season = 'autumn';
  document.body.classList.add('season-' + season);
}
