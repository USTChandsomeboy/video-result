# R15：RENAISSANCE 动效知识讲解

## 选片理由

输入 seed 是 `label_state_and_process_binding` 和 `clear_rebuild_topology`，类别是知识讲解 / 流程解释。片段主要由人物图标、数字、圆形比例图、年份和几何图形组成，可以用 SVG 和文字直接重建，不依赖真人或真实 3D 素材。

来源：[RENAISSANCE Motion Graphics explainer](https://www.youtube.com/watch?v=eve40ccdkLM)。本地片段取原片 16–31 秒，30fps、1280×720、450 帧。

## 当前复刻暴露的问题

- 人物图标的总体数量接近，但间距、进入节奏和排列变化被规则化。
- 半圆分割、50% 数字和分割线可以表达，但三者的变化时间没有完全同步。
- 圆环、年份和外部几何图形的连续变形被简化成几个独立状态。
- 图形轮廓保留了，步骤说明和图形之间的语义绑定较弱。

这条片段适合验证 `repeated_object_state`、`geometry_label_binding`、`continuous_path_morph` 和 `diagram_explanation_binding`。它与 R12 的文字转场、R14 的数据拓扑、R13 的 UI 状态切换属于不同视频类别，可以用于检查 seed 是否跨类别复现。
