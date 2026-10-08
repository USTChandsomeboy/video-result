# 智慧城市：地图照明与提示

来源：https://vimeo.com/151133356

原片起点：32.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜重复光束的独立状态：参考后方光束有不同透明度，复刻多束亮度比较接近。 后续检查线索：重复图形需要各自的状态（repeated_object_state）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-knowledge-smart-city/entry.ts
npx remotion render experiments/r07-knowledge-smart-city/entry.ts <Composition-ID> work/recheck-r07-knowledge-smart-city.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。