#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════
   scripts/update.js
   Runs in CI (.github/workflows/update.yml) on a schedule.
   Reads config.yml, fetches GitHub + iTunes data ONCE at build
   time, writes generated.json to repo root. The static site
   (src/*.js) reads generated.json — no client-side API calls,
   no rate limits for visitors, works even if APIs are down.
═══════════════════════════════════════════════════════════ */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ── tiny YAML parser — same subset used by src/site.js ── */
function parseYaml(text) {
  const lines  = text.split('\n');
  const result = {};
  const stack  = [{ obj: result, indent: -1 }];
  const clean  = (s) => s.replace(/#.*$/, '').trimEnd();

  let i = 0;
  while (i < lines.length) {
    const raw  = lines[i];
    const line = clean(raw);
    if (!line.trim()) { i++; continue; }

    const indent  = raw.length - raw.trimStart().length;
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parent  = stack[stack.length - 1].obj;
      const keys    = Object.keys(parent);
      const lastKey = keys[keys.length - 1];
      if (lastKey && !Array.isArray(parent[lastKey])) parent[lastKey] = [];
      if (lastKey) parent[lastKey].push(val);
      i++;
      continue;
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj;

    if (val === '') {
      parent[key] = {};
      stack.push({ obj: parent[key], indent });
    } else {
      parent[key] = val;
    }
    i++;
  }
  return result;
}

async function getJSON(url, opts = {}) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

/* ═══════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════ */
async function main() {
  const cfg = parseYaml(fs.readFileSync(path.join(__dirname, '..', 'config.yml'), 'utf8'));
  const gh  = cfg.github;

  console.log(`Fetching GitHub data for ${gh}...`);

  const [user, repos] = await Promise.all([
    getJSON(`https://api.github.com/users/${gh}`),
    getJSON(`https://api.github.com/users/${gh}/repos?per_page=100&sort=updated`),
  ]);

  const activeRepos = repos.filter(r => !r.fork && !r.archived);

  /* featured = top 3 by stars (mirrors src/site.js render logic,
     computed once here so 404 can exclude the same set) */
  const featured = [...activeRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);
  const featuredIds = new Set(featured.map(r => r.id));

  /* recent = most recently pushed, not in featured */
  const recent = [...activeRepos]
    .filter(r => !featuredIds.has(r.id))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0] || null;

  /* hidden pool = everything not featured — this is what 404.html wanders through */
  const hidden = activeRepos.filter(r => !featuredIds.has(r.id));

  console.log(`Fetching latest thought (notes_api)...`);
  const thought = await loadNotes(cfg).catch(e => {
    console.warn('Notes fetch failed:', e.message);
    return null;
  });

  console.log(`Fetching ${cfg.music?.artists?.length || 0} music artists via iTunes...`);
  const music = await loadMusic(cfg).catch(e => {
    console.warn('Music fetch failed:', e.message);
    return [];
  });

  const generated = {
    generated_at: new Date().toISOString(),
    github: {
      user: pickUserFields(user),
      repos: activeRepos.map(pickRepoFields),
      featured_ids: [...featuredIds],
      recent: recent ? pickRepoFields(recent) : null,
    },
    hidden_pool: hidden.map(pickRepoFields),
    thought,
    music,
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'generated.json'),
    JSON.stringify(generated, null, 2)
  );

  console.log(`Wrote generated.json — ${activeRepos.length} repos, ${music.length} tracks.`);
}

/* keep only fields the frontend actually renders — smaller JSON, no accidental PII */
function pickUserFields(u) {
  return {
    login: u.login,
    name: u.name,
    bio: u.bio,
    avatar_url: u.avatar_url,
    html_url: u.html_url,
    location: u.location,
    company: u.company,
    twitter_username: u.twitter_username,
    blog: u.blog,
    email: u.email,
    followers: u.followers,
    following: u.following,
    public_repos: u.public_repos,
    public_gists: u.public_gists,
    created_at: u.created_at,
  };
}

function pickRepoFields(r) {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    html_url: r.html_url,
    homepage: r.homepage,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    language: r.language,
    pushed_at: r.pushed_at,
    has_pages: r.has_pages,
  };
}

/* ── notes: most recently-committed file in cfg.notes_api folder ── */
async function loadNotes(cfg) {
  const apiUrl = cfg.notes_api;
  if (!apiUrl) return null;

  const contents = await getJSON(apiUrl);
  if (!Array.isArray(contents)) throw new Error('notes_api is not a folder');

  const files = contents.filter(f => f.type === 'file' && /\.(md|txt|markdown)$/i.test(f.name));
  if (!files.length) throw new Error('no notes found');

  const match = apiUrl.match(/repos\/([^/]+)\/([^/]+)\/contents\/?(.*)$/);
  if (!match) throw new Error('could not parse notes_api URL');
  const [, owner, repo, folder] = match;

  const commitTimes = await Promise.all(
    files.map(async f => {
      const p = folder ? `${folder}/${f.name}` : f.name;
      try {
        const commits = await getJSON(
          `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(p)}&per_page=1`
        );
        return { file: f, date: commits[0]?.commit?.committer?.date || null };
      } catch { return { file: f, date: null }; }
    })
  );

  const latest = commitTimes.filter(x => x.date).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  if (!latest) throw new Error('no commit data');

  const rawRes = await fetch(latest.file.download_url);
  const raw    = await rawRes.text();

  const lines     = raw.split('\n').filter(l => l.trim());
  const titleLine = lines.find(l => l.startsWith('#'));
  const title     = titleLine ? titleLine.replace(/^#+\s*/, '') : latest.file.name.replace(/\.(md|txt|markdown)$/i, '');
  const preview   = lines.filter(l => !l.startsWith('#') && l.trim()).join(' ').slice(0, 280) + '…';

  return { title, date: latest.date, preview, link: latest.file.html_url };
}

/* ── music: one random track per configured artist via iTunes Search API ── */
async function loadMusic(cfg) {
  const artists = cfg.music?.artists || [];
  if (!artists.length) return [];

  const results = await Promise.allSettled(
    artists.map(async artist => {
      const data = await getJSON(
        `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&media=music&entity=song&limit=10&country=US`
      );
      const pool = data.results || [];
      if (!pool.length) throw new Error(`no results for ${artist}`);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      return {
        trackName: pick.trackName,
        artistName: pick.artistName,
        artworkUrl: (pick.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
      };
    })
  );

  return results.filter(r => r.status === 'fulfilled').map(r => r.value);
}

main().catch(e => {
  console.error('update.js failed:', e);
  process.exit(1);
});
