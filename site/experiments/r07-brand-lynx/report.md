# Lynx：笔画组合与切片

来源：https://vimeo.com/1225162242

原片起点：0.0 秒；片段长度：5.8 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 0.58 秒｜字形中间状态：参考已形成Ly，复刻仍是两条分离竖线。 后续检查线索：字母笔画进入时刻与组合顺序（mask_segment_order）。

- 3.48 秒｜局部放大比例：参考Lynx几乎占满画面宽度，复刻字较小且与Solutions间距更大。 后续检查线索：局部文字放大时的遮挡与相对位置（text_layer_order）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-lynx/entry.ts
npx remotion render experiments/r07-brand-lynx/entry.ts <Composition-ID> work/recheck-r07-brand-lynx.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。