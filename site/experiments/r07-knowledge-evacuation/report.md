# 疏散教学：逐项放大和强调

来源：https://vimeo.com/1054479067

原片起点：16.0 秒；片段长度：15.0 秒。

局部矢量人物需重绘；分析主要关注步骤强调、缩放及背景状态。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 12.75 秒｜背景状态：参考正在强调出口步骤，下一步楼梯图标仍是灰色；复刻楼梯中的人物已经变为彩色。 后续检查线索：当前步骤的强调与其他步骤的状态同步（state_transition_order）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-knowledge-evacuation/entry.ts
npx remotion render experiments/r07-knowledge-evacuation/entry.ts <Composition-ID> work/recheck-r07-knowledge-evacuation.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。