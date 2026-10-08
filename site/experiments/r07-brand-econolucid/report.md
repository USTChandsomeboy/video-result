# EconoLucid：遮罩中的字形组合

来源：https://vimeo.com/1196609736

原片起点：0.0 秒；片段长度：4.9 秒。

短片结构较少，难度尚未证实；暂作对照，不能认定为高难 groundtruth。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.72 秒｜分段揭示节奏：参考第二条金色横条尚在进入，复刻三条均已出现。 后续检查线索：遮罩内各个笔画独立进入（mask_segment_order）。

- 2.94 秒｜收尾特效缺失：参考logo周围有放射粒子，复刻没有这部分。 后续检查线索：特效内容遗漏，不等于无法表达此类动效（content_missing）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-econolucid/entry.ts
npx remotion render experiments/r07-brand-econolucid/entry.ts <Composition-ID> work/recheck-r07-brand-econolucid.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。