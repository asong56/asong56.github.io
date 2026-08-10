'use strict';

/* ═══════════════════════════════════════════════════════════
   dom.js — element creation helpers only.
   No fetch, no business logic.
═══════════════════════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

const el = (tag, attrs = {}, text) => {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  });
  if (text !== undefined) e.textContent = text;
  return e;
};

/* inline SVG icons — kept here since they're pure markup, no logic */
function svgIcon(viewBox, innerMarkup, { stroke = false } = {}) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', viewBox);
  s.setAttribute('aria-hidden', 'true');
  if (stroke) {
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.5');
    s.setAttribute('stroke-linecap', 'round');
  } else {
    s.setAttribute('fill', 'currentColor');
  }
  s.innerHTML = innerMarkup;
  return s;
}

const ICONS = {
  star: () => svgIcon('0 0 16 16', '<path d="M8 1.5l1.85 3.75L14 6.27l-3 2.92.71 4.13L8 11.18l-3.71 2.14.71-4.13-3-2.92 4.15-1.02L8 1.5z"/>'),
  fork: () => svgIcon('0 0 16 16', '<path d="M5 3.25a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zm0 8.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zm5.75-8.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zM3.25 6A.75.75 0 0 0 2.5 6.75v2.5A.75.75 0 0 0 3.25 10h9.5a.75.75 0 0 0 .75-.75v-2.5A.75.75 0 0 0 12.75 6H3.25z"/>'),
  globe: () => svgIcon('0 0 16 16', '<circle cx="8" cy="8" r="6.3"/><path d="M2 8h12M8 1.7c1.6 1.7 2.5 4 2.5 6.3s-.9 4.6-2.5 6.3c-1.6-1.7-2.5-4-2.5-6.3S6.4 3.4 8 1.7z"/>', { stroke: true }),
  arrow: () => svgIcon('0 0 12 12', '<path d="M2 10L10 2M5 2h5v5"/>', { stroke: true }),
};
