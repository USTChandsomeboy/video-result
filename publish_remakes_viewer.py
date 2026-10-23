#!/usr/bin/env python3
"""Publish the three completed remakes without rerendering or rescoring them."""
import argparse, hashlib, json, os, re, shutil, subprocess
from pathlib import Path
REPO='USTChandsomeboy/video-result'
RELEASE='remakes-20261023-media'
def write(p,v):
 p.parent.mkdir(parents=True,exist_ok=True)
 text=json.dumps(v,ensure_ascii=False,indent=2)
 if len(text.encode())>8_000_000:text=json.dumps(v,ensure_ascii=False,separators=(',',':'))
 p.write_text(text+'\n')
def clean(v):
 if isinstance(v,dict):return {k:clean(x) for k,x in v.items()}
 if isinstance(v,list):return [clean(x) for x in v]
 if isinstance(v,str):return re.sub(r'/Users/zhanyi/[^\s\"\'<>),;]+','[local artifact]',v)
 return v
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--experiment',type=Path,required=True);ap.add_argument('--stage',type=Path,required=True);a=ap.parse_args()
 root=Path(__file__).resolve().parent;site=root/'site';out=site/'experiments/remakes-20261023';out.mkdir(parents=True,exist_ok=True);a.stage.mkdir(parents=True,exist_ok=True)
 cases=json.loads((a.experiment/'results.json').read_text());media={};files={};local={};cards=[]
 for n,c in enumerate(cases,1):
  cid=c['id'];caseout=out/cid;media[cid]={};spec=c['spec'];duration=spec['durationInFrames']/spec['fps']
  card={'id':cid,'title':c['title'],'category':('宣传推广','操作指导','艺术表达')[n-1],'variant':'独立复刻','score':{'total':c['score'],'dimensions':c['dimensions'],'dimension_weights':c['weights'],'checks_resolved':c['coverage']['resolved'],'checks_total':c['coverage']['declared'],'version':c['version']},'score_state':'valid','duration':duration,'fps':spec['fps'],'display_aspect':spec['width']/spec['height'],'scope':'源码评分：元素存在、元素属性、相对关系、动效绑定、运动参数和进出时序。','notes':[],'findings':[{'title':x['title'],'description':x['detail']} for x in c['issues']],'score_note':'已登记的检查均有结果；音频、滤镜外观、精确字形像素及未登记背景不计入此源码分。','reference_label':'参考视频','url':f'experiments/remakes-20261023/compare.html#{cid}'}
  for role,relative in (('reference','public-input/reference.mp4'),('replica','replica/output.mp4')):
   p=a.experiment/cid/relative
   with p.open('rb') as f:h=hashlib.file_digest(f,'sha256').hexdigest()
   name=h+'.mp4';url=f'https://github.com/{REPO}/releases/download/{RELEASE}/{name}'
   files[h]={'name':name,'sha256':h,'bytes':p.stat().st_size,'url':url};local[h]=str(p)
   target=a.stage/name
   if not target.exists():os.link(p,target)
   media[cid][role]='../../media/remakes-20261023/'+name
   poster=caseout/(role+'.jpg');poster.parent.mkdir(parents=True,exist_ok=True)
   subprocess.run(['ffmpeg','-v','error','-y','-ss',str(min(8,duration*.35)),'-i',str(p),'-frames:v','1','-vf','scale=720:720:force_original_aspect_ratio=decrease','-q:v','3',str(poster)],check=True)
   card[role]={'sha256':h,'bytes':p.stat().st_size,'width':spec['width'],'height':spec['height'],'fps':spec['fps'],'duration':duration,'url':f'https://ustchandsomeboy.github.io/video-result/media/remakes-20261023/{name}','poster':f'experiments/remakes-20261023/{cid}/{role}.jpg'}
  for name in ('scores.json','checks.json','matches.json'):
   p=a.experiment/cid/'evaluation-v2.4.1'/name;write(caseout/'evaluation-v2.4.1'/name,clean(json.loads(p.read_text())))
  shutil.copytree(a.experiment/cid/'replica/src',caseout/'replica/src',dirs_exist_ok=True)
  shutil.copytree(a.experiment/cid/'public-evidence',caseout/'public-evidence',dirs_exist_ok=True,ignore=shutil.ignore_patterns('__pycache__'))
  card['evidence']=[{'label':'完整评分 JSON','url':f'experiments/remakes-20261023/{cid}/evaluation-v2.4.1/scores.json'},{'label':'逐项评分与源码证据','url':f'experiments/remakes-20261023/{cid}/evaluation-v2.4.1/checks.json'},{'label':'对象分数与同步视频对比','url':f'experiments/remakes-20261023/compare.html#{cid}'}]
  cards.append(card)
 text=(a.experiment/'compare.html').read_text()
 text=text.replace('<script>','<script>\nconst media = '+json.dumps(media)+';\n',1)
 old="ref.src=c.id+'/public-input/reference.mp4';rep.src=c.id+'/replica/output.mp4';"
 assert old in text;text=text.replace(old,"ref.src=media[c.id].reference;rep.src=media[c.id].replica;")
 text=text.replace('/evaluation-v2/','/evaluation-v2.4.1/')
 text=text.replace('Harbor 的结构、素材恢复、源码评分和容器准入分别记录在 README。素材使用共享缓存及硬链接。','分数对应已完成的源码评估；详情见项目说明。')
 text=text.replace('<h1>视频复刻与源码评分</h1>','<h1>视频复刻与源码评分</h1><a href="../../index.html">← 全部案例</a>')
 (out/'compare.html').write_text(text)
 write(out/'results.json',clean(cases))
 (out/'README.md').write_text('''# 三个视频的复刻与源码评分\n\n| 视频 | 分数 | 已解析检查 |\n| --- | ---: | ---: |\n'''+''.join(f"| {c['title']} | {c['score']:.2f} | {c['coverage']['resolved']}/{c['coverage']['declared']} |\n" for c in cases)+'''\n三个独立 agent 完成复刻，保留首次提交的源码和视频。六维权重依次为 10%、15%、15%、20%、25%、15%。总分为已有源码检查的加权结果；音频、滤镜外观、精确字形像素、未登记背景不计入。匿名集合比较数量与联合分布。\n\n页面支持同步播放、逐帧切换、关键差异跳转以及逐对象查看源码证据。评分版本为 2.4.1-remakes-source-layout。\n\n视频按 SHA-256 保存于 GitHub Release，部署时恢复为同域地址；未重新编码或更改分数。Harbor 任务在 FrontierVideo 开发分支提交，保持 draft 状态。\n''')
 write(site/'remakes-20261023-media.json',{'repository':REPO,'release_tag':RELEASE,'media_dir':'media/remakes-20261023','files':list(files.values())})
 write(a.stage/'local-sources.json',local)
 catalog=site/'data/remaining-replicas-catalog.json';data=json.loads(catalog.read_text());ids={c['id'] for c in cards};data['cases']=[x for x in data['cases'] if x['id'] not in ids]+cards;data['updated']='2026-10-23';write(catalog,data)
 home=site/'index.html';text=home.read_text();link='<p style="margin-top:12px"><a href="experiments/remakes-20261023/compare.html" style="color:var(--blue)">新增：Ultracode、Field locks、FORM · 三组视频复刻与源码评分 →</a></p>'
 if 'experiments/remakes-20261023/compare.html' not in text:text=text.replace('<h1>视频复刻与评分结果</h1>','<h1>视频复刻与评分结果</h1>\n'+link)
 home.write_text(text)
 ignore=root/'.gitignore';s=ignore.read_text()
 if 'site/media/remakes-20261023/' not in s:ignore.write_text(s+'\nsite/media/remakes-20261023/\n')
 print(json.dumps({'cases':len(cards),'videos':len(files),'page':str(out/'compare.html'),'bytes':sum(x['bytes'] for x in files.values())},ensure_ascii=False))
if __name__=='__main__':main()
