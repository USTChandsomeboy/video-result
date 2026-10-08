# Moonlight：逐字景深与遮挡

来源：https://oneofthemiguels.com/projects/moonlight-kinetic-typography-video/

原片起点：11.0 秒；片段长度：10.0 秒。

仅检查视觉复刻；输出无音轨，本轮没有评估音乐同步。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1 秒｜逐字深度和模糊：参考字母沿景深方向分散、放大并局部模糊，复刻是一整行清晰小字。 后续检查线索：单个字母的大小位置与模糊分别随时间变化（per_glyph_depth）。

- 6 秒｜词语遮挡：参考词组前后相互遮挡，复刻三行整齐堆叠。 后续检查线索：逐词保留前后层级而非固定排版（text_layer_order）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-lyric-moonlight/entry.ts
npx remotion render experiments/r07-lyric-moonlight/entry.ts <Composition-ID> work/recheck-r07-lyric-moonlight.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。