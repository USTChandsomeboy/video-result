# 手机 Onboarding：多页切换

来源：https://vimeo.com/398108811

原片起点：0.0 秒；片段长度：9.8 秒。

竖屏保留黑边；页面数量有限，是否足够难需后续确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 0.98 秒｜列表逐项出现：参考只有两项，复刻第三项已出现。 后续检查线索：列表各项独立进入的时刻（nested_reveal_timing）。

- 5.88 秒｜转场中间状态：参考换页时上部暂时为空，复刻下一页图标和文字已到位，且左侧还露出上一页颜色。 后续检查线索：背景转场与内部内容分开对齐（nested_reveal_timing）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-software-onboarding/entry.ts
npx remotion render experiments/r07-software-onboarding/entry.ts <Composition-ID> work/recheck-r07-software-onboarding.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。