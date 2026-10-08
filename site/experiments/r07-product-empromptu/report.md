# Empromptu：输入到应用图解

来源：https://vimeo.com/1129827690

原片起点：12.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜界面裁切位置：参考按钮、附件和摘要位于同一可见区域；复刻界面下移，文字与右侧按钮的相对位置不同。 后续检查线索：镜头推进时保持界面布局（camera_content_binding）。

- 12.75 秒｜图表形状：参考右上四条柱的蓝色占比各不相同，复刻的占比和排序不同。 后续检查线索：多个图表保持各自的数值形状（geometry_label_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-product-empromptu/entry.ts
npx remotion render experiments/r07-product-empromptu/entry.ts <Composition-ID> work/recheck-r07-product-empromptu.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。