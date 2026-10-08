# Selector：产品网站逐屏展示

来源：https://vimeo.com/1174984947

原片起点：8.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜滚动进度：参考还在首屏标题和网络关系图；复刻已滚到下一段标题。 后续检查线索：长页面的滚动距离与时间点对齐（state_transition_order）。

- 12.75 秒｜内容结构：参考右侧有多层节点连接图；复刻缺少这组结构并提前进入深色页尾。 后续检查线索：滚动时保留每一段的图解结构（topology_reveal）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-product-selector/entry.ts
npx remotion render experiments/r07-product-selector/entry.ts <Composition-ID> work/recheck-r07-product-selector.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。