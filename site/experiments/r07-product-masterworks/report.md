# Masterworks：动字、几何与手机

来源：https://vimeo.com/1166099508

原片起点：0.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜连续变形中的位置：参考的短柱从左向右逐渐变矮；复刻同一时刻出现了两端圆点和另一组柱高。 后续检查线索：多个重复元素的高度与位置需要一起对齐（repeated_object_state）。

- 12.75 秒｜入场位置：参考手机大部分已在画面内，复刻手机仍被左边缘裁掉一半以上。 后续检查线索：大对象进入画面的速度与停留位置（camera_content_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-product-masterworks/entry.ts
npx remotion render experiments/r07-product-masterworks/entry.ts <Composition-ID> work/recheck-r07-product-masterworks.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。