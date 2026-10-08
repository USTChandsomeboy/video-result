# Saudi Fund：输出内容不符

来源：https://vimeo.com/1178232072

原片起点：0 秒；片段长度：15.0 秒。

输出与参考的语言、配色、图形结构均不符。排除有效实验，不依据泛化执行日志认定成功。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜输出内容严重不符：参考是黄色背景、阿拉伯语文字和水平比较线，输出却是深色英语仪表盘与自拟数字。 后续检查线索：日志与可见结果不一致；本条排除出有效复刻实验，不提炼动效 seed（invalid_content）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-saudi-fund/entry.ts
npx remotion render experiments/r07-data-saudi-fund/entry.ts <Composition-ID> work/recheck-r07-data-saudi-fund.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。