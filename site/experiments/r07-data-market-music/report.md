# Market Music：环形股票柱图

来源：https://vimeo.com/83191373

原片起点：85.0 秒；片段长度：15.0 秒。

几何可代码表达，原始每日数据未提供；柱高差异与镜头/标签角度差异分开记录。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜月份与柱图方向：参考下方从左到右是3—6月；复刻下方出现另一种月份朝向与顺序，日柱位置也不同。 后续检查线索：圆形布局中标签、柱序列和镜头共用坐标变换（camera_content_binding）。

- 9 秒｜转场后的几何方向：两侧都进入俯视近景，但参考柱子集中在右边，复刻集中在上方。 后续检查线索：镜头转向时保持数据所在角度（camera_content_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-market-music/entry.ts
npx remotion render experiments/r07-data-market-music/entry.ts <Composition-ID> work/recheck-r07-data-market-music.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。