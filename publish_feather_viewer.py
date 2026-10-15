#!/usr/bin/env python3
"""Publish the completed feather/ball comparison into the existing Pages site."""
import argparse
import gzip
import hashlib
import json
import os
import re
import shutil
from pathlib import Path

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'feather-vs-ball-media-20261015'
PAGE_DIR = 'experiments/feather-vs-ball-harbor'
MEDIA_DIR = 'media/feather-vs-ball'
PAGE_URL = f'https://ustchandsomeboy.github.io/video-result/{PAGE_DIR}/index.html'


def public_value(value):
    if isinstance(value, dict):
        return {key: public_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [public_value(item) for item in value]
    if isinstance(value, str):
        value = value.replace('/workspace/output/', 'replica/').replace('/tests/gt/', 'reference/')
        return re.sub(r'/Users/[^\s\"\'<>]+', lambda match: 'local-authoring/' + Path(match[0]).name, value)
    return value


def write_json(path, value, compressed=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = (json.dumps(public_value(value), ensure_ascii=False, separators=(',', ':')) + '\n').encode()
    path.write_bytes(gzip.compress(data, mtime=0) if compressed else data)


def build(experiment, repository, with_local_media=False):
    site = repository / 'site'
    case = json.loads((experiment / 'results.json').read_text())['cases'][0]
    score = json.loads((experiment / case['score_file']).read_text())
    admission = json.loads((experiment / case['admission_file']).read_text())
    checks = json.loads((experiment / case['full_checks_file']).read_text())
    assert score['status'] == case['status'] == 'valid' and score['integrity_ok']
    assert score['total'] == case['score']['total']
    assert score['coverage']['resolved'] == score['coverage']['declared'] == len(checks) == 305
    assert all(row['score'] is not None for row in checks)
    assert admission['status'] == 'passed' and admission['score_100'] == 100
    assert admission['release_scope'] == 'local-experiment'
    out = site / PAGE_DIR
    out.mkdir(parents=True, exist_ok=True)
    page = (experiment / 'index.html').read_text()
    page = page.replace('<main><h1>', '<main><p><a href="../../index.html">返回其他复刻案例</a></p><h1>', 1)
    (out / 'index.html').write_text(page)
    shutil.copy2(experiment / 'code-review.html', out / 'code-review.html')
    files = []
    for kind in ['reference', 'replica']:
        source = experiment / case[kind + '_video']
        with source.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        name = digest + '.mp4'
        files.append({'kind': kind, 'name': name, 'sha256': digest, 'bytes': source.stat().st_size,
                      'url': f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{name}'})
        case[kind + '_video'] = '../../' + MEDIA_DIR + '/' + name
        if with_local_media:
            target = site / MEDIA_DIR / name
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                os.link(source, target)
            else:
                with target.open('rb') as stream:
                    assert hashlib.file_digest(stream, 'sha256').hexdigest() == digest
        poster = Path(case[kind + '_poster'])
        (out / poster.parent).mkdir(parents=True, exist_ok=True)
        shutil.copy2(experiment / poster, out / poster)

    for relative in [case['score_file'], case['checks_file'], case['object_scores_file'],
                     case['harbor_file'], case['admission_file'], 'evidence/render-provenance.json',
                     'evidence/artifact-consistency.json', 'evidence/score-consistency.json']:
        write_json(out / relative, json.loads((experiment / relative).read_text()))
    case['full_checks_file'] = 'evidence/replica/checks.json.gz'
    write_json(out / case['full_checks_file'], checks, compressed=True)
    write_json(out / 'results.json', {'schema_version': 1, 'cases': [case]})
    write_json(site / 'feather-vs-ball-media.json', {
        'repository': REPOSITORY, 'release_tag': RELEASE, 'media_dir': MEDIA_DIR, 'files': files,
    })
    (out / 'README.md').write_text(
        '# 羽毛与铁球：视频复刻与评分\n\n'
        f'[打开同步对比页]({PAGE_URL})。完整 96 秒、1920×1080、30 fps。\n\n'
        f'复刻得分 **{score["total"]:.2f} / 100**，25 个对象、305 项检查均有结果。'
        '标准解完成完整渲染并获得 100 分，本机 Harbor 验收通过。\n\n'
        '主要差异：羽毛下落与摆动曲线、公式约去质量时的上移和排版收拢、'
        '抽气时分子的运动过程。绳子端点持续连接关系在源码复核中发现，当前未计分。\n\n'
        '首次独立 agent 在完整视频交付前超时，随后使用同一冻结源码和同一镜像补完渲染，'
        '复刻源码没有修改。音频听感、字体像素相似度和未列出的装饰细节未计分。\n\n'
        'index.html 展示同步播放、六维分数、25 个对象及逐项源码证据；'
        'code-review.html 给出关键代码差异。完整逐项数据以 checks.json.gz 提供，解压后为 JSON。'
        '公开证据中的本机绝对路径已处理，分数及源码指纹保留。\n\n'
        '视频登记在站点根目录 feather-vs-ball-media.json，存放于 GitHub Release，'
        '部署时校验 SHA-256 并恢复为同域媒体。Harbor 任务本身仍是本机实验包，'
        '其完整素材分发地址尚未发布。\n')
    for filename in ['index.html', 'object-contract-v3.html']:
        home = site / filename
        text = home.read_text()
        if PAGE_DIR + '/index.html' not in text:
            marker = '<p style="margin-top:12px"><a href="experiments/lyric-mv-verifier/index.html"'
            assert text.count(marker) == 1
            link = (f'<p style="margin-top:12px"><a href="{PAGE_DIR}/index.html" '
                    f'style="color:var(--blue)">新增：羽毛与铁球 · 完整科普视频复刻 · {score["total"]:.2f} 分</a></p>\n        ')
            home.write_text(text.replace(marker, link + marker, 1))
    ignore = repository / '.gitignore'
    ignored = 'site/' + MEDIA_DIR + '/'
    text = ignore.read_text()
    if ignored not in text:
        ignore.write_text(text.rstrip() + '\n' + ignored + '\n')
    for path in out.rglob('*'):
        if path.is_file() and path.suffix in {'.html', '.json', '.md'}:
            assert not re.search(r'/Users/|127\.0\.0\.1|localhost|bridge-transcript', path.read_text()), str(path)
    print(json.dumps({'page': str(out / 'index.html'), 'url': PAGE_URL,
                      'score': score['total'], 'files': files}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--experiment', type=Path, required=True)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--with-local-media', action='store_true')
    args = parser.parse_args()
    build(args.experiment.resolve(), args.repository.resolve(), args.with_local_media)
