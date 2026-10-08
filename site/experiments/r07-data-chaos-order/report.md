# Chaos & Order：密集色块与圆阵列

来源：https://vimeo.com/222988743

原片起点：30.0 秒；片段长度：15.0 秒。

抽象几何动效，无数值叙事，不计入五条数据主选。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜密集色块的分布：参考同一列的多行色块保留较明显的共用竖向结构；复刻颜色、宽度和位置更杂乱。 后续检查线索：重复对象之间保持共同位置关系（repeated_object_state）。

- 9 秒｜环形结构：参考是三色同心圆弧，复刻是细圆环加一块扇形。 后续检查线索：复杂环形结构的层级与面积（geometry_structure）。

- 12.75 秒｜出现数量与大小：参考只有少数大圆和许多很小的点，复刻已经出现完整的等大圆阵列。 后续检查线索：对象增长时保留每个对象独立的大小与时序（multi_object_entry）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-chaos-order/entry.ts
npx remotion render experiments/r07-data-chaos-order/entry.ts <Composition-ID> work/recheck-r07-data-chaos-order.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。