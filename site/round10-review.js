(() => {
  let review;
  const panel = document.createElement('section');
  panel.id = 'review-panel'; panel.className = 'bar';
  document.querySelector('.queue').before(panel);
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render() {
    if (!review) return;
    const item = review.cases.find(x=>x.id===location.hash.slice(1)) || review.cases[0];
    panel.innerHTML = `<h2>逐条代码复查 · ${item.findings.length} 项具体差异</h2>
      <p>${esc(item.visual_check)}</p><div class="toolbar"><a href="deep-review-round10.html#${item.id}" target="_blank">完整逐条报告 · 含代码片段</a><a href="data/round10-deep-review/${item.id}.jpg" target="_blank">本条指定帧对照</a></div>
      ${item.findings.map((q,i)=>`<details style="border-top:1px solid #44516b;padding:12px 0"><summary style="cursor:pointer"><b>${i+1}. ${esc(q.aspect)}</b> · ${esc(q.kind)}</summary><p><b>原片：</b>${esc(q.original)}</p><p><b>复刻：</b>${esc(q.replica)}</p><p><b>影响：</b>${esc(q.impact)}</p>${q.evidence.map((e,j)=>`<p><a href="${esc(e.file)}" target="_blank">${j?'复刻代码':'原源码'} ${esc(e.file.split('/').slice(-2).join('/'))}:${e.line}</a></p><pre style="white-space:pre-wrap;overflow-wrap:anywhere;background:#131d30;padding:12px;font-size:12px">${esc(e.fragment)}</pre>`).join('')}</details>`).join('')}
      <p class="warning">20 条共记录 ${review.difference_count} 项差异，含素材差异和原片自身问题，不作为质量分数。新增查看 41 对指定帧，未逐帧穷尽。复刻代码和视频哈希未变。</p>`;
  }
  fetch('data/round10-deep-code-review.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(data=>{review=data;render()}).catch(()=>{panel.textContent='复查报告加载失败，请通过本地 HTTP 服务打开并刷新。'});
  window.addEventListener('hashchange',render);
})();
