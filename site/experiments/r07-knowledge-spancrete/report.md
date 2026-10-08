# Spancrete：施工机械与日历

来源：https://vimeo.com/224364867

原片起点：128.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜机械部件位置：参考吊臂和挂钩处于车厢上方，复刻斜杆穿过车厢并延伸到右下。 后续检查线索：多个相连部件保持正确连接点（object_binding）。

- 9 秒｜日历进度：参考日历显示5/MAY，复刻已到7/JULY。 后续检查线索：数字变化速度与动作进度保持一致（geometry_label_binding）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-knowledge-spancrete/entry.ts
npx remotion render experiments/r07-knowledge-spancrete/entry.ts <Composition-ID> work/recheck-r07-knowledge-spancrete.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。