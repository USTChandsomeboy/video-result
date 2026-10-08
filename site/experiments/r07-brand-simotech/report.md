# SIMOTECH：字形构造与重组

来源：https://vimeo.com/1135236365

原片起点：17.0 秒；片段长度：15.0 秒。

已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜字形构造：参考辅助圆贴合 S 的弯曲处；复刻辅助圆的位置与字形曲率不同。 后续检查线索：辅助线与最终字形共用几何结构（geometry_label_binding）。

- 9 秒｜文字重新出现：参考只露出几个很小的笔画；复刻已接近完整品牌名。 后续检查线索：分段字形显露的顺序与时刻（mask_segment_order）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-simotech/entry.ts
npx remotion render experiments/r07-brand-simotech/entry.ts <Composition-ID> work/recheck-r07-brand-simotech.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。