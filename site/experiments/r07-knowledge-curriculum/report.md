# Curriculum：分散卡片组成面板

来源：https://vimeo.com/995434094

原片起点：45.0 秒；片段长度：15.0 秒。

解释教育产品流程，类别与产品介绍有交叉；人物插画差异与状态转场分开看。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 9 秒｜卡片组合：参考各张分散卡片已拼成一个完整矩形面板，复刻仍保持分散。 后续检查线索：多个对象从分散位置汇成同一结构（multi_object_entry）。

- 12.75 秒｜图形内容差异：参考会议桌围坐位置、人物颜色和纸张分布与复刻不同。 后续检查线索：人物插画未提供独立资产，内容差异需要单独考虑（asset_mismatch）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-knowledge-curriculum/entry.ts
npx remotion render experiments/r07-knowledge-curriculum/entry.ts <Composition-ID> work/recheck-r07-knowledge-curriculum.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。