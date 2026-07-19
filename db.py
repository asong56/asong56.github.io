"""
SQLite layer for all channel content.

One table — `entries` — stores every channel's posts.
The (channel, slug) pair is the primary key.

Schema mirrors markdown frontmatter keys (uppercase in files, lowercase here):
  REV → rev   (timestamp, canonical: 20260613T103944Z)
  TAG → tag   (comma-separated)
  LNG → lng   (BCP-47 language tag, default "en")

Title is always derived from the first content line at sync time.
"""
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Generator

DB_PATH = Path(__file__).parent / "content.db"


@contextmanager
def _db() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db() -> None:
    with _db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS entries (
                channel  TEXT NOT NULL,
                slug     TEXT NOT NULL,
                title    TEXT DEFAULT '',
                rev      TEXT DEFAULT '',
                tag      TEXT DEFAULT '',
                lng      TEXT DEFAULT 'en',
                content  TEXT NOT NULL DEFAULT '',
                PRIMARY KEY (channel, slug)
            );
            CREATE INDEX IF NOT EXISTS idx_entries_channel_rev
                ON entries (channel, rev DESC);
        """)
        conn.commit()


def get_entries(channel: str) -> list[sqlite3.Row]:
    """Listing view — omits content for performance."""
    with _db() as conn:
        return conn.execute(
            "SELECT channel, slug, title, rev, tag, lng"
            " FROM entries WHERE channel = ? ORDER BY rev DESC",
            (channel,),
        ).fetchall()


def get_entry(channel: str, slug: str) -> sqlite3.Row | None:
    with _db() as conn:
        return conn.execute(
            "SELECT * FROM entries WHERE channel = ? AND slug = ?",
            (channel, slug),
        ).fetchone()


def upsert_entry(
    *,
    channel: str,
    slug: str,
    title: str,
    rev: str,
    tag: str,
    lng: str,
    content: str,
) -> None:
    with _db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO entries"
            " (channel, slug, title, rev, tag, lng, content)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (channel, slug, title, rev, tag, lng, content),
        )
        conn.commit()
