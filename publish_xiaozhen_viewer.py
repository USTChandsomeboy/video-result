#!/usr/bin/env python3
"""Export the completed Xiaozhen comparison and its verified media manifest."""
import argparse
import hashlib
import json
import math
import os
import re
import shutil
from pathlib import Path

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'xiaozhen-whale-media-20261015'
PAGE_DIR = 'experiments/xiaozhen-whale-harbor'
MEDIA_DIR = 'media/xiaozhen-whale'
PAGE_URL = 'https://ustchandsomeboy.github.io/video-result/' + PAGE_DIR + '/index.html'


def public_value(value):
    if isinstance(value, dict):
        return {public_value(k): public_value(v) for k, v in value.items()}
    if isinstance(value, list):
        return [public_value(v) for v in value]
    if isinstance(value, str):
        value = value.replace('/workspace/output/', 'replica/').replace('/tests/gt/', 'reference/')
        return re.sub(r'/Users/[^\s\"\'<>(),;]+',
                      lambda m: 'local-authoring/' + '/'.join(Path(m[0]).parts[-4:]), value)
    return value


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(public_value(value), ensure_ascii=False, separators=(',', ':'), allow_nan=False) + '\n')


def build(experiment, site, local_media=False):
    case = json.loads((experiment / 'results.json').read_text())['cases'][0]
    scores = json.loads((experiment / case['score_file']).read_text())
    rows = json.loads((experiment / case['checks_file']).read_text())
    oracle = json.loads((experiment / 'evidence/runtime6/harbor-oracle-validation.json').read_text())
    assert scores['status'] == 'valid' and scores['integrity_ok']
    assert scores['total'] == case['score']['total']
    assert scores['coverage']['resolved'] == scores['coverage']['declared'] == len(rows) == 3534
    assert all(r['status'] == 'ok' and math.isfinite(r['score']) and 0 <= r['score'] <= 100 for r in rows)
    assert oracle['oracle_trial']['status'] == 'passed' and oracle['oracle_trial']['score_100'] == 100
    out = site / PAGE_DIR
    out.mkdir(parents=True, exist_ok=True)
    page = (experiment / 'index.html').read_text().replace(
        '<main><h1>', '<main><p><a href="../../index.html">返回其他复刻案例</a></p><h1>', 1)
    page = page.replace('nav{display:flex;', 'nav{display:flex;flex-wrap:wrap;')
    (out / 'index.html').write_text(page)
    case.pop('trial_path', None)
    case['score_review'] = {'prior_total': 50.73020077037915, 'status': 'withdrawn_and_replaced',
                            'replacement_total': scores['total'],
                            'audit': 'evidence/runtime6/score-correction-audit.json'}
    files = []
    for kind, field in [('reference', 'reference_video'), ('replica', 'replica_video')]:
        source = experiment / case[field]
        with source.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        name = digest + '.mp4'
        if kind == 'replica':
            assert digest == json.loads((experiment / 'evidence/final/submitted-video.json').read_text())['sha256']
        case[field] = '../../' + MEDIA_DIR + '/' + name
        files.append({'kind': kind, 'name': name, 'sha256': digest, 'bytes': source.stat().st_size,
                      'url': f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{name}'})
        if local_media:
            target = site / MEDIA_DIR / name
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                os.link(source, target)
            else:
                assert os.path.samefile(source, target)
        poster = Path(case[kind + '_poster'])
        (out / poster.parent).mkdir(parents=True, exist_ok=True)
        shutil.copy2(experiment / poster, out / poster)
    write_json(out / 'results.json', {'cases': [case]})
    write_json(site / 'xiaozhen-whale-media.json', {
        'repository': REPOSITORY, 'release_tag': RELEASE, 'media_dir': MEDIA_DIR, 'files': files})
    for name in ['scores.json', 'checks.json', 'check-summary.json', 'object-scores.json',
                 'submitted-video.json', 'evaluation-status.json', 'reward.json', 'diagnostics.json']:
        write_json(out / 'evidence/final' / name, json.loads((experiment / 'evidence/final' / name).read_text()))
    for name in ['harbor-oracle-validation.json', 'score-correction-audit.json', 'docker-summary.json']:
        write_json(out / 'evidence/runtime6' / name, json.loads((experiment / 'evidence/runtime6' / name).read_text()))
    for name in ['code-comparison.html', 'code-comparison.md', 'scorer-corrections.md', 'result-summary.md']:
        shutil.copy2(experiment / 'evidence' / name, out / 'evidence' / name)
    for name in ['pair-4.60.jpg', 'pair-23.50.jpg', 'pair-10.50.jpg']:
        shutil.copy2(experiment / 'evidence/video-review' / name, out / 'evidence/video-review' / name)
    source = out / 'replica/src/Replica.tsx'
    source.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(experiment / 'replica/src/Replica.tsx', source)
    assert hashlib.sha256(source.read_bytes()).hexdigest() == scores['inputs']['source_sha256']['replica']['src/Replica.tsx']
    (out / 'README.md').write_text(
        '# 小镇姑娘 · 鲸鱼娘 MV 复刻\n\n'
        f'[打开视频对比与评分]({PAGE_URL})。\n\n'
        '34 秒、1920×1080、30 fps。复刻源码评分 **63.73 / 100**，66 个对象、3,534 项检查全部有结果。'
        '同版任务的原作在 Harbor 中实际渲染并独立评分，全部检查为 100 分；225 项回归检查通过。\n\n'
        '复刻 agent 获得参考视频、对象卡片、原作音轨和字体，角色与道具由 SVG / HTML 重新绘制。'
        '原始提交在渲染时达到时限，随后对同一份源码完成原生分辨率渲染，并交给独立环境评分。\n\n'
        '页面支持同步播放、逐帧、关键时间点、六维分数、对象汇总和逐项源码证据。'
        '主要差异是逐字歌词弹跳、女孩离开、男孩挥手和星座描边过程。'
        '完整字体像素轮廓、纸面滤镜和音频听感通过视频查看。\n\n'
        '此前 50.73 分因歌词动态编号及字幕定位误判已撤回；本次对同一提交重评。'
        '2,027 项非歌词检查的分数保持一致。详情见 evidence/result-summary.md 和评分器修正记录。\n\n'
        '视频存放于 GitHub Release，部署时按 SHA-256 和字节数校验，再通过站点同域路径播放。\n')
    for name in ['index.html', 'object-contract-v3.html']:
        target = site / name
        text = target.read_text()
        if PAGE_DIR + '/index.html' not in text:
            marker = '<p style="margin-top:12px"><a href="experiments/nines-equals-one-harbor/index.html"'
            assert text.count(marker) == 1
            link = (f'<p style="margin-top:12px"><a href="{PAGE_DIR}/index.html" '
                    'style="color:var(--blue)">新增：小镇姑娘 · 鲸鱼娘 MV 复刻 · 63.73 分</a></p>\n        ')
            target.write_text(text.replace(marker, link + marker, 1))
    for path in out.rglob('*'):
        if path.is_file() and path.suffix in {'.html', '.json', '.md', '.tsx'}:
            assert not re.search(r'/Users/|127\.0\.0\.1|localhost|session_dir|bridge-transcript', path.read_text()), str(path)
    print(json.dumps({'page': str(out / 'index.html'), 'url': PAGE_URL, 'score': scores['total'], 'files': files}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--experiment', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--with-local-media', action='store_true')
    args = parser.parse_args()
    build(args.experiment.resolve(), args.output.resolve(), args.with_local_media)
