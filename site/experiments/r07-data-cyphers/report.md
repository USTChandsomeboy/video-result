# 包装比较：水耗与排放

来源：https://vimeo.com/1082562404

原片起点：24.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜卡片内部时序：参考右下卡片还是空白，复刻图标和文字已经全部出现。 后续检查线索：容器出现与内部内容出现要分开控制（nested_reveal_timing）。

- 9 秒｜数值提前出现：参考水滴正在逐个增加且没有百分比，复刻已经显示红色百分比数字。 后续检查线索：计数对象和摘要数字同时按进度变化（geometry_label_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-cyphers/entry.ts
npx remotion render experiments/r07-data-cyphers/entry.ts <Composition-ID> work/recheck-r07-data-cyphers.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。