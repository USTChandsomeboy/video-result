#!/usr/bin/env python3
"""Build the small, static bundle used by the public comparison viewer.

The working directory contains source checkouts and render caches that must not
be published. This script copies only files referenced by the viewer pages.
"""
from __future__ import annotations

import json
import re
import shutil
import sys
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


def finalize() -> None:
    """Resolve localhost links and include the documents linked by the pages."""
    for name in ('round07-replication-results.md', 'complex-material-round08.md',
                 'complex-material-round08-results.md', 'round09-method-and-results.md'):
        copy_if_present('docs/' + name)
    for directory in (ROOT / 'experiments').glob('r08-*'):
        copy_experiment(str(directory.relative_to(ROOT)), ('missing-recreation.mp4',))
    for item in json.loads((ROOT / 'data/round09-viewer.json').read_text()):
        for condition in ('provided', 'missing'):
            for name in item[condition]['assets']:
                copy_if_present(item[condition]['dir'] + '/assets/' + name)
    review_path = SITE / 'data/round10-deep-code-review.json'
    review = json.loads(review_path.read_text())
    links = {}
    for case in review['cases']:
        for finding in case['findings']:
            for evidence in finding['evidence']:
                path = evidence['file']
                url = evidence.get('url', '')
                if path.startswith('source-catalog/') and url.startswith('https://github.com/'):
                    links[path] = url
                elif path.startswith('experiments/'):
                    links[path] = 'https://github.com/USTChandsomeboy/video-result/blob/main/site/' + path
                evidence['file'] = links.get(path, path)
    review_path.write_text(json.dumps(review, ensure_ascii=False, indent=2))
    for path in SITE.glob('*.html'):
        text = path.read_text().replace('http://127.0.0.1:8770/', '')
        for old, new in links.items():
            text = text.replace('href="' + old + '"', 'href="' + new + '"')
        text = text.replace(str(ROOT) + '/', '')
        text = text.replace('视频与完整源码链接需本地 8770 服务。', '视频与代码链接可在线查看。')
        text = text.replace('请从本项目启动服务后打开', '请刷新页面重试：')
        text = text.replace('本地预览', '重新加载')
        if path.name in ('index.html', 'compare.html'):
            text = text.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">')
            text = text.replace('</style>', '@media(max-width:700px){body{margin:16px}main{grid-template-columns:1fr}select{max-width:100%}}</style>')
        path.write_text(text)
    for path in SITE.glob('experiments/r10-*/completion.json'):
        data = json.loads(path.read_text())
        path.write_text(json.dumps({'status': data.get('status'), 'blocked': data.get('blocked', False)}))
    (SITE / '.nojekyll').touch()


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

    finalize()
    files = [p for p in SITE.rglob("*") if p.is_file()]
    total = sum(p.stat().st_size for p in files)
    print(f"built {len(files)} files, {total / 1024 / 1024:.1f} MiB -> {SITE}")


if __name__ == "__main__":
    if '--finalize-only' in sys.argv:
        finalize()
    else:
        main()
