# R16：Digital animation of screens

## 选片理由

输入 seed 是 `dense_layout_reveal`、`content_density_transition` 和 `camera_content_binding`，类别是品牌形象 / 数字视觉识别。视频由大量矩形屏幕、数字、色块、图表和故障条组成，可以用 CSS、SVG 和文字重建；难点来自多个局部面板的同步，而不是依赖真人或复杂材质。

来源：[Digital animation of screens](https://mixkit.co/free-stock-video/digital-animation-of-screens-4192/)。本地片段为前 12 秒，24fps、1280×720、288 帧。

## 当前复刻暴露的问题

- 复刻能做出相似的高密度黑底画面，但小屏幕被排成更规则的网格，原片的布局身份没有保持。
- 多个屏幕都在变化，但数字、图表、色条和故障条之间没有分别绑定到同一时间线。
- 原片通过局部内容变化改变整体密度，复刻主要靠颜色和重复图案变化。
- 整体布局几乎固定，局部内容和整体镜头节奏没有完全绑定。

这条片段适合验证 `dense_layout_reveal`、`multi_panel_state_sync`、`content_density_transition` 和 `camera_content_binding`。
