# Spring.new：重复派发记录

来源：https://vimeo.com/1183005610

原片起点：8.0 秒；片段长度：15.0 秒。

同目录曾被两个 agent 重复写入，首次尝试记录不可靠，排除正式统计。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜加载状态被跳过：参考仍显示加载圈，复刻已显示成品图表。重复派发导致首次记录不可靠，本观察仅供浏览。 后续检查线索：不纳入首次尝试的统计或跨类别验证（provenance_issue）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-software-spring-new/entry.ts
npx remotion render experiments/r07-software-spring-new/entry.ts <Composition-ID> work/recheck-r07-software-spring-new.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。