# R19：Animated stock market software UI with graphs

## 选片理由

输入 seed 是 `ui_state_content_binding`、`chart_update_causality` 和 `dashboard_identity`，类别是软件演示（用途）。片段包含股票 ticker、柱状图、世界地图、饼图、数据表和状态标签，能够用 React、SVG、CSS 和文字重建，适合检验同一数据是否同时驱动多个 UI 组件。

来源：[Animated stock market software UI with graphs](https://mixkit.co/free-stock-video/animated-stock-market-software-ui-with-graphs-5461/)。本地片段为前 15 秒，24fps、1280×720、360 帧。

## 当前复刻暴露的问题

- 复刻保留了 dashboard 的大结构，但部分面板从空状态开始，和参考的完整首屏不同。
- 柱状图能增长，但右侧数值、底部饼图和图表没有完全由同一数据状态驱动。
- 参考地图有具体地理轮廓和指标标记，复刻把它简化成抽象轮廓。
- ticker、柱状图、饼图和数字表格之间的共享数据关系没有完整保持。

这条片段适合验证 `ui_initial_state`、`chart_update_causality`、`dashboard_identity` 和 `cross_panel_data_binding`。
