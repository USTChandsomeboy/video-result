# 多国疫情数据：动态排名

来源：https://vimeo.com/401968437

原片起点：94.0 秒；片段长度：15.0 秒。

只比较原片中的图表表达，数值是历史原片内容；输出采用关键帧插值，没有原始逐日数据。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜排名交换时刻：参考韩国位于意大利上方；复刻已经交换位置。 后续检查线索：数据增长与排名交换的时刻一起对齐（rank_identity_timing）。

- 9 秒｜同日期的数据形状：两侧均显示3月17日，但意大利和西班牙的柱长及数字不同。日志注明只取少量关键帧并插值，可能造成中间状态偏差。 后续检查线索：避免用稀疏关键帧插值替代原有非线性数据变化（data_interpolation）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-covid-ranking/entry.ts
npx remotion render experiments/r07-data-covid-ranking/entry.ts <Composition-ID> work/recheck-r07-data-covid-ranking.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。