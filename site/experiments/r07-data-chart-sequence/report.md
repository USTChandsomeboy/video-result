# 市场份额饼图与三年曲线

来源：https://vimeo.com/93873684

原片起点：30.0 秒；片段长度：15.0 秒。

示例数据图表，属于可视化动效；不代表数字事实已核实。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜几何与数字进度：参考蓝扇区显示21，复刻显示18，面积也较小。 后续检查线索：扇区大小、标签与揭示进度一起变化（geometry_label_binding）。

- 12.75 秒｜曲线局部走势：参考的青色线在9月上冲而10月回落，复刻同一段走势不同。 后续检查线索：各条数据序列保留独立走势（data_interpolation）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-chart-sequence/entry.ts
npx remotion render experiments/r07-data-chart-sequence/entry.ts <Composition-ID> work/recheck-r07-data-chart-sequence.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。