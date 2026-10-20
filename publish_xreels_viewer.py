#!/usr/bin/env python3
"""Publish eight X-Reels comparisons using existing, hash-addressed MP4s."""
import argparse
import hashlib
import gzip
import json
import os
from pathlib import Path
import re
import shutil

REPOSITORY = 'USTChandsomeboy/video-result'
RELEASE = 'x-reels-standard-media-20261020'
MEDIA_DIR = 'media/x-reels-standard'
PAGE_DIR = 'experiments/x-reels-standard'


def clean(value):
    if isinstance(value, dict): return {k: clean(v) for k,v in value.items()}
    if isinstance(value, list): return [clean(v) for v in value]
    if isinstance(value, str):
        value = re.sub(r'/Users/[^\s\"\'<>(),;\[\]]+', '[local artifact]', value)
        return value.replace('暂定视频分', '视频对比分数').replace('暂定视频总分', '视频对比总分').replace('暂定总分', '总分').replace('暂定评分', '评分').replace('暂定','')
    return value


def write_json(path,value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(clean(value),ensure_ascii=False,separators=(',',':'),allow_nan=False)+'\n')


def copy_public(source,dest):
    dest.parent.mkdir(parents=True,exist_ok=True)
    if source.name=='checks.json':
        data=json.dumps(clean(json.loads(source.read_text())),ensure_ascii=False,separators=(',',':'),allow_nan=False).encode()
        dest.with_suffix('.json.gz').write_bytes(gzip.compress(data,mtime=0))
        dest.unlink(missing_ok=True)
    elif source.suffix=='.json': write_json(dest,json.loads(source.read_text()))
    elif source.suffix in {'.md','.tsx','.ts','.js','.jsx','.css','.log','.txt'}: dest.write_text(clean(source.read_text()))
    else: shutil.copy2(source,dest)


def build(source, repo, stage):
    site=repo/'site'; out=site/PAGE_DIR;out.mkdir(parents=True,exist_ok=True);stage.mkdir(parents=True,exist_ok=True)
    cases=json.loads((source/'results.json').read_text()); assert len(cases)==8
    formal=sum(c['score'].get('status')=='valid' for c in cases)
    video=sum('provisional_video' in c for c in cases)
    assert (formal,video)==(5,3)
    known={}
    for p in site.glob('*-media.json'):
        if p.name=='x-reels-standard-media.json': continue
        for item in json.loads(p.read_text())['files']:known[item['sha256']]=item
    files={}
    for c in cases:
        slug=c['id'];case=source/slug;c['harbor_packaged']=False;c['media']={}
        for kind,rel in [('reference','public-input/reference.mp4'),('replica','replica/output.mp4')]:
            src=case/rel
            with src.open('rb') as f:digest=hashlib.file_digest(f,'sha256').hexdigest()
            name=digest+'.mp4';item=known.get(digest,{'name':name,'sha256':digest,'bytes':src.stat().st_size,'url':f'https://github.com/{REPOSITORY}/releases/download/{RELEASE}/{name}'})
            assert item['bytes']==src.stat().st_size
            files[digest]=item;c['media'][kind]='../../'+MEDIA_DIR+'/'+name
            staged=stage/name
            if not staged.exists():os.link(src,staged)
            elif hashlib.sha256(staged.read_bytes()).hexdigest()!=digest:raise ValueError(staged)
            target=site/MEDIA_DIR/name;target.parent.mkdir(parents=True,exist_ok=True)
            if not target.exists():os.link(src,target)
        c.pop('input_directory',None)
        version=c['score_version']
        to_copy=['public-input/instruction.md','public-input/objects.json','replica/replication-log.md','evidence/reference-contact.jpg',f'evaluation-{version}/scores.json',f'evaluation-{version}/checks.json']
        if 'provisional_video' in c:to_copy+=['evaluation-video-provisional/scores.json','evaluation-video-provisional/checks.json']
        for rel in to_copy:
            if (case/rel).exists():copy_public(case/rel,out/slug/rel)
        for p in (case/'replica/src').rglob('*'):
            if p.is_file() and p.suffix in {'.tsx','.ts','.jsx','.js','.css','.json','.svg'}:copy_public(p,out/slug/'replica/src'/p.relative_to(case/'replica/src'))
    write_json(site/'x-reels-standard-media.json',{'repository':REPOSITORY,'release_tag':RELEASE,'media_dir':MEDIA_DIR,'files':list(files.values())})
    write_json(out/'results.json',cases)
    for name in ['RESULTS.md','README.md','scoring-review/V3-RESULTS.md','scoring-review/VIDEO-PROVISIONAL.md','scoring-review/v3-source-calibration/report.json','scoring-review/video-provisional-selftest.json','scoring-review/v3-selected-evidence.json']:
        copy_public(source/name,out/name)
    for p in (source/'scripts').glob('*video_provisional*.py'):copy_public(p,out/'scripts'/p.name)
    page=(source/'compare.html').read_text()
    start=page.index('const cases=')+len('const cases='); _,end=json.JSONDecoder().raw_decode(page[start:])
    page=page[:start]+json.dumps(clean(cases),ensure_ascii=False).replace('</',r'<\/')+page[start+end:]
    page=page.replace('src="${s}/public-input/reference.mp4"','src="${c.media.reference}"').replace('src="${s}/replica/output.mp4"','src="${c.media.replica}"')
    page=page.replace('/checks.json"','/checks.json.gz"').replace('检查证据</a>','检查证据下载</a>').replace('逐帧数值</a>','逐帧数值下载</a>')
    page=page.replace('部分检查的暂定分数','部分检查分数').replace("pv.scope.replace('暂定视频分：','')",'pv.scope')
    page=page.replace('<header><h1>','<header><p><a href="../../index.html">← 全部复刻案例</a></p><h1>',1)
    (out/'compare.html').write_text(page)
    assert '/Users/' not in page
    assert 'src="${s}/public-input/reference.mp4"' not in page
    link='<p style="margin-top:12px"><a href="experiments/x-reels-standard/compare.html" style="color:var(--blue)">新增：X-Reels · 8 条完整视频复刻与最新评分</a></p>'
    for name in ['index.html','object-contract-v3.html']:
        p=site/name;s=p.read_text()
        if 'experiments/x-reels-standard/compare.html' not in s:s=s.replace('<h1>视频复刻与评分结果</h1>','<h1>视频复刻与评分结果</h1>\n        '+link,1)
        p.write_text(s)
    p=repo/'.gitignore';s=p.read_text()
    if 'site/media/x-reels-standard/' not in s:p.write_text(s+'\nsite/media/x-reels-standard/\n')
    print(json.dumps({'page':PAGE_DIR+'/compare.html','media_files':len(files),'media_bytes':sum(x['bytes'] for x in files.values()),'source_scores':formal,'video_scores':video},ensure_ascii=False,indent=2))


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--repo',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--stage',type=Path,required=True);a=p.parse_args();build(a.source,a.repo,a.stage)
