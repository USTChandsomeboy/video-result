# R18：Marketing infographic data charts animation

## 选片理由

输入 seed 是 `value_proposition_layout`、`metric_label_binding` 和 `reveal_hierarchy`，类别是产品营销（定位）。片段把产品卖点、数字、环形图、柱状图和说明卡片放在同一个画面里，可以用 SVG、CSS 和文字重建，并且能直接检验卖点层级是否被保留。

来源：[Marketing infographic data charts animation](https://mixkit.co/free-stock-video/marketing-infographic-data-charts-animation-5404/)。本地片段为前 15 秒，24fps、1280×720、360 帧。

## 当前复刻暴露的问题

- 复刻能画出环形图、柱状图、数字和卡片，但主图被拆成多个小图，产品卖点层级变弱。
- 数字和对应图表各自循环，没有保持同一个指标的共同状态。
- 参考会改变整组构图的位置和比例，复刻主要固定面板，只改变局部进度。
- 参考最后收束到一个核心环形图，复刻仍保留多组重复图形，收尾重点不够明确。

这条片段适合验证 `value_proposition_layout`、`metric_label_binding`、`composition_state_transition` 和 `reveal_hierarchy`。
