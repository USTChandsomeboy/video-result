#!/usr/bin/env python3
"""Export the lyric MV comparison and register its Release-hosted media."""
import argparse
import hashlib
import json
import os
import re
import shutil
from pathlib import Path

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'lyric-mv-verifier-media-20261014'
PAGE_DIR = 'experiments/lyric-mv-verifier'
MEDIA_DIR = 'media/lyric-mv-verifier'
PAGE_URL = 'https://ustchandsomeboy.github.io/video-result/' + PAGE_DIR + '/index.html'


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n')


def build(experiment, site, local_media=False):
    scores = json.loads((experiment / 'results/scored/scores.json').read_text())
    checks = json.loads((experiment / 'results/scored/checks.json').read_text())
    objects = json.loads((experiment / 'object-manifest.json').read_text())
    calibration = json.loads((experiment / 'results/calibration-summary.json').read_text())
    cleanup = json.loads((experiment / 'results/display-video-cleanup.json').read_text())
    assert scores['status'] == 'valid' and scores['integrity_ok']
    assert scores['coverage']['resolved'] == scores['coverage']['declared'] == len(checks) == 658
    assert all(row['score'] is not None for row in checks)
    assert len(objects['objects']) == 110 and all(row['passed'] for row in calibration)
    assert cleanup['opening_credits_removed'] == [0, 104]
    out = site / PAGE_DIR
    out.mkdir(parents=True, exist_ok=True)
    page = (experiment / 'index.html').read_text()
    page = page.replace('<main><h1>', '<main><p><a href="../../index.html">返回其他复刻案例</a></p><h1>', 1)
    files = []
    inputs = [
        ('reference', '../lyric-mv-faithful/out/faithful-lyric-mv-no-watermark.mp4?v=credits2',
         experiment.parent / 'lyric-mv-faithful/out/faithful-lyric-mv-no-watermark.mp4'),
        ('replica', '../lyric-mv-redrawn/out/redrawn-lyric-mv.mp4',
         experiment.parent / 'lyric-mv-redrawn/out/redrawn-lyric-mv.mp4'),
    ]
    for kind, old, source in inputs:
        with source.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        if kind == 'reference':
            assert digest == cleanup['display_sha256']
        name = digest + '.mp4'
        assert page.count('src="' + old + '"') == 1
        page = page.replace('src="' + old + '"', 'src="../../' + MEDIA_DIR + '/' + name + '"')
        files.append({'kind': kind, 'name': name, 'sha256': digest, 'bytes': source.stat().st_size,
                      'url': f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{name}'})
        if local_media:
            destination = site / MEDIA_DIR / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            if not destination.exists():
                os.link(source, destination)
            else:
                assert destination.stat().st_size == source.stat().st_size
    (out / 'index.html').write_text(page)
    for name in ['gt-clean-anchor.png', 'replica-anchor-01.png']:
        (out / 'results').mkdir(exist_ok=True)
        shutil.copy2(experiment / 'results' / name, out / 'results' / name)
    write_json(out / 'object-manifest.json', objects)
    for name in ['scores.json', 'checks.json', 'matches.json', 'diagnostics.json']:
        write_json(out / 'results/scored' / name, json.loads((experiment / 'results/scored' / name).read_text()))
    write_json(out / 'results/calibration-summary.json', calibration)
    write_json(out / 'results/display-video-cleanup.json', cleanup)
    write_json(site / 'lyric-mv-verifier-media.json', {
        'repository': REPOSITORY, 'release_tag': RELEASE, 'media_dir': MEDIA_DIR, 'files': files,
    })
    report = (experiment / 'REPORT.md').read_text().replace(
        'http://127.0.0.1:8770/experiments/lyric-mv-verifier/index.html', PAGE_URL)
    report = report.replace('- 验证程序：`verifier/verify.py`\n', '')
    (out / 'REPORT.md').write_text(report)
    (out / 'README.md').write_text(
        '# 歌词 MV：素材合成 GT 与 SVG 独立重绘\n\n'
        f'[打开对比页]({PAGE_URL})。\n\n'
        f'本例总分 **{scores["total"]:.1f} / 100**，覆盖 110 个图层对象、25 段场景和 658 项检查。'
        '页面支持同步播放、逐帧查看、对象定位、六维分数及逐项证据下载。\n\n'
        '左侧是第一版素材合成成片的展示版，已去除抖音标识、账号文字、开场导演和监制署名，'
        '末尾推广卡片替换为纯色收尾。右侧是 SVG 独立重绘成片。音频和时长保留。'
        '展示清理不改变以原始源码和素材为依据的评分。\n\n'
        '六项权重依次为：元素存在 10%、元素属性 15%、相对关系 15%、动效绑定 20%、'
        '运动参数 25%、进出时序 15%。GT 的内部人物姿态保存在图片中，本例评估图层可见属性与变化过程。'
        '字幕覆盖范围、位置和出现时间，歌词逐字内容尚未核验。具体范围见 REPORT.md。\n\n'
        'results/scored/ 保存分数及源码证据；object-manifest.json 保存对象对应；'
        'results/calibration-summary.json 保存自对照、等价改写和定向错误校准结果。\n\n'
        '媒体登记在站点根目录 lyric-mv-verifier-media.json，视频存放于 GitHub Release，'
        '部署时按 SHA-256 校验并恢复为站点同域文件。\n')
    for filename in ['index.html', 'object-contract-v3.html']:
        home = site / filename
        text = home.read_text()
        if PAGE_DIR + '/index.html' not in text:
            marker = '<p style="margin-top:12px"><a href="experiments/florence-motion-lab-harbor/index.html"'
            assert text.count(marker) == 1
            link = (f'<p style="margin-top:12px"><a href="{PAGE_DIR}/index.html" '
                    f'style="color:var(--blue)">新增：歌词 MV · 素材合成与 SVG 重绘 · {scores["total"]:.1f} 分</a></p>\n        ')
            home.write_text(text.replace(marker, link + marker, 1))
    for path in out.rglob('*'):
        if path.is_file() and path.suffix in {'.html', '.json', '.md'}:
            assert not re.search(r'/Users/|127\.0\.0\.1|localhost|session_dir|bridge-transcript', path.read_text()), str(path)
    print(json.dumps({'page': str(out / 'index.html'), 'url': PAGE_URL,
                      'score': scores['total'], 'files': files}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--experiment', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--with-local-media', action='store_true')
    args = parser.parse_args()
    build(args.experiment.resolve(), args.output.resolve(), args.with_local_media)
