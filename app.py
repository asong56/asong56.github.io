"""
asong56.github.io — Flask application
--------------------------------------
Routes never need to change. Add content by:
  - Editing files in data/
  - Adding .md files to content/<channel>/
  - Running: python sync.py
"""
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, abort, render_template

app = Flask(__name__)

DATA_DIR   = Path(__file__).parent / "data"
CONTENT_DIR = Path(__file__).parent / "content"


# ── Data loading ──────────────────────────────────────────────────────────────

def load_data() -> dict[str, Any]:
    """Merge all data/*.json into one dict keyed by filename stem.
    Files starting with _ are skipped (e.g. _template.json).
    """
    data: dict[str, Any] = {}
    for path in sorted(DATA_DIR.glob("*.json")):
        if path.stem.startswith("_"):
            continue
        with path.open(encoding="utf-8") as f:
            data[path.stem] = json.load(f)
    return data


DATA = load_data()

# Build a fast lookup: slug → channel config
_CHANNELS: dict[str, dict] = {ch["slug"]: ch for ch in DATA.get("channels", [])}


# ── Context processor ─────────────────────────────────────────────────────────

@app.context_processor
def inject_globals():
    return {"year": datetime.now(timezone.utc).year}


# ── Template filters ──────────────────────────────────────────────────────────

_REV_FMTS = (
    "%Y%m%dT%H%M%SZ",
    "%Y%m%dT%H%M%S",
    "%Y-%m-%dT%H:%M:%SZ",
    "%Y-%m-%d",
)


def _parse_rev(rev: str) -> datetime | None:
    for fmt in _REV_FMTS:
        try:
            return datetime.strptime(rev.strip(), fmt)
        except ValueError:
            continue
    return None


@app.template_filter("format_rev")
def format_rev(rev: str) -> str:
    """20260613T103944Z → Jun 13, 2026"""
    dt = _parse_rev(rev)
    return dt.strftime("%b %-d, %Y") if dt else rev


@app.template_filter("iso_rev")
def iso_rev(rev: str) -> str:
    """20260613T103944Z → 2026-06-13T10:39:44Z"""
    dt = _parse_rev(rev)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ") if dt else rev


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index() -> str:
    return render_template("index.html", data=DATA)


@app.route("/<channel>/")
def channel_index(channel: str) -> str:
    if channel not in _CHANNELS:
        abort(404)
    from db import get_entries, init_db
    init_db()
    return render_template(
        "channel.html",
        data=DATA,
        channel=_CHANNELS[channel],
        entries=get_entries(channel),
    )


@app.route("/<channel>/<slug>/")
def channel_entry(channel: str, slug: str) -> str:
    if channel not in _CHANNELS:
        abort(404)
    from db import get_entry, init_db
    init_db()
    entry = get_entry(channel, slug)
    if entry is None:
        abort(404)
    return render_template(
        "entry.html",
        data=DATA,
        channel=_CHANNELS[channel],
        entry=entry,
    )


@app.route("/feed.xml")
def feed() -> str:
    from db import get_entries, init_db
    init_db()
    # Collect recent entries across all channels
    all_entries = []
    for slug in _CHANNELS:
        for row in get_entries(slug):
            all_entries.append((slug, row))
    # Sort by rev descending, take 20
    all_entries.sort(key=lambda x: x[1]["rev"] or "", reverse=True)
    response = render_template(
        "feed.xml",
        data=DATA,
        entries=all_entries[:20],
    )
    from flask import Response
    return Response(response, mimetype="application/atom+xml")


@app.errorhandler(404)
def not_found(_):
    return render_template("404.html", data=DATA), 404


# ── Dev server ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    debug = os.getenv("FLASK_ENV", "production").lower() == "development"
    app.run(debug=debug, port=5000)
