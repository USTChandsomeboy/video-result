# Connect：四组服务卖点

来源：https://vimeo.com/1117678537

原片起点：17.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 9 秒｜局部图形细节：参考显示器、云和服务器的连线清晰；复刻连线弱且位置不同。 后续检查线索：关联对象与连接线保持相对位置（object_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-product-connect/entry.ts
npx remotion render experiments/r07-product-connect/entry.ts <Composition-ID> work/recheck-r07-product-connect.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。