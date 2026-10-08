# eage：分叉图形与字标

来源：https://vimeo.com/1052594105

原片起点：2.5 秒；片段长度：7.0 秒。

原片内部有神经网络纹理，轮廓与字形可研究；纹理不一致单独记录。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 0.7 秒｜分叉轮廓：参考是不规则分叉逐步收拢，复刻成为规则放射叶片；内部纹理也不同。 后续检查线索：分叉路径的形状与收拢过程（branch_morph）。

- 4.2 秒｜字母重组：参考字母片段处于中间组合状态，复刻已显示完整ea并把其他碎片放到下方。 后续检查线索：字母碎片独立运动并回到准确位置（mask_segment_order）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-eage/entry.ts
npx remotion render experiments/r07-brand-eage/entry.ts <Composition-ID> work/recheck-r07-brand-eage.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。