# CooWe：日历预约与隐私展示

来源：https://vimeo.com/1135305347

原片起点：48.0 秒；片段长度：15.0 秒。

原片有显著制作方水印；可研究 UI 时序，但不宜直接作为干净的最终发布样本。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜弹窗内容不符：参考弹窗为新预约请求，复刻显示私人日程详情，无法表达同一个操作结果。 后续检查线索：界面状态必须保留对应操作的具体内容（ui_state_content_binding）。

- 9 秒｜标注出现时刻：参考右侧还没有三条标注，复刻已全部显示。 后续检查线索：分屏画面与注释按同一时间线出现（nested_reveal_timing）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-software-coowe/entry.ts
npx remotion render experiments/r07-software-coowe/entry.ts <Composition-ID> work/recheck-r07-software-coowe.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。