# Minimal Logo：字母碎片聚合

来源：https://vimeo.com/167486018

原片起点：0.0 秒；片段长度：6.8 秒。

模板类扩展；输出内容严重偏离，不以本次失败证明素材困难。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 2.38 秒｜核心内容不符：参考为字母碎片聚合成横排 envato，复刻为一个大图标加文字，背景还变为黑色。 后续检查线索：主要问题是内容和布局识别不符，暂不归因于复杂动效（reference_content_mismatch）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-minimal-logo/entry.ts
npx remotion render experiments/r07-brand-minimal-logo/entry.ts <Composition-ID> work/recheck-r07-brand-minimal-logo.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。