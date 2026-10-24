#!/usr/bin/env python3
"""Publish completed local comparisons without changing their videos or scores.

Build-time dependencies: av, Pillow. The deployed site only needs static files.
Media already present in an earlier release is reused by its SHA-256.
"""
import argparse
import gzip
import hashlib
import html
import json
import os
import re
import shutil
from fractions import Fraction
from pathlib import Path

import av

RELEASE = 'remaining-replicas-media-20261017'
REPO = 'USTChandsomeboy/video-result'
PREFIX = f'https://github.com/{REPO}/releases/download/{RELEASE}/'


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def clean(value):
    if isinstance(value, dict):
        return {k: clean(v) for k, v in value.items() if k not in ('trial_path',)}
    if isinstance(value, list):
        return [clean(v) for v in value]
    if isinstance(value, str):
        return re.sub(r'/Users/zhanyi/[^\s\"\'<>),;]+', '[local artifact]', value)
    return value


def metadata(path):
    digest = hashlib.file_digest(path.open('rb'), 'sha256').hexdigest()
    with av.open(str(path)) as container:
        stream = container.streams.video[0]
        return {'sha256': digest, 'bytes': path.stat().st_size,
                'duration': float(container.duration / av.time_base),
                'width': stream.width, 'height': stream.height,
                'fps': float(stream.average_rate)}


def poster(path, dest, second):
    with av.open(str(path)) as container:
        stream = container.streams.video[0]
        container.seek(int(second / stream.time_base), stream=stream, backward=True)
        for frame in container.decode(stream):
            if frame.time is not None and frame.time + 0.02 < second:
                continue
            image = frame.to_image()
            image.thumbnail((720, 720))
            image.save(dest, 'JPEG', quality=82)
            return
    raise RuntimeError(f'Cannot extract poster: {path}')


def page(prefix, title='新增复刻案例', preset=''):
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)} · 视频复刻对比</title><link rel="stylesheet" href="{prefix}assets/replica-gallery.css"></head>
<body data-root="{prefix}" data-preset="{preset}"><main class="shell">
<header><div class="eyebrow">VIDEO RECONSTRUCTION · 2026.10.17</div><h1>复刻案例对比</h1>
<p>完整成片同步播放，查看已有评分、检查覆盖率与主要差异。</p>
<nav><a href="{prefix}index.html">已有评分案例</a><a href="{prefix}compare.html">第七轮及历史实验</a><a href="{prefix}compare-round09.html">复杂素材实验</a><a href="{prefix}compare-round10.html">第十轮：20组源码实验</a></nav></header>
<div class="layout"><aside><label class="filter-label" for="search">查找案例</label><input id="search" type="search" placeholder="标题或类别">
<label class="filter-label" for="filter">评分状态</label><select id="filter"><option value="all">全部状态</option><option value="valid">已有有效评分</option><option value="incomplete">评分未完成 / 校准中</option><option value="unscored">仅视频对比</option></select>
<p id="count" class="muted"></p><div id="case-nav" aria-label="案例列表"></div></aside>
<section class="detail" id="detail" aria-live="polite"><p>正在读取案例…</p></section></div>
<footer>视频按内容校验值复用，完整文件由 GitHub Release 托管。评分保持本地实验的现有结果。<a href="{prefix}data/remaining-replicas-catalog.json">案例及媒体索引</a></footer>
</main><script src="{prefix}assets/replica-gallery.js" defer></script></body></html>'''


def main(args):
    repo, project, work, stage = args.repo, args.project, args.work, args.stage
    site = repo / 'site'
    dest = site / 'data/remaining-replicas'
    dest.mkdir(parents=True, exist_ok=True)
    stage.mkdir(parents=True, exist_ok=True)
    existing = {}
    for path in site.glob('*-media.json'):
        for item in json.loads(path.read_text()).get('files', []):
            existing[item['sha256']] = item['url']
    files, local_sources, cases = {}, {}, []
    svg_root = work / 'svg-tutorial-standard-work/delivery'
    rome_root = work / 'rome-epic-standard-work/delivery'
    svg = json.loads((svg_root / 'results.json').read_text())['cases'][0]
    rome = json.loads((rome_root / 'results.json').read_text())['cases'][0]
    specs = [
        ('svg-tutorial', svg['title'], '操作指导', svg_root,
         'media/reference.mp4', 'media/replica.mp4', svg, 'svg-anim-tutorial-harbor'),
        ('rome-epic', rome['title'], '知识讲解', rome_root,
         'media/reference.mp4', 'media/replica.mp4', rome, 'rome-epic-harbor'),
    ]

    for cid, title, category, root, ref, rep, raw, route in specs:
        raw = clean(raw)
        c = {'id': cid, 'title': title, 'category': category, 'variant': raw.get('variant', '独立复刻'),
             'score': raw.get('score'), 'notes': raw.get('score_notes', []),
             'scope': raw.get('scope_display') or raw.get('scope') or '',
             'findings': raw.get('findings', []), 'score_note': raw.get('score_note', ''),
             'validation': raw.get('validation', ''), 'source_url': raw.get('source_url'),
             'attribution': raw.get('attribution', ''), 'related': raw.get('related'),
             'reference_label': raw.get('reference_label', '参考视频'),
             'crop_reference': raw.get('crop_reference', False)}
        s = c['score']
        c['score_state'] = 'unscored' if not s else ('valid' if s.get('total') is not None else 'incomplete')
        for role, relative in [('reference', ref), ('replica', rep)]:
            path = root / relative
            m = metadata(path)
            sha = m['sha256']
            m['url'] = existing.get(sha, PREFIX + sha + '.mp4')
            files[sha] = {**m, 'name': sha + '.mp4', 'existing_release': sha in existing}
            local_sources[sha] = str(path)
            c[role] = m
            if sha not in existing:
                staged = stage / (sha + '.mp4')
                if not staged.exists():
                    try:
                        os.link(path, staged)
                    except OSError:
                        shutil.copyfile(path, staged)
        c['duration'] = round(min(c['reference']['duration'], c['replica']['duration']), 3)
        c['fps'] = c['replica']['fps']
        c['display_aspect'] = raw.get('display_aspect', c['replica']['width'] / c['replica']['height'])
        case_dest = dest / cid
        case_dest.mkdir(exist_ok=True)
        second = min(c['duration'] * 0.35, c['duration'] - 0.2)
        for role in ['reference', 'replica']:
            poster(Path(local_sources[c[role]['sha256']]), case_dest / (role + '.jpg'), second)
            c[role]['poster'] = f'data/remaining-replicas/{cid}/{role}.jpg'
        evidence = []
        scorefile = raw.get('score_file')
        if scorefile and (root / scorefile).is_file():
            write_json(case_dest / 'scores.json', clean(json.loads((root / scorefile).read_text())))
            evidence.append({'label': '完整评分 JSON', 'url': f'data/remaining-replicas/{cid}/scores.json'})
        checksfile = raw.get('checks_file')
        if checksfile and (root / checksfile).is_file():
            checks = clean(json.loads((root / checksfile).read_text()))
            packed = json.dumps(checks, ensure_ascii=False, separators=(',', ':')).encode()
            (case_dest / 'checks.json.gz').write_bytes(gzip.compress(packed, mtime=0))
            evidence.append({'label': '逐项检查证据（JSON.gz）', 'url': f'data/remaining-replicas/{cid}/checks.json.gz'})
        codefile = raw.get('code_file') or raw.get('code_diff_file')
        if codefile and (root / codefile).is_file():
            source = clean((root / codefile).read_text())
            suffix = Path(codefile).suffix
            # HTML reports may contain relative links to private local files. A plain
            # downloadable text copy preserves evidence without broken navigation.
            outname = 'code-differences' + ('.html.txt' if suffix == '.html' else suffix)
            (case_dest / outname).write_text(source)
            evidence.append({'label': '源码差异说明', 'url': f'data/remaining-replicas/{cid}/{outname}'})
        c['evidence'] = evidence
        c['url'] = f'replicas.html#{cid}'
        if route:
            path = site / 'experiments' / route / 'index.html'
            if path.exists() and 'replica-gallery.js' not in path.read_text():
                raise RuntimeError(f'Refusing to overwrite an existing public case: {path}')
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(page('../../', title, cid))
        cases.append(c)
    write_json(site / 'data/remaining-replicas-catalog.json', {'updated': '2026-10-17', 'cases': cases})
    write_json(site / 'remaining-replicas-assets.json', {'delivery': 'release-direct',
               'release': RELEASE, 'files': list(files.values())})
    write_json(stage / 'local-sources.json', local_sources)
    (site / 'replicas.html').write_text(page(''))
    summary = {'cases': len(cases), 'valid_scores': sum(c['score_state'] == 'valid' for c in cases),
               'incomplete_scores': sum(c['score_state'] == 'incomplete' for c in cases),
               'unscored': sum(c['score_state'] == 'unscored' for c in cases),
               'unique_media': len(files), 'new_media': sum(not f['existing_release'] for f in files.values()),
               'new_media_bytes': sum(f['bytes'] for f in files.values() if not f['existing_release'])}
    write_json(stage / 'summary.json', summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument('--project', type=Path, required=True)
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--stage', type=Path, required=True)
    main(parser.parse_args())
