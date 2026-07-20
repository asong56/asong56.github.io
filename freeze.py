"""
Static site freeze — produces the build/ directory for GitHub Pages.

This file never needs to change. Adding a new channel:
  1. Create content/<slug>/ directory
  2. Add entry to data/channels.json
  3. Run: python sync.py && python freeze.py
"""
import json
import os
import shutil
import sys
from pathlib import Path
from typing import Iterable

try:
    from PIL import Image, UnidentifiedImageError
    PILLOW = True
except ModuleNotFoundError:
    PILLOW = False

from flask_frozen import Freezer

from app import app
from db import get_entries, init_db
from scss import compile_scss

# ── Config ────────────────────────────────────────────────────────────────────

app.config.update(
    FREEZER_DESTINATION          = "build",
    FREEZER_IGNORE_MIMETYPE_WARNINGS = True,
    FREEZER_RELATIVE_URLS        = True,
    FREEZER_REMOVE_EXTRA_FILES   = True,
    FREEZER_BASE_URL             = os.getenv("FREEZER_BASE_URL", "http://localhost/"),
)

freezer = Freezer(app)

DATA_DIR = Path("data")


def _load_channels() -> list[str]:
    path = DATA_DIR / "channels.json"
    channels = json.loads(path.read_text()) if path.exists() else []
    return [ch["slug"] for ch in channels]


# ── URL generators ────────────────────────────────────────────────────────────

@freezer.register_generator
def channel_index():
    for slug in _load_channels():
        yield {"channel": slug}


@freezer.register_generator
def channel_entry():
    init_db()
    for slug in _load_channels():
        for row in get_entries(slug):
            yield {"channel": slug, "slug": row["slug"]}


@freezer.register_generator
def feed():
    yield {}


# ── Image optimization ────────────────────────────────────────────────────────

_IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def optimize_images(root: Path = Path("static/images")) -> bool:
    if not PILLOW:
        print("⚠   Pillow not installed — skipping image optimization")
        return True
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in _IMG_EXTS:
            continue
        try:
            with Image.open(p) as img:
                kw = {"optimize": True}
                if img.format in {"JPEG", "WEBP"}:
                    kw["quality"] = 85
                img.save(p, format=img.format, **kw)
        except Exception as e:
            print(f"❌  Image optimization failed for {p}: {e}")
            return False
    print("✅  Images optimized")
    return True


# ── Build ─────────────────────────────────────────────────────────────────────

REQUIRED = [
    "index.html",
    "feed.xml",
    os.path.join("static", "css", "styles.css"),
    os.path.join("static", "images", "favicon-96x96.png"),
    os.path.join("static", "images", "profile.webp"),
]


def verify(build: str) -> bool:
    missing = [f for f in REQUIRED if not os.path.exists(os.path.join(build, f))]
    if missing:
        print("❌  Missing artifacts:")
        for f in missing:
            print(f"    - {f}")
        return False
    print("✅  Build verified")
    return True


if __name__ == "__main__":
    os.environ["FLASK_ENV"] = "production"

    if not os.getenv("SKIP_CSS") and not compile_scss():
        sys.exit(1)

    if not optimize_images():
        sys.exit(1)

    build = app.config["FREEZER_DESTINATION"]
    if os.path.exists(build):
        print(f"🧹  Cleaning {build}/")
        shutil.rmtree(build)

    print(f"❄   Freezing → {build}/")
    try:
        freezer.freeze()
    except Exception as e:
        print(f"❌  Freeze failed: {e}")
        sys.exit(1)

    if not verify(build):
        sys.exit(1)

    print("🎉  Done")
