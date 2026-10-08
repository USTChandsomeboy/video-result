# AXIS：附件拖入与发送

来源：https://vimeo.com/1197944203

原片起点：10 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 9 秒｜拖入状态：参考正在拖动单个 PDF 图标；复刻同一位置还叠着长文件名卡片。 后续检查线索：拖动对象与附着标签同时切换状态（ui_state_content_binding）。

- 12.75 秒｜末段时序：参考仍显示发送按钮近景，复刻已经只剩背景与光点。 后续检查线索：镜头退出不能早于关键操作完成（state_transition_order）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-product-axis-dashboard/entry.ts
npx remotion render experiments/r07-product-axis-dashboard/entry.ts <Composition-ID> work/recheck-r07-product-axis-dashboard.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。