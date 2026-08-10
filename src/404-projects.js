'use strict';

/* ═══════════════════════════════════════════════════════════
   404-projects.js — hidden project card: load, render, wander.
   Single responsibility: this page's actual content.
   Reads generated.json's hidden_pool — no client-side GitHub
   API calls, no rate limits, works offline once cached.
═══════════════════════════════════════════════════════════ */
let pool      = [];
let lastIndex = -1;

async function loadHiddenProjects() {
  try {
    const data = await fetch('generated.json').then(r => r.json());
    pool = (data.hidden_pool || []).slice().sort(() => Math.random() - 0.5);

    if (!pool.length) throw new Error('hidden_pool is empty');

    lastIndex = 0;
    renderProject(pool[0]);
  } catch (e) {
    console.warn('generated.json error:', e);
    document.getElementById('error-msg').classList.add('visible');
    clearSkeletons();
  }
}

function pickNext() {
  if (!pool.length) return null;
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); }
  while (idx === lastIndex && pool.length > 1);
  lastIndex = idx;
  return pool[idx];
}

function initWanderButton() {
  document.getElementById('wander-btn').addEventListener('click', () => {
    const card = document.getElementById('project-card');
    card.classList.add('swapping-out');
    card.addEventListener('animationend', () => {
      card.classList.remove('swapping-out');
      const next = pickNext();
      if (next) renderProject(next);
      card.classList.add('swapping-in');
      card.addEventListener('animationend', () => card.classList.remove('swapping-in'), { once: true });
    }, { once: true });
  });
}

function renderProject(repo) {
  if (!repo) return;

  const nameEl = document.getElementById('proj-name');
  nameEl.innerHTML = '';
  const nameLink = el('a', { href: repo.html_url, target: '_blank', rel: 'noopener noreferrer' }, repo.name);
  nameEl.appendChild(nameLink);

  document.getElementById('proj-description').textContent = repo.description || '—';

  const meta = document.getElementById('card-meta');
  meta.innerHTML = '';

  if (repo.stargazers_count) meta.appendChild(metaSpan(ICONS.star(), fmtNum(repo.stargazers_count), `${repo.stargazers_count} stars`));
  if (repo.forks_count)      meta.appendChild(metaSpan(ICONS.fork(), fmtNum(repo.forks_count), `${repo.forks_count} forks`));

  const links = el('span', { class: 'meta-links' });

  /* has_pages + homepage baked into generated.json at build time */
  if (repo.has_pages && repo.homepage) {
    links.appendChild(metaLink(repo.homepage, ICONS.globe(), 'try it'));
  }
  links.appendChild(metaLink(repo.html_url, ICONS.arrow(), 'open'));
  meta.appendChild(links);
}

function clearSkeletons() {
  document.getElementById('proj-name').textContent = 'no projects found';
  document.getElementById('proj-description').textContent = '';
  document.getElementById('card-meta').innerHTML = '';
}

function metaSpan(svgEl, text, label) {
  const span = el('span', { class: 'meta-item', 'aria-label': label });
  span.appendChild(svgEl);
  span.appendChild(el('span', {}, text));
  return span;
}

function metaLink(href, svgEl, text) {
  const a = el('a', { class: 'meta-item', href, target: '_blank', rel: 'noopener noreferrer' });
  a.appendChild(svgEl);
  a.appendChild(el('span', {}, text));
  return a;
}
