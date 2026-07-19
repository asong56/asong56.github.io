"""
CSS build pipeline
──────────────────
1. Downloads ACDN design system from GitHub (cached in .tools/acdn/)
2. Compiles styles.scss with Dart Sass  (load-path includes .tools/)
3. Post-processes with Lightning CSS     (minify + browser targets)

To upgrade ACDN:  change ACDN_REF below, then delete .tools/acdn/ and rebuild.
To change source: change ACDN_URL — the rest is automatic.
"""
import os
import platform
import shutil
import subprocess
import sys
import tarfile
import tempfile
import urllib.request
import zipfile
from pathlib import Path
from typing import Final

# ── ACDN ──────────────────────────────────────────────────────────────────────
# Change ACDN_REF to a tag, branch, or commit SHA to pin a version.
ACDN_REF: Final[str] = os.getenv("ACDN_REF", "main")
ACDN_URL: Final[str] = (
    f"https://codeload.github.com/asong56/acdn/zip/refs/heads/{ACDN_REF}"
    # ^ replace with /zip/refs/tags/{ACDN_REF} when using a tag
)
ACDN_DIR: Final[Path] = Path(".tools/acdn")

# ── CSS tools ─────────────────────────────────────────────────────────────────
DART_SASS_VERSION:    Final[str]  = os.getenv("DART_SASS_VERSION",    "1.77.8")
LIGHTNINGCSS_VERSION: Final[str]  = os.getenv("LIGHTNINGCSS_VERSION", "1.27.0")
TOOLS_DIR:            Final[Path] = Path(".tools")
BIN_DIR:              Final[Path] = TOOLS_DIR / "bin"

SOURCE_FILE: Final[Path] = Path("src/scss/main.scss")
TARGET_FILE: Final[Path] = Path("static/css/acdn.min.css")


# ── Platform helpers ──────────────────────────────────────────────────────────

def _platform_slug() -> tuple[str, str]:
    system  = platform.system().lower()
    machine = platform.machine().lower()
    os_slug = {"linux": "linux", "darwin": "macos", "windows": "windows"}.get(system)
    if not os_slug:
        raise RuntimeError(f"Unsupported OS: {system}")
    arch_slug = "x64" if machine in {"x86_64", "amd64"} else "arm64" if machine in {"aarch64", "arm64"} else None
    if not arch_slug:
        raise RuntimeError(f"Unsupported arch: {machine}")
    return os_slug, arch_slug


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url) as r, dest.open("wb") as f:
        shutil.copyfileobj(r, f)


def _extract(archive: Path, dest: Path) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    if archive.suffix == ".zip":
        with zipfile.ZipFile(archive) as z:
            z.extractall(dest)
    else:
        with tarfile.open(archive, "r:gz") as t:
            t.extractall(dest)


# ── ACDN ──────────────────────────────────────────────────────────────────────

def ensure_acdn() -> Path:
    """Download and cache the ACDN scss source tree.
    Returns the path that should be passed as --load-path to Dart Sass,
    so that `@use "acdn/src/scss/main"` resolves correctly.
    """
    marker = ACDN_DIR / ".ref"
    if ACDN_DIR.exists() and marker.exists() and marker.read_text().strip() == ACDN_REF:
        return TOOLS_DIR   # already cached at correct ref

    print(f"📦  Downloading ACDN @ {ACDN_REF} …")
    if ACDN_DIR.exists():
        shutil.rmtree(ACDN_DIR)

    with tempfile.TemporaryDirectory() as tmp:
        archive = Path(tmp) / "acdn.zip"
        _download(ACDN_URL, archive)
        _extract(archive, Path(tmp) / "out")
        # GitHub zip nests files under acdn-{REF}/
        extracted = next((Path(tmp) / "out").iterdir())
        shutil.copytree(extracted, ACDN_DIR)

    marker.write_text(ACDN_REF)
    print(f"✅  ACDN cached at {ACDN_DIR}")
    return TOOLS_DIR


# ── Dart Sass ─────────────────────────────────────────────────────────────────

def ensure_dart_sass() -> Path:
    binary = BIN_DIR / ("sass.bat" if platform.system().lower() == "windows" else "sass")
    if binary.exists():
        return binary

    os_slug, arch_slug = _platform_slug()
    ext = "zip" if os_slug == "windows" else "tar.gz"
    url = os.getenv(
        "DART_SASS_DOWNLOAD_URL",
        f"https://github.com/sass/dart-sass/releases/download/{DART_SASS_VERSION}/"
        f"dart-sass-{DART_SASS_VERSION}-{os_slug}-{arch_slug}.{ext}",
    )
    with tempfile.TemporaryDirectory() as tmp:
        archive = Path(tmp) / f"dart-sass.{ext}"
        _download(url, archive)
        _extract(archive, TOOLS_DIR / "dart-sass")

    found = next((TOOLS_DIR / "dart-sass").rglob("sass"), None)
    if not found:
        raise RuntimeError("Dart Sass binary not found after extraction")
    BIN_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(found, binary)
    binary.chmod(0o755)
    return binary


# ── Lightning CSS ─────────────────────────────────────────────────────────────

def ensure_lightningcss() -> Path:
    name   = "lightningcss.exe" if platform.system().lower() == "windows" else "lightningcss"
    binary = BIN_DIR / name
    if binary.exists():
        return binary

    os_slug, arch_slug = _platform_slug()
    ext = "zip" if os_slug == "windows" else "tar.gz"
    url = os.getenv(
        "LIGHTNINGCSS_DOWNLOAD_URL",
        f"https://github.com/parcel-bundler/lightningcss/releases/download/v{LIGHTNINGCSS_VERSION}/"
        f"lightningcss-{os_slug}-{arch_slug}.{ext}",
    )
    with tempfile.TemporaryDirectory() as tmp:
        archive = Path(tmp) / f"lightningcss.{ext}"
        _download(url, archive)
        _extract(archive, TOOLS_DIR / "lightningcss")

    found = next((TOOLS_DIR / "lightningcss").rglob("lightningcss*"), None)
    if not found:
        raise RuntimeError("Lightning CSS binary not found after extraction")
    BIN_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(found, binary)
    binary.chmod(0o755)
    return binary


# ── Main compile ──────────────────────────────────────────────────────────────

def compile_scss(
    source: Path = SOURCE_FILE,
    target: Path = TARGET_FILE,
) -> bool:
    target.parent.mkdir(parents=True, exist_ok=True)

    try:
        acdn_load_path = ensure_acdn()
        sass_bin       = ensure_dart_sass()
        lightning_bin  = ensure_lightningcss()
    except Exception as e:
        print(f"❌  Failed to provision tools: {e}")
        return False

    with tempfile.TemporaryDirectory() as tmp:
        intermediate = Path(tmp) / "styles.intermediate.css"

        sass_cmd = [
            str(sass_bin),
            "--no-source-map",
            "--load-path", str(acdn_load_path),   # resolves "acdn/src/scss/main"
            "--load-path", "static/css",
            str(source),
            str(intermediate),
        ]
        lightning_cmd = [
            str(lightning_bin),
            str(intermediate),
            "-o", str(target),
            "--minify",
            "--browserslist",
        ]

        try:
            subprocess.run(sass_cmd,      check=True)
            subprocess.run(lightning_cmd, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌  CSS pipeline failed (exit {e.returncode})")
            return False

    print("✅  CSS built")
    return True


if __name__ == "__main__":
    if not compile_scss():
        sys.exit(1)
