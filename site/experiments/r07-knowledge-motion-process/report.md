# 动画制作：插画、动画与声音

来源：https://vimeo.com/801619176

原片起点：32.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜分层入场：参考还处在上一图标离场、新图版底色进入阶段，复刻已显示大部分行星插画。 后续检查线索：图版、内部内容和说明文字分开对齐入场（nested_reveal_timing）。

- 9 秒｜内部对象位置：参考行星偏右上，复刻行星偏右下；波形的形状与长度也不同。 后续检查线索：同一画框内部多个动效对象的相对位置（object_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-knowledge-motion-process/entry.ts
npx remotion render experiments/r07-knowledge-motion-process/entry.ts <Composition-ID> work/recheck-r07-knowledge-motion-process.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。