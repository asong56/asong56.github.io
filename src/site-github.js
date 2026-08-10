'use strict';

/* ═══════════════════════════════════════════════════════════
   site-github.js — renders everything derived from
   generated.json's github block: identity, commits,
   featured, recommended, ticker. Nothing else.
═══════════════════════════════════════════════════════════ */

function renderIdentity(user) {
  if (!user) return;

  const fig = $('gh-avatar');
  fig.innerHTML = '';
  fig.appendChild(el('img', { src: user.avatar_url + '&s=128', alt: user.login }));

  $('gh-name').textContent   = user.name || user.login;
  $('gh-handle').textContent = '@' + user.login;
  if (user.bio) $('gh-bio').textContent = user.bio;

  document.title = (user.name || user.login) + ' — Portfolio';
  const metaDesc = $('meta-desc');
  if (metaDesc && user.bio) metaDesc.setAttribute('content', user.bio);
}

function renderCommits(repos) {
  const list = $('commit-ticker');
  list.innerHTML = '';

  const recent = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 6);
  if (!recent.length) { list.innerHTML = '<li>no recent activity</li>'; return; }

  recent.forEach(r => {
    const li = el('li');
    li.append(
      el('span', { class: 'commit-repo' }, r.name),
      el('time', { datetime: isoDate(r.pushed_at) }, timeAgo(r.pushed_at)),
    );
    list.appendChild(li);
  });
}

function renderFeatured(repos, featuredIds) {
  const idSet = new Set(featuredIds);
  const top3  = repos.filter(r => idSet.has(r.id))
                      .sort((a, b) => b.stargazers_count - a.stargazers_count);

  const ol = $('featured-list');
  ol.innerHTML = '';

  top3.forEach(r => {
    const li = el('li');
    const a  = el('a', { class: 'project-item', href: r.html_url, target: '_blank', rel: 'noopener' });

    const info = el('span');
    info.append(
      el('p', { class: 'project-name' }, r.name),
      el('p', { class: 'project-desc' }, r.description || '—'),
    );

    const meta  = el('span', { class: 'project-meta' });
    const stars = el('p', { class: 'stars' });
    stars.innerHTML = `<b>★</b> ${fmtNum(r.stargazers_count)}`;
    meta.appendChild(stars);
    if (r.language) meta.appendChild(el('p', { class: 'project-lang' }, r.language));

    a.append(info, meta);
    li.appendChild(a);
    ol.appendChild(li);
  });
}

function renderRecommended(hiddenPool) {
  if (!hiddenPool || !hiddenPool.length) {
    $('recommended-card').style.display = 'none';
    return;
  }
  const r = hiddenPool[Math.floor(Math.random() * hiddenPool.length)];

  const card = $('recommended-card');
  card.href = r.html_url;
  $('recommended-name').textContent = r.name;
  $('recommended-desc').textContent = r.description || '—';
}

function renderTicker(repos) {
  const track  = $('ticker-track');
  const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

  const makeItems = () => sorted.map(r => {
    const li = el('li', { class: 'ticker-item' });
    li.appendChild(el('a', { href: r.html_url, target: '_blank', rel: 'noopener' }, r.name));
    return li;
  });

  track.innerHTML = '';
  [...makeItems(), ...makeItems()].forEach(li => track.appendChild(li));
}
