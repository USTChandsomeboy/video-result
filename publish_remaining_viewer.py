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
    mercury_root = project / 'experiments/mercury-automation'
    svg_root = work / 'svg-tutorial-standard-work/delivery'
    qixiong_root = work / 'qixiong-standard-work/delivery'
    rome_root = work / 'rome-epic-standard-work/delivery'
    western_root = project / 'experiments/western-duel-harbor'
    mercury = json.loads((mercury_root / 'results.json').read_text())['cases']
    svg = json.loads((svg_root / 'results.json').read_text())['cases'][0]
    qixiong = json.loads((qixiong_root / 'results.json').read_text())
    rome = json.loads((rome_root / 'results.json').read_text())['cases'][0]
    specs = [
        ('qixiong', '七雄并立：战国地图叙事', '知识讲解', qixiong_root,
         'media/reference.mp4', 'media/replica.mp4', qixiong, 'qixiong-harbor'),
        ('svg-tutorial', svg['title'], '操作指导', svg_root,
         'media/reference.mp4', 'media/replica.mp4', svg, 'svg-anim-tutorial-harbor'),
        ('rome-epic', rome['title'], '知识讲解', rome_root,
         'media/reference.mp4', 'media/replica.mp4', rome, 'rome-epic-harbor'),
        ('mercury', mercury[0]['title'], '宣传推广', mercury_root,
         'media/mercury-reference.mp4', 'media/mercury-replica.mp4', mercury[0], 'mercury-automation'),
        ('automation', mercury[1]['title'], '宣传推广', mercury_root,
         'media/automation-reference.mp4', 'media/automation-replica.mp4', mercury[1], ''),
        ('western-duel', 'Western Duel：西部对决', '叙事娱乐', western_root,
         'media/reference.mp4', 'media/replica.mp4',
         {'score': json.loads((western_root / 'results.json').read_text()),
          'score_note': '完整成片已完成；评分任务仍在校准，没有正式总分。'}, 'western-duel-harbor'),
    ]
    fp_notes = ['此组历史实验未生成源码自动评分。',
                '品牌标志和部分照片使用了替代元素，字体也有替换；复刻未重建音频。请结合视频查看。']
    for short, title, category in [
        ('bloomberg', 'Bloomberg：金融图表分析', '分析汇报'),
        ('zeed', 'Zeed：投资组合数据', '分析汇报'),
        ('framer', 'Framer：界面操作教程', '操作指导'),
        ('jhu', 'JHU：数据与地图播报', '资讯播报'),
        ('apple', 'Apple Motion：动效片段回顾', '记录回顾'),
        ('skrrt', 'Skrrt：年度音乐数据回顾', '记录回顾'),
    ]:
        d = project / f'experiments/多个复刻任务/fp-{short}'
        specs.append((f'fp-{short}', title, category, d, 'reference.mp4', 'recreation.mp4',
                      {'findings': fp_notes, 'variant': '历史复刻'}, 'fp-' + short))
    specs.extend([
        ('claude-story', '是谁还没用上 Claude：完整故事动画', '叙事娱乐',
         project / 'experiments/douyin-claude-pair', 'anmuxi-story/reference/original.mp4',
         'anmuxi-story/out/replica.mp4',
         {'source_url': 'https://www.douyin.com/video/7696108445728019027',
          'scope': '约84秒完整对照：弹窗、账号、搜索经验、配件升级、终端与星际穿梭。'}, 'douyin-claude-story'),
        ('kicks-collage', 'KICKS：撕纸与照片拼贴', '艺术表达',
         project / 'experiments/twitter-katana-collage', 'reference/twitter-original.mp4',
         'out/kicks-twitter-replica.mp4',
         {'source_url': 'https://x.com/gkxspace/status/2108368287591751969',
          'scope': '原片按原有对比页的裁切方式，仅展示右侧动画。复刻使用从原片整理的静态素材与代码动效。',
          'crop_reference': True, 'display_aspect': 1,
          'findings': ['部分遮挡后的边缘、汽车细节、马的内部动作与撕纸折皱为近似处理。']}, 'twitter-katana-collage'),
        ('cute-lyric', '歌词 MV：小熊与兔子（角色替换版）', '叙事娱乐', project,
         'experiments/lyric-mv-faithful/out/faithful-lyric-mv-no-watermark.mp4',
         'experiments/lyric-mv-cute-replica/out/cute-lyric-mv.mp4',
         {'variant': '历史角色替换试作', 'reference_label': '去标识的素材合成参考',
          'scope': '历史版本有意替换角色，不作为严格的同角色复刻。参考展示复用已发布的去标识、去署名版本。',
          'attribution': '小熊与兔子轮廓来自 Twitter Twemoji，CC BY 4.0；身体、服装与动作另行绘制。',
          'source_url': 'https://github.com/twitter/twemoji'}, 'lyric-mv-cute-replica'),
        ('smalltown-codex-deepseek', '小镇姑娘：Codex × DeepSeek 独立试作', '叙事娱乐',
         project, 'experiments/codex-deepseek-smalltown/reference-review/reference.mp4',
         'experiments/codex-deepseek-smalltown/out/small-town-codex-deepseek.mp4',
         {'variant': '历史独立试作 · 仅视频对比',
          'scope': '约22秒片段；形象、镜头与歌词画面由独立 Remotion 工程重绘。与已发布的完整鲸鱼娘 MV Harbor 任务是不同实验。',
          'source_url': 'https://github.com/USTChandsomeboy/video-seed-bench'}, 'codex-deepseek-smalltown'),
        ('motion-lab-first', 'Motion Lab：原帖与首次复刻', '艺术表达',
         project / 'experiments/florence-motion-lab', 'reference/original.mp4', 'out/replica.mp4',
         {'variant': '首次复刻 · 尚无源码评分', 'source_url': 'https://x.com/flxrnc/status/2108899503092740561',
          'scope': '此处是原帖与第一次重新实现的对照。已发布的 Harbor 页面用这次实现作为GT，评估另一次独立复刻，两组实验不同。',
          'related': {'url': 'experiments/florence-motion-lab-harbor/index.html', 'label': '后续 Harbor 复刻与评分'}},
         'florence-motion-lab'),
        ('clawd-first', 'Clawd 换装：原帖与首次复刻', '叙事娱乐',
         project / 'experiments/douyin-claude-pair/clawd-dressup', 'reference/original.mp4', 'out/replica.mp4',
         {'variant': '首次复刻 · 尚无源码评分', 'source_url': 'https://www.douyin.com/video/7695989308771401107',
          'scope': '此处是原帖与第一次实现的对照。已发布的 Clawd Harbor 页面用这次实现作为GT，再交给独立 agent 复刻。',
          'related': {'url': 'experiments/clawd-dressup-harbor/index.html', 'label': '后续 Harbor 复刻与评分'}},
         'clawd-dressup-first'),
    ])

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
        if cid == 'qixiong':
            scorefile = 'evidence/scores.json'
        if scorefile and (root / scorefile).is_file():
            write_json(case_dest / 'scores.json', clean(json.loads((root / scorefile).read_text())))
            evidence.append({'label': '完整评分 JSON', 'url': f'data/remaining-replicas/{cid}/scores.json'})
        checksfile = raw.get('checks_file')
        if cid == 'qixiong':
            checksfile = 'evidence/checks.json'
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
