#!/usr/bin/env python3
"""Export Clawd's video comparison and both score versions to the Pages site."""
import argparse
import gzip
import hashlib
import json
import math
import os
import re
import shutil
from pathlib import Path

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'clawd-dressup-media-20261016'
PAGE_DIR = 'experiments/clawd-dressup-harbor'
MEDIA_DIR = 'media/clawd-dressup'
PAGE_URL = f'https://ustchandsomeboy.github.io/video-result/{PAGE_DIR}/index.html'
REVISION = 'revisions/strict-v2'


def public_value(value):
    if isinstance(value, dict):
        return {key: public_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [public_value(item) for item in value]
    if isinstance(value, str):
        value = value.replace('/workspace/output/', 'replica/').replace('/tests/gt/', 'reference/')
        return re.sub(r'/(?:Users|private/(?:var|tmp)|var/folders)/[^\s\"\'<>]+',
                      lambda match: 'local-authoring/' + Path(match[0]).name, value)
    return value


def write_json(path, value, compressed=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = (json.dumps(public_value(value), ensure_ascii=False, separators=(',', ':')) + '\n').encode()
    path.write_bytes(gzip.compress(data, mtime=0) if compressed else data)


def digest(path):
    with path.open('rb') as handle:
        return hashlib.file_digest(handle, 'sha256').hexdigest()


def build(experiment, repository, local_media=False):
    site = repository / 'site'
    revision = experiment / REVISION
    result = json.loads((experiment / 'results.json').read_text())
    score = json.loads((revision / 'evidence/replica/scores.json').read_text())
    checks = json.loads((revision / 'evidence/replica/checks.json').read_text())
    oracle = json.loads((revision / 'evidence/oracle/scores.json').read_text())
    admission = json.loads((revision / 'tasks/reconstruct-motion-clawd-dressup/tests/harbor-validation/summary.json').read_text())
    video = json.loads((revision / 'evidence/replica/submitted-video.json').read_text())
    assert result['status'] == score['status'] == 'valid' and score['integrity_ok']
    assert result['total'] == score['total']
    assert math.isclose(sum(score['dimensions'][k] * score['weights'][k] for k in score['weights']), score['total'])
    assert score['coverage']['resolved'] == score['coverage']['declared'] == len(checks) == 340
    assert len(result['objects']) == 37 and all(row['status'] == 'ok' and row['score'] is not None for row in checks)
    assert oracle['total'] == 100 and oracle['status'] == 'valid' and admission['status'] == 'passed'
    assert result['score_classification'] == 'exploratory_posthoc_rescore'
    assert result['official_bench_eligible'] is False and result['score_caveat']
    old = json.loads((experiment / 'results-v1.json').read_text())
    assert old['total'] == result['previous_result']['total']

    out = site / PAGE_DIR
    out.mkdir(parents=True, exist_ok=True)
    page = (experiment / 'index.html').read_text()
    page = page.replace('<main>', '<main>\n<p style="margin-bottom:20px"><a href="../../index.html">← 返回其他复刻案例</a></p>', 1)
    page = page.replace('>逐项检查与源码证据</a>', '>逐项检查与源码证据（gzip）</a>')
    page = page.replace('href="evidence/replica/scores.json"', 'href="' + REVISION + '/evidence/replica/scores.json"')
    page = page.replace('href="tasks/reconstruct-motion-clawd-dressup/instruction.md"',
                        'href="' + REVISION + '/tasks/reconstruct-motion-clawd-dressup/instruction.md"')
    page = page.replace('<a href="README.md">实验说明与复现命令</a>', '<a href="README.md">实验与评分说明</a>')
    page = page.replace('<a href="results-v1.json">旧版评分记录</a>',
        '<a href="results-v1.json">旧版评分记录</a><a href="evidence/oracle-validation.json">标准解验收</a><a href="evidence/code-differences.md">源码差异复核</a>')
    files = []
    for kind in ['reference', 'replica']:
        source = experiment / 'media' / (kind + '.mp4')
        sha = digest(source)
        if kind == 'replica':
            assert sha == video['sha256'] and source.stat().st_size == video['bytes']
        filename = sha + '.mp4'
        media_relative = '../../' + MEDIA_DIR + '/' + filename
        page = page.replace('src="media/' + kind + '.mp4"', 'src="' + media_relative + '"')
        files.append({'kind': kind, 'name': filename, 'sha256': sha, 'bytes': source.stat().st_size,
                      'url': f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{filename}'})
        if local_media:
            destination = site / MEDIA_DIR / filename
            destination.parent.mkdir(parents=True, exist_ok=True)
            if destination.exists():
                assert digest(destination) == sha
            else:
                os.link(source, destination)
    assert 'src="media/' not in page
    (out / 'index.html').write_text(page)

    for relative in ['evidence/reference-09.jpg', 'evidence/replica-poster.jpg', 'evidence/video-comparison.jpg']:
        destination = out / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(experiment / relative, destination)
    for relative in ['submission/src/Replica.tsx', 'evidence/code-differences.md']:
        destination = out / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(public_value((experiment / relative).read_text()))

    checks_relative = REVISION + '/evidence/replica/checks.json.gz'
    result['evidence']['checks'] = checks_relative
    page = (out / 'index.html').read_text().replace(
        'href="evidence/replica/checks.json"', 'href="' + checks_relative + '"')
    (out / 'index.html').write_text(page)
    write_json(out / checks_relative, checks, compressed=True)
    public_score = {**score, 'score_classification': result['score_classification'],
                    'official_bench_eligible': False, 'score_caveat': result['score_caveat']}
    write_json(out / REVISION / 'evidence/replica/scores.json', public_score)
    write_json(out / 'results.json', result)
    write_json(out / 'results-v2.json', result)
    write_json(out / 'results-v1.json', old)
    write_json(out / 'evidence/oracle-validation.json', admission)
    for relative in ['policy.json', 'scoring-notice.json', 'evidence/final-report.json',
                     'evidence/replica/evaluation-status.json', 'evidence/replica/submitted-video.json']:
        write_json(out / REVISION / relative, json.loads((revision / relative).read_text()))
    instruction = 'tasks/reconstruct-motion-clawd-dressup/instruction.md'
    instruction_path = out / REVISION / instruction
    instruction_path.parent.mkdir(parents=True, exist_ok=True)
    instruction_path.write_text('> 本页面展示同一提交的探索性事后重评分。v2 在旧分数已知后按55分以下目标调整，不是盲测或正式 Bench 成绩。\n\n' + public_value((revision / instruction).read_text()))
    write_json(site / 'clawd-dressup-media.json', {
        'repository': REPOSITORY, 'release_tag': RELEASE, 'media_dir': MEDIA_DIR, 'files': files,
    })
    (out / 'README.md').write_text(
        '# Clawd 换装：视频对比与评分\n\n'
        f'[打开同步对比页]({PAGE_URL})。9.5秒、1280×720、30fps。\n\n'
        '**v2 为探索性重评分：54.37 / 100。** 规则在 v1 的82.94分已知后，按照严格复刻及55分以下的目标调整。'
        '它不是盲测或正式 Bench 成绩；旧版评分保留在 results-v1.json。源码和视频均未改变。\n\n'
        '运动参数权重从25%改为60%，运动归一化误差归零阈值从0.75改为0.25；'
        '时序平均误差归零阈值从0.4秒收紧至0.1秒。全部37个对象、340项检查有数值。'
        '独立 Harbor Docker 中标准解得到100分，已有提交重评为54.366151291074175分。\n\n'
        '主要问题：角色挤压变成等比缩放，道具跟随与摆动不准，星空移动变成闪烁，'
        '树木静止，粒子数量和轨迹不同。详细源码证据保存在逐项检查和源码差异文档中。\n\n'
        '视频通过 GitHub Release 和站点根目录 clawd-dressup-media.json 分发，部署时核验 SHA-256。'
        '逐项检查文件 checks.json.gz 解压后为JSON；公开报告已处理本机绝对路径，原数值和文件指纹保留。'
        '本页只发布展示材料，不包含完整隐藏评分任务。\n')
    for filename in ['index.html', 'object-contract-v3.html']:
        home = site / filename
        text = home.read_text()
        if PAGE_DIR + '/index.html' not in text:
            marker = '<p style="margin-top:12px"><a href="experiments/xiaozhen-whale-harbor/index.html"'
            assert text.count(marker) == 1
            link = (f'<p style="margin-top:12px"><a href="{PAGE_DIR}/index.html" '
                    'style="color:var(--blue)">新增：Clawd 换装 · 视频对比 · v1 82.94 / 探索性重评分 54.37</a></p>\n        ')
            home.write_text(text.replace(marker, link + marker, 1))
    ignore = repository / '.gitignore'
    ignored = 'site/' + MEDIA_DIR + '/'
    text = ignore.read_text()
    if ignored not in text:
        ignore.write_text(text.rstrip() + '\n' + ignored + '\n')
    readme = repository / 'README.md'
    text = readme.read_text()
    if 'site/' + PAGE_DIR not in text:
        readme.write_text(text + '\n- `site/' + PAGE_DIR + '/index.html`：Clawd 换装，9.5秒；v1 82.94分，v2探索性事后重评分54.37分。37个对象、340项检查，保留两版规则与结果。\n')
    for path in out.rglob('*'):
        if path.is_file() and path.suffix in {'.html', '.json', '.md', '.tsx'}:
            assert not re.search(r'/Users/|127\.0\.0\.1|localhost|bridge-transcript', path.read_text()), str(path)
    print(json.dumps({'page': str(out / 'index.html'), 'url': PAGE_URL, 'score': score['total'],
                      'classification': result['score_classification'], 'files': files}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--experiment', type=Path, required=True)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--with-local-media', action='store_true')
    args = parser.parse_args()
    build(args.experiment.resolve(), args.repository.resolve(), args.with_local_media)
