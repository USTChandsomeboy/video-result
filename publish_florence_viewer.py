#!/usr/bin/env python3
"""Export the completed Florence comparison into the existing Pages site."""
import argparse
import hashlib
import json
import os
import re
import shutil
from pathlib import Path

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'florence-motion-lab-media-20261012'
MEDIA_DIR = 'media/florence-motion-lab'
PAGE_DIR = 'experiments/florence-motion-lab-harbor'


def public_value(value):
    if isinstance(value, dict):
        return {k: public_value(v) for k, v in value.items()}
    if isinstance(value, list):
        return [public_value(v) for v in value]
    if isinstance(value, str):
        value = value.replace('/workspace/output/', 'replica/').replace('/tests/gt/', 'reference/')
        if value.startswith('/Users/'):
            return 'local-authoring/' + Path(value).name
    return value


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(public_value(value), ensure_ascii=False, separators=(',', ':')) + '\n')


def build(experiment, site, local_media=False):
    case = json.loads((experiment / 'results.json').read_text())['cases'][0]
    score = json.loads((experiment / case['score_file']).read_text())
    oracle = json.loads((experiment / 'evidence/oracle/scores.json').read_text())
    assert score['status'] == 'valid' and score['total'] == case['score']['total']
    assert score['coverage']['resolved'] == score['coverage']['declared'] == 84
    assert oracle['status'] == 'valid' and oracle['total'] == 100
    checks = json.loads((experiment / case['checks_file']).read_text())
    rows = checks if isinstance(checks, list) else checks['checks']
    assert len(rows) == 84 and all(row['score'] is not None for row in rows)

    out = site / PAGE_DIR
    out.mkdir(parents=True, exist_ok=True)
    page = (experiment / 'index.html').read_text()
    page = page.replace('<main><h1>', '<main><p><a href="../../index.html">返回其他复刻案例</a></p><h1>', 1)
    (out / 'index.html').write_text(page)
    (out / 'code.html').write_text('\n'.join(line.rstrip() for line in (experiment / 'code.html').read_text().splitlines()) + '\n')
    shutil.copy2(experiment / 'REVIEW.md', out / 'REVIEW.md')
    case.pop('trial_path', None)
    case.pop('trial_file', None)
    case['source_note'] = '本轮参考为 Motion Lab 的现有 Remotion 实现，用其源码作为评分基准。新子 agent 根据视频和提供的素材完成复刻。'
    files = []
    for kind, field in [('reference', 'reference_video'), ('replica', 'replica_video')]:
        source = experiment / case[field]
        with source.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        name = digest + '.mp4'
        case[field] = '../../' + MEDIA_DIR + '/' + name
        files.append({'kind': kind, 'name': name, 'sha256': digest, 'bytes': source.stat().st_size,
                      'url': f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{name}'})
        if local_media:
            dest = site / MEDIA_DIR / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            if dest.exists():
                assert os.path.samefile(source, dest), str(dest)
            else:
                os.link(source, dest)
        poster_field = kind + '_poster'
        poster = Path(case[poster_field])
        (out / poster.parent).mkdir(parents=True, exist_ok=True)
        shutil.copy2(experiment / poster, out / poster)

    for name in ['scores.json', 'checks.json', 'matches.json', 'diagnostics.json',
                 'submitted-video.json', 'evaluation-status.json', 'reward.json']:
        write_json(out / 'evidence/florence-motion-lab' / name,
                   json.loads((experiment / 'evidence/florence-motion-lab' / name).read_text()))
    for name in ['summary.json', 'scores.json', 'submitted-video.json', 'reward.json']:
        write_json(out / 'evidence/oracle' / name, json.loads((experiment / 'evidence/oracle' / name).read_text()))
    write_json(out / 'results.json', {'cases': [case]})
    manifest = {'repository': REPOSITORY, 'release_tag': RELEASE, 'media_dir': MEDIA_DIR, 'files': files}
    write_json(site / 'florence-motion-lab-media.json', manifest)
    (out / 'README.md').write_text(
        '# Motion Lab 复刻与评分\n\n'
        '新复刻为 43.09 / 100，84 / 84 项已解析；标准解 Harbor 验收为 100 分。'
        '参考视频为现有 Remotion 实现，8 秒、1080 × 1080、60 fps。\n\n'
        'index.html 展示同步视频、六维分数和逐项证据；code.html 与 REVIEW.md 说明关键源码差异。'
        '评分覆盖 14 组对象及其属性、空间关系、动效绑定、运动参数和时序。'
        '集合按整体特征比较；阴影、景深、模糊、颗粒及音轨听感由视频辅助查看。\n\n'
        '媒体由根目录 florence-motion-lab-media.json 登记，部署时从 GitHub Release 恢复并校验哈希。\n')
    for filename in ['index.html', 'object-contract-v3.html']:
        home = site / filename
        text = home.read_text()
        if PAGE_DIR + '/index.html' not in text:
            marker = '<p style="margin-top:12px"><a href="experiments/western-duel-harbor/index.html"'
            assert text.count(marker) == 1
            text = text.replace(marker, '<p style="margin-top:12px"><a href="' + PAGE_DIR +
                                '/index.html" style="color:var(--blue)">新增：Motion Lab 3D 动效复刻 · 43.09 分</a></p>\n        ' + marker, 1)
            home.write_text(text)
    for path in out.rglob('*'):
        if path.is_file() and path.suffix in {'.html', '.json', '.md'}:
            text = path.read_text()
            assert not re.search(r'/Users/|127\.0\.0\.1|bridge-transcript|session_dir', text), str(path)
    print(json.dumps({'page': str(out / 'index.html'), 'score': score['total'], 'files': files}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--experiment', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--with-local-media', action='store_true')
    args = parser.parse_args()
    build(args.experiment.resolve(), args.output.resolve(), args.with_local_media)
