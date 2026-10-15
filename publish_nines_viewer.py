#!/usr/bin/env python3
"""Publish the completed 0.999… = 1 comparison on the existing Pages site."""
import argparse
import gzip
import hashlib
import json
import os
import re
import shutil
from pathlib import Path

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'nines-equals-one-media-20261015'
PAGE_DIR = 'experiments/nines-equals-one-harbor'
MEDIA_DIR = 'media/nines-equals-one'
PAGE_URL = f'https://ustchandsomeboy.github.io/video-result/{PAGE_DIR}/index.html'


def public_value(value):
    if isinstance(value, dict):
        return {key: public_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [public_value(item) for item in value]
    if isinstance(value, str):
        value = value.replace('/workspace/output/', 'replica/').replace('/tests/gt/', 'reference/')
        return re.sub(r'/(?:Users|private/tmp)/[^\s\"\'<>]+',
                      lambda match: 'local-authoring/' + Path(match[0]).name, value)
    return value


def write_json(path, value, compressed=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = (json.dumps(public_value(value), ensure_ascii=False, separators=(',', ':')) + '\n').encode()
    path.write_bytes(gzip.compress(data, mtime=0) if compressed else data)


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def build(experiment, repository, with_local_media=False):
    site = repository / 'site'
    case = json.loads((experiment / 'results.json').read_text())['cases'][0]
    score = json.loads((experiment / case['score_file']).read_text())
    checks = json.loads((experiment / case['checks_file']).read_text())
    objects = json.loads((experiment / case['object_scores_file']).read_text())
    evaluation = json.loads((experiment / 'evidence/replica-evaluation/evaluation-status.json').read_text())
    oracle = json.loads((experiment / 'evidence/oracle-evaluation/scores.json').read_text())
    admission = json.loads((experiment / 'evidence/oracle-evaluation/validation-summary.json').read_text())
    assert score['status'] == case['score']['status'] == 'valid' and score['integrity_ok']
    assert score['total'] == case['score']['total'] == evaluation['score_100']
    assert score['coverage']['resolved'] == score['coverage']['declared'] == len(checks) == 438
    assert all(row['status'] == 'ok' and row['score'] is not None for row in checks)
    assert len(objects['objects']) == 73
    assert score['dimensions'] == case['score']['dimensions']
    assert score['weights'] == case['score']['dimension_weights']
    assert oracle['status'] == 'valid' and oracle['integrity_ok'] and oracle['total'] == 100
    assert admission['local_oracle_validation']['status'] == 'passed'

    out = site / PAGE_DIR
    out.mkdir(parents=True, exist_ok=True)
    page = (experiment / 'index.html').read_text()
    page = page.replace('<main><h1>', '<main><p><a href="../../index.html">返回其他复刻案例</a></p><h1>', 1)
    helper = """async function readChecks(url){
 const response=await fetch(url);if(!response.ok)throw Error('评分明细读取失败');
 if(!url.endsWith('.gz'))return response.json();
 if(!('DecompressionStream' in window))throw Error('请使用新版 Chrome 或下载逐项数据后解压查看');
 return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json();
}
"""
    assert page.count('fetch(item.checks_file).then(r=>r.json())') == 1
    page = page.replace("const labels=", helper + "const labels=", 1)
    page = page.replace('fetch(item.checks_file).then(r=>r.json())', 'readChecks(item.checks_file)')
    old_link = "if(item.score_file){const link=node('a','完整评分与输入指纹');link.href=item.score_file;section.append(link)}"
    new_link = """if(item.score_file){const row=node('p');for(const [url,label] of [[item.score_file,'完整评分与输入指纹'],[item.checks_file,'下载逐项数据（gzip）'],['evidence/oracle-validation.json','标准解验收记录']]){const link=node('a',label);link.href=url;row.append(link,document.createTextNode('　'))}section.append(row)}"""
    assert old_link in page
    page = page.replace(old_link, new_link)
    (out / 'index.html').write_text(page)
    for filename in ['code-differences.html', 'reference-sheet.jpg', 'replica-sheet.jpg']:
        target = out / 'evidence' / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(experiment / 'evidence' / filename, target)

    files = []
    for kind in ['reference', 'replica']:
        source = experiment / case[kind + '_video']
        sha256 = digest(source)
        if kind == 'replica':
            assert sha256 == evaluation['video']['sha256']
            assert source.stat().st_size == evaluation['video']['bytes']
        name = sha256 + '.mp4'
        files.append({'kind': kind, 'name': name, 'sha256': sha256, 'bytes': source.stat().st_size,
                      'url': f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{name}'})
        case[kind + '_video'] = '../../' + MEDIA_DIR + '/' + name
        if with_local_media:
            target = site / MEDIA_DIR / name
            target.parent.mkdir(parents=True, exist_ok=True)
            if not target.exists():
                os.link(source, target)
            else:
                assert digest(target) == sha256
        poster = Path(case[kind + '_poster'])
        (out / poster.parent).mkdir(parents=True, exist_ok=True)
        shutil.copy2(experiment / poster, out / poster)

    for relative in [case['score_file'], case['object_scores_file'],
                     'evidence/replica-evaluation/evaluation-status.json']:
        write_json(out / relative, json.loads((experiment / relative).read_text()))
    case['checks_file'] += '.gz'
    write_json(out / case['checks_file'], checks, compressed=True)
    write_json(out / 'evidence/oracle-validation.json', admission)
    write_json(out / 'results.json', {'schema_version': 1, 'cases': [case]})
    write_json(site / 'nines-equals-one-media.json', {
        'repository': REPOSITORY, 'release_tag': RELEASE, 'media_dir': MEDIA_DIR, 'files': files,
    })
    (out / 'README.md').write_text(
        '# 0.999… = 1：视频复刻与评分\n\n'
        f'[打开同步对比页]({PAGE_URL})。完整 96 秒、1920×1080、30 fps。\n\n'
        f'复刻得分 **{score["total"]:.2f} / 100**，73 个对象、438 项检查均有结果。'
        '原作标准解完成完整渲染并获得 100 分，本机 Harbor 验收通过。\n\n'
        '页面支持同步播放、逐帧查看、六章跳转、对象分数搜索和逐项源码证据。'
        '源码差异页说明数轴联动、角色说话、小数展开、对白打字、公式增长和粒子运动的差异。\n\n'
        '评分基于声明的源码检查，背景装饰、精确字体排版和听觉质量未计分。'
        '已知局限：校准时将数轴章对白延迟 2.5 秒仍得 99.32 分，该项时序扣分偏轻。\n\n'
        '完整检查存为 checks.json.gz，页面展开时自动解压，也可下载后解压查看。'
        '公开报告已处理本机绝对路径，原始分数和输入指纹保留。\n\n'
        '视频存放于 GitHub Release，站点根目录 nines-equals-one-media.json 登记下载地址、'
        '字节数和 SHA-256；部署时核验后恢复为同域视频。'
        '本次发布为展示页面，完整 Harbor 任务仍需补全跨机器素材分发地址。\n')
    for filename in ['index.html', 'object-contract-v3.html']:
        home = site / filename
        text = home.read_text()
        if PAGE_DIR + '/index.html' not in text:
            marker = '<p style="margin-top:12px"><a href="experiments/feather-vs-ball-harbor/index.html"'
            assert text.count(marker) == 1
            link = (f'<p style="margin-top:12px"><a href="{PAGE_DIR}/index.html" '
                    f'style="color:var(--blue)">新增：0.999… = 1 · 完整数学讲解复刻 · {score["total"]:.2f} 分</a></p>\n        ')
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
