(() => {
  'use strict';
  const base = new URL(document.body.dataset.root || './', location.href);
  const url = path => new URL(path, base).href;
  const $ = id => document.getElementById(id);
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; return n; };
  const labels = {presence:'元素存在',attributes:'元素属性',relations:'相对关系',binding:'动效绑定',motion:'运动参数',timing:'进出时序'};
  const states = {valid:'已有评分',incomplete:'评分未完成',unscored:'仅视频对比'};
  let cases = [], current, cleanup = () => {};
  function link(text, href, external=false) { const a=el('a',text);a.href=external?href:url(href);if(external){a.target='_blank';a.rel='noopener noreferrer'}return a; }
  function nav() {
    const search=$('search').value.toLowerCase().trim(), filter=$('filter').value;
    const shown=cases.filter(c=>(filter==='all'||c.score_state===filter)&&`${c.title} ${c.category}`.toLowerCase().includes(search));
    $('count').textContent=`${shown.length} / ${cases.length} 组对比 · 3 组已有有效评分`;
    $('case-nav').replaceChildren(...shown.map(c=>{const b=el('button',c.title,c.id===current?.id?'active':'');b.dataset.case=c.id;b.setAttribute('aria-current',String(c.id===current?.id));b.append(el('span',`${c.category} · ${c.duration.toFixed(1)}s · ${c.score_state==='valid'?c.score.total.toFixed(2)+' 分':states[c.score_state]}`,'nav-sub'));b.onclick=()=>{if(location.hash.slice(1)===c.id)show(c);else location.hash=c.id};return b}));
    if(!shown.length)$('case-nav').append(el('p','没有符合条件的案例。','muted'));
  }
  function show(c) {
    cleanup();current=c;nav();document.title=`${c.title} · 视频复刻对比`;
    const root=$('detail');root.replaceChildren();
    const tags=el('div',null,'tags');tags.append(el('span',c.category,'tag'),el('span',c.variant,'tag'),el('span',states[c.score_state],`tag ${c.score_state}`));
    root.append(tags,el('h2',c.title),el('p',`${c.duration.toFixed(2)} 秒 · ${c.fps} fps · 参考 ${c.reference.width}×${c.reference.height} / 复刻 ${c.replica.width}×${c.replica.height}`,'muted'));
    if(c.scope)root.append(el('p',c.scope,'note'));
    const videos=el('div',null,'videos'+(c.display_aspect<1?' portrait':''));
    const vv=[];
    for(const role of ['reference','replica']){
      const box=el('div'),label=el('div',null,'video-label');label.append(el('span',role==='reference'?c.reference_label:'Remotion 复刻'),link('完整视频 ↗',c[role].url,true));
      const frame=el('div',null,'frame'+(role==='reference'&&c.crop_reference?' crop':''));frame.style.setProperty('--ratio',String(c.display_aspect));
      const v=el('video');v.controls=true;v.playsInline=true;v.muted=true;v.preload='metadata';v.poster=url(c[role].poster);v.setAttribute('aria-label',`${c.title} ${role==='reference'?'参考':'复刻'}`);frame.append(v);box.append(label,frame);videos.append(box);vv.push(v);
    }
    root.append(videos);
    const [a,b]=vv,controls=el('div',null,'controls'),play=el('button','同步播放'),back=el('button','− 1 帧'),next=el('button','＋ 1 帧'),seek=el('input'),clock=el('output',null),speed=el('select'),sound=el('select');
    play.id='play';seek.id='seek';clock.id='clock';seek.type='range';seek.min=0;seek.max=Math.max(0,Math.floor(c.duration*c.fps)-1);seek.step=1;seek.value=0;seek.setAttribute('aria-label','同步进度');
    speed.setAttribute('aria-label','播放速度');[1,.5,.25].forEach(s=>{const o=el('option',s+'×');o.value=s;speed.append(o)});
    sound.setAttribute('aria-label','声音来源');[['none','静音'],['reference','参考声音'],['replica','复刻声音']].forEach(([v,t])=>{const o=el('option',t);o.value=v;sound.append(o)});
    controls.append(play,back,next,seek,clock,speed,sound);root.append(controls);const load=el('p','正在加载完整视频…');load.id='load-status';root.append(load);
    const jumps=el('div',null,'jumps');[0,.25,.5,.75].forEach(q=>{const t=q*c.duration,btn=el('button',t.toFixed(1)+' s');btn.onclick=()=>go(t);jumps.append(btn)});root.append(jumps);
    const all=[play,back,next,seek,...jumps.querySelectorAll('button')];all.forEach(n=>n.disabled=true);let playing=false,raf=0,dead=false,ready=false;
    function readout(){seek.value=Math.min(+seek.max,Math.round(a.currentTime*c.fps));clock.textContent=`${a.currentTime.toFixed(2)} / ${c.duration.toFixed(2)} s`;}
    function pause(){playing=false;a.pause();b.pause();play.textContent='同步播放';cancelAnimationFrame(raf);readout();}
    function go(t){if(!ready)return;pause();t=Math.max(0,Math.min(+seek.max/c.fps,t));a.currentTime=b.currentTime=t;readout();}
    function tick(){if(!playing||dead)return;if(a.currentTime>=+seek.max/c.fps||a.ended||b.ended){pause();return}if(Math.abs(a.currentTime-b.currentTime)>.09)b.currentTime=a.currentTime;readout();raf=requestAnimationFrame(tick);}
    play.onclick=async()=>{if(playing)return pause();if(a.currentTime>=+seek.max/c.fps)go(0);b.currentTime=a.currentTime;playing=true;play.textContent='暂停';try{await Promise.all([a.play(),b.play()]);if(dead){a.pause();b.pause();return}load.textContent='同步播放中';tick()}catch(e){pause();load.textContent='播放未开始，可使用播放器的播放键重试。';load.classList.add('error')}};
    back.onclick=()=>go((Math.round(a.currentTime*c.fps)-1)/c.fps);next.onclick=()=>go((Math.round(a.currentTime*c.fps)+1)/c.fps);seek.oninput=()=>go(+seek.value/c.fps);speed.onchange=()=>{a.playbackRate=b.playbackRate=+speed.value};sound.onchange=()=>{a.muted=sound.value!=='reference';b.muted=sound.value!=='replica'};
    for(const v of vv){v.onloadedmetadata=()=>{if(dead)return;if(vv.every(x=>x.readyState>=1)){ready=true;all.forEach(n=>n.disabled=false);load.textContent='已就绪 · 支持同步播放、逐帧与慢放';readout()}};v.onerror=()=>{if(!dead){load.textContent='视频加载失败，可点击“完整视频”检查文件，或刷新重试。';load.classList.add('error')}};v.onended=pause;}
    a.ontimeupdate=()=>{if(!playing)readout()};
    cleanup=()=>{dead=true;playing=false;cancelAnimationFrame(raf);vv.forEach(v=>{v.pause();v.removeAttribute('src');v.load()})};
    a.src=c.reference.url;b.src=c.replica.url;
    const analysis=el('div',null,'analysis'),summary=el('div',null,'score-summary'),s=c.score;
    summary.append(el('div',c.score_state==='valid'?s.total.toFixed(2):c.score_state==='unscored'?'尚未评分':'无正式总分','big'+(c.score_state==='valid'?'':' empty')),
      el('p',c.score_state==='valid'?'源码检查分 / 100':c.score_state==='unscored'?'本例只展示视频对比':'视频已完成，评分覆盖尚不完整','score-caption'));
    if(s?.checks_total)summary.append(el('p',`${s.checks_resolved} / ${s.checks_total} 项已解析`,'score-caption'));
    if(s?.resolved_portion_score!=null)summary.append(el('p',`已测部分诊断分 ${s.resolved_portion_score.toFixed(2)}，加权覆盖率 ${(s.coverage.weighted*100).toFixed(2)}%；不作为完整总分。`,'score-caption'));
    analysis.append(summary);
    if(s?.dimensions&&Object.values(s.dimensions).some(n=>n!=null)){
      const table=el('table',null,'metrics'),head=el('tr');['检查维度','分数 / 100','权重'].forEach(t=>head.append(el('th',t)));table.append(head);
      for(const [k,t]of Object.entries(labels)){const r=el('tr'),value=s.dimensions[k],cell=el('td',value==null?'未解析':value.toFixed(2));if(value!=null){const p=el('progress');p.max=100;p.value=value;cell.append(p)}r.append(el('td',t),cell,el('td',s.dimension_weights?.[k]!=null?(s.dimension_weights[k]*100).toFixed(0)+'%':'—'));table.append(r)}analysis.append(table);
    }else analysis.append(el('p',c.score_state==='unscored'?'这组没有对应的自动评分结果。请直接比较画面、动效和时序。':'当前评分器尚未完成校准，暂不展示总分或推算成绩。','notice'));
    root.append(analysis);
    if(c.score_note)root.append(el('p',c.score_note,'note score-note'));
    if(c.notes?.length)c.notes.forEach(t=>root.append(el('p',t,'note')));
    if(c.findings?.length){root.append(el('h3','已记录的主要差异'));const list=el('ul',null,'findings');c.findings.forEach(f=>{const li=el('li');if(typeof f==='string')li.textContent=f;else{li.append(el('b',f.title+'：'),document.createTextNode(f.description))}list.append(li)});root.append(list);}
    if(c.validation){root.append(el('h3','实验与评分说明'),el('p',c.validation,'note'));}
    if(c.attribution)root.append(el('p',c.attribution,'note'));
    const links=el('div',null,'links');if(c.source_url)links.append(link('原始来源 ↗',c.source_url,true));for(const e of c.evidence)links.append(link(e.label,e.url));if(c.related)links.append(link(c.related.label,c.related.url));links.append(link('本例分享链接',`replicas.html#${c.id}`));root.append(links);
  }
  $('search').oninput=nav;$('filter').onchange=nav;
  function fromHash(){const id=decodeURIComponent(location.hash.slice(1))||document.body.dataset.preset;show(cases.find(c=>c.id===id)||cases[0]);}
  fetch(url('data/remaining-replicas-catalog.json')).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(data=>{cases=data.cases;fromHash();window.addEventListener('hashchange',fromHash)}).catch(e=>{$('detail').textContent='案例数据加载失败：'+e.message});
})();
