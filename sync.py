"""
Sync markdown files from content/<channel>/ into content.db.

Usage:
    python sync.py           # sync all channels
    python sync.py notes     # sync one channel

File format (.md or .txt):
    ---
    REV: 20260613T103944Z
    TAG: python, systems
    LNG: en
    ---

    First non-empty line becomes the title.
    Body is Markdown — fenced code, tables, nl2br supported.

Slug defaults to the filename stem. Override with a `slug:` frontmatter key.
"""
import re
import sys
from pathlib import Path

import markdown
import yaml

from db import init_db, upsert_entry

CONTENT_DIR = Path(__file__).parent / "content"

_FRONT_RE   = re.compile(r"^---\n(.*?)\n---\n?(.*)", re.DOTALL)
_TITLE_JUNK = re.compile(r"^[>\s#*_`~\-]+")
_MD_EXTS    = ["fenced_code", "tables", "nl2br"]


def _derive_title(body: str, max_len: int = 120) -> str:
    for line in body.splitlines():
        text = _TITLE_JUNK.sub("", line).strip()
        if text:
            return text[:max_len]
    return "Untitled"


def sync_channel(channel_dir: Path) -> int:
    channel = channel_dir.name
    count   = 0

    files = sorted(
        list(channel_dir.glob("*.md")) + list(channel_dir.glob("*.txt"))
    )

    for path in files:
        raw   = path.read_text(encoding="utf-8").replace("\r\n", "\n")
        match = _FRONT_RE.match(raw)

        if not match:
            print(f"  ⚠  {path.name}: no frontmatter, skipping")
            continue

        meta: dict = yaml.safe_load(match.group(1)) or {}
        body        = match.group(2).strip()
        html        = markdown.markdown(body, extensions=_MD_EXTS)

        upsert_entry(
            channel=channel,
            slug=str(meta.get("slug") or path.stem),
            title=_derive_title(body),
            rev=str(meta.get("REV", "")),
            tag=str(meta.get("TAG", "")),
            lng=str(meta.get("LNG", "en")),
            content=html,
        )
        print(f"  ✓  {path.name}")
        count += 1

    return count


def main(targets: list[str] | None = None) -> None:
    init_db()

    if not CONTENT_DIR.exists():
        print("content/ directory not found — nothing to sync")
        return

    dirs = (
        [CONTENT_DIR / t for t in targets]
        if targets
        else [d for d in sorted(CONTENT_DIR.iterdir()) if d.is_dir()]
    )

    total = 0
    for d in dirs:
        if not d.is_dir():
            print(f"Channel not found: {d.name}")
            continue
        print(f"→ {d.name}/")
        total += sync_channel(d)

    print(f"\n🎉  {total} entry/entries synced")


if __name__ == "__main__":
    main(sys.argv[1:] or None)
