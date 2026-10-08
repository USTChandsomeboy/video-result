# TREAVI GET：斜条揭示 Logo

来源：https://vimeo.com/1153505254

原片起点：0.0 秒；片段长度：3.8 秒。

首次实现含 SVG transform 字符串错误，造成 Logo 跑到左上。保留失败输出；不能据此证明素材的动效难度高。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.33 秒｜实现错误：SVG 变换失效：参考 logo 位于画面中央，复刻只在左上角露出一部分。源码把 ${.22+p*.78} 写进普通字符串，SVG transform 未得到数值。 后续检查线索：这是代码实现错误，不能据此证明动效难度高（implementation_error）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-clean-logo/entry.ts
npx remotion render experiments/r07-brand-clean-logo/entry.ts <Composition-ID> work/recheck-r07-brand-clean-logo.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。