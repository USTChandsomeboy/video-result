# R14：The Facebook Offering 数据可视化

## 选片理由

输入 seed 是 `topology_reveal` 和 `camera_content_binding`，类别是数据叙事 / 可视化。片段可以拆成坐标轴、气泡、标签、年份和图表状态，已裁掉浏览器外壳，避免把浏览器实拍因素当成 Remotion weakness。

来源：[The Facebook Offering Animation - Data Visualization and D3.js](https://www.youtube.com/watch?v=s7h2tH6z9Rg)。本地片段 15 秒，30fps、1280×720、450 帧。

## 当前复刻暴露的问题

- 气泡颜色分组和总体趋势可以复现，但小气泡数量、密度和邻域关系被近似。
- 气泡展开的终点、大小和出现时间没有完全由同一数据状态驱动。
- 参考的图表状态变化与页面说明、导航和大气泡焦点同步，复刻主要使用固定正面坐标。
- Facebook 重点气泡的放大能表达，但周围气泡的相对关系被简化。

这条片段适合继续验证“数据对象拓扑是否按结构展开”，而不是评价真实摄影或材质效果。
