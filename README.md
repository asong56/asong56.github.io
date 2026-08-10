# Portfolio

Vanilla HTML/CSS/JS, no frameworks, no build step for the site itself.

## How it works

Data (GitHub profile/repos, iTunes tracks, latest note) is **not** fetched client-side. A scheduled GitHub Action (`.github/workflows/update.yml`) runs `scripts/update.js`, which pulls everything once and writes it to `generated.json`. `index.html` and `404.html` just `fetch('generated.json')`.

```
.
├── .github/workflows/update.yml   # scheduled + on-push data refresh
├── index.html                     # portfolio homepage
├── 404.html                       # hidden-projects "lab" page
├── src/
│   ├── site.css   site.js         # homepage
│   └── 404.css    404.js          # 404 page
├── scripts/
│   └── update.js                  # build-time data fetcher (Node, run in CI)
├── generated.json                 # pre-fetched data, committed by CI
├── config.yml                     # site config — GitHub user, now/music/links, 404 copy
└── README.md
```

## Configuration

Edit `config.yml`:

- `github` — your GitHub username.
- `notes_api` — a GitHub API URL to a folder of `.md`/`.txt` files; the most recently committed one becomes "Latest thought."
- `now` — hand-written taste/status fields an API can't know.
- `music.artists` — searched via the iTunes Search API at build time, one track each.
- `links` — extra footer links (GitHub is added automatically).
- `not_found` — the 404 page's typewriter lines and timing.

## Running locally

```bash
node scripts/update.js
python3 -m http.server
```

## Design

Follow [asong56/acdn](https://github.com/asong56/acdn)