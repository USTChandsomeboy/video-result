# Modern SaaS：实拍混入及重复派发

来源：https://vimeo.com/1107343615

原片起点：54.0 秒；片段长度：15.0 秒。

片段含酒店实拍，且同目录曾重复派发，排除。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 1.5 秒｜片段适配性不合格：参考开头包含真实酒店房间背景和商品照片，素材条件不齐；复刻为另一段仪表盘界面。另有重复派发记录。 后续检查线索：选片及执行记录均不合格，排除（invalid_selection）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-software-modern-saas-demo/entry.ts
npx remotion render experiments/r07-software-modern-saas-demo/entry.ts <Composition-ID> work/recheck-r07-software-modern-saas-demo.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。