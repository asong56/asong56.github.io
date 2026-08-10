'use strict';

/* ═══════════════════════════════════════════════════════════
   format.js — display formatting helpers only.
   No DOM, no fetch, no state.
═══════════════════════════════════════════════════════════ */
function fmtNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function isoDate(str) {
  return new Date(str).toISOString().slice(0, 10);
}

function timeAgo(str) {
  const s = Math.floor((Date.now() - new Date(str)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}
