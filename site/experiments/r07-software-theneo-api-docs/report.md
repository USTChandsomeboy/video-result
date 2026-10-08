# Theneo：搜索、代码与协作

来源：https://vimeo.com/1017420361

原片起点：23.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 9 秒｜中间步骤：参考仍是多张消息卡片纵向排列；复刻已进入 Live Doc Collaboration 标题。 后续检查线索：多个界面状态的时刻与持续时间（state_transition_order）。

- 12.75 秒｜人物标记位置：参考两个参与者在卡片上方、两个正进入卡片；复刻四人已在底部卡片内齐排。 后续检查线索：多个对象逐个进入同一容器（multi_object_entry）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-software-theneo-api-docs/entry.ts
npx remotion render experiments/r07-software-theneo-api-docs/entry.ts <Composition-ID> work/recheck-r07-software-theneo-api-docs.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。