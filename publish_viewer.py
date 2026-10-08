#!/usr/bin/env python3
"""Build the small, static bundle used by the public comparison viewer.

The working directory contains source checkouts and render caches that must not
be published. This script copies only files referenced by the viewer pages.
"""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SITE = ROOT / "site"


def copy_file(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def copy_if_present(rel: str) -> None:
    src = ROOT / rel
    if src.exists():
        copy_file(src, SITE / rel)


def copy_experiment(rel_dir: str, names: tuple[str, ...]) -> None:
    src_dir = ROOT / rel_dir
    if not src_dir.exists():
        return
    for name in names:
        copy_file(src_dir / name, SITE / rel_dir / name)


def main() -> None:
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()

    # Main historical comparison and its data.
    copy_file(ROOT / "compare.html", SITE / "index.html")
    copy_file(ROOT / "compare.html", SITE / "compare.html")
    copy_file(ROOT / "examples.json", SITE / "examples.json")

    # Related round pages linked from the main viewer.
    for name in (
        "compare-round08.html",
        "compare-round09.html",
        "compare-round10.html",
        "source-catalog-round10.html",
        "deep-review-round10.html",
        "round10-review.js",
    ):
        copy_if_present(name)
    for name in (
        "data/round09-viewer.json",
        "data/round10-source-catalog.json",
        "data/round10-deep-code-review.json",
    ):
        copy_if_present(name)

    # Round 10 page uses these reference previews and selected frame sheets.
    for source_dir in (ROOT / "data/round10-previews", ROOT / "data/round10-deep-review"):
        if source_dir.exists():
            for src in source_dir.iterdir():
                if src.is_file() and src.suffix.lower() in {".mp4", ".jpg", ".png"}:
                    copy_file(src, SITE / src.relative_to(ROOT))

    # The main page needs only the two videos and the evidence files it links.
    examples = json.loads((ROOT / "examples.json").read_text())
    required = ("reference.mp4", "recreation.mp4", "comparison.jpg", "report.md")
    for item in examples:
        copy_experiment(item["dir"], required)

    # Round 08/09 pages and round 10's available first deliveries.
    for pattern in ("r08-*", "r09-*", "r10-*"):
        for src_dir in (ROOT / "experiments").glob(pattern):
            if src_dir.is_dir():
                copy_experiment(str(src_dir.relative_to(ROOT)), required + ("output.mp4", "completion.json", "src/Replica.tsx"))

    # A short landing README is useful when the artifact is opened outside GitHub.
    (SITE / "README.md").write_text(
        "# Video Seed Bench 对比页\n\n"
        "打开 `index.html` 查看原视频与 Remotion 首次复刻的同步对照。\n"
        "本目录由 `publish_viewer.py` 生成，只包含网页和网页实际使用的媒体文件。\n",
        encoding="utf-8",
    )

    files = [p for p in SITE.rglob("*") if p.is_file()]
    total = sum(p.stat().st_size for p in files)
    print(f"built {len(files)} files, {total / 1024 / 1024:.1f} MiB -> {SITE}")


if __name__ == "__main__":
    main()
